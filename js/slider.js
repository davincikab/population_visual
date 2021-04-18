var filterObject = {
  origin:"all",
  destination:"all",
  activeYear:1990,
  dateRange:[1990, 1990],
  gender:'Male',
  age:"0-4",
  economicZone:"High-income countries",
  region:"Africa"
};

var sliderYear = {
  1990:{index:0},
  1995:{index:1},
  2000:{index:2},
  2005:{index:3},
  2010:{index:4},
  2015:{index:5},
  2019:{index:6},
};

var originInput = document.getElementById("from");

var activeFilter = "";

var dataTime = d3.range(0, 35, 5).map(function(d) {
  if(d == 30) return new Date(2019, 1, 1);

  return new Date(1990 + d, 1, 1);
});

var sliderTime = d3
  .sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  // .step(1000 * 60 * 60 * 24 * 365 * 1)
  .width(1000)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(dataTime)
  .tickPadding(1)
  .default(new Date(1990, 1, 1))
  .fill("blue")
  .on("end", val => {
    console.log("End Event");

      // get the year and update the index
      let years = animateTime.map(n => d3.timeFormat('%Y')(n));
      let timeframe = years.find(value =>  value == d3.timeFormat('%Y')(val) );
  
      console.log(timeframe);

      // update the index
      let indexx = years.indexOf(timeframe);
      index = indexx + 1;

      console.log(index);
      // cancel animation
      cancelIntervalAnimation();

      // change the icons
      playOrPause();

      mouseout();

  })
  .on('onchange', val => {
    // get the index
    console.log(d3.timeFormat('%Y')(val));
    // index = animateTime.indexOf(val);

    let year = d3.timeFormat('%Y')(val) == 2020 ? 2019 : d3.timeFormat('%Y')(val);

      if(year != filterObject.activeYear) {
        if(!sliderYear[year]) {
          displayPopup(year);

          if(selected || filterObject.destination != "all") {
            mouseout();
          }
         
          return;
        }

        resetMapView();

        // call the filter function
        filterObject.activeYear = year;

        console.log(year);
        filterActiveLayerByYear(year);
        displayPopup();
      }
      
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', "85vw")
    .attr('height', 70)
    .append('g')
    .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

function filterActiveLayerByYear(year) {
  xflows = orign_destionation[year];
  xflows = getYearFlows(xflows);

  xtofromarr = getXToFromArrary(xflows);

  console.log(xtofromarr);

  xstartarr = getStartArray(xtofromarr);
  xendarr = getEndArray(xtofromarr);
  xspeedarr = getSpeedArray(xtofromarr);
  cntarr = getCountArrar(xflows);

  countryData = createCountryJson(xflows, countryCoordinates);

  cancelAnimationFrame(requestAnim);

  d3.select("#renderer-container").classed("hidden", true);
  svg.classed("hidden", true);

  loadCircleMarker(countryData);
  // console.log("Migration for year: " + year);

  updatecities();

  // [188.4117728711111, 102.14937690632183]
  // [188.4117728711111, 102.14937690632183]

  setTimeout(() => {
    svg.classed("hidden", false);

    if(container.classList.contains("hidden")) {
      container.classList.remove("hidden");
      selected = "0";
      clicked = "0";
    }
  }, 500);

  // // // update the particle system
  [startarr, endarr] = reprojectArray();

  [startarr, endarr, speedarr] = negy(startarr, endarr, xspeedarr);
  mnum = startarr.length;
  cnttotal = getCountTotal(cntarr);

  createParticleSystem(startarr);
  requestAnimationFrame(update);
}

// search Origin and destionation
var fromInput = d3.select("#from");
fromInput
  .on("change", function(e) {
    e.stopPropagation();

    console.log(e);
    updateOriginDestionation(this, e.target.value);
  })
  .selectAll('option')
  .data([...countries].sort())
  .enter()
  .append("option")
  .attr('value', function(d) { return d; })
  .text(function(d){ return d});

var toInput = d3.select("#to");
toInput
  .on("change", function(e) {
    e.stopPropagation();

    console.log(e);
    updateOriginDestionation(this, e.target.value);
  })
  .selectAll('option')
  .data([...countries].sort())
  .enter()
  .append("option")
  .attr('value', function(d) { return d; })
  .text(function(d){ return d; })

function updateOriginDestionation(element, country) {
  element == originInput ? filterObject.origin = country : filterObject.destination = country;

  if(filterObject.origin != "" && filterObject.destination != "") {
    migrationByOrgnAndDest();
  }

  // update the the map origin and destination
  // map.getPaintPr
}

// filter the migrations between the two countries
function migrationByOrgnAndDest() {
  xflows = orign_destionation[filterObject.activeYear];
  xflows = getYearFlows(xflows);

  // console.log("Filtering");
  // console.log(filterObject);

  clicked = "0";
  clickedcbsa = 0;
  selected = "0";

  var { origin, destination} = filterObject;
  let originFeature = undefined;
  let destinationFeature = undefined;

  if(origin == "all") {
    loadCircleMarker(countryData);
  } else {

    let flows = xflows[origin];
    tempflows = xflows[origin];

    originFeature = countryData.find(cntry => cntry.properties.country == origin);
    console.log(flows);

    // get the countries
    let activeCountries = Object.keys(flows);

    console.log(activeCountries);
    let destinationCountry = countryData.filter(country => activeCountries.indexOf(country.properties.country) != -1);
    destinationCountry.push(originFeature);

    // countryData = createCountryJson(xflows, countryCoordinates);
    loadCircleMarker(destinationCountry);
  }

  if(destination == "all") {
    // originFeature = countryData.find(country => country.properties.country == destination);
  } else {
    // get th destination feature
    destinationFeature = countryData.find(cntry => cntry.properties.country == destination);
    let activeCountries = [destinationFeature, originFeature];

    // recreate country data
    loadCircleMarker(activeCountries);
  }

  // update the cities
  // updatecities();

  // get the xflows data
  // tempflows = xflows[origin];

  // change the colors
  countryCentroids
    .style("fill", function(d){
      if (d.properties.country == origin) { return 'yellow'; }

      if(destination == "all") {
        return 'green';
      }

      if (d.properties.country == destination) { return 'green'; }

      return "rgba(20,20,180,1)";
    })
    .transition()
    .style("opacity", 1);

    // updatecities();

    // console.log(xflows);
    
    // recreate the 
    if(originFeature) {
      console.log("Features");

      // ddd = originFeature;
      // selected = origin;  
      // clicked = origin;
      // clickedCentroid = origin;
      // selected = origin;

      updatecities();

      click(originFeature);
    }
    

    // hide the animation tab
    // container.classList.add("d-none");
    // cancelAnimationFrame(requestAnim);

    // zoom to the selected orgn and destination
    if(origin != "all" && destination != "all") {
      // get the bounding box
      let fc = turf.featureCollection([originFeature, destinationFeature]);
      let bbox = turf.bbox(fc);

      // map.fitBounds(bbox, {
      //   padding: {top: 50, bottom:55, left: 55, right:55}
      // });

    }
}

// d3.select("#reset-view")
//   .on("click", resetView);
  
function resetView(e) {
  window.location.reload();
}

// display popups
var popupData = [
  {
    "Year": 1990,
    "Title": "Serbian revocation of Kosovo's independent status",
    "Text": "The Serbian revocation of Kosovo s independent status displaced 350,000 Kosovar Albanians from Kosovo to Western Europe between 1989 and 1998.",
    "Country": "Serbia",
    "lat": 44.1534121,
    "lng": 20.55144
  },
  {
    "Year": 1990,
    "Title": "Secessionist fighting in Georgia",
    "Text": "Secessionist fighting in Georgia displaced 320,000 Georgians from Abkhazia and Ossetia to Georgia and Russia between 1989 and 1993.",
    "Country": "Georgia",
    "lat": 42.46319056,
    "lng": 43.03436698
  },
  {
    "Year": 1990,
    "Title": "Fighting between Armenia and Azerbaijan over Nagorno-Karabakh",
    "Text": "The fighting between Armenia and Azerbaijan over Nagorno-Karabakh displaced 800,000 Armenians and Azerbaijanis from Nagorno-Karabakh to Armenia and Azerbaijan in 1990.",
    "Country": "Armenia",
    "lat": 40.7696272,
    "lng": 44.6736646
  },
  {
    "Year": 1990,
    "Title": "Vietnam War",
    "Text": "The Vietnam War displaced 800,000 Vietnamese from Vietnam to Hong Kong, Malaysia, Indonesia and Thailand between 1975 and 1995.",
    "Country": "Vietnam",
    "lat": 15.268433868226193, 
    "lng": 107.98425479536938,
  },
  {
    "Year": 1990,
    "Title": "Civil war in Mozambique",
    "Text": "The civil war in Mozambique displaced 5.7 million Mozambicans internally and to Malawi between 1976 and 1992.",
    "Country": "Mozambique",
    "lat": -19.302233,
    "lng": 34.9144977
  },
  {
    "Year": 1991,
    "Title": "War of independence and subsequent ethnic cleansing in Croatia",
    "Text": "The war of independence and subsequent ethnic cleansing in Croatia displaced 550,000 Serbs and Croats, both internally and to neighboring countries in 1991.",
    "Country": "Crotia",
    "lat": 45.5643442,
    "lng": 17.0118954
  },
  {
    "Year": 1991,
    "Title": "Chechnya declares independence",
    "Text": "The declaration of independence displaced 150,000 non-Chechens from Chechnya to other parts of the Russian Federation in 1991.",
    "Country": "Chechnya",
    "lat": 45.9321672,
    "lng": 43.05291188
  },
  {
    "Year": 1991,
    "Title": "Iraqi suppression of rebel movement",
    "Text": "The Iraqi suppression of a rebel movement displaced 1.82 million Iraqis and Kurds from Iraq to other parts of Iraq, Turkey and Iran in 1991.",
    "Country": "Iraq",
    "lat": 43.26344567,
    "lng": 32.56794014
  },
  {
    "Year": 1991,
    "Title": "Persecution by government of Burma",
    "Text": "The Burmese expulsion displaced up to 250,000 people from Rohingya from Burma to Bangladesh.",
    "Country": "Burma",
    "lat": 22.56237653,
    "lng": 96.06871107
  },
  {
    "Year": 1991,
    "Title": "Somali Civil War",
    "Text": "A conflict that began in 1991, the Somali civil war has ravaged the Horn of Africa ever since. The civil war began as an armed resistance to the Siad Barre regime, which grew into a much larger conflict between various competing factions after the overthrow of Barre.",
    "Country": "Somalia",
    "lat": 8.3676771,
    "lng": 49.083416
  },
  {
    "Year": 1992,
    "Title": "Civil war in Tajikistan",
    "Text": "The civil war in Tajikistan displaced 600,000 Tajiks, Russians and Uzbeks from Tajikistan to neighboring countries in 1992.",
    "Country": "Tajikistan",
    "lat": 38.930788,
    "lng": 70.784079
  },
  {
    "Year": 1994,
    "Title": "Russian suppression of Chechen independence movement",
    "Text": "The Russian suppression of the Chechen independence movement displaced 250,000 Chechens from Chechnya to Ingushetia, Dagestan and North Ossetia in 1994.",
    "Country": "Russia",
    "lat": 63.2116,
    "lng": 98.2539
  },
  {
    "Year": 1994,
    "Title": "Conflict following the breakup of Yugoslavia in Bosnia and Herzegovina",
    "Text": "The conflict following the breakup of Yugoslavia in Bosnia and Herzegovina displaced 2.5 million Muslims and Croats from Bosnia and Herzegovina to Germany, neighboring countries and to Bosnia and Herzegovina.",
    "Country": "Yugoslavia",
    "lat": 44.81369,
    "lng": 20.4328
  },
  {
    "Year": 1994,
    "Title": "Rwandan genocide",
    "Text": "Rwandan genocide displaced 3.5 million Rwandans (2 million refugees and 1.5 million internally displaced) from Rwanda to Zaire, Tanzania, Burundi and Uganda in 1994.",
    "Country": "Rwanda",
    "lat": -1.92709,
    "lng": 29.8555
  },
  {
    "Year": 1998,
    "Title": "NATO airstrikes in response to Serbian oppression of Kosovar Albanians",
    "Text": "NATO airstrikes in response to the Serbian oppression of Kosovar Albanians displaced 800,000 Kosovar Albanians from Kosovo to Albania, Macedonia, Montenegro and Western Europe between 1998 and 1999.",
    "Country": "Serbia",
    "lat": 44.1534121,
    "lng": 20.55144
  },
  {
    "Year": 1999,
    "Title": "More fighting in Chechnya",
    "Text": "Fighting in Chechnya displaced 200,000 Chechens from Chechnya to Ingushetia and Georgia in 1999.",
    "Country": "Chechnya",
    "lat": 43.46894,
    "lng": 45.6163
  },
  {
    "Year": 1999,
    "Title": "Indonesian suppression of East Timor",
    "Text": "Indonesian suppression of East Timor displaced 540,000 East Timor people, half internally and half to West Timor in 1999.",
    "Country": "Indonesia",
    "lat": -2.4833826,
    "lng": 117.8902853
  },
  {
    "Year": 1999,
    "Title": "Venezuelan refugee crisis",
    "Text": "The Venezuelan migration and refugee crisis (also known as the Bolivarian diaspora), the largest recorded refugee crisis in the Americas, refers to the emigration of millions of Venezuelans from their native country during the presidencies of Hugo Ch vez and Nicol s Maduro because of the Bolivarian Revolution.",
    "Country": "Venezuela",
    "lat": 8.16204,
    "lng": -66.6097
  },
  {
    "Year": 2003,
    "Title": "U.S. invasion of Iraq",
    "Text": "The U.S. invasion of Iraq displaced 1.9 million Iraqis from Iraq both internally and to neighboring countries between 2003 and 2015",
    "Country": "Iraq",
    "lat": 33.0955793,
    "lng": 44.1749775
  },
  {
    "Year": 2004,
    "Title": "Indian Ocean Earthquake And Tsunami",
    "Text": "An earthquake with an epicenter off the coast of Indonesia caused a massive tsunami. Over 225,000 people were killed and 1.7 million were displaced as giant waves destroyed entire communities in coastal regions.",
    "Country": "Indonesia",
    "lat": -2.4833826,
    "lng": 117.8902853
  },
  {
    "Year": 2008,
    "Title": "Cyclone Nargis",
    "Text": "According to official figures, 84,500 people were killed and 53,800 went missing during cyclone Nargis in Myanmar. A total of 37 townships were significantly affected by the cyclone. The UN estimates that as many as 2.4 million people were affected.",
    "Country": "Myanmar",
    "lat": 17.1750495,
    "lng": 95.9999652
  },
  {
    "Year": 2010,
    "Title": "Haiti Earthquake",
    "Text": "Around 3 million people were affected by the quake, which destroyed some 105,000 homes and damaged more than 208,000, forcing hundreds of thousands of Haitians into displacement.",
    "Country": "Haiti",
    "lat": 19.1399952,
    "lng": -72.3570972
  },
  {
    "Year": 2011,
    "Title": "War in Syria",
    "Text": "The war in Syria has displaced 12 million Syrians (7.6 million internally and 4.1 million refugees) from Syria to Turkey, Lebanon, Jordan and Western Europe since 2011.",
    "Country": "Syria",
    "lat": 35.16339,
    "lng": 38.8899
  },
  {
    "Year": 2011,
    "Title": "Refugees of the Libyan Civil War",
    "Text": "Refugees of the Libyan Civil War are the people, predominantly Libyans, who fled or were expelled from their homes during the First Libyan Civil War, from within the borders of Libya to the neighbouring states of Tunisia, Egypt and Chad, as well as to European countries across the Mediterranean.",
    "Country": "Libya",
    "lat": 26.4215275,
    "lng": 17.30331995
  },
  {
    "Year": 2011,
    "Title": "Fukushima Daiichi Nuclear Accident",
    "Text": "The Fukushima Daiichi nuclear accident in March 2011, which followed the Great East Japan earthquake and tsunami, displaced more than 150,000 persons as a large amount of radioactive materials were released from crippled reactors into the sea and atmosphere. Four years later, many of these evacuees had remained displaced, unable or hesitant to return home, due to radiological and social consequences caused by the disaster",
    "Country": "Japan",
    "lat": 36.574844,
    "lng": 139.2394179
  },
  {
    "Year": 2011,
    "Title": "East Africa drought",
    "Text": "Higher sea temperatures, linked to climate change, have doubled the likelihood of drought in the Horn of Africa region. Severe droughts in 2011, 2017 and 2019 have repeatedly wiped out crops and livestock. Droughts have left 15 million people in Ethiopia, Kenya and Somalia in need of aid, yet the aid effort is only 35 percent funded. People have been left without the means to put food on their table, and have been forced from their homes. Millions of people are facing acute food and water shortages.",
    "Country": "Somalia",
    "lat": 8.3676771,
    "lng": 49.083416
  },
  {
    "Year": 2013,
    "Title": "South Sudanese civil war",
    "Text": "A rebellion that broke out in 2013 has displaced 2,230,000 people.",
    "Country": "South Sudan",
    "lat": 7.8699431,
    "lng": 29.6667897
  },
  {
    "Year": 2014,
    "Title": "Dry Corridor in Central America",
    "Text": "An El Ni o period, supercharged by the climate crisis, has taken Central America s Dry Corridor into its 6th year of drought. Guatemala, Honduras, El Salvador and Nicaragua are seeing their typical three-month dry seasons extended to six months or more. Most crops have failed, leaving 3.5 million people, many of whom rely on farming for both food and livelihood, in need of humanitarian assistance, and 2.5 million people food insecure.",
    "Country": "Guatemala",
    "lat": 15.6356088,
    "lng": -89.8988087
  },
  {
    "Year": 2015,
    "Title": "Civil conflict in Colombia",
    "Text": "5,841,040 people are internally displaced in 2015 because of a long-running fight between the government and rebel forces.",
    "Country": "Colombia",
    "lat": 2.8894434,
    "lng": -73.783892
  },
  {
    "Year": 2015,
    "Title": "Repression in Burma",
    "Text": "In 2015, 891,000 Burmese people are refugees, internally displaced, or without citizenship entirely because of the military regime's persecution of ethnic minorities, including the Rohingya.",
    "Country": "Burma",
    "lat": 22.56237653,
    "lng": 96.06871107
  },
  {
    "Year": 2015,
    "Title": "Nepal Earthquake",
    "Text": "Two major earthquakes in April and May 2015 and thousands of associated aftershocks took a devastating toll on the already fragile nation of Nepal. They affected almost a third of the country's population of 28.2 million, killed 8,700 people, damaged or destroyed more than 712,000 houses and displaced more than 2.6 million people",
    "Country": "Nepal",
    "lat": 28.1083929,
    "lng": 84.0917139
  },
  {
    "Year": 2018,
    "Title": "South Asia floods",
    "Text": "Over the last year deadly floods and landslides have forced 12 million people from their homes in India, Nepal and Bangladesh. Just 2 years ago exceptionally heavy monsoon rains and intense flooding destroyed, killed, and devastated lives in the same countries. In some places the flooding was the worst for nearly 30 years, a third of Bangladesh was underwater. While some flooding is expected during monsoon season, scientists say the region s monsoon rains are being intensified by rising sea surface temperatures in South Asia.",
    "Country": "India",
    "lat": 22.3511148,
    "lng": 78.6677428
  },
  {
    "Year": 2019,
    "Title": "Cyclones Idai and Kenneth",
    "Text": "In March 2019, Cyclone Idai took the lives of more than 1000 people across Zimbabwe, Malawi and Mozambique in Southern Africa, and it devastated millions more who were left destitute without food or basic services. Lethal landslides took homes and destroyed land, crops and infrastructure. Cyclone Kenneth arrived just six weeks later, sweeping through northern Mozambique, hitting areas where no tropical cyclone has been observed since the satellite era. ",
    "Country": "Zimbabwe",
    "lat": -19.01688,
    "lng": 29.35365016
  },
  {
    "Year": 2019,
    "Title": "Disaster Induced Forced Migration",
    "Text": "In 2019, nearly 2,000 disasters triggered 24.9 million new internal displacements across 140 countries and territories; this is the highest figure recorded since 2012 and three times the number of displacements caused by conflict and violence ",
    "Country": "India",
    "lat": 22.3511148,
    "lng": 78.6677428
  },
  {
    "Year": 2019,
    "Title": "Covid-19 pandemic",
    "Text": "The world is currently facing a crisis of unprecedented proportions.\nThe COVID-19 pandemic and actions taken to contain its spread have\nhad profound socioeconomic impacts on societies.  The pandemic has hit at a time when hunger has been on the rise over four consecutive years, mainly due to conflict, climate-related shocks and economic crises. At the same time, forced displacement has reached record highs.",
    "Country": "Global",
    "lat": 0,
    "lng": 0
  },
  {
    "Year": 2020,
    "Title": "Australian wildfires",
    "Text": "The start of 2020 found Australia in the midst of its worst-ever bushfire season    following on from its hottest year on record which had left soil and fuels exceptionally dry. The fires have burned through more than 10 million hectares, killed at least 28 people, razed entire communities to the ground, taken the homes of thousands of families, and left millions of people affected by a hazardous smoke haze. More than a billion native animals have been killed, and some species and ecosystems may never recover.",
    "Country": "Australia",
    "lat": -24.7761086,
    "lng": 134.755
  },
  {
    "Year": 2020,
    "Title": "Increasing trend",
    "Text": "In the first half of 2020 alone, disasters displaced 9.8 million people and remained the leading trigger of new internal displacements globally",
    "Country": "Philippines ",
    "lat": 12.7503486,
    "lng": 122.7312101
  }
];

var activePopups = [];
var popupEventsDiv = document.getElementById("popup-events");
function displayPopup(year) {
  // remove the data layers
  clearPopups();

  let previousYear =  year - 5;

  // get the active data
  let data = popupData.filter(entry => entry.Year == year);

  console.log(data);

  data.map(entry => {
    let popupContent = "<div class='popup-content'>"+
    "<div class='popup-title'>" + entry.Title+ "</div>"+
    "<div class='description'>" +
    "<div class='d-flex'><strong>Year: </strong>" + entry.Year + "</div>"+
    "<div class='d-flex'><strong>Country: </strong>" + entry.Country + "</div>"+
      entry.Text + 
    "</div>"+
    "</div>";

    let popup = new mapboxgl.Popup({ focusAfterOpen:false, anchor:'top' })
      .setHTML(popupContent);

    // prevent the event from traversing to the parent element
    popup.on("open", function(e) {
      e.stropPropagation();
    });
    
    let divMarker = document.createElement("div");
    divMarker.classList.add("div-marker");
    divMarker.innerHTML = "<img src='images/flag.png' alt='"+ entry.Country+"' height='30px' width='25px'/>"

    let marker = new mapboxgl.Marker({element:divMarker})
      .setLngLat([entry.lng, entry.lat])
      .setPopup(popup)
      .addTo(map);
    
      activePopups.push(marker);
  });

  // update the popup events
  data.forEach(entry => {
    let content = "<div class='popup-event'>"+
    "<div class='title'>" + entry.Title+ "</div>"+
    "<div class='description'>" +
    "<div class='d-flex'><strong>Year: </strong>" + entry.Year + "</div>"+
    "<div class='d-flex'><strong>Country: </strong>" + entry.Country + "</div>"+
      entry.Text + 
    "</div>"+
    "</div>";

    popupEventsDiv.innerHTML += content;
  });

}

function clearPopups() {
  activePopups.forEach(popup => popup.remove());
  popupEventsDiv.innerHTML = "";
}

displayPopup(filterObject.activeYear);

// Animation interval
var animationInteval;
var index = 0;
var animateTime = d3.range(0, 30, 1).map(function(d) {
  if(d == 30) return new Date(2019, 1, 1);

  return new Date(1990 + d, 1, 1);
});

function animateSlider() {
  animationInteval = setInterval(function(e) {
    console.log(index);

    let value = animateTime[index];
    sliderTime.value(value);
    index++;

    if(index >= 30) {
      // cancelIntervalAnimation();  
      window.location.reload();  
      index = 0;
      sliderValue.value(new Date(1990, 1, 1));
    }
    
  }, 15000);
}


function cancelIntervalAnimation() {
  clearInterval(animationInteval);
}

var playButton = document.getElementById("play-btn");
playButton.addEventListener("click", function(e) {
  playOrPause();
});

var isAnimating = true;
function playOrPause() {
  // play or paue the animation

  if(isAnimating) {
    isAnimating = !isAnimating;
    cancelIntervalAnimation();

    // change the inner content
    playButton.innerHTML = '<i class="fa fa-play"></i>';
  } else {
    isAnimating = true;
    animateSlider();

    playButton.innerHTML = '<i class="fa fa-pause"></i>';
  }

}

window.addEventListener("resize", function(e) {
  console.log("Resizing");

  filterActiveLayerByYear(filterObject.activeYear);
});