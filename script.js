(function(){

"use strict";


/* =========================
   CONFIG
========================= */

const C = window.APP_CONFIG || {};
const M = window.MATERIAL_CONFIG || {};
const STAGES = window.STAGES || [];


const KEY_ITEMS = "sandeepEstimateItems";
const KEY_LANG = "sandeepMaterialLang";
const KEY_VIEW = "sandeepMaterialView";
const KEY_THEME = "sandeepTheme";
const KEY_ROTATE = "sandeepRotateBorder";


/* =========================
   STATE
========================= */

const state = {

  lang:
    localStorage.getItem(KEY_LANG)
    || C.defaultLanguage
    || "en",

  view:
    localStorage.getItem(KEY_VIEW)
    || C.defaultView
    || "grid",

  theme:
    localStorage.getItem(KEY_THEME)
    || "dark",

  rotate:
    localStorage.getItem(KEY_ROTATE) !== "0",

  page:"home",

  stageId:1,

  itemIndex:0,

  editingId:null,

  carry:{
    size:"",
    type:"",
    unit:"",
    brand:""
  },

  draft:null

};


let estimateItems = loadItems();


/* =========================
   HELPERS
========================= */

function $(id){

  return document.getElementById(id);

}


function esc(value){

  return String(value == null ? "" : value)
    .replace(/[&<>"']/g,function(c){

      return {
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#39;"

      }[c];

    });

}


function loadItems(){

  try{

    return JSON.parse(
      localStorage.getItem(KEY_ITEMS) || "[]"
    );

  }catch(error){

    console.error(error);

    return [];

  }

}


function saveItems(){

  localStorage.setItem(
    KEY_ITEMS,
    JSON.stringify(estimateItems)
  );

}


function stageById(id){

  return STAGES.find(
    s => s.id === id
  ) || STAGES[0];

}


function stageItems(id){

  const key = "stage" + id;

  return Array.isArray(M[key])
    ? M[key]
    : [];

}


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(page){

  state.page = page;

  document
    .querySelectorAll(".page")
    .forEach(function(section){

      section.classList.toggle(
        "active",
        section.id === "page-" + page
      );

    });


  document
    .querySelectorAll(".nav-item")
    .forEach(function(button){

      button.classList.toggle(
        "active",
        button.dataset.page === page
      );

    });


  const titles = {

    home:"Estimate List",

    estimate:"Estimate",

    calculator:"Calculator",

    settings:"Settings"

  };


  $("pageTitle").textContent =
    titles[page] || "Estimate List";


  closeMenu();

}


function openMenu(){

  $("sideMenu").classList.add("open");

  $("menuShade").classList.add("open");

}


function closeMenu(){

  $("sideMenu").classList.remove("open");

  $("menuShade").classList.remove("open");

}


/* =========================
   LAST SELECTED BORDER
========================= */

function setLastSelected(element){

  if(
    !state.rotate ||
    !C.ui ||
    !C.ui.lastSelectedBorder
  ){

    return;

  }


  document
    .querySelectorAll(".rotating-border")
    .forEach(function(item){

      item.classList.remove(
        "rotating-border"
      );

    });


  if(element){

    element.classList.add(
      "rotating-border"
    );

  }

}


/* =========================
   TOAST
========================= */

function toast(message){

  const t = $("toast");

  if(!t) return;

  t.textContent = message;

  t.classList.add("show");

  setTimeout(function(){

    t.classList.remove("show");

  },1200);

}


/* =========================
   STAGES
========================= */

function renderStages(){

  const grid = $("stageGrid");

  if(!grid) return;


  grid.innerHTML = STAGES.map(function(stage){

    const count =
      stageItems(stage.id).length;

    return `

      <button
        class="stage-card"
        data-stage="${stage.id}"
      >

        <span class="stage-number">
          ${esc(stage.no)}
        </span>

        <h3>
          ${esc(
            state.lang === "hi"
              ? stage.hi
              : stage.en
          )}
        </h3>

        <p>
          ${count} materials
        </p>

        <span class="stage-arrow">
          →
        </span>

      </button>

    `;

  }).join("");


  grid
    .querySelectorAll(".stage-card")
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          setLastSelected(button);

          openMaterials(
            Number(button.dataset.stage)
          );

        }
      );

    });

}


/* =========================
   MATERIAL SHEET
========================= */

function openMaterials(stageId){

  state.stageId = stageId;

  state.itemIndex = 0;

  const stage =
    stageById(stageId);


  $("sheetStageNo").textContent =
    stage.no;


  $("sheetTitle").textContent =
    state.lang === "hi"
      ? stage.hi
      : stage.en;


  renderMaterialCards();

  $("materialSheet")
    .classList.add("open");

}


function closeMaterials(){

  $("materialSheet")
    .classList.remove("open");

}


function renderMaterialCards(){

  const box = $("materialCards");

  const list =
    stageItems(state.stageId);


  box.innerHTML = list
    .map(function(material,index){

      const image =
        material.image || "";


      return `

        <button
          class="material-card
            ${image ? "" : "no-image"}
          "
          data-index="${index}"
        >

          ${
            image
              ? `<img
                  src="${esc(image)}"
                  alt=""
                >`
              : `<div
                  class="material-image-space"
                ></div>`
          }

          <strong>
            ${esc(material.name)}
          </strong>

          <small>
            ${
              state.lang === "hi"
                ? "खोलने के लिए टैप करें"
                : "Tap to open"
            }
          </small>

        </button>

      `;

    })
    .join("");


  applyView();


  box
    .querySelectorAll(".material-card")
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          setLastSelected(button);

          openOptions(
            Number(button.dataset.index)
          );

        }
      );

    });

}


/* =========================
   OPTIONS
========================= */

function makeDraft(material){

  return {

    id:null,

    materialId:
      material.id,

    material:
      material.name,

    stage:
      state.stageId,

    size:
      state.carry.size || "",

    type:
      state.carry.type || "",

    subtype:"",

    shape:"",

    materialType:"",

    colour:"",

    qty:"",

    unit:
      state.carry.unit || "",

    brand:
      state.carry.brand || ""

  };

}


function openOptions(index,existing){

  state.itemIndex = index;

  const list =
    stageItems(state.stageId);

  const material =
    existing || list[index];


  if(!material) return;


  $("optionStageNo").textContent =
    stageById(state.stageId).no;


  $("optionTitle").textContent =
    material.name;


  state.draft =
    existing
      ? Object.assign({},existing)
      : makeDraft(material);


  renderOptions(material);


  $("optionSheet")
    .classList.add("open");

}


function closeOptions(){

  $("optionSheet")
    .classList.remove("open");

  state.editingId = null;

}


function choiceGroup(
  title,
  key,
  values
){

  if(
    !Array.isArray(values) ||
    !values.length
  ){

    return "";

  }


  const selected =
    state.draft[key] || "";


  return `

    <div class="choice-group">

      <div class="choice-title">

        <b>${esc(title)}</b>

        <span>
          ${esc(selected)}
        </span>

      </div>

      <div class="choice-grid">

        ${
          values.map(function(value){

            return `

              <button
                type="button"
                class="
                  choice-btn
                  ${selected === value
                    ? "selected"
                    : ""
                  }
                "
                data-key="${esc(key)}"
                data-value="${esc(value)}"
              >
                ${esc(value)}
              </button>

            `;

          }).join("")
        }

      </div>

    </div>

  `;

}


function renderOptions(material){

  let html = "";


  if(material.flow){

    if(
      material.flow.includes("size")
    ){

      html += choiceGroup(
        "Size / आकार",
        "size",
        material.sizes || [
          "20mm",
          "25mm",
          "32mm",
          "40mm"
        ]
      );

    }


    if(
      material.flow.includes("type")
    ){

      html += choiceGroup(
        "Type / प्रकार",
        "type",
        material.types || [
          "Heavy",
          "Medium",
          "Light"
        ]
      );

    }


    if(
      material.flow.includes("subtype")
    ){

      html += choiceGroup(
        "Sub Type",
        "subtype",
        material.subtypes || [
          "Short Bend",
          "Long Bend"
        ]
      );

    }


    if(
      material.flow.includes("shape")
    ){

      html += choiceGroup(
        "Shape / Ways",
        "shape",
        material.shapes || [
          "1 Way",
          "2 Way Straight",
          "2 Way Angle",
          "3 Way T-Type",
          "4 Way Cross Type",
          "Y/H/U/V"
        ]
      );

    }


    if(
      material.flow.includes("material")
    ){

      html += choiceGroup(
        "Material",
        "materialType",
        material.materials || [
          "PVC",
          "GI Metal"
        ]
      );

    }


    if(
      material.flow.includes("colour")
    ){

      html += choiceGroup(
        "Colour / रंग",
        "colour",
        [
          "White",
          "Black",
          "Red",
          "Blue",
          "Green",
          "Other"
        ]
      );

    }

  }


  /* QUANTITY */

  html += `

    <div class="choice-group">

      <div class="choice-title">

        <b>
          Quantity / मात्रा
        </b>

        <span>
          Required
        </span>

      </div>


      <div class="qty-row">

        <button
          type="button"
          class="qty-btn"
          id="qtyMinus"
        >
          −
        </button>

        <input
          id="qtyInput"
          class="qty-input"
          type="number"
          min="1"
          inputmode="numeric"
          value="${esc(state.draft.qty)}"
        >

        <button
          type="button"
          class="qty-btn"
          id="qtyPlus"
        >
          +
        </button>

      </div>


      <div class="quick-qty">

        ${
          [1,5,10,20,25,50,100]
            .map(function(number){

              return `

                <button
                  type="button"
                  data-quantity="${number}"
                >
                  ${number}
                </button>

              `;

            })
            .join("")
        }

      </div>

    </div>

  `;


  /* UNIT */

  html += choiceGroup(
    "Unit / इकाई",
    "unit",
    material.units || [
      "pcs",
      "bndl",
      "doz"
    ]
  );


  /* BRAND LAST */

  html += choiceGroup(
    "Brand / ब्रांड",
    "brand",
    M.brands || []
  );


  $("optionBody").innerHTML = html;


  /* CHOICES */

  $("optionBody")
    .querySelectorAll(".choice-btn")
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          state.draft[
            button.dataset.key
          ] =
            button.dataset.value;


          setLastSelected(button);

          renderOptions(material);

        }
      );

    });


  /* QUANTITY INPUT */

  const quantityInput =
    $("qtyInput");


  quantityInput.addEventListener(
    "input",
    function(){

      state.draft.qty =
        this.value;

    }
  );


  $("qtyMinus")
    .addEventListener(
      "click",
      function(){

        let value =
          parseInt(
            state.draft.qty,
            10
          ) || 1;


        value =
          Math.max(1,value - 1);


        state.draft.qty =
          String(value);


        renderOptions(material);

      }
    );


  $("qtyPlus")
    .addEventListener(
      "click",
      function(){

        let value =
          parseInt(
            state.draft.qty,
            10
          ) || 0;


        value++;


        state.draft.qty =
          String(value);


        renderOptions(material);

      }
    );


  /* QUICK QUANTITY */

  $("optionBody")
    .querySelectorAll(
      "[data-quantity]"
    )
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          state.draft.qty =
            button.dataset.quantity;


          setLastSelected(button);

          renderOptions(material);

        }
      );

    });

}


/* =========================
   VALIDATE
========================= */

function validDraft(){

  if(
    !state.draft.qty ||
    parseInt(state.draft.qty,10) < 1
  ){

    toast(
      state.lang === "hi"
        ? "मात्रा भरें"
        : "Enter quantity"
    );

    return false;

  }


  if(!state.draft.unit){

    toast(
      state.lang === "hi"
        ? "इकाई चुनें"
        : "Select unit"
    );

    return false;

  }


  return true;

}


/* =========================
   ADD / UPDATE
========================= */

function addEstimate(){

  if(!validDraft()) return;


  const draft =
    Object.assign({},state.draft);


  /* UPDATE */

  if(state.editingId){

    const index =
      estimateItems.findIndex(
        item =>
          item.id === state.editingId
      );


    if(index >= 0){

      draft.id =
        state.editingId;

      estimateItems[index] =
        draft;

      saveItems();

      renderEstimate();

      toast(
        state.lang === "hi"
          ? "✓ Estimate अपडेट हुआ"
          : "✓ Estimate updated"
      );

      closeOptions();

      return;

    }

  }


  /* NEW ITEM */

  draft.id =
    "est-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,7);


  estimateItems.push(draft);

  saveItems();


  /* CARRY FORWARD */

  if(draft.size){

    state.carry.size =
      draft.size;

  }

  if(draft.type){

    state.carry.type =
      draft.type;

  }

  if(draft.unit){

    state.carry.unit =
      draft.unit;

  }

  if(draft.brand){

    state.carry.brand =
      draft.brand;

  }


  toast(
    state.lang === "hi"
      ? "✓ Estimate में जोड़ा गया"
      : "✓ Added to Estimate"
  );


  renderEstimate();


  /*
    IMPORTANT:
    Add ke baad next item.
    Current item dobara auto-add nahi hota.
  */

  nextItem();

}


/* =========================
   NEXT
========================= */

function nextItem(){

  const list =
    stageItems(state.stageId);


  if(
    state.itemIndex <
    list.length - 1
  ){

    state.itemIndex++;

    state.draft = null;

    openOptions(
      state.itemIndex
    );

    return;

  }


  closeOptions();

}


/* =========================
   BACK
========================= */

function previousItem(){

  if(state.itemIndex > 0){

    state.itemIndex--;

    state.draft = null;

    openOptions(
      state.itemIndex
    );

    return;

  }


  closeOptions();

}


/* =========================
   ESTIMATE
========================= */

function renderEstimate(){

  const box =
    $("estimateList");

  const empty =
    $("estimateEmpty");


  empty.style.display =
    estimateItems.length
      ? "none"
      : "block";


  box.innerHTML =
    estimateItems
      .map(function(item){

        const details = [

          item.size,

          item.type,

          item.subtype,

          item.shape,

          item.materialType,

          item.colour,

          item.qty
            ? item.qty + " " + item.unit
            : "",

          item.brand

        ]
        .filter(Boolean)
        .join(" • ");


        return `

          <article class="estimate-card">

            <div class="estimate-card-head">

              <h3>
                ${esc(item.material)}
              </h3>

              <span class="eyebrow">
                STAGE ${String(item.stage)
                  .padStart(2,"0")}
              </span>

            </div>


            <div class="estimate-meta">
              ${esc(details)}
            </div>


            <div class="estimate-actions">

              <button
                data-edit="${esc(item.id)}"
              >
                Edit
              </button>

              <button
                data-delete="${esc(item.id)}"
              >
                Delete
              </button>

            </div>

          </article>

        `;

      })
      .join("");


  box
    .querySelectorAll("[data-edit]")
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          editItem(
            button.dataset.edit
          );

        }
      );

    });


  box
    .querySelectorAll("[data-delete]")
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          deleteItem(
            button.dataset.delete
          );

        }
      );

    });

}


/* =========================
   EDIT
========================= */

function editItem(id){

  const item =
    estimateItems.find(
      x => x.id === id
    );


  if(!item) return;


  state.stageId =
    item.stage;

  state.editingId =
    id;


  const list =
    stageItems(item.stage);


  let index =
    list.findIndex(
      material =>
        material.id === item.materialId ||
        material.name === item.material
    );


  if(index < 0){
    index = 0;
  }


  closeMaterials();


  openOptions(
    index,
    item
  );

}


/* =========================
   DELETE
========================= */

function deleteItem(id){

  estimateItems =
    estimateItems.filter(
      item =>
        item.id !== id
    );


  saveItems();

  renderEstimate();

}


/* =========================
   VIEW
========================= */

function applyView(){

  document
    .querySelectorAll(".material-cards")
    .forEach(function(box){

      box.classList.remove(
        "grid",
        "list",
        "compact"
      );

      box.classList.add(
        state.view
      );

    });


  document
    .querySelectorAll("[data-view]")
    .forEach(function(button){

      button.classList.toggle(
        "active",
        button.dataset.view === state.view
      );

    });


  localStorage.setItem(
    KEY_VIEW,
    state.view
  );

}


/* =========================
   LANGUAGE
========================= */

function toggleLanguage(){

  state.lang =
    state.lang === "en"
      ? "hi"
      : "en";


  localStorage.setItem(
    KEY_LANG,
    state.lang
  );


  $("langBtn").textContent =
    state.lang === "en"
      ? "HI"
      : "EN";


  renderStages();


  if(
    $("materialSheet")
      .classList.contains("open")
  ){

    const stage =
      stageById(state.stageId);


    $("sheetTitle").textContent =
      state.lang === "hi"
        ? stage.hi
        : stage.en;


    renderMaterialCards();

  }

}


/* =========================
   CALCULATOR
========================= */

function calculate(type){

  const V =
    parseFloat($("calcV").value);

  const I =
    parseFloat($("calcI").value);

  const P =
    parseFloat($("calcP").value);


  let result;


  if(
    type === "power" &&
    isFinite(V) &&
    isFinite(I)
  ){

    result =
      "Power = " +
      (V * I).toFixed(2) +
      " W";

  }

  else if(
    type === "current" &&
    isFinite(V) &&
    isFinite(P) &&
    V !== 0
  ){

    result =
      "Current = " +
      (P / V).toFixed(3) +
      " A";

  }

  else if(
    type === "voltage" &&
    isFinite(P) &&
    isFinite(I) &&
    I !== 0
  ){

    result =
      "Voltage = " +
      (P / I).toFixed(2) +
      " V";

  }

  else{

    result =
      "Enter the required two values.";

  }


  $("calcResult").textContent =
    result;

}


/* =========================
   INIT
========================= */

function init(){

  renderStages();

  renderEstimate();

  applyView();


  $("menuBtn")
    .addEventListener(
      "click",
      openMenu
    );


  $("menuShade")
    .addEventListener(
      "click",
      closeMenu
    );


  document
    .querySelectorAll("[data-page]")
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          showPage(
            button.dataset.page
          );

        }
      );

    });


  $("langBtn")
    .addEventListener(
      "click",
      toggleLanguage
    );


  $("sheetClose")
    .addEventListener(
      "click",
      closeMaterials
    );


  $("sheetBack")
    .addEventListener(
      "click",
      closeMaterials
    );


  $("optionClose")
    .addEventListener(
      "click",
      closeOptions
    );


  $("optionBack")
    .addEventListener(
      "click",
      previousItem
    );


  $("nextItem")
    .addEventListener(
      "click",
      nextItem
    );


  $("addEstimate")
    .addEventListener(
      "click",
      addEstimate
    );


  $("clearEstimate")
    .addEventListener(
      "click",
      function(){

        if(
          confirm("Clear estimate?")
        ){

          estimateItems = [];

          saveItems();

          renderEstimate();

        }

      }
    );


  $("themeBtn")
    .addEventListener(
      "click",
      function(){

        state.theme =
          state.theme === "dark"
            ? "light"
            : "dark";


        localStorage.setItem(
          KEY_THEME,
          state.theme
        );


        /*
          Theme hook.
          Light theme CSS can be added later
          without changing app logic.
        */

        this.classList.toggle(
          "active",
          state.theme === "dark"
        );

      }
    );


  $("rotateBtn")
    .addEventListener(
      "click",
      function(){

        state.rotate =
          !state.rotate;


        localStorage.setItem(
          KEY_ROTATE,
          state.rotate ? "1" : "0"
        );


        this.classList.toggle(
          "active",
          state.rotate
        );


        if(!state.rotate){

          document
            .querySelectorAll(
              ".rotating-border"
            )
            .forEach(function(element){

              element.classList.remove(
                "rotating-border"
              );

            });

        }

      }
    );


  document
    .querySelectorAll("[data-view]")
    .forEach(function(button){

      button.addEventListener(
        "click",
        function(){

          state.view =
            button.dataset.view;

          applyView();

        }
      );

    });


  $("calcPower")
    .addEventListener(
      "click",
      function(){

        calculate("power");

      }
    );


  $("calcCurrent")
    .addEventListener(
      "click",
      function(){

        calculate("current");

      }
    );


  $("calcVoltage")
    .addEventListener(
      "click",
      function(){

        calculate("voltage");

      }
    );


  $("resetApp")
    .addEventListener(
      "click",
      function(){

        if(
          confirm(
            "Reset all app data?"
          )
        ){

          localStorage.removeItem(
            KEY_ITEMS
          );

          localStorage.removeItem(
            KEY_LANG
          );

          localStorage.removeItem(
            KEY_VIEW
          );

          localStorage.removeItem(
            KEY_THEME
          );

          location.reload();

        }

      }
    );


  /*
    Final loader unlock.
    Even if some optional UI code
    fails, flash screen won't stay stuck.
  */

  if(window.__unlockApp){

    window.__unlockApp();

  }

}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    try{

      init();

    }catch(error){

      console.error(
        "Estimate List error:",
        error
      );

    }finally{

      if(window.__unlockApp){

        window.__unlockApp();

      }

    }

  }
);

})();
