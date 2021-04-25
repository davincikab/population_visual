var 
    articles, 
    incidents, 
    articleMarkers = countries = []

var vesselTypes = ['Container Ship', 'Ro-Ro/Vehicles Carrier, Reefer', 'Aggregates Carrier', 'Cement Carrier', 
'Ore Carrier', 'Livestock Carrier', 'OBO Carrier', 'Heavy Load Carrier', 'Barge', 'Inland Cargo', 'Special Cargo', 'Other Cargo'];

var vesselFamily = [
    {'Cargo Vessels':[
        'Container Ship', 'Ro-Ro/Vehicles Carrier, Reefer', 'Aggregates Carrier', 'Cement Carrier', 
        'Ore Carrier', 'Livestock Carrier', 'OBO Carrier', 'Heavy Load Carrier', 'Barge', 'Inland Cargo', 'Special Cargo', 'Other Cargo'
    ]},
    {'Tankers':[]},
    {'Passenger Vessel':[]},
    {'High Speed Craft':[]},
    {'Tugs and Special Craft':[]},
    {'Fishing':[]},
    {'Pleasure Craft':[]},
    {'Navigation Aids':[]},
    {'Unspecified Ship':[]}
];

var incidentDetailTab = document.getElementById("incident-detail-tab");
var closeIncidentDetailTab = document.getElementById("close-detail-tab");

closeIncidentDetailTab.onclick = function(e) {
    incidentDetailTab.classList.remove('open');
};

var overviewSection = document.getElementById("overview");
var descriptionSection = document.getElementById("description-section");
var analysisSection = document.getElementById("analysis-section");

var headerItem = document.querySelectorAll(".header-item");
let activeItem = document.querySelector(".header-item.active");;
let activeSection = overviewSection;

headerItem.forEach(item => {
    item.addEventListener("click", function(e) {
        hideTabs();

        let { dataset: { href }} = e.target;

        this.classList.add('active');
        activeItem = this;

        // toggle the hidden section
        let element = document.getElementById(href);
        element.classList.remove('d-none');

        activeSection = element;
    });
});

function setActiveTab() {

}

function hideTabs() {
    activeSection.classList.add("d-none");
    activeItem.classList.remove("active");

    // headerItem.forEach(item => {
    //     if(item != activeItem) {
    //         item.classList.remove('active');
    //     }
    // });
}


var listingDiv = document.getElementById("listing-div");
var mapWrapperContainer = document.getElementById("container");

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/daudi97/ckmx138900dzb17p6ycnl8zh4',
    // style:'mapbox://styles/mapbox/dark-v10',
    center: [-7.594081153831553, 14.730749011074153], // master center
    zoom: 2, // master zoom
    attribution:false,
    customAttribution:'M.A.R.E'
});

// navigation control
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

// full screen control
var fullScreenControl = new mapboxgl.FullscreenControl();
 
// era boundary
var eraBoundary = {
    "type": "FeatureCollection",
    "name": "era",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type":"Feature", "geometry": { "type":"LineString", "coordinates":[[-2.00, 4.75], [-2.00, 4.00], [6.4167, -0.1833], [8.7000, -0.6333]]}}
    ]
};

var hraBoundary = {
    "type": "FeatureCollection",
    "name": "hra",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type":"Feature", "geometry": { "type":"LineString", "coordinates":[[39.1846, -5.0000],[50.0000, -5.0000], [55.0000, 0.0000], [60.000, 10.0000], [60.0000, 14.000],[55.24378, 17.36304]]}},
    ]
};

var jwcBoundary = {
    "type": "FeatureCollection",
    "name": "era",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type":"Feature", "geometry": { "type":"LineString", "coordinates":[[0.3371, 5.7785], [3.0000, -0.6667], [8.7000, -0.6667]]}},
        { "type":"Feature", "geometry": { "type":"LineString", "coordinates":[[58.000, 15.000], [65.0000, 15.000], [65.0000, -12.000], [58.0000, -12.000], [58.000, 15.000] ]}}
    ]
};

// map load event
map.on("load", function(e) {
    map.on("click", console.log);
      // load icons

      // heatmap
    map.addSource('incidents', {
      "type":"geojson",
      "data":{
         "type":"FeatureCollection",
         "features":[]
      }
    });

    map.addLayer({
      "id":"incidents",
      "source":"incidents",
      "type":"heatmap",
      "paint":{
         "heatmap-weight":{
            'property': 'dbh',
            'type': 'exponential',
            'stops': [
                [1, 0],
                [62, 1]
            ]
         },
         'heatmap-intensity': {
            stops: [
                [11, 1],
                [15, 3]
            ]
         },
         'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(238, 113, 104, 0)',
            0.2, 'rgba(238, 113, 104, 0.435)',
            0.8, 'rgba(238, 113, 104, 0.855)'
         ],
      },
      "layout":{
         "visibility":"visible"
      }
    });

    map.addSource('eez-boundary', {
        "type":"geojson",
        "data":{"type":"FeatureCollection", "features":[]}
    });

    map.addLayer({
        "id":'eez-boundary',
        "source":'eez-boundary',
        "type":"line",
        "paint":{
            "line-color":"#d3e289",
            "line-width":1
        },
        "layout":{
            "visibility":"none"
        }
    });
    
    map.addSource('archipelagic-waters', {
        "type":"vector",
        "tiles":[
            "https://api.maptiler.com/tiles/2247e606-b06c-43d6-add1-acbf612f9cf9/{z}/{x}/{y}.pbf?key=09dkW2PJtwi6Jm9iA0yx"
        ],
        'minzoom': 0,
        'maxzoom': 6
    });

    map.addLayer({
        "id":'archipelagic-waters',
        "source":'archipelagic-waters',
        "source-layer":"archepelagic_waters",
        "type":"fill",
        "paint":{
            "fill-color":"#dd3",
            'fill-opacity':0.7
        },
        "layout":{
            "visibility":"none"
        }
    });

    // map.addSource('eez-24nm', {
    //     "type":"vector",
    //     "url":"mapbox://bldgit13.eez-24nm"
    // });

    // map.addLayer({
    //     "id":'eez-24nm',
    //     "source":'eez-24nm',
    //     "source-layer":"eez-24nm",
    //     "type":"fill",
    //     "paint":{
    //         "fill-color":"#ff7f00",
    //     },
    //     "layout":{
    //         "visibility":"none"
    //     }
    // });

    // map.addSource('eez-12nm', {
    //     "type":"vector",
    //     "url":"mapbox://bldgit13.eez-12nm"
    // });

    // map.addLayer({
    //     "id":'eez-12nm',
    //     "source":'eez-12nm',
    //     "source-layer":"eez-12nm",
    //     "type":"fill",
    //     "paint":{
    //         "fill-color":"#984ea3",
    //     },
    //     "layout":{
    //         "visibility":"none"
    //     }
    // });

    // // IHO Waters
    // map.addSource('iho-seas', {
    //     "type":"vector",
    //     "url":"mapbox://bldgit13.iho-seas"
    // });

    // map.addLayer({
    //     "id":'iho-seas',
    //     "source":'iho-seas',
    //     "source-layer":"iho-seas",
    //     "type":"fill",
    //     "paint":{
    //         "fill-color":"#2facd6",
    //     },
    //     "layout":{
    //         "visibility":"none"
    //     }
    // });

    // // internal Waters
    // map.addSource('internal-waters', {
    //     "type":"vector",
    //     "url":"mapbox://bldgit13.internal-waters"
    // });

    // map.addLayer({
    //     "id":'internal-waters',
    //     "source":'internal-waters',
    //     "source-layer":"internal-waters",
    //     "type":"fill",
    //     "paint":{
    //         "fill-color":"#5964d6",
    //     },
    //     "layout":{
    //         "visibility":"none"
    //     }
    // });

    // JWC Boundary
    map.addSource("jwc-boundary", {
        "data":jwcBoundary,
        "type":"geojson"
    });

    map.addLayer({
        "id":"jwc-boundary",
        "source":"jwc-boundary",
        "type":"line",
        "paint":{
            "line-color":"blue",
            "line-width":1
        },
        "layout":{
            "visibility":"none"
        }
    });

    // HRA Boundary
    map.addSource("hra-boundary", {
        "data":hraBoundary,
        "type":"geojson"
    });

    map.addLayer({
        "id":"hra-boundary",
        "source":"hra-boundary",
        "type":"line",
        "paint":{
            "line-color":"brown",
            "line-width":1
        },
        "layout":{
            "visibility":"none"
        }
    });

    // ERA BOUNDARY
    map.addSource("era-boundary", {
        "data":eraBoundary,
        "type":"geojson"
    });

    map.addLayer({
        "id":"era-boundary",
        "source":"era-boundary",
        "type":"line",
        "paint":{
            "line-color":"yellow",
            "line-width":1
        },
        "layout":{
            "visibility":"none"
        }
    });

      // load articles data
    let ARTICLE_URL = "https://staging-praesidiumintl.kinsta.cloud/wp-json/jet-cct/mare/?_orderby=_ID&_order=desc&_ordertype=integer";
    fetch(ARTICLE_URL)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        articles = data;
        createCategoryMarkers(data); 

        // sort the data by cc_created
        data = data.sort((a, b) => new Date(a.cct_created) < new Date(b.cct_created));

        // Incidents in the past week
        let oneWeekInMs = 1000 * 60 * 60 * 24 * 7;
        let filterDate = new Date(new Date() - oneWeekInMs);

        incidents = data.filter(article => new Date(article.cct_created) > filterDate);
        let incidentCount = document.getElementById("incident-count");
        incidentCount.innerHTML = "Incidents: "  + incidents.length;
        createAlertListing(incidents);

        // create an object with country name and count
        let country = data.map(article => article.country).sort();
        country = country.reduce((a, b) => {
            let cntries = country.filter(cntry => cntry == b);

            if(a.find(cnt => cnt.name == b)){
                // a = a;
            } else {
                let obj = {
                    name:b,
                    count:cntries.length
                };

                a = [...a, obj];
            }

            return a;
            
        }, []).sort((a, b) => b.name - a.name);

        // create a set
        countries = [...new Set(country.map(cntry => cntry.name))];
        renderCountryFilter(countries);
        
       
        // incidents
        var incidentGeojson = createGeojson(data);
        map.getSource('incidents').setData(incidentGeojson);
    })
    .catch(error => {
        console.error(error);
    });

    // fetch era boundary
    fetch("https://davincikab.github.io/marine_incidences/eez_boundary.pbf")
    .then(data => data.arrayBuffer())
    .then(response => {
        // convert the data from geobuf to geojson
        console.log(response);
        var buffer = geobuf.decode(new Pbf(response));

        console.log(buffer);
        map.getSource("eez-boundary").setData(buffer);
    })
    .catch(error => {
        console.error(error);
    });
    
});

   // markers
function createCategoryMarkers(data) {
      data.forEach(item => {
        createMarker(item);
      });
}

function createMarker(item) {
    // popup html content
    let popupContent = getPopupContent(item);

    // popup content
    var popup = new mapboxgl.Popup({focusAfterOpen:false, closeOnMove:false, closeOnClick:false})
      .setMaxWidth('350px')
      .setHTML(popupContent);
    
    // popup events
    popup.on("open", function(e) {
        // make it draggable
        console.log(e);

        dragElement(e.target._container, e.target._content, e.target._tip);
        addListenerToPopup();
    });

    // get icon
    let icon = getCategorizeMarker(item.category);
    var markerIcon = document.createElement("div");

    markerIcon.addEventListener("mouseover", function(e) {
        markerIcon.style.height = "10px";
        markerIcon.style.width = "10px";

        markerIcon.classList.add("active-marker");
    });

    markerIcon.addEventListener("mouseout", function(e) {
        markerIcon.style.height = "5px";
        markerIcon.style.width = "5px";

        markerIcon.classList.remove("active-marker")
    });

    markerIcon.addEventListener("click", function(e) {
        markerIcon.classList.add("active-marker");
    });


    markerIcon.style.backgroundColor = item.bg_color;

    markerIcon.classList.add("div-marker");
      // markerIcon.classList.add(icon);

    // check the lat and lng
    if(!parseFloat(item._lng.trim()) || !parseFloat(item._lat.trim())) {
        return;
    }

    let lat = parseFloat(item._lat.trim());
    let lng = parseFloat(item._lng.trim());

    if(lat > 90 || lat < -90 || lng > 180 || lng < -180) {
        return;
    }

    // custom markers
    var marker  = new mapboxgl.Marker({element:markerIcon})
      .setLngLat([parseFloat(item._lng.trim()), parseFloat(item._lat.trim())])
      .setPopup(popup)
      .addTo(map);

      articleMarkers.push(marker);
}

function getPopupContent(item) {
    let date = new Date(item.date).toDateString();
    let [dayName, monthName, dayDate, year] = date.split(" ");

    let color = item.bg_color == "#ffffff" ? "black" : "white";
    // background-image: linear-gradient( 45deg, #ddd5d5d9, transparent);
    //         background-blend-mode: darken;

    return "<div class='popup-content'>"+
    "<div class='popup-header' style='background-image: linear-gradient(45deg, #ddd5d5d9, transparent); background-blend-mode:darken; background-color:"+ item.bg_color + "; color:"+ color +";'>" + item.category + "</div>"+
    // "<img src='"+ item.photo +"' alt='" + item.title + "' class='popup-img' />" +
    "<div class='article-info'>" +
        "<div class='article-title'>" + item.country + "// " + item.vessel_name +" - " + item.closest_landmark+  "</div>" +
        "<div><i class='fa fa-clock-o'></i> " + dayDate +" "+ monthName  + " " + year + " - " + item.ship_type +"</div>"+
        "<p class='item-toggle' data-id='"+ item._ID +"'>"+
            "<span data-id='"+ item._ID +"' data-href='overview'>Overview  | </span> "+
            "<span data-id='"+ item._ID +"' data-href='description-section'>Event Description  | </span>"+
            "<span data-id='"+ item._ID +"' data-href='analysis-section'>Analysis and Additional Information</span></p>"+
    "</div>" +
 "</div>";
}

function addListenerToPopup() {
    let items = document.querySelectorAll("p span");
    items.forEach(item => {
        item.onclick = function(e) {
            // get the item id
            incidentDetailTab.classList.add('open');
            let { id, href } = e.target.dataset;

            // udpate the active section
            let section = document.querySelector(".header-item[data-href="+ href +"]");
            console.log(section);
            section.click();

            // update the side tab sections
            displayItemInfo(id);
        }
    });
}

function displayItemInfo(itemId) {
    let item = articles.find(article => article._ID == itemId);

    // update with the 
    // update the respective section
    let utcDate = new Date(item.date).toUTCString();

    let photo = item.photo_illustration ? "<img src='" + item.photo_illustration +"' alt=''/>" :"";
    
    overviewSection.innerHTML = item.overview + "<div class='overview-content'>" +
        "<div class='d-flex'>"+
            "<div><img src='https://lilamiaou.github.io/maritime_tracking/Icon/warning.png' /> Type of Alert:</div>" + 
            "<div>" + item.category + "</div>" +
        "</div>" +
        "<div class='d-flex'>"+
            "<div><img src='https://lilamiaou.github.io/maritime_tracking/Icon/planet-earth.png' /></i> Date:</div>" + 
            "<div>" + item.country + "</div>" +
        "</div>" +
        "<div class='d-flex'>"+
            "<div><img src='https://lilamiaou.github.io/maritime_tracking/Icon/calendar.png' /> Date:</div>" + 
            "<div>" + utcDate + "</div>" +
        "</div>" +
        "<div class='d-flex'>"+
            "<div><img src='https://lilamiaou.github.io/maritime_tracking/Icon/map.png' /></i> Coordinates:</div>" + 
            "<div>" + item.geo_code + "</div>" +
        "</div>" +
        "<div class='d-flex'>"+
            "<div><img src='https://lilamiaou.github.io/maritime_tracking/Icon/landmark.png' /> Closest Landmark:</div>" + 
            "<div>" + item.closest_landmark + "</div>" +
        "</div>" +
        "<div class='d-flex'>"+
            "<div><img src='https://lilamiaou.github.io/maritime_tracking/Icon/vessel.png' /> Vessel Type:</div>" + 
            "<div>" + item.ship_type + "</div>" +
        "</div>" +
        "<div>"+  photo +"</div>"+
        "</div>";

    // console.log("Overview");

    descriptionSection.innerHTML = item.event_description;
    analysisSection.innerHTML = item.analysis;
}

function getUTC() {

}

function createAlertListing(alerts) {
    var docFrag = document.createDocumentFragment();

    // get listing Item
    alerts.forEach(alert => {
        let item = createAlertListItem(alert);
        docFrag.append(item);
    });

    // update the listing div
    listingDiv.innerHTML = "";
    listingDiv.append(docFrag);
}

function createAlertListItem(alert) {
    var listItem = document.createElement("div");
    listItem.classList.add("list-item");

    // add alert list id
    listItem.setAttribute("data-ID", alert._ID);

    // add text content
    listItem.innerHTML += "<span class='dot' style='background-color:"+ alert.bg_color+"'></span>";
    listItem.innerHTML += alert.country + " " + alert.title;

    // add interactivity
    listItem.addEventListener("click", function(e) {
        // stop event propagation to the map
        e.stopPropagation();

        // get id attribute
        let alertId = this.getAttribute("data-ID");
        zoomToAlert(alertId);
    });

    return listItem;
}


function zoomToAlert(alertId) {
    // find the alert with the given id
    let activeAlert = articles.find(article => article._ID == alertId);

    if(activeAlert) {
        let center = [activeAlert._lng, activeAlert._lat];

        // flyTo the alert
        map.flyTo({
            center:center,
            zoom:8
        });
        
        map.once("zoomend", function(e) {
            // load a popup
            new mapboxgl.Popup({focusAfterOpen:false})
                .setHTML(getPopupContent(activeAlert))
                .setMaxWidth("350px")
                .setLngLat(center)
                .addTo(map);
        });
        
    }
}

// marker types
function getCategorizeMarker(category) {
    let markerType;
    switch(category) {
    case 'Piracy Attack':
        markerType = "icon-one"
        break;
    case 'Sea Robbery':
        markerType = "icon-two"
        break;
    case 'Suspicious':
        markerType = "icon-three"
        break;
    default:
        markerType = "icon-three"
        break;
    };

    return markerType;
}

function clearMarkers() {
    articleMarkers.forEach(marker => marker.remove());
}

function createGeojson(data) {
    let fc = {"type":"FeatureCollection", "features":[]};
      
    data.forEach(item => {
    let feature = {
         "type":"Feature",
         "geometry":{
         "type":"Point",
         "coordinates":[item._lng, item._lat]
         },
         "properties":{...item}
      };

      fc.features.push(feature);
      })

      return fc;
}


   // date filter
   var fromDate = document.getElementById("from-date");
   var toDate = document.getElementById("to-date");

   var dateFilter = {from:"", to:""};

   fromDate.addEventListener("change", function(e) {
      console.log(e);
      dateFilter.from = e.target.value;
   });

   toDate.addEventListener("change", function(e) {
      console.log(e);
      dateFilter.to = e.target.value;
   });

   var applyFilter = document.getElementById("apply-filter");
   var clearFilter = document.getElementById("clear-filter");

   applyFilter.addEventListener("click", function(e) {
      // check if we have both from and to dates
      if(dateFilter.from && dateFilter.to) {
      // filter the data
      var filteredArticles = articles.filter(article => {
         let articleDate = new Date(article.date);
         let { from, to } = dateFilter;

         if(new Date(from) < articleDate && new Date(to) > articleDate) {
             return article;
         }
      });

      // update the markers
      clearMarkers();
      createCategoryMarkers(filteredArticles);


      console.log(filteredArticles);
      }
   });

   clearFilter.addEventListener("click", function(e) {
      // reset date input fields
      dateFilter.from = fromDate.value = "";
      dateFilter.to = toDate.value = "";

   });

   // open and close filter tab
   var openVesselTab = document.getElementById("open-vessel-tab");
   var closeVesselTab = document.getElementById("close-vessel-tab");
   var vesselTab = document.getElementById("vessel-tab");

   closeVesselTab.addEventListener("click", function(e) {
    //   vesselTab.style.display = "none";
      vesselTab.style.right = "-300px";
   });

   openVesselTab.addEventListener("click", function(e) {
       closeFilterTab();
      vesselTab.style.display = "block";
      vesselTab.style.right = "57px";
   });


var activeVesselType = [];
var vesselElement = document.getElementById("vessels");
var toggleAllVesselsCheckbox = document.getElementById("vessel-all");
var vesselFamily = [
    {
        name:'Cargo Vessels',
        value:[
        'Container Ship', 'Ro-Ro/Vehicles Carrier, Reefer', 'Aggregates Carrier', 'Cement Carrier', 
        'Ore Carrier', 'Livestock Carrier', 'OBO Carrier', 'Heavy Load Carrier', 'Barge', 'Inland Cargo', 'Special Cargo', 'Other Cargo'
        ]
    },
    {
        name:'Tankers',
        value:["Tanker", "Oil Products Tanker", "Crude Oil Tanker", "Oil/Chemical Tanker", "Chemical Tanker", "LPG Tanker", "LNG Tanker", "Bunkering Tanker", "Asphalt/Bitumen Tanker", "Water Tanker", "Inland Tanker", "Special Tanker", "Other Tanker"]
    },
    {
        name:'Passenger Vessel',
        value:["Passenger Ship", "Ro-Ro/Passenger Ship", "Inland Passenger Ship", "Passenger/Cargo Ship", "Special Passenger Vessel", "Other Passenger Ship"]
    },
    {
        name:'High Speed Craft',
        value:[]
    },
    {
        name:'Tugs and Special Craft',
        value:[]
    },
    {
        name:'Fishing',
        value:[]
    },
    {
        name:'Pleasure Craft',
        value:[]
    },
    {
        name:'Navigation Aids',
        value:[]
    },
    {
        name:'Unspecified Ship',
        value:[]
    }
]; 

toggleAllVesselsCheckbox.onclick = function(e) {
   // select all the checkboxes 
   let checkboxes = document.querySelectorAll("#vessels input[type=checkbox]")  
    if(e.target.checked) {
        // check all the parent and children 
        checkboxes.forEach(checkbox => checkbox.checked = true);

        // populate the activeVesselTypes
        activeVesselType = [...new Set(articles.map(a => a.ship_type))];
        // activeVesselType = vesselFamily.reduce((a, b) => {
        //     a = [...a, ...b.value];

        //     return a;
        // }, []);

        filterAlertsByVesselType(activeVesselType);
    } else {
        checkboxes.forEach(checkbox => checkbox.checked = false);
        activeVesselType = [];

        filterAlertsByVesselType(activeVesselType);

    }
}



vesselFamily.forEach(family => {
    // collapse toggle
    var collapseContainer = document.createElement("div");

    let id = family.name.toLowerCase().split(" ").join("-");

    let element = `<div class="toggle-collapse" data-href="${id}">
            <div>
                <input type="checkbox" name="${family.name}" id="${family.name}" class="vessel-family" data-id=${id} checked>
                <label>${family.name}</label>
            </div>
            <span class="caret"><i class='fa fa-caret-down'></i></span>
        </div>`;

    collapseContainer.innerHTML += element;

    // create a toggleble div element
    let familyDiv = document.createElement("div");
    familyDiv.classList.add("collapse");
    familyDiv.classList.add("close");
    familyDiv.setAttribute("id", id);

    // add vessels elements
    let vesselTypes = family.value;
    vesselTypes.forEach(vessel => {
        // create a form group
        let element = `<div class="form-group">
            <input type="checkbox" name="${vessel}" id="${vessel}" class="vessel-type" checked>
               <label for="${vessel}">${vessel}</label>
        </div>`;
       
        familyDiv.innerHTML += element; 
    });

    collapseContainer.append(familyDiv);

    // 
    vesselElement.append(collapseContainer);

});

// toggle the collapse section
var collapseToggler = document.querySelectorAll(".toggle-collapse");
collapseToggler.forEach( toggler => {
    toggler.addEventListener("click", function(e) {
        let activeToggler = e.target;

        // e.stopPropagation();
        console.log(e);
        if(e.target != this) {
            return;
        }

        let dataId = activeToggler.dataset.href;
        console.log(activeToggler.children);

        let caretElement = activeToggler.children[1];

        // get the collapse element
        let activeCollapse = document.getElementById(dataId);
        let height = window.getComputedStyle(activeCollapse).getPropertyValue("height");

        // console.log();
        // get element height
        if(height == "0px") {
            // close any other collapse
            closeAllCollapse();

            activeCollapse.classList.remove("close");

            let height = activeCollapse.scrollHeight;
            activeCollapse.style.height = height + "px";  

            caretElement.innerHTML = "<i class='fa fa-caret-up'></i>";
        } else {
            console.log("Closing");
            activeCollapse.style.height = 0 + "px";  

            // update caret
            caretElement.innerHTML = "<i class='fa fa-caret-down'></i>";
        }

        
    });
});

function closeAllCollapse() {
    document.querySelectorAll(".collapse").forEach(collapse => {
        collapse.style.height = 0 + "px";  

        // change the caret to 
        let carets = document.querySelectorAll(".caret");
        carets.forEach(caret => {
            caret.innerHTML = "<i class='fa fa-caret-down'></i>";
        });
    });
}

// veseel types
var vesselFamilyCheckbox = document.querySelectorAll(".vessel-family");
vesselFamilyCheckbox.forEach(vessel => {
    vessel.addEventListener("change", function(e) {
        e.stopPropagation();

        let { checked, name, dataset:{ id }} = e.target;
        
        let checkboxes = document.querySelectorAll("#" + id + " .vessel-type");

        // get the filter values
        let family = vesselFamily.find(vFamily => vFamily.name == name);

        if(family){
            if(checked) {
                activeVesselType = [...activeVesselType, ...family.value];
                    checkboxes.forEach(checkbox => checkbox.checked = true);
            } else {
                // filter the 
                activeVesselType = activeVesselType.filter(vessel => {
                    if(family.value.indexOf(vessel) == -1) {
                        return vessel;
                    }

                    return false;
                });

                // check all active vessel checkbox
                checkboxes.forEach(checkbox => checkbox.checked = false);
                console.log(activeVesselType);
            }
        }
        
        filterAlertsByVesselType(activeVesselType);
    })
});

var vesselTypeCheckbox = document.querySelectorAll(".vessel-type");
vesselTypeCheckbox.forEach(vessel => {
    vessel.addEventListener("change", function(e) {
        let { checked, name} = e.target;
          
        if(checked) {
            activeVesselType.push(name);
        } else {
            activeVesselType = activeVesselType.filter(vessel => vessel != name);
        }
        
        filterAlertsByVesselType(activeVesselType);   
    });
});

function filterAlertsByVesselType(activeVesselType) {
    // filter
    // let vessels = activeVesselType.map(activeVessel => {
    //     let articleFilter = articles.filter(article => article.ship_type.includes(activeVessel));

    //     return articleFilter;
    // }).reduce((a, b) => [...a, ...b], []);
    let vessels = articles.filter(article => activeVesselType.indexOf(article.ship_type) != -1);

    console.log(vessels);

    clearMarkers();
    createCategoryMarkers(vessels);
}

// open and close layer tab
var openLayerTab = document.getElementById("open-layer-tab");
var closeLayerTab = document.getElementById("close-layer-tab");
var layerTab = document.getElementById("layer-tab");

closeLayerTab.addEventListener("click", function(e) {
    // layerTab.style.display = "none";
    layerTab.style.right = "-300px";
    removeActiveClass();
});

openLayerTab.addEventListener("click", function(e) {
    console.log("Home coming");
    closeFilterTab();

    // layerTab.style.display = "block";
    layerTab.style.right = "57px";
    this.classList.add('active');
});

// countries tab

// incident tab
var incidentsType = [
    {name:'Sea Robbery', bg_color:"#ffff00"},
    {name: 'Piracy Attack', bg_color:"#7030a0"}, 
    {name:'Piracy Kidnap / Hijack', bg_color:"#ff0000"},
    // {name: 'Criminality Robbery', bg_color:"#ffffff"}, 
    {name: 'Criminality', bg_color:"#ffffff"},
    // {name: 'Criminality Kidnap', bg_color:"#ffffff"}, 
    {name: 'Activism', bg_color:"#833c0b"},
    {name: 'Smuggling / Trafficking', bg_color:"#806000"},
    {name: 'IUU Fishing', bg_color:"#959595"}, 
    {name: 'Storewaways', bg_color:"#00b050"},
    {name: 'Suspicious', bg_color:"#92d050"},
    {name: 'Militancy', bg_color:"#000000"},
    // {name:"Militancy IED / WIED / Seamines", bg_color:"#000000"},
    // {name: 'Militancy Assault', bg_color:"#000000"}, 
    // {name: 'Militancy Kidnap', bg_color:"#000000"}, 
    // {name: 'Militancy Sabotage', bg_color:"#000000"}, 
    // {name: 'Law Enforcement Drill', bg_color:"#00b0f0"},
    // {name: 'Law Enforcement Operation', bg_color:"#00b0f0"}, 
    {name: 'Law Enforcement', bg_color:"#00b0f0"}, 
    {name: 'Others', bg_color:"#ffc000"}
];

var activeIncidentType = [];
var incidencesElement = document.getElementById("incidences");
var toggleAllIncidentType = document.getElementById("incident-all");
toggleAllIncidentType.onclick = function(e) {
    var incidentTypeCheckbox = document.querySelectorAll(".incident-type");
    if(e.target.checked) {
       // check all the types 
        incidentTypeCheckbox.forEach( incidentCheckbox => {
            incidentCheckbox.checked = true;
        });

        // update the incident type 
        activeIncidentType = [...new Set(articles.map(article => article.category))];

        // update the display
        filterByTypeAndUpdate(activeIncidentType);
    } else {
        activeIncidentType = [];

        // toggle the checkbox
        incidentTypeCheckbox.forEach( incidentCheckbox => {
            incidentCheckbox.checked = false;
        });

        // update the display
        filterByTypeAndUpdate(activeIncidentType);
    }
}
// var incidentTypeCheckbox = document.querySelectorAll("incident-type");

incidentsType.forEach(incident => {
    // create a form group
    let element = `<div class="form-group">
        <input type="checkbox" name="${incident.name}" id="${incident.name}" class="incident-type" checked>
        <span class="dot" style="background-color:${incident.bg_color}"></span>
        <label for="${incident.name}">${incident.name}</label>
    </div>`;

    incidencesElement.innerHTML += element;
    
});

var incidentTypeCheckbox = document.querySelectorAll(".incident-type");

incidentTypeCheckbox.forEach( incident => {
    incident.addEventListener("change", function(e) {
       let { checked, name} = e.target;
       
       if(checked) {
            activeIncidentType.push(name);
       } else {
            activeIncidentType = activeIncidentType.filter(incident => incident != name);
       }

        

    });
});

function filterByTypeAndUpdate(activeIncidentType) {
    // filter
    // let incidents = activeIncidentType.map(activeIncident => {
    //     let articleFilter = articles.filter(article => article.category.includes(activeIncident));

    //     return articleFilter;
    // }).reduce((a, b) => [...a, ...b], []);

    let incidents = articles.filter(article => activeIncidentType.indexOf(article.category) !=-1);
    console.log(incidents);
   
    clearMarkers();
    createCategoryMarkers(incidents);
}

var incidentTab = document.getElementById("incident-tab");
var openIncidentTab = document.getElementById("open-incident-tab");
var closeIncidentTab = document.getElementById("close-incident-tab")

openIncidentTab.addEventListener("click", function(e) {
    console.log("Home coming");

    closeFilterTab();
    // incidentTab.style.display = "block";
    incidentTab.style.right = "57px";
    this.classList.add('active');
});

closeIncidentTab.addEventListener("click", function(e) {
    console.log("Home coming");
    // incidentTab.style.display = "none";
    incidentTab.style.right = "-300px";
    this.classList.add('active');
});


var incidentSelectDate = document.getElementById("alert-date");
var incidentCount = document.getElementById("incident-count");
var toggleIncidents = document.getElementById("show-incidents");

incidentSelectDate.addEventListener("change", function(e) {
    let value = e.target.value;
    value = parseInt(value, 10);

    let valueInMs = 1000 * 60 * 60 * 24 * value;
    var filterDate = new Date(new Date() - valueInMs);

    // call the filter function
    incidents = articles.filter(article => new Date(article.cct_created) > filterDate);
    listingDiv.innerHTML = "";
    incidentCount.innerHTML = "Incidents: " + incidents.length;

    // reset the toggler
    toggleIncidents.checked = false;

    createAlertListing(incidents);

});

toggleIncidents.addEventListener("change", function(e) {
    let { checked } = e.target;

    if(checked) {
        // display the incidents
        clearMarkers();
        createCategoryMarkers(incidents);
    } else {
        clearMarkers();
        createCategoryMarkers(articles);
    }
});

// date tab and incident tab
var dateTab = document.getElementById("date-tab");
var openDateTab = document.getElementById("open-date-filter");
var closeDateTab = document.getElementById("close-date-tab");

openDateTab.addEventListener("click", function(e) {
    console.log("Home coming");

    closeFilterTab();
    dateTab.style.right = "57px";
    this.classList.add('active');
});

closeDateTab.addEventListener("click", function(e) {
    console.log("Home coming");

    dateTab.style.right = "-300px";
    this.classList.add('active');
});

// last alerts filter
var alertsTab = document.getElementById("alerts-tab");
var openAlertsTab = document.getElementById("open-alerts-tab");
var closeAlertsTab = document.getElementById("close-alerts-tab")

openAlertsTab.addEventListener("click", function(e) {
    console.log("Home coming");

    closeFilterTab();
    alertsTab.style.right = "57px";
    this.classList.add('active');
});

closeAlertsTab.addEventListener("click", function(e) {
    console.log("Home coming");

    alertsTab.style.right = "-300px";
    this.classList.add('active');
});

// country filter
var countryTab = document.getElementById("country-tab");
var openCountryTab = document.getElementById("open-country-tab");
var closeCountryTab = document.getElementById("close-country-tab")

openCountryTab.addEventListener("click", function(e) {
    console.log("Home coming");

    closeFilterTab();
    countryTab.style.right = "57px";
    this.classList.add('active');
});

closeCountryTab.addEventListener("click", function(e) {
    console.log("Home coming");

    countryTab.style.right = "-300px";
    this.classList.add('active');
});

var activeCountries = [];
var toggleCountriesCheckbox = document.getElementById('country-all');
toggleCountriesCheckbox.onclick = function(e) {
    let countryFilters = document.querySelectorAll(".country-filter");
    if(e.target.checked) {
        activeCountries = [...countries];

       // check all the checkboxes
       countryFilters.forEach(countryFilter => {
           countryFilter.checked = true;
       });
       // update the map view
        filterByCountryAndUpdate(activeCountries);
    } else {
        activeCountries = [];
        countryFilters.forEach(countryFilter => {
            countryFilter.checked = false;
        });

        filterByCountryAndUpdate(activeCountries);
    }
}

function renderCountryFilter(countries) {
    let countryDiv = document.getElementById("countries");
    // create form group
    countries.forEach(country => {
        let element = `<div class="form-group">
            <input type="checkbox" name="${country}" id="${country}" class="country-filter" checked>
            <label for="${country}">${country}</label>
        </div>`;

        countryDiv.innerHTML += element;
    });

    let countryFilters = document.querySelectorAll(".country-filter");

    countryFilters.forEach(countryFilter => {
        countryFilter.addEventListener("change", function(e) {
            let { name, checked } = e.target;

            if(checked) {
                activeCountries.push(name);
            } else {
                activeCountries = activeCountries.filter(incident => incident != name);
            }

            filterByCountryAndUpdate(activeCountries);
        });
    });


}

function filterByCountryAndUpdate(activeCountries) {
    // filter
    let countryIncidence = articles.filter(article => activeCountries.indexOf(article.country) != -1);
    console.log(countryIncidence);

    clearMarkers();
    createCategoryMarkers(countryIncidence);
}

// toggle layers
var layersCheckbox = document.querySelectorAll(".form-group input[type=checkbox]");
layersCheckbox.forEach(layer => {
      layer.addEventListener("input", function(e) {
      let name = e.target.name;
      let value = e.target.value;
      let checked = e.target.checked;

    // update the form group
    let parentElement = layer.parentElement;
    addActiveClass(parentElement);

    // if(checked) {
    //     parentElement.classList.add('active'); 
    // } else { 
    //     parentElement.classList.remove('active');
    // }

    // update the layout property
    if(name == 'articles') {
         !checked ? clearMarkers() : createCategoryMarkers(articles);
    } else {
         var visibility = checked ? 'visible' : 'none';
         map.getSource(name) ? map.setLayoutProperty(name, 'visibility', visibility) : false;
      }
    });
});

// toggle attribution tab
var closeAttributionButton = document.getElementById("close-info-tab");
var openAttributionButton = document.getElementById("open-info-tab");
var attributionTab = document.getElementById("info-tab");

closeAttributionButton.addEventListener("click", function(e) {
    attributionTab.style.right = "-300px";
});

openAttributionButton.addEventListener("click", function(e) {
    closeFilterTab();
    attributionTab.style.right = "57px";
});


// refresh the map
var refreshButton = document.getElementById("refresh-map");
refreshButton.addEventListener("click", function(e) {
    console.log("Reloading");
    window.location.reload();
});


// full screen view
var fullScreenButton = document.getElementById("full-screen-mode");
fullScreenButton.addEventListener("click", function(e) {
    if(document.fullscreenEnabled) {
        if(document.fullscreenElement) {
            document.exitFullscreen();
        }  else {
            mapWrapperContainer.requestFullscreen();
        }
    }
});

// toggle sidebar
// var sideBar = document.getElementById("side-tab");
// var openSideTab = document.getElementById("open-side-tab");
// var closeSideTab = document.getElementById("close-side-tab");

// openSideTab.addEventListener("click", function(e) {
//     console.log("Opening");
//     sideBar.style.display = "block";
// });

// closeSideTab.addEventListener("click", function(e) {
//     sideBar.style.display = "none";
// });


// Toggle filter item
var filterItems = document.querySelectorAll(".filter-item");
function removeActiveClass() {
    filterItems.forEach(item => item.classList.remove('active'));
}

filterItems.forEach(item => {
    item.addEventListener("click", function(e) {
        removeActiveClass();
        addActiveClass(item);
    });
});

function addActiveClass(element) {
    if(element.classList.contains('active')) {
        element.classList.remove('active');
    } else {
        element.classList.add('active');
    }
}

function closeFilterTab() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.style.right = '-300px';
    });
}