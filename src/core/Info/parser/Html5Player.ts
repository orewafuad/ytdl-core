import type { YTDL_DownloadOptions, YTDL_GetInfoOptions } from '@/types/Options';
import type { Html5PlayerCache } from '@/types';

import { Platform } from '@/platforms/Platform';

import { Signature } from '@/core/Signature';
import { Fetcher } from '@/core/Fetcher';

import { Url } from '@/utils/Url';
import { Logger } from '@/utils/Log';
import { getDecipherFunction, getNTransformFunction } from '@/utils/Html5Player';

const SHIM = Platform.getShim(),
    GITHUB_API_BASE_URL = `https://raw.githubusercontent.com/${SHIM.info.repo.user}/${SHIM.info.repo.name}/refs/heads/dev/data/player`,
    FileCache = SHIM.fileCache;

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

async function getPlayerFunctions(options: YTDL_GetInfoOptions, html5Player: YTDL_DownloadOptions['html5Player']): Promise<Html5PlayerCache> {
    const CACHE = await FileCache.get<Html5PlayerCache>('html5Player');

    if (CACHE && CACHE.signatureTimestamp) {
        return CACHE;
    }

    Logger.debug('To speed up processing, html5Player and signatureTimestamp are pre-fetched and cached.');

    let playerId = undefined,
        playerBody = undefined;

    if (!html5Player?.useRetrievedFunctionsFromGithub) {
        try {
            const IFRAME_API_BODY = await Fetcher.request<string>(Url.getIframeApiUrl(), options);
            playerId = getPlayerId(IFRAME_API_BODY);
        } catch {}
    }

    if (html5Player?.useRetrievedFunctionsFromGithub || !playerId) {
        const GITHUB_PLAYER_DATA = await Fetcher.request<string>(GITHUB_API_BASE_URL + '/data.json');
        FileCache.set('html5Player', GITHUB_PLAYER_DATA);
        return JSON.parse(GITHUB_PLAYER_DATA);
    }

    const PLAYER_URL = Url.getPlayerJsUrl(playerId);
    if (PLAYER_URL) {
        try {
            playerBody = await Fetcher.request<string>(PLAYER_URL, options);
        } catch {}
    }

    if (!playerBody) {
        try {
            playerBody = await Fetcher.request<string>(GITHUB_API_BASE_URL + '/base.js');
        } catch {}
    }

    if (!playerBody) {
        throw new Error('Failed to retrieve player body.');
    }

    const DATA: Html5PlayerCache = {
        id: playerId,
        body: playerBody,
        signatureTimestamp: PLAYER_URL ? Signature.getSignatureTimestamp(playerBody) || '' : '',
        functions: {
            decipher: getDecipherFunction(playerId, playerBody),
            nTransform: getNTransformFunction(playerId, playerBody),
        },
    };

    FileCache.set('html5Player', JSON.stringify(DATA));

    return DATA;
}

export { getPlayerFunctions };
