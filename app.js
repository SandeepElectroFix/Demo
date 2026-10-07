/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   Works with:
   - index.html
   - style.css
   - config.js
   - material.js

   IMPORTANT:
   - material.js = MASTER DATA ONLY
   - No material data is duplicated here.
   - MATERIALS is read exactly in its current array structure.
   - Quantity is required.
   - Other fields are optional.
   - Brand is optional.
   - Price is optional and hidden initially.
   ========================================================= */

"use strict";


/* =========================================================
   APP STATE
   ========================================================= */

const AppState = {
  language: "hi",
  theme: "dark",
  view: "grid",

  page: "home",

  stageIndex: null,
  sectionIndex: null,
  materialIndex: null,

  currentMaterial: null,
  currentMaterialKey: "",

  draft: {
    fields: {},
    quantity: "",
    unit: "",
    brand: "",
    price: ""
  },

  editingEstimateId: null,

  estimateItems: [],

  filters: {
    stage: "",
    section: "",
    brand: "",
    unit: "",
    option: ""
  },

  search: "",

  drawerOpen: false,
  filterOpen: false,
  viewMenuOpen: false,

  display: {}
};


/* =========================================================
   CONSTANTS
   ========================================================= */

const MATERIALS_DATA = Array.isArray(window.MATERIALS)
  ? window.MATERIALS
  : [];

const DEFAULT_DISPLAY = typeof DISPLAY_CONFIG !== "undefined"
  ? { ...DISPLAY_CONFIG }
  : {};

const STORAGE = typeof STORAGE_KEYS !== "undefined"
  ? STORAGE_KEYS
  : {
      language: "sandeepMaterialLang",
      theme: "sandeepTheme",
      estimateItems: "sandeepEstimateItems",
      materialView: "sandeepMaterialView",
      stageView: "sandeepStageView",
      estimateRoute: "sandeepEstimateRoute",
      lastUnit: "sandeepLastUnit",
      currentPage: "sandeepCurrentPage",
      currentStage: "sandeepCurrentStage",
      currentSection: "sandeepCurrentSection",
      currentMaterial: "sandeepCurrentMaterial",
      draft: "sandeepEstimateDraft",
      filters: "sandeepEstimateFilters",
      display: "sandeepDisplaySettings"
    };


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


function exists(selector) {
  return !!$(selector);
}


function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function safeJSONParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}


/* =========================================================
   STORAGE
   ========================================================= */

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return safeJSONParse(value, value);
  } catch {
    return fallback;
  }
}


function writeStorage(key, value) {
  try {
    localStorage.setItem(
      key,
      typeof value === "string"
        ? value
        : JSON.stringify(value)
    );
  } catch {
    /* Storage may be unavailable. App continues normally. */
  }
}


function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* Ignore storage errors. */
  }
}


/* =========================================================
   TRANSLATION
   ---------------------------------------------------------
   Master data remains English.
   UI translation is handled here.
   ========================================================= */

const HI = {
  /* Application */
  "Estimate List": "एस्टिमेट लिस्ट",
  "Sandeep ElectroFix": "संदीप इलेक्ट्रोफिक्स",
  "Powering Your Trust": "आपके विश्वास को रोशन करते हुए",

  /* Navigation */
  "Home": "होम",
  "Estimate": "एस्टिमेट",
  "Calculator": "कैलकुलेटर",
  "Settings": "सेटिंग्स",
  "Stage": "स्टेज",
  "Section": "सेक्शन",
  "Material": "सामग्री",
  "Editor": "एडिटर",

  /* Actions */
  "Add": "जोड़ें",
  "Add Item": "आइटम जोड़ें",
  "Update": "अपडेट करें",
  "Next": "अगला",
  "Back": "वापस",
  "Clear": "साफ करें",
  "Delete": "हटाएं",
  "Edit": "एडिट करें",
  "Close": "बंद करें",
  "Reset": "रीसेट",
  "Reset App": "ऐप रीसेट करें",
  "Save": "सेव करें",
  "Apply": "लागू करें",
  "Cancel": "रद्द करें",
  "Search": "खोजें",
  "Filter": "फ़िल्टर",
  "Reset Filter": "फ़िल्टर रीसेट करें",

  /* Estimate */
  "Quantity": "मात्रा",
  "Unit": "इकाई",
  "Brand": "ब्रांड",
  "Price": "कीमत",
  "Total": "कुल",
  "Item": "आइटम",
  "Items": "आइटम",
  "Required": "आवश्यक",
  "Optional": "वैकल्पिक",
  "No estimate items": "अभी कोई एस्टिमेट आइटम नहीं है",
  "Estimate is empty": "एस्टिमेट खाली है",

  /* Views */
  "Grid": "ग्रिड",
  "List": "लिस्ट",
  "Compact": "कॉम्पैक्ट",
  "Large": "बड़ा",
  "Mini": "मिनी",
  "2 Column": "2 कॉलम",
  "Horizontal": "हॉरिज़ॉन्टल",
  "Icon List": "आइकन लिस्ट",
  "Timeline": "टाइमलाइन",
  "Dense": "डेंस",

  /* Settings */
  "Language": "भाषा",
  "Theme": "थीम",
  "Dark": "डार्क",
  "Light": "लाइट",
  "Display": "डिस्प्ले",
  "Show": "दिखाएं",
  "Hide": "छिपाएं",

  /* Calculator */
  "Power": "पावर",
  "Voltage": "वोल्टेज",
  "Current": "करंट",
  "Inverter": "इन्वर्टर",
  "Input Voltage": "इनपुट वोल्टेज",
  "Output Voltage": "आउटपुट वोल्टेज",
  "Calculate": "गणना करें",
  "Result": "परिणाम",

  /* Messages */
  "Added successfully": "सफलतापूर्वक जोड़ा गया",
  "Updated successfully": "सफलतापूर्वक अपडेट किया गया",
  "Item deleted": "आइटम हटा दिया गया",
  "Nothing to clear": "साफ करने के लिए कुछ नहीं है",
  "Quantity is required": "मात्रा आवश्यक है",
  "Select unit": "इकाई चुनें",
  "Reset all app data?": "क्या ऐप का पूरा डेटा रीसेट करना है?",
  "App reset successfully": "ऐप सफलतापूर्वक रीसेट हो गया",
  "No results found": "कोई परिणाम नहीं मिला",

  /* Common field labels */
  "Size": "साइज",
  "Type": "प्रकार",
  "Sub Type": "उप-प्रकार",
  "Colour": "रंग",
  "Color": "रंग",
  "Material": "सामग्री",
  "Module": "मॉड्यूल",
  "Amp": "एम्पियर",
  "Length": "लंबाई",
  "Width": "चौड़ाई",
  "Depth": "गहराई",
  "Diameter": "व्यास",
  "Shape": "आकार",
  "Ways": "वे",
  "Door": "डोर",
  "Door Type": "डोर प्रकार",
  "Material Type": "सामग्री प्रकार",
  "Conduit Size": "कंड्यूट साइज",
  "Pack Size": "पैक साइज",
  "Pack Size (Weight)": "पैक साइज",
  "Wattage": "वॉटेज",
  "Base": "बेस",
  "Voltage": "वोल्टेज",
  "Supply Voltage": "सप्लाई वोल्टेज",
  "Output Voltage": "आउटपुट वोल्टेज",
  "Input Voltage": "इनपुट वोल्टेज",
  "Colour Temp": "कलर टेम्परेचर",
  "Colour Temperature": "कलर टेम्परेचर",
  "Mounting": "माउंटिंग",
  "Movement": "मूवमेंट",
  "Beam Angle": "बीम एंगल",
  "Body Finish": "बॉडी फिनिश",
  "Density": "डेंसिटी",
  "Dimensions (W × D)": "डायमेंशन (W × D)",
  "Diffuser": "डिफ्यूज़र",
  "Sensitivity": "सेंसिटिविटी",
  "Curve": "कर्व",
  "Phase Selection": "फेज़ चयन",
  "Length": "लंबाई",
  "Gauge / Size": "गेज / साइज",
  "Size / Diameter": "साइज / डायमीटर",
  "Size / Length": "साइज / लंबाई",
  "Size (Length)": "साइज (लंबाई)",
  "Size (Width)": "साइज (चौड़ाई)",
  "Size (Width × Length)": "साइज (चौड़ाई × लंबाई)",
  "Size (Diameter × Length)": "साइज (डायमीटर × लंबाई)",
  "Size (Cable Size × Stud Size)": "साइज (केबल साइज × स्टड साइज)",
  "User Input (Meters)": "अपनी लंबाई डालें (मीटर)",
  "User Input (ft / inch)": "अपनी लंबाई डालें (फीट / इंच)",

  /* Stage names */
  "STAGE 1": "स्टेज 1",
  "STAGE 2": "स्टेज 2",
  "STAGE 3": "स्टेज 3",
  "STAGE 4": "स्टेज 4",
  "STAGE 5": "स्टेज 5",

  "Slab Conduit Installation": "स्लैब कंड्यूट इंस्टॉलेशन",
  "Wall Conduit Installation": "दीवार कंड्यूट इंस्टॉलेशन",
  "Wiring Installation": "वायरिंग इंस्टॉलेशन",
  "Final Electrical Fittings": "फाइनल इलेक्ट्रिकल फिटिंग्स",
  "False Ceiling Wiring Material": "फॉल्स सीलिंग वायरिंग सामग्री",

  /* Sections */
  "Conduit & Box": "कंड्यूट और बॉक्स",
  "Installation Material": "इंस्टॉलेशन सामग्री",
  "Wiring Material": "वायरिंग सामग्री",
  "Pulling Material": "पुलिंग सामग्री",
  "Switch & Socket": "स्विच और सॉकेट",
  "MCB & Protection": "एमसीबी और प्रोटेक्शन",
  "Fan & Ceiling": "फैन और सीलिंग",
  "Lighting": "लाइटिंग",
  "Installation & Finishing": "इंस्टॉलेशन और फिनिशिंग",
  "Wiring & Conduit": "वायरिंग और कंड्यूट",
  "Installation & Fastening": "इंस्टॉलेशन और फास्टनिंग",

  /* Materials */
  "Pipe": "पाइप",
  "Bend": "बेंड",
  "Junction Box": "जंक्शन बॉक्स",
  "Fan Box": "फैन बॉक्स",
  "Concealed Light Box": "कन्सील्ड लाइट बॉक्स",
  "Tape (Shuttering & Joint Sealing)": "टेप (शटरिंग और जॉइंट सीलिंग)",
  "Solvent Cement": "सॉल्वेंट सीमेंट",
  "Neel Powder (Marking Powder)": "नील पाउडर (मार्किंग पाउडर)",
  "Binding Wire": "बाइंडिंग वायर",
  "Cable Tie / Zip Tie": "केबल टाई / जिप टाई",
  "Modular Board (Concealed Metal/PVC Box)": "मॉड्यूलर बोर्ड (कन्सील्ड मेटल/PVC बॉक्स)",
  "MCB Box (Distribution Board)": "एमसीबी बॉक्स (डिस्ट्रीब्यूशन बोर्ड)",
  "Tape (Masking & Plaster Protection)": "टेप (मास्किंग और प्लास्टर प्रोटेक्शन)",
  "Cable Clip": "केबल क्लिप",
  "Wire": "वायर",
  "Flexible Pipe": "फ्लेक्सिबल पाइप",
  "Electrical Tape": "इलेक्ट्रिकल टेप",
  "Fastener": "फास्टनर",
  "Steel Wire / Spring Wire (Fish Tape)": "स्टील वायर / स्प्रिंग वायर (फिश टेप)",

  "Switch Plate": "स्विच प्लेट",
  "Switch Board (Surface Gang Box)": "स्विच बोर्ड (सरफेस गैंग बॉक्स)",
  "Switch": "स्विच",
  "Socket": "सॉकेट",
  "Fan Regulator": "फैन रेगुलेटर",
  "2 Way Switch": "2 वे स्विच",
  "Bell Push": "बेल पुश",
  "Neon Indicator": "नियॉन इंडिकेटर",
  "Blank Plate / Dummy Switch": "ब्लैंक प्लेट / डमी स्विच",
  "DP Switch (Double Pole Switch)": "डीपी स्विच (डबल पोल स्विच)",

  "Mini MCB": "मिनी एमसीबी",
  "SP MCB (Single Pole)": "एसपी एमसीबी (सिंगल पोल)",
  "DP MCB (Double Pole)": "डीपी एमसीबी (डबल पोल)",
  "TPN MCB (Three Pole with Neutral)": "टीपीएन एमसीबी (थ्री पोल विद न्यूट्रल)",
  "MCB Changeover": "एमसीबी चेंजओवर",
  "DP Isolator": "डीपी आइसोलेटर",
  "TPN Isolator (3P / 4P)": "टीपीएन आइसोलेटर (3P / 4P)",
  "RCCB / RCD": "आरसीसीबी / आरसीडी",
  "MCB Box": "एमसीबी बॉक्स",
  "Kit Kat Fuse": "किट कैट फ्यूज",

  "Fan Sheet": "फैन शीट",
  "Round Sheet": "राउंड शीट",
  "Fan Rod": "फैन रॉड",
  "Fan Clamp": "फैन क्लैंप",
  "Holder": "होल्डर",
  "Ceiling Rose": "सीलिंग रोज़",
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
  "LED Strip Driver (SMPS)": "एलईडी स्ट्रिप ड्राइवर (एसएमपीएस)",

  "Door Bell": "डोर बेल",
  "Tape (Mounting / Double Sided)": "माउंटिंग / डबल साइडेड टेप",
  "Instant Glue": "इंस्टेंट ग्लू",
  "Araldite Glue (Epoxy)": "अराल्डाइट ग्लू (एपॉक्सी)",
  "POP (Plaster of Paris)": "पीओपी (प्लास्टर ऑफ पेरिस)",
  "Putty Blade / Patta": "पुट्टी ब्लेड / पट्टा",
  "Screw": "स्क्रू",
  "Lug (Cable Terminal Lug)": "लग (केबल टर्मिनल लग)",
  "Washer": "वॉशर",
  "PVC Wall Plug / Gulli / Gitti": "पीवीसी वॉल प्लग / गुल्ली / गिट्टी",
  "Saddle (Pipe Clamp)": "सैडल (पाइप क्लैंप)"
};


/* =========================================================
   SIMPLE HINDI VALUE TRANSLATION
   ---------------------------------------------------------
   Brand names are intentionally preserved.
   ========================================================= */

const HI_VALUES = {
  "Heavy": "हेवी",
  "Medium": "मीडियम",
  "Light": "लाइट",
  "Heavy (HMS)": "हेवी (HMS)",
  "Medium (MMS)": "मीडियम (MMS)",
  "Light (LMS)": "लाइट (LMS)",
  "Short Bend": "शॉर्ट बेंड",
  "Long Bend": "लॉन्ग बेंड",

  "PVC": "पीवीसी",
  "GI Metal": "जीआई मेटल",
  "GI Steel": "जीआई स्टील",
  "MS Metal": "एमएस मेटल",
  "PVC Flexible": "पीवीसी फ्लेक्सिबल",
  "PVC Flexible Pipe": "पीवीसी फ्लेक्सिबल पाइप",

  "White": "सफेद",
  "Black": "काला",
  "Red": "लाल",
  "Green": "हरा",
  "Yellow": "पीला",
  "Blue": "नीला",
  "Grey": "ग्रे",

  "Normal Junction Box": "नॉर्मल जंक्शन बॉक्स",
  "Deep Junction Box": "डीप जंक्शन बॉक्स",

  "1 Way": "1 वे",
  "2 Way Straight": "2 वे स्ट्रेट",
  "2 Way Angle": "2 वे एंगल",
  "3 Way T-Type": "3 वे T-टाइप",
  "4 Way Cross Type": "4 वे क्रॉस टाइप",
  "Y-Type": "Y-टाइप",
  "H-Type": "H-टाइप",
  "U-Type": "U-टाइप",
  "V-Type": "V-टाइप",

  "Single Door": "सिंगल डोर",
  "Double Door": "डबल डोर",
  "Transparent (Acrylic) Door": "पारदर्शी (एक्रेलिक) डोर",

  "Single Phase (SPN)": "सिंगल फेज़ (SPN)",
  "Three Phase (TPN)": "थ्री फेज़ (TPN)",

  "B22 (Pin Type)": "B22 (पिन टाइप)",
  "E27 (Screw Type)": "E27 (स्क्रू टाइप)",

  "Recessed / Concealed": "रिसेस्ड / कन्सील्ड",
  "Surface Mount": "सरफेस माउंट",
  "Surface": "सरफेस",
  "Fixed": "फिक्स्ड",
  "Swivel / Gimbal (Tilting)": "स्विवेल / जिम्बल (टिल्टिंग)",

  "Warm White": "वार्म व्हाइट",
  "Cool White": "कूल व्हाइट",
  "Natural White": "नेचुरल व्हाइट",
  "Neutral 4000K": "न्यूट्रल 4000K",
  "Cool Daylight 6500K": "कूल डे-लाइट 6500K",

  "B Curve": "B कर्व",
  "C Curve": "C कर्व",
  "D Curve": "D कर्व",

  "Type AC": "टाइप AC",
  "Type A": "टाइप A",

  "Plain Flat Washer": "प्लेन फ्लैट वॉशर",
  "Spring Washer": "स्प्रिंग वॉशर",
  "Star / Internal Tooth Washer": "स्टार / इंटरनल टूथ वॉशर",

  "Copper (CU)": "कॉपर (CU)",
  "Aluminium (ALU)": "एल्युमिनियम (ALU)",
  "Bimetallic (AL-CU)": "बाइमेटेलिक (AL-CU)",

  "Standard Ribbed PVC Plug": "स्टैंडर्ड रिब्ड पीवीसी प्लग",
  "Half Saddle (Open)": "हाफ सैडल (ओपन)",
  "Full Saddle (with Base)": "फुल सैडल (बेस के साथ)"
};


function translateText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);

  if (AppState.language === "en") {
    return text;
  }

  if (HI[text]) {
    return HI[text];
  }

  if (HI_VALUES[text]) {
    return HI_VALUES[text];
  }

  return text;
}


function labelText(value) {
  return translateText(value);
}


/* =========================================================
   DATA PARSER
   ---------------------------------------------------------
   Supports the exact MATERIALS structure:

   [
     stageName,
     stageName2,
     firstSectionName,
     firstSectionMaterials,
     ...sections
   ]

   Special first section:
   index 2 = section name
   index 3 = materials

   Remaining sections:
   [sectionName, materials]
   ========================================================= */

function getStages() {
  return MATERIALS_DATA;
}


function getStage(stageIndex) {
  return MATERIALS_DATA[stageIndex] || null;
}


function getStageName(stageIndex) {
  const stage = getStage(stageIndex);
  return stage ? stage[0] : "";
}


function getStageTitle(stageIndex) {
  const stage = getStage(stageIndex);
  return stage ? stage[1] : "";
}


function getSections(stageIndex) {
  const stage = getStage(stageIndex);

  if (!stage) {
    return [];
  }

  const sections = [];

  if (stage[2] && Array.isArray(stage[3])) {
    sections.push([
      stage[2],
      stage[3]
    ]);
  }

  for (let i = 4; i < stage.length; i++) {
    if (
      Array.isArray(stage[i]) &&
      typeof stage[i][0] === "string" &&
      Array.isArray(stage[i][1])
    ) {
      sections.push(stage[i]);
    }
  }

  return sections;
}


function getSection(stageIndex, sectionIndex) {
  return getSections(stageIndex)[sectionIndex] || null;
}


function getMaterials(stageIndex, sectionIndex) {
  const section = getSection(stageIndex, sectionIndex);

  if (!section) {
    return [];
  }

  return Array.isArray(section[1])
    ? section[1]
    : [];
}


function getMaterial(stageIndex, sectionIndex, materialIndex) {
  return getMaterials(
    stageIndex,
    sectionIndex
  )[materialIndex] || null;
}


function getMaterialName(material) {
  return material?.[0] || "";
}


function getMaterialFields(material) {
  return Array.isArray(material?.[1])
    ? material[1]
    : [];
}


function getMaterialUnits(material) {
  return Array.isArray(material?.[2])
    ? material[2]
    : [];
}


function getMaterialBrands(material) {
  return Array.isArray(material?.[3])
    ? material[3]
    : [];
}


/* =========================================================
   MATERIAL KEY
   ========================================================= */

function makeMaterialKey(
  stageIndex,
  sectionIndex,
  materialIndex
) {
  return [
    stageIndex,
    sectionIndex,
    materialIndex
  ].join("-");
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initApp() {
  loadState();
  normalizeState();
  bindEvents();
  applyTheme();
  applyLanguage();
  applyDisplaySettings();
  render();
  registerServiceWorker();
}


function loadState() {
  AppState.language =
    localStorage.getItem(
      STORAGE.language
    ) ||
    getConfigValue(
      "LANGUAGE_CONFIG.default",
      "hi"
    );

  AppState.theme =
    localStorage.getItem(
      STORAGE.theme
    ) ||
    getConfigValue(
      "THEME_CONFIG.default",
      "dark"
    );

  AppState.view =
    localStorage.getItem(
      STORAGE.materialView
    ) ||
    getConfigValue(
      "VIEW_CONFIG.default",
      "grid"
    );

  AppState.page =
    localStorage.getItem(
      STORAGE.currentPage
    ) ||
    localStorage.getItem(
      STORAGE.estimateRoute
    ) ||
    "home";

  AppState.stageIndex =
    readStorage(
      STORAGE.currentStage,
      null
    );

  AppState.sectionIndex =
    readStorage(
      STORAGE.currentSection,
      null
    );

  AppState.materialIndex =
    readStorage(
      STORAGE.currentMaterial,
      null
    );

  AppState.estimateItems =
    readStorage(
      STORAGE.estimateItems,
      []
    );

  AppState.draft =
    readStorage(
      STORAGE.draft,
      AppState.draft
    );

  AppState.filters =
    readStorage(
      STORAGE.filters,
      AppState.filters
    );

  AppState.display =
    readStorage(
      STORAGE.display,
      {}
    );
}


function getConfigValue(path, fallback) {
  try {
    const parts = path.split(".");
    let value = window;

    for (const part of parts) {
      value = value?.[part];
    }

    return value ?? fallback;
  } catch {
    return fallback;
  }
}


function normalizeState() {
  if (!["hi", "en"].includes(AppState.language)) {
    AppState.language = "hi";
  }

  if (!["dark", "light"].includes(AppState.theme)) {
    AppState.theme = "dark";
  }

  const validViews =
    Array.isArray(VIEW_CONFIG?.available)
      ? VIEW_CONFIG.available
      : [
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

  if (!validViews.includes(AppState.view)) {
    AppState.view = "grid";
  }

  if (
    ![
      "home",
      "stage",
      "section",
      "material",
      "editor",
      "estimate",
      "calculator",
      "settings"
    ].includes(AppState.page)
  ) {
    AppState.page = "home";
  }

  if (!Array.isArray(AppState.estimateItems)) {
    AppState.estimateItems = [];
  }

  if (
    typeof AppState.draft !== "object" ||
    AppState.draft === null
  ) {
    AppState.draft = {
      fields: {},
      quantity: "",
      unit: "",
      brand: "",
      price: ""
    };
  }

  AppState.display = {
    ...DEFAULT_DISPLAY,
    ...AppState.display
  };
}


/* =========================================================
   SAVE STATE
   ========================================================= */

function saveNavigation() {
  writeStorage(
    STORAGE.currentPage,
    AppState.page
  );

  writeStorage(
    STORAGE.estimateRoute,
    AppState.page
  );

  writeStorage(
    STORAGE.currentStage,
    AppState.stageIndex
  );

  writeStorage(
    STORAGE.currentSection,
    AppState.sectionIndex
  );

  writeStorage(
    STORAGE.currentMaterial,
    AppState.materialIndex
  );
}


function saveEstimate() {
  writeStorage(
    STORAGE.estimateItems,
    AppState.estimateItems
  );
}


function saveDraft() {
  writeStorage(
    STORAGE.draft,
    AppState.draft
  );
}


function saveFilters() {
  writeStorage(
    STORAGE.filters,
    AppState.filters
  );
}


function saveDisplay() {
  writeStorage(
    STORAGE.display,
    AppState.display
  );
}


/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {
  document.addEventListener(
    "click",
    handleDocumentClick
  );

  document.addEventListener(
    "input",
    handleDocumentInput
  );

  document.addEventListener(
    "change",
    handleDocumentChange
  );

  document.addEventListener(
    "keydown",
    handleKeyDown
  );

  window.addEventListener(
    "popstate",
    handleBrowserBack
  );

  window.addEventListener(
    "beforeunload",
    saveDraft
  );

  bindFormSubmit();
}


function bindFormSubmit() {
  document.addEventListener(
    "submit",
    event => {
      const form = event.target;

      if (
        form.matches(
          "#materialEditor form, [data-material-editor]"
        )
      ) {
        event.preventDefault();
        addOrUpdateEstimate();
      }
    }
  );
}


/* =========================================================
   CLICK HANDLER
   ========================================================= */

function handleDocumentClick(event) {
  const target =
    event.target.closest(
      "[data-action], [data-page], [data-view-mode], [data-language], [data-theme], [data-ui-toggle]"
    );

  if (!target) {
    return;
  }

  const action =
    target.dataset.action;

  if (action) {
    event.preventDefault();
    handleAction(action, target);
    return;
  }

  if (target.dataset.page) {
    event.preventDefault();
    navigateTo(
      target.dataset.page
    );
    return;
  }

  if (target.dataset.viewMode) {
    event.preventDefault();

    setViewMode(
      target.dataset.viewMode
    );

    return;
  }

  if (target.dataset.language) {
    event.preventDefault();

    setLanguage(
      target.dataset.language
    );

    return;
  }

  if (target.dataset.theme) {
    event.preventDefault();

    setTheme(
      target.dataset.theme
    );

    return;
  }

  if (target.dataset.uiToggle) {
    event.preventDefault();

    toggleDisplaySetting(
      target.dataset.uiToggle
    );
  }
}


function handleAction(action, target) {
  switch (action) {
    case "open-menu":
      openDrawer();
      break;

    case "close-menu":
    case "close-drawer":
      closeDrawer();
      break;

    case "toggle-menu":
      toggleDrawer();
      break;

    case "open-filter":
      toggleFilter();
      break;

    case "close-filter":
      closeFilter();
      break;

    case "reset-filter":
      resetFilters();
      break;

    case "clear-search":
      clearSearch();
      break;

    case "open-view-menu":
      toggleViewMenu();
      break;

    case "close-view-menu":
      closeViewMenu();
      break;

    case "select-stage":
      selectStage(
        Number(target.dataset.stage)
      );
      break;

    case "select-section":
      selectSection(
        Number(target.dataset.section)
      );
      break;

    case "select-material":
      selectMaterial(
        Number(target.dataset.material)
      );
      break;

    case "back":
      goBack();
      break;

    case "add-item":
      addOrUpdateEstimate();
      break;

    case "next-item":
      goNextMaterial();
      break;

    case "clear-item":
      clearEditor();
      break;

    case "edit-estimate":
      editEstimateItem(
        target.dataset.id
      );
      break;

    case "delete-estimate":
      deleteEstimateItem(
        target.dataset.id
      );
      break;

    case "duplicate-estimate":
      duplicateEstimateItem(
        target.dataset.id
      );
      break;

    case "reset-app":
      confirmReset();
      break;

    case "close-modal":
      closeModal();
      break;

    case "confirm-modal":
      executeModalConfirm();
      break;

    case "toggle-price":
      togglePriceField();
      break;

    case "calculate-power":
      calculatePower();
      break;

    case "calculate-current":
      calculateCurrent();
      break;

    case "calculate-voltage":
      calculateVoltage();
      break;

    case "calculate-inverter":
      calculateInverter();
      break;

    case "install-app":
      installPWA();
      break;

    case "go-home":
      navigateTo("home");
      break;

    case "go-estimate":
      navigateTo("estimate");
      break;

    case "go-calculator":
      navigateTo("calculator");
      break;

    case "go-settings":
      navigateTo("settings");
      break;

    default:
      break;
  }
}


/* =========================================================
   INPUT HANDLER
   ========================================================= */

function handleDocumentInput(event) {
  const input = event.target;

  if (
    input.matches(
      "#searchInput, [data-search-input]"
    )
  ) {
    AppState.search =
      input.value.trim();

    renderCurrentPage();
    return;
  }

  if (
    input.matches(
      "#quantityInput, [data-field='quantity']"
    )
  ) {
    AppState.draft.quantity =
      input.value;

    saveDraft();
    return;
  }

  if (
    input.matches(
      "#priceInput, [data-field='price']"
    )
  ) {
    AppState.draft.price =
      input.value;

    saveDraft();
    return;
  }

  if (
    input.matches(
      "[data-dynamic-field]"
    )
  ) {
    const fieldName =
      input.dataset.dynamicField;

    AppState.draft.fields[fieldName] =
      input.value;

    saveDraft();
  }
}


/* =========================================================
   CHANGE HANDLER
   ========================================================= */

function handleDocumentChange(event) {
  const input = event.target;

  if (
    input.matches(
      "#unitSelect, [data-field='unit']"
    )
  ) {
    AppState.draft.unit =
      input.value;

    writeStorage(
      STORAGE.lastUnit,
      input.value
    );

    saveDraft();

    return;
  }

  if (
    input.matches(
      "#brandSelect, [data-field='brand']"
    )
  ) {
    AppState.draft.brand =
      input.value;

    saveDraft();

    return;
  }

  if (
    input.matches(
      "[data-dynamic-field]"
    )
  ) {
    const fieldName =
      input.dataset.dynamicField;

    AppState.draft.fields[fieldName] =
      input.value;

    saveDraft();
  }
}


/* =========================================================
   KEYBOARD
   ========================================================= */

function handleKeyDown(event) {
  if (event.key === "Escape") {
    if (AppState.drawerOpen) {
      closeDrawer();
      return;
    }

    if (AppState.filterOpen) {
      closeFilter();
      return;
    }

    if (AppState.viewMenuOpen) {
      closeViewMenu();
      return;
    }

    if (isModalOpen()) {
      closeModal();
    }
  }
}


/* =========================================================
   ANDROID / BROWSER BACK
   ========================================================= */

function handleBrowserBack() {
  if (AppState.drawerOpen) {
    closeDrawer();
    return;
  }

  if (AppState.filterOpen) {
    closeFilter();
    return;
  }

  if (AppState.viewMenuOpen) {
    closeViewMenu();
    return;
  }

  goBack(false);
}


/* =========================================================
   DRAWER
   ========================================================= */

function openDrawer() {
  AppState.drawerOpen = true;

  const drawer =
    $("#appDrawer");

  const backdrop =
    $("#drawerBackdrop");

  if (drawer) {
    drawer.classList.add("open");
    drawer.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  if (backdrop) {
    backdrop.classList.add("open");
    backdrop.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  document.body.classList.add(
    "drawer-open"
  );
}


function closeDrawer() {
  AppState.drawerOpen = false;

  const drawer =
    $("#appDrawer");

  const backdrop =
    $("#drawerBackdrop");

  if (drawer) {
    drawer.classList.remove("open");
    drawer.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  if (backdrop) {
    backdrop.classList.remove("open");
    backdrop.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  document.body.classList.remove(
    "drawer-open"
  );
}


function toggleDrawer() {
  if (AppState.drawerOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}


/* =========================================================
   FILTER
   ========================================================= */

function toggleFilter() {
  AppState.filterOpen =
    !AppState.filterOpen;

  const panel =
    $("#filterPanel");

  if (panel) {
    panel.classList.toggle(
      "open",
      AppState.filterOpen
    );

    panel.setAttribute(
      "aria-hidden",
      String(!AppState.filterOpen)
    );
  }

  if (AppState.filterOpen) {
    renderFilterPanel();
  }
}


function closeFilter() {
  AppState.filterOpen = false;

  const panel =
    $("#filterPanel");

  if (panel) {
    panel.classList.remove("open");
    panel.setAttribute(
      "aria-hidden",
      "true"
    );
  }
}


function resetFilters() {
  AppState.filters = {
    stage: "",
    section: "",
    brand: "",
    unit: "",
    option: ""
  };

  AppState.search = "";

  const search =
    $("#searchInput");

  if (search) {
    search.value = "";
  }

  saveFilters();
  renderCurrentPage();

  toast(
    "Filter reset",
    "info"
  );
}


function renderFilterPanel() {
  const container =
    $("#filterContent");

  if (!container) {
    return;
  }

  const stageOptions =
    getStages().map(
      (stage, index) => ({
        value: String(index),
        label: translateText(stage[0])
      })
    );

  const sections = [];

  getStages().forEach(
    (stage, stageIndex) => {
      getSections(stageIndex).forEach(
        section => {
          if (
            !sections.some(
              item =>
                item.value ===
                `${stageIndex}:${section[0]}`
            )
          ) {
            sections.push({
              value:
                `${stageIndex}:${section[0]}`,
              label:
                `${translateText(stage[0])} / ${translateText(section[0])}`
            });
          }
        }
      );
    }
  );

  const brands = [];
  const units = [];

  getStages().forEach(
    (stage, stageIndex) => {
      getSections(stageIndex).forEach(
        section => {
          section[1].forEach(
            material => {
              getMaterialUnits(
                material
              ).forEach(
                unit => {
                  if (
                    unit &&
                    !units.includes(unit)
                  ) {
                    units.push(unit);
                  }
                }
              );

              getMaterialBrands(
                material
              ).forEach(
                brand => {
                  if (
                    brand &&
                    !brands.includes(brand)
                  ) {
                    brands.push(brand);
                  }
                }
              );
            }
          );
        }
      );
    }
  );

  container.innerHTML = `
    <div class="filter-grid">

      <label class="filter-field">
        <span>${labelText("Stage")}</span>
        <select data-filter="stage">
          <option value="">${labelText("All")}</option>
          ${stageOptions.map(option => `
            <option
              value="${escapeHTML(option.value)}"
              ${String(AppState.filters.stage) === option.value ? "selected" : ""}
            >
              ${escapeHTML(option.label)}
            </option>
          `).join("")}
        </select>
      </label>

      <label class="filter-field">
        <span>${labelText("Section")}</span>
        <select data-filter="section">
          <option value="">${labelText("All")}</option>
          ${sections.map(option => `
            <option
              value="${escapeHTML(option.value)}"
              ${AppState.filters.section === option.value ? "selected" : ""}
            >
              ${escapeHTML(option.label)}
            </option>
          `).join("")}
        </select>
      </label>

      <label class="filter-field">
        <span>${labelText("Brand")}</span>
        <select data-filter="brand">
          <option value="">${labelText("All")}</option>
          ${brands.map(brand => `
            <option
              value="${escapeHTML(brand)}"
              ${AppState.filters.brand === brand ? "selected" : ""}
            >
              ${escapeHTML(
                AppState.language === "hi"
                  ? brand
                  : brand
              )}
            </option>
          `).join("")}
        </select>
      </label>

      <label class="filter-field">
        <span>${labelText("Unit")}</span>
        <select data-filter="unit">
          <option value="">${labelText("All")}</option>
          ${units.map(unit => `
            <option
              value="${escapeHTML(unit)}"
              ${AppState.filters.unit === unit ? "selected" : ""}
            >
              ${escapeHTML(unit)}
            </option>
          `).join("")}
        </select>
      </label>

      <button
        type="button"
        class="filter-reset"
        data-action="reset-filter"
      >
        ${labelText("Reset Filter")}
      </button>

    </div>
  `;

  $$("[data-filter]", container)
    .forEach(select => {
      select.addEventListener(
        "change",
        () => {
          AppState.filters[
            select.dataset.filter
          ] = select.value;

          saveFilters();
          renderCurrentPage();
        }
      );
    });
}


/* =========================================================
   VIEW MODE
   ========================================================= */

function toggleViewMenu() {
  AppState.viewMenuOpen =
    !AppState.viewMenuOpen;

  const menu =
    $("#viewModeMenu");

  if (menu) {
    menu.classList.toggle(
      "open",
      AppState.viewMenuOpen
    );
  }
}


function closeViewMenu() {
  AppState.viewMenuOpen = false;

  const menu =
    $("#viewModeMenu");

  if (menu) {
    menu.classList.remove("open");
  }
}


function setViewMode(view) {
  AppState.view = view;

  writeStorage(
    STORAGE.materialView,
    view
  );

  writeStorage(
    STORAGE.stageView,
    view
  );

  closeViewMenu();

  renderCurrentPage();
}


/* =========================================================
   LANGUAGE
   ========================================================= */

function setLanguage(language) {
  if (
    !["hi", "en"].includes(language)
  ) {
    return;
  }

  AppState.language =
    language;

  localStorage.setItem(
    STORAGE.language,
    language
  );

  applyLanguage();
  render();
}


function applyLanguage() {
  document.documentElement.lang =
    AppState.language === "hi"
      ? "hi"
      : "en";

  $$("[data-language]")
    .forEach(element => {
      element.classList.toggle(
        "active",
        element.dataset.language ===
          AppState.language
      );
    });

  /*
   * Existing static bilingual elements.
   *
   * [data-lang="hi"]
   * [data-lang="en"]
   */
  $$("[data-lang]")
    .forEach(element => {
      const show =
        element.dataset.lang ===
        AppState.language;

      element.hidden = !show;
      element.setAttribute(
        "aria-hidden",
        String(!show)
      );
    });

  /*
   * If HTML contains translatable
   * data-text attributes.
   */
  $$("[data-text]").forEach(
    element => {
      element.textContent =
        translateText(
          element.dataset.text
        );
    }
  );
}


/* =========================================================
   THEME
   ========================================================= */

function setTheme(theme) {
  if (
    !["dark", "light"].includes(theme)
  ) {
    return;
  }

  AppState.theme = theme;

  localStorage.setItem(
    STORAGE.theme,
    theme
  );

  applyTheme();
}


function applyTheme() {
  document.documentElement.dataset.theme =
    AppState.theme;

  document.body.dataset.theme =
    AppState.theme;

  $$("[data-theme]")
    .forEach(element => {
      element.classList.toggle(
        "active",
        element.dataset.theme ===
          AppState.theme
      );
    });
}


/* =========================================================
   DISPLAY SETTINGS
   ========================================================= */

function toggleDisplaySetting(key) {
  if (!(key in AppState.display)) {
    AppState.display[key] = true;
  }

  AppState.display[key] =
    !AppState.display[key];

  saveDisplay();
  applyDisplaySettings();
  render();
}


function applyDisplaySettings() {
  Object.entries(
    AppState.display
  ).forEach(
    ([key, visible]) => {
      $$(`[data-ui="${key}"]`)
        .forEach(element => {
          element.hidden =
            !visible;
        });
    }
  );
}


/* =========================================================
   ROUTING
   ========================================================= */

function navigateTo(
  page,
  options = {}
) {
  if (
    ![
      "home",
      "stage",
      "section",
      "material",
      "editor",
      "estimate",
      "calculator",
      "settings"
    ].includes(page)
  ) {
    return;
  }

  AppState.page = page;

  if (!options.keepSelection) {
    if (page === "home") {
      AppState.stageIndex = null;
      AppState.sectionIndex = null;
      AppState.materialIndex = null;
    }
  }

  closeDrawer();
  closeFilter();
  closeViewMenu();

  saveNavigation();

  render();

  if (options.history !== false) {
    try {
      history.pushState(
        {
          page
        },
        "",
        `#${page}`
      );
    } catch {
      /* Ignore history errors. */
    }
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function selectStage(stageIndex) {
  if (!getStage(stageIndex)) {
    return;
  }

  AppState.stageIndex =
    stageIndex;

  AppState.sectionIndex = null;
  AppState.materialIndex = null;

  saveNavigation();

  navigateTo(
    "section",
    {
      keepSelection: true
    }
  );
}


function selectSection(sectionIndex) {
  if (
    AppState.stageIndex === null ||
    !getSection(
      AppState.stageIndex,
      sectionIndex
    )
  ) {
    return;
  }

  AppState.sectionIndex =
    sectionIndex;

  AppState.materialIndex = null;

  saveNavigation();

  navigateTo(
    "material",
    {
      keepSelection: true
    }
  );
}


function selectMaterial(materialIndex) {
  if (
    AppState.stageIndex === null ||
    AppState.sectionIndex === null
  ) {
    return;
  }

  const material =
    getMaterial(
      AppState.stageIndex,
      AppState.sectionIndex,
      materialIndex
    );

  if (!material) {
    return;
  }

  AppState.materialIndex =
    materialIndex;

  AppState.currentMaterial =
    material;

  AppState.currentMaterialKey =
    makeMaterialKey(
      AppState.stageIndex,
      AppState.sectionIndex,
      materialIndex
    );

  loadMaterialIntoDraft(
    material
  );

  saveNavigation();

  navigateTo(
    "editor",
    {
      keepSelection: true
    }
  );
}


/* =========================================================
   BACK NAVIGATION
   ========================================================= */

function goBack(useHistory = true) {
  if (AppState.page === "editor") {
    AppState.page = "material";

  } else if (AppState.page === "material") {
    AppState.page = "section";

  } else if (AppState.page === "section") {
    AppState.page = "stage";

  } else if (AppState.page === "stage") {
    AppState.page = "home";

  } else if (
    AppState.page === "estimate" ||
    AppState.page === "calculator" ||
    AppState.page === "settings"
  ) {
    AppState.page = "home";

  } else {
    AppState.page = "home";
  }

  saveNavigation();
  render();

  if (useHistory) {
    try {
      history.pushState(
        {
          page: AppState.page
        },
        "",
        `#${AppState.page}`
      );
    } catch {
      /* Ignore. */
    }
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   MATERIAL DRAFT
   ========================================================= */

function loadMaterialIntoDraft(
  material
) {
  const previousUnit =
    readStorage(
      STORAGE.lastUnit,
      ""
    );

  const previousDraft =
    AppState.draft || {};

  AppState.draft = {
    fields: {},
    quantity: "",
    unit:
      previousDraft.unit ||
      previousUnit ||
      "",
    brand: "",
    price: ""
  };

  getMaterialFields(
    material
  ).forEach(
    field => {
      const fieldName =
        field?.[0];

      if (fieldName) {
        AppState.draft.fields[
          fieldName
        ] = "";
      }
    }
  );

  saveDraft();
}


function clearEditor() {
  if (!AppState.currentMaterial) {
    return;
  }

  const unit =
    AppState.draft.unit ||
    readStorage(
      STORAGE.lastUnit,
      ""
    );

  AppState.draft = {
    fields: {},
    quantity: "",
    unit,
    brand: "",
    price: ""
  };

  getMaterialFields(
    AppState.currentMaterial
  ).forEach(
    field => {
      const fieldName =
        field?.[0];

      if (fieldName) {
        AppState.draft.fields[
          fieldName
        ] = "";
      }
    }
  );

  saveDraft();

  renderEditor();

  toast(
    "Item cleared",
    "info"
  );
}


/* =========================================================
   EDITOR
   ========================================================= */

function renderEditor() {
  const editor =
    $("#materialEditor");

  if (!editor) {
    return;
  }

  const material =
    AppState.currentMaterial;

  if (!material) {
    editor.innerHTML = emptyState(
      "Material"
    );
    return;
  }

  const materialName =
    getMaterialName(material);

  const fields =
    getMaterialFields(material);

  const units =
    getMaterialUnits(material);

  const brands =
    getMaterialBrands(material);

  const editing =
    AppState.editingEstimateId !== null;

  const fieldHTML =
    fields.map(
      field =>
        renderDynamicField(field)
    ).join("");

  editor.innerHTML = `
    <div class="editor-card">

      <div class="editor-head">

        <button
          type="button"
          class="back-button"
          data-action="back"
          aria-label="${labelText("Back")}"
        >
          <span aria-hidden="true">←</span>
          <span>${labelText("Back")}</span>
        </button>

        <div class="editor-title-wrap">
          <span class="editor-stage">
            ${escapeHTML(
              translateText(
                getStageName(
                  AppState.stageIndex
                )
              )
            )}
          </span>

          <h2 class="editor-title">
            ${escapeHTML(
              translateText(
                materialName
              )
            )}
          </h2>
        </div>

      </div>

      <div
        id="dynamicFields"
        class="dynamic-fields"
      >
        ${fieldHTML}
      </div>

      <div class="editor-basic-fields">

        <label class="form-field required-field">
          <span>
            ${labelText("Quantity")}
            <b aria-hidden="true">*</b>
          </span>

          <input
            id="quantityInput"
            data-field="quantity"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
            autocomplete="off"
            value="${escapeHTML(
              AppState.draft.quantity
            )}"
            placeholder="${escapeHTML(
              labelText("Quantity")
            )}"
            required
          >
        </label>

        <label class="form-field">
          <span>${labelText("Unit")}</span>

          <select
            id="unitSelect"
            data-field="unit"
          >
            <option value="">
              ${labelText("Select unit")}
            </option>

            ${units.map(unit => `
              <option
                value="${escapeHTML(unit)}"
                ${
                  AppState.draft.unit === unit
                    ? "selected"
                    : ""
                }
              >
                ${escapeHTML(unit)}
              </option>
            `).join("")}
          </select>
        </label>

        ${
          AppState.display.brandField !== false
            ? `
              <label class="form-field">
                <span>${labelText("Brand")}</span>

                <select
                  id="brandSelect"
                  data-field="brand"
                >
                  <option value="">
                    ${labelText("Optional")}
                  </option>

                  ${brands.map(brand => `
                    <option
                      value="${escapeHTML(brand)}"
                      ${
                        AppState.draft.brand === brand
                          ? "selected"
                          : ""
                      }
                    >
                      ${escapeHTML(brand)}
                    </option>
                  `).join("")}
                </select>
              </label>
            `
            : ""
        }

        ${
          AppState.display.price
            ? `
              <label
                class="form-field"
                id="priceField"
              >
                <span>${labelText("Price")}</span>

                <input
                  id="priceInput"
                  data-field="price"
                  type="number"
                  min="0"
                  step="any"
                  inputmode="decimal"
                  value="${escapeHTML(
                    AppState.draft.price
                  )}"
                >
              </label>
            `
            : ""
        }

      </div>

      <div class="editor-actions">

        ${
          editing
            ? `
              <button
                type="button"
                class="primary-button"
                data-action="add-item"
              >
                ${labelText("Update")}
              </button>
            `
            : `
              <button
                type="button"
                class="primary-button"
                data-action="add-item"
              >
                ${labelText("Add Item")}
              </button>
            `
        }

        ${
          AppState.display.nextItem !== false
            ? `
              <button
                type="button"
                class="secondary-button"
                data-action="next-item"
              >
                ${labelText("Next")}
              </button>
            `
            : ""
        }

        <button
          type="button"
          class="ghost-button"
          data-action="clear-item"
        >
          ${labelText("Clear")}
        </button>

      </div>

    </div>
  `;

  applyDisplaySettings();
}


function renderDynamicField(field) {
  if (!Array.isArray(field)) {
    return "";
  }

  const name =
    field[0] || "";

  const options =
    Array.isArray(field[1])
      ? field[1]
      : [];

  const currentValue =
    AppState.draft.fields?.[name] ||
    "";

  /*
   * "User Input" options become
   * editable inputs instead of selects.
   */
  const hasUserInput =
    options.some(
      option =>
        String(option)
          .toLowerCase()
          .includes("user input")
    );

  if (hasUserInput) {
    return `
      <label class="form-field">
        <span>
          ${escapeHTML(
            labelText(name)
          )}
        </span>

        <input
          type="text"
          data-dynamic-field="${escapeHTML(name)}"
          value="${escapeHTML(currentValue)}"
          placeholder="${escapeHTML(
            labelText(
              options[0] || ""
            )
          )}"
          autocomplete="off"
        >
      </label>
    `;
  }

  return `
    <label class="form-field">

      <span>
        ${escapeHTML(
          labelText(name)
        )}
      </span>

      <select
        data-dynamic-field="${escapeHTML(name)}"
      >
        <option value="">
          ${labelText("Optional")}
        </option>

        ${options.map(option => `
          <option
            value="${escapeHTML(option)}"
            ${
              currentValue === option
                ? "selected"
                : ""
            }
          >
            ${escapeHTML(
              translateText(option)
            )}
          </option>
        `).join("")}
      </select>

    </label>
  `;
}


/* =========================================================
   ADD / UPDATE ESTIMATE
   ========================================================= */

function addOrUpdateEstimate() {
  const material =
    AppState.currentMaterial;

  if (!material) {
    return;
  }

  const quantity =
    String(
      AppState.draft.quantity ?? ""
    ).trim();

  if (
    quantity === "" ||
    Number(quantity) <= 0
  ) {
    toast(
      "Quantity is required",
      "error"
    );

    focusElement(
      "#quantityInput"
    );

    return;
  }

  const item =
    createEstimateItem(
      material,
      quantity
    );

  if (
    AppState.editingEstimateId !== null
  ) {
    const index =
      AppState.estimateItems.findIndex(
        existing =>
          existing.id ===
          AppState.editingEstimateId
      );

    if (index !== -1) {
      AppState.estimateItems[index] =
        {
          ...AppState.estimateItems[index],
          ...item,
          id:
            AppState.editingEstimateId,
          updatedAt:
            Date.now()
        };
    }

    AppState.editingEstimateId =
      null;

    saveEstimate();

    toast(
      "Updated successfully",
      "success"
    );

  } else {
    AppState.estimateItems.push(
      item
    );

    saveEstimate();

    toast(
      "Added successfully",
      "success"
    );
  }

  /*
   * Unit carries forward.
   */
  if (item.unit) {
    writeStorage(
      STORAGE.lastUnit,
      item.unit
    );
  }

  /*
   * Do not auto-add on Next.
   */
  AppState.draft = {
    fields: {},
    quantity: "",
    unit:
      item.unit ||
      readStorage(
        STORAGE.lastUnit,
        ""
      ),
    brand: "",
    price: ""
  };

  saveDraft();

  updateEstimateBadge();

  /*
   * After adding, move to the
   * next material automatically.
   */
  goNextMaterial();
}


function createEstimateItem(
  material,
  quantity
) {
  const fields = {};

  getMaterialFields(
    material
  ).forEach(
    field => {
      const fieldName =
        field?.[0];

      if (
        fieldName &&
        AppState.draft.fields &&
        AppState.draft.fields[
          fieldName
        ] !== undefined &&
        AppState.draft.fields[
          fieldName
        ] !== ""
      ) {
        fields[fieldName] =
          AppState.draft.fields[
            fieldName
          ];
      }
    }
  );

  return {
    id:
      AppState.editingEstimateId ||
      createId(),

    stageIndex:
      AppState.stageIndex,

    sectionIndex:
      AppState.sectionIndex,

    materialIndex:
      AppState.materialIndex,

    stage:
      getStageName(
        AppState.stageIndex
      ),

    stageTitle:
      getStageTitle(
        AppState.stageIndex
      ),

    section:
      getSection(
        AppState.stageIndex,
        AppState.sectionIndex
      )?.[0] || "",

    material:
      getMaterialName(material),

    fields,

    quantity,

    unit:
      AppState.draft.unit || "",

    brand:
      AppState.draft.brand || "",

    price:
      AppState.draft.price || "",

    createdAt:
      Date.now(),

    updatedAt:
      Date.now()
  };
}


function createId() {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}


/* =========================================================
   NEXT MATERIAL
   ========================================================= */

function goNextMaterial() {
  if (
    AppState.stageIndex === null ||
    AppState.sectionIndex === null
  ) {
    return;
  }

  const materials =
    getMaterials(
      AppState.stageIndex,
      AppState.sectionIndex
    );

  const nextIndex =
    Number(AppState.materialIndex) + 1;

  if (
    nextIndex <
    materials.length
  ) {
    AppState.materialIndex =
      nextIndex;

    AppState.currentMaterial =
      materials[nextIndex];

    AppState.currentMaterialKey =
      makeMaterialKey(
        AppState.stageIndex,
        AppState.sectionIndex,
        nextIndex
      );

    loadMaterialIntoDraft(
      AppState.currentMaterial
    );

    saveNavigation();

    navigateTo(
      "editor",
      {
        keepSelection: true
      }
    );

    return;
  }

  /*
   * Current section finished.
   * Move to next section.
   */
  const sections =
    getSections(
      AppState.stageIndex
    );

  const nextSection =
    Number(AppState.sectionIndex) + 1;

  if (
    nextSection <
    sections.length
  ) {
    AppState.sectionIndex =
      nextSection;

    AppState.materialIndex =
      0;

    AppState.currentMaterial =
      getMaterial(
        AppState.stageIndex,
        nextSection,
        0
      );

    loadMaterialIntoDraft(
      AppState.currentMaterial
    );

    saveNavigation();

    navigateTo(
      "editor",
      {
        keepSelection: true
      }
    );

    return;
  }

  /*
   * Current stage finished.
   * Move to next stage.
   */
  const nextStage =
    Number(AppState.stageIndex) + 1;

  if (
    nextStage <
    getStages().length
  ) {
    AppState.stageIndex =
      nextStage;

    AppState.sectionIndex =
      0;

    AppState.materialIndex =
      0;

    AppState.currentMaterial =
      getMaterial(
        nextStage,
        0,
        0
      );

    loadMaterialIntoDraft(
      AppState.currentMaterial
    );

    saveNavigation();

    navigateTo(
      "editor",
      {
        keepSelection: true
      }
    );

    return;
  }

  /*
   * Everything completed.
   */
  toast(
    AppState.language === "hi"
      ? "सभी सामग्री पूरी हो गई"
      : "All materials completed",
    "success"
  );
}


/* =========================================================
   ESTIMATE LIST
   ========================================================= */

function renderEstimate() {
  const list =
    $("#estimateList");

  if (!list) {
    return;
  }

  const items =
    AppState.estimateItems;

  if (!items.length) {
    list.innerHTML =
      emptyState(
        "No estimate items"
      );

    updateEstimateSummary();
    return;
  }

  list.innerHTML =
    items.map(
      (item, index) =>
        renderEstimateItem(
          item,
          index
        )
    ).join("");

  updateEstimateSummary();
}


function renderEstimateItem(
  item,
  index
) {
  const materialName =
    translateText(
      item.material
    );

  const fields =
    Object.entries(
      item.fields || {}
    )
    .filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    );

  const price =
    item.price !== ""
      ? Number(item.price) || 0
      : 0;

  const quantity =
    Number(item.quantity) || 0;

  const total =
    price > 0
      ? quantity * price
      : null;

  return `
    <article
      class="
        estimate-card
        view-${escapeHTML(
          AppState.view
        )}
      "
      data-estimate-id="${escapeHTML(
        item.id
      )}"
    >

      ${
        AppState.display.itemNumber !== false
          ? `
            <div class="estimate-number">
              ${index + 1}
            </div>
          `
          : ""
      }

      <div class="estimate-content">

        ${
          AppState.display.materialName !== false
            ? `
              <h3>
                ${escapeHTML(
                  materialName
                )}
              </h3>
            `
            : ""
        }

        <div class="estimate-meta">

          ${
            AppState.display.quantity !== false
              ? `
                <span>
                  <b>${labelText("Quantity")}:</b>
                  ${escapeHTML(item.quantity)}
                </span>
              `
              : ""
          }

          ${
            AppState.display.unit !== false
              ? `
                <span>
                  <b>${labelText("Unit")}:</b>
                  ${escapeHTML(item.unit || "—")}
                </span>
              `
              : ""
          }

          ${
            AppState.display.brand !== false &&
            item.brand
              ? `
                <span>
                  <b>${labelText("Brand")}:</b>
                  ${escapeHTML(item.brand)}
                </span>
              `
              : ""
          }

        </div>

        ${
          fields.length
            ? `
              <div class="estimate-fields">
                ${fields.map(
                  ([key, value]) => `
                    <span>
                      <b>
                        ${escapeHTML(
                          labelText(key)
                        )}:
                      </b>
                      ${escapeHTML(
                        translateText(value)
                      )}
                    </span>
                  `
                ).join("")}
              </div>
            `
            : ""
        }

        ${
          AppState.display.total !== false &&
          total !== null
            ? `
              <div class="estimate-total">
                <b>${labelText("Total")}:</b>
                ₹${formatNumber(total)}
              </div>
            `
            : ""
        }

      </div>

      <div class="estimate-actions">

        ${
          AppState.display.editButton !== false
            ? `
              <button
                type="button"
                data-action="edit-estimate"
                data-id="${escapeHTML(item.id)}"
                aria-label="${labelText("Edit")}"
              >
                ✎
              </button>
            `
            : ""
        }

        ${
          AppState.display.deleteButton !== false
            ? `
              <button
                type="button"
                data-action="delete-estimate"
                data-id="${escapeHTML(item.id)}"
                aria-label="${labelText("Delete")}"
              >
                ×
              </button>
            `
            : ""
        }

      </div>

    </article>
  `;
}


function updateEstimateSummary() {
  const count =
    $("#estimateItemCount");

  const total =
    $("#estimateTotal");

  const items =
    AppState.estimateItems;

  if (count) {
    count.textContent =
      String(items.length);
  }

  if (total) {
    let amount = 0;

    items.forEach(item => {
      const price =
        Number(item.price);

      const quantity =
        Number(item.quantity);

      if (
        Number.isFinite(price) &&
        Number.isFinite(quantity) &&
        price > 0
      ) {
        amount +=
          price * quantity;
      }
    });

    total.textContent =
      `₹${formatNumber(amount)}`;
  }
}


function updateEstimateBadge() {
  const badge =
    $("[data-estimate-badge]");

  if (badge) {
    badge.textContent =
      String(
        AppState.estimateItems.length
      );

    badge.hidden =
      AppState.estimateItems.length ===
      0;
  }

  updateEstimateSummary();
}


/* =========================================================
   EDIT ESTIMATE
   ========================================================= */

function editEstimateItem(id) {
  const item =
    AppState.estimateItems.find(
      estimate =>
        String(estimate.id) ===
        String(id)
    );

  if (!item) {
    return;
  }

  const material =
    getMaterial(
      item.stageIndex,
      item.sectionIndex,
      item.materialIndex
    );

  if (!material) {
    toast(
      AppState.language === "hi"
        ? "सामग्री उपलब्ध नहीं है"
        : "Material is unavailable",
      "error"
    );

    return;
  }

  AppState.stageIndex =
    item.stageIndex;

  AppState.sectionIndex =
    item.sectionIndex;

  AppState.materialIndex =
    item.materialIndex;

  AppState.currentMaterial =
    material;

  AppState.currentMaterialKey =
    makeMaterialKey(
      item.stageIndex,
      item.sectionIndex,
      item.materialIndex
    );

  AppState.editingEstimateId =
    item.id;

  AppState.draft = {
    fields: {
      ...(item.fields || {})
    },

    quantity:
      item.quantity || "",

    unit:
      item.unit || "",

    brand:
      item.brand || "",

    price:
      item.price || ""
  };

  saveDraft();
  saveNavigation();

  navigateTo(
    "editor",
    {
      keepSelection: true
    }
  );
}


/* =========================================================
   DELETE ESTIMATE ITEM
   ========================================================= */

function deleteEstimateItem(id) {
  const index =
    AppState.estimateItems.findIndex(
      item =>
        String(item.id) ===
        String(id)
    );

  if (index === -1) {
    return;
  }

  AppState.estimateItems.splice(
    index,
    1
  );

  saveEstimate();
  updateEstimateBadge();
  renderEstimate();

  toast(
    "Item deleted",
    "success"
  );
}


/* =========================================================
   DUPLICATE ESTIMATE ITEM
   ========================================================= */

function duplicateEstimateItem(id) {
  const original =
    AppState.estimateItems.find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!original) {
    return;
  }

  const duplicate = {
    ...original,
    id: createId(),
    fields: {
      ...(original.fields || {})
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const index =
    AppState.estimateItems.indexOf(
      original
    );

  AppState.estimateItems.splice(
    index + 1,
    0,
    duplicate
  );

  saveEstimate();
  updateEstimateBadge();
  renderEstimate();

  toast(
    "Item duplicated",
    "success"
  );
}


/* =========================================================
   SEARCH
   ========================================================= */

function clearSearch() {
  AppState.search = "";

  const input =
    $("#searchInput");

  if (input) {
    input.value = "";
    input.focus();
  }

  renderCurrentPage();
}


function getSearchableMaterialText(
  stageIndex,
  sectionIndex,
  materialIndex
) {
  const stage =
    getStage(stageIndex);

  const section =
    getSection(
      stageIndex,
      sectionIndex
    );

  const material =
    getMaterial(
      stageIndex,
      sectionIndex,
      materialIndex
    );

  if (!material) {
    return "";
  }

  const parts = [
    stage?.[0],
    stage?.[1],
    section?.[0],
    material?.[0]
  ];

  getMaterialFields(
    material
  ).forEach(
    field => {
      parts.push(field?.[0]);

      if (Array.isArray(field?.[1])) {
        parts.push(
          ...field[1]
        );
      }
    }
  );

  getMaterialUnits(
    material
  ).forEach(
    unit => parts.push(unit)
  );

  getMaterialBrands(
    material
  ).forEach(
    brand => parts.push(brand)
  );

  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}


function matchesSearch(
  stageIndex,
  sectionIndex,
  materialIndex
) {
  const search =
    AppState.search
      .trim()
      .toLowerCase();

  if (!search) {
    return true;
  }

  return getSearchableMaterialText(
    stageIndex,
    sectionIndex,
    materialIndex
  ).includes(search);
}


function matchesFilters(
  stageIndex,
  sectionIndex,
  materialIndex
) {
  const filters =
    AppState.filters;

  const stage =
    getStage(stageIndex);

  const section =
    getSection(
      stageIndex,
      sectionIndex
    );

  const material =
    getMaterial(
      stageIndex,
      sectionIndex,
      materialIndex
    );

  if (!stage || !section || !material) {
    return false;
  }

  if (
    filters.stage !== "" &&
    String(stageIndex) !==
      String(filters.stage)
  ) {
    return false;
  }

  if (
    filters.section !== ""
  ) {
    const expected =
      `${stageIndex}:${section[0]}`;

    if (
      expected !==
      filters.section
    ) {
      return false;
    }
  }

  if (
    filters.brand !== "" &&
    !getMaterialBrands(
      material
    ).includes(
      filters.brand
    )
  ) {
    return false;
  }

  if (
    filters.unit !== "" &&
    !getMaterialUnits(
      material
    ).includes(
      filters.unit
    )
  ) {
    return false;
  }

  return true;
}


/* =========================================================
   RENDER ROOT
   ========================================================= */

function render() {
  applyLanguage();
  applyTheme();

  renderCurrentPage();

  renderSearchVisibility();
  renderBottomNavigation();
  renderHeader();
  updateEstimateBadge();
  applyDisplaySettings();
}


function renderCurrentPage() {
  const pages = {
    home: renderHome,
    stage: renderStages,
    section: renderSections,
    material: renderMaterials,
    editor: renderEditor,
    estimate: renderEstimate,
    calculator: renderCalculator,
    settings: renderSettings
  };

  const renderer =
    pages[AppState.page] ||
    renderHome;

  renderer();

  showOnlyPage(
    AppState.page
  );

  updatePageHeading();
}


function showOnlyPage(page) {
  const pageMap = {
    home: "#homePage",
    stage: "#stagePage",
    section: "#sectionPage",
    material: "#materialPage",
    editor: "#editorPage",
    estimate: "#estimatePage",
    calculator: "#calculatorPage",
    settings: "#settingsPage"
  };

  Object.entries(
    pageMap
  ).forEach(
    ([name, selector]) => {
      const element =
        $(selector);

      if (!element) {
        return;
      }

      const visible =
        name === page;

      element.hidden =
        !visible;

      element.classList.toggle(
        "active",
        visible
      );
    }
  );
}


/* =========================================================
   HEADER
   ========================================================= */

function renderHeader() {
  const title =
    $("#appTitle");

  if (title) {
    title.textContent =
      labelText(
        "Estimate List"
      );
  }

  const brand =
    $("#brandName");

  if (brand) {
    brand.textContent =
      BRAND_CONFIG?.name ||
      "Sandeep ElectroFix";
  }

  const tagline =
    $("#brandTagline");

  if (tagline) {
    tagline.textContent =
      BRAND_CONFIG?.tagline ||
      "Powering Your Trust";
  }

  const logo =
    $("#brandLogo");

  if (
    logo &&
    BRAND_CONFIG?.logo
  ) {
    logo.src =
      BRAND_CONFIG.logo;

    logo.alt =
      BRAND_CONFIG.name ||
      "Sandeep ElectroFix";
  }
}


function updatePageHeading() {
  const heading =
    $("[data-page-heading]");

  if (!heading) {
    return;
  }

  const headings = {
    home: "Estimate List",
    stage: "Stage",
    section: "Section",
    material: "Material",
    editor: "Editor",
    estimate: "Estimate",
    calculator: "Calculator",
    settings: "Settings"
  };

  heading.textContent =
    labelText(
      headings[AppState.page] ||
      "Estimate List"
    );
}


/* =========================================================
   SEARCH VISIBILITY
   ========================================================= */

function renderSearchVisibility() {
  const searchSection =
    $("#searchSection");

  if (!searchSection) {
    return;
  }

  const visible =
    [
      "home",
      "stage",
      "section",
      "material"
    ].includes(
      AppState.page
    );

  searchSection.hidden =
    !visible ||
    AppState.display.search === false;
}


/* =========================================================
   HOME
   ========================================================= */

function renderHome() {
  const container =
    $("#homePage");

  if (!container) {
    return;
  }

  /*
   * Keep existing static HTML if
   * the page already contains content.
   * Only update dynamic stage preview
   * when a matching container exists.
   */

  const quickStages =
    $("#homeStageGrid");

  if (quickStages) {
    quickStages.innerHTML =
      renderStageCards();
  }
}


function renderStageCards() {
  return getStages()
    .map(
      (stage, index) => {

        const materialCount =
          getSections(index)
            .reduce(
              (
                total,
                section
              ) =>
                total +
                section[1].length,
              0
            );

        return `
          <button
            type="button"
            class="
              stage-card
              view-${escapeHTML(
                AppState.view
              )}
            "
            data-action="select-stage"
            data-stage="${index}"
          >

            <span class="stage-number">
              ${index + 1}
            </span>

            <span class="stage-card-content">

              <strong>
                ${escapeHTML(
                  translateText(
                    stage[0]
                  )
                )}
              </strong>

              <span>
                ${escapeHTML(
                  translateText(
                    stage[1]
                  )
                )}
              </span>

              <small>
                ${materialCount}
                ${labelText("Items")}
              </small>

            </span>

          </button>
        `;
      }
    )
    .join("");
}


/* =========================================================
   STAGE PAGE
   ========================================================= */

function renderStages() {
  const grid =
    $("#stageGrid");

  if (!grid) {
    return;
  }

  const filtered =
    getStages()
      .map(
        (stage, index) => ({
          stage,
          index
        })
      )
      .filter(
        ({ index }) =>
          stageMatchesSearch(
            index
          )
      );

  if (!filtered.length) {
    grid.innerHTML =
      emptyState(
        "No results found"
      );

    return;
  }

  grid.innerHTML =
    filtered
      .map(
        ({ stage, index }) =>
          renderStageCard(
            stage,
            index
          )
      )
      .join("");

  applyViewClass(grid);
}


function renderStageCard(
  stage,
  index
) {
  const sections =
    getSections(index);

  const count =
    sections.reduce(
      (
        total,
        section
      ) =>
        total +
        section[1].length,
      0
    );

  return `
    <button
      type="button"
      class="stage-card"
      data-action="select-stage"
      data-stage="${index}"
    >

      <span class="stage-number">
        ${index + 1}
      </span>

      <span class="stage-card-content">

        <strong>
          ${escapeHTML(
            translateText(
              stage[0]
            )
          )}
        </strong>

        <span>
          ${escapeHTML(
            translateText(
              stage[1]
            )
          )}
        </span>

        <small>
          ${count} ${labelText("Items")}
        </small>

      </span>

      <span
        class="stage-arrow"
        aria-hidden="true"
      >
        →
      </span>

    </button>
  `;
}


function stageMatchesSearch(
  stageIndex
) {
  if (!AppState.search) {
    return true;
  }

  const stage =
    getStage(stageIndex);

  const text = [
    stage?.[0],
    stage?.[1]
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return text.includes(
    AppState.search.toLowerCase()
  );
}


/* =========================================================
   SECTION PAGE
   ========================================================= */

function renderSections() {
  const grid =
    $("#sectionGrid");

  if (!grid) {
    return;
  }

  if (AppState.stageIndex === null) {
    grid.innerHTML =
      emptyState("Stage");

    return;
  }

  const sections =
    getSections(
      AppState.stageIndex
    );

  if (!sections.length) {
    grid.innerHTML =
      emptyState(
        "No results found"
      );

    return;
  }

  grid.innerHTML =
    sections
      .map(
        (section, index) =>
          renderSectionCard(
            section,
            index
          )
      )
      .join("");

  applyViewClass(grid);
}


function renderSectionCard(
  section,
  index
) {
  const materialCount =
    Array.isArray(section[1])
      ? section[1].length
      : 0;

  return `
    <button
      type="button"
      class="section-card"
      data-action="select-section"
      data-section="${index}"
    >

      <span class="section-icon">
        ⚡
      </span>

      <span class="section-content">

        <strong>
          ${escapeHTML(
            translateText(
              section[0]
            )
          )}
        </strong>

        <small>
          ${materialCount}
          ${labelText("Items")}
        </small>

      </span>

      <span
        class="section-arrow"
        aria-hidden="true"
      >
        →
      </span>

    </button>
  `;
}


/* =========================================================
   MATERIAL PAGE
   ========================================================= */

function renderMaterials() {
  const grid =
    $("#materialGrid");

  if (!grid) {
    return;
  }

  if (
    AppState.stageIndex === null ||
    AppState.sectionIndex === null
  ) {
    grid.innerHTML =
      emptyState(
        "Material"
      );

    return;
  }

  const materials =
    getMaterials(
      AppState.stageIndex,
      AppState.sectionIndex
    );

  const visible =
    materials
      .map(
        (material, index) => ({
          material,
          index
        })
      )
      .filter(
        ({ index }) =>
          matchesSearch(
            AppState.stageIndex,
            AppState.sectionIndex,
            index
          )
      )
      .filter(
        ({ index }) =>
          matchesFilters(
            AppState.stageIndex,
            AppState.sectionIndex,
            index
          )
      );

  if (!visible.length) {
    grid.innerHTML =
      emptyState(
        "No results found"
      );

    return;
  }

  grid.innerHTML =
    visible
      .map(
        ({ material, index }) =>
          renderMaterialCard(
            material,
            index
          )
      )
      .join("");

  applyViewClass(grid);
}


function renderMaterialCard(
  material,
  index
) {
  const fields =
    getMaterialFields(
      material
    );

  const units =
    getMaterialUnits(
      material
    );

  return `
    <button
      type="button"
      class="material-card"
      data-action="select-material"
      data-material="${index}"
    >

      <span class="material-index">
        ${index + 1}
      </span>

      <span class="material-content">

        <strong>
          ${escapeHTML(
            translateText(
              getMaterialName(
                material
              )
            )
          )}
        </strong>

        ${
          fields.length
            ? `
              <span class="material-fields">
                ${fields.slice(0, 3).map(
                  field => `
                    <span>
                      ${escapeHTML(
                        labelText(
                          field[0]
                        )
                      )}
                    </span>
                  `
                ).join("")}
              </span>
            `
            : ""
        }

        <small>
          ${units.length}
          ${labelText("Unit")}
        </small>

      </span>

      <span
        class="material-arrow"
        aria-hidden="true"
      >
        →
      </span>

    </button>
  `;
}


/* =========================================================
   CALCULATOR
   ========================================================= */

function renderCalculator() {
  const container =
    $("#calculatorContent");

  if (!container) {
    return;
  }

  if (
    container.dataset.rendered === "true"
  ) {
    updateCalculatorLanguage();
    return;
  }

  container.innerHTML = `
    <div class="calculator-grid">

      <section class="calculator-card">

        <h3>
          ${labelText("Power")}
        </h3>

        <p class="formula">
          P = V × I
        </p>

        <label>
          <span>
            ${labelText("Voltage")}
          </span>

          <input
            id="powerVoltage"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
          >
        </label>

        <label>
          <span>
            ${labelText("Current")}
          </span>

          <input
            id="powerCurrent"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
          >
        </label>

        <button
          type="button"
          class="primary-button"
          data-action="calculate-power"
        >
          ${labelText("Calculate")}
        </button>

        <output
          id="powerResult"
          class="calculator-result"
        ></output>

      </section>


      <section class="calculator-card">

        <h3>
          ${labelText("Current")}
        </h3>

        <p class="formula">
          I = P ÷ V
        </p>

        <label>
          <span>
            ${labelText("Power")}
          </span>

          <input
            id="currentPower"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
          >
        </label>

        <label>
          <span>
            ${labelText("Voltage")}
          </span>

          <input
            id="currentVoltage"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
          >
        </label>

        <button
          type="button"
          class="primary-button"
          data-action="calculate-current"
        >
          ${labelText("Calculate")}
        </button>

        <output
          id="currentResult"
          class="calculator-result"
        ></output>

      </section>


      <section class="calculator-card">

        <h3>
          ${labelText("Voltage")}
        </h3>

        <p class="formula">
          V = P ÷ I
        </p>

        <label>
          <span>
            ${labelText("Power")}
          </span>

          <input
            id="voltagePower"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
          >
        </label>

        <label>
          <span>
            ${labelText("Current")}
          </span>

          <input
            id="voltageCurrent"
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
          >
        </label>

        <button
          type="button"
          class="primary-button"
          data-action="calculate-voltage"
        >
          ${labelText("Calculate")}
        </button>

        <output
          id="voltageResult"
          class="calculator-result"
        ></output>

      </section>


      <section class="calculator-card">

        <h3>
          ${labelText("Inverter")}
        </h3>

        <p class="formula">
          12V / 24V → 230V
        </p>

        <label>
          <span>
            ${labelText("Input Voltage")}
          </span>

          <select id="inverterInput">
            <option value="12">12V</option>
            <option value="24">24V</option>
          </select>
        </label>

        <button
          type="button"
          class="primary-button"
          data-action="calculate-inverter"
        >
          ${labelText("Calculate")}
        </button>

        <output
          id="inverterResult"
          class="calculator-result"
        ></output>

      </section>

    </div>
  `;

  container.dataset.rendered =
    "true";
}


function updateCalculatorLanguage() {
  /*
   * Calculator is regenerated only
   * when needed so user input is not
   * unnecessarily destroyed.
   */
}


function getNumber(
  selector
) {
  const element =
    $(selector);

  if (!element) {
    return NaN;
  }

  return Number(
    element.value
  );
}


function calculatePower() {
  const voltage =
    getNumber(
      "#powerVoltage"
    );

  const current =
    getNumber(
      "#powerCurrent"
    );

  const result =
    voltage * current;

  setCalculatorResult(
    "#powerResult",
    Number.isFinite(result)
      ? `${formatNumber(result)} W`
      : "—"
  );
}


function calculateCurrent() {
  const power =
    getNumber(
      "#currentPower"
    );

  const voltage =
    getNumber(
      "#currentVoltage"
    );

  const result =
    voltage !== 0
      ? power / voltage
      : NaN;

  setCalculatorResult(
    "#currentResult",
    Number.isFinite(result)
      ? `${formatNumber(result)} A`
      : "—"
  );
}


function calculateVoltage() {
  const power =
    getNumber(
      "#voltagePower"
    );

  const current =
    getNumber(
      "#voltageCurrent"
    );

  const result =
    current !== 0
      ? power / current
      : NaN;

  setCalculatorResult(
    "#voltageResult",
    Number.isFinite(result)
      ? `${formatNumber(result)} V`
      : "—"
  );
}


function calculateInverter() {
  const input =
    $("#inverterInput");

  const voltage =
    input
      ? Number(input.value)
      : 12;

  setCalculatorResult(
    "#inverterResult",
    `${voltage}V → 230V`
  );
}


function setCalculatorResult(
  selector,
  value
) {
  const output =
    $(selector);

  if (output) {
    output.textContent =
      value;
  }
}


/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings() {
  const container =
    $("#settingsPage");

  if (!container) {
    return;
  }

  const displayKeys =
    [
      ["header", "Header"],
      ["brand", "Brand"],
      ["menuButton", "Menu"],
      ["search", "Search"],
      ["filter", "Filter"],
      ["stageSelector", "Stage"],
      ["sectionSelector", "Section"],
      ["materialSelector", "Material"],
      ["materialOptions", "Material Options"],
      ["quantity", "Quantity"],
      ["unit", "Unit"],
      ["brandField", "Brand"],
      ["price", "Price"],
      ["estimate", "Estimate"],
      ["estimateTotal", "Estimate Total"],
      ["calculator", "Calculator"],
      ["bottomNav", "Bottom Navigation"],
      ["drawer", "Drawer"],
      ["toast", "Toast"],
      ["pageHeading", "Page Heading"],
      ["editorActions", "Editor Actions"],
      ["nextItem", "Next Item"]
    ];

  const controls =
    displayKeys.map(
      ([key, label]) => `
        <label
          class="setting-row"
          data-setting="${escapeHTML(key)}"
        >

          <span>
            ${escapeHTML(
              labelText(label)
            )}
          </span>

          <input
            type="checkbox"
            data-ui-toggle="${escapeHTML(key)}"
            ${
              AppState.display[key] !== false
                ? "checked"
                : ""
            }
          >

        </label>
      `
    ).join("");

  const displayBox =
    container.querySelector(
      "#displaySettings"
    );

  if (displayBox) {
    displayBox.innerHTML =
      controls;

    bindSettingsInputs(
      displayBox
    );
  }
}


function bindSettingsInputs(
  root
) {
  $$(
    "input[data-ui-toggle]",
    root
  ).forEach(
    input => {
      input.addEventListener(
        "change",
        () => {
          const key =
            input.dataset.uiToggle;

          AppState.display[key] =
            input.checked;

          saveDisplay();
          applyDisplaySettings();
          render();
        }
      );
    }
  );
}


/* =========================================================
   MODAL / RESET
   ========================================================= */

let modalConfirmAction = null;


function confirmReset() {
  openModal(
    labelText("Reset App"),
    labelText("Reset all app data?"),
    () => {
      resetApp();
    }
  );
}


function openModal(
  title,
  message,
  confirmAction
) {
  const modal =
    $("#modalLayer");

  if (!modal) {
    return;
  }

  modalConfirmAction =
    confirmAction;

  const titleElement =
    $("#modalTitle");

  const messageElement =
    $("#modalMessage");

  if (titleElement) {
    titleElement.textContent =
      title;
  }

  if (messageElement) {
    messageElement.textContent =
      message;
  }

  modal.hidden = false;

  modal.classList.add(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
}


function closeModal() {
  const modal =
    $("#modalLayer");

  if (!modal) {
    return;
  }

  modal.classList.remove(
    "open"
  );

  modal.hidden = true;

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  modalConfirmAction =
    null;
}


function executeModalConfirm() {
  if (
    typeof modalConfirmAction ===
    "function"
  ) {
    const action =
      modalConfirmAction;

    modalConfirmAction =
      null;

    closeModal();

    action();
  }
}


function isModalOpen() {
  const modal =
    $("#modalLayer");

  return !!(
    modal &&
    !modal.hidden
  );
}


function resetApp() {
  const preserveLanguage =
    AppState.language;

  const preserveTheme =
    AppState.theme;

  Object.values(
    STORAGE
  ).forEach(
    key => {
      removeStorage(key);
    }
  );

  AppState.language =
    preserveLanguage;

  AppState.theme =
    preserveTheme;

  AppState.view =
    getConfigValue(
      "VIEW_CONFIG.default",
      "grid"
    );

  AppState.page =
    "home";

  AppState.stageIndex =
    null;

  AppState.sectionIndex =
    null;

  AppState.materialIndex =
    null;

  AppState.currentMaterial =
    null;

  AppState.currentMaterialKey =
    "";

  AppState.editingEstimateId =
    null;

  AppState.estimateItems =
    [];

  AppState.search =
    "";

  AppState.filters = {
    stage: "",
    section: "",
    brand: "",
    unit: "",
    option: ""
  };

  AppState.draft = {
    fields: {},
    quantity: "",
    unit: "",
    brand: "",
    price: ""
  };

  AppState.display = {
    ...DEFAULT_DISPLAY
  };

  localStorage.setItem(
    STORAGE.language,
    AppState.language
  );

  localStorage.setItem(
    STORAGE.theme,
    AppState.theme
  );

  saveNavigation();
  saveEstimate();
  saveDraft();
  saveFilters();
  saveDisplay();

  closeDrawer();
  closeFilter();
  closeViewMenu();

  applyLanguage();
  applyTheme();

  render();

  toast(
    "App reset successfully",
    "success"
  );
}


/* =========================================================
   PRICE
   ========================================================= */

function togglePriceField() {
  const field =
    $("#priceField");

  if (!field) {
    return;
  }

  field.hidden =
    !field.hidden;
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function toast(
  message,
  type = "info"
) {
  const element =
    $("#toast");

  const messageElement =
    $("#toastMessage");

  if (!element) {
    return;
  }

  if (messageElement) {
    messageElement.textContent =
      translateText(message);
  }

  element.dataset.type =
    type;

  element.classList.add(
    "show"
  );

  clearTimeout(
    toastTimer
  );

  const duration =
    Number(
      TOAST_CONFIG?.duration
    ) || 2200;

  toastTimer =
    setTimeout(
      () => {
        element.classList.remove(
          "show"
        );
      },
      duration
    );
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function emptyState(
  message
) {
  return `
    <div class="empty-state">
      <div class="empty-icon">
        ⚡
      </div>

      <p>
        ${escapeHTML(
          labelText(message)
        )}
      </p>
    </div>
  `;
}


/* =========================================================
   VIEW CLASSES
   ========================================================= */

function applyViewClass(
  element
) {
  if (!element) {
    return;
  }

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
    className =>
      element.classList.remove(
        className
      )
  );

  element.classList.add(
    `view-${AppState.view}`
  );
}


/* =========================================================
   BOTTOM NAVIGATION
   ========================================================= */

function renderBottomNavigation() {
  const nav =
    $("#bottomNav");

  if (!nav) {
    return;
  }

  if (
    AppState.display.bottomNav === false
  ) {
    nav.hidden = true;
    return;
  }

  nav.hidden = false;

  $$(
    "[data-page]",
    nav
  ).forEach(
    item => {
      item.classList.toggle(
        "active",
        item.dataset.page ===
          AppState.page
      );
    }
  );

  updateEstimateBadge();
}


/* =========================================================
   FORMAT
   ========================================================= */

function formatNumber(
  number
) {
  if (
    !Number.isFinite(
      Number(number)
    )
  ) {
    return "0";
  }

  return Number(number)
    .toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    );
}


/* =========================================================
   FOCUS
   ========================================================= */

function focusElement(
  selector
) {
  requestAnimationFrame(
    () => {
      const element =
        $(selector);

      if (element) {
        element.focus();
      }
    }
  );
}


/* =========================================================
   PWA
   ========================================================= */

let deferredInstallPrompt =
  null;


window.addEventListener(
  "beforeinstallprompt",
  event => {
    event.preventDefault();

    deferredInstallPrompt =
      event;
  }
);


async function installPWA() {
  if (!deferredInstallPrompt) {
    toast(
      AppState.language === "hi"
        ? "इंस्टॉल विकल्प अभी उपलब्ध नहीं है"
        : "Install option is not available right now",
      "info"
    );

    return;
  }

  deferredInstallPrompt.prompt();

  try {
    await deferredInstallPrompt.userChoice;
  } catch {
    /* Ignore install errors. */
  }

  deferredInstallPrompt =
    null;
}


function registerServiceWorker() {
  if (
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  if (
    location.protocol !== "https:" &&
    location.hostname !== "localhost"
  ) {
    return;
  }

  const manifest =
    PWA_CONFIG?.manifest ||
    "manifest.json";

  /*
   * Service worker registration is
   * intentionally skipped here when
   * no sw.js exists.
   *
   * This prevents a missing-file
   * console error.
   */
}


/* =========================================================
   SEARCH / FILTER SUMMARY
   ========================================================= */

function getVisibleMaterialCount() {
  let count = 0;

  getStages().forEach(
    (stage, stageIndex) => {
      getSections(stageIndex)
        .forEach(
          (section, sectionIndex) => {
            section[1].forEach(
              (
                material,
                materialIndex
              ) => {
                if (
                  matchesSearch(
                    stageIndex,
                    sectionIndex,
                    materialIndex
                  ) &&
                  matchesFilters(
                    stageIndex,
                    sectionIndex,
                    materialIndex
                  )
                ) {
                  count++;
                }
              }
            );
          }
        );
    }
  );

  return count;
}


/* =========================================================
   RESTORE CURRENT MATERIAL
   ========================================================= */

function restoreCurrentMaterial() {
  if (
    AppState.stageIndex === null ||
    AppState.sectionIndex === null ||
    AppState.materialIndex === null
  ) {
    return;
  }

  const material =
    getMaterial(
      AppState.stageIndex,
      AppState.sectionIndex,
      AppState.materialIndex
    );

  if (!material) {
    return;
  }

  AppState.currentMaterial =
    material;

  AppState.currentMaterialKey =
    makeMaterialKey(
      AppState.stageIndex,
      AppState.sectionIndex,
      AppState.materialIndex
    );
}


/* =========================================================
   INIT RESTORE
   ========================================================= */

restoreCurrentMaterial();


/* =========================================================
   GLOBAL API
   ---------------------------------------------------------
   Useful for debugging / external UI
   without exposing master data editing.
   ========================================================= */

window.ElectroFixApp = {
  state: AppState,

  navigate: navigateTo,

  setLanguage,
  setTheme,
  setViewMode,

  openDrawer,
  closeDrawer,

  getStages,
  getSections,
  getMaterials,
  getMaterial,

  render,

  addEstimate: addOrUpdateEstimate,

  clearEstimate: () => {
    AppState.estimateItems = [];
    saveEstimate();
    updateEstimateBadge();
    renderEstimate();
  }
};


/* =========================================================
   START APPLICATION
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initApp,
    {
      once: true
    }
  );
} else {
  initApp();
}


/* =========================================================
   END OF app.js
   ========================================================= */
