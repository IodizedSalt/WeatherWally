const fs = require('fs');
const path = require('path');

const climateDir = path.join(__dirname, '/climate_data');
const dirsToCreate = [
  path.join(__dirname, '/fetched_data'),
  path.join(__dirname, '/fetched_data_historical'),
  climateDir
];

dirsToCreate.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  } else {
    console.log(`✔️ Already exists: ${dir}`);
  }
});

// Create empty processed_data.json if not present
const dataFilePath = path.join(climateDir, 'processed_data.json');
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, '{}', 'utf8');
  console.log(`✅ Created empty file: ${dataFilePath}`);
} else {
  console.log(`✔️ File already exists: ${dataFilePath}`);
}

// Create .env file with default keys if not present
const envFilePath = path.join(__dirname, '.env');
if (!fs.existsSync(envFilePath)) {
  const envContent = [
    'DMI_API_KEY=your_api_key_here',
    'LATITUDE=00.0000',
    'LONGITUDE=00.0000',
    'API_IDENTITY=your_app_name_or_email'
  ].join('\n');

  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log(`🔐 Created .env with placeholder keys.`);
} else {
  console.log('✔️ .env file already exists.');
}
