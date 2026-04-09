/* ===================================
   FITNESS FREAK — Progressive Enhancements
   Keeps optional UX helpers isolated so the
   main experience stays lean and predictable.
   =================================== */
(function() {
  'use strict';

  function initBeforeAfterSliders() {
    const sliders = document.querySelectorAll('.before-after-slider');

    sliders.forEach((slider) => {
      const range = slider.querySelector('.slider-range');
      const handle = slider.querySelector('.slider-handle');
      const beforeWrapper = slider.querySelector('.img-before-wrapper');

      if (!range || !handle || !beforeWrapper) return;

      const syncSlider = (value) => {
        beforeWrapper.style.width = `${value}%`;
        handle.style.left = `${value}%`;
      };

      syncSlider(range.value);
      range.addEventListener('input', (event) => syncSlider(event.target.value));
    });
  }

  function disableUnusedTouchEffects() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouchDevice) return;

    document.querySelectorAll('.hero-badge').forEach((element) => {
      if (element.vanillaTilt) {
        element.vanillaTilt.destroy();
      }
    });
  }

  function initEnhancements() {
    initBeforeAfterSliders();
    disableUnusedTouchEffects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements, { once: true });
  } else {
    initEnhancements();
  }
})();
