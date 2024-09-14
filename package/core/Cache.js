"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileCache = exports.Cache = void 0;
const timers_1 = require("timers");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Log_1 = require("../utils/Log");
const CACHE_DIR_PATH = path_1.default.resolve(__dirname, './CacheFiles');
try {
    if (!fs_1.default.existsSync(CACHE_DIR_PATH)) {
        fs_1.default.mkdirSync(CACHE_DIR_PATH);
    }
}
catch {
    process.env._YTDL_DISABLE_HTML5_PLAYER_CACHE = 'true';
}
class Cache extends Map {
    timeout;
    // timeout = 30 seconds
    constructor(timeout = 1000 * 30) {
        super();
        this.timeout = timeout;
    }
    set(key, value) {
        if (this.has(key)) {
            clearTimeout(super.get(key).tid);
        }
        super.set(key, {
            tid: (0, timers_1.setTimeout)(this.delete.bind(this, key), this.timeout).unref(),
            value,
        });
        return this;
    }
    get(key) {
        const ENTRY = super.get(key);
        if (ENTRY) {
            return ENTRY.value;
        }
        return null;
    }
    getOrSet(key, fn) {
        if (this.has(key)) {
            return this.get(key);
        }
        else {
            let value = fn();
            this.set(key, value);
            (async () => {
                try {
                    await value;
                }
                catch (err) {
                    this.delete(key);
                }
            })();
            return value;
        }
    }
    delete(key) {
        let ENTRY = super.get(key);
        if (ENTRY) {
            clearTimeout(ENTRY.tid);
            return super.delete(key);
        }
        return false;
    }
    clear() {
        for (const ENTRY of this.values()) {
            clearTimeout(ENTRY.tid);
        }
        super.clear();
    }
}
exports.Cache = Cache;
class FileCache {
    static set(cacheName, data, options = { ttl: 60 * 60 * 24 }) {
        if (process.env._YTDL_DISABLE_FILE_CACHE) {
            return false;
        }
        try {
            fs_1.default.writeFileSync(path_1.default.resolve(__dirname, './CacheFiles/' + cacheName + '.txt'), JSON.stringify({
                date: Date.now() + options.ttl * 1000,
                contents: data,
            }));
            return true;
        }
        catch (err) {
            Log_1.Logger.error(`Failed to cache ${cacheName}.\nDetails: `, err);
            return false;
        }
    }
    static get(cacheName) {
        if (process.env._YTDL_DISABLE_FILE_CACHE) {
            return null;
        }
        try {
            const PARSED_DATA = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, './CacheFiles/' + cacheName + '.txt'), 'utf8'));
            if (Date.now() > PARSED_DATA.date) {
                return null;
            }
            Log_1.Logger.debug(`[ FileCache ]: Cache key "${cacheName}" was available.`);
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
}
exports.FileCache = FileCache;
//# sourceMappingURL=Cache.js.map