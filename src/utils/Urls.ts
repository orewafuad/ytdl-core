const BASE_URL = 'https://www.youtube.com';

export default class Urls {
    static getBaseUrl() {
        return BASE_URL;
    }

    static getWatchPageUrl(id: string) {
        return `${BASE_URL}/watch?v=${id}`;
    }

    static getEmbedUrl(id: string) {
        return `${BASE_URL}/embed/${id}`;
    }

    static getTvUrl() {
        return `${BASE_URL}/tv`;
    }

    static getRefreshTokenApiUrl() {
        return `${BASE_URL}/o/oauth2/token`;
    }
}