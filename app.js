(() => {
  "use strict";

/* =========================================================
     Sandeep ElectroFix - Estimate List
     app.js
     ---------------------------------------------------------
     Added:
     1. Stage List View Mode
     2. Material List View Mode
     3. Refresh State Restore
     4. Draft / Filled Value Restore
     5. Small Current Item Clear
     6. Step-by-Step Back
     7. Exit Warning
     ========================================================= */

  const C = window.APP_CONFIG || {};
  const M = Array.isArray(window.MATERIALS)
    ? window.MATERIALS
    : [];

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const storeKey =
    C.storageKey || "sandeepEstimateItems";

  const langKey =
    C.languageKey || "sandeepMaterialLang";

  const viewKey =
    C.viewKey || "sandeepMaterialView";

  const stageViewKey =
    "sandeepStageView";

  const themeKey =
    C.themeKey || "sandeepTheme";

  const stateKey =
    "sandeepEstimateAppState";

  /* =========================================================
     APP STATE
     ========================================================= */

  let lang =
    localStorage.getItem(langKey) ||
    C.defaultLanguage ||
    "hi";

  let page = "home";
  let stageIndex = -1;
  let itemIndex = -1;

  let view =
    localStorage.getItem(viewKey) ||
    "grid";

  let stageView =
    localStorage.getItem(stageViewKey) ||
    "grid";

  let draft = {};

  let internalNavigation = false;

  /* =========================================================
     TRANSLATIONS
     ========================================================= */

  const T = {

    hi: {
      home: "होम",
      estimate: "एस्टिमेट",
      calculator: "कैलकुलेटर",
      settings: "सेटिंग्स",
      items: "आइटम",
      open: "खोलें",
      back: "वापस",
      quantity: "मात्रा",
      unit: "यूनिट",
      brand: "ब्रांड",
      optional: "वैकल्पिक",
      add: "एस्टिमेट में जोड़ें",
      added: "एस्टिमेट में जोड़ा गया",
      required: "मात्रा भरना जरूरी है",
      clear: "एस्टिमेट साफ करें",
      clearItem: "Clear",
      empty: "अभी कोई आइटम नहीं जोड़ा गया",
      search: "सामग्री खोजें",
      dark: "Dark",
      light: "Light",
      calculate: "Calculate",
      power: "Power (W)",
      voltage: "Voltage (V)",
      current: "Current (A)",
      resistance: "Resistance (Ω)",
      formula: "Formula",
      reset: "Saved estimate reset करें",
      edit: "Edit",
      delete: "Delete",
      next: "Next",
      prev: "Previous",
      exitTitle: "App बंद करें?",
      exitText: "क्या आप app से बाहर जाना चाहते हैं?",
      cancel: "Cancel",
      exit: "Exit"
    },

    en: {
      home: "Home",
      estimate: "Estimate",
      calculator: "Calculator",
      settings: "Settings",
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
      clear: "Clear Estimate",
      clearItem: "Clear",
      empty: "No items added yet",
      search: "Search materials",
      dark: "Dark",
      light: "Light",
      calculate: "Calculate",
      power: "Power (W)",
      voltage: "Voltage (V)",
      current: "Current (A)",
      resistance: "Resistance (Ω)",
      formula: "Formula",
      reset: "Reset saved estimate",
      edit: "Edit",
      delete: "Delete",
      next: "Next",
      prev: "Previous",
      exitTitle: "Exit App?",
      exitText: "Do you want to leave the app?",
      cancel: "Cancel",
      exit: "Exit"
    }

  };

  const t = k =>
    (T[lang] || T.en)[k] || k;

  const esc = x =>
    String(x ?? "").replace(
      /[&<>"']/g,
      m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[m])
    );

  /* =========================================================
     MATERIAL HELPERS
     ========================================================= */

  function itemsOf(s) {

    return [
      ...(Array.isArray(s?.[3]) ? s[3] : []),
      ...(Array.isArray(s?.[4])
        ? s[4].flatMap(g =>
            Array.isArray(g?.[1])
              ? g[1]
              : []
          )
        : [])
    ];

  }

  /* =========================================================
     ESTIMATE STORAGE
     ========================================================= */

  function read() {

    try {
      return JSON.parse(
        localStorage.getItem(storeKey) || "[]"
      );
    }

    catch {
      return [];
    }

  }

  function save(a) {

    localStorage.setItem(
      storeKey,
      JSON.stringify(a)
    );

  }

  /* =========================================================
     APP STATE STORAGE
     ========================================================= */

  function saveState() {

    try {

      localStorage.setItem(
        stateKey,
        JSON.stringify({
          page,
          stageIndex,
          itemIndex,
          view,
          stageView,
          draft
        })
      );

    }

    catch {}

  }

  function restoreState() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(stateKey) || "null"
        );

      if (!saved) return;

      if (
        ["home", "stage", "item", "estimate", "calculator", "settings"]
          .includes(saved.page)
      ) {
        page = saved.page;
      }

      if (Number.isInteger(saved.stageIndex)) {
        stageIndex = saved.stageIndex;
      }

      if (Number.isInteger(saved.itemIndex)) {
        itemIndex = saved.itemIndex;
      }

      if (typeof saved.view === "string") {
        view = saved.view;
      }

      if (typeof saved.stageView === "string") {
        stageView = saved.stageView;
      }

      if (
        saved.draft &&
        typeof saved.draft === "object"
      ) {
        draft = saved.draft;
      }

    }

    catch {}

  }

  /* =========================================================
     TOAST
     ========================================================= */

  function toast(x) {

    const e =
      document.createElement("div");

    e.className = "toast";
    e.textContent = x;

    document.body.appendChild(e);

    setTimeout(
      () => e.remove(),
      1600
    );

  }

  /* =========================================================
     THEME
     ========================================================= */

  function theme() {

    document.body.dataset.theme =
      localStorage.getItem(themeKey) ||
      C.theme?.default ||
      "dark";

  }

  /* =========================================================
     COMMON UI
     ========================================================= */

  function applyCommon() {

    theme();

    const u = C.ui || {};

    [
      [$("#menuBtn"), u.menu],
      [$("#langBtn"), u.languageButton],
      [$("#bottomNav"), u.bottomNav]
    ].forEach(([e, on]) => {

      if (e) {
        e.style.display =
          on === false ? "none" : "";
      }

    });

    $$("#bottomNav [data-page]")
      .forEach(b => {

        b.classList.toggle(
          "active",
          b.dataset.page === page
        );

      });

  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function navigate(nextPage, nextStage = stageIndex, nextItem = itemIndex) {

    page = nextPage;
    stageIndex = nextStage;
    itemIndex = nextItem;

    saveState();

    history.pushState(
      {
        page,
        stageIndex,
        itemIndex
      },
      "",
      location.href
    );

    render();

  }

  function nav() {

    $$("[data-page]")
      .forEach(b => {

        b.onclick = () => {

          const target =
            b.dataset.page;

          closeDrawer();

          navigate(
            target,
            target === "home" ? -1 : stageIndex,
            target === "home" ? -1 : itemIndex
          );

        };

      });

    $("#menuBtn")
      ?.addEventListener(
        "click",
        openDrawer
      );

    $("#closeMenu")
      ?.addEventListener(
        "click",
        closeDrawer
      );

    $("#drawerOverlay")
      ?.addEventListener(
        "click",
        closeDrawer
      );

    $("#langBtn")
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

          saveState();
          render();

        }
      );

  }

  function openDrawer() {

    $("#drawer")
      ?.classList.add("open");

    $("#drawerOverlay")
      ?.classList.add("show");

    $("#drawer")
      ?.setAttribute(
        "aria-hidden",
        "false"
      );

  }

  function closeDrawer() {

    $("#drawer")
      ?.classList.remove("open");

    $("#drawerOverlay")
      ?.classList.remove("show");

    $("#drawer")
      ?.setAttribute(
        "aria-hidden",
        "true"
      );

  }

  /* =========================================================
     VIEW MODES
     ========================================================= */

  function views() {

    const map = [

      ["grid", "▦", "Grid"],
      ["list", "☰", "List"],
      ["compact", "≡", "Compact"],
      ["large", "▣", "Large"],
      ["mini", "☷", "Mini"],
      ["two-column", "▤", "2 Column"],
      ["horizontal", "↔", "Horizontal"],
      ["icon-list", "◉", "Icon List"],
      ["timeline", "⌁", "Timeline"],
      ["dense", "▤", "Dense"]

    ];

    return map
      .filter(x => {

        const key =
          x[0].replace(/-/g, "");

        return C.views?.[key] !== false;

      })
      .map(x => ({

        id: x[0],
        icon: x[1],
        name: x[2]

      }));

  }

  function currentViewSymbol(type = "material") {

    const current =
      type === "stage"
        ? stageView
        : view;

    return (
      views().find(
        v => v.id === current
      )?.icon || "▦"
    );

  }

  /* =========================================================
     HOME / STAGE LIST
     ========================================================= */

  function home() {

    return `
      <section class="page">

        <div class="hero">

          <div class="heroLogo">
  <img
    src="logo.png"
    alt="Sandeep ElectroFix Logo"
  >
</div>

          <h1>
            ${esc(
              C.businessName ||
              "Sandeep ElectroFix"
            )}
          </h1>

          <div class="tagline">
            ${esc(
              C.tagline ||
              "Powering Your Trust"
            )}
          </div>

          <p>
            ${esc(
              C.appName ||
              "Estimate List"
            )}
            •
            ${M.reduce(
              (n, s) =>
                n + itemsOf(s).length,
              0
            )}
            ${t("items")}
          </p>

        </div>

        ${
          C.ui?.search !== false
            ? `
              <div class="searchBox">

                ⌕

                <input
                  id="search"
                  placeholder="${esc(
                    t("search")
                  )}"
                  autocomplete="off"
                >

                <button
                  id="clearSearch"
                  type="button"
                >
                  ×
                </button>

              </div>
            `
            : ""
        }

        ${
          C.ui?.viewSwitch !== false
            ? `
              <div
                class="viewSelector stageViewSelector"
                id="stageViewSelector"
              >

                <button
                  class="viewSelectorHead"
                  id="stageViewBtn"
                  type="button"
                  aria-expanded="false"
                  aria-label="Change stage view"
                >

                  <span
                    class="viewOnlySymbol"
                  >
                    ${currentViewSymbol("stage")}
                  </span>

                </button>

                <div
                  class="viewOptions"
                  id="stageViewOptions"
                  hidden
                >

                  ${views()
                    .map(v => `
                      <button
                        class="
                          viewOption
                          ${
                            stageView === v.id
                              ? "active"
                              : ""
                          }
                        "
                        data-stage-view="${esc(
                          v.id
                        )}"
                        type="button"
                      >

                        <span
                          class="viewOptionIcon"
                        >
                          ${v.icon}
                        </span>

                        <span>
                          ${esc(v.name)}
                        </span>

                        ${
                          stageView === v.id
                            ? `
                              <span
                                class="viewCheck"
                              >
                                ✓
                              </span>
                            `
                            : ""
                        }

                      </button>
                    `)
                    .join("")}

                </div>

              </div>
            `
            : ""
        }

        <div
          id="stageGrid"
          class="stageGrid ${esc(stageView)}"
        >

          ${M.map((s, i) => `

            <button
              class="stageCard"
              data-stage="${i}"
              type="button"
            >

              <span class="stageNo">
                ${esc(s[0])}
              </span>

              <b>
                ${esc(s[1])}
              </b>

              <small>
                ${esc(s[2] || "")}
              </small>

              <span>
                ${itemsOf(s).length}
                ${t("items")}
              </span>

            </button>

          `).join("")}

        </div>

      </section>
    `;

  }

  function renderHome() {

    $("#main").innerHTML = home();

    $$("[data-stage]")
      .forEach(b => {

        b.onclick = () => {

          stageIndex =
            +b.dataset.stage;

          itemIndex = -1;
          draft = {};

          navigate(
            "stage",
            stageIndex,
            -1
          );

        };

      });

    const q = $("#search");

    q?.addEventListener(
      "input",
      () => filterStages(q.value)
    );

    $("#clearSearch")
      ?.addEventListener(
        "click",
        () => {

          q.value = "";
          filterStages("");

        }
      );

    /* Stage View Selector */

    const btn =
      $("#stageViewBtn");

    const options =
      $("#stageViewOptions");

    const selector =
      $("#stageViewSelector");

    btn?.addEventListener(
      "click",
      () => {

        if (!options) return;

        const open =
          !options.hidden;

        options.hidden = open;

        btn.setAttribute(
          "aria-expanded",
          String(!open)
        );

        selector?.classList.toggle(
          "open",
          !open
        );

      }
    );

    $$("[data-stage-view]")
      .forEach(b => {

        b.onclick = () => {

          stageView =
            b.dataset.stageView;

          localStorage.setItem(
            stageViewKey,
            stageView
          );

          saveState();
          renderHome();

        };

      });

  }

  function filterStages(q) {

    q =
      q.trim().toLowerCase();

    $$(".stageCard")
      .forEach(b => {

        b.style.display =
          !q ||
          b.textContent
            .toLowerCase()
            .includes(q)
            ? ""
            : "none";

      });

  }

  /* =========================================================
     MATERIAL STAGE
     ========================================================= */

  function stage() {

    const s =
      M[stageIndex];

    if (!s) {

      page = "home";
      stageIndex = -1;
      itemIndex = -1;

      saveState();
      return render();

    }

    const its =
      itemsOf(s);

    const selected =
      views().find(
        v => v.id === view
      ) || views()[0];

    $("#main").innerHTML = `

      <section class="page">

        <button
          class="back"
          id="backStage"
        >
          ← ${t("back")}
        </button>

        <div class="stageHead">

          <div>

            <h1>
              ${esc(s[1])}
            </h1>

            <p>
              ${esc(s[0])}
              •
              ${its.length}
              ${t("items")}
            </p>

          </div>

        </div>

        ${
          C.ui?.viewSwitch !== false
            ? `
              <div
                class="viewSelector"
                id="viewSelector"
              >

                <button
                  class="viewSelectorHead"
                  id="viewSelectorBtn"
                  type="button"
                  aria-expanded="false"
                  aria-label="Change material view"
                >

                  <span
                    class="viewOnlySymbol"
                  >
                    ${selected.icon}
                  </span>

                </button>

                <div
                  class="viewOptions"
                  id="viewOptions"
                  hidden
                >

                  ${views()
                    .map(v => `

                      <button
                        class="
                          viewOption
                          ${
                            view === v.id
                              ? "active"
                              : ""
                          }
                        "
                        data-view="${esc(
                          v.id
                        )}"
                        type="button"
                      >

                        <span
                          class="viewOptionIcon"
                        >
                          ${v.icon}
                        </span>

                        <span>
                          ${esc(v.name)}
                        </span>

                        ${
                          view === v.id
                            ? `
                              <span
                                class="viewCheck"
                              >
                                ✓
                              </span>
                            `
                            : ""
                        }

                      </button>

                    `)
                    .join("")}

                </div>

              </div>
            `
            : ""
        }

        <div
          class="itemGrid ${esc(view)}"
        >

          ${its.map((it, i) => `

            <button
              class="itemCard"
              data-item="${i}"
              type="button"
            >

              <b>
                ${esc(it[0])}
              </b>

              <span>
                ${t("open")}
              </span>

            </button>

          `).join("")}

        </div>

      </section>

    `;

    /* Back */

    $("#backStage").onclick = () => {

      draft = {};

      navigate(
        "home",
        -1,
        -1
      );

    };

    /* Open Item */

    $$("[data-item]")
      .forEach(b => {

        b.onclick = () => {

          itemIndex =
            +b.dataset.item;

          draft = {};

          navigate(
            "item",
            stageIndex,
            itemIndex
          );

        };

      });

    /* Material View Selector */

    const viewBtn =
      $("#viewSelectorBtn");

    const viewOptions =
      $("#viewOptions");

    const viewSelector =
      $("#viewSelector");

    viewBtn?.addEventListener(
      "click",
      () => {

        if (!viewOptions) return;

        const isOpen =
          !viewOptions.hidden;

        viewOptions.hidden =
          isOpen;

        viewBtn.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );

        viewSelector?.classList.toggle(
          "open",
          !isOpen
        );

      }
    );

    $$("[data-view]")
      .forEach(b => {

        b.onclick = () => {

          view =
            b.dataset.view;

          localStorage.setItem(
            viewKey,
            view
          );

          saveState();

          render();

        };

      });

  }

  /* =========================================================
     FIELD
     ========================================================= */

  function field(label, opts) {

    opts =
      Array.isArray(opts)
        ? opts
        : [];

    if (
      opts.length === 1 &&
      /^User Input/i.test(
        String(opts[0])
      )
    ) {

      return `
        <label class="field">

          <span>
            ${esc(label)}
          </span>

          <input
            data-input="${esc(label)}"
            placeholder="${esc(opts[0])}"
            value="${esc(
              draft[label] || ""
            )}"
          >

        </label>
      `;

    }

    return `
      <div class="field">

        <span>
          ${esc(label)}
        </span>

        <div class="choices">

          ${opts.map(o => `

            <button
              class="
                choice
                ${
                  draft[label] === o
                    ? "selected"
                    : ""
                }
              "
              data-label="${esc(label)}"
              data-value="${esc(o)}"
              type="button"
            >
              ${esc(o)}
            </button>

          `).join("")}

        </div>

      </div>
    `;

  }

  /* =========================================================
     ITEM PAGE
     ========================================================= */

  function item() {

    const s =
      M[stageIndex];

    const it =
      itemsOf(s)[itemIndex];

    if (!it) {

      page = "stage";
      saveState();

      return render();

    }

    const name =
      it[0];

    const fields =
      it[1] || [];

    const units =
      it[2] || [];

    const brands =
      it[3] || [];

    $("#main").innerHTML = `

      <section class="page">

        <button
          class="back"
          id="backItem"
        >
          ← ${t("back")}
        </button>

        <div class="itemHead">

          <div>

            <small>
              ${esc(s[0])}
            </small>

            <h1>
              ${esc(name)}
            </h1>

          </div>

        </div>

        <div class="formCard">

          ${fields
            .map(f =>
              field(
                f[0],
                f[1]
              )
            )
            .join("")}

          <div class="field">

            <span>
              ${t("quantity")} *
            </span>

            <div class="qtyRow">

              <button
                id="qtyMinus"
                type="button"
              >
                −
              </button>

              <input
                id="qty"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                value="${esc(
                  draft.qty || ""
                )}"
                placeholder="${esc(
                  t("quantity")
                )}"
              >

              <button
                id="qtyPlus"
                type="button"
              >
                +
              </button>

            </div>

            <div class="qtyQuick">

              <button
                data-q="10"
                type="button"
              >
                10
              </button>

              <button
                data-q="20"
                type="button"
              >
                20
              </button>

              <button
                data-q="30"
                type="button"
              >
                30
              </button>

              <button
                data-q="50"
                type="button"
              >
                50
              </button>

              <button
                data-q="100"
                type="button"
              >
                100
              </button>

            </div>

          </div>

          <label class="field">

            <span>
              ${t("unit")}
            </span>

            <select id="unit">

              <option value="">
                — ${t("optional")} —
              </option>

              ${units.map(x => `

                <option
                  ${
                    draft.unit === x
                      ? "selected"
                      : ""
                  }
                  value="${esc(x)}"
                >
                  ${esc(x)}
                </option>

              `).join("")}

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
                    ＋ Add Price
                  </button>

                  <div
                    id="priceBox"
                    class="priceBox"
                    hidden
                  >

                    <label class="field">

                      <span>
                        Price
                        (${t("optional")})
                      </span>

                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value="${esc(
                          draft.price || ""
                        )}"
                      >

                    </label>

                  </div>

                </div>
              `
              : ""
          }

          <label class="field">

            <span>
              ${t("brand")}
              <em>
                (${t("optional")})
              </em>
            </span>

            <select id="brand">

              <option value="">
                — ${t("optional")} —
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
                  .map(x => `

                    <option
                      ${
                        draft.brand === x
                          ? "selected"
                          : ""
                      }
                      value="${esc(x)}"
                    >
                      ${esc(x)}
                    </option>

                  `)
                  .join("")
              }

            </select>

          </label>

          <div class="itemActions">

            <button
              class="secondary"
              id="clearDraftBtn"
              type="button"
            >
              × ${t("clearItem")}
            </button>

            <button
              class="secondary"
              id="prevBtn"
              type="button"
            >
              ← ${t("prev")}
            </button>

            <button
              class="secondary"
              id="nextBtn"
              type="button"
            >
              ${t("next")} →
            </button>

            <button
              class="primary"
              id="addBtn"
              type="button"
            >
              ✓ ${t("add")}
            </button>

          </div>

          <p class="hint">
            ${t("required")}.
            ${
              lang === "hi"
                ? "बाकी सभी फ़ील्ड वैकल्पिक हैं"
                : "All other fields are optional"
            }.
          </p>

        </div>

      </section>

    `;

    bindItem(
      s,
      name
    );

  }

  /* =========================================================
     ITEM BINDINGS
     ========================================================= */

  function bindItem(s, name) {

    /* Choices */

    $$(".choice")
      .forEach(b => {

        b.onclick = () => {

          b.parentElement
            .querySelectorAll(
              ".choice"
            )
            .forEach(x =>
              x.classList.remove(
                "selected"
              )
            );

          b.classList.add(
            "selected"
          );

          draft[
            b.dataset.label
          ] =
            b.dataset.value;

          saveState();

        };

      });

    /* User inputs */

    $$("[data-input]")
      .forEach(e => {

        e.oninput = () => {

          draft[
            e.dataset.input
          ] = e.value;

          saveState();

        };

      });

    const q = $("#qty");

    /* Quantity */

    $("#qtyMinus").onclick = () => {

      q.value =
        Math.max(
          1,
          (Number(q.value) || 1) - 1
        );

      draft.qty = q.value;
      saveState();

    };

    $("#qtyPlus").onclick = () => {

      q.value =
        (Number(q.value) || 0) + 1;

      draft.qty = q.value;
      saveState();

    };

    q.oninput = () => {

      draft.qty =
        q.value;

      saveState();

    };

    $$("[data-q]")
      .forEach(b => {

        b.onclick = () => {

          q.value =
            b.dataset.q;

          draft.qty =
            q.value;

          saveState();

        };

      });

    /* Unit */

    $("#unit").onchange = () => {

      draft.unit =
        $("#unit").value;

      saveState();

    };

    /* Brand */

    $("#brand").onchange = () => {

      draft.brand =
        $("#brand").value;

      saveState();

    };

    /* Price */

    $("#price")
      ?.addEventListener(
        "input",
        e => {

          draft.price =
            e.target.value;

          saveState();

        }
      );

    /* Price box */

    $("#priceToggle")
      ?.addEventListener(
        "click",
        () => {

          $("#priceBox").hidden =
            false;

          $("#priceToggle").hidden =
            true;

        }
      );

    /* Clear current item */

    $("#clearDraftBtn")
      ?.addEventListener(
        "click",
        () => {

          draft = {};

          saveState();

          render();

          toast(
            lang === "hi"
              ? "Current item clear हो गया"
              : "Current item cleared"
          );

        }
      );

    /* Back */

    $("#backItem")
      .onclick = () => {

        syncDraft();

        navigate(
          "stage",
          stageIndex,
          -1
        );

      };

    /* Previous */

    $("#prevBtn")
      .onclick = () => {

        if (itemIndex > 0) {

          syncDraft();

          itemIndex--;

          draft = {};

          navigate(
            "item",
            stageIndex,
            itemIndex
          );

          scrollTop();

        }

      };

    /* Next */

    $("#nextBtn")
      .onclick = () => {

        if (
          itemIndex <
          itemsOf(s).length - 1
        ) {

          syncDraft();

          itemIndex++;

          draft = {};

          navigate(
            "item",
            stageIndex,
            itemIndex
          );

          scrollTop();

        }

      };

    /* Add */

    $("#addBtn")
      .onclick = () =>
        add(s, name);

  }

  /* =========================================================
     SYNC DRAFT
     ========================================================= */

  function syncDraft() {

    draft.qty =
      $("#qty")?.value ||
      draft.qty ||
      "";

    draft.unit =
      $("#unit")?.value ||
      draft.unit ||
      "";

    draft.brand =
      $("#brand")?.value ||
      draft.brand ||
      "";

    draft.price =
      $("#price")?.value ||
      draft.price ||
      "";

    $$("[data-input]")
      .forEach(e => {

        draft[
          e.dataset.input
        ] = e.value;

      });

    $(".choice.selected")
      ?.parentElement
      ?.querySelectorAll(
        ".choice.selected"
      );

    $$(".choice.selected")
      .forEach(e => {

        draft[
          e.dataset.label
        ] =
          e.dataset.value;

      });

    saveState();

  }

  /* =========================================================
     ADD TO ESTIMATE
     ========================================================= */

  function add(s, name) {

    syncDraft();

    if (
      C.rules?.quantityRequired !== false &&
      (
        !draft.qty ||
        Number(draft.qty) <= 0
      )
    ) {

      toast(
        t("required")
      );

      $("#qty")?.focus();

      return;

    }

    const options = {
      ...draft
    };

    delete options.qty;
    delete options.unit;
    delete options.brand;
    delete options.price;

    const a = read();

    a.push({

      id: Date.now(),

      stage: s[0],

      stageName: s[1],

      item: name,

      qty: String(
        draft.qty
      ),

      unit:
        draft.unit || "",

      brand:
        draft.brand || "",

      price:
        draft.price || "",

      options,

      createdAt:
        new Date().toISOString()

    });

    save(a);

    toast(
      t("added")
    );

    if (
      C.navigation?.autoNextAfterAdd !== false &&
      itemIndex <
        itemsOf(s).length - 1
    ) {

      itemIndex++;

      draft = {};

      saveState();

      setTimeout(
        () => {

          render();
          scrollTop();

        },
        180
      );

    }

    else {

      page = "stage";
      itemIndex = -1;
      draft = {};

      saveState();

      setTimeout(
        render,
        180
      );

    }

  }

  /* =========================================================
     ESTIMATE
     ========================================================= */

  function estimate() {

    const a = read();

    $("#main").innerHTML = `

      <section class="page">

        <div class="hero">

          <h1>
            ${t("estimate")}
          </h1>

          <p>
            ${a.length}
            ${t("items")}
          </p>

        </div>

        ${
          a.length
            ? `

              <div class="estimateList">

                ${a.map((x, i) => `

                  <article
                    class="estimateItem"
                  >

                    <div
                      class="estimateTop"
                    >

                      <b>
                        ${esc(x.item)}
                      </b>

                      <span>
                        ${esc(x.stage)}
                      </span>

                    </div>

                    <div
                      class="estimateMeta"
                    >

                      ${esc(x.qty)}
                      ${esc(x.unit || "")}

                      ${
                        x.brand
                          ? " • " +
                            esc(x.brand)
                          : ""
                      }

                      ${
                        x.price
                          ? " • ₹ " +
                            esc(x.price)
                          : ""
                      }

                    </div>

                    <div
                      class="estimateActions"
                    >

                      <button
                        data-edit="${i}"
                      >
                        ${t("edit")}
                      </button>

                      <button
                        data-del="${i}"
                      >
                        ${t("delete")}
                      </button>

                    </div>

                  </article>

                `).join("")}

              </div>

              <button
                class="danger"
                id="clearEstimate"
              >
                ${t("clear")}
              </button>

            `
            : `
              <div class="empty">
                ${t("empty")}
              </div>
            `
        }

      </section>

    `;

    $$("[data-del]")
      .forEach(b => {

        b.onclick = () => {

          const x =
            read();

          x.splice(
            +b.dataset.del,
            1
          );

          save(x);

          render();

        };

      });

    $$("[data-edit]")
      .forEach(b =>
        b.onclick = () =>
          editEstimate(
            +b.dataset.edit
          )
      );

    $("#clearEstimate")
      ?.addEventListener(
        "click",
        () => {

          if (
            confirm(
              "Clear estimate?"
            )
          ) {

            save([]);

            render();

          }

        }
      );

  }

  /* =========================================================
     EDIT ESTIMATE
     ========================================================= */

  function editEstimate(i) {

    const x =
      read()[i];

    const si =
      M.findIndex(
        s => s[0] === x.stage
      );

    const ii =
      itemsOf(
        M[si] || []
      ).findIndex(
        it => it[0] === x.item
      );

    if (
      si < 0 ||
      ii < 0
    ) return;

    stageIndex = si;
    itemIndex = ii;

    draft = {
      ...x,
      ...x.options
    };

    navigate(
      "item",
      si,
      ii
    );

  }

  /* =========================================================
     CALCULATOR
     ========================================================= */

  function calculator() {

    $("#main").innerHTML = `

      <section class="page">

        <div class="hero">

          <h1>
            ${t("calculator")}
          </h1>

          <p>
            Electrical formulas
          </p>

        </div>

        <div class="formCard">

          <div class="calcGrid">

            <label class="field">

              <span>
                ${t("power")}
              </span>

              <input
                id="calcP"
                type="number"
              >

            </label>

            <label class="field">

              <span>
                ${t("voltage")}
              </span>

              <input
                id="calcV"
                type="number"
                value="230"
              >

            </label>

          </div>

          <button
            class="primary"
            id="calcBtn"
          >
            ${t("calculate")}
          </button>

          <div
            class="calcResult"
            id="calcResult"
          >
            I = P ÷ V
          </div>

          <div class="formula">

            P = V × I
            <br>

            I = P ÷ V
            <br>

            V = P ÷ I
            <br>

            R = V ÷ I

          </div>

        </div>

      </section>

    `;

    $("#calcBtn")
      .onclick = () => {

        const p =
          +$("#calcP").value;

        const v =
          +$("#calcV").value;

        $("#calcResult")
          .textContent =
          p > 0 && v > 0
            ? `${t("current")} = ${(p / v).toFixed(2)} A`
            : "Enter Power and Voltage";

      };

  }

  /* =========================================================
     SETTINGS
     ========================================================= */

  function settings() {

    $("#main").innerHTML = `

      <section class="page">

        <div class="hero">

          <h1>
            ${t("settings")}
          </h1>

        </div>

        <div class="settingsList">

          <div
            class="settingRow toggleRow"
          >

            <div>

              <b>
                Theme
              </b>

              <small>
                ${t("dark")}
                /
                ${t("light")}
              </small>

            </div>

            <button
              id="themeBtn"
              class="secondary"
              style="width:auto"
            >
              ${
                (
                  localStorage.getItem(
                    themeKey
                  ) || "dark"
                ) === "dark"
                  ? t("dark")
                  : t("light")
              }
            </button>

          </div>

          <div class="settingRow">

            <b>
              Language / भाषा
            </b>

            <small>
              ${
                lang === "hi"
                  ? "हिंदी"
                  : "English"
              }
            </small>

          </div>

          <div class="settingRow">

            <b>
              Material Views
            </b>

            <small>
              ${views().length}
              views enabled
            </small>

          </div>

          <button
            class="danger"
            id="resetApp"
          >
            ${t("reset")}
          </button>

        </div>

      </section>

    `;

    $("#themeBtn")
      .onclick = () => {

        localStorage.setItem(
          themeKey,
          (
            localStorage.getItem(
              themeKey
            ) || "dark"
          ) === "dark"
            ? "light"
            : "dark"
        );

        render();

      };

    $("#resetApp")
      .onclick = () => {

        if (
          confirm(
            "Reset saved estimate and preferences?"
          )
        ) {

          localStorage.removeItem(
            storeKey
          );

          localStorage.removeItem(
            langKey
          );

          localStorage.removeItem(
            viewKey
          );

          localStorage.removeItem(
            stageViewKey
          );

          localStorage.removeItem(
            themeKey
          );

          localStorage.removeItem(
            stateKey
          );

          location.reload();

        }

      };

  }

  /* =========================================================
     EXIT WARNING
     ---------------------------------------------------------
     Browser normally controls actual tab/app closing.
     We intercept Back navigation at the root level.
     ========================================================= */

  function showExitWarning() {

    return window.confirm(
      `${t("exitTitle")}\n\n${t("exitText")}`
    );

  }

  function goBackOneStep() {

    if (page === "item") {

      syncDraft();

      page = "stage";
      itemIndex = -1;
      draft = {};

      saveState();
      render();

      return;

    }

    if (page === "stage") {

      page = "home";
      stageIndex = -1;
      itemIndex = -1;
      draft = {};

      saveState();
      render();

      return;

    }

    if (page !== "home") {

      page = "home";
      stageIndex = -1;
      itemIndex = -1;
      draft = {};

      saveState();
      render();

      return;

    }

    if (showExitWarning()) {

      /*
       * Browser / Android controls the
       * actual page closing.
       *
       * We do not force window.close().
       */

      history.back();

    }

  }

  /* =========================================================
     BROWSER / ANDROID BACK
     ========================================================= */

  function setupBackProtection() {

    history.replaceState(
      {
        appRoot: true
      },
      "",
      location.href
    );

    window.addEventListener(
      "popstate",
      () => {

        if (
          internalNavigation
        ) {

          internalNavigation =
            false;

          return;

        }

        goBackOneStep();

        history.pushState(
          {
            appRoot: false
          },
          "",
          location.href
        );

      }
    );

  }

  /* =========================================================
     SCROLL TOP
     ========================================================= */

  function scrollTop() {

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

  }

  /* =========================================================
     RENDER
     ========================================================= */

  function render() {

    saveState();

    applyCommon();

    if (page === "home") {

      renderHome();

    }

    else if (page === "stage") {

      stage();

    }

    else if (page === "item") {

      item();

    }

    else if (page === "estimate") {

      estimate();

    }

    else if (page === "calculator") {

      calculator();

    }

    else {

      settings();

    }

    nav();

  }

  /* =========================================================
     STARTUP
     ========================================================= */

  restoreState();

  if (
    stageIndex >= M.length
  ) {

    page = "home";
    stageIndex = -1;
    itemIndex = -1;

  }

  if (
    page === "item" &&
    (
      stageIndex < 0 ||
      !M[stageIndex] ||
      itemIndex < 0 ||
      itemIndex >=
        itemsOf(
          M[stageIndex]
        ).length
    )
  ) {

    page = "home";
    stageIndex = -1;
    itemIndex = -1;
    draft = {};

  }

  setupBackProtection();

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      render
    );

  }

  else {

    render();

  }

  document.addEventListener("click", (e) => {
  const selectors = [
    "#viewSelector",
    "#stageViewSelector"
  ];

  selectors.forEach(selector => {
    const box = document.querySelector(selector);

    if (!box) return;

    const options = box.querySelector(".viewOptions");

    if (!options || options.hidden) return;

    if (!box.contains(e.target)) {
      options.hidden = true;
    }
  });
});
})();


