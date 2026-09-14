(() => {
  const ensureStylesheet = (href, dataAttribute) => new Promise((resolve) => {
    const selector = `link[${dataAttribute}]`;
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(dataAttribute, 'true');
    link.addEventListener('load', () => resolve(link), { once: true });
    link.addEventListener('error', () => resolve(link), { once: true });
    document.head.append(link);
  });

  const ensureScript = (src, dataAttribute) => {
    if (document.querySelector(`script[${dataAttribute}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.setAttribute(dataAttribute, 'true');
    document.body.append(script);
  };

  const accessibilityReady = ensureStylesheet('accessibility-v6.css', 'data-violet-accessibility-v6');
  const motionReady = ensureStylesheet('motion-system.css?v=20260915-1', 'data-violet-motion-system');

  Promise.allSettled([accessibilityReady, motionReady]).then(() => {
    ensureScript('motion-system.js?v=20260915-1', 'data-violet-motion-runtime');
  });
})();
