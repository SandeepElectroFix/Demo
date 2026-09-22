(()=>{
"use strict";
const C=window.APP_CONFIG||{};const M=Array.isArray(window.MATERIALS)?window.MATERIALS:[];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const storeKey=C.storageKey||"sandeepEstimateItems",langKey=C.languageKey||"sandeepMaterialLang",viewKey=C.viewKey||"sandeepMaterialView",themeKey=C.themeKey||"sandeepTheme";
let lang=localStorage.getItem(langKey)||C.defaultLanguage||"hi",page="home",stageIndex=-1,itemIndex=-1,view=localStorage.getItem(viewKey)||"grid",draft={};
const T={hi:{home:"होम",estimate:"एस्टिमेट",calculator:"कैलकुलेटर",settings:"सेटिंग्स",items:"आइटम",open:"खोलें",back:"वापस",quantity:"मात्रा",unit:"यूनिट",brand:"ब्रांड",optional:"वैकल्पिक",add:"एस्टिमेट में जोड़ें",added:"एस्टिमेट में जोड़ा गया",required:"मात्रा भरना जरूरी है",clear:"एस्टिमेट साफ करें",empty:"अभी कोई आइटम नहीं जोड़ा गया",search:"सामग्री खोजें",dark:"Dark",light:"Light",calculate:"Calculate",power:"Power (W)",voltage:"Voltage (V)",current:"Current (A)",resistance:"Resistance (Ω)",formula:"Formula",reset:"Saved estimate reset करें",edit:"Edit",delete:"Delete",next:"Next",prev:"Previous"},en:{home:"Home",estimate:"Estimate",calculator:"Calculator",settings:"Settings",items:"Items",open:"Open",back:"Back",quantity:"Quantity",unit:"Unit",brand:"Brand",optional:"optional",add:"Add to Estimate",added:"Added to Estimate",required:"Quantity is required",clear:"Clear Estimate",empty:"No items added yet",search:"Search materials",dark:"Dark",light:"Light",calculate:"Calculate",power:"Power (W)",voltage:"Voltage (V)",current:"Current (A)",resistance:"Resistance (Ω)",formula:"Formula",reset:"Reset saved estimate",edit:"Edit",delete:"Delete",next:"Next",prev:"Previous"}};
const t=k=>(T[lang]||T.en)[k]||k;const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function itemsOf(s){return [...(Array.isArray(s?.[3])?s[3]:[]),...(Array.isArray(s?.[4])?s[4]:[]).flatMap(g=>Array.isArray(g?.[1])?g[1]:[])];}
function read(){try{return JSON.parse(localStorage.getItem(storeKey)||"[]")}catch{return[]}}function save(a){localStorage.setItem(storeKey,JSON.stringify(a))}
function toast(x){const e=document.createElement("div");e.className="toast";e.textContent=x;document.body.appendChild(e);setTimeout(()=>e.remove(),1600)}
function theme(){document.body.dataset.theme=localStorage.getItem(themeKey)||C.theme?.default||"dark"}
function applyCommon(){theme();const u=C.ui||{};[[$("#menuBtn"),u.menu],[$("#langBtn"),u.languageButton],[$("#bottomNav"),u.bottomNav]].forEach(([e,on])=>{if(e)e.style.display=on===false?"none":""});$$("#bottomNav [data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));}
function nav(){ $$('[data-page]').forEach(b=>b.onclick=()=>{page=b.dataset.page;closeDrawer();render()}); $("#menuBtn")?.addEventListener("click",openDrawer);$("#closeMenu")?.addEventListener("click",closeDrawer);$("#drawerOverlay")?.addEventListener("click",closeDrawer);$("#langBtn")?.addEventListener("click",()=>{lang=lang==="hi"?"en":"hi";localStorage.setItem(langKey,lang);render()}); }
function openDrawer(){$("#drawer")?.classList.add("open");$("#drawerOverlay")?.classList.add("show");$("#drawer")?.setAttribute("aria-hidden","false")}function closeDrawer(){$("#drawer")?.classList.remove("open");$("#drawerOverlay")?.classList.remove("show");$("#drawer")?.setAttribute("aria-hidden","true")}
function home(){return `<section class="page"><div class="hero"><div class="heroLogo">SE</div><h1>${esc(C.businessName||"Sandeep ElectroFix")}</h1><div class="tagline">${esc(C.tagline||"Powering Your Trust")}</div><p>${esc(C.appName||"Estimate List")} • ${M.reduce((n,s)=>n+itemsOf(s).length,0)} ${t("items")}</p></div>${C.ui?.search!==false?`<div class="searchBox">⌕<input id="search" placeholder="${esc(t("search"))}" autocomplete="off"><button id="clearSearch" type="button">×</button></div>`:""}<div id="stageGrid" class="stageGrid">${M.map((s,i)=>`<button class="stageCard" data-stage="${i}" type="button"><span class="stageNo">${esc(s[0])}</span><b>${esc(s[1])}</b><small>${esc(s[2]||"")}</small><span>${itemsOf(s).length} ${t("items")}</span></button>`).join("")}</div></section>`}
function renderHome(){ $("#main").innerHTML=home();$$("[data-stage]").forEach(b=>b.onclick=()=>{stageIndex=+b.dataset.stage;itemIndex=-1;page="stage";render()});const q=$("#search");q?.addEventListener("input",()=>filterStages(q.value));$("#clearSearch")?.addEventListener("click",()=>{q.value="";filterStages("")})}
function filterStages(q){q=q.trim().toLowerCase();$$(".stageCard").forEach(b=>{b.style.display=!q||b.textContent.toLowerCase().includes(q)?"":"none"})}function stage(){
  const s=M[stageIndex];

  if(!s){
    page="home";
    return render();
  }

  const its=itemsOf(s);

  $("#main").innerHTML=`
    <section class="page">

      <button class="back" id="backStage">
        ← ${t("back")}
      </button>

      <div class="stageHead">
        <div>
          <h1>${esc(s[1])}</h1>
          <p>${esc(s[0])} • ${its.length} ${t("items")}</p>
        </div>
      </div>

      ${C.ui?.viewSwitch!==false ? `
      <div class="viewSelector" id="viewSelector">

        <button
          class="viewSelectorHead"
          id="viewSelectorBtn"
          type="button"
          aria-expanded="false"
        >
          <span>
            <span class="viewSelectorIcon">
              ${views().find(v=>v.id===view)?.icon||"▦"}
            </span>

            <span>
              <b>View Mode</b>
              <small>${views().find(v=>v.id===view)?.name||"Grid"}</small>
            </span>
          </span>

          <span class="viewArrow">›</span>
        </button>

        <div
          class="viewOptions"
          id="viewOptions"
          hidden
        >
          ${views().map(v=>`
            <button
              class="viewOption ${view===v.id?"active":""}"
              data-view="${esc(v.id)}"
              type="button"
            >
              <span class="viewOptionIcon">${v.icon}</span>
              <span>${esc(v.name)}</span>
              ${view===v.id?`<span class="viewCheck">✓</span>`:""}
            </button>
          `).join("")}
        </div>

      </div>
      `:""}

      <div class="itemGrid ${esc(view)}">
        ${its.map((it,i)=>`
          <button
            class="itemCard"
            data-item="${i}"
            type="button"
          >
            <b>${esc(it[0])}</b>
            <span>${t("open")}</span>
          </button>
        `).join("")}
      </div>

    </section>
  `;

  $("#backStage").onclick=()=>{
    page="home";
    render();
  };

  $$('[data-item]').forEach(b=>{
    b.onclick=()=>{
      itemIndex=+b.dataset.item;
      draft={};
      page="item";
      render();
    };
  });

  /* =====================================================
     VIEW MODE DROPDOWN
     ===================================================== */

  const viewBtn=$("#viewSelectorBtn");
  const viewOptions=$("#viewOptions");
  const viewSelector=$("#viewSelector");

  viewBtn?.addEventListener("click",()=>{
    if(!viewOptions)return;

    const isOpen=!viewOptions.hidden;

    viewOptions.hidden=isOpen;
    viewBtn.setAttribute("aria-expanded",String(!isOpen));
    viewSelector?.classList.toggle("open",!isOpen);
  });

  /* =====================================================
     SELECT VIEW
     ===================================================== */

  $$('[data-view]').forEach(b=>{
    b.onclick=()=>{
      view=b.dataset.view;

      localStorage.setItem(viewKey,view);

      /*
       * Re-render immediately.
       * This automatically closes the view selector.
       */
      render();
    };
  });
}


function views(){

  const map=[
    ["grid","▦","Grid"],
    ["list","☰","List"],
    ["compact","≡","Compact"],
    ["large","▣","Large"],
    ["mini","☷","Mini"],
    ["two-column","▤","2 Column"],
    ["horizontal","↔","Horizontal"],
    ["icon-list","◉","Icon List"],
    ["timeline","⌁","Timeline"],
    ["dense","▤","Dense"]
  ];

  return map
    .filter(x=>{
      const key=x[0].replace(/-/g,"");
      return C.views?.[key]!==false;
    })
    .map(x=>({
      id:x[0],
      icon:x[1],
      name:x[2]
    }));
}
function field(label,opts){opts=Array.isArray(opts)?opts:[];if(opts.length===1&&/^User Input/i.test(String(opts[0])))return `<label class="field"><span>${esc(label)}</span><input data-input="${esc(label)}" placeholder="${esc(opts[0])}" value="${esc(draft[label]||"")}"></label>`;return `<div class="field"><span>${esc(label)}</span><div class="choices">${opts.map(o=>`<button class="choice ${draft[label]===o?"selected":""}" data-label="${esc(label)}" data-value="${esc(o)}" type="button">${esc(o)}</button>`).join("")}</div></div>`}
function item(){const s=M[stageIndex],it=itemsOf(s)[itemIndex];if(!it){page="stage";return render()}const name=it[0],fields=it[1]||[],units=it[2]||[],brands=it[3]||[];$("#main").innerHTML=`<section class="page"><button class="back" id="backItem">← ${t("back")}</button><div class="itemHead"><div><small>${esc(s[0])}</small><h1>${esc(name)}</h1></div></div><div class="formCard">${fields.map(f=>field(f[0],f[1])).join("")}<div class="field"><span>${t("quantity")} *</span><div class="qtyRow"><button id="qtyMinus" type="button">−</button><input id="qty" type="number" min="1" step="1" inputmode="numeric" value="${esc(draft.qty||"")}" placeholder="${esc(t("quantity"))}"><button id="qtyPlus" type="button">+</button></div><div class="qtyQuick"><button data-q="10">10</button><button data-q="20">20</button><button data-q="30">30</button><button data-q="50">50</button><button data-q="100">100</button></div></div><label class="field"><span>${t("unit")}</span><select id="unit"><option value="">— ${t("optional")} —</option>${units.map(x=>`<option ${draft.unit===x?"selected":""} value="${esc(x)}">${esc(x)}</option>`).join("")}</select></label>${C.ui?.price!==false?`<div class="priceWrap"><button id="priceToggle" class="priceToggle" type="button">＋ Add Price</button><div id="priceBox" class="priceBox" hidden><label class="field"><span>Price (${t("optional")})</span><input id="price" type="number" min="0" step="0.01" value="${esc(draft.price||"")}"></label></div></div>`:""}<label class="field"><span>${t("brand")} <em>(${t("optional")})</em></span><select id="brand"><option value="">— ${t("optional")} —</option>${(C.rules?.skipBrandOption?["Skip Brand",...brands]:brands).map(x=>`<option ${draft.brand===x?"selected":""} value="${esc(x)}">${esc(x)}</option>`).join("")}</select></label><button class="secondary" id="prevBtn" type="button">← ${t("prev")}</button><button class="secondary" id="nextBtn" type="button">${t("next")} →</button><button class="primary" id="addBtn" type="button">✓ ${t("add")}</button><p class="hint">${t("required")}. ${lang==="hi"?"बाकी सभी फ़ील्ड वैकल्पिक हैं":"All other fields are optional"}.</p></div></section>`;bindItem(s,name)}
function bindItem(s,name){$$('.choice').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');draft[b.dataset.label]=b.dataset.value});$$('[data-input]').forEach(e=>e.oninput=()=>draft[e.dataset.input]=e.value);const q=$("#qty");$("#qtyMinus").onclick=()=>q.value=Math.max(1,(Number(q.value)||1)-1);$("#qtyPlus").onclick=()=>q.value=(Number(q.value)||0)+1;$$('[data-q]').forEach(b=>b.onclick=()=>q.value=b.dataset.q);$("#unit").onchange=()=>draft.unit=$("#unit").value;$("#brand").onchange=()=>draft.brand=$("#brand").value;$("#price")?.addEventListener("input",e=>draft.price=e.target.value);$("#priceToggle")?.addEventListener("click",()=>{$("#priceBox").hidden=false;$("#priceToggle").hidden=true});$("#backItem").onclick=()=>{page="stage";render()};$("#prevBtn").onclick=()=>{if(itemIndex>0){syncDraft();itemIndex--;draft={};render();scrollTop()}};$("#nextBtn").onclick=()=>{if(itemIndex<itemsOf(s).length-1){syncDraft();itemIndex++;draft={};render();scrollTop()}};$("#addBtn").onclick=()=>add(s,name)}
function syncDraft(){draft.qty=$("#qty")?.value||draft.qty||"";draft.unit=$("#unit")?.value||draft.unit||"";draft.brand=$("#brand")?.value||draft.brand||"";draft.price=$("#price")?.value||draft.price||"";$$('[data-input]').forEach(e=>draft[e.dataset.input]=e.value);$$('.choice.selected').forEach(e=>draft[e.dataset.label]=e.dataset.value)}
function add(s,name){syncDraft();if(C.rules?.quantityRequired!==false&&(!draft.qty||Number(draft.qty)<=0)){toast(t("required"));$("#qty")?.focus();return}const options={...draft};delete options.qty;delete options.unit;delete options.brand;delete options.price;const a=read();a.push({id:Date.now(),stage:s[0],stageName:s[1],item:name,qty:String(draft.qty),unit:draft.unit||"",brand:draft.brand||"",price:draft.price||"",options,createdAt:new Date().toISOString()});save(a);toast(t("added"));if(C.navigation?.autoNextAfterAdd!==false&&itemIndex<itemsOf(s).length-1){itemIndex++;draft={};setTimeout(()=>{render();scrollTop()},180)}else{page="stage";itemIndex=-1;draft={};setTimeout(render,180)}}
function estimate(){const a=read();$("#main").innerHTML=`<section class="page"><div class="hero"><h1>${t("estimate")}</h1><p>${a.length} ${t("items")}</p></div>${a.length?`<div class="estimateList">${a.map((x,i)=>`<article class="estimateItem"><div class="estimateTop"><b>${esc(x.item)}</b><span>${esc(x.stage)}</span></div><div class="estimateMeta">${esc(x.qty)} ${esc(x.unit||"")}${x.brand?" • "+esc(x.brand):""}${x.price?" • ₹ "+esc(x.price):""}</div><div class="estimateActions"><button data-edit="${i}">${t("edit")}</button><button data-del="${i}">${t("delete")}</button></div></article>`).join("")}</div><button class="danger" id="clearEstimate">${t("clear")}</button>`:`<div class="empty">${t("empty")}</div>`}</section>`;$$('[data-del]').forEach(b=>b.onclick=()=>{const x=read();x.splice(+b.dataset.del,1);save(x);render()});$$('[data-edit]').forEach(b=>b.onclick=()=>editEstimate(+b.dataset.edit));$("#clearEstimate")?.addEventListener("click",()=>{if(confirm("Clear estimate?")){save([]);render()}})}
function editEstimate(i){const x=read()[i];const si=M.findIndex(s=>s[0]===x.stage),ii=itemsOf(M[si]||[]).findIndex(it=>it[0]===x.item);if(si<0||ii<0)return;stageIndex=si;itemIndex=ii;draft={...x,...x.options};page="item";render()}
function calculator(){$("#main").innerHTML=`<section class="page"><div class="hero"><h1>${t("calculator")}</h1><p>Electrical formulas</p></div><div class="formCard"><div class="calcGrid"><label class="field"><span>${t("power")}</span><input id="calcP" type="number"></label><label class="field"><span>${t("voltage")}</span><input id="calcV" type="number" value="230"></label></div><button class="primary" id="calcBtn">${t("calculate")}</button><div class="calcResult" id="calcResult">I = P ÷ V</div><div class="formula">P = V × I<br>I = P ÷ V<br>V = P ÷ I<br>R = V ÷ I</div></div></section>`;$("#calcBtn").onclick=()=>{const p=+$("#calcP").value,v=+$("#calcV").value;$("#calcResult").textContent=p>0&&v>0?`${t("current")} = ${(p/v).toFixed(2)} A`:"Enter Power and Voltage"}}
function settings(){$("#main").innerHTML=`<section class="page"><div class="hero"><h1>${t("settings")}</h1></div><div class="settingsList"><div class="settingRow toggleRow"><div><b>Theme</b><small>${t("dark")} / ${t("light")}</small></div><button id="themeBtn" class="secondary" style="width:auto">${(localStorage.getItem(themeKey)||"dark")==="dark"?t("dark"):t("light")}</button></div><div class="settingRow"><b>Language / भाषा</b><small>${lang==="hi"?"हिंदी":"English"}</small></div><div class="settingRow"><b>Material Views</b><small>${views().length} views enabled</small></div><button class="danger" id="resetApp">${t("reset")}</button></div></section>`;$("#themeBtn").onclick=()=>{localStorage.setItem(themeKey,(localStorage.getItem(themeKey)||"dark")==="dark"?"light":"dark");render()};$("#resetApp").onclick=()=>{if(confirm("Reset saved estimate and preferences?")){localStorage.removeItem(storeKey);localStorage.removeItem(langKey);localStorage.removeItem(viewKey);localStorage.removeItem(themeKey);location.reload()}}}
function scrollTop(){window.scrollTo({top:0,behavior:"instant"})}
function render(){applyCommon();if(page==="home")renderHome();else if(page==="stage")stage();else if(page==="item")item();else if(page==="estimate")estimate();else if(page==="calculator")calculator();else settings();nav()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);else render();
})();
