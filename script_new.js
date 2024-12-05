var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5,
  minZoom: 2,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const countriesGeoJSON = 'countries.json';

// Array to hold selected countries
const selectedCountries = [];
const onLoadCountries = [];


fetch(countriesGeoJSON) 
  .then(response => response.json())
  .then(data => {

    // Show data on load
    for (const item of data.features) {
      const countryData = { 
        'name': item.properties.name ? item.properties.name : '',
        'region': item.properties.region ? item.properties.region : '',
        'iso': item.properties.iso ? item.properties.iso : '',
        'count': item.properties.network_count ? item.properties.network_count : '',
        '2g': item.properties['2g'] === 't' ? true : false,
        '3g': item.properties['3g'] === 't' ? true : false,
        '5g': item.properties['5g'] === 't' ? true : false,
        'lte': item.properties['lte'] === 't' ? true : false,
        'lte_m': item.properties['lte_m'] === 't' ? true : false,
        'nb_iot': item.properties['nb_iot'] === 't' ? true : false
      };
    
      onLoadCountries.push(countryData);
    }
    showList(onLoadCountries);


    L.geoJSON(data, {
      style: {
        color: 'grey',
        weight: 1,
        fillColor: '#3388ff',
        fillOpacity: 0.3,
      },

      // Interaction on each Countries
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

        // Update data on click
        layer.on('click', function () {
          updateData(feature);
        });
        function updateData(entry) {
          const countryData = { 
            'name': entry.properties.name ? entry.properties.name : '',
            'region': entry.properties.region ? entry.properties.region : '',
            'iso': entry.properties.iso ? entry.properties.iso : '',
            'count': entry.properties.network_count ? entry.properties.network_count : '',
            '2g': entry.properties['2g'] === 't' ? true : false,
            '3g': entry.properties['3g'] === 't' ? true : false,
            '5g': entry.properties['5g'] === 't' ? true : false,
            'lte': entry.properties['lte'] === 't' ? true : false,
            'lte_m': entry.properties['lte_m'] === 't' ? true : false,
            'nb_iot': entry.properties['nb_iot'] === 't' ? true : false
          };

          isSelected = !isSelected;

          if (isSelected) {
              layer.setStyle({ fillColor: 'red' });
              selectedCountries.push(countryData);
          } else {
              layer.setStyle({ fillColor: '#3388ff' }); 
              
              // Remove from array
              const index = selectedCountries.findIndex(
                (item) => item.name === countryData.name // Replace 'id' with a unique property of object
            );
              if (index > -1) selectedCountries.splice(index, 1);
          }

          // Log the array
          console.log('Selected Countries:', selectedCountries);
          document.querySelector('.countries-list').innerHTML = '';
          showList(selectedCountries);
        }
      }
    }).addTo(map);
    
})
.catch(error => console.error('Error loading GeoJSON:', error));


// Print Data on table
function showList(arr) {
  const svgCheck = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12L10 17L20 7" stroke="#14AE5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
  const svgCross = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#F24822" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`

  for (const [index, item] of arr.entries()) {
    document.querySelector('.countries-list').innerHTML += 
    `<div class="countries-item">
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

  document.querySelector('.item-count').innerHTML = `${arr.length} items found`
}