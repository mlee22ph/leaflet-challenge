// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
let locationMarkers = [];

// A function to determine the marker size based on the magnitude
function markerSize(magnitude) {
  return magnitude * 100 * 500;
}


  // get color depending on population density value
	function getColor(d) {
		return d > 90 ? '#00008a' :
			d >= 70  ? '#800026' :
			d >= 50  ? '#b53c6f' :
			d >= 30  ? '#FC4E2A' :
			d >= 10   ? '#FD8D3C' : '#FEB24C' ;
	}



// Getting our GeoJSON data
d3.json(link).then(function(data) {

  let features = data.features;
  let marker_limit = features.length;
  console.log("marker_limit: ", marker_limit);

  // create main map
  let myMap = L.map("map", {
    center: [-4.6999, 101.9367],
    zoom: 4
  });


  // Loop thru list of data to render each earthquake
  for (let i = 0; i < marker_limit; i++) {

    let location = features[i].geometry;

    if(location) {

      // Set earthquake marker as circle with color based on depth and radius based on magnitude
      // Popup to display title of earthquake data
      L.circle([location.coordinates[1], location.coordinates[0]], {
        fillOpacity: 0.75,
        color: "black",
        weight: 1,
        fillColor: getColor(location.coordinates[2]),
        radius: markerSize(features[i].properties.mag)
      }).addTo(myMap).bindPopup("<strong>" + features[i].properties.title + "</br> Depth: " + location.coordinates[2] + "</strong>");

      console.log("features[i].properties.mag: ", features[i].properties.mag);
    }
  }

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


  // Set up the legend.
  let legend = L.control({ position: "bottomright" });

	legend.onAdd = function (myMap) {

		const div = L.DomUtil.create('div', 'info legend');
		const grades = [-10, 10, 30, 50, 70, 90];
		const labels = [];
		let from, to;

		for (let i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

      console.log("getColor: ", getColor(from + 1));
			//labels.push(`<div style="background-color:${getColor(from + 1)};"></i> ${from}${to ? `&ndash;${to}` : '+'}</div>`);
      div.innerHTML +=
            '<i style="background:' + getColor(from+ 1) + '"></i> ' +
            from + (to ? '&ndash;' + to + '<br>' : '+');
		}

		//div.innerHTML = labels.join('<br>');
		return div;
	};


  // Adding the legend to the map
  legend.addTo(myMap);



});


