import { YTDL_ClientsParams } from '../../meta/Clients';
export default class WebCreator {
    static getPlayerResponse(params: YTDL_ClientsParams): Promise<{
        isError: false;
        contents: import("../../types/youtube").YT_YTInitialPlayerResponse;
    } | {
        isError: true;
        contents: import("../errors").PlayerRequestError;
    }>;
}
