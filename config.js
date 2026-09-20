/* =========================================================
   Sandeep ElectroFix - Estimate List
   config.js
   App / UI Configuration
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     APP CONFIG
     ========================================================= */

  const APP_CONFIG = {

    /* -------------------------------------------------------
       APP BASIC
       ------------------------------------------------------- */
    app: {
      name: "Estimate List",
      nameHi: "एस्टिमेट लिस्ट",

      businessName: "Sandeep ElectroFix",
      tagline: "Powering Your Trust",

      version: "1.0.0",

      defaultLanguage: "en"
    },


    /* -------------------------------------------------------
       UI - हर UI ELEMENT को अलग-अलग SHOW / HIDE
       ------------------------------------------------------- */
    ui: {

      logo: true,

      businessName: true,

      tagline: true,

      hamburger: true,

      languageButton: true,

      searchBar: true,

      stageCards: true,

      bottomNavigation: true,

      backButton: true,

      nextButton: true,

      addToEstimateButton: true,

      toast: true
    },


    /* -------------------------------------------------------
       HOME PAGE
       ------------------------------------------------------- */
    home: {

      enabled: true,

      showHero: true,

      showStageCards: true,

      showStageNumbers: true,

      showStageTitles: true,

      showStageDescriptions: true,

      showStageIcons: true,

      showSearch: true
    },


    /* -------------------------------------------------------
       MATERIAL ITEM PAGE
       ------------------------------------------------------- */
    materials: {

      enabled: true,

      showImages: true,

      showItemNumber: true,

      showItemName: true,

      showSize: true,

      showType: true,

      showSubType: true,

      showColour: true,

      showMaterial: true,

      showQuantity: true,

      showUnit: true,

      showBrand: true,

      /* Price अभी default में hidden रहेगा */
      showPrice: false
    },


    /* -------------------------------------------------------
       QUANTITY
       ------------------------------------------------------- */
    quantity: {

      enabled: true,

      required: true,

      allowManualInput: true,

      allowPlusMinus: true,

      min: 1,

      max: 999999,

      defaultValue: "",

      carryForward: false
    },


    /* -------------------------------------------------------
       BRAND
       ------------------------------------------------------- */
    brand: {

      enabled: true,

      required: false,

      allowBlank: true,

      lastField: true
    },


    /* -------------------------------------------------------
       PRICE
       ------------------------------------------------------- */
    price: {

      enabled: true,

      visible: false,

      required: false,

      allowBlank: true,

      showOnlyWhenFilled: true,

      currency: "₹",

      decimalPlaces: 2
    },


    /* -------------------------------------------------------
       NAVIGATION / ITEM FLOW
       ------------------------------------------------------- */
    navigation: {

      autoNextAfterAdd: true,

      scrollNextToTop: true,

      showAddToast: true,

      nextDoesNotAutoAdd: true,

      backToPreviousItem: true,

      restorePreviousItemTop: true,

      preserveEnteredValues: true
    },


    /* -------------------------------------------------------
       BACK BUTTON
       ------------------------------------------------------- */
    back: {

      enabled: true,

      restorePreviousItem: true,

      scrollToTop: true
    },


    /* -------------------------------------------------------
       LANGUAGE
       ------------------------------------------------------- */
    language: {

      enabled: true,

      default: "en",

      storageKey: "sandeepMaterialLang",

      languages: [
        "hi",
        "en"
      ]
    },


    /* -------------------------------------------------------
       MATERIAL VIEWS
       ------------------------------------------------------- */

    /*
      सभी 10 views individually ON / OFF हो सकते हैं.

      grid       = ▦ Grid
      list       = ☰ List
      compact    = ≡ Compact
      large      = ▣ Large
      mini       = ☷ Mini
      twoColumn  = ▤ 2 Column
      horizontal = ↔ Horizontal
      iconList   = ◉ Icon List
      timeline   = ⌁ Timeline
      dense      = ▤ Dense
    */

    views: {

      enabled: true,

      grid: true,

      list: true,

      compact: true,

      large: true,

      mini: true,

      twoColumn: true,

      horizontal: true,

      iconList: true,

      timeline: true,

      dense: true,

      default: "grid",

      storageKey: "sandeepMaterialView"
    },


    /* -------------------------------------------------------
       THEME
       ------------------------------------------------------- */
    theme: {

      darkMode: true,

      lightMode: true,

      default: "dark",

      allowToggle: true,

      storageKey: "sandeepTheme"
    },


    /* -------------------------------------------------------
       BOTTOM NAVIGATION
       ------------------------------------------------------- */
    bottomNav: {

      enabled: true,

      home: true,

      estimate: true,

      calculator: true,

      settings: true
    },


    /* -------------------------------------------------------
       CALCULATOR
       ------------------------------------------------------- */
    calculator: {

      enabled: true,

      voltage: true,

      current: true,

      power: true,

      resistance: true,

      formulas: true,

      inverterExamples: true
    },


    /* -------------------------------------------------------
       SETTINGS
       ------------------------------------------------------- */
    settings: {

      enabled: true,

      language: true,

      theme: true,

      materialView: true,

      backup: true,

      reset: true,

      about: true
    },


    /* -------------------------------------------------------
       STORAGE
       ------------------------------------------------------- */
    storage: {

      estimateItems: "sandeepEstimateItems",

      materialLanguage: "sandeepMaterialLang",

      materialView: "sandeepMaterialView",

      theme: "sandeepTheme"
    },


    /* -------------------------------------------------------
       STAGE CARDS
       ------------------------------------------------------- */
    stageCards: {

      enabled: true,

      showNumber: true,

      showEnglish: true,

      showHindi: true,

      showDescription: true,

      showIcon: true,

      rotation: true,

      rotationTime: 5000,

      responsive: true,

      columnsMobile: 2,

      columnsSmall: 1
    },


    /* -------------------------------------------------------
       SEARCH
       ------------------------------------------------------- */
    search: {

      enabled: true,

      showIcon: true,

      showClearButton: true,

      searchMaterials: true,

      searchStages: true,

      minimumCharacters: 1
    },


    /* -------------------------------------------------------
       ESTIMATE
       ------------------------------------------------------- */
    estimate: {

      enabled: true,

      showItems: true,

      allowEdit: true,

      allowDelete: true,

      allowClearAll: true,

      showQuantity: true,

      showUnit: true,

      showBrand: true,

      showPrice: false,

      showTotal: false,

      saveToLocalStorage: true
    },


    /* -------------------------------------------------------
       TOAST
       ------------------------------------------------------- */
    toast: {

      enabled: true,

      duration: 1800,

      position: "bottom",

      small: true
    },


    /* -------------------------------------------------------
       LOADING SCREEN
       ------------------------------------------------------- */
    loading: {

      enabled: true,

      showLogo: true,

      showTitle: true,

      showSubtitle: true,

      showProgressLine: true,

      minimumTime: 350,

      maximumTime: 2500
    },


    /* -------------------------------------------------------
       LOGO / BRANDING
       ------------------------------------------------------- */
    branding: {

      logo: "logo.png",

      name: "Sandeep ElectroFix",

      tagline: "Powering Your Trust",

      showLogo: true,

      showName: true,

      showTagline: true
    },


    /* -------------------------------------------------------
       COLORS
       ------------------------------------------------------- */
    colors: {

      darkBackground: "#050816",

      darkBackgroundSecondary: "#03070d",

      card: "#07182e",

      electricBlue: "#0ea5e9",

      electricBlueLight: "#38bdf8",

      gold: "#facc15",

      goldDark: "#f59e0b"
    }

  };


  /* =========================================================
     HELPER FUNCTIONS
     ========================================================= */


  /**
   * Nested config value पढ़ने के लिए
   *
   * Example:
   * getConfig("quantity.required")
   */
  function getConfig(path, fallback = undefined) {

    if (!path) {
      return fallback;
    }

    const parts = String(path).split(".");

    let value = APP_CONFIG;

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

    return value;
  }


  /**
   * Boolean config check
   *
   * Example:
   * isEnabled("ui.logo")
   */
  function isEnabled(path, fallback = false) {

    const value = getConfig(path, fallback);

    return value === true;
  }


  /**
   * UI element visible है या नहीं
   */
  function isUIVisible(name) {

    return isEnabled(`ui.${name}`);
  }


  /**
   * Material field visible है या नहीं
   */
  function isMaterialFieldVisible(field) {

    return isEnabled(`materials.show${capitalize(field)}`);
  }


  /**
   * First letter uppercase
   */
  function capitalize(value) {

    if (!value) {
      return "";
    }

    return String(value).charAt(0).toUpperCase() +
           String(value).slice(1);
  }


  /**
   * Quantity configuration
   */
  function getQuantityConfig() {

    return {
      enabled: !!APP_CONFIG.quantity.enabled,

      required: !!APP_CONFIG.quantity.required,

      allowManualInput:
        !!APP_CONFIG.quantity.allowManualInput,

      allowPlusMinus:
        !!APP_CONFIG.quantity.allowPlusMinus,

      min: APP_CONFIG.quantity.min,

      max: APP_CONFIG.quantity.max,

      carryForward:
        !!APP_CONFIG.quantity.carryForward
    };
  }


  /**
   * Quantity required है?
   */
  function isQuantityRequired() {

    return (
      APP_CONFIG.quantity.enabled === true &&
      APP_CONFIG.quantity.required === true
    );
  }


  /**
   * Brand configuration
   */
  function getBrandConfig() {

    return {
      enabled: !!APP_CONFIG.brand.enabled,

      required: !!APP_CONFIG.brand.required,

      allowBlank: !!APP_CONFIG.brand.allowBlank,

      lastField: !!APP_CONFIG.brand.lastField
    };
  }


  /**
   * Brand required है?
   */
  function isBrandRequired() {

    return (
      APP_CONFIG.brand.enabled === true &&
      APP_CONFIG.brand.required === true
    );
  }


  /**
   * Price configuration
   */
  function getPriceConfig() {

    return {
      enabled: !!APP_CONFIG.price.enabled,

      visible: !!APP_CONFIG.price.visible,

      required: !!APP_CONFIG.price.required,

      allowBlank: !!APP_CONFIG.price.allowBlank,

      showOnlyWhenFilled:
        !!APP_CONFIG.price.showOnlyWhenFilled,

      currency: APP_CONFIG.price.currency,

      decimalPlaces: APP_CONFIG.price.decimalPlaces
    };
  }


  /**
   * Price दिखाई देनी चाहिए?
   *
   * अगर showOnlyWhenFilled = true है,
   * तो actual value filled होने पर ही दिखेगी।
   */
  function shouldShowPrice(value = "") {

    if (APP_CONFIG.price.enabled !== true) {
      return false;
    }

    if (APP_CONFIG.price.visible === true) {
      return true;
    }

    if (APP_CONFIG.price.showOnlyWhenFilled === true) {
      return (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      );
    }

    return false;
  }


  /**
   * View enabled है?
   */
  function isViewEnabled(viewName) {

    if (APP_CONFIG.views.enabled !== true) {
      return false;
    }

    return APP_CONFIG.views[viewName] === true;
  }


  /**
   * सभी enabled views
   */
  function getEnabledViews() {

    const viewNames = [
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

    return viewNames.filter(
      viewName => isViewEnabled(viewName)
    );
  }


  /**
   * Default view
   */
  function getDefaultView() {

    const defaultView = APP_CONFIG.views.default;

    if (isViewEnabled(defaultView)) {
      return defaultView;
    }

    const enabledViews = getEnabledViews();

    return enabledViews.length
      ? enabledViews[0]
      : "grid";
  }


  /**
   * Storage key प्राप्त करें
   */
  function getStorageKey(name) {

    return (
      APP_CONFIG.storage[name] ||
      null
    );
  }


  /**
   * Language
   */
  function getDefaultLanguage() {

    return (
      APP_CONFIG.language.default || "hi"
    );
  }


  /**
   * Valid language check
   */
  function isLanguageEnabled(language) {

    return (
      APP_CONFIG.language.enabled === true &&
      APP_CONFIG.language.languages.includes(language)
    );
  }


  /**
   * Navigation config
   */
  function getNavigationConfig() {

    return {
      autoNextAfterAdd:
        !!APP_CONFIG.navigation.autoNextAfterAdd,

      scrollNextToTop:
        !!APP_CONFIG.navigation.scrollNextToTop,

      showAddToast:
        !!APP_CONFIG.navigation.showAddToast,

      nextDoesNotAutoAdd:
        !!APP_CONFIG.navigation.nextDoesNotAutoAdd,

      backToPreviousItem:
        !!APP_CONFIG.navigation.backToPreviousItem,

      restorePreviousItemTop:
        !!APP_CONFIG.navigation.restorePreviousItemTop,

      preserveEnteredValues:
        !!APP_CONFIG.navigation.preserveEnteredValues
    };
  }


  /**
   * Theme
   */
  function getThemeConfig() {

    return {
      darkMode: !!APP_CONFIG.theme.darkMode,

      lightMode: !!APP_CONFIG.theme.lightMode,

      default: APP_CONFIG.theme.default,

      allowToggle: !!APP_CONFIG.theme.allowToggle,

      storageKey: APP_CONFIG.theme.storageKey
    };
  }


  /**
   * Search
   */
  function getSearchConfig() {

    return {
      enabled: !!APP_CONFIG.search.enabled,

      showIcon: !!APP_CONFIG.search.showIcon,

      showClearButton:
        !!APP_CONFIG.search.showClearButton,

      searchMaterials:
        !!APP_CONFIG.search.searchMaterials,

      searchStages:
        !!APP_CONFIG.search.searchStages,

      minimumCharacters:
        APP_CONFIG.search.minimumCharacters
    };
  }


  /**
   * Stage card config
   */
  function getStageCardConfig() {

    return {
      enabled: !!APP_CONFIG.stageCards.enabled,

      showNumber:
        !!APP_CONFIG.stageCards.showNumber,

      showEnglish:
        !!APP_CONFIG.stageCards.showEnglish,

      showHindi:
        !!APP_CONFIG.stageCards.showHindi,

      showDescription:
        !!APP_CONFIG.stageCards.showDescription,

      showIcon:
        !!APP_CONFIG.stageCards.showIcon,

      rotation:
        !!APP_CONFIG.stageCards.rotation,

      rotationTime:
        APP_CONFIG.stageCards.rotationTime,

      responsive:
        !!APP_CONFIG.stageCards.responsive
    };
  }


  /* =========================================================
     GLOBAL EXPORT
     ========================================================= */

  window.APP_CONFIG = APP_CONFIG;

  window.AppConfig = {

    config: APP_CONFIG,

    get: getConfig,

    isEnabled: isEnabled,

    isUIVisible: isUIVisible,

    isMaterialFieldVisible:
      isMaterialFieldVisible,

    getQuantityConfig:
      getQuantityConfig,

    isQuantityRequired:
      isQuantityRequired,

    getBrandConfig:
      getBrandConfig,

    isBrandRequired:
      isBrandRequired,

    getPriceConfig:
      getPriceConfig,

    shouldShowPrice:
      shouldShowPrice,

    isViewEnabled:
      isViewEnabled,

    getEnabledViews:
      getEnabledViews,

    getDefaultView:
      getDefaultView,

    getStorageKey:
      getStorageKey,

    getDefaultLanguage:
      getDefaultLanguage,

    isLanguageEnabled:
      isLanguageEnabled,

    getNavigationConfig:
      getNavigationConfig,

    getThemeConfig:
      getThemeConfig,

    getSearchConfig:
      getSearchConfig,

    getStageCardConfig:
      getStageCardConfig
  };


  /* =========================================================
     STARTUP CHECK
     ========================================================= */

  if (typeof console !== "undefined") {

    console.log(
      "Sandeep ElectroFix - config.js loaded"
    );

    console.log(
      "Default Language:",
      APP_CONFIG.language.default
    );

    console.log(
      "Default View:",
      getDefaultView()
    );

    console.log(
      "Quantity Required:",
      isQuantityRequired()
    );

    console.log(
      "Brand Required:",
      isBrandRequired()
    );

    console.log(
      "Price Visible:",
      APP_CONFIG.price.visible
    );

    console.log(
      "Enabled Views:",
      getEnabledViews()
    );
  }

})();
