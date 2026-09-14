(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const captureMode =
    new URLSearchParams(window.location.search).get('figma') === '1' ||
    root.dataset.figmaCapture === 'true' ||
    navigator.webdriver === true ||
    /HeadlessChrome|Playwright|Puppeteer/i.test(navigator.userAgent);

  const SELECTORS = [
    'main > section:not(:first-child)',
    '.v4-plp',
    '.v4-pdp-story',
    '.v4-related',
    '.maison-manifesto',
    '.maison-ritual',
    '.v4-route-index',
    '.v4-houses-section',
    '.v4-discovery-callout',
    '.v4-trust-line',
    '.v4-wardrobe',
    '.v5-after-wear',
    '.seller-grid',
    '.cart-layout',
    '.checkout-layout'
  ].join(',');

  const MEDIA_SELECTORS = [
    '.maison-ritual-media',
    '.v5-story-media',
    '.v5-shelf-story'
  ].join(',');

  const prepared = new Set();
  let observer = null;

  const revealNow = (node) => {
    node.classList.add('is-visible');
  };

  const failOpen = () => {
    root.classList.remove('violet-motion-ready');
    prepared.forEach(revealNow);
  };

  const prepareNode = (node, index = 0) => {
    if (!(node instanceof Element) || prepared.has(node)) return;
    if (node.closest('[data-site-header]')) return;

    prepared.add(node);
    node.dataset.violetMotion = node.matches(MEDIA_SELECTORS) ? 'media' : 'section';
    node.style.setProperty('--violet-motion-delay', `${Math.min(index, 4) * 55}ms`);

    if (reducedMotion || captureMode || !observer) {
      revealNow(node);
      return;
    }

    observer.observe(node);
  };

  const prepareScope = (scope = document) => {
    const candidates = [];

    if (scope instanceof Element && scope.matches(SELECTORS)) candidates.push(scope);
    scope.querySelectorAll?.(SELECTORS).forEach((node) => candidates.push(node));

    candidates.forEach((node, index) => prepareNode(node, index));
  };

  try {
    if (!reducedMotion && !captureMode && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealNow(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });
    }

    prepareScope();

    if (!reducedMotion && !captureMode && observer) {
      root.classList.add('violet-motion-ready');
    } else {
      prepared.forEach(revealNow);
    }

    const mutationObserver = new MutationObserver((mutations) => {
      let hasAddedContent = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          hasAddedContent = true;
          prepareScope(node);
        });
      });
      if (hasAddedContent && (reducedMotion || captureMode || !observer)) {
        prepared.forEach(revealNow);
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.warn('Violet motion system failed open', error);
    failOpen();
  }
})();
