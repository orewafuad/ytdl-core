import { YTDL_VideoInfo } from '../../types';
import { InternalDownloadOptions } from '../../core/types';
declare function _getBasicInfo(id: string, options: InternalDownloadOptions, isFromGetInfo: boolean): Promise<YTDL_VideoInfo>;
declare function getBasicInfo(link: string, options: InternalDownloadOptions): Promise<YTDL_VideoInfo>;
export { _getBasicInfo, getBasicInfo };
