type NextApiResponses = {
    web: YT_NextApiResponse | null;
};
import { YT_NextApiResponse } from '../../../types/youtube';
import { YTDL_ClientsParams } from '../../../meta/Clients';
export default class NextApi {
    static getApiResponses(nextApiParams: YTDL_ClientsParams): Promise<NextApiResponses>;
}
export {};
