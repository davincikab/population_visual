var WIDTH = 1368, HEIGHT=700;

var VIEW_ANGLE = 90,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 1000;

var container = document.getElementById("renderer-container");
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.Camera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene = new THREE.Scene();

var newzpos = Math.pow(1.0717735,4);

camera.position.z = 425; //newzpos;
renderer.setSize(WIDTH, HEIGHT);
container.append(renderer.domElement);


// setup d3 svg
var svg = d3.select("#point-map").attr("height",HEIGHT).attr("width",WIDTH).style("pointer-events","none");
var g = svg.append("g");

// var projectiona = d3.geo.miller()
//         .scale(180)
//         .translate([WIDTH / 2, HEIGHT / 2])
//         .precision(.1);


// var projectionp = d3.geo.miller()
//         .scale(180)
//         .translate([0, 0])
//         .precision(.1);

var pathpt = d3.geoPath()
    .projection(d3.geoTransform({point: projectPoint}))
    .pointRadius(function(d) { 
        // console.log(d);
        let path = Math.max(Math.min(Math.sqrt(parseInt(d.properties.osm_id))/90, 36),3)*Math.sqrt(newzpos); 
        // console.log(path);

        return path || 0;
    });

function projectPoint(lon, lat) {
    var point = map.project(new mapboxgl.LngLat(lon, lat));
    this.stream.point(point.x, point.y);
}


var projectionr = d3.geoMercator()
        .scale(163)
        .translate([0, 0])
        .precision(.1);

var centroids;
var centroidLabels;

d3.json('data/centroid.geojson')
    .then(data => {
        console.log(data);

        g.selectAll('pathcbsa')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'feature')
        .style('pointer-events', "all")
        .style('cursor', 'pointer')
        .style('fill', function(d) {
            if (parseInt(d.properties.osm_id) < 100000) { 
                return "rgba(180,20,20,1)";
            }

            return "rgba(20,20,180,1)";
        })
        .attr('d', pathpt)
        .style('opacity', 0.9)
        .style("stroke-width",0.5)
        .style("stroke","rgb(240,240,240)")
        .on("click", function(d) { click(d); })
        .on("mouseover",function(d) {showPopover.call(this, d);})
        .on("mouseout",function (d) {removePopovers(d);});

        map.on("click", mouseout);

        map.on("viewreset", updatecities);

        map.on("movestart", function(e){
            svg.classed("hidden", true);
            removePopovers();
            d3.select("#renderer-container").classed("hidden", true);
        });

        map.on("rotate", function(){
            svg.classed("hidden", true);
            d3.select("#renderer-container").classed("hidden", true);
        });

        map.on("moveend", function(){
            updatecities();
            svg.classed("hidden", false);
            d3.select("#renderer-container").classed("hidden", false);
        });


    });

function updatecities() {

}

function mouseout() {

}

function click(d) {
    console.log("click");
    console.log(d);

    // add a popup window
}

function showPopover(obj, d) {

}

function removePopovers(d) {

}