import { YTDL_ClientsParams } from '../../utils/Clients';
export default class Android {
    static getPlayerResponse(params: YTDL_ClientsParams): Promise<import("../../types").YTDL_InnertubeResponseInfo<import("../../types").YT_PlayerApiResponse>>;
}
