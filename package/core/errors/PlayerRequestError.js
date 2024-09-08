"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerRequestError extends Error {
    response;
    constructor(message) {
        super(message);
        this.response = null;
    }
}
exports.default = PlayerRequestError;
//# sourceMappingURL=PlayerRequestError.js.map