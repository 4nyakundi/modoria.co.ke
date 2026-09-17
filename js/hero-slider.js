/**
 * MODORIA - Hero Section Interactive Multi-Image Slider
 * Aligned with the 3 Power Pillars: Branding, Printing, Marketing
 */
document.addEventListener('DOMContentLoaded', () => {
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  const cardSlides = document.querySelectorAll('.hero-card-slide');
  const thumbBtns = document.querySelectorAll('.hero-thumb-btn');
  const pillText = document.getElementById('heroPillText');
  const cardTitle = document.getElementById('heroCardTitle');
  const cardSub = document.getElementById('heroCardSub');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const progressBar = document.getElementById('heroProgressBar');
  const showcaseColumn = document.querySelector('.hero-showcase-column');
  const zoomBtn = document.getElementById('heroZoomBtn');

  if (!bgSlides.length || !cardSlides.length) return;

  const slidesData = [
    {
      pill: 'PILLAR 01 // BRANDING ARCHITECTURE',
      title: 'The Ice Cream Creation Logic',
      sub: 'Logo design, visual identity, typography, colour palettes & vector assets',
      img: 'assets/brand/wall-branding-beta.jpg'
    },
    {
      pill: 'PILLAR 02 // PRECISION PRINTING',
      title: '8 Industrial Manufacturing Lines',
      sub: 'Large format, fleet wraps, 3D signage, t-shirts, brochures, stickers & swag',
      img: 'assets/brand/hero-printing-press.jpg'
    },
    {
      pill: 'PILLAR 03 // PERFORMANCE MARKETING',
      title: 'Digital Acquisition Engine',
      sub: 'Meta Ads, Google Ads, Search Console SEO & Social Media Management',
      img: 'assets/brand/coffee-cup-stickers.jpg'
    }
  ];

  let currentHeroIndex = 0;
  let autoSlideTimer = null;
  let isPaused = false;
  const SLIDE_DURATION = 6000;

  function setHeroSlide(index) {
    if (index < 0) index = slidesData.length - 1;
    if (index >= slidesData.length) index = 0;
    currentHeroIndex = index;

    // Update Fullscreen Background Slides
    bgSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Update Foreground Showcase Card Slides
    cardSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Update Thumbnail Buttons
    thumbBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Update Metadata Text
    const data = slidesData[index];
    if (pillText) pillText.textContent = data.pill;
    if (cardTitle) cardTitle.textContent = data.title;
    if (cardSub) cardSub.textContent = data.sub;

    // Reset and restart progress bar
    if (progressBar) {
      progressBar.style.animation = 'none';
      void progressBar.offsetWidth; // Force DOM reflow
      if (!isPaused) {
        progressBar.style.animation = `heroProgress ${SLIDE_DURATION}ms linear forwards`;
      }
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    if (progressBar && !isPaused) {
      progressBar.style.animation = `heroProgress ${SLIDE_DURATION}ms linear forwards`;
    }
    autoSlideTimer = setInterval(() => {
      if (!isPaused) {
        setHeroSlide(currentHeroIndex + 1);
      }
    }, SLIDE_DURATION);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // Event Listeners for Thumbnails
  thumbBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index, 10);
      setHeroSlide(idx);
      startAutoSlide();
    });
  });

  // Prev / Next Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setHeroSlide(currentHeroIndex - 1);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setHeroSlide(currentHeroIndex + 1);
      startAutoSlide();
    });
  }

  // Lightbox Zoom Trigger
  if (zoomBtn) {
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeSlide = cardSlides[currentHeroIndex];
      const imgPath = activeSlide ? (activeSlide.dataset.lightbox || activeSlide.querySelector('img').src) : '';
      const lightboxModal = document.getElementById('lightboxModal');
      const lightboxImg = document.getElementById('lightboxImg');
      if (lightboxModal && lightboxImg && imgPath) {
        lightboxImg.src = imgPath;
        lightboxModal.classList.add('active');
      }
    });
  }

  // Pause on hover
  if (showcaseColumn) {
    showcaseColumn.addEventListener('mouseenter', () => {
      isPaused = true;
      if (progressBar) progressBar.style.animationPlayState = 'paused';
    });
    showcaseColumn.addEventListener('mouseleave', () => {
      isPaused = false;
      if (progressBar) progressBar.style.animationPlayState = 'running';
    });
  }

  // Initialize
  setHeroSlide(0);
  startAutoSlide();
});
