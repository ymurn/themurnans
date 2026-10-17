/* ==========================================================================
   THE MURNANS , the 404 page
   Names the address that went nowhere, rocks the sign when it is tapped,
   and deals one trip from memories.js, the same index the home page map
   reads, with a die to deal another.
   ========================================================================== */

(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);

  /* ── The address that went nowhere ─────────────────────────────────── */

  const asked = $('.lost__asked');
  let path = location.pathname;
  try { path = decodeURIComponent(path); } catch { /* keep it as it came */ }
  if (asked && !/(^|\/)404(\.html)?$/.test(path)) {
    $('.lost__path', asked).textContent = location.hostname.replace(/^www\./, '') + path;
    asked.hidden = false;
  }

  /* ── The sign rocks when it is tapped ──────────────────────────────── */

  const scene = $('.lost__scene');
  const sign = $('.lost__sign');
  if (scene && sign) {
    scene.addEventListener('click', () => {
      sign.classList.remove('is-rocking');
      void sign.offsetWidth;   // restart it, however fast the taps come
      sign.classList.add('is-rocking');
    });
    sign.addEventListener('animationend', e => {
      if (e.animationName === 'lost-rock') sign.classList.remove('is-rocking');
    });
  }

  /* ── A trip picked at random ───────────────────────────────────────── */

  const band = $('.lost__trip');
  const items = ((window.MW_MEMORIES || {}).items || []).filter(i => i.pics && i.pics.length && i.href);
  if (!band || !items.length) return;

  const card = $('.lost__card', band);
  const pic = $('.lost__pic', card);
  const img = $('img', pic);
  const roll = $('.lost__roll', band);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  let last = null;

  function deal() {
    let item;
    do { item = pick(items); } while (item === last && items.length > 1);
    last = item;
    const p = pick(item.pics);

    img.src = p.u;
    img.alt = p.c || item.place;
    img.style.objectPosition = p.p || '';
    $('.lost__when', card).textContent = item.date;
    $('.lost__where', card).textContent = item.place;
    $('.lost__words', card).textContent = item.text;
    pic.href = item.href;
    pic.setAttribute('aria-label', 'Read about ' + item.place);
    $('.lost__read', card).href = item.href;

    card.classList.remove('is-dealt');
    void card.offsetWidth;
    card.classList.add('is-dealt');
  }

  roll.addEventListener('click', () => {
    roll.classList.remove('is-rolling');
    void roll.offsetWidth;
    roll.classList.add('is-rolling');
    deal();
  });

  deal();
  band.hidden = false;
})();
