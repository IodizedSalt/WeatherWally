#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'climate_data/processed_data.json');
const CURRENT_DATA_FILE = path.join(__dirname, 'fetched_data/current_data.json');

// Load/init processed data
//let climateData = {processed_files: [], data: {}};
if (fs.existsSync(DATA_FILE)) {
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  var climateData = content ? JSON.parse(content) : {processed_files: [], data:{}};
}else{
  var climateData = {processed_files: [], data: {}};
}
//console.log(climateData)
// Load current fetched data
const currentJson = fs.readFileSync(CURRENT_DATA_FILE, 'utf8');
const currentData = JSON.parse(currentJson);

// Add the metadata timestamp to the processed data file
if(climateData.processed_files && climateData.processed_files.includes(currentData.properties.meta.updated_at)){
	console.log('FILE IS SAME')
	process.exit(0);
}else if(climateData.processed_files && climateData.processed_files.length == 0){
	console.log('FILE IS EMPTY')
}else{
	console.log('FILE IS DIFFERENT')
}
//console.log(climateData.processed_files)
climateData.processed_files.push(currentData.properties.meta.updated_at)

currentData.properties.timeseries.forEach(({ time, data }) => {
  const details = data.instant.details;




// TODO: Implementation of precipitation





//   ,{"time":"2026-03-09T16:00:00Z","data":{"instant":{"details":{"air_pressure_at_sea_level":1021.4,"air_temperature":8.6,"cloud_area_fraction":0.5,"relative_humidity":66.6,"wind_from_direction":152,"wind_speed":2.9}},"next_1_hours":{"summary":{"symbol_code":"clearsky_day"},"details":{"precipitation_amount":0}},"next_6_hours":{"summary":{"symbol_code":"clearsky_night"},"details":{"precipitation_amount":0}}}}
  const precipitation = details;
  const {
	air_temperature,
	air_pressure_at_sea_level,
	cloud_area_fraction,
	relative_humidity,
	wind_from_direction,
	wind_speed,
	// precipitation_amount
  } = details;

  if (!climateData.data[time]) {
	// First time seeing this timepoint
		climateData.data[time] = {
		air_temperature,
		air_temperature_sum: Math.trunc(air_temperature * 10) / 10,
		air_temperature_count: 1,
		air_temperature_avg:  Math.trunc(air_temperature * 10) / 10,
		air_pressure_at_sea_level,
		cloud_area_fraction,
		relative_humidity,
		wind_from_direction,
		wind_speed,
		// precipitation_amount
	};
  } else {
	const prev = climateData.data[time];
	const rawSum = prev.air_temperature_sum + air_temperature;
	const sum = Math.trunc(rawSum * 10) / 10;
	const count = prev.air_temperature_count + 1;
	const avg =  Math.trunc((sum / count) * 10) / 10;

	climateData.data[time] = {
	  ...prev,
	  air_temperature,
	  air_temperature_sum: sum,
	  air_temperature_count: count,
	  air_temperature_avg: avg,
	  air_pressure_at_sea_level,
	  cloud_area_fraction,
	  relative_humidity,
	  wind_from_direction,
	  wind_speed,
	//   precipitation_amount
	};
  }
});

fs.writeFileSync(DATA_FILE, JSON.stringify(climateData, null, 2));
