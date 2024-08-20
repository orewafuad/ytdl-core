import { PassThrough } from 'stream';
import { YTDL_DownloadOptions } from './types/options';
import { YTDL_VideoInfo } from './types/youtube';
declare const ytdl: {
    (link: string, options?: YTDL_DownloadOptions): PassThrough;
    downloadFromInfo: typeof downloadFromInfo;
    getBasicInfo: typeof import("./info").getBasicInfo;
    getInfo: typeof import("./info").getInfo;
    chooseFormat: typeof import("./format-utils").chooseFormat;
    filterFormats: typeof import("./format-utils").filterFormats;
    validateID: typeof import("./url-utils").validateID;
    validateURL: typeof import("./url-utils").validateURL;
    getURLVideoID: typeof import("./url-utils").getURLVideoID;
    getVideoID: typeof import("./url-utils").getVideoID;
    createAgent: typeof import("./agent").createAgent;
    createProxyAgent: typeof import("./agent").createProxyAgent;
    cache: {
        info: import("./cache").Cache;
        watch: import("./cache").Cache;
    };
    version: string;
};
/** Can be used to download video after its `info` is gotten through
 * `ytdl.getInfo()`. In case the user might want to look at the
 * `info` object before deciding to download. */
declare function downloadFromInfo(info: YTDL_VideoInfo, options?: YTDL_DownloadOptions): PassThrough;
export default ytdl;
