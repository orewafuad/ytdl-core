type YTDL_Constructor = YTDL_GetInfoOptions & {
    debug?: boolean;
};

import { PassThrough } from 'stream';
import miniget from 'miniget';
import m3u8stream, { parseTimestamp } from 'm3u8stream';

import { YTDL_DownloadOptions, YTDL_GetInfoOptions } from './types/options';
import { YTDL_VideoInfo } from './types/youtube';
import { YTDL_Agent } from './types/agent';

import { getBasicInfo, getFullInfo, getInfo } from './core/Info';
import { createAgent, createProxyAgent } from './core/Agent';
import { OAuth2 } from './core/OAuth2';

import { YTDL_ClientTypes } from './meta/Clients';

import utils from './utils/Utils';
import Url from './utils/Url';
import DownloadOptionsUtils from './utils/DownloadOptions';
import { chooseFormat, filterFormats } from './utils/Format';
import { VERSION } from './utils/constants';
import { Logger } from './utils/Log';
import PoToken from './core/PoToken';

/* Private Constants */
const STREAM_EVENTS = ['abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect'];

/* Private Functions */
function createStream(options: YTDL_DownloadOptions = {}) {
    const STREAM = new PassThrough({
        highWaterMark: (options && options.highWaterMark) || 1024 * 512,
    });

    STREAM._destroy = () => {
        STREAM.destroyed = true;
    };

    return STREAM;
}

function pipeAndSetEvents(req: m3u8stream.Stream, stream: PassThrough, end: boolean) {
    // Forward events from the request to the stream.
    STREAM_EVENTS.forEach((event) => {
        req.prependListener(event, stream.emit.bind(stream, event));
    });

    req.pipe(stream, { end });
}

function downloadFromInfoCallback(stream: PassThrough, info: YTDL_VideoInfo, options: YTDL_DownloadOptions) {
    options ??= {};

    options.requestOptions ??= {};

    if (!info.formats.length) {
        stream.emit('error', Error('This video is unavailable'));
        return;
    }

    let format;
    try {
        format = chooseFormat(info.formats, options);
    } catch (e) {
        stream.emit('error', e);
        return;
    }

    stream.emit('info', info, format);
    if (stream.destroyed) {
        return;
    }

    let contentLength: number,
        downloaded = 0;

    const ondata = (chunk: Buffer) => {
        downloaded += chunk.length;
        stream.emit('progress', chunk.length, downloaded, contentLength);
    };

    DownloadOptionsUtils.applyDefaultHeaders(options);
    if (options.IPv6Block) {
        options.requestOptions = Object.assign({}, options.requestOptions, {
            localAddress: utils.getRandomIPv6(options.IPv6Block),
        });
    }
    if (options.agent) {
        if (options.agent.jar) {
            utils.setPropInsensitive(options.requestOptions.headers, 'cookie', options.agent.jar.getCookieStringSync('https://www.youtube.com'));
        }

        if (options.agent.localAddress) {
            (options.requestOptions as any).localAddress = options.agent.localAddress;
        }
    }

    // Download the file in chunks, in this case the default is 10MB,
    // anything over this will cause youtube to throttle the download
    const DL_CHUNK_SIZE = typeof options.dlChunkSize === 'number' ? options.dlChunkSize : 1024 * 1024 * 10;

    let req: m3u8stream.Stream;
    let shouldEnd = true;

    if (format.isHLS || format.isDashMPD) {
        req = m3u8stream(format.url, {
            chunkReadahead: info.live_chunk_readahead ? +info.live_chunk_readahead : undefined,
            begin: options.begin || (format.isLive ? Date.now() : undefined),
            liveBuffer: options.liveBuffer,
            requestOptions: options.requestOptions as any,
            parser: format.isDashMPD ? 'dash-mpd' : 'm3u8',
            id: format.itag.toString(),
        });

        req.on('progress', (segment, totalSegments) => {
            stream.emit('progress', segment.size, segment.num, totalSegments);
        });

        pipeAndSetEvents(req, stream, shouldEnd);
    } else {
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
                if (stream.destroyed) return;
                if (!rangeEnd && end >= contentLength) end = 0;
                if (rangeEnd && end > rangeEnd) end = rangeEnd;
                shouldEnd = !end || end === rangeEnd;

                requestOptions.headers = Object.assign({}, requestOptions.headers, {
                    Range: `bytes=${start}-${end || ''}`,
                });
                req = miniget(format.url, requestOptions as any);
                req.on('data', ondata);
                req.on('end', () => {
                    if (stream.destroyed) return;
                    if (end && end !== rangeEnd) {
                        start = end + 1;
                        end += DL_CHUNK_SIZE;
                        getNextChunk();
                    }
                });
                pipeAndSetEvents(req, stream, shouldEnd);
            };
            getNextChunk();
        } else {
            // Audio only and video only formats don't support begin
            if (options.begin) {
                format.url += `&begin=${parseTimestamp(options.begin)}`;
            }

            if (options.range && (options.range.start || options.range.end)) {
                requestOptions.headers = Object.assign({}, requestOptions.headers, {
                    Range: `bytes=${options.range.start || '0'}-${options.range.end || ''}`,
                });
            }

            req = miniget(format.url, requestOptions as any);

            req.on('response', (res) => {
                if (stream.destroyed) return;
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

function downloadFromInfo(info: YTDL_VideoInfo, options: YTDL_DownloadOptions = {}) {
    const STREAM = createStream(options);

    if (!info.full) {
        throw new Error('Cannot use `ytdl.downloadFromInfo()` when called with info from `ytdl.getBasicInfo()`');
    }

    setImmediate(() => {
        downloadFromInfoCallback(STREAM, info, options);
    });

    return STREAM;
}

function download(link: string, options: YTDL_DownloadOptions = {}) {
    const STREAM = createStream(options);

    getFullInfo(link, options).then((info) => {
        downloadFromInfoCallback(STREAM, info, options);
    }, STREAM.emit.bind(STREAM, 'error'));

    return STREAM;
}

/* Public CLass */
class YtdlCore {
    public static download = download;

    public static getBasicInfo = getBasicInfo;
    /** @deprecated */
    public static getInfo = getInfo;
    public static getFullInfo = getFullInfo;

    public static chooseFormat = chooseFormat;
    public static filterFormats = filterFormats;

    public static validateID = Url.validateID;
    public static validateURL = Url.validateURL;
    public static getURLVideoID = Url.getURLVideoID;
    public static getVideoID = Url.getVideoID;

    public static createAgent = createAgent;
    public static createProxyAgent = createProxyAgent;

    public static OAuth2 = OAuth2;

    public lang: string = 'en';
    public requestOptions: any = {};
    public agent: YTDL_Agent | undefined;
    public poToken: string | undefined;
    public visitorData: string | undefined;
    public includesPlayerAPIResponse: boolean = false;
    public includesWatchPageInfo: boolean = false;
    public clients: Array<YTDL_ClientTypes> = [];
    public oauth2: OAuth2 | undefined;
    public version = VERSION;

    constructor({ lang, requestOptions, agent, poToken, visitorData, includesPlayerAPIResponse, includesWatchPageInfo, clients, oauth2, debug }: YTDL_Constructor = {}) {
        this.lang = lang || 'en';
        this.requestOptions = requestOptions || {};
        this.agent = agent || undefined;
        this.poToken = poToken || undefined;
        this.visitorData = visitorData || undefined;
        this.includesPlayerAPIResponse = includesPlayerAPIResponse || false;
        this.includesWatchPageInfo = includesWatchPageInfo || false;
        this.clients = clients || [];
        this.oauth2 = oauth2 || undefined;

        process.env.YTDL_DEBUG = (debug ?? false).toString();

        if (!this.poToken && !this.visitorData) {
            Logger.info('Since PoToken and VisitorData are not specified, they are generated automatically.');

            PoToken.generatePoToken()
                .then(({ poToken, visitorData }) => {
                    this.poToken = poToken;
                    this.visitorData = visitorData;
                })
                .catch(() => {});
        }
    }

    private setupOptions(options: YTDL_DownloadOptions) {
        options.lang ??= this.lang;
        options.requestOptions ??= this.requestOptions;
        options.agent ??= this.agent;
        options.poToken ??= this.poToken;
        options.visitorData ??= this.visitorData;
        options.includesPlayerAPIResponse ??= this.includesPlayerAPIResponse;
        options.includesWatchPageInfo ??= this.includesWatchPageInfo;
        options.clients ??= this.clients;
        options.oauth2 ??= this.oauth2;

        return options;
    }

    public download(link: string, options: YTDL_DownloadOptions = {}) {
        return download(link, this.setupOptions(options));
    }
    public downloadFromInfo(info: YTDL_VideoInfo, options: YTDL_DownloadOptions = {}) {
        return downloadFromInfo(info, this.setupOptions(options));
    }

    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    public getBasicInfo(link: string, options: YTDL_DownloadOptions = {}) {
        return getBasicInfo(link, this.setupOptions(options));
    }
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.)
     * @deprecated
     */
    public getInfo(link: string, options: YTDL_DownloadOptions = {}) {
        return getInfo(link, this.setupOptions(options));
    }
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    public getFullInfo(link: string, options: YTDL_DownloadOptions = {}) {
        return getFullInfo(link, this.setupOptions(options));
    }
}

module.exports.YtdlCore = YtdlCore;
export { YtdlCore };
