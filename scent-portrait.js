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

  const answerLabels = {
    family: { floral:'hoa cỏ', woody:'gỗ', amber:'hổ phách', fresh:'tươi sáng', musk:'xạ hương da' },
    mood: { clean:'sạch thoáng', intimate:'gần da', mysterious:'bí ẩn', warm:'ấm áp', soft:'mềm mại', bright:'rạng sáng' },
    presence: { quiet:'kín đáo', balanced:'cân bằng', expressive:'nổi bật' },
    occasion: { everyday:'hằng ngày', evening:'buổi tối', gift:'quà tặng', exploration:'khám phá' }
  };

  const steps = [
    {
      key:'family', title:'Trực giác của bạn', kicker:'01 · Lực hút mùi hương',
      question:'Bạn bị kéo về thế giới mùi hương nào trước tiên?',
      help:'Không cần nghĩ quá kỹ. Chọn nhóm mùi khiến bạn muốn ngửi lại lần thứ hai.',
      options:[
        ['floral','Hoa cỏ','Iris, violet, cánh hoa · mềm và có chiều sâu'],
        ['woody','Gỗ','Sandalwood, cedar, fig · khô, ấm, bình tĩnh'],
        ['amber','Hổ phách','Resin, saffron, tonka · ấm và giàu hiện diện'],
        ['fresh','Tươi sáng','Neroli, citrus, nốt xanh · sáng và thoáng'],
        ['musk','Xạ hương da','Ambrette, xạ hương mềm · gần da và riêng tư']
      ]
    },
    {
      key:'mood', title:'Cảm giác bạn muốn', kicker:'02 · Sắc thái cảm xúc',
      question:'Bạn muốn mùi hương khiến mình cảm thấy thế nào?',
      help:'Violet ưu tiên cảm giác khi sử dụng hơn các thuật ngữ kỹ thuật của nước hoa.',
      options:[
        ['clean','Sạch thoáng','Sạch, sáng, nhẹ đầu — như áo sơ mi vừa giặt'],
        ['intimate','Gần da','Kín đáo, chỉ người ở gần mới nhận ra'],
        ['mysterious','Bí ẩn','Tối hơn, có độ kéo, không kể hết câu chuyện ngay'],
        ['warm','Ấm áp','Ấm, mềm, có cảm giác ôm lấy da'],
        ['soft','Mềm mại','Mịn, phấn hoặc thoáng nhẹ — hiện diện vừa đủ'],
        ['bright','Rạng sáng','Tươi, linh hoạt, có năng lượng nhưng không chói']
      ]
    },
    {
      key:'presence', title:'Độ hiện diện', kicker:'03 · Mức độ lan tỏa',
      question:'Bạn muốn người khác cảm nhận mùi hương ở mức nào?',
      help:'Đây là sở thích về độ hiện diện, không phải cam kết kỹ thuật về khả năng tỏa hương thực tế.',
      options:[
        ['quiet','Kín đáo','Một quầng hương sát da, thân mật và ít phô trương'],
        ['balanced','Cân bằng','Đủ để được nhận ra, vẫn dễ sống cùng mỗi ngày'],
        ['expressive','Nổi bật','Muốn mùi hương là một phần rõ ràng trong tổng thể hiện diện']
      ]
    },
    {
      key:'occasion', title:'Khoảnh khắc của bạn', kicker:'04 · Bối cảnh sử dụng',
      question:'Bạn đang tìm mùi hương cho khoảnh khắc nào?',
      help:'Bối cảnh giúp Violet ưu tiên mùi dễ dùng, giàu cảm xúc hoặc đáng khám phá.',
      options:[
        ['everyday','Hằng ngày','Một mùi hương chủ đạo có thể quay lại thường xuyên'],
        ['evening','Buổi tối','Bữa tối, sự kiện hoặc những đêm muốn có chiều sâu'],
        ['gift','Quà tặng','Một lựa chọn có cảm giác đặc biệt để dành tặng'],
        ['exploration','Khám phá','Muốn thử một hướng mới thay vì lặp lại gu quen thuộc']
      ]
    }
  ];

  const state = { step:0, answers:{} };
  const progressBar = document.querySelector('[data-progress-bar]');
  const stepLabel = document.querySelector('[data-step-label]');
  const stepTitle = document.querySelector('[data-step-title]');

  function renderStep() {
    const spec = steps[state.step];
    stepLabel.textContent = `Bước ${state.step + 1} / ${steps.length}`;
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
        <button type="button" data-back ${state.step===0?'disabled':''}>← Quay lại</button>
        <button type="button" class="portrait-next" data-next ${selected?'':'disabled'}>${state.step===steps.length-1?'Xem tuyển chọn Violet':'Tiếp tục →'}</button>
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
    if (product.category === state.answers.family) reasons.push(`cùng nhóm ${answerLabels.family[state.answers.family] || product.family}`);
    if (profile.moods.includes(state.answers.mood)) reasons.push(`đúng cảm giác ${answerLabels.mood[state.answers.mood] || state.answers.mood}`);
    if (profile.presence === state.answers.presence) reasons.push(`độ hiện diện ${answerLabels.presence[state.answers.presence] || state.answers.presence}`);
    if (profile.occasions.includes(state.answers.occasion)) reasons.push(`hợp với ${answerLabels.occasion[state.answers.occasion] || state.answers.occasion}`);
    return reasons.length ? `Phù hợp vì ${reasons.slice(0,3).join(', ')}.` : 'Một hướng tương phản có chủ đích để mở rộng tủ mùi hương của bạn.';
  }

  function renderResults() {
    stepLabel.textContent = 'Đã hoàn thành';
    stepTitle.textContent = 'Tuyển chọn Violet của bạn';
    progressBar.style.width = '100%';
    const candidates = DATA.products.filter(p => PROFILE[p.id]).sort((a,b) => scoreProduct(b) - scoreProduct(a)).slice(0,3);
    const labels = [
      answerLabels.family[state.answers.family],
      answerLabels.mood[state.answers.mood],
      answerLabels.presence[state.answers.presence],
      answerLabels.occasion[state.answers.occasion]
    ].filter(Boolean);

    host.innerHTML = `<div class="portrait-results">
      <div class="results-heading"><div><span class="question-kicker">Chân dung mùi hương · ${labels.join(' / ')}</span><h2>Ba mùi hương, không phải ba mươi.</h2><p>Danh sách này được xác định từ lựa chọn của bạn và dữ liệu prototype hiện có — không giả vờ là AI hay “đoán tính cách”. Hãy thử trên da trước khi chọn chai đầy đủ.</p></div><button type="button" class="portrait-restart" data-restart>Làm lại ↺</button></div>
      <div class="portrait-result-grid">
        ${candidates.map((p,i) => `<article class="portrait-result tone-${p.category}"><a href="product.html?id=${p.id}"><div class="result-media"><img src="${p.image}" alt="${p.name} của ${p.brand}"><span class="result-rank">${String(i+1).padStart(2,'0')} · phù hợp với Violet</span></div></a><div class="result-copy"><span class="result-house">${p.brand}</span><h3>${p.name}</h3><p class="result-why">${why(p)}</p><div class="result-meta"><span>${p.family}</span><span>${money(p.price)}</span></div><a class="result-action" href="product.html?id=${p.id}">Xem mùi hương →</a></div></article>`).join('')}
      </div>
      <aside class="portrait-discovery"><div><span>Thử trước khi chọn chai đầy đủ</span><strong>Vẫn đang cân nhắc? Hãy tạo một nghi thức thử mùi.</strong><p>Violet Discovery Wardrobe cho phép thử nhiều hướng mùi trên da trước khi cam kết với chai đầy đủ — phù hợp với cách nước hoa thực sự thay đổi theo thời gian.</p></div><a class="btn" href="discovery.html">Tạo bộ ba thử mùi</a></aside>
    </div>`;
    host.querySelector('[data-restart]').addEventListener('click', () => { state.step = 0; state.answers = {}; renderStep(); });
  }

  renderStep();
})();