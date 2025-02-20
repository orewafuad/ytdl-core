import type { OAuth2 } from '@/core/OAuth2';
import type { YTDL_DownloadOptions } from '@/types';

export type UpperCaseClientTypes = 'Web' | 'WebCreator' | 'WebEmbedded' | 'Android' | 'Ios' | 'MWeb' | 'Tv' | 'TvEmbedded';

export type InternalDownloadOptions = YTDL_DownloadOptions & {
    oauth2: OAuth2 | null;
};

export type ClientsParams = {
    videoId: string;
    signatureTimestamp: number;
    options: InternalDownloadOptions;
};
