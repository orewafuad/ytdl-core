const fs = require('fs');

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
            console.log('最新のプレイヤー ID の取得に成功しました：', PLAYER_ID, '\n');
            console.log('プレイヤー ID を utils/Constants.ts に適応しています...');

            try {
                const DATA = fs.readFileSync('C:/ybd-project-products/ytdl-core/src/utils/Constants.ts', 'utf8'),
                    SPLIT_LINES = DATA.split('\n'),
                    PLAYER_ID_LINE = SPLIT_LINES.findIndex((v) => v.startsWith('export const CURRENT_PLAYER_ID = '));

                SPLIT_LINES[PLAYER_ID_LINE] = `export const CURRENT_PLAYER_ID = '${PLAYER_ID}'`;
                fs.writeFileSync('C:/ybd-project-products/ytdl-core/src/utils/Constants.ts', SPLIT_LINES.join('\n'));

                console.log('プレイヤー ID の適応に成功しました。');
            } catch (err) {
                console.error('最新のプレイヤー ID の設定に失敗しました：' + PLAYER_ID + ' を utils/Constants.ts に手動で適応してください。');
                console.error('エラー内容：', err);
            }
        } else {
            console.error('最新のプレイヤー ID の取得に失敗しました。');
        }
    })
    .catch((err) => {
        console.error('iframe_api からの情報の取得に失敗しました：', err);
    });
