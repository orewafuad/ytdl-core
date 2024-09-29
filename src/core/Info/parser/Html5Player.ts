type Html5PlayerInfo = { url: string | null; body: string | null; id: string | null; signatureTimestamp: string };

import type { YTDL_GetInfoOptions } from '@/types/Options';

import { Platform } from '@/platforms/Platform';

import { Signature } from '@/core/Signature';
import { Fetcher } from '@/core/Fetcher';

import { Url } from '@/utils/Url';
import { Logger } from '@/utils/Log';
import { CURRENT_PLAYER_ID } from '@/utils/Constants';

const FileCache = Platform.getShim().fileCache;

function getPlayerId(body?: string): string | null {
    if (!body) {
        return null;
    }

    const MATCH = body.match(/player\\\/([a-zA-Z0-9]+)\\\//);

    if (MATCH) {
        return MATCH[1];
    }

    return null;
}

async function getHtml5Player(options: YTDL_GetInfoOptions): Promise<Html5PlayerInfo> {
    const CACHE = await FileCache.get<Html5PlayerInfo>('html5Player');

    if (CACHE && CACHE.url) {
        return {
            url: CACHE.url,
            body: CACHE.body,
            id: CACHE.id,
            signatureTimestamp: CACHE.signatureTimestamp,
        };
    }

    let playerId = undefined;

    try {
        const IFRAME_API_BODY = await Fetcher.request<string>(Url.getIframeApiUrl(), options);
        playerId = getPlayerId(IFRAME_API_BODY);
    } catch {}

    if (!playerId && options.originalProxy) {
        Logger.debug('Could not get html5Player using your own proxy. It is retrieved again with its own proxy disabled. (Other requests will not invalidate it.)');

        try {
            const BODY = await Fetcher.request<string>(Url.getIframeApiUrl(), {
                ...options,
                rewriteRequest: undefined,
                originalProxy: undefined,
            });
            playerId = getPlayerId(BODY);
        } catch {}
    }

    if (!playerId) {
        playerId = CURRENT_PLAYER_ID;
    }

    const PLAYER_URL = playerId ? Url.getPlayerJsUrl(playerId) : null;

    const HTML5_PLAYER_BODY = PLAYER_URL ? await Fetcher.request<string>(PLAYER_URL, options) : '',
        DATA = {
            url: PLAYER_URL,
            body: HTML5_PLAYER_BODY || null,
            id: playerId,
            signatureTimestamp: PLAYER_URL ? Signature.getSignatureTimestamp(HTML5_PLAYER_BODY) || '' : '',
        };

    FileCache.set('html5Player', JSON.stringify(DATA));

    return DATA;
}

export { getHtml5Player };
