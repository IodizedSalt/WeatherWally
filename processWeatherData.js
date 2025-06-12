
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'climate_data/processed_data.json');
const CURRENT_DATA_FILE = path.join(__dirname, 'fetched_data/current_data.json');

// Load/init processed data
let climateData = {};
if (fs.existsSync(DATA_FILE)) {
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  climateData = content ? JSON.parse(content) : {};
}

// Load current fetched data
const currentJson = fs.readFileSync(CURRENT_DATA_FILE, 'utf8');
const currentData = JSON.parse(currentJson);

currentData.properties.timeseries.forEach(({ time, data }) => {
  const details = data.instant.details;
  const {
	air_temperature,
	air_pressure_at_sea_level,
	cloud_area_fraction,
	relative_humidity,
	wind_from_direction,
	wind_speed
  } = details;

  if (!climateData[time]) {
	// First time seeing this timepoint
		climateData[time] = {
		air_temperature,
		air_temperature_sum: Math.trunc(air_temperature * 10) / 10,
		air_temperature_count: 1,
		air_temperature_avg: air_temperature,
		air_pressure_at_sea_level,
		cloud_area_fraction,
		relative_humidity,
		wind_from_direction,
		wind_speed
	};
  } else {
	const prev = climateData[time];
	const rawSum = prev.air_temperature_sum + air_temperature;
	const sum = Math.trunc(rawSum * 10) / 10;
	const count = prev.air_temperature_count + 1;
	const avg = sum / count;

	climateData[time] = {
	  ...prev,
	  air_temperature,
	  air_temperature_sum: sum,
	  air_temperature_count: count,
	  air_temperature_avg: avg,
	  air_pressure_at_sea_level,
	  cloud_area_fraction,
	  relative_humidity,
	  wind_from_direction,
	  wind_speed
	};
  }
});

fs.writeFileSync(DATA_FILE, JSON.stringify(climateData, null, 2));