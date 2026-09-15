/* 2022, after the wedding. The honeymoon runs day by day in David's own
   words, then October to December go month by month, also in
   his words: whole sentences from his posts, cut down but never reworded.

   Photos: each slot is { "cap": "..." }. Put the picture in
   assets/photos/2022/ and add its name to the slot:
     { "src": "0808-in-n-out.jpg", "cap": "Our first In-N-Out" }
   A slot without "src" shows as a placeholder, with "cap" as the hint.
   Three to five slots per section reads best. */
window.MW_YEAR = {
 "year": "2022",
 "from": 8,
 "note": "Each month is still David's writing from our posts, cut down to the highlights.",

 "honeymoon": {
  "month": 8,
  "title": "The Honeymoon",
  "dates": "August 8 to 22, 2022",
  "intro": "We got married on a Saturday and meant to fly out the next day. The flight got canceled, so we left on Monday instead. David wrote a post for every day of the trip, and they are all here as he wrote them.",
  "facts": [
   { "k": "Days on the road", "v": "15", "s": "Sacramento on August 8, Seattle on August 22." },
   { "k": "States", "v": "3", "s": "California, Oregon and Washington, with the ocean in all three." },
   { "k": "National parks", "v": "6", "s": "Lassen Volcanic, Redwood, Crater Lake, Mount Rainier, North Cascades and Olympic." },
   { "k": "Firsts", "v": "1 In-N-Out", "s": "Our first stop after landing in Sacramento." }
  ],

  /* The route, in the order we drove it: [name, latitude, longitude].
     Each day's "leg" is the first and last stop it covers. */
  "route": [
   ["Sacramento", 38.58, -121.49],
   ["Lassen Volcanic", 40.45, -121.53],
   ["Chico", 39.73, -121.84],
   ["Redwood", 41.30, -124.05],
   ["Eureka", 40.80, -124.16],
   ["Crater Lake", 42.94, -122.11],
   ["Eugene", 44.05, -123.09],
   ["Newport", 44.63, -124.05],
   ["Devil's Punch Bowl", 44.75, -124.06],
   ["Depoe Bay", 44.81, -124.06],
   ["Portland", 45.52, -122.68],
   ["Multnomah Falls", 45.58, -122.12],
   ["Hood River", 45.71, -121.52],
   ["Mount Hood", 45.37, -121.70],
   ["Portland", 45.52, -122.68],
   ["Mount St. Helens", 46.28, -122.22],
   ["Mount Rainier", 46.79, -121.74],
   ["Olympia", 47.04, -122.90],
   ["Mount Rainier", 46.91, -121.64],
   ["North Cascades", 48.67, -121.25],
   ["Olympia", 47.04, -122.90],
   ["Hoquiam", 46.98, -123.89],
   ["Hoh Rain Forest", 47.86, -124.02],
   ["Rialto Beach", 47.92, -124.64],
   ["Port Angeles", 48.12, -123.43],
   ["Hurricane Ridge", 47.97, -123.50],
   ["Port Angeles", 48.12, -123.43],
   ["Hoh Rain Forest", 47.86, -123.93],
   ["Rialto Beach", 47.92, -124.64],
   ["Forks", 47.95, -124.39],
   ["Strait of Juan de Fuca", 48.16, -123.75],
   ["Port Townsend", 48.12, -122.76],
   ["Seattle", 47.61, -122.33],
   ["Bainbridge Island", 47.63, -122.53],
   ["Seattle", 47.61, -122.33]
  ],

  "days": [
   {
    "day": 1,
    "date": "Monday, August 8",
    "title": "Start & Sacramento",
    "where": "Sacramento & Lassen Volcanic, CA",
    "leg": [0, 1],
    "text": [
     "We were supposed to leave on Sunday, but Mother Nature had other ideas. Sadly, our flight was canceled and Bear frantically tried to reschedule things, and luckily through the magic of Delta booked a super early flight from JFK. From JFK to LAX to SMF on Monday. This booklet chronicles our two-week honeymoon starting in Sacramento and ending in Seattle by way of many cute towns and National Parks and a first stop at In-N-Out, because we just had to have it once.",
     "Sure, there was a 90-minute delay in LAX for a mechanical issue, but after landing in Sacramento and getting a late lunch, we high-tailed it north for two hours to Lassen Volcanic National Park for a brief preview (Sulphur Works and yes it smelled like sulphur) and then had Mexican in the middle of nowhere!"
    ],
    "photos": [
     { "cap": "The early flight out of JFK" },
     { "cap": "Our first In-N-Out" },
     { "cap": "Sulphur Works, Lassen" },
     { "cap": "Mexican in the middle of nowhere" }
    ]
   },
   {
    "day": 2,
    "date": "Tuesday, August 9",
    "title": "Lassen Volcanic National Park",
    "where": "Lassen Volcanic & Chico, CA",
    "leg": [1, 2],
    "text": [
     "Lassen Volcanic is the National Park you probably don’t know exists but you should totally go. Did we mostly hike to the top of Mount Lassen? Yep! Did we see Bumpass Hell? Hell yeah we did! Did we hike farther than we needed to and turn around because the boiling lake was too far and we wanted dinner? Oh yeah, and then we had a great dinner at the Sierra Nevada brewery in Chico! It was truly a magical day, and you should totally go to Lassen Volcanic!"
    ],
    "photos": [
     { "cap": "Near the top of Mount Lassen" },
     { "cap": "Bumpass Hell" },
     { "cap": "The trail we turned back on" },
     { "cap": "Dinner at Sierra Nevada, Chico" }
    ]
   },
   {
    "day": 3,
    "date": "Wednesday, August 10",
    "title": "Redwoods, the Pacific & Eureka",
    "where": "Redwood National & State Parks and Eureka, CA",
    "leg": [2, 4],
    "text": [
     "On our trip, we learned that DOTs blitz mountain passes with work zones during summer and this was the first day we experienced that. On top of that, there were nearby forest fires that made the drive to the coast a tad mysterious! Eventually we got to Redwood National Park and saw some huge trees! We also saw the Pacific Ocean for the first time and the outlet of Redwood Creek which was pretty cool! Afterwards we stayed in a really old hotel in Eureka and had a great pizza dinner!"
    ],
    "photos": [
     { "cap": "Smoky skies on the drive to the coast" },
     { "cap": "The huge trees" },
     { "cap": "Our first look at the Pacific" },
     { "cap": "Where Redwood Creek meets the ocean" },
     { "cap": "Pizza night in Eureka" }
    ]
   },
   {
    "day": 4,
    "date": "Thursday, August 11",
    "title": "Crater Lake National Park",
    "where": "Crater Lake & Eugene, OR",
    "leg": [4, 6],
    "text": [
     "It’s generally known that there are lots of trees in Oregon, but if you need to experience it yourself, we recommend the drive to Crater Lake! It’s such a cool park with some truly awesome vistas that you should check out! Also, chipmunks! So many damn chipmunks! After Crater Lake, we stayed at an awesome hotel and Eugene (our favorite of the entire trip) and even had a nice dinner at a Brewery. Such a fun day!"
    ],
    "photos": [
     { "cap": "All the trees on the drive in" },
     { "cap": "Crater Lake from the rim" },
     { "cap": "So many chipmunks" },
     { "cap": "Brewery dinner in Eugene" }
    ]
   },
   {
    "day": 5,
    "part": "Part 1",
    "date": "Friday, August 12",
    "title": "The Oregon Coast",
    "where": "Newport to Depoe Bay, OR",
    "leg": [6, 9],
    "text": [
     "I promised Yinja we would see the Ocean in all three states, but what I didn’t mention was that we would go to every Scenic Viewpoint in Oregon along the ocean! Starting the day in Newport, we had a great Mexican Brunch and then saw a lighthouse before such fun viewpoints as Devil’s Punch Bowl! There are so many cliffs along the ocean in Oregon and they do provide some awesome vantage points! From along the coast, we began to meander towards the Columbia River Gorge, but we will save that part of the day for another post!"
    ],
    "photos": [
     { "cap": "Mexican brunch in Newport" },
     { "cap": "The lighthouse" },
     { "cap": "Devil's Punch Bowl" },
     { "cap": "Otter Rock" },
     { "cap": "Depoe Bay" }
    ]
   },
   {
    "day": 5,
    "part": "Part 2",
    "date": "Friday, August 12",
    "title": "Portland Traffic, Multnomah Falls & Mount Hood",
    "where": "Columbia River Gorge & Mount Hood, OR",
    "leg": [9, 14],
    "text": [
     "There is no better welcome to the Columbia River Gorge than Portland Traffic! Once we got through it, we visited Multnomah Falls! We hiked to the top of the falls and then hiked along the creek and saw a few more falls. Afterwards, we had an awesome dinner in Hood River and then tried to catch a view of Mount Hood but Panorama Point was closed for the evening! So, undeterred, we decided to drive to Mount Hood where we were treated to a truly amazing view of the mountain, and we hope you agree! Afterwards, we saw our friends Marc and Melinda and had a nice evening at their new home! Such a great ending to what we consider one of the best days on the trip!"
    ],
    "photos": [
     { "cap": "Multnomah Falls" },
     { "cap": "More falls along the creek" },
     { "cap": "Dinner in Hood River" },
     { "cap": "Mount Hood" },
     { "cap": "Marc and Melinda's new home" }
    ]
   },
   {
    "day": 6,
    "date": "Saturday, August 13",
    "title": "Portland, Day 1",
    "where": "Portland, OR",
    "leg": [14, 14],
    "text": [
     "Our first full day in Portland! March and Melinda took us to the Japanese Garden which was such a pleasant, serene place and after exploring there checked out the Rose Garden! So many roses, including colors we’ve never seen before! Truly the Rose City! From there we had lunch at a brewery then went to a meh Chinese Garden. After the meh garden, we walked along the Willamette River and thought hard about how long we wanted to stay in Portland. We decided not to spend three days in Portland and subsequently spent time changing upcoming hotel reservations. Then we walked to the Freakybuttrue Peculiarium which was surprisingly fun if a tad cheesy! We then explored the Pearl District, going to Powell’s Books, then a beer bar, then an awesome sushi restaurant!"
    ],
    "photos": [
     { "cap": "The Japanese Garden" },
     { "cap": "The Rose Garden" },
     { "cap": "Freakybuttrue Peculiarium" },
     { "cap": "Powell's Books" },
     { "cap": "Sushi in the Pearl District" }
    ]
   },
   {
    "day": 7,
    "date": "Sunday, August 14",
    "title": "Portland, Day 2",
    "where": "Portland, OR",
    "leg": [14, 14],
    "text": [
     "Day 2 of Portland started with a Light Rail ride to the Oregon Zoo where we got to see cute otters (and other animals, including bears). After the zoo we had awesome Duck House Chinese food (no duck at Duck House). We then walked along the River before deciding to go across the Willamette River to a good brewery, then we walked back from there to a Cocktail Bar in the Pearl District. When we got there, it was not exactly our scene, so we aborted going there and went to an even better cocktail place! It was so good, and afterwards we had sushi again for dinner!",
     "Lastly, believe it or not, but today marks six months of legally wedded bliss. Shit happened in May and our lawyer suggested we get married ASAP. We sure did, and six months later we are still madly in love and in fact the Bear and Tiger!"
    ],
    "photos": [
     { "cap": "Otters at the Oregon Zoo" },
     { "cap": "Duck House, no duck" },
     { "cap": "Across the Willamette" },
     { "cap": "The even better cocktail place" },
     { "cap": "Still the Bear and Tiger" }
    ]
   },
   {
    "day": 8,
    "date": "Monday, August 15",
    "title": "Mount Saint Helens & Mount Rainier",
    "where": "Mount St. Helens, Mount Rainier & Olympia, WA",
    "leg": [14, 17],
    "text": [
     "The internet suggests that Mount Saint Helens is a disappointment. If you read that, believe it, then be blown away by how cool it is! So many awesome viewpoints, a lovely lake (Coldwater Lake), and a nice interpretive center at Johnson Ridge! From there, we received bad news from our Landlord and frantically coordinated to move earlier than anticipated while we traveled north from Mount Saint Helens. After dealing with Landlord and moving hell, we stopped for some good Mexican Food, then hightailed it to Paradise! That’s Paradise in Mount Rainier National Park, to be more specific. Sure, it took forever to get into Mount Rainier, but the view was quite nice and it was crisp, pleasant weather!. From there, we traveled to Olympia where we had awesome Barbeque at Hops on the Hill where we were treated exceptionally well, then called it a night!"
    ],
    "photos": [
     { "cap": "Mount Saint Helens" },
     { "cap": "Coldwater Lake" },
     { "cap": "Paradise, Mount Rainier" },
     { "cap": "Barbecue at Hops on the Hill" }
    ]
   },
   {
    "day": 9,
    "date": "Tuesday, August 16",
    "title": "Mount Rainier & North Cascades",
    "where": "Mount Rainier, North Cascades & Olympia, WA",
    "leg": [17, 20],
    "text": [
     "We were so ready to do Day 2 in Mount Rainier, but when we got to Sunrise and began our hike, our legs weren’t feeling the hike! So, we made an executive decision to travel north to North Cascades National Park, and boy did that take forever to get there. We got out at the visitor center, walked about a bit, then traveled east towards Diablo Lake. Sadly, we did not realize how brutal road work in mountain country was, and pretty much every viewpoint in the National Park was closed off because of road work, and after spending five hours getting to the Park it was mildly infuriating and honestly ruined what would have been a beautiful trip to see turquoise waters and majestic mountains. Dejected, we traveled back to Olympia and on the way stopped to get Mexican food for dinner. All in all, this day was the low point of our honeymoon, but rest assured, there are better days to come!"
    ],
    "photos": [
     { "cap": "Sunrise, Mount Rainier" },
     { "cap": "The North Cascades visitor center" },
     { "cap": "The road towards Diablo Lake" }
    ]
   },
   {
    "day": 10,
    "date": "Wednesday, August 17",
    "title": "Olympic National Park, Day 1",
    "where": "Hoquiam, Rialto Beach & Port Angeles, WA",
    "leg": [20, 24],
    "text": [
     "After the previous day, brunch was necessary. Whoever thought there would be an awesome brunch place on the way to Olympic National Park? Well, there is and it is called Brunch 101 in Hoquiam! If you ever are on US 101 going towards the Olympic beaches and want brunch, this place is a must stop location! Oh, yeah, did I mention we did beaches? So many beaches along the Washington Coast, including seeing the black sand beach of Rialto Beach for the first time! Before getting there though, we tried to visit the Hoh Rain Forest only to give up after seeing how long the line was to get in! Rialto Beach was definitely a fun visit and it let us get to our hotel in Port Angeles sooner which let us have a very nice dinner followed by some exploration and ice cream! Did we also mention our hotel had an awesome view of the water? Oh yeah, it sure did!"
    ],
    "photos": [
     { "cap": "Brunch 101, Hoquiam" },
     { "cap": "The Washington beaches" },
     { "cap": "Black sand at Rialto Beach" },
     { "cap": "The view from our hotel" },
     { "cap": "Ice cream in Port Angeles" }
    ]
   },
   {
    "day": 11,
    "date": "Thursday, August 18",
    "title": "Olympic National Park, Day 2",
    "where": "Hurricane Ridge & Port Angeles, WA",
    "leg": [24, 26],
    "text": [
     "We got up super early and treated ourselves to free breakfast before heading into Olympic National Park towards Hurricane Ridge. Sure, the trail to Hurricane Hill was closed, but there were lots of other trails and we took a long one along the Klahhane Ridge! So many views! So few people on the trail! So much fun! The hike took quite a while, and after the hike we decided to head back to Port Angeles to catch an early happy hour dinner at Spruce! Afterwards, we explored the town a bit more, then headed to an early bed so we can get to the following day’s location before everyone else!"
    ],
    "photos": [
     { "cap": "Klahhane Ridge" },
     { "cap": "So few people on the trail" },
     { "cap": "Happy hour at Spruce" }
    ]
   },
   {
    "day": 12,
    "date": "Friday, August 19",
    "title": "Olympic National Park, Day 3",
    "where": "Hoh Rain Forest, Forks & Port Townsend, WA",
    "leg": [26, 32],
    "text": [
     "We got up super early yet again and unsurprisingly had more free breakfast before heading to the Hoh Rain Forest. Departing super early, we got to Hoh way before most and easily found parking, then hiked the rainforest (easier trails as super sore and mountain lions)! So many ferns, and it was a surreal place. Afterwards, we arrived at Rialto Beach during low tide and hiked to some cool geologic features! Then, we had burgers at Sully’s in Forks and from there meandered towards Juan de Fuca Strait and saw how foggy that strait can be! (sorry the fog made the photos meh) Then we drove towards Port Townsend and had amazing wine coupled with a lovely charcuterie spread in Port Townsend followed by awesome Chinese food and cocktails at the Elephant Room! (sorry the Elephant Room photos didn’t turn out either) Such a fun day!"
    ],
    "photos": [
     { "cap": "Ferns in the Hoh Rain Forest" },
     { "cap": "Rialto Beach at low tide" },
     { "cap": "Burgers at Sully's, Forks" },
     { "cap": "Fog on the Strait of Juan de Fuca" },
     { "cap": "Wine and charcuterie in Port Townsend" }
    ]
   },
   {
    "day": 13,
    "date": "Saturday, August 20",
    "title": "Seattle, Day 1",
    "where": "Seattle, WA",
    "leg": [32, 32],
    "text": [
     "Panoramic photos of Seattle do not show that downtown Seattle is on a hill. Not just any hill, a 22 degree hill! It used to be 45 degrees, and we learned that on the underground tour we did in the evening! Before we did that though, we started the day with a brunch place that yelp suggested would be good. It was meh. After the meh brunch, we walked to the Museum of Pop Culture and spent several hours there! Quite a cute museum and we thoroughly enjoyed it! We then meandered about Seattle for a few hours exploring before going on the aforementioned Pioneer Square underground tour! This was a cool tour and highly recommended! Then, we had awesome German food and beer at Altstadt Biergarten and Brathaus! We even had a great time talking to the awesome bartender, Max!"
    ],
    "photos": [
     { "cap": "The 22 degree hill" },
     { "cap": "Museum of Pop Culture" },
     { "cap": "Underground in Pioneer Square" },
     { "cap": "Altstadt Biergarten and Brathaus" }
    ]
   },
   {
    "day": 14,
    "date": "Sunday, August 21",
    "title": "Seattle, Day 2",
    "where": "Bainbridge Island & Seattle, WA",
    "leg": [32, 34],
    "text": [
     "We have heard nice things about Bainbridge Island, and we started our day by taking a ferry there! We explored the island, took lots of photos, then went to a free museum! After the museum, we walked to Sisters Cider House and drank a bunch of cider followed by getting lunch at a local restaurant. After lunch, we decided to take a ferry back to the city and we meandered through Pike’s Place market before continuing to walk to South Lake Union! Once there, we kept walking to Outer Planet Brewing in Capitol Hill followed by taking an Lyft to Fremont Brewing in Fremont! Afterwards, we had Irish Food, found the Fremont Giant, and then called it a night!"
    ],
    "photos": [
     { "cap": "The ferry to Bainbridge Island" },
     { "cap": "Sisters Cider House" },
     { "cap": "Pike Place Market" },
     { "cap": "Fremont Brewing" },
     { "cap": "The Fremont Giant" }
    ]
   },
   {
    "day": 15,
    "date": "Monday, August 22",
    "title": "Seattle, Day 3",
    "where": "Seattle, WA",
    "leg": [34, 34],
    "text": [
     "So, we had checked out Pikes Place a few times before, but each time it was super packed and there was one thing Yinja wanted to do. On Monday morning, we finally got to go into the original Starbucks and we got mugs to commemorate this occasion. Afterwards, we went to Storyville Coffee for much fancier coffee and even got a free pastry! Then, we decided to do the Columbia Center Observation Deck where we got some awesome views, and from there walked up the hill to some more views before walking all the way to Optimism Brewing Company! It was such an awesome brewery and we highly recommend it! Sadly, Optimism was the last place we got to see due to time running out, and we returned to the hotel to get our bags and head home, which we did in Comfort Plus with copious amounts of free booze!"
    ],
    "photos": [
     { "cap": "Mugs from the original Starbucks" },
     { "cap": "Storyville Coffee" },
     { "cap": "The Columbia Center Observation Deck" },
     { "cap": "Optimism Brewing Company" },
     { "cap": "Comfort Plus, home" }
    ]
   }
  ]
 },

 /* Sits between the honeymoon and the rest of the year */
 "quote": {
  "text": "I will share that the new stretch of the road that you’ve begun today will have its bumps. It’ll have its curves and splits. But know that the love you share, your affinity for craft beer that you both love, and good food and David being a traffic engineer will always get you back on the smooth, smooth road. God bless you both!",
  "who": "Ken Murnan",
  "role": "Father of the groom, at the reception",
  "note": "Looking back, the Bear & Tiger are truly inseparable. From the wedding in August to securing our future in December and everything in between, it’s been quite the ride we have taken together!"
 },

 "months": [
  {
   "month": 10,
   "trips": [
    {
     "dates": "October 16",
     "place": "Cold Spring to Beacon, NY",
     "text": [
      "Sure, we hiked plenty on our honeymoon, but why not hike some more? Up and down the mountains we went, seeing great sights and eventually scrambling up a rock face to the Beacon Fire Tower! We then had beer at Hudson Valley Brewing Company, tried to get burgers somewhere but they annoyingly closed early, and instead had an amazing dinner at Homespun Foods! Such a great day!"
     ]
    }
   ],
   "photos": [
    { "cap": "Breakfast in Cold Spring" },
    { "cap": "The rock scramble" },
    { "cap": "The Beacon fire tower" },
    { "cap": "Dinner at Homespun Foods" }
   ]
  },
  {
   "month": 11,
   "trips": [
    {
     "dates": "November 11 to 13",
     "place": "Winchester & Shenandoah, VA",
     "text": [
      "For Veteran’s Day weekend, we wanted to go somewhere, and we decided we wanted to visit Shenandoah National Park.",
      "On Saturday, we returned to hike in Shenandoah and did the Cedar Run trail, kind of… when we got to a creek crossing that appeared to be two feet deep, neither Yinja or I were in the mood to do that so we turned around and hiked back up and did the Hawksbill Trail to an amazing viewpoint on Hawksbill Mountain."
     ]
    },
    {
     "dates": "November 23 to 27",
     "place": "Washington, DC",
     "text": [
      "It feels like it has become a bit of a tradition for Yinja and I to go to DC for Thanksgiving. On Thanksgiving, we had lunch at Nando’s (how we wish this was in NYC), did some touristy stuff, then had an amazing dinner for the second year in a row at Lincoln! At Lincoln, we even got to sit at the fancy table, and they were super duper nice to us!"
     ]
    }
   ],
   "photos": [
    { "cap": "Foggy Skyline Drive" },
    { "cap": "The view from Hawksbill Mountain" },
    { "cap": "Mole Stout at Basic City" },
    { "cap": "Thanksgiving at Lincoln" },
    { "cap": "Axe throwing for Yao's birthday" }
   ]
  },
  {
   "month": 12,
   "trips": [
    {
     "dates": "December 20 to 28",
     "place": "Cincinnati, OH & Silver Spring, MD",
     "text": [
      "Christmastime in Cincinnati and DC. You’d think we have a bunch of photos, and we should! Sadly, we suppose that photo taking was on the back of our mind as there was a nasty snow storm in Cincinnati that caused a Level 2 snow emergency.",
      "Like any good Cincinnati kid away from home should do, we drove directly from NYC to the Skyline Chili in Stow. By some act of craziness, my dad brought us Skyline which miraculously was open."
     ]
    }
   ],
   "photos": [
    { "cap": "Skyline in Stow" },
    { "cap": "MadTree with Jen and Eric" },
    { "cap": "The snowstorm" },
    { "cap": "Ellicott City" }
   ]
  }
 ]
};
