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

      filterActiveLayerByYear(year);
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 400)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

function filterActiveLayerByYear(year) {
  xflows = orign_destionation[year];
  xflows = getYearFlows(xflows);

  xtofromarr = getXToFromArrary(xflows);
  xstartarr = getStartArray(xtofromarr);
  xendarr = getStartArray(xtofromarr);
  xspeedarr = getStartArray(xtofromarr);
  cntarr = getCountArrar(xflows);

  countryData = createCountryJson(xflows, countryCoordinates);

  // cancelAnimationFrame(requestAnim);
  //  d3.select("#renderer-container").classed("hidden", true);
  svg.classed("hidden", true);

  loadCircleMarker(countryData);
  console.log("Migration for year: " + year);

  updatecities();

  setTimeout(() => {
    svg.classed("hidden", false);

    // if(container.classList.contains("d-none")) {
    //   container.classList.remove("d-none");
    //   selected = "0";
    //   clicked = "0";
    // }
  }, 500);

  // // update the particle system
  // var [startarr, endarr] = reprojectArray();
  // var [startarr, endarr, speedarr] = negy(startarr, endarr, xspeedarr);
  // mnum = startarr.length;
  // cnttotal = getCountTotal(cntarr);

  // createParticleSystem();

  // requestAnimationFrame(update);
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

  console.log("Filtering");
  console.log(filterObject);

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
      ddd = originFeature;
      selected = origin;  
      clicked = origin;
      clickedCentroid = origin;
      selected = origin;
    }
    

    // hide the animation tab
    container.classList.add("d-none");
    // cancelAnimationFrame(requestAnim);
}

d3.select("#reset-view")
  .on("click", resetView);
  
function resetView(e) {
  window.location.reload();
}