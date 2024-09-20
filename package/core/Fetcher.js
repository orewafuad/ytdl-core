"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
const errors_1 = require("./errors");
const Log_1 = require("../utils/Log");
const path_1 = __importDefault(require("path"));
function getCaller() {
    const ERROR_STACK = new Error().stack || '', STACK_LINES = ERROR_STACK.split('\n'), CALLER_INDEX = STACK_LINES.findIndex((line) => line.includes('getCaller')) + 2;
    if (STACK_LINES[CALLER_INDEX]) {
        const FILE_PATH = STACK_LINES[CALLER_INDEX].trim().split(' ')[1];
        if (!FILE_PATH.includes('C:\\')) {
            return FILE_PATH;
        }
        const PARSED = path_1.default.parse(FILE_PATH);
        return PARSED.name + PARSED.ext;
    }
    return 'Unknown';
}
class Fetcher {
    static async request(url, { requestOptions, rewriteRequest, originalProxy } = {}) {
        if (typeof rewriteRequest === 'function') {
            const WROTE_REQUEST = rewriteRequest(url, requestOptions, { isDownloadUrl: false });
            requestOptions = WROTE_REQUEST.options;
            url = WROTE_REQUEST.url;
        }
        if (originalProxy) {
            try {
                const PARSED = new URL(originalProxy.base);
                if (!url.includes(PARSED.host)) {
                    url = `${PARSED.protocol}//${PARSED.host}/?url=${encodeURIComponent(url)}`;
                }
            }
            catch { }
        }
        Log_1.Logger.debug(`[ Request ]: <magenta>${requestOptions?.method || 'GET'}</magenta> -> ${url} (From ${getCaller()})`);
        const REQUEST_RESULTS = await (0, undici_1.request)(url, requestOptions), STATUS_CODE = REQUEST_RESULTS.statusCode.toString(), LOCATION = REQUEST_RESULTS.headers['location'] || null;
        if (STATUS_CODE.startsWith('2')) {
            const CONTENT_TYPE = REQUEST_RESULTS.headers['content-type'] || '';
            if (CONTENT_TYPE.includes('application/json')) {
                return REQUEST_RESULTS.body.json();
            }
            return REQUEST_RESULTS.body.text();
        }
        else if (STATUS_CODE.startsWith('3') && LOCATION) {
            return this.request(LOCATION.toString(), { requestOptions, rewriteRequest, originalProxy });
        }
        const ERROR = new errors_1.RequestError(`Status Code: ${STATUS_CODE}`);
        ERROR.statusCode = REQUEST_RESULTS.statusCode;
        throw ERROR;
    }
}
exports.default = Fetcher;
//# sourceMappingURL=Fetcher.js.map