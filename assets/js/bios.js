/* Gates the discreet detailed-biography content behind config. */
import { DETAILED_BIOS } from "./bios-data.js";

const status = document.getElementById("bios-status");
const content = document.getElementById("bios-content");

const config = window.GLCL_CONFIG || {};
const enabled = Boolean(config.detailedBiosEnabled);
const access = config.detailedBiosAccess || "unlisted";

if (!enabled || access !== "unlisted") {
  if (status) {
    status.textContent =
      "These biographies are not published. Ask the GLCL office if you need access.";
  }
  if (content) {
    content.innerHTML =
      '<div class="alert alert--info"><div><h3>Content not available</h3><p>This page holds detailed staff biographies that are deliberately kept off the public website. It can be switched on by the site owner in <code>assets/js/config.js</code> (<code>detailedBiosEnabled</code>).</p></div></div>';
  }
} else {
  if (status) {
    status.textContent = "Unlisted page — not linked from the public site.";
  }
  if (content) {
    content.innerHTML = DETAILED_BIOS.map(
      (bio) => `
        <article class="aside-card" style="margin-bottom: 1.5rem;">
          <h3>${bio.name} — ${bio.role}</h3>
          <ul>${bio.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>
        </article>`
    ).join("");
  }
}
