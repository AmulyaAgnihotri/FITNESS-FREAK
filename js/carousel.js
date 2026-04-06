/* ===================================
   FITNESS FREAK — Testimonial Carousel
   =================================== */
(function() {
  // ---- ELEMENT REFERENCES ----
  const track = document.getElementById('carouselTrack');
  const leftBtn = document.getElementById('carouselLeft');
  const rightBtn = document.getElementById('carouselRight');
  if (!track) return;

  // ---- TESTIMONIAL DATA ----
  const testimonials = [
    {
      stars: 5,
      quote: "Fitness Freak transformed my life completely. Lost 15kg in 4 months with the help of their amazing trainers. The equipment is top-notch and the environment is incredibly motivating!",
      name: "Rahul Sharma",
      duration: "Member since 8 months"
    },
    {
      stars: 5,
      quote: "Best gym in Lakhimpur Kheri, hands down. The trainers really know their stuff and the Fitline equipment is world-class. I've never felt stronger or more confident.",
      name: "Priya Verma",
      duration: "Member since 1 year"
    },
    {
      stars: 5,
      quote: "I was nervous joining a gym for the first time but the team made me feel right at home. The coaching is personalized and they truly care about your progress.",
      name: "Amit Kumar",
      duration: "Member since 6 months"
    },
    {
      stars: 5,
      quote: "The atmosphere at Fitness Freak is electric. Every session pushes me harder. The trainers are dedicated and the pricing is very affordable. Highly recommended!",
      name: "Sneha Patel",
      duration: "Member since 3 months"
    },
    {
      stars: 5,
      quote: "From weight training to cardio, they have everything covered. The management keeps the gym spotless and well-organized. It's the perfect place to work on yourself.",
      name: "Vikash Singh",
      duration: "Member since 10 months"
    }
  ];

  // ---- CARD RENDERING ----
  testimonials.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
      <p class="testimonial-quote">"${t.quote}"</p>
      <div class="testimonial-author">${t.name}</div>
      <div class="testimonial-duration">${t.duration}</div>
    `;
    track.appendChild(card);
  });

  // ---- CAROUSEL STATE ----
  let currentIndex = 0;
  let autoplayTimer;
  const gap = 24;

  // ---- SLIDE CALCULATIONS ----
  function getCardWidth() {
    const card = track.querySelector('.testimonial-card');
    if (!card) return 340;
    return card.offsetWidth + gap;
  }

  function getMaxIndex() {
    const cards = track.querySelectorAll('.testimonial-card');
    const wrapperWidth = track.parentElement.offsetWidth;
    const cardW = getCardWidth();
    const visible = Math.floor(wrapperWidth / cardW);
    return Math.max(0, cards.length - visible);
  }

  // ---- NAVIGATION ----
  function slide(direction) {
    const maxIdx = getMaxIndex();
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = maxIdx;
    if (currentIndex > maxIdx) currentIndex = 0;
    updatePosition();
  }

  function updatePosition() {
    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
  }

  // ---- AUTOPLAY ----
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => slide(1), 4000);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  if (leftBtn) leftBtn.addEventListener('click', () => { slide(-1); startAutoplay(); });
  if (rightBtn) rightBtn.addEventListener('click', () => { slide(1); startAutoplay(); });

  // ---- HOVER PAUSE ----
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // ---- TOUCH SWIPE SUPPORT ----
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      slide(diff > 0 ? 1 : -1);
    }
    startAutoplay();
  }, { passive: true });

  startAutoplay();

  // ---- RESIZE RECALCULATION ----
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      updatePosition();
    }, 200);
  });
})();
