import { PassThrough } from 'stream';
import { YTDL_DownloadOptions } from './types/Options';
import { YTDL_VideoInfo } from './types/Ytdl';
import { getBasicInfo, getFullInfo, getInfo } from './core/Info';
import { createAgent, createProxyAgent } from './core/Agent';
import { OAuth2 } from './core/OAuth2';
import Url from './utils/Url';
import { chooseFormat, filterFormats } from './utils/Format';
import { VERSION } from './utils/constants';
/** @deprecated */
declare const ytdl: {
    (link: string, options?: YTDL_DownloadOptions): PassThrough;
    downloadFromInfo: typeof downloadFromInfo;
    getBasicInfo: typeof getBasicInfo;
    getInfo: typeof getInfo;
    getFullInfo: typeof getFullInfo;
    chooseFormat: typeof chooseFormat;
    filterFormats: typeof filterFormats;
    validateID: typeof Url.validateID;
    validateURL: typeof Url.validateURL;
    getURLVideoID: typeof Url.getURLVideoID;
    getVideoID: typeof Url.getVideoID;
    createAgent: typeof createAgent;
    createProxyAgent: typeof createProxyAgent;
    OAuth2: typeof OAuth2;
    version: string;
};
/** Can be used to download video after its `info` is gotten through
 * `ytdl.getFullInfo()`. In case the user might want to look at the
 * `info` object before deciding to download. */
declare function downloadFromInfo(info: YTDL_VideoInfo, options?: YTDL_DownloadOptions): PassThrough;
export { downloadFromInfo, getBasicInfo, getInfo, chooseFormat, filterFormats, createAgent, createProxyAgent, OAuth2, VERSION };
export default ytdl;
