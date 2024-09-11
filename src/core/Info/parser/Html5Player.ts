type Html5PlayerInfo = { playerUrl: string | null; path: string | null; signatureTimestamp: string };

import type { YTDL_GetInfoOptions } from '@/types/Options';
import Url from '@/utils/Url';
import YouTubePageExtractor from './PageExtractor';
import { FileCache } from '@/core/Cache';
import { getSignatureTimestamp } from '@/core/Signature';

function getPlayerPath(body: string): string | null {
    const HTML5_PLAYER_RES = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(body);

    return HTML5_PLAYER_RES ? HTML5_PLAYER_RES[1] || HTML5_PLAYER_RES[2] : null;
}

export default async function getHtml5Player(id: string, options: YTDL_GetInfoOptions): Promise<Html5PlayerInfo> {
    const CACHE = FileCache.get<Html5PlayerInfo>('html5Player');

    if (CACHE) {
        return {
            playerUrl: CACHE.playerUrl,
            path: CACHE.path,
            signatureTimestamp: CACHE.signatureTimestamp,
        };
    }

    const WATCH_PAGE_BODY_PROMISE = YouTubePageExtractor.getWatchPageBody(id, options),
        WATCH_PAGE_BODY = await WATCH_PAGE_BODY_PROMISE,
        PLAYER_PATH = getPlayerPath(WATCH_PAGE_BODY) || getPlayerPath(await YouTubePageExtractor.getEmbedPageBody(id, options)),
        PLAYER_URL = PLAYER_PATH ? new URL(PLAYER_PATH, Url.getBaseUrl()).toString() : null;

    return {
        playerUrl: PLAYER_URL,
        path: PLAYER_PATH,
        signatureTimestamp: PLAYER_URL ? await getSignatureTimestamp(PLAYER_URL, options) || '' : '',
    };
}
