(() => {
  const host = document.querySelector('[data-portrait-stage]');
  if (!host) return;

  const DATA = window.VIOLET_DATA || { products: [] };
  const money = n => `${new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(Number(n || 0))} €`;

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
      question:'Which scent world pulls you in first?',
      help:'Do not overthink it. Choose the family that makes you want to lean in for a second smell.',
      options:[
        ['floral','Floral','Iris, violet and petals · soft with depth'],
        ['woody','Woods','Sandalwood, cedar and fig · dry, warm and composed'],
        ['amber','Amber','Resin, saffron and tonka · warm with richer presence'],
        ['fresh','Fresh','Neroli, citrus and green notes · bright and airy'],
        ['musk','Skin Musk','Ambrette and soft musk · intimate and close to skin']
      ]
    },
    {
      key:'mood', title:'Your mood', kicker:'02 · Emotional register',
      question:'How do you want the fragrance to make you feel?',
      help:'Violet prioritizes the wearing experience over perfumery jargon.',
      options:[
        ['clean','Clean','Lucid, light and composed — like a freshly pressed shirt'],
        ['intimate','Intimate','Close to skin, restrained and noticed only nearby'],
        ['mysterious','Mysterious','Darker, more magnetic and slow to reveal itself'],
        ['warm','Warm','Soft, enveloping and gently radiant on skin'],
        ['soft','Soft','Powdered or airy with a quiet presence'],
        ['bright','Bright','Fresh, mobile and energetic without becoming sharp']
      ]
    },
    {
      key:'presence', title:'Your presence', kicker:'03 · Sillage preference',
      question:'How clearly should other people notice the fragrance?',
      help:'This is a preference for perceived presence, not a technical promise about real-world projection.',
      options:[
        ['quiet','Quiet','A skin-level aura that stays intimate and understated'],
        ['balanced','Balanced','Noticeable without taking over the room'],
        ['expressive','Expressive','Fragrance becomes a clear part of your overall presence']
      ]
    },
    {
      key:'occasion', title:'Your ritual', kicker:'04 · Context',
      question:'What kind of moment are you choosing for?',
      help:'Context helps Violet prioritize ease, emotion or exploration.',
      options:[
        ['everyday','Everyday','A signature direction you can return to often'],
        ['evening','Evening','Dinner, events or nights that call for more depth'],
        ['gift','Gift','A direction that feels considered and gift-worthy'],
        ['exploration','Exploration','A new scent territory rather than a repeat of your usual taste']
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
    if (product.category === state.answers.family) reasons.push(`the ${product.family} family matches your first instinct`);
    if (profile.moods.includes(state.answers.mood)) reasons.push(`it supports a ${state.answers.mood} mood`);
    if (profile.presence === state.answers.presence) reasons.push(`its prototype profile is ${state.answers.presence}`);
    if (profile.occasions.includes(state.answers.occasion)) reasons.push(`it fits your ${state.answers.occasion} context`);
    return reasons.length ? `Selected because ${reasons.slice(0,3).join(', ')}.` : 'A deliberate contrast chosen to widen your scent wardrobe.';
  }

  function renderResults() {
    stepLabel.textContent = 'Portrait complete';
    stepTitle.textContent = 'Your Violet Edit';
    progressBar.style.width = '100%';
    const candidates = DATA.products.filter(p => PROFILE[p.id]).sort((a,b) => scoreProduct(b) - scoreProduct(a)).slice(0,3);
    const labels = { family:state.answers.family, mood:state.answers.mood, presence:state.answers.presence, occasion:state.answers.occasion };

    host.innerHTML = `<div class="portrait-results">
      <div class="results-heading"><div><span class="question-kicker">Your Scent Portrait · ${Object.values(labels).join(' / ')}</span><h2>Three scents, not thirty.</h2><p>This shortlist is a deterministic recommendation based on your choices and the prototype catalogue metadata. It is not AI personality prediction. Wear a direction on skin before choosing a full bottle.</p></div><button type="button" class="portrait-restart" data-restart>Start again ↺</button></div>
      <div class="portrait-result-grid">
        ${candidates.map((p,i) => `<article class="portrait-result tone-${p.category}"><a href="product.html?id=${p.id}"><div class="result-media"><img src="${p.image}" alt="${p.name} by ${p.brand}"><span class="result-rank">${String(i+1).padStart(2,'0')} · Violet match</span></div></a><div class="result-copy"><span class="result-house">${p.brand}</span><h3>${p.name}</h3><p class="result-why">${why(p)}</p><div class="result-meta"><span>${p.family}</span><span>${money(p.price)}</span></div><a class="result-action" href="product.html?id=${p.id}">Explore fragrance →</a></div></article>`).join('')}
      </div>
      <aside class="portrait-discovery"><div><span>Try before full bottle</span><strong>Turn the shortlist into a trial ritual.</strong><p>Build a representative trio and wear each direction separately before returning to the bottle that still feels right after the drydown.</p></div><a class="btn" href="discovery.html">Build a trial trio</a></aside>
    </div>`;
    host.querySelector('[data-restart]').addEventListener('click', () => { state.step = 0; state.answers = {}; renderStep(); });
  }

  renderStep();
})();