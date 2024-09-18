"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
const errors_1 = require("./errors");
class Fetcher {
    static async request(url, { requestOptions, rewriteRequest, originalProxyUrl } = {}) {
        if (typeof rewriteRequest === 'function') {
            const WROTE_REQUEST = rewriteRequest(url, requestOptions);
            requestOptions = WROTE_REQUEST.options;
            url = WROTE_REQUEST.url;
        }
        if (originalProxyUrl) {
            const PARSED = new URL(originalProxyUrl);
            url = `${PARSED.protocol}//${PARSED.host}/?url=${encodeURIComponent(url)}`;
        }
        const REQUEST_RESULTS = await (0, undici_1.request)(url, requestOptions), STATUS_CODE = REQUEST_RESULTS.statusCode.toString(), LOCATION = REQUEST_RESULTS.headers['location'] || null;
        if (STATUS_CODE.startsWith('2')) {
            const CONTENT_TYPE = REQUEST_RESULTS.headers['content-type'] || '';
            if (CONTENT_TYPE.includes('application/json')) {
                return REQUEST_RESULTS.body.json();
            }
            return REQUEST_RESULTS.body.text();
        }
        else if (STATUS_CODE.startsWith('3') && LOCATION) {
            return this.request(LOCATION.toString(), { requestOptions, rewriteRequest, originalProxyUrl });
        }
        const ERROR = new errors_1.RequestError(`Status Code: ${STATUS_CODE}`);
        ERROR.statusCode = REQUEST_RESULTS.statusCode;
        throw ERROR;
    }
}
exports.default = Fetcher;
//# sourceMappingURL=Fetcher.js.map