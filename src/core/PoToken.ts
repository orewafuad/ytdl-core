import { generate } from 'youtube-po-token-generator';
import { Logger } from '@/utils/Log';

export default class PoToken {
    static async generatePoToken(): Promise<{ poToken: string; visitorData: string }> {
        try {
            const data = await generate();

            Logger.success('Successfully generated a poToken.');

            return data;
        } catch (err) {
            Logger.error('Failed to generate a poToken.');

            return {
                poToken: '',
                visitorData: '',
            };
        }
    }
}
