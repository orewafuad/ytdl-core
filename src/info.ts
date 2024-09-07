import sax from 'sax';
import utils from './utils';
import formatUtils from './format-utils';
import urlUtils from './url-utils';
import { Cache } from './cache';
import sig from './sig';
import { Logger } from './utils/Log';
import { _getBasicInfo } from './core/Info/BasicInfo';

import { YTDL_GetInfoOptions, YTDL_RequestOptions } from '@/types/options';
import { YT_StreamingFormat, YT_YTInitialPlayerResponse, YTDL_VideoInfo } from '@/types/youtube';

/* Private Constants */
const BASE_URL = 'https://www.youtube.com/watch?v=';

/* ----------- */

/* Get Info Function */
function parseFormats(playerResponse: YT_YTInitialPlayerResponse | null): Array<YT_StreamingFormat> {
    let formats: Array<YT_StreamingFormat> = [];

    if (playerResponse && playerResponse.streamingData) {
        formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
    }

    return formats;
}

type YTDL_M3U8Data = { itag: number; url: string };
async function getM3U8(url: string, options: YTDL_RequestOptions): Promise<Record<string, YTDL_M3U8Data>> {
    const _URL = new URL(url, BASE_URL),
        BODY = await utils.request<string>(_URL.toString(), options),
        FORMATS: Record<string, YTDL_M3U8Data> = {};

    BODY.split('\n')
        .filter((line) => /^https?:\/\//.test(line))
        .forEach((line) => {
            const MATCH = line.match(/\/itag\/(\d+)\//) || [],
                ITAG = parseInt(MATCH[1]);

            FORMATS[line] = { itag: ITAG, url: line };
        });

    return FORMATS;
}

type YTDL_DashManifestData = {
    itag: number;
    url: string;
    bitrate: number;
    mimeType: string;
    audioSampleRate?: number;
    width?: number;
    height?: number;
    fps?: number;
};
function getDashManifest(url: string, options: YTDL_RequestOptions): Promise<Record<string, YTDL_DashManifestData>> {
    return new Promise((resolve, reject) => {
        const PARSER = sax.parser(false),
            FORMATS: Record<string, YTDL_DashManifestData> = {};

        PARSER.onerror = reject;
        let adaptationSet: any = null;

        PARSER.onopentag = (node) => {
            const ATTRIBUTES = node.attributes as any;

            if (node.name === 'ADAPTATIONSET') {
                adaptationSet = ATTRIBUTES;
            } else if (node.name === 'REPRESENTATION') {
                const ITAG = parseInt(ATTRIBUTES.ID);
                if (!isNaN(ITAG)) {
                    const SOURCE = (() => {
                        if (node.attributes.HEIGHT) {
                            return {
                                width: parseInt(ATTRIBUTES.WIDTH),
                                height: parseInt(ATTRIBUTES.HEIGHT),
                                fps: parseInt(ATTRIBUTES.FRAMERATE),
                            };
                        } else {
                            return {
                                audioSampleRate: ATTRIBUTES.AUDIOSAMPLINGRATE,
                            };
                        }
                    })();

                    FORMATS[url] = Object.assign(
                        {
                            itag: ITAG,
                            url,
                            bitrate: parseInt(ATTRIBUTES.BANDWIDTH),
                            mimeType: `${adaptationSet.MIMETYPE}; codecs="${ATTRIBUTES.CODECS}"`,
                        },
                        SOURCE,
                    );

                    Object.assign;
                }
            }
        };

        PARSER.onend = () => {
            resolve(FORMATS);
        };

        utils
            .request(new URL(url, BASE_URL).toString(), options)
            .then((res: any) => {
                PARSER.write(res);
                PARSER.close();
            })
            .catch(reject);
    });
}

function parseAdditionalManifests(playerResponse: YT_YTInitialPlayerResponse | null, options: YTDL_RequestOptions): Array<Promise<Record<string, YTDL_M3U8Data | YTDL_DashManifestData>>> {
    const STREAMING_DATA = playerResponse && playerResponse.streamingData,
        MANIFESTS: Array<Promise<Record<string, YTDL_M3U8Data | YTDL_DashManifestData>>> = [];

    if (STREAMING_DATA) {
        if (STREAMING_DATA.dashManifestUrl) {
            MANIFESTS.push(getDashManifest(STREAMING_DATA.dashManifestUrl, options));
        }

        if (STREAMING_DATA.hlsManifestUrl) {
            MANIFESTS.push(getM3U8(STREAMING_DATA.hlsManifestUrl, options));
        }
    }

    return MANIFESTS;
}

/* ----------- */

/* Public Constants */
const CACHE = new Cache(),
    WATCH_PAGE_CACHE = new Cache();

/* ----------- */

/* Public Functions */

// TODO: Clean up this function for readability and support more clients
/** Gets info from a video additional formats and deciphered URLs. */
async function _getInfo(id: string, options: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo> {
    utils.applyIPv6Rotations(options);
    utils.applyDefaultHeaders(options);
    utils.applyDefaultAgent(options);
    utils.applyOldLocalAddress(options);

    const INFO: YTDL_VideoInfo = await _getBasicInfo(id, options, true),
        FUNCTIONS = [];

    try {
        const FORMATS = INFO.formats as any as Array<YT_YTInitialPlayerResponse>;

        FUNCTIONS.push(sig.decipherFormats(FORMATS, INFO.html5Player, options));

        for (const RESPONSE of FORMATS) {
            FUNCTIONS.push(...parseAdditionalManifests(RESPONSE, options));
        }
    } catch (err) {
        Logger.warning('Error in player API; falling back to web-scraping');

        FUNCTIONS.push(sig.decipherFormats(parseFormats(INFO._watchPageInfo.player_response), INFO.html5Player, options));
        FUNCTIONS.push(...parseAdditionalManifests(INFO._watchPageInfo.player_response, options));
    }

    const RESULTS = await Promise.all(FUNCTIONS);

    INFO.formats = Object.values(Object.assign({}, ...RESULTS));
    INFO.formats = INFO.formats.map(formatUtils.addFormatMeta);
    INFO.formats.sort(formatUtils.sortFormats);

    INFO.full = true;

    if (!options.includesWatchPageInfo) {
        delete (INFO as any)._watchPageInfo;
    }

    if (!options.includesPlayerAPIResponse) {
        delete (INFO as any)._playerResponses;
    }

    return INFO;
}

async function getInfo(link: string, options: YTDL_GetInfoOptions = {}): Promise<YTDL_VideoInfo> {
    utils.checkForUpdates();
    const ID = urlUtils.getVideoID(link),
        CACHE_KEY = ['getInfo', ID, options.lang].join('-');

    return CACHE.getOrSet(CACHE_KEY, () => _getInfo(ID, options)) as Promise<YTDL_VideoInfo>;
}

const validateID = urlUtils.validateID,
    validateURL = urlUtils.validateURL,
    getURLVideoID = urlUtils.getURLVideoID,
    getVideoID = urlUtils.getVideoID;

export { CACHE, WATCH_PAGE_CACHE, getInfo, validateID, validateURL, getURLVideoID, getVideoID };
export default { CACHE, WATCH_PAGE_CACHE, getInfo, validateID, validateURL, getURLVideoID, getVideoID };
