"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getHtml5Player;
const Url_1 = __importDefault(require("../../../utils/Url"));
const PageExtractor_1 = __importDefault(require("./PageExtractor"));
const Cache_1 = require("../../../core/Cache");
const Signature_1 = require("../../../core/Signature");
function getPlayerPath(body) {
    const HTML5_PLAYER_RES = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(body);
    return HTML5_PLAYER_RES ? HTML5_PLAYER_RES[1] || HTML5_PLAYER_RES[2] : null;
}
async function getHtml5Player(id, options) {
    const CACHE = Cache_1.FileCache.get('html5Player');
    if (CACHE) {
        return {
            playerUrl: CACHE.playerUrl,
            path: CACHE.path,
            signatureTimestamp: CACHE.signatureTimestamp,
        };
    }
    const WATCH_PAGE_BODY_PROMISE = PageExtractor_1.default.getWatchPageBody(id, options), WATCH_PAGE_BODY = await WATCH_PAGE_BODY_PROMISE, PLAYER_PATH = getPlayerPath(WATCH_PAGE_BODY) || getPlayerPath(await PageExtractor_1.default.getEmbedPageBody(id, options)), PLAYER_URL = PLAYER_PATH ? new URL(PLAYER_PATH, Url_1.default.getBaseUrl()).toString() : null;
    return {
        playerUrl: PLAYER_URL,
        path: PLAYER_PATH,
        signatureTimestamp: PLAYER_URL ? await (0, Signature_1.getSignatureTimestamp)(PLAYER_URL, options) || '' : '',
    };
}
//# sourceMappingURL=Html5Player.js.map