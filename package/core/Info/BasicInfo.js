"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBasicInfo = _getBasicInfo;
const youtube_po_token_generator_1 = require("youtube-po-token-generator");
const clients_1 = require("../../core/clients");
const errors_1 = require("../../core/errors");
const Log_1 = require("../../utils/Log");
const Url_1 = __importDefault(require("../../utils/Url"));
const utils_1 = __importDefault(require("../../utils"));
const cache_1 = require("../../cache");
const Html5Player_1 = __importDefault(require("./parser/Html5Player"));
const WatchPage_1 = __importDefault(require("./parser/WatchPage"));
const Formats_1 = __importDefault(require("./parser/Formats"));
const Extras_1 = __importDefault(require("./Extras"));
/* Private Constants */
const AGE_RESTRICTED_URLS = ['support.google.com/youtube/?p=age_restrictions', 'youtube.com/t/community_guidelines'], CONTINUES_NOT_POSSIBLE_ERRORS = ['This video is private'], SUPPORTED_CLIENTS = ['web_creator', 'tv_embedded', 'ios', 'android', 'web', 'mweb', 'tv'], BASE_CLIENTS = ['web_creator', 'tv_embedded', 'ios', 'android'], BASIC_INFO_CACHE = new cache_1.Cache();
/* ----------- */
/* Private FUnctions */
function setupClients(clients) {
    if (clients && clients.length === 0) {
        Log_1.Logger.warning('At least one client must be specified.');
        clients = BASE_CLIENTS;
    }
    clients = clients.filter((client) => SUPPORTED_CLIENTS.includes(client));
    return [...new Set([...BASE_CLIENTS, ...clients])];
}
async function getSignatureTimestamp(html5player, options) {
    const BODY = await utils_1.default.request(html5player, options), MO = BODY.match(/signatureTimestamp:(\d+)/);
    return MO ? MO[1] : undefined;
}
async function _getBasicInfo(id, options, isFromGetInfo) {
    utils_1.default.applyIPv6Rotations(options);
    utils_1.default.applyDefaultHeaders(options);
    utils_1.default.applyDefaultAgent(options);
    utils_1.default.applyOldLocalAddress(options);
    options.requestOptions ??= {};
    const { jar, dispatcher } = options.agent || {};
    utils_1.default.setPropInsensitive(options.requestOptions?.headers, 'cookie', jar?.getCookieStringSync('https://www.youtube.com'));
    options.requestOptions.dispatcher ??= dispatcher;
    const HTML5_PLAYER_PROMISE = (0, Html5Player_1.default)(id, options), WATCH_PAGE_INFO_PROMISE = (0, WatchPage_1.default)(id, options);
    if (options.oauth2 && options.oauth2.shouldRefreshToken()) {
        Log_1.Logger.info('The specified OAuth2 token has expired and will be renewed automatically.');
        await options.oauth2.refreshAccessToken();
    }
    if (!options.poToken) {
        Log_1.Logger.warning('Specify poToken for stable and fast operation. See README for details.');
        Log_1.Logger.info('Automatically generates poToken, but stable operation cannot be guaranteed.');
        try {
            const { poToken, visitorData } = await (0, youtube_po_token_generator_1.generate)();
            options.poToken = poToken;
            options.visitorData = visitorData;
            Log_1.Logger.success('Successfully generated a poToken.');
        }
        catch (err) {
            Log_1.Logger.error('Failed to generate a poToken.');
        }
    }
    if (options.poToken && !options.visitorData) {
        Log_1.Logger.warning('If you specify a poToken, you must also specify the visitorData.');
    }
    options.clients = setupClients(options.clients || BASE_CLIENTS);
    const HTML5_PLAYER_URL = (await HTML5_PLAYER_PROMISE).playerUrl;
    if (!HTML5_PLAYER_URL) {
        throw new Error('Unable to find html5player file');
    }
    const SIGNATURE_TIMESTAMP = parseInt((await getSignatureTimestamp(HTML5_PLAYER_URL, options)) || ''), PLAYER_API_PARAMS = {
        videoId: id,
        signatureTimestamp: SIGNATURE_TIMESTAMP,
        options,
    }, PLAYER_API_PROMISE = {
        web_creator: clients_1.WebCreator.getPlayerResponse(PLAYER_API_PARAMS),
        tv_embedded: clients_1.TvEmbedded.getPlayerResponse(PLAYER_API_PARAMS),
        ios: clients_1.Ios.getPlayerResponse(PLAYER_API_PARAMS),
        android: clients_1.Android.getPlayerResponse(PLAYER_API_PARAMS),
        web: options.clients.includes('web') ? clients_1.Web.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
        mweb: options.clients.includes('mweb') ? clients_1.MWeb.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
        tv: options.clients.includes('tv') ? clients_1.Tv.getPlayerResponse(PLAYER_API_PARAMS) : Promise.resolve(null),
    }, PLAYER_FETCH_PROMISE = Promise.allSettled(Object.values(PLAYER_API_PROMISE)), WATCH_PAGE_INFO = await WATCH_PAGE_INFO_PROMISE, PLAYER_API_RESPONSES = await PLAYER_FETCH_PROMISE, PLAYER_RESPONSES = {}, PLAYER_RESPONSE_ARRAY = [], VIDEO_INFO = {
        _watchPageInfo: WATCH_PAGE_INFO,
        related_videos: [],
        videoDetails: {},
        formats: [],
        html5Player: null,
        clients: options.clients,
        full: false,
        isMinimumMode: false,
    };
    let errorDetails = null;
    options.clients.forEach((client, i) => {
        if (PLAYER_API_RESPONSES[i].status === 'fulfilled') {
            if (PLAYER_API_RESPONSES[i].value === null) {
                return;
            }
            const CONTENTS = PLAYER_API_RESPONSES[i].value?.contents;
            PLAYER_RESPONSES[client] = CONTENTS;
            PLAYER_RESPONSE_ARRAY.push(CONTENTS);
            Log_1.Logger.debug(`[ ${client} ]: Success`);
        }
        else {
            const REASON = PLAYER_API_RESPONSES[i].reason;
            console.log(REASON.error);
            Log_1.Logger.debug(`[ ${client} ]: Error\nReason: ${REASON.error.toString()}`);
            PLAYER_RESPONSES[client] = REASON.contents;
            if (client === 'ios') {
                errorDetails = REASON;
            }
        }
    });
    const IS_MINIMUM_MODE = PLAYER_API_RESPONSES.every((r) => r.status === 'rejected');
    if (IS_MINIMUM_MODE) {
        const ERROR_TEXT = `All player APIs responded with an error. (Clients: ${options.clients.join(', ')})\nFor more information, specify YTDL_DEBUG as an environment variable.`;
        if (errorDetails && (CONTINUES_NOT_POSSIBLE_ERRORS.includes(errorDetails.contents.playabilityStatus.reason) || !errorDetails.contents.videoDetails)) {
            throw new errors_1.UnrecoverableError(ERROR_TEXT + `\nNote: This error cannot continue processing. (Details: ${JSON.stringify(errorDetails.contents.playabilityStatus.reason)})`);
        }
        Log_1.Logger.error(ERROR_TEXT);
        Log_1.Logger.info('Only minimal information is available, as information from the Player API is not available.');
    }
    VIDEO_INFO.isMinimumMode = IS_MINIMUM_MODE;
    VIDEO_INFO.html5Player = HTML5_PLAYER_URL;
    if (isFromGetInfo) {
        VIDEO_INFO._playerResponses = PLAYER_RESPONSES;
    }
    if (!IS_MINIMUM_MODE) {
        /* Filtered */
        const INCLUDE_STORYBOARDS = PLAYER_RESPONSE_ARRAY.filter((p) => p.storyboards)[0], VIDEO_DETAILS = PLAYER_RESPONSE_ARRAY.filter((p) => p.videoDetails)[0]?.videoDetails || {}, MICROFORMAT = PLAYER_RESPONSE_ARRAY.filter((p) => p.microformat)[0]?.microformat || null;
        const STORYBOARDS = Extras_1.default.getStoryboards(INCLUDE_STORYBOARDS), MEDIA = Extras_1.default.getMedia(PLAYER_RESPONSES.web_creator) || Extras_1.default.getMedia(PLAYER_RESPONSES.tv_embedded) || Extras_1.default.getMedia(PLAYER_RESPONSES.ios) || Extras_1.default.getMedia(PLAYER_RESPONSES.android), AGE_RESTRICTED = !!MEDIA && AGE_RESTRICTED_URLS.some((url) => Object.values(MEDIA || {}).some((v) => typeof v === 'string' && v.includes(url))), ADDITIONAL_DATA = {
            video_url: Url_1.default.getWatchPageUrl(id),
            author: Extras_1.default.getAuthor(PLAYER_RESPONSES.web_creator) || Extras_1.default.getAuthor(PLAYER_RESPONSES.tv_embedded) || Extras_1.default.getAuthor(PLAYER_RESPONSES.ios) || Extras_1.default.getAuthor(PLAYER_RESPONSES.android),
            media: MEDIA,
            likes: Extras_1.default.getLikes(WATCH_PAGE_INFO),
            age_restricted: AGE_RESTRICTED,
            storyboards: STORYBOARDS,
            chapters: Extras_1.default.getChapters(WATCH_PAGE_INFO),
        };
        VIDEO_INFO.videoDetails = Extras_1.default.cleanVideoDetails(Object.assign({}, VIDEO_DETAILS, ADDITIONAL_DATA), MICROFORMAT);
    }
    else {
        VIDEO_INFO.videoDetails = Extras_1.default.cleanVideoDetails(errorDetails.contents.videoDetails, null);
    }
    VIDEO_INFO.related_videos = Extras_1.default.getRelatedVideos(WATCH_PAGE_INFO);
    VIDEO_INFO.formats = PLAYER_RESPONSE_ARRAY.reduce((items, playerResponse) => {
        return [...items, ...Formats_1.default.parseFormats(playerResponse)];
    }, []);
    return VIDEO_INFO;
}
async function getBasicInfo(link, options = {}) {
    utils_1.default.checkForUpdates();
    const ID = Url_1.default.getVideoID(link), CACHE_KEY = ['getBasicInfo', ID, options.lang].join('-');
    return BASIC_INFO_CACHE.getOrSet(CACHE_KEY, () => _getBasicInfo(ID, options));
}
exports.default = getBasicInfo;
//# sourceMappingURL=BasicInfo.js.map