type FileCacheOptions = {
    /** Seconds
     * @default 60 * 60 * 24
     */
    ttl: number;
};
type AvailableCacheFileNames = 'poToken' | 'visitorData' | 'oauth2' | 'html5Player' | (string & {});
export declare class Cache extends Map {
    private timeout;
    constructor(timeout?: number);
    set(key: any, value: any): this;
    get<T = unknown>(key: string): T | null;
    getOrSet<T = unknown>(key: string, fn: () => any): T | null;
    delete(key: string): boolean;
    clear(): void;
}
export declare class FileCache {
    static set(cacheName: AvailableCacheFileNames, data: string, options?: FileCacheOptions): boolean;
    static get<T = unknown>(cacheName: AvailableCacheFileNames): T | null;
}
export {};
