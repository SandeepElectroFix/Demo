/* Sandeep ElectroFix - Estimate List
   Central UI and behaviour configuration. */
window.APP_CONFIG = {
  appName: "Estimate List",
  businessName: "Sandeep ElectroFix",
  tagline: "Powering Your Trust",
  defaultLanguage: "hi",
  storageKey: "sandeepEstimateItems",
  languageKey: "sandeepMaterialLang",
  themeKey: "sandeepTheme",
  viewKey: "sandeepMaterialView",
  ui: {
    splash: true, menu: true, languageButton: true, bottomNav: true,
    estimate: true, calculator: true, settings: true, viewSwitch: true,
    priceField: true, priceInitiallyHidden: true
  },
  rules: {
    quantityRequired: true, otherFieldsOptional: true, autoSave: true,
    priceOptional: true, skipBrandOption: false
  },
  materialViews: [
    "grid", "list", "compact", "large", "mini", "two-column",
    "horizontal", "icon-list", "timeline", "dense"
  ]
};
