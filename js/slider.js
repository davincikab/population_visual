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
      filterObject.activeYear = year

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

d3.select('#play').on('click', () => {

});

function filterActiveLayerByYear(year) {
  xflows = orign_destionation[year];
  xflows = getYearFlows(xflows);

  xtofromarr = getXToFromArrary(xflows);
  xstartarr = getStartArray(xtofromarr);
  xendarr = getStartArray(xtofromarr);
  xspeedarr = getStartArray(xtofromarr);
  
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
  })

// economic zone
d3.select("#economic-zone")
  .on("change", e =>  {
    // get the gender value
    console.log(e.target.value)
    filterObject.economicZone = e.target.value;
  });

// region
d3.select("#region")
  .on("change", e =>  {
    // get the gender value
    console.log(e.target.value)
    filterObject.region = e.target.value;
  });

// age - groups
d3.select("#age-group")
  .on("change", e =>  {
    // get the gender value
    console.log(e.target.value)
    filterObject.age = e.target.value;
  })
  .selectAll("option")
  .data(age_groups)
  .enter()
  .append("option")
  .attr('value', function(d) { return d})
  .text(function(d) { return d});

// search Origin and destionation
