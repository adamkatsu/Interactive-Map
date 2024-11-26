var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5,
  minZoom: 2,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// GeoJSON URL (replace this with your own or a hosted version)
const countriesGeoJSON = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

// Array to hold selected countries
const selectedCountries = [];

// Fetch and add GeoJSON layer
fetch(countriesGeoJSON)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'grey',
        weight: 1,
        fillColor: '#3388ff',
        fillOpacity: 0.3,
      },
      onEachFeature: function (feature, layer) {
        // Track whether a country is "selected"
        let isSelected = false;

        // Highlight on hover
        layer.on('mouseover', function () {
          if (!isSelected) {
              layer.setStyle({ fillOpacity: 0.7 });
          }
          const countryName = feature.properties.name; // Assuming `name` property exists
          const countryData = `Hello ${countryName}`; // Replace with actual data source
          L.popup()
              .setLatLng(layer.getBounds().getCenter())
              .setContent(`<b>${countryName}</b><br>${countryData}`)
              .openOn(map);
        });
        layer.on('mouseout', function () {
          if (!isSelected) {
              layer.setStyle({ fillOpacity: 0.3 });
          }
        });
        // Toggle color on click
        layer.on('click', function () {
          const countryName = feature.properties.name;
          isSelected = !isSelected;
          if (isSelected) {
              layer.setStyle({ fillColor: 'red' }); // Change to red
              selectedCountries.push(countryName); // Add to array
          } else {
              layer.setStyle({ fillColor: '#3388ff' }); // Revert to original
              // Remove from array
              const index = selectedCountries.indexOf(countryName);
              if (index > -1) selectedCountries.splice(index, 1);
          }
          // Log the array (or handle it as needed)
          console.log('Selected Countries:', selectedCountries);

          document.querySelector('.countries-list').innerHTML = '';
          for (const item of selectedCountries) {
            document.querySelector('.countries-list').innerHTML += `<li>${item}</li>`
          }
        });
      }
    }).addTo(map);
})
.catch(error => console.error('Error loading GeoJSON:', error));
