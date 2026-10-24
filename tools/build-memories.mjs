/* Builds assets/js/memories.js: every trip on the site, indexed by the state
   it happened in, so the map on the home page can hand back a few photographs
   the moment someone clicks a state.

   Nothing here is written by hand. The sources are the same files the rest of
   the site reads:
     assets/js/data.js          the twenty-nine chapters before the wedding
     assets/js/years/20XX.js    every trip since, month by month
     assets/js/years/places.js  where each trip's photographs were taken, from
                                the GPS in the originals

   A memory is filed under a state only when one of its own photographs was
   taken there, so a state never opens on a picture from somewhere else. The
   run ends by listing anything it could not place: read that list.

   Run it after adding a trip or a year:  node tools/build-memories.mjs        */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p, key) => {
  const w = {};
  new Function('window', fs.readFileSync(path.join(ROOT, p), 'utf8'))(w);
  return w[key];
};

const MW = read('assets/js/data.js', 'MW');
const YEARS = read('assets/js/years/index.js', 'MW_YEARS');
const PLACES = read('assets/js/years/places.js', 'MW_PLACES');

/* ── States ────────────────────────────────────────────────────────────────
   The map draws the codes in assets/js/atlas.js, so a memory is filed under
   those: two letters for a state, CA- and two for a province.               */

const NAMES = {
  alabama: 'AL', arizona: 'AZ', arkansas: 'AR', california: 'CA', colorado: 'CO',
  connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA', idaho: 'ID',
  illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY',
  louisiana: 'LA', maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI',
  minnesota: 'MN', mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE',
  nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM',
  'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH',
  oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX',
  utah: 'UT', vermont: 'VT', virginia: 'VA', washington: 'WA',
  'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  quebec: 'CA-QC', 'québec': 'CA-QC', ontario: 'CA-ON',
};
const CODES = new Set([...Object.values(NAMES), 'DC']);

/* Place names that carry a state without naming it. Everything else is read
   out of the string itself or out of the GPS. */
const KNOWN = {
  'nyc': 'NY', 'new york city': 'NY', 'brooklyn': 'NY', 'queens': 'NY',
  'manhattan': 'NY', 'astoria': 'NY', 'long island': 'NY', 'citi field': 'NY',
  'beacon': 'NY', 'cold spring': 'NY', 'syracuse': 'NY', 'hudson': 'NY',
  'the thousand islands': 'NY', 'corning': 'NY', 'tarrytown': 'NY', 'nyack': 'NY',
  'huntington': 'NY', 'dyker heights': 'NY', 'lake george': 'NY', 'ithaca': 'NY',
  'boston': 'MA', 'salem': 'MA', 'cape cod': 'MA',
  'cincinnati': 'OH', 'cincy': 'OH', 'dayton': 'OH', 'columbus': 'OH', 'cleveland': 'OH',
  'cuyahoga valley': 'OH', 'philadelphia': 'PA', 'philly': 'PA', 'pittsburgh': 'PA',
  'lancaster': 'PA', 'harrisburg': 'PA', 'fallingwater': 'PA', 'hersheypark': 'PA',
  'longwood gardens': 'PA', 'baltimore': 'MD', 'silver spring': 'MD',
  'alexandria': 'VA', 'richmond': 'VA', 'shenandoah': 'VA',
  'charlottesville': 'VA', 'natural bridge': 'VA', 'winchester': 'VA', 'virginia': 'VA',
  'harpers ferry': 'WV', 'new river gorge': 'WV',
  'asheville': 'NC', 'raleigh': 'NC', 'charlotte': 'NC', 'the smokies': 'TN',
  'great smoky mountains': 'TN', 'chattanooga': 'TN', 'nashville': 'TN',
  'atlanta': 'GA', 'canton': 'GA', 'savannah': 'GA', 'providence canyon': 'GA',
  'congaree': 'SC', 'charleston': 'SC',
  'tampa': 'FL', 'st. augustine': 'FL', 'clearwater beach': 'FL', 'the everglades': 'FL',
  'big cypress': 'FL', 'biscayne': 'FL',
  'providence': 'RI', 'mystic': 'CT',
  'portland, maine': 'ME', 'acadia': 'ME', 'mount mansfield': 'VT', 'vermont': 'VT',
  'saint-gaudens': 'NH', 'rehoboth beach': 'DE', 'princeton': 'NJ',
  'chicago': 'IL', 'holiday world': 'IN', 'san diego': 'CA', 'joshua tree': 'CA',
  'anza-borrego': 'CA', 'los angeles': 'CA', 'manhattan beach': 'CA',
  'san fransisco': 'CA', 'san francisco': 'CA', 'oakland': 'CA', 'death valley': 'CA',
  'the grand canyon': 'AZ', 'arizona': 'AZ', 'new mexico': 'NM', 'texas': 'TX',
  'austin': 'TX', 'new braunfels': 'TX', 'san antonio': 'TX', 'colorado': 'CO',
  'seattle': 'WA', 'montreal': 'CA-QC', 'quebec city': 'CA-QC',
  'saratoga springs': 'NY', 'ausable chasm': 'NY', 'the adirondacks': 'NY',
  'the finger lakes': 'NY', 'the four corners': 'CO',
  "utah's mighty five": 'UT', 'utah': 'UT', 'the north fork': 'NY',
  'the desert southwest': 'NM',
  // named in captions rather than in titles
  'stow': 'OH', 'kings island': 'OH', 'cuyahoga': 'OH', 'ferdinand': 'IN',
  'luray': 'VA', 'old town alexandria': 'VA', 'provincetown': 'MA', 'tybee island': 'GA', 'cloudland canyon': 'GA',
  'fall creek falls': 'TN', 'watkins glen': 'NY', 'letchworth': 'NY',
};

/* Towns with a namesake stay off that list: Newport is in Rhode Island and on
   the Oregon coast, and we have photographs of both.

   Things a place name says that are not where it happened: Cincinnati Night
   was a night out in New York. */
const NOT_THERE = [/cincinnati night/gi];

/* Pull every state a place name gives up: a trailing code ("Beacon, NY"), a
   state written out ("Cincinnati, Ohio"), or a town on the list above.

   The town list is read longest name first, and a name is only taken from a
   stretch of the line no longer name has already claimed. Otherwise
   Providence Canyon, which is in Georgia, is also Providence, Rhode Island,
   and Charlottesville is also Charlotte.                                    */
const KEYS = Object.keys(KNOWN).sort((a, b) => b.length - a.length);
const esc_re = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function statesFromPlace(place) {
  // "Washington, DC" is the district, not the state, so it is taken out of
  // the line before the state names are read off it.
  const DC_RE = /washington,?\s*d\.?\s*c\.?(?![a-z])/g;
  place = NOT_THERE.reduce((t, re) => t.replace(re, ' · '), String(place));
  const s = place.toLowerCase().replace(DC_RE, ' · ');
  const out = new Set();
  (place.match(/\b([A-Z]{2})\b/g) || []).forEach(c => { if (CODES.has(c)) out.add(c); });
  if (DC_RE.test(place.toLowerCase())) out.add('DC');
  if (/\bqc\b/i.test(place)) out.add('CA-QC');
  // "West Virginia" is read first and taken out, or it is Virginia as well
  const longest = Object.entries(NAMES).sort((a, b) => b[0].length - a[0].length);
  let rest = s;
  for (const [name, code] of longest) {
    const re = new RegExp(`(^|[^a-z])${name}(?=[^a-z]|$)`, 'g');
    if (re.test(rest)) { out.add(code); rest = rest.replace(re, '$1 · '); }
  }
  const took = [];
  const free = (a, b) => !took.some(([x, y]) => a < y && b > x);
  for (const name of KEYS) {
    const re = new RegExp(`(^|[^a-z])(${esc_re(name)})([^a-z]|$)`, 'g');
    let m;
    while ((m = re.exec(rest))) {
      const a = m.index + m[1].length;
      if (free(a, a + name.length)) { took.push([a, a + name.length]); out.add(KNOWN[name]); }
      re.lastIndex = a + 1;
    }
  }
  return [...out];
}

/* The GPS answer: which folder a photograph sits in, and what places.js says
   was photographed there. A folder is a whole trip, though, so this names the
   places a trip stopped at, not where any one photograph was taken. */
const slugOf = src => {
  const m = String(src).match(/continued_trips\/([^/]+)\//);
  return m ? m[1] : null;
};
const stopsOf = pics => {
  const out = [];
  const seen = new Set();
  // a photograph pinned to a named place in PIC_ST is a stop of its own
  const pinned = p => { const pin = pinOf(p.src); return pin && pin[1] ? [{ n: pin[1], st: pin[0] }] : []; };
  pics.forEach(p => [...(PLACES[slugOf(p.src) || ''] || []), ...pinned(p)].forEach(s => {
    const key = `${s.n}|${s.st}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ n: s.n, st: s.st === 'QC' ? 'CA-QC' : s.st, p: s.p || 0 });
  }));
  return out;
};

/* ── One memory, one state at a time ──────────────────────────────────────
   A trip that crossed a line is filed under both states, and a card filed
   under Indiana that says Cincinnati and shows the Cincinnati photographs is
   the memory answering a question nobody asked. So each memory also carries
   the name of what it visited in each of its states, and each photograph
   carries the state it was taken in, and the panel picks by the state.     */

/* The place line broken into the places it names, each with the states its
   own words give up. Split on the joins first ("&", "and", "to"), then on
   the commas inside those, dropping the bare state that trails so many of
   them: "Cincinnati, OH & Clearwater Beach, FL" is Cincinnati in Ohio and
   Clearwater Beach in Florida. */
const JOIN = /\s*(?:&|,\s+and\s+|\s+and\s+|\s+to\s+|\/)\s*/;
const bareState = t => {
  const s = t.toLowerCase().replace(/[.?!]+$/, '').trim();
  return CODES.has(s.toUpperCase()) || NAMES[s] !== undefined || s === 'qc';
};
function namedPlaces(place) {
  const out = [];
  String(place).split(JOIN).forEach(part => {
    part.split(',').map(t => t.trim().replace(/[?!]+$/, '')).forEach(name => {
      // "with Yao", "the long way home": a note on the trip, not a place
      if (!name || /^(with|the long way|day \d)/i.test(name)) return;
      // A state standing on its own is the last thing to call a card, but on
      // a line like "Portland, Acadia & Vermont" it is all there is.
      out.push({ name, st: statesFromPlace(name), bare: bareState(name) });
    });
  });
  return out;
}

/* What to call a memory when a given state is the one someone picked.

   Only when the title it already has belongs somewhere else: "Cincinnati"
   over a card filed under Indiana is the thing worth fixing, and every other
   title on the site was written by hand and is better than anything worked
   out here. The replacement is what the place line calls the places in that
   state, or failing that what the GPS called them, two at most.            */
function titlesByState(place, short, all, stops) {
  const said = namedPlaces(place);
  const owns = statesFromPlace(short);
  const out = {};
  all.forEach(c => {
    const mine = said.filter(n => n.st.includes(c));
    const names = [...new Set(mine.filter(n => !n.bare).map(n => n.name))];
    // The title fits when it names this state. It is also left alone when it
    // names no state at all and is not simply one of the places on the line:
    // "Portland, Day 1" and "Olympic National Park, Day 2" are headings, not
    // the first place in a list, and nothing here writes better ones. A
    // memory with one state cannot have the title of another.
    const fits = owns.length ? owns.includes(c)
      : all.length === 1 || !(mine.length && said.some(n => n.name === short));
    if (fits) return;
    const gps = stops.filter(s => s.st === c).sort((a, b) => b.p - a.p).map(s => s.n);
    const bare = mine.filter(n => n.bare).map(n => n.name);
    const pickFrom = names.length ? names : gps.length ? gps : bare;
    const title = pickFrom.slice(0, 2).join(' & ');
    if (title && title !== short) out[c] = title;
  });
  return out;
}

/* Which state a photograph was taken in.

   What its caption says comes first, because a folder holds a whole trip:
   "Luray Caverns" is in Virginia even when every GPS stop in its folder is
   in Georgia. A caption is only believed about a state the trip could have
   been in, one its title names or its folder has a stop in, so that "The
   Washington Monument at night" stays in the district. Then the folder, but
   only when every stop in it is in the one state. A photograph neither of
   those settles is left unmarked, and shows under any of its memory's states
   rather than under the wrong one.

   PIC_ST is for the few a caption cannot place ("The snowstorm"). Each was
   read off the GPS in the original, by hand, and "" means on a state line.
   A pair also names the place, for the memory's title when that state is
   picked: a Cincinnati trip filed under Kentucky is called Covington there.
   The Mammoth Cave pair are volume one photographs, whose originals have no
   GPS, so they were placed by their capture date and what they show; the
   Clifty Falls one is read off the GPS in Wedding/Wedding Assets/Our Story
   Photos Original/211225-Cincinnati/IMG_6379.JPG, and the two waterfalls
   and the Granville Pub off their originals in the Photos library. */
const PIC_ST = {
  '2022-12-cincy-07.jpg': 'OH',              // The snowstorm: Harrison, Ohio
  '2023-09-family-trip-06.jpg': 'TN',        // The waterfall hike: above Gatlinburg
  '2023-09-family-trip-10.jpg': 'NC',        // The highest point on the Parkway
  '2025-02-rhode-island-03.jpg': 'RI',       // The White Horse Tavern: Newport
  '2023-08-cincy-08.jpg': ['KY', 'Covington'],  // Anniversary dinner at Wunderbar: MainStrasse, Covington
  '2024-11-richmond-atlanta-charlottesville-03.jpg': 'GA', // Dinner with the cousins: Canton, Georgia
  '2024-11-richmond-atlanta-charlottesville-06.jpg': 'GA', // Chasing waterfalls: the North Georgia mountains
  '202205cincy02.jpg': ['KY', 'Mammoth Cave'],  // The selfie in the cave: May 30, 2022
  '202205cincy03.jpg': ['KY', 'Mammoth Cave'],  // Inside the cave: May 30, 2022
  '21122504.jpg': ['IN', 'Clifty Falls'],       // The selfie by the creek: Clifty Falls State Park, Christmas Day 2021
  'cliftyfalls01.jpg': ['IN', 'Clifty Falls'],  // A waterfall in the park: the same afternoon
  'cliftyfalls02.jpg': ['IN', 'Clifty Falls'],  // The stepped falls: the same afternoon
  'granvillepub01.jpg': ['KY', 'Louisville'],   // Dinner at the Granville Pub, Old Louisville: that evening
};
// [state, place or undefined], or undefined for a photograph not in PIC_ST
const pinOf = src => {
  const pin = PIC_ST[path.basename(src)];
  return pin === undefined ? undefined : [].concat(pin);
};
const hay = s => String(s).toLowerCase();
function stateOfPic(pic, said) {
  const pin = pinOf(pic.src);
  if (pin) return pin[0];
  // volume one: a photograph with no pin is from the chapter's own place
  if (pic.home) return pic.home;
  const stops = (PLACES[slugOf(pic.src) || ''] || [])
    .map(s => ({ n: s.n, st: s.st === 'QC' ? 'CA-QC' : s.st }));
  if (pic.cap) {
    const hit = stops.find(s => s.st && hay(pic.cap).includes(hay(s.n)));
    if (hit) return hit.st;
    const could = new Set([...said, ...stops.map(s => s.st)]);
    const c = statesFromPlace(pic.cap).filter(x => could.has(x));
    if (c.length === 1) return c[0];
    // "The Tennessee and North Carolina line" is in both and neither
    if (c.length > 1) return '';
  }
  const sts = new Set(stops.map(s => s.st));
  return sts.size === 1 && !sts.has('') ? [...sts][0] : '';
}

/* ── Photographs ──────────────────────────────────────────────────────────
   A month's photographs are split between that month's trips. A caption that
   names something only one trip's own writing mentions goes to that trip
   first: "Holding up the Ledges" to the day at Cuyahoga Valley, and "The
   falls at Cloudland Canyon" to the Thanksgiving trip that hiked it, not to
   the one called Providence Canyon. Then each trip takes the ones whose
   caption names one of its places, then photographs from a folder named
   after it, and a trip that matches nothing takes what is left. Anything
   still unclaimed goes with its neighbour from the same folder, and what
   that leaves is listed at the end of the run.                             */

const ALIAS = { cincinnati: 'cincy', philadelphia: 'philly', washington: 'dc' };
const SKIP = new Set(['with', 'from', 'home', 'long', 'this', 'that', 'trip']);
const words = place => (String(place).toLowerCase().match(/[a-z]{4,}/g) || [])
  .filter(w => !SKIP.has(w))
  .flatMap(w => (ALIAS[w] ? [w, ALIAS[w]] : [w]));

// The names in a caption: capitalised words of four letters up. The first
// word is capitalised whatever it is, so it has to be six ("Thanksgiving",
// "Winterfest") to count, which keeps "With" and "The" out.
const proper = cap => {
  const [first, ...rest] = String(cap).split(/\s+/);
  return [...(/^[A-Z][a-z]{5,}$/.test(first) ? [first] : []),
    ...(rest.join(' ').match(/[A-Z][a-z]{3,}/g) || [])];
};
const unclaimed = [];   // a photograph no trip in its month took

function splitPhotos(month) {
  const shots = (month.photos || []).filter(p => p.src).map(p => ({
    src: p.src, cap: p.cap || '', pos: p.pos,
    hay: `${p.cap || ''}`.toLowerCase(), path: p.src.toLowerCase(),
  }));
  const trips = month.trips || [];
  if (!shots.length || !trips.length) return trips.map(() => []);
  if (trips.length === 1) return [shots];

  const claims = trips.map(() => []);
  const free = () => { const taken = new Set(claims.flat()); return shots.filter(s => !taken.has(s)); };
  const only = hits => (hits.filter(Boolean).length === 1 ? hits.indexOf(true) : -1);

  // what only one trip's writing mentions: a name both mention says nothing
  const told = trips.map(t => [].concat(t.text).join(' '));
  shots.forEach(s => {
    const votes = new Set(proper(s.cap).map(n => only(told.map(text => text.includes(n)))).filter(k => k >= 0));
    if (votes.size === 1) claims[[...votes][0]].push(s);
  });

  // a caption that names one of a trip's places
  const open = free();
  trips.forEach((t, k) => claims[k].push(
    ...open.filter(s => words(t.place).some(x => s.hay.includes(x)))));

  // a folder named after a trip
  const unnamed = free();
  trips.forEach((t, k) => claims[k].push(
    ...unnamed.filter(s => words(t.place).some(x => s.path.includes(x)))));

  // When every trip has something, a photograph nothing placed goes with the
  // nearest placed one from its own folder, the one before it first: "Dinner
  // with family in Georgia" follows "Thanksgiving in Georgia". One from a
  // folder no trip took anything from stays out, and is listed.
  if (claims.every(c => c.length)) {
    free().forEach(s => {
      const i = shots.indexOf(s);
      const dir = slugOf(s.src);
      const near = dir && [...shots.slice(0, i).reverse(), ...shots.slice(i + 1)]
        .find(o => slugOf(o.src) === dir && claims.some(c => c.includes(o)));
      if (near) claims.find(c => c.includes(near)).push(s);
    });
    unclaimed.push(...free());
  }
  const left = free();
  // in the order the month shows them
  return claims.map(c => (c.length ? c : left.length ? left : shots))
    .map(c => shots.filter(s => c.includes(s)));
}

/* ── The line on the card ─────────────────────────────────────────────────
   David's words, cut to the first sentence or two and never reworded. The cut
   lands on a full stop so a memory never trails off mid-clause.            */

function blurb(text, max = 165) {
  const first = [].concat(text)[0] || '';
  if (first.length <= max) return first.trim();
  const cut = first.slice(0, max + 1);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (stop > 60) return first.slice(0, stop + 1).trim();
  return `${first.slice(0, first.lastIndexOf(' ', max)).trim()}…`;
}

/* A trip's dates with its year on. One that starts in December and ends in
   January ends in the next year, so it carries both. */
const dated = (dates, year) => {
  if (/\d{4}/.test(dates)) return dates;
  const over = String(dates).match(/^(December \d+) to (January \d+)$/);
  return over ? `${over[1]}, ${year} to ${over[2]}, ${Number(year) + 1}` : `${dates}, ${year}`;
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

const items = [];
const unfiled = [];   // a place a trip names, with no photograph taken there
const unsure = [];    // a photograph nothing could place, on a trip of several states

/* Where a memory is filed is worked out here rather than at each push, so
   every memory gets it the same way: the states its photographs were taken
   in. A state the title names is one the trip went to, but with no picture
   from there it would open on a picture from somewhere else, so it is left
   off and listed at the end of the run instead. */
const push = m => {
  if (!m.pics.length) return;
  const said = statesFromPlace(m.place);
  m.pics.forEach(p => { p.st = stateOfPic(p, said); });
  const shot = [...new Set(m.pics.map(p => p.st).filter(Boolean))];
  const all = [...new Set([...shot, ...said])];
  // a trip that never left one state: every photograph of it was taken there
  if (all.length === 1) m.pics.forEach(p => { p.st = all[0]; });
  // an unplaced photograph could be from any of them, so it keeps them all
  const loose = m.pics.filter(p => !p.st);
  m.st = all.filter(c => loose.length || m.pics.some(p => p.st === c));
  if (all.length > 1) {
    loose.filter(p => pinOf(p.src) === undefined && statesFromPlace(p.cap || '').length < 2)
      .forEach(p => unsure.push({ m, p }));
  }
  all.filter(c => !m.st.includes(c)).forEach(c => {
    const names = [...new Set(namedPlaces(m.place)
      .filter(n => n.st.includes(c) && !n.bare).map(n => n.name))];
    unfiled.push({ c, m, n: names.slice(0, 2).join(' & ') || m.short });
  });
  if (!m.st.length) return;
  m.t = titlesByState(m.place, m.short, m.st, stopsOf(m.pics));
  items.push(m);
};

/* Volume one: the chapters before the wedding. Their photographs sit loose in
   assets/photos/, with no folder or GPS stop to go by, so each is taken to be
   from the chapter's own place, when that names one state, unless PIC_ST
   pins it somewhere else: the May 2022 Cincinnati chapter's Mammoth Cave
   photographs are in Kentucky.                                              */
MW.timeline.forEach((c, i) => {
  const own = statesFromPlace(c.place);
  const home = own.length === 1 ? own[0] : '';
  push({
    place: c.place,
    short: c.short || String(c.place).split(/[,&]/)[0].trim(),
    date: c.date,
    year: c.year,
    text: blurb(c.text),
    href: `story.html#chap-${i + 1}`,
    pics: (c.photos || []).map(p => ({ src: `photos/${p}`, home })),
  });
});

/* Volume two: the year pages. The honeymoon runs a day at a time, the rest of
   the year a trip at a time. */
YEARS.forEach(({ year }) => {
  const Y = read(`assets/js/years/${year}.js`, 'MW_YEAR');

  const H = Y.honeymoon;
  if (H) {
    (H.days || []).forEach(d => {
      const pics = (d.photos || []).filter(p => p.src);
      push({
        place: d.where || d.title,
        short: d.title,
        date: `${d.date}, ${year}`,
        year,
        text: blurb(d.text),
        // the same id year.js gives the day: two halves of one day are -1 and -2
        href: `${year}.html#day-${d.day}${d.part ? `-${String(d.part).replace(/\D/g, '')}` : ''}`,
        pics: pics.map(p => ({ src: p.src, cap: p.cap, pos: p.pos })),
      });
    });
  }

  (Y.months || []).forEach(m => {
    const split = splitPhotos(m);
    (m.trips || []).forEach((t, k) => {
      const pics = split[k] || [];
      push({
        place: t.place,
        short: String(t.place).split(/[,:&]| to /)[0].trim(),
        date: dated(t.dates, year),
        year,
        text: blurb(t.text),
        href: `${year}.html#${MONTHS[m.month - 1].toLowerCase()}`,
        pics: pics.map(p => ({ src: p.src, cap: p.cap, pos: p.pos })),
      });
    });
  });
});

/* ── Write it out ─────────────────────────────────────────────────────────
   "by" is state code to the memories filed under it, newest first, so a click
   on the map is a lookup and nothing more.                                  */

const by = {};
items.forEach((m, i) => m.st.forEach(s => (by[s] ||= []).push(i)));

/* A state with nothing filed under it, but a trip that names it: the panel
   says which trip and links to it, instead of calling it a drive through. */
const bare = {};
unfiled.filter(u => !by[u.c]).forEach(u => (bare[u.c] ||= []).push({ n: u.n, y: u.m.year, h: u.m.href }));
const key = i => `${items[i].year}${items[i].date}`;
Object.values(by).forEach(list => list.sort((a, b) => (key(a) < key(b) ? 1 : -1)));

const url = src => (src.includes('/') ? `assets/${src}` : `assets/photos/${src}`);
const j = v => JSON.stringify(v);
const body = items.map(m => {
  // "s" is the state a photograph was taken in, "t" what to call the memory
  // when a given state is the one someone picked. Both are left out when
  // there is nothing to say.
  const pics = m.pics.map(p => `{"u":${j(url(p.src))}${p.cap ? `,"c":${j(p.cap)}` : ''}${p.pos ? `,"p":${j(p.pos)}` : ''}${p.st ? `,"s":${j(p.st)}` : ''}}`);
  const t = Object.keys(m.t).length ? `"t":${j(m.t)},` : '';
  return `  {"st":${j(m.st)},"place":${j(m.place)},"short":${j(m.short)},"date":${j(m.date)},"year":${j(m.year)},"href":${j(m.href)},${t}\n   "text":${j(m.text)},\n   "pics":[${pics.join(',')}]}`;
}).join(',\n');

const out = `/* Every trip on the site, filed under the state it happened in, so the map on
   the home page can hand back photographs the moment someone clicks a state.
   Generated by tools/build-memories.mjs from data.js, years/20XX.js and
   years/places.js: run that again after adding a trip, do not edit this.
   "by" is a state code to the memories under it, newest first. On a memory,
   "t" is what to call it when a given state is picked, and a photograph's
   "s" is the state it was taken in, so a trip that crossed a line shows the
   right half of itself under either one. "bare" is a state with nothing
   filed under it, and the trips that name it all the same. */
window.MW_MEMORIES = {
 "items": [
${body}
 ],
 "by": ${JSON.stringify(by)},
 "bare": ${JSON.stringify(bare)}
};
`;

fs.writeFileSync(path.join(ROOT, 'assets/js/memories.js'), out);

console.log(`${items.length} memories, ${Object.keys(by).length} states`);
console.log(Object.entries(by).sort((a, b) => b[1].length - a[1].length)
  .map(([s, l]) => `${s}:${l.length}`).join('  '));
if (unfiled.length) {
  console.log('\nNamed by a trip, but no photograph from there, so not on the map under it:');
  unfiled.forEach(u => console.log(`  ${u.c}  ${u.n}, ${u.m.year}  (${u.m.place})${by[u.c] ? '' : '  <- the state has nothing else'}`));
}
if (unclaimed.length) {
  console.log('\nOn a month page, but in no memory, because nothing says which of the month\'s trips they are from:');
  unclaimed.forEach(p => console.log(`  ${path.basename(p.src)}  ${p.cap || '(no caption)'}`));
}
if (unsure.length) {
  console.log('\nNothing says which state these were taken in. Name the place in the caption, or add them to PIC_ST:');
  unsure.forEach(({ m, p }) => console.log(`  ${path.basename(p.src)}  ${p.cap || '(no caption)'}  (${m.place})`));
}
