"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_po_token_generator_1 = require("youtube-po-token-generator");
const Log_1 = require("../utils/Log");
class PoToken {
    static async generatePoToken() {
        try {
            const data = await (0, youtube_po_token_generator_1.generate)();
            Log_1.Logger.success('Successfully generated a poToken.');
            return data;
        }
        catch (err) {
            Log_1.Logger.error('Failed to generate a poToken.');
            return {
                poToken: '',
                visitorData: '',
            };
        }
    }
}
exports.default = PoToken;
//# sourceMappingURL=PoToken.js.map