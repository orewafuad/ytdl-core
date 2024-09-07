import { PlayerRequestError } from '@/core/errors';
import type { YTDL_ClientsParams } from '@/meta/Clients';
import type { YTDL_GetInfoOptions } from '@/types/options';
import { YT_YTInitialPlayerResponse } from '@/types/youtube';
import utils from '@/utils';

export default class Base {
    static request(url: string, requestOptions: { payload: string; headers: Record<string, any> }, params: YTDL_ClientsParams): Promise<{ isError: boolean; error: PlayerRequestError | null; contents: YT_YTInitialPlayerResponse }> {
        return new Promise(async (resolve, reject) => {
            const { jar, dispatcher } = params.options.agent || {},
                HEADERS = {
                    'Content-Type': 'application/json',
                    cookie: jar?.getCookieStringSync('https://www.youtube.com'),
                    'X-Goog-Visitor-Id': params.options.visitorData,
                    ...requestOptions.headers,
                },
                OPTS: YTDL_GetInfoOptions = {
                    requestOptions: {
                        method: 'POST',
                        dispatcher,
                        headers: HEADERS,
                        body: typeof requestOptions.payload === 'string' ? requestOptions.payload : JSON.stringify(requestOptions.payload),
                    },
                },
                RESPONSE = await utils.request<YT_YTInitialPlayerResponse>(url, OPTS),
                PLAY_ERROR = utils.playError(RESPONSE);

            if (PLAY_ERROR) {
                return reject({
                    isError: true,
                    error: PLAY_ERROR,
                    contents: RESPONSE,
                });
            }

            if (!RESPONSE.videoDetails || params.videoId !== RESPONSE.videoDetails.videoId) {
                const ERROR = new PlayerRequestError('Malformed response from YouTube');
                ERROR.response = RESPONSE;

                return reject({
                    isError: true,
                    error: ERROR,
                    contents: RESPONSE,
                });
            }

            resolve({
                isError: false,
                error: null,
                contents: RESPONSE,
            });
        });
    }
}
