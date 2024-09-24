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
      constructor(ttl = 60) {
        this.ttl = ttl;
        this.cache = /* @__PURE__ */ new Map();
        this.timeouts = /* @__PURE__ */ new Map();
      }
      async get(key) {
        return this.cache.get(key) || null;
      }
      async set(key, value, { ttl } = { ttl: this.ttl }) {
        this.cache.set(key, value);
        if (this.timeouts.has(key)) {
          clearTimeout(this.timeouts.get(key));
        }
        const timeout = setTimeout(() => {
          this.delete(key);
        }, ttl * 1e3);
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
        "./browser.bundle": {
          types: "./package/types/index.d.ts",
          default: "./bundle/browser.cjs"
        },
        "./serverless": {
          types: "./package/types/index.d.ts",
          default: "./package/Platforms/Serverless/Serverless.js"
        },
        "./types": {
          types: "./package/types/index.d.ts",
          default: "./package/types/index.d.ts"
        }
      },
      files: [
        "package"
      ],
      scripts: {
        test: "npx jest ./test/main.test.ts",
        build: "rmdir /s /q package && tsc && tsc-alias && npm run clear-cache-files && npm run create-node-bundle && npm run create-browser-bundle",
        "clear-cache-files": "cd package/core && rmdir /s /q CacheFiles 2>nul & cd ../..",
        update: "ncu && ncu -u && npm i",
        "publish:github": "npm run build && npm publish --registry=https://npm.pkg.github.com",
        "publish:npm": "npm run build && npm publish --registry=https://registry.npmjs.org/",
        "create-node-bundle": 'rmdir /s /q bundle && mkdir bundle && esbuild ./package/Platforms/Default/Default.js --bundle --target=node16 --keep-names --format=cjs --platform=node --outfile=./bundle/node.cjs --banner:js="/* eslint-disable */"',
        "create-browser-bundle": 'esbuild ./package/Platforms/Browser/Browser.js --banner:js="/* eslint-disable */" --bundle --target=chrome70 --keep-names --format=esm --define:global=globalThis --conditions=module --outfile=./bundle/browser.js --platform=browser --minify'
      },
      dependencies: {
        buffer: "^6.0.3",
        "node-fetch": "^3.3.2",
        sax: "^1.4.1",
        string_decoder: "^1.3.0"
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
        "audio",
        "download",
        "getInfo",
        "ybd-project",
        "ytdl",
        "ytdl-core",
        "secure",
        "fast",
        "browser",
        "serverless",
        "typescript"
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
          return null;
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
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Fetcher = void 0;
    var Platform_13 = require_Platform();
    var Log_13 = require_Log();
    var errors_1 = require_errors();
    var UserAgents_1 = require_UserAgents();
    var _Fetcher = class _Fetcher {
      static async fetch(url, options, noProxyAdaptation = false) {
        var _a;
        const SHIM2 = Platform_13.Platform.getShim(), { rewriteRequest, originalProxy } = SHIM2.requestRelated;
        if (!noProxyAdaptation) {
          if (typeof rewriteRequest === "function") {
            const WROTE_REQUEST = rewriteRequest(url, options || {}, { isDownloadUrl: false });
            options = WROTE_REQUEST.options;
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
        }
        Log_13.Logger.debug(`[ Request ]: <magenta>${(options == null ? void 0 : options.method) || "GET"}</magenta> -> ${url}`);
        const HEADERS = new Headers();
        if (options == null ? void 0 : options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            if (value) {
              HEADERS.append(key, value.toString());
            }
          });
        }
        if (!HEADERS.has("User-Agent")) {
          HEADERS.append("User-Agent", UserAgents_1.UserAgent.getRandomUserAgent("desktop"));
        }
        return await SHIM2.fetcher(url, {
          method: (options == null ? void 0 : options.method) || "GET",
          headers: HEADERS,
          body: (_a = options == null ? void 0 : options.body) == null ? void 0 : _a.toString()
        });
      }
      static async request(url, { requestOptions, rewriteRequest, originalProxy } = {}) {
        var _a;
        if (typeof rewriteRequest === "function") {
          const WROTE_REQUEST = rewriteRequest(url, requestOptions || {}, { isDownloadUrl: false });
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
        const REQUEST_RESULTS = await this.fetch(url, {
          method: (requestOptions == null ? void 0 : requestOptions.method) || "GET",
          headers: requestOptions == null ? void 0 : requestOptions.headers,
          body: (_a = requestOptions == null ? void 0 : requestOptions.body) == null ? void 0 : _a.toString()
        }, true), STATUS_CODE = REQUEST_RESULTS.status.toString(), LOCATION = REQUEST_RESULTS.headers.get("location") || null;
        if (STATUS_CODE.startsWith("2")) {
          const CONTENT_TYPE = REQUEST_RESULTS.headers.get("content-type") || "";
          if (CONTENT_TYPE.includes("application/json")) {
            return REQUEST_RESULTS.json();
          }
          return REQUEST_RESULTS.text();
        } else if (STATUS_CODE.startsWith("3") && LOCATION) {
          return this.request(LOCATION.toString(), { requestOptions, rewriteRequest, originalProxy });
        }
        const ERROR = new errors_1.RequestError(`Status Code: ${STATUS_CODE}`, REQUEST_RESULTS.status);
        throw ERROR;
      }
    };
    __name(_Fetcher, "Fetcher");
    var Fetcher = _Fetcher;
    exports2.Fetcher = Fetcher;
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
    var Log_13 = require_Log();
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
          Log_13.Logger.warning(`\`${oldPath}\` will be removed in a near future release, use \`${newPath}\` instead.`);
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
            Log_13.Logger.warning('@ybd-project/ytdl-core is out of date! Update with "npm install @ybd-project/ytdl-core@latest".');
          }
        }, (err) => {
          Log_13.Logger.warning("Error checking for updates:", err.message);
          Log_13.Logger.warning("You can disable this check by setting the `YTDL_NO_UPDATE` env variable.");
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
          const HEADERS = {
            "Content-Type": "application/json",
            "X-Goog-Visitor-Id": params.options.visitorData || "",
            ...requestOptions.headers
          }, OPTS = {
            requestOptions: {
              method: "POST",
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
    var Platform_13 = require_Platform();
    var Log_13 = require_Log();
    var Url_1 = require_Url();
    var UserAgents_1 = require_UserAgents();
    var clients_1 = require_clients();
    var Fetcher_1 = require_Fetcher();
    var REGEX = { tvScript: new RegExp('<script\\s+id="base-js"\\s+src="([^"]+)"[^>]*><\\/script>'), clientIdentity: new RegExp('clientId:"(?<client_id>[^"]+)",[^"]*?:"(?<client_secret>[^"]+)"') };
    var FileCache2 = Platform_13.Platform.getShim().fileCache;
    var _OAuth2 = class _OAuth2 {
      constructor(credentials) {
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
          }).then(() => Log_13.Logger.debug("The specified OAuth2 token is valid.")).catch((err) => {
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
        Log_13.Logger.error(message);
        Log_13.Logger.info("OAuth2 is disabled due to an error.");
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
        const HEADERS = {
          "User-Agent": UserAgents_1.UserAgent.tv,
          Referer: Url_1.Url.getTvUrl()
        }, SHIM2 = Platform_13.Platform.getShim(), YT_TV_RESPONSE = await Fetcher_1.Fetcher.fetch(Url_1.Url.getTvUrl(), {
          headers: HEADERS
        });
        if (!YT_TV_RESPONSE.ok) {
          this.error("Failed to get client data: " + YT_TV_RESPONSE.status);
          return null;
        }
        const YT_TV_HTML = await YT_TV_RESPONSE.text(), SCRIPT_PATH = (_c = REGEX.tvScript.exec(YT_TV_HTML)) == null ? void 0 : _c[1];
        if (SCRIPT_PATH) {
          Log_13.Logger.debug("Found YouTube TV script: " + SCRIPT_PATH);
          const SCRIPT_RESPONSE = await Fetcher_1.Fetcher.fetch(Url_1.Url.getBaseUrl() + SCRIPT_PATH, { headers: HEADERS });
          if (!SCRIPT_RESPONSE.ok) {
            this.error("TV script request failed with status code: " + SCRIPT_RESPONSE.status);
            return null;
          }
          const SCRIPT_STRING = await SCRIPT_RESPONSE.text(), CLIENT_ID = (_e = (_d = REGEX.clientIdentity.exec(SCRIPT_STRING)) == null ? void 0 : _d.groups) == null ? void 0 : _e.client_id, CLIENT_SECRET = (_g = (_f = REGEX.clientIdentity.exec(SCRIPT_STRING)) == null ? void 0 : _f.groups) == null ? void 0 : _g.client_secret;
          if (!CLIENT_ID || !CLIENT_SECRET) {
            this.error("Could not obtain client ID. Please create an issue in the repository for possible specification changes on YouTube's side.");
            return null;
          }
          Log_13.Logger.debug("Found client ID: " + CLIENT_ID);
          Log_13.Logger.debug("Found client secret: " + CLIENT_SECRET);
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
          }, REFRESH_API_RESPONSE = await fetch(Url_1.Url.getRefreshTokenApiUrl(), {
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

// package/core/Signature.js
var require_Signature = __commonJS({
  "package/core/Signature.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Signature = void 0;
    var Platform_1 = require_Platform();
    var Log_1 = require_Log();
    var DECIPHER_NAME_REGEXPS = ["\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)", "\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)", '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)', '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;'];
    var VARIABLE_PART = "[a-zA-Z_\\$][a-zA-Z_0-9]*";
    var VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
    var BEFORE_ACCESS = '(?:\\[\\"|\\.)';
    var AFTER_ACCESS = '(?:\\"\\]|)';
    var VARIABLE_PART_ACCESS = BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
    var REVERSE_PART = ":function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}";
    var SLICE_PART = ":function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}";
    var SPLICE_PART = ":function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}";
    var SWAP_PART = ":function\\(a,b\\)\\{var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}";
    var DECIPHER_REGEXP = `function(?: ${VARIABLE_PART})?\\(a\\)\\{a=a\\.split\\(""\\);\\s*((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)return a\\.join\\(""\\)\\}`;
    var HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${VARIABLE_PART_DEFINE}${REVERSE_PART}|${VARIABLE_PART_DEFINE}${SLICE_PART}|${VARIABLE_PART_DEFINE}${SPLICE_PART}|${VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;
    var SCVR = "[a-zA-Z0-9$_]";
    var FNR = `${SCVR}+`;
    var AAR = "\\[(\\d+)]";
    var N_TRANSFORM_NAME_REGEXPS = [
      // NewPipeExtractor regexps
      `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${SCVR}+\\.get\\(${SCVR}+\\)\\)&&\\(${SCVR}+=(${SCVR}+)\\[(\\d+)]`,
      `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${SCVR}+\\.get\\(${SCVR}+\\)\\).+\\|\\|(${SCVR}+)\\(""\\)`,
      `\\(${SCVR}=String\\.fromCharCode\\(110\\),${SCVR}=${SCVR}\\.get\\(${SCVR}\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
      `\\.get\\("n"\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
      // Skick regexps
      '(\\w+).length\\|\\|\\w+\\(""\\)',
      '\\w+.length\\|\\|(\\w+)\\(""\\)'
    ];
    var N_TRANSFORM_REGEXP = 'function\\(\\s*(\\w+)\\s*\\)\\s*\\{var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+](.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';
    var DECIPHER_ARGUMENT = "sig";
    var N_ARGUMENT = "ncode";
    var DECIPHER_FUNC_NAME = "YBDProjectDecipherFunc";
    var N_TRANSFORM_FUNC_NAME = "YBDProjectNTransformFunc";
    var SIGNATURE_TIMESTAMP_REGEX = /signatureTimestamp:(\d+)/g;
    var SHIM = Platform_1.Platform.getShim();
    var decipherWarning = false;
    var nTransformWarning = false;
    function matchRegex(regex, str) {
      const MATCH = str.match(new RegExp(regex, "s"));
      if (!MATCH) {
        throw new Error(`Could not match ${regex}`);
      }
      return MATCH;
    }
    __name(matchRegex, "matchRegex");
    function matchFirst(regex, str) {
      return matchRegex(regex, str)[0];
    }
    __name(matchFirst, "matchFirst");
    function matchGroup1(regex, str) {
      return matchRegex(regex, str)[1];
    }
    __name(matchGroup1, "matchGroup1");
    function getFunctionName(body, regexps) {
      let fn;
      for (const REGEX of regexps) {
        try {
          fn = matchGroup1(REGEX, body);
          try {
            fn = matchGroup1(`${fn.replace(/\$/g, "\\$")}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
          } catch (err) {
          }
          break;
        } catch (err) {
          continue;
        }
      }
      if (!fn || fn.includes("["))
        throw Error();
      return fn;
    }
    __name(getFunctionName, "getFunctionName");
    function getExtractFunctions(extractFunctions, body) {
      for (const extractFunction of extractFunctions) {
        try {
          const FUNC = extractFunction(body);
          if (!FUNC)
            continue;
          return FUNC;
        } catch {
          continue;
        }
      }
      return null;
    }
    __name(getExtractFunctions, "getExtractFunctions");
    function extractDecipherFunc(body) {
      try {
        const HELPER_OBJECT = matchFirst(HELPER_REGEXP, body), DECIPHER_FUNCTION = matchFirst(DECIPHER_REGEXP, body), RESULTS_FUNCTION = `var ${DECIPHER_FUNC_NAME}=${DECIPHER_FUNCTION};`, CALLER_FUNCTION = `${DECIPHER_FUNC_NAME}(${DECIPHER_ARGUMENT});`;
        return HELPER_OBJECT + RESULTS_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractDecipherFunc, "extractDecipherFunc");
    function extractDecipherWithName(body) {
      try {
        const DECIPHER_FUNCTION_NAME = getFunctionName(body, DECIPHER_NAME_REGEXPS), FUNC_PATTERN = `(${DECIPHER_FUNCTION_NAME.replace(/\$/g, "\\$")}function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`, DECIPHER_FUNCTION = `var ${matchGroup1(FUNC_PATTERN, body)};`, HELPER_OBJECT_NAME = matchGroup1(";([A-Za-z0-9_\\$]{2,})\\.\\w+\\(", DECIPHER_FUNCTION), HELPER_PATTERN = `(var ${HELPER_OBJECT_NAME.replace(/\$/g, "\\$")}=\\{[\\s\\S]+?\\}\\};)`, HELPER_OBJECT = matchGroup1(HELPER_PATTERN, body), CALLER_FUNCTION = `${DECIPHER_FUNC_NAME}(${DECIPHER_ARGUMENT});`;
        return HELPER_OBJECT + DECIPHER_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractDecipherWithName, "extractDecipherWithName");
    function extractNTransformFunc(body) {
      try {
        const N_FUNCTION = matchFirst(N_TRANSFORM_REGEXP, body), RESULTS_FUNCTION = `var ${N_TRANSFORM_FUNC_NAME}=${N_FUNCTION};`, CALLER_FUNCTION = `${N_TRANSFORM_FUNC_NAME}(${N_ARGUMENT});`;
        return RESULTS_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractNTransformFunc, "extractNTransformFunc");
    function extractNTransformWithName(body) {
      try {
        const N_FUNCTION_NAME = getFunctionName(body, N_TRANSFORM_NAME_REGEXPS), FUNCTION_PATTERN = `(${N_FUNCTION_NAME.replace(/\$/g, "\\$")}=\\s*function([\\S\\s]*?\\}\\s*return (([\\w$]+?\\.join\\(""\\))|(Array\\.prototype\\.join\\.call\\([\\w$]+?,[\\n\\s]*(("")|(\\("",""\\)))\\)))\\s*\\}))`, N_TRANSFORM_FUNCTION = `var ${matchGroup1(FUNCTION_PATTERN, body)};`, CALLER_FUNCTION = `${N_FUNCTION_NAME}(${N_ARGUMENT});`;
        return N_TRANSFORM_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractNTransformWithName, "extractNTransformWithName");
    function runInNewContext(code, contextObject = {}) {
      const CONTEXT_VARIABLE = Object.keys(contextObject).map((key) => `let ${key} = contextObject.${key};`).join("\n"), RESULTS_VARIABLE = "__result__", FULL_CODE = `
            ${CONTEXT_VARIABLE}
            ${RESULTS_VARIABLE} = (function() {${code}})();
        `;
      eval(FULL_CODE);
      return eval(RESULTS_VARIABLE);
    }
    __name(runInNewContext, "runInNewContext");
    function getDownloadURL(format, decipherFunction, nTransformFunction) {
      if (!decipherFunction) {
        return;
      }
      const decipher = /* @__PURE__ */ __name((url) => {
        var _a, _b;
        const SEARCH_PARAMS = new URLSearchParams(url), PARAMS_URL = ((_a = SEARCH_PARAMS.get("url")) == null ? void 0 : _a.toString()) || "";
        if (!SEARCH_PARAMS.get("s")) {
          return PARAMS_URL;
        }
        const COMPONENTS = new URL(decodeURIComponent(PARAMS_URL)), CONTEXT = {};
        CONTEXT[DECIPHER_ARGUMENT] = decodeURIComponent(PARAMS_URL);
        COMPONENTS.searchParams.set(((_b = SEARCH_PARAMS.get("sp")) == null ? void 0 : _b.toString()) || "sig", runInNewContext(decipherFunction, CONTEXT));
        return COMPONENTS.toString();
      }, "decipher"), nTransform = /* @__PURE__ */ __name((url) => {
        const COMPONENTS = new URL(decodeURIComponent(url)), N = COMPONENTS.searchParams.get("n");
        if (!N || !nTransformFunction) {
          return url;
        }
        const CONTEXT = {};
        CONTEXT[N_ARGUMENT] = N;
        COMPONENTS.searchParams.set("n", runInNewContext(nTransformFunction, CONTEXT));
        return COMPONENTS.toString();
      }, "nTransform"), CIPHER = !format.url, VIDEO_URL = format.url || format.signatureCipher || format.cipher;
      if (!VIDEO_URL) {
        return;
      }
      format.url = nTransform(CIPHER ? decipher(VIDEO_URL) : VIDEO_URL);
      delete format.signatureCipher;
      delete format.cipher;
    }
    __name(getDownloadURL, "getDownloadURL");
    var _Signature = class _Signature {
      constructor() {
        this.decipherFunction = null;
        this.nTransformFunction = null;
      }
      static getSignatureTimestamp(body) {
        const MATCH = body.match(SIGNATURE_TIMESTAMP_REGEX);
        if (MATCH) {
          return MATCH[0].split(":")[1];
        }
        return "0";
      }
      decipherFormats(formats) {
        const DECIPHERED_FORMATS = {};
        formats.forEach((format) => {
          if (!format) {
            return;
          }
          getDownloadURL(format, this.decipherFunction, this.nTransformFunction);
          DECIPHERED_FORMATS[format.url] = format;
        });
        return DECIPHERED_FORMATS;
      }
      getDecipherFunctions(playerId, body) {
        if (this.decipherFunction) {
          return this.decipherFunction;
        }
        const DECIPHER_FUNCTION = getExtractFunctions([extractDecipherWithName, extractDecipherFunc], body);
        if (!DECIPHER_FUNCTION && !decipherWarning) {
          Log_1.Logger.warning(`Could not parse decipher function.
Please report this issue with "${playerId}" in Issues at ${SHIM.info.issuesUrl}.
Stream URL will be missing.`);
          decipherWarning = true;
        }
        this.decipherFunction = DECIPHER_FUNCTION;
        return DECIPHER_FUNCTION;
      }
      getNTransform(playerId, body) {
        if (this.nTransformFunction) {
          return this.nTransformFunction;
        }
        const N_TRANSFORM_FUNCTION = getExtractFunctions([extractNTransformFunc, extractNTransformWithName], body);
        if (!N_TRANSFORM_FUNCTION && !nTransformWarning) {
          Log_1.Logger.warning(`Could not parse n transform function.
Please report this issue with "${playerId}" in Issues at ${SHIM.info.issuesUrl}.`);
          nTransformWarning = true;
        }
        this.nTransformFunction = N_TRANSFORM_FUNCTION;
        return N_TRANSFORM_FUNCTION;
      }
    };
    __name(_Signature, "Signature");
    var Signature = _Signature;
    exports.Signature = Signature;
  }
});

// package/core/Info/parser/Html5Player.js
var require_Html5Player = __commonJS({
  "package/core/Info/parser/Html5Player.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getHtml5Player = getHtml5Player;
    var Platform_13 = require_Platform();
    var Signature_1 = require_Signature();
    var Fetcher_1 = require_Fetcher();
    var Url_1 = require_Url();
    var Log_13 = require_Log();
    var FileCache2 = Platform_13.Platform.getShim().fileCache;
    function getPlayerId(body) {
      const MATCH = body.match(/player\\\/([a-zA-Z0-9]+)\\\//);
      if (MATCH) {
        return MATCH[1];
      }
      return null;
    }
    __name(getPlayerId, "getPlayerId");
    async function getHtml5Player(options) {
      const CACHE = await FileCache2.get("html5Player");
      if (CACHE && CACHE.playerUrl) {
        return {
          playerUrl: CACHE.playerUrl,
          signatureTimestamp: CACHE.signatureTimestamp,
          playerBody: CACHE.playerBody
        };
      }
      const IFRAME_API_BODY = await Fetcher_1.Fetcher.request(Url_1.Url.getIframeApiUrl(), options), PLAYER_ID = getPlayerId(IFRAME_API_BODY);
      let playerUrl = PLAYER_ID ? Url_1.Url.getPlayerJsUrl(PLAYER_ID) : null;
      if (!playerUrl && options.originalProxy) {
        Log_13.Logger.debug("Could not get html5Player using your own proxy. It is retrieved again with its own proxy disabled. (Other requests will not invalidate it.)");
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

// node_modules/sax/lib/sax.js
var require_sax = __commonJS({
  "node_modules/sax/lib/sax.js"(exports2) {
    (function(sax) {
      sax.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax.SAXParser = SAXParser;
      sax.SAXStream = SAXStream;
      sax.createStream = createStream;
      sax.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser = this;
        clearBuffers(parser);
        parser.q = parser.c = "";
        parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
        parser.opt = opt || {};
        parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
        parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser.tags = [];
        parser.closed = parser.closedRoot = parser.sawRoot = false;
        parser.tag = parser.error = null;
        parser.strict = !!strict;
        parser.noscript = !!(strict || parser.opt.noscript);
        parser.state = S.BEGIN;
        parser.strictEntities = parser.opt.strictEntities;
        parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
        parser.attribList = [];
        if (parser.opt.xmlns) {
          parser.ns = Object.create(rootNS);
        }
        if (parser.opt.unquotedAttributeValues === void 0) {
          parser.opt.unquotedAttributeValues = !strict;
        }
        parser.trackPosition = parser.opt.position !== false;
        if (parser.trackPosition) {
          parser.position = parser.line = parser.column = 0;
        }
        emit(parser, "onready");
      }
      __name(SAXParser, "SAXParser");
      if (!Object.create) {
        Object.create = function(o) {
          function F() {
          }
          __name(F, "F");
          F.prototype = o;
          var newf = new F();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
          return a;
        };
      }
      function checkBufferLength(parser) {
        var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i = 0, l = buffers.length; i < l; i++) {
          var len = parser[buffers[i]].length;
          if (len > maxAllowed) {
            switch (buffers[i]) {
              case "textNode":
                closeText(parser);
                break;
              case "cdata":
                emitNode(parser, "oncdata", parser.cdata);
                parser.cdata = "";
                break;
              case "script":
                emitNode(parser, "onscript", parser.script);
                parser.script = "";
                break;
              default:
                error(parser, "Max buffer length exceeded: " + buffers[i]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m = sax.MAX_BUFFER_LENGTH - maxActual;
        parser.bufferCheckPosition = m + parser.position;
      }
      __name(checkBufferLength, "checkBufferLength");
      function clearBuffers(parser) {
        for (var i = 0, l = buffers.length; i < l; i++) {
          parser[buffers[i]] = "";
        }
      }
      __name(clearBuffers, "clearBuffers");
      function flushBuffers(parser) {
        closeText(parser);
        if (parser.cdata !== "") {
          emitNode(parser, "oncdata", parser.cdata);
          parser.cdata = "";
        }
        if (parser.script !== "") {
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
      }
      __name(flushBuffers, "flushBuffers");
      SAXParser.prototype = {
        end: /* @__PURE__ */ __name(function() {
          end(this);
        }, "end"),
        write,
        resume: /* @__PURE__ */ __name(function() {
          this.error = null;
          return this;
        }, "resume"),
        close: /* @__PURE__ */ __name(function() {
          return this.write(null);
        }, "close"),
        flush: /* @__PURE__ */ __name(function() {
          flushBuffers(this);
        }, "flush")
      };
      var Stream;
      try {
        Stream = require("stream").Stream;
      } catch (ex) {
        Stream = /* @__PURE__ */ __name(function() {
        }, "Stream");
      }
      if (!Stream) Stream = /* @__PURE__ */ __name(function() {
      }, "Stream");
      var streamWraps = sax.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      __name(createStream, "createStream");
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er) {
          me.emit("error", er);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: /* @__PURE__ */ __name(function() {
              return me._parser["on" + ev];
            }, "get"),
            set: /* @__PURE__ */ __name(function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            }, "set"),
            enumerable: true,
            configurable: false
          });
        });
      }
      __name(SAXStream, "SAXStream");
      SAXStream.prototype = Object.create(Stream.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            var SD = require("string_decoder").StringDecoder;
            this._decoder = new SD("utf8");
          }
          data = this._decoder.write(data);
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream.prototype.on.call(me, ev, handler);
      };
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function isWhitespace(c) {
        return c === " " || c === "\n" || c === "\r" || c === "	";
      }
      __name(isWhitespace, "isWhitespace");
      function isQuote(c) {
        return c === '"' || c === "'";
      }
      __name(isQuote, "isQuote");
      function isAttribEnd(c) {
        return c === ">" || isWhitespace(c);
      }
      __name(isAttribEnd, "isAttribEnd");
      function isMatch(regex, c) {
        return regex.test(c);
      }
      __name(isMatch, "isMatch");
      function notMatch(regex, c) {
        return !isMatch(regex, c);
      }
      __name(notMatch, "notMatch");
      var S = 0;
      sax.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      };
      sax.XML_ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'"
      };
      sax.ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'",
        "AElig": 198,
        "Aacute": 193,
        "Acirc": 194,
        "Agrave": 192,
        "Aring": 197,
        "Atilde": 195,
        "Auml": 196,
        "Ccedil": 199,
        "ETH": 208,
        "Eacute": 201,
        "Ecirc": 202,
        "Egrave": 200,
        "Euml": 203,
        "Iacute": 205,
        "Icirc": 206,
        "Igrave": 204,
        "Iuml": 207,
        "Ntilde": 209,
        "Oacute": 211,
        "Ocirc": 212,
        "Ograve": 210,
        "Oslash": 216,
        "Otilde": 213,
        "Ouml": 214,
        "THORN": 222,
        "Uacute": 218,
        "Ucirc": 219,
        "Ugrave": 217,
        "Uuml": 220,
        "Yacute": 221,
        "aacute": 225,
        "acirc": 226,
        "aelig": 230,
        "agrave": 224,
        "aring": 229,
        "atilde": 227,
        "auml": 228,
        "ccedil": 231,
        "eacute": 233,
        "ecirc": 234,
        "egrave": 232,
        "eth": 240,
        "euml": 235,
        "iacute": 237,
        "icirc": 238,
        "igrave": 236,
        "iuml": 239,
        "ntilde": 241,
        "oacute": 243,
        "ocirc": 244,
        "ograve": 242,
        "oslash": 248,
        "otilde": 245,
        "ouml": 246,
        "szlig": 223,
        "thorn": 254,
        "uacute": 250,
        "ucirc": 251,
        "ugrave": 249,
        "uuml": 252,
        "yacute": 253,
        "yuml": 255,
        "copy": 169,
        "reg": 174,
        "nbsp": 160,
        "iexcl": 161,
        "cent": 162,
        "pound": 163,
        "curren": 164,
        "yen": 165,
        "brvbar": 166,
        "sect": 167,
        "uml": 168,
        "ordf": 170,
        "laquo": 171,
        "not": 172,
        "shy": 173,
        "macr": 175,
        "deg": 176,
        "plusmn": 177,
        "sup1": 185,
        "sup2": 178,
        "sup3": 179,
        "acute": 180,
        "micro": 181,
        "para": 182,
        "middot": 183,
        "cedil": 184,
        "ordm": 186,
        "raquo": 187,
        "frac14": 188,
        "frac12": 189,
        "frac34": 190,
        "iquest": 191,
        "times": 215,
        "divide": 247,
        "OElig": 338,
        "oelig": 339,
        "Scaron": 352,
        "scaron": 353,
        "Yuml": 376,
        "fnof": 402,
        "circ": 710,
        "tilde": 732,
        "Alpha": 913,
        "Beta": 914,
        "Gamma": 915,
        "Delta": 916,
        "Epsilon": 917,
        "Zeta": 918,
        "Eta": 919,
        "Theta": 920,
        "Iota": 921,
        "Kappa": 922,
        "Lambda": 923,
        "Mu": 924,
        "Nu": 925,
        "Xi": 926,
        "Omicron": 927,
        "Pi": 928,
        "Rho": 929,
        "Sigma": 931,
        "Tau": 932,
        "Upsilon": 933,
        "Phi": 934,
        "Chi": 935,
        "Psi": 936,
        "Omega": 937,
        "alpha": 945,
        "beta": 946,
        "gamma": 947,
        "delta": 948,
        "epsilon": 949,
        "zeta": 950,
        "eta": 951,
        "theta": 952,
        "iota": 953,
        "kappa": 954,
        "lambda": 955,
        "mu": 956,
        "nu": 957,
        "xi": 958,
        "omicron": 959,
        "pi": 960,
        "rho": 961,
        "sigmaf": 962,
        "sigma": 963,
        "tau": 964,
        "upsilon": 965,
        "phi": 966,
        "chi": 967,
        "psi": 968,
        "omega": 969,
        "thetasym": 977,
        "upsih": 978,
        "piv": 982,
        "ensp": 8194,
        "emsp": 8195,
        "thinsp": 8201,
        "zwnj": 8204,
        "zwj": 8205,
        "lrm": 8206,
        "rlm": 8207,
        "ndash": 8211,
        "mdash": 8212,
        "lsquo": 8216,
        "rsquo": 8217,
        "sbquo": 8218,
        "ldquo": 8220,
        "rdquo": 8221,
        "bdquo": 8222,
        "dagger": 8224,
        "Dagger": 8225,
        "bull": 8226,
        "hellip": 8230,
        "permil": 8240,
        "prime": 8242,
        "Prime": 8243,
        "lsaquo": 8249,
        "rsaquo": 8250,
        "oline": 8254,
        "frasl": 8260,
        "euro": 8364,
        "image": 8465,
        "weierp": 8472,
        "real": 8476,
        "trade": 8482,
        "alefsym": 8501,
        "larr": 8592,
        "uarr": 8593,
        "rarr": 8594,
        "darr": 8595,
        "harr": 8596,
        "crarr": 8629,
        "lArr": 8656,
        "uArr": 8657,
        "rArr": 8658,
        "dArr": 8659,
        "hArr": 8660,
        "forall": 8704,
        "part": 8706,
        "exist": 8707,
        "empty": 8709,
        "nabla": 8711,
        "isin": 8712,
        "notin": 8713,
        "ni": 8715,
        "prod": 8719,
        "sum": 8721,
        "minus": 8722,
        "lowast": 8727,
        "radic": 8730,
        "prop": 8733,
        "infin": 8734,
        "ang": 8736,
        "and": 8743,
        "or": 8744,
        "cap": 8745,
        "cup": 8746,
        "int": 8747,
        "there4": 8756,
        "sim": 8764,
        "cong": 8773,
        "asymp": 8776,
        "ne": 8800,
        "equiv": 8801,
        "le": 8804,
        "ge": 8805,
        "sub": 8834,
        "sup": 8835,
        "nsub": 8836,
        "sube": 8838,
        "supe": 8839,
        "oplus": 8853,
        "otimes": 8855,
        "perp": 8869,
        "sdot": 8901,
        "lceil": 8968,
        "rceil": 8969,
        "lfloor": 8970,
        "rfloor": 8971,
        "lang": 9001,
        "rang": 9002,
        "loz": 9674,
        "spades": 9824,
        "clubs": 9827,
        "hearts": 9829,
        "diams": 9830
      };
      Object.keys(sax.ENTITIES).forEach(function(key) {
        var e = sax.ENTITIES[key];
        var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
        sax.ENTITIES[key] = s2;
      });
      for (var s in sax.STATE) {
        sax.STATE[sax.STATE[s]] = s;
      }
      S = sax.STATE;
      function emit(parser, event, data) {
        parser[event] && parser[event](data);
      }
      __name(emit, "emit");
      function emitNode(parser, nodeType, data) {
        if (parser.textNode) closeText(parser);
        emit(parser, nodeType, data);
      }
      __name(emitNode, "emitNode");
      function closeText(parser) {
        parser.textNode = textopts(parser.opt, parser.textNode);
        if (parser.textNode) emit(parser, "ontext", parser.textNode);
        parser.textNode = "";
      }
      __name(closeText, "closeText");
      function textopts(opt, text) {
        if (opt.trim) text = text.trim();
        if (opt.normalize) text = text.replace(/\s+/g, " ");
        return text;
      }
      __name(textopts, "textopts");
      function error(parser, er) {
        closeText(parser);
        if (parser.trackPosition) {
          er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
        }
        er = new Error(er);
        parser.error = er;
        emit(parser, "onerror", er);
        return parser;
      }
      __name(error, "error");
      function end(parser) {
        if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
        if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
          error(parser, "Unexpected end");
        }
        closeText(parser);
        parser.c = "";
        parser.closed = true;
        emit(parser, "onend");
        SAXParser.call(parser, parser.strict, parser.opt);
        return parser;
      }
      __name(end, "end");
      function strictFail(parser, message) {
        if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser.strict) {
          error(parser, message);
        }
      }
      __name(strictFail, "strictFail");
      function newTag(parser) {
        if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
        var parent = parser.tags[parser.tags.length - 1] || parser;
        var tag = parser.tag = { name: parser.tagName, attributes: {} };
        if (parser.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser.attribList.length = 0;
        emitNode(parser, "onopentagstart", tag);
      }
      __name(newTag, "newTag");
      function qname(name, attribute) {
        var i = name.indexOf(":");
        var qualName = i < 0 ? ["", name] : name.split(":");
        var prefix = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix = "xmlns";
          local = "";
        }
        return { prefix, local };
      }
      __name(qname, "qname");
      function attrib(parser) {
        if (!parser.strict) {
          parser.attribName = parser.attribName[parser.looseCase]();
        }
        if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
          parser.attribName = parser.attribValue = "";
          return;
        }
        if (parser.opt.xmlns) {
          var qn = qname(parser.attribName, true);
          var prefix = qn.prefix;
          var local = qn.local;
          if (prefix === "xmlns") {
            if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else {
              var tag = parser.tag;
              var parent = parser.tags[parser.tags.length - 1] || parser;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser.attribValue;
            }
          }
          parser.attribList.push([parser.attribName, parser.attribValue]);
        } else {
          parser.tag.attributes[parser.attribName] = parser.attribValue;
          emitNode(parser, "onattribute", {
            name: parser.attribName,
            value: parser.attribValue
          });
        }
        parser.attribName = parser.attribValue = "";
      }
      __name(attrib, "attrib");
      function openTag(parser, selfClosing) {
        if (parser.opt.xmlns) {
          var tag = parser.tag;
          var qn = qname(parser.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
            tag.uri = qn.prefix;
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i = 0, l = parser.attribList.length; i < l; i++) {
            var nv = parser.attribList[i];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix = qualName.prefix;
            var local = qualName.local;
            var uri = prefix === "" ? "" : tag.ns[prefix] || "";
            var a = {
              name,
              value,
              prefix,
              local,
              uri
            };
            if (prefix && prefix !== "xmlns" && !uri) {
              strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
              a.uri = prefix;
            }
            parser.tag.attributes[name] = a;
            emitNode(parser, "onattribute", a);
          }
          parser.attribList.length = 0;
        }
        parser.tag.isSelfClosing = !!selfClosing;
        parser.sawRoot = true;
        parser.tags.push(parser.tag);
        emitNode(parser, "onopentag", parser.tag);
        if (!selfClosing) {
          if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
            parser.state = S.SCRIPT;
          } else {
            parser.state = S.TEXT;
          }
          parser.tag = null;
          parser.tagName = "";
        }
        parser.attribName = parser.attribValue = "";
        parser.attribList.length = 0;
      }
      __name(openTag, "openTag");
      function closeTag(parser) {
        if (!parser.tagName) {
          strictFail(parser, "Weird empty close tag.");
          parser.textNode += "</>";
          parser.state = S.TEXT;
          return;
        }
        if (parser.script) {
          if (parser.tagName !== "script") {
            parser.script += "</" + parser.tagName + ">";
            parser.tagName = "";
            parser.state = S.SCRIPT;
            return;
          }
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
        var t = parser.tags.length;
        var tagName = parser.tagName;
        if (!parser.strict) {
          tagName = tagName[parser.looseCase]();
        }
        var closeTo = tagName;
        while (t--) {
          var close = parser.tags[t];
          if (close.name !== closeTo) {
            strictFail(parser, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t < 0) {
          strictFail(parser, "Unmatched closing tag: " + parser.tagName);
          parser.textNode += "</" + parser.tagName + ">";
          parser.state = S.TEXT;
          return;
        }
        parser.tagName = tagName;
        var s2 = parser.tags.length;
        while (s2-- > t) {
          var tag = parser.tag = parser.tags.pop();
          parser.tagName = parser.tag.name;
          emitNode(parser, "onclosetag", parser.tagName);
          var x = {};
          for (var i in tag.ns) {
            x[i] = tag.ns[i];
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (parser.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t === 0) parser.closedRoot = true;
        parser.tagName = parser.attribValue = parser.attribName = "";
        parser.attribList.length = 0;
        parser.state = S.TEXT;
      }
      __name(closeTag, "closeTag");
      function parseEntity(parser) {
        var entity = parser.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser.ENTITIES[entity]) {
          return parser.ENTITIES[entity];
        }
        if (parser.ENTITIES[entityLC]) {
          return parser.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (isNaN(num) || numStr.toLowerCase() !== entity) {
          strictFail(parser, "Invalid character entity");
          return "&" + parser.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      __name(parseEntity, "parseEntity");
      function beginWhiteSpace(parser, c) {
        if (c === "<") {
          parser.state = S.OPEN_WAKA;
          parser.startTagPosition = parser.position;
        } else if (!isWhitespace(c)) {
          strictFail(parser, "Non-whitespace before first tag.");
          parser.textNode = c;
          parser.state = S.TEXT;
        }
      }
      __name(beginWhiteSpace, "beginWhiteSpace");
      function charAt(chunk, i) {
        var result = "";
        if (i < chunk.length) {
          result = chunk.charAt(i);
        }
        return result;
      }
      __name(charAt, "charAt");
      function write(chunk) {
        var parser = this;
        if (this.error) {
          throw this.error;
        }
        if (parser.closed) {
          return error(
            parser,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i++);
          parser.c = c;
          if (!c) {
            break;
          }
          if (parser.trackPosition) {
            parser.position++;
            if (c === "\n") {
              parser.line++;
              parser.column = 0;
            } else {
              parser.column++;
            }
          }
          switch (parser.state) {
            case S.BEGIN:
              parser.state = S.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser, c);
              continue;
            case S.BEGIN_WHITESPACE:
              beginWhiteSpace(parser, c);
              continue;
            case S.TEXT:
              if (parser.sawRoot && !parser.closedRoot) {
                var starti = i - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i++);
                  if (c && parser.trackPosition) {
                    parser.position++;
                    if (c === "\n") {
                      parser.line++;
                      parser.column = 0;
                    } else {
                      parser.column++;
                    }
                  }
                }
                parser.textNode += chunk.substring(starti, i - 1);
              }
              if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else {
                if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                  strictFail(parser, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser.state = S.TEXT_ENTITY;
                } else {
                  parser.textNode += c;
                }
              }
              continue;
            case S.SCRIPT:
              if (c === "<") {
                parser.state = S.SCRIPT_ENDING;
              } else {
                parser.script += c;
              }
              continue;
            case S.SCRIPT_ENDING:
              if (c === "/") {
                parser.state = S.CLOSE_TAG;
              } else {
                parser.script += "<" + c;
                parser.state = S.SCRIPT;
              }
              continue;
            case S.OPEN_WAKA:
              if (c === "!") {
                parser.state = S.SGML_DECL;
                parser.sgmlDecl = "";
              } else if (isWhitespace(c)) {
              } else if (isMatch(nameStart, c)) {
                parser.state = S.OPEN_TAG;
                parser.tagName = c;
              } else if (c === "/") {
                parser.state = S.CLOSE_TAG;
                parser.tagName = "";
              } else if (c === "?") {
                parser.state = S.PROC_INST;
                parser.procInstName = parser.procInstBody = "";
              } else {
                strictFail(parser, "Unencoded <");
                if (parser.startTagPosition + 1 < parser.position) {
                  var pad = parser.position - parser.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser.textNode += "<" + c;
                parser.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if (parser.sgmlDecl + c === "--") {
                parser.state = S.COMMENT;
                parser.comment = "";
                parser.sgmlDecl = "";
                continue;
              }
              if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
                parser.state = S.DOCTYPE_DTD;
                parser.doctype += "<!" + parser.sgmlDecl + c;
                parser.sgmlDecl = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser, "onopencdata");
                parser.state = S.CDATA;
                parser.sgmlDecl = "";
                parser.cdata = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser.state = S.DOCTYPE;
                if (parser.doctype || parser.sawRoot) {
                  strictFail(
                    parser,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser.doctype = "";
                parser.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                parser.sgmlDecl = "";
                parser.state = S.TEXT;
              } else if (isQuote(c)) {
                parser.state = S.SGML_DECL_QUOTED;
                parser.sgmlDecl += c;
              } else {
                parser.sgmlDecl += c;
              }
              continue;
            case S.SGML_DECL_QUOTED:
              if (c === parser.q) {
                parser.state = S.SGML_DECL;
                parser.q = "";
              }
              parser.sgmlDecl += c;
              continue;
            case S.DOCTYPE:
              if (c === ">") {
                parser.state = S.TEXT;
                emitNode(parser, "ondoctype", parser.doctype);
                parser.doctype = true;
              } else {
                parser.doctype += c;
                if (c === "[") {
                  parser.state = S.DOCTYPE_DTD;
                } else if (isQuote(c)) {
                  parser.state = S.DOCTYPE_QUOTED;
                  parser.q = c;
                }
              }
              continue;
            case S.DOCTYPE_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.q = "";
                parser.state = S.DOCTYPE;
              }
              continue;
            case S.DOCTYPE_DTD:
              if (c === "]") {
                parser.doctype += c;
                parser.state = S.DOCTYPE;
              } else if (c === "<") {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else if (isQuote(c)) {
                parser.doctype += c;
                parser.state = S.DOCTYPE_DTD_QUOTED;
                parser.q = c;
              } else {
                parser.doctype += c;
              }
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.state = S.DOCTYPE_DTD;
                parser.q = "";
              }
              continue;
            case S.COMMENT:
              if (c === "-") {
                parser.state = S.COMMENT_ENDING;
              } else {
                parser.comment += c;
              }
              continue;
            case S.COMMENT_ENDING:
              if (c === "-") {
                parser.state = S.COMMENT_ENDED;
                parser.comment = textopts(parser.opt, parser.comment);
                if (parser.comment) {
                  emitNode(parser, "oncomment", parser.comment);
                }
                parser.comment = "";
              } else {
                parser.comment += "-" + c;
                parser.state = S.COMMENT;
              }
              continue;
            case S.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser, "Malformed comment");
                parser.comment += "--" + c;
                parser.state = S.COMMENT;
              } else if (parser.doctype && parser.doctype !== true) {
                parser.state = S.DOCTYPE_DTD;
              } else {
                parser.state = S.TEXT;
              }
              continue;
            case S.CDATA:
              if (c === "]") {
                parser.state = S.CDATA_ENDING;
              } else {
                parser.cdata += c;
              }
              continue;
            case S.CDATA_ENDING:
              if (c === "]") {
                parser.state = S.CDATA_ENDING_2;
              } else {
                parser.cdata += "]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.CDATA_ENDING_2:
              if (c === ">") {
                if (parser.cdata) {
                  emitNode(parser, "oncdata", parser.cdata);
                }
                emitNode(parser, "onclosecdata");
                parser.cdata = "";
                parser.state = S.TEXT;
              } else if (c === "]") {
                parser.cdata += "]";
              } else {
                parser.cdata += "]]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.PROC_INST:
              if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else if (isWhitespace(c)) {
                parser.state = S.PROC_INST_BODY;
              } else {
                parser.procInstName += c;
              }
              continue;
            case S.PROC_INST_BODY:
              if (!parser.procInstBody && isWhitespace(c)) {
                continue;
              } else if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else {
                parser.procInstBody += c;
              }
              continue;
            case S.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser, "onprocessinginstruction", {
                  name: parser.procInstName,
                  body: parser.procInstBody
                });
                parser.procInstName = parser.procInstBody = "";
                parser.state = S.TEXT;
              } else {
                parser.procInstBody += "?" + c;
                parser.state = S.PROC_INST_BODY;
              }
              continue;
            case S.OPEN_TAG:
              if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else {
                newTag(parser);
                if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser, "Invalid character in tag name");
                  }
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser, true);
                closeTag(parser);
              } else {
                strictFail(parser, "Forward-slash in opening tag not followed by >");
                parser.state = S.ATTRIB;
              }
              continue;
            case S.ATTRIB:
              if (isWhitespace(c)) {
                continue;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser, "Attribute without value");
                parser.attribValue = parser.attribName;
                attrib(parser);
                openTag(parser);
              } else if (isWhitespace(c)) {
                parser.state = S.ATTRIB_NAME_SAW_WHITE;
              } else if (isMatch(nameBody, c)) {
                parser.attribName += c;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (isWhitespace(c)) {
                continue;
              } else {
                strictFail(parser, "Attribute without value");
                parser.tag.attributes[parser.attribName] = "";
                parser.attribValue = "";
                emitNode(parser, "onattribute", {
                  name: parser.attribName,
                  value: ""
                });
                parser.attribName = "";
                if (c === ">") {
                  openTag(parser);
                } else if (isMatch(nameStart, c)) {
                  parser.attribName = c;
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.ATTRIB_VALUE:
              if (isWhitespace(c)) {
                continue;
              } else if (isQuote(c)) {
                parser.q = c;
                parser.state = S.ATTRIB_VALUE_QUOTED;
              } else {
                if (!parser.opt.unquotedAttributeValues) {
                  error(parser, "Unquoted attribute value");
                }
                parser.state = S.ATTRIB_VALUE_UNQUOTED;
                parser.attribValue = c;
              }
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (c !== parser.q) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              parser.q = "";
              parser.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              if (isWhitespace(c)) {
                parser.state = S.ATTRIB;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                strictFail(parser, "No whitespace between attributes");
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              if (c === ">") {
                openTag(parser);
              } else {
                parser.state = S.ATTRIB;
              }
              continue;
            case S.CLOSE_TAG:
              if (!parser.tagName) {
                if (isWhitespace(c)) {
                  continue;
                } else if (notMatch(nameStart, c)) {
                  if (parser.script) {
                    parser.script += "</" + c;
                    parser.state = S.SCRIPT;
                  } else {
                    strictFail(parser, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser);
              } else if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else if (parser.script) {
                parser.script += "</" + parser.tagName;
                parser.tagName = "";
                parser.state = S.SCRIPT;
              } else {
                if (!isWhitespace(c)) {
                  strictFail(parser, "Invalid tagname in closing tag");
                }
                parser.state = S.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser);
              } else {
                strictFail(parser, "Invalid characters in closing tag");
              }
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser.state) {
                case S.TEXT_ENTITY:
                  returnState = S.TEXT;
                  buffer = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  returnState = S.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                var parsedEntity = parseEntity(parser);
                if (parser.opt.unparsedEntities && !Object.values(sax.XML_ENTITIES).includes(parsedEntity)) {
                  parser.entity = "";
                  parser.state = returnState;
                  parser.write(parsedEntity);
                } else {
                  parser[buffer] += parsedEntity;
                  parser.entity = "";
                  parser.state = returnState;
                }
              } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                parser.entity += c;
              } else {
                strictFail(parser, "Invalid character in entity name");
                parser[buffer] += "&" + parser.entity + c;
                parser.entity = "";
                parser.state = returnState;
              }
              continue;
            default: {
              throw new Error(parser, "Unknown state: " + parser.state);
            }
          }
        }
        if (parser.position >= parser.bufferCheckPosition) {
          checkBufferLength(parser);
        }
        return parser;
      }
      __name(write, "write");
      if (!String.fromCodePoint) {
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = /* @__PURE__ */ __name(function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          }, "fromCodePoint");
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(typeof exports2 === "undefined" ? exports2.sax = {} : exports2);
  }
});

// package/core/Info/parser/Formats.js
var require_Formats = __commonJS({
  "package/core/Info/parser/Formats.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FormatParser = void 0;
    var sax_1 = __importDefault2(require_sax());
    var Fetcher_1 = require_Fetcher();
    var Url_1 = require_Url();
    var _FormatParser = class _FormatParser {
      static parseFormats(playerResponse) {
        let formats = [];
        if (playerResponse && playerResponse.streamingData) {
          formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
        }
        return formats;
      }
      static async getM3U8(url, options) {
        const _URL = new URL(url, Url_1.Url.getBaseUrl()), BODY = await Fetcher_1.Fetcher.request(_URL.toString(), options), FORMATS = {};
        BODY.split("\n").filter((line) => /^https?:\/\//.test(line)).forEach((line) => {
          const MATCH = line.match(/\/itag\/(\d+)\//) || [], ITAG = parseInt(MATCH[1]);
          FORMATS[line] = { itag: ITAG, url: line };
        });
        return FORMATS;
      }
      static getDashManifest(url, options) {
        return new Promise((resolve, reject) => {
          const PARSER = sax_1.default.parser(false), FORMATS = {};
          PARSER.onerror = reject;
          let adaptationSet = null;
          PARSER.onopentag = (node) => {
            const ATTRIBUTES = node.attributes;
            if (node.name === "ADAPTATIONSET") {
              adaptationSet = ATTRIBUTES;
            } else if (node.name === "REPRESENTATION") {
              const ITAG = parseInt(ATTRIBUTES.ID);
              if (!isNaN(ITAG)) {
                const SOURCE = (() => {
                  if (node.attributes.HEIGHT) {
                    return {
                      width: parseInt(ATTRIBUTES.WIDTH),
                      height: parseInt(ATTRIBUTES.HEIGHT),
                      fps: parseInt(ATTRIBUTES.FRAMERATE)
                    };
                  } else {
                    return {
                      audioSampleRate: ATTRIBUTES.AUDIOSAMPLINGRATE
                    };
                  }
                })();
                FORMATS[url] = Object.assign({
                  itag: ITAG,
                  url,
                  bitrate: parseInt(ATTRIBUTES.BANDWIDTH),
                  mimeType: `${adaptationSet.MIMETYPE}; codecs="${ATTRIBUTES.CODECS}"`
                }, SOURCE);
                Object.assign;
              }
            }
          };
          PARSER.onend = () => {
            resolve(FORMATS);
          };
          Fetcher_1.Fetcher.request(new URL(url, Url_1.Url.getBaseUrl()).toString(), options).then((res) => {
            PARSER.write(res);
            PARSER.close();
          }).catch(reject);
        });
      }
      static parseAdditionalManifests(playerResponse, options) {
        const STREAMING_DATA = playerResponse && playerResponse.streamingData, MANIFESTS = [];
        if (STREAMING_DATA) {
          if (STREAMING_DATA.dashManifestUrl) {
            MANIFESTS.push(this.getDashManifest(STREAMING_DATA.dashManifestUrl, options));
          }
          if (STREAMING_DATA.hlsManifestUrl) {
            MANIFESTS.push(this.getM3U8(STREAMING_DATA.hlsManifestUrl, options));
          }
        }
        return MANIFESTS;
      }
    };
    __name(_FormatParser, "FormatParser");
    var FormatParser = _FormatParser;
    exports2.FormatParser = FormatParser;
  }
});

// package/core/Info/apis/Base.js
var require_Base2 = __commonJS({
  "package/core/Info/apis/Base.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Log_13 = require_Log();
    var _ApiBase = class _ApiBase {
      static checkResponse(res, client) {
        var _a, _b, _c;
        try {
          if (res.status === "fulfilled") {
            if (res.value === null) {
              return null;
            }
            Log_13.Logger.debug(`[ ${client} ]: <success>Success</success>`);
            return Object.assign({}, res.value);
          } else {
            const REASON = res.reason || {};
            Log_13.Logger.debug(`[ ${client} ]: <error>Error</error>
Reason: ${((_a = REASON.error) == null ? void 0 : _a.message) || ((_b = REASON.error) == null ? void 0 : _b.toString())}`);
            return REASON;
          }
        } catch (err) {
          return (_c = res || {}) == null ? void 0 : _c.reason;
        }
      }
    };
    __name(_ApiBase, "ApiBase");
    var ApiBase = _ApiBase;
    exports2.default = ApiBase;
  }
});

// package/core/Info/apis/Player.js
var require_Player = __commonJS({
  "package/core/Info/apis/Player.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var CLIENTS_NUMBER;
    (function(CLIENTS_NUMBER2) {
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["WEB"] = 0] = "WEB";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["WEBCREATOR"] = 1] = "WEBCREATOR";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["WEBEMBEDDED"] = 2] = "WEBEMBEDDED";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["TVEMBEDDED"] = 3] = "TVEMBEDDED";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["IOS"] = 4] = "IOS";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["ANDROID"] = 5] = "ANDROID";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["MWEB"] = 6] = "MWEB";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["TV"] = 7] = "TV";
    })(CLIENTS_NUMBER || (CLIENTS_NUMBER = {}));
    var clients_1 = require_clients();
    var errors_1 = require_errors();
    var Log_13 = require_Log();
    var Base_1 = __importDefault2(require_Base2());
    var CONTINUES_NOT_POSSIBLE_ERRORS = ["This video is private"];
    var _PlayerApi = class _PlayerApi {
      static async getApiResponses(playerApiParams, clients) {
        var _a, _b;
        const PLAYER_API_PROMISE = {
          web: clients.includes("web") ? clients_1.Web.getPlayerResponse(playerApiParams) : Promise.reject(null),
          webCreator: clients.includes("webCreator") ? clients_1.WebCreator.getPlayerResponse(playerApiParams) : Promise.reject(null),
          webEmbedded: clients.includes("webEmbedded") ? clients_1.WebEmbedded.getPlayerResponse(playerApiParams) : Promise.reject(null),
          tvEmbedded: clients.includes("tvEmbedded") ? clients_1.TvEmbedded.getPlayerResponse(playerApiParams) : Promise.reject(null),
          ios: clients.includes("ios") ? clients_1.Ios.getPlayerResponse(playerApiParams) : Promise.reject(null),
          android: clients.includes("android") ? clients_1.Android.getPlayerResponse(playerApiParams) : Promise.reject(null),
          mweb: clients.includes("mweb") ? clients_1.MWeb.getPlayerResponse(playerApiParams) : Promise.reject(null),
          tv: clients.includes("tv") ? clients_1.Tv.getPlayerResponse(playerApiParams) : Promise.reject(null)
        }, PLAYER_API_PROMISES = await Promise.allSettled(Object.values(PLAYER_API_PROMISE)), PLAYER_API_RESPONSES = {
          web: null,
          webCreator: null,
          webEmbedded: null,
          tvEmbedded: null,
          ios: null,
          android: null,
          mweb: null,
          tv: null
        };
        clients.forEach((client) => {
          var _a2;
          const CLIENT_NUMBER = client.toUpperCase();
          PLAYER_API_RESPONSES[client] = ((_a2 = Base_1.default.checkResponse(PLAYER_API_PROMISES[CLIENTS_NUMBER[CLIENT_NUMBER]], client)) == null ? void 0 : _a2.contents) || null;
        });
        const IS_MINIMUM_MODE = PLAYER_API_PROMISES.every((r) => r.status === "rejected");
        if (IS_MINIMUM_MODE) {
          const ERROR_TEXT = `All player APIs responded with an error. (Clients: ${clients.join(", ")})
For details, specify \`logDisplay: ["debug", "info", "success", "warning", "error"]\` in the constructor options of the YtdlCore class.`;
          if (PLAYER_API_RESPONSES.ios && (CONTINUES_NOT_POSSIBLE_ERRORS.includes(((_a = PLAYER_API_RESPONSES.ios) == null ? void 0 : _a.playabilityStatus.reason) || "") || !PLAYER_API_RESPONSES.ios.videoDetails)) {
            throw new errors_1.UnrecoverableError(ERROR_TEXT + `
Note: This error cannot continue processing. (Details: ${JSON.stringify(PLAYER_API_RESPONSES.ios.playabilityStatus.reason)})`);
          }
          if (!PLAYER_API_RESPONSES.web) {
            Log_13.Logger.info("As a fallback to obtain the minimum information, the web client is forced to adapt.");
            const WEB_CLIENT_PROMISE = (await Promise.allSettled([clients_1.Web.getPlayerResponse(playerApiParams)]))[0];
            PLAYER_API_RESPONSES.web = ((_b = Base_1.default.checkResponse(WEB_CLIENT_PROMISE, "web")) == null ? void 0 : _b.contents) || null;
          }
          Log_13.Logger.error(ERROR_TEXT);
          Log_13.Logger.info("Only minimal information is available, as information from the Player API is not available.");
        }
        return {
          isMinimalMode: IS_MINIMUM_MODE,
          responses: PLAYER_API_RESPONSES
        };
      }
    };
    __name(_PlayerApi, "PlayerApi");
    var PlayerApi = _PlayerApi;
    exports2.default = PlayerApi;
  }
});

// package/core/Info/apis/Next.js
var require_Next = __commonJS({
  "package/core/Info/apis/Next.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var clients_1 = require_clients();
    var Base_1 = __importDefault2(require_Base2());
    var _NextApi = class _NextApi {
      static async getApiResponses(nextApiParams) {
        var _a;
        const NEXT_API_PROMISE = {
          web: clients_1.Web.getNextResponse(nextApiParams)
        }, NEXT_API_PROMISES = await Promise.allSettled(Object.values(NEXT_API_PROMISE)), NEXT_API_RESPONSES = {
          web: ((_a = Base_1.default.checkResponse(NEXT_API_PROMISES[0], "web")) == null ? void 0 : _a.contents) || null
        };
        return NEXT_API_RESPONSES;
      }
    };
    __name(_NextApi, "NextApi");
    var NextApi = _NextApi;
    exports2.default = NextApi;
  }
});

// package/core/Info/Extras.js
var require_Extras = __commonJS({
  "package/core/Info/Extras.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Url_1 = require_Url();
    var Utils_1 = __importDefault2(require_Utils());
    var Log_13 = require_Log();
    var NUMBER_FORMAT = /^\d+$/;
    var TIME_FORMAT = /^(?:(?:(\d+):)?(\d{1,2}):)?(\d{1,2})(?:\.(\d{3}))?$/;
    var TIME_IN_ENG_FORMAT = /(-?\d+)(ms|s|m|h)/g;
    var TIME_UNITS = {
      ms: 1,
      s: 1e3,
      m: 6e4,
      h: 36e5
    };
    function parseTimestamp(time) {
      if (typeof time === "number") {
        return time;
      }
      if (NUMBER_FORMAT.test(time)) {
        return +time;
      }
      const PARSED_FORMAT = TIME_FORMAT.exec(time);
      if (PARSED_FORMAT) {
        return +(PARSED_FORMAT[1] || 0) * TIME_UNITS.h + +(PARSED_FORMAT[2] || 0) * TIME_UNITS.m + +PARSED_FORMAT[3] * TIME_UNITS.s + +(PARSED_FORMAT[4] || 0);
      } else {
        let total = 0;
        for (const PARSED of time.matchAll(TIME_IN_ENG_FORMAT)) {
          total += +PARSED[1] * TIME_UNITS[PARSED[2]];
        }
        return total;
      }
    }
    __name(parseTimestamp, "parseTimestamp");
    function getText(obj) {
      if (obj && obj.runs) {
        return obj.runs[0].text;
      } else if (obj) {
        return obj.simpleText;
      }
      return "";
    }
    __name(getText, "getText");
    function isVerified(badges) {
      return !!(badges && badges.find((b) => b.metadataBadgeRenderer.tooltip === "Verified"));
    }
    __name(isVerified, "isVerified");
    function getRelativeTime(date, locale = "en") {
      const NOW = /* @__PURE__ */ new Date(), SECONDS_AGO = Math.floor((NOW.getTime() - date.getTime()) / 1e3), RTF = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
      if (SECONDS_AGO < 60) {
        return RTF.format(-SECONDS_AGO, "second");
      } else if (SECONDS_AGO < 3600) {
        return RTF.format(-Math.floor(SECONDS_AGO / 60), "minute");
      } else if (SECONDS_AGO < 86400) {
        return RTF.format(-Math.floor(SECONDS_AGO / 3600), "hour");
      } else if (SECONDS_AGO < 2592e3) {
        return RTF.format(-Math.floor(SECONDS_AGO / 86400), "day");
      } else if (SECONDS_AGO < 31536e3) {
        return RTF.format(-Math.floor(SECONDS_AGO / 2592e3), "month");
      } else {
        return RTF.format(-Math.floor(SECONDS_AGO / 31536e3), "year");
      }
    }
    __name(getRelativeTime, "getRelativeTime");
    function parseRelatedVideo(details, lang) {
      if (!details) {
        return null;
      }
      try {
        let viewCount = getText(details.viewCountText), shortViewCount = getText(details.shortViewCountText);
        if (!/^\d/.test(shortViewCount)) {
          shortViewCount = "";
        }
        viewCount = (/^\d/.test(viewCount) ? viewCount : shortViewCount).split(" ")[0];
        const FORMATTER = new Intl.NumberFormat(lang, {
          notation: "compact"
        }), BROWSE_ENDPOINT = details.shortBylineText.runs[0].navigationEndpoint.browseEndpoint, CHANNEL_ID = BROWSE_ENDPOINT.browseId, NAME = getText(details.shortBylineText), USER = (BROWSE_ENDPOINT.canonicalBaseUrl || "").split("/").slice(-1)[0], PUBLISHED_TEXT = getText(details.publishedTimeText), SHORT_VIEW_COUNT_TEXT = shortViewCount.split(" ")[0], VIDEO = {
          id: details.videoId,
          title: getText(details.title),
          published: PUBLISHED_TEXT || null,
          author: {
            id: CHANNEL_ID,
            name: NAME,
            user: USER,
            channelUrl: `https://www.youtube.com/channel/${CHANNEL_ID}`,
            userUrl: `https://www.youtube.com/user/${USER}`,
            thumbnails: details.channelThumbnail.thumbnails.map((thumbnail) => {
              thumbnail.url = new URL(thumbnail.url, Url_1.Url.getBaseUrl()).toString();
              return thumbnail;
            }),
            subscriberCount: null,
            verified: isVerified(details.ownerBadges || [])
          },
          shortViewCountText: lang === "en" ? SHORT_VIEW_COUNT_TEXT : FORMATTER.format(parseStringToNumber(SHORT_VIEW_COUNT_TEXT)),
          viewCount: parseInt(viewCount.replace(/,/g, "")),
          lengthSeconds: details.lengthText ? Math.floor(parseTimestamp(getText(details.lengthText)) / 1e3) : null,
          thumbnails: details.thumbnail.thumbnails || [],
          richThumbnails: details.richThumbnail ? details.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails.thumbnails : [],
          isLive: !!(details.badges && details.badges.find((b) => b.metadataBadgeRenderer.label === "LIVE NOW"))
        };
        Utils_1.default.deprecate(VIDEO, "author_thumbnail", VIDEO.author.thumbnails[0].url, "relatedVideo.author_thumbnail", "relatedVideo.author.thumbnails[0].url");
        Utils_1.default.deprecate(VIDEO, "video_thumbnail", VIDEO.thumbnails[0].url, "relatedVideo.video_thumbnail", "relatedVideo.thumbnails[0].url");
        return VIDEO;
      } catch (err) {
        Log_13.Logger.debug(`<error>Failed</error> to parse related video (ID: ${(details == null ? void 0 : details.videoId) || "Unknown"}): <error>${err}</error>`);
        return null;
      }
    }
    __name(parseRelatedVideo, "parseRelatedVideo");
    function parseStringToNumber(input) {
      const SUFFIX = input.slice(-1).toUpperCase(), VALUE = parseFloat(input.slice(0, -1));
      switch (SUFFIX) {
        case "K":
          return VALUE * 1e3;
        case "M":
          return VALUE * 1e6;
        case "B":
          return VALUE * 1e9;
        default:
          return parseFloat(input);
      }
    }
    __name(parseStringToNumber, "parseStringToNumber");
    var _InfoExtras = class _InfoExtras {
      static getMedia(info) {
        var _a;
        if (!info) {
          return null;
        }
        let media = {
          category: "",
          categoryUrl: "",
          thumbnails: []
        }, microformat = null;
        try {
          microformat = ((_a = info.microformat) == null ? void 0 : _a.playerMicroformatRenderer) || null;
        } catch (err) {
        }
        if (!microformat) {
          return null;
        }
        try {
          media.category = microformat.category;
          media.thumbnails = microformat.thumbnail.thumbnails || [];
          if (media.category === "Music") {
            media.categoryUrl = Url_1.Url.getBaseUrl() + "/music";
          } else if (media.category === "Gaming") {
            media.categoryUrl = Url_1.Url.getBaseUrl() + "/gaming";
          }
        } catch (err) {
        }
        return media;
      }
      static getAuthor(info) {
        var _a;
        if (!info) {
          return null;
        }
        let channelName = null, channelId = null, user = null, thumbnails = [], subscriberCount = null, verified = false, videoSecondaryInfoRenderer = null;
        try {
          const VIDEO_SECONDARY_INFO_RENDERER = info.contents.twoColumnWatchNextResults.results.results.contents.find((c) => c.videoSecondaryInfoRenderer);
          videoSecondaryInfoRenderer = VIDEO_SECONDARY_INFO_RENDERER == null ? void 0 : VIDEO_SECONDARY_INFO_RENDERER.videoSecondaryInfoRenderer;
        } catch (err) {
        }
        if (!videoSecondaryInfoRenderer || !videoSecondaryInfoRenderer.owner) {
          return null;
        }
        try {
          const VIDEO_OWNER_RENDERER = videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
          channelName = VIDEO_OWNER_RENDERER.title.runs[0].text || null;
          channelId = VIDEO_OWNER_RENDERER.navigationEndpoint.browseEndpoint.browseId || null;
          user = VIDEO_OWNER_RENDERER.navigationEndpoint.browseEndpoint.canonicalBaseUrl.replace("/", "") || null;
          thumbnails = VIDEO_OWNER_RENDERER.thumbnail.thumbnails || [];
          subscriberCount = Math.floor(parseStringToNumber(VIDEO_OWNER_RENDERER.subscriberCountText.simpleText.split(" ")[0])) || null;
          verified = isVerified(VIDEO_OWNER_RENDERER.badges || []);
        } catch (err) {
        }
        try {
          const AUTHOR = {
            id: channelId || "",
            name: channelName || "",
            user: user || "",
            channelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            externalChannelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            userUrl: "https://www.youtube.com" + user,
            thumbnails,
            subscriberCount,
            verified
          };
          if (thumbnails == null ? void 0 : thumbnails.length) {
            Utils_1.default.deprecate(AUTHOR, "avatar", (_a = AUTHOR.thumbnails[0]) == null ? void 0 : _a.url, "author.thumbnails", "author.thumbnails[0].url");
          }
          return AUTHOR;
        } catch (err) {
          return null;
        }
      }
      static getAuthorFromPlayerResponse(info) {
        var _a, _b, _c, _d;
        let channelName = null, channelId = null, user = null, thumbnails = [], subscriberCount = null, verified = false, microformat = null, endscreen = null;
        try {
          microformat = ((_a = info.microformat) == null ? void 0 : _a.playerMicroformatRenderer) || null;
          endscreen = (_c = (_b = info.endscreen) == null ? void 0 : _b.endscreenRenderer.elements.find((e) => e.endscreenElementRenderer.style === "CHANNEL")) == null ? void 0 : _c.endscreenElementRenderer;
        } catch (err) {
        }
        if (!microformat) {
          return null;
        }
        try {
          channelName = microformat.ownerChannelName || null;
          channelId = microformat.externalChannelId;
          user = "@" + (microformat.ownerProfileUrl || "").split("@")[1];
          thumbnails = endscreen.image.thumbnails || [];
          subscriberCount = null;
          verified = false;
        } catch (err) {
        }
        try {
          const AUTHOR = {
            id: channelId || "",
            name: channelName || "",
            user: user || "",
            channelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            externalChannelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            userUrl: "https://www.youtube.com/" + user,
            thumbnails,
            subscriberCount,
            verified
          };
          if (thumbnails == null ? void 0 : thumbnails.length) {
            Utils_1.default.deprecate(AUTHOR, "avatar", (_d = AUTHOR.thumbnails[0]) == null ? void 0 : _d.url, "author.thumbnails", "author.thumbnails[0].url");
          }
          return AUTHOR;
        } catch (err) {
          return null;
        }
      }
      static getLikes(info) {
        if (!info) {
          return null;
        }
        try {
          const CONTENTS = info.contents.twoColumnWatchNextResults.results.results.contents, VIDEO = CONTENTS.find((r) => r.videoPrimaryInfoRenderer), BUTTONS = VIDEO.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons, BUTTON_VIEW_MODEL = BUTTONS.filter((b) => b.segmentedLikeDislikeButtonViewModel)[0].segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel.toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel.buttonViewModel, ACCESSIBILITY_TEXT = BUTTON_VIEW_MODEL.accessibilityText, TITLE = BUTTON_VIEW_MODEL.title;
          if (ACCESSIBILITY_TEXT) {
            const MATCH = ACCESSIBILITY_TEXT.match(/[\d,.]+/) || [];
            return parseInt((MATCH[0] || "").replace(/\D+/g, ""));
          } else if (TITLE) {
            return parseStringToNumber(TITLE);
          }
          return null;
        } catch (err) {
          return null;
        }
      }
      static getRelatedVideos(info, lang) {
        if (!info) {
          return [];
        }
        let secondaryResults = [];
        try {
          secondaryResults = info.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results;
        } catch (err) {
        }
        const VIDEOS = [];
        for (const RESULT of secondaryResults) {
          const DETAILS = RESULT.compactVideoRenderer;
          if (DETAILS) {
            const VIDEO = parseRelatedVideo(DETAILS, lang);
            if (VIDEO) {
              VIDEOS.push(VIDEO);
            }
          } else {
            const AUTOPLAY = RESULT.compactAutoplayRenderer || RESULT.itemSectionRenderer;
            if (!AUTOPLAY || !Array.isArray(AUTOPLAY.contents)) {
              continue;
            }
            for (const CONTENT of AUTOPLAY.contents) {
              const VIDEO = parseRelatedVideo(CONTENT.compactVideoRenderer, lang);
              if (VIDEO) {
                VIDEOS.push(VIDEO);
              }
            }
          }
        }
        return VIDEOS;
      }
      static cleanVideoDetails(videoDetails, microformat, lang = "en") {
        const DETAILS = videoDetails;
        if (DETAILS.thumbnail) {
          DETAILS.thumbnails = DETAILS.thumbnail.thumbnails;
          delete DETAILS.thumbnail;
          Utils_1.default.deprecate(DETAILS, "thumbnail", { thumbnails: DETAILS.thumbnails }, "DETAILS.thumbnail.thumbnails", "DETAILS.thumbnails");
        }
        const DESCRIPTION = DETAILS.shortDescription || getText(DETAILS.description);
        if (DESCRIPTION) {
          DETAILS.description = DESCRIPTION;
          delete DETAILS.shortDescription;
          Utils_1.default.deprecate(DETAILS, "shortDescription", DETAILS.description, "DETAILS.shortDescription", "DETAILS.description");
        }
        if (microformat) {
          DETAILS.lengthSeconds = parseInt(microformat.lengthSeconds || videoDetails.lengthSeconds.toString());
          DETAILS.publishDate = microformat.publishDate || videoDetails.publishDate || null;
          DETAILS.published = null;
          try {
            if (DETAILS.publishDate) {
              DETAILS.published = getRelativeTime(new Date(DETAILS.publishDate), lang) || null;
            }
          } catch {
          }
        }
        if (DETAILS.lengthSeconds) {
          DETAILS.lengthSeconds = parseInt(DETAILS.lengthSeconds);
        }
        if (DETAILS.viewCount) {
          DETAILS.viewCount = parseInt(DETAILS.viewCount);
        }
        return DETAILS;
      }
      static getStoryboards(info) {
        if (!info) {
          return [];
        }
        const PARTS = info.storyboards && info.storyboards.playerStoryboardSpecRenderer && info.storyboards.playerStoryboardSpecRenderer.spec && info.storyboards.playerStoryboardSpecRenderer.spec.split("|");
        if (!PARTS) {
          return [];
        }
        const _URL = new URL(PARTS.shift() || "");
        return PARTS.map((part, i) => {
          let [thumbnailWidth, thumbnailHeight, thumbnailCount, columns, rows, interval, nameReplacement, sigh] = part.split("#");
          _URL.searchParams.set("sigh", sigh);
          thumbnailCount = parseInt(thumbnailCount, 10);
          columns = parseInt(columns, 10);
          rows = parseInt(rows, 10);
          const STORYBOARD_COUNT = Math.ceil(thumbnailCount / (columns * rows));
          return {
            templateUrl: _URL.toString().replace("$L", i.toString()).replace("$N", nameReplacement),
            thumbnailWidth: parseInt(thumbnailWidth, 10),
            thumbnailHeight: parseInt(thumbnailHeight, 10),
            thumbnailCount,
            interval: parseInt(interval, 10),
            columns,
            rows,
            storyboardCount: STORYBOARD_COUNT
          };
        });
      }
      static getChapters(info) {
        if (!info) {
          return [];
        }
        const PLAYER_OVERLAY_RENDERER = info.playerOverlays && info.playerOverlays.playerOverlayRenderer, PLAYER_BAR = PLAYER_OVERLAY_RENDERER && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar, MARKERS_MAP = PLAYER_BAR && PLAYER_BAR.multiMarkersPlayerBarRenderer && PLAYER_BAR.multiMarkersPlayerBarRenderer.markersMap, MARKER = Array.isArray(MARKERS_MAP) && MARKERS_MAP.find((m) => m.value && Array.isArray(m.value.chapters));
        if (!MARKER) {
          return [];
        }
        const CHAPTERS = MARKER.value.chapters;
        return CHAPTERS.map((chapter) => {
          return {
            title: getText(chapter.chapterRenderer.title),
            startTime: chapter.chapterRenderer.timeRangeStartMillis / 1e3
          };
        });
      }
    };
    __name(_InfoExtras, "InfoExtras");
    var InfoExtras = _InfoExtras;
    exports2.default = InfoExtras;
  }
});

// package/core/Info/BasicInfo.js
var require_BasicInfo = __commonJS({
  "package/core/Info/BasicInfo.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2._getBasicInfo = _getBasicInfo;
    exports2.getBasicInfo = getBasicInfo;
    var OAuth2_1 = require_OAuth2();
    var Platform_13 = require_Platform();
    var Log_13 = require_Log();
    var Utils_1 = __importDefault2(require_Utils());
    var Url_1 = require_Url();
    var Html5Player_1 = require_Html5Player();
    var Formats_1 = require_Formats();
    var Player_1 = __importDefault2(require_Player());
    var Next_1 = __importDefault2(require_Next());
    var Extras_1 = __importDefault2(require_Extras());
    var AGE_RESTRICTED_URLS = ["support.google.com/youtube/?p=age_restrictions", "youtube.com/t/community_guidelines"];
    var SUPPORTED_CLIENTS = ["web", "webCreator", "webEmbedded", "ios", "android", "mweb", "tv", "tvEmbedded"];
    var BASE_CLIENTS = ["web", "webCreator", "tvEmbedded", "ios", "android"];
    var _SHIM = Platform_13.Platform.getShim();
    var CACHE = _SHIM.cache;
    var BASE_INFO = {
      videoDetails: {
        videoUrl: "",
        videoId: "",
        title: "",
        author: null,
        lengthSeconds: 0,
        viewCount: 0,
        likes: null,
        media: null,
        storyboards: [],
        chapters: [],
        thumbnails: [],
        description: null,
        keywords: [],
        channelId: "",
        ageRestricted: false,
        allowRatings: false,
        isOwnerViewing: false,
        isCrawlable: false,
        isPrivate: false,
        isUnpluggedCorpus: false,
        isLiveContent: false,
        isUpcoming: false,
        liveBroadcastDetails: {
          isLiveNow: false,
          startTimestamp: ""
        },
        published: null,
        publishDate: null
      },
      relatedVideos: [],
      formats: [],
      full: false,
      _metadata: {
        isMinimumMode: false,
        clients: [],
        html5Player: "",
        id: "",
        options: {}
      },
      _ytdl: {
        version: _SHIM.info.version
      }
    };
    var BASE_INFO_STRING = JSON.stringify(BASE_INFO);
    function setupClients(clients, disableDefaultClients) {
      if (clients && clients.length === 0) {
        Log_13.Logger.warning("At least one client must be specified.");
        clients = BASE_CLIENTS;
      }
      clients = clients.filter((client) => SUPPORTED_CLIENTS.includes(client));
      if (disableDefaultClients) {
        return clients;
      }
      return [.../* @__PURE__ */ new Set([...BASE_CLIENTS, ...clients])];
    }
    __name(setupClients, "setupClients");
    async function _getBasicInfo(id, options, isFromGetInfo) {
      var _a, _b, _c, _d;
      const SHIM2 = Platform_13.Platform.getShim(), HTML5_PLAYER_PROMISE = (0, Html5Player_1.getHtml5Player)(options);
      if (options.oauth2 && options.oauth2 instanceof OAuth2_1.OAuth2 && options.oauth2.shouldRefreshToken()) {
        Log_13.Logger.info("The specified OAuth2 token has expired and will be renewed automatically.");
        await options.oauth2.refreshAccessToken();
      }
      if (!options.poToken && !options.disablePoTokenAutoGeneration) {
        const { poToken, visitorData } = await SHIM2.poToken();
        options.poToken = poToken;
        options.visitorData = visitorData;
      }
      if (options.poToken && !options.visitorData) {
        Log_13.Logger.warning("If you specify a poToken, you must also specify the visitorData.");
      }
      options.clients = setupClients(options.clients || BASE_CLIENTS, options.disableDefaultClients ?? false);
      const HTML5_PLAYER_RESPONSE = await HTML5_PLAYER_PROMISE, HTML5_PLAYER_URL = HTML5_PLAYER_RESPONSE.playerUrl;
      if (!HTML5_PLAYER_URL) {
        throw new Error(`HTML5Player was not found, please report it via Issues (${SHIM2.info.issuesUrl}).`);
      }
      const SIGNATURE_TIMESTAMP = parseInt(HTML5_PLAYER_RESPONSE.signatureTimestamp || "0") || 0, PLAYER_API_PARAMS = {
        videoId: id,
        signatureTimestamp: SIGNATURE_TIMESTAMP,
        options
      }, VIDEO_INFO = JSON.parse(BASE_INFO_STRING);
      const PROMISES = {
        playerApiRequest: Player_1.default.getApiResponses(PLAYER_API_PARAMS, options.clients),
        nextApiRequest: Next_1.default.getApiResponses(PLAYER_API_PARAMS)
      }, { isMinimalMode, responses: PLAYER_RESPONSES } = await PROMISES.playerApiRequest, NEXT_RESPONSES = await PROMISES.nextApiRequest, PLAYER_RESPONSE_LIST = Object.values(PLAYER_RESPONSES) || [];
      VIDEO_INFO._metadata.isMinimumMode = isMinimalMode;
      VIDEO_INFO._metadata.html5Player = HTML5_PLAYER_URL;
      VIDEO_INFO._metadata.clients = options.clients;
      VIDEO_INFO._metadata.options = options;
      VIDEO_INFO._metadata.id = id;
      if (options.includesPlayerAPIResponse || isFromGetInfo) {
        VIDEO_INFO._playerApiResponses = PLAYER_RESPONSES;
      }
      if (options.includesNextAPIResponse || isFromGetInfo) {
        VIDEO_INFO._nextApiResponses = NEXT_RESPONSES;
      }
      const INCLUDE_STORYBOARDS = PLAYER_RESPONSE_LIST.filter((p) => p == null ? void 0 : p.storyboards)[0], VIDEO_DETAILS = ((_a = PLAYER_RESPONSE_LIST.filter((p) => p == null ? void 0 : p.videoDetails)[0]) == null ? void 0 : _a.videoDetails) || {}, MICROFORMAT = ((_b = PLAYER_RESPONSE_LIST.filter((p) => p == null ? void 0 : p.microformat)[0]) == null ? void 0 : _b.microformat) || null, LIVE_BROADCAST_DETAILS = ((_d = (_c = PLAYER_RESPONSES.web) == null ? void 0 : _c.microformat) == null ? void 0 : _d.playerMicroformatRenderer.liveBroadcastDetails) || null;
      const STORYBOARDS = Extras_1.default.getStoryboards(INCLUDE_STORYBOARDS), MEDIA = Extras_1.default.getMedia(PLAYER_RESPONSES.web) || Extras_1.default.getMedia(PLAYER_RESPONSES.webCreator) || Extras_1.default.getMedia(PLAYER_RESPONSES.ios) || Extras_1.default.getMedia(PLAYER_RESPONSES.android) || Extras_1.default.getMedia(PLAYER_RESPONSES.webEmbedded) || Extras_1.default.getMedia(PLAYER_RESPONSES.tvEmbedded) || Extras_1.default.getMedia(PLAYER_RESPONSES.mweb) || Extras_1.default.getMedia(PLAYER_RESPONSES.tv), AGE_RESTRICTED = !!MEDIA && AGE_RESTRICTED_URLS.some((url) => Object.values(MEDIA || {}).some((v) => typeof v === "string" && v.includes(url))), ADDITIONAL_DATA = {
        videoUrl: Url_1.Url.getWatchPageUrl(id),
        author: Extras_1.default.getAuthor(NEXT_RESPONSES.web),
        media: MEDIA,
        likes: Extras_1.default.getLikes(NEXT_RESPONSES.web),
        ageRestricted: AGE_RESTRICTED,
        storyboards: STORYBOARDS,
        chapters: Extras_1.default.getChapters(NEXT_RESPONSES.web),
        thumbnails: [],
        description: ""
      }, FORMATS = PLAYER_RESPONSE_LIST.reduce((items, playerResponse) => {
        return [...items, ...Formats_1.FormatParser.parseFormats(playerResponse)];
      }, []);
      VIDEO_INFO.videoDetails = Extras_1.default.cleanVideoDetails(Object.assign(VIDEO_INFO.videoDetails, VIDEO_DETAILS, ADDITIONAL_DATA), (MICROFORMAT == null ? void 0 : MICROFORMAT.playerMicroformatRenderer) || null, options.hl);
      VIDEO_INFO.videoDetails.liveBroadcastDetails = LIVE_BROADCAST_DETAILS;
      VIDEO_INFO.relatedVideos = options.includesRelatedVideo ? Extras_1.default.getRelatedVideos(NEXT_RESPONSES.web, options.hl || "en") : [];
      VIDEO_INFO.formats = isFromGetInfo ? FORMATS : [];
      return VIDEO_INFO;
    }
    __name(_getBasicInfo, "_getBasicInfo");
    async function getBasicInfo(link, options) {
      Utils_1.default.checkForUpdates();
      const ID = Url_1.Url.getVideoID(link) || (Url_1.Url.validateID(link) ? link : null);
      if (!ID) {
        throw new Error("The URL specified is not a valid URL.");
      }
      const CACHE_KEY = ["getBasicInfo", ID, options.hl, options.gl].join("-");
      if (await CACHE.has(CACHE_KEY)) {
        return CACHE.get(CACHE_KEY);
      }
      try {
        const RESULTS = await _getBasicInfo(ID, options, false);
        CACHE.set(CACHE_KEY, RESULTS, {
          ttl: 60 * 30
          //30Min
        });
        return RESULTS;
      } catch (err) {
        throw err;
      }
    }
    __name(getBasicInfo, "getBasicInfo");
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

// package/core/Info/FullInfo.js
var require_FullInfo = __commonJS({
  "package/core/Info/FullInfo.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getFullInfo = getFullInfo;
    var Signature_1 = require_Signature();
    var Platform_13 = require_Platform();
    var Utils_1 = __importDefault2(require_Utils());
    var Url_1 = require_Url();
    var Format_1 = require_Format();
    var Formats_1 = require_Formats();
    var BasicInfo_1 = require_BasicInfo();
    var CACHE = Platform_13.Platform.getShim().cache;
    var SIGNATURE = new Signature_1.Signature();
    async function getFullInfo(link, options) {
      Utils_1.default.checkForUpdates();
      const ID = Url_1.Url.getVideoID(link) || (Url_1.Url.validateID(link) ? link : null);
      if (!ID) {
        throw new Error("The URL specified is not a valid URL.");
      }
      const CACHE_KEY = ["getFullInfo", ID, options.hl, options.gl].join("-");
      if (await CACHE.has(CACHE_KEY)) {
        return CACHE.get(CACHE_KEY);
      }
      throw new Error("AAAAAAAAAAAAAAA");
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

// package/YtdlCore.js
var require_YtdlCore = __commonJS({
  "package/YtdlCore.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.YtdlCore = void 0;
    var Platform_13 = require_Platform();
    var Download_1 = require_Download2();
    var Info_1 = require_Info();
    var Html5Player_1 = require_Html5Player();
    var OAuth2_1 = require_OAuth2();
    var Url_1 = require_Url();
    var Format_1 = require_Format();
    var Constants_12 = require_Constants();
    var Log_13 = require_Log();
    var FileCache2 = Platform_13.Platform.getShim().fileCache;
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
          Log_13.Logger.debug("PoToken loaded from cache.");
          this.poToken = PO_TOKEN_CACHE || void 0;
        }
        FileCache2.set("poToken", this.poToken || "", { ttl: 60 * 60 * 24 });
      }
      async setVisitorData(visitorData) {
        const VISITOR_DATA_CACHE = await FileCache2.get("visitorData");
        if (visitorData) {
          this.visitorData = visitorData;
        } else if (VISITOR_DATA_CACHE) {
          Log_13.Logger.debug("VisitorData loaded from cache.");
          this.visitorData = VISITOR_DATA_CACHE || void 0;
        }
        FileCache2.set("visitorData", this.visitorData || "", { ttl: 60 * 60 * 24 });
      }
      async setOAuth2(oauth2Credentials) {
        const OAUTH2_CACHE = await FileCache2.get("oauth2") || void 0;
        try {
          if (oauth2Credentials) {
            this.oauth2 = new OAuth2_1.OAuth2(oauth2Credentials) || void 0;
          } else if (OAUTH2_CACHE) {
            this.oauth2 = new OAuth2_1.OAuth2(OAUTH2_CACHE);
          } else {
            this.oauth2 = null;
          }
        } catch {
          this.oauth2 = null;
        }
      }
      automaticallyGeneratePoToken() {
        if (!this.poToken && !this.visitorData) {
          Log_13.Logger.debug("Since PoToken and VisitorData are not specified, they are generated automatically.");
          const generatePoToken = Platform_13.Platform.getShim().poToken;
          generatePoToken().then(({ poToken, visitorData }) => {
            this.poToken = poToken;
            this.visitorData = visitorData;
            FileCache2.set("poToken", this.poToken || "", { ttl: 60 * 60 * 24 });
            FileCache2.set("visitorData", this.visitorData || "", { ttl: 60 * 60 * 24 });
          }).catch(() => {
          });
        }
      }
      initializeHtml5PlayerCache() {
        const HTML5_PLAYER = FileCache2.get("html5Player");
        if (!HTML5_PLAYER) {
          Log_13.Logger.debug("To speed up processing, html5Player and signatureTimestamp are pre-fetched and cached.");
          (0, Html5Player_1.getHtml5Player)({});
        }
      }
      constructor({ hl, gl, rewriteRequest, poToken, disablePoTokenAutoGeneration, visitorData, includesPlayerAPIResponse, includesNextAPIResponse, includesOriginalFormatData, includesRelatedVideo, clients, disableDefaultClients, oauth2Credentials, parsesHLSFormat, originalProxy, quality, filter, excludingClients, includingClients, range, begin, liveBuffer, highWaterMark, IPv6Block, dlChunkSize, disableFileCache, fetcher, logDisplay } = {}) {
        this.hl = "en";
        this.gl = "US";
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
        Log_13.Logger.logDisplay = logDisplay || ["info", "success", "warning", "error"];
        if (fetcher) {
          const SHIM2 = Platform_13.Platform.getShim();
          SHIM2.fetcher = fetcher;
          SHIM2.requestRelated.originalProxy = originalProxy;
          SHIM2.requestRelated.rewriteRequest = rewriteRequest;
          Platform_13.Platform.load(SHIM2);
        }
        if (disableFileCache) {
          FileCache2.disable();
        }
        this.hl = hl || "en";
        this.gl = gl || "US";
        this.rewriteRequest = rewriteRequest || void 0;
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
          Log_13.Logger.debug(`<debug>"${this.originalProxy.base}"</debug> is used for <blue>API requests</blue>.`);
          Log_13.Logger.debug(`<debug>"${this.originalProxy.download}"</debug> is used for <blue>video downloads</blue>.`);
          Log_13.Logger.debug(`The query name <debug>"${this.originalProxy.urlQueryName || "url"}"</debug> is used to specify the URL in the request. <blue>(?url=...)</blue>`);
        }
        this.setPoToken(poToken);
        this.setVisitorData(visitorData);
        this.setOAuth2(oauth2Credentials || null);
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
        INTERNAL_OPTIONS.rewriteRequest = options.rewriteRequest || this.rewriteRequest;
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
          Log_13.Logger.warning("The OAuth2 token should be specified when instantiating the YtdlCore class, not as a function argument.");
          INTERNAL_OPTIONS.oauth2 = new OAuth2_1.OAuth2(options.oauth2Credentials);
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
var require_Player2 = __commonJS({
  "package/types/YouTube/Player.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/YouTube/Next.js
var require_Next2 = __commonJS({
  "package/types/YouTube/Next.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// package/types/YouTube/Formats.js
var require_Formats2 = __commonJS({
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
    __exportStar2(require_Player2(), exports2);
    __exportStar2(require_Next2(), exports2);
    __exportStar2(require_Formats2(), exports2);
  }
});

// package/types/Clients.js
var require_Clients2 = __commonJS({
  "package/types/Clients.js"(exports2) {
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
    __exportStar2(require_Clients2(), exports2);
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
var Platform_12 = require_Platform();
var Classes_1 = require_Classes();
var Constants_1 = require_Constants();
var Log_12 = require_Log();
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
      Log_12.Logger.debug(`[ FileCache ]: Cache key <blue>"${cacheName}"</blue> was available.`);
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
      Log_12.Logger.debug(`[ FileCache ]: <blue>"${cacheName}"</blue> is not cached by the _YTDL_DISABLE_FILE_CACHE option.`);
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
      Log_12.Logger.debug(`[ FileCache ]: <success>"${cacheName}"</success> is cached.`);
      return true;
    } catch (err) {
      Log_12.Logger.error(`Failed to cache ${cacheName}.
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
      Log_12.Logger.debug(`[ FileCache ]: Cache key <blue>"${cacheName}"</blue> was deleted.`);
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
Platform_12.Platform.load({
  runtime: "default",
  server: true,
  cache: new Classes_1.CacheWithMap(),
  fileCache: new FileCache(),
  fetcher: fetch,
  poToken: /* @__PURE__ */ __name(() => {
    return new Promise((resolve) => {
      resolve({
        poToken: "",
        visitorData: ""
      });
    });
  }, "poToken"),
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
    }
  },
  requestRelated: {
    rewriteRequest: /* @__PURE__ */ __name((url, options) => {
      return { url, options };
    }, "rewriteRequest"),
    originalProxy: null
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
/*! Bundled license information:

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)
*/
