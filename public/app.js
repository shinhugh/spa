{
  if (window.location.pathname in config.titles) {
    document.title = config.titleBase + ': ' + config.titles[window.location.pathname];
  } else {
    document.title = config.titleBase;
  }

  for (let element of document.getElementsByClassName('page')) {
    element.style.display = 'none';
  };
  if (window.location.pathname in config.pageElementIds) {
    let element = document.getElementById(config.pageElementIds[window.location.pathname]);
    if (element) {
      element.style.display = null;
    }
  }
}
