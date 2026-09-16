(() => {
  const params = new URLSearchParams(location.search);
  const captureMode = params.get('figma') === '1';

  const root = document.documentElement;
  root.dataset.figmaTransport = 'loading';
  window.__VIOLET_FIGMA_READY__ = false;

  if (captureMode) {
    root.classList.add('figma-capture');
    root.dataset.figmaReady = 'loading';

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
  }

  let quietTimer = 0;
  let generation = 0;

  function toAbsoluteUrl(value) {
    if (!value || /^(?:data:|blob:|#)/i.test(value)) return value;
    try {
      return new URL(value, document.baseURI).href;
    } catch {
      return value;
    }
  }

  function toAbsoluteSrcset(value) {
    if (!value) return value;
    return value
      .split(',')
      .map(candidate => {
        const trimmed = candidate.trim();
        if (!trimmed) return trimmed;
        const parts = trimmed.split(/\s+/);
        parts[0] = toAbsoluteUrl(parts[0]);
        return parts.join(' ');
      })
      .join(', ');
  }

  function normalizeSource(source) {
    if (!(source instanceof HTMLSourceElement)) return;
    const srcset = source.getAttribute('srcset') || source.dataset.srcset;
    if (srcset) source.setAttribute('srcset', toAbsoluteSrcset(srcset));
  }

  function normalizeImage(img) {
    if (!(img instanceof HTMLImageElement)) return;

    const deferredSrc = img.dataset.src || img.dataset.lazySrc;
    const deferredSrcset = img.dataset.srcset || img.dataset.lazySrcset;
    if ((!img.getAttribute('src') || img.getAttribute('src') === 'about:blank') && deferredSrc) {
      img.setAttribute('src', deferredSrc);
    }
    if (!img.getAttribute('srcset') && deferredSrcset) {
      img.setAttribute('srcset', deferredSrcset);
    }

    const src = img.getAttribute('src');
    const srcset = img.getAttribute('srcset');
    if (src) img.setAttribute('src', toAbsoluteUrl(src));
    if (srcset) img.setAttribute('srcset', toAbsoluteSrcset(srcset));

    // Figma URL importers often capture the page before off-screen lazy images
    // are requested. Keep the site Figma-safe even when the user pastes the
    // normal GitHub Pages URL without adding ?figma=1.
    img.loading = 'eager';
    img.decoding = 'sync';
    img.fetchPriority = img.getBoundingClientRect().top < innerHeight * 3 ? 'high' : 'auto';
    img.dataset.figmaSrc = img.currentSrc || img.src;
  }

  function normalizeTree(node) {
    if (node instanceof HTMLImageElement) normalizeImage(node);
    if (node instanceof HTMLSourceElement) normalizeSource(node);
    node?.querySelectorAll?.('img').forEach(normalizeImage);
    node?.querySelectorAll?.('picture source[srcset], source[data-srcset], source[data-lazy-srcset]').forEach(normalizeSource);
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
    const nonAbsolute = images
      .map(img => img.getAttribute('src') || '')
      .filter(src => src && !/^(?:https?:|data:|blob:)/i.test(src));

    window.__VIOLET_FIGMA_CAPTURE__ = {
      captureMode,
      imageCount: images.length,
      brokenImages: broken,
      nonAbsoluteImages: nonAbsolute,
      readyAt: new Date().toISOString()
    };
    window.__VIOLET_FIGMA_READY__ = broken.length === 0 && nonAbsolute.length === 0;
    root.dataset.figmaTransport = window.__VIOLET_FIGMA_READY__ ? 'true' : 'broken-media';
    if (captureMode) root.dataset.figmaReady = root.dataset.figmaTransport;
  }

  function scheduleReadyCheck() {
    generation += 1;
    const currentGeneration = generation;
    clearTimeout(quietTimer);
    quietTimer = setTimeout(() => markReady(currentGeneration), 500);
  }

  // Transport normalization is intentionally always-on. The visual capture
  // overrides above remain opt-in via ?figma=1 so normal browsing keeps motion.
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
