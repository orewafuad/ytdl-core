const fs = require('fs'),
    { YtdlCore } = require('@ybd-project/ytdl-core'),
    ytdl = new YtdlCore({
        lang: 'en',
    });

// Video: Never Gonna give you up
const VIDEO_ID = 'dQw4w9WgXcQ';

/* Normal usage (Full Info) */
ytdl.download(`https://www.youtube.com/watch?v=${VIDEO_ID}`, {
    filter: 'audioonly',
}).pipe(fs.createWriteStream(`./${VIDEO_ID}.mp3`));
