/* ==========================================================================
   THE MURNANS · the first reveal on the trip and timeline pages
   Every page with a head of photographs opens with its own reveal:

     year pages   2022.html to 2025.html: the year rolls round like a car's
                  milometer, and the Christmas card arrives face down and
                  turns over once the year has stopped
     Honeymoon    an instant camera beside the title takes the prints, two
                  at a flash; each slides out of the slot and develops
     Highlights   two photo-booth strips drop in side by side; the paper
                  dissolves and the frames open out into the set (one
                  strip, or one frame, when there are fewer)
     Long Way     a neat stack of prints, each taking a long arc to its place

   Skipped for anyone who has asked for less motion, and on a page opened
   part way down (a link to a month, or the browser putting it back).

   One motion language for all of them: a fast start easing into a long,
   quiet landing, 60 to 90ms between pieces, nothing that bounces, done in
   about a second and a half. The photographs are the subject; the tilt and
   the off-register color settle last, so each print arrives as a print.
   The motion is in assets/css/reveal.css. Must load after trip.js,
   story-head.js or year.js, which draw what it moves, and before site.js,
   which would split the title.
   ========================================================================== */

(() => {
  'use strict';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const head = document.querySelector('.page-head');
  if (!head) return;
  const kind = head.classList.contains('thead') ? 'trip'
    : head.classList.contains('yhead') ? 'year' : null;
  const page = document.body.dataset.page;
  const want = { honeymoon: 'camera', highlights: 'booth', story: 'arc' }[page]
    || (kind === 'year' ? 'odometer' : null);
  if (!kind || !want) return;
  // A link to a month further down, or a page the browser has put back where
  // it was: the head is not on screen, so there is nothing to show.
  if (location.hash || history.scrollRestoration && scrollY > 40) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.dataset.intro = want;
  root.dataset.introKind = kind;
  const later = (ms, fn) => setTimeout(fn, ms);

  /* The title: its words come out of a soft blur, one after another. On a
     year page it is the year's name, after the year has rolled round. */
  const sharpen = (el, base) => {
    if (!el) return;
    const words = el.textContent.trim();
    el.removeAttribute('data-split');
    el.style.setProperty('--rv-base', `${base}s`);
    const set = words.split(/\s+/)
      .map((w, i) => `<span class="rv-w" aria-hidden="true" style="--k:${i}">${w}</span>`).join(' ');
    el.innerHTML = set
      + `<span class="rv-said">${words}</span>`;
  };
  if (want === 'odometer') sharpen($('.yhead__name', head), 1.05);
  else sharpen($('h1', head), .05);

  // the gold four-point star the rest of the site uses, on a 24 box
  const STAR = 'M12 0c.9 5.6 2.9 8.9 5.5 10.4 1.6.9 3.6 1.3 6.5 1.6-2.9.3-4.9.7-6.5 1.6C14.9 15.1 12.9 18.4 12 24c-.9-5.6-2.9-8.9-5.5-10.4C4.9 12.7 2.9 12.3 0 12c2.9-.3 4.9-.7 6.5-1.6C9.1 8.9 11.1 5.6 12 0Z';
  const rel = (el, to) => {
    const a = el.getBoundingClientRect(), b = to.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height,
             cx: a.left - b.left + a.width / 2, cy: a.top - b.top + a.height / 2,
             r: a.right - b.left, b: a.bottom - b.top };
  };


  const pics = () => $$('.tgal__pic', head);
  const gridOf = () => $('.tgal__grid', head);
  /* Where someone taking the pictures stands: beside the title, if the
     line it ends on leaves room before the prints; otherwise just above
     the prints on the right (a phone, where the prints are under the
     words). Returns a box in the gallery's own coordinates. */
  function stand(gal, wide, narrow, aspect) {
    const G = gal.getBoundingClientRect();
    // the visible words only: the copy kept for screen readers is parked
    // out of the way and would stretch the box
    const words = $$('.rv-w', $('h1', head)).map(w => w.getBoundingClientRect());
    const T = words.length
      ? { right: Math.max(...words.map(r => r.right)), top: Math.min(...words.map(r => r.top)), bottom: Math.max(...words.map(r => r.bottom)) }
      : (() => { const range = document.createRange(); range.selectNodeContents($('h1', head)); return range.getBoundingClientRect(); })();
    T.height = T.bottom - T.top;
    let w = Math.min(wide, Math.max(narrow, G.width * .2));
    if (G.left - T.right >= w + 30 && T.bottom > G.top) {
      return { w, x: (T.right + G.left) / 2 - w / 2 - G.left, y: T.top + T.height / 2 - w * aspect / 2 - G.top };
    }
    // Over the prints, on the right (a phone, where the prints are under the
    // words): a little smaller, in a gap opened for it between the words and
    // the prints, so it sits on neither. Once it has gone the prints glide
    // up into the usual space (trip.css).
    w = Math.min(narrow * .95, G.width * .22);
    const h = w * aspect;
    const above = $$('.page-head .lede, .page-head h1', document).reduce((m, el) => Math.max(m, el.getBoundingClientRect().bottom), -Infinity);
    const free = G.top - above - 16;               // room already there
    const need = Math.max(0, Math.ceil(h + 8 - free));
    if (need) { gal.style.setProperty('--rv-room', `${need}px`); gal.classList.add('rv-room'); }
    return { w, x: G.width - w - 2, y: -h - 8, room: need };
  }

  /* Every print from a starting place (from) into a temporary slot, held
     there, then lifted to its own place with its tilt. One easing family:
     the long landing in, a held beat, the long landing out. The color is
     printed as each one lands (--pk, read by reveal.css). */
  const OUT = 'cubic-bezier(.16, 1, .3, 1)';
  const LAND = 'cubic-bezier(.2, 1.08, .3, 1)';
  function lift(list, grid, { slot, from = () => [0, 0], blur = 0, inDelay = 0, inDur = 900, stagger = () => 0, liftAt, liftDur = 800, landing = LAND }) {
    const plays = list.map((p, i) => {
      const r = rel(p, grid);
      const tilt = parseFloat(getComputedStyle(p).getPropertyValue('--tilt')) || 0;
      const S = slot(i, r), [fx, fy] = from(i);
      const tx = S.x - r.cx, ty = S.y - r.cy;
      const d0 = inDelay + stagger(i), L = Math.max(liftAt(i), d0 + inDur + 60), total = L + liftDur - d0;
      const k1 = inDur / total, k2 = (L - d0) / total;
      const frames = [
        { offset: 0, translate: `${tx + fx}px ${ty + fy}px`, scale: S.s, rotate: `${S.rot}deg`, opacity: 0, filter: `blur(${blur}px)`, easing: OUT },
        { offset: Math.min(k1 * .25, k1), opacity: 1 },
        { offset: k1, translate: `${tx}px ${ty}px`, scale: S.s, rotate: `${S.rot}deg`, filter: 'blur(0px)', easing: 'linear' },
        { offset: k2, translate: `${tx}px ${ty}px`, scale: S.s, rotate: `${S.rot}deg`, easing: landing },
        { offset: 1, translate: '0px 0px', scale: 1, rotate: `${tilt}deg`, opacity: 1, filter: 'blur(0px)' }
      ];
      p.style.setProperty('--pk', `${((L + liftDur * .55) / 1000).toFixed(2)}s`);
      return () => p.animate(frames, { duration: total, delay: d0, fill: 'backwards' });
    });
    return () => plays.forEach(f => f());
  }

  /* ── The setups. Each measures the page as it is when the reveal starts
       and writes what the stylesheet needs onto the elements. ─────────── */

  const setup = {
    year: {
      odometer() {
        const yr = $('.yhead__year'); if (!yr) return;
        const digits = yr.textContent.trim();
        yr.removeAttribute('data-split');

        // the right-hand wheel turns the furthest, the way a milometer's does
        const turns = [1, 3, 6, 11];
        yr.innerHTML = [...digits].map((d, i) => {
          const t = +d, n = turns[Math.max(0, turns.length - digits.length + i)] || 1;
          const strip = Array.from({ length: n + 1 }, (_, j) => (t - n + j + 100) % 10);
          return `<span class="rv-odo" aria-hidden="true" style="--n:${n};--k:${i}"><span class="rv-odo__w">${d}</span><span class="rv-odo__strip">${strip.map(x => `<span>${x}</span>`).join('')}</span></span>`;
        }).join('') + `<span class="rv-said">${digits}</span>`;
        // the card arrives face down and turns over once the year has landed
        const frame = $('.ycover__frame');
        if (!frame) return;
        const back = document.createElement('span');
        back.className = 'rv-back';
        back.setAttribute('aria-hidden', 'true');
        back.innerHTML = `
          <span class="rv-back__face">
            <img src="assets/art/logo-round.png" alt="" width="84" height="84">
            <span class="rv-back__from">From the Bear &amp; the Tiger</span>
            <span class="rv-back__yr">${digits}</span>
          </span>`;
        frame.appendChild(back);
      },
    },

    trip: {

    // camera: an instant camera beside the title takes them, two at a
    // flash. Each print slides out of the slot, flies to its place and
    // develops there.
    camera() {
      const gal = $('.tgal', head), grid = gridOf();
      if (!gal || !grid) return;
      const cam = document.createElement('span');
      cam.className = 'rv-cam';
      cam.setAttribute('aria-hidden', 'true');
      cam.innerHTML = `
        <svg viewBox="0 0 132 100" width="132" height="100">
          <rect class="rv-cam__off" x="10" y="22" width="120" height="76" rx="16"/>
          <rect class="rv-cam__loop" x="-1" y="34" width="7" height="14" rx="2.5"/>
          <rect class="rv-cam__loop" x="122" y="34" width="7" height="14" rx="2.5"/>
          <path class="rv-cam__hump" d="M24 17v-8a5 5 0 0 1 5-5h28a5 5 0 0 1 5 5v8"/>
          <rect class="rv-cam__finder" x="31" y="8" width="17" height="7" rx="2"/>
          <rect class="rv-cam__body" x="4" y="16" width="120" height="76" rx="16"/>
          <path class="rv-cam__band" d="M4 64h120v12a16 16 0 0 1-16 16H20A16 16 0 0 1 4 76Z"/>
          <rect class="rv-cam__slot" x="26" y="82" width="64" height="4.5" rx="2.2"/>
          <rect class="rv-cam__flash" x="86" y="24" width="30" height="17" rx="4"/>
          <path class="rv-cam__flashlines" d="M93 29.5h16M93 35.5h16"/>
          <circle class="rv-cam__lens" cx="58" cy="54" r="25"/>
          <circle class="rv-cam__ring" cx="58" cy="54" r="17"/>
          <circle class="rv-cam__glass" cx="58" cy="54" r="10.5"/>
          <circle cx="54" cy="50" r="3.4" fill="#F7F0E0"/>
          <circle class="rv-cam__button" cx="104" cy="52" r="6"/>
          <path class="rv-cam__star" transform="translate(13 23) scale(.5)" d="${STAR}"/>
        </svg>
        <span class="rv-cam__pop"></span>`;
      gal.appendChild(cam);

      const spot = stand(gal, 132, 84, 100 / 132);
      // measured after: the room stand() may open moves the gallery down
      const G = gal.getBoundingClientRect();
      const camW = spot.w, x = spot.x, y = spot.y;
      const camH = camW * 100 / 132;
      Object.assign(cam.style, { width: `${camW}px`, left: `${x}px`, top: `${y}px` });
      // in the corner over the prints rather than beside the title: it goes
      // off the right edge, as far as from where it stands to past the screen
      const corner = Math.abs(x - (G.width - camW - 2)) < 1;
      if (corner) { cam.classList.add('is-corner'); cam.style.setProperty('--cam-x', `${Math.round(G.left + x)}px`); }

      // the slot, in the grid's own coordinates
      const gr = grid.getBoundingClientRect();
      const slotX = G.left + x + camW * 58 / 132 - gr.left;
      const slotY = G.top + y + camH * 84 / 100 - gr.top;
      const slotW = camW * 64 / 132;
      const list = pics();
      list.forEach((p, i) => {
        const r = rel(p, grid);
        const sc = slotW * .82 / p.offsetWidth;
        const hs = p.offsetHeight * sc;
        const nudge = (i % 2 ? 1 : -1) * slotW * .14;
        p.style.setProperty('--s', sc.toFixed(3));
        p.style.setProperty('--px', `${(slotX + nudge - r.cx).toFixed(1)}px`);
        p.style.setProperty('--py0', `${(slotY - hs * .6 - r.cy).toFixed(1)}px`);
        p.style.setProperty('--py1', `${(slotY + hs * .5 - r.cy).toFixed(1)}px`);
        // two to a flash, the second a beat behind the first
        p.style.setProperty('--at', `${(.62 + Math.floor(i / 2) * .36 + (i % 2) * .09).toFixed(2)}s`);
      });
      const shots = Math.ceil(list.length / 2);
      return () => {
        for (let k = 0; k < shots; k++) later(620 + k * 360 - 40, () => { cam.classList.remove('is-snap'); void cam.offsetWidth; cam.classList.add('is-snap'); });
        later(620 + shots * 360 + 650, () => cam.classList.add('is-gone'));
        // and once it is off the screen, the prints take back the room it had
        later(620 + shots * 360 + 1150, () => gal.classList.add('rv-room--done'));
        later(620 + shots * 360 + 1300, () => cam.remove());
      };
    },

    /* HIGHLIGHTS ────────────────────────────────────────────────────── */

    /* THE LONG WAY ROUND ─────────────────────────────────────────────── */

    // arc: the six as a neat stack beside the set; each takes a long, smooth
    // arc to its place, the top of the stack first
    arc() {
      const grid = gridOf(); if (!grid) return;
      const list = pics();
      const W = grid.clientWidth, H = grid.clientHeight;
      // the stack sits on the side nearest the words, a little low
      const sx = W * .14, sy = H * .62;
      const n = list.length;
      const ease = t => (t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2);
      list.forEach((p, i) => {
        const r = rel(p, grid);
        const tilt = parseFloat(getComputedStyle(p).getPropertyValue('--tilt')) || 0;
        const k = n - 1 - i;                     // its place in the stack
        const S = [sx + k * 2.5 - r.cx, sy - k * 2.5 - r.cy];
        // the long way: bowed up and out from the straight line between the
        // two, never down towards the bottom of a phone's screen
        const len = Math.hypot(S[0], S[1]) || 1;
        let nx = -S[1] / len, ny = S[0] / len;
        if (ny > 0) { nx = -nx; ny = -ny; }
        const bow = Math.min(len * .42, 150);
        const C = [S[0] / 2 + nx * bow, S[1] / 2 + ny * bow];
        const frames = Array.from({ length: 25 }, (_, f) => {
          const t = ease(f / 24), u = 1 - t;
          const x = u * u * S[0] + 2 * u * t * C[0];
          const y = u * u * S[1] + 2 * u * t * C[1];
          return { translate: `${x.toFixed(1)}px ${y.toFixed(1)}px`, rotate: `${(tilt * t).toFixed(2)}deg`, scale: (.84 + .16 * t).toFixed(3) };
        });
        p.style.setProperty('--k', i);
        p.style.setProperty('--z', n - i);
        p.rvGo = () => p.animate(frames, { duration: 1150, delay: 420 + i * 85, easing: 'linear', fill: 'backwards' });
      });
      return () => list.forEach(p => p.rvGo());
    },

    /* HIGHLIGHTS ────────────────────────────────────────────────────── */

    // booth: two photo-booth strips of three drop in side by side. Then the
    // paper dissolves and the frames open out together into the set, each
    // strip to its own half, so no two paths ever cross.
    booth() {
      const grid = gridOf(); if (!grid) return;
      const list = pics(), n = list.length;
      const W = grid.clientWidth, H = grid.clientHeight;
      const w = list[0].offsetWidth, h = list[0].offsetHeight;
      // Which strip each print rides in, and where: in reading order across
      // the diagonal, so the left strip holds the top left of the set and
      // the right strip the bottom right. One strip for three or fewer.
      const at = list.map(p => rel(p, grid));
      const byKey = list.map((p, i) => i).sort((a, b) =>
        (at[a].cx / w + at[a].cy / h) - (at[b].cx / w + at[b].cy / h) || at[a].cy - at[b].cy);
      const two = n > 3, per = two ? Math.ceil(n / 2) : n;
      const groups = two ? [byKey.slice(0, per), byKey.slice(per)] : [byKey];
      groups.forEach(g => g.sort((a, b) => at[a].cy - at[b].cy || at[a].cx - at[b].cx));
      const s = Math.min(.5, (H * 1.3 - 44) / (per * h));
      const fw = w * s, fh = h * s, pad = 7, foot = 22;
      const pw = fw + pad * 2, ph = per * fh + (per - 1) * pad + 2 * pad + foot;
      const cy = H / 2;
      const strips = two
        ? [{ x: W / 2 - pw / 2 - 8, t: -3 }, { x: W / 2 + pw / 2 + 8, t: 2.5 }]
        : [{ x: W / 2, t: -2 }];
      const seat = [];
      groups.forEach((g, k) => g.forEach((i, j) => { seat[i] = { k, j }; }));
      const paper = strips.map(st => {
        const el = document.createElement('span');
        el.className = 'rv-strip';
        el.setAttribute('aria-hidden', 'true');
        Object.assign(el.style, { left: `${st.x - pw / 2}px`, top: `${cy - ph / 2}px`, width: `${pw}px`, height: `${ph}px`, rotate: `${st.t}deg` });
        grid.appendChild(el);
        return el;
      });
      const OPEN = 1350;                   // when the frames leave the strips
      const go = lift(list, grid, {
        slot: i => {
          const { k, j } = seat[i], st = strips[k];
          const dy = (j - (per - 1) / 2) * (fh + pad) - (foot - pad) / 2;
          const a = st.t * Math.PI / 180;
          return { x: st.x - dy * Math.sin(a), y: cy + dy * Math.cos(a), s, rot: st.t };
        },
        from: i => [0, -H * .8 - seat[i].k * 24],
        inDelay: 200, inDur: 950, stagger: i => seat[i].k * 110,
        // all together, a breath apart, the middle of each strip first
        liftAt: i => OPEN + Math.abs(seat[i].j - (per - 1) / 2) * 45 + seat[i].k * 30,
        liftDur: 950, landing: 'cubic-bezier(.16, 1, .3, 1)'
      });
      return () => {
        paper.forEach((el, k) => el.animate([
          { translate: `0 ${-H * .8 - k * 24}px`, opacity: 0, offset: 0, easing: 'cubic-bezier(.16, 1, .3, 1)' },
          { opacity: 1, offset: .1 },
          { translate: '0 0', scale: 1, opacity: 1, offset: 950 / (OPEN - 150) },
          { translate: '0 0', scale: 1, opacity: 1, offset: (OPEN - 200 - k * 110) / (OPEN - 150) * .999, easing: 'cubic-bezier(.4, 0, .2, 1)' },
          { translate: '0 0', scale: .94, opacity: 0, offset: 1 }
        ], { duration: OPEN + 150 - 200, delay: 200 + k * 110, fill: 'both' }));
        go();
        later(OPEN + 800, () => paper.forEach(e => e.remove()));
      };
    }
    }
  };

  /* ── Go: once the photographs in the head have arrived, so nothing is
       dealt, driven or posted while it is still painting in. ─────────── */
  const imgs = $$('img', head).filter(i => !i.complete);
  const loaded = Promise.all(imgs.map(i => new Promise(r => {
    i.addEventListener('load', r, { once: true });
    i.addEventListener('error', r, { once: true });
  })));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // The ones that only rewrite markup go now, before the first paint, so
  // the plain title is never seen and then taken away. The ones that
  // measure the page wait for its photographs and fonts.
  const EARLY = ['odometer'];
  let after = null;
  const run = () => { try { after = setup[kind][want](); } catch (e) { /* the page still shows, just without the show */ } };
  if (EARLY.includes(want)) run();
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    if (!EARLY.includes(want)) run();
    // two frames, so the measured starting positions are painted first
    setTimeout(() => {
      root.classList.add('intro-go');
      if (typeof after === 'function') after();
      setTimeout(() => root.classList.add('intro-done'), 6000);
    }, 40);
  };
  /* The title does not wait for the photographs: its words start as soon
     as the type has arrived, so the page never sits there without its
     name. The odometer is all type, and its card arrives face down, so it
     goes then too. */
  const typed = Promise.race([document.fonts ? document.fonts.ready : 0, wait(350)]);
  typed.then(() => root.classList.add('intro-words'));
  if (want === 'odometer') typed.then(start);
  else Promise.race([Promise.all([loaded, typed]), wait(1600)]).then(start);
})();
