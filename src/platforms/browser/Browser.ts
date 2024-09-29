import { Platform } from '@/platforms/Platform';
import { YtdlCore_Cache } from '@/platforms/utils/Classes';
import { VERSION, REPO_URL, ISSUES_URL } from '@/utils/Constants';

class CacheWithCacheStorage implements YtdlCore_Cache {
    isDisabled: boolean = false;

    private async getCache(): Promise<Cache> {
        return await caches.open('ytdlCoreCache');
    }

    async get<T = unknown>(key: string): Promise<T | null> {
        if (this.isDisabled) {
            return null;
        }

        const cache = await this.getCache();
        const response = await cache.match(key);

        if (response) {
            const contentType = response.headers.get('Content-Type');

            if (contentType === 'application/json') {
                return (await response.json()) as T;
            } else {
                return (await response.text()) as T;
            }
        }
        return null;
    }

    async set(key: string, value: any): Promise<boolean> {
        if (this.isDisabled) {
            return true;
        }

        const CACHE = await this.getCache();
        let response: Response;

        if (typeof value === 'object') {
            response = new Response(JSON.stringify(value), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            response = new Response(String(value), {
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        await CACHE.put(key, response);

        return true;
    }

    async has(key: string): Promise<boolean> {
        if (this.isDisabled) {
            return false;
        }

        const CACHE = await this.getCache(),
            RESPONSE = await CACHE.match(key);

        return RESPONSE !== undefined;
    }

    async delete(key: string): Promise<boolean> {
        if (this.isDisabled) {
            return true;
        }

        const CACHE = await this.getCache();

        return await CACHE.delete(key);
    }

    disable(): void {
        this.isDisabled = true;
    }

    initialization(): void {}
}

Platform.load({
    runtime: 'browser',
    server: false,
    cache: new CacheWithCacheStorage(),
    fileCache: new CacheWithCacheStorage(),
    fetcher: (url, options) => fetch(url, options),
    poToken: () => {
        return new Promise((resolve) => {
            resolve({
                poToken: '',
                visitorData: '',
            });
        });
    },
    options: {
        download: {
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
        other: {
            logDisplay: ['info', 'success', 'warning', 'error'],
            noUpdate: false,
        },
    },
    requestRelated: {
        rewriteRequest: (url, options) => {
            return { url, options };
        },
        originalProxy: null,
    },
    info: {
        version: VERSION,
        repoUrl: REPO_URL,
        issuesUrl: ISSUES_URL,
    },
});

import { YtdlCore } from '@/YtdlCore';

export * from '@/types/index';
export { YtdlCore };
export default YtdlCore;
