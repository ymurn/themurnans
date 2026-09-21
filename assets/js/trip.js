/* ==========================================================================
   THE MURNANS · one trip, told stop by stop
   The page template behind honeymoon.html and the highlights. Every trip
   page carries the same four pieces and gets them all from one file in
   assets/js/trips/: the head with a handful of photographs from the trip,
   the facts, the stops with the map running beside them, and the way on at
   the end. The map itself is assets/js/tripmap.js.

   The page holds the empty frames: #gallery, #facts, #jump, #trip, #closing.
   Styles are in assets/css/site.css, year.css, map.css and trip.css.
   ========================================================================== */

(() => {
  'use strict';

  const T = window.MW_TRIP;
  if (!T) return;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ARROW = '<svg class="btn__arrow" width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true"><path d="M0 4.5h13M10 1l3.5 3.5L10 8" stroke="currentColor" stroke-width="1.2"/></svg>';

  // once a frame, never once an event: see the same note in site.js
  const perFrame = fn => {
    let queued = false;
    const run = () => { queued = false; fn(); };
    return () => { if (queued) return; queued = true; requestAnimationFrame(run); };
  };

  const stops = T.stops || [];
  const pic = p => 'assets/' + p.src;

  /* ── The head: a few photographs from the trip ─────────────────────────
     Four prints, pinned up at their own angles. They are dealt fresh on
     every visit: one from each quarter of the trip, so the four of them
     cover the whole of it rather than one afternoon of it. */

  function deal(n = 4) {
    const pool = stops.flatMap(s => (s.photos || []).filter(p => p.src && p.pick !== false));
    if (!pool.length) return [];
    const out = [];
    const size = pool.length / n;
    for (let i = 0; i < n; i++) {
      const a = Math.floor(i * size), b = Math.max(a + 1, Math.floor((i + 1) * size));
      out.push(pool[a + Math.floor(Math.random() * (b - a))]);
    }
    return out;
  }

  const TILT = [-2.4, 1.8, 1.4, -2.2];
  const WASH = ['--blue', '--gold', '--rose', '--sage-500'];

  function renderGallery() {
    const host = $('#gallery');
    if (!host) return;
    const shots = deal(4);
    if (!shots.length) return host.remove();
    host.innerHTML = `
      <div class="tgal__grid" data-reveal="wipe" style="--d:140ms">${shots.map((p, i) => `
        <figure class="shot tgal__pic" data-shot data-src="${esc(pic(p))}" data-cap="${esc(p.cap || T.title)}"
                tabindex="0" role="button" aria-label="Enlarge: ${esc(p.cap || T.title)}"
                style="--tilt:${TILT[i % TILT.length]}deg;--off:var(${WASH[i % WASH.length]});--d:${80 + i * 90}ms">
          <img src="${esc(pic(p))}" alt="${esc(p.cap || T.title)}"${p.pos ? ` style="object-position:${esc(p.pos)}"` : ''} loading="eager" decoding="async">
        </figure>`).join('')}</div>
      <figcaption class="tgal__cap" data-reveal="fade" style="--d:560ms">
        <span>${esc(T.galleryNote || 'A few from the trip')}</span>
        <span class="tgal__zoom">Press one to see it big</span>
      </figcaption>`;
  }

  /* ── The facts ─────────────────────────────────────────────────────── */

  function renderFacts() {
    const host = $('#facts');
    if (!host || !T.facts) return;
    host.innerHTML = `<div class="facts">${T.facts.map((f, i) => `
      <div class="fact" data-reveal="up" style="--d:${i * 80}ms">
        <span class="fact__k">${esc(f.k)}</span>
        <span class="fact__v">${/^\d+$/.test(f.v) ? `<span data-count="${f.v}">${f.v}</span>` : esc(f.v)}</span>
        <span class="fact__s">${esc(f.s)}</span>
      </div>`).join('')}</div>
      ${T.note ? `<p class="ynote" data-reveal="up">${esc(T.note)}</p>` : ''}`;
  }

  /* ── The bar of stops ──────────────────────────────────────────────── */

  const id = i => `stop-${i + 1}`;

  function renderBar() {
    const host = $('#jump');
    if (!host) return;
    /* The other pages of the same kind come first, then a hairline, then
       this page's own stops. There is no page above these ones to go back
       to, so the way across to the others has to be the first thing in the
       bar: the stops scroll it along as they are read. */
    const sib = T.siblings;
    host.innerHTML = `
      ${sib ? `
      <span class="yearbar__label">${esc(sib.label)}</span>
      <div class="yearbar__list">${sib.items.map(y => y.here
        ? `<span class="yearbtn is-on" aria-current="page">${esc(y.label)}</span>`
        : `<a class="yearbtn" href="${esc(y.href)}">${esc(y.label)}</a>`).join('')}</div>
      <span class="yearbar__rule" aria-hidden="true"></span>` : ''}
      <span class="yearbar__label">${esc(T.barLabel || 'Jump to')}</span>
      <div class="yearbar__list">${stops.map((s, i) =>
        `<button class="yearbtn" type="button" data-i="${i}">${esc(s.chip || s.k)}</button>`).join('')}</div>`;
  }

  /* ── The stops ─────────────────────────────────────────────────────────
     A photo slot is { src, cap, pos }: "src" is a path from assets/, "cap"
     is what it says in the lightbox, and "pos" moves the crop when the
     people sit off to one side, like "65% 50%". */

  function stripHTML(photos, label, eager) {
    const list = (photos || []).slice(0, 6);
    if (!list.length) return '';
    return `<div class="strip strip--yr" data-n="${list.length}" data-reveal="wipe" style="--d:150ms">${list.map(p => {
      const cap = p.cap ? `${p.cap} · ${label}` : label;
      const pos = p.pos ? ` style="object-position:${esc(p.pos)}"` : '';
      return `<figure class="shot" data-shot data-src="${esc(pic(p))}" data-cap="${esc(cap)}" tabindex="0" role="button" aria-label="Enlarge: ${esc(p.cap || label)}"><img src="${esc(pic(p))}" alt="${esc(p.cap || label)}"${pos} loading="${eager ? 'eager' : 'lazy'}" decoding="async"></figure>`;
    }).join('')}</div>`;
  }

  function stopHTML(s, i) {
    const words = [].concat(s.text || []);
    return `
      <article class="chap chap--day chap--stop" id="${id(i)}" data-i="${i}">
        <div class="chap__aside">
          <span class="chap__dot" aria-hidden="true"></span>
          <div class="chap__sticky">
            <span class="chap__day">${esc(s.k)}${s.part ? `<span class="chap__part">${esc(s.part)}</span>` : ''}</span>
            ${s.sub ? `<span class="chap__date">${esc(s.sub)}</span>` : ''}
          </div>
        </div>
        <div class="chap__body">
          <div class="trip__head" data-reveal="up">
            ${s.where ? `<span class="trip__dates">${esc(s.where)}</span>` : ''}
            <h2 class="chap__place">${esc(s.title)}</h2>
          </div>
          ${s.quote ? `
          <figure class="stop__quote" data-reveal="up" style="--d:60ms">
            <blockquote class="stop__quote-text">${esc(s.quote.text)}</blockquote>
            <figcaption class="stop__quote-who">${esc(s.quote.who)}</figcaption>
          </figure>` : ''}
          ${s.lead ? `<p class="stop__line" data-reveal="up" style="--d:90ms">${esc(s.lead)}</p>` : ''}
          ${words.map((p, k) => `<p class="chap__text" data-reveal="up" style="--d:${(s.lead ? 150 : 90) + k * 60}ms">${esc(p)}</p>`).join('')}
          ${s.line ? `<p class="stop__line" data-reveal="up" style="--d:${90 + words.length * 60}ms">${esc(s.line)}</p>` : ''}
          ${stripHTML(s.photos, `${s.k}, ${s.title}`, i < 2)}
        </div>
      </article>`;
  }

  function renderBody() {
    const host = $('#trip');
    if (!host) return;
    const m = T.map || {};
    // the shape of the piece of map this trip shows, width over height, so
    // the map can be sized by the column and the screen at once
    if (m.view) document.documentElement.style.setProperty('--map-ar', (m.view[2] / m.view[3]).toFixed(3));
    const w = m.width ? ` style="--map-w:${m.width}"` : '';
    host.innerHTML = `
      <section class="timeline ttl">
        <span class="timeline__spine" aria-hidden="true"></span>
        <div class="shell">
          <div class="moon"${w}>
            <div class="moon__days">${stops.map(stopHTML).join('')}</div>
            <aside class="moon__map" aria-label="${esc(m.aria || 'Map of the trip')}">
              <div class="routemap routemap--trip" id="routemap"></div>
            </aside>
          </div>
        </div>
      </section>`;
  }

  /* ── The end of the page: the way on ───────────────────────────────── */

  function renderClosing() {
    const host = $('#closing');
    const c = T.closing;
    if (!host || !c) return;
    // "years": the band the year pages end on, four cards and the two things
    // we would rather someone did next. Anything else ends on its own buttons.
    if (c.years && window.MW_CLOSING) {
      return window.MW_CLOSING(host, { k: c.k, title: c.title, text: c.text });
    }
    host.innerHTML = `
      <div class="shell">
        <div class="tclose">
          <div class="stack gap-m">
            <span class="eyebrow eyebrow--brass" data-reveal="fade">${esc(c.k)}</span>
            <h2 class="t-xl" data-split>${esc(c.title)}</h2>
            ${c.text ? `<p class="lede" data-reveal="up" style="--d:120ms">${esc(c.text)}</p>` : ''}
            <div class="btns" data-reveal="up" style="--d:160ms">${(c.btns || []).map((b, i) =>
              `<a class="btn${b.ghost ? ' btn--ghost' : ''}" href="${esc(b.href)}" data-magnet>${esc(b.label)}${b.ghost ? '' : ARROW}</a>`).join('')}</div>
          </div>
        </div>
      </div>`;
  }

  /* ── Scroll: the spine, the live stop, the chip in the bar ──────────────
     Every position is read before a single class is written, so the page is
     laid out once a pass rather than once a stop. */

  function track() {
    const section = $('.ttl');
    const spine = $('.ttl .timeline__spine');
    const chaps = $$('.chap--stop');
    const bar = $('#jump');
    const chips = $$('#jump [data-i]');
    let live = null, lit = null;

    const tick = () => {
      const mid = innerHeight * 0.5, top = innerHeight * 0.6, bottom = innerHeight * 0.25;
      const box = section ? section.getBoundingClientRect() : null;
      const rects = chaps.map(ch => ch.getBoundingClientRect());

      if (spine && box) spine.style.setProperty('--spine', (clamp((mid - box.top) / box.height, 0, 1) * 100).toFixed(2) + '%');

      let now = null;
      chaps.forEach((ch, i) => {
        const on = rects[i].top < top && rects[i].bottom > bottom;
        ch.classList.toggle('is-in', on);
        if (on && !now) now = ch;
      });

      const i = now ? Number(now.dataset.i) : null;
      if (i !== lit) {
        lit = i;
        chips.forEach(b => b.classList.toggle('is-on', Number(b.dataset.i) === i));
        const on = chips.find(b => b.classList.contains('is-on'));
        if (on && bar && bar.scrollWidth > bar.clientWidth) {
          bar.scrollTo({ left: on.offsetLeft - bar.clientWidth / 2 + on.offsetWidth / 2, behavior: calm ? 'auto' : 'smooth' });
        }
      }
      if (now !== live) {
        live = now;
        document.dispatchEvent(new CustomEvent('trip:chapter', { detail: live }));
      }
    };

    tick();
    addEventListener('scroll', perFrame(tick), { passive: true });
    addEventListener('resize', perFrame(tick));

    chips.forEach(b => b.addEventListener('click', () => {
      const target = $(`#${id(Number(b.dataset.i))}`);
      if (!target) return;
      const top = target.getBoundingClientRect().top + scrollY - (bar ? bar.offsetHeight : 0) - 64;
      scrollTo({ top, behavior: calm ? 'auto' : 'smooth' });
    }));
  }

  function initMap() {
    const host = $('#routemap');
    if (!host || !window.MW_TRIPMAP || !window.MW_ATLAS || !T.route) return;
    const m = T.map || {};
    window.MW_TRIPMAP({
      host,
      wrap: host.closest('.moon'),
      band: host.closest('.moon__map'),
      bar: $('#jump'),
      atlas: window.MW_ATLAS,
      route: T.route,
      stops,
      view: m.view,
      chapters: $$('.chap--stop'),
      caption: i => stops[i]
        ? { k: stops[i].k, title: stops[i].title }
        : { k: m.sheet ? m.sheet.k : T.kicker, title: m.sheet ? m.sheet.title : T.title },
      aria: m.aria || `Map of ${T.title}`,
      whole: m.whole || 'Whole trip',
      sheet: m.sheet || { k: T.kicker, title: T.title },
      event: 'trip:chapter'
    });
  }

  renderGallery();
  renderFacts();
  renderBar();
  renderBody();
  renderClosing();
  initMap();
  track();
})();
