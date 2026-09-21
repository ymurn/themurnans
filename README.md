# The Murnans, The Bear & the Tiger

A living archive for David and Yinja Murnan. Plain HTML, CSS and JavaScript, no build
step and no dependencies.

**Run it locally.** From this folder:

```bash
python3 -m http.server 8777
```

then open <http://127.0.0.1:8777>. Double-clicking `index.html` also works, but YouTube
will not play inside a page opened straight off the disk, so the video shows its still
and opens in a new tab instead. Everything else behaves the same either way.

The old Webflow site is untouched in `../murnanwen.webflow/`.

---

## The pages

The nav carries four: **Home**, **Hitched**, **Honeymoon** and **Highlights**. The
timelines are not in it, they are a column in the footer, because they are where you go
once the home page has made you curious, not the first thing you are asked to read.

| File | In the nav | What it is |
|---|---|---|
| `index.html` | Home | The hero and its slider, then the map: pick a state, get a few photographs out of it, open one and it links into the year it happened |
| `day.html`    | Hitched | **Our Big Day**: the wedding, as one chapter of the story |
| `honeymoon.html` | Honeymoon | **The Honeymoon**: the fifteen days from Sacramento to Seattle, with the drive on the map beside them. A trip page |
| `highlights.html` | Highlights | **David's 40th**: the April 2025 desert loop. The first of the highlights, and the one the nav opens. A trip page |
| `highlights-yinjas-30th.html`<br>`highlights-citizenship.html` | From the Highlights bar | The other two highlights, still to come. Each says so and links across to the others |
| `story.html`  | Footer, Timelines | **The Long Way Round**: the chapter timeline, built from `assets/js/data.js`, with a map beside it |
| `2022.html` to `2025.html` | Footer, Timelines | One page per year since the wedding, built from `assets/js/years/` |
| `table.html`  | Footer, Pages | **At Our Table**: the two drinks, the nine restaurants, the wedding feast |
| `home-archive.html` | Not linked | The home page as it was: six bands, the four doors, the memory machine, the years since the wedding. Kept whole as the place to pull a device from when building a new page. **Do not edit it.** |

### The home page

It used to be six bands long and most people left before the bottom, so it is now three
short ones under the hero:

1. **The hero**, the two illustrations and the pour slider, exactly as it was, with the
   blue ticker under it.
2. **Memories**, which is the map. Tap a state and photographs from it are dealt beside
   it, ten on a wide screen and six on a phone (`MEM_DEAL` and `MEM_DEAL_WIDE` in
   `assets/js/site.js`). Tap a photograph and it opens with the rest of that trip's roll,
   David's line about it, and a way into the year it happened. Tapping empty sea goes back
   to a draw from everywhere. A state we have been to but never written up says so plainly.

   **Surprise me** sits on the panel's own heading row, opposite the name of whatever is
   showing, because the action belongs with the results rather than floating above the
   map. It rolls to a state we have actually written up, never the one already showing, so
   it always changes something. The die on the phone pill does exactly the same thing: one
   glyph, one meaning. Re-dealing the state you are already on is still there, it is just
   called tapping it again on the map.

   A state's count (**Ohio · 14 memories**) is worth saying, since six cards out of
   fourteen is a reason to go back for more. The total across the site is not, so
   **Anywhere** carries no number: the cards under it already say what it means.

   Clicking away from the section puts it back to a draw from everywhere, the same as
   clicking the sea inside the map. That check runs on the way *down* the document rather
   than on the way up, because opening a card repaints the panel and throws the clicked
   button out of the document, and a button with no ancestors left cannot answer whether
   it was inside the section. The nav is exempt: changing the theme is not a way of saying
   you are finished with Ohio.

   Every choice deals a fresh set, so every choice also scrolls back to the top of it.
   Without that, choosing a second state from halfway down the first state's photographs
   drops you into the middle of a set you have not seen. An odd number of cards gives the
   last one the whole row rather than leaving it on its own.

   **On a wide screen** the map sits in a sticky column so it follows the photographs down
   instead of leaving a hole under itself.

   **On a phone** there is no room for both, so the map scrolls away like anything else
   and hands over, as it goes, to a small dark pill that stays put: the state's own
   outline in gold, its name, its count, and a die that reshuffles the set. Tapping the
   pill does not raise a panel from somewhere else, the pill grows into the map, and
   shrinks back into it when a state is picked. That is what keeps the two reading as one
   object. The pop-up hangs off `<body>` rather than off the section, because a fixed
   child of a frosted or clipped ancestor is a trap, and the map itself is *moved* between
   the page and the pop-up rather than drawn twice: one set of states, one set of
   listeners, one print. The handover point is `GONE` in `initMemoryMap`, set to the
   bottom edge of the pill so the two never share the screen and there is never a moment
   with neither of them on it.

   **The print.** The first time the map comes into view its states stamp themselves in,
   nearest Astoria first, each one landing a shade too hard and settling; the gold star on
   Astoria lands last and throws a few sparks. Once per visit, not once per scroll. The
   classes that drive it (`is-printed`, `is-set`, `is-picked`) sit on the `<svg>` rather
   than on the section, because the map travels out of the section into the pop-up and
   would lose them. Anyone who scrolls straight past the map, or opens the pop-up before
   the map has been seen, gets it landed instantly rather than blank. Under
   `prefers-reduced-motion` it is simply there.
3. **The tally**, the four counts as cards, the countdown calendar, and the one link off
   the site.
4. **Said about us**, five lines from the wedding speeches on a rail that scrolls itself
   until anyone touches it.

Where the photographs come from is **`assets/js/memories.js`**, which is generated, see
**The memory index** below.

---

## Adding a new chapter

The Long Way Round is Volume One: the trips before the wedding. Everything on its
timeline comes from one file, **`assets/js/data.js`**. Trips after the wedding go on the
year pages instead, see **The year pages** below. Either way, finish by running
`node tools/build-memories.mjs` so the new trip joins the map on the home page.

1. **Drop the photos** into `assets/photos/`. Lowercase names, no spaces
   (`2022-vermont-01.jpg`). Around 800–1200px on the long edge is plenty.

2. **Add an entry** to the `timeline` list in `assets/js/data.js`. Chapters appear in
   the order they're listed, so slot a new one in where its date falls. Copy this shape:

```js
  {
   "date": "June 18, 2022",
   "place": "Somewhere New, VT",
   "text": "What happened, in your own voice. Two or three sentences is the sweet spot.",
   "photos": [
    "2022-vermont-01.jpg",
    "2022-vermont-02.jpg",
    "2022-vermont-03.jpg"
   ],
   "year": "2022",
   "short": "Somewhere New"
  }
```

   Every entry needs a comma after its closing `}` **except the very last one**.

   `short` is the caption written under a photo when this chapter turns up beside
   **Who** on the home page, so keep it to two or three words (`Beacon`, `Upstate New York`).

3. **Put the chapter on the map.** The map beside the timeline reads
   **`assets/js/story-places.js`**, which is keyed by the chapter's `place`, written
   exactly as it is in `data.js`. Add an entry and the chapter gets its dot, its name
   and its state inked in; leave it out and the chapter simply has no stop. `at` is
   the point on the map, in the same frame as `assets/js/atlas.js`, so ask Claude for
   the two numbers rather than working them out by hand. Everywhere in and around the
   city shares one `New York` stop: separate dots for Queens and Brooklyn land on top
   of each other and on the star that marks home.

4. **Photo counts change the layout automatically:**
   - 1 photo, one wide landscape frame
   - 2 photos, a pair, side by side
   - 3 photos, a mosaic: one tall on the left, two stacked on the right
   - 4–6 photos, an even grid

**The three photographs beside Who** on the home page are dealt fresh on every load
from the chapter photos whose names start with a date (`20201225-01.jpg`,
`21041801.jpg`, `2022-vermont-01.jpg`), so a new chapter's photos join the draw by
themselves. The draw only wants pictures with both of you in them: if one is a view, a
plate of food or a big group, add its file name to `NOT_US` in `assets/js/site.js`.

The `29` figure on the home page is hard-coded in `index.html`, search for
`data-count="29"` and bump it when the count changes. Its label on the next line reads
**Adventures before the wedding**, which stays true as long as later trips go on the
year pages. The three figures beside it are hard-coded the same way: road trips, national
parks (40: 32 through 2025, plus 8 in 2026 not posted yet, the last two being Badlands
and Wind Cave on September 19th; only the 63 designated national parks count). The 32 is
31 named across the year pages, 2022 to 2025, plus Mammoth Cave in Volume One, and it
already counts all five Utah parks. States (35,
plus DC: 30 on the year pages through 2025, plus Kentucky, and North Dakota, South Dakota,
Wyoming and Nebraska in 2026, not posted yet).

Those four 2026 states are listed again as `FRESH` in `initMemoryMap`, which is what has
the map say **Just been** and *Coming soon* for them rather than the line it gives a state
we only ever drove through. Add a code there the day you get home from somewhere new, and
take it out once that trip is in `assets/js/years/` and `memories.js` has been rebuilt.

**The map beside the figures** colors in every state and province we've been to. The list
is `VISITED` at the top of the map section in `assets/js/site.js`: add a state's two letters
(`'KY'`), or `CA-` and a province's (`'CA-ON'` for Ontario). The count in the caption under
the map updates itself; the states figure beside it doesn't, so bump that too. The outlines
are in `assets/js/atlas.js`, drawn from Natural Earth's public-domain boundaries, and
nothing in that file needs editing.

---

## The year pages

**After the Wedding** is Volume Two: one page per year, `2022.html` to `2025.html`, all
built by `assets/js/year.js` from two kinds of file:

- **`assets/js/years/index.js`**: every year in order, with its name and its Christmas
  card. The row of cards at the top of each page and the year buttons in the bar come
  from this list, so a year added here shows up on every year page.
- **`assets/js/years/2023.js`** (one per year): that year's months, trips, photographs and
  New Year's letter. Each month's text is David's own sentences from our posts, cut down to
  the highlights. Cut more if a month runs long, but keep every sentence as he wrote it.

2022 runs the honeymoon day by day, David's posts word for word, with a map that inks in
each day's drive as you scroll. The same fifteen days are also the whole of
`honeymoon.html`, copied across by `tools/build-honeymoon.mjs`: edit them here and run
that (see **The trip pages**). On wide screens it sits beside the days. On phones and
tablets (under 1180px) it unrolls from under the bar once the first day scrolls up to it: a
band 30% of the screen tall, zoomed in on the day you're reading, that tucks away again
after the last day. Its **Whole route** button opens the full trip in a window. October to December follow
month by month, the same as 2023 onward. A month with no trip shows greyed out in the bar.

**The end of every year page** is the same band, built by **`assets/js/closing.js`**: the
four Christmas cards, one a year, each opening that year's timeline, and the two things we
would rather someone did next, **View highlights** and **Follow @themurnans**. The trip
pages end on it too (a trip file asks for it with `"closing": { "years": true }`), so
adding a year to `years/index.js` puts its card on the foot of every one of them.

**The maps.** Every year page draws a map of where that year's photographs were taken, and
The Long Way Round draws the same map beside its chapters. On a
wide screen it is a small window that floats at the left edge while the months are on
screen, so the months keep their full width and nothing moves as it comes and goes; under
1180px it unrolls from under the bar in a band 30% of the screen tall, the same as the
honeymoon map. It moves to the month being
read, names that month's stops, and colors in each state as the year goes on. The **Whole
year** button (**Whole volume**, on The Long Way Round) opens all of it in a window.

Below 1180px every map band carries the same two controls, added by
**`assets/js/mapfold.js`**: a button in the map's top corner that opens the whole thing in
a window, and **Minimize**, which folds the band into a small pill in the middle of the
screen. The pill goes on naming the month, day or stop being read, and opens the map again
when it is pressed.

One component draws all three: **`assets/js/trailmap.js`**, styled by
**`assets/css/map.css`**, fed months by `assets/js/year.js` and chapters by
`initStoryMap()` in `assets/js/site.js`. A page that wants the map loads those two files
and marks the section holding its text `ymap-clear`, so the text starts clear of the
floating window.

Nothing about the map needs editing. The stops come from `assets/js/years/places.js`, which
was generated once from the GPS in the Travel archive's originals of the photographs in
`assets/continued_trips/`: one point per place a trip stayed at, grouped from the photographs
themselves and projected to the same frame as the outlines in `assets/js/atlas.js`. A month
maps itself, because the map reads the trip folders that month's photographs come from. A
month whose photographs are still placeholders simply has no stops on it, and a year with
new folders needs those folders added to `places.js` (ask Claude to regenerate it).

**Adding photographs.** Every month, and every honeymoon day, has three to five photo
slots. Each slot's caption says which picture belongs there:

```js
{ "cap": "Delicate Arch" }
```

Put the photo in that year's folder, `assets/photos/2025/` (lowercase, no spaces, about
1200px on the long edge), and add its name to the slot:

```js
{ "src": "04-delicate-arch.jpg", "cap": "Delicate Arch" }
```

A slot without `src` stays a placeholder. The caption goes with the photo into the
lightbox. One to six slots all lay out properly, but three to five looks best.

A big trip goes to more places than five photographs can show, and the map only knows
the folders those five came from. Name the rest in the month's own `folders` and they
get their dots and their states without taking a slot:

```js
   "folders": ["2025-04-canyonlands", "2025-04-capitol-reef"]
```

That sits beside `photos` in the month, not inside it. April 2025 uses it for the two
Utah parks the month's five photographs don't cover.

Trip photos already in `assets/continued_trips/` don't need copying anywhere. Give the
path from `assets/` instead of a name, and add `pos` when the people sit off to one side
and get cropped (`left`, `right`, or a percentage across and down, like `65% 50%`):

```js
{ "src": "continued_trips/2025-04-arches/2025-04-arches-01.jpg", "cap": "Delicate Arch", "pos": "65% 50%" }
```

The 2023 to 2025 pages point straight into that folder, so don't rename or move the
photos in it.

**Adding a year** (2026, once it's over):

1. Crop the Christmas card to 7 × 5 and save it twice in `assets/art/cards/`:
   `card-2026.jpg` at 1400 × 1000 and `card-2026-sm.jpg` at 560 × 400. On a Mac,
   from this folder (the first line crops to 7 × 5 around the center, so change its two
   numbers to suit the card; the other two resize and compress):

```bash
sips -c 3000 4200 ~/Desktop/card.jpg --out /tmp/card-7x5.jpg
sips -m "/System/Library/ColorSync/Profiles/sRGB Profile.icc" -s format jpeg -s formatOptions 72 -z 1000 1400 /tmp/card-7x5.jpg --out assets/art/cards/card-2026.jpg
sips -m "/System/Library/ColorSync/Profiles/sRGB Profile.icc" -s format jpeg -s formatOptions 74 -z 400 560 /tmp/card-7x5.jpg --out assets/art/cards/card-2026-sm.jpg
```

2. Add the year to the end of `assets/js/years/index.js`. Until the card exists, leave
   `"card": ""` and a blank card stands in.
3. Copy `assets/js/years/2025.js` to `2026.js` and write in the new months.
4. Copy `2025.html` to `2026.html` and change the title, the description, the heading,
   the intro under it, and the `years/2025.js` script near the bottom.

The home page's **Since 2022** section is built from the same `index.js`, so the new
year's card turns up there by itself, with the "Latest" sticker moved onto it.

The newest year's page ends with the earlier years' cards instead of a next one, and
every **After the Wedding** link opens on the newest year: the nav and footer on every
page, the fourth door on the home page, The Long Way Round and Our Big Day. So once
2026 is added, search the HTML files for `href="2025.html"` and change each to
`href="2026.html"`.

---

## The trip pages

One trip, told stop by stop, with a map running beside it: the honeymoon, and
each of the highlights. They are all the same page, drawn by **`assets/js/trip.js`**
from one file in **`assets/js/trips/`**, and styled by **`assets/css/trip.css`**
on top of `site.css`, `year.css` and `map.css`.

| Page | Its file |
|---|---|
| `honeymoon.html` | `assets/js/trips/honeymoon.js` (generated, see below) |
| `highlights.html` | `assets/js/trips/davids-40th.js` |

There is no page above the highlights: **`highlights.html` is David's 40th**, and the
other highlights are reached from the bar at the top of it and from the buttons at the
foot. Every page in the site links to `highlights.html`, so that one link opens the
highlight that is written.

**What a page is made of**, top to bottom:

- the head: the dates, the title, a line about the trip, and **four photographs from it**,
  dealt fresh on every visit, one from each quarter of the trip, so the four cover the
  whole of it rather than one afternoon. Press one to see it big.
- the facts, four of them, and the line saying whose words the page carries
- the sticky bar: the other highlights first, then this page's own stops
- the stops, each with its writing and its photographs, and the map beside them
- the way on at the end

**The map.** Every trip map is the same component, **`assets/js/tripmap.js`**: the states
from `assets/js/atlas.js`, inked in as the trip reaches them, with the route drawn over
them. As each stop scrolls past, the drive into it lights up in coral and the stops
around it get their names. On a wide screen the map sits in the column beside the
writing. Below 1180px it unrolls from under the bar as a band, zoomed in on the stop
being read, and there it carries two controls of its own: **a corner button that opens
the whole trip in a window**, and **Minimize**, which folds the band up into a small pill
in the middle of the screen. The pill goes on naming the stop being read, and opens the
map again when it is pressed.

**The file behind a trip:**

```js
window.MW_TRIP = {
  "kicker": "April 16 to 28, 2025",     // the line above the title
  "title": "David's 40th",
  "barLabel": "Stop",                   // what the bar calls the chips
  "galleryNote": "Four from the two weeks",
  "note": "Whose words these are",      // sits under the facts
  "facts": [{ "k": "...", "v": "13", "s": "..." }],
  "siblings": { "label": "Highlights", "items": [{ "label": "...", "href": "...", "here": true }] },
  "map": {
    "view": [96, 252, 205, 150],        // the piece of the atlas a wide screen shows
    "width": "clamp(300px, 30vw, 430px)", // how wide its column is, for a wide map
    "aria": "...", "whole": "Whole loop",
    "sheet": { "k": "...", "title": "..." }
  },
  "route": [{ "n": "Las Vegas", "at": [156.3, 343.6], "st": "NV" }],
  "stops": [{
    "k": "Stop 1", "chip": "Las Vegas", "sub": "", "title": "Las Vegas",
    "where": "Nevada", "leg": [0, 0],
    "quote": { "text": "a line someone said", "who": "who said it" },
    "lead": "ours, before David's words",
    "text": ["David's, word for word"],
    "line": "ours, where David wrote nothing",
    "photos": [{ "src": "continued_trips/...", "cap": "...", "pos": "65% 50%" }]
  }],
  "closing": { "k": "...", "title": "...", "text": "...", "btns": [{ "href": "...", "label": "...", "ghost": true }] }
};
```

`text` is David's writing and nothing else, cut down the way the year pages cut it: whole
sentences dropped, none reworded, his typos left in. `lead` and `line` are ours, and they
are printed lighter than his paragraphs so the two voices never read as one. `quote` is a
line he quoted inside a post, pulled out beside a brass rule. Photo captions are ours too,
which is what the `note` under the facts says on the page.

**A sentence with an em-dash in it gets dropped rather than edited**, which is the rule for
his writing everywhere on the site. Where that leaves the next sentence without its
subject, a `lead` of ours puts it back: David's Arches hiking post names both hikes in
em-dashed sentences, so the lead names them instead.

**The points on the route** are the same frame the atlas is drawn in, so they can be
copied straight out of `assets/js/years/places.js`, which was read from the GPS in the
photographs. A stop's `leg` is the first and last point of the drive to it, and that
stretch is what lights up while the stop is being read. `view` is the piece of the atlas
the map holds, `[x, y, width, height]`: keep the whole route inside it with room for the
names, and remember a state is only named while its middle, or the piece of it on
screen, has room for the name.

**The honeymoon is generated.** Its fifteen days already live inside the 2022 page, so
they are copied across rather than kept in two places:

```bash
node tools/build-honeymoon.mjs
```

Edit the honeymoon in `assets/js/years/2022.js`, run that, and
`assets/js/trips/honeymoon.js` is rebuilt: David's words, the photographs, and the route
turned from latitudes and longitudes into points on the atlas. Everything written for
the trip page alone (its lede, facts, map frame and ending) sits in the tool.

**Adding a highlight** once it has happened:

1. Write `assets/js/trips/<name>.js` in the shape above.
2. Copy `highlights.html` to `highlights-<name>.html`, change the title, the description,
   the head and the `trips/<name>.js` script at the bottom.
3. Add it to `"siblings"` in every highlight's file, and mark `"here": true` in its own.
4. Replace that highlight's placeholder page if it had one.

---

## The memory index

The map on the home page reads one file, **`assets/js/memories.js`**: every trip on the
site filed under the state it happened in, with its photographs, its date and where it
links to. Nothing in it is written by hand. Rebuild it after adding a chapter, a trip or
a year:

```bash
node tools/build-memories.mjs
```

It reads the same three sources the rest of the site reads, `assets/js/data.js`, each
`assets/js/years/20XX.js`, and `assets/js/years/places.js`, and prints what it found:

```
96 memories, 32 states
NY:24  OH:14  WA:14  VA:8  CA:7  PA:5  DC:5  MD:5 ...
```

Which state a trip belongs to comes from the GPS in the photographs, by way of
`places.js`, and only falls back to reading the trip's own title when a trip has no
photographs in `assets/continued_trips/`. Chapters before the wedding have their
photographs loose in `assets/photos/` with no GPS, so those are read from the title
alone, against the list of place names at the top of the script. A new town that is not
on that list and does not name its state (`Beacon, NY` names it, `Fallingwater` does
not) needs a line adding there.

A state we have been to with nothing written up yet shows on the map and says so when
tapped. That is four of the thirty-six: Nevada, North Dakota, South Dakota and Wyoming,
all drives through on the way somewhere else.

---

## Adding a restaurant

Same file, the `tables` list at the bottom:

```js
  {
   "name": "Somewhere Good",
   "meta": "Wine bar • $$",
   "map": "https://maps.app.goo.gl/...",
   "address": "123 Somewhere St, Brooklyn, NY 11215",
   "note": "Why you'd send someone here.",
   "photo": "somewhere-good.jpg"
  }
```

They're numbered automatically. Update the "Nine tables" heading in `table.html` if the
count changes.

---

## The anniversary counter

Computed live from the wedding date every time the page loads, so it never goes stale.
Both values live at the top of `initAnniversary()` in `assets/js/site.js`:

```js
const WEDDING  = new Date(2022, 7, 6);  // months are 0-indexed: 7 = August
const MILESTONE = 5;                     // counting down to the fifth
```

After August 2027, change `MILESTONE` to `10` and it starts counting to the tenth.

---

## Design notes

**Where the look comes from**: the palette is sampled straight out of the Bear & Tiger
artwork: the dusty blue of the logo ground, warm cream, khaki, butter-gold sparkles,
dusty-rose mat, and heavy black ink. Blue and green run through it, burgundy carries the
beer-and-wine end of things.

Three devices carry the illustration style into the interface:

1. **Ink keylines**: a chunky 2px black border on cards, buttons and photographs, the
   same weight as the drawn line.
2. **Off-register color**: a flat color block sitting a few pixels out from behind
   each card, the way a screen-printed fill never quite lines up with its outline.
3. **Chunky curves and small tilts**: nothing is perfectly square or perfectly straight.

All of it is defined once at the top of `assets/css/site.css`: colors, `--keyline`, and
the `--r-lg` / `--r-md` / `--r-sm` corner radii. Change a token, change the whole site.

Two themes: `dawn` (warm cream, the default) and `dusk` (deep teal). The toggle sits in
the nav and remembers its setting.

**Type**
- [Gloock](https://fonts.google.com/specimen/Gloock): headlines, numerals and names.
  A very high-contrast display serif: hairline curves against heavy stems. Elegant,
  uncommon, and a deliberate counterweight to the heavy ink keylines.
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk): everything you read,
  plus the small letterspaced caps on labels and the ticker.
- [Caveat](https://fonts.google.com/specimen/Caveat): used **only** where a person is
  speaking: the pull quote and the two speech bubbles. It echoes the hand-lettering in
  the artwork without making the whole site casual.

Gloock has a single weight, which is what keeps it refined, the drama comes from its
contrast and scale, never from bolding it.

**The illustrations** keep their black ink in both themes, that's the artist's line, not
a UI color. In dusk a faint ghost of the color fill sits behind them so the black still
reads on the dark ground.

**Things to play with**
- *The curtain*: the intro on the home page, once per visit. Click or press any key to
  skip it, or add `?intro` to the address (`index.html?intro`) to see it again. The
  loading line under the names is a random draw from `CURTAIN_LINES`, at the top of
  the curtain section in `assets/js/site.js`.
- *The pour*: the hero slider clips the color layer over the line art. It fills itself
  once when the page opens, then it's yours to drag. It throws confetti when it lands.
- *Poke the characters*: click either of you and you say something. Six lines each,
  in `LINES` at the top of the interaction section in `assets/js/site.js`.
- *The map*: the home page's way in. Tap a state for a few photographs from it, tap one of
  those to open the trip, tap the sea to go back to a draw from everywhere. Only the state
  you have chosen takes an ink line; thirty-six outlines at once turn the map into a net.
  It prints itself in the first time you reach it, nearest Astoria first.
- *Surprise me*: rolls the map to a state we have written up, at random. The die on the
  phone pill does the same.
- *The pill*: on a phone, scroll past the map and it hands over to a small dark pill
  carrying a map pin. Tap it and it grows back into the map.
- *The countdown*: a desk calendar page for the anniversary, with the days left on a gold
  sticker. Click the sticker for confetti.
- *The speech rail*: the five lines at the foot of the home page scroll themselves and
  stop the moment a pointer, a thumb or the keyboard reaches them, then start again a
  couple of seconds after it leaves.
- *On `home-archive.html`*: the devices the old home page had, all still working. Three
  photographs of the two of you that deal again when you click an empty spot in that
  section, and the memory machine, which pulls a random trip in a random card style.
- *Dawn / dusk*: the toggle in the nav.

**The wedding film** on `day.html` is a poster facade: the page loads only the still
from `img.youtube.com`, and YouTube itself loads nothing until someone presses play. To
change the film, edit `data-video` on the `.tube` element (and the thumbnail `src`
beside it) in `day.html`. Use `sddefault.jpg`; `maxresdefault.jpg` does not exist for
every upload, and the script quietly upgrades to it when it does.

**Link previews**: every page carries Open Graph and Twitter tags in its `<head>`, so a
link pasted into a message shows the logo card, the page's own title and its description.
The card is `assets/art/social-card.jpg`, 1200 × 630, the Bear & Tiger artwork on its
rose mat. Without those tags a scraper picks whichever picture it meets first, which was
the line drawing of David. The absolute URLs in them point at
`https://ymurn.github.io/themurnans/`, so change them if the site moves.

**Color and contrast**: every text and background pair on all four pages was measured
against WCAG AA in both themes and passes. Components sitting on a fixed brand color
(the blue ticker, the gold sticker, the wine button, the chapter hover) carry fixed text
colors rather than theme tokens, which is what keeps them readable when the theme flips.

**On a phone** (620px and narrower) the long pages are shortened in three ways: the nine
tables, the four doors and the year cards on `home-archive.html`, and any photo strip of
four or more become rows you swipe through; a trip or honeymoon day with more than one long
paragraph shows the first and a **Keep reading** button; and a round button to jump
back to the top rolls in once a long page has been scrolled a way. Nothing is cut:
wider screens show everything as before.

**A phone on its side** is wide but very short, so it takes the two-column layouts
without taking the desktop's furniture. A month puts its photographs beside its writing,
a memory is a picture beside its words, the chapter dates go back beside the chapters,
and the sections take their breathing room from the height of the screen rather than its
width. Two measurements decide it, `(min-width: 700px)` and `(max-height: 520px)` in
landscape, written the same way in `assets/css/site.css` and `assets/css/year.css`. An
older phone narrower than 700px keeps the tall layout, where there is no room for two
columns anyway.

**The map stays the band under the bar on every phone and tablet**, sideways included:
the floating window is a wide-screen thing and starts at 1180px, nowhere else. What
landscape changes is only how much room the band takes, since 30% of a 390px screen is a
map two centimetres tall: `--band-h` in `assets/css/map.css` is 30svh normally and 46svh
on a phone held sideways. The band appears once the page has been scrolled to the second
bar, and nothing else: the trigger is the bar's own position, so until the bar is stuck
to the top nothing has reached the band's place and the map stays tucked away.

Three more things change shape on the way down. **A pair of buttons** sits in a row while
the row has space for the pair and stacks when it hasn't, both set to one width and
centered. Whether it fits depends on what the buttons say, not on the width of the screen,
so `initButtonRows()` in `assets/js/site.js` measures each row and hangs `.is-stacked` on
it; the only CSS breakpoint left is a 520px floor for when the script hasn't run. Each of
the five speeches on **Our Big Day** puts the
speaker above their own words below 620px, with the bubble pointing up at the face:
beside a portrait, a column that narrow leaves a speech reading four words to the line.
And **the pile** on that page stays two photographs to a row down to the smallest phone,
leans and all, because one long column of big photographs stops reading as a pile.

**The nav** is a row of four labels while the row fits on one line; below 1020px the
hamburger takes over instead, because a label on two lines sets the whole bar crooked.
The four are short on purpose, so the row holds together further down than the five long
ones it replaced did. That is the nav's
own breakpoint and nothing else uses it: the layouts further down keep their 860px. The
menu it opens is sized by the height of the screen on a phone held sideways, where five
links at the tall layout's size come to 495px on a 390px screen.

**Dawn and dusk** switch in one go: the new theme opens out in a circle from the toggle
(in browsers with View Transitions) with every color changing in the same frame. Each
page reads the saved theme in its `<head>`, so a page opened in dusk never flashes cream.

**Scrolling**: a phone fires scroll events faster than the screen refreshes, and every
pass that follows the scroll (the reveals, the chapter being read, the map, the progress
bar) reads where things are on the page. A read that comes after a class has been written
makes the browser lay the whole page out again there and then, so those passes together
were forcing well over a hundred layouts per event, which is enough to get a long page
killed on a phone. Each pass now runs at most once a frame, through the `perFrame`
helper in `assets/js/site.js` and `assets/js/year.js`, and reads everything it needs
before it writes anything. Keep any new scroll work to that shape.

**Motion**: everything reveals on scroll and everything respects
`prefers-reduced-motion`. With that switched on the site renders immediately, fully
visible, with no animation and no confetti.

---

## Credits

- Illustrations: [@bymarquisfortune](https://www.instagram.com/bymarquisfortune)
- Wedding photography: [@jingyao_huang](https://www.instagram.com/jingyao_huang/)
- Words and photographs: the Murnans, [@themurnans](https://www.instagram.com/themurnans/)

---

## Putting it online

It's a static site, so anything that serves files will host it: Netlify or Cloudflare
Pages (drag the folder onto their dashboard), GitHub Pages, or any web host. Nothing to
configure and nothing to build.
