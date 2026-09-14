(() => {
  const PROFILE_KEY = 'violet-scent-profile-v2';
  const FEEDBACK_KEY = 'violet-sample-feedback-v1';
  const TRIO_KEY = 'violet-discovery-trio-v1';
  const CART_KEY = 'violet-marketplace-cart-v1';

  const META = {
    'violette-03': {moods:['intimate','soft','evening'], sweetness:1, freshness:1, projection:'quiet', occasions:['everyday','evening'], weather:['cool','mild','indoors'], cues:['violet','iris','powder','sandalwood'], sample:true},
    'velours-ambre': {moods:['warm','mysterious','evening'], sweetness:2, freshness:0, projection:'expressive', occasions:['evening','special'], weather:['cool','indoors'], cues:['amber','saffron','resin','tonka'], sample:true},
    'iris-haze': {moods:['clean','soft','calm'], sweetness:0, freshness:2, projection:'quiet', occasions:['everyday','work'], weather:['warm','mild','humid'], cues:['iris','tea','cedar','air'], sample:true},
    'santal-veil': {moods:['warm','intimate','calm'], sweetness:0, freshness:1, projection:'balanced', occasions:['everyday','evening'], weather:['cool','mild','indoors'], cues:['sandalwood','fig','musk','woods'], sample:true},
    'neroli-rain': {moods:['clean','bright','energetic'], sweetness:0, freshness:3, projection:'balanced', occasions:['everyday','work','outdoors'], weather:['warm','humid','outdoors'], cues:['neroli','citrus','green','petitgrain'], sample:true},
    'peau-de-lune': {moods:['intimate','clean','soft'], sweetness:1, freshness:1, projection:'quiet', occasions:['everyday','close'], weather:['mild','indoors'], cues:['musk','ambrette','rice','iris'], sample:true},
    'nuit-de-figue': {moods:['mysterious','warm','contemplative'], sweetness:1, freshness:1, projection:'balanced', occasions:['evening','special'], weather:['cool','mild'], cues:['fig','tea','cedar','vetiver'], sample:true}
  };

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const data = () => window.VIOLET_DATA || { products: [], categories: [] };
  const productById = id => data().products.find(product => product.id === id);
  const metaFor = id => META[id] || {moods:[], sweetness:1, freshness:1, projection:'balanced', occasions:[], weather:[], cues:[], sample:false};
  const textFor = product => [product?.name, product?.brand, product?.family, product?.description, ...(Object.values(product?.notes || {})), ...(metaFor(product?.id).cues || [])].filter(Boolean).join(' ').toLowerCase();

  function getProfile(){ return read(PROFILE_KEY, {}); }
  function saveProfile(profile){ write(PROFILE_KEY, {...profile, updatedAt:new Date().toISOString(), system:'deterministic-rule-prototype'}); }
  function getFeedback(){ return read(FEEDBACK_KEY, {}); }
  function saveFeedback(productId, feedback){ const all=getFeedback(); all[productId]={...feedback,updatedAt:new Date().toISOString()}; write(FEEDBACK_KEY,all); return all; }
  function getTrio(){ return read(TRIO_KEY, []).filter(id => productById(id) && metaFor(id).sample).slice(0,3); }
  function setTrio(ids){ write(TRIO_KEY,[...new Set(ids)].filter(id => productById(id) && metaFor(id).sample).slice(0,3)); }
  function addToCart(id, qty=1){ const cart=read(CART_KEY,[]); const row=cart.find(item=>item.id===id); if(row) row.qty+=qty; else cart.push({id,qty}); write(CART_KEY,cart); document.querySelectorAll('.cart-count').forEach(node=>node.textContent=cart.reduce((sum,item)=>sum+Number(item.qty||0),0)); return cart; }

  function feedbackWeight(product, feedback){
    const own = feedback[product.id];
    let score = 0;
    if(own){ score += ({love:6,like:3,neutral:0,dislike:-6}[own.sentiment] || 0); }
    const meta=metaFor(product.id);
    Object.entries(feedback).forEach(([id,row])=>{
      if(id===product.id) return;
      const other=productById(id); if(!other) return;
      const otherMeta=metaFor(id);
      const positive=row.sentiment==='love'||row.sentiment==='like';
      const negative=row.sentiment==='dislike';
      if(other.category===product.category) score += positive?1.4:negative?-1.8:0;
      if(otherMeta.moods.some(m=>meta.moods.includes(m))) score += positive?.7:negative?-.8:0;
      if((row.tags||[]).includes('too-sweet') && meta.sweetness>=2) score -= 2.5;
      if((row.tags||[]).includes('too-heavy') && meta.projection==='expressive') score -= 2.5;
      if((row.tags||[]).includes('too-light') && meta.projection==='quiet') score -= 1.8;
      if((row.tags||[]).includes('not-for-me') && other.category===product.category) score -= 2.2;
    });
    return score;
  }

  function scoreProduct(product, profile=getProfile(), feedback=getFeedback()){
    const meta=metaFor(product.id); if(!meta.sample) return -999;
    let score = 0;
    if(profile.family && product.category===profile.family) score += 6;
    if(profile.mood && meta.moods.includes(profile.mood)) score += 4;
    if(profile.projection && meta.projection===profile.projection) score += 3;
    if(profile.occasion && meta.occasions.includes(profile.occasion)) score += 2.5;
    if(profile.weather && meta.weather.includes(profile.weather)) score += 2;
    const sweet=Number(profile.sweetness); if(Number.isFinite(sweet)) score += Math.max(0,3-Math.abs(meta.sweetness-sweet));
    const fresh=Number(profile.freshness); if(Number.isFinite(fresh)) score += Math.max(0,3-Math.abs(meta.freshness-fresh));
    const disliked=(profile.dislikedNotes||[]).map(v=>String(v).toLowerCase()).filter(Boolean);
    const text=textFor(product);
    disliked.forEach(note=>{ if(text.includes(note)) score -= 5; });
    const familiar=(profile.familiarScents||'').toLowerCase().split(/[,;/]+/).map(v=>v.trim()).filter(v=>v.length>2);
    familiar.forEach(term=>{ if(text.includes(term)) score += 1.5; });
    score += feedbackWeight(product,feedback);
    score += Number(product.rating||0)*.04;
    return score;
  }

  function feedbackEvidence(product, feedback=getFeedback()){
    const meta=metaFor(product.id); const evidence=[];
    Object.entries(feedback).forEach(([id,row])=>{
      const other=productById(id); if(!other) return;
      const otherMeta=metaFor(id);
      if((row.sentiment==='love'||row.sentiment==='like') && other.category===product.category) evidence.push(`you ${row.sentiment}d ${other.name}, another ${other.family} direction`);
      if((row.tags||[]).includes('too-sweet') && meta.sweetness<=1) evidence.push(`your feedback asked for less sweetness`);
      if((row.tags||[]).includes('too-heavy') && meta.projection!=='expressive') evidence.push(`your feedback asked for a lighter presence`);
    });
    return evidence;
  }

  function reasonsFor(product, profile=getProfile(), feedback=getFeedback()){
    const meta=metaFor(product.id); const reasons=[];
    if(profile.family && product.category===profile.family) reasons.push(`${product.family} matches your preferred scent family`);
    if(profile.mood && meta.moods.includes(profile.mood)) reasons.push(`${profile.mood} matches the mood you chose`);
    if(profile.projection && meta.projection===profile.projection) reasons.push(`${profile.projection} presence matches your projection preference`);
    if(profile.occasion && meta.occasions.includes(profile.occasion)) reasons.push(`suited to your ${profile.occasion} intent`);
    if(profile.weather && meta.weather.includes(profile.weather)) reasons.push(`fits the ${profile.weather} context you selected`);
    const sweetness=Number(profile.sweetness); if(Number.isFinite(sweetness) && Math.abs(meta.sweetness-sweetness)<=1) reasons.push(`sweetness level stays close to your preference`);
    const freshness=Number(profile.freshness); if(Number.isFinite(freshness) && Math.abs(meta.freshness-freshness)<=1) reasons.push(`freshness level stays close to your preference`);
    const disliked=(profile.dislikedNotes||[]).map(v=>v.toLowerCase());
    if(disliked.length && !disliked.some(note=>textFor(product).includes(note))) reasons.push(`avoids the disliked notes saved in this portrait`);
    reasons.push(...feedbackEvidence(product,feedback));
    return [...new Set(reasons)].slice(0,4);
  }

  function recommendations(profile=getProfile()){
    const feedback=getFeedback();
    return data().products.filter(p=>metaFor(p.id).sample).map(product=>({product,score:scoreProduct(product,profile,feedback),reasons:reasonsFor(product,profile,feedback)})).sort((a,b)=>b.score-a.score).slice(0,3);
  }

  function similarity(aId,bId){
    const a=productById(aId),b=productById(bId); if(!a||!b) return {score:0,reasons:[]};
    const am=metaFor(aId),bm=metaFor(bId); let score=0; const reasons=[];
    if(a.category===b.category){score+=3;reasons.push(`both sit in ${a.family || a.category}`);}
    const sharedMood=am.moods.find(m=>bm.moods.includes(m)); if(sharedMood){score+=2;reasons.push(`both lean ${sharedMood}`);}
    if(am.projection===bm.projection){score+=1;reasons.push(`both have ${am.projection} presence`);}
    if(Math.abs(am.sweetness-bm.sweetness)===0){score+=1;}
    return {score,reasons};
  }

  function trioBalance(ids=getTrio()){
    const products=ids.map(productById).filter(Boolean); const families=[...new Set(products.map(p=>p.category))]; const moods=[...new Set(products.flatMap(p=>metaFor(p.id).moods.slice(0,2)))];
    const overlaps=[]; for(let i=0;i<ids.length;i++) for(let j=i+1;j<ids.length;j++){ const sim=similarity(ids[i],ids[j]); if(sim.score>=5) overlaps.push({a:ids[i],b:ids[j],...sim}); }
    return {families,moods,overlaps,diversity:ids.length?Math.min(100,Math.round((families.length/ids.length)*65 + Math.min(moods.length,3)/3*35)):0};
  }

  window.VIOLET_PERSONALIZATION = {PROFILE_KEY,FEEDBACK_KEY,TRIO_KEY,CART_KEY,META,getProfile,saveProfile,getFeedback,saveFeedback,getTrio,setTrio,addToCart,productById,metaFor,scoreProduct,reasonsFor,recommendations,similarity,trioBalance};
})();
