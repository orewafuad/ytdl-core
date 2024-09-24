import { YTDL_DownloadOptions } from '@/types';
import { YtdlCore_Cache } from './utils/Classes';
interface YtdlCore_Shim {
    runtime: 'default' | 'browser' | 'serverless';
    server: boolean;
    cache: YtdlCore_Cache;
    fileCache: YtdlCore_Cache;
    fetcher: (url: URL | RequestInfo, options?: RequestInit) => Promise<Response>;
    poToken: () => Promise<{
        poToken: string;
        visitorData: string;
    }>;
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
