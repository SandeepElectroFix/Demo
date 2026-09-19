(()=>{
  'use strict';

  const C=window.APP_CONFIG||{};
  const M=Array.isArray(window.MATERIALS)?window.MATERIALS:[];
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const storeKey=C.storageKey||'sandeepEstimateItems';
  const langKey=C.languageKey||'sandeepMaterialLang';
  const viewKey=C.viewKey||'sandeepMaterialView';
  const themeKey=C.themeKey||'sandeepTheme';

  let lang=localStorage.getItem(langKey)||C.defaultLanguage||'hi';
  let page='home';
  let currentStage=-1;
  let currentIndex=-1;
  let view=localStorage.getItem(viewKey)||'grid';
  let lastValues={};

  const TEXT={
    hi:{home:'होम',estimate:'एस्टिमेट',calculator:'कैलकुलेटर',settings:'सेटिंग्स',menu:'मेन्यू',items:'आइटम',open:'खोलें',back:'वापस',quantity:'मात्रा',unit:'यूनिट',brand:'ब्रांड',optional:'वैकल्पिक',add:'एस्टिमेट में जोड़ें',added:'एस्टिमेट में जोड़ा गया',required:'मात्रा भरना जरूरी है',other:'बाकी सभी फ़ील्ड वैकल्पिक हैं',price:'कीमत',addPrice:'कीमत जोड़ें',hidePrice:'कीमत छुपाएँ',noItems:'अभी कोई आइटम नहीं जोड़ा गया',clear:'एस्टिमेट साफ करें',saved:'सेव आइटम',dark:'Dark Theme',light:'Light Theme',grid:'Grid',list:'List',compact:'Compact',power:'Power (W)',voltage:'Voltage (V)',current:'Current',calcHint:'Power और Voltage भरें',reset:'Reset saved estimate'},
    en:{home:'Home',estimate:'Estimate',calculator:'Calculator',settings:'Settings',menu:'Menu',items:'Items',open:'Open',back:'Back',quantity:'Quantity',unit:'Unit',brand:'Brand',optional:'optional',add:'Add to Estimate',added:'Added to Estimate',required:'Quantity is required',other:'All other fields are optional',price:'Price',addPrice:'Add Price',hidePrice:'Hide Price',noItems:'No items added yet',clear:'Clear Estimate',saved:'saved items',dark:'Dark Theme',light:'Light Theme',grid:'Grid',list:'List',compact:'Compact',power:'Power (W)',voltage:'Voltage (V)',current:'Current',calcHint:'Enter Power and Voltage',reset:'Reset saved estimate'}
  };
  const t=k=>(TEXT[lang]||TEXT.en)[k]||k;

  function readItems(){try{return JSON.parse(localStorage.getItem(storeKey)||'[]')}catch{return[]}}
  function writeItems(a){localStorage.setItem(storeKey,JSON.stringify(a))}
  function esc(x){return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function stageItems(s){
    const direct=Array.isArray(s[3])?s[3]:[];
    const groups=Array.isArray(s[4])?s[4]:[];
    return [...direct,...groups.flatMap(g=>Array.isArray(g?.[1])?g[1]:[])];
  }
  function allItems(){return M.flatMap((s,si)=>stageItems(s).map((it,i)=>({stage:s[0],stageName:s[1],item:it,si,i})))}

  function applyConfig(){
    const u=C.ui||{};
    const ids={menuBtn:u.menu,drawer:u.menu,langBtn:u.languageButton,bottomNav:u.bottomNav};
    Object.entries(ids).forEach(([id,show])=>{const el=document.getElementById(id);if(el)el.style.display=show?'':'none'});
    document.body.dataset.theme=localStorage.getItem(themeKey)||'dark';
    const splash=$('#splash'); if(splash) splash.style.display=u.splash?'':'none';
  }

  function render(){
    applyConfig();
    const main=$('#main');
    if(!main)return;
    if(page==='home')main.innerHTML=home();
    else if(page==='stage')renderStage();
    else if(page==='item')renderItem();
    else if(page==='estimate')main.innerHTML=(C.ui?.estimate===false?home():estimate());
    else if(page==='calculator')main.innerHTML=(C.ui?.calculator===false?home():calculator());
    else main.innerHTML=(C.ui?.settings===false?home():settings());
    bindCommon();
  }

  function bindCommon(){
    $$('[data-page]').forEach(b=>b.onclick=()=>{const p=b.dataset.page;if(p==='estimate'&&!C.ui?.estimate)return;if(p==='calculator'&&!C.ui?.calculator)return;if(p==='settings'&&!C.ui?.settings)return;page=p;closeDrawer();render()});
    const langBtn=$('#langBtn'); if(langBtn&&C.ui?.languageButton!==false)langBtn.onclick=()=>{lang=lang==='hi'?'en':'hi';localStorage.setItem(langKey,lang);render()};
    const menu=$('#menuBtn'); if(menu&&C.ui?.menu!==false)menu.onclick=openDrawer;
    const close=$('#closeMenu'); if(close)close.onclick=closeDrawer;
    $('#drawer')?.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=b.dataset.page;closeDrawer();render()});
  }
  function openDrawer(){const d=$('#drawer');if(d){d.classList.add('open');d.setAttribute('aria-hidden','false')}}
  function closeDrawer(){const d=$('#drawer');if(d){d.classList.remove('open');d.setAttribute('aria-hidden','true')}}

  function home(){
    return `<section class="page"><div class="hero"><span>POWERING YOUR TRUST</span><h1>Material Estimate</h1><p>${allItems().length} configured material entries</p></div><div class="stageGrid">${M.map((s,i)=>`<button class="stageCard" data-stage="${i}" type="button"><small>${esc(s[0])}</small><b>${esc(s[1])}</b><span>${stageItems(s).length} ${t('items')}</span></button>`).join('')}</div></section>`;
  }

  function renderStage(){
    const s=M[currentStage];
    if(!s){page='home';return render()}
    const items=stageItems(s);
    $('#main').innerHTML=`<section class="page"><button class="back" id="backStage" type="button">← ${t('back')}</button><div class="hero compact"><small>${esc(s[0])}</small><h1>${esc(s[1])}</h1><p>${items.length} ${t('items')}</p></div>${C.ui?.viewSwitch!==false?`<div class="viewBar"><span>${t('items')}</span><div class="viewSwitch"><button data-view="grid" class="${view==='grid'?'active':''}" type="button">▦ ${t('grid')}</button><button data-view="list" class="${view==='list'?'active':''}" type="button">☷ ${t('list')}</button><button data-view="compact" class="${view==='compact'?'active':''}" type="button">▪ ${t('compact')}</button></div></div>`:''}<div class="itemGrid ${view}">${items.map((it,i)=>`<button class="itemCard" data-item-index="${i}" type="button"><div class="itemImage" aria-hidden="true"></div><b>${esc(it[0])}</b><span>${t('open')}</span></button>`).join('')}</div></section>`;
    $('#backStage').onclick=()=>{page='home';render()};
    $$('.itemCard').forEach(b=>b.onclick=()=>{currentIndex=+b.dataset.itemIndex;page='item';render()});
    $$('[data-stage]').forEach(b=>b.onclick=()=>{currentStage=+b.dataset.stage;currentIndex=-1;page='stage';render()});
    $$('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;localStorage.setItem(viewKey,view);renderStage()});
  }

  function fieldHtml(f,i){
    const label=f[0],opts=Array.isArray(f[1])?f[1]:[];
    if(opts.length===1 && /^User Input/i.test(String(opts[0])))return `<label class="field"><span>${esc(label)}</span><input data-field="${i}" data-label="${esc(label)}" placeholder="${esc(opts[0])}"></label>`;
    return `<div class="field"><span>${esc(label)}</span><div class="choices">${opts.map(o=>`<button type="button" class="choice" data-label="${esc(label)}" data-value="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`;
  }

  function renderItem(){
    const s=M[currentStage],items=stageItems(s),it=items[currentIndex];
    if(!it){page='stage';return render()}
    const [name,fields=[],units=[],brands=[]]=it;
    const prev=lastValues[`${s[0]}::${name}`]||{};
    $('#main').innerHTML=`<section class="page"><button class="back" id="backItem" type="button">← ${t('back')}</button><div class="itemHead"><div class="itemImage big" aria-hidden="true"></div><div><small>${esc(s[0])}</small><h1>${esc(name)}</h1></div></div><div class="formCard">${fields.map(fieldHtml).join('')}<label class="field"><span>${t('quantity')} *</span><input id="qty" type="number" min="0.01" step="any" inputmode="decimal" placeholder="${esc(t('quantity'))}"></label><label class="field"><span>${t('unit')}</span><select id="unit"><option value="">— ${t('optional')} —</option>${units.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></label>${C.ui?.priceField!==false?`<div class="priceWrap"><button id="priceToggle" class="priceToggle" type="button">＋ ${esc(t('addPrice'))}</button><div id="priceBox" class="priceBox" hidden><label class="field"><span>${t('price')} (${t('optional')})</span><input id="price" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00"></label><button id="priceHide" class="miniBtn" type="button">${esc(t('hidePrice'))}</button></div></div>`:''}<label class="field"><span>${t('brand')} <em>(${t('optional')})</em></span><select id="brand"><option value="">— ${t('optional')} —</option>${(C.rules?.skipBrandOption?['Skip Brand',...brands]:brands).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></label><button id="add" class="primary" type="button">✓ ${esc(t('add'))}</button><p class="hint">${esc(t('required'))}. ${esc(t('other'))}.</p></div></section>`;

    // Carry forward selections, never quantity.
    $$('[data-value]').forEach(btn=>{if(prev[btn.dataset.label]===btn.dataset.value)btn.classList.add('selected')});
    $$('[data-field]').forEach(input=>{if(prev[input.dataset.label])input.value=prev[input.dataset.label]});
    if(prev.unit)$('#unit').value=prev.unit;
    if(prev.brand)$('#brand').value=prev.brand;

    $$('.choice').forEach(x=>x.onclick=()=>{x.parentElement.querySelectorAll('.choice').forEach(y=>y.classList.remove('selected'));x.classList.add('selected')});
    $('#backItem').onclick=()=>{if(currentIndex>0){currentIndex--;render()}else{page='stage';render()}};
    $('#add').onclick=addCurrent;
    $('#priceToggle')?.addEventListener('click',()=>{$('#priceBox').hidden=false;$('#priceToggle').hidden=true;$('#price')?.focus()});
    $('#priceHide')?.addEventListener('click',()=>{$('#priceBox').hidden=true;$('#priceToggle').hidden=false});
  }

  function addCurrent(){
    const qty=$('#qty')?.value.trim();
    if(C.rules?.quantityRequired!==false && (!qty||Number(qty)<=0)){
      $('#qty')?.classList.add('error');$('#qty')?.focus();toast(t('required'));return;
    }
    const s=M[currentStage],it=stageItems(s)[currentIndex];
    const [name]=it;
    const options={};
    $$('.choice.selected').forEach(x=>options[x.dataset.label]=x.dataset.value);
    $$('[data-field]').forEach(x=>options[x.dataset.label]=x.value.trim());
    const unit=$('#unit')?.value||'',brand=$('#brand')?.value||'',price=$('#price')?.value.trim()||'';
    lastValues[`${s[0]}::${name}`]={...options,unit,brand};
    const data={id:Date.now(),stage:s[0],stageName:s[1],item:name,qty:String(qty||''),unit,brand,price,options,createdAt:new Date().toISOString()};
    const a=readItems();a.push(data);writeItems(a);
    toast(t('added'));
    if(currentIndex<stageItems(s).length-1){currentIndex++;setTimeout(render,260)}else{page='stage';currentIndex=-1;setTimeout(render,260)}
  }

  function estimate(){
    const a=readItems();
    return `<section class="page"><div class="hero compact"><h1>${esc(t('estimate'))}</h1><p>${a.length} ${esc(t('saved'))}</p></div>${a.length?`<div class="estimateList">${a.map(x=>`<article><div><b>${esc(x.item)}</b><span>${esc(x.qty)}${x.unit?' '+esc(x.unit):''}${x.brand?' • '+esc(x.brand):''}</span></div>${x.price!==''?`<strong>₹ ${esc(x.price)}</strong>`:''}</article>`).join('')}</div><button class="danger" id="clear" type="button">${esc(t('clear'))}</button>`:`<div class="empty">${esc(t('noItems'))}</div>`}</section>`;
  }

  function calculator(){
    return `<section class="page"><div class="hero compact"><h1>${esc(t('calculator'))}</h1><p>Power • Voltage • Current</p></div><div class="calcCard"><label>${esc(t('power'))}<input id="pw" type="number" inputmode="decimal"></label><label>${esc(t('voltage'))}<input id="vo" type="number" inputmode="decimal"></label><button class="primary" id="calc" type="button">${esc(t('calculator'))}</button><div id="ans" class="answer">I = P ÷ V</div></div></section>`;
  }

  function settings(){
    const dark=(localStorage.getItem(themeKey)||'dark')==='dark';
    return `<section class="page"><div class="hero compact"><h1>${esc(t('settings'))}</h1></div><div class="settingsCard"><label class="toggle"><input id="themeToggle" type="checkbox" ${dark?'checked':''}> ${esc(t('dark'))}</label><button class="secondary" id="reset" type="button">${esc(t('reset'))}</button></div></section>`;
  }

  function toast(text){const x=document.createElement('div');x.className='toast';x.textContent=text;document.body.appendChild(x);setTimeout(()=>x.remove(),1200)}

  document.addEventListener('click',e=>{
    if(e.target.matches('[data-stage]')){currentStage=+e.target.dataset.stage;currentIndex=-1;page='stage';render()}
    if(e.target.id==='clear'){localStorage.removeItem(storeKey);render()}
    if(e.target.id==='reset'){localStorage.removeItem(storeKey);render()}
    if(e.target.id==='calc'){const p=Number($('#pw')?.value),v=Number($('#vo')?.value);$('#ans').textContent=p>0&&v>0?`${t('current')} = ${(p/v).toFixed(2)} A`:t('calcHint')}
    if(e.target.id==='themeToggle'){const dark=e.target.checked;localStorage.setItem(themeKey,dark?'dark':'light');applyConfig()}
  });

  // Close splash after the app is actually rendered; avoids the old stuck-screen issue.
  function boot(){
    render();
    const splash=$('#splash');
    if(splash && C.ui?.splash!==false){setTimeout(()=>{splash.classList.add('hide');setTimeout(()=>splash.remove(),350)},650)}else splash?.remove();
  }
  window.render=render;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
