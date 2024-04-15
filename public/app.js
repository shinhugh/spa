const app = {
  'navigate': (location) => {
    location = new URL(location);
    if (location.hostname !== window.location.hostname) {
      window.location = location;
    } else {
      history.pushState({
        'path': location.pathname
      }, '', location.href);
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
    }
  }
};
