"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadOptionsUtils = void 0;
const Agent_1 = require("../core/Agent");
const Log_1 = require("./Log");
const UserAgents_1 = require("./UserAgents");
const Utils_1 = require("./Utils");
const IP_1 = require("./IP");
let oldCookieWarning = true, oldDispatcherWarning = true, oldLocalAddressWarning = true, oldIpRotationsWarning = true;
class DownloadOptionsUtils {
    static applyDefaultAgent(options) {
        if (!options.agent) {
            const { jar } = Agent_1.Agent.defaultAgent, COOKIE = (0, Utils_1.getPropInsensitive)(options?.requestOptions?.headers, 'cookie');
            if (COOKIE) {
                jar.removeAllCookiesSync();
                Agent_1.Agent.addCookiesFromString(jar, COOKIE);
                if (oldCookieWarning) {
                    oldCookieWarning = false;
                    Log_1.Logger.warning('Using old cookie format, please use the new one instead. (https://github.com/ybd-project/ytdl-core#cookies-support)');
                }
            }
            if (options.requestOptions?.dispatcher && oldDispatcherWarning) {
                oldDispatcherWarning = false;
                Log_1.Logger.warning('Your dispatcher is overridden by `ytdl.Agent`. To implement your own, check out the documentation. (https://github.com/ybd-project/ytdl-core#how-to-implement-ytdlagent-with-your-own-dispatcher)');
            }
            options.agent = Agent_1.Agent.defaultAgent;
        }
    }
    static applyOldLocalAddress(options) {
        const REQUEST_OPTION_LOCAL_ADDRESS = options.requestOptions.localAddress;
        if (!options.requestOptions || !REQUEST_OPTION_LOCAL_ADDRESS || REQUEST_OPTION_LOCAL_ADDRESS === options.agent?.localAddress) {
            return;
        }
        options.agent = Agent_1.Agent.createAgent(undefined, {
            localAddress: REQUEST_OPTION_LOCAL_ADDRESS,
        });
        if (oldLocalAddressWarning) {
            oldLocalAddressWarning = false;
            Log_1.Logger.warning('Using old localAddress option, please add it to the agent options instead. (https://github.com/ybd-project/ytdl-core#ip-rotation)');
        }
    }
    static applyIPv6Rotations(options) {
        if (options.IPv6Block) {
            options.requestOptions = Object.assign({}, options.requestOptions, {
                localAddress: IP_1.IP.getRandomIPv6(options.IPv6Block),
            });
            if (oldIpRotationsWarning) {
                oldIpRotationsWarning = false;
                oldLocalAddressWarning = false;
                Log_1.Logger.warning('IPv6Block option is deprecated, ' + 'please create your own ip rotation instead. (https://github.com/ybd-project/ytdl-core#ip-rotation)');
            }
        }
    }
    static applyDefaultHeaders(options) {
        options.requestOptions = Object.assign({}, options.requestOptions);
        options.requestOptions.headers = Object.assign({}, {
            'User-Agent': UserAgents_1.UserAgent.default,
        }, options.requestOptions.headers);
    }
}
exports.DownloadOptionsUtils = DownloadOptionsUtils;
//# sourceMappingURL=DownloadOptions.js.map