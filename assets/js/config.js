/* Runtime configuration for GLCL forms.
   --------------------------------------------------------------------------
   This file is public, front-end configuration — never put secrets, API keys
   or database credentials here. GitHub Pages cannot host server-side code, so
   the backend must live elsewhere (Cloudflare Workers, Google Apps Script,
   Firebase, a VPS, etc.).

   apiBaseUrl: leave empty ("") to run the site in DEMO MODE. In demo mode the
   request form validates input, clearly tells the user nothing was sent, and
   never transmits data anywhere.

   When a backend exists, set apiBaseUrl to its origin, e.g.
   "https://glcl-api.example.workers.dev" and keep mockMode as null (auto).
*/
window.GLCL_CONFIG = {
  apiBaseUrl: "",
  endpoints: {
    labourRequest: "/api/labour-request",
  },
  // null = automatic (mock whenever apiBaseUrl is empty). Set true/false to force.
  mockMode: null,
  // Request timeout in milliseconds for real submissions.
  timeoutMs: 12000,

  /* Discreet, detailed staff biographies (bios.html).
     These are NOT linked from the public site. Keep this false until the
     owner explicitly asks for them to be published.
     Access options:
       "unlisted"  – page is reachable by direct URL only (no links, noindex)
       "password"  – reserved; requires a backend and is not implemented here   */
  detailedBiosEnabled: false,
  detailedBiosAccess: "unlisted",
};
