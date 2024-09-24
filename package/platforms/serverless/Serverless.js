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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtdlCore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const Platform_1 = require("@/platforms/Platform");
const Cache_1 = require("@/platforms/utils/Cache");
const Constants_1 = require("@/utils/Constants");
class FileCache {
    constructor() {
        this.timeouts = new Map();
        this.isDisabled = false;
        this.cacheDir = path_1.default.resolve(os_1.default.tmpdir(), './.YtdlCore-Cache/');
    }
    async get(cacheName) {
        if (this.isDisabled) {
            return null;
        }
        try {
            if (!this.has(cacheName)) {
                return null;
            }
            const FILE_PATH = path_1.default.resolve(this.cacheDir, cacheName + '.txt'), PARSED_DATA = JSON.parse(fs_1.default.readFileSync(FILE_PATH, 'utf8'));
            if (Date.now() > PARSED_DATA.date) {
                return null;
            }
            Log_1.Logger.debug(`[ FileCache ]: Cache key <blue>"${cacheName}"</blue> was available.`);
            try {
                return JSON.parse(PARSED_DATA.contents);
            }
            catch {
                return PARSED_DATA.contents;
            }
        }
        catch (err) {
            return null;
        }
    }
    async set(cacheName, data, options = { ttl: 60 * 60 * 24 }) {
        if (this.isDisabled) {
            Log_1.Logger.debug(`[ FileCache ]: <blue>"${cacheName}"</blue> is not cached by the _YTDL_DISABLE_FILE_CACHE option.`);
            return false;
        }
        try {
            fs_1.default.writeFileSync(path_1.default.resolve(this.cacheDir, cacheName + '.txt'), JSON.stringify({
                date: Date.now() + options.ttl * 1000,
                contents: data,
            }));
            if (this.timeouts.has(cacheName)) {
                clearTimeout(this.timeouts.get(cacheName));
            }
            const TIMEOUT = setTimeout(() => {
                this.delete(cacheName);
            }, options.ttl * 1000);
            this.timeouts.set(cacheName, TIMEOUT);
            Log_1.Logger.debug(`[ FileCache ]: <success>"${cacheName}"</success> is cached.`);
            return true;
        }
        catch (err) {
            Log_1.Logger.error(`Failed to cache ${cacheName}.\nDetails: `, err);
            return false;
        }
    }
    async has(cacheName) {
        if (this.isDisabled) {
            return true;
        }
        try {
            return fs_1.default.existsSync(path_1.default.resolve(this.cacheDir, cacheName + '.txt'));
        }
        catch {
            return false;
        }
    }
    async delete(cacheName) {
        if (this.isDisabled) {
            return true;
        }
        try {
            if (!this.has(cacheName)) {
                return true;
            }
            const FILE_PATH = path_1.default.resolve(this.cacheDir, cacheName + '.txt');
            fs_1.default.unlinkSync(FILE_PATH);
            Log_1.Logger.debug(`[ FileCache ]: Cache key <blue>"${cacheName}"</blue> was deleted.`);
            if (this.timeouts.has(cacheName)) {
                clearTimeout(this.timeouts.get(cacheName));
                this.timeouts.delete(cacheName);
            }
            return true;
        }
        catch (err) {
            return false;
        }
    }
    initialization() {
        if (typeof process !== 'undefined') {
            this.isDisabled = !!(process.env._YTDL_DISABLE_FILE_CACHE !== 'false' && process.env._YTDL_DISABLE_FILE_CACHE);
            try {
                if (!fs_1.default.existsSync(this.cacheDir)) {
                    fs_1.default.mkdirSync(this.cacheDir);
                }
            }
            catch {
                process.env._YTDL_DISABLE_FILE_CACHE = 'true';
                this.isDisabled = true;
            }
        }
    }
}
Platform_1.Platform.load({
    runtime: 'serverless',
    server: true,
    cache: new Cache_1.CacheWithMap(),
    fileCache: new FileCache(),
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
const YtdlCore_1 = require("@/YtdlCore");
Object.defineProperty(exports, "YtdlCore", { enumerable: true, get: function () { return YtdlCore_1.YtdlCore; } });
const Log_1 = require("@/utils/Log");
__exportStar(require("@/types/index"), exports);
exports.default = YtdlCore_1.YtdlCore;
//# sourceMappingURL=Serverless.js.map