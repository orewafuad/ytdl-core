import type { VercelRequest, VercelResponse } from '@vercel/node';
import { YtdlCore, YTDL_VideoInfo, YTDL_VideoFormat } from '@ybd-project/ytdl-core/serverless';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Headers', '*');

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
        VIDEO_ID = req.query.id;

    if (!VIDEO_ID) {
        return res.json({
            error: 'No video ID provided',
        });
    }

    function errorHandler(err: Error) {
        console.error(err);
        res.json({
            error: err.message,
        });
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
                    res.json(VIDEO_INFO);
                })
                .catch(errorHandler);
        })
        .catch(errorHandler);
}
