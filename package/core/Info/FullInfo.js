"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = getInfo;
const Cache_1 = require("../../core/Cache");
const Signature_1 = __importDefault(require("../../core/Signature"));
const Url_1 = __importDefault(require("../../utils/Url"));
const Log_1 = require("../../utils/Log");
const Utils_1 = __importDefault(require("../../utils/Utils"));
const DownloadOptions_1 = __importDefault(require("../../utils/DownloadOptions"));
const Format_1 = __importDefault(require("../../utils/Format"));
const BasicInfo_1 = require("./BasicInfo");
const Formats_1 = __importDefault(require("./parser/Formats"));
const CACHE = new Cache_1.Cache();
/* Public Functions */
/** Gets info from a video additional formats and deciphered Url. */
async function _getFullInfo(id, options) {
    DownloadOptions_1.default.applyIPv6Rotations(options);
    DownloadOptions_1.default.applyDefaultHeaders(options);
    DownloadOptions_1.default.applyDefaultAgent(options);
    DownloadOptions_1.default.applyOldLocalAddress(options);
    const INFO = await (0, BasicInfo_1._getBasicInfo)(id, options, true), FUNCTIONS = [];
    try {
        const FORMATS = INFO.formats;
        FUNCTIONS.push(Signature_1.default.decipherFormats(FORMATS, INFO._metadata.html5Player, options));
        for (const RESPONSE of FORMATS) {
            FUNCTIONS.push(...Formats_1.default.parseAdditionalManifests(RESPONSE, options));
        }
    }
    catch (err) { }
    const RESULTS = Object.values(Object.assign({}, ...await Promise.all(FUNCTIONS)));
    INFO.formats = RESULTS.map((format) => Format_1.default.addFormatMeta(format, options.includesOriginalFormatData ?? false));
    INFO.formats.sort(Format_1.default.sortFormats);
    INFO.full = true;
    return INFO;
}
/** @deprecated */
async function getInfo(link, options = {}) {
    Log_1.Logger.warning('`getInfo` is deprecated and will be removed in the next major version. Please use `getFullInfo` instead.');
    Utils_1.default.checkForUpdates();
    const ID = Url_1.default.getVideoID(link), CACHE_KEY = ['getFullInfo', ID, options.lang].join('-');
    return CACHE.getOrSet(CACHE_KEY, () => _getFullInfo(ID, options));
}
async function getFullInfo(link, options = {}) {
    Utils_1.default.checkForUpdates();
    const ID = Url_1.default.getVideoID(link), CACHE_KEY = ['getFullInfo', ID, options.lang].join('-');
    return CACHE.getOrSet(CACHE_KEY, () => _getFullInfo(ID, options));
}
exports.default = getFullInfo;
//# sourceMappingURL=FullInfo.js.map