/* Configurable API adapter for the labour request form.
   --------------------------------------------------------------------------
   Keeps all transport details out of the UI code.

   REQUEST PAYLOAD (POST {apiBaseUrl}{endpoints.labourRequest})
   Content-Type: application/json

   {
     "requesterFullName": "Kwame Mensah",
     "companyName": "Tema Shipping Co.",   // or null when "not a business"
     "notBusiness": false,                  // true when the requester is not a business
     "email": "kwame@example.com",
     "phone": "+233 24 000 0000",
     "labourCategory": "Skilled" | "Non-Skilled" | "Both",
     "role": "Forklift operator",
     "details": "Additional details supplied by the requester",
     "source": "getlabour.org/request.html",
     "submittedAt": "2026-01-01T12:00:00.000Z"
   }

   EXPECTED RESPONSE
   - 2xx: any JSON body is optional. The UI treats any 2xx as success.
   - non-2xx: the UI shows a retryable error. Do not return applicant data in
     error messages that will be rendered publicly.
*/

const DEFAULTS = {
  apiBaseUrl: "",
  endpoints: { labourRequest: "/api/labour-request" },
  mockMode: null,
  timeoutMs: 12000,
};

export function getConfig() {
  const runtime = (typeof window !== "undefined" && window.GLCL_CONFIG) || {};
  const merged = {
    ...DEFAULTS,
    ...runtime,
    endpoints: { ...DEFAULTS.endpoints, ...(runtime.endpoints || {}) },
  };
  const apiBaseUrl = String(merged.apiBaseUrl || "").trim();
  const mockMode = merged.mockMode === null || merged.mockMode === undefined
    ? apiBaseUrl === ""
    : Boolean(merged.mockMode);
  return { ...merged, apiBaseUrl, mockMode };
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function submitLabourRequest(payload) {
  const config = getConfig();

  if (config.mockMode) {
    // Demo mode: simulated latency, nothing leaves the browser.
    await delay(900);
    return { ok: true, mock: true, payload };
  }

  const base = config.apiBaseUrl.replace(/\/+$/, "");
  const url = `${base}${config.endpoints.labourRequest}`;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`);
      error.status = response.status;
      throw error;
    }

    let data = null;
    try {
      data = await response.json();
    } catch (err) {
      data = null; // 2xx with an empty/non-JSON body is still a success
    }
    return { ok: true, mock: false, data };
  } finally {
    window.clearTimeout(timer);
  }
}
