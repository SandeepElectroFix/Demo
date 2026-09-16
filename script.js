'use strict';

/*
  ============================================================
  ESTIMATE LIST APP
  Sandeep ElectroFix
  ============================================================
*/


/* ============================================================
   STORAGE
   ============================================================ */

const STORE = APP_CONFIG.app.storage;


/* ============================================================
   STATE
   ============================================================ */

let state = {

  language:
    localStorage.getItem(STORE.language) ||
    APP_CONFIG.app.defaultLanguage,

  theme:
    localStorage.getItem(STORE.theme) ||
    APP_CONFIG.theme.default,

  view:
    localStorage.getItem(STORE.view) ||
    APP_CONFIG.materialView.default,

  estimate: loadEstimate(),

  currentPage: "home",

  currentStage: null,

  currentMaterialIndex: 0,

  currentMaterial: null,

  editingIndex: -1,

  formData: {},

  previousData: {},

  menuOpen: false

};


/* ============================================================
   TRANSLATIONS
   ============================================================ */

const I18N = {

  en: {

    welcome: "WELCOME",

    estimateList: "Estimate List",

    heroText:
      "Select your electrical material stage and prepare your estimate quickly.",

    home: "Home",

    estimate: "Estimate",

    calculator: "Calculator",

    settings: "Settings",

    currentEstimate: "CURRENT ESTIMATE",

    noItems: "No items added",

    noItemsText:
      "Add materials from a stage to create your estimate.",

    goHome: "Go to Home",

    language: "Language",

    languageText:
      "Choose Hindi or English",

    theme: "Theme",

    themeText:
      "Dark / Light appearance",

    clearEstimate: "Clear Estimate",

    clearEstimateText:
      "Remove all saved estimate items",

    clear: "Clear",

    dark: "Dark",

    light: "Light",

    addToEstimate: "Add to Estimate",

    next: "Next",

    back: "Back",

    updateEstimate: "Update Estimate",

    edit: "Edit",

    delete: "Delete",

    added: "✓ Added to Estimate",

    updated: "✓ Estimate Updated",

    deleted: "✓ Item Deleted",

    noQuantity: "Please enter quantity.",

    selectRequired: "Please select the required options.",

    confirmDelete:
      "Delete this estimate item?",

    confirmClear:
      "Clear the complete estimate?",

    voltage: "Voltage",

    current: "Current",

    power: "Power",

    resistance: "Resistance",

    calculate: "Calculate",

    ohmsLaw: "Ohm's Law",

    invalidCalculation:
      "Enter at least two valid electrical values.",

    calculationResult:
      "Calculated values"

  },


  hi: {

    welcome: "स्वागत है",

    estimateList: "अनुमान सूची",

    heroText:
      "इलेक्ट्रिकल मटेरियल चुनें और अपना अनुमान जल्दी तैयार करें।",

    home: "होम",

    estimate: "अनुमान",

    calculator: "कैलकुलेटर",

    settings: "सेटिंग्स",

    currentEstimate: "वर्तमान अनुमान",

    noItems: "अभी कोई आइटम नहीं",

    noItemsText:
      "अनुमान बनाने के लिए किसी स्टेज से मटेरियल जोड़ें।",

    goHome: "होम पर जाएँ",

    language: "भाषा",

    languageText:
      "हिंदी या English चुनें",

    theme: "थीम",

    themeText:
      "डार्क / लाइट रूप",

    clearEstimate: "अनुमान साफ़ करें",

    clearEstimateText:
      "सभी सेव किए गए अनुमान आइटम हटाएँ",

    clear: "साफ़ करें",

    dark: "डार्क",

    light: "लाइट",

    addToEstimate: "अनुमान में जोड़ें",

    next: "अगला",

    back: "पीछे",

    updateEstimate: "अनुमान अपडेट करें",

    edit: "संपादित करें",

    delete: "हटाएँ",

    added: "✓ अनुमान में जोड़ा गया",

    updated: "✓ अनुमान अपडेट किया गया",

    deleted: "✓ आइटम हटा दिया गया",

    noQuantity: "कृपया मात्रा दर्ज करें।",

    selectRequired:
      "कृपया जरूरी विकल्प चुनें।",

    confirmDelete:
      "क्या यह अनुमान आइटम हटाना है?",

    confirmClear:
      "क्या पूरा अनुमान साफ़ करना है?",

    voltage: "वोल्टेज",

    current: "करंट",

    power: "पावर",

    resistance: "रेजिस्टेंस",

    calculate: "गणना करें",

    ohmsLaw: "ओम का नियम",

    invalidCalculation:
      "कम से कम दो सही इलेक्ट्रिकल मान दर्ज करें।",

    calculationResult:
      "गणना किए गए मान"

  }

};


/* ============================================================
   INIT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  applyTheme();

  applyLanguage();

  setupVisibility();

  buildStageCards();

  renderEstimate();

  setupEvents();

  setTimeout(() => {

    const loading = document.getElementById("loadingScreen");
    const app = document.getElementById("app");

    if (loading) {
      loading.classList.add("hidden");
    }

    if (app) {
      app.classList.remove("hidden");
    }

  }, 450);

});


/* ============================================================
   LOAD / SAVE ESTIMATE
   ============================================================ */

function loadEstimate() {

  try {

    const raw =
      localStorage.getItem(STORE.estimate);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error("Estimate load error:", error);

    return [];

  }

}


function saveEstimate() {

  localStorage.setItem(
    STORE.estimate,
    JSON.stringify(state.estimate)
  );

}


/* ============================================================
   LANGUAGE
   ============================================================ */

function t(key) {

  const lang =
    I18N[state.language] ||
    I18N.en;

  return (
    lang[key] ??
    I18N.en[key] ??
    key
  );

}


function applyLanguage() {

  document.documentElement.lang =
    state.language === "hi"
      ? "hi"
      : "en";

  document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

      const key =
        element.dataset.i18n;

      element.textContent = t(key);

    });


  const languageText =
    state.language === "en"
      ? "हिंदी"
      : "English";


  const languageBtn =
    document.getElementById("languageBtn");

  const settingsLanguageBtn =
    document.getElementById("settingsLanguageBtn");


  if (languageBtn) {
    languageBtn.textContent =
      languageText;
  }

  if (settingsLanguageBtn) {
    settingsLanguageBtn.textContent =
      languageText;
  }


  const themeBtn =
    document.getElementById("themeBtn");

  if (themeBtn) {
    themeBtn.textContent =
      state.theme === "dark"
        ? t("dark")
        : t("light");
  }


  updatePageTitle();

  renderStageCards();

  renderEstimate();

  if (
    state.currentMaterial &&
    document
      .getElementById("materialSheetLayer")
      .classList.contains("open")
  ) {

    renderMaterialForm();

  }

}


/* ============================================================
   LANGUAGE TOGGLE
   ============================================================ */

function toggleLanguage() {

  state.language =
    state.language === "en"
      ? "hi"
      : "en";

  localStorage.setItem(
    STORE.language,
    state.language
  );

  applyLanguage();

}


/* ============================================================
   THEME
   ============================================================ */

function applyTheme() {

  document.body.classList.toggle(
    "light",
    state.theme === "light"
  );

}


function toggleTheme() {

  state.theme =
    state.theme === "dark"
      ? "light"
      : "dark";

  localStorage.setItem(
    STORE.theme,
    state.theme
  );

  applyTheme();

  applyLanguage();

}


/* ============================================================
   CONFIG VISIBILITY
   ============================================================ */

function setupVisibility() {

  const hide = (id) => {

    const el =
      document.getElementById(id);

    if (el) {
      el.classList.add("hidden");
    }

  };


  if (!APP_CONFIG.ui.topbar) {
    hide("topbar");
  }

  if (!APP_CONFIG.ui.menuButton) {
    hide("menuBtn");
  }

  if (!APP_CONFIG.ui.languageButton) {
    hide("languageBtn");
  }

  if (!APP_CONFIG.ui.sideMenu) {
    hide("menuBtn");
  }

  if (!APP_CONFIG.ui.bottomNavigation) {
    hide("bottomNavigation");
  }

  if (!APP_CONFIG.ui.calculator) {
    hide("calculatorPage");
  }

  if (!APP_CONFIG.ui.settings) {
    hide("settingsPage");
  }

  if (!APP_CONFIG.ui.darkMode) {
    hide("themeBtn");
  }

  if (!APP_CONFIG.ui.languageSwitch) {
    hide("languageBtn");
    hide("settingsLanguageBtn");
  }

  if (!APP_CONFIG.ui.hero) {

    const hero =
      document.querySelector(".hero");

    if (hero) {
      hero.classList.add("hidden");
    }

  }

}


/* ============================================================
   EVENTS
   ============================================================ */

function setupEvents() {

  document
    .getElementById("menuBtn")
    ?.addEventListener(
      "click",
      openMenu
    );


  document
    .getElementById("closeMenuBtn")
    ?.addEventListener(
      "click",
      closeMenu
    );


  document
    .getElementById("menuOverlay")
    ?.addEventListener(
      "click",
      closeMenu
    );


  document
    .getElementById("languageBtn")
    ?.addEventListener(
      "click",
      toggleLanguage
    );


  document
    .getElementById("settingsLanguageBtn")
    ?.addEventListener(
      "click",
      toggleLanguage
    );


  document
    .getElementById("themeBtn")
    ?.addEventListener(
      "click",
      toggleTheme
    );


  document
    .getElementById("closeSheetBtn")
    ?.addEventListener(
      "click",
      closeMaterialSheet
    );


  document
    .getElementById("backMaterialBtn")
    ?.addEventListener(
      "click",
      previousMaterial
    );


  document
    .getElementById("nextMaterialBtn")
    ?.addEventListener(
      "click",
      nextMaterial
    );


  document
    .getElementById("addMaterialBtn")
    ?.addEventListener(
      "click",
      addOrUpdateMaterial
    );


  document
    .getElementById("goHomeBtn")
    ?.addEventListener(
      "click",
      () => showPage("home")
    );


  document
    .getElementById("clearEstimateBtn")
    ?.addEventListener(
      "click",
      clearEstimate
    );


  document
    .getElementById("calculateBtn")
    ?.addEventListener(
      "click",
      calculateElectrical
    );


  document
    .querySelectorAll(
      ".bottom-nav-item"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const page =
            button.dataset.page;

          showPage(page);

        }
      );

    });


  document
    .querySelectorAll(
      ".menu-item"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const page =
            button.dataset.page;

          closeMenu();

          showPage(page);

        }
      );

    });

}


/* ============================================================
   PAGE NAVIGATION
   ============================================================ */

function showPage(page) {

  const pages = [
    "home",
    "estimate",
    "calculator",
    "settings"
  ];


  if (
    !APP_CONFIG.navigation.pages[page]
  ) {
    return;
  }


  pages.forEach(name => {

    const section =
      document.getElementById(
        `${name}Page`
      );

    if (!section) {
      return;
    }

    section.classList.toggle(
      "hidden",
      name !== page
    );

  });


  document
    .querySelectorAll(
      ".bottom-nav-item"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === page
      );

    });


  state.currentPage = page;

  updatePageTitle();

}


function updatePageTitle() {

  const title =
    document.getElementById("pageTitle");

  if (!title) {
    return;
  }


  const titles = {

    home: t("estimateList"),

    estimate: t("estimate"),

    calculator: t("calculator"),

    settings: t("settings")

  };


  title.textContent =
    titles[state.currentPage] ||
    t("estimateList");

}


/* ============================================================
   MENU
   ============================================================ */

function openMenu() {

  if (!APP_CONFIG.ui.sideMenu) {
    return;
  }

  document
    .getElementById("sideMenu")
    ?.classList.add("open");

  document
    .getElementById("menuOverlay")
    ?.classList.add("open");

}


function closeMenu() {

  document
    .getElementById("sideMenu")
    ?.classList.remove("open");

  document
    .getElementById("menuOverlay")
    ?.classList.remove("open");

}


/* ============================================================
   STAGES
   ============================================================ */

function getVisibleStages() {

  const stages = [];

  if (
    APP_CONFIG.stages.stage1 &&
    MATERIAL_CONFIG.stage1
  ) {
    stages.push(MATERIAL_CONFIG.stage1);
  }

  return stages;

}


function buildStageCards() {

  renderStageCards();

}


function renderStageCards() {

  const container =
    document.getElementById("stageGrid");

  if (!container) {
    return;
  }


  container.innerHTML = "";


  getVisibleStages()
    .forEach(stage => {

      const card =
        document.createElement("button");

      card.type = "button";

      card.className =
        "stage-card";


      card.innerHTML = `

        <div class="stage-number">
          ${escapeHTML(stage.no.replace("STAGE ", ""))}
        </div>

        <div class="stage-info">

          <h3>
            ${escapeHTML(
              stage.name[state.language]
            )}
          </h3>

          <p>
            ${stage.materials.length}
            ${state.language === "hi"
              ? "मटेरियल"
              : "Materials"}
          </p>

        </div>

        <div class="stage-arrow">
          →
        </div>

      `;


      card.addEventListener(
        "click",
        () => openStage(stage)
      );


      container.appendChild(card);

    });

}


/* ============================================================
   OPEN STAGE
   ============================================================ */

function openStage(stage) {

  state.currentStage = stage;

  state.currentMaterialIndex = 0;

  state.editingIndex = -1;

  state.previousData = {};

  openMaterial(
    stage,
    0
  );

}


/* ============================================================
   MATERIAL
   ============================================================ */

function openMaterial(
  stage,
  index,
  options = {}
) {

  const material =
    stage.materials[index];

  if (!material) {
    return;
  }


  state.currentStage = stage;

  state.currentMaterialIndex = index;

  state.currentMaterial = material;


  const isEditing =
    options.editing === true;


  state.editingIndex =
    isEditing
      ? options.estimateIndex
      : -1;


  if (isEditing) {

    const item =
      state.estimate[
        options.estimateIndex
      ];


    state.formData =
      clone(item.data);

  } else {

    state.formData =
      createNewFormData(material);

  }


  updateSheetHeader();

  renderMaterialForm();

  updateSheetButtons();

  openSheet();

}


/* ============================================================
   NEW FORM
   ============================================================ */

function createNewFormData(material) {

  const old =
    state.previousData || {};


  const data = {};


  /*
    Carry forward:
    size
    conduitSize
    type
    unit
    brand

    Quantity is intentionally NOT carried.
  */

  [
    "size",
    "conduitSize",
    "type",
    "unit",
    "brand"
  ]
  .forEach(key => {

    if (
      old[key] !== undefined
    ) {

      data[key] =
        old[key];

    } else {

      data[key] = "";

    }

  });


  data.quantity = "";


  /*
    These do not automatically carry forward.
  */

  data.subType = "";
  data.shape = "";
  data.material = "";


  return data;

}


/* ============================================================
   MATERIAL FORM
   ============================================================ */

function renderMaterialForm() {

  const container =
    document.getElementById(
      "materialForm"
    );

  if (!container) {
    return;
  }


  container.innerHTML = "";


  if (!state.currentMaterial) {
    return;
  }


  container.classList.toggle(
    "compact",
    state.view === "compact"
  );


  /*
    View switch is shown above material fields.
  */

  if (
    APP_CONFIG.ui.materialViewSwitch
  ) {

    const viewSection =
      document.createElement("div");

    viewSection.className =
      "field-section";


    const title =
      document.createElement("div");

    title.className =
      "field-title";

    title.textContent =
      state.language === "hi"
        ? "दृश्य"
        : "View";


    const grid =
      document.createElement("div");

    grid.className =
      "option-grid";


    [
      ["grid", "▦", "Grid", "ग्रिड"],
      ["list", "☰", "List", "लिस्ट"],
      ["compact", "▤", "Compact", "कॉम्पैक्ट"]
    ]
    .forEach(item => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "option-btn";

      button.classList.toggle(
        "selected",
        state.view === item[0]
      );

      button.innerHTML = `
        ${item[1]} 
        ${state.language === "hi"
          ? item[3]
          : item[2]}
      `;


      button.addEventListener(
        "click",
        () => {

          state.view =
            item[0];

          localStorage.setItem(
            STORE.view,
            state.view
          );

          renderMaterialForm();

        }
      );


      grid.appendChild(button);

    });


    viewSection.appendChild(title);

    viewSection.appendChild(grid);

    container.appendChild(viewSection);

  }


  /*
    Render each material field
  */

  state.currentMaterial.flow
    .forEach(field => {

      if (field === "quantity") {

        renderQuantityField(
          container
        );

        return;

      }


      renderOptionField(
        container,
        field
      );

    });

}


/* ============================================================
   OPTION FIELD
   ============================================================ */

function renderOptionField(
  container,
  field
) {

  const options =
    state.currentMaterial
      .options[field];


  if (!options) {
    return;
  }


  const section =
    document.createElement("div");

  section.className =
    "field-section";


  const title =
    document.createElement("div");

  title.className =
    "field-title";


  const fieldLabel =
    MATERIAL_FIELD_LABELS[field];


  title.textContent =
    fieldLabel
      ? fieldLabel[state.language]
      : field;


  if (field === "brand") {

    const optional =
      document.createElement("span");

    optional.className =
      "optional-label";

    optional.textContent =
      state.language === "hi"
        ? "(वैकल्पिक)"
        : "(Optional)";

    title.appendChild(optional);

  }


  const grid =
    document.createElement("div");

  grid.className =
    "option-grid";


  /*
    View-specific sizing
  */

  if (state.view === "list") {

    grid.style.gridTemplateColumns =
      "1fr";

  }


  if (state.view === "compact") {

    grid.style.gridTemplateColumns =
      "repeat(3, 1fr)";

  }


  options.forEach(option => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "option-btn";


    button.classList.toggle(
      "selected",
      state.formData[field] ===
      option.value
    );


    button.textContent =
      option.label[state.language];


    button.addEventListener(
      "click",
      () => {

        state.formData[field] =
          option.value;

        renderMaterialForm();

      }
    );


    grid.appendChild(button);

  });


  /*
    Brand is optional.
    Blank button allows user to leave it empty.
  */

  if (field === "brand") {

    const blank =
      document.createElement("button");

    blank.type = "button";

    blank.className =
      "skip-brand-btn";

    blank.textContent =
      state.language === "hi"
        ? "ब्रांड नहीं चुनना"
        : "Leave Brand Blank";


    blank.classList.toggle(
      "selected",
      !state.formData.brand
    );


    blank.addEventListener(
      "click",
      () => {

        state.formData.brand = "";

        renderMaterialForm();

      }
    );


    section.appendChild(title);

    section.appendChild(grid);

    section.appendChild(blank);

  } else {

    section.appendChild(title);

    section.appendChild(grid);

  }


  container.appendChild(section);

}


/* ============================================================
   QUANTITY FIELD
   ============================================================ */

function renderQuantityField(
  container
) {

  const section =
    document.createElement("div");

  section.className =
    "field-section";


  const title =
    document.createElement("div");

  title.className =
    "field-title";

  title.textContent =
    MATERIAL_FIELD_LABELS.quantity[
      state.language
    ];


  const quantityBox =
    document.createElement("div");

  quantityBox.className =
    "quantity-box";


  if (APP_CONFIG.ui.quantityStepper) {

    const minus =
      document.createElement("button");

    minus.type = "button";

    minus.className =
      "quantity-step-btn";

    minus.textContent = "−";


    minus.addEventListener(
      "click",
      () => changeQuantity(-1)
    );


    quantityBox.appendChild(minus);

  }


  const input =
    document.createElement("input");

  input.type = "number";

  input.inputMode = "numeric";

  input.min =
    APP_CONFIG.quantity.minimum;

  input.step = "1";

  input.className =
    "quantity-input";

  input.placeholder =
    state.language === "hi"
      ? "मात्रा"
      : "Qty";

  input.value =
    state.formData.quantity || "";


  input.addEventListener(
    "input",
    () => {

      state.formData.quantity =
        sanitizeQuantity(
          input.value
        );

    }
  );


  quantityBox.appendChild(input);


  if (APP_CONFIG.ui.quantityStepper) {

    const plus =
      document.createElement("button");

    plus.type = "button";

    plus.className =
      "quantity-step-btn";

    plus.textContent = "+";


    plus.addEventListener(
      "click",
      () => changeQuantity(1)
    );


    quantityBox.appendChild(plus);

  }


  section.appendChild(title);

  section.appendChild(quantityBox);


  /*
    Quick quantity
  */

  if (
    APP_CONFIG.ui.quantityQuickButtons
  ) {

    const quick =
      document.createElement("div");

    quick.className =
      "quick-quantity";


    APP_CONFIG.quantity.quickValues
      .forEach(value => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.textContent =
          value;


        button.classList.toggle(
          "selected",
          Number(
            state.formData.quantity
          ) === value
        );


        button.addEventListener(
          "click",
          () => {

            state.formData.quantity =
              value;

            renderMaterialForm();

          }
        );


        quick.appendChild(button);

      });


    section.appendChild(quick);

  }


  container.appendChild(section);

}


/* ============================================================
   QUANTITY
   ============================================================ */

function sanitizeQuantity(value) {

  const number =
    parseInt(value, 10);


  if (
    Number.isNaN(number) ||
    number < 1
  ) {
    return "";
  }


  return number;

}


function changeQuantity(amount) {

  let quantity =
    Number(
      state.formData.quantity
    );


  if (!quantity) {
    quantity =
      APP_CONFIG.quantity.minimum;
  } else {

    quantity += amount;

  }


  if (
    quantity <
    APP_CONFIG.quantity.minimum
  ) {

    quantity =
      APP_CONFIG.quantity.minimum;

  }


  state.formData.quantity =
    quantity;


  renderMaterialForm();

}


/* ============================================================
   SHEET HEADER
   ============================================================ */

function updateSheetHeader() {

  if (!state.currentStage ||
      !state.currentMaterial) {
    return;
  }


  document.getElementById(
    "sheetStageName"
  ).textContent =
    state.currentStage.no;


  document.getElementById(
    "sheetMaterialName"
  ).textContent =
    state.currentMaterial
      .name[state.language];


  const total =
    state.currentStage.materials.length;


  const current =
    state.currentMaterialIndex + 1;


  document.getElementById(
    "sheetProgressText"
  ).textContent =
    `${current} / ${total}`;


  const percentage =
    (current / total) * 100;


  document.getElementById(
    "sheetProgressBar"
  ).style.width =
    `${percentage}%`;

}


/* ============================================================
   SHEET BUTTONS
   ============================================================ */

function updateSheetButtons() {

  const back =
    document.getElementById(
      "backMaterialBtn"
    );

  const next =
    document.getElementById(
      "nextMaterialBtn"
    );

  const add =
    document.getElementById(
      "addMaterialBtn"
    );


  if (back) {

    back.classList.toggle(
      "hidden",
      !APP_CONFIG.ui.backButton
    );

  }


  if (next) {

    next.classList.toggle(
      "hidden",
      !APP_CONFIG.ui.nextButton
    );

  }


  if (add) {

    add.classList.toggle(
      "hidden",
      !APP_CONFIG.ui.addButton
    );


    if (state.editingIndex >= 0) {

      add.innerHTML =
        `✓ <span>${t("updateEstimate")}</span>`;

    } else {

      add.innerHTML =
        `+ <span>${t("addToEstimate")}</span>`;

    }

  }

}


/* ============================================================
   OPEN / CLOSE SHEET
   ============================================================ */

function openSheet() {

  document
    .getElementById(
      "materialSheetLayer"
    )
    .classList.add("open");


  document.body.style.overflow =
    "hidden";

}


function closeMaterialSheet() {

  document
    .getElementById(
      "materialSheetLayer"
    )
    .classList.remove("open");


  document.body.style.overflow =
    "";


  state.currentMaterial = null;

  state.editingIndex = -1;

}


/* ============================================================
   VALIDATE
   ============================================================ */

function validateForm() {

  const material =
    state.currentMaterial;


  if (!material) {
    return false;
  }


  /*
    Quantity required
  */

  const quantity =
    Number(
      state.formData.quantity
    );


  if (
    !quantity ||
    quantity < 1
  ) {

    showToast(
      t("noQuantity")
    );

    return false;

  }


  /*
    Required fields
    Brand intentionally optional.
  */

  const requiredFields =
    material.flow.filter(
      field =>
        field !== "quantity" &&
        field !== "brand"
    );


  for (const field of requiredFields) {

    if (
      !state.formData[field]
    ) {

      showToast(
        t("selectRequired")
      );

      return false;

    }

  }


  return true;

}


/* ============================================================
   ADD / UPDATE
   ============================================================ */

function addOrUpdateMaterial() {

  if (!validateForm()) {
    return;
  }


  if (state.editingIndex >= 0) {

    /*
      UPDATE EXISTING
      No duplicate created.
    */

    const existing =
      state.estimate[
        state.editingIndex
      ];


    state.estimate[
      state.editingIndex
    ] = {

      ...existing,

      data: clone(
        state.formData
      )

    };


    saveEstimate();

    renderEstimate();

    showToast(
      t("updated")
    );


    closeMaterialSheet();

    showPage("estimate");

    return;

  }


  /*
    ADD NEW
  */

  const newItem = {

    id:
      createId(),

    stageId:
      state.currentStage.id,

    stageName:
      clone(state.currentStage.name),

    materialId:
      state.currentMaterial.id,

    materialName:
      clone(state.currentMaterial.name),

    data:
      clone(state.formData),

    createdAt:
      Date.now()

  };


  state.estimate.push(
    newItem
  );


  saveEstimate();

  renderEstimate();

  showToast(
    t("added")
  );


  /*
    Carry forward ONLY selected
    fields. Quantity resets.
  */

  state.previousData =
    createCarryData(
      state.formData
    );


  /*
    After Add:
    automatically open next material.
  */

  const nextIndex =
    state.currentMaterialIndex + 1;


  if (
    state.currentStage &&
    nextIndex <
    state.currentStage.materials.length
  ) {

    setTimeout(() => {

      openMaterial(
        state.currentStage,
        nextIndex
      );

    }, 180);

  } else {

    setTimeout(() => {

      closeMaterialSheet();

    }, 180);

  }

}


/* ============================================================
   CARRY FORWARD
   ============================================================ */

function createCarryData(data) {

  const carry = {};

  [
    "size",
    "conduitSize",
    "type",
    "unit",
    "brand"
  ]
  .forEach(key => {

    if (
      data[key] !== undefined
    ) {

      carry[key] =
        data[key];

    }

  });


  /*
    Quantity deliberately omitted.
  */

  return carry;

}


/* ============================================================
   NEXT
   ============================================================ */

function nextMaterial() {

  if (!state.currentStage) {
    return;
  }


  /*
    IMPORTANT:
    Next does NOT add current item.
  */

  const nextIndex =
    state.currentMaterialIndex + 1;


  if (
    nextIndex >=
    state.currentStage.materials.length
  ) {

    /*
      At last material, don't auto-add.
      Just show a small message.
    */

    showToast(
      state.language === "hi"
        ? "यह अंतिम आइटम है"
        : "This is the last item"
    );

    return;

  }


  /*
    Carry forward selected values,
    but quantity resets.
  */

  state.previousData =
    createCarryData(
      state.formData
    );


  openMaterial(
    state.currentStage,
    nextIndex
  );


  scrollSheetTop();

}


/* ============================================================
   BACK
   ============================================================ */

function previousMaterial() {

  if (!state.currentStage) {
    return;
  }


  const previousIndex =
    state.currentMaterialIndex - 1;


  if (previousIndex < 0) {

    closeMaterialSheet();

    return;

  }


  state.previousData =
    createCarryData(
      state.formData
    );


  openMaterial(
    state.currentStage,
    previousIndex
  );


  scrollSheetTop();

}


/* ============================================================
   SCROLL TOP
   ============================================================ */

function scrollSheetTop() {

  requestAnimationFrame(() => {

    const form =
      document.getElementById(
        "materialForm"
      );

    if (form) {
      form.scrollTop = 0;
    }

  });

}


/* ============================================================
   ESTIMATE RENDER
   ============================================================ */

function renderEstimate() {

  const list =
    document.getElementById(
      "estimateList"
    );

  const empty =
    document.getElementById(
      "estimateEmpty"
    );

  const count =
    document.getElementById(
      "estimateCount"
    );


  if (!list) {
    return;
  }


  list.innerHTML = "";


  if (count) {
    count.textContent =
      state.estimate.length;
  }


  if (!state.estimate.length) {

    empty?.classList.remove(
      "hidden"
    );

    return;

  }


  empty?.classList.add(
    "hidden"
  );


  state.estimate.forEach(
    (item, index) => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "estimate-card";


      const details =
        formatEstimateDetails(
          item
        );


      const actions =
        document.createElement(
          "div"
        );

      actions.className =
        "estimate-actions";


      if (
        APP_CONFIG.ui.estimateEdit
      ) {

        const edit =
          document.createElement(
            "button"
          );

        edit.type = "button";

        edit.className =
          "icon-action";

        edit.textContent =
          "✎";

        edit.title =
          t("edit");


        edit.addEventListener(
          "click",
          () => editEstimate(index)
        );


        actions.appendChild(edit);

      }


      if (
        APP_CONFIG.ui.estimateDelete
      ) {

        const del =
          document.createElement(
            "button"
          );

        del.type = "button";

        del.className =
          "icon-action delete";

        del.textContent =
          "×";

        del.title =
          t("delete");


        del.addEventListener(
          "click",
          () => deleteEstimate(index)
        );


        actions.appendChild(del);

      }


      card.innerHTML = `

        <div class="estimate-card-top">

          <div class="estimate-number">
            ${index + 1}
          </div>

          <div class="estimate-main">

            <div class="estimate-name">
              ${escapeHTML(
                item.materialName[
                  state.language
                ]
              )}
            </div>

            <div class="estimate-details">
              ${details}
            </div>

          </div>

        </div>

      `;


      const top =
        card.querySelector(
          ".estimate-card-top"
        );


      top.appendChild(actions);

      list.appendChild(card);

    }
  );

}


/* ============================================================
   ESTIMATE DETAILS
   ============================================================ */

function formatEstimateDetails(item) {

  const material =
    findMaterial(
      item.stageId,
      item.materialId
    );


  if (!material) {
    return "";
  }


  const parts = [];


  material.flow.forEach(
    field => {

      const value =
        item.data[field];


      if (
        value === undefined ||
        value === ""
      ) {
        return;
      }


      let display =
        escapeHTML(
          String(value)
        );


      const option =
        material.options?.[field]
          ?.find(
            item =>
              item.value === value
          );


      if (option) {

        display =
          escapeHTML(
            option.label[
              state.language
            ]
          );

      }


      const label =
        MATERIAL_FIELD_LABELS[field];


      const labelText =
        label
          ? label[state.language]
          : field;


      parts.push(
        `<strong>${escapeHTML(labelText)}:</strong> ${display}`
      );

    }
  );


  return parts.join(" • ");

}


/* ============================================================
   FIND MATERIAL
   ============================================================ */

function findMaterial(
  stageId,
  materialId
) {

  if (
    stageId === 1 &&
    MATERIAL_CONFIG.stage1
  ) {

    return MATERIAL_CONFIG.stage1
      .materials
      .find(
        material =>
          material.id === materialId
      );

  }


  return null;

}


/* ============================================================
   EDIT
   ============================================================ */

function editEstimate(index) {

  const item =
    state.estimate[index];


  if (!item) {
    return;
  }


  const stage =
    getStageById(
      item.stageId
    );


  if (!stage) {
    return;
  }


  const materialIndex =
    stage.materials.findIndex(
      material =>
        material.id ===
        item.materialId
    );


  if (materialIndex < 0) {
    return;
  }


  openMaterial(
    stage,
    materialIndex,
    {
      editing: true,
      estimateIndex: index
    }
  );


  scrollSheetTop();

}


/* ============================================================
   GET STAGE
   ============================================================ */

function getStageById(id) {

  if (
    id === 1 &&
    MATERIAL_CONFIG.stage1
  ) {

    return MATERIAL_CONFIG.stage1;

  }


  return null;

}


/* ============================================================
   DELETE
   ============================================================ */

function deleteEstimate(index) {

  if (
    !confirm(
      t("confirmDelete")
    )
  ) {
    return;
  }


  state.estimate.splice(
    index,
    1
  );


  saveEstimate();

  renderEstimate();

  showToast(
    t("deleted")
  );

}


/* ============================================================
   CLEAR
   ============================================================ */

function clearEstimate() {

  if (!state.estimate.length) {
    return;
  }


  if (
    !confirm(
      t("confirmClear")
    )
  ) {
    return;
  }


  state.estimate = [];

  saveEstimate();

  renderEstimate();

}


/* ============================================================
   CALCULATOR
   ============================================================ */

function calculateElectrical() {

  const voltage =
    getNumber(
      "calcVoltage"
    );

  const current =
    getNumber(
      "calcCurrent"
    );

  const power =
    getNumber(
      "calcPower"
    );

  const resistance =
    getNumber(
      "calcResistance"
    );


  let result = [];


  /*
    V = I × R
  */

  if (
    voltage !== null &&
    current !== null
  ) {

    result.push(
      `R = ${(voltage / current).toFixed(2)} Ω`
    );

  }


  if (
    voltage !== null &&
    resistance !== null
  ) {

    result.push(
      `I = ${(voltage / resistance).toFixed(2)} A`
    );

  }


  if (
    current !== null &&
    resistance !== null
  ) {

    result.push(
      `V = ${(current * resistance).toFixed(2)} V`
    );

  }


  /*
    P = V × I
  */

  if (
    voltage !== null &&
    current !== null
  ) {

    result.push(
      `P = ${(voltage * current).toFixed(2)} W`
    );

  }


  if (
    power !== null &&
    voltage !== null
  ) {

    result.push(
      `I = ${(power / voltage).toFixed(2)} A`
    );

  }


  if (
    power !== null &&
    current !== null
  ) {

    result.push(
      `V = ${(power / current).toFixed(2)} V`
    );

  }


  if (
    power !== null &&
    voltage !== null &&
    current !== null
  ) {

    result.push(
      `P = ${power.toFixed(2)} W`
    );

  }


  const output =
    document.getElementById(
      "calcResult"
    );


  if (!result.length) {

    output.textContent =
      t("invalidCalculation");

    return;

  }


  output.innerHTML =
    `<strong>${escapeHTML(
      t("calculationResult")
    )}</strong><br>` +
    result
      .map(
        item =>
          escapeHTML(item)
      )
      .join("<br>");

}


function getNumber(id) {

  const element =
    document.getElementById(id);


  if (!element) {
    return null;
  }


  const value =
    parseFloat(
      element.value
    );


  if (
    Number.isNaN(value) ||
    value <= 0
  ) {
    return null;
  }


  return value;

}


/* ============================================================
   TOAST
   ============================================================ */

let toastTimer = null;

function showToast(message) {

  if (!APP_CONFIG.ui.toast) {
    return;
  }


  const toast =
    document.getElementById(
      "toast"
    );

  const text =
    document.getElementById(
      "toastText"
    );


  if (!toast || !text) {
    return;
  }


  text.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 1600);

}


/* ============================================================
   HELPERS
   ============================================================ */

function clone(value) {

  return JSON.parse(
    JSON.stringify(value)
  );

}


function createId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
