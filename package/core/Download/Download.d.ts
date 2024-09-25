import type { YTDL_VideoInfo } from '../../types';
import { InternalDownloadOptions } from '../../core/types';
/** Reference: LuanRT/YouTube.js - Utils.ts */
export declare function streamToIterable(stream: ReadableStream<Uint8Array>): AsyncGenerator<Uint8Array, void, unknown>;
declare function downloadFromInfo(info: YTDL_VideoInfo, options: InternalDownloadOptions): Promise<ReadableStream<Uint8Array>>;
declare function download(link: string, options: InternalDownloadOptions): Promise<ReadableStream<Uint8Array>>;
export { download, downloadFromInfo };
