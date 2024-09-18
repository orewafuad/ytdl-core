const { YtdlCore } = require('@ybd-project/ytdl-core');

const ytdl = new YtdlCore({
    originalProxyUrl: 'https://original-proxy-1.example.com',
});

/* Normal Usage */
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    .then((info) => {
        console.log(info);
    })
    .catch((err) => {
        console.error(err);
    });

/* Proxy Override */
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
    originalProxyUrl: 'https://original-proxy-2.example.com',
})
    .then((info) => {
        console.log(info);
    })
    .catch((err) => {
        console.error(err);
    });
