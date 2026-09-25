"use strict";

/* =========================================================
SANDEEP ELECTROFIX - ESTIMATE LIST
config.js

MASTER CONFIG

index.html
style.css
config.js
material.js
app.js

IMPORTANT:

- material.js master data is NOT modified here
- Saved estimate data remains compatible
- Hindi / English supported
- Dark / Light theme supported
- View modes supported
  ========================================================= */

window.APP_CONFIG = {

/* =======================================================
APP INFORMATION
======================================================= */

appName: "Estimate List",
appNameHi: "एस्टिमेट लिस्ट",

businessName: "Sandeep ElectroFix",

tagline: "Powering Your Trust",

/* =======================================================
LANGUAGE
======================================================= */

defaultLanguage: "hi",

languageKey: "sandeepMaterialLang",

/* =======================================================
STORAGE
======================================================= */

storageKey: "sandeepEstimateItems",

themeKey: "sandeepTheme",

viewKey: "sandeepMaterialView",

/* =======================================================
UI CONTROLS
======================================================= */

ui: {

/* Top menu / drawer */
menu: true,

/* Hindi / English */
languageButton: true,

/* Top circular Sun / Moon button */
themeButton: true,

/* Bottom navigation */
bottomNav: true,

/* Pages */
estimate: true,
calculator: true,
settings: true,

/* Search */
search: true,

/* Material controls */
viewSwitch: true,
brand: true,
price: true

},

/* =======================================================
MATERIAL / ESTIMATE RULES
======================================================= */

rules: {

/* Quantity must be entered */
quantityRequired: true,

/* Size / Type / Sub Type / Unit / Brand optional
   according to material configuration */
otherFieldsOptional: true,

/* Save entered data */
autoSave: true,

/* Price is optional */
priceOptional: true,

/* Price field remains hidden initially */
priceInitiallyHidden: true,

/* Brand is optional, but NO "Skip Brand" option */
skipBrandOption: false

},

/* =======================================================
VIEW MODES
-------------------------------------------------------
10 modes
======================================================= */

views: {

grid: true,
list: true,
compact: true,
large: true,
mini: true,
twoColumn: true,
horizontal: true,
iconList: true,
timeline: true,
dense: true

},

/* =======================================================
NAVIGATION
======================================================= */

navigation: {

/*
  After Add:
  automatically open the next material.
*/
autoNextAfterAdd: true,

/*
  Next button must NEVER automatically save/add
  the current material.
*/
nextDoesNotAutoAdd: true,

/*
  After moving to next material,
  scroll/position at the top.
*/
scrollNextToTop: true,

/*
  Values already entered should remain available
  when navigating back.
*/
preserveEnteredValues: true

},

/* =======================================================
THEME
======================================================= */

theme: {

dark: true,

light: true,

default: "dark"

}

};

/* =========================================================
BACKWARD COMPATIBILITY
========================================================= */

window.AppConfig = window.APP_CONFIG;
