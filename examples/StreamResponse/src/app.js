const express = require('express'),
    { YtdlCore } = require('@ybd-project/ytdl-core'),
    app = express(),
    ytdl = new YtdlCore({
        lang: 'en',
    });

app.get('/api/download', (req, res) => {
    const VIDEO_ID = req.query.videoId;

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

    ytdl.download(`https://www.youtube.com/watch?v=${VIDEO_ID}`, {
        filter: 'audioandvideo',
    }).pipe(res);
});

app.get('/api/download/audio', (req, res) => {
    const VIDEO_ID = req.query.videoId;

    res.setHeader('Content-Type', 'audio/mp3');
    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');

    ytdl.download(`https://www.youtube.com/watch?v=${VIDEO_ID}`, {
        filter: 'audioonly',
    }).pipe(res);
});

app.get('/api/download', (req, res) => {
    const VIDEO_ID = req.query.videoId;

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

    ytdl.download(`https://www.youtube.com/watch?v=${VIDEO_ID}`, {
        filter: 'videoonly',
    }).pipe(res);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
