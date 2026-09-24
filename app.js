/* =========================================================
   Sandeep ElectroFix - Estimate List
   FINAL app.js
   ---------------------------------------------------------
   Includes:
   • Android / Browser Back navigation
   • Separate Stage View + Material View (10 modes each)
   • Hindi / English language persistence
   • Refresh / reload state persistence
   • Estimate persistence
   • Last entered field/unit/brand persistence
   • Quantity required / other fields optional
   • Explicit Add button + optional auto-next
   • Dark / Light theme
   • Calculator
   • Settings / Reset
   • Loader safely removed after render
   ---------------------------------------------------------
   DO NOT EDIT material.js for these features.
   ========================================================= */

(() => {
  "use strict";

  const C = window.APP_CONFIG || {};
  const M = Array.isArray(window.MATERIALS) ? window.MATERIALS : [];

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const storeKey = C.storageKey || "sandeepEstimateItems";
  const langKey = C.languageKey || "sandeepMaterialLang";
  const viewKey = C.viewKey || "sandeepMaterialView";
  const themeKey = C.themeKey || "sandeepTheme";
  const stateKey = "sandeepEstimateAppState";
  const lastKey = "sandeepEstimateLastValues";
  const stageViewKey = "sandeepStageView";

  const VIEW_MODES = [
    ["grid", "▦"],
    ["list", "☷"],
    ["compact", "▪"],
    ["large", "▣"],
    ["mini", "▫"],
    ["two-column", "▥"],
    ["horizontal", "⇄"],
    ["icon-list", "☰"],
    ["timeline", "◉"],
    ["dense", "▤"]
  ];

  let lang = localStorage.getItem(langKey) || C.defaultLanguage || "hi";
  let page = "home";
  let currentStage = -1;
  let currentIndex = -1;
  let view = localStorage.getItem(viewKey) || "grid";
  let stageView = localStorage.getItem(stageViewKey) || "grid";
  let lastValues = readJson(lastKey, {});
  let editingId = null;
  let restoring = false;
  let toastTimer = null;

  /* =======================================================
     UI TEXT
     ======================================================= */

  const TEXT = {
    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",
      menu: "मेन्यू",
      items: "आइटम",
      material: "सामग्री",
      open: "खोलें",
      back: "वापस",
      next: "अगला",
      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",
      optional: "वैकल्पिक",
      add: "एस्टिमेट में जोड़ें",
      added: "एस्टिमेट में जोड़ दिया गया",
      required: "मात्रा भरना जरूरी है",
      other: "बाकी सभी फ़ील्ड वैकल्पिक हैं",
      price: "कीमत",
      addPrice: "कीमत जोड़ें",
      hidePrice: "कीमत छुपाएँ",
      noItems: "अभी कोई आइटम नहीं जोड़ा गया",
      clear: "एस्टिमेट साफ करें",
      saved: "सेव आइटम",
      dark: "डार्क थीम",
      light: "लाइट थीम",
      language: "भाषा",
      theme: "थीम",
      reset: "सेव डेटा रीसेट करें",
      resetDone: "सेव डेटा रीसेट हो गया",
      grid: "ग्रिड",
      list: "लिस्ट",
      compact: "कॉम्पैक्ट",
      large: "लार्ज",
      mini: "मिनी",
      twoColumn: "2 कॉलम",
      horizontal: "हॉरिजॉन्टल",
      iconList: "आइकन लिस्ट",
      timeline: "टाइमलाइन",
      dense: "डेंस",
      view: "व्यू",
      stageView: "स्टेज व्यू",
      materialView: "मटेरियल व्यू",
      selected: "चुना गया",
      savedState: "पेज सेव है",
      current: "करंट",
      power: "पावर (W)",
      voltage: "वोल्टेज (V)",
      resistance: "रेजिस्टेंस (Ω)",
      calcHint: "जरूरी वैल्यू भरें",
      calculate: "कैलकुलेट करें",
      formula: "फॉर्मूला",
      clearCalculator: "कैलकुलेटर साफ करें",
      confirmReset: "क्या आप सेव एस्टिमेट और ऐप स्टेट रीसेट करना चाहते हैं?",
      firstStage: "यह पहला स्टेज है",
      firstItem: "यह पहला आइटम है",
      lastItem: "यह आखिरी आइटम है",
      savedAfterRefresh: "रिफ्रेश के बाद यही पेज खुलेगा",
      imageHint: "डिटेल खोलने के लिए टैप करें",
      noData: "डेटा उपलब्ध नहीं है",
      welcome: "स्वागत है",
      selectStage: "स्टेज चुनें और एस्टिमेट शुरू करें",
      powerVoltage: "Power और Voltage भरें",
      formulaCurrent: "I = P ÷ V",
      formulaPower: "P = V × I",
      formulaVoltage: "V = P ÷ I",
      formulaResistance: "R = V ÷ I"
    },

    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",
      menu: "Menu",
      items: "Items",
      material: "Material",
      open: "Open",
      back: "Back",
      next: "Next",
      quantity: "Quantity",
      unit: "Unit",
      brand: "Brand",
      optional: "optional",
      add: "Add to Estimate",
      added: "Added to Estimate",
      required: "Quantity is required",
      other: "All other fields are optional",
      price: "Price",
      addPrice: "Add Price",
      hidePrice: "Hide Price",
      noItems: "No items added yet",
      clear: "Clear Estimate",
      saved: "saved items",
      dark: "Dark Theme",
      light: "Light Theme",
      language: "Language",
      theme: "Theme",
      reset: "Reset Saved Data",
      resetDone: "Saved data has been reset",
      grid: "Grid",
      list: "List",
      compact: "Compact",
      large: "Large",
      mini: "Mini",
      twoColumn: "2 Column",
      horizontal: "Horizontal",
      iconList: "Icon List",
      timeline: "Timeline",
      dense: "Dense",
      view: "View",
      stageView: "Stage View",
      materialView: "Material View",
      selected: "Selected",
      savedState: "Page saved",
      current: "Current",
      power: "Power (W)",
      voltage: "Voltage (V)",
      resistance: "Resistance (Ω)",
      calcHint: "Enter the required values",
      calculate: "Calculate",
      formula: "Formula",
      clearCalculator: "Clear Calculator",
      confirmReset: "Reset saved estimate and app state?",
      firstStage: "This is the first stage",
      firstItem: "This is the first item",
      lastItem: "This is the last item",
      savedAfterRefresh: "This page will reopen after refresh",
      imageHint: "Tap to open details",
      noData: "No data available",
      welcome: "Welcome",
      selectStage: "Select a stage and start estimating",
      powerVoltage: "Enter Power and Voltage",
      formulaCurrent: "I = P ÷ V",
      formulaPower: "P = V × I",
      formulaVoltage: "V = P ÷ I",
      formulaResistance: "R = V ÷ I"
    }
  };

  const t = key =>
    (TEXT[lang] || TEXT.en)[key] || key;

  /* =======================================================
     MATERIAL / FIELD TRANSLATION
     Technical values remain English intentionally.
     ======================================================= */

  const MT = {
    "STAGE 1": "स्टेज 1",
    "STAGE 2": "स्टेज 2",
    "STAGE 3": "स्टेज 3",
    "STAGE 4": "स्टेज 4",
    "STAGE 5": "स्टेज 5",

    "Slab Conduit Installation": "स्लैब कन्ड्युट इंस्टॉलेशन",
    "Wall Conduit Installation": "वॉल कन्ड्युट इंस्टॉलेशन",
    "Wiring Installation": "वायरिंग इंस्टॉलेशन",
    "Final Electrical Fittings": "फाइनल इलेक्ट्रिकल फिटिंग्स",
    "False Ceiling Wiring Material": "फॉल्स सीलिंग वायरिंग मटेरियल",

    "Conduit & Box": "कन्ड्युट और बॉक्स",
    "Wiring Material": "वायरिंग सामग्री",
    "Wiring & Conduit": "वायरिंग और कन्ड्युट",
    "Switch & Socket": "स्विच और सॉकेट",

    "Pipe": "पाइप",
    "Bend": "बेंड",
    "Junction Box": "जंक्शन बॉक्स",
    "Fan Box": "फैन बॉक्स",
    "Concealed Light Box": "कन्सील्ड लाइट बॉक्स",

    "Modular Board (Concealed Metal/PVC Box)":
      "मॉड्यूलर बोर्ड (कन्सील्ड मेटल/PVC बॉक्स)",

    "MCB Box (Distribution Board)":
      "MCB बॉक्स (डिस्ट्रीब्यूशन बोर्ड)",

    "Wire": "वायर",
    "Flexible Pipe": "फ्लेक्सिबल पाइप",
    "Electrical Tape": "इलेक्ट्रिकल टेप",
    "Fastener": "फास्टनर",

    "Steel Wire / Spring Wire (Fish Tape)":
      "स्टील वायर / स्प्रिंग वायर (फिश टेप)",

    "Switch Plate": "स्विच प्लेट",
    "Switch Board (Surface Gang Box)":
      "स्विच बोर्ड (सरफेस गैंग बॉक्स)",

    "Switch": "स्विच",
    "Socket": "सॉकेट",
    "Fan Regulator": "फैन रेगुलेटर",
    "2 Way Switch": "2 वे स्विच",
    "Bell Push": "बेल पुश",
    "Neon Indicator": "नियॉन इंडिकेटर",
    "Blank Plate / Dummy Switch":
      "ब्लैंक प्लेट / डमी स्विच",

    "DP Switch (Double Pole Switch)":
      "DP स्विच (डबल पोल)",

    "Mini MCB": "मिनी MCB",
    "SP MCB (Single Pole)": "SP MCB (सिंगल पोल)",
    "DP MCB (Double Pole)": "DP MCB (डबल पोल)",

    "TPN MCB (Three Pole with Neutral)":
      "TPN MCB (थ्री पोल विद न्यूट्रल)",

    "MCB Changeover": "MCB चेंजओवर",
    "DP Isolator": "DP आइसोलेटर",

    "TPN Isolator (3P / 4P)":
      "TPN आइसोलेटर (3P / 4P)",

    "RCCB / RCD": "RCCB / RCD",
    "MCB Box": "MCB बॉक्स",
    "Kit Kat Fuse": "किट कैट फ्यूज",

    "Fan Sheet": "फैन शीट",
    "Round Sheet": "राउंड शीट",
    "Fan Rod": "फैन रॉड",
    "Fan Clamp": "फैन क्लैम्प",

    "Holder": "होल्डर",
    "Ceiling Rose": "सीलिंग रोज़",
    "Chain": "चेन",

    "LED Bulb": "LED बल्ब",
    "LED Tube Light": "LED ट्यूब लाइट",
    "Foot Light": "फुट लाइट",
    "Up Down Light": "अप डाउन लाइट",
    "Panel Light": "पैनल लाइट",
    "Surface Light": "सरफेस लाइट",
    "COB Light": "COB लाइट",
    "COB Spot Light": "COB स्पॉट लाइट",
    "Down Light": "डाउन लाइट",
    "Strip Light": "स्ट्रिप लाइट",
    "Rope Light": "रोप लाइट",
    "LED Profile Channel": "LED प्रोफाइल चैनल",
    "LED Strip Driver (SMPS)":
      "LED स्ट्रिप ड्राइवर (SMPS)",

    "Door Bell": "डोर बेल",
    "Tape (Mounting / Double Sided)":
      "माउंटिंग / डबल साइडेड टेप",

    "Instant Glue": "इंस्टेंट ग्लू",
    "Araldite Glue (Epoxy)": "अराल्डाइट ग्लू (एपॉक्सी)",
    "POP (Plaster of Paris)": "POP (प्लास्टर ऑफ पेरिस)",
    "Putty Blade / Patta": "पुट्टी ब्लेड / पट्टा",

    "Screw": "स्क्रू",
    "Lug (Cable Terminal Lug)": "लग (केबल टर्मिनल लग)",
    "Washer": "वॉशर",
    "Cable Tie / Zip Tie": "केबल टाई / ज़िप टाई",
    "Cable Clip": "केबल क्लिप",
    "Saddle (Pipe Clamp)": "सैडल (पाइप क्लैम्प)",

    "PVC Wall Plug / Gulli / Gitti":
      "PVC वॉल प्लग / गुल्ली / गिट्टी",

    "Tape (Shuttering & Joint Sealing)":
      "टेप (शटरिंग और जॉइंट सीलिंग)",

    "Solvent Cement": "सॉल्वेंट सीमेंट",
    "Neel Powder (Marking Powder)":
      "नील पाउडर (मार्किंग पाउडर)",

    "Binding Wire": "बाइंडिंग वायर",

    "Tape (Masking & Plaster Protection)":
      "टेप (मास्किंग और प्लास्टर प्रोटेक्शन)",

    "Installation Material": "इंस्टॉलेशन सामग्री",
    "Installation & Fastening": "इंस्टॉलेशन और फास्टनिंग",
    "Fan & Ceiling": "फैन और सीलिंग",
    "Lighting": "लाइटिंग",
    "MCB & Protection": "MCB और प्रोटेक्शन",
    "Pulling Material": "पुलिंग सामग्री",
    "Installation & Finishing":
      "इंस्टॉलेशन और फिनिशिंग",

    "Size": "साइज",
    "Conduit Size": "कन्ड्युट साइज",
    "Type": "टाइप",
    "Sub Type": "सब टाइप",
    "Shape / Ways": "शेप / वेज़",
    "Material": "मटेरियल",
    "Material Type": "मटेरियल टाइप",
    "Module": "मॉड्यूल",
    "Phase Selection": "फेज़ सिलेक्शन",
    "Door Type": "डोर टाइप",
    "Depth": "डेप्थ",
    "Ways": "वेज़",
    "Hook Rod": "हुक रॉड",
    "Diameter": "डायमीटर",
    "Pack Size": "पैक साइज",
    "Pack Size (Weight)": "पैक साइज (वजन)",
    "Size (Length)": "साइज (लंबाई)",
    "Size (Width)": "साइज (चौड़ाई)",
    "Size (Width × Length)":
      "साइज (चौड़ाई × लंबाई)",
    "Size (Diameter × Length)":
      "साइज (डायमीटर × लंबाई)",
    "Gauge / Size": "गेज / साइज",
    "Colour": "कलर",
    "Color": "कलर",
    "Amp": "एम्प",
    "Curve": "कर्व",
    "Sensitivity": "सेंसिटिविटी",
    "Door": "डोर",
    "Voltage": "वोल्टेज",
    "Wattage": "वॉटेज",
    "Base": "बेस",
    "Colour Temp": "कलर टेम्परेचर",
    "Mounting": "माउंटिंग",
    "Shape": "शेप",
    "Density": "डेंसिटी",
    "Length": "लंबाई",
    "Supply Voltage": "सप्लाई वोल्टेज",
    "Dimensions (W × D)":
      "डायमेंशन (W × D)",
    "Diffuser": "डिफ्यूज़र",
    "Output Voltage": "आउटपुट वोल्टेज",
    "Beam Angle": "बीम एंगल",
    "Body Finish": "बॉडी फिनिश",
    "Movement": "मूवमेंट",
    "Size / Diameter": "साइज / डायमीटर",
    "Weight": "वजन"
  };

  function tx(value) {
    const raw = String(value ?? "");

    if (lang === "en") {
      return raw;
    }

    return MT[raw] || raw;
  }

  /* =======================================================
     STORAGE HELPERS
     ======================================================= */

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);

      return raw == null
        ? fallback
        : JSON.parse(raw);

    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

    } catch (error) {
      console.warn(
        "Storage write failed:",
        error
      );
    }
  }

  function readItems() {
    const data = readJson(
      storeKey,
      []
    );

    return Array.isArray(data)
      ? data
      : [];
  }

  function writeItems(items) {
    writeJson(
      storeKey,
      items
    );
  }

  function saveLastValues() {
    writeJson(
      lastKey,
      lastValues
    );
  }

  function saveAppState(replace = true) {
    const state = {
      electroFix: true,
      page,
      currentStage,
      currentIndex,
      view,
      stageView,
      lang,
      theme:
        localStorage.getItem(themeKey) ||
        C.theme?.default ||
        "dark",
      savedAt: Date.now()
    };

    writeJson(
      stateKey,
      state
    );

    try {

      if (replace) {
        history.replaceState(
          state,
          "",
          location.href
        );
      } else {
        history.pushState(
          state,
          "",
          location.href
        );
      }

    } catch (error) {
      console.warn(
        "History state error:",
        error
      );
    }
  }

  function loadSavedState() {

    const state =
      readJson(
        stateKey,
        null
      );

    if (
      !state ||
      state.electroFix !== true
    ) {
      return;
    }

    const validPages = [
      "home",
      "stage",
      "item",
      "estimate",
      "calculator",
      "settings"
    ];

    if (
      validPages.includes(
        state.page
      )
    ) {
      page = state.page;
    }

    currentStage =
      Number.isInteger(
        state.currentStage
      )
        ? state.currentStage
        : -1;

    currentIndex =
      Number.isInteger(
        state.currentIndex
      )
        ? state.currentIndex
        : -1;

    const validViews =
      VIEW_MODES.map(
        x => x[0]
      );

    if (
      validViews.includes(
        state.view
      )
    ) {
      view = state.view;
    }

    if (
      validViews.includes(
        state.stageView
      )
    ) {
      stageView =
        state.stageView;
    }

    if (
      state.lang === "hi" ||
      state.lang === "en"
    ) {
      lang = state.lang;
    }

    validateNavigationState();
  }

  function validateNavigationState() {

    if (
      page === "stage" ||
      page === "item"
    ) {

      if (!M[currentStage]) {

        page = "home";
        currentStage = -1;
        currentIndex = -1;

        return;
      }
    }

    if (page === "item") {

      const items =
        stageItems(
          M[currentStage]
        );

      if (!items[currentIndex]) {

        page = "stage";
        currentIndex = -1;
      }
    }
  }

  /* =======================================================
     MASTER DATA HELPERS
     ======================================================= */

  function stageItems(stage) {

    if (!Array.isArray(stage)) {
      return [];
    }

    const direct =
      Array.isArray(stage[3])
        ? stage[3]
        : [];

    const groups =
      Array.isArray(stage[4])
        ? stage[4]
        : [];

    const grouped =
      groups.flatMap(group => {

        if (!Array.isArray(group)) {
          return [];
        }

        return Array.isArray(group[1])
          ? group[1]
          : [];
      });

    return [
      ...direct,
      ...grouped
    ];
  }

  function allItems() {

    return M.flatMap(
      (stage, stageIndex) =>

        stageItems(stage).map(
          (item, itemIndex) => ({
            stage: stage[0],
            stageName: stage[1],
            item,
            stageIndex,
            itemIndex
          })
        )
    );
  }

  function itemParts(item) {

    return [
      item?.[0] || "",

      Array.isArray(item?.[1])
        ? item[1]
        : [],

      Array.isArray(item?.[2])
        ? item[2]
        : [],

      Array.isArray(item?.[3])
        ? item[3]
        : []
    ];
  }

  /* =======================================================
     HTML HELPERS
     ======================================================= */

  function esc(value) {

    return String(value ?? "")
      .replace(
        /[&<>"']/g,
        char => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]
      );
  }

  function viewLabel(mode) {

    const map = {
      grid: "grid",
      list: "list",
      compact: "compact",
      large: "large",
      mini: "mini",
      "two-column": "twoColumn",
      horizontal: "horizontal",
      "icon-list": "iconList",
      timeline: "timeline",
      dense: "dense"
    };

    return t(
      map[mode] || mode
    );
  }

  function viewButton(
    mode,
    current,
    prefix = "material"
  ) {

    const found =
      VIEW_MODES.find(
        x => x[0] === mode
      ) ||
      VIEW_MODES[0];

    const attr =
      prefix === "stage"
        ? "data-stage-view"
        : "data-material-view";

    return `
      <button
        type="button"
        class="${
          prefix === "stage"
            ? "stageViewOption"
            : "viewOption"
        } ${
          current === mode
            ? "active"
            : ""
        }"
        ${attr}="${esc(mode)}"
        aria-label="${esc(
          viewLabel(mode)
        )}"
      >
        <span class="viewOptionIcon">
          ${found[1]}
        </span>

        <span>
          ${esc(
            viewLabel(mode)
          )}
        </span>
      </button>
    `;
  }

  function viewSelector(
    current,
    prefix
  ) {

    const isStage =
      prefix === "stage";

    const title =
      isStage
        ? t("stageView")
        : t("materialView");

    const icon =
      isStage
        ? "▦"
        : "◈";

    const wrapper =
      isStage
        ? "stageViewSelector"
        : "viewSelector";

    const buttonClass =
      isStage
        ? "stageViewBtn"
        : "viewSelectorHead";

    const iconClass =
      isStage
        ? ""
        : "viewSelectorIcon";

    const optionsClass =
      isStage
        ? "stageViewOptions"
        : "viewOptions";

    return `
      <div
        class="${wrapper}"
        data-view-wrapper="${prefix}"
      >

        <button
          type="button"
          class="${buttonClass}"
          data-open-view="${prefix}"
          aria-label="${esc(title)}"
          aria-expanded="false"
        >
          <span class="${iconClass}">
            ${icon}
          </span>

          <i>⌄</i>
        </button>

        <div
          class="${optionsClass}"
          data-view-popup="${prefix}"
          hidden
        >
          ${VIEW_MODES
            .map(mode =>
              viewButton(
                mode[0],
                current,
                prefix
              )
            )
            .join("")}
        </div>

      </div>
    `;
  }

  function applyViewClass(
    element,
    mode
  ) {

    if (!element) {
      return;
    }

    VIEW_MODES.forEach(
      x =>
        element.classList.remove(
          x[0]
        )
    );

    element.classList.add(
      mode
    );

    element.dataset.view =
      mode;
  }

  /* =======================================================
     COMMON DATA HELPERS
     ======================================================= */

  function stageTitle(stage) {

    if (!stage) {
      return t("noData");
    }

    return tx(
      stage[1] ||
      stage[0] ||
      ""
    );
  }

  function materialTitle(item) {

    const parts =
      itemParts(item);

    return tx(
      parts[0]
    );
  }

  function materialImage(item) {

    const parts =
      itemParts(item);

    const possible =
      parts[1];

    if (
      Array.isArray(possible)
    ) {

      for (
        const value of possible
      ) {

        if (
          typeof value ===
            "string" &&
          (
            value.startsWith(
              "http"
            ) ||
            value.includes(
              ".png"
            ) ||
            value.includes(
              ".jpg"
            ) ||
            value.includes(
              ".jpeg"
            ) ||
            value.includes(
              ".webp"
            ) ||
            value.includes(
              ".svg"
            )
          )
        ) {
          return value;
        }
      }
    }

    return "";
  }

  function normalizeField(field) {

    if (
      !Array.isArray(field)
    ) {
      return null;
    }

    return {
      key:
        field[0] ??
        field.name ??
        "",

      label:
        field[1] ??
        field.label ??
        field[0] ??
        "",

      options:
        Array.isArray(field[2])
          ? field[2]
          : [],

      extra:
        field[3] ?? null
    };
  }

  function getFields(item) {

    const parts =
      itemParts(item);

    const raw =
      parts[2];

    if (
      !Array.isArray(raw)
    ) {
      return [];
    }

    return raw
      .map(normalizeField)
      .filter(Boolean);
  }

  function getUnits(item) {

    const parts =
      itemParts(item);

    const raw =
      parts[3];

    if (
      !Array.isArray(raw)
    ) {
      return [];
    }

    return raw;
  }

  function isPipeLike(item) {

    const name =
      materialTitle(item)
        .toLowerCase();

    return (
      name ===
        tx("Pipe").toLowerCase() ||
      name ===
        tx("Bend").toLowerCase() ||
      name ===
        tx("Junction Box").toLowerCase()
    );
  }

  function fieldKey(field) {

    return String(
      field?.key ??
      field?.label ??
      ""
    )
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        "_"
      );
  }

  function findQuantityField(fields) {

    return (
      fields.find(
        f => {

          const k =
            fieldKey(f);

          return (
            k === "quantity" ||
            k === "qty" ||
            k.includes("quantity") ||
            k.includes("qty")
          );
        }
      ) ||
      null
    );
  }

  function findUnitField(fields) {

    return (
      fields.find(
        f => {

          const k =
            fieldKey(f);

          return (
            k === "unit" ||
            k.includes("unit")
          );
        }
      ) ||
      null
    );
  }

  function findBrandField(fields) {

    return (
      fields.find(
        f => {

          const k =
            fieldKey(f);

          return (
            k === "brand" ||
            k.includes("brand")
          );
        }
      ) ||
      null
    );
  }

  /* =======================================================
     LAST-VALUE HELPERS
     ======================================================= */

  function itemMemoryKey(
    stageIndex,
    itemIndex
  ) {

    return (
      `${stageIndex}_${itemIndex}`
    );
  }

  function getItemLastValues(
    stageIndex,
    itemIndex
  ) {

    const key =
      itemMemoryKey(
        stageIndex,
        itemIndex
      );

    const data =
      lastValues[key];

    return (
      data &&
      typeof data === "object"
    )
      ? data
      : {};
  }

  function setItemLastValue(
    stageIndex,
    itemIndex,
    key,
    value
  ) {

    const memoryKey =
      itemMemoryKey(
        stageIndex,
        itemIndex
      );

    if (
      !lastValues[memoryKey] ||
      typeof lastValues[memoryKey] !==
        "object"
    ) {
      lastValues[memoryKey] = {};
    }

    lastValues[memoryKey][key] =
      value;

    saveLastValues();
  }

  function getSavedFieldValue(
    stageIndex,
    itemIndex,
    key
  ) {

    const values =
      getItemLastValues(
        stageIndex,
        itemIndex
      );

    return values[key] ?? "";
  }

  /* =======================================================
     THEME
     ======================================================= */

  function getTheme() {

    return (
      localStorage.getItem(
        themeKey
      ) ||
      C.theme?.default ||
      "dark"
    );
  }

  function applyTheme() {

    const theme =
      getTheme();

    document.documentElement
      .setAttribute(
        "data-theme",
        theme
      );

    document.body?.setAttribute(
      "data-theme",
      theme
    );
  }

  function setTheme(theme) {

    const value =
      theme === "light"
        ? "light"
        : "dark";

    localStorage.setItem(
      themeKey,
      value
    );

    applyTheme();

    saveAppState();

    render();
  }

  /* =======================================================
     LANGUAGE
     ======================================================= */

  function setLanguage(value) {

    lang =
      value === "en"
        ? "en"
        : "hi";

    localStorage.setItem(
      langKey,
      lang
    );

    saveAppState();

    render();
  }

  /* =======================================================
     TOAST
     ======================================================= */

  function toast(
    message,
    duration = 1500
  ) {

    let element =
      $("#electroToast");

    if (!element) {

      element =
        document.createElement(
          "div"
        );

      element.id =
        "electroToast";

      element.className =
        "electroToast";

      document.body.appendChild(
        element
      );
    }

    element.textContent =
      message;

    element.classList.add(
      "show"
    );

    clearTimeout(
      toastTimer
    );

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

  /* =======================================================
     DRAWER
     ======================================================= */

  function drawerElement() {

    return (
      $("#drawer") ||
      $("#sideDrawer") ||
      $(".drawer")
    );
  }

  function setDrawer(open) {

    const drawer =
      drawerElement();

    if (!drawer) {
      return;
    }

    drawer.classList.toggle(
      "open",
      !!open
    );

    drawer.classList.toggle(
      "active",
      !!open
    );

    drawer.setAttribute(
      "aria-hidden",
      open
        ? "false"
        : "true"
    );

    const menuBtn =
      $("#menuBtn");

    if (menuBtn) {

      menuBtn.classList.toggle(
        "active",
        !!open
      );

      menuBtn.setAttribute(
        "aria-expanded",
        open
          ? "true"
          : "false"
      );
    }
  }

  function isDrawerOpen() {

    const drawer =
      drawerElement();

    if (!drawer) {
      return false;
    }

    return (
      drawer.classList.contains(
        "open"
      ) ||
      drawer.classList.contains(
        "active"
      )
    );
  }

  /* =======================================================
     VIEW POPUP
     ======================================================= */

  function closeViewPopups() {

    $$(
      "[data-view-popup]"
    ).forEach(
      popup => {

        popup.hidden = true;

        const wrapper =
          popup.closest(
            "[data-view-wrapper]"
          );

        const button =
          wrapper?.querySelector(
            "[data-open-view]"
          );

        button?.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    );
  }

  function toggleViewPopup(
    prefix
  ) {

    const popup =
      document.querySelector(
        `[data-view-popup="${prefix}"]`
      );

    if (!popup) {
      return;
    }

    const wasHidden =
      popup.hidden;

    closeViewPopups();

    if (wasHidden) {

      popup.hidden =
        false;

      const button =
        document.querySelector(
          `[data-open-view="${prefix}"]`
        );

      button?.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  }

  /* =======================================================
     IMAGE SAFE LOADER
     ======================================================= */

  function imageHtml(
    item,
    className = ""
  ) {

    const src =
      materialImage(item);

    if (!src) {
      return "";
    }

    return `
      <img
        class="${esc(className)}"
        src="${esc(src)}"
        alt="${esc(
          materialTitle(item)
        )}"
        loading="lazy"
        decoding="async"
      >
    `;
  }

  /* =======================================================
     ITEM ID
     ======================================================= */

  function makeEstimateId() {

    return (
      "ef_" +
      Date.now().toString(36) +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }

  /* =======================================================
     ESTIMATE DATA
     ======================================================= */

  function estimateValueFromElement(
    element
  ) {

    if (!element) {
      return "";
    }

    if (
      element.type ===
        "checkbox"
    ) {
      return element.checked
        ? "true"
        : "false";
    }

    return element.value ?? "";
  }

  function collectEditorValues() {

    const editor =
      $("#itemEditor");

    if (!editor) {
      return {};
    }

    const values = {};

    $$(
      "[data-field-key]",
      editor
    ).forEach(
      element => {

        const key =
          element.dataset.fieldKey;

        if (!key) {
          return;
        }

        values[key] =
          estimateValueFromElement(
            element
          );
      }
    );

    const quantity =
      editor.querySelector(
        "[data-quantity]"
      );

    if (quantity) {

      values.quantity =
        quantity.value ?? "";
    }

    const unit =
      editor.querySelector(
        "[data-unit]"
      );

    if (unit) {

      values.unit =
        unit.value ?? "";
    }

    const brand =
      editor.querySelector(
        "[data-brand]"
      );

    if (brand) {

      values.brand =
        brand.value ?? "";
    }

    const price =
      editor.querySelector(
        "[data-price]"
      );

    if (price) {

      values.price =
        price.value ?? "";
    }

    return values;
  }

  function rememberEditorValues() {

    if (
      currentStage < 0 ||
      currentIndex < 0
    ) {
      return;
    }

    const values =
      collectEditorValues();

    if (
      !Object.keys(values).length
    ) {
      return;
    }

    const key =
      itemMemoryKey(
        currentStage,
        currentIndex
      );

    lastValues[key] = {
      ...getItemLastValues(
        currentStage,
        currentIndex
      ),
      ...values
    };

    saveLastValues();
  }

  /* =======================================================
     EDITOR FIELD ORDER
     ======================================================= */

  function orderedFields(
    item
  ) {

    const fields =
      getFields(item);

    if (!isPipeLike(item)) {
      return fields;
    }

    const order = [
      "size",
      "conduit_size",
      "type",
      "sub_type",
      "shape",
      "shape_/_ways",
      "ways",
      "quantity",
      "qty",
      "unit",
      "brand"
    ];

    const result = [];

    order.forEach(
      wanted => {

        const found =
          fields.find(
            field =>
              fieldKey(field) ===
              wanted
          );

        if (
          found &&
          !result.includes(found)
        ) {
          result.push(found);
        }
      }
    );

    fields.forEach(
      field => {

        if (
          !result.includes(field)
        ) {
          result.push(field);
        }
      }
    );

    return result;
  }

  /* =======================================================
     OPTION HTML
     ======================================================= */

  function optionHtml(
    value,
    selected
  ) {

    const raw =
      String(value ?? "");

    return `
      <option
        value="${esc(raw)}"
        ${String(selected ?? "") === raw
          ? "selected"
          : ""}
      >
        ${esc(tx(raw))}
      </option>
    `;
  }

  function optionsHtml(
    options,
    selected,
    includeBlank = true
  ) {

    const list =
      Array.isArray(options)
        ? options
        : [];

    let html =
      includeBlank
        ? `<option value="">—</option>`
        : "";

    html += list
      .map(
        value =>
          optionHtml(
            value,
            selected
          )
      )
      .join("");

    return html;
  }

  /* =======================================================
     FIELD HTML
     ======================================================= */

  function fieldHtml(
    field,
    stageIndex,
    itemIndex,
    saved
  ) {

    const key =
      fieldKey(field);

    const label =
      tx(
        field.label ||
        field.key
      );

    const options =
      Array.isArray(
        field.options
      )
        ? field.options
        : [];

    const savedValue =
      saved[key] ??
      saved[field.key] ??
      "";

    const quantityLike =
      key === "quantity" ||
      key === "qty" ||
      key.includes("quantity") ||
      key.includes("qty");

    const unitLike =
      key === "unit" ||
      key.includes("unit");

    const brandLike =
      key === "brand" ||
      key.includes("brand");

    if (
      quantityLike
    ) {

      const value =
        savedValue === ""
          ? "1"
          : savedValue;

      return `
        <div
          class="fieldGroup quantityField"
          data-field-wrap="${esc(key)}"
        >

          <label>
            ${esc(label)}
          </label>

          <div class="quantityControl">

            <button
              type="button"
              class="qtyBtn"
              data-qty-minus
              aria-label="−"
            >
              −
            </button>

            <input
              type="number"
              min="0"
              step="any"
              inputmode="decimal"
              class="fieldInput"
              data-field-key="${esc(key)}"
              data-quantity
              value="${esc(value)}"
            >

            <button
              type="button"
              class="qtyBtn"
              data-qty-plus
              aria-label="+"
            >
              +
            </button>

          </div>

          <button
            type="button"
            class="fieldClear"
            data-clear-field="${esc(key)}"
            aria-label="Clear"
          >
            ×
          </button>

        </div>
      `;
    }

    if (
      unitLike
    ) {

      const currentUnit =
        savedValue ||
        getItemLastValues(
          stageIndex,
          itemIndex
        ).unit ||
        options[0] ||
        "";

      return `
        <div
          class="fieldGroup"
          data-field-wrap="${esc(key)}"
        >

          <label>
            ${esc(label)}
          </label>

          <select
            class="fieldInput"
            data-field-key="${esc(key)}"
            data-unit
          >
            ${optionsHtml(
              options,
              currentUnit,
              false
            )}
          </select>

          <button
            type="button"
            class="fieldClear"
            data-clear-field="${esc(key)}"
            aria-label="Clear"
          >
            ×
          </button>

        </div>
      `;
    }

    if (
      brandLike
    ) {

      return `
        <div
          class="fieldGroup"
          data-field-wrap="${esc(key)}"
        >

          <label>
            ${esc(label)}
            <small>
              (${esc(t("optional"))})
            </small>
          </label>

          <select
            class="fieldInput"
            data-field-key="${esc(key)}"
            data-brand
          >
            ${optionsHtml(
              options,
              savedValue,
              true
            )}
          </select>

          <button
            type="button"
            class="fieldClear"
            data-clear-field="${esc(key)}"
            aria-label="Clear"
          >
            ×
          </button>

        </div>
      `;
    }

    return `
      <div
        class="fieldGroup"
        data-field-wrap="${esc(key)}"
      >

        <label>
          ${esc(label)}
        </label>

        <select
          class="fieldInput"
          data-field-key="${esc(key)}"
        >
          ${optionsHtml(
            options,
            savedValue,
            true
          )}
        </select>

        <button
          type="button"
          class="fieldClear"
          data-clear-field="${esc(key)}"
          aria-label="Clear"
        >
          ×
        </button>

      </div>
    `;
  }

  /* =======================================================
     PRICE FIELD
     ======================================================= */

  function priceHtml(
    saved
  ) {

    const enabled =
      saved.price !== undefined &&
      saved.price !== "";

    return `
      <div
        class="priceSection ${
          enabled
            ? "priceVisible"
            : ""
        }"
      >

        <button
          type="button"
          class="priceToggle"
          data-price-toggle
        >
          ${
            enabled
              ? t("hidePrice")
              : t("addPrice")
          }
        </button>

        <div
          class="priceWrap"
          ${enabled
            ? ""
            : "hidden"}
        >

          <label>
            ${esc(t("price"))}
          </label>

          <input
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
            class="fieldInput"
            data-price
            value="${esc(
              saved.price || ""
            )}"
          >

          <button
            type="button"
            class="fieldClear"
            data-clear-field="price"
            aria-label="Clear"
          >
            ×
          </button>

        </div>

      </div>
    `;
  }

    /* =======================================================
     HOME / STAGE LIST
     ======================================================= */

  function home() {
    const total = allItems().length;

    return `
      <section class="page homePage">
        <div class="hero">
          <img src="logo.png" class="heroLogo" alt="Sandeep ElectroFix Logo">
          <span>POWERING YOUR TRUST</span>
          <h1>${esc(lang === "hi" ? "मटेरियल एस्टिमेट" : "Material Estimate")}</h1>
          <p>${total} ${esc(t("items"))}</p>
        </div>

        <div class="stageToolbar">
          ${viewSelector(stageView, "stage")}
        </div>

        <div class="stageGrid ${esc(stageView)}">
          ${M.map((stage, index) => {
            const count = stageItems(stage).length;

            return `
              <button
                class="stageCard ${esc(stageView)}"
                data-stage="${index}"
                type="button"
              >
                <span class="stageNo">
                  ${String(index + 1).padStart(2, "0")}
                </span>

                <small>
                  ${esc(tx(stage[0]))}
                </small>

                <b>
                  ${esc(tx(stage[1]))}
                </b>

                <span>
                  ${count} ${esc(t("items"))}
                </span>

                <i>›</i>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderHomeStageBindings() {
    $$('[data-stage]').forEach(button => {
      button.onclick = () => {
        navigateTo(
          "stage",
          Number(button.dataset.stage),
          -1
        );
      };
    });

    bindViewSelectors();
  }

  /* =======================================================
     STAGE PAGE
     ======================================================= */

  function renderStage() {

    const stage = M[currentStage];

    if (!stage) {
      page = "home";
      currentStage = -1;
      currentIndex = -1;
      return render();
    }

    const items = stageItems(stage);
    const main = $("#main");

    if (!main) return;

    main.innerHTML = `
      <section class="page stagePage">

        <button
          class="back"
          id="backStage"
          type="button"
        >
          ← ${esc(t("back"))}
        </button>

        <div class="hero compact">

          <small>
            ${esc(tx(stage[0]))}
          </small>

          <h1>
            ${esc(tx(stage[1]))}
          </h1>

          <p>
            ${items.length} ${esc(t("items"))}
          </p>

        </div>

        <div class="stageTools">

          ${
            C.ui?.viewSwitch !== false
              ? viewSelector(view, "material")
              : ""
          }

        </div>

        <div class="itemGrid ${esc(view)}">

          ${items.map((item, index) => {

            const [name] =
              itemParts(item);

            return `
              <button
                class="itemCard ${esc(view)}"
                data-item-index="${index}"
                type="button"
              >

                ${materialImageHtml(item, false)}

                <b>
                  ${esc(tx(name))}
                </b>

                <span>
                  ${esc(t("open"))}
                </span>

              </button>
            `;

          }).join("")}

        </div>

      </section>
    `;

    $("#backStage")
      ?.addEventListener(
        "click",
        appBack
      );

    $$(".itemCard").forEach(button => {

      button.onclick = () => {

        navigateTo(
          "item",
          currentStage,
          Number(
            button.dataset.itemIndex
          )
        );

      };

    });

    bindViewSelectors();
  }

  /* =======================================================
     VIEW SELECTORS
     ======================================================= */

  function bindViewSelectors() {

    $$('[data-open-view]').forEach(button => {

      button.onclick = event => {

        event.stopPropagation();

        const name =
          button.dataset.openView;

        const popup =
          $(
            `[data-view-popup="${name}"]`
          );

        if (!popup) return;

        $$('[data-view-popup]')
          .forEach(other => {

            if (other !== popup) {

              other.hidden = true;

              const otherButton =
                document.querySelector(
                  `[data-open-view="${other.dataset.viewPopup}"]`
                );

              if (otherButton) {

                otherButton.setAttribute(
                  "aria-expanded",
                  "false"
                );

              }

            }

          });

        popup.hidden =
          !popup.hidden;

        button.setAttribute(
          "aria-expanded",
          popup.hidden
            ? "false"
            : "true"
        );

      };

    });

    $$('[data-material-view]')
      .forEach(button => {

        button.onclick = event => {

          event.stopPropagation();

          const selected =
            button.dataset.materialView;

          if (
            !VIEW_MODES.some(
              x => x[0] === selected
            )
          ) {
            return;
          }

          view = selected;

          localStorage.setItem(
            viewKey,
            view
          );

          saveAppState(true);

          renderStage();

        };

      });

    $$('[data-stage-view]')
      .forEach(button => {

        button.onclick = event => {

          event.stopPropagation();

          const selected =
            button.dataset.stageView;

          if (
            !VIEW_MODES.some(
              x => x[0] === selected
            )
          ) {
            return;
          }

          stageView = selected;

          localStorage.setItem(
            stageViewKey,
            stageView
          );

          saveAppState(true);

          render();

        };

      });

  }

  /* =======================================================
     ITEM FORM
     ======================================================= */

  function materialImageHtml(
    item,
    big = false
  ) {

    const image =
      item?.image ||
      item?.img ||
      item?.[5] ||
      "";

    if (!image) {

      return `
        <div
          class="itemImage${big ? " big" : ""}"
          aria-hidden="true"
        ></div>
      `;

    }

    return `
      <img
        class="itemImage${big ? " big" : ""}"
        src="${esc(image)}"
        alt=""
        loading="lazy"
      >
    `;

  }

  function fieldHtml(
    field,
    index,
    previous
  ) {

    const label =
      String(
        field?.[0] || ""
      );

    const options =
      Array.isArray(field?.[1])
        ? field[1]
        : [];

    const previousValue =
      previous[label] || "";

    if (
      options.length === 1 &&
      /^User Input/i.test(
        String(options[0])
      )
    ) {

      return `
        <label class="field">

          <span>
            ${esc(tx(label))}
            <em>
              (${esc(t("optional"))})
            </em>
          </span>

          <input
            data-field="${index}"
            data-label="${esc(label)}"
            value="${esc(previousValue)}"
            placeholder="${esc(options[0])}"
          >

          <button
            class="fieldClear"
            type="button"
            data-clear-field="${index}"
            aria-label="Clear"
          >
            ×
          </button>

        </label>
      `;

    }

    return `
      <div class="field">

        <span>
          ${esc(tx(label))}
          <em>
            (${esc(t("optional"))})
          </em>
        </span>

        <div class="choices">

          ${options.map(option => `

            <button
              type="button"
              class="choice ${
                previousValue === option
                  ? "selected"
                  : ""
              }"
              data-label="${esc(label)}"
              data-value="${esc(option)}"
            >
              ${esc(option)}
            </button>

          `).join("")}

        </div>

      </div>
    `;

  }

  /* =======================================================
     RENDER ITEM
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
      currentIndex = -1;

      return render();

    }

    const [
      name,
      fields,
      units,
      brands
    ] = itemParts(item);

    const key =
      `${stage[0]}::${name}`;

    const previous =
      lastValues[key] || {};

    const main =
      $("#main");

    if (!main) return;

    main.innerHTML = `

      <section class="page itemPage">

        <button
          class="back"
          id="backItem"
          type="button"
        >
          ← ${esc(t("back"))}
        </button>

        <div class="itemHead">

          ${materialImageHtml(item, true)}

          <div>

            <small>
              ${esc(tx(stage[0]))}
            </small>

            <h1>
              ${esc(tx(name))}
            </h1>

            <span>
              ${currentIndex + 1}
              /
              ${items.length}
            </span>

          </div>

        </div>

        <div class="formCard">

          ${fields.map(
            (field, index) =>
              fieldHtml(
                field,
                index,
                previous
              )
          ).join("")}

          <label
            class="field requiredField"
          >

            <span>
              ${esc(t("quantity"))} *
            </span>

            <input
              id="qty"
              type="number"
              min="0.01"
              step="any"
              inputmode="decimal"
              value="${esc(previous.qty || "")}"
              placeholder="${esc(t("quantity"))}"
            >

            <button
              class="fieldClear"
              type="button"
              data-clear-id="qty"
              aria-label="Clear"
            >
              ×
            </button>

          </label>

          <label class="field">

            <span>
              ${esc(t("unit"))}
              <em>
                (${esc(t("optional"))})
              </em>
            </span>

            <select id="unit">

              <option value="">
                — ${esc(t("optional"))} —
              </option>

              ${units.map(
                unit => `
                  <option
                    value="${esc(unit)}"
                  >
                    ${esc(unit)}
                  </option>
                `
              ).join("")}

            </select>

          </label>

          ${
            C.ui?.price !== false
              ? `
                <div class="priceWrap">

                  <button
                    id="priceToggle"
                    class="priceToggle"
                    type="button"
                  >
                    ＋ ${esc(t("addPrice"))}
                  </button>

                  <div
                    id="priceBox"
                    class="priceBox"
                    hidden
                  >

                    <label class="field">

                      <span>
                        ${esc(t("price"))}
                        (${esc(t("optional"))})
                      </span>

                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        inputmode="decimal"
                        value="${esc(previous.price || "")}"
                        placeholder="0.00"
                      >

                      <button
                        class="fieldClear"
                        type="button"
                        data-clear-id="price"
                        aria-label="Clear"
                      >
                        ×
                      </button>

                    </label>

                    <button
                      id="priceHide"
                      class="miniBtn"
                      type="button"
                    >
                      ${esc(t("hidePrice"))}
                    </button>

                  </div>

                </div>
              `
              : ""
          }

          <label class="field">

            <span>
              ${esc(t("brand"))}
              <em>
                (${esc(t("optional"))})
              </em>
            </span>

            <select id="brand">

              <option value="">
                — ${esc(t("optional"))} —
              </option>

              ${brands.map(
                brand => `
                  <option
                    value="${esc(brand)}"
                  >
                    ${esc(brand)}
                  </option>
                `
              ).join("")}

            </select>

          </label>

          <button
            id="add"
            class="primary"
            type="button"
          >
            ✓ ${esc(t("add"))}
          </button>

          <p class="hint">
            ${esc(t("required"))}.
            ${esc(t("other"))}.
          </p>

        </div>

      </section>
    `;

    // Unit and brand carry forward.
    // Quantity intentionally starts empty for a new item.

    if (previous.unit) {
      $("#unit").value =
        previous.unit;
    }

    if (previous.brand) {
      $("#brand").value =
        previous.brand;
    }

    const priceBox =
      $("#priceBox");

    const priceToggle =
      $("#priceToggle");

    if (
      previous.price &&
      priceBox &&
      priceToggle
    ) {

      priceBox.hidden = false;
      priceToggle.hidden = true;

    }

    $$(".choice").forEach(
      choice => {

        choice.onclick = () => {

          choice.parentElement
            .querySelectorAll(
              ".choice"
            )
            .forEach(
              x =>
                x.classList.remove(
                  "selected"
                )
            );

          choice.classList.add(
            "selected"
          );

        };

      }
    );

    $$("[data-clear-field]")
      .forEach(button => {

        button.onclick = () => {

          const input =
            button.parentElement
              .querySelector(
                `[data-field="${button.dataset.clearField}"]`
              );

          if (input) {

            input.value = "";
            input.focus();

          }

        };

      });

    $$("[data-clear-id]")
      .forEach(button => {

        button.onclick = () => {

          const input =
            document.getElementById(
              button.dataset.clearId
            );

          if (input) {

            input.value = "";
            input.focus();

          }

        };

      });

    $("#backItem")
      ?.addEventListener(
        "click",
        appBack
      );

    $("#add")
      ?.addEventListener(
        "click",
        addCurrent
      );

    $("#priceToggle")
      ?.addEventListener(
        "click",
        () => {

          if (
            !priceBox ||
            !priceToggle
          ) {
            return;
          }

          priceBox.hidden =
            false;

          priceToggle.hidden =
            true;

          $("#price")?.focus();

        }
      );

    $("#priceHide")
      ?.addEventListener(
        "click",
        () => {

          if (
            !priceBox ||
            !priceToggle
          ) {
            return;
          }

          priceBox.hidden =
            true;

          priceToggle.hidden =
            false;

        }
      );

  }


   /* =======================================================
     ESTIMATE DATA COLLECTION
     ======================================================= */

  function collectOptions() {
    const options = {};

    $$(".choice.selected").forEach(choice => {
      options[choice.dataset.label] =
        choice.dataset.value;
    });

    $$("[data-field]").forEach(input => {
      options[input.dataset.label] =
        input.value.trim();
    });

    return options;
  }

  function addCurrent() {
    const qtyInput = $("#qty");
    const qty =
      qtyInput?.value.trim() || "";

    if (
      C.rules?.quantityRequired !== false &&
      (!qty || Number(qty) <= 0)
    ) {
      qtyInput?.classList.add("error");
      qtyInput?.focus();
      toast(t("required"));
      return;
    }

    qtyInput?.classList.remove("error");

    const stage = M[currentStage];
    const item =
      stageItems(stage)[currentIndex];

    if (!stage || !item) return;

    const [name] =
      itemParts(item);

    const options =
      collectOptions();

    const unit =
      $("#unit")?.value || "";

    const brand =
      $("#brand")?.value || "";

    const price =
      $("#price")?.value.trim() || "";

    const key =
      `${stage[0]}::${name}`;

    /*
      Save current values so they can be restored
      when this material is opened again.
    */
    lastValues[key] = {
      ...options,
      qty,
      unit,
      brand,
      price
    };

    saveLastValues();

    const saved =
      readItems();

    const record = {
      id:
        editingId ||
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      stage:
        stage[0],

      stageName:
        stage[1],

      item:
        name,

      qty:
        String(qty),

      unit,

      brand,

      price,

      options,

      createdAt:
        editingId
          ? (
              saved.find(
                x =>
                  x.id === editingId
              )?.createdAt ||
              new Date().toISOString()
            )
          : new Date().toISOString()
    };

    /*
      EDIT existing estimate
    */
    if (editingId) {

      const index =
        saved.findIndex(
          x =>
            x.id === editingId
        );

      if (index >= 0) {
        saved[index] =
          record;
      } else {
        saved.push(record);
      }

      editingId = null;

    } else {

      /*
        ADD new estimate
      */
      saved.push(record);
    }

    writeItems(saved);

    toast(
      t("added")
    );

    /*
      After Add:
      automatically open next material,
      but NEVER automatically add it.
    */
    if (
      C.navigation?.autoNextAfterAdd !== false &&
      currentIndex <
        stageItems(stage).length - 1
    ) {

      currentIndex++;

      saveAppState(false);

      setTimeout(() => {

        render();

        window.scrollTo({
          top: 0,
          behavior: "auto"
        });

      }, 220);

    } else {

      page = "stage";
      currentIndex = -1;

      saveAppState(false);

      setTimeout(() => {

        render();

        window.scrollTo({
          top: 0,
          behavior: "auto"
        });

      }, 220);
    }
  }

  /* =======================================================
     ESTIMATE PAGE
     ======================================================= */

  function estimate() {

    const saved =
      readItems();

    return `
      <section class="page estimatePage">

        <div class="hero compact">

          <h1>
            ${esc(t("estimate"))}
          </h1>

          <p>
            ${saved.length}
            ${esc(t("saved"))}
          </p>

        </div>

        ${
          saved.length
            ? `

              <div class="estimateList">

                ${saved
                  .map(
                    (entry, index) => `

                    <article
                      class="estimateItem"
                      data-estimate-index="${index}"
                    >

                      <div class="estimateTop">

                        <div>

                          <small>
                            ${esc(
                              tx(
                                entry.stageName ||
                                entry.stage ||
                                ""
                              )
                            )}
                          </small>

                          <b>
                            ${esc(
                              tx(
                                entry.item ||
                                ""
                              )
                            )}
                          </b>

                          <span>
                            ${esc(
                              entry.qty ||
                              ""
                            )}

                            ${
                              entry.unit
                                ? ` ${esc(
                                    entry.unit
                                  )}`
                                : ""
                            }

                            ${
                              entry.brand
                                ? ` • ${esc(
                                    entry.brand
                                  )}`
                                : ""
                            }
                          </span>

                          ${renderOptionSummary(
                            entry.options
                          )}

                        </div>

                        ${
                          entry.price !== "" &&
                          entry.price != null
                            ? `
                              <strong>
                                ₹ ${esc(
                                  entry.price
                                )}
                              </strong>
                            `
                            : ""
                        }

                      </div>

                      <div class="estimateActions">

                        <button
                          class="secondary"
                          type="button"
                          data-edit-estimate="${index}"
                          aria-label="Edit"
                        >
                          ✎
                        </button>

                        <button
                          class="danger"
                          type="button"
                          data-delete-estimate="${index}"
                          aria-label="Delete"
                        >
                          ×
                        </button>

                      </div>

                    </article>
                  `
                  )
                  .join("")}

              </div>

              <button
                class="danger"
                id="clearEstimate"
                type="button"
              >
                ${esc(t("clear"))}
              </button>

            `
            : `
              <div class="empty">
                ${esc(t("noItems"))}
              </div>
            `
        }

      </section>
    `;
  }

  function renderOptionSummary(
    options
  ) {

    if (
      !options ||
      typeof options !==
        "object"
    ) {
      return "";
    }

    const parts =
      Object.entries(options)
        .filter(
          ([, value]) =>
            String(
              value || ""
            ).trim()
        )
        .map(
          ([label, value]) =>
            `${tx(label)}: ${value}`
        );

    return parts.length
      ? `
        <small>
          ${esc(
            parts.join(" • ")
          )}
        </small>
      `
      : "";
  }

  /* =======================================================
     CALCULATOR
     ======================================================= */

  function calculator() {

    return `
      <section
        class="page calculatorPage"
      >

        <div class="hero compact">

          <h1>
            ${esc(t("calculator"))}
          </h1>

          <p>
            P = V × I •
            V = I × R •
            I = P ÷ V •
            R = V ÷ I
          </p>

        </div>

        <div class="formCard">

          <div class="calcGrid">

            <label class="field">

              <span>
                ${esc(t("power"))}
              </span>

              <input
                id="calcP"
                type="number"
                inputmode="decimal"
                step="any"
              >

            </label>

            <label class="field">

              <span>
                ${esc(t("voltage"))}
              </span>

              <input
                id="calcV"
                type="number"
                inputmode="decimal"
                step="any"
              >

            </label>

            <label class="field">

              <span>
                ${
                  esc(
                    lang === "hi"
                      ? "करंट (A)"
                      : "Current (A)"
                  )
                }
              </span>

              <input
                id="calcI"
                type="number"
                inputmode="decimal"
                step="any"
              >

            </label>

            <label class="field">

              <span>
                ${esc(
                  t("resistance")
                )}
              </span>

              <input
                id="calcR"
                type="number"
                inputmode="decimal"
                step="any"
              >

            </label>

          </div>

          <button
            class="primary"
            id="calculateBtn"
            type="button"
          >
            ${esc(t("calculate"))}
          </button>

          <button
            class="secondary"
            id="clearCalcBtn"
            type="button"
          >
            ${esc(
              t("clearCalculator")
            )}
          </button>

          <div
            id="calcAnswer"
            class="calcResult"
          >
            ${esc(
              t("calcHint")
            )}
          </div>

          <div class="formula">
            P = V × I
            &nbsp; | &nbsp;
            V = I × R
            &nbsp; | &nbsp;
            I = P ÷ V
            &nbsp; | &nbsp;
            R = V ÷ I
          </div>

        </div>

      </section>
    `;
  }

  function calculateElectrical() {

    const p =
      Number(
        $("#calcP")?.value
      );

    const v =
      Number(
        $("#calcV")?.value
      );

    const i =
      Number(
        $("#calcI")?.value
      );

    const r =
      Number(
        $("#calcR")?.value
      );

    const answer =
      $("#calcAnswer");

    if (!answer) return;

    if (
      p > 0 &&
      v > 0 &&
      !i
    ) {

      answer.textContent =
        `I = P ÷ V = ${(p / v).toFixed(2)} A`;

      return;
    }

    if (
      v > 0 &&
      i > 0 &&
      !p &&
      !r
    ) {

      answer.textContent =
        `P = V × I = ${(v * i).toFixed(2)} W  |  R = V ÷ I = ${(v / i).toFixed(2)} Ω`;

      return;
    }

    if (
      p > 0 &&
      i > 0 &&
      !v
    ) {

      answer.textContent =
        `V = P ÷ I = ${(p / i).toFixed(2)} V`;

      return;
    }

    if (
      v > 0 &&
      r > 0 &&
      !i
    ) {

      answer.textContent =
        `I = V ÷ R = ${(v / r).toFixed(2)} A`;

      return;
    }

    if (
      i > 0 &&
      r > 0 &&
      !v
    ) {

      answer.textContent =
        `V = I × R = ${(i * r).toFixed(2)} V`;

      return;
    }

    answer.textContent =
      t("calcHint");
  }

  function clearCalculator() {

    [
      "#calcP",
      "#calcV",
      "#calcI",
      "#calcR"
    ].forEach(id => {

      const input =
        $(id);

      if (input) {
        input.value = "";
      }

    });

    const answer =
      $("#calcAnswer");

    if (answer) {
      answer.textContent =
        t("calcHint");
    }
  }

  /* =======================================================
     SETTINGS
     ======================================================= */

  function settings() {

    const theme =
      localStorage.getItem(
        themeKey
      ) ||
      C.theme?.default ||
      "dark";

    const isDark =
      theme === "dark";

    return `
      <section
        class="page settingsPage"
      >

        <div class="hero compact">

          <h1>
            ${esc(
              t("settings")
            )}
          </h1>

        </div>

        <div class="settingsList">

          <div class="settingRow">

            <span>
              ${esc(
                t("language")
              )}
            </span>

            <button
              id="settingsLang"
              class="secondary"
              type="button"
            >
              ${
                lang === "hi"
                  ? "हिंदी"
                  : "English"
              }
            </button>

          </div>

          <div class="settingRow">

            <span>
              ${esc(
                t("theme")
              )}
            </span>

            <button
              id="themeToggle"
              class="secondary"
              type="button"
            >
              ${
                isDark
                  ? esc(t("dark"))
                  : esc(t("light"))
              }
            </button>

          </div>

          <div class="settingRow">

            <span>
              ${esc(
                t("materialView")
              )}
            </span>

            <button
              id="settingsMaterialView"
              class="secondary"
              type="button"
            >
              ${esc(
                viewLabel(view)
              )}
            </button>

          </div>

          <div class="settingRow">

            <span>
              ${esc(
                t("stageView")
              )}
            </span>

            <button
              id="settingsStageView"
              class="secondary"
              type="button"
            >
              ${esc(
                viewLabel(stageView)
              )}
            </button>

          </div>

          <button
            class="danger"
            id="resetApp"
            type="button"
          >
            ${esc(t("reset"))}
          </button>

          <p class="hint">
            ${esc(
              t("savedAfterRefresh")
            )}
          </p>

        </div>

      </section>
    `;
  }

  /* =======================================================
     FINAL RENDER
     ======================================================= */

  function render() {

    applyConfig();

    const main =
      $("#main");

    if (!main) return;

    validateNavigationState();

    if (
      page === "home"
    ) {

      main.innerHTML =
        home();

      renderHomeStageBindings();

    } else if (
      page === "stage"
    ) {

      renderStage();

    } else if (
      page === "item"
    ) {

      renderItem();

    } else if (
      page === "estimate"
    ) {

      main.innerHTML =
        C.ui?.estimate === false
          ? home()
          : estimate();

    } else if (
      page === "calculator"
    ) {

      main.innerHTML =
        C.ui?.calculator === false
          ? home()
          : calculator();

    } else if (
      page === "settings"
    ) {

      main.innerHTML =
        C.ui?.settings === false
          ? home()
          : settings();

    } else {

      page = "home";

      main.innerHTML =
        home();

      renderHomeStageBindings();
    }

    bindCommon();

    /* -----------------------------------------------
       Clear Estimate
       ----------------------------------------------- */

    $("#clearEstimate")
      ?.addEventListener(
        "click",
        () => {

          if (
            !confirm(
              t("confirmReset")
            )
          ) {
            return;
          }

          localStorage.removeItem(
            storeKey
          );

          toast(
            t("resetDone")
          );

          render();
        }
      );

    /* -----------------------------------------------
       Calculator
       ----------------------------------------------- */

    $("#calculateBtn")
      ?.addEventListener(
        "click",
        calculateElectrical
      );

    $("#clearCalcBtn")
      ?.addEventListener(
        "click",
        clearCalculator
      );

    /* -----------------------------------------------
       Settings Language
       ----------------------------------------------- */

    $("#settingsLang")
      ?.addEventListener(
        "click",
        () => {

          lang =
            lang === "hi"
              ? "en"
              : "hi";

          localStorage.setItem(
            langKey,
            lang
          );

          saveAppState(true);

          render();
        }
      );

    /* -----------------------------------------------
       Theme
       ----------------------------------------------- */

    $("#themeToggle")
      ?.addEventListener(
        "click",
        () => {

          const current =
            localStorage.getItem(
              themeKey
            ) ||
            C.theme?.default ||
            "dark";

          localStorage.setItem(
            themeKey,
            current === "dark"
              ? "light"
              : "dark"
          );

          saveAppState(true);

          render();
        }
      );

    /* -----------------------------------------------
       Material View
       ----------------------------------------------- */

    $("#settingsMaterialView")
      ?.addEventListener(
        "click",
        () => {

          const index =
            VIEW_MODES.findIndex(
              x =>
                x[0] === view
            );

          view =
            VIEW_MODES[
              (index + 1) %
              VIEW_MODES.length
            ][0];

          localStorage.setItem(
            viewKey,
            view
          );

          saveAppState(true);

          render();
        }
      );

    /* -----------------------------------------------
       Stage View
       ----------------------------------------------- */

    $("#settingsStageView")
      ?.addEventListener(
        "click",
        () => {

          const index =
            VIEW_MODES.findIndex(
              x =>
                x[0] === stageView
            );

          stageView =
            VIEW_MODES[
              (index + 1) %
              VIEW_MODES.length
            ][0];

          localStorage.setItem(
            stageViewKey,
            stageView
          );

          saveAppState(true);

          render();
        }
      );

    /* -----------------------------------------------
       Edit Estimate
       ----------------------------------------------- */

    $$(
      "[data-edit-estimate]"
    ).forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset
                  .editEstimate
              );

            const entry =
              readItems()[index];

            if (!entry) return;

            const match =
              allItems().find(
                x =>
                  String(x.stage) ===
                    String(entry.stage) &&
                  String(
                    x.item?.[0] || ""
                  ) ===
                    String(
                      entry.item
                    )
              );

            if (!match) return;

            editingId =
              entry.id;

            navigateTo(
              "item",
              match.stageIndex,
              match.itemIndex
            );
          }
        );

      }
    );

    /* -----------------------------------------------
       Delete Estimate
       ----------------------------------------------- */

    $$(
      "[data-delete-estimate]"
    ).forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset
                  .deleteEstimate
              );

            const saved =
              readItems();

            if (!saved[index]) {
              return;
            }

            saved.splice(
              index,
              1
            );

            writeItems(
              saved
            );

            toast(
              t("resetDone")
            );

            render();
          }
        );

      }
    );

    /* -----------------------------------------------
       Full App Reset
       ----------------------------------------------- */

    $("#resetApp")
      ?.addEventListener(
        "click",
        () => {

          if (
            !confirm(
              t("confirmReset")
            )
          ) {
            return;
          }

          localStorage.removeItem(
            storeKey
          );

          localStorage.removeItem(
            stateKey
          );

          localStorage.removeItem(
            lastKey
          );

          toast(
            t("resetDone")
          );

          page = "home";
          currentStage = -1;
          currentIndex = -1;

          view =
            localStorage.getItem(
              viewKey
            ) ||
            "grid";

          stageView =
            localStorage.getItem(
              stageViewKey
            ) ||
            "grid";

          saveAppState(true);

          setTimeout(
            render,
            100
          );
        }
      );

    updateActiveNav();
  }

  function updateActiveNav() {

    $$(
      "[data-page]"
    ).forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.page ===
            page
        );

      }
    );
  }

  /* =======================================================
     OUTSIDE CLICK
     ======================================================= */

  document.addEventListener(
    "click",
    event => {

      const target =
        event.target;

      if (
        target.closest(
          ".viewSelector"
        ) ||
        target.closest(
          ".stageViewSelector"
        )
      ) {
        return;
      }

      $$(
        "[data-view-popup]"
      ).forEach(
        popup => {

          popup.hidden =
            true;

          const button =
            document.querySelector(
              `[data-open-view="${popup.dataset.viewPopup}"]`
            );

          if (button) {

            button.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        }
      );
    }
  );

  /* =======================================================
     ESC KEY
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      const openPopup =
        $(
          "[data-view-popup]:not([hidden])"
        );

      if (openPopup) {

        openPopup.hidden =
          true;

        return;
      }

      if (
        $("#drawer")
          ?.classList
          .contains("open")
      ) {

        closeDrawer();

        return;
      }
    }
  );

  /* =======================================================
     BROWSER / ANDROID BACK
     ======================================================= */

  window.addEventListener(
    "popstate",
    handlePopState
  );

  /* =======================================================
     SAVE BEFORE REFRESH
     ======================================================= */

  window.addEventListener(
    "beforeunload",
    () => {

      saveLastValues();

      writeJson(
        stateKey,
        {
          electroFix: true,
          page,
          currentStage,
          currentIndex,
          view,
          stageView,
          lang,
          theme:
            localStorage.getItem(
              themeKey
            ) ||
            C.theme?.default ||
            "dark",
          savedAt:
            Date.now()
        }
      );
    }
  );

  /* =======================================================
     SAVE WHEN APP GOES BACKGROUND
     ======================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "hidden"
      ) {

        saveLastValues();

        writeJson(
          stateKey,
          {
            electroFix: true,
            page,
            currentStage,
            currentIndex,
            view,
            stageView,
            lang,
            theme:
              localStorage.getItem(
                themeKey
              ) ||
              C.theme?.default ||
              "dark",
            savedAt:
              Date.now()
          }
        );
      }
    }
  );

  /* =======================================================
     BOOT
     ======================================================= */

  function boot() {

    loadSavedState();

    applyConfig();

    /*
      Create the first SPA history state.
    */
    try {

      const existing =
        history.state;

      if (
        !existing?.electroFix
      ) {

        const state = {
          electroFix: true,
          root: true,
          page,
          currentStage,
          currentIndex,
          view,
          stageView,
          lang
        };

        writeJson(
          stateKey,
          state
        );

        history.replaceState(
          state,
          "",
          location.href
        );

        history.pushState(
          {
            ...state,
            root: false
          },
          "",
          location.href
        );

      } else {

        history.replaceState(
          existing,
          "",
          location.href
        );
      }

    } catch (_) {}

    render();

    /*
      Loader/splash is not required.
      If old HTML still contains it,
      remove it immediately after render.
    */
    const splash =
      $("#splash");

    if (splash) {

      splash.classList.add(
        "hide"
      );

      setTimeout(
        () =>
          splash.remove(),
        120
      );
    }

    window.scrollTo(
      0,
      0
    );
  }

  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.ElectroFixApp = {

    render,

    navigateTo,

    appBack,

    saveAppState,

    setLanguage(language) {

      if (
        language !== "hi" &&
        language !== "en"
      ) {
        return;
      }

      lang =
        language;

      localStorage.setItem(
        langKey,
        lang
      );

      saveAppState(true);

      render();
    }
  };

  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      boot,
      { once: true }
    );

  } else {

    boot();

  }

})();
