/* ========================================
   SUDHARSHANAN PORTFOLIO – CINEMATIC JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. CANVAS PARTICLE SYSTEM (GPU-efficient) ---- */
  const canvas = document.createElement('canvas');
  canvas.id = 'cinematicCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.55;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const PARTICLE_COUNT = 60;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      const palettes = [
        [124, 58, 237],
        [6, 182, 212],
        [168, 85, 247],
      ];
      this.color = palettes[Math.floor(Math.random() * palettes.length)];
    }
    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;
      const progress = this.life / this.maxLife;
      if (progress < 0.15) {
        this.opacity = (progress / 0.15) * this.maxOpacity;
      } else if (progress > 0.8) {
        this.opacity = ((1 - progress) / 0.2) * this.maxOpacity;
      } else {
        this.opacity = this.maxOpacity;
      }
      if (this.life >= this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const [r, g, b] = this.color;
      ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},${this.opacity * 0.8})`;
      ctx.shadowBlur = this.size * 4;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let rafId;
  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    ctx.shadowBlur = 0;
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* ---- 2. MAGNETIC CURSOR ---- */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    ringX += dx * 0.1;
    ringY += dy * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  const interactives = document.querySelectorAll(
    'a, button, .project-card, .cert-card, .achievement-card, .stat-card, .contact-card, .skill-badge, .float-card'
  );
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  /* ---- 3. MOUSE SPOTLIGHT on PROJECT & CERT CARDS ---- */
  function addSpotlight(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top)  + 'px');
      });
    });
  }
  addSpotlight('.project-card');
  addSpotlight('.cert-card');

  /* ---- 4. NAVBAR SCROLL ---- */
  const navbar  = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
  }, { passive: true });

  /* ---- 5. MOBILE HAMBURGER ---- */
  const hamburger   = document.getElementById('hamburger');
  const navLinksEl  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  /* ---- 6. TYPED TEXT ---- */
  const roles = [
    'Full Stack Developer',
    'ServiceNow Developer',
    'Flutter App Developer',
    'AI/ML Enthusiast',
    'Problem Solver',
  ];

  const typedEl = document.getElementById('typedText');
  let roleIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

  function typeText() {
    const cur = roles[roleIndex];
    typedEl.textContent = isDeleting
      ? cur.substring(0, charIndex - 1)
      : cur.substring(0, charIndex + 1);
    charIndex += isDeleting ? -1 : 1;
    typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === cur.length) { isDeleting = true; typingSpeed = 2200; }
    else if (isDeleting && charIndex === 0)      { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typingSpeed = 400; }

    setTimeout(typeText, typingSpeed);
  }
  setTimeout(typeText, 900);

  /* ---- 7. CINEMATIC SCROLL REVEAL ---- */
  // Assign directional reveal classes based on element type
  const revealMap = [
    { selector: '.section-header',    cls: 'reveal' },
    { selector: '.about-text',        cls: 'reveal-left' },
    { selector: '.about-stats',       cls: 'reveal-right' },
    { selector: '.stat-card',         cls: 'reveal-scale' },
    { selector: '.timeline-card',     cls: 'reveal' },
    { selector: '.project-card',      cls: 'reveal-scale' },
    { selector: '.skill-category',    cls: 'reveal' },
    { selector: '.cert-card',         cls: 'reveal' },
    { selector: '.achievement-card',  cls: 'reveal-scale' },
    { selector: '.contact-card',      cls: 'reveal' },
  ];

  const allReveals = [];
  revealMap.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
      allReveals.push(el);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger based on index within parent
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  allReveals.forEach(el => revealObserver.observe(el));

  /* ---- 8. SKILL BAR FILL ---- */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ---- 9. COUNTER ANIMATION ---- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const duration = 2000;
    const step     = target / (duration / 16);
    let current    = 0;
    const timer    = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ---- 10. PROJECT CARD TILT ---- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -6;
      const rotateY = ((x - rect.width  / 2) / rect.width)  *  6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- 11. SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- 12. PAGE LOAD FADE-IN ---- */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  /* ---- 13. KONAMI EASTER EGG ---- */
  let konamiSeq = [];
  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  document.addEventListener('keydown', (e) => {
    konamiSeq.push(e.key);
    if (konamiSeq.length > konamiCode.length) konamiSeq.shift();
    if (JSON.stringify(konamiSeq) === JSON.stringify(konamiCode)) showEasterEgg();
  });

  function showEasterEgg() {
    const msg = document.createElement('div');
    msg.innerHTML = '🚀 You found the Easter Egg!<br>Sudharshanan Rocks! 🏆';
    msg.style.cssText = `
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:linear-gradient(135deg,#7c3aed,#06b6d4);
      color:white;font-size:1.4rem;font-weight:800;text-align:center;
      padding:2rem 3rem;border-radius:24px;z-index:99999;
      box-shadow:0 0 80px rgba(124,58,237,0.8),0 0 0 1px rgba(255,255,255,0.1);
      animation:cin-up 0.5s ease;font-family:'Outfit',sans-serif;
      backdrop-filter:blur(20px);line-height:1.6;
    `;
    document.body.appendChild(msg);
    setTimeout(() => {
      msg.style.transition = 'opacity 0.5s';
      msg.style.opacity = '0';
      setTimeout(() => msg.remove(), 500);
    }, 3500);
  }

  /* ---- 14. AURORA PARALLAX on SCROLL ---- */
  const aurora1 = document.querySelector('.aurora-1');
  const aurora2 = document.querySelector('.aurora-2');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (aurora1) aurora1.style.transform = `translateY(${sy * 0.08}px)`;
    if (aurora2) aurora2.style.transform = `translateY(${-sy * 0.05}px)`;
  }, { passive: true });

  console.log('%c⚡ Sudharshanan Sathishkumar Portfolio — Cinematic Edition', 'color:#7c3aed;font-size:16px;font-weight:bold;');
  console.log('%cBuilt with passion and a lot of ☕', 'color:#06b6d4;font-size:13px;');
});
