(()=>{"use strict";
const C=window.APP_CONFIG,M=window.MATERIALS;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const storeKey=C.storageKey, langKey=C.languageKey, viewKey=C.viewKey;
let lang=localStorage.getItem(langKey)||C.defaultLanguage, page="home", currentStage=null, currentGroup=null, currentItem=null;

function flatten(){
  const out=[];
  M.forEach((s,si)=>{
    s[2] && s[3]?.forEach((it,i)=>out.push({stage:s[0],stageName:s[1],group:s[2],item:it[0],fields:it[1],units:it[2],brands:it[3],si,i}));
    if(Array.isArray(s[4])) s[4].forEach(g=>g[1].forEach((it,i)=>out.push({stage:s[0],stageName:s[1],group:g[0],item:it[0],fields:it[1],units:it[2],brands:it[3],si,i})));
  }); return out;
}
const ALL=flatten();

function save(x){let a=JSON.parse(localStorage.getItem(storeKey)||"[]");a.push(x);localStorage.setItem(storeKey,JSON.stringify(a))}
function esc(x){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function pageNav(p){page=p;render()}
function render(){
  $("#main").innerHTML=page==="home"?home():page==="estimate"?estimate():page==="calculator"?calculator():settings();
  $$(".bottomNav button,[data-page]").forEach(b=>b.onclick=()=>pageNav(b.dataset.page));
  if(C.ui.languageButton) $("#langBtn").onclick=()=>{lang=lang==="hi"?"en":"hi";localStorage.setItem(langKey,lang);render()};
  bindMenu();
}
function home(){
 return `<section class="page"><div class="hero"><span>POWERING YOUR TRUST</span><h1>Material Estimate</h1><p>${ALL.length} configured material entries</p></div><div class="stageGrid">${
 M.map((s,i)=>`<button class="stageCard" data-stage="${i}"><small>${s[0]}</small><b>${esc(s[1])}</b><span>${s[3]?.length||0} items</span></button>`).join("")
 }</div></section>`;
}
function bindMenu(){
 $$(".stageCard").forEach(b=>b.onclick=()=>{currentStage=+b.dataset.stage;page="stage";renderStage()});
 $("#menuBtn").onclick=()=>$("#drawer").classList.add("open");
 $("#closeMenu").onclick=()=>$("#drawer").classList.remove("open");
}
function renderStage(){
 const s=M[currentStage];
 $("#main").innerHTML=`<section class="page"><button class="back" id="back">← Home</button><div class="hero compact"><small>${s[0]}</small><h1>${esc(s[1])}</h1></div><div class="itemGrid">${
 [...(s[3]||[]),...(s[4]||[]).flatMap(g=>g[1])].map((it,i)=>`<button class="itemCard" data-i="${i}"><div class="fakeImg">SE</div><b>${esc(it[0])}</b><span>Open item</span></button>`).join("")
 }</div></section>`;
 $("#back").onclick=()=>pageNav("home");
 $$(".itemCard").forEach((b,i)=>b.onclick=()=>openItem(s,i));
}
function openItem(s,index){
 const items=[...(s[3]||[]),...(s[4]||[]).flatMap(g=>g[1])],it=items[index];
 currentItem={stage:s[0],stageName:s[1],item:it};
 const [name,fields,units,brands]=it;
 $("#main").innerHTML=`<section class="page"><button class="back" id="backItem">← Items</button><div class="itemHead"><div class="fakeImg big">SE</div><div><small>${s[0]}</small><h1>${esc(name)}</h1></div></div><div class="formCard" id="formCard">
 ${fields.map((f,i)=>field(f,i)).join("")}
 <label class="field"><span>Quantity *</span><input id="qty" type="number" min="0.01" step="any" inputmode="decimal" placeholder="Enter quantity"></label>
 <label class="field"><span>Unit</span><select id="unit"><option value="">Select unit</option>${units.map(x=>`<option>${esc(x)}</option>`).join("")}</select></label>
 ${C.ui.priceField?`<label class="field priceField" id="priceField"><span>Price</span><input id="price" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Optional price"></label>`:""}
 <label class="field"><span>Brand <em>(optional)</em></span><select id="brand"><option value="">No brand selected</option>${brands.map(x=>`<option>${esc(x)}</option>`).join("")}</select></label>
 <button id="add" class="primary">✓ Add to Estimate</button>
 <p class="hint">Quantity is required. All other fields can be blank.</p>
 </div></section>`;
 $("#backItem").onclick=()=>renderStage();
 $$(".choice").forEach(x=>x.onclick=()=>{x.parentElement.querySelectorAll(".choice").forEach(y=>y.classList.remove("selected"));x.classList.add("selected")});
 $("#add").onclick=addItem;
}
function field(f,i){
 const [label,opts]=f;
 if(opts.length===1 && String(opts[0]).startsWith("User Input")) return `<label class="field"><span>${esc(label)}</span><input data-field="${i}" placeholder="${esc(opts[0])}"></label>`;
 return `<div class="field"><span>${esc(label)}</span><div class="choices">${opts.map(o=>`<button type="button" class="choice" data-label="${esc(label)}" data-value="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>`;
}
function addItem(){
 const q=$("#qty").value.trim(); if(!q||+q<=0){$("#qty").focus();$("#qty").classList.add("error");return}
 const data={id:Date.now(),stage:currentItem.stage,stageName:currentItem.stageName,item:currentItem.item,qty:q,unit:$("#unit").value,brand:$("#brand").value,price:$("#price")?.value||"",options:{}};
 $$(".choice.selected").forEach(x=>data.options[x.dataset.label]=x.dataset.value);
 $$("[data-field]").forEach(x=>data.options[x.closest(".field").querySelector("span").innerText]=x.value);
 save(data);
 toast("Added to Estimate");
 setTimeout(renderStage,350);
}
function estimate(){
 const a=JSON.parse(localStorage.getItem(storeKey)||"[]");
 return `<section class="page"><div class="hero compact"><h1>Estimate</h1><p>${a.length} saved items</p></div>${a.length?`<div class="estimateList">${a.map((x,i)=>`<article><b>${esc(x.item)}</b><span>${esc(x.qty)} ${esc(x.unit||"")} ${x.brand? "• "+esc(x.brand):""}</span>${x.price?`<strong>₹ ${esc(x.price)}</strong>`:""}</article>`).join("")}</div><button class="danger" id="clear">Clear Estimate</button>`:`<div class="empty">No items added yet.</div>`}</section>`;
}
function calculator(){return `<section class="page"><div class="hero compact"><h1>Calculator</h1><p>Power • Voltage • Current</p></div><div class="calcCard"><label>Power (W)<input id="pw" type="number"></label><label>Voltage (V)<input id="vo" type="number"></label><button class="primary" id="calc">Calculate Current</button><div id="ans" class="answer">I = P ÷ V</div></div></section>`}
function settings(){return `<section class="page"><div class="hero compact"><h1>Settings</h1></div><div class="settingsCard"><label class="toggle"><input id="dark" type="checkbox" checked> Dark theme</label><button class="secondary" id="reset">Reset saved estimate</button></div></section>`}
function toast(t){const x=document.createElement("div");x.className="toast";x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),1200)}
document.addEventListener("click",e=>{
 if(e.target.id==="clear"){localStorage.removeItem(storeKey);render()}
 if(e.target.id==="reset"){localStorage.removeItem(storeKey);render()}
 if(e.target.id==="calc"){let p=+$("#pw").value,v=+$("#vo").value;$("#ans").textContent=p&&v?`Current = ${(p/v).toFixed(2)} A`:"Enter Power and Voltage"}
});
window.render=render; setTimeout(render,650);
})();