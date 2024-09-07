"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../core/errors");
const utils_1 = __importDefault(require("../../utils"));
class Base {
    static request(url, requestOptions, params) {
        return new Promise(async (resolve, reject) => {
            const { jar, dispatcher } = params.options.agent || {}, HEADERS = {
                'Content-Type': 'application/json',
                cookie: jar?.getCookieStringSync('https://www.youtube.com'),
                'X-Goog-Visitor-Id': params.options.visitorData,
                ...requestOptions.headers,
            }, OPTS = {
                requestOptions: {
                    method: 'POST',
                    dispatcher,
                    headers: HEADERS,
                    body: typeof requestOptions.payload === 'string' ? requestOptions.payload : JSON.stringify(requestOptions.payload),
                },
            }, RESPONSE = await utils_1.default.request(url, OPTS), PLAY_ERROR = utils_1.default.playError(RESPONSE);
            if (PLAY_ERROR) {
                return reject({
                    isError: true,
                    error: PLAY_ERROR,
                    contents: RESPONSE,
                });
            }
            if (!RESPONSE.videoDetails || params.videoId !== RESPONSE.videoDetails.videoId) {
                const ERROR = new errors_1.PlayerRequestError('Malformed response from YouTube');
                ERROR.response = RESPONSE;
                return reject({
                    isError: true,
                    error: ERROR,
                    contents: RESPONSE,
                });
            }
            resolve({
                isError: false,
                error: null,
                contents: RESPONSE,
            });
        });
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map