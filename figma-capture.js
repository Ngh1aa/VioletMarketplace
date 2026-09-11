(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('figma') !== '1') return;

  const root = document.documentElement;
  root.classList.add('figma-capture');
  root.dataset.figmaReady = 'loading';
  window.__VIOLET_FIGMA_READY__ = false;

  const style = document.createElement('style');
  style.id = 'violet-figma-capture-style';
  style.textContent = `
    html.figma-capture { scroll-behavior: auto !important; }
    html.figma-capture *,
    html.figma-capture *::before,
    html.figma-capture *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }
    html.figma-capture .maison-reveal,
    html.figma-capture .maison-reveal.is-visible {
      opacity: 1 !important;
      transform: none !important;
    }
    html.figma-capture img {
      filter: none !important;
      animation: none !important;
      transition: none !important;
    }
  `;
  document.head.append(style);

  let quietTimer = 0;
  let generation = 0;

  function normalizeImage(img) {
    if (!(img instanceof HTMLImageElement)) return;
    img.loading = 'eager';
    img.decoding = 'sync';
    img.fetchPriority = img.getBoundingClientRect().top < innerHeight * 1.5 ? 'high' : 'auto';
  }

  function normalizeTree(node) {
    if (node instanceof HTMLImageElement) normalizeImage(node);
    node?.querySelectorAll?.('img').forEach(normalizeImage);
  }

  async function settleImage(img) {
    normalizeImage(img);
    if (img.complete) return img.naturalWidth > 0;
    return new Promise(resolve => {
      const done = () => resolve(img.naturalWidth > 0);
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      setTimeout(done, 8000);
    });
  }

  async function markReady(currentGeneration) {
    const images = [...document.images];
    const results = await Promise.all(images.map(settleImage));
    if (currentGeneration !== generation) return;

    const broken = images
      .filter((_, index) => !results[index])
      .map(img => img.currentSrc || img.src || '(unknown)');

    window.__VIOLET_FIGMA_CAPTURE__ = {
      imageCount: images.length,
      brokenImages: broken,
      readyAt: new Date().toISOString()
    };
    window.__VIOLET_FIGMA_READY__ = broken.length === 0;
    root.dataset.figmaReady = broken.length === 0 ? 'true' : 'broken-media';
  }

  function scheduleReadyCheck() {
    generation += 1;
    const currentGeneration = generation;
    clearTimeout(quietTimer);
    quietTimer = setTimeout(() => markReady(currentGeneration), 500);
  }

  normalizeTree(document);

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) normalizeTree(node);
    }
    scheduleReadyCheck();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleReadyCheck, { once: true });
  } else {
    scheduleReadyCheck();
  }
  window.addEventListener('load', scheduleReadyCheck, { once: true });
})();
