mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/daudi97/ckn046q8i0s4q17pbybv7566b', // style URL
    center: [0,0], // starting position [lng, lat]
    zoom: 1,// starting zoom
    maxZoom:4.5
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');
map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

map.on("load", function(e) {
    map.addSource('countries',{
        "type":"geojson",
        "data":"data/country_data.geojson"
    });

    map.addLayer({
        'id':'country-data',
        'source':'countries',
        'type':'fill',
        'paint':{
            'fill-color':[
                'interpolate',
                ['linear'],
                ['get', 'value'],
                10,
                '#ccece6',
                20,
                '#99d8c9',
                30,
                '#66c2a4',
                40,
                '#2ca25f',
                50,
                '#2ca25f'  
            ],
            'fill-opacity':0.7
        }
    });


    map.on("click", function(e) {
        
    })

    // animateSlider();
});

function resetMapView() {
    map.setCenter([0,0]);
    map.setZoom(1);

}