"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CLIENTS_NUMBER;
(function (CLIENTS_NUMBER) {
    CLIENTS_NUMBER[CLIENTS_NUMBER["WEB"] = 0] = "WEB";
    CLIENTS_NUMBER[CLIENTS_NUMBER["WEBCREATOR"] = 1] = "WEBCREATOR";
    CLIENTS_NUMBER[CLIENTS_NUMBER["TVEMBEDDED"] = 2] = "TVEMBEDDED";
    CLIENTS_NUMBER[CLIENTS_NUMBER["IOS"] = 3] = "IOS";
    CLIENTS_NUMBER[CLIENTS_NUMBER["ANDROID"] = 4] = "ANDROID";
    CLIENTS_NUMBER[CLIENTS_NUMBER["MWEB"] = 5] = "MWEB";
    CLIENTS_NUMBER[CLIENTS_NUMBER["TV"] = 6] = "TV";
})(CLIENTS_NUMBER || (CLIENTS_NUMBER = {}));
const clients_1 = require("../../../core/clients");
const errors_1 = require("../../../core/errors");
const Log_1 = require("../../../utils/Log");
const Base_1 = __importDefault(require("./Base"));
const CONTINUES_NOT_POSSIBLE_ERRORS = ['This video is private'];
class PlayerApi {
    static async getApiResponses(playerApiParams, clients) {
        const PLAYER_API_PROMISE = {
            web: clients.includes('web') ? clients_1.Web.getPlayerResponse(playerApiParams) : Promise.reject(null),
            webCreator: clients.includes('webCreator') ? clients_1.WebCreator.getPlayerResponse(playerApiParams) : Promise.reject(null),
            tvEmbedded: clients.includes('tvEmbedded') ? clients_1.TvEmbedded.getPlayerResponse(playerApiParams) : Promise.reject(null),
            ios: clients.includes('ios') ? clients_1.Ios.getPlayerResponse(playerApiParams) : Promise.reject(null),
            android: clients.includes('android') ? clients_1.Android.getPlayerResponse(playerApiParams) : Promise.reject(null),
            mweb: clients.includes('mweb') ? clients_1.MWeb.getPlayerResponse(playerApiParams) : Promise.reject(null),
            tv: clients.includes('tv') ? clients_1.Tv.getPlayerResponse(playerApiParams) : Promise.reject(null),
        }, PLAYER_API_PROMISES = await Promise.allSettled(Object.values(PLAYER_API_PROMISE)), PLAYER_API_RESPONSES = {
            web: null,
            webCreator: null,
            tvEmbedded: null,
            ios: null,
            android: null,
            mweb: null,
            tv: null,
        };
        clients.forEach((client) => {
            const CLIENT_NUMBER = client.toUpperCase();
            PLAYER_API_RESPONSES[client] = Base_1.default.checkResponse(PLAYER_API_PROMISES[CLIENTS_NUMBER[CLIENT_NUMBER]], client)?.contents || null;
        });
        const IS_MINIMUM_MODE = PLAYER_API_PROMISES.every((r) => r.status === 'rejected');
        if (IS_MINIMUM_MODE) {
            const ERROR_TEXT = `All player APIs responded with an error. (Clients: ${clients.join(', ')})\nFor more information, specify YTDL_DEBUG as an environment variable.`;
            if (PLAYER_API_RESPONSES.ios && (CONTINUES_NOT_POSSIBLE_ERRORS.includes(PLAYER_API_RESPONSES.ios?.playabilityStatus.reason || '') || !PLAYER_API_RESPONSES.ios.videoDetails)) {
                throw new errors_1.UnrecoverableError(ERROR_TEXT + `\nNote: This error cannot continue processing. (Details: ${JSON.stringify(PLAYER_API_RESPONSES.ios.playabilityStatus.reason)})`);
            }
            if (!PLAYER_API_RESPONSES.web) {
                Log_1.Logger.info('As a fallback to obtain the minimum information, the web client is forced to adapt.');
                const WEB_CLIENT_PROMISE = (await Promise.allSettled([clients_1.Web.getPlayerResponse(playerApiParams)]))[0];
                PLAYER_API_RESPONSES.web = Base_1.default.checkResponse(WEB_CLIENT_PROMISE, 'web')?.contents || null;
            }
            Log_1.Logger.error(ERROR_TEXT);
            Log_1.Logger.info('Only minimal information is available, as information from the Player API is not available.');
        }
        return {
            isMinimalMode: IS_MINIMUM_MODE,
            responses: PLAYER_API_RESPONSES,
        };
    }
}
exports.default = PlayerApi;
//# sourceMappingURL=Player.js.map