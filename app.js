(() => {
  const DATA = window.VIOLET_DATA || { products: [], categories: [] };
  const CART_KEY = 'violet-marketplace-cart-v1';
  const ORDER_KEY = 'violet-marketplace-last-order';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(n || 0));
  const qs = new URLSearchParams(location.search);
  const productById = id => DATA.products.find(p => p.id === id);
  const discount = p => p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const searchText = p => [
    p.name,
    p.brand,
    p.seller,
    p.family,
    p.concentration,
    p.description,
    p.notes ? Object.values(p.notes).join(' ') : ''
  ].filter(Boolean).join(' ').toLowerCase();

  function getCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }
  function setCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
  function addToCart(id, qty = 1){
    const cart = getCart(); const existing = cart.find(i => i.id === id);
    if(existing) existing.qty += qty; else cart.push({ id, qty });
    setCart(cart); toast('Added fragrance to your bag.');
  }
  function updateQty(id, delta){
    const cart = getCart(); const item = cart.find(i => i.id === id); if(!item) return;
    item.qty += delta; if(item.qty <= 0) cart.splice(cart.indexOf(item), 1);
    setCart(cart); renderCart();
  }
  function removeItem(id){ setCart(getCart().filter(i => i.id !== id)); renderCart(); }
  function cartDetailed(){ return getCart().map(i => ({...i, product: productById(i.id)})).filter(i => i.product); }
  function cartSubtotal(){ return cartDetailed().reduce((s,i) => s + i.product.price * i.qty, 0); }
  function updateCartCount(){ const count = getCart().reduce((s,i)=>s+i.qty,0); $$('.cart-count').forEach(el => el.textContent = count); }

  function toast(text){
    let el = $('.toast'); if(!el){ el = document.createElement('div'); el.className='toast'; el.setAttribute('role','status'); document.body.append(el); }
    el.textContent=text; requestAnimationFrame(()=>el.classList.add('show')); clearTimeout(window.__toast);
    window.__toast=setTimeout(()=>el.classList.remove('show'),1800);
  }

  function header(){
    return `<div class="topbar"><div class="container topbar-inner"><span>Violet Editions · objects, houses and slower discovery</span><div class="top-links"><a href="discovery.html">Discovery ritual</a><a href="finder.html">Scent Portrait</a><a href="seller.html">For fragrance houses</a></div></div></div>
    <header class="site-header"><div class="container header-main"><a class="brand" href="index.html">Violet<span>.</span><small>Parfumerie</small></a><div class="search-shell"><form class="search-form" data-search-form><input name="q" autocomplete="off" placeholder="Search fragrance, note, or maison…" aria-label="Search fragrances"><button>Search</button></form><div class="search-suggestions" data-suggestions></div></div><div class="header-actions"><a class="icon-link" href="discovery.html" title="Saved discovery trio">Saved trio</a><a class="icon-link cart-link" href="cart.html" title="Fragrance bag">Bag<span class="cart-count">0</span></a></div></div><div class="nav-row"><nav class="container nav-inner"><a href="search.html">Fragrances</a><a href="houses.html">Houses</a><a href="discovery.html">Discovery</a><a href="finder.html">Scent Portrait</a></nav></div></header>`;
  }
  function footer(){
    return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand footer-brand" href="index.html">Violet<span>.</span><small>Parfumerie</small></a><p>A fictional multi-house fragrance marketplace prototype shaped around objects, maisons and slower trial.</p></div><div><h4>Discover</h4><div class="footer-links"><a href="search.html">Fragrances</a><a href="discovery.html">Discovery</a><a href="finder.html">Scent Portrait</a></div></div><div><h4>Houses</h4><div class="footer-links"><a href="houses.html">Curated houses</a><a href="seller.html">Fragrance House Center</a><a href="search.html?sample=1">Try-first edit</a></div></div><div><h4>Prototype</h4><div class="footer-links"><span>Fictional maisons</span><span>Browser-local checkout</span><span>No fake AI claim</span></div></div></div><div class="footer-bottom"><span>© 2026 Violet Parfumerie</span><span>Vietnam · VND · Curated prototype</span></div></div></footer><nav class="mobile-nav"><a href="index.html">Home</a><a href="search.html">Scents</a><a href="cart.html">Bag</a><a href="discovery.html">Saved</a></nav>`;
  }
  $$('[data-site-header]').forEach(el => el.innerHTML = header());
  $$('[data-site-footer]').forEach(el => el.innerHTML = footer());

  function bindSearch(){
    $$('[data-search-form]').forEach(form => {
      const input = $('input', form); const box = form.parentElement.querySelector('[data-suggestions]');
      form.addEventListener('submit', e => { e.preventDefault(); const q=input.value.trim(); location.href=`search.html${q?`?q=${encodeURIComponent(q)}`:''}`; });
      input.addEventListener('input', () => {
        const q=input.value.trim().toLowerCase(); if(!q){box.classList.remove('open'); return;}
        const matches=DATA.products.filter(p => searchText(p).includes(q)).slice(0,5);
        box.innerHTML=matches.map(p=>`<a class="suggestion" href="product.html?id=${p.id}"><span><b>${p.name}</b><small>${p.brand} · ${p.family}</small></span><small>${money(p.price)}</small></a>`).join('') || `<a class="suggestion" href="search.html?q=${encodeURIComponent(q)}">View results for “${input.value}”</a>`;
        box.classList.add('open');
      });
      input.addEventListener('blur',()=>setTimeout(()=>box.classList.remove('open'),150));
    });
  }

  function productCard(p){
    const sale = discount(p);
    return `<article class="product-card"><a href="product.html?id=${p.id}"><div class="product-media"><img src="${p.image}" alt="${p.name} by ${p.brand}" loading="lazy">${sale?`<span class="badge badge-sale">Private edit · -${sale}%</span>`:''}</div><div class="product-body"><div class="product-brand"><span class="house-name">${p.brand}</span>${p.fast?'<span class="badge badge-fast">New</span>':''}</div><div class="product-title">${p.name}</div><div class="product-scent-line">${p.concentration || ''}${p.size ? ` · ${p.size}` : ''}</div><div class="product-meta"><span>${p.family || ''}</span><span>★ ${p.rating}</span></div><div class="price-row"><div><div class="price">${money(p.price)}</div>${p.oldPrice?`<div class="old-price">${money(p.oldPrice)}</div>`:''}</div><span class="product-arrow">↗</span></div></div></a></article>`;
  }

  function renderHome(){
    const cat=$('[data-categories]'); if(cat) cat.innerHTML=DATA.categories.map(c=>`<a class="category-card" href="search.html?category=${c.id}"><div class="quick-icon">${c.icon}</div><strong>${c.name}</strong><span>Explore notes →</span></a>`).join('');
    const arrivals=$('[data-new]'); if(arrivals) arrivals.innerHTML=DATA.products.slice(0,4).map(productCard).join('');
    const houses=$('[data-houses]'); if(houses) houses.innerHTML=DATA.products.filter(p=>p.official).slice(2,6).map(productCard).join('');
    const rec=$('[data-recommend]'); if(rec) rec.innerHTML=DATA.products.slice(4,10).map(productCard).join('');
    const legacyFlash=$('[data-flash]'); if(legacyFlash) legacyFlash.innerHTML=DATA.products.slice(0,4).map(productCard).join('');
    const legacyMall=$('[data-mall]'); if(legacyMall) legacyMall.innerHTML=DATA.products.filter(p=>p.official).slice(0,4).map(productCard).join('');
  }

  function renderSearch(){
    const grid=$('[data-results]'); if(!grid) return;
    const q=(qs.get('q')||'').toLowerCase(); const category=qs.get('category'); const official=qs.get('official'); const deal=qs.get('deal');
    let items=DATA.products.filter(p => !q || searchText(p).includes(q));
    if(category) items=items.filter(p=>p.category===category); if(official) items=items.filter(p=>p.official); if(deal) items=items.filter(p=>discount(p)>0);
    const title=$('[data-result-title]'); if(title) title.textContent=q?`Results for “${qs.get('q')}”`:category?(DATA.categories.find(c=>c.id===category)?.name||'Fragrance'):official?'Curated Houses':deal?'Private Edit':'All Fragrance';
    const counts=$$('[data-result-count]'); counts.forEach(count => count.textContent=`${items.length} fragrance${items.length===1?'':'s'}`);
    const chips=$('[data-active-chips]'); if(chips){ const arr=[]; if(category) arr.push(DATA.categories.find(c=>c.id===category)?.name); if(official) arr.push('Curated house'); if(deal) arr.push('Private edit'); if(q) arr.push(`“${qs.get('q')}”`); chips.innerHTML=arr.filter(Boolean).map(x=>`<span class="chip">${x}</span>`).join(''); }
    const sort=$('[data-sort]');
    function draw(){ let list=[...items]; if(sort?.value==='price-asc') list.sort((a,b)=>a.price-b.price); if(sort?.value==='price-desc') list.sort((a,b)=>b.price-a.price); if(sort?.value==='rating') list.sort((a,b)=>b.rating-a.rating); grid.innerHTML=list.length?list.map(productCard).join(''):'<div class="empty" style="grid-column:1/-1"><h3>No fragrance matches yet.</h3><p>Try another family or note, such as iris, amber, sandalwood or musk.</p></div>'; }
    sort?.addEventListener('change',draw); draw();
  }

  function renderProduct(){
    const host=$('[data-product-detail]'); if(!host) return; const p=productById(qs.get('id')) || DATA.products[0];
    document.title=`${p.name} · ${p.brand} · Violet Parfumerie`;
    const notes = p.notes || {};
    host.innerHTML=`<div class="detail-media perfume-detail-media"><img src="${p.image}" alt="${p.name} by ${p.brand}"><div class="image-caption">Curated by Violet · ${p.family || 'Fine fragrance'}</div></div><div class="detail-info"><div class="product-brand"><span class="badge badge-official">Violet Curated</span><span>${p.brand}</span></div><h1>${p.name}</h1><div class="detail-rating">${p.concentration || 'Fine fragrance'} · ${p.size || ''} · ★ ${p.rating}</div><div class="detail-price">${money(p.price)}</div>${p.oldPrice?`<div class="detail-old">Private edit · ${money(p.oldPrice)}</div>`:''}<p class="detail-intro">${p.description}</p><div class="note-pyramid"><div><span>Top</span><strong>${notes.top || '—'}</strong></div><div><span>Heart</span><strong>${notes.heart || '—'}</strong></div><div><span>Base</span><strong>${notes.base || '—'}</strong></div></div><div class="offer-box"><strong>Violet ritual</strong><div>Complimentary sample pairing + gift-ready wrapping on selected fragrances.</div></div><div class="seller-box"><div class="seller-meta"><strong>${p.seller}</strong><span>${p.official?'Curated house · ':''}authenticity standard verified</span></div><a class="text-link" href="search.html?official=1">View maison</a></div><div class="detail-actions"><button class="btn btn-secondary" data-add-cart>Add to fragrance bag</button><button class="btn btn-primary" data-buy-now>Buy now</button></div><div class="benefits"><div><b>Authenticity</b><br>Source-first curation</div><div><b>Discovery</b><br>Sample before commitment</div><div><b>Client care</b><br>Gift & scent support</div></div><ul class="spec-list">${(p.specs || []).map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
    $('[data-add-cart]',host).addEventListener('click',()=>addToCart(p.id));
    $('[data-buy-now]',host).addEventListener('click',()=>{addToCart(p.id);location.href='checkout.html';});
  }

  function renderCart(){
    const host=$('[data-cart]'); if(!host) return; const items=cartDetailed();
    if(!items.length){host.innerHTML='<div class="empty"><h3>Your fragrance bag is empty.</h3><p>Explore a scent family or begin with a discovery trio.</p><a class="btn btn-primary" href="search.html">Explore fragrances</a></div>'; updateSummary(); return;}
    const groups=Object.groupBy?Object.groupBy(items,i=>i.product.seller):items.reduce((a,i)=>((a[i.product.seller]??=[]).push(i),a),{});
    host.innerHTML=Object.entries(groups).map(([seller,rows])=>`<section class="cart-shop"><div class="shop-head">${seller}</div>${rows.map(i=>`<div class="cart-item"><img src="${i.product.image}" alt="${i.product.name}"><div><div class="cart-name">${i.product.name}</div><div class="cart-sub">${i.product.brand} · ${i.product.concentration || ''} · ${i.product.size || ''}</div><div class="qty-row"><button class="qty-btn" data-qty="-1" data-id="${i.product.id}" aria-label="Decrease quantity">−</button><b>${i.qty}</b><button class="qty-btn" data-qty="1" data-id="${i.product.id}" aria-label="Increase quantity">+</button><button class="btn" style="padding:5px 8px" data-remove="${i.product.id}">Remove</button></div></div><div><b>${money(i.product.price*i.qty)}</b></div></div>`).join('')}</section>`).join('');
    $$('[data-qty]',host).forEach(b=>b.addEventListener('click',()=>updateQty(b.dataset.id,Number(b.dataset.qty))));
    $$('[data-remove]',host).forEach(b=>b.addEventListener('click',()=>removeItem(b.dataset.remove))); updateSummary();
  }
  function updateSummary(){
    const sub=cartSubtotal(), shipping=sub?30000:0, saving=sub>=5000000?50000:0, total=Math.max(0,sub+shipping-saving);
    $$('[data-subtotal]').forEach(e=>e.textContent=money(sub)); $$('[data-shipping]').forEach(e=>e.textContent=shipping?money(shipping):money(0)); $$('[data-saving]').forEach(e=>e.textContent=`−${money(saving)}`); $$('[data-total]').forEach(e=>e.textContent=money(total));
  }

  function renderCheckout(){
    const host=$('[data-checkout-items]'); if(!host) return; const items=cartDetailed();
    host.innerHTML=items.length?items.map(i=>`<div class="summary-row"><span>${i.product.name} × ${i.qty}</span><b>${money(i.product.price*i.qty)}</b></div>`).join(''):'<p>Your fragrance bag is empty.</p>'; updateSummary();
    const form=$('[data-checkout-form]'); form?.addEventListener('submit',e=>{e.preventDefault(); if(!items.length){toast('Your fragrance bag is empty.');return;} const order='VL'+Date.now().toString().slice(-8); localStorage.setItem(ORDER_KEY,JSON.stringify({order,total:cartSubtotal(),date:new Date().toISOString()})); setCart([]); location.href=`order-success.html?order=${order}`;});
  }

  function renderSuccess(){ const el=$('[data-order-code]'); if(el) el.textContent=qs.get('order')||'VL20260908'; }
  updateCartCount(); bindSearch(); renderHome(); renderSearch(); renderProduct(); renderCart(); renderCheckout(); renderSuccess();
})();