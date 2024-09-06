# @ybd-project/ytdl-core

YBD Project fork of `ytdl-core`. This fork is dedicated to developing a YouTube downloader that is fast, stable, and takes into account various use cases, with reference to LuanRT/YouTube.js and yt-dlp.

## ℹ️Announcements at this timeℹ️

> [!NOTE]
> For age-restricted videos, we can work around this by using the tv_embedded client, but we are working on a fix for this, as specifying a poToken for tv_embedded still results in a bot error.

> [!NOTE]
> I am currently implementing a way to authenticate using OAuth2 in order to avoid cases such as bot errors (and others) when a poToken is specified.

<!-- There are no announcements at this time. -->

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

```js
const ytdl = require('@ybd-project/ytdl-core');
// TypeScript: import ytdl from '@ybd-project/ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from '@ybd-project/ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('@ybd-project/ytdl-core'); with neither of the above

// Download a video
ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ').pipe(require('fs').createWriteStream('video.mp4'));

// Get video info
ytdl.getBasicInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ').then((info) => {
    console.log(info.title);
});

// Get video info with download formats
ytdl.getInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ').then((info) => {
    console.log(info.formats);
});
```

### Cookies Support

Currently, the use of cookies is deprecated due to the “Sign in to confirm you're not a bot” error. Please use `poToken` instead.

### OAuth2 Support

`@ybd-project/ytdl-core` supports OAuth2 Token.

These can be used to avoid age restrictions and bot errors. See below for instructions on how to use them.

> [!NOTE]
> The following methods will be deprecated and eventually removed in the next version (v5.1.x)

```js
const ytdl = require('@ybd-project/ytdl-core');

/* Normal usage */
ytdl.getInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ", {
    oauth2: new ytdl.OAuth2({
        accessToken: "...",
        refreshToken: "...",
        expiryDate: "yyyy-MM-ddThh-mm-ssZ",
    }),
});

/* If you need to specify a client ID and secret */
ytdl.getInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ", {
    oauth2: new ytdl.OAuth2({
        accessToken: "...",
        refreshToken: "...",
        expiryDate: "yyyy-MM-ddThh-mm-ssZ",
        clientData: {
            clientId: '...',
            clientSecret: '...',
        }
    }),
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

### PoToken Support

`@ybd-project/ytdl-core` supports `poToken`.

The `poToken` can be used to avoid bot errors and must be specified with `visitorData`. If you need to obtain `poToken` or `visitorData`, please use the following repository to generate them.

1. https://github.com/iv-org/youtube-trusted-session-generator
2. https://github.com/fsholehan/scrape-youtube

```js
const ytdl = require('@ybd-project/ytdl-core');

ytdl.getBasicInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ', { poToken: 'PO_TOKEN', visitorData: 'VISITOR_DATA' });
ytdl.getInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ', { poToken: 'PO_TOKEN', visitorData: 'VISITOR_DATA' });
```

### Proxy Support

```js
const ytdl = require('@ybd-project/ytdl-core');

const agent = ytdl.createProxyAgent({ uri: 'my.proxy.server' });

ytdl.getBasicInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ', { agent });
ytdl.getInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ', { agent });
```

### IP Rotation

_Built-in ip rotation (`getRandomIPv6`) won't be updated and will be removed in the future, create your own ip rotation instead._

To implement IP rotation, you need to assign the desired IP address to the `localAddress` property within `undici.Agent.Options`.
Therefore, you'll need to use a different `ytdl.Agent` for each IP address you want to use.

```js
const ytdl = require('@ybd-project/ytdl-core');
const { getRandomIPv6 } = require('@ybd-project/ytdl-core/lib/utils');

const agentForARandomIP = ytdl.createAgent(undefined, {
    localAddress: getRandomIPv6('2001:2::/48'),
});

ytdl.getBasicInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ', { agent: agentForARandomIP });

const agentForAnotherRandomIP = ytdl.createAgent(undefined, {
    localAddress: getRandomIPv6('2001:2::/48'),
});

ytdl.getInfo('http://www.youtube.com/watch?v=aqz-KE-bpKQ', { agent: agentForAnotherRandomIP });
```

## API

You can find the API documentation in the [original repo](https://github.com/fent/node-ytdl-core#api). Except a few changes:

### `ytdl.getInfoOptions`

-   `requestOptions` is now `undici`'s [`RequestOptions`](https://github.com/nodejs/undici#undicirequesturl-options-promise).
-   `agent`: [`ytdl.Agent`](https://github.com/ybd-projectjs/ytdl-core/blob/master/typings/index.d.ts#L10-L14)

### `ytdl.createAgent([cookies]): ytdl.Agent`

`cookies`: an array of json cookies exported with [EditThisCookie](http://www.editthiscookie.com/).

### `ytdl.createProxyAgent(proxy[, cookies]): ytdl.Agent`

`proxy`: [`ProxyAgentOptions`](https://github.com/nodejs/undici/blob/main/docs/api/ProxyAgent.md#parameter-proxyagentoptions) contains your proxy server information.

#### How to implement `ytdl.Agent` with your own Dispatcher

You can find the example [here](https://github.com/ybd-projectjs/ytdl-core/blob/master/lib/cookie.js#L73-L86)

## Limitations

ytdl cannot download videos that fall into the following

-   Regionally restricted (requires a [proxy](#proxy-support))
-   Private (if you have access, requires [cookies](#cookies-support))
-   Rentals (if you have access, requires [cookies](#cookies-support))
-   YouTube Premium content (if you have access, requires [cookies](#cookies-support))
-   Only [HLS Livestreams](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) are currently supported. Other formats will get filtered out in ytdl.chooseFormats

Generated download links are valid for 6 hours, and may only be downloadable from the same IP address.

## Rate Limiting

When doing too many requests YouTube might block. This will result in your requests getting denied with HTTP-StatusCode 429. The following steps might help you:

-   Update `@ybd-project/ytdl-core` to the latest version
-   Use proxies (you can find an example [here](#proxy-support))
-   Extend the Proxy Idea by rotating (IPv6-)Addresses
    -   read [this](https://github.com/fent/node-ytdl-core#how-does-using-an-ipv6-block-help) for more information about this
-   Use cookies (you can find an example [here](#cookies-support))
    -   for this to take effect you have to FIRST wait for the current rate limit to expire
-   Wait it out (it usually goes away within a few days)

## Update Checks

The issue of using an outdated version of ytdl-core became so prevalent, that ytdl-core now checks for updates at run time, and every 12 hours. If it finds an update, it will print a warning to the console advising you to update. Due to the nature of this library, it is important to always use the latest version as YouTube continues to update.

If you'd like to disable this update check, you can do so by providing the `YTDL_NO_UPDATE` env variable.

```
env YTDL_NO_UPDATE=1 node myapp.js
```
