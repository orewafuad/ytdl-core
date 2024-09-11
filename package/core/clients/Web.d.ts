import { YTDL_ClientsParams } from '../../meta/Clients';
export default class Web {
    static getPlayerResponse(params: YTDL_ClientsParams): Promise<import("../../types/youtube").YTDL_InnertubeResponseInfo<import("../../types/youtube").YT_PlayerApiResponse>>;
    static getNextResponse(params: YTDL_ClientsParams): Promise<import("../../types/youtube").YTDL_InnertubeResponseInfo<import("../../types/youtube").YT_PlayerApiResponse>>;
}
