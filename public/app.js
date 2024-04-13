{
  let setupPage = (pageConfig) => {
    document.getElementById(pageConfig.elementId).style.display = null;
    document.title = pageConfig.title;
  };

  for (let element of document.getElementsByClassName('page')) {
    element.style.display = 'none';
  };

  if (!(window.location.pathname in config.pages)) {
    setupPage(config.errorPages['404']);
  } else {
    setupPage(config.pages[window.location.pathname]);
  }
}
