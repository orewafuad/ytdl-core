import { YTDL_OAuth2Credentials } from '../types/Options';
export declare class OAuth2 {
    isEnabled: boolean;
    accessToken: string;
    refreshToken: string;
    expiryDate: string;
    private clientId?;
    private clientSecret?;
    constructor(credentials?: YTDL_OAuth2Credentials);
    private getClientData;
    shouldRefreshToken(): boolean;
    refreshAccessToken(): Promise<void>;
    getAccessToken(): string;
}
