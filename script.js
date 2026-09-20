/* =====================================================================
   VEERASINGAM M. — PORTFOLIO SCRIPT
   Sections:
   1. Theme toggle (dark/light + localStorage)
   2. Particle canvas background
   3. Custom cursor (desktop only)
   4. Typing animation (hero tagline)
   5. Navbar: scroll background + mobile menu
   6. Scroll-spy (highlight active nav link)
   7. Animated skill bars (IntersectionObserver)
   8. Contact form (front-end only demo)
   9. Footer year
   ===================================================================== */

// Run everything once the HTML is fully parsed
document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------
     1. THEME TOGGLE
     We store the choice in localStorage under the key "theme" so the
     site remembers dark/light across visits.
  ------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const bodyEl = document.body;

  // On load: check localStorage first, otherwise fall back to the
  // visitor's OS-level preference.
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    bodyEl.classList.add('light-mode');
  }

  themeToggleBtn.addEventListener('click', () => {
    bodyEl.classList.toggle('light-mode');
    const isLight = bodyEl.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });


  /* -------------------------------------------------------------------
     2. PARTICLE CANVAS BACKGROUND
     A lightweight field of dots that drift slowly and connect with
     thin lines when close together. Particle count scales down on
     small screens to keep things smooth on mobile.
  ------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationFrameId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function getParticleCount() {
    // Fewer particles on narrow / mobile screens = better performance
    const area = window.innerWidth * window.innerHeight;
    const isMobile = window.innerWidth < 700;
    const base = isMobile ? 35 : 90;
    return Math.min(base, Math.floor(area / 14000));
  }

  function createParticles() {
    const count = getParticleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isLight = bodyEl.classList.contains('light-mode');
    const dotColor = isLight ? 'rgba(90, 60, 180, 0.35)' : 'rgba(0, 212, 255, 0.55)';
    const lineColorBase = isLight ? '90, 60, 180' : '0, 212, 255';

    // Move + draw each particle
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges instead of bouncing (keeps motion feeling continuous)
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });

    // Connect nearby particles with a faint line — capped distance
    // keeps this from becoming an O(n^2) performance problem visually
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = 1 - dist / maxDist;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(drawParticles);
  }

  // Pause the animation when the tab isn't visible — saves battery/CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      drawParticles();
    }
  });

  resizeCanvas();
  createParticles();
  drawParticles();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Debounce resize so we don't rebuild particles on every pixel change
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createParticles();
    }, 200);
  });


  /* -------------------------------------------------------------------
     3. CUSTOM CURSOR (desktop only)
     We detect a real mouse via the "pointer: fine" media query rather
     than just checking screen width, since that's a more accurate
     signal than viewport size alone.
  ------------------------------------------------------------------- */
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (hasFinePointer) {
    bodyEl.classList.add('cursor-active');

    // Ring follows with a slight delay for a smooth trailing feel;
    // dot follows instantly.
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateRing() {
      // Ease the ring towards the mouse position each frame
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Grow the ring when hovering anything clickable
    const interactiveSelectors = 'a, button, input, textarea, .glass-card';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => bodyEl.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => bodyEl.classList.remove('cursor-hover'));
    });
  }


  /* -------------------------------------------------------------------
     4. TYPING ANIMATION — hero tagline
     Cycles through a short list of phrases, typing and deleting each
     one in turn.
  ------------------------------------------------------------------- */
  const typingEl = document.getElementById('typing-text');
  const phrases = [
    'Aspiring Full Stack Developer',
    'Frontend built with care',
    'Fresher, ready to ship'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typingEl.textContent = currentPhrase.substring(0, charIndex);

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Full phrase typed — pause, then start deleting
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Fully deleted — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();


  /* -------------------------------------------------------------------
     5. NAVBAR — background on scroll + mobile menu toggle
  ------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
  });

  // Close the mobile menu whenever a nav link is tapped
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });


  /* -------------------------------------------------------------------
     6. SCROLL-SPY
     Watches each <section> and highlights the matching nav link when
     that section is the one most visible in the viewport.
  ------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    // Counts a section as "active" once it crosses the middle of the screen
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  });

  sections.forEach(section => spyObserver.observe(section));


  /* -------------------------------------------------------------------
     7. ANIMATED SKILL BARS
     Each .skill-bar has data-level="N" (0-100). When it scrolls into
     view for the first time, we animate its fill width and count the
     percentage text up to match.
  ------------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const bar = entry.target;
      const level = parseInt(bar.dataset.level, 10);
      const fillEl = bar.querySelector('.skill-fill');
      const percentEl = bar.querySelector('.skill-percent');

      // Animate the visual bar via CSS transition
      fillEl.style.width = `${level}%`;

      // Animate the number counting up, matched roughly to the same duration
      let current = 0;
      const duration = 1100;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = level / steps;

      const countInterval = setInterval(() => {
        current += increment;
        if (current >= level) {
          current = level;
          clearInterval(countInterval);
        }
        percentEl.textContent = `${Math.round(current)}%`;
      }, stepTime);

      // Only animate once per bar
      observer.unobserve(bar);
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* -------------------------------------------------------------------
     8. CONTACT FORM (front-end only)
     There's no backend wired up yet. This just prevents the default
     page reload and shows a confirmation message. Swap this out for
     a real API call (e.g. Formspree, EmailJS) when ready.
  ------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = "Thanks! I'll get back to you soon — or email me directly anytime.";
    contactForm.reset();
  });


  /* -------------------------------------------------------------------
     9. FOOTER YEAR
  ------------------------------------------------------------------- */
  document.getElementById('footer-year').textContent = new Date().getFullYear();


  /* Project card micro-interaction: disabled for touch and reduced-motion users. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 4;
        const rotateX = (0.5 - y) * 4;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

});