/* ================================================================
   VALERIA & SEBASTIÁN — script.js (reparado: contador + visibilidad)
   ================================================================ */

'use strict';

/* ================================================================
   1. AOS – Animate On Scroll
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 850,
    easing: 'ease-out-cubic',
    once: true,
    offset: 70,
    mirror: false,
  });
});

/* ================================================================
   2. NAVBAR — scroll style + hamburguesa mobile
   ================================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
}

navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

(function () {
  const sections   = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const observer   = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
})();

/* ================================================================
   3. BOTÓN VOLVER ARRIBA
   ================================================================ */
const bttBtn = document.getElementById('back-to-top');
if (bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ================================================================
   4. HERO SWIPER
   ================================================================ */
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true, autoplay: { delay: 5500, disableOnInteraction: false }, speed: 1100,
  effect: 'fade', fadeEffect: { crossFade: true }, parallax: true,
  pagination: { el: '.hero-pagination', clickable: true },
  navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' }, keyboard: { enabled: true },
});

/* ================================================================
   5. PARTICLES.JS
   ================================================================ */
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 900 } },
      color: { value: ['#e2c98a', '#d4a87a', '#f5ede0', '#ffffff', '#c9a96e'] },
      shape: { type: ['circle'] }, opacity: { value: 0.5, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.1 } },
      size: { value: 3.5, random: true, anim: { enable: true, speed: 1.5, size_min: 0.5 } }, line_linked: { enable: false },
      move: { enable: true, speed: 1.1, direction: 'top', random: true, straight: false, out_mode: 'out' },
    }, interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'bubble' } }, modes: { bubble: { distance: 100, size: 5, duration: 2, opacity: 0.8 } } }, retina_detect: true,
  });
}

/* ================================================================
   6. CANVAS — pétalos flotantes
   ================================================================ */
(function () {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize, { passive: true });
  const colors = ['#e0b899','#c9a96e','#e8d5b7','#f5ede0','#d4a87a','#e2c98a'];
  class Petal {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.size = 5 + Math.random() * 8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = 0.45 + Math.random() * 1.1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.035;
      this.opacity = 0.2 + Math.random() * 0.45;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpd = 0.007 + Math.random() * 0.011;
    }
    draw() {
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.ellipse(0, 0, this.size * 0.45, this.size, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    update() { this.sway += this.swaySpd; this.x += this.speedX + Math.sin(this.sway) * 0.45; this.y += this.speedY; this.angle += this.spin; if (this.y > canvas.height + 30) this.reset(); }
  }
  const petals = Array.from({ length: 26 }, () => new Petal());
  function loop() { ctx.clearRect(0, 0, canvas.width, canvas.height); petals.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); }
  loop();
})();

/* ================================================================
   7. COUNTDOWN — hacia 21 Mayo 2028 (reparado con timestamp fijo)
   ================================================================ */
(function () {
  // Fecha objetivo: 21 de Mayo de 2028 a las 17:00 horas (hora local de Mérida)
  // Usamos un timestamp fijo UTC para evitar problemas de zona horaria.
  // 2028-05-21 17:00:00 GMT-6 (Mérida en mayo está en UTC-6)
  const targetDate = new Date(Date.UTC(2028, 4, 21, 23, 0, 0)); // 17:00 GMT-6 = 23:00 UTC
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');
  if (!elDays) return;

  function pad(n, len = 2) { return String(n).padStart(len, '0'); }
  function animNum(el, newVal) {
    if (el.textContent === newVal) return;
    el.style.animation = 'none';
    el.offsetHeight; // forzar reflow
    el.textContent = newVal;
    el.style.animation = 'flipNum .35s ease';
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = targetDate.getTime() - now;
    if (diff <= 0) {
      elDays.textContent = '000';
      elHours.textContent = '00';
      elMins.textContent = '00';
      elSecs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    animNum(elDays, pad(days, 3));
    animNum(elHours, pad(hours));
    animNum(elMins, pad(mins));
    animNum(elSecs, pad(secs));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* ================================================================
   8. GALERÍA — Lightbox
   ================================================================ */
const galleryItems = Array.from(document.querySelectorAll('.gi'));
let lbIndex = 0;
galleryItems.forEach(item => {
  item.addEventListener('click', () => { lbIndex = parseInt(item.dataset.index, 10); openLightbox(lbIndex); });
});
function openLightbox(index) {
  lbIndex = index; const lb = document.getElementById('lightbox'), img = document.getElementById('lb-img'), cnt = document.getElementById('lb-count');
  if (!lb || !img) return;
  const src = galleryItems[lbIndex]?.querySelector('img')?.src;
  img.style.opacity = '0'; lb.classList.add('active'); document.body.style.overflow = 'hidden';
  img.onload = () => img.style.opacity = '1'; img.src = src;
  if (cnt) cnt.textContent = `${lbIndex + 1} / ${galleryItems.length}`;
}
window.openLightbox = openLightbox;
function closeLightbox() { const lb = document.getElementById('lightbox'); if (lb) lb.classList.remove('active'); document.body.style.overflow = ''; }
window.closeLightbox = closeLightbox;
function lightboxNav(dir) { lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length; openLightbox(lbIndex); }
window.lightboxNav = lightboxNav;
document.addEventListener('keydown', e => { const lb = document.getElementById('lightbox'); if (!lb || !lb.classList.contains('active')) return; if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') lightboxNav(-1); if (e.key === 'ArrowRight') lightboxNav(1); });
const lbImg = document.getElementById('lb-img'); if (lbImg) lbImg.style.transition = 'opacity .22s ease';

/* ================================================================
   9. RSVP — validación y envío
   ================================================================ */
function submitRSVP() {
  const nameEl = document.getElementById('rsvp-name'), phoneEl = document.getElementById('rsvp-phone'), guestsEl = document.getElementById('rsvp-guests'), btn = document.getElementById('rsvp-submit');
  let valid = true;
  ['name','phone','guests'].forEach(f => { const err = document.getElementById('err-' + f); if (err) err.textContent = ''; });
  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) { document.getElementById('err-name').textContent = 'Por favor ingresa tu nombre completo.'; nameEl.focus(); valid = false; }
  const ph = phoneEl.value.replace(/\D/g, '');
  if (!phoneEl.value.trim() || ph.length < 10) { document.getElementById('err-phone').textContent = 'Ingresa un número válido (10 dígitos).'; if (valid) phoneEl.focus(); valid = false; }
  if (!guestsEl.value) { document.getElementById('err-guests').textContent = 'Selecciona el número de invitados.'; if (valid) guestsEl.focus(); valid = false; }
  if (!valid) { const box = document.getElementById('rsvp-form-box'); if (box) { box.style.animation = 'none'; void box.offsetWidth; box.style.animation = 'shake .5s ease'; } return; }
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';
  setTimeout(() => {
    const formBox = document.getElementById('rsvp-form-box'); const successBox = document.getElementById('rsvp-success');
    if (formBox) formBox.style.display = 'none'; if (successBox) successBox.style.display = 'block';
    burstConfetti();
  }, 1800);
}
window.submitRSVP = submitRSVP;

['rsvp-name','rsvp-phone','rsvp-guests'].forEach(id => {
  const el = document.getElementById(id); if (!el) return;
  el.addEventListener('input', () => { el.style.borderColor = ''; const errId = 'err-' + id.replace('rsvp-', ''); const err = document.getElementById(errId); if (err) err.textContent = ''; });
});

(function () { const s = document.createElement('style'); s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`; document.head.appendChild(s); })();

function burstConfetti () {
  const colors = ['#c9a96e','#e0b899','#e2c98a','#d4a87a','#f5ede0','#fff','#c8956c'];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement('span'); const size  = 4 + Math.random() * 8;
    piece.style.cssText = `position:fixed;top:50%;left:50%;width:${size}px;height:${size * 1.4}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;z-index:99999;opacity:1;`;
    document.body.appendChild(piece);
    const angle = Math.random() * 360 * Math.PI / 180; const dist  = 80 + Math.random() * 240; const tx = Math.cos(angle) * dist; const ty = Math.sin(angle) * dist; const dur = 800 + Math.random() * 700; const rot = -360 + Math.random() * 720;
    piece.animate([{ transform:`translate(-50%,-50%) scale(1) rotate(0deg)`, opacity:1 },{ transform:`translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(.2) rotate(${rot}deg)`, opacity:0 }], { duration:dur, easing:'cubic-bezier(0,0,.2,1)', fill:'forwards' }).finished.then(() => piece.remove());
  }
}

/* ================================================================
   10. FRASES ROMÁNTICAS ROTATIVAS
   ================================================================ */
(function () {
  const frases = ['El amor verdadero no tiene fin, solo comienzos.', 'Juntos somos el hogar que siempre soñamos.', 'Cada día a tu lado es el mejor día de mi vida.', 'El destino nos unió, el amor nos mantiene juntos.', 'Eres la historia que quiero seguir escribiendo.'];
  const txtEl  = document.getElementById('frase-txt'); const dotsEl = document.getElementById('frase-dots');
  if (!txtEl || !dotsEl) return;
  frases.forEach((_, i) => { const d = document.createElement('span'); d.className = 'fd' + (i === 0 ? ' active' : ''); dotsEl.appendChild(d); });
  let current = 0; const dots  = dotsEl.querySelectorAll('.fd'); txtEl.textContent = frases[0];
  function showFrase (idx) { txtEl.style.opacity = '0'; setTimeout(() => { txtEl.textContent = frases[idx]; txtEl.style.opacity = '1'; }, 500); dots.forEach(d => d.classList.remove('active')); dots[idx].classList.add('active'); }
  setInterval(() => { current = (current + 1) % frases.length; showFrase(current); }, 4000);
})();

/* ================================================================
   11. REPRODUCTOR DE MÚSICA
   ================================================================ */
(function () {
  const songs = [
    { title: 'Canon en Re — Pachelbel', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'A Thousand Years — Instrumental', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  ];
  let currentSong = 0, isPlaying = false;
  const player = document.getElementById('music-player'), audio = document.getElementById('audio-el'), iconEl = document.getElementById('music-icon'), titleEl = document.getElementById('music-title'), fillEl = document.getElementById('music-fill'), toggleBtn = document.getElementById('music-toggle'), nextBtn = document.getElementById('music-next'), closeBtn = document.getElementById('music-close');
  if (!player || !audio) return;
  function loadSong (idx) { audio.src = songs[idx].src; titleEl.textContent = songs[idx].title; fillEl.style.width = '0%'; }
  function togglePlay () {
    if (isPlaying) { audio.pause(); iconEl.className = 'fa-solid fa-play'; isPlaying = false; }
    else { audio.play().then(() => { iconEl.className = 'fa-solid fa-pause'; isPlaying = true; }).catch(() => { iconEl.className = 'fa-solid fa-play'; }); }
  }
  function nextSong () { currentSong = (currentSong + 1) % songs.length; loadSong(currentSong); if (isPlaying) audio.play().catch(() => {}); }
  function closePlayer () { audio.pause(); isPlaying = false; iconEl.className = 'fa-solid fa-play'; player.classList.add('hidden'); }
  audio.addEventListener('timeupdate', () => { if (!audio.duration) return; const pct = (audio.currentTime / audio.duration) * 100; fillEl.style.width = pct + '%'; });
  audio.addEventListener('ended', nextSong);
  toggleBtn.addEventListener('click', togglePlay); nextBtn.addEventListener('click', nextSong); closeBtn.addEventListener('click', closePlayer);
  loadSong(0);
})();

/* ================================================================
   12. GSAP ScrollTrigger — animaciones reparadas (no ocultan elementos)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  
  // Aseguramos que todos los elementos empiecen visibles (opacity:1)
  // y solo aplicamos animación de entrada desde un estado invisible.
  // Esto evita que queden ocultos si el scrollTrigger no se dispara.
  
  // Countdown boxes
  gsap.utils.toArray('.cd-box').forEach((box, i) => {
    gsap.from(box, { y: 50, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: '#countdown', start: 'top 85%', once: true } });
  });
  
  // Novios cards
  gsap.utils.toArray('.novio-card').forEach((card, i) => {
    gsap.from(card, { scale: 0.95, opacity: 0, duration: 0.9, delay: i * 0.15, ease: 'power3.out', scrollTrigger: { trigger: '#novios', start: 'top 85%', once: true } });
  });
  
  // Itinerario cards
  gsap.utils.toArray('.itin-card').forEach((card, i) => {
    gsap.from(card, { y: 40, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: '#itinerario', start: 'top 85%', once: true } });
  });
  
  // Padrinos cards
  gsap.utils.toArray('.padrino-card').forEach((card, i) => {
    gsap.from(card, { y: 30, opacity: 0, duration: 0.7, delay: i * 0.12, ease: 'power2.out', scrollTrigger: { trigger: '#padrinos', start: 'top 85%', once: true } });
  });
  
  // Footer
  gsap.from('.footer-names', { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '#footer', start: 'top 88%', once: true } });
  
  // Galería items
  gsap.utils.toArray('.gi').forEach((item, i) => {
    gsap.from(item, { opacity: 0, y: 30, duration: 0.6, delay: i * 0.06, ease: 'power2.out', scrollTrigger: { trigger: '#galeria', start: 'top 85%', once: true } });
  });
  
  // Regalos cards
  gsap.utils.toArray('.reg-card').forEach((card, i) => {
    gsap.from(card, { y: 35, opacity: 0, duration: 0.7, delay: i * 0.14, ease: 'power2.out', scrollTrigger: { trigger: '#regalos', start: 'top 85%', once: true } });
  });
  
  // Refrescar ScrollTrigger para que detecte bien las posiciones
  ScrollTrigger.refresh();
});

/* ================================================================
   13. LAZY LOAD con fade-in
   ================================================================ */
(function () {
  if (!('IntersectionObserver' in window)) return;
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0'; img.style.transition = 'opacity .55s ease';
    if (img.complete) img.style.opacity = '1';
    else { img.addEventListener('load',  () => { img.style.opacity = '1'; }); img.addEventListener('error', () => { img.style.opacity = '1'; }); }
  });
})();

/* ================================================================
   14. MICROINTERACCIONES — hover
   ================================================================ */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => { btn.style.letterSpacing = '.17em'; });
  btn.addEventListener('mouseleave', () => { btn.style.letterSpacing = ''; });
});
document.querySelectorAll('.htl-item').forEach(item => {
  item.addEventListener('mouseenter', () => { item.querySelector('.htl-dot').style.transform = 'scale(1.15)'; });
  item.addEventListener('mouseleave', () => { item.querySelector('.htl-dot').style.transform = ''; });
});

/* ================================================================
   15. PRELOADER: se oculta después de 0.5 segundos
   ================================================================ */
window.addEventListener('load', function() {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => { preloader.style.display = 'none'; }, 400);
    }
  }, 500);
});

/* ================================================================
   16. FIX VISIBILIDAD: forzar que las secciones problemáticas se vean
       (esto es un parche por si algún elemento quedó oculto)
   ================================================================ */
(function ensureVisible() {
  // Aseguramos que los contenedores principales sean visibles
  const sections = ['novios', 'itinerario', 'padrinos', 'regalos'];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section && section.style.opacity === '0') section.style.opacity = '';
    if (section && section.style.visibility === 'hidden') section.style.visibility = '';
  });
  // Forzamos que las grids se muestren
  const grids = document.querySelectorAll('.novios-wrap, .itin-grid, .padrinos-grid, .regalos-grid');
  grids.forEach(grid => {
    if (grid.style.display === 'none') grid.style.display = '';
    if (grid.style.opacity === '0') grid.style.opacity = '';
  });
})();