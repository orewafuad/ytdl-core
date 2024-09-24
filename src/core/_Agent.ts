import { ProxyAgent } from 'undici';
import { Cookie, CookieJar, canonicalDomain } from 'tough-cookie';
import { CookieAgent, CookieClient } from 'http-cookie-agent/undici';

import type { YTDL_Agent, YTDL_Cookie, YTDL_Cookies } from '@/types';

/* Private Functions */
function convertSameSite(sameSite: string) {
    switch (sameSite) {
        case 'strict':
            return 'strict';
        case 'lax':
            return 'lax';
        case 'no_restriction':
        case 'unspecified':
        default:
            return 'none';
    }
}

function convertCookie(cookie: YTDL_Cookie | Cookie): Cookie {
    if (cookie instanceof Cookie) {
        return cookie;
    } else {
        const EXPIRES = typeof cookie.expirationDate === 'number' ? new Date(cookie.expirationDate * 1000) : 'Infinity';

        return new Cookie({
            key: cookie.name,
            value: cookie.value,
            expires: EXPIRES,
            domain: canonicalDomain(cookie.domain || ''),
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: convertSameSite(cookie.sameSite || ''),
            hostOnly: cookie.hostOnly,
        });
    }
}

/* Public Functions */
class Agent {
    public static defaultAgent = this.createAgent();

    static addCookies(jar: CookieJar, cookies: YTDL_Cookies) {
        if (!cookies || !Array.isArray(cookies)) {
            throw new Error('cookies must be an array');
        }

        const CONTAINS_SOCS = cookies.some((cookie) => {
            if (cookie instanceof Cookie) {
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

        for (const COOKIE of cookies) {
            jar.setCookieSync(convertCookie(COOKIE), 'https://www.youtube.com');
        }
    }

    static addCookiesFromString(jar: CookieJar, cookies: string) {
        if (!cookies || typeof cookies !== 'string') {
            throw new Error('cookies must be a string');
        }

        const COOKIES = cookies
            .split(';')
            .map((cookie) => Cookie.parse(cookie))
            .filter((c) => c !== undefined);

        return this.addCookies(jar, COOKIES);
    }

    static createAgent(cookies: YTDL_Cookies = [], opts: CookieAgent.Options = {}): YTDL_Agent {
        const OPTIONS = Object.assign({}, opts);

        if (!OPTIONS.cookies) {
            const JAR = new CookieJar();
            this.addCookies(JAR, cookies);

            OPTIONS.cookies = { jar: JAR };
        }

        return {
            dispatcher: new CookieAgent(OPTIONS),
            localAddress: OPTIONS.localAddress,
            jar: OPTIONS.cookies.jar,
        };
    }

    static createProxyAgent(options: ProxyAgent.Options | string, cookies: YTDL_Cookies = []): YTDL_Agent {
        if (typeof options === 'string') {
            options = {
                uri: options,
            };
        }

        if (options.factory) {
            throw new Error('Cannot use factory with createProxyAgent');
        }

        const JAR = new CookieJar();
        this.addCookies(JAR, cookies);

        const ASSIGN_TARGET = {
                factory: (origin: string, opts: CookieClient.Options) => {
                    const CLIENT_OPTIONS = Object.assign({ cookies: { jar: JAR } }, opts);
                    return new CookieClient(origin, CLIENT_OPTIONS);
                },
            },
            PROXY_OPTIONS = Object.assign(ASSIGN_TARGET, options);

        return {
            dispatcher: new ProxyAgent(PROXY_OPTIONS),
            localAddress: options.localAddress,
            jar: JAR,
        };
    }
}

export { Agent };
