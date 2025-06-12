const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

require('dotenv').config({ path: './.env' });

/* API PARAMS */
const apiURL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?"

const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;
const API_IDENTITY = process.env.API_IDENTITY;

var weatherFetch = apiURL + 'lat=' + LATITUDE + "&" + 'lon=' + LONGITUDE
/* API PARAMS */


/* FILE OPERATIONS */
const fetchedDataDir = path.join(__dirname, 'fetched_data');
const historicalDir = path.join(__dirname, 'fetched_data_historical');
const fileName = 'current_data.json';
const currentDataPath = path.join(fetchedDataDir, fileName);

function getTimestampedFilename() {
  const now = new Date();
  return now.toISOString().replace(/[:]/g, '-').replace(/\..+/, '') + '.json.bz2';
}


function archiveAndMoveFile(srcPath, destDir, callback) {
  const tempBz2 = srcPath + '.bz2';
  exec(`bzip2 -c "${srcPath}" > "${tempBz2}"`, (err) => {
    if (err) {
      console.error('Compression failed:', err);
      return callback(err);
    }

    const destFileName = getTimestampedFilename();
    const destPath = path.join(destDir, destFileName);

    fs.rename(tempBz2, destPath, (err) => {
      if (err) {
        console.error('Move failed:', err);
        return callback(err);
      }

      // Optionally delete original JSON file
      fs.unlink(srcPath, () => callback(null, destPath));
    });
  });
}
/* FILE OPERATIONS */

  fs.readdir(fetchedDataDir, (err, files) => {
    if (err) {
      console.error('Error reading fetched_data directory:', err);
      return;
    }

    if (files.length === 0) {
      console.log('Directory is empty. Proceeding with API call...');
      // performApiCall(); // Your actual function
    } else if (files.includes(fileName)) {
      archiveAndMoveFile(currentDataPath, historicalDir, (err, archivedPath) => {
        if (!err) {
          console.log(`Archived and moved file to: ${archivedPath}`);
        }
        // performApiCall(); // Proceed after moving
      });
    } else {
      console.log('No target file to archive. Proceeding with API call...');
      // performApiCall(); // Still proceed if no matching file
    }
  });


// Check if there is still a file in fetched_data, and process it before making a new API call, if not, proceed

console.log(weatherFetch)
fetch(weatherFetch, {
  method: 'GET',
  headers: {
    'User-Agent': API_IDENTITY,
    'If-Modified-Since':  new Date(Date.now() - 3 * 60 * 60 * 1000).toUTCString()
  }
})
  .then(response => {
    // console.log(response)
    if (response.status === 304) {
      console.log('Data has not changed — skipping parsing.');
    } else if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // console.log(JSON.stringify(data));
    fs.writeFile(currentDataPath, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('JSON data has been written to current_data.json');
      }
  });

  })
  .catch(error => {
    console.error('Error:', error);
  });
