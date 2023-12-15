let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Create the createMap function.
function createMap(bikeStations) {


  // Create the tile layer that will be the background of our map.
  let lightmap = L.tileLayer(
    "https://maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png",
    {
      id: 'grayscalemap-33686e9f',
      attribution: '&copy; 2023 &middot; <a href="https://maps.omniscale.com/">Omniscale</a> ' +
      '&middot; Map data: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap  (Lizenz: ODbL)</a>',
    }
  );

  // Create a baseMaps object to hold the lightmap layer.
  let baseMaps = {
    Lightmap: lightmap,
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = {
    BikeStations: bikeStations,
  };

  // Create the map object with options.
  let map = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(map);
}

// Create the createMarkers function.
function createMarkers(response) {
  // Pull the "stations" property from response.data.
  let stations = response.data.stations;


  // Initialize an array to hold the bike markers.
  let bikeMarkers = [];

  // Loop through the stations array.
  stations.forEach((station) => {
    // For each station, create a marker, and bind a popup with the station's name and capacity.
    let marker = L.marker([station.lat, station.lon])
      .bindPopup(`<strong>${station.name}</strong><br>Capacity: ${station.capacity}`);

    // Add the marker to the bikeMarkers array.
    bikeMarkers.push(marker);
  });

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  let bikeStations = L.layerGroup(bikeMarkers);

  // Call createMap function with the bikeStations layer group.
  createMap(bikeStations);
}

// Perform an API call to the Citi Bike API to get the station information.
let url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json";
d3.json(url).then(createMarkers);