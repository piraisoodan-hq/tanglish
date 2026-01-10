import { fetchWikiData } from './sources/wikipedia';
import { fetchMaduraiData } from './sources/project_madurai';
import { fetchCasualData } from './sources/casual_stories';
import { join } from 'path';
import { appendFile } from 'node:fs/promises';

const DATA_DIR = join(import.meta.dir, 'data');
const OUTPUT_FILE = join(DATA_DIR, 'corpus.txt');

async function main() {
  console.log('🚀 Starting Tri-Source Tamil Scraper (Wiki + Lit + Casual)...');
  console.log(`📂 Output: ${OUTPUT_FILE}`);

  const TARGET_ARTICLES = 20000; // Aim higher
  const BATCH_SIZE = 5;
  let totalCollected = 0;

  while (totalCollected < TARGET_ARTICLES) {
    const rand = Math.random();
    let batch: string[] = [];
    let source = '';

    if (rand < 0.5) {
      source = 'Wiki';
      batch = await fetchWikiData(BATCH_SIZE);
    } else if (rand < 0.75) {
      source = 'Literature';
      batch = await fetchMaduraiData(2);
    } else {
      source = 'Casual';
      batch = await fetchCasualData(3);
    }

    // Validate batch
    if (batch.length === 0) {
      // console.warn(`⚠️ No data from ${source}, retrying...`);
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    const textChunk = batch.join('\n\n') + '\n\n';
    await appendFile(OUTPUT_FILE, textChunk);

    totalCollected += batch.length;
    process.stdout.write(`\r✅ Collected: ${totalCollected} items (${source} active)`);

    // Polite delay
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('\n✨ Scraping Complete!');
}

main().catch(console.error);
