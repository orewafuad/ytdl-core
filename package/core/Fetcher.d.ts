import { YTDL_RequestOptions } from '@/types/Options';
declare class Fetcher {
    static request<T = unknown>(url: string, { requestOptions, rewriteRequest, originalProxy }?: YTDL_RequestOptions): Promise<T>;
}
export { Fetcher };
