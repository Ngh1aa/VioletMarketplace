import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const out = path.resolve(process.argv[2] || 'artifacts/evidence-qa');
fs.mkdirSync(out, { recursive: true });
const port = 4181;
const base = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitServer() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(`${base}/design-system.html`, { cache: 'no-store' });
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('evidence server not ready');
}

const routes = ['design-system.html', 'component-states.html', 'sitemap.html', 'user-flows.html', 'prototype.html'];
const viewports = [{ width: 1440, height: 1000, label: 'desktop' }, { width: 390, height: 844, label: 'mobile' }];
const report = { status: 'passed', pages: [], issues: [] };
const issue = (page, viewport, code, message) => report.issues.push({ page, viewport, code, message });

await waitServer();
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, colorScheme: 'light' });
  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', error => pageErrors.push(String(error)));
    await page.goto(`${base}/${route}`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForFunction(() => document.documentElement.dataset.figmaTransport === 'true', { timeout: 12000 }).catch(() => {});
    const metrics = await page.evaluate(() => ({
      bodyClass: document.body.classList.contains('evidence-body'),
      h1Count: document.querySelectorAll('h1').length,
      navCount: document.querySelectorAll('.evidence-nav a').length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      figmaTransport: document.documentElement.dataset.figmaTransport || null,
      broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src),
      incomplete: [...document.images].filter(img => !img.complete).map(img => img.currentSrc || img.src)
    }));
    if (!metrics.bodyClass) issue(route, viewport.label, 'evidence-contract', 'Missing evidence-body contract.');
    if (metrics.h1Count !== 1) issue(route, viewport.label, 'heading', `Expected one h1, got ${metrics.h1Count}.`);
    if (metrics.navCount !== 5) issue(route, viewport.label, 'evidence-nav', `Expected five evidence links, got ${metrics.navCount}.`);
    if (metrics.scrollWidth > metrics.clientWidth + 2) issue(route, viewport.label, 'overflow', `${metrics.scrollWidth} > ${metrics.clientWidth}`);
    if (metrics.broken.length) issue(route, viewport.label, 'broken-image', metrics.broken.join(' | '));
    if (metrics.incomplete.length) issue(route, viewport.label, 'incomplete-image', metrics.incomplete.join(' | '));
    if (metrics.figmaTransport !== 'true') issue(route, viewport.label, 'figma-transport', `Expected true, got ${metrics.figmaTransport}.`);
    if (consoleErrors.length) issue(route, viewport.label, 'console-error', consoleErrors.join(' | '));
    if (pageErrors.length) issue(route, viewport.label, 'page-error', pageErrors.join(' | '));
    await page.screenshot({ path: path.join(out, `${route.replace('.html', '')}-${viewport.label}.png`), fullPage: true });
    report.pages.push({ route, viewport: viewport.label, metrics, consoleErrors, pageErrors });
    await page.close();
  }
  await context.close();
}

report.status = report.issues.length ? 'failed' : 'passed';
fs.writeFileSync(path.join(out, 'evidence-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: report.status, issues: report.issues }, null, 2));
await browser.close();
server.kill('SIGTERM');
if (report.status !== 'passed') process.exitCode = 1;
