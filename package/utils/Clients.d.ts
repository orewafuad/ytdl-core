type YTDL_ClientsParams = {
    videoId: string;
    signatureTimestamp: number;
    options: InternalDownloadOptions;
};
import type { OAuth2 } from '../core/OAuth2';
import { InternalDownloadOptions } from '../core/types';
declare class Clients {
    static getAuthorizationHeader(oauth2?: OAuth2 | null): {
        authorization: string;
    } | {
        authorization?: undefined;
    };
    static web({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            authorization: string;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        } | {
            authorization?: undefined;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static web_nextApi({ videoId, options: { poToken, visitorData, oauth2, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            authorization: string;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        } | {
            authorization?: undefined;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static webCreator({ videoId, signatureTimestamp, options: { poToken, visitorData, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static webEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static android({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            authorization: string;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        } | {
            authorization?: undefined;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static ios({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            authorization: string;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        } | {
            authorization?: undefined;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static mweb({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            authorization: string;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        } | {
            authorization?: undefined;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static tv({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            authorization: string;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        } | {
            authorization?: undefined;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static tvEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            authorization: string;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        } | {
            authorization?: undefined;
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
}
export type { YTDL_ClientsParams };
export { Clients };
