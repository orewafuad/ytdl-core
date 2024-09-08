type YTDL_ClientTypes = 'web' | 'webCreator' | 'android' | 'ios' | 'mweb' | 'tv' | 'tvEmbedded';
type YTDL_ClientData = {
    context: {
        client: {
            clientName: string;
            clientVersion: string;
            userAgent: string;
            visitorData?: string;
            hl?: string;
            osName?: string;
            osVersion?: string;
            deviceMake?: string;
            deviceModel?: string;
            originalUrl?: string;
            androidSdkVersion?: number;
        };
        thirdParty?: {
            embedUrl: 'https://www.youtube.com/';
        };
    };
    clientName: number;
    apiInfo: {
        key?: string;
    };
};
type YTDL_ClientsParams = {
    videoId: string;
    signatureTimestamp: number;
    options: YTDL_GetInfoOptions;
};
import type { OAuth2 } from '../core/OAuth2';
import { YTDL_GetInfoOptions } from '../types/Options';
declare const INNERTUBE_BASE_API_URL = "https://www.youtube.com/youtubei/v1", INNERTUBE_CLIENTS: Record<YTDL_ClientTypes, YTDL_ClientData>;
declare class Clients {
    static getAuthorizationHeader(oauth2?: OAuth2): {
        authorization: string;
    } | {
        authorization?: undefined;
    };
    static web({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }: YTDL_ClientsParams): {
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
    static web_nextApi({ videoId, options: { poToken, visitorData, oauth2 } }: YTDL_ClientsParams): {
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
    static webCreator({ videoId, signatureTimestamp, options: { poToken, visitorData, lang } }: YTDL_ClientsParams): {
        url: string;
        payload: any;
        headers: {
            'X-YouTube-Client-Name': number;
            'X-Youtube-Client-Version': string;
            'X-Goog-Visitor-Id': string | undefined;
            'User-Agent': string;
        };
    };
    static android({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }: YTDL_ClientsParams): {
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
    static ios({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }: YTDL_ClientsParams): {
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
    static mweb({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }: YTDL_ClientsParams): {
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
    static tv({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }: YTDL_ClientsParams): {
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
    static tvEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }: YTDL_ClientsParams): {
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
export { Clients, INNERTUBE_BASE_API_URL, INNERTUBE_CLIENTS, YTDL_ClientTypes, YTDL_ClientsParams };
export default Clients;
