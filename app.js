/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   ---------------------------------------------------------
   Works with:
   index.html
   config.js
   material.js

   MATERIALS structure:
   [
     STAGE,
     STAGE TITLE,
     MAIN SECTION,
     ITEMS,
     [SUB SECTION, ITEMS],
     [SUB SECTION, ITEMS],
     ...
   ]

   IMPORTANT:
   - material.js is NOT modified
   - Section index is stored
   - Item index is stored
   - Hindi / English UI
   - Stage navigation
   - Material navigation
   - Search
   - Filters
   - View modes
   - Estimate
   - Calculator
   - Theme
   - Language
   - Refresh state
   - Browser / Android back
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     STORAGE
     ======================================================= */

  const STORAGE = {
    lang: "sandeepMaterialLang",
    theme: "sandeepTheme",
    route: "sandeepEstimateRoute",
    estimate: "sandeepEstimateItems",
    materialView: "sandeepMaterialView",
    stageView: "sandeepStageView",
    unit: "sandeepLastUnit"
  };


  /* =======================================================
     DEFAULT STATE
     ======================================================= */

  let currentLang =
    localStorage.getItem(STORAGE.lang) || "hi";

  let currentTheme =
    localStorage.getItem(STORAGE.theme) || "dark";

  let currentStage = null;
  let currentSection = null;
  let currentItem = null;

  let currentMaterialView =
    localStorage.getItem(STORAGE.materialView) || "grid";

  let currentStageView =
    localStorage.getItem(STORAGE.stageView) || "grid";

  let searchText = "";

  let selectedFilters = {
    stage: "",
    type: "",
    size: "",
    brand: ""
  };

  let drawerOpen = false;
  let filterOpen = false;
  let viewOpen = false;

  let historyStack = [];

  let estimateItems = [];


  /* =======================================================
     TEXT
     ======================================================= */

  const TEXT = {

    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",

      search: "Material खोजें...",
      noResults: "कोई Material नहीं मिला",

      add: "एस्टिमेट में जोड़ें",
      update: "अपडेट करें",
      next: "अगला",
      back: "वापस",

      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",
      price: "कीमत",

      required: "आवश्यक",
      optional: "वैकल्पिक",

      select: "चुनें",
      enter: "दर्ज करें",

      added: "एस्टिमेट में जोड़ दिया गया",
      updated: "एस्टिमेट अपडेट हो गया",

      stage: "स्टेज",
      section: "सेक्शन",

      totalItems: "कुल आइटम",
      emptyEstimate: "एस्टिमेट खाली है",

      clear: "साफ करें",
      save: "सेव",
      edit: "एडिट",
      delete: "डिलीट",

      calculatorTitle: "Electrical Calculator",
      voltage: "Voltage",
      current: "Current",
      resistance: "Resistance",
      power: "Power",
      calculate: "Calculate",
      result: "Result",

      inverter: "Inverter 12V / 24V → 230V",

      close: "बंद करें",
      menu: "मेन्यू",

      dark: "डार्क मोड",
      light: "लाइट मोड",

      hindi: "हिन्दी",
      english: "English",

      stageView: "Stage View",
      materialView: "Material View",

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

      leaveTitle: "App बंद करें?",
      leaveText: "क्या आप App से बाहर जाना चाहते हैं?",
      yes: "हाँ",
      no: "नहीं"
    },

    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",

      search: "Search material...",
      noResults: "No material found",

      add: "Add to Estimate",
      update: "Update",
      next: "Next",
      back: "Back",

      quantity: "Quantity",
      unit: "Unit",
      brand: "Brand",
      price: "Price",

      required: "Required",
      optional: "Optional",

      select: "Select",
      enter: "Enter",

      added: "Added to estimate",
      updated: "Estimate updated",

      stage: "Stage",
      section: "Section",

      totalItems: "Total Items",
      emptyEstimate: "Estimate is empty",

      clear: "Clear",
      save: "Save",
      edit: "Edit",
      delete: "Delete",

      calculatorTitle: "Electrical Calculator",
      voltage: "Voltage",
      current: "Current",
      resistance: "Resistance",
      power: "Power",
      calculate: "Calculate",
      result: "Result",

      inverter: "Inverter 12V / 24V → 230V",

      close: "Close",
      menu: "Menu",

      dark: "Dark Mode",
      light: "Light Mode",

      hindi: "हिन्दी",
      english: "English",

      stageView: "Stage View",
      materialView: "Material View",

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

      leaveTitle: "Close App?",
      leaveText: "Do you want to leave the app?",
      yes: "Yes",
      no: "No"
    }

  };


  /* =======================================================
     DOM
     ======================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));


  const home =
    $("#home");

  const stageGrid =
    $("#stageGrid");

  const searchInput =
    $("#main");

  const filterPanel =
    $("#filterPanel");

  const stageFilter =
    $("#stageFilter");

  const typeFilter =
    $("#typeFilter");

  const sizeFilter =
    $("#sizeFilter");

  const brandFilter =
    $("#brandFilter");

  const resultsInfo =
    $("#resultsInfo");

  const noResults =
    $("#noResults");

  const toast =
    $("#toast");

  const drawer =
    $("#drawer");

  const drawerOverlay =
    $("#drawerOverlay");

  const menuBtn =
    $("#menuBtn");

  const filterBtn =
    $("#filter-icon");

  const clearFilterBtn =
    $("#clearFilter");

  const viewTrigger =
    $("#viewTrigger");

  const viewOptions =
    $("#viewOptions");

  const themeButton =
    $("#themeButton");

  const themeIcon =
    $("#themeIcon");

  const themeTitle =
    $("#themeTitle");

  const themeState =
    $("#themeState");


  /* =======================================================
     SAFETY
     ======================================================= */

  if (!Array.isArray(window.MATERIALS)) {
    console.error(
      "MATERIALS not found. Check material.js loading order."
    );
    return;
  }


  /* =======================================================
     LANGUAGE HELPERS
     ======================================================= */

  function t(key) {
    return (
      TEXT[currentLang] &&
      TEXT[currentLang][key]
    ) || key;
  }


  const DICT = {

    "Pipe": "पाइप",
    "Bend": "बेंड",
    "Junction Box": "जंक्शन बॉक्स",
    "Fan Box": "फैन बॉक्स",
    "Concealed Light Box": "कन्सील्ड लाइट बॉक्स",

    "Installation Material": "इंस्टॉलेशन सामग्री",
    "Pulling Material": "पुलिंग सामग्री",
    "MCB & Protection": "MCB और प्रोटेक्शन",
    "Fan & Ceiling": "फैन और सीलिंग",
    "Lighting": "लाइटिंग",
    "Installation & Finishing": "इंस्टॉलेशन और फिनिशिंग",
    "Installation & Fastening": "इंस्टॉलेशन और फास्टनिंग",

    "Conduit & Box": "कंड्यूट और बॉक्स",
    "Wiring Material": "वायरिंग सामग्री",
    "Switch & Socket": "स्विच और सॉकेट",
    "Wiring & Conduit": "वायरिंग और कंड्यूट",

    "Size": "साइज़",
    "Type": "टाइप",
    "Sub Type": "सब टाइप",
    "Conduit Size": "कंड्यूट साइज़",
    "Shape / Ways": "शेप / वे",
    "Material": "मटेरियल",
    "Depth": "डेप्थ",
    "Ways": "वे",
    "Hook Rod": "हुक रॉड",
    "Diameter": "डायमीटर",
    "Material Type": "मटेरियल टाइप",
    "Module": "मॉड्यूल",
    "Phase Selection": "फेज़",
    "Door Type": "डोर टाइप",
    "Material Type": "मटेरियल टाइप",

    "Colour": "रंग",
    "Color": "रंग",
    "Pack Size": "पैक साइज़",
    "Pack Size (Weight)": "पैक साइज़",
    "Gauge / Size": "गेज / साइज़",
    "Size (Length)": "लंबाई",
    "Size (Width)": "चौड़ाई",
    "Size (Width × Length)": "साइज़",
    "Size (Diameter × Length)": "साइज़",
    "Size (Cable Size × Stud Size)": "केबल / स्टड साइज़",

    "Amp": "एम्पियर",
    "Curve": "कर्व",
    "Door": "डोर",
    "Sensitivity": "सेंसिटिविटी",
    "Voltage": "वोल्टेज",
    "Wattage": "वॉटेज",
    "Base": "बेस",
    "Colour Temp": "कलर टेम्परेचर",
    "Mounting": "माउंटिंग",
    "Shape": "शेप",
    "Movement": "मूवमेंट",
    "Beam Angle": "बीम एंगल",
    "Body Finish": "बॉडी फिनिश",
    "Density": "डेंसिटी",
    "Length": "लंबाई",
    "Supply Voltage": "सप्लाई वोल्टेज",
    "Dimensions (W × D)": "डायमेंशन",
    "Diffuser": "डिफ्यूज़र",
    "Output Voltage": "आउटपुट वोल्टेज",
    "Type": "टाइप",
    "Size (Weight)": "वज़न",
    "Length": "लंबाई",

    "Size / Diameter": "साइज़ / डायमीटर",

    "Power": "पावर",
    "Current": "करंट",
    "Resistance": "रेज़िस्टेंस"
  };


  function translate(value) {
    if (!value) return "";

    if (currentLang === "en") {
      return value;
    }

    return DICT[value] || value;
  }


  function bilingual(value) {
    if (!value) return "";

    if (currentLang === "en") {
      return value;
    }

    const hindi = DICT[value];

    if (hindi && hindi !== value) {
      return `${hindi} / ${value}`;
    }

    return value;
  }


  /* =======================================================
     MATERIAL PARSER
     ======================================================= */

  function getStage(stageNumber) {

    return window.MATERIALS.find(
      stage => {

        if (!Array.isArray(stage)) {
          return false;
        }

        return (
          String(stage[0])
            .replace(/\D/g, "") ===
          String(stageNumber)
        );

      }
    ) || null;

  }


  function getStageSections(stageNumber) {

    const stage = getStage(stageNumber);

    if (!stage) {
      return [];
    }

    const sections = [];

    /*
      stage[2] = first/main section name
      stage[3] = first/main section items

      stage[4+] = [sectionName, items]
    */

    if (
      typeof stage[2] === "string" &&
      Array.isArray(stage[3])
    ) {

      sections.push({
        index: 0,
        name: stage[2],
        items: stage[3]
      });

    }


    for (
      let i = 4;
      i < stage.length;
      i++
    ) {

      const section = stage[i];

      if (
        Array.isArray(section) &&
        typeof section[0] === "string" &&
        Array.isArray(section[1])
      ) {

        sections.push({
          index: sections.length,
          name: section[0],
          items: section[1]
        });

      }

    }

    return sections;
  }


  function getItem(
    stageNumber,
    sectionIndex,
    itemIndex
  ) {

    const sections =
      getStageSections(stageNumber);

    const section =
      sections[sectionIndex];

    if (!section) {
      return null;
    }

    const item =
      section.items[itemIndex];

    if (!Array.isArray(item)) {
      return null;
    }

    return item;
  }


  function getAllItems() {

    const result = [];

    window.MATERIALS.forEach(
      (stage, stageArrayIndex) => {

        if (!Array.isArray(stage)) {
          return;
        }

        const stageNumber =
          String(stage[0])
            .replace(/\D/g, "");

        const stageTitle =
          stage[1] || "";

        const sections =
          getStageSections(stageNumber);

        sections.forEach(
          (section, sectionIndex) => {

            section.items.forEach(
              (item, itemIndex) => {

                if (!Array.isArray(item)) {
                  return;
                }

                result.push({
                  stageNumber,
                  stageArrayIndex,
                  stageTitle,
                  sectionIndex,
                  sectionName: section.name,
                  itemIndex,
                  item
                });

              }
            );

          }
        );

      }
    );

    return result;
  }


  /* =======================================================
     ITEM HELPERS
     ======================================================= */

  function itemName(item) {
    return Array.isArray(item)
      ? String(item[0] || "")
      : "";
  }


  function itemFields(item) {
    return Array.isArray(item) &&
      Array.isArray(item[1])
      ? item[1]
      : [];
  }


  function itemUnits(item) {
    return Array.isArray(item) &&
      Array.isArray(item[2])
      ? item[2]
      : [];
  }


  function itemBrands(item) {
    return Array.isArray(item) &&
      Array.isArray(item[3])
      ? item[3]
      : [];
  }


  /* =======================================================
     STAGE CARDS
     ======================================================= */

  function renderStageCards() {

    if (!stageGrid) return;

    const allItems =
      getAllItems();

    const stageMap = {};

    allItems.forEach(data => {

      if (!stageMap[data.stageNumber]) {
        stageMap[data.stageNumber] = {
          count: 0,
          title: data.stageTitle
        };
      }

      stageMap[data.stageNumber].count++;

    });


    const existingCards =
      $$(".stage-card", stageGrid);


    if (existingCards.length) {

      existingCards.forEach(card => {

        const number =
          String(
            card.dataset.stage || ""
          );

        const data =
          stageMap[number];

        if (!data) return;

        const count =
          $(".stage-count", card);

        const title =
          $(".stage-title", card);

        if (title) {

          if (currentLang === "hi") {

            title.innerHTML =
              `<span>${translate(data.title)}</span>
               <small>${data.title}</small>`;

          } else {

            title.innerHTML =
              `<span>${data.title}</span>`;

          }

        }

        if (count) {

          count.textContent =
            `${data.count} ${currentLang === "hi" ? "आइटम" : "items"}`;

        }

        card.dataset.search =
          `${number} ${data.title} ${data.title.toLowerCase()}`;

      });

      attachStageEvents();

      applyStageSearch();

      return;
    }


    stageGrid.innerHTML = "";

    Object.keys(stageMap)
      .sort(
        (a, b) =>
          Number(a) - Number(b)
      )
      .forEach(stageNumber => {

        const data =
          stageMap[stageNumber];

        const card =
          document.createElement("div");

        card.className =
          "stage-card";

        card.dataset.stage =
          stageNumber;

        card.dataset.search =
          `${stageNumber} ${data.title}`;

        card.innerHTML = `

          <div class="stage-title">
            ${
              currentLang === "hi"
                ? `<span>${translate(data.title)}</span>
                   <small>${data.title}</small>`
                : `<span>${data.title}</span>`
            }
          </div>

          <div class="stage-count">
            ${data.count}
            ${currentLang === "hi" ? "आइटम" : "items"}
          </div>

        `;

        stageGrid.appendChild(card);

      });


    attachStageEvents();

    applyStageSearch();
  }


  function attachStageEvents() {

    $$(".stage-card", stageGrid)
      .forEach(card => {

        if (card.dataset.appBound === "1") {
          return;
        }

        card.dataset.appBound = "1";

        card.addEventListener(
          "click",
          () => {

            const stage =
              Number(card.dataset.stage);

            openStage(stage);

          }
        );

      });

  }


  /* =======================================================
     STAGE SEARCH
     ======================================================= */

  function applyStageSearch() {

    if (!stageGrid) return;

    const query =
      String(searchText || "")
        .trim()
        .toLowerCase();

    let visible = 0;

    $$(".stage-card", stageGrid)
      .forEach(card => {

        const stage =
          Number(card.dataset.stage);

        const allItems =
          getAllItems()
            .filter(
              x =>
                Number(x.stageNumber) === stage
            );

        const haystack = [

          card.dataset.search || "",

          ...allItems.map(x => {

            const item = x.item;

            return [
              itemName(item),
              x.sectionName,
              ...itemFields(item).flatMap(
                field =>
                  Array.isArray(field)
                    ? [
                        field[0],
                        ...(Array.isArray(field[1])
                          ? field[1]
                          : [])
                      ]
                    : []
              ),
              ...itemBrands(item)
            ].join(" ");

          })

        ]
          .join(" ")
          .toLowerCase();


        const match =
          !query ||
          haystack.includes(query);


        let filterMatch = true;


        if (
          selectedFilters.stage &&
          String(stage) !==
          String(selectedFilters.stage)
        ) {

          filterMatch = false;

        }


        if (
          selectedFilters.type
        ) {

          filterMatch =
            filterMatch &&
            allItems.some(
              x =>
                x.sectionName
                  .toLowerCase()
                  .includes(
                    selectedFilters.type.toLowerCase()
                  )
            );

        }


        if (
          selectedFilters.size
        ) {

          filterMatch =
            filterMatch &&
            allItems.some(
              x => {

                return itemFields(x.item)
                  .some(field => {

                    if (
                      !Array.isArray(field)
                    ) {
                      return false;
                    }

                    const options =
                      Array.isArray(field[1])
                        ? field[1]
                        : [];

                    return options.some(
                      option =>
                        String(option)
                          .toLowerCase()
                          .includes(
                            selectedFilters.size
                              .toLowerCase()
                          )
                    );

                  });

              }
            );

        }


        if (
          selectedFilters.brand
        ) {

          filterMatch =
            filterMatch &&
            allItems.some(
              x =>
                itemBrands(x.item)
                  .some(
                    brand =>
                      String(brand)
                        .toLowerCase()
                        .includes(
                          selectedFilters.brand
                            .toLowerCase()
                        )
                  )
            );

        }


        const show =
          match && filterMatch;

        card.style.display =
          show ? "" : "none";

        if (show) {
          visible++;
        }

      });


    if (noResults) {

      noResults.style.display =
        visible === 0
          ? ""
          : "none";

    }

    updateResultsInfo(visible);

  }


  function updateResultsInfo(count) {

    if (!resultsInfo) return;

    const total =
      getAllItems().length;

    resultsInfo.textContent =
      currentLang === "hi"
        ? `${count} Stage दिखाई जा रही हैं • ${total} Material`
        : `${count} stages shown • ${total} materials`;

  }


  /* =======================================================
     OPEN STAGE
     ======================================================= */

  function openStage(stageNumber) {

    const stage =
      getStage(stageNumber);

    if (!stage) {
      showToast(
        currentLang === "hi"
          ? "Stage नहीं मिली"
          : "Stage not found"
      );
      return;
    }

    saveRoute({
      page: "stage",
      stageIndex: Number(stageNumber),
      sectionIndex: 0,
      itemIndex: 0
    });


    historyStack.push({
      page: "home"
    });


    renderStagePage(
      Number(stageNumber)
    );

  }


  /* =======================================================
     STAGE PAGE
     ======================================================= */

  function renderStagePage(stageNumber) {

    currentStage =
      Number(stageNumber);

    currentSection = null;
    currentItem = null;

    const stage =
      getStage(stageNumber);

    const sections =
      getStageSections(stageNumber);


    if (!home) return;


    home.innerHTML = `

      <div class="app-page stage-page">

        <div class="page-header">

          <button
            type="button"
            class="internal-back"
            id="stageBackBtn"
          >
            ← ${t("back")}
          </button>

          <div class="page-title">
            <strong>
              ${currentLang === "hi"
                ? translate(stage[1])
                : stage[1]}
            </strong>

            ${
              currentLang === "hi"
                ? `<small>${stage[1]}</small>`
                : ""
            }
          </div>

          <button
            type="button"
            class="internal-view-btn"
            id="stageViewBtn"
          >
            ◈
          </button>

        </div>


        <div
          class="stage-section-list ${getViewClass(currentStageView)}"
          id="sectionList"
        >

          ${sections.map(
            (section, index) => `

              <div
                class="material-section-card"
                data-section="${index}"
              >

                <div class="section-number">
                  ${index + 1}
                </div>

                <div class="section-content">

                  <div class="section-title">
                    ${
                      currentLang === "hi"
                        ? translate(section.name)
                        : section.name
                    }
                  </div>

                  ${
                    currentLang === "hi"
                      ? `<div class="section-subtitle">
                           ${section.name}
                         </div>`
                      : ""
                  }

                  <div class="section-count">
                    ${section.items.length}
                    ${
                      currentLang === "hi"
                        ? " Materials"
                        : " materials"
                    }
                  </div>

                </div>

                <div class="section-arrow">
                  →
                </div>

              </div>

            `
          ).join("")}

        </div>

      </div>

    `;


    $("#stageBackBtn")
      ?.addEventListener(
        "click",
        () => goBack()
      );


    $("#stageViewBtn")
      ?.addEventListener(
        "click",
        () => openStageViewSelector()
      );


    $$(".material-section-card")
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            const section =
              Number(card.dataset.section);

            openSection(
              stageNumber,
              section
            );

          }
        );

      });

  }


  /* =======================================================
     OPEN SECTION
     ======================================================= */

  function openSection(
    stageNumber,
    sectionIndex
  ) {

    const sections =
      getStageSections(stageNumber);

    const section =
      sections[sectionIndex];

    if (!section) return;


    historyStack.push({
      page: "stage",
      stageIndex: stageNumber
    });


    saveRoute({
      page: "section",
      stageIndex: Number(stageNumber),
      sectionIndex: Number(sectionIndex),
      itemIndex: 0
    });


    renderMaterialList(
      stageNumber,
      sectionIndex
    );

  }


  /* =======================================================
     MATERIAL LIST
     ======================================================= */

  function renderMaterialList(
    stageNumber,
    sectionIndex
  ) {

    currentStage =
      Number(stageNumber);

    currentSection =
      Number(sectionIndex);

    currentItem = null;


    const stage =
      getStage(stageNumber);

    const sections =
      getStageSections(stageNumber);

    const section =
      sections[sectionIndex];


    if (!section || !home) return;


    home.innerHTML = `

      <div class="app-page material-list-page">

        <div class="page-header">

          <button
            type="button"
            class="internal-back"
            id="materialBackBtn"
          >
            ← ${t("back")}
          </button>

          <div class="page-title">

            <strong>
              ${
                currentLang === "hi"
                  ? translate(section.name)
                  : section.name
              }
            </strong>

            <small>
              ${
                currentLang === "hi"
                  ? translate(stage[1])
                  : stage[1]
              }
            </small>

          </div>

          <button
            type="button"
            class="internal-view-btn"
            id="materialViewBtn"
          >
            ◈
          </button>

        </div>


        <div
          class="material-grid ${getViewClass(currentMaterialView)}"
          id="materialGrid"
        >

          ${section.items.map(
            (item, index) =>
              renderMaterialCard(
                item,
                index
              )
          ).join("")}

        </div>

      </div>

    `;


    $("#materialBackBtn")
      ?.addEventListener(
        "click",
        () => goBack()
      );


    $("#materialViewBtn")
      ?.addEventListener(
        "click",
        () => openMaterialViewSelector()
      );


    $$(".material-card")
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            const itemIndex =
              Number(card.dataset.item);

            openItem(
              stageNumber,
              sectionIndex,
              itemIndex
            );

          }
        );

      });

  }


  function renderMaterialCard(
    item,
    index
  ) {

    const name =
      itemName(item);

    return `

      <div
        class="material-card"
        data-item="${index}"
      >

        <div class="material-icon">
          ⚡
        </div>

        <div class="material-name">

          ${
            currentLang === "hi"
              ? translate(name)
              : name
          }

        </div>

        ${
          currentLang === "hi"
            ? `<div class="material-name-en">
                 ${name}
               </div>`
            : ""
        }

        <div class="material-arrow">
          →
        </div>

      </div>

    `;

  }


  /* =======================================================
     OPEN ITEM
     ======================================================= */

  function openItem(
    stageNumber,
    sectionIndex,
    itemIndex,
    options = {}
  ) {

    const item =
      getItem(
        stageNumber,
        sectionIndex,
        itemIndex
      );

    if (!item) return;


    if (!options.fromEdit) {

      historyStack.push({
        page: "section",
        stageIndex: Number(stageNumber),
        sectionIndex: Number(sectionIndex)
      });

    }


    currentStage =
      Number(stageNumber);

    currentSection =
      Number(sectionIndex);

    currentItem =
      Number(itemIndex);


    saveRoute({
      page: "item",
      stageIndex: Number(stageNumber),
      sectionIndex: Number(sectionIndex),
      itemIndex: Number(itemIndex)
    });


    renderItemEditor(
      stageNumber,
      sectionIndex,
      itemIndex,
      options
    );

  }


  /* =======================================================
     ITEM EDITOR
     ======================================================= */

  function renderItemEditor(
    stageNumber,
    sectionIndex,
    itemIndex,
    options = {}
  ) {

    const item =
      getItem(
        stageNumber,
        sectionIndex,
        itemIndex
      );

    if (!item || !home) return;


    const editingId =
      options.editingId || null;

    const existing =
      editingId
        ? estimateItems.find(
            x =>
              String(x.id) ===
              String(editingId)
          )
        : null;


    const fields =
      itemFields(item);

    const units =
      itemUnits(item);

    const brands =
      itemBrands(item);


    const savedValues =
      existing?.values || {};

    const savedUnit =
      existing?.unit ||
      localStorage.getItem(
        STORAGE.unit
      ) ||
      units[0] ||
      "";


    home.innerHTML = `

      <div class="app-page item-editor-page">

        <div class="page-header">

          <button
            type="button"
            class="internal-back"
            id="editorBackBtn"
          >
            ← ${t("back")}
          </button>

          <div class="page-title">

            <strong>
              ${
                currentLang === "hi"
                  ? translate(itemName(item))
                  : itemName(item)
              }
            </strong>

            <small>
              ${
                currentLang === "hi"
                  ? translate(
                      getStage(stageNumber)?.[1]
                    )
                  : getStage(stageNumber)?.[1]
              }
            </small>

          </div>

        </div>


        <div class="item-editor">

          <div class="editor-section">

            ${
              fields.map(
                (field, index) =>
                  renderField(
                    field,
                    index,
                    savedValues
                  )
              ).join("")
            }


            <div class="form-group">

              <label>
                ${t("quantity")}
                <span class="required">*</span>
              </label>

              <div class="quantity-control">

                <button
                  type="button"
                  class="qty-btn"
                  id="qtyMinus"
                >
                  −
                </button>

                <input
                  type="number"
                  id="itemQuantity"
                  min="1"
                  step="1"
                  inputmode="numeric"
                  value="${
                    existing?.quantity || 1
                  }"
                >

                <button
                  type="button"
                  class="qty-btn"
                  id="qtyPlus"
                >
                  +
                </button>

              </div>

            </div>


            <div class="form-group">

              <label>
                ${t("unit")}
                <span class="optional">
                  (${t("optional")})
                </span>
              </label>

              <select
                id="itemUnit"
              >

                <option value="">
                  ${t("select")}
                </option>

                ${units.map(
                  unit =>
                    `<option
                      value="${escapeHtml(unit)}"
                      ${
                        String(unit) ===
                        String(savedUnit)
                          ? "selected"
                          : ""
                      }
                    >
                      ${escapeHtml(unit)}
                    </option>`
                ).join("")}

              </select>

            </div>


            ${
              brands.length
                ? `

                  <div class="form-group">

                    <label>
                      ${t("brand")}
                      <span class="optional">
                        (${t("optional")})
                      </span>
                    </label>

                    <select
                      id="itemBrand"
                    >

                      <option value="">
                        ${t("select")}
                      </option>

                      ${brands.map(
                        brand =>
                          `<option
                            value="${escapeHtml(brand)}"
                            ${
                              String(brand) ===
                              String(
                                existing?.brand || ""
                              )
                                ? "selected"
                                : ""
                            }
                          >
                            ${escapeHtml(brand)}
                          </option>`
                      ).join("")}

                    </select>

                  </div>

                `
                : ""
            }


            <div
              class="form-group price-group"
              style="display:none"
            >

              <label>
                ${t("price")}
              </label>

              <input
                type="number"
                id="itemPrice"
                min="0"
                step="0.01"
                value="${
                  existing?.price || ""
                }"
              >

            </div>


            <button
              type="button"
              class="primary-action"
              id="addItemBtn"
            >
              ${
                existing
                  ? t("update")
                  : t("add")
              }
            </button>


            <button
              type="button"
              class="secondary-action"
              id="nextItemBtn"
            >
              ${t("next")} →
            </button>

          </div>

        </div>

      </div>

    `;


    bindEditorEvents(
      stageNumber,
      sectionIndex,
      itemIndex,
      editingId
    );

  }


  /* =======================================================
     RENDER FIELD
     ======================================================= */

  function renderField(
    field,
    fieldIndex,
    savedValues
  ) {

    if (!Array.isArray(field)) {
      return "";
    }

    const label =
      String(field[0] || "");

    const options =
      Array.isArray(field[1])
        ? field[1]
        : [];


    const saved =
      savedValues[label] || "";


    return `

      <div
        class="form-group dynamic-field"
        data-field-index="${fieldIndex}"
      >

        <label>
          ${bilingual(label)}

          <span class="optional">
            (${t("optional")})
          </span>
        </label>

        <div class="field-control">

          <select
            class="dynamic-select"
            data-field="${escapeHtml(label)}"
          >

            <option value="">
              ${t("select")}
            </option>

            ${options.map(
              option =>
                `<option
                  value="${escapeHtml(option)}"
                  ${
                    String(option) ===
                    String(saved)
                      ? "selected"
                      : ""
                  }
                >
                  ${escapeHtml(option)}
                </option>`
            ).join("")}

          </select>

          <button
            type="button"
            class="field-clear"
            title="${t("clear")}"
          >
            ×
          </button>

        </div>

      </div>

    `;

  }


  /* =======================================================
     EDITOR EVENTS
     ======================================================= */

  function bindEditorEvents(
    stageNumber,
    sectionIndex,
    itemIndex,
    editingId
  ) {

    $("#editorBackBtn")
      ?.addEventListener(
        "click",
        () => {

          if (editingId) {

            renderEstimate();

            return;

          }

          goBack();

        }
      );


    $("#qtyMinus")
      ?.addEventListener(
        "click",
        () => {

          const input =
            $("#itemQuantity");

          let value =
            Number(input.value || 1);

          value--;

          if (value < 1) {
            value = 1;
          }

          input.value = value;

        }
      );


    $("#qtyPlus")
      ?.addEventListener(
        "click",
        () => {

          const input =
            $("#itemQuantity");

          let value =
            Number(input.value || 1);

          value++;

          input.value = value;

        }
      );


    $$(".field-clear")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const select =
              button.parentElement
                ?.querySelector(
                  ".dynamic-select"
                );

            if (select) {
              select.value = "";
            }

          }
        );

      });


    $("#addItemBtn")
      ?.addEventListener(
        "click",
        () => {

          saveEstimateItem(
            stageNumber,
            sectionIndex,
            itemIndex,
            editingId
          );

        }
      );


    $("#nextItemBtn")
      ?.addEventListener(
        "click",
        () => {

          openNextItem(
            stageNumber,
            sectionIndex,
            itemIndex
          );

        }
      );

  }


  /* =======================================================
     SAVE ESTIMATE ITEM
     ======================================================= */

  function saveEstimateItem(
    stageNumber,
    sectionIndex,
    itemIndex,
    editingId
  ) {

    const item =
      getItem(
        stageNumber,
        sectionIndex,
        itemIndex
      );

    if (!item) return;


    const quantityInput =
      $("#itemQuantity");

    const quantity =
      Number(
        quantityInput?.value || 0
      );


    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {

      showToast(
        currentLang === "hi"
          ? "Quantity डालना जरूरी है"
          : "Quantity is required"
      );

      quantityInput?.focus();

      return;

    }


    const values = {};

    $$(".dynamic-select")
      .forEach(select => {

        const field =
          select.dataset.field;

        values[field] =
          select.value || "";

      });


    const unit =
      $("#itemUnit")?.value || "";

    const brand =
      $("#itemBrand")?.value || "";

    const price =
      $("#itemPrice")?.value || "";


    const data = {

      id:
        editingId ||
        createId(),

      stageIndex:
        Number(stageNumber),

      sectionIndex:
        Number(sectionIndex),

      itemIndex:
        Number(itemIndex),

      name:
        itemName(item),

      sectionName:
        getStageSections(
          stageNumber
        )[sectionIndex]?.name || "",

      stageTitle:
        getStage(stageNumber)?.[1] || "",

      values,

      quantity,

      unit,

      brand,

      price,

      createdAt:
        editingId
          ? (
              estimateItems.find(
                x =>
                  String(x.id) ===
                  String(editingId)
              )?.createdAt ||
              Date.now()
            )
          : Date.now()

    };


    if (editingId) {

      const index =
        estimateItems.findIndex(
          x =>
            String(x.id) ===
            String(editingId)
        );

      if (index !== -1) {

        estimateItems[index] =
          data;

      }

      showToast(
        t("updated")
      );

    } else {

      estimateItems.push(data);

      showToast(
        t("added")
      );

    }


    if (unit) {

      localStorage.setItem(
        STORAGE.unit,
        unit
      );

    }


    saveEstimate();

    setTimeout(
      () => {

        openNextItem(
          stageNumber,
          sectionIndex,
          itemIndex
        );

      },
      250
    );

  }


  /* =======================================================
     NEXT ITEM
     ======================================================= */

  function openNextItem(
    stageNumber,
    sectionIndex,
    itemIndex
  ) {

    const sections =
      getStageSections(stageNumber);

    const section =
      sections[sectionIndex];

    if (!section) return;


    const nextIndex =
      Number(itemIndex) + 1;


    if (
      nextIndex <
      section.items.length
    ) {

      openItem(
        stageNumber,
        sectionIndex,
        nextIndex
      );

      scrollTop();

      return;

    }


    /*
      Current section complete.
      Move to next section if available.
    */

    const nextSection =
      Number(sectionIndex) + 1;


    if (
      nextSection <
      sections.length
    ) {

      openSection(
        stageNumber,
        nextSection
      );

      return;

    }


    /*
      Current stage complete.
      Move to next stage.
    */

    const nextStage =
      Number(stageNumber) + 1;


    if (getStage(nextStage)) {

      openStage(nextStage);

      showToast(
        currentLang === "hi"
          ? "अगले Stage पर जा रहे हैं"
          : "Moving to next stage"
      );

      return;

    }


    showToast(
      currentLang === "hi"
        ? "यह आखिरी Material है"
        : "This is the last material"
    );

  }


  /* =======================================================
     ESTIMATE STORAGE
     ======================================================= */

  function loadEstimate() {

    try {

      const data =
        JSON.parse(
          localStorage.getItem(
            STORAGE.estimate
          ) || "[]"
        );

      estimateItems =
        Array.isArray(data)
          ? data
          : [];

    } catch (error) {

      console.error(
        "Estimate load error:",
        error
      );

      estimateItems = [];

    }

  }


  function saveEstimate() {

    try {

      localStorage.setItem(
        STORAGE.estimate,
        JSON.stringify(
          estimateItems
        )
      );

    } catch (error) {

      console.error(
        "Estimate save error:",
        error
      );

    }

  }


  function createId() {

    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .slice(2)
    );

  }


  /* =======================================================
     ESTIMATE PAGE
     ======================================================= */

  function renderEstimate() {

    historyStack.push({
      page: "home"
    });


    if (!home) return;


    home.innerHTML = `

      <div class="app-page estimate-page">

        <div class="page-header">

          <button
            type="button"
            class="internal-back"
            id="estimateBackBtn"
          >
            ← ${t("back")}
          </button>

          <div class="page-title">
            <strong>
              ${t("estimate")}
            </strong>
          </div>

        </div>


        <div
          class="estimate-list"
          id="estimateList"
        >

          ${
            estimateItems.length
              ? estimateItems
                  .map(
                    item =>
                      renderEstimateCard(
                        item
                      )
                  )
                  .join("")
              : `
                <div class="empty-estimate">
                  ${t("emptyEstimate")}
                </div>
              `
          }

        </div>

      </div>

    `;


    $("#estimateBackBtn")
      ?.addEventListener(
        "click",
        () => goBack()
      );


    $$(".estimate-card")
      .forEach(card => {

        const id =
          card.dataset.id;

        $(".estimate-edit", card)
          ?.addEventListener(
            "click",
            () =>
              editEstimate(id)
          );


        $(".estimate-delete", card)
          ?.addEventListener(
            "click",
            () =>
              deleteEstimate(id)
          );

      });

  }


  function renderEstimateCard(data) {

    const name =
      data.name || "";

    const stage =
      data.stageTitle || "";

    const section =
      data.sectionName || "";


    const values =
      Object.entries(
        data.values || {}
      )
      .filter(
        ([, value]) =>
          value !== ""
      );


    return `

      <div
        class="estimate-card"
        data-id="${escapeHtml(data.id)}"
      >

        <div class="estimate-card-head">

          <strong>
            ${
              currentLang === "hi"
                ? translate(name)
                : name
            }
          </strong>

          <span>
            × ${data.quantity || 1}
          </span>

        </div>


        <div class="estimate-meta">

          <span>
            ${stage}
          </span>

          <span>
            ${section}
          </span>

        </div>


        ${
          values.length
            ? `
              <div class="estimate-values">

                ${values.map(
                  ([key, value]) =>
                    `<div>
                       <b>${bilingual(key)}:</b>
                       ${escapeHtml(value)}
                     </div>`
                ).join("")}

              </div>
            `
            : ""
        }


        <div class="estimate-meta">

          ${
            data.unit
              ? `<span>
                   ${t("unit")}: ${escapeHtml(data.unit)}
                 </span>`
              : ""
          }

          ${
            data.brand
              ? `<span>
                   ${t("brand")}: ${escapeHtml(data.brand)}
                 </span>`
              : ""
          }

        </div>


        <div class="estimate-actions">

          <button
            type="button"
            class="estimate-edit"
          >
            ${t("edit")}
          </button>

          <button
            type="button"
            class="estimate-delete"
          >
            ${t("delete")}
          </button>

        </div>

      </div>

    `;

  }


  /* =======================================================
     EDIT ESTIMATE
     ======================================================= */

  function editEstimate(id) {

    const data =
      estimateItems.find(
        item =>
          String(item.id) ===
          String(id)
      );

    if (!data) return;


    historyStack.push({
      page: "estimate"
    });


    openItem(
      data.stageIndex,
      data.sectionIndex,
      data.itemIndex,
      {
        fromEdit: true,
        editingId: data.id
      }
    );

  }


  /* =======================================================
     DELETE ESTIMATE
     ======================================================= */

  function deleteEstimate(id) {

    const index =
      estimateItems.findIndex(
        item =>
          String(item.id) ===
          String(id)
      );

    if (index === -1) return;


    estimateItems.splice(
      index,
      1
    );

    saveEstimate();

    renderEstimate();

    showToast(
      currentLang === "hi"
        ? "Item delete हो गया"
        : "Item deleted"
    );

  }


  /* =======================================================
     HOME
     ======================================================= */

  function renderHome() {

    /*
      Restore original static HTML if
      stage grid exists.
    */

    locationReloadHomeIfNeeded();

  }


  function locationReloadHomeIfNeeded() {

    /*
      Current HTML already contains:
      #stageGrid
      #main
      filters etc.

      Do not destroy those elements.
    */

    renderStageCards();

    bindHomeEvents();

  }


  /* =======================================================
     HOME EVENTS
     ======================================================= */

  function bindHomeEvents() {

    if (searchInput) {

      searchInput.value =
        searchText || "";

      searchInput.placeholder =
        t("search");

      if (
        searchInput.dataset.appBound !== "1"
      ) {

        searchInput.dataset.appBound =
          "1";

        searchInput.addEventListener(
          "input",
          event => {

            searchText =
              event.target.value || "";

            applyStageSearch();

          }
        );

      }

    }


    if (
      filterBtn &&
      filterBtn.dataset.appBound !== "1"
    ) {

      filterBtn.dataset.appBound =
        "1";

      filterBtn.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          toggleFilterPanel();

        }
      );

    }


    if (
      clearFilterBtn &&
      clearFilterBtn.dataset.appBound !== "1"
    ) {

      clearFilterBtn.dataset.appBound =
        "1";

      clearFilterBtn.addEventListener(
        "click",
        clearFilters
      );

    }


    bindFilterSelect(
      stageFilter,
      "stage"
    );

    bindFilterSelect(
      typeFilter,
      "type"
    );

    bindFilterSelect(
      sizeFilter,
      "size"
    );

    bindFilterSelect(
      brandFilter,
      "brand"
    );


    if (
      viewTrigger &&
      viewTrigger.dataset.appBound !== "1"
    ) {

      viewTrigger.dataset.appBound =
        "1";

      viewTrigger.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          toggleViewSelector();

        }
      );

    }


    $$(".view-option")
      .forEach(option => {

        if (
          option.dataset.appBound === "1"
        ) {
          return;
        }

        option.dataset.appBound =
          "1";

        option.addEventListener(
          "click",
          () => {

            const mode =
              option.dataset.view ||
              option.dataset.mode ||
              option.getAttribute(
                "data-view"
              );

            if (mode) {

              currentStageView =
                mode;

              currentMaterialView =
                mode;

              localStorage.setItem(
                STORAGE.stageView,
                mode
              );

              localStorage.setItem(
                STORAGE.materialView,
                mode
              );

            }

            closeViewSelector();

            applyStageView();

          }
        );

      });


    bindThemeButton();

    bindLanguageButtons();

    bindDrawer();

    bindBottomNav();

  }


  /* =======================================================
     FILTERS
     ======================================================= */

  function bindFilterSelect(
    select,
    key
  ) {

    if (!select) return;

    if (
      select.dataset.appBound === "1"
    ) {
      return;
    }

    select.dataset.appBound =
      "1";

    select.addEventListener(
      "change",
      () => {

        selectedFilters[key] =
          select.value || "";

        applyStageSearch();

      }
    );

  }


  function buildFilterOptions() {

    if (stageFilter) {

      const current =
        selectedFilters.stage;

      stageFilter.innerHTML = `
        <option value="">
          ${currentLang === "hi"
            ? "सभी Stage"
            : "All Stages"}
        </option>

        ${window.MATERIALS.map(
          stage => {

            const num =
              String(stage[0])
                .replace(/\D/g, "");

            return `
              <option
                value="${num}"
                ${
                  String(num) ===
                  String(current)
                    ? "selected"
                    : ""
                }
              >
                ${stage[0]} -
                ${
                  currentLang === "hi"
                    ? translate(stage[1])
                    : stage[1]
                }
              </option>
            `;

          }
        ).join("")}

      `;

    }


    if (typeFilter) {

      const sections =
        [
          ...new Set(
            getAllItems()
              .map(
                item =>
                  item.sectionName
              )
          )
        ];

      typeFilter.innerHTML = `
        <option value="">
          ${
            currentLang === "hi"
              ? "सभी Sections"
              : "All Sections"
          }
        </option>

        ${sections.map(
          section =>
            `<option
              value="${escapeHtml(section)}"
            >
              ${
                currentLang === "hi"
                  ? translate(section)
                  : section
              }
            </option>`
        ).join("")}

      `;

    }


    if (sizeFilter) {

      const values =
        new Set();

      getAllItems()
        .forEach(data => {

          itemFields(data.item)
            .forEach(field => {

              if (
                !Array.isArray(field)
              ) return;

              if (
                Array.isArray(field[1])
              ) {

                field[1].forEach(
                  value =>
                    values.add(
                      String(value)
                    )
                );

              }

            });

        });


      sizeFilter.innerHTML = `
        <option value="">
          ${
            currentLang === "hi"
              ? "सभी Size"
              : "All Sizes"
          }
        </option>

        ${Array.from(values)
          .sort()
          .map(
            value =>
              `<option value="${escapeHtml(value)}">
                ${escapeHtml(value)}
              </option>`
          )
          .join("")}

      `;

    }


    if (brandFilter) {

      const values =
        new Set();

      getAllItems()
        .forEach(data => {

          itemBrands(data.item)
            .forEach(
              brand =>
                values.add(
                  String(brand)
                )
            );

        });


      brandFilter.innerHTML = `
        <option value="">
          ${
            currentLang === "hi"
              ? "सभी Brand"
              : "All Brands"
          }
        </option>

        ${Array.from(values)
          .sort()
          .map(
            value =>
              `<option value="${escapeHtml(value)}">
                ${escapeHtml(value)}
              </option>`
          )
          .join("")}

      `;

    }

  }


  function toggleFilterPanel() {

    filterOpen =
      !filterOpen;

    if (filterPanel) {

      filterPanel.style.display =
        filterOpen
          ? ""
          : "none";

    }

  }


  function clearFilters() {

    selectedFilters = {
      stage: "",
      type: "",
      size: "",
      brand: ""
    };


    [
      stageFilter,
      typeFilter,
      sizeFilter,
      brandFilter
    ].forEach(
      select => {

        if (select) {
          select.value = "";
        }

      }
    );


    if (searchInput) {
      searchInput.value = "";
    }

    searchText = "";

    applyStageSearch();

  }


  /* =======================================================
     VIEW
     ======================================================= */

  function getViewClass(mode) {

    const map = {

      grid: "view-grid",
      list: "view-list",
      compact: "view-compact",
      large: "view-large",
      mini: "view-mini",
      "2column": "view-two-column",
      horizontal: "view-horizontal",
      icon: "view-icon-list",
      iconlist: "view-icon-list",
      timeline: "view-timeline",
      dense: "view-dense"

    };

    return map[String(mode).toLowerCase()]
      || "view-grid";

  }


  function toggleViewSelector() {

    viewOpen =
      !viewOpen;

    if (viewOptions) {

      viewOptions.style.display =
        viewOpen
          ? ""
          : "none";

    }

  }


  function closeViewSelector() {

    viewOpen = false;

    if (viewOptions) {
      viewOptions.style.display =
        "none";
    }

  }


  function applyStageView() {

    if (!stageGrid) return;

    stageGrid.classList.remove(
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
    );

    stageGrid.classList.add(
      getViewClass(
        currentStageView
      )
    );

  }


  function openStageViewSelector() {

    if (viewOptions) {

      viewOptions.style.display =
        "";

      viewOpen = true;

    }

  }


  function openMaterialViewSelector() {

    if (viewOptions) {

      viewOptions.style.display =
        "";

      viewOpen = true;

    }

  }


  /* =======================================================
     THEME
     ======================================================= */

  function bindThemeButton() {

    if (!themeButton) return;

    if (
      themeButton.dataset.appBound === "1"
    ) {
      return;
    }

    themeButton.dataset.appBound =
      "1";

    themeButton.addEventListener(
      "click",
      toggleTheme
    );

  }


  function applyTheme() {

    document.documentElement
      .setAttribute(
        "data-theme",
        currentTheme
      );


    document.body.classList.toggle(
      "light-mode",
      currentTheme === "light"
    );


    document.body.classList.toggle(
      "dark-mode",
      currentTheme !== "light"
    );


    if (themeIcon) {

      themeIcon.textContent =
        currentTheme === "dark"
          ? "☀"
          : "☾";

    }


    if (themeTitle) {

      themeTitle.textContent =
        currentTheme === "dark"
          ? t("light")
          : t("dark");

    }


    if (themeState) {

      themeState.textContent =
        currentTheme === "dark"
          ? "Dark"
          : "Light";

    }

  }


  function toggleTheme() {

    currentTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    localStorage.setItem(
      STORAGE.theme,
      currentTheme
    );

    applyTheme();

  }


  /* =======================================================
     LANGUAGE
     ======================================================= */

  function bindLanguageButtons() {

    const hi =
      $("#langHi");

    const en =
      $("#langEn");


    if (
      hi &&
      hi.dataset.appBound !== "1"
    ) {

      hi.dataset.appBound =
        "1";

      hi.addEventListener(
        "click",
        () => setLanguage("hi")
      );

    }


    if (
      en &&
      en.dataset.appBound !== "1"
    ) {

      en.dataset.appBound =
        "1";

      en.addEventListener(
        "click",
        () => setLanguage("en")
      );

    }

  }


  function setLanguage(lang) {

    if (
      lang !== "hi" &&
      lang !== "en"
    ) {
      return;
    }

    currentLang =
      lang;

    localStorage.setItem(
      STORAGE.lang,
      currentLang
    );


    applyTheme();

    buildFilterOptions();


    if (
      currentStage !== null &&
      currentSection !== null &&
      currentItem !== null
    ) {

      renderItemEditor(
        currentStage,
        currentSection,
        currentItem
      );

      return;

    }


    if (
      currentStage !== null &&
      currentSection !== null
    ) {

      renderMaterialList(
        currentStage,
        currentSection
      );

      return;

    }


    if (
      currentStage !== null
    ) {

      renderStagePage(
        currentStage
      );

      return;

    }


    renderStageCards();

    bindHomeEvents();

  }


  /* =======================================================
     DRAWER
     ======================================================= */

  function bindDrawer() {

    if (
      menuBtn &&
      menuBtn.dataset.appBound !== "1"
    ) {

      menuBtn.dataset.appBound =
        "1";

      menuBtn.addEventListener(
        "click",
        toggleDrawer
      );

    }


    if (
      drawerOverlay &&
      drawerOverlay.dataset.appBound !== "1"
    ) {

      drawerOverlay.dataset.appBound =
        "1";

      drawerOverlay.addEventListener(
        "click",
        closeDrawer
      );

    }


    $$(".drawer-item")
      .forEach(item => {

        if (
          item.dataset.appBound === "1"
        ) {
          return;
        }

        item.dataset.appBound =
          "1";

        item.addEventListener(
          "click",
          () => {

            const page =
              item.dataset.page;

            closeDrawer();

            navigate(
              page
            );

          }
        );

      });

  }


  function toggleDrawer() {

    drawerOpen =
      !drawerOpen;

    updateDrawer();

  }


  function closeDrawer() {

    drawerOpen = false;

    updateDrawer();

  }


  function updateDrawer() {

    if (drawer) {

      drawer.classList.toggle(
        "open",
        drawerOpen
      );

      drawer.classList.toggle(
        "active",
        drawerOpen
      );

    }


    if (drawerOverlay) {

      drawerOverlay.classList.toggle(
        "open",
        drawerOpen
      );

      drawerOverlay.classList.toggle(
        "active",
        drawerOpen
      );

    }


    if (menuBtn) {

      menuBtn.classList.toggle(
        "active",
        drawerOpen
      );

    }

  }


  /* =======================================================
     NAVIGATION
     ======================================================= */

  function bindBottomNav() {

    $$(".bottom-item")
      .forEach(item => {

        if (
          item.dataset.appBound === "1"
        ) {
          return;
        }

        item.dataset.appBound =
          "1";

        item.addEventListener(
          "click",
          () => {

            const page =
              item.dataset.nav;

            navigate(page);

          }
        );

      });

  }


  function navigate(page) {

    if (!page) return;


    if (page === "home") {

      currentStage = null;
      currentSection = null;
      currentItem = null;

      saveRoute({
        page: "home"
      });

      restoreOriginalHome();

      return;

    }


    if (page === "estimate") {

      currentStage = null;
      currentSection = null;
      currentItem = null;

      saveRoute({
        page: "estimate"
      });

      renderEstimate();

      return;

    }


    if (page === "calculator") {

      currentStage = null;
      currentSection = null;
      currentItem = null;

      saveRoute({
        page: "calculator"
      });

      renderCalculator();

      return;

    }


    if (page === "settings") {

      currentStage = null;
      currentSection = null;
      currentItem = null;

      saveRoute({
        page: "settings"
      });

      renderSettings();

      return;

    }

  }


  /* =======================================================
     RESTORE HOME
     ======================================================= */

  let originalHomeHTML = null;

  function saveOriginalHome() {

    if (
      home &&
      originalHomeHTML === null
    ) {

      originalHomeHTML =
        home.innerHTML;

    }

  }


  function restoreOriginalHome() {

    if (!home) return;


    if (
      originalHomeHTML !== null
    ) {

      home.innerHTML =
        originalHomeHTML;

    }


    renderStageCards();

    bindHomeEvents();

    updateBottomNav(
      "home"
    );

  }


  /* =======================================================
     CALCULATOR
     ======================================================= */

  function renderCalculator() {

    if (!home) return;


    home.innerHTML = `

      <div class="app-page calculator-page">

        <div class="page-header">

          <button
            type="button"
            class="internal-back"
            id="calculatorBack"
          >
            ← ${t("back")}
          </button>

          <div class="page-title">
            <strong>
              ${t("calculatorTitle")}
            </strong>
          </div>

        </div>


        <div class="calculator-card">

          <div class="calc-formula">

            <button data-formula="P=V×I">
              P = V × I
            </button>

            <button data-formula="V=I×R">
              V = I × R
            </button>

            <button data-formula="I=V÷R">
              I = V ÷ R
            </button>

            <button data-formula="R=V÷I">
              R = V ÷ I
            </button>

          </div>


          <div class="calc-inputs">

            <label>
              ${t("voltage")}
              <input
                id="calcV"
                type="number"
                inputmode="decimal"
              >
            </label>

            <label>
              ${t("current")}
              <input
                id="calcI"
                type="number"
                inputmode="decimal"
              >
            </label>

            <label>
              ${t("resistance")}
              <input
                id="calcR"
                type="number"
                inputmode="decimal"
              >
            </label>

            <label>
              ${t("power")}
              <input
                id="calcP"
                type="number"
                inputmode="decimal"
              >
            </label>

          </div>


          <button
            type="button"
            class="primary-action"
            id="calculateBtn"
          >
            ${t("calculate")}
          </button>


          <div
            class="calc-result"
            id="calcResult"
          >
            ${t("result")}
          </div>

        </div>


        <div class="calculator-card inverter-card">

          <h3>
            ${t("inverter")}
          </h3>

          <label>
            DC Voltage

            <select id="inverterVoltage">
              <option value="12">
                12V
              </option>

              <option value="24">
                24V
              </option>
            </select>

          </label>


          <label>
            AC Output

            <input
              value="230V"
              disabled
            >

          </label>

        </div>

      </div>

    `;


    $("#calculatorBack")
      ?.addEventListener(
        "click",
        () => goBack()
      );


    $$(".calc-formula button")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            calculateFormula(
              button.dataset.formula
            );

          }
        );

      });


    $("#calculateBtn")
      ?.addEventListener(
        "click",
        () => {

          calculateFormula(
            "auto"
          );

        }
      );

  }


  function calculateFormula(
    formula
  ) {

    const V =
      Number($("#calcV")?.value);

    const I =
      Number($("#calcI")?.value);

    const R =
      Number($("#calcR")?.value);

    const P =
      Number($("#calcP")?.value);


    let result = "";


    if (
      formula === "P=V×I" ||
      (
        formula === "auto" &&
        V &&
        I
      )
    ) {

      result =
        `P = ${formatNumber(V * I)} W`;

    } else if (
      formula === "V=I×R"
    ) {

      result =
        `V = ${formatNumber(I * R)} V`;

    } else if (
      formula === "I=V÷R"
    ) {

      result =
        R
          ? `I = ${formatNumber(V / R)} A`
          : "R required";

    } else if (
      formula === "R=V÷I"
    ) {

      result =
        I
          ? `R = ${formatNumber(V / I)} Ω`
          : "I required";

    } else if (
      formula === "auto" &&
      V &&
      R
    ) {

      result =
        `I = ${formatNumber(V / R)} A`;

    } else if (
      formula === "auto" &&
      P &&
      V
    ) {

      result =
        `I = ${formatNumber(P / V)} A`;

    } else {

      result =
        currentLang === "hi"
          ? "Required values डालें"
          : "Enter required values";

    }


    const output =
      $("#calcResult");

    if (output) {
      output.textContent =
        result;
    }

  }


  /* =======================================================
     SETTINGS
     ======================================================= */

  function renderSettings() {

    if (!home) return;


    home.innerHTML = `

      <div class="app-page settings-page">

        <div class="page-header">

          <button
            type="button"
            class="internal-back"
            id="settingsBack"
          >
            ← ${t("back")}
          </button>

          <div class="page-title">
            <strong>
              ${t("settings")}
            </strong>
          </div>

        </div>


        <div class="settings-card">

          <button
            type="button"
            class="settings-row"
            id="settingsTheme"
          >

            <span>
              ${t("dark")} / ${t("light")}
            </span>

            <span>
              ${
                currentTheme === "dark"
                  ? "☀"
                  : "☾"
              }
            </span>

          </button>


          <button
            type="button"
            class="settings-row"
            id="settingsHi"
          >
            हिन्दी
          </button>


          <button
            type="button"
            class="settings-row"
            id="settingsEn"
          >
            English
          </button>


          <button
            type="button"
            class="settings-row"
            id="settingsClearEstimate"
          >

            ${
              currentLang === "hi"
                ? "पूरा Estimate Clear करें"
                : "Clear Entire Estimate"
            }

          </button>

        </div>

      </div>

    `;


    $("#settingsBack")
      ?.addEventListener(
        "click",
        () => goBack()
      );


    $("#settingsTheme")
      ?.addEventListener(
        "click",
        toggleTheme
      );


    $("#settingsHi")
      ?.addEventListener(
        "click",
        () => setLanguage("hi")
      );


    $("#settingsEn")
      ?.addEventListener(
        "click",
        () => setLanguage("en")
      );


    $("#settingsClearEstimate")
      ?.addEventListener(
        "click",
        () => {

          estimateItems = [];

          saveEstimate();

          showToast(
            currentLang === "hi"
              ? "Estimate clear हो गया"
              : "Estimate cleared"
          );

        }
      );

  }


  /* =======================================================
     ROUTE STORAGE
     ======================================================= */

  function saveRoute(route) {

    try {

      localStorage.setItem(
        STORAGE.route,
        JSON.stringify(route)
      );

    } catch (error) {

      console.error(
        "Route save error:",
        error
      );

    }

  }


  function loadRoute() {

    try {

      return JSON.parse(
        localStorage.getItem(
          STORAGE.route
        ) || "null"
      );

    } catch {
      return null;
    }

  }


  function restoreRoute() {

    const route =
      loadRoute();

    if (!route) {

      restoreOriginalHome();

      return;

    }


    if (route.page === "stage") {

      if (
        getStage(route.stageIndex)
      ) {

        renderStagePage(
          route.stageIndex
        );

        return;

      }

    }


    if (route.page === "section") {

      if (
        getStage(route.stageIndex)
      ) {

        renderMaterialList(
          route.stageIndex,
          route.sectionIndex || 0
        );

        return;

      }

    }


    if (route.page === "item") {

      if (
        getItem(
          route.stageIndex,
          route.sectionIndex,
          route.itemIndex
        )
      ) {

        openItem(
          route.stageIndex,
          route.sectionIndex,
          route.itemIndex,
          {
            restore: true
          }
        );

        return;

      }

    }


    if (route.page === "estimate") {

      renderEstimate();

      return;

    }


    if (route.page === "calculator") {

      renderCalculator();

      return;

    }


    if (route.page === "settings") {

      renderSettings();

      return;

    }


    restoreOriginalHome();

  }


  /* =======================================================
     BACK NAVIGATION
     ======================================================= */

  function goBack() {

    closeDrawer();
    closeViewSelector();


    if (filterOpen) {

      filterOpen = false;

      if (filterPanel) {
        filterPanel.style.display =
          "none";
      }

      return;

    }


    if (
      historyStack.length
    ) {

      const previous =
        historyStack.pop();

      restoreHistoryPage(
        previous
      );

      return;

    }


    const route =
      loadRoute();


    if (
      route &&
      route.page !== "home"
    ) {

      restoreOriginalHome();

      saveRoute({
        page: "home"
      });

      return;

    }


    showExitConfirm();

  }


  function restoreHistoryPage(
    page
  ) {

    if (!page) {

      restoreOriginalHome();

      return;

    }


    if (
      page.page === "home"
    ) {

      currentStage = null;
      currentSection = null;
      currentItem = null;

      restoreOriginalHome();

      return;

    }


    if (
      page.page === "stage"
    ) {

      renderStagePage(
        page.stageIndex
      );

      return;

    }


    if (
      page.page === "section"
    ) {

      renderMaterialList(
        page.stageIndex,
        page.sectionIndex
      );

      return;

    }


    if (
      page.page === "estimate"
    ) {

      renderEstimate();

      return;

    }


    restoreOriginalHome();

  }


  /* =======================================================
     BROWSER / ANDROID BACK
     ======================================================= */

  function bindBrowserBack() {

    window.addEventListener(
      "popstate",
      () => {

        goBack();

        history.pushState(
          {
            app: true
          },
          "",
          location.href
        );

      }
    );


    history.replaceState(
      {
        app: true
      },
      "",
      location.href
    );


    history.pushState(
      {
        app: true
      },
      "",
      location.href
    );

  }


  /* =======================================================
     EXIT CONFIRM
     ======================================================= */

  function showExitConfirm() {

    const old =
      document.querySelector(
        ".app-exit-confirm"
      );

    if (old) return;


    const overlay =
      document.createElement("div");

    overlay.className =
      "app-exit-confirm";

    overlay.innerHTML = `

      <div class="exit-box">

        <h3>
          ${t("leaveTitle")}
        </h3>

        <p>
          ${t("leaveText")}
        </p>

        <div class="exit-actions">

          <button
            type="button"
            id="exitNo"
          >
            ${t("no")}
          </button>

          <button
            type="button"
            id="exitYes"
          >
            ${t("yes")}
          </button>

        </div>

      </div>

    `;


    document.body.appendChild(
      overlay
    );


    $("#exitNo", overlay)
      ?.addEventListener(
        "click",
        () => overlay.remove()
      );


    $("#exitYes", overlay)
      ?.addEventListener(
        "click",
        () => {

          overlay.remove();

          /*
            Browser security normally prevents
            JavaScript from force-closing a tab
            that was not opened by script.

            Going back is the closest safe behavior.
          */

          history.back();

        }
      );

  }


  /* =======================================================
     BOTTOM NAV ACTIVE
     ======================================================= */

  function updateBottomNav(
    page
  ) {

    $$(".bottom-item")
      .forEach(item => {

        item.classList.toggle(
          "active",
          item.dataset.nav === page
        );

      });

  }


  /* =======================================================
     TOAST
     ======================================================= */

  let toastTimer = null;


  function showToast(message) {

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
        1800
      );

  }


  /* =======================================================
     SCROLL
     ======================================================= */

  function scrollTop() {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  /* =======================================================
     HTML ESCAPE
     ======================================================= */

  function escapeHtml(value) {

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


  /* =======================================================
     NUMBER FORMAT
     ======================================================= */

  function formatNumber(
    number
  ) {

    if (!Number.isFinite(number)) {
      return "0";
    }

    return Number(
      number.toFixed(4)
    ).toString();

  }


  /* =======================================================
     CLOSE OUTSIDE PANELS
     ======================================================= */

  document.addEventListener(
    "click",
    event => {

      if (
        viewOpen &&
        viewOptions &&
        !viewOptions.contains(event.target) &&
        event.target !== viewTrigger
      ) {

        closeViewSelector();

      }


      if (
        filterOpen &&
        filterPanel &&
        !filterPanel.contains(event.target) &&
        event.target !== filterBtn
      ) {

        filterOpen = false;

        filterPanel.style.display =
          "none";

      }

    }
  );


  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function init() {

    saveOriginalHome();

    loadEstimate();

    applyTheme();

    buildFilterOptions();

    bindBrowserBack();

    restoreRoute();


    /*
      If restoreRoute opened a dynamic page,
      home events are not needed.
    */

    if (
      !currentStage
    ) {

      bindHomeEvents();

    }

  }


  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }


})();
