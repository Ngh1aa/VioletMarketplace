(() => {
  const DATA = window.VIOLET_DATA || { products: [] };
  const qs = new URLSearchParams(location.search);
  const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));

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

  renderHousesIndex();
  renderHouseDetail();
  patchFinder();
  markUtilities();
})();
