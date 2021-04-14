## Population Map

An interactive map on world population migration

### Tools used
- Mapbox 
- Threejs
- d3js
- Excel 
- QGIS 
- JavaScript

### Mapbox
[Mapbox](https://docs.mapbox.com/) 
Display basemap 

### Threejs
[Threejs](https://threejs.org/)
Work on the particle system to visualize the migration animation.

### D3js
[D3.js](https://d3js.org/)
Interact with the DOM and display proportional Symbol map.

### Excel
[Excel](https://www.microsoft.com/en-ww/microsoft-365/excel)
Data cleaning and Editing

### QGIS
[QGIS](https://qgis.org/)
Enrich the data with coordintes.

### JavaScript
[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
Add interactivity to the web application.


## Instructions on displaying on Laptop
I have hosted the application on your github account. Here is the [link](https://ging-j.github.io/population_map/)

## Instructions on how to use the filters
### Time Slider

The provides filter on migration from different origin and destination for specific year. The default view shows the animation of
migration total on different year and the respective proportional symbol map on the same.

## Origin and Destionation Filter
This filter shows the migration total on the active year between the two countries.

## FullScreen Control
The control Icon on your to left is used to activate fullScreen.

### Refresh tool
Reset the map back to default.


### Sharing the map
The map can be share in two way. One as a link to the hosted map i.e [Map](https://ging-j.github.io/population_map/)
The second method as an IFrame container on another website. 

`html
<iframe src="https://ging-j.github.io/population_map/" height="600" width="1200">
</iframe>
`

### How to show the map and the selection panel on two different screen
The selection panel and the map are part of the same UI, hence they will always appear on the same screen.

### How net migration was calculated
The data provided contains total migration stocks from one destination to another.

### What does each moving yellow dot mean? how many people.
A single dot represent 5000 people travelling from the given origin to various destination

### If the data was changed, how?
This will require data preprocessing to fit the data format required in the application.


### Programs used to create the map.
The programs used have been discussed in a section above.

### Summary of steps
Procedure is as follows:
- Data cleaning: Remove unnecessary columns, rename the column names.
- Data conversion: Convert the data into csv format.
- Data Enrichment: Add the coordinates to the data.
- Data Validation: Validate the enriched data manually using services such as Google Maps
- Data Conversion: Convert the csv file/ shapefile into JSON format for ease of use with JavaScript
- Load the data on the application: Origin/Destionation data, Country Names, Country GeoJSON file.
- Layer Styling: Style the Country GeoJSON file with a green color scheme from [here](https://colorbrewer.com)
- Create a proportional Symbol Map for the Migration Counts for the active year i.e 1990.
- Create the a particle system to simulate the migration process from one country to another
- Work on slider control to select different migration years.
- Add an origin/destination tab to filter the visuals.
- Create a GitHub repository to host the site on a live server to share the project with the world.

