import { PassThrough } from 'stream';
import miniget from 'miniget';
import m3u8stream, { parseTimestamp } from 'm3u8stream';
import { CACHE as INFO_CACHE, WATCH_PAGE_CACHE, getBasicInfo, getInfo } from './info';
import utils from './utils';
import { chooseFormat, filterFormats } from './format-utils';
import { validateID, validateURL, getURLVideoID, getVideoID } from './url-utils';
import { createAgent, createProxyAgent } from './core/Agent';
import pkg from '../package.json';

import { YTDL_DownloadOptions } from '@/types/options';
import { YTDL_VideoInfo } from '@/types/youtube';

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

    utils.applyDefaultHeaders(options);
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

/* Public Constants */
const cache = {
        info: INFO_CACHE,
        watch: WATCH_PAGE_CACHE,
    },
    version = pkg.version;

/* Public Functions */
const ytdl = (link: string, options: YTDL_DownloadOptions = {}) => {
    const STREAM = createStream(options);

    getInfo(link, options).then((info) => {
        downloadFromInfoCallback(STREAM, info, options);
    }, STREAM.emit.bind(STREAM, 'error'));

    return STREAM;
};

/** Can be used to download video after its `info` is gotten through
 * `ytdl.getInfo()`. In case the user might want to look at the
 * `info` object before deciding to download. */
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

ytdl.downloadFromInfo = downloadFromInfo;
ytdl.getBasicInfo = getBasicInfo;
ytdl.getInfo = getInfo;
ytdl.chooseFormat = chooseFormat;
ytdl.filterFormats = filterFormats;
ytdl.validateID = validateID;
ytdl.validateURL = validateURL;
ytdl.getURLVideoID = getURLVideoID;
ytdl.getVideoID = getVideoID;
ytdl.createAgent = createAgent;
ytdl.createProxyAgent = createProxyAgent;
ytdl.cache = cache;
ytdl.version = version;

module.exports = ytdl;
export { downloadFromInfo, getBasicInfo, getInfo, chooseFormat, filterFormats, validateID, validateURL, getURLVideoID, getVideoID, createAgent, createProxyAgent, cache, version };
export default ytdl;
