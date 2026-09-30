/**
 * MODORIA - GSAP Observer Curtain Swipe & Seamless Page Reveal Controller
 * Ultra-smooth, glitch-free slide transitions with synchronized hardware-accelerated transforms
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof Observer === 'undefined') {
    console.warn("GSAP or Observer not loaded.");
    return;
  }

  gsap.registerPlugin(Observer);

  const sections = document.querySelectorAll(".obs-section");
  const outerWrappers = document.querySelectorAll(".obs-section .outer");
  const innerWrappers = document.querySelectorAll(".obs-section .inner");
  const dots = document.querySelectorAll(".slide-dot");
  const indexCounter = document.getElementById("slideCurrentIndex");

  if (!sections.length || !outerWrappers.length || !innerWrappers.length) return;

  let currentIndex = 0;
  let animating = false;
  let lastSlideTime = 0;
  const wrap = gsap.utils.wrap(0, sections.length);

  // ─── INITIALIZE SLIDER IN CRISP ZERO-GLITCH STATE ───
  function initSlider() {
    sections.forEach((section, i) => {
      if (i === 0) {
        gsap.set(section, { autoAlpha: 1, zIndex: 2 });
        gsap.set(outerWrappers[i], { yPercent: 0, clearProps: "transform" });
        gsap.set(innerWrappers[i], { yPercent: 0, clearProps: "transform" });
      } else {
        gsap.set(section, { autoAlpha: 0, zIndex: 0 });
        gsap.set(outerWrappers[i], { yPercent: 100 });
        gsap.set(innerWrappers[i], { yPercent: -100 });
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
    
    // Prevent mid-animation trigger or rapid inertial scroll bounce
    if (index === currentIndex || animating || (now - lastSlideTime < 450)) return;
    
    animating = true;
    const prevIndex = currentIndex;
    const dFactor = direction === -1 ? -1 : 1;

    // Set incoming section above outgoing section
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 2 });
    gsap.set(sections[prevIndex], { zIndex: 1 });

    // Pre-position incoming curtain wrappers without visual jump
    gsap.set(outerWrappers[index], { yPercent: 100 * dFactor });
    gsap.set(innerWrappers[index], { yPercent: -100 * dFactor });

    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power2.out" },
      onComplete: () => {
        // Clean up outgoing slide to avoid dirty transforms
        gsap.set(sections[prevIndex], { autoAlpha: 0, zIndex: 0 });
        gsap.set(outerWrappers[prevIndex], { yPercent: 100 });
        gsap.set(innerWrappers[prevIndex], { yPercent: -100 });
        
        // Lock clean position on active slide
        gsap.set(outerWrappers[index], { yPercent: 0 });
        gsap.set(innerWrappers[index], { yPercent: 0 });

        animating = false;
        lastSlideTime = Date.now();
      }
    });

    // 1. Synchronized Curtain Wipe Movement
    tl.to(outerWrappers[index], { yPercent: 0 }, 0)
      .to(innerWrappers[index], { yPercent: 0 }, 0);

    // 2. Subtle Soft Parallax on Outgoing Slide
    tl.to(outerWrappers[prevIndex], {
      yPercent: -20 * dFactor,
      duration: 0.9,
      ease: "power2.out"
    }, 0);

    // 3. Staggered Content Inflow on Incoming Slide
    const fadeEls = sections[index].querySelectorAll(".anim-fade");
    if (fadeEls.length > 0) {
      tl.fromTo(fadeEls, {
        y: 28 * dFactor,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.7,
        ease: "power3.out"
      }, 0.15);
    }

    currentIndex = index;
    updateSlideUI(currentIndex);
  }

  // ─── OBSERVER INPUT CAPTURE (WHEEL & TOUCH) ───
  // Uses wheel and touch (excluding raw pointer to prevent mouse drag collision)
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
