import { request as undiciRequest } from 'undici';

import { YTDL_RequestOptions } from '@/types/Options';

import { RequestError } from './errors';

export default class Fetcher {
    static async request<T = unknown>(url: string, options: YTDL_RequestOptions = {}): Promise<T> {
        const { requestOptions } = options,
            REQUEST_RESULTS = await undiciRequest(url, requestOptions),
            STATUS_CODE = REQUEST_RESULTS.statusCode.toString(),
            LOCATION = REQUEST_RESULTS.headers['location'] || null;

        if (STATUS_CODE.startsWith('2')) {
            const CONTENT_TYPE = REQUEST_RESULTS.headers['content-type'] || '';

            if (CONTENT_TYPE.includes('application/json')) {
                return REQUEST_RESULTS.body.json() as T;
            }

            return REQUEST_RESULTS.body.text() as T;
        } else if (STATUS_CODE.startsWith('3') && LOCATION) {
            return this.request(LOCATION.toString(), options);
        }

        const ERROR = new RequestError(`Status Code: ${STATUS_CODE}`);
        ERROR.statusCode = REQUEST_RESULTS.statusCode;

        throw ERROR;
    }
}
