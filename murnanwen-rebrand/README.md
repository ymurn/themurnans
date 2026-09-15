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

| File | What it is |
|---|---|
| `index.html` | Home, the hero, the live anniversary count, the years since the wedding, the four doors |
| `story.html`  | **The Long Way Round**: the chapter timeline, built from `assets/js/data.js` |
| `table.html`  | **At Our Table**: the two drinks, the nine restaurants, the wedding feast |
| `day.html`    | **Our Big Day**: the wedding, as one chapter of the story |
| `2022.html` to `2025.html` | **After the Wedding**: one page per year since the wedding, built from `assets/js/years/` |

---

## Adding a new chapter

The Long Way Round is volume one: the trips before the wedding. Everything on its
timeline comes from one file, **`assets/js/data.js`**. Trips after the wedding go on the
year pages instead, see **The year pages** below.

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

3. **Photo counts change the layout automatically:**
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
parks (38: 32 on the year pages through 2025, plus 6 in 2026 not posted yet; only the
63 designated national parks count) and states (30,
plus DC).

---

## The year pages

**After the Wedding** is volume two: one page per year, `2022.html` to `2025.html`, all
built by `assets/js/year.js` from two kinds of file:

- **`assets/js/years/index.js`**: every year in order, with its name and its Christmas
  card. The row of cards at the top of each page and the year buttons in the bar come
  from this list, so a year added here shows up on every year page.
- **`assets/js/years/2023.js`** (one per year): that year's months, trips, photographs and
  New Year's letter. Each month's text is David's own sentences from our posts, cut down to
  the highlights. Cut more if a month runs long, but keep every sentence as he wrote it.

2022 runs the honeymoon day by day, David's posts word for word, with a map beside it on
wide screens that inks in each day's drive as you scroll. October to December follow
month by month, the same as 2023 onward. A month with no trip shows greyed out in the bar.

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
   from this folder (the first line crops to 7 × 5 around the centre, so change its two
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
2. **Off-register colour**: a flat colour block sitting a few pixels out from behind
   each card, the way a screen-printed fill never quite lines up with its outline.
3. **Chunky curves and small tilts**: nothing is perfectly square or perfectly straight.

All of it is defined once at the top of `assets/css/site.css`: colours, `--keyline`, and
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
a UI colour. In dusk a faint ghost of the colour fill sits behind them so the black still
reads on the dark ground.

**Things to play with**
- *The curtain*: the intro on the home page, once per visit. Click or press any key to
  skip it, or add `?intro` to the address (`index.html?intro`) to see it again. The
  loading line under the names is a random draw from `CURTAIN_LINES`, at the top of
  the curtain section in `assets/js/site.js`.
- *The pour*: the hero slider clips the colour layer over the line art. It fills itself
  once when the page opens, then it's yours to drag. It throws confetti when it lands.
- *Poke the characters*: click either of you and you say something. Six lines each,
  in `LINES` at the top of the interaction section in `assets/js/site.js`.
- *The photographs beside Who*: three pictures of the two of you, dealt fresh on every
  load, with none repeated from the last visit. Click any empty spot in that section and
  they gather into a stack and get dealt again. With a mouse you can pick them up and move
  them about, and the last one picked up stays on top.
- *Pull a memory*: deals a random trip: a chapter from The Long Way Round, or a trip from
  any year page (loaded quietly once the home page has settled, from the same
  `assets/js/years/` files). A year page trip joins once its month has a photograph, so
  2022's autumn trips arrive when their photos do. The card shows the trip's first paragraph.
- *The countdown*: click the big number for confetti.
- *Dawn / dusk*: the toggle in the nav.

**The wedding film** on `day.html` is a poster facade: the page loads only the still
from `img.youtube.com`, and YouTube itself loads nothing until someone presses play. To
change the film, edit `data-video` on the `.tube` element (and the thumbnail `src`
beside it) in `day.html`. Use `sddefault.jpg`; `maxresdefault.jpg` does not exist for
every upload, and the script quietly upgrades to it when it does.

**Colour and contrast**: every text and background pair on all four pages was measured
against WCAG AA in both themes and passes. Components sitting on a fixed brand colour
(the blue ticker, the gold sticker, the wine button, the chapter hover) carry fixed text
colours rather than theme tokens, which is what keeps them readable when the theme flips.

**On a phone** (620px and narrower) the long pages are shortened in three ways: the
year cards on the home page, the four doors, the nine tables and any photo strip of four or more
become rows you swipe through; a trip or honeymoon day with more than one long
paragraph shows the first and a **Keep reading** button; and a round button to jump
back to the top rolls in once a long page has been scrolled a way. Nothing is cut:
wider screens show everything as before.

**Dawn and dusk** switch in one go: the new theme opens out in a circle from the toggle
(in browsers with View Transitions) with every colour changing in the same frame. Each
page reads the saved theme in its `<head>`, so a page opened in dusk never flashes cream.

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
