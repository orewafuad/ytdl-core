"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtdlCore = void 0;
const Download_1 = require("./core/Download");
const Info_1 = require("./core/Info");
const Search_1 = require("./core/Search");
const Html5Player_1 = require("./core/Info/parser/Html5Player");
const Agent_1 = require("./core/Agent");
const OAuth2_1 = require("./core/OAuth2");
const PoToken_1 = require("./core/PoToken");
const Cache_1 = require("./core/Cache");
const Url_1 = require("./utils/Url");
const Format_1 = require("./utils/Format");
const Constants_1 = require("./utils/Constants");
const Log_1 = require("./utils/Log");
class YtdlCore {
    /* Setup */
    setPoToken(poToken) {
        const PO_TOKEN_CACHE = Cache_1.FileCache.get('poToken');
        if (poToken) {
            this.poToken = poToken;
        }
        else if (PO_TOKEN_CACHE) {
            Log_1.Logger.debug('PoToken loaded from cache.');
            this.poToken = PO_TOKEN_CACHE || undefined;
        }
        Cache_1.FileCache.set('poToken', this.poToken || '', { ttl: 60 * 60 * 24 * 365 });
    }
    setVisitorData(visitorData) {
        const VISITOR_DATA_CACHE = Cache_1.FileCache.get('visitorData');
        if (visitorData) {
            this.visitorData = visitorData;
        }
        else if (VISITOR_DATA_CACHE) {
            Log_1.Logger.debug('VisitorData loaded from cache.');
            this.visitorData = VISITOR_DATA_CACHE || undefined;
        }
        Cache_1.FileCache.set('visitorData', this.visitorData || '', { ttl: 60 * 60 * 24 * 365 });
    }
    setOAuth2(oauth2) {
        const OAUTH2_CACHE = Cache_1.FileCache.get('oauth2') || undefined;
        try {
            this.oauth2 = oauth2 || new OAuth2_1.OAuth2(OAUTH2_CACHE) || undefined;
        }
        catch {
            this.oauth2 = undefined;
        }
    }
    automaticallyGeneratePoToken() {
        if (!this.poToken && !this.visitorData) {
            Log_1.Logger.info('Since PoToken and VisitorData are not specified, they are generated automatically.');
            PoToken_1.PoToken.generatePoToken()
                .then(({ poToken, visitorData }) => {
                this.poToken = poToken;
                this.visitorData = visitorData;
                Cache_1.FileCache.set('poToken', this.poToken || '', { ttl: 60 * 60 * 24 * 365 });
                Cache_1.FileCache.set('visitorData', this.visitorData || '', { ttl: 60 * 60 * 24 * 365 });
            })
                .catch(() => { });
        }
    }
    initializeHtml5PlayerCache() {
        const HTML5_PLAYER = Cache_1.FileCache.get('html5Player');
        if (!HTML5_PLAYER && !process.env._YTDL_DISABLE_HTML5_PLAYER_CACHE) {
            Log_1.Logger.debug('To speed up processing, html5Player and signatureTimestamp are pre-fetched and cached.');
            (0, Html5Player_1.getHtml5Player)('dQw4w9WgXcQ', {});
        }
    }
    constructor({ lang, requestOptions, rewriteRequest, agent, poToken, disablePoTokenAutoGeneration, visitorData, includesPlayerAPIResponse, includesNextAPIResponse, includesOriginalFormatData, includesRelatedVideo, clients, disableDefaultClients, oauth2, parsesHLSFormat, originalProxyUrl, originalProxy, quality, filter, excludingClients, includingClients, range, begin, liveBuffer, highWaterMark, IPv6Block, dlChunkSize, debug, disableFileCache } = {}) {
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
        this.parsesHLSFormat = false;
        this.excludingClients = [];
        this.includingClients = ['web', 'webCreator', 'webEmbedded', 'android', 'ios', 'mweb', 'tv', 'tvEmbedded'];
        /* Metadata */
        this.version = Constants_1.VERSION;
        /* Other Options */
        process.env.YTDL_DEBUG = (debug ?? false).toString();
        process.env._YTDL_DISABLE_FILE_CACHE = (disableFileCache ?? false).toString();
        /* Get Info Options */
        this.lang = lang || 'en';
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
        if (originalProxyUrl && !originalProxy) {
            Log_1.Logger.info('<warning>`originalProxyUrl` is deprecated.</warning> Use `originalProxy` instead.');
            if (!this.originalProxy) {
                try {
                    this.originalProxy = {
                        base: originalProxyUrl,
                        download: new URL(originalProxyUrl).origin + '/download',
                        urlQueryName: 'url',
                    };
                }
                catch { }
            }
        }
        if (this.originalProxy) {
            Log_1.Logger.debug(`<debug>"${this.originalProxy.base}"</debug> is used for <blue>API requests</blue>.`);
            Log_1.Logger.debug(`<debug>"${this.originalProxy.download}"</debug> is used for <blue>video downloads</blue>.`);
            Log_1.Logger.debug(`The query name <debug>"${this.originalProxy.urlQueryName || 'url'}"</debug> is used to specify the URL in the request. <blue>(?url=...)</blue>`);
        }
        this.setPoToken(poToken);
        this.setVisitorData(visitorData);
        this.setOAuth2(oauth2);
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
    setupOptions(options) {
        options.lang = options.lang || this.lang;
        options.requestOptions = options.requestOptions || this.requestOptions;
        options.rewriteRequest = options.rewriteRequest || this.rewriteRequest;
        options.agent = options.agent || this.agent;
        options.poToken = options.poToken || this.poToken;
        options.disablePoTokenAutoGeneration = options.disablePoTokenAutoGeneration || this.disablePoTokenAutoGeneration;
        options.visitorData = options.visitorData || this.visitorData;
        options.includesPlayerAPIResponse = options.includesPlayerAPIResponse || this.includesPlayerAPIResponse;
        options.includesNextAPIResponse = options.includesNextAPIResponse || this.includesNextAPIResponse;
        options.includesOriginalFormatData = options.includesOriginalFormatData || this.includesOriginalFormatData;
        options.includesRelatedVideo = options.includesRelatedVideo || this.includesRelatedVideo;
        options.clients = options.clients || this.clients;
        options.disableDefaultClients = options.disableDefaultClients || this.disableDefaultClients;
        options.oauth2Credentials = options.oauth2Credentials || this.oauth2.;
        options.parsesHLSFormat = options.parsesHLSFormat || this.parsesHLSFormat;
        options.originalProxy = options.originalProxy || this.originalProxy || undefined;
        if (options.originalProxyUrl && !options.originalProxy) {
            Log_1.Logger.info('<warning>originalProxyUrl is deprecated.</warning> Use `originalProxy` instead.');
            try {
                options.originalProxy = {
                    base: options.originalProxyUrl,
                    download: new URL(options.originalProxyUrl).origin + '/download',
                    urlQueryName: 'url',
                };
            }
            catch { }
        }
        /* Format Selection Options */
        options.quality = options.quality || this.quality || undefined;
        options.filter = options.filter || this.filter || undefined;
        options.excludingClients = options.excludingClients || this.excludingClients || [];
        options.includingClients = options.includingClients || this.includingClients || 'all';
        /* Download Options */
        options.range = options.range || this.range || undefined;
        options.begin = options.begin || this.begin || undefined;
        options.liveBuffer = options.liveBuffer || this.liveBuffer || undefined;
        options.highWaterMark = options.highWaterMark || this.highWaterMark || undefined;
        options.IPv6Block = options.IPv6Block || this.IPv6Block || undefined;
        options.dlChunkSize = options.dlChunkSize || this.dlChunkSize || undefined;
        if (!this.oauth2 && options.oauth2Credentials) {
            Log_1.Logger.warning('The OAuth2 token should be specified when instantiating the YtdlCore class, not as a function argument.');
        }
        return options;
    }
    download(link, options = {}) {
        return (0, Download_1.download)(link, this.setupOptions(options));
    }
    downloadFromInfo(info, options = {}) {
        return (0, Download_1.downloadFromInfo)(info, this.setupOptions(options));
    }
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    getBasicInfo(link, options = {}) {
        return (0, Info_1.getBasicInfo)(link, this.setupOptions(options));
    }
    /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
    getFullInfo(link, options = {}) {
        return (0, Info_1.getFullInfo)(link, this.setupOptions(options));
    }
}
exports.YtdlCore = YtdlCore;
YtdlCore.download = Download_1.download;
YtdlCore.downloadFromInfo = Download_1.downloadFromInfo;
YtdlCore.getBasicInfo = Info_1.getBasicInfo;
YtdlCore.getFullInfo = Info_1.getFullInfo;
YtdlCore.search = Search_1.search;
YtdlCore.chooseFormat = Format_1.FormatUtils.chooseFormat;
YtdlCore.filterFormats = Format_1.FormatUtils.filterFormats;
YtdlCore.validateID = Url_1.Url.validateID;
YtdlCore.validateURL = Url_1.Url.validateURL;
YtdlCore.getURLVideoID = Url_1.Url.getURLVideoID;
YtdlCore.getVideoID = Url_1.Url.getVideoID;
YtdlCore.createAgent = Agent_1.createAgent;
YtdlCore.createProxyAgent = Agent_1.createProxyAgent;
//# sourceMappingURL=YtdlCore.js.map