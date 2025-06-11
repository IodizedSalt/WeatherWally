const fetch = require('node-fetch');

// const apiURL = "https://dmigw.govcloud.dk/v1/forecastedr/collections/harmonie_dini_sf/position?"

// const LATITUDE = 0.00
// const LONGITUDE = 0.00

var weatherFetch =   "https://dmigw.govcloud.dk/v1/forecastedr/collections/harmonie_dini_sf/position?coords=POINT%2812.561%2055.715%29&crs=crs84&parameter-name=temperature-0m&f=GeoJSON&api-key=4b9e4320-773a-44ab-bf08-18bfe3a2ddfb"
fetch(weatherFetch)
  .then(response => {
    console.log(response)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(JSON.stringify(data));
  })
  .catch(error => {
    console.error('Error:', error);
  });