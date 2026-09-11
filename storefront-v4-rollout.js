(() => {
  const DATA = window.VIOLET_DATA || { products: [] };
  const qs = new URLSearchParams(location.search);
  const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(n || 0));

  const HOUSES = [
    { id:'maison-aster', name:'Maison Aster', origin:'Paris', territory:'powdered violet · green fig · quiet woods', ethos:'Soft structure, cool florals and contemplative green woods.', signature:'Powdered florals with a green, meditative edge.' },
    { id:'atelier-nocturne', name:'Atelier Nocturne', origin:'Grasse', territory:'amber · saffron · tobacco shadow', ethos:'Warm materials shaped for evening rather than volume.', signature:'Dry amber and shadowed warmth with tailored restraint.' },
    { id:'elan-studio', name:'Élan Studio', origin:'Seoul', territory:'iris · tea · translucent woods', ethos:'Clean, lucid compositions with a restrained modern finish.', signature:'Airy iris, tea and transparent structure.' },
    { id:'orphee', name:'Orphée', origin:'Independent house', territory:'sandalwood · fig leaf · musk', ethos:'Creamy woods and green texture without smoky heaviness.', signature:'Soft woods made tactile rather than heavy.' },
    { id:'lumiere-17', name:'Lumière 17', origin:'Côte d’Azur', territory:'neroli · petitgrain · mineral light', ethos:'Brightness with enough green bitterness to stay precise.', signature:'Citrus light with a mineral, green spine.' },
    { id:'nacre', name:'Nacre', origin:'Tokyo', territory:'ambrette · rice · clean woods', ethos:'Near-skin fragrances built around intimacy and texture.', signature:'Second-skin musk and soft materiality.' }
  ];

  const houseById = id => HOUSES.find(house => house.id === id);
  const productsForHouse = house => DATA.products.filter(product => product.brand === house.name);

  function cartCount(){
    try {
      return JSON.parse(localStorage.getItem('violet-marketplace-cart-v1') || '[]')
        .reduce((sum,row)=>sum+Number(row.qty||0),0);
    } catch { return 0; }
  }

  function normalizeBuyerChrome(){
    document.documentElement.lang = 'en';
    document.body.classList.add('violet-maison');
    const path = location.pathname.split('/').pop() || 'index.html';
    document.body.dataset.maisonPage = path.replace('.html','') || 'home';

    const topMessage = document.querySelector('.topbar-inner > span');
    if(topMessage) topMessage.textContent = 'Violet Parfumerie · scent objects, fictional houses, slower discovery';

    const input = document.querySelector('[data-search-form] input');
    if(input){
      input.placeholder = 'Search fragrance, note, or maison…';
      input.setAttribute('aria-label','Search fragrances');
      input.addEventListener('input',()=>requestAnimationFrame(()=>{
        const box = document.querySelector('[data-suggestions]');
        const fallback = box?.querySelector('a.suggestion:only-child');
        if(fallback && fallback.textContent.trim().startsWith('Xem fragrance')){
          fallback.textContent = `View results for “${input.value}”`;
        }
      }));
    }
    const searchButton = document.querySelector('[data-search-form] button');
    if(searchButton) searchButton.textContent = 'Search';

    const actions = document.querySelector('.header-actions');
    if(actions){
      actions.innerHTML = `<a class="icon-link v5-trio-link" href="discovery.html">Saved trio</a><a class="icon-link cart-link" href="cart.html" title="Fragrance bag">Bag<span class="cart-count">${cartCount()}</span></a>`;
    }

    document.querySelectorAll('.nav-inner a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const active = (path==='index.html' && href==='index.html') || (path==='search.html' && href.startsWith('search.html')) || (path==='houses.html' && href.startsWith('houses.html')) || (path==='house.html' && href.startsWith('houses.html')) || (path==='discovery.html' && href.startsWith('discovery.html')) || (path==='finder.html' && href.startsWith('finder.html'));
      if(active) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });

    const footerMeta = document.querySelector('.footer-bottom span:last-child');
    if(footerMeta) footerMeta.textContent = 'Vietnam · VND · Curated prototype';
  }

  function card(product){
    return `<a class="v4-house-object" href="product.html?id=${encodeURIComponent(product.id)}">
      <div class="v4-house-object-media"><img src="${product.image}" alt="${product.name} by ${product.brand}" loading="lazy"></div>
      <div class="v4-house-object-meta"><span>${product.concentration || 'Violet object'}</span><span>${product.size || ''}</span></div>
      <h3>${product.name}</h3><p>${product.description || product.family || 'Fine fragrance'}</p><strong>${money(product.price)}</strong>
    </a>`;
  }

  function renderHousesIndex(){
    const host = document.querySelector('[data-v4-houses-index]');
    if(!host) return;
    host.innerHTML = HOUSES.map((house,index) => {
      const products = productsForHouse(house);
      return `<a class="v4-house-ledger-row" href="house.html?id=${house.id}"><span>${String(index+1).padStart(2,'0')}</span><h2>${house.name}</h2><em>${house.origin}</em><p>${house.territory}</p><small>${products.length} object${products.length===1?'':'s'} in prototype edit</small><i>↗</i></a>`;
    }).join('');
  }

  function renderHouseDetail(){
    const host = document.querySelector('[data-v4-house-detail]');
    if(!host) return;
    const house = houseById(qs.get('id')) || HOUSES[0];
    const products = productsForHouse(house);
    const feature = products[0] || DATA.products[0];
    document.title = `${house.name} · Violet Parfumerie`;
    host.innerHTML = `<section class="v4-house-hero">
      <div class="v4-house-copy"><div><span class="v4-house-origin">V.31 / ${house.origin}</span><h1>${house.name}</h1><p class="v4-house-ethos">${house.ethos}</p></div><div class="v4-house-territory-block"><span>Scent territory</span><strong>${house.territory}</strong></div></div>
      <div class="v4-house-feature"><div class="v4-house-feature-label"><span>HOUSE STUDY / FEATURE OBJECT</span><span>${feature ? feature.name : 'Violet edit'}</span></div>${feature?`<a class="v4-house-feature-media" href="product.html?id=${feature.id}"><img src="${feature.image}" alt="${feature.name} by ${house.name}"></a>`:'<div class="v4-house-feature-media"></div>'}<div class="v4-house-feature-foot"><span>${house.signature}</span><a href="search.html?house=${house.id}">Browse this house →</a></div></div>
    </section>
    <section class="v4-house-collection"><div class="v4-section-label"><span>V.32 / CURRENT EDIT</span><a href="search.html?house=${house.id}">Open in library →</a></div><div class="v4-house-collection-heading"><h2>The objects Violet keeps from this house.</h2><p>Fictional maison metadata is used to prototype house-led discovery. It is not a claim about a real fragrance company, stockist relationship or origin.</p></div><div class="v4-house-products">${products.length?products.map(card).join(''):'<div class="v4-empty"><span>NO OBJECTS</span><h2>This house has no prototype object yet.</h2><p>Return to the house index or fragrance library.</p></div>'}</div></section>`;
  }

  function patchFinder(){
    const page = document.querySelector('.portrait-page');
    if(!page) return;
    if(!document.querySelector('.v4-finder-handoff')){
      page.insertAdjacentHTML('beforeend', `<section class="v4-finder-handoff"><span>V.23 / AFTER THE PORTRAIT</span><strong>Turn the shortlist into a trial, not an instant full-bottle decision.</strong><a class="btn btn-primary" href="discovery.html">Build a trial trio</a></section>`);
    }
    const stage = document.querySelector('[data-portrait-stage]');
    if(!stage) return;
    const sync = () => {
      const action = stage.querySelector('.portrait-discovery a');
      if(!action) return;
      if(action.getAttribute('href') !== 'discovery.html') action.setAttribute('href','discovery.html');
      if(action.textContent !== 'Build a trial trio') action.textContent='Build a trial trio';
    };
    sync();
    new MutationObserver(sync).observe(stage,{childList:true,subtree:true});
  }

  function markUtilities(){
    const path = location.pathname.split('/').pop();
    if(['cart.html','checkout.html'].includes(path)) document.querySelector('main.container')?.classList.add('v4-utility-main');
    if(path==='order-success.html') document.querySelector('main.container')?.classList.add('v4-success-page');
    const note = document.querySelector('.v3-reality-note'); if(note) note.classList.replace('v3-reality-note','v4-reality-note');
  }

  function installEditorialMotion(){
    const targets = [
      '.v4-home-hero','.maison-manifesto','.v4-shelf-section','.maison-ritual','.v4-route-index','.v4-houses-section','.v4-discovery-callout',
      '.v4-library-masthead','.v4-object-grid','.v4-pdp','.v4-pdp-story','.v4-related','.v4-discovery-hero','.v4-discovery-workspace','.v4-sample-list-section','.v5-after-wear','.v4-wardrobe',
      '.v4-houses-hero','.v4-house-hero','.v4-house-collection','.portrait-shell','.v4-finder-handoff','.v4-utility-hero','.checkout-layout','.cart-layout','.v5-success-hero'
    ];
    const nodes = [...document.querySelectorAll(targets.join(','))];
    if(!nodes.length) return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)){
      nodes.forEach(node=>node.classList.add('maison-reveal','is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    nodes.forEach(node=>{ node.classList.add('maison-reveal'); observer.observe(node); });
  }

  normalizeBuyerChrome();
  renderHousesIndex();
  renderHouseDetail();
  patchFinder();
  markUtilities();
  requestAnimationFrame(installEditorialMotion);
})();
