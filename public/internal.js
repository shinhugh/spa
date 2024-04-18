const internal = {

  'state': {
    'activePageElement': null,
    'syncPageToLocationCancellationCallback': null,
    'loadPageCallbacks': {}
  },

  'fadeIn': (element, step) => {
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

  'syncPageToLocation': async () => {
    if (internal.state.syncPageToLocationCancellationCallback) {
      internal.state.syncPageToLocationCancellationCallback();
      internal.state.syncPageToLocationCancellationCallback = null;
    }
    let pageConfig = window.location.pathname in config.pages ? config.pages[window.location.pathname] : config.errorPages['404'];
    document.title = pageConfig.title;
    let loadPagePromise = window.location.pathname in internal.state.loadPageCallbacks ? internal.state.loadPageCallbacks[window.location.pathname]() : null;
    if (internal.state.activePageElement) {
      let fadeOutOperation = internal.fadeOut(internal.state.activePageElement, 0.1);
      internal.state.syncPageToLocationCancellationCallback = fadeOutOperation.cancel;
      try {
        await fadeOutOperation.promise;
      } catch {
        return;
      }
      internal.state.syncPageToLocationCancellationCallback = null;
    }
    for (let element of document.getElementsByClassName('page')) {
      element.style.display = 'none';
    };
    let loadingOverlay = document.getElementById('overlay_loading');
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.display = null;
    let fadeLoadingIndicatorOperation = internal.fadeIn(loadingOverlay, 0.05);
    let shouldCancel = false;
    internal.state.syncPageToLocationCancellationCallback = () => {
      shouldCancel = true;
    };
    await loadPagePromise;
    if (shouldCancel) {
      return;
    }
    internal.state.syncPageToLocationCancellationCallback = null;
    fadeLoadingIndicatorOperation.cancel();
    try {
      await fadeLoadingIndicatorOperation.promise;
    } catch {}
    fadeLoadingIndicatorOperation = internal.fadeOut(loadingOverlay, 0.2);
    internal.state.syncPageToLocationCancellationCallback = fadeLoadingIndicatorOperation.cancel;
    try {
      await fadeLoadingIndicatorOperation.promise;
    } catch {
      return;
    }
    internal.state.syncPageToLocationCancellationCallback = null;
    loadingOverlay.style.display = 'none';
    internal.state.activePageElement = document.getElementById(pageConfig.elementId);
    internal.state.activePageElement.style.opacity = '0';
    internal.state.activePageElement.style.display = null;
    let fadeInOperation = internal.fadeIn(internal.state.activePageElement, 0.1);
    internal.state.syncPageToLocationCancellationCallback = fadeInOperation.cancel;
    try {
      await fadeInOperation.promise;
    } catch {
      return;
    }
    internal.state.syncPageToLocationCancellationCallback = null;
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

  'registerLoadPageCallback': (pathname, callback) => {
    internal.state.loadPageCallbacks[pathname] = callback;
  }

};
