"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoToken = void 0;
const Platform_1 = require("../platforms/Platform");
const Log_1 = require("../utils/Log");
const RUNTIME = Platform_1.Platform.getShim().runtime;
class PoToken {
    static async generatePoToken() {
        return new Promise((resolve) => {
            if (RUNTIME !== 'default') {
                return {
                    poToken: '',
                    visitorData: '',
                };
            }
            const { generate } = require('youtube-po-token-generator');
            try {
                generate()
                    .then((data) => {
                    Log_1.Logger.success('Successfully generated a poToken.');
                    resolve(data);
                })
                    .catch((err) => {
                    Log_1.Logger.error('Failed to generate a poToken.\nDetails: ' + err);
                    resolve({
                        poToken: '',
                        visitorData: '',
                    });
                });
            }
            catch (err) {
                Log_1.Logger.error('Failed to generate a poToken.\nDetails: ' + err);
                resolve({
                    poToken: '',
                    visitorData: '',
                });
            }
        });
    }
}
exports.PoToken = PoToken;
//# sourceMappingURL=PoToken.js.map