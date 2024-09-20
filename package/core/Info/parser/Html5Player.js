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
const Log_1 = require("../../../utils/Log");
const Fetcher_1 = __importDefault(require("../../../core/Fetcher"));
function getPlayerPathFromBody(body) {
    const HTML5_PLAYER_RES = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(body);
    return HTML5_PLAYER_RES ? HTML5_PLAYER_RES[1] || HTML5_PLAYER_RES[2] : null;
}
async function getPlayerPath(id, options) {
    const WATCH_PAGE_BODY_PROMISE = PageExtractor_1.default.getWatchPageBody(id, options), WATCH_PAGE_BODY = await WATCH_PAGE_BODY_PROMISE, PLAYER_PATH = getPlayerPathFromBody(WATCH_PAGE_BODY) || getPlayerPathFromBody(await PageExtractor_1.default.getEmbedPageBody(id, options));
    return PLAYER_PATH;
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
    const PLAYER_PATH = await getPlayerPath(id, options);
    let playerUrl = PLAYER_PATH ? new URL(PLAYER_PATH, Url_1.default.getBaseUrl()).toString() : null;
    if (!playerUrl && (options.originalProxy || options.originalProxyUrl)) {
        Log_1.Logger.debug('Could not get html5Player using your own proxy. It is retrieved again with its own proxy disabled. (Other requests will not invalidate it.)');
        const PATH = await getPlayerPath(id, {
            ...options,
            originalProxy: undefined,
            originalProxyUrl: undefined,
        });
        playerUrl = PATH ? new URL(PATH, Url_1.default.getBaseUrl()).toString() : null;
    }
    const HTML5_PLAYER_BODY = playerUrl ? await Fetcher_1.default.request(playerUrl, options) : '', DATA = {
        playerUrl,
        path: PLAYER_PATH,
        signatureTimestamp: playerUrl ? (await (0, Signature_1.getSignatureTimestamp)(HTML5_PLAYER_BODY)) || '' : '',
        playerBody: HTML5_PLAYER_BODY || null,
    };
    Cache_1.FileCache.set('html5Player', JSON.stringify(DATA));
    return DATA;
}
//# sourceMappingURL=Html5Player.js.map