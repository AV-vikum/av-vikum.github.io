(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Loader ---------- */
  const loader = document.querySelector('.loader');
  const count = document.querySelector('.loader-count');
  let n = 0;
  const finishLoad = () => {
    loader.classList.add('is-done');
    document.body.classList.add('is-loaded');
    setTimeout(() => loader.remove(), 1200);
  };
  if (reduceMotion) {
    finishLoad();
  } else {
    const tick = setInterval(() => {
      n = Math.min(100, n + Math.ceil(Math.random() * 9));
      count.textContent = n;
      if (n >= 100) { clearInterval(tick); setTimeout(finishLoad, 250); }
    }, 28);
  }

  /* ---------- Theme ---------- */
  const themeBtn = document.querySelector('.theme-toggle');
  const currentTheme = () =>
    root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Nav: hide on scroll down, active link ---------- */
  const nav = document.querySelector('.nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Local time (Sri Lanka) ---------- */
  const timeEl = document.getElementById('local-time');
  const updateTime = () => {
    timeEl.textContent = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit'
    });
  };
  updateTime();
  setInterval(updateTime, 30000);
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Rotating role ---------- */
  const roles = ['full-stack developer', 'Flutter developer', 'UI designer', 'problem solver'];
  const roleEl = document.querySelector('.rotator-word');
  let roleIdx = 0;
  if (!reduceMotion) {
    setInterval(() => {
      roleEl.classList.add('is-out');
      setTimeout(() => {
        roleIdx = (roleIdx + 1) % roles.length;
        roleEl.textContent = roles[roleIdx];
        roleEl.classList.remove('is-out');
        roleEl.classList.add('is-in');
        requestAnimationFrame(() => requestAnimationFrame(() => roleEl.classList.remove('is-in')));
      }, 450);
    }, 2600);
  }

  /* ---------- Project accordion ---------- */
  document.querySelectorAll('.project-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.project');
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ---------- Count-up stats ---------- */
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const start = performance.now();
      const dur = reduceMotion ? 0 : 1600;
      const step = now => {
        const p = dur ? Math.min(1, (now - start) / dur) : 1;
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  if (!finePointer || reduceMotion) return;

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  const cursorLabel = cursor.querySelector('.cursor-label');
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.classList.add('is-visible');
  });
  document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorLabel.textContent = el.dataset.cursor;
      cursor.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  /* ---------- Project hover preview ---------- */
  const preview = document.querySelector('.project-preview');
  const previewInner = preview.querySelector('.project-preview-inner');
  let px = 0, py = 0;
  document.querySelectorAll('.project').forEach(p => {
    p.addEventListener('mouseenter', () => {
      const img = p.dataset.img;
      previewInner.style.backgroundColor = p.dataset.color;
      previewInner.style.backgroundImage = img ? `url("${img}")` : '';
      previewInner.textContent = img ? '' : p.querySelector('.project-title').textContent;
      if (!p.classList.contains('is-open')) preview.classList.add('is-visible');
    });
    p.addEventListener('click', () => preview.classList.remove('is-visible'));
    p.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
  });

  const loop = () => {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    px += (mx - px) * 0.1; py += (my - py) * 0.1;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    preview.style.left = px + 'px';
    preview.style.top = py + 'px';
    requestAnimationFrame(loop);
  };
  loop();

  /* ---------- Card tilt ---------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Hero parallax ---------- */
  const blobs = document.querySelectorAll('.blob');
  window.addEventListener('mousemove', e => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    blobs.forEach((b, i) => { b.style.translate = `${x * (i + 1) * 40}px ${y * (i + 1) * 40}px`; });
  }, { passive: true });
})();
