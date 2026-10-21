/* Renders the services page role lists from structured data. */
import { SERVICES } from "./data.js";

function render() {
  document.querySelectorAll("[data-service-roles]").forEach((list) => {
    const key = list.getAttribute("data-service-roles");
    const service = SERVICES.skilled.id === key ? SERVICES.skilled : SERVICES.nonSkilled;
    list.innerHTML = service.roles.map((role) => `<li>${role}</li>`).join("");
  });

  document.querySelectorAll("[data-service-summary]").forEach((node) => {
    const key = node.getAttribute("data-service-summary");
    const service = SERVICES.skilled.id === key ? SERVICES.skilled : SERVICES.nonSkilled;
    node.textContent = service.summary;
  });
}

render();
