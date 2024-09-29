import { YtdlCore, YTDL_NodejsStreamType } from '@ybd-project/ytdl-core';
import fs from 'fs';

const ytdl = new YtdlCore({
    hl: 'en',
    gl: 'US',
    streamType: 'nodejs',
});

// Video: Never Gonna give you up
const VIDEO_ID = 'dQw4w9WgXcQ';

/* Normal usage (Full Info) */
ytdl.download<YTDL_NodejsStreamType>(`https://www.youtube.com/watch?v=${VIDEO_ID}`, {
    filter: 'audioonly',
}).then((stream) => {
    stream.pipe(fs.createWriteStream(`./${VIDEO_ID}.mp3`));
}).catch((err) => {
    console.error(err);
});
