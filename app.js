const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
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
});

app.post('/greenhouse-min', (req, res) => {

  const { date, greenhouse_min } = req.body;

  const filePath = path.join(__dirname, 'climate_data', 'processed_data.json');

  fs.readFile(filePath, 'utf8', (err, fileData) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        error: 'Failed to read file'
      });
    }

    const json = JSON.parse(fileData);

    // find matching timestamp
    for (const timestamp in json.data) {

      const entryDate = new Date(timestamp)
        .toISOString()
        .split('T')[0];

      if (entryDate === date) {

        json.data[timestamp].greenhouse_min = greenhouse_min;
      }
    }

    // write updated file
    fs.writeFile(
      filePath,
      JSON.stringify(json, null, 2),
      'utf8',
      (writeErr) => {

        if (writeErr) {

          console.log(writeErr);

          return res.status(500).json({
            error: 'Failed to write file'
          });
        }

        res.json({
          success: true
        });
      }
    );
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
