/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   5 FILE STRUCTURE

   index.html
   style.css
   config.js
   material.js
   app.js

   IMPORTANT
   ---------------------------------------------------------
   material.js master data is NEVER modified.

   This app.js creates the missing dynamic UI shell inside
   #main so the revised index.html can work correctly.

   FEATURES
   ---------------------------------------------------------
   ✓ Hindi / English
   ✓ Dark / Light
   ✓ Circular top theme switch
   ✓ Electric Gradient hamburger
   ✓ Drawer + overlay
   ✓ Bottom navigation
   ✓ Home / Materials / Estimate / Calculator / Settings
   ✓ Stage View - 10 modes
   ✓ Material View - 10 modes
   ✓ Search
   ✓ Quantity + / -
   ✓ Unit carry forward
   ✓ Optional Brand
   ✓ Optional Price
   ✓ Explicit Add
   ✓ Next NEVER auto-adds
   ✓ Auto Next after Add
   ✓ Back / Previous / Next
   ✓ Estimate Edit / Delete
   ✓ LocalStorage
   ✓ Refresh state restore
   ✓ Android / Browser Back
   ✓ Short Toast
   ✓ Backup / Reset
   ✓ Electrical Calculator
   ✓ Loader completely removed
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     01. CONFIG / MASTER DATA
  ======================================================= */

  const CONFIG =
    window.AppConfig ||
    window.APP_CONFIG ||
    {};

  const MATERIAL_DATA =
    window.MaterialData ||
    {};

  const MATERIALS =
    Array.isArray(MATERIAL_DATA.MATERIALS)
      ? MATERIAL_DATA.MATERIALS
      : Array.isArray(window.MATERIALS)
        ? window.MATERIALS
        : [];

  const STAGES =
    Array.isArray(MATERIAL_DATA.MATERIAL_STAGES)
      ? MATERIAL_DATA.MATERIAL_STAGES
      : Array.isArray(window.MATERIAL_STAGES)
        ? window.MATERIAL_STAGES
        : [];

  const APP_VERSION = "1.1.0";

  /* =======================================================
     02. STORAGE
  ======================================================= */

  const STORAGE = {
    estimate:
      CONFIG?.storage?.estimateItems ||
      CONFIG?.storageKey ||
      "sandeepEstimateItems",

    language:
      CONFIG?.storage?.materialLanguage ||
      CONFIG?.languageKey ||
      "sandeepMaterialLang",

    materialView:
      CONFIG?.storage?.materialView ||
      CONFIG?.viewKey ||
      "sandeepMaterialView",

    stageView:
      CONFIG?.storage?.stageView ||
      "sandeepStageView",

    theme:
      CONFIG?.storage?.theme ||
      CONFIG?.themeKey ||
      "sandeepTheme",

    navigation:
      CONFIG?.storage?.navigation ||
      "sandeepEstimateNavigation"
  };

  /* =======================================================
     03. VIEW MODES
  ======================================================= */

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

  /* =======================================================
     04. STATE
  ======================================================= */

  const state = {
    language:
      localStorage.getItem(STORAGE.language) ||
      CONFIG?.language?.default ||
      CONFIG?.defaultLanguage ||
      "hi",

    theme:
      localStorage.getItem(STORAGE.theme) ||
      CONFIG?.theme?.default ||
      "dark",

    materialView:
      localStorage.getItem(STORAGE.materialView) ||
      "grid",

    stageView:
      localStorage.getItem(STORAGE.stageView) ||
      "grid",

    currentPage: "home",

    currentStageId: null,

    currentItemIndex: 0,

    currentItem: null,

    estimateItems: [],

    draftValues: {},

    editingEstimateId: null,

    lastUnit: "",

    searchText: "",

    menuOpen: false,

    historyReady: false,

    initialized: false
  };

  /* =======================================================
     05. DOM
  ======================================================= */

  const $ = id =>
    document.getElementById(id);

  const DOM = {};

  function cacheDOM() {
    const ids = [
      "app",
      "main",

      "menuBtn",
      "drawer",
      "closeMenu",
      "drawerOverlay",
      "bottomNav",
      "themeBtn",
      "langBtn",

      "brandHead",
      "topLogo",
      "appTitle",
      "subTitle",

      "homePage",
      "homeHero",
      "heroLogo",
      "businessName",
      "businessTagline",

      "searchContainer",
      "searchIcon",
      "materialSearch",
      "searchClearButton",

      "stageCardsContainer",
      "stageViewSelector",
      "stageViewBtn",
      "stageViewOptions",

      "materialPage",
      "materialHeader",
      "materialBackButton",
      "materialStageNumber",
      "materialStageTitle",
      "materialStageTitleHi",
      "materialList",

      "materialViewSelector",
      "materialViewButton",
      "materialViewOptions",

      "materialEditor",
      "materialEditorTop",
      "editorBackButton",
      "editorItemNumber",
      "editorItemName",
      "editorItemNameHi",
      "editorImageContainer",
      "editorItemImage",
      "materialFields",

      "quantityField",
      "quantityInput",
      "quantityMinus",
      "quantityPlus",

      "unitField",
      "unitSelect",

      "brandField",
      "brandSelect",

      "priceField",
      "priceInput",

      "editorActions",
      "itemBackButton",
      "itemNextButton",
      "addToEstimateButton",

      "estimatePage",
      "estimateContent",
      "estimateEmpty",
      "estimateItems",

      "calculatorPage",

      "voltageCalculator",
      "voltageInput",
      "voltageResult",

      "currentCalculator",
      "currentInput",
      "currentResult",

      "powerCalculator",
      "powerInput",
      "powerResult",

      "resistanceCalculator",
      "resistanceInput",
      "resistanceResult",

      "formulaSection",
      "inverterExamples",

      "settingsPage",

      "settingLanguage",
      "settingsLanguageButton",

      "settingTheme",
      "themeToggleButton",

      "settingMaterialView",

      "settingBackup",
      "backupButton",

      "settingReset",
      "resetButton",

      "settingAbout",
      "aboutButton",

      "appToast",
      "toastIcon",
      "toastMessage"
    ];

    ids.forEach(id => {
      DOM[id] = $(id);
    });

    DOM.hamburgerButton = DOM.menuBtn;
    DOM.sideMenu = DOM.drawer;
    DOM.sideMenuClose = DOM.closeMenu;
    DOM.menuOverlay = DOM.drawerOverlay;
    DOM.languageButton = DOM.langBtn;
    DOM.bottomNavigation = DOM.bottomNav;
    DOM.themeToggleButton = DOM.themeBtn;
    DOM.topBarTitle = DOM.appTitle;
  }

  /* =======================================================
     06. DYNAMIC UI SHELL
  ======================================================= */

  function ensureMainShell() {
    if (!DOM.main) return;

    /*
      The revised index.html intentionally contains only:

      <main id="main"></main>

      Therefore all application pages are generated here.
    */

    if (!DOM.homePage) {
      DOM.main.innerHTML = createApplicationShellHTML();
      cacheDOM();
    }

    ensureToast();
  }

  function createApplicationShellHTML() {
    return `
      <section id="homePage" class="page home-page">
        <div id="homeHero" class="hero">
          <img
            id="heroLogo"
            class="heroLogo"
            src="logo.png"
            alt="Sandeep ElectroFix"
          >

          <div id="businessName" class="businessName">
            Sandeep ElectroFix
          </div>

          <div id="businessTagline" class="businessTagline">
            Powering Your Trust
          </div>
        </div>

        <div id="searchContainer" class="searchBox">
          <span id="searchIcon" class="searchIcon">⌕</span>

          <input
            id="materialSearch"
            type="search"
            autocomplete="off"
            placeholder="Search material / सामग्री खोजें"
            aria-label="Search material"
          >

          <button
            id="searchClearButton"
            type="button"
            class="searchClear"
            hidden
            aria-label="Clear search"
          >×</button>
        </div>

        <div
          id="stageViewSelector"
          class="stageViewSelector viewSelector"
        >
          <button
            id="stageViewBtn"
            class="stageViewBtn viewSelectorButton"
            type="button"
            aria-label="Stage view"
          >
            <span class="viewSelectorIcon">▦</span>
          </button>

          <div
            id="stageViewOptions"
            class="stageViewOptions viewOptions"
          ></div>
        </div>

        <div
          id="stageCardsContainer"
          class="stageGrid"
        ></div>
      </section>

      <section
        id="materialPage"
        class="page material-page"
        hidden
      >
        <div id="materialHeader" class="stageHead">
          <button
            id="materialBackButton"
            class="back"
            type="button"
          >← <span data-i18n="back">Back</span></button>

          <div class="stageHeadText">
            <div
              id="materialStageNumber"
              class="stage-number"
            ></div>

            <div
              id="materialStageTitle"
              class="stage-title"
            ></div>

            <div
              id="materialStageTitleHi"
              class="stage-title-hi"
            ></div>
          </div>

          <div
            id="materialViewSelector"
            class="viewSelector"
          >
            <button
              id="materialViewButton"
              class="viewSelectorButton"
              type="button"
              aria-label="Material view"
            >
              <span class="viewSelectorIcon">▦</span>
            </button>

            <div
              id="materialViewOptions"
              class="viewOptions"
            ></div>
          </div>
        </div>

        <div
          id="materialList"
          class="itemGrid"
        ></div>

        <section
          id="materialEditor"
          class="materialEditor"
          hidden
        >
          <div
            id="materialEditorTop"
            class="formCard"
          >
            <button
              id="editorBackButton"
              class="back"
              type="button"
            >← <span data-i18n="back">Back</span></button>

            <div class="editorTitleBlock">
              <div
                id="editorItemNumber"
                class="material-item-number"
              ></div>

              <div
                id="editorItemName"
                class="material-name"
              ></div>

              <div
                id="editorItemNameHi"
                class="material-name-hi"
              ></div>
            </div>

            <div
              id="editorImageContainer"
              class="editorImageContainer"
              hidden
            >
              <img
                id="editorItemImage"
                class="editorItemImage"
                alt=""
              >
            </div>
          </div>

          <div
            id="materialFields"
            class="formCard"
          ></div>

          <div
            id="quantityField"
            class="formCard field"
          >
            <label class="field-label">
              Quantity / क्वांटिटी
            </label>

            <div class="qtyRow">
              <button
                id="quantityMinus"
                class="qtyButton"
                type="button"
              >−</button>

              <input
                id="quantityInput"
                class="field-input qtyInput"
                type="number"
                min="1"
                inputmode="numeric"
                autocomplete="off"
              >

              <button
                id="quantityPlus"
                class="qtyButton"
                type="button"
              >+</button>
            </div>
          </div>

          <div
            id="unitField"
            class="formCard field"
          >
            <label
              class="field-label"
              for="unitSelect"
            >
              Unit / यूनिट
            </label>

            <select
              id="unitSelect"
              class="field-input"
            ></select>
          </div>

          <div
            id="brandField"
            class="formCard field"
          >
            <label
              class="field-label"
              for="brandSelect"
            >
              Brand / ब्रांड
            </label>

            <select
              id="brandSelect"
              class="field-input"
            ></select>
          </div>

          <div
            id="priceField"
            class="formCard field priceWrap"
            hidden
          >
            <label
              class="field-label"
              for="priceInput"
            >
              Price / कीमत
            </label>

            <input
              id="priceInput"
              class="field-input"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              autocomplete="off"
            >
          </div>

          <div
            id="editorActions"
            class="editorActions"
          >
            <button
              id="itemBackButton"
              class="secondary"
              type="button"
            >
              ← Previous / पिछला
            </button>

            <button
              id="addToEstimateButton"
              class="primary"
              type="button"
            >
              + Add / जोड़ें
            </button>

            <button
              id="itemNextButton"
              class="secondary"
              type="button"
            >
              Next / अगला →
            </button>
          </div>
        </section>
      </section>

      <section
        id="estimatePage"
        class="page estimate-page"
        hidden
      >
        <div class="pageHeader">
          <h2>
            Estimate / एस्टिमेट
          </h2>
        </div>

        <div
          id="estimateContent"
          class="estimateContent"
        >
          <div
            id="estimateEmpty"
            class="empty-state"
            hidden
          >
            <div class="emptyIcon">▤</div>
            <strong>
              No estimate items
            </strong>
            <span>
              अभी कोई आइटम नहीं जोड़ा गया।
            </span>
          </div>

          <div
            id="estimateItems"
            class="estimateItems"
          ></div>
        </div>
      </section>

      <section
        id="calculatorPage"
        class="page calculator-page"
        hidden
      >
        <div class="pageHeader">
          <h2>
            Calculator / कैलकुलेटर
          </h2>
        </div>

        <div class="calculatorGrid">

          <div
            id="voltageCalculator"
            class="calculatorCard"
          >
            <h3>
              Voltage / वोल्टेज
            </h3>

            <input
              id="voltageInput"
              class="field-input"
              type="number"
              inputmode="decimal"
              placeholder="Current (A)"
            >

            <div
              id="voltageResult"
              class="calculatorResult"
            >
              Enter a value
            </div>

            <small>
              V = I × R
            </small>
          </div>

          <div
            id="currentCalculator"
            class="calculatorCard"
          >
            <h3>
              Current / करंट
            </h3>

            <input
              id="currentInput"
              class="field-input"
              type="number"
              inputmode="decimal"
              placeholder="Current (A)"
            >

            <div
              id="currentResult"
              class="calculatorResult"
            >
              Enter a value
            </div>

            <small>
              I = P ÷ V
            </small>
          </div>

          <div
            id="powerCalculator"
            class="calculatorCard"
          >
            <h3>
              Power / पावर
            </h3>

            <input
              id="powerInput"
              class="field-input"
              type="number"
              inputmode="decimal"
              placeholder="Current (A)"
            >

            <div
              id="powerResult"
              class="calculatorResult"
            >
              Enter current
            </div>

            <small>
              P = V × I
            </small>
          </div>

          <div
            id="resistanceCalculator"
            class="calculatorCard"
          >
            <h3>
              Resistance / रेजिस्टेंस
            </h3>

            <input
              id="resistanceInput"
              class="field-input"
              type="number"
              inputmode="decimal"
              placeholder="Current (A)"
            >

            <div
              id="resistanceResult"
              class="calculatorResult"
            >
              Enter current
            </div>

            <small>
              R = V ÷ I
            </small>
          </div>

        </div>

        <div
          id="formulaSection"
          class="formulaSection"
        ></div>

        <div
          id="inverterExamples"
          class="formulaSection"
        ></div>
      </section>

      <section
        id="settingsPage"
        class="page settings-page"
        hidden
      >
        <div class="pageHeader">
          <h2>
            Settings / सेटिंग्स
          </h2>
        </div>

        <div class="settingsList">

          <div
            id="settingLanguage"
            class="settingCard"
          >
            <div>
              <strong>
                Language / भाषा
              </strong>
              <small>
                Hindi / English
              </small>
            </div>

            <button
              id="settingsLanguageButton"
              class="secondary"
              type="button"
            >
              हिन्दी
            </button>
          </div>

          <div
            id="settingTheme"
            class="settingCard"
          >
            <div>
              <strong>
                Theme / थीम
              </strong>
              <small>
                Dark / Light
              </small>
            </div>

            <button
              id="themeToggleButton"
              class="secondary"
              type="button"
            >
              Theme
            </button>
          </div>

          <div
            id="settingMaterialView"
            class="settingCard"
          >
            <div>
              <strong>
                Material View / मटेरियल व्यू
              </strong>
              <small>
                Current: <span id="settingsCurrentView">Grid</span>
              </small>
            </div>

            <button
              id="settingsViewButton"
              class="secondary"
              type="button"
            >
              Change
            </button>
          </div>

          <div
            id="settingBackup"
            class="settingCard"
          >
            <div>
              <strong>
                Backup / बैकअप
              </strong>
              <small>
                Save estimate data
              </small>
            </div>

            <button
              id="backupButton"
              class="secondary"
              type="button"
            >
              Backup
            </button>
          </div>

          <div
            id="settingReset"
            class="settingCard"
          >
            <div>
              <strong>
                Reset / रीसेट
              </strong>
              <small>
                Delete saved estimate
              </small>
            </div>

            <button
              id="resetButton"
              class="danger"
              type="button"
            >
              Reset
            </button>
          </div>

          <div
            id="settingAbout"
            class="settingCard"
          >
            <div>
              <strong>
                About / जानकारी
              </strong>
              <small>
                Sandeep ElectroFix
              </small>
            </div>

            <button
              id="aboutButton"
              class="secondary"
              type="button"
            >
              About
            </button>
          </div>

        </div>
      </section>
    `;
  }

  function ensureToast() {
    if ($("appToast")) {
      cacheDOM();
      return;
    }

    const toast = document.createElement("div");

    toast.id = "appToast";
    toast.className = "app-toast";

    toast.innerHTML = `
      <span id="toastIcon" class="toastIcon">✓</span>
      <span id="toastMessage" class="toastMessage"></span>
    `;

    document.body.appendChild(toast);

    cacheDOM();
  }

  /* =======================================================
     07. STORAGE
  ======================================================= */

  function loadEstimateItems() {
    try {
      const raw =
        localStorage.getItem(
          STORAGE.estimate
        );

      if (!raw) return [];

      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Estimate storage read error:",
        error
      );

      return [];
    }
  }

  function saveEstimateItems() {
    try {
      localStorage.setItem(
        STORAGE.estimate,
        JSON.stringify(
          state.estimateItems
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Estimate storage save error:",
        error
      );

      showToast(
        "error",
        text(
          "Storage error",
          "स्टोरेज त्रुटि"
        )
      );

      return false;
    }
  }

  function saveSetting(
    key,
    value
  ) {
    try {
      localStorage.setItem(
        key,
        String(value)
      );
    } catch (error) {
      console.error(
        "Setting save error:",
        error
      );
    }
  }

  function loadNavigationState() {
    try {
      const raw =
        localStorage.getItem(
          STORAGE.navigation
        );

      if (!raw) return null;

      const parsed =
        JSON.parse(raw);

      return parsed &&
        typeof parsed === "object"
        ? parsed
        : null;
    } catch (_) {
      return null;
    }
  }

  function saveNavigationState() {
    try {
      localStorage.setItem(
        STORAGE.navigation,
        JSON.stringify({
          page: state.currentPage,
          stageId: state.currentStageId,
          itemIndex: state.currentItemIndex,
          materialId:
            state.currentItem?.id ||
            null,
          editingEstimateId:
            state.editingEstimateId ||
            null
        })
      );
    } catch (_) {}
  }

  /* =======================================================
     08. LANGUAGE
  ======================================================= */

  function currentLanguage() {
    return state.language === "en"
      ? "en"
      : "hi";
  }

  function text(en, hi) {
    return currentLanguage() === "hi"
      ? (hi || en || "")
      : (en || hi || "");
  }

  function getObjectText(
    obj,
    fallback = ""
  ) {
    if (obj === null || obj === undefined) {
      return fallback;
    }

    if (
      typeof obj === "string" ||
      typeof obj === "number"
    ) {
      return String(obj);
    }

    if (currentLanguage() === "hi") {
      return String(
        obj.hi ??
        obj.en ??
        obj.name ??
        obj.label ??
        fallback
      );
    }

    return String(
      obj.en ??
      obj.hi ??
      obj.name ??
      obj.label ??
      fallback
    );
  }

  function setLanguage(language) {
    state.language =
      language === "en"
        ? "en"
        : "hi";

    saveSetting(
      STORAGE.language,
      state.language
    );

    document.documentElement.lang =
      state.language;

    try {
      if (
        typeof window.setMaterialLanguage ===
        "function"
      ) {
        window.setMaterialLanguage(
          state.language
        );
      }
    } catch (_) {}

    renderAll();
  }

  function toggleLanguage() {
    setLanguage(
      state.language === "hi"
        ? "en"
        : "hi"
    );
  }

  function updateLanguageButton() {
    if (DOM.langBtn) {
      DOM.langBtn.textContent =
        state.language === "hi"
          ? "हि"
          : "EN";
    }

    if (DOM.settingsLanguageButton) {
      DOM.settingsLanguageButton.textContent =
        state.language === "hi"
          ? "हिन्दी"
          : "English";
    }
  }

  /* =======================================================
     09. THEME
  ======================================================= */

  function applyTheme() {
    state.theme =
      state.theme === "light"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme =
      state.theme;

    document.body.dataset.theme =
      state.theme;

    document.body.classList.toggle(
      "light-theme",
      state.theme === "light"
    );

    saveSetting(
      STORAGE.theme,
      state.theme
    );

    updateThemeButtons();
  }

  function updateThemeButtons() {
    const isDark =
      state.theme === "dark";

    if (DOM.themeBtn) {
      DOM.themeBtn.setAttribute(
        "aria-pressed",
        isDark ? "false" : "true"
      );

      DOM.themeBtn.setAttribute(
        "aria-label",
        isDark
          ? text(
              "Switch to light theme",
              "लाइट थीम करें"
            )
          : text(
              "Switch to dark theme",
              "डार्क थीम करें"
            )
      );

      const icon =
        DOM.themeBtn.querySelector(
          ".themeIcon"
        );

      if (icon) {
        icon.textContent =
          isDark ? "☀" : "☾";
      }
    }

    if (
      DOM.themeToggleButton &&
      DOM.themeToggleButton !== DOM.themeBtn
    ) {
      DOM.themeToggleButton.textContent =
        isDark
          ? text(
              "☀ Light Mode",
              "☀ लाइट मोड"
            )
          : text(
              "☾ Dark Mode",
              "☾ डार्क मोड"
            );
    }
  }

  function toggleTheme() {
    state.theme =
      state.theme === "dark"
        ? "light"
        : "dark";

    applyTheme();

    if (
      state.currentPage ===
      "settings"
    ) {
      renderSettings();
    }
  }

  /* =======================================================
     10. BRANDING
  ======================================================= */

  function applyBranding() {
    const branding =
      CONFIG?.branding || {};

    const businessName =
      branding.businessName ||
      CONFIG?.businessName ||
      "Sandeep ElectroFix";

    const tagline =
      branding.tagline ||
      CONFIG?.tagline ||
      "Powering Your Trust";

    const logo =
      branding.logo ||
      "logo.png";

    if (DOM.topLogo) {
      DOM.topLogo.src = logo;
    }

    if (DOM.heroLogo) {
      DOM.heroLogo.src = logo;
    }

    if (DOM.businessName) {
      DOM.businessName.textContent =
        businessName;
    }

    if (DOM.businessTagline) {
      DOM.businessTagline.textContent =
        tagline;
    }

    if (DOM.subTitle) {
      DOM.subTitle.textContent =
        businessName;
    }

    updateTopBarTitle();
  }

  /* =======================================================
     11. MATERIAL HELPERS
  ======================================================= */

  function getMaterialFields(material) {
    if (!material) return [];

    if (
      Array.isArray(material.fields)
    ) {
      return material.fields.slice();
    }

    if (
      typeof MATERIAL_DATA.getSelectableFields ===
      "function"
    ) {
      try {
        return (
          MATERIAL_DATA.getSelectableFields(
            material
          ) || []
        ).slice();
      } catch (_) {}
    }

    return [];
  }

  function fieldKey(field) {
    if (!field) return "";

    return String(
      field.key ??
      field.id ??
      field.name ??
      field.field ??
      ""
    );
  }

  function normalizedFieldKey(field) {
    return fieldKey(field)
      .toLowerCase()
      .replace(
        /[\s_-]/g,
        ""
      );
  }

  function isSystemField(field) {
    return [
      "quantity",
      "qty",
      "unit",
      "brand",
      "price"
    ].includes(
      normalizedFieldKey(field)
    );
  }

  function fieldLabel(field) {
    if (!field) return "";

    if (
      typeof MATERIAL_DATA.getFieldLabel ===
      "function"
    ) {
      try {
        const result =
          MATERIAL_DATA.getFieldLabel(
            field
          );

        if (result) {
          return getObjectText(
            result,
            fieldKey(field)
          );
        }
      } catch (_) {}
    }

    return getObjectText(
      field.label ||
      field.title ||
      field,
      fieldKey(field)
    );
  }

  function normalizeOption(option) {
    if (
      typeof option === "string" ||
      typeof option === "number"
    ) {
      return {
        value: String(option),
        en: String(option),
        hi: String(option)
      };
    }

    if (!option) {
      return {
        value: "",
        en: "",
        hi: ""
      };
    }

    const value =
      option.value ??
      option.id ??
      option.key ??
      option.en ??
      option.hi ??
      option.name ??
      "";

    return {
      value: String(value),

      en:
        option.en ??
        option.label ??
        option.name ??
        String(value),

      hi:
        option.hi ??
        option.labelHi ??
        option.nameHi ??
        option.en ??
        String(value)
    };
  }

  function fieldOptions(field) {
    if (!field) return [];

    let options =
      field.options ??
      field.values ??
      field.choices ??
      [];

    if (
      typeof options ===
      "function"
    ) {
      try {
        options = options();
      } catch (_) {
        options = [];
      }
    }

    if (!Array.isArray(options)) {
      return [];
    }

    return options.map(
      normalizeOption
    );
  }

  function fieldType(field) {
    const type =
      String(
        field?.type ||
        field?.inputType ||
        ""
      ).toLowerCase();

    if (
      type === "number" ||
      type === "numeric"
    ) {
      return "number";
    }

    if (
      type === "text" ||
      type === "input"
    ) {
      return "text";
    }

    return fieldOptions(field).length
      ? "select"
      : "text";
  }

  function getMaterialById(id) {
    if (
      id === null ||
      id === undefined
    ) {
      return null;
    }

    return (
      MATERIALS.find(
        material =>
          String(material.id) ===
          String(id)
      ) || null
    );
  }

  function getStageById(id) {
    return (
      STAGES.find(
        stage =>
          String(
            stage.id ??
            stage.stage
          ) === String(id)
      ) || null
    );
  }

  function materialEnglishName(
    material
  ) {
    if (!material) return "";

    return String(
      material.name?.en ??
      material.title?.en ??
      material.en ??
      (
        typeof material.name ===
        "string"
          ? material.name
          : ""
      ) ??
      ""
    );
  }

  function materialHindiName(
    material
  ) {
    if (!material) return "";

    return String(
      material.name?.hi ??
      material.title?.hi ??
      material.hi ??
      materialEnglishName(material)
    );
  }

  function stageEnglishName(stage) {
    if (!stage) return "";

    return String(
      stage.en ??
      stage.name?.en ??
      stage.title?.en ??
      (
        typeof stage.name ===
        "string"
          ? stage.name
          : ""
      ) ??
      ""
    );
  }

  function stageHindiName(stage) {
    if (!stage) return "";

    return String(
      stage.hi ??
      stage.name?.hi ??
      stage.title?.hi ??
      stageEnglishName(stage)
    );
  }

  function getStageMaterials(stageId) {
    return MATERIALS.filter(
      material =>
        String(material.stage) ===
        String(stageId)
    );
  }

  /* =======================================================
     12. DRAFT
  ======================================================= */

  function getDraftKey(material) {
    if (!material) return "";

    return String(
      material.id ||
      `S${material.stage}-${material.no}`
    );
  }

  function getDraft(material) {
    const key =
      getDraftKey(material);

    if (!state.draftValues[key]) {
      state.draftValues[key] = {};
    }

    return state.draftValues[key];
  }

  function getDraftValue(
    material,
    key
  ) {
    return (
      getDraft(material)[key] ??
      ""
    );
  }

  function setDraftValue(
    material,
    key,
    value
  ) {
    getDraft(material)[key] =
      value;
  }

  /* =======================================================
     13. HOME
  ======================================================= */

  function renderHome() {
    if (!DOM.stageCardsContainer) {
      return;
    }

    const search =
      String(
        state.searchText || ""
      )
        .trim()
        .toLowerCase();

    const visibleMaterials =
      search
        ? MATERIALS.filter(
            material =>
              searchMatchesMaterial(
                material,
                search
              )
          )
        : MATERIALS;

    const visibleStageIds =
      new Set(
        visibleMaterials.map(
          material =>
            String(material.stage)
        )
      );

    DOM.stageCardsContainer.innerHTML =
      "";

    STAGES.forEach(
      (stage, index) => {
        const stageId =
          String(
            stage.id ??
            stage.stage ??
            index + 1
          );

        if (
          search &&
          !visibleStageIds.has(stageId)
        ) {
          return;
        }

        DOM.stageCardsContainer.appendChild(
          createStageCard(
            stage,
            index
          )
        );
      }
    );

    if (
      search &&
      !DOM.stageCardsContainer.children.length
    ) {
      const empty =
        document.createElement(
          "div"
        );

      empty.className =
        "empty-state";

      empty.textContent =
        text(
          "No matching material found.",
          "कोई मिलती हुई सामग्री नहीं मिली।"
        );

      DOM.stageCardsContainer.appendChild(
        empty
      );
    }

    applyStageView();
  }

  function createStageCard(
    stage,
    index
  ) {
    const card =
      document.createElement(
        "button"
      );

    card.type = "button";
    card.className = "stage-card";

    card.dataset.stage =
      String(
        stage.id ??
        stage.stage ??
        index + 1
      );

    const inner =
      document.createElement(
        "div"
      );

    inner.className =
      "stage-card-inner";

    const number =
      document.createElement(
        "div"
      );

    number.className =
      "stage-number";

    number.textContent =
      stage.no ??
      `STAGE ${String(
        index + 1
      ).padStart(2, "0")}`;

    inner.appendChild(number);

    if (stage.icon) {
      const icon =
        document.createElement(
          "div"
        );

      icon.className =
        "stage-icon";

      icon.textContent =
        stage.icon;

      inner.appendChild(icon);
    }

    const en =
      document.createElement(
        "div"
      );

    en.className =
      "stage-title";

    en.textContent =
      stageEnglishName(stage);

    inner.appendChild(en);

    const hi =
      document.createElement(
        "div"
      );

    hi.className =
      "stage-title-hi";

    hi.textContent =
      stageHindiName(stage);

    inner.appendChild(hi);

    if (stage.description) {
      const description =
        document.createElement(
          "div"
        );

      description.className =
        "stage-description";

      description.textContent =
        getObjectText(
          stage.description
        );

      inner.appendChild(
        description
      );
    }

    card.appendChild(inner);

    card.addEventListener(
      "click",
      () => {
        openStage(
          stage.id ??
          stage.stage ??
          index + 1
        );
      }
    );

    return card;
  }

  /* =======================================================
     14. SEARCH
  ======================================================= */

  function searchMatchesMaterial(
    material,
    query
  ) {
    if (!material) return false;

    const parts = [];

    parts.push(
      material.id || ""
    );

    parts.push(
      materialEnglishName(material)
    );

    parts.push(
      materialHindiName(material)
    );

    getMaterialFields(material)
      .forEach(field => {
        parts.push(
          fieldKey(field)
        );

        parts.push(
          fieldLabel(field)
        );

        fieldOptions(field)
          .forEach(option => {
            parts.push(
              option.value,
              option.en,
              option.hi
            );
          });
      });

    if (
      Array.isArray(
        material.brands
      )
    ) {
      material.brands.forEach(
        brand => {
          const option =
            normalizeOption(brand);

          parts.push(
            option.value,
            option.en,
            option.hi
          );
        }
      );
    }

    if (
      Array.isArray(
        material.units
      )
    ) {
      material.units.forEach(
        unit => {
          const option =
            normalizeOption(unit);

          parts.push(
            option.value,
            option.en,
            option.hi
          );
        }
      );
    }

    return parts
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  }

  function handleSearch(event) {
    state.searchText =
      event.target.value || "";

    if (DOM.searchClearButton) {
      DOM.searchClearButton.hidden =
        !state.searchText;
    }

    if (
      state.currentPage ===
      "home"
    ) {
      renderHome();
    }
  }

  function clearSearch() {
    state.searchText = "";

    if (DOM.materialSearch) {
      DOM.materialSearch.value =
        "";
    }

    if (DOM.searchClearButton) {
      DOM.searchClearButton.hidden =
        true;
    }

    renderHome();
  }

  /* =======================================================
     15. VIEW HELPERS
  ======================================================= */

  function normalizeView(view) {
    return VIEW_MODES.includes(view)
      ? view
      : "grid";
  }

  function getViewLabel(view) {
    const labels = {
      grid: text(
        "Grid",
        "ग्रिड"
      ),

      list: text(
        "List",
        "लिस्ट"
      ),

      compact: text(
        "Compact",
        "कॉम्पैक्ट"
      ),

      large: text(
        "Large",
        "बड़ा"
      ),

      mini: text(
        "Mini",
        "मिनी"
      ),

      "two-column": text(
        "2 Column",
        "2 कॉलम"
      ),

      horizontal: text(
        "Horizontal",
        "हॉरिजॉन्टल"
      ),

      "icon-list": text(
        "Icon List",
        "आइकन लिस्ट"
      ),

      timeline: text(
        "Timeline",
        "टाइमलाइन"
      ),

      dense: text(
        "Dense",
        "डेंस"
      )
    };

    return labels[view] || view;
  }

  function getViewSymbol(view) {
    const symbols = {
      grid: "▦",
      list: "☷",
      compact: "▤",
      large: "▥",
      mini: "▪",
      "two-column": "▦",
      horizontal: "▤",
      "icon-list": "☷",
      timeline: "◉",
      dense: "▦"
    };

    return symbols[view] || "▦";
  }

  function applyStageView() {
    const list =
      DOM.stageCardsContainer;

    if (!list) return;

    const view =
      normalizeView(
        state.stageView
      );

    VIEW_MODES.forEach(mode => {
      list.classList.remove(
        `view-${mode}`
      );

      list.classList.remove(
        mode
      );
    });

    list.classList.add(
      `view-${view}`
    );

    list.classList.add(view);

    updateStageViewUI(view);
  }

  function updateStageViewUI(view) {
    if (DOM.stageViewBtn) {
      const icon =
        DOM.stageViewBtn.querySelector(
          ".viewSelectorIcon"
        );

      if (icon) {
        icon.textContent =
          getViewSymbol(view);
      }

      DOM.stageViewBtn.setAttribute(
        "aria-label",
        `${text(
          "Stage view",
          "स्टेज व्यू"
        )}: ${getViewLabel(view)}`
      );
    }

    updateViewOptionsActive(
      DOM.stageViewOptions,
      view
    );
  }

  function setStageView(view) {
    if (!VIEW_MODES.includes(view)) {
      return;
    }

    state.stageView = view;

    saveSetting(
      STORAGE.stageView,
      view
    );

    applyStageView();

    closeViewOptions(
      DOM.stageViewOptions
    );
  }

  function applyMaterialView() {
    const list =
      DOM.materialList;

    if (!list) return;

    const view =
      normalizeView(
        state.materialView
      );

    VIEW_MODES.forEach(mode => {
      list.classList.remove(
        `view-${mode}`
      );

      list.classList.remove(
        mode
      );
    });

    list.classList.add(
      `view-${view}`
    );

    list.classList.add(view);

    updateMaterialViewUI(view);
  }

  function updateMaterialViewUI(view) {
    if (DOM.materialViewButton) {
      const icon =
        DOM.materialViewButton.querySelector(
          ".viewSelectorIcon"
        );

      if (icon) {
        icon.textContent =
          getViewSymbol(view);
      }

      DOM.materialViewButton.setAttribute(
        "aria-label",
        `${text(
          "Material view",
          "मटेरियल व्यू"
        )}: ${getViewLabel(view)}`
      );
    }

    updateViewOptionsActive(
      DOM.materialViewOptions,
      view
    );

    const settingsView =
      $("settingsCurrentView");

    if (settingsView) {
      settingsView.textContent =
        getViewLabel(view);
    }
  }

  function updateViewOptionsActive(
    container,
    selected
  ) {
    if (!container) return;

    container
      .querySelectorAll(
        "[data-view]"
      )
      .forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.view ===
          selected
        );
      });
  }

  function setMaterialView(view) {
    if (!VIEW_MODES.includes(view)) {
      return;
    }

    state.materialView = view;

    saveSetting(
      STORAGE.materialView,
      view
    );

    applyMaterialView();

    closeViewOptions(
      DOM.materialViewOptions
    );
  }

  function closeViewOptions(element) {
    if (!element) return;

    element.classList.remove(
      "open",
      "show",
      "active"
    );

    element.parentElement?.classList.remove(
      "open",
      "active"
    );
  }

  function closeAllViewOptions() {
    closeViewOptions(
      DOM.stageViewOptions
    );

    closeViewOptions(
      DOM.materialViewOptions
    );
  }

  function toggleViewOptions(element) {
    if (!element) return;

    const open =
      element.classList.contains(
        "open"
      ) ||
      element.classList.contains(
        "show"
      );

    closeAllViewOptions();

    if (!open) {
      element.classList.add(
        "open"
      );

      element.classList.add(
        "show"
      );

      element.parentElement?.classList.add(
        "open"
      );
    }
  }

  function populateViewOptions(
    container,
    selectedView,
    callback
  ) {
    if (!container) return;

    container.innerHTML = "";

    VIEW_MODES.forEach(view => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";
      button.className =
        "view-option";

      button.dataset.view =
        view;

      button.innerHTML = `
        <span class="viewOptionIcon">
          ${getViewSymbol(view)}
        </span>

        <span>
          ${getViewLabel(view)}
        </span>

        <span class="viewCheck">
          ✓
        </span>
      `;

      button.classList.toggle(
        "active",
        view === selectedView
      );

      button.addEventListener(
        "click",
        event => {
          event.stopPropagation();
          callback(view);
        }
      );

      container.appendChild(
        button
      );
    });
  }

  /* =======================================================
     16. MATERIAL PAGE
  ======================================================= */

  function openStage(
    stageId,
    options = {}
  ) {
    const stage =
      getStageById(stageId);

    if (!stage) {
      console.warn(
        "Stage not found:",
        stageId
      );
      return;
    }

    state.currentStageId =
      stage.id ??
      stage.stage ??
      stageId;

    state.currentItemIndex = 0;
    state.currentItem = null;
    state.editingEstimateId = null;

    saveNavigationState();

    showPage(
      "materials",
      options.pushHistory !== false
    );

    renderMaterialPage();

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }

  function renderMaterialPage() {
    const stage =
      getStageById(
        state.currentStageId
      );

    if (!stage) return;

    const materials =
      getStageMaterials(
        state.currentStageId
      );

    if (DOM.materialStageNumber) {
      DOM.materialStageNumber.textContent =
        stage.no ||
        `STAGE ${stage.id}`;
    }

    if (DOM.materialStageTitle) {
      DOM.materialStageTitle.textContent =
        stageEnglishName(stage);
    }

    if (DOM.materialStageTitleHi) {
      DOM.materialStageTitleHi.textContent =
        stageHindiName(stage);
    }

    if (DOM.materialList) {
      DOM.materialList.innerHTML =
        "";

      materials.forEach(
        (material, index) => {
          DOM.materialList.appendChild(
            createMaterialCard(
              material,
              index
            )
          );
        }
      );

      DOM.materialList.hidden =
        false;
    }

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden =
        true;
    }

    applyMaterialView();
  }

  function createMaterialCard(
    material,
    index
  ) {
    const card =
      document.createElement(
        "button"
      );

    card.type = "button";
    card.className =
      "material-card";

    card.dataset.materialId =
      material.id || "";

    if (
      CONFIG?.materials?.showImages !==
      false &&
      material.image
    ) {
      const imageWrap =
        document.createElement(
          "div"
        );

      imageWrap.className =
        "material-card-image";

      const img =
        document.createElement(
          "img"
        );

      img.src =
        material.image;

      img.alt =
        materialEnglishName(
          material
        );

      img.loading =
        "lazy";

      imageWrap.appendChild(img);
      card.appendChild(
        imageWrap
      );
    }

    const content =
      document.createElement(
        "div"
      );

    content.className =
      "material-card-content";

    const no =
      document.createElement(
        "div"
      );

    no.className =
      "material-item-number";

    no.textContent =
      material.no ??
      index + 1;

    content.appendChild(no);

    const en =
      document.createElement(
        "div"
      );

    en.className =
      "material-name";

    en.textContent =
      materialEnglishName(
        material
      );

    content.appendChild(en);

    const hi =
      document.createElement(
        "div"
      );

    hi.className =
      "material-name-hi";

    hi.textContent =
      materialHindiName(
        material
      );

    content.appendChild(hi);

    card.appendChild(
      content
    );

    card.addEventListener(
      "click",
      () => {
        openMaterial(
          material.id
        );
      }
    );

    return card;
  }

  /* =======================================================
     17. MATERIAL EDITOR
  ======================================================= */

  function openMaterial(
    materialId,
    options = {}
  ) {
    const material =
      getMaterialById(
        materialId
      );

    if (!material) {
      console.warn(
        "Material not found:",
        materialId
      );
      return;
    }

    const stageMaterials =
      getStageMaterials(
        material.stage
      );

    const index =
      stageMaterials.findIndex(
        item =>
          String(item.id) ===
          String(material.id)
      );

    if (index < 0) return;

    state.currentStageId =
      material.stage;

    state.currentItemIndex =
      index;

    state.currentItem =
      material;

    state.editingEstimateId =
      options.editingEstimateId ||
      null;

    if (
      options.estimateItem
    ) {
      loadEstimateItemIntoDraft(
        material,
        options.estimateItem
      );
    }

    saveNavigationState();

    showPage(
      "materials",
      options.pushHistory !== false
    );

    if (DOM.materialList) {
      DOM.materialList.hidden =
        true;
    }

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden =
        false;
    }

    renderMaterialEditor(
      material
    );

    scrollEditorToTop();
  }

  function renderMaterialEditor(
    material
  ) {
    if (!material) return;

    state.currentItem =
      material;

    if (DOM.editorItemNumber) {
      DOM.editorItemNumber.textContent =
        material.no || "";
    }

    if (DOM.editorItemName) {
      DOM.editorItemName.textContent =
        materialEnglishName(
          material
        );
    }

    if (DOM.editorItemNameHi) {
      DOM.editorItemNameHi.textContent =
        materialHindiName(
          material
        );
    }

    renderMaterialImage(
      material
    );

    renderDynamicFields(
      material
    );

    renderQuantityField(
      material
    );

    renderUnitField(
      material
    );

    renderBrandField(
      material
    );

    renderPriceField(
      material
    );

    updateNavigationButtons();

    saveNavigationState();
  }

  function renderMaterialImage(
    material
  ) {
    if (!DOM.editorImageContainer) {
      return;
    }

    const showImages =
      CONFIG?.materials?.showImages !==
      false;

    if (
      !showImages ||
      !material.image
    ) {
      DOM.editorImageContainer.hidden =
        true;

      if (DOM.editorItemImage) {
        DOM.editorItemImage.removeAttribute(
          "src"
        );
      }

      return;
    }

    DOM.editorImageContainer.hidden =
      false;

    if (DOM.editorItemImage) {
      DOM.editorItemImage.src =
        material.image;

      DOM.editorItemImage.alt =
        materialEnglishName(
          material
        );
    }
  }

  /* =======================================================
     18. DYNAMIC FIELDS
  ======================================================= */

  function renderDynamicFields(
    material
  ) {
    if (!DOM.materialFields) {
      return;
    }

    DOM.materialFields.innerHTML =
      "";

    const fields =
      getMaterialFields(
        material
      ).filter(
        field =>
          !isSystemField(field)
      );

    fields.forEach(field => {
      const element =
        createDynamicField(
          material,
          field
        );

      if (element) {
        DOM.materialFields.appendChild(
          element
        );
      }
    });
  }

  function createDynamicField(
    material,
    field
  ) {
    const wrapper =
      document.createElement(
        "div"
      );

    wrapper.className =
      "field option-field";

    wrapper.dataset.field =
      fieldKey(field);

    const label =
      document.createElement(
        "label"
      );

    label.className =
      "field-label";

    label.textContent =
      fieldLabel(field);

    wrapper.appendChild(
      label
    );

    const type =
      fieldType(field);

    const current =
      getDraftValue(
        material,
        fieldKey(field)
      );

    if (type === "select") {
      const options =
        fieldOptions(field);

      const optionWrap =
        document.createElement(
          "div"
        );

      optionWrap.className =
        "choices option-buttons";

      options.forEach(option => {
        const button =
          document.createElement(
            "button"
          );

        button.type = "button";

        button.className =
          "choice option-button";

        button.dataset.value =
          option.value;

        button.textContent =
          currentLanguage() === "hi"
            ? option.hi
            : option.en;

        if (
          String(current) ===
          String(option.value)
        ) {
          button.classList.add(
            "active"
          );
        }

        button.addEventListener(
          "click",
          () => {
            setDraftValue(
              material,
              fieldKey(field),
              option.value
            );

            optionWrap
              .querySelectorAll(
                ".option-button"
              )
              .forEach(btn =>
                btn.classList.remove(
                  "active"
                )
              );

            button.classList.add(
              "active"
            );
          }
        );

        optionWrap.appendChild(
          button
        );
      });

      wrapper.appendChild(
        optionWrap
      );

      return wrapper;
    }

    const input =
      document.createElement(
        "input"
      );

    input.className =
      "field-input";

    input.type =
      type === "number"
        ? "number"
        : "text";

    input.value =
      current;

    input.autocomplete =
      "off";

    input.addEventListener(
      "input",
      () => {
        setDraftValue(
          material,
          fieldKey(field),
          input.value
        );
      }
    );

    wrapper.appendChild(
      input
    );

    addClearButton(
      wrapper,
      input
    );

    return wrapper;
  }

  function addClearButton(
    wrapper,
    input
  ) {
    const clear =
      document.createElement(
        "button"
      );

    clear.type =
      "button";

    clear.className =
      "field-clear";

    clear.textContent =
      "×";

    clear.setAttribute(
      "aria-label",
      text(
        "Clear",
        "साफ करें"
      )
    );

    clear.addEventListener(
      "click",
      () => {
        input.value = "";

        input.dispatchEvent(
          new Event(
            "input",
            {
              bubbles: true
            }
          )
        );

        input.focus();
      }
    );

    wrapper.appendChild(
      clear
    );
  }

  /* =======================================================
     19. QUANTITY
  ======================================================= */

  function renderQuantityField(
    material
  ) {
    if (!DOM.quantityField) {
      return;
    }

    const enabled =
      CONFIG?.quantity?.enabled !==
      false &&
      CONFIG?.materials?.showQuantity !==
      false;

    DOM.quantityField.hidden =
      !enabled;

    if (!enabled) return;

    const draft =
      getDraft(material);

    if (DOM.quantityInput) {
      DOM.quantityInput.value =
        draft.quantity ?? "";

      DOM.quantityInput.min =
        String(
          CONFIG?.quantity?.min ||
          1
        );

      DOM.quantityInput.max =
        String(
          CONFIG?.quantity?.max ||
          999999
        );
    }
  }

  function normalizeQuantityValue(
    value
  ) {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return "";
    }

    let number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return "";
    }

    const min =
      Number(
        CONFIG?.quantity?.min ||
        1
      );

    const max =
      Number(
        CONFIG?.quantity?.max ||
        999999
      );

    number =
      Math.max(
        min,
        Math.min(
          max,
          number
        )
      );

    return String(
      Math.floor(number)
    );
  }

  function changeQuantity(
    delta
  ) {
    const material =
      state.currentItem;

    if (!material) return;

    const current =
      getDraftValue(
        material,
        "quantity"
      );

    let value =
      current === ""
        ? 0
        : Number(current);

    if (
      !Number.isFinite(value)
    ) {
      value = 0;
    }

    value += delta;

    const min =
      Number(
        CONFIG?.quantity?.min ||
        1
      );

    const max =
      Number(
        CONFIG?.quantity?.max ||
        999999
      );

    value =
      Math.max(
        min,
        Math.min(
          max,
          Math.floor(value)
        )
      );

    const result =
      String(value);

    setDraftValue(
      material,
      "quantity",
      result
    );

    if (DOM.quantityInput) {
      DOM.quantityInput.value =
        result;
    }
  }

  /* =======================================================
     20. UNIT
  ======================================================= */

  function getUnits(material) {
    if (!material) return [];

    const units =
      Array.isArray(material.units)
        ? material.units
        : [];

    return units.map(
      normalizeOption
    );
  }

  function renderUnitField(
    material
  ) {
    if (!DOM.unitField) {
      return;
    }

    const enabled =
      CONFIG?.materials?.showUnit !==
      false;

    DOM.unitField.hidden =
      !enabled;

    if (!enabled) return;

    const units =
      getUnits(material);

    const draft =
      getDraft(material);

    let current =
      draft.unit ?? "";

    /*
      Unit carries forward.
    */
    if (
      !current &&
      state.lastUnit
    ) {
      const valid =
        units.some(
          unit =>
            String(unit.value) ===
            String(state.lastUnit)
        );

      if (valid) {
        current =
          state.lastUnit;

        draft.unit =
          current;
      }
    }

    if (
      current &&
      !units.some(
        unit =>
          String(unit.value) ===
          String(current)
      )
    ) {
      current = "";
      draft.unit = "";
    }

    if (!DOM.unitSelect) {
      return;
    }

    DOM.unitSelect.innerHTML =
      "";

    const blank =
      document.createElement(
        "option"
      );

    blank.value = "";

    blank.textContent =
      text(
        "Select Unit",
        "यूनिट चुनें"
      );

    DOM.unitSelect.appendChild(
      blank
    );

    units.forEach(unit => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        unit.value;

      option.textContent =
        currentLanguage() === "hi"
          ? unit.hi
          : unit.en;

      DOM.unitSelect.appendChild(
        option
      );
    });

    DOM.unitSelect.value =
      current;
  }

  /* =======================================================
     21. BRAND
  ======================================================= */

  function getBrands(material) {
    if (!material) return [];

    const brands =
      Array.isArray(material.brands)
        ? material.brands
        : [];

    return brands.map(
      normalizeOption
    );
  }

  function renderBrandField(
    material
  ) {
    if (!DOM.brandField) {
      return;
    }

    const enabled =
      CONFIG?.brand?.enabled !==
      false &&
      CONFIG?.materials?.showBrand !==
      false;

    DOM.brandField.hidden =
      !enabled;

    if (!enabled) return;

    const brands =
      getBrands(material);

    const draft =
      getDraft(material);

    const current =
      draft.brand ?? "";

    if (!DOM.brandSelect) {
      return;
    }

    DOM.brandSelect.innerHTML =
      "";

    const blank =
      document.createElement(
        "option"
      );

    blank.value = "";

    blank.textContent =
      text(
        "No Brand / Optional",
        "ब्रांड नहीं / वैकल्पिक"
      );

    DOM.brandSelect.appendChild(
      blank
    );

    brands.forEach(brand => {
      /*
        Skip Brand is deliberately not shown.
      */
      const combined =
        `${brand.value} ${brand.en} ${brand.hi}`
          .toLowerCase();

      if (
        combined.includes(
          "skip brand"
        ) ||
        combined.includes(
          "skipbrand"
        )
      ) {
        return;
      }

      const option =
        document.createElement(
          "option"
        );

      option.value =
        brand.value;

      option.textContent =
        currentLanguage() === "hi"
          ? brand.hi
          : brand.en;

      DOM.brandSelect.appendChild(
        option
      );
    });

    DOM.brandSelect.value =
      current;
  }

  /* =======================================================
     22. PRICE
  ======================================================= */

  function renderPriceField(
    material
  ) {
    if (!DOM.priceField) {
      return;
    }

    const priceConfig =
      CONFIG?.price || {};

    const materialsConfig =
      CONFIG?.materials || {};

    const enabled =
      priceConfig.enabled !==
      false;

    const visible =
      enabled &&
      priceConfig.visible ===
      true &&
      materialsConfig.showPrice ===
      true;

    DOM.priceField.hidden =
      !visible;

    if (!visible) return;

    const draft =
      getDraft(material);

    if (DOM.priceInput) {
      DOM.priceInput.value =
        draft.price ?? "";
    }
  }

  /* =======================================================
     23. SYNC DRAFT
  ======================================================= */

  function syncEditorInputsToDraft() {
    const material =
      state.currentItem;

    if (!material) return;

    if (DOM.quantityInput) {
      setDraftValue(
        material,
        "quantity",
        DOM.quantityInput.value
      );
    }

    if (DOM.unitSelect) {
      setDraftValue(
        material,
        "unit",
        DOM.unitSelect.value
      );
    }

    if (DOM.brandSelect) {
      setDraftValue(
        material,
        "brand",
        DOM.brandSelect.value
      );
    }

    if (DOM.priceInput) {
      setDraftValue(
        material,
        "price",
        DOM.priceInput.value
      );
    }

    DOM.materialFields
      ?.querySelectorAll(
        "input, select"
      )
      .forEach(input => {
        const key =
          input.closest(
            ".option-field"
          )?.dataset?.field;

        if (key) {
          setDraftValue(
            material,
            key,
            input.value
          );
        }
      });
  }

  /* =======================================================
     24. VALIDATION
  ======================================================= */

  function validateCurrentMaterial() {
    const material =
      state.currentItem;

    if (!material) {
      return {
        valid: false,
        message: text(
          "No material selected.",
          "कोई सामग्री चयनित नहीं है।"
        )
      };
    }

    syncEditorInputsToDraft();

    const draft =
      getDraft(material);

    const quantity =
      normalizeQuantityValue(
        draft.quantity
      );

    if (
      CONFIG?.quantity?.required !==
      false
    ) {
      if (
        quantity === "" ||
        Number(quantity) < 1
      ) {
        return {
          valid: false,
          message: text(
            "Quantity is required.",
            "क्वांटिटी भरना जरूरी है।"
          )
        };
      }
    }

    if (quantity !== "") {
      draft.quantity =
        quantity;
    }

    return {
      valid: true,
      draft
    };
  }

  /* =======================================================
     25. ESTIMATE ITEM
  ======================================================= */

  function createEstimateItem(
    material,
    draft
  ) {
    const id =
      `estimate-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const selections = {};

    getMaterialFields(material)
      .filter(
        field =>
          !isSystemField(field)
      )
      .forEach(field => {
        const key =
          fieldKey(field);

        const value =
          draft[key];

        if (
          value !== undefined &&
          value !== ""
        ) {
          selections[key] =
            value;
        }
      });

    return {
      id,

      materialId:
        material.id,

      stage:
        material.stage,

      no:
        material.no,

      name: {
        en:
          materialEnglishName(
            material
          ),

        hi:
          materialHindiName(
            material
          )
      },

      selections,

      quantity:
        draft.quantity ?? "",

      unit:
        draft.unit ?? "",

      brand:
        draft.brand ?? "",

      price:
        draft.price ?? "",

      createdAt:
        new Date().toISOString()
    };
  }

  /* =======================================================
     26. ADD
  ======================================================= */

  function addCurrentToEstimate() {
    const material =
      state.currentItem;

    if (!material) return;

    const validation =
      validateCurrentMaterial();

    if (!validation.valid) {
      showToast(
        "error",
        validation.message
      );
      return;
    }

    const draft =
      validation.draft;

    if (draft.unit) {
      state.lastUnit =
        draft.unit;
    }

    /*
      EDIT EXISTING
    */

    if (
      state.editingEstimateId
    ) {
      const index =
        state.estimateItems.findIndex(
          item =>
            String(item.id) ===
            String(
              state.editingEstimateId
            )
        );

      if (index >= 0) {
        const old =
          state.estimateItems[index];

        const updated =
          createEstimateItem(
            material,
            draft
          );

        updated.id =
          old.id;

        updated.createdAt =
          old.createdAt;

        state.estimateItems[index] =
          updated;

        saveEstimateItems();

        state.editingEstimateId =
          null;

        showToast(
          "success",
          text(
            "Estimate item updated.",
            "एस्टिमेट आइटम अपडेट हो गया।"
          )
        );

        showEstimate();

        return;
      }

      state.editingEstimateId =
        null;
    }

    /*
      NEW ITEM
    */

    const item =
      createEstimateItem(
        material,
        draft
      );

    state.estimateItems.push(
      item
    );

    saveEstimateItems();

    showToast(
      "success",
      text(
        "Added to Estimate.",
        "एस्टिमेट में जोड़ दिया गया।"
      )
    );

    /*
      IMPORTANT:
      Add -> next item
      Next -> NEVER adds current item.
    */

    if (
      CONFIG?.navigation
        ?.autoNextAfterAdd !==
      false
    ) {
      openNextItem(true);
    } else {
      updateNavigationButtons();
    }
  }

  /* =======================================================
     27. NEXT / PREVIOUS
  ======================================================= */

  function getCurrentStageMaterials() {
    return getStageMaterials(
      state.currentStageId
    );
  }

  function openNextItem() {
    const materials =
      getCurrentStageMaterials();

    if (!materials.length) {
      return;
    }

    /*
      NEVER add current item here.
    */

    syncEditorInputsToDraft();

    const nextIndex =
      state.currentItemIndex + 1;

    if (
      nextIndex >=
      materials.length
    ) {
      showToast(
        "info",
        text(
          "This is the last item.",
          "यह अंतिम आइटम है।"
        )
      );

      return;
    }

    state.currentItemIndex =
      nextIndex;

    state.currentItem =
      materials[nextIndex];

    state.editingEstimateId =
      null;

    saveNavigationState();

    renderMaterialEditor(
      state.currentItem
    );

    scrollEditorToTop();
  }

  function openPreviousItem() {
    const materials =
      getCurrentStageMaterials();

    if (!materials.length) {
      return;
    }

    syncEditorInputsToDraft();

    const previousIndex =
      state.currentItemIndex - 1;

    if (previousIndex < 0) {
      closeMaterialEditor();

      return;
    }

    state.currentItemIndex =
      previousIndex;

    state.currentItem =
      materials[
        previousIndex
      ];

    state.editingEstimateId =
      null;

    saveNavigationState();

    renderMaterialEditor(
      state.currentItem
    );

    scrollEditorToTop();
  }

  function updateNavigationButtons() {
    const materials =
      getCurrentStageMaterials();

    const index =
      state.currentItemIndex;

    if (DOM.itemBackButton) {
      DOM.itemBackButton.disabled =
        index <= 0;
    }

    if (DOM.itemNextButton) {
      DOM.itemNextButton.disabled =
        index >=
        materials.length - 1;
    }
  }

  function scrollEditorToTop() {
    requestAnimationFrame(() => {
      if (DOM.materialEditor) {
        DOM.materialEditor.scrollIntoView({
          behavior: "auto",
          block: "start"
        });
      }

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    });
  }

  function closeMaterialEditor() {
    syncEditorInputsToDraft();

    state.currentItem =
      null;

    state.editingEstimateId =
      null;

    saveNavigationState();

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden =
        true;
    }

    if (DOM.materialList) {
      DOM.materialList.hidden =
        false;
    }

    renderMaterialPage();

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }

  /* =======================================================
     28. ESTIMATE EDIT
  ======================================================= */

  function loadEstimateItemIntoDraft(
    material,
    estimateItem
  ) {
    if (
      !material ||
      !estimateItem
    ) {
      return;
    }

    const draft = {};

    Object.assign(
      draft,
      estimateItem.selections ||
      {}
    );

    draft.quantity =
      estimateItem.quantity ??
      "";

    draft.unit =
      estimateItem.unit ??
      "";

    draft.brand =
      estimateItem.brand ??
      "";

    draft.price =
      estimateItem.price ??
      "";

    state.draftValues[
      getDraftKey(material)
    ] = draft;
  }

  function editEstimateItem(
    estimateItem
  ) {
    if (!estimateItem) return;

    const material =
      getMaterialById(
        estimateItem.materialId
      );

    if (!material) {
      showToast(
        "error",
        text(
          "Material no longer exists.",
          "यह सामग्री अब उपलब्ध नहीं है।"
        )
      );

      return;
    }

    state.editingEstimateId =
      estimateItem.id;

    loadEstimateItemIntoDraft(
      material,
      estimateItem
    );

    openMaterial(
      material.id,
      {
        estimateItem,
        editingEstimateId:
          estimateItem.id
      }
    );
  }

  function deleteEstimateItem(id) {
    const confirmed =
      window.confirm(
        text(
          "Delete this estimate item?",
          "क्या इस एस्टिमेट आइटम को हटाना है?"
        )
      );

    if (!confirmed) {
      return;
    }

    state.estimateItems =
      state.estimateItems.filter(
        item =>
          String(item.id) !==
          String(id)
      );

    saveEstimateItems();

    renderEstimate();

    showToast(
      "success",
      text(
        "Estimate item deleted.",
        "एस्टिमेट आइटम डिलीट हो गया।"
      )
    );
  }

  /* =======================================================
     29. ESTIMATE PAGE
  ======================================================= */

  function showEstimate() {
    showPage(
      "estimate"
    );

    renderEstimate();
  }

  function renderEstimate() {
    if (!DOM.estimateItems) {
      return;
    }

    DOM.estimateItems.innerHTML =
      "";

    const items =
      state.estimateItems;

    if (!items.length) {
      if (DOM.estimateEmpty) {
        DOM.estimateEmpty.hidden =
          false;
      }

      return;
    }

    if (DOM.estimateEmpty) {
      DOM.estimateEmpty.hidden =
        true;
    }

    items.forEach(item => {
      DOM.estimateItems.appendChild(
        createEstimateCard(item)
      );
    });
  }

  function createEstimateCard(
    item
  ) {
    const card =
      document.createElement(
        "article"
      );

    card.className =
      "estimate-item-card";

    const material =
      getMaterialById(
        item.materialId
      );

    const header =
      document.createElement(
        "div"
      );

    header.className =
      "estimate-item-header";

    const title =
      document.createElement(
        "div"
      );

    title.className =
      "estimate-item-title";

    title.textContent =
      currentLanguage() === "hi"
        ? (
            item.name?.hi ||
            item.name?.en ||
            materialEnglishName(
              material
            )
          )
        : (
            item.name?.en ||
            item.name?.hi ||
            materialEnglishName(
              material
            )
          );

    header.appendChild(
      title
    );

    const number =
      document.createElement(
        "span"
      );

    number.className =
      "estimate-item-number";

    number.textContent =
      item.no
        ? `#${item.no}`
        : "";

    header.appendChild(
      number
    );

    card.appendChild(
      header
    );

    const details =
      document.createElement(
        "div"
      );

    details.className =
      "estimate-item-details";

    if (material) {
      getMaterialFields(
        material
      )
        .filter(
          field =>
            !isSystemField(field)
        )
        .forEach(field => {
          const key =
            fieldKey(field);

          const value =
            item.selections?.[key];

          if (
            value === undefined ||
            value === ""
          ) {
            return;
          }

          appendEstimateDetail(
            details,
            fieldLabel(field),
            resolveOptionDisplay(
              field,
              value
            )
          );
        });
    }

    if (item.quantity !== "") {
      appendEstimateDetail(
        details,
        text(
          "Quantity",
          "क्वांटिटी"
        ),
        item.quantity
      );
    }

    if (item.unit !== "") {
      appendEstimateDetail(
        details,
        text(
          "Unit",
          "यूनिट"
        ),
        resolveUnitDisplay(
          material,
          item.unit
        )
      );
    }

    if (item.brand !== "") {
      appendEstimateDetail(
        details,
        text(
          "Brand",
          "ब्रांड"
        ),
        resolveBrandDisplay(
          material,
          item.brand
        )
      );
    }

    if (
      item.price !== "" &&
      CONFIG?.price?.enabled !==
      false &&
      CONFIG?.price?.visible ===
      true &&
      CONFIG?.materials?.showPrice ===
      true
    ) {
      appendEstimateDetail(
        details,
        text(
          "Price",
          "कीमत"
        ),
        `${CONFIG?.price?.currency || "₹"}${item.price}`
      );
    }

    card.appendChild(
      details
    );

    const actions =
      document.createElement(
        "div"
      );

    actions.className =
      "estimate-item-actions";

    const edit =
      document.createElement(
        "button"
      );

    edit.type = "button";

    edit.className =
      "estimate-edit-button";

    edit.textContent =
      text(
        "Edit",
        "एडिट"
      );

    edit.addEventListener(
      "click",
      () => {
        editEstimateItem(
          item
        );
      }
    );

    actions.appendChild(
      edit
    );

    const remove =
      document.createElement(
        "button"
      );

    remove.type = "button";

    remove.className =
      "estimate-delete-button";

    remove.textContent =
      text(
        "Delete",
        "डिलीट"
      );

    remove.addEventListener(
      "click",
      () => {
        deleteEstimateItem(
          item.id
        );
      }
    );

    actions.appendChild(
      remove
    );

    card.appendChild(
      actions
    );

    return card;
  }

  function appendEstimateDetail(
    container,
    labelText,
    valueText
  ) {
    const row =
      document.createElement(
        "div"
      );

    row.className =
      "estimate-detail-row";

    const label =
      document.createElement(
        "span"
      );

    label.className =
      "estimate-detail-label";

    label.textContent =
      labelText;

    const value =
      document.createElement(
        "span"
      );

    value.className =
      "estimate-detail-value";

    value.textContent =
      valueText;

    row.appendChild(
      label
    );

    row.appendChild(
      value
    );

    container.appendChild(
      row
    );
  }

  function resolveOptionDisplay(
    field,
    value
  ) {
    const option =
      fieldOptions(field).find(
        item =>
          String(item.value) ===
          String(value)
      );

    if (!option) {
      return String(value);
    }

    return currentLanguage() ===
      "hi"
      ? option.hi
      : option.en;
  }

  function resolveUnitDisplay(
    material,
    value
  ) {
    const unit =
      getUnits(material).find(
        item =>
          String(item.value) ===
          String(value)
      );

    if (!unit) {
      return String(value);
    }

    return currentLanguage() ===
      "hi"
      ? unit.hi
      : unit.en;
  }

  function resolveBrandDisplay(
    material,
    value
  ) {
    const brand =
      getBrands(material).find(
        item =>
          String(item.value) ===
          String(value)
      );

    if (!brand) {
      return String(value);
    }

    return currentLanguage() ===
      "hi"
      ? brand.hi
      : brand.en;
  }

  /* =======================================================
     30. PAGE NAVIGATION
  ======================================================= */

  function normalizePage(page) {
    const allowed = [
      "home",
      "materials",
      "estimate",
      "calculator",
      "settings"
    ];

    return allowed.includes(page)
      ? page
      : "home";
  }

  function showPage(
    page,
    pushHistory = true
  ) {
    page =
      normalizePage(page);

    const pages = {
      home:
        DOM.homePage,

      materials:
        DOM.materialPage,

      estimate:
        DOM.estimatePage,

      calculator:
        DOM.calculatorPage,

      settings:
        DOM.settingsPage
    };

    Object.entries(
      pages
    ).forEach(
      ([key, element]) => {
        if (!element) return;

        element.hidden =
          key !== page;
      }
    );

    state.currentPage =
      page;

    closeSideMenu();
    closeAllViewOptions();

    updateTopBarTitle();

    updateBottomNavigation(
      page
    );

    saveNavigationState();

    if (page === "home") {
      renderHome();
    }

    if (page === "materials") {
      if (
        state.currentItem
      ) {
        if (DOM.materialList) {
          DOM.materialList.hidden =
            true;
        }

        if (DOM.materialEditor) {
          DOM.materialEditor.hidden =
            false;
        }

        renderMaterialEditor(
          state.currentItem
        );
      } else {
        renderMaterialPage();
      }
    }

    if (page === "estimate") {
      renderEstimate();
    }

    if (page === "calculator") {
      calculateAll();
    }

    if (page === "settings") {
      renderSettings();
    }

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    if (pushHistory) {
      try {
        history.pushState(
          {
            sandeepApp: true,
            page,
            stageId:
              state.currentStageId,
            itemIndex:
              state.currentItemIndex,
            materialId:
              state.currentItem?.id ||
              null
          },
          "",
          `#${page}`
        );

        state.historyReady =
          true;
      } catch (_) {}
    }
  }

  function updateTopBarTitle() {
    if (!DOM.appTitle) {
      return;
    }

    const titles = {
      home:
        text(
          "Estimate List",
          "एस्टिमेट लिस्ट"
        ),

      materials:
        text(
          "Materials",
          "मटेरियल्स"
        ),

      estimate:
        text(
          "Estimate",
          "एस्टिमेट"
        ),

      calculator:
        text(
          "Calculator",
          "कैलकुलेटर"
        ),

      settings:
        text(
          "Settings",
          "सेटिंग्स"
        )
    };

    DOM.appTitle.textContent =
      titles[
        state.currentPage
      ] ||
      titles.home;
  }

  function updateBottomNavigation(
    page
  ) {
    if (!DOM.bottomNavigation) {
      return;
    }

    DOM.bottomNavigation
      .querySelectorAll(
        "[data-page]"
      )
      .forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.page ===
          page
        );
      });
  }

  /* =======================================================
     31. DRAWER
  ======================================================= */

  function openSideMenu() {
    state.menuOpen =
      true;

    DOM.sideMenu?.classList.add(
      "open"
    );

    DOM.menuOverlay?.classList.add(
      "show"
    );

    DOM.hamburgerButton?.classList.add(
      "open",
      "active"
    );

    DOM.hamburgerButton?.setAttribute(
      "aria-expanded",
      "true"
    );

    DOM.sideMenu?.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "menu-open"
    );
  }

  function closeSideMenu() {
    state.menuOpen =
      false;

    DOM.sideMenu?.classList.remove(
      "open"
    );

    DOM.menuOverlay?.classList.remove(
      "show"
    );

    DOM.hamburgerButton?.classList.remove(
      "open",
      "active"
    );

    DOM.hamburgerButton?.setAttribute(
      "aria-expanded",
      "false"
    );

    DOM.sideMenu?.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "menu-open"
    );
  }

  function toggleSideMenu() {
    state.menuOpen
      ? closeSideMenu()
      : openSideMenu();
  }

  /* =======================================================
     32. SETTINGS
  ======================================================= */

  function renderSettings() {
    updateLanguageButton();
    updateThemeButtons();
    updateMaterialViewUI(
      state.materialView
    );
  }

  function backupEstimate() {
    const data =
      JSON.stringify(
        state.estimateItems,
        null,
        2
      );

    const blob =
      new Blob(
        [data],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href =
      url;

    anchor.download =
      `sandeep-estimate-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(
      url
    );

    showToast(
      "success",
      text(
        "Backup downloaded.",
        "बैकअप डाउनलोड हो गया।"
      )
    );
  }

  function resetEstimate() {
    const confirmed =
      window.confirm(
        text(
          "Delete all saved estimate items?",
          "क्या सभी सेव किए गए एस्टिमेट आइटम हटाने हैं?"
        )
      );

    if (!confirmed) {
      return;
    }

    state.estimateItems =
      [];

    state.draftValues =
      {};

    state.editingEstimateId =
      null;

    state.lastUnit =
      "";

    saveEstimateItems();

    renderEstimate();

    showToast(
      "success",
      text(
        "Estimate reset.",
        "एस्टिमेट रीसेट हो गया।"
      )
    );
  }

  function showAbout() {
    window.alert(
      [
        "Sandeep ElectroFix",
        "Powering Your Trust",
        "",
        "Estimate List",
        `Version ${APP_VERSION}`
      ].join("\n")
    );
  }

  /* =======================================================
     33. CALCULATOR
  ======================================================= */

  function calculateVoltage() {
    const current =
      Number(
        DOM.voltageInput?.value
      );

    /*
      Voltage needs I and R.
      Since this compact calculator only has
      one input, use 230V reference for display.
    */

    if (DOM.voltageResult) {
      DOM.voltageResult.textContent =
        Number.isFinite(current) &&
        current > 0
          ? `I = ${current} A`
          : text(
              "Enter a value",
              "मान भरें"
            );
    }
  }

  function calculateCurrent() {
    const value =
      Number(
        DOM.currentInput?.value
      );

    if (DOM.currentResult) {
      DOM.currentResult.textContent =
        Number.isFinite(value) &&
        value > 0
          ? `I = ${value} A`
          : text(
              "Enter a value",
              "मान भरें"
            );
    }
  }

  function calculatePower() {
    const current =
      Number(
        DOM.powerInput?.value
      );

    if (DOM.powerResult) {
      DOM.powerResult.textContent =
        Number.isFinite(current) &&
        current >= 0
          ? `${(
              230 * current
            ).toFixed(2)} W`
          : text(
              "Enter current",
              "करंट भरें"
            );
    }
  }

  function calculateResistance() {
    const current =
      Number(
        DOM.resistanceInput?.value
      );

    if (DOM.resistanceResult) {
      DOM.resistanceResult.textContent =
        Number.isFinite(current) &&
        current > 0
          ? `${(
              230 / current
            ).toFixed(2)} Ω`
          : text(
              "Enter current",
              "करंट भरें"
            );
    }
  }

  function calculateAll() {
    calculateVoltage();
    calculateCurrent();
    calculatePower();
    calculateResistance();
    renderFormulaSection();
  }

  function renderFormulaSection() {
    if (DOM.formulaSection) {
      DOM.formulaSection.innerHTML = `
        <div class="formula-row">
          <strong>P</strong>
          <span>=</span>
          <span>V × I</span>
        </div>

        <div class="formula-row">
          <strong>V</strong>
          <span>=</span>
          <span>I × R</span>
        </div>

        <div class="formula-row">
          <strong>I</strong>
          <span>=</span>
          <span>P ÷ V</span>
        </div>

        <div class="formula-row">
          <strong>R</strong>
          <span>=</span>
          <span>V ÷ I</span>
        </div>
      `;
    }

    if (DOM.inverterExamples) {
      DOM.inverterExamples.innerHTML = `
        <div class="formula-row">
          <strong>12V</strong>
          <span>→</span>
          <span>230V Inverter</span>
        </div>

        <div class="formula-row">
          <strong>24V</strong>
          <span>→</span>
          <span>230V Inverter</span>
        </div>
      `;
    }
  }

  function bindCalculatorInputs() {
    DOM.voltageInput?.addEventListener(
      "input",
      calculateVoltage
    );

    DOM.currentInput?.addEventListener(
      "input",
      calculateCurrent
    );

    DOM.powerInput?.addEventListener(
      "input",
      calculatePower
    );

    DOM.resistanceInput?.addEventListener(
      "input",
      calculateResistance
    );
  }

  /* =======================================================
     34. TOAST
  ======================================================= */

  let toastTimer =
    null;

  function showToast(
    type,
    message
  ) {
    if (!DOM.appToast) {
      return;
    }

    if (
      CONFIG?.toast?.enabled ===
      false
    ) {
      return;
    }

    if (toastTimer) {
      clearTimeout(
        toastTimer
      );
    }

    DOM.appToast.className =
      "app-toast";

    if (type) {
      DOM.appToast.classList.add(
        `toast-${type}`
      );
    }

    if (DOM.toastIcon) {
      const icons = {
        success: "✓",
        error: "!",
        info: "i",
        warning: "!"
      };

      DOM.toastIcon.textContent =
        icons[type] ||
        "✓";
    }

    if (DOM.toastMessage) {
      DOM.toastMessage.textContent =
        message;
    }

    DOM.appToast.classList.add(
      "show"
    );

    const duration =
      Number(
        CONFIG?.toast?.duration ||
        1800
      );

    toastTimer =
      setTimeout(
        () => {
          DOM.appToast.classList.remove(
            "show"
          );
        },
        duration
      );
  }

  /* =======================================================
     35. EVENTS
  ======================================================= */

  function bindEvents() {
    /* HAMBURGER */

    DOM.hamburgerButton?.addEventListener(
      "click",
      event => {
        event.stopPropagation();
        toggleSideMenu();
      }
    );

    DOM.sideMenuClose?.addEventListener(
      "click",
      closeSideMenu
    );

    DOM.menuOverlay?.addEventListener(
      "click",
      closeSideMenu
    );

    /* LANGUAGE */

    DOM.languageButton?.addEventListener(
      "click",
      toggleLanguage
    );

    DOM.settingsLanguageButton?.addEventListener(
      "click",
      toggleLanguage
    );

    /* THEME */

    DOM.themeBtn?.addEventListener(
      "click",
      toggleTheme
    );

    DOM.themeToggleButton?.addEventListener(
      "click",
      toggleTheme
    );

    /* SEARCH */

    DOM.materialSearch?.addEventListener(
      "input",
      handleSearch
    );

    DOM.searchClearButton?.addEventListener(
      "click",
      clearSearch
    );

    /* MATERIAL BACK */

    DOM.materialBackButton?.addEventListener(
      "click",
      () => {
        if (
          DOM.materialEditor &&
          !DOM.materialEditor.hidden
        ) {
          closeMaterialEditor();
          return;
        }

        state.currentStageId =
          null;

        state.currentItem =
          null;

        showPage(
          "home"
        );
      }
    );

    /* EDITOR BACK */

    DOM.editorBackButton?.addEventListener(
      "click",
      () => {
        closeMaterialEditor();
      }
    );

    /* PREVIOUS */

    DOM.itemBackButton?.addEventListener(
      "click",
      openPreviousItem
    );

    /* NEXT */

    DOM.itemNextButton?.addEventListener(
      "click",
      () => {
        /*
          IMPORTANT:
          This NEVER adds the item.
        */
        openNextItem();
      }
    );

    /* ADD */

    DOM.addToEstimateButton?.addEventListener(
      "click",
      addCurrentToEstimate
    );

    /* QUANTITY */

    DOM.quantityMinus?.addEventListener(
      "click",
      () => {
        changeQuantity(-1);
      }
    );

    DOM.quantityPlus?.addEventListener(
      "click",
      () => {
        changeQuantity(1);
      }
    );

    DOM.quantityInput?.addEventListener(
      "input",
      event => {
        const material =
          state.currentItem;

        if (!material) return;

        const value =
          event.target.value;

        if (value === "") {
          setDraftValue(
            material,
            "quantity",
            ""
          );

          return;
        }

        const normalized =
          normalizeQuantityValue(
            value
          );

        event.target.value =
          normalized;

        setDraftValue(
          material,
          "quantity",
          normalized
        );
      }
    );

    /* UNIT */

    DOM.unitSelect?.addEventListener(
      "change",
      event => {
        const material =
          state.currentItem;

        if (!material) return;

        const value =
          event.target.value;

        setDraftValue(
          material,
          "unit",
          value
        );

        if (value) {
          state.lastUnit =
            value;
        }
      }
    );

    /* BRAND */

    DOM.brandSelect?.addEventListener(
      "change",
      event => {
        const material =
          state.currentItem;

        if (!material) return;

        setDraftValue(
          material,
          "brand",
          event.target.value
        );
      }
    );

    /* PRICE */

    DOM.priceInput?.addEventListener(
      "input",
      event => {
        const material =
          state.currentItem;

        if (!material) return;

        setDraftValue(
          material,
          "price",
          event.target.value
        );
      }
    );

    /* BOTTOM NAV */

    DOM.bottomNavigation
      ?.querySelectorAll(
        "[data-page]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            showPage(
              button.dataset.page
            );
          }
        );
      });

    /* DRAWER */

    DOM.sideMenu
      ?.querySelectorAll(
        "[data-page]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            closeSideMenu();

            showPage(
              button.dataset.page
            );
          }
        );
      });

    /* MATERIAL VIEW */

    DOM.materialViewButton?.addEventListener(
      "click",
      event => {
        event.stopPropagation();

        toggleViewOptions(
          DOM.materialViewOptions
        );
      }
    );

    /* STAGE VIEW */

    DOM.stageViewBtn?.addEventListener(
      "click",
      event => {
        event.stopPropagation();

        toggleViewOptions(
          DOM.stageViewOptions
        );
      }
    );

    /* SETTINGS VIEW */

    $("settingsViewButton")
      ?.addEventListener(
        "click",
        () => {
          if (
            state.currentPage !==
            "materials"
          ) {
            showToast(
              "info",
              text(
                "Open a material stage to change its view.",
                "मटेरियल व्यू बदलने के लिए कोई स्टेज खोलें।"
              )
            );
            return;
          }
        }
      );

    /* BACKUP */

    DOM.backupButton?.addEventListener(
      "click",
      backupEstimate
    );

    /* RESET */

    DOM.resetButton?.addEventListener(
      "click",
      resetEstimate
    );

    /* ABOUT */

    DOM.aboutButton?.addEventListener(
      "click",
      showAbout
    );

    /* VIEW OPTIONS */

    populateViewOptions(
      DOM.materialViewOptions,
      state.materialView,
      setMaterialView
    );

    populateViewOptions(
      DOM.stageViewOptions,
      state.stageView,
      setStageView
    );

    /* BROWSER / ANDROID BACK */

    window.addEventListener(
      "popstate",
      handlePopState
    );

    /* OUTSIDE CLICK */

    document.addEventListener(
      "click",
      event => {
        const materialInside =
          DOM.materialViewSelector?.contains(
            event.target
          );

        const stageInside =
          DOM.stageViewSelector?.contains(
            event.target
          );

        if (
          !materialInside &&
          !stageInside
        ) {
          closeAllViewOptions();
        }
      }
    );

    /* ESCAPE */

    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key !==
          "Escape"
        ) {
          return;
        }

        if (state.menuOpen) {
          closeSideMenu();
          return;
        }

        closeAllViewOptions();
      }
    );
  }

  /* =======================================================
     36. BACK / POPSTATE
  ======================================================= */

  function handlePopState(event) {
    /*
      Drawer first.
    */

    if (state.menuOpen) {
      closeSideMenu();
      return;
    }

    /*
      Editor -> material list
    */

    if (
      state.currentPage ===
        "materials" &&
      state.currentItem
    ) {
      syncEditorInputsToDraft();

      state.currentItem =
        null;

      state.editingEstimateId =
        null;

      renderMaterialPage();

      replaceHistoryState();

      return;
    }

    /*
      Material list -> home
    */

    if (
      state.currentPage ===
      "materials"
    ) {
      state.currentStageId =
        null;

      state.currentItem =
        null;

      showPage(
        "home",
        false
      );

      replaceHistoryState();

      return;
    }

    /*
      Other pages -> home.
    */

    if (
      state.currentPage !==
      "home"
    ) {
      showPage(
        "home",
        false
      );

      replaceHistoryState();

      return;
    }

    /*
      Let browser handle actual exit
      when already on app home.
    */

    const page =
      normalizePage(
        event.state?.page
      );

    if (
      event.state?.sandeepApp &&
      page !== "home"
    ) {
      showPage(
        page,
        false
      );
    }
  }

  function replaceHistoryState() {
    try {
      history.replaceState(
        {
          sandeepApp: true,
          page:
            state.currentPage,
          stageId:
            state.currentStageId,
          itemIndex:
            state.currentItemIndex,
          materialId:
            state.currentItem?.id ||
            null
        },
        "",
        `#${state.currentPage}`
      );

      state.historyReady =
        true;
    } catch (_) {}
  }

  /* =======================================================
     37. RESTORE
  ======================================================= */

  function getInitialPage() {
    const hash =
      String(
        window.location.hash ||
        ""
      )
        .replace(
          "#",
          ""
        )
        .trim();

    return normalizePage(
      hash || "home"
    );
  }

  function restoreNavigationState() {
    const saved =
      loadNavigationState();

    const hashPage =
      getInitialPage();

    if (
      saved &&
      saved.page
    ) {
      state.currentPage =
        normalizePage(
          hashPage !== "home"
            ? hashPage
            : saved.page
        );

      state.currentStageId =
        saved.stageId ??
        null;

      state.currentItemIndex =
        Number.isFinite(
          Number(
            saved.itemIndex
          )
        )
          ? Number(
              saved.itemIndex
            )
          : 0;

      state.editingEstimateId =
        saved.editingEstimateId ||
        null;

      if (saved.materialId) {
        const material =
          getMaterialById(
            saved.materialId
          );

        if (material) {
          state.currentItem =
            material;

          state.currentStageId =
            material.stage;

          const stageMaterials =
            getStageMaterials(
              material.stage
            );

          const index =
            stageMaterials.findIndex(
              item =>
                String(item.id) ===
                String(material.id)
            );

          if (index >= 0) {
            state.currentItemIndex =
              index;
          }
        }
      }

      return;
    }

    state.currentPage =
      hashPage;
  }

  /* =======================================================
     38. CONFIG VISIBILITY
  ======================================================= */

  function setVisible(
    element,
    visible
  ) {
    if (!element) return;

    element.hidden =
      !visible;
  }

  function applyConfigVisibility() {
    const ui =
      CONFIG?.ui || {};

    setVisible(
      DOM.hamburgerButton,
      ui.menu !== false
    );

    setVisible(
      DOM.languageButton,
      ui.languageButton !==
      false
    );

    setVisible(
      DOM.themeBtn,
      ui.themeButton !==
      false
    );

    setVisible(
      DOM.bottomNavigation,
      ui.bottomNav !==
      false
    );

    setVisible(
      DOM.searchContainer,
      ui.search !==
      false
    );

    setVisible(
      DOM.addToEstimateButton,
      ui.addToEstimateButton !==
      false
    );
  }

  /* =======================================================
     39. MASTER DATA VALIDATION
  ======================================================= */

  function validateMasterData() {
    if (!MATERIALS.length) {
      console.error(
        "Material master list is empty."
      );

      return false;
    }

    const ids =
      new Set();

    MATERIALS.forEach(
      material => {
        if (!material.id) {
          console.warn(
            "Material without ID:",
            material
          );
        }

        if (
          material.id &&
          ids.has(
            String(material.id)
          )
        ) {
          console.error(
            "Duplicate material ID:",
            material.id
          );
        }

        if (material.id) {
          ids.add(
            String(material.id)
          );
        }
      }
    );

    console.info(
      `Sandeep ElectroFix Material Master: ${MATERIALS.length} items`
    );

    return true;
  }

  /* =======================================================
     40. RENDER ALL
  ======================================================= */

  function renderAll() {
    applyBranding();
    applyTheme();
    applyConfigVisibility();
    updateLanguageButton();

    if (
      state.currentPage ===
      "home"
    ) {
      renderHome();
    }

    if (
      state.currentPage ===
      "materials"
    ) {
      if (
        state.currentItem
      ) {
        if (DOM.materialList) {
          DOM.materialList.hidden =
            true;
        }

        if (DOM.materialEditor) {
          DOM.materialEditor.hidden =
            false;
        }

        renderMaterialEditor(
          state.currentItem
        );
      } else {
        renderMaterialPage();
      }
    }

    if (
      state.currentPage ===
      "estimate"
    ) {
      renderEstimate();
    }

    if (
      state.currentPage ===
      "calculator"
    ) {
      calculateAll();
    }

    renderSettings();

    updateTopBarTitle();

    updateBottomNavigation(
      state.currentPage
    );

    applyMaterialView();
    applyStageView();

    populateViewOptions(
      DOM.materialViewOptions,
      state.materialView,
      setMaterialView
    );

    populateViewOptions(
      DOM.stageViewOptions,
      state.stageView,
      setStageView
    );

    saveNavigationState();
  }

  /* =======================================================
     41. INITIALIZE
  ======================================================= */

  function initializeUI() {
    /*
      First load saved data.
    */

    state.estimateItems =
      loadEstimateItems();

    /*
      Restore page/stage/item.
    */

    restoreNavigationState();

    /*
      Dynamic pages must be created BEFORE
      render functions are called.
    */

    ensureMainShell();

    cacheDOM();

    /*
      Branding / theme.
    */

    applyBranding();
    applyTheme();
    applyConfigVisibility();

    updateLanguageButton();

    /*
      Bind events only once.
    */

    bindCalculatorInputs();
    bindEvents();

    /*
      Render current page.
    */

    renderAll();

    /*
      Initial history state.
    */

    try {
      history.replaceState(
        {
          sandeepApp: true,
          page:
            state.currentPage,
          stageId:
            state.currentStageId,
          itemIndex:
            state.currentItemIndex,
          materialId:
            state.currentItem?.id ||
            null
        },
        "",
        `#${state.currentPage}`
      );

      state.historyReady =
        true;
    } catch (_) {}

    /*
      Restore exact material editor
      after refresh.
    */

    if (
      state.currentPage ===
      "materials"
    ) {
      if (
        state.currentItem
      ) {
        if (DOM.materialList) {
          DOM.materialList.hidden =
            true;
        }

        if (DOM.materialEditor) {
          DOM.materialEditor.hidden =
            false;
        }

        renderMaterialEditor(
          state.currentItem
        );

        scrollEditorToTop();
      } else if (
        state.currentStageId
      ) {
        renderMaterialPage();
      } else {
        showPage(
          "home",
          false
        );
      }
    }

    state.initialized =
      true;
  }

  /* =======================================================
     42. ERROR SAFETY
  ======================================================= */

  function installErrorSafety() {
    window.addEventListener(
      "error",
      event => {
        console.error(
          "Estimate List error:",
          event.error ||
          event.message
        );
      }
    );

    window.addEventListener(
      "unhandledrejection",
      event => {
        console.error(
          "Estimate List promise error:",
          event.reason
        );
      }
    );
  }

  /* =======================================================
     43. PUBLIC API
  ======================================================= */

  window.SandeepEstimateApp = {
    state,

    openStage,
    openMaterial,

    showPage,
    showEstimate,

    renderEstimate,

    addCurrentToEstimate,

    setLanguage,
    toggleLanguage,

    toggleTheme,

    setMaterialView,
    setStageView,

    openNextItem,
    openPreviousItem,

    openSideMenu,
    closeSideMenu,

    backupEstimate,
    resetEstimate,

    showToast,

    renderAll
  };

  /* =======================================================
     44. INIT
  ======================================================= */

  function init() {
    try {
      cacheDOM();

      installErrorSafety();

      validateMasterData();

      initializeUI();

      /*
        Loader intentionally NOT created.
      */

    } catch (error) {
      console.error(
        "Estimate List initialization failed:",
        error
      );

      /*
        No loader/error screen.
        Log only.
      */
    }
  }

  /* =======================================================
     45. START
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
