"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = exports.getFullInfo = exports.getBasicInfo = void 0;
var BasicInfo_1 = require("./BasicInfo");
Object.defineProperty(exports, "getBasicInfo", { enumerable: true, get: function () { return __importDefault(BasicInfo_1).default; } });
var FullInfo_1 = require("./FullInfo");
Object.defineProperty(exports, "getFullInfo", { enumerable: true, get: function () { return __importDefault(FullInfo_1).default; } });
var FullInfo_2 = require("./FullInfo");
Object.defineProperty(exports, "getInfo", { enumerable: true, get: function () { return FullInfo_2.getInfo; } });
//# sourceMappingURL=index.js.map