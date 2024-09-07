type YTDL_M3U8Data = {
    itag: number;
    url: string;
};
type YTDL_DashManifestData = {
    itag: number;
    url: string;
    bitrate: number;
    mimeType: string;
    audioSampleRate?: number;
    width?: number;
    height?: number;
    fps?: number;
};
import { YTDL_RequestOptions } from '../../../types/options';
import { YT_StreamingFormat, YT_YTInitialPlayerResponse } from '../../../types/youtube';
export default class Formats {
    static parseFormats(playerResponse: YT_YTInitialPlayerResponse | null): Array<YT_StreamingFormat>;
    static getM3U8(url: string, options: YTDL_RequestOptions): Promise<Record<string, YTDL_M3U8Data>>;
    static getDashManifest(url: string, options: YTDL_RequestOptions): Promise<Record<string, YTDL_DashManifestData>>;
    static parseAdditionalManifests(playerResponse: YT_YTInitialPlayerResponse | null, options: YTDL_RequestOptions): Array<Promise<Record<string, YTDL_M3U8Data | YTDL_DashManifestData>>>;
}
export {};
