import { YtdlCore } from '@ybd-project/ytdl-core';

const ytdl = new YtdlCore({
    rewriteRequest: (url, options) => {
        return {
            url: `https://original-proxy-1.example.com/?url=${encodeURIComponent(url)}`,
            options,
        };
    },
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
    rewriteRequest: (url, options) => {
        return {
            url: `https://original-proxy-2.example.com/?url=${encodeURIComponent(url)}`,
            options,
        };
    },
})
    .then((info) => {
        console.log(info);
    })
    .catch((err) => {
        console.error(err);
    });
