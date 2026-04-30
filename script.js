/* ================================================================
   VALERIA & SEBASTIÁN — script.js v4
   Orden de módulos:
   01. Utilidades
   02. Preloader
   03. Navbar + Smooth Scroll + Active Link
   04. Botón volver arriba
   05. Hero Swiper
   06. Particles.js
   07. Canvas Pétalos
   08. Countdown — 21 Mayo 2028
   09. Reproductor de Sección (Nuestra Canción)
   10. Reproductor Flotante
   11. GSAP ScrollTrigger — animaciones
   12. Galería + Lightbox fluido
   13. Frases rotativas
   14. RSVP — validación + confetti
   15. Modal transferencia bancaria — copiar
   16. Lazy load fade-in
   17. Parche visibilidad final
   ================================================================ */

'use strict';

/* ================================================================
   01. UTILIDADES
   ================================================================ */

/** Pad numérico */
function pad(n, len = 2) { return String(n).padStart(len, '0'); }

/** Formatea segundos → M:SS */
function fmtTime(s) {
  if (!isFinite(s) || s < 0) return '--:--';
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

/** Detecta móvil/tablet */
function isMobile()  { return window.innerWidth < 768; }
function isTablet()  { return window.innerWidth >= 768 && window.innerWidth < 1024; }

/** requestAnimationFrame throttle para scroll */
function onScrollRAF(cb) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { cb(); ticking = false; }); ticking = true; }
  }, { passive: true });
}

/* ================================================================
   02. PRELOADER
   ================================================================ */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  setTimeout(() => {
    pre.style.opacity    = '0';
    pre.style.visibility = 'hidden';
    pre.style.pointerEvents = 'none';
    setTimeout(() => pre.remove(), 500);
  }, 700);
});

/* ================================================================
   03. NAVBAR + SMOOTH SCROLL + ACTIVE LINK
   ================================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');
  if (!navbar) return;

  /* ── Scroll style ── */
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 420);
  }
  onScrollRAF(handleScroll);
  handleScroll();

  /* ── Hamburguesa ── */
  function closeMenu() {
    navToggle?.classList.remove('open');
    navLinks?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Cerrar al hacer click en un link */
  allLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* Cerrar si se hace click fuera del panel */
  document.addEventListener('click', e => {
    if (navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle?.contains(e.target)) {
      closeMenu();
    }
  });

  /* Cerrar con ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const sel = anchor.getAttribute('href');
      if (sel === '#') return;
      const target = document.querySelector(sel);
      if (target) {
        e.preventDefault();
        const offset = window.innerWidth < 768 ? 70 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active link por sección visible ── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' });
  sections.forEach(s => observer.observe(s));
})();

/* ================================================================
   04. BOTÓN VOLVER ARRIBA
   ================================================================ */
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ================================================================
   05. HERO SWIPER
   ================================================================ */
(function initHeroSwiper() {
  if (!document.querySelector('.hero-swiper')) return;
  new Swiper('.hero-swiper', {
    loop:        true,
    autoplay:    { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed:       1100,
    effect:      'fade',
    fadeEffect:  { crossFade: true },
    parallax:    true,
    pagination:  { el: '.hero-pagination', clickable: true },
    navigation:  { nextEl: '.hero-next', prevEl: '.hero-prev' },
    keyboard:    { enabled: true },
    a11y:        { enabled: true },
  });
})();

/* ================================================================
   06. PARTICLES.JS
   ================================================================ */
(function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  const el = document.getElementById('particles-js');
  if (!el) return;
  /* En móvil menos partículas para rendimiento */
  const count = isMobile() ? 20 : 50;
  particlesJS('particles-js', {
    particles: {
      number:   { value: count, density: { enable: true, value_area: 900 } },
      color:    { value: ['#e2c98a','#d4a87a','#f5ede0','#ffffff','#c9a96e'] },
      shape:    { type: 'circle' },
      opacity:  { value: 0.5, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.1, sync: false } },
      size:     { value: 3.5, random: true, anim: { enable: true, speed: 1.5, size_min: 0.5, sync: false } },
      line_linked: { enable: false },
      move:     { enable: true, speed: 1.1, direction: 'top', random: true, straight: false, out_mode: 'out', bounce: false },
    },
    interactivity: {
      detect_on: 'canvas',
      events:    { onhover: { enable: !isMobile(), mode: 'bubble' }, onclick: { enable: false } },
      modes:     { bubble: { distance: 100, size: 5, duration: 2, opacity: 0.8 } },
    },
    retina_detect: true,
  });
})();

/* ================================================================
   07. CANVAS PÉTALOS
   ================================================================ */
(function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const colors = ['#e0b899','#c9a96e','#e8d5b7','#f5ede0','#d4a87a','#e2c98a'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Menos pétalos en móvil */
  const TOTAL = isMobile() ? 14 : 26;

  class Petal {
    constructor(initial) { this.reset(initial); }
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
    update() {
      this.sway  += this.swaySpd;
      this.x     += this.speedX + Math.sin(this.sway) * 0.45;
      this.y     += this.speedY;
      this.angle += this.spin;
      if (this.y > canvas.height + 30) this.reset();
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
  }

  const petals = Array.from({ length: TOTAL }, () => new Petal(true));

  let animFrame;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(loop);
  }
  loop();

  /* Pausar cuando la pestaña está oculta */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else loop();
  });
})();

/* ================================================================
   08. COUNTDOWN — 21 Mayo 2028 17:00 (GMT-6 Mérida)
       = 2028-05-21 23:00 UTC
   ================================================================ */
(function initCountdown() {
  const TARGET = new Date(Date.UTC(2028, 4, 21, 23, 0, 0));
  const elD = document.getElementById('cd-days');
  const elH = document.getElementById('cd-hours');
  const elM = document.getElementById('cd-mins');
  const elS = document.getElementById('cd-secs');
  if (!elD) return;

  function animNum(el, val) {
    if (el.textContent === val) return;
    el.style.animation = 'none';
    void el.offsetWidth; /* reflow */
    el.textContent     = val;
    el.style.animation = 'flipNum .35s ease';
  }

  function tick() {
    const diff = TARGET.getTime() - Date.now();
    if (diff <= 0) {
      [elD, elH, elM, elS].forEach(el => { if(el) el.textContent = '00'; });
      if (elD) elD.textContent = '000';
      return;
    }
    animNum(elD, pad(Math.floor(diff / 86400000), 3));
    animNum(elH, pad(Math.floor((diff % 86400000) / 3600000)));
    animNum(elM, pad(Math.floor((diff % 3600000)  / 60000)));
    animNum(elS, pad(Math.floor((diff % 60000)    / 1000)));
  }

  tick();
  setInterval(tick, 1000);
})();

/* ================================================================
   09. REPRODUCTOR DE SECCIÓN "NUESTRA CANCIÓN"
   ================================================================ */
(function initSectionPlayer() {
  const audio      = document.getElementById('sp-audio');
  const btnPlay    = document.getElementById('sp-play');
  const btnPrev    = document.getElementById('sp-prev');
  const btnNext    = document.getElementById('sp-next');
  const iconPlay   = document.getElementById('sp-play-icon');
  const barEl      = document.getElementById('sp-progress-bar');
  const fillEl     = document.getElementById('sp-progress-fill');
  const thumbEl    = document.getElementById('sp-progress-thumb');
  const timeCur    = document.getElementById('sp-current');
  const timeTotal  = document.getElementById('sp-total');
  const nowName    = document.getElementById('sp-now-name');
  const nowArtist  = document.getElementById('sp-now-artist');
  const volSlider  = document.getElementById('sp-volume');
  const muteBtn    = document.getElementById('sp-mute');
  const discEl     = document.getElementById('sc-disc');
  const coverImg   = document.getElementById('sc-cover-img');
  const tracks     = document.querySelectorAll('.sc-track');

  if (!audio || !btnPlay || !tracks.length) return;

  /* ── Estado ── */
  let curIdx     = 0;
  let playing    = false;
  let muted      = false;
  let prevVol    = 0.8;
  let dragging   = false;

  /* ── Canciones desde DOM ── */
  const songs = Array.from(tracks).map(t => ({
    src:    t.dataset.src    || '',
    title:  t.dataset.title  || '—',
    artist: t.dataset.artist || '—',
    cover:  t.dataset.cover  || '',
  }));

  /* ── Helpers UI ── */
  function setProgress(pct) {
    const p = Math.min(Math.max(pct, 0), 100);
    if (fillEl)  fillEl.style.width = p + '%';
    if (thumbEl) thumbEl.style.left = p + '%';
  }

  function setTrackActive(idx) {
    tracks.forEach((t, i) => {
      t.classList.toggle('sc-track-active', i === idx);
    });
  }

  function updateFloatingTitle(title, artist) {
    const ft = document.getElementById('music-title');
    if (ft) ft.textContent = `${title} — ${artist}`;
  }

  /* ── Cargar canción ── */
  function loadSong(idx, autoplay = false) {
    curIdx      = idx;
    const s     = songs[idx];
    audio.src   = s.src;
    audio.volume= volSlider ? parseFloat(volSlider.value) : 0.8;

    if (nowName)   nowName.textContent   = s.title;
    if (nowArtist) nowArtist.textContent = s.artist;
    if (timeCur)   timeCur.textContent   = '0:00';
    if (timeTotal) timeTotal.textContent = '--:--';
    setProgress(0);
    setTrackActive(idx);
    updateFloatingTitle(s.title, s.artist);

    /* Portada */
    if (coverImg && s.cover) {
      coverImg.style.opacity = '0';
      coverImg.src = s.cover;
      coverImg.onload = () => { coverImg.style.transition = 'opacity .45s'; coverImg.style.opacity = '1'; };
    }

    if (autoplay) playSong();
  }

  /* ── Play / Pause ── */
  function playSong() {
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        playing = true;
        if (iconPlay) iconPlay.className = 'fa-solid fa-pause';
        if (discEl)   discEl.classList.add('playing');
        /* Sync ícono flotante */
        const fi = document.getElementById('music-icon');
        if (fi) fi.className = 'fa-solid fa-pause';
      }).catch(() => {
        playing = false;
        if (iconPlay) iconPlay.className = 'fa-solid fa-play';
      });
    }
  }

  function pauseSong() {
    audio.pause();
    playing = false;
    if (iconPlay) iconPlay.className = 'fa-solid fa-play';
    if (discEl)   discEl.classList.remove('playing');
    const fi = document.getElementById('music-icon');
    if (fi) fi.className = 'fa-solid fa-play';
  }

  function togglePlay() { playing ? pauseSong() : playSong(); }
  function prevSong()   { loadSong((curIdx - 1 + songs.length) % songs.length, playing); }
  function nextSong()   { loadSong((curIdx + 1) % songs.length, playing); }

  /* ── Barra de progreso ── */
  audio.addEventListener('timeupdate', () => {
    if (dragging || !isFinite(audio.duration)) return;
    setProgress((audio.currentTime / audio.duration) * 100);
    if (timeCur) timeCur.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (timeTotal) timeTotal.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('ended', nextSong);

  function seekTo(clientX) {
    if (!barEl || !isFinite(audio.duration)) return;
    const rect = barEl.getBoundingClientRect();
    const pct  = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = pct * audio.duration;
    setProgress(pct * 100);
  }

  /* Mouse seek */
  if (barEl) {
    barEl.addEventListener('click', e => seekTo(e.clientX));
    barEl.addEventListener('mousedown', e => {
      dragging = true;
      seekTo(e.clientX);
      const onMove = ev => { if (dragging) seekTo(ev.clientX); };
      const onUp   = () => { dragging = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
    /* Touch seek */
    barEl.addEventListener('touchstart', e => {
      seekTo(e.touches[0].clientX);
    }, { passive: true });
    barEl.addEventListener('touchmove', e => {
      seekTo(e.touches[0].clientX);
    }, { passive: true });
  }

  /* ── Volumen ── */
  if (volSlider) {
    volSlider.addEventListener('input', () => {
      const v    = parseFloat(volSlider.value);
      audio.volume = v;
      muted      = v === 0;
      if (muteBtn) {
        muteBtn.className = v === 0
          ? 'fa-solid fa-volume-xmark sc-vol-ico'
          : v < 0.5
            ? 'fa-solid fa-volume-low sc-vol-ico'
            : 'fa-solid fa-volume-high sc-vol-ico';
      }
      /* Sincronizar con el flotante */
      const fa = document.getElementById('audio-el');
      if (fa) fa.volume = v;
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (muted) {
        audio.volume = prevVol;
        if (volSlider) volSlider.value = prevVol;
        muted = false;
        muteBtn.className = 'fa-solid fa-volume-low sc-vol-ico';
      } else {
        prevVol = audio.volume || 0.8;
        audio.volume = 0;
        if (volSlider) volSlider.value = 0;
        muted = true;
        muteBtn.className = 'fa-solid fa-volume-xmark sc-vol-ico';
      }
    });
  }

  /* ── Click en tracks ── */
  tracks.forEach((t, i) => {
    t.addEventListener('click', () => {
      if (i === curIdx) togglePlay();
      else loadSong(i, true);
    });
  });

  /* ── Botones ── */
  btnPlay.addEventListener('click', togglePlay);
  btnPrev?.addEventListener('click', prevSong);
  btnNext?.addEventListener('click', nextSong);

  /* ── Teclado (solo cuando la sección está visible) ── */
  document.addEventListener('keydown', e => {
    const section = document.getElementById('nuestra-cancion');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) return;
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight') { e.preventDefault(); audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 0); }
    if (e.code === 'ArrowLeft')  { e.preventDefault(); audio.currentTime = Math.max(audio.currentTime - 10, 0); }
  });

  /* ── Init ── */
  loadSong(0, false);

  /* Exponer para el flotante */
  window._sectionPlayer = { audio, songs, getCurIdx: () => curIdx, isPlaying: () => playing, loadSong, pauseSong };
})();

/* ================================================================
   10. REPRODUCTOR FLOTANTE
   ================================================================ */
(function initFloatingPlayer() {
  const player  = document.getElementById('music-player');
  const audio   = document.getElementById('audio-el');
  const iconEl  = document.getElementById('music-icon');
  const titleEl = document.getElementById('music-title');
  const fillEl  = document.getElementById('music-fill');
  const btnToggle = document.getElementById('music-toggle');
  const btnNext   = document.getElementById('music-next');
  const btnClose  = document.getElementById('music-close');
  if (!player || !audio) return;

  const songs = [
    { title: 'Canon en Re — Pachelbel',        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'A Thousand Years — Instrumental', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  ];
  let cur = 0, playing = false;

  function loadSong(idx) {
    cur = idx;
    audio.src = songs[idx].src;
    if (titleEl) titleEl.textContent = songs[idx].title;
    if (fillEl)  fillEl.style.width  = '0%';
  }

  function togglePlay() {
    if (playing) {
      audio.pause();
      playing = false;
      if (iconEl) iconEl.className = 'fa-solid fa-play';
    } else {
      audio.play()
        .then(() => { playing = true; if (iconEl) iconEl.className = 'fa-solid fa-pause'; })
        .catch(() => { playing = false; });
    }
  }

  function nextSong() {
    cur = (cur + 1) % songs.length;
    loadSong(cur);
    if (playing) audio.play().catch(() => {});
    /* Sincronizar con el sección player */
    if (window._sectionPlayer) window._sectionPlayer.loadSong(cur, playing);
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || !fillEl) return;
    fillEl.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
  });
  audio.addEventListener('ended', nextSong);

  btnToggle?.addEventListener('click', togglePlay);
  btnNext?.addEventListener('click', nextSong);
  btnClose?.addEventListener('click', () => {
    audio.pause(); playing = false;
    if (iconEl) iconEl.className = 'fa-solid fa-play';
    player.classList.add('hidden');
    /* También pausar sección player */
    window._sectionPlayer?.pauseSong();
  });

  loadSong(0);
})();

/* ================================================================
   11. GSAP SCROLLTRIGGER — animaciones
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ── Función helper ── */
  function fromTo(selector, from, trigger, stagger = 0) {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    gsap.fromTo(els, from,
      { ...Object.fromEntries(Object.keys(from).map(k => [k, k === 'opacity' ? 1 : 0])),
        opacity: 1, duration: .85, ease: 'power3.out', stagger,
        scrollTrigger: { trigger, start: 'top 85%', once: true }
      }
    );
  }

  /* ── Countdown boxes ── */
  gsap.utils.toArray('.cd-box').forEach((box, i) => {
    gsap.fromTo(box,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: .8, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#countdown', start: 'top 85%', once: true } }
    );
  });

  /* ── Nosotros — entrada izquierda/derecha ── */
  const leftCard  = document.querySelector('.novio-card--left');
  const rightCard = document.querySelector('.novio-card--right');
  const midEl     = document.querySelector('.novios-mid');

  if (leftCard && rightCard) {
    /* En desktop/tablet: animación lateral */
    if (!isMobile()) {
      /* Resetear el estado inline puesto por CSS */
      gsap.set(leftCard,  { opacity: 0, x: -90 });
      gsap.set(rightCard, { opacity: 0, x:  90 });
      if (midEl) gsap.set(midEl, { opacity: 0, scale: .7 });

      ScrollTrigger.create({
        trigger: '#novios',
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(leftCard,  { opacity: 1, x: 0, duration: .9, ease: 'power3.out' });
          gsap.to(rightCard, { opacity: 1, x: 0, duration: .9, ease: 'power3.out', delay: .12 });
          if (midEl) gsap.to(midEl, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(1.4)', delay: .3 });
        }
      });
    } else {
      /* En móvil: directamente visibles, animación fade suave */
      gsap.set([leftCard, rightCard], { opacity: 0, y: 30 });
      gsap.to([leftCard, rightCard],  { opacity: 1, y: 0, duration: .7, stagger: .15, ease: 'power2.out',
        scrollTrigger: { trigger: '#novios', start: 'top 88%', once: true }
      });
    }
  }

  /* ── Itinerario — items alternados ── */
  gsap.utils.toArray('.tl-item').forEach((item, i) => {
    const fromLeft = item.classList.contains('tl-item--left');
    const xVal     = isMobile() ? 0 : (fromLeft ? -55 : 55);
    gsap.fromTo(item,
      { x: xVal, y: isMobile() ? 30 : 0, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: .75, delay: i * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '#itinerario', start: 'top 85%', once: true } }
    );
  });

  /* ── Padrinos ── */
  gsap.utils.toArray('.padrino-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: .7, delay: i * 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '#padrinos', start: 'top 85%', once: true } }
    );
  });

  /* ── Regalos ── */
  gsap.utils.toArray('.reg-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: .7, delay: i * 0.13, ease: 'power2.out',
        scrollTrigger: { trigger: '#regalos', start: 'top 85%', once: true } }
    );
  });

  /* ── Galería ── */
  gsap.utils.toArray('.gi').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: .6, delay: i * 0.055, ease: 'power2.out',
        scrollTrigger: { trigger: '#galeria', start: 'top 85%', once: true } }
    );
  });

  /* ── Player sección ── */
  gsap.fromTo('.sc-card',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '#nuestra-cancion', start: 'top 85%', once: true } }
  );

  /* ── Historia timeline ── */
  gsap.utils.toArray('.htl-item').forEach((item, i) => {
    gsap.fromTo(item,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: .6, delay: i * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.historia-tl', start: 'top 85%', once: true } }
    );
  });

  /* ── Footer nombre ── */
  gsap.fromTo('.footer-names',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
      scrollTrigger: { trigger: '#footer', start: 'top 88%', once: true } }
  );

  /* ── Reconstruir ScrollTrigger al resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
  }, { passive: true });

  ScrollTrigger.refresh();
});

/* ── AOS Init ── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 850,
      easing:   'ease-out-cubic',
      once:     true,
      offset:   60,
      mirror:   false,
      disable:  false,
    });
  }
});

/* ================================================================
   12. GALERÍA + LIGHTBOX FLUIDO
   ================================================================ */
(function initLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gi'));
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lb-img');
  const lbCount      = document.getElementById('lb-count');
  const lbThumbsWrap = document.getElementById('lb-thumbs');
  const lbSpinner    = document.getElementById('lb-spinner');
  const lbClose      = document.getElementById('lb-close');
  const lbPrev       = document.getElementById('lb-prev');
  const lbNext       = document.getElementById('lb-next');
  const lbBackdrop   = document.getElementById('lb-backdrop');

  if (!lightbox || !lbImg || !galleryItems.length) return;

  let curIdx = 0;

  /* Construir thumbnails una sola vez */
  if (lbThumbsWrap && !isMobile()) {
    galleryItems.forEach((item, i) => {
      const src   = item.querySelector('img')?.src || '';
      const thumb = document.createElement('div');
      thumb.className = 'lb-thumb';
      thumb.dataset.index = i;
      const img   = document.createElement('img');
      img.src = src; img.alt = ''; img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.addEventListener('click', () => openLightbox(i));
      lbThumbsWrap.appendChild(thumb);
    });
  }

  function updateThumbs(idx) {
    const thumbs = lbThumbsWrap?.querySelectorAll('.lb-thumb');
    thumbs?.forEach((t, i) => t.classList.toggle('lb-thumb-active', i === idx));
    /* Scroll al thumb activo */
    const active = lbThumbsWrap?.querySelector('.lb-thumb-active');
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function openLightbox(idx) {
    curIdx = idx;
    const src = galleryItems[idx]?.querySelector('img')?.src || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    /* Mostrar spinner, ocultar imagen */
    if (lbSpinner) lbSpinner.classList.add('show');
    lbImg.classList.add('loading');

    const tmpImg = new Image();
    tmpImg.onload = () => {
      lbImg.src = src;
      lbImg.classList.remove('loading');
      if (lbSpinner) lbSpinner.classList.remove('show');
    };
    tmpImg.onerror = () => {
      lbImg.src = src;
      lbImg.classList.remove('loading');
      if (lbSpinner) lbSpinner.classList.remove('show');
    };
    tmpImg.src = src;

    if (lbCount) lbCount.textContent = `${idx + 1} / ${galleryItems.length}`;
    updateThumbs(idx);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  function navigate(dir) {
    curIdx = (curIdx + dir + galleryItems.length) % galleryItems.length;
    openLightbox(curIdx);
  }

  /* Exponer globalmente para botones onclick en HTML */
  window.openLightbox  = openLightbox;
  window.closeLightbox = closeLightbox;
  window.lightboxNav   = navigate;

  /* Eventos */
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index, 10)));
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbBackdrop?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => navigate(-1));
  lbNext?.addEventListener('click', () => navigate(1));

  /* Teclado */
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  /* Swipe táctil para móvil */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) navigate(diff < 0 ? 1 : -1);
  }, { passive: true });
})();

/* ================================================================
   13. FRASES ROMÁNTICAS ROTATIVAS
   ================================================================ */
(function initFrases() {
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

  let cur = 0;
  const dots = Array.from(dotsEl.querySelectorAll('.fd'));
  txtEl.textContent = frases[0];

  function show(idx) {
    txtEl.style.opacity = '0';
    setTimeout(() => { txtEl.textContent = frases[idx]; txtEl.style.opacity = '1'; }, 460);
    dots.forEach(d => d.classList.remove('active'));
    dots[idx]?.classList.add('active');
  }

  setInterval(() => {
    cur = (cur + 1) % frases.length;
    show(cur);
  }, 4200);
})();

/* ================================================================
   14. RSVP — validación + confetti
   ================================================================ */
function submitRSVP() {
  const nameEl   = document.getElementById('rsvp-name');
  const phoneEl  = document.getElementById('rsvp-phone');
  const guestsEl = document.getElementById('rsvp-guests');
  const btn      = document.getElementById('rsvp-submit');
  if (!nameEl || !phoneEl || !guestsEl || !btn) return;

  /* Limpiar errores */
  ['name','phone','guests'].forEach(f => {
    const e = document.getElementById('err-' + f);
    if (e) e.textContent = '';
  });

  let valid = true;

  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    const e = document.getElementById('err-name');
    if (e) e.textContent = 'Por favor ingresa tu nombre completo.';
    if (valid) nameEl.focus();
    valid = false;
  }
  const phone = phoneEl.value.replace(/\D/g, '');
  if (!phoneEl.value.trim() || phone.length < 10) {
    const e = document.getElementById('err-phone');
    if (e) e.textContent = 'Ingresa un número válido (mín. 10 dígitos).';
    if (valid) phoneEl.focus();
    valid = false;
  }
  if (!guestsEl.value) {
    const e = document.getElementById('err-guests');
    if (e) e.textContent = 'Selecciona el número de invitados.';
    if (valid) guestsEl.focus();
    valid = false;
  }

  if (!valid) {
    const box = document.getElementById('rsvp-form-box');
    if (box) {
      box.style.animation = 'none';
      void box.offsetWidth;
      box.style.animation = 'shake .5s ease';
    }
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

  setTimeout(() => {
    const formBox = document.getElementById('rsvp-form-box');
    const sucBox  = document.getElementById('rsvp-success');
    if (formBox) formBox.style.display = 'none';
    if (sucBox)  sucBox.style.display  = 'block';
    burstConfetti();
  }, 1800);
}
window.submitRSVP = submitRSVP;

/* Limpiar errores en tiempo real */
['rsvp-name','rsvp-phone','rsvp-guests'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    const errId = 'err-' + id.replace('rsvp-','');
    const err = document.getElementById(errId);
    if (err) err.textContent = '';
  });
});

/* ── Confetti ── */
function burstConfetti() {
  const colors = ['#c9a96e','#e0b899','#e2c98a','#d4a87a','#f5ede0','#fff','#c8956c'];
  for (let i = 0; i < 72; i++) {
    const piece = document.createElement('span');
    const sz    = 5 + Math.random() * 8;
    piece.style.cssText = [
      'position:fixed', `top:${window.innerHeight / 2}px`, `left:${window.innerWidth / 2}px`,
      `width:${sz}px`, `height:${sz * 1.4}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`,
      'pointer-events:none', 'z-index:99999', 'opacity:1',
    ].join(';');
    document.body.appendChild(piece);
    const angle = Math.random() * Math.PI * 2;
    const dist  = 90 + Math.random() * 250;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const dur   = 850 + Math.random() * 700;
    piece.animate([
      { transform: `translate(-50%,-50%) scale(1) rotate(0deg)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(.2) rotate(${-360 + Math.random()*720}deg)`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(0,0,.2,1)', fill: 'forwards' })
    .finished.then(() => piece.remove());
  }
}

/* ================================================================
   15. MODAL TRANSFERENCIA — copiar al portapapeles
   ================================================================ */
function copyBank(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  /* Extraer solo los números/texto limpio */
  const raw   = el.innerText || '';
  const clean = raw.replace(/[\uE000-\uF8FF\uF000-\uFFFF]/g, '').replace(/\s{2,}/g,' ').trim();

  const doFeedback = () => {
    const orig = el.innerHTML;
    el.innerHTML = '<i class="fa-solid fa-check" style="color:#c8956c"></i> ¡Copiado!';
    setTimeout(() => { el.innerHTML = orig; }, 2200);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(clean).then(doFeedback).catch(() => fallbackCopy(clean, doFeedback));
  } else {
    fallbackCopy(clean, doFeedback);
  }
}
window.copyBank = copyBank;

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); cb(); } catch(e) {}
  document.body.removeChild(ta);
}

/* ================================================================
   16. LAZY LOAD — fade-in suave
   ================================================================ */
(function initLazyLoad() {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity    = '0';
    img.style.transition = 'opacity .55s ease';

    const onLoad = () => { img.style.opacity = '1'; };

    if (img.complete && img.naturalWidth > 0) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load',  onLoad, { once: true });
      img.addEventListener('error', onLoad, { once: true });
    }
  });
})();

/* ================================================================
   17. PARCHE VISIBILIDAD FINAL
   ================================================================ */
window.addEventListener('load', () => {
  /* Asegurar que ninguna sección quedó invisible por conflicto AOS/GSAP */
  const fixes = [
    '#novios', '#itinerario', '#padrinos', '#regalos',
    '#nuestra-cancion', '#galeria', '#historia',
  ];
  fixes.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (window.getComputedStyle(el).opacity === '0') el.style.opacity = '1';
    if (window.getComputedStyle(el).visibility === 'hidden') el.style.visibility = 'visible';
  });

  /* Grid y wrap containers */
  ['.novios-wrap', '.padrinos-grid', '.regalos-grid', '.timeline-wrap', '.sc-card']
    .forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.style.display === 'none') el.style.display = '';
      });
    });
});
