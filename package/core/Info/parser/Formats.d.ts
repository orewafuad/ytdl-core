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
import { YTDL_RequestOptions } from '../../../types/Options';
import { YT_StreamingAdaptiveFormat, YT_PlayerApiResponse } from '../../../types/youtube';
export default class Formats {
    static parseFormats(playerResponse: YT_PlayerApiResponse | null): Array<YT_StreamingAdaptiveFormat>;
    static getM3U8(url: string, options: YTDL_RequestOptions): Promise<Record<string, YTDL_M3U8Data>>;
    static getDashManifest(url: string, options: YTDL_RequestOptions): Promise<Record<string, YTDL_DashManifestData>>;
    static parseAdditionalManifests(playerResponse: YT_PlayerApiResponse | null, options: YTDL_RequestOptions): Array<Promise<Record<string, YTDL_M3U8Data | YTDL_DashManifestData>>>;
}
export {};
