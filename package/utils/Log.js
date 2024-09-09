"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const constants_1 = require("./constants");
class Logger {
    static debug(...messages) {
        if (constants_1.VERSION.includes('dev') || constants_1.VERSION.includes('beta') || constants_1.VERSION.includes('test') || process.env.YTDL_DEBUG) {
            console.log('\x1b[35m[  DEBUG  ]:\x1B[0m', ...messages);
        }
    }
    static info(...messages) {
        console.info('\x1b[34m[  INFO!  ]:\x1B[0m', ...messages);
    }
    static success(...messages) {
        console.log('\x1b[32m[ SUCCESS ]:\x1B[0m', ...messages);
    }
    static warning(...messages) {
        console.warn('\x1b[33m[ WARNING ]:\x1B[0m', ...messages);
    }
    static error(...messages) {
        console.error('\x1b[31m[  ERROR  ]:\x1B[0m', ...messages);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Log.js.map