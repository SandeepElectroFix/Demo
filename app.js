/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   MATCHED WITH CURRENT material.js

   material.js structure:

   window.MATERIALS = [
     [
       "STAGE 1",
       "Stage Name",
       "Category",
       [ item list ],
       [ "Group Name", [ items ] ],
       ...
     ],
     ...
   ];

   IMPORTANT:
   - material.js is NOT modified
   - Stage 1 to Stage 5 supported
   - Group/category supported
   - 10 material views supported
   - Hindi / English UI
   - Estimate storage
   - Dark / Light
   - Search
   - Stage navigation
   - Item editor
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIG
     ======================================================= */

  const CFG = window.APP_CONFIG || window.AppConfig || {
    appName: "Estimate List",
    appNameHi: "एस्टिमेट लिस्ट",
    businessName: "Sandeep ElectroFix",
    tagline: "Powering Your Trust",

    defaultLanguage: "hi",

    storageKey: "sandeepEstimateItems",
    languageKey: "sandeepMaterialLang",
    themeKey: "sandeepTheme",
    viewKey: "sandeepMaterialView"
  };

  /* =======================================================
     DOM
     ======================================================= */

  const main = document.getElementById("main");

  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const closeMenu = document.getElementById("closeMenu");

  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = themeBtn
    ? themeBtn.querySelector(".themeIcon")
    : null;

  const langBtn = document.getElementById("langBtn");

  const bottomNav = document.getElementById("bottomNav");

  if (!main) {
    console.error("Sandeep ElectroFix: #main not found.");
    return;
  }

  /* =======================================================
     MATERIAL DATA CHECK
     ======================================================= */

  const RAW_MATERIALS = Array.isArray(window.MATERIALS)
    ? window.MATERIALS
    : [];

  if (!RAW_MATERIALS.length) {
    console.error(
      "Sandeep ElectroFix: window.MATERIALS is empty or missing."
    );
  }

  /* =======================================================
     STATE
     ======================================================= */

  const state = {
    page: "home",
    stageIndex: null,
    itemIndex: null,
    selectedItem: null,

    language: loadLanguage(),
    theme: loadTheme(),
    view: loadView(),

    search: "",
    drawerOpen: false,
    viewSelectorOpen: false,

    estimateItems: loadEstimate(),

    history: []
  };

  /* =======================================================
     STORAGE
     ======================================================= */

  function safeGet(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }

  function loadLanguage() {
    const saved = safeGet(
      CFG.languageKey || "sandeepMaterialLang",
      CFG.defaultLanguage || "hi"
    );

    return saved === "en" ? "en" : "hi";
  }

  function loadTheme() {
    const saved = safeGet(
      CFG.themeKey || "sandeepTheme",
      CFG.theme?.default || "dark"
    );

    return saved === "light" ? "light" : "dark";
  }

  function loadView() {
    const allowed = [
      "grid",
      "list",
      "compact",
      "large",
      "mini",
      "twoColumn",
      "horizontal",
      "iconList",
      "timeline",
      "dense"
    ];

    const saved = safeGet(
      CFG.viewKey || "sandeepMaterialView",
      "grid"
    );

    return allowed.includes(saved) ? saved : "grid";
  }

  function loadEstimate() {
    try {
      const raw = localStorage.getItem(
        CFG.storageKey || "sandeepEstimateItems"
      );

      if (!raw) return [];

      const parsed = JSON.parse(raw);

      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveEstimate() {
    safeSet(
      CFG.storageKey || "sandeepEstimateItems",
      JSON.stringify(state.estimateItems)
    );
  }

  /* =======================================================
     TEXT / TRANSLATION
     ======================================================= */

  const UI = {
    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",

      search: "Search material",
      chooseView: "Choose View",
      stage: "Stage",
      materials: "Materials",
      back: "Back",

      add: "Add to Estimate",
      update: "Update Estimate",
      next: "Next",
      previous: "Previous",

      quantity: "Quantity",
      unit: "Unit",
      brand: "Brand",

      select: "Select",
      required: "Required",
      optional: "Optional",

      noMaterials: "No materials found.",
      noSearch: "No material found for this search.",

      estimateEmpty: "No items added yet.",
      clearEstimate: "Clear Estimate",

      calculatorTitle: "Electrical Calculator",
      settingsTitle: "Settings",

      dark: "Dark",
      light: "Light",

      saved: "Added to Estimate",
      updated: "Estimate Updated",

      stage1: "Slab Conduit Installation",
      stage2: "Wall Conduit Installation",
      stage3: "Wiring Installation",
      stage4: "Final Electrical Fittings",
      stage5: "False Ceiling Wiring Material"
    },

    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",

      search: "सामग्री खोजें",
      chooseView: "व्यू चुनें",
      stage: "स्टेज",
      materials: "सामग्री",
      back: "वापस",

      add: "एस्टिमेट में जोड़ें",
      update: "एस्टिमेट अपडेट करें",
      next: "अगला",
      previous: "पिछला",

      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",

      select: "चुनें",
      required: "जरूरी",
      optional: "वैकल्पिक",

      noMaterials: "कोई सामग्री नहीं मिली।",
      noSearch: "इस खोज के लिए कोई सामग्री नहीं मिली।",

      estimateEmpty: "अभी कोई आइटम नहीं जोड़ा गया।",
      clearEstimate: "एस्टिमेट साफ करें",

      calculatorTitle: "इलेक्ट्रिकल कैलकुलेटर",
      settingsTitle: "सेटिंग्स",

      dark: "डार्क",
      light: "लाइट",

      saved: "एस्टिमेट में जोड़ा गया",
      updated: "एस्टिमेट अपडेट किया गया",

      stage1: "स्लैब कंड्यूट इंस्टॉलेशन",
      stage2: "वॉल कंड्यूट इंस्टॉलेशन",
      stage3: "वायरिंग इंस्टॉलेशन",
      stage4: "फाइनल इलेक्ट्रिकल फिटिंग्स",
      stage5: "फॉल्स सीलिंग वायरिंग मटेरियल"
    }
  };

  function t(key) {
    return UI[state.language]?.[key] ||
      UI.en[key] ||
      key;
  }

  function bilingual(en, hi) {
    return state.language === "hi"
      ? `${hi || en} / ${en}`
      : en;
  }

  /* =======================================================
     HINDI MATERIAL TRANSLATIONS
     ======================================================= */

  const MATERIAL_HI = {
    "Pipe": "पाइप",
    "Bend": "बेंड",
    "Junction Box": "जंक्शन बॉक्स",
    "Fan Box": "फैन बॉक्स",
    "Concealed Light Box": "कंसील्ड लाइट बॉक्स",

    "Tape (Shuttering & Joint Sealing)": "शटरिंग एवं जॉइंट सीलिंग टेप",
    "Solvent Cement": "सॉल्वेंट सीमेंट",
    "Neel Powder (Marking Powder)": "नील पाउडर",
    "Binding Wire": "बाइंडिंग वायर",
    "Cable Tie / Zip Tie": "केबल टाई / जिप टाई",

    "Modular Board (Concealed Metal/PVC Box)": "मॉड्यूलर बोर्ड",
    "MCB Box (Distribution Board)": "एमसीबी बॉक्स",

    "Tape (Masking & Plaster Protection)": "मास्किंग एवं प्लास्टर प्रोटेक्शन टेप",
    "Cable Clip": "केबल क्लिप",

    "Wire": "वायर",
    "Flexible Pipe": "फ्लेक्सिबल पाइप",
    "Electrical Tape": "इलेक्ट्रिकल टेप",
    "Fastener": "फास्टनर",
    "Steel Wire / Spring Wire (Fish Tape)": "स्टील वायर / स्प्रिंग वायर",

    "Switch Plate": "स्विच प्लेट",
    "Switch Board (Surface Gang Box)": "स्विच बोर्ड",
    "Switch": "स्विच",
    "Socket": "सॉकेट",
    "Fan Regulator": "फैन रेगुलेटर",
    "2 Way Switch": "2 वे स्विच",
    "Bell Push": "बेल पुश",
    "Neon Indicator": "नियॉन इंडिकेटर",
    "Blank Plate / Dummy Switch": "ब्लैंक प्लेट / डमी स्विच",
    "DP Switch (Double Pole Switch)": "डीपी स्विच",

    "Mini MCB": "मिनी एमसीबी",
    "SP MCB (Single Pole)": "एसपी एमसीबी",
    "DP MCB (Double Pole)": "डीपी एमसीबी",
    "TPN MCB (Three Pole with Neutral)": "टीपीएन एमसीबी",
    "MCB Changeover": "एमसीबी चेंजओवर",
    "DP Isolator": "डीपी आइसोलेटर",
    "TPN Isolator (3P / 4P)": "टीपीएन आइसोलेटर",
    "RCCB / RCD": "आरसीसीबी / आरसीडी",
    "MCB Box": "एमसीबी बॉक्स",
    "Kit Kat Fuse": "किटकैट फ्यूज",

    "Fan Sheet": "फैन शीट",
    "Round Sheet": "राउंड शीट",
    "Fan Rod": "फैन रॉड",
    "Fan Clamp": "फैन क्लैंप",
    "Holder": "होल्डर",
    "Ceiling Rose": "सीलिंग रोज",
    "Chain": "चेन",

    "LED Bulb": "एलईडी बल्ब",
    "LED Tube Light": "एलईडी ट्यूब लाइट",
    "Foot Light": "फुट लाइट",
    "Up Down Light": "अप डाउन लाइट",
    "Panel Light": "पैनल लाइट",
    "Surface Light": "सरफेस लाइट",
    "COB Light": "सीओबी लाइट",
    "COB Spot Light": "सीओबी स्पॉट लाइट",
    "Down Light": "डाउन लाइट",
    "Strip Light": "स्ट्रिप लाइट",
    "Rope Light": "रोप लाइट",
    "LED Profile Channel": "एलईडी प्रोफाइल चैनल",
    "LED Strip Driver (SMPS)": "एलईडी स्ट्रिप ड्राइवर",

    "Door Bell": "डोर बेल",
    "Tape (Mounting / Double Sided)": "माउंटिंग / डबल साइडेड टेप",
    "Instant Glue": "इंस्टेंट ग्लू",
    "Araldite Glue (Epoxy)": "अरालडाइट ग्लू",
    "POP (Plaster of Paris)": "पीओपी",
    "Putty Blade / Patta": "पुट्टी ब्लेड / पट्टा",
    "Screw": "स्क्रू",
    "Lug (Cable Terminal Lug)": "केबल लग",
    "Washer": "वॉशर",

    "Saddle (Pipe Clamp)": "सैडल / पाइप क्लैंप",
    "PVC Wall Plug / Gulli / Gitti": "पीवीसी वॉल प्लग / गुल्ली / गिट्टी"
  };

  const GROUP_HI = {
    "Conduit & Box": "कंड्यूट एवं बॉक्स",
    "Installation Material": "इंस्टॉलेशन सामग्री",
    "Wiring Material": "वायरिंग सामग्री",
    "Pulling Material": "पुलिंग सामग्री",
    "Switch & Socket": "स्विच एवं सॉकेट",
    "MCB & Protection": "एमसीबी एवं प्रोटेक्शन",
    "Fan & Ceiling": "फैन एवं सीलिंग",
    "Lighting": "लाइटिंग",
    "Installation & Finishing": "इंस्टॉलेशन एवं फिनिशिंग",
    "Wiring & Conduit": "वायरिंग एवं कंड्यूट",
    "Installation & Fastening": "इंस्टॉलेशन एवं फास्टनिंग"
  };

  function materialName(name) {
    if (state.language !== "hi") return name;

    return MATERIAL_HI[name]
      ? `${MATERIAL_HI[name]} / ${name}`
      : name;
  }

  function groupName(name) {
    if (state.language !== "hi") return name;

    return GROUP_HI[name]
      ? `${GROUP_HI[name]} / ${name}`
      : name;
  }

  /* =======================================================
     STAGE PARSER
     ======================================================= */

  function isMaterialItem(value) {
    return (
      Array.isArray(value) &&
      typeof value[0] === "string" &&
      Array.isArray(value[1]) &&
      Array.isArray(value[2]) &&
      Array.isArray(value[3])
    );
  }

  function isItemList(value) {
    return (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(isMaterialItem)
    );
  }

  function normalizeItem(item, stageIndex, sectionName) {
    return {
      name: item[0],
      fields: Array.isArray(item[1]) ? item[1] : [],
      units: Array.isArray(item[2]) ? item[2] : [],
      brands: Array.isArray(item[3]) ? item[3] : [],

      stageIndex,
      section: sectionName || ""
    };
  }

  function parseMaterials() {
    return RAW_MATERIALS.map((rawStage, stageIndex) => {
      if (!Array.isArray(rawStage)) {
        return {
          code: `STAGE ${stageIndex + 1}`,
          title: `Stage ${stageIndex + 1}`,
          category: "",
          sections: []
        };
      }

      const code = rawStage[0] || `STAGE ${stageIndex + 1}`;
      const title = rawStage[1] || code;
      const category = rawStage[2] || "";

      const sections = [];

      /*
        First material array:
        [
          ["Pipe", ...],
          ["Bend", ...]
        ]
      */

      if (isItemList(rawStage[3])) {
        sections.push({
          name: category,
          items: rawStage[3].map(item =>
            normalizeItem(item, stageIndex, category)
          )
        });
      }

      /*
        Other arrays:
        [
          "Installation Material",
          [
            ["Tape", ...],
            ...
          ]
        ]
      */

      for (let i = 4; i < rawStage.length; i++) {
        const part = rawStage[i];

        if (
          Array.isArray(part) &&
          typeof part[0] === "string" &&
          isItemList(part[1])
        ) {
          sections.push({
            name: part[0],
            items: part[1].map(item =>
              normalizeItem(item, stageIndex, part[0])
            )
          });
        }
      }

      return {
        code,
        title,
        category,
        sections
      };
    });
  }

  const STAGES = parseMaterials();

  /* =======================================================
     ALL MATERIALS
     ======================================================= */

  function getAllItems() {
    const all = [];

    STAGES.forEach(stage => {
      stage.sections.forEach(section => {
        section.items.forEach(item => {
          all.push({
            ...item,
            stageCode: stage.code,
            stageTitle: stage.title
          });
        });
      });
    });

    return all;
  }

  /* =======================================================
     VIEW MODES
     ======================================================= */

  const VIEW_MODES = [
    ["grid", "▦", "Grid"],
    ["list", "☷", "List"],
    ["compact", "▤", "Compact"],
    ["large", "▥", "Large"],
    ["mini", "▪", "Mini"],
    ["twoColumn", "▦", "2 Column"],
    ["horizontal", "▤", "Horizontal"],
    ["iconList", "☷", "Icon List"],
    ["timeline", "◫", "Timeline"],
    ["dense", "≡", "Dense"]
  ];

  function viewLabel(key) {
    const found = VIEW_MODES.find(v => v[0] === key);
    return found ? found[2] : "Grid";
  }

  function viewIcon(key) {
    const found = VIEW_MODES.find(v => v[0] === key);
    return found ? found[1] : "▦";
  }

  /* =======================================================
     STAGE TITLE
     ======================================================= */

  function stageTitle(stage, index) {
    const key = `stage${index + 1}`;

    return UI[state.language]?.[key] || stage.title;
  }

  /* =======================================================
     ESCAPE HTML
     ======================================================= */

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =======================================================
     DRAWER
     ======================================================= */

  function openDrawer() {
    if (!drawer) return;

    state.drawerOpen = true;

    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");

    if (drawerOverlay) {
      drawerOverlay.classList.add("show");
    }

    if (menuBtn) {
      menuBtn.classList.add("open");
      menuBtn.setAttribute("aria-expanded", "true");
    }
  }

  function closeDrawerFn() {
    if (!drawer) return;

    state.drawerOpen = false;

    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");

    if (drawerOverlay) {
      drawerOverlay.classList.remove("show");
    }

    if (menuBtn) {
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      state.drawerOpen ? closeDrawerFn() : openDrawer();
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener("click", closeDrawerFn);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawerFn);
  }

  if (drawer) {
    drawer.querySelectorAll("[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = btn.getAttribute("data-page");

        closeDrawerFn();
        navigate(page);
      });
    });
  }

  /* =======================================================
     THEME
     ======================================================= */

  function applyTheme() {
    document.body.dataset.theme = state.theme;

    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-pressed",
        state.theme === "light" ? "true" : "false"
      );
    }

    if (themeIcon) {
      themeIcon.textContent =
        state.theme === "light" ? "🌙" : "☀️";
    }

    safeSet(
      CFG.themeKey || "sandeepTheme",
      state.theme
    );
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      state.theme =
        state.theme === "dark"
          ? "light"
          : "dark";

      applyTheme();
    });
  }

  /* =======================================================
     LANGUAGE
     ======================================================= */

  function applyLanguage() {
    if (langBtn) {
      langBtn.textContent =
        state.language === "hi"
          ? "EN"
          : "हि";
    }

    safeSet(
      CFG.languageKey || "sandeepMaterialLang",
      state.language
    );

    renderCurrentPage();
  }

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      state.language =
        state.language === "hi"
          ? "en"
          : "hi";

      applyLanguage();
    });
  }

  /* =======================================================
     BOTTOM NAV
     ======================================================= */

  function updateBottomNav() {
    if (!bottomNav) return;

    bottomNav.querySelectorAll("[data-page]").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-page") === state.page
      );
    });
  }

  if (bottomNav) {
    bottomNav.querySelectorAll("[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        navigate(btn.getAttribute("data-page"));
      });
    });
  }

  /* =======================================================
     NAVIGATION
     ======================================================= */

  function navigate(page, push = true) {
    if (!page) page = "home";

    if (push && state.page !== page) {
      state.history.push({
        page: state.page,
        stageIndex: state.stageIndex,
        itemIndex: state.itemIndex
      });
    }

    state.page = page;

    if (page === "home") {
      state.stageIndex = null;
      state.itemIndex = null;
    }

    if (page === "estimate") {
      state.stageIndex = null;
      state.itemIndex = null;
    }

    renderCurrentPage();
    updateBottomNav();
    saveRoute();
  }

  /* =======================================================
     ROUTE STORAGE
     ======================================================= */

  function saveRoute() {
    safeSet(
      "sandeepEstimateRoute",
      JSON.stringify({
        page: state.page,
        stageIndex: state.stageIndex,
        itemIndex: state.itemIndex
      })
    );
  }

  function restoreRoute() {
    try {
      const raw = localStorage.getItem(
        "sandeepEstimateRoute"
      );

      if (!raw) return;

      const route = JSON.parse(raw);

      if (!route || !route.page) return;

      if (
        route.page === "home" ||
        route.page === "estimate" ||
        route.page === "calculator" ||
        route.page === "settings"
      ) {
        state.page = route.page;
      }

      if (
        Number.isInteger(route.stageIndex) &&
        route.stageIndex >= 0 &&
        route.stageIndex < STAGES.length
      ) {
        state.stageIndex = route.stageIndex;
      }

      if (Number.isInteger(route.itemIndex)) {
        state.itemIndex = route.itemIndex;
      }
    } catch (e) {
      console.warn("Route restore error:", e);
    }
  }

  /* =======================================================
     HOME PAGE
     ======================================================= */

  function renderHome() {
    main.innerHTML = `
      <section class="page homePage">

        <div class="hero">

          <div class="heroLogoWrap">
            <img
              class="heroLogo"
              src="logo.png"
              alt="Sandeep ElectroFix"
              onerror="this.style.display='none'"
            >
          </div>

          <h2>Sandeep ElectroFix</h2>

          <p>
            ${esc(CFG.tagline || "Powering Your Trust")}
          </p>

        </div>

        <div class="searchBox">
          <span>⌕</span>
          <input
            id="homeSearch"
            type="search"
            autocomplete="off"
            placeholder="${esc(t("search"))} / सामग्री खोजें"
            value="${esc(state.search)}"
          >
        </div>

        <div class="stageViewSelector">
          <button
            id="viewToggle"
            class="stageViewBtn"
            type="button"
            aria-expanded="false"
            title="${esc(t("chooseView"))}"
          >
            ${viewIcon(state.view)}
          </button>

          <div
            id="viewOptions"
            class="stageViewOptions"
            hidden
          >
            ${VIEW_MODES.map(v => `
              <button
                type="button"
                class="stageViewOption ${v[0] === state.view ? "active" : ""}"
                data-view="${esc(v[0])}"
              >
                <span>${v[1]}</span>
                <b>${v[2]}</b>
              </button>
            `).join("")}
          </div>
        </div>

        <div
          id="stageGrid"
          class="stageGrid ${esc(state.view)}"
        >
          ${renderStageCards()}
        </div>

      </section>
    `;

    const search = document.getElementById("homeSearch");

    if (search) {
      search.addEventListener("input", e => {
        state.search = e.target.value.trim().toLowerCase();
        renderStageCardsOnly();
      });
    }

    const viewToggle = document.getElementById("viewToggle");
    const viewOptions = document.getElementById("viewOptions");

    if (viewToggle && viewOptions) {
      viewToggle.addEventListener("click", () => {
        const open =
          !viewOptions.hasAttribute("hidden");

        if (open) {
          viewOptions.setAttribute("hidden", "");
        } else {
          viewOptions.removeAttribute("hidden");
        }

        viewToggle.setAttribute(
          "aria-expanded",
          String(!open)
        );
      });

      viewOptions.querySelectorAll("[data-view]").forEach(btn => {
        btn.addEventListener("click", () => {
          state.view = btn.dataset.view;

          safeSet(
            CFG.viewKey || "sandeepMaterialView",
            state.view
          );

          viewOptions.setAttribute("hidden", "");

          viewToggle.innerHTML = viewIcon(state.view);

          viewOptions
            .querySelectorAll("[data-view]")
            .forEach(x => {
              x.classList.toggle(
                "active",
                x.dataset.view === state.view
              );
            });

          renderStageCardsOnly();
        });
      });
    }

    bindStageCards();
  }

  /* =======================================================
     STAGE CARDS
     ======================================================= */

  function renderStageCardsOnly() {
    const grid = document.getElementById("stageGrid");

    if (!grid) return;

    grid.className =
      `stageGrid ${state.view}`;

    grid.innerHTML =
      renderStageCards();

    bindStageCards();
  }

  function renderStageCards() {
    if (!STAGES.length) {
      return `
        <div class="emptyState">
          <h3>Material List Not Found</h3>
          <p>
            window.MATERIALS is empty.
          </p>
        </div>
      `;
    }

    const query = state.search;

    return STAGES.map((stage, index) => {

      const total = stage.sections.reduce(
        (sum, section) =>
          sum + section.items.length,
        0
      );

      const matching = query
        ? stage.sections.reduce(
            (sum, section) =>
              sum +
              section.items.filter(item =>
                item.name
                  .toLowerCase()
                  .includes(query)
              ).length,
            0
          )
        : total;

      if (query && matching === 0) {
        return "";
      }

      return `
        <button
          type="button"
          class="stageCard"
          data-stage-index="${index}"
        >

          <div class="stageNumber">
            ${esc(stage.code)}
          </div>

          <div class="stageCardBody">

            <h3>
              ${esc(stageTitle(stage, index))}
            </h3>

            <p>
              ${esc(
                state.language === "hi"
                  ? stage.category
                    ? `${GROUP_HI[stage.category] || stage.category} / ${stage.category}`
                    : stage.category
                  : stage.category
              )}
            </p>

            <div class="stageMeta">
              <span>
                ${total} ${t("materials")}
              </span>

              <span>
                ${stage.sections.length} ${
                  state.language === "hi"
                    ? "ग्रुप"
                    : "Groups"
                }
              </span>
            </div>

          </div>

          <span class="stageArrow">›</span>

        </button>
      `;
    }).join("") || `
      <div class="emptyState">
        <h3>${esc(t("noSearch"))}</h3>
      </div>
    `;
  }

  function bindStageCards() {
    document
      .querySelectorAll("[data-stage-index]")
      .forEach(card => {
        card.addEventListener("click", () => {
          const index = Number(
            card.dataset.stageIndex
          );

          openStage(index);
        });
      });
  }

  /* =======================================================
     OPEN STAGE
     ======================================================= */

  function openStage(stageIndex) {
    if (
      !Number.isInteger(stageIndex) ||
      !STAGES[stageIndex]
    ) {
      return;
    }

    state.history.push({
      page: state.page,
      stageIndex: state.stageIndex,
      itemIndex: state.itemIndex
    });

    state.page = "stage";
    state.stageIndex = stageIndex;
    state.itemIndex = null;

    renderStage();
    saveRoute();
  }

  /* =======================================================
     STAGE PAGE
     ======================================================= */

  function renderStage() {
    const stage = STAGES[state.stageIndex];

    if (!stage) {
      navigate("home", false);
      return;
    }

    main.innerHTML = `
      <section class="page stagePage">

        <button
          id="stageBack"
          class="back"
          type="button"
        >
          ← ${esc(t("back"))}
        </button>

        <div class="stageHead">

          <div class="stageHeadNumber">
            ${esc(stage.code)}
          </div>

          <div>
            <h2>
              ${esc(stageTitle(stage, state.stageIndex))}
            </h2>

            <p>
              ${esc(
                state.language === "hi"
                  ? GROUP_HI[stage.category] || stage.category
                  : stage.category
              )}
            </p>
          </div>

        </div>

        <div class="stageSections">
          ${stage.sections.map(
            (section, sectionIndex) => `
              <section class="materialSection">

                <div class="sectionTitle">
                  <span>${sectionIndex + 1}</span>
                  <h3>
                    ${esc(groupName(section.name))}
                  </h3>
                </div>

                <div
                  class="itemGrid ${esc(state.view)}"
                  data-section="${sectionIndex}"
                >
                  ${section.items.map(
                    (item, itemIndex) =>
                      renderItemCard(
                        item,
                        sectionIndex,
                        itemIndex
                      )
                  ).join("")}
                </div>

              </section>
          `
          ).join("")}
        </div>

      </section>
    `;

    const back = document.getElementById("stageBack");

    if (back) {
      back.addEventListener("click", () => {
        goBack();
      });
    }

    bindItemCards();

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }

  /* =======================================================
     ITEM CARD
     ======================================================= */

  function renderItemCard(
    item,
    sectionIndex,
    itemIndex
  ) {
    const firstField =
      item.fields?.[0]?.[1]?.[0] || "";

    return `
      <button
        type="button"
        class="itemCard"
        data-section-index="${sectionIndex}"
        data-item-index="${itemIndex}"
      >

        <div class="itemIcon">
          ⚡
        </div>

        <div class="itemHead">
          <h3>
            ${esc(materialName(item.name))}
          </h3>

          <small>
            ${item.fields.length}
            ${
              state.language === "hi"
                ? " विकल्प"
                : " options"
            }
          </small>
        </div>

        <div class="itemPreview">
          ${
            firstField
              ? `${esc(item.fields[0][0])}: ${esc(firstField)}`
              : ""
          }
        </div>

        <span class="itemArrow">›</span>

      </button>
    `;
  }

  function bindItemCards() {
    document
      .querySelectorAll("[data-item-index]")
      .forEach(card => {
        card.addEventListener("click", () => {

          const sectionIndex =
            Number(card.dataset.sectionIndex);

          const itemIndex =
            Number(card.dataset.itemIndex);

          openItem(
            state.stageIndex,
            sectionIndex,
            itemIndex
          );
        });
      });
  }

  /* =======================================================
     OPEN ITEM
     ======================================================= */

  function openItem(
    stageIndex,
    sectionIndex,
    itemIndex
  ) {
    const stage = STAGES[stageIndex];

    if (!stage) return;

    const section = stage.sections[sectionIndex];

    if (!section) return;

    const item = section.items[itemIndex];

    if (!item) return;

    state.history.push({
      page: state.page,
      stageIndex: state.stageIndex,
      itemIndex: state.itemIndex
    });

    state.page = "item";
    state.stageIndex = stageIndex;
    state.itemIndex = itemIndex;

    state.selectedItem = {
      item,
      sectionIndex
    };

    renderItemEditor();
    saveRoute();
  }

  /* =======================================================
     ITEM EDITOR
     ======================================================= */

  function renderItemEditor(existingIndex = -1) {
    const stage = STAGES[state.stageIndex];

    if (!stage) return;

    const item =
      state.selectedItem?.item;

    if (!item) return;

    const sectionIndex =
      state.selectedItem.sectionIndex;

    const existing =
      existingIndex >= 0
        ? state.estimateItems[existingIndex]
        : null;

    const values =
      existing?.values || {};

    main.innerHTML = `
      <section class="page itemPage">

        <button
          id="itemBack"
          class="back"
          type="button"
        >
          ← ${esc(t("back"))}
        </button>

        <div class="stageHead">

          <div class="stageHeadNumber">
            ${esc(stage.code)}
          </div>

          <div>
            <h2>
              ${esc(materialName(item.name))}
            </h2>

            <p>
              ${esc(groupName(item.section))}
            </p>
          </div>

        </div>

        <form
          id="materialForm"
          class="materialForm"
          novalidate
        >

          <div class="formCard">

            ${renderFields(item, values)}

            ${renderQuantity(item, values)}

            ${renderUnit(item, values)}

            ${renderBrand(item, values)}

            <div class="editorButtons">

              <button
                type="submit"
                class="primary"
              >
                ${
                  existing
                    ? esc(t("update"))
                    : esc(t("add"))
                }
              </button>

              <button
                type="button"
                id="nextBtn"
                class="secondary"
              >
                ${esc(t("next"))} →
              </button>

            </div>

          </div>

        </form>

      </section>
    `;

    bindEditor(
      item,
      existingIndex
    );

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }

  /* =======================================================
     FIELDS
     ======================================================= */

  function renderFields(item, values) {
    return item.fields.map(
      (field, index) => {

        const label =
          field[0] || `Option ${index + 1}`;

        const options =
          Array.isArray(field[1])
            ? field[1]
            : [];

        const current =
          values[`field_${index}`] || "";

        return `
          <div class="field">

            <label>
              ${esc(label)}
              <span class="optional">
                ${esc(t("optional"))}
              </span>
            </label>

            <div class="choices">

              ${options.map(option => `
                <button
                  type="button"
                  class="choice ${
                    current === option
                      ? "selected"
                      : ""
                  }"
                  data-field="${index}"
                  data-value="${esc(option)}"
                >
                  ${esc(option)}
                </button>
              `).join("")}

            </div>

            <input
              type="hidden"
              id="field_${index}"
              name="field_${index}"
              value="${esc(current)}"
            >

          </div>
        `;
      }
    ).join("");
  }

  /* =======================================================
     QUANTITY
     ======================================================= */

  function renderQuantity(item, values) {
    const quantity =
      values.quantity || "";

    return `
      <div class="field quantityField">

        <label>
          ${esc(t("quantity"))}
          <span class="required">
            *
          </span>
        </label>

        <div class="qtyRow">

          <button
            type="button"
            class="qtyMinus"
            id="qtyMinus"
          >
            −
          </button>

          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0.01"
            step="0.01"
            inputmode="decimal"
            value="${esc(quantity)}"
            required
          >

          <button
            type="button"
            class="qtyPlus"
            id="qtyPlus"
          >
            +
          </button>

        </div>

      </div>
    `;
  }

  /* =======================================================
     UNIT
     ======================================================= */

  function renderUnit(item, values) {
    const unit =
      values.unit ||
      item.units?.[0] ||
      "";

    return `
      <div class="field">

        <label>
          ${esc(t("unit"))}
        </label>

        <div class="choices">

          ${
            item.units.map(u => `
              <button
                type="button"
                class="choice unitChoice ${
                  unit === u
                    ? "selected"
                    : ""
                }"
                data-unit="${esc(u)}"
              >
                ${esc(u)}
              </button>
            `).join("")
          }

        </div>

        <input
          type="hidden"
          id="unit"
          value="${esc(unit)}"
        >

      </div>
    `;
  }

  /* =======================================================
     BRAND
     ======================================================= */

  function renderBrand(item, values) {
    if (!item.brands?.length) {
      return "";
    }

    const brand =
      values.brand || "";

    return `
      <div class="field">

        <label>
          ${esc(t("brand"))}
          <span class="optional">
            ${esc(t("optional"))}
          </span>
        </label>

        <div class="choices">

          ${item.brands.map(b => `
            <button
              type="button"
              class="choice brandChoice ${
                brand === b
                  ? "selected"
                  : ""
              }"
              data-brand="${esc(b)}"
            >
              ${esc(b)}
            </button>
          `).join("")}

        </div>

        <input
          type="hidden"
          id="brand"
          value="${esc(brand)}"
        >

      </div>
    `;
  }

  /* =======================================================
     BIND EDITOR
     ======================================================= */

  function bindEditor(
    item,
    existingIndex
  ) {
    const form =
      document.getElementById(
        "materialForm"
      );

    const back =
      document.getElementById(
        "itemBack"
      );

    if (back) {
      back.addEventListener(
        "click",
        () => goBack()
      );
    }

    /*
      Field choices
    */

    document
      .querySelectorAll("[data-field]")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => {

            const index =
              btn.dataset.field;

            const hidden =
              document.getElementById(
                `field_${index}`
              );

            if (!hidden) return;

            hidden.value =
              btn.dataset.value || "";

            document
              .querySelectorAll(
                `[data-field="${index}"]`
              )
              .forEach(x => {
                x.classList.remove(
                  "selected"
                );
              });

            btn.classList.add(
              "selected"
            );
          }
        );
      });

    /*
      Unit
    */

    document
      .querySelectorAll(
        "[data-unit]"
      )
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => {

            const input =
              document.getElementById(
                "unit"
              );

            if (!input) return;

            input.value =
              btn.dataset.unit;

            document
              .querySelectorAll(
                "[data-unit]"
              )
              .forEach(x =>
                x.classList.remove(
                  "selected"
                )
              );

            btn.classList.add(
              "selected"
            );
          }
        );
      });

    /*
      Brand
    */

    document
      .querySelectorAll(
        "[data-brand]"
      )
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => {

            const input =
              document.getElementById(
                "brand"
              );

            if (!input) return;

            input.value =
              btn.dataset.brand;

            document
              .querySelectorAll(
                "[data-brand]"
              )
              .forEach(x =>
                x.classList.remove(
                  "selected"
                )
              );

            btn.classList.add(
              "selected"
            );
          }
        );
      });

    /*
      Quantity
    */

    const qty =
      document.getElementById(
        "quantity"
      );

    const minus =
      document.getElementById(
        "qtyMinus"
      );

    const plus =
      document.getElementById(
        "qtyPlus"
      );

    if (minus && qty) {
      minus.addEventListener(
        "click",
        () => {

          let value =
            Number(qty.value || 0);

          value =
            Math.max(
              0,
              value - 1
            );

          qty.value =
            value || "";
        }
      );
    }

    if (plus && qty) {
      plus.addEventListener(
        "click",
        () => {

          let value =
            Number(qty.value || 0);

          value += 1;

          qty.value =
            value;
        }
      );
    }

    /*
      Submit
    */

    if (form) {
      form.addEventListener(
        "submit",
        event => {

          event.preventDefault();

          if (!qty || !qty.value) {
            showToast(
              state.language === "hi"
                ? "कृपया मात्रा डालें"
                : "Please enter quantity"
            );

            qty?.focus();

            return;
          }

          const values = {};

          item.fields.forEach(
            (_, index) => {

              const input =
                document.getElementById(
                  `field_${index}`
                );

              values[`field_${index}`] =
                input?.value || "";
            }
          );

          values.quantity =
            qty.value;

          values.unit =
            document.getElementById(
              "unit"
            )?.value ||
            item.units?.[0] ||
            "";

          values.brand =
            document.getElementById(
              "brand"
            )?.value ||
            "";

          const record = {
            id:
              existingIndex >= 0
                ? state.estimateItems[
                    existingIndex
                  ].id
                : `${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2)}`,

            stage:
              stageCode(),

            stageTitle:
              STAGES[
                state.stageIndex
              ].title,

            section:
              item.section,

            material:
              item.name,

            values,

            createdAt:
              existingIndex >= 0
                ? state.estimateItems[
                    existingIndex
                  ].createdAt
                : Date.now()
          };

          if (existingIndex >= 0) {
            state.estimateItems[
              existingIndex
            ] = record;

            saveEstimate();

            showToast(
              t("updated")
            );
          } else {
            state.estimateItems.push(
              record
            );

            saveEstimate();

            showToast(
              t("saved")
            );
          }

          /*
            IMPORTANT:
            Add button saves.
            Next button DOES NOT auto-save.
          */

          if (existingIndex < 0) {
            openNextItem();
          } else {
            navigate(
              "estimate"
            );
          }
        }
      );
    }

    /*
      Next button
      Does NOT auto-add.
    */

    const nextBtn =
      document.getElementById(
        "nextBtn"
      );

    if (nextBtn) {
      nextBtn.addEventListener(
        "click",
        () => {
          openNextItem();
        }
      );
    }
  }

  /* =======================================================
     STAGE CODE
     ======================================================= */

  function stageCode() {
    return (
      STAGES[
        state.stageIndex
      ]?.code ||
      `STAGE ${state.stageIndex + 1}`
    );
  }

  /* =======================================================
     NEXT ITEM
     ======================================================= */

  function openNextItem() {
    const stage =
      STAGES[state.stageIndex];

    if (!stage) return;

    let sectionIndex =
      state.selectedItem?.sectionIndex ?? 0;

    let itemIndex =
      state.itemIndex ?? 0;

    itemIndex++;

    if (
      stage.sections[sectionIndex] &&
      itemIndex <
        stage.sections[sectionIndex]
          .items.length
    ) {
      openItem(
        state.stageIndex,
        sectionIndex,
        itemIndex
      );

      return;
    }

    sectionIndex++;

    while (
      sectionIndex <
      stage.sections.length
    ) {
      if (
        stage.sections[
          sectionIndex
        ].items.length
      ) {
        openItem(
          state.stageIndex,
          sectionIndex,
          0
        );

        return;
      }

      sectionIndex++;
    }

    showToast(
      state.language === "hi"
        ? "यह स्टेज पूरा हो गया"
        : "This stage is complete"
    );

    renderStage();
  }

  /* =======================================================
     ESTIMATE PAGE
     ======================================================= */

  function renderEstimate() {
    main.innerHTML = `
      <section class="page estimatePage">

        <div class="pageTitle">
          <h2>${esc(t("estimate"))}</h2>

          <span>
            ${state.estimateItems.length}
          </span>
        </div>

        ${
          state.estimateItems.length
            ? `
              <div class="estimateList">
                ${state.estimateItems
                  .map(
                    (record, index) =>
                      renderEstimateRecord(
                        record,
                        index
                      )
                  )
                  .join("")}
              </div>

              <button
                id="clearEstimate"
                class="danger"
                type="button"
              >
                ${esc(t("clearEstimate"))}
              </button>
            `
            : `
              <div class="emptyState">
                <div class="emptyIcon">
                  ▤
                </div>

                <h3>
                  ${esc(t("estimateEmpty"))}
                </h3>
              </div>
            `
        }

      </section>
    `;

    document
      .querySelectorAll(
        "[data-estimate-index]"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            const index =
              Number(
                card.dataset.estimateIndex
              );

            editEstimate(index);
          }
        );
      });

    const clear =
      document.getElementById(
        "clearEstimate"
      );

    if (clear) {
      clear.addEventListener(
        "click",
        () => {

          if (
            !confirm(
              state.language === "hi"
                ? "क्या पूरा एस्टिमेट साफ करना है?"
                : "Clear complete estimate?"
            )
          ) {
            return;
          }

          state.estimateItems = [];

          saveEstimate();

          renderEstimate();
        }
      );
    }
  }

  function renderEstimateRecord(
    record,
    index
  ) {
    const values =
      record.values || {};

    return `
      <button
        type="button"
        class="estimateCard"
        data-estimate-index="${index}"
      >

        <div class="estimateCardTop">

          <span>
            ${esc(record.stage || "")}
          </span>

          <b>
            ${esc(
              materialName(
                record.material || ""
              )
            )}
          </b>

        </div>

        <div class="estimateDetails">

          <span>
            ${esc(t("quantity"))}:
            ${esc(values.quantity || "")}
          </span>

          <span>
            ${esc(t("unit"))}:
            ${esc(values.unit || "")}
          </span>

          ${
            values.brand
              ? `
                <span>
                  ${esc(t("brand"))}:
                  ${esc(values.brand)}
                </span>
              `
              : ""
          }

        </div>

      </button>
    `;
  }

  /* =======================================================
     EDIT ESTIMATE
     ======================================================= */

  function editEstimate(index) {
    const record =
      state.estimateItems[index];

    if (!record) return;

    const stageIndex =
      STAGES.findIndex(
        stage =>
          stage.code ===
          record.stage
      );

    if (stageIndex < 0) return;

    let sectionIndex = -1;
    let itemIndex = -1;

    STAGES[
      stageIndex
    ].sections.forEach(
      (section, si) => {

        const ii =
          section.items.findIndex(
            item =>
              item.name ===
              record.material
          );

        if (ii >= 0) {
          sectionIndex = si;
          itemIndex = ii;
        }
      }
    );

    if (
      sectionIndex < 0 ||
      itemIndex < 0
    ) {
      return;
    }

    state.page = "item";
    state.stageIndex =
      stageIndex;
    state.itemIndex =
      itemIndex;

    state.selectedItem = {
      item:
        STAGES[
          stageIndex
        ].sections[
          sectionIndex
        ].items[itemIndex],

      sectionIndex
    };

    renderItemEditor(index);
  }

  /* =======================================================
     CALCULATOR
     ======================================================= */

  function renderCalculator() {
    main.innerHTML = `
      <section class="page calculatorPage">

        <div class="pageTitle">
          <h2>
            ${esc(t("calculatorTitle"))}
          </h2>
        </div>

        <div class="calculatorGrid">

          <div class="calcCard">

            <h3>
              Voltage
            </h3>

            <input
              id="calcI"
              type="number"
              step="any"
              placeholder="Current (I)"
            >

            <input
              id="calcR"
              type="number"
              step="any"
              placeholder="Resistance (R)"
            >

            <button
              id="calcV"
              class="primary"
              type="button"
            >
              V = I × R
            </button>

            <div
              id="calcVResult"
              class="calcResult"
            >
              —
            </div>

          </div>

          <div class="calcCard">

            <h3>
              Current
            </h3>

            <input
              id="calcV2"
              type="number"
              step="any"
              placeholder="Voltage (V)"
            >

            <input
              id="calcR2"
              type="number"
              step="any"
              placeholder="Resistance (R)"
            >

            <button
              id="calcI2"
              class="primary"
              type="button"
            >
              I = V ÷ R
            </button>

            <div
              id="calcIResult"
              class="calcResult"
            >
              —
            </div>

          </div>

          <div class="calcCard">

            <h3>
              Resistance
            </h3>

            <input
              id="calcV3"
              type="number"
              step="any"
              placeholder="Voltage (V)"
            >

            <input
              id="calcI3"
              type="number"
              step="any"
              placeholder="Current (I)"
            >

            <button
              id="calcR3"
              class="primary"
              type="button"
            >
              R = V ÷ I
            </button>

            <div
              id="calcRResult"
              class="calcResult"
            >
              —
            </div>

          </div>

        </div>

      </section>
    `;

    bindCalculator();
  }

  function bindCalculator() {
    const vBtn =
      document.getElementById(
        "calcV"
      );

    if (vBtn) {
      vBtn.addEventListener(
        "click",
        () => {

          const i =
            Number(
              document.getElementById(
                "calcI"
              )?.value
            );

          const r =
            Number(
              document.getElementById(
                "calcR"
              )?.value
            );

          document.getElementById(
            "calcVResult"
          ).textContent =
            i && r
              ? `${i * r} V`
              : "—";
        }
      );
    }

    const iBtn =
      document.getElementById(
        "calcI2"
      );

    if (iBtn) {
      iBtn.addEventListener(
        "click",
        () => {

          const v =
            Number(
              document.getElementById(
                "calcV2"
              )?.value
            );

          const r =
            Number(
              document.getElementById(
                "calcR2"
              )?.value
            );

          document.getElementById(
            "calcIResult"
          ).textContent =
            v && r
              ? `${v / r} A`
              : "—";
        }
      );
    }

    const rBtn =
      document.getElementById(
        "calcR3"
      );

    if (rBtn) {
      rBtn.addEventListener(
        "click",
        () => {

          const v =
            Number(
              document.getElementById(
                "calcV3"
              )?.value
            );

          const i =
            Number(
              document.getElementById(
                "calcI3"
              )?.value
            );

          document.getElementById(
            "calcRResult"
          ).textContent =
            v && i
              ? `${v / i} Ω`
              : "—";
        }
      );
    }
  }

  /* =======================================================
     SETTINGS
     ======================================================= */

  function renderSettings() {
    main.innerHTML = `
      <section class="page settingsPage">

        <div class="pageTitle">
          <h2>
            ${esc(t("settingsTitle"))}
          </h2>
        </div>

        <div class="settingsCard">

          <div class="settingRow">

            <div>
              <b>
                ${esc(t("chooseView"))}
              </b>

              <small>
                ${esc(viewLabel(state.view))}
              </small>
            </div>

            <button
              id="settingsView"
              class="secondary"
              type="button"
            >
              ${viewIcon(state.view)}
              ${esc(viewLabel(state.view))}
            </button>

          </div>

          <div class="settingRow">

            <div>
              <b>
                Language
              </b>

              <small>
                ${
                  state.language === "hi"
                    ? "Hindi / English"
                    : "English / Hindi"
                }
              </small>
            </div>

            <button
              id="settingsLang"
              class="secondary"
              type="button"
            >
              ${
                state.language === "hi"
                  ? "EN"
                  : "हि"
              }
            </button>

          </div>

        </div>

      </section>
    `;

    const lang =
      document.getElementById(
        "settingsLang"
      );

    if (lang) {
      lang.addEventListener(
        "click",
        () => {

          state.language =
            state.language === "hi"
              ? "en"
              : "hi";

          applyLanguage();
        }
      );
    }

    const view =
      document.getElementById(
        "settingsView"
      );

    if (view) {
      view.addEventListener(
        "click",
        () => {

          const current =
            VIEW_MODES.findIndex(
              x =>
                x[0] ===
                state.view
            );

          const next =
            VIEW_MODES[
              (current + 1) %
              VIEW_MODES.length
            ];

          state.view =
            next[0];

          safeSet(
            CFG.viewKey ||
              "sandeepMaterialView",
            state.view
          );

          renderSettings();
        }
      );
    }
  }

  /* =======================================================
     TOAST
     ======================================================= */

  let toastTimer = null;

  function showToast(message) {
    let toast =
      document.getElementById(
        "appToast"
      );

    if (!toast) {
      toast =
        document.createElement(
          "div"
        );

      toast.id =
        "appToast";

      toast.className =
        "toast";

      document.body.appendChild(
        toast
      );
    }

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
        1800
      );
  }

  /* =======================================================
     BACK
     ======================================================= */

  function goBack() {
    const previous =
      state.history.pop();

    if (previous) {
      state.page =
        previous.page || "home";

      state.stageIndex =
        previous.stageIndex ??
        null;

      state.itemIndex =
        previous.itemIndex ??
        null;

      if (
        state.page === "stage" &&
        state.stageIndex !== null
      ) {
        renderStage();
      } else if (
        state.page === "item" &&
        state.stageIndex !== null &&
        state.itemIndex !== null
      ) {
        /*
          Rebuild selected item.
        */

        const stage =
          STAGES[
            state.stageIndex
          ];

        if (stage) {

          let found = null;

          stage.sections.forEach(
            (section, si) => {

              if (
                section.items[
                  state.itemIndex
                ]
              ) {
                found = {
                  item:
                    section.items[
                      state.itemIndex
                    ],
                  sectionIndex: si
                };
              }
            }
          );

          if (found) {
            state.selectedItem =
              found;

            renderItemEditor();
            return;
          }
        }

        renderStage();
      } else {
        renderCurrentPage();
      }

      saveRoute();
      return;
    }

    if (
      state.page === "item"
    ) {
      renderStage();
      return;
    }

    if (
      state.page === "stage"
    ) {
      navigate(
        "home",
        false
      );
      return;
    }

    if (
      state.page !== "home"
    ) {
      navigate(
        "home",
        false
      );
    }
  }

  /* =======================================================
     ANDROID / BROWSER BACK
     ======================================================= */

  window.addEventListener(
    "popstate",
    event => {
      event.preventDefault();
      goBack();
    }
  );

  /*
    Push one browser state so Android
    back can be handled inside app.
  */

  try {
    history.replaceState(
      {
        electroFix: true
      },
      "",
      location.href
    );

    history.pushState(
      {
        electroFix: true
      },
      "",
      location.href
    );
  } catch (e) {}

  /* =======================================================
     PAGE RENDER
     ======================================================= */

  function renderCurrentPage() {
    switch (state.page) {

      case "stage":
        renderStage();
        break;

      case "item":
        renderItemEditor();
        break;

      case "estimate":
        renderEstimate();
        break;

      case "calculator":
        renderCalculator();
        break;

      case "settings":
        renderSettings();
        break;

      case "home":
      default:
        renderHome();
        break;
    }

    updateBottomNav();
    applyTheme();
  }

  /* =======================================================
     START APP
     ======================================================= */

  restoreRoute();

  /*
    Safety:
    If stored route points to invalid stage,
    return Home.
  */

  if (
    state.stageIndex !== null &&
    !STAGES[state.stageIndex]
  ) {
    state.page = "home";
    state.stageIndex = null;
    state.itemIndex = null;
  }

  /*
    If page is item but selected item
    cannot be restored, show stage/home.
  */

  if (
    state.page === "item"
  ) {
    const stage =
      STAGES[state.stageIndex];

    if (!stage) {
      state.page = "home";
      state.stageIndex = null;
      state.itemIndex = null;
    } else {
      /*
        Try to locate item.
      */

      let found = null;

      stage.sections.forEach(
        (section, si) => {

          if (
            state.itemIndex !== null &&
            section.items[
              state.itemIndex
            ]
          ) {
            found = {
              item:
                section.items[
                  state.itemIndex
                ],
              sectionIndex: si
            };
          }
        }
      );

      if (found) {
        state.selectedItem =
          found;
      } else {
        state.page = "stage";
      }
    }
  }

  applyTheme();
  renderCurrentPage();

  /* =======================================================
     DEBUG INFORMATION
     ======================================================= */

  console.log(
    "Sandeep ElectroFix Estimate List"
  );

  console.log(
    "Materials loaded:",
    RAW_MATERIALS.length
  );

  console.log(
    "Stages parsed:",
    STAGES.length
  );

  STAGES.forEach(
    (stage, index) => {

      const count =
        stage.sections.reduce(
          (sum, section) =>
            sum +
            section.items.length,
          0
        );

      console.log(
        `${stage.code}: ${stage.title} → ${count} materials`
      );
    }
  );

})();
