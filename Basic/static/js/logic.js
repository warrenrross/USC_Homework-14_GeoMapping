function createMap(bikeStations) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control - we skip using a
  L.control.layers(null, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var stations = response.data.stations;

  // Initialize an array to hold bike markers
  var bikeMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];

    // For each station, create a marker and bind a popup with the station's name
    var bikeMarker = L.marker([station.lat, station.lon])
      .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>");

    // Add the marker to the bikeMarkers array
    bikeMarkers.push(bikeMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(bikeMarkers));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);
