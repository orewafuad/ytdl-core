export default class PoToken {
    static generatePoToken(): Promise<{
        poToken: string;
        visitorData: string;
    }>;
}
