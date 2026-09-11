(() => {
  if (document.querySelector('link[data-violet-accessibility-v6]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'accessibility-v6.css';
  link.dataset.violetAccessibilityV6 = 'true';
  document.head.append(link);
})();
