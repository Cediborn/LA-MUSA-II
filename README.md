# Get Labour Company Limited (GLCL) — Website

Complete static website for GLCL — *Your Complete Labour Solution* — built from the
**GLCL Master Website Build Prompt** with the supplied GLCL media archive.

Live: **https://cediborn.github.io/LA-MUSA-II/** (GitHub Pages, branch `main`)
Company site of record: <https://getlabour.org>

---

## 1. What is in here

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero, audience split (businesses / workers), services preview, process, safety, CTA |
| Services | `services.html` | Skilled and non-skilled labour, roles, matching process |
| About & team | `about.html` | Story, mission/vision, values, approved staff directory |
| Gallery | `gallery.html` | Workplace & port operations, safety equipment, historical photos |
| Contact | `contact.html` | Email, phones, address, Plus Code, socials, privacy note |
| Labour request | `request.html` | Business-facing request form with configurable backend adapter |
| Worker registration | `register.html` | Official non-permanent staff form → generates the PDF |
| Staff biographies | `bios.html` | **Discreet** detailed bios — unlinked, `noindex`, off by default |
| Not found | `404.html` | Custom 404 (GitHub Pages serves it automatically) |

No build step. Plain HTML, one stylesheet and ES modules — GitHub Pages serves the
repository directly.

```
glcl-website/
├── index.html … 404.html
├── assets/
│   ├── css/main.css               design system + components
│   ├── js/
│   │   ├── data.js                structured data: nav, team, services, values, social, roles
│   │   ├── site.js                loader, mobile nav, scroll reveal, social/contact injection
│   │   ├── config.js              runtime config (API base URL, mock mode, bios visibility)
│   │   ├── api.js                 request-form transport layer (fetch + mock mode)
│   │   ├── request-form.js        validation + submit states for request.html
│   │   ├── register.js            validation + uppercase + declaration for register.html
│   │   ├── pdf.js                 PDF layout maths + jsPDF generation
│   │   ├── services.js            renders service role lists from data.js
│   │   ├── about.js               renders values + staff directory from data.js
│   │   └── bios-data.js / bios.js discreet biographies + access gate
│   ├── vendor/jspdf.umd.min.js    vendored jsPDF 2.5.2 (works offline)
│   └── images/                    optimised, renamed copies of the supplied assets
├── robots.txt / sitemap.xml / .nojekyll
└── README.md
```

---

## 2. Running locally

Any static server works (ES modules need HTTP, not `file://`):

```bash
cd glcl-website
python -m http.server 8000        # or: npx serve .
# open http://localhost:8000
```

---

## 3. Deploying (GitHub Pages)

The repository is the site root (`.nojekyll` is included so Pages serves files as-is).

**Option A — branch deployment (simplest)**
1. GitHub → *Settings → Pages*
2. Source: **Deploy from a branch**
3. Branch: `main` / root → Save

**Option B — GitHub Actions**
Settings → Pages → Source: **GitHub Actions**, then use the workflow in
`.github/workflows/pages.yml` (included) which uploads the folder with
`actions/upload-pages-artifact` + `actions/deploy-pages`.

No environment variables or secrets are required for the static site.

---

## 4. Backend connection (labour request form)

GitHub Pages is static hosting — it **cannot** run server-side code. The form talks to
a separate API through a small adapter:

* `assets/js/config.js` — public runtime configuration (no secrets ever go here)
* `assets/js/api.js` — transport layer, payload shape, timeout, mock mode

### Configuration

```js
// assets/js/config.js
window.GLCL_CONFIG = {
  apiBaseUrl: "",                      // ← set to your API origin when it exists
  endpoints: { labourRequest: "/api/labour-request" },
  mockMode: null,                      // null = auto: mock while apiBaseUrl is empty
  timeoutMs: 12000,
  detailedBiosEnabled: false,          // keep false until the owner approves
  detailedBiosAccess: "unlisted",
};
```

With `apiBaseUrl: ""` the form runs in **demo mode**: it validates input, clearly tells
the visitor nothing was transmitted, and never sends data anywhere.

### Request payload

`POST {apiBaseUrl}/api/labour-request` with `Content-Type: application/json`:

```json
{
  "requesterFullName": "Kwame Mensah",
  "companyName": "Tema Shipping Co.",
  "notBusiness": false,
  "email": "kwame@example.com",
  "phone": "+233 24 000 0000",
  "labourCategory": "Skilled | Non-Skilled | Both",
  "role": "Forklift operator",
  "details": "optional free text",
  "source": "getlabour.org/request.html",
  "submittedAt": "2026-01-01T12:00:00.000Z"
}
```

* **2xx** → success state: *"GLCL will review your request and aims to respond within
  24–48 hours."*
* **non-2xx / network failure** → retryable error state with the office phone number.

### Suitable backends

| Option | Notes |
| --- | --- |
| Cloudflare Worker | Free tier, can forward to Gmail / a sheet |
| Google Apps Script (web app) | Writes to Google Sheets, sends email |
| Formspree / Basin / Getform | Drop-in form endpoints |
| Your own VPS / Node / Django | Full control, keep secrets server-side |

**Never** put API keys, database credentials or service tokens in this repository —
everything here is public and readable from the browser.

### Legacy form

The old reference is <https://getlabour.org/GLCL%202.0/request.html>. Its submission
mechanism was never confirmed, so nothing in this build claims email delivery.

---

## 5. Worker registration → PDF

`register.html` mirrors the supplied paper form
(`assets/images/forms/staff-registration-form.png`) exactly:

* Sections 1–4 keep the original wording, order and layout.
* Section 5 inserts the applicant's full name in **uppercase** live, and on the PDF.
* Typed input is auto-capitalised; signature and date stay blank for hand-signing.
* The form PNG is embedded as the A4 page background, so the outer/section borders are
  the original artwork — one continuous border, no redrawn edges.
* Field coordinates were measured from the supplied PNG (px → pt mapping in `pdf.js`);
  each section's label/value divider is handled individually.
* File name: `SURNAME FIRST NAME OTHER NAME's STAFF REGISTRATION FORM.pdf`
  → `MUSAH HARIZALLA BANSUA's STAFF REGISTRATION FORM.pdf`
* The PDF is generated **in the browser** (vendored jsPDF) — nothing is uploaded.
* After download the applicant is told to **print two copies**: one for personal
  records, one to submit at GLCL's main office.

Tested: long names/values, shrink-to-fit, two-line address, empty optional fields,
missing required fields, and print-layout output (A4, no clipping or overlap).

---

## 6. Assets

All imagery comes from the supplied `GLCL Gallery` archive; nothing is stock or AI
generated. Processing applied: resizing, JPEG re-encoding, kebab-case filenames.

| Area | Notes |
| --- | --- |
| Hero | `hero-ship-side.jpg` (chosen hero) + two aerial port images reused on inner pages/gallery |
| Logos | Official transparent PNG and favicon used unmodified, never recoloured |
| Background | `bg/glcl-doodle-background.jpg` — the supplied `image.svg` asset (delivered as JPEG in the archive) |
| Loader | `logo/glcl-loader.svg` — supplied kinetic-compass reveal, shown once per session, skipped for `prefers-reduced-motion` |
| Safety | Helmet, reflector vest, goggles, ear protection, boots, gloves |
| Staff | 10 supplied portraits; the 3 members without portraits get an initials tile (no stock faces) |
| History | "Before GLCL" first, then "Early Days of GLCL"; captions taken from filenames/known facts only |
| Footer credit | Exact supplied gold **CEDI** artwork (transparent padding trimmed only, artwork untouched) |

**Deliberately excluded**

* `GLCL safety wear or gadgets.jpeg` — the flat-lay contains a respirator mask, which the
  brief says not to use without the owner's approval.
* No mention of David Adomako anywhere.
* No org chart, no "now open across Ghana" badge, no invented statistics, testimonials,
  client logos, certifications, office hours or guarantees.

---

## 7. Design system

* **Colour** — only logo colours (indigo `#2f337d`, sky `#6ac5f1`, red `#ed1e24`) plus
  the approved background tones (off-white `#fefdf9`, pale blue-grey `#c7cfe0`).
* **Type** — `Instrument Serif` (display) + `IBM Plex Sans` (text) + `Great Vibes` for
  the "Bans" footer credit; loaded from Google Fonts with system fallbacks.
* **Motion** — everything respects `prefers-reduced-motion`; the footer credit glow
  pulses only when motion is allowed.
* Repeated content lives in `assets/js/data.js`.

---

## 8. Accessibility, privacy, SEO

* Semantic landmarks, single `h1` per page, skip link, visible focus, labelled fields,
  `aria-invalid` / `aria-live` errors, keyboard-operable mobile menu with correct
  `aria-expanded`, Escape to close.
* Tested at 390 / 768 / 1366 / 1440 px widths.
* Page titles, meta descriptions, Open Graph tags, favicon, descriptive `alt` text,
  `robots.txt` + `sitemap.xml`.
* No analytics, no cookies, no third-party trackers. Form data is never written to
  `localStorage`, URLs or analytics events. The registration PDF is built locally.
* **Privacy policy:** intentionally not published yet — the brief only allows one once
  accurate company-specific details are confirmed. The contact page carries a factual
  data-use note instead. Marked as pending owner review.

---

## 9. QA checklist (executed)

1. Every page and nav item works on desktop and mobile — **pass**
2. Both CTAs (Request Labour / Register as Worker) visible in header, hero, footer — **pass**
3. No dead links, placeholders, inert buttons or TODOs — **pass** (internal link crawl: all 200)
4. All images load from the supplied assets; logo/SVG intact — **pass** (0 broken after full scroll)
5. Social links (WhatsApp / LinkedIn / X / Email) and credit links use exact destinations,
   open prefilled chats, never send automatically — **pass**
6. Request form validation + clearly labelled mock mode — **pass**
7. Worker form matches original: uppercase input, dynamic uppercase declaration, blank
   signature/date, continuous border, correct PDF filename, two-copy instructions — **pass**
8. PDF tested with long names/values, empty optionals, no overlap or clipping — **pass**
9. Keyboard, focus, contrast, reduced-motion, responsive states — **pass**
10. No fabricated claims, logos, statistics, testimonials, certifications, hours,
    guarantees — **pass**
11. No David Adomako content, no hierarchy chart, no respirator-mask image — **pass**
12. No secrets or applicant data in public code; no console errors; no fake success — **pass**

Re-running the browser QA suite:

```bash
# with the local server running on :8123
node qa.mjs && node qa2.mjs     # headless Edge checks (console, links, forms, PDFs)
```

---

## 10. Known gaps / owner decisions needed

1. **Backend endpoint** — the request form runs in demo mode until an API is connected
   (`assets/js/config.js`). No data is transmitted today.
2. **Privacy policy** — draft needed once the owner confirms data-retention details.
3. **Office hours** — deliberately not published; confirm before adding.
4. **Detailed bios** (`bios.html`) — present but disabled and unlinked; enable only on
   the owner's instruction (`detailedBiosEnabled`).
5. **Respirator-mask photo** — excluded pending explicit approval.
6. **`image.svg` background** — supplied inside the ZIP as `image.svg.jpeg`; used as-is
   for the doodle background texture.

---

Designed for GLCL by **Bans** & **CEDI**.
