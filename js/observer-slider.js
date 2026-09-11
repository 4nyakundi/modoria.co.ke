/* GSAP Observer Fullscreen Slider Engine for Home Page */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.observer-container')) return;

  gsap.registerPlugin(Observer);

  const sections = document.querySelectorAll(".obs-section");
  const images = document.querySelectorAll(".obs-section .bg");
  const headings = document.querySelectorAll(".obs-section .section-heading");
  const outerWrappers = gsap.utils.toArray(".obs-section .outer");
  const innerWrappers = gsap.utils.toArray(".obs-section .inner");
  const dots = document.querySelectorAll(".slide-dot");
  const slideCounter = document.getElementById("slideCurrentIndex");

  let currentIndex = -1;
  const wrap = gsap.utils.wrap(0, sections.length);
  let animating = false;

  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });

  function updateActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    if (slideCounter) {
      slideCounter.textContent = `0${index + 1} / 0${sections.length}`;
    }
  }

  function gotoSection(index, direction) {
    index = wrap(index);
    if (index === currentIndex && currentIndex !== -1) return;
    animating = true;

    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    const tl = gsap.timeline({
      defaults: { duration: 1.15, ease: "power2.inOut" },
      onComplete: () => { animating = false; }
    });

    if (currentIndex >= 0) {
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { yPercent: -15 * dFactor })
        .set(sections[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    
    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      { yPercent: i => i ? -100 * dFactor : 100 * dFactor },
      { yPercent: 0 },
      0
    )
    .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
    .fromTo(
      sections[index].querySelectorAll(".anim-fade"),
      { autoAlpha: 0, y: 30 * dFactor },
      { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
      0.3
    );

    currentIndex = index;
    updateActiveDot(index);
  }

  Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 15,
    preventDefault: true
  });

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.dataset.slide, 10);
      if (!animating && targetIndex !== currentIndex) {
        const dir = targetIndex > currentIndex ? 1 : -1;
        gotoSection(targetIndex, dir);
      }
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('nav') && document.getElementById('nav').style.visibility === 'visible') return;
    if (document.querySelector('.wa-modal-backdrop.open')) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (!animating) gotoSection(currentIndex + 1, 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (!animating) gotoSection(currentIndex - 1, -1);
    }
  });

  // Initialize first slide
  gotoSection(0, 1);
});
