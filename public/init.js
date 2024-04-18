{

  for (let element of document.getElementsByTagName('a')) {
    element.addEventListener('click', async (event) => {
      event.preventDefault();
      if (event.target.href === '' || event.target.href === window.location.href) {
        return;
      }
      await internal.navigate(event.target.href);
    });
  }

  window.addEventListener('popstate', async (event) => {
    for (let callback of internal.state.handleNavigationCallbacks) {
      callback(event.state.pathname);
    }
    await internal.syncPageToLocation();
  });

  history.replaceState({
    'pathname': window.location.pathname
  }, '', window.location.href);
  for (let callback of internal.state.handleNavigationCallbacks) {
    callback(window.location.pathname);
  }
  internal.syncPageToLocation();

}
