/* Renders the About page values and the approved staff directory. */
import { TEAM, VALUES } from "./data.js";

function initialsOf(name) {
  return name
    .replace(/^(Mr|Mrs|Ms|Miss|Dr)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function renderValues() {
  const host = document.querySelector("[data-values]");
  if (!host) return;
  host.innerHTML = VALUES.map(
    (value, index) => `
      <article class="values__item">
        <span class="values__num">${String(index + 1).padStart(2, "0")}</span>
        <h3>${value.name}</h3>
        <p>${value.copy}</p>
      </article>`
  ).join("");
}

function renderTeam() {
  const host = document.querySelector("[data-team-grid]");
  if (!host) return;

  host.innerHTML = TEAM.map((member) => {
    const media = member.image
      ? `<img src="${member.image}" alt="Portrait of ${member.name}, ${member.title}" width="640" height="800" loading="lazy">`
      : `<span class="staff-card__initials" aria-hidden="true">${initialsOf(member.name)}</span>`;

    return `
      <article class="staff-card reveal">
        <div class="staff-card__media">${media}</div>
        <div class="staff-card__body">
          <h3 class="staff-card__name">${member.name}</h3>
          <p class="staff-card__role">${member.title}</p>
          <p class="staff-card__bio">${member.bio}</p>
        </div>
      </article>`;
  }).join("");

  // Re-run reveal observation for the freshly injected cards.
  document.dispatchEvent(new CustomEvent("glcl:content-rendered"));
}

renderValues();
renderTeam();
