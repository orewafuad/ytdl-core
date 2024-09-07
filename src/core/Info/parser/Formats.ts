import { YT_StreamingFormat, YT_YTInitialPlayerResponse } from '@/types/youtube';

export default class Formats {
    static parseFormats(playerResponse: YT_YTInitialPlayerResponse | null): Array<YT_StreamingFormat> {
        let formats: Array<YT_StreamingFormat> = [];

        if (playerResponse && playerResponse.streamingData) {
            formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
        }

        return formats;
    }
}
