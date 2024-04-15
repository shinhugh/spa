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
