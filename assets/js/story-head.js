/* ==========================================================================
   THE MURNANS · the head of The Long Way Round
   Six prints of the two of us beside the title, pinned up the way the trip
   pages pin theirs (the .tgal styles are in assets/css/trip.css). Dealt
   fresh on every visit: the list below is in order, cut into six stretches,
   and one comes from each, so the six always run from the first trip to
   the summer before the wedding. Only photographs with both of us in them
   are on the list, and none in masks.
   ========================================================================== */

(() => {
  'use strict';

  const host = document.getElementById('gallery');
  const T = window.MW && window.MW.timeline;
  if (!host || !T) return;

  const US = [
    'sry01.jpg', 'sry03.jpg', '20201225-01.jpg', '21050901.jpg', '21050903.jpg',
    '21062601.jpg', '21091801.jpg', '21100302.jpg', '21101602.jpg', '21102401.jpg',
    '21110601.jpg', '21120803.jpg', '22030401.jpg', '2022040201.jpg', '2022040203.jpg',
    'img-8049.jpg', '202204beacon02.jpg', '202206vermont01.jpg', '202206twoyears01.jpg',
    '202206twoyears02.jpg', '202205cincy02.jpg', '202207syr01.jpg'
  ];
  const TILT = [-2.4, 1.8, 1.4, -2.2, -1.6, 2.1];
  const WASH = ['--blue', '--gold', '--rose', '--sage-500', '--coral', '--khaki'];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // where each one was, for its caption in the lightbox
  const from = p => T.find(c => c.photos.includes(p)) || {};
  /* The deal is fresh for each visit, not each page load: back on this
     page from another one, the same photos are already on the phone and
     arrive at once instead of downloading six new ones. */
  const roll = (() => {
    let seed = 0;
    try { seed = +sessionStorage.getItem('murnan-deal') || 0; } catch (e) {}
    if (!seed) {
      seed = 1 + Math.floor(Math.random() * 2147483645);
      try { sessionStorage.setItem('murnan-deal', seed); } catch (e) {}
    }
    return () => (seed = seed * 16807 % 2147483647) / 2147483647;
  })();
  const pool = US.filter(p => from(p).place);
  const size = pool.length / 6;
  const shots = Array.from({ length: Math.min(6, pool.length) }, (_, i) => {
    const slice = pool.slice(Math.floor(i * size), Math.max(Math.floor(i * size) + 1, Math.floor((i + 1) * size)));
    return slice[Math.floor(roll() * slice.length)];
  });

  host.innerHTML = `
    <div class="tgal__grid" data-reveal="wipe" style="--d:140ms">${shots.map((p, i) => {
      const c = from(p), cap = `${c.place} · ${c.date}`;
      return `
      <figure class="shot tgal__pic" data-shot data-src="assets/photos/${esc(p)}" data-cap="${esc(cap)}"
              tabindex="0" role="button" aria-label="Enlarge: ${esc(cap)}"
              style="--tilt:${TILT[i]}deg;--off:var(${WASH[i]});--d:${80 + i * 90}ms">
        <img ${window.MW_PIC ? MW_PIC.src(`assets/photos/${p}`, '(max-width: 699px) 30vw, 200px') : `src="assets/photos/${esc(p)}"`} alt="${esc(c.place)}, ${esc(c.date)}" loading="eager" fetchpriority="high" decoding="async">
      </figure>`;
    }).join('')}</div>`;
  if (window.MW_PIC) MW_PIC.fit(host);
})();
