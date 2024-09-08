export default class Url {
    static getBaseUrl(): string;
    static getWatchPageUrl(id: string): string;
    static getEmbedUrl(id: string): string;
    static getTvUrl(): string;
    static getRefreshTokenApiUrl(): string;
    static validateID(id: string): boolean;
    static getURLVideoID(link: string): string;
    static getVideoID(str: string): string;
    static validateURL(str: string): boolean;
}
