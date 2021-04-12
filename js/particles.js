var WIDTH = 1368, HEIGHT=850;
var selected = "0";
var cnttotal = 0;
var selected = "0";
var addoffset = "0";
var ddd;
var clicked = "0";
var clickedCentroid = 0;
var tempflows;
var popup;
var activeYear = 1990;
var requestAnim;

var particleSystem;
var xflows = orign_destionation[filterObject.activeYear];
xflows = getYearFlows(xflows);

console.log(xflows);

var xtofromarr = getXToFromArrary(xflows);
var xstartarr = getStartArray(xtofromarr);
var xendarr = getEndArray(xtofromarr);
var xspeedarr = getSpeedArray(xtofromarr);
var cntarr = getCountArrar(xflows);

var maxage = 500;

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

// particle system
function getCountTotal(cntarr) {
    let sum = 0;
    for (var j = 0; j < cntarr.length; j++) {
        sum = sum + Math.round(cntarr[j]);
    }

    return sum;
}

cnttotal = getCountTotal(cntarr);

// create the particle variables
var particleCount = cnttotal,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            //color: 0xFFDD00,
            size: 3,
            map: THREE.ImageUtils.loadTexture(
                    "images/yellowball.png"
            ),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

var startarr = [[104,170],[-104,-170],[-104,-170],[-104,-170]];
var endarr = [[10,10],[120,80],[130,190],[130,190]];

var speedarr = [[1,0],[1.9,0],[0,4],[0,4]];

// setup d3 svg
var svg = d3.select("#point-map").attr("height",HEIGHT).attr("width",WIDTH).style("pointer-events","none");
var g;

var projectionr = d3.geoMercator()
        .scale(163)
        .translate([0,0])
        .precision(0.1)

var pathpt = d3.geoPath()
    .projection(d3.geoTransform({point: projectPoint}))
    .pointRadius(function(d) { 
        let path = Math.max(Math.min(Math.sqrt(d.properties.abs) / 200, 36), 3) * Math.sqrt(newzpos); 
        // console.log(path);

        return path || 0;
    });

// reproject start arrar
function reprojectArray() {
    var startarr = xstartarr
    // .map(projectionr);
    var endarr = xendarr
    // .map(projectionr);

    for (var l = 0; l < xstartarr.length; l++) {

        var temppt = map.project(new mapboxgl.LngLat(xstartarr[l][0], xstartarr[l][1]));
        var temppt2 = map.project(new mapboxgl.LngLat(xendarr[l][0], xendarr[l][1]));


        startarr[l][0] = temppt.x - WIDTH/2;
        startarr[l][1] = temppt.y - HEIGHT/2;

        endarr[l][0] = temppt2.x - WIDTH/2;
        endarr[l][1] = temppt2.y - HEIGHT/2;
    }

    return [ startarr, endarr ];

}

var [startarr, endarr] = reprojectArray();

// var startarr = xstartarr.map(projectionr);
console.log(speedarr)
var [startarr, endarr, speedarr] = negy(startarr,endarr,xspeedarr);

var mnum = startarr.length;
var xtrans = 0;
var ytrans = 0;

// project points
function projectPoint(lon, lat) {
    var point = map.project(new mapboxgl.LngLat(lon, lat));
    this.stream.point(point.x, point.y);
}


var projectionr = d3.geoMercator()
        .scale(163)
        .translate([0, 0])
        .precision(.1);

var countryCentroids;
var countryData = createCountryJson(xflows, countryCoordinates);
var centroidLabels;

// d3.json('data/centroid.geojson')
//     .then(data => {
//     console.log(data);

function loadCircleMarker(data) {    
    // remove any paths
    svg.select("g").remove();
    g = svg.append("g");

    console.log("Adding path");
    countryCentroids = g.selectAll('pathcbsa')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'feature')
        .style('pointer-events', "all")
        .style('cursor', 'pointer')
        .style('fill', function(d) {
            // if (parseInt(d.properties.net) < 1000) { 
            //     return "rgba(180,20,20,1)";
            // }

            return "rgba(20,20,180,1)";
        })
        .attr('d', pathpt)
        .style('opacity', 0.9)
        .style("stroke-width",0.5)
        .style("stroke","rgb(240,240,240)")
        .on("click", function(d) { 
            console.log(d);

            click(d.target.__data__); 
        })
        .on("mouseover",function(d) { showPopover.call(this, d); })
        .on("mouseout",function (d) { removePopovers(d); });

        centroidLabels = g.append("text").text("").attr("x",20).attr("y",20).style("fill","rgb(220,220,220)").attr("text-anchor","middle").style("pointer-events","none").style("opacity",0).style("font-size","14pt");

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

}

loadCircleMarker(countryData);

// 
function createParticleSystem(startarr) {
    
    if (particleSystem) {
        while(scene.children.length > 0) { 
            scene.removeChild(scene.children[0]); 
        }

        scene = new THREE.Scene();

        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            //color: 0xFFDD00,
            size: 3,
            map: THREE.ImageUtils.loadTexture(
                    "images/yellowball.png"
            ),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        particles.vertices = [];
        scene.removeChild(particleSystem);
        // cancelAnimationFrame(requestAnim);
    }

    var tempcountarr = 0;
    for(var p = 0; p < startarr.length; p++) {
        for(var q = 0; q < cntarr[p]; q++) {

            var startpoint = [startarr[p%mnum][0] + Math.random()*1 - 0.5, startarr[p%mnum][1] + Math.random()*1 - 0.5];


            var pX = startpoint[0] + (maxage*q/cntarr[p])*speedarr[p][0],
                pY = startpoint[1] + (maxage*q/cntarr[p])*speedarr[p][1],
                pZ = 0, //Math.random() * 500 - 250,
                particle = new THREE.Vertex(
                    new THREE.Vector3(pX, pY, pZ)
                );


            particle.velocity = new THREE.Vector3(
                speedarr[p%mnum][0],
                speedarr[p%mnum][1],
                0);	

            particle.startpt = [startpoint[0],startpoint[1]];
            particle.age = Math.round(maxage*q/cntarr[p]);

            particle.from = xtofromarr[p][0];
            particle.to = xtofromarr[p][1];

            particle.ystart = pY;
            particle.xstart = pX;
            particle.agestart = particle.age;

		    particles.vertices.push(particle);
        }
    }


    particleSystem = new THREE.ParticleSystem(
            particles,
            pMaterial);

    particleSystem.sortParticles = true;

    scene.addChild(particleSystem);
}

createParticleSystem(startarr);

// update particles position function
function update() {

    var pCount = particleCount;

    if (selected == "-1") { selected = "-2"; }

    if (addoffset == "-1") { addoffset = "-2"; }

    var k = 0;
    // console.log(particles.vertices);

    while(pCount--) {

        var particle = particles.vertices[pCount];
        // console.log(pCount);

        if(!particle) {
            continue;
        }

        if(particle.age >= maxage) {
            particle.age = 0;

            particle.position.x = particle.startpt[0] + xtrans;
            particle.position.y = particle.startpt[1] + ytrans;

        }

        if (selected == "0") {
            // and the position
            particle.position.addSelf(
                    particle.velocity);


            if (particle.position.x > 600) {                
                particle.position.x = particle.xstart + xtrans;
                particle.position.y = particle.ystart + ytrans;
                particle.age = particle.agestart;
            }

            particle.age++;
        } 
        else if (particle.from == selected || particle.to == selected) {

            if (particle.position.x > 600) {
                particle.position.x = particle.xstart + xtrans;
                particle.position.y = particle.ystart + ytrans;
                particle.age = particle.agestart;
            }

            particle.position.addSelf(
                    particle.velocity);


            particle.age++;

        } else if (selected == "-2") {
            particle.position.x = particle.xstart + xtrans;
            particle.position.y = particle.ystart + ytrans;
            particle.age = particle.agestart;

        } else if (particle.from !== selected && particle.to !== selected) {
            particle.position.x = 700;
            particle.position.y = 380;

        }

        if (addoffset == "-2") {
            if (particle.position.x <= 600) {
                particle.position.x = particle.xstart + xtrans;
                particle.position.y = particle.ystart + ytrans;
                particle.age = particle.agestart;
            }
        }


    }

    if (selected == "-2") { selected = "0"; }

    if (addoffset == "-2") { addoffset = "0"; }

    // flag to the particle system that we've
    // changed its vertices. This is the
    // dirty little secret.
    particleSystem.geometry.__dirtyVertices = true;

    renderer.render(scene, camera);

    // set up the next call
    requestAnim = requestAnimationFrame(update);   
}

requestAnim = requestAnimationFrame(update);


function updatecities() {
    var zoomchg = (map.getZoom() - 1) * 10;
    newzpos = Math.pow(1.0717735, zoomchg);

    if (selected == "0") {
        countryCentroids
            .attr("d", function(d){
                pathpt.pointRadius(Math.max(Math.min(Math.sqrt(d.properties.abs) / 200, 36), 3) * Math.sqrt(newzpos));
                return pathpt(d);
            });

    }
    else {
        console.log("Firing Click"); 
        click(ddd, 1); 
    }


    particleSystem.materials[ 0 ].size = 3 / Math.sqrt(newzpos);

    var centerchg = [[map.getCenter().lng, map.getCenter().lat]].map(projectionr);

    camera.position.z = 425 / newzpos;

    ytrans = centerchg[0][1];
    xtrans = -centerchg[0][0];
    addoffset = "-1";
}

// function mouseout() {
//     clicked = "0";
//     clickedcbsa = 0;

//     selected = "-1";

//     centroidLabels.style("opacity",0);

//     countryCentroids.transition()
//         .attr("d", function(d){

//             pathpt.pointRadius( Math.max(Math.min(Math.sqrt(d.properties.abs) / 90, 36), 3)*Math.sqrt(newzpos) );
//             return pathpt(d);
//         })
//         .style("fill", function (d) {
//             return "rgb(20,20,180)";
//         })
//         .style("opacity", function (d) {
//             console.log(Math.min(d.properties.abs, 1000));
//             return ((Math.min(d.properties.abs, 1000) / 1000) * 0.6 + 0.3);
//         })
//         .style("stroke-width",0.5);
// }

function click(dd, notransition) {
    ddd = dd;
    clicked = dd.properties.country;
    clickedCentroid = dd.properties.country;
    selected = dd.properties.country;

    console.log("click");
    console.log(dd);

    var temppos = map.project(new mapboxgl.LngLat(dd.geometry.coordinates[0], dd.geometry.coordinates[1]));

    centroidLabels.attr("x",temppos.x).attr("y",temppos.y + 50).text(dd.properties.country).style("opacity",0.8);

    tempflows = xflows[dd.properties.country] || {};

    var dur = 500;
    if (notransition == 1) { dur = 0; }
        countryCentroids
            .filter( function(d) {
                // if(d.properties.country == selected) { return false };
                return tempflows[d.properties.country];
            })
            .transition().duration(dur)
            .style("opacity",function(d) {
                if (d.properties.country == dd.properties.country) { return 1; }
                return 0.9;
            })
            .style("stroke-width",function(d) {
                if (d.properties.country == dd.properties.country) { return 2; }
                return 0.5;
            })
            .style("fill", function (d) {
                if (d.properties.country !== dd.properties.country){
                    return "green";
                } else {
                    console.log(d);
                    return "yellow";
                }
            })
            .attr("d", function(d){
                if (d.properties.country !== dd.properties.country) {
                    pathpt.pointRadius( Math.max(Math.min(Math.sqrt(Math.abs(tempflows[d.properties.country])) / 156, 36), 3)*Math.sqrt(newzpos));
                    
                } else {
                    pathpt.pointRadius( Math.max(Math.min(Math.sqrt(Math.abs(tempflows[d.properties.country])) / 200, 36), 3)*Math.sqrt(newzpos) );
                }

                return pathpt(d);
            });


    countryCentroids
        .filter( function(d) {
            if(d.properties.country == selected) { return false };
            if (tempflows[d.properties.country]) { return false; }

            return true;
        })
        .transition()
        .style("opacity", 0);


    removePopovers();
}

function showPopover(e) {
    let d = e.target.__data__;

    popup = new mapboxgl.Popup({ focusAfterOpen:false })
            .setLngLat(d.geometry.coordinates)


    if(clicked == "0" || d.properties.country == clickedCentroid) {
        var popupContent = "<div class='popup-content'>" + 
        "<div class='popup-title'><strong>" + d.properties.country + "</strong></div>" +
        "<div class='description' >Net Migration: " + d3.format(",.2r")(d.properties.net) + "</div>"
        "</div>";

        popup
            .setHTML(popupContent)
            .addTo(map);

    } else if (tempflows[d.properties.country]) {
        var popupContent = "<div class='popup-content'>" + 
        "<div class='popup-title'><strong>" + d.properties.country +" to "+ clicked+"</strong></div>" +
        "<div class='description' >Net Migration: " + d3.format(",.2r")(tempflows[d.properties.country]) + "</div>"
        "</div>";

        popup
            .setHTML(popupContent)
            .addTo(map);
    }
}

function removePopovers(d) {
    popup ? popup.remove() : "";
}

// negate the array 
function negy(coorarry, endarray, diffarry) {

    for (var i=0; i< coorarry.length; i++) {

        coorarry[i][1] = coorarry[i][1] * -1;
        endarray[i][1] = endarray[i][1] * -1;

        diffarry[i][0] = (endarray[i][0] - coorarry[i][0]) / maxage;
        diffarry[i][1] = (endarray[i][1] - coorarry[i][1]) / maxage;
    }

    return [coorarry, endarray, diffarry];
}

function mouseout () {
    console.log("Mouseout");

    clicked = "0";
    clickedcbsa = 0;

    selected = "0";

    centroidLabels.style("opacity",0);

    countryCentroids.transition()
            .attr("d", function(d){

                pathpt.pointRadius( Math.max(Math.min(Math.sqrt(d.properties.abs) / 90,36),2)*Math.sqrt(newzpos) );
                return pathpt(d);
            })
            .style("fill", function (d) {
                // if (d.properties.net < 1000) { return "rgb(180,20,20)";}
                return "rgb(20,20,180)";
            })
            .style("opacity", function (d) {
                return ((Math.min(d.properties.abs, 1000) / 1000) * 0.6 + 0.3);
            })
            .style("stroke-width",0.5);

}

function addoffset () {
    var pCount = particleCount;
    while(pCount--) {
        var particle = particles.vertices[pCount];
        particle.position.x = particle.position.x + xtrans;
        particle.position.y = particle.position.y + ytrans;
    }
}

function getYearFlows(data) {
    // format the data
    let dataObj = {};
    let obj = JSON.parse(JSON.stringify(data[0]));

    delete obj['country'];
    delete obj['Other South'];
    delete obj['Other North'];
    delete obj['Year'];
    delete obj['Total'];

    console.log({...obj});

    data.forEach(object => {
        let newObj = Object.assign({}, object);
        let country = object.country;

        delete newObj['country'];
        delete newObj['Other South'];
        delete newObj['Other North'];
        delete newObj['Year'];
        delete newObj['Total'];

        // filter empty keys
        for (const key in newObj) {
            const value = newObj[key].toString().replaceAll(",", "");

            if(!parseInt(value, 10)) { 
                delete newObj[key];
            } else {
                newObj[key] = parseInt(value, 10);
                console.log(country);

                obj[key] = {...obj[key], [country]:parseInt(value, 10)}
            }
        }

        // add the country totals
        let values = Object.values(newObj);

        let sum = values.length > 1 ? values.reduce((a,b) => a + b) : 0;
        // console.log(sum);

        newObj[object.country] = sum;
        obj[country] = {...obj, [country]:sum };

        // .map((a,b) => a + b);
        dataObj[object.country] = newObj;
    });

    console.log(obj);
    return obj;
}

function getXToFromArrary(data) {
    let arr = [];

    for (const key in data) {
        let country = data[key];

        Object.keys(country).forEach(entry => {
            if(key != entry) {
                arr.push([entry, key]);
            }
            
        });
    }

    return arr;
}

function getStartArray(data) {
    let arr = [];

    // 
    data.forEach(item => {
        let start = item[1];

        // get the coordinates
        let country = countryCoordinates.find(entry => entry.country == start);

        if(country) {
            let coord = [country.xcoord, country.ycoord];

            arr.push(coord);
        } else {
            console.log(start);
        }
         
    });

    return arr;
}

function getEndArray(data) {
    console.log(data);

    let arr = [];
    
    // 
    data.forEach(item => {
        let start = item[0];

        // get the coordinates
        let country = countryCoordinates.find(entry => entry.country == start);
        if(!country) {
            console.log(item);
        }

        if(country) {
            let coord = [country.xcoord, country.ycoord];

            arr.push(coord);
        }
         
    });

    return arr;
}

function getCountArrar(data) {
    let arr = [];

    // let countries = Object.keys(data);
    // countries.forEach(country => {
    //     let entry = data[country];

    //     arr.push(entry[country]);
    // });

    Object.values(data).forEach(entry => {
        // count
        for(let key in entry) {
            let value = entry[key].toString().replaceAll(",", "");

            arr.push(value);
        }
    });

    // console.log(arr);
    // let sorted = [...arr].sort((a, b) => a - b);

    // let max = sorted[sorted.length - 1];
    // let min = sorted[0];

    arr = arr.map(value => {
        return normalizeValue(value);
    });

    return arr;
}

function getSpeedArray(data) {
    let arr = [];
    
    // 
    data.forEach(item => {
        let coord = [0, 0];
        arr.push(coord);
    });

    return arr;
}

function normalizeValue(value) {
    value = value / 5000;
    return value <= 1 ? 1 : Math.round(value);
}


function createCountryJson(xflows, countryCoordinates) {
    let json = [];

    countryCoordinates.forEach(entry => {
        let flows = xflows[entry.country]

        if(flows) {
            // console.log(flows);
            let net = 0;
            let values = flows[entry.country];
            net = values;
            
            // console.log(values);

            if(values[0]) {
                net = values.reduce((a,b) => a + b);
            }
            
            // create a feature
            json.push({
                "type":'Feature',
                "geometry":{
                    "type":"Point",
                    "coordinates":[entry.xcoord, entry.ycoord]
                },
                "properties":{
                    "country":entry.country,
                    "net":net,
                    "abs":Math.abs(net),
                    "x":entry.xcoord,
                    "y":entry.ycoord
                }
            });

        }
    });

    return json;
}


/*
TODO: 
    Update the particles system on change in origin and destination
    Toggle the animation on and off
*/