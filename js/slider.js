var filterObject = {
  origin:"",
  destination:"",
  activeYear:1990,
  dateRange:[1990, 1990],
  gender:'Male',
  age:"0-4",
  economicZone:"High-income countries",
  region:"Africa"
};

var activeFilter = "";

var dataTime = d3.range(0, 35, 5).map(function(d) {
    if(d == 30) return new Date(2019, 1, 1);

    return new Date(1990 + d, 1, 1);
});

var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365 * 5)
    .width(300)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(1990, 1, 1))
    .on('onchange', val => {
      console.log(val);

      let year = d3.timeFormat('%Y')(val) == 2020 ? 2019 : d3.timeFormat('%Y')(val);
      d3.select('p#value-time').text(year);

      // call the filter function
      filterObject.activeYear = year;

      // filterActiveLayerByYear(year);
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 400)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

// gTime.call(sliderTime);

function filterActiveLayerByYear(year) {
  xflows = orign_destionation[year];
  xflows = getYearFlows(xflows);

  xtofromarr = getXToFromArrary(xflows);
  xstartarr = getStartArray(xtofromarr);
  xendarr = getStartArray(xtofromarr);
  xspeedarr = getStartArray(xtofromarr);
  cntarr = getCountArrar(xflows);

  countryData = createCountryJson(xflows, countryCoordinates);

  cancelAnimationFrame(requestAnim);
  //  d3.select("#renderer-container").classed("hidden", true);
  svg.classed("hidden", true);

  loadCircleMarker(countryData);
  updatecities();

  setTimeout(() => {
    svg.classed("hidden", false);

    if(container.classList.contains("d-none")) {
      container.classList.remove("d-none");
      selected = "0";
      clicked = "0";
    }
  }, 500);

  // update the particle system
  var [startarr, endarr] = reprojectArray();
  var [startarr, endarr, speedarr] = negy(startarr, endarr, xspeedarr);
  mnum = startarr.length;
  cnttotal = getCountTotal(cntarr);

  createParticleSystem();

  requestAnimationFrame(update);
}

// search Origin and destionation
d3.select("#from")
  .on("change", function(e) {
    console.log(e);
    updateOriginDestionation(this, e.target.value);
  })
  .selectAll('option')
  .data(countries)
  .enter()
  .append("option")
  .attr('value', function(d) { return d; })
  .text(function(d){ return d});

d3.select("#to")
  .on("change", function(e) {
    console.log(e);
    updateOriginDestionation(this, e.target.value);
  })
  .selectAll('option')
  .data(countries)
  .enter()
  .append("option")
  .attr('value', function(d) { return d; })
  .text(function(d){ return d; })

function updateOriginDestionation(country, element) {
  element == originInput ? filterObject.origin = country : filterObject.destination = country;
  // migrationByOrgnAndDest();

  // update the the map origin and destination
  // map.getPaintPr
}

// filter the migrations between the two countries
function migrationByOrgnAndDest() {
  clicked = "0";
  clickedcbsa = 0;
  selected = "0";

  var { origin, destination} = filterObject;
  let originFeature;

  if(origin == "all") {
    originFeature = countryData.find(country => country.properties.country == origin);
  } else {
    originFeature = countryData;
  }

  // update the cities
  updatecities();

  // get the xflows data
  tempflows = xflows[origin];

  // work on the 
  countryCentroids
    .filter( function(d) {
        if(origin == "all") { return true; }
        if (d.properties.country == origin) { return false; }
        if (d.properties.country == destination) { return false; }

        return true;
    })
    .transition()
    .style("opacity", 0);

    updatecities();

    console.log(xflows);
    
    // recreate the 
    selected = origin;  
    ddd = originFeature;

    // hide the animation tab
    container.classList.add("d-none");

  cancelAnimationFrame(requestAnim);
}

d3.select("#reset-view")
  .on("click", resetView);
  
function resetView(e) {
  window.location.reload();
}