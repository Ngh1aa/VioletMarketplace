import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const outputDir = path.resolve(process.argv[2] || 'artifacts/storefront-v3-qa');
fs.mkdirSync(outputDir, { recursive: true });

const port = 4175;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'],
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitForServer(){
  for(let i = 0; i < 40; i += 1){
    try { const response = await fetch(`${baseURL}/index.html`, { cache:'no-store' }); if(response.ok) return; } catch {}
    await sleep(250);
  }
  throw new Error('Static server did not become ready.');
}

async function settle(page){
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    const step = Math.max(500, Math.floor(innerHeight * .72));
    for(let y = 0; y < height; y += step){ scrollTo(0,y); await new Promise(r => setTimeout(r,75)); }
    scrollTo(0,0);
  });
  await page.waitForTimeout(220);
  await page.waitForFunction(() => [...document.images].every(image => image.complete), null, { timeout:15000 }).catch(() => {});
}

function pushIssue(report, page, severity, code, message){ report.issues.push({ page, severity, code, message }); }

await waitForServer();
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext({ viewport:{ width:1440, height:1000 }, deviceScaleFactor:1, colorScheme:'light' });

const report = {
  status:'passed', threshold:94, viewport:{ width:1440, height:1000 },
  contract:'design-artifacts/desktop-v3-design-contract.json', pages:[], pressure:[], issues:[],
};

const specs = [
  { name:'home-v3', path:'/index.html', kind:'home' },
  { name:'library-v3', path:'/search.html', kind:'library' },
  { name:'library-intimate-v3', path:'/search.html?mood=intimate&presence=intimate', kind:'library-filtered' },
  { name:'pdp-violette-v3', path:'/product.html?id=violette-03', kind:'product' },
  { name:'scent-portrait-v3', path:'/finder.html', kind:'finder' },
  { name:'bag-v3', path:'/cart.html', kind:'cart', seedCart:true },
  { name:'checkout-v3', path:'/checkout.html', kind:'checkout', seedCart:true },
];

for(const spec of specs){
  const page = await context.newPage();
  const consoleErrors = []; const pageErrors = [];
  page.on('console', message => { if(message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(String(error)));

  if(spec.seedCart){
    await page.goto(`${baseURL}/index.html`, { waitUntil:'domcontentloaded', timeout:45000 });
    await page.evaluate(() => localStorage.setItem('violet-marketplace-cart-v1', JSON.stringify([{ id:'violette-03', qty:1 }])));
  }

  await page.goto(baseURL + spec.path, { waitUntil:'networkidle', timeout:45000 });
  if(spec.kind === 'product') await page.waitForSelector('.pdp-v3', { timeout:10000 });
  if(spec.kind.startsWith('library')) await page.waitForSelector('.v3-product-card, .v3-empty', { timeout:10000 });
  await settle(page);

  const metrics = await page.evaluate(kind => {
    const visible = element => {
      if(!element) return false; const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const doc = document.documentElement; const body = document.body;
    const grid = document.querySelector('[data-results]') || document.querySelector('.product-grid');
    const gridColumns = grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length : 0;
    const detail = document.querySelector('.pdp-v3');
    const brokenImages = [...document.images].filter(image => visible(image) && image.complete && image.naturalWidth === 0).map(image => image.currentSrc || image.src).slice(0,8);
    const v3SheetLoaded = [...document.styleSheets].some(sheet => String(sheet.href || '').includes('desktop-experience-v3.css'));
    return {
      kind,
      scrollWidth:Math.max(doc.scrollWidth,body.scrollWidth), clientWidth:doc.clientWidth,
      h1Count:document.querySelectorAll('h1').length,
      navVisible:visible(document.querySelector('.nav-inner')),
      v3SheetLoaded,
      brokenImages,
      editorialBridgeVisible:visible(document.querySelector('.v3-editorial-bridge')),
      heroHeight:Math.round(document.querySelector('.perfume-hero .hero-main')?.getBoundingClientRect().height || 0),
      filterVisible:visible(document.querySelector('.filter-panel')),
      activeChipCount:document.querySelectorAll('.active-chips .chip').length,
      resultCardCount:document.querySelectorAll('[data-results] .v3-product-card').length,
      gridColumns,
      detailColumns:detail ? getComputedStyle(detail).gridTemplateColumns.split(' ').filter(Boolean).length : 0,
      pdpProfileCells:document.querySelectorAll('.pdp-v3-profile > div').length,
      pdpRelatedCount:document.querySelectorAll('.pdp-v3-related-grid .v3-product-card').length,
      tryFirstVisible:visible([...document.querySelectorAll('.pdp-v3-actions a')].find(el => /try first/i.test(el.textContent || ''))),
      addVisible:visible(document.querySelector('[data-v3-add]')),
      finderColumns:document.querySelector('.portrait-shell') ? getComputedStyle(document.querySelector('.portrait-shell')).gridTemplateColumns.split(' ').filter(Boolean).length : 0,
      summaryVisible:visible(document.querySelector('.summary-card')),
      seededProductVisible:[...document.querySelectorAll('body *')].some(el => el.children.length === 0 && /Violette 03/.test(el.textContent || '') && visible(el)),
      realityNoteVisible:visible(document.querySelector('.v3-reality-note')),
    };
  }, spec.kind);

  if(consoleErrors.length) pushIssue(report,spec.name,'P0','console-error',consoleErrors.join(' | '));
  if(pageErrors.length) pushIssue(report,spec.name,'P0','page-error',pageErrors.join(' | '));
  if(metrics.brokenImages.length) pushIssue(report,spec.name,'P0','broken-image',metrics.brokenImages.join(' | '));
  if(metrics.scrollWidth > metrics.clientWidth + 2) pushIssue(report,spec.name,'P0','horizontal-overflow',`${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
  if(metrics.h1Count !== 1) pushIssue(report,spec.name,'P1','heading-structure',`Expected one h1, found ${metrics.h1Count}`);
  if(!metrics.navVisible) pushIssue(report,spec.name,'P1','desktop-navigation','Desktop navigation is not visible.');
  if(!metrics.v3SheetLoaded) pushIssue(report,spec.name,'P0','v3-style-contract','desktop-experience-v3.css is not loaded.');

  if(spec.kind === 'home'){
    if(!metrics.editorialBridgeVisible) pushIssue(report,spec.name,'P1','visual-signature','V3 editorial signature bridge is not visible.');
    if(metrics.heroHeight < 620) pushIssue(report,spec.name,'P1','hero-presence',`Hero is only ${metrics.heroHeight}px high.`);
  }
  if(spec.kind === 'library' || spec.kind === 'library-filtered'){
    if(!metrics.filterVisible) pushIssue(report,spec.name,'P1','filter-rail','Fragrance refinement rail is not visible.');
    if(metrics.gridColumns !== 3) pushIssue(report,spec.name,'P1','library-grid',`Expected 3 columns, got ${metrics.gridColumns}.`);
    if(spec.kind === 'library-filtered' && metrics.activeChipCount !== 2) pushIssue(report,spec.name,'P1','filter-state',`Expected 2 visible active filters, got ${metrics.activeChipCount}.`);
    if(spec.kind === 'library-filtered' && metrics.resultCardCount < 1) pushIssue(report,spec.name,'P1','filter-results','Intimate filter should return at least one representative fragrance.');
  }
  if(spec.kind === 'product'){
    if(metrics.detailColumns < 2) pushIssue(report,spec.name,'P1','pdp-composition','PDP dossier must remain two-column on desktop.');
    if(metrics.pdpProfileCells !== 4) pushIssue(report,spec.name,'P1','pdp-profile',`Expected 4 profile cells, got ${metrics.pdpProfileCells}.`);
    if(metrics.pdpRelatedCount !== 3) pushIssue(report,spec.name,'P1','related-rationale',`Expected 3 reasoned related scents, got ${metrics.pdpRelatedCount}.`);
    if(!metrics.tryFirstVisible || !metrics.addVisible) pushIssue(report,spec.name,'P1','decision-actions','Try-first and full-bottle actions must both be visible.');
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('violet-marketplace-cart-v1') || '[]').reduce((s,row) => s + row.qty,0));
    await page.click('[data-v3-add]');
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('violet-marketplace-cart-v1') || '[]').reduce((s,row) => s + row.qty,0));
    if(after !== before + 1) pushIssue(report,spec.name,'P0','add-to-bag','Full-bottle action did not update prototype cart state.');
  }
  if(spec.kind === 'finder' && metrics.finderColumns < 2) pushIssue(report,spec.name,'P1','finder-composition','Scent Portrait should retain its two-pane desktop consultation composition.');
  if(spec.kind === 'cart' && (!metrics.summaryVisible || !metrics.seededProductVisible)) pushIssue(report,spec.name,'P1','cart-continuity','Seeded fragrance and order summary should be visible.');
  if(spec.kind === 'checkout'){
    if(!metrics.summaryVisible || !metrics.seededProductVisible) pushIssue(report,spec.name,'P1','checkout-continuity','Seeded fragrance and checkout summary should be visible.');
    if(!metrics.realityNoteVisible) pushIssue(report,spec.name,'P1','system-reality','Prototype payment reality note should be visible.');
  }

  await page.screenshot({ path:path.join(outputDir,`${spec.name}-1440.png`), fullPage:true });
  report.pages.push({ name:spec.name, path:spec.path, metrics, consoleErrors, pageErrors });
  await page.close();
}

for(const width of [1280,1600]){
  const page = await context.newPage(); await page.setViewportSize({ width, height:1000 });
  for(const item of [
    { name:'home', path:'/index.html' },
    { name:'pdp', path:'/product.html?id=violette-03' },
  ]){
    await page.goto(baseURL + item.path, { waitUntil:'networkidle', timeout:45000 });
    const pressure = await page.evaluate(() => ({ scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth }));
    if(pressure.scrollWidth > pressure.clientWidth + 2) pushIssue(report,`${item.name}-${width}`,'P0','pressure-overflow',`${pressure.scrollWidth}px > ${pressure.clientWidth}px`);
    await page.screenshot({ path:path.join(outputDir,`${item.name}-${width}-top.png`), fullPage:false });
    report.pressure.push({ page:item.name, width, ...pressure });
  }
  await page.close();
}

const p0 = report.issues.filter(item => item.severity === 'P0').length;
const p1 = report.issues.filter(item => item.severity === 'P1').length;
const score = Math.max(0, 100 - p0 * 20 - p1 * 7);
report.score = score; report.status = score >= report.threshold && p0 === 0 && p1 === 0 ? 'passed' : 'failed';
fs.writeFileSync(path.join(outputDir,'storefront-v3-report.json'), JSON.stringify(report,null,2));
console.log(JSON.stringify({ status:report.status, score, issues:report.issues }, null, 2));

await browser.close(); server.kill('SIGTERM');
if(report.status !== 'passed') process.exitCode = 1;
