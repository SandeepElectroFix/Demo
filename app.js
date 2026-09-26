/* =========================================================
   SANDEEP ELECTROFIX - ESTIMATE LIST
   app.js
   FINAL MATERIAL LIST FIX
   ---------------------------------------------------------
   material.js is NOT modified
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIG
     ======================================================= */

  const CFG = window.APP_CONFIG || {};

  const CONFIG = {
    appName: CFG.appName || "Estimate List",
    appNameHi: CFG.appNameHi || "एस्टिमेट लिस्ट",
    businessName: CFG.businessName || "Sandeep ElectroFix",
    tagline: CFG.tagline || "Powering Your Trust",

    defaultLanguage:
      CFG.defaultLanguage === "en" ? "en" : "hi",

    storageKey:
      CFG.storageKey || "sandeepEstimateItems",

    languageKey:
      CFG.languageKey || "sandeepMaterialLang",

    themeKey:
      CFG.themeKey || "sandeepTheme",

    viewKey:
      CFG.viewKey || "sandeepMaterialView",

    routeKey:
      CFG.routeKey || "sandeepEstimateRoute",

    unitKey:
      "sandeepLastUnit"
  };


  /* =======================================================
     DOM
     ======================================================= */

  const main =
    document.getElementById("main");

  if (!main) {
    console.error(
      "Estimate List: #main not found"
    );
    return;
  }

  const menuBtn =
    document.getElementById("menuBtn");

  const drawer =
    document.getElementById("drawer");

  const drawerOverlay =
    document.getElementById("drawerOverlay");

  const closeMenu =
    document.getElementById("closeMenu");

  const themeBtn =
    document.getElementById("themeBtn") ||
    document.getElementById("themeButton");

  const langBtn =
    document.getElementById("langBtn");

  const bottomNav =
    document.getElementById("bottomNav") ||
    document.querySelector(".bottom-nav");


  /* =======================================================
     MATERIAL DATA
     ======================================================= */

  const RAW_MATERIALS =
    Array.isArray(window.MATERIALS)
      ? window.MATERIALS
      : [];

  console.log(
    "MATERIALS loaded:",
    RAW_MATERIALS
  );


  /* =======================================================
     STATE
     ======================================================= */

  const state = {
    page: "home",

    stageIndex: null,

    sectionIndex: null,

    itemIndex: null,

    selectedItem: null,

    editEstimateIndex: -1,

    language: loadLanguage(),

    theme: loadTheme(),

    view: loadView(),

    search: "",

    drawerOpen: false,

    history: [],

    lastUnit:
      localStorage.getItem(
        CONFIG.unitKey
      ) || ""
  };


  /* =======================================================
     STORAGE
     ======================================================= */

  function loadLanguage() {
    return (
      localStorage.getItem(
        CONFIG.languageKey
      ) || CONFIG.defaultLanguage
    ) === "en"
      ? "en"
      : "hi";
  }


  function loadTheme() {
    return (
      localStorage.getItem(
        CONFIG.themeKey
      ) || "dark"
    ) === "light"
      ? "light"
      : "dark";
  }


  const VIEWS = [
    "grid",
    "list",
    "compact",
    "large",
    "mini",
    "twoColumn",
    "horizontal",
    "iconList",
    "timeline",
    "dense"
  ];


  function loadView() {
    const value =
      localStorage.getItem(
        CONFIG.viewKey
      );

    return VIEWS.includes(value)
      ? value
      : "grid";
  }


  function loadEstimate() {
    try {
      const value =
        localStorage.getItem(
          CONFIG.storageKey
        );

      if (!value) return [];

      const parsed =
        JSON.parse(value);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }


  state.estimateItems =
    loadEstimate();


  function saveEstimate() {
    localStorage.setItem(
      CONFIG.storageKey,
      JSON.stringify(
        state.estimateItems
      )
    );
  }


  /* =======================================================
     TRANSLATION
     ======================================================= */

  const UI = {
    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",

      search: "Search material",

      back: "Back",
      add: "Add to Estimate",
      update: "Update Estimate",
      next: "Next",

      quantity: "Quantity",
      unit: "Unit",
      brand: "Brand",

      optional: "Optional",
      required: "Required",

      noMaterial:
        "No material found",

      noSearch:
        "No material found",

      empty:
        "No items added yet",

      clear:
        "Clear Estimate",

      edit: "Edit",
      delete: "Delete",

      saved:
        "Added to Estimate",

      updated:
        "Estimate Updated",

      deleted:
        "Item Deleted",

      cleared:
        "Estimate Cleared",

      complete:
        "This stage is complete",

      enterQuantity:
        "Please enter quantity",

      close:
        "Press back again to exit"
    },

    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",

      search: "सामग्री खोजें",

      back: "वापस",
      add: "एस्टिमेट में जोड़ें",
      update: "एस्टिमेट अपडेट करें",
      next: "अगला",

      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",

      optional: "वैकल्पिक",
      required: "जरूरी",

      noMaterial:
        "सामग्री नहीं मिली",

      noSearch:
        "कोई सामग्री नहीं मिली",

      empty:
        "अभी कोई आइटम नहीं जोड़ा गया",

      clear:
        "एस्टिमेट साफ करें",

      edit: "एडिट",
      delete: "डिलीट",

      saved:
        "एस्टिमेट में जोड़ दिया गया",

      updated:
        "एस्टिमेट अपडेट हो गया",

      deleted:
        "आइटम डिलीट हो गया",

      cleared:
        "एस्टिमेट साफ हो गया",

      complete:
        "यह स्टेज पूरा हो गया",

      enterQuantity:
        "कृपया मात्रा डालें",

      close:
        "ऐप बंद करने के लिए फिर से Back दबाएँ"
    }
  };


  function t(key) {
    return (
      UI[state.language]?.[key] ||
      UI.en[key] ||
      key
    );
  }


  /* =======================================================
     HINDI NAMES
     ======================================================= */

  const HI = {
    Pipe: "पाइप",
    Bend: "बेंड",
    "Junction Box": "जंक्शन बॉक्स",
    "Fan Box": "फैन बॉक्स",
    "Concealed Light Box":
      "कंसील्ड लाइट बॉक्स",

    Wire: "वायर",
    "Flexible Pipe": "फ्लेक्सिबल पाइप",
    "Electrical Tape": "इलेक्ट्रिकल टेप",
    Fastener: "फास्टनर",

    "Switch Plate": "स्विच प्लेट",
    "Switch Board (Surface Gang Box)":
      "स्विच बोर्ड",
    Switch: "स्विच",
    Socket: "सॉकेट",
    "Fan Regulator": "फैन रेगुलेटर",
    "2 Way Switch": "2 वे स्विच",
    "Bell Push": "बेल पुश",
    "Neon Indicator": "नियॉन इंडिकेटर",

    "Mini MCB": "मिनी एमसीबी",
    "SP MCB": "एसपी एमसीबी",
    "DP MCB": "डीपी एमसीबी",
    "TPN MCB": "टीपीएन एमसीबी",
    "DP Isolator": "डीपी आइसोलेटर",
    "TPN Isolator": "टीपीएन आइसोलेटर",
    "RCCB / RCD": "आरसीसीबी / आरसीडी",
    "MCB Box": "एमसीबी बॉक्स",

    "Fan Sheet": "फैन शीट",
    "Round Sheet": "राउंड शीट",
    "Fan Rod": "फैन रॉड",
    "Fan Clamp": "फैन क्लैंप",
    Holder: "होल्डर",
    "Ceiling Rose": "सीलिंग रोज",
    Chain: "चेन",

    "LED Bulb": "एलईडी बल्ब",
    "LED Tube Light": "एलईडी ट्यूब लाइट",
    "Foot Light": "फुट लाइट",
    "Panel Light": "पैनल लाइट",
    "Surface Light": "सरफेस लाइट",
    "COB Light": "सीओबी लाइट",
    "Down Light": "डाउन लाइट",
    "Strip Light": "स्ट्रिप लाइट",
    "Rope Light": "रोप लाइट",

    "Door Bell": "डोर बेल",
    "Instant Glue": "इंस्टेंट ग्लू",
    POP: "पीओपी",
    Screw: "स्क्रू",
    Washer: "वॉशर",
    "Cable Clip": "केबल क्लिप",
    "Cable Tie": "केबल टाई",
    Saddle: "सैडल"
  };


  const GROUP_HI = {
    "Conduit & Box":
      "कंड्यूट एवं बॉक्स",

    "Installation Material":
      "इंस्टॉलेशन सामग्री",

    "Wiring Material":
      "वायरिंग सामग्री",

    "Pulling Material":
      "पुलिंग सामग्री",

    "Switch & Socket":
      "स्विच एवं सॉकेट",

    "MCB & Protection":
      "एमसीबी एवं प्रोटेक्शन",

    "Fan & Ceiling":
      "फैन एवं सीलिंग",

    Lighting:
      "लाइटिंग",

    "Installation & Finishing":
      "इंस्टॉलेशन एवं फिनिशिंग",

    "Wiring & Conduit":
      "वायरिंग एवं कंड्यूट",

    "Installation & Fastening":
      "इंस्टॉलेशन एवं फास्टनिंग"
  };


  function displayMaterial(name) {
    if (state.language !== "hi") {
      return name;
    }

    return HI[name]
      ? `${HI[name]} / ${name}`
      : name;
  }


  function displayGroup(name) {
    if (state.language !== "hi") {
      return name;
    }

    return GROUP_HI[name]
      ? `${GROUP_HI[name]} / ${name}`
      : name;
  }


  /* =======================================================
     IMPORTANT MATERIAL PARSER
     -------------------------------------------------------
     This is the main fix.
     It accepts the existing material.js structure
     without requiring units/brands to be present.
     ======================================================= */

  function isMaterialItem(item) {

    return (
      Array.isArray(item) &&
      typeof item[0] === "string" &&
      Array.isArray(item[1])
    );
  }


  function parseMaterialItem(
    item,
    stageIndex,
    sectionName
  ) {

    return {
      name:
        item[0] || "",

      fields:
        Array.isArray(item[1])
          ? item[1]
          : [],

      units:
        Array.isArray(item[2])
          ? item[2]
          : [],

      brands:
        Array.isArray(item[3])
          ? item[3]
          : [],

      stageIndex,

      section:
        sectionName || ""
    };
  }


  function parseItemArray(
    array,
    stageIndex,
    sectionName
  ) {

    if (!Array.isArray(array)) {
      return [];
    }

    return array
      .filter(isMaterialItem)
      .map(item =>
        parseMaterialItem(
          item,
          stageIndex,
          sectionName
        )
      );
  }


  function parseMaterials() {

    const stages = [];

    RAW_MATERIALS.forEach(
      (
        raw,
        stageIndex
      ) => {

        if (
          !Array.isArray(raw)
        ) {
          return;
        }

        const code =
          typeof raw[0] === "string"
            ? raw[0]
            : `STAGE ${stageIndex + 1}`;

        const title =
          typeof raw[1] === "string"
            ? raw[1]
            : code;

        const category =
          typeof raw[2] === "string"
            ? raw[2]
            : "";

        const sections = [];


        /* -----------------------------------------------
           Main category items
           ----------------------------------------------- */

        const mainItems =
          parseItemArray(
            raw[3],
            stageIndex,
            category
          );

        if (mainItems.length) {

          sections.push({
            name: category,
            items: mainItems
          });

        }


        /* -----------------------------------------------
           Additional grouped sections

           Example:

           [
             "Installation Material",
             [
               ["Tape", ...],
               ["Solvent Cement", ...]
             ]
           ]
           ----------------------------------------------- */

        for (
          let i = 4;
          i < raw.length;
          i++
        ) {

          const group =
            raw[i];

          if (
            !Array.isArray(group)
          ) {
            continue;
          }

          if (
            typeof group[0] !==
            "string"
          ) {
            continue;
          }

          const groupItems =
            parseItemArray(
              group[1],
              stageIndex,
              group[0]
            );

          if (
            groupItems.length
          ) {

            sections.push({
              name: group[0],
              items: groupItems
            });

          }
        }


        stages.push({
          code,
          title,
          category,
          sections
        });

      }
    );

    return stages;
  }


  const STAGES =
    parseMaterials();


  /* =======================================================
     DEBUG
     ======================================================= */

  console.log(
    "================================"
  );

  console.log(
    "Estimate List Parser"
  );

  console.log(
    "RAW MATERIALS:",
    RAW_MATERIALS.length
  );

  console.log(
    "PARSED STAGES:",
    STAGES.length
  );

  STAGES.forEach(
    (
      stage,
      index
    ) => {

      console.log(
        index,
        stage.code,
        stage.title,
        stage.sections
      );

    }
  );

  console.log(
    "================================"
  );


  /* =======================================================
     STAGE HINDI
     ======================================================= */

  const STAGE_HI = {
    "Slab Conduit Installation":
      "स्लैब कंड्यूट इंस्टॉलेशन",

    "Wall Conduit Installation":
      "वॉल कंड्यूट इंस्टॉलेशन",

    "Wiring Installation":
      "वायरिंग इंस्टॉलेशन",

    "Final Electrical Fittings":
      "फाइनल इलेक्ट्रिकल फिटिंग्स",

    "False Ceiling Wiring Material":
      "फॉल्स सीलिंग वायरिंग मटेरियल"
  };


  function displayStage(stage) {

    if (
      state.language !== "hi"
    ) {
      return stage.title;
    }

    return STAGE_HI[
      stage.title
    ]
      ? `${STAGE_HI[stage.title]} / ${stage.title}`
      : stage.title;
  }


  /* =======================================================
     ESCAPE
     ======================================================= */

  function esc(value) {
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
     VIEW
     ======================================================= */

  const VIEW_INFO = {
    grid: ["▦", "Grid"],
    list: ["☷", "List"],
    compact: ["▤", "Compact"],
    large: ["▥", "Large"],
    mini: ["▪", "Mini"],
    twoColumn: ["▦", "2 Column"],
    horizontal: ["▤", "Horizontal"],
    iconList: ["☷", "Icon List"],
    timeline: ["◫", "Timeline"],
    dense: ["≡", "Dense"]
  };


  function viewIcon() {
    return (
      VIEW_INFO[
        state.view
      ]?.[0] || "▦"
    );
  }


  /* =======================================================
     DRAWER
     ======================================================= */

  function openDrawer() {

    if (!drawer) return;

    state.drawerOpen = true;

    drawer.classList.add(
      "open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "false"
    );

    drawerOverlay?.classList.add(
      "show"
    );

    menuBtn?.classList.add(
      "open"
    );

    menuBtn?.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  function closeDrawer() {

    if (!drawer) return;

    state.drawerOpen = false;

    drawer.classList.remove(
      "open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

    drawerOverlay?.classList.remove(
      "show"
    );

    menuBtn?.classList.remove(
      "open"
    );

    menuBtn?.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  menuBtn?.addEventListener(
    "click",
    () => {

      if (
        state.drawerOpen
      ) {
        closeDrawer();
      } else {
        openDrawer();
      }

    }
  );


  closeMenu?.addEventListener(
    "click",
    closeDrawer
  );


  drawerOverlay?.addEventListener(
    "click",
    closeDrawer
  );


  drawer
    ?.querySelectorAll(
      "[data-page]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const page =
            button.dataset.page;

          closeDrawer();

          navigate(page);

        }
      );

    });


  /* =======================================================
     THEME
     ======================================================= */

  function applyTheme() {

    document.body.dataset.theme =
      state.theme;

    document.documentElement.dataset.theme =
      state.theme;

    localStorage.setItem(
      CONFIG.themeKey,
      state.theme
    );
  }


  themeBtn?.addEventListener(
    "click",
    () => {

      state.theme =
        state.theme === "dark"
          ? "light"
          : "dark";

      applyTheme();

    }
  );


  /* =======================================================
     LANGUAGE
     ======================================================= */

  langBtn?.addEventListener(
    "click",
    () => {

      state.language =
        state.language === "hi"
          ? "en"
          : "hi";

      localStorage.setItem(
        CONFIG.languageKey,
        state.language
      );

      renderCurrentPage();

    }
  );


  /* =======================================================
     ROUTE
     ======================================================= */

  function saveRoute() {

    localStorage.setItem(
      CONFIG.routeKey,
      JSON.stringify({
        page: state.page,
        stageIndex:
          state.stageIndex,
        sectionIndex:
          state.sectionIndex,
        itemIndex:
          state.itemIndex
      })
    );
  }


  function restoreRoute() {

    try {

      const raw =
        localStorage.getItem(
          CONFIG.routeKey
        );

      if (!raw) return;

      const route =
        JSON.parse(raw);

      if (!route) return;

      state.page =
        route.page || "home";

      state.stageIndex =
        Number.isInteger(
          route.stageIndex
        )
          ? route.stageIndex
          : null;

      state.sectionIndex =
        Number.isInteger(
          route.sectionIndex
        )
          ? route.sectionIndex
          : null;

      state.itemIndex =
        Number.isInteger(
          route.itemIndex
        )
          ? route.itemIndex
          : null;

    } catch {

      state.page = "home";

      state.stageIndex = null;
      state.sectionIndex = null;
      state.itemIndex = null;

    }
  }


  /* =======================================================
     NAVIGATION
     ======================================================= */

  function snapshot() {

    return {
      page: state.page,
      stageIndex:
        state.stageIndex,
      sectionIndex:
        state.sectionIndex,
      itemIndex:
        state.itemIndex
    };
  }


  function navigate(
    page,
    historyPush = true
  ) {

    if (
      historyPush &&
      state.page !== page
    ) {

      state.history.push(
        snapshot()
      );

    }

    state.page =
      page || "home";

    if (
      page === "home" ||
      page === "estimate" ||
      page === "calculator" ||
      page === "settings"
    ) {

      state.stageIndex = null;
      state.sectionIndex = null;
      state.itemIndex = null;
      state.selectedItem = null;
      state.editEstimateIndex = -1;

    }

    renderCurrentPage();

    saveRoute();
  }


  /* =======================================================
     HOME
     ======================================================= */

  function renderHome() {

    main.innerHTML = `

      <section class="page homePage">

        <div class="hero">

          <div class="heroLogoWrap">
            <img
              src="logo.png"
              class="heroLogo"
              alt="Sandeep ElectroFix"
              onerror="this.style.display='none'"
            >
          </div>

          <h2>
            ${esc(
              CONFIG.businessName
            )}
          </h2>

          <p>
            ${esc(
              CONFIG.tagline
            )}
          </p>

        </div>


        <div class="searchBox">

          <span>⌕</span>

          <input
            id="homeSearch"
            type="search"
            autocomplete="off"
            placeholder="${esc(
              t("search")
            )}"
          >

        </div>


        <div class="stageViewSelector">

          <button
            id="viewToggle"
            type="button"
          >
            ${viewIcon()}
          </button>

          <div
            id="viewOptions"
            hidden
          >

            ${Object.entries(
              VIEW_INFO
            )
              .map(
                ([key, value]) => `
                  <button
                    type="button"
                    data-view="${key}"
                    class="${
                      state.view ===
                      key
                        ? "active"
                        : ""
                    }"
                  >
                    ${value[0]}
                    ${value[1]}
                  </button>
                `
              )
              .join("")}

          </div>

        </div>


        <div
          id="stageGrid"
          class="stageGrid ${state.view}"
        >

          ${renderStageCards()}

        </div>

      </section>

    `;


    document
      .getElementById(
        "homeSearch"
      )
      ?.addEventListener(
        "input",
        e => {

          state.search =
            e.target.value
              .trim()
              .toLowerCase();

          document
            .getElementById(
              "stageGrid"
            ).innerHTML =
              renderStageCards();

          bindStageCards();

        }
      );


    const viewToggle =
      document.getElementById(
        "viewToggle"
      );

    const viewOptions =
      document.getElementById(
        "viewOptions"
      );


    viewToggle?.addEventListener(
      "click",
      () => {

        viewOptions.hidden =
          !viewOptions.hidden;

      }
    );


    viewOptions
      ?.querySelectorAll(
        "[data-view]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            state.view =
              button.dataset.view;

            localStorage.setItem(
              CONFIG.viewKey,
              state.view
            );

            renderHome();

          }
        );

      });


    bindStageCards();
  }


  /* =======================================================
     STAGE SEARCH
     ======================================================= */

  function stageMatches(
    stage
  ) {

    if (!state.search) {
      return true;
    }

    const text = [
      stage.code,
      stage.title,
      stage.category
    ];

    stage.sections.forEach(
      section => {

        text.push(
          section.name
        );

        section.items.forEach(
          item => {

            text.push(
              item.name
            );

            item.fields.forEach(
              field => {

                text.push(
                  field[0]
                );

                if (
                  Array.isArray(
                    field[1]
                  )
                ) {
                  text.push(
                    ...field[1]
                  );
                }

              }
            );

          }
        );

      }
    );


    return text
      .join(" ")
      .toLowerCase()
      .includes(
        state.search
      );
  }


  /* =======================================================
     STAGE CARDS
     ======================================================= */

  function renderStageCards() {

    if (!STAGES.length) {

      return `
        <div class="emptyState">
          Material List Not Loaded
        </div>
      `;

    }


    const html =
      STAGES
        .map(
          (
            stage,
            index
          ) => {

            if (
              !stageMatches(
                stage
              )
            ) {
              return "";
            }

            const count =
              stage.sections.reduce(
                (
                  total,
                  section
                ) =>
                  total +
                  section.items.length,
                0
              );


            return `

              <button
                type="button"
                class="stageCard"
                data-stage="${index}"
              >

                <div class="stageNumber">
                  ${esc(
                    stage.code
                  )}
                </div>

                <div
                  class="stageCardBody"
                >

                  <h3>
                    ${esc(
                      displayStage(
                        stage
                      )
                    )}
                  </h3>

                  <p>
                    ${esc(
                      displayGroup(
                        stage.category
                      )
                    )}
                  </p>

                  <small>
                    ${count}
                    ${
                      state.language ===
                      "hi"
                        ? " सामग्री"
                        : " Materials"
                    }
                  </small>

                </div>

                <span
                  class="stageArrow"
                >
                  ›
                </span>

              </button>

            `;

          }
        )
        .join("");


    return html ||
      `
        <div class="emptyState">
          ${esc(
            t("noSearch")
          )}
        </div>
      `;
  }


  function bindStageCards() {

    document
      .querySelectorAll(
        "[data-stage]"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            openStage(
              Number(
                card.dataset.stage
              )
            );

          }
        );

      });

  }


  /* =======================================================
     OPEN STAGE
     ======================================================= */

  function openStage(
    stageIndex
  ) {

    if (
      !STAGES[stageIndex]
    ) {
      return;
    }


    state.history.push(
      snapshot()
    );


    state.page = "stage";

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      null;

    state.itemIndex =
      null;

    state.selectedItem =
      null;

    state.search = "";


    renderStage();

    saveRoute();

    window.scrollTo(
      0,
      0
    );
  }


  /* =======================================================
     STAGE PAGE
     ======================================================= */

  function renderStage() {

    const stage =
      STAGES[
        state.stageIndex
      ];


    if (!stage) {

      navigate(
        "home",
        false
      );

      return;
    }


    main.innerHTML = `

      <section
        class="page stagePage"
      >

        <button
          id="stageBack"
          class="back"
          type="button"
        >
          ← ${esc(
            t("back")
          )}
        </button>


        <div class="stageHead">

          <div
            class="stageHeadNumber"
          >
            ${esc(
              stage.code
            )}
          </div>

          <div>

            <h2>
              ${esc(
                displayStage(
                  stage
                )
              )}
            </h2>

            <p>
              ${esc(
                displayGroup(
                  stage.category
                )
              )}
            </p>

          </div>

        </div>


        <div class="stageSearchBox">

          <span>⌕</span>

          <input
            id="materialSearch"
            type="search"
            placeholder="${esc(
              t("search")
            )}"
          >

        </div>


        <div
          id="stageSections"
          class="stageSections"
        >

          ${renderSections(
            stage
          )}

        </div>

      </section>

    `;


    document
      .getElementById(
        "stageBack"
      )
      ?.addEventListener(
        "click",
        goBack
      );


    document
      .getElementById(
        "materialSearch"
      )
      ?.addEventListener(
        "input",
        e => {

          state.search =
            e.target.value
              .trim()
              .toLowerCase();

          document
            .getElementById(
              "stageSections"
            ).innerHTML =
              renderSections(
                stage
              );

          bindItemCards();

        }
      );


    bindItemCards();

    window.scrollTo(
      0,
      0
    );
  }


  /* =======================================================
     SECTIONS
     ======================================================= */

  function renderSections(
    stage
  ) {

    let output = "";


    stage.sections.forEach(
      (
        section,
        sectionIndex
      ) => {

        const items =
          section.items.filter(
            item =>
              itemMatches(
                item
              )
          );


        if (
          !items.length
        ) {
          return;
        }


        output += `

          <section
            class="materialSection"
          >

            <div
              class="sectionTitle"
            >

              <span>
                ${
                  sectionIndex + 1
                }
              </span>

              <h3>
                ${esc(
                  displayGroup(
                    section.name
                  )
                )}
              </h3>

            </div>


            <div
              class="itemGrid ${state.view}"
            >

              ${
                items
                  .map(
                    item => {

                      const itemIndex =
                        section.items.indexOf(
                          item
                        );

                      return `
                        <button
                          type="button"
                          class="itemCard"
                          data-section="${sectionIndex}"
                          data-item="${itemIndex}"
                        >

                          <div
                            class="itemHead"
                          >

                            <h3>
                              ${esc(
                                displayMaterial(
                                  item.name
                                )
                              )}
                            </h3>

                          </div>

                          <span
                            class="itemArrow"
                          >
                            ›
                          </span>

                        </button>
                      `;

                    }
                  )
                  .join("")
              }

            </div>

          </section>

        `;

      }
    );


    return output ||
      `
        <div class="emptyState">
          ${esc(
            t("noSearch")
          )}
        </div>
      `;
  }


  function itemMatches(
    item
  ) {

    if (!state.search) {
      return true;
    }


    const values = [
      item.name,
      item.section
    ];


    item.fields.forEach(
      field => {

        values.push(
          field[0]
        );

        if (
          Array.isArray(
            field[1]
          )
        ) {

          values.push(
            ...field[1]
          );

        }

      }
    );


    return values
      .join(" ")
      .toLowerCase()
      .includes(
        state.search
      );
  }


  function bindItemCards() {

    document
      .querySelectorAll(
        "[data-section][data-item]"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            openItem(
              state.stageIndex,
              Number(
                card.dataset.section
              ),
              Number(
                card.dataset.item
              )
            );

          }
        );

      });

  }


  /* =======================================================
     OPEN ITEM
     ======================================================= */

  function openItem(
    stageIndex,
    sectionIndex,
    itemIndex
  ) {

    const item =
      getItem(
        stageIndex,
        sectionIndex,
        itemIndex
      );


    if (!item) {

      showToast(
        t("noMaterial")
      );

      return;
    }


    state.history.push(
      snapshot()
    );


    state.page = "item";

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      sectionIndex;

    state.itemIndex =
      itemIndex;

    state.selectedItem =
      item;

    state.editEstimateIndex =
      -1;


    renderItem();

    saveRoute();

    window.scrollTo(
      0,
      0
    );
  }


  function getItem(
    stageIndex,
    sectionIndex,
    itemIndex
  ) {

    const stage =
      STAGES[
        stageIndex
      ];

    if (!stage) {
      return null;
    }


    const section =
      stage.sections[
        sectionIndex
      ];

    if (!section) {
      return null;
    }


    return (
      section.items[
        itemIndex
      ] || null
    );
  }


  /* =======================================================
     ITEM PAGE
     ======================================================= */

  function renderItem() {

    const item =
      state.selectedItem ||
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );


    if (!item) {

      navigate(
        "stage",
        false
      );

      return;
    }


    const existing =
      state.editEstimateIndex >= 0
        ? state.estimateItems[
            state.editEstimateIndex
          ]
        : null;


    const values =
      existing?.values || {};


    main.innerHTML = `

      <section
        class="page itemPage"
      >

        <button
          id="itemBack"
          class="back"
          type="button"
        >
          ← ${esc(
            t("back")
          )}
        </button>


        <div class="stageHead">

          <div
            class="stageHeadNumber"
          >
            ${esc(
              STAGES[
                state.stageIndex
              ].code
            )}
          </div>

          <div>

            <h2>
              ${esc(
                displayMaterial(
                  item.name
                )
              )}
            </h2>

            <p>
              ${esc(
                displayGroup(
                  item.section
                )
              )}
            </p>

          </div>

        </div>


        <form
          id="materialForm"
          class="materialForm"
        >

          ${renderFields(
            item,
            values
          )}


          <div class="field">

            <label>
              ${esc(
                t("quantity")
              )}

              <span
                class="required"
              >
                *
              </span>
            </label>


            <div class="qtyRow">

              <button
                type="button"
                id="qtyMinus"
              >
                −
              </button>

              <input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                inputmode="decimal"
                value="${esc(
                  values.quantity ||
                    ""
                )}"
              >

              <button
                type="button"
                id="qtyPlus"
              >
                +
              </button>

            </div>

          </div>


          ${renderUnits(
            item,
            values
          )}


          ${renderBrands(
            item,
            values
          )}


          <div
            class="editorButtons"
          >

            <button
              type="submit"
              class="primary"
            >
              ${
                existing
                  ? esc(
                      t("update")
                    )
                  : esc(
                      t("add")
                    )
              }
            </button>


            <button
              type="button"
              id="nextBtn"
              class="secondary"
            >
              ${esc(
                t("next")
              )}
              →
            </button>

          </div>

        </form>

      </section>

    `;


    bindItemForm(
      item
    );


    window.scrollTo(
      0,
      0
    );
  }


  /* =======================================================
     FIELDS
     ======================================================= */

  function renderFields(
    item,
    values
  ) {

    return item.fields
      .map(
        (
          field,
          index
        ) => {

          const label =
            field[0] || "";

          const options =
            Array.isArray(
              field[1]
            )
              ? field[1]
              : [];


          const current =
            values[
              `field_${index}`
            ] || "";


          return `

            <div class="field">

              <label>
                ${esc(
                  label
                )}

                <span
                  class="optional"
                >
                  ${esc(
                    t("optional")
                  )}
                </span>
              </label>


              <div class="choices">

                ${
                  options
                    .map(
                      option => `

                        <button
                          type="button"
                          class="choice ${
                            current ===
                            option
                              ? "selected"
                              : ""
                          }"
                          data-field="${index}"
                          data-value="${esc(
                            option
                          )}"
                        >
                          ${esc(
                            option
                          )}
                        </button>

                      `
                    )
                    .join("")
                }

              </div>


              <input
                type="hidden"
                id="field_${index}"
                value="${esc(
                  current
                )}"
              >

            </div>

          `;

        }
      )
      .join("");
  }


  /* =======================================================
     UNITS
     ======================================================= */

  function renderUnits(
    item,
    values
  ) {

    if (
      !item.units.length
    ) {
      return "";
    }


    let selected =
      values.unit || "";


    if (
      !item.units.includes(
        selected
      )
    ) {

      if (
        state.lastUnit &&
        item.units.includes(
          state.lastUnit
        )
      ) {
        selected =
          state.lastUnit;
      } else {
        selected =
          item.units[0];
      }

    }


    return `

      <div class="field">

        <label>
          ${esc(
            t("unit")
          )}

          <span
            class="optional"
          >
            ${esc(
              t("optional")
            )}
          </span>
        </label>


        <div class="choices">

          ${
            item.units
              .map(
                unit => `

                  <button
                    type="button"
                    class="choice ${
                      selected ===
                      unit
                        ? "selected"
                        : ""
                    }"
                    data-unit="${esc(
                      unit
                    )}"
                  >
                    ${esc(
                      unit
                    )}
                  </button>

                `
              )
              .join("")
          }

        </div>


        <input
          type="hidden"
          id="unit"
          value="${esc(
            selected
          )}"
        >

      </div>

    `;
  }


  /* =======================================================
     BRANDS
     ======================================================= */

  function renderBrands(
    item,
    values
  ) {

    if (
      !item.brands.length
    ) {
      return "";
    }


    return `

      <div class="field">

        <label>
          ${esc(
            t("brand")
          )}

          <span
            class="optional"
          >
            ${esc(
              t("optional")
            )}
          </span>
        </label>


        <div class="choices">

          ${
            item.brands
              .map(
                brand => `

                  <button
                    type="button"
                    class="choice ${
                      values.brand ===
                      brand
                        ? "selected"
                        : ""
                    }"
                    data-brand="${esc(
                      brand
                    )}"
                  >
                    ${esc(
                      brand
                    )}
                  </button>

                `
              )
              .join("")
          }

        </div>


        <input
          type="hidden"
          id="brand"
          value="${esc(
            values.brand || ""
          )}"
        >

      </div>

    `;
  }


  /* =======================================================
     ITEM FORM
     ======================================================= */

  function bindItemForm(
    item
  ) {

    document
      .getElementById(
        "itemBack"
      )
      ?.addEventListener(
        "click",
        goBack
      );


    /* Dynamic fields */

    document
      .querySelectorAll(
        "[data-field]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              button.dataset.field;

            const input =
              document.getElementById(
                `field_${index}`
              );

            if (!input) {
              return;
            }

            input.value =
              button.dataset.value ||
              "";


            document
              .querySelectorAll(
                `[data-field="${index}"]`
              )
              .forEach(
                el =>
                  el.classList.remove(
                    "selected"
                  )
              );


            button.classList.add(
              "selected"
            );

          }
        );

      });


    /* Units */

    document
      .querySelectorAll(
        "[data-unit]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const input =
              document.getElementById(
                "unit"
              );

            if (!input) {
              return;
            }

            input.value =
              button.dataset.unit;


            document
              .querySelectorAll(
                "[data-unit]"
              )
              .forEach(
                el =>
                  el.classList.remove(
                    "selected"
                  )
              );


            button.classList.add(
              "selected"
            );

          }
        );

      });


    /* Brands */

    document
      .querySelectorAll(
        "[data-brand]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const input =
              document.getElementById(
                "brand"
              );

            if (!input) {
              return;
            }

            input.value =
              button.dataset.brand;


            document
              .querySelectorAll(
                "[data-brand]"
              )
              .forEach(
                el =>
                  el.classList.remove(
                    "selected"
                  )
              );


            button.classList.add(
              "selected"
            );

          }
        );

      });


    /* Quantity */

    const quantity =
      document.getElementById(
        "quantity"
      );


    document
      .getElementById(
        "qtyMinus"
      )
      ?.addEventListener(
        "click",
        () => {

          const value =
            Number(
              quantity.value || 0
            );

          quantity.value =
            value > 1
              ? value - 1
              : "";

        }
      );


    document
      .getElementById(
        "qtyPlus"
      )
      ?.addEventListener(
        "click",
        () => {

          const value =
            Number(
              quantity.value || 0
            );

          quantity.value =
            value + 1;

        }
      );


    /* Submit */

    document
      .getElementById(
        "materialForm"
      )
      ?.addEventListener(
        "submit",
        event => {

          event.preventDefault();


          const qty =
            Number(
              quantity?.value || 0
            );


          if (
            !qty ||
            qty <= 0
          ) {

            showToast(
              t(
                "enterQuantity"
              )
            );

            quantity?.focus();

            return;
          }


          const values = {};


          item.fields.forEach(
            (
              _field,
              index
            ) => {

              values[
                `field_${index}`
              ] =
                document
                  .getElementById(
                    `field_${index}`
                  )
                  ?.value || "";

            }
          );


          values.quantity =
            quantity.value;


          values.unit =
            document
              .getElementById(
                "unit"
              )
              ?.value ||
            "";


          values.brand =
            document
              .getElementById(
                "brand"
              )
              ?.value ||
            "";


          if (
            values.unit
          ) {

            state.lastUnit =
              values.unit;

            localStorage.setItem(
              CONFIG.unitKey,
              values.unit
            );

          }


          const record = {

            id:
              state.editEstimateIndex >=
              0
                ? state
                    .estimateItems[
                      state
                        .editEstimateIndex
                    ].id
                : Date.now() +
                  "_" +
                  Math.random()
                    .toString(36)
                    .slice(2),

            stage:
              STAGES[
                state.stageIndex
              ].code,

            stageTitle:
              STAGES[
                state.stageIndex
              ].title,

            stageIndex:
              state.stageIndex,

            section:
              item.section,

            sectionIndex:
              state.sectionIndex,

            material:
              item.name,

            itemIndex:
              state.itemIndex,

            values,

            createdAt:
              Date.now()

          };


          /* UPDATE */

          if (
            state.editEstimateIndex >=
            0
          ) {

            state.estimateItems[
              state.editEstimateIndex
            ] = record;

            saveEstimate();

            showToast(
              t("updated")
            );

            state.editEstimateIndex =
              -1;

            navigate(
              "estimate"
            );

            return;
          }


          /* ADD */

          state.estimateItems.push(
            record
          );

          saveEstimate();

          showToast(
            t("saved")
          );


          /*
             IMPORTANT:
             Add के बाद next item.
             Next अपने आप save नहीं करता.
          */

          openNextItem();

        }
      );


    document
      .getElementById(
        "nextBtn"
      )
      ?.addEventListener(
        "click",
        () => {

          openNextItem();

        }
      );

  }


  /* =======================================================
     NEXT ITEM
     ======================================================= */

  function getNextItemPosition() {

    const stage =
      STAGES[
        state.stageIndex
      ];

    if (!stage) {
      return null;
    }


    const currentSection =
      state.sectionIndex;

    const currentItem =
      state.itemIndex;


    if (
      currentSection === null ||
      currentItem === null
    ) {
      return null;
    }


    /*
      Same section
    */

    if (
      stage.sections[
        currentSection
      ] &&
      currentItem + 1 <
        stage.sections[
          currentSection
        ].items.length
    ) {

      return {
        sectionIndex:
          currentSection,

        itemIndex:
          currentItem + 1
      };

    }


    /*
      Next section
    */

    for (
      let s =
        currentSection + 1;
      s <
      stage.sections.length;
      s++
    ) {

      if (
        stage.sections[
          s
        ].items.length
      ) {

        return {
          sectionIndex: s,
          itemIndex: 0
        };

      }

    }


    return null;
  }


  function openNextItem() {

    const next =
      getNextItemPosition();


    if (!next) {

      showToast(
        t("complete")
      );

      return;
    }


    state.sectionIndex =
      next.sectionIndex;

    state.itemIndex =
      next.itemIndex;

    state.selectedItem =
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    state.page =
      "item";

    state.editEstimateIndex =
      -1;


    renderItem();

    saveRoute();

    window.scrollTo(
      0,
      0
    );

  }


  /* =======================================================
     ESTIMATE
     ======================================================= */

  function renderEstimate() {

    main.innerHTML = `

      <section class="page">

        <div class="pageTitle">

          <h2>
            ${esc(
              t("estimate")
            )}
          </h2>

          <span>
            ${
              state
                .estimateItems
                .length
            }
          </span>

        </div>


        ${
          state
            .estimateItems
            .length
            ? `

              <div
                class="estimateList"
              >

                ${
                  state
                    .estimateItems
                    .map(
                      (
                        record,
                        index
                      ) =>
                        `
                          <div
                            class="estimateCard"
                            data-estimate="${index}"
                          >

                            <h3>
                              ${esc(
                                displayMaterial(
                                  record.material
                                )
                              )}
                            </h3>

                            <p>
                              ${esc(
                                record.stage
                              )}
                              •
                              ${esc(
                                record.section
                              )}
                            </p>

                            <p>
                              ${esc(
                                t(
                                  "quantity"
                                )
                              )}
                              :
                              ${esc(
                                record
                                  .values
                                  ?.quantity ||
                                  ""
                              )}
                              ${esc(
                                record
                                  .values
                                  ?.unit ||
                                  ""
                              )}
                            </p>

                            ${
                              record
                                .values
                                ?.brand
                                ? `
                                  <p>
                                    ${esc(
                                      t(
                                        "brand"
                                      )
                                    )}
                                    :
                                    ${esc(
                                      record
                                        .values
                                        .brand
                                    )}
                                  </p>
                                `
                                : ""
                            }

                            <div
                              class="estimateActions"
                            >

                              <button
                                type="button"
                                class="secondary"
                                data-edit="${index}"
                              >
                                ${esc(
                                  t("edit")
                                )}
                              </button>

                              <button
                                type="button"
                                class="danger"
                                data-delete="${index}"
                              >
                                ${esc(
                                  t("delete")
                                )}
                              </button>

                            </div>

                          </div>
                        `
                    )
                    .join("")
                }

              </div>


              <button
                id="clearEstimate"
                class="danger"
                type="button"
              >
                ${esc(
                  t("clear")
                )}
              </button>

            `
            : `

              <div class="emptyState">

                <div>
                  ▤
                </div>

                <h3>
                  ${esc(
                    t("empty")
                  )}
                </h3>

              </div>

            `
        }

      </section>

    `;


    document
      .querySelectorAll(
        "[data-edit]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            editEstimate(
              Number(
                button.dataset.edit
              )
            );

          }
        );

      });


    document
      .querySelectorAll(
        "[data-delete]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.delete
              );

            state.estimateItems.splice(
              index,
              1
            );

            saveEstimate();

            showToast(
              t("deleted")
            );

            renderEstimate();

          }
        );

      });


    document
      .getElementById(
        "clearEstimate"
      )
      ?.addEventListener(
        "click",
        () => {

          if (
            !confirm(
              state.language ===
                "hi"
                ? "क्या पूरा एस्टिमेट साफ करना है?"
                : "Clear complete estimate?"
            )
          ) {
            return;
          }

          state.estimateItems =
            [];

          saveEstimate();

          showToast(
            t("cleared")
          );

          renderEstimate();

        }
      );

  }


  /* =======================================================
     EDIT ESTIMATE
     ======================================================= */

  function editEstimate(
    index
  ) {

    const record =
      state.estimateItems[
        index
      ];

    if (!record) {
      return;
    }


    let stageIndex =
      Number.isInteger(
        record.stageIndex
      )
        ? record.stageIndex
        : STAGES.findIndex(
            stage =>
              stage.code ===
              record.stage
          );


    if (
      stageIndex < 0 ||
      !STAGES[stageIndex]
    ) {
      return;
    }


    const stage =
      STAGES[
        stageIndex
      ];


    let sectionIndex =
      Number.isInteger(
        record.sectionIndex
      )
        ? record.sectionIndex
        : -1;


    if (
      !stage.sections[
        sectionIndex
      ]
    ) {

      sectionIndex =
        stage.sections.findIndex(
          section =>
            section.name ===
            record.section
        );

    }


    if (
      sectionIndex < 0
    ) {
      return;
    }


    let itemIndex =
      Number.isInteger(
        record.itemIndex
      )
        ? record.itemIndex
        : -1;


    if (
      !stage.sections[
        sectionIndex
      ].items[itemIndex]
    ) {

      itemIndex =
        stage.sections[
          sectionIndex
        ].items.findIndex(
          item =>
            item.name ===
            record.material
        );

    }


    if (
      itemIndex < 0
    ) {
      return;
    }


    state.page =
      "item";

    state.stageIndex =
      stageIndex;

    state.sectionIndex =
      sectionIndex;

    state.itemIndex =
      itemIndex;

    state.selectedItem =
      stage.sections[
        sectionIndex
      ].items[
        itemIndex
      ];

    state.editEstimateIndex =
      index;


    renderItem();

    saveRoute();

    window.scrollTo(
      0,
      0
    );
  }


  /* =======================================================
     CALCULATOR
     ======================================================= */

  function renderCalculator() {

    main.innerHTML = `

      <section class="page">

        <div class="pageTitle">

          <h2>
            ${esc(
              t("calculator")
            )}
          </h2>

        </div>


        <div
          class="calculatorGrid"
        >

          <div class="calcCard">

            <h3>
              V = I × R
            </h3>

            <input
              id="calcI"
              type="number"
              step="any"
              placeholder="Current (I)"
            >

            <input
              id="calcR"
              type="number"
              step="any"
              placeholder="Resistance (R)"
            >

            <button
              id="calcV"
              class="primary"
              type="button"
            >
              Calculate V
            </button>

            <div
              id="calcVResult"
              class="calcResult"
            >
              —
            </div>

          </div>


          <div class="calcCard">

            <h3>
              I = V ÷ R
            </h3>

            <input
              id="calcV2"
              type="number"
              step="any"
              placeholder="Voltage (V)"
            >

            <input
              id="calcR2"
              type="number"
              step="any"
              placeholder="Resistance (R)"
            >

            <button
              id="calcI"
              class="primary"
              type="button"
            >
              Calculate I
            </button>

            <div
              id="calcIResult"
              class="calcResult"
            >
              —
            </div>

          </div>


          <div class="calcCard">

            <h3>
              R = V ÷ I
            </h3>

            <input
              id="calcV3"
              type="number"
              step="any"
              placeholder="Voltage (V)"
            >

            <input
              id="calcI3"
              type="number"
              step="any"
              placeholder="Current (I)"
            >

            <button
              id="calcR"
              class="primary"
              type="button"
            >
              Calculate R
            </button>

            <div
              id="calcRResult"
              class="calcResult"
            >
              —
            </div>

          </div>

        </div>

      </section>

    `;


    document
      .getElementById(
        "calcV"
      )
      ?.addEventListener(
        "click",
        () => {

          const I =
            Number(
              document.getElementById(
                "calcI"
              )?.value
            );

          const R =
            Number(
              document.getElementById(
                "calcR"
              )?.value
            );

          document.getElementById(
            "calcVResult"
          ).textContent =
            I && R
              ? `${I * R} V`
              : "—";

        }
      );


    document
      .getElementById(
        "calcI"
      )
      ?.addEventListener(
        "click",
        () => {

          const V =
            Number(
              document.getElementById(
                "calcV2"
              )?.value
            );

          const R =
            Number(
              document.getElementById(
                "calcR2"
              )?.value
            );

          document.getElementById(
            "calcIResult"
          ).textContent =
            V && R
              ? `${V / R} A`
              : "—";

        }
      );


    document
      .getElementById(
        "calcR"
      )
      ?.addEventListener(
        "click",
        () => {

          const V =
            Number(
              document.getElementById(
                "calcV3"
              )?.value
            );

          const I =
            Number(
              document.getElementById(
                "calcI3"
              )?.value
            );

          document.getElementById(
            "calcRResult"
          ).textContent =
            V && I
              ? `${V / I} Ω`
              : "—";

        }
      );

  }


  /* =======================================================
     SETTINGS
     ======================================================= */

  function renderSettings() {

    main.innerHTML = `

      <section class="page">

        <div class="pageTitle">

          <h2>
            ${esc(
              t("settings")
            )}
          </h2>

        </div>


        <div class="settingsCard">

          <div class="settingRow">

            <b>
              Language
            </b>

            <button
              id="settingLanguage"
              class="secondary"
              type="button"
            >
              ${
                state.language ===
                "hi"
                  ? "English"
                  : "हिन्दी"
              }
            </button>

          </div>


          <div class="settingRow">

            <b>
              Theme
            </b>

            <button
              id="settingTheme"
              class="secondary"
              type="button"
            >
              ${
                state.theme ===
                "dark"
                  ? "☀️"
                  : "🌙"
              }
            </button>

          </div>


          <div class="settingRow">

            <b>
              View
            </b>

            <button
              id="settingView"
              class="secondary"
              type="button"
            >
              ${viewIcon()}
            </button>

          </div>

        </div>

      </section>

    `;


    document
      .getElementById(
        "settingLanguage"
      )
      ?.addEventListener(
        "click",
        () => {

          state.language =
            state.language ===
            "hi"
              ? "en"
              : "hi";

          localStorage.setItem(
            CONFIG.languageKey,
            state.language
          );

          renderSettings();

        }
      );


    document
      .getElementById(
        "settingTheme"
      )
      ?.addEventListener(
        "click",
        () => {

          state.theme =
            state.theme ===
            "dark"
              ? "light"
              : "dark";

          applyTheme();

          renderSettings();

        }
      );


    document
      .getElementById(
        "settingView"
      )
      ?.addEventListener(
        "click",
        () => {

          const current =
            VIEWS.indexOf(
              state.view
            );

          state.view =
            VIEWS[
              (
                current + 1
              ) %
                VIEWS.length
            ];

          localStorage.setItem(
            CONFIG.viewKey,
            state.view
          );

          renderSettings();

        }
      );

  }


  /* =======================================================
     BOTTOM NAV
     ======================================================= */

  function updateBottomNav() {

    bottomNav
      ?.querySelectorAll(
        "[data-page], [data-nav]"
      )
      .forEach(button => {

        const page =
          button.dataset.page ||
          button.dataset.nav ||
          "";

        button.classList.toggle(
          "active",
          page === state.page
        );

      });

  }


  bottomNav
    ?.querySelectorAll(
      "[data-page], [data-nav]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const page =
            button.dataset.page ||
            button.dataset.nav;

          if (page) {
            navigate(page);
          }

        }
      );

    });


  /* =======================================================
     BACK
     ======================================================= */

  function goBack() {

    if (
      state.drawerOpen
    ) {
      closeDrawer();
      return;
    }


    if (
      state.history.length
    ) {

      const previous =
        state.history.pop();

      state.page =
        previous.page;

      state.stageIndex =
        previous.stageIndex;

      state.sectionIndex =
        previous.sectionIndex;

      state.itemIndex =
        previous.itemIndex;

      state.selectedItem =
        getItem(
          state.stageIndex,
          state.sectionIndex,
          state.itemIndex
        );


      renderCurrentPage();

      saveRoute();

      return;
    }


    if (
      state.page === "item"
    ) {

      state.page = "stage";
      state.itemIndex = null;

      renderStage();

      saveRoute();

      return;
    }


    if (
      state.page === "stage"
    ) {

      state.page = "home";

      state.stageIndex = null;
      state.sectionIndex = null;
      state.itemIndex = null;

      renderHome();

      saveRoute();

      return;
    }


    if (
      state.page !== "home"
    ) {

      navigate(
        "home",
        false
      );

      return;
    }


    showToast(
      t("close")
    );

  }


  window.addEventListener(
    "popstate",
    () => {

      goBack();

      try {

        history.pushState(
          {
            electroFix: true
          },
          "",
          location.href
        );

      } catch {}

    }
  );


  /* =======================================================
     TOAST
     ======================================================= */

  let toastTimer = null;


  function showToast(
    message
  ) {

    let toast =
      document.getElementById(
        "appToast"
      );


    if (!toast) {

      toast =
        document.createElement(
          "div"
        );

      toast.id =
        "appToast";

      toast.className =
        "toast";

      document.body.appendChild(
        toast
      );

    }


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
     RENDER
     ======================================================= */

  function renderCurrentPage() {

    switch (
      state.page
    ) {

      case "stage":
        renderStage();
        break;

      case "item":
        renderItem();
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
        state.page = "home";
        renderHome();
        break;

    }


    updateBottomNav();

    applyTheme();

    saveRoute();
  }


  /* =======================================================
     RESTORE
     ======================================================= */

  restoreRoute();


  /*
     Invalid saved route होने पर
     Home पर जाएँ।
  */

  if (
    state.stageIndex !== null &&
    !STAGES[
      state.stageIndex
    ]
  ) {

    state.page = "home";

    state.stageIndex = null;
    state.sectionIndex = null;
    state.itemIndex = null;

  }


  if (
    state.page === "item"
  ) {

    const item =
      getItem(
        state.stageIndex,
        state.sectionIndex,
        state.itemIndex
      );

    if (!item) {

      state.page = "stage";
      state.itemIndex = null;

    } else {

      state.selectedItem =
        item;

    }

  }


  /* =======================================================
     INITIAL HISTORY
     ======================================================= */

  try {

    history.replaceState(
      {
        electroFix: true
      },
      "",
      location.href
    );

    history.pushState(
      {
        electroFix: true
      },
      "",
      location.href
    );

  } catch {}


  /* =======================================================
     START
     ======================================================= */

  renderCurrentPage();


  console.log(
    "Estimate List READY"
  );

  console.log(
    "Total stages:",
    STAGES.length
  );

  console.log(
    "Total materials:",
    STAGES.reduce(
      (
        total,
        stage
      ) =>
        total +
        stage.sections.reduce(
          (
            n,
            section
          ) =>
            n +
            section.items.length,
          0
        ),
      0
    )
  );

})();
