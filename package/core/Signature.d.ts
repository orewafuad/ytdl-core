import { YT_StreamingAdaptiveFormat } from '../types';
declare class Signature {
    decipherFunction: string | null;
    nTransformFunction: string | null;
    static getSignatureTimestamp(body: string): string;
    decipherFormats(formats: Array<YT_StreamingAdaptiveFormat>): Record<string, YT_StreamingAdaptiveFormat>;
    getDecipherFunctions(playerId: string, body: string): string | null;
    getNTransform(playerId: string, body: string): string | null;
}
export { Signature };
