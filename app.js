/* =========================================================
   Sandeep ElectroFix - Estimate List
   app.js
   ---------------------------------------------------------
   Structure:
   index.html  -> UI
   style.css   -> Design
   config.js   -> UI/config control
   material.js -> Master Material Data
   app.js      -> Logic / Storage / Interaction
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     01. GLOBAL CONFIG / MASTER DATA
     ======================================================= */

  const CONFIG =
    window.AppConfig ||
    window.APP_CONFIG ||
    {};

  const MATERIAL_DATA =
    window.MaterialData ||
    {};

  const MATERIALS = Array.isArray(MATERIAL_DATA.MATERIALS)
    ? MATERIAL_DATA.MATERIALS
    : Array.isArray(window.MATERIALS)
      ? window.MATERIALS
      : [];

  const STAGES = Array.isArray(MATERIAL_DATA.MATERIAL_STAGES)
    ? MATERIAL_DATA.MATERIAL_STAGES
    : Array.isArray(window.MATERIAL_STAGES)
      ? window.MATERIAL_STAGES
      : [];

  const UI_TEXT =
    MATERIAL_DATA.UI_TEXT ||
    window.UI_TEXT ||
    {};

  const APP_VERSION = "1.0.0";


  /* =======================================================
     02. STORAGE
     ======================================================= */

  const STORAGE = {
    estimate:
      CONFIG?.storage?.estimateItems ||
      "sandeepEstimateItems",

    language:
      CONFIG?.storage?.materialLanguage ||
      "sandeepMaterialLang",

    view:
      CONFIG?.storage?.materialView ||
      "sandeepMaterialView",

    theme:
      CONFIG?.storage?.theme ||
      "sandeepTheme"
  };


  /* =======================================================
     03. STATE
     ======================================================= */

  const state = {
    language:
      localStorage.getItem(STORAGE.language) ||
      CONFIG?.language?.default ||
      "hi",

    theme:
      localStorage.getItem(STORAGE.theme) ||
      CONFIG?.theme?.default ||
      "dark",

    materialView:
      localStorage.getItem(STORAGE.view) ||
      CONFIG?.views?.default ||
      "grid",

    currentPage: "home",

    currentStageId: null,

    currentItemIndex: 0,

    currentItem: null,

    estimateItems: loadEstimateItems(),

    /*
      Drafts are kept per MATERIAL ID so Back/Next can
      preserve entered values.

      Editing an already-added estimate item uses a
      separate temporary object.
    */
    draftValues: {},

    editingEstimateId: null,

    lastUnit: "",

    searchText: "",

    menuOpen: false
  };


  /* =======================================================
     04. DOM CACHE
     ======================================================= */

  const $ = (id) => document.getElementById(id);

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


  /* =======================================================
     05. SAFE STORAGE
     ======================================================= */

  function loadEstimateItems() {
    try {
      const raw = localStorage.getItem(STORAGE.estimate);

      if (!raw) return [];

      const parsed = JSON.parse(raw);

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
        JSON.stringify(state.estimateItems)
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


  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  }


  /* =======================================================
     06. LANGUAGE
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


  function getObjectText(obj, fallback = "") {
    if (!obj) return fallback;

    if (
      typeof obj === "string" ||
      typeof obj === "number"
    ) {
      return String(obj);
    }

    if (currentLanguage() === "hi") {
      return (
        obj.hi ??
        obj.en ??
        obj.name ??
        obj.label ??
        fallback
      );
    }

    return (
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
      state.language === "hi"
        ? "hi"
        : "en";

    if (
      typeof window.setMaterialLanguage === "function"
    ) {
      try {
        window.setMaterialLanguage(
          state.language
        );
      } catch (error) {
        console.warn(
          "Material language sync:",
          error
        );
      }
    }

    renderAll();
  }


  function toggleLanguage() {
    setLanguage(
      state.language === "hi"
        ? "en"
        : "hi"
    );
  }


  /* =======================================================
     07. THEME
     ======================================================= */

  function applyTheme() {
    document.documentElement.dataset.theme =
      state.theme;

    document.body.classList.toggle(
      "light-theme",
      state.theme === "light"
    );

    saveSetting(
      STORAGE.theme,
      state.theme
    );

    if (DOM.themeToggleButton) {
      DOM.themeToggleButton.textContent =
        state.theme === "dark"
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
    if (
      CONFIG?.theme &&
      CONFIG.theme.allowToggle === false
    ) {
      return;
    }

    state.theme =
      state.theme === "dark"
        ? "light"
        : "dark";

    applyTheme();
  }


  /* =======================================================
     08. BRANDING
     ======================================================= */

  function applyBranding() {
    const branding =
      CONFIG?.branding || {};

    const businessName =
      branding.businessName ||
      CONFIG?.ui?.businessName ||
      "Sandeep ElectroFix";

    const tagline =
      branding.tagline ||
      CONFIG?.ui?.tagline ||
      "Powering Your Trust";

    const logo =
      branding.logo ||
      CONFIG?.ui?.logo ||
      "logo.png";

    if (DOM.loadingLogo) {
      DOM.loadingLogo.src = logo;
    }

    if (DOM.heroLogo) {
      DOM.heroLogo.src = logo;
    }

    if (DOM.loadingBusinessName) {
      DOM.loadingBusinessName.textContent =
        businessName;
    }

    if (DOM.businessName) {
      DOM.businessName.textContent =
        businessName;
    }

    if (DOM.loadingTagline) {
      DOM.loadingTagline.textContent =
        tagline;
    }

    if (DOM.businessTagline) {
      DOM.businessTagline.textContent =
        tagline;
    }

    if (DOM.topBarTitle) {
      DOM.topBarTitle.textContent =
        text(
          "Estimate List",
          "एस्टिमेट लिस्ट"
        );
    }
  }


  /* =======================================================
     09. CONFIG HELPERS
     ======================================================= */

  function configEnabled(path, fallback = true) {
    const parts = String(path)
      .split(".")
      .filter(Boolean);

    let value = CONFIG;

    for (const part of parts) {
      if (
        value === null ||
        value === undefined ||
        !Object.prototype.hasOwnProperty.call(
          value,
          part
        )
      ) {
        return fallback;
      }

      value = value[part];
    }

    return value !== false;
  }


  function setVisible(element, visible) {
    if (!element) return;

    element.hidden = !visible;

    element.classList.toggle(
      "config-hidden",
      !visible
    );
  }


  function applyConfigVisibility() {
    const ui = CONFIG?.ui || {};
    const home = CONFIG?.home || {};
    const materials = CONFIG?.materials || {};
    const navigation = CONFIG?.navigation || {};
    const bottomNav = CONFIG?.bottomNav || {};
    const calculator = CONFIG?.calculator || {};
    const settings = CONFIG?.settings || {};

    setVisible(
      DOM.hamburgerButton,
      ui.hamburger !== false
    );

    setVisible(
      DOM.languageButton,
      ui.languageButton !== false &&
      CONFIG?.language?.enabled !== false
    );

    setVisible(
      DOM.homeHero,
      home.enabled !== false &&
      home.showHero !== false
    );

    setVisible(
      DOM.stageCardsContainer,
      home.enabled !== false &&
      home.showStageCards !== false
    );

    setVisible(
      DOM.searchContainer,
      home.enabled !== false &&
      home.showSearch !== false &&
      CONFIG?.search?.enabled !== false
    );

    setVisible(
      DOM.materialBackButton,
      ui.backButton !== false
    );

    setVisible(
      DOM.itemBackButton,
      ui.backButton !== false
    );

    setVisible(
      DOM.itemNextButton,
      ui.nextButton !== false
    );

    setVisible(
      DOM.addToEstimateButton,
      ui.addToEstimateButton !== false
    );

    setVisible(
      DOM.bottomNavigation,
      bottomNav.enabled !== false &&
      ui.bottomNavigation !== false
    );

    setVisible(
      DOM.calculatorPage,
      calculator.enabled !== false
    );

    setVisible(
      DOM.settingsPage,
      settings.enabled !== false
    );

    setVisible(
      DOM.priceField,
      materials.showPrice === true &&
      CONFIG?.price?.enabled !== false
    );

    if (
      navigation.autoNextAfterAdd === false
    ) {
      // No visual change required.
    }
  }


  /* =======================================================
     10. MATERIAL HELPERS
     ======================================================= */

  function getMaterialFields(material) {
    if (!material) return [];

    if (Array.isArray(material.fields)) {
      return material.fields.slice();
    }

    if (
      typeof MATERIAL_DATA.getSelectableFields ===
      "function"
    ) {
      try {
        return (
          MATERIAL_DATA
            .getSelectableFields(material) || []
        ).slice();
      } catch (error) {
        console.warn(error);
      }
    }

    return [];
  }


  /*
    IMPORTANT:
    material.js already has the correct field order.
    Do NOT reorder it here.
  */
  function sortFields(fields) {
    return Array.isArray(fields)
      ? fields.slice()
      : [];
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
      .replace(/[\s_-]/g, "");
  }


  function isSystemField(field) {
    const key =
      normalizedFieldKey(field);

    return [
      "quantity",
      "qty",
      "unit",
      "brand",
      "price"
    ].includes(key);
  }


  function fieldLabel(field) {
    if (!field) return "";

    if (
      typeof MATERIAL_DATA.getFieldLabel ===
      "function"
    ) {
      try {
        const result =
          MATERIAL_DATA.getFieldLabel(field);

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
      typeof options === "function"
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
    if (!id) return null;

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
          String(stage.id) ===
          String(id)
      ) || null
    );
  }


  function materialName(material) {
    if (!material) return "";

    return getObjectText(
      material.name ||
      material.title,
      ""
    );
  }


  function materialEnglishName(material) {
    if (!material) return "";

    return (
      material.name?.en ??
      material.title?.en ??
      material.en ??
      material.name ??
      ""
    );
  }


  function materialHindiName(material) {
    if (!material) return "";

    return (
      material.name?.hi ??
      material.title?.hi ??
      material.hi ??
      materialEnglishName(material)
    );
  }


  function stageEnglishName(stage) {
    if (!stage) return "";

    return (
      stage.en ??
      stage.name?.en ??
      stage.title?.en ??
      stage.name ??
      ""
    );
  }


  function stageHindiName(stage) {
    if (!stage) return "";

    return (
      stage.hi ??
      stage.name?.hi ??
      stage.title?.hi ??
      stageEnglishName(stage)
    );
  }


  /* =======================================================
     11. DRAFT VALUES
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


  function getDraftValue(material, key) {
    const draft =
      getDraft(material);

    return draft[key] ?? "";
  }


  function setDraftValue(
    material,
    key,
    value
  ) {
    const draft =
      getDraft(material);

    draft[key] = value;
  }


  function clearDraft(material) {
    if (!material) return;

    delete state.draftValues[
      getDraftKey(material)
    ];
  }


  /* =======================================================
     12. HOME
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

    let visibleMaterials =
      MATERIALS;

    if (search) {
      visibleMaterials =
        MATERIALS.filter(
          material =>
            searchMatchesMaterial(
              material,
              search
            )
        );
    }

    const visibleStageIds =
      new Set(
        visibleMaterials.map(
          material =>
            String(material.stage)
        )
      );

    DOM.stageCardsContainer.innerHTML = "";

    const stages =
      Array.isArray(STAGES)
        ? STAGES
        : [];

    stages.forEach(
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
      DOM.stageCardsContainer.children.length === 0
    ) {
      const empty =
        document.createElement("div");

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
  }


  function createStageCard(
    stage,
    index
  ) {
    const card =
      document.createElement("button");

    card.type = "button";

    card.className =
      "stage-card";

    card.dataset.stage =
      String(
        stage.id ??
        stage.stage ??
        index + 1
      );

    if (
      CONFIG?.stageCards?.rotation !== false
    ) {
      card.style.setProperty(
        "--rotation-time",
        `${
          Number(
            CONFIG?.stageCards?.rotationTime ||
            5000
          ) / 1000
        }s`
      );
    }

    const inner =
      document.createElement("div");

    inner.className =
      "stage-card-inner";

    if (
      CONFIG?.stageCards?.showNumber !== false
    ) {
      const number =
        document.createElement("div");

      number.className =
        "stage-number";

      number.textContent =
        stage.no ??
        `STAGE ${String(
          index + 1
        ).padStart(2, "0")}`;

      inner.appendChild(number);
    }

    if (
      CONFIG?.stageCards?.showIcon !== false &&
      stage.icon
    ) {
      const icon =
        document.createElement("div");

      icon.className =
        "stage-icon";

      icon.textContent =
        stage.icon;

      inner.appendChild(icon);
    }

    if (
      CONFIG?.stageCards?.showEnglish !== false
    ) {
      const en =
        document.createElement("div");

      en.className =
        "stage-title";

      en.textContent =
        stageEnglishName(stage);

      inner.appendChild(en);
    }

    if (
      CONFIG?.stageCards?.showHindi !== false
    ) {
      const hi =
        document.createElement("div");

      hi.className =
        "stage-title-hi";

      hi.textContent =
        stageHindiName(stage);

      inner.appendChild(hi);
    }

    if (
      CONFIG?.stageCards?.showDescription !== false &&
      stage.description
    ) {
      const description =
        document.createElement("div");

      description.className =
        "stage-description";

      description.textContent =
        getObjectText(
          stage.description,
          ""
        );

      inner.appendChild(
        description
      );
    }

    card.appendChild(inner);

    card.addEventListener(
      "click",
      () => {
        openStage(stage.id);
      }
    );

    return card;
  }


  /* =======================================================
     13. SEARCH
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

    const fields =
      getMaterialFields(material);

    fields.forEach(field => {
      parts.push(
        fieldKey(field)
      );

      parts.push(
        fieldLabel(field)
      );

      fieldOptions(field).forEach(
        option => {
          parts.push(option.value);
          parts.push(option.en);
          parts.push(option.hi);
        }
      );
    });

    if (Array.isArray(material.brands)) {
      material.brands.forEach(
        brand => {
          const option =
            normalizeOption(brand);

          parts.push(option.value);
          parts.push(option.en);
          parts.push(option.hi);
        }
      );
    }

    if (Array.isArray(material.units)) {
      material.units.forEach(
        unit => {
          const option =
            normalizeOption(unit);

          parts.push(option.value);
          parts.push(option.en);
          parts.push(option.hi);
        }
      );
    }

    const haystack =
      parts
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return haystack.includes(
      query
    );
  }


  function handleSearch(event) {
    state.searchText =
      event.target.value || "";

    if (DOM.searchClearButton) {
      DOM.searchClearButton.hidden =
        !state.searchText;
    }

    if (
      state.currentPage === "home"
    ) {
      renderHome();
    }
  }


  function clearSearch() {
    state.searchText = "";

    if (DOM.materialSearch) {
      DOM.materialSearch.value = "";
    }

    if (DOM.searchClearButton) {
      DOM.searchClearButton.hidden =
        true;
    }

    renderHome();
  }


  /* =======================================================
     14. STAGE / MATERIAL LIST
     ======================================================= */

  function openStage(stageId) {
    const stage =
      getStageById(stageId);

    if (!stage) return;

    state.currentStageId =
      stageId;

    state.currentItemIndex = 0;

    state.currentItem = null;

    state.editingEstimateId = null;

    showPage("materials");

    renderMaterialPage();

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }


  function getStageMaterials(stageId) {
    return MATERIALS.filter(
      material =>
        String(material.stage) ===
        String(stageId)
    );
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
      DOM.materialList.innerHTML = "";

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
    }

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden = true;
    }

    if (DOM.materialList) {
      DOM.materialList.hidden = false;
    }
  }


  function createMaterialCard(
    material,
    index
  ) {
    const card =
      document.createElement("button");

    card.type = "button";

    card.className =
      "material-card";

    card.dataset.materialId =
      material.id || "";

    if (
      CONFIG?.materials?.showImages !== false &&
      material.image
    ) {
      const imageWrap =
        document.createElement("div");

      imageWrap.className =
        "material-card-image";

      const img =
        document.createElement("img");

      img.src =
        material.image;

      img.alt =
        materialEnglishName(material);

      imageWrap.appendChild(img);

      card.appendChild(
        imageWrap
      );
    }

    const content =
      document.createElement("div");

    content.className =
      "material-card-content";

    if (
      CONFIG?.materials?.showItemNumber !== false
    ) {
      const no =
        document.createElement("div");

      no.className =
        "material-item-number";

      no.textContent =
        material.no ??
        index + 1;

      content.appendChild(no);
    }

    if (
      CONFIG?.materials?.showItemName !== false
    ) {
      const en =
        document.createElement("div");

      en.className =
        "material-name";

      en.textContent =
        materialEnglishName(material);

      content.appendChild(en);

      const hi =
        document.createElement("div");

      hi.className =
        "material-name-hi";

      hi.textContent =
        materialHindiName(material);

      content.appendChild(hi);
    }

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
     15. OPEN MATERIAL
     ======================================================= */

  function openMaterial(
    materialId,
    options = {}
  ) {
    const material =
      getMaterialById(materialId);

    if (!material) return;

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
      options.fromEdit &&
      options.estimateItem
    ) {
      loadEstimateItemIntoDraft(
        material,
        options.estimateItem
      );
    }

    showPage("materials");

    if (DOM.materialList) {
      DOM.materialList.hidden = true;
    }

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden = false;
    }

    renderMaterialEditor(
      material
    );

    scrollEditorToTop();
  }


  /* =======================================================
     16. MATERIAL EDITOR
     ======================================================= */

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
  }


  function renderMaterialImage(
    material
  ) {
    if (!DOM.editorImageContainer) {
      return;
    }

    const showImages =
      CONFIG?.materials?.showImages !== false;

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
     17. DYNAMIC FIELDS
     ======================================================= */

  function renderDynamicFields(
    material
  ) {
    if (!DOM.materialFields) {
      return;
    }

    DOM.materialFields.innerHTML = "";

    let fields =
      getMaterialFields(material);

    /*
      Quantity / Unit / Brand / Price are rendered
      separately. Therefore never render them here.
    */
    fields =
      fields.filter(
        field =>
          !isSystemField(field)
      );

    fields =
      sortFields(fields);

    fields.forEach(
      field => {
        if (
          !shouldShowField(field)
        ) {
          return;
        }

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
      }
    );
  }


  function shouldShowField(field) {
    const key =
      normalizedFieldKey(field);

    if (
      key === "size" &&
      CONFIG?.materials?.showSize === false
    ) {
      return false;
    }

    if (
      key === "type" &&
      CONFIG?.materials?.showType === false
    ) {
      return false;
    }

    if (
      key === "subtype" &&
      CONFIG?.materials?.showSubType === false
    ) {
      return false;
    }

    if (
      (key === "colour" ||
       key === "color") &&
      CONFIG?.materials?.showColour === false
    ) {
      return false;
    }

    if (
      key === "material" &&
      CONFIG?.materials?.showMaterial === false
    ) {
      return false;
    }

    return true;
  }


  function createDynamicField(
    material,
    field
  ) {
    const wrapper =
      document.createElement("div");

    wrapper.className =
      "option-field";

    wrapper.dataset.field =
      fieldKey(field);

    const label =
      document.createElement("label");

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
        document.createElement("div");

      optionWrap.className =
        "option-buttons";

      options.forEach(
        option => {
          const button =
            document.createElement(
              "button"
            );

          button.type = "button";

          button.className =
            "option-button";

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
                .forEach(
                  btn =>
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
        }
      );

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

    return wrapper;
  }


  /* =======================================================
     18. QUANTITY
     ======================================================= */

  function renderQuantityField(
    material
  ) {
    if (!DOM.quantityField) {
      return;
    }

    const enabled =
      CONFIG?.quantity?.enabled !== false &&
      CONFIG?.materials?.showQuantity !== false;

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
          CONFIG?.quantity?.min || 1
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

    if (!Number.isFinite(number)) {
      return "";
    }

    const min =
      Number(
        CONFIG?.quantity?.min || 1
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

    if (!Number.isFinite(value)) {
      value = 0;
    }

    value += delta;

    const min =
      Number(
        CONFIG?.quantity?.min || 1
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

    setDraftValue(
      material,
      "quantity",
      String(value)
    );

    if (DOM.quantityInput) {
      DOM.quantityInput.value =
        String(value);
    }
  }


  /* =======================================================
     19. UNIT
     ======================================================= */

  function getUnits(material) {
    if (!material) return [];

    let units =
      material.units ||
      [];

    if (!Array.isArray(units)) {
      units = [];
    }

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
      CONFIG?.materials?.showUnit !== false;

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
      Carry forward only when current unit
      is valid for this material.
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

    DOM.unitSelect.innerHTML = "";

    const blank =
      document.createElement("option");

    blank.value = "";

    blank.textContent =
      text(
        "Select Unit",
        "यूनिट चुनें"
      );

    DOM.unitSelect.appendChild(
      blank
    );

    units.forEach(
      unit => {
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
      }
    );

    DOM.unitSelect.value =
      current;
  }


  /* =======================================================
     20. BRAND
     ======================================================= */

  function getBrands(material) {
    if (!material) return [];

    let brands =
      material.brands ||
      [];

    if (!Array.isArray(brands)) {
      brands = [];
    }

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
      CONFIG?.brand?.enabled !== false &&
      CONFIG?.materials?.showBrand !== false;

    DOM.brandField.hidden =
      !enabled;

    if (!enabled) return;

    const brands =
      getBrands(material);

    const draft =
      getDraft(material);

    const current =
      draft.brand ?? "";

    DOM.brandSelect.innerHTML = "";

    const blank =
      document.createElement("option");

    blank.value = "";

    blank.textContent =
      text(
        "No Brand / Optional",
        "ब्रांड नहीं / वैकल्पिक"
      );

    DOM.brandSelect.appendChild(
      blank
    );

    brands.forEach(
      brand => {
        /*
          Explicitly ignore Skip Brand.
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
      }
    );

    DOM.brandSelect.value =
      current;
  }


  /* =======================================================
     21. PRICE
     ======================================================= */

  function renderPriceField(
    material
  ) {
    if (!DOM.priceField) {
      return;
    }

    const priceConfig =
      CONFIG?.price || {};

    const materialConfig =
      CONFIG?.materials || {};

    const enabled =
      priceConfig.enabled !== false;

    const visible =
      enabled &&
      priceConfig.visible === true &&
      materialConfig.showPrice === true;

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
     22. SAVE FIELD INPUTS
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

    if (DOM.materialFields) {
      DOM.materialFields
        .querySelectorAll(
          "input, select"
        )
        .forEach(
          input => {
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
          }
        );
    }
  }


  /* =======================================================
     23. VALIDATE MATERIAL
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
      CONFIG?.quantity?.required !== false
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

    if (
      quantity !== ""
    ) {
      draft.quantity =
        quantity;
    }

    return {
      valid: true,
      draft
    };
  }


  /* =======================================================
     24. CREATE ESTIMATE ITEM
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
      .forEach(
        field => {
          const key =
            fieldKey(field);

          const value =
            draft[key];

          if (
            value !== undefined &&
            value !== ""
          ) {
            selections[key] = value;
          }
        }
      );

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
     25. ADD TO ESTIMATE
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

    /*
      Remember unit for next item,
      but only as carry-forward candidate.
    */
    if (draft.unit) {
      state.lastUnit =
        draft.unit;
    }

    /*
      EDIT EXISTING ESTIMATE ITEM
    */
    if (state.editingEstimateId) {
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
      NORMAL NEW ESTIMATE ITEM
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
      Do not clear the draft immediately.
      This allows Back to preserve the entered
      selections as requested.

      When opening the next item, it gets its
      own draft.
    */

    const autoNext =
      CONFIG?.navigation
        ?.autoNextAfterAdd !== false;

    if (autoNext) {
      openNextItem(
        true
      );
    } else {
      updateNavigationButtons();
    }
  }


  /* =======================================================
     26. NEXT / BACK
     ======================================================= */

  function getCurrentStageMaterials() {
    return getStageMaterials(
      state.currentStageId
    );
  }


  function openNextItem(
    fromAdd = false
  ) {
    const materials =
      getCurrentStageMaterials();

    if (!materials.length) {
      return;
    }

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

    renderMaterialEditor(
      state.currentItem
    );

    if (
      CONFIG?.navigation
        ?.scrollNextToTop !== false
    ) {
      scrollEditorToTop();
    }
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

    if (
      previousIndex < 0
    ) {
      closeMaterialEditor();

      return;
    }

    state.currentItemIndex =
      previousIndex;

    state.currentItem =
      materials[previousIndex];

    state.editingEstimateId =
      null;

    renderMaterialEditor(
      state.currentItem
    );

    if (
      CONFIG?.navigation
        ?.restorePreviousItemTop !== false
    ) {
      scrollEditorToTop();
    }
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
    requestAnimationFrame(
      () => {
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
      }
    );
  }


  function closeMaterialEditor() {
    state.currentItem =
      null;

    state.editingEstimateId =
      null;

    if (DOM.materialEditor) {
      DOM.materialEditor.hidden =
        true;
    }

    if (DOM.materialList) {
      DOM.materialList.hidden =
        false;
    }
  }


  /* =======================================================
     27. ESTIMATE ITEM EDITING
     ======================================================= */

  function loadEstimateItemIntoDraft(
    material,
    estimateItem
  ) {
    if (!material || !estimateItem) {
      return;
    }

    const draft = {};

    Object.assign(
      draft,
      estimateItem.selections || {}
    );

    draft.quantity =
      estimateItem.quantity ?? "";

    draft.unit =
      estimateItem.unit ?? "";

    draft.brand =
      estimateItem.brand ?? "";

    draft.price =
      estimateItem.price ?? "";

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

    /*
      Estimate-specific edit state.
      We load only this item's values into
      the temporary draft.
    */
    state.editingEstimateId =
      estimateItem.id;

    loadEstimateItemIntoDraft(
      material,
      estimateItem
    );

    openMaterial(
      material.id,
      {
        fromEdit: true,
        estimateItem
      }
    );
  }


  function deleteEstimateItem(
    id
  ) {
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
        "एस्टिमेट आइटम हटा दिया गया।"
      )
    );
  }


  /* =======================================================
     28. ESTIMATE PAGE
     ======================================================= */

  function showEstimate() {
    showPage("estimate");

    renderEstimate();
  }


  function renderEstimate() {
    if (!DOM.estimateItems) {
      return;
    }

    DOM.estimateItems.innerHTML = "";

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

    items.forEach(
      item => {
        DOM.estimateItems.appendChild(
          createEstimateCard(
            item
          )
        );
      }
    );
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

    card.dataset.id =
      item.id;

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
      const fields =
        getMaterialFields(
          material
        ).filter(
          field =>
            !isSystemField(field)
        );

      fields.forEach(
        field => {
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
        }
      );
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

    /*
      Price is only shown when:
      - configured visible
      - value actually exists
    */
    if (
      item.price !== "" &&
      CONFIG?.price?.enabled !== false &&
      CONFIG?.price?.visible === true &&
      CONFIG?.materials?.showPrice === true
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

    return currentLanguage() === "hi"
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

    return currentLanguage() === "hi"
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

    return currentLanguage() === "hi"
      ? brand.hi
      : brand.en;
  }


  /* =======================================================
     29. MATERIAL VIEW MODES
     ======================================================= */

  function applyMaterialView() {
    const list =
      DOM.materialList;

    if (!list) return;

    const validViews = [
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

    let view =
      state.materialView;

    if (
      !validViews.includes(view)
    ) {
      view = "grid";
    }

    validViews.forEach(
      mode => {
        list.classList.remove(
          `view-${mode}`
        );
      }
    );

    list.classList.add(
      `view-${view}`
    );
  }


  function setMaterialView(view) {
    const allowed =
      [
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

    if (
      !allowed.includes(view)
    ) {
      return;
    }

    state.materialView =
      view;

    saveSetting(
      STORAGE.view,
      view
    );

    applyMaterialView();

    if (DOM.materialViewButton) {
      DOM.materialViewButton.textContent =
        view;
    }
  }


  function cycleMaterialView() {
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

    const available =
      views.filter(
        view =>
          CONFIG?.views?.[view] !== false
      );

    if (!available.length) {
      return;
    }

    const index =
      available.indexOf(
        state.materialView
      );

    const next =
      available[
        (index + 1) %
        available.length
      ];

    setMaterialView(
      next
    );
  }


  /* =======================================================
     30. PAGE NAVIGATION
     ======================================================= */

  function showPage(
    page,
    pushHistory = true
  ) {
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

    updateTopBarTitle();

    updateBottomNavigation(
      page
    );

    if (pushHistory) {
      pushNavigationState(
        page
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    if (page === "home") {
      renderHome();
    }

    if (page === "estimate") {
      renderEstimate();
    }

    if (page === "settings") {
      renderSettings();
    }
  }


  function updateTopBarTitle() {
    if (!DOM.topBarTitle) {
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

    DOM.topBarTitle.textContent =
      titles[state.currentPage] ||
      titles.home;
  }


  function pushNavigationState(
    page
  ) {
    if (!window.history) return;

    const current =
      window.history.state;

    if (
      current &&
      current.sandeepApp === true &&
      current.page === page
    ) {
      return;
    }

    try {
      window.history.pushState(
        {
          sandeepApp: true,
          page
        },
        "",
        `#${page}`
      );
    } catch (_) {}
  }


  function handlePopState(event) {
    const page =
      event.state?.sandeepApp
        ? event.state.page
        : "home";

    if (
      state.menuOpen
    ) {
      closeSideMenu();

      return;
    }

    showPage(
      page,
      false
    );
  }


  /* =======================================================
     31. BOTTOM NAVIGATION
     ======================================================= */

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
      .forEach(
        button => {
          button.classList.toggle(
            "active",
            button.dataset.page ===
            page
          );
        }
      );
  }


  /* =======================================================
     32. SIDE MENU
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
      "active"
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
      "active"
    );
  }


  function toggleSideMenu() {
    if (state.menuOpen) {
      closeSideMenu();
    } else {
      openSideMenu();
    }
  }


  /* =======================================================
     33. SETTINGS
     ======================================================= */

  function renderSettings() {
    applyTheme();

    if (DOM.settingsLanguageButton) {
      DOM.settingsLanguageButton.textContent =
        state.language === "hi"
          ? "हिन्दी"
          : "English";
    }

    if (DOM.materialViewButton) {
      DOM.materialViewButton.textContent =
        state.materialView;
    }
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
     34. CALCULATOR
     ======================================================= */

  function calculateVoltage() {
    const current =
      Number(
        DOM.voltageInput?.value
      );

    const resistance =
      Number(
        DOM.voltageCalculator
          ?.querySelector(
            "[data-resistance]"
          )?.value
      );

    /*
      Keep original simple UI compatible:
      if only current is present, assume 230V
      style helper rather than breaking the page.
    */
    let result = "";

    if (
      Number.isFinite(current) &&
      current > 0
    ) {
      result =
        `${current} A`;
    }

    if (DOM.voltageResult) {
      DOM.voltageResult.textContent =
        result ||
        text(
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

    if (
      DOM.currentResult
    ) {
      DOM.currentResult.textContent =
        Number.isFinite(value) &&
        value > 0
          ? `${value} A`
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

    if (
      DOM.powerResult
    ) {
      DOM.powerResult.textContent =
        Number.isFinite(current) &&
        current >= 0
          ? `${(
              230 *
              current
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

    if (
      DOM.resistanceResult
    ) {
      DOM.resistanceResult.textContent =
        Number.isFinite(current) &&
        current > 0
          ? `${(
              230 /
              current
            ).toFixed(2)} Ω`
          : text(
              "Enter current",
              "करंट भरें"
            );
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
     35. TOAST
     ======================================================= */

  let toastTimer = null;

  function showToast(
    type,
    message
  ) {
    if (!DOM.appToast) {
      return;
    }

    if (
      CONFIG?.toast?.enabled === false
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
     36. EVENT BINDING
     ======================================================= */

  function bindEvents() {

    /* Hamburger */
    DOM.hamburgerButton?.addEventListener(
      "click",
      toggleSideMenu
    );

    DOM.sideMenuClose?.addEventListener(
      "click",
      closeSideMenu
    );

    DOM.menuOverlay?.addEventListener(
      "click",
      closeSideMenu
    );


    /* Language */
    DOM.languageButton?.addEventListener(
      "click",
      toggleLanguage
    );

    DOM.settingsLanguageButton?.addEventListener(
      "click",
      toggleLanguage
    );


    /* Search */
    DOM.materialSearch?.addEventListener(
      "input",
      handleSearch
    );

    DOM.searchClearButton?.addEventListener(
      "click",
      clearSearch
    );


    /* Material header Back */
    DOM.materialBackButton?.addEventListener(
      "click",
      () => {
        if (
          DOM.materialEditor &&
          !DOM.materialEditor.hidden
        ) {
          closeMaterialEditor();

          if (DOM.materialList) {
            DOM.materialList.hidden =
              false;
          }

          return;
        }

        showPage(
          "home"
        );
      }
    );


    /* Editor Back */
    DOM.editorBackButton?.addEventListener(
      "click",
      () => {
        closeMaterialEditor();

        if (DOM.materialList) {
          DOM.materialList.hidden =
            false;
        }

        window.scrollTo({
          top: 0,
          behavior: "auto"
        });
      }
    );


    /* Item Back */
    DOM.itemBackButton?.addEventListener(
      "click",
      openPreviousItem
    );


    /* Item Next */
    DOM.itemNextButton?.addEventListener(
      "click",
      () => {
        /*
          IMPORTANT:
          Next does NOT add/save current item.
        */
        openNextItem(
          false
        );
      }
    );


    /* Add */
    DOM.addToEstimateButton?.addEventListener(
      "click",
      addCurrentToEstimate
    );


    /* Quantity */
    DOM.quantityMinus?.addEventListener(
      "click",
      () => {
        changeQuantity(
          -1
        );
      }
    );

    DOM.quantityPlus?.addEventListener(
      "click",
      () => {
        changeQuantity(
          1
        );
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

        /*
          Allow empty temporarily while typing.
        */
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


    /* Unit */
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


    /* Brand */
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


    /* Price */
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


    /* Bottom nav */
    DOM.bottomNavigation
      ?.querySelectorAll(
        "[data-page]"
      )
      .forEach(
        button => {
          button.addEventListener(
            "click",
            () => {
              showPage(
                button.dataset.page
              );
            }
          );
        }
      );


    /* Side menu nav */
    DOM.sideMenuNav
      ?.querySelectorAll(
        "[data-page]"
      )
      .forEach(
        button => {
          button.addEventListener(
            "click",
            () => {
              closeSideMenu();

              showPage(
                button.dataset.page
              );
            }
          );
        }
      );


    /* Theme */
    DOM.themeToggleButton?.addEventListener(
      "click",
      toggleTheme
    );


    /* Material view */
    DOM.materialViewButton?.addEventListener(
      "click",
      cycleMaterialView
    );


    /* Backup */
    DOM.backupButton?.addEventListener(
      "click",
      backupEstimate
    );


    /* Reset */
    DOM.resetButton?.addEventListener(
      "click",
      resetEstimate
    );


    /* About */
    DOM.aboutButton?.addEventListener(
      "click",
      showAbout
    );


    /* Browser / Android Back */
    window.addEventListener(
      "popstate",
      handlePopState
    );
  }


  /* =======================================================
     37. INITIAL PAGE
     ======================================================= */

  function getInitialPage() {
    const hash =
      String(
        window.location.hash || ""
      ).replace(
        "#",
        ""
      );

    const allowed = [
      "home",
      "materials",
      "estimate",
      "calculator",
      "settings"
    ];

    return allowed.includes(hash)
      ? hash
      : "home";
  }


  /* =======================================================
     38. MASTER DATA VALIDATION
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
            material.id
          )
        ) {
          console.error(
            "Duplicate material ID:",
            material.id
          );
        }

        if (material.id) {
          ids.add(
            material.id
          );
        }
      }
    );

    /*
      Expected current master:
      10 + 7 + 5 + 51 + 16 = 89
    */
    const expectedCounts = {
      1: 10,
      2: 7,
      3: 5,
      4: 51,
      5: 16
    };

    Object.entries(
      expectedCounts
    ).forEach(
      ([stage, expected]) => {
        const actual =
          MATERIALS.filter(
            material =>
              String(
                material.stage
              ) === stage
          ).length;

        if (
          actual !== expected
        ) {
          console.warn(
            `Stage ${stage}: expected ${expected}, found ${actual}`
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
     39. INITIAL UI
     ======================================================= */

  function initializeUI() {
    applyBranding();

    applyTheme();

    applyConfigVisibility();

    applyMaterialView();

    renderHome();

    renderSettings();

    bindCalculatorInputs();

    updateTopBarTitle();

    updateBottomNavigation(
      "home"
    );

    /*
      Replace current history entry so Android/browser
      back has a known app state.
    */
    try {
      window.history.replaceState(
        {
          sandeepApp: true,
          page: getInitialPage()
        },
        "",
        `#${getInitialPage()}`
      );
    } catch (_) {}

    const initialPage =
      getInitialPage();

    if (
      initialPage ===
      "materials"
    ) {
      showPage(
        "home",
        false
      );
    } else {
      showPage(
        initialPage,
        false
      );
    }
  }


  /* =======================================================
     40. LOADING SCREEN
     ======================================================= */

  let loaderHidden =
    false;

  function hideLoadingScreen() {
    if (
      loaderHidden ||
      !DOM.loadingScreen
    ) {
      return;
    }

    loaderHidden =
      true;

    DOM.loadingScreen.classList.add(
      "hidden"
    );

    DOM.loadingScreen.setAttribute(
      "aria-hidden",
      "true"
    );

    /*
      Hard fallback in case CSS transition
      does not remove visual layer.
    */
    setTimeout(
      () => {
        if (
          DOM.loadingScreen
        ) {
          DOM.loadingScreen.style.display =
            "none";
        }
      },
      700
    );
  }


  function showLoadingProgress() {
    if (DOM.loadingText) {
      DOM.loadingText.textContent =
        text(
          "Loading...",
          "लोड हो रहा है..."
        );
    }

    if (DOM.loadingLine) {
      DOM.loadingLine.style.width =
        "35%";
    }

    requestAnimationFrame(
      () => {
        if (DOM.loadingLine) {
          DOM.loadingLine.style.width =
            "70%";
        }

        setTimeout(
          () => {
            if (DOM.loadingLine) {
              DOM.loadingLine.style.width =
                "100%";
            }
          },
          100
        );
      }
    );
  }


  /* =======================================================
     41. GLOBAL ERROR SAFETY
     ======================================================= */

  function installErrorSafety() {
    window.addEventListener(
      "error",
      event => {
        console.error(
          "App error:",
          event.error ||
          event.message
        );

        /*
          Never allow an unexpected error
          to permanently trap the user on loader.
        */
        hideLoadingScreen();
      }
    );

    window.addEventListener(
      "unhandledrejection",
      event => {
        console.error(
          "Unhandled promise rejection:",
          event.reason
        );

        hideLoadingScreen();
      }
    );
  }


  /* =======================================================
     42. RENDER ALL
     ======================================================= */

  function renderAll() {
    applyBranding();

    applyTheme();

    applyConfigVisibility();

    renderHome();

    if (
      state.currentPage ===
      "materials"
    ) {
      if (state.currentItem) {
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

    renderSettings();

    updateTopBarTitle();

    updateBottomNavigation(
      state.currentPage
    );

    applyMaterialView();
  }


  /* =======================================================
     43. PUBLIC API
     ======================================================= */

  window.SandeepEstimateApp = {
    state,

    openStage,
    openMaterial,

    showEstimate,
    renderEstimate,

    addCurrentToEstimate,

    setLanguage,
    toggleLanguage,

    toggleTheme,

    setMaterialView,
    cycleMaterialView,

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

      showLoadingProgress();

      validateMasterData();

      initializeUI();

      /*
        Small delay gives browser time to paint
        the first UI frame before removing loader.
      */
      requestAnimationFrame(
        () => {
          setTimeout(
            hideLoadingScreen,
            150
          );
        }
      );

    } catch (error) {
      console.error(
        "Estimate List initialization failed:",
        error
      );

      /*
        Critical:
        even if initialization has a problem,
        never keep the loading screen forever.
      */
      hideLoadingScreen();
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
