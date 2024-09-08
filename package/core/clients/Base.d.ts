import { YT_PlayerApiResponse } from '../../types/youtube';
import { PlayerRequestError } from '../../core/errors';
import type { YTDL_ClientsParams } from '../../meta/Clients';
export default class Base {
    private static playError;
    static request<T = YT_PlayerApiResponse>(url: string, requestOptions: {
        payload: string;
        headers: Record<string, any>;
    }, params: YTDL_ClientsParams): Promise<{
        isError: boolean;
        error: PlayerRequestError | null;
        contents: T;
    }>;
}
