"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getWatchHTMLPageInfo;
const Utils_1 = __importDefault(require("../../../utils/Utils"));
const PageExtractor_1 = __importDefault(require("./PageExtractor"));
const Html5Player_1 = __importDefault(require("./Html5Player"));
const JSON_CLOSING_CHARS = /^[)\]}'\s]+/;
function parseJSON(source, varName, json) {
    if (!json || typeof json === 'object') {
        return json;
    }
    else {
        try {
            json = json.replace(JSON_CLOSING_CHARS, '');
            return JSON.parse(json);
        }
        catch (err) {
            throw Error(`Error parsing ${varName} in ${source}: ${err.message}`);
        }
    }
}
function findJSON(source, varName, body, left, right, prependJSON) {
    const JSON_STR = Utils_1.default.between(body, left, right);
    if (!JSON_STR) {
        throw Error(`Could not find ${varName} in ${source}`);
    }
    return parseJSON(source, varName, Utils_1.default.cutAfterJS(`${prependJSON}${JSON_STR}`));
}
function findPlayerResponse(source, info) {
    const PLAYER_RESPONSE = info && ((info.args && info.args.player_response) || info.player_response || info.playerResponse || info.embedded_player_response);
    return parseJSON(source, 'player_response', PLAYER_RESPONSE);
}
async function getWatchHTMLPageInfo(id, options) {
    const BODY = await PageExtractor_1.default.getWatchPageBody(id, options), INFO = { page: 'watch' };
    try {
        try {
            INFO.player_response = Utils_1.default.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', '}};', '', '}}') || Utils_1.default.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', ';var') || Utils_1.default.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', ';</script>') || findJSON('watch.html', 'player_response', BODY, /\bytInitialPlayerResponse\s*=\s*\{/i, '</script>', '{') || null;
        }
        catch (err) {
            const ARGS = findJSON('watch.html', 'player_response', BODY, /\bytplayer\.config\s*=\s*{/, '</script>', '{');
            INFO.player_response = findPlayerResponse('watch.html', ARGS);
        }
        INFO.response = Utils_1.default.tryParseBetween(BODY, 'var ytInitialData = ', '}};', '', '}}') || Utils_1.default.tryParseBetween(BODY, 'var ytInitialData = ', ';</script>') || Utils_1.default.tryParseBetween(BODY, 'window["ytInitialData"] = ', '}};', '', '}}') || Utils_1.default.tryParseBetween(BODY, 'window["ytInitialData"] = ', ';</script>') || findJSON('watch.html', 'response', BODY, /\bytInitialData("\])?\s*=\s*\{/i, '</script>', '{');
        INFO.html5Player = (await (0, Html5Player_1.default)(id, options)).playerUrl;
    }
    catch (err) {
        throw Error('Error when parsing watch.html, maybe YouTube made a change.\n' + `Please report this issue with the "${Utils_1.default.saveDebugFile('watch.html', BODY)}" file on https://github.com/ybd-project/ytdl-core/issues.`);
    }
    return INFO;
}
//# sourceMappingURL=WatchPage.js.map