/* Yinja's 30th, June 2026: eleven days round California out of Fresno, for
   Kings Canyon, Sequoia and Yosemite, then Sonoma, Lake Tahoe and Napa.

   Whose words are whose. Every "text" is David's post from the trip, word
   for word and only cut down: whole sentences dropped, none reworded, his
   typos left as he typed them. "lead" and "line" are ours, and so are the
   photo captions. The note under the facts says so on the page.

   The page is highlights-yinjas-30th.html, reached from the bar at the top
   of the highlights. The template that draws it is assets/js/trip.js.
   "route" is the loop in the order they drove it, each stop a point on the
   map in assets/js/atlas.js and the state it sits in, projected from the
   GPS in the photographs the same way assets/js/years/places.js is. A
   stop's "leg" is the first and last point of the drive to it. A photograph
   marked "us": true has the two of them in it together, which is what the
   four at the top of the page are picked from first (assets/js/trip.js). */
window.MW_TRIP = {
 "key": "yinjas-30th",
 "kicker": "June 4 to 15, 2026",
 "title": "Yinja's 30th",
 "barLabel": "Stop",
 "galleryNote": "Six from the eleven days",

 "facts": [
  { "k": "Days on the road", "v": "11", "s": "Fresno on June 4, Fresno again on June 14." },
  { "k": "National parks", "v": "3", "s": "Kings Canyon, Sequoia and Yosemite, in the first five days." },
  { "k": "The birthday", "v": "30", "s": "Yinja turned 30 on June 10, in the redwoods at Muir Woods." },
  { "k": "States", "v": "2", "s": "California, with a run east into Nevada for cheap gas." }
 ],

 "siblings": {
  "label": "Highlights",
  "items": [
   { "label": "David's 40th", "href": "highlights.html" },
   { "label": "Yinja's 30th", "href": "highlights-yinjas-30th.html", "here": true },
   { "label": "Yinja's citizenship", "href": "highlights-citizenship.html" }
  ]
 },

 "map": {
  "view": [ 6, 224, 122, 118 ],
  "width": "clamp(300px, 30vw, 430px)",
  "aria": "The loop out of Fresno through Kings Canyon, Sequoia, Yosemite, Sonoma, Lake Tahoe and Napa",
  "whole": "Whole loop",
  "sheet": { "k": "June 4 to 15, 2026", "title": "The California loop" }
 },

 "route": [
  { "n": "Fresno", "at": [ 75.9, 310.1 ], "st": "CA" },
  { "n": "Kings Canyon", "at": [ 98.4, 314.1 ], "st": "CA" },
  { "n": "Sequoia", "at": [ 93.5, 318.3 ], "st": "CA" },
  { "n": "Yosemite", "at": [ 85.2, 288.6 ], "st": "CA" },
  { "n": "Mono Lake", "at": [ 96.9, 284.9 ], "st": "CA" },
  { "n": "Santa Rosa", "at": [ 32.1, 255.6 ], "st": "CA" },
  { "n": "Muir Woods", "at": [ 33.6, 270.5 ], "st": "CA" },
  { "n": "Lake Tahoe", "at": [ 85.5, 253 ], "st": "CA" },
  { "n": "Reno", "at": [ 91.7, 246.5 ], "st": "NV" },
  { "n": "Napa", "at": [ 39.3, 257.3 ], "st": "CA" },
  { "n": "Fresno", "at": [ 75.9, 310.1 ], "st": "CA" }
 ],

 "stops": [
  {
   "k": "Stop 1",
   "chip": "Kings Canyon",
   "sub": "June 5",
   "title": "Kings Canyon",
   "where": "California",
   "leg": [ 0, 1 ],
   "text": [
    "For Yinja’s 30th birthday,  we flew to Fresno (by way of SLC to do a California Adventure! After a night in town, we drove to our first stop: Kings Canyon National Park!",
    "The drive through the canyon was truly majestic and we first stopped to see Grizzly Falls before continuing to the end of Highway 180. Once we parked, we hiked along the Kings River to Mist Falls! This waterfall was so impressive with a huge flow and a ton of mist!",
    "After getting a bunch of photos, we hiked back to our car, drove to see Roaring River Falls, and drove to Grant Grove to see the first Sequoias of the trip, including the famous General Grant tree!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-kings-canyon/2026-06-kings-canyon-01.jpg", "cap": "Grizzly Falls, the first stop" },
    { "src": "continued_trips/2026-06-kings-canyon/2026-06-kings-canyon-02.jpg", "cap": "Mist Falls, the top of the hike", "us": true },
    { "src": "continued_trips/2026-06-kings-canyon/2026-06-kings-canyon-03.jpg", "cap": "The canyon from the trail" },
    { "src": "continued_trips/2026-06-kings-canyon/2026-06-kings-canyon-04.jpg", "cap": "On the way back down", "us": true },
    { "src": "continued_trips/2026-06-kings-canyon/2026-06-kings-canyon-06.jpg", "cap": "Roaring River Falls" },
    { "src": "continued_trips/2026-06-kings-canyon/2026-06-kings-canyon-07.jpg", "cap": "The first sequoias of the trip, at Grant Grove" }
   ]
  },
  {
   "k": "Stop 2",
   "chip": "Moro Rock",
   "sub": "June 5",
   "title": "Sequoia, Moro Rock and Tunnel Log",
   "where": "California",
   "leg": [ 1, 2 ],
   "text": [
    "The next stop on our trip was Sequoia National Park! We immediately went to look at some sequoias on a less traveled path, and then headed up the mountain to Moro Rock where Yinja made it to the top (too treacherous at the top for David). We also got to drive through Tunnel Log before heading back to the Lodge to check in and have dinner!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-01.jpg", "cap": "The first sequoias off the main path" },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-02.jpg", "cap": "Small at the foot of one" },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-03.jpg", "cap": "Driving through Tunnel Log" },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-04.jpg", "cap": "The stairway up Moro Rock" }
   ]
  },
  {
   "k": "Stop 3",
   "chip": "General Sherman",
   "sub": "June 6",
   "title": "General Sherman, and Tokopah Falls",
   "where": "California",
   "leg": [ 2, 2 ],
   "text": [
    "Early the next morning, we got up and were one of the first people at the General Sherman Lot! We walked around the grove taking in all the Sequoias and eventually seeing General Sherman! Afterwards, we headed to Lodgepole to hike a trail to Tokopah Falls, which was lovely, hiked back, and then began our drive to the next locale, which we will discuss in our next post!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-05.jpg", "cap": "First ones at General Sherman" },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-07.jpg", "cap": "Between two trunks" },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-08.jpg", "cap": "In a gap in the rock on the Tokopah trail" },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-09.jpg", "cap": "Under a boulder" },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-10.jpg", "cap": "At the cascades below the falls", "us": true },
    { "src": "continued_trips/2026-06-sequoia/2026-06-sequoia-11.jpg", "cap": "Tokopah Falls" }
   ]
  },
  {
   "k": "Stop 4",
   "chip": "Mist Trail",
   "sub": "June 6 and 7",
   "title": "Into the valley, and up the Mist Trail",
   "where": "Yosemite, California",
   "leg": [ 2, 3 ],
   "text": [
    "Yosemite has been Yinja’s number one bucket list National Park, and after Sequoia we made it to Wawona in Yosemite! After doing a mini adventure to find a Chinese Laundry, we continued to our relationship room in Yosemite West before descending down the valley to Bridal Veil Falls where we snagged a very hard to get parking spot and admired the falls from a mobbed viewpoint. Then we left the park to have amazing BBQ at Smokehouse 41 then a lovely beer at Shuteye Brewing before calling it a night.",
    "Very early the next morning we parked in Curry Village and hiked the Mist Trail first to a relatively not busy Vernal Falls and other than the view experienced quite the mist before continuing to the top of Nevada Falls! On the return hike it was quite busier, but at Vernal Falls we were treated to a double rainbow!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-01.jpg", "cap": "Bridal Veil Falls, from the mobbed viewpoint" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-02.jpg", "cap": "In the rocks on the Mist Trail" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-03.jpg", "cap": "Up the steps in the mist" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-04.jpg", "cap": "The double rainbow at Vernal Falls" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-05.jpg", "cap": "Both of them, and the rainbow", "us": true }
   ]
  },
  {
   "k": "Stop 5",
   "chip": "Sentinel Dome",
   "sub": "June 7",
   "title": "Sentinel Dome and Taft Point",
   "where": "Yosemite, California",
   "leg": [ 3, 3 ],
   "text": [
    "After the Mist Trail we headed to Glacier Point Rd and hiked to the top of Sentinel Dome followed by Taft Point! We apparently just missed seeing some bears on the hike to Taft Point but the views were great! Afterwards, we drove to Glacier Point, took in the views, bought sandwiches for the next day's hike and then headed to a lovely dinner at the Mountain Room."
   ],
   "photos": [
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-06.jpg", "cap": "A waterfall across the valley, from the top" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-07.jpg", "cap": "On top of Sentinel Dome", "us": true },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-08.jpg", "cap": "Half Dome behind them", "us": true },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-09.jpg", "cap": "Sitting out over the valley" }
   ]
  },
  {
   "k": "Stop 6",
   "chip": "North Dome",
   "sub": "June 8",
   "title": "North Dome, and the bears at Dog Lake",
   "where": "Tioga Road, Yosemite",
   "leg": [ 3, 3 ],
   "text": [
    "After a busy Saturday, we got up early Sunday to hike the North Dome! It was initially a somewhat meh hike until it absolutely wasn't, and at that point the views were amazing! North Dome had an excellent view of Half Dome, Clouds’ Rest, and the Yosemite Valley and it was an awesome hike! Afterwards, we visited the Toulumme Meadows visitor center then hooked around Lambert Dome to Dog Lake. At Dog Lake, we saw bears! After seeing the bears, we trekked back to the Mountain Room for dinner before heading to sleep."
   ],
   "photos": [
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-10.jpg", "cap": "Half Dome from North Dome" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-11.jpg", "cap": "On the dome" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-12.jpg", "cap": "Sitting at the edge" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-13.jpg", "cap": "Over the creek on a log" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-14.jpg", "cap": "Tenaya Lake, on the way to Tuolumne", "us": true },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-16.jpg", "cap": "A bear at Dog Lake" }
   ]
  },
  {
   "k": "Stop 7",
   "chip": "Cathedral Lakes",
   "sub": "June 9",
   "title": "Cathedral Lakes, and east to Mono Lake",
   "where": "Tioga Road, Yosemite",
   "leg": [ 3, 4 ],
   "text": [
    "On the next day, we returned to Tioga Road to hike to the Cathedral Lakes! There were some nice mountain views and while the Upper Cathedral Lake was lovely, it was also mosquito-tastic! Similarly, the Lower Cathedral Lake was mosquito-tastic, but not as lovely as the Upper Lake.",
    "After hiking down, we decided to travel east into the desert, taking in some nice views of Mono Lake and various other desert features and getting cheap gas in Nevada before we drove four hours west to our next location that we will discuss in our next post."
   ],
   "photos": [
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-19.jpg", "cap": "Granite on the way up to the lakes" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-17.jpg", "cap": "Upper Cathedral Lake" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-20.jpg", "cap": "Snow still on the water at the top of Tioga Pass" },
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-18.jpg", "cap": "Mono Lake, out in the desert" }
   ]
  },
  {
   "k": "Stop 8",
   "chip": "Muir Woods",
   "sub": "June 9 and 10",
   "title": "Santa Rosa, and Muir Woods on the birthday",
   "where": "Sonoma · the birthday",
   "leg": [ 4, 6 ],
   "text": [
    "What does one do first when arriving in Santa Rosa? Well, for us, it was to go to Russian River for dinner, and it was such a lovely dinner of pizza and beer. Russian River is legendary, and it truly did not disappoint. We then called it a night for the big day - Yinja’s 30th! Happy 30th to him!",
    "We got up early and drove to our reservation at Muir Woods! We did a rather beautiful and pensive hike through the Redwoods, then headed to the Russian River Valley to visit Russian River Vineyards for an awesome lunch consisting of Sonoman Wines and nice sandwiches."
   ],
   "photos": [
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-01.jpg", "cap": "Into the redwoods" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-02.jpg", "cap": "On the path through Muir Woods", "us": true },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-03.jpg", "cap": "At the foot of one" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-04.jpg", "cap": "Under a fallen redwood" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-05.jpg", "cap": "Small among the trunks" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-06.jpg", "cap": "The path out" }
   ]
  },
  {
   "k": "Stop 9",
   "chip": "The wineries",
   "sub": "June 10",
   "title": "The coast road, and the wineries",
   "where": "Sonoma, California",
   "leg": [ 6, 6 ],
   "text": [
    "We then went to Gary Farrell Brewery where we enjoyed some more lovely wines. They even personalized the experience for Yinja! It was cute and the views were lovely! We then returned to Santa Rosa to have dinner at the Spinster Sisters which honestly was not as lovely as we thought it would be, but still it was not bad!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-07.jpg", "cap": "Above the coast on the road out" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-08.jpg", "cap": "The Pacific behind" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-09.jpg", "cap": "Looking down on the beach" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-10.jpg", "cap": "Lunch at Russian River Vineyards" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-11.jpg", "cap": "Wine at Gary Farrell", "us": true }
   ]
  },
  {
   "k": "Stop 10",
   "chip": "Donner Pass",
   "sub": "June 11",
   "title": "Donner Pass, Truckee and the north shore",
   "where": "Lake Tahoe, California",
   "leg": [ 6, 7 ],
   "text": [
    "Waking up early, we drove east and arrived at Donner Pass. After taking in the views of Donner Lake, we descended into Truckee and had a lovely lunch at FiftyFifty brewing! The food and drink was great, and after having lunch and walking around Truckee, we continued to North Lake Tahoe! We checked in at our lodging then headed to our first hike up to Picnic Rock! After enjoying the view, we hiked down then headed to Incline Village, Nevada for dinner at Alibi Ale Works!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-01.jpg", "cap": "Donner Lake from the pass" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-02.jpg", "cap": "At the lake that evening", "us": true }
   ]
  },
  {
   "k": "Stop 11",
   "chip": "Shirley Canyon",
   "sub": "June 12",
   "title": "Monkey Rock, Hidden Beach and Shirley Canyon",
   "where": "Lake Tahoe, California",
   "leg": [ 7, 7 ],
   "text": [
    "The following day, we parked in Incline Village and hiked to Monkey Rock then down to Hidden Beach. Both locales had great views, and after the hike we drove to Olympic Valley to hike Shirley Canyon! It was a popular hike along a creek, and after most everyone turned around we continued farther up the mountain, eventually even hiking through snow to reach the Palisades Tram Summit! After enjoying some amazing views of the valley, we traveled down the west side of the Lake to South Lake Tahoe where we visited South of North Brewing Company for a beer and snacks before having amazing beer and food at South Lake Brewing Company!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-03.jpg", "cap": "Above the water at Incline Village" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-04.jpg", "cap": "Hidden Beach" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-05.jpg", "cap": "Up Shirley Canyon" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-06.jpg", "cap": "Snow, in June" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-07.jpg", "cap": "Olympic Valley from near the top" }
   ]
  },
  {
   "k": "Stop 12",
   "chip": "Marlette Lake",
   "sub": "June 13",
   "title": "Marlette Lake, and the desert to Reno",
   "where": "Lake Tahoe, and Nevada",
   "leg": [ 7, 8 ],
   "text": [
    "The next morning, we drove to the Marlette Lake trailhead and hiked to the lake. We just missed seeing a bear, but this hike was not the best and didn’t exactly have the best views. Dejected, we drove to South Lakes Brewing Company again to have lunch before deciding to drive east into the desert!",
    "We headed through some nice desert canyons before ending up in Reno at Revision Brewing Company! There we had some awesome IPAs that were so good we bought a four-pack to bring back home and then returned to the Inn to freshen up before going to dinner at a highly rated but surprisingly mediocre restaurant that we aren’t going to name as it is not worth your time."
   ],
   "photos": [
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-08.jpg", "cap": "An old cabin on the Marlette trail" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-09.jpg", "cap": "Marlette Lake" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-10.jpg", "cap": "A wild horse, east of the lake" }
   ]
  },
  {
   "k": "Stop 13",
   "chip": "Mumm",
   "sub": "June 14",
   "title": "Mumm, and Oakville Grocery",
   "where": "Napa, California",
   "leg": [ 8, 9 ],
   "text": [
    "For our last day in California, we left Tahoe and went west. After a few hours of driving, we arrived at Mumm Vineyards for our first Napa wine tasting of bubbly wines. The wines were refreshing and bright, and the view of the valley was so picturesque! After the tasting, we stopped at Oakville Grocery for lunch sandwiches  and it was quite a hopping place."
   ],
   "photos": [
    { "src": "continued_trips/2026-06-napa/2026-06-napa-02.jpg", "cap": "The bubbly", "us": true },
    { "src": "continued_trips/2026-06-napa/2026-06-napa-03.jpg", "cap": "Lunch at Oakville Grocery" },
    { "src": "continued_trips/2026-06-napa/2026-06-napa-04.jpg", "cap": "Oakville Grocery, a hopping place" }
   ]
  },
  {
   "k": "Stop 14",
   "chip": "Pride",
   "sub": "June 14 and 15",
   "title": "Pride Mountain, and home",
   "where": "Napa, and the flight back",
   "leg": [ 9, 10 ],
   "text": [
    "From there, we travelled north to Pride Vineyards where we had a very nice tour of the winery. We got to visit the wine caves and also had some lovely wine pairings. Pride Vineyards was a great time, and after the visit we headed farther west to Santa Rosa one last time. We went to Russian River one last time then drove back to Fresno for our final night before heading home.",
    "California was such an awesome trip. Epic hikes, amazing views, great food, and awesome drinks. It was truly a lovely trip!"
   ],
   "photos": [
    { "src": "continued_trips/2026-06-napa/2026-06-napa-05.jpg", "cap": "The wine caves at Pride" },
    { "src": "continued_trips/2026-06-napa/2026-06-napa-06.jpg", "cap": "The gate at Pride Mountain Vineyards", "us": true },
    { "src": "continued_trips/2026-06-napa/2026-06-napa-07.jpg", "cap": "The Sierra from the plane, on the way home" }
   ]
  }
 ],

 /* The way on: the whole set of highlights, in the order they happened,
    with this one marked. The list and the section are shared by all three
    pages, in assets/js/highlights.js, so they cannot drift apart. */
 "closing": { "nav": "highlights" }
};
