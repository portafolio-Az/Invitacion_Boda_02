/* ================================================================
   VALERIA & SEBASTIÁN — script.js (v3 completo)
   ================================================================ */

'use strict';

/* ================================================================
   1. AOS — Animate On Scroll
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
  navbar.classList.toggle('scrolled', window.scrollY > 60);
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

/* Smooth scroll para todos los anchors internos */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* Active link por sección visible */
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
if (bttBtn) {
  bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ================================================================
   4. HERO SWIPER
   ================================================================ */
if (document.querySelector('.hero-swiper')) {
  new Swiper('.hero-swiper', {
    loop: true,
    autoplay: { delay: 5500, disableOnInteraction: false },
    speed: 1100,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    parallax: true,
    pagination: { el: '.hero-pagination', clickable: true },
    navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' },
    keyboard: { enabled: true },
  });
}

/* ================================================================
   5. PARTICLES.JS
   ================================================================ */
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 900 } },
      color: { value: ['#e2c98a', '#d4a87a', '#f5ede0', '#ffffff', '#c9a96e'] },
      shape: { type: ['circle'] },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.1 } },
      size: { value: 3.5, random: true, anim: { enable: true, speed: 1.5, size_min: 0.5 } },
      line_linked: { enable: false },
      move: { enable: true, speed: 1.1, direction: 'top', random: true, straight: false, out_mode: 'out' },
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'bubble' } },
      modes: { bubble: { distance: 100, size: 5, duration: 2, opacity: 0.8 } },
    },
    retina_detect: true,
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
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const colors = ['#e0b899','#c9a96e','#e8d5b7','#f5ede0','#d4a87a','#e2c98a'];

  class Petal {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x      = Math.random() * canvas.width;
      this.y      = initial ? Math.random() * canvas.height : -20;
      this.size   = 5 + Math.random() * 8;
      this.color  = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = 0.45 + Math.random() * 1.1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.035;
      this.opacity= 0.2 + Math.random() * 0.45;
      this.sway   = Math.random() * Math.PI * 2;
      this.swaySpd= 0.007 + Math.random() * 0.011;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.45, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.sway += this.swaySpd;
      this.x    += this.speedX + Math.sin(this.sway) * 0.45;
      this.y    += this.speedY;
      this.angle+= this.spin;
      if (this.y > canvas.height + 30) this.reset();
    }
  }

  const petals = Array.from({ length: 26 }, () => new Petal());
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ================================================================
   7. COUNTDOWN — hacia 21 Mayo 2028 (timestamp fijo UTC)
      2028-05-21 17:00:00 GMT-6 (Mérida) = 23:00 UTC
   ================================================================ */
(function () {
  const targetDate = new Date(Date.UTC(2028, 4, 21, 23, 0, 0));
  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');
  if (!elDays) return;

  function pad(n, len = 2) { return String(n).padStart(len, '0'); }

  function animNum(el, newVal) {
    if (el.textContent === newVal) return;
    el.style.animation = 'none';
    void el.offsetHeight; // reflow forzado
    el.textContent = newVal;
    el.style.animation = 'flipNum .35s ease';
  }

  function updateCountdown() {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) {
      animNum(elDays,  '000');
      animNum(elHours, '00');
      animNum(elMins,  '00');
      animNum(elSecs,  '00');
      return;
    }
    animNum(elDays,  pad(Math.floor(diff / 86400000), 3));
    animNum(elHours, pad(Math.floor((diff % 86400000) / 3600000)));
    animNum(elMins,  pad(Math.floor((diff % 3600000) / 60000)));
    animNum(elSecs,  pad(Math.floor((diff % 60000) / 1000)));
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
  item.addEventListener('click', () => {
    lbIndex = parseInt(item.dataset.index, 10);
    openLightbox(lbIndex);
  });
});

function openLightbox(index) {
  lbIndex = index;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const cnt = document.getElementById('lb-count');
  if (!lb || !img) return;
  const src = galleryItems[lbIndex]?.querySelector('img')?.src;
  img.style.opacity = '0';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  img.onload = () => { img.style.opacity = '1'; };
  img.src = src;
  if (cnt) cnt.textContent = `${lbIndex + 1} / ${galleryItems.length}`;
}
window.openLightbox = openLightbox;

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}
window.closeLightbox = closeLightbox;

function lightboxNav(dir) {
  lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length;
  openLightbox(lbIndex);
}
window.lightboxNav = lightboxNav;

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb?.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

const lbImg = document.getElementById('lb-img');
if (lbImg) lbImg.style.transition = 'opacity .22s ease';

/* ================================================================
   9. RSVP — validación y envío
   ================================================================ */
function submitRSVP() {
  const nameEl   = document.getElementById('rsvp-name');
  const phoneEl  = document.getElementById('rsvp-phone');
  const guestsEl = document.getElementById('rsvp-guests');
  const btn      = document.getElementById('rsvp-submit');
  let valid = true;

  ['name','phone','guests'].forEach(f => {
    const err = document.getElementById('err-' + f);
    if (err) err.textContent = '';
  });

  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    document.getElementById('err-name').textContent = 'Por favor ingresa tu nombre completo.';
    nameEl.focus(); valid = false;
  }
  const ph = phoneEl.value.replace(/\D/g, '');
  if (!phoneEl.value.trim() || ph.length < 10) {
    document.getElementById('err-phone').textContent = 'Ingresa un número válido (10 dígitos).';
    if (valid) phoneEl.focus(); valid = false;
  }
  if (!guestsEl.value) {
    document.getElementById('err-guests').textContent = 'Selecciona el número de invitados.';
    if (valid) guestsEl.focus(); valid = false;
  }

  if (!valid) {
    const box = document.getElementById('rsvp-form-box');
    if (box) { box.style.animation = 'none'; void box.offsetWidth; box.style.animation = 'shake .5s ease'; }
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

  setTimeout(() => {
    const formBox    = document.getElementById('rsvp-form-box');
    const successBox = document.getElementById('rsvp-success');
    if (formBox)    formBox.style.display = 'none';
    if (successBox) successBox.style.display = 'block';
    burstConfetti();
  }, 1800);
}
window.submitRSVP = submitRSVP;

['rsvp-name','rsvp-phone','rsvp-guests'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    el.style.borderColor = '';
    const errId = 'err-' + id.replace('rsvp-', '');
    const err = document.getElementById(errId);
    if (err) err.textContent = '';
  });
});

/* keyframe shake en JS */
(function () {
  const s = document.createElement('style');
  s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
  document.head.appendChild(s);
})();

/* ================================================================
   10. BURST CONFETTI — al confirmar RSVP
   ================================================================ */
function burstConfetti() {
  const colors = ['#c9a96e','#e0b899','#e2c98a','#d4a87a','#f5ede0','#fff','#c8956c'];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement('span');
    const size  = 4 + Math.random() * 8;
    piece.style.cssText = `position:fixed;top:50%;left:50%;width:${size}px;height:${size * 1.4}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;z-index:99999;opacity:1;`;
    document.body.appendChild(piece);
    const angle = Math.random() * 360 * Math.PI / 180;
    const dist  = 80 + Math.random() * 240;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const dur   = 800 + Math.random() * 700;
    const rot   = -360 + Math.random() * 720;
    piece.animate([
      { transform: `translate(-50%,-50%) scale(1) rotate(0deg)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(.2) rotate(${rot}deg)`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(0,0,.2,1)', fill: 'forwards' })
    .finished.then(() => piece.remove());
  }
}

/* ================================================================
   11. FRASES ROMÁNTICAS ROTATIVAS
   ================================================================ */
(function () {
  const frases = [
    'El amor verdadero no tiene fin, solo comienzos.',
    'Juntos somos el hogar que siempre soñamos.',
    'Cada día a tu lado es el mejor día de mi vida.',
    'El destino nos unió, el amor nos mantiene juntos.',
    'Eres la historia que quiero seguir escribiendo.',
  ];
  const txtEl  = document.getElementById('frase-txt');
  const dotsEl = document.getElementById('frase-dots');
  if (!txtEl || !dotsEl) return;

  frases.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'fd' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  });

  let current = 0;
  const dots  = dotsEl.querySelectorAll('.fd');
  txtEl.textContent = frases[0];

  function showFrase(idx) {
    txtEl.style.opacity = '0';
    setTimeout(() => { txtEl.textContent = frases[idx]; txtEl.style.opacity = '1'; }, 500);
    dots.forEach(d => d.classList.remove('active'));
    dots[idx].classList.add('active');
  }

  setInterval(() => {
    current = (current + 1) % frases.length;
    showFrase(current);
  }, 4000);
})();

/* ================================================================
   12. REPRODUCTOR FLOTANTE (barra inferior izquierda)
   ================================================================ */
(function () {
  const songs = [
    { title: 'Canon en Re — Pachelbel',       src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'A Thousand Years — Instrumental', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  ];
  let currentSong = 0, isPlaying = false;

  const player    = document.getElementById('music-player');
  const audio     = document.getElementById('audio-el');
  const iconEl    = document.getElementById('music-icon');
  const titleEl   = document.getElementById('music-title');
  const fillEl    = document.getElementById('music-fill');
  const toggleBtn = document.getElementById('music-toggle');
  const nextBtn   = document.getElementById('music-next');
  const closeBtn  = document.getElementById('music-close');

  if (!player || !audio) return;

  function loadSong(idx) {
    audio.src            = songs[idx].src;
    if (titleEl) titleEl.textContent = songs[idx].title;
    if (fillEl)  fillEl.style.width  = '0%';
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      if (iconEl) iconEl.className = 'fa-solid fa-play';
      isPlaying = false;
    } else {
      audio.play()
        .then(() => { if (iconEl) iconEl.className = 'fa-solid fa-pause'; isPlaying = true; })
        .catch(() => { if (iconEl) iconEl.className = 'fa-solid fa-play'; });
    }
  }

  function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    if (isPlaying) audio.play().catch(() => {});
    /* sincroniza con el reproductor de sección si existe */
    syncSectionPlayer(currentSong);
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || !fillEl) return;
    fillEl.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
  });
  audio.addEventListener('ended', nextSong);

  if (toggleBtn) toggleBtn.addEventListener('click', togglePlay);
  if (nextBtn)   nextBtn.addEventListener('click', nextSong);
  if (closeBtn)  closeBtn.addEventListener('click', () => {
    audio.pause(); isPlaying = false;
    if (iconEl) iconEl.className = 'fa-solid fa-play';
    player.classList.add('hidden');
  });

  loadSong(0);

  /* Exponer para que el reproductor de sección pueda controlarlo */
  window._floatingPlayer = { audio, songs, getCurrentSong: () => currentSong, isPlaying: () => isPlaying };
})();

/* ================================================================
   13. REPRODUCTOR DE SECCIÓN "NUESTRA CANCIÓN"
   ================================================================ */
(function () {
  const spAudio   = document.getElementById('sp-audio');
  const spPlay    = document.getElementById('sp-play');
  const spPrev    = document.getElementById('sp-prev');
  const spNext    = document.getElementById('sp-next');
  const spPlayIcon= document.getElementById('sp-play-icon');
  const spFill    = document.getElementById('sp-progress-fill');
  const spThumb   = document.getElementById('sp-progress-thumb');
  const spBar     = document.getElementById('sp-progress-bar');
  const spCurrent = document.getElementById('sp-current');
  const spTotal   = document.getElementById('sp-total');
  const spNowName = document.getElementById('sp-now-name');
  const spNowArtist = document.getElementById('sp-now-artist');
  const spVolume  = document.getElementById('sp-volume');
  const spMute    = document.getElementById('sp-mute');
  const spTracks  = document.querySelectorAll('.sp-track');
  const artwork   = document.querySelector('.sp-artwork img');

  if (!spAudio || !spPlay) return;

  const songs = [];
  spTracks.forEach(t => {
    songs.push({
      src:    t.dataset.src    || '',
      title:  t.dataset.title  || 'Canción',
      artist: t.dataset.artist || '',
    });
  });
  if (!songs.length) return;

  let currentIdx = 0;
  let spPlaying  = false;
  let isMuted    = false;
  let prevVolume = 0.8;
  let isDragging = false;

  /* Artworks por canción (placeholder) */
  const artworks = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=85',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=85',
  ];

  /* ── helpers ── */
  function fmtTime(s) {
    if (!isFinite(s) || s < 0) return '--:--';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
  }

  function setProgress(pct) {
    const p = Math.min(Math.max(pct, 0), 100);
    if (spFill)  spFill.style.width  = p + '%';
    if (spThumb) spThumb.style.left  = p + '%';
  }

  function updateTrackList(idx) {
    spTracks.forEach((t, i) => {
      t.classList.toggle('sp-track-active', i === idx);
    });
  }

  function loadSong(idx, autoplay = false) {
    currentIdx        = idx;
    const song        = songs[idx];
    spAudio.src       = song.src;
    spAudio.volume    = spVolume ? parseFloat(spVolume.value) : 0.8;
    if (spNowName)   spNowName.textContent   = song.title;
    if (spNowArtist) spNowArtist.textContent = song.artist;
    if (spCurrent)   spCurrent.textContent   = '0:00';
    if (spTotal)     spTotal.textContent     = '--:--';
    setProgress(0);
    updateTrackList(idx);

    /* Artwork */
    if (artwork && artworks[idx]) {
      artwork.style.opacity = '0';
      artwork.src = artworks[idx];
      artwork.onload = () => { artwork.style.opacity = '1'; };
    }

    /* Sync título en el flotante */
    const floatTitle = document.getElementById('music-title');
    if (floatTitle) floatTitle.textContent = `${song.title} — ${song.artist}`;

    if (autoplay) playSong();
  }

  function playSong() {
    spAudio.play()
      .then(() => {
        spPlaying = true;
        if (spPlayIcon) spPlayIcon.className = 'fa-solid fa-pause';
        /* Sync icono flotante */
        const fi = document.getElementById('music-icon');
        if (fi) fi.className = 'fa-solid fa-pause';
        /* Rotar artwork */
        const aw = document.querySelector('.sp-artwork');
        if (aw) aw.style.boxShadow = '0 0 0 6px rgba(200,149,108,.18), 0 20px 60px rgba(80,40,0,.22)';
      })
      .catch(() => { spPlaying = false; });
  }

  function pauseSong() {
    spAudio.pause();
    spPlaying = false;
    if (spPlayIcon) spPlayIcon.className = 'fa-solid fa-play';
    const fi = document.getElementById('music-icon');
    if (fi) fi.className = 'fa-solid fa-play';
    const aw = document.querySelector('.sp-artwork');
    if (aw) aw.style.boxShadow = '';
  }

  function togglePlay() {
    if (spPlaying) pauseSong(); else playSong();
  }

  function prevSong() {
    const idx = (currentIdx - 1 + songs.length) % songs.length;
    loadSong(idx, spPlaying);
  }

  function nextSong() {
    const idx = (currentIdx + 1) % songs.length;
    loadSong(idx, spPlaying);
  }

  /* ── Barra de progreso ── */
  spAudio.addEventListener('timeupdate', () => {
    if (isDragging || !isFinite(spAudio.duration)) return;
    const pct = (spAudio.currentTime / spAudio.duration) * 100;
    setProgress(pct);
    if (spCurrent) spCurrent.textContent = fmtTime(spAudio.currentTime);
  });

  spAudio.addEventListener('loadedmetadata', () => {
    if (spTotal) spTotal.textContent = fmtTime(spAudio.duration);
  });

  spAudio.addEventListener('ended', () => { nextSong(); });

  /* Click en barra de progreso */
  if (spBar) {
    const seek = (e) => {
      const rect = spBar.getBoundingClientRect();
      const pct  = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      spAudio.currentTime = pct * spAudio.duration;
      setProgress(pct * 100);
    };
    spBar.addEventListener('click', seek);
    spBar.addEventListener('mousedown', e => {
      isDragging = true;
      const move = ev => { if (isDragging) seek(ev); };
      const up   = () => { isDragging = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
    /* Touch */
    spBar.addEventListener('touchstart', e => {
      const rect = spBar.getBoundingClientRect();
      const pct  = Math.min(Math.max((e.touches[0].clientX - rect.left) / rect.width, 0), 1);
      spAudio.currentTime = pct * spAudio.duration;
      setProgress(pct * 100);
    }, { passive: true });
  }

  /* ── Volumen ── */
  if (spVolume) {
    spVolume.addEventListener('input', () => {
      const val      = parseFloat(spVolume.value);
      spAudio.volume = val;
      isMuted        = val === 0;
      if (spMute) spMute.className = val === 0 ? 'fa-solid fa-volume-xmark sp-vol-icon' : val < 0.5 ? 'fa-solid fa-volume-low sp-vol-icon' : 'fa-solid fa-volume-high sp-vol-icon';
      /* Sync flotante */
      const floatAudio = document.getElementById('audio-el');
      if (floatAudio) floatAudio.volume = val;
    });
  }

  if (spMute) {
    spMute.addEventListener('click', () => {
      if (isMuted) {
        spAudio.volume = prevVolume;
        if (spVolume) spVolume.value = prevVolume;
        isMuted = false;
        spMute.className = 'fa-solid fa-volume-low sp-vol-icon';
      } else {
        prevVolume     = spAudio.volume;
        spAudio.volume = 0;
        if (spVolume) spVolume.value = 0;
        isMuted = true;
        spMute.className = 'fa-solid fa-volume-xmark sp-vol-icon';
      }
    });
  }

  /* ── Click en track list ── */
  spTracks.forEach((t, i) => {
    t.addEventListener('click', () => {
      if (i === currentIdx) {
        togglePlay();
      } else {
        loadSong(i, true);
      }
    });
  });

  /* ── Botones principales ── */
  if (spPlay) spPlay.addEventListener('click', togglePlay);
  if (spPrev) spPrev.addEventListener('click', prevSong);
  if (spNext) spNext.addEventListener('click', nextSong);

  /* ── Init ── */
  loadSong(0, false);
})();

/* Helper expuesto: sincronizar sección player cuando flotante cambia de canción */
function syncSectionPlayer(idx) {
  const spTracks = document.querySelectorAll('.sp-track');
  spTracks.forEach((t, i) => t.classList.toggle('sp-track-active', i === idx));
}

/* ================================================================
   14. MODAL TRANSFERENCIA — copiar al portapapeles
   ================================================================ */
function copyBank(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const text = el.innerText.replace(/\s*\uf0c5.*/g,'').trim(); /* quitar icono */
  const cleanText = text.replace(/[\uE000-\uF8FF]/g, '').trim(); /* limpiar chars privados */

  navigator.clipboard.writeText(cleanText)
    .then(() => {
      const orig = el.innerHTML;
      el.innerHTML = '<i class="fa-solid fa-check" style="color:var(--cafe)"></i> Copiado';
      setTimeout(() => { el.innerHTML = orig; }, 2000);
    })
    .catch(() => {
      /* fallback */
      const ta = document.createElement('textarea');
      ta.value = cleanText;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      const orig = el.innerHTML;
      el.innerHTML = '<i class="fa-solid fa-check" style="color:var(--cafe)"></i> Copiado';
      setTimeout(() => { el.innerHTML = orig; }, 2000);
    });
}
window.copyBank = copyBank;

/* ================================================================
   15. GSAP ScrollTrigger — animaciones de entrada
       NOTA: selectores actualizados al nuevo HTML (tl-item, etc.)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* Countdown boxes */
  gsap.utils.toArray('.cd-box').forEach((box, i) => {
    gsap.from(box, {
      y: 50, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#countdown', start: 'top 85%', once: true },
    });
  });

  /* Novios cards */
  gsap.utils.toArray('.novio-card').forEach((card, i) => {
    gsap.from(card, {
      scale: 0.95, opacity: 0, duration: 0.9, delay: i * 0.18, ease: 'power3.out',
      scrollTrigger: { trigger: '#novios', start: 'top 85%', once: true },
    });
  });

  /* Timeline items — nuevo selector */
  gsap.utils.toArray('.tl-item').forEach((item, i) => {
    const fromLeft = item.classList.contains('tl-item--left');
    gsap.from(item, {
      x: fromLeft ? -50 : 50, opacity: 0, duration: 0.75, delay: i * 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: '#itinerario', start: 'top 85%', once: true },
    });
  });

  /* Padrinos cards */
  gsap.utils.toArray('.padrino-card').forEach((card, i) => {
    gsap.from(card, {
      y: 30, opacity: 0, duration: 0.7, delay: i * 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: '#padrinos', start: 'top 85%', once: true },
    });
  });

  /* Regalos cards */
  gsap.utils.toArray('.reg-card').forEach((card, i) => {
    gsap.from(card, {
      y: 35, opacity: 0, duration: 0.7, delay: i * 0.14, ease: 'power2.out',
      scrollTrigger: { trigger: '#regalos', start: 'top 85%', once: true },
    });
  });

  /* Galería */
  gsap.utils.toArray('.gi').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, y: 30, duration: 0.6, delay: i * 0.06, ease: 'power2.out',
      scrollTrigger: { trigger: '#galeria', start: 'top 85%', once: true },
    });
  });

  /* Player sección */
  gsap.from('.song-player-wrap', {
    y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#nuestra-cancion', start: 'top 85%', once: true },
  });

  /* Footer nombre */
  gsap.from('.footer-names', {
    y: 60, opacity: 0, duration: 1.2, ease: 'power4.out',
    scrollTrigger: { trigger: '#footer', start: 'top 88%', once: true },
  });

  ScrollTrigger.refresh();
});

/* ================================================================
   16. LAZY LOAD con fade-in
   ================================================================ */
(function () {
  if (!('IntersectionObserver' in window)) return;
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity    = '0';
    img.style.transition = 'opacity .55s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load',  () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '1'; });
    }
  });
})();

/* ================================================================
   17. MICROINTERACCIONES — hover de botones e historia
   ================================================================ */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => { btn.style.letterSpacing = '.17em'; });
  btn.addEventListener('mouseleave', () => { btn.style.letterSpacing = ''; });
});

document.querySelectorAll('.htl-item').forEach(item => {
  const dot = item.querySelector('.htl-dot');
  if (!dot) return;
  item.addEventListener('mouseenter', () => { dot.style.transform = 'scale(1.15)'; });
  item.addEventListener('mouseleave', () => { dot.style.transform = ''; });
});

/* ================================================================
   18. PRELOADER — se oculta tras load
   ================================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    preloader.style.opacity = '0';
    setTimeout(() => { preloader.style.display = 'none'; }, 400);
  }, 600);
});

/* ================================================================
   19. FIX VISIBILIDAD — parche de seguridad final
   ================================================================ */
(function ensureVisible() {
  const ids = ['novios','itinerario','padrinos','regalos','nuestra-cancion'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.style.opacity === '0')        el.style.opacity = '';
    if (el.style.visibility === 'hidden') el.style.visibility = '';
  });
  const selectors = '.novios-wrap, .padrinos-grid, .regalos-grid, .timeline-wrap, .song-player-wrap';
  document.querySelectorAll(selectors).forEach(grid => {
    if (grid.style.display === 'none') grid.style.display = '';
    if (grid.style.opacity === '0')    grid.style.opacity = '';
  });
})();
