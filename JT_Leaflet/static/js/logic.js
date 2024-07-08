// URL for the GeoJSON earthquake data - all earthquakes in the past 7 days
let url = "../UAP_Data/uap_data_output.geojson";
// https://github.com/JNJJNJ/Project3/blob/main/UAP_Data/uap_data_output.geojson


let shape_filter = 'All'
let markerRadius = .1
let shapeColor = '#FFFF00'
let markersOnMap = 10000

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
//Leaflet circleMarker: fillColor property - marker color corresponding to earthquake depth
function shape_color(shape) {
    return shapeColor
    switch (true) {
        case shape == 'Changing':
            return "#F08784";
        case shape == 'Chevron':
            return "#EB3324";
        case shape == 'Cigar':
            return "#774342";
        case shape == 'Circle':
            return "#9FFCFD";
        case shape == 'Cone':
            return "#3282F6";
        case shape == 'Cross':
            return "#0023F5";
        case shape == 'Cube':
            return "#16417C";
        case shape == 'Cylinder':
            return "#000C7B";
        case shape == 'Diamond':
            return "#FFFE91";
        case shape == 'Disk':
            return "#FFFD55";
        case shape == 'Egg':
            return "#F09B59";
        case shape == 'Fireball':
            return "#F08650";
        case shape == 'Flash':
            return "#784315";
        case shape == 'Formation':
            return "#817F26";
        case shape == 'Light':
            return "#7E84F7";
        case shape == 'Orb':
            return "#C0C0C0";
        case shape == 'Other':
            return "#7F82BB";
        case shape == 'Oval':
            return "#EA3680";
        case shape == 'Rectangle':
            return "#EA3FF7";
        case shape == 'Sphere':
            return "#75FA8D";
        case shape == 'Star':
            return "#75FA61";
        case shape == 'Teardrop':
            return "#507F80";
        case shape == 'Triangle':
            return "#000000";
        default:
            return "#FFFFFF";
    }
}

function setMarkers(feature, latlng) {
    return L.circleMarker(latlng, marker_options(feature));
}

//Leaflet circleMarker: properties
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
    
    layer.bindPopup(
        "<h3>Date: " + sight_date + "</h3>" +
        "<h4> UAP Shape: " + feature.properties.Shape + "</h4>" +
        "<b>Lat:</b> " + feature.geometry.coordinates[0] +
        "<br /><b>Lon:</b> " + feature.geometry.coordinates[1] +
        "<br /><b>Summary:</b> " + feature.properties.Summary
    );

}

// Legend for map color depth
function make_legend(){
    let legend = L.DomUtil.create("div", "legend"),
        depth = ['Oval', 'Rectangle', 'Sphere', 'Star', 'Teardrop', 'Triangle'];
        legend.innerHTML +=
            '<b>Shapes</b> <br />' +
            '<span style="background:' + shape_color(depth[0]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[0] + '<br />' +
            '<span style="background:' + shape_color(depth[1]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[1] + '<br />' +
            '<span style="background:' + shape_color(depth[2]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[2] + '<br />' +
            '<span style="background:' + shape_color(depth[3]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[3] + '<br />' +
            '<span style="background:' + shape_color(depth[4]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[4] + '<br />' +
            '<span style="background:' + shape_color(depth[5]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[5] + '<br />'

    return legend;
}

// Leaflet layer for the map legend
function add_legend(uap_map){
    let legend = L.control({position: "topright"});
    legend.onAdd = make_legend
    legend.addTo(uap_map)
}

let dataset = d3.json(url)
let geoLayer

// Retrieve and add the sighting data to the map
dataset.then(function (data) {
//d3.json(url).then(function (data) {
    geoLayer = L.geoJson(data, {

        pointToLayer: setMarkers,

        // Feature data popup
        onEachFeature: each_feature,

        filter: filterMap

    }).addTo(uap_map);

    // Add the color legend
    // add_legend(uap_map) 
 });


 function setShape(shape){
    shape_filter = shape
    unFilterMap()
 }

 function setDate(){
    unFilterMap()
 }

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

 let markers 
 function unFilterMap (feature, layer){

    geoLayer.remove()
    markersOnMap = 0
    dataset.then(function (data) {

       geoLayer = L.geoJson(data, {

            pointToLayer: setMarkers,

            // Feature data popup
            onEachFeature: each_feature,


            filter: filterMap
        }).addTo(uap_map) 
    });
    
 }

 let dropdownMenu = d3.select("#selDataset");
 dropdownMenu.append("option").text("All").property("value");
 for (x in shapes){
    dropdownMenu.append("option").text(shapes[x]).property("value");
 } 



