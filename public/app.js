{
  let titleBase = 'App';
  let titles = {
    '/404': '404',
    '/a': 'A',
    '/b': 'B'
  };
  let pageElementIds = {
    '/404': 'page_404',
    '/': 'page_root',
    '/a': 'page_a',
    '/b': 'page_b'
  };

  if (window.location.pathname in titles) {
    document.title = titleBase + ': ' + titles[window.location.pathname];
  } else {
    document.title = titleBase;
  }

  for (let element of document.getElementsByClassName('page')) {
    element.style.display = 'none';
  };
  if (window.location.pathname in pageElementIds) {
    let element = document.getElementById(pageElementIds[window.location.pathname]);
    if (element) {
      element.style.display = null;
    }
  }
}
