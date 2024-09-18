import { YTDL_RequestOptions } from '../types/Options';
export default class Fetcher {
    static request<T = unknown>(url: string, { requestOptions, rewriteRequest, originalProxyUrl }?: YTDL_RequestOptions): Promise<T>;
}
