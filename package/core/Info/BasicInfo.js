"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBasicInfo = _getBasicInfo;
exports.getBasicInfo = getBasicInfo;
const OAuth2_1 = require("../../core/OAuth2");
const Platform_1 = require("../../platforms/Platform");
const Log_1 = require("../../utils/Log");
const Utils_1 = __importDefault(require("../../utils/Utils"));
const Url_1 = require("../../utils/Url");
const Html5Player_1 = require("./parser/Html5Player");
const Formats_1 = require("./parser/Formats");
const Player_1 = __importDefault(require("./apis/Player"));
const Next_1 = __importDefault(require("./apis/Next"));
const Extras_1 = __importDefault(require("./Extras"));
/* Private Constants */
const AGE_RESTRICTED_URLS = ['support.google.com/youtube/?p=age_restrictions', 'youtube.com/t/community_guidelines'], SUPPORTED_CLIENTS = ['web', 'webCreator', 'webEmbedded', 'ios', 'android', 'mweb', 'tv', 'tvEmbedded'], BASE_CLIENTS = ['web', 'webCreator', 'tvEmbedded', 'ios', 'android'], _SHIM = Platform_1.Platform.getShim(), CACHE = _SHIM.cache, BASE_INFO = {
    videoDetails: {
        videoUrl: '',
        videoId: '',
        title: '',
        author: null,
        lengthSeconds: 0,
        viewCount: 0,
        likes: null,
        media: null,
        storyboards: [],
        chapters: [],
        thumbnails: [],
        description: null,
        keywords: [],
        channelId: '',
        ageRestricted: false,
        allowRatings: false,
        isOwnerViewing: false,
        isCrawlable: false,
        isPrivate: false,
        isUnpluggedCorpus: false,
        isLiveContent: false,
        isUpcoming: false,
        liveBroadcastDetails: {
            isLiveNow: false,
            startTimestamp: '',
        },
        published: null,
        publishDate: null,
    },
    relatedVideos: [],
    formats: [],
    full: false,
    _metadata: {
        isMinimumMode: false,
        clients: [],
        html5Player: '',
        id: '',
        options: {},
    },
    _ytdl: {
        version: _SHIM.info.version,
    },
}, BASE_INFO_STRING = JSON.stringify(BASE_INFO);
/* ----------- */
/* Private Functions */
function setupClients(clients, disableDefaultClients) {
    if (clients && clients.length === 0) {
        Log_1.Logger.warning('At least one client must be specified.');
        clients = BASE_CLIENTS;
    }
    clients = clients.filter((client) => SUPPORTED_CLIENTS.includes(client));
    if (disableDefaultClients) {
        return clients;
    }
    return [...new Set([...BASE_CLIENTS, ...clients])];
}
/* ----------- */
async function _getBasicInfo(id, options, isFromGetInfo) {
    const SHIM = Platform_1.Platform.getShim(), HTML5_PLAYER_PROMISE = (0, Html5Player_1.getHtml5Player)(options);
    if (options.oauth2 && options.oauth2 instanceof OAuth2_1.OAuth2 && options.oauth2.shouldRefreshToken()) {
        Log_1.Logger.info('The specified OAuth2 token has expired and will be renewed automatically.');
        await options.oauth2.refreshAccessToken();
    }
    if (!options.poToken && !options.disablePoTokenAutoGeneration) {
        /* The logging is being stopped due to the inability to automatically generate a normal PoToken at this time. */
        /* Logger.warning('Specify poToken for stable and fast operation. See README for details.');
        Logger.info('Automatically generates poToken, but stable operation cannot be guaranteed.'); */
        const { poToken, visitorData } = await SHIM.poToken();
        options.poToken = poToken;
        options.visitorData = visitorData;
    }
    if (options.poToken && !options.visitorData) {
        Log_1.Logger.warning('If you specify a poToken, you must also specify the visitorData.');
    }
    options.clients = setupClients(options.clients || BASE_CLIENTS, options.disableDefaultClients ?? false);
    const HTML5_PLAYER_RESPONSE = await HTML5_PLAYER_PROMISE, HTML5_PLAYER_URL = HTML5_PLAYER_RESPONSE.playerUrl;
    if (!HTML5_PLAYER_URL) {
        throw new Error(`HTML5Player was not found, please report it via Issues (${SHIM.info.issuesUrl}).`);
    }
    /* Initialization */
    const SIGNATURE_TIMESTAMP = parseInt(HTML5_PLAYER_RESPONSE.signatureTimestamp || '0') || 0, PLAYER_API_PARAMS = {
        videoId: id,
        signatureTimestamp: SIGNATURE_TIMESTAMP,
        options,
    }, VIDEO_INFO = JSON.parse(BASE_INFO_STRING);
    /* Request */
    const PROMISES = {
        playerApiRequest: Player_1.default.getApiResponses(PLAYER_API_PARAMS, options.clients),
        nextApiRequest: Next_1.default.getApiResponses(PLAYER_API_PARAMS),
    }, { isMinimalMode, responses: PLAYER_RESPONSES } = await PROMISES.playerApiRequest, NEXT_RESPONSES = await PROMISES.nextApiRequest, PLAYER_RESPONSE_LIST = Object.values(PLAYER_RESPONSES) || [];
    VIDEO_INFO._metadata.isMinimumMode = isMinimalMode;
    VIDEO_INFO._metadata.html5Player = HTML5_PLAYER_URL;
    VIDEO_INFO._metadata.clients = options.clients;
    VIDEO_INFO._metadata.options = options;
    VIDEO_INFO._metadata.id = id;
    if (options.includesPlayerAPIResponse || isFromGetInfo) {
        VIDEO_INFO._playerApiResponses = PLAYER_RESPONSES;
    }
    if (options.includesNextAPIResponse || isFromGetInfo) {
        VIDEO_INFO._nextApiResponses = NEXT_RESPONSES;
    }
    /** Filter out null values */
    const INCLUDE_STORYBOARDS = PLAYER_RESPONSE_LIST.filter((p) => p?.storyboards)[0], VIDEO_DETAILS = PLAYER_RESPONSE_LIST.filter((p) => p?.videoDetails)[0]?.videoDetails || {}, MICROFORMAT = PLAYER_RESPONSE_LIST.filter((p) => p?.microformat)[0]?.microformat || null, LIVE_BROADCAST_DETAILS = PLAYER_RESPONSES.web?.microformat?.playerMicroformatRenderer.liveBroadcastDetails || null;
    /* Data Processing */
    const STORYBOARDS = Extras_1.default.getStoryboards(INCLUDE_STORYBOARDS), MEDIA = Extras_1.default.getMedia(PLAYER_RESPONSES.web) || Extras_1.default.getMedia(PLAYER_RESPONSES.webCreator) || Extras_1.default.getMedia(PLAYER_RESPONSES.ios) || Extras_1.default.getMedia(PLAYER_RESPONSES.android) || Extras_1.default.getMedia(PLAYER_RESPONSES.webEmbedded) || Extras_1.default.getMedia(PLAYER_RESPONSES.tvEmbedded) || Extras_1.default.getMedia(PLAYER_RESPONSES.mweb) || Extras_1.default.getMedia(PLAYER_RESPONSES.tv), AGE_RESTRICTED = !!MEDIA && AGE_RESTRICTED_URLS.some((url) => Object.values(MEDIA || {}).some((v) => typeof v === 'string' && v.includes(url))), ADDITIONAL_DATA = {
        videoUrl: Url_1.Url.getWatchPageUrl(id),
        author: Extras_1.default.getAuthor(NEXT_RESPONSES.web),
        media: MEDIA,
        likes: Extras_1.default.getLikes(NEXT_RESPONSES.web),
        ageRestricted: AGE_RESTRICTED,
        storyboards: STORYBOARDS,
        chapters: Extras_1.default.getChapters(NEXT_RESPONSES.web),
        thumbnails: [],
        description: '',
    }, FORMATS = PLAYER_RESPONSE_LIST.reduce((items, playerResponse) => {
        return [...items, ...Formats_1.FormatParser.parseFormats(playerResponse)];
    }, []);
    VIDEO_INFO.videoDetails = Extras_1.default.cleanVideoDetails(Object.assign(VIDEO_INFO.videoDetails, VIDEO_DETAILS, ADDITIONAL_DATA), MICROFORMAT?.playerMicroformatRenderer || null, options.hl);
    VIDEO_INFO.videoDetails.liveBroadcastDetails = LIVE_BROADCAST_DETAILS;
    VIDEO_INFO.relatedVideos = options.includesRelatedVideo ? Extras_1.default.getRelatedVideos(NEXT_RESPONSES.web, options.hl || 'en') : [];
    VIDEO_INFO.formats = isFromGetInfo ? FORMATS : [];
    return VIDEO_INFO;
}
async function getBasicInfo(link, options) {
    Utils_1.default.checkForUpdates();
    const ID = Url_1.Url.getVideoID(link) || (Url_1.Url.validateID(link) ? link : null);
    if (!ID) {
        throw new Error('The URL specified is not a valid URL.');
    }
    const CACHE_KEY = ['getBasicInfo', ID, options.hl, options.gl].join('-');
    if (await CACHE.has(CACHE_KEY)) {
        return CACHE.get(CACHE_KEY);
    }
    try {
        const RESULTS = await _getBasicInfo(ID, options, false);
        CACHE.set(CACHE_KEY, RESULTS, {
            ttl: 60 * 30, //30Min
        });
        return RESULTS;
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=BasicInfo.js.map