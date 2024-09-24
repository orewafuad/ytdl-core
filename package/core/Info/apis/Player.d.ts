type PlayerApiResponses = {
    web: YT_PlayerApiResponse | null;
    webCreator: YT_PlayerApiResponse | null;
    webEmbedded: YT_PlayerApiResponse | null;
    tvEmbedded: YT_PlayerApiResponse | null;
    ios: YT_PlayerApiResponse | null;
    android: YT_PlayerApiResponse | null;
    mweb: YT_PlayerApiResponse | null;
    tv: YT_PlayerApiResponse | null;
};
import type { YT_PlayerApiResponse, YTDL_ClientTypes } from '../../../types';
import type { YTDL_ClientsParams } from '../../../utils/Clients';
export default class PlayerApi {
    static getApiResponses(playerApiParams: YTDL_ClientsParams, clients: Array<YTDL_ClientTypes>): Promise<{
        isMinimalMode: boolean;
        responses: PlayerApiResponses;
    }>;
}
export {};
