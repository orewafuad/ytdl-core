import { YtdlCore_Cache } from './utils/Classes';
import { YTDL_DownloadOptions } from '../types';
interface YtdlCore_Shim {
    runtime: 'default' | 'browser' | 'serverless';
    server: boolean;
    cache: YtdlCore_Cache;
    fileCache: YtdlCore_Cache;
    default: {
        options: YTDL_DownloadOptions;
        proxy: {
            rewriteRequest: YTDL_DownloadOptions['rewriteRequest'];
            originalProxy: YTDL_DownloadOptions['originalProxy'] | null;
        };
    };
    info: {
        version: string;
        repoUrl: string;
        issuesUrl: string;
    };
}
export declare class Platform {
    #private;
    static load(shim: YtdlCore_Shim): void;
    static getShim(): YtdlCore_Shim;
}
export {};
