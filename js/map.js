// var map = L.map('map', {
//     center:[-0.9870, 3.7840],
//     zoom:2
// });

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/daudi97/ckmx138900dzb17p6ycnl8zh4', // style URL
    center: [-0.9870, 3.7840], // starting position [lng, lat]
    zoom: 2 // starting zoom
});
// 
// var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
//     attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
//     subdomains: 'abcd',
//     maxZoom: 20,
//     minZoom: 0
//  }).addTo(map);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken:'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA'
// });


// // display the countries layer
// var countrBoundaries = L.geoJSON(null, {
//     style:function(feature) {
//         return {
//             fill:'blue',
//             fillOpacity:0.8
//         }
//     }
// }).addTo(map);

// fetch('data/countries.geojson')
//     .then(res => res.json())
//     .then(response => {
//         console.log(response);

//         countrBoundaries.addData(response);
//     })
//     .catch(error => {
//         console.error(error);
//     });

// // fire map events
// map.on("click", function(e) {
//     console.log(e);
// });