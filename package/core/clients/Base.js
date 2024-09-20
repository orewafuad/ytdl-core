"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../core/errors");
const Fetcher_1 = __importDefault(require("../../core/Fetcher"));
class Base {
    static playError(playerResponse) {
        const PLAYABILITY = playerResponse && playerResponse.playabilityStatus;
        if (!PLAYABILITY) {
            return null;
        }
        if (PLAYABILITY.status === 'ERROR' || PLAYABILITY.status === 'LOGIN_REQUIRED') {
            return new errors_1.UnrecoverableError(PLAYABILITY.reason || (PLAYABILITY.messages && PLAYABILITY.messages[0]));
        }
        else if (PLAYABILITY.status === 'LIVE_STREAM_OFFLINE') {
            return new errors_1.UnrecoverableError(PLAYABILITY.reason || 'The live stream is offline.');
        }
        else if (PLAYABILITY.status === 'UNPLAYABLE') {
            return new errors_1.UnrecoverableError(PLAYABILITY.reason || 'This video is unavailable.');
        }
        return null;
    }
    static request(url, requestOptions, params) {
        return new Promise(async (resolve, reject) => {
            const { jar, dispatcher } = params.options.agent || {}, HEADERS = {
                'Content-Type': 'application/json',
                cookie: jar?.getCookieStringSync('https://www.youtube.com'),
                'X-Goog-Visitor-Id': '6zpwvWUNAco' || params.options.visitorData,
                ...requestOptions.headers,
            }, OPTS = {
                requestOptions: {
                    method: 'POST',
                    dispatcher,
                    headers: HEADERS,
                    body: typeof requestOptions.payload === 'string' ? requestOptions.payload : JSON.stringify(requestOptions.payload),
                },
                rewriteRequest: params.options.rewriteRequest,
                originalProxy: params.options.originalProxy,
            }, IS_NEXT_API = url.includes('/next'), responseHandler = (response) => {
                const PLAY_ERROR = this.playError(response);
                if (PLAY_ERROR) {
                    if (OPTS.originalProxy) {
                        OPTS.originalProxy = undefined;
                        Fetcher_1.default.request(url, OPTS)
                            .then(responseHandler)
                            .catch((err) => {
                            reject({
                                isError: true,
                                error: err,
                                contents: null,
                            });
                        });
                        return;
                    }
                    return reject({
                        isError: true,
                        error: PLAY_ERROR,
                        contents: response,
                    });
                }
                if (!IS_NEXT_API && (!response.videoDetails || params.videoId !== response.videoDetails.videoId)) {
                    const ERROR = new errors_1.PlayerRequestError('Malformed response from YouTube');
                    ERROR.response = response;
                    return reject({
                        isError: true,
                        error: ERROR,
                        contents: response,
                    });
                }
                resolve({
                    isError: false,
                    error: null,
                    contents: response,
                });
            };
            try {
                Fetcher_1.default.request(url, OPTS)
                    .then(responseHandler)
                    .catch((err) => {
                    if (OPTS.originalProxy) {
                        OPTS.originalProxy = undefined;
                        Fetcher_1.default.request(url, OPTS)
                            .then(responseHandler)
                            .catch((err) => {
                            reject({
                                isError: true,
                                error: err,
                                contents: null,
                            });
                        });
                    }
                    reject({
                        isError: true,
                        error: err,
                        contents: null,
                    });
                });
            }
            catch (err) {
                reject({
                    isError: true,
                    error: err,
                    contents: null,
                });
            }
        });
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map