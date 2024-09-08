import { YTDL_RequestOptions } from '../types/Options';
export default class Fetcher {
    static request<T = unknown>(url: string, options?: YTDL_RequestOptions): Promise<T>;
}
