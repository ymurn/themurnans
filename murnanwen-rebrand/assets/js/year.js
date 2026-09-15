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

  const ARROW = '<svg class="btn__arrow" width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true"><path d="M0 4.5h13M10 1l3.5 3.5L10 8" stroke="currentColor" stroke-width="1.2"/></svg>';

  // a little snapshot drawn in ink: two hills under one of the logo's stars
  const DOODLE = '<svg class="shot__doodle" viewBox="0 0 64 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 39.5 21.5 19l9 10.5 8.5-11.5 19.5 21.5"/><path d="M11 43c13-.9 31-1.1 43 .2"/><path d="M47 4.5c.6 3.6 1.8 4.9 5.2 5.6-3.4.7-4.6 2-5.2 5.6-.6-3.6-1.8-4.9-5.2-5.6 3.4-.7 4.6-2 5.2-5.6Z"/></svg>';

  const at   = YEARS.findIndex(y => y.year === Y.year);
  const me   = YEARS[at] || { year: Y.year, title: '', card: '' };
  const prev = at > 0 ? YEARS[at - 1] : null;
  const next = at > -1 ? YEARS[at + 1] : null;

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
      <ol class="ydeck__list">${YEARS.map((y, i) => {
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

  function factsHTML(list) {
    return `<div class="facts yfacts__list">${list.map((f, i) => `
      <div class="fact" data-reveal="up" style="--d:${i * 80}ms">
        <span class="fact__k">${esc(f.k)}</span>
        <span class="fact__v">${/^\d+$/.test(f.v) ? `<span data-count="${f.v}">${f.v}</span>` : esc(f.v)}</span>
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
      <section class="band band--tight moon-head" id="honeymoon" data-month="${h.month}">
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
      Y.facts ? `<section class="band band--tight yfacts"><div class="shell">${factsHTML(Y.facts)}${!Y.honeymoon && Y.note ? `<p class="ynote" data-reveal="up">${esc(Y.note)}</p>` : ''}</div></section>` : '',
      Y.honeymoon ? honeymoonHTML(Y.honeymoon) : '',
      Y.quote ? quoteHTML(Y.quote) : '',
      months.length ? restHead + timelineHTML(`<div class="ytl__list">${months.map(monthHTML).join('')}</div>`, 'ytl--months') : '',
      Y.letter ? letterHTML(Y.letter) : ''
    ].join('');
  }

  /* ── The end of the page: on to the next card ────────────────────────── */

  function renderClosing() {
    const host = $('#closing');
    if (!host) return;
    const back = prev
      ? `<a class="btn btn--ghost" href="${page(prev)}" data-magnet>Back to ${esc(prev.year)}</a>`
      : '<a class="btn btn--ghost" href="day.html" data-magnet>Back to the wedding</a>';

    if (next) {
      host.style.setProperty('--off', off(next));
      host.innerHTML = `
        <div class="shell">
          <div class="yclose">
            <div class="stack gap-m yclose__text">
              <span class="eyebrow eyebrow--brass" data-reveal="fade">Next year</span>
              <h2 class="t-xl" data-split>On to <span class="squiggle">${esc(next.year)}.</span></h2>
              <p class="yclose__name" data-reveal="up" style="--d:100ms">${esc(next.title)}</p>
              <div class="yclose__btns" data-reveal="up" style="--d:160ms">
                <a class="btn" href="${page(next)}" data-magnet>Next: ${esc(next.year)} ${ARROW}</a>
                ${back}
              </div>
            </div>
            <a class="yclose__card" href="${page(next)}" aria-label="${esc(next.year)}: ${esc(next.title)}" data-reveal="up" style="--d:120ms">
              ${cardPic(next, '(max-width: 900px) 80vw, 36vw', false, '')}
            </a>
          </div>
        </div>`;
      return;
    }

    // The newest year, which is where After the Wedding opens. Nothing comes
    // after it yet, so the way on is back, through the earlier years' cards.
    const earlier = YEARS.slice(0, Math.max(at, 0)).reverse();
    host.innerHTML = `
      <div class="shell">
        <div class="yclose">
          <div class="stack gap-m yclose__text">
            <span class="eyebrow eyebrow--brass" data-reveal="fade">Earlier years</span>
            <h2 class="t-xl" data-split>Back through ${squig('the years.')}</h2>
            <p class="lede" data-reveal="up" style="--d:120ms">${esc(String(Number(Y.year) + 1))} is still happening, and its page goes up once the year is done. Until then, go back through the years before, all the way to the honeymoon.</p>
          </div>
          <ol class="yclose__cards" data-n="${earlier.length}">${earlier.map((y, i) => `
            <li class="yclose__item" style="--off:${off(y)};--tilt:${TILT[(i + 1) % TILT.length]}deg;--d:${120 + i * 80}ms" data-reveal="up">
              <a class="yclose__mini" href="${page(y)}" aria-label="${esc(y.year)}: ${esc(y.title)}">
                <span class="yclose__pic">${cardPic(y, '(max-width: 620px) 42vw, (max-width: 900px) 28vw, 15vw', false, '')}</span>
                <span class="yclose__year">${esc(y.year)}</span>
                <span class="yclose__title">${esc(y.title)}</span>
              </a>
            </li>`).join('')}
          </ol>
        </div>
      </div>`;
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
      const mid = innerHeight * 0.5;
      sections.forEach(sec => {
        const spine = $('.timeline__spine', sec);
        const box = sec.getBoundingClientRect();
        if (spine) spine.style.setProperty('--spine', (clamp((mid - box.top) / box.height, 0, 1) * 100).toFixed(2) + '%');
      });

      let live = null;
      chaps.forEach(ch => {
        const r = ch.getBoundingClientRect();
        const on = r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.25;
        ch.classList.toggle('is-in', on);
        if (on && !live) live = ch;
      });

      let month = live ? Number(live.dataset.month) : null;
      if (!live && head) {
        const r = head.getBoundingClientRect();
        if (r.top < mid && r.bottom > 0) month = Number(head.dataset.month);
      }
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
    addEventListener('scroll', tick, { passive: true });
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
     names. On a narrow one it sits above the days with the whole trip drawn. */

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

  function initRouteMap(h) {
    const host = $('#routemap');
    if (!host) return;
    const route = h.route, days = h.days;
    const W = (BOX.e - BOX.w) * KX, H = (BOX.n - BOX.s) * KY;
    const xy = (lat, lon) => [(lon - BOX.w) * KX, (BOX.n - lat) * KY];
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

    const coast = COAST.map(([lat, lon]) => xy(lat, lon));
    const nw = xy(BOX.n, BOX.w), sw = xy(BOX.s, BOX.w);
    const last = P.length - 1;

    host.innerHTML = `
      <svg viewBox="0 0 ${f(W)} ${f(H)}" role="img" aria-label="Our route from ${esc(route[0][0])} to ${esc(route[last][0])}, through California, Oregon and Washington">
        <path class="routemap__sea" d="${poly(coast)}L${f(nw[0])} ${f(nw[1])}L${f(sw[0])} ${f(sw[1])}Z"/>
        ${BORDERS.map(b => `<path class="routemap__border" d="${poly(b.map(([la, lo]) => xy(la, lo)))}"/>`).join('')}
        <path class="routemap__coast" d="${poly(coast)}"/>
        ${STATES.map(([name, lat]) => `<text class="routemap__state" x="${f(W - 10)}" y="${f(xy(lat, 0)[1])}" text-anchor="end">${name.toUpperCase()}</text>`).join('')}
        <text class="routemap__ocean" transform="translate(${f(xy(0, -125.45)[0])} ${f(xy(43.3, 0)[1])}) rotate(-90)" text-anchor="middle">PACIFIC OCEAN</text>
        <path class="routemap__base" d="${curve(0, last)}"/>
        ${days.map((d, i) => d.leg && d.leg[1] > d.leg[0] ? `<path class="routemap__leg" data-day="${i}" pathLength="1" d="${curve(d.leg[0], d.leg[1])}"/>` : '').join('')}
        ${P.map((p, s) => `<circle class="routemap__dot" data-stop="${s}" cx="${f(p[0])}" cy="${f(p[1])}" r="3"/>`).join('')}
        ${P.map((p, s) => `<text class="routemap__label${s === 0 || s === last ? ' is-anchor' : ''}" data-stop="${s}" y="${f(p[1])}" dy=".35em">${esc(route[s][0].toUpperCase())}</text>`).join('')}
      </svg>
      <p class="routemap__now" aria-live="polite"></p>`;

    const svg = $('svg', host);
    const cap = $('.routemap__now', host);
    const legs = $$('.routemap__leg', host);
    const dots = $$('.routemap__dot', host);
    const labels = $$('.routemap__label', host);
    const moon = host.closest('.ytl');
    const wide = matchMedia('(min-width: 1180px)');
    let shown = null;

    // i is the live day: -1 before the trip, days.length once it is over
    function show(i) {
      shown = i;
      const box = svg.getBoundingClientRect();
      const k = box.height ? box.height / H : 0.6;           // screen px per svg unit
      svg.style.setProperty('--mapk', k.toFixed(4));

      const day = days[i];
      const [a, b] = day && day.leg ? day.leg : [-1, -1];
      const seen = day ? b : (i >= days.length ? last : -1);

      legs.forEach(l => {
        const n = Number(l.dataset.day);
        l.classList.toggle('is-done', n < i);
        l.classList.toggle('is-now', n === i);
      });
      dots.forEach(c => {
        const s = Number(c.dataset.stop);
        const now = s >= a && s <= b;
        c.classList.toggle('is-now', now);
        c.classList.toggle('is-seen', s <= seen);
        c.setAttribute('r', f((now ? 5.5 : 3.2) / k));
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
      const hits = r => r[0] < 0 || r[2] > W || r[1] < 0 || r[3] > H ||
        boxes.some(o => r[0] < o[2] && r[2] > o[0] && r[1] < o[3] && r[3] > o[1]);

      const names = new Set(), side = new Map();
      for (const s of order) {
        const name = route[s][0];
        if (names.has(name)) continue;
        const [x, y] = P[s], w = name.length * 7.4 * u, h = 13 * u, gap = 9 * u;
        const right = [x + gap, y - h / 2, x + gap + w, y + h / 2];
        const left = [x - gap - w, y - h / 2, x - gap, y + h / 2];
        const at = !hits(right) ? 'right' : !hits(left) ? 'left' : null;
        if (!at) continue;
        boxes.push(at === 'right' ? right : left);
        names.add(name);
        side.set(s, at);
      }
      labels.forEach(t => {
        const s = Number(t.dataset.stop), at = side.get(s);
        if (at) {
          t.setAttribute('x', f(P[s][0] + (at === 'right' ? 9 : -9) * u));
          t.setAttribute('text-anchor', at === 'right' ? 'start' : 'end');
        }
        t.classList.toggle('is-on', !!at);
      });

      cap.innerHTML = day
        ? `<span class="routemap__day">Day ${day.day}${day.part ? ` · ${esc(day.part)}` : ''}</span><span class="routemap__title">${esc(day.title)}</span>`
        : `<span class="routemap__day">${esc(h.dates)}</span><span class="routemap__title">${esc(route[0][0])} to ${esc(route[last][0])}</span>`;
    }

    const chapters = $$('.chap--day');
    const fromScroll = live => {
      if (!wide.matches) return show(days.length);
      const i = live ? chapters.indexOf(live) : -1;
      if (i > -1) return show(i);
      const r = moon ? moon.getBoundingClientRect() : null;
      show(r && r.bottom < innerHeight * 0.5 ? days.length : -1);
    };

    document.addEventListener('year:chapter', e => fromScroll(e.detail));
    addEventListener('resize', () => show(wide.matches ? shown : days.length));
    fromScroll(null);
  }


  renderCover();
  renderDeck();
  renderBar();
  renderBody();
  renderClosing();
  if (Y.honeymoon && Y.honeymoon.route) initRouteMap(Y.honeymoon);
  track();
})();
