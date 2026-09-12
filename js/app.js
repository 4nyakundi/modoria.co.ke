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

  let selectedService = "Printing & Branding";

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
      const customNote = waNoteInput && waNoteInput.value.trim() ? waNoteInput.value.trim() : "I would like to inquire about pricing and lead time.";
      const message = `Hello Modoria,%0A%0AI would like to inquire about *${selectedService}*.%0A%0ADetails: ${encodeURIComponent(customNote)}%0A%0AThank you!`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, "_blank");
      closeWaModal();
    });
  }

  // Bind any "Inquire Service" buttons across all pages
  document.querySelectorAll("[data-inquire-service]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const sName = btn.dataset.inquireService;
      openWaModal(sName);
    });
  });

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
}
  // ─── LIVE NAIROBI STUDIO CLOCK ───
  function updateNairobiClock() {
    const timeEl = document.getElementById("footerNairobiTime");
    if (!timeEl) return;
    try {
      const now = new Date();
      const options = { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const timeStr = new Intl.DateTimeFormat([], options).format(now);
      timeEl.textContent = `MOMBASA ${timeStr} EAT • NATIONWIDE ACTIVE`;
    } catch (e) {
      // fallback
    }
  }
  updateNairobiClock();
  setInterval(updateNairobiClock, 1000);

});
