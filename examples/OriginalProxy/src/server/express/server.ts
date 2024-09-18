import express from 'express';

const app = express();

app.use(express.json());

app.all('/', async (req, res) => {
    const REQUEST_URL = req.query.url;

    if (!REQUEST_URL) {
        res.status(400);
        res.end();

        return;
    }

    try {
        const HEADERS = req.rawHeaders.reduce((acc: Record<string, string>, curr, index) => {
                if (index % 2 === 0) {
                    acc[curr] = req.rawHeaders[index + 1];
                }

                return acc;
            }, {}),
            METHOD = req.method,
            BODY = req.body,
            RESPONSE_DATA = await fetch(decodeURIComponent(REQUEST_URL.toString()), {
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
    } catch (err: any) {
        res.status(500).json({
            error: err.message,
        });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000 (http://localhost:3000/)');
});
