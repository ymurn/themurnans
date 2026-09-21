/* ==========================================================================
   THE MURNANS · the map that rides beside a trip
   One component for every trip page: the honeymoon and each of the
   highlights. It draws the states from assets/js/atlas.js, inks in the ones
   the trip reached, and runs the route over them. As each stop scrolls past,
   the drive into it lights up and the stops around it get their names.

   On a wide screen it sits in the column beside the writing and holds the
   whole trip in view. Below 1180px it is the band under the sticky bar,
   zoomed in on the stop being read, with the whole trip a tap away. Its
   styles are in assets/css/map.css and assets/css/trip.css.

   Call it with:
     host      the .routemap to draw into
     wrap      the .moon around the writing, which decides when the band shows
     band      the .moon__map that slides in and out
     bar       the sticky bar the band hangs under, or null
     atlas     window.MW_ATLAS
     route     [{ n, at: [x, y], st }] in the order it was traveled
     stops     the chapters in reading order, each with leg: [first, last]
     view      [x, y, w, h], the piece of the atlas a wide screen shows
     chapters  the elements on the page, in reading order
     caption   a stop index, to { k, title } for the line under the map
     aria      the svg's label
     whole     the label on the button that opens the whole trip
     sheet     { k, title } for that window
     event     the document event carrying the live chapter
   ========================================================================== */

window.MW_TRIPMAP = function tripmap(o) {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const f = n => n.toFixed(1);

  const { host, wrap, band, bar, atlas: A } = o;
  if (!host || !wrap || !band || !A) return;

  const route = o.route || [], stops = o.stops || [];
  if (route.length < 2) return;

  const P = route.map(s => s.at);
  const last = P.length - 1;
  const span = [Math.max(...P.map(p => p[0])) - Math.min(...P.map(p => p[0])),
                Math.max(...P.map(p => p[1])) - Math.min(...P.map(p => p[1]))];
  const stops_ = stops.map(s => ({ leg: s.leg && s.leg.length === 2 ? s.leg : [0, 0] }));

  // the piece of the atlas a wide screen holds: whatever the trip asked for,
  // or the run of the route with room around it for the names
  const view = o.view || (() => {
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const px = Math.max((x1 - x0) * 0.22, 12), py = Math.max((y1 - y0) * 0.12, 12);
    return [x0 - px, y0 - py, (x1 - x0) + px * 2, (y1 - y0) + py * 2];
  })();

  // the states inked in by the end of each stop, and all of them at once
  const stAt = i => route.slice(0, clamp(i, 0, last) + 1).map(s => s.st).filter(Boolean);
  const upto = stops_.map(s => new Set(stAt(s.leg[1])));
  const every = new Set(route.map(s => s.st).filter(Boolean));

  /* ── The route, drawn ──────────────────────────────────────────────────
     The direction the line leaves stop i in, Catmull-Rom style. Where the
     trip doubles back the stop becomes a corner, or the curve would loop;
     next to a short hop the pull is capped, or the curve would overshoot. */
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

  const curve = (a, b) => {
    let d = `M${f(P[a][0])} ${f(P[a][1])}`;
    for (let i = a; i < b; i++) {
      const t1 = tan(i), t2 = tan(i + 1), p1 = P[i], p2 = P[i + 1];
      d += `C${f(p1[0] + t1[0])} ${f(p1[1] + t1[1])} ${f(p2[0] - t2[0])} ${f(p2[1] - t2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d;
  };

  /* The states we have been to, each with the box its outline sits in. The
     atlas draws every shape with straight lines, so every pair of numbers in
     its path is a corner and the box is the smallest and largest of them.
     The name then goes wherever that box and the piece of map on screen
     overlap, which keeps it on its own state at any zoom, in the band as
     well as in the column. */
  const bbox = d => {
    const n = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i + 1 < n.length; i += 2) {
      if (n[i] < x0) x0 = n[i];
      if (n[i] > x1) x1 = n[i];
      if (n[i + 1] < y0) y0 = n[i + 1];
      if (n[i + 1] > y1) y1 = n[i + 1];
    }
    return [x0, y0, x1, y1];
  };
  const named = A.regions.filter(r => every.has(r.id))
    .map(r => ({ id: r.id, name: r.name.toUpperCase(), box: bbox(r.d), c: r.c }));

  /* Where a state's name could go on view v, best first: its own middle when
     that is on screen, then the middle of the piece of it that is, then four
     places around that middle for when the route runs through it. Each one
     is pulled back from the edges so the name never runs off the map. w is
     the name's width and u one screen pixel, both in the units the map is
     drawn in. Nothing at all when the piece on screen is too small. */
  function stateSpots(r, v, u, w) {
    const [bx0, by0, bx1, by1] = r.box;
    const x0 = Math.max(bx0, v[0]), x1 = Math.min(bx1, v[0] + v[2]);
    const y0 = Math.max(by0, v[1]), y1 = Math.min(by1, v[1] + v[3]);
    if (x1 - x0 < w + 8 * u || y1 - y0 < 22 * u) return [];
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const home = r.c && r.c[0] > x0 && r.c[0] < x1 && r.c[1] > y0 && r.c[1] < y1 ? [r.c] : [];
    return [...home, [cx, cy], [cx, (y0 + cy) / 2], [cx, (cy + y1) / 2],
            [(x0 + cx) / 2, cy], [(cx + x1) / 2, cy]]
      .map(p => [clamp(p[0], v[0] + w / 2 + 4 * u, v[0] + v[2] - w / 2 - 4 * u),
                 clamp(p[1], v[1] + 9 * u, v[1] + v[3] - 9 * u)]);
  }

  const draw = () => `
    <svg viewBox="${view.map(f).join(' ')}" role="img" aria-label="${esc(o.aria)}">
      <g>${A.regions.map(r => `<path class="ymap__land" d="${r.d}"/>`).join('')}</g>
      <g>${A.regions.filter(r => every.has(r.id)).map(r =>
        `<path class="ymap__fill" data-st="${r.id}" data-q="${r.q}" d="${r.d}"/>`).join('')}</g>
      <g>${named.map(r =>
        `<text class="routemap__state" data-st="${r.id}" text-anchor="middle">${esc(r.name)}</text>`).join('')}</g>
      <path class="routemap__base" d="${curve(0, last)}"/>
      ${stops_.map((s, i) => s.leg[1] > s.leg[0]
        ? `<path class="routemap__leg" data-stop="${i}" pathLength="1" d="${curve(s.leg[0], s.leg[1])}"/>` : '').join('')}
      ${P.map((p, s) => `<circle class="routemap__dot" data-i="${s}" cx="${f(p[0])}" cy="${f(p[1])}" r="3"/>`).join('')}
      ${P.map((p, s) => `<text class="routemap__label${s === 0 || s === last ? ' is-anchor' : ''}" data-i="${s}" y="${f(p[1])}" dy=".35em">${esc(route[s].n.toUpperCase())}</text>`).join('')}
    </svg>`;

  host.innerHTML = `
    <div class="routemap__view">${draw()}</div>
    <div class="routemap__foot">
      <p class="routemap__now" aria-live="polite"></p>
      <button class="routemap__whole" type="button" aria-haspopup="dialog">${esc(o.whole || 'Whole trip')}</button>
    </div>`;

  /* ── The whole trip, in a window of its own ──────────────────────────
     A second copy of the atlas is a few hundred shapes that most visitors
     never open, so it is drawn the first time it is asked for. */
  const sheetId = `${host.id || 'trip'}-sheet-title`;
  const sheet = document.createElement('dialog');
  sheet.className = 'routesheet tripsheet';
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
    <p class="routemap__now routesheet__now"></p>`;
  document.body.appendChild(sheet);

  const kit = root => ({
    svg: $('svg', root),
    fills: $$('.ymap__fill', root),
    legs: $$('.routemap__leg', root),
    states: $$('.routemap__state', root),
    dots: $$('.routemap__dot', root),
    labels: $$('.routemap__label', root)
  });
  const main = kit($('.routemap__view', host));
  let wholeKit = null;
  const whole = () => {
    if (!wholeKit) {
      $('.routesheet__map', sheet).innerHTML = draw();
      wholeKit = kit($('.routesheet__map', sheet));
    }
    return wholeKit;
  };

  const caps = [$('.routemap__now', host), $('.routesheet__now', sheet)];
  const chapters = o.chapters || [];
  // the column beside the writing, rather than the band under the bar: the
  // same measurement as the one in assets/css/map.css
  const wide = matchMedia('(min-width: 1180px)');
  let shown = null, cur = null, raf = 0, land = 0, onBand = false, flew = 0, min = false;

  // screen pixels per svg unit, with the dots kept one size on screen
  function paint(m, k) {
    m.svg.style.setProperty('--mapk', k.toFixed(4));
    m.dots.forEach(c => c.setAttribute('r', f(Number(c.dataset.r || 3.2) / k)));
  }

  // In the band: the piece of map around stops a to b, with room for their
  // names, cut to the band's own shape. A stop that stays put still gets a
  // little of the country round it.
  function frame(a, b) {
    const bw = main.svg.clientWidth || 1, bh = main.svg.clientHeight || 1;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let s = a; s <= b; s++) {
      x0 = Math.min(x0, P[s][0]); x1 = Math.max(x1, P[s][0]);
      y0 = Math.min(y0, P[s][1]); y1 = Math.max(y1, P[s][1]);
    }
    // never closer than a third of the way across the whole trip: a single
    // drive filling the band would be two dots on a plain field of color
    const mw = Math.max(x1 - x0, span[0] * 0.34, 18), mh = Math.max(y1 - y0, span[1] * 0.22, 12);
    const s = Math.min(bw / (mw * 1.6), bh / (mh * 1.5));
    return [(x0 + x1) / 2 - bw / s / 2, (y0 + y1) / 2 - bh / s / 2, bw / s, bh / s];
  }

  // Glide the band to view v: the center slides and the zoom eases evenly.
  // A timer lands it too, in case frames stop coming.
  function fly(v) {
    cancelAnimationFrame(raf);
    clearTimeout(land);
    const bw = main.svg.clientWidth || 1;
    const set = () => { cur = v; main.svg.setAttribute('viewBox', v.map(f).join(' ')); paint(main, bw / v[2]); };
    const from = cur;
    // Scrolled past in a flick: land on each one rather than fly to it. Every
    // frame of a flight redraws the whole map, and a phone asked for thirty
    // flights in a second gives up.
    const t0 = performance.now();
    const hurried = t0 - flew < 260;
    flew = t0;
    if (!from || calm || hurried) return set();
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
    land = setTimeout(() => { cancelAnimationFrame(raf); set(); }, dur + 250);
  }

  /* Ink map m for the live stop i: -1 before the trip, stops.length once it
     is over. v is the piece of map on screen, at k screen pixels a unit. */
  function mark(m, i, v, k) {
    const here = stops_[i];
    const [a, b] = here ? here.leg : [-1, -1];
    const seen = here ? b : (i >= stops_.length ? last : -1);
    const on = here ? upto[i] : (i >= stops_.length ? every : every);
    const now = new Set(here ? route.slice(a, b + 1).map(s => s.st).filter(Boolean) : []);

    m.fills.forEach(p => {
      p.classList.toggle('is-on', on.has(p.dataset.st));
      p.classList.toggle('is-now', now.has(p.dataset.st));
    });
    m.legs.forEach(l => {
      const n = Number(l.dataset.stop);
      l.classList.toggle('is-done', n < i);
      l.classList.toggle('is-now', n === i);
    });
    m.dots.forEach(c => {
      const s = Number(c.dataset.i);
      const live = s >= a && s <= b;
      c.classList.toggle('is-now', live);
      c.classList.toggle('is-seen', s <= seen);
      c.dataset.r = live ? 5.5 : 3.2;
    });

    // Name the stops. On a stop: the ones it covers, latest first, then the
    // two ends of the trip. Without one: the two ends, then every stop in
    // order. A name sits to the right of its dot, or to the left if that
    // side is taken, or is left off.
    const u = 1 / k;                                    // one screen pixel in svg units
    const today = [];
    for (let s = a; s <= b && s > -1; s++) today.push(s);
    const order = here ? [...today.slice().reverse(), 0, last] : [0, last, ...P.map((_, s) => s)];

    /* The dots of the stop being read go down first and nothing else may
       cover them. Then the state names, the live state before the rest, and
       a name that would land on one already down is left off. Every name is
       measured before a single one is moved: a width read after a move makes
       the browser lay the whole map out again, once a state. */
    const boxes = P.map((p, s) => {
      const r = (today.includes(s) ? 6 : 4) * u;
      return [p[0] - r, p[1] - r, p[0] + r, p[1] + r];
    });
    // in the band, the button that opens the whole trip sits over the top
    // right corner of the map, so no name may be written under it
    if (!wide.matches) boxes.push([v[0] + v[2] - 44 * u, v[1], v[0] + v[2], v[1] + 44 * u]);
    const knock = box => boxes.some(q => box[0] < q[2] && box[2] > q[0] && box[1] < q[3] && box[3] > q[1]);

    const wide_ = m.states.map(t => {
      try { return t.getComputedTextLength() || 0; } catch (e) { return t.textContent.length * 9.6 * u; }
    });
    const order_ = m.states.map((t, n) => n)
      .sort((p, q) => (now.has(m.states[q].dataset.st) ? 1 : 0) - (now.has(m.states[p].dataset.st) ? 1 : 0));
    const put = new Map();
    order_.forEach(n => {
      const t = m.states[n];
      const r = named.find(q => q.id === t.dataset.st);
      if (!r) return;
      const w = wide_[n] || r.name.length * 9.6 * u;
      for (const p of stateSpots(r, v, u, w)) {
        const box = [p[0] - w / 2 - 2 * u, p[1] - 7 * u, p[0] + w / 2 + 2 * u, p[1] + 7 * u];
        if (knock(box)) continue;
        boxes.push(box);
        put.set(n, p);
        return;
      }
    });
    m.states.forEach((t, n) => {
      const p = put.get(n);
      t.classList.toggle('is-on', !!p);
      if (!p) return;
      t.setAttribute('x', f(p[0]));
      t.setAttribute('y', f(p[1]));
    });
    const [vx, vy, vw, vh] = v;                         // names stay inside what is on screen
    const hits = r => r[0] < vx || r[2] > vx + vw || r[1] < vy || r[3] > vy + vh || knock(r);

    const names = new Set(), side = new Map();
    for (const s of order) {
      const name = route[s].n;
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
      const s = Number(t.dataset.i), at = side.get(s);
      if (at) {
        t.setAttribute('x', f(P[s][0] + (at === 'right' ? 9 : -9) * u));
        t.setAttribute('text-anchor', at === 'right' ? 'start' : 'end');
      }
      t.classList.toggle('is-on', !!at);
    });
  }

  function show(i) {
    shown = i;
    const here = stops_[i];
    if (min && !wide.matches) {
      // folded into the pill: nothing to draw but the name of the stop
    } else if (wide.matches) {
      const k = (main.svg.clientWidth || 1) / view[2];
      cur = null;
      main.svg.setAttribute('viewBox', view.map(f).join(' '));
      paint(main, k);                                   // --mapk first: the
      mark(main, i, view, k);                           // names are measured at that size
    } else {
      const v = here ? frame(here.leg[0], here.leg[1]) : view.slice();
      const k = (main.svg.clientWidth || 1) / v[2];
      paint(main, k);
      mark(main, i, v, k);
      fly(v);
    }
    if (sheet.open) {
      const w = whole();
      const k = (w.svg.clientWidth || 1) / view[2];
      paint(w, k);
      mark(w, i, view, k);
    }
    const c = o.caption(i);
    caps.forEach(el => {
      el.innerHTML = `<span class="routemap__day">${esc(c.k)}</span><span class="routemap__title">${esc(c.title)}</span>`;
    });
  }

  // On a wide screen the live stop comes from the page's scroll tracking
  const fromScroll = live => {
    if (!wide.matches) return;
    const i = live ? chapters.indexOf(live) : -1;
    if (i > -1) return show(i);
    const r = wrap.getBoundingClientRect();
    show(r.bottom < innerHeight * 0.5 ? stops_.length : -1);
  };

  /* On a narrower screen the band stays tucked under the bar until the first
     stop reaches it, and tucks away again once the last has gone under it.
     Everything the pass needs is measured before a single class is written:
     a class in the middle makes the browser lay the whole page out again. */
  const barBottom = () => (bar ? bar.getBoundingClientRect().bottom : 0);
  function read() {
    const e = barBottom() + band.offsetHeight;
    const line = e + (innerHeight - e) * 0.33;
    const box = wrap.getBoundingClientRect();
    const tops = chapters.map(ch => ch.getBoundingClientRect().top);
    let i = -1;
    tops.forEach((t, n) => { if (t < line) i = n; });
    return { on: box.top < barBottom() && box.bottom > e + 40, i: box.bottom < line ? stops_.length : i };
  }
  function fromBand() {
    const now = read();
    if (now.on !== onBand) {
      onBand = now.on;
      band.classList.toggle('is-on', now.on);
      band.inert = !now.on;
      if (now.on) cur = null;                           // arrive already on the right stop
    }
    if (now.i !== shown || cur === null) show(now.i);
  }

  // the band sits right under the bar, however tall the bar wraps
  const measure = () => { if (bar) wrap.style.setProperty('--ybar-h', `${bar.offsetHeight}px`); };
  const layout = () => {
    measure();
    cur = null;                                         // a new size lands at once
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

  if (o.event) document.addEventListener(o.event, e => fromScroll(e.detail));
  // once a frame, never once an event: see the note in assets/js/site.js
  let queued = false;
  addEventListener('scroll', () => {
    if (queued || wide.matches) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fromBand(); });
  }, { passive: true });
  addEventListener('resize', layout);

  $('.routemap__whole', host).addEventListener('click', () => {
    whole();
    sheet.showModal();
    show(shown ?? -1);
  });

  // the band's own two controls, the same ones every map on the site carries
  if (window.MW_MAPFOLD) {
    window.MW_MAPFOLD({
      host, wrap,
      view: $('.routemap__view', host),
      foot: $('.routemap__foot', host),
      whole: $('.routemap__whole', host),
      onFold: folded => {
        min = folded;
        if (!folded) { cur = null; show(shown ?? -1); }  // back at the stop being read
      }
    });
  }
  $('.routesheet__close', sheet).addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', e => {                // a tap on the dimmed page closes it
    const r = sheet.getBoundingClientRect();
    if (e.target === sheet && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) sheet.close();
  });
  if (document.fonts) document.fonts.ready.then(measure);
  layout();
  if (wide.matches) fromScroll(null);
};
