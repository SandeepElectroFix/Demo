'use strict';

/*
  ============================================================
  SANDEEP ELECTROFIX
  ESTIMATE LIST
  APP / UI MASTER CONFIG
  ============================================================
*/

const APP_CONFIG = {

  app: {
    name: "Estimate List",
    owner: "Sandeep ElectroFix",
    tagline: "Powering Your Trust",

    defaultLanguage: "en",

    storage: {
      language: "sandeepMaterialLang",
      estimate: "sandeepEstimateItems",
      view: "sandeepMaterialView",
      theme: "sandeepTheme"
    }
  },


  /*
    ==========================================================
    UI VISIBILITY
    true  = show
    false = hide
    ==========================================================
  */

  ui: {

    topbar: true,
    menuButton: true,
    languageButton: true,

    sideMenu: true,

    homePage: true,
    hero: true,
    stageCards: true,

    materialImages: true,
    materialViewSwitch: true,

    quantityQuickButtons: true,
    quantityStepper: true,

    addButton: true,
    nextButton: true,
    backButton: true,

    estimateEdit: true,
    estimateDelete: true,

    bottomNavigation: true,

    calculator: true,
    settings: true,

    darkMode: true,
    languageSwitch: true,

    toast: true
  },


  /*
    ==========================================================
    NAVIGATION
    ==========================================================
  */

  navigation: {

    pages: {
      home: true,
      estimate: true,
      calculator: true,
      settings: true
    }

  },


  /*
    ==========================================================
    STAGE VISIBILITY
    ==========================================================
  */

  stages: {

    stage1: true,
    stage2: false,
    stage3: false,
    stage4: false,
    stage5: false

  },


  /*
    ==========================================================
    MATERIAL VIEW
    ==========================================================
  */

  materialView: {

    default: "grid",

    available: [
      "grid",
      "list",
      "compact"
    ]

  },


  /*
    ==========================================================
    QUANTITY
    ==========================================================
  */

  quantity: {

    minimum: 1,

    quickValues: [
      1,
      5,
      10,
      20,
      25,
      50,
      100
    ]

  },


  /*
    ==========================================================
    THEME
    ==========================================================
  */

  theme: {

    default: "dark",

    dark: {
      background: "#050816",
      surface: "#0a1020",
      surface2: "#0d1528",
      blue: "#0ea5e9",
      blueBright: "#38bdf8",
      gold: "#facc15",
      gold2: "#f59e0b"
    },

    light: {
      background: "#f4f7fb",
      surface: "#ffffff",
      surface2: "#eef3f8",
      blue: "#0284c7",
      blueBright: "#0ea5e9",
      gold: "#d97706",
      gold2: "#f59e0b"
    }

  }

};
