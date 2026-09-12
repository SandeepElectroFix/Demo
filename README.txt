# Sandeep ElectroFix — UI Upgrade

## Files
- `index.html` — upgraded UI shell
- `style.css` — Black + Electric Blue + Gold responsive design
- `app.js` — stage/material selection, search, options, estimate, LocalStorage, copy, print/PDF

## Important
Your existing material database should remain unchanged.

Load your existing database BEFORE `app.js`, for example:

<script src="database.js"></script>
<script src="app.js"></script>

The engine reads:
`window.ESTIMATE_LIST`

If your database is already inside the current HTML, move/keep it before `app.js`.

The fallback 69 demo materials only appear when `window.ESTIMATE_LIST` is missing, so they do not overwrite a real database.
