"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2 = void 0;
const undici_1 = require("undici");
const Log_1 = require("../utils/Log");
const Url_1 = __importDefault(require("../utils/Url"));
const UserAgents_1 = __importDefault(require("../utils/UserAgents"));
const clients_1 = require("./clients");
const Cache_1 = require("./Cache");
/* Reference: LuanRT/YouTube.js */
const REGEX = { tvScript: new RegExp('<script\\s+id="base-js"\\s+src="([^"]+)"[^>]*><\\/script>'), clientIdentity: new RegExp('clientId:"(?<client_id>[^"]+)",[^"]*?:"(?<client_secret>[^"]+)"') };
class OAuth2 {
    isEnabled = false;
    accessToken = '';
    refreshToken = '';
    expiryDate = '';
    clientId;
    clientSecret;
    constructor(credentials) {
        if (!credentials) {
            return;
        }
        this.isEnabled = true;
        this.accessToken = credentials.accessToken;
        this.refreshToken = credentials.refreshToken;
        this.expiryDate = credentials.expiryDate;
        this.clientId = credentials.clientData?.clientId;
        this.clientSecret = credentials.clientData?.clientSecret;
        if (this.shouldRefreshToken()) {
            try {
                this.refreshAccessToken().finally(() => this.availableTokenCheck());
            }
            catch (err) { }
        }
        else {
            this.availableTokenCheck();
        }
        Cache_1.FileCache.set('oauth2', JSON.stringify(credentials));
    }
    async availableTokenCheck() {
        try {
            clients_1.Web.getPlayerResponse({
                videoId: 'dQw4w9WgXcQ',
                signatureTimestamp: parseInt(Cache_1.FileCache.get('html5Player')?.signatureTimestamp || '0') || 0,
                options: {
                    oauth2: this,
                },
            }).then(() => Log_1.Logger.debug('The specified OAuth2 token is successful.')).catch((err) => {
                if (err.error.message.includes('401')) {
                    this.error('Request using the specified token failed. (Web Client)');
                }
            });
        }
        catch (err) {
            if ((err.message || err.error.message).includes('401')) {
                this.error('Request using the specified token failed. (Web Client)');
            }
        }
    }
    error(message) {
        Log_1.Logger.error(message);
        Log_1.Logger.info('OAuth2 is disabled due to an error.');
        this.isEnabled = false;
    }
    async getClientData() {
        const OAUTH2_CACHE = Cache_1.FileCache.get('oauth2') || {};
        if (OAUTH2_CACHE.clientData?.clientId && OAUTH2_CACHE.clientData?.clientSecret) {
            return {
                clientId: OAUTH2_CACHE.clientData.clientId,
                clientSecret: OAUTH2_CACHE.clientData.clientSecret,
            };
        }
        const YT_TV_RESPONSE = await (0, undici_1.fetch)(Url_1.default.getTvUrl(), {
            headers: {
                'User-Agent': UserAgents_1.default.tv,
                Referer: Url_1.default.getTvUrl(),
            },
        });
        if (!YT_TV_RESPONSE.ok) {
            this.error('Failed to get client data: ' + YT_TV_RESPONSE.status);
            return null;
        }
        const YT_TV_HTML = await YT_TV_RESPONSE.text(), SCRIPT_PATH = REGEX.tvScript.exec(YT_TV_HTML)?.[1];
        if (SCRIPT_PATH) {
            Log_1.Logger.debug('Found YouTube TV script: ' + SCRIPT_PATH);
            const SCRIPT_RESPONSE = await (0, undici_1.fetch)(Url_1.default.getBaseUrl() + SCRIPT_PATH);
            if (!SCRIPT_RESPONSE.ok) {
                this.error('TV script request failed with status code: ' + SCRIPT_RESPONSE.status);
                return null;
            }
            const SCRIPT_STRING = await SCRIPT_RESPONSE.text(), CLIENT_ID = REGEX.clientIdentity.exec(SCRIPT_STRING)?.groups?.client_id, CLIENT_SECRET = REGEX.clientIdentity.exec(SCRIPT_STRING)?.groups?.client_secret;
            if (!CLIENT_ID || !CLIENT_SECRET) {
                this.error("Could not obtain client ID. Please create an issue in the repository for possible specification changes on YouTube's side.");
                return null;
            }
            Log_1.Logger.debug('Found client ID: ' + CLIENT_ID);
            Log_1.Logger.debug('Found client secret: ' + CLIENT_SECRET);
            Cache_1.FileCache.set('oauth2', JSON.stringify({ ...OAUTH2_CACHE, clientData: { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET } }));
            return { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET };
        }
        this.error("Could not obtain script URL. Please create an issue in the repository for possible specification changes on YouTube's side.");
        return null;
    }
    shouldRefreshToken() {
        if (!this.isEnabled) {
            return false;
        }
        return Date.now() >= new Date(this.expiryDate).getTime();
    }
    async refreshAccessToken() {
        if (!this.isEnabled) {
            return;
        }
        if (!this.clientId || !this.clientSecret) {
            const data = await this.getClientData();
            if (!data) {
                return;
            }
            this.clientId = data.clientId;
            this.clientSecret = data.clientSecret;
        }
        if (!this.refreshToken) {
            return this.error('Refresh token is missing, make sure it is specified.');
        }
        try {
            const PAYLOAD = {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: this.refreshToken,
                grant_type: 'refresh_token',
            }, REFRESH_API_RESPONSE = await (0, undici_1.fetch)(Url_1.default.getRefreshTokenApiUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(PAYLOAD),
            });
            if (!REFRESH_API_RESPONSE.ok) {
                return this.error(`Failed to refresh access token: ${REFRESH_API_RESPONSE.status}`);
            }
            const REFRESH_API_DATA = (await REFRESH_API_RESPONSE.json());
            if (REFRESH_API_DATA.error_code) {
                return this.error('Authorization server returned an error: ' + JSON.stringify(REFRESH_API_DATA));
            }
            this.expiryDate = new Date(Date.now() + REFRESH_API_DATA.expires_in * 1000).toISOString();
            this.accessToken = REFRESH_API_DATA.access_token;
        }
        catch (err) {
            this.error(err.message);
        }
    }
    getAccessToken() {
        return this.accessToken;
    }
}
exports.OAuth2 = OAuth2;
//# sourceMappingURL=OAuth2.js.map