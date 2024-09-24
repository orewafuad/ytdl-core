import { YtdlCore_Cache } from './utils/Classes';
import { YTDL_DownloadOptions } from '@/types';

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

export class Platform {
    static #shim: YtdlCore_Shim | undefined;

    static load(shim: YtdlCore_Shim) {
        shim.fileCache.initialization();

        this.#shim = shim;
    }

    static getShim() {
        if (!this.#shim) {
            throw new Error('Platform is not loaded');
        }

        return this.#shim;
    }
}
