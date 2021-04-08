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

      filterActiveLayerByYear(year);
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 600)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

// animate slider
d3.select('#play').on('click', () => {
  // update the slider values
});

d3.select('#pause').on('click', () => {

});

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

// update the year values
d3.select('#from-year')
  .on("change", val => {
    console.log(val);

    // update the filter Object
    filterObject.dateRange = [val.target.value, filterObject.dateRange[1]];
  })
  .selectAll('option')
  .data(dataTime)
  .enter()
  .append('option')
  .attr('value', function (d) { return d3.timeFormat('%Y')(d) })
  .text(function(d) { return d3.timeFormat('%Y')(d)})

d3.select('#to-year')
  .on("change", val => {
    console.log(val.target.value);

    // update the filter Object
    filterObject.dateRange = [filterObject.dateRange[0], val.target.value];
  })
  .selectAll('option')
  .data(dataTime)
  .enter()
  .append('option')
  .attr('value', function (d) { return d3.timeFormat('%Y')(d) })
  .text(function(d) { 
    return d3.timeFormat('%Y')(d)
  });


function filterByDateRange() {

}

// gender
d3.select("#gender")
  .on("change", e =>  {
    // get the gender value
    console.log(e.target.value);
    filterObject.gender = e.target.value;

    activeFilter = "gender";

    container.classList.add("d-none");
    updateCentroidsByGender();
    updatecities();
  });

// economic zone
d3.select("#economic-zone")
  .on("change", e =>  {
    // get the gender value
    console.log(e.target.value)
    filterObject.economicZone = e.target.value;

    container.classList.add("d-none");
  });

// region
d3.select("#region")
  .on("change", e =>  {
    // get the gender value
    console.log(e.target.value)
    filterObject.region = e.target.value;

    activeFilter = "region";

    container.classList.add("d-none");

    updateCentroidsByRegion();
    updatecities();
  });

// age - groups
d3.select("#age-group")
  .on("change", e =>  {
    // get the gender value
    console.log(e.target.value)
    filterObject.age = e.target.value;
    activeFilter = "age-group";

    container.classList.add("d-none");
    updateCentroidsByAgeGroup();
    updatecities();
  })
  .selectAll("option")
  .data(age_groups)
  .enter()
  .append("option")
  .attr('value', function(d) { return d})
  .text(function(d) { return d});

// search Origin and destionation
var suggestions = document.getElementById("suggestions");
var originInput = document.getElementById("from");
var destinationInput = document.getElementById("to");

// addEventListener
originInput.addEventListener("input", function(e) {
  let value = e.target.value;
  let results = filterCountries(value);
  updateListGroup(results, originInput);
});

destinationInput.addEventListener("input", function(e) {
  let value = e.target.value;
  let results = filterCountries(value);
  updateListGroup(results, destinationInput);
});

// filter the list of coutries
function filterCountries(value) {
  let result = countries.filter(country => country.toLowerCase().includes(value.toLowerCase()));

  // console.log(result);
  return result.length > 10 ? result.slice(0,10) : result;
}

function updateListGroup(results, element) {
  var docFrag = document.createDocumentFragment();
  // create an list group items
  results.forEach(country => {
    let item = createListGroupItem(country, element);
    docFrag.append(item);
  });

  suggestions.innerHTML = "";
  suggestions.append(docFrag);
}

function createListGroupItem(country, element) {
  let lisItem = document.createElement("li");
  lisItem.classList.add("list-group-item");
  lisItem.innerHTML = country;

  lisItem.addEventListener("click",  function(e) {
      element.value = country;
      suggestions.innerHTML = "";

      element == originInput ? filterObject.origin = country : filterObject.destination = country;

      if(filterObject.origin && filterObject.destination) {
        migrationByOrgnAndDest();
      }
  });

  return lisItem;
}


// filter the migrations between the two countries
function migrationByOrgnAndDest() {
  clicked = "0";
  clickedcbsa = 0;
  selected = "0";

  var { origin, destination} = filterObject;
  let originFeature = countryData.find(country => country.properties.country == origin);

  // update the cities
  updatecities();

  // get the xflows data
  tempflows = xflows[origin];

  // work on the 
  countryCentroids
    .filter( function(d) {
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


function updateCentroidsByAgeGroup() {
  // get the active age group
  let activeAgeGroup = filterObject.age;

  // get the value for the given age group 
  let ageGroupData = {};

  age.forEach(entry => {
    // console.log(entry);

    let value = entry[activeAgeGroup].toString().replaceAll(",", "");

    ageGroupData[entry.country] = {
      abs:parseInt(value, 10),
      net:parseInt(value, 10),
      country:entry.country
    };

  });

  console.log(ageGroupData);

  // enrich the data with coordinates
  countryData = [];

  countryCoordinates.forEach(entry => {
    let flows = ageGroupData[entry.country]

    if(flows) {
      let feature = {
        "type":'Feature',
        "geometry":{
            "type":"Point",
            "coordinates":[entry.xcoord, entry.ycoord]
        },
        "properties":{
            "country":entry.country,
            "net":flows.net,
            "abs":Math.abs(flows.net),
            "x":entry.xcoord,
            "y":entry.ycoord
        }
      };

      countryData.push(feature);
    }
  });

  console.log(countryData);
  loadCircleMarker(countryData);

}

function updateCentroidsByGender() {
  //get the gender
  let { activeYear, gender } = filterObject;

  // get the gender data
  let genderData = globalTotal[gender];
  console.log(genderData);

  // get the data for the given year
  let dataObj = {};

  genderData.forEach(data => {
    let value = data[activeYear].toString().replaceAll(",", "");

    console.log(value);

    dataObj[data.country] = {
      country:data.country,
      net:parseInt(value, 10),
      abs:parseInt(value, 10)
    }

  });

  // enrich the data with coordinates
  countryData = [];
  countryCoordinates.forEach(entry => {
    let flows = dataObj[entry.country]

    if(flows) {
      let feature = {
        "type":'Feature',
        "geometry":{
            "type":"Point",
            "coordinates":[entry.xcoord, entry.ycoord]
        },
        "properties":{
            "country":entry.country,
            "net":flows.net,
            "abs":Math.abs(flows.net),
            "x":entry.xcoord,
            "y":entry.ycoord
        }
      };

      countryData.push(feature);
    }
  });

  console.log(countryData);
  loadCircleMarker(countryData);

}

function updateCentroidsByRegion() {
  let { activeYear, region } = filterObject;
  var data = globalTotal.total

  // get the data for the given year
  data = data.filter(entry => entry.region == region);
  console.log(data);

  let dataObj = {};

  data.forEach(entry => {
    let value = entry[activeYear].toString().replaceAll(",", "");
    dataObj[entry.country] = {
      country:entry.country,
      net:parseInt(value, 10),
      abs:parseInt(value, 10)
    }

  });

  countryData = [];
  countryCoordinates.forEach(entry => {
    let flows = dataObj[entry.country]

    if(flows) {
      let feature = {
        "type":'Feature',
        "geometry":{
            "type":"Point",
            "coordinates":[entry.xcoord, entry.ycoord]
        },
        "properties":{
            "country":entry.country,
            "net":flows.net,
            "abs":Math.abs(flows.net),
            "x":entry.xcoord,
            "y":entry.ycoord
        }
      };

      countryData.push(feature);
    }
  });
  
  console.log(countryData);
  loadCircleMarker(countryData);

  // update the 
}

function visualizeByEconomicZones() {

}

function visualizeByDevelopment() {
  
}

function updateParticleSystem() {

}

d3.select("#reset-view")
  .on("click", resetView);
  
function resetView(e) {
  window.location.reload();
}