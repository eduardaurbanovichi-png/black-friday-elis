
// ==========================================
// ELIS ALMEIDA — BLACK FRIDAY 2026
// CONFIGURAÇÕES PRINCIPAIS
// ==========================================

const CONFIG = {

    // GRUPO VIP
    VIP_LINK:
        "https://chat.whatsapp.com/IZMCpWwE2cjDLfZToFma3F",

    // WHATSAPP DIRETO
    WHATSAPP_LINK:
        "https://wa.me/message/7XAM7ZFQ73SVM1",

    // MENSAGEM PADRÃO
    WHATSAPP_MESSAGE:
        "Olá! Vi as promoções da Black Friday da Elis Almeida e gostaria de mais informações sobre os procedimentos.",

    // DATA DE INÍCIO — HORÁRIO DE BRASÍLIA
    CAMPAIGN_START:
        "2026-11-26T00:00:00-03:00",

    // DATA DE ENCERRAMENTO — HORÁRIO DE BRASÍLIA
    CAMPAIGN_END:
        "2026-11-28T00:00:00-03:00",

    // CAMINHOS DAS 18 ARTES
    PROMOTION_IMAGES: Array.from(
        { length: 18 },
        (_, index) => `image/img${index + 1}.jpg`
    )

};


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    setupHeader();

    setupNavigation();

    setupCountdown();

    setupGallery();

    setupLightbox();

    setupRevealAnimations();

    setupWhatsAppLinks();

});


// ==========================================
// CABEÇALHO FIXO AO ROLAR
// ==========================================

function setupHeader() {

    const header = document.getElementById("header");

    function updateHeader() {

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

}


// ==========================================
// MENU MOBILE
// ==========================================

function setupNavigation() {

    const toggle =
        document.querySelector(".menu-toggle");

    const navigation =
        document.querySelector(".navigation");

    if (!toggle || !navigation) return;


    toggle.addEventListener("click", () => {

        const isOpen =
            toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        toggle.setAttribute(
            "aria-label",
            isOpen ? "Abrir menu" : "Fechar menu"
        );

        navigation.classList.toggle(
            "is-open",
            !isOpen
        );

    });


    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navigation.classList.remove("is-open");

            toggle.setAttribute("aria-expanded", "false");

            toggle.setAttribute("aria-label", "Abrir menu");

        });

    });


    document.addEventListener("click", event => {

        if (
            !navigation.contains(event.target) &&
            !toggle.contains(event.target)
        ) {

            navigation.classList.remove("is-open");

            toggle.setAttribute("aria-expanded", "false");

            toggle.setAttribute("aria-label", "Abrir menu");

        }

    });

}


// ==========================================
// WHATSAPP
// ==========================================

function setupWhatsAppLinks() {

    document.querySelectorAll(".whatsapp-float").forEach(link => {

        link.href = CONFIG.WHATSAPP_LINK;

    });

}


// ==========================================
// CONTADOR REGRESSIVO
// ==========================================

function setupCountdown() {

    const start =
        new Date(CONFIG.CAMPAIGN_START).getTime();

    const end =
        new Date(CONFIG.CAMPAIGN_END).getTime();

    const message =
        document.getElementById("countdown-message");

    const countdown =
        document.getElementById("countdown");

    const units = {

        days: document.getElementById("days"),

        hours: document.getElementById("hours"),

        minutes: document.getElementById("minutes"),

        seconds: document.getElementById("seconds")

    };


    function pad(number) {

        return String(number).padStart(2, "0");

    }


    function updateCountdown() {

        const now = Date.now();


        // ANTES DA CAMPANHA

        if (now < start) {

            message.textContent =
                "A EXPERIÊNCIA COMEÇA EM";

            countdown.hidden = false;

            const distance = start - now;

            units.days.textContent =
                pad(Math.floor(distance / 86400000));

            units.hours.textContent =
                pad(Math.floor(
                    (distance % 86400000) / 3600000
                ));

            units.minutes.textContent =
                pad(Math.floor(
                    (distance % 3600000) / 60000
                ));

            units.seconds.textContent =
                pad(Math.floor(
                    (distance % 60000) / 1000
                ));

        }


        // DURANTE A CAMPANHA

        else if (now < end) {

            message.textContent =
                "AS OFERTAS JÁ ESTÃO DISPONÍVEIS!";

            countdown.hidden = true;

        }


        // APÓS A CAMPANHA

        else {

            message.textContent =
                "NOSSA BLACK FRIDAY FOI ENCERRADA. AGRADECEMOS SUA PARTICIPAÇÃO!";

            countdown.hidden = true;

        }

    }


    updateCountdown();

    setInterval(updateCountdown, 1000);

}


// ==========================================
// GALERIA DAS 18 PROMOÇÕES
// ==========================================

function setupGallery() {

    const gallery =
        document.getElementById("promotion-gallery");

    if (!gallery) return;


    CONFIG.PROMOTION_IMAGES.forEach((src, index) => {

        const card = document.createElement("button");

        card.type = "button";

        card.className = "promo-card";

        card.setAttribute(
            "aria-label",
            `Ampliar promoção ${index + 1}`
        );


        // IMAGEM

        const image = document.createElement("img");

        image.src = src;

        image.alt =
            `Promoção ${index + 1} da Black Friday Elis Almeida`;

        image.loading =
            index < 4 ? "eager" : "lazy";

        image.decoding = "async";


        // ESPAÇO RESERVADO

        const placeholder = document.createElement("div");

        placeholder.className = "promo-placeholder";

        const number = document.createElement("strong");

        number.textContent =
            String(index + 1).padStart(2, "0");

        const label = document.createElement("span");

        label.textContent =
            `INSIRA A ARTE ${index + 1}`;

        placeholder.append(number, label);


        // IMAGEM CARREGADA

        image.addEventListener("load", () => {

            placeholder.remove();

            card.classList.remove("is-empty");

        });


        // IMAGEM NÃO ENCONTRADA

        image.addEventListener("error", () => {

            image.hidden = true;

            card.classList.add("is-empty");

            placeholder.style.display = "flex";

        });


        card.append(image, placeholder);


        // ABRIR LIGHTBOX

        card.addEventListener("click", () => {

            if (
                !image.hidden &&
                image.complete &&
                image.naturalWidth > 0
            ) {

                openLightbox(index);

            }

        });


        gallery.appendChild(card);

    });

}


// ==========================================
// LIGHTBOX — VISUALIZAÇÃO AMPLIADA
// ==========================================

let currentImageIndex = 0;

let lastFocusedElement = null;

let touchStartX = 0;


function setupLightbox() {

    const lightbox =
        document.getElementById("lightbox");

    if (!lightbox) return;


    // FECHAR

    lightbox
        .querySelector(".lightbox-close")
        .addEventListener("click", closeLightbox);


    // IMAGEM ANTERIOR

    lightbox
        .querySelector(".lightbox-prev")
        .addEventListener("click", () => {

            changeLightboxImage(-1);

        });


    // PRÓXIMA IMAGEM

    lightbox
        .querySelector(".lightbox-next")
        .addEventListener("click", () => {

            changeLightboxImage(1);

        });


    // FECHAR AO CLICAR FORA

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });


    // TECLADO

    document.addEventListener("keydown", event => {

        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {

            closeLightbox();

        }

        if (event.key === "ArrowLeft") {

            changeLightboxImage(-1);

        }

        if (event.key === "ArrowRight") {

            changeLightboxImage(1);

        }

    });


    // DESLIZAR NO CELULAR

    lightbox.addEventListener("touchstart", event => {

        touchStartX = event.changedTouches[0].screenX;

    }, { passive: true });


    lightbox.addEventListener("touchend", event => {

        const touchEndX =
            event.changedTouches[0].screenX;

        const difference =
            touchStartX - touchEndX;

        if (Math.abs(difference) > 60) {

            changeLightboxImage(
                difference > 0 ? 1 : -1
            );

        }

    }, { passive: true });

}


// ABRIR

function openLightbox(index) {

    const lightbox =
        document.getElementById("lightbox");

    currentImageIndex = index;

    lastFocusedElement = document.activeElement;

    renderLightboxImage();

    lightbox.classList.add("is-open");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    lightbox
        .querySelector(".lightbox-close")
        .focus();

}


// FECHAR

function closeLightbox() {

    const lightbox =
        document.getElementById("lightbox");

    lightbox.classList.remove("is-open");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    if (lastFocusedElement) {

        lastFocusedElement.focus();

    }

}


// TROCAR IMAGEM

function changeLightboxImage(direction) {

    const images =
        document.querySelectorAll(".promo-card img");

    const total = images.length;

    if (!total) return;


    for (let step = 0; step < total; step++) {

        currentImageIndex =
            (currentImageIndex + direction + total) % total;

        const candidate =
            images[currentImageIndex];


        if (
            candidate &&
            !candidate.hidden &&
            candidate.complete &&
            candidate.naturalWidth > 0
        ) {

            renderLightboxImage();

            return;

        }

    }

}


// MOSTRAR IMAGEM

function renderLightboxImage() {

    const images =
        document.querySelectorAll(".promo-card img");

    const image =
        images[currentImageIndex];

    const lightbox =
        document.getElementById("lightbox");

    const enlarged =
        lightbox.querySelector(".lightbox-image");


    if (!image) return;

    enlarged.src = image.currentSrc || image.src;

    enlarged.alt = image.alt;


    lightbox
        .querySelector(".lightbox-counter")
        .textContent =
            `${String(currentImageIndex + 1).padStart(2, "0")} / ${CONFIG.PROMOTION_IMAGES.length}`;

}


// ==========================================
// ANIMAÇÕES DE ENTRADA
// ==========================================

function setupRevealAnimations() {

    const elements =
        document.querySelectorAll(".reveal");


    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add("is-visible");

        });

        return;

    }


    const observer = new IntersectionObserver(

        (entries, currentObserver) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    currentObserver.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12
        }

    );


    elements.forEach(element => {

        observer.observe(element);

    });

}


// ==========================================
// FIM DO PROJETO
// ==========================================
