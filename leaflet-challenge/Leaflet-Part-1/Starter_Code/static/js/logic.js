// Initialize the map
let myMap = L.map("map", {
    center: [37.09, -95.71], 
    zoom: 5
});

// Add the OpenStreetMap tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(myMap);

// Fetch earthquake data from USGS
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {

// Function to determine color based on depth
        function getColor(depth) {
            return depth > 90 ? "red" :
                   depth > 70 ? "pink" :
                   depth > 50 ? "purple" :
                   depth > 30 ? "orange" :
                   depth > 10 ? "yellow" : "blue";
        }

// Function to determine radius based on magnitude
        function getRadius(magnitude) {
            return magnitude ? magnitude * 3 : 1; 
        }

// Loop through the earthquake features and create markers
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                let depth = feature.geometry.coordinates[2]; 
                let magnitude = feature.properties.mag;      

// Create circle marker
                let marker = L.circleMarker(latlng, {
                    radius: getRadius(magnitude),
                    fillColor: getColor(depth),
                    color: "#000", 
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 0.7
                });

// Add popup to marker
                marker.bindPopup(`
                    <h3>${feature.properties.title}</h3>
                    <p><strong>Magnitude:</strong> ${magnitude}</p>
                    <p><strong>Depth:</strong> ${depth} km</p>
                    <p><strong>Location:</strong> ${feature.properties.place}</p>
                `);

                return marker;
            }
        }).addTo(myMap);

// Add legend to map
let legend = L.control({ position: "bottomright" });


legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    
    // Define depth ranges and corresponding colors
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["blue", "yellow", "orange", "purple", "pink", "red"];

   
    // Loop through depths to generate a colored legend
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background: ${colors[i]}"></i> ` +
            `${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] : "+"}<br>`;
    }
    return div;
};

// Add the legend to the map
legend.addTo(myMap);
});


