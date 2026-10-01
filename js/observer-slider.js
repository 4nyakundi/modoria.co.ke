/**
 * MODORIA - GSAP Observer Edgy Card/Box Scroller
 * Full-page box placeholders and typography glide synchronously with 3D scale and lockstep velocity
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof Observer === 'undefined') {
    console.warn("GSAP or Observer not loaded.");
    return;
  }

  gsap.registerPlugin(Observer);

  const sections = document.querySelectorAll(".obs-section");
  const outerWrappers = document.querySelectorAll(".obs-section .outer");
  const dots = document.querySelectorAll(".slide-dot");
  const indexCounter = document.getElementById("slideCurrentIndex");

  if (!sections.length || !outerWrappers.length) return;

  let currentIndex = 0;
  let animating = false;
  let lastSlideTime = 0;
  const wrap = gsap.utils.wrap(0, sections.length);

  // ─── INITIALIZE SLIDER IN CRISP EDGY BOX STATE ───
  function initSlider() {
    sections.forEach((section, i) => {
      if (i === 0) {
        gsap.set(section, { autoAlpha: 1, zIndex: 2 });
        gsap.set(outerWrappers[i], { yPercent: 0, scale: 1, opacity: 1 });
      } else {
        gsap.set(section, { autoAlpha: 0, zIndex: 0 });
        gsap.set(outerWrappers[i], { yPercent: 100, scale: 0.94, opacity: 0.85 });
      }
    });

    currentIndex = 0;
    updateSlideUI(0);
  }

  function updateSlideUI(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    if (indexCounter) {
      const currentFormatted = String(index + 1).padStart(2, '0');
      const totalFormatted = String(sections.length).padStart(2, '0');
      indexCounter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }
  }

  function gotoSection(index, direction) {
    index = wrap(index);
    const now = Date.now();
    
    // Prevent double triggers during active animation or rapid inertial flick
    if (index === currentIndex || animating || (now - lastSlideTime < 380)) return;
    
    animating = true;
    const prevIndex = currentIndex;
    const dFactor = direction === -1 ? -1 : 1;

    // Incoming section sits above outgoing section
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 2 });
    gsap.set(sections[prevIndex], { zIndex: 1 });

    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.out" },
      onComplete: () => {
        // Cleanly hide previous slide
        gsap.set(sections[prevIndex], { autoAlpha: 0, zIndex: 0 });
        gsap.set(outerWrappers[prevIndex], { yPercent: 100, scale: 0.94, opacity: 0.85 });
        
        // Lock clean zero position on active slide
        gsap.set(outerWrappers[index], { yPercent: 0, scale: 1, opacity: 1 });

        animating = false;
        lastSlideTime = Date.now();
      }
    });

    // 1. Incoming Box & Text Move In Lockstep with Edgy Scale Effect
    tl.fromTo(outerWrappers[index], {
      yPercent: 100 * dFactor,
      scale: 0.94,
      opacity: 0.85
    }, {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out"
    }, 0);

    // 2. Outgoing Box & Text Glide Out Smoothly
    tl.to(outerWrappers[prevIndex], {
      yPercent: -100 * dFactor,
      scale: 0.94,
      opacity: 0.35,
      duration: 0.9,
      ease: "power3.out"
    }, 0);

    currentIndex = index;
    updateSlideUI(currentIndex);
  }

  // ─── OBSERVER INPUT CAPTURE (WHEEL & TOUCH) ───
  Observer.create({
    type: "wheel,touch",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 15,
    preventDefault: true
  });

  // ─── KEYBOARD NAVIGATION (Arrow Up / Down, Page Up / Down, Space) ───
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (animating) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      gotoSection(currentIndex + 1, 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      gotoSection(currentIndex - 1, -1);
    }
  });

  // ─── SLIDE DOT CLICK CONTROLS ───
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIdx = parseInt(dot.dataset.slide, 10);
      if (targetIdx !== currentIndex && !animating) {
        gotoSection(targetIdx, targetIdx > currentIndex ? 1 : -1);
      }
    });
  });

  // ─── RUN INSTANT INIT ───
  initSlider();
});
