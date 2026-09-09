import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const out=path.resolve(process.argv[2]||'artifacts/v4-full-qa');
fs.mkdirSync(out,{recursive:true});
const port=4179,base=`http://127.0.0.1:${port}`;
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitServer(){for(let i=0;i<50;i++){try{const r=await fetch(`${base}/seller.html`,{cache:'no-store'});if(r.ok)return;}catch{}await sleep(200);}throw new Error('server not ready');}
async function settle(page){await page.evaluate(async()=>{document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode?.().catch(()=>{})||Promise.resolve()));});await page.waitForTimeout(180);}

const report={status:'passed',viewport:{width:1440,height:1000},pages:[],issues:[]};
await waitServer();
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:report.viewport,deviceScaleFactor:1,colorScheme:'light'});
for(const [name,url] of [['seller','/seller.html'],['admin','/admin.html']]){
  const page=await context.newPage();
  const consoleErrors=[],pageErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('pageerror',e=>pageErrors.push(String(e)));
  await page.goto(base+url,{waitUntil:'networkidle',timeout:45000});
  await settle(page);
  const metrics=await page.evaluate(()=>({
    scrollWidth:document.documentElement.scrollWidth,
    clientWidth:document.documentElement.clientWidth,
    h1Count:document.querySelectorAll('h1').length,
    broken:[...document.images].filter(img=>img.complete&&img.naturalWidth===0).map(img=>img.currentSrc||img.src)
  }));
  if(consoleErrors.length)report.issues.push({page:name,severity:'P0',code:'console-error',message:consoleErrors.join(' | ')});
  if(pageErrors.length)report.issues.push({page:name,severity:'P0',code:'page-error',message:pageErrors.join(' | ')});
  if(metrics.broken.length)report.issues.push({page:name,severity:'P0',code:'broken-image',message:metrics.broken.join(' | ')});
  if(metrics.scrollWidth>metrics.clientWidth+2)report.issues.push({page:name,severity:'P0',code:'overflow',message:`${metrics.scrollWidth}>${metrics.clientWidth}`});
  if(metrics.h1Count<1)report.issues.push({page:name,severity:'P1',code:'heading',message:'No h1 found'});
  await page.screenshot({path:path.join(out,`${name}-ops-smoke-1440.png`),fullPage:true});
  report.pages.push({name,url,metrics,consoleErrors,pageErrors});
  await page.close();
}
report.status=report.issues.length?'failed':'passed';
fs.writeFileSync(path.join(out,'v4-ops-smoke-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
server.kill('SIGTERM');
if(report.status!=='passed')process.exitCode=1;
