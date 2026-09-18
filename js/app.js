/* MODORIA - Global App Controller: Floating WhatsApp Concierge & Lightbox */
document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = "254707816111"; // Modoria Kenya Concierge

  // ─── FLOATING WHATSAPP CONCIERGE MODAL ───
  const waFloatBtn = document.getElementById("waFloatBtn");
  const waModal = document.getElementById("waModal");
  const waCloseBtn = document.getElementById("waCloseBtn");
  const waBackdrop = document.querySelector(".wa-modal-backdrop");
  const waSendBtn = document.getElementById("waSendBtn");
  const waServicePills = document.querySelectorAll(".wa-service-pill");
  const waNoteInput = document.getElementById("waNoteInput");

  let selectedService = "Branding & Identity (Ice Cream Logic)";

  function openWaModal(preSelectedService) {
    if (preSelectedService) {
      selectedService = preSelectedService;
      waServicePills.forEach(pill => {
        pill.classList.toggle("active", pill.dataset.service.toLowerCase() === preSelectedService.toLowerCase());
      });
    }
    if (waModal) waModal.classList.add("open");
  }

  function closeWaModal() {
    if (waModal) waModal.classList.remove("open");
  }

  if (waFloatBtn) {
    waFloatBtn.addEventListener("click", () => openWaModal());
  }

  if (waCloseBtn) {
    waCloseBtn.addEventListener("click", closeWaModal);
  }

  if (waBackdrop) {
    waBackdrop.addEventListener("click", (e) => {
      if (e.target === waBackdrop) closeWaModal();
    });
  }

  waServicePills.forEach(pill => {
    pill.addEventListener("click", () => {
      waServicePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedService = pill.dataset.service;
    });
  });

  if (waSendBtn) {
    waSendBtn.addEventListener("click", () => {
      const customNote = waNoteInput && waNoteInput.value.trim() ? waNoteInput.value.trim() : "I would like to inquire about specifications, pricing, and project timeline.";
      const message = `Hello Modoria,%0A%0AI would like to get in touch regarding *${selectedService}*.%0A%0AProject Brief: ${encodeURIComponent(customNote)}%0A%0AThank you!`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, "_blank");
      closeWaModal();
    });
  }

  // Bind any "Inquire Service" or "Get in touch" trigger buttons
  document.querySelectorAll("[data-inquire-service]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const sName = btn.dataset.inquireService;
      openWaModal(sName);
    });
  });

  // Handle Contact Form submission if present
  const projectBriefForm = document.getElementById("projectBriefForm");
  if (projectBriefForm) {
    projectBriefForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("formName")?.value || "";
      const phone = document.getElementById("formPhone")?.value || "";
      const email = document.getElementById("formEmail")?.value || "";
      const service = document.getElementById("formService")?.value || "";
      const scope = document.getElementById("formScope")?.value || "";

      const formattedMsg = `Hello Modoria,%0A%0ANew Project Inquiry from *${name}* (${phone} / ${email}):%0A%0A*Category:* ${service}%0A*Scope Details:* ${encodeURIComponent(scope)}%0A%0APlease get back to me.`;
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${formattedMsg}`;
      window.open(waUrl, "_blank");
    });
  }

  // ─── LIGHTBOX MODAL FOR CASE STUDY & IMAGES ───
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  if (lightboxModal && lightboxImg) {
    document.querySelectorAll("[data-lightbox]").forEach(item => {
      item.addEventListener("click", () => {
        const src = item.dataset.lightbox || item.getAttribute("src");
        if (src) {
          lightboxImg.src = src;
          lightboxModal.classList.add("active");
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", () => {
        lightboxModal.classList.remove("active");
      });
    }

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove("active");
      }
    });
  }

  // ─── LIVE KENYA STUDIO CLOCK ───
  function updateKenyaClock() {
    const timeEls = document.querySelectorAll("#footerStudioTime, .telemetry-clock, .footer-studio-clock");
    if (!timeEls.length) return;
    try {
      const now = new Date();
      const options = { timeZone: "Africa/Nairobi", hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const timeStr = new Intl.DateTimeFormat([], options).format(now);
      timeEls.forEach(el => {
        el.textContent = `KENYA ${timeStr} EAT`;
      });
    } catch (e) {
      // fallback
    }
  }
  updateKenyaClock();
  setInterval(updateKenyaClock, 1000);

});
