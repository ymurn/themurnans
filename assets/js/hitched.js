/* Hitched (day.html): the flight into the rings, and the cake.

   The camera works in the original artwork's own pixels (the PSD is
   2700 x 3094). As the page scrolls it pushes into the clear middle of the
   left ring until the light inside it fills the screen, and the note comes
   down on that light.

   Built to stay smooth on phones:
   - the drawing is three image layers moved with GPU transforms, so the
     browser scales the full-resolution bitmaps instead of repainting them;
   - the vector rings are only shown while the camera is close, and are the
     only thing redrawn (by viewBox) then;
   - layout is measured on load and when the width changes, never per frame;
   - each frame writes straight to the few elements that move, and only
     when a value has changed.

   On a phone held upright a swipe covers less than a screen, so on the
   full track the flight took three of them. There the track is shorter,
   about one swipe to the note, and the camera eases after the scroll
   rather than jumping with it, so a quick flick still reads as a flight. */
(function () {
  var sec = document.querySelector('.hx');
  if (!sec) return;
  var stage = sec.querySelector('.hx-stage');
  var svg = stage.querySelector('.hx-svg'), rays = svg.querySelector('.hx-rays'), sparks = svg.querySelector('.hx-sparks'),
      light = svg.querySelector('.hx-light'), vec = svg.querySelector('.hx-vec');
  var date = stage.querySelector('.hx-date'), field = stage.querySelector('.hx-field'),
      note = stage.querySelector('.hx-notewrap'), cue = stage.querySelector('.hx-cue');
  var layers = [].slice.call(stage.querySelectorAll('.hx-layer')).map(function (el) {
    return { el: el, x: +el.dataset.x, y: +el.dataset.y, w: +el.dataset.w, dawn: el.getAttribute('src'), dusk: el.dataset.dusk,
             fig: !el.classList.contains('hx-ringart'), dir: el.classList.contains('hx-david') ? -1 : 1 };
  });
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SB = { x: 290, y: 110, w: 2180, h: 2620 };   // the scene, in artwork pixels: shoe to shoe, rays to heels
  var T = { x: 1212, y: 497 };                      // the clear middle of the left ring
  var W, H, Hs, k0, T0, kEnd, top0, span, lastW = -1, lastP = -1, ticking = false, moving = 0;
  // upright phones: the short track, with the camera at p easing after the scroll
  var short = false, p = 0, follow = 0;
  // the short viewport (toolbar showing), for laying out the opening picture
  var probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;top:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
  probe.setAttribute('aria-hidden', 'true');
  stage.appendChild(probe);

  // dusk keeps the black ink and turns the rays and waves gold: load only the version in use
  function swapArt() {
    var dusk = document.documentElement.dataset.theme === 'dusk';
    layers.forEach(function (l) { var s = dusk ? l.dusk : l.dawn; if (s && l.el.getAttribute('src') !== s) l.el.setAttribute('src', s); });
  }
  swapArt();
  new MutationObserver(swapArt).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function c(p, a, b) { var v = (p - a) / (b - a); return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { return v * v * (3 - 2 * v); }
  function inOut(v) { return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; }
  function backOut(v) { var a = 1.55; return 1 + (a + 1) * Math.pow(v - 1, 3) + a * Math.pow(v - 1, 2); }
  function r2(v) { return Math.round(v * 100) / 100; }

  // every write goes through here, and is skipped when nothing changed
  var cache = new WeakMap();
  function set(el, prop, v) {
    var m = cache.get(el); if (!m) { m = {}; cache.set(el, m); }
    if (m[prop] === v) return;
    m[prop] = v;
    if (prop.charAt(0) === '@') el.setAttribute(prop.slice(1), v); else el.style[prop] = v;   // '@name' is an SVG attribute
  }

  function layout() {
    // H is the whole stage (100lvh: steady while a phone's toolbar comes and
    // goes), which the camera and the light fill; Hs is what shows with the
    // toolbar out, which the opening picture is fitted into
    short = stage.clientWidth < 700 && innerHeight > innerWidth;
    sec.classList.toggle('hx-short', short);   // changes the track's height, so before measuring
    W = stage.clientWidth; H = stage.clientHeight; Hs = Math.min(H, probe.offsetHeight || H);
    var phone = W < 700;
    var top = phone ? Math.max(96, Hs * .13) : Math.max(110, Hs * .14), bottom = phone ? 44 : 60, side = phone ? 10 : 48;
    var aw = W - side * 2, ah = Hs - top - bottom;
    k0 = Math.min(aw / SB.w, ah / SB.h);
    var sw = SB.w * k0, sh = SB.h * k0, ox = (W - sw) / 2;
    // phones: the date, the drawing and the caption hung under it are one group,
    // centred between the nav and the foot of the screen; wide screens: centred under the nav
    var fsPhone = Math.min(W * .31, Hs * .26), oy;
    if (phone) {
      var gTop = sh * .14 - fsPhone * .42, gBottom = sh + 14 + 66;
      oy = (64 + Hs - 16) / 2 - (gTop + gBottom) / 2;
      cue.style.top = (oy + sh + 14) + 'px'; cue.style.bottom = 'auto';
    } else {
      oy = top + (ah - sh) / 2;
      cue.style.removeProperty('top'); cue.style.removeProperty('bottom');
    }
    T0 = { x: ox + (T.x - SB.x) * k0, y: oy + (T.y - SB.y) * k0 };
    // the clear lens is about 100 x 56 artwork px: fly in until it is wider and taller than the whole stage
    kEnd = Math.max(W / 90, H / 50) * 1.3;
    // phones: the date sits in the sky behind the burst of rays.
    // wide screens: it runs the full width of the window, measured, behind the two of them.
    var fs, cy;
    if (phone) {
      fs = fsPhone; cy = oy + sh * .14;
    } else {
      date.style.fontSize = '100px';
      var n = date.querySelectorAll('.n'), wide = n[n.length - 1].getBoundingClientRect().right - n[0].getBoundingClientRect().left;
      fs = Math.min(100 * (W * .96) / wide, Hs * .7); cy = Hs * .5;
    }
    date.style.fontSize = fs + 'px'; date.style.top = cy + 'px';
    layers.forEach(function (l) { l.el.style.width = l.w + 'px'; });
    // where the flight starts and how long it lasts, in page scroll
    top0 = sec.getBoundingClientRect().top + scrollY; span = sec.offsetHeight - H;
    lastW = W; lastP = -1;
    p = progress();
  }

  // the camera closes a fifth of the gap each frame, so it trails a flick by a
  // moment and settles where the finger stops; it never moves on its own
  function ease() {
    var target = progress();
    p += (target - p) * .2;
    if (Math.abs(target - p) < .0005) p = target;
    at(p);
    follow = p === target ? 0 : requestAnimationFrame(ease);
  }

  function at(p) {
    if (Math.abs(p - lastP) < .0004) return;
    lastP = p;
    var z = inOut(c(p, .05, .64));
    var k = k0 * Math.exp(Math.log(kEnd / k0) * z);
    var m = smooth(c(p, .05, .42));
    var sx = T0.x + (W / 2 - T0.x) * m, sy = T0.y + (H / 2 - T0.y) * m;
    var vx = T.x - sx / k, vy = T.y - sy / k;            // the camera: artwork point at the top left of the screen

    var dateO = 1 - c(p, 0, .14), part = smooth(c(p, .1, .4)), figs = 1 - c(p, .17, .3),
        vecO = c(p, .07, .13), raysO = 1 - c(p, .26, .42), lightO = c(p, .32, .54),
        fieldO = c(p, .56, .64), noteO = c(p, .66, .82);

    set(date, 'opacity', dateO.toFixed(3));
    set(date, 'scale', (1 + (1 - dateO) * .14).toFixed(4));
    set(date, 'visibility', dateO > 0 ? 'visible' : 'hidden');
    set(cue, 'opacity', (1 - c(p, 0, .1)).toFixed(3));

    layers.forEach(function (l) {
      var o = l.fig ? figs : 1 - vecO;
      set(l.el, 'visibility', o > 0 ? 'visible' : 'hidden');
      if (o <= 0) return;
      var dx = l.fig ? l.dir * 90 * part : 0, dy = l.fig ? 30 * part : 0;
      set(l.el, 'opacity', o.toFixed(3));
      set(l.el, 'transform', 'translate3d(' + r2((l.x + dx - vx) * k) + 'px,' + r2((l.y + dy - vy) * k) + 'px,0) scale(' + k.toFixed(5) + ')');
    });

    // the vector rings: drawn only from the hand-over until the light has filled the screen
    var showVec = vecO > 0 && fieldO < 1;
    set(svg, 'visibility', showVec ? 'visible' : 'hidden');
    if (showVec) {
      set(svg, '@viewBox', vx.toFixed(2) + ' ' + vy.toFixed(2) + ' ' + (W / k).toFixed(2) + ' ' + (H / k).toFixed(2));
      set(vec, 'opacity', vecO.toFixed(3));
      set(rays, '@transform', 'translate(1360 505) rotate(' + (part * 9).toFixed(2) + ') scale(' + (1 + part * .22).toFixed(4) + ') translate(-1360 -505)');
      set(rays, 'opacity', raysO.toFixed(3));
      set(sparks, 'opacity', raysO.toFixed(3));
      set(light, 'opacity', lightO.toFixed(3));
    }

    set(field, 'opacity', fieldO.toFixed(3));
    set(field, 'visibility', fieldO > 0 ? 'visible' : 'hidden');
    var e = backOut(noteO);
    set(note, 'opacity', noteO.toFixed(3));
    set(note, 'visibility', noteO > 0 ? 'visible' : 'hidden');
    set(note, 'translate', '-50% calc(-50% + ' + ((1 - e) * 70).toFixed(1) + 'px)');
    set(note, 'rotate', ((1 - e) * -7).toFixed(2) + 'deg');
    field.classList.toggle('hx-twinkle', noteO > .5);
    // the strip under Safari's floating bar shows this section, not the stage
    sec.classList.toggle('hx-lit', lightO > .5);
  }

  function progress() { return c((scrollY - top0) / span, 0, 1); }
  function frame() { ticking = false; if (short) { if (!follow) ease(); } else at(progress()); }
  function draw() { p = progress(); at(p); }

  // the cake stacks itself, bottom tier first, when it comes into view
  var cake = document.querySelector('.cake');
  if (cake && !reduce && 'IntersectionObserver' in window) {
    cake.classList.add('hx-armed');
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { cake.classList.add('go'); io.disconnect(); }
    }, { threshold: .3 });
    io.observe(cake);
  }

  // without motion the hero stays a still poster and the note sits under it
  if (reduce) return;
  sec.classList.add('hx-on');
  layout(); draw();
  if (document.fonts) document.fonts.ready.then(function () { layout(); draw(); });
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    // the arrow stops nudging while the page moves
    if (!moving) cue.classList.add('hx-moving');
    clearTimeout(moving); moving = setTimeout(function () { moving = 0; cue.classList.remove('hx-moving'); }, 200);
  }, { passive: true });
  // a phone's toolbar changes the height as you scroll: only a new width means a new layout
  addEventListener('resize', function () {
    if (stage.clientWidth !== lastW || Math.abs(stage.clientHeight - H) > 120) { layout(); draw(); }
  });
  addEventListener('load', function () { layout(); draw(); });
})();
