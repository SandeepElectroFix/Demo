/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   5 FILE STRUCTURE
   index.html
   style.css
   config.js
   material.js
   app.js

   LANGUAGE:
   Hindi / English - Full UI + Material Translation

   IMPORTANT:
   material.js master data is NOT modified.
   Internal values remain English so saved data stays safe.
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     01. GLOBAL CONFIG / MASTER DATA
     ======================================================= */

  const C = window.APP_CONFIG || {};
  const M = Array.isArray(window.MATERIALS)
    ? window.MATERIALS
    : [];

  const $ = selector =>
    document.querySelector(selector);

  const $$ = selector =>
    [...document.querySelectorAll(selector)];

  const storeKey =
    C.storageKey ||
    "sandeepEstimateItems";

  const langKey =
    C.languageKey ||
    "sandeepMaterialLang";

  const viewKey =
    C.viewKey ||
    "sandeepMaterialView";

  const themeKey =
    C.themeKey ||
    "sandeepTheme";

  const stateKey =
    "sandeepEstimateAppState";

  const stageViewKey =
    "sandeepStageView";


  /* =======================================================
     02. APP STATE
     ======================================================= */

  let lang =
    localStorage.getItem(langKey) ||
    C.defaultLanguage ||
    "hi";

  let page = "home";

  let currentStage = -1;

  let currentIndex = -1;

  let view =
    localStorage.getItem(viewKey) ||
    "grid";

  let stageView =
    localStorage.getItem(stageViewKey) ||
    "grid";

  let lastValues = {};

  let draft = {};

  let internalNavigation = false;


  /* =======================================================
     03. COMMON UI TEXT
     ======================================================= */

  const TEXT = {

    hi: {

      home: "होम",

      estimate: "एस्टिमेट",

      calculator: "कैलकुलेटर",

      settings: "सेटिंग्स",

      menu: "मेन्यू",

      items: "आइटम",

      open: "खोलें",

      back: "वापस",

      quantity: "मात्रा",

      unit: "यूनिट",

      brand: "ब्रांड",

      optional: "वैकल्पिक",

      add: "एस्टिमेट में जोड़ें",

      added: "एस्टिमेट में जोड़ दिया गया",

      required: "मात्रा भरना जरूरी है",

      other:
        "बाकी सभी फ़ील्ड वैकल्पिक हैं",

      price: "कीमत",

      addPrice: "कीमत जोड़ें",

      hidePrice: "कीमत छुपाएँ",

      noItems:
        "अभी कोई आइटम नहीं जोड़ा गया",

      clear:
        "एस्टिमेट साफ करें",

      clearItem:
        "आइटम साफ करें",

      saved:
        "सेव आइटम",

      dark:
        "डार्क",

      light:
        "लाइट",

      grid:
        "ग्रिड",

      list:
        "लिस्ट",

      compact:
        "कॉम्पैक्ट",

      large:
        "बड़ा",

      mini:
        "मिनी",

      twoColumn:
        "2 कॉलम",

      horizontal:
        "हॉरिज़ॉन्टल",

      iconList:
        "आइकन लिस्ट",

      timeline:
        "टाइमलाइन",

      dense:
        "डेंस",

      power:
        "पावर (W)",

      voltage:
        "वोल्टेज (V)",

      current:
        "करंट (A)",

      resistance:
        "रेजिस्टेंस (Ω)",

      calculate:
        "गणना करें",

      formula:
        "फॉर्मूला",

      calcHint:
        "पावर और वोल्टेज भरें",

      electricalFormulas:
        "इलेक्ट्रिकल फॉर्मूला",

      enterPowerVoltage:
        "पावर और वोल्टेज भरें",

      reset:
        "सेव किया गया एस्टिमेट रीसेट करें",

      edit:
        "एडिट",

      delete:
        "डिलीट",

      next:
        "अगला",

      prev:
        "पिछला",

      cancel:
        "रद्द करें",

      exit:
        "बाहर निकलें",

      exitTitle:
        "ऐप बंद करें?",

      exitText:
        "क्या आप ऐप से बाहर जाना चाहते हैं?",

      theme:
        "थीम",

      language:
        "भाषा",

      materialViews:
        "मटेरियल व्यू",

      viewsEnabled:
        "व्यूप्स उपलब्ध",

      confirmClear:
        "क्या आप एस्टिमेट साफ करना चाहते हैं?",

      confirmReset:
        "क्या आप सेव किया गया एस्टिमेट और सेटिंग्स रीसेट करना चाहते हैं?"
    },


    en: {

      home: "Home",

      estimate: "Estimate",

      calculator: "Calculator",

      settings: "Settings",

      menu: "Menu",

      items: "Items",

      open: "Open",

      back: "Back",

      quantity: "Quantity",

      unit: "Unit",

      brand: "Brand",

      optional: "optional",

      add: "Add to Estimate",

      added: "Added to Estimate",

      required: "Quantity is required",

      other:
        "All other fields are optional",

      price: "Price",

      addPrice: "Add Price",

      hidePrice: "Hide Price",

      noItems:
        "No items added yet",

      clear:
        "Clear Estimate",

      clearItem:
        "Clear Item",

      saved:
        "saved items",

      dark:
        "Dark",

      light:
        "Light",

      grid:
        "Grid",

      list:
        "List",

      compact:
        "Compact",

      large:
        "Large",

      mini:
        "Mini",

      twoColumn:
        "2 Column",

      horizontal:
        "Horizontal",

      iconList:
        "Icon List",

      timeline:
        "Timeline",

      dense:
        "Dense",

      power:
        "Power (W)",

      voltage:
        "Voltage (V)",

      current:
        "Current (A)",

      resistance:
        "Resistance (Ω)",

      calculate:
        "Calculate",

      formula:
        "Formula",

      calcHint:
        "Enter Power and Voltage",

      electricalFormulas:
        "Electrical Formulas",

      enterPowerVoltage:
        "Enter Power and Voltage",

      reset:
        "Reset saved estimate",

      edit:
        "Edit",

      delete:
        "Delete",

      next:
        "Next",

      prev:
        "Previous",

      cancel:
        "Cancel",

      exit:
        "Exit",

      exitTitle:
        "Exit App?",

      exitText:
        "Do you want to leave the app?",

      theme:
        "Theme",

      language:
        "Language",

      materialViews:
        "Material Views",

      viewsEnabled:
        "views enabled",

      confirmClear:
        "Clear estimate?",

      confirmReset:
        "Reset saved estimate and preferences?"
    }
  };


  const t = key =>
    (TEXT[lang] || TEXT.en)[key] ||
    key;


  /* =======================================================
     04. MATERIAL TRANSLATION DICTIONARY
     -------------------------------------------------------
     IMPORTANT:
     Original material.js values remain unchanged.
     Only display text is translated.
     ======================================================= */

  const MT = {

    /* ---------- STAGES ---------- */

    "STAGE 1":
      "स्टेज 1",

    "STAGE 2":
      "स्टेज 2",

    "STAGE 3":
      "स्टेज 3",

    "STAGE 4":
      "स्टेज 4",

    "STAGE 5":
      "स्टेज 5",

    "Slab Conduit Installation":
      "स्लैब कंड्यूट इंस्टॉलेशन",

    "Wall Conduit Installation":
      "दीवार कंड्यूट इंस्टॉलेशन",

    "Wiring Installation":
      "वायरिंग इंस्टॉलेशन",

    "Final Electrical Fittings":
      "फाइनल इलेक्ट्रिकल फिटिंग्स",

    "False Ceiling Wiring Material":
      "फॉल्स सीलिंग वायरिंग सामग्री",


    /* ---------- GROUPS ---------- */

    "Conduit & Box":
      "कंड्यूट और बॉक्स",

    "Wiring Material":
      "वायरिंग सामग्री",

    "Switch & Socket":
      "स्विच और सॉकेट",

    "Wiring & Conduit":
      "वायरिंग और कंड्यूट",

    "Installation Material":
      "इंस्टॉलेशन सामग्री",

    "Pulling Material":
      "पुलिंग सामग्री",

    "MCB & Protection":
      "MCB और प्रोटेक्शन",

    "Fan & Ceiling":
      "फैन और सीलिंग",

    "Lighting":
      "लाइटिंग",

    "Installation & Finishing":
      "इंस्टॉलेशन और फिनिशिंग",

    "Installation & Fastening":
      "इंस्टॉलेशन और फास्टनिंग",


    /* ---------- MAIN MATERIALS ---------- */

    "Pipe":
      "पाइप",

    "Bend":
      "बेंड",

    "Junction Box":
      "जंक्शन बॉक्स",

    "Fan Box":
      "फैन बॉक्स",

    "Concealed Light Box":
      "कंसील्ड लाइट बॉक्स",

    "Tape":
      "टेप",

    "Tape (Shuttering & Joint Sealing)":
      "टेप (शटरिंग और जॉइंट सीलिंग)",

    "Solvent Cement":
      "सॉल्वेंट सीमेंट",

    "Neel Powder (Marking Powder)":
      "नील पाउडर (मार्किंग पाउडर)",

    "Binding Wire":
      "बाइंडिंग वायर",

    "Cable Tie / Zip Tie":
      "केबल टाई / जिप टाई",

    "Modular Board (Concealed Metal/PVC Box)":
      "मॉड्यूलर बोर्ड (कंसील्ड मेटल/PVC बॉक्स)",

    "MCB Box (Distribution Board)":
      "MCB बॉक्स (डिस्ट्रीब्यूशन बोर्ड)",

    "Tape (Masking & Plaster Protection)":
      "टेप (मास्किंग और प्लास्टर प्रोटेक्शन)",

    "Cable Clip":
      "केबल क्लिप",

    "Wire":
      "वायर",

    "Flexible Pipe":
      "फ्लेक्सिबल पाइप",

    "Electrical Tape":
      "इलेक्ट्रिकल टेप",

    "Fastener":
      "फास्टनर",

    "Steel Wire / Spring Wire (Fish Tape)":
      "स्टील वायर / स्प्रिंग वायर (फिश टेप)",


    /* ---------- STAGE 4 ---------- */

    "Switch Plate":
      "स्विच प्लेट",

    "Switch Board (Surface Gang Box)":
      "स्विच बोर्ड (सरफेस गैंग बॉक्स)",

    "Switch":
      "स्विच",

    "Socket":
      "सॉकेट",

    "Fan Regulator":
      "फैन रेगुलेटर",

    "2 Way Switch":
      "2 वे स्विच",

    "Bell Push":
      "बेल पुश",

    "Neon Indicator":
      "नियॉन इंडिकेटर",

    "Blank Plate / Dummy Switch":
      "ब्लैंक प्लेट / डमी स्विच",

    "DP Switch (Double Pole Switch)":
      "DP स्विच (डबल पोल स्विच)",

    "Mini MCB":
      "मिनी MCB",

    "SP MCB (Single Pole)":
      "SP MCB (सिंगल पोल)",

    "DP MCB (Double Pole)":
      "DP MCB (डबल पोल)",

    "TPN MCB (Three Pole with Neutral)":
      "TPN MCB (थ्री पोल विद न्यूट्रल)",

    "MCB Changeover":
      "MCB चेंजओवर",

    "DP Isolator":
      "DP आइसोलेटर",

    "TPN Isolator (3P / 4P)":
      "TPN आइसोलेटर (3P / 4P)",

    "RCCB / RCD":
      "RCCB / RCD",

    "MCB Box":
      "MCB बॉक्स",

    "Kit Kat Fuse":
      "किट-कैट फ्यूज",

    "Fan Sheet":
      "फैन शीट",

    "Round Sheet":
      "राउंड शीट",

    "Fan Rod":
      "फैन रॉड",

    "Fan Clamp":
      "फैन क्लैंप",

    "Holder":
      "होल्डर",

    "Ceiling Rose":
      "सीलिंग रोज",

    "Chain":
      "चेन",


    /* ---------- LIGHTING ---------- */

    "LED Bulb":
      "LED बल्ब",

    "LED Tube Light":
      "LED ट्यूब लाइट",

    "Foot Light":
      "फुट लाइट",

    "Up Down Light":
      "अप डाउन लाइट",

    "Panel Light":
      "पैनल लाइट",

    "Surface Light":
      "सरफेस लाइट",

    "COB Light":
      "COB लाइट",

    "COB Spot Light":
      "COB स्पॉट लाइट",

    "Down Light":
      "डाउन लाइट",

    "Strip Light":
      "स्ट्रिप लाइट",

    "Rope Light":
      "रोप लाइट",

    "LED Profile Channel":
      "LED प्रोफाइल चैनल",

    "LED Strip Driver (SMPS)":
      "LED स्ट्रिप ड्राइवर (SMPS)",


    /* ---------- FINISHING ---------- */

    "Door Bell":
      "डोर बेल",

    "Tape (Mounting / Double Sided)":
      "माउंटिंग / डबल साइडेड टेप",

    "Instant Glue":
      "इंस्टेंट ग्लू",

    "Araldite Glue (Epoxy)":
      "अराल्डाइट ग्लू (एपॉक्सी)",

    "POP (Plaster of Paris)":
      "POP (प्लास्टर ऑफ पेरिस)",

    "Putty Blade / Patta":
      "पुट्टी ब्लेड / पट्टा",

    "Screw":
      "स्क्रू",

    "Lug (Cable Terminal Lug)":
      "लग (केबल टर्मिनल लग)",

    "Washer":
      "वॉशर",


    /* ---------- STAGE 5 ---------- */

    "Saddle (Pipe Clamp)":
      "सैडल (पाइप क्लैंप)",

    "PVC Wall Plug / Gulli / Gitti":
      "PVC वॉल प्लग / गुल्ली / गिट्टी",


    /* ---------- FIELD LABELS ---------- */

    "Size":
      "साइज",

    "Type":
      "टाइप",

    "Sub Type":
      "सब टाइप",

    "Conduit Size":
      "कंड्यूट साइज",

    "Shape / Ways":
      "शेप / वे",

    "Material":
      "मटेरियल",

    "Module":
      "मॉड्यूल",

    "Depth":
      "गहराई",

    "Ways":
      "वे",

    "Hook Rod":
      "हुक रॉड",

    "Diameter":
      "डायमीटर",

    "Material Type":
      "मटेरियल टाइप",

    "Size (Width)":
      "साइज (चौड़ाई)",

    "Pack Size":
      "पैक साइज",

    "Gauge / Size":
      "गेज / साइज",

    "Size (Length)":
      "साइज (लंबाई)",

    "Colour":
      "रंग",

    "Phase Selection":
      "फेज सिलेक्शन",

    "Door Type":
      "डोर टाइप",

    "Amp":
      "एम्पियर",

    "Curve":
      "कर्व",

    "Sensitivity":
      "सेंसिटिविटी",

    "Door":
      "डोर",

    "Voltage":
      "वोल्टेज",

    "Length":
      "लंबाई",

    "Wattage":
      "वॉटेज",

    "Base":
      "बेस",

    "Colour Temp":
      "कलर टेम्परेचर",

    "Mounting":
      "माउंटिंग",

    "Shape":
      "शेप",

    "Movement":
      "मूवमेंट",

    "Beam Angle":
      "बीम एंगल",

    "Body Finish":
      "बॉडी फिनिश",

    "Density":
      "डेंसिटी",

    "Supply Voltage":
      "सप्लाई वोल्टेज",

    "Dimensions (W × D)":
      "डायमेंशन (W × D)",

    "Diffuser":
      "डिफ्यूज़र",

    "Output Voltage":
      "आउटपुट वोल्टेज",

    "Size (Weight)":
      "साइज (वजन)",

    "Pack Size (Weight)":
      "पैक साइज (वजन)",

    "Size (Cable Size × Stud Size)":
      "साइज (केबल साइज × स्टड साइज)",


    /* ---------- COMMON OPTIONS ---------- */

    "Heavy":
      "हेवी",

    "Medium":
      "मीडियम",

    "Light":
      "लाइट",

    "Heavy (HMS)":
      "हेवी (HMS)",

    "Medium (MMS)":
      "मीडियम (MMS)",

    "Light (LMS)":
      "लाइट (LMS)",

    "Short":
      "शॉर्ट",

    "Long":
      "लॉन्ग",

    "Short Bend":
      "शॉर्ट बेंड",

    "Long Bend":
      "लॉन्ग बेंड",

    "Normal":
      "नॉर्मल",

    "Deep":
      "डीप",

    "Normal Junction Box":
      "नॉर्मल जंक्शन बॉक्स",

    "Deep Junction Box":
      "डीप जंक्शन बॉक्स",

    "PVC":
      "PVC",

    "GI":
      "GI",

    "GI Metal":
      "GI मेटल",

    "MS Metal":
      "MS मेटल",

    "1 Way":
      "1 वे",

    "2 Way Straight":
      "2 वे स्ट्रेट",

    "2 Way Angle":
      "2 वे एंगल",

    "3 Way T-Type":
      "3 वे T-Type",

    "4 Way Cross":
      "4 वे क्रॉस",

    "4 Way Cross Type":
      "4 वे क्रॉस टाइप",

    "Y Type":
      "Y टाइप",

    "H Type":
      "H टाइप",

    "U Type":
      "U टाइप",

    "V Type":
      "V टाइप",

    "Y/H/U/V Type":
      "Y/H/U/V टाइप",

    "White":
      "सफेद",

    "Black":
      "काला",

    "Red":
      "लाल",

    "Green":
      "हरा",

    "Yellow":
      "पीला",

    "Blue":
      "नीला",

    "Grey":
      "ग्रे",

    "Single Door":
      "सिंगल डोर",

    "Double Door":
      "डबल डोर",

    "Transparent Acrylic Door":
      "ट्रांसपेरेंट एक्रेलिक डोर",

    "Single Phase (SPN)":
      "सिंगल फेज (SPN)",

    "Three Phase (TPN)":
      "थ्री फेज (TPN)",

    "Single Phase":
      "सिंगल फेज",

    "Three Phase":
      "थ्री फेज",

    "1 Way Switch":
      "1 वे स्विच",

    "Intermediate Switch":
      "इंटरमीडिएट स्विच",

    "2 Pin Socket":
      "2 पिन सॉकेट",

    "3 Pin Multi Socket":
      "3 पिन मल्टी सॉकेट",

    "Standard Bell Push":
      "स्टैंडर्ड बेल पुश",

    "Bell Push with Indicator":
      "इंडिकेटर वाला बेल पुश",

    "Bell Push with Indicator / Nameplate":
      "इंडिकेटर / नेमप्लेट वाला बेल पुश",

    "Fixed":
      "फिक्स्ड",

    "Swivel / Gimbal":
      "स्विवेल / गिम्बल",

    "Swivel/Gimbal":
      "स्विवेल/गिम्बल",

    "Warm White":
      "वार्म व्हाइट",

    "Cool White":
      "कूल व्हाइट",

    "Natural White":
      "नेचुरल व्हाइट",

    "Round":
      "राउंड",

    "Square":
      "स्क्वायर",

    "Recessed":
      "रिसेस्ड",

    "Concealed":
      "कंसील्ड",

    "Surface Mount":
      "सरफेस माउंट",

    "Plain Flat Washer":
      "प्लेन फ्लैट वॉशर",

    "Spring Washer":
      "स्प्रिंग वॉशर",

    "Copper":
      "कॉपर",

    "Aluminium":
      "एल्युमिनियम",

    "Stainless Steel":
      "स्टेनलेस स्टील",

    "Brass":
      "ब्रास",

    "Self Tapping":
      "सेल्फ टैपिंग",

    "Self Drilling":
      "सेल्फ ड्रिलिंग",


    /* ---------- VIEW NAMES ---------- */

    "Grid":
      "ग्रिड",

    "List":
      "लिस्ट",

    "Compact":
      "कॉम्पैक्ट",

    "Large":
      "बड़ा",

    "Mini":
      "मिनी",

    "2 Column":
      "2 कॉलम",

    "Horizontal":
      "हॉरिज़ॉन्टल",

    "Icon List":
      "आइकन लिस्ट",

    "Timeline":
      "टाइमलाइन",

    "Dense":
      "डेंस"
  };


  /* =======================================================
     05. TRANSLATION FUNCTION
     ======================================================= */

  function tx(value) {

    const text = String(
      value ?? ""
    );

    if (lang === "en") {
      return text;
    }

    return MT[text] || text;
  }


  /* =======================================================
     06. STORAGE
     ======================================================= */

  function readItems() {

    try {

      return JSON.parse(
        localStorage.getItem(storeKey) ||
        "[]"
      );

    } catch {

      return [];

    }
  }


  function writeItems(items) {

    localStorage.setItem(
      storeKey,
      JSON.stringify(items)
    );

  }


  function saveState() {

    try {

      localStorage.setItem(
        stateKey,
        JSON.stringify({
          page,
          currentStage,
          currentIndex,
          view,
          stageView
        })
      );

    } catch {}

  }


  function loadState() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(stateKey) ||
          "null"
        );

      if (!saved) return;

      if (
        typeof saved.page === "string"
      ) {
        page = saved.page;
      }

      if (
        Number.isInteger(
          saved.currentStage
        )
      ) {
        currentStage =
          saved.currentStage;
      }

      if (
        Number.isInteger(
          saved.currentIndex
        )
      ) {
        currentIndex =
          saved.currentIndex;
      }

      if (
        typeof saved.view === "string"
      ) {
        view = saved.view;
      }

      if (
        typeof saved.stageView === "string"
      ) {
        stageView =
          saved.stageView;
      }

    } catch {}

  }


  /* =======================================================
     07. ESCAPE HTML
     ======================================================= */

  function esc(value) {

    return String(
      value ?? ""
    ).replace(
      /[&<>"']/g,
      char =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]
    );

  }


  /* =======================================================
     08. MATERIAL HELPERS
     ======================================================= */

  function stageItems(stage) {

    if (!stage) return [];

    const direct =
      Array.isArray(stage[3])
        ? stage[3]
        : [];

    const groups =
      Array.isArray(stage[4])
        ? stage[4]
        : [];

    return [
      ...direct,

      ...groups.flatMap(group =>
        Array.isArray(group?.[1])
          ? group[1]
          : []
      )
    ];
  }


  function allItems() {

    return M.flatMap(
      (stage, stageIndex) =>
        stageItems(stage).map(
          (item, itemIndex) => ({
            stage:
              stage[0],

            stageName:
              stage[1],

            item,

            stageIndex,

            itemIndex
          })
        )
    );

  }


  /* =======================================================
     09. CONFIG / COMMON UI
     ======================================================= */

  function applyConfig() {

    const u =
      C.ui || {};

    const menuBtn =
      $("#menuBtn");

    const drawer =
      $("#drawer");

    const langBtn =
      $("#langBtn");

    const bottomNav =
      $("#bottomNav");


    if (menuBtn) {

      menuBtn.style.display =
        u.menu === false
          ? "none"
          : "";

    }


    if (drawer) {

      drawer.style.display =
        u.menu === false
          ? "none"
          : "";

    }


    if (langBtn) {

      langBtn.style.display =
        u.languageButton === false
          ? "none"
          : "";

      langBtn.textContent =
        lang === "hi"
          ? "EN"
          : "हि";

      langBtn.setAttribute(
        "aria-label",
        lang === "hi"
          ? "Switch to English"
          : "हिंदी में बदलें"
      );

    }


    if (bottomNav) {

      bottomNav.style.display =
        u.bottomNav === false
          ? "none"
          : "";

    }


    /* ---------- DRAWER LANGUAGE ---------- */

    $$("#drawer [data-page]")
      .forEach(button => {

        const span =
          button.querySelector("span");

        if (!span) return;

        span.textContent =
          t(button.dataset.page);

      });


    /* ---------- BOTTOM NAV LANGUAGE ---------- */

    $$("#bottomNav [data-page]")
      .forEach(button => {

        const span =
          button.querySelector("span");

        if (!span) return;

        span.textContent =
          t(button.dataset.page);

      });


    /* ---------- THEME ---------- */

    document.body.dataset.theme =
      localStorage.getItem(
        themeKey
      ) || "dark";


    /* ---------- SPLASH ---------- */

    const splash =
      $("#splash");

    if (splash) {

      if (u.splash === false) {

        splash.remove();

      }

    }

  }


  /* =======================================================
     10. RENDER
     ======================================================= */

  function render() {

    applyConfig();

    const main =
      $("#main");

    if (!main) return;


    if (page === "home") {

      main.innerHTML =
        home();

    }

    else if (page === "stage") {

      renderStage();

    }

    else if (page === "item") {

      renderItem();

    }

    else if (page === "estimate") {

      main.innerHTML =
        C.ui?.estimate === false
          ? home()
          : estimate();

    }

    else if (page === "calculator") {

      main.innerHTML =
        C.ui?.calculator === false
          ? home()
          : calculator();

    }

    else {

      main.innerHTML =
        C.ui?.settings === false
          ? home()
          : settings();

    }


    bindCommon();

    saveState();

  }


  /* =======================================================
     11. COMMON NAVIGATION
     ======================================================= */

  function bindCommon() {

    /* ---------- PAGE BUTTONS ---------- */

    $$("[data-page]")
      .forEach(button => {

        button.onclick = () => {

          const target =
            button.dataset.page;

          if (
            target === "estimate" &&
            C.ui?.estimate === false
          ) {
            return;
          }

          if (
            target === "calculator" &&
            C.ui?.calculator === false
          ) {
            return;
          }

          if (
            target === "settings" &&
            C.ui?.settings === false
          ) {
            return;
          }

          page = target;

          closeDrawer();

          render();

        };

      });


    /* ---------- LANGUAGE ---------- */

    const langBtn =
      $("#langBtn");

    if (
      langBtn &&
      C.ui?.languageButton !== false
    ) {

      langBtn.onclick = () => {

        lang =
          lang === "hi"
            ? "en"
            : "hi";

        localStorage.setItem(
          langKey,
          lang
        );

        render();

      };

    }


    /* ---------- MENU ---------- */

    const menu =
      $("#menuBtn");

    if (
      menu &&
      C.ui?.menu !== false
    ) {

      menu.onclick =
        openDrawer;

    }


    /* ---------- CLOSE MENU ---------- */

    const close =
      $("#closeMenu");

    if (close) {

      close.onclick =
        closeDrawer;

    }


    /* ---------- DRAWER ---------- */

    $("#drawer")
      ?.querySelectorAll(
        "[data-page]"
      )
      .forEach(button => {

        button.onclick = () => {

          page =
            button.dataset.page;

          closeDrawer();

          render();

        };

      });

  }


  function openDrawer() {

    const drawer =
      $("#drawer");

    if (!drawer) return;

    drawer.classList.add(
      "open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function closeDrawer() {

    const drawer =
      $("#drawer");

    if (!drawer) return;

    drawer.classList.remove(
      "open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  /* =======================================================
     12. HOME
     ======================================================= */

  function home() {

    const appTitle =
      lang === "hi"
        ? (
            C.appNameHi ||
            C.appName ||
            "एस्टिमेट लिस्ट"
          )
        : (
            C.appName ||
            "Estimate List"
          );


    return `
      <section class="page">

        <div class="hero">

          <img
            src="logo.png"
            class="heroLogo"
            alt="Sandeep ElectroFix Logo"
          >

          <span>
            POWERING YOUR TRUST
          </span>

          <h1>
            ${esc(appTitle)}
          </h1>

          <p>
            ${allItems().length}
            ${esc(
              lang === "hi"
                ? "मटेरियल एंट्री"
                : "configured material entries"
            )}
          </p>

        </div>


        <div class="stageGrid">

          ${M.map(
            (stage, index) => {

              return `
                <button
                  class="stageCard"
                  data-stage="${index}"
                  type="button"
                >

                  <small>
                    ${esc(
                      tx(stage[0])
                    )}
                  </small>

                  <b>
                    ${esc(
                      tx(stage[1])
                    )}
                  </b>

                  <span>
                    ${stageItems(stage).length}
                    ${esc(t("items"))}
                  </span>

                </button>
              `;

            }
          ).join("")}

        </div>

      </section>
    `;

  }


  /* =======================================================
     13. VIEW MODES
     ======================================================= */

  function getViewModes() {

    return [

      [
        "grid",
        "▦",
        t("grid")
      ],

      [
        "list",
        "☰",
        t("list")
      ],

      [
        "compact",
        "≡",
        t("compact")
      ],

      [
        "large",
        "▣",
        t("large")
      ],

      [
        "mini",
        "☷",
        t("mini")
      ],

      [
        "two-column",
        "▤",
        t("twoColumn")
      ],

      [
        "horizontal",
        "↔",
        t("horizontal")
      ],

      [
        "icon-list",
        "◉",
        t("iconList")
      ],

      [
        "timeline",
        "⌁",
        t("timeline")
      ],

      [
        "dense",
        "▤",
        t("dense")
      ]

    ];

  }


  function viewOptions() {

    return `
      <div
        class="viewOptions"
        role="menu"
      >

        ${getViewModes()
          .map(
            ([value, icon, name]) => `
              <button
                type="button"
                data-view="${esc(value)}"
                class="${view === value ? "active" : ""}"
              >
                ${icon}
                <span>
                  ${esc(name)}
                </span>
              </button>
            `
          )
          .join("")}

      </div>
    `;

  }


  /* =======================================================
     14. STAGE PAGE
     ======================================================= */

  function renderStage() {

    const stage =
      M[currentStage];

    if (!stage) {

      page = "home";

      return render();

    }


    const items =
      stageItems(stage);


    const main =
      $("#main");

    if (!main) return;


    main.innerHTML = `

      <section class="page">

        <button
          class="back"
          id="backStage"
          type="button"
        >
          ← ${esc(t("back"))}
        </button>


        <div class="hero compact">

          <small>
            ${esc(
              tx(stage[0])
            )}
          </small>

          <h1>
            ${esc(
              tx(stage[1])
            )}
          </h1>

          <p>
            ${items.length}
            ${esc(t("items"))}
          </p>

        </div>


        ${
          C.ui?.viewSwitch !== false
            ? `
              <div
                class="viewSelector"
                id="stageViewSelector"
              >

                <button
                  id="stageViewBtn"
                  class="viewMainBtn"
                  type="button"
                >
                  ☷
                  ${esc(t("items"))}
                  <span>⌄</span>
                </button>

                ${viewOptions()}

              </div>
            `
            : ""
        }


        <div
          class="itemGrid ${esc(view)}"
        >

          ${items
            .map(
              (item, index) => {

                const name =
                  Array.isArray(item)
                    ? item[0]
                    : item;

                return `
                  <button
                    class="itemCard"
                    data-item-index="${index}"
                    type="button"
                  >

                    <div
                      class="itemImage"
                      aria-hidden="true"
                    ></div>

                    <b>
                      ${esc(
                        tx(name)
                      )}
                    </b>

                    <span>
                      ${esc(
                        t("open")
                      )}
                    </span>

                  </button>
                `;

              }
            )
            .join("")}

        </div>

      </section>
    `;


    /* ---------- BACK ---------- */

    $("#backStage").onclick = () => {

      page = "home";

      currentStage = -1;

      currentIndex = -1;

      render();

    };


    /* ---------- ITEM ---------- */

    $$(".itemCard")
      .forEach(button => {

        button.onclick = () => {

          currentIndex =
            Number(
              button.dataset.itemIndex
            );

          page = "item";

          render();

        };

      });


    /* ---------- VIEW BUTTON ---------- */

    $("#stageViewBtn")
      ?.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          const options =
            $("#stageViewSelector .viewOptions");

          if (!options) return;

          options.hidden =
            !options.hidden;

        }
      );


    /* ---------- VIEW OPTIONS ---------- */

    $$("#stageViewSelector [data-view]")
      .forEach(button => {

        button.onclick = event => {

          event.stopPropagation();

          view =
            button.dataset.view;

          localStorage.setItem(
            viewKey,
            view
          );

          renderStage();

        };

      });

  }


  /* =======================================================
     15. FIELD HTML
     ======================================================= */

  function fieldHtml(
    field,
    index
  ) {

    const label =
      Array.isArray(field)
        ? field[0]
        : "";

    const options =
      Array.isArray(field?.[1])
        ? field[1]
        : [];


    const displayLabel =
      tx(label);


    /* ---------- USER INPUT ---------- */

    if (
      options.length === 1 &&
      /^User Input/i.test(
        String(options[0])
      )
    ) {

      return `
        <label class="field">

          <span>
            ${esc(displayLabel)}
          </span>

          <input
            data-field="${index}"
            data-label="${esc(label)}"
            placeholder="${esc(
              lang === "hi"
                ? "यहाँ भरें"
                : options[0]
            )}"
          >

        </label>
      `;

    }


    /* ---------- CHOICE FIELD ---------- */

    return `
      <div class="field">

        <span>
          ${esc(displayLabel)}
        </span>

        <div class="choices">

          ${options
            .map(
              option => `

                <button
                  type="button"
                  class="choice"
                  data-label="${esc(label)}"
                  data-value="${esc(option)}"
                >
                  ${esc(
                    tx(option)
                  )}
                </button>

              `
            )
            .join("")}

        </div>

      </div>
    `;

  }


  /* =======================================================
     16. ITEM PAGE
     ======================================================= */

  function renderItem() {

    const stage =
      M[currentStage];

    const items =
      stageItems(stage);

    const item =
      items[currentIndex];


    if (!item) {

      page = "stage";

      return render();

    }


    const name =
      item[0];

    const fields =
      Array.isArray(item[1])
        ? item[1]
        : [];

    const units =
      Array.isArray(item[2])
        ? item[2]
        : [];

    const brands =
      Array.isArray(item[3])
        ? item[3]
        : [];


    const key =
      `${stage[0]}::${name}`;


    const previous =
      lastValues[key] || {};


    $("#main").innerHTML = `

      <section class="page">

        <button
          class="back"
          id="backItem"
          type="button"
        >
          ← ${esc(t("back"))}
        </button>


        <div class="itemHead">

          <div
            class="itemImage big"
            aria-hidden="true"
          ></div>

          <div>

            <small>
              ${esc(
                tx(stage[0])
              )}
            </small>

            <h1>
              ${esc(
                tx(name)
              )}
            </h1>

          </div>

        </div>


        <div class="formCard">

          ${
            fields
              .map(fieldHtml)
              .join("")
          }


          <!-- QUANTITY -->

          <label class="field">

            <span>
              ${esc(
                t("quantity")
              )}
              *
            </span>

            <input
              id="qty"
              type="number"
              min="0.01"
              step="any"
              inputmode="decimal"
              placeholder="${esc(
                t("quantity")
              )}"
            >

          </label>


          <!-- UNIT -->

          <label class="field">

            <span>
              ${esc(
                t("unit")
              )}
            </span>

            <select id="unit">

              <option value="">
                — ${esc(
                  t("optional")
                )} —
              </option>

              ${units
                .map(
                  unit => `
                    <option
                      value="${esc(unit)}"
                    >
                      ${esc(
                        tx(unit)
                      )}
                    </option>
                  `
                )
                .join("")}

            </select>

          </label>


          <!-- PRICE -->

          ${
            C.ui?.priceField !== false
              ? `

                <div class="priceWrap">

                  <button
                    id="priceToggle"
                    class="priceToggle"
                    type="button"
                  >
                    ＋
                    ${esc(
                      t("addPrice")
                    )}
                  </button>


                  <div
                    id="priceBox"
                    class="priceBox"
                    hidden
                  >

                    <label class="field">

                      <span>
                        ${esc(
                          t("price")
                        )}
                        (
                        ${esc(
                          t("optional")
                        )}
                        )
                      </span>

                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        inputmode="decimal"
                        placeholder="0.00"
                      >

                    </label>


                    <button
                      id="priceHide"
                      class="miniBtn"
                      type="button"
                    >
                      ${esc(
                        t("hidePrice")
                      )}
                    </button>

                  </div>

                </div>

              `
              : ""
          }


          <!-- BRAND -->

          <label class="field">

            <span>

              ${esc(
                t("brand")
              )}

              <em>
                (
                ${esc(
                  t("optional")
                )}
                )
              </em>

            </span>


            <select id="brand">

              <option value="">
                — ${esc(
                  t("optional")
                )} —
              </option>

              ${
                (
                  C.rules?.skipBrandOption
                    ? [
                        "Skip Brand",
                        ...brands
                      ]
                    : brands
                )
                  .map(
                    brand => `
                      <option
                        value="${esc(brand)}"
                      >
                        ${esc(
                          tx(brand)
                        )}
                      </option>
                    `
                  )
                  .join("")
              }

            </select>

          </label>


          <!-- ADD -->

          <button
            id="add"
            class="primary"
            type="button"
          >
            ✓
            ${esc(
              t("add")
            )}
          </button>


          <p class="hint">

            ${esc(
              t("required")
            )}.

            ${esc(
              t("other")
            )}.

          </p>

        </div>

      </section>

    `;


    /* =====================================================
       RESTORE LAST SELECTIONS
       ===================================================== */

    $$(
      ".choice"
    ).forEach(button => {

      if (
        previous[
          button.dataset.label
        ] ===
        button.dataset.value
      ) {

        button.classList.add(
          "selected"
        );

      }

    });


    $$(
      "[data-field]"
    ).forEach(input => {

      if (
        previous[
          input.dataset.label
        ]
      ) {

        input.value =
          previous[
            input.dataset.label
          ];

      }

    });


    if (previous.unit) {

      $("#unit").value =
        previous.unit;

    }


    if (previous.brand) {

      $("#brand").value =
        previous.brand;

    }


    /* =====================================================
       CHOICE CLICK
       ===================================================== */

    $$(".choice")
      .forEach(button => {

        button.onclick = () => {

          const parent =
            button.parentElement;

          parent
            ?.querySelectorAll(
              ".choice"
            )
            .forEach(
              other =>
                other.classList.remove(
                  "selected"
                )
            );

          button.classList.add(
            "selected"
          );

        };

      });


    /* =====================================================
       BACK
       ===================================================== */

    $("#backItem").onclick = () => {

      if (
        currentIndex > 0
      ) {

        currentIndex--;

        render();

      } else {

        page = "stage";

        render();

      }

    };


    /* =====================================================
       ADD
       ===================================================== */

    $("#add").onclick =
      addCurrent;


    /* =====================================================
       PRICE
       ===================================================== */

    $("#priceToggle")
      ?.addEventListener(
        "click",
        () => {

          const box =
            $("#priceBox");

          const toggle =
            $("#priceToggle");

          if (!box) return;

          box.hidden = false;

          if (toggle) {
            toggle.hidden = true;
          }

          $("#price")?.focus();

        }
      );


    $("#priceHide")
      ?.addEventListener(
        "click",
        () => {

          const box =
            $("#priceBox");

          const toggle =
            $("#priceToggle");

          if (!box) return;

          box.hidden = true;

          if (toggle) {
            toggle.hidden = false;
          }

        }
      );

  }


  /* =======================================================
     17. SYNC DRAFT
     ======================================================= */

  function syncDraft() {

    draft = {};


    $$(".choice.selected")
      .forEach(element => {

        draft[
          element.dataset.label
        ] =
          element.dataset.value;

      });


    $$("[data-field]")
      .forEach(element => {

        draft[
          element.dataset.label
        ] =
          element.value.trim();

      });


    const unit =
      $("#unit")?.value || "";

    const brand =
      $("#brand")?.value || "";


    if (unit) {

      draft.unit =
        unit;

    }


    if (brand) {

      draft.brand =
        brand;

    }

  }


  /* =======================================================
     18. ADD CURRENT ITEM
     ======================================================= */

  function addCurrent() {

    const quantity =
      $("#qty")
        ?.value
        .trim();


    if (
      C.rules?.quantityRequired !== false &&
      (
        !quantity ||
        Number(quantity) <= 0
      )
    ) {

      $("#qty")
        ?.classList
        .add("error");

      $("#qty")
        ?.focus();

      toast(
        t("required")
      );

      return;

    }


    syncDraft();


    const stage =
      M[currentStage];

    const items =
      stageItems(stage);

    const item =
      items[currentIndex];


    if (!stage || !item) {

      return;

    }


    const name =
      item[0];


    const options = {};


    $$(".choice.selected")
      .forEach(element => {

        options[
          element.dataset.label
        ] =
          element.dataset.value;

      });


    $$("[data-field]")
      .forEach(element => {

        options[
          element.dataset.label
        ] =
          element.value.trim();

      });


    const unit =
      $("#unit")
        ?.value || "";


    const brand =
      $("#brand")
        ?.value || "";


    const price =
      $("#price")
        ?.value
        ?.trim() || "";


    /* ---------- SAVE LAST VALUES ---------- */

    lastValues[
      `${stage[0]}::${name}`
    ] = {

      ...options,

      unit,

      brand

    };


    /* ---------- SAVE ITEM ---------- */

    const data = {

      id: Date.now(),

      stage:
        stage[0],

      stageName:
        stage[1],

      item:
        name,

      qty:
        String(
          quantity || ""
        ),

      unit,

      brand,

      price,

      options,

      createdAt:
        new Date()
          .toISOString()

    };


    const saved =
      readItems();


    saved.push(
      data
    );


    writeItems(
      saved
    );


    toast(
      t("added")
    );


    /* =====================================================
       AUTO NEXT
       ===================================================== */

    if (
      C.navigation?.autoNextAfterAdd !== false &&
      currentIndex <
        items.length - 1
    ) {

      currentIndex++;

      setTimeout(
        () => {

          render();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        },
        220
      );

    }

    else {

      page =
        "stage";

      currentIndex =
        -1;

      setTimeout(
        () => {

          render();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        },
        220
      );

    }

  }


  /* =======================================================
     19. ESTIMATE PAGE
     ======================================================= */

  function estimate() {

    const items =
      readItems();


    return `

      <section class="page">

        <div class="hero compact">

          <h1>
            ${esc(
              t("estimate")
            )}
          </h1>

          <p>
            ${items.length}
            ${esc(
              t("saved")
            )}
          </p>

        </div>


        ${
          items.length

            ? `

              <div class="estimateList">

                ${items
                  .map(
                    (item, index) => `

                      <article
                        data-estimate-index="${index}"
                      >

                        <div>

                          <b>
                            ${esc(
                              tx(
                                item.item
                              )
                            )}
                          </b>

                          <span>

                            ${esc(
                              item.qty
                            )}

                            ${
                              item.unit
                                ? " " +
                                  esc(
                                    tx(
                                      item.unit
                                    )
                                  )
                                : ""
                            }

                            ${
                              item.brand
                                ? " • " +
                                  esc(
                                    tx(
                                      item.brand
                                    )
                                  )
                                : ""
                            }

                          </span>

                        </div>


                        ${
                          item.price !== ""

                            ? `
                              <strong>
                                ₹
                                ${esc(
                                  item.price
                                )}
                              </strong>
                            `

                            : ""
                        }

                      </article>

                    `
                  )
                  .join("")}

              </div>


              <button
                class="danger"
                id="clear"
                type="button"
              >
                ${esc(
                  t("clear")
                )}
              </button>

            `

            : `

              <div class="empty">

                ${esc(
                  t("noItems")
                )}

              </div>

            `
        }

      </section>

    `;

  }


  /* =======================================================
     20. CALCULATOR
     ======================================================= */

  function calculator() {

    return `

      <section class="page">

        <div class="hero compact">

          <h1>
            ${esc(
              t("calculator")
            )}
          </h1>

          <p>
            ${esc(
              t(
                "electricalFormulas"
              )
            )}
          </p>

        </div>


        <div class="calcCard">

          <label>

            ${esc(
              t("power")
            )}

            <input
              id="pw"
              type="number"
              inputmode="decimal"
            >

          </label>


          <label>

            ${esc(
              t("voltage")
            )}

            <input
              id="vo"
              type="number"
              inputmode="decimal"
            >

          </label>


          <button
            class="primary"
            id="calc"
            type="button"
          >

            ${esc(
              t("calculate")
            )}

          </button>


          <div
            id="ans"
            class="answer"
          >

            I = P ÷ V

          </div>

        </div>

      </section>

    `;

  }


  /* =======================================================
     21. SETTINGS
     ======================================================= */

  function settings() {

    const dark =
      (
        localStorage.getItem(
          themeKey
        ) || "dark"
      ) === "dark";


    const enabledViews =
      getViewModes().length;


    return `

      <section class="page">

        <div class="hero compact">

          <h1>
            ${esc(
              t("settings")
            )}
          </h1>

        </div>


        <div class="settingsCard">


          <!-- THEME -->

          <div class="settingRow">

            <span>
              ${esc(
                t("theme")
              )}
            </span>

            <label class="toggle">

              <input
                id="themeToggle"
                type="checkbox"
                ${
                  dark
                    ? "checked"
                    : ""
                }
              >

              <span>
                ${
                  dark
                    ? esc(
                        t("dark")
                      )
                    : esc(
                        t("light")
                      )
                }
              </span>

            </label>

          </div>


          <!-- LANGUAGE -->

          <div class="settingRow">

            <span>
              ${esc(
                t("language")
              )}
            </span>

            <strong>
              ${
                lang === "hi"
                  ? "हिंदी"
                  : "English"
              }
            </strong>

          </div>


          <!-- VIEWS -->

          <div class="settingRow">

            <span>
              ${esc(
                t("materialViews")
              )}
            </span>

            <strong>
              ${enabledViews}
              ${esc(
                t("viewsEnabled")
              )}
            </strong>

          </div>


          <!-- RESET -->

          <button
            class="secondary"
            id="reset"
            type="button"
          >

            ${esc(
              t("reset")
            )}

          </button>


        </div>

      </section>

    `;

  }


  /* =======================================================
     22. TOAST
     ======================================================= */

  function toast(message) {

    const element =
      document.createElement(
        "div"
      );

    element.className =
      "toast";

    element.textContent =
      message;

    document.body.appendChild(
      element
    );


    setTimeout(
      () => {

        element.remove();

      },
      1400
    );

  }


  /* =======================================================
     23. GLOBAL CLICK HANDLER
     ======================================================= */

  document.addEventListener(
    "click",
    event => {

      const target =
        event.target;


      /* ---------- STAGE ---------- */

      const stageButton =
        target.closest(
          "[data-stage]"
        );

      if (
        stageButton &&
        !target.closest(
          "#drawer"
        )
      ) {

        currentStage =
          Number(
            stageButton.dataset.stage
          );

        currentIndex =
          -1;

        page =
          "stage";

        render();

        return;

      }


      /* ---------- CLEAR ESTIMATE ---------- */

      if (
        target.id === "clear"
      ) {

        if (
          confirm(
            t("confirmClear")
          )
        ) {

          localStorage.removeItem(
            storeKey
          );

          render();

        }

        return;

      }


      /* ---------- RESET ---------- */

      if (
        target.id === "reset"
      ) {

        if (
          confirm(
            t("confirmReset")
          )
        ) {

          localStorage.removeItem(
            storeKey
          );

          localStorage.removeItem(
            stateKey
          );

          render();

        }

        return;

      }


      /* ---------- CALCULATOR ---------- */

      if (
        target.id === "calc"
      ) {

        const power =
          Number(
            $("#pw")?.value
          );

        const voltage =
          Number(
            $("#vo")?.value
          );


        if (
          power > 0 &&
          voltage > 0
        ) {

          const current =
            power /
            voltage;


          $("#ans").textContent =
            `${t("current")} = ${current.toFixed(2)} A`;

        }

        else {

          $("#ans").textContent =
            t("calcHint");

        }

        return;

      }


      /* ---------- THEME ---------- */

      if (
        target.id ===
        "themeToggle"
      ) {

        const dark =
          target.checked;


        localStorage.setItem(
          themeKey,
          dark
            ? "dark"
            : "light"
        );


        applyConfig();

        return;

      }

    }
  );


  /* =======================================================
     24. CLOSE VIEW POPUPS
     ======================================================= */

  document.addEventListener(
    "click",
    event => {

      [
        "#viewSelector",
        "#stageViewSelector"
      ].forEach(
        selector => {

          const box =
            document.querySelector(
              selector
            );

          if (!box) return;

          const options =
            box.querySelector(
              ".viewOptions"
            );

          if (
            !options ||
            options.hidden
          ) {
            return;
          }

          if (
            !box.contains(
              event.target
            )
          ) {

            options.hidden =
              true;

          }

        }
      );

    }
  );


  /* =======================================================
     25. ESC KEY
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeDrawer();

        $$(".viewOptions")
          .forEach(
            box =>
              box.hidden = true
          );

      }

    }
  );


  /* =======================================================
     26. SAVE / RESTORE LAST VALUES
     ======================================================= */

  try {

    const saved =
      localStorage.getItem(
        "sandeepEstimateLastValues"
      );

    if (saved) {

      lastValues =
        JSON.parse(
          saved
        ) || {};

    }

  } catch {

    lastValues = {};

  }


  function saveLastValues() {

    try {

      localStorage.setItem(
        "sandeepEstimateLastValues",
        JSON.stringify(
          lastValues
        )
      );

    } catch {}

  }


  /* Save whenever page is hidden */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "hidden"
      ) {

        saveLastValues();

        saveState();

      }

    }
  );


  /* =======================================================
     27. LANGUAGE CHANGE HELPER
     ======================================================= */

  function setLanguage(
    newLanguage
  ) {

    if (
      newLanguage !== "hi" &&
      newLanguage !== "en"
    ) {

      return;

    }


    lang =
      newLanguage;


    localStorage.setItem(
      langKey,
      lang
    );


    render();

  }


  window.setElectroFixLanguage =
    setLanguage;


  /* =======================================================
     28. INITIAL STATE
     ======================================================= */

  loadState();


  /* Safety */

  if (
    ![
      "home",
      "stage",
      "item",
      "estimate",
      "calculator",
      "settings"
    ].includes(page)
  ) {

    page = "home";

  }


  if (
    currentStage < 0 ||
    currentStage >= M.length
  ) {

    if (
      page === "stage" ||
      page === "item"
    ) {

      page = "home";

    }

  }


  /* =======================================================
     29. BOOT
     ======================================================= */

  function boot() {

    applyConfig();

    render();


    /*
      Loader is NOT required.
      If old splash exists, remove it safely
      after actual app render.
    */

    const splash =
      $("#splash");


    if (splash) {

      splash.classList.add(
        "hide"
      );


      setTimeout(
        () => {

          splash.remove();

        },
        350
      );

    }


    window.scrollTo(
      0,
      0
    );

  }


  window.render =
    render;


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      boot
    );

  } else {

    boot();

  }

})();
