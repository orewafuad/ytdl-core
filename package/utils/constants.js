"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISSUES_URL = exports.REPO_URL = exports.VERSION = void 0;
const package_json_1 = __importDefault(require("../../package.json"));
exports.VERSION = package_json_1.default.version;
exports.REPO_URL = 'https://github.com/ybd-project/ytdl-core';
exports.ISSUES_URL = 'https://github.com/ybd-project/ytdl-core/issues';
//# sourceMappingURL=Constants.js.map