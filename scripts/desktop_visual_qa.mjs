import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const outputDir = path.resolve(process.argv[2] || 'artifacts/desktop-visual-qa');
fs.mkdirSync(outputDir, { recursive: true });

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe'],
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(`${baseURL}/index.html`, { cache: 'no-store' });
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('Static server did not become ready.');
}

const pages = [
  { name: 'home', path: '/index.html', kind: 'home' },
  { name: 'library', path: '/search.html', kind: 'library' },
  { name: 'product-violette-03', path: '/product.html?id=violette-03', kind: 'product' },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});

const report = {
  status: 'passed',
  viewport: { width: 1440, height: 1000 },
  threshold: 92,
  pages: [],
  issues: [],
};

function issue(page, severity, code, message) {
  report.issues.push({ page, severity, code, message });
}

for (const spec of pages) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(String(error)));

  await page.goto(baseURL + spec.path, { waitUntil: 'networkidle', timeout: 45000 });
  await page.screenshot({
    path: path.join(outputDir, `${spec.name}-1440.png`),
    fullPage: true,
  });

  const metrics = await page.evaluate(kind => {
    const body = document.body;
    const doc = document.documentElement;
    const productGrid = document.querySelector('.product-grid');
    const hero = document.querySelector('.perfume-hero .hero-main');
    const nav = document.querySelector('.nav-inner');
    const detail = document.querySelector('.product-detail');
    const filter = document.querySelector('.filter-panel');
    const visible = element => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const columns = productGrid ? getComputedStyle(productGrid).gridTemplateColumns.split(' ').filter(Boolean).length : 0;
    const firstCard = document.querySelector('.product-card');
    const cardWidth = firstCard ? Math.round(firstCard.getBoundingClientRect().width) : 0;
    const heroHeight = hero ? Math.round(hero.getBoundingClientRect().height) : 0;
    const detailColumns = detail ? getComputedStyle(detail).gridTemplateColumns.split(' ').filter(Boolean).length : 0;

    return {
      kind,
      scrollWidth: Math.max(body.scrollWidth, doc.scrollWidth),
      clientWidth: doc.clientWidth,
      h1Count: document.querySelectorAll('h1').length,
      navVisible: visible(nav),
      heroHeight,
      gridColumns: columns,
      cardWidth,
      filterVisible: visible(filter),
      detailColumns,
      desktopSheetLoaded: [...document.styleSheets].some(sheet => String(sheet.href || '').includes('desktop-luxury-v2.css')),
    };
  }, spec.kind);

  if (consoleErrors.length) issue(spec.name, 'P0', 'console-error', consoleErrors.join(' | '));
  if (pageErrors.length) issue(spec.name, 'P0', 'page-error', pageErrors.join(' | '));
  if (metrics.scrollWidth > metrics.clientWidth + 2) issue(spec.name, 'P0', 'horizontal-overflow', `${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
  if (metrics.h1Count !== 1) issue(spec.name, 'P1', 'heading-structure', `Expected one h1, found ${metrics.h1Count}`);
  if (!metrics.navVisible) issue(spec.name, 'P1', 'desktop-navigation', 'Desktop navigation is not visible.');
  if (!metrics.desktopSheetLoaded) issue(spec.name, 'P0', 'desktop-layer', 'desktop-luxury-v2.css is not loaded.');

  if (spec.kind === 'home') {
    if (metrics.heroHeight < 620) issue(spec.name, 'P1', 'hero-presence', `Hero height is only ${metrics.heroHeight}px.`);
    if (metrics.gridColumns < 3) issue(spec.name, 'P1', 'editorial-grid', `Expected at least 3 product columns, got ${metrics.gridColumns}.`);
  }
  if (spec.kind === 'library') {
    if (!metrics.filterVisible) issue(spec.name, 'P1', 'filter-rail', 'Desktop scent filter rail is not visible.');
    if (metrics.gridColumns !== 3) issue(spec.name, 'P1', 'library-grid', `Expected 3 product columns, got ${metrics.gridColumns}.`);
    if (metrics.cardWidth < 220) issue(spec.name, 'P1', 'product-scale', `Product cards are too narrow at ${metrics.cardWidth}px.`);
  }
  if (spec.kind === 'product' && metrics.detailColumns < 2) {
    issue(spec.name, 'P1', 'pdp-composition', 'Desktop PDP should remain a two-column composition.');
  }

  report.pages.push({
    name: spec.name,
    url: baseURL + spec.path,
    metrics,
    consoleErrors,
    pageErrors,
  });

  await page.close();
}

const p0 = report.issues.filter(item => item.severity === 'P0').length;
const p1 = report.issues.filter(item => item.severity === 'P1').length;
const score = Math.max(0, 100 - p0 * 20 - p1 * 8);
report.score = score;
report.status = score >= report.threshold && p0 === 0 && p1 === 0 ? 'passed' : 'failed';

fs.writeFileSync(path.join(outputDir, 'desktop-visual-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: report.status, score, issues: report.issues }, null, 2));

await browser.close();
server.kill('SIGTERM');

if (report.status !== 'passed') process.exitCode = 1;
