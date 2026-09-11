/* GSAP Navigation Drawer with Timeline .clear() Rebuild & Physics Exits */
document.addEventListener('DOMContentLoaded', () => {
  let isOpen = false;
  let tl = gsap.timeline();

  function openMenu() {
    tl.set("#nav", { visibility: "visible", pointerEvents: "auto" })
      .fromTo(
        ".nav-bg",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        0
      )
      .fromTo(
        ".nav-panel",
        { x: "101%", y: 0, rotation: 0 },
        { x: "0%", duration: 0.6, ease: "back.out(1.1)", stagger: 0.15 },
        0
      )
      .fromTo(
        ".nav-item",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "expo.out", stagger: 0.04 },
        0.1
      )
      .fromTo(
        ".bar-top",
        { stroke: "var(--white)", attr: { x1: 3, y1: 7, x2: 17, y2: 7 } },
        { stroke: "#d4af37", attr: { x1: 5, y1: 5, x2: 15, y2: 15 }, duration: 0.35, ease: "back.out(1.4)" },
        0.06
      )
      .fromTo(
        ".bar-bot",
        { stroke: "var(--white)", attr: { x1: 3, y1: 13, x2: 17, y2: 13 } },
        { stroke: "#d4af37", attr: { x1: 15, y1: 5, x2: 5, y2: 15 }, duration: 0.35, ease: "back.out(1.4)" },
        0.06
      )
      .to(
        ".bar-mid",
        { opacity: 0, duration: 0.2 },
        0
      )
      .fromTo(
        ".nav-login",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
        0.4
      );
  }

  function closeMenu() {
    tl.to(".bar", { stroke: "var(--white)", duration: 0.2 })
      .to(".bar-top", { attr: { x1: 3, y1: 7, x2: 17, y2: 7 }, duration: 0.2, ease: "power3.in" }, "<")
      .to(".bar-bot", { attr: { x1: 3, y1: 13, x2: 17, y2: 13 }, duration: 0.2, ease: "power3.in" }, "<")
      .to(".bar-mid", { opacity: 1, duration: 0.2 }, "<")
      // Falling panels with dynamic rotation
      .to(
        ".nav-panel",
        {
          y: "140vh",
          rotation: () => gsap.utils.random(-15, 15),
          duration: 0.8,
          ease: "power3.in",
          stagger: { from: "end", each: 0.03 }
        },
        "<"
      )
      .to(
        ".nav-bg",
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        "<0.1"
      )
      .set("#nav", { visibility: "hidden", pointerEvents: "none" });
  }

  function toggle() {
    isOpen = !isOpen;
    const btn = document.getElementById("menuToggle");
    if (btn) {
      btn.setAttribute("aria-expanded", isOpen);
      btn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }
    
    document.querySelectorAll(".nav-link").forEach(l => l.setAttribute("tabindex", isOpen ? "0" : "-1"));
    document.querySelectorAll(".nav-socials a").forEach(l => l.setAttribute("tabindex", isOpen ? "0" : "-1"));

    tl.clear();

    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  const menuToggle = document.getElementById("menuToggle");
  const navBg = document.querySelector(".nav-bg");

  if (menuToggle) menuToggle.addEventListener("click", toggle);
  if (navBg) navBg.addEventListener("click", () => { if (isOpen) toggle(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      toggle();
      if (menuToggle) menuToggle.focus();
    }
  });

  // Make toggle accessible globally if needed
  window.modoriaNavToggle = toggle;
});
