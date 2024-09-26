function getPlayerId(body) {
    const MATCH = body.match(/player\\\/([a-zA-Z0-9]+)\\\//);

    if (MATCH) {
        return MATCH[1];
    }

    return null;
}

fetch('https://www.youtube.com/iframe_api')
    .then((res) => res.text())
    .then((data) => {
        const PLAYER_ID = getPlayerId(data);

        if (PLAYER_ID) {
            console.log('最新のプレイヤー ID の取得に成功しました：', PLAYER_ID);
            console.log('以上の ID を html5Player.ts に適応してください。\n')
        } else {
            console.error('最新のプレイヤー ID の取得に失敗しました。');
        }
    })
    .catch((err) => {
        console.error('iframe_api からの情報の取得に失敗しました：', err);
    });
