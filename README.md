# Single-page application

Provided:
- Client-side application (browser)
- Server-side application (Node.js)

## Quickstart

Navigate to the root directory for this project (e.g. `/home/me/projects/spa`),
then run the following:

```
npm --prefix server install
node server/app.js
```

## File structure

- `public/` holds static resources that are available to the public as they are.
If the client makes a request for `/some/file.txt`, the server will serve the
resource at `public/some/file.txt`. If the requested resource does not exist,
the server will serve `static/index.html` with the status code 404. The scripts
pulled in by the HTML document will automatically display the 404 page.
    - `public/app.js` holds the client-side API. This provides functionality on
the framework level, such as navigation. These functions should be used in
further development (in `public/index.js`). This file should not be modified.
    - `public/config.js` holds the configuration for the client-side
application. Its contents are explained in a separate section. This file should
be modified.
    - `public/favicon.ico` is the icon that browsers typically place next to the
website title. This file should be replaced.
    - `public/index.css` holds the styles for the client-side application. This
file should be heavily modified.
    - `public/index.js` holds the client-side code that implements logic
specific to the application. This file should be heavily modified.
    - `public/init.js` holds the client-side code that implements the
initialization logic. This file should not be modified.
    - `public/internal.js` holds the internal client-side API. This provides
functionality that should only be called by the framework; these functions
should not be directly used. This file should not be modified.
- `server/` holds the code and configuration for the server-side application.
    - `server/app.js` holds the code that implements the server. This is the
file that should be fed into Node.js. This file should not be modified.
    - `server/config.json` holds the configuration for the server-side
application. Its contents are explained in a separate section. This file should
be modified.
    - `server/package-lock.json` holds metadata used by NPM. This file should
not be directly modified.
    - `server/package.json` holds metadata used by NPM. This file should not be
directly modified.
- `static/` holds static resources that aren't directly available to the public
by their filenames. These aren't necessarily private, but they cannot be
directly fetched like the resources in `public/` can be.
    - `static/index.html` is the HTML file that is served when any page is
requested. It defines the DOM structure of the entire client-side application,
where every page is defined as a DOM element with the classname `page`. Each of
these must have an ID that identically matches an `elementId` field in
`public/config.js`. This file functions as an entry-point for the client-side
application in the sense that it triggers the browser to fetch all of the other
resources (scripts and styles). This file should be heavily modified.

## Server configuration

`server/config.json` contains the configuration for the server-side application.

- `hostname` defines the hostname that the application will match incoming
requests against.
- `port` defines the port on which the application will listen for incoming
requests.
- `pages` is a nested array that holds the paths of all pages under this
application. These paths must identically match the paths used as keys in
`public/config.js`. The order does not matter.

## Client configuration

`public/config.js` contains the configuration for the client-side application.

- `pages` is a nested object that maps paths to page configurations. The keys
must identically match the paths listed in `server/config.json`. Each page
configuration is a nested object.
    - `elementId` defines the ID of the DOM element that represents the page in
`static/index.html`. Since this is a single-page application, each page is
represented by a single DOM element (as opposed to an entirely separate HTML
entity).
    - `title` defines the title for the application when the page is active.
This is the text that browsers will display on the frame or tab.
- `errorPages` is a nested object that provides the same configuration as
`pages` but applies to error pages. The keys must be status codes, such as
'404'.
