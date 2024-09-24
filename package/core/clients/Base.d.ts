import type { YT_PlayerApiResponse, YTDL_InnertubeResponseInfo } from '../../types';
import type { YTDL_ClientsParams } from '../../utils/Clients';
export default class Base {
    private static playError;
    static request<T = YT_PlayerApiResponse>(url: string, requestOptions: {
        payload: string;
        headers: Record<string, any>;
    }, params: YTDL_ClientsParams): Promise<YTDL_InnertubeResponseInfo<T>>;
}
