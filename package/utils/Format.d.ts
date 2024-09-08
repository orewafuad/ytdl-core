import { YTDL_VideoFormat } from '../types/Ytdl';
import { YTDL_ChooseFormatOptions } from '../types/Options';
import { YT_StreamingAdaptiveFormat } from '../types/youtube';
declare function sortFormats(a: Object, b: Object): number;
declare function filterFormats(formats: Array<YTDL_VideoFormat>, filter?: YTDL_ChooseFormatOptions['filter']): Array<YTDL_VideoFormat>;
declare function chooseFormat(formats: Array<YTDL_VideoFormat>, options: YTDL_ChooseFormatOptions): YTDL_VideoFormat;
declare function addFormatMeta(adaptiveFormat: YT_StreamingAdaptiveFormat, includesOriginalFormatData: boolean): YTDL_VideoFormat;
export { sortFormats, filterFormats, chooseFormat, addFormatMeta };
declare const _default: {
    sortFormats: typeof sortFormats;
    filterFormats: typeof filterFormats;
    chooseFormat: typeof chooseFormat;
    addFormatMeta: typeof addFormatMeta;
};
export default _default;
