/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   Works with:
   index.html
   style.css
   config.js
   material.js
   ---------------------------------------------------------
   IMPORTANT:
   - material.js is NOT modified
   - Hindi mode  = Hindi / English
   - English mode = English only
   - Stage -> Section -> Material -> Editor
   - Drawer + Hamburger + Reset
   - Search + Filter
   - Stage View + Material View
   - Estimate
   - Calculator
   - Settings
   - Light / Dark
   - Refresh state
   - Android/browser Back
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     1. BASIC HELPERS
     ======================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const safeText = (value) =>
    value === undefined || value === null ? "" : String(value);

  const esc = (value) =>
    safeText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const clamp = (n, min, max) =>
    Math.min(Math.max(n, min), max);

  const storageGet = (key, fallback = null) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (_) {
      return fallback;
    }
  };

  const storageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  };

  const storageRemove = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  };

  const jsonGet = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  };

  const jsonSet = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  };

  /* =======================================================
     2. STORAGE
     ======================================================= */

  const STORAGE = {
    lang: "sandeepMaterialLang",
    theme: "sandeepTheme",
    estimate: "sandeepEstimateItems",
    route: "sandeepEstimateRoute",
    stageView: "sandeepStageView",
    materialView: "sandeepMaterialView",
    lastUnit: "sandeepLastUnit"
  };

  /* =======================================================
     3. LANGUAGE
     ======================================================= */

  const DICT = {

    /* ---------- STAGES ---------- */

    "Slab Conduit Installation":
      "स्लैब कंड्यूट इंस्टॉलेशन",

    "Wall Conduit Installation":
      "वॉल कंड्यूट इंस्टॉलेशन",

    "Wiring Installation":
      "वायरिंग इंस्टॉलेशन",

    "Final Electrical Fittings":
      "फाइनल इलेक्ट्रिकल फिटिंग्स",

    "False Ceiling Wiring Material":
      "फॉल्स सीलिंग वायरिंग मटेरियल",

    /* ---------- SECTIONS ---------- */

    "Conduit & Box":
      "कंड्यूट और बॉक्स",

    "Installation Material":
      "इंस्टॉलेशन मटेरियल",

    "Wiring Material":
      "वायरिंग मटेरियल",

    "Pulling Material":
      "पुलिंग मटेरियल",

    "Switch & Socket":
      "स्विच और सॉकेट",

    "MCB & Protection":
      "MCB और प्रोटेक्शन",

    "Fan & Ceiling":
      "फैन और सीलिंग",

    "Lighting":
      "लाइटिंग",

    "Installation & Finishing":
      "इंस्टॉलेशन और फिनिशिंग",

    "Wiring & Conduit":
      "वायरिंग और कंड्यूट",

    "Installation & Fastening":
      "इंस्टॉलेशन और फास्टनिंग",

    /* ---------- MATERIALS ---------- */

    "Pipe":
      "पाइप",

    "Bend":
      "बेंड",

    "Junction Box":
      "जंक्शन बॉक्स",

    "Fan Box":
      "फैन बॉक्स",

    "Concealed Light Box":
      "कंसील्ड लाइट बॉक्स",

    "Tape (Shuttering & Joint Sealing)":
      "टेप (शटरिंग और जॉइंट सीलिंग)",

    "Solvent Cement":
      "सॉल्वेंट सीमेंट",

    "Neel Powder (Marking Powder)":
      "नील पाउडर (मार्किंग पाउडर)",

    "Binding Wire":
      "बाइंडिंग वायर",

    "Cable Tie / Zip Tie":
      "केबल टाई / जिप टाई",

    "Modular Board (Concealed Metal/PVC Box)":
      "मॉड्यूलर बोर्ड (कंसील्ड मेटल/PVC बॉक्स)",

    "Tape (Masking & Plaster Protection)":
      "टेप (मास्किंग और प्लास्टर प्रोटेक्शन)",

    "Cable Clip":
      "केबल क्लिप",

    "Wire":
      "वायर",

    "Flexible Pipe":
      "फ्लेक्सिबल पाइप",

    "Electrical Tape":
      "इलेक्ट्रिकल टेप",

    "Fastener":
      "फास्टनर",

    "Steel Wire / Spring Wire (Fish Tape)":
      "स्टील वायर / स्प्रिंग वायर (फिश टेप)",

    "Switch Plate":
      "स्विच प्लेट",

    "Switch Board (Surface Gang Box)":
      "स्विच बोर्ड (सरफेस गैंग बॉक्स)",

    "Switch":
      "स्विच",

    "Socket":
      "सॉकेट",

    "Fan Regulator":
      "फैन रेगुलेटर",

    "2 Way Switch":
      "2 वे स्विच",

    "Bell Push":
      "बेल पुश",

    "Neon Indicator":
      "नियॉन इंडिकेटर",

    "Blank Plate / Dummy Switch":
      "ब्लैंक प्लेट / डमी स्विच",

    "DP Switch (Double Pole Switch)":
      "DP स्विच (डबल पोल स्विच)",

    "Mini MCB":
      "मिनी MCB",

    "SP MCB (Single Pole)":
      "SP MCB (सिंगल पोल)",

    "DP MCB (Double Pole)":
      "DP MCB (डबल पोल)",

    "TPN MCB (Three Pole with Neutral)":
      "TPN MCB (थ्री पोल विद न्यूट्रल)",

    "MCB Changeover":
      "MCB चेंजओवर",

    "DP Isolator":
      "DP आइसोलेटर",

    "TPN Isolator (3P / 4P)":
      "TPN आइसोलेटर (3P / 4P)",

    "RCCB / RCD":
      "RCCB / RCD",

    "MCB Box":
      "MCB बॉक्स",

    "Kit Kat Fuse":
      "किट कैट फ्यूज",

    "Fan Sheet":
      "फैन शीट",

    "Round Sheet":
      "राउंड शीट",

    "Fan Rod":
      "फैन रॉड",

    "Fan Clamp":
      "फैन क्लैम्प",

    "Holder":
      "होल्डर",

    "Ceiling Rose":
      "सीलिंग रोज",

    "Chain":
      "चेन",

    "LED Bulb":
      "LED बल्ब",

    "LED Tube Light":
      "LED ट्यूब लाइट",

    "Foot Light":
      "फुट लाइट",

    "Up Down Light":
      "अप डाउन लाइट",

    "Panel Light":
      "पैनल लाइट",

    "Surface Light":
      "सरफेस लाइट",

    "COB Light":
      "COB लाइट",

    "COB Spot Light":
      "COB स्पॉट लाइट",

    "Down Light":
      "डाउन लाइट",

    "Strip Light":
      "स्ट्रिप लाइट",

    "Rope Light":
      "रोप लाइट",

    "LED Profile Channel":
      "LED प्रोफाइल चैनल",

    "LED Strip Driver (SMPS)":
      "LED स्ट्रिप ड्राइवर (SMPS)",

    "Door Bell":
      "डोर बेल",

    "Tape (Mounting / Double Sided)":
      "टेप (माउंटिंग / डबल साइडेड)",

    "Instant Glue":
      "इंस्टेंट ग्लू",

    "Araldite Glue (Epoxy)":
      "अराल्डाइट ग्लू (एपॉक्सी)",

    "POP (Plaster of Paris)":
      "POP (प्लास्टर ऑफ पेरिस)",

    "Putty Blade / Patta":
      "पुट्टी ब्लेड / पट्टा",

    "Screw":
      "स्क्रू",

    "Lug (Cable Terminal Lug)":
      "लग (केबल टर्मिनल लग)",

    "Washer":
      "वॉशर",

    "Saddle (Pipe Clamp)":
      "सैडल (पाइप क्लैम्प)",

    "PVC Wall Plug / Gulli / Gitti":
      "PVC वॉल प्लग / गुल्ली / गिट्टी",

    /* ---------- FIELD LABELS ---------- */

    "Size":
      "साइज़",

    "Type":
      "टाइप",

    "Sub Type":
      "सब टाइप",

    "Colour":
      "रंग",

    "Color":
      "रंग",

    "Quantity":
      "मात्रा",

    "Unit":
      "यूनिट",

    "Brand":
      "ब्रांड",

    "Price":
      "कीमत",

    "Material":
      "मटेरियल",

    "Length":
      "लंबाई",

    "Width":
      "चौड़ाई",

    "Height":
      "ऊंचाई",

    /* ---------- COMMON OPTIONS ---------- */

    "Normal":
      "नॉर्मल",

    "Deep":
      "डीप",

    "Short":
      "शॉर्ट",

    "Long":
      "लॉन्ग",

    "PVC":
      "PVC",

    "GI":
      "GI",

    "Metal":
      "मेटल",

    "Modular":
      "मॉड्यूलर",

    "Surface":
      "सरफेस",

    "Concealed":
      "कंसील्ड",

    "Local":
      "लोकल",

    "Other":
      "अन्य",

    "Skip":
      "स्किप",

    "User Input":
      "यूज़र इनपुट",

    "pcs":
      "पीस",

    "pc":
      "पीस",

    "pkt":
      "पैकेट",

    "bndl":
      "बंडल",

    "doz":
      "दर्जन",

    "box":
      "बॉक्स",

    "meter":
      "मीटर",

    "m":
      "मीटर",

    "sqft":
      "वर्ग फुट",

    "point":
      "पॉइंट"
  };

  const UI = {

    hi: {
      home: "होम / Home",
      estimate: "एस्टिमेट / Estimate",
      calculator: "कैलकुलेटर / Calculator",
      settings: "सेटिंग्स / Settings",

      search: "सर्च करें / Search",
      filter: "फ़िल्टर / Filter",
      clear: "क्लियर / Clear",
      apply: "लागू करें / Apply",
      close: "बंद करें / Close",

      stages: "स्टेज / Stages",
      sections: "सेक्शन / Sections",
      materials: "मटेरियल / Materials",

      add: "जोड़ें / Add",
      update: "अपडेट करें / Update",
      next: "अगला / Next",
      back: "वापस / Back",
      previous: "पिछला / Previous",

      quantity: "मात्रा / Quantity",
      unit: "यूनिट / Unit",
      brand: "ब्रांड / Brand",

      noResults: "कोई परिणाम नहीं मिला / No results found",
      noMaterials: "कोई मटेरियल नहीं मिला / No materials found",
      noEstimate: "एस्टिमेट खाली है / Estimate is empty",

      added: "एस्टिमेट में जोड़ा गया / Added to estimate",
      updated: "एस्टिमेट अपडेट किया गया / Estimate updated",

      requiredQuantity:
        "कृपया मात्रा भरें / Please enter quantity",

      selectMaterial:
        "मटेरियल चुनें / Select material",

      reset:
        "ऐप रीसेट / Reset App",

      resetQuestion:
        "क्या आप ऐप का डेटा रीसेट करना चाहते हैं? / Do you want to reset app data?",

      resetDone:
        "ऐप रीसेट हो गया / App has been reset",

      language:
        "भाषा / Language",

      theme:
        "थीम / Theme",

      dark:
        "डार्क / Dark",

      light:
        "लाइट / Light",

      menu:
        "मेन्यू / Menu",

      stageView:
        "स्टेज व्यू / Stage View",

      materialView:
        "मटेरियल व्यू / Material View",

      grid:
        "ग्रिड / Grid",

      list:
        "लिस्ट / List",

      compact:
        "कॉम्पैक्ट / Compact",

      large:
        "बड़ा / Large",

      mini:
        "मिनी / Mini",

      twoColumn:
        "2 कॉलम / 2 Column",

      horizontal:
        "हॉरिज़ॉन्टल / Horizontal",

      iconList:
        "आइकन लिस्ट / Icon List",

      timeline:
        "टाइमलाइन / Timeline",

      dense:
        "डेंस / Dense",

      edit:
        "एडिट / Edit",

      delete:
        "डिलीट / Delete",

      remove:
        "हटाएं / Remove",

      save:
        "सेव / Save",

      total:
        "कुल / Total",

      calculatorTitle:
        "इलेक्ट्रिकल कैलकुलेटर / Electrical Calculator",

      power:
        "पावर / Power",

      voltage:
        "वोल्टेज / Voltage",

      current:
        "करंट / Current",

      resistance:
        "रेज़िस्टेंस / Resistance",

      calculate:
        "कैलकुलेट / Calculate",

      result:
        "परिणाम / Result",

      inverter:
        "इन्वर्टर / Inverter",

      inputVoltage:
        "इनपुट वोल्टेज / Input Voltage",

      outputVoltage:
        "आउटपुट वोल्टेज / Output Voltage",

      closeWarning:
        "ऐप बंद करें? / Close the app?"
    },

    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",

      search: "Search",
      filter: "Filter",
      clear: "Clear",
      apply: "Apply",
      close: "Close",

      stages: "Stages",
      sections: "Sections",
      materials: "Materials",

      add: "Add",
      update: "Update",
      next: "Next",
      back: "Back",
      previous: "Previous",

      quantity: "Quantity",
      unit: "Unit",
      brand: "Brand",

      noResults: "No results found",
      noMaterials: "No materials found",
      noEstimate: "Estimate is empty",

      added: "Added to estimate",
      updated: "Estimate updated",

      requiredQuantity:
        "Please enter quantity",

      selectMaterial:
        "Select material",

      reset:
        "Reset App",

      resetQuestion:
        "Do you want to reset app data?",

      resetDone:
        "App has been reset",

      language:
        "Language",

      theme:
        "Theme",

      dark:
        "Dark",

      light:
        "Light",

      menu:
        "Menu",

      stageView:
        "Stage View",

      materialView:
        "Material View",

      grid:
        "Grid",

      list:
        "List",

      compact:
        "Compact",

      large:
        "Large",

      mini:
        "Mini",

      twoColumn:
        "2 Column",

      horizontal:
        "Horizontal",

      iconList:
        "Icon List",

      timeline:
        "Timeline",

      dense:
        "Dense",

      edit:
        "Edit",

      delete:
        "Delete",

      remove:
        "Remove",

      save:
        "Save",

      total:
        "Total",

      calculatorTitle:
        "Electrical Calculator",

      power:
        "Power",

      voltage:
        "Voltage",

      current:
        "Current",

      resistance:
        "Resistance",

      calculate:
        "Calculate",

      result:
        "Result",

      inverter:
        "Inverter",

      inputVoltage:
        "Input Voltage",

      outputVoltage:
        "Output Voltage",

      closeWarning:
        "Close the app?"
    }
  };

  function langText(key) {
    return UI[state.lang]?.[key] || UI.en[key] || key;
  }

  function tr(value, forceEnglish = false) {
    const text = safeText(value);

    if (!text) return "";

    const hindi = DICT[text];

    if (state.lang === "en" || forceEnglish) {
      return text;
    }

    if (!hindi || hindi === text) {
      return text;
    }

    return `${hindi} / ${text}`;
  }

  /* =======================================================
     4. STATE
     ======================================================= */

  const savedLang =
    storageGet(STORAGE.lang, "hi");

  const savedTheme =
    storageGet(STORAGE.theme, "dark");

  const savedStageView =
    storageGet(STORAGE.stageView, "grid");

  const savedMaterialView =
    storageGet(STORAGE.materialView, "grid");

  const savedRoute =
    jsonGet(STORAGE.route, null);

  const state = {
    lang:
      savedLang === "en" ? "en" : "hi",

    theme:
      savedTheme === "light" ? "light" : "dark",

    page: savedRoute?.page || "home",

    stageIndex:
      Number.isInteger(savedRoute?.stageIndex)
        ? savedRoute.stageIndex
        : -1,

    sectionIndex:
      Number.isInteger(savedRoute?.sectionIndex)
        ? savedRoute.sectionIndex
        : -1,

    itemIndex:
      Number.isInteger(savedRoute?.itemIndex)
        ? savedRoute.itemIndex
        : -1,

    stageView:
      savedStageView || "grid",

    materialView:
      savedMaterialView || "grid",

    editingEstimateId: null,

    draft: {},

    drawerOpen: false,

    filterOpen: false,

    viewOpen: false,

    currentViewContext: "stage",

    historyReady: false
  };

  /* =======================================================
     5. MATERIAL PARSER
     ======================================================= */

  function normalizeItem(raw) {

    if (!Array.isArray(raw)) {
      return {
        name: safeText(raw),
        fields: [],
        units: [],
        brands: []
      };
    }

    return {
      name: safeText(raw[0]),

      fields:
        Array.isArray(raw[1])
          ? raw[1].map(field => {

              if (!Array.isArray(field)) {
                return {
                  label: safeText(field),
                  options: []
                };
              }

              return {
                label: safeText(field[0]),
                options:
                  Array.isArray(field[1])
                    ? field[1].map(safeText)
                    : []
              };
            })
          : [],

      units:
        Array.isArray(raw[2])
          ? raw[2].map(safeText)
          : [],

      brands:
        Array.isArray(raw[3])
          ? raw[3].map(safeText)
          : []
    };
  }

  function parseMaterials() {

    const raw =
      Array.isArray(window.MATERIALS)
        ? window.MATERIALS
        : [];

    return raw.map((stage, stageIndex) => {

      const sections = [];

      if (Array.isArray(stage[3])) {

        sections.push({
          name:
            safeText(stage[2]) ||
            `Section ${stageIndex + 1}`,

          items:
            stage[3].map(normalizeItem)
        });
      }

      for (let i = 4; i < stage.length; i++) {

        const group = stage[i];

        if (
          Array.isArray(group) &&
          typeof group[0] === "string" &&
          Array.isArray(group[1])
        ) {

          sections.push({
            name: group[0],

            items:
              group[1].map(normalizeItem)
          });
        }
      }

      return {
        id: safeText(stage[0]),
        title: safeText(stage[1]),
        mainSection: safeText(stage[2]),
        sections
      };
    });
  }

  const DATA = parseMaterials();

  /* =======================================================
     6. MATERIAL ACCESS
     ======================================================= */

  function getStage(stageIndex) {
    return DATA[stageIndex] || null;
  }

  function getSection(stageIndex, sectionIndex) {

    const stage = getStage(stageIndex);

    if (!stage) return null;

    return stage.sections[sectionIndex] || null;
  }

  function getItem(stageIndex, sectionIndex, itemIndex) {

    const section =
      getSection(stageIndex, sectionIndex);

    if (!section) return null;

    return section.items[itemIndex] || null;
  }

  function getAllItems() {

    const list = [];

    DATA.forEach((stage, stageIndex) => {

      stage.sections.forEach(
        (section, sectionIndex) => {

          section.items.forEach(
            (item, itemIndex) => {

              list.push({
                stageIndex,
                sectionIndex,
                itemIndex,

                stage,
                section,
                item
              });
            }
          );
        }
      );
    });

    return list;
  }

  const ALL_ITEMS = getAllItems();

  /* =======================================================
     7. DYNAMIC CSS
     ======================================================= */

  function injectDynamicCSS() {

    if ($("#electrofixAppDynamicCSS")) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "electrofixAppDynamicCSS";

    style.textContent = `

      #efRoute {
        width:100%;
        max-width:1100px;
        margin:0 auto;
        padding:12px;
        box-sizing:border-box;
      }

      .ef-page-head {
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
        flex-wrap:wrap;
        text-align:center;
        margin:10px 0 18px;
      }

      .ef-page-head h2,
      .ef-page-head h3 {
        margin:0;
      }

      .ef-back-btn {
        border:1px solid rgba(14,165,233,.5);
        background:#07182e;
        color:#38bdf8;
        border-radius:12px;
        padding:9px 14px;
        cursor:pointer;
        font-weight:700;
      }

      .ef-count {
        opacity:.75;
        font-size:.88rem;
      }

      .ef-section-card,
      .ef-material-card,
      .ef-estimate-card,
      .ef-setting-card,
      .ef-calc-card {
        background:#07182e;
        border:1px solid rgba(14,165,233,.28);
        border-radius:16px;
        padding:15px;
        margin:10px 0;
        box-sizing:border-box;
      }

      body.light-mode .ef-section-card,
      body.light-mode .ef-material-card,
      body.light-mode .ef-estimate-card,
      body.light-mode .ef-setting-card,
      body.light-mode .ef-calc-card {
        background:#fff;
        color:#111827;
      }

      .ef-section-grid,
      .ef-material-grid,
      .ef-estimate-grid,
      .ef-settings-grid,
      .ef-calc-grid {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:12px;
      }

      .ef-card-button {
        width:100%;
        text-align:center;
        cursor:pointer;
        transition:.2s ease;
      }

      .ef-card-button:active {
        transform:scale(.98);
      }

      .ef-section-card h3,
      .ef-material-card h3,
      .ef-estimate-card h3,
      .ef-setting-card h3,
      .ef-calc-card h3 {
        margin:0 0 7px;
      }

      .ef-material-card {
        min-height:85px;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .ef-material-card h3 {
        font-size:1rem;
      }

      .ef-item-editor {
        max-width:680px;
        margin:0 auto;
      }

      .ef-field {
        margin:13px 0;
        text-align:center;
      }

      .ef-field-label {
        display:block;
        margin-bottom:7px;
        font-weight:800;
      }

      .ef-field-row {
        display:flex;
        align-items:center;
        gap:6px;
      }

      .ef-field-row select,
      .ef-field-row input,
      .ef-field > input {
        width:100%;
        min-height:44px;
        box-sizing:border-box;
        border-radius:11px;
        border:1px solid rgba(14,165,233,.35);
        background:#030b18;
        color:inherit;
        padding:9px 11px;
        outline:none;
      }

      body.light-mode .ef-field-row select,
      body.light-mode .ef-field-row input,
      body.light-mode .ef-field > input {
        background:#fff;
        color:#111827;
      }

      .ef-clear-field {
        width:36px;
        min-width:36px;
        height:36px;
        border:0;
        border-radius:50%;
        cursor:pointer;
        background:rgba(239,68,68,.12);
        color:#ef4444;
        font-weight:900;
      }

      .ef-qty {
        display:flex;
        justify-content:center;
        align-items:center;
        gap:8px;
      }

      .ef-qty button {
        width:42px;
        height:42px;
        border:1px solid rgba(14,165,233,.4);
        border-radius:10px;
        background:#07182e;
        color:#38bdf8;
        font-size:20px;
        font-weight:900;
        cursor:pointer;
      }

      .ef-qty input {
        max-width:120px;
        text-align:center;
      }

      .ef-actions {
        display:flex;
        justify-content:center;
        gap:9px;
        flex-wrap:wrap;
        margin-top:18px;
      }

      .ef-btn {
        border:0;
        border-radius:12px;
        padding:11px 17px;
        cursor:pointer;
        font-weight:800;
        background:#0ea5e9;
        color:#fff;
      }

      .ef-btn.secondary {
        background:#172554;
      }

      .ef-btn.danger {
        background:#991b1b;
      }

      .ef-empty {
        text-align:center;
        opacity:.7;
        padding:35px 15px;
      }

      .ef-breadcrumb {
        text-align:center;
        opacity:.72;
        font-size:.84rem;
        margin-bottom:10px;
      }

      .ef-estimate-meta {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:6px;
        font-size:.9rem;
        opacity:.9;
      }

      .ef-setting-row {
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        flex-wrap:wrap;
      }

      .ef-language-btn,
      .ef-theme-btn {
        border:1px solid rgba(14,165,233,.35);
        background:#07182e;
        color:inherit;
        border-radius:11px;
        padding:10px 14px;
        cursor:pointer;
      }

      .ef-language-btn.active,
      .ef-theme-btn.active {
        border-color:#facc15;
        box-shadow:0 0 12px rgba(250,204,21,.22);
      }

      .ef-view-options {
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:7px;
        margin:10px 0;
      }

      .ef-view-options button {
        border:1px solid rgba(14,165,233,.3);
        background:#07182e;
        color:inherit;
        border-radius:9px;
        padding:8px 10px;
        cursor:pointer;
      }

      .ef-view-options button.active {
        border-color:#facc15;
        color:#facc15;
      }

      .ef-grid-list {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:10px;
      }

      .ef-grid-list.view-list,
      .ef-grid-list.view-horizontal,
      .ef-grid-list.view-dense {
        grid-template-columns:1fr;
      }

      .ef-grid-list.view-mini .ef-material-card {
        min-height:50px;
        padding:9px;
      }

      .ef-grid-list.view-large {
        grid-template-columns:1fr;
      }

      .ef-grid-list.view-large .ef-material-card {
        min-height:110px;
      }

      .ef-grid-list.view-two-column {
        grid-template-columns:repeat(2,minmax(0,1fr));
      }

      .ef-grid-list.view-compact {
        gap:5px;
      }

      .ef-grid-list.view-compact .ef-material-card {
        padding:9px;
        min-height:60px;
      }

      .ef-grid-list.view-timeline {
        grid-template-columns:1fr;
      }

      .ef-grid-list.view-timeline .ef-material-card {
        border-left:4px solid #0ea5e9;
        border-radius:5px 15px 15px 5px;
      }

      .ef-grid-list.view-icon-list {
        grid-template-columns:1fr;
      }

      .ef-search-summary {
        text-align:center;
        margin:10px 0;
        opacity:.8;
      }

      .ef-calc-form {
        max-width:600px;
        margin:auto;
      }

      .ef-result {
        text-align:center;
        margin-top:12px;
        font-weight:900;
        color:#38bdf8;
      }

      @media(max-width:360px) {
        .ef-section-grid,
        .ef-material-grid,
        .ef-estimate-grid,
        .ef-settings-grid,
        .ef-calc-grid {
          grid-template-columns:1fr;
        }

        .ef-grid-list,
        .ef-grid-list.view-two-column {
          grid-template-columns:1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =======================================================
     8. HOME MARKUP BACKUP
     ======================================================= */

  const homeEl = $("#home");

  let homeMarkup =
    homeEl ? homeEl.innerHTML : "";

  let homeIsStatic = true;

  /* =======================================================
     9. TOAST
     ======================================================= */

  function showToast(message) {

    let toast = $("#toast");

    if (!toast) {

      toast =
        document.createElement("div");

      toast.id = "toast";

      toast.style.cssText = `
        position:fixed;
        left:50%;
        bottom:82px;
        transform:translateX(-50%);
        z-index:99999;
        max-width:90%;
        padding:10px 15px;
        border-radius:12px;
        background:#07182e;
        color:#fff;
        border:1px solid rgba(56,189,248,.5);
        box-shadow:0 0 18px rgba(14,165,233,.25);
        text-align:center;
        pointer-events:none;
        opacity:0;
        transition:.2s;
      `;

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(toast._timer);

    toast._timer =
      setTimeout(() => {
        toast.style.opacity = "0";
      }, 1700);
  }

  /* =======================================================
     10. THEME
     ======================================================= */

  function applyTheme() {

    document.body.classList.toggle(
      "light-mode",
      state.theme === "light"
    );

    document.documentElement.dataset.theme =
      state.theme;

    storageSet(
      STORAGE.theme,
      state.theme
    );

    const icon = $("#themeIcon");
    const title = $("#themeTitle");
    const stateEl = $("#themeState");

    if (icon) {
      icon.textContent =
        state.theme === "dark" ? "🌙" : "☀️";
    }

    if (title) {
      title.textContent =
        state.theme === "dark"
          ? langText("dark")
          : langText("light");
    }

    if (stateEl) {
      stateEl.textContent =
        state.theme === "dark"
          ? langText("dark")
          : langText("light");
    }
  }

  function toggleTheme() {

    state.theme =
      state.theme === "dark"
        ? "light"
        : "dark";

    applyTheme();

    refreshVisibleLanguage();
  }

  /* =======================================================
     11. LANGUAGE
     ======================================================= */

  function setLanguage(lang) {

    state.lang =
      lang === "en" ? "en" : "hi";

    storageSet(
      STORAGE.lang,
      state.lang
    );

    updateLanguageButtons();

    applyTheme();

    refreshVisibleLanguage();

    if (!homeIsStatic) {
      renderCurrentPage(false);
    }
  }

  function updateLanguageButtons() {

    const hi = $("#langHi");
    const en = $("#langEn");

    if (hi) {
      hi.classList.toggle(
        "active",
        state.lang === "hi"
      );

      hi.setAttribute(
        "aria-pressed",
        state.lang === "hi" ? "true" : "false"
      );
    }

    if (en) {
      en.classList.toggle(
        "active",
        state.lang === "en"
      );

      en.setAttribute(
        "aria-pressed",
        state.lang === "en" ? "true" : "false"
      );
    }
  }

  function refreshVisibleLanguage() {

    updateLanguageButtons();

    applyTheme();

    const dynamicLabels =
      $$("[data-i18n]");

    dynamicLabels.forEach(el => {

      const key =
        el.dataset.i18n;

      if (key) {
        el.textContent =
          langText(key);
      }
    });

    const translatable =
      $$("[data-tr]");

    translatable.forEach(el => {

      const value =
        el.dataset.tr;

      if (value) {
        el.textContent =
          tr(value);
      }
    });

    if (homeIsStatic) {
      bindHome();
      updateHomeStageText();
    }
  }

  /* =======================================================
     12. DRAWER
     ======================================================= */

  function ensureDrawer() {

    let drawer = $("#drawer");

    let overlay =
      $("#drawerOverlay");

    if (!overlay) {

      overlay =
        document.createElement("div");

      overlay.id =
        "drawerOverlay";

      overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        z-index:9990;
        display:none;
      `;

      document.body.appendChild(overlay);
    }

    if (!drawer) {

      drawer =
        document.createElement("aside");

      drawer.id = "drawer";

      drawer.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        bottom:0;
        width:min(310px,88vw);
        z-index:9995;
        padding:18px 14px;
        box-sizing:border-box;
        background:#050816;
        color:#fff;
        border-right:1px solid rgba(14,165,233,.35);
        transform:translateX(-105%);
        transition:.25s ease;
        overflow-y:auto;
      `;

      document.body.appendChild(drawer);
    }

    buildDrawer();

    overlay.onclick = closeDrawer;
  }

  function buildDrawer() {

    const drawer =
      $("#drawer");

    if (!drawer) return;

    drawer.innerHTML = `

      <div style="
        text-align:center;
        padding:10px 5px 18px;
        border-bottom:1px solid rgba(14,165,233,.22);
      ">
        <div style="
          font-size:1.15rem;
          font-weight:900;
          color:#38bdf8;
        ">
          Sandeep ElectroFix
        </div>

        <div style="
          font-size:.78rem;
          opacity:.7;
          margin-top:4px;
        ">
          Estimate List
        </div>
      </div>

      <div style="padding-top:12px;">

        ${drawerButton(
          "home",
          "🏠",
          langText("home")
        )}

        ${drawerButton(
          "estimate",
          "🧾",
          langText("estimate")
        )}

        ${drawerButton(
          "calculator",
          "🧮",
          langText("calculator")
        )}

        ${drawerButton(
          "settings",
          "⚙️",
          langText("settings")
        )}

      </div>

      <div style="
        margin-top:16px;
        padding-top:15px;
        border-top:1px solid rgba(14,165,233,.2);
      ">

        <div style="
          text-align:center;
          font-weight:800;
          margin-bottom:9px;
        ">
          ${langText("language")}
        </div>

        <div style="
          display:flex;
          gap:8px;
        ">

          <button
            id="drawerHi"
            type="button"
            class="ef-language-btn ${state.lang === "hi" ? "active" : ""}"
            style="flex:1"
          >
            हिन्दी
          </button>

          <button
            id="drawerEn"
            type="button"
            class="ef-language-btn ${state.lang === "en" ? "active" : ""}"
            style="flex:1"
          >
            English
          </button>

        </div>

      </div>

      <div style="
        margin-top:16px;
        padding-top:15px;
        border-top:1px solid rgba(14,165,233,.2);
      ">

        <div style="
          text-align:center;
          font-weight:800;
          margin-bottom:9px;
        ">
          ${langText("theme")}
        </div>

        <button
          id="drawerTheme"
          type="button"
          class="ef-theme-btn"
          style="width:100%"
        >
          ${state.theme === "dark" ? "🌙" : "☀️"}
          ${state.theme === "dark"
            ? langText("dark")
            : langText("light")}
        </button>

      </div>

      <div style="
        margin-top:16px;
        padding-top:15px;
        border-top:1px solid rgba(14,165,233,.2);
      ">

        <button
          id="drawerReset"
          type="button"
          class="ef-btn danger"
          style="width:100%"
        >
          ♻️ ${langText("reset")}
        </button>

      </div>
    `;

    $$(".drawer-item", drawer)
      .forEach(button => {

        button.onclick = () => {

          const page =
            button.dataset.page;

          closeDrawer();

          navigate(page);
        };
      });

    const dhi =
      $("#drawerHi");

    const den =
      $("#drawerEn");

    if (dhi) {
      dhi.onclick = () => {
        setLanguage("hi");
        buildDrawer();
      };
    }

    if (den) {
      den.onclick = () => {
        setLanguage("en");
        buildDrawer();
      };
    }

    const dt =
      $("#drawerTheme");

    if (dt) {
      dt.onclick = () => {
        toggleTheme();
        buildDrawer();
      };
    }

    const reset =
      $("#drawerReset");

    if (reset) {
      reset.onclick =
        resetApplication;
    }
  }

  function drawerButton(page, icon, label) {

    return `
      <button
        type="button"
        class="drawer-item"
        data-page="${esc(page)}"
        style="
          display:flex;
          align-items:center;
          gap:12px;
          width:100%;
          border:0;
          background:transparent;
          color:inherit;
          padding:13px 10px;
          border-radius:12px;
          cursor:pointer;
          text-align:left;
          font-weight:800;
          margin-bottom:4px;
        "
      >
        <span style="
          width:30px;
          text-align:center;
          font-size:1.1rem;
        ">${icon}</span>

        <span>${esc(label)}</span>
      </button>
    `;
  }

  function openDrawer() {

    ensureDrawer();

    const drawer =
      $("#drawer");

    const overlay =
      $("#drawerOverlay");

    if (!drawer) return;

    state.drawerOpen = true;

    drawer.style.transform =
      "translateX(0)";

    if (overlay) {
      overlay.style.display =
        "block";
    }

    const menu =
      $("#menuBtn");

    if (menu) {
      menu.classList.add("active");
      menu.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  }

  function closeDrawer() {

    const drawer =
      $("#drawer");

    const overlay =
      $("#drawerOverlay");

    state.drawerOpen = false;

    if (drawer) {
      drawer.style.transform =
        "translateX(-105%)";
    }

    if (overlay) {
      overlay.style.display =
        "none";
    }

    const menu =
      $("#menuBtn");

    if (menu) {
      menu.classList.remove("active");
      menu.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }

  function toggleDrawer() {

    if (state.drawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  /* =======================================================
     13. RESET APP
     ======================================================= */

  function resetApplication() {

    const ok =
      window.confirm(
        langText("resetQuestion")
      );

    if (!ok) return;

    storageRemove(STORAGE.estimate);
    storageRemove(STORAGE.route);
    storageRemove(STORAGE.lastUnit);

    state.editingEstimateId = null;
    state.draft = {};
    state.page = "home";
    state.stageIndex = -1;
    state.sectionIndex = -1;
    state.itemIndex = -1;

    closeDrawer();

    showHome(false);

    showToast(
      langText("resetDone")
    );
  }

  /* =======================================================
     14. HAMBURGER
     ======================================================= */

  function bindHamburger() {

    const button =
      $("#menuBtn");

    if (!button) return;

    button.onclick = (event) => {

      event.preventDefault();
      event.stopPropagation();

      toggleDrawer();
    };

    button.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  /* =======================================================
     15. HOME STAGES
     ======================================================= */

  function updateHomeStageText() {

    const cards =
      $$(".stage-card");

    cards.forEach(card => {

      const index =
        Number(
          card.dataset.stageIndex ??
          Number(card.dataset.stage || 1) - 1
        );

      const stage =
        getStage(index);

      if (!stage) return;

      const title =
        $(".stage-title", card);

      if (title) {
        title.textContent =
          tr(stage.title);
      }

      const count =
        $(".stage-count", card);

      if (count) {

        const countValue =
          stage.sections.reduce(
            (total, section) =>
              total + section.items.length,
            0
          );

        count.textContent =
          state.lang === "hi"
            ? `${countValue} मटेरियल / ${countValue} Materials`
            : `${countValue} Materials`;
      }
    });
  }

  function renderHomeStages() {

    const grid =
      $("#stageGrid");

    if (!grid) return;

    grid.innerHTML = "";

    DATA.forEach(
      (stage, stageIndex) => {

        const count =
          stage.sections.reduce(
            (total, section) =>
              total + section.items.length,
            0
          );

        const card =
          document.createElement("div");

        card.className =
          "stage-card";

        card.dataset.stage =
          String(stageIndex + 1);

        card.dataset.stageIndex =
          String(stageIndex);

        card.dataset.search =
          stage.title.toLowerCase();

        card.innerHTML = `

          <div class="stage-title">
            ${esc(tr(stage.title))}
          </div>

          <div class="stage-count">
            ${state.lang === "hi"
              ? `${count} मटेरियल / ${count} Materials`
              : `${count} Materials`}
          </div>
        `;

        card.addEventListener(
          "click",
          () => openStage(stageIndex)
        );

        grid.appendChild(card);
      }
    );
  }

  /* =======================================================
     16. HOME SEARCH
     ======================================================= */

  function getSearchText(record) {

    const stage =
      record.stage;

    const section =
      record.section;

    const item =
      record.item;

    const values = [
      stage.title,
      stage.mainSection,
      section.name,
      item.name
    ];

    item.fields.forEach(field => {

      values.push(field.label);

      field.options.forEach(
        option => values.push(option)
      );
    });

    item.units.forEach(
      unit => values.push(unit)
    );

    item.brands.forEach(
      brand => values.push(brand)
    );

    return values
      .join(" ")
      .toLowerCase();
  }

  function populateFilters() {

    const stageSelect =
      $("#stageFilter");

    const typeSelect =
      $("#typeFilter");

    const sizeSelect =
      $("#sizeFilter");

    const brandSelect =
      $("#brandFilter");

    if (stageSelect) {

      const current =
        stageSelect.value;

      stageSelect.innerHTML = `
        <option value="">${esc(langText("stages"))}</option>
      `;

      DATA.forEach(
        (stage, index) => {

          const option =
            document.createElement("option");

          option.value =
            String(index);

          option.textContent =
            tr(stage.title);

          stageSelect.appendChild(option);
        }
      );

      stageSelect.value =
        current;
    }

    const types =
      new Set();

    const sizes =
      new Set();

    const brands =
      new Set();

    ALL_ITEMS.forEach(
      record => {

        record.item.fields.forEach(
          field => {

            if (
              /type/i.test(field.label)
            ) {
              field.options.forEach(
                value => types.add(value)
              );
            }

            if (
              /size/i.test(field.label)
            ) {
              field.options.forEach(
                value => sizes.add(value)
              );
            }
          }
        );

        record.item.brands.forEach(
          brand => brands.add(brand)
        );
      }
    );

    function fillSelect(
      select,
      values,
      placeholder
    ) {

      if (!select) return;

      const current =
        select.value;

      select.innerHTML = `
        <option value="">${esc(placeholder)}</option>
      `;

      [...values]
        .sort((a,b) =>
          a.localeCompare(b)
        )
        .forEach(value => {

          const option =
            document.createElement("option");

          option.value =
            value;

          option.textContent =
            tr(value);

          select.appendChild(option);
        });

      select.value =
        current;
    }

    fillSelect(
      typeSelect,
      types,
      state.lang === "hi"
        ? "टाइप / Type"
        : "Type"
    );

    fillSelect(
      sizeSelect,
      sizes,
      state.lang === "hi"
        ? "साइज़ / Size"
        : "Size"
    );

    fillSelect(
      brandSelect,
      brands,
      state.lang === "hi"
        ? "ब्रांड / Brand"
        : "Brand"
    );
  }

  function matchesFilters(record) {

    const searchInput =
      $("#main");

    const query =
      safeText(
        searchInput?.value
      )
        .trim()
        .toLowerCase();

    if (query) {

      const haystack =
        getSearchText(record);

      if (!haystack.includes(query)) {

        const translated =
          [
            tr(record.stage.title),
            tr(record.section.name),
            tr(record.item.name)
          ]
            .join(" ")
            .toLowerCase();

        if (!translated.includes(query)) {
          return false;
        }
      }
    }

    const stageFilter =
      $("#stageFilter")?.value || "";

    if (
      stageFilter !== "" &&
      Number(stageFilter) !== record.stageIndex
    ) {
      return false;
    }

    const typeFilter =
      $("#typeFilter")?.value || "";

    if (typeFilter) {

      const has =
        record.item.fields.some(
          field =>
            /type/i.test(field.label) &&
            field.options.includes(typeFilter)
        );

      if (!has) return false;
    }

    const sizeFilter =
      $("#sizeFilter")?.value || "";

    if (sizeFilter) {

      const has =
        record.item.fields.some(
          field =>
            /size/i.test(field.label) &&
            field.options.includes(sizeFilter)
        );

      if (!has) return false;
    }

    const brandFilter =
      $("#brandFilter")?.value || "";

    if (brandFilter) {

      if (
        !record.item.brands.includes(
          brandFilter
        )
      ) {
        return false;
      }
    }

    return true;
  }

  function runHomeSearch() {

    const grid =
      $("#stageGrid");

    if (!grid) return;

    const cards =
      $$(".stage-card", grid);

    const matchedStages =
      new Set();

    let resultCount = 0;

    ALL_ITEMS.forEach(record => {

      if (matchesFilters(record)) {

        matchedStages.add(
          record.stageIndex
        );

        resultCount++;
      }
    });

    const hasAnyFilter =
      safeText($("#main")?.value).trim() ||
      $("#stageFilter")?.value ||
      $("#typeFilter")?.value ||
      $("#sizeFilter")?.value ||
      $("#brandFilter")?.value;

    if (!hasAnyFilter) {

      cards.forEach(
        card =>
          card.style.display = ""
      );

      resultCount =
        ALL_ITEMS.length;

    } else {

      cards.forEach(card => {

        const index =
          Number(card.dataset.stageIndex);

        card.style.display =
          matchedStages.has(index)
            ? ""
            : "none";
      });
    }

    const info =
      $("#resultsInfo");

    if (info) {

      info.textContent =
        state.lang === "hi"
          ? `${resultCount} परिणाम / ${resultCount} Results`
          : `${resultCount} Results`;
    }

    const noResults =
      $("#noResults");

    if (noResults) {

      noResults.style.display =
        hasAnyFilter && resultCount === 0
          ? ""
          : "none";

      if (resultCount === 0) {
        noResults.textContent =
          langText("noResults");
      }
    }
  }

  function clearFilters() {

    [
      "#main",
      "#stageFilter",
      "#typeFilter",
      "#sizeFilter",
      "#brandFilter"
    ].forEach(selector => {

      const el = $(selector);

      if (el) {
        el.value = "";
      }
    });

    runHomeSearch();
  }

  function bindHomeSearch() {

    const input =
      $("#main");

    if (input) {

      input.oninput =
        runHomeSearch;
    }

    [
      "#stageFilter",
      "#typeFilter",
      "#sizeFilter",
      "#brandFilter"
    ].forEach(selector => {

      const el = $(selector);

      if (el) {
        el.onchange =
          runHomeSearch;
      }
    });

    const filterButton =
      $("#filter-icon");

    const filterPanel =
      $("#filterPanel");

    if (filterButton) {

      filterButton.onclick =
        event => {

          event.preventDefault();

          state.filterOpen =
            !state.filterOpen;

          if (filterPanel) {

            filterPanel.style.display =
              state.filterOpen
                ? ""
                : "none";
          }
        };
    }

    const clear =
      $("#clearFilter");

    if (clear) {
      clear.onclick =
        clearFilters;
    }
  }

  /* =======================================================
     17. VIEW SELECTOR
     ======================================================= */

  const VIEW_NAMES = {
    grid: "grid",
    list: "list",
    compact: "compact",
    large: "large",
    mini: "mini",
    "two-column": "twoColumn",
    horizontal: "horizontal",
    "icon-list": "iconList",
    timeline: "timeline",
    dense: "dense"
  };

  function viewLabel(view) {

    const key =
      VIEW_NAMES[view];

    return key
      ? langText(key)
      : view;
  }

  function bindViewSelector() {

    const trigger =
      $("#viewTrigger");

    const options =
      $("#viewOptions");

    if (!trigger || !options) {
      return;
    }

    trigger.onclick = event => {

      event.preventDefault();

      state.viewOpen =
        !state.viewOpen;

      options.style.display =
        state.viewOpen
          ? ""
          : "none";
    };

    $$(".view-option", options)
      .forEach(button => {

        button.onclick = () => {

          const view =
            button.dataset.view ||
            "grid";

          if (
            state.currentViewContext ===
            "material"
          ) {

            state.materialView =
              view;

            storageSet(
              STORAGE.materialView,
              view
            );

            applyMaterialView();

          } else {

            state.stageView =
              view;

            storageSet(
              STORAGE.stageView,
              view
            );

            applyStageView();
          }

          state.viewOpen =
            false;

          options.style.display =
            "none";

          updateViewOptionLabels();
        };
      });

    updateViewOptionLabels();
  }

  function updateViewOptionLabels() {

    $$(".view-option")
      .forEach(button => {

        const view =
          button.dataset.view ||
          "grid";

        const label =
          $(".view-option-label", button);

        if (label) {
          label.textContent =
            viewLabel(view);
        }
      });
  }

  function applyStageView() {

    const grid =
      $("#stageGrid");

    if (!grid) return;

    grid.dataset.view =
      state.stageView;

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
  }

  function applyMaterialView() {

    const grid =
      $("#materialGrid");

    if (!grid) return;

    grid.className =
      grid.className
        .replace(
          /view-[a-z-]+/g,
          ""
        );

    grid.classList.add(
      "ef-grid-list",
      `view-${state.materialView}`
    );
  }

  /* =======================================================
     18. HOME BINDING
     ======================================================= */

  function bindHome() {

    if (!homeIsStatic) return;

    bindHamburger();

    renderHomeStages();

    populateFilters();

    bindHomeSearch();

    bindViewSelector();

    applyStageView();

    updateHomeStageText();

    const themeButton =
      $("#themeButton");

    if (themeButton) {
      themeButton.onclick =
        toggleTheme;
    }

    const hi =
      $("#langHi");

    if (hi) {
      hi.onclick =
        () => setLanguage("hi");
    }

    const en =
      $("#langEn");

    if (en) {
      en.onclick =
        () => setLanguage("en");
    }

    updateLanguageButtons();

    runHomeSearch();
  }

  /* =======================================================
     19. ROUTE STORAGE
     ======================================================= */

  function saveRoute() {

    jsonSet(
      STORAGE.route,
      {
        page: state.page,
        stageIndex: state.stageIndex,
        sectionIndex: state.sectionIndex,
        itemIndex: state.itemIndex
      }
    );
  }

  /* =======================================================
     20. HISTORY
     ======================================================= */

  function pushHistory() {

    try {

      history.pushState(
        {
          efRoute: true,
          page: state.page,
          stageIndex: state.stageIndex,
          sectionIndex: state.sectionIndex,
          itemIndex: state.itemIndex
        },
        "",
        location.href
      );

    } catch (_) {}
  }

  function replaceHistory() {

    try {

      history.replaceState(
        {
          efRoute: true,
          page: state.page,
          stageIndex: state.stageIndex,
          sectionIndex: state.sectionIndex,
          itemIndex: state.itemIndex
        },
        "",
        location.href
      );

    } catch (_) {}
  }

  /* =======================================================
     21. PAGE NAVIGATION
     ======================================================= */

  function navigate(
    page,
    stageIndex = -1,
    sectionIndex = -1,
    itemIndex = -1,
    options = {}
  ) {

    state.page =
      page;

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      sectionIndex;

    state.itemIndex =
      itemIndex;

    if (page !== "item") {
      state.draft = {};
      state.editingEstimateId = null;
    }

    saveRoute();

    if (options.push !== false) {
      pushHistory();
    }

    if (page === "home") {
      showHome(false);
    } else {
      showRoute(false);
    }

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }

  function showHome(push = true) {

    if (!homeEl) return;

    homeIsStatic = true;

    homeEl.innerHTML =
      homeMarkup;

    if (push) {
      state.page = "home";
      state.stageIndex = -1;
      state.sectionIndex = -1;
      state.itemIndex = -1;
      saveRoute();
      pushHistory();
    }

    bindHome();
  }

  function showRoute(push = false) {

    if (!homeEl) return;

    homeIsStatic = false;

    homeEl.innerHTML =
      `<div id="efRoute"></div>`;

    if (push) {
      saveRoute();
      pushHistory();
    }

    renderCurrentPage(false);
  }

  /* =======================================================
     22. STAGE PAGE
     ======================================================= */

  function openStage(stageIndex) {

    const stage =
      getStage(stageIndex);

    if (!stage) return;

    state.currentViewContext =
      "material";

    navigate(
      "stage",
      stageIndex,
      -1,
      -1
    );
  }

  function renderStagePage() {

    const route =
      $("#efRoute");

    const stage =
      getStage(state.stageIndex);

    if (!route || !stage) {

      navigate("home", -1, -1, -1, {
        push: false
      });

      return;
    }

    state.currentViewContext =
      "material";

    route.innerHTML = `

      <div class="ef-page-head">

        <button
          class="ef-back-btn"
          id="routeBack"
          type="button"
        >
          ← ${esc(langText("back"))}
        </button>

        <div>

          <h2>
            ${esc(tr(stage.title))}
          </h2>

          <div class="ef-count">
            ${esc(tr(stage.mainSection))}
          </div>

        </div>

      </div>

      <div class="ef-breadcrumb">
        ${esc(langText("stages"))}
        →
        ${esc(tr(stage.title))}
      </div>

      <div class="ef-view-options">

        ${renderViewButtons(
          state.materialView
        )}

      </div>

      <div
        id="materialGrid"
        class="ef-grid-list view-${esc(state.materialView)}"
      >

        ${renderStageMaterials(stage)}

      </div>
    `;

    const back =
      $("#routeBack");

    if (back) {
      back.onclick =
        () => goBackRoute();
    }

    bindRouteViewButtons();

    applyMaterialView();

    bindMaterialCards();

    updateViewOptionLabels();
  }

  function renderStageMaterials(stage) {

    const items = [];

    stage.sections.forEach(
      (section, sectionIndex) => {

        items.push(`
          <div
            class="ef-section-card"
            style="
              grid-column:1/-1;
              text-align:center;
              margin-top:6px;
            "
          >
            <h3>
              ${esc(tr(section.name))}
            </h3>

            <div class="ef-count">
              ${section.items.length}
              ${state.lang === "hi"
                ? "मटेरियल / Materials"
                : "Materials"}
            </div>
          </div>
        `);

        section.items.forEach(
          (item, itemIndex) => {

            items.push(`
              <button
                type="button"
                class="ef-material-card ef-card-button"
                data-stage-index="${stage === getStage(state.stageIndex)
                  ? state.stageIndex
                  : ""}"
                data-section-index="${sectionIndex}"
                data-item-index="${itemIndex}"
              >
                <h3>
                  ${esc(tr(item.name))}
                </h3>
              </button>
            `);
          }
        );
      }
    );

    return items.join("");
  }

  function bindMaterialCards() {

    $$(".ef-material-card")
      .forEach(card => {

        card.onclick = () => {

          const stageIndex =
            Number(
              card.dataset.stageIndex
            );

          const sectionIndex =
            Number(
              card.dataset.sectionIndex
            );

          const itemIndex =
            Number(
              card.dataset.itemIndex
            );

          openItem(
            stageIndex,
            sectionIndex,
            itemIndex
          );
        };
      });
  }

  /* =======================================================
     23. VIEW BUTTONS FOR ROUTE
     ======================================================= */

  function renderViewButtons(active) {

    const views = [
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

    return views.map(view => `

      <button
        type="button"
        class="${view === active ? "active" : ""}"
        data-route-view="${esc(view)}"
      >
        ${esc(viewLabel(view))}
      </button>

    `).join("");
  }

  function bindRouteViewButtons() {

    $$(".ef-view-options [data-route-view]")
      .forEach(button => {

        button.onclick = () => {

          const view =
            button.dataset.routeView;

          state.materialView =
            view;

          storageSet(
            STORAGE.materialView,
            view
          );

          renderStagePage();
        };
      });
  }

  /* =======================================================
     24. ITEM OPEN
     ======================================================= */

  function openItem(
    stageIndex,
    sectionIndex,
    itemIndex,
    options = {}
  ) {

    const item =
      getItem(
        stageIndex,
        sectionIndex,
        itemIndex
      );

    if (!item) return;

    state.currentViewContext =
      "material";

    state.draft = {};

    navigate(
      "item",
      stageIndex,
      sectionIndex,
      itemIndex,
      {
        push:
          options.push !== false
      }
    );
  }

  /* =======================================================
     25. ITEM EDITOR
     ======================================================= */

  function renderItemPage() {

    const route =
      $("#efRoute");

    const stage =
      getStage(state.stageIndex);

    const section =
      getSection(
        state.stageIndex,
        state.sectionIndex
      );

    const item =
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    if (
      !route ||
      !stage ||
      !section ||
      !item
    ) {

      navigate(
        "home",
        -1,
        -1,
        -1,
        { push:false }
      );

      return;
    }

    const estimate =
      getEstimateForCurrentItem();

    const values =
      estimate?.values ||
      state.draft ||
      {};

    let html = `

      <div class="ef-page-head">

        <button
          class="ef-back-btn"
          id="itemBack"
          type="button"
        >
          ← ${esc(langText("back"))}
        </button>

        <div>

          <h2>
            ${esc(tr(item.name))}
          </h2>

          <div class="ef-count">
            ${esc(tr(section.name))}
          </div>

        </div>

      </div>

      <div class="ef-breadcrumb">
        ${esc(tr(stage.title))}
        →
        ${esc(tr(section.name))}
        →
        ${esc(tr(item.name))}
      </div>

      <div class="ef-item-editor">

        ${renderFields(
          item,
          values
        )}

        ${renderQuantity(
          values.quantity
        )}

        ${renderUnit(
          item,
          values.unit
        )}

        ${renderBrand(
          item,
          values.brand
        )}

        <div class="ef-actions">

          <button
            type="button"
            class="ef-btn"
            id="saveItem"
          >
            ${esc(
              estimate
                ? langText("update")
                : langText("add")
            )}
          </button>

          <button
            type="button"
            class="ef-btn secondary"
            id="nextItem"
          >
            ${esc(langText("next"))} →
          </button>

        </div>

      </div>
    `;

    route.innerHTML =
      html;

    bindItemEditor(
      item,
      estimate
    );
  }

  function renderFields(item, values) {

    if (!item.fields.length) {
      return "";
    }

    return item.fields
      .map(
        (field, fieldIndex) => {

          const key =
            `field_${fieldIndex}`;

          const current =
            values[key] || "";

          return `

            <div
              class="ef-field"
              data-field-index="${fieldIndex}"
            >

              <label class="ef-field-label">
                ${esc(tr(field.label))}
              </label>

              <div class="ef-field-row">

                <select
                  data-field-key="${esc(key)}"
                >

                  <option value="">
                    ${state.lang === "hi"
                      ? `चुनें / Select ${esc(field.label)}`
                      : `Select ${esc(field.label)}`}
                  </option>

                  ${
                    field.options
                      .map(option => `
                        <option
                          value="${esc(option)}"
                          ${current === option ? "selected" : ""}
                        >
                          ${esc(tr(option))}
                        </option>
                      `)
                      .join("")
                  }

                </select>

                <button
                  type="button"
                  class="ef-clear-field"
                  data-clear-key="${esc(key)}"
                  title="${esc(langText("clear"))}"
                >
                  ×
                </button>

              </div>

            </div>
          `;
        }
      )
      .join("");
  }

  function renderQuantity(quantity) {

    let value =
      quantity === undefined ||
      quantity === null ||
      quantity === ""
        ? 1
        : Number(quantity);

    if (!Number.isFinite(value) || value < 0) {
      value = 1;
    }

    return `

      <div class="ef-field">

        <label class="ef-field-label">
          ${esc(langText("quantity"))}
        </label>

        <div class="ef-qty">

          <button
            type="button"
            id="qtyMinus"
          >
            −
          </button>

          <input
            id="quantityInput"
            type="number"
            min="0"
            step="1"
            value="${esc(value)}"
          />

          <button
            type="button"
            id="qtyPlus"
          >
            +
          </button>

          <button
            type="button"
            class="ef-clear-field"
            id="qtyClear"
          >
            ×
          </button>

        </div>

      </div>
    `;
  }

  function renderUnit(item, currentUnit) {

    const units =
      item.units.length
        ? item.units
        : ["pcs"];

    const storedUnit =
      currentUnit ||
      storageGet(
        STORAGE.lastUnit,
        ""
      );

    return `

      <div class="ef-field">

        <label class="ef-field-label">
          ${esc(langText("unit"))}
        </label>

        <div class="ef-field-row">

          <select id="unitInput">

            <option value="">
              ${state.lang === "hi"
                ? "चुनें / Select Unit"
                : "Select Unit"}
            </option>

            ${
              units.map(unit => `
                <option
                  value="${esc(unit)}"
                  ${storedUnit === unit ? "selected" : ""}
                >
                  ${esc(tr(unit))}
                </option>
              `).join("")
            }

          </select>

          <button
            type="button"
            class="ef-clear-field"
            id="unitClear"
          >
            ×
          </button>

        </div>

      </div>
    `;
  }

  function renderBrand(item, currentBrand) {

    if (!item.brands.length) {
      return "";
    }

    return `

      <div class="ef-field">

        <label class="ef-field-label">
          ${esc(langText("brand"))}
        </label>

        <div class="ef-field-row">

          <select id="brandInput">

            <option value="">
              ${state.lang === "hi"
                ? "चुनें / Select Brand"
                : "Select Brand"}
            </option>

            ${
              item.brands.map(brand => `
                <option
                  value="${esc(brand)}"
                  ${currentBrand === brand ? "selected" : ""}
                >
                  ${esc(brand)}
                </option>
              `).join("")
            }

          </select>

          <button
            type="button"
            class="ef-clear-field"
            id="brandClear"
          >
            ×
          </button>

        </div>

      </div>
    `;
  }

  /* =======================================================
     26. ITEM DRAFT
     ======================================================= */

  function collectItemValues() {

    const values = {};

    $$("[data-field-key]")
      .forEach(select => {

        values[
          select.dataset.fieldKey
        ] = select.value;
      });

    const quantity =
      $("#quantityInput");

    values.quantity =
      quantity
        ? quantity.value
        : "";

    const unit =
      $("#unitInput");

    values.unit =
      unit
        ? unit.value
        : "";

    const brand =
      $("#brandInput");

    values.brand =
      brand
        ? brand.value
        : "";

    return values;
  }

  function bindItemEditor(
    item,
    existingEstimate
  ) {

    const back =
      $("#itemBack");

    if (back) {
      back.onclick =
        () => goBackRoute();
    }

    $$("[data-field-key]")
      .forEach(select => {

        select.onchange =
          () => {

            state.draft =
              collectItemValues();
          };
      });

    $$("[data-clear-key]")
      .forEach(button => {

        button.onclick =
          () => {

            const key =
              button.dataset.clearKey;

            const select =
              document.querySelector(
                `[data-field-key="${CSS.escape(key)}"]`
              );

            if (select) {
              select.value = "";
            }

            state.draft =
              collectItemValues();
          };
      });

    const qty =
      $("#quantityInput");

    const minus =
      $("#qtyMinus");

    const plus =
      $("#qtyPlus");

    const clear =
      $("#qtyClear");

    function updateQty(value) {

      let n =
        Number(value);

      if (!Number.isFinite(n)) {
        n = 0;
      }

      n =
        Math.max(
          0,
          Math.floor(n)
        );

      if (qty) {
        qty.value = String(n);
      }

      state.draft =
        collectItemValues();
    }

    if (minus) {

      minus.onclick =
        () => {

          updateQty(
            Number(qty?.value || 0) - 1
          );
        };
    }

    if (plus) {

      plus.onclick =
        () => {

          updateQty(
            Number(qty?.value || 0) + 1
          );
        };
    }

    if (qty) {
      qty.oninput =
        () => updateQty(qty.value);
    }

    if (clear) {
      clear.onclick =
        () => updateQty(0);
    }

    const unit =
      $("#unitInput");

    if (unit) {

      unit.onchange =
        () => {

          if (unit.value) {

            storageSet(
              STORAGE.lastUnit,
              unit.value
            );
          }

          state.draft =
            collectItemValues();
        };
    }

    const unitClear =
      $("#unitClear");

    if (unitClear) {

      unitClear.onclick =
        () => {

          if (unit) {
            unit.value = "";
          }

          state.draft =
            collectItemValues();
        };
    }

    const brand =
      $("#brandInput");

    if (brand) {

      brand.onchange =
        () => {

          state.draft =
            collectItemValues();
        };
    }

    const brandClear =
      $("#brandClear");

    if (brandClear) {

      brandClear.onclick =
        () => {

          if (brand) {
            brand.value = "";
          }

          state.draft =
            collectItemValues();
        };
    }

    const save =
      $("#saveItem");

    if (save) {

      save.onclick =
        () => {

          const values =
            collectItemValues();

          const quantity =
            Number(values.quantity);

          if (
            !Number.isFinite(quantity) ||
            quantity <= 0
          ) {

            showToast(
              langText("requiredQuantity")
            );

            return;
          }

          saveEstimateItem(
            values,
            existingEstimate
          );
        };
    }

    const next =
      $("#nextItem");

    if (next) {

      next.onclick =
        () => {

          state.draft =
            collectItemValues();

          openNextItem();
        };
    }
  }

  /* =======================================================
     27. ESTIMATE STORAGE
     ======================================================= */

  function getEstimates() {

    const data =
      jsonGet(
        STORAGE.estimate,
        []
      );

    return Array.isArray(data)
      ? data
      : [];
  }

  function setEstimates(items) {
    jsonSet(
      STORAGE.estimate,
      items
    );
  }

  function makeId() {

    return (
      "EF-" +
      Date.now().toString(36) +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }

  function getEstimateForCurrentItem() {

    const list =
      getEstimates();

    return list.find(
      entry =>
        entry.stageIndex ===
          state.stageIndex &&
        entry.sectionIndex ===
          state.sectionIndex &&
        entry.itemIndex ===
          state.itemIndex
    ) || null;
  }

  function saveEstimateItem(
    values,
    existingEstimate
  ) {

    const stage =
      getStage(state.stageIndex);

    const section =
      getSection(
        state.stageIndex,
        state.sectionIndex
      );

    const item =
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    if (!stage || !section || !item) {
      return;
    }

    const list =
      getEstimates();

    const entry = {

      id:
        existingEstimate?.id ||
        makeId(),

      stageIndex:
        state.stageIndex,

      sectionIndex:
        state.sectionIndex,

      itemIndex:
        state.itemIndex,

      stageId:
        stage.id,

      stageTitle:
        stage.title,

      sectionName:
        section.name,

      materialName:
        item.name,

      values: {
        ...values
      },

      quantity:
        Number(values.quantity),

      unit:
        values.unit || "",

      brand:
        values.brand || "",

      price: ""
    };

    const existingIndex =
      list.findIndex(
        e =>
          e.id === entry.id
      );

    if (existingIndex >= 0) {

      list[existingIndex] =
        entry;

      showToast(
        langText("updated")
      );

    } else {

      list.push(entry);

      showToast(
        langText("added")
      );
    }

    setEstimates(list);

    storageSet(
      STORAGE.lastUnit,
      values.unit || ""
    );

    state.draft = {};

    setTimeout(
      openNextItem,
      250
    );
  }

  /* =======================================================
     28. NEXT ITEM
     ======================================================= */

  function getNextPosition(
    stageIndex,
    sectionIndex,
    itemIndex
  ) {

    const stage =
      getStage(stageIndex);

    if (!stage) {
      return null;
    }

    if (
      itemIndex + 1 <
      stage.sections[sectionIndex].items.length
    ) {

      return {
        stageIndex,
        sectionIndex,
        itemIndex:
          itemIndex + 1
      };
    }

    if (
      sectionIndex + 1 <
      stage.sections.length
    ) {

      return {
        stageIndex,
        sectionIndex:
          sectionIndex + 1,
        itemIndex: 0
      };
    }

    if (
      stageIndex + 1 <
      DATA.length
    ) {

      return {
        stageIndex:
          stageIndex + 1,
        sectionIndex: 0,
        itemIndex: 0
      };
    }

    return null;
  }

  function openNextItem() {

    const next =
      getNextPosition(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    if (!next) {

      navigate(
        "estimate",
        -1,
        -1,
        -1
      );

      return;
    }

    openItem(
      next.stageIndex,
      next.sectionIndex,
      next.itemIndex
    );
  }

  /* =======================================================
     29. ESTIMATE PAGE
     ======================================================= */

  function renderEstimatePage() {

    const route =
      $("#efRoute");

    if (!route) return;

    const list =
      getEstimates();

    route.innerHTML = `

      <div class="ef-page-head">

        <button
          type="button"
          class="ef-back-btn"
          id="estimateBack"
        >
          ← ${esc(langText("back"))}
        </button>

        <h2>
          ${esc(langText("estimate"))}
        </h2>

      </div>

      ${
        list.length
          ? `
            <div class="ef-estimate-grid">
              ${list.map(
                entry =>
                  renderEstimateCard(entry)
              ).join("")}
            </div>
          `
          : `
            <div class="ef-empty">
              ${esc(langText("noEstimate"))}
            </div>
          `
      }
    `;

    const back =
      $("#estimateBack");

    if (back) {
      back.onclick =
        () => navigate("home");
    }

    $$(".ef-estimate-edit")
      .forEach(button => {

        button.onclick =
          () => {

            const id =
              button.dataset.id;

            const entry =
              getEstimates()
                .find(e => e.id === id);

            if (!entry) return;

            state.editingEstimateId =
              id;

            openItem(
              entry.stageIndex,
              entry.sectionIndex,
              entry.itemIndex
            );
          };
      });

    $$(".ef-estimate-delete")
      .forEach(button => {

        button.onclick =
          () => {

            const id =
              button.dataset.id;

            const updated =
              getEstimates()
                .filter(e => e.id !== id);

            setEstimates(updated);

            renderEstimatePage();
          };
      });
  }

  function renderEstimateCard(entry) {

    return `

      <div class="ef-estimate-card">

        <h3>
          ${esc(tr(entry.materialName))}
        </h3>

        <div class="ef-estimate-meta">

          <div>
            ${esc(tr(entry.stageTitle))}
          </div>

          <div>
            ${esc(tr(entry.sectionName))}
          </div>

          <div>
            ${esc(langText("quantity"))}:
            ${esc(entry.quantity)}
          </div>

          <div>
            ${esc(langText("unit"))}:
            ${esc(
              entry.unit
                ? tr(entry.unit)
                : "-"
            )}
          </div>

          <div>
            ${esc(langText("brand"))}:
            ${esc(
              entry.brand
                ? entry.brand
                : "-"
            )}
          </div>

        </div>

        <div class="ef-actions">

          <button
            type="button"
            class="ef-btn ef-estimate-edit"
            data-id="${esc(entry.id)}"
          >
            ✏️ ${esc(langText("edit"))}
          </button>

          <button
            type="button"
            class="ef-btn danger ef-estimate-delete"
            data-id="${esc(entry.id)}"
          >
            🗑️ ${esc(langText("delete"))}
          </button>

        </div>

      </div>
    `;
  }

  /* =======================================================
     30. CALCULATOR
     ======================================================= */

  function renderCalculatorPage() {

    const route =
      $("#efRoute");

    if (!route) return;

    route.innerHTML = `

      <div class="ef-page-head">

        <button
          type="button"
          class="ef-back-btn"
          id="calculatorBack"
        >
          ← ${esc(langText("back"))}
        </button>

        <h2>
          ${esc(langText("calculatorTitle"))}
        </h2>

      </div>

      <div class="ef-calc-grid">

        <div class="ef-calc-card">
          <h3>P = V × I</h3>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("voltage"))} (V)
            </label>

            <input
              id="calcV1"
              type="number"
              step="any"
            />
          </div>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("current"))} (A)
            </label>

            <input
              id="calcI1"
              type="number"
              step="any"
            />
          </div>

          <button
            class="ef-btn"
            id="calcP"
            type="button"
          >
            ${esc(langText("calculate"))}
          </button>

          <div
            class="ef-result"
            id="resultP"
          ></div>
        </div>

        <div class="ef-calc-card">
          <h3>V = I × R</h3>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("current"))} (A)
            </label>

            <input
              id="calcI2"
              type="number"
              step="any"
            />
          </div>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("resistance"))} (Ω)
            </label>

            <input
              id="calcR2"
              type="number"
              step="any"
            />
          </div>

          <button
            class="ef-btn"
            id="calcV"
            type="button"
          >
            ${esc(langText("calculate"))}
          </button>

          <div
            class="ef-result"
            id="resultV"
          ></div>
        </div>

        <div class="ef-calc-card">
          <h3>I = V ÷ R</h3>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("voltage"))} (V)
            </label>

            <input
              id="calcV3"
              type="number"
              step="any"
            />
          </div>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("resistance"))} (Ω)
            </label>

            <input
              id="calcR3"
              type="number"
              step="any"
            />
          </div>

          <button
            class="ef-btn"
            id="calcI"
            type="button"
          >
            ${esc(langText("calculate"))}
          </button>

          <div
            class="ef-result"
            id="resultI"
          ></div>
        </div>

        <div class="ef-calc-card">
          <h3>R = V ÷ I</h3>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("voltage"))} (V)
            </label>

            <input
              id="calcV4"
              type="number"
              step="any"
            />
          </div>

          <div class="ef-field">
            <label class="ef-field-label">
              ${esc(langText("current"))} (A)
            </label>

            <input
              id="calcI4"
              type="number"
              step="any"
            />
          </div>

          <button
            class="ef-btn"
            id="calcR"
            type="button"
          >
            ${esc(langText("calculate"))}
          </button>

          <div
            class="ef-result"
            id="resultR"
          ></div>
        </div>

        <div class="ef-calc-card">

          <h3>
            ${esc(langText("inverter"))}
          </h3>

          <div class="ef-field">

            <label class="ef-field-label">
              ${esc(langText("inputVoltage"))}
            </label>

            <select id="inverterInput">
              <option value="12">
                12V
              </option>

              <option value="24">
                24V
              </option>
            </select>

          </div>

          <div class="ef-field">

            <label class="ef-field-label">
              ${esc(langText("outputVoltage"))}
            </label>

            <input
              id="inverterOutput"
              value="230"
              type="number"
              step="any"
            />

          </div>

          <button
            class="ef-btn"
            id="calcInverter"
            type="button"
          >
            ${esc(langText("calculate"))}
          </button>

          <div
            class="ef-result"
            id="resultInverter"
          ></div>

        </div>

      </div>
    `;

    $("#calculatorBack")?.addEventListener(
      "click",
      () => navigate("home")
    );

    $("#calcP")?.addEventListener(
      "click",
      () => {

        const v =
          Number($("#calcV1")?.value);

        const i =
          Number($("#calcI1")?.value);

        $("#resultP").textContent =
          Number.isFinite(v) &&
          Number.isFinite(i)
            ? `P = ${(v * i).toFixed(2)} W`
            : "";
      }
    );

    $("#calcV")?.addEventListener(
      "click",
      () => {

        const i =
          Number($("#calcI2")?.value);

        const r =
          Number($("#calcR2")?.value);

        $("#resultV").textContent =
          Number.isFinite(i) &&
          Number.isFinite(r)
            ? `V = ${(i * r).toFixed(2)} V`
            : "";
      }
    );

    $("#calcI")?.addEventListener(
      "click",
      () => {

        const v =
          Number($("#calcV3")?.value);

        const r =
          Number($("#calcR3")?.value);

        $("#resultI").textContent =
          Number.isFinite(v) &&
          Number.isFinite(r) &&
          r !== 0
            ? `I = ${(v / r).toFixed(2)} A`
            : "";
      }
    );

    $("#calcR")?.addEventListener(
      "click",
      () => {

        const v =
          Number($("#calcV4")?.value);

        const i =
          Number($("#calcI4")?.value);

        $("#resultR").textContent =
          Number.isFinite(v) &&
          Number.isFinite(i) &&
          i !== 0
            ? `R = ${(v / i).toFixed(2)} Ω`
            : "";
      }
    );

    $("#calcInverter")
      ?.addEventListener(
        "click",
        () => {

          const input =
            Number(
              $("#inverterInput")?.value
            );

          const output =
            Number(
              $("#inverterOutput")?.value
            );

          $("#resultInverter")
            .textContent =
              Number.isFinite(input) &&
              Number.isFinite(output)
                ? `${input}V → ${output}V`
                : "";
        }
      );
  }

  /* =======================================================
     31. SETTINGS
     ======================================================= */

  function renderSettingsPage() {

    const route =
      $("#efRoute");

    if (!route) return;

    route.innerHTML = `

      <div class="ef-page-head">

        <button
          type="button"
          class="ef-back-btn"
          id="settingsBack"
        >
          ← ${esc(langText("back"))}
        </button>

        <h2>
          ${esc(langText("settings"))}
        </h2>

      </div>

      <div class="ef-settings-grid">

        <div class="ef-setting-card">

          <h3>
            ${esc(langText("language"))}
          </h3>

          <div class="ef-setting-row">

            <button
              type="button"
              id="settingsHi"
              class="ef-language-btn ${
                state.lang === "hi"
                  ? "active"
                  : ""
              }"
            >
              हिन्दी
            </button>

            <button
              type="button"
              id="settingsEn"
              class="ef-language-btn ${
                state.lang === "en"
                  ? "active"
                  : ""
              }"
            >
              English
            </button>

          </div>

        </div>

        <div class="ef-setting-card">

          <h3>
            ${esc(langText("theme"))}
          </h3>

          <div class="ef-setting-row">

            <button
              type="button"
              id="settingsTheme"
              class="ef-theme-btn"
            >
              ${
                state.theme === "dark"
                  ? "🌙 " + esc(langText("dark"))
                  : "☀️ " + esc(langText("light"))
              }
            </button>

          </div>

        </div>

        <div class="ef-setting-card">

          <h3>
            ${esc(langText("stageView"))}
          </h3>

          <div class="ef-view-options">
            ${renderSettingsViewButtons(
              "stage",
              state.stageView
            )}
          </div>

        </div>

        <div class="ef-setting-card">

          <h3>
            ${esc(langText("materialView"))}
          </h3>

          <div class="ef-view-options">
            ${renderSettingsViewButtons(
              "material",
              state.materialView
            )}
          </div>

        </div>

        <div class="ef-setting-card">

          <h3>
            ${esc(langText("reset"))}
          </h3>

          <div class="ef-setting-row">

            <button
              type="button"
              id="settingsReset"
              class="ef-btn danger"
            >
              ♻️ ${esc(langText("reset"))}
            </button>

          </div>

        </div>

      </div>
    `;

    $("#settingsBack")?.addEventListener(
      "click",
      () => navigate("home")
    );

    $("#settingsHi")?.addEventListener(
      "click",
      () => {
        setLanguage("hi");
        renderSettingsPage();
      }
    );

    $("#settingsEn")?.addEventListener(
      "click",
      () => {
        setLanguage("en");
        renderSettingsPage();
      }
    );

    $("#settingsTheme")?.addEventListener(
      "click",
      () => {
        toggleTheme();
        renderSettingsPage();
      }
    );

    $("#settingsReset")?.addEventListener(
      "click",
      resetApplication
    );

    $$(".settings-view")
      .forEach(button => {

        button.onclick = () => {

          const context =
            button.dataset.context;

          const view =
            button.dataset.view;

          if (context === "stage") {

            state.stageView =
              view;

            storageSet(
              STORAGE.stageView,
              view
            );

          } else {

            state.materialView =
              view;

            storageSet(
              STORAGE.materialView,
              view
            );
          }

          renderSettingsPage();
        };
      });
  }

  function renderSettingsViewButtons(
    context,
    active
  ) {

    const views = [
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

    return views.map(
      view => `

        <button
          type="button"
          class="
            settings-view
            ${view === active ? "active" : ""}
          "
          data-context="${esc(context)}"
          data-view="${esc(view)}"
        >
          ${esc(viewLabel(view))}
        </button>

      `
    ).join("");
  }

  /* =======================================================
     32. CURRENT PAGE RENDER
     ======================================================= */

  function renderCurrentPage(
    push = false
  ) {

    if (state.page === "home") {

      showHome(push);
      return;
    }

    if (homeIsStatic) {
      showRoute(push);
      return;
    }

    if (state.page === "stage") {

      renderStagePage();
      return;
    }

    if (state.page === "item") {

      renderItemPage();
      return;
    }

    if (state.page === "estimate") {

      renderEstimatePage();
      return;
    }

    if (state.page === "calculator") {

      renderCalculatorPage();
      return;
    }

    if (state.page === "settings") {

      renderSettingsPage();
      return;
    }

    showHome(false);
  }

  /* =======================================================
     33. BACK ROUTE
     ======================================================= */

  function goBackRoute() {

    if (state.page === "item") {

      navigate(
        "stage",
        state.stageIndex,
        -1,
        -1
      );

      return;
    }

    if (state.page === "stage") {

      navigate(
        "home",
        -1,
        -1,
        -1
      );

      return;
    }

    navigate(
      "home",
      -1,
      -1,
      -1
    );
  }

  /* =======================================================
     34. POPSTATE
     ======================================================= */

  window.addEventListener(
    "popstate",
    event => {

      if (state.drawerOpen) {

        closeDrawer();

        pushHistory();

        return;
      }

      const route =
        event.state;

      if (
        route &&
        route.efRoute
      ) {

        state.page =
          route.page || "home";

        state.stageIndex =
          Number.isInteger(route.stageIndex)
            ? route.stageIndex
            : -1;

        state.sectionIndex =
          Number.isInteger(route.sectionIndex)
            ? route.sectionIndex
            : -1;

        state.itemIndex =
          Number.isInteger(route.itemIndex)
            ? route.itemIndex
            : -1;

        saveRoute();

        if (
          state.page === "home"
        ) {
          showHome(false);
        } else {
          showRoute(false);
        }

        return;
      }

      if (state.page !== "home") {

        goBackRoute();

        return;
      }

      const leave =
        window.confirm(
          langText("closeWarning")
        );

      if (!leave) {
        pushHistory();
      }
    }
  );

  /* =======================================================
     35. KEYBOARD BACK / ESC
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      if (state.drawerOpen) {
        closeDrawer();
        return;
      }

      if (state.filterOpen) {

        state.filterOpen =
          false;

        const panel =
          $("#filterPanel");

        if (panel) {
          panel.style.display =
            "none";
        }

        return;
      }

      if (state.viewOpen) {

        state.viewOpen =
          false;

        const options =
          $("#viewOptions");

        if (options) {
          options.style.display =
            "none";
        }
      }
    }
  );

  /* =======================================================
     36. BOTTOM NAV
     ======================================================= */

  function bindBottomNav() {

    $$(".bottom-item")
      .forEach(button => {

        button.onclick = event => {

          event.preventDefault();

          const nav =
            button.dataset.nav;

          if (!nav) return;

          navigate(nav);
        };
      });
  }

  /* =======================================================
     37. DRAWER SEARCH
     ======================================================= */

  function bindDrawerSearch() {

    const search =
      $("#drawerSearch");

    if (!search) return;

    search.oninput =
      () => {

        const query =
          search.value
            .trim()
            .toLowerCase();

        $$(".drawer-item")
          .forEach(item => {

            const text =
              item.textContent
                .toLowerCase();

            item.style.display =
              !query ||
              text.includes(query)
                ? ""
                : "none";
          });
      };
  }

  /* =======================================================
     38. LANGUAGE ON EXISTING HTML
     ======================================================= */

  function bindExistingLanguageControls() {

    const hi =
      $("#langHi");

    const en =
      $("#langEn");

    if (hi) {

      hi.onclick =
        event => {

          event.preventDefault();

          setLanguage("hi");
        };
    }

    if (en) {

      en.onclick =
        event => {

          event.preventDefault();

          setLanguage("en");
        };
    }
  }

  /* =======================================================
     39. UPDATE STATIC UI
     ======================================================= */

  function updateStaticUI() {

    const mappings = {

      "#homeNavText": "home",
      "#estimateNavText": "estimate",
      "#calculatorNavText": "calculator",
      "#settingsNavText": "settings",

      "#themeTitle": "theme"
    };

    Object.entries(mappings)
      .forEach(
        ([selector, key]) => {

          const el =
            $(selector);

          if (el) {
            el.textContent =
              langText(key);
          }
        }
      );

    const search =
      $("#main");

    if (search) {

      search.placeholder =
        langText("search");
    }

    const filter =
      $("#filter-icon");

    if (filter) {

      filter.setAttribute(
        "aria-label",
        langText("filter")
      );
    }

    const clear =
      $("#clearFilter");

    if (clear) {

      clear.textContent =
        langText("clear");
    }
  }

  /* =======================================================
     40. FIX EXISTING THEME BUTTON
     ======================================================= */

  function bindThemeButton() {

    const button =
      $("#themeButton");

    if (!button) return;

    button.onclick =
      event => {

        event.preventDefault();

        toggleTheme();
      };
  }

  /* =======================================================
     41. INITIAL ROUTE VALIDATION
     ======================================================= */

  function validateSavedRoute() {

    if (
      state.page === "stage" &&
      !getStage(state.stageIndex)
    ) {

      state.page = "home";
      state.stageIndex = -1;
      state.sectionIndex = -1;
      state.itemIndex = -1;
    }

    if (
      state.page === "item" &&
      !getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      )
    ) {

      state.page = "home";
      state.stageIndex = -1;
      state.sectionIndex = -1;
      state.itemIndex = -1;
    }

    saveRoute();
  }

  /* =======================================================
     42. INITIALIZE
     ======================================================= */

  function init() {

    injectDynamicCSS();

    ensureDrawer();

    bindHamburger();

    bindExistingLanguageControls();

    bindThemeButton();

    bindBottomNav();

    bindDrawerSearch();

    updateLanguageButtons();

    applyTheme();

    validateSavedRoute();

    replaceHistory();

    if (state.page === "home") {

      showHome(false);

    } else {

      showRoute(false);
    }

    buildDrawer();

    updateStaticUI();

    /* Re-apply after Home DOM restoration */
    if (homeIsStatic) {
      bindHome();
    }
  }

  /* =======================================================
     43. DOM READY
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once:true }
    );

  } else {

    init();
  }

})();
