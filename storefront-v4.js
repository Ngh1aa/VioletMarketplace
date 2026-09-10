(() => {
  const DATA = window.VIOLET_DATA || { products: [], categories: [] };
  const qs = new URLSearchParams(location.search);
  const CART_KEY = 'violet-marketplace-cart-v1';
  const TRIO_KEY = 'violet-discovery-trio-v1';
  const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));
  const byId = id => DATA.products.find(product => product.id === id);

  const HOUSES = [
    { id:'maison-aster', name:'Maison Aster', origin:'Paris', territory:'powdered violet · green fig · quiet woods', ethos:'Soft structure, cool florals and contemplative green woods.', products:['violette-03','nuit-de-figue'] },
    { id:'atelier-nocturne', name:'Atelier Nocturne', origin:'Grasse', territory:'amber · saffron · tobacco shadow', ethos:'Warm materials shaped for evening rather than volume.', products:['velours-ambre','velvet-room-candle'] },
    { id:'elan-studio', name:'Élan Studio', origin:'Seoul', territory:'iris · tea · translucent woods', ethos:'Clean, lucid compositions with a restrained modern finish.', products:['iris-haze'] },
    { id:'orphee', name:'Orphée', origin:'Independent house', territory:'sandalwood · fig leaf · musk', ethos:'Creamy woods and green texture without smoky heaviness.', products:['santal-veil'] },
    { id:'lumiere-17', name:'Lumière 17', origin:'Côte d’Azur', territory:'neroli · petitgrain · mineral light', ethos:'Brightness with enough green bitterness to stay precise.', products:['neroli-rain'] },
    { id:'nacre', name:'Nacre', origin:'Tokyo', territory:'ambrette · rice · clean woods', ethos:'Near-skin fragrances built around intimacy and texture.', products:['peau-de-lune'] }
  ];

  const META = {
    'violette-03': { mood:['intimate','soft'], presence:'intimate', character:'Powdered violet, cool iris and sandalwood worn close to skin.', wear:'quiet day · close evening', sample:true },
    'velours-ambre': { mood:['warm','mysterious'], presence:'statement', character:'Dry saffron and resinous amber softened by tonka and cashmere woods.', wear:'evening · dressed intimacy', sample:true },
    'iris-haze': { mood:['clean','soft'], presence:'moderate', character:'Airy iris, white tea and cedar with a cool, translucent finish.', wear:'daylight · work · gallery', sample:true },
    'santal-veil': { mood:['warm','contemplative'], presence:'moderate', character:'Creamy sandalwood, green fig leaf and quiet musk.', wear:'slow afternoon · travel · evening', sample:true },
    'neroli-rain': { mood:['clean','luminous'], presence:'moderate', character:'Neroli and petitgrain over mineral musk — bright, green and quietly radiant.', wear:'warm day · travel · morning', sample:true },
    'peau-de-lune': { mood:['intimate','clean'], presence:'intimate', character:'Ambrette, steamed-rice softness and clean woods creating a second-skin effect.', wear:'skin scent · layering · close spaces', sample:true },
    'nuit-de-figue': { mood:['contemplative','mysterious'], presence:'moderate', character:'Green fig sap, black tea and dry cedar with a shadowed structure.', wear:'late afternoon · reading · dinner', sample:true },
    'violet-discovery-set': { mood:['explore'], presence:'varied', character:'Six small scent stories for slow at-home comparison.', wear:'at-home discovery · gifting', sample:false },
    'velvet-room-candle': { mood:['warm','mysterious'], presence:'room', character:'Iris dust, tobacco leaf and amber for a softly shadowed room.', wear:'home · evening ritual', sample:false },
    'signature-gift-trio': { mood:['explore','gift'], presence:'varied', character:'Three travel directions across floral light, amber warmth and quiet woods.', wear:'gifting · travel', sample:false }
  };

  /* Supporting imagery is intentionally botanical / tactile rather than photographs of
     unrelated branded perfume bottles. These images communicate ingredients, material
     and atmosphere; the catalogue image remains the only product-object source. */
  const EDITORIAL_MEDIA = [
    'https://images.pexels.com/photos/16296816/pexels-photo-16296816.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/7828507/pexels-photo-7828507.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/34330514/pexels-photo-34330514.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/7232409/pexels-photo-7232409.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/37048236/pexels-photo-37048236.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/1261173/pexels-photo-1261173.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/3817638/pexels-photo-3817638.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/30618181/pexels-photo-30618181.jpeg?auto=compress&cs=tinysrgb&w=1600'
  ];

  const moodLabels = { clean:'Clean / lucid', intimate:'Intimate / skin', soft:'Soft / powdery', warm:'Warm / enveloping', luminous:'Luminous / bright', contemplative:'Contemplative', mysterious:'Mysterious / shadowed', explore:'Discovery', gift:'Giftable' };
  const presenceLabels = { intimate:'Close to skin', moderate:'Quiet presence', statement:'Statement', varied:'Varied', room:'Room scent' };
  const familyLabels = Object.fromEntries((DATA.categories || []).map(category => [category.id, category.name]));

  function metaFor(product){ return META[product.id] || { mood:['soft'], presence:'moderate', character:product.description || product.family || 'Fine fragrance', wear:'everyday', sample:false }; }
  function houseFor(product){ return HOUSES.find(house => house.name === product.brand) || null; }
  function houseById(id){ return HOUSES.find(house => house.id === id); }
  function concentrationKey(product){ const value=(product.concentration||'').toLowerCase(); if(value.includes('extrait')) return 'extrait'; if(value.includes('eau de parfum')) return 'edp'; if(value.includes('discovery')) return 'discovery'; return 'other'; }
  function mediaFor(product){
    const index = Math.max(0, DATA.products.findIndex(item => item.id === product.id));
    const offset = (index * 2) % EDITORIAL_MEDIA.length;
    return [product.image, EDITORIAL_MEDIA[offset], EDITORIAL_MEDIA[(offset + 3) % EDITORIAL_MEDIA.length], EDITORIAL_MEDIA[(offset + 5) % EDITORIAL_MEDIA.length]];
  }
  function safeJSON(value, fallback){ try { return JSON.parse(value); } catch { return fallback; } }
  function getCart(){ return safeJSON(localStorage.getItem(CART_KEY) || '[]', []); }
  function setCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); const count=cart.reduce((sum,row)=>sum+Number(row.qty||0),0); document.querySelectorAll('.cart-count').forEach(el=>el.textContent=count); }
  function addBottle(id){ const cart=getCart(); const existing=cart.find(row=>row.id===id); if(existing) existing.qty+=1; else cart.push({id,qty:1}); setCart(cart); status(`Added ${byId(id)?.name || 'fragrance'} to bag.`); }
  function getTrio(){ return safeJSON(localStorage.getItem(TRIO_KEY) || '[]', []).filter(id => byId(id) && metaFor(byId(id)).sample).slice(0,3); }
  function setTrio(ids){ localStorage.setItem(TRIO_KEY, JSON.stringify([...new Set(ids)].slice(0,3))); }
  function addToTrio(id){ const product=byId(id); if(!product || !metaFor(product).sample) return {ok:false,message:'This object is not part of the representative vial set.'}; const trio=getTrio(); if(trio.includes(id)) return {ok:false,message:`${product.name} is already in your trio.`}; if(trio.length>=3) return {ok:false,message:'Your trio is full. Remove one direction before adding another.'}; trio.push(id); setTrio(trio); return {ok:true,message:`${product.name} added to your trial trio.`}; }
  function removeFromTrio(id){ setTrio(getTrio().filter(item => item !== id)); }
  function status(message){ let el=document.querySelector('.v4-status'); if(!el){ el=document.createElement('div'); el.className='v4-status'; el.setAttribute('role','status'); document.body.append(el); } el.textContent=message; el.classList.add('show'); clearTimeout(window.__v4Status); window.__v4Status=setTimeout(()=>el.classList.remove('show'),2200); }

  function v4Card(product, extra=''){
    const meta=metaFor(product); const house=houseFor(product); const media=mediaFor(product);
    return `<article class="v4-object-card"><a class="v4-object-link" href="product.html?id=${encodeURIComponent(product.id)}">
      <div class="v4-object-media"><img src="${media[0]}" alt="${product.name} by ${product.brand}" loading="lazy"><img class="v5-card-image--alt" src="${media[1]}" alt="Editorial material study for ${product.name}" loading="lazy">${meta.sample?'<span class="v5-card-badge">Try first</span>':''}</div>
      <div class="v4-object-index"><span>${house ? house.origin : 'Violet edit'}</span><span>${product.family || ''}</span></div>
      <div class="v4-object-heading"><span>${product.brand}</span><h3>${product.name}</h3></div>
      <div class="v4-object-meta"><span>${product.concentration || ''}${product.size ? ` · ${product.size}` : ''}</span><strong>${money(product.price)}</strong></div>
      ${extra ? `<p class="v4-object-reason">${extra}</p>` : ''}
    </a></article>`;
  }

  function upgradeChrome(){
    document.body.classList.add('violet-v4');
    const nav=document.querySelector('.nav-inner');
    if(nav) nav.innerHTML='<a href="search.html">Fragrances</a><a href="houses.html">Houses</a><a href="discovery.html">Discovery</a><a href="finder.html">Scent Portrait</a>';
    const top=document.querySelector('.topbar-inner > span'); if(top) top.textContent='Violet Editions · objects, houses and slower discovery';
    const topLinks=document.querySelector('.top-links'); if(topLinks) topLinks.innerHTML='<a href="discovery.html">Discovery ritual</a><a href="finder.html">Scent portrait</a><a href="seller.html">For fragrance houses</a>';
    const input=document.querySelector('[data-search-form] input'); if(input) input.placeholder='Tìm fragrance, note, maison...';
    const footer=document.querySelector('.footer-grid');
    if(footer) footer.innerHTML='<div><a class="brand footer-brand" href="index.html">Violet<span>.</span><small>Parfumerie</small></a><p>A fictional multi-house fragrance marketplace prototype shaped around objects, maisons and slower trial.</p></div><div><h4>Discover</h4><div class="footer-links"><a href="search.html">Fragrances</a><a href="discovery.html">Discovery</a><a href="finder.html">Scent Portrait</a></div></div><div><h4>Houses</h4><div class="footer-links"><a href="houses.html">Curated houses</a><a href="seller.html">Fragrance House Center</a><a href="search.html?sample=1">Try-first edit</a></div></div><div><h4>Prototype</h4><div class="footer-links"><span>Fictional maisons</span><span>Browser-local checkout</span><span>No fake AI claim</span></div></div>';
  }

  function renderHome(){
    const feature=document.querySelector('[data-v4-feature]'); if(!feature) return;
    const product=byId('violette-03') || DATA.products[0]; const meta=metaFor(product); const house=houseFor(product); const media=mediaFor(product);
    feature.innerHTML=`<div class="v4-feature-copy"><div class="v4-section-label"><span>V.01 / FEATURED OBJECT</span><span>${house?.origin || 'Violet edit'}</span></div><div><span class="v4-kicker">${product.brand}</span><h1>${product.name}</h1><p class="v4-feature-sensory">${meta.character}</p></div><div class="v4-feature-commerce"><span>${product.concentration} · ${product.size}</span><strong>${money(product.price)}</strong><div><a class="btn btn-primary" href="product.html?id=${product.id}">View object</a><a class="v4-text-link" href="discovery.html?focus=${product.id}">Try first →</a></div></div></div>
      <a class="v4-feature-media" href="product.html?id=${product.id}" aria-label="Explore ${product.name}"><div class="v5-hero-mosaic"><div class="v5-hero-shot"><img src="${media[0]}" alt="${product.name} by ${product.brand}"><span>Object / ${product.family}</span></div><div class="v5-hero-shot"><img src="${media[1]}" alt="Editorial fragrance material study"><span>Material study</span></div><div class="v5-hero-shot"><img src="${media[2]}" alt="Editorial fragrance atmosphere"><span>Atmosphere</span></div></div></a>`;

    const houseIndex=document.querySelector('[data-v4-house-index]');
    if(houseIndex) houseIndex.innerHTML=`<div class="v4-house-index">${HOUSES.slice(0,5).map((house,index)=>{ const p=house.products.map(byId).find(Boolean)||DATA.products[0]; return `<a href="house.html?id=${house.id}"><span>${String(index+1).padStart(2,'0')}</span><img class="v5-house-thumb" src="${p?.image||''}" alt="${house.name} edit" loading="lazy"><strong>${house.name}</strong><em>${house.origin}</em><small>${house.territory}</small><i>↗</i></a>`; }).join('')}</div>`;

    const shelf=document.querySelector('[data-v4-shelf]');
    if(shelf){
      const objects=['peau-de-lune','velours-ambre','neroli-rain','santal-veil'].map(byId).filter(Boolean);
      const story=mediaFor(byId('nuit-de-figue')||objects[0]);
      shelf.innerHTML=`${objects.slice(0,2).map(p=>v4Card(p)).join('')}<aside class="v5-shelf-story"><img src="${story[2]}" alt="Violet editorial scent atmosphere" loading="lazy"><div><span>VIOLET EDIT / SKIN & SHADOW</span><strong>Quiet can still leave a trace.</strong><a href="search.html?mood=intimate">Open the intimate edit →</a></div></aside>${objects.slice(2).map(p=>v4Card(p)).join('')}`;
    }
  }

  function paramsUrl(changes={}){ const next=new URLSearchParams(location.search); Object.entries(changes).forEach(([key,value])=>{ if(value===null || value==='' || next.get(key)===String(value)) next.delete(key); else next.set(key,String(value)); }); const text=next.toString(); return `search.html${text?`?${text}`:''}`; }
  function removeParamUrl(key){ const next=new URLSearchParams(location.search); next.delete(key); const text=next.toString(); return `search.html${text?`?${text}`:''}`; }

  function renderLibrary(){
    const grid=document.querySelector('[data-results]'); const panel=document.querySelector('[data-v4-filter]'); if(!grid || !panel) return;
    const current=new URLSearchParams(location.search); const q=(current.get('q')||'').trim().toLowerCase(); const category=current.get('category')||''; const mood=current.get('mood')||''; const presence=current.get('presence')||''; const concentration=current.get('concentration')||''; const house=current.get('house')||''; const sample=current.get('sample')==='1';
    panel.innerHTML=`<div class="v4-filter-title"><span>Refine</span><a href="search.html">Clear</a></div>
      <div class="v4-filter-group"><strong>Family</strong>${['floral','woody','amber','fresh','musk'].map(value=>`<a aria-current="${category===value}" href="${paramsUrl({category:value})}">${familyLabels[value]||value}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>Mood</strong>${['clean','intimate','soft','warm','luminous','contemplative','mysterious'].map(value=>`<a aria-current="${mood===value}" href="${paramsUrl({mood:value})}">${moodLabels[value]}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>Presence</strong>${['intimate','moderate','statement'].map(value=>`<a aria-current="${presence===value}" href="${paramsUrl({presence:value})}">${presenceLabels[value]}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>House</strong>${HOUSES.map(value=>`<a aria-current="${house===value.id}" href="${paramsUrl({house:value.id})}">${value.name}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>Format</strong><a aria-current="${concentration==='edp'}" href="${paramsUrl({concentration:'edp'})}">Eau de Parfum<span>↗</span></a><a aria-current="${concentration==='extrait'}" href="${paramsUrl({concentration:'extrait'})}">Extrait<span>↗</span></a><a aria-current="${sample}" href="${paramsUrl({sample:'1'})}">Try first<span>↗</span></a></div>`;

    let items=DATA.products.filter(product=>{
      const meta=metaFor(product); const productHouse=houseFor(product); const searchable=[product.name,product.brand,product.family,product.concentration,product.description,meta.character,...meta.mood].filter(Boolean).join(' ').toLowerCase();
      return (!q || searchable.includes(q)) && (!category || product.category===category) && (!mood || meta.mood.includes(mood)) && (!presence || meta.presence===presence) && (!concentration || concentrationKey(product)===concentration) && (!house || productHouse?.id===house) && (!sample || meta.sample);
    });

    const title=document.querySelector('[data-result-title]'); if(title){ if(q) title.textContent=`Results for “${current.get('q')}”`; else if(house) title.textContent=houseById(house)?.name || 'House edit'; else if(category) title.textContent=familyLabels[category]||'Fragrance'; else if(mood) title.textContent=moodLabels[mood]||'Mood edit'; else if(sample) title.textContent='Try-first edit'; else title.textContent='Fragrance Library'; }
    const chips=document.querySelector('[data-active-chips]'); if(chips){ const active=[]; if(category) active.push(['category',familyLabels[category]||category]); if(mood) active.push(['mood',moodLabels[mood]||mood]); if(presence) active.push(['presence',presenceLabels[presence]||presence]); if(house) active.push(['house',houseById(house)?.name||house]); if(concentration) active.push(['concentration',concentration==='edp'?'Eau de Parfum':'Extrait']); if(sample) active.push(['sample','Try first']); if(q) active.push(['q',`“${current.get('q')}”`]); chips.innerHTML=active.map(([key,label])=>`<span class="chip">${label}<a href="${removeParamUrl(key)}" aria-label="Remove ${label}">×</a></span>`).join(''); }

    const sort=document.querySelector('[data-sort]');
    const draw=()=>{
      let list=[...items]; if(sort?.value==='price-asc') list.sort((a,b)=>a.price-b.price); if(sort?.value==='price-desc') list.sort((a,b)=>b.price-a.price); if(sort?.value==='rating') list.sort((a,b)=>b.rating-a.rating);
      document.querySelectorAll('[data-result-count]').forEach(el=>el.textContent=`${list.length} object${list.length===1?'':'s'}`);
      if(!list.length){ grid.innerHTML='<div class="v4-empty"><span>NO OBJECT IN THIS EDIT</span><h2>Widen the scent portrait.</h2><p>Remove one refinement or begin from feeling instead.</p><div><a class="btn btn-secondary" href="search.html">Clear filters</a> <a class="btn btn-primary" href="finder.html">Scent Portrait</a></div></div>'; return; }
      const chunks=[]; list.forEach((product,index)=>{ chunks.push(v4Card(product)); if(index===5 && list.length>6){ const image=mediaFor(product)[2]; chunks.push(`<aside class="v4-plp-interrupt"><img src="${image}" alt="Editorial fragrance atmosphere"><div><span>HOUSE INTERRUPTION / 03</span><strong>Browse a maison, not only a note.</strong><p>Use a house when you want a consistent scent territory instead of a longer filter list.</p><a href="houses.html">Open curated houses →</a></div></aside>`); } }); grid.innerHTML=chunks.join('');
    };
    sort?.addEventListener('change',draw); draw();
  }

  function relatedProducts(product){
    const meta=metaFor(product);
    return DATA.products.filter(item=>item.id!==product.id && metaFor(item).sample).map(item=>{ const im=metaFor(item); let score=0; const reasons=[]; if(item.category===product.category){score+=4;reasons.push(`same ${product.family||'family'} direction`);} const shared=im.mood.find(value=>meta.mood.includes(value)); if(shared){score+=3;reasons.push(`shared ${moodLabels[shared]?.toLowerCase()||shared} mood`);} if(im.presence===meta.presence){score+=2;reasons.push(`similar ${presenceLabels[meta.presence]?.toLowerCase()||'presence'}`);} return {item,score,reason:reasons.slice(0,2).join(' · ')||'a contrasting route in the Violet edit'}; }).sort((a,b)=>b.score-a.score).slice(0,3);
  }

  function renderProduct(){
    const host=document.querySelector('[data-product-detail]'); if(!host) return;
    const product=byId(qs.get('id'))||DATA.products[0]; if(!product) return;
    const meta=metaFor(product); const house=houseFor(product); const notes=product.notes||{}; const related=relatedProducts(product); const media=mediaFor(product);
    document.title=`${product.name} · ${product.brand} · Violet Parfumerie`; host.className='v4-pdp';
    host.innerHTML=`<div class="v4-pdp-media"><div class="v4-pdp-media-index"><span>V.11 / OBJECT STUDY</span><span>${product.family||'Fine fragrance'}</span></div>
        <div class="v5-gallery"><figure class="v5-gallery-tile v5-gallery-main"><img src="${media[0]}" alt="${product.name} by ${product.brand}"><figcaption class="v5-media-caption">Object view</figcaption></figure><figure class="v5-gallery-tile"><img src="${media[1]}" alt="Editorial fragrance material study"><figcaption class="v5-media-caption">Material study</figcaption></figure><figure class="v5-gallery-tile"><img src="${media[2]}" alt="Editorial fragrance atmosphere"><figcaption class="v5-media-caption">Atmosphere</figcaption></figure><figure class="v5-gallery-tile v5-gallery-wide"><img src="${media[3]}" alt="Editorial fragrance texture study" loading="lazy"><figcaption class="v5-media-caption">Texture / editorial study</figcaption></figure></div>
        <div class="v4-pdp-media-foot"><span>${product.brand}</span><span>${product.concentration||''} · ${product.size||''}</span></div></div>
      <aside class="v4-buying-desk"><div class="v4-buying-index"><span>VIOLET OBJECT / ${String(DATA.products.findIndex(item=>item.id===product.id)+1).padStart(2,'0')}</span><span>${meta.sample?'TRY FIRST':'VIOLET EDIT'}</span></div><a class="v4-pdp-house" href="${house?`house.html?id=${house.id}`:'houses.html'}">${product.brand}</a><h1>${product.name}</h1><p class="v4-pdp-character">${meta.character}</p><div class="v4-pdp-format">${product.concentration||''} · ${product.size||''} · ${product.family||''}</div><div class="v4-pdp-price"><strong>${money(product.price)}</strong><span>${product.stock>0?`${product.stock} in prototype inventory`:'Unavailable'}</span></div><div class="v4-size-row"><span>Size</span><button type="button" aria-pressed="true">${product.size||'One size'}</button></div><div class="v4-pdp-actions"><button class="btn btn-primary" type="button" data-v4-add-bottle="${product.id}" ${product.stock<=0?'disabled':''}>Add full bottle</button>${meta.sample?`<button class="btn btn-secondary" type="button" data-v4-add-sample="${product.id}">Add to trial trio</button>`:`<a class="btn btn-secondary" href="discovery.html">Explore Discovery</a>`}</div><p class="v4-reality-note">Prototype commerce is browser-local. Editorial support images communicate mood/material and are not extra packshots of the fictional bottle.</p><div class="v4-pdp-quick"><div><span>Presence</span><strong>${presenceLabels[meta.presence]||meta.presence}</strong></div><div><span>Wear</span><strong>${meta.wear}</strong></div></div></aside>
      <section class="v4-pdp-story"><figure class="v5-story-media"><img src="${media[2]}" alt="Editorial scent atmosphere for ${product.name}" loading="lazy"><figcaption class="v5-media-caption">Scent atmosphere / editorial reference</figcaption></figure><div class="v5-story-copy"><div class="v4-pdp-story-lead"><span class="v4-kicker">01 / THE SCENT</span><h2>${product.description}</h2></div><div class="v4-note-table"><div><span>Top</span><strong>${notes.top||'—'}</strong></div><div><span>Heart</span><strong>${notes.heart||'—'}</strong></div><div><span>Base</span><strong>${notes.base||'—'}</strong></div></div><div class="v4-house-proof"><span class="v4-kicker">02 / THE HOUSE</span><h3>${house?.name||product.brand}</h3><p>${house?.ethos||'Part of the Violet curated prototype edit.'}</p><p class="v4-house-territory">${house?.territory||product.family||''}</p><a href="${house?`house.html?id=${house.id}`:'houses.html'}">Open the maison →</a></div></div></section>
      <section class="v4-related"><div class="v4-section-label"><span>03 / NEARBY DIRECTIONS</span><span>Shared family, mood or presence</span></div><div class="v4-related-grid">${related.map(row=>v4Card(row.item,row.reason)).join('')}</div></section>`;
    host.querySelector('[data-v4-add-bottle]')?.addEventListener('click',()=>addBottle(product.id));
    host.querySelector('[data-v4-add-sample]')?.addEventListener('click',event=>{ const result=addToTrio(product.id); status(result.message); if(result.ok) event.currentTarget.textContent='Added to trial trio'; });
  }

  function renderTrio(){
    const panel=document.querySelector('[data-v4-trio-panel]'); if(!panel) return; const trio=getTrio(); const products=trio.map(byId).filter(Boolean);
    panel.innerHTML=`<div class="v4-trio-head"><span>Your trio</span><strong>${products.length}/3</strong></div>${products.length?`<div class="v4-trio-items">${products.map((product,index)=>`<div class="v4-trio-item"><span>${String(index+1).padStart(2,'0')}</span><img class="v5-trio-thumb" src="${product.image}" alt="${product.name}"><div><strong>${product.name}</strong><small>${product.brand} · ${product.family}</small></div><button type="button" data-v4-remove-sample="${product.id}" aria-label="Remove ${product.name}">Remove</button></div>`).join('')}</div>`:`<div class="v4-trio-empty"><strong>No direction selected yet.</strong><p>Choose up to three representative fragrances below.</p></div>`}<div class="v4-trio-state"><p>${products.length===3?'Trio complete — wear each direction separately before deciding on a bottle.':`${3-products.length} place${3-products.length===1?'':'s'} remaining.`}</p></div>`;
    panel.querySelectorAll('[data-v4-remove-sample]').forEach(button=>button.addEventListener('click',()=>{removeFromTrio(button.dataset.v4RemoveSample);renderTrio();renderSampleList();}));
  }

  function renderSampleList(){
    const host=document.querySelector('[data-v4-sample-list]'); if(!host) return; const trio=getTrio(); const products=DATA.products.filter(product=>metaFor(product).sample);
    host.innerHTML=products.map((product,index)=>{ const selected=trio.includes(product.id); const full=trio.length>=3&&!selected; return `<article class="v4-sample-row"><span>${String(index+1).padStart(2,'0')}</span><img class="v5-sample-thumb" src="${product.image}" alt="${product.name}" loading="lazy"><div><strong>${product.name}</strong><small>${product.brand} · ${product.family}</small></div><p>${metaFor(product).character}</p><button type="button" data-v4-sample-choice="${product.id}" aria-pressed="${selected}" ${full?'disabled':''}>${selected?'Selected':full?'Trio full':'Add to trio'}</button></article>`; }).join('');
    host.querySelectorAll('[data-v4-sample-choice]').forEach(button=>button.addEventListener('click',()=>{ const id=button.dataset.v4SampleChoice; if(getTrio().includes(id)) removeFromTrio(id); else { const result=addToTrio(id); status(result.message); } renderTrio(); renderSampleList(); }));
  }

  function renderDiscovery(){
    if(!document.querySelector('.v4-discovery-page')) return; const focus=qs.get('focus'); if(focus && byId(focus) && metaFor(byId(focus)).sample && !getTrio().includes(focus)) addToTrio(focus); renderTrio(); renderSampleList();
    const wardrobe=document.querySelector('[data-v4-wardrobe]'); const product=byId('violet-discovery-set');
    if(wardrobe&&product) wardrobe.innerHTML=`<div><span class="v4-kicker">03 / PRE-COMPOSED</span><h2>Prefer one ready-made wardrobe?</h2><p>${product.description}</p><div class="v4-wardrobe-meta"><span>${product.size}</span><strong>${money(product.price)}</strong></div><div class="v4-wardrobe-actions"><button class="btn btn-primary" type="button" data-v4-add-wardrobe>Add Discovery Wardrobe</button><a class="v4-text-link" href="product.html?id=${product.id}">View object →</a></div></div><div class="v4-wardrobe-media"><img src="${mediaFor(product)[0]}" alt="${product.name}"></div>`;
    wardrobe?.querySelector('[data-v4-add-wardrobe]')?.addEventListener('click',()=>addBottle(product.id));
  }

  upgradeChrome();
  renderHome();
  renderLibrary();
  renderProduct();
  renderDiscovery();
})();
