"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const SIGNATURE_TIMESTAMP_REGEX = /signatureTimestamp:(\d+)/g;
class Signature {
    static getSignatureTimestamp(body) {
        const MATCH = body.match(SIGNATURE_TIMESTAMP_REGEX);
        if (MATCH) {
            return MATCH[0].split(':')[1];
        }
        return '0';
    }
}
exports.Signature = Signature;
//# sourceMappingURL=Signature.js.map