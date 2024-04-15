const internal = {
  'syncPageToLocation': async () => {
    // TODO: Cancel ongoing syncPageToLocation() if it exists
    let pageConfig = window.location.pathname in config.pages ? config.pages[window.location.pathname] : config.errorPages['404'];
    document.title = pageConfig.title;
    // TODO: Fade out old page if necessary
    for (let element of document.getElementsByClassName('page')) {
      element.style.display = 'none';
    };
    // TODO: Set opacity of new page to 0
    document.getElementById(pageConfig.elementId).style.display = null;
    // TODO: Fade in new page
  },
  'navigate': async (href) => {
    location = new URL(href);
    if (location.hostname !== window.location.hostname) {
      window.location = location;
      return;
    }
    history.pushState({
      'pathname': location.pathname
    }, '', location.href);
    await internal.syncPageToLocation();
  }
};

{
  for (let element of document.getElementsByTagName('a')) {
    element.addEventListener('click', async (event) => {
      event.preventDefault();
      await internal.navigate(event.target.href);
    });
  }

  window.addEventListener('popstate', async (event) => {
    await internal.syncPageToLocation();
  });

  history.replaceState({
    'pathname': window.location.pathname
  }, '', window.location.href);
  internal.syncPageToLocation();
}
