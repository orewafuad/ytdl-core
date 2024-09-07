import { YTDL_VideoFormat } from '@/types/youtube';
import { YTDL_ChooseFormatOptions } from '@/types/options';

import FORMATS from '@/meta/formats';

import utils from './Utils';

/* Private Constants */
// Use these to help sort formats, higher index is better.
const AUDIO_ENCODING_RANKS = ['mp4a', 'mp3', 'vorbis', 'aac', 'opus', 'flac'],
    VIDEO_ENCODING_RANKS = ['mp4v', 'avc1', 'Sorenson H.283', 'MPEG-4 Visual', 'VP8', 'VP9', 'H.264'];

/* Private Functions */
function getEncodingRank(ranks: Array<string>, format: YTDL_VideoFormat): number {
    return ranks.findIndex((enc) => format.codecs && format.codecs.includes(enc));
}

function getVideoBitrate(format: YTDL_VideoFormat): number {
    return format.bitrate || 0;
}
function getVideoEncodingRank(format: YTDL_VideoFormat): number {
    return getEncodingRank(VIDEO_ENCODING_RANKS, format);
}

function getAudioBitrate(format: YTDL_VideoFormat): number {
    return format.audioBitrate || 0;
}
function getAudioEncodingRank(format: YTDL_VideoFormat): number {
    return getEncodingRank(AUDIO_ENCODING_RANKS, format);
}

/** Sort formats by a list of functions. */
function sortFormatsBy(a: Object, b: Object, sortBy: Array<Function>) {
    let res = 0;

    for (const FUNC of sortBy) {
        res = FUNC(b) - FUNC(a);

        if (res !== 0) {
            break;
        }
    }

    return res;
}

function getQualityLabel(format: YTDL_VideoFormat): number {
    return parseInt(format.qualityLabel) || 0;
}
function sortFormatsByVideo(a: Object, b: Object) {
    return sortFormatsBy(a, b, [getQualityLabel, getVideoBitrate, getVideoEncodingRank]);
}

function sortFormatsByAudio(a: Object, b: Object) {
    return sortFormatsBy(a, b, [getAudioBitrate, getAudioEncodingRank]);
}

/** Gets a format based on quality or array of quality's */
function getFormatByQuality(quality: YTDL_ChooseFormatOptions['quality'], formats: Array<YTDL_VideoFormat>): YTDL_VideoFormat | null {
    const getFormat = (itag: string | number) => formats.find((format) => `${format.itag}` === `${itag}`) || null;

    if (Array.isArray(quality)) {
        const FOUND = quality.find((itag) => getFormat(itag));

        if (!FOUND) {
            return null;
        }

        return getFormat(FOUND) || null;
    } else {
        return getFormat(quality || '') || null;
    }
}

/* Public Functions */
function sortFormats(a: Object, b: Object) {
    return sortFormatsBy(a, b, [
        // Formats with both video and audio are ranked highest.
        (format: YTDL_VideoFormat) => +!!format.isHLS,
        (format: YTDL_VideoFormat) => +!!format.isDashMPD,
        (format: YTDL_VideoFormat) => +(parseInt(format.contentLength) > 0),
        (format: YTDL_VideoFormat) => +(format.hasVideo && format.hasAudio),
        (format: YTDL_VideoFormat) => +format.hasVideo,
        (format: YTDL_VideoFormat) => parseInt(format.qualityLabel) || 0,
        getVideoBitrate,
        getAudioBitrate,
        getVideoEncodingRank,
        getAudioEncodingRank,
    ]);
}

function filterFormats(formats: Array<YTDL_VideoFormat>, filter?: YTDL_ChooseFormatOptions['filter']): Array<YTDL_VideoFormat> {
    let fn: Function;

    switch (filter) {
        case 'videoandaudio':
        case 'audioandvideo': {
            fn = (format: YTDL_VideoFormat) => format.hasVideo && format.hasAudio;
            break;
        }

        case 'video': {
            fn = (format: YTDL_VideoFormat) => format.hasVideo;
            break;
        }

        case 'videoonly': {
            fn = (format: YTDL_VideoFormat) => format.hasVideo && !format.hasAudio;
            break;
        }

        case 'audio': {
            fn = (format: YTDL_VideoFormat) => format.hasAudio;
            break;
        }

        case 'audioonly': {
            fn = (format: YTDL_VideoFormat) => format.hasAudio && !format.hasVideo;
            break;
        }

        default: {
            if (typeof filter === 'function') {
                fn = filter;
            } else {
                throw new TypeError(`Given filter (${filter}) is not supported`);
            }
        }
    }

    return formats.filter((format) => !!format.url && fn(format));
}

function chooseFormat(formats: Array<YTDL_VideoFormat>, options: YTDL_ChooseFormatOptions): YTDL_VideoFormat {
    if (typeof options.format === 'object') {
        if (!options.format.url) {
            throw new Error('Invalid format given, did you use `ytdl.getInfo()`?');
        }

        return options.format;
    }

    if (options.filter) {
        formats = filterFormats(formats, options.filter);
    }

    if (formats.some((format) => format.isHLS)) {
        formats = formats.filter((format) => format.isHLS || !format.isLive);
    }

    const QUALITY: YTDL_ChooseFormatOptions['quality'] = options.quality || 'highest';
    let format;

    switch (QUALITY) {
        case 'highest': {
            format = formats[0];
            break;
        }

        case 'lowest': {
            format = formats[formats.length - 1];
            break;
        }

        case 'highestaudio': {
            formats = filterFormats(formats, 'audio');
            formats.sort(sortFormatsByAudio);

            const BEST_AUDIO_FORMAT = formats[0];
            formats = formats.filter((format) => sortFormatsByAudio(BEST_AUDIO_FORMAT, format) === 0);

            const WORST_VIDEO_QUALITY = formats.map((format) => parseInt(format.qualityLabel) || 0).sort((a, b) => a - b)[0];

            format = formats.find((format) => (parseInt(format.qualityLabel) || 0) === WORST_VIDEO_QUALITY);
            break;
        }

        case 'lowestaudio': {
            formats = filterFormats(formats, 'audio');
            formats.sort(sortFormatsByAudio);
            format = formats[formats.length - 1];
            break;
        }

        case 'highestvideo': {
            formats = filterFormats(formats, 'video');
            formats.sort(sortFormatsByVideo);

            const BEST_VIDEO_FORMAT = formats[0];
            formats = formats.filter((format) => sortFormatsByVideo(BEST_VIDEO_FORMAT, format) === 0);

            const WORST_VIDEO_QUALITY = formats.map((format) => format.audioBitrate || 0).sort((a, b) => a - b)[0];

            format = formats.find((format) => (format.audioBitrate || 0) === WORST_VIDEO_QUALITY);
            break;
        }

        case 'lowestvideo': {
            formats = filterFormats(formats, 'video');
            formats.sort(sortFormatsByVideo);
            format = formats[formats.length - 1];
            break;
        }

        default: {
            format = getFormatByQuality(QUALITY, formats);
            break;
        }
    }

    if (!format) {
        throw new Error(`No such format found: ${QUALITY}`);
    }

    return format;
}

function addFormatMeta(format: YTDL_VideoFormat): YTDL_VideoFormat {
    format = Object.assign({}, FORMATS[format.itag] || {}, format);

    format.hasVideo = !!format.qualityLabel;
    format.hasAudio = !!format.audioBitrate;

    const CONTAINER = format.mimeType && (format.mimeType.split(';')[0].split('/')[1] as YTDL_VideoFormat['container']);
    format.container = CONTAINER || null;

    const CODECS = format.mimeType && utils.between(format.mimeType, 'codecs="', '"');
    format.codecs = CODECS || null;

    const VIDEO_CODEC = format.hasVideo && format.codecs && format.codecs.split(', ')[0];
    format.videoCodec = VIDEO_CODEC || null;

    const AUDIO_CODEC = format.hasAudio && format.codecs && format.codecs.split(', ')[0];
    format.audioCodec = AUDIO_CODEC || null;

    format.isLive = /\bsource[/=]yt_live_broadcast\b/.test(format.url);
    format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
    format.isDashMPD = /\/manifest\/dash\//.test(format.url);

    return format;
}

export { sortFormats, filterFormats, chooseFormat, addFormatMeta };
export default { sortFormats, filterFormats, chooseFormat, addFormatMeta };
