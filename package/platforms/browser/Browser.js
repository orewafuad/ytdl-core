"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtdlCore = void 0;
const Platform_1 = require("../../platforms/Platform");
const Constants_1 = require("../../utils/Constants");
class CacheWithCacheStorage {
    async getCache() {
        return await caches.open('ytdlCoreCache');
    }
    async get(key) {
        const cache = await this.getCache();
        const response = await cache.match(key);
        if (response) {
            const contentType = response.headers.get('Content-Type');
            if (contentType === 'application/json') {
                return (await response.json());
            }
            else {
                return (await response.text());
            }
        }
        return null;
    }
    async set(key, value) {
        const CACHE = await this.getCache();
        let response;
        if (typeof value === 'object') {
            response = new Response(JSON.stringify(value), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        else {
            response = new Response(String(value), {
                headers: { 'Content-Type': 'text/plain' },
            });
        }
        await CACHE.put(key, response);
        return true;
    }
    async has(key) {
        const CACHE = await this.getCache(), RESPONSE = await CACHE.match(key);
        return RESPONSE !== undefined;
    }
    async delete(key) {
        const CACHE = await this.getCache();
        return await CACHE.delete(key);
    }
    disable() { }
    initialization() { }
}
Platform_1.Platform.load({
    runtime: 'browser',
    server: false,
    cache: new CacheWithCacheStorage(),
    fileCache: new CacheWithCacheStorage(),
    default: {
        options: {
            hl: 'en',
            gl: 'US',
            includesPlayerAPIResponse: false,
            includesNextAPIResponse: false,
            includesOriginalFormatData: false,
            includesRelatedVideo: true,
            clients: ['web', 'webCreator', 'tvEmbedded', 'ios', 'android'],
            disableDefaultClients: false,
            disableFileCache: false,
            parsesHLSFormat: true,
        },
        proxy: {
            rewriteRequest: (url, options) => {
                return { url, options };
            },
            originalProxy: null,
        },
    },
    info: {
        version: Constants_1.VERSION,
        repoUrl: Constants_1.REPO_URL,
        issuesUrl: Constants_1.ISSUES_URL,
    },
});
const YtdlCore_1 = require("../../YtdlCore");
Object.defineProperty(exports, "YtdlCore", { enumerable: true, get: function () { return YtdlCore_1.YtdlCore; } });
__exportStar(require("../../types/index"), exports);
exports.default = YtdlCore_1.YtdlCore;
//# sourceMappingURL=Browser.js.map