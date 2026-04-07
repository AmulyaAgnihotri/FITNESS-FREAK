/* ===================================
   FITNESS FREAK — Enhancements
   =================================== */

document.addEventListener("DOMContentLoaded", () => {
  initBeforeAfterSliders();
  initPerformanceOptimizations();
});

/* --- BEFORE / AFTER SLIDERS --- */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.before-after-slider');
  
  sliders.forEach(slider => {
    const range = slider.querySelector('.slider-range');
    const handle = slider.querySelector('.slider-handle');
    const beforeWrapper = slider.querySelector('.img-before-wrapper');

    if (!range || !handle || !beforeWrapper) return;

    range.addEventListener('input', (e) => {
      const val = e.target.value;
      beforeWrapper.style.width = `${val}%`;
      handle.style.left = `${val}%`;
    });
  });
}

/* --- PERFORMANCE OPTIMIZATIONS --- */
function initPerformanceOptimizations() {
  // 1. Pause animations/particles on Tab Unfocus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.add('tab-inactive');
    } else {
      document.body.classList.remove('tab-inactive');
    }
  });

  // 2. Disable heavy features on mobile/touch dynamically
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (isTouchDevice) {
    document.body.classList.add('is-touch-device');
    // In animations.css / Main JS, standard cursor rules 
    // are already overwritten by media query in new-sections.css.
    
    // We can also disable Tilt effects from heavy JS.
    // If vanilla-tilt.js is running, we can destroy it (assuming it's here)
    const tiltElements = document.querySelectorAll('.hero-badge');
    tiltElements.forEach(el => {
      if (el.vanillaTilt) el.vanillaTilt.destroy();
    });
  }
}
