"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCookiesFromString = exports.addCookies = exports.createProxyAgent = exports.createAgent = exports.defaultAgent = void 0;
var tough_cookie_1 = require("tough-cookie");
/* Private Functions */
function convertSameSite(sameSite) { }
function addCookies(jar, cookies) {
    if (!cookies || !Array.isArray(cookies)) {
        throw new Error('cookies must be an array');
    }
    var CONTAINS_SOCS = cookies.some(function (cookie) {
        if (cookie instanceof tough_cookie_1.Cookie) {
            return false;
        }
        return cookie.name === 'SOCS';
    });
    if (!CONTAINS_SOCS) {
        cookies.push({
            domain: '.youtube.com',
            hostOnly: false,
            httpOnly: false,
            name: 'SOCS',
            path: '/',
            sameSite: 'lax',
            secure: true,
            session: false,
            value: 'CAI',
        });
    }
    for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
        var COOKIE = cookies_1[_i];
        jar.setCookieSync(converCookie(cookie), 'https://www.youtube.com');
    }
}
exports.addCookies = addCookies;
function addCookiesFromString() { }
exports.addCookiesFromString = addCookiesFromString;
function createAgent() { }
exports.createAgent = createAgent;
function createProxyAgent() { }
exports.createProxyAgent = createProxyAgent;
var defaultAgent = createAgent();
exports.defaultAgent = defaultAgent;
