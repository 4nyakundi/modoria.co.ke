/**
 * MODORIA - GSAP Observer Curtain Swipe & Parallax Page Reveal Controller
 * Smoothly swipes up / reveals each section with inverse wrapper masks and counter-parallax
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof Observer === 'undefined') {
    console.warn("GSAP or Observer not loaded.");
    return;
  }

  gsap.registerPlugin(Observer);

  const sections = document.querySelectorAll(".obs-section");
  const images = document.querySelectorAll(".obs-section .bg");
  const outerWrappers = document.querySelectorAll(".obs-section .outer");
  const innerWrappers = document.querySelectorAll(".obs-section .inner");
  const dots = document.querySelectorAll(".slide-dot");
  const indexCounter = document.getElementById("slideCurrentIndex");

  if (!sections.length || !outerWrappers.length || !innerWrappers.length) return;

  let currentIndex = -1;
  let animating = false;
  const wrap = gsap.utils.wrap(0, sections.length);

  // Set initial states for counter-slide curtain effect
  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });
  gsap.set(sections, { zIndex: 0, autoAlpha: 0 });

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
    if (index === currentIndex || animating) return;
    animating = true;

    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power2.inOut" },
      onComplete: () => {
        animating = false;
      }
    });

    if (currentIndex >= 0) {
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { yPercent: -15 * dFactor })
        .set(sections[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    
    // Outer and Inner wrappers slide in opposite directions to produce the swipe wipe
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
      yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor)
    }, {
      yPercent: 0
    }, 0)
    .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

    const fadeEls = sections[index].querySelectorAll(".anim-fade");
    if (fadeEls.length > 0) {
      tl.fromTo(fadeEls, {
        y: 40 * dFactor,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.85,
        ease: "power3.out"
      }, 0.25);
    }

    currentIndex = index;
    updateSlideUI(currentIndex);
  }

  // Observer Wheel, Touch & Pointer Swipe
  Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true
  });

  // Keyboard navigation support (Arrow Up / Down, Page Up / Down, Space)
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

  // Slide Dot Clicks
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIdx = parseInt(dot.dataset.slide, 10);
      if (targetIdx !== currentIndex && !animating) {
        gotoSection(targetIdx, targetIdx > currentIndex ? 1 : -1);
      }
    });
  });

  // Initialize on Slide 0
  gotoSection(0, 1);
});
