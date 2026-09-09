(() => {
  const DATA = window.VIOLET_DATA || { products: [] };
  const params = new URLSearchParams(location.search);
  const product = DATA.products.find(item => item.id === params.get('id')) || DATA.products[0];
  const host = document.querySelector('[data-product-detail]');
  if (!product || !host) return;

  const CART_KEY = 'violet-marketplace-cart-v1';
  const TRIO_KEY = 'violet-discovery-trio-v1';
  const money = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0));
  const safeJSON = (value, fallback) => { try { return JSON.parse(value); } catch { return fallback; } };

  const HOUSES = [
    { id:'maison-aster', name:'Maison Aster', origin:'Paris', territory:'powdered violet · green fig · quiet woods', ethos:'Soft structure, cool florals and contemplative green woods.' },
    { id:'atelier-nocturne', name:'Atelier Nocturne', origin:'Grasse', territory:'amber · saffron · tobacco shadow', ethos:'Warm materials shaped for evening rather than volume.' },
    { id:'elan-studio', name:'Élan Studio', origin:'Seoul', territory:'iris · tea · translucent woods', ethos:'Clean, lucid compositions with a restrained modern finish.' },
    { id:'orphee', name:'Orphée', origin:'Independent house', territory:'sandalwood · fig leaf · musk', ethos:'Creamy woods and green texture without smoky heaviness.' },
    { id:'lumiere-17', name:'Lumière 17', origin:'Côte d’Azur', territory:'neroli · petitgrain · mineral light', ethos:'Brightness with enough green bitterness to stay precise.' },
    { id:'nacre', name:'Nacre', origin:'Tokyo', territory:'ambrette · rice · clean woods', ethos:'Near-skin fragrances built around intimacy and texture.' }
  ];

  const META = {
    'violette-03': {
      character:'Powdered violet, cool iris and sandalwood worn close to skin.',
      story:'A soft violet accord settles over cool iris, creamy sandalwood and a dry veil of vanilla. Intimate rather than sweet, Violette 03 is built to stay close — a quiet floral with enough structure to carry from daylight into evening.',
      presence:'Close to skin', wear:'Quiet day · close evening', sample:true,
      materialLabel:'Violet petal / powder',
      material:'https://images.pexels.com/photos/35391811/pexels-photo-35391811.jpeg?auto=compress&cs=tinysrgb&w=1400',
      baseLabel:'Sandalwood / grain',
      baseMaterial:'https://images.pexels.com/photos/6692131/pexels-photo-6692131.jpeg?auto=compress&cs=tinysrgb&w=1400'
    },
    'velours-ambre': { character:'Dry saffron and resinous amber softened by tonka and cashmere woods.', story:'Dry saffron opens into labdanum and benzoin before tonka and cashmere woods soften the trail. Velours Ambre is warm without becoming syrupy — an evening fragrance built around texture, shadow and slow projection.', presence:'Statement', wear:'Evening · dressed intimacy', sample:true },
    'iris-haze': { character:'Airy iris, white tea and cedar with a cool, translucent finish.', story:'Iris Haze pairs cool orris with white tea, pear skin and pale cedar. The result is lucid and lightly powdery, with a clean structure that works especially well in daylight and close spaces.', presence:'Quiet presence', wear:'Daylight · work · gallery', sample:true },
    'santal-veil': { character:'Creamy sandalwood, green fig leaf and quiet musk.', story:'Green fig leaf cuts through creamy sandalwood before orris, cedar and white musk settle into a warm, polished base. Santal Veil keeps its woods smooth and airy rather than smoky.', presence:'Quiet presence', wear:'Slow afternoon · travel · evening', sample:true },
    'neroli-rain': { character:'Neroli and petitgrain over mineral musk — bright, green and quietly radiant.', story:'Neroli Rain starts with citrus peel and green petitgrain, then moves through orange blossom into mineral musk and blond woods. Bright, precise and made for warm light.', presence:'Quiet presence', wear:'Warm day · travel · morning', sample:true },
    'peau-de-lune': { character:'Ambrette, steamed-rice softness and clean woods creating a second-skin effect.', story:'Ambrette and steamed-rice softness create a subtle skin scent around iris, clean woods and white musk. Peau de Lune is intentionally intimate: more texture than projection.', presence:'Close to skin', wear:'Skin scent · layering · close spaces', sample:true },
    'nuit-de-figue': { character:'Green fig sap, black tea and dry cedar with a shadowed structure.', story:'Green fig sap and black tea lead into fig pulp, cedar, vetiver and dry amber. Nuit de Figue feels shaded and contemplative — a green woody fragrance with a dry, architectural finish.', presence:'Quiet presence', wear:'Late afternoon · reading · dinner', sample:true }
  };

  const house = HOUSES.find(item => item.name === product.brand);
  const meta = META[product.id] || {
    character: product.description || product.family || 'A Violet fragrance object.',
    story: product.description || 'Part of the Violet curated prototype edit.',
    presence:'Violet edit', wear:'Everyday', sample:false
  };
  const notes = product.notes || {};

  const getCart = () => safeJSON(localStorage.getItem(CART_KEY) || '[]', []);
  const setCart = cart => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    const count = cart.reduce((sum, row) => sum + Number(row.qty || 0), 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  };
  const addBottle = () => {
    const cart = getCart();
    const existing = cart.find(row => row.id === product.id);
    if (existing) existing.qty += 1; else cart.push({ id: product.id, qty: 1 });
    setCart(cart);
    status(`${product.name} added to bag.`);
  };

  const getTrio = () => safeJSON(localStorage.getItem(TRIO_KEY) || '[]', []).filter(Boolean).slice(0, 3);
  const setTrio = ids => {
    localStorage.setItem(TRIO_KEY, JSON.stringify([...new Set(ids)].slice(0, 3)));
    document.dispatchEvent(new CustomEvent('violet:trio-change'));
  };
  const addToTrio = button => {
    const trio = getTrio();
    if (trio.includes(product.id)) {
      status(`${product.name} is already in your discovery trio.`);
      button.textContent = 'In discovery trio';
      return;
    }
    if (trio.length >= 3) {
      status('Your discovery trio is full. Remove one scent before adding another.');
      return;
    }
    trio.push(product.id);
    setTrio(trio);
    button.textContent = 'In discovery trio';
    button.setAttribute('aria-pressed', 'true');
    status(`${product.name} added to your discovery trio.`);
  };
  const status = message => {
    let el = document.querySelector('.v4-status');
    if (!el) {
      el = document.createElement('div');
      el.className = 'v4-status';
      el.setAttribute('role', 'status');
      document.body.append(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(window.__pdp41Status);
    window.__pdp41Status = setTimeout(() => el.classList.remove('show'), 2400);
  };

  const supportingMaterial = meta.material || product.image;
  const supportingBase = meta.baseMaterial || product.image;
  const materialLabel = meta.materialLabel || `${product.family || 'Fragrance'} / material study`;
  const baseLabel = meta.baseLabel || 'Object / surface study';

  const related = DATA.products
    .filter(item => item.id !== product.id && META[item.id]?.sample)
    .map(item => {
      let score = 0;
      const reasons = [];
      if (item.category === product.category) { score += 4; reasons.push(`same ${product.family || 'family'} direction`); }
      if (item.brand === product.brand) { score += 3; reasons.push('same maison'); }
      if (META[item.id]?.presence === meta.presence) { score += 2; reasons.push('similar presence'); }
      return { item, score, reason: reasons.slice(0, 2).join(' · ') || 'a contrasting route in the Violet edit' };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const crumb = document.querySelector('.v4-breadcrumbs');
  if (crumb) {
    crumb.innerHTML = `<a href="index.html">Violet</a><span>/</span><a href="search.html">Fragrances</a><span>/</span><a href="${house ? `house.html?id=${house.id}` : 'houses.html'}">${product.brand}</a><span>/</span><span>${product.name}</span>`;
  }

  document.querySelector('.v4-product-page')?.classList.add('pdp41-page');
  document.title = `${product.name} · ${product.brand} · Violet Parfumerie`;

  const index = String(Math.max(1, DATA.products.findIndex(item => item.id === product.id) + 1)).padStart(2, '0');
  const trioHasProduct = getTrio().includes(product.id);

  host.className = 'pdp41';
  host.innerHTML = `
    <section class="pdp41-top" data-pdp-primary-frame>
      <div class="pdp41-gallery" data-pdp-gallery>
        <div class="pdp41-gallery-head"><span>V.${index} / FRAGRANCE STUDY</span><span>${product.family || 'Fine fragrance'} · media-led object view</span></div>

        <figure class="pdp41-media pdp41-hero" data-pdp-media-role="bottle-hero">
          <img src="${product.image}" alt="Full bottle study of ${product.name} by ${product.brand}" fetchpriority="high">
          <figcaption>01 / Full bottle</figcaption>
        </figure>

        <figure class="pdp41-media pdp41-detail pdp41-detail--cap" data-pdp-media-role="cap-atomizer-detail">
          <img src="${product.image}" alt="Cap and atomizer detail study of ${product.name}">
          <figcaption>02 / Cap + atomizer</figcaption>
        </figure>

        <figure class="pdp41-media pdp41-detail pdp41-detail--glass" data-pdp-media-role="glass-label-detail">
          <img src="${product.image}" alt="Glass and label detail study of ${product.name}">
          <figcaption>03 / Glass + label</figcaption>
        </figure>

        <figure class="pdp41-media pdp41-material pdp41-material--violet" data-pdp-media-role="olfactive-material">
          <img src="${supportingMaterial}" alt="Olfactive material study for ${product.name}: ${materialLabel}" loading="lazy">
          <figcaption>04 / ${materialLabel}</figcaption>
        </figure>

        <figure class="pdp41-media pdp41-material pdp41-material--wood" data-pdp-media-role="base-material">
          <img src="${supportingBase}" alt="Base material study for ${product.name}: ${baseLabel}" loading="lazy">
          <figcaption>05 / ${baseLabel}</figcaption>
        </figure>
      </div>

      <div class="pdp41-buying-wrap">
        <aside class="pdp41-buying" data-pdp-sticky>
          <div class="pdp41-buying-index"><span>VIOLET OBJECT / ${index}</span><span>${meta.sample ? 'DISCOVERY ELIGIBLE' : 'VIOLET EDIT'}</span></div>
          <a class="pdp41-house" href="${house ? `house.html?id=${house.id}` : 'houses.html'}">${product.brand}</a>
          <h1>${product.name}</h1>
          <p class="pdp41-character">${meta.character}</p>

          <div class="pdp41-format">
            <span>${product.concentration || 'Fragrance'} · ${product.size || 'One format'}</span>
            <small>${product.family || ''}</small>
            <strong>${money(product.price)}</strong>
          </div>

          ${meta.sample ? `<div class="pdp41-trial-note"><span>TRY BEFORE THE BOTTLE</span><p>Build a trio of 3 scents to compare slowly on skin before choosing a full bottle.</p></div>` : ''}

          <div class="pdp41-actions">
            ${meta.sample ? `<button class="btn btn-secondary" type="button" data-pdp-add-trio aria-pressed="${trioHasProduct}">${trioHasProduct ? 'In discovery trio' : 'Add to discovery trio'}</button>` : `<a class="btn btn-secondary" href="discovery.html">Explore Discovery</a>`}
            <button class="btn btn-primary" type="button" data-pdp-add-bottle ${product.stock <= 0 ? 'disabled' : ''}>Add ${product.size || 'full'} bottle</button>
          </div>

          <div class="pdp41-profile">
            <div><span>Presence</span><strong>${meta.presence}</strong></div>
            <div><span>Wear</span><strong>${meta.wear}</strong></div>
          </div>

          <details class="pdp41-disclosure">
            <summary>Prototype notice</summary>
            <p>Discovery selections and bag actions are stored in this browser only. No sample fulfillment or payment is processed.</p>
          </details>
        </aside>
      </div>
    </section>

    <section class="pdp41-story" data-pdp-story>
      <div class="pdp41-section-head"><span>01 / THE SCENT</span><span>material → note architecture → house</span></div>
      <div class="pdp41-story-grid">
        <div class="pdp41-story-visual" data-pdp-media-role="story-material">
          <img src="${supportingMaterial}" alt="Material atmosphere for ${product.name}" loading="lazy">
          <span>${materialLabel}</span>
        </div>
        <div class="pdp41-story-copy">
          <div>
            <span class="v4-kicker">THE SCENT</span>
            <h2>${meta.character}</h2>
            <p>${meta.story}</p>
          </div>

          <div class="pdp41-note-table" aria-label="Fragrance note architecture">
            <div><span>Top</span><strong>${notes.top || '—'}</strong></div>
            <div><span>Heart</span><strong>${notes.heart || '—'}</strong></div>
            <div><span>Base</span><strong>${notes.base || '—'}</strong></div>
          </div>

          <div class="pdp41-house-proof">
            <span>02 / THE HOUSE</span>
            <strong>${house?.name || product.brand}</strong>
            <p>${house?.ethos || 'Part of the Violet curated prototype edit.'}</p>
            <p>${house?.territory || product.family || ''}</p>
            <a href="${house ? `house.html?id=${house.id}` : 'houses.html'}">Open the maison →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="pdp41-related" data-pdp-related>
      <div class="pdp41-section-head"><span>03 / NEARBY DIRECTIONS</span><span>smaller evidence, never louder than the main object</span></div>
      <div class="pdp41-related-grid">
        ${related.map(({ item, reason }) => `
          <article class="pdp41-related-card">
            <a href="product.html?id=${item.id}">
              <div class="pdp41-related-media"><img src="${item.image}" alt="${item.name} by ${item.brand}" loading="lazy"></div>
              <div class="pdp41-related-meta"><span>${item.brand}</span><span>${item.family || ''}</span></div>
              <h3>${item.name}</h3>
              <p>${reason}</p>
              <div class="pdp41-related-price"><span>${item.concentration || ''} · ${item.size || ''}</span><strong>${money(item.price)}</strong></div>
            </a>
          </article>`).join('')}
      </div>
    </section>`;

  host.querySelector('[data-pdp-add-bottle]')?.addEventListener('click', addBottle);
  host.querySelector('[data-pdp-add-trio]')?.addEventListener('click', event => addToTrio(event.currentTarget));
})();
