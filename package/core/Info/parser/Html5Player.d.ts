type Html5PlayerInfo = {
    playerUrl: string | null;
    path: string | null;
};
import type { YTDL_GetInfoOptions } from '../../../types/Options';
export default function getHtml5Player(id: string, options: YTDL_GetInfoOptions): Promise<Html5PlayerInfo>;
export {};
