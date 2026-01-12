import { readFileSync } from 'fs';
import { join } from 'path';
import common from '../src/data/ta_common.json';

const CORPUS_FILE = join(import.meta.dir, 'scraper/data/corpus.jsonl');

// 1. Load Dictionary Values (Target Tamil Words)
const knownTamilWords = new Set<string>(Object.values(common));
console.log(`📚 Dictionary Size: ${knownTamilWords.size} words`);

// 2. Read Corpus
console.log(`📂 Reading corpus from ${CORPUS_FILE}...`);
const fileContent = readFileSync(CORPUS_FILE, 'utf-8');
const lines = fileContent.split('\n').filter(l => l.trim());

let totalWords = 0;
let uniqueWords = new Set<string>();
const wordCounts = new Map<string, number>();

lines.forEach(line => {
  try {
    const item = JSON.parse(line);
    // Split by non-tamil characters (simplify)
    // Range: \u0B80-\u0BFF (Tamil)
    const tokens = item.text.split(/[^0-9\u0B80-\u0BFF]+/);

    tokens.forEach((t: string) => {
      const w = t.trim();
      if (w.length > 1) { // Ignore single chars
        totalWords++;
        uniqueWords.add(w);
        wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
      }
    });
  } catch (e) { }
});

console.log(`📊 Corpus Stats:`);
console.log(`   - Total Words: ${totalWords}`);
console.log(`   - Unique Words: ${uniqueWords.size}`);

// 3. Calculate Coverage
let validCount = 0;
const missingWords: string[] = [];

uniqueWords.forEach(w => {
  if (knownTamilWords.has(w)) {
    validCount++;
  } else {
    missingWords.push(w);
  }
});

const coverage = (validCount / uniqueWords.size) * 100;
console.log(`\n🎯 Coverage Analysis:`);
console.log(`   - Known Words Found: ${validCount}`);
console.log(`   - Coverage Rate: ${coverage.toFixed(2)}%`);

// 4. Top Missing Words (Candidates for training)
console.log(`\n📝 Top 10 Missing Words (Add these to Dictionary!):`);
const sortedMissing = missingWords.sort((a, b) => (wordCounts.get(b) || 0) - (wordCounts.get(a) || 0));
sortedMissing.slice(0, 10).forEach(w => {
  console.log(`   - ${w} (count: ${wordCounts.get(w)})`);
});
