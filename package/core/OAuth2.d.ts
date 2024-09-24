import { YTDL_OAuth2Credentials, YTDL_ProxyOptions } from '@/types/Options';
export declare class OAuth2 {
    private proxyOptions?;
    isEnabled: boolean;
    credentials: YTDL_OAuth2Credentials;
    accessToken: string;
    refreshToken: string;
    expiryDate: string;
    clientId?: string;
    clientSecret?: string;
    constructor(credentials: YTDL_OAuth2Credentials | null, proxyOptions: YTDL_ProxyOptions);
    private availableTokenCheck;
    private error;
    private getClientData;
    shouldRefreshToken(): boolean;
    refreshAccessToken(): Promise<void>;
    getAccessToken(): string;
    getCredentials(): YTDL_OAuth2Credentials;
}
