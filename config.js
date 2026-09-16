"use strict";

/*
============================================================
SANDEEP ELECTROFIX
ESTIMATE LIST
APP CONFIGURATION
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
  INDIVIDUAL UI SHOW / HIDE CONTROL
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
  PAGE CONTROL
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
  STAGE CONTROL
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

    default: "dark"

  }

};
