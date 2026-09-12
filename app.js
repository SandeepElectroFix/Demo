/* =========================================================
   SANDEEP ELECTROFIX — UI UPGRADE ENGINE
   Works with the existing window.ESTIMATE_LIST database.
   Put your existing database script before this file.
========================================================= */
(() => {
  "use strict";

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const STORE = "sandeepEstimateItems";
  const LANG_STORE = "sandeepMaterialLang";

  const stages = [
    ["stage1","STAGE 01","Slab Conduit Installation"],
    ["stage2","STAGE 02","Wall Conduit Installation"],
    ["stage3","STAGE 03","Wiring Installation"],
    ["stage4","STAGE 04","Final Electrical Fittings"],
    ["stage5","STAGE 05","False Ceiling Wiring"]
  ];

  let db = Array.isArray(window.ESTIMATE_LIST) ? window.ESTIMATE_LIST : [];
  let estimate = JSON.parse(localStorage.getItem(STORE) || "[]");
  let currentStage = null;
  let selected = null;
  let optionState = {};

  function text(v){
    if(v == null) return "";
    if(typeof v === "string" || typeof v === "number") return String(v);
    return v.en || v.hi || Object.values(v)[0] || "";
  }
  function normalizeStage(x){
    return String(x || "").toLowerCase().replace(/\s+/g,"").replace("stage","stage");
  }
  function materialStage(m){
    return normalizeStage(m.stage || m.stageId || m.stageName);
  }
  function nameOf(m){ return text(m.name || m.title || m.label || "Material"); }
  function searchText(m){ return JSON.stringify(m).toLowerCase(); }
  function money(n){ return "₹" + Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}); }

  function renderStages(){
    const grid = $("#stageGrid");
    const counts = {};
    db.forEach(m => { const s=materialStage(m); counts[s]=(counts[s]||0)+1; });
    grid.innerHTML = stages.map(([id,no,title]) => `
      <button class="stage-card ${currentStage===id?"active":""}" data-stage="${id}">
        <span class="stage-no">${no}</span>
        <h3>${title}</h3>
        <p>${counts[id]||0} materials <span class="stage-arrow">→</span></p>
      </button>`).join("");
    $$(".stage-card").forEach(b => b.onclick=()=>selectStage(b.dataset.stage));
  }

  function selectStage(stage){
    currentStage = stage;
    renderStages();
    $("#materialsSection").classList.remove("hidden");
    const meta = stages.find(x=>x[0]===stage);
    $("#stageTitle").textContent = meta ? meta[2] : "Materials";
    renderMaterials(db.filter(m=>materialStage(m)===stage));
    $("#materialsSection").scrollIntoView({behavior:"smooth",block:"start"});
  }

  function renderMaterials(list){
    const q = $("#searchInput").value.trim().toLowerCase();
    const filtered = list.filter(m => !q || searchText(m).includes(q));
    $("#materialGrid").innerHTML = filtered.length ? filtered.map((m,i)=>`
      <button class="material-card ${selected===m?"selected":""}" data-index="${db.indexOf(m)}">
        <span class="eyebrow">MATERIAL</span>
        <h3>${nameOf(m)}</h3>
        <p>${text(m.description||m.type||m.category||"Electrical material")}</p>
        <span class="tag">${text(m.unit||m.defaultUnit||"Select")}</span>
      </button>`).join("") :
      `<div class="empty" style="grid-column:1/-1">No matching material found.</div>`;
    $$(".material-card").forEach(b=>b.onclick=()=>openMaterial(db[Number(b.dataset.index)]));
  }

  function openMaterial(m){
    selected=m; optionState={};
    $$(".material-card").forEach(x=>x.classList.remove("selected"));
    const target = [...$$(".material-card")].find(x=>Number(x.dataset.index)===db.indexOf(m));
    if(target) target.classList.add("selected");
    $("#selectedMaterial").textContent=nameOf(m);
    $("#selectedMeta").textContent=[text(m.category),text(m.type),text(m.subType||m.subtype)].filter(Boolean).join(" • ") || "Choose options below";
    renderOptions(m);
    $("#selectionPanel").classList.remove("hidden");
    $("#selectionPanel").scrollIntoView({behavior:"smooth",block:"center"});
  }

  function firstArray(obj, keys){
    for(const k of keys){
      if(Array.isArray(obj?.[k]) && obj[k].length) return obj[k];
    }
    return null;
  }
  function renderOptions(m){
    const defs=[
      ["type",["types","typeOptions","typeList"]],
      ["subType",["subTypes","subtypes","subTypeOptions","subtypeOptions"]],
      ["size",["sizes","sizeOptions","wireSizes"]],
      ["colour",["colours","colors","colourOptions","colorOptions"]],
      ["brand",["brands","brandOptions"]]
    ];
    const html=[];
    defs.forEach(([key,keys])=>{
      const vals=firstArray(m,keys);
      if(vals?.length){
        html.push(`<div style="width:100%"><div class="eyebrow" style="margin:4px 0 7px">${key==="subType"?"SUB TYPE":key.toUpperCase()}</div><div class="options-row">`+
          vals.map(v=>`<button type="button" class="option-btn ${optionState[key]===text(v)?"active":""}" data-opt="${key}" data-val="${text(v).replace(/"/g,"&quot;")}">${text(v)}</button>`).join("")+
          `</div></div>`);
      }
    });
    $("#dynamicOptions").innerHTML=html.join("") || `<p style="color:var(--muted);font-size:12px">No extra options required for this material.</p>`;
    $$(".option-btn").forEach(b=>b.onclick=()=>{optionState[b.dataset.opt]=b.dataset.val;renderOptions(m);});
    const unit=text(m.unit||m.defaultUnit);
    if(unit) $("#unitInput").value=unit;
  }

  function calc(){
    const amount=Number($("#qtyInput").value||0)*Number($("#rateInput").value||0);
    $("#amountOutput").textContent=money(amount);
    return amount;
  }

  function addEstimate(){
    if(!selected) return toast("पहले material select करें");
    const qty=Number($("#qtyInput").value);
    const rate=Number($("#rateInput").value);
    if(!(qty>0)) return toast("Quantity 0 से बड़ी होनी चाहिए");
    if(!(rate>=0)) return toast("Valid rate डालें");
    estimate.push({
      id:Date.now(),
      materialId:selected.id || nameOf(selected),
      name:nameOf(selected),
      stage:materialStage(selected),
      options:{...optionState},
      qty,unit:$("#unitInput").value,rate,
      amount:qty*rate
    });
    save(); renderEstimate(); toast("Estimate में add हो गया ✓");
  }

  function save(){localStorage.setItem(STORE,JSON.stringify(estimate));$("#estimateCount").textContent=estimate.length}
  function renderEstimate(){
    $("#estimateCount").textContent=estimate.length;
    $("#materialCount").textContent=db.length || 69;
    const empty=estimate.length===0;
    $("#estimateEmpty").classList.toggle("hidden",!empty);
    $("#estimateTotal").classList.toggle("hidden",empty);
    $("#estimateActions").classList.toggle("hidden",empty);
    $("#estimateList").innerHTML=estimate.map((x,i)=>{
      const opts=Object.entries(x.options||{}).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join(" • ");
      return `<div class="estimate-item">
        <div><div class="estimate-name">${x.name}</div><div class="estimate-meta">${opts||"Standard"} • ${x.qty} ${x.unit} × ${money(x.rate)}</div></div>
        <div class="estimate-amount">${money(x.amount)}</div>
        <button class="delete-item" data-del="${i}">×</button>
      </div>`;
    }).join("");
    $$(".delete-item").forEach(b=>b.onclick=()=>{estimate.splice(Number(b.dataset.del),1);save();renderEstimate();});
    $("#grandTotal").textContent=money(estimate.reduce((s,x)=>s+Number(x.amount||0),0));
  }

  function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
  function copyEstimate(){
    const total=estimate.reduce((s,x)=>s+x.amount,0);
    const lines=["SANDEEP ELECTROFIX","PROJECT ESTIMATE","--------------------",...estimate.map(x=>`${x.name} | ${x.qty} ${x.unit} | ${money(x.rate)} | ${money(x.amount)}`),"--------------------",`TOTAL: ${money(total)}`];
    navigator.clipboard?.writeText(lines.join("\n")).then(()=>toast("Estimate copied ✓")).catch(()=>toast("Copy unavailable"));
  }

  $("#searchInput").addEventListener("input",()=>{
    if(currentStage) renderMaterials(db.filter(m=>materialStage(m)===currentStage));
    else {
      $("#materialsSection").classList.remove("hidden");
      $("#stageTitle").textContent="Search Results";
      renderMaterials(db);
    }
  });
  $("#clearSearch").onclick=()=>{$("#searchInput").value="";if(currentStage)renderMaterials(db.filter(m=>materialStage(m)===currentStage));else $("#materialsSection").classList.add("hidden")};
  $("#allMaterialsBtn").onclick=()=>{currentStage=null;renderStages();$("#stageTitle").textContent="All Materials";$("#materialsSection").classList.remove("hidden");renderMaterials(db)};
  $("#qtyInput").oninput=calc;$("#rateInput").oninput=calc;
  $("#addBtn").onclick=addEstimate;
  $("#closeSelection").onclick=()=>$("#selectionPanel").classList.add("hidden");
  $("#estimateBtn").onclick=()=>$("#estimateSection").scrollIntoView({behavior:"smooth"});
  $("#clearEstimate").onclick=()=>{if(!estimate.length)return;if(confirm("पूरा estimate clear करें?")){estimate=[];save();renderEstimate();}};
  $("#copyBtn").onclick=copyEstimate;
  $("#printBtn").onclick=()=>window.print();
  $("#menuBtn").onclick=()=>$("#menuOverlay").classList.remove("hidden");
  $("#closeMenu").onclick=()=>$("#menuOverlay").classList.add("hidden");
  $("#scrollEstimate").onclick=()=>{$("#menuOverlay").classList.add("hidden");$("#estimateSection").scrollIntoView({behavior:"smooth"})};
  $("#resetApp").onclick=()=>{if(confirm("App data reset करें?")){localStorage.removeItem(STORE);localStorage.removeItem(LANG_STORE);location.reload()}};
  $("#langBtn").onclick=()=>{const l=localStorage.getItem(LANG_STORE)||"hi";localStorage.setItem(LANG_STORE,l==="hi"?"en":"hi");$("#langBtn").textContent=l==="hi"?"HI":"EN";toast(l==="hi"?"English":"हिन्दी")};

  // Safe fallback for testing the UI when database.js is not present.
  if(!db.length){
    db=stages.flatMap(([stage])=>Array.from({length: Math.ceil(69/5)},(_,i)=>({id:`${stage}-${i}`,stage,name:{en:`Material ${i+1}`,hi:`सामग्री ${i+1}`},unit:"pcs"}))).slice(0,69);
  }
  $("#materialCount").textContent=db.length;
  $("#langBtn").textContent=(localStorage.getItem(LANG_STORE)||"hi")==="hi"?"EN":"HI";
  renderStages();renderEstimate();calc();
})();