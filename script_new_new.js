var map = L.map('map').setView([40, 0], 1);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5,
  minZoom: 1.5,
  opacity: 1,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// GeoJSON URL
const countriesGeoJSON = 'countries.json';

// Arrays for country data
const mainArray = []; // Full country data loaded
let tempArray = [];   // Currently active/filtered data

// GeoJSON Layer
let geojsonLayer;

// Global variable to store the original GeoJSON data
let geojsonData;

fetch(countriesGeoJSON)
  .then((response) => response.json())
  .then((data) => {
    geojsonData = data; // Store fetched GeoJSON in a global variable

    // Populate mainArray
    for (const item of data.features) {
      mainArray.push({
        name: item.properties.name || '',
        region: item.properties.region || '',
        iso: item.properties.iso || '',
        count: item.properties.network_count || '',
        '2g': item.properties['2g'] === 't',
        '3g': item.properties['3g'] === 't',
        '5g': item.properties['5g'] === 't',
        'lte': item.properties['lte'] === 't',
        'lte_m': item.properties['lte_m'] === 't',
        'nb_iot': item.properties['nb_iot'] === 't',
      });
    }

    // Copy mainArray to tempArray
    tempArray = [...mainArray];
    updateMap();
    showList(tempArray);
  })
.catch((error) => console.error('Error loading GeoJSON:', error));



// Convert temp Array to GeoJSON
function convertToGeoJSON(array, originalData) {
  return {
    type: "FeatureCollection",
    features: array.map((item) => {
      // Find the original GeoJSON feature to get the geometry
      const originalFeature = originalData.features.find(
        (feature) => feature.properties.name === item.name
      );

      return {
        type: "Feature",
        properties: {
          name: item.name,
          region: item.region,
          iso: item.iso,
          count: item.count,
          '2g': item['2g'],
          '3g': item['3g'],
          '5g': item['5g'],
          'lte': item['lte'],
          'lte_m': item['lte_m'],
          'nb_iot': item['nb_iot'],
        },
        geometry: originalFeature.geometry, // Retain original geometry
      };
    }),
  };
}


function updateMap() {
  if (geojsonLayer) map.removeLayer(geojsonLayer); // Remove existing layer

  // Convert tempArray into valid GeoJSON
  const geoJSONData = convertToGeoJSON(mainArray, geojsonData);

  // Add the GeoJSON layer to the map
  geojsonLayer = L.geoJSON(geoJSONData, {
    style: featureStyle,
    onEachFeature: (feature, layer) => {
      const countryName = feature.properties.name;

      // Hover and Popup
      layer.on('mouseover', () => {
        const countryData = `
          ${feature.properties['2g'] ? '2G<br>' : ''}
          ${feature.properties['3g'] ? '3G<br>' : ''}
          ${feature.properties['5g'] ? '5G<br>' : ''}
          ${feature.properties['lte'] ? 'LTE<br>' : ''}
        `;
        L.popup()
          .setLatLng(layer.getBounds().getCenter())
          .setContent(`<b>${countryName}</b><br>${countryData}`)
          .openOn(map);
      });

      // Toggle country selection
      layer.on('click', () => toggleCountry(feature));
    },
  }).addTo(map);
}


// Function to toggle country selection
function toggleCountry(feature) {
  const countryName = feature.properties.name;
  const exists = tempArray.find((c) => c.name === countryName);
  console.log(countryName)
  console.log(tempArray)

  if (exists) {
    // Remove if already in tempArray
    tempArray = tempArray.filter((c) => c.name !== countryName);
  } else {
    // Add to tempArray
    const countryData = mainArray.find((c) => c.name === countryName);
    if (countryData) tempArray.push(countryData);
  }

  updateMap();
  showList(tempArray);
}

// Style function for countries
function featureStyle(feature) {
  const isActive = tempArray.some((c) => c.name === feature.properties.name);
  return {
    color: '#666666',
    weight: 1,
    fillColor: isActive ? '#ffa500' : 'blue',
    fillOpacity: isActive ? 1 : 0.2,
  };
}

// Apply filters
function applyFilters() {
  const selectedFilters = [];
  document.querySelectorAll('.filters-options input[type="checkbox"]').forEach((checkbox) => {
    if (checkbox.checked) selectedFilters.push(checkbox.value);
  });

  // Filter the tempArray based on selected filters
  tempArray = mainArray.filter((country) =>
    selectedFilters.every((filter) => country[filter] === true)
  );

  updateMap();
  showList(tempArray);
}

// Show list in table
function showList(arr) {

  if(tempArray.length == 0) {
    document.getElementById('data-clear').style.display = 'none';
  } else {
    document.getElementById('data-clear').style.display = 'block';
  }

  const listContainer = document.querySelector('.countries-list');
  listContainer.innerHTML = '';
  const svgCheck = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12L10 17L20 7" stroke="#14AE5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
  const svgCross = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#F24822" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`

  arr.forEach((item, index) => {
    listContainer.innerHTML += `
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
        <span>${item['lte'] ? svgCheck : svgCross}</span>
      </div>
      <div class="countries-lte_m">
        <span>${item['lte_m'] ? svgCheck : svgCross}</span>
      </div>
      <div class="countries-nb_iot">
        <span>${item['nb_iot'] ? svgCheck : svgCross}</span>
      </div>
    </div>`;
  });

  document.querySelector('.item-count').innerHTML = `${arr.length} items found`;
}

// Select All
// document.getElementById('data-all').addEventListener('click', () => {
//   // Check all checkboxes
//   document.querySelectorAll('.filter-options input[type="checkbox"]').forEach((checkbox) => {
//     checkbox.checked = true;
//   });

//   // Copy all countries to tempArray
//   tempArray = [...mainArray];
//   updateMap();
//   showList(tempArray);
// });

// Clear Data
document.getElementById('data-clear').addEventListener('click', () => {
  // Uncheck all checkboxes
  document.querySelectorAll('.filters-options input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Empty the tempArray
  tempArray = [];
  updateMap();
  showList(tempArray);
});

// Add event listeners for filters
document.querySelectorAll('.filters-options input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener('change', applyFilters);
});


// Open / Close Filter

document.querySelector('.filters-head').addEventListener('click', () => {
  document.querySelector('.filters-main').classList.toggle('filters-active');
})