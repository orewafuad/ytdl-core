import type { YTDL_GetInfoOptions } from '@/types/options';
import { Cache } from '@/cache';
import utils from '@/utils';
import Url from '@/utils/Url';
import UserAgent from '@/utils/UserAgents';

const WATCH_PAGE_CACHE = new Cache();

export default class YouTubePageExtractor {
    static getWatchHtmlUrl(id: string, options: YTDL_GetInfoOptions): string {
        return `${Url.getWatchPageUrl(id)}&hl=${options.lang || 'en'}&bpctr=${Math.ceil(Date.now() / 1000)}&has_verified=1`;
    }

    static getWatchPageBody(id: string, options: YTDL_GetInfoOptions): Promise<string> {
        const WATCH_PAGE_URL = YouTubePageExtractor.getWatchHtmlUrl(id, options);

        options.requestOptions = Object.assign({}, options.requestOptions);
        options.requestOptions.headers = {
            'User-Agent': UserAgent.default,
            ...options.requestOptions.headers,
        };

        return WATCH_PAGE_CACHE.getOrSet(WATCH_PAGE_URL, () => utils.request(WATCH_PAGE_URL, options)) || Promise.resolve('');
    }

    static getEmbedPageBody(id: string, options: YTDL_GetInfoOptions): Promise<string> {
        const EMBED_PAGE_URL = `${Url.getEmbedUrl(id)}?hl=${options.lang || 'en'}`;

        return utils.request(EMBED_PAGE_URL, options);
    }
}
