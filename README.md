# @ybd-project/ytdl-core - v6

YBD Project fork of `ytdl-core`. This fork is dedicated to developing a YouTube downloader that is fast, stable, and takes into account various use cases, with reference to LuanRT/YouTube.js and yt-dlp.

## Table of Contents

<ol>
   <li><a href="#ℹ️announcements-at-this-timeℹ️">ℹ️Announcements at this timeℹ️</a></li>
   <li><a href="#prerequisite">Prerequisite</a></li>
   <li><a href="#operating-environment">Operating Environment</a></li>
   <li><a href="#installation">Installation</a></li>
   <li>
      <a href="#usage">Usage</a>
      <ul>
         <li><a href="#oauth2-support">OAuth2 Support</a></li>
         <li><a href="#potoken-support">PoToken Support</a></li>
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

## Prerequisite

To use `@ybd-project/ytdl-core` without problems, **use Node.js 16 or higher.** (Recommended is Node.js 18 or higher.)

> [!IMPORTANT]
> Use with Node.js 16 is not recommended, but will be supported as much as possible.

## Operating Environment

### Default (Node.js)

As usual, when using Node.js, as noted in the prerequisites, v16 or higher will work fine.
If you have an example that does not work with 16 or higher versions, please create an [Issue](https://github.com/ybd-project/ytdl-core/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=).

### Browser

The following are the major browsers (Chrome, Edge, Firefox, Brave, Opera, and Safari) that have now been tested.

> [!IMPORTANT]
> The minimum version of the browser to be tested is the version that can use YouTube; versions that cannot use YouTube will not be tested. (The minimum version will be described in the section for each browser.)

#### List

|    Browser Name     | Supported Versions  | Minimum Version |
| :-----------------: | :-----------------: | :-------------: |
|  **Google Chrome**  | v? - latest (v129)  |     Unknown     |
| **Microsoft Edge**  | Under investigation |     Unknown     |
| **Mozilla FireFox** | Under investigation |     Unknown     |
|  **Apple Safari**   | Under investigation |     Unknown     |
|      **Brave**      | Under investigation |     Unknown     |
|      **Opera**      | Under investigation |     Unknown     |

### Serverless

We have confirmed that `ytdl-core` for serverless functions works properly in the following environment.

|      Service Name      |                 Remarks                 |
| :--------------------: | :-------------------------------------: |
| **Cloudflare Workers** | With `nodejs_compat` compatibility flag |

## Installation

```bash
npm install @ybd-project/ytdl-core@latest
```

Make sure you're installing the latest version of `@ybd-project/ytdl-core` to keep up with the latest fixes.

## API Documentation

For details API documentation, see the [Wiki](https://github.com/ybd-project/ytdl-core/wiki).

## Usage

```ts
import fs from 'fs';
import { YtdlCore } from '@ybd-project/ytdl-core';
// For browser: import { YtdlCore } from '@ybd-project/ytdl-core/browser';
// For serverless functions: import { YtdlCore } from '@ybd-project/ytdl-core/serverless';

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

### OAuth2 Support

`@ybd-project/ytdl-core` supports OAuth2 Token.

These can be used to avoid age restrictions and bot errors. See below for instructions on how to use them.

> [!IMPORTANT]
> **Be sure to generate tokens with accounts that can be banned, as accounts may be banned.**
> Note that OAuth2 may expire soon these days. In this case, do not use OAuth2.

> [!NOTE]
> The specified OAuth2 token is automatically updated by ytdl-core, so you do not need to update it yourself.

```ts
import { YtdlCore } from '@ybd-project/ytdl-core';

/* Normal usage */
const ytdl = new YtdlCore({
    oauth2Credentials: {
        accessToken: '...',
        refreshToken: '...',
        expiryDate: 'yyyy-MM-ddThh-mm-ssZ',
    },
});

/* If you need to specify a client ID and secret */
const ytdl = new YtdlCore({
    oauth2Credentials: {
        accessToken: '...',
        refreshToken: '...',
        expiryDate: 'yyyy-MM-ddThh-mm-ssZ',
        clientData: {
            clientId: '...',
            clientSecret: '...',
        },
    },
});

/* Specify to the function if there is a need to override what was specified during class initialization. */
// This `ytdl` is already initialized as in the other examples.
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
    oauth2Credentials: {
        accessToken: '...',
        refreshToken: '...',
        expiryDate: 'yyyy-MM-ddThh-mm-ssZ',
    },
});
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

`@ybd-project/ytdl-core` supports `PoToken`.

The `PoToken` can be used to avoid bot errors and must be specified with `VisitorData`. If you need to obtain `PoToken` or `VisitorData`, please use the following repository to generate them.

1. https://github.com/iv-org/youtube-trusted-session-generator
2. https://github.com/LuanRT/BgUtils
3. https://github.com/fsholehan/scrape-youtube

```ts
import { YtdlCore } from '@ybd-project/ytdl-core';

/* Basic Method */
const ytdl = new YtdlCore({ poToken: 'PO_TOKEN', visitorData: 'VISITOR_DATA' });

// PoToken, etc. specified at the time of class instantiation will be used.
// PoToken used: PO_TOKEN
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

// Specified as function arguments take precedence over those specified at the time of class instantiation.
// PoToken used: OVERRIDE_PO_TOKEN
ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { poToken: 'OVERRIDE_PO_TOKEN', visitorData: 'OVERRIDE_VISITOR_DATA' });
```

#### Disable automatic PoToken generation

The `PoToken` is automatically generated if not specified by default. To disable this, set the option `disablePoTokenAutoGeneration` to `true`.

```ts
import { YtdlCore } from '@ybd-project/ytdl-core';

const ytdl = new YtdlCore({ disablePoTokenAutoGeneration: true });
```

### Proxy Support

`@ybd-project/ytdl-core` supports proxies.

> [!IMPORTANT]
> Try PoToken or OAuth2 before using a proxy. These may have the same effect as proxies.

Starting with v6.0.0, the `createProxyAgent` function and others are obsolete. Proxies must be implemented independently through the `fetcher` function.

```ts
import { YtdlCore } from '@ybd-project/ytdl-core';
import { fetch, ProxyAgent } from 'undici';

const AGENT = new ProxyAgent('http://xxx.xxx.xxx.xxx:PORT'),
	ytdl = new YtdlCore({
		fetcher: (url, options) => {
			const REQUEST_OPTIONS: RequestInit = {
				...options,
				dispatcher: AGENT,
			};

			return fetch(url, REQUEST_OPTIONS);
		},
	});

ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

#### Build and use your own proxy

Using a proxy sold by one service may not work. In such cases, you can deploy your own proxy, e.g., to Cloudflare Workers.

See the [example](https://github.com/ybd-project/ytdl-core/tree/main/examples/OriginalProxy/) for a proxy server implementation.

##### Use of proprietary proxies

```ts
import { YtdlCore } from '@ybd-project/ytdl-core';

const ytdl = new YtdlCore({
    originalProxy: {
        base: 'http://localhost:6543',
        download: 'http://localhost:6543/video-download',
        urlQueryName: 'apiUrl',
    },
});

/* With rewriteRequest, you can specify various things. (e.g., random selection of multiple proxies) */
const ytdl = new YtdlCore({
    rewriteRequest: (url, options, { isDownloadUrl }) => {
        if (isDownloadUrl) {
            // URL is like: https://***.googlevideo.com/playbackvideo?...

            return {
                url: `https://your-video-proxy.server.com/?url=${encodeURIComponent(url)}`,
                options,
            };
        }

        return {
            url: `https://your-proxy.server.com/?url=${encodeURIComponent(url)}`,
            options,
        };
    },
});

ytdl.getFullInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

### IP Rotation

The `getRandomIPv6` function has been removed in v5.1.0. Currently, there is no stable implementation method for IPv6, as the detailed use case for IPv6-related rotation is unknown.
If you wish to use rotation, [please create a new issue](https://github.com/ybd-project/ytdl-core/issues/new?assignees=&labels=feature&projects=&template=feature_request.md&title=).

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
