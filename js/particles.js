/* ===================================
   FITNESS FREAK — Particle System
   =================================== */
(function() {
  // ---- CANVAS SETUP ----
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobileViewport = window.matchMedia('(max-width: 768px)');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles = [];
  let animationFrameId = 0;
  let resizeTimer = 0;

  function getParticleCount() {
    if (prefersReducedMotion.matches) return 0;
    return isMobileViewport.matches ? 48 : 96;
  }

  // ---- CANVAS SIZING ----
  function resize() {
    const section = canvas.parentElement;
    if (!section) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = section.offsetWidth;
    const height = section.offsetHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---- PARTICLE FACTORY ----
  function createParticle() {
    return {
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? '#E31E24' : 'rgba(255,255,255,0.6)'
    };
  }

  // ---- PARTICLE INITIALIZATION ----
  function init() {
    resize();
    particles = [];
    for (let i = 0; i < getParticleCount(); i++) {
      particles.push(createParticle());
    }
  }

  // ---- ANIMATION LOOP ----
  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    animationFrameId = window.requestAnimationFrame(draw);
  }

  function stop() {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
  }

  function start() {
    stop();

    if (document.hidden || prefersReducedMotion.matches) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      return;
    }

    init();
    draw();
  }

  // ---- STARTUP + LIFECYCLE ----
  start();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      start();
    }, 200);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
      return;
    }

    start();
  });

  const motionChangeHandler = () => start();
  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', motionChangeHandler);
    isMobileViewport.addEventListener('change', motionChangeHandler);
  } else {
    prefersReducedMotion.addListener(motionChangeHandler);
    isMobileViewport.addListener(motionChangeHandler);
  }
})();
