import { YtdlCore as DefaultYtdlCore } from '../package/platforms/Default/Default';
import { YtdlCore as BrowserYtdlCore } from '../package/platforms/Browser/Browser';
import { YtdlCore as ServerlessYtdlCore } from '../package/platforms/Serverless/Serverless';
import { VIDEO_IDS } from './node/src/meta/videoIds';
import { NORMAL_ACCESS_TOKEN, CLIENT_DATA_REQUIRED_ACCESS_TOKEN, PUBLISHERS_ACCESS_TOKEN } from './node/src/meta/env';

jest.useRealTimers();
jest.setTimeout(30000);

const CLIENTS: any = ['web', 'mweb', 'webCreator', 'android', 'ios', 'tv', 'tvEmbedded'],
    YTDL_CORE_OPTIONS: any = {
        hl: 'ja',
        gl: 'JP',
        /* includesPlayerAPIResponse: true,
    includesNextAPIResponse: true, */
        poToken: 'MnQvoU39lB1OrS-ZFJP2UOjzocFXQIhGdoizjiS2YO0rxe6lKcCJoKif0byytPJIUVDVR-MpXQ3qECJzXcp2J-D32vzEG2xB7aiyv5TpwKN9LPPErgpBhos2MbeIBXUOrgP-w62LWEBUJdv91aDgzDubRI3J6w==',
        visitorData: 'CgtFbmhuaDdZVkVhbyj6npK2BjIKCgJKUBIEGgAgYQ%3D%3D',
        oauth2Credentials: NORMAL_ACCESS_TOKEN,
        disableDefaultClients: true,
        includingClients: 'all',
        clients: CLIENTS,
        rewriteRequest: (url: string, options: RequestInit) => {
            return { url, options };
        },
        /* originalProxy: {
        base: 'https://billowing-night-77e7.ybd-project.workers.dev/',
        download: 'https://billowing-night-77e7.ybd-project.workers.dev/download',
        urlQueryName: 'url',
    }, */
    },
    ytdl_default = new DefaultYtdlCore(YTDL_CORE_OPTIONS),
    ytdl_browser = new BrowserYtdlCore(YTDL_CORE_OPTIONS),
    ytdl_serverless = new ServerlessYtdlCore(YTDL_CORE_OPTIONS);

describe('【@ybd-project/ytdl-core】機能テスト', () => {
    describe('GetInfo 関数テスト', () => {
        describe('デフォルト', () => {
            const { normal, private: privateVideo, beforePublication, limitedPublication, forChildren, ageRestricted, unavailable, invalid } = VIDEO_IDS;

            it(`通常（ID: ${normal}）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + normal);
                expect(RESULTS.videoDetails.videoId).toBe(normal);
            });

            it(`非公開（ID: ${privateVideo}）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + privateVideo);
                expect(RESULTS.videoDetails.videoId).toBe(privateVideo);
            });

            it(`公開前（ID: ${beforePublication}, プレミア公開前）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + beforePublication);
                expect(RESULTS.videoDetails.videoId).toBe(beforePublication);
            });

            it(`限定公開（ID: ${limitedPublication}）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + privateVideo);
                expect(RESULTS.videoDetails.videoId).toBe(privateVideo);
            });

            it(`子供向け（ID: ${forChildren}）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + forChildren);
                expect(RESULTS.videoDetails.videoId).toBe(forChildren);
            });

            it(`年齢制限（ID: ${ageRestricted}）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + ageRestricted);
                expect(RESULTS.videoDetails.videoId).toBe(ageRestricted);
            });

            it(`利用不可（ID: ${unavailable}）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + unavailable);
                expect(RESULTS).toThrow('All player APIs responded with an error. (Clients: webCreator, tvEmbedded, ios, android, web, mweb, tv)\nFor more information, specify YTDL_DEBUG as an environment variable.\nNote: This error cannot continue processing. (Details: "この動画は利用できません。")');
            });

            it(`無効なID（ID: ${invalid}）`, async () => {
                const RESULTS = await ytdl_default.getFullInfo('https://www.youtube.com/watch?v=' + invalid);
                expect(RESULTS).toThrow('TypeError: Video id (invalid) does not match expected format (/^[a-zA-Z0-9-_]{11}$/)');
            });
        });

        describe('ブラウザ', () => {
            const { normal, private: privateVideo, beforePublication, limitedPublication, forChildren, ageRestricted, unavailable, invalid } = VIDEO_IDS;

            it(`通常（ID: ${normal}）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + normal);
                expect(RESULTS.videoDetails.videoId).toBe(normal);
            });

            it(`非公開（ID: ${privateVideo}）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + privateVideo);
                expect(RESULTS.videoDetails.videoId).toBe(privateVideo);
            });

            it(`公開前（ID: ${beforePublication}, プレミア公開前）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + beforePublication);
                expect(RESULTS.videoDetails.videoId).toBe(beforePublication);
            });

            it(`限定公開（ID: ${limitedPublication}）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + privateVideo);
                expect(RESULTS.videoDetails.videoId).toBe(privateVideo);
            });

            it(`子供向け（ID: ${forChildren}）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + forChildren);
                expect(RESULTS.videoDetails.videoId).toBe(forChildren);
            });

            it(`年齢制限（ID: ${ageRestricted}）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + ageRestricted);
                expect(RESULTS.videoDetails.videoId).toBe(ageRestricted);
            });

            it(`利用不可（ID: ${unavailable}）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + unavailable);
                expect(RESULTS).toThrow('All player APIs responded with an error. (Clients: webCreator, tvEmbedded, ios, android, web, mweb, tv)\nFor more information, specify YTDL_DEBUG as an environment variable.\nNote: This error cannot continue processing. (Details: "この動画は利用できません。")');
            });

            it(`無効なID（ID: ${invalid}）`, async () => {
                const RESULTS = await ytdl_browser.getFullInfo('https://www.youtube.com/watch?v=' + invalid);
                expect(RESULTS).toThrow('TypeError: Video id (invalid) does not match expected format (/^[a-zA-Z0-9-_]{11}$/)');
            });
        });

        describe('サーバーレス', () => {
            const { normal, private: privateVideo, beforePublication, limitedPublication, forChildren, ageRestricted, unavailable, invalid } = VIDEO_IDS;

            it(`通常（ID: ${normal}）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + normal);
                expect(RESULTS.videoDetails.videoId).toBe(normal);
            });

            it(`非公開（ID: ${privateVideo}）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + privateVideo);
                expect(RESULTS.videoDetails.videoId).toBe(privateVideo);
            });

            it(`公開前（ID: ${beforePublication}, プレミア公開前）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + beforePublication);
                expect(RESULTS.videoDetails.videoId).toBe(beforePublication);
            });

            it(`限定公開（ID: ${limitedPublication}）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + privateVideo);
                expect(RESULTS.videoDetails.videoId).toBe(privateVideo);
            });

            it(`子供向け（ID: ${forChildren}）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + forChildren);
                expect(RESULTS.videoDetails.videoId).toBe(forChildren);
            });

            it(`年齢制限（ID: ${ageRestricted}）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + ageRestricted);
                expect(RESULTS.videoDetails.videoId).toBe(ageRestricted);
            });

            it(`利用不可（ID: ${unavailable}）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + unavailable);
                expect(RESULTS).toThrow('All player APIs responded with an error. (Clients: webCreator, tvEmbedded, ios, android, web, mweb, tv)\nFor more information, specify YTDL_DEBUG as an environment variable.\nNote: This error cannot continue processing. (Details: "この動画は利用できません。")');
            });

            it(`無効なID（ID: ${invalid}）`, async () => {
                const RESULTS = await ytdl_serverless.getFullInfo('https://www.youtube.com/watch?v=' + invalid);
                expect(RESULTS).toThrow('TypeError: Video id (invalid) does not match expected format (/^[a-zA-Z0-9-_]{11}$/)');
            });
        });
    });
});
