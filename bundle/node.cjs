/* eslint-disable */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package/platforms/Platform.js
var require_Platform = __commonJS({
  "package/platforms/Platform.js"(exports2) {
    "use strict";
    var __classPrivateFieldSet = exports2 && exports2.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports2 && exports2.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _a;
    var _Platform_shim;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Platform = void 0;
    var _Platform = class _Platform {
      static load(shim) {
        shim.fileCache.initialization();
        __classPrivateFieldSet(this, _a, shim, "f", _Platform_shim);
      }
      static getShim() {
        if (!__classPrivateFieldGet(this, _a, "f", _Platform_shim)) {
          throw new Error("Platform is not loaded");
        }
        return __classPrivateFieldGet(this, _a, "f", _Platform_shim);
      }
    };
    __name(_Platform, "Platform");
    var Platform = _Platform;
    exports2.Platform = Platform;
    _a = Platform;
    _Platform_shim = { value: void 0 };
  }
});

// package/platforms/utils/Classes.js
var require_Classes = __commonJS({
  "package/platforms/utils/Classes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CacheWithMap = exports2.YtdlCore_Cache = void 0;
    var _YtdlCore_Cache = class _YtdlCore_Cache {
    };
    __name(_YtdlCore_Cache, "YtdlCore_Cache");
    var YtdlCore_Cache = _YtdlCore_Cache;
    exports2.YtdlCore_Cache = YtdlCore_Cache;
    var _CacheWithMap = class _CacheWithMap {
      constructor(ttl = 6e4) {
        this.ttl = ttl;
        this.cache = /* @__PURE__ */ new Map();
        this.timeouts = /* @__PURE__ */ new Map();
      }
      async get(key) {
        return this.cache.get(key) || null;
      }
      async set(key, value) {
        this.cache.set(key, value);
        if (this.timeouts.has(key)) {
          clearTimeout(this.timeouts.get(key));
        }
        const timeout = setTimeout(() => {
          this.delete(key);
        }, this.ttl);
        this.timeouts.set(key, timeout);
        return true;
      }
      async has(key) {
        return this.cache.has(key);
      }
      async delete(key) {
        if (this.timeouts.has(key)) {
          clearTimeout(this.timeouts.get(key));
          this.timeouts.delete(key);
        }
        return this.cache.delete(key);
      }
      disable() {
      }
      initialization() {
      }
    };
    __name(_CacheWithMap, "CacheWithMap");
    var CacheWithMap = _CacheWithMap;
    exports2.CacheWithMap = CacheWithMap;
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "@ybd-project/ytdl-core",
      version: "5.1.9-2",
      description: "YBD Project fork of ytdl-core.",
      author: "YBD Project",
      repository: {
        type: "git",
        url: "git://github.com/ybd-project/ytdl-core.git"
      },
      publishConfig: {
        registry: "https://npm.pkg.github.com"
      },
      engines: {
        node: ">=16.0"
      },
      main: "./package/Platforms/Default/Default.js",
      types: "./package/types/index.d.ts",
      exports: {
        ".": {
          types: "./package/types/index.d.ts",
          node: {
            import: "./package/Platforms/Default/Default.js",
            require: "./bundle/node.cjs"
          },
          browser: "./package/Platforms/Browser/Browser.js",
          default: "./package/Platforms/Default/Default.js"
        },
        "./browser": {
          types: "./package/types/index.d.ts",
          default: "./package/Platforms/Browser/Browser.js"
        },
        "./serverless": {
          types: "./package/types/index.d.ts",
          default: "./package/Platforms/Serverless/Serverless.js"
        }
      },
      files: [
        "package"
      ],
      scripts: {
        test: "npx jest ./test/main.test.ts",
        build: "rmdir /s /q package && tsc && tsc-alias && npm run clear-cache-files && npm run create-node-bundle",
        "clear-cache-files": "cd package/core && rmdir /s /q CacheFiles 2>nul & cd ../..",
        update: "ncu && ncu -u && npm i",
        "publish:github": "npm run build && npm publish --registry=https://npm.pkg.github.com",
        "publish:npm": "npm run build && npm publish --registry=https://registry.npmjs.org/",
        "create-node-bundle": 'rmdir /s /q bundle && mkdir bundle && esbuild ./package/Platforms/Default/Default.js --bundle --target=node16 --keep-names --format=cjs --platform=node --outfile=./bundle/node.cjs --external:chrono-node --external:http-cookie-agent --external:m3u8stream --external:miniget --external:sax --external:tough-cookie --external:undici --external:youtube-po-token-generator --banner:js="/* eslint-disable */"'
      },
      dependencies: {
        "chrono-node": "^2.7.7",
        "http-cookie-agent": "^6.0.5",
        m3u8stream: "^0.8.6",
        miniget: "^4.2.3",
        sax: "^1.4.1",
        "tough-cookie": "^4.1.4",
        undici: "^6.19.8",
        "youtube-po-token-generator": "^0.2.0"
      },
      devDependencies: {
        "@types/jest": "^29.5.13",
        "@types/node": "^22.5.5",
        "@types/sax": "^1.2.7",
        esbuild: "^0.24.0",
        eslint: "^9.11.0",
        jest: "^29.7.0",
        "npm-check-updates": "^17.1.3",
        "ts-jest": "^29.2.5",
        "tsc-alias": "^1.8.10",
        typescript: "^5.6.2"
      },
      keywords: [
        "youtube",
        "video",
        "download",
        "ybd-project",
        "ytdl"
      ],
      license: "MIT"
    };
  }
});

// package/utils/Constants.js
var require_Constants = __commonJS({
  "package/utils/Constants.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ISSUES_URL = exports2.REPO_URL = exports2.VERSION = void 0;
    var package_json_1 = __importDefault2(require_package());
    exports2.VERSION = package_json_1.default.version;
    exports2.REPO_URL = "https://github.com/ybd-project/ytdl-core";
    exports2.ISSUES_URL = "https://github.com/ybd-project/ytdl-core/issues";
  }
});

// package/utils/Log.js
var require_Log = __commonJS({
  "package/utils/Log.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Logger = void 0;
    var Constants_12 = require_Constants();
    var OUTPUT_CONTROL_CHARACTER = {
      red: "\x1B[31m",
      green: "\x1B[32m",
      yellow: "\x1B[33m",
      blue: "\x1B[34m",
      magenta: "\x1B[35m",
      reset: "\x1B[0m"
    };
    var _Logger = class _Logger {
      static replaceColorTags(message) {
        try {
          message = message.replace(/<magenta>/g, OUTPUT_CONTROL_CHARACTER.magenta);
          message = message.replace(/<\/magenta>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<debug>/g, OUTPUT_CONTROL_CHARACTER.magenta);
          message = message.replace(/<\/debug>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<blue>/g, OUTPUT_CONTROL_CHARACTER.blue);
          message = message.replace(/<\/blue>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<info>/g, OUTPUT_CONTROL_CHARACTER.blue);
          message = message.replace(/<\/info>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<green>/g, OUTPUT_CONTROL_CHARACTER.green);
          message = message.replace(/<\/green>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<success>/g, OUTPUT_CONTROL_CHARACTER.green);
          message = message.replace(/<\/success>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<yellow>/g, OUTPUT_CONTROL_CHARACTER.yellow);
          message = message.replace(/<\/yellow>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<warning>/g, OUTPUT_CONTROL_CHARACTER.yellow);
          message = message.replace(/<\/warning>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<red>/g, OUTPUT_CONTROL_CHARACTER.red);
          message = message.replace(/<\/red>/g, OUTPUT_CONTROL_CHARACTER.reset);
          message = message.replace(/<error>/g, OUTPUT_CONTROL_CHARACTER.red);
          message = message.replace(/<\/error>/g, OUTPUT_CONTROL_CHARACTER.reset);
        } catch {
        }
        return message;
      }
      static convertMessage(message) {
        return this.replaceColorTags(message);
      }
      static convertMessages(messages) {
        return messages.map((m) => this.replaceColorTags(m));
      }
      static debug(...messages) {
        if (Constants_12.VERSION.includes("dev") || Constants_12.VERSION.includes("beta") || Constants_12.VERSION.includes("test") || this.logDisplay.includes("debug")) {
          console.log(this.convertMessage("<debug>[  DEBUG  ]:</debug>"), ...this.convertMessages(messages));
        }
      }
      static info(...messages) {
        if (this.logDisplay.includes("info")) {
          console.info(this.convertMessage("<info>[  INFO!  ]:</info>"), ...this.convertMessages(messages));
        }
      }
      static success(...messages) {
        if (this.logDisplay.includes("success")) {
          console.log(this.convertMessage("<success>[ SUCCESS ]:</success>"), ...this.convertMessages(messages));
        }
      }
      static warning(...messages) {
        if (this.logDisplay.includes("warning")) {
          console.warn(this.convertMessage("<warning>[ WARNING ]:</warning>"), ...this.convertMessages(messages));
        }
      }
      static error(...messages) {
        if (this.logDisplay.includes("error")) {
          console.error(this.convertMessage("<error>[  ERROR  ]:</error>"), ...this.convertMessages(messages));
        }
      }
    };
    __name(_Logger, "Logger");
    var Logger = _Logger;
    exports2.Logger = Logger;
    Logger.logDisplay = ["info", "success", "warning", "error"];
  }
});

// package/core/Download/Download.js
var require_Download = __commonJS({
  "package/core/Download/Download.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.download = download;
    exports2.downloadFromInfo = downloadFromInfo;
    function downloadFromInfo(info, options) {
    }
    __name(downloadFromInfo, "downloadFromInfo");
    function download(link, options) {
    }
    __name(download, "download");
  }
});

// package/core/Download/index.js
var require_Download2 = __commonJS({
  "package/core/Download/index.js"(exports2) {
    "use strict";
    var __createBinding2 = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar2 = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding2(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar2(require_Download(), exports2);
  }
});

// package/core/Info/BasicInfo.js
var require_BasicInfo = __commonJS({
  "package/core/Info/BasicInfo.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2._getBasicInfo = _getBasicInfo;
    exports2.getBasicInfo = getBasicInfo;
    function _getBasicInfo() {
    }
    __name(_getBasicInfo, "_getBasicInfo");
    function getBasicInfo(link, options) {
    }
    __name(getBasicInfo, "getBasicInfo");
  }
});

// package/core/Info/FullInfo.js
var require_FullInfo = __commonJS({
  "package/core/Info/FullInfo.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getFullInfo = getFullInfo;
    function getFullInfo(link, options) {
    }
    __name(getFullInfo, "getFullInfo");
  }
});

// package/core/Info/index.js
var require_Info = __commonJS({
  "package/core/Info/index.js"(exports2) {
    "use strict";
    var __createBinding2 = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar2 = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding2(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar2(require_BasicInfo(), exports2);
    __exportStar2(require_FullInfo(), exports2);
  }
});

// package/core/Signature.js
var require_Signature = __commonJS({
  "package/core/Signature.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Signature = void 0;
    var SIGNATURE_TIMESTAMP_REGEX = /signatureTimestamp:(\d+)/g;
    var _Signature = class _Signature {
      static getSignatureTimestamp(body) {
        const MATCH = body.match(SIGNATURE_TIMESTAMP_REGEX);
        if (MATCH) {
          return MATCH[0].split(":")[1];
        }
        return "0";
      }
    };
    __name(_Signature, "Signature");
    var Signature = _Signature;
    exports2.Signature = Signature;
  }
});

// package/utils/Url.js
var require_Url = __commonJS({
  "package/utils/Url.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Url = void 0;
    var BASE_URL = "https://www.youtube.com";
    var URL_REGEX = /^https?:\/\//;
    var ID_REGEX = /^[a-zA-Z0-9-_]{11}$/;
    var VALID_QUERY_DOMAINS = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "gaming.youtube.com"]);
    var VALID_PATH_DOMAINS = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts|live)\/)/;
    var _Url = class _Url {
      static getBaseUrl() {
        return BASE_URL;
      }
      static getPlayerJsUrl(playerId) {
        return `${BASE_URL}/s/player/${playerId}/player_ias.vflset/en_US/base.js`;
      }
      static getWatchPageUrl(id) {
        return `${BASE_URL}/watch?v=${id}`;
      }
      static getEmbedUrl(id) {
        return `${BASE_URL}/embed/${id}`;
      }
      static getIframeApiUrl() {
        return `${BASE_URL}/iframe_api`;
      }
      static getInnertubeBaseUrl() {
        return `${BASE_URL}/youtubei/v1`;
      }
      static getTvUrl() {
        return `${BASE_URL}/tv`;
      }
      static getRefreshTokenApiUrl() {
        return `${BASE_URL}/o/oauth2/token`;
      }
      static validateID(id) {
        return ID_REGEX.test(id.trim());
      }
      static getURLVideoID(link) {
        const PARSED = new URL(link.trim());
        let id = PARSED.searchParams.get("v");
        if (VALID_PATH_DOMAINS.test(link.trim()) && !id) {
          const PATHS = PARSED.pathname.split("/");
          id = PARSED.host === "youtu.be" ? PATHS[1] : PATHS[2];
        } else if (PARSED.hostname && !VALID_QUERY_DOMAINS.has(PARSED.hostname)) {
          throw new Error("Not a YouTube domain");
        }
        if (!id) {
          throw new Error(`No video id found: "${link}"`);
        }
        id = id.substring(0, 11);
        if (!this.validateID(id)) {
          throw new TypeError(`Video id (${id}) does not match expected format (${ID_REGEX.toString()})`);
        }
        return id;
      }
      static getVideoID(str) {
        if (this.validateID(str)) {
          return str;
        } else if (URL_REGEX.test(str.trim())) {
          return this.getURLVideoID(str);
        } else {
          throw new Error(`No video id found: ${str}`);
        }
      }
      static validateURL(str) {
        try {
          this.getURLVideoID(str);
          return true;
        } catch (e) {
          return false;
        }
      }
    };
    __name(_Url, "Url");
    var Url = _Url;
    exports2.Url = Url;
  }
});

// package/core/errors/RequestError.js
var require_RequestError = __commonJS({
  "package/core/errors/RequestError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var _RequestError = class _RequestError extends Error {
      constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 0;
      }
    };
    __name(_RequestError, "RequestError");
    var RequestError = _RequestError;
    exports2.default = RequestError;
  }
});

// package/core/errors/PlayerRequestError.js
var require_PlayerRequestError = __commonJS({
  "package/core/errors/PlayerRequestError.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var RequestError_1 = __importDefault2(require_RequestError());
    var _PlayerRequestError = class _PlayerRequestError extends RequestError_1.default {
      constructor(message, response, statusCode) {
        super(message);
        this.response = response;
        this.statusCode = statusCode || 0;
      }
    };
    __name(_PlayerRequestError, "PlayerRequestError");
    var PlayerRequestError = _PlayerRequestError;
    exports2.default = PlayerRequestError;
  }
});

// package/core/errors/UnrecoverableError.js
var require_UnrecoverableError = __commonJS({
  "package/core/errors/UnrecoverableError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var _UnrecoverableError = class _UnrecoverableError extends Error {
    };
    __name(_UnrecoverableError, "UnrecoverableError");
    var UnrecoverableError = _UnrecoverableError;
    exports2.default = UnrecoverableError;
  }
});

// package/core/errors/index.js
var require_errors = __commonJS({
  "package/core/errors/index.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RequestError = exports2.UnrecoverableError = exports2.PlayerRequestError = void 0;
    var PlayerRequestError_1 = require_PlayerRequestError();
    Object.defineProperty(exports2, "PlayerRequestError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(PlayerRequestError_1).default;
    }, "get") });
    var UnrecoverableError_1 = require_UnrecoverableError();
    Object.defineProperty(exports2, "UnrecoverableError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(UnrecoverableError_1).default;
    }, "get") });
    var RequestError_1 = require_RequestError();
    Object.defineProperty(exports2, "RequestError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(RequestError_1).default;
    }, "get") });
  }
});

// package/core/Fetcher.js
var require_Fetcher = __commonJS({
  "package/core/Fetcher.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Fetcher = void 0;
    var undici_1 = require("undici");
    var errors_1 = require_errors();
    var Log_12 = require_Log();
    var path_12 = __importDefault2(require("path"));
    function getCaller() {
      const ERROR_STACK = new Error().stack || "", STACK_LINES = ERROR_STACK.split("\n"), CALLER_INDEX = STACK_LINES.findIndex((line) => line.includes("getCaller")) + 2;
      if (STACK_LINES[CALLER_INDEX]) {
        const FILE_PATH = STACK_LINES[CALLER_INDEX].trim().split(" ")[1];
        if (!FILE_PATH.includes("C:\\")) {
          return FILE_PATH;
        }
        const PARSED = path_12.default.parse(FILE_PATH);
        return PARSED.name + PARSED.ext;
      }
      return "Unknown";
    }
    __name(getCaller, "getCaller");
    var _Fetcher = class _Fetcher {
      static async request(url, { requestOptions, rewriteRequest, originalProxy } = {}) {
        if (typeof rewriteRequest === "function") {
          const WROTE_REQUEST = rewriteRequest(url, requestOptions, { isDownloadUrl: false });
          requestOptions = WROTE_REQUEST.options;
          url = WROTE_REQUEST.url;
        }
        if (originalProxy) {
          try {
            const PARSED = new URL(originalProxy.base);
            if (!url.includes(PARSED.host)) {
              url = `${PARSED.protocol}//${PARSED.host}/?url=${encodeURIComponent(url)}`;
            }
          } catch {
          }
        }
        Log_12.Logger.debug(`[ Request ]: <magenta>${(requestOptions == null ? void 0 : requestOptions.method) || "GET"}</magenta> -> ${url} (From ${getCaller()})`);
        const REQUEST_RESULTS = await (0, undici_1.request)(url, requestOptions), STATUS_CODE = REQUEST_RESULTS.statusCode.toString(), LOCATION = REQUEST_RESULTS.headers["location"] || null;
        if (STATUS_CODE.startsWith("2")) {
          const CONTENT_TYPE = REQUEST_RESULTS.headers["content-type"] || "";
          if (CONTENT_TYPE.includes("application/json")) {
            return REQUEST_RESULTS.body.json();
          }
          return REQUEST_RESULTS.body.text();
        } else if (STATUS_CODE.startsWith("3") && LOCATION) {
          return this.request(LOCATION.toString(), { requestOptions, rewriteRequest, originalProxy });
        }
        const ERROR = new errors_1.RequestError(`Status Code: ${STATUS_CODE}`);
        ERROR.statusCode = REQUEST_RESULTS.statusCode;
        throw ERROR;
      }
    };
    __name(_Fetcher, "Fetcher");
    var Fetcher = _Fetcher;
    exports2.Fetcher = Fetcher;
  }
});

// package/core/Info/parser/Html5Player.js
var require_Html5Player = __commonJS({
  "package/core/Info/parser/Html5Player.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getHtml5Player = getHtml5Player;
    var Platform_12 = require_Platform();
    var Signature_1 = require_Signature();
    var Url_1 = require_Url();
    var Log_12 = require_Log();
    var Fetcher_1 = require_Fetcher();
    var FileCache2 = Platform_12.Platform.getShim().fileCache;
    function getPlayerId(body) {
      const MATCH = body.match(/player\/([a-zA-Z0-9]+)\//);
      if (MATCH) {
        return MATCH[1];
      }
      return null;
    }
    __name(getPlayerId, "getPlayerId");
    async function getHtml5Player(options) {
      const CACHE = await FileCache2.get("html5Player");
      if (CACHE) {
        return {
          playerUrl: CACHE.playerUrl,
          signatureTimestamp: CACHE.signatureTimestamp
        };
      }
      const PLAYER_BODY = await Fetcher_1.Fetcher.request(Url_1.Url.getIframeApiUrl(), options), PLAYER_ID = getPlayerId(PLAYER_BODY);
      let playerUrl = PLAYER_ID ? Url_1.Url.getPlayerJsUrl(PLAYER_ID) : null;
      if (!playerUrl && options.originalProxy) {
        Log_12.Logger.debug("Could not get html5Player using your own proxy. It is retrieved again with its own proxy disabled. (Other requests will not invalidate it.)");
        const BODY = await Fetcher_1.Fetcher.request(Url_1.Url.getIframeApiUrl(), {
          ...options,
          rewriteRequest: void 0,
          originalProxy: void 0
        }), PLAYER_ID2 = getPlayerId(BODY);
        playerUrl = PLAYER_ID2 ? Url_1.Url.getPlayerJsUrl(PLAYER_ID2) : null;
      }
      const HTML5_PLAYER_BODY = playerUrl ? await Fetcher_1.Fetcher.request(playerUrl, options) : "", DATA = {
        playerUrl,
        signatureTimestamp: playerUrl ? Signature_1.Signature.getSignatureTimestamp(HTML5_PLAYER_BODY) || "" : "",
        playerBody: HTML5_PLAYER_BODY || null
      };
      FileCache2.set("html5Player", JSON.stringify(DATA));
      return DATA;
    }
    __name(getHtml5Player, "getHtml5Player");
  }
});

// package/core/Agent.js
var require_Agent = __commonJS({
  "package/core/Agent.js"(exports2) {
    "use strict";
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Agent = void 0;
    var undici_1 = require("undici");
    var tough_cookie_1 = require("tough-cookie");
    var undici_2 = require("http-cookie-agent/undici");
    function convertSameSite(sameSite) {
      switch (sameSite) {
        case "strict":
          return "strict";
        case "lax":
          return "lax";
        case "no_restriction":
        case "unspecified":
        default:
          return "none";
      }
    }
    __name(convertSameSite, "convertSameSite");
    function convertCookie(cookie) {
      if (cookie instanceof tough_cookie_1.Cookie) {
        return cookie;
      } else {
        const EXPIRES = typeof cookie.expirationDate === "number" ? new Date(cookie.expirationDate * 1e3) : "Infinity";
        return new tough_cookie_1.Cookie({
          key: cookie.name,
          value: cookie.value,
          expires: EXPIRES,
          domain: (0, tough_cookie_1.canonicalDomain)(cookie.domain || ""),
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: convertSameSite(cookie.sameSite || ""),
          hostOnly: cookie.hostOnly
        });
      }
    }
    __name(convertCookie, "convertCookie");
    var _Agent = class _Agent {
      static addCookies(jar, cookies) {
        if (!cookies || !Array.isArray(cookies)) {
          throw new Error("cookies must be an array");
        }
        const CONTAINS_SOCS = cookies.some((cookie) => {
          if (cookie instanceof tough_cookie_1.Cookie) {
            return false;
          }
          return cookie.name === "SOCS";
        });
        if (!CONTAINS_SOCS) {
          cookies.push({
            domain: ".youtube.com",
            hostOnly: false,
            httpOnly: false,
            name: "SOCS",
            path: "/",
            sameSite: "lax",
            secure: true,
            session: false,
            value: "CAI"
          });
        }
        for (const COOKIE of cookies) {
          jar.setCookieSync(convertCookie(COOKIE), "https://www.youtube.com");
        }
      }
      static addCookiesFromString(jar, cookies) {
        if (!cookies || typeof cookies !== "string") {
          throw new Error("cookies must be a string");
        }
        const COOKIES = cookies.split(";").map((cookie) => tough_cookie_1.Cookie.parse(cookie)).filter((c) => c !== void 0);
        return this.addCookies(jar, COOKIES);
      }
      static createAgent(cookies = [], opts = {}) {
        const OPTIONS = Object.assign({}, opts);
        if (!OPTIONS.cookies) {
          const JAR = new tough_cookie_1.CookieJar();
          this.addCookies(JAR, cookies);
          OPTIONS.cookies = { jar: JAR };
        }
        return {
          dispatcher: new undici_2.CookieAgent(OPTIONS),
          localAddress: OPTIONS.localAddress,
          jar: OPTIONS.cookies.jar
        };
      }
      static createProxyAgent(options, cookies = []) {
        if (typeof options === "string") {
          options = {
            uri: options
          };
        }
        if (options.factory) {
          throw new Error("Cannot use factory with createProxyAgent");
        }
        const JAR = new tough_cookie_1.CookieJar();
        this.addCookies(JAR, cookies);
        const ASSIGN_TARGET = {
          factory: /* @__PURE__ */ __name((origin, opts) => {
            const CLIENT_OPTIONS = Object.assign({ cookies: { jar: JAR } }, opts);
            return new undici_2.CookieClient(origin, CLIENT_OPTIONS);
          }, "factory")
        }, PROXY_OPTIONS = Object.assign(ASSIGN_TARGET, options);
        return {
          dispatcher: new undici_1.ProxyAgent(PROXY_OPTIONS),
          localAddress: options.localAddress,
          jar: JAR
        };
      }
    };
    __name(_Agent, "Agent");
    var Agent = _Agent;
    exports2.Agent = Agent;
    _a = Agent;
    Agent.defaultAgent = _a.createAgent();
  }
});

// package/utils/UserAgents.js
var require_UserAgents = __commonJS({
  "package/utils/UserAgents.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UserAgent = void 0;
    var USER_AGENTS = {
      desktop: [
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61"
      ],
      ios: [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/127.0.0.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.1.45 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.2.98 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.3.110 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.5.72 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 14_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.4.82 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.1.101 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.1.95 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/121.0.2.67 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.0.85 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.3.92 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.5.105 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/127.0.2.56 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.1.30 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.4.102 Mobile/15E148 Safari/604.1"
      ],
      android: [
        "Mozilla/5.0 (Linux; Android 12; SM-G996B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; Pixel 4a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.85 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.1.102 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; Mi 9T Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.3.56 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; Samsung SM-G980F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.1.74 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 12; OnePlus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.4.90 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; Huawei P30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.2.98 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 8.1.0; Nexus 6P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.1.84 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; Pixel 4 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.3.40 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; Redmi Note 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.5.25 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.2.56 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; Sony Xperia 1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.74 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; Galaxy Note 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.5.86 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; LG G8 ThinQ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.2.98 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; OnePlus 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.3.40 Mobile Safari/537.36"
      ],
      tv: ["Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version"]
    };
    var _UserAgent = class _UserAgent {
      static getRandomUserAgent(type) {
        const AGENTS = USER_AGENTS[type];
        if (AGENTS) {
          return AGENTS[Math.floor(Math.random() * AGENTS.length)];
        }
        return USER_AGENTS.desktop[0];
      }
    };
    __name(_UserAgent, "UserAgent");
    var UserAgent = _UserAgent;
    exports2.UserAgent = UserAgent;
    UserAgent.default = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
    UserAgent.ios = "com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)";
    UserAgent.android = "com.google.android.youtube/19.29.37 (Linux; U; Android 11) gzip";
    UserAgent.tv = "Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version";
  }
});

// package/utils/Utils.js
var require_Utils = __commonJS({
  "package/utils/Utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.lastUpdateCheck = void 0;
    exports2.between = between;
    exports2.tryParseBetween = tryParseBetween;
    exports2.parseAbbreviatedNumber = parseAbbreviatedNumber;
    exports2.cutAfterJS = cutAfterJS;
    exports2.deprecate = deprecate;
    exports2.checkForUpdates = checkForUpdates;
    exports2.getPropInsensitive = getPropInsensitive;
    exports2.setPropInsensitive = setPropInsensitive;
    exports2.generateClientPlaybackNonce = generateClientPlaybackNonce;
    var Fetcher_1 = require_Fetcher();
    var Constants_12 = require_Constants();
    var Log_12 = require_Log();
    var ESCAPING_SEQUENCE = [
      { start: '"', end: '"' },
      { start: "'", end: "'" },
      { start: "`", end: "`" },
      { start: "/", end: "/", startPrefix: /(^|[[{:;,/])\s?$/ }
    ];
    var UPDATE_INTERVAL = 1e3 * 60 * 60 * 12;
    function findPropKeyInsensitive(obj, prop) {
      return Object.keys(obj).find((p) => p.toLowerCase() === prop.toLowerCase()) || null;
    }
    __name(findPropKeyInsensitive, "findPropKeyInsensitive");
    function between(haystack, left, right) {
      let pos = null;
      if (left instanceof RegExp) {
        const MATCH = haystack.match(left);
        if (!MATCH) {
          return "";
        }
        pos = (MATCH.index || 0) + MATCH[0].length;
      } else {
        pos = haystack.indexOf(left);
        if (pos === -1) {
          return "";
        }
        pos += left.length;
      }
      haystack = haystack.slice(pos);
      pos = haystack.indexOf(right);
      if (pos === -1) {
        return "";
      }
      haystack = haystack.slice(0, pos);
      return haystack;
    }
    __name(between, "between");
    function tryParseBetween(body, left, right, prepend = "", append = "") {
      try {
        const BETWEEN_STRING = between(body, left, right);
        if (!BETWEEN_STRING) {
          return null;
        }
        return JSON.parse(`${prepend}${BETWEEN_STRING}${append}`);
      } catch (err) {
        return null;
      }
    }
    __name(tryParseBetween, "tryParseBetween");
    function parseAbbreviatedNumber(string) {
      const MATCH = string.replace(",", ".").replace(" ", "").match(/([\d,.]+)([MK]?)/);
      if (MATCH) {
        const UNIT = MATCH[2];
        let number = MATCH[1];
        number = parseFloat(number);
        return Math.round(UNIT === "M" ? number * 1e6 : UNIT === "K" ? number * 1e3 : number);
      }
      return null;
    }
    __name(parseAbbreviatedNumber, "parseAbbreviatedNumber");
    function cutAfterJS(mixedJson) {
      let open = null, close = null;
      if (mixedJson[0] === "[") {
        open = "[";
        close = "]";
      } else if (mixedJson[0] === "{") {
        open = "{";
        close = "}";
      }
      if (!open) {
        throw new Error(`Can't cut unsupported JSON (need to begin with [ or { ) but got: ${mixedJson[0]}`);
      }
      let isEscapedObject = null;
      let isEscaped = false;
      let counter = 0;
      for (let i = 0; i < mixedJson.length; i++) {
        if (isEscapedObject !== null && !isEscaped && mixedJson[i] === isEscapedObject.end) {
          isEscapedObject = null;
          continue;
        } else if (!isEscaped && isEscapedObject === null) {
          for (const ESCAPED of ESCAPING_SEQUENCE) {
            if (mixedJson[i] !== ESCAPED.start) {
              continue;
            }
            if (!ESCAPED.startPrefix || mixedJson.substring(i - 10, i).match(ESCAPED.startPrefix)) {
              isEscapedObject = ESCAPED;
              break;
            }
          }
          if (isEscapedObject !== null) {
            continue;
          }
        }
        isEscaped = mixedJson[i] === "\\" && !isEscaped;
        if (isEscapedObject !== null) {
          continue;
        }
        if (mixedJson[i] === open) {
          counter++;
        } else if (mixedJson[i] === close) {
          counter--;
        }
        if (counter === 0) {
          return mixedJson.slice(0, i + 1);
        }
      }
      throw new Error(`Can't cut unsupported JSON (no matching closing bracket found)`);
    }
    __name(cutAfterJS, "cutAfterJS");
    function deprecate(obj, prop, value, oldPath, newPath) {
      Object.defineProperty(obj, prop, {
        get: /* @__PURE__ */ __name(() => {
          Log_12.Logger.warning(`\`${oldPath}\` will be removed in a near future release, use \`${newPath}\` instead.`);
          return value;
        }, "get")
      });
    }
    __name(deprecate, "deprecate");
    function getPropInsensitive(obj, prop) {
      const KEY = findPropKeyInsensitive(obj, prop);
      return KEY && obj[KEY];
    }
    __name(getPropInsensitive, "getPropInsensitive");
    function setPropInsensitive(obj, prop, value) {
      const KEY = findPropKeyInsensitive(obj, prop);
      obj[KEY || prop] = value;
      return KEY;
    }
    __name(setPropInsensitive, "setPropInsensitive");
    function generateClientPlaybackNonce(length) {
      const CPN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      return Array.from({ length }, () => CPN_CHARS[Math.floor(Math.random() * CPN_CHARS.length)]).join("");
    }
    __name(generateClientPlaybackNonce, "generateClientPlaybackNonce");
    var updateWarnTimes = 0;
    var lastUpdateCheck = 0;
    exports2.lastUpdateCheck = lastUpdateCheck;
    function checkForUpdates() {
      const YTDL_NO_UPDATE = process.env.YTDL_NO_UPDATE;
      if (!YTDL_NO_UPDATE && Date.now() - lastUpdateCheck >= UPDATE_INTERVAL) {
        exports2.lastUpdateCheck = lastUpdateCheck = Date.now();
        const GITHUB_URL = "https://api.github.com/repos/ybd-project/ytdl-core/contents/package.json";
        return Fetcher_1.Fetcher.request(GITHUB_URL, {
          requestOptions: { headers: { "User-Agent": 'Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99' } }
        }).then((response) => {
          const BUFFER = Buffer.from(response.content, response.encoding), PKG_FILE = JSON.parse(BUFFER.toString("ascii"));
          if (PKG_FILE.version !== Constants_12.VERSION && updateWarnTimes++ < 5) {
            Log_12.Logger.warning('@ybd-project/ytdl-core is out of date! Update with "npm install @ybd-project/ytdl-core@latest".');
          }
        }, (err) => {
          Log_12.Logger.warning("Error checking for updates:", err.message);
          Log_12.Logger.warning("You can disable this check by setting the `YTDL_NO_UPDATE` env variable.");
        });
      }
      return null;
    }
    __name(checkForUpdates, "checkForUpdates");
    exports2.default = { between, tryParseBetween, parseAbbreviatedNumber, cutAfterJS, deprecate, lastUpdateCheck, checkForUpdates, getPropInsensitive, setPropInsensitive, generateClientPlaybackNonce };
  }
});

// package/utils/Clients.js
var require_Clients = __commonJS({
  "package/utils/Clients.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Clients = void 0;
    var Utils_1 = __importDefault2(require_Utils());
    var UserAgents_1 = require_UserAgents();
    var INNERTUBE_BASE_API_URL = "https://www.youtube.com/youtubei/v1";
    var INNERTUBE_CLIENTS = Object.freeze({
      web: {
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240726.00.00",
            userAgent: UserAgents_1.UserAgent.default
          }
        },
        clientName: 1,
        apiInfo: {
          key: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
        }
      },
      webCreator: {
        context: {
          client: {
            clientName: "WEB_CREATOR",
            clientVersion: "1.20240723.03.00",
            userAgent: UserAgents_1.UserAgent.default
          }
        },
        clientName: 62,
        apiInfo: {
          key: "AIzaSyBUPetSUmoZL-OhlxA7wSac5XinrygCqMo"
        }
      },
      webEmbedded: {
        context: {
          client: {
            clientName: "WEB_EMBEDDED_PLAYER",
            clientVersion: "2.20240111.09.00",
            userAgent: UserAgents_1.UserAgent.default,
            clientScreen: "EMBED"
          }
        },
        clientName: 56,
        apiInfo: {
          key: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
        }
      },
      android: {
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: "19.29.37",
            androidSdkVersion: 30,
            userAgent: UserAgents_1.UserAgent.android,
            osName: "Android",
            osVersion: "11"
          }
        },
        clientName: 3,
        apiInfo: {
          key: "AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w"
        }
      },
      ios: {
        context: {
          client: {
            clientName: "IOS",
            clientVersion: "19.29.1",
            deviceMake: "Apple",
            deviceModel: "iPhone16,2",
            userAgent: UserAgents_1.UserAgent.ios,
            osName: "iPhone",
            osVersion: "17.5.1.21F90"
          }
        },
        clientName: 5,
        apiInfo: {
          key: "AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc"
        }
      },
      mweb: {
        context: {
          client: {
            clientName: "MWEB",
            clientVersion: "2.20240726.01.00",
            userAgent: UserAgents_1.UserAgent.default
          }
        },
        clientName: 2,
        apiInfo: {}
      },
      tv: {
        context: {
          client: {
            clientName: "TVHTML5",
            clientVersion: "7.20240724.13.00",
            userAgent: UserAgents_1.UserAgent.tv
          }
        },
        clientName: 7,
        apiInfo: {}
      },
      tvEmbedded: {
        context: {
          client: {
            clientName: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
            clientVersion: "2.0",
            userAgent: UserAgents_1.UserAgent.tv
          },
          thirdParty: {
            embedUrl: "https://www.youtube.com/"
          }
        },
        clientName: 85,
        apiInfo: {}
      }
    });
    var INNERTUBE_BASE_PAYLOAD = {
      videoId: "",
      cpn: Utils_1.default.generateClientPlaybackNonce(16),
      contentCheckOk: true,
      racyCheckOk: true,
      serviceIntegrityDimensions: {},
      playbackContext: {
        contentPlaybackContext: {
          vis: 0,
          splay: false,
          referer: "",
          currentUrl: "",
          autonavState: "STATE_ON",
          autoCaptionsDefaultOn: false,
          html5Preference: "HTML5_PREF_WANTS",
          lactMilliseconds: "-1",
          signatureTimestamp: 0
        }
      },
      attestationRequest: {
        omitBotguardData: true
      },
      context: {
        client: {},
        request: {
          useSsl: true,
          internalExperimentFlags: [],
          consistencyTokenJars: []
        },
        user: {
          lockedSafetyMode: false
        }
      }
    };
    var _Clients = class _Clients {
      static getAuthorizationHeader(oauth2) {
        return oauth2 && oauth2.isEnabled ? { authorization: "Bearer " + oauth2.getAccessToken() } : {};
      }
      static web({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ..._Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static web_nextApi({ videoId, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD, autonavState: "STATE_OFF", playbackContext: { vis: 0, lactMilliseconds: "-1" }, captionsRequested: false };
        PAYLOAD.videoId = videoId;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL + "/next"}?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ..._Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static webCreator({ videoId, signatureTimestamp, options: { poToken, visitorData, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.webCreator, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent
          }
        };
      }
      static webEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.webEmbedded, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent
          }
        };
      }
      static android({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.android, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false&id=${videoId}&t=${Utils_1.default.generateClientPlaybackNonce(12)}`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ..._Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static ios({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.ios, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false&id=${videoId}&t=${Utils_1.default.generateClientPlaybackNonce(12)}`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ..._Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static mweb({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.mweb, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ..._Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static tv({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ..._Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static tvEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.tvEmbedded, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ..._Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
    };
    __name(_Clients, "Clients");
    var Clients = _Clients;
    exports2.Clients = Clients;
  }
});

// package/core/clients/Base.js
var require_Base = __commonJS({
  "package/core/clients/Base.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var errors_1 = require_errors();
    var Fetcher_1 = require_Fetcher();
    var _Base = class _Base {
      static playError(playerResponse) {
        const PLAYABILITY = playerResponse && playerResponse.playabilityStatus;
        if (!PLAYABILITY) {
          return null;
        }
        if (PLAYABILITY.status === "ERROR" || PLAYABILITY.status === "LOGIN_REQUIRED") {
          return new errors_1.UnrecoverableError(PLAYABILITY.reason || PLAYABILITY.messages && PLAYABILITY.messages[0]);
        } else if (PLAYABILITY.status === "LIVE_STREAM_OFFLINE") {
          return new errors_1.UnrecoverableError(PLAYABILITY.reason || "The live stream is offline.");
        } else if (PLAYABILITY.status === "UNPLAYABLE") {
          return new errors_1.UnrecoverableError(PLAYABILITY.reason || "This video is unavailable.");
        }
        return null;
      }
      static request(url, requestOptions, params) {
        return new Promise(async (resolve, reject) => {
          const { jar, dispatcher } = params.options.agent || {}, HEADERS = {
            "Content-Type": "application/json",
            cookie: jar == null ? void 0 : jar.getCookieStringSync("https://www.youtube.com"),
            "X-Goog-Visitor-Id": params.options.visitorData,
            ...requestOptions.headers
          }, OPTS = {
            requestOptions: {
              method: "POST",
              dispatcher,
              headers: HEADERS,
              body: typeof requestOptions.payload === "string" ? requestOptions.payload : JSON.stringify(requestOptions.payload)
            },
            rewriteRequest: params.options.rewriteRequest,
            originalProxy: params.options.originalProxy
          }, IS_NEXT_API = url.includes("/next"), responseHandler = /* @__PURE__ */ __name((response) => {
            const PLAY_ERROR = this.playError(response);
            if (PLAY_ERROR) {
              if (OPTS.originalProxy) {
                OPTS.originalProxy = void 0;
                Fetcher_1.Fetcher.request(url, OPTS).then(responseHandler).catch((err) => {
                  reject({
                    isError: true,
                    error: err,
                    contents: null
                  });
                });
                return;
              }
              return reject({
                isError: true,
                error: PLAY_ERROR,
                contents: response
              });
            }
            if (!IS_NEXT_API && (!response.videoDetails || params.videoId !== response.videoDetails.videoId)) {
              const ERROR = new errors_1.PlayerRequestError("Malformed response from YouTube", response, null);
              ERROR.response = response;
              return reject({
                isError: true,
                error: ERROR,
                contents: response
              });
            }
            resolve({
              isError: false,
              error: null,
              contents: response
            });
          }, "responseHandler");
          try {
            Fetcher_1.Fetcher.request(url, OPTS).then(responseHandler).catch((err) => {
              if (OPTS.originalProxy) {
                OPTS.originalProxy = void 0;
                Fetcher_1.Fetcher.request(url, OPTS).then(responseHandler).catch((err2) => {
                  reject({
                    isError: true,
                    error: err2,
                    contents: null
                  });
                });
              }
              reject({
                isError: true,
                error: err,
                contents: null
              });
            });
          } catch (err) {
            reject({
              isError: true,
              error: err,
              contents: null
            });
          }
        });
      }
    };
    __name(_Base, "Base");
    var Base = _Base;
    exports2.default = Base;
  }
});

// package/core/clients/Web.js
var require_Web = __commonJS({
  "package/core/clients/Web.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _Web = class _Web {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.web(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
      static async getNextResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.web_nextApi(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_Web, "Web");
    var Web = _Web;
    exports2.default = Web;
  }
});

// package/core/clients/WebCreator.js
var require_WebCreator = __commonJS({
  "package/core/clients/WebCreator.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _WebCreator = class _WebCreator {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.webCreator(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_WebCreator, "WebCreator");
    var WebCreator = _WebCreator;
    exports2.default = WebCreator;
  }
});

// package/core/clients/WebEmbedded.js
var require_WebEmbedded = __commonJS({
  "package/core/clients/WebEmbedded.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _WebEmbedded = class _WebEmbedded {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.webEmbedded(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_WebEmbedded, "WebEmbedded");
    var WebEmbedded = _WebEmbedded;
    exports2.default = WebEmbedded;
  }
});

// package/core/clients/MWeb.js
var require_MWeb = __commonJS({
  "package/core/clients/MWeb.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _MWeb = class _MWeb {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.mweb(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_MWeb, "MWeb");
    var MWeb = _MWeb;
    exports2.default = MWeb;
  }
});

// package/core/clients/Android.js
var require_Android = __commonJS({
  "package/core/clients/Android.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _Android = class _Android {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.android(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_Android, "Android");
    var Android = _Android;
    exports2.default = Android;
  }
});

// package/core/clients/Ios.js
var require_Ios = __commonJS({
  "package/core/clients/Ios.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _Ios = class _Ios {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.ios(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_Ios, "Ios");
    var Ios = _Ios;
    exports2.default = Ios;
  }
});

// package/core/clients/Tv.js
var require_Tv = __commonJS({
  "package/core/clients/Tv.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _Tv = class _Tv {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.tv(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_Tv, "Tv");
    var Tv = _Tv;
    exports2.default = Tv;
  }
});

// package/core/clients/TvEmbedded.js
var require_TvEmbedded = __commonJS({
  "package/core/clients/TvEmbedded.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault2(require_Base());
    var _TvEmbedded = class _TvEmbedded {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.tvEmbedded(params);
        return await Base_1.default.request(url, { payload, headers }, params);
      }
    };
    __name(_TvEmbedded, "TvEmbedded");
    var TvEmbedded = _TvEmbedded;
    exports2.default = TvEmbedded;
  }
});

// package/core/clients/index.js
var require_clients = __commonJS({
  "package/core/clients/index.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TvEmbedded = exports2.Tv = exports2.Ios = exports2.Android = exports2.MWeb = exports2.WebEmbedded = exports2.WebCreator = exports2.Web = void 0;
    var Web_1 = require_Web();
    Object.defineProperty(exports2, "Web", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(Web_1).default;
    }, "get") });
    var WebCreator_1 = require_WebCreator();
    Object.defineProperty(exports2, "WebCreator", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(WebCreator_1).default;
    }, "get") });
    var WebEmbedded_1 = require_WebEmbedded();
    Object.defineProperty(exports2, "WebEmbedded", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(WebEmbedded_1).default;
    }, "get") });
    var MWeb_1 = require_MWeb();
    Object.defineProperty(exports2, "MWeb", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(MWeb_1).default;
    }, "get") });
    var Android_1 = require_Android();
    Object.defineProperty(exports2, "Android", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(Android_1).default;
    }, "get") });
    var Ios_1 = require_Ios();
    Object.defineProperty(exports2, "Ios", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(Ios_1).default;
    }, "get") });
    var Tv_1 = require_Tv();
    Object.defineProperty(exports2, "Tv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(Tv_1).default;
    }, "get") });
    var TvEmbedded_1 = require_TvEmbedded();
    Object.defineProperty(exports2, "TvEmbedded", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return __importDefault2(TvEmbedded_1).default;
    }, "get") });
  }
});

// package/core/OAuth2.js
var require_OAuth2 = __commonJS({
  "package/core/OAuth2.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OAuth2 = void 0;
    var undici_1 = require("undici");
    var Platform_12 = require_Platform();
    var Log_12 = require_Log();
    var Url_1 = require_Url();
    var UserAgents_1 = require_UserAgents();
    var clients_1 = require_clients();
    var REGEX = { tvScript: new RegExp('<script\\s+id="base-js"\\s+src="([^"]+)"[^>]*><\\/script>'), clientIdentity: new RegExp('clientId:"(?<client_id>[^"]+)",[^"]*?:"(?<client_secret>[^"]+)"') };
    var FileCache2 = Platform_12.Platform.getShim().fileCache;
    var _OAuth2 = class _OAuth2 {
      constructor(credentials, proxyOptions) {
        var _a, _b;
        this.isEnabled = false;
        this.credentials = {
          accessToken: "",
          refreshToken: "",
          expiryDate: ""
        };
        this.accessToken = "";
        this.refreshToken = "";
        this.expiryDate = "";
        if (!credentials) {
          this.isEnabled = false;
          return;
        }
        this.proxyOptions = proxyOptions;
        this.isEnabled = true;
        this.credentials = credentials;
        this.accessToken = credentials.accessToken;
        this.refreshToken = credentials.refreshToken;
        this.expiryDate = credentials.expiryDate;
        this.clientId = (_a = credentials.clientData) == null ? void 0 : _a.clientId;
        this.clientSecret = (_b = credentials.clientData) == null ? void 0 : _b.clientSecret;
        if (this.shouldRefreshToken()) {
          try {
            this.refreshAccessToken().finally(() => this.availableTokenCheck());
          } catch (err) {
          }
        } else {
          this.availableTokenCheck();
        }
        FileCache2.set("oauth2", JSON.stringify(credentials));
      }
      async availableTokenCheck() {
        try {
          const HTML5_PLAYER_CACHE = await FileCache2.get("html5Player");
          clients_1.Web.getPlayerResponse({
            videoId: "dQw4w9WgXcQ",
            signatureTimestamp: parseInt((HTML5_PLAYER_CACHE == null ? void 0 : HTML5_PLAYER_CACHE.signatureTimestamp) || "0") || 0,
            options: {
              oauth2: this
            }
          }).then(() => Log_12.Logger.debug("The specified OAuth2 token is valid.")).catch((err) => {
            if (err.error.message.includes("401")) {
              this.error("Request using the specified token failed (Web Client). Generating the token again may fix the problem.");
            }
          });
        } catch (err) {
          if ((err.message || err.error.message).includes("401")) {
            this.error("Request using the specified token failed (Web Client). Generating the token again may fix the problem.");
          }
        }
      }
      error(message) {
        Log_12.Logger.error(message);
        Log_12.Logger.info("OAuth2 is disabled due to an error.");
        this.isEnabled = false;
      }
      async getClientData() {
        var _a, _b, _c, _d, _e, _f, _g;
        const OAUTH2_CACHE = await FileCache2.get("oauth2") || {};
        if (((_a = OAUTH2_CACHE.clientData) == null ? void 0 : _a.clientId) && ((_b = OAUTH2_CACHE.clientData) == null ? void 0 : _b.clientSecret)) {
          return {
            clientId: OAUTH2_CACHE.clientData.clientId,
            clientSecret: OAUTH2_CACHE.clientData.clientSecret
          };
        }
        const YT_TV_RESPONSE = await (0, undici_1.fetch)(Url_1.Url.getTvUrl(), {
          headers: {
            "User-Agent": UserAgents_1.UserAgent.tv,
            Referer: Url_1.Url.getTvUrl()
          }
        });
        if (!YT_TV_RESPONSE.ok) {
          this.error("Failed to get client data: " + YT_TV_RESPONSE.status);
          return null;
        }
        const YT_TV_HTML = await YT_TV_RESPONSE.text(), SCRIPT_PATH = (_c = REGEX.tvScript.exec(YT_TV_HTML)) == null ? void 0 : _c[1];
        if (SCRIPT_PATH) {
          Log_12.Logger.debug("Found YouTube TV script: " + SCRIPT_PATH);
          const SCRIPT_RESPONSE = await (0, undici_1.fetch)(Url_1.Url.getBaseUrl() + SCRIPT_PATH);
          if (!SCRIPT_RESPONSE.ok) {
            this.error("TV script request failed with status code: " + SCRIPT_RESPONSE.status);
            return null;
          }
          const SCRIPT_STRING = await SCRIPT_RESPONSE.text(), CLIENT_ID = (_e = (_d = REGEX.clientIdentity.exec(SCRIPT_STRING)) == null ? void 0 : _d.groups) == null ? void 0 : _e.client_id, CLIENT_SECRET = (_g = (_f = REGEX.clientIdentity.exec(SCRIPT_STRING)) == null ? void 0 : _f.groups) == null ? void 0 : _g.client_secret;
          if (!CLIENT_ID || !CLIENT_SECRET) {
            this.error("Could not obtain client ID. Please create an issue in the repository for possible specification changes on YouTube's side.");
            return null;
          }
          Log_12.Logger.debug("Found client ID: " + CLIENT_ID);
          Log_12.Logger.debug("Found client secret: " + CLIENT_SECRET);
          return { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET };
        }
        this.error("Could not obtain script URL. Please create an issue in the repository for possible specification changes on YouTube's side.");
        return null;
      }
      shouldRefreshToken() {
        if (!this.isEnabled) {
          return false;
        }
        return Date.now() >= new Date(this.expiryDate).getTime();
      }
      async refreshAccessToken() {
        if (!this.isEnabled) {
          return;
        }
        if (!this.clientId || !this.clientSecret) {
          const data = await this.getClientData();
          if (!data) {
            return;
          }
          this.clientId = data.clientId;
          this.clientSecret = data.clientSecret;
          FileCache2.set("oauth2", JSON.stringify({ accessToken: this.accessToken, refreshToken: this.refreshToken, expiryDate: this.expiryDate, clientData: { clientId: data.clientId, clientSecret: data.clientSecret } }));
        }
        if (!this.refreshToken) {
          return this.error("Refresh token is missing, make sure it is specified.");
        }
        try {
          const PAYLOAD = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: this.refreshToken,
            grant_type: "refresh_token"
          }, REFRESH_API_RESPONSE = await (0, undici_1.fetch)(Url_1.Url.getRefreshTokenApiUrl(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(PAYLOAD)
          });
          if (!REFRESH_API_RESPONSE.ok) {
            return this.error(`Failed to refresh access token: ${REFRESH_API_RESPONSE.status}`);
          }
          const REFRESH_API_DATA = await REFRESH_API_RESPONSE.json();
          if (REFRESH_API_DATA.error_code) {
            return this.error("Authorization server returned an error: " + JSON.stringify(REFRESH_API_DATA));
          }
          this.expiryDate = new Date(Date.now() + REFRESH_API_DATA.expires_in * 1e3).toISOString();
          this.accessToken = REFRESH_API_DATA.access_token;
        } catch (err) {
          this.error(err.message);
        }
      }
      getAccessToken() {
        return this.accessToken;
      }
      getCredentials() {
        return this.credentials;
      }
    };
    __name(_OAuth2, "OAuth2");
    var OAuth2 = _OAuth2;
    exports2.OAuth2 = OAuth2;
  }
});

// package/core/PoToken.js
var require_PoToken = __commonJS({
  "package/core/PoToken.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PoToken = void 0;
    var Platform_12 = require_Platform();
    var Log_12 = require_Log();
    var RUNTIME = Platform_12.Platform.getShim().runtime;
    var _PoToken = class _PoToken {
      static async generatePoToken() {
        return new Promise((resolve) => {
          if (RUNTIME !== "default") {
            return {
              poToken: "",
              visitorData: ""
            };
          }
          const { generate } = require("youtube-po-token-generator");
          try {
            generate().then((data) => {
              Log_12.Logger.success("Successfully generated a poToken.");
              resolve(data);
            }).catch((err) => {
              Log_12.Logger.error("Failed to generate a poToken.\nDetails: " + err);
              resolve({
                poToken: "",
                visitorData: ""
              });
            });
          } catch (err) {
            Log_12.Logger.error("Failed to generate a poToken.\nDetails: " + err);
            resolve({
              poToken: "",
              visitorData: ""
            });
          }
        });
      }
    };
    __name(_PoToken, "PoToken");
    var PoToken = _PoToken;
    exports2.PoToken = PoToken;
  }
});

// package/meta/formats.js
var require_formats = __commonJS({
  "package/meta/formats.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FORMATS = void 0;
    var FORMATS = {
      5: {
        mimeType: 'video/flv; codecs="Sorenson H.283, mp3"',
        qualityLabel: "240p",
        bitrate: 25e4,
        audioBitrate: 64
      },
      6: {
        mimeType: 'video/flv; codecs="Sorenson H.263, mp3"',
        qualityLabel: "270p",
        bitrate: 8e5,
        audioBitrate: 64
      },
      13: {
        mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
        qualityLabel: null,
        bitrate: 5e5,
        audioBitrate: null
      },
      17: {
        mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
        qualityLabel: "144p",
        bitrate: 5e4,
        audioBitrate: 24
      },
      18: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 96
      },
      22: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 192
      },
      34: {
        mimeType: 'video/flv; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 128
      },
      35: {
        mimeType: 'video/flv; codecs="H.264, aac"',
        qualityLabel: "480p",
        bitrate: 8e5,
        audioBitrate: 128
      },
      36: {
        mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
        qualityLabel: "240p",
        bitrate: 175e3,
        audioBitrate: 32
      },
      37: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 3e6,
        audioBitrate: 192
      },
      38: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "3072p",
        bitrate: 35e5,
        audioBitrate: 192
      },
      43: {
        mimeType: 'video/webm; codecs="VP8, vorbis"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 128
      },
      44: {
        mimeType: 'video/webm; codecs="VP8, vorbis"',
        qualityLabel: "480p",
        bitrate: 1e6,
        audioBitrate: 128
      },
      45: {
        mimeType: 'video/webm; codecs="VP8, vorbis"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 192
      },
      46: {
        mimeType: 'audio/webm; codecs="vp8, vorbis"',
        qualityLabel: "1080p",
        bitrate: null,
        audioBitrate: 192
      },
      82: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 96
      },
      83: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "240p",
        bitrate: 5e5,
        audioBitrate: 96
      },
      84: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 192
      },
      85: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 3e6,
        audioBitrate: 192
      },
      91: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "144p",
        bitrate: 1e5,
        audioBitrate: 48
      },
      92: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "240p",
        bitrate: 15e4,
        audioBitrate: 48
      },
      93: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 128
      },
      94: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "480p",
        bitrate: 8e5,
        audioBitrate: 128
      },
      95: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 15e5,
        audioBitrate: 256
      },
      96: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: 256
      },
      100: {
        mimeType: 'audio/webm; codecs="VP8, vorbis"',
        qualityLabel: "360p",
        bitrate: null,
        audioBitrate: 128
      },
      101: {
        mimeType: 'audio/webm; codecs="VP8, vorbis"',
        qualityLabel: "360p",
        bitrate: null,
        audioBitrate: 192
      },
      102: {
        mimeType: 'audio/webm; codecs="VP8, vorbis"',
        qualityLabel: "720p",
        bitrate: null,
        audioBitrate: 192
      },
      120: {
        mimeType: 'video/flv; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 128
      },
      127: {
        mimeType: 'audio/ts; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 96
      },
      128: {
        mimeType: 'audio/ts; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 96
      },
      132: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "240p",
        bitrate: 15e4,
        audioBitrate: 48
      },
      133: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "240p",
        bitrate: 2e5,
        audioBitrate: null
      },
      134: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "360p",
        bitrate: 3e5,
        audioBitrate: null
      },
      135: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "480p",
        bitrate: 5e5,
        audioBitrate: null
      },
      136: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "720p",
        bitrate: 1e6,
        audioBitrate: null
      },
      137: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: null
      },
      138: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "4320p",
        bitrate: 135e5,
        audioBitrate: null
      },
      139: {
        mimeType: 'audio/mp4; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 48
      },
      140: {
        mimeType: 'audio/m4a; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 128
      },
      141: {
        mimeType: 'audio/mp4; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 256
      },
      151: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 5e4,
        audioBitrate: 24
      },
      160: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "144p",
        bitrate: 1e5,
        audioBitrate: null
      },
      171: {
        mimeType: 'audio/webm; codecs="vorbis"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 128
      },
      172: {
        mimeType: 'audio/webm; codecs="vorbis"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 192
      },
      231: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "480p",
        bitrate: 5e5,
        audioBitrate: null
      },
      232: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 8e5,
        audioBitrate: null
      },
      242: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "240p",
        bitrate: 1e5,
        audioBitrate: null
      },
      243: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "360p",
        bitrate: 25e4,
        audioBitrate: null
      },
      244: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "480p",
        bitrate: 5e5,
        audioBitrate: null
      },
      247: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p",
        bitrate: 7e5,
        audioBitrate: null
      },
      248: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1080p",
        bitrate: 15e5,
        audioBitrate: null
      },
      249: {
        mimeType: 'audio/webm; codecs="opus"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 48
      },
      250: {
        mimeType: 'audio/webm; codecs="opus"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 64
      },
      251: {
        mimeType: 'audio/webm; codecs="opus"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 160
      },
      264: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1440p",
        bitrate: 4e6,
        audioBitrate: null
      },
      266: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "2160p",
        bitrate: 125e5,
        audioBitrate: null
      },
      270: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: null
      },
      271: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1440p",
        bitrate: 9e6,
        audioBitrate: null
      },
      272: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "4320p",
        bitrate: 2e7,
        audioBitrate: null
      },
      278: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "144p 30fps",
        bitrate: 8e4,
        audioBitrate: null
      },
      298: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "720p",
        bitrate: 3e6,
        audioBitrate: null
      },
      299: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 55e5,
        audioBitrate: null
      },
      300: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 1318e3,
        audioBitrate: 48
      },
      301: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 3e6,
        audioBitrate: 128
      },
      302: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p HFR",
        bitrate: 25e5,
        audioBitrate: null
      },
      303: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1080p HFR",
        bitrate: 5e6,
        audioBitrate: null
      },
      308: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1440p HFR",
        bitrate: 1e7,
        audioBitrate: null
      },
      311: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p",
        bitrate: 125e4,
        audioBitrate: null
      },
      312: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: null
      },
      313: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "2160p",
        bitrate: 13e6,
        audioBitrate: null
      },
      315: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "2160p HFR",
        bitrate: 2e7,
        audioBitrate: null
      },
      330: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "144p HDR, HFR",
        bitrate: 8e4,
        audioBitrate: null
      },
      331: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "240p HDR, HFR",
        bitrate: 1e5,
        audioBitrate: null
      },
      332: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "360p HDR, HFR",
        bitrate: 25e4,
        audioBitrate: null
      },
      333: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "240p HDR, HFR",
        bitrate: 5e5,
        audioBitrate: null
      },
      334: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p HDR, HFR",
        bitrate: 1e6,
        audioBitrate: null
      },
      335: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1080p HDR, HFR",
        bitrate: 15e5,
        audioBitrate: null
      },
      336: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1440p HDR, HFR",
        bitrate: 5e6,
        audioBitrate: null
      },
      337: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "2160p HDR, HFR",
        bitrate: 12e6,
        audioBitrate: null
      }
    };
    exports2.FORMATS = FORMATS;
  }
});

// package/utils/Format.js
var require_Format = __commonJS({
  "package/utils/Format.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FormatUtils = void 0;
    var formats_1 = require_formats();
    var Utils_1 = __importDefault2(require_Utils());
    var AUDIO_ENCODING_RANKS = ["mp4a", "mp3", "vorbis", "aac", "opus", "flac"];
    var VIDEO_ENCODING_RANKS = ["mp4v", "avc1", "Sorenson H.283", "MPEG-4 Visual", "VP8", "VP9", "av01", "H.264"];
    function getEncodingRank(ranks, format) {
      return ranks.findIndex((enc) => format.codec.text && format.codec.text.includes(enc));
    }
    __name(getEncodingRank, "getEncodingRank");
    function getVideoBitrate(format) {
      return format.bitrate || 0;
    }
    __name(getVideoBitrate, "getVideoBitrate");
    function getVideoEncodingRank(format) {
      return getEncodingRank(VIDEO_ENCODING_RANKS, format);
    }
    __name(getVideoEncodingRank, "getVideoEncodingRank");
    function getAudioBitrate(format) {
      return format.audioBitrate || 0;
    }
    __name(getAudioBitrate, "getAudioBitrate");
    function getAudioEncodingRank(format) {
      return getEncodingRank(AUDIO_ENCODING_RANKS, format);
    }
    __name(getAudioEncodingRank, "getAudioEncodingRank");
    function sortFormatsBy(a, b, sortBy) {
      let res = 0;
      for (const FUNC of sortBy) {
        res = FUNC(b) - FUNC(a);
        if (res !== 0) {
          break;
        }
      }
      return res;
    }
    __name(sortFormatsBy, "sortFormatsBy");
    function getQualityLabel(format) {
      return parseInt(format.quality.label) || 0;
    }
    __name(getQualityLabel, "getQualityLabel");
    function sortFormatsByVideo(a, b) {
      return sortFormatsBy(a, b, [getQualityLabel, getVideoBitrate, getVideoEncodingRank]);
    }
    __name(sortFormatsByVideo, "sortFormatsByVideo");
    function sortFormatsByAudio(a, b) {
      return sortFormatsBy(a, b, [getAudioBitrate, getAudioEncodingRank]);
    }
    __name(sortFormatsByAudio, "sortFormatsByAudio");
    function getFormatByQuality(quality, formats) {
      const getFormat = /* @__PURE__ */ __name((itag) => formats.find((format) => `${format.itag}` === `${itag}`) || null, "getFormat");
      if (Array.isArray(quality)) {
        const FOUND = quality.find((itag) => getFormat(itag));
        if (!FOUND) {
          return null;
        }
        return getFormat(FOUND) || null;
      } else {
        return getFormat(quality || "") || null;
      }
    }
    __name(getFormatByQuality, "getFormatByQuality");
    var _FormatUtils = class _FormatUtils {
      static sortFormats(a, b) {
        return sortFormatsBy(a, b, [
          // Formats with both video and audio are ranked highest.
          (format) => +!!format.isHLS,
          (format) => +!!format.isDashMPD,
          (format) => +(parseInt(format.contentLength) > 0),
          (format) => +(format.hasVideo && format.hasAudio),
          (format) => +format.hasVideo,
          (format) => parseInt(format.quality.label) || 0,
          getVideoBitrate,
          getAudioBitrate,
          getVideoEncodingRank,
          getAudioEncodingRank
        ]);
      }
      static filterFormats(formats, filter) {
        let fn;
        switch (filter) {
          case "videoandaudio":
          case "audioandvideo": {
            fn = /* @__PURE__ */ __name((format) => format.hasVideo && format.hasAudio, "fn");
            break;
          }
          case "video": {
            fn = /* @__PURE__ */ __name((format) => format.hasVideo, "fn");
            break;
          }
          case "videoonly": {
            fn = /* @__PURE__ */ __name((format) => format.hasVideo && !format.hasAudio, "fn");
            break;
          }
          case "audio": {
            fn = /* @__PURE__ */ __name((format) => format.hasAudio, "fn");
            break;
          }
          case "audioonly": {
            fn = /* @__PURE__ */ __name((format) => format.hasAudio && !format.hasVideo, "fn");
            break;
          }
          default: {
            if (typeof filter === "function") {
              fn = filter;
            } else {
              throw new TypeError(`Given filter (${filter}) is not supported`);
            }
          }
        }
        return formats.filter((format) => !!format.url && fn(format));
      }
      static chooseFormat(formats, options) {
        if (typeof options.format === "object") {
          if (!options.format.url) {
            throw new Error("Invalid format given, did you use `ytdl.getFullInfo()`?");
          }
          return options.format;
        }
        if (options.filter) {
          formats = this.filterFormats(formats, options.filter);
        }
        if (options.excludingClients) {
          formats = formats.filter((format2) => {
            var _a;
            return !((_a = options.excludingClients) == null ? void 0 : _a.includes(format2.sourceClientName));
          });
        }
        if (options.includingClients && options.includingClients !== "all") {
          formats = formats.filter((format2) => {
            var _a;
            return (_a = options.includingClients) == null ? void 0 : _a.includes(format2.sourceClientName);
          });
        }
        if (formats.some((format2) => format2.isHLS)) {
          formats = formats.filter((format2) => format2.isHLS || !format2.isLive);
        }
        const QUALITY = options.quality || "highest";
        let format;
        switch (QUALITY) {
          case "highest": {
            format = formats[0];
            break;
          }
          case "lowest": {
            format = formats[formats.length - 1];
            break;
          }
          case "highestaudio": {
            formats = this.filterFormats(formats, "audio");
            formats.sort(sortFormatsByAudio);
            const BEST_AUDIO_FORMAT = formats[0];
            formats = formats.filter((format2) => sortFormatsByAudio(BEST_AUDIO_FORMAT, format2) === 0);
            const WORST_VIDEO_QUALITY = formats.map((format2) => parseInt(format2.quality.label) || 0).sort((a, b) => a - b)[0];
            format = formats.find((format2) => (parseInt(format2.quality.label) || 0) === WORST_VIDEO_QUALITY);
            break;
          }
          case "lowestaudio": {
            formats = this.filterFormats(formats, "audio");
            formats.sort(sortFormatsByAudio);
            format = formats[formats.length - 1];
            break;
          }
          case "highestvideo": {
            formats = this.filterFormats(formats, "video");
            formats.sort(sortFormatsByVideo);
            const BEST_VIDEO_FORMAT = formats[0];
            formats = formats.filter((format2) => sortFormatsByVideo(BEST_VIDEO_FORMAT, format2) === 0);
            const WORST_VIDEO_QUALITY = formats.map((format2) => format2.audioBitrate || 0).sort((a, b) => a - b)[0];
            format = formats.find((format2) => (format2.audioBitrate || 0) === WORST_VIDEO_QUALITY);
            break;
          }
          case "lowestvideo": {
            formats = this.filterFormats(formats, "video");
            formats.sort(sortFormatsByVideo);
            format = formats[formats.length - 1];
            break;
          }
          default: {
            format = getFormatByQuality(QUALITY, formats);
            break;
          }
        }
        if (!format) {
          throw new Error(`No such format found: ${QUALITY}`);
        }
        return format;
      }
      static getClientName(url) {
        try {
          const C = new URL(url).searchParams.get("c");
          switch (C) {
            case "WEB": {
              return "web";
            }
            case "MWEB": {
              return "mweb";
            }
            case "WEB_CREATOR": {
              return "webCreator";
            }
            case "WEB_EMBEDDED_PLAYER": {
              return "webEmbedded";
            }
            case "IOS": {
              return "ios";
            }
            case "ANDROID": {
              return "android";
            }
            case "TVHTML5_SIMPLY_EMBEDDED_PLAYER": {
              return "tvEmbedded";
            }
            default: {
              return "unknown";
            }
          }
        } catch (err) {
          return "unknown";
        }
      }
      static addFormatMeta(adaptiveFormat, includesOriginalFormatData) {
        var _a;
        const ITAG = adaptiveFormat.itag, ADDITIONAL_FORMAT_DATA = formats_1.FORMATS[ITAG] || null, CODEC = adaptiveFormat.mimeType && Utils_1.default.between(adaptiveFormat.mimeType, 'codecs="', '"'), IS_HLS = /\/manifest\/hls_(variant|playlist)\//.test(adaptiveFormat.url), FORMAT = {
          itag: ITAG,
          url: adaptiveFormat.url,
          mimeType: adaptiveFormat.mimeType || "video/mp4",
          codec: {
            text: CODEC || "h264",
            video: null,
            audio: null
          },
          quality: {
            text: adaptiveFormat.quality,
            label: adaptiveFormat.qualityLabel || (IS_HLS ? "video" : "audio")
          },
          bitrate: adaptiveFormat.bitrate || (ADDITIONAL_FORMAT_DATA == null ? void 0 : ADDITIONAL_FORMAT_DATA.bitrate) || NaN,
          audioBitrate: (ADDITIONAL_FORMAT_DATA == null ? void 0 : ADDITIONAL_FORMAT_DATA.audioBitrate) || NaN,
          contentLength: adaptiveFormat.contentLength,
          container: ((_a = adaptiveFormat.mimeType) == null ? void 0 : _a.split(";")[0].split("/")[1]) || null,
          hasVideo: !!adaptiveFormat.qualityLabel || !!!adaptiveFormat.audioQuality,
          hasAudio: !!adaptiveFormat.audioQuality,
          isLive: /\bsource[/=]yt_live_broadcast\b/.test(adaptiveFormat.url),
          isHLS: IS_HLS,
          isDashMPD: /\/manifest\/dash\//.test(adaptiveFormat.url),
          sourceClientName: IS_HLS ? "ios" : this.getClientName(adaptiveFormat.url) || "unknown"
        }, SPLITTED_CODEC = FORMAT.codec.text.split(", ");
        if (includesOriginalFormatData) {
          FORMAT.originalData = adaptiveFormat;
        }
        FORMAT.codec.video = FORMAT.hasVideo ? SPLITTED_CODEC[0] : null;
        FORMAT.codec.audio = FORMAT.hasAudio ? SPLITTED_CODEC[1] || SPLITTED_CODEC[0] : null;
        return FORMAT;
      }
    };
    __name(_FormatUtils, "FormatUtils");
    var FormatUtils = _FormatUtils;
    exports2.FormatUtils = FormatUtils;
  }
});

// package/YtdlCore.js
var require_YtdlCore = __commonJS({
  "package/YtdlCore.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.YtdlCore = void 0;
    var Platform_12 = require_Platform();
    var Download_1 = require_Download2();
    var Info_1 = require_Info();
    var Html5Player_1 = require_Html5Player();
    var Agent_1 = require_Agent();
    var OAuth2_1 = require_OAuth2();
    var PoToken_1 = require_PoToken();
    var Url_1 = require_Url();
    var Format_1 = require_Format();
    var Constants_12 = require_Constants();
    var Log_12 = require_Log();
    var FileCache2 = Platform_12.Platform.getShim().fileCache;
    function isNodeVersionOk(version) {
      return parseInt(version.replace("v", "").split(".")[0]) >= 16;
    }
    __name(isNodeVersionOk, "isNodeVersionOk");
    var _YtdlCore = class _YtdlCore {
      /* Setup */
      async setPoToken(poToken) {
        const PO_TOKEN_CACHE = await FileCache2.get("poToken");
        if (poToken) {
          this.poToken = poToken;
        } else if (PO_TOKEN_CACHE) {
          Log_12.Logger.debug("PoToken loaded from cache.");
          this.poToken = PO_TOKEN_CACHE || void 0;
        }
        FileCache2.set("poToken", this.poToken || "", { ttl: 60 * 60 * 24 * 365 });
      }
      async setVisitorData(visitorData) {
        const VISITOR_DATA_CACHE = await FileCache2.get("visitorData");
        if (visitorData) {
          this.visitorData = visitorData;
        } else if (VISITOR_DATA_CACHE) {
          Log_12.Logger.debug("VisitorData loaded from cache.");
          this.visitorData = VISITOR_DATA_CACHE || void 0;
        }
        FileCache2.set("visitorData", this.visitorData || "", { ttl: 60 * 60 * 24 * 365 });
      }
      async setOAuth2(oauth2Credentials, proxyOptions) {
        const OAUTH2_CACHE = await FileCache2.get("oauth2") || void 0;
        try {
          if (oauth2Credentials) {
            this.oauth2 = new OAuth2_1.OAuth2(oauth2Credentials, proxyOptions) || void 0;
          } else if (OAUTH2_CACHE) {
            this.oauth2 = new OAuth2_1.OAuth2(OAUTH2_CACHE, proxyOptions);
          } else {
            this.oauth2 = null;
          }
        } catch {
          this.oauth2 = null;
        }
      }
      automaticallyGeneratePoToken() {
        if (!this.poToken && !this.visitorData) {
          Log_12.Logger.info("Since PoToken and VisitorData are not specified, they are generated automatically.");
          PoToken_1.PoToken.generatePoToken().then(({ poToken, visitorData }) => {
            this.poToken = poToken;
            this.visitorData = visitorData;
            FileCache2.set("poToken", this.poToken || "", { ttl: 60 * 60 * 24 * 365 });
            FileCache2.set("visitorData", this.visitorData || "", { ttl: 60 * 60 * 24 * 365 });
          }).catch(() => {
          });
        }
      }
      initializeHtml5PlayerCache() {
        const HTML5_PLAYER = FileCache2.get("html5Player");
        if (!HTML5_PLAYER) {
          Log_12.Logger.debug("To speed up processing, html5Player and signatureTimestamp are pre-fetched and cached.");
          (0, Html5Player_1.getHtml5Player)({});
        }
      }
      constructor({ hl, gl, requestOptions, rewriteRequest, agent, poToken, disablePoTokenAutoGeneration, visitorData, includesPlayerAPIResponse, includesNextAPIResponse, includesOriginalFormatData, includesRelatedVideo, clients, disableDefaultClients, oauth2Credentials, parsesHLSFormat, originalProxy, quality, filter, excludingClients, includingClients, range, begin, liveBuffer, highWaterMark, IPv6Block, dlChunkSize, disableFileCache, logDisplay } = {}) {
        this.hl = "en";
        this.gl = "US";
        this.requestOptions = {};
        this.disablePoTokenAutoGeneration = false;
        this.includesPlayerAPIResponse = false;
        this.includesNextAPIResponse = false;
        this.includesOriginalFormatData = false;
        this.includesRelatedVideo = true;
        this.disableDefaultClients = false;
        this.oauth2 = null;
        this.parsesHLSFormat = false;
        this.excludingClients = [];
        this.includingClients = "all";
        this.version = Constants_12.VERSION;
        Log_12.Logger.logDisplay = logDisplay || ["info", "success", "warning", "error"];
        if (disableFileCache) {
          FileCache2.disable();
        }
        this.hl = hl || "en";
        this.gl = gl || "US";
        this.requestOptions = requestOptions || {};
        this.rewriteRequest = rewriteRequest || void 0;
        this.agent = agent || void 0;
        this.disablePoTokenAutoGeneration = disablePoTokenAutoGeneration ?? false;
        this.includesPlayerAPIResponse = includesPlayerAPIResponse ?? false;
        this.includesNextAPIResponse = includesNextAPIResponse ?? false;
        this.includesOriginalFormatData = includesOriginalFormatData ?? false;
        this.includesRelatedVideo = includesRelatedVideo ?? true;
        this.clients = clients || void 0;
        this.disableDefaultClients = disableDefaultClients ?? false;
        this.parsesHLSFormat = parsesHLSFormat ?? false;
        this.originalProxy = originalProxy || void 0;
        if (this.originalProxy) {
          Log_12.Logger.debug(`<debug>"${this.originalProxy.base}"</debug> is used for <blue>API requests</blue>.`);
          Log_12.Logger.debug(`<debug>"${this.originalProxy.download}"</debug> is used for <blue>video downloads</blue>.`);
          Log_12.Logger.debug(`The query name <debug>"${this.originalProxy.urlQueryName || "url"}"</debug> is used to specify the URL in the request. <blue>(?url=...)</blue>`);
        }
        this.setPoToken(poToken);
        this.setVisitorData(visitorData);
        this.setOAuth2(oauth2Credentials || null, {
          agent: this.agent,
          rewriteRequest: this.rewriteRequest,
          originalProxy: this.originalProxy
        });
        this.quality = quality || void 0;
        this.filter = filter || void 0;
        this.excludingClients = excludingClients || [];
        this.includingClients = includingClients || "all";
        this.range = range || void 0;
        this.begin = begin || void 0;
        this.liveBuffer = liveBuffer || void 0;
        this.highWaterMark = highWaterMark || void 0;
        this.IPv6Block = IPv6Block || void 0;
        this.dlChunkSize = dlChunkSize || void 0;
        if (!this.disablePoTokenAutoGeneration) {
          this.automaticallyGeneratePoToken();
        }
        this.initializeHtml5PlayerCache();
        if (!isNodeVersionOk(process.version)) {
          throw new Error(`You are using Node.js ${process.version} which is not supported. Minimum version required is v16.`);
        }
      }
      initializeOptions(options) {
        var _a;
        const INTERNAL_OPTIONS = { ...options, oauth2: this.oauth2 };
        INTERNAL_OPTIONS.hl = options.hl || this.hl;
        INTERNAL_OPTIONS.gl = options.gl || this.gl;
        INTERNAL_OPTIONS.requestOptions = options.requestOptions || this.requestOptions;
        INTERNAL_OPTIONS.rewriteRequest = options.rewriteRequest || this.rewriteRequest;
        INTERNAL_OPTIONS.agent = options.agent || this.agent;
        INTERNAL_OPTIONS.poToken = options.poToken || this.poToken;
        INTERNAL_OPTIONS.disablePoTokenAutoGeneration = options.disablePoTokenAutoGeneration || this.disablePoTokenAutoGeneration;
        INTERNAL_OPTIONS.visitorData = options.visitorData || this.visitorData;
        INTERNAL_OPTIONS.includesPlayerAPIResponse = options.includesPlayerAPIResponse || this.includesPlayerAPIResponse;
        INTERNAL_OPTIONS.includesNextAPIResponse = options.includesNextAPIResponse || this.includesNextAPIResponse;
        INTERNAL_OPTIONS.includesOriginalFormatData = options.includesOriginalFormatData || this.includesOriginalFormatData;
        INTERNAL_OPTIONS.includesRelatedVideo = options.includesRelatedVideo || this.includesRelatedVideo;
        INTERNAL_OPTIONS.clients = options.clients || this.clients;
        INTERNAL_OPTIONS.disableDefaultClients = options.disableDefaultClients || this.disableDefaultClients;
        INTERNAL_OPTIONS.oauth2Credentials = options.oauth2Credentials || ((_a = this.oauth2) == null ? void 0 : _a.getCredentials());
        INTERNAL_OPTIONS.parsesHLSFormat = options.parsesHLSFormat || this.parsesHLSFormat;
        INTERNAL_OPTIONS.originalProxy = options.originalProxy || this.originalProxy || void 0;
        INTERNAL_OPTIONS.quality = options.quality || this.quality || void 0;
        INTERNAL_OPTIONS.filter = options.filter || this.filter || void 0;
        INTERNAL_OPTIONS.excludingClients = options.excludingClients || this.excludingClients || [];
        INTERNAL_OPTIONS.includingClients = options.includingClients || this.includingClients || "all";
        INTERNAL_OPTIONS.range = options.range || this.range || void 0;
        INTERNAL_OPTIONS.begin = options.begin || this.begin || void 0;
        INTERNAL_OPTIONS.liveBuffer = options.liveBuffer || this.liveBuffer || void 0;
        INTERNAL_OPTIONS.highWaterMark = options.highWaterMark || this.highWaterMark || void 0;
        INTERNAL_OPTIONS.IPv6Block = options.IPv6Block || this.IPv6Block || void 0;
        INTERNAL_OPTIONS.dlChunkSize = options.dlChunkSize || this.dlChunkSize || void 0;
        if (!INTERNAL_OPTIONS.oauth2 && options.oauth2Credentials) {
          Log_12.Logger.warning("The OAuth2 token should be specified when instantiating the YtdlCore class, not as a function argument.");
          INTERNAL_OPTIONS.oauth2 = new OAuth2_1.OAuth2(options.oauth2Credentials, {
            agent: INTERNAL_OPTIONS.agent,
            rewriteRequest: INTERNAL_OPTIONS.rewriteRequest,
            originalProxy: INTERNAL_OPTIONS.originalProxy
          });
        }
        return INTERNAL_OPTIONS;
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      download(link, options = {}) {
        return (0, Download_1.download)(link, this.initializeOptions(options));
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      downloadFromInfo(info, options = {}) {
        return (0, Download_1.downloadFromInfo)(info, this.initializeOptions(options));
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      getBasicInfo(link, options = {}) {
        return (0, Info_1.getBasicInfo)(link, this.initializeOptions(options));
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      getFullInfo(link, options = {}) {
        return (0, Info_1.getFullInfo)(link, this.initializeOptions(options));
      }
    };
    __name(_YtdlCore, "YtdlCore");
    var YtdlCore = _YtdlCore;
    exports2.YtdlCore = YtdlCore;
    YtdlCore.chooseFormat = Format_1.FormatUtils.chooseFormat;
    YtdlCore.filterFormats = Format_1.FormatUtils.filterFormats;
    YtdlCore.validateID = Url_1.Url.validateID;
    YtdlCore.validateURL = Url_1.Url.validateURL;
    YtdlCore.getURLVideoID = Url_1.Url.getURLVideoID;
    YtdlCore.getVideoID = Url_1.Url.getVideoID;
    YtdlCore.createAgent = Agent_1.Agent.createAgent;
    YtdlCore.createProxyAgent = Agent_1.Agent.createProxyAgent;
  }
});

// package/types/YouTube/Renderers.js
var require_Renderers = __commonJS({
  "package/types/YouTube/Renderers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/YouTube/Misc.js
var require_Misc = __commonJS({
  "package/types/YouTube/Misc.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/YouTube/Player.js
var require_Player = __commonJS({
  "package/types/YouTube/Player.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/YouTube/Next.js
var require_Next = __commonJS({
  "package/types/YouTube/Next.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/YouTube/Formats.js
var require_Formats = __commonJS({
  "package/types/YouTube/Formats.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/YouTube/index.js
var require_YouTube = __commonJS({
  "package/types/YouTube/index.js"(exports2) {
    "use strict";
    var __createBinding2 = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar2 = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding2(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar2(require_Renderers(), exports2);
    __exportStar2(require_Misc(), exports2);
    __exportStar2(require_Player(), exports2);
    __exportStar2(require_Next(), exports2);
    __exportStar2(require_Formats(), exports2);
  }
});

// package/types/Agent.js
var require_Agent2 = __commonJS({
  "package/types/Agent.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/Clients.js
var require_Clients2 = __commonJS({
  "package/types/Clients.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/Cookie.js
var require_Cookie = __commonJS({
  "package/types/Cookie.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/FileCache.js
var require_FileCache = __commonJS({
  "package/types/FileCache.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/Language.js
var require_Language = __commonJS({
  "package/types/Language.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/Options.js
var require_Options = __commonJS({
  "package/types/Options.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/Ytdl.js
var require_Ytdl = __commonJS({
  "package/types/Ytdl.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/index.js
var require_types = __commonJS({
  "package/types/index.js"(exports2) {
    "use strict";
    var __createBinding2 = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar2 = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding2(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar2(require_YouTube(), exports2);
    __exportStar2(require_Agent2(), exports2);
    __exportStar2(require_Clients2(), exports2);
    __exportStar2(require_Cookie(), exports2);
    __exportStar2(require_FileCache(), exports2);
    __exportStar2(require_Language(), exports2);
    __exportStar2(require_Options(), exports2);
    __exportStar2(require_Ytdl(), exports2);
  }
});

// package/Platforms/Default/Default.js
var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return m[k];
    }, "get") };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  o[k2] = m[k];
});
var __exportStar = exports && exports.__exportStar || function(m, exports2) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
};
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtdlCore = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var os_1 = __importDefault(require("os"));
var Platform_1 = require_Platform();
var Classes_1 = require_Classes();
var Constants_1 = require_Constants();
var Log_1 = require_Log();
var _FileCache = class _FileCache {
  constructor() {
    this.timeouts = /* @__PURE__ */ new Map();
    this.isDisabled = false;
    this.cacheDir = path_1.default.resolve(__dirname, "./.CacheFiles/");
  }
  async get(cacheName) {
    if (this.isDisabled) {
      return null;
    }
    try {
      if (!this.has(cacheName)) {
        return null;
      }
      const FILE_PATH = path_1.default.resolve(this.cacheDir, cacheName + ".txt"), PARSED_DATA = JSON.parse(fs_1.default.readFileSync(FILE_PATH, "utf8"));
      if (Date.now() > PARSED_DATA.date) {
        return null;
      }
      Log_1.Logger.debug(`[ FileCache ]: Cache key <blue>"${cacheName}"</blue> was available.`);
      try {
        return JSON.parse(PARSED_DATA.contents);
      } catch {
        return PARSED_DATA.contents;
      }
    } catch (err) {
      return null;
    }
  }
  async set(cacheName, data, options = { ttl: 60 * 60 * 24 }) {
    if (this.isDisabled) {
      Log_1.Logger.debug(`[ FileCache ]: <blue>"${cacheName}"</blue> is not cached by the _YTDL_DISABLE_FILE_CACHE option.`);
      return false;
    }
    try {
      fs_1.default.writeFileSync(path_1.default.resolve(this.cacheDir, cacheName + ".txt"), JSON.stringify({
        date: Date.now() + options.ttl * 1e3,
        contents: data
      }));
      if (this.timeouts.has(cacheName)) {
        clearTimeout(this.timeouts.get(cacheName));
      }
      const TIMEOUT = setTimeout(() => {
        this.delete(cacheName);
      }, options.ttl * 1e3);
      this.timeouts.set(cacheName, TIMEOUT);
      Log_1.Logger.debug(`[ FileCache ]: <success>"${cacheName}"</success> is cached.`);
      return true;
    } catch (err) {
      Log_1.Logger.error(`Failed to cache ${cacheName}.
Details: `, err);
      return false;
    }
  }
  async has(cacheName) {
    if (this.isDisabled) {
      return true;
    }
    try {
      return fs_1.default.existsSync(path_1.default.resolve(this.cacheDir, cacheName + ".txt"));
    } catch {
      return false;
    }
  }
  async delete(cacheName) {
    if (this.isDisabled) {
      return true;
    }
    try {
      if (!this.has(cacheName)) {
        return true;
      }
      const FILE_PATH = path_1.default.resolve(this.cacheDir, cacheName + ".txt");
      fs_1.default.unlinkSync(FILE_PATH);
      Log_1.Logger.debug(`[ FileCache ]: Cache key <blue>"${cacheName}"</blue> was deleted.`);
      if (this.timeouts.has(cacheName)) {
        clearTimeout(this.timeouts.get(cacheName));
        this.timeouts.delete(cacheName);
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  disable() {
    this.isDisabled = true;
  }
  initialization() {
    if (typeof process !== "undefined") {
      this.isDisabled = !!(process.env._YTDL_DISABLE_FILE_CACHE !== "false" && process.env._YTDL_DISABLE_FILE_CACHE);
      try {
        if (!fs_1.default.existsSync(this.cacheDir)) {
          fs_1.default.mkdirSync(this.cacheDir);
        }
      } catch {
        try {
          this.cacheDir = path_1.default.resolve(os_1.default.tmpdir(), "./.YtdlCore-Cache/");
          if (!fs_1.default.existsSync(this.cacheDir)) {
            fs_1.default.mkdirSync(this.cacheDir);
          }
        } catch {
          process.env._YTDL_DISABLE_FILE_CACHE = "true";
          this.isDisabled = true;
        }
      }
    }
  }
};
__name(_FileCache, "FileCache");
var FileCache = _FileCache;
Platform_1.Platform.load({
  runtime: "default",
  server: true,
  cache: new Classes_1.CacheWithMap(),
  fileCache: new FileCache(),
  default: {
    options: {
      hl: "en",
      gl: "US",
      includesPlayerAPIResponse: false,
      includesNextAPIResponse: false,
      includesOriginalFormatData: false,
      includesRelatedVideo: true,
      clients: ["web", "webCreator", "tvEmbedded", "ios", "android"],
      disableDefaultClients: false,
      disableFileCache: false,
      parsesHLSFormat: true
    },
    proxy: {
      rewriteRequest: /* @__PURE__ */ __name((url, options) => {
        return { url, options };
      }, "rewriteRequest"),
      originalProxy: null
    }
  },
  info: {
    version: Constants_1.VERSION,
    repoUrl: Constants_1.REPO_URL,
    issuesUrl: Constants_1.ISSUES_URL
  }
});
var YtdlCore_1 = require_YtdlCore();
Object.defineProperty(exports, "YtdlCore", { enumerable: true, get: /* @__PURE__ */ __name(function() {
  return YtdlCore_1.YtdlCore;
}, "get") });
__exportStar(require_types(), exports);
exports.default = YtdlCore_1.YtdlCore;
