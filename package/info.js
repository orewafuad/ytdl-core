"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoID = exports.getURLVideoID = exports.validateURL = exports.validateID = exports.WATCH_PAGE_CACHE = exports.CACHE = void 0;
exports.getBasicInfo = getBasicInfo;
exports.getInfo = getInfo;
const sax_1 = __importDefault(require("sax"));
const timers_1 = require("timers");
const utils_1 = __importDefault(require("./utils"));
const format_utils_1 = __importDefault(require("./format-utils"));
const url_utils_1 = __importDefault(require("./url-utils"));
const info_extras_1 = __importDefault(require("./info-extras"));
const cache_1 = require("./cache");
const sig_1 = __importDefault(require("./sig"));
/* Private Constants */
const BASE_URL = 'https://www.youtube.com/watch?v=', BASE_EMBED_URL = 'https://www.youtube.com/embed/', AGE_RESTRICTED_URLS = ['support.google.com/youtube/?p=age_restrictions', 'youtube.com/t/community_guidelines'], JSON_CLOSING_CHARS = /^[)\]}'\s]+/;
/* Get Info */
const IOS_CLIENT_VERSION = '19.28.1', IOS_DEVICE_MODEL = 'iPhone16,2', IOS_USER_AGENT_VERSION = '17_5_1', IOS_OS_VERSION = '17.5.1.21F90', ANDROID_CLIENT_VERSION = '19.30.36', ANDROID_OS_VERSION = '14', ANDROID_SDK_VERSION = '34';
/* ----------- */
/* Private Classes */
class PlayerRequestError extends Error {
    response;
    constructor(message) {
        super(message);
        this.response = null;
    }
}
async function retryFunc(func, args, options) {
    let currentTry = 0, result = null;
    options.maxRetries ??= 3;
    options.backoff ??= {
        inc: 500,
        max: 5000,
    };
    while (currentTry <= options.maxRetries) {
        try {
            result = await func(...args);
            break;
        }
        catch (err) {
            if ((err && err?.statusCode < 500) || currentTry >= options.maxRetries) {
                throw err;
            }
            let wait = Math.min(++currentTry * options.backoff.inc, options.backoff.max);
            await new Promise((resolve) => (0, timers_1.setTimeout)(resolve, wait));
        }
    }
    return result;
}
function parseJSON(source, varName, json) {
    if (!json || typeof json === 'object') {
        return json;
    }
    else {
        try {
            json = json.replace(JSON_CLOSING_CHARS, '');
            return JSON.parse(json);
        }
        catch (err) {
            throw Error(`Error parsing ${varName} in ${source}: ${err.message}`);
        }
    }
}
function findJSON(source, varName, body, left, right, prependJSON) {
    const JSON_STR = utils_1.default.between(body, left, right);
    if (!JSON_STR) {
        throw Error(`Could not find ${varName} in ${source}`);
    }
    return parseJSON(source, varName, utils_1.default.cutAfterJS(`${prependJSON}${JSON_STR}`));
}
// TODO: Infoの型特定
function findPlayerResponse(source, info) {
    const PLAYER_RESPONSE = info && ((info.args && info.args.player_response) || info.player_response || info.playerResponse || info.embedded_player_response);
    return parseJSON(source, 'player_response', PLAYER_RESPONSE);
}
function getWatchHTMLURL(id, options) {
    return `${BASE_URL + id}&hl=${options.lang || 'en'}&bpctr=${Math.ceil(Date.now() / 1000)}&has_verified=1`;
}
function getEmbedPageBody(id, options) {
    const EMBED_PAGE_URL = `${BASE_EMBED_URL + id}?hl=${options.lang || 'en'}`;
    return utils_1.default.request(EMBED_PAGE_URL, options);
}
async function getWatchHTMLPageBody(id, options) {
    const WATCH_PAGE_URL = getWatchHTMLURL(id, options);
    return WATCH_PAGE_CACHE.getOrSet(WATCH_PAGE_URL, () => utils_1.default.request(WATCH_PAGE_URL, options)) || '';
}
function getHTML5Player(body) {
    const HTML5_PLAYER_RES = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(body);
    return HTML5_PLAYER_RES ? HTML5_PLAYER_RES[1] || HTML5_PLAYER_RES[2] : null;
}
async function getWatchHTMLPage(id, options) {
    const BODY = await getWatchHTMLPageBody(id, options), INFO = { page: 'watch' };
    try {
        try {
            INFO.player_response = null; //utils.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', '}};', '', '}}') || utils.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', ';var') || utils.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', ';</script>') || findJSON<YT_YTInitialPlayerResponse>('watch.html', 'player_response', BODY, /\bytInitialPlayerResponse\s*=\s*\{/i, '</script>', '{');
        }
        catch (err) {
            const ARGS = findJSON('watch.html', 'player_response', BODY, /\bytplayer\.config\s*=\s*{/, '</script>', '{');
            INFO.player_response = findPlayerResponse('watch.html', ARGS);
        }
        INFO.response = utils_1.default.tryParseBetween(BODY, 'var ytInitialData = ', '}};', '', '}}') || utils_1.default.tryParseBetween(BODY, 'var ytInitialData = ', ';</script>') || utils_1.default.tryParseBetween(BODY, 'window["ytInitialData"] = ', '}};', '', '}}') || utils_1.default.tryParseBetween(BODY, 'window["ytInitialData"] = ', ';</script>') || findJSON('watch.html', 'response', BODY, /\bytInitialData("\])?\s*=\s*\{/i, '</script>', '{');
        INFO.html5player = getHTML5Player(BODY);
    }
    catch (err) {
        throw Error('Error when parsing watch.html, maybe YouTube made a change.\n' + `Please report this issue with the "${utils_1.default.saveDebugFile('watch.html', BODY)}" file on https://github.com/ybd-project/ytdl-core/issues.`);
    }
    return INFO;
}
/* ----------- */
/* Get Info Function */
function parseFormats(playerResponse) {
    let formats = [];
    if (playerResponse && playerResponse.streamingData) {
        formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
    }
    return formats;
}
async function getM3U8(url, options) {
    const _URL = new URL(url, BASE_URL), BODY = await utils_1.default.request(_URL.toString(), options), FORMATS = {};
    BODY.split('\n')
        .filter((line) => /^https?:\/\//.test(line))
        .forEach((line) => {
        const MATCH = line.match(/\/itag\/(\d+)\//) || [], ITAG = parseInt(MATCH[1]);
        FORMATS[line] = { itag: ITAG, url: line };
    });
    return FORMATS;
}
function getDashManifest(url, options) {
    return new Promise((resolve, reject) => {
        const PARSER = sax_1.default.parser(false), FORMATS = {};
        PARSER.onerror = reject;
        let adaptationSet = null;
        PARSER.onopentag = (node) => {
            const ATTRIBUTES = node.attributes;
            if (node.name === 'ADAPTATIONSET') {
                adaptationSet = ATTRIBUTES;
            }
            else if (node.name === 'REPRESENTATION') {
                const ITAG = parseInt(ATTRIBUTES.ID);
                if (!isNaN(ITAG)) {
                    const SOURCE = (() => {
                        if (node.attributes.HEIGHT) {
                            return {
                                width: parseInt(ATTRIBUTES.WIDTH),
                                height: parseInt(ATTRIBUTES.HEIGHT),
                                fps: parseInt(ATTRIBUTES.FRAMERATE),
                            };
                        }
                        else {
                            return {
                                audioSampleRate: ATTRIBUTES.AUDIOSAMPLINGRATE,
                            };
                        }
                    })();
                    FORMATS[url] = Object.assign({
                        itag: ITAG,
                        url,
                        bitrate: parseInt(ATTRIBUTES.BANDWIDTH),
                        mimeType: `${adaptationSet.MIMETYPE}; codecs="${ATTRIBUTES.CODECS}"`,
                    }, SOURCE);
                    Object.assign;
                }
            }
        };
        PARSER.onend = () => {
            resolve(FORMATS);
        };
        utils_1.default
            .request(new URL(url, BASE_URL).toString(), options)
            .then((res) => {
            PARSER.write(res);
            PARSER.close();
        })
            .catch(reject);
    });
}
function parseAdditionalManifests(playerResponse, options) {
    const STREAMING_DATA = playerResponse && playerResponse.streamingData, MANIFESTS = [];
    if (STREAMING_DATA) {
        if (STREAMING_DATA.dashManifestUrl) {
            MANIFESTS.push(getDashManifest(STREAMING_DATA.dashManifestUrl, options));
        }
        if (STREAMING_DATA.hlsManifestUrl) {
            MANIFESTS.push(getM3U8(STREAMING_DATA.hlsManifestUrl, options));
        }
    }
    return MANIFESTS;
}
async function playerAPI(videoId, payload, userAgent, options, apiUrl) {
    const { jar, dispatcher } = options.agent || {}, HEADER = (() => {
        if (apiUrl) {
            return {
                'Content-Type': 'application/json',
                cookie: jar?.getCookieStringSync('https://www.youtube.com'),
                'User-Agent': userAgent,
                'X-Goog-Api-Format-Version': '2',
                Origin: 'https://www.youtube.com',
                'X-Goog-Visitor-Id': options.visitorId,
            };
        }
        else {
            return {
                'Content-Type': 'application/json',
                cookie: jar?.getCookieStringSync('https://www.youtube.com'),
                Origin: 'https://www.youtube.com',
                'User-Agent': userAgent,
                'X-Youtube-Client-Name': '56',
                'X-Youtube-Client-Version': '1.20240814.01.00',
                'X-Goog-Visitor-Id': options.visitorData,
            };
        }
    })(), OPTS = {
        requestOptions: {
            method: 'POST',
            dispatcher,
            query: {
                prettyPrint: false,
                t: apiUrl ? utils_1.default.generateClientPlaybackNonce(12) : undefined,
                id: videoId,
            },
            headers: HEADER,
            body: JSON.stringify(payload),
        },
    }, RESPONSE = await utils_1.default.request(apiUrl || 'https://www.youtube.com/youtubei/v1/player', OPTS), PLAY_ERROR = utils_1.default.playError(RESPONSE);
    if (PLAY_ERROR) {
        throw PLAY_ERROR;
    }
    if (!RESPONSE.videoDetails || videoId !== RESPONSE.videoDetails.videoId) {
        const ERROR = new PlayerRequestError('Malformed response from YouTube');
        ERROR.response = RESPONSE;
        throw ERROR;
    }
    return RESPONSE;
}
async function getSignatureTimestamp(html5player, options) {
    const BODY = await utils_1.default.request(html5player, options), MO = BODY.match(/signatureTimestamp:(\d+)/);
    return MO ? MO[1] : undefined;
}
async function fetchWebCreatorPlayer(videoId, html5player, options) {
    const SERVICE_INTEGRITY_DIMENSIONS = options.poToken ? { poToken: options.poToken } : undefined, PAYLOAD = {
        cpn: utils_1.default.generateClientPlaybackNonce(16),
        videoId,
        serviceIntegrityDimensions: SERVICE_INTEGRITY_DIMENSIONS,
        context: {
            client: {
                clientName: 'WEB_CREATOR',
                clientVersion: '1.20240723.03.00',
                osName: 'Windows',
                osVersion: '10.0',
                platform: 'DESKTOP',
                utcOffsetMinutes: -240,
                visitorData: options.visitorData,
            },
            request: {
                useSsl: true,
                internalExperimentFlags: [],
                consistencyTokenJars: [],
            },
            user: {
                lockedSafetyMode: false,
            },
        },
        playbackContext: {
            contentPlaybackContext: {
                vis: 0,
                splay: false,
                referer: BASE_URL + videoId,
                currentUrl: BASE_URL + videoId,
                autonavState: 'STATE_ON',
                autoCaptionsDefaultOn: false,
                html5Preference: 'HTML5_PREF_WANTS',
                lactMilliseconds: '-1',
                signatureTimestamp: (await getSignatureTimestamp(html5player, options)) || 19950,
            },
        },
        attestationRequest: {
            omitBotguardData: true,
        },
    };
    return await playerAPI(videoId, PAYLOAD, undefined, options);
}
async function fetchIosJsonPlayer(videoId, options) {
    const SERVICE_INTEGRITY_DIMENSIONS = options.poToken ? { poToken: options.poToken } : undefined, PAYLOAD = {
        videoId,
        cpn: utils_1.default.generateClientPlaybackNonce(16),
        contentCheckOk: true,
        racyCheckOk: true,
        serviceIntegrityDimensions: SERVICE_INTEGRITY_DIMENSIONS,
        playbackContext: {
            contentPlaybackContext: {
                vis: 0,
                splay: false,
                referer: BASE_URL + videoId,
                currentUrl: BASE_URL + videoId,
                autonavState: 'STATE_ON',
                autoCaptionsDefaultOn: false,
                html5Preference: 'HTML5_PREF_WANTS',
                lactMilliseconds: '-1',
                signatureTimestamp: 19950,
            },
        },
        attestationRequest: {
            omitBotguardData: true,
        },
        context: {
            client: {
                clientName: 'IOS',
                clientVersion: IOS_CLIENT_VERSION,
                deviceMake: 'Apple',
                deviceModel: IOS_DEVICE_MODEL,
                platform: 'MOBILE',
                osName: 'iOS',
                osVersion: IOS_OS_VERSION,
                hl: 'en',
                gl: 'US',
                utcOffsetMinutes: -240,
                visitorData: options.visitorData,
            },
            request: {
                internalExperimentFlags: [],
                useSsl: true,
            },
            user: {
                lockedSafetyMode: false,
            },
        },
    }, IOS_USER_AGENT = `com.google.ios.youtube/${IOS_CLIENT_VERSION}(${IOS_DEVICE_MODEL}; U; CPU iOS ${IOS_USER_AGENT_VERSION} like Mac OS X; en_US)`;
    return await playerAPI(videoId, PAYLOAD, IOS_USER_AGENT, options, 'https://youtubei.googleapis.com/youtubei/v1/player');
}
async function fetchAndroidJsonPlayer(videoId, options) {
    const SERVICE_INTEGRITY_DIMENSIONS = options.poToken ? { poToken: options.poToken } : undefined, PAYLOAD = {
        videoId,
        cpn: utils_1.default.generateClientPlaybackNonce(16),
        contentCheckOk: true,
        racyCheckOk: true,
        serviceIntegrityDimensions: SERVICE_INTEGRITY_DIMENSIONS,
        playbackContext: {
            contentPlaybackContext: {
                vis: 0,
                splay: false,
                referer: BASE_URL + videoId,
                currentUrl: BASE_URL + videoId,
                autonavState: 'STATE_ON',
                autoCaptionsDefaultOn: false,
                html5Preference: 'HTML5_PREF_WANTS',
                lactMilliseconds: '-1',
                signatureTimestamp: 19950,
            },
        },
        attestationRequest: {
            omitBotguardData: true,
        },
        context: {
            client: {
                clientName: 'ANDROID',
                clientVersion: ANDROID_CLIENT_VERSION,
                platform: 'MOBILE',
                osName: 'Android',
                osVersion: ANDROID_OS_VERSION,
                androidSdkVersion: ANDROID_SDK_VERSION,
                hl: 'en',
                gl: 'US',
                utcOffsetMinutes: -240,
                visitorData: options.visitorData,
            },
            request: {
                internalExperimentFlags: [],
                useSsl: true,
            },
            user: {
                lockedSafetyMode: false,
            },
        },
    }, IOS_USER_AGENT = `com.google.android.youtube/${ANDROID_CLIENT_VERSION} (Linux; U; Android ${ANDROID_OS_VERSION}; en_US) gzip`;
    return await playerAPI(videoId, PAYLOAD, IOS_USER_AGENT, options, 'https://youtubei.googleapis.com/youtubei/v1/player');
}
/* ----------- */
/* ----------- */
/* Public Constants */
const CACHE = new cache_1.Cache(), WATCH_PAGE_CACHE = new cache_1.Cache();
exports.CACHE = CACHE;
exports.WATCH_PAGE_CACHE = WATCH_PAGE_CACHE;
/* ----------- */
/* Public Functions */
/** Gets info from a video without getting additional formats. */
async function _getBasicInfo(id, options) {
    utils_1.default.applyIPv6Rotations(options);
    utils_1.default.applyDefaultHeaders(options);
    utils_1.default.applyDefaultAgent(options);
    utils_1.default.applyOldLocalAddress(options);
    options.requestOptions ??= {};
    const { jar, dispatcher } = options.agent || {};
    utils_1.default.setPropInsensitive(options.requestOptions?.headers, 'cookie', jar?.getCookieStringSync('https://www.youtube.com'));
    options.requestOptions.dispatcher ??= dispatcher;
    const RETRY_OPTIONS = Object.assign({}, options.requestOptions), RETRY_FUNC_PROMISE = retryFunc(getWatchHTMLPage, [id, options], RETRY_OPTIONS), WATCH_PAGE_BODY_PROMISE = getWatchHTMLPageBody(id, options), EMBED_PAGE_BODY_PROMISE = getEmbedPageBody(id, options), WATCH_PAGE_INFO = await RETRY_FUNC_PROMISE, HTML5_PLAYER = getHTML5Player(await WATCH_PAGE_BODY_PROMISE) || getHTML5Player(await EMBED_PAGE_BODY_PROMISE), VIDEO_INFO = {
        page: 'watch',
        watchPageInfo: WATCH_PAGE_INFO,
        relatedVideos: [],
        videoDetails: {},
        formats: [],
        html5Player: HTML5_PLAYER,
    };
    if (!HTML5_PLAYER) {
        throw Error('Unable to find html5player file');
    }
    const HTML5_PLAYER_URL = new URL(HTML5_PLAYER, BASE_URL).toString(), PLAYER_API_RESPONSES = await Promise.allSettled([fetchWebCreatorPlayer(id, HTML5_PLAYER_URL, options), fetchIosJsonPlayer(id, options), fetchAndroidJsonPlayer(id, options)]), WEB_CREATOR_RESPONSE = PLAYER_API_RESPONSES[0].status === 'fulfilled' ? PLAYER_API_RESPONSES[0].value : null, IOS_PLAYER_RESPONSE = PLAYER_API_RESPONSES[1].status === 'fulfilled' ? PLAYER_API_RESPONSES[1].value : null, ANDROID_PLAYER_RESPONSE = PLAYER_API_RESPONSES[2].status === 'fulfilled' ? PLAYER_API_RESPONSES[2].value : null;
    PLAYER_API_RESPONSES.forEach((response, i) => {
        if (response.status === 'rejected') {
            const NAMES = ['WebCreator', 'iOS', 'Android'];
            console.warn(`Request to ${NAMES[i]} Player failed.\nReason: ${response.reason}`);
        }
    });
    const MEDIA = info_extras_1.default.getMedia(WATCH_PAGE_INFO), AGE_RESTRICTED = (() => {
        const IS_AGE_RESTRICTED = MEDIA && AGE_RESTRICTED_URLS.some((url) => Object.values(MEDIA || {}).some((v) => typeof v === 'string' && v.includes(url)));
        return !!IS_AGE_RESTRICTED;
    })(), ADDITIONAL_DATA = {
        author: info_extras_1.default.getAuthor(WATCH_PAGE_INFO),
        media: MEDIA,
        likes: info_extras_1.default.getLikes(WATCH_PAGE_INFO),
        age_restricted: AGE_RESTRICTED,
        video_url: BASE_URL + id,
        storyboards: info_extras_1.default.getStoryboards(WEB_CREATOR_RESPONSE),
        chapters: info_extras_1.default.getChapters(WATCH_PAGE_INFO),
    }, VIDEO_DETAILS = (WEB_CREATOR_RESPONSE || IOS_PLAYER_RESPONSE || ANDROID_PLAYER_RESPONSE || {}).videoDetails || {};
    VIDEO_INFO.videoDetails = info_extras_1.default.cleanVideoDetails(Object.assign({}, VIDEO_DETAILS, ADDITIONAL_DATA));
    VIDEO_INFO.formats = [...parseFormats(WEB_CREATOR_RESPONSE), ...parseFormats(IOS_PLAYER_RESPONSE), ...parseFormats(ANDROID_PLAYER_RESPONSE)].filter((res) => res);
    return VIDEO_INFO;
}
async function getBasicInfo(link, options = {}) {
    utils_1.default.checkForUpdates();
    const ID = url_utils_1.default.getVideoID(link), CACHE_KEY = ['getBasicInfo', ID, options.lang].join('-');
    return CACHE.getOrSet(CACHE_KEY, () => _getBasicInfo(ID, options));
}
// TODO: Clean up this function for readability and support more clients
/** Gets info from a video additional formats and deciphered URLs. */
async function _getInfo(id, options) {
    utils_1.default.applyIPv6Rotations(options);
    utils_1.default.applyDefaultHeaders(options);
    utils_1.default.applyDefaultAgent(options);
    utils_1.default.applyOldLocalAddress(options);
    const INFO = await getBasicInfo(id, options), FUNCTIONS = [];
    try {
        const FORMATS = INFO.formats;
        FUNCTIONS.push(sig_1.default.decipherFormats(FORMATS, INFO.html5player, options));
        for (const RESPONSE of FORMATS) {
            FUNCTIONS.push(...parseAdditionalManifests(RESPONSE, options));
        }
    }
    catch (err) {
        console.warn('error in player API; falling back to web-scraping');
        // TODO: tv client
        FUNCTIONS.push(sig_1.default.decipherFormats(parseFormats(INFO.watchPageInfo.player_response), INFO.html5player, options));
        FUNCTIONS.push(...parseAdditionalManifests(INFO.watchPageInfo.player_response, options));
    }
    const RESULTS = await Promise.all(FUNCTIONS);
    INFO.formats = Object.values(Object.assign({}, ...RESULTS));
    INFO.formats = INFO.formats.map(format_utils_1.default.addFormatMeta);
    INFO.formats.sort(format_utils_1.default.sortFormats);
    INFO.full = true;
    return INFO;
}
async function getInfo(link, options = {}) {
    utils_1.default.checkForUpdates();
    const ID = url_utils_1.default.getVideoID(link), CACHE_KEY = ['getInfo', ID, options.lang].join('-');
    return CACHE.getOrSet(CACHE_KEY, () => _getInfo(ID, options));
}
const validateID = url_utils_1.default.validateID, validateURL = url_utils_1.default.validateURL, getURLVideoID = url_utils_1.default.getURLVideoID, getVideoID = url_utils_1.default.getVideoID;
exports.validateID = validateID;
exports.validateURL = validateURL;
exports.getURLVideoID = getURLVideoID;
exports.getVideoID = getVideoID;
exports.default = { CACHE, WATCH_PAGE_CACHE, getBasicInfo, getInfo, validateID, validateURL, getURLVideoID, getVideoID };
//# sourceMappingURL=info.js.map