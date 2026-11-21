/* =========================================================
   ELIS ALMEIDA — BLACK FRIDAY 2026
   Ajuste aqui o WhatsApp e, se necessário, as extensões das artes.
   ========================================================= */
const CONFIG = {
  WHATSAPP_NUMBER: "5511999999999", // Substitua pelo número real, com DDI e DDD.
  WHATSAPP_MESSAGE: "Olá! Vi as promoções da Black Friday da Elis Almeida e gostaria de mais informações sobre os procedimentos.",
  CAMPAIGN_START: "2026-11-26T00:00:00-03:00", // Horário de Brasília.
  CAMPAIGN_END: "2026-11-28T00:00:00-03:00",
  PROMOTION_IMAGES: Array.from({ length: 18 }, (_, index) => `assets/images/img${index + 1}.jpg`)
};

document.addEventListener("DOMContentLoaded", () => {
  setupWhatsApp();
  setupCountdown();
  setupGallery();
  setupNavigation();
  setupRevealAnimations();
});

function setupWhatsApp() {
  const link = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)}`;
  document.querySelectorAll(".whatsapp-link").forEach((element) => {
    element.href = link;
  });
}

function setupCountdown() {
  const start = new Date(CONFIG.CAMPAIGN_START).getTime();
  const end = new Date(CONFIG.CAMPAIGN_END).getTime();
  const message = document.getElementById("countdown-message");
  const countdown = document.getElementById("countdown");
  const units = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  const pad = (number) => String(number).padStart(2, "0");

  function update() {
    const now = Date.now();

    if (now < start) {
      message.textContent = "A EXPERIÊNCIA COMEÇA EM";
      countdown.hidden = false;
      const distance = start - now;
      units.days.textContent = pad(Math.floor(distance / 86400000));
      units.hours.textContent = pad(Math.floor((distance % 86400000) / 3600000));
      units.minutes.textContent = pad(Math.floor((distance % 3600000) / 60000));
      units.seconds.textContent = pad(Math.floor((distance % 60000) / 1000));
    } else if (now < end) {
      message.textContent = "AS OFERTAS JÁ ESTÃO DISPONÍVEIS!";
      countdown.hidden = true;
    } else {
      message.textContent = "NOSSA BLACK FRIDAY FOI ENCERRADA. AGRADECEMOS SUA PARTICIPAÇÃO!";
      countdown.hidden = true;
    }
  }

  update();
  window.setInterval(update, 1000);
}

function setupGallery() {
  const gallery = document.getElementById("promotion-gallery");
  CONFIG.PROMOTION_IMAGES.forEach((src, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "promo-card";
    card.setAttribute("aria-label", `Ampliar arte de promoção ${index + 1}`);

    const image = document.createElement("img");
    image.src = src;
    image.alt = `Arte da promoção ${index + 1} — Elis Almeida Black Friday 2026`;
    image.loading = index < 3 ? "eager" : "lazy";
    image.decoding = "async";

    const placeholder = document.createElement("span");
    placeholder.className = "promo-placeholder";
    placeholder.innerHTML = `<strong>${String(index + 1).padStart(2, "0")}</strong><span>INSIRA A ARTE ${index + 1}</span>`;

    image.addEventListener("load", () => placeholder.remove());
    image.addEventListener("error", () => {
      image.hidden = true;
      card.classList.add("is-empty");
    });

    card.append(image, placeholder);
    card.addEventListener("click", () => {
      if (!image.hidden && image.complete && image.naturalWidth > 0) {
        openLightbox(index);
      }
    });
    gallery.appendChild(card);
  });

  setupLightbox();
}

let currentImageIndex = 0;
let lastFocusedElement = null;

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => changeLightboxImage(-1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => changeLightboxImage(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") changeLightboxImage(-1);
    if (event.key === "ArrowRight") changeLightboxImage(1);
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById("lightbox");
  currentImageIndex = index;
  lastFocusedElement = document.activeElement;
  renderLightboxImage();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  lightbox.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function changeLightboxImage(direction) {
  const total = CONFIG.PROMOTION_IMAGES.length;
  for (let step = 0; step < total; step += 1) {
    currentImageIndex = (currentImageIndex + direction + total) % total;
    const candidate = document.querySelectorAll(".promo-card img")[currentImageIndex];
    if (candidate && !candidate.hidden && candidate.complete && candidate.naturalWidth > 0) {
      renderLightboxImage();
      return;
    }
  }
}

function renderLightboxImage() {
  const image = document.querySelectorAll(".promo-card img")[currentImageIndex];
  const lightbox = document.getElementById("lightbox");
  const enlarged = lightbox.querySelector(".lightbox-image");
  enlarged.src = image.currentSrc || image.src;
  enlarged.alt = image.alt;
  lightbox.querySelector(".lightbox-counter").textContent =
    `${String(currentImageIndex + 1).padStart(2, "0")} / ${CONFIG.PROMOTION_IMAGES.length}`;
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    nav.classList.toggle("is-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      nav.classList.remove("is-open");
    });
  });
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}
