/* ==========================================================================
   THE MURNANS · the phone browser bar

   The canvas behind the page is paper now, not oxblood, so nothing on the
   page tells Safari what colour to make the bar the search box sits in.
   This does.

   Safari reads <meta name="theme-color"> when the page loads and again when
   that tag's content changes, but two things get in the way. It skips a
   write of the value it already holds, so re-stating the colour does
   nothing. And it works the colour out again for itself every time the bar
   grows or shrinks, a page comes back from the back button, or the tab
   returns to the front, and at those moments it can land on the paper
   instead.

   So: hold one theme-color tag at the footer's oxblood, and at each of
   those moments write a colour one shade off, wait a frame, and write the
   oxblood back. That is a change Safari cannot skip, and one shade is too
   small to see.

   Only iPhones and iPads get the re-writing. Everywhere else the tag in the
   <head> is already enough, and nudging it would flicker Chrome's bar on
   Android for nothing.
   ========================================================================== */

(() => {
  'use strict';

  const BAR   = '#3A1621';   // --deep, the oxblood of the footer
  const NUDGE = '#3A1622';   // one step off BAR, only ever held for a frame

  const ua  = navigator.userAgent;
  const ios = /iP(hone|od|ad)/.test(ua) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  /* One tag, no media variants: the bar is oxblood in dawn and in dusk, the
     same as the footer it sits under. */
  function tags() {
    let list = [...document.querySelectorAll('meta[name="theme-color"]')];
    if (!list.length) {
      const m = document.createElement('meta');
      m.name = 'theme-color';
      document.head.appendChild(m);
      list = [m];
    }
    return list;
  }

  const set = v => tags().forEach(m => { m.removeAttribute('media'); m.content = v; });

  set(BAR);
  if (!ios) return;

  /* A timer, not a frame: frames stop in a tab that is not on screen, and a
     nudge left half done would strand the bar on the off shade. */
  let back = 0;
  function repaint() {
    clearTimeout(back);
    set(NUDGE);
    back = setTimeout(() => set(BAR), 40);
  }

  /* Settle first: while the bar is mid-collapse Safari is still deciding, so
     a colour written during the move gets thrown away. */
  let timer = 0;
  const soon = (ms = 180) => { clearTimeout(timer); timer = setTimeout(repaint, ms); };

  /* The bar changing height is the visual viewport changing height, which is
     the one signal that fires exactly when Safari re-reads the colour. */
  if (window.visualViewport) visualViewport.addEventListener('resize', () => soon());
  addEventListener('scroll', () => soon(220), { passive: true });
  addEventListener('orientationchange', () => soon(400));
  addEventListener('pageshow', () => soon(60));                       // back button, bfcache
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    clearTimeout(back); set(BAR);   // never come back on the off shade
    soon(60);
  });

  /* Dawn to dusk repaints the whole page, and Safari samples it again. */
  new MutationObserver(() => soon(80))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
