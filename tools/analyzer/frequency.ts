import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'path';
import { existsSync } from 'node:fs';

const DATA_DIR = join(import.meta.dir, '../scraper/data');
const INPUT_FILE = join(DATA_DIR, 'corpus.txt');
const OUTPUT_FILE = join(DATA_DIR, 'frequency.json');

async function main() {
  console.log('📊 Starting Frequency Analysis...');

  if (!existsSync(INPUT_FILE)) {
    console.error('❌ Corpus file not found! Run the scraper first.');
    return;
  }

  const rawText = await readFile(INPUT_FILE, 'utf-8');
  console.log(`📖 Read ${rawText.length} characters.`);

  const wordCounts: Record<string, number> = {};

  // Split by whitespace and common punctuation roughly
  // We use a regex that matches sequences of non-whitespace
  // But we really want to isolate Tamil words.
  const words = rawText.split(/[\s,.;"()\[\]]+/);
  let totalWords = 0;

  for (const word of words) {
    const w = word.trim();
    // Simple validation: must contain at least one Tamil char and be length > 1
    if (w.length > 1 && /^[\u0B80-\u0BFF]+$/.test(w)) {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
      totalWords++;
    }
  }

  console.log(`✅ Processed ${totalWords} valid Tamil words.`);
  console.log(`🧩 Unique words: ${Object.keys(wordCounts).length}`);

  // Sort by frequency
  const sorted = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a) // Descending
    .map(([word, count]) => ({ word, count }));

  // Take top 50,000 for now (or all)
  const topWords = sorted;

  await writeFile(OUTPUT_FILE, JSON.stringify(topWords, null, 2));
  console.log(`💾 Saved frequency list to ${OUTPUT_FILE}`);

  // Preview top 10
  console.log('\n🏆 Top 10 Words:');
  topWords.slice(0, 10).forEach((item, i) => {
    console.log(`${i + 1}. ${item.word} (${item.count})`);
  });
}

main().catch(console.error);
