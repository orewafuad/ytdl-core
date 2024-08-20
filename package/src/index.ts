import { PassThrough } from 'stream';
import Miniget from 'miniget';
import m3u8stream, { parseTimestamp } from 'm3u8stream';
import info from './info';
import utils from './utils';
import formatUtils from './format-utils';
import urlUtils from './url-utils';
import agent from './agent';

import { YTDL_DownloadOptions, YTDL_GetInfoOptions } from '@/types/options';
import { createStream } from 'sax';

function ytdl(link: string, options: YTDL_DownloadOptions = {}) {
    const STREAM = createStream(options as any);

    info.getInfo(link, options).then((info) => {
        downloadFromInfoCallback(STREAM, info, options);
    }, STREAM.emit.bind(STREAM, 'error'));

    return STREAM;
}
