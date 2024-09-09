# @ybd-project/ytdl-core

YBD Project fork of `ytdl-core`. This fork is dedicated to developing a YouTube downloader that is fast, stable, and takes into account various use cases, with reference to LuanRT/YouTube.js and yt-dlp.

## Table of Contents

<ol>
   <li><a href="#ℹ️announcements-at-this-timeℹ️">ℹ️Announcements at this timeℹ️</a></li>
   <li><a href="#installation">Installation</a></li>
   <li>
      <a href="#usage">Usage</a>
      <ul>
         <li><a href="#usage-before-v5.1.0">Usage before v5.1.0</a></li>
         <li><a href="#oauth2-support">OAuth2 Support</a></li>
         <li><a href="#potoken-support">PoToken Support</a></li>
         <li><a href="#cookies-support">Cookies Support</a></li>
         <li><a href="#proxy-support">Proxy Support</a></li>
         <li><a href="#ip-rotation">IP Rotation</a></li>
      </ul>
   </li>
   <li><a href="#api-documentation">API Documentation</a></li>
   <li><a href="#limitations">Limitations</a></li>
   <li><a href="#rate-limiting">Rate Limiting</a></li>
   <li><a href="#update-checks">Update Checks</a></li>
   <li><a href="#license">License</a></li>
</ol>

## ℹ️Announcements at this timeℹ️

There are no announcements at this time.

<!-- > [!NOTE]
> As of v5.0.5, related videos cannot be retrieved. This will be fixed later.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action. -->

## Installation

```bash
npm install @ybd-project/ytdl-core@latest
```

Make sure you're installing the latest version of `@ybd-project/ytdl-core` to keep up with the latest fixes.

## Usage

For more detailed information on how to use and specify options, please see the [Wiki](https://github.com/ybd-project/ytdl-core/wiki).

```ts
import fs from 'fs';
import { YtdlCore } from '@ybd-project/ytdl-core';
// JavaScript: const { YtdlCore } = require('@ybd-project/ytdl-core');

const ytdl = new YtdlCore({
    // The options specified here will be the default values when functions such as getFullInfo are executed.
});

// Download a video
ytdl.download('https://www.youtube.com/watch?v=dQw4w9WgXcQ').pipe(fs.createWriteStream('video.mp4'));

// Get video info
ytdl.getBasicInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ').then((info) => {
    console.log(info.title);
});

// Get video info with download formats
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ').then((info) => {
    console.log(info.formats);
});
```

### Usage before v5.1.0

Starting with v5.1.0, ytdl-core now uses classes. To use the old usage, you will need to change your package imports.
You can use ytdl-core in the conventional way by adding `/old` at the end.

```ts
import ytdlCore from '@ybd-project/ytdl-core/old';
const ytdlCore = require('@ybd-project/ytdl-core/old');
```

### OAuth2 Support

`@ybd-project/ytdl-core` supports OAuth2 Token.

These can be used to avoid age restrictions and bot errors. See below for instructions on how to use them.

> [!IMPORTANT]
> **Be sure to generate tokens with accounts that can be banned, as accounts may be banned.**

> [!NOTE]
> The specified OAuth2 token is automatically updated by ytdl-core, so you do not need to update it yourself.

> [!TIP]
> Do not specify OAuth2 directly as an argument. If you specify it directly, the token will be renewed repeatedly when it expires. Be sure to assign the OAuth2 token to a variable or specify it as an option when initializing the YtdlCore class.

```ts
import { YtdlCore } from '@ybd-project/ytdl-core';

/* Normal usage */
const NORMAL_OAUTH2 = new YtdlCore.OAuth2({
    accessToken: '...',
    refreshToken: '...',
    expiryDate: 'yyyy-MM-ddThh-mm-ssZ',
});

const ytdl = new YtdlCore({
    oauth2: NORMAL_OAUTH2,
});

/* If you need to specify a client ID and secret */
const OAUTH2_SPECIFY_CLIENT_DATA = new YtdlCore.OAuth2({
    accessToken: '...',
    refreshToken: '...',
    expiryDate: 'yyyy-MM-ddThh-mm-ssZ',
    clientData: {
        clientId: '...',
        clientSecret: '...',
    },
});

const ytdl = new YtdlCore({
    oauth2: OAUTH2_SPECIFY_CLIENT_DATA,
});

/* Specify to the function if there is a need to override what was specified during class initialization. */
const OVERRIDE_OAUTH2 = new YtdlCore.OAuth2({
    accessToken: '...',
    refreshToken: '...',
    expiryDate: 'yyyy-MM-ddThh-mm-ssZ',
});

// This `ytdl` is already initialized as in the other examples.
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { oauth2: OVERRIDE_OAUTH2 });
```

#### Oauth2 Access Token generation

There are two recommended methods for generating OAuth2 tokens.

1. Generate using [imputnet/cobalt](https://github.com/imputnet/cobalt)
2. Generate using your own client ID and secret

> [!TIP]
> The method of production with cobalt is very stable and is recommended. Tokens generated using cobalt can be used in the normal way.

> [!IMPORTANT]
> If you generate it yourself, specify the client ID and secret in `clientData`. This is required to refresh the token.

To generate tokens using Cobalt, execute the following command.

```bash
git clone https://github.com/imputnet/cobalt
cd cobalt
npm install
npm run token:youtube
```

If you wish to generate your own, please refer to the example folder for an example.

### PoToken Support

`@ybd-project/ytdl-core` supports `poToken`.

The `poToken` can be used to avoid bot errors and must be specified with `visitorData`. If you need to obtain `poToken` or `visitorData`, please use the following repository to generate them.

1. https://github.com/iv-org/youtube-trusted-session-generator
2. https://github.com/fsholehan/scrape-youtube

```ts
import { YtdlCore } from '@ybd-project/ytdl-core';
// JavaScript: const { YtdlCore } = require('@ybd-project/ytdl-core');

const ytdl = new YtdlCore({ poToken: 'PO_TOKEN', visitorData: 'VISITOR_DATA' });

// PoToken, etc. specified at the time of class instantiation will be used.
// PoToken used: PO_TOKEN
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

// Specified as function arguments take precedence over those specified at the time of class instantiation.
// PoToken used: OVERRIDE_PO_TOKEN
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { poToken: 'OVERRIDE_PO_TOKEN', visitorData: 'OVERRIDE_VISITOR_DATA' });
```

### Cookies Support

The use of cookies is deprecated. Use `PoToken`, `OAuth2`, or both.

### Proxy Support

> [!IMPORTANT]
> The use of proxies is not very stable and is not recommended. Please try PoToken or OAuth2 before using a proxy.

```js
import { YtdlCore } from '@ybd-project/ytdl-core';

const ytdl = new YtdlCore({
    agent: ytdl.createProxyAgent({ uri: 'my.proxy.server' }),
});

ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

### IP Rotation

The `getRandomIPv6` function has been removed in v5.1.0. Currently, there is no stable implementation method for IPv6, as the detailed use case for IPv6-related rotation is unknown.
If you wish to use rotation, please create a new issue.

## API Documentation

For API documentation, see the [Wiki](https://github.com/ybd-project/ytdl-core/wiki).

## Limitations

ytdl-core is unable to retrieve or download information from the following videos.

-   Regionally restricted (requires a [proxy](#proxy-support))
-   Private (if you have access, requires [OAuth2](#oauth2-support))
-   Rentals (if you have access, requires [OAuth2](#oauth2-support))
-   YouTube Premium content (if you have access, requires [OAuth2](#oauth2-support))
-   Only [HLS Livestreams](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) are currently supported. Other formats will get filtered out in ytdl.chooseFormats

The URL to view the retrieved video is valid for 6 hours. (In some cases, downloading may only be possible from the same IP.)

## Rate Limiting

When doing too many requests YouTube might block. This will result in your requests getting denied with HTTP-StatusCode 429. The following steps might help you:

-   Update `@ybd-project/ytdl-core` to the latest version
-   Use OAuth2 (you can find an example [here](#oauth2-support))
-   Use proxies (you can find an example [here](#proxy-support))
-   Extend the Proxy Idea by rotating (IPv6-)Addresses
    -   read [this](https://github.com/fent/node-ytdl-core#how-does-using-an-ipv6-block-help) for more information about this
-   Wait it out (it usually goes away within a few days)

## Update Checks

The issue of using an outdated version of ytdl-core became so prevalent, that ytdl-core now checks for updates at run time, and every 12 hours. If it finds an update, it will print a warning to the console advising you to update. Due to the nature of this library, it is important to always use the latest version as YouTube continues to update.

If you'd like to disable this update check, you can do so by providing the `YTDL_NO_UPDATE` env variable.

```
env YTDL_NO_UPDATE=1 node myapp.js
```

## License
Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License.