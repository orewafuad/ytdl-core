"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cache_1 = require("../../../core/Cache");
const Url_1 = __importDefault(require("../../../utils/Url"));
const UserAgents_1 = __importDefault(require("../../../utils/UserAgents"));
const Utils_1 = __importDefault(require("../../../utils/Utils"));
const WATCH_PAGE_CACHE = new Cache_1.Cache();
class YouTubePageExtractor {
    static getWatchHtmlUrl(id, options) {
        return `${Url_1.default.getWatchPageUrl(id)}&hl=${options.lang || 'en'}&bpctr=${Math.ceil(Date.now() / 1000)}&has_verified=1`;
    }
    static getWatchPageBody(id, options) {
        const WATCH_PAGE_URL = YouTubePageExtractor.getWatchHtmlUrl(id, options);
        options.requestOptions = Object.assign({}, options.requestOptions);
        options.requestOptions.headers = {
            'User-Agent': UserAgents_1.default.default,
            ...options.requestOptions.headers,
        };
        return WATCH_PAGE_CACHE.getOrSet(WATCH_PAGE_URL, () => Utils_1.default.request(WATCH_PAGE_URL, options)) || Promise.resolve('');
    }
    static getEmbedPageBody(id, options) {
        const EMBED_PAGE_URL = `${Url_1.default.getEmbedUrl(id)}?hl=${options.lang || 'en'}`;
        return Utils_1.default.request(EMBED_PAGE_URL, options);
    }
}
exports.default = YouTubePageExtractor;
//# sourceMappingURL=PageExtractor.js.map