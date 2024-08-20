import querystring from 'querystring';
import { parseTimestamp } from 'm3u8stream';

import utils from './utils';
import { YTDL_Media, YTDL_Author, YTDL_WatchPageInfo, YTDL_Thumbnail, YTDL_RelatedVideo, YT_CompactVideoRenderer, YTDL_Storyboard, YTDL_Chapter, YTDL_VideoDetails, YTDL_MoreVideoDetails, YT_YTInitialPlayerResponse } from '@/types/youtube';

/* Private Constants */
const BASE_URL = 'https://www.youtube.com/watch?v=',
    TITLE_TO_CATEGORY: Record<string, { name: string; url: string }> = {
        song: { name: 'Music', url: 'https://music.youtube.com/' },
    };

/* Private Functions */
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
                        thumbnail.url = new URL(thumbnail.url, BASE_URL).toString();
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

/* Public Functions */

/** Get video media. [Note]: Media cannot be obtained for several reasons. */
function getMedia(info: YTDL_WatchPageInfo): YTDL_Media | null {
    let media: YTDL_Media = {
            category: '',
            category_url: '',
            thumbnails: [],
        },
        results = [];

    try {
        results = info.response.contents.twoColumnWatchNextResults.results.results.contents;
    } catch (err) {}

    let videoSecondaryInfoRenderer = results.find((v) => v.videoSecondaryInfoRenderer);
    if (!videoSecondaryInfoRenderer) {
        return null;
    }

    try {
        const METADATA_ROWS = (videoSecondaryInfoRenderer.metadataRowContainer || videoSecondaryInfoRenderer.videoSecondaryInfoRenderer.metadataRowContainer).metadataRowContainerRenderer.rows;

        for (const ROW of METADATA_ROWS) {
            const ROW_RENDERER = ROW.metadataRowRenderer,
                RICH_ROW_RENDERER = ROW.richMetadataRowRenderer;

            if (ROW_RENDERER) {
                const TITLE = getText(ROW.metadataRowRenderer.title).toLowerCase(),
                    CONTENTS = ROW_RENDERER.contents[0];

                media[TITLE] = getText(CONTENTS);

                const RUNS = CONTENTS.runs;
                if (RUNS && RUNS[0].navigationEndpoint) {
                    media[`${TITLE}_url`] = new URL(RUNS[0].navigationEndpoint.commandMetadata.webCommandMetadata.url, BASE_URL).toString();
                }

                if (TITLE in TITLE_TO_CATEGORY) {
                    media.category = TITLE_TO_CATEGORY[TITLE].name;
                    media.category_url = TITLE_TO_CATEGORY[TITLE].url;
                }
            } else if (RICH_ROW_RENDERER) {
                const CONTENTS = RICH_ROW_RENDERER.contents as Array<any>,
                    BOX_ART = CONTENTS.filter((meta) => meta.richMetadataRenderer.style === 'RICH_METADATA_RENDERER_STYLE_BOX_ART');

                for (const { richMetadataRenderer } of BOX_ART) {
                    const META = richMetadataRenderer;
                    media.year = getText(META.subtitle);

                    const TYPE = getText(META.callToAction).split(' ')[1];
                    media[TYPE] = getText(META.title);
                    media[`${TYPE}_url`] = new URL(META.endpoint.commandMetadata.webCommandMetadata.url, BASE_URL).toString();
                    media.thumbnails = META.thumbnail.thumbnails;
                }

                const TOPIC = CONTENTS.filter((meta) => meta.richMetadataRenderer.style === 'RICH_METADATA_RENDERER_STYLE_TOPIC');
                for (const { richMetadataRenderer } of TOPIC) {
                    const META = richMetadataRenderer;
                    media.category = getText(META.title);
                    media.category_url = new URL(META.endpoint.commandMetadata.webCommandMetadata.url, BASE_URL).toString();
                }
            }
        }
    } catch (err) {}

    return media;
}

function getAuthor(info: YTDL_WatchPageInfo): YTDL_Author | null {
    let channelName: string | null = null,
        channelId: string | null = null,
        user: string | null = null,
        thumbnails: YTDL_Author['thumbnails'] = [],
        subscriberCount: number | null = null,
        verified = false;

    try {
        const TWO_COLUMN_WATCH_NEXT_RESULTS = info.response.contents.twoColumnWatchNextResults.results.results.contents,
            SECONDARY_INFO_RENDERER = TWO_COLUMN_WATCH_NEXT_RESULTS.find((v) => v.videoSecondaryInfoRenderer && v.videoSecondaryInfoRenderer.owner && v.videoSecondaryInfoRenderer.owner.videoOwnerRenderer),
            VIDEO_OWNER_RENDERER = SECONDARY_INFO_RENDERER.videoSecondaryInfoRenderer.owner.videoOwnerRenderer;

        channelName = VIDEO_OWNER_RENDERER.title.runs[0].text || null;
        channelId = VIDEO_OWNER_RENDERER.navigationEndpoint.browseEndpoint.browseId;
        user = (VIDEO_OWNER_RENDERER?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl || VIDEO_OWNER_RENDERER.navigationEndpoint.commandMetadata.webCommandMetadata.url).replace('/', '');
        thumbnails = VIDEO_OWNER_RENDERER.thumbnail.thumbnails.map((thumbnail: YTDL_Thumbnail) => {
            thumbnail.url = new URL(thumbnail.url, BASE_URL).toString();
            return thumbnail;
        });
        subscriberCount = utils.parseAbbreviatedNumber(getText(VIDEO_OWNER_RENDERER.subscriberCountText));
        verified = isVerified(VIDEO_OWNER_RENDERER.badges);
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

function getRelatedVideos(info: YTDL_WatchPageInfo): Array<YTDL_RelatedVideo> {
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

function getLikes(info: YTDL_WatchPageInfo): number | null {
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

function cleanVideoDetails(videoDetails: YTDL_VideoDetails /* info: YTDL_WatchPageInfo */): YTDL_MoreVideoDetails {
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

    // Use more reliable `lengthSeconds` from `playerMicroformatRenderer`.
    /* DETAILS.lengthSeconds = (info.player_response.microformat && info.player_response.microformat.playerMicroformatRenderer.lengthSeconds) || info.player_response.videoDetails.lengthSeconds; */

    return DETAILS;
}

function getStoryboards(info: YT_YTInitialPlayerResponse | null): Array<YTDL_Storyboard> {
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

function getChapters(info: YTDL_WatchPageInfo): Array<YTDL_Chapter> {
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

export { getMedia, getAuthor, getRelatedVideos, getLikes, cleanVideoDetails, getStoryboards, getChapters };
export default { getMedia, getAuthor, getRelatedVideos, getLikes, cleanVideoDetails, getStoryboards, getChapters };
