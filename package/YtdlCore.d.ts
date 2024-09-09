type YTDL_Constructor = YTDL_DownloadOptions & {
    debug?: boolean;
};
import { PassThrough } from 'stream';
import { YTDL_ChooseFormatOptions, YTDL_DownloadOptions, YTDL_GetInfoOptions } from './types/Options';
import { YTDL_VideoInfo } from './types/Ytdl';
import { YTDL_Agent } from './types/Agent';
import { YTDL_Hreflang } from './types/Language';
import { getBasicInfo, getFullInfo, getInfo } from './core/Info';
import { createAgent, createProxyAgent } from './core/Agent';
import { OAuth2 } from './core/OAuth2';
import { YTDL_ClientTypes } from './meta/Clients';
import Url from './utils/Url';
import { chooseFormat, filterFormats } from './utils/Format';
declare function download(link: string, options?: YTDL_DownloadOptions): PassThrough;
declare class YtdlCore {
    static download: typeof download;
    static getBasicInfo: typeof getBasicInfo;
    /** @deprecated */
    static getInfo: typeof getInfo;
    static getFullInfo: typeof getFullInfo;
    static chooseFormat: typeof chooseFormat;
    static filterFormats: typeof filterFormats;
    static validateID: typeof Url.validateID;
    static validateURL: typeof Url.validateURL;
    static getURLVideoID: typeof Url.getURLVideoID;
    static getVideoID: typeof Url.getVideoID;
    static createAgent: typeof createAgent;
    static createProxyAgent: typeof createProxyAgent;
    static OAuth2: typeof OAuth2;
    lang: YTDL_Hreflang;
    requestOptions: any;
    rewriteRequest: YTDL_GetInfoOptions['rewriteRequest'];
    agent: YTDL_Agent | undefined;
    poToken: string | undefined;
    visitorData: string | undefined;
    includesPlayerAPIResponse: boolean;
    includesNextAPIResponse: boolean;
    includesOriginalFormatData: boolean;
    includesRelatedVideo: boolean;
    clients: Array<YTDL_ClientTypes> | undefined;
    disableDefaultClients: boolean;
    oauth2: OAuth2 | undefined;
    quality: YTDL_ChooseFormatOptions['quality'] | undefined;
    filter: YTDL_ChooseFormatOptions['filter'] | undefined;
    filteringClients: Array<YTDL_ClientTypes | 'unknown'>;
    range: YTDL_DownloadOptions['range'] | undefined;
    begin: YTDL_DownloadOptions['begin'] | undefined;
    liveBuffer: YTDL_DownloadOptions['liveBuffer'] | undefined;
    highWaterMark: YTDL_DownloadOptions['highWaterMark'] | undefined;
    IPv6Block: YTDL_DownloadOptions['IPv6Block'] | undefined;
    dlChunkSize: YTDL_DownloadOptions['dlChunkSize'] | undefined;
    version: string;
    constructor({ lang, requestOptions, rewriteRequest, agent, poToken, visitorData, includesPlayerAPIResponse, includesNextAPIResponse, includesOriginalFormatData, includesRelatedVideo, clients, disableDefaultClients, oauth2, quality, filter, filteringClients, range, begin, liveBuffer, highWaterMark, IPv6Block, dlChunkSize, debug }?: YTDL_Constructor);
    private setupOptions;
    download(link: string, options?: YTDL_DownloadOptions): PassThrough;
    downloadFromInfo(info: YTDL_VideoInfo, options?: YTDL_DownloadOptions): PassThrough;
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    getBasicInfo(link: string, options?: YTDL_DownloadOptions): Promise<YTDL_VideoInfo>;
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.)
     * @deprecated
     */
    getInfo(link: string, options?: YTDL_DownloadOptions): Promise<YTDL_VideoInfo>;
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    getFullInfo(link: string, options?: YTDL_DownloadOptions): Promise<YTDL_VideoInfo>;
}
export { YtdlCore };
