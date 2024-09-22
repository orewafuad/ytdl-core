"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 0;
    }
}
exports.default = RequestError;
//# sourceMappingURL=RequestError.js.map