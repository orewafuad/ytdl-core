import { YTDL_GetInfoOptions } from '../../types/options';
import { YTDL_VideoInfo } from '../../types/youtube';
declare function _getBasicInfo(id: string, options: YTDL_GetInfoOptions, isFromGetInfo?: boolean): Promise<YTDL_VideoInfo>;
declare function getBasicInfo(link: string, options?: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo>;
export { _getBasicInfo };
export default getBasicInfo;
