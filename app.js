/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   FINAL MASTER DATA:
   material.js = 91 MATERIAL ENTRIES

   FILES:
   index.html
   style.css
   config.js
   material.js
   app.js

   FLOW:
   HOME
     ↓
   STAGE
     ↓
   SECTION
     ↓
   MATERIAL
     ↓
   EDITOR
     ↓
   ADD / NEXT

   IMPORTANT:
   - material.js is NOT modified
   - No duplicate master data here
   - Quantity required
   - Other fields optional
   - Brand optional
   - Price optional
   - No auto-add on Next
   - Unit carry-forward
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL
   ========================================================= */

const EF = {

  materials: Array.isArray(window.MATERIALS)
    ? window.MATERIALS
    : [],

  estimate: [],

  language: localStorage.getItem("sandeepMaterialLang") || "hi",

  theme: localStorage.getItem("sandeepTheme") || "dark",

  view: localStorage.getItem("sandeepMaterialView") || "grid",

  route: localStorage.getItem("sandeepEstimateRoute") || "home",

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

  ignorePopState: false,

  unitCarry: localStorage.getItem("sandeepLastUnit") || "",

  ids: {},

  initialized: false

};


/* =========================================================
   DOM HELPER
   ========================================================= */

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function byId(id) {
  return document.getElementById(id);
}


/* =========================================================
   DOM ALIASES
   Works with old + latest index.html IDs
   ========================================================= */

function cacheDOM() {

  EF.ids = {

    app:
      byId("app"),

    main:
      byId("main"),

    home:
      byId("home"),

    topBar:
      byId("topBar"),

    topBarTitle:
      byId("topBarTitle"),

    menuBtn:
      byId("menuBtn") ||
      byId("hamburgerButton"),

    drawer:
      byId("drawer") ||
      byId("sideMenu"),

    drawerOverlay:
      byId("drawerOverlay") ||
      byId("menuOverlay"),

    closeMenu:
      byId("closeMenu") ||
      byId("sideMenuClose"),

    langBtn:
      byId("langBtn") ||
      byId("languageButton"),

    themeBtn:
      byId("themeBtn") ||
      byId("themeButton") ||
      byId("themeToggleButton"),

    stageGrid:
      byId("stageGrid"),

    materialGrid:
      byId("materialGrid"),

    bottomNav:
      byId("bottomNav") ||
      byId("bottomNavigation"),

    toast:
      byId("toast"),

    search:
      byId("searchInput") ||
      byId("materialSearch") ||
      $("input[type='search']"),

    filterIcon:
      byId("filter-icon") ||
      byId("filterIcon"),

    filterPanel:
      byId("filterPanel"),

    clearFilter:
      byId("clearFilter"),

    stageFilter:
      byId("stageFilter"),

    typeFilter:
      byId("typeFilter"),

    sizeFilter:
      byId("sizeFilter"),

    brandFilter:
      byId("brandFilter"),

    viewTrigger:
      byId("viewTrigger"),

    viewOptions:
      byId("viewOptions"),

    route:
      byId("efRoute"),

    saveItem:
      byId("saveItem"),

    nextItem:
      byId("nextItem"),

    quantityInput:
      byId("quantityInput"),

    unitInput:
      byId("unitInput"),

    brandInput:
      byId("brandInput"),

    estimateList:
      byId("estimateList"),

    estimateCount:
      byId("estimateCount"),

    langHi:
      byId("langHi"),

    langEn:
      byId("langEn"),

    loadingScreen:
      byId("loadingScreen")

  };

}


/* =========================================================
   CONFIG HELPER
   ========================================================= */

function configValue(path, fallback) {

  try {

    let obj = window.EF_CONFIG ||
              window.CONFIG ||
              window.APP_CONFIG ||
              {};

    const parts = path.split(".");

    for (const part of parts) {

      if (obj && Object.prototype.hasOwnProperty.call(obj, part)) {
        obj = obj[part];
      } else {
        return fallback;
      }

    }

    return obj;

  } catch (e) {

    return fallback;

  }

}


/* =========================================================
   LANGUAGE
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
  clear: "साफ करें",

  add: "जोड़ें",
  save: "सेव करें",
  update: "अपडेट करें",
  next: "अगला",
  back: "वापस",

  quantity: "मात्रा",
  unit: "इकाई",
  brand: "ब्रांड",
  price: "कीमत",

  select: "चुनें",
  optional: "वैकल्पिक",

  edit: "एडिट",
  delete: "डिलीट",

  noMaterials: "कोई मटेरियल नहीं मिला",
  noEstimate: "अभी कोई एस्टिमेट आइटम नहीं है",

  requiredQuantity: "मात्रा भरना जरूरी है",

  saved: "आइटम सेव हो गया",
  updated: "आइटम अपडेट हो गया",
  deleted: "आइटम डिलीट हो गया",

  reset: "रीसेट",
  resetConfirm: "क्या आप पूरा एस्टिमेट डेटा रीसेट करना चाहते हैं?",

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

  calculatorTitle: "कैलकुलेटर",
  settingsTitle: "सेटिंग्स",

  estimateTitle: "एस्टिमेट लिस्ट",

  itemAdded: "मटेरियल एस्टिमेट में जोड़ दिया गया",

  previousItem: "पिछला मटेरियल",
  nextMaterial: "अगला मटेरियल",

  emptySearch: "सर्च करने पर मटेरियल यहाँ दिखाई देंगे",

  filterApplied: "फ़िल्टर लागू है",

  selectValue: "विकल्प चुनें"

};


/* =========================================================
   FIELD TRANSLATIONS
   ========================================================= */

const FIELD_HI = {

  "Size": "साइज़",
  "Type": "टाइप",
  "Sub Type": "सब टाइप",
  "Conduit Size": "कंड्यूट साइज़",
  "Shape / Ways": "शेप / वेज़",
  "Material": "मटेरियल",
  "Material Type": "मटेरियल टाइप",
  "Depth": "गहराई",
  "Ways": "वेज़",
  "Hook Rod": "हुक रॉड",
  "Diameter": "डायमीटर",
  "Size (Width)": "चौड़ाई",
  "Pack Size": "पैक साइज़",
  "Pack Size (Weight)": "पैक वजन",
  "Gauge / Size": "गेज / साइज़",
  "Size (Length)": "लंबाई",
  "Colour": "रंग",
  "Color": "रंग",
  "Size (Width × Length)": "साइज़ (चौड़ाई × लंबाई)",
  "Size / Diameter": "साइज़ / डायमीटर",
  "Length": "लंबाई",
  "Module": "मॉड्यूल",
  "Phase Selection": "फेज़",
  "Door Type": "डोर टाइप",
  "Amp": "एम्पियर",
  "Curve": "कर्व",
  "Voltage": "वोल्टेज",
  "Sensitivity": "सेंसिटिविटी",
  "Door": "डोर",
  "Mounting": "माउंटिंग",
  "Wattage": "वॉटेज",
  "Base": "बेस",
  "Colour Temp": "कलर टेम्परेचर",
  "Shape": "शेप",
  "Movement": "मूवमेंट",
  "Beam Angle": "बीम एंगल",
  "Body Finish": "बॉडी फिनिश",
  "Density": "डेंसिटी",
  "Supply Voltage": "सप्लाई वोल्टेज",
  "Dimensions (W × D)": "डायमेंशन (W × D)",
  "Diffuser": "डिफ्यूज़र",
  "Output Voltage": "आउटपुट वोल्टेज",
  "User Input (Meters)": "लंबाई दर्ज करें",
  "User Input (ft / inch)": "लंबाई दर्ज करें",
  "Size (Diameter × Length)": "साइज़ (डायमीटर × लंबाई)",
  "Size (Cable Size × Stud Size)": "केबल साइज़ × स्टड साइज़"
};


/* =========================================================
   MATERIAL NAME TRANSLATIONS
   ========================================================= */

const MATERIAL_HI = {

  "Pipe": "पाइप",
  "Bend": "बेंड",
  "Junction Box": "जंक्शन बॉक्स",
  "Fan Box": "फैन बॉक्स",
  "Concealed Light Box": "कन्सील्ड लाइट बॉक्स",

  "Tape (Shuttering & Joint Sealing)": "शटरिंग व जॉइंट सीलिंग टेप",
  "Solvent Cement": "सॉल्वेंट सीमेंट",
  "Neel Powder (Marking Powder)": "नील पाउडर",
  "Binding Wire": "बाइंडिंग वायर",
  "Cable Tie / Zip Tie": "केबल टाई / ज़िप टाई",

  "Modular Board (Concealed Metal/PVC Box)": "मॉड्यूलर बोर्ड",
  "MCB Box (Distribution Board)": "एमसीबी बॉक्स / डिस्ट्रीब्यूशन बोर्ड",
  "Tape (Masking & Plaster Protection)": "मास्किंग व प्लास्टर प्रोटेक्शन टेप",
  "Cable Clip": "केबल क्लिप",

  "Wire": "वायर",
  "Flexible Pipe": "फ्लेक्सिबल पाइप",
  "Electrical Tape": "इलेक्ट्रिकल टेप",
  "Fastener": "फास्टनर",
  "Steel Wire / Spring Wire (Fish Tape)": "स्टील वायर / स्प्रिंग वायर",

  "Switch Plate": "स्विच प्लेट",
  "Switch Board (Surface Gang Box)": "स्विच बोर्ड",
  "Switch": "स्विच",
  "Socket": "सॉकेट",
  "Fan Regulator": "फैन रेगुलेटर",
  "2 Way Switch": "2 वे स्विच",
  "Bell Push": "बेल पुश",
  "Neon Indicator": "नियॉन इंडिकेटर",
  "Blank Plate / Dummy Switch": "ब्लैंक प्लेट / डमी स्विच",
  "DP Switch (Double Pole Switch)": "डीपी स्विच",

  "Mini MCB": "मिनी एमसीबी",
  "SP MCB (Single Pole)": "एसपी एमसीबी",
  "DP MCB (Double Pole)": "डीपी एमसीबी",
  "TPN MCB (Three Pole with Neutral)": "टीपीएन एमसीबी",
  "MCB Changeover": "एमसीबी चेंजओवर",
  "DP Isolator": "डीपी आइसोलेटर",
  "TPN Isolator (3P / 4P)": "टीपीएन आइसोलेटर",
  "RCCB / RCD": "आरसीसीबी / आरसीडी",
  "MCB Box": "एमसीबी बॉक्स",
  "Kit Kat Fuse": "किट-कैट फ्यूज़",

  "Fan Sheet": "फैन शीट",
  "Round Sheet": "राउंड शीट",
  "Fan Rod": "फैन रॉड",
  "Fan Clamp": "फैन क्लैम्प",
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
  "LED Strip Driver (SMPS)": "एलईडी स्ट्रिप ड्राइवर",

  "Door Bell": "डोर बेल",
  "Tape (Mounting / Double Sided)": "माउंटिंग / डबल साइडेड टेप",
  "Instant Glue": "इंस्टेंट ग्लू",
  "Araldite Glue (Epoxy)": "अराल्डाइट ग्लू",
  "POP (Plaster of Paris)": "पीओपी",
  "Putty Blade / Patta": "पुट्टी ब्लेड / पट्टा",
  "Screw": "स्क्रू",
  "Lug (Cable Terminal Lug)": "केबल टर्मिनल लग",
  "Washer": "वॉशर",

  "PVC Wall Plug / Gulli / Gitti": "पीवीसी वॉल प्लग / गुल्ली / गिट्टी",
  "Saddle (Pipe Clamp)": "सैडल / पाइप क्लैम्प"

};


/* =========================================================
   SECTION TRANSLATIONS
   ========================================================= */

const SECTION_HI = {

  "Conduit & Box": "कंड्यूट और बॉक्स",
  "Installation Material": "इंस्टॉलेशन मटेरियल",
  "Wiring Material": "वायरिंग मटेरियल",
  "Pulling Material": "पुलिंग मटेरियल",
  "Switch & Socket": "स्विच और सॉकेट",
  "MCB & Protection": "एमसीबी और प्रोटेक्शन",
  "Fan & Ceiling": "फैन और सीलिंग",
  "Lighting": "लाइटिंग",
  "Installation & Finishing": "इंस्टॉलेशन और फिनिशिंग",
  "Installation & Fastening": "इंस्टॉलेशन और फास्टनिंग",
  "Wiring & Conduit": "वायरिंग और कंड्यूट"
};


/* =========================================================
   STAGE TRANSLATIONS
   ========================================================= */

const STAGE_HI = {

  "STAGE 1": "स्टेज 1",
  "STAGE 2": "स्टेज 2",
  "STAGE 3": "स्टेज 3",
  "STAGE 4": "स्टेज 4",
  "STAGE 5": "स्टेज 5",

  "Slab Conduit Installation": "स्लैब कंड्यूट इंस्टॉलेशन",
  "Wall Conduit Installation": "वॉल कंड्यूट इंस्टॉलेशन",
  "Wiring Installation": "वायरिंग इंस्टॉलेशन",
  "Final Electrical Fittings": "फाइनल इलेक्ट्रिकल फिटिंग्स",
  "False Ceiling Wiring Material": "फॉल्स सीलिंग वायरिंग मटेरियल"
};


/* =========================================================
   TEXT TRANSLATOR
   ========================================================= */

function t(text) {

  if (text === null || text === undefined) {
    return "";
  }

  const value = String(text);

  if (EF.language === "en") {
    return value;
  }

  if (FIELD_HI[value]) {
    return FIELD_HI[value];
  }

  if (MATERIAL_HI[value]) {
    return MATERIAL_HI[value];
  }

  if (SECTION_HI[value]) {
    return SECTION_HI[value];
  }

  if (STAGE_HI[value]) {
    return STAGE_HI[value];
  }

  const map = {

    "Heavy": "हेवी",
    "Medium": "मीडियम",
    "Light": "लाइट",

    "PVC": "पीवीसी",
    "GI Metal": "जीआई मेटल",
    "GI Steel": "जीआई स्टील",
    "MS Metal": "एमएस मेटल",

    "Short Bend": "शॉर्ट बेंड",
    "Long Bend": "लॉन्ग बेंड",

    "Normal Junction Box": "नॉर्मल जंक्शन बॉक्स",
    "Deep Junction Box": "डीप जंक्शन बॉक्स",

    "1 Way": "1 वे",
    "2 Way Straight": "2 वे स्ट्रेट",
    "2 Way Angle": "2 वे एंगल",
    "3 Way T-Type": "3 वे टी-टाइप",
    "4 Way Cross Type": "4 वे क्रॉस",
    "Y-Type": "वाई-टाइप",
    "H-Type": "एच-टाइप",
    "U-Type": "यू-टाइप",
    "V-Type": "वी-टाइप",

    "White": "सफेद",
    "Black": "काला",
    "Red": "लाल",
    "Green": "हरा",
    "Yellow": "पीला",
    "Blue": "नीला",
    "Grey": "ग्रे",

    "Local": "लोकल",
    "Standard / Local": "स्टैंडर्ड / लोकल",
    "Local / Non-Brand": "लोकल / नॉन-ब्रांड",
    "Commercial / Local": "कमर्शियल / लोकल",

    "Fixed": "फिक्स्ड",
    "Surface": "सरफेस",
    "Round": "गोल",
    "Square": "स्क्वायर",

    "pcs": "पीस",
    "bx": "बॉक्स",
    "pkt": "पैकेट",
    "doz": "दर्जन",
    "roll": "रोल",
    "mtr": "मीटर",
    "kg": "किलो",
    "gm": "ग्राम",
    "bag": "बैग",

    "Optional": "वैकल्पिक",

    "Single Door": "सिंगल डोर",
    "Double Door": "डबल डोर",

    "B Curve": "बी कर्व",
    "C Curve": "सी कर्व",
    "D Curve": "डी कर्व",

    "Single Phase (SPN)": "सिंगल फेज़",
    "Three Phase (TPN)": "थ्री फेज़",

    "30mA": "30mA",
    "100mA": "100mA",
    "300mA": "300mA",

    "Warm White": "वार्म व्हाइट",
    "Cool White": "कूल व्हाइट",
    "Natural White": "नेचुरल व्हाइट",

    "Recessed / Concealed": "रिसेस्ड / कन्सील्ड",
    "Surface Mount": "सरफेस माउंट",

    "No. 4": "नंबर 4",
    "No. 5": "नंबर 5",
    "No. 6": "नंबर 6",
    "No. 8": "नंबर 8",
    "No. 10 (30mm, 35mm, 40mm)": "नंबर 10 (30mm, 35mm, 40mm)"

  };

  return map[value] || value;
}


/* =========================================================
   STORAGE
   ========================================================= */

function loadEstimate() {

  try {

    const key =
      configValue(
        "storageKey",
        "sandeepEstimateItems"
      );

    const data =
      localStorage.getItem(key);

    if (!data) {

      EF.estimate = [];

      return;

    }

    const parsed =
      JSON.parse(data);

    EF.estimate =
      Array.isArray(parsed)
        ? parsed
        : [];

  } catch (error) {

    console.error(
      "Estimate load error:",
      error
    );

    EF.estimate = [];

  }

}


function saveEstimate() {

  try {

    const key =
      configValue(
        "storageKey",
        "sandeepEstimateItems"
      );

    localStorage.setItem(
      key,
      JSON.stringify(EF.estimate)
    );

  } catch (error) {

    console.error(
      "Estimate save error:",
      error
    );

  }

}


/* =========================================================
   ROUTE STORAGE
   ========================================================= */

function saveRoute(route) {

  EF.route = route;

  localStorage.setItem(
    "sandeepEstimateRoute",
    route
  );

}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme() {

  document.documentElement.setAttribute(
    "data-theme",
    EF.theme
  );

  document.body.classList.toggle(
    "dark",
    EF.theme === "dark"
  );

  document.body.classList.toggle(
    "light",
    EF.theme === "light"
  );

  localStorage.setItem(
    "sandeepTheme",
    EF.theme
  );

}


function toggleTheme() {

  EF.theme =
    EF.theme === "dark"
      ? "light"
      : "dark";

  applyTheme();

  showToast(
    EF.theme === "dark"
      ? "Dark Theme"
      : "Light Theme"
  );

}


/* =========================================================
   LANGUAGE
   ========================================================= */

function setLanguage(language) {

  if (
    language !== "hi" &&
    language !== "en"
  ) {
    language = "hi";
  }

  EF.language = language;

  localStorage.setItem(
    "sandeepMaterialLang",
    language
  );

  renderLanguageButtons();

  renderCurrentPage();

}


function renderLanguageButtons() {

  const hi =
    EF.ids.langHi;

  const en =
    EF.ids.langEn;

  if (hi) {

    hi.classList.toggle(
      "active",
      EF.language === "hi"
    );

    hi.setAttribute(
      "aria-pressed",
      EF.language === "hi"
        ? "true"
        : "false"
    );

  }

  if (en) {

    en.classList.toggle(
      "active",
      EF.language === "en"
    );

    en.setAttribute(
      "aria-pressed",
      EF.language === "en"
        ? "true"
        : "false"
    );

  }

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

  if (overlay) {

    overlay.classList.add("open");
    overlay.classList.add("active");

  }

  document.body.classList.add(
    "drawer-open"
  );

}


function closeDrawer() {

  const drawer =
    EF.ids.drawer;

  const overlay =
    EF.ids.drawerOverlay;

  EF.drawerOpen = false;

  if (drawer) {

    drawer.classList.remove("open");
    drawer.classList.remove("active");

  }

  if (overlay) {

    overlay.classList.remove("open");
    overlay.classList.remove("active");

  }

  document.body.classList.remove(
    "drawer-open"
  );

}


/* =========================================================
   RESET
   ========================================================= */

function resetApplication() {

  const message =
    EF.language === "hi"
      ? HI.resetConfirm
      : "Reset all estimate data?";

  if (!window.confirm(message)) {
    return;
  }

  EF.estimate = [];

  saveEstimate();

  EF.currentStage = null;
  EF.currentSection = null;
  EF.currentMaterial = null;
  EF.currentMaterialIndex = 0;
  EF.currentDraft = {};

  localStorage.removeItem(
    "sandeepEstimateRoute"
  );

  localStorage.removeItem(
    "sandeepLastUnit"
  );

  saveRoute("home");

  closeDrawer();

  renderHome();

  showToast(
    EF.language === "hi"
      ? "एस्टिमेट डेटा रीसेट हो गया"
      : "Estimate data reset"
  );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(message) {

  const toast =
    EF.ids.toast;

  if (!toast) {

    console.log(message);

    return;

  }

  toast.textContent =
    message;

  toast.classList.add("show");
  toast.classList.add("active");

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");
      toast.classList.remove("active");

    }, 1800);

}


/* =========================================================
   MATERIAL DATA HELPERS
   ========================================================= */

function getStageName(stage) {

  return stage[0];

}

function getStageTitle(stage) {

  return stage[1];

}

function getStageCategory(stage) {

  return stage[2];

}

function getStageMaterials(stage) {

  return Array.isArray(stage[3])
    ? stage[3]
    : [];

}

function getStageSections(stage) {

  return Array.isArray(stage[4])
    ? stage[4]
    : [];

}

function getSectionName(section) {

  return section[0];

}

function getSectionMaterials(section) {

  return Array.isArray(section[1])
    ? section[1]
    : [];

}


/* =========================================================
   FLATTEN MATERIALS
   ========================================================= */

function getAllMaterialEntries() {

  const output = [];

  EF.materials.forEach(
    (stage) => {

      const stageName =
        getStageName(stage);

      const stageTitle =
        getStageTitle(stage);

      const stageCategory =
        getStageCategory(stage);

      const mainMaterials =
        getStageMaterials(stage);

      mainMaterials.forEach(
        (material) => {

          output.push({

            stageName,
            stageTitle,
            stageCategory,

            sectionName:
              stageCategory,

            material

          });

        }
      );

      const sections =
        getStageSections(stage);

      sections.forEach(
        (section) => {

          const sectionName =
            getSectionName(section);

          const materials =
            getSectionMaterials(section);

          materials.forEach(
            (material) => {

              output.push({

                stageName,
                stageTitle,
                stageCategory,

                sectionName,

                material

              });

            }
          );

        }
      );

    }
  );

  return output;

}


/* =========================================================
   MATERIAL SEARCH
   ========================================================= */

function materialMatchesSearch(
  material,
  search
) {

  if (!search) {
    return true;
  }

  const name =
    String(material[0] || "")
      .toLowerCase();

  const fields =
    Array.isArray(material[1])
      ? material[1]
      : [];

  let text =
    name;

  fields.forEach(
    (field) => {

      text += " " +
        String(field[0] || "");

      const values =
        Array.isArray(field[1])
          ? field[1]
          : [];

      text += " " +
        values.join(" ");

    }
  );

  return text
    .toLowerCase()
    .includes(
      search.toLowerCase()
    );

}


/* =========================================================
   HOME
   ========================================================= */

function renderHome() {

  saveRoute("home");

  EF.currentStage = null;
  EF.currentSection = null;
  EF.currentMaterial = null;

  const home =
    EF.ids.home;

  if (!home) {

    renderStageGrid();

    return;

  }

  showOnlyPage(
    "home"
  );

  renderStageGrid();

  updateTopTitle(
    "Sandeep ElectroFix"
  );

}


function renderStageGrid() {

  const grid =
    EF.ids.stageGrid;

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  EF.materials.forEach(
    (stage, index) => {

      const card =
        document.createElement("button");

      card.type = "button";

      card.className =
        "stage-card";

      card.dataset.stageIndex =
        String(index);

      const stageNo =
        getStageName(stage);

      const title =
        getStageTitle(stage);

      const category =
        getStageCategory(stage);

      const count =
        countStageMaterials(stage);

      card.innerHTML = `

        <div class="stage-inner">

          <div class="stage-number">
            ${escapeHTML(t(stageNo))}
          </div>

          <div class="stage-title">
            ${escapeHTML(t(title))}
          </div>

          <div class="stage-category">
            ${escapeHTML(t(category))}
          </div>

          <div class="stage-count">
            ${count} ${
              EF.language === "hi"
                ? "मटेरियल"
                : "Materials"
            }
          </div>

        </div>

      `;

      card.addEventListener(
        "click",
        () => {

          openStage(index);

        }
      );

      grid.appendChild(card);

    }
  );

}


function countStageMaterials(stage) {

  let count = 0;

  count +=
    getStageMaterials(stage).length;

  getStageSections(stage)
    .forEach(
      section => {

        count +=
          getSectionMaterials(section)
            .length;

      }
    );

  return count;

}


/* =========================================================
   STAGE
   ========================================================= */

function openStage(index) {

  const stage =
    EF.materials[index];

  if (!stage) {
    return;
  }

  EF.currentStage =
    index;

  EF.currentSection =
    null;

  EF.currentMaterial =
    null;

  EF.currentMaterialIndex =
    0;

  saveRoute(
    "stage"
  );

  renderStagePage();

}


function renderStagePage() {

  showOnlyPage(
    "main"
  );

  const main =
    EF.ids.main;

  if (!main) {
    return;
  }

  const stage =
    EF.materials[
      EF.currentStage
    ];

  if (!stage) {

    renderHome();

    return;

  }

  updateTopTitle(
    t(stage[1])
  );

  renderStageContent(
    stage
  );

}


function renderStageContent(stage) {

  const main =
    EF.ids.main;

  if (!main) {
    return;
  }

  let html = `

    <div class="ef-page-header">

      <button
        type="button"
        class="ef-back-button"
        id="stageBackButton"
      >
        ← ${escapeHTML(t(HI.back))}
      </button>

      <div class="ef-page-title">
        ${escapeHTML(t(stage[0]))}
      </div>

      <div class="ef-page-subtitle">
        ${escapeHTML(t(stage[1]))}
      </div>

    </div>

    <div
      class="ef-section-grid"
      id="efSectionGrid"
    ></div>

  `;

  main.innerHTML =
    html;

  const grid =
    byId("efSectionGrid");

  const directMaterials =
    getStageMaterials(stage);

  if (directMaterials.length) {

    const direct =
      document.createElement("button");

    direct.type =
      "button";

    direct.className =
      "ef-section-card";

    direct.innerHTML = `

      <div class="ef-section-card-title">
        ${escapeHTML(t(stage[2]))}
      </div>

      <div class="ef-section-card-count">
        ${directMaterials.length}
      </div>

    `;

    direct.addEventListener(
      "click",
      () => {

        openDirectStageMaterials();

      }
    );

    grid.appendChild(
      direct
    );

  }

  const sections =
    getStageSections(stage);

  sections.forEach(
    (section, index) => {

      const card =
        document.createElement("button");

      card.type =
        "button";

      card.className =
        "ef-section-card";

      card.innerHTML = `

        <div class="ef-section-card-title">
          ${escapeHTML(
            t(getSectionName(section))
          )}
        </div>

        <div class="ef-section-card-count">
          ${getSectionMaterials(section).length}
        </div>

      `;

      card.addEventListener(
        "click",
        () => {

          openSection(index);

        }
      );

      grid.appendChild(
        card
      );

    }
  );

  const back =
    byId("stageBackButton");

  if (back) {

    back.addEventListener(
      "click",
      () => {

        renderHome();

      }
    );

  }

}


/* =========================================================
   DIRECT STAGE MATERIALS
   ========================================================= */

function openDirectStageMaterials() {

  EF.currentSection =
    -1;

  EF.currentSectionItems =
    getStageMaterials(
      EF.materials[
        EF.currentStage
      ]
    );

  saveRoute(
    "materials"
  );

  renderMaterialPage();

}


/* =========================================================
   SECTION
   ========================================================= */

function openSection(index) {

  const stage =
    EF.materials[
      EF.currentStage
    ];

  const section =
    getStageSections(stage)[
      index
    ];

  if (!section) {
    return;
  }

  EF.currentSection =
    index;

  EF.currentSectionItems =
    getSectionMaterials(
      section
    );

  saveRoute(
    "materials"
  );

  renderMaterialPage();

}


/* =========================================================
   MATERIAL PAGE
   ========================================================= */

function renderMaterialPage() {

  showOnlyPage(
    "main"
  );

  const main =
    EF.ids.main;

  if (!main) {
    return;
  }

  const stage =
    EF.materials[
      EF.currentStage
    ];

  let sectionTitle =
    stage[2];

  if (
    EF.currentSection !== null &&
    EF.currentSection >= 0
  ) {

    const section =
      getStageSections(stage)[
        EF.currentSection
      ];

    if (section) {

      sectionTitle =
        section[0];

    }

  }

  updateTopTitle(
    t(sectionTitle)
  );

  renderMaterialToolbar(
    main
  );

  renderMaterials(
    EF.currentSectionItems
  );

}


/* =========================================================
   MATERIAL TOOLBAR
   ========================================================= */

function renderMaterialToolbar(main) {

  const old =
    byId("efMaterialToolbar");

  if (old) {
    old.remove();
  }

  const toolbar =
    document.createElement("div");

  toolbar.id =
    "efMaterialToolbar";

  toolbar.className =
    "ef-material-toolbar";

  toolbar.innerHTML = `

    <div class="ef-toolbar-row">

      <button
        type="button"
        class="ef-back-button"
        id="materialsBackButton"
      >
        ← ${escapeHTML(t(HI.back))}
      </button>

      <button
        type="button"
        class="view-trigger"
        id="efLocalViewTrigger"
      >
        ☷
      </button>

    </div>

    <div
      class="ef-local-view-options"
      id="efLocalViewOptions"
      hidden
    >

      <button data-view="grid">
        ${escapeHTML(t(HI.grid))}
      </button>

      <button data-view="list">
        ${escapeHTML(t(HI.list))}
      </button>

      <button data-view="compact">
        ${escapeHTML(t(HI.compact))}
      </button>

      <button data-view="large">
        ${escapeHTML(t(HI.large))}
      </button>

      <button data-view="mini">
        ${escapeHTML(t(HI.mini))}
      </button>

      <button data-view="2column">
        ${escapeHTML(t(HI.twoColumn))}
      </button>

      <button data-view="horizontal">
        ${escapeHTML(t(HI.horizontal))}
      </button>

      <button data-view="icon">
        ${escapeHTML(t(HI.iconList))}
      </button>

      <button data-view="timeline">
        ${escapeHTML(t(HI.timeline))}
      </button>

      <button data-view="dense">
        ${escapeHTML(t(HI.dense))}
      </button>

    </div>

  `;

  main.prepend(
    toolbar
  );

  const back =
    byId("materialsBackButton");

  if (back) {

    back.addEventListener(
      "click",
      () => {

        renderStagePage();

      }
    );

  }

  const trigger =
    byId("efLocalViewTrigger");

  const options =
    byId("efLocalViewOptions");

  if (trigger && options) {

    trigger.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        options.hidden =
          !options.hidden;

      }
    );

  }

  $all(
    "[data-view]",
    options
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          EF.view =
            button.dataset.view;

          localStorage.setItem(
            "sandeepMaterialView",
            EF.view
          );

          options.hidden =
            true;

          renderMaterials(
            EF.currentSectionItems
          );

        }
      );

    }
  );

}


/* =========================================================
   MATERIAL FILTER + SEARCH
   ========================================================= */

function getFilteredMaterials(
  materials
) {

  const search =
    EF.searchText.trim();

  return materials.filter(
    material => {

      if (
        !materialMatchesSearch(
          material,
          search
        )
      ) {
        return false;
      }

      return true;

    }
  );

}


/* =========================================================
   MATERIAL RENDER
   ========================================================= */

function renderMaterials(materials) {

  const main =
    EF.ids.main;

  if (!main) {
    return;
  }

  let grid =
    byId("efMaterialCards");

  if (!grid) {

    grid =
      document.createElement("div");

    grid.id =
      "efMaterialCards";

    grid.className =
      "material-grid";

    main.appendChild(
      grid
    );

  }

  grid.className =
    "material-grid " +
    "view-" +
    EF.view;

  grid.innerHTML = "";

  const filtered =
    getFilteredMaterials(
      materials
    );

  if (!filtered.length) {

    grid.innerHTML = `

      <div class="ef-empty-state">

        <div class="ef-empty-icon">
          ⌕
        </div>

        <div>
          ${escapeHTML(
            EF.searchText
              ? t(HI.noMaterials)
              : t(HI.emptySearch)
          )}
        </div>

      </div>

    `;

    return;

  }

  filtered.forEach(
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

}


/* =========================================================
   MATERIAL CARD
   ========================================================= */

function createMaterialCard(
  material,
  filteredIndex
) {

  const card =
    document.createElement("button");

  card.type =
    "button";

  card.className =
    "ef-material-card";

  card.dataset.material =
    material[0];

  const fields =
    Array.isArray(material[1])
      ? material[1]
      : [];

  const units =
    Array.isArray(material[2])
      ? material[2]
      : [];

  const brands =
    Array.isArray(material[3])
      ? material[3]
      : [];

  const previewFields =
    fields
      .slice(0, 3)
      .map(
        field => {

          const name =
            field[0];

          const values =
            Array.isArray(field[1])
              ? field[1]
              : [];

          return `
            <div class="ef-material-meta">
              <span>${escapeHTML(t(name))}</span>
              <b>${escapeHTML(
                t(values[0] || "")
              )}</b>
            </div>
          `;

        }
      )
      .join("");

  card.innerHTML = `

    <div class="ef-material-card-inner">

      <div class="ef-material-icon">
        ⚡
      </div>

      <div class="ef-material-name">
        ${escapeHTML(
          t(material[0])
        )}
      </div>

      <div class="ef-material-meta-list">
        ${previewFields}
      </div>

      <div class="ef-material-unit">
        ${escapeHTML(
          units
            .map(t)
            .join(" • ")
        )}
      </div>

      <div class="ef-material-arrow">
        →
      </div>

    </div>

  `;

  card.addEventListener(
    "click",
    () => {

      const realIndex =
        EF.currentSectionItems
          .indexOf(material);

      openMaterial(
        realIndex
      );

    }
  );

  return card;

}


/* =========================================================
   MATERIAL EDITOR
   ========================================================= */

function openMaterial(index) {

  const material =
    EF.currentSectionItems[
      index
    ];

  if (!material) {
    return;
  }

  EF.currentMaterialIndex =
    index;

  EF.currentMaterial =
    material;

  EF.currentDraft =
    {};

  saveRoute(
    "editor"
  );

  renderEditor();

}


/* =========================================================
   EDITOR
   ========================================================= */

function renderEditor() {

  const main =
    EF.ids.main;

  if (!main) {
    return;
  }

  const material =
    EF.currentMaterial;

  if (!material) {
    return;
  }

  const fields =
    Array.isArray(material[1])
      ? material[1]
      : [];

  const units =
    Array.isArray(material[2])
      ? material[2]
      : [];

  const brands =
    Array.isArray(material[3])
      ? material[3]
      : [];

  updateTopTitle(
    t(material[0])
  );

  let html = `

    <div class="ef-editor">

      <div class="ef-editor-head">

        <button
          type="button"
          class="ef-back-button"
          id="editorBackButton"
        >
          ← ${escapeHTML(t(HI.back))}
        </button>

        <div class="ef-editor-title">
          ${escapeHTML(t(material[0]))}
        </div>

      </div>

      <div class="ef-fields">

  `;

  fields.forEach(
    (field, index) => {

      const fieldName =
        field[0];

      const values =
        Array.isArray(field[1])
          ? field[1]
          : [];

      html += `

        <div class="ef-field">

          <label
            for="efField_${index}"
          >
            ${escapeHTML(
              t(fieldName)
            )}
          </label>

          <select
            id="efField_${index}"
            data-field-index="${index}"
            class="ef-dynamic-field"
          >

            <option value="">
              ${escapeHTML(
                EF.language === "hi"
                  ? "चुनें"
                  : "Select"
              )}
            </option>

            ${values.map(
              value => `

                <option value="${escapeAttr(value)}">
                  ${escapeHTML(
                    t(value)
                  )}
                </option>

              `
            ).join("")}

          </select>

        </div>

      `;

    }
  );


  /* =======================================================
     QUANTITY
     ======================================================= */

  html += `

      <div class="ef-field ef-quantity-field">

        <label for="efQuantityInput">
          ${escapeHTML(t(HI.quantity))}
          <span class="required">*</span>
        </label>

        <input
          id="efQuantityInput"
          type="number"
          min="0"
          step="any"
          inputmode="decimal"
          placeholder="${
            EF.language === "hi"
              ? "मात्रा दर्ज करें"
              : "Enter quantity"
          }"
        >

      </div>


      <div class="ef-field">

        <label for="efUnitInput">
          ${escapeHTML(t(HI.unit))}
        </label>

        <select id="efUnitInput">

          <option value="">
            ${escapeHTML(
              EF.language === "hi"
                ? "इकाई चुनें"
                : "Select Unit"
            )}
          </option>

          ${units.map(
            unit => `

              <option value="${escapeAttr(unit)}">
                ${escapeHTML(
                  t(unit)
                )}
              </option>

            `
          ).join("")}

        </select>

      </div>


      <div class="ef-field">

        <label for="efBrandInput">
          ${escapeHTML(t(HI.brand))}
          <span class="optional">
            (${escapeHTML(t(HI.optional))})
          </span>
        </label>

        <select id="efBrandInput">

          <option value="">
            ${escapeHTML(
              EF.language === "hi"
                ? "ब्रांड चुनें"
                : "Select Brand"
            )}
          </option>

          ${brands.map(
            brand => `

              <option value="${escapeAttr(brand)}">
                ${escapeHTML(
                  t(brand)
                )}
              </option>

            `
          ).join("")}

        </select>

      </div>


      <div class="ef-editor-actions">

        <button
          type="button"
          id="saveItem"
          class="ef-primary-button"
        >
          ${escapeHTML(
            t(HI.add)
          )}
        </button>

        <button
          type="button"
          id="nextItem"
          class="ef-secondary-button"
        >
          ${escapeHTML(
            t(HI.next)
          )} →
        </button>

      </div>

    </div>

  `;

  main.innerHTML =
    html;

  const back =
    byId("editorBackButton");

  if (back) {

    back.addEventListener(
      "click",
      () => {

        renderMaterialPage();

      }
    );

  }

  const quantity =
    byId("efQuantityInput");

  const unit =
    byId("efUnitInput");

  const brand =
    byId("efBrandInput");

  restoreDraftValues();

  if (unit) {

    unit.addEventListener(
      "change",
      () => {

        if (unit.value) {

          EF.unitCarry =
            unit.value;

          localStorage.setItem(
            "sandeepLastUnit",
            unit.value
          );

        }

      }
    );

  }

  const save =
    byId("saveItem");

  if (save) {

    save.addEventListener(
      "click",
      saveCurrentItem
    );

  }

  const next =
    byId("nextItem");

  if (next) {

    next.addEventListener(
      "click",
      goNextMaterial
    );

  }

}


/* =========================================================
   RESTORE DRAFT
   ========================================================= */

function restoreDraftValues() {

  const draft =
    EF.currentDraft || {};

  $all(
    ".ef-dynamic-field"
  ).forEach(
    select => {

      const index =
        Number(
          select.dataset.fieldIndex
        );

      if (
        draft.fields &&
        draft.fields[index] !== undefined
      ) {

        select.value =
          draft.fields[index];

      }

    }
  );

  const quantity =
    byId("efQuantityInput");

  if (quantity) {

    quantity.value =
      draft.quantity || "";

  }

  const unit =
    byId("efUnitInput");

  if (unit) {

    unit.value =
      draft.unit ||
      EF.unitCarry ||
      "";

  }

  const brand =
    byId("efBrandInput");

  if (brand) {

    brand.value =
      draft.brand || "";

  }

}


/* =========================================================
   READ EDITOR
   ========================================================= */

function readEditor() {

  const fields =
    $all(
      ".ef-dynamic-field"
    ).map(
      select => select.value
    );

  const quantity =
    byId("efQuantityInput");

  const unit =
    byId("efUnitInput");

  const brand =
    byId("efBrandInput");

  return {

    fields,

    quantity:
      quantity
        ? quantity.value.trim()
        : "",

    unit:
      unit
        ? unit.value
        : "",

    brand:
      brand
        ? brand.value
        : ""

  };

}


/* =========================================================
   VALIDATE
   ========================================================= */

function validateEditor(data) {

  if (
    data.quantity === "" ||
    Number(data.quantity) <= 0
  ) {

    showToast(
      t(HI.requiredQuantity)
    );

    const quantity =
      byId("efQuantityInput");

    if (quantity) {

      quantity.focus();

    }

    return false;

  }

  return true;

}


/* =========================================================
   SAVE CURRENT ITEM
   ========================================================= */

function saveCurrentItem() {

  const data =
    readEditor();

  if (!validateEditor(data)) {
    return;
  }

  const material =
    EF.currentMaterial;

  if (!material) {
    return;
  }

  const stage =
    EF.materials[
      EF.currentStage
    ];

  const sectionName =
    getCurrentSectionName();

  const item = {

    id:
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .slice(2, 8),

    stage:
      stage[0],

    stageTitle:
      stage[1],

    section:
      sectionName,

    material:
      material[0],

    fields:
      {},

    quantity:
      data.quantity,

    unit:
      data.unit,

    brand:
      data.brand,

    price:
      "",

    createdAt:
      Date.now()

  };


  /* =======================================================
     FIELD OBJECT
     ======================================================= */

  const fields =
    Array.isArray(material[1])
      ? material[1]
      : [];

  fields.forEach(
    (field, index) => {

      const name =
        field[0];

      const value =
        data.fields[index] || "";

      item.fields[name] =
        value;

    }
  );


  EF.estimate.push(
    item
  );

  saveEstimate();

  if (data.unit) {

    EF.unitCarry =
      data.unit;

    localStorage.setItem(
      "sandeepLastUnit",
      data.unit
    );

  }

  EF.currentDraft =
    {};

  showToast(
    t(HI.itemAdded)
  );

  updateEstimateCount();

  /* IMPORTANT:
     ADD automatically goes to next material.
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
    EF.currentSectionItems;

  if (!Array.isArray(list) ||
      !list.length) {

    return;

  }

  const nextIndex =
    EF.currentMaterialIndex + 1;

  if (
    nextIndex >= list.length
  ) {

    showToast(
      EF.language === "hi"
        ? "यह सेक्शन पूरा हो गया"
        : "Section completed"
    );

    renderMaterialPage();

    return;

  }

  EF.currentDraft =
    {};

  EF.currentMaterialIndex =
    nextIndex;

  EF.currentMaterial =
    list[nextIndex];

  renderEditor();

}


/* =========================================================
   CURRENT SECTION NAME
   ========================================================= */

function getCurrentSectionName() {

  const stage =
    EF.materials[
      EF.currentStage
    ];

  if (
    EF.currentSection === null
  ) {

    return stage[2];

  }

  if (
    EF.currentSection === -1
  ) {

    return stage[2];

  }

  const section =
    getStageSections(stage)[
      EF.currentSection
    ];

  return section
    ? section[0]
    : stage[2];

}


/* =========================================================
   ESTIMATE PAGE
   ========================================================= */

function renderEstimatePage() {

  saveRoute(
    "estimate"
  );

  showOnlyPage(
    "main"
  );

  const main =
    EF.ids.main;

  if (!main) {
    return;
  }

  updateTopTitle(
    t(HI.estimateTitle)
  );

  if (!EF.estimate.length) {

    main.innerHTML = `

      <div class="ef-empty-state">

        <div class="ef-empty-icon">
          ⚡
        </div>

        <div>
          ${escapeHTML(
            t(HI.noEstimate)
          )}
        </div>

      </div>

    `;

    return;

  }

  main.innerHTML = `

    <div class="ef-estimate-page">

      <div class="ef-estimate-header">

        <div class="ef-page-title">
          ${escapeHTML(
            t(HI.estimateTitle)
          )}
        </div>

        <div
          class="ef-estimate-total-count"
          id="estimateCount"
        >
          ${EF.estimate.length}
        </div>

      </div>

      <div
        class="ef-estimate-list"
        id="efEstimateList"
      ></div>

    </div>

  `;

  renderEstimateItems();

}


function renderEstimateItems() {

  const list =
    byId("efEstimateList");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  EF.estimate.forEach(
    (item, index) => {

      const card =
        document.createElement("div");

      card.className =
        "ef-estimate-item";

      const fieldHTML =
        Object.entries(
          item.fields || {}
        )
        .filter(
          ([, value]) =>
            value !== ""
        )
        .map(
          ([name, value]) => `

            <div class="ef-estimate-field">
              <span>
                ${escapeHTML(
                  t(name)
                )}
              </span>

              <b>
                ${escapeHTML(
                  t(value)
                )}
              </b>
            </div>

          `
        )
        .join("");

      card.innerHTML = `

        <div class="ef-estimate-item-head">

          <div>
            <strong>
              ${escapeHTML(
                t(item.material)
              )}
            </strong>

            <small>
              ${escapeHTML(
                t(item.stage)
              )}
              •
              ${escapeHTML(
                t(item.section)
              )}
            </small>
          </div>

          <div class="ef-estimate-actions">

            <button
              type="button"
              data-edit="${index}"
            >
              ✎
            </button>

            <button
              type="button"
              data-delete="${index}"
            >
              ×
            </button>

          </div>

        </div>

        <div class="ef-estimate-fields">

          ${fieldHTML}

          <div class="ef-estimate-field">
            <span>${escapeHTML(t(HI.quantity))}</span>
            <b>${escapeHTML(
              String(item.quantity)
            )}</b>
          </div>

          <div class="ef-estimate-field">
            <span>${escapeHTML(t(HI.unit))}</span>
            <b>${escapeHTML(
              t(item.unit || "")
            )}</b>
          </div>

          ${
            item.brand
              ? `
                <div class="ef-estimate-field">
                  <span>${escapeHTML(t(HI.brand))}</span>
                  <b>${escapeHTML(
                    t(item.brand)
                  )}</b>
                </div>
              `
              : ""
          }

        </div>

      `;

      list.appendChild(
        card
      );

    }
  );


  $all(
    "[data-delete]",
    list
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          deleteEstimateItem(
            Number(
              button.dataset.delete
            )
          );

        }
      );

    }
  );


  $all(
    "[data-edit]",
    list
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          editEstimateItem(
            Number(
              button.dataset.edit
            )
          );

        }
      );

    }
  );

}


/* =========================================================
   DELETE ESTIMATE ITEM
   ========================================================= */

function deleteEstimateItem(index) {

  if (
    index < 0 ||
    index >= EF.estimate.length
  ) {
    return;
  }

  EF.estimate.splice(
    index,
    1
  );

  saveEstimate();

  renderEstimatePage();

  showToast(
    t(HI.deleted)
  );

}


/* =========================================================
   EDIT ESTIMATE ITEM
   ========================================================= */

function editEstimateItem(index) {

  const item =
    EF.estimate[index];

  if (!item) {
    return;
  }

  const stageIndex =
    EF.materials.findIndex(
      stage =>
        stage[0] === item.stage
    );

  if (stageIndex < 0) {
    return;
  }

  EF.currentStage =
    stageIndex;

  const stage =
    EF.materials[
      stageIndex
    ];

  let found =
    false;

  /* -------------------------------------------------------
     DIRECT MATERIALS
     ------------------------------------------------------- */

  const direct =
    getStageMaterials(stage);

  const directIndex =
    direct.findIndex(
      material =>
        material[0] === item.material
    );

  if (directIndex >= 0) {

    EF.currentSection =
      -1;

    EF.currentSectionItems =
      direct;

    EF.currentMaterialIndex =
      directIndex;

    EF.currentMaterial =
      direct[directIndex];

    found = true;

  }


  /* -------------------------------------------------------
     SECTION MATERIALS
     ------------------------------------------------------- */

  if (!found) {

    const sections =
      getStageSections(stage);

    sections.forEach(
      (section, sectionIndex) => {

        if (found) {
          return;
        }

        const items =
          getSectionMaterials(
            section
          );

        const materialIndex =
          items.findIndex(
            material =>
              material[0] === item.material
          );

        if (
          materialIndex >= 0
        ) {

          EF.currentSection =
            sectionIndex;

          EF.currentSectionItems =
            items;

          EF.currentMaterialIndex =
            materialIndex;

          EF.currentMaterial =
            items[materialIndex];

          found = true;

        }

      }
    );

  }

  if (!found) {
    return;
  }

  EF.currentDraft = {

    fields:
      Object.values(
        item.fields || {}
      ),

    quantity:
      item.quantity || "",

    unit:
      item.unit || "",

    brand:
      item.brand || ""

  };

  saveRoute(
    "editor"
  );

  renderEditor();

  /* Replace Save with Update */

  const save =
    byId("saveItem");

  if (save) {

    save.textContent =
      t(HI.update);

    save.onclick =
      () => {

        updateEstimateItem(
          index
        );

      };

  }

}


/* =========================================================
   UPDATE ESTIMATE ITEM
   ========================================================= */

function updateEstimateItem(
  estimateIndex
) {

  const data =
    readEditor();

  if (!validateEditor(data)) {
    return;
  }

  const item =
    EF.estimate[
      estimateIndex
    ];

  if (!item) {
    return;
  }

  const material =
    EF.currentMaterial;

  const fields =
    Array.isArray(material[1])
      ? material[1]
      : [];

  const newFields =
    {};

  fields.forEach(
    (field, index) => {

      newFields[
        field[0]
      ] =
        data.fields[index] || "";

    }
  );

  item.fields =
    newFields;

  item.quantity =
    data.quantity;

  item.unit =
    data.unit;

  item.brand =
    data.brand;

  saveEstimate();

  EF.currentDraft =
    {};

  showToast(
    t(HI.updated)
  );

  setTimeout(
    () => {

      renderEstimatePage();

    },
    250
  );

}


/* =========================================================
   SEARCH
   ========================================================= */

function handleSearch(value) {

  EF.searchText =
    String(value || "");

  if (
    EF.route === "materials"
  ) {

    renderMaterials(
      EF.currentSectionItems
    );

  }

}


/* =========================================================
   FILTER PANEL
   ========================================================= */

function toggleFilter() {

  const panel =
    EF.ids.filterPanel;

  if (!panel) {
    return;
  }

  EF.filterOpen =
    !EF.filterOpen;

  panel.classList.toggle(
    "open",
    EF.filterOpen
  );

  panel.classList.toggle(
    "active",
    EF.filterOpen
  );

}


function clearFilters() {

  EF.selectedFilters = {

    stage: "",
    section: "",
    type: "",
    size: "",
    brand: ""

  };

  EF.searchText =
    "";

  if (EF.ids.search) {

    EF.ids.search.value =
      "";

  }

  [
    EF.ids.stageFilter,
    EF.ids.typeFilter,
    EF.ids.sizeFilter,
    EF.ids.brandFilter
  ]
  .forEach(
    select => {

      if (select) {
        select.value =
          "";
      }

    }
  );

  renderMaterials(
    EF.currentSectionItems
  );

}


/* =========================================================
   VIEW SELECTOR
   ========================================================= */

function setupGlobalViewSelector() {

  const trigger =
    EF.ids.viewTrigger;

  const options =
    EF.ids.viewOptions;

  if (!trigger || !options) {
    return;
  }

  trigger.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      options.classList.toggle(
        "open"
      );

      options.classList.toggle(
        "active"
      );

    }
  );

  $all(
    "[data-view]",
    options
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          EF.view =
            button.dataset.view;

          localStorage.setItem(
            "sandeepMaterialView",
            EF.view
          );

          options.classList.remove(
            "open"
          );

          options.classList.remove(
            "active"
          );

          renderMaterials(
            EF.currentSectionItems
          );

        }
      );

    }
  );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showOnlyPage(page) {

  const pages = [
    byId("home"),
    byId("main"),
    byId("calculator"),
    byId("settings")
  ];

  pages.forEach(
    element => {

      if (!element) {
        return;
      }

      const match =
        element.id === page;

      element.classList.toggle(
        "active",
        match
      );

      element.hidden =
        !match;

    }
  );

}


/* =========================================================
   BOTTOM NAV
   ========================================================= */

function handleNavigation(
  page
) {

  closeDrawer();

  switch (page) {

    case "home":

      renderHome();

      break;

    case "estimate":

      renderEstimatePage();

      break;

    case "calculator":

      saveRoute("calculator");

      showOnlyPage(
        "calculator"
      );

      updateTopTitle(
        t(HI.calculatorTitle)
      );

      break;

    case "settings":

      saveRoute("settings");

      showOnlyPage(
        "settings"
      );

      updateTopTitle(
        t(HI.settingsTitle)
      );

      break;

    default:

      renderHome();

  }

}


/* =========================================================
   TOP TITLE
   ========================================================= */

function updateTopTitle(
  title
) {

  const element =
    EF.ids.topBarTitle;

  if (element) {

    element.textContent =
      title;

  }

}


/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {

  /* -------------------------------------------------------
     HAMBURGER
     ------------------------------------------------------- */

  if (EF.ids.menuBtn) {

    EF.ids.menuBtn.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        if (
          EF.drawerOpen
        ) {

          closeDrawer();

        } else {

          openDrawer();

        }

      }
    );

  }


  /* -------------------------------------------------------
     DRAWER CLOSE
     ------------------------------------------------------- */

  if (EF.ids.closeMenu) {

    EF.ids.closeMenu.addEventListener(
      "click",
      closeDrawer
    );

  }

  if (EF.ids.drawerOverlay) {

    EF.ids.drawerOverlay.addEventListener(
      "click",
      closeDrawer
    );

  }


  /* -------------------------------------------------------
     THEME
     ------------------------------------------------------- */

  if (EF.ids.themeBtn) {

    EF.ids.themeBtn.addEventListener(
      "click",
      toggleTheme
    );

  }


  /* -------------------------------------------------------
     LANGUAGE BUTTON
     ------------------------------------------------------- */

  if (EF.ids.langBtn) {

    EF.ids.langBtn.addEventListener(
      "click",
      () => {

        if (
          EF.language === "hi"
        ) {

          setLanguage("en");

        } else {

          setLanguage("hi");

        }

      }
    );

  }


  /* -------------------------------------------------------
     LANGUAGE DIRECT BUTTONS
     ------------------------------------------------------- */

  if (EF.ids.langHi) {

    EF.ids.langHi.addEventListener(
      "click",
      () => {

        setLanguage("hi");

      }
    );

  }

  if (EF.ids.langEn) {

    EF.ids.langEn.addEventListener(
      "click",
      () => {

        setLanguage("en");

      }
    );

  }


  /* -------------------------------------------------------
     RESET BUTTONS
     ------------------------------------------------------- */

  $all(
    "[data-action='reset'], #resetApp, #resetButton, #menuReset"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        resetApplication
      );

    }
  );


  /* -------------------------------------------------------
     BOTTOM NAV
     ------------------------------------------------------- */

  $all(
    ".bottom-item, [data-nav]"
  )
  .forEach(
    item => {

      item.addEventListener(
        "click",
        () => {

          const page =
            item.dataset.nav ||
            item.dataset.page;

          if (page) {

            handleNavigation(
              page
            );

          }

        }
      );

    }
  );


  /* -------------------------------------------------------
     DRAWER NAV
     ------------------------------------------------------- */

  $all(
    "[data-page]"
  )
  .forEach(
    item => {

      item.addEventListener(
        "click",
        () => {

          const page =
            item.dataset.page;

          if (
            page === "home" ||
            page === "estimate" ||
            page === "calculator" ||
            page === "settings"
          ) {

            handleNavigation(
              page
            );

          }

        }
      );

    }
  );


  /* -------------------------------------------------------
     SEARCH
     ------------------------------------------------------- */

  if (EF.ids.search) {

    EF.ids.search.addEventListener(
      "input",
      event => {

        handleSearch(
          event.target.value
        );

      }
    );

  }


  /* -------------------------------------------------------
     FILTER ICON
     ------------------------------------------------------- */

  if (EF.ids.filterIcon) {

    EF.ids.filterIcon.addEventListener(
      "click",
      toggleFilter
    );

  }


  /* -------------------------------------------------------
     CLEAR FILTER
     ------------------------------------------------------- */

  if (EF.ids.clearFilter) {

    EF.ids.clearFilter.addEventListener(
      "click",
      clearFilters
    );

  }


  /* -------------------------------------------------------
     FILTER SELECTS
     ------------------------------------------------------- */

  [
    EF.ids.stageFilter,
    EF.ids.typeFilter,
    EF.ids.sizeFilter,
    EF.ids.brandFilter
  ]
  .forEach(
    select => {

      if (!select) {
        return;
      }

      select.addEventListener(
        "change",
        () => {

          EF.selectedFilters[
            select.id
          ] =
            select.value;

          renderMaterials(
            EF.currentSectionItems
          );

        }
      );

    }
  );


  /* -------------------------------------------------------
     GLOBAL VIEW
     ------------------------------------------------------- */

  setupGlobalViewSelector();


  /* -------------------------------------------------------
     ESCAPE
     ------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        if (
          EF.drawerOpen
        ) {

          closeDrawer();

          return;

        }

        if (
          EF.filterOpen
        ) {

          toggleFilter();

          return;

        }

      }

    }
  );


  /* -------------------------------------------------------
     BACK BUTTON
     ------------------------------------------------------- */

  window.addEventListener(
    "popstate",
    handleBrowserBack
  );


  /* -------------------------------------------------------
     ANDROID / BROWSER BACK
     ------------------------------------------------------- */

  window.addEventListener(
    "beforeunload",
    () => {

      saveCurrentRouteState();

    }
  );

}


/* =========================================================
   BROWSER BACK
   ========================================================= */

function handleBrowserBack() {

  if (
    EF.drawerOpen
  ) {

    closeDrawer();

    history.pushState(
      {
        ef: true
      },
      "",
      location.href
    );

    return;

  }

  switch (EF.route) {

    case "editor":

      renderMaterialPage();

      break;

    case "materials":

      renderStagePage();

      break;

    case "stage":

      renderHome();

      break;

    case "estimate":
    case "calculator":
    case "settings":

      renderHome();

      break;

    default:

      renderHome();

  }

}


/* =========================================================
   SAVE ROUTE STATE
   ========================================================= */

function saveCurrentRouteState() {

  const state = {

    route:
      EF.route,

    stage:
      EF.currentStage,

    section:
      EF.currentSection,

    material:
      EF.currentMaterialIndex

  };

  localStorage.setItem(
    "sandeepEstimateRouteState",
    JSON.stringify(state)
  );

}


/* =========================================================
   RESTORE ROUTE
   ========================================================= */

function restoreRoute() {

  let state = null;

  try {

    state =
      JSON.parse(
        localStorage.getItem(
          "sandeepEstimateRouteState"
        ) || "null"
      );

  } catch (e) {

    state = null;

  }

  if (!state) {

    renderHome();

    return;

  }

  if (
    Number.isInteger(state.stage) &&
    EF.materials[state.stage]
  ) {

    EF.currentStage =
      state.stage;

  } else {

    renderHome();

    return;

  }

  if (
    state.route === "stage"
  ) {

    renderStagePage();

    return;

  }

  if (
    state.route === "materials"
  ) {

    const stage =
      EF.materials[
        EF.currentStage
      ];

    if (
      state.section === -1
    ) {

      EF.currentSection =
        -1;

      EF.currentSectionItems =
        getStageMaterials(
          stage
        );

    } else {

      EF.currentSection =
        Number(
          state.section
        );

      const section =
        getStageSections(stage)[
          EF.currentSection
        ];

      if (!section) {

        renderStagePage();

        return;

      }

      EF.currentSectionItems =
        getSectionMaterials(
          section
        );

    }

    renderMaterialPage();

    return;

  }

  if (
    state.route === "editor"
  ) {

    const stage =
      EF.materials[
        EF.currentStage
      ];

    if (
      state.section === -1
    ) {

      EF.currentSection =
        -1;

      EF.currentSectionItems =
        getStageMaterials(
          stage
        );

    } else {

      EF.currentSection =
        Number(
          state.section
        );

      const section =
        getStageSections(stage)[
          EF.currentSection
        ];

      if (!section) {

        renderStagePage();

        return;

      }

      EF.currentSectionItems =
        getSectionMaterials(
          section
        );

    }

    const index =
      Number(
        state.material
      );

    if (
      !EF.currentSectionItems[index]
    ) {

      renderMaterialPage();

      return;

    }

    EF.currentMaterialIndex =
      index;

    EF.currentMaterial =
      EF.currentSectionItems[
        index
      ];

    renderEditor();

    return;

  }

  if (
    state.route === "estimate"
  ) {

    renderEstimatePage();

    return;

  }

  renderHome();

}


/* =========================================================
   ESTIMATE COUNT
   ========================================================= */

function updateEstimateCount() {

  const count =
    EF.ids.estimateCount ||
    byId("estimateCount");

  if (count) {

    count.textContent =
      EF.estimate.length;

  }

}


/* =========================================================
   CURRENT PAGE RENDER
   ========================================================= */

function renderCurrentPage() {

  switch (EF.route) {

    case "home":
      renderHome();
      break;

    case "stage":
      renderStagePage();
      break;

    case "materials":
      renderMaterialPage();
      break;

    case "editor":
      renderEditor();
      break;

    case "estimate":
      renderEstimatePage();
      break;

    case "calculator":

      showOnlyPage(
        "calculator"
      );

      updateTopTitle(
        t(HI.calculatorTitle)
      );

      break;

    case "settings":

      showOnlyPage(
        "settings"
      );

      updateTopTitle(
        t(HI.settingsTitle)
      );

      break;

    default:
      renderHome();

  }

}


/* =========================================================
   LOADING SCREEN
   ========================================================= */

function hideLoader() {

  const loader =
    EF.ids.loadingScreen;

  if (!loader) {
    return;
  }

  loader.classList.add(
    "hidden"
  );

  loader.classList.remove(
    "active"
  );

  loader.style.display =
    "none";

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )
  .replace(
    /&/g,
    "&amp;"
  )
  .replace(
    /</g,
    "&lt;"
  )
  .replace(
    />/g,
    "&gt;"
  )
  .replace(
    /"/g,
    "&quot;"
  )
  .replace(
    /'/g,
    "&#039;"
  );

}


function escapeAttr(value) {

  return escapeHTML(
    value
  );

}


/* =========================================================
   PAGE CLICK SAFETY
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    const target =
      event.target;

    if (
      target.closest(
        "#efLocalViewOptions"
      )
    ) {
      return;
    }

    const globalOptions =
      EF.ids.viewOptions;

    if (
      globalOptions &&
      !target.closest(
        "#viewTrigger"
      )
    ) {

      globalOptions.classList.remove(
        "open"
      );

      globalOptions.classList.remove(
        "active"
      );

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function initEstimateApp() {

  if (EF.initialized) {
    return;
  }

  EF.initialized =
    true;

  cacheDOM();

  loadEstimate();

  applyTheme();

  renderLanguageButtons();

  bindEvents();

  updateEstimateCount();

  hideLoader();

  /*
   * Small delay ensures material.js is completely ready
   * before route restoration.
   */

  setTimeout(
    () => {

      restoreRoute();

    },
    30
  );

}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState === "loading"
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

  openStage,
  openSection,
  openMaterial,

  renderHome,
  renderEstimatePage,
  renderMaterialPage,
  renderEditor,

  setLanguage,
  toggleTheme,

  openDrawer,
  closeDrawer,

  resetApplication,

  showToast

};


/* =========================================================
   END OF app.js
   ========================================================= */
