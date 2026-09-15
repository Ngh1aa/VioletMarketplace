(() => {
  const host=document.querySelector('[data-portrait-stage]');
  if(!host) return;
  const P=window.VIOLET_PERSONALIZATION;
  const DATA=window.VIOLET_DATA || {products:[]};
  if(!P){ host.innerHTML='<p>Portrait runtime unavailable.</p>'; return; }
  const money=n=>`${new Intl.NumberFormat('en-GB',{maximumFractionDigits:0}).format(Number(n||0))} €`;

  const saved=P.getProfile();
  const state={step:0,answers:{
    family:saved.family||'', mood:saved.mood||'', dislikedNotes:[...(saved.dislikedNotes||[])],
    sweetness:Number.isFinite(Number(saved.sweetness))?String(saved.sweetness):'',
    freshness:Number.isFinite(Number(saved.freshness))?String(saved.freshness):'',
    projection:saved.projection||'', occasion:saved.occasion||'', weather:saved.weather||'', familiarScents:saved.familiarScents||''
  }};

  const steps=[
    {key:'family',title:'Your instinct',kicker:'01 / SCENT FAMILY',question:'Where does your nose usually want to stay?',help:'Start broad. This is a preference signal, not a permanent label.',type:'single',options:[['floral','Floral / iris','Petals, iris, violet and powder'],['woody','Woods','Sandalwood, cedar, fig and dry texture'],['amber','Amber','Resin, saffron, tonka and warmth'],['fresh','Fresh / green','Neroli, citrus, tea and leafy brightness'],['musk','Skin musk','Ambrette, clean musk and close-to-skin softness']]},
    {key:'mood',title:'The feeling',kicker:'02 / MOOD',question:'What should this fragrance feel like today?',help:'Mood helps translate fragrance vocabulary into a wearing intention.',type:'single',options:[['clean','Clean / lucid','Fresh air, pressed cotton, transparent structure'],['intimate','Intimate','Private, skin-close and quietly tactile'],['soft','Soft / calm','Powder, tea, iris and rounded edges'],['warm','Warm','Enveloping, resinous or creamy'],['mysterious','Mysterious','Shadowed, dry and slower to reveal'],['bright','Bright / energetic','Green light, citrus and lift']]},
    {key:'dislikedNotes',title:'Your no-list',kicker:'03 / AVOID',question:'Which notes or effects do you usually avoid?',help:'Choose any that matter. Violet uses these as negative rules, not as absolute chemistry claims.',type:'multi',options:[['vanilla','Vanilla / sugary','Often reads too sweet for some wearers'],['gourmand','Gourmand','Dessert-like sweetness'],['amber','Dense amber','Warm resin with weight'],['musk','Musk','Skin musk / soft laundry territory'],['citrus','Sharp citrus','Bright peel and zest'],['powder','Powder','Iris / violet / cosmetic texture'],['saffron','Saffron','Dry spicy warmth']]},
    {key:'sweetness',title:'Sweetness',kicker:'04 / SWEETNESS',question:'How much sweetness feels right?',help:'A relative prototype scale used only inside Violet scoring.',type:'scale',options:[['0','Dry','Very low sweetness'],['1','Low','A soft trace is fine'],['2','Warm','Noticeable but controlled'],['3','Sweet','You enjoy clear sweetness']]},
    {key:'freshness',title:'Freshness',kicker:'05 / FRESHNESS',question:'How much lift do you want?',help:'Think air, citrus, green notes and transparency.',type:'scale',options:[['0','Deep','Little fresh lift'],['1','Soft','Some breathing room'],['2','Fresh','Clear airy brightness'],['3','Very fresh','Green / citrus lift leads']]},
    {key:'projection',title:'Presence',kicker:'06 / PROJECTION',question:'How clearly should other people notice it?',help:'Preference only — not a promise about real-world performance.',type:'single',options:[['quiet','Close','Mostly for you and people nearby'],['balanced','Balanced','Noticeable without filling the room'],['expressive','Expressive','Fragrance is a deliberate part of your presence']]},
    {key:'occasion',title:'Occasion',kicker:'07 / INTENT',question:'What are you dressing the air for?',help:'Context changes what “right” means more than a generic top-seller rank.',type:'single',options:[['everyday','Everyday','A direction you can return to often'],['work','Work / focus','Composed, readable, lower-friction'],['evening','Evening','Dinner, events or slower nights'],['special','Special moment','More character or contrast'],['outdoors','Outdoors','Air, movement and changing temperature']]},
    {key:'weather',title:'Context',kicker:'08 / WEATHER',question:'What kind of air will you wear it in?',help:'This is a practical context signal, not a climate-performance guarantee.',type:'single',options:[['warm','Warm','Heat or bright daytime'],['humid','Humid','Dense air; you may want lift'],['mild','Mild','Flexible, transitional weather'],['cool','Cool','Lower temperature or evening'],['indoors','Mostly indoors','Close spaces and controlled air']]},
    {key:'familiarScents',title:'Familiar scents',kicker:'09 / MEMORY',question:'Any notes or fragrances you already like?',help:'Optional. Type words such as “iris, tea, sandalwood”. Violet only matches words against its small prototype catalogue.',type:'text'}
  ];

  const progressBar=document.querySelector('[data-progress-bar]');
  const stepLabel=document.querySelector('[data-step-label]');
  const stepTitle=document.querySelector('[data-step-title]');
  const hasValue=spec=> spec.type==='multi' ? true : spec.type==='text' ? true : Boolean(state.answers[spec.key]);

  function optionMarkup(spec){
    if(spec.type==='text') return `<label class="portrait-text-field"><span>Notes, materials or familiar scent names</span><textarea rows="4" data-text-answer placeholder="iris, black tea, clean woods…">${state.answers[spec.key]||''}</textarea><small>Optional · stored only in this browser prototype.</small></label>`;
    const selected=spec.type==='multi'?new Set(state.answers[spec.key]||[]):new Set([state.answers[spec.key]]);
    return `<div class="portrait-options ${spec.type==='multi'?'is-multi':''}" role="group" aria-label="${spec.question}">${spec.options.map(([value,label,desc])=>`<button type="button" class="portrait-option" data-value="${value}" aria-pressed="${selected.has(value)}"><span class="portrait-choice-mark" aria-hidden="true">${selected.has(value)?'✓':'○'}</span><strong>${label}</strong><span>${desc}</span></button>`).join('')}</div>`;
  }

  function renderStep(){
    const spec=steps[state.step];
    stepLabel.textContent=`Step ${state.step+1} of ${steps.length}`;
    stepTitle.textContent=spec.title;
    progressBar.style.width=`${((state.step+1)/steps.length)*100}%`;
    host.innerHTML=`<div class="portrait-question" data-question="${spec.key}"><span class="question-kicker">${spec.kicker}</span><h2>${spec.question}</h2><p>${spec.help}</p>${optionMarkup(spec)}<div class="portrait-nav"><button type="button" data-back ${state.step===0?'disabled':''}>← Back</button><button type="button" class="portrait-next" data-next ${hasValue(spec)?'':'disabled'}>${state.step===steps.length-1?'Show my matches':'Continue →'}</button></div></div>`;

    host.querySelectorAll('[data-value]').forEach(button=>button.addEventListener('click',()=>{
      if(spec.type==='multi'){
        const set=new Set(state.answers[spec.key]||[]); set.has(button.dataset.value)?set.delete(button.dataset.value):set.add(button.dataset.value); state.answers[spec.key]=[...set];
        host.querySelectorAll('[data-value]').forEach(item=>{const active=set.has(item.dataset.value);item.setAttribute('aria-pressed',String(active));item.querySelector('.portrait-choice-mark').textContent=active?'✓':'○';});
      }else{
        state.answers[spec.key]=button.dataset.value;
        host.querySelectorAll('[data-value]').forEach(item=>{const active=item===button;item.setAttribute('aria-pressed',String(active));item.querySelector('.portrait-choice-mark').textContent=active?'✓':'○';});
        host.querySelector('[data-next]').disabled=false;
      }
    }));
    host.querySelector('[data-text-answer]')?.addEventListener('input',event=>{state.answers[spec.key]=event.target.value;});
    host.querySelector('[data-back]')?.addEventListener('click',()=>{if(state.step>0){state.step--;renderStep();}});
    host.querySelector('[data-next]')?.addEventListener('click',()=>{if(!hasValue(spec))return;if(state.step<steps.length-1){state.step++;renderStep();}else renderResults();});
  }

  function addRecommendationToTrio(id,button){
    const trio=P.getTrio(); if(trio.includes(id)){button.textContent='Already in trio';return;}
    if(trio.length>=3){button.textContent='Trio full · review it';button.onclick=()=>location.href='discovery.html';return;}
    P.setTrio([...trio,id]); button.textContent='Added to trio ✓'; button.setAttribute('aria-pressed','true');
  }

  function renderResults(){
    P.saveProfile(state.answers);
    const recs=P.recommendations(state.answers);
    const feedbackCount=Object.keys(P.getFeedback()).length;
    stepLabel.textContent='Portrait complete';stepTitle.textContent='Your Violet Edit';progressBar.style.width='100%';
    host.innerHTML=`<div class="portrait-results"><div class="results-heading"><div><span class="question-kicker">RULE-BASED PORTRAIT · ${feedbackCount?`${feedbackCount} saved trial note${feedbackCount===1?'':'s'} considered`:'no trial feedback yet'}</span><h2>Three directions, with reasons.</h2><p>These recommendations are deterministic rules over your answers, catalogue metadata and browser-local feedback. They are not AI predictions and do not claim accuracy about what you will smell or love.</p></div><button type="button" class="portrait-restart" data-restart>Adjust portrait ↺</button></div><div class="portrait-result-grid">${recs.map(({product,reasons},index)=>`<article class="portrait-result tone-${product.category}"><a href="product.html?id=${product.id}" class="result-media"><img src="${product.image}" alt="${product.name} by ${product.brand}"><span class="result-rank">${String(index+1).padStart(2,'0')} · Violet edit</span></a><div class="result-copy"><span class="result-house">${product.brand}</span><h3>${product.name}</h3><div class="result-why-block"><span>Why this matches you</span><ul>${(reasons.length?reasons:['A contrasting direction included to avoid an overly narrow shortlist.']).map(reason=>`<li>${reason}</li>`).join('')}</ul></div><div class="result-meta"><span>${product.family}</span><span>${money(product.price)}</span></div><div class="result-actions"><button type="button" class="btn btn-primary" data-add-trio="${product.id}">Try in trio</button><a class="btn btn-secondary" href="product.html?id=${product.id}">View bottle</a></div></div></article>`).join('')}</div><aside class="portrait-discovery"><div><span>Try before full bottle</span><strong>Turn the edit into three days of wearing.</strong><p>Your trio is browser-local prototype state. No sample shipment, redemption credit or fulfilment is real.</p></div><a class="btn" href="discovery.html">Review discovery trio →</a></aside></div>`;
    host.querySelectorAll('[data-add-trio]').forEach(button=>button.addEventListener('click',()=>addRecommendationToTrio(button.dataset.addTrio,button)));
    host.querySelector('[data-restart]').addEventListener('click',()=>{state.step=0;renderStep();});
  }

  renderStep();
})();
