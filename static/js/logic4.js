// Store our API endpoint 
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(quakeURL, function(data) {

  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});

// Add legend 

var legend = L.control({position: 'bottomright'});
  
legend.onAdd = function (myMap){

  var div = L.DomUtil.create('div', 'info legend'),

    colors = ['deepskyblue', 'greenyellow', 'yellow', 'gold', 'orange', 'red'],

    grades = [0,1,2,3,4,5];
    div.innerHTML = '<h3>Magnitude</h3>'
// Loop through our intervals and generate a label with a color square for each interval
  for (var i = 0; i < grades.length; i++){
    div.innerHTML +=
      '<i style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i>' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
 };


// Create function to set color based on earthquake magnitudes

function getColor(c)
{
  x = Math.ceil(c);
  switch (Math.ceil(x)) {
    case 1:
      return "deepskyblue";
    case 2:
      return "greenyellow";
    case 3:
      return "yellow";
    case 4:
      return "gold";
    case 5:
      return "orange";
    default:
      return "red";
  }
}

// Create function to create circular features
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJson(earthquakeData,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: .3,
        fillOpacity: 0.5})
        .bindPopup("<h3>" + "Location: " + feature.properties.place +
          "</h3><hr><p>" + "Date/Time: " + new Date (feature.properties.time) + "<br>" +
          "Magnitude: " + feature.properties.mag + "</p>");
  }
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define base layer
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })
  

  // create base layer
  var baseMaps = {
    "Light": lightmap
  };

  // Create overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [40.75, -100.87],
    zoom: 6,
    layers: [lightmap, earthquakes]
  });
    

//   Create layer control and add to map

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
   }).addTo(myMap);

  //Add legend to myMap
  legend.addTo(myMap);
}