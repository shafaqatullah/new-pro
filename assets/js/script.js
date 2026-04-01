'use strict';



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

/**
 * THEME (dark mode)
 */

const THEME_KEY = "sz_theme";
const themeToggle = document.querySelector("[data-theme-toggle]");

const getPreferredTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
};

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}



/**
 * SCROLL REVEAL (smoother)
 */

const revealElements = document.querySelectorAll("[data-reveal]");
const revealDelayElements = document.querySelectorAll("[data-reveal-delay]");

for (let i = 0, len = revealDelayElements.length; i < len; i++) {
  revealDelayElements[i].style.transitionDelay = revealDelayElements[i].dataset.revealDelay;
}

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => io.observe(el));
} else {
  const reveal = function () {
    for (let i = 0, len = revealElements.length; i < len; i++) {
      if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.2) {
        revealElements[i].classList.add("revealed");
      }
    }
  }
  window.addEventListener("scroll", reveal);
  window.addEventListener("load", reveal);
}

/**
 * NAV active link on scroll + close on click (mobile)
 */

const navLinks = document.querySelectorAll("[data-nav-link]");
const sections = Array.from(navLinks)
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const setActiveNav = (id) => {
  navLinks.forEach((a) => {
    const target = a.getAttribute("href")?.slice(1);
    a.classList.toggle("active", target === id);
  });
};

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveNav(visible.target.id);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.25, 0.35, 0.5, 0.75] }
  );
  sections.forEach((s) => sectionObserver.observe(s));
}

addEventOnElements(navLinks, "click", function () {
  if (navbar.classList.contains("active")) toggleNavbar();
});

/**
 * HERO typing
 */

const typingEl = document.querySelector("[data-typing]");
if (typingEl) {
  const items = (typingEl.dataset.typingItems || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let itemIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    if (!items.length) return;
    const current = items[itemIndex % items.length];
    const nextText = deleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
    typingEl.textContent = nextText;

    if (!deleting && nextText === current) {
      deleting = true;
      setTimeout(tick, 1100);
      return;
    }

    if (deleting && nextText === "") {
      deleting = false;
      itemIndex++;
      setTimeout(tick, 250);
      return;
    }

    charIndex += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 32 : 44);
  };

  setTimeout(tick, 450);
}

/**
 * FOOTER year
 */

const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/**
 * CONTACT form -> mailto
 */

const CONTACT_EMAIL = "zshafaqatullah@gmail.com";
const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const from = String(formData.get("email_address") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = `Portfolio message from ${name || "Website visitor"}` + (from ? ` (${from})` : "");
    const bodyLines = [
      "Hi Shafaqatullah,",
      "",
      message || "(No message provided)",
      "",
      "---",
      `Name: ${name || "-"}`,
      `Email: ${from || "-"}`,
      "",
      "Sent from your portfolio contact form."
    ];

    const mailto = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  });
}