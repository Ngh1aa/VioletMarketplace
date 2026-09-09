(() => {
  const host = document.querySelector('[data-portrait-stage]');
  if (!host) return;

  const DATA = window.VIOLET_DATA || { products: [] };
  const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));

  const PROFILE = {
    'violette-03': { moods:['intimate','soft'], presence:'quiet', occasions:['everyday','evening'], cues:['violet','iris','powder'] },
    'velours-ambre': { moods:['warm','mysterious'], presence:'expressive', occasions:['evening','gift'], cues:['amber','saffron','resin'] },
    'iris-haze': { moods:['clean','soft'], presence:'quiet', occasions:['everyday','exploration'], cues:['iris','tea','air'] },
    'santal-veil': { moods:['warm','intimate'], presence:'balanced', occasions:['everyday','evening'], cues:['woods','sandalwood','fig'] },
    'neroli-rain': { moods:['clean','bright'], presence:'balanced', occasions:['everyday','exploration'], cues:['neroli','citrus','green'] },
    'peau-de-lune': { moods:['intimate','clean'], presence:'quiet', occasions:['everyday','exploration'], cues:['musk','rice','skin'] },
    'nuit-de-figue': { moods:['mysterious','warm'], presence:'balanced', occasions:['evening','exploration'], cues:['fig','tea','woods'] }
  };

  const steps = [
    {
      key:'family', title:'Your instinct', kicker:'01 · Olfactive gravity',
      question:'Bạn bị kéo về thế giới mùi hương nào trước tiên?',
      help:'Không cần nghĩ quá kỹ. Chọn family khiến bạn muốn ngửi lại lần thứ hai.',
      options:[
        ['floral','Floral','Iris, violet, petals · mềm và có chiều sâu'],
        ['woody','Woods','Sandalwood, cedar, fig · khô, ấm, bình tĩnh'],
        ['amber','Amber','Resin, saffron, tonka · ấm và giàu hiện diện'],
        ['fresh','Fresh','Neroli, citrus, green notes · sáng và thoáng'],
        ['musk','Skin Musk','Ambrette, soft musk · gần da và riêng tư']
      ]
    },
    {
      key:'mood', title:'Your mood', kicker:'02 · Emotional register',
      question:'Bạn muốn mùi hương khiến mình cảm thấy thế nào?',
      help:'Violet ưu tiên cảm giác sử dụng hơn thuật ngữ perfumery.',
      options:[
        ['clean','Clean','Sạch, sáng, nhẹ đầu — như áo sơ mi vừa giặt'],
        ['intimate','Intimate','Gần da, kín đáo, chỉ người ở gần mới nhận ra'],
        ['mysterious','Mysterious','Tối hơn, có độ kéo, không kể hết câu chuyện ngay'],
        ['warm','Warm','Ấm, mềm, có cảm giác ôm lấy da'],
        ['soft','Soft','Mịn, phấn hoặc airy — hiện diện nhẹ nhàng'],
        ['bright','Bright','Tươi, linh hoạt, có năng lượng nhưng không chói']
      ]
    },
    {
      key:'presence', title:'Your presence', kicker:'03 · Sillage preference',
      question:'Bạn muốn người khác cảm nhận mùi hương ở mức nào?',
      help:'Đây là preference về hiện diện, không phải cam kết kỹ thuật về projection thực tế.',
      options:[
        ['quiet','Quiet','Một skin-level aura, thân mật và ít phô trương'],
        ['balanced','Balanced','Đủ để được nhận ra, vẫn dễ sống cùng mỗi ngày'],
        ['expressive','Expressive','Muốn fragrance là một phần rõ của tổng thể hiện diện']
      ]
    },
    {
      key:'occasion', title:'Your ritual', kicker:'04 · Context',
      question:'Bạn đang tìm mùi hương cho khoảnh khắc nào?',
      help:'Context giúp Violet ưu tiên mùi dễ mặc, giàu cảm xúc hay đáng khám phá.',
      options:[
        ['everyday','Everyday','Một signature scent có thể quay lại thường xuyên'],
        ['evening','Evening','Dinner, event, night out hoặc những tối muốn có chiều sâu'],
        ['gift','Gift','Một lựa chọn có cảm giác đặc biệt và gift-worthy'],
        ['exploration','Exploration','Muốn thử một hướng mới thay vì lặp lại gu quen thuộc']
      ]
    }
  ];

  const state = { step:0, answers:{} };
  const progressBar = document.querySelector('[data-progress-bar]');
  const stepLabel = document.querySelector('[data-step-label]');
  const stepTitle = document.querySelector('[data-step-title]');

  function renderStep() {
    const spec = steps[state.step];
    stepLabel.textContent = `Step ${state.step + 1} of ${steps.length}`;
    stepTitle.textContent = spec.title;
    progressBar.style.width = `${((state.step + 1) / steps.length) * 100}%`;
    const selected = state.answers[spec.key];

    host.innerHTML = `<div class="portrait-question" data-question="${spec.key}">
      <span class="question-kicker">${spec.kicker}</span>
      <h2>${spec.question}</h2>
      <p>${spec.help}</p>
      <div class="portrait-options" role="group" aria-label="${spec.question}">
        ${spec.options.map(([value,label,desc]) => `<button type="button" class="portrait-option" data-value="${value}" aria-pressed="${selected===value}"><strong>${label}</strong><span>${desc}</span></button>`).join('')}
      </div>
      <div class="portrait-nav">
        <button type="button" data-back ${state.step===0?'disabled':''}>← Back</button>
        <button type="button" class="portrait-next" data-next ${selected?'':'disabled'}>${state.step===steps.length-1?'Reveal my Violet Edit':'Continue →'}</button>
      </div>
    </div>`;

    host.querySelectorAll('[data-value]').forEach(button => button.addEventListener('click', () => {
      state.answers[spec.key] = button.dataset.value;
      host.querySelectorAll('[data-value]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      host.querySelector('[data-next]').disabled = false;
    }));
    host.querySelector('[data-back]')?.addEventListener('click', () => { if (state.step > 0) { state.step -= 1; renderStep(); } });
    host.querySelector('[data-next]')?.addEventListener('click', () => {
      if (!state.answers[spec.key]) return;
      if (state.step < steps.length - 1) { state.step += 1; renderStep(); }
      else renderResults();
    });
  }

  function scoreProduct(product) {
    const profile = PROFILE[product.id];
    if (!profile) return -999;
    let score = Number(product.rating || 0) * .08;
    if (product.category === state.answers.family) score += 5;
    if (profile.moods.includes(state.answers.mood)) score += 3.25;
    if (profile.presence === state.answers.presence) score += 2.2;
    if (profile.occasions.includes(state.answers.occasion)) score += 2.1;
    if (state.answers.occasion === 'exploration' && product.category !== state.answers.family) score += .6;
    return score;
  }

  function why(product) {
    const profile = PROFILE[product.id];
    const reasons = [];
    if (product.category === state.answers.family) reasons.push(`${product.family} đúng với family bạn chọn`);
    if (profile.moods.includes(state.answers.mood)) reasons.push(`mood ${state.answers.mood}`);
    if (profile.presence === state.answers.presence) reasons.push(`độ hiện diện ${state.answers.presence}`);
    if (profile.occasions.includes(state.answers.occasion)) reasons.push(`hợp context ${state.answers.occasion}`);
    return reasons.length ? `Vì ${reasons.slice(0,3).join(', ')}.` : `Một hướng đối lập có chủ đích để mở rộng scent wardrobe của bạn.`;
  }

  function renderResults() {
    stepLabel.textContent = 'Portrait complete';
    stepTitle.textContent = 'Your Violet Edit';
    progressBar.style.width = '100%';
    const candidates = DATA.products.filter(p => PROFILE[p.id]).sort((a,b) => scoreProduct(b) - scoreProduct(a)).slice(0,3);
    const labels = { family:state.answers.family, mood:state.answers.mood, presence:state.answers.presence, occasion:state.answers.occasion };

    host.innerHTML = `<div class="portrait-results">
      <div class="results-heading"><div><span class="question-kicker">Your Scent Portrait · ${Object.values(labels).join(' / ')}</span><h2>Three scents, not thirty.</h2><p>Shortlist này là deterministic recommendation từ lựa chọn của bạn và metadata prototype hiện có — không giả vờ là AI hay “đoán tính cách”. Hãy thử trên da trước khi chọn full bottle.</p></div><button type="button" class="portrait-restart" data-restart>Start again ↺</button></div>
      <div class="portrait-result-grid">
        ${candidates.map((p,i) => `<article class="portrait-result tone-${p.category}"><a href="product.html?id=${p.id}"><div class="result-media"><img src="${p.image}" alt="${p.name} by ${p.brand}"><span class="result-rank">${String(i+1).padStart(2,'0')} · Violet match</span></div></a><div class="result-copy"><span class="result-house">${p.brand}</span><h3>${p.name}</h3><p class="result-why">${why(p)}</p><div class="result-meta"><span>${p.family}</span><span>${money(p.price)}</span></div><a class="result-action" href="product.html?id=${p.id}">Explore fragrance →</a></div></article>`).join('')}
      </div>
      <aside class="portrait-discovery"><div><span>Try before full bottle</span><strong>Still deciding? Build a discovery ritual.</strong><p>Violet Discovery Wardrobe cho phép thử nhiều mood trên da trước khi cam kết với full bottle — phù hợp với cách fragrance thực sự được cảm nhận theo thời gian.</p></div><a class="btn" href="product.html?id=violet-discovery-set">View Discovery Set</a></aside>
    </div>`;
    host.querySelector('[data-restart]').addEventListener('click', () => { state.step = 0; state.answers = {}; renderStep(); });
  }

  renderStep();
})();