const fs = require('fs'),
    { YtdlCore } = require('@ybd-project/ytdl-core'),
    ytdl = new YtdlCore({
        hl: 'en',
        gl: 'US',
        streamType: 'nodejs',
    });

// Video: Never Gonna give you up
const VIDEO_ID = 'dQw4w9WgXcQ';

/* Normal usage (Full Info) */
ytdl.download(`https://www.youtube.com/watch?v=${VIDEO_ID}`, {
    filter: 'videoonly',
}).then((stream) => {
    stream.pipe(fs.createWriteStream(`./${VIDEO_ID}.mp4`));
}).catch((err) => {
    console.error(err);
});
