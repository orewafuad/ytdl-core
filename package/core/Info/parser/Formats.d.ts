import { YT_StreamingFormat, YT_YTInitialPlayerResponse } from '../../../types/youtube';
export default class Formats {
    static parseFormats(playerResponse: YT_YTInitialPlayerResponse | null): Array<YT_StreamingFormat>;
}
