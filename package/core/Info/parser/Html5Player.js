"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtml5Player = getHtml5Player;
const Platform_1 = require("../../../platforms/Platform");
const Signature_1 = require("../../../core/Signature");
const Url_1 = require("../../../utils/Url");
const Log_1 = require("../../../utils/Log");
const Fetcher_1 = require("../../../core/Fetcher");
const FileCache = Platform_1.Platform.getShim().fileCache;
function getPlayerId(body) {
    const MATCH = body.match(/player\/([a-zA-Z0-9]+)\//);
    if (MATCH) {
        return MATCH[1];
    }
    return null;
}
async function getHtml5Player(options) {
    const CACHE = await FileCache.get('html5Player');
    if (CACHE) {
        return {
            playerUrl: CACHE.playerUrl,
            signatureTimestamp: CACHE.signatureTimestamp,
        };
    }
    const PLAYER_BODY = await Fetcher_1.Fetcher.request(Url_1.Url.getIframeApiUrl(), options), PLAYER_ID = getPlayerId(PLAYER_BODY);
    let playerUrl = PLAYER_ID ? Url_1.Url.getPlayerJsUrl(PLAYER_ID) : null;
    if (!playerUrl && options.originalProxy) {
        Log_1.Logger.debug('Could not get html5Player using your own proxy. It is retrieved again with its own proxy disabled. (Other requests will not invalidate it.)');
        const BODY = await Fetcher_1.Fetcher.request(Url_1.Url.getIframeApiUrl(), {
            ...options,
            rewriteRequest: undefined,
            originalProxy: undefined,
        }), PLAYER_ID = getPlayerId(BODY);
        playerUrl = PLAYER_ID ? Url_1.Url.getPlayerJsUrl(PLAYER_ID) : null;
    }
    const HTML5_PLAYER_BODY = playerUrl ? await Fetcher_1.Fetcher.request(playerUrl, options) : '', DATA = {
        playerUrl,
        signatureTimestamp: playerUrl ? Signature_1.Signature.getSignatureTimestamp(HTML5_PLAYER_BODY) || '' : '',
        playerBody: HTML5_PLAYER_BODY || null,
    };
    FileCache.set('html5Player', JSON.stringify(DATA));
    return DATA;
}
//# sourceMappingURL=Html5Player.js.map