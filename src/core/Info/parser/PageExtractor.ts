import type { YTDL_GetInfoOptions } from '@/types/options';
import { Cache } from '@/cache';
import utils from '@/utils';
import Urls from '@/utils/Urls';

const WATCH_PAGE_CACHE = new Cache();

export default class YouTubePageExtractor {
    static getWatchHtmlUrl(id: string, options: YTDL_GetInfoOptions): string {
        return `${Urls.getWatchPageUrl(id)}&hl=${options.lang || 'en'}&bpctr=${Math.ceil(Date.now() / 1000)}&has_verified=1`;
    }

    static getWatchPageBody(id: string, options: YTDL_GetInfoOptions): Promise<string> {
        const WATCH_PAGE_URL = YouTubePageExtractor.getWatchHtmlUrl(id, options);

        return WATCH_PAGE_CACHE.getOrSet(WATCH_PAGE_URL, () => utils.request(WATCH_PAGE_URL, options)) || Promise.resolve('');
    }

    static getEmbedPageBody(id: string, options: YTDL_GetInfoOptions): Promise<string> {
        const EMBED_PAGE_URL = `${Urls.getEmbedUrl(id)}?hl=${options.lang || 'en'}`;

        return utils.request(EMBED_PAGE_URL, options);
    }
}
