/* ==========================================================================
   THE MURNANS · the highlights, and the way between them

   Three pages, one list. It is here rather than in each page's own file so
   that adding a fourth highlight is one edit and all of them pick it up: the
   bar at the top of a trip page reads it, and so does the navigation every
   highlight page ends on.

   Kept in the order the highlights happened, which is the order the cards
   are dealt in. The page being read keeps its card and is marked on it
   rather than left out: the section is the whole set, and where you are in
   it, not a pair of leftovers.

     href   the page
     label  its name, the same words the bar at the top uses
     when    the month, above the name
     note   one line on what the page is
     pic    one photograph from it, the best one

   The cards are the .hcard rules in assets/css/trip.css.
   ========================================================================== */

window.MW_HIGHLIGHTS = [
  {
    href: 'highlights.html',
    label: "David's 40th",
    when: 'April 2025',
    note: 'Thirteen days round the desert southwest.',
    pic: 'continued_trips/2025-04-grand-canyon/2025-04-grand-canyon-01.jpg',
    off: '--gold',
    tilt: -1.6,
  },
  {
    href: 'highlights-citizenship.html',
    label: "Yinja's citizenship",
    when: 'February 2026',
    note: "The oath in Brooklyn, and David's letter home.",
    pic: 'continued_trips/2026-02-citizenship/2026-02-citizenship-01.jpg',
    off: '--blue',
    tilt: 1.3,
  },
  {
    href: 'highlights-yinjas-30th.html',
    label: "Yinja's 30th",
    when: 'June 2026',
    note: 'Eleven days round California.',
    pic: 'continued_trips/2026-06-napa/2026-06-napa-02.jpg',
    off: '--rose',
    tilt: -1.1,
  },
];

window.MW_HLNAV = function highlightsNav(host, opts) {
  'use strict';

  const list = window.MW_HIGHLIGHTS || [];
  if (!host || !list.length) return;
  const o = opts || {};

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Which of them is being read. The file name, not a flag written into each
     page, so a page cannot be wrong about where it is. */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const ARROW = '<svg width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true">'
    + '<path d="M0 4.5h13M10 1l3.5 3.5L10 8" stroke="currentColor" stroke-width="1.2"/></svg>';

  const card = (h, i) => {
    const on = h.href.toLowerCase() === here;
    const inner = `
        <span class="hcard__pic" style="--off:var(${h.off});--tilt:${on ? 0 : h.tilt}deg">
          <img src="assets/${esc(h.pic)}" alt="" loading="lazy" decoding="async">
        </span>
        <span class="hcard__k">${esc(h.when)}</span>
        <span class="hcard__title">${esc(h.label)}</span>
        <span class="hcard__note">${esc(h.note)}</span>
        ${on
          ? '<span class="hcard__tag">You are here</span>'
          : `<span class="hcard__go">Read it ${ARROW}</span>`}`;
    return `
      <li class="hcard__slot" data-reveal="up" style="--d:${120 + i * 90}ms">
        ${on
          ? `<div class="hcard hcard--here" aria-current="page">${inner}</div>`
          : `<a class="hcard" href="${esc(h.href)}">${inner}</a>`}
      </li>`;
  };

  host.innerHTML = `
    <div class="shell">
      <div class="hnav">
        <div class="hnav__head">
          <span class="eyebrow eyebrow--brass" data-reveal="fade">${esc(o.k || 'Keep reading')}</span>
          <h2 class="t-lg" data-split>${esc(o.title || 'The three highlights.')}</h2>
        </div>
        <ol class="hcards" data-n="${list.length}" style="--n:${list.length}">${list.map(card).join('')}</ol>
      </div>
    </div>`;
};

/* The citizenship page is not a trip, so nothing else draws its bands: it
   marks the one this belongs in and the section fills itself. The trip pages
   go through assets/js/trip.js instead, which owns #closing there. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-hlnav]').forEach(el => window.MW_HLNAV(el));
});
