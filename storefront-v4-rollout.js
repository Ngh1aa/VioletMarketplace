(() => {
  const DATA = window.VIOLET_DATA || { products: [] };
  const qs = new URLSearchParams(location.search);
  const money = n => `${new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(Number(n || 0))} €`;

  const HOUSES = [
    { id:'maison-aster', name:'Maison Aster', origin:'Paris', territory:'powdered violet · green fig · quiet woods', ethos:'Soft structure, cool florals and contemplative green woods.', signature:'Powdered florals with a green, meditative edge.' },
    { id:'atelier-nocturne', name:'Atelier Nocturne', origin:'Grasse', territory:'amber · saffron · tobacco shadow', ethos:'Warm materials shaped for evening rather than volume.', signature:'Dry amber and shadowed warmth with tailored restraint.' },
    { id:'elan-studio', name:'Élan Studio', origin:'Seoul', territory:'iris · tea · translucent woods', ethos:'Clean, lucid compositions with a restrained modern finish.', signature:'Airy iris, tea and transparent structure.' },
    { id:'orphee', name:'Orphée', origin:'Independent house', territory:'sandalwood · fig leaf · musk', ethos:'Creamy woods and green texture without smoky heaviness.', signature:'Soft woods made tactile rather than heavy.' },
    { id:'lumiere-17', name:'Lumière 17', origin:'Côte d’Azur', territory:'neroli · petitgrain · mineral light', ethos:'Brightness with enough green bitterness to stay precise.', signature:'Citrus light with a mineral, green spine.' },
    { id:'nacre', name:'Nacre', origin:'Tokyo', territory:'ambrette · rice · clean woods', ethos:'Near-skin fragrances built around intimacy and texture.', signature:'Second-skin musk and soft materiality.' }
  ];

  const EDITORIAL_MEDIA = [
    'https://images.pexels.com/photos/3817638/pexels-photo-3817638.jpeg?auto=compress&cs=tinysrgb&w=1800',
    'https://images.pexels.com/photos/7232409/pexels-photo-7232409.jpeg?auto=compress&cs=tinysrgb&w=1800',
    'https://images.pexels.com/photos/1261173/pexels-photo-1261173.jpeg?auto=compress&cs=tinysrgb&w=1800',
    'https://images.pexels.com/photos/7828507/pexels-photo-7828507.jpeg?auto=compress&cs=tinysrgb&w=1800',
    'https://images.pexels.com/photos/30618181/pexels-photo-30618181.jpeg?auto=compress&cs=tinysrgb&w=1800',
    'https://images.pexels.com/photos/34330514/pexels-photo-34330514.jpeg?auto=compress&cs=tinysrgb&w=1800'
  ];

  const houseById = id => HOUSES.find(house => house.id === id);
  const productsForHouse = house => DATA.products.filter(product => product.brand === house.name);
  const editorialFor = house => EDITORIAL_MEDIA[Math.max(0,HOUSES.findIndex(item=>item.id===house.id)) % EDITORIAL_MEDIA.length];

  function cartCount(){
    try { return JSON.parse(localStorage.getItem('violet-marketplace-cart-v1') || '[]').reduce((sum,row)=>sum+Number(row.qty||0),0); }
    catch { return 0; }
  }

  function normalizeBuyerChrome(){
    document.documentElement.lang='en';
    document.body.classList.add('violet-maison');
    const path=location.pathname.split('/').pop() || 'index.html';
    document.body.dataset.maisonPage=path.replace('.html','') || 'home';

    const actions=document.querySelector('.header-actions');
    if(actions) actions.innerHTML=`<a class="icon-link v5-trio-link" href="discovery.html">Saved trio</a><a class="icon-link cart-link" href="cart.html" title="Fragrance bag">Bag<span class="cart-count">${cartCount()}</span></a>`;

    document.querySelectorAll('.nav-inner a').forEach(link=>{
      const href=link.getAttribute('href')||'';
      const active=(path==='search.html'&&href.startsWith('search.html'))||(path==='houses.html'&&href.startsWith('houses.html'))||(path==='house.html'&&href.startsWith('houses.html'))||(path==='discovery.html'&&href.startsWith('discovery.html'))||(path==='finder.html'&&href.startsWith('finder.html'))||(path==='about.html'&&href.startsWith('about.html'));
      if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });

    const footerMeta=document.querySelector('.footer-bottom span:last-child');
    if(footerMeta) footerMeta.textContent='International edit · EUR · Curated prototype';
  }

  function houseCard(product){
    return `<a class="v4-house-object" href="product.html?id=${encodeURIComponent(product.id)}"><div class="v4-house-object-media"><img src="${product.image}" alt="${product.name} by ${product.brand}" loading="lazy"></div><div class="v4-house-object-meta"><span>${product.concentration || 'Violet object'}</span><span>${product.size || ''}</span></div><h3>${product.name}</h3><p>${product.description || product.family || 'Fine fragrance'}</p><strong>${money(product.price)}</strong></a>`;
  }

  function renderHousesIndex(){
    const host=document.querySelector('[data-v4-houses-index]'); if(!host) return;
    host.innerHTML=HOUSES.map((house,index)=>{
      const products=productsForHouse(house); const feature=products[0]||DATA.products[index%Math.max(1,DATA.products.length)]; const image=feature?.image||editorialFor(house);
      return `<a class="v4-house-ledger-row" href="house.html?id=${house.id}"><img src="${image}" alt="${house.name} visual territory" loading="lazy"><div class="v6-house-overlay"><span>${String(index+1).padStart(2,'0')}</span><h2>${house.name}</h2><em>${house.origin}</em><p>${house.territory} · ${products.length} object${products.length===1?'':'s'} in the prototype edit</p></div></a>`;
    }).join('');
  }

  function renderHouseDetail(){
    const host=document.querySelector('[data-v4-house-detail]'); if(!host) return;
    const house=houseById(qs.get('id'))||HOUSES[0]; const products=productsForHouse(house); const feature=products[0]||DATA.products[0]; const atelier=editorialFor(house); const secondary=EDITORIAL_MEDIA[(HOUSES.findIndex(item=>item.id===house.id)+2)%EDITORIAL_MEDIA.length];
    document.title=`${house.name} · Violet Parfumerie`;
    host.innerHTML=`<section class="v4-house-hero"><img src="${atelier}" alt="Editorial atelier atmosphere for ${house.name}"><div class="v6-house-hero-caption"><div><span class="v4-kicker">V.31 / ${house.origin}</span><h1>${house.name}</h1></div><p>${house.signature}</p></div></section>
      <section class="v6-house-editorial"><img src="${secondary}" alt="Material study for ${house.name}" loading="lazy"><div><span class="v4-kicker">SCENT TERRITORY</span><h2>What does this house keep returning to?</h2><p>${house.ethos}</p><p>${house.territory}</p></div></section>
      <section class="v4-house-collection"><div class="v4-section-label"><span>V.32 / CURRENT EDIT</span><a href="search.html?house=${house.id}">Open this house in the library →</a></div><div class="v4-house-collection-heading"><h2>The objects Violet keeps from this room.</h2><p>Fictional maison metadata is used to prototype house-led discovery. It is not a claim about a real fragrance company, stockist relationship or origin.</p></div><div class="v4-house-products">${products.length?products.map(houseCard).join(''):'<div class="v4-empty"><span>NO OBJECTS</span><h2>This house has no prototype object yet.</h2><p>Return to the house gallery or fragrance library.</p></div>'}</div></section>`;
  }

  function patchFinder(){
    const page=document.querySelector('.portrait-page'); if(!page) return;
    if(!document.querySelector('.v4-finder-handoff')) page.insertAdjacentHTML('beforeend',`<section class="v4-finder-handoff container"><span>V.23 / AFTER THE PORTRAIT</span><strong>Turn the shortlist into a trial, not an instant bottle decision.</strong><a class="btn btn-primary" href="discovery.html">Build a trial trio</a></section>`);
    const stage=document.querySelector('[data-portrait-stage]');
    if(!stage) return;
    const sync=()=>{
      const action=stage.querySelector('.portrait-discovery a');
      if(action){
        if(action.getAttribute('href')!=='discovery.html') action.setAttribute('href','discovery.html');
        if(action.textContent!=='Build a trial trio') action.textContent='Build a trial trio';
      }
      const step=document.querySelector('[data-step-label]');
      if(step){
        const text=step.textContent||'';
        if(/^Step\s+\d+\s+of\s+4$/i.test(text)){
          const match=text.match(/(\d+)/); const n=match?Number(match[1]):1;
          step.textContent=`${String(n).padStart(2,'0')} / 04`;
        }
      }
    };
    sync(); new MutationObserver(sync).observe(stage,{childList:true,subtree:true});
    stage.addEventListener('click',event=>{
      const option=event.target.closest('.portrait-option,[data-value]'); if(!option) return;
      const value=option.dataset.value||'';
      if(value) document.body.dataset.portraitMood=value;
    });
  }

  function markUtilities(){
    const path=location.pathname.split('/').pop();
    if(['cart.html','checkout.html'].includes(path)) document.querySelector('main.container')?.classList.add('v4-utility-main');
    if(path==='order-success.html') document.querySelector('main.container')?.classList.add('v4-success-page');
    const note=document.querySelector('.v3-reality-note'); if(note) note.classList.replace('v3-reality-note','v4-reality-note');
  }

  function installEditorialMotion(){
    const selectors=['.v4-home-hero','.maison-manifesto','.v4-shelf-section','.maison-texture-break','.maison-ritual','.v4-route-index','.v4-houses-section','.v4-discovery-callout','.v4-library-masthead','.v4-object-grid','.v6-pdp-stage','.v4-pdp-story','.v4-related','.v4-discovery-hero','.v4-discovery-workspace','.v4-sample-list-section','.v5-after-wear','.v4-wardrobe','.v4-houses-hero','.v4-house-hero','.v6-house-editorial','.v4-house-collection','.portrait-shell','.v4-finder-handoff','.about-hero','.about-spread','.about-quote','.v4-utility-hero','.checkout-layout','.cart-layout','.v5-success-hero'];
    const nodes=[...document.querySelectorAll(selectors.join(','))]; if(!nodes.length) return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){nodes.forEach(node=>node.classList.add('maison-reveal','is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.05,rootMargin:'0px 0px -25px 0px'});
    nodes.forEach(node=>{node.classList.add('maison-reveal');observer.observe(node);});
  }

  normalizeBuyerChrome();
  renderHousesIndex();
  renderHouseDetail();
  patchFinder();
  markUtilities();
  requestAnimationFrame(installEditorialMotion);
})();
