(() => {
  const DATA = window.VIOLET_DATA || { products: [], categories: [] };
  const CART_KEY = 'violet-marketplace-cart-v1';
  const ORDER_KEY = 'violet-marketplace-last-order';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  const qs = new URLSearchParams(location.search);
  const productById = id => DATA.products.find(p => p.id === id);
  const discount = p => p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  function getCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }
  function setCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
  function addToCart(id, qty = 1){
    const cart = getCart(); const existing = cart.find(i => i.id === id);
    if(existing) existing.qty += qty; else cart.push({ id, qty });
    setCart(cart); toast('Đã thêm sản phẩm vào giỏ hàng');
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
    let el = $('.toast'); if(!el){ el = document.createElement('div'); el.className='toast'; document.body.append(el); }
    el.textContent=text; requestAnimationFrame(()=>el.classList.add('show')); clearTimeout(window.__toast);
    window.__toast=setTimeout(()=>el.classList.remove('show'),1800);
  }

  function header(){
    return `<div class="topbar"><div class="container topbar-inner"><span>Miễn phí vận chuyển cho đơn đủ điều kiện</span><div class="top-links"><a href="seller.html">Kênh người bán</a><a href="#">Trợ giúp</a><a href="#">Theo dõi đơn</a></div></div></div>
    <header class="site-header"><div class="container header-main"><a class="brand" href="index.html">Violet<span>.</span></a><div class="search-shell"><form class="search-form" data-search-form><input name="q" autocomplete="off" placeholder="Tìm sản phẩm, thương hiệu, cửa hàng..." aria-label="Tìm kiếm"><button>Tìm kiếm</button></form><div class="search-suggestions" data-suggestions></div></div><div class="header-actions"><a class="icon-link" href="admin.html" title="Admin">A</a><a class="icon-link cart-link" href="cart.html" title="Giỏ hàng">Giỏ<span class="cart-count">0</span></a></div></div><div class="nav-row"><nav class="container nav-inner"><a href="search.html">Danh mục</a><a href="search.html?deal=1">Flash Deals</a><a href="search.html?official=1">Violet Mall</a><a href="search.html?category=electronics">Công nghệ</a><a href="search.html?category=fashion">Thời trang</a><a href="search.html?category=beauty">Làm đẹp</a><a href="search.html?category=home">Nhà cửa</a></nav></div></header>`;
  }
  function footer(){
    return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="index.html">Violet<span>.</span></a><p>Một marketplace hiện đại, tin cậy và dễ mua sắm hơn — sức mạnh thương mại điện tử nhưng ít nhiễu hơn.</p></div><div><h4>Mua sắm</h4><div class="footer-links"><a href="search.html">Tất cả sản phẩm</a><a href="search.html?official=1">Violet Mall</a><a href="search.html?deal=1">Flash Deals</a></div></div><div><h4>Đối tác</h4><div class="footer-links"><a href="seller.html">Seller Center</a><a href="#">Đăng ký bán hàng</a><a href="#">Chính sách</a></div></div><div><h4>Hỗ trợ</h4><div class="footer-links"><a href="#">Trung tâm trợ giúp</a><a href="#">Đổi trả & hoàn tiền</a><a href="#">Bảo vệ người mua</a></div></div></div><div class="footer-bottom"><span>© 2026 Violet Marketplace</span><span>Vietnam · VND</span></div></div></footer><nav class="mobile-nav"><a href="index.html">Home</a><a href="search.html">Danh mục</a><a href="cart.html">Giỏ</a><a href="seller.html">Tài khoản</a></nav>`;
  }
  $$('[data-site-header]').forEach(el => el.innerHTML = header());
  $$('[data-site-footer]').forEach(el => el.innerHTML = footer());

  function bindSearch(){
    $$('[data-search-form]').forEach(form => {
      const input = $('input', form); const box = form.parentElement.querySelector('[data-suggestions]');
      form.addEventListener('submit', e => { e.preventDefault(); const q=input.value.trim(); location.href=`search.html${q?`?q=${encodeURIComponent(q)}`:''}`; });
      input.addEventListener('input', () => {
        const q=input.value.trim().toLowerCase(); if(!q){box.classList.remove('open'); return;}
        const matches=DATA.products.filter(p => `${p.name} ${p.brand} ${p.seller}`.toLowerCase().includes(q)).slice(0,5);
        box.innerHTML=matches.map(p=>`<a class="suggestion" href="product.html?id=${p.id}"><span>${p.name}</span><small>${money(p.price)}</small></a>`).join('') || `<a class="suggestion" href="search.html?q=${encodeURIComponent(q)}">Xem kết quả cho “${input.value}”</a>`;
        box.classList.add('open');
      });
      input.addEventListener('blur',()=>setTimeout(()=>box.classList.remove('open'),150));
    });
  }

  function productCard(p){
    return `<article class="product-card"><a href="product.html?id=${p.id}"><div class="product-media"><img src="${p.image}" alt="${p.name}" loading="lazy">${discount(p)?`<span class="badge badge-sale">-${discount(p)}%</span>`:''}</div><div class="product-body"><div class="product-brand">${p.official?'<span class="badge badge-official">✓ Official</span>':''}${p.fast?'<span class="badge badge-fast">Nhanh</span>':''}</div><div class="product-title">${p.name}</div><div class="product-meta"><span>★ ${p.rating}</span><span>Đã bán ${p.sold.toLocaleString('vi-VN')}</span></div><div class="price-row"><div><div class="price">${money(p.price)}</div><div class="old-price">${money(p.oldPrice)}</div></div><span>›</span></div></div></a></article>`;
  }

  function renderHome(){
    const cat=$('[data-categories]'); if(cat) cat.innerHTML=DATA.categories.map(c=>`<a class="category-card" href="search.html?category=${c.id}"><div class="quick-icon">${c.icon}</div><strong>${c.name}</strong></a>`).join('');
    const flash=$('[data-flash]'); if(flash) flash.innerHTML=DATA.products.slice(0,4).map(productCard).join('');
    const mall=$('[data-mall]'); if(mall) mall.innerHTML=DATA.products.filter(p=>p.official).slice(0,4).map(productCard).join('');
    const rec=$('[data-recommend]'); if(rec) rec.innerHTML=DATA.products.map(productCard).join('');
  }

  function renderSearch(){
    const grid=$('[data-results]'); if(!grid) return;
    const q=(qs.get('q')||'').toLowerCase(); const category=qs.get('category'); const official=qs.get('official'); const deal=qs.get('deal');
    let items=DATA.products.filter(p => !q || `${p.name} ${p.brand} ${p.seller}`.toLowerCase().includes(q));
    if(category) items=items.filter(p=>p.category===category); if(official) items=items.filter(p=>p.official); if(deal) items=items.filter(p=>discount(p)>=15);
    const title=$('[data-result-title]'); if(title) title.textContent=q?`Kết quả cho “${qs.get('q')}”`:category?(DATA.categories.find(c=>c.id===category)?.name||'Sản phẩm'):official?'Violet Mall':deal?'Flash Deals':'Tất cả sản phẩm';
    const count=$('[data-result-count]'); if(count) count.textContent=`${items.length} sản phẩm`;
    const chips=$('[data-active-chips]'); if(chips){ const arr=[]; if(category) arr.push(DATA.categories.find(c=>c.id===category)?.name); if(official) arr.push('Official'); if(deal) arr.push('Đang giảm giá'); if(q) arr.push(`“${qs.get('q')}”`); chips.innerHTML=arr.filter(Boolean).map(x=>`<span class="chip">${x}</span>`).join(''); }
    const sort=$('[data-sort]');
    function draw(){ let list=[...items]; if(sort?.value==='price-asc') list.sort((a,b)=>a.price-b.price); if(sort?.value==='price-desc') list.sort((a,b)=>b.price-a.price); if(sort?.value==='rating') list.sort((a,b)=>b.rating-a.rating); grid.innerHTML=list.length?list.map(productCard).join(''):'<div class="empty" style="grid-column:1/-1"><h3>Không tìm thấy sản phẩm</h3><p>Thử từ khoá hoặc bộ lọc khác.</p></div>'; }
    sort?.addEventListener('change',draw); draw();
  }

  function renderProduct(){
    const host=$('[data-product-detail]'); if(!host) return; const p=productById(qs.get('id')) || DATA.products[0];
    document.title=`${p.name} · Violet Marketplace`;
    host.innerHTML=`<div class="detail-media"><img src="${p.image}" alt="${p.name}"></div><div class="detail-info"><div class="product-brand">${p.official?'<span class="badge badge-official">✓ Violet Mall</span>':''}<span>${p.brand}</span></div><h1>${p.name}</h1><div class="detail-rating">★ ${p.rating} · ${p.sold.toLocaleString('vi-VN')} đã bán · Còn ${p.stock}</div><div class="detail-price">${money(p.price)}</div><div class="detail-old">${money(p.oldPrice)} · Tiết kiệm ${money(p.oldPrice-p.price)}</div><div class="offer-box"><strong>Ưu đãi Violet</strong><div>Giảm thêm 100.000 ₫ với mã <b>VIOLET100</b> · Miễn phí vận chuyển đủ điều kiện</div></div><div class="seller-box"><div class="seller-meta"><strong>${p.seller}</strong><span>${p.official?'Đã xác minh · ':''}Phản hồi trong 15 phút · 98% tích cực</span></div><a class="text-link" href="search.html?official=${p.official?1:''}">Xem shop</a></div><p>${p.description}</p><div class="detail-actions"><button class="btn btn-secondary" data-add-cart>Thêm vào giỏ</button><button class="btn btn-primary" data-buy-now>Mua ngay</button></div><div class="benefits"><div><b>✓ Chính hãng</b><br>Bảo vệ người mua</div><div><b>↻ Đổi trả</b><br>Trong 15 ngày</div><div><b>▣ Thanh toán</b><br>An toàn & bảo mật</div></div><ul class="spec-list">${p.specs.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
    $('[data-add-cart]',host).addEventListener('click',()=>addToCart(p.id));
    $('[data-buy-now]',host).addEventListener('click',()=>{addToCart(p.id);location.href='checkout.html';});
  }

  function renderCart(){
    const host=$('[data-cart]'); if(!host) return; const items=cartDetailed();
    if(!items.length){host.innerHTML='<div class="empty"><h3>Giỏ hàng đang trống</h3><p>Khám phá sản phẩm và thêm những món bạn thích.</p><a class="btn btn-primary" href="search.html">Tiếp tục mua sắm</a></div>'; updateSummary(); return;}
    const groups=Object.groupBy?Object.groupBy(items,i=>i.product.seller):items.reduce((a,i)=>((a[i.product.seller]??=[]).push(i),a),{});
    host.innerHTML=Object.entries(groups).map(([seller,rows])=>`<section class="cart-shop"><div class="shop-head">${seller}</div>${rows.map(i=>`<div class="cart-item"><img src="${i.product.image}" alt="${i.product.name}"><div><div class="cart-name">${i.product.name}</div><div class="cart-sub">${i.product.brand} · ${i.product.fast?'Giao nhanh':'Giao tiêu chuẩn'}</div><div class="qty-row"><button class="qty-btn" data-qty="-1" data-id="${i.product.id}">−</button><b>${i.qty}</b><button class="qty-btn" data-qty="1" data-id="${i.product.id}">+</button><button class="btn" style="padding:5px 8px" data-remove="${i.product.id}">Xoá</button></div></div><div><b>${money(i.product.price*i.qty)}</b></div></div>`).join('')}</section>`).join('');
    $$('[data-qty]',host).forEach(b=>b.addEventListener('click',()=>updateQty(b.dataset.id,Number(b.dataset.qty))));
    $$('[data-remove]',host).forEach(b=>b.addEventListener('click',()=>removeItem(b.dataset.remove))); updateSummary();
  }
  function updateSummary(){
    const sub=cartSubtotal(), shipping=sub?30000:0, saving=sub>=1000000?50000:0, total=Math.max(0,sub+shipping-saving);
    $$('[data-subtotal]').forEach(e=>e.textContent=money(sub)); $$('[data-shipping]').forEach(e=>e.textContent=shipping?money(shipping):money(0)); $$('[data-saving]').forEach(e=>e.textContent=`−${money(saving)}`); $$('[data-total]').forEach(e=>e.textContent=money(total));
  }

  function renderCheckout(){
    const host=$('[data-checkout-items]'); if(!host) return; const items=cartDetailed();
    host.innerHTML=items.length?items.map(i=>`<div class="summary-row"><span>${i.product.name} × ${i.qty}</span><b>${money(i.product.price*i.qty)}</b></div>`).join(''):'<p>Chưa có sản phẩm trong giỏ.</p>'; updateSummary();
    const form=$('[data-checkout-form]'); form?.addEventListener('submit',e=>{e.preventDefault(); if(!items.length){toast('Giỏ hàng đang trống');return;} const order='VL'+Date.now().toString().slice(-8); localStorage.setItem(ORDER_KEY,JSON.stringify({order,total:cartSubtotal(),date:new Date().toISOString()})); setCart([]); location.href=`order-success.html?order=${order}`;});
  }

  function renderSuccess(){ const el=$('[data-order-code]'); if(el) el.textContent=qs.get('order')||'VL20260908'; }
  updateCartCount(); bindSearch(); renderHome(); renderSearch(); renderProduct(); renderCart(); renderCheckout(); renderSuccess();
})();
