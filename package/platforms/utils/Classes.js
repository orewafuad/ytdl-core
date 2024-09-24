"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheWithMap = exports.YtdlCore_Cache = void 0;
class YtdlCore_Cache {
}
exports.YtdlCore_Cache = YtdlCore_Cache;
class CacheWithMap {
    constructor(ttl = 60000) {
        this.ttl = ttl;
        this.cache = new Map();
        this.timeouts = new Map();
    }
    async get(key) {
        return this.cache.get(key) || null;
    }
    async set(key, value) {
        this.cache.set(key, value);
        if (this.timeouts.has(key)) {
            clearTimeout(this.timeouts.get(key));
        }
        const timeout = setTimeout(() => {
            this.delete(key);
        }, this.ttl);
        this.timeouts.set(key, timeout);
        return true;
    }
    async has(key) {
        return this.cache.has(key);
    }
    async delete(key) {
        if (this.timeouts.has(key)) {
            clearTimeout(this.timeouts.get(key));
            this.timeouts.delete(key);
        }
        return this.cache.delete(key);
    }
    disable() { }
    initialization() { }
}
exports.CacheWithMap = CacheWithMap;
//# sourceMappingURL=Classes.js.map