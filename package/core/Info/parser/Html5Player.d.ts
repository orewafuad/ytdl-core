type Html5PlayerInfo = {
    playerUrl: string | null;
    signatureTimestamp: string;
    playerBody: string | null;
};
import type { YTDL_GetInfoOptions } from '../../../types/Options';
declare function getHtml5Player(options: YTDL_GetInfoOptions): Promise<Html5PlayerInfo>;
export { getHtml5Player };
