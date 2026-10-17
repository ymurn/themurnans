/* Hitched (day.html): the flight into the rings, and the cake.

   The hero is one SVG drawn in the original artwork's own pixels (the PSD
   is 2700 x 3094). The camera is its viewBox: as the page scrolls, it
   pushes into the clear middle of the left ring until the light inside it
   fills the screen, and the note comes down on that light.
   One layout read on resize; one batch of writes per frame. */
(function () {
  var sec = document.querySelector('.hx');
  if (!sec) return;
  var stage = sec.querySelector('.hx-stage'), svg = stage.querySelector('.hx-svg');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SB = { x: 290, y: 110, w: 2180, h: 2620 };   // the scene, in artwork pixels: shoe to shoe, rays to heels
  var T = { x: 1212, y: 497 };                      // the clear middle of the left ring
  var W, H, k0, T0, kEnd, ticking = false;

  // the dusk artwork keeps the black ink and turns the rays and waves gold:
  // load only the version in use
  svg.querySelectorAll('.hx-art').forEach(function (im) { im.dataset.dawn = im.getAttribute('href'); });
  function swapArt() {
    var dusk = document.documentElement.dataset.theme === 'dusk';
    svg.querySelectorAll('.hx-art').forEach(function (im) {
      var h = dusk ? im.dataset.dusk : im.dataset.dawn;
      if (h && im.getAttribute('href') !== h) im.setAttribute('href', h);
    });
  }
  swapArt();
  new MutationObserver(swapArt).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function c(p, a, b) { var v = (p - a) / (b - a); return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { return v * v * (3 - 2 * v); }
  function inOut(v) { return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; }
  function backOut(v) { var a = 1.55; return 1 + (a + 1) * Math.pow(v - 1, 3) + a * Math.pow(v - 1, 2); }

  function layout() {
    W = stage.clientWidth; H = Math.min(stage.clientHeight, innerHeight);
    var phone = W < 700;
    var top = phone ? Math.max(96, H * .13) : Math.max(110, H * .14), bottom = phone ? 44 : 60, side = phone ? 10 : 48;
    var aw = W - side * 2, ah = H - top - bottom;
    k0 = Math.min(aw / SB.w, ah / SB.h);
    var sw = SB.w * k0, sh = SB.h * k0, ox = (W - sw) / 2;
    // phones: the group sits a touch below centre; wide screens: centred under the nav
    var oy = phone ? (H - sh) / 2 + H * .05 : top + (ah - sh) / 2;
    T0 = { x: ox + (T.x - SB.x) * k0, y: oy + (T.y - SB.y) * k0 };
    // the clear lens is about 100 x 56 artwork px: fly in until it is wider and taller than the screen
    kEnd = Math.max(W / 90, H / 50) * 1.3;
    // phones: the date sits in the sky behind the burst of rays.
    // wide screens: it runs the full width of the window, measured, behind the two of them.
    var date = stage.querySelector('.hx-date'), fs, cy;
    if (phone) {
      fs = Math.min(W * .31, H * .26); cy = oy + sh * .14;
    } else {
      date.style.setProperty('--hx-fs', '100px');
      var n = date.querySelectorAll('.n'), wide = n[n.length - 1].getBoundingClientRect().right - n[0].getBoundingClientRect().left;
      fs = Math.min(100 * (W * .96) / wide, H * .7); cy = H * .5;
    }
    stage.style.setProperty('--hx-fs', fs + 'px'); date.style.removeProperty('--hx-fs');
    stage.style.setProperty('--hx-cy', cy + 'px');
    stage.style.setProperty('--hx-eb', (phone ? cy - fs * .42 - 44 : top - 40) + 'px');
  }
  function at(p) {
    var z = inOut(c(p, .05, .64));
    var k = k0 * Math.exp(Math.log(kEnd / k0) * z);
    var m = smooth(c(p, .05, .42));
    var sx = T0.x + (W / 2 - T0.x) * m, sy = T0.y + (H / 2 - T0.y) * m;
    svg.setAttribute('viewBox', (T.x - sx / k).toFixed(2) + ' ' + (T.y - sy / k).toFixed(2) + ' ' + (W / k).toFixed(2) + ' ' + (H / k).toFixed(2));
    var st = stage.style, note = c(p, .66, .82);
    st.setProperty('--hx-date-o', 1 - c(p, 0, .14));
    st.setProperty('--hx-cue', 1 - c(p, 0, .04));
    st.setProperty('--hx-vec', c(p, .07, .13));
    st.setProperty('--hx-part', smooth(c(p, .1, .4)));
    st.setProperty('--hx-figs', 1 - c(p, .17, .3));
    st.setProperty('--hx-rays', 1 - c(p, .26, .42));
    st.setProperty('--hx-light', c(p, .32, .54));
    st.setProperty('--hx-field-o', c(p, .56, .64));
    st.setProperty('--hx-note', note);
    st.setProperty('--hx-note-e', backOut(note));
  }
  function frame() {
    ticking = false;
    var r = sec.getBoundingClientRect();
    at(c(-r.top / (r.height - innerHeight), 0, 1));
  }

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
  if (reduce) { layout(); at(0); return; }
  sec.classList.add('hx-on');
  layout();
  if (document.fonts) document.fonts.ready.then(function () { layout(); frame(); });
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', function () { layout(); frame(); });
  frame();
})();
