type YTDL_Constructor = Omit<YTDL_DownloadOptions, 'format'> & {
    fetcher?: (url: URL | RequestInfo, options?: RequestInit) => Promise<Response>;
    logDisplay?: Array<'debug' | 'info' | 'success' | 'warning' | 'error'>;
};
import { YTDL_ChooseFormatOptions, YTDL_DownloadOptions, YTDL_GetInfoOptions, YTDL_ClientTypes, YTDL_Agent, YTDL_Hreflang, YTDL_GeoCountry, YTDL_VideoInfo } from './types';
import { OAuth2 } from './core/OAuth2';
import { Url } from './utils/Url';
import { FormatUtils } from './utils/Format';
declare class YtdlCore {
    static chooseFormat: typeof FormatUtils.chooseFormat;
    static filterFormats: typeof FormatUtils.filterFormats;
    static validateID: typeof Url.validateID;
    static validateURL: typeof Url.validateURL;
    static getURLVideoID: typeof Url.getURLVideoID;
    static getVideoID: typeof Url.getVideoID;
    static createAgent: any;
    static createProxyAgent: any;
    hl: YTDL_Hreflang;
    gl: YTDL_GeoCountry;
    requestOptions: any;
    rewriteRequest: YTDL_GetInfoOptions['rewriteRequest'];
    agent: YTDL_Agent | undefined;
    poToken: string | undefined;
    disablePoTokenAutoGeneration: boolean;
    visitorData: string | undefined;
    includesPlayerAPIResponse: boolean;
    includesNextAPIResponse: boolean;
    includesOriginalFormatData: boolean;
    includesRelatedVideo: boolean;
    clients: Array<YTDL_ClientTypes> | undefined;
    disableDefaultClients: boolean;
    oauth2: OAuth2 | null;
    parsesHLSFormat: boolean;
    originalProxy: YTDL_GetInfoOptions['originalProxy'];
    quality: YTDL_ChooseFormatOptions['quality'] | undefined;
    filter: YTDL_ChooseFormatOptions['filter'] | undefined;
    excludingClients: Array<YTDL_ClientTypes>;
    includingClients: Array<YTDL_ClientTypes> | 'all';
    range: YTDL_DownloadOptions['range'] | undefined;
    begin: YTDL_DownloadOptions['begin'] | undefined;
    liveBuffer: YTDL_DownloadOptions['liveBuffer'] | undefined;
    highWaterMark: YTDL_DownloadOptions['highWaterMark'] | undefined;
    IPv6Block: YTDL_DownloadOptions['IPv6Block'] | undefined;
    dlChunkSize: YTDL_DownloadOptions['dlChunkSize'] | undefined;
    version: string;
    private setPoToken;
    private setVisitorData;
    private setOAuth2;
    private automaticallyGeneratePoToken;
    private initializeHtml5PlayerCache;
    constructor({ hl, gl, requestOptions, rewriteRequest, agent, poToken, disablePoTokenAutoGeneration, visitorData, includesPlayerAPIResponse, includesNextAPIResponse, includesOriginalFormatData, includesRelatedVideo, clients, disableDefaultClients, oauth2Credentials, parsesHLSFormat, originalProxy, quality, filter, excludingClients, includingClients, range, begin, liveBuffer, highWaterMark, IPv6Block, dlChunkSize, disableFileCache, fetcher, logDisplay }?: YTDL_Constructor);
    private initializeOptions;
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    download(link: string, options?: YTDL_DownloadOptions): void;
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    downloadFromInfo(info: YTDL_VideoInfo, options?: YTDL_DownloadOptions): void;
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    getBasicInfo(link: string, options?: YTDL_DownloadOptions): void;
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    getFullInfo(link: string, options?: YTDL_DownloadOptions): void;
}
export { YtdlCore };
