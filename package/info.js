"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoID = exports.getURLVideoID = exports.validateURL = exports.validateID = exports.WATCH_PAGE_CACHE = exports.CACHE = void 0;
exports.getInfo = getInfo;
const sax_1 = __importDefault(require("sax"));
const utils_1 = __importDefault(require("./utils"));
const format_utils_1 = __importDefault(require("./format-utils"));
const url_utils_1 = __importDefault(require("./url-utils"));
const cache_1 = require("./cache");
const sig_1 = __importDefault(require("./sig"));
const Log_1 = require("./utils/Log");
const BasicInfo_1 = require("./core/Info/BasicInfo");
/* Private Constants */
const BASE_URL = 'https://www.youtube.com/watch?v=';
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
/* ----------- */
/* Public Constants */
const CACHE = new cache_1.Cache(), WATCH_PAGE_CACHE = new cache_1.Cache();
exports.CACHE = CACHE;
exports.WATCH_PAGE_CACHE = WATCH_PAGE_CACHE;
/* ----------- */
/* Public Functions */
// TODO: Clean up this function for readability and support more clients
/** Gets info from a video additional formats and deciphered URLs. */
async function _getInfo(id, options) {
    utils_1.default.applyIPv6Rotations(options);
    utils_1.default.applyDefaultHeaders(options);
    utils_1.default.applyDefaultAgent(options);
    utils_1.default.applyOldLocalAddress(options);
    const INFO = await (0, BasicInfo_1._getBasicInfo)(id, options, true), FUNCTIONS = [];
    try {
        const FORMATS = INFO.formats;
        FUNCTIONS.push(sig_1.default.decipherFormats(FORMATS, INFO.html5Player, options));
        for (const RESPONSE of FORMATS) {
            FUNCTIONS.push(...parseAdditionalManifests(RESPONSE, options));
        }
    }
    catch (err) {
        Log_1.Logger.warning('Error in player API; falling back to web-scraping');
        FUNCTIONS.push(sig_1.default.decipherFormats(parseFormats(INFO._watchPageInfo.player_response), INFO.html5Player, options));
        FUNCTIONS.push(...parseAdditionalManifests(INFO._watchPageInfo.player_response, options));
    }
    const RESULTS = await Promise.all(FUNCTIONS);
    INFO.formats = Object.values(Object.assign({}, ...RESULTS));
    INFO.formats = INFO.formats.map(format_utils_1.default.addFormatMeta);
    INFO.formats.sort(format_utils_1.default.sortFormats);
    INFO.full = true;
    if (!options.includesWatchPageInfo) {
        delete INFO._watchPageInfo;
    }
    if (!options.includesPlayerAPIResponse) {
        delete INFO._playerResponses;
    }
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
exports.default = { CACHE, WATCH_PAGE_CACHE, getInfo, validateID, validateURL, getURLVideoID, getVideoID };
//# sourceMappingURL=info.js.map