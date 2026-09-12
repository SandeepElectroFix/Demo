"use strict";

/*
=========================================================
SANDEEP ELECTROFIX
ESTIMATE LIST
APP / UI CONFIGURATION
=========================================================

IMPORTANT:

1. UI controls यहाँ रहेंगे.
2. Material-specific data material.js में रहेगा.
3. किसी material को यहाँ add/remove नहीं करना.
4. हर UI feature को individually ON/OFF किया जा सकता है.
=========================================================
*/

window.APP_CONFIG = {

  appName: "Estimate List",

  owner: "Sandeep Verma",

  business: "Sandeep ElectroFix",

  theme: {
    background: "#050816",
    electricBlue: "#0ea5e9",
    lightBlue: "#38bdf8",
    gold: "#facc15",
    goldDark: "#f59e0b"
  },

  storage: {
    ui: "sandeep_estimate_ui_config",
    estimate: "sandeepEstimateItems",
    language: "sandeepMaterialLang"
  },

  language: {
    default: "en",
    available: [
      "en",
      "hi"
    ]
  },

  ui: {

    header: true,

    logo: true,

    pageTitle: true,

    search: true,

    stageCards: true,

    materialImages: true,

    materialNames: true,

    type: true,

    subtype: true,

    size: true,

    colour: true,

    rating: true,

    wattage: true,

    sensitivity: true,

    curve: true,

    cableSize: true,

    quantity: true,

    unit: true,

    brand: true,

    estimate: true,

    pdf: true,

    bottomNav: true,

    settings: true

  }

};
