new svgMap({
  targetElementID: 'svgMap',
  data: {
    data: {
      gdp: {
        name: 'GDP per capita',
        format: '{0} USD',
        thousandSeparator: ',',
        thresholdMax: 50000,
        thresholdMin: 1000
      },
      change: {
        name: 'Change to year before',
        format: '{0} %'
      }
    },
    applyData: 'gdp',
    values: {
      AF: { gdp: 587, change: 4.73 },
      AL: { gdp: 4583, change: 11.09 },
      DZ: { gdp: 4293, change: 10.01 }
      // ...
    }
  }
});

var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5,
  minZoom: 2,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);