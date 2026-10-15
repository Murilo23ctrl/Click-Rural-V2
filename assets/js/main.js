/* ═══════════════════════════════════════════════
   CLICK RURAL — interações
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- ano no rodapé ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- header + barra de progresso ---------- */
  const head = $('#head');
  const hero = $('#inicio');
  const bar  = $('#progress');

  const onScroll = () => {
    const y = window.scrollY;
    const limit = hero ? Math.max(hero.offsetHeight - 90, 0) : 90;
    head.classList.toggle('solid', y > limit);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- menu mobile ---------- */
  const burger = $('#burger');
  const burgerIcon = $('#burgerIcon');
  const nav = $('#nav');

  const closeMenu = () => {
    document.body.classList.remove('menu-open', 'lock');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    burgerIcon.setAttribute('href', '#i-menu');
  };
  const openMenu = () => {
    document.body.classList.add('menu-open', 'lock');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    burgerIcon.setAttribute('href', '#i-close');
  };

  burger.addEventListener('click', () => {
    document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
  });
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- reveals ---------- */
  const stagger = (sel, step = 0.08) => {
    $$(sel).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 8) * step}s`));
  };
  stagger('.cats .cat', 0.09);
  stagger('.steps .step', 0.08);
  stagger('.essay-stack .fig', 0.1);

  const targets = $$('.reveal, .wipe, .mask').filter(el => !el.closest('.hero'));

  if (reduce) {
    targets.forEach(el => el.classList.add('is-in'));
  } else {
    const pending = new Set(targets);

    const sweep = () => {
      if (!pending.size) return;
      const fold = window.innerHeight - 60;
      pending.forEach(el => {
        if (el.getBoundingClientRect().top < fold) {
          el.classList.add('is-in');
          pending.delete(el);
        }
      });
    };

    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    window.addEventListener('load', sweep);
    document.addEventListener('visibilitychange', sweep);
    sweep();
  }

  /* ---------- entrada do hero ---------- */
  const heroBits = [$('.hero-kicker'), ...$$('.hero-title .mask'), $('.hero-foot')].filter(Boolean);
  heroBits.forEach((el, i) => el.style.setProperty('--d', `${0.15 + i * 0.13}s`));
  // timer em vez de rAF: rAF fica congelado se a página abrir em aba de fundo
  setTimeout(() => heroBits.forEach(el => el.classList.add('is-in')), 40);

  /* ---------- galeria: filtros ---------- */
  const items = $$('.gitem');
  const fbtns = $$('.fbtn');

  fbtns.forEach(btn => {
    const f = btn.dataset.filter;
    const n = f === 'todos' ? items.length : items.filter(i => i.dataset.cat === f).length;
    const sup = $('sup', btn);
    if (sup) sup.textContent = n;
  });

  const applyFilter = (filter) => {
    fbtns.forEach(b => b.classList.toggle('on', b.dataset.filter === filter));
    items.forEach(item => {
      item.classList.toggle('hide', !(filter === 'todos' || item.dataset.cat === filter));
    });
  };
  fbtns.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

  /* ---------- lista de ensaios → filtra a galeria ---------- */
  const catLinks = $$('.cat > a');
  catLinks.forEach(a => {
    a.addEventListener('click', () => applyFilter(a.dataset.filter));
  });

  /* ---------- preview da foto seguindo o cursor ---------- */
  const view = $('#catView');
  const catList = $('#cats');
  const fine = window.matchMedia('(min-width: 1001px) and (hover: hover)');

  if (view && catList && !reduce) {
    catLinks.forEach(a => {
      const img = new Image();
      img.src = a.dataset.img;
      img.alt = '';
      view.appendChild(img);
    });
    const shots = $$('img', view);

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null, first = true;

    const loop = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      view.style.setProperty('--x', cx.toFixed(1));
      view.style.setProperty('--y', cy.toFixed(1));
      raf = requestAnimationFrame(loop);
    };

    catList.addEventListener('pointermove', (e) => {
      if (!fine.matches || e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (first) { cx = tx; cy = ty; first = false; }
      if (!raf) loop();
    });

    catLinks.forEach((a, i) => {
      a.addEventListener('pointerenter', (e) => {
        if (!fine.matches || e.pointerType !== 'mouse') return;
        shots.forEach((s, j) => s.classList.toggle('on', i === j));
        view.classList.add('on');
      });
    });

    catList.addEventListener('pointerleave', () => {
      view.classList.remove('on');
      first = true;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    });
  }

  /* ---------- lightbox ---------- */
  const lb = $('#lb');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  const lbCount = $('#lbCount');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');

  let shown = [];
  let idx = 0;
  let lastFocus = null;

  const pad = n => String(n).padStart(2, '0');

  const render = () => {
    const item = shown[idx];
    if (!item) return;
    const img = $('img', item);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = item.dataset.cap || img.alt;
    lbCount.textContent = `${pad(idx + 1)} / ${pad(shown.length)}`;
  };

  const open = (item) => {
    shown = items.filter(i => !i.classList.contains('hide'));
    idx = shown.indexOf(item);
    if (idx < 0) return;
    lastFocus = document.activeElement;
    render();
    lb.classList.add('on');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    lbClose.focus();
  };

  const close = () => {
    lb.classList.remove('on');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  };

  const step = (d) => {
    if (!shown.length) return;
    idx = (idx + d + shown.length) % shown.length;
    render();
  };

  items.forEach(item => item.addEventListener('click', () => open(item)));
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* swipe no mobile */
  let sx = 0, sy = 0;
  lb.addEventListener('touchstart', (e) => {
    sx = e.changedTouches[0].clientX;
    sy = e.changedTouches[0].clientY;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- formulário ----------
     Front-end apenas: valida e confirma. Para receber as mensagens de
     verdade, conecte a um serviço (Formspree, EmailJS, Netlify Forms…). */
  const form = $('#contactForm');
  const msg = $('#formMsg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        msg.textContent = 'Por favor, preencha os campos obrigatórios.';
        form.reportValidity();
        return;
      }
      const first = $('#nome').value.trim().split(' ')[0];
      msg.textContent = `Obrigada, ${first}! Sua mensagem foi enviada — retorno em breve.`;
      form.reset();
    });
  }

});
