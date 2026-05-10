import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(
  __dirname,
  '../../climate_data/processed_data.json'
);

const raw = fs.readFileSync(filePath, 'utf8');

const json = JSON.parse(raw);

if (!json.extra_notes) {
  json.extra_notes = {};
}

for (const timestamp in json.data) {

  const entry = json.data[timestamp];

  if (!entry.greenhouse_min) {
    continue;
  }

  const date =
    new Date(timestamp)
      .toISOString()
      .split('T')[0];

  if (!json.extra_notes[date]) {
    json.extra_notes[date] = [];
  }

  const alreadyExists =
    json.extra_notes[date].some((note) => {

      return (
        note.type === 'greenhouse_min'
        &&
        note.value == entry.greenhouse_min
      );
    });

  if (!alreadyExists) {

    json.extra_notes[date].push({

      type: 'greenhouse_min',
      value: entry.greenhouse_min,
      migrated_from: timestamp,
      created_at: new Date().toISOString()
    });
  }
  delete entry.greenhouse_min;
}


fs.writeFileSync(
  filePath,
  JSON.stringify(json, null, 2),
  'utf8'
);

