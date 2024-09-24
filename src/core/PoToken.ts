import { Platform } from '@/platforms/Platform';
import { Logger } from '@/utils/Log';

const RUNTIME = Platform.getShim().runtime;

export class PoToken {
    static async generatePoToken(): Promise<{ poToken: string; visitorData: string }> {
        return new Promise((resolve) => {
            if (RUNTIME !== 'default') {
                return {
                    poToken: '',
                    visitorData: '',
                };
            }

            const { generate } = require('youtube-po-token-generator');

            try {
                generate()
                    .then((data: any) => {
                        Logger.success('Successfully generated a poToken.');
                        resolve(data);
                    })
                    .catch((err: Error) => {
                        Logger.error('Failed to generate a poToken.\nDetails: ' + err);
                        resolve({
                            poToken: '',
                            visitorData: '',
                        });
                    });
            } catch (err) {
                Logger.error('Failed to generate a poToken.\nDetails: ' + err);

                resolve({
                    poToken: '',
                    visitorData: '',
                });
            }
        });
    }
}
