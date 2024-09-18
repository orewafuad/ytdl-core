const got = require('got'),
    express = require('express'),
    app = express(),
    ALLOWED_HOSTS = ['youtube.com', 'www.youtube.com'];

function isAllowedUrl(url) {
    const { host } = new URL(url);

    return ALLOWED_HOSTS.includes(host) || host.includes('googlevideo.com');
}

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const REQUEST_URL = (req.query.url || '').toString();

    if (!REQUEST_URL || !isAllowedUrl(REQUEST_URL)) {
        res.status(400);
        res.end();

        return;
    }

    next();
});

app.all('/', async (req, res) => {
    const REQUEST_URL = (req.query.url || '').toString();

    try {
        const HEADERS = req.rawHeaders.reduce((acc, curr, index) => {
                if (index % 2 === 0) {
                    acc[curr] = req.rawHeaders[index + 1];
                }

                return acc;
            }, {}),
            METHOD = req.method,
            BODY = req.body,
            RESPONSE_DATA = await fetch(decodeURIComponent(REQUEST_URL), {
                method: req.method,
                headers: HEADERS,
                body: BODY ? JSON.stringify(BODY) : undefined,
            }).then((response) => {
                const CONTENT_TYPE = response.headers.get('content-type') || '';
                res.setHeader('Content-Type', CONTENT_TYPE);
                return response.text();
            });

        console.log(`[${METHOD}]: ${REQUEST_URL}`);

        res.send(RESPONSE_DATA);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

app.all('/download/', async (req, res) => {
    const REQUEST_URL = (req.query.url || '').toString();

    console.log(`[${req.method}]: ${REQUEST_URL}`);
    fetch(decodeURIComponent(REQUEST_URL.toString())).then(
        async (headRes) => {
            if (headRes.ok) {
                try {
                    got.stream(decodeURIComponent(REQUEST_URL.toString()), {
                        headers: {
                            Range: req.headers['range'] || req.get('range') || 'bytes=0-',
                            'cache-control': 'no-cache',
                            'Accept-Encoding': 'identity;q=1, *;q=0',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
                        },
                        http2: false,
                        throwHttpErrors: false,
                    }).pipe(res);
                } catch (err) {
                    res.status(500).end();
                }
            } else {
                res.status(500).end();
            }
        },
        () => res.status(500).end(),
    );
});

app.listen(3000, () => {
    console.log('Server listening on port 3000 (http://localhost:3000/)');
});
