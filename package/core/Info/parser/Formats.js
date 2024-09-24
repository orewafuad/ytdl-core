"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatParser = void 0;
const sax_1 = __importDefault(require("sax"));
const Fetcher_1 = require("../../../core/Fetcher");
const Url_1 = require("../../../utils/Url");
class FormatParser {
    static parseFormats(playerResponse) {
        let formats = [];
        if (playerResponse && playerResponse.streamingData) {
            formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
        }
        return formats;
    }
    static async getM3U8(url, options) {
        const _URL = new URL(url, Url_1.Url.getBaseUrl()), BODY = await Fetcher_1.Fetcher.request(_URL.toString(), options), FORMATS = {};
        BODY.split('\n')
            .filter((line) => /^https?:\/\//.test(line))
            .forEach((line) => {
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
                if (node.name === 'ADAPTATIONSET') {
                    adaptationSet = ATTRIBUTES;
                }
                else if (node.name === 'REPRESENTATION') {
                    const ITAG = parseInt(ATTRIBUTES.ID);
                    if (!isNaN(ITAG)) {
                        const SOURCE = (() => {
                            if (node.attributes.HEIGHT) {
                                return {
                                    width: parseInt(ATTRIBUTES.WIDTH),
                                    height: parseInt(ATTRIBUTES.HEIGHT),
                                    fps: parseInt(ATTRIBUTES.FRAMERATE),
                                };
                            }
                            else {
                                return {
                                    audioSampleRate: ATTRIBUTES.AUDIOSAMPLINGRATE,
                                };
                            }
                        })();
                        FORMATS[url] = Object.assign({
                            itag: ITAG,
                            url,
                            bitrate: parseInt(ATTRIBUTES.BANDWIDTH),
                            mimeType: `${adaptationSet.MIMETYPE}; codecs="${ATTRIBUTES.CODECS}"`,
                        }, SOURCE);
                        Object.assign;
                    }
                }
            };
            PARSER.onend = () => {
                resolve(FORMATS);
            };
            Fetcher_1.Fetcher.request(new URL(url, Url_1.Url.getBaseUrl()).toString(), options)
                .then((res) => {
                PARSER.write(res);
                PARSER.close();
            })
                .catch(reject);
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
}
exports.FormatParser = FormatParser;
//# sourceMappingURL=Formats.js.map