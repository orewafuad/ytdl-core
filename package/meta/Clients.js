"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INNERTUBE_CLIENTS = exports.INNERTUBE_BASE_API_URL = exports.Clients = void 0;
const Utils_1 = __importDefault(require("../utils/Utils"));
const UserAgents_1 = __importDefault(require("../utils/UserAgents"));
const INNERTUBE_BASE_API_URL = 'https://www.youtube.com/youtubei/v1', INNERTUBE_CLIENTS = Object.freeze({
    web: {
        context: {
            client: {
                clientName: 'WEB',
                clientVersion: '2.20240726.00.00',
                userAgent: UserAgents_1.default.default,
            },
        },
        clientName: 1,
        apiInfo: {
            key: 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
        },
    },
    webCreator: {
        context: {
            client: {
                clientName: 'WEB_CREATOR',
                clientVersion: '1.20240723.03.00',
                userAgent: UserAgents_1.default.default,
            },
        },
        clientName: 62,
        apiInfo: {
            key: 'AIzaSyBUPetSUmoZL-OhlxA7wSac5XinrygCqMo',
        },
    },
    android: {
        context: {
            client: {
                clientName: 'ANDROID',
                clientVersion: '19.29.37',
                androidSdkVersion: 30,
                userAgent: UserAgents_1.default.android,
                osName: 'Android',
                osVersion: '11',
            },
        },
        clientName: 3,
        apiInfo: {
            key: 'AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w',
        },
    },
    ios: {
        context: {
            client: {
                clientName: 'IOS',
                clientVersion: '19.29.1',
                deviceMake: 'Apple',
                deviceModel: 'iPhone16,2',
                userAgent: UserAgents_1.default.ios,
                osName: 'iPhone',
                osVersion: '17.5.1.21F90',
            },
        },
        clientName: 5,
        apiInfo: {
            key: 'AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc',
        },
    },
    mweb: {
        context: {
            client: {
                clientName: 'MWEB',
                clientVersion: '2.20240726.01.00',
                userAgent: UserAgents_1.default.default,
            },
        },
        clientName: 2,
        apiInfo: {},
    },
    tv: {
        context: {
            client: {
                clientName: 'TVHTML5',
                clientVersion: '7.20240724.13.00',
                userAgent: UserAgents_1.default.tv,
            },
        },
        clientName: 7,
        apiInfo: {},
    },
    tvEmbedded: {
        context: {
            client: {
                clientName: 'TVHTML5_SIMPLY_EMBEDDED_PLAYER',
                clientVersion: '2.0',
                userAgent: UserAgents_1.default.tv,
            },
            thirdParty: {
                embedUrl: 'https://www.youtube.com/',
            },
        },
        clientName: 85,
        apiInfo: {},
    },
}), INNERTUBE_BASE_PAYLOAD = {
    videoId: '',
    cpn: Utils_1.default.generateClientPlaybackNonce(16),
    contentCheckOk: true,
    racyCheckOk: true,
    serviceIntegrityDimensions: {},
    playbackContext: {
        contentPlaybackContext: {
            vis: 0,
            splay: false,
            referer: '',
            currentUrl: '',
            autonavState: 'STATE_ON',
            autoCaptionsDefaultOn: false,
            html5Preference: 'HTML5_PREF_WANTS',
            lactMilliseconds: '-1',
            signatureTimestamp: 0,
        },
    },
    attestationRequest: {
        omitBotguardData: true,
    },
    context: {
        client: {},
        request: {
            internalExperimentFlags: [],
            useSsl: true,
        },
        user: {
            lockedSafetyMode: false,
        },
    },
};
exports.INNERTUBE_BASE_API_URL = INNERTUBE_BASE_API_URL;
exports.INNERTUBE_CLIENTS = INNERTUBE_CLIENTS;
class Clients {
    static getAuthorizationHeader(oauth2) {
        return oauth2 ? { authorization: 'Bearer ' + oauth2.getAccessToken() } : {};
    }
    static web({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = lang || 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
                ...Clients.getAuthorizationHeader(oauth2),
            },
        };
    }
    static web_nextApi({ videoId, options: { poToken, visitorData, oauth2 } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD, autonavState: 'STATE_OFF', playbackContext: { vis: 0, lactMilliseconds: '-1' }, captionsRequested: false };
        PAYLOAD.videoId = videoId;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL + '/next'}?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
                ...Clients.getAuthorizationHeader(oauth2),
            },
        };
    }
    static webCreator({ videoId, signatureTimestamp, options: { poToken, visitorData, lang } }) {
        const CLIENT = INNERTUBE_CLIENTS.webCreator, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = lang || 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
            },
        };
    }
    static android({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }) {
        const CLIENT = INNERTUBE_CLIENTS.android, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = lang || 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false&id=${videoId}&t=${Utils_1.default.generateClientPlaybackNonce(12)}`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
                ...Clients.getAuthorizationHeader(oauth2),
            },
        };
    }
    static ios({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }) {
        const CLIENT = INNERTUBE_CLIENTS.ios, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = lang || 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false&id=${videoId}&t=${Utils_1.default.generateClientPlaybackNonce(12)}`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
                ...Clients.getAuthorizationHeader(oauth2),
            },
        };
    }
    static mweb({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }) {
        const CLIENT = INNERTUBE_CLIENTS.mweb, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = lang || 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
                ...Clients.getAuthorizationHeader(oauth2),
            },
        };
    }
    static tv({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = lang || 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
                ...Clients.getAuthorizationHeader(oauth2),
            },
        };
    }
    static tvEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, lang } }) {
        const CLIENT = INNERTUBE_CLIENTS.tvEmbedded, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = lang || 'en';
        if (poToken) {
            PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        }
        else {
            PAYLOAD.serviceIntegrityDimensions = undefined;
        }
        if (visitorData) {
            PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
            url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
            payload: PAYLOAD,
            headers: {
                'X-YouTube-Client-Name': CLIENT.clientName,
                'X-Youtube-Client-Version': CLIENT.context.client.clientVersion,
                'X-Goog-Visitor-Id': visitorData,
                'User-Agent': CLIENT.context.client.userAgent,
                ...Clients.getAuthorizationHeader(oauth2),
            },
        };
    }
}
exports.Clients = Clients;
exports.default = Clients;
//# sourceMappingURL=Clients.js.map