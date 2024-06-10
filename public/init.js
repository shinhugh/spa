{

  window.addEventListener('popstate', async (event) => {
    await internal.syncPageToLocation();
  });

  history.replaceState({
    'pathname': window.location.pathname
  }, '', window.location.href);
  internal.syncPageToLocation();

}
