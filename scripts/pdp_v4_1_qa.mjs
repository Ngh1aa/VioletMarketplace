import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const out = path.resolve(process.argv[2] || 'artifacts/pdp-v4-1-qa');
fs.mkdirSync(out, { recursive: true });
const port = 4181;
const base = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitServer() {
  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(`${base}/product.html?id=violette-03`, { cache: 'no-store' });
      if (response.ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('server not ready');
}

const report = {
  status: 'passed',
  threshold: 96,
  contract: 'pdp-v4-1-media-dominant-recovery',
  issues: [],
  viewports: [],
  interactions: {},
};
const issue = (viewport, severity, code, message) => report.issues.push({ viewport, severity, code, message });

const intersectionArea = (a, b) => {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
};

async function settleImages(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    await Promise.all([...document.images].map(img => img.decode?.().catch(() => {}) || Promise.resolve()));
  });
  await page.waitForTimeout(220);
}

async function geometry(page) {
  return page.evaluate(() => {
    const rect = selector => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
    };
    const visibleBroken = [...document.images].filter(img => {
      const r = img.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && img.complete && img.naturalWidth === 0;
    }).map(img => img.currentSrc || img.src);
    const incomplete = [...document.images].filter(img => !img.complete).map(img => img.currentSrc || img.src);
    const frame = rect('[data-pdp-primary-frame]');
    const gallery = rect('[data-pdp-gallery]');
    const sticky = rect('[data-pdp-sticky]');
    const story = rect('[data-pdp-story]');
    const related = rect('[data-pdp-related]');
    const computedSticky = document.querySelector('[data-pdp-sticky]') ? getComputedStyle(document.querySelector('[data-pdp-sticky]')).position : null;
    return {
      frame, gallery, sticky, story, related, computedSticky,
      mediaRoles:[...document.querySelectorAll('[data-pdp-media-role]')].map(el => el.getAttribute('data-pdp-media-role')),
      h1Count:document.querySelectorAll('h1').length,
      relatedCount:document.querySelectorAll('.pdp41-related-card').length,
      scrollWidth:document.documentElement.scrollWidth,
      clientWidth:document.documentElement.clientWidth,
      broken:visibleBroken,
      incomplete,
      hasSingleSizeButton:!!document.querySelector('.v4-size-row button'),
      oldStickyMedia:getComputedStyle(document.querySelector('.v4-pdp-media') || document.body).position === 'sticky' && !!document.querySelector('.v4-pdp-media'),
      bodyText:document.body.textContent || '',
    };
  });
}

async function captureState(page, width, stateName, y) {
  await page.evaluate(value => window.scrollTo({ top:value, behavior:'instant' }), Math.max(0, y));
  await page.waitForTimeout(180);
  const state = await geometry(page);
  if (state.sticky && state.story && intersectionArea(state.sticky, state.story) > 4) {
    issue(`${width}-${stateName}`, 'P0', 'sticky-story-overlap', `intersection=${intersectionArea(state.sticky, state.story).toFixed(1)}`);
  }
  if (state.sticky && state.related && intersectionArea(state.sticky, state.related) > 4) {
    issue(`${width}-${stateName}`, 'P0', 'sticky-related-overlap', `intersection=${intersectionArea(state.sticky, state.related).toFixed(1)}`);
  }
  await page.screenshot({ path:path.join(out, `pdp-${width}-${stateName}.png`), fullPage:false });
  return state;
}

await waitServer();
const browser = await chromium.launch({ headless:true });

for (const width of [1280, 1440, 1600]) {
  const context = await browser.newContext({ viewport:{ width, height:1000 }, deviceScaleFactor:1, colorScheme:'light' });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto(`${base}/product.html?id=violette-03`, { waitUntil:'networkidle', timeout:45000 });
  await settleImages(page);

  const initial = await geometry(page);
  if (!initial.frame || !initial.gallery || !initial.sticky || !initial.story || !initial.related) issue(width, 'P0', 'missing-contract-surface', JSON.stringify(initial));
  if (initial.frame && initial.gallery) {
    const ratio = initial.gallery.width / initial.frame.width;
    if (ratio < 0.66 || ratio > 0.74) issue(width, 'P1', 'media-ratio', `gallery/frame=${ratio.toFixed(3)} expected ~0.70`);
  }
  if (initial.mediaRoles.length < 5) issue(width, 'P1', 'media-role-count', `expected >=5 media roles, got ${initial.mediaRoles.length}`);
  if (!initial.mediaRoles.includes('bottle-hero') || !initial.mediaRoles.includes('cap-atomizer-detail') || !initial.mediaRoles.includes('glass-label-detail')) issue(width, 'P1', 'product-media-roles', initial.mediaRoles.join(', '));
  if (initial.h1Count !== 1) issue(width, 'P1', 'heading', `expected 1 h1, got ${initial.h1Count}`);
  if (initial.relatedCount !== 3) issue(width, 'P1', 'related-count', `expected 3, got ${initial.relatedCount}`);
  if (initial.scrollWidth > initial.clientWidth + 2) issue(width, 'P0', 'horizontal-overflow', `${initial.scrollWidth}>${initial.clientWidth}`);
  if (initial.broken.length) issue(width, 'P0', 'broken-image', initial.broken.join(' | '));
  if (initial.incomplete.length) issue(width, 'P0', 'incomplete-image', initial.incomplete.join(' | '));
  if (initial.oldStickyMedia) issue(width, 'P0', 'legacy-sticky-media', 'Old oversized media remains sticky.');
  if (initial.hasSingleSizeButton) issue(width, 'P1', 'false-size-affordance', 'Single size is still rendered as an interactive selector.');
  if (initial.bodyText.includes('in prototype inventory')) issue(width, 'P1', 'prototype-inventory-copy', 'Prototype inventory wording still interrupts the price row.');
  if (!initial.bodyText.includes('Build a trio of 3 scents to compare')) issue(width, 'P1', 'trial-clarity', 'Discovery trio microcopy missing.');
  if (consoleErrors.length) issue(width, 'P0', 'console-error', consoleErrors.join(' | '));
  if (pageErrors.length) issue(width, 'P0', 'page-error', pageErrors.join(' | '));

  const positions = await page.evaluate(() => ({
    galleryMid: document.querySelector('[data-pdp-gallery]').offsetTop + document.querySelector('[data-pdp-gallery]').offsetHeight * .45,
    story: document.querySelector('[data-pdp-story]').offsetTop - 120,
    related: document.querySelector('[data-pdp-related]').offsetTop - 120,
    bottom: document.documentElement.scrollHeight - innerHeight,
  }));

  const captures = {};
  captures.top = await captureState(page, width, 'top', 0);
  captures.midGallery = await captureState(page, width, 'mid-gallery', positions.galleryMid);
  captures.story = await captureState(page, width, 'story-start', positions.story);
  captures.related = await captureState(page, width, 'related-start', positions.related);
  captures.bottom = await captureState(page, width, 'bottom', positions.bottom);

  report.viewports.push({ width, mediaRatio:initial.frame && initial.gallery ? initial.gallery.width / initial.frame.width : null, roles:initial.mediaRoles, captures });

  if (width === 1440) {
    await page.evaluate(() => {
      localStorage.removeItem('violet-discovery-trio-v1');
      localStorage.setItem('violet-marketplace-cart-v1', '[]');
      window.scrollTo(0, 0);
    });
    await page.reload({ waitUntil:'networkidle' });
    await settleImages(page);
    const trioButton = page.locator('[data-pdp-add-trio]');
    const bottleButton = page.locator('[data-pdp-add-bottle]');
    if (await trioButton.count() !== 1) issue(width, 'P0', 'trio-button', 'Discovery trio action missing.');
    else await trioButton.click();
    if (await bottleButton.count() !== 1) issue(width, 'P0', 'bottle-button', 'Bottle action missing.');
    else await bottleButton.click();
    const stored = await page.evaluate(() => ({
      trio:JSON.parse(localStorage.getItem('violet-discovery-trio-v1') || '[]'),
      cart:JSON.parse(localStorage.getItem('violet-marketplace-cart-v1') || '[]'),
    }));
    if (!stored.trio.includes('violette-03')) issue(width, 'P0', 'trio-state', JSON.stringify(stored));
    if (!stored.cart.some(row => row.id === 'violette-03')) issue(width, 'P0', 'cart-state', JSON.stringify(stored));
    report.interactions = stored;
  }

  await context.close();
}

const p0 = report.issues.filter(row => row.severity === 'P0').length;
const p1 = report.issues.filter(row => row.severity === 'P1').length;
report.score = Math.max(0, 100 - p0 * 20 - p1 * 7);
report.status = report.score >= report.threshold && p0 === 0 && p1 === 0 ? 'passed' : 'failed';
fs.writeFileSync(path.join(out, 'pdp-v4-1-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status:report.status, score:report.score, p0, p1, issues:report.issues }, null, 2));

await browser.close();
server.kill('SIGTERM');
if (report.status !== 'passed') process.exitCode = 1;
