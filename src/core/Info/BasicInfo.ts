enum CLIENTS_NUMBER {
    WEBCREATOR = 0,
    TVEMBEDDED = 1,
    IOS = 2,
    ANDROID = 3,
    WEB = 4,
    MWEB = 5,
    TV = 6,
}

import { YTDL_GetInfoOptions } from '@/types/Options';
import { YT_NextApiResponse, YT_PlayerApiResponse, YT_StreamingAdaptiveFormat } from '@/types/youtube';
import { YTDL_VideoDetailsAdditions, YTDL_VideoInfo } from '@/types/Ytdl';

import { WebCreator, TvEmbedded, Ios, Android, Web, MWeb, Tv } from '@/core/clients';
import { UnrecoverableError } from '@/core/errors';
import { Cache } from '@/core/Cache';
import PoToken from '@/core/PoToken';
import Fetcher from '@/core/Fetcher';

import { YTDL_ClientTypes } from '@/meta/Clients';

import { Logger } from '@/utils/Log';
import Url from '@/utils/Url';
import { VERSION } from '@/utils/constants';
import utils from '@/utils/Utils';
import DownloadOptionsUtils from '@/utils/DownloadOptions';

import getHtml5Player from './parser/Html5Player';
import Formats from './parser/Formats';
import InfoExtras from './Extras';

/* Private Constants */
const AGE_RESTRICTED_URLS = ['support.google.com/youtube/?p=age_restrictions', 'youtube.com/t/community_guidelines'],
    CONTINUES_NOT_POSSIBLE_ERRORS = ['This video is private'],
    SUPPORTED_CLIENTS = ['webCreator', 'tvEmbedded', 'ios', 'android', 'web', 'mweb', 'tv'],
    BASE_CLIENTS: Array<YTDL_ClientTypes> = ['web', 'webCreator', 'tvEmbedded', 'ios', 'android'],
    BASIC_INFO_CACHE = new Cache();

/* ----------- */

/* Private FUnctions */
function setupClients(clients: Array<YTDL_ClientTypes>, disableDefaultClients: boolean): Array<YTDL_ClientTypes> {
    if (clients && clients.length === 0) {
        Logger.warning('At least one client must be specified.');
        clients = BASE_CLIENTS;
    }

    clients = clients.filter((client) => SUPPORTED_CLIENTS.includes(client));

    if (disableDefaultClients) {
        return clients;
    }

    return [...new Set([...BASE_CLIENTS, ...clients])];
}

async function getSignatureTimestamp(html5player: string, options: YTDL_GetInfoOptions) {
    const BODY = await Fetcher.request<string>(html5player, options),
        MO = BODY.match(/signatureTimestamp:(\d+)/);

    return MO ? MO[1] : undefined;
}

/* ----------- */

/* Public Functions */

/** Gets info from a video without getting additional formats. */
type YTDL_PlayerResponses = {
    webCreator: YT_PlayerApiResponse | null;
    tvEmbedded: YT_PlayerApiResponse | null;
    ios: YT_PlayerApiResponse | null;
    android: YT_PlayerApiResponse | null;
    web: YT_PlayerApiResponse | null;
    mweb: YT_PlayerApiResponse | null;
    tv: YT_PlayerApiResponse | null;
};
async function _getBasicInfo(id: string, options: YTDL_GetInfoOptions, isFromGetInfo?: boolean): Promise<YTDL_VideoInfo> {
    DownloadOptionsUtils.applyIPv6Rotations(options);
    DownloadOptionsUtils.applyDefaultHeaders(options);
    DownloadOptionsUtils.applyDefaultAgent(options);
    DownloadOptionsUtils.applyOldLocalAddress(options);

    options.requestOptions ??= {};

    const { jar, dispatcher } = options.agent || {};

    utils.setPropInsensitive(options.requestOptions?.headers, 'cookie', jar?.getCookieStringSync('https://www.youtube.com'));
    options.requestOptions.dispatcher ??= dispatcher;

    const HTML5_PLAYER_PROMISE = getHtml5Player(id, options);

    if (options.oauth2 && options.oauth2.shouldRefreshToken()) {
        Logger.info('The specified OAuth2 token has expired and will be renewed automatically.');
        await options.oauth2.refreshAccessToken();
    }

    if (!options.poToken) {
        Logger.warning('Specify poToken for stable and fast operation. See README for details.');
        Logger.info('Automatically generates poToken, but stable operation cannot be guaranteed.');

        const { poToken, visitorData } = await PoToken.generatePoToken();
        options.poToken = poToken;
        options.visitorData = visitorData;
    }

    if (options.poToken && !options.visitorData) {
        Logger.warning('If you specify a poToken, you must also specify the visitorData.');
    }

    options.clients = setupClients(options.clients || BASE_CLIENTS, options.disableDefaultClients ?? false);

    const HTML5_PLAYER_URL = (await HTML5_PLAYER_PROMISE).playerUrl;

    if (!HTML5_PLAYER_URL) {
        throw new Error('Unable to find html5player file');
    }

    const SIGNATURE_TIMESTAMP = parseInt((await getSignatureTimestamp(HTML5_PLAYER_URL, options)) || ''),
        PLAYER_API_PARAMS = {
            videoId: id,
            signatureTimestamp: SIGNATURE_TIMESTAMP,
            options,
        },
        PLAYER_API_PROMISE = {
            webCreator: options.clients.includes('webCreator') ? WebCreator.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
            tvEmbedded: options.clients.includes('tvEmbedded') ? TvEmbedded.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
            ios: options.clients.includes('ios') ? Ios.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
            android: options.clients.includes('android') ? Android.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
            web: options.clients.includes('web') ? Web.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
            mweb: options.clients.includes('mweb') ? MWeb.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
            tv: options.clients.includes('tv') ? Tv.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
        },
        NEXT_API_PROMISE = Web.getNextResponse(PLAYER_API_PARAMS),
        PLAYER_API_RESPONSES = await Promise.allSettled(Object.values(PLAYER_API_PROMISE)),
        NEXT_API_RESPONSE = (await Promise.allSettled([NEXT_API_PROMISE]))[0],
        PLAYER_RESPONSES: YTDL_PlayerResponses = {} as any,
        PLAYER_RESPONSE_ARRAY: Array<YT_PlayerApiResponse> = [],
        NEXT_RESPONSES = {
            web: null,
        },
        VIDEO_INFO: YTDL_VideoInfo = {
            videoDetails: {},
            relatedVideos: [],
            formats: [],
            full: false,
            _metadata: {
                html5Player: null,
                clients: options.clients,
                isMinimumMode: false,
                id,
                options,
            },
            _ytdl: {
                version: VERSION,
            },
        } as any,
        checkResponse = (res: PromiseSettledResult<{ contents: YT_PlayerApiResponse | YT_NextApiResponse } | null>, client: YTDL_ClientTypes | 'next') => {
            if (res.status === 'fulfilled') {
                if (res.value === null) {
                    return;
                }

                const CONTENTS = res.value?.contents as any;
                if (client === 'next') {
                    NEXT_RESPONSES.web = CONTENTS;
                } else {
                    PLAYER_RESPONSES[client] = CONTENTS;
                    PLAYER_RESPONSE_ARRAY.push(CONTENTS);
                }

                Logger.debug(`[ ${client} ]: Success`);
            } else {
                const REASON = res.reason;
                Logger.debug(`[ ${client} ]: Error\nReason: ${REASON.error.message || REASON.error.toString()}`);

                if (client === 'next') {
                    NEXT_RESPONSES.web = REASON.contents;
                } else {
                    PLAYER_RESPONSES[client] = REASON.contents;
                }

                if (client === 'ios') {
                    errorDetails = REASON;
                }
            }
        };

    let errorDetails: any | null = null;

    options.clients.forEach((client) => {
        checkResponse(PLAYER_API_RESPONSES[CLIENTS_NUMBER[client.toUpperCase() as keyof typeof CLIENTS_NUMBER]], client);
    });

    if (NEXT_API_RESPONSE) {
        checkResponse(NEXT_API_RESPONSE, 'next');
    }

    const IS_MINIMUM_MODE = PLAYER_API_RESPONSES.every((r) => r.status === 'rejected');

    if (IS_MINIMUM_MODE) {
        const ERROR_TEXT = `All player APIs responded with an error. (Clients: ${options.clients.join(', ')})\nFor more information, specify YTDL_DEBUG as an environment variable.`;

        if (errorDetails && (CONTINUES_NOT_POSSIBLE_ERRORS.includes(errorDetails.contents.playabilityStatus.reason) || !errorDetails.contents.videoDetails)) {
            throw new UnrecoverableError(ERROR_TEXT + `\nNote: This error cannot continue processing. (Details: ${JSON.stringify(errorDetails.contents.playabilityStatus.reason)})`);
        }

        Logger.error(ERROR_TEXT);
        Logger.info('Only minimal information is available, as information from the Player API is not available.');
    }

    VIDEO_INFO._metadata.isMinimumMode = IS_MINIMUM_MODE;
    VIDEO_INFO._metadata.html5Player = HTML5_PLAYER_URL;

    if (options.includesPlayerAPIResponse) {
        VIDEO_INFO._playerApiResponses = PLAYER_RESPONSES;
    }

    if (options.includesNextAPIResponse) {
        VIDEO_INFO._nextApiResponses = NEXT_RESPONSES;
    }

    if (!IS_MINIMUM_MODE) {
        /* Filtered */
        const INCLUDE_STORYBOARDS = PLAYER_RESPONSE_ARRAY.filter((p) => p.storyboards)[0],
            VIDEO_DETAILS = (PLAYER_RESPONSE_ARRAY.filter((p) => p.videoDetails)[0]?.videoDetails as any) || {},
            MICROFORMAT = PLAYER_RESPONSE_ARRAY.filter((p) => p.microformat)[0]?.microformat || null;

        const STORYBOARDS = InfoExtras.getStoryboards(INCLUDE_STORYBOARDS),
            MEDIA = InfoExtras.getMedia(PLAYER_RESPONSES.webCreator) || InfoExtras.getMedia(PLAYER_RESPONSES.tvEmbedded) || InfoExtras.getMedia(PLAYER_RESPONSES.ios) || InfoExtras.getMedia(PLAYER_RESPONSES.android) || InfoExtras.getMedia(PLAYER_RESPONSES.web) || InfoExtras.getMedia(PLAYER_RESPONSES.mweb) || InfoExtras.getMedia(PLAYER_RESPONSES.tv),
            AGE_RESTRICTED = !!MEDIA && AGE_RESTRICTED_URLS.some((url) => Object.values(MEDIA || {}).some((v) => typeof v === 'string' && v.includes(url))),
            ADDITIONAL_DATA: YTDL_VideoDetailsAdditions = {
                videoUrl: Url.getWatchPageUrl(id),
                author: InfoExtras.getAuthor(NEXT_RESPONSES.web),
                media: MEDIA,
                likes: InfoExtras.getLikes(NEXT_RESPONSES.web),
                ageRestricted: AGE_RESTRICTED,
                storyboards: STORYBOARDS,
                chapters: InfoExtras.getChapters(NEXT_RESPONSES.web),
            };

        VIDEO_INFO.videoDetails = InfoExtras.cleanVideoDetails(Object.assign({}, VIDEO_DETAILS, ADDITIONAL_DATA), MICROFORMAT?.playerMicroformatRenderer || null);
    } else {
        VIDEO_INFO.videoDetails = InfoExtras.cleanVideoDetails(errorDetails.contents.videoDetails as any, null);
    }

    VIDEO_INFO.relatedVideos = options.includesRelatedVideo ? InfoExtras.getRelatedVideos(NEXT_RESPONSES.web, options.lang || 'en') : [];
    VIDEO_INFO.formats = isFromGetInfo ? PLAYER_RESPONSE_ARRAY.reduce((items: Array<YT_StreamingAdaptiveFormat>, playerResponse) => {
        return [...items, ...Formats.parseFormats(playerResponse)];
    }, []) as any : [];

    return VIDEO_INFO;
}

async function getBasicInfo(link: string, options: YTDL_GetInfoOptions = {}): Promise<YTDL_VideoInfo> {
    utils.checkForUpdates();
    const ID = Url.getVideoID(link),
        CACHE_KEY = ['getBasicInfo', ID, options.lang].join('-');

    return BASIC_INFO_CACHE.getOrSet(CACHE_KEY, () => _getBasicInfo(ID, options)) as Promise<YTDL_VideoInfo>;
}

export { _getBasicInfo };
export default getBasicInfo;
