/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   config.js
   ---------------------------------------------------------
   Central App Configuration
   ---------------------------------------------------------
   IMPORTANT:
   - Master material data = material.js
   - App logic = app.js
   - UI design = style.css
   - This file contains configuration only.
   ========================================================= */

"use strict";


/* =========================================================
   01. APP INFORMATION
   ========================================================= */

const APP_CONFIG = {

  appName: "Sandeep ElectroFix",

  appShortName: "ElectroFix",

  tagline: "Powering Your Trust",

  version: "1.0.0",

  defaultLanguage: "hi",

  defaultTheme: "dark",

  defaultView: "grid",

  defaultPage: "home"

};


/* =========================================================
   02. BRAND INFORMATION
   ========================================================= */

const BRAND_CONFIG = {

  name: "Sandeep ElectroFix",

  owner: "Sandeep Verma",

  tagline: "Powering Your Trust",

  phone: "+919026036445",

  whatsapp: "+919026036445",

  email: "SandeepElectroFix@gmail.com",

  logo: "logo.png",

  pwaIcon192: "assets/pwa-icon-192.png",

  pwaIcon512: "assets/pwa-icon-512.png",

  facebook: "/SandeepElectroFix",

  instagram: "@sandeep_electrofix",

  youtube: "@sandeepelectrofix",

  address:
    "Jhandewalan Chauraha, near Gupta Provision Store, Durvijay Ganj, Ganeshganj, Raniganj, Aminabad, Lucknow, Uttar Pradesh 226018",

  plusCode: "RWVC+267 Lucknow",

  maps:
    "https://maps.app.goo.gl/XYZnm7sFAVRT68Vs7"

};


/* =========================================================
   03. LANGUAGE CONFIGURATION
   ========================================================= */

const LANGUAGE_CONFIG = {

  default: "hi",

  available: [
    "hi",
    "en"
  ],

  names: {
    hi: "हिन्दी",
    en: "English"
  }

};


/* =========================================================
   04. THEME CONFIGURATION
   ========================================================= */

const THEME_CONFIG = {

  default: "dark",

  available: [
    "dark",
    "light"
  ],

  dark: {

    background: "#050816",

    surface: "#07182e",

    surfaceSecondary: "#0a2140",

    blue: "#0ea5e9",

    cyan: "#22d3ee",

    gold: "#facc15"

  },

  light: {

    background: "#f4f8fc",

    surface: "#ffffff",

    surfaceSecondary: "#f0f7fd",

    blue: "#0284c7",

    cyan: "#0891b2",

    gold: "#ca8a04"

  }

};


/* =========================================================
   05. VIEW MODES
   ========================================================= */

const VIEW_CONFIG = {

  default: "grid",

  available: [

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

  ]

};


/* =========================================================
   06. APP ROUTES / PAGES
   ========================================================= */

const PAGE_CONFIG = {

  default: "home",

  available: [

    "home",

    "stage",

    "section",

    "material",

    "editor",

    "estimate",

    "calculator",

    "settings"

  ]

};


/* =========================================================
   07. ESTIMATE RULES
   ========================================================= */

const ESTIMATE_CONFIG = {

  quantityRequired: true,

  otherFieldsOptional: true,

  brandOptional: true,

  priceOptional: true,

  priceInitiallyHidden: true,

  autoAddOnNext: false,

  carryUnitForward: true,

  editableItems: true,

  singleEstimateList: true,

  preserveOrder: true,

  showItemNumber: true,

  showTotal: true

};


/* =========================================================
   08. EDITOR RULES
   ========================================================= */

const EDITOR_CONFIG = {

  quantity: {

    enabled: true,

    required: true

  },

  unit: {

    enabled: true,

    required: false,

    carryForward: true

  },

  brand: {

    enabled: true,

    required: false

  },

  price: {

    enabled: true,

    required: false,

    initiallyVisible: false

  },

  dynamicFields: {

    enabled: true,

    requiredByDefault: false

  }

};


/* =========================================================
   09. NAVIGATION RULES
   ========================================================= */

const NAVIGATION_CONFIG = {

  home: "home",

  estimate: "estimate",

  calculator: "calculator",

  settings: "settings",

  materialFlow: [

    "home",

    "stage",

    "section",

    "material",

    "editor"

  ],

  backBehavior: [

    "editor",

    "material",

    "section",

    "stage",

    "home"

  ],

  closeDrawerOnNavigation: true,

  closeMenusOnNavigation: true,

  preservePageOnRefresh: true,

  preserveSelectionOnRefresh: true,

  preserveDraftOnRefresh: true

};


/* =========================================================
   10. SEARCH CONFIGURATION
   ========================================================= */

const SEARCH_CONFIG = {

  enabled: true,

  minimumCharacters: 0,

  caseSensitive: false,

  searchMaterialName: true,

  searchHindiName: true,

  searchEnglishName: true,

  searchStage: true,

  searchSection: true,

  clearButton: true,

  liveSearch: true

};


/* =========================================================
   11. FILTER CONFIGURATION
   ========================================================= */

const FILTER_CONFIG = {

  enabled: true,

  byStage: true,

  bySection: true,

  byBrand: true,

  byUnit: true,

  byOptions: true,

  resetAvailable: true,

  applyAvailable: true

};


/* =========================================================
   12. DRAWER CONFIGURATION
   ========================================================= */

const DRAWER_CONFIG = {

  enabled: true,

  closeButton: true,

  backdrop: true,

  closeOnBackdrop: true,

  closeOnNavigation: true,

  closeOnEscape: true,

  closeOnAndroidBack: true,

  showLanguage: true,

  showTheme: true,

  showReset: true

};


/* =========================================================
   13. BOTTOM NAVIGATION
   ========================================================= */

const BOTTOM_NAV_CONFIG = {

  enabled: true,

  items: [

    "home",

    "estimate",

    "calculator",

    "settings"

  ],

  showEstimateBadge: true

};


/* =========================================================
   14. CALCULATOR CONFIGURATION
   ========================================================= */

const CALCULATOR_CONFIG = {

  enabled: true,

  powerFormula: "P = V × I",

  currentFormula: "I = P ÷ V",

  voltageFormula: "V = P ÷ I",

  inverterEnabled: true,

  inverterInputVoltages: [

    12,

    24

  ],

  inverterOutputVoltage: 230

};


/* =========================================================
   15. DISPLAY / SHOW-HIDE CONFIGURATION
   ========================================================= */

const DISPLAY_CONFIG = {

  header: true,

  brand: true,

  menuButton: true,

  viewMode: true,

  search: true,

  filter: true,

  stageSelector: true,

  sectionSelector: true,

  materialSelector: true,

  materialOptions: true,

  quantity: true,

  unit: true,

  brandField: true,

  price: false,

  estimate: true,

  estimateTotal: true,

  calculator: true,

  settings: true,

  bottomNav: true,

  drawer: true,

  toast: true,

  recentEstimate: true,

  pageHeading: true,

  editorActions: true,

  nextItem: true

};


/* =========================================================
   16. ESTIMATE ITEM DISPLAY
   ========================================================= */

const ESTIMATE_DISPLAY_CONFIG = {

  itemNumber: true,

  materialName: true,

  quantity: true,

  unit: true,

  brand: true,

  price: false,

  total: false,

  editButton: true,

  deleteButton: true,

  duplicateButton: false

};


/* =========================================================
   17. STORAGE KEYS
   ========================================================= */

const STORAGE_KEYS = {

  language:
    "sandeepMaterialLang",

  theme:
    "sandeepTheme",

  estimateItems:
    "sandeepEstimateItems",

  materialView:
    "sandeepMaterialView",

  stageView:
    "sandeepStageView",

  estimateRoute:
    "sandeepEstimateRoute",

  lastUnit:
    "sandeepLastUnit",

  currentPage:
    "sandeepCurrentPage",

  currentStage:
    "sandeepCurrentStage",

  currentSection:
    "sandeepCurrentSection",

  currentMaterial:
    "sandeepCurrentMaterial",

  draft:
    "sandeepEstimateDraft",

  filters:
    "sandeepEstimateFilters",

  display:
    "sandeepDisplaySettings"

};


/* =========================================================
   18. STORAGE DEFAULTS
   ========================================================= */

const STORAGE_DEFAULTS = {

  language:
    LANGUAGE_CONFIG.default,

  theme:
    THEME_CONFIG.default,

  materialView:
    VIEW_CONFIG.default,

  currentPage:
    PAGE_CONFIG.default,

  estimateItems:
    [],

  lastUnit:
    "",

  currentStage:
    null,

  currentSection:
    null,

  currentMaterial:
    null,

  draft:
    {},

  filters:
    {},

  display:
    DISPLAY_CONFIG

};


/* =========================================================
   19. UI SELECTORS
   ========================================================= */

const UI_SELECTORS = {

  app:
    "#app",

  header:
    "#appHeader",

  menuButton:
    "#menuBtn",

  drawer:
    "#appDrawer",

  drawerBackdrop:
    "#drawerBackdrop",

  drawerClose:
    "#drawerClose",

  search:
    "#searchSection",

  searchInput:
    "#searchInput",

  searchClear:
    "#searchClear",

  filterButton:
    "#filterBtn",

  filterPanel:
    "#filterPanel",

  filterContent:
    "#filterContent",

  viewModeButton:
    "#viewModeBtn",

  viewModeMenu:
    "#viewModeMenu",

  pageContainer:
    "#pageContainer",

  stageGrid:
    "#stageGrid",

  sectionGrid:
    "#sectionGrid",

  materialGrid:
    "#materialGrid",

  materialOptions:
    "#materialOptionsGrid",

  editor:
    "#materialEditor",

  dynamicFields:
    "#dynamicFields",

  quantity:
    "#quantityInput",

  unit:
    "#unitSelect",

  brand:
    "#brandSelect",

  price:
    "#priceInput",

  estimateList:
    "#estimateList",

  estimateCount:
    "#estimateItemCount",

  estimateTotal:
    "#estimateTotal",

  calculator:
    "#calculatorContent",

  bottomNav:
    "#bottomNav",

  toast:
    "#toast",

  toastMessage:
    "#toastMessage",

  modalLayer:
    "#modalLayer",

  modalTitle:
    "#modalTitle",

  modalMessage:
    "#modalMessage"

};


/* =========================================================
   20. CSS DATA ATTRIBUTES
   ========================================================= */

const UI_DATA_ATTRIBUTES = {

  page:
    "data-page",

  action:
    "data-action",

  language:
    "data-language",

  theme:
    "data-theme",

  view:
    "data-view-mode",

  ui:
    "data-ui",

  field:
    "data-field",

  uiToggle:
    "data-ui-toggle"

};


/* =========================================================
   21. TOAST SETTINGS
   ========================================================= */

const TOAST_CONFIG = {

  enabled: true,

  duration: 2200,

  successIcon: "✓",

  errorIcon: "!",

  infoIcon: "i"

};


/* =========================================================
   22. MODAL SETTINGS
   ========================================================= */

const MODAL_CONFIG = {

  enabled: true,

  closeOnBackdrop: false,

  closeOnEscape: true,

  requireConfirmationForReset: true

};


/* =========================================================
   23. RESET SETTINGS
   ========================================================= */

const RESET_CONFIG = {

  resetEstimate: true,

  resetDraft: true,

  resetNavigation: true,

  resetFilters: true,

  resetView: true,

  resetDisplaySettings: true,

  resetLanguage: false,

  resetTheme: false

};


/* =========================================================
   24. ACCESSIBILITY
   ========================================================= */

const ACCESSIBILITY_CONFIG = {

  focusSearchOnSearchOpen: false,

  focusFirstFieldOnEditorOpen: true,

  announceNavigation: true,

  announceAddedItem: true,

  keyboardEscapeClosesDrawer: true,

  keyboardEscapeClosesModal: true

};


/* =========================================================
   25. PWA CONFIGURATION
   ========================================================= */

const PWA_CONFIG = {

  enabled: true,

  manifest:
    "manifest.json",

  icon192:
    "assets/pwa-icon-192.png",

  icon512:
    "assets/pwa-icon-512.png",

  installPrompt: true

};


/* =========================================================
   26. DEBUG
   ========================================================= */

const DEBUG_CONFIG = {

  enabled: false,

  logNavigation: false,

  logStorage: false,

  logMaterialSelection: false,

  logEstimate: false

};


/* =========================================================
   27. FREEZE CONFIGURATION
   ---------------------------------------------------------
   Prevent accidental modification by app.js.
   ========================================================= */

Object.freeze(APP_CONFIG);
Object.freeze(BRAND_CONFIG);
Object.freeze(LANGUAGE_CONFIG);
Object.freeze(THEME_CONFIG);
Object.freeze(VIEW_CONFIG);
Object.freeze(PAGE_CONFIG);
Object.freeze(ESTIMATE_CONFIG);
Object.freeze(EDITOR_CONFIG);
Object.freeze(NAVIGATION_CONFIG);
Object.freeze(SEARCH_CONFIG);
Object.freeze(FILTER_CONFIG);
Object.freeze(DRAWER_CONFIG);
Object.freeze(BOTTOM_NAV_CONFIG);
Object.freeze(CALCULATOR_CONFIG);
Object.freeze(DISPLAY_CONFIG);
Object.freeze(ESTIMATE_DISPLAY_CONFIG);
Object.freeze(STORAGE_KEYS);
Object.freeze(STORAGE_DEFAULTS);
Object.freeze(UI_SELECTORS);
Object.freeze(UI_DATA_ATTRIBUTES);
Object.freeze(TOAST_CONFIG);
Object.freeze(MODAL_CONFIG);
Object.freeze(RESET_CONFIG);
Object.freeze(ACCESSIBILITY_CONFIG);
Object.freeze(PWA_CONFIG);
Object.freeze(DEBUG_CONFIG);


/* =========================================================
   END OF CONFIG.JS
   ========================================================= */
