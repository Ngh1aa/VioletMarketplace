(() => {
  const P=window.VIOLET_PERSONALIZATION;
  if(!P) return;
  const id=new URLSearchParams(location.search).get('id')||'violette-03';
  const product=P.productById(id);
  if(!product) return;
  const profile=P.getProfile();
  const hasProfile=Boolean(profile.family||profile.mood||profile.projection||profile.occasion||Object.keys(P.getFeedback()).length);
  const target=document.querySelector('.v4-buying-desk');
  if(!target) return;

  const reasons=P.reasonsFor(product,profile);
  const match=document.createElement('section');
  match.className='v7-match-panel';
  match.setAttribute('aria-label','Why this matches you');
  match.innerHTML=hasProfile?`<div class="v7-match-head"><span>YOUR PORTRAIT / RULE-BASED</span><a href="finder.html">Adjust</a></div><h2>Why this matches you</h2><ul>${(reasons.length?reasons:['This is a deliberate contrast in your current Violet edit.']).map(reason=>`<li>${reason}</li>`).join('')}</ul><p>Prototype explanation only. Violet does not predict what you will smell or love.</p>`:`<div class="v7-match-head"><span>YOUR PORTRAIT</span><a href="finder.html">Start</a></div><h2>Want a reasoned shortlist first?</h2><p>Answer the Scent Portrait to compare this object against your mood, disliked notes, sweetness, freshness, projection and context.</p>`;
  const character=target.querySelector('.v4-pdp-character');
  (character||target.firstElementChild)?.insertAdjacentElement('afterend',match);

  const actions=target.querySelector('.v4-pdp-actions');
  if(actions){
    actions.classList.add('v7-pdp-actions');
    const bottle=actions.querySelector('[data-v4-add-bottle]');
    const sample=actions.querySelector('[data-v4-add-sample]');
    if(bottle){bottle.innerHTML='<span>Full bottle</span><small>50 ml · browser-local bag</small>';bottle.setAttribute('aria-label',`Add full bottle of ${product.name} to prototype bag`);}
    if(sample){sample.innerHTML='<span>Trial sample</span><small>Add to 3-scent prototype trio</small>';sample.setAttribute('aria-label',`Add ${product.name} to prototype discovery trio`);}
    const truth=document.createElement('p');truth.className='v7-sample-truth';truth.textContent='Trial selections are prototype-only: no sample shipment or redemption credit is issued.';actions.insertAdjacentElement('afterend',truth);
  }

  const sampleButton=target.querySelector('[data-v4-add-sample]');
  sampleButton?.addEventListener('click',()=>{
    const trio=P.getTrio();
    if(trio.includes(id)){sampleButton.querySelector('span').textContent='Already in trio';return;}
    if(trio.length>=3){sampleButton.querySelector('span').textContent='Trio full · review';sampleButton.onclick=()=>location.href='discovery.html';return;}
    P.setTrio([...trio,id]);sampleButton.querySelector('span').textContent='Added to trio ✓';
  });
})();
