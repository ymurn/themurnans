/* Where each chapter of The Long Way Round happened, for the map on
   story.html. Keyed by the chapter's "place" in assets/js/data.js, exactly as
   it is written there, and projected to the same frame as assets/js/atlas.js:
   "n" is the name on the map, "at" the point on it, "st" the state or
   district it inks in. A new chapter needs its place adding here, or it
   simply has no stop on the map. Places in and around the city all share one
   New York stop: separate dots for Queens and Brooklyn land on top of each
   other and on the star that marks home. */
window.MW_STORY_PLACES = {
 "Syracuse, NY": [{"n":"Syracuse","at":[842.9,182.1],"st":"NY"}],
 "Cincinnati Night, NYC, NY": [{"n":"New York","at":[890.7,227.4],"st":"NY"}],
 "Boston, MA": [{"n":"Boston","at":[930.6,177.5],"st":"MA"}],
 "Remote Christmas and NYE in NYC": [{"n":"New York","at":[890.7,227.4],"st":"NY"}],
 "Beacon, NY": [{"n":"Beacon","at":[887.1,209.2],"st":"NY"}],
 "Huntington, NY": [{"n":"Huntington","at":[899.7,221.5],"st":"NY"}],
 "Cincinnati, Ohio": [{"n":"Cincinnati","at":[714.8,297.0],"st":"OH"}],
 "North and South Forks of Long Island, NY": [{"n":"Montauk","at":[923.6,211.4],"st":"NY"},{"n":"Greenport","at":[916.4,211.7],"st":"NY"}],
 "Hudson, NY": [{"n":"Hudson","at":[886.1,191.4],"st":"NY"}],
 "Portland, Maine": [{"n":"Portland","at":[935.7,144.7],"st":"ME"}],
 "Citi Field, Queens": [{"n":"New York","at":[890.7,227.4],"st":"NY"}],
 "Philadelphia, PA": [{"n":"Philadelphia","at":[874.9,249.3],"st":"PA"}],
 "Corning, the Thousand Islands, and around Syracuse, NY": [{"n":"Corning","at":[832.1,205.9],"st":"NY"},{"n":"Thousand Islands","at":[840.3,151.9],"st":"NY"},{"n":"Syracuse","at":[842.9,182.1],"st":"NY"}],
 "Tarrytown & Nyack, NY": [{"n":"Tarrytown","at":[891.3,218.5],"st":"NY"}],
 "Princeton, NJ": [{"n":"Princeton","at":[881.3,238.1],"st":"NJ"}],
 "Washington, DC": [{"n":"Washington","at":[847.4,280.2],"st":"DC"}],
 "Manhattan Beach & Los Angeles, CA": [{"n":"Los Angeles","at":[89.0,378.3],"st":"CA"}],
 "Dyker Heights, Brooklyn, NY": [{"n":"New York","at":[890.7,227.4],"st":"NY"}],
 "Baltimore, MD": [{"n":"Baltimore","at":[853.1,269.9],"st":"MD"}],
 "Tampa, FL": [{"n":"Tampa","at":[788.2,550.1],"st":"FL"}],
 "San Fransisco & Oakland, CA": [{"n":"San Francisco","at":[35.8,274.2],"st":"CA"}],
 "Beacon (yet again), NY": [{"n":"Beacon","at":[887.1,209.2],"st":"NY"}],
 "Vermont": [{"n":"Mount Hunger","at":[891.1,138.8],"st":"VT"}],
 "Happy Two Years!": [{"n":"New York","at":[890.7,227.4],"st":"NY"}],
 "Syracuse, NY?": [{"n":"Syracuse","at":[842.9,182.1],"st":"NY"},{"n":"Ithaca","at":[839.9,197.1],"st":"NY"},{"n":"Letchworth","at":[813.4,199.0],"st":"NY"}]
};
