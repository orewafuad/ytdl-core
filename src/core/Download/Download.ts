import { InternalDownloadOptions } from '@/core/types';
import { YTDL_VideoInfo } from '@/types';

function downloadFromInfo(info: YTDL_VideoInfo, options: InternalDownloadOptions) {}
function download(link: string, options: InternalDownloadOptions) {}

export { download, downloadFromInfo };
