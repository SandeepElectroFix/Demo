/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   FINAL VERSION
   MATCHED WITH CURRENT material.js

   material.js structure:

   [
     "STAGE 1",
     "Stage Name",
     "Category",
     [ item list ],
     [ "Group Name", [ item list ] ],
     ...
   ]

   FEATURES
   ---------------------------------------------------------
   ✓ Stage 1 - Stage 5
   ✓ Category / Group
   ✓ Dynamic Material Fields
   ✓ Hindi / English
   ✓ Material Search
   ✓ Stage Search
   ✓ 10 Material View Modes
   ✓ Quantity Required
   ✓ Unit Carry Forward
   ✓ Optional Brand
   ✓ Add / Edit / Delete
   ✓ Add -> Next Material
   ✓ Next NEVER auto-adds
   ✓ Estimate Storage
   ✓ Refresh Restore
   ✓ Stage / Section / Item Restore
   ✓ Dark / Light
   ✓ Drawer Compatibility
   ✓ Bottom Navigation Compatibility
   ✓ Android / Browser Back
   ✓ Toast
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIG
     ======================================================= */

  const CFG = window.APP_CONFIG || window.AppConfig || {};

  const CONFIG = {
    appName:
      CFG.appName ||
      "Estimate List",

    appNameHi:
      CFG.appNameHi ||
      "एस्टिमेट लिस्ट",

    businessName:
      CFG.businessName ||
      "Sandeep ElectroFix",

    tagline:
      CFG.tagline ||
      "Powering Your Trust",

    defaultLanguage:
      CFG.defaultLanguage === "en"
        ? "en"
        : "hi",

    storageKey:
      CFG.storageKey ||
      "sandeepEstimateItems",

    languageKey:
      CFG.languageKey ||
      "sandeepMaterialLang",

    themeKey:
      CFG.themeKey ||
      "sandeepTheme",

    viewKey:
      CFG.viewKey ||
      "sandeepMaterialView",

    routeKey:
      CFG.routeKey ||
      "sandeepEstimateRoute",

    unitKey:
      "sandeepLastUnit"
  };

  /* =======================================================
     DOM
     ======================================================= */

  const main =
    document.getElementById("main");

  if (!main) {
    console.error(
      "Sandeep ElectroFix: #main not found."
    );
    return;
  }

  const menuBtn =
    document.getElementById("menuBtn");

  const drawer =
    document.getElementById("drawer");

  const drawerOverlay =
    document.getElementById(
      "drawerOverlay"
    );

  const closeMenu =
    document.getElementById("closeMenu");

  const themeBtn =
    document.getElementById("themeBtn") ||
    document.getElementById(
      "themeButton"
    );

  const langBtn =
    document.getElementById("langBtn");

  const bottomNav =
    document.getElementById("bottomNav") ||
    document.querySelector(".bottom-nav");

  /* =======================================================
     MATERIAL DATA
     ======================================================= */

  const RAW_MATERIALS =
    Array.isArray(window.MATERIALS)
      ? window.MATERIALS
      : [];

  if (!RAW_MATERIALS.length) {
    console.error(
      "Sandeep ElectroFix: MATERIALS not found."
    );
  }

  /* =======================================================
     STATE
     ======================================================= */

  const state = {
    page: "home",

    stageIndex: null,

    sectionIndex: null,

    itemIndex: null,

    selectedItem: null,

    editEstimateIndex: -1,

    language: loadLanguage(),

    theme: loadTheme(),

    view: loadView(),

    search: "",

    drawerOpen: false,

    viewSelectorOpen: false,

    estimateItems:
      loadEstimate(),

    history: [],

    lastUnit:
      safeGet(
        CONFIG.unitKey,
        ""
      )
  };

  /* =======================================================
     STORAGE HELPERS
     ======================================================= */

  function safeGet(
    key,
    fallback = null
  ) {
    try {
      const value =
        localStorage.getItem(key);

      return value === null
        ? fallback
        : value;
    } catch (error) {
      return fallback;
    }
  }

  function safeSet(
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
        "Storage error:",
        error
      );
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {}
  }

  /* =======================================================
     LOAD LANGUAGE
     ======================================================= */

  function loadLanguage() {
    const saved =
      safeGet(
        CONFIG.languageKey,
        CONFIG.defaultLanguage
      );

    return saved === "en"
      ? "en"
      : "hi";
  }

  /* =======================================================
     LOAD THEME
     ======================================================= */

  function loadTheme() {
    const saved =
      safeGet(
        CONFIG.themeKey,
        "dark"
      );

    return saved === "light"
      ? "light"
      : "dark";
  }

  /* =======================================================
     LOAD VIEW
     ======================================================= */

  const ALLOWED_VIEWS = [
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

  function loadView() {
    const saved =
      safeGet(
        CONFIG.viewKey,
        "grid"
      );

    return ALLOWED_VIEWS.includes(
      saved
    )
      ? saved
      : "grid";
  }

  /* =======================================================
     LOAD ESTIMATE
     ======================================================= */

  function loadEstimate() {
    try {
      const raw =
        localStorage.getItem(
          CONFIG.storageKey
        );

      if (!raw) {
        return [];
      }

      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      return [];
    }
  }

  function saveEstimate() {
    safeSet(
      CONFIG.storageKey,
      JSON.stringify(
        state.estimateItems
      )
    );
  }

  /* =======================================================
     TRANSLATION
     ======================================================= */

  const UI = {
    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",

      search: "Search material",

      stage: "Stage",
      materials: "Materials",
      groups: "Groups",

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

      noMaterials:
        "No materials found.",

      noSearch:
        "No material found for this search.",

      estimateEmpty:
        "No items added yet.",

      clearEstimate:
        "Clear Estimate",

      delete:
        "Delete",

      edit:
        "Edit",

      calculatorTitle:
        "Electrical Calculator",

      settingsTitle:
        "Settings",

      chooseView:
        "Choose View",

      dark: "Dark",
      light: "Light",

      saved:
        "Added to Estimate",

      updated:
        "Estimate Updated",

      deleted:
        "Item Deleted",

      cleared:
        "Estimate Cleared",

      stageComplete:
        "This stage is complete",

      enterQuantity:
        "Please enter quantity",

      noMaterial:
        "Material not found",

      closeWarning:
        "Press back again to exit the app."
    },

    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",

      search:
        "सामग्री खोजें",

      stage: "स्टेज",
      materials: "सामग्री",
      groups: "ग्रुप",

      back: "वापस",

      add:
        "एस्टिमेट में जोड़ें",

      update:
        "एस्टिमेट अपडेट करें",

      next: "अगला",
      previous: "पिछला",

      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",

      select: "चुनें",
      required: "जरूरी",
      optional: "वैकल्पिक",

      noMaterials:
        "कोई सामग्री नहीं मिली।",

      noSearch:
        "इस खोज के लिए कोई सामग्री नहीं मिली।",

      estimateEmpty:
        "अभी कोई आइटम नहीं जोड़ा गया।",

      clearEstimate:
        "एस्टिमेट साफ करें",

      delete:
        "डिलीट",

      edit:
        "एडिट",

      calculatorTitle:
        "इलेक्ट्रिकल कैलकुलेटर",

      settingsTitle:
        "सेटिंग्स",

      chooseView:
        "व्यू चुनें",

      dark: "डार्क",
      light: "लाइट",

      saved:
        "एस्टिमेट में जोड़ा गया",

      updated:
        "एस्टिमेट अपडेट किया गया",

      deleted:
        "आइटम डिलीट किया गया",

      cleared:
        "एस्टिमेट साफ कर दिया गया",

      stageComplete:
        "यह स्टेज पूरा हो गया",

      enterQuantity:
        "कृपया मात्रा डालें",

      noMaterial:
        "सामग्री नहीं मिली",

      closeWarning:
        "ऐप बंद करने के लिए फिर से Back दबाएँ।"
    }
  };

  function t(key) {
    return (
      UI[state.language]?.[key] ||
      UI.en[key] ||
      key
    );
  }

  /* =======================================================
     MATERIAL HINDI
     ======================================================= */

  const MATERIAL_HI = {
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
      "शटरिंग एवं जॉइंट सीलिंग टेप",

    "Solvent Cement":
      "सॉल्वेंट सीमेंट",

    "Neel Powder (Marking Powder)":
      "नील पाउडर",

    "Binding Wire":
      "बाइंडिंग वायर",

    "Cable Tie / Zip Tie":
      "केबल टाई / जिप टाई",

    "Modular Board (Concealed Metal/PVC Box)":
      "मॉड्यूलर बोर्ड",

    "MCB Box (Distribution Board)":
      "एमसीबी बॉक्स",

    "Tape (Masking & Plaster Protection)":
      "मास्किंग एवं प्लास्टर प्रोटेक्शन टेप",

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
      "स्टील वायर / स्प्रिंग वायर",

    "Switch Plate":
      "स्विच प्लेट",

    "Switch Board (Surface Gang Box)":
      "स्विच बोर्ड",

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
      "डीपी स्विच",

    "Mini MCB":
      "मिनी एमसीबी",

    "SP MCB (Single Pole)":
      "एसपी एमसीबी",

    "DP MCB (Double Pole)":
      "डीपी एमसीबी",

    "TPN MCB (Three Pole with Neutral)":
      "टीपीएन एमसीबी",

    "MCB Changeover":
      "एमसीबी चेंजओवर",

    "DP Isolator":
      "डीपी आइसोलेटर",

    "TPN Isolator (3P / 4P)":
      "टीपीएन आइसोलेटर",

    "RCCB / RCD":
      "आरसीसीबी / आरसीडी",

    "MCB Box":
      "एमसीबी बॉक्स",

    "Kit Kat Fuse":
      "किटकैट फ्यूज",

    "Fan Sheet":
      "फैन शीट",

    "Round Sheet":
      "राउंड शीट",

    "Fan Rod":
      "फैन रॉड",

    "Fan Clamp":
      "फैन क्लैंप",

    "Holder":
      "होल्डर",

    "Ceiling Rose":
      "सीलिंग रोज",

    "Chain":
      "चेन",

    "LED Bulb":
      "एलईडी बल्ब",

    "LED Tube Light":
      "एलईडी ट्यूब लाइट",

    "Foot Light":
      "फुट लाइट",

    "Up Down Light":
      "अप डाउन लाइट",

    "Panel Light":
      "पैनल लाइट",

    "Surface Light":
      "सरफेस लाइट",

    "COB Light":
      "सीओबी लाइट",

    "COB Spot Light":
      "सीओबी स्पॉट लाइट",

    "Down Light":
      "डाउन लाइट",

    "Strip Light":
      "स्ट्रिप लाइट",

    "Rope Light":
      "रोप लाइट",

    "LED Profile Channel":
      "एलईडी प्रोफाइल चैनल",

    "LED Strip Driver (SMPS)":
      "एलईडी स्ट्रिप ड्राइवर",

    "Door Bell":
      "डोर बेल",

    "Tape (Mounting / Double Sided)":
      "माउंटिंग / डबल साइडेड टेप",

    "Instant Glue":
      "इंस्टेंट ग्लू",

    "Araldite Glue (Epoxy)":
      "अरालडाइट ग्लू",

    "POP (Plaster of Paris)":
      "पीओपी",

    "Putty Blade / Patta":
      "पुट्टी ब्लेड / पट्टा",

    "Screw":
      "स्क्रू",

    "Lug (Cable Terminal Lug)":
      "केबल लग",

    "Washer":
      "वॉशर",

    "Saddle (Pipe Clamp)":
      "सैडल / पाइप क्लैंप",

    "PVC Wall Plug / Gulli / Gitti":
      "पीवीसी वॉल प्लग / गुल्ली / गिट्टी"
  };

  const GROUP_HI = {
    "Conduit & Box":
      "कंड्यूट एवं बॉक्स",

    "Installation Material":
      "इंस्टॉलेशन सामग्री",

    "Wiring Material":
      "वायरिंग सामग्री",

    "Pulling Material":
      "पुलिंग सामग्री",

    "Switch & Socket":
      "स्विच एवं सॉकेट",

    "MCB & Protection":
      "एमसीबी एवं प्रोटेक्शन",

    "Fan & Ceiling":
      "फैन एवं सीलिंग",

    "Lighting":
      "लाइटिंग",

    "Installation & Finishing":
      "इंस्टॉलेशन एवं फिनिशिंग",

    "Wiring & Conduit":
      "वायरिंग एवं कंड्यूट",

    "Installation & Fastening":
      "इंस्टॉलेशन एवं फास्टनिंग"
  };

  function materialName(name) {
    if (state.language !== "hi") {
      return name;
    }

    return MATERIAL_HI[name]
      ? `${MATERIAL_HI[name]} / ${name}`
      : name;
  }

  function groupName(name) {
    if (state.language !== "hi") {
      return name;
    }

    return GROUP_HI[name]
      ? `${GROUP_HI[name]} / ${name}`
      : name;
  }

  /* =======================================================
     STAGE HINDI
     ======================================================= */

  const STAGE_HI = {
    "Slab Conduit Installation":
      "स्लैब कंड्यूट इंस्टॉलेशन",

    "Wall Conduit Installation":
      "वॉल कंड्यूट इंस्टॉलेशन",

    "Wiring Installation":
      "वायरिंग इंस्टॉलेशन",

    "Final Electrical Fittings":
      "फाइनल इलेक्ट्रिकल फिटिंग्स",

    "False Ceiling Wiring Material":
      "फॉल्स सीलिंग वायरिंग मटेरियल"
  };

  function stageTitle(stage) {
    if (state.language !== "hi") {
      return stage.title;
    }

    return STAGE_HI[stage.title]
      ? `${STAGE_HI[stage.title]} / ${stage.title}`
      : stage.title;
  }

  /* =======================================================
     ESCAPE
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
     MATERIAL VALIDATION
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
      value.every(
        isMaterialItem
      )
    );
  }

  /* =======================================================
     NORMALIZE MATERIAL
     ======================================================= */

  function normalizeItem(
    item,
    stageIndex,
    sectionName
  ) {
    return {
      name:
        item[0] || "",

      fields:
        Array.isArray(item[1])
          ? item[1]
          : [],

      units:
        Array.isArray(item[2])
          ? item[2]
          : [],

      brands:
        Array.isArray(item[3])
          ? item[3]
          : [],

      stageIndex,

      section:
        sectionName || ""
    };
  }

  /* =======================================================
     PARSE MATERIALS
     ======================================================= */

  function parseMaterials() {
    return RAW_MATERIALS.map(
      (
        rawStage,
        stageIndex
      ) => {

        if (
          !Array.isArray(
            rawStage
          )
        ) {
          return {
            code:
              `STAGE ${
                stageIndex + 1
              }`,

            title:
              `Stage ${
                stageIndex + 1
              }`,

            category: "",

            sections: []
          };
        }

        const code =
          rawStage[0] ||
          `STAGE ${
            stageIndex + 1
          }`;

        const title =
          rawStage[1] ||
          code;

        const category =
          rawStage[2] ||
          "";

        const sections = [];

        /* Main item list */

        if (
          isItemList(
            rawStage[3]
          )
        ) {
          sections.push({
            name: category,

            items:
              rawStage[3].map(
                item =>
                  normalizeItem(
                    item,
                    stageIndex,
                    category
                  )
              )
          });
        }

        /* Grouped sections */

        for (
          let i = 4;
          i < rawStage.length;
          i++
        ) {
          const part =
            rawStage[i];

          if (
            Array.isArray(part) &&
            typeof part[0] ===
              "string" &&
            isItemList(part[1])
          ) {
            sections.push({
              name: part[0],

              items:
                part[1].map(
                  item =>
                    normalizeItem(
                      item,
                      stageIndex,
                      part[0]
                    )
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
      }
    );
  }

  const STAGES =
    parseMaterials();

  /* =======================================================
     FLAT MATERIAL LIST
     ======================================================= */

  function getAllItems() {
    const all = [];

    STAGES.forEach(
      (
        stage,
        stageIndex
      ) => {

        stage.sections.forEach(
          (
            section,
            sectionIndex
          ) => {

            section.items.forEach(
              (
                item,
                itemIndex
              ) => {

                all.push({
                  ...item,

                  stageIndex,

                  sectionIndex,

                  itemIndex,

                  stageCode:
                    stage.code,

                  stageTitle:
                    stage.title,

                  sectionName:
                    section.name
                });
              }
            );
          }
        );
      }
    );

    return all;
  }

  /* =======================================================
     VIEW MODES
     ======================================================= */

  const VIEW_MODES = [
    [
      "grid",
      "▦",
      "Grid"
    ],
    [
      "list",
      "☷",
      "List"
    ],
    [
      "compact",
      "▤",
      "Compact"
    ],
    [
      "large",
      "▥",
      "Large"
    ],
    [
      "mini",
      "▪",
      "Mini"
    ],
    [
      "twoColumn",
      "▦",
      "2 Column"
    ],
    [
      "horizontal",
      "▤",
      "Horizontal"
    ],
    [
      "iconList",
      "☷",
      "Icon List"
    ],
    [
      "timeline",
      "◫",
      "Timeline"
    ],
    [
      "dense",
      "≡",
      "Dense"
    ]
  ];

  function viewIcon(view) {
    const found =
      VIEW_MODES.find(
        item =>
          item[0] === view
      );

    return found
      ? found[1]
      : "▦";
  }

  function viewLabel(view) {
    const found =
      VIEW_MODES.find(
        item =>
          item[0] === view
      );

    return found
      ? found[2]
      : "Grid";
  }

  /* =======================================================
     DRAWER
     ======================================================= */

  function openDrawer() {
    if (!drawer) return;

    state.drawerOpen = true;

    drawer.classList.add(
      "open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "false"
    );

    if (drawerOverlay) {
      drawerOverlay.classList.add(
        "show"
      );
    }

    if (menuBtn) {
      menuBtn.classList.add(
        "open"
      );

      menuBtn.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  }

  function closeDrawer() {
    if (!drawer) return;

    state.drawerOpen = false;

    drawer.classList.remove(
      "open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

    if (drawerOverlay) {
      drawerOverlay.classList.remove(
        "show"
      );
    }

    if (menuBtn) {
      menuBtn.classList.remove(
        "open"
      );

      menuBtn.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener(
      "click",
      () => {
        if (
          state.drawerOpen
        ) {
          closeDrawer();
        } else {
          openDrawer();
        }
      }
    );
  }

  if (closeMenu) {
    closeMenu.addEventListener(
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

  if (drawer) {
    drawer
      .querySelectorAll(
        "[data-page]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const page =
              button.dataset.page;

            closeDrawer();

            navigate(page);
          }
        );
      });
  }

  /* =======================================================
     THEME
     ======================================================= */

  function applyTheme() {
    document.body.dataset.theme =
      state.theme;

    document.documentElement.dataset.theme =
      state.theme;

    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-pressed",
        state.theme === "light"
          ? "true"
          : "false"
      );

      const icon =
        themeBtn.querySelector(
          ".themeIcon"
        );

      if (icon) {
        icon.textContent =
          state.theme === "light"
            ? "🌙"
            : "☀️";
      }
    }

    safeSet(
      CONFIG.themeKey,
      state.theme
    );
  }

  if (themeBtn) {
    themeBtn.addEventListener(
      "click",
      () => {

        state.theme =
          state.theme === "dark"
            ? "light"
            : "dark";

        applyTheme();
      }
    );
  }

  /* =======================================================
     LANGUAGE
     ======================================================= */

  function applyLanguage() {
    safeSet(
      CONFIG.languageKey,
      state.language
    );

    if (langBtn) {
      langBtn.textContent =
        state.language === "hi"
          ? "EN"
          : "हि";
    }

    renderCurrentPage();
  }

  if (langBtn) {
    langBtn.addEventListener(
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

  /* =======================================================
     BOTTOM NAV
     ======================================================= */

  function getNavPage(button) {
    return (
      button.dataset.page ||
      button.dataset.nav ||
      ""
    );
  }

  function updateBottomNav() {
    if (!bottomNav) return;

    bottomNav
      .querySelectorAll(
        "[data-page], [data-nav]"
      )
      .forEach(button => {

        const page =
          getNavPage(button);

        button.classList.toggle(
          "active",
          page === state.page
        );
      });
  }

  if (bottomNav) {
    bottomNav
      .querySelectorAll(
        "[data-page], [data-nav]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const page =
              getNavPage(button);

            if (page) {
              navigate(page);
            }
          }
        );
      });
  }

  /* =======================================================
     ROUTE SNAPSHOT
     ======================================================= */

  function getRoute() {
    return {
      page:
        state.page,

      stageIndex:
        state.stageIndex,

      sectionIndex:
        state.sectionIndex,

      itemIndex:
        state.itemIndex
    };
  }

  function saveRoute() {
    safeSet(
      CONFIG.routeKey,
      JSON.stringify(
        getRoute()
      )
    );
  }

  function restoreRoute() {
    try {
      const raw =
        safeGet(
          CONFIG.routeKey,
          null
        );

      if (!raw) return;

      const route =
        JSON.parse(raw);

      if (!route) return;

      const allowedPages = [
        "home",
        "stage",
        "item",
        "estimate",
        "calculator",
        "settings"
      ];

      if (
        allowedPages.includes(
          route.page
        )
      ) {
        state.page =
          route.page;
      }

      state.stageIndex =
        validIndex(
          route.stageIndex,
          STAGES.length
        )
          ? route.stageIndex
          : null;

      if (
        state.stageIndex !== null
      ) {
        const sections =
          STAGES[
            state.stageIndex
          ]?.sections || [];

        state.sectionIndex =
          validIndex(
            route.sectionIndex,
            sections.length
          )
            ? route.sectionIndex
            : null;

        if (
          state.sectionIndex !== null
        ) {
          const items =
            sections[
              state.sectionIndex
            ]?.items || [];

          state.itemIndex =
            validIndex(
              route.itemIndex,
              items.length
            )
              ? route.itemIndex
              : null;
        }
      }
    } catch (error) {
      console.warn(
        "Route restore error:",
        error
      );
    }
  }

  function validIndex(
    value,
    length
  ) {
    return (
      Number.isInteger(value) &&
      value >= 0 &&
      value < length
    );
  }

  /* =======================================================
     NAVIGATION
     ======================================================= */

  function pushHistory() {
    state.history.push(
      getRoute()
    );

    /*
      Keep history manageable.
    */

    if (
      state.history.length > 50
    ) {
      state.history.shift();
    }
  }

  function navigate(
    page,
    addHistory = true
  ) {
    if (!page) {
      page = "home";
    }

    if (
      addHistory &&
      page !== state.page
    ) {
      pushHistory();
    }

    state.page = page;

    if (
      page === "home"
    ) {
      state.stageIndex = null;
      state.sectionIndex = null;
      state.itemIndex = null;
      state.selectedItem = null;
      state.editEstimateIndex = -1;
    }

    if (
      page === "estimate" ||
      page === "calculator" ||
      page === "settings"
    ) {
      state.stageIndex = null;
      state.sectionIndex = null;
      state.itemIndex = null;
      state.selectedItem = null;
      state.editEstimateIndex = -1;
    }

    renderCurrentPage();
    saveRoute();
  }

  /* =======================================================
     HOME
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

          <h2>
            ${esc(
              CONFIG.businessName
            )}
          </h2>

          <p>
            ${esc(
              CONFIG.tagline
            )}
          </p>

        </div>

        <div class="searchBox">

          <span>⌕</span>

          <input
            id="homeSearch"
            type="search"
            autocomplete="off"
            placeholder="${esc(
              t("search")
            )}"
            value="${esc(
              state.search
            )}"
          >

          ${
            state.search
              ? `
                <button
                  id="clearHomeSearch"
                  type="button"
                  aria-label="Clear"
                >
                  ×
                </button>
              `
              : ""
          }

        </div>

        <div class="stageViewSelector">

          <button
            id="viewToggle"
            class="stageViewBtn"
            type="button"
            aria-expanded="false"
            aria-label="${esc(
              t("chooseView")
            )}"
          >
            ${viewIcon(
              state.view
            )}
          </button>

          <div
            id="viewOptions"
            class="stageViewOptions"
            hidden
          >

            ${VIEW_MODES.map(
              view => `
                <button
                  type="button"
                  class="stageViewOption ${
                    view[0] ===
                    state.view
                      ? "active"
                      : ""
                  }"
                  data-view="${
                    view[0]
                  }"
                >
                  <span>
                    ${view[1]}
                  </span>

                  <b>
                    ${view[2]}
                  </b>
                </button>
              `
            ).join("")}

          </div>

        </div>

        <div
          id="stageGrid"
          class="stageGrid ${
            state.view
          }"
        >
          ${renderStageCards()}
        </div>

      </section>
    `;

    bindHomeEvents();
  }

  function bindHomeEvents() {
    const search =
      document.getElementById(
        "homeSearch"
      );

    if (search) {
      search.addEventListener(
        "input",
        event => {

          state.search =
            String(
              event.target.value ||
                ""
            )
              .trim()
              .toLowerCase();

          renderStageCardsOnly();
        }
      );
    }

    const clear =
      document.getElementById(
        "clearHomeSearch"
      );

    if (clear) {
      clear.addEventListener(
        "click",
        () => {

          state.search = "";

          renderHome();

          document
            .getElementById(
              "homeSearch"
            )
            ?.focus();
        }
      );
    }

    const toggle =
      document.getElementById(
        "viewToggle"
      );

    const options =
      document.getElementById(
        "viewOptions"
      );

    if (
      toggle &&
      options
    ) {
      toggle.addEventListener(
        "click",
        () => {

          const open =
            !options.hasAttribute(
              "hidden"
            );

          if (open) {
            options.setAttribute(
              "hidden",
              ""
            );
          } else {
            options.removeAttribute(
              "hidden"
            );
          }

          toggle.setAttribute(
            "aria-expanded",
            String(!open)
          );
        }
      );

      options
        .querySelectorAll(
          "[data-view]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              state.view =
                button.dataset.view;

              safeSet(
                CONFIG.viewKey,
                state.view
              );

              options.setAttribute(
                "hidden",
                ""
              );

              renderStageCardsOnly();
            }
          );
        });
    }

    bindStageCards();
  }

  /* =======================================================
     SEARCH STAGE
     ======================================================= */

  function stageMatchesSearch(
    stage,
    query
  ) {
    if (!query) {
      return true;
    }

    const parts = [
      stage.code,
      stage.title,
      stage.category
    ];

    stage.sections.forEach(
      section => {

        parts.push(
          section.name
        );

        section.items.forEach(
          item => {

            parts.push(
              item.name
            );

            item.fields.forEach(
              field => {

                parts.push(
                  field[0]
                );

                if (
                  Array.isArray(
                    field[1]
                  )
                ) {
                  parts.push(
                    ...field[1]
                  );
                }
              }
            );

            parts.push(
              ...item.units
            );

            parts.push(
              ...item.brands
            );
          }
        );
      }
    );

    return parts
      .join(" ")
      .toLowerCase()
      .includes(query);
  }

  /* =======================================================
     STAGE CARDS
     ======================================================= */

  function renderStageCardsOnly() {
    const grid =
      document.getElementById(
        "stageGrid"
      );

    if (!grid) {
      return;
    }

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
          <h3>
            Material List Not Found
          </h3>
        </div>
      `;
    }

    const query =
      state.search;

    const html =
      STAGES.map(
        (
          stage,
          index
        ) => {

          if (
            !stageMatchesSearch(
              stage,
              query
            )
          ) {
            return "";
          }

          const total =
            stage.sections.reduce(
              (
                total,
                section
              ) =>
                total +
                section.items.length,
              0
            );

          return `
            <button
              type="button"
              class="stageCard"
              data-stage-index="${index}"
            >

              <div
                class="stageNumber"
              >
                ${esc(
                  stage.code
                )}
              </div>

              <div
                class="stageCardBody"
              >

                <h3>
                  ${esc(
                    stageTitle(
                      stage
                    )
                  )}
                </h3>

                <p>
                  ${esc(
                    groupName(
                      stage.category
                    )
                  )}
                </p>

                <div
                  class="stageMeta"
                >

                  <span>
                    ${total}
                    ${
                      state.language ===
                      "hi"
                        ? " सामग्री"
                        : " Materials"
                    }
                  </span>

                  <span>
                    ${
                      stage.sections
                        .length
                    }
                    ${t("groups")}
                  </span>

                </div>

              </div>

              <span
                class="stageArrow"
              >
                ›
              </span>

            </button>
          `;
        }
      ).join("");

    if (!html.trim()) {
      return `
        <div class="emptyState">
          <h3>
            ${esc(
              t("noSearch")
            )}
          </h3>
        </div>
      `;
    }

    return html;
  }

  function bindStageCards() {
    document
      .querySelectorAll(
        "[data-stage-index]"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            openStage(
              Number(
                card.dataset
                  .stageIndex
              )
            );
          }
        );
      });
  }

  /* =======================================================
     OPEN STAGE
     ======================================================= */

  function openStage(
    stageIndex
  ) {
    if (
      !STAGES[stageIndex]
    ) {
      return;
    }

    pushHistory();

    state.page =
      "stage";

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      null;

    state.itemIndex =
      null;

    state.selectedItem =
      null;

    state.editEstimateIndex =
      -1;

    renderStage();

    saveRoute();

    scrollTop();
  }

  /* =======================================================
     STAGE PAGE
     ======================================================= */

  function renderStage() {
    const stage =
      STAGES[
        state.stageIndex
      ];

    if (!stage) {
      navigate(
        "home",
        false
      );

      return;
    }

    main.innerHTML = `
      <section
        class="page stagePage"
      >

        <button
          id="stageBack"
          class="back"
          type="button"
        >
          ← ${esc(
            t("back")
          )}
        </button>

        <div
          class="stageHead"
        >

          <div
            class="stageHeadNumber"
          >
            ${esc(
              stage.code
            )}
          </div>

          <div>
            <h2>
              ${esc(
                stageTitle(
                  stage
                )
              )}
            </h2>

            <p>
              ${esc(
                groupName(
                  stage.category
                )
              )}
            </p>
          </div>

        </div>

        <div
          class="stageSearchBox"
        >

          <span>⌕</span>

          <input
            id="materialSearch"
            type="search"
            autocomplete="off"
            placeholder="${esc(
              t("search")
            )}"
          >

        </div>

        <div
          class="stageSections"
          id="stageSections"
        >
          ${renderSections(
            stage
          )}
        </div>

      </section>
    `;

    document
      .getElementById(
        "stageBack"
      )
      ?.addEventListener(
        "click",
        () => {
          goBack();
        }
      );

    const search =
      document.getElementById(
        "materialSearch"
      );

    if (search) {
      search.addEventListener(
        "input",
        event => {

          state.search =
            String(
              event.target.value ||
                ""
            )
              .trim()
              .toLowerCase();

          renderSectionsOnly(
            stage
          );
        }
      );
    }

    bindItemCards();

    scrollTop();
  }

  /* =======================================================
     RENDER SECTIONS
     ======================================================= */

  function renderSections(
    stage
  ) {
    const query =
      state.search;

    let sectionHTML = "";

    stage.sections.forEach(
      (
        section,
        sectionIndex
      ) => {

        const matchingItems =
          section.items.filter(
            item =>
              itemMatchesSearch(
                item,
                query
              )
          );

        if (
          query &&
          !matchingItems.length
        ) {
          return;
        }

        sectionHTML += `
          <section
            class="materialSection"
          >

            <div
              class="sectionTitle"
            >

              <span>
                ${
                  sectionIndex + 1
                }
              </span>

              <h3>
                ${esc(
                  groupName(
                    section.name
                  )
                )}
              </h3>

            </div>

            <div
              class="itemGrid ${
                state.view
              }"
            >

              ${
                matchingItems
                  .map(
                    item => {

                      const realIndex =
                        section.items.indexOf(
                          item
                        );

                      return renderItemCard(
                        item,
                        sectionIndex,
                        realIndex
                      );
                    }
                  )
                  .join("")
              }

            </div>

          </section>
        `;
      }
    );

    if (!sectionHTML) {
      return `
        <div
          class="emptyState"
        >
          <h3>
            ${esc(
              t("noSearch")
            )}
          </h3>
        </div>
      `;
    }

    return sectionHTML;
  }

  function renderSectionsOnly(
    stage
  ) {
    const container =
      document.getElementById(
        "stageSections"
      );

    if (!container) {
      return;
    }

    container.innerHTML =
      renderSections(
        stage
      );

    bindItemCards();
  }

  /* =======================================================
     ITEM SEARCH
     ======================================================= */

  function itemMatchesSearch(
    item,
    query
  ) {
    if (!query) {
      return true;
    }

    const values = [
      item.name,
      item.section
    ];

    item.fields.forEach(
      field => {

        values.push(
          field[0]
        );

        if (
          Array.isArray(
            field[1]
          )
        ) {
          values.push(
            ...field[1]
          );
        }
      }
    );

    values.push(
      ...item.units
    );

    values.push(
      ...item.brands
    );

    return values
      .join(" ")
      .toLowerCase()
      .includes(query);
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
      item.fields?.[0];

    let preview = "";

    if (
      firstField &&
      Array.isArray(
        firstField[1]
      ) &&
      firstField[1].length
    ) {
      preview =
        `${firstField[0]}: ${firstField[1][0]}`;
    }

    return `
      <button
        type="button"
        class="itemCard"
        data-section-index="${sectionIndex}"
        data-item-index="${itemIndex}"
      >

        <div
          class="itemIcon"
        >
          ⚡
        </div>

        <div
          class="itemHead"
        >

          <h3>
            ${esc(
              materialName(
                item.name
              )
            )}
          </h3>

          <small>
            ${
              item.fields.length
            }
            ${
              state.language ===
              "hi"
                ? " विकल्प"
                : " options"
            }
          </small>

        </div>

        ${
          preview
            ? `
              <div
                class="itemPreview"
              >
                ${esc(
                  preview
                )}
              </div>
            `
            : ""
        }

        <span
          class="itemArrow"
        >
          ›
        </span>

      </button>
    `;
  }

  function bindItemCards() {
    document
      .querySelectorAll(
        "[data-section-index][data-item-index]"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            openItem(
              state.stageIndex,
              Number(
                card.dataset
                  .sectionIndex
              ),
              Number(
                card.dataset
                  .itemIndex
              )
            );
          }
        );
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
    const item =
      getItem(
        stageIndex,
        sectionIndex,
        itemIndex
      );

    if (!item) {
      showToast(
        t("noMaterial")
      );

      return;
    }

    pushHistory();

    state.page =
      "item";

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      sectionIndex;

    state.itemIndex =
      itemIndex;

    state.selectedItem =
      item;

    state.editEstimateIndex =
      -1;

    renderItemEditor();

    saveRoute();

    scrollTop();
  }

  /* =======================================================
     GET ITEM
     ======================================================= */

  function getItem(
    stageIndex,
    sectionIndex,
    itemIndex
  ) {
    const stage =
      STAGES[
        stageIndex
      ];

    if (!stage) {
      return null;
    }

    const section =
      stage.sections[
        sectionIndex
      ];

    if (!section) {
      return null;
    }

    const item =
      section.items[
        itemIndex
      ];

    if (!item) {
      return null;
    }

    return item;
  }

  /* =======================================================
     ITEM EDITOR
     ======================================================= */

  function renderItemEditor() {
    const item =
      state.selectedItem ||
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    if (!item) {
      navigate(
        "stage",
        false
      );

      return;
    }

    const existing =
      state.editEstimateIndex >= 0
        ? state.estimateItems[
            state.editEstimateIndex
          ]
        : null;

    const values =
      existing?.values || {};

    main.innerHTML = `
      <section
        class="page itemPage"
      >

        <button
          id="itemBack"
          class="back"
          type="button"
        >
          ← ${esc(
            t("back")
          )}
        </button>

        <div
          class="stageHead"
        >

          <div
            class="stageHeadNumber"
          >
            ${esc(
              STAGES[
                state.stageIndex
              ].code
            )}
          </div>

          <div>

            <h2>
              ${esc(
                materialName(
                  item.name
                )
              )}
            </h2>

            <p>
              ${esc(
                groupName(
                  item.section
                )
              )}
            </p>

          </div>

        </div>

        <form
          id="materialForm"
          class="materialForm"
          novalidate
        >

          <div
            class="formCard"
          >

            ${renderFields(
              item,
              values
            )}

            ${renderQuantity(
              values
            )}

            ${renderUnit(
              item,
              values
            )}

            ${renderBrand(
              item,
              values
            )}

            <div
              class="editorButtons"
            >

              <button
                type="submit"
                class="primary"
              >
                ${
                  existing
                    ? esc(
                        t("update")
                      )
                    : esc(
                        t("add")
                      )
                }
              </button>

              <button
                type="button"
                id="nextBtn"
                class="secondary"
              >
                ${esc(
                  t("next")
                )}
                →
              </button>

            </div>

          </div>

        </form>

      </section>
    `;

    bindEditor(
      item
    );

    scrollTop();
  }

  /* =======================================================
     DYNAMIC FIELDS
     ======================================================= */

  function renderFields(
    item,
    values
  ) {
    if (!item.fields.length) {
      return "";
    }

    return item.fields
      .map(
        (
          field,
          index
        ) => {

          const label =
            field[0] ||
            `Option ${
              index + 1
            }`;

          const options =
            Array.isArray(
              field[1]
            )
              ? field[1]
              : [];

          const current =
            values[
              `field_${index}`
            ] || "";

          return `
            <div
              class="field"
            >

              <label>
                ${esc(
                  label
                )}

                <span
                  class="optional"
                >
                  ${esc(
                    t("optional")
                  )}
                </span>
              </label>

              <div
                class="choices"
              >

                ${
                  options
                    .map(
                      option => `
                        <button
                          type="button"
                          class="choice ${
                            current ===
                            option
                              ? "selected"
                              : ""
                          }"
                          data-field="${index}"
                          data-value="${esc(
                            option
                          )}"
                        >
                          ${esc(
                            option
                          )}
                        </button>
                      `
                    )
                    .join("")
                }

              </div>

              <input
                type="hidden"
                id="field_${index}"
                value="${esc(
                  current
                )}"
              >

            </div>
          `;
        }
      )
      .join("");
  }

  /* =======================================================
     QUANTITY
     ======================================================= */

  function renderQuantity(
    values
  ) {
    return `
      <div
        class="field quantityField"
      >

        <label>
          ${esc(
            t("quantity")
          )}

          <span
            class="required"
          >
            *
          </span>
        </label>

        <div
          class="qtyRow"
        >

          <button
            type="button"
            id="qtyMinus"
            class="qtyMinus"
          >
            −
          </button>

          <input
            id="quantity"
            type="number"
            min="0.01"
            step="0.01"
            inputmode="decimal"
            value="${esc(
              values.quantity ||
                ""
            )}"
            required
          >

          <button
            type="button"
            id="qtyPlus"
            class="qtyPlus"
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

  function getDefaultUnit(
    item,
    values
  ) {
    if (
      values.unit &&
      item.units.includes(
        values.unit
      )
    ) {
      return values.unit;
    }

    if (
      state.lastUnit &&
      item.units.includes(
        state.lastUnit
      )
    ) {
      return state.lastUnit;
    }

    return (
      item.units[0] || ""
    );
  }

  function renderUnit(
    item,
    values
  ) {
    const unit =
      getDefaultUnit(
        item,
        values
      );

    return `
      <div
        class="field"
      >

        <label>
          ${esc(
            t("unit")
          )}

          <span
            class="optional"
          >
            ${esc(
              t("optional")
            )}
          </span>
        </label>

        <div
          class="choices"
        >

          ${
            item.units
              .map(
                option => `
                  <button
                    type="button"
                    class="choice unitChoice ${
                      unit ===
                      option
                        ? "selected"
                        : ""
                    }"
                    data-unit="${esc(
                      option
                    )}"
                  >
                    ${esc(
                      option
                    )}
                  </button>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="unit"
          value="${esc(
            unit
          )}"
        >

      </div>
    `;
  }

  /* =======================================================
     BRAND
     ======================================================= */

  function renderBrand(
    item,
    values
  ) {
    if (
      !item.brands.length
    ) {
      return "";
    }

    const brand =
      values.brand || "";

    return `
      <div
        class="field"
      >

        <label>
          ${esc(
            t("brand")
          )}

          <span
            class="optional"
          >
            ${esc(
              t("optional")
            )}
          </span>
        </label>

        <div
          class="choices"
        >

          ${
            item.brands
              .map(
                option => `
                  <button
                    type="button"
                    class="choice brandChoice ${
                      brand ===
                      option
                        ? "selected"
                        : ""
                    }"
                    data-brand="${esc(
                      option
                    )}"
                  >
                    ${esc(
                      option
                    )}
                  </button>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="brand"
          value="${esc(
            brand
          )}"
        >

      </div>
    `;
  }

  /* =======================================================
     EDITOR BIND
     ======================================================= */

  function bindEditor(
    item
  ) {
    const form =
      document.getElementById(
        "materialForm"
      );

    document
      .getElementById(
        "itemBack"
      )
      ?.addEventListener(
        "click",
        () => {
          goBack();
        }
      );

    /* Dynamic fields */

    document
      .querySelectorAll(
        "[data-field]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const index =
                button.dataset
                  .field;

              const hidden =
                document.getElementById(
                  `field_${index}`
                );

              if (!hidden) {
                return;
              }

              hidden.value =
                button.dataset
                  .value ||
                "";

              document
                .querySelectorAll(
                  `[data-field="${index}"]`
                )
                .forEach(
                  element =>
                    element.classList.remove(
                      "selected"
                    )
                );

              button.classList.add(
                "selected"
              );
            }
          );
        }
      );

    /* Unit */

    document
      .querySelectorAll(
        "[data-unit]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const input =
                document.getElementById(
                  "unit"
                );

              if (!input) {
                return;
              }

              input.value =
                button.dataset
                  .unit ||
                "";

              document
                .querySelectorAll(
                  "[data-unit]"
                )
                .forEach(
                  element =>
                    element.classList.remove(
                      "selected"
                    )
                );

              button.classList.add(
                "selected"
              );
            }
          );
        }
      );

    /* Brand */

    document
      .querySelectorAll(
        "[data-brand]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const input =
                document.getElementById(
                  "brand"
                );

              if (!input) {
                return;
              }

              input.value =
                button.dataset
                  .brand ||
                "";

              document
                .querySelectorAll(
                  "[data-brand]"
                )
                .forEach(
                  element =>
                    element.classList.remove(
                      "selected"
                    )
                );

              button.classList.add(
                "selected"
              );
            }
          );
        }
      );

    /* Quantity */

    const quantity =
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

    if (
      minus &&
      quantity
    ) {
      minus.addEventListener(
        "click",
        () => {

          let value =
            Number(
              quantity.value ||
                0
            );

          value =
            Math.max(
              0,
              value - 1
            );

          quantity.value =
            value > 0
              ? value
              : "";
        }
      );
    }

    if (
      plus &&
      quantity
    ) {
      plus.addEventListener(
        "click",
        () => {

          let value =
            Number(
              quantity.value ||
                0
            );

          value += 1;

          quantity.value =
            value;
        }
      );
    }

    /* Submit */

    if (form) {
      form.addEventListener(
        "submit",
        event => {

          event.preventDefault();

          if (
            !quantity ||
            !quantity.value ||
            Number(
              quantity.value
            ) <= 0
          ) {
            showToast(
              t(
                "enterQuantity"
              )
            );

            quantity?.focus();

            return;
          }

          const values = {};

          item.fields.forEach(
            (
              _field,
              index
            ) => {

              const input =
                document.getElementById(
                  `field_${index}`
                );

              values[
                `field_${index}`
              ] =
                input?.value ||
                "";
            }
          );

          values.quantity =
            quantity.value;

          const unitInput =
            document.getElementById(
              "unit"
            );

          values.unit =
            unitInput?.value ||
            item.units[0] ||
            "";

          const brandInput =
            document.getElementById(
              "brand"
            );

          values.brand =
            brandInput?.value ||
            "";

          /*
            Carry unit forward.
          */

          if (
            values.unit
          ) {
            state.lastUnit =
              values.unit;

            safeSet(
              CONFIG.unitKey,
              values.unit
            );
          }

          const record = {
            id:
              state.editEstimateIndex >= 0
                ? state
                    .estimateItems[
                      state
                        .editEstimateIndex
                    ].id
                : createId(),

            stage:
              STAGES[
                state.stageIndex
              ].code,

            stageTitle:
              STAGES[
                state.stageIndex
              ].title,

            stageIndex:
              state.stageIndex,

            section:
              item.section,

            sectionIndex:
              state.sectionIndex,

            material:
              item.name,

            itemIndex:
              state.itemIndex,

            values,

            createdAt:
              state.editEstimateIndex >=
              0
                ? state
                    .estimateItems[
                      state
                        .editEstimateIndex
                    ].createdAt
                : Date.now()
          };

          /* UPDATE */

          if (
            state.editEstimateIndex >=
            0
          ) {
            state.estimateItems[
              state.editEstimateIndex
            ] = record;

            saveEstimate();

            showToast(
              t("updated")
            );

            state.editEstimateIndex =
              -1;

            /*
              After edit go to estimate.
            */

            navigate(
              "estimate"
            );

            return;
          }

          /* ADD */

          state.estimateItems.push(
            record
          );

          saveEstimate();

          showToast(
            t("saved")
          );

          /*
            Add completed.
            Open next item.
          */

          openNextItem();
        }
      );
    }

    /* Next */

    document
      .getElementById(
        "nextBtn"
      )
      ?.addEventListener(
        "click",
        () => {

          /*
            IMPORTANT:
            Next NEVER saves current data.
          */

          openNextItem();
        }
      );
  }

  /* =======================================================
     CREATE ID
     ======================================================= */

  function createId() {
    return (
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2)
    );
  }

  /* =======================================================
     NEXT ITEM
     ======================================================= */

  function getNextPosition() {
    const stage =
      STAGES[
        state.stageIndex
      ];

    if (!stage) {
      return null;
    }

    let sectionIndex =
      state.sectionIndex;

    let itemIndex =
      state.itemIndex;

    if (
      sectionIndex === null ||
      itemIndex === null
    ) {
      return null;
    }

    /*
      Next item in same section.
    */

    if (
      stage.sections[
        sectionIndex
      ] &&
      itemIndex + 1 <
        stage.sections[
          sectionIndex
        ].items.length
    ) {
      return {
        sectionIndex,
        itemIndex:
          itemIndex + 1
      };
    }

    /*
      Next section.
    */

    for (
      let si =
        sectionIndex + 1;
      si <
      stage.sections.length;
      si++
    ) {
      if (
        stage.sections[
          si
        ].items.length
      ) {
        return {
          sectionIndex: si,
          itemIndex: 0
        };
      }
    }

    return null;
  }

  function openNextItem() {
    const next =
      getNextPosition();

    if (!next) {
      showToast(
        t(
          "stageComplete"
        )
      );

      /*
        Stay on current item.
        User can press Back.
      */

      return;
    }

    /*
      DO NOT push another
      useless browser-history
      entry here.
    */

    state.stageIndex =
      state.stageIndex;

    state.sectionIndex =
      next.sectionIndex;

    state.itemIndex =
      next.itemIndex;

    state.selectedItem =
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    state.editEstimateIndex =
      -1;

    state.page =
      "item";

    renderItemEditor();

    saveRoute();

    scrollTop();
  }

  /* =======================================================
     PREVIOUS ITEM
     ======================================================= */

  function openPreviousItem() {
    const stage =
      STAGES[
        state.stageIndex
      ];

    if (!stage) {
      return;
    }

    let sectionIndex =
      state.sectionIndex;

    let itemIndex =
      state.itemIndex;

    if (
      itemIndex > 0
    ) {
      openItemWithoutHistory(
        state.stageIndex,
        sectionIndex,
        itemIndex - 1
      );

      return;
    }

    for (
      let si =
        sectionIndex - 1;
      si >= 0;
      si--
    ) {
      const items =
        stage.sections[
          si
        ].items;

      if (items.length) {
        openItemWithoutHistory(
          state.stageIndex,
          si,
          items.length - 1
        );

        return;
      }
    }

    goBack();
  }

  function openItemWithoutHistory(
    stageIndex,
    sectionIndex,
    itemIndex
  ) {
    const item =
      getItem(
        stageIndex,
        sectionIndex,
        itemIndex
      );

    if (!item) {
      return;
    }

    state.page =
      "item";

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      sectionIndex;

    state.itemIndex =
      itemIndex;

    state.selectedItem =
      item;

    state.editEstimateIndex =
      -1;

    renderItemEditor();

    saveRoute();
  }

  /* =======================================================
     ESTIMATE PAGE
     ======================================================= */

  function renderEstimate() {
    main.innerHTML = `
      <section
        class="page estimatePage"
      >

        <div
          class="pageTitle"
        >

          <h2>
            ${esc(
              t("estimate")
            )}
          </h2>

          <span>
            ${
              state
                .estimateItems
                .length
            }
          </span>

        </div>

        ${
          state.estimateItems
            .length
            ? `
              <div
                class="estimateList"
              >

                ${
                  state
                    .estimateItems
                    .map(
                      (
                        record,
                        index
                      ) =>
                        renderEstimateRecord(
                          record,
                          index
                        )
                    )
                    .join("")
                }

              </div>

              <button
                id="clearEstimate"
                class="danger"
                type="button"
              >
                ${esc(
                  t(
                    "clearEstimate"
                  )
                )}
              </button>
            `
            : `
              <div
                class="emptyState"
              >

                <div
                  class="emptyIcon"
                >
                  ▤
                </div>

                <h3>
                  ${esc(
                    t(
                      "estimateEmpty"
                    )
                  )}
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
      .forEach(
        card => {

          card.addEventListener(
            "click",
            () => {

              editEstimate(
                Number(
                  card.dataset
                    .estimateIndex
                )
              );
            }
          );
        }
      );

    document
      .getElementById(
        "clearEstimate"
      )
      ?.addEventListener(
        "click",
        clearEstimate
      );

    scrollTop();
  }

  /* =======================================================
     ESTIMATE RECORD
     ======================================================= */

  function renderEstimateRecord(
    record,
    index
  ) {
    const values =
      record.values || {};

    return `
      <div
        class="estimateCard"
        data-estimate-index="${index}"
      >

        <div
          class="estimateCardTop"
        >

          <span>
            ${esc(
              record.stage ||
                ""
            )}
          </span>

          <b>
            ${esc(
              materialName(
                record.material ||
                  ""
              )
            )}
          </b>

        </div>

        <div
          class="estimateDetails"
        >

          <span>
            ${esc(
              t("quantity")
            )}:
            ${esc(
              values.quantity ||
                ""
            )}
          </span>

          <span>
            ${esc(
              t("unit")
            )}:
            ${esc(
              values.unit ||
                ""
            )}
          </span>

          ${
            values.brand
              ? `
                <span>
                  ${esc(
                    t("brand")
                  )}:
                  ${esc(
                    values.brand
                  )}
                </span>
              `
              : ""
          }

        </div>

        <div
          class="estimateActions"
        >

          <button
            type="button"
            class="secondary editEstimate"
            data-estimate-edit="${index}"
          >
            ${esc(
              t("edit")
            )}
          </button>

          <button
            type="button"
            class="danger deleteEstimate"
            data-estimate-delete="${index}"
          >
            ${esc(
              t("delete")
            )}
          </button>

        </div>

      </div>
    `;
  }

  /* =======================================================
     ESTIMATE ACTIONS
     ======================================================= */

  function bindEstimateActions() {
    document
      .querySelectorAll(
        "[data-estimate-edit]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              editEstimate(
                Number(
                  button.dataset
                    .estimateEdit
                )
              );
            }
          );
        }
      );

    document
      .querySelectorAll(
        "[data-estimate-delete]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              deleteEstimate(
                Number(
                  button.dataset
                    .estimateDelete
                )
              );
            }
          );
        }
      );
  }

  /* =======================================================
     CLEAR ESTIMATE
     ======================================================= */

  function clearEstimate() {
    const answer =
      window.confirm(
        state.language ===
          "hi"
          ? "क्या पूरा एस्टिमेट साफ करना है?"
          : "Clear complete estimate?"
      );

    if (!answer) {
      return;
    }

    state.estimateItems =
      [];

    saveEstimate();

    showToast(
      t("cleared")
    );

    renderEstimate();
  }

  /* =======================================================
     DELETE ESTIMATE
     ======================================================= */

  function deleteEstimate(
    index
  ) {
    if (
      !state.estimateItems[
        index
      ]
    ) {
      return;
    }

    state.estimateItems.splice(
      index,
      1
    );

    saveEstimate();

    showToast(
      t("deleted")
    );

    renderEstimate();
  }

  /* =======================================================
     EDIT ESTIMATE
     ======================================================= */

  function editEstimate(
    estimateIndex
  ) {
    const record =
      state.estimateItems[
        estimateIndex
      ];

    if (!record) {
      return;
    }

    let stageIndex =
      Number.isInteger(
        record.stageIndex
      )
        ? record.stageIndex
        : -1;

    let sectionIndex =
      Number.isInteger(
        record.sectionIndex
      )
        ? record.sectionIndex
        : -1;

    let itemIndex =
      Number.isInteger(
        record.itemIndex
      )
        ? record.itemIndex
        : -1;

    /*
      Backward compatibility:
      old saved records may not
      have indexes.
    */

    if (
      !STAGES[stageIndex]
    ) {
      stageIndex =
        STAGES.findIndex(
          stage =>
            stage.code ===
            record.stage
        );
    }

    if (
      stageIndex < 0
    ) {
      return;
    }

    const stage =
      STAGES[
        stageIndex
      ];

    /*
      Find section.
    */

    if (
      !stage.sections[
        sectionIndex
      ]
    ) {
      sectionIndex =
        stage.sections.findIndex(
          section =>
            section.name ===
            record.section
        );
    }

    /*
      Find item.
    */

    if (
      !stage.sections[
        sectionIndex
      ]
    ) {
      return;
    }

    if (
      !stage.sections[
        sectionIndex
      ].items[itemIndex]
    ) {
      itemIndex =
        stage.sections[
          sectionIndex
        ].items.findIndex(
          item =>
            item.name ===
            record.material
        );
    }

    if (
      itemIndex < 0
    ) {
      return;
    }

    const item =
      stage.sections[
        sectionIndex
      ].items[
        itemIndex
      ];

    state.page =
      "item";

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      sectionIndex;

    state.itemIndex =
      itemIndex;

    state.selectedItem =
      item;

    state.editEstimateIndex =
      estimateIndex;

    renderItemEditor();

    saveRoute();

    scrollTop();
  }

  /* =======================================================
     CALCULATOR
     ======================================================= */

  function renderCalculator() {
    main.innerHTML = `
      <section
        class="page calculatorPage"
      >

        <div
          class="pageTitle"
        >
          <h2>
            ${esc(
              t(
                "calculatorTitle"
              )
            )}
          </h2>
        </div>

        <div
          class="calculatorGrid"
        >

          <div
            class="calcCard"
          >

            <h3>
              V = I × R
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
              Calculate V
            </button>

            <div
              id="calcVResult"
              class="calcResult"
            >
              —
            </div>

          </div>

          <div
            class="calcCard"
          >

            <h3>
              I = V ÷ R
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
              Calculate I
            </button>

            <div
              id="calcIResult"
              class="calcResult"
            >
              —
            </div>

          </div>

          <div
            class="calcCard"
          >

            <h3>
              R = V ÷ I
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
              Calculate R
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

    scrollTop();
  }

  function bindCalculator() {
    document
      .getElementById(
        "calcV"
      )
      ?.addEventListener(
        "click",
        () => {

          const I =
            Number(
              document
                .getElementById(
                  "calcI"
                )
                ?.value
            );

          const R =
            Number(
              document
                .getElementById(
                  "calcR"
                )
                ?.value
            );

          const result =
            document.getElementById(
              "calcVResult"
            );

          if (
            result
          ) {
            result.textContent =
              I &&
              R
                ? `${I * R} V`
                : "—";
          }
        }
      );

    document
      .getElementById(
        "calcI2"
      )
      ?.addEventListener(
        "click",
        () => {

          const V =
            Number(
              document
                .getElementById(
                  "calcV2"
                )
                ?.value
            );

          const R =
            Number(
              document
                .getElementById(
                  "calcR2"
                )
                ?.value
            );

          const result =
            document.getElementById(
              "calcIResult"
            );

          if (
            result
          ) {
            result.textContent =
              V &&
              R
                ? `${V / R} A`
                : "—";
          }
        }
      );

    document
      .getElementById(
        "calcR3"
      )
      ?.addEventListener(
        "click",
        () => {

          const V =
            Number(
              document
                .getElementById(
                  "calcV3"
                )
                ?.value
            );

          const I =
            Number(
              document
                .getElementById(
                  "calcI3"
                )
                ?.value
            );

          const result =
            document.getElementById(
              "calcRResult"
            );

          if (
            result
          ) {
            result.textContent =
              V &&
              I
                ? `${V / I} Ω`
                : "—";
          }
        }
      );
  }

  /* =======================================================
     SETTINGS
     ======================================================= */

  function renderSettings() {
    main.innerHTML = `
      <section
        class="page settingsPage"
      >

        <div
          class="pageTitle"
        >
          <h2>
            ${esc(
              t(
                "settingsTitle"
              )
            )}
          </h2>
        </div>

        <div
          class="settingsCard"
        >

          <div
            class="settingRow"
          >

            <div>
              <b>
                ${esc(
                  t(
                    "chooseView"
                  )
                )}
              </b>

              <small>
                ${esc(
                  viewLabel(
                    state.view
                  )
                )}
              </small>
            </div>

            <button
              id="settingsView"
              class="secondary"
              type="button"
            >
              ${viewIcon(
                state.view
              )}
              ${esc(
                viewLabel(
                  state.view
                )
              )}
            </button>

          </div>

          <div
            class="settingRow"
          >

            <div>
              <b>
                Language
              </b>

              <small>
                Hindi / English
              </small>
            </div>

            <button
              id="settingsLang"
              class="secondary"
              type="button"
            >
              ${
                state.language ===
                "hi"
                  ? "EN"
                  : "हि"
              }
            </button>

          </div>

          <div
            class="settingRow"
          >

            <div>
              <b>
                Theme
              </b>

              <small>
                ${
                  state.theme ===
                  "dark"
                    ? t("dark")
                    : t("light")
                }
              </small>
            </div>

            <button
              id="settingsTheme"
              class="secondary"
              type="button"
            >
              ${
                state.theme ===
                "dark"
                  ? "☀️"
                  : "🌙"
              }
            </button>

          </div>

        </div>

      </section>
    `;

    document
      .getElementById(
        "settingsLang"
      )
      ?.addEventListener(
        "click",
        () => {

          state.language =
            state.language ===
            "hi"
              ? "en"
              : "hi";

          applyLanguage();
        }
      );

    document
      .getElementById(
        "settingsTheme"
      )
      ?.addEventListener(
        "click",
        () => {

          state.theme =
            state.theme ===
            "dark"
              ? "light"
              : "dark";

          applyTheme();

          renderSettings();
        }
      );

    document
      .getElementById(
        "settingsView"
      )
      ?.addEventListener(
        "click",
        () => {

          const current =
            VIEW_MODES.findIndex(
              item =>
                item[0] ===
                state.view
            );

          const next =
            VIEW_MODES[
              (
                current + 1
              ) %
                VIEW_MODES.length
            ];

          state.view =
            next[0];

          safeSet(
            CONFIG.viewKey,
            state.view
          );

          renderSettings();
        }
      );

    scrollTop();
  }

  /* =======================================================
     TOAST
     ======================================================= */

  let toastTimer =
    null;

  function showToast(
    message
  ) {
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
     SCROLL TOP
     ======================================================= */

  function scrollTop() {
    try {
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
    } catch (error) {
      window.scrollTo(
        0,
        0
      );
    }
  }

  /* =======================================================
     BACK NAVIGATION
     ======================================================= */

  let exitWarningShown =
    false;

  function goBack() {

    /*
      1. Drawer open
    */

    if (
      state.drawerOpen
    ) {
      closeDrawer();
      return;
    }

    /*
      2. View selector open
    */

    const viewOptions =
      document.getElementById(
        "viewOptions"
      );

    if (
      viewOptions &&
      !viewOptions.hasAttribute(
        "hidden"
      )
    ) {
      viewOptions.setAttribute(
        "hidden",
        ""
      );

      document
        .getElementById(
          "viewToggle"
        )
        ?.setAttribute(
          "aria-expanded",
          "false"
        );

      return;
    }

    /*
      3. Real internal history
    */

    const previous =
      state.history.pop();

    if (previous) {

      restoreSnapshot(
        previous
      );

      saveRoute();

      return;
    }

    /*
      4. Current item -> stage
    */

    if (
      state.page === "item"
    ) {
      state.page =
        "stage";

      state.itemIndex =
        null;

      state.editEstimateIndex =
        -1;

      renderStage();

      saveRoute();

      return;
    }

    /*
      5. Stage -> home
    */

    if (
      state.page === "stage"
    ) {
      state.page =
        "home";

      state.stageIndex =
        null;

      state.sectionIndex =
        null;

      state.itemIndex =
        null;

      renderHome();

      saveRoute();

      return;
    }

    /*
      6. Other pages -> home
    */

    if (
      state.page !== "home"
    ) {
      state.page =
        "home";

      state.stageIndex =
        null;

      state.sectionIndex =
        null;

      state.itemIndex =
        null;

      renderHome();

      saveRoute();

      return;
    }

    /*
      7. Home exit warning
    */

    if (
      !exitWarningShown
    ) {
      exitWarningShown =
        true;

      showToast(
        t(
          "closeWarning"
        )
      );

      setTimeout(
        () => {
          exitWarningShown =
            false;
        },
        1800
      );

      return;
    }

    /*
      Allow browser history
      on second back.
    */

    try {
      history.back();
    } catch (error) {}
  }

  function restoreSnapshot(
    snapshot
  ) {
    state.page =
      snapshot.page ||
      "home";

    state.stageIndex =
      Number.isInteger(
        snapshot.stageIndex
      )
        ? snapshot.stageIndex
        : null;

    state.sectionIndex =
      Number.isInteger(
        snapshot.sectionIndex
      )
        ? snapshot.sectionIndex
        : null;

    state.itemIndex =
      Number.isInteger(
        snapshot.itemIndex
      )
        ? snapshot.itemIndex
        : null;

    state.editEstimateIndex =
      -1;

    if (
      state.page === "item"
    ) {

      const item =
        getItem(
          state.stageIndex,
          state.sectionIndex,
          state.itemIndex
        );

      if (!item) {
        state.page =
          "stage";

        state.itemIndex =
          null;

        state.selectedItem =
          null;

        renderStage();

        return;
      }

      state.selectedItem =
        item;

      renderItemEditor();

      return;
    }

    if (
      state.page === "stage"
    ) {
      renderStage();
      return;
    }

    renderCurrentPage();
  }

  /* =======================================================
     BROWSER HISTORY
     ======================================================= */

  function setupBrowserHistory() {
    try {
      history.replaceState(
        {
          electroFix:
            true
        },
        "",
        location.href
      );

      history.pushState(
        {
          electroFix:
            true
        },
        "",
        location.href
      );
    } catch (error) {}
  }

  window.addEventListener(
    "popstate",
    event => {
      event.preventDefault();

      goBack();

      try {
        history.pushState(
          {
            electroFix:
              true
          },
          "",
          location.href
        );
      } catch (error) {}
    }
  );

  /* =======================================================
     KEYBOARD
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      if (
        state.drawerOpen
      ) {
        closeDrawer();
        return;
      }

      const viewOptions =
        document.getElementById(
          "viewOptions"
        );

      if (
        viewOptions &&
        !viewOptions.hasAttribute(
          "hidden"
        )
      ) {
        viewOptions.setAttribute(
          "hidden",
          ""
        );

        return;
      }

      goBack();
    }
  );

  /* =======================================================
     PAGE RENDER
     ======================================================= */

  function renderCurrentPage() {
    switch (
      state.page
    ) {

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

    /*
      Estimate action buttons
      are bound after rendering.
    */

    if (
      state.page ===
      "estimate"
    ) {
      bindEstimateActions();
    }
  }

  /* =======================================================
     RESTORE ITEM STATE
     ======================================================= */

  function restoreItemState() {
    if (
      state.page !==
      "item"
    ) {
      return;
    }

    const item =
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    if (!item) {
      state.page =
        "stage";

      state.itemIndex =
        null;

      state.selectedItem =
        null;

      return;
    }

    state.selectedItem =
      item;
  }

  /* =======================================================
     START
     ======================================================= */

  restoreRoute();

  /*
    Validate restored route.
  */

  if (
    state.stageIndex !==
    null &&
    !STAGES[
      state.stageIndex
    ]
  ) {
    state.page =
      "home";

    state.stageIndex =
      null;

    state.sectionIndex =
      null;

    state.itemIndex =
      null;
  }

  restoreItemState();

  applyTheme();

  renderCurrentPage();

  setupBrowserHistory();

  /* =======================================================
     DEBUG
     ======================================================= */

  console.log(
    "======================================"
  );

  console.log(
    "Sandeep ElectroFix - Estimate List"
  );

  console.log(
    "Raw stages:",
    RAW_MATERIALS.length
  );

  console.log(
    "Parsed stages:",
    STAGES.length
  );

  console.log(
    "Total materials:",
    getAllItems().length
  );

  STAGES.forEach(
    (
      stage,
      index
    ) => {

      const count =
        stage.sections.reduce(
          (
            total,
            section
          ) =>
            total +
            section.items.length,
          0
        );

      console.log(
        `${index + 1}. ${
          stage.code
        } → ${
          stage.title
        } → ${
          count
        } materials`
      );
    }
  );

  console.log(
    "======================================"
  );

})();
