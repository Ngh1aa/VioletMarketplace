(() => {
  const DATA = window.VIOLET_DATA || { products: [], categories: [] };
  const qs = new URLSearchParams(location.search);
  const CART_KEY = 'violet-marketplace-cart-v1';
  const TRIO_KEY = 'violet-discovery-trio-v1';
  const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));
  const byId = id => DATA.products.find(product => product.id === id);

  const HOUSES = [
    { id:'maison-aster', name:'Maison Aster', origin:'Paris', territory:'violet phấn · fig xanh · gỗ trầm', ethos:'Cấu trúc mềm, hoa cỏ mát và những lớp gỗ xanh trầm tĩnh.', products:['violette-03','nuit-de-figue'] },
    { id:'atelier-nocturne', name:'Atelier Nocturne', origin:'Grasse', territory:'hổ phách · saffron · bóng tobacco', ethos:'Chất liệu ấm được tạo hình cho buổi tối, tinh tế hơn là phô trương.', products:['velours-ambre','velvet-room-candle'] },
    { id:'elan-studio', name:'Élan Studio', origin:'Seoul', territory:'iris · trà · gỗ trong', ethos:'Những phối hương sạch, sáng và có độ trong với hoàn thiện hiện đại tiết chế.', products:['iris-haze'] },
    { id:'orphee', name:'Orphée', origin:'Nhà hương độc lập', territory:'sandalwood · lá fig · xạ hương', ethos:'Gỗ kem và kết cấu xanh nhưng không nặng khói.', products:['santal-veil'] },
    { id:'lumiere-17', name:'Lumière 17', origin:'Côte d’Azur', territory:'neroli · petitgrain · ánh khoáng', ethos:'Độ sáng đi cùng chút đắng xanh để tổng thể vẫn chính xác và gọn.', products:['neroli-rain'] },
    { id:'nacre', name:'Nacre', origin:'Tokyo', territory:'ambrette · cơm · gỗ sạch', ethos:'Những mùi hương sát da xoay quanh sự riêng tư và cảm giác chất liệu.', products:['peau-de-lune'] }
  ];

  const META = {
    'violette-03': { mood:['intimate','soft'], presence:'intimate', character:'Violet phấn, iris mát và sandalwood mềm được giữ gần da.', wear:'ngày yên tĩnh · tối gần gũi', sample:true },
    'velours-ambre': { mood:['warm','mysterious'], presence:'statement', character:'Saffron khô và hổ phách nhựa thơm được làm mềm bởi tonka cùng gỗ cashmere.', wear:'buổi tối · dịp ăn mặc chỉn chu', sample:true },
    'iris-haze': { mood:['clean','soft'], presence:'moderate', character:'Iris thoáng, trà trắng và cedar với hậu vị mát, trong.', wear:'ban ngày · đi làm · gallery', sample:true },
    'santal-veil': { mood:['warm','contemplative'], presence:'moderate', character:'Sandalwood kem, lá fig xanh và lớp xạ hương trầm.', wear:'chiều chậm · du lịch · buổi tối', sample:true },
    'neroli-rain': { mood:['clean','luminous'], presence:'moderate', character:'Neroli và petitgrain trên nền xạ hương khoáng — sáng, xanh và dịu.', wear:'ngày ấm · du lịch · buổi sáng', sample:true },
    'peau-de-lune': { mood:['intimate','clean'], presence:'intimate', character:'Ambrette, độ mềm của cơm hấp và gỗ sạch tạo hiệu ứng như lớp da thứ hai.', wear:'mùi hương sát da · phối lớp · không gian gần', sample:true },
    'nuit-de-figue': { mood:['contemplative','mysterious'], presence:'moderate', character:'Nhựa fig xanh, trà đen và cedar khô với cấu trúc tối, yên.', wear:'cuối chiều · đọc sách · bữa tối', sample:true },
    'violet-discovery-set': { mood:['explore'], presence:'varied', character:'Sáu câu chuyện mùi hương nhỏ để so sánh chậm rãi tại nhà.', wear:'khám phá tại nhà · quà tặng', sample:false },
    'velvet-room-candle': { mood:['warm','mysterious'], presence:'room', character:'Bụi iris, lá tobacco và hổ phách cho căn phòng có sắc tối mềm.', wear:'không gian nhà · nghi thức buổi tối', sample:false },
    'signature-gift-trio': { mood:['explore','gift'], presence:'varied', character:'Ba hướng mùi dạng du lịch: hoa cỏ sáng, hổ phách ấm và gỗ trầm.', wear:'quà tặng · du lịch', sample:false }
  };

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

  const moodLabels = { clean:'Sạch / trong', intimate:'Gần da / riêng tư', soft:'Mềm / phấn', warm:'Ấm / bao bọc', luminous:'Sáng / rạng', contemplative:'Trầm tĩnh', mysterious:'Bí ẩn / tối', explore:'Khám phá', gift:'Quà tặng' };
  const presenceLabels = { intimate:'Sát da', moderate:'Hiện diện nhẹ', statement:'Nổi bật', varied:'Đa dạng', room:'Hương không gian' };
  const familyLabels = Object.fromEntries((DATA.categories || []).map(category => [category.id, category.name]));

  function metaFor(product){ return META[product.id] || { mood:['soft'], presence:'moderate', character:product.description || product.family || 'Nước hoa', wear:'hằng ngày', sample:false }; }
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
  function addBottle(id){ const cart=getCart(); const existing=cart.find(row=>row.id===id); if(existing) existing.qty+=1; else cart.push({id,qty:1}); setCart(cart); status(`Đã thêm ${byId(id)?.name || 'mùi hương'} vào giỏ.`); }
  function getTrio(){ return safeJSON(localStorage.getItem(TRIO_KEY) || '[]', []).filter(id => byId(id) && metaFor(byId(id)).sample).slice(0,3); }
  function setTrio(ids){ localStorage.setItem(TRIO_KEY, JSON.stringify([...new Set(ids)].slice(0,3))); }
  function addToTrio(id){ const product=byId(id); if(!product || !metaFor(product).sample) return {ok:false,message:'Mùi hương này không nằm trong nhóm mẫu thử đại diện.'}; const trio=getTrio(); if(trio.includes(id)) return {ok:false,message:`${product.name} đã có trong bộ ba của bạn.`}; if(trio.length>=3) return {ok:false,message:'Bộ ba đã đủ. Hãy bỏ một hướng trước khi thêm hướng khác.'}; trio.push(id); setTrio(trio); return {ok:true,message:`Đã thêm ${product.name} vào bộ ba thử mùi.`}; }
  function removeFromTrio(id){ setTrio(getTrio().filter(item => item !== id)); }
  function status(message){ let el=document.querySelector('.v4-status'); if(!el){ el=document.createElement('div'); el.className='v4-status'; el.setAttribute('role','status'); document.body.append(el); } el.textContent=message; el.classList.add('show'); clearTimeout(window.__v4Status); window.__v4Status=setTimeout(()=>el.classList.remove('show'),2200); }

  function v4Card(product, extra=''){
    const meta=metaFor(product); const house=houseFor(product); const media=mediaFor(product);
    return `<article class="v4-object-card"><a class="v4-object-link" href="product.html?id=${encodeURIComponent(product.id)}">
      <div class="v4-object-media"><img src="${media[0]}" alt="${product.name} của ${product.brand}" loading="lazy"><img class="v5-card-image--alt" src="${media[1]}" alt="Nghiên cứu chất liệu gợi liên tưởng đến ${product.name}" loading="lazy">${meta.sample?'<span class="v5-card-badge">Thử trước</span>':''}</div>
      <div class="v4-object-index"><span>${house ? house.origin : 'Tuyển chọn Violet'}</span><span>${product.family || ''}</span></div>
      <div class="v4-object-heading"><span>${product.brand}</span><h3>${product.name}</h3></div>
      <div class="v4-object-meta"><span>${product.concentration || ''}${product.size ? ` · ${product.size}` : ''}</span><strong>${money(product.price)}</strong></div>
      ${extra ? `<p class="v4-object-reason">${extra}</p>` : ''}
    </a></article>`;
  }

  function upgradeChrome(){
    document.body.classList.add('violet-v4');
    const nav=document.querySelector('.nav-inner');
    if(nav) nav.innerHTML='<a href="search.html">Mùi hương</a><a href="houses.html">Nhà hương</a><a href="discovery.html">Khám phá</a><a href="finder.html">Chân dung mùi hương</a>';
    const top=document.querySelector('.topbar-inner > span'); if(top) top.textContent='Tuyển chọn Violet · mùi hương, nhà hương và hành trình khám phá chậm';
    const topLinks=document.querySelector('.top-links'); if(topLinks) topLinks.innerHTML='<a href="discovery.html">Nghi thức khám phá</a><a href="finder.html">Chân dung mùi hương</a><a href="seller.html">Dành cho nhà hương</a>';
    const input=document.querySelector('[data-search-form] input'); if(input) input.placeholder='Tìm mùi hương, note, maison...';
    const footer=document.querySelector('.footer-grid');
    if(footer) footer.innerHTML='<div><a class="brand footer-brand" href="index.html">Violet<span>.</span><small>Parfumerie</small></a><p>Marketplace nước hoa đa nhà hương dạng prototype, tập trung vào các mùi hương, maison và hành trình thử chậm rãi.</p></div><div><h4>Khám phá</h4><div class="footer-links"><a href="search.html">Mùi hương</a><a href="discovery.html">Khám phá</a><a href="finder.html">Chân dung mùi hương</a></div></div><div><h4>Nhà hương</h4><div class="footer-links"><a href="houses.html">Nhà hương tuyển chọn</a><a href="seller.html">Trung tâm nhà hương</a><a href="search.html?sample=1">Tuyển chọn thử trước</a></div></div><div><h4>Prototype</h4><div class="footer-links"><span>Maison hư cấu</span><span>Checkout lưu cục bộ trên trình duyệt</span><span>Không giả lập AI</span></div></div>';
  }

  function renderHome(){
    const feature=document.querySelector('[data-v4-feature]'); if(!feature) return;
    const product=byId('violette-03') || DATA.products[0]; const meta=metaFor(product); const house=houseFor(product); const media=mediaFor(product);
    feature.innerHTML=`<div class="v4-feature-copy"><div class="v4-section-label"><span>V.01 / MÙI HƯƠNG NỔI BẬT</span><span>${house?.origin || 'Tuyển chọn Violet'}</span></div><div><span class="v4-kicker">${product.brand}</span><h1>${product.name}</h1><p class="v4-feature-sensory">${meta.character}</p></div><div class="v4-feature-commerce"><span>${product.concentration} · ${product.size}</span><strong>${money(product.price)}</strong><div><a class="btn btn-primary" href="product.html?id=${product.id}">Xem mùi hương</a><a class="v4-text-link" href="discovery.html?focus=${product.id}">Thử trước →</a></div></div></div>
      <a class="v4-feature-media" href="product.html?id=${product.id}" aria-label="Khám phá ${product.name}"><div class="v5-hero-mosaic"><div class="v5-hero-shot"><img src="${media[0]}" alt="${product.name} của ${product.brand}"><span>Sản phẩm / ${product.family}</span></div><div class="v5-hero-shot"><img src="${media[1]}" alt="Nghiên cứu chất liệu nước hoa"><span>Nghiên cứu chất liệu</span></div><div class="v5-hero-shot"><img src="${media[2]}" alt="Không khí gợi mùi hương"><span>Không khí</span></div></div></a>`;

    const houseIndex=document.querySelector('[data-v4-house-index]');
    if(houseIndex) houseIndex.innerHTML=`<div class="v4-house-index">${HOUSES.slice(0,5).map((house,index)=>{ const p=house.products.map(byId).find(Boolean)||DATA.products[0]; return `<a href="house.html?id=${house.id}"><span>${String(index+1).padStart(2,'0')}</span><img class="v5-house-thumb" src="${p?.image||''}" alt="Tuyển chọn ${house.name}" loading="lazy"><strong>${house.name}</strong><em>${house.origin}</em><small>${house.territory}</small><i>↗</i></a>`; }).join('')}</div>`;

    const shelf=document.querySelector('[data-v4-shelf]');
    if(shelf){
      const objects=['peau-de-lune','velours-ambre','neroli-rain','santal-veil'].map(byId).filter(Boolean);
      const story=mediaFor(byId('nuit-de-figue')||objects[0]);
      shelf.innerHTML=`${objects.slice(0,2).map(p=>v4Card(p)).join('')}<aside class="v5-shelf-story"><img src="${story[2]}" alt="Không khí mùi hương do Violet tuyển chọn" loading="lazy"><div><span>TUYỂN CHỌN VIOLET / DA & BÓNG TỐI</span><strong>Kín đáo vẫn có thể để lại dấu vết.</strong><a href="search.html?mood=intimate">Mở tuyển chọn gần da →</a></div></aside>${objects.slice(2).map(p=>v4Card(p)).join('')}`;
    }
  }

  function paramsUrl(changes={}){ const next=new URLSearchParams(location.search); Object.entries(changes).forEach(([key,value])=>{ if(value===null || value==='' || next.get(key)===String(value)) next.delete(key); else next.set(key,String(value)); }); const text=next.toString(); return `search.html${text?`?${text}`:''}`; }
  function removeParamUrl(key){ const next=new URLSearchParams(location.search); next.delete(key); const text=next.toString(); return `search.html${text?`?${text}`:''}`; }

  function renderLibrary(){
    const grid=document.querySelector('[data-results]'); const panel=document.querySelector('[data-v4-filter]'); if(!grid || !panel) return;
    const current=new URLSearchParams(location.search); const q=(current.get('q')||'').trim().toLowerCase(); const category=current.get('category')||''; const mood=current.get('mood')||''; const presence=current.get('presence')||''; const concentration=current.get('concentration')||''; const house=current.get('house')||''; const sample=current.get('sample')==='1';
    panel.innerHTML=`<div class="v4-filter-title"><span>Lọc</span><a href="search.html">Xóa</a></div>
      <div class="v4-filter-group"><strong>Nhóm mùi</strong>${['floral','woody','amber','fresh','musk'].map(value=>`<a aria-current="${category===value}" href="${paramsUrl({category:value})}">${familyLabels[value]||value}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>Cảm giác</strong>${['clean','intimate','soft','warm','luminous','contemplative','mysterious'].map(value=>`<a aria-current="${mood===value}" href="${paramsUrl({mood:value})}">${moodLabels[value]}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>Độ hiện diện</strong>${['intimate','moderate','statement'].map(value=>`<a aria-current="${presence===value}" href="${paramsUrl({presence:value})}">${presenceLabels[value]}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>Nhà hương</strong>${HOUSES.map(value=>`<a aria-current="${house===value.id}" href="${paramsUrl({house:value.id})}">${value.name}<span>↗</span></a>`).join('')}</div>
      <div class="v4-filter-group"><strong>Định dạng</strong><a aria-current="${concentration==='edp'}" href="${paramsUrl({concentration:'edp'})}">Eau de Parfum<span>↗</span></a><a aria-current="${concentration==='extrait'}" href="${paramsUrl({concentration:'extrait'})}">Extrait<span>↗</span></a><a aria-current="${sample}" href="${paramsUrl({sample:'1'})}">Thử trước<span>↗</span></a></div>`;

    let items=DATA.products.filter(product=>{
      const meta=metaFor(product); const productHouse=houseFor(product); const searchable=[product.name,product.brand,product.family,product.concentration,product.description,meta.character,...meta.mood].filter(Boolean).join(' ').toLowerCase();
      return (!q || searchable.includes(q)) && (!category || product.category===category) && (!mood || meta.mood.includes(mood)) && (!presence || meta.presence===presence) && (!concentration || concentrationKey(product)===concentration) && (!house || productHouse?.id===house) && (!sample || meta.sample);
    });

    const title=document.querySelector('[data-result-title]'); if(title){ if(q) title.textContent=`Kết quả cho “${current.get('q')}”`; else if(house) title.textContent=houseById(house)?.name || 'Tuyển chọn nhà hương'; else if(category) title.textContent=familyLabels[category]||'Mùi hương'; else if(mood) title.textContent=moodLabels[mood]||'Tuyển chọn theo cảm giác'; else if(sample) title.textContent='Tuyển chọn thử trước'; else title.textContent='Thư viện mùi hương'; }
    const chips=document.querySelector('[data-active-chips]'); if(chips){ const active=[]; if(category) active.push(['category',familyLabels[category]||category]); if(mood) active.push(['mood',moodLabels[mood]||mood]); if(presence) active.push(['presence',presenceLabels[presence]||presence]); if(house) active.push(['house',houseById(house)?.name||house]); if(concentration) active.push(['concentration',concentration==='edp'?'Eau de Parfum':'Extrait']); if(sample) active.push(['sample','Mẫu thử · thử trước']); if(q) active.push(['q',`“${current.get('q')}”`]); chips.innerHTML=active.map(([key,label])=>`<span class="chip">${label}<a href="${removeParamUrl(key)}" aria-label="Bỏ bộ lọc ${label}">×</a></span>`).join(''); }

    const sort=document.querySelector('[data-sort]');
    const draw=()=>{
      let list=[...items]; if(sort?.value==='price-asc') list.sort((a,b)=>a.price-b.price); if(sort?.value==='price-desc') list.sort((a,b)=>b.price-a.price); if(sort?.value==='rating') list.sort((a,b)=>b.rating-a.rating);
      document.querySelectorAll('[data-result-count]').forEach(el=>el.textContent=`${list.length} mùi hương`);
      if(!list.length){ grid.innerHTML='<div class="v4-empty"><span>KHÔNG CÓ MÙI HƯƠNG PHÙ HỢP</span><h2>Hãy mở rộng chân dung mùi hương.</h2><p>Bỏ bớt một bộ lọc hoặc bắt đầu từ cảm giác bạn muốn.</p><div><a class="btn btn-secondary" href="search.html">Xóa bộ lọc</a> <a class="btn btn-primary" href="finder.html">Chân dung mùi hương</a></div></div>'; return; }
      const chunks=[]; list.forEach((product,index)=>{ chunks.push(v4Card(product)); if(index===5 && list.length>6){ const image=mediaFor(product)[2]; chunks.push(`<aside class="v4-plp-interrupt"><img src="${image}" alt="Không khí mùi hương dạng editorial"><div><span>CHUYỂN NHỊP NHÀ HƯƠNG / 03</span><strong>Khám phá một maison, không chỉ một nốt hương.</strong><p>Chọn nhà hương khi bạn muốn một lãnh địa mùi hương nhất quán thay vì kéo dài danh sách bộ lọc.</p><a href="houses.html">Mở các nhà hương tuyển chọn →</a></div></aside>`); } }); grid.innerHTML=chunks.join('');
    };
    sort?.addEventListener('change',draw); draw();
  }

  function relatedProducts(product){
    const meta=metaFor(product);
    return DATA.products.filter(item=>item.id!==product.id && metaFor(item).sample).map(item=>{ const im=metaFor(item); let score=0; const reasons=[]; if(item.category===product.category){score+=4;reasons.push(`cùng hướng ${product.family||'nhóm mùi'}`);} const shared=im.mood.find(value=>meta.mood.includes(value)); if(shared){score+=3;reasons.push(`cùng cảm giác ${moodLabels[shared]?.toLowerCase()||shared}`);} if(im.presence===meta.presence){score+=2;reasons.push(`độ hiện diện tương tự: ${presenceLabels[meta.presence]?.toLowerCase()||'gần nhau'}`);} return {item,score,reason:reasons.slice(0,2).join(' · ')||'một hướng tương phản trong tuyển chọn Violet'}; }).sort((a,b)=>b.score-a.score).slice(0,3);
  }

  function renderProduct(){
    const host=document.querySelector('[data-product-detail]'); if(!host) return;
    const product=byId(qs.get('id'))||DATA.products[0]; if(!product) return;
    const meta=metaFor(product); const house=houseFor(product); const notes=product.notes||{}; const related=relatedProducts(product); const media=mediaFor(product);
    document.title=`${product.name} · ${product.brand} · Violet Parfumerie`; host.className='v4-pdp';
    host.innerHTML=`<div class="v4-pdp-media"><div class="v4-pdp-media-index"><span>V.11 / NGHIÊN CỨU SẢN PHẨM</span><span>${product.family||'Nước hoa'}</span></div>
        <div class="v5-gallery"><figure class="v5-gallery-tile v5-gallery-main"><img src="${media[0]}" alt="${product.name} của ${product.brand}"><figcaption class="v5-media-caption">Ảnh sản phẩm</figcaption></figure><figure class="v5-gallery-tile"><img src="${media[1]}" alt="Nghiên cứu chất liệu gợi mùi hương"><figcaption class="v5-media-caption">Nghiên cứu chất liệu</figcaption></figure><figure class="v5-gallery-tile"><img src="${media[2]}" alt="Không khí gợi mùi hương"><figcaption class="v5-media-caption">Không khí</figcaption></figure><figure class="v5-gallery-tile v5-gallery-wide"><img src="${media[3]}" alt="Nghiên cứu kết cấu dạng editorial" loading="lazy"><figcaption class="v5-media-caption">Kết cấu / nghiên cứu editorial</figcaption></figure></div>
        <div class="v4-pdp-media-foot"><span>${product.brand}</span><span>${product.concentration||''} · ${product.size||''}</span></div></div>
      <aside class="v4-buying-desk"><div class="v4-buying-index"><span>MÙI HƯƠNG VIOLET / ${String(DATA.products.findIndex(item=>item.id===product.id)+1).padStart(2,'0')}</span><span>${meta.sample?'THỬ TRƯỚC':'TUYỂN CHỌN VIOLET'}</span></div><a class="v4-pdp-house" href="${house?`house.html?id=${house.id}`:'houses.html'}">${product.brand}</a><h1>${product.name}</h1><p class="v4-pdp-character">${meta.character}</p><div class="v4-pdp-format">${product.concentration||''} · ${product.size||''} · ${product.family||''}</div><div class="v4-pdp-price"><strong>${money(product.price)}</strong><span>${product.stock>0?`${product.stock} sản phẩm trong tồn kho prototype`:'Tạm hết'}</span></div><div class="v4-size-row"><span>Dung tích</span><button type="button" aria-pressed="true">${product.size||'Một kích cỡ'}</button></div><div class="v4-pdp-actions"><button class="btn btn-primary" type="button" data-v4-add-bottle="${product.id}" ${product.stock<=0?'disabled':''}>Thêm chai đầy đủ</button>${meta.sample?`<button class="btn btn-secondary" type="button" data-v4-add-sample="${product.id}">Thêm vào bộ ba thử mùi</button>`:`<a class="btn btn-secondary" href="discovery.html">Khám phá bộ Discovery</a>`}</div><p class="v4-reality-note">Đây là commerce prototype lưu trên trình duyệt. Ảnh hỗ trợ dạng editorial chỉ truyền tải mood/chất liệu, không phải ảnh packshot bổ sung của chai hư cấu.</p><div class="v4-pdp-quick"><div><span>Độ hiện diện</span><strong>${presenceLabels[meta.presence]||meta.presence}</strong></div><div><span>Dịp dùng</span><strong>${meta.wear}</strong></div></div></aside>
      <section class="v4-pdp-story"><figure class="v5-story-media"><img src="${media[2]}" alt="Không khí mùi hương của ${product.name}" loading="lazy"><figcaption class="v5-media-caption">Không khí mùi hương / tham chiếu editorial</figcaption></figure><div class="v5-story-copy"><div class="v4-pdp-story-lead"><span class="v4-kicker">01 / MÙI HƯƠNG</span><h2>${product.description}</h2></div><div class="v4-note-table"><div><span>Nốt đầu</span><strong>${notes.top||'—'}</strong></div><div><span>Nốt giữa</span><strong>${notes.heart||'—'}</strong></div><div><span>Nốt cuối</span><strong>${notes.base||'—'}</strong></div></div><div class="v4-house-proof"><span class="v4-kicker">02 / NHÀ HƯƠNG</span><h3>${house?.name||product.brand}</h3><p>${house?.ethos||'Nằm trong tuyển chọn prototype của Violet.'}</p><p class="v4-house-territory">${house?.territory||product.family||''}</p><a href="${house?`house.html?id=${house.id}`:'houses.html'}">Mở maison →</a></div></div></section>
      <section class="v4-related"><div class="v4-section-label"><span>03 / HƯỚNG GẦN KỀ</span><span>Cùng nhóm mùi, cảm giác hoặc độ hiện diện</span></div><div class="v4-related-grid">${related.map(row=>v4Card(row.item,row.reason)).join('')}</div></section>`;
    host.querySelector('[data-v4-add-bottle]')?.addEventListener('click',()=>addBottle(product.id));
    host.querySelector('[data-v4-add-sample]')?.addEventListener('click',event=>{ const result=addToTrio(product.id); status(result.message); if(result.ok) event.currentTarget.textContent='Đã thêm vào bộ ba thử mùi'; });
  }

  function renderTrio(){
    const panel=document.querySelector('[data-v4-trio-panel]'); if(!panel) return; const trio=getTrio(); const products=trio.map(byId).filter(Boolean);
    panel.innerHTML=`<div class="v4-trio-head"><span>Bộ ba của bạn</span><strong>${products.length}/3</strong></div>${products.length?`<div class="v4-trio-items">${products.map((product,index)=>`<div class="v4-trio-item"><span>${String(index+1).padStart(2,'0')}</span><img class="v5-trio-thumb" src="${product.image}" alt="${product.name}"><div><strong>${product.name}</strong><small>${product.brand} · ${product.family}</small></div><button type="button" data-v4-remove-sample="${product.id}" aria-label="Bỏ ${product.name}">Bỏ</button></div>`).join('')}</div>`:`<div class="v4-trio-empty"><strong>Chưa chọn hướng mùi nào.</strong><p>Chọn tối đa ba mùi hương đại diện bên dưới.</p></div>`}<div class="v4-trio-state"><p>${products.length===3?'Bộ ba đã đủ — hãy thử từng hướng riêng trước khi quyết định chọn chai đầy đủ.':`Còn ${3-products.length} vị trí.`}</p></div>`;
    panel.querySelectorAll('[data-v4-remove-sample]').forEach(button=>button.addEventListener('click',()=>{removeFromTrio(button.dataset.v4RemoveSample);renderTrio();renderSampleList();}));
  }

  function renderSampleList(){
    const host=document.querySelector('[data-v4-sample-list]'); if(!host) return; const trio=getTrio(); const products=DATA.products.filter(product=>metaFor(product).sample);
    host.innerHTML=products.map((product,index)=>{ const selected=trio.includes(product.id); const full=trio.length>=3&&!selected; return `<article class="v4-sample-row"><span>${String(index+1).padStart(2,'0')}</span><img class="v5-sample-thumb" src="${product.image}" alt="${product.name}" loading="lazy"><div><strong>${product.name}</strong><small>${product.brand} · ${product.family}</small></div><p>${metaFor(product).character}</p><button type="button" data-v4-sample-choice="${product.id}" aria-pressed="${selected}" ${full?'disabled':''}>${selected?'Đã chọn':full?'Bộ ba đã đủ':'Thêm vào bộ ba'}</button></article>`; }).join('');
    host.querySelectorAll('[data-v4-sample-choice]').forEach(button=>button.addEventListener('click',()=>{ const id=button.dataset.v4SampleChoice; if(getTrio().includes(id)) removeFromTrio(id); else { const result=addToTrio(id); status(result.message); } renderTrio(); renderSampleList(); }));
  }

  function renderDiscovery(){
    if(!document.querySelector('.v4-discovery-page')) return; const focus=qs.get('focus'); if(focus && byId(focus) && metaFor(byId(focus)).sample && !getTrio().includes(focus)) addToTrio(focus); renderTrio(); renderSampleList();
    const wardrobe=document.querySelector('[data-v4-wardrobe]'); const product=byId('violet-discovery-set');
    if(wardrobe&&product) wardrobe.innerHTML=`<div><span class="v4-kicker">03 / BỘ SOẠN SẴN</span><h2>Bạn muốn một bộ thử mùi đã được chọn sẵn?</h2><p>${product.description}</p><div class="v4-wardrobe-meta"><span>${product.size}</span><strong>${money(product.price)}</strong></div><div class="v4-wardrobe-actions"><button class="btn btn-primary" type="button" data-v4-add-wardrobe>Thêm Violet Discovery Wardrobe</button><a class="v4-text-link" href="product.html?id=${product.id}">Xem sản phẩm →</a></div></div><div class="v4-wardrobe-media"><img src="${mediaFor(product)[0]}" alt="${product.name}"></div>`;
    wardrobe?.querySelector('[data-v4-add-wardrobe]')?.addEventListener('click',()=>addBottle(product.id));
  }

  upgradeChrome();
  renderHome();
  renderLibrary();
  renderProduct();
  renderDiscovery();
})();