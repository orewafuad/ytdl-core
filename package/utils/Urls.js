"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = 'https://www.youtube.com';
class Urls {
    static getBaseUrl() {
        return BASE_URL;
    }
    static getWatchPageUrl(id) {
        return `${BASE_URL}/watch?v=${id}`;
    }
    static getEmbedUrl(id) {
        return `${BASE_URL}/embed/${id}`;
    }
    static getTvUrl() {
        return `${BASE_URL}/tv`;
    }
    static getRefreshTokenApiUrl() {
        return `${BASE_URL}/o/oauth2/token`;
    }
}
exports.default = Urls;
//# sourceMappingURL=Urls.js.map