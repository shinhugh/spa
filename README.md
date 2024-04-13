# Single-page application

Provided:
- Client-side application (browser)
- Server-side application (Node.js)

## Quickstart

```
node server/app.js
```

## Server configuration

`server/config.json` contains the configuration for the server-side application.

- `hostname` defines the hostname that the application will match incoming
requests against.
- `port` defines the port on which the application will listen for incoming
requests.
- `pages` is a nested array that holds the paths of all pages under this
application. These paths should identically match the paths used as keys in
`public/config.js`. The order does not matter.

## Client configuration

`public/config.js` contains the configuration for the client-side application.

- `titleBase` defines the primary title of the application. This is the text
that browsers will display on the frame/tab.
- `titles` is a nested object that maps paths to secondary titles. This defines
the portion of the title that follows the base title defined by `titleBase`. The
final title will have the format: `<base>: <secondary>`. Each path must
identically match a path specified in `server/config.json`. Note that the root
page (`/`) does not have a secondary title because it uses just the base title.
- `pageElementIds` is a nested object that maps paths to DOM element IDs in
`index.html`. Since this is a single-page application, each path is represented
by a single DOM element (as opposed to an entirely separate HTML entity).
