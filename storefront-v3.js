(() => {
  const DATA = window.VIOLET_DATA || { products: [], categories: [] };
  const CART_KEY = 'violet-marketplace-cart-v1';
  const qs = new URLSearchParams(location.search);
  const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));
  const productById = id => DATA.products.find(p => p.id === id);

  const SCENT_META = {
    'violette-03': {
      mood: ['intimate','soft'], presence: 'intimate', longevity: '6–8 hours', occasion: 'quiet day · close evening',
      character: 'Powdered violet, cool iris and sandalwood worn close to skin.',
      ritual: 'Wear on pulse points after unscented moisturiser; give the iris ten minutes to soften before judging it.',
      curation: 'Selected for its restraint: a powdery floral with texture and intimacy rather than sweetness or projection.'
    },
    'velours-ambre': {
      mood: ['warm','mysterious'], presence: 'statement', longevity: '9–12 hours', occasion: 'evening · dressed intimacy',
      character: 'Dry saffron and resinous amber softened by tonka and cashmere woods.',
      ritual: 'One or two sprays are enough. Let it warm on skin rather than layering immediately with another fragrance.',
      curation: 'A warm amber with density but enough dryness to avoid the syrupy profile common in louder evening scents.'
    },
    'iris-haze': {
      mood: ['clean','soft'], presence: 'moderate', longevity: '5–7 hours', occasion: 'daylight · work · gallery',
      character: 'Airy iris, white tea and cedar with a cool, almost translucent finish.',
      ritual: 'Best sprayed under clothing and once at the collarbone for a soft diffusion rather than a sharp opening.',
      curation: 'Chosen as Violet’s modern iris: lucid, low-sugar and structured enough for everyday wear.'
    },
    'santal-veil': {
      mood: ['warm','contemplative'], presence: 'moderate', longevity: '7–9 hours', occasion: 'slow afternoon · travel · evening',
      character: 'Creamy sandalwood, green fig leaf and quiet musk with a clean woody trail.',
      ritual: 'Try it on warm skin after a shower; the fig becomes greener while the sandalwood stays close and polished.',
      curation: 'A woody fragrance selected for tactility and balance rather than smoke, sweetness or overt heaviness.'
    },
    'neroli-rain': {
      mood: ['clean','luminous'], presence: 'moderate', longevity: '4–6 hours', occasion: 'warm day · travel · morning',
      character: 'Neroli and petitgrain over mineral musk — bright, green and quietly radiant.',
      ritual: 'Apply generously to wrists and the back of the neck; citrus lift is part of the experience and will soften first.',
      curation: 'A fresh composition with enough green bitterness and mineral texture to feel boutique rather than functional.'
    },
    'peau-de-lune': {
      mood: ['intimate','clean'], presence: 'intimate', longevity: '5–7 hours', occasion: 'skin scent · layering · close spaces',
      character: 'Ambrette, steamed-rice softness and clean woods creating a quiet second-skin effect.',
      ritual: 'Spray on chest and inner elbows. It rewards close proximity more than projection and works well as a layering base.',
      curation: 'Selected as an understated skin scent where texture and personal space matter more than a dramatic opening.'
    },
    'nuit-de-figue': {
      mood: ['contemplative','mysterious'], presence: 'moderate', longevity: '7–9 hours', occasion: 'late afternoon · reading · dinner',
      character: 'Green fig sap, black tea and dry cedar with a shadowed, meditative structure.',
      ritual: 'Test first on skin, not blotter only: the fig moves from green sap to warmer pulp as the fragrance settles.',
      curation: 'A fig fragrance with architectural dryness and tea-like shadow rather than a creamy gourmand treatment.'
    },
    'violet-discovery-set': {
      mood: ['explore'], presence: 'varied', longevity: 'varied', occasion: 'at-home discovery · gifting',
      character: 'Six small scent stories designed to be worn slowly before choosing a full bottle.',
      ritual: 'Wear one sample per day, on skin, and note the drydown after two and six hours before comparing.',
      curation: 'The lowest-commitment entry into Violet: a deliberate trial ritual rather than a miniature gift box alone.'
    },
    'velvet-room-candle': {
      mood: ['warm','mysterious'], presence: 'room', longevity: '≈50 burn hours', occasion: 'home · evening ritual',
      character: 'Iris dust, tobacco leaf and amber creating a warm, softly shadowed room scent.',
      ritual: 'Trim the wick before each burn and allow the surface wax to melt evenly on the first session.',
      curation: 'Selected to extend Violet’s fragrance language into space without becoming a generic sweet candle.'
    },
    'signature-gift-trio': {
      mood: ['explore','gift'], presence: 'varied', longevity: 'varied', occasion: 'gifting · travel',
      character: 'Three travel fragrances across floral light, amber warmth and quiet woods.',
      ritual: 'Start with the lightest profile in daylight, then wear the amber and woody edits on separate evenings.',
      curation: 'A gift format built around three distinct wearing moods rather than three near-identical flankers.'
    }
  };

  const moodLabels = {
    clean: 'Clean / lucid', intimate: 'Intimate / skin', soft: 'Soft / powdery', warm: 'Warm / enveloping',
    luminous: 'Luminous / bright', contemplative: 'Contemplative', mysterious: 'Mysterious / shadowed', explore: 'Discovery', gift: 'Giftable'
  };
  const presenceLabels = { intimate: 'Close to skin', moderate: 'Quiet presence', statement: 'Statement', varied: 'Varied', room: 'Room scent' };
  const familyLabels = Object.fromEntries((DATA.categories || []).map(c => [c.id, c.name]));

  document.body.classList.add('violet-storefront-v3');

  function metaFor(p){
    return SCENT_META[p.id] || {
      mood: ['soft'], presence: 'moderate', longevity: 'Unknown', occasion: 'everyday',
      character: p.description || p.family || 'Fine fragrance',
      ritual: 'Try on skin and allow the full drydown before deciding.',
      curation: 'Selected for a clear fragrance identity and fit within the Violet edit.'
    };
  }

  function concentrationKey(p){
    const value = (p.concentration || '').toLowerCase();
    if(value.includes('extrait')) return 'extrait';
    if(value.includes('eau de parfum')) return 'edp';
    if(value.includes('discovery')) return 'discovery';
    if(value.includes('candle')) return 'home';
    if(value.includes('gift')) return 'gift';
    return 'other';
  }

  function toneClass(p){
    if(p.category === 'floral') return 'tone-floral';
    if(p.category === 'amber') return 'tone-amber';
    if(p.category === 'woody') return 'tone-woods';
    if(p.category === 'fresh') return 'tone-fresh';
    if(p.category === 'musk') return 'tone-musk';
    return 'tone-neutral';
  }

  function card(p, reason = ''){
    const m = metaFor(p);
    return `<article class="product-card v3-product-card ${toneClass(p)}">
      <a href="product.html?id=${encodeURIComponent(p.id)}">
        <div class="product-media"><img src="${p.image}" alt="${p.name} by ${p.brand}" loading="lazy"></div>
        <div class="product-body">
          <div class="product-brand"><span class="house-name">${p.brand}</span>${p.fast ? '<span class="badge badge-fast">New</span>' : ''}</div>
          <div class="product-title">${p.name}</div>
          <div class="product-scent-line">${p.concentration || ''}${p.size ? ` · ${p.size}` : ''}</div>
          <div class="v3-card-character">${m.character}</div>
          <div class="product-meta"><span>${p.family || ''}</span><span>${presenceLabels[m.presence] || m.presence}</span></div>
          <div class="price-row"><div class="price">${money(p.price)}</div><span class="product-arrow">↗</span></div>
          ${reason ? `<div class="pdp-v3-related-reason">${reason}</div>` : ''}
        </div>
      </a>
    </article>`;
  }

  function paramsUrl(changes = {}){
    const next = new URLSearchParams(location.search);
    Object.entries(changes).forEach(([key,value]) => {
      if(value === null || value === '' || next.get(key) === String(value)) next.delete(key);
      else next.set(key, String(value));
    });
    const text = next.toString();
    return `search.html${text ? `?${text}` : ''}`;
  }

  function removeParamUrl(key){
    const next = new URLSearchParams(location.search); next.delete(key);
    const text = next.toString(); return `search.html${text ? `?${text}` : ''}`;
  }

  function enhanceSearch(){
    const grid = document.querySelector('[data-results]');
    const panel = document.querySelector('.filter-panel');
    if(!grid || !panel) return;

    const current = new URLSearchParams(location.search);
    const q = (current.get('q') || '').trim().toLowerCase();
    const category = current.get('category') || '';
    const mood = current.get('mood') || '';
    const presence = current.get('presence') || '';
    const concentration = current.get('concentration') || '';
    const official = current.get('official') === '1';

    panel.innerHTML = `<strong>Refine the edit</strong>
      <div class="filter-group"><strong>Olfactive family</strong><div class="filter-options">
        ${['floral','woody','amber','fresh','musk'].map(value => `<a class="v3-filter-link" aria-current="${category === value}" href="${paramsUrl({category:value})}"><span>${familyLabels[value] || value}</span></a>`).join('')}
      </div></div>
      <div class="filter-group"><strong>Mood</strong><div class="filter-options">
        ${['clean','intimate','soft','warm','luminous','contemplative','mysterious'].map(value => `<a class="v3-filter-link" aria-current="${mood === value}" href="${paramsUrl({mood:value})}"><span>${moodLabels[value]}</span></a>`).join('')}
      </div></div>
      <div class="filter-group"><strong>Presence</strong><div class="filter-options">
        ${['intimate','moderate','statement'].map(value => `<a class="v3-filter-link" aria-current="${presence === value}" href="${paramsUrl({presence:value})}"><span>${presenceLabels[value]}</span></a>`).join('')}
      </div></div>
      <div class="filter-group"><strong>Concentration</strong><div class="filter-options">
        <a class="v3-filter-link" aria-current="${concentration === 'edp'}" href="${paramsUrl({concentration:'edp'})}"><span>Eau de Parfum</span></a>
        <a class="v3-filter-link" aria-current="${concentration === 'extrait'}" href="${paramsUrl({concentration:'extrait'})}"><span>Extrait de Parfum</span></a>
        <a class="v3-filter-link" aria-current="${concentration === 'discovery'}" href="${paramsUrl({concentration:'discovery'})}"><span>Discovery format</span></a>
      </div></div>
      <div class="filter-group"><strong>Violet curation</strong><div class="filter-options">
        <a class="v3-filter-link" aria-current="${official}" href="${paramsUrl({official:'1'})}"><span>Curated houses</span></a>
      </div></div>
      ${(category || mood || presence || concentration || official || q) ? '<a class="v3-clear-all" href="search.html">Clear all refinement</a>' : ''}`;

    let items = DATA.products.filter(p => {
      const m = metaFor(p);
      const searchable = [p.name,p.brand,p.family,p.concentration,p.description,p.notes ? Object.values(p.notes).join(' ') : '',m.character,...m.mood].filter(Boolean).join(' ').toLowerCase();
      return (!q || searchable.includes(q)) &&
        (!category || p.category === category) &&
        (!mood || m.mood.includes(mood)) &&
        (!presence || m.presence === presence) &&
        (!concentration || concentrationKey(p) === concentration) &&
        (!official || p.official);
    });

    const chips = document.querySelector('[data-active-chips]');
    if(chips){
      const active = [];
      if(category) active.push(['category', familyLabels[category] || category]);
      if(mood) active.push(['mood', moodLabels[mood] || mood]);
      if(presence) active.push(['presence', presenceLabels[presence] || presence]);
      if(concentration) active.push(['concentration', concentration === 'edp' ? 'Eau de Parfum' : concentration === 'extrait' ? 'Extrait' : 'Discovery']);
      if(official) active.push(['official','Curated houses']);
      if(q) active.push(['q',`“${current.get('q')}”`]);
      chips.innerHTML = active.map(([key,label]) => `<span class="chip">${label}<a href="${removeParamUrl(key)}" aria-label="Remove ${label}">×</a></span>`).join('');
    }

    const title = document.querySelector('[data-result-title]');
    if(title){
      if(q) title.textContent = `Results for “${current.get('q')}”`;
      else if(category) title.textContent = familyLabels[category] || 'Fragrance';
      else if(mood) title.textContent = moodLabels[mood] || 'Fragrance by mood';
      else title.textContent = 'Fragrance Library';
    }

    const sort = document.querySelector('[data-sort]');
    const draw = () => {
      let list = [...items];
      if(sort?.value === 'price-asc') list.sort((a,b) => a.price - b.price);
      if(sort?.value === 'price-desc') list.sort((a,b) => b.price - a.price);
      if(sort?.value === 'rating') list.sort((a,b) => b.rating - a.rating);
      document.querySelectorAll('[data-result-count]').forEach(el => el.textContent = `${list.length} fragrance${list.length === 1 ? '' : 's'}`);
      grid.innerHTML = list.length ? list.map(p => card(p)).join('') : `<div class="v3-empty">
        <span class="section-kicker">No match in this edit</span><h3>Widen the scent portrait.</h3>
        <p>Không có fragrance nào khớp toàn bộ refinement hiện tại. Bỏ bớt một filter hoặc để Violet rút gọn lựa chọn bằng 4 câu hỏi.</p>
        <div class="v3-empty-actions"><a class="btn btn-secondary" href="search.html">Clear filters</a><a class="btn btn-primary" href="finder.html">Create Scent Portrait</a></div>
      </div>`;
    };
    sort?.addEventListener('change', draw);
    draw();
  }

  function readCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }

  function addToBag(id){
    const cart = readCart(); const item = cart.find(row => row.id === id);
    if(item) item.qty += 1; else cart.push({ id, qty: 1 });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    const count = cart.reduce((sum,row) => sum + row.qty,0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    let toast = document.querySelector('.v3-toast');
    if(!toast){ toast = document.createElement('div'); toast.className = 'toast v3-toast'; toast.setAttribute('role','status'); document.body.append(toast); }
    toast.textContent = 'Added to fragrance bag'; toast.classList.add('show');
    clearTimeout(window.__v3Toast); window.__v3Toast = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function relatedProducts(p){
    const m = metaFor(p);
    const candidates = DATA.products.filter(x => x.id !== p.id && !['home-fragrance','gifts'].includes(x.category));
    return candidates.map(x => {
      const xm = metaFor(x); let score = 0; const reasons = [];
      if(x.category === p.category){ score += 4; reasons.push(`same ${p.family || 'family'} direction`); }
      const sharedMood = xm.mood.find(value => m.mood.includes(value));
      if(sharedMood){ score += 3; reasons.push(`shared ${moodLabels[sharedMood]?.toLowerCase() || sharedMood} mood`); }
      if(xm.presence === m.presence){ score += 2; reasons.push(`similar ${presenceLabels[m.presence]?.toLowerCase() || 'presence'}`); }
      return { product:x, score, reason: reasons.slice(0,2).join(' · ') || 'a contrasting route inside the Violet edit' };
    }).sort((a,b) => b.score - a.score).slice(0,3);
  }

  function enhanceProduct(){
    const host = document.querySelector('[data-product-detail]');
    if(!host) return;
    const p = productById(qs.get('id')) || DATA.products[0]; if(!p) return;
    const m = metaFor(p); const notes = p.notes || {};
    const position = String(Math.max(1, DATA.products.findIndex(x => x.id === p.id) + 1)).padStart(2,'0');
    const canTry = p.id !== 'violet-discovery-set' && !['home-fragrance','gifts'].includes(p.category);
    const related = relatedProducts(p);

    host.classList.add('pdp-v3');
    host.innerHTML = `<div class="pdp-v3-media ${toneClass(p)}">
        <img src="${p.image}" alt="${p.name} by ${p.brand}">
        <div class="pdp-media-caption"><span>${p.family || 'Fine fragrance'}</span><span>Object ${position} / Violet Edit</span></div>
      </div>
      <div class="pdp-v3-info">
        <div class="pdp-v3-index"><span>Violet fragrance dossier · ${position}</span><span>${p.official ? 'Curated house' : 'Violet edit'}</span></div>
        <div class="pdp-v3-maison">${p.brand}</div>
        <h1>${p.name}</h1>
        <p class="pdp-v3-character">${m.character}</p>
        <div class="pdp-v3-format">${p.concentration || 'Fine fragrance'} · ${p.size || ''} · ${p.family || ''}</div>

        <div class="pdp-v3-commerce"><div><div class="pdp-v3-price">${money(p.price)}</div>${p.oldPrice ? `<div class="pdp-v3-stock">Violet private edit · reference ${money(p.oldPrice)}</div>` : `<div class="pdp-v3-stock">${p.stock > 0 ? `${p.stock} available in prototype inventory` : 'Unavailable'}</div>`}</div><div class="pdp-v3-stock">★ ${p.rating} · prototype rating</div></div>
        <div class="pdp-v3-actions">
          ${canTry ? '<a class="btn btn-secondary" href="product.html?id=violet-discovery-set">Try first</a>' : '<a class="btn btn-secondary" href="finder.html">Build a Scent Portrait</a>'}
          <button class="btn btn-primary" type="button" data-v3-add ${p.stock <= 0 ? 'disabled' : ''}>Add full bottle</button>
        </div>
        <p class="pdp-v3-try-note">${canTry ? 'Try-first routes to Violet’s representative Discovery Wardrobe; this prototype does not claim a sample of every exact bottle is available.' : 'Use Scent Portrait to compare this format against other fragrance directions.'}</p>

        <section class="pdp-v3-section"><div class="pdp-v3-section-label"><span>01 / Olfactive portrait</span><span>Decision profile</span></div>
          <div class="pdp-v3-profile">
            <div><span>Family</span><strong>${p.family || 'Fine fragrance'}</strong></div>
            <div><span>Mood</span><strong>${m.mood.slice(0,2).map(x => moodLabels[x] || x).join(' · ')}</strong></div>
            <div><span>Presence</span><strong>${presenceLabels[m.presence] || m.presence}</strong></div>
            <div><span>Longevity</span><strong>${m.longevity}</strong></div>
          </div>
        </section>

        <section class="pdp-v3-section"><div class="pdp-v3-section-label"><span>02 / Note architecture</span><span>Top → skin</span></div>
          <div class="pdp-v3-notes">
            <div class="pdp-v3-note"><span>Top</span><strong>${notes.top || '—'}</strong></div>
            <div class="pdp-v3-note"><span>Heart</span><strong>${notes.heart || '—'}</strong></div>
            <div class="pdp-v3-note"><span>Base</span><strong>${notes.base || '—'}</strong></div>
          </div>
        </section>

        <section class="pdp-v3-section"><div class="pdp-v3-section-label"><span>03 / Why Violet</span><span>Curation note</span></div><p class="pdp-v3-story">${m.curation}</p></section>
        <section class="pdp-v3-section"><div class="pdp-v3-section-label"><span>04 / Wearing ritual</span><span>${m.occasion}</span></div><p class="pdp-v3-story">${m.ritual}</p></section>
        <section class="pdp-v3-section"><div class="pdp-v3-section-label"><span>05 / Provenance</span><span>Marketplace trust</span></div>
          <div class="pdp-v3-provenance"><div><b>Maison / seller</b>${p.seller}</div><div><b>Violet status</b>${p.official ? 'Curated house · representative authenticity standard' : 'Marketplace edit'}</div></div>
        </section>
      </div>
      <section class="pdp-v3-related"><div class="pdp-v3-related-head"><div><span class="section-kicker">Continue the scent conversation</span><h2>Three nearby directions.</h2></div><p>Không phải “you may also like” ngẫu nhiên: shortlist này ưu tiên family, mood hoặc độ hiện diện có liên hệ với fragrance đang xem.</p></div><div class="pdp-v3-related-grid">${related.map(row => card(row.product, row.reason)).join('')}</div></section>`;

    const add = host.querySelector('[data-v3-add]');
    add?.addEventListener('click', () => addToBag(p.id));
  }

  function markExistingCards(){
    document.querySelectorAll('.product-card').forEach(cardEl => {
      const href = cardEl.querySelector('a')?.getAttribute('href') || '';
      const id = new URL(href, location.href).searchParams.get('id'); const p = productById(id);
      if(p) cardEl.classList.add(toneClass(p));
    });
  }

  enhanceSearch();
  enhanceProduct();
  markExistingCards();
})();
