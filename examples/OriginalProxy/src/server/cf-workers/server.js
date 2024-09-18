const BASE_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Cache-Control': 'private, no-cache',
};

export default {
    async fetch(req) {
        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 200, headers: BASE_HEADERS });
        }

        const url = new URL(req.url),
            REQUEST_URL = url.searchParams.get('url');

        if (!REQUEST_URL) {
            return new Response('', { status: 400, headers: BASE_HEADERS });
        }

        if (req.url.includes('/download/')) {
            const RESPONSE = await fetch(decodeURIComponent(REQUEST_URL.toString()), {
                headers: {
                    Range: req.headers['range'] || 'bytes=0-',
                    'cache-control': 'no-cache',
                    'Accept-Encoding': 'identity;q=1, *;q=0',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
                },
            });

            if (!RESPONSE.body) {
                return new Response(null, { status: 500, headers: BASE_HEADERS });
            }

            return new Response(await RESPONSE.arrayBuffer(), { status: 200, headers: BASE_HEADERS });
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
        } catch (err) {
            return Response.json({ error: err.message }, { status: 500, headers: BASE_HEADERS });
        }
    },
};
