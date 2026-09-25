/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   MATCHED WITH:
   index.html
   style.css
   config.js
   material.js

   IMPORTANT:
   - material.js MASTER DATA is NOT modified
   - Stage names are read directly from MATERIALS
   - All material groups/items are read dynamically
   - 5 stages supported
   - Hindi / English UI
   - Dark / Light theme
   - 10 Material View Modes
   - Stage View Modes
   - Search
   - Estimate
   - Calculator
   - Settings
   - LocalStorage
   - Refresh state restore
   - Browser / Android back navigation
   - Explicit Add
   - Next does NOT auto-add
   - Quantity required
   - Optional brand / price
   - Price initially hidden
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     SAFETY
     ======================================================= */

  const CFG = window.APP_CONFIG || window.AppConfig || {};

  const MATERIAL_DATA = Array.isArray(window.MATERIALS)
    ? window.MATERIALS
    : [];

  const STORAGE = {
    estimate: CFG.storageKey || "sandeepEstimateItems",
    language: CFG.languageKey || "sandeepMaterialLang",
    theme: CFG.themeKey || "sandeepTheme",
    view: CFG.viewKey || "sandeepMaterialView",
    state: "sandeepEstimatePageState",
    stageView: "sandeepStageView"
  };

  const DEFAULT_LANG = CFG.defaultLanguage || "hi";
  const DEFAULT_THEME =
    CFG.theme && CFG.theme.default
      ? CFG.theme.default
      : "dark";

  /* =======================================================
     DOM
     ======================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const main = $("#main");
  const menuBtn = $("#menuBtn");
  const drawer = $("#drawer");
  const drawerOverlay = $("#drawerOverlay");
  const closeMenuBtn = $("#closeMenu");
  const langBtn = $("#langBtn");
  const themeBtn = $("#themeBtn");
  const bottomNav = $("#bottomNav");

  /* =======================================================
     APP STATE
     ======================================================= */

  const state = {
    language: loadLanguage(),
    theme: loadTheme(),

    page: "home",

    stageIndex: null,
    groupIndex: null,
    itemIndex: null,

    materialView: loadMaterialView(),
    stageView: loadStageView(),

    search: "",

    editor: null,

    menuOpen: false,

    pageHistory: [],

    initialized: false
  };

  /* =======================================================
     LANGUAGE
     ======================================================= */

  const UI = {
    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",
      menu: "मेन्यू",

      stages: "वर्क स्टेज",
      materials: "मटेरियल",
      search: "मटेरियल खोजें...",
      selectMaterial: "मटेरियल चुनें",

      back: "वापस",
      add: "एस्टिमेट में जोड़ें",
      update: "अपडेट करें",
      next: "अगला",
      previous: "पिछला",
      cancel: "रद्द करें",
      clear: "क्लियर",
      delete: "डिलीट",

      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",
      price: "रेट / कीमत",
      total: "कुल",

      required: "जरूरी",
      optional: "वैकल्पिक",

      choose: "चुनें",
      select: "सेलेक्ट करें",

      estimateEmpty: "अभी एस्टिमेट खाली है",
      noResult: "कोई मटेरियल नहीं मिला",

      clearEstimate: "एस्टिमेट साफ करें",
      totalItems: "कुल आइटम",

      calculatorTitle: "इलेक्ट्रिकल कैलकुलेटर",
      voltage: "वोल्टेज",
      current: "करंट",
      resistance: "रेजिस्टेंस",
      power: "पावर",
      calculate: "कैलकुलेट करें",
      reset: "रीसेट",

      theme: "थीम",
      dark: "डार्क",
      light: "लाइट",

      language: "भाषा",
      hindi: "हिंदी",
      english: "English",

      view: "व्यू",
      viewMode: "व्यू मोड",

      saved: "सेव हो गया",
      added: "एस्टिमेट में जोड़ दिया",
      updated: "अपडेट हो गया",
      deleted: "डिलीट हो गया",

      quantityRequired: "कृपया मात्रा भरें",
      chooseUnit: "कृपया यूनिट चुनें",

      leaveWarning:
        "क्या आप ऐप से बाहर निकलना चाहते हैं?"
    },

    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",
      menu: "Menu",

      stages: "Work Stages",
      materials: "Materials",
      search: "Search material...",
      selectMaterial: "Select Material",

      back: "Back",
      add: "Add to Estimate",
      update: "Update",
      next: "Next",
      previous: "Previous",
      cancel: "Cancel",
      clear: "Clear",
      delete: "Delete",

      quantity: "Quantity",
      unit: "Unit",
      brand: "Brand",
      price: "Rate / Price",
      total: "Total",

      required: "Required",
      optional: "Optional",

      choose: "Choose",
      select: "Select",

      estimateEmpty: "Estimate is empty",
      noResult: "No material found",

      clearEstimate: "Clear Estimate",
      totalItems: "Total Items",

      calculatorTitle: "Electrical Calculator",
      voltage: "Voltage",
      current: "Current",
      resistance: "Resistance",
      power: "Power",
      calculate: "Calculate",
      reset: "Reset",

      theme: "Theme",
      dark: "Dark",
      light: "Light",

      language: "Language",
      hindi: "हिंदी",
      english: "English",

      view: "View",
      viewMode: "View Mode",

      saved: "Saved",
      added: "Added to estimate",
      updated: "Updated",
      deleted: "Deleted",

      quantityRequired: "Please enter quantity",
      chooseUnit: "Please select unit",

      leaveWarning:
        "Do you want to exit the app?"
    }
  };

  const t = key =>
    UI[state.language] &&
    UI[state.language][key]
      ? UI[state.language][key]
      : UI.en[key] || key;

  /* =======================================================
     MATERIAL / STAGE TRANSLATIONS
     ======================================================= */

  const TEXT_MAP = {
    "STAGE 1": "स्टेज 1",
    "STAGE 2": "स्टेज 2",
    "STAGE 3": "स्टेज 3",
    "STAGE 4": "स्टेज 4",
    "STAGE 5": "स्टेज 5",

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

    "Pipe": "पाइप",
    "Bend": "बेंड",
    "Junction Box": "जंक्शन बॉक्स",
    "Fan Box": "फैन बॉक्स",
    "Concealed Light Box": "कन्सील्ड लाइट बॉक्स",
    "Modular Board (Concealed Metal/PVC Box)":
      "मॉड्यूलर बोर्ड",
    "MCB Box (Distribution Board)":
      "MCB बॉक्स",
    "Wire": "वायर",
    "Flexible Pipe": "फ्लेक्सिबल पाइप",
    "Electrical Tape": "इलेक्ट्रिकल टेप",
    "Fastener": "फास्टनर",
    "Steel Wire / Spring Wire (Fish Tape)":
      "स्टील वायर / स्प्रिंग वायर",
    "Switch Plate": "स्विच प्लेट",
    "Switch Board (Surface Gang Box)":
      "स्विच बोर्ड",
    "Switch": "स्विच",
    "Socket": "सॉकेट",
    "Fan Regulator": "फैन रेगुलेटर",
    "2 Way Switch": "2 वे स्विच",
    "Bell Push": "बेल पुश",
    "Neon Indicator": "निऑन इंडिकेटर",
    "Blank Plate / Dummy Switch":
      "ब्लैंक प्लेट / डमी स्विच",
    "DP Switch (Double Pole Switch)":
      "DP स्विच",
    "Mini MCB": "मिनी MCB",
    "SP MCB (Single Pole)": "SP MCB",
    "DP MCB (Double Pole)": "DP MCB",
    "TPN MCB (Three Pole with Neutral)":
      "TPN MCB",
    "MCB Changeover": "MCB चेंजओवर",
    "DP Isolator": "DP आइसोलेटर",
    "TPN Isolator (3P / 4P)":
      "TPN आइसोलेटर",
    "RCCB / RCD": "RCCB / RCD",
    "MCB Box": "MCB बॉक्स",
    "Kit Kat Fuse": "किट-कैट फ्यूज",
    "Fan Sheet": "फैन शीट",
    "Round Sheet": "राउंड शीट",
    "Fan Rod": "फैन रॉड",
    "Fan Clamp": "फैन क्लैम्प",
    "Holder": "होल्डर",
    "Ceiling Rose": "सीलिंग रोज",
    "Chain": "चेन",
    "LED Bulb": "LED बल्ब",
    "LED Tube Light": "LED ट्यूब लाइट",
    "Foot Light": "फुट लाइट",
    "Up Down Light": "अप डाउन लाइट",
    "Panel Light": "पैनल लाइट",
    "Surface Light": "सरफेस लाइट",
    "COB Light": "COB लाइट",
    "COB Spot Light": "COB स्पॉट लाइट",
    "Down Light": "डाउन लाइट",
    "Strip Light": "स्ट्रिप लाइट",
    "Rope Light": "रोप लाइट",
    "LED Profile Channel": "LED प्रोफाइल चैनल",
    "LED Strip Driver (SMPS)": "LED स्ट्रिप ड्राइवर",
    "Door Bell": "डोर बेल",
    "Tape (Mounting / Double Sided)":
      "माउंटिंग / डबल साइडेड टेप",
    "Instant Glue": "इंस्टेंट ग्लू",
    "Araldite Glue (Epoxy)":
      "अराल्डाइट ग्लू",
    "POP (Plaster of Paris)":
      "POP",
    "Putty Blade / Patta":
      "पुट्टी ब्लेड / पट्टा",
    "Screw": "स्क्रू",
    "Lug (Cable Terminal Lug)":
      "केबल टर्मिनल लग",
    "Washer": "वॉशर",
    "Cable Tie / Zip Tie":
      "केबल टाई / जिप टाई",
    "Cable Clip": "केबल क्लिप",
    "Saddle (Pipe Clamp)":
      "सैडल / पाइप क्लैम्प",
    "PVC Wall Plug / Gulli / Gitti":
      "PVC वॉल प्लग / गुल्ली / गिट्टी"
  };

  function text(value) {
    if (state.language === "en") {
      return String(value ?? "");
    }

    return TEXT_MAP[value] || String(value ?? "");
  }

  /* =======================================================
     STORAGE
     ======================================================= */

  function safeJSONParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function loadLanguage() {
    const value = localStorage.getItem(STORAGE.language);

    return value === "en" || value === "hi"
      ? value
      : DEFAULT_LANG;
  }

  function loadTheme() {
    const value = localStorage.getItem(STORAGE.theme);

    return value === "light" || value === "dark"
      ? value
      : DEFAULT_THEME;
  }

  function loadMaterialView() {
    const value = localStorage.getItem(STORAGE.view);

    const allowed = [
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

    return allowed.includes(value)
      ? value
      : "grid";
  }

  function loadStageView() {
    const value = localStorage.getItem(STORAGE.stageView);

    const allowed = [
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

    return allowed.includes(value)
      ? value
      : "grid";
  }

  function saveState() {
    localStorage.setItem(
      STORAGE.state,
      JSON.stringify({
        page: state.page,
        stageIndex: state.stageIndex,
        groupIndex: state.groupIndex,
        itemIndex: state.itemIndex
      })
    );
  }

  function loadSavedState() {
    const saved = safeJSONParse(
      localStorage.getItem(STORAGE.state),
      null
    );

    if (!saved) return;

    if (
      typeof saved.page === "string" &&
      [
        "home",
        "estimate",
        "calculator",
        "settings"
      ].includes(saved.page)
    ) {
      state.page = saved.page;
    }

    if (Number.isInteger(saved.stageIndex)) {
      state.stageIndex = saved.stageIndex;
    }

    if (Number.isInteger(saved.groupIndex)) {
      state.groupIndex = saved.groupIndex;
    }

    if (Number.isInteger(saved.itemIndex)) {
      state.itemIndex = saved.itemIndex;
    }
  }

  function getEstimate() {
    const data = safeJSONParse(
      localStorage.getItem(STORAGE.estimate),
      []
    );

    return Array.isArray(data) ? data : [];
  }

  function saveEstimate(items) {
    localStorage.setItem(
      STORAGE.estimate,
      JSON.stringify(items)
    );
  }

  /* =======================================================
     THEME
     ======================================================= */

  function applyTheme() {
    document.body.dataset.theme = state.theme;

    if (!themeBtn) return;

    themeBtn.setAttribute(
      "aria-pressed",
      state.theme === "light" ? "true" : "false"
    );

    const icon = $(".themeIcon", themeBtn);

    if (icon) {
      icon.textContent =
        state.theme === "dark"
          ? "☀️"
          : "🌙";
    }

    localStorage.setItem(
      STORAGE.theme,
      state.theme
    );
  }

  function toggleTheme() {
    state.theme =
      state.theme === "dark"
        ? "light"
        : "dark";

    applyTheme();
    renderCurrentPage();
  }

  /* =======================================================
     LANGUAGE
     ======================================================= */

  function applyLanguageButton() {
    if (!langBtn) return;

    langBtn.textContent =
      state.language === "hi"
        ? "EN"
        : "हि";

    langBtn.setAttribute(
      "aria-label",
      state.language === "hi"
        ? "Switch to English"
        : "हिंदी में बदलें"
    );
  }

  function toggleLanguage() {
    state.language =
      state.language === "hi"
        ? "en"
        : "hi";

    localStorage.setItem(
      STORAGE.language,
      state.language
    );

    applyLanguageButton();
    renderCurrentPage();
  }

  /* =======================================================
     DRAWER
     ======================================================= */

  function openDrawer() {
    state.menuOpen = true;

    if (drawer) {
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
    }

    if (drawerOverlay) {
      drawerOverlay.classList.add("show");
    }

    if (menuBtn) {
      menuBtn.classList.add("open");
      menuBtn.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    document.body.classList.add("menu-open");
  }

  function closeDrawer() {
    state.menuOpen = false;

    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }

    if (drawerOverlay) {
      drawerOverlay.classList.remove("show");
    }

    if (menuBtn) {
      menuBtn.classList.remove("open");
      menuBtn.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    document.body.classList.remove("menu-open");
  }

  function toggleDrawer() {
    state.menuOpen
      ? closeDrawer()
      : openDrawer();
  }

  /* =======================================================
     NAVIGATION
     ======================================================= */

  function go(page, options = {}) {
    const oldPage = state.page;

    if (!options.replace && oldPage !== page) {
      state.pageHistory.push({
        page: oldPage,
        stageIndex: state.stageIndex,
        groupIndex: state.groupIndex,
        itemIndex: state.itemIndex
      });

      if (state.pageHistory.length > 30) {
        state.pageHistory.shift();
      }
    }

    state.page = page;

    if (page !== "estimate") {
      state.editor = null;
    }

    if (!options.keepSelection) {
      if (page === "home") {
        state.stageIndex = null;
        state.groupIndex = null;
        state.itemIndex = null;
      }
    }

    closeDrawer();
    saveState();
    renderCurrentPage();
    scrollTop();
  }

  function goBackInsideApp() {
    if (state.menuOpen) {
      closeDrawer();
      return true;
    }

    if (state.editor) {
      state.editor = null;
      renderStageOrMaterial();
      scrollTop();
      return true;
    }

    if (state.itemIndex !== null) {
      state.itemIndex = null;
      renderStageOrMaterial();
      scrollTop();
      return true;
    }

    if (state.groupIndex !== null) {
      state.groupIndex = null;
      renderStageOrMaterial();
      scrollTop();
      return true;
    }

    if (state.stageIndex !== null) {
      state.stageIndex = null;
      state.groupIndex = null;
      state.itemIndex = null;
      go("home", { replace: true });
      return true;
    }

    if (
      state.pageHistory.length &&
      state.page !== "home"
    ) {
      const previous =
        state.pageHistory.pop();

      state.page = previous.page;
      state.stageIndex =
        previous.stageIndex;
      state.groupIndex =
        previous.groupIndex;
      state.itemIndex =
        previous.itemIndex;

      saveState();
      renderCurrentPage();
      scrollTop();

      return true;
    }

    if (state.page !== "home") {
      go("home", { replace: true });
      return true;
    }

    return false;
  }

  /* =======================================================
     STAGE HELPERS
     ======================================================= */

  function getStage(index) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= MATERIAL_DATA.length
    ) {
      return null;
    }

    return MATERIAL_DATA[index];
  }

  function getStageName(stage) {
    return stage && stage[1]
      ? stage[1]
      : "";
  }

  function getStageCategory(stage) {
    return stage && stage[2]
      ? stage[2]
      : "";
  }

  function getGroups(stage) {
    if (!stage) return [];

    return stage
      .slice(3)
      .filter(group =>
        Array.isArray(group) &&
        Array.isArray(group[1])
      );
  }

  function getGroup(stageIndex, groupIndex) {
    const stage = getStage(stageIndex);

    if (!stage) return null;

    const groups = getGroups(stage);

    return groups[groupIndex] || null;
  }

  function getGroupItems(stageIndex, groupIndex) {
    const group = getGroup(
      stageIndex,
      groupIndex
    );

    return group && Array.isArray(group[1])
      ? group[1]
      : [];
  }

  function getItem(
    stageIndex,
    groupIndex,
    itemIndex
  ) {
    const items = getGroupItems(
      stageIndex,
      groupIndex
    );

    return items[itemIndex] || null;
  }

  function flattenItems() {
    const result = [];

    MATERIAL_DATA.forEach(
      (stage, stageIndex) => {
        const groups = getGroups(stage);

        groups.forEach(
          (group, groupIndex) => {
            const items = group[1] || [];

            items.forEach(
              (item, itemIndex) => {
                if (!Array.isArray(item)) return;

                result.push({
                  stageIndex,
                  groupIndex,
                  itemIndex,
                  stage,
                  group,
                  item
                });
              }
            );
          }
        );
      }
    );

    return result;
  }

  /* =======================================================
     ITEM PARSER
     ======================================================= */

  function parseItem(item) {
    if (!Array.isArray(item)) {
      return {
        name: "",
        options: [],
        units: [],
        brands: []
      };
    }

    return {
      name: item[0] || "",
      options: Array.isArray(item[1])
        ? item[1]
        : [],
      units: Array.isArray(item[2])
        ? item[2]
        : [],
      brands: Array.isArray(item[3])
        ? item[3]
        : []
    };
  }

  /* =======================================================
     HTML HELPERS
     ======================================================= */

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function attr(value) {
    return esc(value);
  }

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function focusTop() {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  function noImageMarkup() {
    return "";
  }

  /* =======================================================
     VIEW MODE
     ======================================================= */

  const VIEW_MODES = [
    {
      id: "grid",
      label: "Grid",
      hi: "ग्रिड",
      icon: "▦"
    },
    {
      id: "list",
      label: "List",
      hi: "लिस्ट",
      icon: "☷"
    },
    {
      id: "compact",
      label: "Compact",
      hi: "कॉम्पैक्ट",
      icon: "≡"
    },
    {
      id: "large",
      label: "Large",
      hi: "बड़ा",
      icon: "▣"
    },
    {
      id: "mini",
      label: "Mini",
      hi: "मिनी",
      icon: "▪"
    },
    {
      id: "two-column",
      label: "2 Column",
      hi: "2 कॉलम",
      icon: "▥"
    },
    {
      id: "horizontal",
      label: "Horizontal",
      hi: "हॉरिजॉन्टल",
      icon: "▰"
    },
    {
      id: "icon-list",
      label: "Icon List",
      hi: "आइकन लिस्ट",
      icon: "☰"
    },
    {
      id: "timeline",
      label: "Timeline",
      hi: "टाइमलाइन",
      icon: "◉"
    },
    {
      id: "dense",
      label: "Dense",
      hi: "डेंस",
      icon: "▤"
    }
  ];

  function viewLabel(view) {
    const found =
      VIEW_MODES.find(
        v => v.id === view
      );

    if (!found) return "Grid";

    return state.language === "hi"
      ? found.hi
      : found.label;
  }

  function renderViewSelector(type = "material") {
    const current =
      type === "stage"
        ? state.stageView
        : state.materialView;

    const id =
      type === "stage"
        ? "stageViewSelector"
        : "materialViewSelector";

    const btnId =
      type === "stage"
        ? "stageViewBtn"
        : "materialViewBtn";

    return `
      <div class="viewSelector ${type === "stage" ? "stageViewSelector" : ""}" id="${id}">
        <button
          class="viewSelectorHead ${type === "stage" ? "stageViewBtn" : ""}"
          id="${btnId}"
          type="button"
          aria-expanded="false"
          title="${esc(viewLabel(current))}"
        >
          <span class="viewSelectorIcon">
            ${current === "grid" ? "▦" : "◈"}
          </span>
          <span class="viewSelectorArrow">⌄</span>
        </button>

        <div class="viewOptions">
          ${VIEW_MODES.map(view => `
            <button
              class="viewOption ${view.id === current ? "active" : ""}"
              type="button"
              data-view-type="${type}"
              data-view="${attr(view.id)}"
            >
              <span class="viewOptionIcon">${view.icon}</span>
              <span>
                ${esc(
                  state.language === "hi"
                    ? view.hi
                    : view.label
                )}
              </span>
              ${
                view.id === current
                  ? `<span class="viewCheck">✓</span>`
                  : ""
              }
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function setView(type, value) {
    if (
      !VIEW_MODES.some(
        mode => mode.id === value
      )
    ) {
      return;
    }

    if (type === "stage") {
      state.stageView = value;

      localStorage.setItem(
        STORAGE.stageView,
        value
      );
    } else {
      state.materialView = value;

      localStorage.setItem(
        STORAGE.view,
        value
      );
    }

    renderCurrentPage();
  }

  /* =======================================================
     HOME PAGE
     ======================================================= */

  function renderHome() {
    const estimateCount =
      getEstimate().length;

    return `
      <section class="page homePage">

        <div class="hero">

          <div class="heroLogo">
            <img
              src="logo.png"
              alt="Sandeep ElectroFix"
              onerror="this.style.display='none'"
            >
          </div>

          <h2>
            ${esc(
              state.language === "hi"
                ? "एस्टिमेट लिस्ट"
                : "Estimate List"
            )}
          </h2>

          <p>
            ${esc(
              state.language === "hi"
                ? "Sandeep ElectroFix"
                : "Sandeep ElectroFix"
            )}
          </p>

          <small>
            ${esc(
              state.language === "hi"
                ? "Powering Your Trust"
                : "Powering Your Trust"
            )}
          </small>

          <div class="searchBox">
            <span>⌕</span>
            <input
              id="globalSearch"
              type="search"
              autocomplete="off"
              placeholder="${attr(t("search"))}"
              value="${attr(state.search)}"
            >
            ${
              state.search
                ? `<button id="clearSearch" type="button">×</button>`
                : ""
            }
          </div>

        </div>

        <div class="sectionTitle">
          <div>
            <span class="eyebrow">
              ${esc(t("stages"))}
            </span>

            <h3>
              ${
                state.language === "hi"
                  ? "काम के स्टेज"
                  : "Work Stages"
              }
            </h3>
          </div>

          ${renderViewSelector("stage")}
        </div>

        <div
          id="stageGrid"
          class="stageGrid ${attr(
            state.stageView
          )}"
        >
          ${renderStageCards()}
        </div>

        <div class="homeEstimateCard">
          <div>
            <span>
              ${esc(t("estimate"))}
            </span>
            <strong>${estimateCount}</strong>
          </div>

          <button
            type="button"
            class="primary"
            data-page-action="estimate"
          >
            ${esc(t("estimate"))}
          </button>
        </div>

      </section>
    `;
  }

  function renderStageCards() {
    if (!MATERIAL_DATA.length) {
      return `
        <div class="emptyState">
          ${esc(t("noResult"))}
        </div>
      `;
    }

    return MATERIAL_DATA.map(
      (stage, index) => {

        const stageName =
          getStageName(stage);

        const category =
          getStageCategory(stage);

        const groupCount =
          getGroups(stage).length;

        return `
          <button
            type="button"
            class="stageCard"
            data-stage-index="${index}"
          >
            <span class="stageNumber">
              ${esc(stage[0] || `STAGE ${index + 1}`)}
            </span>

            <span class="stageCardTitle">
              ${esc(text(stageName))}
            </span>

            <span class="stageCardCategory">
              ${esc(text(category))}
            </span>

            <span class="stageCardMeta">
              ${groupCount}
              ${
                state.language === "hi"
                  ? " ग्रुप"
                  : " Groups"
              }
            </span>
          </button>
        `;
      }
    ).join("");
  }

  /* =======================================================
     SEARCH
     ======================================================= */

  function getSearchResults(query) {
    const q = query
      .trim()
      .toLowerCase();

    if (!q) return [];

    return flattenItems().filter(entry => {

      const item = parseItem(entry.item);

      const values = [
        entry.stage?.[0],
        entry.stage?.[1],
        entry.stage?.[2],
        entry.group?.[0],
        item.name,
        ...item.options.flatMap(option =>
          Array.isArray(option)
            ? [option[0], ...(option[1] || [])]
            : []
        ),
        ...item.units,
        ...item.brands
      ];

      return values.some(value =>
        String(value || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }

  function renderSearchPage() {
    const results =
      getSearchResults(state.search);

    return `
      <section class="page">

        <div class="stageHead">
          <button
            type="button"
            class="back"
            data-action="back"
          >
            ← ${esc(t("back"))}
          </button>

          <div>
            <span class="eyebrow">
              ${esc(t("search"))}
            </span>

            <h2>
              ${esc(state.search)}
            </h2>
          </div>
        </div>

        <div class="itemGrid ${attr(state.materialView)}">
          ${
            results.length
              ? results.map(
                  entry =>
                    renderSearchItem(entry)
                ).join("")
              : `
                <div class="emptyState">
                  ${esc(t("noResult"))}
                </div>
              `
          }
        </div>

      </section>
    `;
  }

  function renderSearchItem(entry) {
    const item =
      parseItem(entry.item);

    return `
      <button
        type="button"
        class="itemCard"
        data-search-stage="${entry.stageIndex}"
        data-search-group="${entry.groupIndex}"
        data-search-item="${entry.itemIndex}"
      >
        ${noImageMarkup()}

        <span class="itemHead">
          <strong>
            ${esc(text(item.name))}
          </strong>

          <small>
            ${esc(
              text(
                getStageName(entry.stage)
              )
            )}
          </small>
        </span>
      </button>
    `;
  }

  /* =======================================================
     STAGE PAGE
     ======================================================= */

  function renderStagePage() {
    const stage =
      getStage(state.stageIndex);

    if (!stage) {
      state.stageIndex = null;
      state.groupIndex = null;
      state.itemIndex = null;

      return renderHome();
    }

    if (
      state.search.trim()
    ) {
      return renderSearchPage();
    }

    if (
      state.groupIndex !== null
    ) {
      return renderGroupPage();
    }

    return `
      <section class="page">

        <div class="stageHead">

          <button
            type="button"
            class="back"
            data-action="back"
          >
            ← ${esc(t("back"))}
          </button>

          <div>
            <span class="eyebrow">
              ${esc(stage[0] || "")}
            </span>

            <h2>
              ${esc(text(stage[1] || ""))}
            </h2>

            <p>
              ${esc(text(stage[2] || ""))}
            </p>
          </div>

        </div>

        <div class="sectionTitle">
          <div>
            <span class="eyebrow">
              ${esc(t("materials"))}
            </span>
          </div>

          ${renderViewSelector("material")}
        </div>

        <div class="stageGroupGrid">
          ${renderGroupCards(stage)}
        </div>

      </section>
    `;
  }

  function renderGroupCards(stage) {
    const groups =
      getGroups(stage);

    if (!groups.length) {
      return `
        <div class="emptyState">
          ${esc(t("noResult"))}
        </div>
      `;
    }

    return groups.map(
      (group, groupIndex) => {

        const items =
          Array.isArray(group[1])
            ? group[1]
            : [];

        return `
          <button
            type="button"
            class="stageCard groupCard"
            data-group-index="${groupIndex}"
          >
            <span class="stageNumber">
              ${String(groupIndex + 1).padStart(2, "0")}
            </span>

            <span class="stageCardTitle">
              ${esc(text(group[0] || ""))}
            </span>

            <span class="stageCardMeta">
              ${items.length}
              ${
                state.language === "hi"
                  ? " आइटम"
                  : " Items"
              }
            </span>
          </button>
        `;
      }
    ).join("");
  }

  /* =======================================================
     GROUP PAGE
     ======================================================= */

  function renderGroupPage() {
    const stage =
      getStage(state.stageIndex);

    const group =
      getGroup(
        state.stageIndex,
        state.groupIndex
      );

    if (!stage || !group) {
      state.groupIndex = null;
      return renderStagePage();
    }

    if (
      state.itemIndex !== null
    ) {
      return renderItemEditor();
    }

    const items =
      Array.isArray(group[1])
        ? group[1]
        : [];

    return `
      <section class="page">

        <div class="stageHead">

          <button
            type="button"
            class="back"
            data-action="back"
          >
            ← ${esc(t("back"))}
          </button>

          <div>
            <span class="eyebrow">
              ${esc(text(stage[1] || ""))}
            </span>

            <h2>
              ${esc(text(group[0] || ""))}
            </h2>
          </div>

        </div>

        ${renderViewSelector("material")}

        <div
          class="itemGrid ${attr(
            state.materialView
          )}"
        >
          ${
            items.length
              ? items.map(
                  (item, itemIndex) =>
                    renderItemCard(
                      item,
                      itemIndex
                    )
                ).join("")
              : `
                <div class="emptyState">
                  ${esc(t("noResult"))}
                </div>
              `
          }
        </div>

      </section>
    `;
  }

  function renderItemCard(
    rawItem,
    itemIndex
  ) {
    const item =
      parseItem(rawItem);

    return `
      <button
        type="button"
        class="itemCard"
        data-item-index="${itemIndex}"
      >

        ${noImageMarkup()}

        <span class="itemHead">

          <strong>
            ${esc(text(item.name))}
          </strong>

          ${
            item.options.length
              ? `
                <small>
                  ${item.options.length}
                  ${
                    state.language === "hi"
                      ? " विकल्प"
                      : " Options"
                  }
                </small>
              `
              : ""
          }

        </span>

      </button>
    `;
  }

  /* =======================================================
     EDITOR STATE
     ======================================================= */

  function createEditor(
    stageIndex,
    groupIndex,
    itemIndex,
    existing = null
  ) {
    const item = getItem(
      stageIndex,
      groupIndex,
      itemIndex
    );

    if (!item) return null;

    const parsed =
      parseItem(item);

    const optionValues = {};

    parsed.options.forEach(
      option => {
        if (!Array.isArray(option)) return;

        optionValues[option[0]] =
          existing &&
          existing.options &&
          Object.prototype.hasOwnProperty.call(
            existing.options,
            option[0]
          )
            ? existing.options[option[0]]
            : "";
      }
    );

    return {
      editId:
        existing && existing.id
          ? existing.id
          : null,

      stageIndex,
      groupIndex,
      itemIndex,

      name: parsed.name,

      options: optionValues,

      quantity:
        existing &&
        existing.quantity !== undefined
          ? existing.quantity
          : "",

      unit:
        existing &&
        existing.unit !== undefined
          ? existing.unit
          : "",

      brand:
        existing &&
        existing.brand !== undefined
          ? existing.brand
          : "",

      price:
        existing &&
        existing.price !== undefined
          ? existing.price
          : "",

      priceVisible:
        existing &&
        existing.priceVisible === true
          ? true
          : false
    };
  }

  /* =======================================================
     ITEM EDITOR
     ======================================================= */

  function renderItemEditor() {
    const item =
      getItem(
        state.stageIndex,
        state.groupIndex,
        state.itemIndex
      );

    if (!item) {
      state.itemIndex = null;
      return renderGroupPage();
    }

    if (!state.editor) {
      state.editor = createEditor(
        state.stageIndex,
        state.groupIndex,
        state.itemIndex
      );
    }

    const parsed =
      parseItem(item);

    const isEditing =
      Boolean(state.editor.editId);

    return `
      <section class="page itemEditorPage">

        <div class="stageHead">

          <button
            type="button"
            class="back"
            data-action="back"
          >
            ← ${esc(t("back"))}
          </button>

          <div>
            <span class="eyebrow">
              ${esc(
                text(
                  getStageName(
                    getStage(
                      state.stageIndex
                    )
                  )
                )
              )}
            </span>

            <h2>
              ${esc(text(parsed.name))}
            </h2>
          </div>

        </div>

        <div class="formCard">

          ${
            parsed.options.length
              ? parsed.options
                  .map(
                    (option, optionIndex) =>
                      renderOptionField(
                        option,
                        optionIndex
                      )
                  )
                  .join("")
              : ""
          }

          ${renderQuantityField()}

          ${renderUnitField(parsed.units)}

          ${
            CFG.ui &&
            CFG.ui.brand !== false
              ? renderBrandField(
                  parsed.brands
                )
              : ""
          }

          ${
            CFG.ui &&
            CFG.ui.price !== false
              ? renderPriceField()
              : ""
          }

          <div class="editorActions">

            <button
              type="button"
              class="primary"
              id="saveMaterialBtn"
            >
              ${esc(
                isEditing
                  ? t("update")
                  : t("add")
              )}
            </button>

            <button
              type="button"
              class="secondary"
              id="nextMaterialBtn"
            >
              ${esc(t("next"))} →
            </button>

          </div>

        </div>

      </section>
    `;
  }

  function renderOptionField(
    option,
    optionIndex
  ) {
    if (!Array.isArray(option)) {
      return "";
    }

    const label =
      option[0] || "";

    const values =
      Array.isArray(option[1])
        ? option[1]
        : [];

    const current =
      state.editor &&
      state.editor.options
        ? state.editor.options[label] || ""
        : "";

    const fieldId =
      `option_${optionIndex}`;

    return `
      <div class="field">

        <label for="${fieldId}">
          <span>
            ${esc(text(label))}
          </span>

          <small>
            ${esc(t("optional"))}
          </small>
        </label>

        <div class="inputWithClear">

          <select
            id="${fieldId}"
            data-option-name="${attr(label)}"
          >
            <option value="">
              ${esc(t("choose"))}
            </option>

            ${values.map(value => `
              <option
                value="${attr(value)}"
                ${
                  String(current) ===
                  String(value)
                    ? "selected"
                    : ""
                }
              >
                ${esc(text(value))}
              </option>
            `).join("")}
          </select>

          ${
            current
              ? `
                <button
                  type="button"
                  class="fieldClear"
                  data-clear-option="${attr(label)}"
                >
                  ×
                </button>
              `
              : ""
          }

        </div>

      </div>
    `;
  }

  function renderQuantityField() {
    const value =
      state.editor?.quantity ?? "";

    return `
      <div class="field">

        <label for="materialQuantity">
          <span>
            ${esc(t("quantity"))}
          </span>

          <small>
            ${esc(t("required"))}
          </small>
        </label>

        <div class="qtyRow">

          <button
            type="button"
            class="qtyBtn"
            data-qty="-1"
          >
            −
          </button>

          <div class="inputWithClear qtyInputWrap">

            <input
              id="materialQuantity"
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
              value="${attr(value)}"
            >

            ${
              value !== "" &&
              value !== null
                ? `
                  <button
                    type="button"
                    class="fieldClear"
                    data-clear-field="quantity"
                  >
                    ×
                  </button>
                `
                : ""
            }

          </div>

          <button
            type="button"
            class="qtyBtn"
            data-qty="1"
          >
            +
          </button>

        </div>

        <div class="qtyQuick">
          ${[1, 5, 10, 25, 50, 100]
            .map(q => `
              <button
                type="button"
                data-qty-set="${q}"
              >
                ${q}
              </button>
            `).join("")}
        </div>

      </div>
    `;
  }

  function renderUnitField(units) {
    const current =
      state.editor?.unit || "";

    return `
      <div class="field">

        <label for="materialUnit">
          <span>
            ${esc(t("unit"))}
          </span>

          <small>
            ${esc(t("required"))}
          </small>
        </label>

        <div class="inputWithClear">

          <select
            id="materialUnit"
          >
            <option value="">
              ${esc(t("choose"))}
            </option>

            ${units.map(unit => `
              <option
                value="${attr(unit)}"
                ${
                  String(current) ===
                  String(unit)
                    ? "selected"
                    : ""
                }
              >
                ${esc(unit)}
              </option>
            `).join("")}

          </select>

          ${
            current
              ? `
                <button
                  type="button"
                  class="fieldClear"
                  data-clear-field="unit"
                >
                  ×
                </button>
              `
              : ""
          }

        </div>

      </div>
    `;
  }

  function renderBrandField(brands) {
    const current =
      state.editor?.brand || "";

    return `
      <div class="field">

        <label for="materialBrand">
          <span>
            ${esc(t("brand"))}
          </span>

          <small>
            ${esc(t("optional"))}
          </small>
        </label>

        <div class="inputWithClear">

          <select
            id="materialBrand"
          >
            <option value="">
              ${esc(t("choose"))}
            </option>

            ${brands.map(brand => `
              <option
                value="${attr(brand)}"
                ${
                  String(current) ===
                  String(brand)
                    ? "selected"
                    : ""
                }
              >
                ${esc(brand)}
              </option>
            `).join("")}

          </select>

          ${
            current
              ? `
                <button
                  type="button"
                  class="fieldClear"
                  data-clear-field="brand"
                >
                  ×
                </button>
              `
              : ""
          }

        </div>

      </div>
    `;
  }

  function renderPriceField() {
    const visible =
      state.editor?.priceVisible === true;

    const current =
      state.editor?.price ?? "";

    return `
      <div class="priceWrap">

        <button
          type="button"
          class="priceToggle"
          id="priceToggle"
        >
          ₹ ${esc(t("price"))}
          <span>
            ${visible ? "▲" : "▼"}
          </span>
        </button>

        ${
          visible
            ? `
              <div class="priceBox">

                <label for="materialPrice">
                  ${esc(t("price"))}
                </label>

                <div class="inputWithClear">

                  <input
                    id="materialPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    value="${attr(current)}"
                    placeholder="₹"
                  >

                  ${
                    current !== ""
                      ? `
                        <button
                          type="button"
                          class="fieldClear"
                          data-clear-field="price"
                        >
                          ×
                        </button>
                      `
                      : ""
                  }

                </div>

              </div>
            `
            : ""
        }

      </div>
    `;
  }

  /* =======================================================
     EDITOR INPUT SYNC
     ======================================================= */

  function syncEditorFromDOM() {
    if (!state.editor) return;

    $$("[data-option-name]").forEach(
      select => {
        const name =
          select.dataset.optionName;

        state.editor.options[name] =
          select.value;
      }
    );

    const quantity =
      $("#materialQuantity");

    if (quantity) {
      state.editor.quantity =
        quantity.value;
    }

    const unit =
      $("#materialUnit");

    if (unit) {
      state.editor.unit =
        unit.value;
    }

    const brand =
      $("#materialBrand");

    if (brand) {
      state.editor.brand =
        brand.value;
    }

    const price =
      $("#materialPrice");

    if (price) {
      state.editor.price =
        price.value;
    }
  }

  /* =======================================================
     SAVE MATERIAL
     ======================================================= */

  function saveCurrentMaterial() {
    syncEditorFromDOM();

    if (!state.editor) return;

    const quantity =
      Number(state.editor.quantity);

    if (
      state.editor.quantity === "" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      toast(t("quantityRequired"));
      $("#materialQuantity")?.focus();
      return;
    }

    if (!state.editor.unit) {
      toast(t("chooseUnit"));
      $("#materialUnit")?.focus();
      return;
    }

    const stage =
      getStage(state.editor.stageIndex);

    const group =
      getGroup(
        state.editor.stageIndex,
        state.editor.groupIndex
      );

    const item =
      getItem(
        state.editor.stageIndex,
        state.editor.groupIndex,
        state.editor.itemIndex
      );

    if (!stage || !group || !item) {
      return;
    }

    const parsed =
      parseItem(item);

    const estimate =
      getEstimate();

    const entry = {
      id:
        state.editor.editId ||
        `${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      stageIndex:
        state.editor.stageIndex,

      groupIndex:
        state.editor.groupIndex,

      itemIndex:
        state.editor.itemIndex,

      stageId:
        stage[0] || "",

      stageName:
        stage[1] || "",

      groupName:
        group[0] || "",

      materialName:
        parsed.name || "",

      options: {
        ...(state.editor.options || {})
      },

      quantity:
        quantity,

      unit:
        state.editor.unit || "",

      brand:
        state.editor.brand || "",

      price:
        state.editor.price === ""
          ? ""
          : Number(state.editor.price),

      priceVisible:
        state.editor.priceVisible === true,

      updatedAt:
        new Date().toISOString()
    };

    const existingIndex =
      estimate.findIndex(
        saved =>
          saved.id === entry.id
      );

    if (existingIndex >= 0) {
      estimate[existingIndex] =
        entry;

      saveEstimate(estimate);
      toast(t("updated"));
    } else {
      estimate.push(entry);

      saveEstimate(estimate);
      toast(t("added"));
    }

    state.editor.editId =
      entry.id;

    renderEstimate();

    /*
      Explicit Add:
      Save first.
      Next is a separate button.
      No automatic addition on Next.
    */
  }

  /* =======================================================
     NEXT MATERIAL
     ======================================================= */

  function nextMaterial() {
    syncEditorFromDOM();

    const stageIndex =
      state.stageIndex;

    const groupIndex =
      state.groupIndex;

    const itemIndex =
      state.itemIndex;

    if (
      stageIndex === null ||
      groupIndex === null ||
      itemIndex === null
    ) {
      return;
    }

    const items =
      getGroupItems(
        stageIndex,
        groupIndex
      );

    if (!items.length) {
      return;
    }

    if (
      itemIndex <
      items.length - 1
    ) {
      state.itemIndex =
        itemIndex + 1;
    } else {

      const groups =
        getGroups(
          getStage(stageIndex)
        );

      if (
        groupIndex <
        groups.length - 1
      ) {
        state.groupIndex =
          groupIndex + 1;

        state.itemIndex = 0;
      } else if (
        stageIndex <
        MATERIAL_DATA.length - 1
      ) {
        state.stageIndex =
          stageIndex + 1;

        state.groupIndex = 0;
        state.itemIndex = 0;
      } else {
        state.itemIndex = null;
        state.editor = null;

        toast(
          state.language === "hi"
            ? "यह आखिरी मटेरियल है"
            : "This is the last material"
        );

        renderStageOrMaterial();
        focusTop();
        return;
      }
    }

    /*
      IMPORTANT:
      Next never auto-saves / auto-adds.
      It simply opens the next item.
    */

    state.editor = null;

    saveState();
    renderCurrentPage();
    focusTop();
  }

  /* =======================================================
     ESTIMATE PAGE
     ======================================================= */

  function renderEstimate() {
    state.page = "estimate";
    state.stageIndex = null;
    state.groupIndex = null;
    state.itemIndex = null;
    state.editor = null;

    const items =
      getEstimate();

    const total =
      items.reduce(
        (sum, item) => {

          const qty =
            Number(item.quantity) || 0;

          const price =
            Number(item.price) || 0;

          return sum + qty * price;
        },
        0
      );

    main.innerHTML = `
      <section class="page estimatePage">

        <div class="stageHead">

          <div>
            <span class="eyebrow">
              ${esc(t("estimate"))}
            </span>

            <h2>
              ${
                state.language === "hi"
                  ? "आपका एस्टिमेट"
                  : "Your Estimate"
              }
            </h2>
          </div>

          ${
            items.length
              ? `
                <button
                  type="button"
                  class="danger"
                  id="clearEstimateBtn"
                >
                  ${esc(t("clearEstimate"))}
                </button>
              `
              : ""
          }

        </div>

        ${
          items.length
            ? `
              <div class="estimateSummary">

                <div>
                  <span>
                    ${esc(t("totalItems"))}
                  </span>

                  <strong>
                    ${items.length}
                  </strong>
                </div>

                <div>
                  <span>
                    ${esc(t("total"))}
                  </span>

                  <strong>
                    ₹${formatNumber(total)}
                  </strong>
                </div>

              </div>

              <div class="estimateList">
                ${items
                  .map(
                    (item, index) =>
                      renderEstimateItem(
                        item,
                        index
                      )
                  )
                  .join("")}
              </div>
            `
            : `
              <div class="emptyState">
                <div class="emptyIcon">▤</div>

                <h3>
                  ${esc(t("estimateEmpty"))}
                </h3>

                <p>
                  ${
                    state.language === "hi"
                      ? "स्टेज से मटेरियल चुनकर एस्टिमेट में जोड़ें।"
                      : "Select materials from a stage and add them to your estimate."
                  }
                </p>

                <button
                  type="button"
                  class="primary"
                  data-page-action="home"
                >
                  ${esc(t("home"))}
                </button>
              </div>
            `
        }

      </section>
    `;

    saveState();
  }

  function renderEstimateItem(
    item,
    index
  ) {
    const optionText =
      item.options
        ? Object.entries(item.options)
            .filter(
              ([, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
            )
            .map(
              ([key, value]) =>
                `${esc(text(key))}: ${esc(text(value))}`
            )
            .join(" • ")
        : "";

    const lineTotal =
      Number(item.quantity || 0) *
      Number(item.price || 0);

    return `
      <article class="estimateItem">

        <div class="estimateItemHead">

          <div>
            <span class="estimateNo">
              ${index + 1}
            </span>

            <div>
              <strong>
                ${esc(text(item.materialName))}
              </strong>

              <small>
                ${esc(
                  text(
                    item.stageName || ""
                  )
                )}
                ${
                  item.groupName
                    ? ` • ${esc(
                        text(
                          item.groupName
                        )
                      )}`
                    : ""
                }
              </small>
            </div>
          </div>

          <div class="itemActions">

            <button
              type="button"
              data-edit-estimate="${attr(item.id)}"
              title="${esc(t("update"))}"
            >
              ✎
            </button>

            <button
              type="button"
              data-delete-estimate="${attr(item.id)}"
              title="${esc(t("delete"))}"
            >
              ×
            </button>

          </div>

        </div>

        ${
          optionText
            ? `
              <div class="estimateOptions">
                ${optionText}
              </div>
            `
            : ""
        }

        <div class="estimateMeta">

          <span>
            ${esc(t("quantity"))}:
            <b>${esc(item.quantity)}</b>
          </span>

          <span>
            ${esc(t("unit"))}:
            <b>${esc(item.unit || "")}</b>
          </span>

          ${
            item.brand
              ? `
                <span>
                  ${esc(t("brand"))}:
                  <b>${esc(
                    text(item.brand)
                  )}</b>
                </span>
              `
              : ""
          }

          ${
            item.price !== "" &&
            item.price !== null &&
            item.price !== undefined
              ? `
                <span>
                  ${esc(t("price"))}:
                  <b>₹${formatNumber(
                    item.price
                  )}</b>
                </span>

                ${
                  lineTotal
                    ? `
                      <span>
                        ${esc(t("total"))}:
                        <b>
                          ₹${formatNumber(
                            lineTotal
                          )}
                        </b>
                      </span>
                    `
                    : ""
                }
              `
              : ""
          }

        </div>

      </article>
    `;
  }

  /* =======================================================
     EDIT EXISTING ESTIMATE
     ======================================================= */

  function editEstimate(id) {
    const items =
      getEstimate();

    const existing =
      items.find(
        item => item.id === id
      );

    if (!existing) return;

    if (
      !getItem(
        existing.stageIndex,
        existing.groupIndex,
        existing.itemIndex
      )
    ) {
      toast(
        state.language === "hi"
          ? "मटेरियल नहीं मिला"
          : "Material not found"
      );
      return;
    }

    state.page = "estimate";

    state.stageIndex =
      existing.stageIndex;

    state.groupIndex =
      existing.groupIndex;

    state.itemIndex =
      existing.itemIndex;

    state.editor =
      createEditor(
        existing.stageIndex,
        existing.groupIndex,
        existing.itemIndex,
        existing
      );

    renderItemEditorPage();
    focusTop();
  }

  function renderItemEditorPage() {
    main.innerHTML =
      renderItemEditor();

    bindDynamicEvents();
  }

  /* =======================================================
     DELETE ESTIMATE ITEM
     ======================================================= */

  function deleteEstimate(id) {
    const items =
      getEstimate();

    const index =
      items.findIndex(
        item => item.id === id
      );

    if (index < 0) return;

    items.splice(index, 1);

    saveEstimate(items);

    toast(t("deleted"));

    renderEstimate();
  }

  function clearEstimate() {
    const items =
      getEstimate();

    if (!items.length) return;

    const ok =
      window.confirm(
        state.language === "hi"
          ? "क्या पूरा एस्टिमेट डिलीट करना है?"
          : "Delete the complete estimate?"
      );

    if (!ok) return;

    saveEstimate([]);

    toast(t("deleted"));

    renderEstimate();
  }

  /* =======================================================
     CALCULATOR
     ======================================================= */

  function renderCalculator() {
    return `
      <section class="page calculatorPage">

        <div class="stageHead">

          <div>
            <span class="eyebrow">
              ${esc(t("calculator"))}
            </span>

            <h2>
              ${esc(t("calculatorTitle"))}
            </h2>
          </div>

        </div>

        <div class="calculatorGrid">

          ${calculatorCard(
            "power",
            "P = V × I",
            t("power"),
            t("voltage"),
            t("current")
          )}

          ${calculatorCard(
            "voltage",
            "V = P ÷ I",
            t("voltage"),
            t("power"),
            t("current")
          )}

          ${calculatorCard(
            "current",
            "I = P ÷ V",
            t("current"),
            t("power"),
            t("voltage")
          )}

          ${calculatorCard(
            "resistance",
            "R = V ÷ I",
            t("resistance"),
            t("voltage"),
            t("current")
          )}

        </div>

        <div class="calculatorCard inverterCard">

          <h3>
            ${
              state.language === "hi"
                ? "इन्वर्टर वोल्टेज"
                : "Inverter Voltage"
            }
          </h3>

          <div class="choices">

            <button
              type="button"
              class="choice active"
              data-inverter="12"
            >
              12V DC → 230V AC
            </button>

            <button
              type="button"
              class="choice"
              data-inverter="24"
            >
              24V DC → 230V AC
            </button>

          </div>

          <div id="inverterResult" class="calcResult">
            12V DC → 230V AC
          </div>

        </div>

      </section>
    `;
  }

  function calculatorCard(
    type,
    formula,
    title,
    firstLabel,
    secondLabel
  ) {
    return `
      <div
        class="calculatorCard"
        data-calc-card="${attr(type)}"
      >

        <div class="calcFormula">
          ${esc(formula)}
        </div>

        <h3>
          ${esc(title)}
        </h3>

        <label>
          ${esc(firstLabel)}
          <input
            type="number"
            step="any"
            inputmode="decimal"
            data-calc-first
          >
        </label>

        <label>
          ${esc(secondLabel)}
          <input
            type="number"
            step="any"
            inputmode="decimal"
            data-calc-second
          >
        </label>

        <button
          type="button"
          class="primary"
          data-calculate="${attr(type)}"
        >
          ${esc(t("calculate"))}
        </button>

        <div
          class="calcResult"
          data-calc-result
        >
          —
        </div>

      </div>
    `;
  }

  function calculate(
    type,
    card
  ) {
    const first =
      Number(
        $(
          "[data-calc-first]",
          card
        )?.value
      );

    const second =
      Number(
        $(
          "[data-calc-second]",
          card
        )?.value
      );

    let result = null;

    if (
      !Number.isFinite(first) ||
      !Number.isFinite(second)
    ) {
      return;
    }

    if (type === "power") {
      result =
        first * second;
    }

    if (type === "voltage") {
      if (second === 0) return;

      result =
        first / second;
    }

    if (type === "current") {
      if (second === 0) return;

      result =
        first / second;
    }

    if (type === "resistance") {
      if (second === 0) return;

      result =
        first / second;
    }

    const output =
      $(
        "[data-calc-result]",
        card
      );

    if (output) {
      output.textContent =
        Number.isFinite(result)
          ? formatNumber(result)
          : "—";
    }
  }

  /* =======================================================
     SETTINGS
     ======================================================= */

  function renderSettings() {
    return `
      <section class="page settingsPage">

        <div class="stageHead">

          <div>
            <span class="eyebrow">
              ${esc(t("settings"))}
            </span>

            <h2>
              ${
                state.language === "hi"
                  ? "ऐप सेटिंग्स"
                  : "App Settings"
              }
            </h2>
          </div>

        </div>

        <div class="settingsCard">

          <div class="settingRow">
            <div>
              <strong>
                ${esc(t("language"))}
              </strong>

              <small>
                ${
                  state.language === "hi"
                    ? "Hindi / English"
                    : "हिंदी / English"
                }
              </small>
            </div>

            <button
              type="button"
              class="secondary"
              id="settingsLangBtn"
            >
              ${
                state.language === "hi"
                  ? "हिंदी"
                  : "English"
              }
            </button>
          </div>

          <div class="settingRow">
            <div>
              <strong>
                ${esc(t("theme"))}
              </strong>

              <small>
                ${
                  state.theme === "dark"
                    ? esc(t("dark"))
                    : esc(t("light"))
                }
              </small>
            </div>

            <button
              type="button"
              class="secondary"
              id="settingsThemeBtn"
            >
              ${
                state.theme === "dark"
                  ? "☀️"
                  : "🌙"
              }
            </button>
          </div>

          <div class="settingRow">
            <div>
              <strong>
                ${esc(t("viewMode"))}
              </strong>

              <small>
                ${esc(
                  viewLabel(
                    state.materialView
                  )
                )}
              </small>
            </div>

            ${renderViewSelector("material")}
          </div>

        </div>

        <div class="settingsInfo">
          <strong>Sandeep ElectroFix</strong>
          <span>Powering Your Trust</span>
        </div>

      </section>
    `;
  }

  /* =======================================================
     CURRENT PAGE
     ======================================================= */

  function renderCurrentPage() {
    if (!main) return;

    applyLanguageButton();
    applyTheme();

    if (
      state.page === "estimate"
    ) {
      renderEstimate();
      bindDynamicEvents();
      updateNav();
      return;
    }

    let html = "";

    if (state.page === "home") {
      html = renderHome();
    }

    if (state.page === "calculator") {
      html = renderCalculator();
    }

    if (state.page === "settings") {
      html = renderSettings();
    }

    if (
      state.page === "estimate"
    ) {
      renderEstimate();
      bindDynamicEvents();
      updateNav();
      return;
    }

    if (
      state.page === "home" &&
      state.search.trim()
    ) {
      html = renderSearchPage();
    }

    if (
      state.stageIndex !== null &&
      state.page === "home"
    ) {
      html = renderStagePage();
    }

    main.innerHTML = html;

    bindDynamicEvents();
    updateNav();
  }

  function renderStageOrMaterial() {
    renderCurrentPage();
  }

  /* =======================================================
     NAV ACTIVE STATE
     ======================================================= */

  function updateNav() {
    $$(
      "[data-page]",
      document
    ).forEach(button => {

      const page =
        button.dataset.page;

      button.classList.toggle(
        "active",
        page === state.page
      );
    });
  }

  /* =======================================================
     TOAST
     ======================================================= */

  function toast(message) {
    let element =
      $("#appToast");

    if (!element) {
      element =
        document.createElement("div");

      element.id = "appToast";
      element.className = "toast";

      document.body.appendChild(
        element
      );
    }

    element.textContent =
      message;

    element.classList.add("show");

    clearTimeout(
      toast.timer
    );

    toast.timer =
      setTimeout(() => {
        element.classList.remove(
          "show"
        );
      }, 1800);
  }

  /* =======================================================
     FORMAT
     ======================================================= */

  function formatNumber(value) {
    const number =
      Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    );
  }

  /* =======================================================
     EVENT BINDING
     ======================================================= */

  function bindBaseEvents() {

    if (menuBtn) {
      menuBtn.addEventListener(
        "click",
        toggleDrawer
      );
    }

    if (closeMenuBtn) {
      closeMenuBtn.addEventListener(
        "click",
        closeDrawer
      );
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener(
        "click",
        closeDrawer
      );
    }

    if (langBtn) {
      langBtn.addEventListener(
        "click",
        toggleLanguage
      );
    }

    if (themeBtn) {
      themeBtn.addEventListener(
        "click",
        toggleTheme
      );
    }

    $$("#drawer [data-page]").forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            go(
              button.dataset.page
            );
          }
        );
      }
    );

    $$("#bottomNav [data-page]").forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            go(
              button.dataset.page
            );
          }
        );
      }
    );

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {
          if (state.menuOpen) {
            closeDrawer();
            return;
          }

          if (
            state.editor ||
            state.itemIndex !== null ||
            state.groupIndex !== null ||
            state.stageIndex !== null
          ) {
            goBackInsideApp();
          }
        }
      }
    );

    window.addEventListener(
      "popstate",
      () => {
        if (
          !goBackInsideApp()
        ) {
          if (
            window.confirm(
              t("leaveWarning")
            )
          ) {
            window.history.go(-1);
          } else {
            window.history.pushState(
              {
                sandeepEstimateApp: true
              },
              "",
              window.location.href
            );
          }
        }
      }
    );
  }

  function bindDynamicEvents() {

    /* -----------------------------------------
       Page navigation
       ----------------------------------------- */

    $$("[data-page-action]").forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            go(
              button.dataset.pageAction
            );
          }
        );
      }
    );

    /* -----------------------------------------
       Back
       ----------------------------------------- */

    $$("[data-action='back']").forEach(
      button => {
        button.addEventListener(
          "click",
          goBackInsideApp
        );
      }
    );

    /* -----------------------------------------
       Stage cards
       ----------------------------------------- */

    $$("[data-stage-index]").forEach(
      card => {
        card.addEventListener(
          "click",
          () => {

            const index =
              Number(
                card.dataset.stageIndex
              );

            if (
              !Number.isInteger(index)
            ) {
              return;
            }

            state.stageIndex =
              index;

            state.groupIndex = null;
            state.itemIndex = null;
            state.editor = null;

            saveState();

            renderCurrentPage();

            focusTop();
          }
        );
      }
    );

    /* -----------------------------------------
       Group cards
       ----------------------------------------- */

    $$("[data-group-index]").forEach(
      card => {
        card.addEventListener(
          "click",
          () => {

            const index =
              Number(
                card.dataset.groupIndex
              );

            if (
              !Number.isInteger(index)
            ) {
              return;
            }

            state.groupIndex =
              index;

            state.itemIndex = null;
            state.editor = null;

            saveState();

            renderCurrentPage();

            focusTop();
          }
        );
      }
    );

    /* -----------------------------------------
       Material cards
       ----------------------------------------- */

    $$("[data-item-index]").forEach(
      card => {
        card.addEventListener(
          "click",
          () => {

            const index =
              Number(
                card.dataset.itemIndex
              );

            if (
              !Number.isInteger(index)
            ) {
              return;
            }

            state.itemIndex =
              index;

            state.editor = null;

            saveState();

            renderCurrentPage();

            focusTop();
          }
        );
      }
    );

    /* -----------------------------------------
       Search
       ----------------------------------------- */

    const search =
      $("#globalSearch");

    if (search) {

      search.addEventListener(
        "input",
        () => {

          state.search =
            search.value;

          const clear =
            $("#clearSearch");

          if (
            clear &&
            state.search
          ) {
            clear.style.display =
              "block";
          }

          if (
            !state.search
          ) {
            renderCurrentPage();
            return;
          }

          main.innerHTML =
            renderSearchPage();

          bindDynamicEvents();
        }
      );
    }

    const clearSearch =
      $("#clearSearch");

    if (clearSearch) {
      clearSearch.addEventListener(
        "click",
        () => {

          state.search = "";

          renderCurrentPage();

          const input =
            $("#globalSearch");

          input?.focus();
        }
      );
    }

    /* -----------------------------------------
       Search result
       ----------------------------------------- */

    $$(
      "[data-search-stage]"
    ).forEach(
      card => {

        card.addEventListener(
          "click",
          () => {

            state.stageIndex =
              Number(
                card.dataset.searchStage
              );

            state.groupIndex =
              Number(
                card.dataset.searchGroup
              );

            state.itemIndex =
              Number(
                card.dataset.searchItem
              );

            state.search = "";

            state.editor = null;

            saveState();

            renderCurrentPage();

            focusTop();
          }
        );
      }
    );

    /* -----------------------------------------
       View selector open / close
       ----------------------------------------- */

    $$(".viewSelectorHead").forEach(
      button => {

        button.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            const selector =
              button.closest(
                ".viewSelector"
              );

            if (!selector) return;

            const isOpen =
              selector.classList.contains(
                "open"
              );

            $$(".viewSelector.open").forEach(
              item => {
                item.classList.remove(
                  "open"
                );

                const head =
                  $(".viewSelectorHead", item);

                head?.setAttribute(
                  "aria-expanded",
                  "false"
                );
              }
            );

            if (!isOpen) {
              selector.classList.add(
                "open"
              );

              button.setAttribute(
                "aria-expanded",
                "true"
              );
            }
          }
        );
      }
    );

    $$(".viewOption").forEach(
      option => {

        option.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            const type =
              option.dataset.viewType;

            const view =
              option.dataset.view;

            setView(
              type,
              view
            );
          }
        );
      }
    );

    /* -----------------------------------------
       Close view selector outside
       ----------------------------------------- */

    document.addEventListener(
      "click",
      closeViewSelectors
    );

    /* -----------------------------------------
       Save material
       ----------------------------------------- */

    const saveMaterial =
      $("#saveMaterialBtn");

    if (saveMaterial) {
      saveMaterial.addEventListener(
        "click",
        saveCurrentMaterial
      );
    }

    /* -----------------------------------------
       Next material
       ----------------------------------------- */

    const nextMaterialBtn =
      $("#nextMaterialBtn");

    if (nextMaterialBtn) {
      nextMaterialBtn.addEventListener(
        "click",
        nextMaterial
      );
    }

    /* -----------------------------------------
       Quantity
       ----------------------------------------- */

    $$("[data-qty]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const input =
              $("#materialQuantity");

            if (!input) return;

            let value =
              Number(input.value);

            if (!Number.isFinite(value)) {
              value = 0;
            }

            value +=
              Number(
                button.dataset.qty
              );

            if (value < 0) {
              value = 0;
            }

            input.value =
              value;

            if (state.editor) {
              state.editor.quantity =
                value;
            }
          }
        );
      }
    );

    $$("[data-qty-set]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const input =
              $("#materialQuantity");

            if (!input) return;

            input.value =
              button.dataset.qtySet;

            if (state.editor) {
              state.editor.quantity =
                input.value;
            }
          }
        );
      }
    );

    /* -----------------------------------------
       Quantity input
       ----------------------------------------- */

    const quantity =
      $("#materialQuantity");

    if (quantity) {
      quantity.addEventListener(
        "input",
        () => {

          if (!state.editor) return;

          state.editor.quantity =
            quantity.value;
        }
      );
    }

    /* -----------------------------------------
       Option changes
       ----------------------------------------- */

    $$("[data-option-name]").forEach(
      select => {

        select.addEventListener(
          "change",
          () => {

            if (!state.editor) return;

            state.editor.options[
              select.dataset.optionName
            ] = select.value;

            renderCurrentPage();
          }
        );
      }
    );

    /* -----------------------------------------
       Unit / Brand
       ----------------------------------------- */

    const unit =
      $("#materialUnit");

    if (unit) {
      unit.addEventListener(
        "change",
        () => {

          if (!state.editor) return;

          state.editor.unit =
            unit.value;

          renderCurrentPage();
        }
      );
    }

    const brand =
      $("#materialBrand");

    if (brand) {
      brand.addEventListener(
        "change",
        () => {

          if (!state.editor) return;

          state.editor.brand =
            brand.value;

          renderCurrentPage();
        }
      );
    }

    /* -----------------------------------------
       Price
       ----------------------------------------- */

    const priceToggle =
      $("#priceToggle");

    if (priceToggle) {
      priceToggle.addEventListener(
        "click",
        () => {

          if (!state.editor) return;

          state.editor.priceVisible =
            !state.editor.priceVisible;

          renderCurrentPage();
        }
      );
    }

    const price =
      $("#materialPrice");

    if (price) {
      price.addEventListener(
        "input",
        () => {

          if (!state.editor) return;

          state.editor.price =
            price.value;
        }
      );
    }

    /* -----------------------------------------
       Field clear buttons
       ----------------------------------------- */

    $$("[data-clear-field]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const field =
              button.dataset.clearField;

            if (!state.editor) return;

            state.editor[field] = "";

            renderCurrentPage();
          }
        );
      }
    );

    $$("[data-clear-option]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const name =
              button.dataset.clearOption;

            if (!state.editor) return;

            state.editor.options[name] =
              "";

            renderCurrentPage();
          }
        );
      }
    );

    /* -----------------------------------------
       Estimate edit
       ----------------------------------------- */

    $$("[data-edit-estimate]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {
            editEstimate(
              button.dataset.editEstimate
            );
          }
        );
      }
    );

    /* -----------------------------------------
       Estimate delete
       ----------------------------------------- */

    $$("[data-delete-estimate]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.deleteEstimate;

            const ok =
              window.confirm(
                state.language === "hi"
                  ? "इस आइटम को डिलीट करें?"
                  : "Delete this item?"
              );

            if (ok) {
              deleteEstimate(id);
            }
          }
        );
      }
    );

    /* -----------------------------------------
       Clear estimate
       ----------------------------------------- */

    const clearEstimateBtn =
      $("#clearEstimateBtn");

    if (clearEstimateBtn) {
      clearEstimateBtn.addEventListener(
        "click",
        clearEstimate
      );
    }

    /* -----------------------------------------
       Calculator
       ----------------------------------------- */

    $$("[data-calculate]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const card =
              button.closest(
                "[data-calc-card]"
              );

            if (!card) return;

            calculate(
              button.dataset.calculate,
              card
            );
          }
        );
      }
    );

    $$("[data-inverter]").forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            $$("[data-inverter]").forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );

            button.classList.add(
              "active"
            );

            const result =
              $("#inverterResult");

            if (result) {
              result.textContent =
                `${button.dataset.inverter}V DC → 230V AC`;
            }
          }
        );
      }
    );

    /* -----------------------------------------
       Settings
       ----------------------------------------- */

    const settingsLang =
      $("#settingsLangBtn");

    if (settingsLang) {
      settingsLang.addEventListener(
        "click",
        toggleLanguage
      );
    }

    const settingsTheme =
      $("#settingsThemeBtn");

    if (settingsTheme) {
      settingsTheme.addEventListener(
        "click",
        toggleTheme
      );
    }
  }

  function closeViewSelectors(event) {

    if (
      event.target.closest(
        ".viewSelector"
      )
    ) {
      return;
    }

    $$(".viewSelector.open").forEach(
      selector => {

        selector.classList.remove(
          "open"
        );

        const head =
          $(".viewSelectorHead", selector);

        head?.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    );
  }

  /* =======================================================
     INITIAL STATE
     ======================================================= */

  function normalizeState() {

    if (
      state.stageIndex !== null &&
      !getStage(state.stageIndex)
    ) {
      state.stageIndex = null;
      state.groupIndex = null;
      state.itemIndex = null;
    }

    if (
      state.stageIndex !== null &&
      state.groupIndex !== null &&
      !getGroup(
        state.stageIndex,
        state.groupIndex
      )
    ) {
      state.groupIndex = null;
      state.itemIndex = null;
    }

    if (
      state.stageIndex !== null &&
      state.groupIndex !== null &&
      state.itemIndex !== null &&
      !getItem(
        state.stageIndex,
        state.groupIndex,
        state.itemIndex
      )
    ) {
      state.itemIndex = null;
    }
  }

  /* =======================================================
     INIT
     ======================================================= */

  function init() {

    if (!main) {
      console.error(
        "Sandeep ElectroFix: #main not found."
      );
      return;
    }

    loadSavedState();

    normalizeState();

    applyTheme();
    applyLanguageButton();

    /*
      Create one browser history entry.
      This allows Android/browser back to be
      handled inside the app before leaving it.
    */
    try {
      window.history.replaceState(
        {
          sandeepEstimateApp: true
        },
        "",
        window.location.href
      );

      window.history.pushState(
        {
          sandeepEstimateApp: true
        },
        "",
        window.location.href
      );
    } catch (error) {
      console.warn(
        "History setup failed:",
        error
      );
    }

    bindBaseEvents();

    renderCurrentPage();

    state.initialized = true;

    console.log(
      "Sandeep ElectroFix Estimate List loaded.",
      {
        stages: MATERIAL_DATA.length,
        language: state.language,
        theme: state.theme,
        materialView: state.materialView
      }
    );
  }

  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }

})();
