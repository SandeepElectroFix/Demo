/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   Works with:
   index.html
   style.css
   config.js
   material.js

   MASTER DATA:
   window.MATERIALS

   FLOW:
   HOME
      ↓
   STAGE
      ↓
   SECTION LIST
      ↓
   MATERIAL LIST
      ↓
   EDITOR

   IMPORTANT:
   material.js is NEVER modified.
   ========================================================= */

"use strict";

(function () {

  /* =======================================================
     CONFIG
     ======================================================= */

  const STORAGE = {
    lang: "sandeepMaterialLang",
    theme: "sandeepTheme",
    items: "sandeepEstimateItems",
    view: "sandeepMaterialView",
    route: "sandeepEstimateRoute",
    draft: "sandeepEstimateDraft",
    lastUnit: "sandeepLastUnit"
  };

  const EF = {

    lang: localStorage.getItem(STORAGE.lang) || "hi",

    theme: localStorage.getItem(STORAGE.theme) || "dark",

    view: localStorage.getItem(STORAGE.view) || "grid",

    route: "home",

    stageIndex: null,

    sectionIndex: null,

    materialIndex: null,

    editIndex: null,

    searchText: "",

    filters: {
      stage: "",
      type: "",
      size: "",
      brand: ""
    },

    estimateItems: [],

    draft: {},

    drawerOpen: false,

    filterOpen: false,

    viewOpen: false,

    calculator: "ohm",

    historyReady: false

  };


  /* =======================================================
     DOM HELPERS
     ======================================================= */

  const $ = (id) => document.getElementById(id);

  const qs = (selector, root = document) =>
    root.querySelector(selector);

  const qsa = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));


  /* =======================================================
     SAFE STORAGE
     ======================================================= */

  function loadStorage() {

    try {

      const savedItems =
        JSON.parse(
          localStorage.getItem(STORAGE.items) || "[]"
        );

      EF.estimateItems =
        Array.isArray(savedItems)
          ? savedItems
          : [];

    } catch (e) {

      EF.estimateItems = [];

    }

    try {

      const savedDraft =
        JSON.parse(
          localStorage.getItem(STORAGE.draft) || "{}"
        );

      EF.draft =
        savedDraft &&
        typeof savedDraft === "object"
          ? savedDraft
          : {};

    } catch (e) {

      EF.draft = {};

    }

  }


  function saveItems() {

    localStorage.setItem(
      STORAGE.items,
      JSON.stringify(EF.estimateItems)
    );

  }


  function saveDraft() {

    localStorage.setItem(
      STORAGE.draft,
      JSON.stringify(EF.draft || {})
    );

  }


  /* =======================================================
     MASTER DATA
     ======================================================= */

  function getMaster() {

    return Array.isArray(window.MATERIALS)
      ? window.MATERIALS
      : [];

  }


  /*
   MASTER STRUCTURE:

   [
     stageName,
     defaultSectionName,
     defaultCategoryName,
     defaultMaterials,
     extraSection1,
     extraSection2,
     ...
   ]

   Extra section:

   [
     sectionName,
     [
       material,
       material,
       ...
     ]
   ]
  */


  function getStages() {

    return getMaster();

  }


  function getStage(stageIndex) {

    return getStages()[stageIndex] || null;

  }


  function getStageName(stageIndex) {

    const stage = getStage(stageIndex);

    return stage ? stage[0] : "";

  }


  function getSections(stageIndex) {

    const stage = getStage(stageIndex);

    if (!stage) return [];

    const sections = [];

    /* -----------------------------------------------
       DEFAULT SECTION
       ----------------------------------------------- */

    if (
      stage[1] &&
      Array.isArray(stage[3])
    ) {

      sections.push({

        name: stage[1],

        category: stage[2] || "",

        materials: stage[3],

        originalIndex: 0

      });

    }


    /* -----------------------------------------------
       ADDITIONAL SECTIONS
       ----------------------------------------------- */

    for (let i = 4; i < stage.length; i++) {

      const section = stage[i];

      if (
        !Array.isArray(section) ||
        typeof section[0] !== "string" ||
        !Array.isArray(section[1])
      ) {
        continue;
      }

      sections.push({

        name: section[0],

        category: "",

        materials: section[1],

        originalIndex: i

      });

    }

    return sections;

  }


  function getSection(stageIndex, sectionIndex) {

    return getSections(stageIndex)[sectionIndex] || null;

  }


  function getMaterials(stageIndex, sectionIndex) {

    const section =
      getSection(stageIndex, sectionIndex);

    if (!section) return [];

    return section.materials || [];

  }


  function getMaterial(
    stageIndex,
    sectionIndex,
    materialIndex
  ) {

    const materials =
      getMaterials(stageIndex, sectionIndex);

    return materials[materialIndex] || null;

  }


  /* =======================================================
     MATERIAL OBJECT NORMALIZER
     ======================================================= */

  function normalizeMaterial(raw) {

    if (!Array.isArray(raw)) {

      return {

        name: String(raw || ""),

        fields: [],

        units: [],

        brands: []

      };

    }

    return {

      name: raw[0] || "",

      fields: Array.isArray(raw[1])
        ? raw[1]
        : [],

      units: Array.isArray(raw[2])
        ? raw[2]
        : [],

      brands: Array.isArray(raw[3])
        ? raw[3]
        : []

    };

  }


  /* =======================================================
     FLATTEN MATERIALS
     ======================================================= */

  function flattenMaterials() {

    const result = [];

    getStages().forEach((stage, stageIndex) => {

      const stageName = stage[0] || "";

      getSections(stageIndex)
        .forEach((section, sectionIndex) => {

          section.materials.forEach(
            (rawMaterial, materialIndex) => {

              const material =
                normalizeMaterial(rawMaterial);

              result.push({

                stageIndex,

                stageName,

                sectionIndex,

                sectionName: section.name,

                category: section.category,

                materialIndex,

                ...material

              });

            }
          );

        });

    });

    return result;

  }


  /* =======================================================
     LANGUAGE
     ======================================================= */

  const STAGE_HI = {

    "STAGE 1": "स्टेज 1",

    "STAGE 2": "स्टेज 2",

    "STAGE 3": "स्टेज 3",

    "STAGE 4": "स्टेज 4",

    "STAGE 5": "स्टेज 5"

  };


  const STAGE_NAME_HI = {

    "Slab Conduit Installation":
      "स्लैब कंड्यूट इंस्टॉलेशन",

    "Wall Conduit Installation":
      "दीवार कंड्यूट इंस्टॉलेशन",

    "Wiring Installation":
      "वायरिंग इंस्टॉलेशन",

    "Final Electrical Fittings":
      "फाइनल इलेक्ट्रिकल फिटिंग्स",

    "False Ceiling Wiring Material":
      "फॉल्स सीलिंग वायरिंग मटेरियल"

  };


  const SECTION_HI = {

    "Conduit & Box":
      "कंड्यूट और बॉक्स",

    "Installation Material":
      "इंस्टॉलेशन सामग्री",

    "Wiring Material":
      "वायरिंग सामग्री",

    "Pulling Material":
      "पुलिंग सामग्री",

    "Switch & Socket":
      "स्विच और सॉकेट",

    "MCB & Protection":
      "एमसीबी और प्रोटेक्शन",

    "Fan & Ceiling":
      "फैन और सीलिंग",

    "Lighting":
      "लाइटिंग",

    "Installation & Finishing":
      "इंस्टॉलेशन और फिनिशिंग",

    "Installation & Fastening":
      "इंस्टॉलेशन और फास्टनिंग",

    "Wiring & Conduit":
      "वायरिंग और कंड्यूट"

  };


  const MATERIAL_HI = {

    "Pipe": "पाइप",

    "Bend": "बेंड",

    "Junction Box": "जंक्शन बॉक्स",

    "Fan Box": "फैन बॉक्स",

    "Concealed Light Box":
      "कंसील्ड लाइट बॉक्स",

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
      "एमसीबी बॉक्स (डिस्ट्रीब्यूशन बोर्ड)",

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
      "डीपी स्विच (डबल पोल)",

    "Mini MCB":
      "मिनी एमसीबी",

    "SP MCB (Single Pole)":
      "एसपी एमसीबी (सिंगल पोल)",

    "DP MCB (Double Pole)":
      "डीपी एमसीबी (डबल पोल)",

    "TPN MCB (Three Pole with Neutral)":
      "टीपीएन एमसीबी (थ्री पोल विद न्यूट्रल)",

    "MCB Changeover":
      "एमसीबी चेंजओवर",

    "DP Isolator":
      "डीपी आइसोलेटर",

    "TPN Isolator (3P / 4P)":
      "टीपीएन आइसोलेटर (3P / 4P)",

    "RCCB / RCD":
      "आरसीसीबी / आरसीडी",

    "MCB Box":
      "एमसीबी बॉक्स",

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

    "LED Bulb":
      "एलईडी बल्ब",

    "LED Tube Light":
      "एलईडी ट्यूब लाइट",

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
      "एलईडी प्रोफाइल चैनल",

    "LED Strip Driver (SMPS)":
      "एलईडी स्ट्रिप ड्राइवर (SMPS)",

    "Door Bell":
      "डोर बेल",

    "Tape (Mounting / Double Sided)":
      "टेप (माउंटिंग / डबल साइडेड)",

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

    "PVC Wall Plug / Gulli / Gitti":
      "PVC वॉल प्लग / गुल्ली / गिट्टी",

    "Saddle (Pipe Clamp)":
      "सैडल (पाइप क्लैंप)"

  };


  const FIELD_HI = {

    "Size": "साइज़",

    "Type": "टाइप",

    "Sub Type": "सब टाइप",

    "Conduit Size": "कंड्यूट साइज़",

    "Shape / Ways": "शेप / वेज़",

    "Material": "मटेरियल",

    "Depth": "डेप्थ",

    "Hook Rod": "हुक रॉड",

    "Diameter": "डायमीटर",

    "Material Type": "मटेरियल टाइप",

    "Size (Width)": "साइज़ (चौड़ाई)",

    "Pack Size": "पैक साइज़",

    "Gauge / Size": "गेज / साइज़",

    "Size (Length)": "साइज़ (लंबाई)",

    "Colour": "रंग",

    "Module": "मॉड्यूल",

    "Phase Selection": "फेज़ चयन",

    "Door Type": "डोर टाइप",

    "Size (Width × Length)": "साइज़ (चौड़ाई × लंबाई)",

    "Size / Diameter": "साइज़ / डायमीटर",

    "Length": "लंबाई",

    "Amp": "एम्पियर",

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

    "Supply Voltage": "सप्लाई वोल्टेज",

    "Dimensions (W × D)": "डायमेंशन (W × D)",

    "Diffuser": "डिफ्यूज़र",

    "Output Voltage": "आउटपुट वोल्टेज",

    "Body Finish": "बॉडी फिनिश",

    "Movement": "मूवमेंट",

    "Beam Angle": "बीम एंगल",

    "Size (Weight)": "साइज़ (वजन)",

    "Pack Size (Weight)": "पैक साइज़ (वजन)",

    "Size (Diameter × Length)": "साइज़ (डायमीटर × लंबाई)",

    "Size (Cable Size × Stud Size)":
      "साइज़ (केबल साइज़ × स्टड साइज़)"

  };


  function textFor(value) {

    if (EF.lang === "en") {

      return String(value ?? "");

    }

    const key = String(value ?? "");

    return (
      STAGE_HI[key] ||
      STAGE_NAME_HI[key] ||
      SECTION_HI[key] ||
      MATERIAL_HI[key] ||
      FIELD_HI[key] ||
      key
    );

  }


  /* =======================================================
     TRANSLATE DOM
     ======================================================= */

  function applyLanguage() {

    document.documentElement.lang =
      EF.lang === "hi"
        ? "hi"
        : "en";


    qsa("[data-hi][data-en]")
      .forEach(el => {

        el.textContent =
          EF.lang === "hi"
            ? el.dataset.hi
            : el.dataset.en;

      });


    qsa("[data-placeholder-hi][data-placeholder-en]")
      .forEach(el => {

        el.placeholder =
          EF.lang === "hi"
            ? el.dataset.placeholderHi
            : el.dataset.placeholderEn;

      });


    const currentLanguageText =
      $("currentLanguageText");

    if (currentLanguageText) {

      currentLanguageText.textContent =
        EF.lang === "hi"
          ? "हिंदी"
          : "English";

    }


    updateLanguageButtons();

    updateThemeText();

    renderCurrentPage();

  }


  function updateLanguageButtons() {

    qsa(".language-option")
      .forEach(btn => {

        btn.classList.toggle(
          "active",
          btn.dataset.lang === EF.lang
        );

      });

  }


  /* =======================================================
     THEME
     ======================================================= */

  function applyTheme() {

    document.documentElement.dataset.theme =
      EF.theme;

    document.body.dataset.theme =
      EF.theme;

    document.body.classList.toggle(
      "light-mode",
      EF.theme === "light"
    );

    document.body.classList.toggle(
      "dark-mode",
      EF.theme !== "light"
    );

    localStorage.setItem(
      STORAGE.theme,
      EF.theme
    );

    updateThemeText();

  }


  function toggleTheme() {

    EF.theme =
      EF.theme === "dark"
        ? "light"
        : "dark";

    applyTheme();

  }


  function updateThemeText() {

    const text =
      $("themeButtonText");

    if (text) {

      text.textContent =
        EF.lang === "hi"
          ? (
              EF.theme === "dark"
                ? "डार्क मोड"
                : "लाइट मोड"
            )
          : (
              EF.theme === "dark"
                ? "Dark Mode"
                : "Light Mode"
            );

    }


    const current =
      $("currentThemeText");

    if (current) {

      current.textContent =
        EF.lang === "hi"
          ? (
              EF.theme === "dark"
                ? "डार्क"
                : "लाइट"
            )
          : (
              EF.theme === "dark"
                ? "Dark"
                : "Light"
            );

    }

  }


  /* =======================================================
     PAGE VISIBILITY
     ======================================================= */

  function showPage(pageId) {

    qsa(".page")
      .forEach(page => {

        const active =
          page.id === pageId;

        page.classList.toggle(
          "active",
          active
        );

        page.hidden = !active;

      });


    qsa(".bottom-item")
      .forEach(btn => {

        const route =
          btn.dataset.route;

        let active = false;

        if (route === "home") {

          active =
            pageId === "home" ||
            pageId === "materialPage" ||
            pageId === "editorPage";

        } else {

          active =
            pageId === route;

        }

        btn.classList.toggle(
          "active",
          active
        );

      });

  }


  /* =======================================================
     ROUTE
     ======================================================= */

  function routeObject() {

    return {

      route: EF.route,

      stageIndex: EF.stageIndex,

      sectionIndex: EF.sectionIndex,

      materialIndex: EF.materialIndex,

      editIndex: EF.editIndex

    };

  }


  function saveRoute() {

    localStorage.setItem(
      STORAGE.route,
      JSON.stringify(routeObject())
    );

  }


  function restoreRoute() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(STORAGE.route)
        );

      if (!saved) return false;

      EF.route =
        saved.route || "home";

      EF.stageIndex =
        Number.isInteger(saved.stageIndex)
          ? saved.stageIndex
          : null;

      EF.sectionIndex =
        Number.isInteger(saved.sectionIndex)
          ? saved.sectionIndex
          : null;

      EF.materialIndex =
        Number.isInteger(saved.materialIndex)
          ? saved.materialIndex
          : null;

      EF.editIndex =
        Number.isInteger(saved.editIndex)
          ? saved.editIndex
          : null;

      return true;

    } catch (e) {

      return false;

    }

  }


  function setRoute(route, push = true) {

    EF.route = route;

    saveRoute();

    if (push) {

      try {

        history.pushState(
          routeObject(),
          "",
          window.location.pathname +
          window.location.search +
          "#" +
          route
        );

      } catch (e) {}

    }

  }


  /* =======================================================
     HOME
     ======================================================= */

  function goHome(push = true) {

    EF.stageIndex = null;

    EF.sectionIndex = null;

    EF.materialIndex = null;

    EF.editIndex = null;

    setRoute("home", push);

    showPage("home");

    renderStages();

  }


  /* =======================================================
     STAGE RENDER
     ======================================================= */

  function renderStages() {

    const grid =
      $("stageGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const stages =
      getStages();

    const count =
      $("stageCount");

    if (count) {

      count.textContent =
        stages.length;

    }


    if (!stages.length) {

      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚡</div>
          <h3>
            ${
              EF.lang === "hi"
                ? "कोई स्टेज नहीं मिला"
                : "No stages found"
            }
          </h3>
        </div>
      `;

      return;

    }


    stages.forEach(
      (stage, stageIndex) => {

        const sections =
          getSections(stageIndex);

        const totalMaterials =
          sections.reduce(
            (sum, section) =>
              sum + section.materials.length,
            0
          );


        const card =
          document.createElement("button");

        card.type = "button";

        card.className =
          "stage-card";


        card.innerHTML = `

          <div class="stage-card-number">
            ${stageIndex + 1}
          </div>

          <div class="stage-card-content">

            <div class="stage-card-title">
              ${escapeHTML(textFor(stage[0]))}
            </div>

            <div class="stage-card-name">
              ${escapeHTML(textFor(stage[1] || ""))}
            </div>

            <div class="stage-card-meta">

              <span>
                ${sections.length}
                ${
                  EF.lang === "hi"
                    ? " सेक्शन"
                    : " Sections"
                }
              </span>

              <span>
                ${totalMaterials}
                ${
                  EF.lang === "hi"
                    ? " आइटम"
                    : " Items"
                }
              </span>

            </div>

          </div>

          <div class="stage-card-arrow">
            →
          </div>

        `;


        card.addEventListener(
          "click",
          () => openStage(stageIndex)
        );


        grid.appendChild(card);

      }
    );

  }


  /* =======================================================
     OPEN STAGE
     ======================================================= */

  function openStage(stageIndex, push = true) {

    const stage =
      getStage(stageIndex);

    if (!stage) return;

    EF.stageIndex =
      stageIndex;

    EF.sectionIndex = null;

    EF.materialIndex = null;

    EF.editIndex = null;

    setRoute("material", push);

    showPage("materialPage");

    renderSections(stageIndex);

  }


  /* =======================================================
     SECTION RENDER
     ======================================================= */

  function renderSections(stageIndex) {

    const grid =
      $("materialGrid");

    if (!grid) return;

    grid.innerHTML = "";

    grid.className =
      "material-grid view-grid";


    const stage =
      getStage(stageIndex);

    if (!stage) return;


    const sections =
      getSections(stageIndex);


    const title =
      $("materialPageTitle");

    if (title) {

      title.textContent =
        textFor(stage[1] || stage[0]);

    }


    const subtitle =
      $("materialPageSubtitle");

    if (subtitle) {

      subtitle.textContent =
        EF.lang === "hi"
          ? "सेक्शन चुनें"
          : "Select Section";

    }


    const resultInfo =
      $("materialResultInfo");

    if (resultInfo) {

      resultInfo.textContent =
        sections.length +
        (
          EF.lang === "hi"
            ? " सेक्शन"
            : " Sections"
        );

    }


    /* -----------------------------------------------
       FILTER / SEARCH DOES NOT REPLACE SECTION VIEW
       ----------------------------------------------- */

    sections.forEach(
      (section, sectionIndex) => {

        const card =
          document.createElement("button");

        card.type = "button";

        card.className =
          "material-card section-card";


        card.innerHTML = `

          <div class="material-card-icon">
            ⚡
          </div>

          <div class="material-card-content">

            <div class="material-card-title">
              ${escapeHTML(
                textFor(section.name)
              )}
            </div>

            ${
              section.category
                ? `
                  <div class="material-card-subtitle">
                    ${escapeHTML(
                      textFor(section.category)
                    )}
                  </div>
                `
                : ""
            }

            <div class="material-card-meta">

              <span>
                ${section.materials.length}
                ${
                  EF.lang === "hi"
                    ? " आइटम"
                    : " Items"
                }
              </span>

            </div>

          </div>

          <div class="material-card-arrow">
            →
          </div>

        `;


        card.addEventListener(
          "click",
          () =>
            openSection(
              stageIndex,
              sectionIndex
            )
        );


        grid.appendChild(card);

      }
    );


    updateViewButton();

  }


  /* =======================================================
     OPEN SECTION
     ======================================================= */

  function openSection(
    stageIndex,
    sectionIndex,
    push = true
  ) {

    const section =
      getSection(
        stageIndex,
        sectionIndex
      );

    if (!section) return;

    EF.stageIndex =
      stageIndex;

    EF.sectionIndex =
      sectionIndex;

    EF.materialIndex = null;

    EF.editIndex = null;

    setRoute("material", push);

    showPage("materialPage");

    renderMaterials(
      stageIndex,
      sectionIndex
    );

  }


  /* =======================================================
     MATERIAL SEARCH
     ======================================================= */

  function getCurrentMaterials() {

    if (
      EF.stageIndex === null ||
      EF.sectionIndex === null
    ) {

      return [];

    }

    return getMaterials(
      EF.stageIndex,
      EF.sectionIndex
    )
      .map(
        (raw, index) => {

          const m =
            normalizeMaterial(raw);

          return {

            ...m,

            stageIndex:
              EF.stageIndex,

            sectionIndex:
              EF.sectionIndex,

            materialIndex:
              index

          };

        }
      );

  }


  function materialMatches(material) {

    const search =
      EF.searchText
        .trim()
        .toLowerCase();


    if (search) {

      const haystack = [

        material.name,

        ...material.fields.flatMap(
          field => {

            if (!Array.isArray(field)) {
              return [];
            }

            return [
              field[0],
              ...(Array.isArray(field[1])
                ? field[1]
                : [])
            ];

          }
        ),

        ...material.units,

        ...material.brands

      ]
        .join(" ")
        .toLowerCase();


      const translated =
        [
          textFor(material.name),
          textFor(material.name)
        ]
          .join(" ")
          .toLowerCase();


      if (
        !haystack.includes(search) &&
        !translated.includes(search)
      ) {

        return false;

      }

    }


    const filters =
      EF.filters;


    if (
      filters.type &&
      !material.fields.some(
        field =>
          Array.isArray(field) &&
          String(field[0]).toLowerCase()
            .includes("type") &&
          Array.isArray(field[1]) &&
          field[1].includes(filters.type)
      )
    ) {

      return false;

    }


    if (
      filters.size &&
      !material.fields.some(
        field =>
          Array.isArray(field) &&
          Array.isArray(field[1]) &&
          field[1].includes(filters.size)
      )
    ) {

      return false;

    }


    if (
      filters.brand &&
      !material.brands.includes(filters.brand)
    ) {

      return false;

    }


    return true;

  }


  /* =======================================================
     MATERIAL RENDER
     ======================================================= */

  function renderMaterials(
    stageIndex,
    sectionIndex
  ) {

    const grid =
      $("materialGrid");

    if (!grid) return;

    const section =
      getSection(
        stageIndex,
        sectionIndex
      );

    if (!section) return;


    let materials =
      getMaterials(
        stageIndex,
        sectionIndex
      )
        .map(
          (raw, index) => {

            return {

              ...normalizeMaterial(raw),

              stageIndex,

              sectionIndex,

              materialIndex: index

            };

          }
        );


    materials =
      materials.filter(
        materialMatches
      );


    const title =
      $("materialPageTitle");

    if (title) {

      title.textContent =
        textFor(section.name);

    }


    const subtitle =
      $("materialPageSubtitle");

    if (subtitle) {

      subtitle.textContent =
        textFor(
          section.category ||
          (
            EF.lang === "hi"
              ? "मटेरियल चुनें"
              : "Select Material"
          )
        );

    }


    const resultInfo =
      $("materialResultInfo");

    if (resultInfo) {

      resultInfo.textContent =
        materials.length +
        (
          EF.lang === "hi"
            ? " आइटम"
            : " Items"
        );

    }


    grid.innerHTML = "";


    if (!materials.length) {

      grid.innerHTML = `

        <div class="empty-state">

          <div class="empty-icon">
            🔍
          </div>

          <h3>
            ${
              EF.lang === "hi"
                ? "कोई मटेरियल नहीं मिला"
                : "No materials found"
            }
          </h3>

          <p>
            ${
              EF.lang === "hi"
                ? "सर्च या फ़िल्टर बदलें"
                : "Change search or filter"
            }
          </p>

        </div>

      `;

      return;

    }


    grid.className =
      "material-grid view-" +
      EF.view;


    materials.forEach(
      material => {

        const card =
          document.createElement("button");

        card.type = "button";

        card.className =
          "material-card";


        const fieldSummary =
          material.fields
            .slice(0, 3)
            .map(field => {

              if (
                !Array.isArray(field)
              ) return "";

              const name =
                field[0] || "";

              const options =
                Array.isArray(field[1])
                  ? field[1]
                  : [];

              return `
                <span>
                  ${escapeHTML(
                    textFor(name)
                  )}
                </span>
              `;

            })
            .join("");


        card.innerHTML = `

          <div class="material-card-icon">
            ⚡
          </div>

          <div class="material-card-content">

            <div class="material-card-title">
              ${escapeHTML(
                textFor(material.name)
              )}
            </div>

            ${
              fieldSummary
                ? `
                  <div class="material-card-fields">
                    ${fieldSummary}
                  </div>
                `
                : ""
            }

            <div class="material-card-meta">

              <span>
                ${material.units.length}
                ${
                  EF.lang === "hi"
                    ? " यूनिट"
                    : " Units"
                }
              </span>

              ${
                material.brands.length
                  ? `
                    <span>
                      ${
                        EF.lang === "hi"
                          ? "ब्रांड उपलब्ध"
                          : "Brands available"
                      }
                    </span>
                  `
                  : ""
              }

            </div>

          </div>

          <div class="material-card-arrow">
            →
          </div>

        `;


        card.addEventListener(
          "click",
          () => {

            openEditor(

              material.stageIndex,

              material.sectionIndex,

              material.materialIndex

            );

          }
        );


        grid.appendChild(card);

      }
    );


    updateViewButton();

  }


  /* =======================================================
     EDITOR
     ======================================================= */

  function openEditor(
    stageIndex,
    sectionIndex,
    materialIndex,
    push = true
  ) {

    const raw =
      getMaterial(
        stageIndex,
        sectionIndex,
        materialIndex
      );

    if (!raw) return;


    const material =
      normalizeMaterial(raw);


    EF.stageIndex =
      stageIndex;

    EF.sectionIndex =
      sectionIndex;

    EF.materialIndex =
      materialIndex;

    EF.editIndex = null;


    setRoute("editor", push);

    showPage("editorPage");


    renderEditor(
      material,
      stageIndex,
      sectionIndex
    );

  }


  function renderEditor(
    material,
    stageIndex,
    sectionIndex
  ) {

    const name =
      $("editorMaterialName");

    if (name) {

      name.textContent =
        textFor(material.name);

    }


    const route =
      $("efRoute");

    if (route) {

      const stage =
        getStage(stageIndex);

      const section =
        getSection(
          stageIndex,
          sectionIndex
        );


      route.textContent =
        [
          textFor(stage ? stage[0] : ""),
          textFor(section ? section.name : ""),
          textFor(material.name)
        ]
          .filter(Boolean)
          .join(" → ");

    }


    renderMaterialFields(
      material
    );

    populateUnits(
      material.units
    );

    populateBrands(
      material.brands
    );


    const draft =
      EF.draft || {};


    if (
      draft.stageIndex === stageIndex &&
      draft.sectionIndex === sectionIndex &&
      draft.materialIndex === EF.materialIndex
    ) {

      restoreEditorDraft();

    } else {

      clearEditor(false);

    }

  }


  /* =======================================================
     MATERIAL FIELDS
     ======================================================= */

  function renderMaterialFields(
    material
  ) {

    const container =
      $("materialFields");

    if (!container) return;

    container.innerHTML = "";


    material.fields.forEach(
      (field, index) => {

        if (!Array.isArray(field)) return;


        const fieldName =
          field[0] || "";


        const options =
          Array.isArray(field[1])
            ? field[1]
            : [];


        const group =
          document.createElement("div");

        group.className =
          "form-group material-option-group";


        const label =
          document.createElement("label");

        label.htmlFor =
          "materialField_" + index;


        label.textContent =
          textFor(fieldName);


        const select =
          document.createElement("select");

        select.id =
          "materialField_" + index;

        select.dataset.fieldName =
          fieldName;


        const empty =
          document.createElement("option");

        empty.value = "";

        empty.textContent =
          EF.lang === "hi"
            ? "चुनें"
            : "Select";

        select.appendChild(empty);


        options.forEach(
          option => {

            const opt =
              document.createElement("option");

            opt.value =
              option;

            opt.textContent =
              textFor(option);

            select.appendChild(opt);

          }
        );


        select.addEventListener(
          "change",
          saveEditorDraft
        );


        group.appendChild(label);

        group.appendChild(select);

        container.appendChild(group);

      }
    );

  }


  /* =======================================================
     UNITS
     ======================================================= */

  function populateUnits(
    units
  ) {

    const select =
      $("unitInput");

    if (!select) return;

    select.innerHTML = "";


    const empty =
      document.createElement("option");

    empty.value = "";

    empty.textContent = "—";

    select.appendChild(empty);


    const lastUnit =
      localStorage.getItem(
        STORAGE.lastUnit
      ) || "";


    units.forEach(
      unit => {

        const opt =
          document.createElement("option");

        opt.value =
          unit;

        opt.textContent =
          unit;

        select.appendChild(opt);

      }
    );


    if (lastUnit &&
        units.includes(lastUnit)) {

      select.value =
        lastUnit;

    }

  }


  /* =======================================================
     BRANDS
     ======================================================= */

  function populateBrands(
    brands
  ) {

    const select =
      $("brandInput");

    if (!select) return;

    select.innerHTML = "";


    const empty =
      document.createElement("option");

    empty.value = "";

    empty.textContent = "—";

    select.appendChild(empty);


    brands.forEach(
      brand => {

        const opt =
          document.createElement("option");

        opt.value =
          brand;

        opt.textContent =
          brand;

        select.appendChild(opt);

      }
    );

  }


  /* =======================================================
     SAVE ITEM
     ======================================================= */

  function saveCurrentItem() {

    if (
      EF.stageIndex === null ||
      EF.sectionIndex === null ||
      EF.materialIndex === null
    ) {

      return;

    }


    const raw =
      getMaterial(
        EF.stageIndex,
        EF.sectionIndex,
        EF.materialIndex
      );

    if (!raw) return;


    const material =
      normalizeMaterial(raw);


    const quantity =
      parseFloat(
        $("quantityInput")?.value || ""
      );


    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {

      showToast(
        EF.lang === "hi"
          ? "मात्रा दर्ज करें"
          : "Enter quantity"
      );

      $("quantityInput")?.focus();

      return;

    }


    const fields = {};


    material.fields.forEach(
      (field, index) => {

        if (!Array.isArray(field)) return;


        const input =
          $("materialField_" + index);


        if (input) {

          fields[field[0]] =
            input.value || "";

        }

      }
    );


    const unit =
      $("unitInput")?.value || "";


    const brand =
      $("brandInput")?.value || "";


    const price =
      $("priceInput")?.value || "";


    const item = {

      id:
        Date.now().toString(36) +
        Math.random()
          .toString(36)
          .slice(2),

      stageIndex:
        EF.stageIndex,

      stage:
        getStageName(EF.stageIndex),

      sectionIndex:
        EF.sectionIndex,

      section:
        getSection(
          EF.stageIndex,
          EF.sectionIndex
        )?.name || "",

      materialIndex:
        EF.materialIndex,

      material:
        material.name,

      fields,

      quantity,

      unit,

      brand,

      price,

      createdAt:
        new Date().toISOString()

    };


    if (
      Number.isInteger(EF.editIndex)
    ) {

      EF.estimateItems[
        EF.editIndex
      ] = {

        ...EF.estimateItems[
          EF.editIndex
        ],

        ...item

      };

      showToast(
        EF.lang === "hi"
          ? "आइटम अपडेट हो गया"
          : "Item updated"
      );

    } else {

      EF.estimateItems.push(item);

      showToast(
        EF.lang === "hi"
          ? "आइटम एस्टिमेट में जुड़ गया"
          : "Item added to estimate"
      );

    }


    saveItems();


    localStorage.setItem(
      STORAGE.lastUnit,
      unit
    );


    EF.editIndex = null;


    clearEditor(false);

    goNextMaterial();

  }


  /* =======================================================
     NEXT
     -------------------------------------------------------
     IMPORTANT:
     Next DOES NOT SAVE.
     ======================================================= */

  function goNextMaterial() {

    if (
      EF.stageIndex === null ||
      EF.sectionIndex === null ||
      EF.materialIndex === null
    ) {

      return;

    }


    const materials =
      getMaterials(
        EF.stageIndex,
        EF.sectionIndex
      );


    const nextIndex =
      EF.materialIndex + 1;


    if (
      nextIndex < materials.length
    ) {

      EF.materialIndex =
        nextIndex;

      saveRoute();

      renderEditor(
        normalizeMaterial(
          materials[nextIndex]
        ),
        EF.stageIndex,
        EF.sectionIndex
      );

      showPage("editorPage");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      return;

    }


    const sections =
      getSections(
        EF.stageIndex
      );


    const nextSection =
      EF.sectionIndex + 1;


    if (
      nextSection < sections.length
    ) {

      EF.sectionIndex =
        nextSection;

      EF.materialIndex =
        0;

      saveRoute();

      renderEditor(
        normalizeMaterial(
          sections[nextSection].materials[0]
        ),
        EF.stageIndex,
        nextSection
      );

      showPage("editorPage");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      return;

    }


    const nextStage =
      EF.stageIndex + 1;


    if (
      nextStage < getStages().length
    ) {

      EF.stageIndex =
        nextStage;

      EF.sectionIndex =
        0;

      EF.materialIndex =
        0;

      saveRoute();

      renderEditor(
        normalizeMaterial(
          getSections(nextStage)[0]
            .materials[0]
        ),
        nextStage,
        0
      );

      showPage("editorPage");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      return;

    }


    showToast(
      EF.lang === "hi"
        ? "यह आखिरी आइटम है"
        : "This is the last item"
    );

  }


  /* =======================================================
     PREVIOUS
     ======================================================= */

  function goPrevious() {

    if (
      EF.stageIndex === null ||
      EF.sectionIndex === null ||
      EF.materialIndex === null
    ) {

      return;

    }


    if (EF.materialIndex > 0) {

      EF.materialIndex--;

    } else if (EF.sectionIndex > 0) {

      EF.sectionIndex--;

      const materials =
        getMaterials(
          EF.stageIndex,
          EF.sectionIndex
        );

      EF.materialIndex =
        Math.max(
          0,
          materials.length - 1
        );

    } else if (EF.stageIndex > 0) {

      EF.stageIndex--;

      const sections =
        getSections(
          EF.stageIndex
        );

      EF.sectionIndex =
        Math.max(
          0,
          sections.length - 1
        );

      const materials =
        getMaterials(
          EF.stageIndex,
          EF.sectionIndex
        );

      EF.materialIndex =
        Math.max(
          0,
          materials.length - 1
        );

    } else {

      openStage(
        EF.stageIndex,
        false
      );

      return;

    }


    saveRoute();


    renderEditor(
      normalizeMaterial(
        getMaterial(
          EF.stageIndex,
          EF.sectionIndex,
          EF.materialIndex
        )
      ),
      EF.stageIndex,
      EF.sectionIndex
    );


    showPage("editorPage");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  /* =======================================================
     CLEAR EDITOR
     ======================================================= */

  function clearEditor(
    save = true
  ) {

    qsa(
      "#materialFields select"
    )
      .forEach(
        select => {
          select.value = "";
        }
      );


    const quantity =
      $("quantityInput");

    if (quantity) {

      quantity.value = "";

    }


    const unit =
      $("unitInput");

    if (unit) {

      unit.value = "";

    }


    const brand =
      $("brandInput");

    if (brand) {

      brand.value = "";

    }


    const price =
      $("priceInput");

    if (price) {

      price.value = "";

    }


    if (save) {

      EF.draft = {};

      saveDraft();

    }

  }


  /* =======================================================
     DRAFT
     ======================================================= */

  function saveEditorDraft() {

    if (
      EF.stageIndex === null ||
      EF.sectionIndex === null ||
      EF.materialIndex === null
    ) {

      return;

    }


    const fields = {};


    qsa(
      "#materialFields select"
    )
      .forEach(
        select => {

          fields[
            select.dataset.fieldName
          ] =
            select.value || "";

        }
      );


    EF.draft = {

      stageIndex:
        EF.stageIndex,

      sectionIndex:
        EF.sectionIndex,

      materialIndex:
        EF.materialIndex,

      fields,

      quantity:
        $("quantityInput")?.value || "",

      unit:
        $("unitInput")?.value || "",

      brand:
        $("brandInput")?.value || "",

      price:
        $("priceInput")?.value || ""

    };


    saveDraft();

  }


  function restoreEditorDraft() {

    const draft =
      EF.draft;


    if (!draft) return;


    qsa(
      "#materialFields select"
    )
      .forEach(
        select => {

          const value =
            draft.fields
              ? draft.fields[
                  select.dataset.fieldName
                ]
              : "";

          if (
            value !== undefined
          ) {

            select.value =
              value;

          }

        }
      );


    if ($("quantityInput")) {

      $("quantityInput").value =
        draft.quantity || "";

    }


    if ($("unitInput")) {

      $("unitInput").value =
        draft.unit || "";

    }


    if ($("brandInput")) {

      $("brandInput").value =
        draft.brand || "";

    }


    if ($("priceInput")) {

      $("priceInput").value =
        draft.price || "";

    }

  }


  /* =======================================================
     ESTIMATE
     ======================================================= */

  function renderEstimate() {

    const list =
      $("estimateList");

    if (!list) return;

    list.innerHTML = "";


    const items =
      EF.estimateItems;


    const count =
      $("estimateCount");

    if (count) {

      count.textContent =
        items.length;

    }


    const totalQuantity =
      items.reduce(
        (sum, item) =>
          sum +
          (Number(item.quantity) || 0),
        0
      );


    const quantity =
      $("estimateQuantity");

    if (quantity) {

      quantity.textContent =
        totalQuantity;

    }


    const total =
      items.reduce(
        (sum, item) =>
          sum +
          (
            Number(item.price) || 0
          ) *
          (
            Number(item.quantity) || 0
          ),
        0
      );


    const totalEl =
      $("estimateTotal");

    if (totalEl) {

      totalEl.textContent =
        "₹" +
        total.toLocaleString(
          "en-IN"
        );

    }


    const empty =
      $("emptyEstimate");

    if (empty) {

      empty.hidden =
        items.length !== 0;

    }


    items.forEach(
      (item, index) => {

        const card =
          document.createElement("div");

        card.className =
          "estimate-card";


        const fieldText =
          Object.entries(
            item.fields || {}
          )
            .filter(
              ([, value]) =>
                value !== ""
            )
            .map(
              ([key, value]) =>
                `${escapeHTML(
                  textFor(key)
                )}: ${escapeHTML(
                  textFor(value)
                )}`
            )
            .join(" • ");


        card.innerHTML = `

          <div class="estimate-card-head">

            <strong>
              ${escapeHTML(
                textFor(item.material)
              )}
            </strong>

            <span>
              #${index + 1}
            </span>

          </div>

          <div class="estimate-card-route">

            ${escapeHTML(
              textFor(item.stage)
            )}

            →

            ${escapeHTML(
              textFor(item.section)
            )}

          </div>

          ${
            fieldText
              ? `
                <div class="estimate-card-fields">
                  ${fieldText}
                </div>
              `
              : ""
          }

          <div class="estimate-card-meta">

            <span>
              ${
                EF.lang === "hi"
                  ? "मात्रा"
                  : "Qty"
              }:
              ${escapeHTML(
                String(item.quantity)
              )}
            </span>

            <span>
              ${escapeHTML(
                item.unit || "—"
              )}
            </span>

            ${
              item.brand
                ? `
                  <span>
                    ${escapeHTML(
                      item.brand
                    )}
                  </span>
                `
                : ""
            }

          </div>

          <div class="estimate-card-actions">

            <button
              type="button"
              class="secondary-btn"
              data-edit-estimate="${index}"
            >
              ${
                EF.lang === "hi"
                  ? "एडिट"
                  : "Edit"
              }
            </button>

            <button
              type="button"
              class="danger-btn"
              data-delete-estimate="${index}"
            >
              ${
                EF.lang === "hi"
                  ? "हटाएं"
                  : "Delete"
              }
            </button>

          </div>

        `;


        list.appendChild(card);

      }
    );


    qsa(
      "[data-edit-estimate]"
    )
      .forEach(
        btn => {

          btn.addEventListener(
            "click",
            () =>
              editEstimate(
                Number(
                  btn.dataset.editEstimate
                )
              )
          );

        }
      );


    qsa(
      "[data-delete-estimate]"
    )
      .forEach(
        btn => {

          btn.addEventListener(
            "click",
            () =>
              deleteEstimate(
                Number(
                  btn.dataset.deleteEstimate
                )
              )
          );

        }
      );

  }


  function editEstimate(index) {

    const item =
      EF.estimateItems[index];

    if (!item) return;


    EF.stageIndex =
      item.stageIndex;

    EF.sectionIndex =
      item.sectionIndex;

    EF.materialIndex =
      item.materialIndex;

    EF.editIndex =
      index;


    EF.draft = {

      stageIndex:
        EF.stageIndex,

      sectionIndex:
        EF.sectionIndex,

      materialIndex:
        EF.materialIndex,

      fields:
        item.fields || {},

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

    setRoute("editor");

    showPage("editorPage");


    renderEditor(
      normalizeMaterial(
        getMaterial(
          EF.stageIndex,
          EF.sectionIndex,
          EF.materialIndex
        )
      ),
      EF.stageIndex,
      EF.sectionIndex
    );


    restoreEditorDraft();

  }


  function deleteEstimate(index) {

    if (
      !EF.estimateItems[index]
    ) return;


    const message =
      EF.lang === "hi"
        ? "क्या यह आइटम हटाना है?"
        : "Delete this item?";


    if (
      !window.confirm(message)
    ) return;


    EF.estimateItems.splice(
      index,
      1
    );


    saveItems();

    renderEstimate();


    showToast(
      EF.lang === "hi"
        ? "आइटम हटा दिया गया"
        : "Item deleted"
    );

  }


  /* =======================================================
     SEARCH
     ======================================================= */

  function applySearch(value) {

    EF.searchText =
      String(value || "");

    if (
      EF.stageIndex !== null &&
      EF.sectionIndex !== null
    ) {

      renderMaterials(
        EF.stageIndex,
        EF.sectionIndex
      );

    }

  }


  /* =======================================================
     FILTER
     ======================================================= */

  function populateFilters() {

    const stageSelect =
      $("stageFilter");

    const typeSelect =
      $("typeFilter");

    const sizeSelect =
      $("sizeFilter");

    const brandSelect =
      $("brandFilter");


    if (stageSelect) {

      stageSelect.innerHTML = `
        <option value="">
          ${
            EF.lang === "hi"
              ? "सभी"
              : "All"
          }
        </option>
      `;


      getStages().forEach(
        (stage, index) => {

          const option =
            document.createElement("option");

          option.value =
            String(index);

          option.textContent =
            textFor(stage[0]);

          stageSelect.appendChild(
            option
          );

        }
      );

    }


    const all =
      flattenMaterials();


    const types =
      new Set();

    const sizes =
      new Set();

    const brands =
      new Set();


    all.forEach(
      material => {

        material.fields
          .forEach(
            field => {

              if (
                !Array.isArray(field)
              ) return;

              const name =
                String(
                  field[0] || ""
                )
                  .toLowerCase();

              const options =
                Array.isArray(field[1])
                  ? field[1]
                  : [];


              if (
                name.includes("type")
              ) {

                options.forEach(
                  value =>
                    types.add(value)
                );

              }


              if (
                name.includes("size") ||
                name.includes("diameter") ||
                name.includes("module") ||
                name.includes("amp") ||
                name.includes("watt")
              ) {

                options.forEach(
                  value =>
                    sizes.add(value)
                );

              }

            }
          );


        material.brands.forEach(
          brand =>
            brands.add(brand)
        );

      }
    );


    fillSelect(
      typeSelect,
      Array.from(types)
    );

    fillSelect(
      sizeSelect,
      Array.from(sizes)
    );

    fillSelect(
      brandSelect,
      Array.from(brands)
    );

  }


  function fillSelect(
    select,
    values
  ) {

    if (!select) return;


    const oldValue =
      select.value;


    select.innerHTML = `
      <option value="">
        ${
          EF.lang === "hi"
            ? "सभी"
            : "All"
        }
      </option>
    `;


    values
      .sort(
        (a, b) =>
          String(a)
            .localeCompare(
              String(b),
              undefined,
              {
                numeric: true
              }
            )
      )
      .forEach(
        value => {

          const option =
            document.createElement("option");

          option.value =
            value;

          option.textContent =
            textFor(value);

          select.appendChild(
            option
          );

        }
      );


    if (
      values.includes(oldValue)
    ) {

      select.value =
        oldValue;

    }

  }


  function applyFilters() {

    EF.filters.stage =
      $("stageFilter")?.value || "";

    EF.filters.type =
      $("typeFilter")?.value || "";

    EF.filters.size =
      $("sizeFilter")?.value || "";

    EF.filters.brand =
      $("brandFilter")?.value || "";


    /*
     Stage filter changes the visible stage.
    */

    if (
      EF.filters.stage !== ""
    ) {

      const stageIndex =
        Number(
          EF.filters.stage
        );

      if (
        Number.isInteger(stageIndex)
      ) {

        openStage(
          stageIndex,
          false
        );

      }

    } else if (
      EF.stageIndex !== null &&
      EF.sectionIndex !== null
    ) {

      renderMaterials(
        EF.stageIndex,
        EF.sectionIndex
      );

    }

  }


  function clearFilters() {

    EF.filters = {

      stage: "",

      type: "",

      size: "",

      brand: ""

    };


    [
      "stageFilter",
      "typeFilter",
      "sizeFilter",
      "brandFilter"
    ]
      .forEach(
        id => {

          const el = $(id);

          if (el) {

            el.value = "";

          }

        }
      );


    EF.searchText = "";


    if ($("searchInput")) {

      $("searchInput").value = "";

    }


    if (
      EF.stageIndex !== null &&
      EF.sectionIndex !== null
    ) {

      renderMaterials(
        EF.stageIndex,
        EF.sectionIndex
      );

    } else {

      renderStages();

    }

  }


  /* =======================================================
     VIEW SELECTOR
     ======================================================= */

  function updateViewButton() {

    const trigger =
      $("viewTrigger");

    if (!trigger) return;


    const icons = {

      grid: "▦",

      list: "☷",

      compact: "▤",

      large: "▦",

      mini: "▪",

      "2column": "▥",

      horizontal: "▬",

      icon: "◉",

      timeline: "⋮",

      dense: "≡"

    };


    trigger.textContent =
      icons[EF.view] ||
      "▦";


    qsa(
      "#viewOptions [data-view]"
    )
      .forEach(
        btn => {

          btn.classList.toggle(
            "active",
            btn.dataset.view === EF.view
          );

        }
      );

  }


  function toggleViewOptions() {

    const options =
      $("viewOptions");

    if (!options) return;


    EF.viewOpen =
      !EF.viewOpen;


    options.hidden =
      !EF.viewOpen;


    $("viewTrigger")?.setAttribute(
      "aria-expanded",
      String(EF.viewOpen)
    );

  }


  function setView(view) {

    if (!view) return;


    EF.view =
      view;


    localStorage.setItem(
      STORAGE.view,
      view
    );


    EF.viewOpen =
      false;


    if ($("viewOptions")) {

      $("viewOptions").hidden =
        true;

    }


    updateViewButton();


    if (
      EF.stageIndex !== null &&
      EF.sectionIndex !== null
    ) {

      renderMaterials(
        EF.stageIndex,
        EF.sectionIndex
      );

    }


    const currentView =
      $("currentViewText");

    if (currentView) {

      currentView.textContent =
        view;

    }

  }


  /* =======================================================
     DRAWER
     ======================================================= */

  function openDrawer() {

    const drawer =
      $("drawer");

    const overlay =
      $("drawerOverlay");

    if (!drawer) return;


    EF.drawerOpen =
      true;


    drawer.classList.add(
      "open"
    );


    overlay?.classList.add(
      "open"
    );


    drawer.setAttribute(
      "aria-hidden",
      "false"
    );


    $("menuBtn")?.setAttribute(
      "aria-expanded",
      "true"
    );

  }


  function closeDrawer() {

    const drawer =
      $("drawer");

    const overlay =
      $("drawerOverlay");


    EF.drawerOpen =
      false;


    drawer?.classList.remove(
      "open"
    );


    overlay?.classList.remove(
      "open"
    );


    drawer?.setAttribute(
      "aria-hidden",
      "true"
    );


    $("menuBtn")?.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  function toggleDrawer() {

    if (EF.drawerOpen) {

      closeDrawer();

    } else {

      openDrawer();

    }

  }


  /* =======================================================
     RESET
     ======================================================= */

  function openResetModal() {

    const modal =
      $("resetModal");

    if (!modal) return;


    modal.hidden =
      false;

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function closeResetModal() {

    const modal =
      $("resetModal");

    if (!modal) return;


    modal.hidden =
      true;

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  function resetApp() {

    localStorage.removeItem(
      STORAGE.lang
    );

    localStorage.removeItem(
      STORAGE.theme
    );

    localStorage.removeItem(
      STORAGE.items
    );

    localStorage.removeItem(
      STORAGE.view
    );

    localStorage.removeItem(
      STORAGE.route
    );

    localStorage.removeItem(
      STORAGE.draft
    );

    localStorage.removeItem(
      STORAGE.lastUnit
    );


    EF.lang = "hi";

    EF.theme = "dark";

    EF.view = "grid";

    EF.route = "home";

    EF.stageIndex = null;

    EF.sectionIndex = null;

    EF.materialIndex = null;

    EF.editIndex = null;

    EF.searchText = "";

    EF.filters = {
      stage: "",
      type: "",
      size: "",
      brand: ""
    };

    EF.estimateItems = [];

    EF.draft = {};


    closeResetModal();

    closeDrawer();

    applyTheme();

    applyLanguage();

    populateFilters();

    goHome(false);


    showToast(
      EF.lang === "hi"
        ? "ऐप रीसेट हो गया"
        : "App reset complete"
    );

  }


  /* =======================================================
     TOAST
     ======================================================= */

  let toastTimer = null;


  function showToast(message) {

    const toast =
      $("toast");

    if (!toast) return;


    toast.textContent =
      message;


    toast.classList.add(
      "show"
    );


    clearTimeout(
      toastTimer
    );


    toastTimer =
      setTimeout(
        () => {

          toast.classList.remove(
            "show"
          );

        },
        2200
      );

  }


  /* =======================================================
     CALCULATOR
     ======================================================= */

  function renderCalculator() {

    const container =
      $("calculatorContent");

    if (!container) return;


    if (EF.calculator === "ohm") {

      container.innerHTML = `

        <div class="calculator-card">

          <h3>
            ${
              EF.lang === "hi"
                ? "पावर कैलकुलेटर"
                : "Power Calculator"
            }
          </h3>

          <div class="form-group">

            <label>
              ${
                EF.lang === "hi"
                  ? "वोल्टेज (V)"
                  : "Voltage (V)"
              }
            </label>

            <input
              id="calcVoltage"
              type="number"
              step="any"
              inputmode="decimal"
            >

          </div>

          <div class="form-group">

            <label>
              ${
                EF.lang === "hi"
                  ? "करंट (A)"
                  : "Current (A)"
              }
            </label>

            <input
              id="calcCurrent"
              type="number"
              step="any"
              inputmode="decimal"
            >

          </div>

          <button
            type="button"
            class="primary-btn"
            id="calculatePower"
          >
            ${
              EF.lang === "hi"
                ? "गणना करें"
                : "Calculate"
            }
          </button>

          <div
            id="powerResult"
            class="calculator-result"
          ></div>

        </div>

      `;


      $("calculatePower")
        ?.addEventListener(
          "click",
          () => {

            const v =
              Number(
                $("calcVoltage")?.value
              );

            const i =
              Number(
                $("calcCurrent")?.value
              );


            if (
              !Number.isFinite(v) ||
              !Number.isFinite(i)
            ) {

              return;

            }


            const p =
              v * i;


            $("powerResult").textContent =
              `P = V × I = ${p.toFixed(2)} W`;

          }
        );


      return;

    }


    if (EF.calculator === "inverter") {

      container.innerHTML = `

        <div class="calculator-card">

          <h3>
            ${
              EF.lang === "hi"
                ? "इन्वर्टर कैलकुलेटर"
                : "Inverter Calculator"
            }
          </h3>

          <p>
            ${
              EF.lang === "hi"
                ? "12V / 24V DC से 230V AC"
                : "12V / 24V DC to 230V AC"
            }
          </p>

          <div class="form-group">

            <label>
              ${
                EF.lang === "hi"
                  ? "बैटरी वोल्टेज"
                  : "Battery Voltage"
              }
            </label>

            <select id="batteryVoltage">

              <option value="12">
                12V
              </option>

              <option value="24">
                24V
              </option>

            </select>

          </div>

          <div class="form-group">

            <label>
              ${
                EF.lang === "hi"
                  ? "लोड (W)"
                  : "Load (W)"
              }
            </label>

            <input
              id="inverterLoad"
              type="number"
              step="any"
            >

          </div>

          <button
            type="button"
            class="primary-btn"
            id="calculateInverter"
          >
            ${
              EF.lang === "hi"
                ? "गणना करें"
                : "Calculate"
            }
          </button>

          <div
            id="inverterResult"
            class="calculator-result"
          ></div>

        </div>

      `;


      $("calculateInverter")
        ?.addEventListener(
          "click",
          () => {

            const voltage =
              Number(
                $("batteryVoltage")?.value
              );

            const load =
              Number(
                $("inverterLoad")?.value
              );


            if (
              !voltage ||
              !load
            ) return;


            const current =
              load / voltage;


            $("inverterResult")
              .textContent =
              `${
                EF.lang === "hi"
                  ? "लगभग DC करंट"
                  : "Approx. DC Current"
              }: ${current.toFixed(2)} A`;

          }
        );


      return;

    }


    container.innerHTML = `

      <div class="calculator-card">

        <h3>
          ${
            EF.lang === "hi"
              ? "केबल कैलकुलेटर"
              : "Cable Calculator"
          }
        </h3>

        <p>
          ${
            EF.lang === "hi"
              ? "केबल साइज़ चुनने के लिए लोड, दूरी और वायरिंग तरीका देखें।"
              : "Consider load, distance and wiring method when selecting cable size."
          }
        </p>

      </div>

    `;

  }


  /* =======================================================
     SETTINGS
     ======================================================= */

  function renderSettings() {

    updateThemeText();

    const currentView =
      $("currentViewText");

    if (currentView) {

      currentView.textContent =
        EF.view;

    }

  }


  /* =======================================================
     CURRENT PAGE
     ======================================================= */

  function renderCurrentPage() {

    switch (EF.route) {

      case "home":

        showPage("home");

        renderStages();

        break;


      case "material":

        showPage("materialPage");


        if (
          EF.stageIndex !== null &&
          EF.sectionIndex !== null
        ) {

          renderMaterials(
            EF.stageIndex,
            EF.sectionIndex
          );

        } else if (
          EF.stageIndex !== null
        ) {

          renderSections(
            EF.stageIndex
          );

        } else {

          goHome(false);

        }

        break;


      case "editor":

        showPage("editorPage");


        if (
          EF.stageIndex !== null &&
          EF.sectionIndex !== null &&
          EF.materialIndex !== null
        ) {

          const material =
            getMaterial(
              EF.stageIndex,
              EF.sectionIndex,
              EF.materialIndex
            );


          if (material) {

            renderEditor(
              normalizeMaterial(material),
              EF.stageIndex,
              EF.sectionIndex
            );

          }

        }

        break;


      case "estimate":

        showPage("estimate");

        renderEstimate();

        break;


      case "calculator":

        showPage("calculator");

        renderCalculator();

        break;


      case "settings":

        showPage("settings");

        renderSettings();

        break;


      default:

        goHome(false);

    }

  }


  /* =======================================================
     MATERIAL BACK
     ======================================================= */

  function materialBack() {

    if (
      EF.sectionIndex !== null
    ) {

      EF.sectionIndex = null;

      EF.materialIndex = null;

      saveRoute();

      renderSections(
        EF.stageIndex
      );

      showPage("materialPage");

      return;

    }


    if (
      EF.stageIndex !== null
    ) {

      goHome();

      return;

    }


    goHome();

  }


  /* =======================================================
     EDITOR BACK
     ======================================================= */

  function editorBack() {

    if (
      EF.stageIndex !== null &&
      EF.sectionIndex !== null
    ) {

      setRoute(
        "material"
      );

      showPage(
        "materialPage"
      );


      renderMaterials(
        EF.stageIndex,
        EF.sectionIndex
      );

      return;

    }


    goHome();

  }


  /* =======================================================
     SEARCH / FILTER EVENTS
     ======================================================= */

  function bindSearch() {

    const input =
      $("searchInput");


    input?.addEventListener(
      "input",
      e => {

        applySearch(
          e.target.value
        );

      }
    );


    $("searchClear")
      ?.addEventListener(
        "click",
        () => {

          if (input) {

            input.value = "";

          }

          applySearch("");

        }
      );


    $("filter-icon")
      ?.addEventListener(
        "click",
        () => {

          const panel =
            $("filterPanel");

          if (!panel) return;


          EF.filterOpen =
            !EF.filterOpen;


          panel.hidden =
            !EF.filterOpen;


          $("filter-icon")
            ?.setAttribute(
              "aria-expanded",
              String(
                EF.filterOpen
              )
            );

        }
      );


    $("clearFilter")
      ?.addEventListener(
        "click",
        clearFilters
      );


    [
      "stageFilter",
      "typeFilter",
      "sizeFilter",
      "brandFilter"
    ]
      .forEach(
        id => {

          $(id)?.addEventListener(
            "change",
            applyFilters
          );

        }
      );

  }


  /* =======================================================
     EVENT BINDING
     ======================================================= */

  function bindEvents() {

    /* HAMBURGER */

    $("menuBtn")
      ?.addEventListener(
        "click",
        toggleDrawer
      );


    $("closeMenu")
      ?.addEventListener(
        "click",
        closeDrawer
      );


    $("drawerOverlay")
      ?.addEventListener(
        "click",
        closeDrawer
      );


    /* LANGUAGE */

    qsa(
      ".language-option"
    )
      .forEach(
        btn => {

          btn.addEventListener(
            "click",
            () => {

              EF.lang =
                btn.dataset.lang === "en"
                  ? "en"
                  : "hi";


              localStorage.setItem(
                STORAGE.lang,
                EF.lang
              );


              applyLanguage();

              populateFilters();

            }
          );

        }
      );


    /* THEME */

    $("themeButton")
      ?.addEventListener(
        "click",
        toggleTheme
      );


    $("settingsThemeButton")
      ?.addEventListener(
        "click",
        toggleTheme
      );


    /* DRAWER ROUTES */

    qsa(
      ".drawer-item[data-route]"
    )
      .forEach(
        btn => {

          btn.addEventListener(
            "click",
            () => {

              const route =
                btn.dataset.route;

              closeDrawer();


              if (
                route === "home"
              ) {

                goHome();

              } else if (
                route === "estimate"
              ) {

                setRoute(
                  "estimate"
                );

                showPage(
                  "estimate"
                );

                renderEstimate();

              } else if (
                route === "calculator"
              ) {

                setRoute(
                  "calculator"
                );

                showPage(
                  "calculator"
                );

                renderCalculator();

              } else if (
                route === "settings"
              ) {

                setRoute(
                  "settings"
                );

                showPage(
                  "settings"
                );

                renderSettings();

              }

            }
          );

        }
      );


    /* BOTTOM NAV */

    qsa(
      ".bottom-item[data-route]"
    )
      .forEach(
        btn => {

          btn.addEventListener(
            "click",
            () => {

              const route =
                btn.dataset.route;


              if (
                route === "home"
              ) {

                goHome();

              } else {

                setRoute(
                  route
                );

                showPage(
                  route
                );


                if (
                  route === "estimate"
                ) {

                  renderEstimate();

                }


                if (
                  route === "calculator"
                ) {

                  renderCalculator();

                }


                if (
                  route === "settings"
                ) {

                  renderSettings();

                }

              }

            }
          );

        }
      );


    /* MATERIAL BACK */

    $("materialBack")
      ?.addEventListener(
        "click",
        materialBack
      );


    /* EDITOR BACK */

    $("editorBack")
      ?.addEventListener(
        "click",
        editorBack
      );


    /* SAVE */

    $("saveItem")
      ?.addEventListener(
        "click",
        saveCurrentItem
      );


    /* NEXT */

    $("nextItem")
      ?.addEventListener(
        "click",
        goNextMaterial
      );


    /* CLEAR */

    $("clearItem")
      ?.addEventListener(
        "click",
        () => {

          clearEditor(true);

          showToast(
            EF.lang === "hi"
              ? "फॉर्म साफ हो गया"
              : "Form cleared"
          );

        }
      );


    /* FORM DRAFT */

    $("materialForm")
      ?.addEventListener(
        "input",
        saveEditorDraft
      );


    $("materialForm")
      ?.addEventListener(
        "change",
        saveEditorDraft
      );


    /* VIEW */

    $("viewTrigger")
      ?.addEventListener(
        "click",
        toggleViewOptions
      );


    qsa(
      "#viewOptions [data-view]"
    )
      .forEach(
        btn => {

          btn.addEventListener(
            "click",
            () =>
              setView(
                btn.dataset.view
              )
          );

        }
      );


    /* CALCULATOR */

    qsa(
      ".calculator-tab[data-calc]"
    )
      .forEach(
        btn => {

          btn.addEventListener(
            "click",
            () => {

              EF.calculator =
                btn.dataset.calc;


              qsa(
                ".calculator-tab"
              )
                .forEach(
                  b =>
                    b.classList.toggle(
                      "active",
                      b === btn
                    )
                );


              renderCalculator();

            }
          );

        }
      );


    /* RESET */

    $("resetApp")
      ?.addEventListener(
        "click",
        openResetModal
      );


    $("settingsReset")
      ?.addEventListener(
        "click",
        openResetModal
      );


    $("resetCancel")
      ?.addEventListener(
        "click",
        closeResetModal
      );


    $("resetConfirm")
      ?.addEventListener(
        "click",
        resetApp
      );


    /* ESCAPE */

    document.addEventListener(
      "keydown",
      e => {

        if (
          e.key === "Escape"
        ) {

          if (EF.drawerOpen) {

            closeDrawer();

            return;

          }


          if (EF.viewOpen) {

            EF.viewOpen = false;

            if ($("viewOptions")) {

              $("viewOptions").hidden =
                true;

            }

            return;

          }


          if (EF.filterOpen) {

            EF.filterOpen = false;

            if ($("filterPanel")) {

              $("filterPanel").hidden =
                true;

            }

            return;

          }

        }

      }
    );


    /* CLICK OUTSIDE VIEW */

    document.addEventListener(
      "click",
      e => {

        const selector =
          qs(".view-selector");


        if (
          EF.viewOpen &&
          selector &&
          !selector.contains(e.target)
        ) {

          EF.viewOpen = false;

          if ($("viewOptions")) {

            $("viewOptions").hidden =
              true;

          }

        }

      }
    );

  }


  /* =======================================================
     ANDROID / BROWSER BACK
     ======================================================= */

  function handleBack() {

    if (EF.drawerOpen) {

      closeDrawer();

      return;

    }


    if (EF.viewOpen) {

      EF.viewOpen = false;

      if ($("viewOptions")) {

        $("viewOptions").hidden =
          true;

      }

      return;

    }


    if (EF.filterOpen) {

      EF.filterOpen = false;

      if ($("filterPanel")) {

        $("filterPanel").hidden =
          true;

      }

      return;

    }


    if (EF.route === "editor") {

      editorBack();

      return;

    }


    if (
      EF.route === "material" &&
      EF.sectionIndex !== null
    ) {

      EF.sectionIndex = null;

      EF.materialIndex = null;

      saveRoute();

      renderSections(
        EF.stageIndex
      );

      showPage(
        "materialPage"
      );

      return;

    }


    if (
      EF.route === "material" &&
      EF.stageIndex !== null
    ) {

      goHome();

      return;

    }


    if (
      EF.route !== "home"
    ) {

      goHome();

      return;

    }

  }


  window.addEventListener(
    "popstate",
    () => {

      handleBack();

    }
  );


  /* =======================================================
     ESCAPE HTML
     ======================================================= */

  function escapeHTML(value) {

    return String(value ?? "")
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


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    loadStorage();


    restoreRoute();


    applyTheme();


    bindEvents();


    populateFilters();


    updateViewButton();


    applyLanguage();


    /*
     If saved route points to a valid stage,
     restore it.
    */

    if (
      EF.route === "material" &&
      EF.stageIndex !== null
    ) {

      if (
        EF.sectionIndex !== null
      ) {

        renderMaterials(
          EF.stageIndex,
          EF.sectionIndex
        );

      } else {

        renderSections(
          EF.stageIndex
        );

      }

      showPage(
        "materialPage"
      );

    } else if (
      EF.route === "editor" &&
      EF.stageIndex !== null &&
      EF.sectionIndex !== null &&
      EF.materialIndex !== null
    ) {

      const raw =
        getMaterial(
          EF.stageIndex,
          EF.sectionIndex,
          EF.materialIndex
        );


      if (raw) {

        showPage(
          "editorPage"
        );


        renderEditor(
          normalizeMaterial(raw),
          EF.stageIndex,
          EF.sectionIndex
        );

      } else {

        goHome(false);

      }

    } else {

      EF.route = "home";

      showPage("home");

      renderStages();

    }


    /*
     Browser history base state
    */

    try {

      history.replaceState(
        routeObject(),
        "",
        window.location.pathname +
        window.location.search +
        "#home"
      );

    } catch (e) {}


    /*
     Save draft whenever quantity/unit/brand/price
     changes.
    */

    [
      "quantityInput",
      "unitInput",
      "brandInput",
      "priceInput"
    ]
      .forEach(
        id => {

          $(id)?.addEventListener(
            "input",
            saveEditorDraft
          );

          $(id)?.addEventListener(
            "change",
            saveEditorDraft
          );

        }
      );

  }


  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.ElectroFixApp = {

    state: EF,

    init,

    home: goHome,

    openStage,

    openSection,

    openEditor,

    save: saveCurrentItem,

    next: goNextMaterial,

    previous: goPrevious,

    clear: clearEditor,

    estimate: renderEstimate,

    reset: resetApp

  };


  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }

})();
