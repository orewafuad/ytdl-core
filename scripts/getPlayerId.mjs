import fs from 'fs';

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
            console.log('The latest player ID has been successfully retrieved:', PLAYER_ID, '\n');
            console.log('Adapting player ID to utils/Constants.ts...');

            try {
                const DATA = fs.readFileSync('C:/ybd-project-products/ytdl-core/src/utils/Constants.ts', 'utf8'),
                    SPLIT_LINES = DATA.split('\n'),
                    PLAYER_ID_LINE = SPLIT_LINES.findIndex((v) => v.startsWith('export const CURRENT_PLAYER_ID = '));

                SPLIT_LINES[PLAYER_ID_LINE] = `export const CURRENT_PLAYER_ID = '${PLAYER_ID}';`;
                fs.writeFileSync('C:/ybd-project-products/ytdl-core/src/utils/Constants.ts', SPLIT_LINES.join('\n'));

                console.log('Player ID has been successfully adapted.');
            } catch (err) {
                console.error('Failed to set the latest player ID: please manually adapt ' + PLAYER_ID + ' to utils/Constants.ts.');
                console.error('Error Details:', err);
            }
        } else {
            console.error('Failed to retrieve the latest player ID.');
        }
    })
    .catch((err) => {
        console.error('Failed to retrieve information from iframe_api:', err);
    });
