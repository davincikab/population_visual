mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/daudi97/ckn046q8i0s4q17pbybv7566b', // style URL
    center: [0,0], // starting position [lng, lat]
    zoom: 1,// starting zoom
    maxZoom:2.5
});

map.addControl(
    new mapboxgl.NavigationControl({
        showCompass:false
    }), 
    'top-right'
);


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


class RefreshControl {
    static refreshPage() {
        window.location.reload();
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl reset-view';
        this._container.innerHTML = '<i class="fa fa-refresh"></i>';

        this._container.onclick = function(e) {
            RefreshControl.refreshPage();
        }
        
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

map.addControl(new RefreshControl(), 'top-right');



class FullScreenControl {
    static renderFullScreen() {
        // hide the renderer container
        container.classList.add("hidden");

        // get the body
        var body = window.document.querySelector("body");

        if(window.document.fullscreenEnabled) {
            console.log("Enabled");

            if(!window.document.fullscreenElement) {
                 // render the element to full s
                body.requestFullscreen().then(() => {
                    // resetMapView();

                    // WIDTH = document.body.clientWidth, HEIGHT=document.body.clientHeight;
                    // renderer.setSize(WIDTH, HEIGHT, false);
                    // camera.updateProjectionMatrix();

                    // createParticleSystem(startarr); 
                    console.log("Entering Full screen Mode");
                    
                    setTimeout(() => {
                        svg.classed("hidden", false);
                    
                        if(container.classList.contains("hidden")) {
                          container.classList.remove("hidden");
                        }

                        filterActiveLayerByYear(filterObject.activeYear);
                      }, 500);
                });
               

            } else {
                window.document
                    .exitFullscreen()
                    .then(() => {

                        // resetMapView();
                        // WIDTH = document.body.clientWidth, HEIGHT=document.body.clientHeight;
                        // renderer.setSize(WIDTH, HEIGHT, false);
                        // camera.updateProjectionMatrix();

                        // createParticleSystem(startarr);
                        // filterActiveLayerByYear(filterObject.activeYear);
                        console.log("Exit Full screen Mode");

                        setTimeout(() => {
                            svg.classed("hidden", false);
                        
                            if(container.classList.contains("hidden")) {
                              container.classList.remove("hidden");
                            }
    
                            filterActiveLayerByYear(filterObject.activeYear);
                          }, 500);
                    });
                
            }
           
        }
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl reset-view';
        this._container.innerHTML = '<i class="fa fa-arrows-alt"></i>';

        this._container.onclick = function(e) {
            FullScreenControl.renderFullScreen();
        }

        
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

map.addControl(new FullScreenControl(), 'top-right');
function resetMapView() {
    map.setCenter([0,0]);
    map.setZoom(1);

}