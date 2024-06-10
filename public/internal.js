const internal = {

  'state': {
    'activePagePathname': null,
    'syncPageToLocationCancellationCallback': null,
    'navigationStartCallbacks': [],
    'pageInitializationCallbacks': [],
    'pageDeinitializationCallbacks': [],
    'navigationFinishCallbacks': []
  },

  'fadeIn': (element, step) => {
    if (element.style.opacity === '') {
      element.style.opacity = '1';
    }
    let cancel = null;
    let promise = new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        let opacity = Math.min(parseFloat(element.style.opacity) + step, 1);
        element.style.opacity = opacity.toString();
        if (opacity === 1) {
          clearInterval(interval);
          resolve();
        }
      }, 20);
      cancel = () => {
        clearInterval(interval);
        reject();
      };
    });
    return {
      'promise': promise,
      'cancel': cancel
    };
  },

  'fadeOut': (element, step) => {
    if (element.style.opacity === '') {
      element.style.opacity = '1';
    }
    let cancel = null;
    let promise = new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        let opacity = Math.max(parseFloat(element.style.opacity) - step, 0);
        element.style.opacity = opacity.toString();
        if (opacity === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 20);
      cancel = () => {
        clearInterval(interval);
        reject();
      };
    });
    return {
      'promise': promise,
      'cancel': cancel
    };
  },

  'loadSrc': (element) => {
    if (!element.hasAttribute('data-src')) {
      return;
    }
    let parentElement = element.parentElement;
    let nextSiblingElement = element.nextSibling;
    element.remove();
    element.setAttribute('src', element.getAttribute('data-src'));
    element.removeAttribute('data-src');
    parentElement.insertBefore(element, nextSiblingElement);
  },

  'unloadSrc': (element) => {
    if (!element.hasAttribute('src')) {
      return;
    }
    let parentElement = element.parentElement;
    let nextSiblingElement = element.nextSibling;
    element.remove();
    element.setAttribute('data-src', element.getAttribute('src'));
    element.removeAttribute('src');
    parentElement.insertBefore(element, nextSiblingElement);
  },

  'syncPageToLocation': async () => {
    if (internal.state.syncPageToLocationCancellationCallback) {
      internal.state.syncPageToLocationCancellationCallback();
      internal.state.syncPageToLocationCancellationCallback = null;
    }
    let newPageConfig = window.location.pathname in config.pages ? config.pages[window.location.pathname] : config.errorPages['404'];
    document.title = newPageConfig.title;
    for (let callback of internal.state.navigationStartCallbacks) {
      callback(window.location.pathname);
    }
    let fadeOperation = null;
    let newPageElement = document.getElementById(newPageConfig.elementId);
    if (window.location.pathname !== internal.state.activePagePathname) {
      let callbackPromises = [];
      for (let callback of internal.state.pageInitializationCallbacks) {
        callbackPromises.push(callback(window.location.pathname));
      }
      if (internal.state.activePagePathname) {
        let oldPageConfig = internal.state.activePagePathname in config.pages ? config.pages[internal.state.activePagePathname] : config.errorPages['404'];
        let oldPageElement = document.getElementById(oldPageConfig.elementId);
        fadeOperation = internal.fadeOut(oldPageElement, 0.1);
        internal.state.syncPageToLocationCancellationCallback = fadeOperation.cancel;
        try {
          await fadeOperation.promise;
        } catch {
          return;
        }
        internal.state.syncPageToLocationCancellationCallback = null;
      }
      for (let element of document.getElementsByClassName('page')) {
        element.style.display = 'none';
      }
      if (internal.state.activePagePathname) {
        for (let callback of internal.state.pageDeinitializationCallbacks) {
          callbackPromises.push(callback(internal.state.activePagePathname));
        }
      }
      internal.state.activePagePathname = null;
      let loadingOverlayElement = document.getElementById('loading_overlay');
      loadingOverlayElement.style.opacity = '0';
      loadingOverlayElement.style.display = null;
      fadeOperation = internal.fadeIn(loadingOverlayElement, 0.05);
      let shouldAbort = false;
      internal.state.syncPageToLocationCancellationCallback = () => {
        shouldAbort = true;
      };
      await Promise.all(callbackPromises);
      fadeOperation.cancel();
      try {
        await fadeOperation.promise;
      } catch {}
      if (shouldAbort) {
        return;
      }
      internal.state.syncPageToLocationCancellationCallback = null;
      fadeOperation = internal.fadeOut(loadingOverlayElement, 0.2);
      internal.state.syncPageToLocationCancellationCallback = fadeOperation.cancel;
      try {
        await fadeOperation.promise;
      } catch {
        return;
      }
      internal.state.syncPageToLocationCancellationCallback = null;
      loadingOverlayElement.style.display = 'none';
      internal.state.activePagePathname = window.location.pathname;
      newPageElement.style.opacity = '0';
      newPageElement.style.display = null;
    }
    fadeOperation = internal.fadeIn(newPageElement, 0.1);
    internal.state.syncPageToLocationCancellationCallback = fadeOperation.cancel;
    try {
      await fadeOperation.promise;
    } catch {
      return;
    }
    internal.state.syncPageToLocationCancellationCallback = null;
    for (let callback of internal.state.navigationFinishCallbacks) {
      callback(window.location.pathname);
    }
  },

  'navigate': async (href) => {
    let location = new URL(href);
    if (location.hostname !== window.location.hostname) {
      window.location = location;
      return;
    }
    history.pushState({
      'pathname': location.pathname
    }, '', location.href);
    await internal.syncPageToLocation();
  },

  'navigateBack': () => {
    history.back();
  },

  'registerNavigationStartCallback': (callback) => {
    internal.state.navigationStartCallbacks.push(callback);
  },

  'registerPageInitializationCallback': (callback) => {
    internal.state.pageInitializationCallbacks.push(callback);
  },

  'registerPageDeinitializationCallback': (callback) => {
    internal.state.pageDeinitializationCallbacks.push(callback);
  },

  'registerNavigationFinishCallback': (callback) => {
    internal.state.navigationFinishCallbacks.push(callback);
  }

};
