import { YTDL_OAuth2Credentials } from '../types/options';
export declare class OAuth2 {
    isEnabled: boolean;
    accessToken: string;
    refreshToken: string;
    expiryDate: string;
    clientId?: string;
    clientSecret?: string;
    constructor(credentials?: YTDL_OAuth2Credentials);
    private getClientData;
    shouldRefreshToken(): boolean;
    refreshAccessToken(): Promise<void>;
    getAccessToken(): string;
}
