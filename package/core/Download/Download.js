"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToIterable = streamToIterable;
exports.download = download;
exports.downloadFromInfo = downloadFromInfo;
const Info_1 = require("../../core/Info");
const Format_1 = require("../../utils/Format");
const Log_1 = require("../../utils/Log");
const Platform_1 = require("../../platforms/Platform");
const UserAgents_1 = require("../../utils/UserAgents");
const DOWNLOAD_REQUEST_OPTIONS = {
    method: 'GET',
    headers: {
        accept: '*/*',
        origin: 'https://www.youtube.com',
        referer: 'https://www.youtube.com',
        DNT: '?1',
    },
    redirect: 'follow',
};
async function isDownloadUrlValid(format) {
    return new Promise((resolve) => {
        const successResponseHandler = (res) => {
            if (res.status === 200) {
                Log_1.Logger.debug(`[ ${format.sourceClientName} ]: <success>Video URL is normal.</success> The response was received with status code <success>"${res.status}"</success>.`);
                resolve({ valid: true });
            }
            else {
                errorResponseHandler(new Error(`Status code: ${res.status}`));
            }
        }, errorResponseHandler = (reason) => {
            Log_1.Logger.debug(`[ ${format.sourceClientName} ]: The URL for the video <error>did not return a successful response</error>. Got another format.\nReason: ${reason.message}`);
            resolve({ valid: false, reason: reason.message });
        };
        try {
            Platform_1.Platform.getShim()
                .fetcher(format.url, {
                method: 'HEAD',
            })
                .then((res) => successResponseHandler(res), (reason) => errorResponseHandler(reason));
        }
        catch (err) {
            errorResponseHandler(err);
        }
    });
}
function getValidDownloadUrl(formats, options) {
    return new Promise(async (resolve) => {
        let excludingClients = ['web'], format, isOk = false;
        try {
            format = Format_1.FormatUtils.chooseFormat(formats, options);
        }
        catch (e) {
            throw e;
        }
        if (!format) {
            throw new Error('Failed to retrieve format data.');
        }
        while (isOk === false) {
            if (!format) {
                throw new Error('Failed to retrieve format data.');
            }
            const { valid, reason } = await isDownloadUrlValid(format);
            if (valid) {
                isOk = true;
            }
            else {
                if (format.sourceClientName !== 'unknown') {
                    excludingClients.push(format.sourceClientName);
                }
                try {
                    format = Format_1.FormatUtils.chooseFormat(formats, {
                        excludingClients,
                        includingClients: reason?.includes('403') ? ['ios', 'android'] : 'all',
                        quality: options.quality,
                        filter: options.filter,
                    });
                }
                catch (e) {
                    throw e;
                }
            }
        }
        resolve(format);
    });
}
/** Reference: LuanRT/YouTube.js - Utils.ts */
async function* streamToIterable(stream) {
    const READER = stream.getReader();
    try {
        while (true) {
            const { done, value } = await READER.read();
            if (done) {
                return;
            }
            yield value;
        }
    }
    finally {
        READER.releaseLock();
    }
}
async function downloadFromInfoCallback(info, options) {
    if (!info.formats.length) {
        throw new Error('This video is not available due to lack of video format.');
    }
    const DL_CHUNK_SIZE = typeof options.dlChunkSize === 'number' ? options.dlChunkSize : 1024 * 1024 * 10, NO_NEED_SPECIFY_RANGE = (options.filter === 'audioandvideo' || options.filter === 'videoandaudio') && !options.range;
    let format = Object.freeze(await getValidDownloadUrl(info.formats, options)), requestOptions = { ...DOWNLOAD_REQUEST_OPTIONS }, chunkStart = options.range ? options.range.start : 0, chunkEnd = options.range ? options.range.end || DL_CHUNK_SIZE : DL_CHUNK_SIZE, shouldEnd = false, cancel, firstFormatUrl = NO_NEED_SPECIFY_RANGE ? format.url : format.url + '&range=' + chunkStart + '-' + chunkEnd;
    const AGENT_TYPE = format.sourceClientName === 'ios' || format.sourceClientName === 'android' ? format.sourceClientName : format.sourceClientName.includes('tv') ? 'tv' : 'desktop';
    requestOptions.headers = {
        ...requestOptions.headers,
        'User-Agent': UserAgents_1.UserAgent.getRandomUserAgent(AGENT_TYPE),
    };
    /* Request Setup */
    if (options.rewriteRequest) {
        const { url, options: reqOptions } = options.rewriteRequest(firstFormatUrl, requestOptions, {
            isDownloadUrl: true,
        });
        firstFormatUrl = url;
        requestOptions = reqOptions;
    }
    if (options.originalProxy) {
        try {
            const PARSED = new URL(options.originalProxy.download);
            if (!firstFormatUrl.includes(PARSED.host)) {
                firstFormatUrl = `${PARSED.protocol}//${PARSED.host}${PARSED.pathname}?${options.originalProxy.urlQueryName || 'url'}=${encodeURIComponent(firstFormatUrl)}`;
            }
        }
        catch { }
    }
    /* Reference: LuanRT/YouTube.js */
    if (NO_NEED_SPECIFY_RANGE) {
        const RESPONSE = await Platform_1.Platform.getShim().fetcher(firstFormatUrl, requestOptions);
        if (!RESPONSE.ok) {
            throw new Error(`Download failed with status code <warning>"${RESPONSE.status}"</warning>.`);
        }
        const BODY = RESPONSE.body;
        if (!BODY) {
            throw new Error('Failed to retrieve response body.');
        }
        return BODY;
    }
    const READABLE_STREAM = new ReadableStream({
        start() { },
        pull: async (controller) => {
            if (shouldEnd) {
                controller.close();
                return;
            }
            const CONTENT_LENGTH = format.contentLength ? parseInt(format.contentLength) : 0;
            if (chunkEnd >= CONTENT_LENGTH || options.range) {
                shouldEnd = true;
            }
            return new Promise(async (resolve, reject) => {
                try {
                    cancel = new AbortController();
                    let formatUrl = format.url + '&range=' + chunkStart + '-' + chunkEnd;
                    if (options.rewriteRequest) {
                        const { url, options: reqOptions } = options.rewriteRequest(formatUrl, requestOptions, {
                            isDownloadUrl: true,
                        });
                        formatUrl = url;
                        requestOptions = reqOptions;
                    }
                    if (options.originalProxy) {
                        try {
                            const PARSED = new URL(options.originalProxy.download);
                            if (!formatUrl.includes(PARSED.host)) {
                                formatUrl = `${PARSED.protocol}//${PARSED.host}${PARSED.pathname}?${options.originalProxy.urlQueryName || 'url'}=${encodeURIComponent(formatUrl)}`;
                            }
                        }
                        catch { }
                    }
                    const RESPONSE = await Platform_1.Platform.getShim().fetcher(firstFormatUrl, requestOptions);
                    if (!RESPONSE.ok) {
                        throw new Error(`Download failed with status code <warning>"${RESPONSE.status}"</warning>.`);
                    }
                    const BODY = RESPONSE.body;
                    if (!BODY) {
                        throw new Error('Failed to retrieve response body.');
                    }
                    for await (const CHUNK of streamToIterable(BODY)) {
                        controller.enqueue(CHUNK);
                    }
                    chunkStart = chunkEnd + 1;
                    chunkEnd += DL_CHUNK_SIZE;
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        },
        async cancel(reason) {
            cancel.abort(reason);
        },
    }, {
        highWaterMark: options.highWaterMark || 1024 * 512,
        size(chunk) {
            return chunk?.byteLength || 0;
        },
    });
    return READABLE_STREAM;
}
async function downloadFromInfo(info, options) {
    if (!info.full) {
        throw new Error('Cannot use `ytdl.downloadFromInfo()` when called with info from `ytdl.getBasicInfo()`');
    }
    return await downloadFromInfoCallback(info, options);
}
function download(link, options) {
    return new Promise((resolve) => {
        (0, Info_1.getFullInfo)(link, options)
            .then((info) => {
            resolve(downloadFromInfoCallback(info, options));
        })
            .catch((err) => {
            throw err;
        });
    });
}
//# sourceMappingURL=Download.js.map