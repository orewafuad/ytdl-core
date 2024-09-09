import { VERSION } from './constants';

export class Logger {
    public static debug(...messages: Array<any>) {
        if (VERSION.includes('dev') || VERSION.includes('beta') || VERSION.includes('test') || process.env.YTDL_DEBUG) {
            console.log('\x1b[35m[  DEBUG  ]:\x1B[0m', ...messages);
        }
    }

    public static info(...messages: Array<any>) {
        console.info('\x1b[34m[  INFO!  ]:\x1B[0m', ...messages);
    }

    public static success(...messages: Array<any>) {
        console.log('\x1b[32m[ SUCCESS ]:\x1B[0m', ...messages);
    }

    public static warning(...messages: Array<any>) {
        console.warn('\x1b[33m[ WARNING ]:\x1B[0m', ...messages);
    }

    public static error(...messages: Array<any>) {
        console.error('\x1b[31m[  ERROR  ]:\x1B[0m', ...messages);
    }
}