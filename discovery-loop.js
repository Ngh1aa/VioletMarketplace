(() => {
  const panel=document.querySelector('[data-v4-trio-panel]');
  const list=document.querySelector('[data-v4-sample-list]');
  const feedbackHost=document.querySelector('[data-v7-feedback]');
  if(!panel || !list) return;
  const P=window.VIOLET_PERSONALIZATION;
  const DATA=window.VIOLET_DATA || {products:[]};
  if(!P) return;
  let pendingReplacement='';
  const sampleProducts=()=>DATA.products.filter(product=>P.metaFor(product.id).sample);
  const name=id=>P.productById(id)?.name||id;

  function status(message){
    let node=document.querySelector('.v7-status');
    if(!node){node=document.createElement('div');node.className='v7-status';node.setAttribute('role','status');node.setAttribute('aria-live','polite');document.body.append(node);}
    node.textContent=message;node.classList.add('is-visible');clearTimeout(window.__v7Status);window.__v7Status=setTimeout(()=>node.classList.remove('is-visible'),2200);
  }

  function add(id){
    const trio=P.getTrio();
    if(trio.includes(id)){status(`${name(id)} is already in your trio.`);return;}
    if(trio.length>=3){pendingReplacement=id;renderAll();status(`Choose which selected scent to replace with ${name(id)}.`);return;}
    const next=[...trio,id];P.setTrio(next);const balance=P.trioBalance(next);renderAll();
    if(balance.overlaps.length) status(`Added. Note: ${balance.overlaps[0].reasons.join(' and ')}.`); else status(`${name(id)} added to your trio.`);
  }
  function remove(id){P.setTrio(P.getTrio().filter(item=>item!==id));pendingReplacement='';renderAll();status(`${name(id)} removed.`);}
  function replace(oldId,newId){const trio=P.getTrio().map(id=>id===oldId?newId:id);P.setTrio(trio);pendingReplacement='';renderAll();status(`${name(oldId)} replaced with ${name(newId)}.`);}

  function balanceMarkup(ids){
    const balance=P.trioBalance(ids);
    if(!ids.length) return `<div class="v7-balance is-empty"><span>Olfactive balance</span><strong>Start with one direction.</strong><p>Violet will show overlap as your trio takes shape.</p></div>`;
    const warning=balance.overlaps.length?`<div class="v7-overlap" role="note"><strong>Close neighbours</strong><p>${balance.overlaps.map(item=>`${name(item.a)} + ${name(item.b)}: ${item.reasons.join(', ')}.`).join(' ')}</p></div>`:`<div class="v7-overlap is-balanced"><strong>Useful contrast</strong><p>Your current selections cover distinct enough directions for comparison.</p></div>`;
    return `<div class="v7-balance"><div class="v7-balance-head"><span>Olfactive balance</span><strong>${balance.families.length}/${ids.length} families</strong></div><div class="v7-balance-meter" aria-label="Prototype diversity ${balance.diversity} percent"><span style="width:${balance.diversity}%"></span></div><p>${balance.families.map(v=>v.replace('-', ' ')).join(' · ') || 'No family data'} · ${balance.moods.slice(0,4).join(' · ')}</p>${warning}</div>`;
  }

  function renderPanel(){
    const trio=P.getTrio();
    const slots=[0,1,2].map(index=>{
      const id=trio[index],product=id?P.productById(id):null;
      if(!product) return `<div class="v7-trio-slot is-empty"><span>${String(index+1).padStart(2,'0')}</span><div><strong>Open slot</strong><small>Choose a scent direction below.</small></div></div>`;
      const replaceAction=pendingReplacement?`<button type="button" data-replace-slot="${id}">Replace with ${name(pendingReplacement)}</button>`:`<button type="button" data-remove-trio="${id}">Remove</button>`;
      return `<div class="v7-trio-slot"><span>${String(index+1).padStart(2,'0')}</span><img src="${product.image}" alt="${product.name}"><div><strong>${product.name}</strong><small>${product.brand} · ${product.family}</small></div>${replaceAction}</div>`;
    }).join('');
    const complete=trio.length===3;
    panel.innerHTML=`<div class="v7-trio-head"><div><span>Your discovery trio</span><strong>${trio.length}/3 selected</strong></div>${pendingReplacement?`<button type="button" data-cancel-replace>Cancel replace</button>`:''}</div><div class="v7-trio-slots">${slots}</div>${balanceMarkup(trio)}<div class="v7-trio-commerce"><div><span>Prototype set</span><strong>${complete?'Three directions ready to compare':'Choose three to continue'}</strong><p>No samples are shipped and no redemption credit is issued by this prototype.</p></div><button type="button" class="btn btn-primary" data-add-trio-bag ${complete?'':'disabled'}>Add prototype trio to bag</button></div>`;
    panel.querySelectorAll('[data-remove-trio]').forEach(button=>button.addEventListener('click',()=>remove(button.dataset.removeTrio)));
    panel.querySelectorAll('[data-replace-slot]').forEach(button=>button.addEventListener('click',()=>replace(button.dataset.replaceSlot,pendingReplacement)));
    panel.querySelector('[data-cancel-replace]')?.addEventListener('click',()=>{pendingReplacement='';renderAll();});
    panel.querySelector('[data-add-trio-bag]')?.addEventListener('click',event=>{P.addToCart('violet-discovery-set',1);event.currentTarget.textContent='Added prototype trio ✓';status('Discovery Wardrobe added to the browser-local bag.');});
  }

  function renderList(){
    const trio=P.getTrio();
    list.innerHTML=sampleProducts().map((product,index)=>{
      const selected=trio.includes(product.id); const full=trio.length>=3&&!selected;
      const reasons=P.getProfile().family||Object.keys(P.getFeedback()).length?P.reasonsFor(product).slice(0,2):[];
      return `<article class="v4-sample-row v7-sample-row ${selected?'is-selected':''}"><span>${String(index+1).padStart(2,'0')}</span><img class="v5-sample-thumb" src="${product.image}" alt="${product.name}" loading="lazy"><div class="v7-sample-copy"><strong>${product.name}</strong><small>${product.brand} · ${product.family}</small>${reasons.length?`<p>${reasons.join(' · ')}</p>`:''}</div><button type="button" data-v7-sample="${product.id}" aria-pressed="${selected}">${selected?'Selected':full?'Replace one':'Add to trio'}</button></article>`;
    }).join('');
    list.querySelectorAll('[data-v7-sample]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.v7Sample;if(P.getTrio().includes(id)) remove(id); else add(id);}));
  }

  function renderFeedback(){
    if(!feedbackHost) return;
    const trio=P.getTrio(); const saved=P.getFeedback();
    if(!trio.length){feedbackHost.innerHTML=`<div class="v7-feedback-empty"><span class="v4-kicker">04 / AFTER TRYING</span><h2>Your scent journal starts after the trio.</h2><p>Save a sample trio first. Feedback remains browser-local and only changes deterministic prototype scoring.</p></div>`;return;}
    feedbackHost.innerHTML=`<div class="v7-feedback-heading"><span class="v4-kicker">04 / AFTER TRYING</span><h2>What survived the drydown?</h2><p>Rate only after wearing. Violet uses these local notes as explicit rules on your next recommendation run — not machine learning.</p></div><div class="v7-feedback-list">${trio.map(id=>{const p=P.productById(id),row=saved[id]||{sentiment:'',tags:[]};return `<article class="v7-feedback-card" data-feedback-card="${id}"><div class="v7-feedback-object"><img src="${p.image}" alt="${p.name}"><div><span>${p.brand}</span><strong>${p.name}</strong><small>${p.family}</small></div></div><fieldset><legend>Overall</legend><div class="v7-sentiments">${[['love','Love'],['like','Like'],['neutral','Neutral'],['dislike','Dislike']].map(([value,label])=>`<button type="button" data-sentiment="${value}" aria-pressed="${row.sentiment===value}">${label}</button>`).join('')}</div></fieldset><fieldset><legend>What felt off? <small>optional</small></legend><div class="v7-feedback-tags">${[['too-sweet','Too sweet'],['too-heavy','Too heavy'],['too-light','Too light'],['not-for-me','Not for me']].map(([value,label])=>`<button type="button" data-feedback-tag="${value}" aria-pressed="${(row.tags||[]).includes(value)}">${label}</button>`).join('')}</div></fieldset><button type="button" class="v7-save-feedback" data-save-feedback>Save wear note</button></article>`;}).join('')}</div><div class="v7-refine"><div><span>Feedback loop</span><strong>Return to a smaller, better-explained shortlist.</strong><p>Saved ratings change the next rule-based ranking in this browser.</p></div><a class="btn btn-primary" href="finder.html">See refined recommendations</a></div>`;
    feedbackHost.querySelectorAll('[data-feedback-card]').forEach(card=>{
      let sentiment=saved[card.dataset.feedbackCard]?.sentiment||'';let tags=new Set(saved[card.dataset.feedbackCard]?.tags||[]);
      card.querySelectorAll('[data-sentiment]').forEach(button=>button.addEventListener('click',()=>{sentiment=button.dataset.sentiment;card.querySelectorAll('[data-sentiment]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));
      card.querySelectorAll('[data-feedback-tag]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.feedbackTag;tags.has(value)?tags.delete(value):tags.add(value);button.setAttribute('aria-pressed',String(tags.has(value)));}));
      card.querySelector('[data-save-feedback]').addEventListener('click',event=>{if(!sentiment){status('Choose love, like, neutral or dislike first.');return;}P.saveFeedback(card.dataset.feedbackCard,{sentiment,tags:[...tags]});event.currentTarget.textContent='Wear note saved ✓';status('Feedback saved. Your next Violet Edit will use it.');});
    });
  }

  function renderAll(){renderPanel();renderList();renderFeedback();}
  renderAll();
})();
