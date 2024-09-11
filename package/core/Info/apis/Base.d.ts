import { YTDL_ClientTypes } from '../../../meta/Clients';
import { YT_NextApiResponse, YT_PlayerApiResponse, YTDL_InnertubeResponseInfo } from '../../../types/youtube';
export default class ApiBase {
    static checkResponse<T = YT_PlayerApiResponse>(res: PromiseSettledResult<YTDL_InnertubeResponseInfo<YT_PlayerApiResponse | YT_NextApiResponse> | null>, client: YTDL_ClientTypes | 'next'): YTDL_InnertubeResponseInfo<T> | null;
}
