var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5,
  minZoom: 2,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// GeoJSON URL (replace this with your own or a hosted version)
// const countriesGeoJSON = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';
const countriesGeoJSON = 'countries.json';

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
          const countryData = `Hello ${feature.properties.nickname ? feature.properties.nickname : countryName}`; // Replace with actual data source

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
          updateData(feature);
        });
        function updateData(entry) {
          const countryName = entry.properties.name ? entry.properties.name : '';
          const countryRegion = entry.properties.region ? entry.properties.region : '';
          const countryIso = entry.properties.iso ? entry.properties.iso : '';
          const networkCount = entry.properties.network_count ? entry.properties.network_count : '';
          const country2g = entry.properties['2g'] === 't' ? true : false;
          const country3g = entry.properties['3g'] === 't' ? true : false;
          const country5g = entry.properties['5g'] === 't' ? true : false;
          const countryLte = entry.properties['lte'] === 't' ? true : false;
          const countryLteM = entry.properties['lte_m'] === 't' ? true : false;
          const countryNbIot = entry.properties['nb_iot'] === 't' ? true : false;
          const countryData = { 
                                'name': countryName,
                                'region': countryRegion,
                                'iso': countryIso,
                                'count': networkCount,
                                '2g': country2g,
                                '3g': country3g,
                                '5g': country5g,
                                'lte': countryLte,
                                'lte_m': countryLteM,
                                'nb_iot': countryNbIot
                              };

          isSelected = !isSelected;

          if (isSelected) {
              layer.setStyle({ fillColor: 'red' }); // Change to red
              selectedCountries.push(countryData); // Add to array
          } else {
              layer.setStyle({ fillColor: '#3388ff' }); // Revert to original
              // Remove from array
              const index = selectedCountries.findIndex(
                (item) => item.name === countryData.name // Replace 'id' with a unique property of your object
            );
              if (index > -1) selectedCountries.splice(index, 1);
          }

          // Log the array (or handle it as needed)
          console.log('Selected Countries:', selectedCountries);
          const svgCheck = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12L10 17L20 7" stroke="#14AE5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`
          const svgCross = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#F24822" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`

          document.querySelector('.countries-list').innerHTML = '';
          for (const [index, item] of selectedCountries.entries()) {
            document.querySelector('.countries-list').innerHTML += 
            `<div class="countries-item">
              <div class="countries-num">
                <span>${index}</span>
              </div>
              <div class="countries-region">
                <span>${item.region}</span>
              </div>
              <div class="countries-name">
                <span>${item.name}</span>
              </div>
              <div class="countries-iso">
                <span>${item.iso}</span>
              </div>
              <div class="countries-count">
                <span>${item.count}</span>
              </div>
              <div class="countries-2g">
                <span>${item['2g'] ? svgCheck : svgCross}</span>
              </div>
              <div class="countries-3g">
                <span>${item['3g'] ? svgCheck : svgCross}</span>
              </div>
              <div class="countries-5g">
                <span>${item['5g'] ? svgCheck : svgCross}</span>
              </div>
              <div class="countries-lte">
                <span>${item['lte'] ? svgCheck : svgCross}</span>
              </div>
              <div class="countries-lte_m">
                <span>${item['lte_m'] ? svgCheck : svgCross}</span>
              </div>
              <div class="countries-nb_iot">
                <span>${item['nb_iot'] ? svgCheck : svgCross}</span>
              </div>
            </div>`
          }
        }
      }
    }).addTo(map);
    // Display all countries on page load
    const allCountries = data.features.map((feature) => ({
      name: feature.properties.name || '',
      region: feature.properties.region || '',
      iso: feature.properties.iso || '',
      count: feature.properties.network_count || '',
      '2g': feature.properties['2g'] === 't',
      '3g': feature.properties['3g'] === 't',
      '5g': feature.properties['5g'] === 't',
      lte: feature.properties['lte'] === 't',
      lte_m: feature.properties['lte_m'] === 't',
      nb_iot: feature.properties['nb_iot'] === 't',
    }));

    updateCountriesList(allCountries);
})
.catch(error => console.error('Error loading GeoJSON:', error));

// Function to update countries list
function updateCountriesList(countries) {
  const svgCheck = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12L10 17L20 7" stroke="#14AE5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  const svgCross = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#F24822" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const countriesList = document.querySelector('.countries-list');
  countriesList.innerHTML = '';

  countries.forEach((item, index) => {
    countriesList.innerHTML += `
      <div class="countries-item">
        <div class="countries-num">
          <span>${index + 1}</span>
        </div>
        <div class="countries-region">
          <span>${item.region}</span>
        </div>
        <div class="countries-name">
          <span>${item.name}</span>
        </div>
        <div class="countries-iso">
          <span>${item.iso}</span>
        </div>
        <div class="countries-count">
          <span>${item.count}</span>
        </div>
        <div class="countries-2g">
          <span>${item['2g'] ? svgCheck : svgCross}</span>
        </div>
        <div class="countries-3g">
          <span>${item['3g'] ? svgCheck : svgCross}</span>
        </div>
        <div class="countries-5g">
          <span>${item['5g'] ? svgCheck : svgCross}</span>
        </div>
        <div class="countries-lte">
          <span>${item.lte ? svgCheck : svgCross}</span>
        </div>
        <div class="countries-lte_m">
          <span>${item.lte_m ? svgCheck : svgCross}</span>
        </div>
        <div class="countries-nb_iot">
          <span>${item.nb_iot ? svgCheck : svgCross}</span>
        </div>
      </div>`;
  });
}
