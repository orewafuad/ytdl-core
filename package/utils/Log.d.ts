export declare class Logger {
    private static replaceColorTags;
    private static convertMessage;
    private static convertMessages;
    static debug(...messages: Array<any>): void;
    static info(...messages: Array<any>): void;
    static success(...messages: Array<any>): void;
    static warning(...messages: Array<any>): void;
    static error(...messages: Array<any>): void;
}
