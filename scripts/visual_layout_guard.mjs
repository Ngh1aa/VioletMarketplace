import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const out = path.resolve(process.argv[2] || 'artifacts/visual-layout-guard');
fs.mkdirSync(out, { recursive: true });
const port = 4179;
const base = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe']
});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitServer() {
  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(`${base}/index.html`, { cache: 'no-store' });
      if (response.ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('visual guard server did not start');
}

const report = { status: 'passed', issues: [], checks: [], viewportWidths: [1280, 1440, 1600] };
const fail = (code, message, detail = null) => report.issues.push({ code, message, detail });
const record = (name, data) => report.checks.push({ name, ...data });

function intersection(a, b) {
  const left = Math.max(a.left, b.left);
  const right = Math.min(a.right, b.right);
  const top = Math.max(a.top, b.top);
  const bottom = Math.min(a.bottom, b.bottom);
  if (right <= left || bottom <= top) return 0;
  return (right - left) * (bottom - top);
}

async function instantScroll(page, y) {
  await page.evaluate(value => {
    document.documentElement.style.scrollBehavior = 'auto';
    if (document.body) document.body.style.scrollBehavior = 'auto';
    window.scrollTo(0, value);
  }, y);
  await page.waitForTimeout(40);
}

async function commonHealth(page, name) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src)
  }));
  if (metrics.scrollWidth > metrics.clientWidth + 2) fail('horizontal-overflow', `${name}: ${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
  if (metrics.brokenImages.length) fail('broken-image', `${name}: broken rendered media`, metrics.brokenImages);
  return metrics;
}

async function textOverlapScan(page, name, scrollY) {
  await instantScroll(page, scrollY);
  const overlaps = await page.evaluate(() => {
    const viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
    const visible = el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
    };
    const area = r => Math.max(0, r.width) * Math.max(0, r.height);
    const intersect = (a, b) => {
      const left = Math.max(a.left, b.left, viewport.left);
      const right = Math.min(a.right, b.right, viewport.right);
      const top = Math.max(a.top, b.top, viewport.top);
      const bottom = Math.min(a.bottom, b.bottom, viewport.bottom);
      return right > left && bottom > top ? (right - left) * (bottom - top) : 0;
    };
    const nodes = [...document.querySelectorAll('main h1,main h2,main h3,main p,main button')].filter(visible);
    const hits = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        if (a.contains(b) || b.contains(a)) continue;
        const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
        const overlap = intersect(ar, br);
        const smaller = Math.min(area(ar), area(br));
        if (smaller > 0 && overlap / smaller > 0.22) {
          hits.push({
            a: `${a.tagName.toLowerCase()}.${a.className || ''}`,
            b: `${b.tagName.toLowerCase()}.${b.className || ''}`,
            ratio: Number((overlap / smaller).toFixed(2))
          });
        }
      }
    }
    return hits.slice(0, 12);
  });
  if (overlaps.length) fail('text-overlap', `${name}: semantic text blocks overlap at scrollY=${scrollY}`, overlaps);
}

await waitServer();
const browser = await chromium.launch({ headless: true });

for (const width of report.viewportWidths) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, colorScheme: 'light' });

  // Header + filter: catches the old sticky-parent trap and dead filter column.
  // First check natural column alignment. Then, only if the document can scroll far
  // enough to cross the sticky threshold, assert the sticky offset against the real header.
  {
    const page = await context.newPage();
    await page.goto(`${base}/search.html?sample=1`, { waitUntil: 'networkidle' });
    const scrollPlan = await page.evaluate(() => {
      const filter = document.querySelector('.v4-filter-rail');
      const results = document.querySelector('.v4-plp-results');
      const filterDocumentTop = filter ? filter.getBoundingClientRect().top + scrollY : 0;
      const resultsDocumentTop = results ? results.getBoundingClientRect().top + scrollY : 0;
      const stickyTop = filter ? parseFloat(getComputedStyle(filter).top) || 0 : 0;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      const stickyThreshold = Math.max(0, filterDocumentTop - stickyTop);
      return {
        filterDocumentTop,
        resultsDocumentTop,
        stickyTop,
        stickyThreshold,
        maxScroll,
        targetScroll: Math.min(filterDocumentTop + 220, maxScroll),
        canReachSticky: maxScroll >= stickyThreshold + 4
      };
    });
    if (Math.abs(scrollPlan.filterDocumentTop - scrollPlan.resultsDocumentTop) > 32) {
      fail('filter-column-misalignment', `${width}px: filter rail starts far below the results column`, scrollPlan);
    }
    await instantScroll(page, scrollPlan.targetScroll);
    const data = await page.evaluate(() => {
      const header = document.querySelector('.site-header')?.getBoundingClientRect();
      const filter = document.querySelector('.v4-filter-rail')?.getBoundingClientRect();
      const searchButton = document.querySelector('.search-form button')?.getBoundingClientRect();
      const cartCount = document.querySelector('.cart-count');
      return {
        actualScrollY: scrollY,
        header: header && { top: header.top, bottom: header.bottom, height: header.height },
        filter: filter && { top: filter.top },
        searchButton: searchButton && { width: searchButton.width, height: searchButton.height },
        cartCountPosition: cartCount ? getComputedStyle(cartCount).position : null,
        visibleMysteryActions: [...document.querySelectorAll('.header-actions>.icon-link:not(.cart-link)')].filter(el => {
          const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
        }).length
      };
    });
    data.scrollPlan = scrollPlan;
    if (!data.header || Math.abs(data.header.top) > 2) fail('sticky-header', `${width}px: header must remain pinned after scroll`, data);
    if (scrollPlan.canReachSticky && (!data.filter || !data.header || data.filter.top < data.header.bottom - 2 || data.filter.top - data.header.bottom > 24)) {
      fail('filter-dead-offset', `${width}px: sticky filter rail must sit directly below the rendered header once sticky`, data);
    }
    if (!data.searchButton || data.searchButton.width < 64 || data.searchButton.height < 40) fail('undersized-search-action', `${width}px: search submit control is too small`, data.searchButton);
    if (data.cartCountPosition !== 'static') fail('floating-cart-badge', `${width}px: bag count must participate in layout`, data);
    if (data.visibleMysteryActions !== 0) fail('mystery-header-action', `${width}px: cryptic buyer-header action remains visible`, data);
    await commonHealth(page, `library-${width}`);
    await page.screenshot({ path: path.join(out, `library-${width}.png`), fullPage: false });
    record('header-filter', { width, data });
    await page.close();
  }

  // PDP: explicitly test the old buying-desk / story collision while scrolling.
  {
    const page = await context.newPage();
    await page.goto(`${base}/product.html?id=violette-03`, { waitUntil: 'networkidle' });
    await commonHealth(page, `pdp-${width}`);
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const positions = [0, 500, 900, 1300, 1700, 2200].filter(y => y < scrollHeight);
    for (const y of positions) {
      await instantScroll(page, y);
      const boxes = await page.evaluate(() => {
        const pick = selector => {
          const r = document.querySelector(selector)?.getBoundingClientRect();
          return r && { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
        };
        return { desk: pick('.v4-buying-desk'), story: pick('.v4-pdp-story') };
      });
      if (boxes.desk && boxes.story && intersection(boxes.desk, boxes.story) > 8) fail('pdp-section-overlap', `${width}px: buying desk overlaps story at scrollY=${y}`, boxes);
      await textOverlapScan(page, `pdp-${width}`, y);
    }
    await instantScroll(page, 1100);
    await page.screenshot({ path: path.join(out, `pdp-scroll-${width}.png`), fullPage: false });
    await page.close();
  }

  // Houses: migrated blocks must have intentional typography, density and media.
  {
    const page = await context.newPage();
    await page.goto(`${base}/houses.html`, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => {
      const note = document.querySelector('.v4-houses-note');
      const h2 = note?.querySelector('h2');
      const r = note?.getBoundingClientRect();
      const pseudo = note ? getComputedStyle(note, '::after') : null;
      const h2Style = h2 ? getComputedStyle(h2) : null;
      return {
        height: r?.height || 0,
        display: note ? getComputedStyle(note).display : null,
        headingFont: h2Style?.fontFamily || '',
        headingSize: h2Style ? parseFloat(h2Style.fontSize) : 0,
        editorialMedia: pseudo?.backgroundImage || 'none'
      };
    });
    if (data.display !== 'grid' || data.headingSize < 26 || data.height > 300 || data.editorialMedia === 'none') fail('unstyled-migrated-section', `${width}px: Why Houses section lost intentional styling`, data);
    await commonHealth(page, `houses-${width}`);
    await page.locator('.v4-houses-note').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, `houses-note-${width}.png`), fullPage: false });
    record('houses-note', { width, data });
    await page.close();
  }

  // Discovery: empty state must remain content-driven rather than reserving half a viewport.
  {
    const page = await context.newPage();
    await page.goto(`${base}/discovery.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.removeItem('violet-discovery-trio-v1'));
    await page.reload({ waitUntil: 'networkidle' });
    const data = await page.evaluate(() => ({
      workspaceHeight: document.querySelector('.v4-discovery-workspace')?.getBoundingClientRect().height || 0,
      emptyHeight: document.querySelector('.v4-trio-empty')?.getBoundingClientRect().height || 0
    }));
    if (data.workspaceHeight > 430 || data.emptyHeight > 190) fail('oversized-empty-state', `${width}px: discovery empty state wastes too much viewport`, data);
    await commonHealth(page, `discovery-${width}`);
    await page.locator('.v4-discovery-workspace').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, `discovery-empty-${width}.png`), fullPage: false });
    record('discovery-empty', { width, data });
    await page.close();
  }

  // Finder: question copy must have a visual counterweight and bounded type scale.
  {
    const page = await context.newPage();
    await page.goto(`${base}/finder.html`, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => {
      const q = document.querySelector('.portrait-question');
      const h2 = q?.querySelector('h2');
      const pseudo = q ? getComputedStyle(q, '::after') : null;
      const style = q ? getComputedStyle(q) : null;
      return {
        columns: style?.gridTemplateColumns || '',
        headingSize: h2 ? parseFloat(getComputedStyle(h2).fontSize) : 0,
        visual: pseudo?.backgroundImage || 'none'
      };
    });
    if (!data.columns.includes('px') || data.headingSize > 50 || data.visual === 'none') fail('text-heavy-question', `${width}px: Scent Portrait question lacks visual counterweight or safe type scale`, data);
    await commonHealth(page, `finder-${width}`);
    await page.locator('.portrait-question').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, `finder-question-${width}.png`), fullPage: false });
    record('finder-question', { width, data });
    await page.close();
  }

  await context.close();
}

report.status = report.issues.length ? 'failed' : 'passed';
fs.writeFileSync(path.join(out, 'visual-layout-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: report.status, issueCount: report.issues.length, issues: report.issues }, null, 2));
await browser.close();
server.kill('SIGTERM');
if (report.status !== 'passed') process.exitCode = 1;
