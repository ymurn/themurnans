/* The year pages, one entry per year, in order.
   Each year's Christmas card is the picture people click to switch years.
   "card" is the file name in assets/art/cards/ without ".jpg"; every card
   needs two sizes, card-2026.jpg (1400 x 1000) and card-2026-sm.jpg (560 x 400).
   Leave "card" empty ("") until the card exists and a blank one stands in.
   "off" is the color printed a little off register behind the card.
   "hidden": true keeps a year that is still being written off every list of
   years on the site: the cards, the bar, the home page. Its own page still
   works at 2026.html for anyone given the address, and its trips are on the
   home page's map. Take the line out to put the year on show. */
window.MW_YEARS = [
 {
  "year": "2022",
  "title": "Just married",
  "card": "card-2022",
  "off": "gold",
  "alt": "Our 2022 card: the two of us with our eyes closed on a blue panel, and our hands with their wedding rings on a coral panel, among gold sparkles"
 },
 {
  "year": "2023",
  "title": "Somewhere new every month",
  "card": "card-2023",
  "off": "sage",
  "alt": "Our 2023 card: the two of us in Christmas sweaters, kneeling by the tree and raising our bear and tiger mugs"
 },
 {
  "year": "2024",
  "title": "We said we'd travel less",
  "card": "card-2024",
  "off": "rose",
  "alt": "Our 2024 card: the two of us in suits, holding hands in front of a Christmas tree on Wall Street while Santa's sleigh crosses the moon"
 },
 {
  "year": "2025",
  "title": "Forty at the Grand Canyon",
  "card": "card-2025",
  "off": "coral",
  "alt": "Our 2025 card: the two of us in matching pajamas by the fire, under framed pictures from the year's trips"
 },
 {
  "year": "2026",
  "title": "Thirty in the redwoods",
  "card": "",
  "off": "blue",
  "alt": "",
  "hidden": true
 }
];
