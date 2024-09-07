# Changelog

## v5.0.17 (2024/09/07)

### Features
* **Clients:** Change supported clients to only those that work properly
* **OAuth2:** OAuth2 support

### Bug Fixes
* **Player:** Improved implementation of Player API to reduce errors (when specifying PoToken or OAuth2)

### Deprecated
* **getInfo:** The getInfo function has been deprecated. Please use the getFullInfo function instead. (The getInfo function can be used until v5.2.x.)

## v5.0.13, v5.0.14 (2024/09/05)

### Features
* **Log:** Changed to be able to check the status of the player API. (Specify `YTDL_DEBUG` in the environment variable)

### Bug Fixes
* **Player:** Fixed an issue where player API URLs for Android and iOS players were not set correctly

## v5.0.9, v5.0.9-2, v5.0.10, v5.0.11, v5.0.12 (2024/08/21)

### Bug Fixes
* **Client:** Fixed a problem that prevented clients from being set up properly

### Temporary Deletion
* **Client:** The tv_embedded support for age restrictions has been temporarily removed for various reasons. (Automatic switching)

## v5.0.8 (2024/08/21)

### Features

* **Client:** Support for tv_embedded player to make age-restricted videos available
* **Player:** Change to use [youtube-po-token-generator](https://github.com/YunzheZJU/youtube-po-token-generator) to get poToken automatically when poToken is not specified. (For stable operation, generate manually.)
* **Log:** Improved log output

## v5.0.7 (2024/08/20)

### Features

* **Client:** Support for a variety of clients (Can be specified by `clients` argument)
```typescript
ytdl.getInfo('VIDEO_URL', {
    clients: ['C1', 'C2'],
});
```

* **Data:** Support for specifying whether to include or exclude data used in processing to prevent data growth (Default: false)
```typescript
ytdl.getInfo('VIDEO_URL', {
    includesPlayerAPIResponse: true,
    includesWatchPageInfo: true,
});
```

* **Log:** Changed to display warning if poToken is not specified

## v5.0.0 (2024/08/20)

### Features

* **Code:** Rewrote all code to TypeScript
* **Player:** poToken, and visitorData support
```typescript
ytdl.getInfo('VIDEO_URL', {
    poToken: 'PO_TOKEN',
    visitorData: 'VISITOR_DATA',
});
```
