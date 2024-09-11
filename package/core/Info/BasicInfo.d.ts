import { YTDL_GetInfoOptions } from '../../types/Options';
import { YTDL_VideoInfo } from '../../types/Ytdl';
/** Gets info from a video without getting additional formats. */
declare function _getBasicInfo(id: string, options: YTDL_GetInfoOptions, isFromGetInfo?: boolean): Promise<YTDL_VideoInfo>;
declare function getBasicInfo(link: string, options?: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo>;
export { _getBasicInfo };
export default getBasicInfo;
