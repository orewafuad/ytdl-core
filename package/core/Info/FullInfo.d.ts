import { YTDL_GetInfoOptions } from '../../types/Options';
import { YTDL_VideoInfo } from '../../types/Ytdl';
/** @deprecated */
declare function getInfo(link: string, options?: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo>;
declare function getFullInfo(link: string, options?: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo>;
export { getInfo };
export default getFullInfo;
