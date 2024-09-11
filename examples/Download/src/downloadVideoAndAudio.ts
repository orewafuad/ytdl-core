import { YtdlCore } from '@ybd-project/ytdl-core';
import fs from 'fs';

const ytdl = new YtdlCore({
    lang: 'en',
});

// Video: Never Gonna give you up
const VIDEO_ID = 'dQw4w9WgXcQ';

/* Normal usage (Full Info) */
ytdl.download(`https://www.youtube.com/watch?v=${VIDEO_ID}`, {
    filter: 'videoandaudio',
}).pipe(fs.createWriteStream(`./${VIDEO_ID}.mp3`));