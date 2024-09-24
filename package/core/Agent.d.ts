import { ProxyAgent } from 'undici';
import { CookieJar } from 'tough-cookie';
import { CookieAgent } from 'http-cookie-agent/undici';
import { YTDL_Agent, YTDL_Cookies } from '../types';
declare class Agent {
    static defaultAgent: YTDL_Agent;
    static addCookies(jar: CookieJar, cookies: YTDL_Cookies): void;
    static addCookiesFromString(jar: CookieJar, cookies: string): void;
    static createAgent(cookies?: YTDL_Cookies, opts?: CookieAgent.Options): YTDL_Agent;
    static createProxyAgent(options: ProxyAgent.Options | string, cookies?: YTDL_Cookies): YTDL_Agent;
}
export { Agent };
