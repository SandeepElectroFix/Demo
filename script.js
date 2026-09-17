"use strict";

/*
============================================================
SANDEEP ELECTROFIX
ESTIMATE LIST
MAIN APP
============================================================
*/


/* =========================================================
   SAFE CONFIG FALLBACK
   ========================================================= */

if (
  typeof APP_CONFIG === "undefined"
) {

  window.APP_CONFIG = {

    app: {

      name: "Estimate List",

      owner: "Sandeep ElectroFix",

      tagline: "Powering Your Trust",

      defaultLanguage: "en",

      storage: {

        language: "sandeepMaterialLang",

        estimate: "sandeepEstimateItems",

        view: "sandeepMaterialView",

        theme: "sandeepTheme"

      }

    },


    ui: {

      topbar: true,

      menuButton: true,

      languageButton: true,

      sideMenu: true,

      homePage: true,

      hero: true,

      stageCards: true,

      materialImages: true,

      materialViewSwitch: true,

      quantityQuickButtons: true,

      quantityStepper: true,

      addButton: true,

      nextButton: true,

      backButton: true,

      estimateEdit: true,

      estimateDelete: true,

      bottomNavigation: true,

      calculator: true,

      settings: true,

      darkMode: true,

      languageSwitch: true,

      toast: true

    },


    navigation: {

      pages: {

        home: true,

        estimate: true,

        calculator: true,

        settings: true

      }

    },


    stages: {

      stage1: true,

      stage2: false,

      stage3: false,

      stage4: false,

      stage5: false

    },


    materialView: {

      default: "grid"

    },


    quantity: {

      minimum: 1,

      quickValues: [
        1,
        5,
        10,
        20,
        25,
        50,
        100
      ]

    },

    theme: {

      default: "dark"

    }

  };

}


/* =========================================================
   SAFE MATERIAL FALLBACK
   ========================================================= */

if (
  typeof MATERIAL_CONFIG === "undefined"
) {

  window.MATERIAL_CONFIG = {

    stage1: {

      id: 1,

      no: "STAGE 01",

      name: {

        en: "Slab Conduit Installation",

        hi: "स्लैब कन्ड्यूट इंस्टॉलेशन"

      },

      materials: []

    }

  };

}


/* =========================================================
   STORAGE
   ========================================================= */

const STORE = APP_CONFIG.app.storage;


/* =========================================================
   TRANSLATIONS
   ========================================================= */

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

    updateEstimate: "Update Estimate",

    next: "Next",

    back: "Back",

    edit: "Edit",

    delete: "Delete",

    added: "✓ Added to Estimate",

    updated: "✓ Estimate Updated",

    deleted: "✓ Item Deleted",

    noQuantity: "Please enter quantity.",

    selectRequired:
      "Please select the required options.",

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
      "Calculated values",

    lastItem:
      "This is the last item."

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

    updateEstimate: "अनुमान अपडेट करें",

    next: "अगला",

    back: "पीछे",

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
      "गणना किए गए मान",

    lastItem:
      "यह अंतिम आइटम है।"

  }

};


/* =========================================================
   STATE
   ========================================================= */

let state = {

  language: "en",

  theme: "dark",

  view: "grid",

  estimate: [],

  currentPage: "home",

  currentStage: null,

  currentMaterialIndex: 0,

  currentMaterial: null,

  editingIndex: -1,

  formData: {},

  previousData: {}

};


/* =========================================================
   SAFE START
   ========================================================= */

function safeStorageGet(
  key,
  fallback
) {

  try {

    const value =
      localStorage.getItem(key);

    return value === null
      ? fallback
      : value;

  } catch (error) {

    console.warn(
      "localStorage read failed:",
      error
    );

    return fallback;

  }

}


function safeStorageSet(
  key,
  value
) {

  try {

    localStorage.setItem(
      key,
      value
    );

  } catch (error) {

    console.warn(
      "localStorage write failed:",
      error
    );

  }

}


/* =========================================================
   INITIALIZE STATE
   ========================================================= */

function initializeState() {

  const storedLanguage =
    safeStorageGet(
      STORE.language,
      APP_CONFIG.app.defaultLanguage
    );


  state.language =
    storedLanguage === "hi"
      ? "hi"
      : "en";


  const storedTheme =
    safeStorageGet(
      STORE.theme,
      APP_CONFIG.theme.default
    );


  state.theme =
    storedTheme === "light"
      ? "light"
      : "dark";


  const storedView =
    safeStorageGet(
      STORE.view,
      APP_CONFIG.materialView.default
    );


  state.view =
    [
      "grid",
      "list",
      "compact"
    ].includes(storedView)
      ? storedView
      : "grid";


  state.estimate =
    loadEstimate();

}


/* =========================================================
   LOAD ESTIMATE
   ========================================================= */

function loadEstimate() {

  try {

    const raw =
      localStorage.getItem(
        STORE.estimate
      );


    if (!raw) {
      return [];
    }


    const data =
      JSON.parse(raw);


    if (!Array.isArray(data)) {
      return [];
    }


    return data.filter(
      item =>
        item &&
        typeof item === "object"
    );

  } catch (error) {

    console.warn(
      "Estimate data was invalid:",
      error
    );

    /*
      IMPORTANT:
      Invalid old data must not stop app.
    */

    return [];

  }

}


function saveEstimate() {

  try {

    localStorage.setItem(
      STORE.estimate,
      JSON.stringify(
        state.estimate
      )
    );

  } catch (error) {

    console.warn(
      "Could not save estimate:",
      error
    );

  }

}


/* =========================================================
   DOM READY
   ========================================================= */

function startApp() {

  try {

    initializeState();

    applyTheme();

    applyLanguage();

    setupVisibility();

    renderStageCards();

    renderEstimate();

    setupEvents();

    hideLoading();

  } catch (error) {

    /*
      Critical protection:
      Any unexpected error should NEVER leave the
      flash screen permanently visible.
    */

    console.error(
      "Application startup error:",
      error
    );

    emergencyOpenApp();

  }

}


/* =========================================================
   HIDE LOADING
   ========================================================= */

function hideLoading() {

  try {

    const loader =
      document.getElementById(
        "loadingScreen"
      );

    const app =
      document.getElementById(
        "app"
      );


    if (loader) {

      loader.classList.add(
        "hidden"
      );

    }


    if (app) {

      app.classList.remove(
        "hidden"
      );

    }


    document.body.style.overflow = "";

  } catch (error) {

    console.error(
      "hideLoading error:",
      error
    );

  }

}


/* =========================================================
   EMERGENCY APP OPEN
   ========================================================= */

function emergencyOpenApp() {

  try {

    const loader =
      document.getElementById(
        "loadingScreen"
      );

    const app =
      document.getElementById(
        "app"
      );


    if (loader) {

      loader.classList.add(
        "hidden"
      );

    }


    if (app) {

      app.classList.remove(
        "hidden"
      );

    }

  } catch (error) {

    console.error(
      "Emergency open failed:",
      error
    );

  }

}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startApp,
    {
      once: true
    }
  );

} else {

  startApp();

}


/* =========================================================
   TRANSLATION
   ========================================================= */

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


/* =========================================================
   LANGUAGE
   ========================================================= */

function applyLanguage() {

  try {

    document.documentElement.lang =
      state.language === "hi"
        ? "hi"
        : "en";


    document
      .querySelectorAll(
        "[data-i18n]"
      )
      .forEach(element => {

        const key =
          element.dataset.i18n;


        if (
          Object.prototype.hasOwnProperty
            .call(
              I18N[state.language] || {},
              key
            )
        ) {

          element.textContent =
            t(key);

        }

      });


    const languageText =
      state.language === "en"
        ? "हिंदी"
        : "English";


    const languageBtn =
      document.getElementById(
        "languageBtn"
      );


    const settingsLanguageBtn =
      document.getElementById(
        "settingsLanguageBtn"
      );


    if (languageBtn) {

      languageBtn.textContent =
        languageText;

    }


    if (settingsLanguageBtn) {

      settingsLanguageBtn.textContent =
        languageText;

    }


    const themeBtn =
      document.getElementById(
        "themeBtn"
      );


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
        .getElementById(
          "materialSheetLayer"
        )
        ?.classList.contains("open")
    ) {

      updateSheetHeader();

      renderMaterialForm();

      updateSheetButtons();

    }

  } catch (error) {

    console.error(
      "Language update error:",
      error
    );

  }

}


/* =========================================================
   TOGGLE LANGUAGE
   ========================================================= */

function toggleLanguage() {

  state.language =
    state.language === "en"
      ? "hi"
      : "en";


  safeStorageSet(
    STORE.language,
    state.language
  );


  applyLanguage();

}


/* =========================================================
   THEME
   ========================================================= */

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


  safeStorageSet(
    STORE.theme,
    state.theme
  );


  applyTheme();

  applyLanguage();

}


/* =========================================================
   VISIBILITY
   ========================================================= */

function hideElement(id) {

  const element =
    document.getElementById(id);

  if (element) {

    element.classList.add(
      "hidden"
    );

  }

}


function setupVisibility() {

  if (!APP_CONFIG.ui.topbar) {

    hideElement("topbar");

  }


  if (!APP_CONFIG.ui.menuButton) {

    hideElement("menuBtn");

  }


  if (!APP_CONFIG.ui.languageButton) {

    hideElement("languageBtn");

  }


  if (!APP_CONFIG.ui.sideMenu) {

    hideElement("sideMenu");

    hideElement("menuOverlay");

  }


  if (!APP_CONFIG.ui.bottomNavigation) {

    hideElement(
      "bottomNavigation"
    );

  }


  if (!APP_CONFIG.ui.calculator) {

    hideElement(
      "calculatorPage"
    );

  }


  if (!APP_CONFIG.ui.settings) {

    hideElement(
      "settingsPage"
    );

  }


  if (!APP_CONFIG.ui.darkMode) {

    hideElement(
      "themeBtn"
    );

  }


  if (!APP_CONFIG.ui.languageSwitch) {

    hideElement(
      "languageBtn"
    );

    hideElement(
      "settingsLanguageBtn"
    );

  }


  if (!APP_CONFIG.ui.hero) {

    hideElement("hero");

  }

}


/* =========================================================
   EVENTS
   ========================================================= */

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
    .getElementById(
      "settingsLanguageBtn"
    )
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
      function () {

        showPage("home");

      }
    );


  document
    .getElementById(
      "clearEstimateBtn"
    )
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
        function () {

          showPage(
            button.dataset.page
          );

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
        function () {

          closeMenu();

          showPage(
            button.dataset.page
          );

        }
      );

    });

}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(page) {

  const allowedPages =
    APP_CONFIG.navigation.pages;


  if (
    !allowedPages[page]
  ) {

    return;

  }


  [
    "home",
    "estimate",
    "calculator",
    "settings"
  ]
  .forEach(name => {

    const pageElement =
      document.getElementById(
        `${name}Page`
      );


    if (!pageElement) {
      return;
    }


    pageElement.classList.toggle(
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


  state.currentPage =
    page;


  updatePageTitle();

}


function updatePageTitle() {

  const title =
    document.getElementById(
      "pageTitle"
    );


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


/* =========================================================
   MENU
   ========================================================= */

function openMenu() {

  if (
    !APP_CONFIG.ui.sideMenu
  ) {

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


/* =========================================================
   STAGE
   ========================================================= */

function getVisibleStages() {

  const result = [];


  if (
    APP_CONFIG.stages.stage1 &&
    MATERIAL_CONFIG.stage1
  ) {

    result.push(
      MATERIAL_CONFIG.stage1
    );

  }


  return result;

}


function renderStageCards() {

  const container =
    document.getElementById(
      "stageGrid"
    );


  if (!container) {
    return;
  }


  container.innerHTML = "";


  if (
    !APP_CONFIG.ui.stageCards
  ) {

    return;

  }


  getVisibleStages()
    .forEach(stage => {

      const card =
        document.createElement(
          "button"
        );


      card.type = "button";

      card.className =
        "stage-card";


      const number =
        String(
          stage.no
            .replace(
              "STAGE ",
              ""
            )
        );


      const materialText =
        state.language === "hi"
          ? "मटेरियल"
          : "Materials";


      card.innerHTML = `

        <div class="stage-number">
          ${escapeHTML(number)}
        </div>

        <div class="stage-info">

          <h3>
            ${escapeHTML(
              stage.name[state.language]
            )}
          </h3>

          <p>
            ${stage.materials.length}
            ${materialText}
          </p>

        </div>

        <div class="stage-arrow">
          →
        </div>

      `;


      card.addEventListener(
        "click",
        function () {

          openStage(stage);

        }
      );


      container.appendChild(card);

    });

}


/* =========================================================
   OPEN STAGE
   ========================================================= */

function openStage(stage) {

  if (
    !stage ||
    !Array.isArray(
      stage.materials
    ) ||
    !stage.materials.length
  ) {

    showToast(
      state.language === "hi"
        ? "इस स्टेज में अभी मटेरियल नहीं है।"
        : "No materials in this stage."
    );

    return;

  }


  state.currentStage =
    stage;

  state.currentMaterialIndex =
    0;

  state.currentMaterial =
    null;

  state.editingIndex =
    -1;

  state.previousData =
    {};

  openMaterial(
    stage,
    0
  );

}


/* =========================================================
   OPEN MATERIAL
   ========================================================= */

function openMaterial(
  stage,
  index,
  options = {}
) {

  if (
    !stage ||
    !Array.isArray(stage.materials)
  ) {

    return;

  }


  const material =
    stage.materials[index];


  if (!material) {

    return;

  }


  state.currentStage =
    stage;

  state.currentMaterialIndex =
    index;

  state.currentMaterial =
    material;


  const editing =
    options.editing === true;


  if (editing) {

    const estimateIndex =
      Number(
        options.estimateIndex
      );


    const item =
      state.estimate[
        estimateIndex
      ];


    if (!item) {

      return;

    }


    state.editingIndex =
      estimateIndex;


    state.formData =
      clone(
        item.data || {}
      );

  } else {

    state.editingIndex =
      -1;


    state.formData =
      createNewFormData(
        material
      );

  }


  updateSheetHeader();

  renderMaterialForm();

  updateSheetButtons();

  openSheet();

  scrollSheetTop();

}


/* =========================================================
   NEW FORM
   ========================================================= */

function createNewFormData() {

  const previous =
    state.previousData || {};


  return {

    size:
      previous.size || "",

    conduitSize:
      previous.conduitSize || "",

    type:
      previous.type || "",

    subType: "",

    shape: "",

    material: "",

    quantity: "",

    unit:
      previous.unit || "",

    brand:
      previous.brand || ""

  };

}


/* =========================================================
   MATERIAL FORM
   ========================================================= */

function renderMaterialForm() {

  const container =
    document.getElementById(
      "materialForm"
    );


  if (!container) {
    return;
  }


  container.innerHTML = "";


  if (
    !state.currentMaterial
  ) {

    return;

  }


  container.classList.toggle(
    "compact",
    state.view === "compact"
  );


  /*
  ----------------------------------------------------------
  REAL IMAGE ONLY
  ----------------------------------------------------------
  */

  if (
    APP_CONFIG.ui.materialImages &&
    state.currentMaterial.image
  ) {

    const imageWrap =
      document.createElement(
        "div"
      );


    imageWrap.className =
      "material-preview";


    const image =
      document.createElement(
        "img"
      );


    image.src =
      state.currentMaterial.image;


    image.alt =
      state.currentMaterial
        .name[state.language];


    image.onerror =
      function () {

        /*
          No broken image icon.
          If image doesn't load, remove it.
        */

        imageWrap.remove();

      };


    imageWrap.appendChild(
      image
    );


    container.appendChild(
      imageWrap
    );

  }


  /*
  ----------------------------------------------------------
  VIEW SWITCH
  ----------------------------------------------------------
  */

  if (
    APP_CONFIG.ui.materialViewSwitch
  ) {

    renderViewSwitch(
      container
    );

  }


  /*
  ----------------------------------------------------------
  MATERIAL FIELDS
  ----------------------------------------------------------
  */

  if (
    Array.isArray(
      state.currentMaterial.flow
    )
  ) {

    state.currentMaterial.flow
      .forEach(
        field => {

          if (
            field === "quantity"
          ) {

            renderQuantityField(
              container
            );

          } else {

            renderOptionField(
              container,
              field
            );

          }

        }
      );

  }

}


/* =========================================================
   VIEW SWITCH
   ========================================================= */

function renderViewSwitch(
  container
) {

  const section =
    document.createElement(
      "div"
    );


  section.className =
    "field-section";


  const title =
    document.createElement(
      "div"
    );


  title.className =
    "field-title";


  title.textContent =
    state.language === "hi"
      ? "दृश्य"
      : "View";


  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "option-grid";


  [
    [
      "grid",
      "▦",
      "Grid",
      "ग्रिड"
    ],
    [
      "list",
      "☰",
      "List",
      "लिस्ट"
    ],
    [
      "compact",
      "▤",
      "Compact",
      "कॉम्पैक्ट"
    ]
  ]
  .forEach(item => {

    const button =
      document.createElement(
        "button"
      );


    button.type = "button";

    button.className =
      "option-btn";


    button.classList.toggle(
      "selected",
      state.view === item[0]
    );


    button.innerHTML = `

      ${item[1]}
      ${
        state.language === "hi"
          ? item[3]
          : item[2]
      }

    `;


    button.addEventListener(
      "click",
      function () {

        state.view =
          item[0];


        safeStorageSet(
          STORE.view,
          state.view
        );


        renderMaterialForm();

      }
    );


    grid.appendChild(
      button
    );

  });


  section.appendChild(
    title
  );


  section.appendChild(
    grid
  );


  container.appendChild(
    section
  );

}


/* =========================================================
   OPTION FIELD
   ========================================================= */

function renderOptionField(
  container,
  field
) {

  if (
    !state.currentMaterial.options
  ) {

    return;

  }


  const options =
    state.currentMaterial
      .options[field];


  if (
    !Array.isArray(options)
  ) {

    return;

  }


  const section =
    document.createElement(
      "div"
    );


  section.className =
    "field-section";


  const title =
    document.createElement(
      "div"
    );


  title.className =
    "field-title";


  const label =
    MATERIAL_FIELD_LABELS[field];


  title.textContent =
    label
      ? label[state.language]
      : field;


  if (
    field === "brand"
  ) {

    const optional =
      document.createElement(
        "span"
      );


    optional.className =
      "optional-label";


    optional.textContent =
      state.language === "hi"
        ? "(वैकल्पिक)"
        : "(Optional)";


    title.appendChild(
      optional
    );

  }


  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "option-grid";


  if (
    state.view === "list"
  ) {

    grid.style.gridTemplateColumns =
      "1fr";

  }


  if (
    state.view === "compact"
  ) {

    grid.style.gridTemplateColumns =
      "repeat(3,1fr)";

  }


  options.forEach(
    option => {

      const button =
        document.createElement(
          "button"
        );


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
        function () {

          state.formData[field] =
            option.value;


          renderMaterialForm();

        }
      );


      grid.appendChild(
        button
      );

    }
  );


  section.appendChild(
    title
  );


  section.appendChild(
    grid
  );


  /*
  Brand is optional.
  */

  if (
    field === "brand"
  ) {

    const blank =
      document.createElement(
        "button"
      );


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
      function () {

        state.formData.brand =
          "";


        renderMaterialForm();

      }
    );


    section.appendChild(
      blank
    );

  }


  container.appendChild(
    section
  );

}


/* =========================================================
   QUANTITY
   ========================================================= */

function renderQuantityField(
  container
) {

  const section =
    document.createElement(
      "div"
    );


  section.className =
    "field-section";


  const title =
    document.createElement(
      "div"
    );


  title.className =
    "field-title";


  title.textContent =
    MATERIAL_FIELD_LABELS
      .quantity[state.language];


  const box =
    document.createElement(
      "div"
    );


  box.className =
    "quantity-box";


  if (
    APP_CONFIG.ui.quantityStepper
  ) {

    const minus =
      document.createElement(
        "button"
      );


    minus.type = "button";

    minus.className =
      "quantity-step-btn";

    minus.textContent =
      "−";


    minus.addEventListener(
      "click",
      function () {

        changeQuantity(-1);

      }
    );


    box.appendChild(
      minus
    );

  }


  const input =
    document.createElement(
      "input"
    );


  input.type = "number";

  input.inputMode =
    "numeric";

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
    state.formData.quantity ||
    "";


  input.addEventListener(
    "input",
    function () {

      state.formData.quantity =
        sanitizeQuantity(
          input.value
        );

    }
  );


  box.appendChild(
    input
  );


  if (
    APP_CONFIG.ui.quantityStepper
  ) {

    const plus =
      document.createElement(
        "button"
      );


    plus.type = "button";

    plus.className =
      "quantity-step-btn";

    plus.textContent =
      "+";


    plus.addEventListener(
      "click",
      function () {

        changeQuantity(1);

      }
    );


    box.appendChild(
      plus
    );

  }


  section.appendChild(
    title
  );


  section.appendChild(
    box
  );


  /*
  Quick buttons
  */

  if (
    APP_CONFIG.ui.quantityQuickButtons
  ) {

    const quick =
      document.createElement(
        "div"
      );


    quick.className =
      "quick-quantity";


    APP_CONFIG.quantity
      .quickValues
      .forEach(
        value => {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.textContent =
            String(value);


          button.classList.toggle(
            "selected",
            Number(
              state.formData.quantity
            ) === Number(value)
          );


          button.addEventListener(
            "click",
            function () {

              state.formData.quantity =
                Number(value);


              renderMaterialForm();

            }
          );


          quick.appendChild(
            button
          );

        }
      );


    section.appendChild(
      quick
    );

  }


  container.appendChild(
    section
  );

}


function sanitizeQuantity(
  value
) {

  const number =
    parseInt(
      value,
      10
    );


  if (
    Number.isNaN(number) ||
    number < 1
  ) {

    return "";

  }


  return number;

}


function changeQuantity(
  amount
) {

  let quantity =
    Number(
      state.formData.quantity
    );


  if (
    !Number.isFinite(
      quantity
    ) ||
    quantity < 1
  ) {

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


/* =========================================================
   SHEET
   ========================================================= */

function updateSheetHeader() {

  if (
    !state.currentStage ||
    !state.currentMaterial
  ) {

    return;

  }


  const stageName =
    document.getElementById(
      "sheetStageName"
    );


  const materialName =
    document.getElementById(
      "sheetMaterialName"
    );


  const progressText =
    document.getElementById(
      "sheetProgressText"
    );


  const progressBar =
    document.getElementById(
      "sheetProgressBar"
    );


  if (stageName) {

    stageName.textContent =
      state.currentStage.no;

  }


  if (materialName) {

    materialName.textContent =
      state.currentMaterial
        .name[state.language];

  }


  const total =
    state.currentStage
      .materials
      .length;


  const current =
    state.currentMaterialIndex + 1;


  if (progressText) {

    progressText.textContent =
      `${current} / ${total}`;

  }


  if (progressBar) {

    progressBar.style.width =
      `${Math.min(
        100,
        Math.max(
          0,
          current / total * 100
        )
      )}%`;

  }

}


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


    if (
      state.editingIndex >= 0
    ) {

      add.innerHTML =
        `✓ <span>${escapeHTML(
          t("updateEstimate")
        )}</span>`;

    } else {

      add.innerHTML =
        `+ <span>${escapeHTML(
          t("addToEstimate")
        )}</span>`;

    }

  }

}


function openSheet() {

  const layer =
    document.getElementById(
      "materialSheetLayer"
    );


  if (!layer) {
    return;
  }


  layer.classList.add(
    "open"
  );


  document.body.style.overflow =
    "hidden";

}


function closeMaterialSheet() {

  const layer =
    document.getElementById(
      "materialSheetLayer"
    );


  if (layer) {

    layer.classList.remove(
      "open"
    );

  }


  document.body.style.overflow =
    "";


  state.currentMaterial =
    null;

  state.editingIndex =
    -1;

}


/* =========================================================
   VALIDATE
   ========================================================= */

function validateForm() {

  if (
    !state.currentMaterial
  ) {

    return false;

  }


  const quantity =
    Number(
      state.formData.quantity
    );


  if (
    !Number.isFinite(quantity) ||
    quantity < 1
  ) {

    showToast(
      t("noQuantity")
    );

    return false;

  }


  const required =
    state.currentMaterial.flow
      .filter(
        field =>
          field !== "quantity" &&
          field !== "brand"
      );


  for (
    const field of required
  ) {

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


/* =========================================================
   ADD / UPDATE
   ========================================================= */

function addOrUpdateMaterial() {

  if (
    !validateForm()
  ) {

    return;

  }


  /*
  ----------------------------------------------------------
  UPDATE
  ----------------------------------------------------------
  */

  if (
    state.editingIndex >= 0
  ) {

    const index =
      state.editingIndex;


    if (
      !state.estimate[index]
    ) {

      return;

    }


    state.estimate[index].data =
      clone(
        state.formData
      );


    saveEstimate();

    renderEstimate();

    showToast(
      t("updated")
    );


    closeMaterialSheet();

    showPage(
      "estimate"
    );

    return;

  }


  /*
  ----------------------------------------------------------
  ADD
  ----------------------------------------------------------
  */

  const item = {

    id:
      createId(),

    stageId:
      state.currentStage.id,

    stageName:
      clone(
        state.currentStage.name
      ),

    materialId:
      state.currentMaterial.id,

    materialName:
      clone(
        state.currentMaterial.name
      ),

    data:
      clone(
        state.formData
      ),

    createdAt:
      Date.now()

  };


  state.estimate.push(
    item
  );


  saveEstimate();

  renderEstimate();

  showToast(
    t("added")
  );


  /*
  ----------------------------------------------------------
  CARRY FORWARD
  ----------------------------------------------------------
  */

  state.previousData =
    createCarryData(
      state.formData
    );


  /*
  Quantity is NOT included.
  */


  const nextIndex =
    state.currentMaterialIndex + 1;


  if (
    nextIndex <
    state.currentStage
      .materials
      .length
  ) {

    window.setTimeout(
      function () {

        openMaterial(
          state.currentStage,
          nextIndex
        );

      },
      180
    );

  } else {

    window.setTimeout(
      function () {

        closeMaterialSheet();

      },
      180
    );

  }

}


/* =========================================================
   CARRY DATA
   ========================================================= */

function createCarryData(
  data
) {

  return {

    size:
      data.size || "",

    conduitSize:
      data.conduitSize || "",

    type:
      data.type || "",

    unit:
      data.unit || "",

    brand:
      data.brand || ""

  };

}


/* =========================================================
   NEXT
   ========================================================= */

function nextMaterial() {

  if (
    !state.currentStage
  ) {

    return;

  }


  const nextIndex =
    state.currentMaterialIndex + 1;


  if (
    nextIndex >=
    state.currentStage
      .materials
      .length
  ) {

    showToast(
      t("lastItem")
    );

    return;

  }


  /*
  IMPORTANT:
  Next does NOT save current item.
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


/* =========================================================
   BACK
   ========================================================= */

function previousMaterial() {

  if (
    !state.currentStage
  ) {

    return;

  }


  const previousIndex =
    state.currentMaterialIndex - 1;


  if (
    previousIndex < 0
  ) {

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


/* =========================================================
   SCROLL TOP
   ========================================================= */

function scrollSheetTop() {

  window.requestAnimationFrame(
    function () {

      const form =
        document.getElementById(
          "materialForm"
        );


      if (form) {

        form.scrollTop = 0;

      }

    }
  );

}


/* =========================================================
   ESTIMATE RENDER
   ========================================================= */

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
      String(
        state.estimate.length
      );

  }


  if (
    !state.estimate.length
  ) {

    empty?.classList.remove(
      "hidden"
    );

    return;

  }


  empty?.classList.add(
    "hidden"
  );


  state.estimate.forEach(
    function (
      item,
      index
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "estimate-card";


      const top =
        document.createElement(
          "div"
        );


      top.className =
        "estimate-card-top";


      const number =
        document.createElement(
          "div"
        );


      number.className =
        "estimate-number";


      number.textContent =
        String(index + 1);


      const main =
        document.createElement(
          "div"
        );


      main.className =
        "estimate-main";


      const name =
        document.createElement(
          "div"
        );


      name.className =
        "estimate-name";


      name.textContent =
        getLocalizedMaterialName(
          item
        );


      const details =
        document.createElement(
          "div"
        );


      details.className =
        "estimate-details";


      details.innerHTML =
        formatEstimateDetails(
          item
        );


      main.appendChild(
        name
      );


      main.appendChild(
        details
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


        edit.type =
          "button";


        edit.className =
          "icon-action";


        edit.textContent =
          "✎";


        edit.title =
          t("edit");


        edit.addEventListener(
          "click",
          function () {

            editEstimate(
              index
            );

          }
        );


        actions.appendChild(
          edit
        );

      }


      if (
        APP_CONFIG.ui.estimateDelete
      ) {

        const del =
          document.createElement(
            "button"
          );


        del.type =
          "button";


        del.className =
          "icon-action delete";


        del.textContent =
          "×";


        del.title =
          t("delete");


        del.addEventListener(
          "click",
          function () {

            deleteEstimate(
              index
            );

          }
        );


        actions.appendChild(
          del
        );

      }


      top.appendChild(
        number
      );


      top.appendChild(
        main
      );


      top.appendChild(
        actions
      );


      card.appendChild(
        top
      );


      list.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   LOCALIZED MATERIAL NAME
   ========================================================= */

function getLocalizedMaterialName(
  item
) {

  if (
    item &&
    item.materialName
  ) {

    return (
      item.materialName[
        state.language
      ] ||
      item.materialName.en ||
      item.materialId ||
      "Material"
    );

  }


  return (
    item?.materialId ||
    "Material"
  );

}


/* =========================================================
   ESTIMATE DETAILS
   ========================================================= */

function formatEstimateDetails(
  item
) {

  const material =
    findMaterial(
      item.stageId,
      item.materialId
    );


  if (!material) {

    return escapeHTML(
      JSON.stringify(
        item.data || {}
      )
    );

  }


  const parts = [];


  material.flow.forEach(
    function (field) {

      const value =
        item.data?.[field];


      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {

        return;

      }


      let display =
        String(value);


      const option =
        material.options?.[field]
          ?.find(
            function (entry) {

              return (
                entry.value ===
                value
              );

            }
          );


      if (option) {

        display =
          option.label[
            state.language
          ] ||
          option.label.en ||
          value;

      }


      const label =
        MATERIAL_FIELD_LABELS[
          field
        ];


      const labelText =
        label
          ? label[state.language]
          : field;


      parts.push(
        `<strong>${escapeHTML(
          labelText
        )}:</strong> ${escapeHTML(
          display
        )}`
      );

    }
  );


  return parts.join(
    " • "
  );

}


/* =========================================================
   FIND MATERIAL
   ========================================================= */

function findMaterial(
  stageId,
  materialId
) {

  const stage =
    getStageById(
      stageId
    );


  if (!stage) {
    return null;
  }


  return stage.materials.find(
    function (material) {

      return (
        material.id ===
        materialId
      );

    }
  ) || null;

}


/* =========================================================
   GET STAGE
   ========================================================= */

function getStageById(
  id
) {

  const numericId =
    Number(id);


  if (
    numericId === 1 &&
    MATERIAL_CONFIG.stage1
  ) {

    return MATERIAL_CONFIG.stage1;

  }


  return null;

}


/* =========================================================
   EDIT
   ========================================================= */

function editEstimate(
  index
) {

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
      function (material) {

        return (
          material.id ===
          item.materialId
        );

      }
    );


  if (
    materialIndex < 0
  ) {

    return;

  }


  openMaterial(
    stage,
    materialIndex,
    {

      editing: true,

      estimateIndex:
        index

    }
  );

}


/* =========================================================
   DELETE
   ========================================================= */

function deleteEstimate(
  index
) {

  if (
    !window.confirm(
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


/* =========================================================
   CLEAR
   ========================================================= */

function clearEstimate() {

  if (
    !state.estimate.length
  ) {

    return;

  }


  if (
    !window.confirm(
      t("confirmClear")
    )
  ) {

    return;

  }


  state.estimate = [];


  saveEstimate();

  renderEstimate();

}


/* =========================================================
   CALCULATOR
   ========================================================= */

function getNumber(
  id
) {

  const input =
    document.getElementById(
      id
    );


  if (!input) {
    return null;
  }


  const value =
    Number(
      input.value
    );


  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {

    return null;

  }


  return value;

}


function calculateElectrical() {

  const V =
    getNumber(
      "calcVoltage"
    );


  const I =
    getNumber(
      "calcCurrent"
    );


  const P =
    getNumber(
      "calcPower"
    );


  const R =
    getNumber(
      "calcResistance"
    );


  const results = [];


  /*
  V = I × R
  */

  if (
    I !== null &&
    R !== null
  ) {

    results.push(
      `V = ${(I * R).toFixed(2)} V`
    );

  }


  if (
    V !== null &&
    I !== null
  ) {

    results.push(
      `R = ${(V / I).toFixed(2)} Ω`
    );

  }


  if (
    V !== null &&
    R !== null
  ) {

    results.push(
      `I = ${(V / R).toFixed(2)} A`
    );

  }


  /*
  P = V × I
  */

  if (
    V !== null &&
    I !== null
  ) {

    results.push(
      `P = ${(V * I).toFixed(2)} W`
    );

  }


  if (
    P !== null &&
    V !== null
  ) {

    results.push(
      `I = ${(P / V).toFixed(2)} A`
    );

  }


  if (
    P !== null &&
    I !== null
  ) {

    results.push(
      `V = ${(P / I).toFixed(2)} V`
    );

  }


  if (
    P !== null &&
    V !== null
  ) {

    results.push(
      `R = ${((V * V) / P).toFixed(2)} Ω`
    );

  }


  if (
    P !== null &&
    I !== null
  ) {

    results.push(
      `R = ${(P / (I * I)).toFixed(2)} Ω`
    );

  }


  const output =
    document.getElementById(
      "calcResult"
    );


  if (!output) {
    return;
  }


  if (!results.length) {

    output.textContent =
      t("invalidCalculation");

    return;

  }


  output.innerHTML =
    `<strong>${escapeHTML(
      t("calculationResult")
    )}</strong><br>` +
    results
      .map(
        function (value) {

          return escapeHTML(
            value
          );

        }
      )
      .join("<br>");

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function showToast(
  message
) {

  if (
    !APP_CONFIG.ui.toast
  ) {

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


  if (
    !toast ||
    !text
  ) {

    return;

  }


  text.textContent =
    String(message);


  toast.classList.add(
    "show"
  );


  if (toastTimer) {

    clearTimeout(
      toastTimer
    );

  }


  toastTimer =
    window.setTimeout(
      function () {

        toast.classList.remove(
          "show"
        );

      },
      1600
    );

}


/* =========================================================
   ID
   ========================================================= */

function createId() {

  return (
    Date.now().toString(36) +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 9)
  );

}


/* =========================================================
   CLONE
   ========================================================= */

function clone(
  value
) {

  try {

    return JSON.parse(
      JSON.stringify(value)
    );

  } catch (error) {

    return {};

  }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
