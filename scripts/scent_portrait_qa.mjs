import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const outputDir = path.resolve(process.argv[2] || 'artifacts/scent-portrait-qa');
fs.mkdirSync(outputDir, { recursive: true });
const port = 4174;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m','http.server',String(port),'--bind','127.0.0.1'], { cwd:process.cwd(), stdio:['ignore','pipe','pipe'] });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function ready(){ for(let i=0;i<40;i++){ try{ const r=await fetch(`${baseURL}/finder.html`,{cache:'no-store'}); if(r.ok)return; }catch{} await sleep(250); } throw new Error('server not ready'); }

const report={status:'passed',score:100,viewport:{width:1440,height:1000},issues:[],metrics:{}};
const issue=(severity,code,message)=>report.issues.push({severity,code,message});
await ready();
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,colorScheme:'light'});
const page=await context.newPage();
const consoleErrors=[]; const pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(String(e)));
await page.goto(`${baseURL}/finder.html`,{waitUntil:'networkidle',timeout:45000});

const initial=await page.evaluate(()=>{
  const doc=document.documentElement;
  const shell=document.querySelector('.portrait-shell');
  const workspace=document.querySelector('.portrait-workspace');
  const options=[...document.querySelectorAll('.portrait-option')];
  const first=options[0];
  const style=first?getComputedStyle(first):null;
  return {
    h1:document.querySelectorAll('h1').length,
    overflow:Math.max(document.body.scrollWidth,doc.scrollWidth)-doc.clientWidth,
    columns:shell?getComputedStyle(shell).gridTemplateColumns.split(' ').filter(Boolean).length:0,
    workspaceVisible:!!workspace && workspace.getBoundingClientRect().width>0,
    optionCount:options.length,
    minOptionHeight:options.length?Math.min(...options.map(x=>x.getBoundingClientRect().height)):0,
    firstBackground:style?.backgroundColor||''
  };
});
report.metrics.initial=initial;
if(initial.h1!==1) issue('P1','heading',`expected one h1, got ${initial.h1}`);
if(initial.overflow>2) issue('P0','overflow',`horizontal overflow ${initial.overflow}px`);
if(initial.columns<2) issue('P1','desktop-composition','Scent Portrait must be two-pane at 1440px');
if(!initial.workspaceVisible) issue('P0','workspace','decision workspace not visible');
if(initial.optionCount<3) issue('P0','options','first question options missing');
if(initial.minOptionHeight<44) issue('P1','target-size',`option height ${initial.minOptionHeight}px`);
await page.screenshot({path:path.join(outputDir,'scent-portrait-initial-1440.png'),fullPage:true});

await page.locator('[data-value="floral"]').click();
await page.locator('[data-next]').click();
await page.locator('[data-value="intimate"]').click();
await page.locator('[data-next]').click();
await page.locator('[data-back]').click();
const preserved=await page.locator('[data-value="intimate"]').getAttribute('aria-pressed');
if(preserved!=='true') issue('P0','back-state','answer was not preserved after Back');
await page.locator('[data-next]').click();
await page.locator('[data-value="quiet"]').click();
await page.locator('[data-next]').click();
await page.locator('[data-value="everyday"]').click();
await page.locator('[data-next]').click();
await page.waitForSelector('.portrait-results');

const resultMetrics=await page.evaluate(async()=>{
  window.scrollTo(0,document.body.scrollHeight); await new Promise(r=>setTimeout(r,600)); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,250));
  const imgs=[...document.querySelectorAll('.portrait-result img')];
  const broken=imgs.filter(i=>!i.complete||i.naturalWidth===0).length;
  const cards=[...document.querySelectorAll('.portrait-result')];
  const whys=[...document.querySelectorAll('.result-why')].filter(x=>x.textContent.trim().length>20).length;
  return { resultCount:cards.length, whyCount:whys, brokenImages:broken, overflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth };
});
report.metrics.results=resultMetrics;
if(resultMetrics.resultCount!==3) issue('P0','result-count',`expected 3 results, got ${resultMetrics.resultCount}`);
if(resultMetrics.whyCount!==3) issue('P1','explanation','each result must explain why it fits');
if(resultMetrics.brokenImages) issue('P0','broken-media',`${resultMetrics.brokenImages} recommendation images broken`);
if(resultMetrics.overflow>2) issue('P0','result-overflow',`result overflow ${resultMetrics.overflow}px`);
await page.screenshot({path:path.join(outputDir,'scent-portrait-results-1440.png'),fullPage:true});

if(consoleErrors.length) issue('P0','console-error',consoleErrors.join(' | '));
if(pageErrors.length) issue('P0','page-error',pageErrors.join(' | '));
const p0=report.issues.filter(x=>x.severity==='P0').length; const p1=report.issues.filter(x=>x.severity==='P1').length;
report.score=Math.max(0,100-p0*20-p1*8); report.status=report.score>=92&&p0===0&&p1===0?'passed':'failed';
report.consoleErrors=consoleErrors; report.pageErrors=pageErrors;
fs.writeFileSync(path.join(outputDir,'scent-portrait-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({status:report.status,score:report.score,issues:report.issues},null,2));
await browser.close(); server.kill('SIGTERM'); if(report.status!=='passed')process.exitCode=1;