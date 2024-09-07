import { PlayerRequestError } from '../../core/errors';
import type { YTDL_ClientsParams } from '../../meta/Clients';
import { YT_YTInitialPlayerResponse } from '../../types/youtube';
export default class Base {
    static request(url: string, requestOptions: {
        payload: string;
        headers: Record<string, any>;
    }, params: YTDL_ClientsParams): Promise<{
        isError: false;
        contents: YT_YTInitialPlayerResponse;
    } | {
        isError: true;
        contents: PlayerRequestError;
    }>;
}
