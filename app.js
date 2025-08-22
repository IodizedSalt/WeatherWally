const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

app.get('/weather', (req, res) => {
// fs.readFile(path.join(__dirname, '/climate_data/processed_data.json'), 'utf8', (err, data) => { //LocalDev
fs.readFile(path.join(__dirname, 'climate_data', 'processed_data.json'), 'utf8', (err, data) => {
  if (err) {
    console.log(err)
    console.log(path.join(__dirname, 'climate_data', 'processed_data.json'))
    return res.status(500).json({ error: 'Failed to read data' });

  }
  res.json(JSON.parse(data));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
