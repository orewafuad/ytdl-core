const express = require('express'),
    app = express();

app.get('/', async (req, res) => {
    const REQUEST_URL = req.query.url;

    if (!REQUEST_URL) {
        res.status(400);
        res.end();

        return;
    }

    res.send(await fetch(decodeURIComponent(REQUEST_URL.toString())).then((res) => res.text()));
});

app.listen(3000, () => {
    console.log('Server listening on port 3000 (http://localhost:3000/)');
});
