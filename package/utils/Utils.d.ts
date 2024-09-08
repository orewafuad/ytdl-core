/** Extract string inbetween another */
declare function between(haystack: string, left: RegExp | string, right: string): string;
declare function tryParseBetween<T = unknown>(body: string, left: RegExp | string, right: string, prepend?: string, append?: string): T | null;
/** Get a number from an abbreviated number string. */
declare function parseAbbreviatedNumber(string: string): number | null;
/** Match begin and end braces of input JS, return only JS */
declare function cutAfterJS(mixedJson: string): string;
/** Temporary helper to help deprecating a few properties. */
declare function deprecate(obj: Object, prop: string, value: Object, oldPath: string, newPath: string): void;
declare function saveDebugFile(name: string, body: any): string;
declare function getPropInsensitive<T = unknown>(obj: any, prop: string): T;
declare function setPropInsensitive(obj: any, prop: string, value: any): string | null;
declare function generateClientPlaybackNonce(length: number): string;
declare let lastUpdateCheck: number;
declare function checkForUpdates(): Promise<void> | null;
export { between, tryParseBetween, parseAbbreviatedNumber, cutAfterJS, deprecate, lastUpdateCheck, checkForUpdates, saveDebugFile, getPropInsensitive, setPropInsensitive, generateClientPlaybackNonce };
declare const _default: {
    between: typeof between;
    tryParseBetween: typeof tryParseBetween;
    parseAbbreviatedNumber: typeof parseAbbreviatedNumber;
    cutAfterJS: typeof cutAfterJS;
    deprecate: typeof deprecate;
    lastUpdateCheck: number;
    checkForUpdates: typeof checkForUpdates;
    saveDebugFile: typeof saveDebugFile;
    getPropInsensitive: typeof getPropInsensitive;
    setPropInsensitive: typeof setPropInsensitive;
    generateClientPlaybackNonce: typeof generateClientPlaybackNonce;
};
export default _default;
