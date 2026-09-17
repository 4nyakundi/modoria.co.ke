/**
 * MODORIA - GSAP Observer Full-Screen Slider Controller (6 Slides)
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof Observer === 'undefined') return;

  const sections = document.querySelectorAll(".obs-section");
  const images = document.querySelectorAll(".obs-section .bg");
  const dots = document.querySelectorAll(".slide-dot");
  const indexCounter = document.getElementById("slideCurrentIndex");

  if (!sections.length) return;

  let currentIndex = -1;
  let animating = false;
  const wrap = gsap.utils.wrap(0, sections.length);

  gsap.set(sections, { zIndex: 0, autoAlpha: 0 });
  gsap.set(sections[0], { zIndex: 1, autoAlpha: 1 });

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
      defaults: { duration: 1.1, ease: "power2.inOut" },
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
    tl.fromTo([sections[index], images[index]], {
      yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor)
    }, {
      yPercent: 0
    }, 0);

    const fadeEls = sections[index].querySelectorAll(".anim-fade");
    if (fadeEls.length > 0) {
      tl.fromTo(fadeEls, {
        y: 30 * dFactor,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");
    }

    currentIndex = index;
    updateSlideUI(currentIndex);
  }

  // Observer Touch & Scroll Detection
  Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 15,
    preventDefault: false
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

  gotoSection(0, 1);
});
