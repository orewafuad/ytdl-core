import { YTDL_GetInfoOptions } from '@/types/options';
import { YT_YTInitialPlayerResponse, YTDL_WatchPageInfo } from '@/types/youtube';
import utils from '@/utils/Utils';
import YouTubePageExtractor from './PageExtractor';
import getHtml5Player from './Html5Player';

const JSON_CLOSING_CHARS = /^[)\]}'\s]+/;

function parseJSON<T = unknown>(source: string, varName: string, json: string): T {
    if (!json || typeof json === 'object') {
        return json as T;
    } else {
        try {
            json = json.replace(JSON_CLOSING_CHARS, '');
            return JSON.parse(json);
        } catch (err: any) {
            throw Error(`Error parsing ${varName} in ${source}: ${err.message}`);
        }
    }
}

function findJSON<T = unknown>(source: string, varName: string, body: string, left: RegExp, right: string, prependJSON: string): T {
    const JSON_STR = utils.between(body, left, right);

    if (!JSON_STR) {
        throw Error(`Could not find ${varName} in ${source}`);
    }

    return parseJSON<T>(source, varName, utils.cutAfterJS(`${prependJSON}${JSON_STR}`));
}

function findPlayerResponse(source: string, info: any): YT_YTInitialPlayerResponse | null {
    const PLAYER_RESPONSE = info && ((info.args && info.args.player_response) || info.player_response || info.playerResponse || info.embedded_player_response);

    return parseJSON(source, 'player_response', PLAYER_RESPONSE);
}

export default async function getWatchHTMLPageInfo(id: string, options: YTDL_GetInfoOptions): Promise<YTDL_WatchPageInfo> {
    const BODY = await YouTubePageExtractor.getWatchPageBody(id, options),
        INFO: YTDL_WatchPageInfo = { page: 'watch' } as any;

    try {
        try {
            INFO.player_response = utils.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', '}};', '', '}}') || utils.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', ';var') || utils.tryParseBetween(BODY, 'var ytInitialPlayerResponse = ', ';</script>') || findJSON<YT_YTInitialPlayerResponse>('watch.html', 'player_response', BODY, /\bytInitialPlayerResponse\s*=\s*\{/i, '</script>', '{') || null;
        } catch (err) {
            const ARGS = findJSON<Object>('watch.html', 'player_response', BODY, /\bytplayer\.config\s*=\s*{/, '</script>', '{');
            INFO.player_response = findPlayerResponse('watch.html', ARGS) as any;
        }

        INFO.response = utils.tryParseBetween(BODY, 'var ytInitialData = ', '}};', '', '}}') || utils.tryParseBetween(BODY, 'var ytInitialData = ', ';</script>') || utils.tryParseBetween(BODY, 'window["ytInitialData"] = ', '}};', '', '}}') || utils.tryParseBetween(BODY, 'window["ytInitialData"] = ', ';</script>') || findJSON('watch.html', 'response', BODY, /\bytInitialData("\])?\s*=\s*\{/i, '</script>', '{');
        INFO.html5Player = (await getHtml5Player(id, options)).playerUrl;
    } catch (err) {
        throw Error('Error when parsing watch.html, maybe YouTube made a change.\n' + `Please report this issue with the "${utils.saveDebugFile('watch.html', BODY)}" file on https://github.com/ybd-project/ytdl-core/issues.`);
    }

    return INFO;
}
