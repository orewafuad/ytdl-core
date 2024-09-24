import type { YTDL_OAuth2Credentials } from '../types/Options';
export declare class OAuth2 {
    isEnabled: boolean;
    credentials: YTDL_OAuth2Credentials;
    accessToken: string;
    refreshToken: string;
    expiryDate: string;
    clientId?: string;
    clientSecret?: string;
    constructor(credentials: YTDL_OAuth2Credentials | null);
    private availableTokenCheck;
    private error;
    private getClientData;
    shouldRefreshToken(): boolean;
    refreshAccessToken(): Promise<void>;
    getAccessToken(): string;
    getCredentials(): YTDL_OAuth2Credentials;
}
