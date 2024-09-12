"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_po_token_generator_1 = require("youtube-po-token-generator");
const Log_1 = require("../utils/Log");
class PoToken {
    static async generatePoToken() {
        return new Promise((resolve) => {
            try {
                (0, youtube_po_token_generator_1.generate)()
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
exports.default = PoToken;
//# sourceMappingURL=PoToken.js.map