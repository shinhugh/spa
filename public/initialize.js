{
  let navigate = (path, replace) => {
    let location = new URL(window.location.href);
    location.pathname = path;
    if (replace) {
      history.replaceState({
        'path': location.pathname
      }, '', location.href);
    }
    for (let element of document.getElementsByClassName('page')) {
      element.style.display = 'none';
    };
    if (!(location.pathname in config.pages)) {
      document.getElementById(config.errorPages['404'].elementId).style.display = null;
      document.title = config.errorPages['404'].title;
    } else {
      document.getElementById(config.pages[location.pathname].elementId).style.display = null;
      document.title = config.pages[location.pathname].title;
    }
  };

  for (let element of document.getElementsByTagName('a')) {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      app.navigate(event.target.href);
    });
  }

  window.addEventListener('popstate', (event) => {
    navigate(event.state.path);
  });

  navigate(window.location.pathname, true);
}
