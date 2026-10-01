/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   FINAL APP CONTROLLER

   Works with:
   index.html
   style.css
   config.js
   material.js

   MASTER DATA:
   material.js ONLY
   Do NOT duplicate / modify material data here.

   FLOW:
   HOME
    -> STAGE
      -> SECTION
        -> MATERIAL
          -> EDITOR
            -> ADD -> NEXT MATERIAL

   RULES:
   - Quantity required
   - Other fields optional
   - Brand optional
   - Price optional
   - Add saves item and moves to next material
   - Next NEVER saves automatically
   - Unit carries forward
   - Estimate items editable
   - Hindi / English are separate
   - Drawer + Back handling
   - Route + draft persistence
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
   ========================================================= */

const APP_CONFIG =
  window.EF_CONFIG ||
  window.CONFIG ||
  window.APP_CONFIG ||
  {};

const STORAGE = {
  language:
    APP_CONFIG.storageLanguage ||
    "sandeepMaterialLang",

  estimate:
    APP_CONFIG.storageEstimate ||
    "sandeepEstimateItems",

  theme:
    APP_CONFIG.storageTheme ||
    "sandeepTheme",

  view:
    APP_CONFIG.storageView ||
    "sandeepMaterialView",

  route:
    APP_CONFIG.storageRoute ||
    "sandeepEstimateRoute",

  lastUnit:
    APP_CONFIG.storageLastUnit ||
    "sandeepLastUnit",

  draft:
    APP_CONFIG.storageDraft ||
    "sandeepEstimateDraft"
};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

const EF = {

  materials:
    Array.isArray(window.MATERIALS)
      ? window.MATERIALS
      : [],

  estimate: [],

  language:
    localStorage.getItem(STORAGE.language) || "hi",

  theme:
    localStorage.getItem(STORAGE.theme) || "dark",

  view:
    localStorage.getItem(STORAGE.view) || "grid",

  route:
    localStorage.getItem(STORAGE.route) || "home",

  currentStage: null,

  currentSection: null,

  currentMaterial: null,

  currentMaterialIndex: 0,

  currentSectionItems: [],

  currentDraft: {},

  selectedFilters: {
    stage: "",
    section: "",
    type: "",
    size: "",
    brand: ""
  },

  searchText: "",

  drawerOpen: false,

  filterOpen: false,

  initialized: false,

  ignorePopState: false,

  navigatingHistory: false,

  drawerHistoryActive: false,

  ids: {},

  unitCarry:
    localStorage.getItem(STORAGE.lastUnit) || ""
};


/* =========================================================
   DOM
   ========================================================= */

function cacheDOM() {

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    Array.from(document.querySelectorAll(selector));

  EF.ids = {

    app:
      $("#app"),

    main:
      $("#main") ||
      $("#app"),

    home:
      $("#home"),

    topBar:
      $("#topBar"),

    topBarTitle:
      $("#topBarTitle"),

    menuBtn:
      $("#menuBtn") ||
      $("#hamburgerButton"),

    drawer:
      $("#drawer") ||
      $("#sideMenu"),

    drawerOverlay:
      $("#drawerOverlay") ||
      $("#menuOverlay"),

    closeMenu:
      $("#closeMenu") ||
      $("#sideMenuClose"),

    langBtn:
      $("#langBtn") ||
      $("#languageButton"),

    themeBtn:
      $("#themeBtn") ||
      $("#themeButton") ||
      $("#themeToggleButton"),

    resetBtn:
      $("#resetApp") ||
      $("#resetButton") ||
      $("#menuReset"),

    stageGrid:
      $("#stageGrid"),

    materialGrid:
      $("#materialGrid"),

    bottomNav:
      $("#bottomNav") ||
      $("#bottomNavigation"),

    toast:
      $("#toast"),

    searchInput:
      $("#searchInput") ||
      $("#materialSearch") ||
      $("#search"),

    searchClear:
      $("#searchClear"),

    filterBtn:
      $("#filterBtn") ||
      $("#filterButton"),

    filterPanel:
      $("#filterPanel") ||
      $("#filterDrawer"),

    filterClear:
      $("#filterClear"),

    globalViewTrigger:
      $("#viewModeBtn") ||
      $("#viewSelector") ||
      $("#materialViewSelector") ||
      $("#viewTrigger"),

    globalViewOptions:
      $("#viewOptions") ||
      $("#materialViewOptions"),

    editor:
      $("#editor"),

    editorTitle:
      $("#editorTitle"),

    editorFields:
      $("#editorFields"),

    addBtn:
      $("#addItem") ||
      $("#addBtn") ||
      $("#saveItem"),

    nextBtn:
      $("#nextItem") ||
      $("#nextBtn"),

    backBtn:
      $("#backItem") ||
      $("#previousItem"),

    estimateList:
      $("#estimateList"),

    estimateCount:
      $("#estimateCount"),

    languageButtons:
      $$("[data-language]"),

    loading:
      $("#loadingScreen") ||
      $("#loader") ||
      $("#loading")
  };

  return { $, $$ };
}


/* =========================================================
   LANGUAGE DATA
   ========================================================= */

const HI = {

  home: "होम",

  estimate: "एस्टिमेट",

  calculator: "कैलकुलेटर",

  settings: "सेटिंग्स",

  stage: "स्टेज",

  section: "सेक्शन",

  material: "मटेरियल",

  search: "मटेरियल खोजें",

  filter: "फ़िल्टर",

  clear: "साफ़ करें",

  add: "जोड़ें",

  save: "सेव करें",

  update: "अपडेट करें",

  next: "अगला",

  back: "वापस",

  previous: "पिछला",

  quantity: "मात्रा",

  unit: "यूनिट",

  brand: "ब्रांड",

  price: "कीमत",

  select: "चुनें",

  optional: "वैकल्पिक",

  edit: "एडिट",

  delete: "डिलीट",

  noMaterials: "कोई मटेरियल नहीं मिला",

  noEstimate: "एस्टिमेट खाली है",

  requiredQuantity: "मात्रा दर्ज करना जरूरी है",

  saved: "सेव हो गया",

  updated: "अपडेट हो गया",

  deleted: "डिलीट हो गया",

  reset: "रीसेट",

  resetConfirm:
    "क्या आप पूरा एस्टिमेट रीसेट करना चाहते हैं?",

  language: "भाषा",

  theme: "थीम",

  dark: "डार्क",

  light: "लाइट",

  hindi: "हिंदी",

  english: "English",

  all: "सभी",

  stageView: "स्टेज व्यू",

  materialView: "मटेरियल व्यू",

  grid: "ग्रिड",

  list: "लिस्ट",

  compact: "कॉम्पैक्ट",

  large: "बड़ा",

  mini: "मिनी",

  twoColumn: "2 कॉलम",

  horizontal: "हॉरिज़ॉन्टल",

  iconList: "आइकन लिस्ट",

  timeline: "टाइमलाइन",

  dense: "डेंस",

  close: "बंद करें",

  yes: "हाँ",

  no: "नहीं",

  chooseStage: "स्टेज चुनें",

  chooseSection: "सेक्शन चुनें",

  chooseMaterial: "मटेरियल चुनें",

  calculatorTitle: "इलेक्ट्रिकल कैलकुलेटर",

  settingsTitle: "सेटिंग्स",

  estimateTitle: "एस्टिमेट लिस्ट",

  itemAdded: "मटेरियल एस्टिमेट में जोड़ दिया गया",

  previousItem: "पिछला मटेरियल",

  nextMaterial: "अगला मटेरियल",

  emptySearch: "सर्च के अनुसार कुछ नहीं मिला",

  filterApplied: "फ़िल्टर लागू हो गया",

  selectValue: "वैल्यू चुनें",

  type: "टाइप",

  size: "साइज़",

  subtype: "सब-टाइप",

  option: "ऑप्शन",

  name: "नाम",

  total: "कुल",

  items: "आइटम",

  remove: "हटाएँ",

  cancel: "रद्द करें",

  confirm: "पुष्टि करें"
};


/* =========================================================
   FIELD TRANSLATIONS
   ========================================================= */

const FIELD_HI = {

  Size: "साइज़",

  Type: "टाइप",

  "Sub Type": "सब-टाइप",

  SubType: "सब-टाइप",

  Quantity: "मात्रा",

  Unit: "यूनिट",

  Brand: "ब्रांड",

  Price: "कीमत",

  Length: "लंबाई",

  Width: "चौड़ाई",

  Height: "ऊँचाई",

  Color: "रंग",

  Colour: "रंग",

  Material: "मटेरियल",

  Model: "मॉडल",

  Rating: "रेटिंग",

  Pole: "पोल",

  Poles: "पोल",

  Ampere: "एम्पियर",

  Current: "करंट",

  Voltage: "वोल्टेज",

  Watt: "वॉट",

  Wattage: "वॉटेज",

  BrandName: "ब्रांड",

  Finish: "फिनिश",

  Thickness: "मोटाई",

  LengthUnit: "लंबाई यूनिट",

  Application: "उपयोग",

  Shape: "आकार",

  ColourCode: "कलर कोड",

  "No. of Ways": "वे की संख्या",

  "No. of Module": "मॉड्यूल संख्या",

  Modules: "मॉड्यूल",

  Module: "मॉड्यूल",

  Capacity: "क्षमता",

  SizeType: "साइज़ टाइप"
};


/* =========================================================
   MATERIAL TRANSLATIONS
   ========================================================= */

const MATERIAL_HI = {

  "Pipe": "पाइप",

  "Bend": "बेंड",

  "Junction Box": "जंक्शन बॉक्स",

  "Fan Box": "फैन बॉक्स",

  "Round Box": "राउंड बॉक्स",

  "Switch Box": "स्विच बॉक्स",

  "Conduit Pipe": "कंड्यूट पाइप",

  "Flexible Pipe": "फ्लेक्सिबल पाइप",

  "PVC Wall Plug / Gulli / Gitti":
    "पीवीसी वॉल प्लग / गुल्ली / गिट्टी",

  "Wall Plug": "वॉल प्लग",

  "Saddle": "सैडल",

  "Coupler": "कपलर",

  "Tee": "टी",

  "Junction": "जंक्शन",

  "Connector": "कनेक्टर",

  "Switch": "स्विच",

  "Socket": "सॉकेट",

  "Fan": "पंखा",

  "Regulator": "रेगुलेटर",

  "Holder": "होल्डर",

  "Ceiling Rose": "सीलिंग रोज़",

  "MCB": "एमसीबी",

  "RCCB": "आरसीसीबी",

  "DB": "डीबी",

  "Distribution Board": "डिस्ट्रीब्यूशन बोर्ड",

  "Wire": "वायर",

  "Cable": "केबल",

  "Cable Tie": "केबल टाई",

  "Lug": "लग",

  "Terminal": "टर्मिनल",

  "Tape": "टेप",

  "Insulation Tape": "इंसुलेशन टेप",

  "Screw": "स्क्रू",

  "PVC Screw": "पीवीसी स्क्रू",

  "Rawl Plug": "रॉवल प्लग",

  "Ceiling Fan": "सीलिंग फैन",

  "Exhaust Fan": "एग्जॉस्ट फैन",

  "Light": "लाइट",

  "LED": "एलईडी",

  "LED Bulb": "एलईडी बल्ब",

  "Panel Light": "पैनल लाइट",

  "Down Light": "डाउन लाइट",

  "Spot Light": "स्पॉट लाइट",

  "Flood Light": "फ्लड लाइट",

  "Tube Light": "ट्यूब लाइट",

  "MCB Box": "एमसीबी बॉक्स",

  "Modular Plate": "मॉड्यूलर प्लेट",

  "Switch Plate": "स्विच प्लेट",

  "Face Plate": "फेस प्लेट",

  "Back Box": "बैक बॉक्स",

  "PVC Box": "पीवीसी बॉक्स",

  "Metal Box": "मेटल बॉक्स",

  "False Ceiling": "फॉल्स सीलिंग",

  "False Ceiling Wiring":
    "फॉल्स सीलिंग वायरिंग",

  "Concealed Wiring":
    "कन्सील्ड वायरिंग",

  "Surface Wiring":
    "सरफेस वायरिंग"
};


/* =========================================================
   SECTION TRANSLATIONS
   ========================================================= */

const SECTION_HI = {

  "Conduit & Box":
    "कंड्यूट और बॉक्स",

  "Conduit":
    "कंड्यूट",

  "Boxes":
    "बॉक्स",

  "Wiring":
    "वायरिंग",

  "Switch & Socket":
    "स्विच और सॉकेट",

  "Switches & Sockets":
    "स्विच और सॉकेट",

  "Protection":
    "प्रोटेक्शन",

  "Distribution":
    "डिस्ट्रीब्यूशन",

  "Accessories":
    "एक्सेसरीज़",

  "Electrical Accessories":
    "इलेक्ट्रिकल एक्सेसरीज़",

  "Lighting":
    "लाइटिंग",

  "Fan":
    "फैन",

  "Fans":
    "फैन",

  "False Ceiling Wiring Material":
    "फॉल्स सीलिंग वायरिंग मटेरियल"
};


/* =========================================================
   STAGE TRANSLATIONS
   ========================================================= */

const STAGE_HI = {

  "STAGE 1": "स्टेज 1",

  "STAGE 2": "स्टेज 2",

  "STAGE 3": "स्टेज 3",

  "STAGE 4": "स्टेज 4",

  "STAGE 5": "स्टेज 5"
};


/* =========================================================
   OPTION TRANSLATIONS
   ========================================================= */

const OPTION_HI = {

  "20mm": "20 मिमी",

  "25mm": "25 मिमी",

  "32mm": "32 मिमी",

  "16mm": "16 मिमी",

  "40mm": "40 मिमी",

  "50mm": "50 मिमी",

  "1.5 Sqmm": "1.5 वर्ग मिमी",

  "2.5 Sqmm": "2.5 वर्ग मिमी",

  "4 Sqmm": "4 वर्ग मिमी",

  "6 Sqmm": "6 वर्ग मिमी",

  "10 Sqmm": "10 वर्ग मिमी",

  "16 Sqmm": "16 वर्ग मिमी",

  "20 Sqmm": "20 वर्ग मिमी",

  "25 Sqmm": "25 वर्ग मिमी",

  "32 Sqmm": "32 वर्ग मिमी",

  "PVC": "पीवीसी",

  "GI": "जीआई",

  "MS": "एमएस",

  "Metal": "मेटल",

  "Plastic": "प्लास्टिक",

  "Round": "गोल",

  "Square": "चौकोर",

  "Heavy": "हेवी",

  "Medium": "मीडियम",

  "Light": "लाइट",

  "White": "सफेद",

  "Black": "काला",

  "Grey": "ग्रे",

  "Gray": "ग्रे",

  "Red": "लाल",

  "Blue": "नीला",

  "Green": "हरा",

  "Yellow": "पीला",

  "Orange": "नारंगी",

  "Brown": "भूरा",

  "Brass": "पीतल",

  "Copper": "कॉपर",

  "Single": "सिंगल",

  "Double": "डबल",

  "Triple": "ट्रिपल",

  "Single Pole": "सिंगल पोल",

  "Double Pole": "डबल पोल",

  "Triple Pole": "ट्रिपल पोल",

  "Four Pole": "फोर पोल",

  "1 Way": "1 वे",

  "2 Way": "2 वे",

  "3 Way": "3 वे",

  "6A": "6 एम्पियर",

  "10A": "10 एम्पियर",

  "16A": "16 एम्पियर",

  "20A": "20 एम्पियर",

  "25A": "25 एम्पियर",

  "32A": "32 एम्पियर",

  "40A": "40 एम्पियर",

  "63A": "63 एम्पियर",

  "1 Module": "1 मॉड्यूल",

  "2 Module": "2 मॉड्यूल",

  "3 Module": "3 मॉड्यूल",

  "4 Module": "4 मॉड्यूल",

  "6 Module": "6 मॉड्यूल",

  "8 Module": "8 मॉड्यूल",

  "12 Module": "12 मॉड्यूल",

  "16 Module": "16 मॉड्यूल",

  "18 Module": "18 मॉड्यूल",

  "24 Module": "24 मॉड्यूल",

  "Meter": "मीटर",

  "Mtr": "मीटर",

  "Piece": "पीस",

  "Pc": "पीस",

  "Nos": "नग",

  "No": "नग",

  "Set": "सेट",

  "Box": "बॉक्स",

  "Packet": "पैकेट",

  "Roll": "रोल",

  "Feet": "फीट",

  "Ft": "फीट",

  "Point": "पॉइंट",

  "Point(s)": "पॉइंट",

  "Watt": "वॉट",

  "Volt": "वोल्ट",

  "Amp": "एम्पियर",

  "Normal": "नॉर्मल",

  "Modular": "मॉड्यूलर",

  "Standard": "स्टैंडर्ड",

  "Anchor": "एंकर",

  "Finolex": "फिनोलेक्स",

  "Polycab": "पॉलीकैब",

  "Havells": "हैवेल्स",

  "Anchor Roma": "एंकर रोमा",

  "Legrand": "लेग्रैंड",

  "Schneider": "श्नाइडर",

  "GM": "जीएम",

  "GreatWhite": "ग्रेटव्हाइट"
};


/* =========================================================
   TRANSLATION FUNCTION
   ========================================================= */

function t(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const text = String(value);

  if (EF.language === "en") {
    return text;
  }

  if (HI[text]) {
    return HI[text];
  }

  if (FIELD_HI[text]) {
    return FIELD_HI[text];
  }

  if (MATERIAL_HI[text]) {
    return MATERIAL_HI[text];
  }

  if (SECTION_HI[text]) {
    return SECTION_HI[text];
  }

  if (STAGE_HI[text]) {
    return STAGE_HI[text];
  }

  if (OPTION_HI[text]) {
    return OPTION_HI[text];
  }

  return text;
}


/* =========================================================
   NORMALIZE
   ========================================================= */

function normalize(value) {

  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


function slug(value) {

  return normalize(value)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function esc(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   SAFE LOCAL STORAGE
   ========================================================= */

function storageGet(key, fallback = "") {

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


function storageSet(key, value) {

  try {

    localStorage.setItem(
      key,
      value
    );

  } catch (error) {}
}


function storageRemove(key) {

  try {

    localStorage.removeItem(key);

  } catch (error) {}
}


/* =========================================================
   CONFIG VALUE
   ========================================================= */

function configValue(key, fallback) {

  if (
    APP_CONFIG &&
    Object.prototype.hasOwnProperty.call(
      APP_CONFIG,
      key
    )
  ) {

    return APP_CONFIG[key];
  }

  return fallback;
}


/* =========================================================
   MATERIAL STRUCTURE HELPERS
   ========================================================= */

function getStageName(stage) {

  return Array.isArray(stage)
    ? stage[0]
    : "";
}


function getStageTitle(stage) {

  return Array.isArray(stage)
    ? stage[1]
    : "";
}


function getStageCategory(stage) {

  return Array.isArray(stage)
    ? stage[2]
    : "";
}


function getDirectMaterials(stage) {

  if (!Array.isArray(stage)) {
    return [];
  }

  return Array.isArray(stage[3])
    ? stage[3]
    : [];
}


function getSections(stage) {

  if (!Array.isArray(stage)) {
    return [];
  }

  return Array.isArray(stage[4])
    ? stage[4]
    : [];
}


function getSectionName(section) {

  return Array.isArray(section)
    ? section[0]
    : "";
}


function getSectionMaterials(section) {

  return Array.isArray(section)
    ? section[1]
    : [];
}


function materialName(material) {

  if (Array.isArray(material)) {
    return material[0];
  }

  if (
    material &&
    typeof material === "object"
  ) {
    return (
      material.name ||
      material.material ||
      ""
    );
  }

  return "";
}


function materialFields(material) {

  if (Array.isArray(material)) {

    return Array.isArray(material[1])
      ? material[1]
      : [];
  }

  if (
    material &&
    typeof material === "object"
  ) {

    return (
      Array.isArray(material.fields)
        ? material.fields
        : []
    );
  }

  return [];
}


function fieldName(field) {

  if (Array.isArray(field)) {
    return field[0];
  }

  if (
    field &&
    typeof field === "object"
  ) {

    return (
      field.name ||
      field.label ||
      field.key ||
      ""
    );
  }

  return "";
}


function fieldOptions(field) {

  if (Array.isArray(field)) {

    return Array.isArray(field[1])
      ? field[1]
      : [];
  }

  if (
    field &&
    typeof field === "object"
  ) {

    return (
      Array.isArray(field.options)
        ? field.options
        : []
    );
  }

  return [];
}


/* =========================================================
   MATERIAL ENTRY FLATTENING
   ========================================================= */

function getAllMaterialEntries() {

  const result = [];

  EF.materials.forEach(
    (stage) => {

      const stageName =
        getStageName(stage);

      const stageTitle =
        getStageTitle(stage);

      const direct =
        getDirectMaterials(stage);

      direct.forEach(
        (material, index) => {

          result.push({

            stage,
            stageName,
            stageTitle,

            section: "",

            sectionData: null,

            material,

            materialIndex: index
          });
        }
      );

      const sections =
        getSections(stage);

      sections.forEach(
        (section) => {

          const sectionName =
            getSectionName(section);

          const materials =
            getSectionMaterials(section);

          materials.forEach(
            (material, index) => {

              result.push({

                stage,
                stageName,
                stageTitle,

                section: sectionName,

                sectionData: section,

                material,

                materialIndex: index
              });
            }
          );
        }
      );
    }
  );

  return result;
}


/* =========================================================
   FIND MATERIAL ENTRY
   ========================================================= */

function findMaterialEntry(
  stageName,
  sectionName,
  materialNameValue
) {

  const stage =
    EF.materials.find(
      (item) =>
        getStageName(item) ===
        stageName
    );

  if (!stage) {
    return null;
  }

  if (!sectionName) {

    const direct =
      getDirectMaterials(stage);

    const material =
      direct.find(
        (item) =>
          materialName(item) ===
          materialNameValue
      );

    if (!material) {
      return null;
    }

    return {

      stage,

      stageName:
        getStageName(stage),

      stageTitle:
        getStageTitle(stage),

      section: "",

      sectionData: null,

      material,

      materialIndex:
        direct.indexOf(material)
    };
  }

  const section =
    getSections(stage).find(
      (item) =>
        getSectionName(item) ===
        sectionName
    );

  if (!section) {
    return null;
  }

  const materials =
    getSectionMaterials(section);

  const material =
    materials.find(
      (item) =>
        materialName(item) ===
        materialNameValue
    );

  if (!material) {
    return null;
  }

  return {

    stage,

    stageName:
      getStageName(stage),

    stageTitle:
      getStageTitle(stage),

    section: sectionName,

    sectionData: section,

    material,

    materialIndex:
      materials.indexOf(material)
  };
}


/* =========================================================
   CURRENT MATERIAL LIST
   ========================================================= */

function getCurrentMaterialList() {

  if (
    Array.isArray(
      EF.currentSectionItems
    ) &&
    EF.currentSectionItems.length
  ) {

    return EF.currentSectionItems;
  }

  if (!EF.currentStage) {
    return [];
  }

  if (EF.currentSection) {

    const section =
      getSections(
        EF.currentStage
      ).find(
        (item) =>
          getSectionName(item) ===
          EF.currentSection
      );

    return section
      ? getSectionMaterials(section)
      : [];
  }

  return getDirectMaterials(
    EF.currentStage
  );
}


/* =========================================================
   ESTIMATE STORAGE
   ========================================================= */

function loadEstimate() {

  try {

    const raw =
      storageGet(
        STORAGE.estimate,
        "[]"
      );

    const parsed =
      JSON.parse(raw);

    EF.estimate =
      Array.isArray(parsed)
        ? parsed
        : [];

  } catch (error) {

    EF.estimate = [];
  }
}


function saveEstimate() {

  storageSet(
    STORAGE.estimate,
    JSON.stringify(
      EF.estimate
    )
  );

  updateEstimateCount();
}


function updateEstimateCount() {

  const el =
    EF.ids.estimateCount;

  if (!el) {
    return;
  }

  el.textContent =
    String(
      EF.estimate.length
    );
}


/* =========================================================
   DRAFT STORAGE
   ========================================================= */

function draftKey() {

  return JSON.stringify({

    stage:
      EF.currentStage
        ? getStageName(EF.currentStage)
        : "",

    section:
      EF.currentSection || "",

    material:
      EF.currentMaterial
        ? materialName(
            EF.currentMaterial
          )
        : "",

    index:
      EF.currentMaterialIndex
  });
}


function saveDraft() {

  if (
    EF.route !== "editor" ||
    !EF.currentMaterial
  ) {
    return;
  }

  const payload = {

    key: draftKey(),

    stage:
      EF.currentStage
        ? getStageName(EF.currentStage)
        : "",

    section:
      EF.currentSection || "",

    material:
      materialName(
        EF.currentMaterial
      ),

    index:
      EF.currentMaterialIndex,

    draft:
      EF.currentDraft || {},

    unitCarry:
      EF.unitCarry || ""
  };

  storageSet(
    STORAGE.draft,
    JSON.stringify(payload)
  );
}


function loadDraft() {

  try {

    const raw =
      storageGet(
        STORAGE.draft,
        ""
      );

    if (!raw) {
      return null;
    }

    const data =
      JSON.parse(raw);

    if (!data || !data.key) {
      return null;
    }

    if (
      data.key !== draftKey()
    ) {
      return null;
    }

    return data;

  } catch (error) {

    return null;
  }
}


function clearDraft() {

  storageRemove(
    STORAGE.draft
  );

  EF.currentDraft = {};
}


/* =========================================================
   ROUTE STORAGE
   ========================================================= */

function saveRoute() {

  const data = {

    route:
      EF.route,

    stage:
      EF.currentStage
        ? getStageName(EF.currentStage)
        : "",

    section:
      EF.currentSection || "",

    materialIndex:
      Number(
        EF.currentMaterialIndex || 0
      ),

    material:
      EF.currentMaterial
        ? materialName(
            EF.currentMaterial
          )
        : ""
  };

  storageSet(
    STORAGE.route,
    JSON.stringify(data)
  );

  saveDraft();
}


function loadRouteData() {

  try {

    const raw =
      storageGet(
        STORAGE.route,
        ""
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);

  } catch (error) {

    return null;
  }
}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme() {

  const theme =
    EF.theme === "light"
      ? "light"
      : "dark";

  EF.theme = theme;

  document.documentElement
    .setAttribute(
      "data-theme",
      theme
    );

  document.body
    .setAttribute(
      "data-theme",
      theme
    );

  document.body.classList.toggle(
    "light-mode",
    theme === "light"
  );

  document.body.classList.toggle(
    "dark-mode",
    theme === "dark"
  );

  storageSet(
    STORAGE.theme,
    theme
  );

  updateThemeControls();
}


function updateThemeControls() {

  const btn =
    EF.ids.themeBtn;

  if (!btn) {
    return;
  }

  btn.setAttribute(
    "aria-label",
    EF.theme === "dark"
      ? t("light")
      : t("dark")
  );

  btn.setAttribute(
    "data-theme",
    EF.theme
  );

  btn.classList.toggle(
    "active",
    EF.theme === "light"
  );
}


function toggleTheme() {

  EF.theme =
    EF.theme === "dark"
      ? "light"
      : "dark";

  applyTheme();
}


/* =========================================================
   LANGUAGE
   ========================================================= */

function setLanguage(language) {

  language =
    language === "en"
      ? "en"
      : "hi";

  EF.language =
    language;

  storageSet(
    STORAGE.language,
    language
  );

  renderLanguageButtons();

  renderCurrentPage();

  updateThemeControls();

  updateTopBar();

  showToast(
    language === "hi"
      ? "भाषा बदल दी गई"
      : "Language changed"
  );
}


function renderLanguageButtons() {

  EF.ids.languageButtons
    ?.forEach(
      (button) => {

        const lang =
          button.dataset.language;

        const active =
          lang === EF.language;

        button.classList.toggle(
          "active",
          active
        );

        button.setAttribute(
          "aria-selected",
          String(active)
        );
      }
    );
}


/* =========================================================
   TOP BAR
   ========================================================= */

function updateTopBar() {

  const title =
    EF.ids.topBarTitle;

  if (!title) {
    return;
  }

  const brand =
    "Sandeep ElectroFix";

  let pageTitle =
    brand;

  if (EF.route === "estimate") {
    pageTitle =
      `${t("estimateTitle")} • ${brand}`;
  }

  if (EF.route === "calculator") {
    pageTitle =
      `${t("calculatorTitle")} • ${brand}`;
  }

  if (EF.route === "settings") {
    pageTitle =
      `${t("settingsTitle")} • ${brand}`;
  }

  if (EF.route === "stage") {
    pageTitle =
      `${t("stage")} • ${brand}`;
  }

  if (EF.route === "section") {
    pageTitle =
      `${t("section")} • ${brand}`;
  }

  if (EF.route === "materials") {
    pageTitle =
      `${t("material")} • ${brand}`;
  }

  if (EF.route === "editor") {

    pageTitle =
      EF.currentMaterial
        ? `${t(materialName(EF.currentMaterial))} • ${brand}`
        : `${t("material")} • ${brand}`;
  }

  title.textContent =
    pageTitle;
}


/* =========================================================
   DRAWER
   ========================================================= */

function openDrawer() {

  const drawer =
    EF.ids.drawer;

  const overlay =
    EF.ids.drawerOverlay;

  if (!drawer) {
    return;
  }

  EF.drawerOpen = true;

  drawer.classList.add("open");
  drawer.classList.add("active");

  overlay?.classList.add(
    "open",
    "active"
  );

  document.body.classList.add(
    "drawer-open"
  );

  EF.drawerHistoryActive = true;

  history.pushState(
    {
      ...history.state,
      drawer: true
    },
    "",
    location.href
  );
}


function closeDrawer(
  fromPopState = false
) {

  const drawer =
    EF.ids.drawer;

  const overlay =
    EF.ids.drawerOverlay;

  EF.drawerOpen = false;

  drawer?.classList.remove(
    "open",
    "active"
  );

  overlay?.classList.remove(
    "open",
    "active"
  );

  document.body.classList.remove(
    "drawer-open"
  );

  if (
    EF.drawerHistoryActive &&
    !fromPopState
  ) {

    EF.drawerHistoryActive = false;

    try {
      history.back();
    } catch (error) {}
  } else {

    EF.drawerHistoryActive = false;
  }
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(message) {

  const toast =
    EF.ids.toast;

  if (!toast) {
    return;
  }

  toast.textContent =
    message;

  toast.classList.add(
    "show",
    "active"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show",
          "active"
        );

      },
      1800
    );
}


/* =========================================================
   LOADER
   ========================================================= */

function hideLoader() {

  const loader =
    EF.ids.loading;

  if (!loader) {
    return;
  }

  loader.classList.add(
    "hidden"
  );

  loader.style.display =
    "none";
}


/* =========================================================
   SCROLL TOP
   ========================================================= */

function scrollTop() {

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });

  const main =
    EF.ids.main;

  if (main) {
    main.scrollTop = 0;
  }

  document.documentElement
    .scrollTop = 0;

  document.body.scrollTop = 0;
}


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

function hideAllPages() {

  document
    .querySelectorAll(
      "[data-page]"
    )
    .forEach(
      (page) => {

        page.classList.remove(
          "active"
        );

        page.hidden = true;
      }
    );

  [
    "home",
    "estimate",
    "calculator",
    "settings",
    "stage",
    "section",
    "materials",
    "editor"
  ].forEach(
    (id) => {

      const el =
        document.getElementById(id);

      if (el) {

        el.classList.remove(
          "active"
        );

        el.hidden = true;
      }
    }
  );
}


function showPage(id) {

  const el =
    document.getElementById(id);

  if (!el) {
    return;
  }

  el.hidden = false;

  el.classList.add(
    "active"
  );
}


/* =========================================================
   ROUTE NAVIGATION
   ========================================================= */

function navigate(
  route,
  options = {}
) {

  const {
    push = true,
    render = true
  } = options;

  if (
    EF.route === "editor" &&
    route !== "editor"
  ) {
    saveDraft();
  }

  EF.route =
    route;

  saveRoute();

  if (push) {

    history.pushState(
      {
        route:
          EF.route,

        stage:
          EF.currentStage
            ? getStageName(
                EF.currentStage
              )
            : "",

        section:
          EF.currentSection || "",

        materialIndex:
          EF.currentMaterialIndex || 0
      },
      "",
      location.href
    );
  }

  if (render) {
    renderCurrentPage();
  }
}


/* =========================================================
   HOME
   ========================================================= */

function renderHome() {

  hideAllPages();

  showPage("home");

  updateTopBar();

  const grid =
    EF.ids.stageGrid;

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  if (!EF.materials.length) {

    grid.innerHTML =
      `<div class="empty-state">
        ${esc(t("noMaterials"))}
      </div>`;

    return;
  }

  EF.materials.forEach(
    (stage, index) => {

      const stageName =
        getStageName(stage);

      const stageTitle =
        getStageTitle(stage);

      const category =
        getStageCategory(stage);

      const count =
        getStageMaterialCount(stage);

      const card =
        document.createElement(
          "button"
        );

      card.type =
        "button";

      card.className =
        "stage-card";

      card.dataset.stageIndex =
        String(index);

      card.innerHTML = `

        <span class="stage-card-icon">
          ⚡
        </span>

        <span class="stage-card-content">

          <strong>
            ${esc(
              t(stageName)
            )}
          </strong>

          <small>
            ${esc(
              t(stageTitle)
            )}
          </small>

          ${
            category
              ? `<em>${esc(
                  t(category)
                )}</em>`
              : ""
          }

          <span class="stage-card-count">
            ${count} ${esc(
              t("items")
            )}
          </span>

        </span>
      `;

      card.addEventListener(
        "click",
        () => openStage(stage)
      );

      grid.appendChild(
        card
      );
    }
  );
}


function getStageMaterialCount(stage) {

  let count =
    getDirectMaterials(stage)
      .length;

  getSections(stage)
    .forEach(
      (section) => {

        count +=
          getSectionMaterials(
            section
          ).length;
      }
    );

  return count;
}


/* =========================================================
   STAGE
   ========================================================= */

function openStage(
  stage,
  options = {}
) {

  EF.currentStage =
    stage;

  EF.currentSection =
    null;

  EF.currentMaterial =
    null;

  EF.currentMaterialIndex =
    0;

  EF.currentSectionItems =
    [];

  EF.currentDraft =
    {};

  EF.route =
    "stage";

  saveRoute();

  if (options.push !== false) {

    history.pushState(
      {
        route: "stage",
        stage:
          getStageName(stage)
      },
      "",
      location.href
    );
  }

  renderStage();

  scrollTop();
}


function renderStage() {

  hideAllPages();

  showPage("stage");

  updateTopBar();

  const grid =
    document.getElementById(
      "sectionGrid"
    ) ||
    EF.ids.materialGrid;

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  if (!EF.currentStage) {
    renderHome();
    return;
  }

  const sections =
    getSections(
      EF.currentStage
    );

  const direct =
    getDirectMaterials(
      EF.currentStage
    );

  if (direct.length) {

    const card =
      createSectionCard(
        "",
        direct.length,
        true
      );

    grid.appendChild(card);
  }

  sections.forEach(
    (section) => {

      const materials =
        getSectionMaterials(
          section
        );

      const card =
        createSectionCard(
          getSectionName(section),
          materials.length,
          false
        );

      grid.appendChild(card);
    }
  );

  if (
    !direct.length &&
    !sections.length
  ) {

    grid.innerHTML =
      `<div class="empty-state">
        ${esc(t("noMaterials"))}
      </div>`;
  }
}


function createSectionCard(
  sectionName,
  count,
  isDirect
) {

  const card =
    document.createElement(
      "button"
    );

  card.type =
    "button";

  card.className =
    "section-card";

  card.innerHTML = `

    <span class="section-card-icon">
      ⚡
    </span>

    <span class="section-card-content">

      <strong>
        ${esc(
          isDirect
            ? t("material")
            : t(sectionName)
        )}
      </strong>

      <small>
        ${count} ${esc(
          t("items")
        )}
      </small>

    </span>
  `;

  card.addEventListener(
    "click",
    () => {

      if (isDirect) {

        openMaterials(
          EF.currentStage,
          "",
          getDirectMaterials(
            EF.currentStage
          )
        );

      } else {

        const section =
          getSections(
            EF.currentStage
          ).find(
            (item) =>
              getSectionName(item) ===
              sectionName
          );

        if (section) {

          openSection(
            section
          );
        }
      }
    }
  );

  return card;
}


/* =========================================================
   SECTION
   ========================================================= */

function openSection(
  section,
  options = {}
) {

  EF.currentSection =
    getSectionName(section);

  EF.currentSectionItems =
    getSectionMaterials(section);

  EF.currentMaterial =
    null;

  EF.currentMaterialIndex =
    0;

  EF.currentDraft =
    {};

  EF.route =
    "section";

  saveRoute();

  if (options.push !== false) {

    history.pushState(
      {
        route: "section",

        stage:
          EF.currentStage
            ? getStageName(
                EF.currentStage
              )
            : "",

        section:
          EF.currentSection
      },
      "",
      location.href
    );
  }

  renderSection();

  scrollTop();
}


function renderSection() {

  hideAllPages();

  showPage("section");

  updateTopBar();

  const grid =
    document.getElementById(
      "sectionMaterialGrid"
    ) ||
    EF.ids.materialGrid;

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  const materials =
    getCurrentMaterialList();

  renderMaterialCards(
    materials,
    grid
  );
}


/* =========================================================
   MATERIALS
   ========================================================= */

function openMaterials(
  stage,
  sectionName,
  materials,
  options = {}
) {

  EF.currentStage =
    stage;

  EF.currentSection =
    sectionName || "";

  EF.currentSectionItems =
    Array.isArray(materials)
      ? materials
      : [];

  EF.currentMaterial =
    null;

  EF.currentMaterialIndex =
    0;

  EF.currentDraft =
    {};

  EF.route =
    "materials";

  saveRoute();

  if (options.push !== false) {

    history.pushState(
      {
        route: "materials",

        stage:
          getStageName(stage),

        section:
          sectionName || ""
      },
      "",
      location.href
    );
  }

  renderMaterials();

  scrollTop();
}


function renderMaterials() {

  hideAllPages();

  showPage("materials");

  updateTopBar();

  const grid =
    EF.ids.materialGrid;

  if (!grid) {
    return;
  }

  ensureSingleViewSelector();

  const materials =
    getCurrentMaterialList();

  const filtered =
    getFilteredMaterials(
      materials
    );

  renderMaterialCards(
    filtered,
    grid
  );

  updateViewClasses();

  syncViewSelector();
}


/* =========================================================
   MATERIAL TOOLBAR
   ========================================================= */

function ensureSingleViewSelector() {

  const existing =
    document.querySelectorAll(
      "[data-view-option]"
    );

  if (existing.length) {

    bindViewOptionListeners();

    return;
  }

  const toolbar =
    document.querySelector(
      "#materialToolbar"
    ) ||
    document.querySelector(
      ".material-toolbar"
    );

  if (!toolbar) {
    return;
  }

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "material-view-selector";

  wrapper.innerHTML = `

    <button
      type="button"
      class="view-trigger"
      data-view-trigger
      aria-expanded="false"
    >
      ⚡
    </button>

    <div
      class="view-options"
      data-view-options
      hidden
    >

      ${getViewOptionsHTML()}

    </div>
  `;

  toolbar.appendChild(
    wrapper
  );

  bindViewOptionListeners();
}


function getViewOptionsHTML() {

  const options = [

    ["grid", "▦", "grid"],

    ["list", "☷", "list"],

    ["compact", "▤", "compact"],

    ["large", "▦", "large"],

    ["mini", "▪", "mini"],

    ["2column", "▥", "twoColumn"],

    ["horizontal", "↔", "horizontal"],

    ["icon", "⚡", "iconList"],

    ["timeline", "◉", "timeline"],

    ["dense", "≡", "dense"]
  ];

  return options
    .map(
      ([value, icon, label]) =>
        `
        <button
          type="button"
          class="view-option"
          data-view-option="${esc(value)}"
        >
          <span>${icon}</span>
          <em>${esc(
            t(label)
          )}</em>
        </button>
        `
    )
    .join("");
}


function bindViewOptionListeners() {

  document
    .querySelectorAll(
      "[data-view-option]"
    )
    .forEach(
      (button) => {

        if (
          button.dataset.bound === "1"
        ) {
          return;
        }

        button.dataset.bound =
          "1";

        button.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            const view =
              button.dataset.viewOption;

            setView(
              view
            );

            closeAllViewOptions();
          }
        );
      }
    );

  document
    .querySelectorAll(
      "[data-view-trigger]"
    )
    .forEach(
      (trigger) => {

        if (
          trigger.dataset.bound === "1"
        ) {
          return;
        }

        trigger.dataset.bound =
          "1";

        trigger.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            toggleViewOptions(
              trigger
            );
          }
        );
      }
    );
}


function toggleViewOptions(trigger) {

  const wrapper =
    trigger.closest(
      ".material-view-selector"
    );

  if (!wrapper) {
    return;
  }

  const options =
    wrapper.querySelector(
      "[data-view-options]"
    );

  if (!options) {
    return;
  }

  const open =
    !options.hidden;

  closeAllViewOptions();

  if (!open) {

    options.hidden =
      false;

    trigger.setAttribute(
      "aria-expanded",
      "true"
    );

    wrapper.classList.add(
      "open"
    );
  }
}


function closeAllViewOptions() {

  document
    .querySelectorAll(
      "[data-view-options]"
    )
    .forEach(
      (options) => {

        options.hidden =
          true;

        const wrapper =
          options.closest(
            ".material-view-selector"
          );

        wrapper?.classList.remove(
          "open"
        );

        wrapper
          ?.querySelector(
            "[data-view-trigger]"
          )
          ?.setAttribute(
            "aria-expanded",
            "false"
          );
      }
    );

  if (
    EF.ids.globalViewOptions
  ) {

    EF.ids.globalViewOptions.hidden =
      true;
  }
}


function setView(view) {

  const valid = [

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
  ];

  if (!valid.includes(view)) {
    view = "grid";
  }

  EF.view =
    view;

  storageSet(
    STORAGE.view,
    view
  );

  updateViewClasses();

  syncViewSelector();

  if (
    EF.route === "materials" ||
    EF.route === "section"
  ) {

    const grid =
      EF.ids.materialGrid;

    if (grid) {

      const filtered =
        getFilteredMaterials(
          getCurrentMaterialList()
        );

      renderMaterialCards(
        filtered,
        grid
      );
    }
  }
}


function updateViewClasses() {

  const targets =
    document.querySelectorAll(
      "#materialGrid, .material-grid"
    );

  targets.forEach(
    (grid) => {

      [
        "view-grid",
        "view-list",
        "view-compact",
        "view-large",
        "view-mini",
        "view-2column",
        "view-horizontal",
        "view-icon",
        "view-timeline",
        "view-dense"
      ].forEach(
        (className) =>
          grid.classList.remove(
            className
          )
      );

      grid.classList.add(
        `view-${EF.view}`
      );

      grid.dataset.view =
        EF.view;
    }
  );
}


function syncViewSelector() {

  document
    .querySelectorAll(
      "[data-view-option]"
    )
    .forEach(
      (button) => {

        button.classList.toggle(
          "active",
          button.dataset.viewOption ===
            EF.view
        );
      }
    );
}


/* =========================================================
   MATERIAL FILTERING
   ========================================================= */

function materialMatchesSearch(
  material,
  search
) {

  if (!search) {
    return true;
  }

  const haystack = [];

  haystack.push(
    materialName(material)
  );

  materialFields(
    material
  ).forEach(
    (field) => {

      haystack.push(
        fieldName(field)
      );

      fieldOptions(field)
        .forEach(
          (option) =>
            haystack.push(
              option
            )
        );
    }
  );

  return normalize(
    haystack.join(" ")
  ).includes(
    normalize(search)
  );
}


function getFieldValueSet(
  material,
  wantedNames
) {

  const values = [];

  materialFields(
    material
  ).forEach(
    (field) => {

      const name =
        normalize(
          fieldName(field)
        );

      if (
        wantedNames.some(
          (wanted) =>
            name === normalize(wanted)
        )
      ) {

        fieldOptions(field)
          .forEach(
            (value) =>
              values.push(
                String(value)
              )
          );
      }
    }
  );

  return values;
}


function materialMatchesFilter(
  material
) {

  const filters =
    EF.selectedFilters;

  if (
    filters.type
  ) {

    const values =
      getFieldValueSet(
        material,
        ["Type"]
      );

    if (
      !values.some(
        (value) =>
          normalize(value) ===
          normalize(filters.type)
      )
    ) {
      return false;
    }
  }

  if (
    filters.size
  ) {

    const values =
      getFieldValueSet(
        material,
        ["Size"]
      );

    if (
      !values.some(
        (value) =>
          normalize(value) ===
          normalize(filters.size)
      )
    ) {
      return false;
    }
  }

  if (
    filters.brand
  ) {

    const values =
      getFieldValueSet(
        material,
        ["Brand"]
      );

    if (
      values.length &&
      !values.some(
        (value) =>
          normalize(value) ===
          normalize(filters.brand)
      )
    ) {

      return false;
    }
  }

  return true;
}


function getFilteredMaterials(
  materials
) {

  if (!Array.isArray(materials)) {
    return [];
  }

  let result =
    materials.slice();

  const stageFilter =
    EF.selectedFilters.stage;

  const sectionFilter =
    EF.selectedFilters.section;

  if (stageFilter) {

    if (
      EF.currentStage &&
      getStageName(
        EF.currentStage
      ) !== stageFilter
    ) {

      result = [];
    }
  }

  if (
    sectionFilter &&
    EF.currentSection !==
      sectionFilter
  ) {

    result = [];
  }

  result =
    result.filter(
      (material) =>
        materialMatchesSearch(
          material,
          EF.searchText
        )
    );

  result =
    result.filter(
      (material) =>
        materialMatchesFilter(
          material
        )
    );

  return result;
}


/* =========================================================
   MATERIAL CARDS
   ========================================================= */

function renderMaterialCards(
  materials,
  grid
) {

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  if (!materials.length) {

    grid.innerHTML =
      `<div class="empty-state">
        ${esc(
          EF.searchText
            ? t("emptySearch")
            : t("noMaterials")
        )}
      </div>`;

    updateViewClasses();

    return;
  }

  materials.forEach(
    (material, index) => {

      const card =
        createMaterialCard(
          material,
          index
        );

      grid.appendChild(
        card
      );
    }
  );

  updateViewClasses();
}


function createMaterialCard(
  material,
  index
) {

  const card =
    document.createElement(
      "button"
    );

  card.type =
    "button";

  card.className =
    "material-card";

  const fields =
    materialFields(material);

  const preview =
    fields
      .slice(0, 3)
      .map(
        (field) => {

          const name =
            fieldName(field);

          const options =
            fieldOptions(field);

          const value =
            options.length
              ? options
                  .slice(0, 2)
                  .join(" / ")
              : "";

          return `
            <span class="material-meta">
              <b>${esc(
                t(name)
              )}</b>
              ${
                value
                  ? `<i>${esc(
                      t(value)
                    )}</i>`
                  : ""
              }
            </span>
          `;
        }
      )
      .join("");

  card.innerHTML = `

    <span class="material-icon">
      ⚡
    </span>

    <span class="material-card-body">

      <strong class="material-name">
        ${esc(
          t(materialName(material))
        )}
      </strong>

      ${
        preview
          ? `<span class="material-preview">
              ${preview}
            </span>`
          : ""
      }

    </span>

    <span class="material-arrow">
      ›
    </span>
  `;

  card.addEventListener(
    "click",
    () => {

      const source =
        getCurrentMaterialList();

      const actualIndex =
        source.indexOf(
          material
        );

      openEditor(
        material,
        actualIndex >= 0
          ? actualIndex
          : index
      );
    }
  );

  return card;
}


/* =========================================================
   EDITOR
   ========================================================= */

function openEditor(
  material,
  index,
  options = {}
) {

  EF.currentMaterial =
    material;

  EF.currentMaterialIndex =
    Number.isInteger(index)
      ? index
      : 0;

  EF.currentDraft =
    EF.currentDraft || {};

  EF.route =
    "editor";

  const savedDraft =
    loadDraft();

  if (savedDraft) {

    EF.currentDraft =
      savedDraft.draft || {};

    if (
      savedDraft.unitCarry
    ) {

      EF.unitCarry =
        savedDraft.unitCarry;
    }
  }

  saveRoute();

  if (options.push !== false) {

    history.pushState(
      {
        route: "editor",

        stage:
          EF.currentStage
            ? getStageName(
                EF.currentStage
              )
            : "",

        section:
          EF.currentSection || "",

        materialIndex:
          EF.currentMaterialIndex
      },
      "",
      location.href
    );
  }

  renderEditor();

  scrollTop();
}


function renderEditor() {

  hideAllPages();

  showPage("editor");

  updateTopBar();

  const material =
    EF.currentMaterial;

  if (!material) {

    if (
      EF.currentSection
    ) {

      navigate(
        "materials"
      );

    } else {

      navigate(
        "home"
      );
    }

    return;
  }

  const title =
    EF.ids.editorTitle;

  if (title) {

    title.textContent =
      t(
        materialName(material)
      );
  }

  const fieldsContainer =
    EF.ids.editorFields;

  if (!fieldsContainer) {
    return;
  }

  fieldsContainer.innerHTML = "";

  materialFields(
    material
  ).forEach(
    (field, index) => {

      fieldsContainer.appendChild(
        createEditorField(
          field,
          index
        )
      );
    }
  );

  appendCommonFields(
    fieldsContainer
  );

  restoreDraftValues();

  updateEditorButtons();

  scrollTop();
}


/* =========================================================
   EDITOR FIELD
   ========================================================= */

function createEditorField(
  field,
  index
) {

  const name =
    fieldName(field);

  const options =
    fieldOptions(field);

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "editor-field";

  wrapper.dataset.fieldIndex =
    String(index);

  wrapper.dataset.fieldName =
    name;

  const id =
    `ef-field-${index}-${slug(name)}`;

  let controlHTML = "";

  if (options.length) {

    controlHTML = `

      <select
        id="${esc(id)}"
        class="ef-input ef-select"
        data-editor-field
        data-field-index="${index}"
        data-field-name="${esc(name)}"
      >

        <option value="">
          ${esc(
            t("selectValue")
          )}
        </option>

        ${options
          .map(
            (option) =>
              `
              <option value="${esc(option)}">
                ${esc(
                  t(option)
                )}
              </option>
              `
          )
          .join("")}

      </select>
    `;

  } else {

    controlHTML = `

      <input
        id="${esc(id)}"
        class="ef-input"
        type="text"
        data-editor-field
        data-field-index="${index}"
        data-field-name="${esc(name)}"
      >
    `;
  }

  wrapper.innerHTML = `

    <label
      for="${esc(id)}"
      class="ef-label"
    >
      ${esc(
        t(name)
      )}
      <small>
        ${esc(
          t("optional")
        )}
      </small>
    </label>

    ${controlHTML}
  `;

  return wrapper;
}


/* =========================================================
   COMMON FIELDS
   ========================================================= */

function appendCommonFields(
  container
) {

  const quantity =
    document.createElement(
      "div"
    );

  quantity.className =
    "editor-field required-field";

  quantity.innerHTML = `

    <label
      for="ef-quantity"
      class="ef-label"
    >
      ${esc(
        t("quantity")
      )}
      <b>*</b>
    </label>

    <input
      id="ef-quantity"
      class="ef-input"
      type="number"
      min="0"
      step="any"
      inputmode="decimal"
      data-common-field="quantity"
    >
  `;

  container.appendChild(
    quantity
  );


  const unit =
    document.createElement(
      "div"
    );

  unit.className =
    "editor-field";

  unit.innerHTML = `

    <label
      for="ef-unit"
      class="ef-label"
    >
      ${esc(
        t("unit")
      )}
    </label>

    <input
      id="ef-unit"
      class="ef-input"
      type="text"
      list="ef-unit-list"
      value=""
      data-common-field="unit"
    >

    <datalist id="ef-unit-list">

      <option value="Nos"></option>
      <option value="Piece"></option>
      <option value="Meter"></option>
      <option value="Feet"></option>
      <option value="Point"></option>
      <option value="Box"></option>
      <option value="Set"></option>
      <option value="Roll"></option>
      <option value="Packet"></option>

    </datalist>
  `;

  container.appendChild(
    unit
  );


  const brand =
    document.createElement(
      "div"
    );

  brand.className =
    "editor-field";

  brand.innerHTML = `

    <label
      for="ef-brand"
      class="ef-label"
    >
      ${esc(
        t("brand")
      )}
      <small>
        ${esc(
          t("optional")
        )}
      </small>
    </label>

    <input
      id="ef-brand"
      class="ef-input"
      type="text"
      data-common-field="brand"
    >
  `;

  container.appendChild(
    brand
  );


  const price =
    document.createElement(
      "div"
    );

  price.className =
    "editor-field optional-price";

  price.innerHTML = `

    <label
      for="ef-price"
      class="ef-label"
    >
      ${esc(
        t("price")
      )}
      <small>
        ${esc(
          t("optional")
        )}
      </small>
    </label>

    <input
      id="ef-price"
      class="ef-input"
      type="number"
      min="0"
      step="any"
      inputmode="decimal"
      data-common-field="price"
    >
  `;

  container.appendChild(
    price
  );
}


/* =========================================================
   RESTORE EDITOR VALUES
   ========================================================= */

function restoreDraftValues() {

  const draft =
    EF.currentDraft || {};

  const fieldValues =
    draft.fields || {};

  document
    .querySelectorAll(
      "[data-editor-field]"
    )
    .forEach(
      (input) => {

        const name =
          input.dataset.fieldName;

        let value =
          Object.prototype.hasOwnProperty.call(
            fieldValues,
            name
          )
            ? fieldValues[name]
            : "";

        input.value =
          value ?? "";
      }
    );

  const quantity =
    document.querySelector(
      '[data-common-field="quantity"]'
    );

  const unit =
    document.querySelector(
      '[data-common-field="unit"]'
    );

  const brand =
    document.querySelector(
      '[data-common-field="brand"]'
    );

  const price =
    document.querySelector(
      '[data-common-field="price"]'
    );

  if (quantity) {

    quantity.value =
      draft.quantity ?? "";
  }

  if (unit) {

    unit.value =
      draft.unit ||
      EF.unitCarry ||
      "";
  }

  if (brand) {

    brand.value =
      draft.brand ?? "";
  }

  if (price) {

    price.value =
      draft.price ?? "";
  }
}


/* =========================================================
   READ EDITOR
   ========================================================= */

function readEditor() {

  const fields = {};

  document
    .querySelectorAll(
      "[data-editor-field]"
    )
    .forEach(
      (input) => {

        fields[
          input.dataset.fieldName
        ] =
          input.value.trim();
      }
    );

  const quantity =
    document
      .querySelector(
        '[data-common-field="quantity"]'
      )
      ?.value
      ?.trim() || "";

  const unit =
    document
      .querySelector(
        '[data-common-field="unit"]'
      )
      ?.value
      ?.trim() || "";

  const brand =
    document
      .querySelector(
        '[data-common-field="brand"]'
      )
      ?.value
      ?.trim() || "";

  const price =
    document
      .querySelector(
        '[data-common-field="price"]'
      )
      ?.value
      ?.trim() || "";

  return {

    fields,

    quantity,

    unit,

    brand,

    price
  };
}


/* =========================================================
   SAVE CURRENT DRAFT
   ========================================================= */

function captureCurrentDraft() {

  if (
    EF.route !== "editor" ||
    !EF.currentMaterial
  ) {
    return;
  }

  const data =
    readEditor();

  EF.currentDraft = data;

  if (data.unit) {

    EF.unitCarry =
      data.unit;

    storageSet(
      STORAGE.lastUnit,
      data.unit
    );
  }

  saveDraft();
}


/* =========================================================
   VALIDATE
   ========================================================= */

function validateQuantity(
  quantity
) {

  if (
    quantity === "" ||
    quantity === null ||
    quantity === undefined
  ) {

    showToast(
      t("requiredQuantity")
    );

    const input =
      document.querySelector(
        '[data-common-field="quantity"]'
      );

    input?.focus();

    return false;
  }

  const number =
    Number(quantity);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {

    showToast(
      t("requiredQuantity")
    );

    const input =
      document.querySelector(
        '[data-common-field="quantity"]'
      );

    input?.focus();

    return false;
  }

  return true;
}


/* =========================================================
   BUILD ESTIMATE ITEM
   ========================================================= */

function buildEstimateItem(
  data
) {

  return {

    id:
      `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`,

    stage:
      EF.currentStage
        ? getStageName(
            EF.currentStage
          )
        : "",

    stageTitle:
      EF.currentStage
        ? getStageTitle(
            EF.currentStage
          )
        : "",

    section:
      EF.currentSection || "",

    material:
      materialName(
        EF.currentMaterial
      ),

    fields:
      {
        ...data.fields
      },

    quantity:
      data.quantity,

    unit:
      data.unit,

    brand:
      data.brand,

    price:
      data.price,

    createdAt:
      Date.now()
  };
}


/* =========================================================
   ADD CURRENT ITEM
   ========================================================= */

function saveCurrentItem() {

  if (
    !EF.currentMaterial
  ) {
    return;
  }

  const data =
    readEditor();

  if (
    !validateQuantity(
      data.quantity
    )
  ) {
    return;
  }

  EF.currentDraft =
    data;

  if (data.unit) {

    EF.unitCarry =
      data.unit;

    storageSet(
      STORAGE.lastUnit,
      data.unit
    );
  }

  const item =
    buildEstimateItem(
      data
    );

  EF.estimate.push(
    item
  );

  saveEstimate();

  clearDraft();

  showToast(
    t("itemAdded")
  );

  /*
    IMPORTANT:
    Add = SAVE + NEXT

    Next = NEVER SAVE
  */

  setTimeout(
    () => {

      goNextMaterial();

    },
    220
  );
}


/* =========================================================
   NEXT MATERIAL
   ========================================================= */

function goNextMaterial() {

  const list =
    getCurrentMaterialList();

  if (!list.length) {
    return;
  }

  let nextIndex =
    EF.currentMaterialIndex + 1;

  if (
    nextIndex >= list.length
  ) {

    EF.route =
      "materials";

    EF.currentMaterial =
      null;

    EF.currentMaterialIndex =
      0;

    EF.currentDraft =
      {};

    clearDraft();

    saveRoute();

    renderMaterials();

    scrollTop();

    return;
  }

  EF.currentMaterial =
    list[nextIndex];

  EF.currentMaterialIndex =
    nextIndex;

  EF.currentDraft =
    {};

  clearDraft();

  EF.route =
    "editor";

  saveRoute();

  /*
    Carry Unit only.
    Quantity / Brand / Price / fields
    are NOT carried forward.
  */

  renderEditor();

  scrollTop();
}


/* =========================================================
   PREVIOUS MATERIAL
   ========================================================= */

function goPreviousMaterial() {

  const list =
    getCurrentMaterialList();

  if (!list.length) {
    return;
  }

  captureCurrentDraft();

  let previousIndex =
    EF.currentMaterialIndex - 1;

  if (previousIndex < 0) {

    navigate(
      EF.currentSection
        ? "section"
        : "stage"
    );

    return;
  }

  EF.currentMaterial =
    list[previousIndex];

  EF.currentMaterialIndex =
    previousIndex;

  EF.currentDraft =
    {};

  clearDraft();

  EF.route =
    "editor";

  saveRoute();

  renderEditor();

  scrollTop();
}


/* =========================================================
   EDITOR BUTTONS
   ========================================================= */

function updateEditorButtons() {

  const add =
    EF.ids.addBtn;

  const next =
    EF.ids.nextBtn;

  const back =
    EF.ids.backBtn;

  if (add) {
    add.textContent =
      t("add");
  }

  if (next) {
    next.textContent =
      t("next");
  }

  if (back) {
    back.textContent =
      t("back");
  }
}


/* =========================================================
   ESTIMATE PAGE
   ========================================================= */

function renderEstimate() {

  hideAllPages();

  showPage("estimate");

  updateTopBar();

  updateEstimateCount();

  const list =
    EF.ids.estimateList;

  if (!list) {
    return;
  }

  list.innerHTML = "";

  if (!EF.estimate.length) {

    list.innerHTML =
      `<div class="empty-state">
        ${esc(
          t("noEstimate")
        )}
      </div>`;

    return;
  }

  EF.estimate.forEach(
    (item, index) => {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "estimate-item";

      const fieldText =
        Object.entries(
          item.fields || {}
        )
        .filter(
          ([, value]) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        )
        .map(
          ([key, value]) =>
            `${t(key)}: ${t(value)}`
        )
        .join(" • ");

      card.innerHTML = `

        <div class="estimate-item-main">

          <span class="estimate-item-number">
            ${index + 1}
          </span>

          <div>

            <strong>
              ${esc(
                t(item.material)
              )}
            </strong>

            <small>
              ${
                item.section
                  ? esc(
                      t(item.section)
                    )
                  : ""
              }
            </small>

            ${
              fieldText
                ? `<p>${esc(
                    fieldText
                  )}</p>`
                : ""
            }

            <p>
              ${esc(
                t("quantity")
              )}: ${esc(
                item.quantity
              )}
              ${
                item.unit
                  ? ` ${esc(
                      t(item.unit)
                    )}`
                  : ""
              }
            </p>

            ${
              item.brand
                ? `<p>${esc(
                    t("brand")
                  )}: ${esc(
                    item.brand
                  )}</p>`
                : ""
            }

          </div>

        </div>

        <div class="estimate-item-actions">

          <button
            type="button"
            class="edit-estimate"
            data-index="${index}"
          >
            ${esc(
              t("edit")
            )}
          </button>

          <button
            type="button"
            class="delete-estimate"
            data-index="${index}"
          >
            ${esc(
              t("delete")
            )}
          </button>

        </div>
      `;

      list.appendChild(
        card
      );
    }
  );

  list
    .querySelectorAll(
      ".edit-estimate"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () =>
            editEstimateItem(
              Number(
                button.dataset.index
              )
            )
        );
      }
    );

  list
    .querySelectorAll(
      ".delete-estimate"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () =>
            deleteEstimateItem(
              Number(
                button.dataset.index
              )
            )
        );
      }
    );
}


/* =========================================================
   EDIT ESTIMATE ITEM
   ========================================================= */

function editEstimateItem(
  index
) {

  const item =
    EF.estimate[index];

  if (!item) {
    return;
  }

  const entry =
    findMaterialEntry(
      item.stage,
      item.section,
      item.material
    );

  if (!entry) {
    return;
  }

  EF.currentStage =
    entry.stage;

  EF.currentSection =
    entry.section;

  EF.currentSectionItems =
    entry.section
      ? getSectionMaterials(
          entry.sectionData
        )
      : getDirectMaterials(
          entry.stage
        );

  EF.currentMaterial =
    entry.material;

  EF.currentMaterialIndex =
    entry.materialIndex;

  /*
    IMPORTANT:
    Do NOT use Object.values(item.fields)
    because field order can change.

    Match values by FIELD NAME.
  */

  EF.currentDraft = {

    fields:
      {
        ...(item.fields || {})
      },

    quantity:
      item.quantity || "",

    unit:
      item.unit || "",

    brand:
      item.brand || "",

    price:
      item.price || "",

    editingIndex:
      index
  };

  EF.route =
    "editor";

  saveRoute();

  history.pushState(
    {
      route: "editor",

      stage:
        item.stage,

      section:
        item.section,

      materialIndex:
        entry.materialIndex,

      editingIndex:
        index
    },
    "",
    location.href
  );

  renderEditor();

  scrollTop();
}


/* =========================================================
   UPDATE ESTIMATE ITEM
   ========================================================= */

function updateCurrentEstimateItem() {

  const editingIndex =
    EF.currentDraft
      ?.editingIndex;

  if (
    editingIndex === undefined ||
    editingIndex === null
  ) {
    return false;
  }

  const data =
    readEditor();

  if (
    !validateQuantity(
      data.quantity
    )
  ) {
    return false;
  }

  const old =
    EF.estimate[
      Number(editingIndex)
    ];

  if (!old) {
    return false;
  }

  EF.estimate[
    Number(editingIndex)
  ] = {

    ...old,

    fields:
      {
        ...data.fields
      },

    quantity:
      data.quantity,

    unit:
      data.unit,

    brand:
      data.brand,

    price:
      data.price,

    updatedAt:
      Date.now()
  };

  saveEstimate();

  clearDraft();

  showToast(
    t("updated")
  );

  navigate(
    "estimate"
  );

  return true;
}


/* =========================================================
   DELETE ESTIMATE
   ========================================================= */

function deleteEstimateItem(
  index
) {

  if (
    !EF.estimate[index]
  ) {
    return;
  }

  EF.estimate.splice(
    index,
    1
  );

  saveEstimate();

  showToast(
    t("deleted")
  );

  renderEstimate();
}


/* =========================================================
   SEARCH
   ========================================================= */

function applySearch(
  value
) {

  EF.searchText =
    String(value || "")
      .trim();

  if (
    EF.route === "materials" ||
    EF.route === "section"
  ) {

    const grid =
      EF.ids.materialGrid;

    if (grid) {

      const filtered =
        getFilteredMaterials(
          getCurrentMaterialList()
        );

      renderMaterialCards(
        filtered,
        grid
      );
    }
  }
}


function clearSearch() {

  EF.searchText =
    "";

  if (
    EF.ids.searchInput
  ) {

    EF.ids.searchInput.value =
      "";
  }

  applySearch("");
}


/* =========================================================
   FILTER PANEL
   ========================================================= */

function openFilter() {

  EF.filterOpen =
    true;

  const panel =
    EF.ids.filterPanel;

  if (!panel) {
    return;
  }

  panel.classList.add(
    "open",
    "active"
  );

  panel.hidden =
    false;
}


function closeFilter() {

  EF.filterOpen =
    false;

  const panel =
    EF.ids.filterPanel;

  if (!panel) {
    return;
  }

  panel.classList.remove(
    "open",
    "active"
  );

  panel.hidden =
    true;
}


function clearFilters() {

  EF.selectedFilters = {

    stage: "",

    section: "",

    type: "",

    size: "",

    brand: ""
  };

  document
    .querySelectorAll(
      "[data-filter], #stageFilter, #sectionFilter, #typeFilter, #sizeFilter, #brandFilter"
    )
    .forEach(
      (control) => {

        control.value =
          "";
      }
    );

  closeFilter();

  applySearch(
    EF.searchText
  );

  showToast(
    t("clear")
  );
}


function applyFilterControl(
  control
) {

  if (!control) {
    return;
  }

  let key =
    control.dataset.filter ||
    control.id ||
    "";

  key =
    normalizeFilterKey(
      key
    );

  if (
    !Object.prototype.hasOwnProperty.call(
      EF.selectedFilters,
      key
    )
  ) {
    return;
  }

  EF.selectedFilters[key] =
    control.value || "";

  applySearch(
    EF.searchText
  );

  showToast(
    t("filterApplied")
  );
}


function normalizeFilterKey(
  key
) {

  const value =
    normalize(key)
      .replace(/filter$/, "");

  const map = {

    stage: "stage",

    section: "section",

    type: "type",

    size: "size",

    brand: "brand"
  };

  return (
    map[value] ||
    value
  );
}


/* =========================================================
   FILTER OPTION POPULATION
   ========================================================= */

function populateFilterOptions() {

  const all =
    getAllMaterialEntries();

  const stages =
    unique(
      all.map(
        (entry) =>
          entry.stageName
      )
    );

  const sections =
    unique(
      all
        .map(
          (entry) =>
            entry.section
        )
        .filter(Boolean)
    );

  const types =
    unique(
      all.flatMap(
        (entry) =>
          getFieldValueSet(
            entry.material,
            ["Type"]
          )
      )
    );

  const sizes =
    unique(
      all.flatMap(
        (entry) =>
          getFieldValueSet(
            entry.material,
            ["Size"]
          )
      )
    );

  const brands =
    unique(
      all.flatMap(
        (entry) =>
          getFieldValueSet(
            entry.material,
            ["Brand"]
          )
      )
    );

  setFilterOptions(
    ["#stageFilter"],
    stages
  );

  setFilterOptions(
    ["#sectionFilter"],
    sections
  );

  setFilterOptions(
    ["#typeFilter"],
    types
  );

  setFilterOptions(
    ["#sizeFilter"],
    sizes
  );

  setFilterOptions(
    ["#brandFilter"],
    brands
  );
}


function setFilterOptions(
  selectors,
  values
) {

  selectors.forEach(
    (selector) => {

      const select =
        document.querySelector(
          selector
        );

      if (!select) {
        return;
      }

      const current =
        select.value;

      const first =
        select.querySelector(
          "option:first-child"
        );

      select.innerHTML = "";

      if (first) {

        select.appendChild(
          first
        );

      } else {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          "";

        option.textContent =
          t("all");

        select.appendChild(
          option
        );
      }

      values.forEach(
        (value) => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            value;

          option.textContent =
            t(value);

          select.appendChild(
            option
          );
        }
      );

      select.value =
        current || "";
    }
  );
}


function unique(
  array
) {

  return Array.from(
    new Set(
      array
        .filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        )
        .map(
          (value) =>
            String(value)
        )
    )
  );
}


/* =========================================================
   CALCULATOR
   ========================================================= */

function renderCalculator() {

  hideAllPages();

  showPage("calculator");

  updateTopBar();
}


/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings() {

  hideAllPages();

  showPage("settings");

  updateTopBar();

  renderLanguageButtons();

  updateThemeControls();
}


/* =========================================================
   CURRENT PAGE
   ========================================================= */

function renderCurrentPage() {

  switch (
    EF.route
  ) {

    case "home":

      renderHome();

      break;


    case "stage":

      if (
        EF.currentStage
      ) {

        renderStage();

      } else {

        EF.route =
          "home";

        renderHome();
      }

      break;


    case "section":

      if (
        EF.currentStage &&
        EF.currentSection
      ) {

        renderSection();

      } else {

        EF.route =
          "home";

        renderHome();
      }

      break;


    case "materials":

      if (
        EF.currentStage
      ) {

        renderMaterials();

      } else {

        EF.route =
          "home";

        renderHome();
      }

      break;


    case "editor":

      if (
        EF.currentMaterial
      ) {

        renderEditor();

      } else {

        EF.route =
          "home";

        renderHome();
      }

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


    default:

      EF.route =
        "home";

      renderHome();
  }

  updateEstimateCount();

  updateTopBar();
}


/* =========================================================
   RESTORE ROUTE
   ========================================================= */

function restoreRoute() {

  const data =
    loadRouteData();

  if (!data) {

    EF.route =
      "home";

    renderHome();

    return;
  }

  if (
    data.stage
  ) {

    const stage =
      EF.materials.find(
        (item) =>
          getStageName(item) ===
          data.stage
      );

    if (stage) {

      EF.currentStage =
        stage;
    }
  }

  EF.currentSection =
    data.section || "";

  if (
    EF.currentStage &&
    EF.currentSection
  ) {

    const section =
      getSections(
        EF.currentStage
      ).find(
        (item) =>
          getSectionName(item) ===
          EF.currentSection
      );

    if (section) {

      EF.currentSectionItems =
        getSectionMaterials(
          section
        );
    }
  }

  EF.currentMaterialIndex =
    Number(
      data.materialIndex || 0
    );

  if (
    data.material &&
    EF.currentStage
  ) {

    const entry =
      findMaterialEntry(
        data.stage,
        data.section || "",
        data.material
      );

    if (entry) {

      EF.currentMaterial =
        entry.material;

      EF.currentMaterialIndex =
        entry.materialIndex;

      EF.currentStage =
        entry.stage;

      EF.currentSection =
        entry.section;

      EF.currentSectionItems =
        entry.section
          ? getSectionMaterials(
              entry.sectionData
            )
          : getDirectMaterials(
              entry.stage
            );
    }
  }

  EF.route =
    data.route || "home";

  /*
    Restore draft only for editor.
  */

  if (
    EF.route === "editor"
  ) {

    const draft =
      loadDraft();

    if (draft) {

      EF.currentDraft =
        draft.draft || {};

      if (
        draft.unitCarry
      ) {

        EF.unitCarry =
          draft.unitCarry;
      }
    }
  }

  renderCurrentPage();
}


/* =========================================================
   HISTORY / BACK
   ========================================================= */

function initializeHistory() {

  history.replaceState(
    {
      route:
        EF.route || "home",

      app:
        "sandeep-electrofix"
    },
    "",
    location.href
  );
}


function handleBrowserBack(
  event
) {

  /*
    Drawer has highest priority.
  */

  if (
    EF.drawerOpen
  ) {

    closeDrawer(
      true
    );

    return;
  }

  /*
    Filter closes before route navigation.
  */

  if (
    EF.filterOpen
  ) {

    closeFilter();

    history.pushState(
      history.state,
      "",
      location.href
    );

    return;
  }

  /*
    View menu closes before route navigation.
  */

  const viewOpen =
    document.querySelector(
      "[data-view-options]:not([hidden])"
    );

  if (viewOpen) {

    closeAllViewOptions();

    history.pushState(
      history.state,
      "",
      location.href
    );

    return;
  }

  /*
    Editor -> Materials
  */

  if (
    EF.route === "editor"
  ) {

    captureCurrentDraft();

    EF.route =
      "materials";

    EF.currentMaterial =
      null;

    EF.currentDraft =
      {};

    saveRoute();

    renderMaterials();

    scrollTop();

    return;
  }

  /*
    Materials -> Section / Stage
  */

  if (
    EF.route === "materials"
  ) {

    EF.route =
      EF.currentSection
        ? "section"
        : "stage";

    EF.currentMaterial =
      null;

    saveRoute();

    if (
      EF.route === "section"
    ) {

      renderSection();

    } else {

      renderStage();
    }

    scrollTop();

    return;
  }

  /*
    Section -> Stage
  */

  if (
    EF.route === "section"
  ) {

    EF.currentSection =
      null;

    EF.currentSectionItems =
      [];

    EF.route =
      "stage";

    saveRoute();

    renderStage();

    scrollTop();

    return;
  }

  /*
    Stage -> Home
  */

  if (
    EF.route === "stage"
  ) {

    EF.currentStage =
      null;

    EF.currentSection =
      null;

    EF.currentSectionItems =
      [];

    EF.currentMaterial =
      null;

    EF.currentMaterialIndex =
      0;

    EF.route =
      "home";

    saveRoute();

    renderHome();

    scrollTop();

    return;
  }

  /*
    Estimate / Calculator / Settings -> Home
  */

  if (
    EF.route === "estimate" ||
    EF.route === "calculator" ||
    EF.route === "settings"
  ) {

    EF.route =
      "home";

    saveRoute();

    renderHome();

    scrollTop();
  }
}


/* =========================================================
   NAVIGATION TO HOME / ESTIMATE ETC.
   ========================================================= */

function goHome() {

  EF.currentStage =
    null;

  EF.currentSection =
    null;

  EF.currentSectionItems =
    [];

  EF.currentMaterial =
    null;

  EF.currentMaterialIndex =
    0;

  EF.currentDraft =
    {};

  clearDraft();

  navigate(
    "home"
  );

  scrollTop();
}


function goEstimate() {

  captureCurrentDraft();

  navigate(
    "estimate"
  );

  scrollTop();
}


function goCalculator() {

  captureCurrentDraft();

  navigate(
    "calculator"
  );

  scrollTop();
}


function goSettings() {

  captureCurrentDraft();

  navigate(
    "settings"
  );

  scrollTop();
}


/* =========================================================
   RESET APP
   ========================================================= */

function resetApp() {

  const confirmed =
    window.confirm(
      t("resetConfirm")
    );

  if (!confirmed) {
    return;
  }

  EF.estimate =
    [];

  EF.currentStage =
    null;

  EF.currentSection =
    null;

  EF.currentSectionItems =
    [];

  EF.currentMaterial =
    null;

  EF.currentMaterialIndex =
    0;

  EF.currentDraft =
    {};

  EF.searchText =
    "";

  EF.selectedFilters = {

    stage: "",

    section: "",

    type: "",

    size: "",

    brand: ""
  };

  EF.unitCarry =
    "";

  storageRemove(
    STORAGE.estimate
  );

  storageRemove(
    STORAGE.route
  );

  storageRemove(
    STORAGE.draft
  );

  storageRemove(
    STORAGE.lastUnit
  );

  if (
    EF.ids.searchInput
  ) {

    EF.ids.searchInput.value =
      "";
  }

  clearFilters();

  EF.route =
    "home";

  history.replaceState(
    {
      route: "home",

      app:
        "sandeep-electrofix"
    },
    "",
    location.href
  );

  saveRoute();

  updateEstimateCount();

  renderHome();

  showToast(
    t("reset")
  );

  scrollTop();
}


/* =========================================================
   DRAWER NAV ITEM
   ========================================================= */

function handleNavigationAction(
  action
) {

  switch (
    action
  ) {

    case "home":

      closeDrawer();

      goHome();

      break;


    case "estimate":

      closeDrawer();

      goEstimate();

      break;


    case "calculator":

      closeDrawer();

      goCalculator();

      break;


    case "settings":

      closeDrawer();

      goSettings();

      break;


    case "reset":

      closeDrawer();

      resetApp();

      break;
  }
}


/* =========================================================
   BIND EVENTS
   ========================================================= */

function bindEvents() {

  /*
    Hamburger
  */

  EF.ids.menuBtn
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        if (
          EF.drawerOpen
        ) {

          closeDrawer();

        } else {

          openDrawer();
        }
      }
    );


  /*
    Drawer close
  */

  EF.ids.closeMenu
    ?.addEventListener(
      "click",
      () =>
        closeDrawer()
    );


  EF.ids.drawerOverlay
    ?.addEventListener(
      "click",
      () =>
        closeDrawer()
    );


  /*
    Theme
  */

  EF.ids.themeBtn
    ?.addEventListener(
      "click",
      () =>
        toggleTheme()
    );


  /*
    Language buttons
  */

  EF.ids.languageButtons
    ?.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            setLanguage(
              button.dataset.language
            );
          }
        );
      }
    );


  /*
    Reset
  */

  EF.ids.resetBtn
    ?.addEventListener(
      "click",
      () =>
        resetApp()
    );


  /*
    Drawer navigation
  */

  document
    .querySelectorAll(
      "[data-nav], [data-route]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const action =
              button.dataset.nav ||
              button.dataset.route;

            handleNavigationAction(
              action
            );
          }
        );
      }
    );


  /*
    Bottom navigation
  */

  EF.ids.bottomNav
    ?.querySelectorAll(
      "[data-nav], [data-route]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const action =
              button.dataset.nav ||
              button.dataset.route;

            handleNavigationAction(
              action
            );
          }
        );
      }
    );


  /*
    Search
  */

  EF.ids.searchInput
    ?.addEventListener(
      "input",
      (event) => {

        applySearch(
          event.target.value
        );
      }
    );


  EF.ids.searchClear
    ?.addEventListener(
      "click",
      () =>
        clearSearch()
    );


  /*
    Filter button
  */

  EF.ids.filterBtn
    ?.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        if (
          EF.filterOpen
        ) {

          closeFilter();

        } else {

          openFilter();
        }
      }
    );


  /*
    Filter clear
  */

  EF.ids.filterClear
    ?.addEventListener(
      "click",
      () =>
        clearFilters()
    );


  /*
    Filters
  */

  document
    .querySelectorAll(
      "[data-filter], #stageFilter, #sectionFilter, #typeFilter, #sizeFilter, #brandFilter"
    )
    .forEach(
      (control) => {

        control.addEventListener(
          "change",
          () =>
            applyFilterControl(
              control
            )
        );
      }
    );


  /*
    Add
  */

  EF.ids.addBtn
    ?.addEventListener(
      "click",
      () => {

        /*
          If editing existing estimate item:
          update instead of adding duplicate.
        */

        if (
          EF.currentDraft &&
          EF.currentDraft.editingIndex !==
            undefined
        ) {

          updateCurrentEstimateItem();

        } else {

          saveCurrentItem();
        }
      }
    );


  /*
    Next
  */

  EF.ids.nextBtn
    ?.addEventListener(
      "click",
      () => {

        /*
          IMPORTANT:
          NEXT NEVER SAVES.

          It only changes material.
        */

        captureCurrentDraft();

        goNextMaterial();
      }
    );


  /*
    Previous / Back
  */

  EF.ids.backBtn
    ?.addEventListener(
      "click",
      () => {

        captureCurrentDraft();

        goPreviousMaterial();
      }
    );


  /*
    Global view selector
  */

  EF.ids.globalViewTrigger
    ?.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        const options =
          EF.ids.globalViewOptions;

        if (!options) {
          return;
        }

        const open =
          !options.hidden;

        closeAllViewOptions();

        if (!open) {

          options.hidden =
            false;

          EF.ids.globalViewTrigger
            .setAttribute(
              "aria-expanded",
              "true"
            );
        }
      }
    );


  EF.ids.globalViewOptions
    ?.querySelectorAll(
      "[data-view], [data-view-option]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const view =
              button.dataset.view ||
              button.dataset.viewOption;

            setView(
              view
            );

            closeAllViewOptions();
          }
        );
      }
    );


  /*
    Escape
  */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key !== "Escape"
      ) {
        return;
      }

      if (
        EF.drawerOpen
      ) {

        closeDrawer();

        return;
      }

      if (
        EF.filterOpen
      ) {

        closeFilter();

        return;
      }

      closeAllViewOptions();
    }
  );


  /*
    Browser / Android Back
  */

  window.addEventListener(
    "popstate",
    (event) => {

      if (
        EF.drawerHistoryActive
      ) {

        EF.drawerHistoryActive =
          false;

        closeDrawer(
          true
        );

        return;
      }

      handleBrowserBack(
        event
      );
    }
  );


  /*
    Before leaving / refresh:
    preserve current editor draft.
  */

  window.addEventListener(
    "beforeunload",
    () => {

      captureCurrentDraft();

      saveRoute();
    }
  );


  /*
    Outside click closes menus.
  */

  document.addEventListener(
    "click",
    (event) => {

      if (
        !event.target.closest(
          ".material-view-selector"
        ) &&
        !event.target.closest(
          "#viewModeBtn"
        ) &&
        !event.target.closest(
          "#viewSelector"
        ) &&
        !event.target.closest(
          "#materialViewSelector"
        )
      ) {

        closeAllViewOptions();
      }

      if (
        EF.filterOpen &&
        EF.ids.filterPanel &&
        !EF.ids.filterPanel.contains(
          event.target
        ) &&
        !event.target.closest(
          "#filterBtn"
        ) &&
        !event.target.closest(
          "#filterButton"
        )
      ) {

        closeFilter();
      }
    }
  );


  /*
    Generic action buttons.
  */

  document
    .querySelectorAll(
      "[data-action]"
    )
    .forEach(
      (button) => {

        if (
          button.dataset.actionBound ===
          "1"
        ) {
          return;
        }

        button.dataset.actionBound =
          "1";

        button.addEventListener(
          "click",
          () => {

            const action =
              button.dataset.action;

            switch (
              action
            ) {

              case "home":
                goHome();
                break;

              case "estimate":
                goEstimate();
                break;

              case "calculator":
                goCalculator();
                break;

              case "settings":
                goSettings();
                break;

              case "reset":
                resetApp();
                break;

              case "drawer":
                openDrawer();
                break;

              case "close-drawer":
                closeDrawer();
                break;
            }
          }
        );
      }
    );
}


/* =========================================================
   LANGUAGE RERENDER SAFETY
   ========================================================= */

function refreshStaticLanguage() {

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      (element) => {

        const key =
          element.dataset.i18n;

        if (
          Object.prototype.hasOwnProperty.call(
            HI,
            key
          )
        ) {

          element.textContent =
            t(key);
        }
      }
    );


  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach(
      (element) => {

        const key =
          element.dataset.i18nPlaceholder;

        element.placeholder =
          t(key);
      }
    );


  document
    .querySelectorAll(
      "[data-i18n-title]"
    )
    .forEach(
      (element) => {

        const key =
          element.dataset.i18nTitle;

        element.title =
          t(key);
      }
    );
}


/* =========================================================
   INIT
   ========================================================= */

function initEstimateApp() {

  if (
    EF.initialized
  ) {
    return;
  }

  EF.initialized =
    true;

  cacheDOM();

  loadEstimate();

  /*
    Validate language.
  */

  EF.language =
    EF.language === "en"
      ? "en"
      : "hi";

  /*
    Validate view.
  */

  const validViews = [

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
  ];

  if (
    !validViews.includes(
      EF.view
    )
  ) {

    EF.view =
      "grid";
  }

  /*
    Theme.
  */

  applyTheme();

  /*
    Language.
  */

  renderLanguageButtons();

  refreshStaticLanguage();

  /*
    Filters.
  */

  populateFilterOptions();

  /*
    Events.
  */

  bindEvents();

  /*
    Browser history.
  */

  initializeHistory();

  /*
    Count.
  */

  updateEstimateCount();

  /*
    Remove loader.
  */

  hideLoader();

  /*
    Restore page.
  */

  setTimeout(
    () => {

      restoreRoute();

      refreshStaticLanguage();

      bindViewOptionListeners();

      syncViewSelector();

      updateViewClasses();

    },
    30
  );
}


/* =========================================================
   AUTO INIT
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initEstimateApp,
    {
      once: true
    }
  );

} else {

  initEstimateApp();
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.ElectroFixApp = {

  state:
    EF,

  init:
    initEstimateApp,

  home:
    goHome,

  estimate:
    goEstimate,

  calculator:
    goCalculator,

  settings:
    goSettings,

  reset:
    resetApp,

  setLanguage:
    setLanguage,

  toggleTheme:
    toggleTheme,

  setView:
    setView,

  search:
    applySearch,

  clearSearch:
    clearSearch,

  openDrawer:
    openDrawer,

  closeDrawer:
    closeDrawer,

  openStage:
    openStage,

  openSection:
    openSection,

  openMaterials:
    openMaterials,

  openEditor:
    openEditor,

  add:
    saveCurrentItem,

  next:
    goNextMaterial,

  previous:
    goPreviousMaterial
};
