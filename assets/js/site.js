/* GLCL shared behaviour: reveal loader, mobile navigation, scroll reveals,
   social link rendering and small progressive-enhancement helpers. */

import { SOCIAL, CONTACT } from "./data.js";

/* ---------------- loader ---------------- */
function initLoader() {
  const el = document.getElementById("loader");
  if (!el) return;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    el.classList.add("is-hiding");
    document.documentElement.classList.remove("show-loader");
    try {
      sessionStorage.setItem("glcl-loader", "1");
    } catch (err) {
      /* storage unavailable — loader simply shows again next page */
    }
    window.setTimeout(() => {
      el.hidden = true;
    }, 600);
  };

  const img = el.querySelector("img");
  const hardStop = window.setTimeout(finish, 3200);

  if (img) {
    if (img.complete) {
      window.clearTimeout(hardStop);
      window.setTimeout(finish, 850);
    } else {
      img.addEventListener(
        "load",
        () => {
          window.clearTimeout(hardStop);
          window.setTimeout(finish, 750);
        },
        { once: true }
      );
      img.addEventListener(
        "error",
        () => {
          window.clearTimeout(hardStop);
          finish();
        },
        { once: true }
      );
    }
  } else {
    window.clearTimeout(hardStop);
    finish();
  }
}

/* ---------------- mobile navigation ---------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (event.target.closest("#site-nav") || event.target.closest(".nav-toggle")) return;
    setOpen(false);
  });

  window.matchMedia("(min-width: 52.0625rem)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

/* ---------------- sticky header shadow ---------------- */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------- scroll reveal ---------------- */
let revealObserver = null;

function observeRevealNodes(nodes) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  nodes.forEach((node) => {
    if (reduced || !("IntersectionObserver" in window)) {
      node.classList.add("is-visible");
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
    }
    revealObserver.observe(node);
  });
}

function initReveal() {
  observeRevealNodes(Array.from(document.querySelectorAll(".reveal")));
  document.addEventListener("glcl:content-rendered", () => {
    observeRevealNodes(Array.from(document.querySelectorAll(".reveal:not(.is-visible)")));
  });
}

/* ---------------- social icons ---------------- */
const ICONS = {
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.26-4.35c0-4.53 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.2-8.24 8.2Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25H8.1l4.71 6.23 5.43-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6.5 9 6.5 9-6.5"/></svg>',
};

function injectSocialLinks() {
  document.querySelectorAll("[data-social-row]").forEach((row) => {
    row.classList.add("social-row");
    row.innerHTML = SOCIAL.map(
      (item) =>
        `<a class="social-link" href="${item.href}" target="_blank" rel="noopener noreferrer" aria-label="${item.ariaLabel}">${ICONS[item.icon] || ""}<span>${item.name}</span></a>`
    ).join("");
  });
}

function injectContactBits() {
  document.querySelectorAll("[data-contact-email]").forEach((node) => {
    node.href = `mailto:${CONTACT.email}`;
    if (!node.textContent.trim()) node.textContent = CONTACT.email;
  });
  document.querySelectorAll("[data-contact-phone]").forEach((node) => {
    const which = node.getAttribute("data-contact-phone");
    const phone = which === "2" ? CONTACT.phone2 : CONTACT.phone1;
    node.href = `tel:${phone.tel}`;
    if (!node.textContent.trim()) node.textContent = phone.label;
  });
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

/* ---------------- boot ---------------- */
function boot() {
  initLoader();
  initNav();
  initStickyHeader();
  initReveal();
  injectSocialLinks();
  injectContactBits();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
