/* =========================================================
   Sandeep ElectroFix - Estimate List
   app.js
   ---------------------------------------------------------
   Structure:
   index.html  -> UI
   style.css   -> Design
   config.js   -> App/UI configuration
   material.js -> Master Material Data
   app.js      -> Logic / Interaction / Storage
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     GLOBAL REFERENCES
     ========================================================= */

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

  const UI_TEXT =
    MATERIAL_DATA.UI_TEXT ||
    window.UI_TEXT ||
    {};

  const $ = (id) => document.getElementById(id);

  /* =========================================================
     CONFIG HELPERS
     ========================================================= */

  function cfg(path, fallback) {
    const parts = String(path).split(".");
    let value = CONFIG;

    for (const part of parts) {
      if (
        value === null ||
        value === undefined ||
        typeof value !== "object" ||
        !(part in value)
      ) {
        return fallback;
      }

      value = value[part];
    }

    return value === undefined ? fallback : value;
  }

  function isEnabled(path, fallback = true) {
    return Boolean(cfg(path, fallback));
  }

  /* =========================================================
     STORAGE
     ========================================================= */

  const STORAGE = {
    estimate:
      cfg(
        "storage.estimateItems",
        "sandeepEstimateItems"
      ),

    language:
      cfg(
        "storage.materialLanguage",
        "sandeepMaterialLang"
      ),

    view:
      cfg(
        "storage.materialView",
        "sandeepMaterialView"
      ),

    theme:
      cfg(
        "storage.theme",
        "sandeepTheme"
      )
  };

  function storageGet(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      console.warn("Storage read error:", error);
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("Storage write error:", error);
      return false;
    }
  }

  function storageRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("Storage remove error:", error);
      return false;
    }
  }

  function loadJSON(key, fallback) {
    try {
      const raw = storageGet(key);

      if (!raw) {
        return fallback;
      }

      const parsed = JSON.parse(raw);

      return parsed === null || parsed === undefined
        ? fallback
        : parsed;
    } catch (error) {
      console.warn("JSON storage error:", error);
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      return storageSet(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.warn("JSON storage write error:", error);
      return false;
    }
  }

  /* =========================================================
     APP STATE
     ========================================================= */

  const state = {
    language:
      storageGet(
        STORAGE.language,
        cfg("language.default", "hi")
      ) || "hi",

    theme:
      storageGet(
        STORAGE.theme,
        cfg("theme.default", "dark")
      ) || "dark",

    materialView:
      storageGet(
        STORAGE.view,
        cfg("views.default", "grid")
      ) || "grid",

    currentPage: "home",

    currentStageId: null,

    currentItemIndex: -1,

    currentItem: null,

    estimateItems:
      loadJSON(
        STORAGE.estimate,
        []
      ),

    /* Unsaved values of each material */
    draftValues: {},

    /* Unit memory */
    lastUnit: "",

    searchText: "",

    menuOpen: false
  };

  /* =========================================================
     DOM CACHE
     ========================================================= */

  const DOM = {};

  function cacheDOM() {
    const ids = [
      "loadingScreen",
      "loadingLogo",
      "loadingBusinessName",
      "loadingTagline",
      "loadingLine",
      "loadingText",

      "app",

      "topBar",
      "hamburgerButton",
      "topBarTitle",
      "languageButton",

      "sideMenu",
      "sideMenuClose",
      "sideMenuNav",
      "menuOverlay",

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

      "materialPage",
      "materialHeader",
      "materialBackButton",
      "materialStageNumber",
      "materialStageTitle",
      "materialStageTitleHi",
      "materialList",
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
      "materialViewButton",

      "settingBackup",
      "backupButton",

      "settingReset",
      "resetButton",

      "settingAbout",
      "aboutButton",

      "bottomNavigation",

      "appToast",
      "toastIcon",
      "toastMessage"
    ];

    ids.forEach((id) => {
      DOM[id] = $(id);
    });
  }

  /* =========================================================
     LANGUAGE
     ========================================================= */

  function getLanguage() {
    return state.language === "en"
      ? "en"
      : "hi";
  }

  function setLanguage(language) {
    state.language =
      language === "en"
        ? "en"
        : "hi";

    storageSet(
      STORAGE.language,
      state.language
    );

    updateLanguageUI();

    renderCurrentPage();

    if (
      state.currentItem &&
      DOM.materialEditor &&
      !DOM.materialEditor.hidden
    ) {
      renderMaterialEditor(
        state.currentItem,
        state.currentItemIndex
      );
    }
  }

  function toggleLanguage() {
    setLanguage(
      getLanguage() === "hi"
        ? "en"
        : "hi"
    );
  }

  function textValue(value, language = getLanguage()) {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (typeof value === "object") {
      if (
        language === "hi" &&
        value.hi !== undefined
      ) {
        return String(value.hi);
      }

      if (
        language === "en" &&
        value.en !== undefined
      ) {
        return String(value.en);
      }

      if (value.label !== undefined) {
        return String(value.label);
      }

      if (value.name !== undefined) {
        return String(value.name);
      }
    }

    return String(value);
  }

  function bilingualText(value) {
    if (!value) {
      return {
        en: "",
        hi: ""
      };
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return {
        en:
          value.en ??
          value.label ??
          value.name ??
          "",
        hi:
          value.hi ??
          value.label ??
          value.name ??
          value.en ??
          ""
      };
    }

    return {
      en: String(value),
      hi: String(value)
    };
  }

  function getUIText(key, fallback = "") {
    const value =
      UI_TEXT[key];

    if (
      value === undefined ||
      value === null
    ) {
      return fallback;
    }

    return textValue(
      value,
      getLanguage()
    );
  }

  function setText(element, value) {
    if (!element) return;

    element.textContent =
      textValue(
        value,
        getLanguage()
      );
  }

  function updateLanguageUI() {
    const lang = getLanguage();

    document.documentElement.lang =
      lang === "hi"
        ? "hi"
        : "en";

    if (DOM.languageButton) {
      DOM.languageButton.textContent =
        lang === "hi"
          ? "EN"
          : "हिं";
    }

    if (DOM.settingsLanguageButton) {
      DOM.settingsLanguageButton.textContent =
        lang === "hi"
          ? "English"
          : "हिन्दी";
    }

    updateStaticText();
  }

  /* =========================================================
     STATIC UI TEXT
     ========================================================= */

  function updateStaticText() {
    const hi = getLanguage() === "hi";

    setText(
      DOM.businessName,
      cfg(
        "branding.businessName",
        "Sandeep ElectroFix"
      )
    );

    setText(
      DOM.businessTagline,
      cfg(
        "branding.tagline",
        "Powering Your Trust"
      )
    );

    setText(
      DOM.loadingBusinessName,
      cfg(
        "branding.businessName",
        "Sandeep ElectroFix"
      )
    );

    setText(
      DOM.loadingTagline,
      cfg(
        "branding.tagline",
        "Powering Your Trust"
      )
    );

    if (DOM.loadingText) {
      DOM.loadingText.textContent =
        hi
          ? "लोड हो रहा है..."
          : "Loading...";
    }

    if (DOM.materialSearch) {
      DOM.materialSearch.placeholder =
        hi
          ? "मटेरियल खोजें..."
          : "Search material...";
    }

    if (DOM.itemNextButton) {
      DOM.itemNextButton.textContent =
        hi
          ? "अगला"
          : "Next";
    }

    if (DOM.addToEstimateButton) {
      DOM.addToEstimateButton.textContent =
        hi
          ? "एस्टिमेट में जोड़ें"
          : "Add to Estimate";
    }

    if (DOM.itemBackButton) {
      DOM.itemBackButton.textContent =
        hi
          ? "वापस"
          : "Back";
    }

    if (DOM.editorBackButton) {
      DOM.editorBackButton.textContent =
        hi
          ? "वापस"
          : "Back";
    }

    if (DOM.materialBackButton) {
      DOM.materialBackButton.textContent =
        hi
          ? "वापस"
          : "Back";
    }

    if (DOM.quantityField) {
      const label =
        DOM.quantityField.querySelector(
          ".field-label"
        );

      if (label) {
        label.textContent =
          hi
            ? "मात्रा"
            : "Quantity";
      }
    }

    if (DOM.unitField) {
      const label =
        DOM.unitField.querySelector(
          ".field-label"
        );

      if (label) {
        label.textContent =
          hi
            ? "यूनिट"
            : "Unit";
      }
    }

    if (DOM.brandField) {
      const label =
        DOM.brandField.querySelector(
          ".field-label"
        );

      if (label) {
        label.textContent =
          hi
            ? "ब्रांड"
            : "Brand";
      }
    }

    if (DOM.priceField) {
      const label =
        DOM.priceField.querySelector(
          ".field-label"
        );

      if (label) {
        label.textContent =
          hi
            ? "कीमत"
            : "Price";
      }
    }

    updatePageTitle();
  }

  /* =========================================================
     PAGE TITLES
     ========================================================= */

  function pageTitle(page) {
    const hi =
      getLanguage() === "hi";

    const titles = {
      home: hi
        ? "होम"
        : "Home",

      estimate: hi
        ? "एस्टिमेट लिस्ट"
        : "Estimate List",

      calculator: hi
        ? "कैलकुलेटर"
        : "Calculator",

      settings: hi
        ? "सेटिंग्स"
        : "Settings"
    };

    return titles[page] || "Sandeep ElectroFix";
  }

  function updatePageTitle() {
    if (!DOM.topBarTitle) return;

    if (
      state.currentPage === "materials" ||
      state.currentPage === "editor"
    ) {
      const stage =
        getStageById(
          state.currentStageId
        );

      if (stage) {
        const name =
          getStageName(stage);

        DOM.topBarTitle.textContent =
          name.en ||
          name.hi ||
          "Materials";

        return;
      }
    }

    DOM.topBarTitle.textContent =
      pageTitle(
        state.currentPage
      );
  }

  /* =========================================================
     LOADING SCREEN
     ========================================================= */

  function hideLoadingScreen() {
    const screen =
      DOM.loadingScreen;

    if (!screen) return;

    screen.classList.add("hidden");

    setTimeout(() => {
      screen.style.display = "none";
    }, 500);
  }

  function showLoadingScreen() {
    const screen =
      DOM.loadingScreen;

    if (!screen) return;

    screen.style.display = "";
    screen.classList.remove("hidden");
  }

  /* =========================================================
     BRANDING
     ========================================================= */

  function applyBranding() {
    const logo =
      cfg(
        "branding.logo",
        "logo.png"
      );

    const businessName =
      cfg(
        "branding.businessName",
        "Sandeep ElectroFix"
      );

    const tagline =
      cfg(
        "branding.tagline",
        "Powering Your Trust"
      );

    const logoElements = [
      DOM.loadingLogo,
      DOM.heroLogo
    ];

    logoElements.forEach((img) => {
      if (!img) return;

      if (
        isEnabled("ui.logo", true) &&
        logo
      ) {
        img.src = logo;
        img.alt =
          businessName;
        img.hidden = false;
      } else {
        img.hidden = true;
      }
    });

    if (DOM.businessName) {
      DOM.businessName.textContent =
        businessName;

      DOM.businessName.hidden =
        !isEnabled(
          "ui.businessName",
          true
        );
    }

    if (DOM.businessTagline) {
      DOM.businessTagline.textContent =
        tagline;

      DOM.businessTagline.hidden =
        !isEnabled(
          "ui.tagline",
          true
        );
    }

    if (DOM.loadingBusinessName) {
      DOM.loadingBusinessName.textContent =
        businessName;
    }

    if (DOM.loadingTagline) {
      DOM.loadingTagline.textContent =
        tagline;
    }
  }

  /* =========================================================
     THEME
     ========================================================= */

  function applyTheme() {
    const theme =
      state.theme === "light"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme =
      theme;

    document.body.classList.toggle(
      "light-theme",
      theme === "light"
    );

    document.body.classList.toggle(
      "dark-theme",
      theme === "dark"
    );

    if (DOM.themeToggleButton) {
      DOM.themeToggleButton.textContent =
        theme === "dark"
          ? (
              getLanguage() === "hi"
                ? "☀️ लाइट मोड"
                : "☀️ Light Mode"
            )
          : (
              getLanguage() === "hi"
                ? "🌙 डार्क मोड"
                : "🌙 Dark Mode"
            );
    }
  }

  function toggleTheme() {
    if (
      !isEnabled(
        "theme.allowToggle",
        true
      )
    ) {
      return;
    }

    state.theme =
      state.theme === "dark"
        ? "light"
        : "dark";

    storageSet(
      STORAGE.theme,
      state.theme
    );

    applyTheme();
  }

  /* =========================================================
     MATERIAL HELPERS
     ========================================================= */

  function getStageById(id) {
    return STAGES.find(
      (stage) =>
        String(
          stage.id ??
          stage.stageId ??
          stage.no
        ) === String(id)
    ) || null;
  }

  function getStageItems(stageId) {
    return MATERIALS.filter(
      (item) =>
        String(
          item.stageId ??
          item.stage ??
          item.stageNo
        ) === String(stageId)
    );
  }

  function getStageName(stage) {
    return {
      en:
        stage.en ??
        stage.name?.en ??
        stage.title?.en ??
        stage.name ??
        stage.title ??
        "",

      hi:
        stage.hi ??
        stage.name?.hi ??
        stage.title?.hi ??
        ""
    };
  }

  function getStageDescription(stage) {
    return {
      en:
        stage.description?.en ??
        stage.desc?.en ??
        stage.description ??
        "",

      hi:
        stage.description?.hi ??
        stage.desc?.hi ??
        ""
    };
  }

  function getStageNumber(stage, index = 0) {
    return (
      stage.number ??
      stage.no ??
      stage.stageNo ??
      String(index + 1).padStart(2, "0")
    );
  }

  function getStageIcon(stage) {
    return (
      stage.icon ??
      stage.emoji ??
      ""
    );
  }

  function getItemId(item, index = 0) {
    return String(
      item.id ??
      item.key ??
      item.code ??
      `${item.stageId || item.stage || 0}-${index}`
    );
  }

  function getItemName(item) {
    return {
      en:
        item.en ??
        item.name?.en ??
        item.title?.en ??
        item.name ??
        item.title ??
        "",

      hi:
        item.hi ??
        item.name?.hi ??
        item.title?.hi ??
        ""
    };
  }

  function getItemImage(item) {
    return (
      item.image ??
      item.imageUrl ??
      item.img ??
      ""
    );
  }

  /* =========================================================
     FIELD HELPERS
     ========================================================= */

  function getMaterialFields(item) {
    if (!item) return [];

    let fields =
      item.fields ??
      item.options ??
      item.controls ??
      [];

    if (
      typeof fields === "object" &&
      !Array.isArray(fields)
    ) {
      fields =
        Object.keys(fields).map(
          (key) => ({
            key,
            ...(
              typeof fields[key] === "object"
                ? fields[key]
                : {
                    options:
                      fields[key]
                  }
            )
          })
        );
    }

    if (!Array.isArray(fields)) {
      return [];
    }

    return fields;
  }

  function fieldKey(field, index = 0) {
    return String(
      field.key ??
      field.id ??
      field.nameKey ??
      field.name ??
      `field_${index}`
    );
  }

  function fieldLabel(field) {
    return {
      en:
        field.label?.en ??
        field.name?.en ??
        field.title?.en ??
        field.en ??
        field.label ??
        field.name ??
        field.title ??
        fieldKey(field),

      hi:
        field.label?.hi ??
        field.name?.hi ??
        field.title?.hi ??
        field.hi ??
        field.label ??
        field.name ??
        field.title ??
        field.label?.en ??
        field.name?.en ??
        fieldKey(field)
    };
  }

  function normalizeOption(option) {
    if (
      option === null ||
      option === undefined
    ) {
      return {
        value: "",
        en: "",
        hi: ""
      };
    }

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

    return {
      value:
        option.value ??
        option.id ??
        option.key ??
        option.en ??
        option.label ??
        "",

      en:
        option.en ??
        option.label?.en ??
        option.name?.en ??
        option.label ??
        option.name ??
        option.value ??
        "",

      hi:
        option.hi ??
        option.label?.hi ??
        option.name?.hi ??
        option.label ??
        option.name ??
        option.en ??
        option.value ??
        ""
    };
  }

  function fieldOptions(field) {
    let options =
      field.options ??
      field.values ??
      field.choices ??
      [];

    if (
      typeof options === "object" &&
      !Array.isArray(options)
    ) {
      options =
        Object.entries(options).map(
          ([value, label]) => ({
            value,
            label
          })
        );
    }

    if (!Array.isArray(options)) {
      options = [];
    }

    return options.map(
      normalizeOption
    );
  }

  function fieldType(field) {
    return (
      field.type ??
      (
        fieldOptions(field).length
          ? "select"
          : "text"
      )
    ).toLowerCase();
  }

  function getDraft(item) {
    const id =
      getItemId(item);

    if (!state.draftValues[id]) {
      state.draftValues[id] = {};
    }

    return state.draftValues[id];
  }

  function setDraftValue(
    item,
    key,
    value
  ) {
    const draft =
      getDraft(item);

    draft[key] = value;
  }

  function getDraftValue(
    item,
    key,
    fallback = ""
  ) {
    const draft =
      getDraft(item);

    return draft[key] !== undefined
      ? draft[key]
      : fallback;
  }

  /* =========================================================
     FIELD ORDER
     ========================================================= */

  function fieldPriority(field) {
    const key =
      fieldKey(field)
        .toLowerCase()
        .replace(/[\s_-]/g, "");

    const label =
      fieldLabel(field);

    const text =
      `${key} ${label.en} ${label.hi}`
        .toLowerCase();

    if (
      text.includes("size") ||
      text.includes("conduit") ||
      text.includes("module") ||
      text.includes("diameter") ||
      text.includes("watt") ||
      text.includes("amp") ||
      text.includes("length") ||
      text.includes("voltage") ||
      text.includes("dimension") ||
      text.includes("weight")
    ) {
      return 10;
    }

    if (
      text.includes("type") &&
      !text.includes("sub")
    ) {
      return 20;
    }

    if (
      text.includes("sub type") ||
      text.includes("subtype")
    ) {
      return 30;
    }

    if (
      text.includes("colour") ||
      text.includes("color")
    ) {
      return 40;
    }

    if (
      text.includes("material")
    ) {
      return 50;
    }

    if (
      text.includes("shape") ||
      text.includes("way") ||
      text.includes("door") ||
      text.includes("curve") ||
      text.includes("sensitivity") ||
      text.includes("mounting") ||
      text.includes("beam") ||
      text.includes("body") ||
      text.includes("movement") ||
      text.includes("output") ||
      text.includes("supply")
    ) {
      return 60;
    }

    return 70;
  }

  function sortFields(fields) {
    return fields
      .map(
        (field, index) => ({
          field,
          index,
          priority:
            field.order ??
            fieldPriority(field)
        })
      )
      .sort(
        (a, b) =>
          a.priority -
          b.priority ||
          a.index -
          b.index
      )
      .map(
        (entry) =>
          entry.field
      );
  }

  /* =========================================================
     HOME
     ========================================================= */

  function renderHome() {
    if (!DOM.homePage) return;

    DOM.homePage.hidden = false;

    if (DOM.homeHero) {
      DOM.homeHero.hidden =
        !isEnabled(
          "home.showHero",
          true
        );
    }

    if (DOM.searchContainer) {
      DOM.searchContainer.hidden =
        !isEnabled(
          "home.showSearch",
          true
        ) ||
        !isEnabled(
          "ui.searchBar",
          true
        );
    }

    if (DOM.stageCardsContainer) {
      DOM.stageCardsContainer.hidden =
        !isEnabled(
          "home.showStageCards",
          true
        ) ||
        !isEnabled(
          "ui.stageCards",
          true
        );
    }

    renderStageCards();
  }

  function renderStageCards() {
    const container =
      DOM.stageCardsContainer;

    if (!container) return;

    container.innerHTML = "";

    if (
      !isEnabled(
        "home.showStageCards",
        true
      )
    ) {
      return;
    }

    STAGES.forEach(
      (stage, index) => {
        const card =
          document.createElement("button");

        card.type = "button";
        card.className =
          "stage-card";

        card.dataset.stageId =
          String(
            stage.id ??
            stage.stageId ??
            stage.no
          );

        const inner =
          document.createElement("div");

        inner.className =
          "stage-card-inner";

        if (
          isEnabled(
            "home.showStageNumbers",
            true
          ) &&
          isEnabled(
            "stageCards.showNumber",
            true
          )
        ) {
          const number =
            document.createElement("div");

          number.className =
            "stage-card-number";

          number.textContent =
            `STAGE ${String(
              getStageNumber(
                stage,
                index
              )
            ).replace(
              /^STAGE\s*/i,
              ""
            ).padStart(2, "0")}`;

          inner.appendChild(
            number
          );
        }

        if (
          isEnabled(
            "home.showStageIcons",
            true
          ) &&
          isEnabled(
            "stageCards.showIcon",
            true
          )
        ) {
          const icon =
            getStageIcon(stage);

          if (icon) {
            const iconEl =
              document.createElement("div");

            iconEl.className =
              "stage-card-icon";

            iconEl.textContent =
              icon;

            inner.appendChild(
              iconEl
            );
          }
        }

        const name =
          getStageName(stage);

        if (
          isEnabled(
            "home.showStageTitles",
            true
          )
        ) {
          if (
            isEnabled(
              "stageCards.showEnglish",
              true
            )
          ) {
            const en =
              document.createElement("div");

            en.className =
              "stage-card-title";

            en.textContent =
              name.en;

            inner.appendChild(en);
          }

          if (
            isEnabled(
              "stageCards.showHindi",
              true
            )
          ) {
            const hi =
              document.createElement("div");

            hi.className =
              "stage-card-title-hi";

            hi.textContent =
              name.hi;

            inner.appendChild(hi);
          }
        }

        if (
          isEnabled(
            "home.showStageDescriptions",
            true
          ) &&
          isEnabled(
            "stageCards.showDescription",
            true
          )
        ) {
          const description =
            getStageDescription(
              stage
            );

          const desc =
            document.createElement("div");

          desc.className =
            "stage-card-description";

          desc.textContent =
            getLanguage() === "hi"
              ? (
                  description.hi ||
                  description.en
                )
              : (
                  description.en ||
                  description.hi
                );

          if (!desc.textContent) {
            desc.hidden = true;
          }

          inner.appendChild(desc);
        }

        card.appendChild(
          inner
        );

        card.addEventListener(
          "click",
          () => {
            openStage(
              stage.id ??
              stage.stageId ??
              stage.no
            );
          }
        );

        container.appendChild(
          card
        );
      }
    );
  }

  /* =========================================================
     SEARCH
     ========================================================= */

  function setupSearch() {
    if (!DOM.materialSearch) {
      return;
    }

    DOM.materialSearch.addEventListener(
      "input",
      (event) => {
        state.searchText =
          String(
            event.target.value ||
            ""
          ).trim();

        updateSearchClear();

        if (
          state.currentPage === "home"
        ) {
          renderSearchResults();
        } else if (
          state.currentPage === "materials"
        ) {
          renderMaterialList();
        }
      }
    );

    if (DOM.searchClearButton) {
      DOM.searchClearButton.addEventListener(
        "click",
        clearSearch
      );
    }
  }

  function updateSearchClear() {
    if (!DOM.searchClearButton) {
      return;
    }

    DOM.searchClearButton.hidden =
      !state.searchText;
  }

  function clearSearch() {
    state.searchText = "";

    if (DOM.materialSearch) {
      DOM.materialSearch.value =
        "";
    }

    updateSearchClear();

    if (
      state.currentPage === "home"
    ) {
      renderStageCards();
    }

    if (
      state.currentPage === "materials"
    ) {
      renderMaterialList();
    }
  }

  function searchMatchesMaterial(
    item,
    query
  ) {
    if (!query) return true;

    const q =
      query.toLowerCase();

    const name =
      getItemName(item);

    const searchable =
      [
        name.en,
        name.hi,
        item.id,
        item.code,
        item.category
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return searchable.includes(q);
  }

  function renderSearchResults() {
    const query =
      state.searchText
        .toLowerCase();

    if (!query) {
      renderStageCards();
      return;
    }

    const matched =
      MATERIALS.filter(
        (item) =>
          searchMatchesMaterial(
            item,
            query
          )
      );

    const container =
      DOM.stageCardsContainer;

    if (!container) return;

    container.innerHTML = "";

    if (!matched.length) {
      const empty =
        document.createElement("div");

      empty.className =
        "empty-state";

      empty.textContent =
        getLanguage() === "hi"
          ? "कोई मटेरियल नहीं मिला"
          : "No material found";

      container.appendChild(
        empty
      );

      return;
    }

    matched.forEach(
      (item) => {
        const card =
          document.createElement("button");

        card.type = "button";
        card.className =
          "material-card search-material-card";

        const image =
          getItemImage(item);

        if (
          isEnabled(
            "materials.showImages",
            true
          ) &&
          image
        ) {
          const img =
            document.createElement("img");

          img.className =
            "material-card-image";

          img.src = image;
          img.alt =
            getItemName(item).en;

          card.appendChild(img);
        }

        const content =
          document.createElement("div");

        content.className =
          "material-card-content";

        if (
          isEnabled(
            "materials.showItemNumber",
            true
          )
        ) {
          const number =
            document.createElement("div");

          number.className =
            "material-card-number";

          number.textContent =
            getGlobalItemNumber(
              item
            );

          content.appendChild(
            number
          );
        }

        const name =
          getItemName(item);

        if (
          isEnabled(
            "materials.showItemName",
            true
          )
        ) {
          const title =
            document.createElement("div");

          title.className =
            "material-card-title";

          title.textContent =
            getLanguage() === "hi"
              ? (
                  name.hi ||
                  name.en
                )
              : (
                  name.en ||
                  name.hi
                );

          content.appendChild(
            title
          );
        }

        card.appendChild(
          content
        );

        card.addEventListener(
          "click",
          () => {
            const stageId =
              item.stageId ??
              item.stage ??
              item.stageNo;

            openStage(
              stageId,
              item
            );
          }
        );

        container.appendChild(
          card
        );
      }
    );
  }

  function getGlobalItemNumber(item) {
    const index =
      MATERIALS.indexOf(item);

    return index >= 0
      ? String(index + 1).padStart(
          2,
          "0"
        )
      : "";
  }

  /* =========================================================
     STAGE NAVIGATION
     ========================================================= */

  function openStage(
    stageId,
    openItem = null
  ) {
    state.currentStageId =
      stageId;

    state.currentItemIndex = -1;
    state.currentItem = null;

    state.currentPage =
      "materials";

    closeMenu();

    showPage(
      "materials"
    );

    updatePageTitle();

    renderMaterialHeader();
    renderMaterialList();

    if (openItem) {
      const items =
        getStageItems(stageId);

      const index =
        items.indexOf(openItem);

      if (index >= 0) {
        openMaterialEditor(
          index
        );
      }
    }
  }

  function renderMaterialHeader() {
    const stage =
      getStageById(
        state.currentStageId
      );

    if (!stage) return;

    const name =
      getStageName(stage);

    if (DOM.materialStageNumber) {
      DOM.materialStageNumber.textContent =
        `STAGE ${String(
          getStageNumber(stage)
        ).replace(
          /^STAGE\s*/i,
          ""
        ).padStart(
          2,
          "0"
        )}`;
    }

    if (DOM.materialStageTitle) {
      DOM.materialStageTitle.textContent =
        name.en ||
        name.hi;
    }

    if (DOM.materialStageTitleHi) {
      DOM.materialStageTitleHi.textContent =
        name.hi ||
        name.en;
    }
  }

  /* =========================================================
     MATERIAL LIST
     ========================================================= */

  function renderMaterialList() {
    const container =
      DOM.materialList;

    if (!container) return;

    container.innerHTML = "";

    const stageItems =
      getStageItems(
        state.currentStageId
      );

    const query =
      state.searchText
        .toLowerCase();

    const items =
      query
        ? stageItems.filter(
            (item) =>
              searchMatchesMaterial(
                item,
                query
              )
          )
        : stageItems;

    if (!items.length) {
      const empty =
        document.createElement("div");

      empty.className =
        "empty-state";

      empty.textContent =
        getLanguage() === "hi"
          ? "कोई मटेरियल नहीं मिला"
          : "No material found";

      container.appendChild(
        empty
      );

      return;
    }

    items.forEach(
      (item) => {
        const originalIndex =
          stageItems.indexOf(item);

        const card =
          createMaterialCard(
            item,
            originalIndex
          );

        container.appendChild(
          card
        );
      }
    );

    applyMaterialView();
  }

  function createMaterialCard(
    item,
    index
  ) {
    const card =
      document.createElement("button");

    card.type = "button";

    card.className =
      "material-card";

    card.dataset.itemIndex =
      String(index);

    const image =
      getItemImage(item);

    if (
      isEnabled(
        "materials.showImages",
        true
      ) &&
      image
    ) {
      const img =
        document.createElement("img");

      img.className =
        "material-card-image";

      img.src = image;

      img.alt =
        getItemName(item).en;

      card.appendChild(
        img
      );
    }

    const content =
      document.createElement("div");

    content.className =
      "material-card-content";

    if (
      isEnabled(
        "materials.showItemNumber",
        true
      )
    ) {
      const number =
        document.createElement("div");

      number.className =
        "material-card-number";

      number.textContent =
        String(
          index + 1
        ).padStart(
          2,
          "0"
        );

      content.appendChild(
        number
      );
    }

    if (
      isEnabled(
        "materials.showItemName",
        true
      )
    ) {
      const name =
        getItemName(item);

      const title =
        document.createElement("div");

      title.className =
        "material-card-title";

      title.textContent =
        getLanguage() === "hi"
          ? (
              name.hi ||
              name.en
            )
          : (
              name.en ||
              name.hi
            );

      content.appendChild(
        title
      );

      if (
        name.hi &&
        name.en &&
        name.hi !== name.en
      ) {
        const sub =
          document.createElement("div");

        sub.className =
          "material-card-subtitle";

        sub.textContent =
          getLanguage() === "hi"
            ? name.en
            : name.hi;

        content.appendChild(
          sub
        );
      }
    }

    card.appendChild(
      content
    );

    card.addEventListener(
      "click",
      () => {
        openMaterialEditor(
          index
        );
      }
    );

    return card;
  }

  /* =========================================================
     MATERIAL EDITOR
     ========================================================= */

  function openMaterialEditor(
    itemIndex
  ) {
    const items =
      getStageItems(
        state.currentStageId
      );

    if (
      itemIndex < 0 ||
      itemIndex >= items.length
    ) {
      return;
    }

    state.currentItemIndex =
      itemIndex;

    state.currentItem =
      items[itemIndex];

    state.currentPage =
      "editor";

    renderMaterialEditor(
      state.currentItem,
      itemIndex
    );

    if (DOM.materialList) {
      DOM.materialList.hidden =
        true;
    }

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden =
        false;
      DOM.materialEditor.classList.add(
        "active"
      );
    }

    updatePageTitle();

    scrollEditorTop();
  }

  function renderMaterialEditor(
    item,
    itemIndex
  ) {
    if (!item) return;

    const name =
      getItemName(item);

    if (DOM.editorItemNumber) {
      DOM.editorItemNumber.textContent =
        String(
          itemIndex + 1
        ).padStart(
          2,
          "0"
        );
    }

    if (DOM.editorItemName) {
      DOM.editorItemName.textContent =
        name.en ||
        name.hi;
    }

    if (DOM.editorItemNameHi) {
      DOM.editorItemNameHi.textContent =
        name.hi ||
        name.en;
    }

    renderEditorImage(item);
    renderDynamicFields(item);

    renderQuantityField(item);
    renderUnitField(item);
    renderBrandField(item);
    renderPriceField(item);

    applyEditorVisibility();
  }

  function renderEditorImage(item) {
    const image =
      getItemImage(item);

    if (
      !DOM.editorImageContainer ||
      !DOM.editorItemImage
    ) {
      return;
    }

    if (
      isEnabled(
        "materials.showImages",
        true
      ) &&
      image
    ) {
      DOM.editorImageContainer.hidden =
        false;

      DOM.editorItemImage.src =
        image;

      DOM.editorItemImage.alt =
        getItemName(item).en;

      DOM.editorItemImage.hidden =
        false;
    } else {
      DOM.editorImageContainer.hidden =
        true;

      DOM.editorItemImage.hidden =
        true;

      DOM.editorItemImage.removeAttribute(
        "src"
      );
    }
  }

  /* =========================================================
     DYNAMIC MATERIAL FIELDS
     ========================================================= */

  function renderDynamicFields(item) {
    if (!DOM.materialFields) {
      return;
    }

    DOM.materialFields.innerHTML = "";

    const fields =
      sortFields(
        getMaterialFields(item)
      );

    fields.forEach(
      (field, index) => {
        const key =
          fieldKey(
            field,
            index
          );

        const fieldLabelData =
          fieldLabel(field);

        const wrapper =
          document.createElement("div");

        wrapper.className =
          "option-field";

        wrapper.dataset.fieldKey =
          key;

        const label =
          document.createElement("label");

        label.className =
          "field-label";

        label.textContent =
          getLanguage() === "hi"
            ? (
                fieldLabelData.hi ||
                fieldLabelData.en
              )
            : (
                fieldLabelData.en ||
                fieldLabelData.hi
              );

        wrapper.appendChild(
          label
        );

        const options =
          fieldOptions(field);

        const type =
          fieldType(field);

        const savedValue =
          getDraftValue(
            item,
            key,
            field.default ??
            ""
          );

        if (
          options.length ||
          type === "select"
        ) {
          createOptionControl(
            wrapper,
            field,
            options,
            savedValue
          );
        } else {
          createInputControl(
            wrapper,
            field,
            savedValue
          );
        }

        DOM.materialFields.appendChild(
          wrapper
        );
      }
    );
  }

  function createOptionControl(
    wrapper,
    field,
    options,
    savedValue
  ) {
    const mode =
      field.display ??
      field.control ??
      "buttons";

    if (
      mode === "select" ||
      field.type === "select"
    ) {
      const select =
        document.createElement("select");

      select.className =
        "field-select";

      addSelectPlaceholder(
        select,
        field
      );

      options.forEach(
        (option) => {
          const opt =
            document.createElement("option");

          opt.value =
            String(option.value);

          opt.textContent =
            getLanguage() === "hi"
              ? (
                  option.hi ||
                  option.en
                )
              : (
                  option.en ||
                  option.hi
                );

          if (
            String(
              savedValue
            ) ===
            String(
              option.value
            )
          ) {
            opt.selected =
              true;
          }

          select.appendChild(
            opt
          );
        }
      );

      select.addEventListener(
        "change",
        () => {
          setDraftValue(
            state.currentItem,
            fieldKey(field),
            select.value
          );
        }
      );

      wrapper.appendChild(
        select
      );

      return;
    }

    const buttonGroup =
      document.createElement("div");

    buttonGroup.className =
      "option-buttons";

    options.forEach(
      (option) => {
        const button =
          document.createElement("button");

        button.type = "button";

        button.className =
          "option-button";

        button.dataset.value =
          String(option.value);

        button.textContent =
          getLanguage() === "hi"
            ? (
                option.hi ||
                option.en
              )
            : (
                option.en ||
                option.hi
              );

        if (
          String(savedValue) ===
          String(option.value)
        ) {
          button.classList.add(
            "selected"
          );
        }

        button.addEventListener(
          "click",
          () => {
            setDraftValue(
              state.currentItem,
              fieldKey(field),
              option.value
            );

            buttonGroup
              .querySelectorAll(
                ".option-button"
              )
              .forEach(
                (btn) =>
                  btn.classList.remove(
                    "selected"
                  )
              );

            button.classList.add(
              "selected"
            );
          }
        );

        buttonGroup.appendChild(
          button
        );
      }
    );

    wrapper.appendChild(
      buttonGroup
    );
  }

  function addSelectPlaceholder(
    select,
    field
  ) {
    const option =
      document.createElement(
        "option"
      );

    option.value = "";

    option.textContent =
      getLanguage() === "hi"
        ? "चुनें"
        : "Select";

    option.disabled =
      false;

    select.appendChild(
      option
    );
  }

  function createInputControl(
    wrapper,
    field,
    savedValue
  ) {
    const type =
      fieldType(field);

    const input =
      document.createElement("input");

    input.className =
      "field-input";

    input.type =
      type === "number"
        ? "number"
        : "text";

    input.value =
      savedValue ?? "";

    if (
      field.placeholder
    ) {
      input.placeholder =
        textValue(
          field.placeholder
        );
    }

    if (
      field.min !== undefined
    ) {
      input.min =
        field.min;
    }

    if (
      field.max !== undefined
    ) {
      input.max =
        field.max;
    }

    if (
      field.step !== undefined
    ) {
      input.step =
        field.step;
    }

    input.addEventListener(
      "input",
      () => {
        setDraftValue(
          state.currentItem,
          fieldKey(field),
          input.value
        );
      }
    );

    wrapper.appendChild(
      input
    );
  }

  /* =========================================================
     QUANTITY
     ========================================================= */

  function renderQuantityField(item) {
    if (!DOM.quantityField) {
      return;
    }

    const enabled =
      isEnabled(
        "quantity.enabled",
        true
      ) &&
      isEnabled(
        "materials.showQuantity",
        true
      );

    DOM.quantityField.hidden =
      !enabled;

    if (!enabled) {
      return;
    }

    const draft =
      getDraft(item);

    if (
      draft.quantity === undefined
    ) {
      draft.quantity =
        cfg(
          "quantity.defaultValue",
          ""
        );
    }

    if (DOM.quantityInput) {
      DOM.quantityInput.value =
        draft.quantity ?? "";

      DOM.quantityInput.min =
        String(
          cfg(
            "quantity.min",
            1
          )
        );

      DOM.quantityInput.max =
        String(
          cfg(
            "quantity.max",
            999999
          )
        );

      DOM.quantityInput.disabled =
        !isEnabled(
          "quantity.allowManualInput",
          true
        );
    }

    if (DOM.quantityMinus) {
      DOM.quantityMinus.hidden =
        !isEnabled(
          "quantity.allowPlusMinus",
          true
        );
    }

    if (DOM.quantityPlus) {
      DOM.quantityPlus.hidden =
        !isEnabled(
          "quantity.allowPlusMinus",
          true
        );
    }
  }

  function setupQuantityControls() {
    if (DOM.quantityInput) {
      DOM.quantityInput.addEventListener(
        "input",
        () => {
          if (!state.currentItem) {
            return;
          }

          let value =
            DOM.quantityInput.value;

          if (
            value !== "" &&
            Number(value) < 0
          ) {
            value = "0";
          }

          setDraftValue(
            state.currentItem,
            "quantity",
            value
          );
        }
      );
    }

    if (DOM.quantityMinus) {
      DOM.quantityMinus.addEventListener(
        "click",
        () => {
          changeQuantity(-1);
        }
      );
    }

    if (DOM.quantityPlus) {
      DOM.quantityPlus.addEventListener(
        "click",
        () => {
          changeQuantity(1);
        }
      );
    }
  }

  function changeQuantity(delta) {
    if (!state.currentItem) {
      return;
    }

    const draft =
      getDraft(
        state.currentItem
      );

    let current =
      Number(
        draft.quantity
      );

    if (
      !Number.isFinite(current) ||
      current < 1
    ) {
      current =
        Number(
          cfg(
            "quantity.min",
            1
          )
        );
    }

    const min =
      Number(
        cfg(
          "quantity.min",
          1
        )
      );

    const max =
      Number(
        cfg(
          "quantity.max",
          999999
        )
      );

    current += delta;

    current =
      Math.max(
        min,
        Math.min(
          max,
          current
        )
      );

    draft.quantity =
      String(current);

    if (DOM.quantityInput) {
      DOM.quantityInput.value =
        String(current);
    }
  }

  function validateQuantity() {
    if (
      !isEnabled(
        "quantity.enabled",
        true
      )
    ) {
      return true;
    }

    if (
      !isEnabled(
        "quantity.required",
        true
      )
    ) {
      return true;
    }

    const value =
      getDraftValue(
        state.currentItem,
        "quantity",
        ""
      );

    const number =
      Number(value);

    if (
      value === "" ||
      !Number.isFinite(number) ||
      number < 1
    ) {
      showToast(
        getLanguage() === "hi"
          ? "कृपया मात्रा भरें"
          : "Please enter quantity",
        "warning"
      );

      if (DOM.quantityInput) {
        DOM.quantityInput.focus();
      }

      return false;
    }

    return true;
  }

  /* =========================================================
     UNIT
     ========================================================= */

  function getUnits(item) {
    let units =
      item.units ??
      item.unitOptions ??
      item.unit ??
      [];

    if (
      typeof units === "string"
    ) {
      units =
        units
          .split(",")
          .map(
            (v) =>
              v.trim()
          )
          .filter(Boolean);
    }

    if (!Array.isArray(units)) {
      units = [];
    }

    return units.map(
      normalizeOption
    );
  }

  function renderUnitField(item) {
    if (!DOM.unitField) {
      return;
    }

    const enabled =
      isEnabled(
        "materials.showUnit",
        true
      );

    DOM.unitField.hidden =
      !enabled;

    if (!enabled) {
      return;
    }

    const units =
      getUnits(item);

    if (!DOM.unitSelect) {
      return;
    }

    DOM.unitSelect.innerHTML =
      "";

    const placeholder =
      document.createElement(
        "option"
      );

    placeholder.value = "";

    placeholder.textContent =
      getLanguage() === "hi"
        ? "यूनिट चुनें"
        : "Select Unit";

    DOM.unitSelect.appendChild(
      placeholder
    );

    const draft =
      getDraft(item);

    let current =
      draft.unit;

    if (
      current === undefined ||
      current === ""
    ) {
      current =
        state.lastUnit ||
        "";
    }

    units.forEach(
      (unit) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          String(unit.value);

        option.textContent =
          getLanguage() === "hi"
            ? (
                unit.hi ||
                unit.en
              )
            : (
                unit.en ||
                unit.hi
              );

        if (
          String(current) ===
          String(unit.value)
        ) {
          option.selected =
            true;
        }

        DOM.unitSelect.appendChild(
          option
        );
      }
    );

    DOM.unitSelect.onchange =
      () => {
        const value =
          DOM.unitSelect.value;

        setDraftValue(
          state.currentItem,
          "unit",
          value
        );

        if (value) {
          state.lastUnit =
            value;
        }
      };
  }

  /* =========================================================
     BRAND
     ========================================================= */

  function getBrands(item) {
    let brands =
      item.brands ??
      item.brandOptions ??
      [];

    if (
      typeof brands === "string"
    ) {
      brands =
        brands
          .split(",")
          .map(
            (v) =>
              v.trim()
          )
          .filter(Boolean);
    }

    if (!Array.isArray(brands)) {
      brands = [];
    }

    return brands.map(
      normalizeOption
    );
  }

  function renderBrandField(item) {
    if (!DOM.brandField) {
      return;
    }

    const enabled =
      isEnabled(
        "brand.enabled",
        true
      ) &&
      isEnabled(
        "materials.showBrand",
        true
      );

    DOM.brandField.hidden =
      !enabled;

    if (!enabled) {
      return;
    }

    const brands =
      getBrands(item);

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
      getLanguage() === "hi"
        ? "ब्रांड चुनें (वैकल्पिक)"
        : "Select Brand (Optional)";

    DOM.brandSelect.appendChild(
      blank
    );

    const draft =
      getDraft(item);

    const current =
      draft.brand ?? "";

    brands.forEach(
      (brand) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          String(brand.value);

        option.textContent =
          getLanguage() === "hi"
            ? (
                brand.hi ||
                brand.en
              )
            : (
                brand.en ||
                brand.hi
              );

        if (
          String(current) ===
          String(brand.value)
        ) {
          option.selected =
            true;
        }

        DOM.brandSelect.appendChild(
          option
        );
      }
    );

    DOM.brandSelect.onchange =
      () => {
        setDraftValue(
          state.currentItem,
          "brand",
          DOM.brandSelect.value
        );
      };
  }

  /* =========================================================
     PRICE
     ========================================================= */

  function renderPriceField(item) {
    if (!DOM.priceField) {
      return;
    }

    const enabled =
      isEnabled(
        "price.enabled",
        true
      );

    const visible =
      enabled &&
      (
        isEnabled(
          "price.visible",
          false
        ) ||
        (
          isEnabled(
            "price.showOnlyWhenFilled",
            true
          ) &&
          Boolean(
            getDraftValue(
              item,
              "price",
              ""
            )
          )
        )
      ) &&
      isEnabled(
        "materials.showPrice",
        false
      );

    DOM.priceField.hidden =
      !visible;

    if (
      DOM.priceInput &&
      visible
    ) {
      DOM.priceInput.value =
        getDraftValue(
          item,
          "price",
          ""
        );
    }
  }

  function setupPriceControl() {
    if (!DOM.priceInput) {
      return;
    }

    DOM.priceInput.addEventListener(
      "input",
      () => {
        if (!state.currentItem) {
          return;
        }

        setDraftValue(
          state.currentItem,
          "price",
          DOM.priceInput.value
        );
      }
    );
  }

  /* =========================================================
     EDITOR VISIBILITY
     ========================================================= */

  function applyEditorVisibility() {
    if (DOM.editorActions) {
      DOM.editorActions.hidden =
        !isEnabled(
          "ui.addToEstimateButton",
          true
        ) &&
        !isEnabled(
          "ui.nextButton",
          true
        ) &&
        !isEnabled(
          "ui.backButton",
          true
        );
    }

    if (DOM.itemBackButton) {
      DOM.itemBackButton.hidden =
        !isEnabled(
          "ui.backButton",
          true
        );
    }

    if (DOM.editorBackButton) {
      DOM.editorBackButton.hidden =
        !isEnabled(
          "ui.backButton",
          true
        );
    }

    if (DOM.materialBackButton) {
      DOM.materialBackButton.hidden =
        !isEnabled(
          "ui.backButton",
          true
        );
    }

    if (DOM.itemNextButton) {
      DOM.itemNextButton.hidden =
        !isEnabled(
          "ui.nextButton",
          true
        );
    }

    if (DOM.addToEstimateButton) {
      DOM.addToEstimateButton.hidden =
        !isEnabled(
          "ui.addToEstimateButton",
          true
        );
    }
  }

  /* =========================================================
     SAVE / ADD TO ESTIMATE
     ========================================================= */

  function buildEstimateItem() {
    const item =
      state.currentItem;

    if (!item) {
      return null;
    }

    const draft =
      getDraft(item);

    const itemName =
      getItemName(item);

    const fields =
      sortFields(
        getMaterialFields(item)
      );

    const selections = {};

    fields.forEach(
      (field) => {
        const key =
          fieldKey(field);

        const value =
          draft[key];

        if (
          value !== undefined &&
          value !== ""
        ) {
          const options =
            fieldOptions(field);

          const selected =
            options.find(
              (option) =>
                String(
                  option.value
                ) ===
                String(value)
            );

          selections[key] = {
            value,
            label:
              selected
                ? {
                    en:
                      selected.en,
                    hi:
                      selected.hi
                  }
                : {
                    en:
                      String(value),
                    hi:
                      String(value)
                  }
          };
        }
      }
    );

    return {
      id:
        `${getItemId(item)}-${Date.now()}`,

      materialId:
        getItemId(item),

      stageId:
        item.stageId ??
        item.stage ??
        item.stageNo,

      itemIndex:
        state.currentItemIndex,

      name: itemName,

      selections,

      quantity:
        draft.quantity ?? "",

      unit:
        draft.unit ??
        state.lastUnit ??
        "",

      brand:
        draft.brand ?? "",

      price:
        draft.price ?? "",

      addedAt:
        new Date().toISOString()
    };
  }

  function addCurrentToEstimate() {
    if (!state.currentItem) {
      return;
    }

    if (!validateQuantity()) {
      return;
    }

    const estimateItem =
      buildEstimateItem();

    if (!estimateItem) {
      return;
    }

    state.estimateItems.push(
      estimateItem
    );

    saveEstimate();

    showToast(
      getLanguage() === "hi"
        ? "एस्टिमेट में जोड़ दिया गया"
        : "Added to estimate",
      "success"
    );

    if (
      isEnabled(
        "navigation.autoNextAfterAdd",
        true
      )
    ) {
      openNextItem();
    }
  }

  function saveEstimate() {
    saveJSON(
      STORAGE.estimate,
      state.estimateItems
    );
  }

  /* =========================================================
     NEXT
     ========================================================= */

  function openNextItem() {
    const items =
      getStageItems(
        state.currentStageId
      );

    const nextIndex =
      state.currentItemIndex + 1;

    if (
      nextIndex >= items.length
    ) {
      showToast(
        getLanguage() === "hi"
          ? "यह स्टेज पूरा हो गया"
          : "This stage is complete",
        "info"
      );

      return;
    }

    openMaterialEditor(
      nextIndex
    );

    if (
      isEnabled(
        "navigation.scrollNextToTop",
        true
      )
    ) {
      scrollEditorTop();
    }
  }

  /* =========================================================
     BACK
     ========================================================= */

  function backFromEditor() {
    state.currentPage =
      "materials";

    state.currentItem =
      null;

    state.currentItemIndex =
      -1;

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden =
        true;

      DOM.materialEditor.classList.remove(
        "active"
      );
    }

    if (DOM.materialList) {
      DOM.materialList.hidden =
        false;
    }

    updatePageTitle();

    renderMaterialList();

    scrollPageTop();
  }

  function backFromMaterials() {
    state.currentPage =
      "home";

    state.currentStageId =
      null;

    state.currentItem =
      null;

    state.currentItemIndex =
      -1;

    showPage(
      "home"
    );

    renderHome();

    scrollPageTop();
  }

  function goToPreviousItem() {
    if (
      !state.currentItem
    ) {
      return;
    }

    const previousIndex =
      state.currentItemIndex - 1;

    if (
      previousIndex < 0
    ) {
      backFromEditor();
      return;
    }

    openMaterialEditor(
      previousIndex
    );

    scrollEditorTop();
  }

  /* =========================================================
     SCROLL
     ========================================================= */

  function scrollPageTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function scrollEditorTop() {
    requestAnimationFrame(
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }

  /* =========================================================
     ESTIMATE PAGE
     ========================================================= */

  function renderEstimatePage() {
    if (!DOM.estimatePage) {
      return;
    }

    if (
      DOM.estimateItems
    ) {
      DOM.estimateItems.innerHTML =
        "";
    }

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

    if (!DOM.estimateItems) {
      return;
    }

    items.forEach(
      (
        estimateItem,
        index
      ) => {
        const card =
          createEstimateCard(
            estimateItem,
            index
          );

        DOM.estimateItems.appendChild(
          card
        );
      }
    );
  }

  function createEstimateCard(
    estimateItem,
    index
  ) {
    const card =
      document.createElement("div");

    card.className =
      "estimate-item";

    card.dataset.id =
      estimateItem.id;

    const name =
      estimateItem.name || {};

    const title =
      document.createElement("div");

    title.className =
      "estimate-item-title";

    title.textContent =
      getLanguage() === "hi"
        ? (
            name.hi ||
            name.en ||
            ""
          )
        : (
            name.en ||
            name.hi ||
            ""
          );

    card.appendChild(
      title
    );

    const details =
      document.createElement("div");

    details.className =
      "estimate-item-details";

    const selections =
      estimateItem.selections ||
      {};

    Object.keys(
      selections
    ).forEach(
      (key) => {
        const selection =
          selections[key];

        if (
          !selection ||
          selection.value === ""
        ) {
          return;
        }

        const row =
          document.createElement("div");

        row.className =
          "estimate-detail-row";

        const label =
          document.createElement("span");

        label.textContent =
          key;

        const value =
          document.createElement("span");

        value.textContent =
          getLanguage() === "hi"
            ? (
                selection.label?.hi ||
                selection.label?.en ||
                selection.value
              )
            : (
                selection.label?.en ||
                selection.label?.hi ||
                selection.value
              );

        row.appendChild(
          label
        );

        row.appendChild(
          value
        );

        details.appendChild(
          row
        );
      }
    );

    if (
      estimateItem.quantity !==
      undefined
    ) {
      appendEstimateDetail(
        details,
        getLanguage() === "hi"
          ? "मात्रा"
          : "Quantity",
        estimateItem.quantity
      );
    }

    if (
      estimateItem.unit
    ) {
      appendEstimateDetail(
        details,
        getLanguage() === "hi"
          ? "यूनिट"
          : "Unit",
        estimateItem.unit
      );
    }

    if (
      estimateItem.brand
    ) {
      appendEstimateDetail(
        details,
        getLanguage() === "hi"
          ? "ब्रांड"
          : "Brand",
        estimateItem.brand
      );
    }

    if (
      estimateItem.price
    ) {
      appendEstimateDetail(
        details,
        getLanguage() === "hi"
          ? "कीमत"
          : "Price",
        `${cfg(
          "price.currency",
          "₹"
        )}${estimateItem.price}`
      );
    }

    card.appendChild(
      details
    );

    const actions =
      document.createElement("div");

    actions.className =
      "estimate-item-actions";

    const edit =
      document.createElement("button");

    edit.type = "button";
    edit.textContent =
      getLanguage() === "hi"
        ? "एडिट"
        : "Edit";

    edit.addEventListener(
      "click",
      () => {
        editEstimateItem(
          index
        );
      }
    );

    const remove =
      document.createElement("button");

    remove.type = "button";
    remove.textContent =
      getLanguage() === "hi"
        ? "हटाएँ"
        : "Delete";

    remove.addEventListener(
      "click",
      () => {
        deleteEstimateItem(
          index
        );
      }
    );

    actions.appendChild(
      edit
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
      document.createElement("div");

    row.className =
      "estimate-detail-row";

    const label =
      document.createElement("span");

    label.textContent =
      labelText;

    const value =
      document.createElement("span");

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

  function editEstimateItem(
    index
  ) {
    const saved =
      state.estimateItems[index];

    if (!saved) {
      return;
    }

    const item =
      MATERIALS.find(
        (material) =>
          String(
            getItemId(material)
          ) ===
          String(
            saved.materialId
          )
      );

    if (!item) {
      showToast(
        getLanguage() === "hi"
          ? "मटेरियल नहीं मिला"
          : "Material not found",
        "warning"
      );

      return;
    }

    const stageId =
      item.stageId ??
      item.stage ??
      item.stageNo;

    const stageItems =
      getStageItems(
        stageId
      );

    const itemIndex =
      stageItems.indexOf(
        item
      );

    state.currentStageId =
      stageId;

    state.draftValues[
      getItemId(item)
    ] = {};

    const draft =
      getDraft(item);

    Object.keys(
      saved.selections ||
      {}
    ).forEach(
      (key) => {
        draft[key] =
          saved.selections[key].value;
      }
    );

    draft.quantity =
      saved.quantity ??
      "";

    draft.unit =
      saved.unit ??
      "";

    draft.brand =
      saved.brand ??
      "";

    draft.price =
      saved.price ??
      "";

    state.currentPage =
      "materials";

    showPage(
      "materials"
    );

    renderMaterialHeader();
    renderMaterialList();

    openMaterialEditor(
      itemIndex
    );
  }

  function deleteEstimateItem(
    index
  ) {
    const message =
      getLanguage() === "hi"
        ? "क्या आप इस आइटम को एस्टिमेट से हटाना चाहते हैं?"
        : "Delete this item from estimate?";

    if (
      !window.confirm(message)
    ) {
      return;
    }

    state.estimateItems.splice(
      index,
      1
    );

    saveEstimate();
    renderEstimatePage();

    showToast(
      getLanguage() === "hi"
        ? "आइटम हटा दिया गया"
        : "Item deleted",
      "success"
    );
  }

  /* =========================================================
     MATERIAL VIEW MODES
     ========================================================= */

  function applyMaterialView() {
    if (!DOM.materialList) {
      return;
    }

    const enabledViews =
      cfg(
        "views",
        {}
      );

    const current =
      state.materialView;

    const classes = [
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
    ];

    classes.forEach(
      (className) => {
        DOM.materialList.classList.remove(
          className
        );
      }
    );

    const map = {
      grid: "view-grid",
      list: "view-list",
      compact: "view-compact",
      large: "view-large",
      mini: "view-mini",
      twoColumn: "view-two-column",
      horizontal: "view-horizontal",
      iconList: "view-icon-list",
      timeline: "view-timeline",
      dense: "view-dense"
    };

    let selected =
      map[current];

    if (
      !selected ||
      (
        enabledViews[current] === false
      )
    ) {
      selected =
        "view-grid";

      state.materialView =
        "grid";

      storageSet(
        STORAGE.view,
        "grid"
      );
    }

    DOM.materialList.classList.add(
      selected
    );
  }

  function cycleMaterialView() {
    const views = [
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

    const enabledViews =
      cfg(
        "views",
        {}
      );

    const available =
      views.filter(
        (view) =>
          enabledViews[view] !== false
      );

    if (!available.length) {
      return;
    }

    let index =
      available.indexOf(
        state.materialView
      );

    index =
      index < 0
        ? 0
        : (index + 1) %
          available.length;

    state.materialView =
      available[index];

    storageSet(
      STORAGE.view,
      state.materialView
    );

    applyMaterialView();

    updateMaterialViewButton();
  }

  function updateMaterialViewButton() {
    if (
      !DOM.materialViewButton
    ) {
      return;
    }

    const labels = {
      grid: "▦ Grid",
      list: "☰ List",
      compact: "≡ Compact",
      large: "▣ Large",
      mini: "☷ Mini",
      twoColumn: "▤ 2 Column",
      horizontal: "↔ Horizontal",
      iconList: "◉ Icon List",
      timeline: "⌁ Timeline",
      dense: "▤ Dense"
    };

    DOM.materialViewButton.textContent =
      labels[
        state.materialView
      ] ||
      labels.grid;
  }

  /* =========================================================
     PAGE SYSTEM
     ========================================================= */

  function hideAllPages() {
    const pages = [
      DOM.homePage,
      DOM.materialPage,
      DOM.estimatePage,
      DOM.calculatorPage,
      DOM.settingsPage
    ];

    pages.forEach(
      (page) => {
        if (page) {
          page.hidden = true;
        }
      }
    );
  }

  function showPage(pageName) {
    hideAllPages();

    if (pageName === "home") {
      if (DOM.homePage) {
        DOM.homePage.hidden =
          false;
      }
    }

    if (pageName === "materials") {
      if (DOM.materialPage) {
        DOM.materialPage.hidden =
          false;
      }
    }

    if (pageName === "editor") {
      if (DOM.materialPage) {
        DOM.materialPage.hidden =
          false;
      }
    }

    if (pageName === "estimate") {
      if (DOM.estimatePage) {
        DOM.estimatePage.hidden =
          false;
      }
    }

    if (pageName === "calculator") {
      if (DOM.calculatorPage) {
        DOM.calculatorPage.hidden =
          false;
      }
    }

    if (pageName === "settings") {
      if (DOM.settingsPage) {
        DOM.settingsPage.hidden =
          false;
      }
    }

    updateBottomNavigation();
    updatePageTitle();
  }

  function navigateTo(page) {
    closeMenu();

    if (
      page === "home"
    ) {
      state.currentPage =
        "home";

      state.currentStageId =
        null;

      state.currentItem =
        null;

      state.currentItemIndex =
        -1;

      showPage(
        "home"
      );

      renderHome();
    }

    else if (
      page === "estimate"
    ) {
      state.currentPage =
        "estimate";

      showPage(
        "estimate"
      );

      renderEstimatePage();
    }

    else if (
      page === "calculator"
    ) {
      state.currentPage =
        "calculator";

      showPage(
        "calculator"
      );
    }

    else if (
      page === "settings"
    ) {
      state.currentPage =
        "settings";

      showPage(
        "settings"
      );

      updateSettingsUI();
    }

    scrollPageTop();
  }

  /* =========================================================
     BOTTOM NAVIGATION
     ========================================================= */

  function updateBottomNavigation() {
    if (
      !DOM.bottomNavigation
    ) {
      return;
    }

    if (
      !isEnabled(
        "ui.bottomNavigation",
        true
      )
    ) {
      DOM.bottomNavigation.hidden =
        true;

      return;
    }

    DOM.bottomNavigation.hidden =
      false;

    DOM.bottomNavigation
      .querySelectorAll(
        "[data-page]"
      )
      .forEach(
        (button) => {
          const page =
            button.dataset.page;

          const active =
            (
              page ===
              state.currentPage
            ) ||
            (
              page === "home" &&
              (
                state.currentPage ===
                "materials" ||
                state.currentPage ===
                "editor"
              )
            );

          button.classList.toggle(
            "active",
            active
          );
        }
      );
  }

  /* =========================================================
     SIDE MENU
     ========================================================= */

  function openMenu() {
    if (
      !DOM.sideMenu
    ) {
      return;
    }

    state.menuOpen =
      true;

    DOM.sideMenu.classList.add(
      "open"
    );

    if (DOM.menuOverlay) {
      DOM.menuOverlay.classList.add(
        "open"
      );
    }

    if (DOM.hamburgerButton) {
      DOM.hamburgerButton.classList.add(
        "active"
      );
    }
  }

  function closeMenu() {
    state.menuOpen =
      false;

    if (DOM.sideMenu) {
      DOM.sideMenu.classList.remove(
        "open"
      );
    }

    if (DOM.menuOverlay) {
      DOM.menuOverlay.classList.remove(
        "open"
      );
    }

    if (DOM.hamburgerButton) {
      DOM.hamburgerButton.classList.remove(
        "active"
      );
    }
  }

  function toggleMenu() {
    if (
      state.menuOpen
    ) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* =========================================================
     SETTINGS
     ========================================================= */

  function updateSettingsUI() {
    updateMaterialViewButton();
    applyTheme();
  }

  /* =========================================================
     BACKUP
     ========================================================= */

  function createBackupData() {
    return {
      app:
        "Sandeep ElectroFix - Estimate List",

      version:
        "1.0",

      exportedAt:
        new Date().toISOString(),

      language:
        state.language,

      theme:
        state.theme,

      materialView:
        state.materialView,

      estimateItems:
        state.estimateItems
    };
  }

  function backupEstimate() {
    const data =
      createBackupData();

    const json =
      JSON.stringify(
        data,
        null,
        2
      );

    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href =
      url;

    const date =
      new Date()
        .toISOString()
        .slice(
          0,
          10
        );

    link.download =
      `Sandeep-ElectroFix-Estimate-${date}.json`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url
    );

    showToast(
      getLanguage() === "hi"
        ? "बैकअप डाउनलोड हो गया"
        : "Backup downloaded",
      "success"
    );
  }

  /* =========================================================
     RESET
     ========================================================= */

  function resetApp() {
    const message =
      getLanguage() === "hi"
        ? "क्या आप ऐप का सेव किया हुआ एस्टिमेट और सेटिंग्स रीसेट करना चाहते हैं?"
        : "Reset saved estimate and app settings?";

    if (
      !window.confirm(
        message
      )
    ) {
      return;
    }

    storageRemove(
      STORAGE.estimate
    );

    storageRemove(
      STORAGE.language
    );

    storageRemove(
      STORAGE.view
    );

    storageRemove(
      STORAGE.theme
    );

    state.estimateItems =
      [];

    state.draftValues =
      {};

    state.lastUnit =
      "";

    state.language =
      cfg(
        "language.default",
        "hi"
      );

    state.materialView =
      cfg(
        "views.default",
        "grid"
      );

    state.theme =
      cfg(
        "theme.default",
        "dark"
      );

    updateLanguageUI();
    applyTheme();

    navigateTo(
      "home"
    );

    showToast(
      getLanguage() === "hi"
        ? "ऐप रीसेट हो गया"
        : "App reset completed",
      "success"
    );
  }

  /* =========================================================
     ABOUT
     ========================================================= */

  function showAbout() {
    const businessName =
      cfg(
        "branding.businessName",
        "Sandeep ElectroFix"
      );

    const tagline =
      cfg(
        "branding.tagline",
        "Powering Your Trust"
      );

    const message =
      getLanguage() === "hi"
        ? `${businessName}\n${tagline}\n\nएस्टिमेट लिस्ट ऐप\nElectrical Material & Estimate Management`
        : `${businessName}\n${tagline}\n\nEstimate List App\nElectrical Material & Estimate Management`;

    window.alert(
      message
    );
  }

  /* =========================================================
     TOAST
     ========================================================= */

  function showToast(
    message,
    type = "info"
  ) {
    if (
      !isEnabled(
        "ui.toast",
        true
      ) &&
      !isEnabled(
        "toast.enabled",
        true
      )
    ) {
      return;
    }

    if (!DOM.appToast) {
      return;
    }

    if (DOM.toastMessage) {
      DOM.toastMessage.textContent =
        message;
    }

    if (DOM.toastIcon) {
      const icons = {
        success: "✓",
        warning: "!",
        error: "×",
        info: "i"
      };

      DOM.toastIcon.textContent =
        icons[type] ||
        icons.info;
    }

    DOM.appToast.classList.remove(
      "show",
      "success",
      "warning",
      "error",
      "info"
    );

    DOM.appToast.classList.add(
      type
    );

    requestAnimationFrame(
      () => {
        DOM.appToast.classList.add(
          "show"
        );
      }
    );

    clearTimeout(
      showToast.timer
    );

    showToast.timer =
      setTimeout(
        () => {
          DOM.appToast.classList.remove(
            "show"
          );
        },
        Number(
          cfg(
            "toast.duration",
            2200
          )
        )
      );
  }

  /* =========================================================
     CALCULATOR
     ========================================================= */

  function setupCalculator() {
    setupCalculatorInput(
      DOM.voltageInput,
      DOM.voltageResult,
      "voltage"
    );

    setupCalculatorInput(
      DOM.currentInput,
      DOM.currentResult,
      "current"
    );

    setupCalculatorInput(
      DOM.powerInput,
      DOM.powerResult,
      "power"
    );

    setupCalculatorInput(
      DOM.resistanceInput,
      DOM.resistanceResult,
      "resistance"
    );
  }

  function setupCalculatorInput(
    input,
    result,
    type
  ) {
    if (!input) return;

    input.addEventListener(
      "input",
      () => {
        calculateOhm(
          input,
          result,
          type
        );
      }
    );
  }

  function calculateOhm(
    input,
    result,
    type
  ) {
    if (!result) return;

    const value =
      Number(
        input.value
      );

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      result.textContent =
        "";

      return;
    }

    let text = "";

    if (
      type === "voltage"
    ) {
      text =
        getLanguage() === "hi"
          ? `यदि Current = 1A और Resistance = ${value}Ω, तो Voltage = ${value}V`
          : `If Current = 1A and Resistance = ${value}Ω, Voltage = ${value}V`;
    }

    else if (
      type === "current"
    ) {
      text =
        getLanguage() === "hi"
          ? `यदि Voltage = 230V और Resistance = ${value}Ω, तो Current = ${(230 / value).toFixed(2)}A`
          : `If Voltage = 230V and Resistance = ${value}Ω, Current = ${(230 / value).toFixed(2)}A`;
    }

    else if (
      type === "power"
    ) {
      text =
        getLanguage() === "hi"
          ? `230V पर अनुमानित Current = ${(value / 230).toFixed(2)}A`
          : `Estimated current at 230V = ${(value / 230).toFixed(2)}A`;
    }

    else if (
      type === "resistance"
    ) {
      text =
        getLanguage() === "hi"
          ? `230V पर 1A Current के लिए Resistance = ${value}Ω`
          : `Resistance for 1A current at 230V = ${value}Ω`;
    }

    result.textContent =
      text;
  }

  /* =========================================================
     EVENT LISTENERS
     ========================================================= */

  function setupNavigation() {
    if (
      DOM.hamburgerButton
    ) {
      DOM.hamburgerButton.addEventListener(
        "click",
        toggleMenu
      );
    }

    if (
      DOM.sideMenuClose
    ) {
      DOM.sideMenuClose.addEventListener(
        "click",
        closeMenu
      );
    }

    if (
      DOM.menuOverlay
    ) {
      DOM.menuOverlay.addEventListener(
        "click",
        closeMenu
      );
    }

    if (
      DOM.languageButton
    ) {
      DOM.languageButton.addEventListener(
        "click",
        toggleLanguage
      );
    }

    if (
      DOM.settingsLanguageButton
    ) {
      DOM.settingsLanguageButton.addEventListener(
        "click",
        toggleLanguage
      );
    }

    if (
      DOM.themeToggleButton
    ) {
      DOM.themeToggleButton.addEventListener(
        "click",
        toggleTheme
      );
    }

    if (
      DOM.materialViewButton
    ) {
      DOM.materialViewButton.addEventListener(
        "click",
        cycleMaterialView
      );
    }

    if (
      DOM.backupButton
    ) {
      DOM.backupButton.addEventListener(
        "click",
        backupEstimate
      );
    }

    if (
      DOM.resetButton
    ) {
      DOM.resetButton.addEventListener(
        "click",
        resetApp
      );
    }

    if (
      DOM.aboutButton
    ) {
      DOM.aboutButton.addEventListener(
        "click",
        showAbout
      );
    }

    if (
      DOM.materialBackButton
    ) {
      DOM.materialBackButton.addEventListener(
        "click",
        backFromMaterials
      );
    }

    if (
      DOM.editorBackButton
    ) {
      DOM.editorBackButton.addEventListener(
        "click",
        backFromEditor
      );
    }

    if (
      DOM.itemBackButton
    ) {
      DOM.itemBackButton.addEventListener(
        "click",
        goToPreviousItem
      );
    }

    if (
      DOM.itemNextButton
    ) {
      DOM.itemNextButton.addEventListener(
        "click",
        openNextItem
      );
    }

    if (
      DOM.addToEstimateButton
    ) {
      DOM.addToEstimateButton.addEventListener(
        "click",
        addCurrentToEstimate
      );
    }

    if (
      DOM.bottomNavigation
    ) {
      DOM.bottomNavigation
        .querySelectorAll(
          "[data-page]"
        )
        .forEach(
          (button) => {
            button.addEventListener(
              "click",
              () => {
                navigateTo(
                  button.dataset.page
                );
              }
            );
          }
        );
    }

    if (
      DOM.sideMenuNav
    ) {
      DOM.sideMenuNav
        .querySelectorAll(
          "[data-page]"
        )
        .forEach(
          (button) => {
            button.addEventListener(
              "click",
              () => {
                navigateTo(
                  button.dataset.page
                );
              }
            );
          }
        );
    }
  }

  /* =========================================================
     CONFIG VISIBILITY
     ========================================================= */

  function applyConfigVisibility() {
    const map = [
      [
        "hamburgerButton",
        "ui.hamburger"
      ],
      [
        "languageButton",
        "ui.languageButton"
      ],
      [
        "bottomNavigation",
        "ui.bottomNavigation"
      ],
      [
        "searchContainer",
        "ui.searchBar"
      ],
      [
        "stageCardsContainer",
        "ui.stageCards"
      ]
    ];

    map.forEach(
      ([domKey, path]) => {
        const element =
          DOM[domKey];

        if (!element) {
          return;
        }

        element.hidden =
          !isEnabled(
            path,
            true
          );
      }
    );

    applyEditorVisibility();

    if (
      DOM.settingLanguage
    ) {
      DOM.settingLanguage.hidden =
        !isEnabled(
          "settings.language",
          true
        );
    }

    if (
      DOM.settingTheme
    ) {
      DOM.settingTheme.hidden =
        !isEnabled(
          "settings.theme",
          true
        );
    }

    if (
      DOM.settingMaterialView
    ) {
      DOM.settingMaterialView.hidden =
        !isEnabled(
          "settings.materialView",
          true
        );
    }

    if (
      DOM.settingBackup
    ) {
      DOM.settingBackup.hidden =
        !isEnabled(
          "settings.backup",
          true
        );
    }

    if (
      DOM.settingReset
    ) {
      DOM.settingReset.hidden =
        !isEnabled(
          "settings.reset",
          true
        );
    }

    if (
      DOM.settingAbout
    ) {
      DOM.settingAbout.hidden =
        !isEnabled(
          "settings.about",
          true
        );
    }

    applyBottomNavConfig();
    applyCalculatorConfig();
  }

  function applyBottomNavConfig() {
    if (
      !DOM.bottomNavigation
    ) {
      return;
    }

    const buttons =
      DOM.bottomNavigation
        .querySelectorAll(
          "[data-page]"
        );

    buttons.forEach(
      (button) => {
        const page =
          button.dataset.page;

        let path = "";

        if (
          page === "home"
        ) {
          path =
            "bottomNav.home";
        }

        else if (
          page === "estimate"
        ) {
          path =
            "bottomNav.estimate";
        }

        else if (
          page === "calculator"
        ) {
          path =
            "bottomNav.calculator";
        }

        else if (
          page === "settings"
        ) {
          path =
            "bottomNav.settings";
        }

        if (path) {
          button.hidden =
            !isEnabled(
              path,
              true
            );
        }
      }
    );
  }

  function applyCalculatorConfig() {
    const mappings = [
      [
        DOM.voltageCalculator,
        "calculator.voltage"
      ],
      [
        DOM.currentCalculator,
        "calculator.current"
      ],
      [
        DOM.powerCalculator,
        "calculator.power"
      ],
      [
        DOM.resistanceCalculator,
        "calculator.resistance"
      ],
      [
        DOM.formulaSection,
        "calculator.formulas"
      ],
      [
        DOM.inverterExamples,
        "calculator.inverterExamples"
      ]
    ];

    mappings.forEach(
      ([element, path]) => {
        if (!element) return;

        element.hidden =
          !isEnabled(
            path,
            true
          );
      }
    );
  }

  /* =========================================================
     KEYBOARD BACK BUTTON
     ========================================================= */

  function setupKeyboardBack() {
    window.addEventListener(
      "popstate",
      () => {
        if (
          state.currentPage ===
          "editor"
        ) {
          backFromEditor();
          return;
        }

        if (
          state.currentPage ===
          "materials"
        ) {
          backFromMaterials();
          return;
        }

        if (
          state.currentPage !==
          "home"
        ) {
          navigateTo(
            "home"
          );
        }
      }
    );
  }

  /* =========================================================
     VALIDATE MASTER DATA
     ========================================================= */

  function validateMasterData() {
    const expected =
      Number(
        cfg(
          "materialCount",
          89
        )
      );

    if (
      expected &&
      MATERIALS.length !==
      expected
    ) {
      console.warn(
        `Material count mismatch. Expected ${expected}, got ${MATERIALS.length}.`
      );
    }

    const expectedStages = {
      1: 10,
      2: 7,
      3: 5,
      4: 51,
      5: 16
    };

    Object.keys(
      expectedStages
    ).forEach(
      (stageId) => {
        const count =
          getStageItems(
            stageId
          ).length;

        if (
          count !==
          expectedStages[stageId]
        ) {
          console.warn(
            `Stage ${stageId} count mismatch. Expected ${expectedStages[stageId]}, got ${count}.`
          );
        }
      }
    );
  }

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function initializeApp() {
    cacheDOM();

    validateMasterData();

    applyBranding();

    applyConfigVisibility();

    applyTheme();

    updateLanguageUI();

    setupNavigation();

    setupSearch();

    setupQuantityControls();

    setupPriceControl();

    setupCalculator();

    setupKeyboardBack();

    renderHome();

    renderEstimatePage();

    updateMaterialViewButton();

    showPage(
      "home"
    );

    updateBottomNavigation();

    updateSearchClear();

    /*
     * Force loading screen to disappear.
     * This avoids the previous stuck-loader problem.
     */
    requestAnimationFrame(
      () => {
        setTimeout(
          hideLoadingScreen,
          250
        );
      }
    );
  }

  /* =========================================================
     ERROR SAFETY
     ========================================================= */

  function emergencyHideLoader() {
    try {
      hideLoadingScreen();
    } catch (error) {
      console.error(
        "Loader hide error:",
        error
      );

      const loader =
        document.getElementById(
          "loadingScreen"
        );

      if (loader) {
        loader.style.display =
          "none";
      }
    }
  }

  window.addEventListener(
    "error",
    (event) => {
      console.error(
        "App error:",
        event.error ||
        event.message
      );

      emergencyHideLoader();
    }
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      console.error(
        "Unhandled promise rejection:",
        event.reason
      );

      emergencyHideLoader();
    }
  );

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.EstimateApp = {
    state,

    openStage,

    openMaterialEditor,

    addCurrentToEstimate,

    navigateTo,

    toggleLanguage,

    toggleTheme,

    backupEstimate,

    resetApp,

    renderEstimatePage,

    renderMaterialList,

    showToast,

    getMaterials() {
      return MATERIALS;
    },

    getStages() {
      return STAGES;
    }
  };

  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeApp,
      {
        once: true
      }
    );
  } else {
    initializeApp();
  }

})();
