/* ==========================================================================
   THE MURNANS · the motion system, the script half
   assets/css/motion.css has the why. This file does the parts that have to
   know where something is, or when its pixels have arrived:

     presses        a touch listener, so iOS Safari shows :active at all
     the pill       one per jump-to list, gliding to whichever chip is lit,
                    the leading edge first and the trailing edge after it
     photographs    held until decoded, then settled into the frame, a few
                    at a time along a row
     prints         lean towards a mouse or trackpad and catch the light
     the story      unrolls when "Keep reading" is pressed
     back to top    the arrow takes off, and comes back in from below

   Loads before site.js on every page. Nothing here loops once it has
   settled, and every pass reads all it needs before it writes.
   ========================================================================== */

(() => {
  'use strict';

  const root = document.documentElement;
  if (/[?&]motion=off\b/.test(location.search)) { root.dataset.motion = 'off'; return; }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('mo');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const lerp = (a, b, k) => a + (b - a) * k;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const OUT = 'cubic-bezier(.16, 1, .3, 1)';

  // iOS Safari only applies :active where a touch listener is listening
  document.addEventListener('touchstart', () => {}, { passive: true });

  const boot = () => {
    initInk();
    // site.js builds Story's chapters as it boots, straight after this
    setTimeout(initSettle, 0);
    initLean();
    initUnroll();
    initToTop();
  };

  /* ── The pill on the jump-to bar ──────────────────────────────────────
     year.js, trip.js and site.js light a chip by giving it .is-on; this
     watches for that rather than reaching into any of them. Moving right,
     the pill's right edge sets off first and the left one follows, so it
     stretches towards the chip and then gathers itself up there. */
  function initInk() {
    $$('.yearbar__list').forEach(list => {
      const chips = $$('.yearbtn', list);
      if (chips.length < 2) return;
      const ink = document.createElement('span');
      ink.className = 'mo-ink';
      ink.setAttribute('aria-hidden', 'true');
      list.prepend(ink);
      list.classList.add('mo-inked');
      let at = null, queued = false;

      const place = instant => {
        queued = false;
        const on = chips.find(c => c.classList.contains('is-on'));
        if (!on) { ink.classList.remove('mo-ink--on'); at = null; return; }
        const to = { x: on.offsetLeft, y: on.offsetTop, w: on.offsetWidth, h: on.offsetHeight };
        // where the pill is now, mid-glide included
        const cs = getComputedStyle(ink);
        const now = at && { x: parseFloat(cs.translate) || 0, w: parseFloat(cs.width) || to.w };
        ink.getAnimations().forEach(a => a.cancel());
        ink.style.translate = `${to.x}px ${to.y}px`;
        ink.style.width = `${to.w}px`;
        ink.style.height = `${to.h}px`;
        const first = !ink.classList.contains('mo-ink--on');
        ink.classList.add('mo-ink--on');
        if (instant || first || !now || (Math.abs(now.x - to.x) < 1 && Math.abs(now.w - to.w) < 1)) { at = to; return; }
        const right = to.x > now.x;
        const lead = right ? to.x + to.w : to.x;                   // the edge that sets off first
        const tail = right ? now.x + (to.x - now.x) * .22 : now.x + now.w + ((to.x + to.w) - (now.x + now.w)) * .22;
        const mid = right ? { x: tail, w: lead - tail } : { x: lead, w: tail - lead };
        ink.animate([
          { translate: `${now.x}px ${to.y}px`, width: `${now.w}px`, easing: 'cubic-bezier(.45, 0, .55, 1)' },
          { translate: `${mid.x}px ${to.y}px`, width: `${mid.w}px`, offset: .38, easing: OUT },
          { translate: `${to.x}px ${to.y}px`, width: `${to.w}px` },
        ], { duration: 560 });
        at = to;
      };
      const soon = () => { if (!queued) { queued = true; requestAnimationFrame(() => place(false)); } };

      // the pill's own class changes are not a chip lighting up
      new MutationObserver(rs => { if (rs.some(r => r.target !== ink)) soon(); })
        .observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });
      if ('ResizeObserver' in window) new ResizeObserver(() => place(true)).observe(list);
      if (document.fonts) document.fonts.ready.then(() => place(true));
      place(true);
    });
  }

  /* ── Photographs settle into their frames ─────────────────────────────
     Every photograph below the first screen waits, hidden, until it is
     both in view and decoded, then fades up while it settles from a touch
     large. Those arriving together go one after another, 70ms apart. Inside
     a strip that wipes in, the frame arrives first and the photograph comes
     up in it once it is ready. A photograph already on screen when the page
     opens is left alone, and so are the page heads, which have their own. */
  function initSettle() {
    const all = $$('.shot:not(.shot--empty)').filter(s => s.querySelector('img') && !s.closest('.page-head'));
    if (!all.length) return;
    const line = () => innerHeight * 1.02;
    const wait = all.filter(s => s.getBoundingClientRect().top > line());
    if (!wait.length) return;
    wait.forEach(s => s.classList.add('mo-wait'));

    let batch = [], flushing = false;
    const flush = () => {
      flushing = false;
      const go = batch; batch = [];
      // left to right, then top to bottom, so a row deals out in order
      go.map(s => [s, s.getBoundingClientRect()])
        .sort((a, b) => (Math.round(a[1].top / 40) - Math.round(b[1].top / 40)) || a[1].left - b[1].left)
        .forEach(([s], k) => {
          s.style.setProperty('--mo-d', `${Math.min(k, 5) * 70}ms`);
          s.classList.add('mo-in');
          s.classList.remove('mo-wait');
          setTimeout(() => { s.classList.remove('mo-in'); s.style.removeProperty('--mo-d'); }, 1800);
        });
    };
    const ready = s => {
      const img = s.querySelector('img');
      const loaded = img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise(r => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); });
      // decode() can hang in a hidden tab; never hold a photograph back for it
      loaded.then(() => Promise.race([img.decode ? img.decode().catch(() => {}) : 0, new Promise(r => setTimeout(r, 400))]))
        .then(() => { batch.push(s); if (!flushing) { flushing = true; requestAnimationFrame(flush); } });
    };

    const pending = new Set(wait);
    const take = s => { if (!pending.delete(s)) return; io && io.unobserve(s); ready(s); };
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) take(e.target); }), { rootMargin: '0px 0px -6% 0px', threshold: .12 })
      : null;
    if (io) wait.forEach(s => io.observe(s));
    // Belt and braces, as the site's own reveals do: a slow sweep picks up
    // anything an observer misses, so no photograph can stay hidden. Slow
    // on purpose: every pass measures each waiting photograph, and the
    // observer has normally taken it long before.
    const sweep = setInterval(() => {
      if (!pending.size) { clearInterval(sweep); return; }
      const h = innerHeight;
      [...pending].map(s => [s, s.getBoundingClientRect()])
        .filter(([, r]) => r.top < h && r.bottom > 0 && r.left < innerWidth && r.right > 0)
        .forEach(([s]) => take(s));
    }, io ? 2000 : 500);
  }

  /* ── Prints lean towards the pointer and catch the light ──────────────
     Mouse and trackpad only. One print at a time: the one under the
     pointer leans up to six degrees towards it, eased, and a highlight
     follows the pointer across the photograph. Let go, it settles flat and
     hands its transform back. */
  function initLean() {
    if (!fine.matches) return;
    const KINDS = [
      ['.mem__card', el => el, el => $('.mem__shot', el)],
      // the card for the page you are on is not a link, so it does not lean like one
      ['.hcard:not(.hcard--here)', el => $('.hcard__pic', el), el => $('.hcard__pic', el)],
      ['a.ydeck__card', el => $('.ydeck__pic', el), el => $('.ydeck__pic', el)],
      ['.shot:not(.shot--empty)', el => el, el => el],
    ];
    const SEL = KINDS.map(k => k[0]).join(', ');
    let card = null, tiltEl = null, glare = null, rx = 0, ry = 0, tx = 0, ty = 0, raf = 0;

    const write = () => {
      rx = lerp(rx, tx, .15); ry = lerp(ry, ty, .15);
      const still = Math.abs(rx - tx) < .01 && Math.abs(ry - ty) < .01;
      if (still) { rx = tx; ry = ty; }
      if (tiltEl) tiltEl.style.transform = rx || ry ? `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)` : '';
      raf = still ? 0 : requestAnimationFrame(write);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(write); };
    // the print it leaves eases back flat on its own, so the next can start at once
    const letGo = () => {
      if (!card) return;
      if (glare) glare.style.setProperty('--go', '0');
      if (tiltEl) {
        const from = tiltEl.style.transform;
        tiltEl.style.transform = '';
        if (from) tiltEl.animate([{ transform: from }, { transform: 'none' }], { duration: 600, easing: OUT });
      }
      cancelAnimationFrame(raf); raf = 0;
      card = tiltEl = glare = null;
      rx = ry = tx = ty = 0;
    };

    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const c = e.target.closest && e.target.closest(SEL);
      if (c !== card) {
        letGo();
        if (!c || c.closest('.lightbox')) return;
        const kind = KINDS.find(k => c.matches(k[0]));
        const host = kind[2](c);
        card = c; tiltEl = kind[1](c);
        glare = host && (host.querySelector(':scope > .mo-glare') || host.appendChild(Object.assign(document.createElement('span'), { className: 'mo-glare' })));
      }
      if (!tiltEl) return;
      const r = tiltEl.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
      if (glare) {
        glare.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        glare.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
        glare.style.setProperty('--go', '1');
      }
      ty = (px - .5) * 11;
      tx = (.5 - py) * 9;
      go();
    }, { passive: true });
    document.addEventListener('pointerleave', letGo);
    addEventListener('blur', letGo);
  }

  /* ── "Keep reading" unrolls the story ──────────────────────────────────
     site.js opens the fold on the button's own click; this listens first,
     on the way down, to note where the cut was, then runs a soft edge from
     there to the end of the words. The cut paragraph is also given its
     faded last line here, since only a measure can say it was cut. */
  function initUnroll() {
    const ledes = () => $$('.fold.is-folded .fold__lede');
    const mark = () => {
      const cut = ledes().map(l => l.scrollHeight - l.clientHeight > 4);
      ledes().forEach((l, i) => l.classList.toggle('mo-cut', cut[i]));
    };
    // the folds are built by site.js, which boots straight after this
    setTimeout(() => {
      if (!$('.fold')) return;
      mark();
      addEventListener('resize', mark);
      if (document.fonts) document.fonts.ready.then(mark);
    }, 0);

    document.addEventListener('click', e => {
      const btn = e.target.closest && e.target.closest('.fold__btn');
      const box = btn && btn.closest('.fold');
      const lede = box && $('.fold__lede', box);
      if (!lede) return;
      const top0 = box.getBoundingClientRect().top;
      const cut = lede.getBoundingClientRect().bottom - top0;
      requestAnimationFrame(() => {
        const bt = box.getBoundingClientRect().top;
        const texts = [lede, ...$$('.fold__more', box)];
        const tops = texts.map(t => t.getBoundingClientRect());
        texts.forEach((t, i) => t.style.setProperty('--mo-top', `${tops[i].top - bt}px`));
        const end = Math.max(...tops.map(r => r.bottom)) - bt + 80;
        // the start is set before the transition is switched on, or the
        // start itself would be eased in from nothing
        box.style.setProperty('--mo-y', `${cut}px`);
        getComputedStyle(box).getPropertyValue('--mo-y');
        box.classList.add('mo-unroll');
        getComputedStyle(box).getPropertyValue('--mo-y');
        box.style.setProperty('--mo-y', `${end}px`);
        setTimeout(() => {
          box.classList.remove('mo-unroll');
          box.style.removeProperty('--mo-y');
          texts.forEach(t => t.style.removeProperty('--mo-top'));
        }, 1100);
      });
    }, true);
  }

  /* ── Back to the top: the arrow takes off ─────────────────────────────── */
  function initToTop() {
    document.addEventListener('click', e => {
      const btn = e.target.closest && e.target.closest('.totop');
      const svg = btn && $('svg', btn);
      if (!svg || !svg.animate) return;
      // up and away on an ease-in, then back in from below on a landing
      svg.animate([
        { translate: '0 0', opacity: 1, easing: 'cubic-bezier(.55, 0, .9, .45)' },
        { translate: '0 -20px', opacity: 0, offset: .4, easing: 'linear' },
        { translate: '0 16px', opacity: 0, offset: .41, easing: OUT },
        { translate: '0 0', opacity: 1 },
      ], { duration: 720 });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
