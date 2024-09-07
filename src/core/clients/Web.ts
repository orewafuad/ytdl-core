import { Clients, YTDL_ClientsParams } from '@/meta/Clients';
import Base from './Base';

export default class Web {
    static async getPlayerResponse(params: YTDL_ClientsParams) {
        const { url, payload, headers } = Clients.web(params);

        return await Base.request(url, { payload, headers }, params);
    }
}
