"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Formats {
    static parseFormats(playerResponse) {
        let formats = [];
        if (playerResponse && playerResponse.streamingData) {
            formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
        }
        return formats;
    }
}
exports.default = Formats;
//# sourceMappingURL=Formats.js.map