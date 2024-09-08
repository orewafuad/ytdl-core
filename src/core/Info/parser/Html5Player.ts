type Html5PlayerInfo = { playerUrl: string | null; path: string | null };

import type { YTDL_GetInfoOptions } from '@/types/Options';
import Url from '@/utils/Url';
import YouTubePageExtractor from './PageExtractor';

function getPlayerPath(body: string): string | null {
    const HTML5_PLAYER_RES = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(body);

    return HTML5_PLAYER_RES ? HTML5_PLAYER_RES[1] || HTML5_PLAYER_RES[2] : null;
}

export default async function getHtml5Player(id: string, options: YTDL_GetInfoOptions): Promise<Html5PlayerInfo> {
    const WATCH_PAGE_BODY_PROMISE = YouTubePageExtractor.getWatchPageBody(id, options),
        EMBED_PAGE_BODY_PROMISE = YouTubePageExtractor.getEmbedPageBody(id, options),
        PLAYER_PATH = getPlayerPath(await WATCH_PAGE_BODY_PROMISE) || getPlayerPath(await EMBED_PAGE_BODY_PROMISE);

    return {
        playerUrl: PLAYER_PATH ? new URL(PLAYER_PATH, Url.getBaseUrl()).toString() : null,
        path: PLAYER_PATH,
    };
}
