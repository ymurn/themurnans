/* ==========================================================================
   THE MURNANS · the year pages
   Builds a year page from assets/js/years/index.js (every year and its card)
   and that year's own file (assets/js/years/2023.js and so on). It runs just
   before site.js, so the reveals, counters, lightbox and cursor all pick up
   what it builds.
   ========================================================================== */

(() => {
  'use strict';

  const Y = window.MW_YEAR;
  const YEARS = window.MW_YEARS || [];
  if (!Y) return;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const COUNT = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

  // "off" names in index.js, mapped to the palette in site.css
  const OFF = { gold: '--gold', sage: '--sage-500', rose: '--rose', coral: '--coral', blue: '--blue', khaki: '--khaki' };
  // placeholder washes and card tilts, dealt in turn
  const WASH = ['--blue', '--gold', '--rose', '--sage-500', '--khaki', '--coral'];
  const TILT = [-2.6, 1.8, -1.4, 2.4, -1.8, 1.2];

  // Once a frame, never once an event: see the same note in site.js.
  const perFrame = fn => {
    let queued = false;
    const run = () => { queued = false; fn(); };
    return () => { if (queued) return; queued = true; requestAnimationFrame(run); };
  };

  const ARROW = '<svg class="btn__arrow" width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true"><path d="M0 4.5h13M10 1l3.5 3.5L10 8" stroke="currentColor" stroke-width="1.2"/></svg>';

  // a little snapshot drawn in ink: two hills under one of the logo's stars
  const DOODLE = '<svg class="shot__doodle" viewBox="0 0 64 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 39.5 21.5 19l9 10.5 8.5-11.5 19.5 21.5"/><path d="M11 43c13-.9 31-1.1 43 .2"/><path d="M47 4.5c.6 3.6 1.8 4.9 5.2 5.6-3.4.7-4.6 2-5.2 5.6-.6-3.6-1.8-4.9-5.2-5.6 3.4-.7 4.6-2 5.2-5.6Z"/></svg>';

  const at   = YEARS.findIndex(y => y.year === Y.year);
  const me   = YEARS[at] || { year: Y.year, title: '', card: '' };

  const page  = y => `${y.year}.html`;
  const off   = y => `var(${OFF[y.off] || '--blue'})`;
  // the handwritten phrase in a heading, one word at a time: .squiggle is set
  // with no line height, so a phrase that wrapped inside one span would pile
  // its lines on top of each other
  const squig = s => esc(s).split(/\s+/).map(w => `<span class="squiggle">${w}</span>`).join(' ');

  /* ── The Christmas cards ─────────────────────────────────────────────── */

  // alt === '' marks a card whose link already carries the name
  function cardPic(y, sizes, eager, alt) {
    if (!y.card) {
      return `<span class="ycard-blank" aria-hidden="true"><span class="ycard-blank__year">${esc(y.year)}</span><span class="ycard-blank__note">Card to come</span></span>`;
    }
    const base = `assets/art/cards/${y.card}`;
    const text = alt ?? (y.alt || `Our ${y.year} Christmas card`);
    return `<img src="${base}-sm.jpg" srcset="${base}-sm.jpg 560w, ${base}.jpg 1400w" sizes="${sizes}" width="1400" height="1000" alt="${esc(text)}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
  }

  // this year's card, big, beside the title. Press it to see it properly.
  function renderCover() {
    const host = $('#cover');
    if (!host) return;
    host.style.setProperty('--off', off(me));
    const big = me.card ? `assets/art/cards/${me.card}.jpg` : '';
    const zoom = big
      ? ` data-shot data-src="${big}" data-cap="Our Christmas card, ${esc(me.year)}" tabindex="0" role="button" aria-label="Enlarge our ${esc(me.year)} Christmas card"`
      : '';
    host.innerHTML = `
      <div class="ycover__frame"${zoom}>${cardPic(me, '(max-width: 900px) 92vw, 44vw', true)}</div>
      <figcaption class="ycover__cap"><span>Our Christmas card</span><span class="ycover__yr">${esc(me.year)}</span></figcaption>`;
  }

  // every year's card in a row: the way to switch years
  function renderDeck() {
    const host = $('#deck');
    if (!host || !YEARS.length) return;
    host.innerHTML = `
      <p class="ydeck__label">Every year since the wedding</p>
      <ol class="ydeck__list" style="--n:${YEARS.length}">${YEARS.map((y, i) => {
        const here = y.year === Y.year;
        const inner = `
          <span class="ydeck__pic">${cardPic(y, '(max-width: 620px) 44vw, 180px', false, '')}</span>
          <span class="ydeck__year">${esc(y.year)}</span>
          <span class="ydeck__name">${esc(y.title)}</span>
          ${here ? '<span class="ydeck__here">You are here</span>' : ''}`;
        const card = here
          ? `<span class="ydeck__card is-here" aria-current="page">${inner}</span>`
          : `<a class="ydeck__card" href="${page(y)}" aria-label="${esc(y.year)}: ${esc(y.title)}">${inner}</a>`;
        return `<li class="ydeck__item" style="--off:${off(y)};--tilt:${TILT[i % TILT.length]}deg">${card}</li>`;
      }).join('')}</ol>`;
  }

  /* ── The bar: months of this year, then the other years ──────────────── */

  function renderBar() {
    const host = $('#jump');
    if (!host) return;
    const has = new Set((Y.months || []).map(m => m.month));
    if (Y.honeymoon) has.add(Y.honeymoon.month);

    const months = [];
    for (let m = Y.from || 1; m <= 12; m++) months.push(m);

    host.innerHTML = `
      <span class="yearbar__label">Jump to</span>
      <div class="yearbar__list ybar__months">${months.map(m => {
        const name = MONTHS[m - 1];
        const moon = Y.honeymoon && Y.honeymoon.month === m;
        return has.has(m)
          ? `<button class="yearbtn" type="button" data-month="${m}" aria-label="${name}${moon ? ', the honeymoon' : ''}">${name.slice(0, 3)}${moon ? '<span class="yearbtn__more"> · Honeymoon</span>' : ''}</button>`
          : `<span class="yearbtn yearbtn--empty">${name.slice(0, 3)}<span class="sr-only">: no trip</span></span>`;
      }).join('')}</div>
      <span class="yearbar__rule" aria-hidden="true"></span>
      <span class="yearbar__label">Year</span>
      <div class="yearbar__list ybar__years">${YEARS.map(y => y.year === Y.year
        ? `<span class="yearbtn is-on" aria-current="page">${esc(y.year)}</span>`
        : `<a class="yearbtn" href="${page(y)}">${esc(y.year)}</a>`).join('')}</div>`;
  }

  /* ── Pieces ──────────────────────────────────────────────────────────── */

  /* A number at the head of a value counts up, with whatever follows it held
     still, so "45+" and "12 of 12" animate the way a bare "15" does. Before
     this only pure digits were wrapped, which left the same card counting on
     one page and sitting still on another. initCounters in site.js reads
     data-count and data-suffix; day.html has always written the pair by hand.
     The same three lines are in assets/js/trip.js, which builds the identical card. */
  const countable = v => String(v).match(/^(\d+)(\D[\s\S]*)?$/);
  const factValue = v => {
    const m = countable(v);
    if (!m) return esc(v);
    return `<span data-count="${m[1]}"${m[2] ? ` data-suffix="${esc(m[2])}"` : ''}>${esc(v)}</span>`;
  };

  function factsHTML(list) {
    return `<div class="facts">${list.map((f, i) => `
      <div class="fact" data-reveal="up" style="--d:${i * 80}ms">
        <span class="fact__k">${esc(f.k)}</span>
        <span class="fact__v">${factValue(f.v)}</span>
        <span class="fact__s">${esc(f.s)}</span>
      </div>`).join('')}</div>`;
  }

  // A photo slot with "src" is a photograph; without one it is a placeholder
  // that shows its caption as the hint for which picture goes there.
  // A bare name is in assets/photos/2023/; a path with a folder in it starts
  // from assets/, like "continued_trips/2023-06-colorado/2023-06-colorado-06.jpg".
  // "pos" moves the crop when the people sit off to one side: any CSS
  // object-position, like "right" or "80% 50%".
  function stripHTML(photos, label, eager) {
    const list = (photos || []).slice(0, 6);
    if (!list.length) return '';
    return `<div class="strip strip--yr" data-n="${list.length}" data-reveal="wipe" style="--d:150ms">${list.map((p, k) => {
      if (p.src) {
        const url = 'assets/' + (p.src.includes('/') ? p.src : `photos/${Y.year}/${p.src}`);
        const cap = p.cap ? `${p.cap} · ${label}` : label;
        const pos = p.pos ? ` style="object-position:${esc(p.pos)}"` : '';
        return `<figure class="shot" data-shot data-src="${esc(url)}" data-cap="${esc(cap)}" tabindex="0" role="button" aria-label="Enlarge: ${esc(p.cap || label)}"><img src="${esc(url)}" alt="${esc(p.cap || label)}"${pos} loading="${eager ? 'eager' : 'lazy'}" decoding="async"></figure>`;
      }
      return `<figure class="shot shot--empty" role="img" aria-label="Photo to come: ${esc(p.cap)}" style="--wash:var(${WASH[k % WASH.length]})">${DOODLE}<figcaption class="shot__hint">${esc(p.cap)}</figcaption></figure>`;
    }).join('')}</div>`;
  }

  function timelineHTML(inner, cls = '') {
    return `
      <section class="timeline ytl ${cls}">
        <span class="timeline__spine" aria-hidden="true"></span>
        <div class="shell">${inner}</div>
      </section>`;
  }

  function monthHTML(m) {
    const name = MONTHS[m.month - 1];
    const n = m.trips.length;
    return `
      <article class="chap chap--month" id="${name.toLowerCase()}" data-month="${m.month}">
        <div class="chap__aside">
          <span class="chap__dot" aria-hidden="true"></span>
          <div class="chap__sticky">
            <h2 class="chap__month">${name}</h2>
            <span class="chap__count">${COUNT[n] || n} ${n === 1 ? 'trip' : 'trips'}</span>
          </div>
        </div>
        <div class="chap__body mrow">
          <div class="mrow__trips">${m.trips.map((t, k) => `
            <section class="trip" data-reveal="up" style="--d:${k * 90}ms">
              <span class="trip__dates">${esc(t.dates)}</span>
              <h3 class="trip__place">${esc(t.place)}</h3>
              ${[].concat(t.text).map(p => `<p class="trip__text">${esc(p)}</p>`).join('')}
            </section>`).join('')}
          </div>
          ${stripHTML(m.photos, `${name} ${Y.year}`)}
        </div>
      </article>`;
  }

  function honeymoonHTML(h) {
    const route = h.route || [];
    const from = route.length ? route[0][0] : '';
    const to = route.length ? route[route.length - 1][0] : '';

    const days = h.days.map((d, i) => `
      <article class="chap chap--day" id="day-${d.day}${d.part ? '-' + d.part.replace(/\D/g, '') : ''}" data-month="${h.month}" data-leg="${(d.leg || []).join(',')}">
        <div class="chap__aside">
          <span class="chap__dot" aria-hidden="true"></span>
          <div class="chap__sticky">
            <span class="chap__day">Day ${d.day}${d.part ? `<span class="chap__part">${esc(d.part)}</span>` : ''}</span>
            <span class="chap__date">${esc(d.date)}</span>
          </div>
        </div>
        <div class="chap__body">
          <div class="trip__head" data-reveal="up">
            <span class="trip__dates">${esc(d.where)}</span>
            <h3 class="chap__place">${esc(d.title)}</h3>
          </div>
          ${[].concat(d.text).map((p, k) => `<p class="chap__text" data-reveal="up" style="--d:${90 + k * 60}ms">${esc(p)}</p>`).join('')}
          ${stripHTML(d.photos, `Day ${d.day}, ${d.title}`, i < 2)}
        </div>
      </article>`).join('');

    return `
      <section class="band band--facts moon-head" id="honeymoon" data-month="${h.month}">
        <div class="shell">
          <div class="sec-head">
            <span class="sec-head__idx">${esc(h.dates)}</span>
            <div class="sec-head__body">
              <h2 class="t-lg" data-split>${esc(h.title)}, ${squig(`${from} to ${to}.`)}</h2>
              <p class="lede lede--wide" data-reveal="up" style="--d:120ms">${esc(h.intro)}</p>
            </div>
          </div>
          ${factsHTML(h.facts || [])}
        </div>
      </section>
      ${timelineHTML(`
        <div class="moon">
          <div class="moon__days">${days}</div>
          ${route.length ? '<aside class="moon__map" aria-label="Map of the honeymoon route"><div class="routemap" id="routemap"></div></aside>' : ''}
        </div>`, 'ytl--moon')}`;
  }

  function quoteHTML(q) {
    return `
      <section class="band band--deep yquote">
        <div class="shell shell--narrow">
          <figure class="yquote__fig" data-reveal="up">
            <blockquote class="quote">
              <span class="quote__mark" aria-hidden="true">“</span>
              <p class="serif-note yquote__text">${esc(q.text)}</p>
            </blockquote>
            <figcaption class="yquote__who"><span class="yquote__name">${esc(q.who)}</span><span class="tag">${esc(q.role)}</span></figcaption>
          </figure>
          ${q.note ? `<p class="lede yquote__note" data-reveal="up" style="--d:140ms">${esc(q.note)}</p>` : ''}
        </div>
      </section>`;
  }

  function letterHTML(l) {
    return `
      <section class="band band--paper2 yletter">
        <div class="shell">
          <div class="sec-head">
            <span class="sec-head__idx">Looking back</span>
            <div class="sec-head__body">
              <h2 class="t-lg" data-split>Our New Year's <span class="squiggle">letter.</span></h2>
            </div>
          </div>
          <article class="letter" data-reveal="up">
            <header class="letter__head">
              <span class="letter__date">${esc(l.date)}${l.place ? ` · ${esc(l.place)}` : ''}</span>
              <h3 class="letter__title">${esc(l.title)}</h3>
            </header>
            <div class="letter__body">${l.paras.map(p => `<p>${esc(p)}</p>`).join('')}</div>
            <footer class="letter__sign">
              <img src="assets/art/David-Script.png" alt="David" width="600" height="360" loading="lazy" decoding="async">
              <span class="letter__amp" aria-hidden="true">&amp;</span>
              <img src="assets/art/Yinja-Script.png" alt="Yinja" width="600" height="360" loading="lazy" decoding="async">
            </footer>
          </article>
        </div>
      </section>`;
  }

  function renderBody() {
    const host = $('#year');
    if (!host) return;
    const months = Y.months || [];
    const restHead = Y.honeymoon && months.length ? `
      <section class="band band--tight yrest">
        <div class="shell">
          <div class="sec-head">
            <span class="sec-head__idx">${MONTHS[months[0].month - 1]} to ${MONTHS[months[months.length - 1].month - 1]}</span>
            <div class="sec-head__body">
              <h2 class="t-lg" data-split>The rest of ${esc(Y.year)}, ${squig('month by month.')}</h2>
              ${Y.note ? `<p class="lede lede--wide" data-reveal="up" style="--d:120ms">${esc(Y.note)}</p>` : ''}
            </div>
          </div>
        </div>
      </section>` : '';

    host.innerHTML = [
      Y.facts ? `<section class="band band--facts yfacts"><div class="shell">${factsHTML(Y.facts)}${!Y.honeymoon && Y.note ? `<p class="ynote" data-reveal="up">${esc(Y.note)}</p>` : ''}</div></section>` : '',
      Y.honeymoon ? honeymoonHTML(Y.honeymoon) : '',
      Y.quote ? quoteHTML(Y.quote) : '',
      months.length ? restHead + timelineHTML(`
        <div class="ymap">
          <div class="ytl__list">${months.map(monthHTML).join('')}</div>
          <aside class="ymap__map" aria-label="Map of this year's trips"><div class="yearmap" id="yearmap"></div></aside>
        </div>`, 'ytl--months') : '',
      Y.letter ? letterHTML(Y.letter) : ''
    ].join('');
  }

  /* ── The end of the page ───────────────────────────────────────────────
     The same band every long page on the site ends on: the four cards, one
     a year, and the two things we would rather someone did next. It is
     assets/js/closing.js, shared with the trip pages. */

  function renderClosing() {
    const host = $('#closing');
    if (!host || !window.MW_CLOSING) return;
    window.MW_CLOSING(host, {
      here: Y.year,
      k: 'After the Wedding',
      title: 'Every year since.',
      text: "One page a year since the wedding, each of them David's posts as he wrote them. Or start with the days that got a page of their own."
    });
  }

  /* ── Scroll: the spine, the live chapter, the month in the bar ───────── */

  function track() {
    const sections = $$('.ytl');
    const chaps = $$('.ytl .chap');
    const bar = $('#jump');
    const buttons = $$('#jump [data-month]');
    const head = $('#honeymoon');
    let lastLive = null, lastMonth = null;

    const tick = () => {
      // every position first, then the classes: a class written between two
      // reads makes the browser lay the whole page out again
      const mid = innerHeight * 0.5, top = innerHeight * 0.6, bottom = innerHeight * 0.25;
      const secBoxes = sections.map(sec => sec.getBoundingClientRect());
      const rects = chaps.map(ch => ch.getBoundingClientRect());
      const headBox = head ? head.getBoundingClientRect() : null;

      sections.forEach((sec, i) => {
        const spine = $('.timeline__spine', sec);
        const box = secBoxes[i];
        if (spine) spine.style.setProperty('--spine', (clamp((mid - box.top) / box.height, 0, 1) * 100).toFixed(2) + '%');
      });

      let live = null;
      chaps.forEach((ch, i) => {
        const on = rects[i].top < top && rects[i].bottom > bottom;
        ch.classList.toggle('is-in', on);
        if (on && !live) live = ch;
      });

      let month = live ? Number(live.dataset.month) : null;
      if (!live && headBox && headBox.top < mid && headBox.bottom > 0) month = Number(head.dataset.month);
      if (month !== lastMonth) {
        lastMonth = month;
        buttons.forEach(b => b.classList.toggle('is-on', Number(b.dataset.month) === month));
        const on = buttons.find(b => b.classList.contains('is-on'));
        if (on && bar && bar.scrollWidth > bar.clientWidth) {
          bar.scrollTo({ left: on.offsetLeft - bar.clientWidth / 2 + on.offsetWidth / 2, behavior: calm ? 'auto' : 'smooth' });
        }
      }
      if (live !== lastLive) {
        lastLive = live;
        document.dispatchEvent(new CustomEvent('year:chapter', { detail: live }));
      }
    };

    tick();
    addEventListener('scroll', perFrame(tick), { passive: true });
    addEventListener('resize', tick);

    buttons.forEach(b => b.addEventListener('click', () => {
      const m = Number(b.dataset.month);
      const target = Y.honeymoon && Y.honeymoon.month === m ? head : $(`.chap--month[data-month="${m}"]`);
      if (!target) return;
      const top = target.getBoundingClientRect().top + scrollY - (bar ? bar.offsetHeight : 0) - 64;
      scrollTo({ top, behavior: calm ? 'auto' : 'smooth' });
    }));
  }

  /* ── The honeymoon map ─────────────────────────────────────────────────
     The coast, three state lines and our route, drawn from latitude and
     longitude. On a wide screen it rides beside the days: as each day
     scrolls past, its stretch of the drive inks in and its stops get their
     names. On a narrower one it unrolls from under the bar once the days
     reach it, zoomed in on each drive, with the whole trip a tap away. */

  // Pacific coast from Bodega Bay north, along the Strait of Juan de Fuca,
  // down the west shore of Puget Sound to Olympia and up its east shore
  const COAST = [
    [38.20, -122.97], [38.30, -123.07], [38.51, -123.24], [38.95, -123.74], [39.28, -123.80],
    [39.80, -123.85], [40.02, -124.07], [40.44, -124.41], [40.80, -124.23], [41.06, -124.15],
    [41.30, -124.10], [41.75, -124.23], [42.05, -124.29], [42.44, -124.43], [42.84, -124.57],
    [43.37, -124.33], [43.97, -124.12], [44.63, -124.07], [45.00, -124.01], [45.46, -123.98],
    [45.92, -123.97], [46.25, -124.05], [46.66, -124.07], [46.90, -124.12], [47.35, -124.29],
    [47.92, -124.64], [48.17, -124.74], [48.38, -124.72], [48.37, -124.60], [48.26, -124.30],
    [48.16, -123.90], [48.12, -123.43], [48.18, -123.11], [48.12, -122.76], [47.91, -122.62],
    [47.64, -122.55], [47.30, -122.60], [47.05, -122.90], [47.27, -122.44], [47.60, -122.36],
    [47.98, -122.24], [48.45, -122.52], [48.75, -122.50], [49.00, -122.75]
  ];
  const BORDERS = [
    [[42.00, -124.21], [42.00, -119.60]],                                  // California and Oregon
    [[42.00, -120.00], [39.00, -120.00], [38.54, -119.60]],                // California and Nevada
    [[46.25, -123.98], [46.19, -123.40], [46.12, -122.95], [45.65, -122.76], [45.57, -122.25],
     [45.71, -121.52], [45.61, -121.15], [45.70, -120.50], [45.93, -119.60]] // the Columbia
  ];
  const STATES = [['Washington', 47.30], ['Oregon', 43.55], ['California', 39.25]];
  const BOX = { n: 49.0, s: 38.2, w: -125.9, e: -119.6 };
  const KY = 100;                                    // svg units per degree of latitude
  const KX = KY * Math.cos(43.6 * Math.PI / 180);    // and of longitude, at this latitude

  // Past the frame, drawn only in the band, where the view pans and zooms out
  // beyond it: the coast south to Monterey Bay, open sea to the west, and the
  // state lines on east to Idaho and Nevada
  const COAST_SOUTH = [
    [36.60, -121.90], [36.95, -122.05], [37.25, -122.40], [37.50, -122.50], [37.81, -122.52],
    [37.99, -123.00], [38.20, -122.97]
  ];
  const SEA_FAR = [[49.20, -123.10], [51.00, -128.00], [58.00, -132.00], [58.00, -165.00], [30.00, -165.00], [30.00, -120.00]];
  const BORDERS_FAR = [
    [[42.00, -119.60], [42.00, -114.04]],                                  // Oregon and Idaho above, Nevada below
    [[38.54, -119.60], [35.00, -114.63]],                                  // California and Nevada
    [[45.93, -119.60], [46.00, -118.98], [46.00, -116.92]],                // Washington and Oregon
    [[42.00, -117.03], [43.80, -117.03], [44.30, -117.20], [45.60, -116.46], [46.00, -116.92],
     [46.43, -117.04], [49.00, -117.04]]                                   // Idaho
  ];

  function initRouteMap(h) {
    const host = $('#routemap');
    if (!host) return;
    const route = h.route, days = h.days;
    const W = (BOX.e - BOX.w) * KX, H = (BOX.n - BOX.s) * KY;
    const xy = (lat, lon) => [(lon - BOX.w) * KX, (BOX.n - lat) * KY];
    const geo = list => list.map(([lat, lon]) => xy(lat, lon));
    const f = n => n.toFixed(1);
    const P = route.map(([, lat, lon]) => xy(lat, lon));
    const poly = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('');

    // The direction the line leaves stop i in, Catmull-Rom style. Where the
    // drive doubles back the stop becomes a corner, or the curve would loop;
    // next to a short hop the pull is capped, or the curve would overshoot.
    const tan = i => {
      if (i <= 0 || i >= P.length - 1) return [0, 0];
      const [ax, ay] = P[i - 1], [bx, by] = P[i], [cx, cy] = P[i + 1];
      const v1 = [bx - ax, by - ay], v2 = [cx - bx, cy - by];
      if (v1[0] * v2[0] + v1[1] * v2[1] <= 0) return [0, 0];
      const t = [(cx - ax) / 6, (cy - ay) / 6];
      const cap = 0.45 * Math.min(Math.hypot(...v1), Math.hypot(...v2));
      const k = Math.min(1, cap / (Math.hypot(...t) || 1));
      return [t[0] * k, t[1] * k];
    };

    // a stretch of the route through stops a to b
    const curve = (a, b) => {
      let d = `M${f(P[a][0])} ${f(P[a][1])}`;
      for (let i = a; i < b; i++) {
        const t1 = tan(i), t2 = tan(i + 1), p1 = P[i], p2 = P[i + 1];
        d += `C${f(p1[0] + t1[0])} ${f(p1[1] + t1[1])} ${f(p2[0] - t2[0])} ${f(p2[1] - t2[1])} ${f(p2[0])} ${f(p2[1])}`;
      }
      return d;
    };

    const coast = geo(COAST);
    const nw = xy(BOX.n, BOX.w), sw = xy(BOX.s, BOX.w);
    const last = P.length - 1;

    const draw = () => `
      <svg viewBox="0 0 ${f(W)} ${f(H)}" role="img" aria-label="Our route from ${esc(route[0][0])} to ${esc(route[last][0])}, through California, Oregon and Washington">
        <g class="routemap__far">
          <path class="routemap__sea" d="${poly(geo([...COAST_SOUTH, ...COAST, ...SEA_FAR]))}Z"/>
          <path class="routemap__coast" d="${poly(geo(COAST_SOUTH))}"/>
          ${BORDERS_FAR.map(b => `<path class="routemap__border" d="${poly(geo(b))}"/>`).join('')}
        </g>
        <path class="routemap__sea" d="${poly(coast)}L${f(nw[0])} ${f(nw[1])}L${f(sw[0])} ${f(sw[1])}Z"/>
        ${BORDERS.map(b => `<path class="routemap__border" d="${poly(geo(b))}"/>`).join('')}
        <path class="routemap__coast" d="${poly(coast)}"/>
        ${STATES.map(([name, lat]) => `<text class="routemap__state" x="${f(W - 10)}" y="${f(xy(lat, 0)[1])}" text-anchor="end">${name.toUpperCase()}</text>`).join('')}
        <text class="routemap__ocean" transform="translate(${f(xy(0, -125.45)[0])} ${f(xy(43.3, 0)[1])}) rotate(-90)" text-anchor="middle">PACIFIC OCEAN</text>
        <path class="routemap__base" d="${curve(0, last)}"/>
        ${days.map((d, i) => d.leg && d.leg[1] > d.leg[0] ? `<path class="routemap__leg" data-day="${i}" pathLength="1" d="${curve(d.leg[0], d.leg[1])}"/>` : '').join('')}
        ${P.map((p, s) => `<circle class="routemap__dot" data-stop="${s}" cx="${f(p[0])}" cy="${f(p[1])}" r="3"/>`).join('')}
        ${P.map((p, s) => `<text class="routemap__label${s === 0 || s === last ? ' is-anchor' : ''}" data-stop="${s}" y="${f(p[1])}" dy=".35em">${esc(route[s][0].toUpperCase())}</text>`).join('')}
      </svg>`;

    host.innerHTML = `
      <div class="routemap__view">${draw()}</div>
      <div class="routemap__foot">
        <p class="routemap__now" aria-live="polite"></p>
        <button class="routemap__whole" type="button" aria-haspopup="dialog">Whole route</button>
      </div>`;

    // The whole trip in a window of its own, opened from the band
    const sheet = document.createElement('dialog');
    sheet.className = 'routesheet';
    sheet.setAttribute('aria-labelledby', 'routesheet-title');
    sheet.innerHTML = `
      <div class="routesheet__head">
        <span class="routesheet__k">${esc(h.dates)}</span>
        <h2 class="routesheet__title" id="routesheet-title">${esc(route[0][0])} to ${esc(route[last][0])}</h2>
        <button class="routesheet__close" type="button" aria-label="Close the map">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="routesheet__map">${draw()}</div>
      <p class="routemap__now routesheet__now"></p>`;
    document.body.appendChild(sheet);

    const kit = root => ({ svg: $('svg', root), legs: $$('.routemap__leg', root), dots: $$('.routemap__dot', root), labels: $$('.routemap__label', root) });
    const main = kit($('.routemap__view', host));
    const whole = kit($('.routesheet__map', sheet));
    const caps = [$('.routemap__now', host), $('.routesheet__now', sheet)];
    const chapters = $$('.chap--day');
    const ytl = host.closest('.ytl');
    const moon = host.closest('.moon');
    const band = host.closest('.moon__map');
    const bar = $('#jump');
    // the floating window, rather than the band under the bar: the same
    // measurement as the one in assets/css/map.css
    const wide = matchMedia('(min-width: 1180px)');
    let shown = null, cur = null, raf = 0, stop = 0, onBand = false, folded = false;

    // screen pixels per svg unit, with the dots kept one size on screen
    function paint(m, k) {
      m.svg.style.setProperty('--mapk', k.toFixed(4));
      m.dots.forEach(c => c.setAttribute('r', f(Number(c.dataset.r || 3.2) / k)));
    }

    // In the band: the piece of map around stops a to b, with room for their
    // names, cut to the band's own shape. A day that stays put still gets a
    // little of the country round it.
    function frame(a, b) {
      const bw = main.svg.clientWidth || 1, bh = main.svg.clientHeight || 1;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let s = a; s <= b; s++) {
        x0 = Math.min(x0, P[s][0]); x1 = Math.max(x1, P[s][0]);
        y0 = Math.min(y0, P[s][1]); y1 = Math.max(y1, P[s][1]);
      }
      const s = Math.min(bw / (Math.max(x1 - x0, 140) * 1.6), bh / (Math.max(y1 - y0, 100) * 1.4));
      return [(x0 + x1) / 2 - bw / s / 2, (y0 + y1) / 2 - bh / s / 2, bw / s, bh / s];
    }

    // Glide the band to view v: the center slides and the zoom eases evenly.
    // A timer lands it too, in case frames stop coming.
    function fly(v) {
      cancelAnimationFrame(raf);
      clearTimeout(stop);
      const bw = main.svg.clientWidth || 1;
      const land = () => { cur = v; main.svg.setAttribute('viewBox', v.map(f).join(' ')); paint(main, bw / v[2]); };
      const from = cur;
      if (!from || calm) return land();
      const t0 = performance.now(), dur = 850, ratio = v[3] / v[2];
      const fc = [from[0] + from[2] / 2, from[1] + from[3] / 2], tc = [v[0] + v[2] / 2, v[1] + v[3] / 2];
      const step = now => {
        const t = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - t, 3);
        const vw = from[2] * Math.pow(v[2] / from[2], e), vh = vw * ratio;
        const cx = fc[0] + (tc[0] - fc[0]) * e, cy = fc[1] + (tc[1] - fc[1]) * e;
        cur = [cx - vw / 2, cy - vh / 2, vw, vh];
        main.svg.setAttribute('viewBox', cur.map(f).join(' '));
        paint(main, bw / vw);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      stop = setTimeout(() => { cancelAnimationFrame(raf); land(); }, dur + 250);
    }

    // Ink map m for live day i: -1 before the trip, days.length once it is
    // over. v is the piece of map on screen, at k screen pixels a unit.
    function mark(m, i, v, k) {
      const day = days[i];
      const [a, b] = day && day.leg ? day.leg : [-1, -1];
      const seen = day ? b : (i >= days.length ? last : -1);

      m.legs.forEach(l => {
        const n = Number(l.dataset.day);
        l.classList.toggle('is-done', n < i);
        l.classList.toggle('is-now', n === i);
      });
      m.dots.forEach(c => {
        const s = Number(c.dataset.stop);
        const now = s >= a && s <= b;
        c.classList.toggle('is-now', now);
        c.classList.toggle('is-seen', s <= seen);
        c.dataset.r = now ? 5.5 : 3.2;
      });

      // Name the stops. On a day: the ones in its "where" line first, then the
      // rest of the day latest first, then the two ends of the trip. Without a
      // day: the two ends, then every stop in order. A name sits to the right
      // of its dot, or to the left if that side is taken, or is left off.
      const u = 1 / k;                                      // one screen pixel in svg units
      const today = [];
      for (let s = a; s <= b && s > -1; s++) today.push(s);
      const where = day ? day.where.toLowerCase() : '';
      const order = day
        ? [...today.filter(s => where.includes(route[s][0].toLowerCase())), ...today.slice().reverse(), 0, last]
        : [0, last, ...P.map((_, s) => s)];

      const boxes = STATES.map(([name, lat]) => {           // the state names along the east edge
        const y = xy(lat, 0)[1];
        return [W - 10 - name.length * 8.4 * u, y - 7 * u, W - 10, y + 7 * u];
      });
      (day ? today : []).forEach(s => boxes.push([P[s][0] - 5 * u, P[s][1] - 5 * u, P[s][0] + 5 * u, P[s][1] + 5 * u]));
      const [vx, vy, vw, vh] = v;                           // names stay inside what is on screen
      const hits = r => r[0] < vx || r[2] > vx + vw || r[1] < vy || r[3] > vy + vh ||
        boxes.some(o => r[0] < o[2] && r[2] > o[0] && r[1] < o[3] && r[3] > o[1]);

      const names = new Set(), side = new Map();
      for (const s of order) {
        const name = route[s][0];
        if (names.has(name)) continue;
        const [x, y] = P[s], w = name.length * 7.4 * u, hh = 13 * u, gap = 9 * u;
        const right = [x + gap, y - hh / 2, x + gap + w, y + hh / 2];
        const left = [x - gap - w, y - hh / 2, x - gap, y + hh / 2];
        const at = !hits(right) ? 'right' : !hits(left) ? 'left' : null;
        if (!at) continue;
        boxes.push(at === 'right' ? right : left);
        names.add(name);
        side.set(s, at);
      }
      m.labels.forEach(t => {
        const s = Number(t.dataset.stop), at = side.get(s);
        if (at) {
          t.setAttribute('x', f(P[s][0] + (at === 'right' ? 9 : -9) * u));
          t.setAttribute('text-anchor', at === 'right' ? 'start' : 'end');
        }
        t.classList.toggle('is-on', !!at);
      });
    }

    function show(i) {
      shown = i;
      const day = days[i];
      const full = [0, 0, W, H];
      if (folded && !wide.matches) {
        // folded into the pill: nothing to draw but the name of the day
      } else if (wide.matches) {
        const k = main.svg.getBoundingClientRect().height / H || 0.6;
        cur = null;
        main.svg.setAttribute('viewBox', full.map(f).join(' '));
        mark(main, i, full, k);
        paint(main, k);
      } else {
        const v = day ? frame(day.leg[0], day.leg[1]) : frame(0, last);
        mark(main, i, v, (main.svg.clientWidth || 1) / v[2]);
        fly(v);
      }
      if (sheet.open) {
        const k = whole.svg.getBoundingClientRect().height / H || 0.6;
        mark(whole, i, full, k);
        paint(whole, k);
      }
      const html = day
        ? `<span class="routemap__day">Day ${day.day}${day.part ? ` · ${esc(day.part)}` : ''}</span><span class="routemap__title">${esc(day.title)}</span>`
        : `<span class="routemap__day">${esc(h.dates)}</span><span class="routemap__title">${esc(route[0][0])} to ${esc(route[last][0])}</span>`;
      caps.forEach(c => { c.innerHTML = html; });
    }

    // On a wide screen the live day comes from the page's scroll tracking
    const fromScroll = live => {
      if (!wide.matches) return;
      const i = live ? chapters.indexOf(live) : -1;
      if (i > -1) return show(i);
      const r = ytl ? ytl.getBoundingClientRect() : null;
      show(r && r.bottom < innerHeight * 0.5 ? days.length : -1);
    };

    // On a narrower one the band stays tucked under the bar until the first
    // day reaches it, and tucks away again once the last has gone under it.
    // The live day is the last whose top has passed a line a third of the
    // way down the screen below the band.
    const barBottom = () => (bar ? bar.getBoundingClientRect().bottom : 0);
    const edge = () => barBottom() + band.offsetHeight;
    function pick() {
      const e = edge(), line = e + (innerHeight - e) * 0.33;
      let i = -1;
      chapters.forEach((ch, n) => { if (ch.getBoundingClientRect().top < line) i = n; });
      return moon.getBoundingClientRect().bottom < line ? days.length : i;
    }
    function fromBand() {
      // the bar's own position says whether the days have reached it yet: see
      // the same note in assets/js/trailmap.js
      const r = moon.getBoundingClientRect(), e = edge();
      const on = r.top < barBottom() && r.bottom > e + 40;
      if (on !== onBand) {
        onBand = on;
        band.classList.toggle('is-on', on);
        band.inert = !on;
        if (on) cur = null;                                 // arrive already on the right day
      }
      const i = pick();
      if (i !== shown || cur === null) show(i);
    }

    // the band sits right under the bar, however tall the bar wraps
    const measure = () => { if (bar) moon.style.setProperty('--ybar-h', `${bar.offsetHeight}px`); };
    const layout = () => {
      measure();
      cur = null;                                           // a new size lands at once
      if (wide.matches) {
        onBand = false;
        band.classList.remove('is-on');
        band.inert = false;
        if (sheet.open) sheet.close();
        show(shown ?? -1);
      } else {
        band.inert = !onBand;
        fromBand();
      }
    };

    document.addEventListener('year:chapter', e => fromScroll(e.detail));
    addEventListener('scroll', perFrame(() => { if (!wide.matches) fromBand(); }), { passive: true });
    addEventListener('resize', layout);
    $('.routemap__whole', host).addEventListener('click', () => {
      sheet.showModal();
      show(shown ?? -1);
    });
    // the band's own two controls, the same ones every map on the site carries
    if (window.MW_MAPFOLD) {
      window.MW_MAPFOLD({
        host, wrap: moon,
        view: $('.routemap__view', host),
        foot: $('.routemap__foot', host),
        whole: $('.routemap__whole', host),
        onFold: min => {
          folded = min;
          if (!min) { cur = null; show(shown ?? -1); }   // back at the day being read
        }
      });
    }
    $('.routesheet__close', sheet).addEventListener('click', () => sheet.close());
    sheet.addEventListener('click', e => {                  // a tap on the dimmed page closes it
      const r = sheet.getBoundingClientRect();
      if (e.target === sheet && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) sheet.close();
    });
    if (document.fonts) document.fonts.ready.then(measure);
    layout();
    if (wide.matches) fromScroll(null);
  }

  /* ── The year's map ────────────────────────────────────────────────────
     Every place this year's photographs were taken, drawn by the shared
     component in assets/js/trailmap.js. The stops come from the trip folders
     each month's photographs sit in, looked up in years/places.js. */

  function initYearMap() {
    const host = $('#yearmap');
    const A = window.MW_ATLAS, PL = window.MW_PLACES;
    if (!host || !A || !PL || !window.MW_TRAILMAP) return;

    // the trip folders a month's photographs come from, and their stops
    const folders = list => [...new Set((list || [])
      .filter(p => p.src && p.src.indexOf('continued_trips/') === 0)
      .map(p => p.src.split('/')[1]))];
    // A month also puts on the map any trip folder named in its own "folders",
    // for the places a big trip went that its five photographs can't cover.
    const stopsOf = (list, extra) => [...folders(list), ...(extra || [])].flatMap(f => PL[f] || []);
    const months = (Y.months || []).map(m => ({ month: m.month, stops: stopsOf(m.photos, m.folders) }));
    const moon = Y.honeymoon ? (Y.honeymoon.days || []).flatMap(d => stopsOf(d.photos, d.folders)) : [];
    if (!months.some(m => m.stops.length) && !moon.length) return;

    const at = m => months.findIndex(x => x.month === m);

    window.MW_TRAILMAP({
      host,
      wrap: host.closest('.ymap'),
      band: host.closest('.ymap__map'),
      bar: $('#jump'),
      atlas: A,
      groups: months,
      seed: moon,
      chapters: $$('.chap--month'),
      groupOf: el => (el && el.classList.contains('chap--month') ? at(Number(el.dataset.month)) : -1),
      caption: (i, said, n) => months[i]
        ? { k: MONTHS[months[i].month - 1], title: said || 'No photographs yet' }
        : { k: Y.year, title: `${n} places` },
      aria: `Map of our ${Y.year} trips`,
      whole: 'Whole year',
      sheet: { k: Y.year, title: 'Everywhere we went' },
      event: 'year:chapter'
    });
  }

  renderCover();
  renderDeck();
  renderBar();
  renderBody();
  renderClosing();
  if (Y.honeymoon && Y.honeymoon.route) initRouteMap(Y.honeymoon);
  initYearMap();
  track();
})();
