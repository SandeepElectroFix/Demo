SANDEEP ELECTROFIX — ESTIMATE LIST
=================================

Included files:
- index.html   Main app structure
- style.css    Dark navy / electric cyan / gold responsive UI
- config.js    App preferences and storage keys
- app.js       Navigation, material editor, estimate list, search, filter, calculator, language and theme

IMPORTANT: Keep your complete master data in a file named exactly:
    material.js

Use the complete material.js code you supplied in the chat. Save it beside index.html, style.css, config.js and app.js.
Do not paste the master data into app.js. This app reads window.MATERIALS from material.js and does not modify the master list.

To run:
1. Put all five files in the same folder.
2. Open index.html in a browser. For best PWA / local-storage behavior, host the folder on GitHub Pages or another static web host.

Notes:
- Estimate entries are stored in localStorage on this device/browser.
- The app supports Hindi and English modes, dark/light theme, a single estimate list, editable line items, optional brand/price, and basic electrical calculators.
- This is a first working UI build. Test the material flow against your master list before publishing.
