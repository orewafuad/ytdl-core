type NextApiResponses = {
    web: YT_NextApiResponse | null;
};
import type { YT_NextApiResponse } from '../../../types';
import { YTDL_ClientsParams } from '../../../utils/Clients';
export default class NextApi {
    static getApiResponses(nextApiParams: YTDL_ClientsParams): Promise<NextApiResponses>;
}
export {};
