/* =========================================================
   SANDEEP ELECTROFIX
   ESTIMATE LIST
   STAGE 01
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const ESTIMATE_KEY = "sandeepEstimateItems";
const DRAFT_KEY = "sandeepStage1Drafts";
const VIEW_KEY = "sandeepStage1View";


/* =========================================================
   MASTER LIST - STAGE 1
   DO NOT CHANGE WITHOUT USER REQUEST
========================================================= */

const STAGE_1 = [

  {
    id:"pipe",
    name:"Pipe",
    image:"",

    fields:[
      {
        key:"type",
        label:"Type",
        type:"options",
        options:[
          "Heavy",
          "Medium",
          "Light"
        ]
      },

      {
        key:"size",
        label:"Size",
        type:"options",
        options:[
          "20mm",
          "25mm",
          "32mm",
          "40mm"
        ]
      },

      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "pcs",
          "bndl",
          "doz"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"options",
        optional:true,

        options:[
          "Polycab",
          "Finolex",
          "Havells",
          "AKG",
          "Precision",
          "Other Brand",
          "Non Brand / Local",
          "Skip Brand"
        ]
      }
    ]
  },


  {
    id:"bend",
    name:"Bend",
    image:"",

    fields:[
      {
        key:"type",
        label:"Type",
        type:"options",
        options:[
          "Heavy",
          "Medium",
          "Light"
        ]
      },

      {
        key:"subType",
        label:"Sub Type",
        type:"options",
        options:[
          "Short Bend",
          "Long Bend"
        ]
      },

      {
        key:"size",
        label:"Size",
        type:"options",
        options:[
          "20mm",
          "25mm",
          "32mm",
          "40mm"
        ]
      },

      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "pcs",
          "pkt",
          "doz"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  },


  {
    id:"junction-box",
    name:"Junction Box",
    image:"",

    fields:[
      {
        key:"type",
        label:"Type",
        type:"options",
        options:[
          "Normal Junction Box",
          "Deep Junction Box"
        ]
      },

      {
        key:"shape",
        label:"Shape / Ways",
        type:"options",
        options:[
          "1 Way",
          "2 Way (Straight)",
          "2 Way (Angle)",
          "3 Way (T-Type)",
          "4 Way (Cross Type)",
          "Y-Type",
          "H-Type",
          "U-Type",
          "V-Type"
        ]
      },

      {
        key:"material",
        label:"Material",
        type:"options",
        options:[
          "PVC",
          "GI Metal"
        ]
      },

      {
        key:"conduitSize",
        label:"Conduit Size",
        type:"options",
        options:[
          "20mm",
          "25mm"
        ]
      },

      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "pcs",
          "pkt",
          "doz"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  },


  {
    id:"fan-box",
    name:"Fan Box",
    image:"",

    fields:[
      {
        key:"material",
        label:"Material",
        type:"options",
        options:[
          "MS Metal",
          "PVC"
        ]
      },

      {
        key:"ways",
        label:"Ways / Holes",
        type:"options",
        options:[
          "4 Way",
          "6 Way",
          "8 Way"
        ]
      },

      {
        key:"depth",
        label:"Depth",
        type:"options",
        options:[
          "2.5″",
          "3″"
        ]
      },

      {
        key:"hookRod",
        label:"Hook Rod",
        type:"options",
        options:[
          "8mm",
          "10mm"
        ]
      },

      {
        key:"conduitSize",
        label:"Conduit Size",
        type:"options",
        options:[
          "20mm",
          "25mm"
        ]
      },

      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "pcs",
          "pkt",
          "doz"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  },


  {
    id:"concealed-light-box",
    name:"Concealed Light Box",
    image:"",

    fields:[
      {
        key:"materialType",
        label:"Material Type",
        type:"options",
        options:[
          "Heavy GI Metal Box",
          "Heavy PVC Box"
        ]
      },

      {
        key:"depth",
        label:"Depth",
        type:"options",
        options:[
          "3″",
          "3.5″"
        ]
      },

      {
        key:"diameter",
        label:"Diameter",
        type:"options",
        options:[
          "3″",
          "4″"
        ]
      },

      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "pcs",
          "pkt",
          "doz"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"options",
        optional:true,

        options:[
          "Brand Master"
        ]
      }
    ]
  },


  {
    id:"tape",
    name:"Tape",
    image:"",

    fields:[
      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "pcs"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  },


  {
    id:"solvent-cement",
    name:"Solvent Cement",
    image:"",

    fields:[
      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "ml",
          "l"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  },


  {
    id:"neel-powder",
    name:"Neel Powder",
    image:"",

    fields:[
      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "gm",
          "kg",
          "bag"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  },


  {
    id:"binding-wire",
    name:"Binding Wire",
    image:"",

    fields:[
      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "kg",
          "mtr"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  },


  {
    id:"cable-tie",
    name:"Cable Tie / Zip Tie",
    image:"",

    fields:[
      {
        key:"size",
        label:"Size",
        type:"options",
        options:[
          "100mm",
          "150mm",
          "200mm",
          "250mm",
          "300mm",
          "400mm"
        ]
      },

      {
        key:"unit",
        label:"Unit",
        type:"options",
        options:[
          "pcs",
          "pkt"
        ]
      },

      {
        key:"brand",
        label:"Brand",
        type:"text",
        optional:true
      }
    ]
  }

];


/* =========================================================
   STATE
========================================================= */

let currentMaterialIndex = 0;

let currentMaterial = null;

let currentValues = {};

let quantity = 1;

let estimateItems = [];

let stageOpen = true;

let currentView = "grid";


/* =========================================================
   DOM
========================================================= */

const materialsGrid =
  document.getElementById("materialsGrid");

const materialCount =
  document.getElementById("materialCount");

const stageContent =
  document.getElementById("stageContent");

const stageOpenBtn =
  document.getElementById("stageOpenBtn");

const materialModal =
  document.getElementById("materialModal");

const modalBackdrop =
  document.getElementById("modalBackdrop");

const modalTitle =
  document.getElementById("modalTitle");

const modalMaterialVisual =
  document.getElementById("modalMaterialVisual");

const materialForm =
  document.getElementById("materialForm");

const modalBackBtn =
  document.getElementById("modalBackBtn");

const modalCloseBtn =
  document.getElementById("modalCloseBtn");

const nextBtn =
  document.getElementById("nextBtn");

const addBtn =
  document.getElementById("addBtn");

const estimateDrawer =
  document.getElementById("estimateDrawer");

const drawerBackdrop =
  document.getElementById("drawerBackdrop");

const drawerCloseBtn =
  document.getElementById("drawerCloseBtn");

const estimateList =
  document.getElementById("estimateList");

const clearEstimateBtn =
  document.getElementById("clearEstimateBtn");

const headerCount =
  document.getElementById("headerCount");

const drawerCount =
  document.getElementById("drawerCount");

const bottomCount =
  document.getElementById("bottomCount");

const headerEstimateBtn =
  document.getElementById("headerEstimateBtn");

const bottomEstimateBtn =
  document.getElementById("bottomEstimateBtn");

const toast =
  document.getElementById("toast");


/* =========================================================
   ACTIVE ROTATING BORDER
========================================================= */

function setActive(element){

  if(!element){
    return;
  }

  document
    .querySelectorAll(".is-active")
    .forEach(el => {

      if(el !== element){
        el.classList.remove("is-active");
      }

    });

  element.classList.add("is-active");
}


/* =========================================================
   TEMPORARY ELECTRICAL VISUAL
========================================================= */

function temporaryVisual(material){

  const id = material.id;

  if(id === "pipe"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="18" y="27"
              width="84"
              height="35"
              rx="17"
              fill="none"
              stroke="#00b7ff"
              stroke-width="8"/>
        <line x1="30" y1="35"
              x2="90" y2="35"
              stroke="#ffd21c"
              stroke-width="3"
              opacity=".8"/>
        <line x1="30" y1="55"
              x2="90" y2="55"
              stroke="#087cff"
              stroke-width="3"
              opacity=".8"/>
      </svg>
    `;
  }


  if(id === "bend"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <path d="M28 20 V48 C28 66 42 72 58 72 H94"
              fill="none"
              stroke="#00b7ff"
              stroke-width="12"
              stroke-linecap="round"/>
        <path d="M28 20 V48 C28 66 42 72 58 72 H94"
              fill="none"
              stroke="#ffd21c"
              stroke-width="3"
              stroke-linecap="round"/>
      </svg>
    `;
  }


  if(id === "junction-box"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="28" y="20"
              width="64"
              height="50"
              rx="8"
              fill="#081321"
              stroke="#00b7ff"
              stroke-width="4"/>
        <path d="M8 45 H28 M92 45 H112"
              stroke="#00b7ff"
              stroke-width="8"
              stroke-linecap="round"/>
        <path d="M60 20 V8 M60 70 V82"
              stroke="#ffd21c"
              stroke-width="6"
              stroke-linecap="round"/>
      </svg>
    `;
  }


  if(id === "fan-box"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="25" y="25"
              width="70"
              height="40"
              rx="7"
              fill="#081321"
              stroke="#00b7ff"
              stroke-width="4"/>
        <circle cx="60" cy="45"
                r="11"
                fill="none"
                stroke="#ffd21c"
                stroke-width="4"/>
        <circle cx="39" cy="35"
                r="4"
                fill="#00b7ff"/>
        <circle cx="81" cy="35"
                r="4"
                fill="#00b7ff"/>
        <circle cx="39" cy="55"
                r="4"
                fill="#00b7ff"/>
        <circle cx="81" cy="55"
                r="4"
                fill="#00b7ff"/>
      </svg>
    `;
  }


  if(id === "concealed-light-box"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <circle cx="60"
                cy="45"
                r="29"
                fill="#081321"
                stroke="#00b7ff"
                stroke-width="5"/>
        <circle cx="60"
                cy="45"
                r="15"
                fill="none"
                stroke="#ffd21c"
                stroke-width="5"/>
        <circle cx="60"
                cy="45"
                r="6"
                fill="#00b7ff"/>
      </svg>
    `;
  }


  if(id === "tape"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <circle cx="60"
                cy="45"
                r="29"
                fill="#071321"
                stroke="#00b7ff"
                stroke-width="7"/>
        <circle cx="60"
                cy="45"
                r="12"
                fill="#030711"
                stroke="#ffd21c"
                stroke-width="4"/>
      </svg>
    `;
  }


  if(id === "solvent-cement"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="43" y="20"
              width="34"
              height="53"
              rx="8"
              fill="#081321"
              stroke="#00b7ff"
              stroke-width="4"/>
        <rect x="47" y="12"
              width="26"
              height="12"
              rx="4"
              fill="#ffd21c"/>
        <line x1="50" y1="43"
              x2="70" y2="43"
              stroke="#00b7ff"
              stroke-width="3"/>
      </svg>
    `;
  }


  if(id === "neel-powder"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <path d="M35 25 H85 L80 70 H40 Z"
              fill="#081321"
              stroke="#00b7ff"
              stroke-width="4"/>
        <line x1="42" y1="38"
              x2="78" y2="38"
              stroke="#ffd21c"
              stroke-width="4"/>
        <circle cx="53" cy="55"
                r="4"
                fill="#00b7ff"/>
        <circle cx="67" cy="58"
                r="4"
                fill="#00b7ff"/>
      </svg>
    `;
  }


  if(id === "binding-wire"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <circle cx="60"
                cy="45"
                r="27"
                fill="none"
                stroke="#00b7ff"
                stroke-width="9"/>
        <circle cx="60"
                cy="45"
                r="13"
                fill="#030711"
                stroke="#ffd21c"
                stroke-width="4"/>
      </svg>
    `;
  }


  if(id === "cable-tie"){
    return `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="28" y="38"
              width="65"
              height="13"
              rx="6"
              fill="#081321"
              stroke="#00b7ff"
              stroke-width="4"/>
        <rect x="24" y="31"
              width="20"
              height="27"
              rx="5"
              fill="#081321"
              stroke="#ffd21c"
              stroke-width="4"/>
        <line x1="48" y1="42"
              x2="87" y2="42"
              stroke="#00b7ff"
              stroke-width="3"
              stroke-dasharray="5 4"/>
      </svg>
    `;
  }


  return `
    <svg viewBox="0 0 120 90" aria-hidden="true">
      <circle cx="60"
              cy="45"
              r="25"
              fill="none"
              stroke="#00b7ff"
              stroke-width="5"/>
      <path d="M60 20 V70 M35 45 H85"
            stroke="#ffd21c"
            stroke-width="4"/>
    </svg>
  `;
}


/* =========================================================
   MATERIAL VISUAL
========================================================= */

function getMaterialVisual(material){

  if(
    material.image &&
    String(material.image).trim()
  ){

    return `
      <img
        class="material-image"
        src="${escapeHTML(material.image)}"
        alt="${escapeHTML(material.name)}"
        onerror="
          this.style.display='none';
          this.nextElementSibling.style.display='grid';
        "
      >

      <div
        class="material-visual"
        style="display:none"
        aria-hidden="true"
      >
        ${temporaryVisual(material)}
      </div>
    `;
  }


  return `
    <div
      class="material-visual"
      aria-hidden="true"
    >
      ${temporaryVisual(material)}
    </div>
  `;
}


/* =========================================================
   RENDER MATERIALS
========================================================= */

function renderMaterials(){

  materialsGrid.innerHTML = "";

  STAGE_1.forEach(
    (material,index) => {

      const card =
        document.createElement("article");

      card.className =
        "material-card";

      card.dataset.index = index;

      card.innerHTML = `
        ${getMaterialVisual(material)}

        <div class="material-name">
          ${escapeHTML(material.name)}
        </div>
      `;

      card.addEventListener(
        "click",
        () => {

          setActive(card);

          openMaterial(index);

        }
      );

      materialsGrid.appendChild(card);

    }
  );


  materialCount.textContent =
    STAGE_1.length;
}


/* =========================================================
   VIEW
========================================================= */

function restoreView(){

  const saved =
    localStorage.getItem(VIEW_KEY);

  if(
    saved === "grid" ||
    saved === "list" ||
    saved === "compact"
  ){
    currentView = saved;
  }

  applyView();
}


function applyView(){

  materialsGrid.classList.remove(
    "list-view",
    "compact-view"
  );

  document
    .querySelectorAll(".view-btn")
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        btn.dataset.view === currentView
      );

    });


  if(currentView === "list"){
    materialsGrid.classList.add(
      "list-view"
    );
  }

  if(currentView === "compact"){
    materialsGrid.classList.add(
      "compact-view"
    );
  }
}


/* =========================================================
   OPEN MATERIAL
========================================================= */

function openMaterial(index){

  currentMaterialIndex = index;

  currentMaterial =
    STAGE_1[index];

  currentValues = {};

  quantity = 1;


  const previousDraft =
    getPreviousDraft();


  if(previousDraft){

    currentValues =
      {
        ...previousDraft
      };

    delete currentValues.quantity;
  }


  modalTitle.textContent =
    currentMaterial.name;


  modalMaterialVisual.innerHTML =
    getMaterialVisual(currentMaterial);


  renderForm();


  materialModal.classList.add("open");

  materialModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";
}


/* =========================================================
   PREVIOUS DRAFT
========================================================= */

function getDrafts(){

  try{

    return JSON.parse(
      localStorage.getItem(DRAFT_KEY) || "{}"
    );

  }catch(error){

    return {};
  }
}


function saveDraftData(drafts){

  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(drafts)
  );
}


function getPreviousDraft(){

  const drafts =
    getDrafts();

  const own =
    drafts[currentMaterial.id];

  if(own){
    return own;
  }


  const previousMaterial =
    STAGE_1[
      currentMaterialIndex - 1
    ];


  if(
    !previousMaterial ||
    !drafts[previousMaterial.id]
  ){
    return null;
  }


  const previous =
    drafts[previousMaterial.id];

  const result = {};


  currentMaterial.fields
    .forEach(field => {

      if(
        previous[field.key] !== undefined
      ){

        if(
          field.type === "options" &&
          field.options.includes(
            previous[field.key]
          )
        ){

          result[field.key] =
            previous[field.key];

        }

        if(
          field.type === "text"
        ){

          result[field.key] =
            previous[field.key];

        }
      }

    });


  return result;
}


/* =========================================================
   DEFAULT VALUE
========================================================= */

function getDefaultValue(field){

  if(
    currentValues[field.key] !== undefined
  ){
    return currentValues[field.key];
  }

  return "";
}


/* =========================================================
   FIELD ORDER
   ALL OTHER FIELDS → QUANTITY → UNIT → BRAND
========================================================= */

function getOrderedFields(fields){

  const normal =
    fields.filter(
      f =>
        f.key !== "unit" &&
        f.key !== "brand"
    );

  const unit =
    fields.filter(
      f => f.key === "unit"
    );

  const brand =
    fields.filter(
      f => f.key === "brand"
    );


  return [
    ...normal,
    {
      key:"__quantity",
      label:"Quantity",
      type:"quantity"
    },
    ...unit,
    ...brand
  ];
}


/* =========================================================
   CREATE FIELD
========================================================= */

function createField(field){

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "field";


  const label =
    document.createElement("label");

  label.className =
    "field-label";

  label.innerHTML = `
    ${escapeHTML(field.label)}

    ${
      field.optional
      ?
      `<span class="optional">
        (optional)
      </span>`
      :
      ""
    }
  `;

  wrapper.appendChild(label);


  /* OPTIONS */

  if(field.type === "options"){

    const options =
      document.createElement("div");

    options.className =
      "options";


    field.options.forEach(
      optionValue => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.className =
          "option";

        button.dataset.value =
          optionValue;

        button.textContent =
          optionValue;


        if(
          getDefaultValue(field) ===
          optionValue
        ){

          button.classList.add(
            "selected"
          );
        }


        button.addEventListener(
          "click",
          () => {

            setActive(button);

            options
              .querySelectorAll(".option")
              .forEach(option => {

                option.classList.remove(
                  "selected"
                );

              });

            button.classList.add(
              "selected"
            );

            currentValues[field.key] =
              optionValue;

            saveDraft();

          }
        );


        options.appendChild(button);

      }
    );


    wrapper.appendChild(options);

    return wrapper;
  }


  /* TEXT */

  if(field.type === "text"){

    const input =
      document.createElement("input");

    input.type = "text";

    input.className =
      "text-input";

    input.placeholder =
      `Enter ${field.label}`;

    input.value =
      getDefaultValue(field);


    input.addEventListener(
      "focus",
      () => setActive(input)
    );


    input.addEventListener(
      "input",
      () => {

        currentValues[field.key] =
          input.value;

        saveDraft();

      }
    );


    wrapper.appendChild(input);

    return wrapper;
  }


  return wrapper;
}


/* =========================================================
   QUANTITY FIELD
========================================================= */

function createQuantityField(){

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "field";


  wrapper.innerHTML = `
    <label class="field-label">
      Quantity
    </label>

    <div class="quantity-wrap">

      <button
        class="qty-btn action-btn"
        id="qtyMinus"
        type="button"
      >
        −
      </button>

      <input
        class="qty-input"
        id="qtyInput"
        type="number"
        min="1"
        step="1"
        value="${quantity}"
      >

      <button
        class="qty-btn action-btn"
        id="qtyPlus"
        type="button"
      >
        +
      </button>

    </div>
  `;


  return wrapper;
}


/* =========================================================
   RENDER FORM
========================================================= */

function renderForm(){

  materialForm.innerHTML = "";


  const fields =
    getOrderedFields(
      currentMaterial.fields
    );


  fields.forEach(field => {

    if(field.type === "quantity"){

      materialForm.appendChild(
        createQuantityField()
      );

    }else{

      materialForm.appendChild(
        createField(field)
      );

    }

  });


  setupQuantity();
}


/* =========================================================
   QUANTITY
========================================================= */

function setupQuantity(){

  const input =
    document.getElementById(
      "qtyInput"
    );

  const minus =
    document.getElementById(
      "qtyMinus"
    );

  const plus =
    document.getElementById(
      "qtyPlus"
    );


  if(!input){
    return;
  }


  function update(value){

    let num =
      parseInt(value,10);

    if(
      !Number.isFinite(num) ||
      num < 1
    ){
      num = 1;
    }


    quantity = num;

    input.value =
      num;

  }


  minus.addEventListener(
    "click",
    () => {

      setActive(minus);

      update(quantity - 1);

    }
  );


  plus.addEventListener(
    "click",
    () => {

      setActive(plus);

      update(quantity + 1);

    }
  );


  input.addEventListener(
    "focus",
    () => setActive(input)
  );


  input.addEventListener(
    "input",
    () => {

      update(input.value);

    }
  );

}


/* =========================================================
   READ FORM
========================================================= */

function readForm(){

  const values =
    {
      ...currentValues
    };


  values.quantity =
    quantity;


  currentMaterial.fields
    .forEach(field => {

      if(field.type === "options"){

        const selected =
          materialForm.querySelector(
            `.option.selected[data-value]`
          );


        /*
          The selector above can find another field's
          selected value. So read field specifically.
        */

        const fieldOptions =
          materialForm.querySelectorAll(
            ".field"
          );


        fieldOptions.forEach(
          fieldElement => {

            const label =
              fieldElement
                .querySelector(".field-label");


            if(!label){
              return;
            }


            const options =
              fieldElement
                .querySelectorAll(
                  ".option.selected"
                );


            if(
              options.length === 0
            ){
              return;
            }


            const fieldLabel =
              label.textContent
                .replace("(optional)","")
                .trim();


            if(
              fieldLabel === field.label
            ){

              values[field.key] =
                options[0]
                  .dataset.value;

            }

          }
        );

      }


      if(field.type === "text"){

        const inputs =
          materialForm.querySelectorAll(
            ".text-input"
          );


        inputs.forEach(input => {

          const parent =
            input.closest(".field");

          const label =
            parent
              ?.querySelector(".field-label");


          if(
            label &&
            label.textContent
              .replace("(optional)","")
              .trim() === field.label
          ){

            values[field.key] =
              input.value.trim();

          }

        });

      }

    });


  return values;
}


/* =========================================================
   SAVE DRAFT
========================================================= */

function saveDraft(){

  if(!currentMaterial){
    return;
  }


  const drafts =
    getDrafts();


  drafts[currentMaterial.id] = {
    ...currentValues
  };


  saveDraftData(drafts);
}


/* =========================================================
   VALIDATE
========================================================= */

function validateForm(){

  const values =
    readForm();


  if(
    !Number.isFinite(values.quantity) ||
    values.quantity <= 0
  ){

    showToast(
      "Quantity 1 ya usse zyada honi chahiye."
    );

    return false;
  }


  for(
    const field
    of currentMaterial.fields
  ){

    if(field.optional){
      continue;
    }


    const value =
      values[field.key];


    if(
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ){

      showToast(
        `${field.label} select karein.`
      );

      return false;
    }

  }


  return true;
}


/* =========================================================
   ADD TO ESTIMATE
========================================================= */

function addToEstimate(){

  if(!validateForm()){
    return;
  }


  const values =
    readForm();


  const item = {

    id:
      Date.now().toString(),

    stage:1,

    materialId:
      currentMaterial.id,

    material:
      currentMaterial.name,

    quantity:
      values.quantity,

    values:
      {}
  };


  currentMaterial.fields
    .forEach(field => {

      if(
        values[field.key] !== undefined
      ){

        item.values[field.key] =
          values[field.key];

      }

    });


  estimateItems.push(item);


  localStorage.setItem(
    ESTIMATE_KEY,
    JSON.stringify(
      estimateItems
    )
  );


  saveDraft();


  updateCounters();

  showToast(
    `${currentMaterial.name} estimate me add ho gaya.`
  );


  /*
    ADD ke baad modal close.
  */

  closeMaterial();

  renderEstimate();

}


/* =========================================================
   NEXT MATERIAL
   IMPORTANT:
   NEXT AUTOMATICALLY ADD NAHI KARTA
========================================================= */

function nextMaterial(){

  saveDraft();


  const nextIndex =
    currentMaterialIndex + 1;


  if(
    nextIndex >= STAGE_1.length
  ){

    showToast(
      "Stage 01 ka last material hai."
    );

    return;
  }


  currentMaterialIndex =
    nextIndex;


  currentMaterial =
    STAGE_1[
      currentMaterialIndex
    ];


  openMaterial(
    currentMaterialIndex
  );


  /*
    Material card active
  */

  const card =
    materialsGrid.querySelector(
      `[data-index="${currentMaterialIndex}"]`
    );


  if(card){
    setActive(card);
  }

}


/* =========================================================
   BACK MATERIAL
========================================================= */

function backMaterial(){

  saveDraft();


  const previousIndex =
    currentMaterialIndex - 1;


  if(previousIndex < 0){

    closeMaterial();

    return;
  }


  openMaterial(
    previousIndex
  );


  const card =
    materialsGrid.querySelector(
      `[data-index="${previousIndex}"]`
    );


  if(card){
    setActive(card);
  }

}


/* =========================================================
   CLOSE MATERIAL
========================================================= */

function closeMaterial(){

  if(currentMaterial){
    saveDraft();
  }


  materialModal.classList.remove(
    "open"
  );

  materialModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";
}


/* =========================================================
   LOAD ESTIMATE
========================================================= */

function loadEstimate(){

  try{

    const saved =
      JSON.parse(
        localStorage.getItem(
          ESTIMATE_KEY
        ) || "[]"
      );


    if(Array.isArray(saved)){
      estimateItems = saved;
    }else{
      estimateItems = [];
    }

  }catch(error){

    estimateItems = [];
  }
}


/* =========================================================
   UPDATE COUNTERS
========================================================= */

function updateCounters(){

  const count =
    estimateItems.length;


  headerCount.textContent =
    count;

  drawerCount.textContent =
    count;

  bottomCount.textContent =
    count;
}


/* =========================================================
   RENDER ESTIMATE
========================================================= */

function renderEstimate(){

  if(
    estimateItems.length === 0
  ){

    estimateList.innerHTML = `
      <div class="empty-estimate">
        <div>
          <div style="font-size:35px;margin-bottom:10px;">
            ⚡
          </div>

          <strong>
            Estimate empty hai
          </strong>

          <div style="margin-top:5px;">
            Material select karke
            <br>
            Add to Estimate karein.
          </div>
        </div>
      </div>
    `;

    updateCounters();

    return;
  }


  estimateList.innerHTML = "";


  estimateItems.forEach(item => {

    const element =
      document.createElement("div");

    element.className =
      "estimate-item";


    const detailHTML =
      Object.entries(
        item.values || {}
      )
      .map(
        ([key,value]) => {

          if(
            value === "" ||
            value === undefined ||
            value === null
          ){
            return "";
          }


          return `
            <span class="detail-chip">
              ${escapeHTML(
                labelFor(key)
              )}:
              ${escapeHTML(
                String(value)
              )}
            </span>
          `;

        }
      )
      .join("");


    element.innerHTML = `

      <div class="estimate-item-head">

        <div class="estimate-item-name">
          ${escapeHTML(item.material)}
        </div>

        <div class="estimate-item-qty">
          Qty:
          ${escapeHTML(
            String(item.quantity)
          )}
        </div>

      </div>

      <div class="estimate-details">
        ${detailHTML}
      </div>

      <button
        class="delete-item-btn action-btn"
        data-id="${escapeHTML(item.id)}"
        type="button"
      >
        Delete
      </button>

    `;


    const deleteButton =
      element.querySelector(
        ".delete-item-btn"
      );


    deleteButton.addEventListener(
      "click",
      () => {

        setActive(deleteButton);

        deleteItem(item.id);

      }
    );


    estimateList.appendChild(
      element
    );

  });


  updateCounters();
}


/* =========================================================
   DELETE ITEM
========================================================= */

function deleteItem(id){

  estimateItems =
    estimateItems.filter(
      item => item.id !== id
    );


  localStorage.setItem(
    ESTIMATE_KEY,
    JSON.stringify(
      estimateItems
    )
  );


  renderEstimate();

  showToast(
    "Item estimate se delete ho gaya."
  );
}


/* =========================================================
   CLEAR ESTIMATE
========================================================= */

function clearEstimate(){

  if(
    estimateItems.length === 0
  ){

    showToast(
      "Estimate already empty hai."
    );

    return;
  }


  const confirmClear =
    confirm(
      "Kya aap poora estimate clear karna chahte hain?"
    );


  if(!confirmClear){
    return;
  }


  estimateItems = [];


  localStorage.removeItem(
    ESTIMATE_KEY
  );


  renderEstimate();


  showToast(
    "Estimate clear ho gaya."
  );
}


/* =========================================================
   OPEN ESTIMATE
========================================================= */

function openEstimate(){

  renderEstimate();


  estimateDrawer.classList.add(
    "open"
  );

  estimateDrawer.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";
}


/* =========================================================
   CLOSE ESTIMATE
========================================================= */

function closeEstimate(){

  estimateDrawer.classList.remove(
    "open"
  );

  estimateDrawer.setAttribute(
    "aria-hidden",
    "true"
  );


  if(
    !materialModal.classList.contains(
      "open"
    )
  ){

    document.body.style.overflow =
      "";
  }
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message){

  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );
}


/* =========================================================
   LABELS
========================================================= */

function labelFor(key){

  const labels = {

    type:"Type",
    size:"Size",
    unit:"Unit",
    brand:"Brand",
    subType:"Sub Type",
    shape:"Shape / Ways",
    material:"Material",
    conduitSize:"Conduit Size",
    ways:"Ways / Holes",
    depth:"Depth",
    hookRod:"Hook Rod",
    materialType:"Material Type",
    diameter:"Diameter"

  };


  return labels[key] || key;
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value){

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


/* =========================================================
   STAGE OPEN / CLOSE
========================================================= */

stageOpenBtn.addEventListener(
  "click",
  () => {

    setActive(
      stageOpenBtn
    );


    stageOpen =
      !stageOpen;


    if(stageOpen){

      stageContent.classList.remove(
        "hidden"
      );

      stageOpenBtn.classList.add(
        "open"
      );

      stageOpenBtn.querySelector(
        "span:first-child"
      ).textContent =
        "Close Stage";

    }else{

      stageContent.classList.add(
        "hidden"
      );

      stageOpenBtn.classList.remove(
        "open"
      );

      stageOpenBtn.querySelector(
        "span:first-child"
      ).textContent =
        "Open Stage";
    }

  }
);


/* =========================================================
   VIEW BUTTONS
========================================================= */

document
  .querySelectorAll(".view-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        setActive(button);

        currentView =
          button.dataset.view;

        localStorage.setItem(
          VIEW_KEY,
          currentView
        );

        applyView();

      }
    );

  });


/* =========================================================
   MODAL BUTTONS
========================================================= */

modalCloseBtn.addEventListener(
  "click",
  () => {

    setActive(
      modalCloseBtn
    );

    closeMaterial();

  }
);


modalBackBtn.addEventListener(
  "click",
  () => {

    setActive(
      modalBackBtn
    );

    backMaterial();

  }
);


modalBackdrop.addEventListener(
  "click",
  () => {

    closeMaterial();

  }
);


nextBtn.addEventListener(
  "click",
  () => {

    setActive(
      nextBtn
    );

    nextMaterial();

  }
);


addBtn.addEventListener(
  "click",
  () => {

    setActive(
      addBtn
    );

    addToEstimate();

  }
);


/* =========================================================
   ESTIMATE BUTTONS
========================================================= */

headerEstimateBtn.addEventListener(
  "click",
  () => {

    setActive(
      headerEstimateBtn
    );

    openEstimate();

  }
);


bottomEstimateBtn.addEventListener(
  "click",
  () => {

    setActive(
      bottomEstimateBtn
    );

    openEstimate();

  }
);


drawerCloseBtn.addEventListener(
  "click",
  () => {

    setActive(
      drawerCloseBtn
    );

    closeEstimate();

  }
);


drawerBackdrop.addEventListener(
  "click",
  () => {

    closeEstimate();

  }
);


clearEstimateBtn.addEventListener(
  "click",
  () => {

    setActive(
      clearEstimateBtn
    );

    clearEstimate();

  }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if(
      event.key !== "Escape"
    ){
      return;
    }


    if(
      materialModal.classList.contains(
        "open"
      )
    ){

      closeMaterial();

      return;
    }


    if(
      estimateDrawer.classList.contains(
        "open"
      )
    ){

      closeEstimate();

    }

  }
);


/* =========================================================
   INITIALIZATION
========================================================= */

function init(){

  loadEstimate();

  renderMaterials();

  restoreView();

  renderEstimate();

  updateCounters();

}


init();
