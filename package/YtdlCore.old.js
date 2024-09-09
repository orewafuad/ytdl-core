"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.OAuth2 = exports.createProxyAgent = exports.createAgent = exports.filterFormats = exports.chooseFormat = exports.getInfo = exports.getBasicInfo = void 0;
exports.downloadFromInfo = downloadFromInfo;
const stream_1 = require("stream");
const miniget_1 = __importDefault(require("miniget"));
const m3u8stream_1 = __importStar(require("m3u8stream"));
const Info_1 = require("./core/Info");
Object.defineProperty(exports, "getBasicInfo", { enumerable: true, get: function () { return Info_1.getBasicInfo; } });
Object.defineProperty(exports, "getInfo", { enumerable: true, get: function () { return Info_1.getInfo; } });
const Agent_1 = require("./core/Agent");
Object.defineProperty(exports, "createAgent", { enumerable: true, get: function () { return Agent_1.createAgent; } });
Object.defineProperty(exports, "createProxyAgent", { enumerable: true, get: function () { return Agent_1.createProxyAgent; } });
const OAuth2_1 = require("./core/OAuth2");
Object.defineProperty(exports, "OAuth2", { enumerable: true, get: function () { return OAuth2_1.OAuth2; } });
const Utils_1 = __importDefault(require("./utils/Utils"));
const Url_1 = __importDefault(require("./utils/Url"));
const DownloadOptions_1 = __importDefault(require("./utils/DownloadOptions"));
const Format_1 = require("./utils/Format");
Object.defineProperty(exports, "chooseFormat", { enumerable: true, get: function () { return Format_1.chooseFormat; } });
Object.defineProperty(exports, "filterFormats", { enumerable: true, get: function () { return Format_1.filterFormats; } });
const constants_1 = require("./utils/constants");
Object.defineProperty(exports, "VERSION", { enumerable: true, get: function () { return constants_1.VERSION; } });
const IP_1 = __importDefault(require("./utils/IP"));
/* Private Constants */
const STREAM_EVENTS = ['abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect'];
/* Private Functions */
function createStream(options = {}) {
    const STREAM = new stream_1.PassThrough({
        highWaterMark: (options && options.highWaterMark) || 1024 * 512,
    });
    STREAM._destroy = () => {
        STREAM.destroyed = true;
    };
    return STREAM;
}
function pipeAndSetEvents(req, stream, end) {
    // Forward events from the request to the stream.
    STREAM_EVENTS.forEach((event) => {
        req.prependListener(event, stream.emit.bind(stream, event));
    });
    req.pipe(stream, { end });
}
function downloadFromInfoCallback(stream, info, options) {
    options ??= {};
    options.requestOptions ??= {};
    if (!info.formats.length) {
        stream.emit('error', Error('This video is unavailable'));
        return;
    }
    let format;
    try {
        format = (0, Format_1.chooseFormat)(info.formats, options);
    }
    catch (e) {
        stream.emit('error', e);
        return;
    }
    stream.emit('info', info, format);
    if (stream.destroyed) {
        return;
    }
    let contentLength, downloaded = 0;
    const ondata = (chunk) => {
        downloaded += chunk.length;
        stream.emit('progress', chunk.length, downloaded, contentLength);
    };
    DownloadOptions_1.default.applyDefaultHeaders(options);
    if (options.IPv6Block) {
        options.requestOptions = Object.assign({}, options.requestOptions, {
            localAddress: IP_1.default.getRandomIPv6(options.IPv6Block),
        });
    }
    if (options.agent) {
        if (options.agent.jar) {
            Utils_1.default.setPropInsensitive(options.requestOptions.headers, 'cookie', options.agent.jar.getCookieStringSync('https://www.youtube.com'));
        }
        if (options.agent.localAddress) {
            options.requestOptions.localAddress = options.agent.localAddress;
        }
    }
    // Download the file in chunks, in this case the default is 10MB,
    // anything over this will cause youtube to throttle the download
    const DL_CHUNK_SIZE = typeof options.dlChunkSize === 'number' ? options.dlChunkSize : 1024 * 1024 * 10;
    let req;
    let shouldEnd = true;
    if (format.isHLS || format.isDashMPD) {
        req = (0, m3u8stream_1.default)(format.url, {
            chunkReadahead: info.live_chunk_readahead ? +info.live_chunk_readahead : undefined,
            begin: options.begin || (format.isLive ? Date.now() : undefined),
            liveBuffer: options.liveBuffer,
            requestOptions: options.requestOptions,
            parser: format.isDashMPD ? 'dash-mpd' : 'm3u8',
            id: format.itag.toString(),
        });
        req.on('progress', (segment, totalSegments) => {
            stream.emit('progress', segment.size, segment.num, totalSegments);
        });
        pipeAndSetEvents(req, stream, shouldEnd);
    }
    else {
        const requestOptions = Object.assign({}, options.requestOptions, {
            maxReconnects: 6,
            maxRetries: 3,
            backoff: { inc: 500, max: 10000 },
        });
        let shouldBeChunked = DL_CHUNK_SIZE !== 0 && (!format.hasAudio || !format.hasVideo);
        if (shouldBeChunked) {
            let start = (options.range && options.range.start) || 0;
            let end = start + DL_CHUNK_SIZE;
            const rangeEnd = options.range && options.range.end;
            contentLength = options.range ? (rangeEnd ? rangeEnd + 1 : parseInt(format.contentLength)) - start : parseInt(format.contentLength);
            const getNextChunk = () => {
                if (stream.destroyed)
                    return;
                if (!rangeEnd && end >= contentLength)
                    end = 0;
                if (rangeEnd && end > rangeEnd)
                    end = rangeEnd;
                shouldEnd = !end || end === rangeEnd;
                requestOptions.headers = Object.assign({}, requestOptions.headers, {
                    Range: `bytes=${start}-${end || ''}`,
                });
                req = (0, miniget_1.default)(format.url, requestOptions);
                req.on('data', ondata);
                req.on('end', () => {
                    if (stream.destroyed)
                        return;
                    if (end && end !== rangeEnd) {
                        start = end + 1;
                        end += DL_CHUNK_SIZE;
                        getNextChunk();
                    }
                });
                pipeAndSetEvents(req, stream, shouldEnd);
            };
            getNextChunk();
        }
        else {
            // Audio only and video only formats don't support begin
            if (options.begin) {
                format.url += `&begin=${(0, m3u8stream_1.parseTimestamp)(options.begin)}`;
            }
            if (options.range && (options.range.start || options.range.end)) {
                requestOptions.headers = Object.assign({}, requestOptions.headers, {
                    Range: `bytes=${options.range.start || '0'}-${options.range.end || ''}`,
                });
            }
            req = (0, miniget_1.default)(format.url, requestOptions);
            req.on('response', (res) => {
                if (stream.destroyed)
                    return;
                contentLength = contentLength || parseInt(res.headers['content-length']);
            });
            req.on('data', ondata);
            pipeAndSetEvents(req, stream, shouldEnd);
        }
    }
    stream._destroy = () => {
        stream.destroyed = true;
        if (req) {
            req.destroy();
            req.end();
        }
    };
}
/* Public Functions */
/** @deprecated */
const ytdl = (link, options = {}) => {
    const STREAM = createStream(options);
    (0, Info_1.getFullInfo)(link, options).then((info) => {
        downloadFromInfoCallback(STREAM, info, options);
    }, STREAM.emit.bind(STREAM, 'error'));
    return STREAM;
};
/** Can be used to download video after its `info` is gotten through
 * `ytdl.getFullInfo()`. In case the user might want to look at the
 * `info` object before deciding to download. */
function downloadFromInfo(info, options = {}) {
    const STREAM = createStream(options);
    if (!info.full) {
        throw new Error('Cannot use `ytdl.downloadFromInfo()` when called with info from `ytdl.getBasicInfo()`');
    }
    setImmediate(() => {
        downloadFromInfoCallback(STREAM, info, options);
    });
    return STREAM;
}
ytdl.downloadFromInfo = downloadFromInfo;
ytdl.getBasicInfo = Info_1.getBasicInfo;
ytdl.getInfo = Info_1.getInfo;
ytdl.getFullInfo = Info_1.getFullInfo;
ytdl.chooseFormat = Format_1.chooseFormat;
ytdl.filterFormats = Format_1.filterFormats;
ytdl.validateID = Url_1.default.validateID;
ytdl.validateURL = Url_1.default.validateURL;
ytdl.getURLVideoID = Url_1.default.getURLVideoID;
ytdl.getVideoID = Url_1.default.getVideoID;
ytdl.createAgent = Agent_1.createAgent;
ytdl.createProxyAgent = Agent_1.createProxyAgent;
ytdl.OAuth2 = OAuth2_1.OAuth2;
ytdl.version = constants_1.VERSION;
module.exports = ytdl;
exports.default = ytdl;
//# sourceMappingURL=YtdlCore.old.js.map