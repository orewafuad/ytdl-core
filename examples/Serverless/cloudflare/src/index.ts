import { YTDL_VideoFormat, YTDL_VideoInfo, YtdlCore } from '@ybd-project/ytdl-core/serverless';

export default {
    async fetch(req: Request): Promise<Response> {
        return new Promise((resolve) => {
            // When deploying to Cloudflare Workers, the following options are recommended to avoid the free plan's 10 ms CPU time limit.
            const ytdl = new YtdlCore({
                    hl: 'en',
                    gl: 'US',
                    disableDefaultClients: true,
                    disablePoTokenAutoGeneration: true,
                    disableInitialSetup: true,
                    parsesHLSFormat: false,
                    noUpdate: true,
                    logDisplay: ['warning', 'error'],
                    clients: ['mweb', 'web'],
                    filter: 'videoandaudio',
                    html5Player: {
                        useRetrievedFunctionsFromGithub: true,
                    },
                }),
                SEARCH_PARAMS = new URL(req.url || '').searchParams,
                VIDEO_ID = SEARCH_PARAMS.get('id');

            if (!VIDEO_ID) {
                const RESPONSE = JSON.stringify({
                    error: 'No video ID provided',
                });

                resolve(new Response(RESPONSE, { headers: { 'Content-Type': 'application/json' } }));
                return;
            }

            function errorHandler(err: Error) {
                const RESPONSE = new Response(
                    JSON.stringify({
                        error: err.message,
                    }),
                    { headers: { 'Content-Type': 'application/json' } },
                );

                resolve(RESPONSE);
            }

            if (req.url.includes('/streaming')) {
                ytdl.download('https://www.youtube.com/watch?v=' + VIDEO_ID)
                    .then(async (stream) => {
                        resolve(new Response(stream, { headers: { 'Content-Type': 'video/mp4' } }));
                    })
                    .catch(errorHandler);
                return;
            }

            ytdl.getBasicInfo('https://www.youtube.com/watch?v=' + VIDEO_ID)
                .then((results) => {
                    // Filter your favorite format here. You can do without this code.
                    (results.formats as any) = results.formats.filter((format) => format.itag === 18);

                    YtdlCore.decipherFormats(results.formats, {
                        useRetrievedFunctionsFromGithub: true,
                    })
                        .then(async (formats) => {
                            const VIDEO_INFO = results as any as YTDL_VideoInfo<YTDL_VideoFormat>;
                            VIDEO_INFO.formats = YtdlCore.toVideoFormats(formats);
                            VIDEO_INFO.full = true;
                            resolve(Response.json(VIDEO_INFO, { headers: { 'Content-Type': 'application/json' } }));
                        })
                        .catch(errorHandler);
                })
                .catch(errorHandler);
        });
    },
};
