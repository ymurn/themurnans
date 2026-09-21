/* Builds assets/js/memories.js: every trip on the site, indexed by the state
   it happened in, so the map on the home page can hand back a few photographs
   the moment someone clicks a state.

   Nothing here is written by hand. The sources are the same files the rest of
   the site reads:
     assets/js/data.js          the twenty-nine chapters before the wedding
     assets/js/years/20XX.js    every trip since, month by month
     assets/js/years/places.js  where each trip's photographs were taken, from
                                the GPS in the originals, which is what says
                                which state a trip belongs to

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
};

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
  const s = String(place).toLowerCase().replace(DC_RE, ' · ');
  const out = new Set();
  (place.match(/\b([A-Z]{2})\b/g) || []).forEach(c => { if (CODES.has(c)) out.add(c); });
  if (DC_RE.test(String(place).toLowerCase())) out.add('DC');
  if (/\bqc\b/i.test(place)) out.add('CA-QC');
  for (const [name, code] of Object.entries(NAMES)) {
    if (new RegExp(`(^|[^a-z])${name}([^a-z]|$)`).test(s)) out.add(code);
  }
  const took = [];
  const free = (a, b) => !took.some(([x, y]) => a < y && b > x);
  for (const name of KEYS) {
    const re = new RegExp(`(^|[^a-z])(${esc_re(name)})([^a-z]|$)`, 'g');
    let m;
    while ((m = re.exec(s))) {
      const a = m.index + m[1].length;
      if (free(a, a + name.length)) { took.push([a, a + name.length]); out.add(KNOWN[name]); }
      re.lastIndex = a + 1;
    }
  }
  return [...out];
}

/* The GPS answer: which folder a photograph sits in, and what places.js says
   was photographed there. This wins, because it was measured rather than read. */
const slugOf = src => {
  const m = String(src).match(/continued_trips\/([^/]+)\//);
  return m ? m[1] : null;
};
const stopsOf = pics => {
  const out = [];
  const seen = new Set();
  pics.forEach(p => (PLACES[slugOf(p.src) || ''] || []).forEach(s => {
    const key = `${s.n}|${s.st}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ n: s.n, st: s.st === 'QC' ? 'CA-QC' : s.st, p: s.p || 0 });
  }));
  return out;
};
function statesFromPics(pics) {
  const out = new Set();
  stopsOf(pics).forEach(s => { if (s.st) out.add(s.st); });
  return [...out];
}

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

/* Which state a photograph was taken in: the folder's only stop, the stop its
   caption names, or the state its caption names outright. One that matches
   nothing is left unmarked and shows under any of the memory's states.     */
const hay = s => String(s).toLowerCase();
function stateOfPic(pic, all) {
  const stops = (PLACES[slugOf(pic.src) || ''] || [])
    .map(s => ({ n: s.n, st: s.st === 'QC' ? 'CA-QC' : s.st }))
    .filter(s => s.st && all.includes(s.st));
  if (stops.length === 1) return stops[0].st;
  // The caption only. The folder is named after the whole trip, so
  // 2024-06-cincinnati-holiday-world would put every photograph in Ohio.
  if (pic.cap) {
    const hit = stops.find(s => hay(pic.cap).includes(hay(s.n)));
    if (hit) return hit.st;
    const c = statesFromPlace(pic.cap).filter(x => all.includes(x));
    if (c.length === 1) return c[0];
  }
  return !stops.length && all.length === 1 ? all[0] : '';
}

/* ── Photographs ──────────────────────────────────────────────────────────
   A month's photographs are split between that month's trips exactly the way
   the memory machine in site.js splits them: each trip takes the ones whose
   caption names one of its places, then any uncaptioned photograph from a
   folder named after one, and a trip that matches nothing takes what is left. */

const ALIAS = { cincinnati: 'cincy', philadelphia: 'philly', washington: 'dc' };
const SKIP = new Set(['with', 'from', 'home', 'long', 'this', 'that', 'trip']);
const words = place => (String(place).toLowerCase().match(/[a-z]{4,}/g) || [])
  .filter(w => !SKIP.has(w))
  .flatMap(w => (ALIAS[w] ? [w, ALIAS[w]] : [w]));

function splitPhotos(month) {
  const shots = (month.photos || []).filter(p => p.src).map(p => ({
    src: p.src, cap: p.cap || '', pos: p.pos,
    hay: `${p.cap || ''}`.toLowerCase(), path: p.src.toLowerCase(),
  }));
  const trips = month.trips || [];
  if (!shots.length || !trips.length) return trips.map(() => []);
  if (trips.length === 1) return [shots];

  const byCap = trips.map(t => shots.filter(s => words(t.place).some(x => s.hay.includes(x))));
  const named = new Set(byCap.flat());
  const claims = trips.map((t, k) => [...byCap[k],
    ...shots.filter(s => !named.has(s) && words(t.place).some(x => s.path.includes(x)))]);
  const taken = new Set(claims.flat());
  const left = shots.filter(s => !taken.has(s));
  return claims.map(c => (c.length ? c : left.length ? left : shots));
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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

const items = [];
/* The per-state name and the per-photograph state are worked out here rather
   than at each push, so every memory gets them the same way. */
const push = m => {
  if (!m.st.length || !m.pics.length) return;
  m.t = titlesByState(m.place, m.short, m.st, stopsOf(m.pics));
  m.pics.forEach(p => { p.st = stateOfPic(p, m.st); });
  items.push(m);
};

/* Volume one: the chapters before the wedding. Their photographs sit loose in
   assets/photos/, so the state can only come from the chapter's own place.  */
MW.timeline.forEach((c, i) => {
  push({
    place: c.place,
    short: c.short || String(c.place).split(/[,&]/)[0].trim(),
    date: c.date,
    year: c.year,
    st: statesFromPlace(c.place),
    text: blurb(c.text),
    href: `story.html#chap-${i + 1}`,
    pics: (c.photos || []).map(p => ({ src: `photos/${p}` })),
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
        st: statesFromPics(pics).length ? statesFromPics(pics) : statesFromPlace(d.where || ''),
        text: blurb(d.text),
        href: `${year}.html#day-${d.day}`,
        pics: pics.map(p => ({ src: p.src, cap: p.cap, pos: p.pos })),
      });
    });
  }

  (Y.months || []).forEach(m => {
    const split = splitPhotos(m);
    (m.trips || []).forEach((t, k) => {
      const pics = split[k] || [];
      const gps = statesFromPics(pics);
      const said = statesFromPlace(t.place);
      // GPS first; anything the title names that the GPS missed comes after
      const st = [...new Set([...gps, ...said])];
      push({
        place: t.place,
        short: String(t.place).split(/[,:&]| to /)[0].trim(),
        date: /\d{4}/.test(t.dates) ? t.dates : `${t.dates}, ${year}`,
        year,
        st,
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
   right half of itself under either one. */
window.MW_MEMORIES = {
 "items": [
${body}
 ],
 "by": ${JSON.stringify(by)}
};
`;

fs.writeFileSync(path.join(ROOT, 'assets/js/memories.js'), out);

const none = items.filter(m => !m.st.length);
console.log(`${items.length} memories, ${Object.keys(by).length} states`);
console.log(Object.entries(by).sort((a, b) => b[1].length - a[1].length)
  .map(([s, l]) => `${s}:${l.length}`).join('  '));
if (none.length) console.log('NO STATE:', none.map(m => m.place).join(' | '));
