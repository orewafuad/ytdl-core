"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
const m3u8stream_1 = require("m3u8stream");
const utils_1 = __importDefault(require("../../utils"));
const Url_1 = __importDefault(require("../../utils/Url"));
function getText(obj) {
    if (obj && obj.runs) {
        return obj.runs[0].text;
    }
    else if (obj) {
        return obj.simpleText;
    }
    return null;
}
function isVerified(badges) {
    const IS_FOUND_VERIFIED_BADGE = !!badges.find((b) => b.metadataBadgeRenderer.tooltip === 'Verified');
    return !!badges && IS_FOUND_VERIFIED_BADGE;
}
function parseRelatedVideo(details, rvsParams) {
    if (!details) {
        return null;
    }
    try {
        const RVS_DETAILS = rvsParams.find((elem) => elem.id === details.videoId);
        let viewCount = getText(details.viewCountText), shortViewCount = getText(details.shortViewCountText);
        if (!/^\d/.test(shortViewCount)) {
            shortViewCount = (RVS_DETAILS && RVS_DETAILS.short_view_count_text) || '';
        }
        viewCount = (/^\d/.test(viewCount) ? viewCount : shortViewCount).split(' ')[0];
        const BROWSE_ENDPOINT = details.shortBylineText.runs[0].navigationEndpoint.browseEndpoint, CHANNEL_ID = BROWSE_ENDPOINT.browseId, NAME = getText(details.shortBylineText), USER = (BROWSE_ENDPOINT.canonicalBaseUrl || '').split('/').slice(-1)[0], VIDEO = {
            id: details.videoId,
            title: getText(details.title),
            published: getText(details.publishedTimeText),
            author: {
                id: CHANNEL_ID,
                name: NAME,
                user: USER,
                channel_url: `https://www.youtube.com/channel/${CHANNEL_ID}`,
                user_url: `https://www.youtube.com/user/${USER}`,
                thumbnails: details.channelThumbnail.thumbnails.map((thumbnail) => {
                    thumbnail.url = new URL(thumbnail.url, Url_1.default.getBaseUrl()).toString();
                    return thumbnail;
                }),
                verified: isVerified(details.ownerBadges || []),
            },
            short_view_count_text: shortViewCount.split(' ')[0],
            view_count: viewCount.replace(/,/g, ''),
            length_seconds: details.lengthText ? Math.floor((0, m3u8stream_1.parseTimestamp)(getText(details.lengthText)) / 1000) : rvsParams && rvsParams.length_seconds,
            thumbnails: details.thumbnail.thumbnails || [],
            richThumbnails: details.richThumbnail ? details.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails.thumbnails : [],
            isLive: !!(details.badges && details.badges.find((b) => b.metadataBadgeRenderer.label === 'LIVE NOW')),
        };
        utils_1.default.deprecate(VIDEO, 'author_thumbnail', VIDEO.author.thumbnails[0].url, 'relatedVideo.author_thumbnail', 'relatedVideo.author.thumbnails[0].url');
        utils_1.default.deprecate(VIDEO, 'video_thumbnail', VIDEO.thumbnails[0].url, 'relatedVideo.video_thumbnail', 'relatedVideo.thumbnails[0].url');
        return VIDEO;
    }
    catch (err) {
        return null;
    }
}
class InfoExtras {
    static getMedia(info) {
        let media = {
            category: '',
            category_url: '',
            thumbnails: [],
        }, microformat = null;
        try {
            microformat = info.microformat.playerMicroformatRenderer || null;
        }
        catch (err) { }
        if (!microformat) {
            return null;
        }
        try {
            media.category = microformat.category;
            media.thumbnails = microformat.thumbnail.thumbnails || [];
        }
        catch (err) { }
        return media;
    }
    static getAuthor(info) {
        let channelName = null, channelId = null, user = null, thumbnails = [], subscriberCount = null, verified = false, microformat = null, endscreen = null;
        try {
            microformat = info.microformat.playerMicroformatRenderer || null;
            endscreen = info.endscreen.endscreenRenderer.elements.find((e) => e.endscreenElementRenderer.style === 'CHANNEL')?.endscreenElementRenderer;
        }
        catch (err) { }
        if (!microformat) {
            return null;
        }
        try {
            channelName = microformat.ownerChannelName || null;
            channelId = microformat.externalChannelId;
            user = '@' + (microformat.ownerProfileUrl || '').split('@')[1];
            thumbnails = endscreen.image.thumbnails || [];
            subscriberCount = null;
            verified = false;
        }
        catch (err) { }
        try {
            const AUTHOR = {
                id: channelId,
                name: channelName,
                user,
                channel_url: channelId ? `https://www.youtube.com/channel/${channelId}` : '',
                external_channel_url: channelId ? `https://www.youtube.com/channel/${channelId}` : '',
                user_url: 'https://www.youtube.com/' + user,
                thumbnails,
                subscriber_count: subscriberCount,
                verified,
            };
            if (thumbnails?.length) {
                utils_1.default.deprecate(AUTHOR, 'avatar', AUTHOR.thumbnails[0]?.url, 'author.thumbnails', 'author.thumbnails[0].url');
            }
            return AUTHOR;
        }
        catch (err) {
            return null;
        }
    }
    static getLikes(info) {
        try {
            const CONTENTS = info.response.contents.twoColumnWatchNextResults.results.results.contents, VIDEO = CONTENTS.find((r) => r.videoPrimaryInfoRenderer), BUTTONS = VIDEO.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons, ACCESSIBILITY_TEXT = BUTTONS.find((b) => b.segmentedLikeDislikeButtonViewModel).segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel.toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel.buttonViewModel.accessibilityText;
            return parseInt(ACCESSIBILITY_TEXT.match(/[\d,.]+/)[0].replace(/\D+/g, ''));
        }
        catch (err) {
            return null;
        }
    }
    static getRelatedVideos(info) {
        let rvsParams = [], secondaryResults = [];
        try {
            rvsParams = info.response.webWatchNextResponseExtensionData?.relatedVideoArgs.split(',').map((e) => querystring_1.default.parse(e)) || [];
        }
        catch (err) { }
        try {
            secondaryResults = info.response.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results;
        }
        catch (err) { }
        const VIDEOS = [];
        for (const RESULT of secondaryResults) {
            const DETAILS = RESULT.compactVideoRenderer;
            if (DETAILS) {
                const VIDEO = parseRelatedVideo(DETAILS, rvsParams);
                if (VIDEO) {
                    VIDEOS.push(VIDEO);
                }
            }
            else {
                const AUTOPLAY = RESULT.compactAutoplayRenderer || RESULT.itemSectionRenderer;
                if (!AUTOPLAY || !Array.isArray(AUTOPLAY.contents)) {
                    continue;
                }
                for (const CONTENT of AUTOPLAY.contents) {
                    const VIDEO = parseRelatedVideo(CONTENT.compactVideoRenderer, rvsParams);
                    if (VIDEO) {
                        VIDEOS.push(VIDEO);
                    }
                }
            }
        }
        return VIDEOS;
    }
    static cleanVideoDetails(videoDetails, microformat) {
        const DETAILS = videoDetails;
        if (DETAILS.thumbnail) {
            DETAILS.thumbnails = DETAILS.thumbnail.thumbnails;
            delete DETAILS.thumbnail;
            utils_1.default.deprecate(DETAILS, 'thumbnail', { thumbnails: DETAILS.thumbnails }, 'DETAILS.thumbnail.thumbnails', 'DETAILS.thumbnails');
        }
        const DESCRIPTION = DETAILS.shortDescription || getText(DETAILS.description);
        if (DESCRIPTION) {
            DETAILS.description = DESCRIPTION;
            delete DETAILS.shortDescription;
            utils_1.default.deprecate(DETAILS, 'shortDescription', DETAILS.description, 'DETAILS.shortDescription', 'DETAILS.description');
        }
        if (microformat) {
            // Use more reliable `lengthSeconds` from `playerMicroformatRenderer`.
            DETAILS.lengthSeconds = microformat.playerMicroformatRenderer.lengthSeconds || videoDetails.lengthSeconds;
        }
        return DETAILS;
    }
    static getStoryboards(info) {
        if (!info) {
            return [];
        }
        const PARTS = info.storyboards && info.storyboards.playerStoryboardSpecRenderer && info.storyboards.playerStoryboardSpecRenderer.spec && info.storyboards.playerStoryboardSpecRenderer.spec.split('|');
        if (!PARTS) {
            return [];
        }
        const _URL = new URL(PARTS.shift() || '');
        return PARTS.map((part, i) => {
            let [thumbnailWidth, thumbnailHeight, thumbnailCount, columns, rows, interval, nameReplacement, sigh] = part.split('#');
            _URL.searchParams.set('sigh', sigh);
            thumbnailCount = parseInt(thumbnailCount, 10);
            columns = parseInt(columns, 10);
            rows = parseInt(rows, 10);
            const STORYBOARD_COUNT = Math.ceil(thumbnailCount / (columns * rows));
            return {
                templateUrl: _URL.toString().replace('$L', i.toString()).replace('$N', nameReplacement),
                thumbnailWidth: parseInt(thumbnailWidth, 10),
                thumbnailHeight: parseInt(thumbnailHeight, 10),
                thumbnailCount,
                interval: parseInt(interval, 10),
                columns,
                rows,
                storyboardCount: STORYBOARD_COUNT,
            };
        });
    }
    static getChapters(info) {
        const PLAYER_OVERLAY_RENDERER = info.response && info.response.playerOverlays && info.response.playerOverlays.playerOverlayRenderer, PLAYER_BAR = PLAYER_OVERLAY_RENDERER && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar, MARKERS_MAP = PLAYER_BAR && PLAYER_BAR.multiMarkersPlayerBarRenderer && PLAYER_BAR.multiMarkersPlayerBarRenderer.markersMap, MARKER = Array.isArray(MARKERS_MAP) && MARKERS_MAP.find((m) => m.value && Array.isArray(m.value.chapters));
        if (!MARKER) {
            return [];
        }
        const CHAPTERS = MARKER.value.chapters;
        return CHAPTERS.map((chapter) => {
            return {
                title: getText(chapter.chapterRenderer.title),
                start_time: chapter.chapterRenderer.timeRangeStartMillis / 1000,
            };
        });
    }
}
exports.default = InfoExtras;
//# sourceMappingURL=Extras.js.map