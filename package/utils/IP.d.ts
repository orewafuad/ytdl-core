declare class IP {
    static isIPv6(ip: string): boolean;
    static normalizeIP(ip: string): Array<number>;
    static getRandomIPv6(ip: string): string;
}
export { IP };
