// js/color-scheme.js
(function () {
  const html = document.documentElement;
  const query = window.matchMedia('(prefers-color-scheme: dark)');

  const saved = localStorage.getItem('theme');
  const initialTheme = saved || (query.matches ? 'dark' : 'light');

  html.setAttribute('data-theme', initialTheme);

  const systemListener = (e) => {
    if (!localStorage.getItem('theme-manual')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  };

  if (query.addEventListener) {
    query.addEventListener('change', systemListener);
  } else {
    query.addListener(systemListener);
  }
})();
