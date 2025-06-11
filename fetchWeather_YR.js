const fetch = require('node-fetch');
require('dotenv').config({ path: './.env' });
const apiURL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?"

const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;
const API_IDENTITY = process.env.API_IDENTITY;

var weatherFetch = apiURL + 'lat=' + LATITUDE + "&" + 'lon=' + LONGITUDE

fetch(weatherFetch, {
  method: 'GET',
  headers: {
    'User-Agent': API_IDENTITY,
  }
})
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
