(() => {
  const DATA = window.VIOLET_DATA || { products: [] };
  const qs = new URLSearchParams(location.search);
  const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));

  const HOUSES = [
    { id:'maison-aster', name:'Maison Aster', origin:'Paris', territory:'violet phấn · fig xanh · gỗ trầm', ethos:'Cấu trúc mềm, hoa cỏ mát và những lớp gỗ xanh trầm tĩnh.', signature:'Hoa cỏ phấn với sắc xanh, trầm và thiền định.' },
    { id:'atelier-nocturne', name:'Atelier Nocturne', origin:'Grasse', territory:'hổ phách · saffron · bóng tobacco', ethos:'Chất liệu ấm được tạo hình cho buổi tối, tinh tế hơn là phô trương.', signature:'Hổ phách khô và độ ấm tối với cấu trúc tiết chế.' },
    { id:'elan-studio', name:'Élan Studio', origin:'Seoul', territory:'iris · trà · gỗ trong', ethos:'Những phối hương sạch, sáng và có độ trong với hoàn thiện hiện đại tiết chế.', signature:'Iris thoáng, trà và cấu trúc trong.' },
    { id:'orphee', name:'Orphée', origin:'Nhà hương độc lập', territory:'sandalwood · lá fig · xạ hương', ethos:'Gỗ kem và kết cấu xanh nhưng không nặng khói.', signature:'Gỗ mềm được làm nổi bằng cảm giác chất liệu thay vì sức nặng.' },
    { id:'lumiere-17', name:'Lumière 17', origin:'Côte d’Azur', territory:'neroli · petitgrain · ánh khoáng', ethos:'Độ sáng đi cùng chút đắng xanh để tổng thể vẫn chính xác và gọn.', signature:'Ánh citrus với một trục xanh, khoáng.' },
    { id:'nacre', name:'Nacre', origin:'Tokyo', territory:'ambrette · cơm · gỗ sạch', ethos:'Những mùi hương sát da xoay quanh sự riêng tư và cảm giác chất liệu.', signature:'Xạ hương như lớp da thứ hai và độ mềm của chất liệu.' }
  ];

  const houseById = id => HOUSES.find(house => house.id === id);
  const productsForHouse = house => DATA.products.filter(product => product.brand === house.name);

  function card(product){
    return `<a class="v4-house-object" href="product.html?id=${encodeURIComponent(product.id)}">
      <div class="v4-house-object-media"><img src="${product.image}" alt="${product.name} của ${product.brand}" loading="lazy"></div>
      <div class="v4-house-object-meta"><span>${product.concentration || 'Tuyển chọn Violet'}</span><span>${product.size || ''}</span></div>
      <h3>${product.name}</h3><p>${product.description || product.family || 'Nước hoa'}</p><strong>${money(product.price)}</strong>
    </a>`;
  }

  function renderHousesIndex(){
    const host = document.querySelector('[data-v4-houses-index]');
    if(!host) return;
    host.innerHTML = HOUSES.map((house,index) => {
      const products = productsForHouse(house);
      return `<a class="v4-house-ledger-row" href="house.html?id=${house.id}"><span>${String(index+1).padStart(2,'0')}</span><h2>${house.name}</h2><em>${house.origin}</em><p>${house.territory}</p><small>${products.length} mùi hương trong tuyển chọn prototype</small><i>↗</i></a>`;
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
      <div class="v4-house-copy"><div><span class="v4-house-origin">V.31 / ${house.origin}</span><h1>${house.name}</h1><p class="v4-house-ethos">${house.ethos}</p></div><div class="v4-house-territory-block"><span>Lãnh địa mùi hương</span><strong>${house.territory}</strong></div></div>
      <div class="v4-house-feature"><div class="v4-house-feature-label"><span>NGHIÊN CỨU NHÀ HƯƠNG / MÙI NỔI BẬT</span><span>${feature ? feature.name : 'Tuyển chọn Violet'}</span></div>${feature?`<a class="v4-house-feature-media" href="product.html?id=${feature.id}"><img src="${feature.image}" alt="${feature.name} của ${house.name}"></a>`:'<div class="v4-house-feature-media"></div>'}<div class="v4-house-feature-foot"><span>${house.signature}</span><a href="search.html?house=${house.id}">Khám phá nhà hương này →</a></div></div>
    </section>
    <section class="v4-house-collection"><div class="v4-section-label"><span>V.32 / TUYỂN CHỌN HIỆN TẠI</span><a href="search.html?house=${house.id}">Mở trong thư viện →</a></div><div class="v4-house-collection-heading"><h2>Những mùi hương Violet giữ lại từ maison này.</h2><p>Dữ liệu maison hư cấu được dùng để mô phỏng hành trình khám phá theo nhà hương. Đây không phải tuyên bố về một công ty nước hoa thật, quan hệ phân phối hay nguồn gốc thương mại.</p></div><div class="v4-house-products">${products.length?products.map(card).join(''):'<div class="v4-empty"><span>CHƯA CÓ MÙI HƯƠNG</span><h2>Nhà hương này chưa có sản phẩm prototype.</h2><p>Quay lại danh sách nhà hương hoặc thư viện mùi hương.</p></div>'}</div></section>`;
  }

  function patchFinder(){
    const page = document.querySelector('.portrait-page');
    if(!page) return;
    if(!document.querySelector('.v4-finder-handoff')){
      page.insertAdjacentHTML('beforeend', `<section class="v4-finder-handoff"><span>V.23 / SAU CHÂN DUNG MÙI HƯƠNG</span><strong>Biến danh sách gợi ý thành một lần thử trên da, không phải quyết định mua chai đầy đủ ngay lập tức.</strong><a class="btn btn-primary" href="discovery.html">Tạo bộ ba thử mùi</a></section>`);
    }
    const stage = document.querySelector('[data-portrait-stage]');
    if(!stage) return;
    const sync = () => {
      const action = stage.querySelector('.portrait-discovery a');
      if(!action) return;
      if(action.getAttribute('href') !== 'discovery.html') action.setAttribute('href','discovery.html');
      if(action.textContent !== 'Tạo bộ ba thử mùi') action.textContent='Tạo bộ ba thử mùi';
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