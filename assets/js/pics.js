/* ==========================================================================
   THE MURNANS · the small copies
   Every photograph has a copy 640px wide in assets/sm, at the same path
   (tools/make-small.sh makes them). Most places on the site show a photo
   far smaller than its 1200px file: a home card, a print in the gallery at
   the head of a trip, a small frame in a strip. There the small copy is
   enough and a third of the weight.

   So a photo is written with both, and the browser takes the one the spot
   needs at that screen's sharpness. It can only choose well if it knows
   how wide the photo is drawn, and that changes with the layout, so each
   one is measured once it is laid out, and again whenever its box changes.
   The lightbox always opens the full file, from the figure's data-src.

     MW_PIC.src(url, guess)  the src, srcset and sizes for an <img> written
                             as a string. guess is the sizes to use until
                             the photo is measured.
     MW_PIC.fit(root)        measure the photos written into root. Call it
                             straight after writing them, so one that loads
                             at once is chosen from its real size.
     MW_PIC.set(img, url)    change a photo already on the page.

   Must load before the scripts that write the pages.
   ========================================================================== */

window.MW_PIC = (() => {
  'use strict';

  const OURS = /^assets\/(continued_trips|photos)\//;
  const GUESS = '(max-width: 699px) 100vw, 640px';
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const small = url => 'assets/sm/' + url.slice(7).replace(/\.\w+$/, '.jpg');
  const srcset = url => `${small(url)} 640w, ${url} 1200w`;

  /* How wide a source the box needs: the photos fill their frames, so a
     frame taller than the photo's own shape crops its sides and needs a
     wider source than the frame itself. Until a photo has loaded its shape
     is taken to be 4:3, which is most of them and errs on the sharp side. */
  const need = (img, w, h) => {
    const r = img.naturalWidth ? img.naturalWidth / img.naturalHeight : 4 / 3;
    return Math.ceil(Math.max(w, h * r));
  };
  const write = (img, px) => { if (px) { const s = `${px}px`; if (img.sizes !== s) img.sizes = s; } };

  const watch = 'ResizeObserver' in window && new ResizeObserver(list => {
    const sized = list.map(e => [e.target, need(e.target, e.contentRect.width, e.contentRect.height)]);
    sized.forEach(([img, px]) => write(img, px));
  });

  function fit(root = document) {
    const imgs = [...root.querySelectorAll('img[data-fit]')];
    // the box as laid out, before any transform a reveal has on it
    const sized = imgs.map(img => need(img, img.offsetWidth, img.offsetHeight));
    imgs.forEach((img, k) => {
      write(img, sized[k]);
      if (watch && !img.dataset.fitting) { img.dataset.fitting = '1'; watch.observe(img); }
    });
  }

  const src = (url, guess = GUESS) => OURS.test(url)
    ? `src="${esc(url)}" srcset="${esc(srcset(url))}" sizes="${esc(guess)}" data-fit`
    : `src="${esc(url)}"`;

  function set(img, url) {
    if (OURS.test(url)) {
      img.srcset = srcset(url);
      if (!img.hasAttribute('data-fit')) { img.setAttribute('data-fit', ''); if (img.parentElement) fit(img.parentElement); }
    } else img.removeAttribute('srcset');
    img.src = url;
  }

  /* A small copy that is not there yet (a photo added without running
     tools/make-small.sh): fall back to the full one rather than a gap. */
  addEventListener('error', e => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.srcset && (img.currentSrc || '').includes('/assets/sm/')) {
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
    }
  }, true);

  /* The photos written into the pages themselves, that wait to load until
     they are near the screen. One already loading is left as it is. */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    const url = img.getAttribute('src') || '';
    if (!OURS.test(url) || img.srcset) return;
    img.sizes = GUESS;
    img.srcset = srcset(url);
    img.setAttribute('data-fit', '');
  });
  fit();

  return { src, fit, set };
})();
