import querystring from 'querystring';
import { parseTimestamp } from 'm3u8stream';

import { YTDL_Media, YTDL_Author, YTDL_WatchPageInfo, YTDL_RelatedVideo, YT_CompactVideoRenderer, YTDL_Storyboard, YTDL_Chapter, YTDL_VideoDetails, YTDL_MoreVideoDetails, YT_YTInitialPlayerResponse, YTDL_MicroformatRenderer } from '@/types/youtube';
import utils from '@/utils/Utils';
import Url from '@/utils/Url';

function getText(obj: any) {
    if (obj && obj.runs) {
        return obj.runs[0].text;
    } else if (obj) {
        return obj.simpleText;
    }

    return null;
}

function isVerified(badges: Array<any>) {
    const IS_FOUND_VERIFIED_BADGE = !!badges.find((b) => b.metadataBadgeRenderer.tooltip === 'Verified');

    return !!badges && IS_FOUND_VERIFIED_BADGE;
}

function parseRelatedVideo(details: YT_CompactVideoRenderer, rvsParams: Array<querystring.ParsedUrlQuery>): YTDL_RelatedVideo | null {
    if (!details) {
        return null;
    }

    try {
        const RVS_DETAILS = rvsParams.find((elem) => elem.id === details.videoId);
        let viewCount = getText(details.viewCountText),
            shortViewCount = getText(details.shortViewCountText);

        if (!/^\d/.test(shortViewCount)) {
            shortViewCount = (RVS_DETAILS && RVS_DETAILS.short_view_count_text) || '';
        }

        viewCount = (/^\d/.test(viewCount) ? viewCount : shortViewCount).split(' ')[0];

        const BROWSE_ENDPOINT = details.shortBylineText.runs[0].navigationEndpoint.browseEndpoint,
            CHANNEL_ID = BROWSE_ENDPOINT.browseId,
            NAME = getText(details.shortBylineText),
            USER = (BROWSE_ENDPOINT.canonicalBaseUrl || '').split('/').slice(-1)[0],
            VIDEO: YTDL_RelatedVideo = {
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
                        thumbnail.url = new URL(thumbnail.url, Url.getBaseUrl()).toString();
                        return thumbnail;
                    }),
                    verified: isVerified(details.ownerBadges || []),
                },
                short_view_count_text: shortViewCount.split(' ')[0],
                view_count: viewCount.replace(/,/g, ''),
                length_seconds: details.lengthText ? Math.floor(parseTimestamp(getText(details.lengthText)) / 1000) : rvsParams && ((rvsParams as any).length_seconds as number),
                thumbnails: details.thumbnail.thumbnails || [],
                richThumbnails: details.richThumbnail ? details.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails.thumbnails : [],
                isLive: !!(details.badges && details.badges.find((b) => b.metadataBadgeRenderer.label === 'LIVE NOW')),
            };

        utils.deprecate(VIDEO, 'author_thumbnail', VIDEO.author.thumbnails[0].url, 'relatedVideo.author_thumbnail', 'relatedVideo.author.thumbnails[0].url');
        utils.deprecate(VIDEO, 'video_thumbnail', VIDEO.thumbnails[0].url, 'relatedVideo.video_thumbnail', 'relatedVideo.thumbnails[0].url');
        return VIDEO;
    } catch (err) {
        return null;
    }
}

export default class InfoExtras {
    static getMedia(info: YT_YTInitialPlayerResponse): YTDL_Media | null {
        let media: YTDL_Media = {
                category: '',
                category_url: '',
                thumbnails: [],
            },
            microformat: YTDL_MicroformatRenderer | null = null;

        try {
            microformat = info.microformat.playerMicroformatRenderer || null;
        } catch (err) {}

        if (!microformat) {
            return null;
        }

        try {
            media.category = microformat.category;
            media.thumbnails = microformat.thumbnail.thumbnails || [];
        } catch (err) {}

        return media;
    }

    static getAuthor(info: YT_YTInitialPlayerResponse): YTDL_Author | null {
        let channelName: string | null = null,
            channelId: string | null = null,
            user: string | null = null,
            thumbnails: YTDL_Author['thumbnails'] = [],
            subscriberCount: number | null = null,
            verified = false,
            microformat: YTDL_MicroformatRenderer | null = null,
            endscreen: any | null = null;

        try {
            microformat = info.microformat.playerMicroformatRenderer || null;
            endscreen = info.endscreen.endscreenRenderer.elements.find((e) => e.endscreenElementRenderer.style === 'CHANNEL')?.endscreenElementRenderer;
        } catch (err) {}

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
        } catch (err) {}

        try {
            const AUTHOR: any = {
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
                utils.deprecate(AUTHOR, 'avatar', AUTHOR.thumbnails[0]?.url, 'author.thumbnails', 'author.thumbnails[0].url');
            }

            return AUTHOR;
        } catch (err) {
            return null;
        }
    }

    static getLikes(info: YTDL_WatchPageInfo): number | null {
        try {
            const CONTENTS = info.response.contents.twoColumnWatchNextResults.results.results.contents,
                VIDEO = CONTENTS.find((r) => r.videoPrimaryInfoRenderer),
                BUTTONS = VIDEO.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons as Array<any>,
                ACCESSIBILITY_TEXT = BUTTONS.find((b) => b.segmentedLikeDislikeButtonViewModel).segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel.toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel.buttonViewModel.accessibilityText;

            return parseInt(ACCESSIBILITY_TEXT.match(/[\d,.]+/)[0].replace(/\D+/g, ''));
        } catch (err) {
            return null;
        }
    }

    static getRelatedVideos(info: YTDL_WatchPageInfo): Array<YTDL_RelatedVideo> {
        let rvsParams: Array<querystring.ParsedUrlQuery> = [],
            secondaryResults = [];

        try {
            rvsParams = info.response.webWatchNextResponseExtensionData?.relatedVideoArgs.split(',').map((e) => querystring.parse(e)) || [];
        } catch (err) {}

        try {
            secondaryResults = info.response.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results;
        } catch (err) {}

        const VIDEOS: Array<YTDL_RelatedVideo> = [];

        for (const RESULT of secondaryResults) {
            const DETAILS = RESULT.compactVideoRenderer as YT_CompactVideoRenderer;

            if (DETAILS) {
                const VIDEO = parseRelatedVideo(DETAILS, rvsParams);
                if (VIDEO) {
                    VIDEOS.push(VIDEO);
                }
            } else {
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

    static cleanVideoDetails(videoDetails: YTDL_VideoDetails, microformat: YT_YTInitialPlayerResponse['microformat'] | null): YTDL_MoreVideoDetails {
        const DETAILS = videoDetails as any;

        if (DETAILS.thumbnail) {
            DETAILS.thumbnails = DETAILS.thumbnail.thumbnails;
            delete DETAILS.thumbnail;
            utils.deprecate(DETAILS, 'thumbnail', { thumbnails: DETAILS.thumbnails }, 'DETAILS.thumbnail.thumbnails', 'DETAILS.thumbnails');
        }

        const DESCRIPTION = DETAILS.shortDescription || getText(DETAILS.description);
        if (DESCRIPTION) {
            DETAILS.description = DESCRIPTION;
            delete DETAILS.shortDescription;
            utils.deprecate(DETAILS, 'shortDescription', DETAILS.description, 'DETAILS.shortDescription', 'DETAILS.description');
        }

        if (microformat) {
            // Use more reliable `lengthSeconds` from `playerMicroformatRenderer`.
            DETAILS.lengthSeconds = microformat.playerMicroformatRenderer.lengthSeconds || videoDetails.lengthSeconds;
        }

        return DETAILS;
    }

    static getStoryboards(info: YT_YTInitialPlayerResponse | null): Array<YTDL_Storyboard> {
        if (!info) {
            return [];
        }

        const PARTS = info.storyboards && info.storyboards.playerStoryboardSpecRenderer && info.storyboards.playerStoryboardSpecRenderer.spec && info.storyboards.playerStoryboardSpecRenderer.spec.split('|');

        if (!PARTS) {
            return [];
        }

        const _URL = new URL(PARTS.shift() || '');

        return PARTS.map((part, i) => {
            let [thumbnailWidth, thumbnailHeight, thumbnailCount, columns, rows, interval, nameReplacement, sigh]: Array<any> = part.split('#');

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

    static getChapters(info: YTDL_WatchPageInfo): Array<YTDL_Chapter> {
        const PLAYER_OVERLAY_RENDERER = info.response && info.response.playerOverlays && info.response.playerOverlays.playerOverlayRenderer,
            PLAYER_BAR = PLAYER_OVERLAY_RENDERER && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar,
            MARKERS_MAP = PLAYER_BAR && PLAYER_BAR.multiMarkersPlayerBarRenderer && PLAYER_BAR.multiMarkersPlayerBarRenderer.markersMap,
            MARKER = Array.isArray(MARKERS_MAP) && MARKERS_MAP.find((m) => m.value && Array.isArray(m.value.chapters));

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
