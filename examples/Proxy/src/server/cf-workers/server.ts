const BASE_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Cache-Control': 'private, no-cache',
};

export default {
    async fetch(req: Request): Promise<Response> {
        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 200, headers: BASE_HEADERS });
        }

        const url = new URL(req.url),
            REQUEST_URL = url.searchParams.get('url');

        if (!REQUEST_URL) {
            return new Response('', { status: 400, headers: BASE_HEADERS });
        }

        try {
            let contentType = 'text/plain';

            const HEADERS = req.headers,
                METHOD = req.method,
                BODY = await req.text(),
                RESPONSE_DATA = await fetch(decodeURIComponent(REQUEST_URL.toString()), {
                    method: METHOD,
                    headers: HEADERS,
                    body: BODY ? BODY : undefined,
                }).then((response) => {
                    const CONTENT_TYPE = response.headers.get('content-type') || '';

                    if (CONTENT_TYPE) {
                        contentType = CONTENT_TYPE;
                    }
                    return response.text();
                });

            return new Response(RESPONSE_DATA, { status: 200, headers: { 'Content-Type': contentType, ...BASE_HEADERS } });
        } catch (err: any) {
            return Response.json({ error: err.message }, { status: 500, headers: BASE_HEADERS });
        }
    },
};
