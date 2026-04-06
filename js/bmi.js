/* ===================================
   FITNESS FREAK — BMI Calculator
   =================================== */
(function() {
  // ---- ELEMENT REFERENCES ----
  const toggleBtns = document.querySelectorAll('.bmi-toggle-btn');
  const toggleEl = document.getElementById('bmiToggle');
  const calcBtn = document.getElementById('bmiCalculate');
  const resultEl = document.getElementById('bmiResult');
  const numberEl = document.getElementById('bmiNumber');
  const labelEl = document.getElementById('bmiLabel');
  const dotEl = document.getElementById('bmiDot');

  let gender = 'male';

  // ---- DESKTOP CARD TILT EFFECT ----
  const bmiCard = document.querySelector('.bmi-card');
  const canHover = window.matchMedia('(hover: hover)').matches;
  if (bmiCard && canHover) {
    bmiCard.addEventListener('mousemove', (e) => {
      const rect = bmiCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      bmiCard.style.setProperty('--mouse-x', `${x}px`);
      bmiCard.style.setProperty('--mouse-y', `${y}px`);

      // Calculate 3D parallax max 5 degrees
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5; 
      const rotateY = ((x - centerX) / centerX) * 5;
      
      bmiCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    bmiCard.addEventListener('mouseleave', () => {
      bmiCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      bmiCard.style.setProperty('--mouse-x', `-1000px`);
      bmiCard.style.setProperty('--mouse-y', `-1000px`);
    });
  }

  // ---- GENDER TOGGLE ----
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gender = btn.dataset.gender;
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      toggleEl.dataset.active = gender;
    });
  });

  // ---- BMI CALCULATION FLOW ----
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const height = parseFloat(document.getElementById('bmiHeight').value);
      const weight = parseFloat(document.getElementById('bmiWeight').value);

      if (!height || !weight || height <= 0 || weight <= 0) return;

      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      const bmiVal = Math.round(bmi * 10) / 10;

      // Show result
      resultEl.classList.add('visible');

      // Count up animation
      animateCount(numberEl, bmiVal, 800);

      // Label
      let label = '', cls = '';
      if (bmiVal < 18.5) { label = 'Underweight'; cls = 'underweight'; }
      else if (bmiVal < 25) { label = 'Healthy Weight ✓'; cls = 'healthy'; }
      else if (bmiVal < 30) { label = 'Overweight'; cls = 'overweight'; }
      else { label = 'Obese'; cls = 'obese'; }

      labelEl.textContent = label;
      labelEl.className = 'bmi-result-label ' + cls;

      // Dot position (map BMI 15-40 to 0-100%)
      const minBmi = 15, maxBmi = 40;
      let pct = ((bmiVal - minBmi) / (maxBmi - minBmi)) * 100;
      pct = Math.max(0, Math.min(100, pct));
      setTimeout(() => {
        dotEl.style.left = pct + '%';
      }, 100);
    });
  }

  // ---- RESULT NUMBER ANIMATION ----
  function animateCount(el, target, duration) {
    const scrambleDuration = 800; // Duration of chaotic sci-fi numbers
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;

      // Scramble cipher phase
      if (elapsed < scrambleDuration) {
        // Flash randomized BMI decimals rapidly
        el.textContent = (Math.random() * 30 + 10).toFixed(1);
        requestAnimationFrame(tick);
        return;
      }

      // Hard snap completion
      el.textContent = target.toFixed(1);
      
      // Explosion pulse animation on final delivery
      el.style.transform = 'scale(1.2)';
      setTimeout(() => el.style.transform = 'scale(1)', 400);
    }
    requestAnimationFrame(tick);
  }
})();
