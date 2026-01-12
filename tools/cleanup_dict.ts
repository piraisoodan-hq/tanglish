import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const FILE = join(import.meta.dir, '../src/data/ta_common.json');
const raw = readFileSync(FILE, 'utf-8');
const data = JSON.parse(raw);

const unique: Record<string, string> = {};
const sortedKeys = Object.keys(data).sort(); // Sort alphabetically for consistency

let dupes = 0;
for (const key of sortedKeys) {
  if (unique[key]) dupes++;
  unique[key] = data[key];
}

console.log(`cleaned ${dupes} duplicates.`);
writeFileSync(FILE, JSON.stringify(unique, null, 2));
