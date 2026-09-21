/* ==========================================================================
   THE MURNANS · behaviour
   Everything degrades gracefully: no JS, no problem, the content still reads.
   ========================================================================== */

(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  /* ── Theme ─────────────────────────────────────────────────────────── */

  const THEME_KEY = 'murnan-theme';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    $$('.theme-toggle').forEach(b => b.setAttribute('aria-pressed', String(t === 'dusk')));
    // The phone's browser bar keeps the oxblood of the footer it sits
    // against, in both themes. safari-bar.js watches data-theme and puts it
    // back after the swap.
  }

  applyTheme(store.get(THEME_KEY) || 'dawn');

  // The new theme opens out from the toggle in a circle. Underneath, every
  // colour changes at once with transitions held off, so no card or line lags
  // behind the rest. Without View Transitions, or with reduced motion, it is
  // the same clean swap with no circle.
  function initTheme() {
    const root = document.documentElement;
    $$('.theme-toggle').forEach(btn => btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dusk' ? 'dawn' : 'dusk';
      const swap = () => { applyTheme(next); store.set(THEME_KEY, next); };
      const done = () => root.classList.remove('theme-swap');
      root.classList.add('theme-swap');

      if (calm || !document.startViewTransition) {
        swap();
        setTimeout(done, 60);
        return;
      }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(swap);
      vt.ready.then(() => root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' }
      )).catch(() => {});
      vt.finished.finally(done);
      setTimeout(done, 1500);   // never leave transitions switched off
    }));
  }

  /* ── Once a frame, never once an event ─────────────────────────────────
     A phone fires scroll events faster than the screen refreshes, and every
     pass below reads where elements are. A read that follows a write makes
     the browser lay the whole page out again there and then, so on a page
     this long the passes together were forcing well over a hundred layouts
     per event, which is what a phone runs out of room for. Each pass now
     runs at most once a frame, and reads everything it needs before it
     writes anything. */

  function perFrame(fn) {
    let queued = false;
    const run = () => { queued = false; fn(); };
    return () => { if (queued) return; queued = true; requestAnimationFrame(run); };
  }

  /* ── Navigation ────────────────────────────────────────────────────── */

  function initNav() {
    const nav = $('.nav');
    const burger = $('.nav__burger');
    const links = $('.nav__links');

    if (nav) {
      const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
      onScroll();
      addEventListener('scroll', perFrame(onScroll), { passive: true });
    }

    if (burger && links) {
      burger.addEventListener('click', () => {
        const open = links.classList.toggle('is-open');
        document.body.classList.toggle('menu-open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
      links.addEventListener('click', e => {
        if (e.target.closest('a')) {
          links.classList.remove('is-open');
          document.body.classList.remove('menu-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ── Scroll progress ───────────────────────────────────────────────── */

  function initProgress() {
    const bar = $('.progress__bar');
    if (!bar) return;
    const tick = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
    };
    tick();
    addEventListener('scroll', perFrame(tick), { passive: true });
    addEventListener('resize', tick);
  }

  /* ── Word splitting for masked headline rises ──────────────────────── */

  function splitWords(el) {
    if (el.dataset.split === 'done') return;
    const frag = document.createDocumentFragment();
    let i = 0;

    const wrap = (content, isNode) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      const inner = document.createElement('span');
      inner.className = 'wi';
      inner.style.setProperty('--wd', `${i++ * 55}ms`);
      if (isNode) inner.appendChild(content); else inner.textContent = content;
      outer.appendChild(inner);
      return outer;
    };

    [...el.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(chunk => {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) frag.appendChild(document.createTextNode(' '));
          else frag.appendChild(wrap(chunk, false));
        });
      } else {
        frag.appendChild(wrap(node.cloneNode(true), true));
      }
    });

    el.textContent = '';
    el.appendChild(frag);
    el.dataset.split = 'done';
  }

  /* ── "When this scrolls into view" ─────────────────────────────────────
     A plain scroll sweep rather than IntersectionObserver. Content that is
     hidden until it animates must never depend on a mechanism that can fail
     quietly. If it does, the page silently loses its photographs.          */

  const watchers = [];
  let sweeping = false;

  function inView(el, slack = 0.9) {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight * slack && r.bottom > 0;
  }

  function sweep() {
    if (!watchers.length) return;
    // every position first: a callback adds a class, and the read after that
    // would lay the page out again before the next watcher could be measured
    const line = innerHeight * 0.9;
    const due = [];
    for (let i = watchers.length - 1; i >= 0; i--) {
      const r = watchers[i].el.getBoundingClientRect();
      if (r.top < line && r.bottom > 0) due.push(watchers.splice(i, 1)[0]);
    }
    due.forEach(w => w.fn(w.el));
  }

  function onInView(el, fn) {
    if (calm || inView(el)) return fn(el);
    watchers.push({ el, fn });
    if (sweeping) return;
    sweeping = true;
    addEventListener('scroll', perFrame(sweep), { passive: true });
    addEventListener('resize', sweep);
    // Belt and braces: a cheap poll catches anything a missed scroll event
    // would have stranded (in-page anchors, restored positions, zoom).
    const poll = setInterval(() => {
      sweep();
      if (!watchers.length) { clearInterval(poll); sweeping = false; }
    }, 350);
  }

  function watchReveals(root = document) {
    $$('[data-split]:not([data-split="done"])', root).forEach(splitWords);

    [...$$('[data-reveal]', root), ...$$('[data-split="done"]', root)]
      .filter(el => !el.dataset.revealBound)
      .forEach(el => {
        el.dataset.revealBound = '1';
        onInView(el, e => e.classList.add('is-in'));
      });
  }

  /* ── Cursor ring ───────────────────────────────────────────────────── */

  function initCursor() {
    if (calm || matchMedia('(pointer: coarse)').matches) return;
    const ring = document.createElement('div');
    ring.className = 'cursor';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = null;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      ring.classList.add('is-on');
      const hot = e.target.closest('a, button, input[type="range"], .shot, .glass, .chapter, .fig');
      ring.classList.toggle('is-hot', !!hot);
      if (!raf) loop();
    }, { passive: true });

    addEventListener('pointerleave', () => ring.classList.remove('is-on'));
  }

  /* ── Magnetic buttons ──────────────────────────────────────────────── */

  function initMagnets() {
    if (calm || matchMedia('(pointer: coarse)').matches) return;
    $$('[data-magnet]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ── Intro curtain (home only, once per session) ─────────────────────
     The entrance is all CSS and plays from the first paint. This only
     decides when the cloth lifts: late enough to see the entrance through,
     never before the page behind it has booted, and straight away for
     anyone who clicks or presses a key. The loading line is a fresh draw
     on every visit.                                                      */

  const CURTAIN_MS = 2700;   // earliest lift, counted from the start of the page load
  const CURTAIN_LINES = [
    'Taking the long way round',
    'Detouring for a waterfall',
    'Finding the next brewery',
    'Pouring the first round',
    'Warming up the Skyline Chili',
  ];

  function initCurtain() {
    const curtain = $('.curtain');
    if (!curtain) return;

    let seen = false;
    // ?intro on the address plays it again, for anyone checking how it looks
    try { seen = sessionStorage.getItem('murnan-seen') === '1' && !/[?&]intro\b/.test(location.search); } catch { /* private mode */ }

    if (calm || seen) {
      curtain.remove();
      document.body.classList.add('curtain-done');
      return;
    }

    // Swap the line only while the caption is still hidden, never mid-read.
    const say = $('.curtain__say', curtain);
    if (say && performance.now() < 1200) {
      say.textContent = CURTAIN_LINES[Math.floor(Math.random() * CURTAIN_LINES.length)];
    }

    const root = document.documentElement;
    root.classList.add('is-curtained');
    root.style.overflow = 'hidden';

    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      removeEventListener('keydown', lift);
      curtain.classList.add('is-up');
      root.style.overflow = '';
      document.body.classList.add('curtain-done');
      document.dispatchEvent(new Event('curtain:up'));
      try { sessionStorage.setItem('murnan-seen', '1'); } catch { /* ignore */ }
      // the hero holds its entrance until the cloth is clearing it
      setTimeout(() => root.classList.remove('is-curtained'), 520);
      setTimeout(() => curtain.remove(), 1400);
    };

    setTimeout(lift, Math.max(400, CURTAIN_MS - performance.now()));
    curtain.addEventListener('click', lift);
    addEventListener('keydown', lift);
  }

  /* ── The Pour (hero illustration reveal) ───────────────────────────── */

  function initPour() {
    const stage = $('.stage');
    const range = $('.pour__range');
    const out   = $('.pour__val');
    const word  = $('.pour__word');
    if (!stage || !range) return;

    const set = v => {
      const p = clamp(Math.round(v), 0, 100);
      stage.style.setProperty('--pour', p + '%');
      $$('.pour__rail').forEach(r => r.style.setProperty('--pour', p + '%'));
      if (out) out.textContent = p + '%';
      if (word) word.textContent = p >= 100 ? 'Cheers' : p === 0 ? 'Pour' : 'More';
      range.setAttribute('aria-valuetext', `${p}% poured`);
      stage.classList.toggle('is-pouring', p > 1 && p < 99);
    };

    set(0);
    range.value = 0;
    range.addEventListener('input', () => set(+range.value));

    if (calm) { set(100); range.value = 100; return; }

    // Pour it out once, on its own, the first time the stage is seen.
    let poured = false, grabbed = false;
    const pour = () => {
      if (poured) return;
      poured = true;
      const t0 = performance.now(), dur = 2400;
      let done = false;
      const finish = () => {
        if (done || grabbed) return;
        done = true;
        set(100);
        range.value = 100;
        // Both of them are in colour, which deserves something.
        $$('.fig').forEach((f, i) => setTimeout(() => celebrateFrom(f, 16), i * 160));
      };
      const step = now => {
        if (done || grabbed) return;
        const t = clamp((now - t0) / dur, 0, 1);
        if (t >= 1) return finish();
        const v = (1 - Math.pow(1 - t, 3)) * 100;
        set(v);
        range.value = v;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      // rAF is paused in background tabs; don't strand the art half-coloured.
      setTimeout(finish, dur + 600);
    };

    // The first pour waits for the curtain, so it happens where someone can see it.
    onInView(stage, () => {
      if (document.body.classList.contains('curtain-done')) setTimeout(pour, 450);
      else document.addEventListener('curtain:up', () => setTimeout(pour, 900), { once: true });
    });

    // Dragging it yourself cancels the automatic pour, mid-flight or before it starts.
    range.addEventListener('pointerdown', () => { poured = true; grabbed = true; });
    range.addEventListener('keydown', () => { poured = true; grabbed = true; });
  }

  /* ── Sparks: the gold stars off the logo, thrown in the air ────────── */

  const SPARK_COLOURS = ['#D9BE86', '#B08D50', '#8E3145', '#6E9683', '#9BC0C8', '#E08A2B'];
  const STAR_PATH = 'M12 0c.9 5.6 2.9 8.9 5.5 10.4 1.6.9 3.6 1.3 6.5 1.6-2.9.3-4.9.7-6.5 1.6C14.9 15.1 12.9 18.4 12 24c-.9-5.6-2.9-8.9-5.5-10.4C4.9 12.7 2.9 12.3 0 12c2.9-.3 4.9-.7 6.5-1.6C9.1 8.9 11.1 5.6 12 0Z';

  function celebrate(x, y, count = 24) {
    if (calm) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const size = 7 + Math.random() * 13;
      const angle = Math.random() * Math.PI * 2;
      const power = 60 + Math.random() * 190;

      s.setAttribute('class', 'spark');
      s.setAttribute('viewBox', '0 0 24 24');
      s.setAttribute('width', size);
      s.setAttribute('height', size);
      s.setAttribute('aria-hidden', 'true');
      s.innerHTML = `<path d="${STAR_PATH}" fill="${SPARK_COLOURS[i % SPARK_COLOURS.length]}"/>`;
      s.style.left = (x - size / 2) + 'px';
      s.style.top = (y - size / 2) + 'px';
      s.style.setProperty('--dx', Math.cos(angle) * power + 'px');
      s.style.setProperty('--dy', (Math.sin(angle) * power - 70) + 'px');
      s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      s.style.setProperty('--dur', (950 + Math.random() * 750) + 'ms');

      document.body.appendChild(s);
      const bye = () => s.remove();
      s.addEventListener('animationend', bye);
      setTimeout(bye, 2200);
    }
  }

  function celebrateFrom(el, count) {
    const r = el.getBoundingClientRect();
    celebrate(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  /* ── The two of them have things to say ────────────────────────────── */

  const LINES = {
    bear: [
      "Skyline chili is a food group.",
      "Two flights up the fire tower is plenty, thank you.",
      "Go Reds.",
      "I flew to Seattle for the miles and stayed for the burgers.",
      "Mystic Timbers, three times in a row.",
      "I turned forty at the Grand Canyon, in the snow.",
    ],
    tiger: [
      "First wine tasting, on the North Fork.",
      "I went up the fire tower. David waited at the bottom.",
      "All five Utah parks in one trip.",
      "Eight miles down Bull Hill in the snow, no crampons.",
      "Franklin Barbecue gave me a key lime pie for my birthday.",
      "The second American wedding I went to was my own.",
    ],
  };

  function initChatter() {
    $$('.fig').forEach(fig => {
      const say = $('.fig__say', fig);
      if (!say) return;
      const lines = LINES[fig.dataset.who] || [];
      let i = Math.floor(Math.random() * lines.length);
      let hide = null;

      fig.addEventListener('click', () => {
        say.textContent = lines[i % lines.length];
        i++;
        say.classList.add('is-said');
        fig.classList.add('is-talking');
        if (!calm) {
          fig.classList.remove('is-bouncing');
          void fig.offsetWidth;              // restart the animation
          fig.classList.add('is-bouncing');
          celebrateFrom(say, 10);
        }
        clearTimeout(hide);
        hide = setTimeout(() => {
          say.classList.remove('is-said');
          fig.classList.remove('is-talking');
        }, 4200);
      });
    });
  }

  /* ── The memory machine ────────────────────────────────────────────── */

  /* ── Card scenes ───────────────────────────────────────────────────
     One small illustrated place per look, laid along the foot of the
     memory card, each with something in it that moves: a bear out of a
     bush, a car down the road, the two of us rowing Crater Lake. Drawn
     in ink keylines and flat pastel like the Bear and Tiger art. The
     plain card, with no sticker pressed, gets a rabbit out of the hat. */

  const K = w => `stroke="#14110D" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  // Every ground, hill and water shape is drawn 0 to 600; bleed stretches each
  // one far past both ends, so a scene shown on a card wider than its art
  // still runs edge to edge without scaling up and losing its top.
  const bleed = body => body.replace(/M0 90 V(\d+)/g, 'M-600 90 V$1 H0').replace(/ V90 Z/g, ' H1200 V90 Z');
  const scene = body => `<svg viewBox="0 0 600 90" preserveAspectRatio="xMidYMax meet">${bleed(body)}</svg>`;
  const pine = (x, h) => `<path d="M${x} ${90 - h} L${x - 10} ${90 - h * .5} H${x - 5} L${x - 14} 84 H${x + 14} L${x + 5} ${90 - h * .5} H${x + 10} Z" fill="#4E7A62" ${K(2.5)}/>`;
  const sparkle = (x, y, r, d) => `<path class="sc-twinkle" style="--d:${d}s;fill:var(--brass)" d="M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3} Z"/>`;
  const pear = x => `<ellipse cx="${x - 13}" cy="55" rx="6.5" ry="9" transform="rotate(-25 ${x - 13} 55)" fill="#9FB8A6" ${K(2)}/><ellipse cx="${x + 13}" cy="58" rx="6" ry="8.5" transform="rotate(25 ${x + 13} 58)" fill="#9FB8A6" ${K(2)}/><ellipse cx="${x}" cy="66" rx="10" ry="13" fill="#7FA08A" ${K(2.5)}/><circle cx="${x - 16}" cy="45" r="3.8" fill="#E2604F" ${K(1.6)}/><circle cx="${x}" cy="52" r="3.2" fill="#F0CE84" ${K(1.6)}/>`;
  const dashes = Array.from({ length: 30 }, (_, i) => `M${-590 + i * 60} 81 H${-560 + i * 60}`).join(' ');
  const inkLine = w => `stroke="currentColor" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  const SCENES = {
    plain: scene(`
      ${sparkle(236, 44, 7, 0)}${sparkle(372, 32, 6, 1.1)}${sparkle(398, 66, 5, 2)}${sparkle(206, 72, 4, 1.6)}
      <g class="sc-pop" style="--d:.4s">
        <path d="M291 42 C285 24 285 9 291 7 C297 9 297 25 295 42 Z" style="fill:var(--paper)" ${inkLine(2.5)}/>
        <path d="M309 42 C315 24 315 9 309 7 C303 9 303 25 305 42 Z" style="fill:var(--paper)" ${inkLine(2.5)}/>
        <circle cx="300" cy="50" r="15" style="fill:var(--paper)" ${inkLine(2.5)}/>
        <circle cx="294.5" cy="48" r="1.9" fill="currentColor"/><circle cx="305.5" cy="48" r="1.9" fill="currentColor"/>
        <path d="M298 54 h4 l-2 2.4 z" style="fill:var(--wine)"/>
      </g>
      <path d="M270 56 H330 L334 84 H266 Z" fill="currentColor" ${inkLine(2.5)}/>
      <path d="M268.6 64 H331.4 L332.4 72 H267.6 Z" style="fill:var(--wine)"/>
      <ellipse cx="300" cy="84" rx="48" ry="6" fill="currentColor" ${inkLine(2.5)}/>`),

    dome: scene(`
      <path d="M0 90 V66 C70 58 140 68 210 62 C290 54 360 66 430 60 C500 54 560 64 600 60 V90 Z" fill="#B9CDBF" ${K(2.5)}/>
      <path d="M352 76 V42 C352 26 364 16 380 15 C404 13 424 32 432 54 L438 76 Z" fill="#EDF3F5"/>
      <path d="M352 76 V42 C352 30 358 21 368 17 L369 76 Z" fill="#9FB6C0"/>
      <path d="M352 76 V42 C352 26 364 16 380 15 C404 13 424 32 432 54 L438 76" fill="none" ${K(2.5)}/>
      ${pine(470, 46)}${pine(500, 34)}${pine(530, 42)}
      <g class="sc-glide"><path d="M150 26 q7 -7 14 0 q7 -7 14 0 M186 38 q5 -5 10 0 q5 -5 10 0" fill="none" ${K(2)}/></g>
      <g class="sc-pop" style="--d:1s">
        <ellipse cx="244" cy="70" rx="12" ry="14" fill="#B08A5F" ${K(2.5)}/>
        <circle cx="235" cy="58" r="3.4" fill="#B08A5F" ${K(2)}/><circle cx="253" cy="58" r="3.4" fill="#B08A5F" ${K(2)}/>
        <circle cx="239.5" cy="66" r="1.8" fill="#14110D"/><circle cx="248.5" cy="66" r="1.8" fill="#14110D"/>
        <ellipse cx="244" cy="71" rx="4" ry="3" fill="#F0D89C" ${K(1.6)}/>
      </g>
      <path d="M220 90 C220 78 230 72 244 74 C258 72 270 80 270 90 Z" fill="#C6D1D6" ${K(2.5)}/>
      <path d="M0 90 V82 C100 78 200 86 300 82 C400 78 500 86 600 82 V90 Z" fill="#7FA08A" ${K(2.5)}/>
      ${pine(120, 38)}${pine(150, 50)}`),

    crater: scene(`
      <path d="M0 90 V50 C60 38 120 48 170 42 C230 34 300 46 360 40 C430 32 520 44 600 38 V90 Z" fill="#A9BFB0" ${K(2.5)}/>
      <path d="M400 66 L420 44 L428 50 L436 42 L458 66 Z" fill="#4E7A62" ${K(2.5)}/>
      <g class="sc-jump"><path d="M140 72 c6 -6 14 -6 18 0 c-4 6 -12 6 -18 0 z M158 72 l7 -5 v10 z" fill="#F0CE84" ${K(2)}/></g>
      <path d="M0 90 V64 C100 60 200 68 300 64 C400 60 500 68 600 64 V90 Z" fill="#2A6E91" ${K(2.5)}/>
      <g class="sc-bob">
        <circle cx="246" cy="54" r="6.5" fill="#F0D89C" ${K(2)}/><circle cx="268" cy="54" r="6.5" fill="#14110D" ${K(2)}/>
        <path d="M222 62 H292 L282 76 H232 Z" fill="#E2604F" ${K(2.5)}/>
        <path d="M236 66 L214 82" ${K(2.5)}/>
      </g>
      <path class="sc-sway" d="M40 76 q10 -5 20 0 t20 0 M470 80 q10 -5 20 0 t20 0 M330 84 q8 -4 16 0 t16 0" fill="none" stroke="#CFE6EE" stroke-width="2.5" stroke-linecap="round"/>`),

    canyon: scene(`
      <circle cx="470" cy="48" r="17" fill="#F0CE84" ${K(2.5)}/>
      <path d="M0 90 V50 H60 V42 H140 V54 H220 V40 H300 V50 H380 V46 H460 V58 H540 V46 H600 V90 Z" fill="#E9A57E" ${K(2.5)}/>
      <g class="sc-pop" style="--d:.8s">
        <path d="M312 58 V44 C312 38 316 35 322 35 C328 35 332 38 332 44 V58 Z" fill="#E6CFA8" ${K(2.5)}/>
        <path d="M314 40 C302 38 300 26 310 26 C316 26 316 34 312 34" fill="none" ${K(3)}/>
        <path d="M330 40 C342 38 344 26 334 26 C328 26 328 34 332 34" fill="none" ${K(3)}/>
        <circle cx="318" cy="44" r="1.8" fill="#14110D"/><circle cx="326" cy="44" r="1.8" fill="#14110D"/>
        <ellipse cx="322" cy="52" rx="4" ry="3" fill="#B08A5F" ${K(1.6)}/>
      </g>
      <path d="M0 90 V64 H90 V58 H190 V70 H280 V60 H360 V68 H450 V62 H600 V90 Z" fill="#E2604F" ${K(2.5)}/>
      <path d="M0 90 V82 C80 76 160 86 250 80 C340 74 420 86 600 80 V90 Z" fill="#5E9BB4" ${K(2.5)}/>
      <g class="sc-glide"><path d="M110 24 q8 -8 16 0 q8 -8 16 0" fill="none" ${K(2.2)}/></g>`),

    bear: scene(`
      <path d="M0 90 V58 C30 42 60 54 80 46 C110 34 140 56 170 48 C220 36 260 54 300 46 C350 36 400 56 440 48 C480 40 540 54 600 46 V90 Z" fill="#9FB8A6" ${K(2.5)}/>
      <path d="M0 90 V78 C150 74 300 82 450 76 C520 74 560 78 600 76 V90 Z" fill="#B49C6C" ${K(2.5)}/>
      <path d="M442 80 C434 68 438 58 446 56 H476 C484 58 488 68 480 80 Z" fill="#F0CE84" ${K(2.5)}/>
      <path d="M444 56 H478" ${K(3)}/>
      <path d="M456 60 C456 67 451 67 451 62" fill="none" stroke="#C98A2B" stroke-width="2.5" stroke-linecap="round"/>
      <g class="sc-buzz" style="--d:0s"><ellipse cx="496" cy="40" rx="4.5" ry="3.4" fill="#F0CE84" ${K(1.6)}/><path d="M494 36 q2 -5 5 -1" fill="#FFFFFF" ${K(1.4)}/></g>
      <g class="sc-buzz" style="--d:1.1s"><ellipse cx="424" cy="34" rx="4.5" ry="3.4" fill="#F0CE84" ${K(1.6)}/><path d="M422 30 q2 -5 5 -1" fill="#FFFFFF" ${K(1.4)}/></g>
      <g class="sc-pop" style="--d:.5s">
        <circle cx="266" cy="48" r="6.5" fill="#B08A5F" ${K(2.2)}/><circle cx="294" cy="48" r="6.5" fill="#B08A5F" ${K(2.2)}/>
        <circle cx="280" cy="62" r="17" fill="#B08A5F" ${K(2.5)}/>
        <ellipse cx="280" cy="68" rx="8.5" ry="6.5" fill="#F0D89C" ${K(2)}/>
        <circle cx="273.5" cy="58" r="2" fill="#14110D"/><circle cx="286.5" cy="58" r="2" fill="#14110D"/>
        <ellipse cx="280" cy="65" rx="3" ry="2.2" fill="#14110D"/>
      </g>
      <path d="M238 90 C234 76 246 68 258 72 C264 62 284 62 290 70 C302 64 320 72 318 90 Z" fill="#4E7A62" ${K(2.5)}/>`),

    light: scene(`
      <path d="M0 90 V56 C80 46 160 58 240 50 C330 42 420 56 600 48 V90 Z" fill="#3E7A5A" ${K(2.5)}/>
      <path d="M0 90 V70 H600 V90 Z" fill="#D9D5C9" ${K(2.5)}/>
      <path d="${dashes}" stroke="#F0CE84" stroke-width="3" stroke-linecap="round"/>
      <path d="M112 70 V38" ${K(3)}/>
      <rect x="94" y="22" width="36" height="18" rx="3" fill="#F0CE84" ${K(2.5)}/>
      <path d="M103 31 H120 M115 26.5 L120 31 L115 35.5" fill="none" ${K(2.2)}/>
      <g class="sc-drive">
        <path d="M0 66 V60 L10 58 L19 49 H45 L53 58 L63 60 V66 Z" fill="#E2604F" ${K(2.5)}/>
        <path d="M23 52 H41 L46 58 H18 Z" fill="#C3DEE8" ${K(2)}/>
        <circle cx="16" cy="67" r="5.5" fill="#14110D"/><circle cx="48" cy="67" r="5.5" fill="#14110D"/>
      </g>`),

    smoky: scene(`
      <path d="M0 90 V42 C60 28 110 44 170 34 C240 22 300 42 360 32 C430 20 500 40 600 30 V90 Z" fill="#B8CCD3" ${K(2.5)}/>
      <path class="sc-sway" d="M-40 56 C40 50 120 58 200 53 C280 48 360 58 440 53 C520 48 600 56 680 52" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-opacity=".75" stroke-linecap="round"/>
      <path d="M0 90 V62 C70 52 140 66 210 58 C290 48 360 64 430 56 C500 48 560 60 600 56 V90 Z" fill="#7F9DAA" ${K(2.5)}/>
      <path d="M0 90 V80 C100 74 200 84 300 78 C400 72 500 84 600 78 V90 Z" fill="#3F6B52" ${K(2.5)}/>
      <circle class="sc-puff" style="--d:0s" cx="435" cy="50" r="5" fill="#EEF3F4" ${K(1.5)}/>
      <circle class="sc-puff" style="--d:1s" cx="435" cy="50" r="5" fill="#EEF3F4" ${K(1.5)}/>
      <circle class="sc-puff" style="--d:2s" cx="435" cy="50" r="5" fill="#EEF3F4" ${K(1.5)}/>
      <rect x="431" y="54" width="7" height="12" fill="#A03A50" ${K(2)}/>
      <path d="M400 84 V70 L420 56 L440 70 V84 Z" fill="#B49C6C" ${K(2.5)}/>
      <rect x="414" y="72" width="11" height="12" fill="#7A5B40" ${K(2)}/>
      ${[[140, 70, 0], [182, 64, .7], [250, 74, 1.4], [300, 66, .3], [520, 72, 1.1], [566, 66, 1.8]].map(([x, y, d]) => `<g class="sc-twinkle" style="--d:${d}s"><circle cx="${x}" cy="${y}" r="7" fill="#F4D060" fill-opacity=".38"/><circle cx="${x}" cy="${y}" r="2.6" fill="#F4C443"/></g>`).join('')}`),

    dunes: scene(`
      <circle cx="150" cy="42" r="19" fill="#E2604F" ${K(2.5)}/>
      <path d="M0 90 V56 C80 40 160 62 250 52 C340 42 420 60 600 48 V90 Z" fill="#E6B877" ${K(2.5)}/>
      <g class="sc-pop" style="--d:1.2s">
        <path d="M344 72 C348 62 364 58 376 62 C386 64 392 68 390 74 H344 Z" fill="#9FB8A6" ${K(2.5)}/>
        <circle cx="380" cy="64.5" r="1.9" fill="#14110D"/>
        <path d="M388 68 h4" ${K(1.6)}/>
      </g>
      <path d="M0 90 V74 C90 62 180 80 280 70 C380 60 470 80 600 68 V90 Z" fill="#C98B4E" ${K(2.5)}/>
      <path d="M492 72 c-6 -10 4 -15 9 -8 c2 -9 13 -7 11 2 c9 -2 11 9 2 11 Z" fill="#7FA08A" ${K(2)}/>
      <g class="sc-roll"><circle cx="0" cy="76" r="9" fill="none" ${K(2)}/><path d="M-6 70 L6 82 M-8 78 L8 74 M-2 67 L2 85" fill="none" ${K(1.6)}/></g>`),

    stacks: scene(`
      <g class="sc-glide"><path d="M190 24 q7 -7 14 0 q7 -7 14 0" fill="none" ${K(2.2)}/></g>
      <path d="M400 78 V46 C400 38 406 34 412 34 C418 34 424 38 424 46 V78 Z" fill="#5A7A6E" ${K(2.5)}/>
      <path d="M440 78 V36 C440 26 448 20 456 20 C464 20 472 26 472 36 V78 Z" fill="#415C52" ${K(2.5)}/>
      <path d="M494 78 V52 C494 46 499 42 504 42 C509 42 514 46 514 52 V78 Z" fill="#5A7A6E" ${K(2.5)}/>
      <path d="M452 20 l4 -9 l4 9 M408 34 l4 -8 l4 8" fill="#4E7A62" ${K(1.8)}/>
      <g class="sc-pop" style="--d:.9s">
        <path d="M234 80 C234 64 242 57 253 57 C264 57 270 64 270 72 C270 77 266 80 262 80 Z" fill="#8FA9B6" ${K(2.5)}/>
        <circle cx="259" cy="66" r="1.9" fill="#14110D"/>
        <ellipse cx="268" cy="71" rx="2.4" ry="1.8" fill="#14110D"/>
        <path d="M266 74 l10 -1 M266 76 l10 2" fill="none" ${K(1.2)}/>
      </g>
      <path d="M0 90 V74 C50 70 100 78 150 74 C200 70 250 78 300 74 C350 70 400 78 450 74 C500 70 550 78 600 74 V90 Z" fill="#5E9BB4" ${K(2.5)}/>
      <path class="sc-sway" d="M60 82 q8 -4 16 0 t16 0 M330 84 q8 -4 16 0 t16 0 M530 82 q8 -4 16 0 t16 0" fill="none" stroke="#F1F8F9" stroke-width="2.5" stroke-linecap="round"/>`),

    elk: scene(`
      <path d="M0 90 V60 L70 32 L120 52 L190 22 L260 54 L330 36 L400 58 L470 28 L540 50 L600 38 V90 Z" fill="#B9CDBF" ${K(2.5)}/>
      <g class="sc-graze">
        <g fill="none" ${K(3)}><path d="M296 46 C290 36 288 28 290 20 M296 46 C288 40 282 38 276 40 M296 46 C290 42 284 44 280 48"/><path d="M320 46 C326 36 328 28 326 20 M320 46 C328 40 334 38 340 40 M320 46 C326 42 332 44 336 48"/></g>
        <ellipse cx="289" cy="52" rx="6" ry="3.6" transform="rotate(-25 289 52)" fill="#C4A278" ${K(2)}/>
        <ellipse cx="327" cy="52" rx="6" ry="3.6" transform="rotate(25 327 52)" fill="#C4A278" ${K(2)}/>
        <path d="M308 44 C316 44 320 50 320 58 C320 68 316 74 313 80 H303 C300 74 296 68 296 58 C296 50 300 44 308 44 Z" fill="#A98358" ${K(2.5)}/>
        <circle cx="302.5" cy="55" r="1.9" fill="#14110D"/><circle cx="313.5" cy="55" r="1.9" fill="#14110D"/>
        <ellipse cx="308" cy="75" rx="4" ry="3" fill="#7A5B40" ${K(1.6)}/>
      </g>
      <path d="M0 90 V70 C60 64 120 72 180 68 C260 62 340 72 420 66 C500 60 560 70 600 66 V90 Z" fill="#7FA08A" ${K(2.5)}/>
      <path d="M120 70 l4 -10 l2 10 l4 -8 l2 8 M470 67 l4 -10 l2 10 l4 -8 l2 8 M226 70 l3 -8 l2 8 l3 -7 l2 7" fill="none" stroke="#4E7A62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <g class="sc-glide"><g class="sc-flutter"><path d="M180 40 c-8 -8 -12 2 -2 4 c-10 2 -6 12 2 4 c8 8 12 -2 2 -4 c10 -2 6 -12 -2 -4 z" fill="#F0CE84" ${K(1.5)}/></g></g>`),

    cactus: scene(`
      <path d="M0 90 V54 L60 40 L90 50 L150 24 L200 46 L250 36 L310 52 L380 30 L430 48 L500 38 L600 52 V90 Z" fill="#E6CBC6" ${K(2.5)}/>
      <path d="M0 90 V76 C100 72 200 80 300 76 C400 72 500 80 600 76 V90 Z" fill="#E6B877" ${K(2.5)}/>
      ${pear(130)}${pear(480)}
      <g class="sc-run"><g class="sc-hop">
        <path d="M2 64 L-14 54" fill="none" ${K(3)}/>
        <path d="M14 70 l-3 8 M22 70 l4 8" fill="none" ${K(2)}/>
        <path d="M0 64 C6 56 18 54 28 58 L40 50 L43 54 L33 62 C31 68 23 72 12 70 Z" fill="#B49C6C" ${K(2.5)}/>
        <path d="M27 56 l2 -8 l3 6 l3 -6 l1 8" fill="none" ${K(1.6)}/>
        <circle cx="37" cy="53" r="1.6" fill="#14110D"/>
        <path d="M42 51 l9 -2 -7 5 z" fill="#14110D"/>
      </g></g>`),
  };

  // A postmark has to agree with the title printed under it. `short` is
  // tidier, but a few were written as nicknames ("Montauk", "LA") that
  // never appear in the title, so use it only when every word of it does;
  // otherwise take the title up to its first comma.
  function stampName(c) {
    const words = str => String(str || '').toLowerCase().match(/[a-z0-9]+/g) || [];
    const skip = new Set(['the', 'and', 'of', 'in', 'a']);
    const inTitle = new Set(words(c.place));
    const agrees = c.short && words(c.short).every(w => skip.has(w) || inTitle.has(w));
    return agrees ? c.short : String(c.place).split(',')[0].trim();
  }

  /* ── The year pages' trips, for the memory machine ─────────────────────
     Each assets/js/years/2023.js sets window.MW_YEAR, so once the home page
     has settled they are loaded one at a time and each year's trips are
     copied out before the next file replaces it. A plain script tag, so it
     works off the disk too. A trip joins the hat once its month has a photo. */

  const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
    'august', 'september', 'october', 'november', 'december'];

  function yearTrips(Y) {
    // a folder or caption can say "cincy" where the trip says Cincinnati
    const ALIAS = { cincinnati: 'cincy', philadelphia: 'philly', washington: 'dc' };
    const SKIP = new Set(['with', 'from', 'home', 'long', 'this', 'that', 'trip']);
    const words = place => (String(place).toLowerCase().match(/[a-z]{4,}/g) || [])
      .filter(w => !SKIP.has(w))
      .flatMap(w => ALIAS[w] ? [w, ALIAS[w]] : [w]);
    const out = [];

    (Y.months || []).forEach(m => {
      const shots = (m.photos || []).filter(p => p.src).map(p => ({
        url: 'assets/' + (p.src.includes('/') ? p.src : `photos/${Y.year}/${p.src}`),
        pos: p.pos,
        hay: `${p.cap || ''}`.toLowerCase(),
        path: p.src.toLowerCase(),
      }));
      if (!shots.length) return;

      // With several trips in a month, each takes the photographs whose
      // caption names one of its places, plus any uncaptioned match from a
      // folder named after one; a trip that matches none takes what's left.
      const single = m.trips.length === 1;
      const byCap = m.trips.map(t => single ? shots : shots.filter(s => words(t.place).some(x => s.hay.includes(x))));
      const named = new Set(byCap.flat());
      const claims = m.trips.map((t, k) => single ? shots : [...byCap[k],
        ...shots.filter(s => !named.has(s) && words(t.place).some(x => s.path.includes(x)))]);
      const taken = new Set(claims.flat());
      const left = shots.filter(s => !taken.has(s));

      m.trips.forEach((t, k) => {
        const text = [].concat(t.text)[0];
        const pics = claims[k].length ? claims[k] : (left.length ? left : shots);
        if (!text) return;
        out.push({
          date: /\d{4}/.test(t.dates) ? t.dates : `${t.dates}, ${Y.year}`,
          place: t.place,
          short: String(t.place).split(/[,:&]| to /)[0].trim(),
          text,
          year: Y.year,
          pics,
          href: `${Y.year}.html#${MONTH_NAMES[m.month - 1]}`,
          go: `Read it in ${Y.year}`,
        });
      });
    });
    return out;
  }

  function loadYearTrips(add) {
    const years = (window.MW_YEARS || []).map(y => y.year);
    const next = () => {
      const year = years.shift();
      if (!year) return;
      const s = document.createElement('script');
      s.src = `assets/js/years/${year}.js`;
      s.onload = () => {
        if (window.MW_YEAR && window.MW_YEAR.year === year) add(yearTrips(window.MW_YEAR));
        window.MW_YEAR = undefined;
        next();
      };
      s.onerror = next;
      document.body.appendChild(s);
    };
    const start = () => ('requestIdleCallback' in window
      ? requestIdleCallback(next, { timeout: 2500 })
      : setTimeout(next, 1200));
    if (document.readyState === 'complete') start();
    else addEventListener('load', start, { once: true });
  }

  function initMemory() {
    const btn = $('#memory-btn');
    const card = $('#memory-card');
    if (!btn || !card || !window.MW) return;

    // the scene for whatever the card is wearing; innerHTML swaps wipe it,
    // so every deal paints it again
    const paintScene = () => {
      let host = $('.memory__scene', card);
      if (!host) {
        host = document.createElement('div');
        host.className = 'memory__scene';
        host.setAttribute('aria-hidden', 'true');
        card.appendChild(host);
      }
      host.innerHTML = SCENES[card.dataset.look] || SCENES.plain;
      host.classList.remove('is-new');
      void host.offsetWidth;
      host.classList.add('is-new');
    };
    paintScene();

    // Volume one's chapters, then every trip on the year pages as it loads
    const pool = window.MW.timeline
      .map((c, i) => ({
        ...c,
        pics: (c.photos || []).map(p => ({ url: `assets/photos/${p}` })),
        href: `story.html#chap-${i + 1}`,
        go: 'Read the whole chapter',
      }))
      .filter(c => c.pics.length);
    loadYearTrips(trips => pool.push(...trips));
    let last = -1;

    // the card is a second, larger target for the same action, dealt or not.
    // The chapter link inside a dealt card keeps its own job.
    card.addEventListener('click', e => {
      if (e.target.closest('a, button')) return;
      btn.click();
    });

    const stickers = $$('.dsticker[data-look]');

    // Every pull comes with a card style. The button and the card pick one at
    // random from the stickers on the shelf, never the style just shown, so
    // the lit sticker always explains what the card is wearing.
    const pickLook = () => {
      const onShelf = stickers.filter(st => !st.hidden).map(st => st.dataset.look);
      const fresh = onShelf.filter(look => look !== card.dataset.look);
      const from = fresh.length ? fresh : onShelf;
      return from.length ? from[Math.floor(Math.random() * from.length)] : undefined;
    };

    const deal = look => {
      let n = Math.floor(Math.random() * pool.length);
      if (pool.length > 1) while (n === last) n = Math.floor(Math.random() * pool.length);
      last = n;

      const c = pool[n];
      const photo = c.pics[Math.floor(Math.random() * c.pics.length)];
      const pos = photo.pos ? ` style="object-position:${esc(photo.pos)}"` : '';

      card.innerHTML = `
        <div class="memory__pic"><img src="${esc(photo.url)}" alt="${esc(c.place)}, ${esc(c.date)}"${pos} decoding="async"></div>
        <div class="memory__body">
          <span class="memory__date">${esc(c.date)}</span>
          <h3 class="memory__place">${esc(c.place)}</h3>
          <p class="memory__text">${esc(c.text)}</p>
          <a class="memory__go" href="${esc(c.href)}">${esc(c.go)} &rarr;</a>
        </div>`;
      // the postmark on a dressed card names this memory, not the sticker
      card.dataset.stamp = `${stampName(c)} · ${c.year}`;
      if (look) card.dataset.look = look;
      else delete card.dataset.look;
      stickers.forEach(st => st.setAttribute('aria-pressed', String(st.dataset.look === look)));
      card.classList.remove('is-empty', 'is-dealt', 'is-restyled');
      void card.offsetWidth;
      card.classList.add('is-dealt');
      paintScene();

      btn.lastElementChild.textContent = 'Another one';
      card.title = 'Click for another';
    };

    btn.addEventListener('click', () => {
      deal(pickLook());
      if (!calm) celebrateFrom(btn, 14);
    });

    // A sticker is a pull too, in its own style: a new memory dressed as that
    // park. Pressing the lit one again gives another memory in the same style.
    stickers.forEach(st => st.addEventListener('click', () => {
      deal(st.dataset.look);
      if (!calm) celebrateFrom(st, 10);
    }));
  }

  /* ── Embeds ────────────────────────────────────────────────────────
     A poster facade rather than a cold iframe: the thumbnail is always
     visible, YouTube loads nothing until someone presses play, and a page
     opened straight off the disk (where YouTube refuses to embed at all)
     still shows the still and opens the film in a new tab.               */

  function initEmbeds() {
    $$('.tube[data-video]').forEach(tube => {
      const id = tube.dataset.video;
      const btn = $('.tube__poster', tube);
      if (!id || !btn) return;

      btn.setAttribute('aria-label', `Play: ${tube.dataset.title || 'video'}`);

      // The page ships sddefault, which every upload has. We deliberately do
      // not probe for maxresdefault: most videos lack it, and the failed
      // request logs a 404 in everyone's console for no gain.
      const img = $('img', btn);
      if (img) img.addEventListener('error', () => {
        img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }, { once: true });

      btn.addEventListener('click', () => {
        if (location.protocol === 'file:') {
          window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener');
          return;
        }
        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
        frame.title = tube.dataset.title || 'Video';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.allowFullscreen = true;
        tube.replaceChildren(frame);
      });
    });
  }

  /* ── Ticker (duplicate the row so the loop is seamless) ────────────── */

  function initTicker() {
    $$('.ticker__row').forEach(row => {
      row.append(...[...row.children].map(c => {
        const clone = c.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        return clone;
      }));
    });
  }

  /* ── Timeline ──────────────────────────────────────────────────────── */

  function initTimeline() {
    const host = $('#timeline');
    if (!host || !window.MW) return;
    const items = window.MW.timeline;

    host.innerHTML = items.map((c, i) => `
      <article class="chap" id="chap-${i + 1}" data-year="${c.year}" data-chap="${i}">
        <div class="chap__aside">
          <span class="chap__dot" aria-hidden="true"></span>
          <div class="chap__sticky">
            <span class="chap__date">${c.date}</span>
          </div>
        </div>
        <div class="chap__body">
          <h2 class="chap__place" data-reveal="up">${esc(c.place)}</h2>
          <p class="chap__text" data-reveal="up" style="--d:90ms">${esc(c.text)}</p>
          ${c.photos.length ? `<div class="strip" data-n="${c.photos.length}" data-reveal="wipe" style="--d:150ms">${
            c.photos.map((p, k) => `
              <figure class="shot" data-shot data-src="assets/photos/${p}" data-cap="${esc(c.place)} · ${esc(c.date)}" tabindex="0" role="button" aria-label="Enlarge photograph ${k + 1} from ${esc(c.place)}">
                <img src="assets/photos/${p}" alt="${esc(c.place)}, ${esc(c.date)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async">
              </figure>`).join('')
          }</div>` : ''}
        </div>
      </article>`).join('') + `
      <article class="chap chap--open" data-year="${items[items.length - 1].year}">
        <div class="chap__aside">
          <span class="chap__dot chap__dot--open" aria-hidden="true"></span>
          <div class="chap__sticky">
            <span class="chap__date">To be continued</span>
          </div>
        </div>
        <div class="chap__body">
          <h2 class="chap__place" data-reveal="up">The honeymoon, and every year since.</h2>
          <p class="chap__text" data-reveal="up" style="--d:90ms">Volume One stops the week before the wedding, because that is where the old
          site stopped. Volume Two picks up two days after it, with the honeymoon from Sacramento to Seattle,
          then a page for every year since.</p>
          <div data-reveal="up" style="--d:150ms"><a class="btn btn--ghost" href="2022.html" data-magnet>Start with the honeymoon</a></div>
        </div>
      </article>`;

    // spine progress + which chapter is live + which year is showing
    const spine = $('.timeline__spine');
    const chaps = $$('.chap', host);
    const yearBtns = $$('.yearbtn');
    let lastLive = null;

    const tick = () => {
      const box = host.getBoundingClientRect();
      const top = innerHeight * 0.6, bottom = innerHeight * 0.25;
      const rects = chaps.map(ch => ch.getBoundingClientRect());

      const pct = clamp((innerHeight * 0.5 - box.top) / box.height, 0, 1);
      if (spine) spine.style.setProperty('--spine', (pct * 100).toFixed(2) + '%');

      let live = null;
      chaps.forEach((ch, i) => {
        const on = rects[i].top < top && rects[i].bottom > bottom;
        ch.classList.toggle('is-in', on);
        if (on && !live) live = ch;
      });
      if (live) {
        const y = live.dataset.year;
        yearBtns.forEach(b => b.classList.toggle('is-on', b.dataset.year === y));
      }
      // the map beside the chapters follows whichever one is being read
      if (live !== lastLive) {
        lastLive = live;
        document.dispatchEvent(new CustomEvent('story:chapter', { detail: live }));
      }
    };

    tick();
    addEventListener('scroll', perFrame(tick), { passive: true });
    addEventListener('resize', tick);

    yearBtns.forEach(btn => btn.addEventListener('click', () => {
      const first = chaps.find(c => c.dataset.year === btn.dataset.year);
      if (first) {
        const top = first.getBoundingClientRect().top + scrollY - 120;
        scrollTo({ top, behavior: calm ? 'auto' : 'smooth' });
      }
    }));

    watchReveals(host);
    initStoryMap(items, chaps);
  }

  /* ── The map beside the chapters ───────────────────────────────────────
     The same component the year pages use, fed the chapters instead of the
     months. A chapter's stops are looked up by its place in the text, in
     assets/js/story-places.js. */

  function initStoryMap(items, chaps) {
    const host = $('#storymap');
    const A = window.MW_ATLAS, PL = window.MW_STORY_PLACES;
    if (!host || !A || !PL || !window.MW_TRAILMAP) return;

    const groups = items.map(c => ({ stops: PL[c.place] || [] }));
    if (!groups.some(g => g.stops.length)) return;
    // "June 10, 2021" reads "June 2021" over the map
    const when = i => (items[i].date || '').replace(/\s\d{1,2},/, '');

    window.MW_TRAILMAP({
      host,
      wrap: host.closest('.ymap'),
      band: host.closest('.ymap__map'),
      bar: $('.yearbar'),
      atlas: A,
      groups,
      chapters: chaps,
      groupOf: el => (el && el.dataset.chap != null ? Number(el.dataset.chap) : -1),
      caption: (i, said, n) => items[i]
        ? { k: when(i), title: said || items[i].short }
        : { k: 'Volume One', title: `${n} places` },
      aria: 'Map of the chapters before the wedding',
      whole: 'Whole volume',
      sheet: { k: 'Volume One', title: 'Everywhere, before the wedding' },
      event: 'story:chapter'
    });
  }

  /* ── Tables (the nine favourites) ──────────────────────────────────── */

  function initTables() {
    const host = $('#tables');
    if (!host || !window.MW) return;

    host.innerHTML = window.MW.tables.map((r, i) => `
      <article class="table-card" data-reveal="up" style="--d:${i * 70}ms" data-tilt>
        <div class="table-card__pic${r.photo ? '' : ' table-card__pic--empty'}">
          ${r.photo
            ? `<img src="assets/photos/${r.photo}" alt="${esc(r.name)}" loading="lazy" decoding="async">`
            : `<svg viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M38,38 H82 L77,96 H43 Z"/><path d="M35,38 H85"/><path d="M41,96 H79"/>
                 <path d="M82,48 h9a8,8 0 0 1 8,8v10a8,8 0 0 1 -8,8h-6"/>
               </g></svg>
               <span class="table-card__soon">Photo to come</span>`}
          <span class="table-card__no">${String(i + 1).padStart(2, '0')}</span>
        </div>
        <div class="table-card__body">
          <span class="table-card__meta">${esc(r.meta)}</span>
          <h3 class="table-card__name">${esc(r.name)}</h3>
          <p class="table-card__note">${esc(r.note)}</p>
          <p class="table-card__addr">${esc(r.address)}</p>
          ${r.map ? `<a class="table-card__go" href="${r.map}" target="_blank" rel="noopener">Take me here
            <svg width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true"><path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" stroke-width="1.2"/></svg></a>` : ''}
        </div>
      </article>`).join('');

    watchReveals(host);
    initTilt(host);
  }

  function initTilt(root = document) {
    if (calm || matchMedia('(pointer: coarse)').matches) return;
    $$('[data-tilt]', root).forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        card.style.transform = `perspective(900px) rotateX(${-dy * 2.6}deg) rotateY(${dx * 2.6}deg) translateY(-5px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ── Glasses: tap to pour on touch, hover does it on desktop ───────── */

  function initGlasses() {
    $$('.glass').forEach(g => {
      g.addEventListener('click', () => g.classList.toggle('is-full'));
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.classList.toggle('is-full'); }
      });
    });
  }

  /* ── Lightbox ──────────────────────────────────────────────────────── */

  function initLightbox() {
    const shots = $$('[data-shot]');
    if (!shots.length) return;

    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <img class="lightbox__img" alt="">
      <p class="lightbox__cap"></p>
      <button class="lightbox__x" aria-label="Close">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true"><path d="M1 1l15 15M16 1L1 16" stroke="currentColor" stroke-width="1.3"/></svg>
      </button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous photograph">
        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden="true"><path d="M10 1L2 9l8 8" stroke="currentColor" stroke-width="1.3"/></svg>
      </button>
      <button class="lightbox__nav lightbox__nav--next" aria-label="Next photograph">
        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden="true"><path d="M1 1l8 8-8 8" stroke="currentColor" stroke-width="1.3"/></svg>
      </button>`;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photograph');
    document.body.appendChild(box);

    const img = $('.lightbox__img', box);
    const cap = $('.lightbox__cap', box);
    let idx = 0, opener = null;

    const show = i => {
      idx = (i + shots.length) % shots.length;
      const s = shots[idx];
      img.src = s.dataset.src;
      img.alt = s.dataset.cap || '';
      cap.textContent = `${s.dataset.cap || ''}  ·  ${idx + 1} / ${shots.length}`;
    };

    const open = i => {
      opener = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      $('.lightbox__x', box).focus();
    };

    const close = () => {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (opener) opener.focus();
    };

    shots.forEach((s, i) => {
      s.addEventListener('click', () => open(i));
      s.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    $('.lightbox__x', box).addEventListener('click', close);
    $('.lightbox__nav--prev', box).addEventListener('click', () => show(idx - 1));
    $('.lightbox__nav--next', box).addEventListener('click', () => show(idx + 1));
    box.addEventListener('click', e => { if (e.target === box || e.target === img) close(); });

    addEventListener('keydown', e => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ── Speeches ──────────────────────────────────────────────────────
     A bubble shows one line until it is clicked, then grows in place to
     the full speech. The height is tweened on the paragraph (the bubble's
     tail and tag sit outside it, so they are never clipped). Closing fades
     the extra words first, then shrinks.                                 */

  function initSpeeches() {
    const list = $('.speeches');
    if (!list) return;
    list.classList.add('is-ready');

    const ease = 'cubic-bezier(.22, 1, .36, 1)';

    $$('.speech__text', list).forEach(bubble => {
      const words = $('.speech__words', bubble);
      const btn = $('.speech__more', bubble);
      let run = 0;

      const grow = from => {
        const to = words.offsetHeight;
        if (calm || from === to) return;
        words.style.overflow = 'clip';
        words.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 560, easing: ease })
          .finished.then(() => { words.style.overflow = ''; }, () => {});
      };

      const set = async on => {
        const token = ++run;
        words.getAnimations().forEach(a => a.cancel());
        const from = words.offsetHeight;
        btn.setAttribute('aria-expanded', String(on));
        btn.textContent = on ? 'Show less' : 'Full speech';

        if (!on && !calm) {
          const fades = $$('.speech__rest', words).map(r => r.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }));
          await Promise.all(fades.map(f => f.finished.catch(() => {})));
          fades.forEach(f => f.cancel());
          if (token !== run) return;
        }
        bubble.classList.toggle('is-open', on);
        grow(from);
      };

      bubble.addEventListener('click', () => {
        if (String(getSelection()).length) return;      // let people copy a line
        set(!bubble.classList.contains('is-open'));
      });
    });
  }

  /* ── Stickers ──────────────────────────────────────────────────────
     Ten of them in the markup, five on the page. Which five is a fresh
     draw on every load, so the shelf is never quite the same twice. The
     tilt and stagger are dealt by position rather than by sticker, so
     whichever five turn up the row still reads as a row.               */

  const SHOW_STICKERS = 5;

  function initStickers() {
    const host = $('.stickers');
    if (!host) return;
    const all = $$('.dsticker', host);
    if (all.length <= SHOW_STICKERS) return;

    const tilt = [-7, 6, -3, 8, -5];
    const lift = [12, -15, 0, -13, 9];   // + sits high, - hangs low

    const deck = all.slice();
    for (let i = deck.length - 1; i > 0; i--) {           // Fisher-Yates
      const k = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[k]] = [deck[k], deck[i]];
    }
    const shown = deck.slice(0, SHOW_STICKERS);

    all.forEach(el => { el.hidden = true; });
    shown.forEach((el, i) => {
      el.hidden = false;
      el.style.setProperty('--rot', tilt[i] + 'deg');
      el.style.setProperty('--bob', (-i * 1.35) + 's');
      el.style.marginTop = Math.max(0, -lift[i]) + 'px';
      el.style.marginBottom = Math.max(0, lift[i]) + 'px';
      host.appendChild(el);                                // into drawn order
    });
  }

  /* ── Who: three photographs of the two of us ───────────────────────
     The pool is every date-named photograph in the archive (20201225-01,
     21041801, 202204beacon01 and on) that has both of us in it. A deal is
     three: never two from the same place, and none from the places that
     were on the table last, so a refresh always brings a new pile. Clicking any
     empty spot in the section deals again: the prints gather into a stack
     in the middle and get thrown back out with new photographs on them.  */

  const SNAPS = 3;
  const SNAPS_KEY = 'murnan-snaps';

  // Date-named, but not of the two of us: scenery, food, the light shows,
  // one of us on our own, or a crowd too big to find us in.
  const NOT_US = new Set([
    '20201225-03.jpg',
    '21050902.jpg', '21052601.jpg', '21052603.jpg', '21061001.jpg', '21062602.jpg',
    '21072401.jpg', '21072402.jpg', '21072403.jpg', '21080101.jpg', '21080102.jpg',
    '21101603.jpg', '21112503.jpg', '21120801.jpg', '21121803.jpg', '21122501.jpg',
    '21122502.jpg',
    '202205beacon02.jpg', '202205beacon03.jpg', '202205cincy03.jpg',
  ]);

  // Only the empty space shuffles, so the words stay selectable and the
  // prints stay draggable: the section's own margins, the gaps around the
  // words and between the prints, and the hint.
  const SNAPS_BLANK = '.who, .shell, .sec-head, .sec-head__body, .who__grid, .stack, .snaps, .snaps__hint';

  function initSnaps() {
    const host = $('#snaps');
    if (!host || !window.MW) return;

    const pool = [];
    window.MW.timeline.forEach(c => c.photos.forEach(p => {
      if (/^2\d/.test(p) && !NOT_US.has(p)) pool.push({ p, c });
    }));
    if (!pool.length) return;

    // Shuffle, then deal by both rules. Should the pool ever run too thin
    // for that, the second pass tops the pile up from whatever is left.
    const pick = () => {
      const deck = pool.slice();
      for (let i = deck.length - 1; i > 0; i--) {           // Fisher-Yates
        const k = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[k]] = [deck[k], deck[i]];
      }
      // Places rather than chapters, since Beacon and Cincinnati each fill
      // several. The rule starts out holding whatever was on the table last,
      // so a caption never comes straight back looking like nothing changed.
      const last = new Set((store.get(SNAPS_KEY) || '').split(','));
      const places = new Set(pool.filter(s => last.has(s.p)).map(where));
      const dealt = [];
      for (const s of deck) {
        if (dealt.length === SNAPS) break;
        if (places.has(where(s))) continue;
        dealt.push(s);
        places.add(where(s));
      }
      for (const s of deck) {
        if (dealt.length === SNAPS) break;
        if (!dealt.includes(s)) dealt.push(s);
      }
      store.set(SNAPS_KEY, dealt.map(s => s.p).join(','));
      return dealt;
    };

    const photo = s => `assets/photos/${s.p}`;
    const where = s => s.c.short || s.c.place;
    const when = s => s.c.date.replace(/\s+\d{1,2},/, '');

    // Loose only under a mouse. On touch a frame that caught the finger
    // would stop the page scrolling, so there the prints simply lie still.
    const loose = matchMedia('(pointer: fine)').matches;
    host.classList.add('is-swapping');      // the first stack is laid down, not gathered
    host.innerHTML = pick().map(s => `
      <figure class="snap"${loose ? ' data-drag' : ''}>
        <img src="${photo(s)}" alt="David and Yinja" loading="lazy" decoding="async" draggable="false">
        <figcaption class="snap__cap">
          <span class="snap__where">${esc(where(s))}</span>
          <span class="snap__when">${esc(when(s))}</span>
        </figcaption>
      </figure>`).join('') + `
      <span class="snaps__hint" aria-hidden="true">Click to shuffle, drag to move</span>`;
    const prints = $$('.snap', host);

    // Whichever one gets picked up lands on top of the pile, and stays there.
    let top = SNAPS;
    prints.forEach(el => el.addEventListener('pointerdown', () => { el.style.zIndex = ++top; }));

    // How far each print travels to reach the stack in the middle, counting
    // any distance it has already been dragged.
    const aim = () => prints.forEach(el => {
      const dx = parseFloat(el.style.getPropertyValue('--dx')) || 0;
      const dy = parseFloat(el.style.getPropertyValue('--dy')) || 0;
      el.style.setProperty('--gx', `${host.clientWidth / 2 - el.offsetLeft - el.offsetWidth / 2 - dx}px`);
      el.style.setProperty('--gy', `${host.clientHeight / 2 - el.offsetTop - el.offsetHeight / 2 - dy}px`);
    });

    // The first deal waits, stacked, until the stack itself is on screen.
    aim();
    void host.offsetWidth;
    host.classList.remove('is-swapping');
    if (calm) host.classList.add('is-dealt');
    else {
      addEventListener('resize', () => { if (!host.classList.contains('is-dealt')) aim(); });
      onInView(prints[prints.length - 1], () => host.classList.add('is-dealt'));
    }

    let busy = false;
    const shuffle = () => {
      if (busy) return;
      const next = pick();
      const lay = () => prints.forEach((el, i) => {
        const s = next[i % next.length];
        const img = $('img', el);
        img.loading = 'eager';                 // on screen by now, so no reason to wait
        img.src = photo(s);
        $('.snap__where', el).textContent = where(s);
        $('.snap__when', el).textContent = when(s);
      });
      if (calm) return lay();
      busy = true;

      // The new photographs load while the old ones gather, so no print is
      // ever dealt out blank. A slow connection gets a second or so, no more.
      const ready = Promise.race([
        Promise.all(next.map(s => {
          const im = new Image();
          im.src = photo(s);
          return im.decode().catch(() => {});
        })),
        new Promise(r => setTimeout(r, 1200)),
      ]);
      const gathered = new Promise(r => setTimeout(r, 380));

      aim();
      host.classList.remove('is-dealt');

      Promise.all([ready, gathered]).then(() => {
        host.classList.add('is-swapping');
        lay();
        prints.forEach(el => {
          el.style.removeProperty('--dx');
          el.style.removeProperty('--dy');
          el.style.zIndex = '';
        });
        aim();
        void host.offsetWidth;                // the new stack settles before anything moves
        host.classList.remove('is-swapping');
        void host.offsetWidth;
        host.classList.add('is-dealt');
        setTimeout(() => { busy = false; }, 450);
      });
    };

    // A click anywhere in the section deals again: the paper around the prints,
    // or a print itself. A print that was dragged rather than clicked never
    // gets here, because initDrag swallows that one click.
    host.closest('section').addEventListener('click', e => {
      const onPrint = e.target.closest('.snap');
      if ((!onPrint && !e.target.matches(SNAPS_BLANK)) || String(getSelection())) return;
      if (!busy) celebrate(e.clientX, e.clientY, 10);
      shuffle();
    });
  }

  /* ── Drag ──────────────────────────────────────────────────────────
     A few things on the page are loose: the chip, the lever, the stickers
     and the three photographs beside Who.
     Offsets go into --dx / --dy rather than straight into transform, so
     each element keeps whatever rotation and hover state it already had.
     A press that never travels 4px stays a click, which is what lets the
     lever still deal a memory.                                          */

  function initDrag(root = document) {
    if (!matchMedia('(pointer: fine)').matches) return;

    $$('[data-drag]', root).forEach(el => {
      const host = el.closest('.memory') || el.parentElement;
      if (!host) return;

      let id = null, sx = 0, sy = 0, ox = 0, oy = 0;
      let baseL = 0, baseT = 0, w = 0, h = 0, moved = false;

      el.addEventListener('pointerdown', e => {
        if (e.button) return;
        const r = el.getBoundingClientRect();
        ox = parseFloat(el.style.getPropertyValue('--dx')) || 0;
        oy = parseFloat(el.style.getPropertyValue('--dy')) || 0;
        baseL = r.left - ox; baseT = r.top - oy; w = r.width; h = r.height;
        sx = e.clientX; sy = e.clientY;
        id = e.pointerId; moved = false;
        try { el.setPointerCapture(id); } catch (_) {}
        el.classList.add('is-dragging');
      });

      el.addEventListener('pointermove', e => {
        if (id === null || e.pointerId !== id) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 4) return;
        moved = true;
        const b = host.getBoundingClientRect();
        el.style.setProperty('--dx', clamp(ox + dx, b.left - baseL, b.right - baseL - w) + 'px');
        el.style.setProperty('--dy', clamp(oy + dy, b.top - baseT, b.bottom - baseT - h) + 'px');
      });

      const drop = () => {
        if (id === null) return;
        try { el.releasePointerCapture(id); } catch (_) {}
        id = null;
        el.classList.remove('is-dragging');
      };
      el.addEventListener('pointerup', drop);
      el.addEventListener('pointercancel', drop);

      // A drag that ends on the lever must not also deal a memory. Swallow
      // exactly one click and then clear the flag: a later keyboard press
      // (Enter on the focused button) arrives with no pointerdown ahead of
      // it, so leaving the flag set would lock the button out.
      el.addEventListener('click', e => {
        if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
      }, true);
    });
  }

  /* ── Small helpers ─────────────────────────────────────────────────── */

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ── Anniversary: computed live so it never goes stale ────────────── */

  const WEDDING = new Date(2022, 7, 6);   // 6 August 2022
  const MILESTONE = 5;                     // the fifth, in 2027

  function initAnniversary() {
    const now = new Date();

    let years = now.getFullYear() - WEDDING.getFullYear();
    let months = now.getMonth() - WEDDING.getMonth();
    if (now.getDate() < WEDDING.getDate()) months--;
    if (months < 0) { years--; months += 12; }

    const next = new Date(WEDDING.getFullYear() + MILESTONE, WEDDING.getMonth(), WEDDING.getDate());
    const days = Math.max(0, Math.ceil((next - now) / 86400000));

    const put = (key, value) => $$(`[data-anniv="${key}"]`).forEach(el => {
      if (el.dataset.count !== undefined) el.dataset.count = value;
      else el.textContent = value;
    });

    put('years', years);
    put('months', months);
    put('days', days);
    put('milestone-year', next.getFullYear());
    put('milestone-day', next.toLocaleDateString('en-US', { weekday: 'long' }));
    put('plural-years', years === 1 ? 'year' : 'years');
    put('plural-months', months === 1 ? 'month' : 'months');

    // Poke the big number and it throws confetti. Of course it does.
    $$('.anniv__big').forEach(el => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${days} days until the fifth anniversary. Activate for confetti.`);
      const pop = () => celebrateFrom(el, 30);
      el.addEventListener('click', pop);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pop(); }
      });
    });
  }

  function initCounters() {
    const els = $$('[data-count]');
    if (!els.length) return;
    if (calm) {
      els.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
      return;
    }

    const run = el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (!isFinite(target)) return;
      const t0 = performance.now(), dur = 1500;
      let done = false;
      const finish = () => { if (!done) { done = true; el.textContent = target + suffix; } };
      const step = now => {
        if (done) return;
        const t = clamp((now - t0) / dur, 0, 1);
        if (t >= 1) return finish();
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4))) + suffix;
        requestAnimationFrame(step);
      };
      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
      // rAF is paused in background tabs; never leave a half-counted number on screen.
      setTimeout(finish, dur + 500);
    };

    els.forEach(el => onInView(el, run));
  }

  /* ── Where we've been (home) ───────────────────────────────────────────
     Every state and province we've been to, on the outlines in
     assets/js/atlas.js. Once the map scrolls into view they print in, nearest
     home first, each colour swinging in and settling into place.
     To add a place, add its code here: a state's two letters, or CA- and a
     province's two (CA-ON for Ontario).                                      */

  const VISITED = [
    'NY', 'NJ', 'CT', 'RI', 'MA', 'VT', 'NH', 'ME', 'PA', 'DE', 'MD', 'DC', 'VA', 'WV',
    'NC', 'SC', 'GA', 'FL', 'TN', 'OH', 'IN', 'IL', 'TX', 'NM', 'CO', 'UT', 'AZ', 'NV',
    'CA', 'OR', 'WA', 'ND', 'SD', 'WY', 'KY', 'NE', 'CA-QC'
  ];

  /* Been there, not written up yet. The year pages stop at 2025, so a state
     from a trip since then is carried here by hand until a page for its year
     catches up: add its code the day you get home, and take it out again once
     its trip is in assets/js/years/ and memories.js has been rebuilt. The map
     says "just been" for these rather than the line it gives a state we only
     ever drove through, because one of them is a promise and the other is not. */
  const FRESH = { ND: 2026, SD: 2026, WY: 2026, NE: 2026 };
  const HOME = 'NY';
  // the gold four-point star from the logo, centred on 0 0
  const STAR = 'M0-10.5C.8-3.3 2.8-1.1 8.4 0 2.8 1.1.8 3.3 0 10.5-.8 3.3-2.8 1.1-8.4 0-2.8-1.1-.8-3.3 0-10.5Z';

  function initAtlas() {
    const host = $('#atlas');
    const A = window.MW_ATLAS;
    const map = host && $('.atlas__map', host);
    if (!map || !A) return;

    const been = new Set(VISITED);
    const ours = A.regions.filter(r => been.has(r.id));
    const [hx, hy] = A.home;
    const dist = r => Math.hypot(r.c[0] - hx, r.c[1] - hy);
    const far = Math.max(...ours.map(dist)) || 1;
    const delay = r => Math.round(250 + 1500 * dist(r) / far);

    // "33 states, DC and Québec", counted from the list so it stays true
    const states = ours.filter(r => !r.id.includes('-') && r.id !== 'DC');
    const extra = [...(been.has('DC') ? ['DC'] : []), ...ours.filter(r => r.id.startsWith('CA-')).map(r => r.name)];
    const summary = `${states.length} states${extra.length ? `, ${extra.slice(0, -1).join(', ')}${extra.length > 1 ? ' and ' : ''}${extra[extra.length - 1]}` : ''}`;
    $$('[data-atlas="summary"]', host).forEach(el => { el.textContent = summary; });

    const dc = ours.find(r => r.id === 'DC');
    map.innerHTML = `
      <svg viewBox="0 0 ${A.w} ${A.h}" role="img" aria-label="Map of the United States and Canada. We've been to ${summary}: ${ours.map(r => r.name).join(', ')}.">
        <g>${A.regions.map(r => `<path class="atlas__st${been.has(r.id) ? ' is-been' : ''}" data-id="${r.id}" d="${r.d}"/>`).join('')}</g>
        <g aria-hidden="true">${ours.map(r => `<path class="atlas__fill" data-id="${r.id}" data-q="${r.q}" style="--t:${delay(r)}ms" d="${r.d}"/>`).join('')}</g>
        <text class="atlas__label" x="${A.canada[0]}" y="${A.canada[1]}" text-anchor="middle" aria-hidden="true">CANADA</text>
        ${dc ? `<circle class="atlas__dc" cx="${A.dc[0]}" cy="${A.dc[1]}" r="3.4" style="--t:${delay(dc)}ms" aria-hidden="true"/>` : ''}
        <g transform="translate(${hx} ${hy})" aria-hidden="true"><path class="atlas__home" d="${STAR}"/></g>
      </svg>
      <p class="atlas__tip" hidden></p>`;

    const svg = $('svg', map);
    const tip = $('.atlas__tip', map);
    let hot = null;

    // name the state under the pointer, or the one tapped
    const point = (id, x, y) => {
      if (hot) $$(`[data-id="${hot}"]`, svg).forEach(p => p.classList.remove('is-hot'));
      hot = id;
      if (!id) { tip.hidden = true; return; }
      $$(`[data-id="${id}"]`, svg).forEach(p => p.classList.add('is-hot'));
      const r = A.regions.find(q => q.id === id);
      tip.innerHTML = `<b>${r.name}</b><span>${id === HOME ? 'Home' : been.has(id) ? 'Been there' : 'Not yet'}</span>`;
      const box = map.getBoundingClientRect();
      tip.style.left = `${clamp(x - box.left, 70, box.width - 70)}px`;
      tip.style.top = `${y - box.top}px`;
      tip.hidden = false;
    };
    const under = e => { const p = e.target.closest('.atlas__st'); return p ? p.dataset.id : null; };
    svg.addEventListener('pointermove', e => { if (e.pointerType !== 'touch') point(under(e), e.clientX, e.clientY); });
    svg.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') point(null); });
    svg.addEventListener('click', e => {
      const id = under(e);
      point(id && (id !== hot || e.pointerType === 'mouse') ? id : null, e.clientX, e.clientY);
    });
    document.addEventListener('click', e => { if (hot && !svg.contains(e.target)) point(null); });

    // the caption under the map, so the print starts once the whole map is up
    onInView($('.atlas__cap', host) || host, () => {
      host.classList.add('is-in');
      setTimeout(() => host.classList.add('is-done'), calm ? 0 : 2900);
    });
  }

  /* ── The memory map (home) ─────────────────────────────────────────────
     The way into the site. The same outlines as assets/js/atlas.js, but this
     one is asked a question: choose a state and it deals a few photographs
     filed under it in assets/js/memories.js. Choosing an empty bit of the map
     goes back to a draw from everywhere.

     Only one shape ever carries an ink line, the chosen one. Thirty-six
     outlined states turn the map into a net.                              */

  const MEM_TILT = [-2.2, 1.6, -1.2, 2, -1.7, 1.1];
  const MEM_OFF = ['--gold', '--blue', '--sage-500', '--rose', '--coral', '--khaki'];
  // A wide screen has the map beside the photographs and the room for five rows
  // of them; a phone has the map above and would be scrolling all day.
  const MEM_DEAL = 6;
  const MEM_DEAL_WIDE = 10;
  /* Three shapes, and the queries are the ones in site.css that make them,
     so the two never disagree.

     UPRIGHT  a tablet stood up: the map across the top, the cards one row to
              swipe, so six is a row rather than a long one.
     SIDEWAYS a phone on its side: two columns, the map sticky beside them.
     wide     the desktop: two columns and room for ten cards down the right.

     Where the map keeps its place the pill has nothing to stand in for. */
  const UPRIGHT  = '(min-width: 700px) and (orientation: portrait)';
  const SIDEWAYS = '(min-width: 700px) and (max-height: 520px) and (orientation: landscape)';
  const wide = () => innerWidth >= 1000 && !matchMedia(UPRIGHT).matches;
  const beside = () => wide() || matchMedia(SIDEWAYS).matches;

  function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initMemoryMap() {
    const host = $('#mem');
    const A = window.MW_ATLAS;
    const M = window.MW_MEMORIES;
    const map = host && $('.mem__map', host);
    const panel = host && $('#mem-panel');
    if (!host || !map || !panel || !A || !M) return;

    const been = new Set(VISITED);
    const ours = A.regions.filter(r => been.has(r.id));
    const nameOf = id => (id === 'DC' ? 'Washington, DC'
      : (A.regions.find(r => r.id === id) || {}).name || id);

    // "34 states, DC and Québec", counted from the list so it stays true
    const states = ours.filter(r => !r.id.includes('-') && r.id !== 'DC');
    const extra = [...(been.has('DC') ? ['DC'] : []), ...ours.filter(r => r.id.startsWith('CA-')).map(r => r.name)];
    const summary = `${states.length} states${extra.length ? `, ${extra.slice(0, -1).join(', ')}${extra.length > 1 ? ' and ' : ''}${extra[extra.length - 1]}` : ''}`;
    $$('[data-atlas="summary"]').forEach(el => { el.textContent = summary; });

    const count = id => (M.by[id] || []).length;
    const label = id => {
      const n = count(id);
      if (n) return `${nameOf(id)}, ${n} ${n === 1 ? 'memory' : 'memories'}`;
      return `${nameOf(id)}, ${FRESH[id] ? 'just been, photographs coming soon' : 'no photographs on the site yet'}`;
    };
    const pick = r => `data-id="${r.id}" tabindex="0" role="button" aria-label="${esc(label(r.id))}"`;

    // how long each state waits before it stamps down: the nearest first
    const [hx, hy] = A.home;
    const gap = r => Math.hypot(r.c[0] - hx, r.c[1] - hy);
    const far = Math.max(...ours.map(gap)) || 1;
    const wait = r => Math.round(90 + 1150 * gap(r) / far);

    map.innerHTML = `
      <svg class="memmap" viewBox="0 0 ${A.w} ${A.h}" aria-label="Map of the United States and Canada. We have been to ${esc(summary)}. Choose a state for photographs from it.">
        <g aria-hidden="true">${A.regions.map(r => `<path class="memmap__st" d="${r.d}"/>`).join('')}</g>
        <g role="group">${ours.filter(r => r.id !== 'DC')
          .map(r => `<path class="memmap__been" data-q="${r.q}" style="--t:${wait(r)}ms" ${pick(r)} d="${r.d}"/>`).join('')}</g>
        ${been.has('DC') ? `<circle class="memmap__dc" cx="${A.dc[0]}" cy="${A.dc[1]}" r="4.2" style="--t:${wait(ours.find(r => r.id === 'DC'))}ms" ${pick({ id: 'DC' })}/>` : ''}
        <path class="memmap__ring" d=""/>
        <text class="memmap__label" x="${A.canada[0]}" y="${A.canada[1]}" text-anchor="middle" aria-hidden="true">CANADA</text>
        <g transform="translate(${A.home[0]} ${A.home[1]})" aria-hidden="true"><path class="memmap__home" d="${STAR}"/></g>
      </svg>`;

    const svg = $('svg', map);
    const ring = $('.memmap__ring', svg);
    let on = null;      // the state showing, or null for the draw from everywhere
    let open = null;    // the memory opened inside the panel

    /* ── The map as a pop-up (phones) ──────────────────────────────────────
       A phone has no room for the map and the photographs at once, and a map
       that has scrolled away is a map you cannot use. So the map scrolls away
       like anything else, a slim bar takes its place as it goes, and the bar
       puts the map back up over the page when it is wanted. The map itself is
       moved between the two rather than drawn twice: one set of states, one
       set of listeners, one print.

       The sheet hangs off <body> rather than off this section: a fixed child
       of a frosted or clipped ancestor is a trap, and there is nothing to be
       gained by nesting it.                                                */

    const bar = $('#mem-bar');
    const pickBtn = bar && $('.mem__pick', bar);
    const sheet = document.createElement('div');
    sheet.className = 'memsheet';
    sheet.hidden = true;
    sheet.innerHTML = `
      <div class="memsheet__scrim" data-close></div>
      <div class="memsheet__card" role="dialog" aria-modal="true" aria-label="Choose a state">
        <span class="memsheet__grab" aria-hidden="true"></span>
        <div class="memsheet__head">
          <h3 class="memsheet__title">Where to?</h3>
          <button class="memsheet__x" type="button" data-close aria-label="Close the map">
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="memsheet__map"></div>
        <div class="memsheet__foot">
          <button class="memsheet__all" type="button" data-all>Anywhere</button>
          <span class="memsheet__note">${esc(summary)} so far</span>
        </div>
      </div>`;
    document.body.appendChild(sheet);
    const sheetMap = $('.memsheet__map', sheet);

    let shut = 0;                       // pending "put the map back" timer
    /* Open is the class, not "hidden": hidden is only written at the end of
       the shrink, and until then a second press on the pill would be read as
       a press on something already open and do nothing at all. */
    const sheetOpen = () => sheet.classList.contains('is-open');
    const card = $('.memsheet__card', sheet);

    /* The pill does not hand over to a panel, it becomes one: the card starts
       life at the pill's exact place and size, fully round, and grows from
       there. So the geometry it grows out of is measured at the moment it
       opens, and the geometry it grows into is worked out from the map's own
       proportions, because a card that hugs the map beats a card with a pool
       of empty space under it. */
    const measure = () => {
      const w = Math.min(innerWidth - 24, 520);
      const mapH = (w - 30) * (A.h / A.w);
      const h = Math.min(56 + mapH + 62, innerHeight * 0.82);
      card.style.setProperty('--tw', `${Math.round(w)}px`);
      card.style.setProperty('--th', `${Math.round(h)}px`);
    };

    /* The pill's own box, not the box it is drawn in. While the map is up the
       pill is held at nine tenths out of sight, and a rect read then is a
       tenth short: the card would land inside the pill rather than on it, and
       sit there as a blank wine lozenge over the pill's own label. The scale
       turns about the centre, so the centre is the one thing it leaves alone.  */
    const pillBox = () => {
      const r = bar.getBoundingClientRect();
      const w = bar.offsetWidth, h = bar.offsetHeight;
      return {
        top: r.top + r.height / 2 - h / 2,
        left: r.left + r.width / 2 - w / 2,
        width: w, height: h
      };
    };
    const from = r => {
      card.style.setProperty('--fy', `${Math.round(r.top)}px`);
      card.style.setProperty('--fx', `${Math.round(r.left)}px`);
      card.style.setProperty('--fw', `${Math.round(r.width)}px`);
      card.style.setProperty('--fh', `${Math.round(r.height)}px`);
    };

    const openSheet = () => {
      if (sheetOpen()) return;
      clearTimeout(shut);
      print(true);
      measure();
      // where it grows from: the pill itself, or the middle if there is none
      from(bar && bar.classList.contains('is-up')
        ? pillBox()
        : { top: innerHeight / 2 - 22, left: innerWidth / 2 - 90, width: 180, height: 44 });

      sheetMap.appendChild(svg);
      sheet.hidden = false;
      void sheet.offsetWidth;
      sheet.classList.add('is-open');
      document.body.classList.add('memsheet-open');
      document.documentElement.style.overflow = 'hidden';
      if (pickBtn) pickBtn.setAttribute('aria-expanded', 'true');
      $('.memsheet__x', sheet).focus();
    };

    const closeSheet = () => {
      if (!sheetOpen()) return;
      // back into the pill it came out of, wherever that has got to
      if (bar && bar.classList.contains('is-up')) from(pillBox());
      sheet.classList.remove('is-open');
      document.body.classList.remove('memsheet-open');
      document.documentElement.style.overflow = '';
      if (pickBtn) { pickBtn.setAttribute('aria-expanded', 'false'); pickBtn.focus(); }
      // After the shrink and the fade at the end of it, never during: taken
      // off the page early the card goes out with a pop, mid-fade and still
      // a size too big for the pill it is standing on.
      const home = () => { sheet.hidden = true; map.appendChild(svg); };
      if (calm) home();
      else shut = setTimeout(home, 460);
    };

    addEventListener('resize', perFrame(() => { if (sheetOpen()) measure(); }));

    addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
    sheet.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) closeSheet();
      else if (e.target.closest('[data-all]')) { pin(); show(null); closeSheet(); release(nudge(true)); }
    });

    // a flick down on the sheet's own chrome closes it, the way a sheet should
    let grabY = null;
    card.addEventListener('pointerdown', e => {
      grabY = e.target.closest('.memsheet__grab, .memsheet__head') ? e.clientY : null;
    });
    card.addEventListener('pointerup', e => {
      if (grabY !== null && e.clientY - grabY > 70) closeSheet();
      grabY = null;
    });

    /* Roll for somewhere: a state we have actually written up, never the one
       already showing, so it always changes something. Both dice on the page
       do this, because one glyph doing two jobs is the sort of thing nobody
       works out. Re-dealing the state you are already on is still there, it is
       just called tapping it again on the map. */
    const rollTo = from => {
      const filed = Object.keys(M.by).filter(id => id !== on);
      if (!filed.length) return;
      show(filed[Math.floor(Math.random() * filed.length)]);
      nudge(!!from);
      // the panel is repainted by now, so the button to spin is the fresh one
      const btn = from || $('[data-roll]', panel);
      if (!btn) return;
      btn.classList.remove('is-rolling');
      void btn.offsetWidth;
      btn.classList.add('is-rolling');
      if (!calm) celebrateFrom(btn, 12);
    };

    if (bar) {
      bar.hidden = false;
      pickBtn.addEventListener('click', openSheet);
      const dice = $('.mem__dice', bar);
      dice.addEventListener('click', () => rollTo(dice));
    }

    /* ── The panel ─────────────────────────────────────────────────────── */

    const cardsFor = id => {
      const list = id ? (M.by[id] || []) : M.items.map((_, i) => i);
      return shuffled(list).slice(0, wide() ? MEM_DEAL_WIDE : MEM_DEAL);
    };

    /* ── One memory, the state someone picked ──────────────────────────
       A trip that crossed a line is filed under both states. Under Indiana
       it should say Holiday World and show the day at Holiday World, not the
       Cincinnati half of the same week. memories.js carries the name for each
       state on "t" and the state each photograph was taken in on "s", and a
       memory that has nothing to say about it falls back to what it has. */

    const titleOf = (m, id) => (id && m.t && m.t[id]) || m.short;
    const inState = (m, id) => (id ? m.pics.filter(p => p.s === id) : []);
    const forState = (m, id) => {
      const mine = inState(m, id);
      return mine.length ? [...mine, ...m.pics.filter(p => p.s !== id)] : m.pics;
    };

    const dealt = m => {
      const pool = inState(m, on).length ? inState(m, on) : m.pics;
      return { m, shot: pool[Math.floor(Math.random() * pool.length)] };
    };

    const grid = (id, picks) => {
      const n = id ? count(id) : M.items.length;
      // A state's count is worth saying: six cards out of fourteen is a reason
      // to go back for more. "96 memories on the site" is a statistic, and
      // the cards under it already say what it means.
      const tally = n ? `${n} ${n === 1 ? 'memory' : 'memories'}`
        : FRESH[id] ? 'Just been' : 'Been there';
      const head = `
        <div class="mem__headrow">
          <h3 class="mem__title">${id ? esc(nameOf(id)) : 'Anywhere'}${id ? `<span class="mem__count">${tally}</span>` : ''}</h3>
          <button class="mem__roll" type="button" data-roll><span class="mem__die" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 20 20" fill="none"><rect x="1.7" y="1.7" width="16.6" height="16.6" rx="4" stroke="currentColor" stroke-width="1.7"/><circle cx="6.6" cy="6.6" r="1.6" fill="currentColor"/><circle cx="13.4" cy="13.4" r="1.6" fill="currentColor"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/></svg></span>Surprise me</button>
        </div>`;

      if (!picks.length) {
        const said = FRESH[id]
          ? `We have only just been to ${esc(nameOf(id))}, in ${FRESH[id]}. The photographs and the writing land here as soon as they are ready.`
          : `We have been, but nothing from ${esc(nameOf(id))} has made it onto the site yet. It was probably a drive through on the way somewhere else.`;
        return `${head}
          <div class="mem__none${FRESH[id] ? ' is-soon' : ''}">
            ${FRESH[id] ? '<span class="mem__soon">Coming soon</span>' : ''}
            <p>${said}</p>
            <button class="mem__back" type="button" data-all>&larr; Somewhere else</button>
          </div>`;
      }

      const cards = picks.map((i, k) => {
        const { m, shot } = dealt(M.items[i]);
        const more = m.pics.length - 1;
        const name = titleOf(m, id);
        return `
          <button class="mem__card" type="button" data-open="${i}"
                  style="--tilt:${MEM_TILT[k % MEM_TILT.length]}deg;--off:var(${MEM_OFF[k % MEM_OFF.length]})">
            <span class="mem__shot">
              <img src="${esc(shot.u)}" alt="${esc(name)}, ${esc(m.date)}"${shot.p ? ` style="object-position:${esc(shot.p)}"` : ''} loading="lazy" decoding="async">
              ${more > 0 ? `<span class="mem__n">+${more}</span>` : ''}
            </span>
            <span class="mem__label">
              <span class="mem__where">${esc(name)}</span>
              <span class="mem__when">${esc(m.year)}</span>
            </span>
          </button>`;
      }).join('');

      return `${head}<div class="mem__grid">${cards}</div>`;
    };

    const opened = i => {
      const m = M.items[i];
      const pics = forState(m, on).slice(0, 5);
      const back = on ? nameOf(on) : 'the pile';
      return `
        <div class="mem__open is-new" style="--off:var(${MEM_OFF[i % MEM_OFF.length]})">
          <button class="mem__back" type="button" data-back>&larr; Back to ${esc(back)}</button>
          <span class="mem__lead">
            <img src="${esc(pics[0].u)}" alt="${esc(m.place)}"${pics[0].p ? ` style="object-position:${esc(pics[0].p)}"` : ''} decoding="async">
            ${pics[0].c ? `<span class="mem__cap">${esc(pics[0].c)}</span>` : ''}
          </span>
          ${pics.length > 1 ? `<div class="mem__shots">${pics.map((p, k) => `
            <button class="mem__thumb${k ? '' : ' is-on'}" type="button" data-shot="${k}" aria-label="Photograph ${k + 1} of ${pics.length}">
              <img src="${esc(p.u)}" alt=""${p.p ? ` style="object-position:${esc(p.p)}"` : ''} loading="lazy" decoding="async">
            </button>`).join('')}</div>` : ''}
          <div class="mem__head">
            <h3 class="mem__place">${esc(m.place)}</h3>
            <span class="mem__date">${esc(m.date)}</span>
          </div>
          <p class="mem__text">${esc(m.text)}</p>
          <a class="mem__go" href="${esc(m.href)}">Read more in ${esc(m.year)} &rarr;</a>
        </div>`;
    };

    const paint = () => {
      panel.innerHTML = open === null ? grid(on, cardsFor(on)) : opened(open);
    };

    /* ── Choosing ──────────────────────────────────────────────────────── */

    const show = id => {
      on = id;
      open = null;
      host.classList.toggle('is-picked', !!id);
      svg.classList.toggle('is-picked', !!id);
      $$('.memmap__been, .memmap__dc', svg).forEach(p => p.classList.toggle('is-on', p.dataset.id === id));
      const r = id && A.regions.find(q => q.id === id);
      ring.setAttribute('d', r && id !== 'DC' ? r.d : '');
      if (bar) {
        const n = id ? count(id) : M.items.length;
        $('[data-mem="where"]', bar).textContent = id ? nameOf(id) : 'Anywhere';
        $('[data-mem="count"]', bar).textContent = id
          ? (n ? `${n} ${n === 1 ? 'memory' : 'memories'}` : FRESH[id] ? 'Just been' : 'Been there')
          : `${n} memories`;
      }
      paint();
    };

    /* The pill turns up when the map has left the top of the screen and there
       is still something under it worth changing, and goes again when either
       stops being true. Both measurements are taken before the class is
       written, so a scroll never costs a second layout. */
    // The pill takes over the moment the map has climbed past where the pill
    // itself sits, so the two never share the screen and there is never a
    // moment with neither of them on it.
    const GONE = 118;
    const watch = perFrame(() => {
      const m = map.getBoundingClientRect();
      const h = host.getBoundingClientRect();
      // Someone who jumped past the map never saw it print, and a map that has
      // not printed is a blank map when the pop-up puts it up. Land it.
      if (m.bottom < GONE) print(true);
      if (bar) bar.classList.toggle('is-up', !beside() && !sheetOpen() && m.bottom < GONE && h.bottom > 220);
    });
    addEventListener('scroll', watch, { passive: true });
    addEventListener('resize', watch);

    /* ── The print ─────────────────────────────────────────────────────────
       The first time the map comes into view the states print themselves in,
       nearest Astoria first, each one stamping down a shade too hard and
       settling, the way a screen print lands. Once only: it is an entrance,
       not a thing to sit through again on the way back up. Afterwards
       "is-set" takes the delays off, so choosing a state is instant.       */
    let printed = false;
    const print = now => {
      if (printed) return;
      printed = true;
      // straight past it, or asked for it from the pop-up: just be there
      if (calm || now) { svg.classList.add('is-printed', 'is-set'); return; }
      svg.classList.add('is-printed');
      setTimeout(() => {
        const star = $('.memmap__home', svg);
        if (star && star.isConnected) celebrateFrom(star, 16);
      }, 1450);
      setTimeout(() => svg.classList.add('is-set'), 2500);
    };
    onInView(map, print);
    watch();

    // Every choice deals a fresh set, so every choice goes back to the top of
    // it: on a phone that brings the map and the sheet up together, and on a
    // wide screen it undoes whatever scrolling the last set took, which would
    // otherwise drop someone into the middle of photographs they have not
    // seen. The map lands exactly where it sticks.
    const nudge = toCards => {
      // Coming back from the pop-up the map is not what anyone wants to look
      // at, the photographs are, so that lands on them, clear of the pill.
      const sheetPick = toCards && !beside();
      const el = sheetPick ? panel : host;
      const off = sheetPick ? (bar ? bar.offsetHeight : 0) + 78 : (beside() ? 80 : 72);
      const y = el.getBoundingClientRect().top + scrollY - off;
      if (Math.abs(y - scrollY) <= 24) return false;
      // Someone who asked for less motion still wants to be in the right
      // place; they just do not want to watch the trip there.
      scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
      return !calm;                       // an instant move has already landed
    };

    /* ── Holding the floor while the panel changes ─────────────────────────
       Ten cards is five rows deep, and opening one puts a single card in
       their place: the section loses about a thousand pixels in the same
       frame the glide is asked for. The browser has to clamp the scroll to
       the shorter document before it can move, and that clamp is the flinch
       people see, a jump backwards and then a glide.

       So the panel is pinned at the height it already had, the swap happens
       under a floor that has not moved, and the pin comes off once the glide
       has landed, by which time the part that shrinks is below the fold and
       nothing on screen moves at all. scrollend says when to let go; the
       timer is for the browsers that do not have it and for the times the
       glide had nowhere to go. */
    let unpin = 0;
    const pin = () => {
      const h = panel.getBoundingClientRect().height;
      if (h) panel.style.minHeight = `${h}px`;
    };
    const drop = () => {
      clearTimeout(unpin);
      removeEventListener('scrollend', drop);
      panel.style.minHeight = '';
    };
    /* When there was a glide, the floor comes away once it lands: by then
       the part that shrinks is below the fold. When there was none, nothing
       is going to move on screen either way, so it comes away in the same
       frame as the swap rather than popping half a second later. */
    const release = glided => {
      clearTimeout(unpin);
      if (!glided) return drop();
      addEventListener('scrollend', drop, { once: true });
      unpin = setTimeout(drop, 900);
    };
    const repaint = fn => { pin(); fn(); paint(); release(nudge()); };

    svg.addEventListener('click', e => {
      const hit = e.target.closest('[data-id]');
      const fromSheet = sheetOpen();
      pin();
      show(hit ? hit.dataset.id : null);
      // a choice made in the pop-up is the end of the pop-up's job
      if (fromSheet) closeSheet();
      release(nudge(fromSheet));
    });
    svg.addEventListener('keydown', e => {
      const hit = e.target.closest && e.target.closest('[data-id]');
      if (!hit || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      const fromSheet = sheetOpen();
      pin();
      show(hit.dataset.id);
      if (fromSheet) closeSheet();
      release(nudge(fromSheet));
    });

    panel.addEventListener('click', e => {
      const card = e.target.closest('[data-open]');
      if (card) { repaint(() => { open = +card.dataset.open; }); return; }
      if (e.target.closest('[data-roll]')) { rollTo(); return; }
      if (e.target.closest('[data-back]')) { repaint(() => { open = null; }); return; }
      if (e.target.closest('[data-all]')) { pin(); show(null); release(nudge()); return; }

      const thumb = e.target.closest('[data-shot]');
      if (thumb && open !== null) {
        const p = M.items[open].pics[+thumb.dataset.shot];
        const lead = $('.mem__lead img', panel);
        const cap = $('.mem__cap', panel);
        lead.style.animation = 'none';
        void lead.offsetWidth;
        lead.style.animation = '';
        lead.src = p.u;
        lead.style.objectPosition = p.p || '';
        if (cap) cap.textContent = p.c || '';
        $$('.mem__thumb', panel).forEach(t => t.classList.toggle('is-on', t === thumb));
      }
    });

    /* Clicking away from the whole thing puts it back to a draw from
       everywhere, the same as clicking the sea inside the map. The nav is left
       out of it: changing the theme is not a way of saying you are finished
       with Ohio. No scrolling either, since the click was somewhere else.

       On the way down, not on the way up: opening a card repaints the panel
       and throws the clicked button out of the document, and a button with no
       ancestors left is a button that answers "no" to being inside this
       section, which read every card as a click somewhere else. */
    document.addEventListener('click', e => {
      if (on === null || sheetOpen()) return;
      if (e.target.closest('#mem, .memsheet, .nav')) return;
      show(null);
    }, true);

    show(null);
  }

  /* ── Said about us (home) ──────────────────────────────────────────────
     The rail is a real scroller, so a thumb pushes it about and the keyboard
     reaches it; this only nudges it along and gets out of the way the moment
     anyone touches it. The cards are cloned once so the loop never shows an
     edge. It runs only while the rail is on screen.                        */

  function initSay() {
    const rail = $('#say');
    const track = rail && $('.say__track', rail);
    if (!rail || !track) return;

    rail.setAttribute('tabindex', '0');
    rail.setAttribute('role', 'group');
    rail.setAttribute('aria-label', 'What friends and family said at the wedding');
    if (calm) return;                       // a plain swipe rail, and nothing moves

    const cards = $$('.said', track);
    cards.forEach(c => {
      const copy = c.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      $$('img', copy).forEach(i => { i.alt = ''; });
      track.appendChild(copy);
    });

    const SPEED = 24;                        // pixels a second, a slow read
    let x = 0, half = 0, held = 0, last = 0, running = false, frame = 0;

    const measure = () => { half = track.scrollWidth / 2; };
    measure();
    addEventListener('resize', perFrame(measure));

    const step = now => {
      frame = requestAnimationFrame(step);
      const dt = last ? Math.min(64, now - last) : 0;
      last = now;
      if (held > 0) { held -= dt; x = rail.scrollLeft; return; }
      if (!half) return;
      x += SPEED * dt / 1000;
      if (x >= half) x -= half;
      rail.scrollLeft = x;
    };

    const start = () => { if (running) return; running = true; last = 0; frame = requestAnimationFrame(step); };
    const stop = () => { running = false; cancelAnimationFrame(frame); };

    // hands off for a moment after anyone touches it, however they touch it
    const hold = (ms = 2600) => { held = ms; };
    ['pointerdown', 'wheel', 'touchstart'].forEach(ev =>
      rail.addEventListener(ev, () => hold(), { passive: true }));
    rail.addEventListener('pointerenter', () => hold(1e9));
    rail.addEventListener('pointerleave', () => hold(400));
    rail.addEventListener('focusin', () => hold(1e9));
    rail.addEventListener('focusout', () => hold(400));

    // keep the loop seamless when a thumb has thrown it past the join
    rail.addEventListener('scroll', perFrame(() => {
      if (held <= 0 || !half) return;
      if (rail.scrollLeft >= half) rail.scrollLeft -= half;
      else if (rail.scrollLeft < 0) rail.scrollLeft += half;
    }), { passive: true });

    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 }).observe(rail);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  }

  /* ── Since the wedding (home) ──────────────────────────────────────────
     One Christmas card for each year page, from assets/js/years/index.js,
     so a year added there turns up on the home page by itself.             */

  function initSince() {
    const host = $('#since');
    const years = window.MW_YEARS;
    if (!host || !years || !years.length) return;
    // how many cards there are, so the CSS can lay out a row that divides evenly
    host.dataset.n = years.length;
    host.style.setProperty('--n', years.length);
    const OFF = { gold: '--gold', sage: '--sage-500', rose: '--rose', coral: '--coral', blue: '--blue', khaki: '--khaki' };
    const TILT = [-2.4, 1.8, -1.3, 2.2, -1.8, 1.2];
    const last = years[years.length - 1];

    host.innerHTML = years.map((y, i) => {
      const base = `assets/art/cards/${y.card}`;
      const pic = y.card
        ? `<img src="${base}-sm.jpg" srcset="${base}-sm.jpg 560w, ${base}.jpg 1400w" sizes="(max-width: 620px) 80vw, 25vw" width="1400" height="1000" alt="" loading="lazy" decoding="async">`
        : `<span class="since__blank" aria-hidden="true">${esc(y.year)}</span>`;
      return `
        <li class="since__item" data-reveal="up" style="--d:${i * 90}ms;--off:var(${OFF[y.off] || '--gold'});--tilt:${TILT[i % TILT.length]}deg">
          <a class="since__card" href="${esc(y.year)}.html" aria-label="${esc(y.year)}: ${esc(y.title)}">
            <span class="since__pic">${pic}</span>
            <span class="since__year">${esc(y.year)}</span>
            <span class="since__name">${esc(y.title)}</span>
            ${y === last ? '<span class="since__new">Latest</span>' : ''}
          </a>
        </li>`;
    }).join('');

    const latest = $('#since-latest');
    if (latest) {
      latest.href = `${last.year}.html`;
      latest.textContent = `Jump to ${last.year}`;
    }
  }

  /* ── Long trips fold on phones ─────────────────────────────────────────
     On a narrow screen a trip or honeymoon day shows the first eight lines
     of the first paragraph, and a button opens the rest of it and any
     paragraphs after it. Eight lines on a phone is most of a screen, and
     the photographs are underneath. Wider screens show everything and never
     see the button (see "Folds" in site.css).                              */

  function initFolds() {
    const groups = [
      ...$$('.trip').map(el => [el, $$('.trip__text', el)]),
      ...$$('.chap--day .chap__body').map(el => [el, $$(':scope > .chap__text', el)]),
    ];
    const folds = [];

    groups.forEach(([box, paras]) => {
      if (!paras.length) return;
      const after = paras.slice(1);
      // a short second paragraph isn't worth putting away
      const rest = after.reduce((n, p) => n + p.textContent.length, 0) >= 240 ? after : [];
      box.classList.add('fold');
      paras[0].classList.add('fold__lede');
      rest.forEach(p => p.classList.add('fold__more'));

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fold__btn';
      btn.innerHTML = `Keep reading${rest.length ? ` <span class="fold__n">+${rest.length}</span>` : ''}`;
      paras[paras.length - 1].after(btn);

      const f = { box, lede: paras[0], rest, btn, open: false };
      btn.addEventListener('click', () => {
        f.open = true;
        box.classList.remove('is-folded');
        rest.forEach(p => p.classList.add('is-in'));
        const to = rest[0] || f.lede;
        to.tabIndex = -1;
        to.focus({ preventScroll: true });
      });
      folds.push(f);
    });
    if (!folds.length) return;

    /* Whether anything is hidden depends on the width: eight lines is short
       of a paragraph on a phone and most of the way through it on a tablet.
       So it is measured, and measured again when the screen changes. Every
       fold is folded, then every one read, then the ones with nothing to
       hide unfolded, so the page lays out once rather than once a trip. */
    const fit = () => {
      folds.forEach(f => { if (!f.open) f.box.classList.add('is-folded'); });
      const cut = folds.map(f => !f.open
        && (f.rest.length > 0 || f.lede.scrollHeight - f.lede.clientHeight > 4));
      folds.forEach((f, i) => f.box.classList.toggle('is-folded', cut[i]));
    };

    fit();
    addEventListener('resize', fit);
    // eight lines is eight lines of the face that actually lands
    if (document.fonts) document.fonts.ready.then(fit);
  }

  /* ── Swipe rows (phones) ───────────────────────────────────────────────
     Below 620px a few long grids become one row you swipe through (see
     "Swipe rows" in site.css). A small count underneath says how many.     */

  function initRails() {
    $$('.since__cards, .chapters, .tables').forEach(row => {
      const items = [...row.children];
      if (items.length < 2) return;
      const count = document.createElement('p');
      count.className = 'rail-count';
      count.setAttribute('aria-hidden', 'true');
      row.after(count);
      const tick = () => {
        const step = items[1].offsetLeft - items[0].offsetLeft;
        const atEnd = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
        const at = atEnd ? items.length - 1 : clamp(Math.round(row.scrollLeft / (step || 1)), 0, items.length - 1);
        count.innerHTML = `Swipe <svg width="15" height="9" viewBox="0 0 15 9" fill="none"><path d="M0 4.5h13M10 1l3.5 3.5L10 8" stroke="currentColor" stroke-width="1.2"/></svg> <b>${at + 1}</b> / ${items.length}`;
      };
      tick();
      row.addEventListener('scroll', perFrame(tick), { passive: true });
      addEventListener('resize', tick);
    });
  }

  /* ── A pair of buttons: one row, or one width ──────────────────────────
     They sit side by side while the row has space for the pair and stack when
     it hasn't. CSS can wrap them but it cannot then make them match, and how
     much room they need depends on what they say, not on the width of the
     screen, so it is measured. Every row is read before any class is written,
     so the page is laid out once rather than once per row. */

  function initButtonRows() {
    const rows = $$('.btns, .since__btns, .yclose__btns')
      .filter(r => r.querySelectorAll('.btn').length > 1);
    if (!rows.length) return;

    const fit = () => {
      rows.forEach(r => r.classList.remove('is-stacked'));
      const stack = rows.map(row => {
        const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
        const kids = [...row.children];
        const need = kids.reduce((w, el) => w + el.getBoundingClientRect().width, 0)
          + gap * (kids.length - 1);
        return need > row.getBoundingClientRect().width + 1;
      });
      rows.forEach((row, i) => row.classList.toggle('is-stacked', stack[i]));
    };

    fit();
    addEventListener('resize', fit);
    // a button is only as wide as its words, so it changes when the face lands
    if (document.fonts) document.fonts.ready.then(fit);
  }

  /* ── Back to the top, once a long page has been scrolled a way ─────── */

  function initToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'totop';
    btn.setAttribute('aria-label', 'Back to the top');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14V2.5M3 7.2l5-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);
    const tick = () => btn.classList.toggle('is-on',
      scrollY > innerHeight * 1.6 && document.documentElement.scrollHeight > innerHeight * 4);
    tick();
    addEventListener('scroll', perFrame(tick), { passive: true });
    addEventListener('resize', tick);
    btn.addEventListener('click', () => scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }));
  }

  /* ── Boot ──────────────────────────────────────────────────────────── */

  function boot() {
    initTheme();
    initNav();
    initProgress();
    initCurtain();
    initTicker();
    initTimeline();
    initTables();
    initGlasses();
    initEmbeds();
    initChatter();
    initMemory();
    initSnaps();
    initSince();
    initFolds();
    watchReveals();
    initAnniversary();
    initAtlas();
    initMemoryMap();
    initSay();
    initCounters();
    initPour();
    initCursor();
    initMagnets();
    initTilt();
    initLightbox();
    initSpeeches();
    initStickers();
    initDrag();
    initRails();
    initButtonRows();
    initToTop();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
