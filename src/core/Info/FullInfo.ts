import { YTDL_GetInfoOptions } from '@/types/options';
import { YT_YTInitialPlayerResponse, YTDL_VideoInfo } from '@/types/youtube';

import { Cache } from '@/core/Cache';
import sig from '@/core/Signature';

import Url from '@/utils/Url';
import { Logger } from '@/utils/Log';
import utils from '@/utils/Utils';
import downloadOptionsUtils from '@/utils/DownloadOptions';
import formatUtils from '@/utils/Format';

import { _getBasicInfo } from './BasicInfo';
import Formats from './parser/Formats';

const CACHE = new Cache();

/* Public Functions */

/** Gets info from a video additional formats and deciphered Url. */
async function _getFullInfo(id: string, options: YTDL_GetInfoOptions): Promise<YTDL_VideoInfo> {
    downloadOptionsUtils.applyIPv6Rotations(options);
    downloadOptionsUtils.applyDefaultHeaders(options);
    downloadOptionsUtils.applyDefaultAgent(options);
    downloadOptionsUtils.applyOldLocalAddress(options);

    const INFO: YTDL_VideoInfo = await _getBasicInfo(id, options, true),
        FUNCTIONS = [];

    try {
        const FORMATS = INFO.formats as any as Array<YT_YTInitialPlayerResponse>;

        FUNCTIONS.push(sig.decipherFormats(FORMATS, INFO.html5Player, options));

        for (const RESPONSE of FORMATS) {
            FUNCTIONS.push(...Formats.parseAdditionalManifests(RESPONSE, options));
        }
    } catch (err) {
        Logger.warning('Error in player API; falling back to web-scraping');

        FUNCTIONS.push(sig.decipherFormats(Formats.parseFormats(INFO._watchPageInfo.player_response), INFO.html5Player, options));
        FUNCTIONS.push(...Formats.parseAdditionalManifests(INFO._watchPageInfo.player_response, options));
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

/** @deprecated */
async function getInfo(link: string, options: YTDL_GetInfoOptions = {}): Promise<YTDL_VideoInfo> {
    Logger.warning('`getInfo` is deprecated and will be removed in the next major version. Please use `getFullInfo` instead.');
    utils.checkForUpdates();
    const ID = Url.getVideoID(link),
        CACHE_KEY = ['getFullInfo', ID, options.lang].join('-');

    return CACHE.getOrSet(CACHE_KEY, () => _getFullInfo(ID, options)) as Promise<YTDL_VideoInfo>;
}

async function getFullInfo(link: string, options: YTDL_GetInfoOptions = {}): Promise<YTDL_VideoInfo> {
    utils.checkForUpdates();
    const ID = Url.getVideoID(link),
        CACHE_KEY = ['getFullInfo', ID, options.lang].join('-');

    return CACHE.getOrSet(CACHE_KEY, () => _getFullInfo(ID, options)) as Promise<YTDL_VideoInfo>;
}

export { getInfo };
export default getFullInfo;
