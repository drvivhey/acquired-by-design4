# Wellspring Profit Index

Marketing landing page for the **Wellspring Profit Index** founder cohort, by
Wellspring Exit Advisory.

This is a rebuilt, dependency-free static site. There is **no build step and no
framework** — it is plain HTML, CSS and JavaScript that can be opened directly
in a browser or served by any static host.

## Structure

```
.
├── index.html              # The page (semantic markup, inline layout styles)
├── assets/
│   ├── css/
│   │   ├── fonts.css       # Self-hosted @font-face (Poppins + IBM Plex Mono)
│   │   └── styles.css      # Base styles, interaction states, responsive rules
│   ├── js/
│   │   └── main.js         # Waitlist shortcut + Apply-form submission
│   ├── fonts/              # Self-hosted .woff2 files (no external font CDN)
│   └── img/                # Logos, advisor photo, favicon
├── robots.txt
├── sitemap.xml
└── .github/workflows/deploy.yml   # Publishes to GitHub Pages
```

Everything the page needs is bundled locally — it makes **no external network
requests** for fonts or assets, which keeps it fast and private.

## Developing locally

No tooling required. Either open `index.html` directly, or serve the folder so
relative paths and `fetch` behave exactly as in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Form submission

The Apply form (`#apply-form`) posts to a **Google Apps Script Web App** using
the same simple `no-cors`, `text/plain` POST the project has always used — this
avoids the CORS preflight that Apps Script Web Apps don't answer. The endpoint
and payload live in [`assets/js/main.js`](assets/js/main.js):

- **Endpoint:** `SHEETS_WEB_APP_URL` — the deployed Apps Script `/exec` URL.
- **Payload:** the form is serialised by each field's `name` attribute
  (`fullName`, `email`, `phone`, `businessName`, `primaryGoal`). If the target
  sheet expects different column headers, adjust the keys in `main.js` to match.

Because the response is opaque (`no-cors`), the UI optimistically shows a
confirmation after posting. The "Join the waitlist" link preselects the
`Waitlist` goal so those submissions are distinguishable in the sheet.

## Deployment

Deployed via **Netlify** using its Git integration — connect this repository once
in the Netlify dashboard and every push to `main` publishes automatically. There
is no build step: `netlify.toml` sets `publish = "."` and serves the repository
root as-is, with long-lived caching for fonts/images and baseline security
headers. Point the `wellspringindex.co.uk` domain at the Netlify site under
**Site configuration → Domain management**.

The site is served in production at <https://wellspringindex.co.uk>.
