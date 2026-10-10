/* 2026, month by month, in David's words: whole sentences from his posts,
   cut down but never reworded. January to July so far.

   The page is not linked from anywhere yet: 2026 carries "hidden": true in
   years/index.js until the year is over. Its trips are already on the home
   page's map, built from this file by tools/build-memories.mjs.

   "to" is the last month the bar shows while the year is still running; take
   it out once December is written. A month's "label" replaces the "One trip"
   count beside its name, for a month whose entry is not a trip. A trip's
   "highlight" is the page that tells it at length, which is where the map on
   the home page sends people for it while this page is hidden.

   Photos: each slot is { "src": "...", "cap": "..." }. "src" is a picture in
   assets/photos/2026/, or a path from assets/ like
     "continued_trips/2026-06-yosemite/2026-06-yosemite-05.jpg"
   "pos" moves the crop when the people sit off to one side ("right", "70% 50%").
   A slot without "src" shows as a placeholder, with "cap" as the hint.
   Three to five slots per month reads best. */
window.MW_YEAR = {
 "year": "2026",
 "from": 1,
 "to": 7,

 "facts": [
  { "k": "A new citizen", "v": "10:30 am", "s": "February 4, at the courthouse in Brooklyn. Yinja came out a citizen and a Murnan." },
  { "k": "Big birthdays", "v": "30", "s": "Yinja turned 30 on June 10, in the redwoods at Muir Woods." },
  { "k": "National parks", "v": "6", "s": "The Everglades, Congaree, Mammoth Cave, Kings Canyon, Sequoia and Yosemite, by July." },
  { "k": "Evergrain stops", "v": "3", "s": "The brewery on the drive home, in January, March and May." }
 ],

 "note": "January to July so far. The rest of the year, the Christmas card and the New Year's letter are still to come.",

 "months": [
  {
   "month": 1,
   "trips": [
    {
     "dates": "January 1",
     "place": "Key West & the Florida Keys, FL",
     "text": [
      "We quickly learned on day 1 at Everglades that we could do everything in twoish days, and as we were there for three days decided to visit Key West! We traveled three hours along the Overseas Highway stopping at various scenic viewpoints along the way. After many scenic stops, we arrived in Key West where we walked all over! We saw the “southernmost point in the USA”, we enjoyed amazing Cuban food at El Siboney, and visited the Key West Gardens! We also saw countless roosters (I mean, we could have counted them but we chose not to)."
     ]
    },
    {
     "dates": "January 2",
     "place": "The Everglades & Shark Valley, FL",
     "text": [
      "So, on Friday morning we stopped at Miccosukee Airboat Rides to complete an incredible airboat tour! Before the tour started Yinja got to hold a baby alligator, and after that we boarded the airboat. As we bought tickets early we were in the front row while the airboat drive zipped all around the Everglades. The airboat driver was very knowledgeable and excellent at finding all the great spots with a ton of alligators! Then, on our tram tour, we saw even more alligators and birds before stopping at the observation tower! We saw some nice views from the tower before continuing the tour and seeing an American crocodile!"
     ]
    },
    {
     "dates": "January 3 to 4",
     "place": "Congaree, SC & Humpback Rocks, VA",
     "text": [
      "After spending the night in Jacksonville, we decided to visit Congaree! Unlike in November, January brought moody Congaree back! Under a light rain, we took in the sights and sounds along the various trails before continuing north to near Shenandoah. Just south of the park along the Blue Ridge Parkway, we did some hiking up to the Humpback Rocks and we were treated to some awesome views!"
     ]
    },
    {
     "dates": "January 16 to 19",
     "place": "Washington, DC",
     "text": [
      "We went to the DMV for MLK Day weekend! First, David took Yinja to the Udvar-Hazy Center for the first time and we enjoyed seeing all the planes and the space shuttle! Then on Monday, we first had lunch at Chercher before visiting the zoo, seeing a ton of animals including the pandas, then heading to Quarry House Tavern for Burger Monday to close out the trip."
     ]
    }
   ],
   "photos": [
    { "src": "continued_trips/2026-01-florida-keys/2026-01-florida-keys-02.jpg", "cap": "New Year's Day in Key West" },
    { "src": "continued_trips/2026-01-florida-keys/2026-01-florida-keys-01.jpg", "cap": "The Southernmost Point, Key West" },
    { "src": "continued_trips/2026-01-everglades/2026-01-everglades-02.jpg", "cap": "Yinja holds a baby alligator in the Everglades" },
    { "src": "continued_trips/2026-01-congaree/2026-01-congaree-01.jpg", "cap": "Congaree in the rain" },
    { "src": "continued_trips/2026-01-congaree/2026-01-congaree-07.jpg", "cap": "On top of Humpback Rocks" },
    { "src": "continued_trips/2026-01-dc/2026-01-dc-06.jpg", "cap": "Lunch at Chercher in Washington, DC", "pos": "40% 50%" }
   ]
  },
  {
   "month": 2,
   "label": "One big day",
   "trips": [
    {
     "dates": "February 4",
     "place": "Yinja's citizenship, Brooklyn, NY",
     "highlight": "highlights-citizenship.html",
     "text": [
      "As of 10:30 am this morning, Yinja officially became both a U.S. citizen and a Murnan. I truly hope all of you feel as proud and excited for him as we do.",
      "I’m so happy for my Tiger, and congrats on accomplishing so many goals so quickly!"
     ]
    }
   ],
   "photos": [
    { "src": "continued_trips/2026-02-citizenship/2026-02-citizenship-01.jpg", "cap": "Outside the courthouse in Brooklyn, straight after the oath" }
   ]
  },
  {
   "month": 3,
   "trips": [
    {
     "dates": "March 28 to 31",
     "place": "Hocking Hills, Columbus & Cincinnati, OH",
     "text": [
      "First, we stopped in Columbus to go for a glorious run along the Scioto before having dinner at Walter’s for some glorious German food! The next day, we drove to Hocking Hills! David had heard many nice things from friends about the area, and while the state park was cool with plenty of waterfalls, what made the area truly special was all of the other smaller state preserves nearby that elevated the overall experience. We especially thought Cantwell Cliffs was really cool as one does not generally expect steep cliffs in Ohio.",
      "Then, we checked into our Postcard Cabin, which while small had a fire pit, firewood, fire starter, and a smores kit. We absolutely made a fire and had smores. It was glorious. On Monday, we went for a run before heading to Cincinnati to meet our newest nephew for the first time!"
     ]
    }
   ],
   "photos": [
    { "src": "continued_trips/2026-03-columbus-hocking-hills/2026-03-columbus-hocking-hills-06.jpg", "cap": "At Cedar Falls in Hocking Hills" },
    { "src": "continued_trips/2026-03-columbus-hocking-hills/2026-03-columbus-hocking-hills-02.jpg", "cap": "Upper Falls at Old Man's Cave" },
    { "src": "continued_trips/2026-03-columbus-hocking-hills/2026-03-columbus-hocking-hills-01.jpg", "cap": "Dinner at Walter's in Columbus" },
    { "src": "continued_trips/2026-03-columbus-hocking-hills/2026-03-columbus-hocking-hills-07.jpg", "cap": "Looking out of Rock House" },
    { "src": "continued_trips/2026-03-columbus-hocking-hills/2026-03-columbus-hocking-hills-10.jpg", "cap": "The fire pit at the cabin", "pos": "70% 50%" }
   ]
  },
  {
   "month": 4,
   "trips": [
    {
     "dates": "April 17 to 20",
     "place": "Cincinnati, OH & Mammoth Cave, KY",
     "text": [
      "We returned to Cincinnati for David’s birthday! Once there, we joined Eric, Jen, and Sully at the Cincinnati Zoo! We enjoyed the zoo with them and then had a nice dinner and beer at Shift in Bright.",
      "Mammoth Cave! We did the River Styx tour and then the Violet City Lantern Tour, which honestly was really cool touring the caves by lantern. It was a fun trip, and we really enjoyed our time back in Cincinnati/KY!"
     ]
    }
   ],
   "photos": [
    { "src": "continued_trips/2026-04-cincy/2026-04-cincy-02.jpg", "cap": "At the Mammoth Cave visitor center" },
    { "src": "continued_trips/2026-04-cincy/2026-04-cincy-01.jpg", "cap": "Meerkats at the Cincinnati Zoo" },
    { "src": "continued_trips/2026-04-cincy/2026-04-cincy-04.jpg", "cap": "A pool inside Mammoth Cave" },
    { "src": "continued_trips/2026-04-cincy/2026-04-cincy-06.jpg", "cap": "A waterfall inside Mammoth Cave" },
    { "src": "continued_trips/2026-04-cincy/2026-04-cincy-09.jpg", "cap": "Wings with family in Cincinnati" }
   ]
  },
  {
   "month": 5,
   "trips": [
    {
     "dates": "May 16 to 17",
     "place": "Ricketts Glen, Worlds End & Hersheypark, PA",
     "text": [
      "In mid May, we did a weekend trip to do some fun activities in Pennsylvania! On Saturday, we first arrived at Ricketts Glen State Park where we saw a ton of waterfalls! After seeing some really cool falls, we traveled to Worlds End where we had some great BBQ before doing a hike to a nice view. We had a blast at Hersheypark and when we were done having a blast we went to get a beer and snack at Troegs then dinner at Evergrain!"
     ]
    },
    {
     "dates": "May 21 to 25",
     "place": "San Diego, Coronado & Encinitas, CA",
     "text": [
      "We went to San Diego over Memorial Day weekend! It only took a three hour weather delay to get there at 2:30AM but we made it! After waking up, we met David’s brother Jake and his boyfriend Matt for a lovely time at the zoo, and everyone enjoyed the zoo adventure! Yinja especially liked seeing the pandas!",
      "The next day, we traveled to Coronado and explored the sights and sounds! We visited the Hotel, walked the beach, and enjoyed strolling the Main Street. The next and last full day we took the Coaster Train to Encinitas to explore! During our exploration we visited some scenic views and also a Meditation Garden!"
     ]
    }
   ],
   "photos": [
    { "src": "continued_trips/2026-05-pennsylvania/2026-05-pennsylvania-03.jpg", "cap": "Under the falls at Ricketts Glen" },
    { "src": "continued_trips/2026-05-pennsylvania/2026-05-pennsylvania-08.jpg", "cap": "The view at Worlds End" },
    { "src": "continued_trips/2026-05-pennsylvania/2026-05-pennsylvania-09.jpg", "cap": "Hersheypark" },
    { "src": "continued_trips/2026-05-san-diego/2026-05-san-diego-01.jpg", "cap": "At the San Diego Zoo with Jake and Matt" },
    { "src": "continued_trips/2026-05-san-diego/2026-05-san-diego-04.jpg", "cap": "On Coronado Beach" },
    { "src": "continued_trips/2026-05-san-diego/2026-05-san-diego-12.jpg", "cap": "The Meditation Garden in Encinitas" }
   ]
  },
  {
   "month": 6,
   "trips": [
    {
     "dates": "June 4 to 9",
     "place": "Yosemite, Sequoia & Kings Canyon, CA",
     "highlight": "highlights-yinjas-30th.html",
     "text": [
      "For Yinja’s 30th birthday,  we flew to Fresno (by way of SLC to do a California Adventure! After a night in town, we drove to our first stop: Kings Canyon National Park! The next stop on our trip was Sequoia National Park! We immediately went to look at some sequoias on a less traveled path, and then headed up the mountain to Moro Rock where Yinja made it to the top (too treacherous at the top for David).",
      "Yosemite has been Yinja’s number one bucket list National Park, and after Sequoia we made it to Wawona in Yosemite! Very early the next morning we parked in Curry Village and hiked the Mist Trail first to a relatively not busy Vernal Falls and other than the view experienced quite the mist before continuing to the top of Nevada Falls! On the return hike it was quite busier, but at Vernal Falls we were treated to a double rainbow!"
     ]
    },
    {
     "dates": "June 10 to 15",
     "place": "Sonoma, Lake Tahoe & Napa, CA",
     "highlight": "highlights-yinjas-30th.html",
     "text": [
      "What does one do first when arriving in Santa Rosa? Well, for us, it was to go to Russian River for dinner, and it was such a lovely dinner of pizza and beer. We then called it a night for the big day - Yinja’s 30th! Happy 30th to him! We got up early and drove to our reservation at Muir Woods! We did a rather beautiful and pensive hike through the Redwoods, then headed to the Russian River Valley to visit Russian River Vineyards for an awesome lunch consisting of Sonoman Wines and nice sandwiches.",
      "The following day, we parked in Incline Village and hiked to Monkey Rock then down to Hidden Beach. Both locales had great views, and after the hike we drove to Olympic Valley to hike Shirley Canyon! It was a popular hike along a creek, and after most everyone turned around we continued farther up the mountain, eventually even hiking through snow to reach the Palisades Tram Summit!",
      "California was such an awesome trip. Epic hikes, amazing views, great food, and awesome drinks. It was truly a lovely trip!"
     ]
    },
    {
     "dates": "June 19 to 21",
     "place": "Baltimore, MD",
     "text": [
      "We took a June trip to Baltimore! We ran a bunch along the Inner Harbor, we had brunch at Bunny’s and walked throughout the city, but the star of the trip was Real Chesapeake Oyster Company! We also got to see Adam! We visited Sherwood Gardens and had lunch at the Mount Washington Tavern!"
     ]
    }
   ],
   "photos": [
    { "src": "continued_trips/2026-06-yosemite/2026-06-yosemite-05.jpg", "cap": "The double rainbow at Vernal Falls, Yosemite" },
    { "src": "continued_trips/2026-06-kings-canyon/2026-06-kings-canyon-02.jpg", "cap": "Mist Falls in Kings Canyon" },
    { "src": "continued_trips/2026-06-sonoma/2026-06-sonoma-02.jpg", "cap": "Muir Woods on Yinja's 30th" },
    { "src": "continued_trips/2026-06-lake-tahoe/2026-06-lake-tahoe-02.jpg", "cap": "At Lake Tahoe that evening" },
    { "src": "continued_trips/2026-06-baltimore/2026-06-baltimore-02.jpg", "cap": "Sherwood Gardens, Baltimore" },
    { "src": "continued_trips/2026-06-baltimore/2026-06-baltimore-09.jpg", "cap": "The Inner Harbor, Baltimore" }
   ],
   "folders": ["2026-06-sequoia", "2026-06-napa"]
  },
  {
   "month": 7,
   "trips": [
    {
     "dates": "July 3 to 5",
     "place": "Camel's Hump & Mount Hunger, VT",
     "text": [
      "For the 4th, we returned to Vermont! On the 3rd it was rather toasty so we visited Marsh Billings Rockefeller National Historic Park and saw a very historic mansion, then visited a few breweries, with the new good ones being Frost Brew Works and Hill Farmstead Brewing! On the 4th we hiked Mt Hunger which on a hot day was rather brutal.",
      "The 5th though, was quite the highlight!  We hiked Camels Hump which was nowhere near as brutal as Mt Hunger and had lovely people who explained that Mt Hunger is in fact a “stairmaster” hike. Vermont was a fun trip and always such a good time."
     ]
    }
   ],
   "photos": [
    { "src": "continued_trips/2026-07-vermont/2026-07-vermont-07.jpg", "cap": "On top of Mount Hunger" },
    { "src": "continued_trips/2026-07-vermont/2026-07-vermont-03.jpg", "cap": "The view from Mount Hunger" },
    { "src": "continued_trips/2026-07-vermont/2026-07-vermont-08.jpg", "cap": "Ridgelines from Camel's Hump" },
    { "src": "continued_trips/2026-07-vermont/2026-07-vermont-01.jpg", "cap": "The porch at Marsh-Billings-Rockefeller" },
    { "src": "continued_trips/2026-07-vermont/2026-07-vermont-09.jpg", "cap": "A rest on the way down" }
   ]
  }
 ]
};
