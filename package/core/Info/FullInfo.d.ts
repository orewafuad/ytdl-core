import { YTDL_GetInfoOptions } from '../../types/options';
import { YTDL_VideoInfo } from '../../types/youtube';
/** @deprecated */
declare function getInfo(link: string, options?: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo>;
declare function getFullInfo(link: string, options?: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo>;
export { getInfo };
export default getFullInfo;
