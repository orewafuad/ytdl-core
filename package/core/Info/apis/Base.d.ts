import type { YT_NextApiResponse, YT_PlayerApiResponse, YTDL_InnertubeResponseInfo, YTDL_ClientTypes } from '../../../types';
export default class ApiBase {
    static checkResponse<T = YT_PlayerApiResponse>(res: PromiseSettledResult<YTDL_InnertubeResponseInfo<YT_PlayerApiResponse | YT_NextApiResponse> | null>, client: YTDL_ClientTypes | 'next'): YTDL_InnertubeResponseInfo<T> | null;
}
