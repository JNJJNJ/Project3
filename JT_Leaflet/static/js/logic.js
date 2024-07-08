// URL for the GeoJSON UAP data
let url = "../UAP_Data/uap_data_output.geojson";
// https://github.com/JNJJNJ/Project3/blob/main/UAP_Data/uap_data_output.geojson

// Globals 
let dataset = d3.json(url)
let geoLayer
let shape_filter = 'All'
let markerRadius = .1
let shapeColor = '#FFFF00'
let markersOnMap = 10000
let sightingsCount = 0
let sightingSummary = ''
let sightingCity = ''
let sightingState = ''
let sightingOccurred = ''


// Initiate the Leaflet map
let uap_map = L.map("map", {
    // Centered on Kansas City
    center: [39.09, -94.58],
    zoom: 5
});


// Add the tile layer to the map
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});
Stadia_AlidadeSmoothDark.addTo(uap_map);

// Shape list
let shapes = [
    "Changing",
    "Chevron",
    "Cigar",
    "Circle",
    "Cone",
    "Cross",
    "Cube",
    "Cylinder",
    "Diamond",
    "Disk",
    "Egg",
    "Fireball",
    "Flash",
    "Formation",
    "Light",
    "Orb",
    "Other",
    "Oval",
    "Rectangle",
    "Sphere",
    "Star",
    "Teardrop",
    "Triangle"
    ]


// Leaflet Marker Color: 
function shape_color(shape) {
    return shapeColor
}

// Using circle marker
function setMarkers(feature, latlng) {
    return L.circleMarker(latlng, marker_options(feature));
}

// Leaflet Marker Properties
function marker_options(feature) {
    if(markersOnMap < 500){
        markerRadius = 3
    }
    return {
        radius: markerRadius,
        fillColor: shape_color(feature.properties.Shape),
        color: shapeColor,
        weight: .5,
        opacity: .5,
        fillOpacity: .5
    };   
}

// Leaflet onEachFeature: properties 
function each_feature(feature, layer) {
    let sight_date = new Date(feature.properties.Occurred);
    sight_date = (sight_date.getMonth()+1) + '/' + sight_date.getDate() + '/' + sight_date.getFullYear(); 
    
    // update globals here
    sightingsCount += 1 
    sightingSummary = feature.properties.Summary
    sightingCity = feature.properties.City
    sightingState = feature.properties.State
    sightingOccurred = feature.properties.Occurred

    // add popup
    layer.bindPopup(
        "<h3>Date: " + sight_date + "</h3>" +
        "<h4> UAP Shape: " + feature.properties.Shape + "</h4>" +
        "<b>Lat:</b> " + feature.geometry.coordinates[0] +
        "<br /><b>Lon:</b> " + feature.geometry.coordinates[1] +
        "<br /><b>Summary:</b> " + feature.properties.Summary
    );

}

// Retrieve and add the sighting data to the map
dataset.then(function (data) {
    geoLayer = L.geoJson(data, {
        pointToLayer: setMarkers,
        // Feature data popup
        onEachFeature: each_feature,
        // Shape and Date filters
        filter: filterMap
    }).addTo(uap_map);

    // Update sighting info
    sightingInfo()
 });

 // Filter to shape
 function setShape(shape){
    shape_filter = shape
    unFilterMap()
 }

 // Filter to date
 function setDate(){
    unFilterMap()
 }

 // Display Sighting Info Card
 function sightingInfo(){
    let sightInfo = d3.select("#SightingHeader");
    sightInfo.html('Sighting Info: ' + shape_filter + '<br />')
    sightInfo = d3.select("#sample-metadata");
    sightInfo.html('<b>Number of sightings:</b> ' + sightingsCount + '<br />' +
        '<b>Last Date:</b> ' + sightingOccurred + '<br />' + 
        '<b>Last Location:</b> ' + sightingCity + ', ' + sightingState + '<br />' + 
        '<b>Last Summary:</b> ' + sightingSummary + '<br />'
    )
 }

 // Run user filter
 function filterMap (feature, layer){
    fDate = new Date(feature.properties.Occurred)
    fYear = fDate.getFullYear()
    t = document.getElementById("yearValue").innerHTML.text
    slider = document.getElementById("slidecontainer");
    if (shape_filter == 'All' && fYear <= slider.value) {
        markerRadius = 1
        shapeColor = '#FFFF00'
        markersOnMap += 1
        return true
    }else if (feature.properties.Shape == shape_filter && fYear <= slider.value){
        markerRadius = 3
        shapeColor = '#FF0000'
        markersOnMap += 1
        return true
    }else {
        return false
    }
 }


 // Reload map with filters
 function unFilterMap (feature, layer){
    geoLayer.remove()
    markersOnMap = 0
    sightingsCount = 0
    sightingOccurred = ''
    sightingCity = ''
    sightingState = ''
    sightingSummary = ''
    dataset.then(function (data) {

       geoLayer = L.geoJson(data, {
            pointToLayer: setMarkers,
            // Feature data popup
            onEachFeature: each_feature,
            // Shape and Date filters
            filter: filterMap
        }).addTo(uap_map) 

        // Update sighting info
        sightingInfo()
    });
    
 }

 // Populate the shape filter
 let dropdownMenu = d3.select("#selDataset");
 dropdownMenu.append("option").text("All").property("value");
 for (x in shapes){
    dropdownMenu.append("option").text(shapes[x]).property("value");
 } 



