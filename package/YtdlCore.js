"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtdlCore = void 0;
const Platform_1 = require("./platforms/Platform");
const Download_1 = require("./core/Download");
const Info_1 = require("./core/Info");
const Html5Player_1 = require("./core/Info/parser/Html5Player");
const Agent_1 = require("./core/Agent");
const OAuth2_1 = require("./core/OAuth2");
const PoToken_1 = require("./core/PoToken");
const Url_1 = require("./utils/Url");
const Format_1 = require("./utils/Format");
const Constants_1 = require("./utils/Constants");
const Log_1 = require("./utils/Log");
const FileCache = Platform_1.Platform.getShim().fileCache;
function isNodeVersionOk(version) {
    return parseInt(version.replace('v', '').split('.')[0]) >= 16;
}
class YtdlCore {
    /* Setup */
    async setPoToken(poToken) {
        const PO_TOKEN_CACHE = await FileCache.get('poToken');
        if (poToken) {
            this.poToken = poToken;
        }
        else if (PO_TOKEN_CACHE) {
            Log_1.Logger.debug('PoToken loaded from cache.');
            this.poToken = PO_TOKEN_CACHE || undefined;
        }
        FileCache.set('poToken', this.poToken || '', { ttl: 60 * 60 * 24 * 365 });
    }
    async setVisitorData(visitorData) {
        const VISITOR_DATA_CACHE = await FileCache.get('visitorData');
        if (visitorData) {
            this.visitorData = visitorData;
        }
        else if (VISITOR_DATA_CACHE) {
            Log_1.Logger.debug('VisitorData loaded from cache.');
            this.visitorData = VISITOR_DATA_CACHE || undefined;
        }
        FileCache.set('visitorData', this.visitorData || '', { ttl: 60 * 60 * 24 * 365 });
    }
    async setOAuth2(oauth2Credentials, proxyOptions) {
        const OAUTH2_CACHE = (await FileCache.get('oauth2')) || undefined;
        try {
            if (oauth2Credentials) {
                this.oauth2 = new OAuth2_1.OAuth2(oauth2Credentials, proxyOptions) || undefined;
            }
            else if (OAUTH2_CACHE) {
                this.oauth2 = new OAuth2_1.OAuth2(OAUTH2_CACHE, proxyOptions);
            }
            else {
                this.oauth2 = null;
            }
        }
        catch {
            this.oauth2 = null;
        }
    }
    automaticallyGeneratePoToken() {
        if (!this.poToken && !this.visitorData) {
            Log_1.Logger.info('Since PoToken and VisitorData are not specified, they are generated automatically.');
            PoToken_1.PoToken.generatePoToken()
                .then(({ poToken, visitorData }) => {
                this.poToken = poToken;
                this.visitorData = visitorData;
                FileCache.set('poToken', this.poToken || '', { ttl: 60 * 60 * 24 * 365 });
                FileCache.set('visitorData', this.visitorData || '', { ttl: 60 * 60 * 24 * 365 });
            })
                .catch(() => { });
        }
    }
    initializeHtml5PlayerCache() {
        const HTML5_PLAYER = FileCache.get('html5Player');
        if (!HTML5_PLAYER) {
            Log_1.Logger.debug('To speed up processing, html5Player and signatureTimestamp are pre-fetched and cached.');
            (0, Html5Player_1.getHtml5Player)({});
        }
    }
    constructor({ hl, gl, requestOptions, rewriteRequest, agent, poToken, disablePoTokenAutoGeneration, visitorData, includesPlayerAPIResponse, includesNextAPIResponse, includesOriginalFormatData, includesRelatedVideo, clients, disableDefaultClients, oauth2Credentials, parsesHLSFormat, originalProxy, quality, filter, excludingClients, includingClients, range, begin, liveBuffer, highWaterMark, IPv6Block, dlChunkSize, disableFileCache, logDisplay } = {}) {
        /* Get Info Options */
        this.hl = 'en';
        this.gl = 'US';
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
        this.includingClients = 'all';
        /* Metadata */
        this.version = Constants_1.VERSION;
        /* Other Options */
        Log_1.Logger.logDisplay = logDisplay || ['info', 'success', 'warning', 'error'];
        if (disableFileCache) {
            FileCache.disable();
        }
        /* Get Info Options */
        this.hl = hl || 'en';
        this.gl = gl || 'US';
        this.requestOptions = requestOptions || {};
        this.rewriteRequest = rewriteRequest || undefined;
        this.agent = agent || undefined;
        this.disablePoTokenAutoGeneration = disablePoTokenAutoGeneration ?? false;
        this.includesPlayerAPIResponse = includesPlayerAPIResponse ?? false;
        this.includesNextAPIResponse = includesNextAPIResponse ?? false;
        this.includesOriginalFormatData = includesOriginalFormatData ?? false;
        this.includesRelatedVideo = includesRelatedVideo ?? true;
        this.clients = clients || undefined;
        this.disableDefaultClients = disableDefaultClients ?? false;
        this.parsesHLSFormat = parsesHLSFormat ?? false;
        this.originalProxy = originalProxy || undefined;
        if (this.originalProxy) {
            Log_1.Logger.debug(`<debug>"${this.originalProxy.base}"</debug> is used for <blue>API requests</blue>.`);
            Log_1.Logger.debug(`<debug>"${this.originalProxy.download}"</debug> is used for <blue>video downloads</blue>.`);
            Log_1.Logger.debug(`The query name <debug>"${this.originalProxy.urlQueryName || 'url'}"</debug> is used to specify the URL in the request. <blue>(?url=...)</blue>`);
        }
        this.setPoToken(poToken);
        this.setVisitorData(visitorData);
        this.setOAuth2(oauth2Credentials || null, {
            agent: this.agent,
            rewriteRequest: this.rewriteRequest,
            originalProxy: this.originalProxy,
        });
        /* Format Selection Options */
        this.quality = quality || undefined;
        this.filter = filter || undefined;
        this.excludingClients = excludingClients || [];
        this.includingClients = includingClients || 'all';
        /* Download Options */
        this.range = range || undefined;
        this.begin = begin || undefined;
        this.liveBuffer = liveBuffer || undefined;
        this.highWaterMark = highWaterMark || undefined;
        this.IPv6Block = IPv6Block || undefined;
        this.dlChunkSize = dlChunkSize || undefined;
        if (!this.disablePoTokenAutoGeneration) {
            this.automaticallyGeneratePoToken();
        }
        this.initializeHtml5PlayerCache();
        /* Version Check */
        if (!isNodeVersionOk(process.version)) {
            throw new Error(`You are using Node.js ${process.version} which is not supported. Minimum version required is v16.`);
        }
    }
    initializeOptions(options) {
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
        INTERNAL_OPTIONS.oauth2Credentials = options.oauth2Credentials || this.oauth2?.getCredentials();
        INTERNAL_OPTIONS.parsesHLSFormat = options.parsesHLSFormat || this.parsesHLSFormat;
        INTERNAL_OPTIONS.originalProxy = options.originalProxy || this.originalProxy || undefined;
        /* Format Selection Options */
        INTERNAL_OPTIONS.quality = options.quality || this.quality || undefined;
        INTERNAL_OPTIONS.filter = options.filter || this.filter || undefined;
        INTERNAL_OPTIONS.excludingClients = options.excludingClients || this.excludingClients || [];
        INTERNAL_OPTIONS.includingClients = options.includingClients || this.includingClients || 'all';
        /* Download Options */
        INTERNAL_OPTIONS.range = options.range || this.range || undefined;
        INTERNAL_OPTIONS.begin = options.begin || this.begin || undefined;
        INTERNAL_OPTIONS.liveBuffer = options.liveBuffer || this.liveBuffer || undefined;
        INTERNAL_OPTIONS.highWaterMark = options.highWaterMark || this.highWaterMark || undefined;
        INTERNAL_OPTIONS.IPv6Block = options.IPv6Block || this.IPv6Block || undefined;
        INTERNAL_OPTIONS.dlChunkSize = options.dlChunkSize || this.dlChunkSize || undefined;
        if (!INTERNAL_OPTIONS.oauth2 && options.oauth2Credentials) {
            Log_1.Logger.warning('The OAuth2 token should be specified when instantiating the YtdlCore class, not as a function argument.');
            INTERNAL_OPTIONS.oauth2 = new OAuth2_1.OAuth2(options.oauth2Credentials, {
                agent: INTERNAL_OPTIONS.agent,
                rewriteRequest: INTERNAL_OPTIONS.rewriteRequest,
                originalProxy: INTERNAL_OPTIONS.originalProxy,
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
}
exports.YtdlCore = YtdlCore;
YtdlCore.chooseFormat = Format_1.FormatUtils.chooseFormat;
YtdlCore.filterFormats = Format_1.FormatUtils.filterFormats;
YtdlCore.validateID = Url_1.Url.validateID;
YtdlCore.validateURL = Url_1.Url.validateURL;
YtdlCore.getURLVideoID = Url_1.Url.getURLVideoID;
YtdlCore.getVideoID = Url_1.Url.getVideoID;
YtdlCore.createAgent = Agent_1.Agent.createAgent;
YtdlCore.createProxyAgent = Agent_1.Agent.createProxyAgent;
//# sourceMappingURL=YtdlCore.js.map