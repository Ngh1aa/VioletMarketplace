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

  // Library contract: refinements are hidden by default and intentionally revealed on demand.
  {
    const page = await context.newPage();
    await page.goto(`${base}/search.html?sample=1`, { waitUntil: 'networkidle' });
    const before = await page.evaluate(() => {
      const header = document.querySelector('.site-header')?.getBoundingClientRect();
      const filter = document.querySelector('.v4-filter-rail');
      const toggle = document.querySelector('.explore-filter-toggle');
      const searchButton = document.querySelector('.search-form button')?.getBoundingClientRect();
      const cartCount = document.querySelector('.cart-count');
      return {
        header: header && { top: header.top, bottom: header.bottom, height: header.height },
        filterDisplay: filter ? getComputedStyle(filter).display : null,
        toggle: toggle ? { width: toggle.getBoundingClientRect().width, height: toggle.getBoundingClientRect().height, text: toggle.textContent } : null,
        searchButton: searchButton && { width: searchButton.width, height: searchButton.height },
        cartCountPosition: cartCount ? getComputedStyle(cartCount).position : null,
        visibleMysteryActions: [...document.querySelectorAll('.header-actions>.icon-link:not(.cart-link):not(.v5-trio-link)')].filter(el => {
          const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
        }).length
      };
    });
    if (before.filterDisplay !== 'none') fail('filter-not-progressive', `${width}px: refinement panel should be hidden by default`, before);
    if (!before.toggle || before.toggle.width < 70 || before.toggle.height < 24) fail('missing-filter-toggle', `${width}px: visible refinement trigger is missing or too small`, before);
    if (!before.searchButton || before.searchButton.width < 64 || before.searchButton.height < 40) fail('undersized-search-action', `${width}px: search submit control is too small`, before.searchButton);
    if (before.cartCountPosition !== 'static') fail('floating-cart-badge', `${width}px: bag count must participate in layout`, before);
    if (before.visibleMysteryActions !== 0) fail('mystery-header-action', `${width}px: cryptic buyer-header action remains visible`, before);

    await page.click('.explore-filter-toggle');
    const after = await page.evaluate(() => {
      const filter = document.querySelector('.v4-filter-rail');
      const r = filter?.getBoundingClientRect();
      const toolbar = document.querySelector('.v4-plp-toolbar')?.getBoundingClientRect();
      return {
        display: filter ? getComputedStyle(filter).display : null,
        rect: r && { top: r.top, bottom: r.bottom, width: r.width, height: r.height },
        toolbar: toolbar && { top: toolbar.top, bottom: toolbar.bottom, width: toolbar.width }
      };
    });
    if (after.display === 'none' || !after.rect || after.rect.height < 80) fail('filter-reveal-failed', `${width}px: refinement panel did not reveal intentionally`, after);
    if (after.rect && after.toolbar && Math.abs(after.rect.width - after.toolbar.width) > 42) fail('filter-reveal-misalignment', `${width}px: revealed filters should align with results width`, after);
    await instantScroll(page, 220);
    const stickyHeader = await page.evaluate(() => document.querySelector('.site-header')?.getBoundingClientRect().top ?? 999);
    if (Math.abs(stickyHeader) > 2) fail('sticky-header', `${width}px: header must remain pinned after scroll`, { stickyHeader });
    await commonHealth(page, `library-${width}`);
    await page.screenshot({ path: path.join(out, `library-${width}.png`), fullPage: false });
    record('progressive-filter', { width, before, after });
    await page.close();
  }

  // PDP: the sticky media is bounded to the opening 60/40 composition and must never collide with Story.
  {
    const page = await context.newPage();
    await page.goto(`${base}/product.html?id=violette-03`, { waitUntil: 'networkidle' });
    await commonHealth(page, `pdp-${width}`);
    const intro = await page.evaluate(() => {
      const wrap = document.querySelector('.explore-pdp-intro')?.getBoundingClientRect();
      const media = document.querySelector('.v4-pdp-media')?.getBoundingClientRect();
      const desk = document.querySelector('.v4-buying-desk')?.getBoundingClientRect();
      return wrap && media && desk ? { wrap: { width: wrap.width }, media: { width: media.width }, desk: { width: desk.width }, mediaRatio: media.width / wrap.width } : null;
    });
    if (!intro || intro.mediaRatio < .55 || intro.mediaRatio > .69) fail('pdp-ratio', `${width}px: PDP opening should remain approximately 60/40`, intro);
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const positions = [0, 500, 900, 1300, 1700, 2200].filter(y => y < scrollHeight);
    for (const y of positions) {
      await instantScroll(page, y);
      const boxes = await page.evaluate(() => {
        const pick = selector => {
          const r = document.querySelector(selector)?.getBoundingClientRect();
          return r && { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
        };
        return { media: pick('.v4-pdp-media'), desk: pick('.v4-buying-desk'), story: pick('.v4-pdp-story') };
      });
      if (boxes.media && boxes.story && intersection(boxes.media, boxes.story) > 8) fail('pdp-media-overlap', `${width}px: sticky media overlaps story at scrollY=${y}`, boxes);
      if (boxes.desk && boxes.story && intersection(boxes.desk, boxes.story) > 8) fail('pdp-section-overlap', `${width}px: buying desk overlaps story at scrollY=${y}`, boxes);
      await textOverlapScan(page, `pdp-${width}`, y);
    }
    await instantScroll(page, 1100);
    await page.screenshot({ path: path.join(out, `pdp-scroll-${width}.png`), fullPage: false });
    record('pdp-bounded-sticky', { width, intro });
    await page.close();
  }

  // Houses: horizontal movement must be intentional and contained inside the ledger, never on the body.
  {
    const page = await context.newPage();
    await page.goto(`${base}/houses.html`, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => {
      const ledger = document.querySelector('.v4-houses-ledger');
      const first = ledger?.querySelector('.v4-house-ledger-row');
      const note = document.querySelector('.v4-houses-note');
      const h2 = note?.querySelector('h2');
      const ls = ledger ? getComputedStyle(ledger) : null;
      return {
        bodyScrollWidth: document.documentElement.scrollWidth,
        bodyClientWidth: document.documentElement.clientWidth,
        ledgerOverflowX: ls?.overflowX || '',
        ledgerScrollable: ledger ? ledger.scrollWidth > ledger.clientWidth + 20 : false,
        firstWidth: first?.getBoundingClientRect().width || 0,
        noteHeight: note?.getBoundingClientRect().height || 0,
        noteBackground: note ? getComputedStyle(note).backgroundColor : '',
        headingSize: h2 ? parseFloat(getComputedStyle(h2).fontSize) : 0
      };
    });
    if (!data.ledgerScrollable || !['auto','scroll'].includes(data.ledgerOverflowX)) fail('houses-not-horizontal', `${width}px: Houses index should be an intentional horizontal gallery`, data);
    if (data.firstWidth < width * .48) fail('houses-card-too-small', `${width}px: each maison should feel like a room, not a narrow list row`, data);
    if (data.bodyScrollWidth > data.bodyClientWidth + 2) fail('horizontal-overflow', `${width}px: horizontal Houses movement leaked to the page body`, data);
    if (data.noteHeight > 340 || data.headingSize < 26 || data.noteBackground === 'rgba(0, 0, 0, 0)') fail('unstyled-migrated-section', `${width}px: Why Houses section lacks intentional compact styling`, data);
    await page.locator('.v4-houses-ledger').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, `houses-horizontal-${width}.png`), fullPage: false });
    record('houses-horizontal', { width, data });
    await page.close();
  }

  // Discovery: new contract is viewport-scale journey, but the empty tray itself stays compact.
  {
    const page = await context.newPage();
    await page.goto(`${base}/discovery.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.removeItem('violet-discovery-trio-v1'));
    await page.reload({ waitUntil: 'networkidle' });
    const data = await page.evaluate(() => ({
      workspaceHeight: document.querySelector('.v4-discovery-workspace')?.getBoundingClientRect().height || 0,
      emptyHeight: document.querySelector('.v4-trio-empty')?.getBoundingClientRect().height || 0,
      viewportHeight: innerHeight,
      workspaceBackground: getComputedStyle(document.querySelector('.v4-discovery-workspace')).backgroundColor
    }));
    if (data.workspaceHeight < data.viewportHeight * .72 || data.workspaceHeight > data.viewportHeight * 1.12) fail('discovery-not-viewport-paced', `${width}px: discovery workspace should read as one deliberate viewport-scale step`, data);
    if (data.emptyHeight > 190) fail('oversized-empty-state', `${width}px: discovery empty tray itself is too tall`, data);
    if (data.workspaceBackground === 'rgba(0, 0, 0, 0)' || data.workspaceBackground === 'rgb(255, 255, 255)') fail('discovery-no-state-field', `${width}px: discovery step needs a distinct pastel journey field`, data);
    await commonHealth(page, `discovery-${width}`);
    await page.locator('.v4-discovery-workspace').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, `discovery-empty-${width}.png`), fullPage: false });
    record('discovery-viewport-step', { width, data });
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
