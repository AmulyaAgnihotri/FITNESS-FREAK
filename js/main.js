/* ===================================
   FITNESS FREAK — Main JavaScript
   Loader, Navbar, Scroll Reveals,
   Stats Counters, Schedule, Orb Parallax,
   Ripple Effects, Smooth Scroll
   =================================== */

(function() {
  'use strict';

  // ---- PAGE LOADER ----
  const loader = document.getElementById('pageLoader');
  const loaderFill = document.getElementById('loaderBarFill');
  const navbar = document.querySelector('.navbar');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hasReducedMotion = () => prefersReducedMotion.matches;
  let startupSequenceStarted = false;

  function bootPageIntro() {
    if (startupSequenceStarted || !loader || !loaderFill || !navbar) return;
    startupSequenceStarted = true;

    const heroUnderline = document.getElementById('heroUnderline');

    if (hasReducedMotion()) {
      loaderFill.style.width = '100%';
      loader.classList.add('hidden');
      navbar.classList.add('visible');
      revealHeroBadges(true);
      if (heroUnderline) heroUnderline.classList.add('active');
      revealHeroChildren(true);
      loader.style.display = 'none';
      return;
    }

    requestAnimationFrame(() => {
      loaderFill.style.width = '100%';
    });

    setTimeout(() => {
      navbar.classList.add('visible');
    }, 90);

    setTimeout(() => {
      loader.classList.add('hidden');
    }, 180);

    setTimeout(() => {
      revealHeroBadges();
    }, 240);

    setTimeout(() => {
      animateHeroHeadline();
    }, 320);

    setTimeout(() => {
      revealHeroChildren();
      if (heroUnderline) heroUnderline.classList.add('active');
    }, 430);

    setTimeout(() => {
      loader.style.display = 'none';
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPageIntro, { once: true });
  } else {
    bootPageIntro();
  }

  window.addEventListener('load', bootPageIntro, { once: true });

  // ---- HERO LETTER-BY-LETTER ----
  function animateHeroHeadline() {
    const lines = document.querySelectorAll('.hero-line');
    let totalDelay = 0;

    lines.forEach((line) => {
      const text = line.textContent;
      line.innerHTML = '';
      const chars = text.split('');

      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.setProperty('--char-index', i);
        span.style.setProperty('--char-total', chars.length);
        span.style.transitionDelay = (totalDelay + i * 50) + 'ms';
        span.style.transition = 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)';
        line.appendChild(span);
      });

      totalDelay += chars.length * 50;
    });

    // Trigger animation
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero-line .letter').forEach(letter => {
        letter.style.opacity = '1';
        letter.style.transform = 'translateY(0)';
      });
    });
  }

  // ---- HERO BADGES ----
  function revealHeroBadges(immediate = false) {
    const badges = document.querySelectorAll('.hero-badge');
    badges.forEach((badge, i) => {
      if (immediate) {
        badge.classList.add('revealed');
        return;
      }
      setTimeout(() => {
        badge.classList.add('revealed');
      }, i * 150);
    });
  }

  // ---- HERO CHILDREN REVEAL ----
  function revealHeroChildren(immediate = false) {
    const items = document.querySelectorAll('.hero-content .reveal-item');
    items.forEach((item, i) => {
      if (immediate) {
        item.classList.add('revealed');
        return;
      }
      setTimeout(() => {
        item.classList.add('revealed');
      }, i * 90);
    });
  }

  // ---- NAVBAR SCROLL BEHAVIOR ----
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Shrink on scroll
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) progressBar.style.width = progress + '%';

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const navMenuLinks = navLinks ? Array.from(navLinks.querySelectorAll('.nav-link')) : [];

  function syncMobileMenuAccessibility(isOpen) {
    if (!navLinks) return;

    const isMobileViewport = window.innerWidth <= 768;
    navLinks.setAttribute('aria-hidden', String(isMobileViewport ? !isOpen : false));

    navMenuLinks.forEach(link => {
      if (isMobileViewport && !isOpen) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  }

  function setMobileMenuState(isOpen) {
    if (!hamburger || !navLinks) return;

    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    syncMobileMenuAccessibility(isOpen);
  }

  function closeMobileMenu() {
    setMobileMenuState(false);
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = !navLinks.classList.contains('open');
      setMobileMenuState(isOpen);
    });

    syncMobileMenuAccessibility(false);
  }

  // Close on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (!hamburger || !navLinks || !navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || hamburger.contains(e.target)) return;
    closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    } else if (navLinks) {
      syncMobileMenuAccessibility(navLinks.classList.contains('open'));
    }
  });

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- SCROLL REVEAL (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .blur-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- BENTO GRID 3D TUMBLE CASCADING ANIMATION ----
  const bentoGrid = document.querySelector('.contact-bento');
  const bentoCards = document.querySelectorAll('.bento-card');

  if (bentoGrid && bentoCards.length > 0) {
    const bentoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !bentoGrid.classList.contains('tumbled-lock')) {
          bentoGrid.classList.add('tumbled-lock'); // Ensure it only fires once

          // Recursively stagger the card tumbling physics
          let cascadeDelay = 0;
          bentoCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('tumbled');
            }, cascadeDelay);

            // Shorter delay for the micro social cards to simulate weight
            cascadeDelay += (index === 0) ? 250 : 150; 
          });

          bentoObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.35, // Wait until map is substantially visible
      rootMargin: '0px 0px -50px 0px'
    });

    bentoObserver.observe(bentoGrid);
  }

  // ---- STATS COUNTER ----
  const statItems = document.querySelectorAll('.stat-item');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statItems.forEach(item => {
          const numEl = item.querySelector('.stat-number');
          const target = parseFloat(item.dataset.target);
          const isDecimal = item.dataset.decimal === 'true';
          animateCounter(numEl, target, 1500, isDecimal);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (statItems.length > 0) {
    statsObserver.observe(statItems[0].closest('.stats'));
  }

  function animateCounter(el, target, duration, decimal) {
    const chars = '!<>-_\\/[]{}—=+*^?#_';
    const scrambleDuration = 600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;

      // Scramble phase
      if (elapsed < scrambleDuration) {
        let scrambleText = '';
        const len = target.toString().length;
        for (let i = 0; i < len; i++) {
          scrambleText += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = scrambleText;
        requestAnimationFrame(tick);
        return;
      }

      // Counting phase
      const countElapsed = elapsed - scrambleDuration;
      const countDuration = duration - scrambleDuration;
      const progress = Math.min(countElapsed / countDuration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (decimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- SCHEDULE BUILDER ----
  const scheduleData = [
    { day: 'Monday', class: 'Weight Training', morning: '6AM–12PM', evening: '4PM–11PM', dayIndex: 1 },
    { day: 'Tuesday', class: 'Cardio Blast', morning: '6AM–12PM', evening: '4PM–11PM', dayIndex: 2 },
    { day: 'Wednesday', class: 'Full Body Strength', morning: '6AM–12PM', evening: '4PM–11PM', dayIndex: 3 },
    { day: 'Thursday', class: 'HIIT Training', morning: '6AM–12PM', evening: '4PM–11PM', dayIndex: 4 },
    { day: 'Friday', class: 'Functional Fitness', morning: '6AM–12PM', evening: '4PM–11PM', dayIndex: 5 },
    { day: 'Saturday', class: 'Open Gym', morning: '6AM–12PM', evening: '4PM–11PM', dayIndex: 6 },
    { day: 'Sunday', class: 'Flex & Mobility', morning: null, evening: '4PM–10PM', dayIndex: 0 }
  ];

  const scheduleGrid = document.getElementById('scheduleGrid');
  const today = new Date().getDay(); // 0=Sunday

  if (scheduleGrid) {
    const scheduleBreakpoint = window.matchMedia('(max-width: 768px)');
    let scheduleMode = '';
    let accordionObserver = null;
    let desktopTimers = [];

    const clearDesktopTimers = () => {
      desktopTimers.forEach(timerId => clearTimeout(timerId));
      desktopTimers = [];
    };

    const teardownSchedule = () => {
      clearDesktopTimers();
      if (accordionObserver) {
        accordionObserver.disconnect();
        accordionObserver = null;
      }

      scheduleGrid.innerHTML = '';
      scheduleGrid.className = 'schedule-accordion';
      scheduleGrid.removeAttribute('role');
      scheduleGrid.removeAttribute('aria-label');
      scheduleGrid.removeAttribute('data-layout');
    };

    const buildMobileSchedule = () => {
      teardownSchedule();
      scheduleMode = 'mobile';
      scheduleGrid.classList.add('is-mobile');
      scheduleGrid.dataset.layout = 'mobile';
      scheduleGrid.setAttribute('role', 'list');
      scheduleGrid.setAttribute('aria-label', 'Weekly class schedule');

      const cards = [];
      const defaultOpenIndex = Math.max(0, scheduleData.findIndex(item => item.dayIndex === today));

      const setExpandedCard = (targetIndex, shouldOpen) => {
        cards.forEach((card, index) => {
          const open = shouldOpen && index === targetIndex;
          const trigger = card.querySelector('.acc-mobile-trigger');
          const panel = card.querySelector('.acc-mobile-panel');

          card.classList.toggle('expanded', open);
          trigger.setAttribute('aria-expanded', String(open));
          panel.setAttribute('aria-hidden', String(!open));
        });
      };

      scheduleData.forEach((item, index) => {
        const isToday = item.dayIndex === today;
        const isOpen = index === defaultOpenIndex;
        const card = document.createElement('article');
        card.className = 'accordion-card mobile-schedule-card' + (isToday ? ' today' : '') + (isOpen ? ' expanded' : '');
        card.setAttribute('role', 'listitem');

        const timeRows = [];
        if (item.morning) {
          timeRows.push(
            `<div class="acc-mobile-row"><span class="acc-mobile-label">Morning</span><span class="acc-mobile-value">${item.morning}</span></div>`
          );
        }
        if (item.evening) {
          timeRows.push(
            `<div class="acc-mobile-row"><span class="acc-mobile-label">Evening</span><span class="acc-mobile-value">${item.evening}</span></div>`
          );
        }

        card.innerHTML = `
          <button
            type="button"
            class="acc-mobile-trigger"
            id="schedule-trigger-${index}"
            aria-expanded="${String(isOpen)}"
            aria-controls="schedule-panel-${index}">
            <span class="acc-mobile-copy">
              <span class="acc-mobile-dayline">
                <span class="acc-mobile-day">${item.day}</span>
                ${isToday ? '<span class="acc-mobile-pill">Today</span>' : ''}
              </span>
              <span class="acc-mobile-class">${item.class}</span>
            </span>
            <span class="acc-mobile-side">
              <span class="acc-mobile-chevron" aria-hidden="true">›</span>
            </span>
          </button>
          <div
            class="acc-mobile-panel"
            id="schedule-panel-${index}"
            role="region"
            aria-labelledby="schedule-trigger-${index}"
            aria-hidden="${String(!isOpen)}">
            <div class="acc-mobile-panel-inner">
              <div class="acc-mobile-times">
                ${timeRows.join('')}
              </div>
            </div>
          </div>
        `;

        const trigger = card.querySelector('.acc-mobile-trigger');
        trigger.addEventListener('click', () => {
          const shouldOpen = !card.classList.contains('expanded');
          setExpandedCard(index, shouldOpen);
        });

        scheduleGrid.appendChild(card);
        cards.push(card);
      });
    };

    const buildDesktopSchedule = () => {
      teardownSchedule();
      scheduleMode = 'desktop';
      scheduleGrid.dataset.layout = 'desktop';

      const cards = [];
      let todayCardIndex = -1;

      scheduleData.forEach((item, index) => {
        const card = document.createElement('div');
        const isToday = item.dayIndex === today;
        if (isToday) todayCardIndex = index;

        card.className = 'accordion-card' + (isToday ? ' today' : '');
        card.style.animation = `spawnCard 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards ${index * 0.1}s`;
        card.style.opacity = '0';

        let inner = '';
        inner += `<div class="acc-day-vertical">${item.day}</div>`;
        inner += `<div class="acc-content">`;
        if (isToday) inner += '<span class="acc-today-badge">TODAY</span>';

        inner += `<div class="acc-day">${item.day}</div>`;
        inner += `<div class="acc-class">${item.class}</div>`;
        inner += '<div class="acc-times">';
        if (item.morning) inner += `<div class="acc-time-col"><span class="acc-time-label">Morning</span><span class="acc-time-val">${item.morning}</span></div>`;
        if (item.evening) inner += `<div class="acc-time-col"><span class="acc-time-label">Evening</span><span class="acc-time-val">${item.evening}</span></div>`;
        inner += '</div></div>';

        card.innerHTML = inner;

        card.addEventListener('mouseenter', () => {
          scheduleGrid.classList.add('user-interacted');
          cards.forEach(currentCard => currentCard.classList.remove('expanded'));
        });

        if (isTouchDevice) {
          card.addEventListener('click', () => {
            scheduleGrid.classList.add('user-interacted');
            const shouldExpand = !card.classList.contains('expanded');
            cards.forEach(currentCard => currentCard.classList.remove('expanded'));
            if (shouldExpand) {
              card.classList.add('expanded');
            }
          });
        }

        scheduleGrid.appendChild(card);
        cards.push(card);
      });

      accordionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !scheduleGrid.classList.contains('animated')) {
            scheduleGrid.classList.add('animated');

            let delay = 300;
            cards.forEach(card => {
              const timerId = setTimeout(() => {
                if (scheduleGrid.classList.contains('user-interacted')) return;
                cards.forEach(currentCard => currentCard.classList.remove('expanded'));
                card.classList.add('expanded');
              }, delay);
              desktopTimers.push(timerId);
              delay += 250;
            });

            const settleTimerId = setTimeout(() => {
              if (scheduleGrid.classList.contains('user-interacted')) return;
              cards.forEach(currentCard => currentCard.classList.remove('expanded'));
              if (todayCardIndex !== -1) {
                cards[todayCardIndex].classList.add('expanded');
              }
            }, delay + 200);
            desktopTimers.push(settleTimerId);

            accordionObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      accordionObserver.observe(scheduleGrid);
    };

    const renderSchedule = (force = false) => {
      const nextMode = scheduleBreakpoint.matches ? 'mobile' : 'desktop';
      if (!force && nextMode === scheduleMode) return;

      if (nextMode === 'mobile') {
        buildMobileSchedule();
      } else {
        buildDesktopSchedule();
      }
    };

    renderSchedule(true);

    if (typeof scheduleBreakpoint.addEventListener === 'function') {
      scheduleBreakpoint.addEventListener('change', () => renderSchedule(true));
    } else {
      window.addEventListener('resize', () => renderSchedule());
    }
  }

  // ---- ORB PARALLAX ON MOUSE (Desktop-only) ----
  if (window.matchMedia('(hover: hover)').matches && !hasReducedMotion()) {
    const orb1 = document.getElementById('orb1');
    const orb2 = document.getElementById('orb2');
    const orb3 = document.getElementById('orb3');

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (orb1) orb1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      if (orb2) orb2.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
      if (orb3) orb3.style.transform = `translate(calc(-50% + ${x * 10}px), calc(-50% + ${y * 10}px))`;
    });
  }

  // ---- BUTTON RIPPLE EFFECTS ----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .nav-cta');
    if (!btn || hasReducedMotion()) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.classList.add('ripple-host');
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });

  // ---- 3D TILT & SPOTLIGHT EFFECT FOR CARDS (Desktop-only) ----
  if (window.matchMedia('(hover: hover)').matches && !hasReducedMotion()) {
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -4;
          const rotateY = ((x - centerX) / centerX) * 4;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
      });
    });

    // ---- MAGNETIC ELEMENTS (Desktop-only) ----
    const magneticElements = document.querySelectorAll('.btn, .nav-link, .social-icon, .nav-logo, .fab-whatsapp, .fab-instagram');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transition = 'transform 0.1s cubic-bezier(0.1, 0, 0.1, 1), box-shadow 0.3s, background 0.3s, border-color 0.3s, color 0.3s';
          el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s, background 0.3s, border-color 0.3s, color 0.3s';
          el.style.transform = '';
        });
      });
    });
  }

  // ---- MULTI-MEDIA LIGHTBOX ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxEmbed = document.getElementById('lightbox-embed');
  const lightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  const vimeoPlayerCache = new WeakMap();
  const mediaList = lightboxTriggers.map(trigger => ({
    src: trigger.dataset.lightboxSrc,
    type: trigger.dataset.lightboxType || 'image'
  }));
  let currentMediaIndex = 0;
  let lastFocusedElement = null;

  const MUTE_BUTTON_ICON_MUTED = `
    <span class="sound-icon icon-muted" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M11 6.2L7.2 9H4.2C3.54 9 3 9.54 3 10.2V13.8C3 14.46 3.54 15 4.2 15H7.2L11 17.8C11.79 18.38 12.9 17.82 12.9 16.84V7.16C12.9 6.18 11.79 5.62 11 6.2Z" fill="currentColor"></path>
        <path d="M16.4 9.3C17.12 10.01 17.52 10.97 17.52 12C17.52 13.03 17.12 13.99 16.4 14.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M19.1 7C20.43 8.33 21.18 10.12 21.18 12C21.18 13.88 20.43 15.67 19.1 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M6.4 5.1L18.9 17.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path>
      </svg>
    </span>
  `;

  const MUTE_BUTTON_ICON_UNMUTED = `
    <span class="sound-icon icon-unmuted" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M11 6.2L7.2 9H4.2C3.54 9 3 9.54 3 10.2V13.8C3 14.46 3.54 15 4.2 15H7.2L11 17.8C11.79 18.38 12.9 17.82 12.9 16.84V7.16C12.9 6.18 11.79 5.62 11 6.2Z" fill="currentColor"></path>
        <path d="M16.4 9.3C17.12 10.01 17.52 10.97 17.52 12C17.52 13.03 17.12 13.99 16.4 14.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M19.1 7C20.43 8.33 21.18 10.12 21.18 12C21.18 13.88 20.43 15.67 19.1 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </svg>
    </span>
  `;

  function ensureMuteButtonIcons(btn) {
    if (!btn || btn.dataset.iconReady === 'true') return;

    btn.innerHTML = `${MUTE_BUTTON_ICON_MUTED}${MUTE_BUTTON_ICON_UNMUTED}`;
    btn.dataset.iconReady = 'true';
  }

  function setMuteButtonState(btn, isMuted) {
    if (!btn) return;

    ensureMuteButtonIcons(btn);

    const nextActionLabel = isMuted ? 'Unmute video' : 'Mute video';

    btn.dataset.soundState = isMuted ? 'muted' : 'unmuted';
    btn.classList.toggle('is-muted', isMuted);
    btn.classList.toggle('is-unmuted', !isMuted);
    btn.setAttribute('aria-pressed', String(!isMuted));
    btn.setAttribute('aria-label', nextActionLabel);
    btn.setAttribute('title', nextActionLabel);
  }

  function animateMuteButton(btn) {
    if (!btn) return;

    btn.classList.remove('is-animating');
    void btn.offsetWidth;
    btn.classList.add('is-animating');

    window.setTimeout(() => {
      btn.classList.remove('is-animating');
    }, 260);
  }

  function getCardVideo(btn) {
    const card = btn.closest('.transform-card, .tour-card, .trainer-card, .reel-item');
    if (!card) return null;
    return card.querySelector('video') || card.querySelector('iframe');
  }

  function getVimeoPlayer(media) {
    if (!media || media.tagName.toLowerCase() !== 'iframe' || !window.Vimeo) return null;

    if (!vimeoPlayerCache.has(media)) {
      vimeoPlayerCache.set(media, new Vimeo.Player(media));
    }

    return vimeoPlayerCache.get(media);
  }

  function syncAllMuteButtons() {
    document.querySelectorAll('[data-mute-toggle]').forEach(btn => {
      const media = getCardVideo(btn);
      if (media) {
        if (media.tagName.toLowerCase() === 'iframe' && window.Vimeo) {
          const player = getVimeoPlayer(media);
          if (!player) return;

          player.getMuted().then(muted => {
            setMuteButtonState(btn, muted);
          }).catch(console.error);
        } else {
          setMuteButtonState(btn, media.muted);
        }
      }
    });
  }

  function updateLightboxContent() {
    const media = mediaList[currentMediaIndex];
    if (!media || !lightboxImg || !lightboxVideo || !lightboxEmbed) return;

    lightboxImg.hidden = true;
    lightboxImg.src = '';
    lightboxVideo.hidden = true;
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxEmbed.hidden = true;
    lightboxEmbed.src = '';

    if (media.type === 'video') {
      lightboxVideo.hidden = false;
      lightboxVideo.src = media.src;
      lightboxVideo.play().catch(() => {});
    } else if (media.type === 'embed') {
      lightboxEmbed.hidden = false;
      lightboxEmbed.src = media.src;
    } else {
      lightboxImg.hidden = false;
      lightboxImg.src = media.src;
    }
  }

  function openLightbox(src) {
    if (!lightbox) return;

    currentMediaIndex = mediaList.findIndex(media => media.src === src);
    if (currentMediaIndex === -1) currentMediaIndex = 0;

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeButton = lightbox.querySelector('[data-lightbox-action="close"]');
    if (closeButton instanceof HTMLElement) {
      closeButton.focus({ preventScroll: true });
    }
  }

  function closeLightbox() {
    if (!lightbox || !lightboxVideo || !lightboxImg || !lightboxEmbed) return;

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxVideo.hidden = true;
    lightboxEmbed.src = '';
    lightboxEmbed.hidden = true;
    lightboxImg.src = '';
    lightboxImg.hidden = true;

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
      lastFocusedElement = null;
    }
  }

  function changeLightbox(direction) {
    if (!lightbox || !lightbox.classList.contains('active') || mediaList.length === 0) return;

    currentMediaIndex += direction;
    if (currentMediaIndex < 0) currentMediaIndex = mediaList.length - 1;
    if (currentMediaIndex >= mediaList.length) currentMediaIndex = 0;
    updateLightboxContent();
  }

  function toggleInlineVideoMute(btn) {
    const media = getCardVideo(btn);
    if (!media) return;

    if (media.tagName.toLowerCase() === 'iframe' && window.Vimeo) {
      const player = getVimeoPlayer(media);
      if (!player) return;

      player.getMuted().then(muted => {
        if (muted) {
          player.setMuted(false);
          setMuteButtonState(btn, false);
          
          document.querySelectorAll('iframe').forEach(otherIframe => {
            if (otherIframe !== media && otherIframe.src.includes('vimeo.com')) {
              const otherPlayer = getVimeoPlayer(otherIframe);
              if (otherPlayer) otherPlayer.setMuted(true);
              const otherCard = otherIframe.closest('.transform-card, .tour-card, .trainer-card, .reel-item');
              if (otherCard) {
                const otherBtn = otherCard.querySelector('[data-mute-toggle]');
                if (otherBtn) setMuteButtonState(otherBtn, true);
              }
            }
          });
        } else {
          player.setMuted(true);
          setMuteButtonState(btn, true);
        }
      }).catch(console.error);
      
      animateMuteButton(btn);
      return;
    }

    if (media.muted) {
      document.querySelectorAll('video').forEach(otherVideo => {
        if (otherVideo !== media && otherVideo !== lightboxVideo) {
          otherVideo.muted = true;
          otherVideo.defaultMuted = true;
          otherVideo.setAttribute('muted', '');
        }
      });
      media.muted = false;
      media.defaultMuted = false;
      media.removeAttribute('muted');
      media.play().catch(() => {});
    } else {
      media.muted = true;
      media.defaultMuted = true;
      media.setAttribute('muted', '');
    }

    syncAllMuteButtons();
    animateMuteButton(btn);
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.closest?.('[data-mute-toggle]') || e.target.closest?.('[data-lightbox-action]')) {
      return;
    }

    const lightboxTrigger = e.target.closest?.('[data-lightbox-src]');
    if (lightboxTrigger && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openLightbox(lightboxTrigger.dataset.lightboxSrc);
      return;
    }

    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeLightbox(1);
    if (e.key === 'ArrowLeft') changeLightbox(-1);
  });

  document.addEventListener('click', (event) => {
    const muteBtn = event.target.closest('[data-mute-toggle]');
    if (muteBtn) {
      event.preventDefault();
      event.stopPropagation();
      toggleInlineVideoMute(muteBtn);
      return;
    }

    const lightboxControl = event.target.closest('[data-lightbox-action]');
    if (lightboxControl) {
      const action = lightboxControl.dataset.lightboxAction;
      if (action === 'close') closeLightbox();
      if (action === 'prev') changeLightbox(-1);
      if (action === 'next') changeLightbox(1);
      return;
    }

    const lightboxTrigger = event.target.closest('[data-lightbox-src]');
    if (lightboxTrigger) {
      openLightbox(lightboxTrigger.dataset.lightboxSrc);
    }
  });

  if (lightbox) {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) closeLightbox();
    });
  }

  syncAllMuteButtons();

  // --- MOBILE MEDIA RAILS ---
  const mediaRailQuery = window.matchMedia('(max-width: 768px)');
  const mediaRailShells = document.querySelectorAll('.media-rail-shell[data-media-rail]');

  mediaRailShells.forEach(shell => {
    const track = shell.querySelector('.media-rail-track');
    const prevBtn = shell.querySelector('[data-rail-dir="prev"]');
    const nextBtn = shell.querySelector('[data-rail-dir="next"]');
    const cards = Array.from(shell.querySelectorAll('.transform-card, .tour-card'));

    if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

    let scrollFrame = 0;

    const getStepSize = () => {
      if (cards.length < 2) return cards[0].offsetWidth;
      const measuredStep = cards[1].offsetLeft - cards[0].offsetLeft;
      return measuredStep || cards[0].offsetWidth;
    };

    const updateRailState = () => {
      scrollFrame = 0;

      const isMobile = mediaRailQuery.matches;
      const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
      const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      const visualProgress = maxScroll > 0 ? Math.max(progress, 0.14) : 1;

      shell.style.setProperty('--rail-progress', progress.toFixed(4));
      shell.style.setProperty('--rail-progress-visual', visualProgress.toFixed(4));

      prevBtn.disabled = !isMobile || track.scrollLeft <= 4;
      nextBtn.disabled = !isMobile || track.scrollLeft >= maxScroll - 4;

      if (!isMobile) {
        cards.forEach(card => card.classList.remove('is-rail-active'));
        return;
      }

      const viewportCenter = track.scrollLeft + (track.clientWidth / 2);
      let activeCard = cards[0];
      let nearestDistance = Infinity;

      cards.forEach(card => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          activeCard = card;
        }
      });

      cards.forEach(card => {
        card.classList.toggle('is-rail-active', card === activeCard);
      });
    };

    const queueRailUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateRailState);
    };

    const moveRail = (direction) => {
      if (!mediaRailQuery.matches) return;
      track.scrollBy({
        left: getStepSize() * direction,
        behavior: 'smooth'
      });
    };

    prevBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      moveRail(-1);
    });

    nextBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      moveRail(1);
    });

    track.addEventListener('scroll', queueRailUpdate, { passive: true });
    window.addEventListener('resize', queueRailUpdate);

    if (typeof mediaRailQuery.addEventListener === 'function') {
      mediaRailQuery.addEventListener('change', queueRailUpdate);
    } else if (typeof mediaRailQuery.addListener === 'function') {
      mediaRailQuery.addListener(queueRailUpdate);
    }

    queueRailUpdate();
  });

  // --- LENIS SMOOTH SCROLL (Desktop-only — native touch scroll is smoother on mobile) ---
  if(typeof Lenis !== 'undefined' && window.matchMedia('(hover: hover)').matches && !hasReducedMotion()) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- SMART MEDIA OBSERVER (PLAY ONLY WHEN TRULY IN VIEW) ---
  const backgroundMedia = document.querySelectorAll('video:not(#lightbox-video), iframe[src*="player.vimeo.com"]:not(#lightbox-embed)');
  const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const media = entry.target;
      const isVisibleEnough = entry.isIntersecting && entry.intersectionRatio >= 0.6;

      if (media.tagName.toLowerCase() === 'iframe') {
        const player = getVimeoPlayer(media);
        if (!player) return;

        if (isVisibleEnough && !document.hidden) {
          player.play().catch(() => {});
        } else {
          player.pause().catch(() => {});
        }
        return;
      }

      if (isVisibleEnough && !document.hidden) {
        media.play().catch(() => {});
      } else {
        media.pause();
      }
    });
  }, {
    threshold: [0, 0.25, 0.6, 0.85]
  });

  backgroundMedia.forEach(media => {
    if (media.tagName.toLowerCase() === 'iframe') {
      const player = getVimeoPlayer(media);
      if (player) {
        player.pause().catch(() => {});
      }
    } else {
      media.pause();
    }

    mediaObserver.observe(media);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;

    backgroundMedia.forEach(media => {
      if (media.tagName.toLowerCase() === 'iframe') {
        const player = getVimeoPlayer(media);
        if (player) player.pause().catch(() => {});
      } else {
        media.pause();
      }
    });
  });

})();
