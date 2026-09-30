/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   config.js
   ---------------------------------------------------------
   Brand       : Sandeep ElectroFix
   Owner       : Sandeep Verma
   Tagline     : Powering Your Trust

   FILE STRUCTURE
   --------------
   index.html
   style.css
   config.js
   material.js
   app.js

   IMPORTANT
   ----------
   - material.js is NOT modified by this file
   - Quantity is required
   - Other fields are optional
   - Brand is optional
   - Price is optional and hidden initially
   - Hindi = Hindi only
   - English = English only
   - Theme = Dark / Light
   ========================================================= */

"use strict";


/* =========================================================
   MAIN APP CONFIG
   ========================================================= */

window.APP_CONFIG = {

  /* -------------------------------------------------------
     BRAND
     ------------------------------------------------------- */

  appName: "Sandeep ElectroFix - Estimate List",

  ownerName: "Sandeep Verma",

  tagline: "Powering Your Trust",

  logo: "logo.png",


  /* -------------------------------------------------------
     DEFAULT SETTINGS
     ------------------------------------------------------- */

  defaultLanguage: "hi",

  defaultTheme: "dark",


  /* -------------------------------------------------------
     MATERIAL INPUT RULES
     ------------------------------------------------------- */

  quantityRequired: true,

  otherFieldsOptional: true,

  priceOptional: true,

  priceInitiallyHidden: true,

  skipBrandOption: false,


  /* -------------------------------------------------------
     STORAGE KEYS
     ------------------------------------------------------- */

  storage: {

    estimateItems: "sandeepEstimateItems",

    language: "sandeepMaterialLang",

    theme: "sandeepTheme",

    materialView: "sandeepMaterialView",

    route: "sandeepEstimateRoute",

    stageView: "sandeepStageView",

    lastUnit: "sandeepLastUnit"

  },


  /* -------------------------------------------------------
     UI FEATURES
     ------------------------------------------------------- */

  ui: {

    menu: true,

    languageButton: true,

    bottomNav: true,

    estimate: true,

    calculator: true,

    settings: true,

    viewSwitch: true,

    search: true,

    filter: true,

    brand: true,

    price: true

  },


  /* -------------------------------------------------------
     MATERIAL VIEW MODES
     ------------------------------------------------------- */

  views: [

    "grid",

    "list",

    "compact",

    "large",

    "mini",

    "2column",

    "horizontal",

    "icon",

    "timeline",

    "dense"

  ],


  /* -------------------------------------------------------
     BRAND COLORS
     ------------------------------------------------------- */

  colors: {

    dark: {

      background: "#050816",

      backgroundSecondary: "#03070d",

      card: "#07182e",

      cardSecondary: "#0a2140",

      primary: "#0ea5e9",

      primaryLight: "#38bdf8",

      cyan: "#22d3ee",

      gold: "#facc15",

      goldDark: "#f59e0b",

      text: "#f8fafc",

      textSecondary: "#cbd5e1",

      muted: "#94a3b8",

      border: "rgba(56,189,248,0.28)",

      danger: "#ef4444",

      success: "#22c55e"

    },

    light: {

      background: "#f4f8fc",

      backgroundSecondary: "#eaf2f9",

      card: "#ffffff",

      cardSecondary: "#eef7ff",

      primary: "#0284c7",

      primaryLight: "#0ea5e9",

      cyan: "#0891b2",

      gold: "#d97706",

      goldDark: "#b45309",

      text: "#0f172a",

      textSecondary: "#334155",

      muted: "#64748b",

      border: "rgba(14,165,233,0.28)",

      danger: "#dc2626",

      success: "#16a34a"

    }

  },


  /* -------------------------------------------------------
     BUSINESS INFORMATION
     ------------------------------------------------------- */

  business: {

    name: "Sandeep ElectroFix",

    owner: "Sandeep Verma",

    tagline: "Powering Your Trust",

    phone: "+919026036445",

    whatsapp: "+919026036445",

    email: "SandeepElectroFix@gmail.com",

    address:
      "Jhandewalan Chauraha, near Gupta Provision Store, Durvijay Ganj, Ganeshganj, Raniganj, Aminabad, Lucknow, Uttar Pradesh 226018",

    plusCode: "RWVC+267 Lucknow",

    maps:
      "https://maps.app.goo.gl/XYZnm7sFAVRT68Vs7",

    facebook:
      "https://facebook.com/SandeepElectroFix",

    instagram:
      "https://instagram.com/sandeep_electrofix",

    youtube:
      "https://youtube.com/@sandeepelectrofix"

  },


  /* -------------------------------------------------------
     APP ROUTES
     ------------------------------------------------------- */

  routes: {

    home: "home",

    estimate: "estimate",

    calculator: "calculator",

    settings: "settings",

    stage: "stage",

    section: "section",

    material: "material",

    editor: "editor"

  },


  /* -------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------- */

  navigation: {

    home: "home",

    estimate: "estimate",

    calculator: "calculator",

    settings: "settings"

  },


  /* -------------------------------------------------------
     LANGUAGE
     ------------------------------------------------------- */

  languages: {

    default: "hi",

    available: [

      "hi",

      "en"

    ]

  },


  /* -------------------------------------------------------
     THEME
     ------------------------------------------------------- */

  themes: {

    default: "dark",

    available: [

      "dark",

      "light"

    ]

  },


  /* -------------------------------------------------------
     MATERIAL BEHAVIOUR
     ------------------------------------------------------- */

  material: {

    quantityRequired: true,

    unitRequired: false,

    brandRequired: false,

    priceRequired: false,

    sizeRequired: false,

    typeRequired: false,

    subTypeRequired: false,

    autoAddOnNext: false,

    moveToNextAfterAdd: true,

    scrollTopAfterNavigation: true,

    carryForwardUnit: true,

    editableAfterAdd: true,

    deletableAfterAdd: true

  },


  /* -------------------------------------------------------
     SEARCH
     ------------------------------------------------------- */

  search: {

    enabled: true,

    searchMaterials: true,

    searchStages: true,

    searchSections: true,

    searchBrands: true,

    minimumCharacters: 0,

    clearButton: true,

    filterButton: true

  },


  /* -------------------------------------------------------
     FILTER
     ------------------------------------------------------- */

  filter: {

    enabled: true,

    stage: true,

    type: true,

    size: true,

    brand: true,

    clearAll: true

  },


  /* -------------------------------------------------------
     ESTIMATE
     ------------------------------------------------------- */

  estimate: {

    enabled: true,

    editable: true,

    deletable: true,

    quantityRequired: true,

    showBrand: true,

    showUnit: true,

    showPrice: true,

    priceInitiallyHidden: true

  },


  /* -------------------------------------------------------
     BACK BUTTON BEHAVIOUR
     ------------------------------------------------------- */

  backNavigation: {

    drawerFirst: true,

    editorToMaterial: true,

    materialToSection: true,

    sectionToStage: true,

    stageToHome: true,

    closeDrawerFirst: true,

    closeModalFirst: true

  },


  /* -------------------------------------------------------
     PERSISTENCE
     ------------------------------------------------------- */

  persistence: {

    retainLanguage: true,

    retainTheme: true,

    retainView: true,

    retainRoute: true,

    retainStage: true,

    retainMaterial: true,

    retainDraft: true,

    retainLastUnit: true

  },


  /* -------------------------------------------------------
     RESET
     ------------------------------------------------------- */

  reset: {

    clearEstimate: true,

    resetLanguage: true,

    resetTheme: true,

    resetView: true,

    resetRoute: true,

    resetDraft: true

  },


  /* -------------------------------------------------------
     TOAST
     ------------------------------------------------------- */

  toast: {

    enabled: true,

    duration: 1800

  },


  /* -------------------------------------------------------
     RESPONSIVE
     ------------------------------------------------------- */

  responsive: {

    mobile: true,

    tablet: true,

    desktop: true,

    bottomNavigationMobile: true,

    bottomNavigationDesktop: false

  }

};


/* =========================================================
   SAFETY DEFAULTS
   ========================================================= */

window.APP_CONFIG.storage =
  window.APP_CONFIG.storage || {};

window.APP_CONFIG.ui =
  window.APP_CONFIG.ui || {};

window.APP_CONFIG.views =
  window.APP_CONFIG.views || [];


/* =========================================================
   GLOBAL BRAND HELPERS
   ========================================================= */

window.APP_CONFIG.getLogo = function () {

  return this.logo || "logo.png";

};


window.APP_CONFIG.getBrandName = function () {

  return this.business?.name ||
         this.appName ||
         "Sandeep ElectroFix";

};


window.APP_CONFIG.getOwnerName = function () {

  return this.business?.owner ||
         this.ownerName ||
         "Sandeep Verma";

};


window.APP_CONFIG.getTagline = function () {

  return this.business?.tagline ||
         this.tagline ||
         "Powering Your Trust";

};


/* =========================================================
   CONSOLE CHECK
   ========================================================= */

console.log(
  "Sandeep ElectroFix - Estimate List config loaded."
);

console.log(
  "Language:",
  localStorage.getItem(
    window.APP_CONFIG.storage.language
  ) || window.APP_CONFIG.defaultLanguage
);

console.log(
  "Theme:",
  localStorage.getItem(
    window.APP_CONFIG.storage.theme
  ) || window.APP_CONFIG.defaultTheme
);
