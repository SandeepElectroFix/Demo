/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   FILES:
   index.html
   style.css
   config.js
   material.js
   app.js

   IMPORTANT:
   material.js MASTER DATA IS NOT MODIFIED.

   FLOW:
   HOME -> STAGE -> SECTION -> MATERIAL -> EDITOR

   LANGUAGE:
   HI = Hindi only
   EN = English only
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     BASIC HELPERS
     ========================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const safeText = (value) =>
    value == null ? "" : String(value);

  const esc = (value) =>
    safeText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const storageGet = (key, fallback = "") => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  };

  const storageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  };

  const storageRemove = (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  const parseJSON = (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const makeId = () =>
    "ef-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8);


  /* =========================================================
     BRAND
     ========================================================= */

  const BRAND = {
    name: "Sandeep ElectroFix",
    taglineHi: "आपके विश्वास को रोशन करते हुए",
    taglineEn: "Powering Your Trust",
    logo: "logo.png"
  };


  /* =========================================================
     STORAGE
     ========================================================= */

  const STORAGE = {
    lang: "sandeepMaterialLang",
    theme: "sandeepTheme",
    estimate: "sandeepEstimateItems",
    route: "sandeepEstimateRoute",
    stageView: "sandeepStageView",
    materialView: "sandeepMaterialView",
    lastUnit: "sandeepLastUnit"
  };


  /* =========================================================
     LANGUAGE DICTIONARY
     ========================================================= */

  const DICT = {
    /* ---------- STAGES ---------- */
    "Stage 1": "स्टेज 1",
    "Stage 2": "स्टेज 2",
    "Stage 3": "स्टेज 3",
    "Stage 4": "स्टेज 4",
    "Stage 5": "स्टेज 5",

    "Slab Conduit Installation": "स्लैब कंड्यूट इंस्टॉलेशन",
    "Wall Conduit": "वॉल कंड्यूट",
    "Wiring": "वायरिंग",
    "Final Electrical Fittings": "फाइनल इलेक्ट्रिकल फिटिंग्स",
    "False Ceiling Wiring Material": "फॉल्स सीलिंग वायरिंग मटेरियल",

    "Conduit & Box": "कंड्यूट और बॉक्स",

    /* ---------- MATERIALS ---------- */
    "Pipe": "पाइप",
    "Bend": "बेंड",
    "Junction Box": "जंक्शन बॉक्स",
    "Fan Box": "फैन बॉक्स",
    "Concealed Light Box": "कंसील्ड लाइट बॉक्स",
    "Tape": "टेप",
    "Solvent Cement": "सॉल्वेंट सीमेंट",
    "Neel Powder": "नील पाउडर",
    "Binding Wire": "बाइंडिंग वायर",
    "Cable Tie": "केबल टाई",

    "Modular Board": "मॉड्यूलर बोर्ड",
    "MCB Box": "एमसीबी बॉक्स",
    "Cable Clip": "केबल क्लिप",

    "Wire": "वायर",
    "Flexible Pipe": "फ्लेक्सिबल पाइप",
    "Electrical Tape": "इलेक्ट्रिकल टेप",
    "Fastener": "फास्टनर",
    "Fish Tape": "फिश टेप",

    "Switch": "स्विच",
    "Socket": "सॉकेट",
    "Fan Regulator": "फैन रेगुलेटर",
    "Fan": "फैन",
    "Holder": "होल्डर",
    "Bulb": "बल्ब",
    "LED": "एलईडी",
    "MCB": "एमसीबी",
    "RCCB": "आरसीसीबी",
    "DB": "डीबी",
    "Distribution Board": "डिस्ट्रीब्यूशन बोर्ड",
    "Isolator": "आइसोलेटर",
    "Indicator": "इंडिकेटर",
    "Bell": "बेल",
    "Door Bell": "डोर बेल",
    "Exhaust Fan": "एग्जॉस्ट फैन",
    "Ceiling Fan": "सीलिंग फैन",
    "Light": "लाइट",
    "Downlight": "डाउनलाइट",
    "Panel Light": "पैनल लाइट",
    "Spot Light": "स्पॉट लाइट",

    /* ---------- FIELDS ---------- */
    "Size": "साइज",
    "Type": "टाइप",
    "Sub Type": "सब टाइप",
    "Way": "वे",
    "Ways": "वे",
    "Depth": "डेप्थ",
    "Material": "मटेरियल",
    "Quantity": "मात्रा",
    "Unit": "यूनिट",
    "Brand": "ब्रांड",
    "Price": "कीमत",

    /* ---------- OPTIONS ---------- */
    "Normal": "नॉर्मल",
    "Deep": "डीप",
    "Short": "शॉर्ट",
    "Long": "लॉन्ग",
    "Straight": "स्ट्रेट",
    "Angle": "एंगल",
    "T": "टी",
    "Cross": "क्रॉस",
    "PVC": "पीवीसी",
    "GI": "जीआई",
    "HMS": "एचएमएस",
    "MMS": "एमएमएस",
    "LMS": "एलएमएस",

    "1 Way": "1 वे",
    "2 Way": "2 वे",
    "2 Straight": "2 स्ट्रेट",
    "2 Angle": "2 एंगल",
    "3 T": "3 टी",
    "4 Cross": "4 क्रॉस",

    "Other": "अन्य",
    "Local": "लोकल",
    "Skip": "स्किप",

    "pcs": "पीस",
    "pc": "पीस",
    "piece": "पीस",
    "pieces": "पीस",
    "pkt": "पैकेट",
    "packet": "पैकेट",
    "bndl": "बंडल",
    "bundle": "बंडल",
    "doz": "दर्जन",
    "dozen": "दर्जन",
    "meter": "मीटर",
    "metre": "मीटर",
    "m": "मीटर",
    "roll": "रोल",
    "box": "बॉक्स",
    "set": "सेट",
    "point": "पॉइंट",

    /* ---------- COMMON ---------- */
    "Home": "होम",
    "Estimate": "एस्टिमेट",
    "Calculator": "कैलकुलेटर",
    "Settings": "सेटिंग्स",
    "Search": "सर्च",
    "Search materials": "मटेरियल सर्च करें",
    "Filter": "फ़िल्टर",
    "Clear": "क्लियर",
    "Reset": "रीसेट",
    "Reset App": "ऐप रीसेट करें",
    "Close": "बंद करें",
    "Apply": "लागू करें",
    "Save": "सेव करें",
    "Update": "अपडेट करें",
    "Add": "जोड़ें",
    "Next": "अगला",
    "Back": "वापस",
    "Previous": "पिछला",
    "Delete": "डिलीट",
    "Edit": "एडिट",
    "Cancel": "रद्द करें",
    "Yes": "हाँ",
    "No": "नहीं",

    "Stages": "स्टेज",
    "Sections": "सेक्शन",
    "Materials": "मटेरियल",
    "Items": "आइटम",
    "No materials found": "कोई मटेरियल नहीं मिला",
    "No estimate items": "एस्टिमेट में कोई आइटम नहीं है",
    "Added successfully": "सफलतापूर्वक जोड़ा गया",
    "Updated successfully": "सफलतापूर्वक अपडेट किया गया",
    "Quantity is required": "मात्रा जरूरी है",
    "Please enter quantity": "कृपया मात्रा दर्ज करें",
    "App reset successfully": "ऐप रीसेट हो गया",
    "Nothing to show": "दिखाने के लिए कुछ नहीं है",

    /* ---------- VIEW MODES ---------- */
    "Grid": "ग्रिड",
    "List": "लिस्ट",
    "Compact": "कॉम्पैक्ट",
    "Large": "बड़ा",
    "Mini": "मिनी",
    "2 Column": "2 कॉलम",
    "Horizontal": "हॉरिज़ॉन्टल",
    "Icon List": "आइकन लिस्ट",
    "Timeline": "टाइमलाइन",
    "Dense": "डेंस",

    "Stage View": "स्टेज व्यू",
    "Material View": "मटेरियल व्यू",

    /* ---------- THEME ---------- */
    "Dark": "डार्क",
    "Light": "लाइट",

    /* ---------- CALCULATOR ---------- */
    "Electrical Calculator": "इलेक्ट्रिकल कैलकुलेटर",
    "Voltage": "वोल्टेज",
    "Current": "करंट",
    "Resistance": "रेज़िस्टेंस",
    "Power": "पावर",
    "Inverter": "इन्वर्टर",
    "Input": "इनपुट",
    "Output": "आउटपुट",
    "Calculate": "कैलकुलेट करें",
    "12V": "12V",
    "24V": "24V",
    "230V": "230V"
  };


  /* =========================================================
     UI TEXT
     ========================================================= */

  const UI = {
    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",

      search: "सर्च करें",
      searchPlaceholder: "मटेरियल / स्टेज / सेक्शन सर्च करें",
      filter: "फ़िल्टर",
      clear: "क्लियर",
      reset: "ऐप रीसेट करें",
      close: "बंद करें",

      stages: "स्टेज",
      sections: "सेक्शन",
      materials: "मटेरियल",

      back: "वापस",
      previous: "पिछला",
      next: "अगला",
      add: "जोड़ें",
      update: "अपडेट करें",
      save: "सेव करें",
      edit: "एडिट",
      delete: "डिलीट",
      cancel: "रद्द करें",

      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",

      emptyEstimate: "एस्टिमेट में कोई आइटम नहीं है",
      noMaterials: "कोई मटेरियल नहीं मिला",

      language: "भाषा",
      theme: "थीम",
      dark: "डार्क",
      light: "लाइट",

      stageView: "स्टेज व्यू",
      materialView: "मटेरियल व्यू",

      calculatorTitle: "इलेक्ट्रिकल कैलकुलेटर",
      voltage: "वोल्टेज",
      current: "करंट",
      resistance: "रेज़िस्टेंस",
      power: "पावर",
      inverter: "इन्वर्टर",

      saved: "सेव हो गया",
      added: "सफलतापूर्वक जोड़ा गया",
      updated: "सफलतापूर्वक अपडेट किया गया",
      quantityRequired: "मात्रा जरूरी है",
      resetDone: "ऐप रीसेट हो गया"
    },

    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",

      search: "Search",
      searchPlaceholder: "Search material / stage / section",
      filter: "Filter",
      clear: "Clear",
      reset: "Reset App",
      close: "Close",

      stages: "Stages",
      sections: "Sections",
      materials: "Materials",

      back: "Back",
      previous: "Previous",
      next: "Next",
      add: "Add",
      update: "Update",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",

      quantity: "Quantity",
      unit: "Unit",
      brand: "Brand",

      emptyEstimate: "No estimate items",
      noMaterials: "No materials found",

      language: "Language",
      theme: "Theme",
      dark: "Dark",
      light: "Light",

      stageView: "Stage View",
      materialView: "Material View",

      calculatorTitle: "Electrical Calculator",
      voltage: "Voltage",
      current: "Current",
      resistance: "Resistance",
      power: "Power",
      inverter: "Inverter",

      saved: "Saved",
      added: "Added successfully",
      updated: "Updated successfully",
      quantityRequired: "Quantity is required",
      resetDone: "App reset successfully"
    }
  };


  /* =========================================================
     TRANSLATION
     ========================================================= */

  function currentLang() {
    return state.lang === "en" ? "en" : "hi";
  }

  function langText(key) {
    const lang = currentLang();

    if (UI[lang] && UI[lang][key] != null) {
      return UI[lang][key];
    }

    return key;
  }

  function tr(value) {
    const text = safeText(value);

    if (!text) return "";

    if (currentLang() === "en") {
      return text;
    }

    return DICT[text] || text;
  }


  /* =========================================================
     VIEW MODES
     ========================================================= */

  const VIEW_MODES = [
    "grid",
    "list",
    "compact",
    "large",
    "mini",
    "two-column",
    "horizontal",
    "icon-list",
    "timeline",
    "dense"
  ];

  const VIEW_LABELS = {
    grid: "Grid",
    list: "List",
    compact: "Compact",
    large: "Large",
    mini: "Mini",
    "two-column": "2 Column",
    horizontal: "Horizontal",
    "icon-list": "Icon List",
    timeline: "Timeline",
    dense: "Dense"
  };

  function validView(value) {
    return VIEW_MODES.includes(value) ? value : "grid";
  }


  /* =========================================================
     STATE
     ========================================================= */

  const state = {
    lang: storageGet(STORAGE.lang, "hi") === "en" ? "en" : "hi",

    theme:
      storageGet(STORAGE.theme, "dark") === "light"
        ? "light"
        : "dark",

    page: "home",

    stageIndex: -1,
    sectionIndex: -1,
    itemIndex: -1,

    stageView: validView(
      storageGet(STORAGE.stageView, "grid")
    ),

    materialView: validView(
      storageGet(STORAGE.materialView, "grid")
    ),

    editingEstimateId: null,

    draft: {},

    drawerOpen: false,
    drawerHistoryPushed: false,

    filterOpen: false,
    viewOpen: false,

    historyReady: false,

    currentViewContext: "stage"
  };


  /* =========================================================
     DATA
     ========================================================= */

  let DATA = [];

  function normalizeField(raw) {
    if (!Array.isArray(raw)) {
      return {
        name: safeText(raw),
        options: []
      };
    }

    return {
      name: safeText(raw[0]),
      options: Array.isArray(raw[1])
        ? raw[1].map(safeText)
        : []
    };
  }

  function normalizeItem(raw) {
    if (!Array.isArray(raw)) {
      return {
        name: "",
        fields: [],
        units: [],
        brands: []
      };
    }

    return {
      name: safeText(raw[0]),

      fields: Array.isArray(raw[1])
        ? raw[1].map(normalizeField)
        : [],

      units: Array.isArray(raw[2])
        ? raw[2].map(safeText)
        : [],

      brands: Array.isArray(raw[3])
        ? raw[3].map(safeText)
        : []
    };
  }

  function parseMaterials() {
    const raw = Array.isArray(window.MATERIALS)
      ? window.MATERIALS
      : [];

    return raw.map((stage, stageIndex) => {
      const stageId = safeText(stage[0]);
      const stageName = safeText(stage[1]);

      const sections = [];

      /*
       * MASTER FORMAT:
       * [
       *   "STAGE 1",
       *   "Slab Conduit Installation",
       *   "Conduit & Box",
       *   [...]
       * ]
       */

      if (Array.isArray(stage[3])) {
        sections.push({
          name: safeText(stage[2] || "Conduit & Box"),
          items: stage[3].map(normalizeItem)
        });
      }

      for (let i = 4; i < stage.length; i++) {
        if (!Array.isArray(stage[i])) continue;

        const section = stage[i];

        if (
          Array.isArray(section) &&
          typeof section[0] === "string" &&
          Array.isArray(section[1])
        ) {
          sections.push({
            name: safeText(section[0]),
            items: section[1].map(normalizeItem)
          });
        }
      }

      return {
        id: stageId,
        name: stageName,
        index: stageIndex,
        sections
      };
    });
  }

  DATA = parseMaterials();


  /* =========================================================
     ESTIMATE DATA
     ========================================================= */

  function getEstimateItems() {
    return parseJSON(
      storageGet(STORAGE.estimate, "[]"),
      []
    );
  }

  function saveEstimateItems(items) {
    storageSet(
      STORAGE.estimate,
      JSON.stringify(items)
    );
  }


  /* =========================================================
     ROUTE
     ========================================================= */

  function saveRoute() {
    storageSet(
      STORAGE.route,
      JSON.stringify({
        page: state.page,
        stageIndex: state.stageIndex,
        sectionIndex: state.sectionIndex,
        itemIndex: state.itemIndex
      })
    );
  }

  function loadRoute() {
    const saved = parseJSON(
      storageGet(STORAGE.route, ""),
      null
    );

    if (!saved || typeof saved !== "object") {
      return;
    }

    state.page = safeText(saved.page || "home");

    state.stageIndex = Number.isInteger(saved.stageIndex)
      ? saved.stageIndex
      : -1;

    state.sectionIndex = Number.isInteger(saved.sectionIndex)
      ? saved.sectionIndex
      : -1;

    state.itemIndex = Number.isInteger(saved.itemIndex)
      ? saved.itemIndex
      : -1;

    validateSavedRoute();
  }

  function validateSavedRoute() {
    if (state.page === "home") {
      state.stageIndex = -1;
      state.sectionIndex = -1;
      state.itemIndex = -1;
      return;
    }

    if (
      state.stageIndex < 0 ||
      state.stageIndex >= DATA.length
    ) {
      state.page = "home";
      state.stageIndex = -1;
      state.sectionIndex = -1;
      state.itemIndex = -1;
      return;
    }

    if (state.page === "stage") {
      state.sectionIndex = -1;
      state.itemIndex = -1;
      return;
    }

    if (
      state.page === "section" ||
      state.page === "item"
    ) {
      const stage = DATA[state.stageIndex];

      if (
        !stage ||
        state.sectionIndex < 0 ||
        state.sectionIndex >= stage.sections.length
      ) {
        state.page = "stage";
        state.sectionIndex = -1;
        state.itemIndex = -1;
        return;
      }
    }

    if (state.page === "item") {
      const section =
        DATA[state.stageIndex].sections[
          state.sectionIndex
        ];

      if (
        !section ||
        state.itemIndex < 0 ||
        state.itemIndex >= section.items.length
      ) {
        state.page = "section";
        state.itemIndex = -1;
      }
    }

    if (
      ![
        "home",
        "stage",
        "section",
        "item",
        "estimate",
        "calculator",
        "settings"
      ].includes(state.page)
    ) {
      state.page = "home";
    }
  }


  /* =========================================================
     BRANDING
     ========================================================= */

  function applyBranding() {
    $$("[data-brand-logo]").forEach((img) => {
      img.src = BRAND.logo;
      img.alt = BRAND.name;
    });

    $$("#brandLogo, .brand-logo img").forEach((img) => {
      if (!img.getAttribute("src")) {
        img.src = BRAND.logo;
      }
      img.alt = BRAND.name;
    });

    $$("[data-brand-name]").forEach((el) => {
      el.textContent = BRAND.name;
    });

    $$("[data-brand-tagline]").forEach((el) => {
      el.textContent =
        currentLang() === "hi"
          ? BRAND.taglineHi
          : BRAND.taglineEn;
    });
  }

  function brandLogoHTML(className = "") {
    return `
      <img
        class="ef-brand-logo ${className}"
        src="${esc(BRAND.logo)}"
        alt="${esc(BRAND.name)}"
        onerror="this.style.display='none'"
      >
    `;
  }


  /* =========================================================
     DYNAMIC CSS
     ========================================================= */

  function injectDynamicCSS() {
    if ($("#efDynamicCSS")) return;

    const style = document.createElement("style");
    style.id = "efDynamicCSS";

    style.textContent = `
      /* =====================================================
         GENERAL
         ===================================================== */

      #efRoute {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        padding: 12px 12px 90px;
        box-sizing: border-box;
        text-align: center;
      }

      .ef-page {
        width: 100%;
        text-align: center;
      }

      .ef-page-head {
        display: grid;
        grid-template-columns: 42px 1fr 42px;
        align-items: center;
        gap: 8px;
        width: 100%;
        margin-bottom: 14px;
      }

      .ef-page-brand {
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
      }

      .ef-brand-logo {
        width: 42px;
        height: 42px;
        object-fit: contain;
        border-radius: 50%;
        flex: 0 0 42px;
      }

      .ef-page-title {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.2;
      }

      .ef-page-subtitle {
        margin: 3px 0 0;
        font-size: 11px;
        opacity: .75;
      }

      .ef-back-btn,
      .ef-view-trigger {
        width: 42px;
        height: 42px;
        border: 1px solid rgba(14,165,233,.55);
        border-radius: 12px;
        background: #07182e;
        color: #38bdf8;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 19px;
        font-weight: 900;
        box-shadow:
          0 0 10px rgba(14,165,233,.16),
          inset 0 0 10px rgba(14,165,233,.06);
      }

      .ef-back-btn:active,
      .ef-view-trigger:active {
        transform: scale(.95);
      }

      .ef-view-picker {
        position: relative;
        display: inline-flex;
        justify-content: center;
        z-index: 20;
      }

      .ef-view-trigger {
        background:
          linear-gradient(
            135deg,
            rgba(14,165,233,.18),
            rgba(250,204,21,.12)
          );
        color: #facc15;
      }

      .ef-view-options {
        position: absolute;
        top: 48px;
        right: 0;
        width: 170px;
        padding: 7px;
        border: 1px solid rgba(14,165,233,.45);
        border-radius: 14px;
        background: #07182e;
        box-shadow: 0 12px 35px rgba(0,0,0,.45);
        display: grid;
        gap: 5px;
        z-index: 9999;
      }

      .ef-view-options[hidden] {
        display: none;
      }

      .ef-view-option {
        border: 1px solid rgba(56,189,248,.16);
        border-radius: 9px;
        background: transparent;
        color: #dbeafe;
        padding: 8px 9px;
        text-align: center;
        cursor: pointer;
        font-size: 12px;
      }

      .ef-view-option.active {
        color: #050816;
        background:
          linear-gradient(
            90deg,
            #38bdf8,
            #facc15
          );
        font-weight: 800;
      }

      .ef-breadcrumb {
        margin: 5px 0 14px;
        font-size: 11px;
        opacity: .7;
        text-align: center;
      }

      /* =====================================================
         STAGE / SECTION GRID
         ===================================================== */

      #stageGrid,
      #sectionGrid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        align-items: stretch;
      }

      #stageGrid.view-grid,
      #sectionGrid.view-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      #stageGrid.view-two-column,
      #sectionGrid.view-two-column {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      #stageGrid.view-list,
      #sectionGrid.view-list,
      #stageGrid.view-horizontal,
      #sectionGrid.view-horizontal,
      #stageGrid.view-dense,
      #sectionGrid.view-dense,
      #stageGrid.view-large,
      #sectionGrid.view-large {
        grid-template-columns: 1fr;
      }

      #stageGrid.view-compact,
      #sectionGrid.view-compact,
      #stageGrid.view-mini,
      #sectionGrid.view-mini,
      #stageGrid.view-icon-list,
      #sectionGrid.view-icon-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      #stageGrid.view-timeline,
      #sectionGrid.view-timeline {
        grid-template-columns: 1fr;
      }

      #stageGrid.view-list .stage-card,
      #stageGrid.view-horizontal .stage-card,
      #stageGrid.view-dense .stage-card {
        min-height: 66px !important;
        height: auto !important;
        padding: 9px 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 10px;
        text-align: center !important;
      }

      #stageGrid.view-mini .stage-card {
        min-height: 54px !important;
        height: auto !important;
        padding: 7px !important;
      }

      #stageGrid.view-compact .stage-card {
        min-height: 64px !important;
        height: auto !important;
        padding: 8px !important;
      }

      #stageGrid.view-large .stage-card {
        min-height: 130px !important;
      }

      #stageGrid.view-list .stage-card *,
      #stageGrid.view-horizontal .stage-card *,
      #stageGrid.view-dense .stage-card * {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }

      /* =====================================================
         SECTION CARDS
         ===================================================== */

      .ef-section-card {
        min-height: 120px;
        padding: 15px 12px;
        border-radius: 16px;
        border: 1px solid rgba(14,165,233,.30);
        background: #07182e;
        color: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
        transition: .18s ease;
      }

      .ef-section-card:active {
        transform: scale(.98);
      }

      .ef-section-card h3 {
        margin: 0;
        font-size: 14px;
        line-height: 1.35;
      }

      .ef-section-card p {
        margin: 6px 0 0;
        font-size: 11px;
        opacity: .7;
      }

      #sectionGrid.view-list .ef-section-card,
      #sectionGrid.view-horizontal .ef-section-card,
      #sectionGrid.view-dense .ef-section-card {
        min-height: 62px;
        padding: 8px 12px;
        flex-direction: row;
        justify-content: space-between;
      }

      #sectionGrid.view-mini .ef-section-card {
        min-height: 55px;
        padding: 7px;
      }

      #sectionGrid.view-compact .ef-section-card {
        min-height: 65px;
        padding: 8px;
      }

      /* =====================================================
         MATERIAL GRID
         ===================================================== */

      .ef-material-section {
        width: 100%;
        margin-bottom: 16px;
      }

      .ef-material-section-title {
        margin: 0 0 8px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(250,204,21,.25);
        background: rgba(250,204,21,.05);
        color: #facc15;
        font-size: 13px;
        font-weight: 800;
        text-align: center;
      }

      .ef-material-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 9px;
      }

      .ef-material-grid.view-grid,
      .ef-material-grid.view-two-column {
        grid-template-columns: repeat(2, minmax(0,1fr));
      }

      .ef-material-grid.view-list,
      .ef-material-grid.view-horizontal,
      .ef-material-grid.view-large,
      .ef-material-grid.view-dense {
        grid-template-columns: 1fr;
      }

      .ef-material-grid.view-compact,
      .ef-material-grid.view-mini,
      .ef-material-grid.view-icon-list {
        grid-template-columns: repeat(2, minmax(0,1fr));
      }

      .ef-material-grid.view-timeline {
        grid-template-columns: 1fr;
      }

      .ef-material-card {
        min-width: 0;
        min-height: 76px;
        padding: 10px 9px;
        border-radius: 13px;
        border: 1px solid rgba(14,165,233,.30);
        background: #07182e;
        color: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
        transition: .18s ease;
      }

      .ef-material-card:active {
        transform: scale(.98);
      }

      .ef-material-name {
        margin: 0;
        font-size: 13px;
        font-weight: 750;
        line-height: 1.25;
        word-break: break-word;
      }

      /* REAL SMALL LIST VIEW */
      .ef-material-grid.view-list .ef-material-card {
        min-height: 46px;
        height: 46px;
        padding: 6px 10px;
        border-radius: 9px;
        justify-content: center;
      }

      .ef-material-grid.view-list .ef-material-name {
        font-size: 11.5px;
        font-weight: 700;
        line-height: 1.1;
      }

      .ef-material-grid.view-dense .ef-material-card {
        min-height: 40px;
        height: 40px;
        padding: 5px 8px;
        border-radius: 8px;
      }

      .ef-material-grid.view-dense .ef-material-name {
        font-size: 11px;
      }

      .ef-material-grid.view-mini .ef-material-card {
        min-height: 48px;
        height: 48px;
        padding: 6px;
      }

      .ef-material-grid.view-mini .ef-material-name {
        font-size: 10.5px;
      }

      .ef-material-grid.view-compact .ef-material-card {
        min-height: 56px;
        height: 56px;
        padding: 7px;
      }

      .ef-material-grid.view-compact .ef-material-name {
        font-size: 11.5px;
      }

      .ef-material-grid.view-large .ef-material-card {
        min-height: 105px;
      }

      .ef-material-grid.view-horizontal .ef-material-card {
        min-height: 55px;
        height: 55px;
        justify-content: flex-start;
        padding: 8px 14px;
        text-align: left;
      }

      .ef-material-grid.view-icon-list .ef-material-card {
        min-height: 50px;
        height: 50px;
        padding: 6px 10px;
      }

      .ef-material-grid.view-timeline .ef-material-card {
        min-height: 58px;
        text-align: center;
      }

      /* =====================================================
         EDITOR
         ===================================================== */

      .ef-editor {
        width: 100%;
        max-width: 720px;
        margin: 0 auto;
        text-align: center;
      }

      .ef-editor-card {
        width: 100%;
        box-sizing: border-box;
        padding: 14px;
        border-radius: 17px;
        border: 1px solid rgba(14,165,233,.28);
        background: #07182e;
      }

      .ef-editor-title {
        margin: 0 0 5px;
        font-size: 18px;
        font-weight: 850;
      }

      .ef-editor-subtitle {
        margin: 0 0 16px;
        font-size: 11px;
        opacity: .7;
      }

      .ef-field {
        width: 100%;
        margin-bottom: 12px;
        text-align: center;
      }

      .ef-field-label {
        display: block;
        margin-bottom: 6px;
        font-size: 11px;
        font-weight: 750;
        opacity: .85;
      }

      .ef-field-row {
        display: grid;
        grid-template-columns: 1fr 34px;
        gap: 6px;
        align-items: center;
      }

      .ef-input,
      .ef-select {
        width: 100%;
        min-height: 43px;
        padding: 9px 10px;
        box-sizing: border-box;
        border-radius: 10px;
        border: 1px solid rgba(14,165,233,.35);
        background: #050816;
        color: inherit;
        outline: none;
        text-align: center;
      }

      .ef-clear-field {
        width: 34px;
        height: 34px;
        border-radius: 9px;
        border: 1px solid rgba(239,68,68,.35);
        background: rgba(239,68,68,.08);
        color: #fca5a5;
        cursor: pointer;
        font-weight: 900;
      }

      .ef-quantity-row {
        display: grid;
        grid-template-columns: 44px 1fr 44px 34px;
        gap: 6px;
        align-items: center;
      }

      .ef-qty-btn {
        height: 43px;
        border-radius: 10px;
        border: 1px solid rgba(14,165,233,.35);
        background: #07182e;
        color: #38bdf8;
        font-size: 20px;
        font-weight: 900;
        cursor: pointer;
      }

      .ef-action-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 8px;
        margin-top: 14px;
      }

      .ef-action-row.three {
        grid-template-columns: repeat(3, minmax(0,1fr));
      }

      .ef-primary-btn,
      .ef-secondary-btn,
      .ef-danger-btn {
        min-height: 43px;
        border-radius: 10px;
        padding: 8px 10px;
        border: 1px solid rgba(14,165,233,.35);
        cursor: pointer;
        font-weight: 800;
      }

      .ef-primary-btn {
        color: #050816;
        background: linear-gradient(90deg,#38bdf8,#facc15);
      }

      .ef-secondary-btn {
        color: #38bdf8;
        background: #07182e;
      }

      .ef-danger-btn {
        color: #fecaca;
        background: rgba(239,68,68,.08);
        border-color: rgba(239,68,68,.35);
      }

      /* =====================================================
         ESTIMATE
         ===================================================== */

      .ef-estimate-list {
        width: 100%;
        display: grid;
        gap: 10px;
        text-align: center;
      }

      .ef-estimate-card {
        width: 100%;
        padding: 12px;
        box-sizing: border-box;
        border-radius: 14px;
        border: 1px solid rgba(14,165,233,.28);
        background: #07182e;
      }

      .ef-estimate-title {
        margin: 0 0 6px;
        font-size: 14px;
        font-weight: 800;
      }

      .ef-estimate-meta {
        font-size: 11px;
        opacity: .75;
        line-height: 1.5;
      }

      .ef-estimate-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 7px;
        margin-top: 9px;
      }

      /* =====================================================
         SETTINGS / CALCULATOR
         ===================================================== */

      .ef-setting-card,
      .ef-calc-card {
        width: 100%;
        max-width: 720px;
        margin: 0 auto 10px;
        padding: 13px;
        box-sizing: border-box;
        border-radius: 15px;
        border: 1px solid rgba(14,165,233,.28);
        background: #07182e;
        text-align: center;
      }

      .ef-setting-title {
        margin: 0 0 10px;
        font-size: 14px;
        font-weight: 800;
      }

      .ef-setting-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 7px;
      }

      .ef-setting-btn {
        border: 1px solid rgba(14,165,233,.28);
        border-radius: 9px;
        padding: 8px 11px;
        background: #050816;
        color: inherit;
        cursor: pointer;
        font-size: 11px;
      }

      .ef-setting-btn.active {
        color: #050816;
        background: linear-gradient(90deg,#38bdf8,#facc15);
        font-weight: 800;
      }

      .ef-calc-grid {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 8px;
      }

      .ef-calc-result {
        margin-top: 10px;
        min-height: 43px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #050816;
        border: 1px solid rgba(250,204,21,.25);
        color: #facc15;
        font-weight: 800;
      }

      /* =====================================================
         DRAWER
         ===================================================== */

      #drawerOverlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.58);
        z-index: 99990;
        display: none;
      }

      #drawerOverlay.open {
        display: block;
      }

      #drawer {
        position: fixed;
        top: 0;
        left: 0;
        width: min(320px,88vw);
        height: 100vh;
        z-index: 99999;
        box-sizing: border-box;
        padding: 15px;
        background: #050816;
        border-right: 1px solid rgba(14,165,233,.35);
        transform: translateX(-105%);
        transition: transform .22s ease;
        overflow-y: auto;
        text-align: center;
      }

      #drawer.open {
        transform: translateX(0);
      }

      .ef-drawer-brand {
        padding: 12px 8px 17px;
        border-bottom: 1px solid rgba(14,165,233,.18);
        margin-bottom: 10px;
      }

      .ef-drawer-brand .ef-brand-logo {
        width: 62px;
        height: 62px;
        margin-bottom: 7px;
      }

      .ef-drawer-name {
        font-size: 17px;
        font-weight: 900;
      }

      .ef-drawer-tagline {
        margin-top: 4px;
        font-size: 10px;
        opacity: .68;
      }

      .ef-drawer-menu {
        display: grid;
        gap: 7px;
      }

      .ef-drawer-btn {
        width: 100%;
        min-height: 44px;
        border-radius: 10px;
        border: 1px solid rgba(14,165,233,.20);
        background: #07182e;
        color: inherit;
        cursor: pointer;
        text-align: center;
        font-weight: 700;
      }

      .ef-drawer-btn.active {
        border-color: rgba(250,204,21,.50);
        color: #facc15;
      }

      .ef-drawer-separator {
        height: 1px;
        background: rgba(14,165,233,.16);
        margin: 7px 0;
      }

      /* =====================================================
         TOAST
         ===================================================== */

      .ef-toast {
        position: fixed;
        left: 50%;
        bottom: 78px;
        transform: translateX(-50%);
        z-index: 100000;
        max-width: calc(100vw - 30px);
        padding: 9px 13px;
        border-radius: 10px;
        background: #07182e;
        border: 1px solid rgba(56,189,248,.35);
        color: #e0f2fe;
        font-size: 11px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
      }

      /* =====================================================
         LIGHT MODE
         ===================================================== */

      body.light-mode #drawer {
        background: #f8fafc;
        color: #111827;
        border-color: rgba(14,165,233,.35);
      }

      body.light-mode .ef-drawer-btn,
      body.light-mode .ef-view-options,
      body.light-mode .ef-section-card,
      body.light-mode .ef-material-card,
      body.light-mode .ef-editor-card,
      body.light-mode .ef-setting-card,
      body.light-mode .ef-calc-card,
      body.light-mode .ef-estimate-card,
      body.light-mode .ef-view-trigger,
      body.light-mode .ef-back-btn,
      body.light-mode .ef-secondary-btn,
      body.light-mode .ef-qty-btn {
        background: #ffffff;
        color: #111827;
      }

      body.light-mode .ef-input,
      body.light-mode .ef-select {
        background: #ffffff;
        color: #111827;
      }

      body.light-mode .ef-view-option {
        color: #111827;
      }

      body.light-mode .ef-toast {
        background: #ffffff;
        color: #111827;
      }

      /* =====================================================
         SMALL SCREENS
         ===================================================== */

      @media (max-width: 360px) {
        #stageGrid,
        #sectionGrid,
        .ef-material-grid,
        #stageGrid.view-compact,
        #sectionGrid.view-compact,
        #stageGrid.view-mini,
        #sectionGrid.view-mini,
        #stageGrid.view-icon-list,
        #sectionGrid.view-icon-list {
          grid-template-columns: 1fr;
        }

        .ef-action-row,
        .ef-action-row.three {
          grid-template-columns: 1fr;
        }

        .ef-calc-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }


  /* =========================================================
     TOAST
     ========================================================= */

  let toastTimer = null;

  function showToast(message) {
    $$(".ef-toast").forEach((el) => el.remove());

    const toast = document.createElement("div");
    toast.className = "ef-toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.remove();
    }, 1500);
  }


  /* =========================================================
     THEME
     ========================================================= */

  function applyTheme() {
    document.body.classList.toggle(
      "light-mode",
      state.theme === "light"
    );

    const themeMeta = $('meta[name="theme-color"]');

    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        state.theme === "light"
          ? "#f8fafc"
          : "#050816"
      );
    }
  }

  function setTheme(theme) {
    state.theme =
      theme === "light"
        ? "light"
        : "dark";

    storageSet(STORAGE.theme, state.theme);

    applyTheme();

    buildDrawer();

    if (state.page === "settings") {
      renderCurrentPage(false);
    }
  }


  /* =========================================================
     LANGUAGE
     ========================================================= */

  function setLanguage(lang) {
    state.lang = lang === "en" ? "en" : "hi";

    storageSet(STORAGE.lang, state.lang);

    if (state.page === "home") {
      showHome(false);
    } else {
      renderCurrentPage(false);
    }

    buildDrawer();
    updateStaticUI();
    applyBranding();
  }


  /* =========================================================
     DRAWER
     ========================================================= */

  function getCurrentRouteState() {
    return {
      efRoute: true,
      page: state.page,
      stageIndex: state.stageIndex,
      sectionIndex: state.sectionIndex,
      itemIndex: state.itemIndex
    };
  }

  function ensureDrawer() {
    let drawer = $("#drawer");
    let overlay = $("#drawerOverlay");

    if (!drawer) {
      drawer = document.createElement("aside");
      drawer.id = "drawer";
      document.body.appendChild(drawer);
    }

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "drawerOverlay";
      document.body.appendChild(overlay);
    }

    overlay.onclick = () => {
      closeDrawer();
    };

    buildDrawer();

    return { drawer, overlay };
  }

  function buildDrawer() {
    const drawer = $("#drawer");

    if (!drawer) return;

    const isHindi = currentLang() === "hi";

    drawer.innerHTML = `
      <div class="ef-drawer-brand">
        ${brandLogoHTML()}

        <div class="ef-drawer-name">
          ${esc(BRAND.name)}
        </div>

        <div class="ef-drawer-tagline">
          ${
            isHindi
              ? esc(BRAND.taglineHi)
              : esc(BRAND.taglineEn)
          }
        </div>
      </div>

      <div class="ef-drawer-menu">

        <button
          type="button"
          class="ef-drawer-btn ${
            state.page === "home" ? "active" : ""
          }"
          data-drawer-nav="home">
          ${esc(langText("home"))}
        </button>

        <button
          type="button"
          class="ef-drawer-btn ${
            state.page === "estimate" ? "active" : ""
          }"
          data-drawer-nav="estimate">
          ${esc(langText("estimate"))}
        </button>

        <button
          type="button"
          class="ef-drawer-btn ${
            state.page === "calculator" ? "active" : ""
          }"
          data-drawer-nav="calculator">
          ${esc(langText("calculator"))}
        </button>

        <button
          type="button"
          class="ef-drawer-btn ${
            state.page === "settings" ? "active" : ""
          }"
          data-drawer-nav="settings">
          ${esc(langText("settings"))}
        </button>

        <div class="ef-drawer-separator"></div>

        <div class="ef-setting-title">
          ${esc(langText("language"))}
        </div>

        <div class="ef-setting-buttons">
          <button
            type="button"
            class="ef-setting-btn ${
              state.lang === "hi" ? "active" : ""
            }"
            data-drawer-lang="hi">
            हिन्दी
          </button>

          <button
            type="button"
            class="ef-setting-btn ${
              state.lang === "en" ? "active" : ""
            }"
            data-drawer-lang="en">
            English
          </button>
        </div>

        <div class="ef-drawer-separator"></div>

        <div class="ef-setting-title">
          ${esc(langText("theme"))}
        </div>

        <div class="ef-setting-buttons">
          <button
            type="button"
            class="ef-setting-btn ${
              state.theme === "dark" ? "active" : ""
            }"
            data-drawer-theme="dark">
            ${esc(langText("dark"))}
          </button>

          <button
            type="button"
            class="ef-setting-btn ${
              state.theme === "light" ? "active" : ""
            }"
            data-drawer-theme="light">
            ${esc(langText("light"))}
          </button>
        </div>

        <div class="ef-drawer-separator"></div>

        <button
          type="button"
          class="ef-drawer-btn"
          id="drawerResetBtn">
          ${esc(langText("reset"))}
        </button>

      </div>
    `;

    $$("[data-drawer-nav]", drawer).forEach((btn) => {
      btn.onclick = () => {
        navigate(btn.dataset.drawerNav);
      };
    });

    $$("[data-drawer-lang]", drawer).forEach((btn) => {
      btn.onclick = () => {
        setLanguage(btn.dataset.drawerLang);
      };
    });

    $$("[data-drawer-theme]", drawer).forEach((btn) => {
      btn.onclick = () => {
        setTheme(btn.dataset.drawerTheme);
      };
    });

    const resetBtn = $("#drawerResetBtn", drawer);

    if (resetBtn) {
      resetBtn.onclick = resetApplication;
    }
  }

  function showDrawerVisual() {
    const drawer = $("#drawer");
    const overlay = $("#drawerOverlay");
    const menu = $("#menuBtn");

    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");

    if (menu) {
      menu.classList.add("active");
      menu.setAttribute("aria-expanded", "true");
    }
  }

  function hideDrawerVisual() {
    const drawer = $("#drawer");
    const overlay = $("#drawerOverlay");
    const menu = $("#menuBtn");

    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("open");

    if (menu) {
      menu.classList.remove("active");
      menu.setAttribute("aria-expanded", "false");
    }
  }

  function openDrawer() {
    ensureDrawer();

    if (state.drawerOpen) return;

    state.drawerOpen = true;

    try {
      history.pushState(
        {
          ...getCurrentRouteState(),
          efDrawer: true
        },
        "",
        location.href
      );

      state.drawerHistoryPushed = true;
    } catch {
      state.drawerHistoryPushed = false;
    }

    showDrawerVisual();
  }

  function closeDrawer(fromPopState = false) {
    if (!state.drawerOpen) {
      hideDrawerVisual();
      return;
    }

    const hadHistoryEntry =
      state.drawerHistoryPushed;

    state.drawerOpen = false;
    state.drawerHistoryPushed = false;

    hideDrawerVisual();

    if (
      hadHistoryEntry &&
      !fromPopState
    ) {
      try {
        history.back();
      } catch {}
    }
  }

  function prepareNavigationFromDrawer() {
    if (!state.drawerOpen) return;

    if (state.drawerHistoryPushed) {
      try {
        history.replaceState(
          getCurrentRouteState(),
          "",
          location.href
        );
      } catch {}
    }

    state.drawerHistoryPushed = false;
    state.drawerOpen = false;

    hideDrawerVisual();
  }

  function toggleDrawer() {
    if (state.drawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }


  /* =========================================================
     HAMBURGER
     ========================================================= */

  function bindHamburger() {
    const btn = $("#menuBtn");

    if (!btn) return;

    btn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleDrawer();
    };
  }


  /* =========================================================
     HISTORY
     ========================================================= */

  function routeStateFor(
    page,
    stageIndex = -1,
    sectionIndex = -1,
    itemIndex = -1
  ) {
    return {
      efRoute: true,
      page,
      stageIndex,
      sectionIndex,
      itemIndex
    };
  }

  function pushHistory() {
    try {
      history.pushState(
        routeStateFor(
          state.page,
          state.stageIndex,
          state.sectionIndex,
          state.itemIndex
        ),
        "",
        location.href
      );
    } catch {}

    state.historyReady = true;
  }

  function replaceHistory() {
    try {
      history.replaceState(
        routeStateFor(
          state.page,
          state.stageIndex,
          state.sectionIndex,
          state.itemIndex
        ),
        "",
        location.href
      );
    } catch {}

    state.historyReady = true;
  }

  function seedHistoryForSavedRoute() {
    const currentPage = state.page;
    const currentStage = state.stageIndex;
    const currentSection = state.sectionIndex;
    const currentItem = state.itemIndex;

    try {
      history.replaceState(
        routeStateFor("home", -1, -1, -1),
        "",
        location.href
      );

      if (currentPage === "home") {
        state.historyReady = true;
        return;
      }

      if (
        currentPage === "stage" ||
        currentPage === "section" ||
        currentPage === "item"
      ) {
        history.pushState(
          routeStateFor(
            "stage",
            currentStage,
            -1,
            -1
          ),
          "",
          location.href
        );
      }

      if (
        currentPage === "section" ||
        currentPage === "item"
      ) {
        history.pushState(
          routeStateFor(
            "section",
            currentStage,
            currentSection,
            -1
          ),
          "",
          location.href
        );
      }

      if (currentPage === "item") {
        history.pushState(
          routeStateFor(
            "item",
            currentStage,
            currentSection,
            currentItem
          ),
          "",
          location.href
        );
      }

      if (
        currentPage === "estimate" ||
        currentPage === "calculator" ||
        currentPage === "settings"
      ) {
        history.pushState(
          routeStateFor(
            currentPage,
            -1,
            -1,
            -1
          ),
          "",
          location.href
        );
      }
    } catch {
      replaceHistory();
    }

    state.historyReady = true;
  }


  /* =========================================================
     NAVIGATION
     ========================================================= */

  function navigate(
    page,
    stageIndex = state.stageIndex,
    sectionIndex = state.sectionIndex,
    itemIndex = state.itemIndex,
    options = {}
  ) {
    if (state.drawerOpen) {
      prepareNavigationFromDrawer();
    }

    state.page = page;

    state.stageIndex =
      Number.isInteger(stageIndex)
        ? stageIndex
        : -1;

    state.sectionIndex =
      Number.isInteger(sectionIndex)
        ? sectionIndex
        : -1;

    state.itemIndex =
      Number.isInteger(itemIndex)
        ? itemIndex
        : -1;

    if (page !== "item") {
      state.editingEstimateId = null;
    }

    saveRoute();

    if (options.replace) {
      replaceHistory();
    } else {
      pushHistory();
    }

    renderCurrentPage(false);
  }


  /* =========================================================
     HOME
     ========================================================= */

  const homeEl = $("#home");

  const homeMarkup = homeEl
    ? homeEl.innerHTML
    : "";

  let homeIsStatic = true;

  function showHome(push = false) {
    state.page = "home";
    state.stageIndex = -1;
    state.sectionIndex = -1;
    state.itemIndex = -1;
    state.editingEstimateId = null;

    saveRoute();

    if (push) {
      pushHistory();
    }

    if (homeEl) {
      homeEl.innerHTML = homeMarkup;
      homeIsStatic = true;
    }

    bindHome();

    applyBranding();

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }


  /* =========================================================
     HOME STAGES
     ========================================================= */

  function stageItemCount(stage) {
    return stage.sections.reduce(
      (total, section) =>
        total + section.items.length,
      0
    );
  }

  function renderHomeStages() {
    const grid = $("#stageGrid");

    if (!grid) return;

    grid.classList.remove(
      "view-grid",
      "view-list",
      "view-compact",
      "view-large",
      "view-mini",
      "view-two-column",
      "view-horizontal",
      "view-icon-list",
      "view-timeline",
      "view-dense"
    );

    grid.classList.add(
      `view-${state.stageView}`
    );

    grid.innerHTML = DATA.map(
      (stage, index) => `
        <button
          type="button"
          class="stage-card"
          data-stage-index="${index}">

          <div class="ef-stage-logo-wrap">
            ${brandLogoHTML()}
          </div>

          <div>
            <h3>
              ${esc(tr(stage.name))}
            </h3>

            <p>
              ${stageItemCount(stage)}
              ${
                currentLang() === "hi"
                  ? " मटेरियल"
                  : " Materials"
              }
            </p>
          </div>
        </button>
      `
    ).join("");

    $$(".stage-card", grid).forEach((card) => {
      card.onclick = () => {
        openStage(
          Number(card.dataset.stageIndex)
        );
      };
    });
  }


  /* =========================================================
     HOME VIEW SELECTOR
     ========================================================= */

  function viewOptionsHTML(
    active,
    prefix,
    context
  ) {
    return VIEW_MODES.map((mode) => `
      <button
        type="button"
        class="ef-view-option ${
          active === mode ? "active" : ""
        }"
        data-view-mode="${mode}"
        data-view-context="${context}"
        data-view-prefix="${prefix}">
        ${esc(tr(VIEW_LABELS[mode]))}
      </button>
    `).join("");
  }

  function createFallbackHomeViewSelector() {
    const stageGrid = $("#stageGrid");

    if (!stageGrid) return;

    if (
      $("#viewTrigger") &&
      $("#viewOptions")
    ) {
      return;
    }

    const parent = stageGrid.parentElement;

    if (!parent) return;

    let picker = $("#efHomeViewPicker");

    if (!picker) {
      picker = document.createElement("div");
      picker.id = "efHomeViewPicker";
      picker.className = "ef-view-picker";

      parent.insertBefore(
        picker,
        stageGrid
      );
    }

    picker.innerHTML = `
      <button
        type="button"
        id="homeViewTrigger"
        class="ef-view-trigger"
        aria-expanded="false"
        aria-label="${esc(
          langText("stageView")
        )}">
        ◈
      </button>

      <div
        id="homeViewOptions"
        class="ef-view-options"
        hidden>
        ${viewOptionsHTML(
          state.stageView,
          "home",
          "stage"
        )}
      </div>
    `;

    bindHomeViewSelector(
      $("#homeViewTrigger"),
      $("#homeViewOptions")
    );
  }

  function bindHomeViewSelector(
    trigger,
    options
  ) {
    if (!trigger || !options) return;

    trigger.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const willOpen =
        options.hasAttribute("hidden");

      if (willOpen) {
        options.removeAttribute("hidden");
      } else {
        options.setAttribute("hidden", "");
      }

      trigger.setAttribute(
        "aria-expanded",
        String(willOpen)
      );
    };

    $$(
      ".ef-view-option",
      options
    ).forEach((btn) => {
      btn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const mode =
          btn.dataset.viewMode;

        state.stageView =
          validView(mode);

        storageSet(
          STORAGE.stageView,
          state.stageView
        );

        options.setAttribute(
          "hidden",
          ""
        );

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        applyStageView();

        $$(
          ".ef-view-option",
          options
        ).forEach((option) => {
          option.classList.toggle(
            "active",
            option.dataset.viewMode ===
              state.stageView
          );
        });
      };
    });
  }

  function bindExistingHomeViewSelector() {
    const trigger = $("#viewTrigger");
    const options = $("#viewOptions");

    if (!trigger || !options) {
      createFallbackHomeViewSelector();
      return;
    }

    trigger.textContent = "◈";

    trigger.setAttribute(
      "aria-label",
      langText("stageView")
    );

    $$(
      ".view-option, .ef-view-option",
      options
    ).forEach((btn) => {
      if (!btn.dataset.viewMode) return;

      btn.textContent = tr(
        VIEW_LABELS[
          btn.dataset.viewMode
        ] || btn.dataset.viewMode
      );

      btn.classList.toggle(
        "active",
        btn.dataset.viewMode ===
          state.stageView
      );
    });

    bindHomeViewSelector(
      trigger,
      options
    );
  }

  function applyStageView() {
    const grids = [
      $("#stageGrid"),
      $("#sectionGrid")
    ].filter(Boolean);

    grids.forEach((grid) => {
      VIEW_MODES.forEach((mode) => {
        grid.classList.remove(
          `view-${mode}`
        );
      });

      grid.classList.add(
        `view-${state.stageView}`
      );
    });
  }


  /* =========================================================
     SEARCH / FILTER
     ========================================================= */

  function getAllSearchText(stage) {
    const parts = [
      stage.id,
      stage.name
    ];

    stage.sections.forEach((section) => {
      parts.push(section.name);

      section.items.forEach((item) => {
        parts.push(item.name);

        item.fields.forEach((field) => {
          parts.push(field.name);
          parts.push(...field.options);
        });

        parts.push(...item.units);
        parts.push(...item.brands);
      });
    });

    return parts
      .join(" ")
      .toLowerCase();
  }

  function populateFilters() {
    const typeFilter = $("#typeFilter");
    const sizeFilter = $("#sizeFilter");
    const brandFilter = $("#brandFilter");

    const types = new Set();
    const sizes = new Set();
    const brands = new Set();

    DATA.forEach((stage) => {
      stage.sections.forEach((section) => {
        section.items.forEach((item) => {
          item.fields.forEach((field) => {
            const name =
              field.name.toLowerCase();

            if (
              name.includes("type") ||
              name.includes("sub type")
            ) {
              field.options.forEach((v) =>
                types.add(v)
              );
            }

            if (
              name.includes("size")
            ) {
              field.options.forEach((v) =>
                sizes.add(v)
              );
            }
          });

          item.brands.forEach((v) =>
            brands.add(v)
          );
        });
      });
    });

    function fillSelect(
      select,
      values
    ) {
      if (!select) return;

      const old = select.value;

      select.innerHTML = `
        <option value="">
          ${esc(
            currentLang() === "hi"
              ? "सभी"
              : "All"
          )}
        </option>

        ${Array.from(values)
          .sort()
          .map(
            (value) => `
              <option value="${esc(value)}">
                ${esc(tr(value))}
              </option>
            `
          )
          .join("")}
      `;

      if (
        Array.from(values).includes(old)
      ) {
        select.value = old;
      }
    }

    fillSelect(typeFilter, types);
    fillSelect(sizeFilter, sizes);
    fillSelect(brandFilter, brands);
  }

  function applySearchAndFilter() {
    const searchInput =
      $("#searchInput") ||
      $("#mainSearch") ||
      $("#search");

    const query =
      searchInput?.value
        ?.trim()
        .toLowerCase() || "";

    const typeValue =
      $("#typeFilter")?.value || "";

    const sizeValue =
      $("#sizeFilter")?.value || "";

    const brandValue =
      $("#brandFilter")?.value || "";

    $$(".stage-card").forEach(
      (card) => {
        const index =
          Number(card.dataset.stageIndex);

        const stage = DATA[index];

        if (!stage) return;

        const text =
          getAllSearchText(stage);

        let visible =
          !query ||
          text.includes(query);

        if (
          visible &&
          typeValue
        ) {
          visible = stage.sections.some(
            (section) =>
              section.items.some(
                (item) =>
                  item.fields.some(
                    (field) =>
                      (
                        field.name
                          .toLowerCase()
                          .includes("type")
                      ) &&
                      field.options.includes(
                        typeValue
                      )
                  )
              )
          );
        }

        if (
          visible &&
          sizeValue
        ) {
          visible = stage.sections.some(
            (section) =>
              section.items.some(
                (item) =>
                  item.fields.some(
                    (field) =>
                      field.name
                        .toLowerCase()
                        .includes("size") &&
                      field.options.includes(
                        sizeValue
                      )
                  )
              )
          );
        }

        if (
          visible &&
          brandValue
        ) {
          visible = stage.sections.some(
            (section) =>
              section.items.some(
                (item) =>
                  item.brands.includes(
                    brandValue
                  )
              )
          );
        }

        card.style.display =
          visible ? "" : "none";
      }
    );
  }

  function clearFilters() {
    [
      "#searchInput",
      "#mainSearch",
      "#search"
    ].forEach((selector) => {
      const el = $(selector);
      if (el) el.value = "";
    });

    [
      "#typeFilter",
      "#sizeFilter",
      "#brandFilter"
    ].forEach((selector) => {
      const el = $(selector);
      if (el) el.value = "";
    });

    applySearchAndFilter();
  }

  function bindHomeSearch() {
    const searchInput =
      $("#searchInput") ||
      $("#mainSearch") ||
      $("#search");

    if (searchInput) {
      searchInput.placeholder =
        langText("searchPlaceholder");

      searchInput.oninput =
        applySearchAndFilter;
    }

    [
      "#typeFilter",
      "#sizeFilter",
      "#brandFilter"
    ].forEach((selector) => {
      const el = $(selector);

      if (el) {
        el.onchange =
          applySearchAndFilter;
      }
    });

    const clearBtn =
      $("#clearFilter") ||
      $("#clearSearch");

    if (clearBtn) {
      clearBtn.onclick =
        clearFilters;
    }
  }


  /* =========================================================
     HOME BIND
     ========================================================= */

  function bindHome() {
    state.currentViewContext =
      "stage";

    renderHomeStages();

    populateFilters();

    bindHomeSearch();

    bindExistingHomeViewSelector();

    applyStageView();

    bindHamburger();

    bindBottomNav();

    updateStaticUI();

    applyBranding();
  }


  /* =========================================================
     STAGE PAGE
     ========================================================= */

  function openStage(stageIndex) {
    if (
      stageIndex < 0 ||
      stageIndex >= DATA.length
    ) {
      return;
    }

    navigate(
      "stage",
      stageIndex,
      -1,
      -1
    );
  }

  function renderStagePage() {
    const stage =
      DATA[state.stageIndex];

    if (!stage) {
      showHome(false);
      return;
    }

    state.currentViewContext =
      "stage";

    return `
      <div class="ef-page">

        <div class="ef-page-head">

          <button
            type="button"
            class="ef-back-btn"
            id="routeBackBtn"
            aria-label="${esc(
              langText("back")
            )}">
            ←
          </button>

          <div class="ef-page-brand">
            ${brandLogoHTML()}

            <div>
              <h2 class="ef-page-title">
                ${esc(tr(stage.name))}
              </h2>

              <p class="ef-page-subtitle">
                ${esc(BRAND.name)}
              </p>
            </div>
          </div>

          <div class="ef-view-picker">

            <button
              type="button"
              class="ef-view-trigger"
              id="stageViewTrigger"
              aria-expanded="false"
              aria-label="${esc(
                langText("stageView")
              )}">
              ◈
            </button>

            <div
              id="stageViewOptions"
              class="ef-view-options"
              hidden>
              ${viewOptionsHTML(
                state.stageView,
                "stage",
                "stage"
              )}
            </div>

          </div>

        </div>

        <div class="ef-breadcrumb">
          ${esc(langText("stages"))}
          &nbsp;›&nbsp;
          ${esc(tr(stage.name))}
          &nbsp;›&nbsp;
          ${esc(langText("sections"))}
        </div>

        <div
          id="sectionGrid"
          class="view-${esc(state.stageView)}">
          ${renderStageSections(stage)}
        </div>

      </div>
    `;
  }

  function renderStageSections(stage) {
    if (!stage.sections.length) {
      return `
        <div class="ef-setting-card">
          ${esc(langText("nothing"))}
        </div>
      `;
    }

    return stage.sections
      .map(
        (section, index) => `
          <button
            type="button"
            class="ef-section-card"
            data-section-index="${index}">

            <h3>
              ${esc(tr(section.name))}
            </h3>

            <p>
              ${section.items.length}
              ${
                currentLang() === "hi"
                  ? " मटेरियल"
                  : " Materials"
              }
            </p>

          </button>
        `
      )
      .join("");
  }

  function bindStagePage() {
    const backBtn =
      $("#routeBackBtn");

    if (backBtn) {
      backBtn.onclick =
        goBackRoute;
    }

    $$(".ef-section-card").forEach(
      (card) => {
        card.onclick = () => {
          openSection(
            state.stageIndex,
            Number(
              card.dataset.sectionIndex
            )
          );
        };
      }
    );

    bindRouteViewPicker(
      "stage",
      state.stageView
    );

    applyStageView();
  }


  /* =========================================================
     SECTION PAGE
     ========================================================= */

  function openSection(
    stageIndex,
    sectionIndex
  ) {
    const stage =
      DATA[stageIndex];

    if (!stage) return;

    const section =
      stage.sections[sectionIndex];

    if (!section) return;

    navigate(
      "section",
      stageIndex,
      sectionIndex,
      -1
    );
  }

  function renderSectionPage() {
    const stage =
      DATA[state.stageIndex];

    const section =
      stage?.sections[
        state.sectionIndex
      ];

    if (!stage || !section) {
      showHome(false);
      return "";
    }

    state.currentViewContext =
      "material";

    return `
      <div class="ef-page">

        <div class="ef-page-head">

          <button
            type="button"
            class="ef-back-btn"
            id="routeBackBtn"
            aria-label="${esc(
              langText("back")
            )}">
            ←
          </button>

          <div class="ef-page-brand">
            ${brandLogoHTML()}

            <div>
              <h2 class="ef-page-title">
                ${esc(tr(section.name))}
              </h2>

              <p class="ef-page-subtitle">
                ${esc(tr(stage.name))}
              </p>
            </div>
          </div>

          <div class="ef-view-picker">

            <button
              type="button"
              class="ef-view-trigger"
              id="materialViewTrigger"
              aria-expanded="false"
              aria-label="${esc(
                langText("materialView")
              )}">
              ◈
            </button>

            <div
              id="materialViewOptions"
              class="ef-view-options"
              hidden>
              ${viewOptionsHTML(
                state.materialView,
                "material",
                "material"
              )}
            </div>

          </div>

        </div>

        <div class="ef-breadcrumb">
          ${esc(langText("stages"))}
          &nbsp;›&nbsp;
          ${esc(tr(stage.name))}
          &nbsp;›&nbsp;
          ${esc(tr(section.name))}
        </div>

        <div
          id="materialGrid"
          class="ef-material-grid view-${esc(
            state.materialView
          )}">

          ${renderSectionMaterials(section)}

        </div>

      </div>
    `;
  }

  function renderSectionMaterials(
    section
  ) {
    if (!section.items.length) {
      return `
        <div class="ef-setting-card">
          ${esc(
            langText("noMaterials")
          )}
        </div>
      `;
    }

    return section.items
      .map(
        (item, index) => `
          <button
            type="button"
            class="ef-material-card"
            data-item-index="${index}">

            <div class="ef-material-name">
              ${esc(tr(item.name))}
            </div>

          </button>
        `
      )
      .join("");
  }

  function bindSectionPage() {
    const backBtn =
      $("#routeBackBtn");

    if (backBtn) {
      backBtn.onclick =
        goBackRoute;
    }

    $$(".ef-material-card").forEach(
      (card) => {
        card.onclick = () => {
          openItem(
            state.stageIndex,
            state.sectionIndex,
            Number(
              card.dataset.itemIndex
            )
          );
        };
      }
    );

    bindRouteViewPicker(
      "material",
      state.materialView
    );

    applyMaterialView();
  }


  /* =========================================================
     ROUTE VIEW PICKER
     ========================================================= */

  function bindRouteViewPicker(
    context,
    active
  ) {
    const trigger =
      context === "material"
        ? $("#materialViewTrigger")
        : $("#stageViewTrigger");

    const options =
      context === "material"
        ? $("#materialViewOptions")
        : $("#stageViewOptions");

    if (!trigger || !options) return;

    trigger.textContent = "◈";

    trigger.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const willOpen =
        options.hasAttribute("hidden");

      if (willOpen) {
        options.removeAttribute("hidden");
      } else {
        options.setAttribute(
          "hidden",
          ""
        );
      }

      trigger.setAttribute(
        "aria-expanded",
        String(willOpen)
      );
    };

    $$(".ef-view-option", options)
      .forEach((btn) => {
        btn.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();

          const mode =
            validView(
              btn.dataset.viewMode
            );

          if (context === "material") {
            state.materialView =
              mode;

            storageSet(
              STORAGE.materialView,
              mode
            );
          } else {
            state.stageView =
              mode;

            storageSet(
              STORAGE.stageView,
              mode
            );
          }

          options.setAttribute(
            "hidden",
            ""
          );

          trigger.setAttribute(
            "aria-expanded",
            "false"
          );

          renderCurrentPage(false);
        };
      });
  }

  function applyMaterialView() {
    $$(".ef-material-grid").forEach(
      (grid) => {
        VIEW_MODES.forEach((mode) => {
          grid.classList.remove(
            `view-${mode}`
          );
        });

        grid.classList.add(
          `view-${state.materialView}`
        );
      }
    );
  }


  /* =========================================================
     ITEM
     ========================================================= */

  function getCurrentItem() {
    const stage =
      DATA[state.stageIndex];

    const section =
      stage?.sections[
        state.sectionIndex
      ];

    return (
      section?.items[
        state.itemIndex
      ] || null
    );
  }

  function getEstimateForCurrentItem() {
    const items =
      getEstimateItems();

    if (state.editingEstimateId) {
      const byId =
        items.find(
          (item) =>
            item.id ===
            state.editingEstimateId
        );

      if (byId) return byId;
    }

    return (
      items.find(
        (item) =>
          item.stageIndex ===
            state.stageIndex &&
          item.sectionIndex ===
            state.sectionIndex &&
          item.itemIndex ===
            state.itemIndex
      ) || null
    );
  }

  function openItem(
    stageIndex,
    sectionIndex,
    itemIndex,
    editingId = null
  ) {
    const stage =
      DATA[stageIndex];

    const section =
      stage?.sections[sectionIndex];

    const item =
      section?.items[itemIndex];

    if (!stage || !section || !item) {
      return;
    }

    state.editingEstimateId =
      editingId;

    state.draft = {};

    navigate(
      "item",
      stageIndex,
      sectionIndex,
      itemIndex
    );
  }

  function renderItemPage() {
    const stage =
      DATA[state.stageIndex];

    const section =
      stage?.sections[
        state.sectionIndex
      ];

    const item =
      section?.items[
        state.itemIndex
      ];

    if (!stage || !section || !item) {
      showHome(false);
      return "";
    }

    const existing =
      getEstimateForCurrentItem();

    return `
      <div class="ef-page">

        <div class="ef-page-head">

          <button
            type="button"
            class="ef-back-btn"
            id="routeBackBtn"
            aria-label="${esc(
              langText("back")
            )}">
            ←
          </button>

          <div class="ef-page-brand">
            ${brandLogoHTML()}

            <div>
              <h2 class="ef-page-title">
                ${esc(tr(item.name))}
              </h2>

              <p class="ef-page-subtitle">
                ${esc(BRAND.name)}
              </p>
            </div>
          </div>

          <div></div>

        </div>

        <div class="ef-breadcrumb">
          ${esc(tr(stage.name))}
          &nbsp;›&nbsp;
          ${esc(tr(section.name))}
          &nbsp;›&nbsp;
          ${esc(tr(item.name))}
        </div>

        <div class="ef-editor">

          <div class="ef-editor-card">

            <h2 class="ef-editor-title">
              ${esc(tr(item.name))}
            </h2>

            <p class="ef-editor-subtitle">
              ${esc(
                currentLang() === "hi"
                  ? "मटेरियल डिटेल भरें"
                  : "Enter material details"
              )}
            </p>

            ${renderFields(
              item,
              existing
            )}

            ${renderQuantity(
              existing
            )}

            ${renderUnit(
              item,
              existing
            )}

            ${renderBrand(
              item,
              existing
            )}

            <div class="ef-action-row three">

              <button
                type="button"
                class="ef-secondary-btn"
                id="itemBackBtn">
                ${esc(
                  langText("back")
                )}
              </button>

              <button
                type="button"
                class="ef-primary-btn"
                id="saveItemBtn">
                ${esc(
                  existing
                    ? langText("update")
                    : langText("add")
                )}
              </button>

              <button
                type="button"
                class="ef-secondary-btn"
                id="nextItemBtn">
                ${esc(
                  langText("next")
                )}
              </button>

            </div>

          </div>

        </div>

      </div>
    `;
  }


  /* =========================================================
     ITEM FIELDS
     ========================================================= */

  function getExistingFieldValue(
    existing,
    fieldName
  ) {
    if (!existing?.values) {
      return "";
    }

    return (
      existing.values[fieldName] ||
      ""
    );
  }

  function renderFields(
    item,
    existing
  ) {
    if (!item.fields.length) {
      return "";
    }

    return item.fields
      .map((field, fieldIndex) => {
        const value =
          getExistingFieldValue(
            existing,
            field.name
          );

        return `
          <div class="ef-field">

            <label
              class="ef-field-label">
              ${esc(tr(field.name))}
            </label>

            <div class="ef-field-row">

              <select
                class="ef-select ef-item-field"
                data-field-index="${fieldIndex}"
                data-field-name="${esc(
                  field.name
                )}">

                <option value="">
                  ${
                    currentLang() === "hi"
                      ? "चुनें"
                      : "Select"
                  }
                </option>

                ${field.options
                  .map(
                    (option) => `
                      <option
                        value="${esc(option)}"
                        ${
                          value === option
                            ? "selected"
                            : ""
                        }>
                        ${esc(
                          tr(option)
                        )}
                      </option>
                    `
                  )
                  .join("")}

              </select>

              <button
                type="button"
                class="ef-clear-field"
                data-clear-field="${fieldIndex}"
                aria-label="${esc(
                  langText("clear")
                )}">
                ×
              </button>

            </div>

          </div>
        `;
      })
      .join("");
  }


  /* =========================================================
     QUANTITY
     ========================================================= */

  function renderQuantity(existing) {
    const quantity =
      existing?.quantity != null
        ? existing.quantity
        : 1;

    return `
      <div class="ef-field">

        <label class="ef-field-label">
          ${esc(langText("quantity"))}
        </label>

        <div class="ef-quantity-row">

          <button
            type="button"
            class="ef-qty-btn"
            id="qtyMinus">
            −
          </button>

          <input
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            class="ef-input"
            id="itemQuantity"
            value="${esc(quantity)}">

          <button
            type="button"
            class="ef-qty-btn"
            id="qtyPlus">
            +
          </button>

          <button
            type="button"
            class="ef-clear-field"
            id="qtyClear">
            ×
          </button>

        </div>

      </div>
    `;
  }


  /* =========================================================
     UNIT
     ========================================================= */

  function renderUnit(
    item,
    existing
  ) {
    const units =
      item.units.length
        ? item.units
        : [
            "pcs"
          ];

    let current =
      existing?.unit ||
      storageGet(
        STORAGE.lastUnit,
        ""
      );

    if (
      current &&
      !units.includes(current)
    ) {
      current = "";
    }

    return `
      <div class="ef-field">

        <label class="ef-field-label">
          ${esc(langText("unit"))}
        </label>

        <div class="ef-field-row">

          <select
            class="ef-select"
            id="itemUnit">

            <option value="">
              ${
                currentLang() === "hi"
                  ? "चुनें"
                  : "Select"
              }
            </option>

            ${units
              .map(
                (unit) => `
                  <option
                    value="${esc(unit)}"
                    ${
                      current === unit
                        ? "selected"
                        : ""
                    }>
                    ${esc(tr(unit))}
                  </option>
                `
              )
              .join("")}

          </select>

          <button
            type="button"
            class="ef-clear-field"
            id="unitClear">
            ×
          </button>

        </div>

      </div>
    `;
  }


  /* =========================================================
     BRAND
     ========================================================= */

  function renderBrand(
    item,
    existing
  ) {
    if (!item.brands.length) {
      return "";
    }

    const current =
      existing?.brand || "";

    return `
      <div class="ef-field">

        <label class="ef-field-label">
          ${esc(langText("brand"))}
        </label>

        <div class="ef-field-row">

          <select
            class="ef-select"
            id="itemBrand">

            <option value="">
              ${
                currentLang() === "hi"
                  ? "वैकल्पिक"
                  : "Optional"
              }
            </option>

            ${item.brands
              .map(
                (brand) => `
                  <option
                    value="${esc(brand)}"
                    ${
                      current === brand
                        ? "selected"
                        : ""
                    }>
                    ${esc(tr(brand))}
                  </option>
                `
              )
              .join("")}

          </select>

          <button
            type="button"
            class="ef-clear-field"
            id="brandClear">
            ×
          </button>

        </div>

      </div>
    `;
  }


  /* =========================================================
     ITEM EDITOR
     ========================================================= */

  function collectItemValues() {
    const values = {};

    $$(".ef-item-field").forEach(
      (field) => {
        values[
          field.dataset.fieldName
        ] = field.value;
      }
    );

    return values;
  }

  function bindItemEditor() {
    const backBtn =
      $("#routeBackBtn");

    if (backBtn) {
      backBtn.onclick =
        goBackRoute;
    }

    const itemBackBtn =
      $("#itemBackBtn");

    if (itemBackBtn) {
      itemBackBtn.onclick =
        goBackRoute;
    }

    $$("[data-clear-field]").forEach(
      (btn) => {
        btn.onclick = () => {
          const index =
            btn.dataset.clearField;

          const field = $(
            `.ef-item-field[data-field-index="${CSS.escape(
              index
            )}"]`
          );

          if (field) {
            field.value = "";
          }
        };
      }
    );

    const quantity =
      $("#itemQuantity");

    const minus =
      $("#qtyMinus");

    const plus =
      $("#qtyPlus");

    const clear =
      $("#qtyClear");

    function setQuantity(value) {
      if (!quantity) return;

      let num =
        Number(value);

      if (!Number.isFinite(num)) {
        num = 0;
      }

      num = Math.max(
        0,
        Math.floor(num)
      );

      quantity.value = String(num);
    }

    if (minus) {
      minus.onclick = () => {
        setQuantity(
          Number(quantity?.value || 0) - 1
        );
      };
    }

    if (plus) {
      plus.onclick = () => {
        setQuantity(
          Number(quantity?.value || 0) + 1
        );
      };
    }

    if (clear) {
      clear.onclick = () => {
        setQuantity(0);
      };
    }

    const unitClear =
      $("#unitClear");

    if (unitClear) {
      unitClear.onclick = () => {
        const unit =
          $("#itemUnit");

        if (unit) {
          unit.value = "";
        }
      };
    }

    const brandClear =
      $("#brandClear");

    if (brandClear) {
      brandClear.onclick = () => {
        const brand =
          $("#itemBrand");

        if (brand) {
          brand.value = "";
        }
      };
    }

    const saveBtn =
      $("#saveItemBtn");

    if (saveBtn) {
      saveBtn.onclick =
        saveCurrentItem;
    }

    const nextBtn =
      $("#nextItemBtn");

    if (nextBtn) {
      nextBtn.onclick =
        openNextItem;
    }
  }


  /* =========================================================
     SAVE ITEM
     ========================================================= */

  function saveCurrentItem() {
    const quantityInput =
      $("#itemQuantity");

    const quantity =
      Number(
        quantityInput?.value || 0
      );

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      showToast(
        langText("quantityRequired")
      );

      quantityInput?.focus();

      return;
    }

    const values =
      collectItemValues();

    const unit =
      $("#itemUnit")?.value || "";

    const brand =
      $("#itemBrand")?.value || "";

    const item =
      getCurrentItem();

    if (!item) return;

    const estimates =
      getEstimateItems();

    let existingIndex = -1;

    if (state.editingEstimateId) {
      existingIndex =
        estimates.findIndex(
          (entry) =>
            entry.id ===
            state.editingEstimateId
        );
    }

    if (existingIndex < 0) {
      existingIndex =
        estimates.findIndex(
          (entry) =>
            entry.stageIndex ===
              state.stageIndex &&
            entry.sectionIndex ===
              state.sectionIndex &&
            entry.itemIndex ===
              state.itemIndex
        );
    }

    const entry = {
      id:
        existingIndex >= 0
          ? estimates[existingIndex].id
          : makeId(),

      stageIndex:
        state.stageIndex,

      sectionIndex:
        state.sectionIndex,

      itemIndex:
        state.itemIndex,

      stage:
        DATA[state.stageIndex].name,

      section:
        DATA[state.stageIndex]
          .sections[state.sectionIndex]
          .name,

      name:
        item.name,

      values,

      quantity,

      unit,

      brand,

      price: ""
    };

    if (existingIndex >= 0) {
      estimates[existingIndex] =
        entry;
    } else {
      estimates.push(entry);
    }

    saveEstimateItems(
      estimates
    );

    if (unit) {
      storageSet(
        STORAGE.lastUnit,
        unit
      );
    }

    showToast(
      existingIndex >= 0
        ? langText("updated")
        : langText("added")
    );

    state.editingEstimateId = null;

    setTimeout(
      openNextItem,
      220
    );
  }


  /* =========================================================
     NEXT ITEM
     ========================================================= */

  function getNextPosition() {
    let s =
      state.stageIndex;

    let sec =
      state.sectionIndex;

    let item =
      state.itemIndex + 1;

    if (
      DATA[s]?.sections[sec] &&
      item <
        DATA[s].sections[sec].items.length
    ) {
      return {
        stageIndex: s,
        sectionIndex: sec,
        itemIndex: item
      };
    }

    sec++;

    while (
      DATA[s] &&
      sec < DATA[s].sections.length
    ) {
      if (
        DATA[s].sections[sec].items.length
      ) {
        return {
          stageIndex: s,
          sectionIndex: sec,
          itemIndex: 0
        };
      }

      sec++;
    }

    s++;

    while (s < DATA.length) {
      for (
        let sectionIndex = 0;
        sectionIndex <
        DATA[s].sections.length;
        sectionIndex++
      ) {
        const section =
          DATA[s].sections[
            sectionIndex
          ];

        if (section.items.length) {
          return {
            stageIndex: s,
            sectionIndex,
            itemIndex: 0
          };
        }
      }

      s++;
    }

    return null;
  }

  function openNextItem() {
    const next =
      getNextPosition();

    if (!next) {
      navigate("estimate");
      return;
    }

    state.editingEstimateId =
      null;

    state.draft = {};

    navigate(
      "item",
      next.stageIndex,
      next.sectionIndex,
      next.itemIndex
    );
  }


  /* =========================================================
     ESTIMATE PAGE
     ========================================================= */

  function renderEstimatePage() {
    const estimates =
      getEstimateItems();

    return `
      <div class="ef-page">

        <div class="ef-page-head">

          <button
            type="button"
            class="ef-back-btn"
            id="routeBackBtn">
            ←
          </button>

          <div class="ef-page-brand">
            ${brandLogoHTML()}

            <div>
              <h2 class="ef-page-title">
                ${esc(
                  langText("estimate")
                )}
              </h2>

              <p class="ef-page-subtitle">
                ${esc(BRAND.name)}
              </p>
            </div>
          </div>

          <div></div>

        </div>

        <div class="ef-estimate-list">

          ${
            estimates.length
              ? estimates
                  .map(
                    renderEstimateCard
                  )
                  .join("")
              : `
                <div class="ef-setting-card">
                  ${esc(
                    langText(
                      "emptyEstimate"
                    )
                  )}
                </div>
              `
          }

        </div>

      </div>
    `;
  }

  function renderEstimateCard(
    entry,
    index
  ) {
    const values =
      Object.entries(
        entry.values || {}
      )
        .filter(
          ([, value]) =>
            safeText(value).trim()
        )
        .map(
          ([key, value]) =>
            `${tr(key)}: ${tr(value)}`
        )
        .join(" • ");

    return `
      <div
        class="ef-estimate-card"
        data-estimate-id="${esc(
          entry.id
        )}">

        <h3 class="ef-estimate-title">
          ${esc(tr(entry.name))}
        </h3>

        <div class="ef-estimate-meta">
          ${esc(
            tr(entry.stage)
          )}
          /
          ${esc(
            tr(entry.section)
          )}
          <br>

          ${esc(
            langText("quantity")
          )}:
          ${esc(entry.quantity)}

          ${
            entry.unit
              ? ` • ${esc(
                  langText("unit")
                )}: ${esc(
                  tr(entry.unit)
                )}`
              : ""
          }

          ${
            entry.brand
              ? ` • ${esc(
                  langText("brand")
                )}: ${esc(
                  tr(entry.brand)
                )}`
              : ""
          }

          ${
            values
              ? `<br>${esc(values)}`
              : ""
          }
        </div>

        <div class="ef-estimate-actions">

          <button
            type="button"
            class="ef-secondary-btn"
            data-edit-estimate="${esc(
              entry.id
            )}">
            ${esc(
              langText("edit")
            )}
          </button>

          <button
            type="button"
            class="ef-danger-btn"
            data-delete-estimate="${esc(
              entry.id
            )}">
            ${esc(
              langText("delete")
            )}
          </button>

        </div>

      </div>
    `;
  }

  function bindEstimatePage() {
    const back =
      $("#routeBackBtn");

    if (back) {
      back.onclick =
        goBackRoute;
    }

    $$("[data-edit-estimate]")
      .forEach((btn) => {
        btn.onclick = () => {
          const id =
            btn.dataset.editEstimate;

          const entry =
            getEstimateItems().find(
              (item) =>
                item.id === id
            );

          if (!entry) return;

          state.editingEstimateId =
            id;

          openItem(
            entry.stageIndex,
            entry.sectionIndex,
            entry.itemIndex,
            id
          );
        };
      });

    $$("[data-delete-estimate]")
      .forEach((btn) => {
        btn.onclick = () => {
          const id =
            btn.dataset.deleteEstimate;

          const items =
            getEstimateItems();

          const filtered =
            items.filter(
              (item) =>
                item.id !== id
            );

          saveEstimateItems(
            filtered
          );

          renderCurrentPage(false);
        };
      });
  }


  /* =========================================================
     CALCULATOR
     ========================================================= */

  function renderCalculatorPage() {
    return `
      <div class="ef-page">

        <div class="ef-page-head">

          <button
            type="button"
            class="ef-back-btn"
            id="routeBackBtn">
            ←
          </button>

          <div class="ef-page-brand">
            ${brandLogoHTML()}

            <div>
              <h2 class="ef-page-title">
                ${esc(
                  langText(
                    "calculatorTitle"
                  )
                )}
              </h2>

              <p class="ef-page-subtitle">
                ${esc(BRAND.name)}
              </p>
            </div>
          </div>

          <div></div>

        </div>

        <div class="ef-calc-card">

          <div class="ef-setting-title">
            P = V × I
          </div>

          <div class="ef-calc-grid">

            <input
              class="ef-input"
              id="calcV"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("voltage")
              )}">

            <input
              class="ef-input"
              id="calcI"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("current")
              )}">

          </div>

          <button
            type="button"
            class="ef-primary-btn"
            id="calcPowerBtn"
            style="width:100%;margin-top:8px;">
            P = V × I
          </button>

          <div
            class="ef-calc-result"
            id="calcPowerResult">
            —
          </div>

        </div>

        <div class="ef-calc-card">

          <div class="ef-setting-title">
            V = I × R
          </div>

          <div class="ef-calc-grid">

            <input
              class="ef-input"
              id="calcVCurrent"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("current")
              )}">

            <input
              class="ef-input"
              id="calcRVoltage"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("resistance")
              )}">

          </div>

          <button
            type="button"
            class="ef-primary-btn"
            id="calcVoltageBtn"
            style="width:100%;margin-top:8px;">
            V = I × R
          </button>

          <div
            class="ef-calc-result"
            id="calcVoltageResult">
            —
          </div>

        </div>

        <div class="ef-calc-card">

          <div class="ef-setting-title">
            I = V ÷ R
          </div>

          <div class="ef-calc-grid">

            <input
              class="ef-input"
              id="calcICVoltage"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("voltage")
              )}">

            <input
              class="ef-input"
              id="calcICResistance"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("resistance")
              )}">

          </div>

          <button
            type="button"
            class="ef-primary-btn"
            id="calcCurrentBtn"
            style="width:100%;margin-top:8px;">
            I = V ÷ R
          </button>

          <div
            class="ef-calc-result"
            id="calcCurrentResult">
            —
          </div>

        </div>

        <div class="ef-calc-card">

          <div class="ef-setting-title">
            R = V ÷ I
          </div>

          <div class="ef-calc-grid">

            <input
              class="ef-input"
              id="calcRVVoltage"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("voltage")
              )}">

            <input
              class="ef-input"
              id="calcRVCurrent"
              type="number"
              inputmode="decimal"
              placeholder="${esc(
                langText("current")
              )}">

          </div>

          <button
            type="button"
            class="ef-primary-btn"
            id="calcResistanceBtn"
            style="width:100%;margin-top:8px;">
            R = V ÷ I
          </button>

          <div
            class="ef-calc-result"
            id="calcResistanceResult">
            —
          </div>

        </div>

        <div class="ef-calc-card">

          <div class="ef-setting-title">
            ${esc(
              langText("inverter")
            )}
          </div>

          <div class="ef-setting-buttons">

            <button
              type="button"
              class="ef-setting-btn"
              data-inverter="12">
              12V → 230V
            </button>

            <button
              type="button"
              class="ef-setting-btn"
              data-inverter="24">
              24V → 230V
            </button>

          </div>

          <div
            class="ef-calc-result"
            id="inverterResult">
            —
          </div>

        </div>

      </div>
    `;
  }

  function safeDivide(
    a,
    b
  ) {
    if (
      !Number.isFinite(a) ||
      !Number.isFinite(b) ||
      b === 0
    ) {
      return null;
    }

    return a / b;
  }

  function bindCalculatorPage() {
    const back =
      $("#routeBackBtn");

    if (back) {
      back.onclick =
        goBackRoute;
    }

    const powerBtn =
      $("#calcPowerBtn");

    if (powerBtn) {
      powerBtn.onclick = () => {
        const v =
          Number($("#calcV")?.value);

        const i =
          Number($("#calcI")?.value);

        const result =
          Number.isFinite(v) &&
          Number.isFinite(i)
            ? v * i
            : null;

        $("#calcPowerResult").textContent =
          result == null
            ? "—"
            : `${result} W`;
      };
    }

    const voltageBtn =
      $("#calcVoltageBtn");

    if (voltageBtn) {
      voltageBtn.onclick = () => {
        const i =
          Number(
            $("#calcVCurrent")?.value
          );

        const r =
          Number(
            $("#calcRVoltage")?.value
          );

        const result =
          Number.isFinite(i) &&
          Number.isFinite(r)
            ? i * r
            : null;

        $("#calcVoltageResult").textContent =
          result == null
            ? "—"
            : `${result} V`;
      };
    }

    const currentBtn =
      $("#calcCurrentBtn");

    if (currentBtn) {
      currentBtn.onclick = () => {
        const v =
          Number(
            $("#calcICVoltage")?.value
          );

        const r =
          Number(
            $("#calcICResistance")?.value
          );

        const result =
          safeDivide(v, r);

        $("#calcCurrentResult").textContent =
          result == null
            ? "—"
            : `${result} A`;
      };
    }

    const resistanceBtn =
      $("#calcResistanceBtn");

    if (resistanceBtn) {
      resistanceBtn.onclick = () => {
        const v =
          Number(
            $("#calcRVVoltage")?.value
          );

        const i =
          Number(
            $("#calcRVCurrent")?.value
          );

        const result =
          safeDivide(v, i);

        $("#calcResistanceResult").textContent =
          result == null
            ? "—"
            : `${result} Ω`;
      };
    }

    $$("[data-inverter]")
      .forEach((btn) => {
        btn.onclick = () => {
          const value =
            btn.dataset.inverter;

          const result =
            $("#inverterResult");

          if (result) {
            result.textContent =
              `${value}V → 230V`;
          }
        };
      });
  }


  /* =========================================================
     SETTINGS
     ========================================================= */

  function renderSettingsPage() {
    return `
      <div class="ef-page">

        <div class="ef-page-head">

          <button
            type="button"
            class="ef-back-btn"
            id="routeBackBtn">
            ←
          </button>

          <div class="ef-page-brand">
            ${brandLogoHTML()}

            <div>
              <h2 class="ef-page-title">
                ${esc(
                  langText("settings")
                )}
              </h2>

              <p class="ef-page-subtitle">
                ${esc(BRAND.name)}
              </p>
            </div>
          </div>

          <div></div>

        </div>

        <div class="ef-setting-card">

          <h3 class="ef-setting-title">
            ${esc(
              langText("language")
            )}
          </h3>

          <div class="ef-setting-buttons">

            <button
              type="button"
              class="ef-setting-btn ${
                state.lang === "hi"
                  ? "active"
                  : ""
              }"
              data-settings-lang="hi">
              हिन्दी
            </button>

            <button
              type="button"
              class="ef-setting-btn ${
                state.lang === "en"
                  ? "active"
                  : ""
              }"
              data-settings-lang="en">
              English
            </button>

          </div>

        </div>

        <div class="ef-setting-card">

          <h3 class="ef-setting-title">
            ${esc(
              langText("theme")
            )}
          </h3>

          <div class="ef-setting-buttons">

            <button
              type="button"
              class="ef-setting-btn ${
                state.theme === "dark"
                  ? "active"
                  : ""
              }"
              data-settings-theme="dark">
              ${esc(
                langText("dark")
              )}
            </button>

            <button
              type="button"
              class="ef-setting-btn ${
                state.theme === "light"
                  ? "active"
                  : ""
              }"
              data-settings-theme="light">
              ${esc(
                langText("light")
              )}
            </button>

          </div>

        </div>

        <div class="ef-setting-card">

          <h3 class="ef-setting-title">
            ${esc(
              langText("stageView")
            )}
          </h3>

          <div class="ef-setting-buttons">

            ${VIEW_MODES.map(
              (mode) => `
                <button
                  type="button"
                  class="ef-setting-btn ${
                    state.stageView === mode
                      ? "active"
                      : ""
                  }"
                  data-stage-view="${mode}">
                  ${esc(
                    tr(
                      VIEW_LABELS[mode]
                    )
                  )}
                </button>
              `
            ).join("")}

          </div>

        </div>

        <div class="ef-setting-card">

          <h3 class="ef-setting-title">
            ${esc(
              langText("materialView")
            )}
          </h3>

          <div class="ef-setting-buttons">

            ${VIEW_MODES.map(
              (mode) => `
                <button
                  type="button"
                  class="ef-setting-btn ${
                    state.materialView ===
                    mode
                      ? "active"
                      : ""
                  }"
                  data-material-view="${mode}">
                  ${esc(
                    tr(
                      VIEW_LABELS[mode]
                    )
                  )}
                </button>
              `
            ).join("")}

          </div>

        </div>

        <div class="ef-setting-card">

          <button
            type="button"
            class="ef-danger-btn"
            id="settingsResetBtn"
            style="width:100%;">
            ${esc(
              langText("reset")
            )}
          </button>

        </div>

      </div>
    `;
  }

  function bindSettingsPage() {
    const back =
      $("#routeBackBtn");

    if (back) {
      back.onclick =
        goBackRoute;
    }

    $$("[data-settings-lang]")
      .forEach((btn) => {
        btn.onclick = () => {
          setLanguage(
            btn.dataset.settingsLang
          );
        };
      });

    $$("[data-settings-theme]")
      .forEach((btn) => {
        btn.onclick = () => {
          setTheme(
            btn.dataset.settingsTheme
          );
        };
      });

    $$("[data-stage-view]")
      .forEach((btn) => {
        btn.onclick = () => {
          state.stageView =
            validView(
              btn.dataset.stageView
            );

          storageSet(
            STORAGE.stageView,
            state.stageView
          );

          renderCurrentPage(false);
        };
      });

    $$("[data-material-view]")
      .forEach((btn) => {
        btn.onclick = () => {
          state.materialView =
            validView(
              btn.dataset.materialView
            );

          storageSet(
            STORAGE.materialView,
            state.materialView
          );

          renderCurrentPage(false);
        };
      });

    const reset =
      $("#settingsResetBtn");

    if (reset) {
      reset.onclick =
        resetApplication;
    }
  }


  /* =========================================================
     RESET
     ========================================================= */

  function resetApplication() {
    const confirmed =
      window.confirm(
        currentLang() === "hi"
          ? "एस्टिमेट और ऐप का सेव किया हुआ डेटा रीसेट करें?"
          : "Reset saved estimate and app data?"
      );

    if (!confirmed) {
      return;
    }

    if (state.drawerOpen) {
      prepareNavigationFromDrawer();
    }

    storageRemove(
      STORAGE.estimate
    );

    storageRemove(
      STORAGE.route
    );

    storageRemove(
      STORAGE.lastUnit
    );

    state.stageView = "grid";
    state.materialView = "grid";

    storageSet(
      STORAGE.stageView,
      "grid"
    );

    storageSet(
      STORAGE.materialView,
      "grid"
    );

    state.page = "home";
    state.stageIndex = -1;
    state.sectionIndex = -1;
    state.itemIndex = -1;
    state.editingEstimateId = null;
    state.draft = {};

    saveRoute();

    replaceHistory();

    showHome(false);

    buildDrawer();

    showToast(
      langText("resetDone")
    );
  }


  /* =========================================================
     CURRENT PAGE RENDER
     ========================================================= */

  function renderCurrentPage(
    scrollTop = true
  ) {
    if (state.page === "home") {
      showHome(false);
      return;
    }

    if (!homeEl) return;

    let html = "";

    switch (state.page) {
      case "stage":
        html = renderStagePage();
        break;

      case "section":
        html = renderSectionPage();
        break;

      case "item":
        html = renderItemPage();
        break;

      case "estimate":
        html = renderEstimatePage();
        break;

      case "calculator":
        html = renderCalculatorPage();
        break;

      case "settings":
        html = renderSettingsPage();
        break;

      default:
        state.page = "home";
        showHome(false);
        return;
    }

    homeEl.innerHTML = `
      <div id="efRoute">
        ${html}
      </div>
    `;

    homeIsStatic = false;

    if (state.page === "stage") {
      bindStagePage();
    }

    if (state.page === "section") {
      bindSectionPage();
    }

    if (state.page === "item") {
      bindItemEditor();
    }

    if (state.page === "estimate") {
      bindEstimatePage();
    }

    if (state.page === "calculator") {
      bindCalculatorPage();
    }

    if (state.page === "settings") {
      bindSettingsPage();
    }

    bindHamburger();
    bindBottomNav();
    updateStaticUI();
    applyBranding();

    if (scrollTop) {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }
  }


  /* =========================================================
     BACK NAVIGATION
     ========================================================= */

  function goBackRoute() {
    if (state.drawerOpen) {
      closeDrawer();
      return;
    }

    if (state.historyReady) {
      try {
        history.back();
        return;
      } catch {}
    }

    if (state.page === "item") {
      navigate(
        "section",
        state.stageIndex,
        state.sectionIndex,
        -1
      );
      return;
    }

    if (state.page === "section") {
      navigate(
        "stage",
        state.stageIndex,
        -1,
        -1
      );
      return;
    }

    showHome(false);
  }


  /* =========================================================
     BOTTOM NAV
     ========================================================= */

  function bindBottomNav() {
    $$(".bottom-item").forEach(
      (button) => {
        const nav =
          button.dataset.nav;

        if (!nav) return;

        button.onclick = () => {
          navigate(nav);
        };
      }
    );
  }


  /* =========================================================
     STATIC UI
     ========================================================= */

  function updateStaticUI() {
    const mappings = [
      [
        "[data-nav='home']",
        "home"
      ],
      [
        "[data-nav='estimate']",
        "estimate"
      ],
      [
        "[data-nav='calculator']",
        "calculator"
      ],
      [
        "[data-nav='settings']",
        "settings"
      ]
    ];

    mappings.forEach(
      ([selector, key]) => {
        $$(selector).forEach(
          (el) => {
            el.textContent =
              langText(key);
          }
        );
      }
    );

    const search =
      $("#searchInput") ||
      $("#mainSearch") ||
      $("#search");

    if (search) {
      search.placeholder =
        langText(
          "searchPlaceholder"
        );
    }

    const title =
      $("#appTitle");

    if (title) {
      title.textContent =
        currentLang() === "hi"
          ? "एस्टिमेट लिस्ट"
          : "Estimate List";
    }

    const subtitle =
      $("#appSubtitle");

    if (subtitle) {
      subtitle.textContent =
        BRAND.name;
    }

    const tagline =
      $("#appTagline");

    if (tagline) {
      tagline.textContent =
        currentLang() === "hi"
          ? BRAND.taglineHi
          : BRAND.taglineEn;
    }

    applyBranding();
  }


  /* =========================================================
     POPSTATE / ANDROID BACK
     ========================================================= */

  window.addEventListener(
    "popstate",
    (event) => {

      /*
       * Drawer history entry was popped.
       * Close drawer first.
       */
      if (
        state.drawerOpen &&
        state.drawerHistoryPushed
      ) {
        state.drawerOpen = false;
        state.drawerHistoryPushed = false;

        hideDrawerVisual();

        /*
         * If the state underneath is a
         * valid app route, restore it.
         */
        if (
          event.state &&
          event.state.efRoute
        ) {
          state.page =
            event.state.page || "home";

          state.stageIndex =
            Number.isInteger(
              event.state.stageIndex
            )
              ? event.state.stageIndex
              : -1;

          state.sectionIndex =
            Number.isInteger(
              event.state.sectionIndex
            )
              ? event.state.sectionIndex
              : -1;

          state.itemIndex =
            Number.isInteger(
              event.state.itemIndex
            )
              ? event.state.itemIndex
              : -1;

          saveRoute();

          renderCurrentPage(false);
        }

        return;
      }

      /*
       * Forward into drawer state.
       */
      if (
        event.state &&
        event.state.efDrawer
      ) {
        state.drawerOpen = true;
        state.drawerHistoryPushed = true;

        showDrawerVisual();

        return;
      }

      /*
       * Normal application route.
       */
      if (
        event.state &&
        event.state.efRoute
      ) {
        state.page =
          event.state.page || "home";

        state.stageIndex =
          Number.isInteger(
            event.state.stageIndex
          )
            ? event.state.stageIndex
            : -1;

        state.sectionIndex =
          Number.isInteger(
            event.state.sectionIndex
          )
            ? event.state.sectionIndex
            : -1;

        state.itemIndex =
          Number.isInteger(
            event.state.itemIndex
          )
            ? event.state.itemIndex
            : -1;

        validateSavedRoute();
        saveRoute();

        renderCurrentPage(false);

        return;
      }

      /*
       * No application history state.
       * This means the user is trying to leave
       * the application.
       */
      if (state.page !== "home") {
        state.page = "home";
        state.stageIndex = -1;
        state.sectionIndex = -1;
        state.itemIndex = -1;

        saveRoute();

        showHome(false);

        return;
      }

      const leave =
        window.confirm(
          currentLang() === "hi"
            ? "क्या आप ऐप से बाहर जाना चाहते हैं?"
            : "Do you want to exit the app?"
        );

      if (!leave) {
        replaceHistory();
      }
    }
  );


  /* =========================================================
     ESC KEY
     ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape"
      ) {
        if (state.drawerOpen) {
          closeDrawer();
          return;
        }

        $$(".ef-view-options")
          .forEach((el) =>
            el.setAttribute(
              "hidden",
              ""
            )
          );
      }
    }
  );


  /* =========================================================
     CLICK OUTSIDE VIEW OPTIONS
     ========================================================= */

  document.addEventListener(
    "click",
    (event) => {
      const target =
        event.target;

      if (
        target.closest &&
        target.closest(
          ".ef-view-picker"
        )
      ) {
        return;
      }

      $$(".ef-view-options")
        .forEach((options) => {
          options.setAttribute(
            "hidden",
            ""
          );
        });

      $$(".ef-view-trigger")
        .forEach((trigger) => {
          trigger.setAttribute(
            "aria-expanded",
            "false"
          );
        });
    }
  );


  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    injectDynamicCSS();

    applyTheme();

    ensureDrawer();

    bindHamburger();

    loadRoute();

    validateSavedRoute();

    /*
     * Build an internal history chain:
     *
     * Home
     *  ↓
     * Stage
     *  ↓
     * Section
     *  ↓
     * Item
     *
     * So Android/browser Back behaves correctly
     * even after refresh.
     */
    seedHistoryForSavedRoute();

    if (state.page === "home") {
      showHome(false);
    } else {
      renderCurrentPage(true);
    }

    buildDrawer();

    updateStaticUI();

    applyBranding();

    /*
     * If an existing HTML hamburger exists,
     * bind it again after all rendering.
     */
    bindHamburger();
  }


  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
