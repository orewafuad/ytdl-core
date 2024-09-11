import { YTDL_DownloadOptions } from '../types/Options';
export default class DownloadOptionsUtils {
    static applyDefaultAgent(options: YTDL_DownloadOptions): void;
    static applyOldLocalAddress(options: YTDL_DownloadOptions): void;
    static applyIPv6Rotations(options: YTDL_DownloadOptions): void;
    static applyDefaultHeaders(options: YTDL_DownloadOptions): void;
}
