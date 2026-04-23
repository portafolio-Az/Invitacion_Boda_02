/* ================================================================
   VALERIA & SEBASTIÁN — WEDDING WEBSITE
   script.js
   ================================================================ */

'use strict';

/* ================================================================
   1. AOS – Animate On Scroll
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    mirror: false,
  });
});


/* ================================================================
   2. NAVBAR – scroll style change & mobile menu
   ================================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

// Scroll watcher
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile hamburger
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Smooth scroll for ALL anchor links on the page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ================================================================
   3. HERO SWIPER
   ================================================================ */
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: {
    delay: 5500,
    disableOnInteraction: false,
  },
  speed: 1100,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  parallax: true,
  pagination: {
    el: '.hero-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.hero-next',
    prevEl: '.hero-prev',
  },
  keyboard: { enabled: true },
  a11y: {
    prevSlideMessage: 'Slide anterior',
    nextSlideMessage: 'Slide siguiente',
  },
});


/* ================================================================
   4. PARTICLES.JS – romantic particles in hero
   ================================================================ */
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-js', {
    particles: {
      number: { value: 55, density: { enable: true, value_area: 900 } },
      color: { value: ['#e2c98a', '#d4a87a', '#f5ede0', '#ffffff'] },
      shape: {
        type: ['circle', 'heart'],
        stroke: { width: 0 },
      },
      opacity: {
        value: 0.55,
        random: true,
        anim: { enable: true, speed: 0.5, opacity_min: 0.15, sync: false },
      },
      size: {
        value: 4,
        random: true,
        anim: { enable: true, speed: 1.5, size_min: 1, sync: false },
      },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 1.2,
        direction: 'top',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'bubble' },
        onclick: { enable: false },
        resize: true,
      },
      modes: {
        bubble: { distance: 120, size: 6, duration: 2, opacity: 0.8, speed: 3 },
      },
    },
    retina_detect: true,
  });
}


/* ================================================================
   5. FLOATING PETALS CANVAS
   ================================================================ */
(function () {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Petal colours in the warm palette
  const colors = ['#e0b899', '#c9a96e', '#e8d5b7', '#f5ede0', '#d4a87a', '#e2c98a'];

  // Petal class
  class Petal {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = Math.random() * canvas.width;
      this.y     = initial ? Math.random() * canvas.height : -20;
      this.size  = 5 + Math.random() * 9;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY= 0.5 + Math.random() * 1.2;
      this.speedX= (Math.random() - 0.5) * 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.spin  = (Math.random() - 0.5) * 0.04;
      this.opacity = 0.25 + Math.random() * 0.45;
      this.sway  = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.008 + Math.random() * 0.012;
      this.swayAmp   = 20 + Math.random() * 30;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Draw a simple petal (ellipse)
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.sway   += this.swaySpeed;
      this.x      += this.speedX + Math.sin(this.sway) * 0.5;
      this.y      += this.speedY;
      this.angle  += this.spin;

      if (this.y > canvas.height + 30) this.reset();
    }
  }

  // Create petals
  const petals = Array.from({ length: 28 }, () => new Petal());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ================================================================
   6. COUNTDOWN TIMER
   ================================================================ */
(function () {
  const target = new Date('2027-02-14T17:00:00'); // 5 PM Mérida

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  if (!elDays) return;

  function pad(n, len = 2) {
    return String(n).padStart(len, '0');
  }

  // Flip animation helper
  function flip(el, newVal) {
    if (el.textContent === newVal) return;
    el.classList.add('flip');
    el.addEventListener('animationend', () => {
      el.textContent = newVal;
      el.classList.remove('flip');
    }, { once: true });
  }

  function update() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    flip(elDays,  pad(days, 3));
    flip(elHours, pad(hours));
    flip(elMins,  pad(mins));
    flip(elSecs,  pad(secs));
  }

  update();
  setInterval(update, 1000);

  // Add flip animation via a style tag (avoids needing CSS file edit)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flipDown {
      0%   { transform: perspective(400px) rotateX(0);   opacity: 1; }
      50%  { transform: perspective(400px) rotateX(-90deg); opacity: 0.3; }
      100% { transform: perspective(400px) rotateX(0);   opacity: 1; }
    }
    .flip { animation: flipDown 0.4s ease; }
  `;
  document.head.appendChild(style);
})();


/* ================================================================
   7. GALLERY LIGHTBOX
   ================================================================ */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let currentLbIndex = 0;

function openLightbox(el) {
  currentLbIndex = galleryItems.indexOf(el);
  const img = el.querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
window.openLightbox = openLightbox;

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
window.closeLightbox = closeLightbox;

function lightboxNav(dir) {
  currentLbIndex = (currentLbIndex + dir + galleryItems.length) % galleryItems.length;
  const img = galleryItems[currentLbIndex].querySelector('img');
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.style.opacity = '1';
  }, 200);
}
window.lightboxNav = lightboxNav;

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

// Smooth lightbox img transition
if (lightboxImg) {
  lightboxImg.style.transition = 'opacity 0.2s ease';
}


/* ================================================================
   8. RSVP FORM VALIDATION
   ================================================================ */
function submitRSVP() {
  const name   = document.getElementById('rsvp-name');
  const phone  = document.getElementById('rsvp-phone');
  const guests = document.getElementById('rsvp-guests');
  const btn    = document.getElementById('rsvp-submit');

  let valid = true;

  // Reset errors
  ['name', 'phone', 'guests'].forEach(f => {
    document.getElementById('err-' + f).textContent = '';
  });

  // Validate name
  if (!name.value.trim() || name.value.trim().length < 2) {
    document.getElementById('err-name').textContent = 'Por favor ingresa tu nombre completo.';
    name.focus();
    valid = false;
  }

  // Validate phone
  const phoneClean = phone.value.replace(/\D/g, '');
  if (!phone.value.trim() || phoneClean.length < 10) {
    document.getElementById('err-phone').textContent = 'Ingresa un número de teléfono válido (10 dígitos).';
    if (valid) phone.focus();
    valid = false;
  }

  // Validate guests
  if (!guests.value) {
    document.getElementById('err-guests').textContent = 'Selecciona el número de invitados.';
    if (valid) guests.focus();
    valid = false;
  }

  if (!valid) return;

  // Button loading state
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

  // Simulate submission (replace with real fetch/API call in production)
  setTimeout(() => {
    document.getElementById('rsvp-form-box').style.display  = 'none';
    document.getElementById('rsvp-success').style.display   = 'block';

    // Confetti burst 🎊 (using canvas petals at higher frequency)
    burstConfetti();
  }, 1800);
}
window.submitRSVP = submitRSVP;

// Input border highlight on error
['rsvp-name', 'rsvp-phone', 'rsvp-guests'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    el.style.borderColor = '';
    const errId = 'err-' + id.replace('rsvp-', '');
    const err = document.getElementById(errId);
    if (err) err.textContent = '';
  });
});


/* ================================================================
   9. CONFETTI BURST on RSVP success
   ================================================================ */
function burstConfetti() {
  const colors = ['#c9a96e', '#e0b899', '#e2c98a', '#d4a87a', '#f5ede0', '#fff'];
  const container = document.getElementById('rsvp');
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('span');
    piece.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: ${4 + Math.random() * 8}px;
      height: ${6 + Math.random() * 10}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
      transform-origin: center;
    `;
    document.body.appendChild(piece);

    const angle  = (Math.random() * 360) * Math.PI / 180;
    const dist   = 80 + Math.random() * 220;
    const tx     = Math.cos(angle) * dist;
    const ty     = Math.sin(angle) * dist;
    const dur    = 800 + Math.random() * 700;
    const rot    = -360 + Math.random() * 720;

    piece.animate([
      { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.3) rotate(${rot}deg)`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(0,0,0.2,1)', fill: 'forwards' })
    .finished.then(() => piece.remove());
  }
}


/* ================================================================
   10. GSAP SCROLL ANIMATIONS (timeline & section headings)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Parallax on countdown numbers
  gsap.utils.toArray('.countdown-box').forEach((box, i) => {
    gsap.from(box, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#countdown',
        start: 'top 80%',
        once: true,
      },
    });
  });

  // Novio cards scale in
  gsap.utils.toArray('.novio-card').forEach((card, i) => {
    gsap.from(card, {
      scale: 0.93,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#novios',
        start: 'top 75%',
        once: true,
      },
    });
  });

  // Footer names reveal
  gsap.from('.footer-names', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 85%',
      once: true,
    },
  });

  // Gallery items stagger
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#galeria',
        start: 'top 80%',
        once: true,
      },
    });
  });
});


/* ================================================================
   11. MICROINTERACTIONS – buttons pulse on hover
   ================================================================ */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.letterSpacing = '0.16em';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.letterSpacing = '';
  });
});


/* ================================================================
   12. ACTIVE NAV LINK on scroll
   ================================================================ */
(function () {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));

  // Active nav link style
  const style = document.createElement('style');
  style.textContent = `
    #navbar.scrolled .nav-link.active { color: var(--cafe) !important; }
    #navbar.scrolled .nav-link.active::after { width: 100%; }
    .nav-link.active { color: var(--gold-light) !important; }
    .nav-link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);
})();


/* ================================================================
   13. IMAGE LAZY LOAD with fade-in
   ================================================================ */
(function () {
  if ('IntersectionObserver' in window) {
    const imgs = document.querySelectorAll('img[src]');
    imgs.forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', () => { img.style.opacity = '1'; });
        img.addEventListener('error', () => { img.style.opacity = '1'; });
      }
    });
  }
})();
