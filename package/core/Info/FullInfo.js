"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullInfo = getFullInfo;
const Signature_1 = require("../../core/Signature");
const Platform_1 = require("../../platforms/Platform");
const Utils_1 = __importDefault(require("../../utils/Utils"));
const Url_1 = require("../../utils/Url");
const Format_1 = require("../../utils/Format");
const Formats_1 = require("./parser/Formats");
const BasicInfo_1 = require("./BasicInfo");
/* Private Constants */
const CACHE = Platform_1.Platform.getShim().cache, SIGNATURE = new Signature_1.Signature();
async function _getFullInfo(id, options) {
    const INFO = await (0, BasicInfo_1._getBasicInfo)(id, options, true), FUNCTIONS = [];
    try {
        const FORMATS = INFO.formats;
        FUNCTIONS.push(SIGNATURE.decipherFormats(FORMATS));
        if (options.parsesHLSFormat && INFO._playerApiResponses?.ios) {
            FUNCTIONS.push(...Formats_1.FormatParser.parseAdditionalManifests(INFO._playerApiResponses.ios, options));
        }
    }
    catch { }
    const RESULTS = Object.values(Object.assign({}, ...(await Promise.all(FUNCTIONS))));
    INFO.formats = RESULTS.map((format) => Format_1.FormatUtils.addFormatMeta(format, options.includesOriginalFormatData ?? false));
    INFO.formats.sort(Format_1.FormatUtils.sortFormats);
    INFO.full = true;
    if (!options.includesPlayerAPIResponse) {
        delete INFO._playerApiResponses;
    }
    if (!options.includesNextAPIResponse) {
        delete INFO._nextApiResponses;
    }
    return INFO;
}
async function getFullInfo(link, options) {
    Utils_1.default.checkForUpdates();
    const ID = Url_1.Url.getVideoID(link) || (Url_1.Url.validateID(link) ? link : null);
    if (!ID) {
        throw new Error('The URL specified is not a valid URL.');
    }
    const CACHE_KEY = ['getFullInfo', ID, options.hl, options.gl].join('-');
    if (await CACHE.has(CACHE_KEY)) {
        return CACHE.get(CACHE_KEY);
    }
    throw new Error('AAAAAAAAAAAAAAA');
    /*     try {
        const RESULTS = await _getFullInfo(ID, options);

        CACHE.set(CACHE_KEY, RESULTS, {
            ttl: 60 * 30, //30Min
        });

        return RESULTS;
    } catch (err) {
        throw err;
    } */
}
//# sourceMappingURL=FullInfo.js.map