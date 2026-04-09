/* ===================================
   FITNESS FREAK — Custom Cursor
   =================================== */
(function() {
  // ---- ELEMENT REFERENCES ----
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  const isTouchLikeDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- TOUCH / REDUCED-MOTION FALLBACK ----
  if (isTouchLikeDevice || prefersReducedMotion) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  // ---- POINTER POSITION STATE ----
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  const lerp = 0.15;

  // ---- POINTER TRACKING ----
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // ---- RING SMOOTHING LOOP ----
  function animateRing() {
    ringX += (mouseX - ringX) * lerp;
    ringY += (mouseY - ringY) * lerp;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // ---- HOVER STATE HANDLING ----
  const hoverTargets = 'a, button, .btn, .nav-link, .glass-card, input, .hero-badge, .service-link, .carousel-btn, .social-icon, .bmi-toggle-btn';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // ---- CLICK FEEDBACK ----
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    setTimeout(() => document.body.classList.remove('cursor-click'), 100);
  });
})();
