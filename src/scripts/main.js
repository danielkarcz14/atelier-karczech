function init() {
  initCursor();
  initNavbar();
  initMobileMenu();
  initLightbox();
  initParallax();
  initScrollReveal();
  initCounters();
  initPortfolioDrag();
  initBimSlider();
  initStepStagger();
  initContactForm();
}

function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!window.matchMedia('(pointer: fine)').matches || !dot || !ring) return;

  let mx = 0, my = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function loop() {
    dx += (mx - dx) * 0.15;
    dy += (my - dy) * 0.15;
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    ring.style.left = dx + 'px';
    ring.style.top = dy + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .portfolio-card, .team-card').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 80);
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  if (!menuBtn || !mobileMenu || !mobileOverlay) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    menuBtn.classList.toggle('active');
  });

  mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('open');
  document.getElementById('menuBtn')?.classList.remove('active');
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  function open(card) {
    const img = card.querySelector('img');
    if (!img) return;
    lightboxImg.src = card.dataset.full || img.currentSrc || img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-card[data-full], .bim-slide[data-full]').forEach((card) => {
    card.addEventListener('click', () => open(card));
  });

  // Click on the backdrop closes; click on the image does not.
  lightbox.addEventListener('click', close);
  lightboxImg.addEventListener('click', (e) => e.stopPropagation());
  lightbox.querySelector('[data-close]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initParallax() {
  const heroImg = document.getElementById('heroImg');
  if (!heroImg) return;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.transform = `translateY(${y * 0.3}px)`;
    },
    { passive: true }
  );
}

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal, .step-card').forEach((el) => observer.observe(el));
}

function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (!target) return;

        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.round(current) + '%';
        }, 30);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.counter').forEach((el) => observer.observe(el));
}

function initPortfolioDrag() {
  const track = document.getElementById('portfolioTrack');
  if (!track) return;

  const prevBtn = document.getElementById('portfolioPrev');
  const nextBtn = document.getElementById('portfolioNext');

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  function onPointerMove(e) {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) {
      moved = true;
      track.classList.add('is-dragging');
    }
    if (moved) track.scrollLeft = startScroll - dx;
  }

  function onPointerUp() {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  });

  // After an actual drag, suppress the click that follows (it would open the lightbox).
  track.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  function scrollByCard(dir) {
    const card = track.querySelector('.portfolio-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    const amount = card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', () => scrollByCard(-1));
  nextBtn?.addEventListener('click', () => scrollByCard(1));

  function updateArrows() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const x = track.scrollLeft;
    prevBtn?.classList.toggle('is-hidden', x <= 1);
    nextBtn?.classList.toggle('is-hidden', x >= maxScroll - 1);
  }

  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
}

function initBimSlider() {
  const track = document.getElementById('bimTrack');
  if (!track) return;

  const slides = [...track.querySelectorAll('.bim-slide')];
  const dots = [...document.querySelectorAll('#bimDots .bim-dot')];
  const prevBtn = document.getElementById('bimPrev');
  const nextBtn = document.getElementById('bimNext');
  if (slides.length === 0) return;

  // A single render needs no controls.
  if (slides.length < 2) {
    prevBtn?.remove();
    nextBtn?.remove();
    document.getElementById('bimDots')?.remove();
    return;
  }

  let index = 0;

  function go(target) {
    index = (target + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  prevBtn?.addEventListener('click', () => go(index - 1));
  nextBtn?.addEventListener('click', () => go(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

  go(0);
}

function initStepStagger() {
  document.querySelectorAll('.step-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  const defaultLabel = button ? button.textContent.trim() : '';
  const val = (name) => {
    const el = form.querySelector(`[name="${name}"]`);
    return el ? el.value.trim() : '';
  };

  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ` form-status--${kind}` : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!val('name') || !val('email') || !val('message')) {
      setStatus('Vyplňte prosím jméno, e-mail a zprávu.', 'err');
      return;
    }

    const payload = {
      name: val('name'),
      email: val('email'),
      phone: val('phone'),
      message: val('message'),
      _gotcha: val('_gotcha'),
    };

    if (button) {
      button.disabled = true;
      button.textContent = 'Odesílám…';
    }
    setStatus('', null);

    try {
      const res = await fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        form.reset();
        setStatus('Děkujeme! Zpráva byla odeslána, ozveme se co nejdříve.', 'ok');
      } else {
        setStatus((data && data.error) || 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.', 'err');
      }
    } catch {
      setStatus('Chyba spojení. Zkontrolujte připojení a zkuste to znovu.', 'err');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = defaultLabel;
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
