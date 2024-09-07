"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getHtml5Player;
const Url_1 = __importDefault(require("../../../utils/Url"));
const PageExtractor_1 = __importDefault(require("./PageExtractor"));
function getPlayerPath(body) {
    const HTML5_PLAYER_RES = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(body);
    return HTML5_PLAYER_RES ? HTML5_PLAYER_RES[1] || HTML5_PLAYER_RES[2] : null;
}
async function getHtml5Player(id, options) {
    const WATCH_PAGE_BODY_PROMISE = PageExtractor_1.default.getWatchPageBody(id, options), EMBED_PAGE_BODY_PROMISE = PageExtractor_1.default.getEmbedPageBody(id, options), PLAYER_PATH = getPlayerPath(await WATCH_PAGE_BODY_PROMISE) || getPlayerPath(await EMBED_PAGE_BODY_PROMISE);
    return {
        playerUrl: PLAYER_PATH ? new URL(PLAYER_PATH, Url_1.default.getBaseUrl()).toString() : null,
        path: PLAYER_PATH,
    };
}
//# sourceMappingURL=Html5Player.js.map