type PlayerApiResponses = {
    web: YT_PlayerApiResponse | null;
    webCreator: YT_PlayerApiResponse | null;
    tvEmbedded: YT_PlayerApiResponse | null;
    ios: YT_PlayerApiResponse | null;
    android: YT_PlayerApiResponse | null;
    mweb: YT_PlayerApiResponse | null;
    tv: YT_PlayerApiResponse | null;
};
import { YT_PlayerApiResponse } from '../../../types/youtube';
import { YTDL_ClientsParams, YTDL_ClientTypes } from '../../../meta/Clients';
export default class PlayerApi {
    static getApiResponses(playerApiParams: YTDL_ClientsParams, clients: Array<YTDL_ClientTypes>): Promise<{
        isMinimalMode: boolean;
        responses: PlayerApiResponses;
    }>;
}
export {};
