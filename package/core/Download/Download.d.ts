import type { YTDL_VideoInfo } from '../../types';
import { InternalDownloadOptions } from '../../core/types';
declare function downloadFromInfo(info: YTDL_VideoInfo, options: InternalDownloadOptions): void;
declare function download(link: string, options: InternalDownloadOptions): void;
export { download, downloadFromInfo };
