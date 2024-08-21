# @ybd-project/ytdl-core | Release Info

## v5.0.7

1. Support for a variety of clients (Can be specified by `clients` argument)
```typescript
ytdl.getInfo('VIDEO_URL', {
    clients: ['C1', 'C2'],
});
```
2. Support for specifying whether to include or exclude data used in processing to prevent data growth (Default: false)
```typescript
ytdl.getInfo('VIDEO_URL', {
    includesPlayerAPIResponse: true,
    includesWatchPageInfo: true,
});
```
3. Changed to display warning if poToken is not specified

## v5.0.0

1. Rewrote all code to TypeScript
2. poToken, and visitorData support
```typescript
ytdl.getInfo('VIDEO_URL', {
    poToken: 'PO_TOKEN',
    visitorData: 'VISITOR_DATA',
});
```
