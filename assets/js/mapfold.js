/* ==========================================================================
   THE MURNANS · folding the map band away
   Below 1180px every map on the site rides in a band under the sticky bar:
   the honeymoon's route, a year's trips, the chapters of The Long Way Round
   and each trip page. The band is worth a third of a phone screen, so it
   carries two controls, and they are the same two everywhere:

     · a button in the map's top corner that opens the whole thing in a window
     · Minimise, which folds the band up into a small pill in the middle of
       the screen that goes on naming what is being read, and opens the map
       again when it is pressed

   The styles are in assets/css/map.css. Call it once, after the map has
   drawn its own markup:

     host    the map (.routemap or .yearmap)
     wrap    the element that takes .is-min, around the writing and the band
     view    the box the svg sits in
     foot    the strip under the map
     whole   the button that opens the whole map, which the corner one reuses
     onFold  told true when the map folds away and false when it opens
   ========================================================================== */

window.MW_MAPFOLD = function mapfold(o) {
  'use strict';

  const { host, wrap, view, foot, whole } = o;
  if (!host || !wrap || !view || !foot || !whole) return { min: false };

  /* The whole map: a map folded in three. It has to be angular to sit inside
     a round button, and it has to be small inside it: a square mark reaches
     further at its corners than its flats, so it needs more room than it
     looks like it does. The fold lines are drawn a shade lighter than the
     outline, or the three panels close up at this size. */
  const MAP = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">'
    + '<path d="M1.7 4.5 5.9 2.5l4.2 2 4.2-2v9.1l-4.2 2-4.2-2-4.2 2z" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>'
    + '<path d="M5.9 2.5v9.1M10.1 4.5v9.1" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>';
  const CHEV = '<svg class="mapfold__chev" width="13" height="8" viewBox="0 0 13 8" fill="none" aria-hidden="true"><path d="M1 6.2 6.5 1 12 6.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const id = `${host.id || 'map'}-view`;
  view.id = view.id || id;

  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'mapfold__open';
  open.setAttribute('aria-haspopup', 'dialog');
  open.setAttribute('aria-label', whole.textContent.trim() || 'The whole map');
  open.innerHTML = MAP;
  open.addEventListener('click', () => whole.click());
  view.appendChild(open);

  const fold = document.createElement('button');
  fold.type = 'button';
  fold.className = 'mapfold__btn';
  fold.setAttribute('aria-expanded', 'true');
  fold.setAttribute('aria-controls', view.id);
  fold.innerHTML = `<span class="mapfold__word">Minimise</span>${CHEV}`;
  foot.appendChild(fold);

  const out = { min: false };
  const told = min => { if (o.onFold) o.onFold(min); };

  fold.addEventListener('click', () => {
    out.min = !out.min;
    wrap.classList.toggle('is-min', out.min);
    fold.setAttribute('aria-expanded', String(!out.min));
    fold.querySelector('.mapfold__word').textContent = out.min ? 'Open the map' : 'Minimise';
    told(out.min);
    if (out.min) { wrap.classList.remove('is-opening'); return; }

    /* Opening: the map is drawn to the size of the box it sits in, and for
       as long as the transition runs that box is still the pill. Told only
       once, the map would be drawn at pill size and stay wrong until the
       next scroll put it right.

       So it is told again the moment the box has its height back, and on a
       timer as well in case the transition never reports. "is-opening" holds
       the map out of sight until then, so the second drawing is not a jump
       anyone sees: the band unrolls and the map fades in already showing the
       stop being read. Drawing it the whole time it is folded away would
       keep it right without any of this, but that is exactly the work a
       reader folds it away to save. */
    wrap.classList.add('is-opening');
    let done = false;
    const settled = () => {
      if (done) return;
      done = true;
      host.removeEventListener('transitionend', onEnd);
      clearTimeout(timer);
      told(false);
      wrap.classList.remove('is-opening');
    };
    const onEnd = e => { if (e.target === host && e.propertyName === 'height') settled(); };
    const timer = setTimeout(settled, 700);
    host.addEventListener('transitionend', onEnd);
  });
  return out;
};
