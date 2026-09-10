import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const out = path.resolve(process.argv[2] || 'artifacts/language-consistency');
fs.mkdirSync(out, { recursive: true });
const port = 4183;
const base = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe']
});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitServer(){
  for(let i=0;i<50;i++){
    try { const res = await fetch(`${base}/index.html`, { cache:'no-store' }); if(res.ok) return; } catch {}
    await sleep(200);
  }
  throw new Error('language QA server did not start');
}

const report = { status:'passed', locale:'vi', routes:[], issues:[] };
const fail = (route, code, detail) => report.issues.push({ route, code, detail });

const routes = [
  'index.html',
  'search.html?sample=1',
  'product.html?id=violette-03',
  'discovery.html',
  'houses.html',
  'house.html?id=maison-aster',
  'finder.html',
  'cart.html',
  'checkout.html',
  'order-success.html?order=VL12345678',
  'seller.html',
  'admin.html'
];

const hardForbidden = [
  /\bViolet Editions\b/i,
  /\bDiscovery ritual\b/i,
  /\bScent Portrait\b/i,
  /\bFor fragrance houses\b/i,
  /\bFeatured object\b/i,
  /\bView object\b/i,
  /\bTry first\b/i,
  /\bFragrance Library\b/i,
  /\bResults for\b/i,
  /\bRefine\b/i,
  /\bClear filters?\b/i,
  /\bNo object/i,
  /\bObject study\b/i,
  /\bObject view\b/i,
  /\bMaterial study\b/i,
  /\bTexture\s*\/\s*editorial study\b/i,
  /\bAdd full bottle\b/i,
  /\bAdd to trial trio\b/i,
  /\bYour trio\b/i,
  /\bNo direction selected yet\b/i,
  /\bTrio complete\b/i,
  /\bAdd to trio\b/i,
  /\bTrio full\b/i,
  /\bBuild a trial trio\b/i,
  /\bStep\s+\d+\s+of\s+\d+\b/i,
  /\bYour instinct\b/i,
  /\bReveal my Violet Edit\b/i,
  /\bPortrait complete\b/i,
  /\bStart again\b/i,
  /\bThree scents, not thirty\b/i,
  /\bExplore fragrance\b/i,
  /\bTry before full bottle\b/i,
  /\bCurated houses\b/i,
  /\bBegin with the hand\b/i,
  /\bWHY HOUSES\b/i,
  /\bOrder summary\b/i,
  /\bContinue to checkout\b/i,
  /\bClient details\b/i,
  /\bDelivery ritual\b/i,
  /\bYour selection\b/i,
  /\bPlace order\b/i,
  /\bThank you\b/i,
  /\bBack to Violet\b/i,
  /\bExplore more fragrance\b/i,
  /\bFragrance catalog\b/i,
  /\bClient messages\b/i,
  /\bExport report\b/i
];

// English action/function words are suspicious in Vietnamese UI chrome. Proper nouns,
// product names, fragrance materials and established terms are intentionally not here.
const englishUiWords = /\b(your|choose|continue|back|remove|selected|browse|build|start|begin|clear|refine|results|view|add|order|summary|checkout|payment|client|delivery|thank|explore|featured|current|objects?|houses?|fragrances?|recommendations?|questions?)\b/i;
const vietnameseSignal = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;

async function auditRendered(page, route, state='default'){
  const data = await page.evaluate(() => {
    const visible = el => {
      const style = getComputedStyle(el); const r = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const selector = 'h1,h2,h3,h4,p,a,button,label,option,small,strong,span,li,th,td,input[placeholder]';
    const nodes = [...document.querySelectorAll(selector)].filter(visible).map(el => ({
      tag: el.tagName.toLowerCase(),
      text: (el.getAttribute('placeholder') || el.innerText || el.textContent || '').replace(/\s+/g,' ').trim()
    })).filter(row => row.text);
    const allowed = new Set();
    for(const p of (window.VIOLET_DATA?.products || [])){
      [p.name,p.brand,p.seller,p.family,p.concentration,p.size].filter(Boolean).forEach(v => allowed.add(String(v).trim()));
    }
    return { lang: document.documentElement.lang, title: document.title, nodes, allowed:[...allowed] };
  });

  if(data.lang !== 'vi') fail(route, 'locale-contract', `${state}: html lang must be vi, got ${data.lang || '(empty)'}`);
  const allowed = new Set(data.allowed);
  const suspicious = [];
  for(const row of data.nodes){
    if(allowed.has(row.text)) continue;
    for(const pattern of hardForbidden){
      if(pattern.test(row.text)){ suspicious.push({ ...row, reason:`forbidden:${pattern}` }); break; }
    }
    if(suspicious.some(hit => hit.tag===row.tag && hit.text===row.text)) continue;
    if(row.text.length <= 90 && englishUiWords.test(row.text) && !vietnameseSignal.test(row.text)){
      suspicious.push({ ...row, reason:'english-ui-word-without-vietnamese-signal' });
    }
  }
  if(suspicious.length) fail(route, 'mixed-language-ui', { state, hits:suspicious.slice(0,20) });
  report.routes.push({ route, state, nodeCount:data.nodes.length, title:data.title });
}

await waitServer();
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext({ viewport:{ width:1440, height:1000 }, deviceScaleFactor:1, colorScheme:'light' });

for(const route of routes){
  const page = await context.newPage();
  await page.goto(`${base}/${route}`, { waitUntil:'networkidle' });
  await auditRendered(page, route);

  if(route === 'finder.html'){
    for(let step=0; step<4; step++){
      const option = page.locator('.portrait-option').first();
      if(await option.count()) await option.click();
      await auditRendered(page, route, `step-${step+1}-selected`);
      const next = page.locator('[data-next]');
      if(await next.count()) await next.click();
      await page.waitForTimeout(60);
    }
    await auditRendered(page, route, 'results');
  }

  await page.screenshot({ path:path.join(out, `${route.split('?')[0].replace('.html','')}.png`), fullPage:false });
  await page.close();
}

await context.close();
await browser.close();
server.kill('SIGTERM');
report.status = report.issues.length ? 'failed' : 'passed';
fs.writeFileSync(path.join(out,'language-consistency-report.json'), JSON.stringify(report,null,2));
console.log(JSON.stringify({ status:report.status, issueCount:report.issues.length, issues:report.issues }, null, 2));
if(report.status !== 'passed') process.exitCode = 1;
