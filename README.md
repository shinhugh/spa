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
    - `public/app.js` holds the client-side framework API. This provides
core functionality like navigation. These functions should be used in further
development (in `public/index.js`). This file should not be modified.
    - `public/config.js` holds the configuration for the client-side
application. This file should be modified.
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
application. This file should be modified.
    - `server/package-lock.json` holds metadata used by NPM. This file should
not be directly modified.
    - `server/package.json` holds metadata used by NPM. This file should not be
directly modified.
- `static/` holds static resources that aren't directly available to the public
by their filenames. These aren't necessarily private, but they cannot be
directly fetched like the resources in `public/` can be.
    - `static/index.html` is the HTML file that is served when any page is
requested. It defines the DOM structure of the entire client-side application.
It functions as an entry-point in the sense that it triggers the browser to
fetch all of the other resources (scripts, styles, etc). This file should be
heavily modified.

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

## DOM structure

`static/index.html` holds the DOM structure of the entire client-side
application.

- Each page is represented by a single element. This element must have the
classname `page`. It must have an ID that identically matches an `elementId`
field in `public/config.js`.
- There must be an element with the ID `overlay_loading`. The framework will
display this when a page is being loaded. It must be defined outside of any
page element.
- The `<script>` tags in `<head>` must remain as they are. The order in which
the scripts are run is critical. Any additional script should be added in
between `/index.js` and `/init.js`, and it must have the `defer` attribute.

## Framework API

`public/app.js` holds the client-side framework API. All the functions are
defined within the top-level object `app`.

### `app.navigate()`

```
(href: String)
=>
Promise<void>
```

Navigate to an URL. The destination can be within the application or external.
All navigation should be done via this function, not via methods like directly
setting `window.location`. The framework adds this function as a click handler
for all anchor elements that are initially present in the DOM.

### `app.navigateBack()`

```
()
=>
void
```

Navigate back to the previous page.

### `app.fadeIn()`

```
(element: Element, step: Number)
=>
{
  promise: Promise<void>;
  cancel: () => void;
}
```

Gradually increase the opacity of an element to 100%. `step` determines the rate
at which the opacity increases; it must be between 0 and 1 (exclusive).

### `app.fadeOut()`

```
(element: Element, step: Number)
=>
{
  promise: Promise<void>;
  cancel: () => void;
}
```

Gradually decrease the opacity of an element to 0%. `step` determines the rate
at which the opacity decreases; it must be between 0 and 1 (exclusive).

### `app.registerLoadPageCallback()`

```
(pathname: String, callback: () => Promise<void>)
=>
void
```

Register a function that is invoked when the framework intends to display a
page within the application located at the path given by `pathname`. This
function should asynchronously handle setting up the target page. While the
function is running, the framework will display the loading overlay. When the
returned promise completes, the framework will proceed to display the target
page.

### `app.registerHandleNavigationCallback()`

```
(callback: (String) => void)
=>
void
```

Register a function that is invoked when a navigation occurs. When invoking the
function, the framework will pass in the path of the page being navigated to.
This applies to both forward and backward navigation, including those that push
a new entry onto the history stack.
