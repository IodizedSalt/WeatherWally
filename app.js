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
app.post('/entry', (req, res) => {

  const { date, type, value } = req.body;

  const filePath = path.join(
    __dirname,
    'climate_data',
    'processed_data.json'
  );

  fs.readFile(filePath, 'utf8', (err, fileData) => {

    if (err) {
      return res.status(500).json({ error: 'read failed' });
    }

    const json = JSON.parse(fileData);

    if (!json.extra_notes) {
      json.extra_notes = {};
    }

    if (!json.extra_notes[date]) {
      json.extra_notes[date] = [];
    }

    json.extra_notes[date].push({
      type,
      value
    });

    fs.writeFile(
      filePath,
      JSON.stringify(json, null, 2),
      'utf8',
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'write failed' });
        }

        res.json({ success: true });
      }
    );
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
