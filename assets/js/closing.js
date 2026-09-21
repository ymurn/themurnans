/* ==========================================================================
   THE MURNANS · the band every long page ends on
   Four Christmas cards, one a year, each opening that year's timeline, and
   the two things we would rather someone did next: read the highlights, or
   follow along on Instagram.

   Used by the year pages (assets/js/year.js) and by the trip pages
   (assets/js/trip.js). It reads assets/js/years/index.js for the cards, so
   a year added there turns up here on every page by itself.

     host   the .band to fill, usually #closing
     here   the year whose page this is, so its card lies flat, or null
     k      the line above the heading
     title  the heading
     text   the line under it
   Styles: the .yclose rules in assets/css/year.css.
   ========================================================================== */

window.MW_CLOSING = function closing(host, opts) {
  'use strict';

  const o = opts || {};
  const YEARS = window.MW_YEARS || [];
  if (!host || !YEARS.length) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const OFF = { gold: '--gold', sage: '--sage-500', rose: '--rose', coral: '--coral', blue: '--blue', khaki: '--khaki' };
  const TILT = [-2.4, 1.8, -1.4, 2.2];
  const ARROW = '<svg class="btn__arrow" width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true"><path d="M0 4.5h13M10 1l3.5 3.5L10 8" stroke="currentColor" stroke-width="1.2"/></svg>';

  const pic = y => {
    if (!y.card) {
      return `<span class="ycard-blank" aria-hidden="true"><span class="ycard-blank__year">${esc(y.year)}</span><span class="ycard-blank__note">Card to come</span></span>`;
    }
    const base = `assets/art/cards/${y.card}`;
    return `<img src="${base}-sm.jpg" srcset="${base}-sm.jpg 560w, ${base}.jpg 1400w" sizes="(max-width: 620px) 42vw, (max-width: 900px) 28vw, 15vw" width="1400" height="1000" alt="" loading="lazy" decoding="async">`;
  };

  host.innerHTML = `
    <div class="shell">
      <div class="yclose">
        <div class="stack gap-m yclose__text">
          <span class="eyebrow eyebrow--brass" data-reveal="fade">${esc(o.k || 'After the Wedding')}</span>
          <h2 class="t-xl" data-split>${esc(o.title || 'Every year since.')}</h2>
          ${o.text ? `<p class="lede" data-reveal="up" style="--d:120ms">${esc(o.text)}</p>` : ''}
          <div class="btns yclose__btns" data-reveal="up" style="--d:160ms">
            <a class="btn" href="highlights.html" data-magnet>View highlights ${ARROW}</a>
            <a class="btn btn--ghost" href="https://www.instagram.com/themurnans/" target="_blank" rel="noopener" data-magnet>Follow @themurnans</a>
          </div>
        </div>
        <ol class="yclose__cards" data-n="${YEARS.length}">${YEARS.map((y, i) => `
          <li class="yclose__item${y.year === o.here ? ' is-here' : ''}" style="--off:var(${OFF[y.off] || '--blue'});--tilt:${y.year === o.here ? 0 : TILT[i % TILT.length]}deg;--d:${120 + i * 70}ms" data-reveal="up">
            <a class="yclose__mini" href="${esc(y.year)}.html" aria-label="${esc(y.year)}: ${esc(y.title)}"${y.year === o.here ? ' aria-current="page"' : ''}>
              <span class="yclose__pic">${pic(y)}</span>
              <span class="yclose__year">${esc(y.year)}</span>
              <span class="yclose__title">${esc(y.title)}</span>
            </a>
          </li>`).join('')}
        </ol>
      </div>
    </div>`;
};
