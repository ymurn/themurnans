/* David's 40th, April 2025: thirteen days round the desert southwest, from
   Las Vegas to Death Valley, the Grand Canyon and all five of Utah's
   national parks, and back to Las Vegas.

   Whose words are whose. Every "text" is David's post from the trip, word
   for word and only cut down: whole sentences dropped, none reworded, his
   typos left as he typed them. "lead" and "line" are ours, and so are the
   photo captions. The note under the facts says so on the page.

   The page is highlights.html: the nav's Highlights link opens straight into
   this trip, and the other highlights are reached from the bar at the top of
   it. The template that draws it is assets/js/trip.js. "route" is the loop in
   the order we drove it, each stop a point on the map in assets/js/atlas.js
   and the state it sits in, taken from the GPS in the photographs
   (assets/js/years/places.js). A stop's "leg" is the first and last point of
   the drive to it. */
window.MW_TRIP = {
 "key": "davids-40th",
 "kicker": "April 16 to 28, 2025",
 "title": "David's 40th",
 "barLabel": "Stop",
 "galleryNote": "Four from the two weeks",
 "note": "Every stop below is David's post from the trip, cut down. The photo captions are ours.",

 "facts": [
  { "k": "Days on the road", "v": "13", "s": "Las Vegas on April 16, Las Vegas again on April 28." },
  { "k": "National parks", "v": "7", "s": "Death Valley, the Grand Canyon, and all five of Utah's." },
  { "k": "The birthday", "v": "40", "s": "David turned 40 at the Grand Canyon, which had snow on it." },
  { "k": "States", "v": "4", "s": "California, Nevada, Arizona and Utah, in one loop." }
 ],

 "siblings": {
  "label": "Highlights",
  "items": [
   { "label": "David's 40th", "href": "highlights.html", "here": true },
   { "label": "Yinja's 30th", "href": "highlights-yinjas-30th.html" },
   { "label": "Yinja's citizenship", "href": "highlights-citizenship.html" }
  ]
 },

 "map": {
  "view": [ 96, 252, 205, 150 ],
  "width": "clamp(300px, 30vw, 430px)",
  "aria": "The loop from Las Vegas through Death Valley, the Grand Canyon and Utah's five national parks",
  "whole": "Whole loop",
  "sheet": { "k": "April 16 to 28, 2025", "title": "The desert loop" }
 },

 "route": [
  { "n": "Las Vegas", "at": [ 156.3, 343.6 ], "st": "NV" },
  { "n": "Death Valley", "at": [ 127.9, 330.3 ], "st": "CA" },
  { "n": "Las Vegas", "at": [ 156.3, 343.6 ], "st": "NV" },
  { "n": "Grand Canyon", "at": [ 211.5, 355.3 ], "st": "AZ" },
  { "n": "Canyonlands", "at": [ 260.9, 309.8 ], "st": "UT" },
  { "n": "The Needles", "at": [ 262.1, 313.2 ], "st": "UT" },
  { "n": "Arches", "at": [ 267.7, 300.8 ], "st": "UT" },
  { "n": "Capitol Reef", "at": [ 236.4, 306.5 ], "st": "UT" },
  { "n": "Bryce Canyon", "at": [ 217.2, 319.3 ], "st": "UT" },
  { "n": "Zion", "at": [ 201.8, 324 ], "st": "UT" },
  { "n": "Valley of Fire", "at": [ 169.7, 338.7 ], "st": "NV" },
  { "n": "Red Rock Canyon", "at": [ 151.7, 341.5 ], "st": "NV" },
  { "n": "Las Vegas", "at": [ 156.3, 343.6 ], "st": "NV" }
 ],

 "stops": [
  {
   "k": "Stop 1",
   "chip": "Vegas",
   "sub": "April 16",
   "title": "Coming to Vegas",
   "where": "Nevada",
   "leg": [ 0, 0 ],
   "text": [
    "There is nothing quite like having to Uber to Jamaica to take the airtrain to JFK, but in NYC, if going farther west than Denver the only option to get there is JFK. So, we got to JFK and enjoyed quite a few free Nathan’s hot dogs and a few cocktails before getting on our standard flight to Vegas.",
    "That flight was rather uneventful, but wow, the airport in Vegas is truly something else. Vegas really wants tourists to know why they are here and it clearly was to gamble, with so many slot machines in the terminal itself. After walking through the casino terminal we got our rental car, went to the hotel, and slept the night in Vegas before traveling to our first major destination, but that is for the next post."
   ],
   "photos": [
    { "src": "continued_trips/2025-04-vegas/2025-04-vegas-01.jpg", "cap": "Before the flight out" },
    { "src": "continued_trips/2025-04-vegas/2025-04-vegas-02.jpg", "cap": "On the plane west" },
    { "src": "continued_trips/2025-04-vegas/2025-04-vegas-03.jpg", "cap": "Landed in Las Vegas" }
   ]
  },
  {
   "k": "Stop 2",
   "chip": "Death Valley",
   "sub": "April 17",
   "title": "Zabriskie Point, Mosaic Canyon and Badwater",
   "where": "Death Valley, California",
   "leg": [ 0, 1 ],
   "text": [
    "Death Valley is a hot place. In fact, Furnace Creek within Death Valley had the hottest temperature ever recorded in human history. So, why not visit Death Valley? Sure, the week prior to coming the temperatures were in the mid-90s, but by presumably divine intervention we arrived in Death Valley to high temperatures in the low-70s.",
    "When coming from Vegas, the first place we stopped at was Zabriskie Point. It is an awesome overlook of the badlands within the park. We then saw some sand dunes before continuing to Mosaic Canyon. Mosaic Canyon is a cool trail in a Canyon where we definitely followed some people up a section that was not the trail and were suddenly in the narrowest, steepest section of trail we have ever been on. David did not enjoy that part at all and we thankfully got back on the trail and completed it.",
    "We then drove south to Badwater to walk along the salt flats. Afterwards, we quickly visited the Devil’s Golf Course (which is very much not a golf course) before checking in at the park resort in Furnace Creek and getting a glorious steak dinner."
   ],
   "photos": [
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-01.jpg", "cap": "The sign at the park boundary" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-03.jpg", "cap": "Zabriskie Point" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-04.jpg", "cap": "A dead tree on the valley floor" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-08.jpg", "cap": "Out on the salt at Badwater" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-09.jpg", "cap": "Dinner at Furnace Creek" }
   ]
  },
  {
   "k": "Stop 3",
   "chip": "Golden Canyon",
   "sub": "April 18",
   "title": "Goucher Gulch, Golden Canyon & Badlands",
   "where": "Death Valley, California",
   "leg": [ 1, 2 ],
   "text": [
    "Our next locale had a really cold forecast and Death Valley had another day in the low 70s, so we decided to spend another day at Death Valley. We got up early to get to the Golden Canyon trailhead by 7AM and it turned out we were the first ones there.",
    "We started to hike the Golden Canyon loop, but David forgot to post the park pass in the car so he ran back and then we continued to Goucher Gulch. The Gulch is a dry creek bed with some really fun rock scrambles. It also was majestic in the sunrise. After Goucher Gulch we continued onto the Badlands Loop. The loop trekked through awesome badlands hills that rose and fell in a patchwork throughout the land. Then we got to Golden Canyon and finished hiking the loop! Golden Canyon is quite accessible unless you hike to Red Cathedral like we did.",
    "We stopped for In N Out in Vegas before stopping at the Lake Mead overlook into Arizona. After much more driving we rose in elevation and started to see snow as we approached our next location, but more on that in the next post."
   ],
   "photos": [
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-10.jpg", "cap": "First ones up the wash" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-12.jpg", "cap": "In the gulch" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-13.jpg", "cap": "Rock scrambles most of the way" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-15.jpg", "cap": "Out on the Badlands Loop" },
    { "src": "continued_trips/2025-04-death-valley/2025-04-death-valley-18.jpg", "cap": "The badlands from the trail" }
   ]
  },
  {
   "k": "Stop 4",
   "chip": "Grand Canyon",
   "sub": "April 18 to 20",
   "title": "The Grand Canyon",
   "where": "Arizona · the birthday",
   "leg": [ 2, 3 ],
   "text": [
    "When you think about the Grand Canyon, you expect to hear about hot temperatures and desert views, right? Well, in April, it turns out that the Grand Canyon can be quite snowy, as when we arrived at El Tovar hotel on the rim we entered a snowy wonderland.",
    "After checking into the hotel and having a drink in the lounge we went to bed and got up early for a bus tour! It turned out that a snowy canyon makes for a rather empty tour bus, as it was us, four other people, and the bus driver! The driver was entertaining as we stopped at various scenic viewpoints for nice snowy views of the canyon!",
    "After the tour, we returned to a slightly warmer Grand Canyon Village and we decided to hike into the Canyon via the Bright Angel trail. If you look up this trail, you may find out it is rather long and descends 5000 feet down into the canyon. Well, we only hiked 1700 feet down past the second rest area as we needed to be back for a dinner reservation. If you decide to visit the Grand Canyon, we definitely recommend hiking even just a little bit down the canyon to get a totally different experience than a rim view!",
    "After hiking back up, we returned to the hotel and got ready for our dinner reservation at the El Tovar Steakhouse. There, we enjoyed a nice steak dinner and a nice free dessert as we were here for David’s 40th birthday! That’s right, David turned 40 at the Grand Canyon! What a treat!"
   ],
   "photos": [
    { "src": "continued_trips/2025-04-grand-canyon/2025-04-grand-canyon-01.jpg", "cap": "On the rim in the snow" },
    { "src": "continued_trips/2025-04-grand-canyon/2025-04-grand-canyon-06.jpg", "cap": "Snow and cloud over the canyon" },
    { "src": "continued_trips/2025-04-grand-canyon/2025-04-grand-canyon-03.jpg", "cap": "Dinner at the El Tovar Steakhouse" },
    { "src": "continued_trips/2025-04-grand-canyon/2025-04-grand-canyon-05.jpg", "cap": "Last light on the rim" },
    { "src": "continued_trips/2025-04-grand-canyon/2025-04-grand-canyon-07.jpg", "cap": "The canyon at dusk" }
   ]
  },
  {
   "k": "Stop 5",
   "chip": "Island in the Sky",
   "sub": "April 20 to 22",
   "title": "Canyonlands, Island in the Sky",
   "where": "Utah",
   "leg": [ 3, 4 ],
   "text": [
    "After a long drive through the desert, we arrived in Moab Utah and had lunch at Moab Brewery. Then, we drove up to Canyonlands National Park! We arrived at the Island in the Sky district and completed a bunch of fun small hikes. We hiked up a butte as much as we could, hiked the Upheaval Dome to the farthest point and back, and even visited Grand View point!",
    "At all these points, there were some very cool views looking into the Canyon, but the most interesting thing about the Island in the Sky is that it is the top level of a multilevel canyon! The canyon itself is huge, and when up there you can see forever! It’s a cool area and worth a visit!"
   ],
   "photos": [
    { "src": "continued_trips/2025-04-canyonlands/2025-04-canyonlands-01.jpg", "cap": "Under Mesa Arch" },
    { "src": "continued_trips/2025-04-canyonlands/2025-04-canyonlands-02.jpg", "cap": "On the rim of the mesa" },
    { "src": "continued_trips/2025-04-canyonlands/2025-04-canyonlands-03.jpg", "cap": "The canyons from the top" },
    { "src": "continued_trips/2025-04-canyonlands/2025-04-canyonlands-04.jpg", "cap": "Looking a long way down" }
   ]
  },
  {
   "k": "Stop 6",
   "chip": "The Needles",
   "sub": "April 20 to 22",
   "title": "Canyonlands, the Needles",
   "where": "Utah",
   "leg": [ 4, 5 ],
   "text": [
    "Canyonlands National Park is huge, and one is able to drive to two of the park’s three districts! So after visiting the Island in the Sky, we decided to visit the Needles District! There, we learned that the Needles District is substantially less developed than the Island in the Sky.",
    "We visited the visitor center and drove to the Elephant Hill Trailhead. We proceeded to hike for 13 miles. Many of the views were awesome! Needles are the spires into the sky and they were quite nice! We hiked through the Devil’s Kitchen and after a while along a 4x4 road we made it to the Notch Trail. Along that trail, we hiked through an extremely narrow slot canyon (presumably the Notch) before continuing back to our car."
   ],
   "photos": [
    { "src": "continued_trips/2025-04-canyonlands/2025-04-canyonlands-05.jpg", "cap": "Up to a small arch" },
    { "src": "continued_trips/2025-04-canyonlands/2025-04-canyonlands-06.jpg", "cap": "Out on the slickrock" },
    { "src": "continued_trips/2025-04-canyonlands/2025-04-canyonlands-07.jpg", "cap": "The spires the Needles is named for" }
   ]
  },
  {
   "k": "Stop 7",
   "chip": "Arches",
   "sub": "April 20 to 22",
   "title": "Arches, the scenic views",
   "where": "Utah",
   "leg": [ 5, 6 ],
   "text": [
    "Pretty views! Arches! We made it to Arches National Park and saw scenic view after scenic view! We even got out of the car to hike around at the Balanced Rock! Statics for a rigid body system for the win!",
    "Double Arch, Sand Dune Arch and Tapestry Arches did not disappoint. But it’s not just arches! There’s awesome views too! Panorama point was lovely, and the area around Courthouse Towers was a sight to see. We saw into the Fiery Furnace but sadly didn’t get a good permit to hike it. Next time, perhaps!"
   ],
   "photos": [
    { "src": "continued_trips/2025-04-arches/2025-04-arches-02.jpg", "cap": "Out from under the span" },
    { "src": "continued_trips/2025-04-arches/2025-04-arches-05.jpg", "cap": "Out of the car and onto the rock" },
    { "src": "continued_trips/2025-04-arches/2025-04-arches-06.jpg", "cap": "Between the fins" }
   ]
  },
  {
   "k": "Stop 8",
   "chip": "Arches hikes",
   "sub": "April 20 to 22",
   "title": "Arches, the hikes",
   "where": "Utah",
   "leg": [ 6, 6 ],
   "lead": "Two of them: the Devils Garden Loop, and the early start up to Delicate Arch.",
   "text": [
    "So, we didn’t just see pretty arches in Arches, we also hiked to quite a few and more! It’s challenging and a such a delight with amazing views and a several arches, including the Landscape and Double O Arches! David even managed to hike along a slightly precarious walkway (in his mind).",
    "It is truly an amazing arch and absolutely worth the hike to get up close with the arch! We hiked to so many other arches such as the Window Arch as well and so many nice views. Everything was amazing and Arches truly is a gem. It’s absolutely worth a visit!"
   ],
   "photos": [
    { "src": "continued_trips/2025-04-arches/2025-04-arches-01.jpg", "cap": "Delicate Arch" },
    { "src": "continued_trips/2025-04-arches/2025-04-arches-03.jpg", "cap": "The trail under Landscape Arch" },
    { "src": "continued_trips/2025-04-arches/2025-04-arches-04.jpg", "cap": "Out along the trail" },
    { "src": "continued_trips/2025-04-arches/2025-04-arches-07.jpg", "cap": "Under one of the big ones" }
   ]
  },
  {
   "k": "Stop 9",
   "chip": "Capitol Reef",
   "sub": "April 23 and 24",
   "title": "Capitol Reef",
   "where": "Utah",
   "leg": [ 6, 7 ],
   "text": [
    "Capitol Reef National Park is interesting. When one approaches the park from the east they drive through a rather scenic canyon. Then suddenly they are at the scenic park road and in the historic community of Fruita! Fruita has… orchards and awesome pies!",
    "We saw the Hickman Natural Bridge, hiked to the Rim Overlook, and traversed Cohab Canyon! We drove along a scenic road to see the Grand Wash and even saw an abandoned uranium mine! After visiting the park we had great Mexican and settled at the Capitol Reef Resort!",
    "Capitol Reef is definitely a nice park worth a day trip! If doing the other Utah parks, definitely stop here before continuing to the next westerly park which we will talk about next."
   ],
   "photos": [
    { "src": "continued_trips/2025-04-capitol-reef/2025-04-capitol-reef-01.jpg", "cap": "At the park sign" },
    { "src": "continued_trips/2025-04-capitol-reef/2025-04-capitol-reef-03.jpg", "cap": "Out on the slickrock" },
    { "src": "continued_trips/2025-04-capitol-reef/2025-04-capitol-reef-06.jpg", "cap": "The cliffs above the road" },
    { "src": "continued_trips/2025-04-capitol-reef/2025-04-capitol-reef-05.jpg", "cap": "Banded white on red" },
    { "src": "continued_trips/2025-04-capitol-reef/2025-04-capitol-reef-07.jpg", "cap": "A white cap on red rock" }
   ]
  },
  {
   "k": "Stop 10",
   "chip": "Route 12",
   "sub": "April 24",
   "title": "To Bryce Canyon",
   "where": "Utah",
   "leg": [ 7, 8 ],
   "text": [
    "So, while we were adventuring in Utah we noticed one of the tires was deflating slowly. We even added air in Moab! But it was the morning after Capitol Reef that we decided to visit a mechanic to check for and patch the leak. Thankfully they were able to patch it and we were on our way!",
    "Utah Route 12 is quite the drive, it rises into the mountains and meanders west through and down the Grand Staircase into Escalante! There were so many amazing views on this drive and had we had more time would have stopped at a trailhead to go hiking within Grand Staircase - Escalante National Monument. Descending the “staircase” was truly magical, and once in Escalante we stopped for some amazing burgers at Nemo’s before continuing to our next National Park, but as always that’s another post."
   ],
   "photos": []
  },
  {
   "k": "Stop 11",
   "chip": "Bryce Canyon",
   "sub": "April 24 and 25",
   "title": "Bryce Canyon",
   "where": "Utah",
   "leg": [ 8, 8 ],
   "text": [
    "Bryce Canyon is a sight to behold. When you arrive, you are on top of the ridge and there are sights after sights. You see the hoodoos from the viewpoints, but the best views are seen from the trails.",
    "While in the park, we did get very close to some hoodoos and nice views on the Queens Garden and Peekaboo Loop trails. Between the two, Queens Garden was the trail to see. There were so many sights to see, including countless Hoodoos such as Queen Victoria! Sure, the hikes require going down the canyon, but it is absolutely worth it!"
   ],
   "photos": [
    { "src": "continued_trips/2025-04-bryce-canyon/2025-04-bryce-canyon-01.jpg", "cap": "At the park sign" },
    { "src": "continued_trips/2025-04-bryce-canyon/2025-04-bryce-canyon-02.jpg", "cap": "On the rim" },
    { "src": "continued_trips/2025-04-bryce-canyon/2025-04-bryce-canyon-05.jpg", "cap": "Through the tunnel on the trail" },
    { "src": "continued_trips/2025-04-bryce-canyon/2025-04-bryce-canyon-07.jpg", "cap": "Thor's Hammer" },
    { "src": "continued_trips/2025-04-bryce-canyon/2025-04-bryce-canyon-06.jpg", "cap": "The amphitheatre from above" }
   ]
  },
  {
   "k": "Stop 12",
   "chip": "Zion",
   "sub": "April 25 to 27",
   "title": "Zion, the hikes",
   "where": "Utah",
   "leg": [ 8, 9 ],
   "text": [
    "We took in the sights along Route 12 before making it to our cabin in near the Lodge. When checking in we discussed hiking with the front desk lady and she recommended one specific hike that we had to do! Well, let us talk about the other hikes we did!",
    "We hiked to some pretty waterfalls and emerald pools and a very long hike along the West Rim trail! Along that trail were some amazing views on top of the rim and we also got to see others hike the Angel’s landing trail! You may ask did we hike that trail? No, no we did not. That one has some narrow pathways requiring connections to a chain that just didn't seem like something we wanted to do. No matter, the views from the West Rim Trail were truly spectacular!",
    "We also were lucky enough to get a parking spot at the Canyon Overlook Trail and we hiked the trail to an amazing view of Zion Canyon! So, you may be wondering which trail the front desk lady said we had to do. Well, let's just say we needed to rent some gear for this amazing hike that we will discuss in the next post!"
   ],
   "photos": [
    { "src": "continued_trips/2025-04-zion/2025-04-zion-15.jpg", "cap": "Above the canyon" },
    { "src": "continued_trips/2025-04-zion/2025-04-zion-16.jpg", "cap": "On the red rock" },
    { "src": "continued_trips/2025-04-zion/2025-04-zion-01.jpg", "cap": "Dinner after a long day" }
   ]
  },
  {
   "k": "Stop 13",
   "chip": "The Narrows",
   "sub": "April 25 to 27",
   "title": "Zion, the Narrows",
   "where": "Utah · the best hike of the trip",
   "leg": [ 9, 9 ],
   "quote": { "text": "You have to hike the Narrows", "who": "Front Desk Lady" },
   "text": [
    "Well, we booked our gear rentals and early the next day we got an awesome Mexican breakfast in Springdale (right outside the park) then got our gear consisting of aqua boots, aqua socks, a wader, and a wood stick! We put them on and made our way to the Temple of Sinawawa and began hiking the Riverside Trail to the end. Once at the end we made it to the start of the Narrows Trail!",
    "The Narrows Trail is entirely within the Zion Narrows in the Virgin River hence the gear! The River was a tad cool even with the gear but when hiking the river we got used to it rather quickly! The River depth varied but was never deeper than below our chests. The current was very present but not too challenging to hike against, and the views were spectacular! The gorge is so tall and the Narrows truly lived up to it's name!",
    "This was truly an amazing hike and our favorite on the entire trip! If you ever visit Zion, don't miss the Narrows. It's quite the experience."
   ],
   "photos": [
    { "src": "continued_trips/2025-04-zion/2025-04-zion-02.jpg", "cap": "Waders, boots and a stick" },
    { "src": "continued_trips/2025-04-zion/2025-04-zion-09.jpg", "cap": "Wading up the river" },
    { "src": "continued_trips/2025-04-zion/2025-04-zion-14.jpg", "cap": "How tall the gorge gets" },
    { "src": "continued_trips/2025-04-zion/2025-04-zion-11.jpg", "cap": "Under the hanging garden" },
    { "src": "continued_trips/2025-04-zion/2025-04-zion-04.jpg", "cap": "Deep in the Narrows" }
   ]
  },
  {
   "k": "Stop 14",
   "chip": "Red Rock",
   "sub": "April 27 and 28",
   "title": "Valley of Fire & Red Rock Canyon",
   "where": "Nevada",
   "leg": [ 9, 12 ],
   "text": [
    "After such a great time in Utah, we began the trek back to Vegas. We stopped in Valley of Fire State Park and saw some good geologic features! But the neater experience happened on our last day where we visited the Red Rock Canyon National Conservation Area.",
    "We hiked to the Calico Tanks and saw some cool rock formations. We then drove to the Ice Box Canyon and hiked as much of it as we could until we needed to head to the Airport. The views in the Canyon were nice, but we never made it to where there was running water like others along the trail suggested there would be. Either way, these two parks were fun to visit and much more exciting than spending time in Vegas. Red Rock Canyon was a lovely way to close out the trip and we enjoyed visiting!"
   ],
   "photos": [
    { "src": "continued_trips/2025-04-valley-of-fire-red-rock/2025-04-valley-of-fire-red-rock-01.jpg", "cap": "Red rock at Valley of Fire" },
    { "src": "continued_trips/2025-04-valley-of-fire-red-rock/2025-04-valley-of-fire-red-rock-02.jpg", "cap": "Late light on the sandstone" },
    { "src": "continued_trips/2025-04-valley-of-fire-red-rock/2025-04-valley-of-fire-red-rock-04.jpg", "cap": "Red rock under a white cap" },
    { "src": "continued_trips/2025-04-valley-of-fire-red-rock/2025-04-valley-of-fire-red-rock-07.jpg", "cap": "The Red Rock escarpment" },
    { "src": "continued_trips/2025-04-vegas/2025-04-vegas-05.jpg", "cap": "The Strip, the night before the flight home" }
   ]
  }
 ],

 "closing": {
  "k": "The other highlights",
  "title": "One more to come.",
  "text": "Yinja's 30th is up too: eleven days round California in June 2026. He becomes a citizen in the same year, and that one gets a page like this once it has happened.",
  "btns": [
   { "href": "highlights-yinjas-30th.html", "label": "Yinja's 30th" },
   { "href": "highlights-citizenship.html", "label": "Yinja's citizenship", "ghost": true }
  ]
 }
};
