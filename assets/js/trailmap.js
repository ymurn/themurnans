/* ==========================================================================
   THE MURNANS · the map that follows what you are reading
   One component, used twice: the year pages feed it a year's months, and The
   Long Way Round feeds it the chapters. It draws every place in the run, inks
   in the states as they are reached, moves to whatever is on screen and names
   that stop. On a wide screen it is the small window floating at the left
   edge; below 1180px it is the band under the sticky bar. Its styles are in
   assets/css/map.css.

   Call it with:
     host      the element to draw into (inside .ymap__map)
     wrap      the .ymap around the text, which decides when the map shows
     band      the .ymap__map that slides in and out
     bar       the sticky bar the band hangs under, or null
     atlas     window.MW_ATLAS
     groups    [{ stops: [{ n, at, st }] }] in reading order
     seed      stops counted as already reached before the first group
     chapters  the elements on the page, in order
     groupOf   an element, to the index of its group, or -1
     caption   an index, to { k, title } for the line under the map
     aria      the svg's label
     whole     the label on the button that opens the whole thing
     sheet     { k, title } for that window
     event     a document event carrying the live element, or null
   ========================================================================== */

window.MW_TRAILMAP = function trailmap(o) {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // the star that marks home, the same one the logo's sparkles are drawn from
  const STAR = 'M0-10.5C.8-3.3 2.8-1.1 8.4 0 2.8 1.1.8 3.3 0 10.5-.8 3.3-2.8 1.1-8.4 0-2.8-1.1-.8-3.3 0-10.5Z';

  const { host, wrap, band, bar, atlas: A } = o;
  if (!host || !wrap || !band || !A) return;

  const groups = o.groups || [];
  const seed = o.seed || [];
  const all = [...seed, ...groups.flatMap(g => g.stops)];
  if (!all.length) return;

  // one dot per place, however many months or chapters landed there
  const spots = [...new Map(all.map(s => [`${s.n}|${s.at}`, s])).values()];
  const where = s => spots.findIndex(q => q.n === s.n && String(q.at) === String(s.at));
  // the states inked in by the end of each group, whatever seeded them first
  const upto = groups.map((_, i) => new Set(
    [...seed, ...groups.slice(0, i + 1).flatMap(g => g.stops)].map(s => s.st).filter(Boolean)));
  const every = new Set(all.map(s => s.st).filter(Boolean));
  const before = new Set(seed.map(s => s.st).filter(Boolean));

  const draw = () => `
    <svg viewBox="0 0 ${A.w} ${A.h}" role="img" aria-label="${esc(o.aria)}: ${esc(spots.map(s => s.n).join(', '))}">
      <g>${A.regions.map(r => `<path class="ymap__land" d="${r.d}"/>`).join('')}</g>
      <g>${A.regions.filter(r => every.has(r.id)).map(r => `<path class="ymap__fill" data-st="${r.id}" data-q="${r.q}" d="${r.d}"/>`).join('')}</g>
      <g>${spots.map((s, i) => `<circle class="ymap__stop" data-i="${i}" cx="${s.at[0]}" cy="${s.at[1]}" r="3"/>`).join('')}</g>
      <g>${spots.map((s, i) => `<text class="ymap__label" data-i="${i}" x="${s.at[0]}" y="${s.at[1]}" dy=".35em">${esc(s.n)}</text>`).join('')}</g>
      <g transform="translate(${A.home[0]} ${A.home[1]})" aria-hidden="true"><path class="ymap__home" d="${STAR}"/></g>
    </svg>`;

  host.innerHTML = `
    <div class="yearmap__view">${draw()}</div>
    <div class="yearmap__foot">
      <p class="yearmap__now" aria-live="polite"></p>
      <button class="yearmap__whole" type="button" aria-haspopup="dialog">${esc(o.whole)}</button>
    </div>`;

  const sheetId = `${host.id || 'trail'}sheet-title`;
  const sheet = document.createElement('dialog');
  sheet.className = 'routesheet yearsheet';
  sheet.setAttribute('aria-labelledby', sheetId);
  sheet.innerHTML = `
    <div class="routesheet__head">
      <span class="routesheet__k">${esc(o.sheet.k)}</span>
      <h2 class="routesheet__title" id="${sheetId}">${esc(o.sheet.title)}</h2>
      <button class="routesheet__close" type="button" aria-label="Close the map">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="routesheet__map"></div>
    <p class="yearmap__now routesheet__now"></p>`;
  document.body.appendChild(sheet);

  const kit = root => ({
    svg: $('svg', root),
    fills: $$('.ymap__fill', root),
    stops: $$('.ymap__stop', root),
    labels: $$('.ymap__label', root)
  });
  const main = kit($('.yearmap__view', host));
  // The whole map is a second copy of the atlas, a few hundred shapes that
  // most visitors never open. It is drawn the first time it is asked for.
  let wholeKit = null;
  const whole = () => {
    if (!wholeKit) {
      $('.routesheet__map', sheet).innerHTML = draw();
      wholeKit = kit($('.routesheet__map', sheet));
    }
    return wholeKit;
  };
  const caps = [$('.yearmap__now', host), $('.routesheet__now', sheet)];
  const chapters = o.chapters || [];
  // the floating window, rather than the band under the bar: the same
  // measurement as the one in assets/css/map.css
  const wide = matchMedia('(min-width: 1180px)');
  const f = n => n.toFixed(1);
  let shown = null, cur = null, raf = 0, stop = 0, onBand = false, flew = 0, folded = false;

  function paint(m, k) {
    m.svg.style.setProperty('--mapk', k.toFixed(4));
    m.stops.forEach(c => c.setAttribute('r', f(Number(c.dataset.r || 3.4) / k)));
  }

  // The piece of map that holds these stops, with room round them, cut to the
  // shape of the map on screen. One or two stops want a good deal of country
  // round them to say where they are; every stop at once is the country
  // already, so that view is drawn close, or it floats in the middle of an
  // empty map.
  function frame(m, list) {
    const bw = m.svg.clientWidth || 1, bh = m.svg.clientHeight || 1;
    const everywhere = !list.length;
    const px = everywhere ? 1.1 : 1.9, py = everywhere ? 1.1 : 1.7;
    const pts = (everywhere ? spots : list).map(s => s.at);
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min(bw / (Math.max(x1 - x0, 70) * px), bh / (Math.max(y1 - y0, 55) * py));
    return [(x0 + x1) / 2 - bw / s / 2, (y0 + y1) / 2 - bh / s / 2, bw / s, bh / s];
  }

  function fly(v) {
    cancelAnimationFrame(raf);
    clearTimeout(stop);
    const bw = main.svg.clientWidth || 1;
    const land = () => { cur = v; main.svg.setAttribute('viewBox', v.map(f).join(' ')); paint(main, bw / v[2]); };
    const from = cur;
    // Scrolled past in a flick: land on each one rather than fly to it. Every
    // frame of a flight redraws the whole map, and a phone asked for thirty
    // flights in a second gives up.
    const t0 = performance.now();
    const hurried = t0 - flew < 260;
    flew = t0;
    if (!from || calm || hurried) return land();
    const dur = 850, ratio = v[3] / v[2];
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

  // Colour in the states and name the stops being read. A name sits to the
  // right of its dot, or to the left if that side is taken, or is left off.
  function mark(m, i, v, k) {
    const live = groups[i] ? groups[i].stops : [];
    const on = groups[i] ? upto[i] : (i >= groups.length ? every : before);
    const now = new Set(live.map(s => s.st).filter(Boolean));
    m.fills.forEach(p => {
      p.classList.toggle('is-on', on.has(p.dataset.st));
      p.classList.toggle('is-now', now.has(p.dataset.st));
    });

    const mine = new Set(live.map(where));
    m.stops.forEach(c => {
      const here = mine.has(Number(c.dataset.i));
      c.classList.toggle('is-now', here);
      c.dataset.r = here ? 5.2 : 3.4;
    });

    const u = 1 / k;
    const [vx, vy, vw, vh] = v;
    const order = live.length ? [...mine] : spots.map((_, n) => n);
    const boxes = spots.filter((_, n) => order.includes(n)).map(s => [s.at[0] - 5 * u, s.at[1] - 5 * u, s.at[0] + 5 * u, s.at[1] + 5 * u]);
    const hits = r => r[0] < vx || r[2] > vx + vw || r[1] < vy || r[3] > vy + vh ||
      boxes.some(b => r[0] < b[2] && r[2] > b[0] && r[1] < b[3] && r[3] > b[1]);
    const side = new Map();
    order.forEach(n => {
      const s = spots[n], w = s.n.length * 6.4 * u, h = 13 * u, gap = 9 * u;
      const right = [s.at[0] + gap, s.at[1] - h / 2, s.at[0] + gap + w, s.at[1] + h / 2];
      const left = [s.at[0] - gap - w, s.at[1] - h / 2, s.at[0] - gap, s.at[1] + h / 2];
      const at = !hits(right) ? 'right' : !hits(left) ? 'left' : null;
      if (!at) return;
      boxes.push(at === 'right' ? right : left);
      side.set(n, at);
    });
    m.labels.forEach(t => {
      const n = Number(t.dataset.i), at = side.get(n);
      if (at) {
        t.setAttribute('x', f(spots[n].at[0] + (at === 'right' ? 9 : -9) * u));
        t.setAttribute('text-anchor', at === 'right' ? 'start' : 'end');
      }
      t.classList.toggle('is-on', !!at);
    });
  }

  function show(i) {
    shown = i;
    const live = groups[i] ? groups[i].stops : [];
    if (folded && !wide.matches) {
      // folded into the pill: nothing to draw but the name of what is being read
    } else if (wide.matches) {
      const v = frame(main, live);
      cur = null;
      main.svg.setAttribute('viewBox', v.map(f).join(' '));
      mark(main, i, v, (main.svg.clientWidth || 1) / v[2]);
      paint(main, (main.svg.clientWidth || 1) / v[2]);
    } else {
      const v = frame(main, live);
      mark(main, i, v, (main.svg.clientWidth || 1) / v[2]);
      fly(v);
    }
    if (sheet.open) {
      const w = whole();
      const v = frame(w, []);
      w.svg.setAttribute('viewBox', v.map(f).join(' '));
      const k = (w.svg.clientWidth || 1) / v[2];
      mark(w, i, v, k);
      paint(w, k);
    }
    const names = live.map(s => s.n);
    const said = names.length > 2 ? `${names.slice(0, 2).join(', ')} and ${names.length - 2} more` : names.join(' & ');
    const c = o.caption(i, said, spots.length);
    caps.forEach(el => { el.innerHTML = `<span class="yearmap__k">${esc(c.k)}</span><span class="yearmap__title">${esc(c.title)}</span>`; });
  }

  // on a wide screen the floating window comes and goes with the text
  const fromWide = () => {
    const r = wrap.getBoundingClientRect();
    const on = r.top < innerHeight * 0.72 && r.bottom > innerHeight * 0.3;
    if (on === onBand) return;
    onBand = on;
    band.classList.toggle('is-on', on);
    band.inert = !on;
  };
  const fromScroll = live => {
    if (!wide.matches) return;
    fromWide();
    const m = live ? o.groupOf(live) : -1;
    if (m > -1) return show(m);
    const r = wrap.getBoundingClientRect();
    show(r.bottom < innerHeight * 0.5 ? groups.length : -1);
  };

  // Everything this pass needs to know, measured before anything is written:
  // a class written in the middle would make the browser lay the whole page
  // out again for every chapter left to measure.
  function read() {
    // The band hangs off the bottom of the bar, so the bar's own position is
    // what says whether anything has reached it yet. Until the page has been
    // scrolled to the bar it is still somewhere down the page, nothing has
    // passed under it, and the map stays tucked away.
    const barBottom = bar ? bar.getBoundingClientRect().bottom : 0;
    const e = barBottom + band.offsetHeight;   // the foot of the band, once out
    const line = e + (innerHeight - e) * 0.33;
    const box = wrap.getBoundingClientRect();
    let i = -1;
    chapters.forEach(ch => {
      if (ch.getBoundingClientRect().top < line) {
        const g = o.groupOf(ch);
        if (g > -1) i = g;
      }
    });
    return { on: box.top < barBottom && box.bottom > e + 40, i: box.bottom < line ? groups.length : i };
  }
  function fromBand() {
    const now = read();
    if (now.on !== onBand) {
      onBand = now.on;
      band.classList.toggle('is-on', now.on);
      band.inert = !now.on;
      if (now.on) cur = null;
    }
    if (now.i !== shown || cur === null) show(now.i);
  }

  const measure = () => { if (bar) wrap.style.setProperty('--ybar-h', `${bar.offsetHeight}px`); };
  const layout = () => {
    measure();
    cur = null;
    if (wide.matches) {
      onBand = false;
      band.classList.remove('is-on');
      band.inert = true;
      fromWide();
      show(shown ?? -1);
    } else {
      band.inert = !onBand;
      fromBand();
    }
  };

  if (o.event) document.addEventListener(o.event, e => fromScroll(e.detail));
  // once a frame, never once an event: see the note in site.js
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; wide.matches ? fromWide() : fromBand(); });
  }, { passive: true });
  addEventListener('resize', layout);
  $('.yearmap__whole', host).addEventListener('click', () => {
    whole();                       // drawn here, the first time it is opened
    sheet.showModal();
    show(shown ?? groups.length);
  });
  // the band's own two controls, the same ones every map on the site carries
  if (window.MW_MAPFOLD) {
    window.MW_MAPFOLD({
      host, wrap,
      view: $('.yearmap__view', host),
      foot: $('.yearmap__foot', host),
      whole: $('.yearmap__whole', host),
      onFold: min => {
        folded = min;
        if (!min) { cur = null; show(shown ?? -1); }
      }
    });
  }
  $('.routesheet__close', sheet).addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', e => {
    const r = sheet.getBoundingClientRect();
    if (e.target === sheet && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) sheet.close();
  });
  if (document.fonts) document.fonts.ready.then(measure);
  layout();
  if (wide.matches) fromScroll(null);
};
