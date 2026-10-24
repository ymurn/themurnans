/* ==========================================================================
   THE MURNANS · home page motion, the script half
   assets/css/home-motion.css has the why. This file does the parts that
   need to know where the pointer is or how fast the page is moving:

     the drawings   lean towards the pointer, on a mouse or trackpad
     the ticker     runs with the scroll: faster on a flick, backwards on the
                    way up, a lean in the direction of travel, then back to
                    its own pace
     the tally      is set as milometer wheels before site.js can count it

   Every loop here runs only while something is moving and stops itself
   once it has settled, and nothing reads layout inside a frame that has
   written to it. Must load before site.js, which counts [data-count].
   ========================================================================== */

(() => {
  'use strict';

  const root = document.documentElement;
  if (/[?&]motion=off\b/.test(location.search)) { root.dataset.motion = 'off'; return; }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const lerp = (a, b, k) => a + (b - a) * k;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  /* ── The tally, as wheels ─────────────────────────────────────────────
     Built now, while site.js has yet to look for [data-count]. The right
     wheel turns two full times on its way round, the next one once, the
     rest only as far as they need to. */
  $$('.tally__n[data-count]').forEach(n => {
    const text = n.dataset.count;
    if (!/^\d+$/.test(text)) return;
    n.removeAttribute('data-count');
    const digits = [...text];
    const wheels = digits.map((d, i) => {
      const turns = Math.max(0, 2 - (digits.length - 1 - i));
      const to = turns * 10 + +d;
      let strip = '';
      for (let v = 0; v <= to; v++) strip += `<span>${v % 10}</span>`;
      return `<span class="hm-odo__d"><span class="hm-odo__w">${d}</span><span class="hm-odo__s" style="--to:${to};--k:${digits.length - 1 - i}">${strip}</span></span>`;
    }).join('');
    n.innerHTML = `<span class="hm-odo" aria-hidden="true">${wheels}</span><span class="hm-said">${text}</span>`;
  });

  const boot = () => {
    initLean();
    initTicker();
  };

  /* ── The drawings lean towards the pointer ────────────────────────────
     Depth by distance: the two of them come towards the pointer, the
     ampersand between them goes the other way, the colour wash behind
     drifts least of all. Written as translate, so it composes with the
     hover lift and the bounce, which use transform. */
  function initLean() {
    const hero = $('.hero');
    if (!hero || !fine.matches) return;
    const layers = [
      [$('.fig--bear'), 16, 9],
      [$('.fig--tiger'), 12, 7],
      [$('.stage__amp'), -10, -6],
    ].filter(l => l[0]);
    const wash = $('.hero__wash');
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, box = null;

    const frame = () => {
      x = lerp(x, tx, .075); y = lerp(y, ty, .075);
      const still = Math.abs(x - tx) < .001 && Math.abs(y - ty) < .001;
      if (still) { x = tx; y = ty; }
      layers.forEach(([el, kx, ky]) => { el.style.translate = `${(x * kx).toFixed(2)}px ${(y * ky).toFixed(2)}px`; });
      if (wash) wash.style.transform = `translate3d(${(x * -22).toFixed(2)}px, ${(y * -14).toFixed(2)}px, 0)`;
      raf = still ? 0 : requestAnimationFrame(frame);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(frame); };

    hero.addEventListener('pointerenter', () => { box = hero.getBoundingClientRect(); });
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!box) box = hero.getBoundingClientRect();
      tx = clamp((e.clientX - box.left) / box.width * 2 - 1, -1, 1);
      ty = clamp((e.clientY - box.top) / box.height * 2 - 1, -1, 1);
      go();
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; box = null; go(); });
    addEventListener('scroll', () => { box = null; }, { passive: true });
  }

  /* ── The ticker runs with the scroll ──────────────────────────────────
     Its own pace is the old CSS loop's: half the row every 46 seconds. The
     scroll adds to that while it lasts and the boost dies away over about
     a second. Only runs while the band is on screen. */
  function initTicker() {
    const band = $('.ticker');
    const row = band && $('.ticker__row', band);
    if (!row || !('IntersectionObserver' in window)) return;

    let half = 0, pace = 0, x = 0, boost = 0, lean = 0, hold = 1, holdTo = 1;
    let last = 0, lastY = scrollY, seen = false, raf = 0;

    const measure = () => {
      half = row.scrollWidth / 2;
      pace = half / 46000;                       // px per ms
    };

    const frame = now => {
      const dt = last ? Math.min(now - last, 50) : 16.7;
      last = now;
      // what the scroll has done since the last frame
      const y = scrollY, v = (y - lastY) / dt;  // px per ms, + when going down
      lastY = y;
      boost = lerp(boost, clamp(v * 3, -8, 8), .14);
      boost *= Math.pow(.94, dt / 16.7);
      lean = lerp(lean, clamp(-v * 3, -5, 5), .1);
      hold = lerp(hold, holdTo, .06);
      x -= pace * dt * (hold + boost);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      row.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${lean.toFixed(2)}deg)`;
      raf = seen && !document.hidden ? requestAnimationFrame(frame) : 0;
      if (!raf) last = 0;
    };
    const start = () => { if (!raf && seen && !document.hidden) { lastY = scrollY; raf = requestAnimationFrame(frame); } };

    measure();
    band.classList.add('hm-live');
    new IntersectionObserver(es => { seen = es[0].isIntersecting; start(); }).observe(band);
    document.addEventListener('visibilitychange', start);
    addEventListener('resize', () => { const p = half ? x / half : 0; measure(); x = p * half; });
    // a mouse resting on the band slows it to a stop, rather than freezing it
    if (fine.matches) {
      band.addEventListener('pointerenter', () => { holdTo = 0; });
      band.addEventListener('pointerleave', () => { holdTo = 1; });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
