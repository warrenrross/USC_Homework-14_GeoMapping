

var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
//var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var API_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

var fault_line_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Create a map.
function createMap(quakeLayers, timelineLayer,faultlineLayer, legend) {

  // Create the tile layer that will be the background of the world map displaying earthquakes.
  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
  });

  // Create the tile layer that will be the background of the timeline displaying of earthquakes.
  var tlMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
  });
  var streemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        accessToken: API_KEY
    });

  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        accessToken: API_KEY
    });

  var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

  // Create a map using the lightMap tile layer and the earthquake layers (quakeLayers).
  var myMap = L.map("map-id", {
      center: [36.77, -119.41],
      zoom: 6,
      layers: [lightMap, faultlineLayer].concat(d3.values(quakeLayers))
      // layers: [lightMap,quakeLayers]
  });

  // Create a baseMaps object to hold the tile layers (lightMap & tlMap).
  var baseMaps = {
      "Street Map": streemap,
      "Satellite Map": satmap,
      "Google Map":googleTerrain,
      "Light Map": lightMap,
      "Timeline": tlMap
  };

  //    Tring to add faultlineLayer
  //    Create an overlayMaps object here to contain the "Earthquake" and "Fault Line" layers
  //    var overlayMaps = {
  //     "Earthquake": quakeLayers,
  //     "Fault Line": faultlineLayer
  // };

  // Create a timeline control.
  var timelineControl = L.timelineSliderControl({
          formatOutput: function(date) {
              return new Date(date).toString().slice(0, 24).replace(/ /g, '_');
          }
      });

  // Create a layer control, passing in the baseMaps and quakeLayers.
  // Add the layer control to the map.
  var layersControl = L.control.layers(baseMaps, quakeLayers, {
      collapsed: false
  }).addTo(myMap);

  // Add the legend to the map.
  legend.addTo(myMap);

  // Add a listener for a 'Base Layer change' to the map.
  myMap.on('baselayerchange', function (e) {


      if (e.name == 'Timeline') {

        // If the 'Timeline' base layer was selected, remove the quakeLayers
        // from the map and the quakeLayers overlayer controls. Add the
        // timeline control and the timeline overlayer to the map.
        for (var layer of d3.values(quakeLayers)) {
          layer.remove();
          layersControl.removeLayer(layer);
      }

      timelineControl.addTo(myMap);
      timelineControl.addTimelines(timelineLayer);
      timelineLayer.addTo(myMap);
      }

        
    else {
      // If other than 'Timeline' base layer was selected, remove the timeline
      // control and the timeline layer. 
      // quakeLayers controls are first removed from map in case controls
      // already exits on map. NECESSARY when switching between non-TimeLine layers.
      // Add quakeLayers to the map and the
      // quakeLayers overlayer controls.
      //
        timelineControl.remove();
        timelineLayer.remove();
        for (var layer of d3.values(quakeLayers)) {
          layer.remove();
          layersControl.removeLayer(layer);
      }
        for (var layer of d3.entries(quakeLayers)) {
            layer.value.addTo(myMap);
            layersControl.addOverlay(layer.value, layer.key);
        }
    }

        
  });
}


// Add tool tip and pop up information to each earthquake marker.
function addPopupInfo(feature, layer) {

  // If this feature has properties named 'mag', 'place' and 'time', add a Tool Tip.
  if (feature.properties && feature.properties.mag &&
      feature.properties.place && feature.properties.time) {
          layer.bindTooltip('<div align="center"><div>Magnitude: '  + feature.properties.mag +
                            '</div><div>Place: ' + feature.properties.place +
                            '</div><div>Date: ' + new Date(+feature.properties.time).toDateString() +
                            '</div><div>(Click circle for USGS link)</div></div>');
  }

}




// Perform an API call to the USGS API to get earthquake information (past 30 days, 2.5+ magnitude and greater)
//
d3.json(API_quakes).then((geojsonData) => {
  console.log(geojsonData);

  // Create a logarithmic color scale for filling the earthquake
  // markers. Set a default color for the ring around an earthquake
  // marker.
  //
  var colorRange = ['#fcfbfd','#3f007d'],
      ringColor = '#000000',
      magMinMax   = d3.extent(geojsonData.features.map((f) => f.properties.mag)),
      range      = [0, geojsonData.features.length - 1];
      getType   = d3.extent(geojsonData.features.map((f) => f.properties.type)),
      magDomain = [1,magMinMax[1]]
      //Log number of features in the console. Keeping 'range' for future feature.
      console.log(range);
      console.log(magMinMax)
  // Create a legend.
  var legend  = L.control({position: 'bottomright'}),
      magBins = d3.ticks(Math.floor(magMinMax[0]), magMinMax[1], Math.ceil(magMinMax[1] - magMinMax[0]));


  // Scale the colors.
  var colorScaleQuake  = d3.scaleLinear().domain(magMinMax).range(colorRange);
      colorScaleLegend  = d3.scaleLinear().domain(magDomain).range(colorRange);
  

  // Implement the 'onAdd()' function.
  legend.onAdd = function () {

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

      // Testing color in legend
      // div.innerHTML += '<i style="background: ' + testColor + '"></i> test<br>';

      for (var i = 0; i < magBins.length; i++) {
          div.innerHTML +=
              '<i style="background: ' + colorScaleLegend(magBins[i]) + '"></i> ' +
              magBins[i] + (magBins[i + 1] ? '&ndash;' + magBins[i + 1] : '+') + '<br>';
      }
     
      return div;
  }


  
  // Initialize an object used to hold the earthquake layers.
  var quakeLayers = {};

  for (var i = 0; i < magBins.length; i++) {

      // Create an overlay layer of earthquake markers for quakes within a magnitude range.
      var quakeLayer = L.geoJSON(geojsonData.features, {
                  filter: function (feature) {
                      return (i == magBins.length - 1 ?
                              (+feature.properties.mag >= magBins[i]) :
                              (+feature.properties.mag >= magBins[i])  &&
                              (+feature.properties.mag < magBins[i + 1]));
                  },
                  pointToLayer: function (feature, latlng) {
                      return L.circleMarker(latlng, {
                      radius: +feature.properties.mag * 2,
                      fillColor: colorScaleQuake(+feature.properties.mag),
                      color: ringColor ,
                      weight: 1,
                      fillOpacity: 0.9,
                  });
                  },
                  onEachFeature: addPopupInfo,
              });

      // Create a label for the magnitude bin and add the layer to quakeLayers.
      var lvlKey = magBins[i] + (magBins[i + 1] ? '-' + magBins[i + 1] : '+');
      quakeLayers[lvlKey] = quakeLayer;
  };

  // Create an overlay layer for the earthquake timeline.
  var timelineLayer = new L.Timeline(geojsonData, {
              getInterval: function (quake) {
                  return ({
                      start: quake.properties.time,
                      end:   quake.properties.time + 86400000,
                          });
              },
              pointToLayer: function (quake, latlng) {
                  return L.circleMarker(latlng, {
                  radius: +quake.properties.mag * 2,
                  fillColor: colorScaleQuake(+quake.properties.mag),
                  color: ringColor,
                  weight: 1,
                  fillOpacity: 0.9,
              });
              },
              onEachFeature: addPopupInfo,
          });

  // Pass the earthquake overlay layers, the timeline overlay layer and the
  // legend to the createMap() function.
  createMap(quakeLayers, timelineLayer, faultlineLayer, legend);

}, (reason) => {
  console.log(reason);
});

// Create layer for fault lines
var faultlineLayer = L.layerGroup();

d3.json(fault_line_url, function (data) {
    var mystyle = {
        "color": "#ff7800",
        "weight": 4,
        "opacity": 0.9
    };

    L.geoJSON(data, {
        style: mystyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3><u>plate name</u>: " + feature.properties.Name + "</h3>");
            layer.on({
                "mouseover": highlightFeature,
                "mouseout": resetFeature
            });
            faultlineLayer.addLayer(layer);
        }
    });
});



