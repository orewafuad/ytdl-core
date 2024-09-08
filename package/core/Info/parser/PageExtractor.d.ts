import type { YTDL_GetInfoOptions } from '../../../types/Options';
export default class YouTubePageExtractor {
    static getWatchHtmlUrl(id: string, options: YTDL_GetInfoOptions): string;
    static getWatchPageBody(id: string, options: YTDL_GetInfoOptions): Promise<string>;
    static getEmbedPageBody(id: string, options: YTDL_GetInfoOptions): Promise<string>;
}
