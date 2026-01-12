import { fetchWikiData } from './sources/wikipedia';
import { fetchMaduraiData } from './sources/project_madurai';
import { fetchCasualData } from './sources/casual_stories';
import { join } from 'path';
import { appendFile } from 'node:fs/promises';
import type { ScrapedItem } from './types';

const DATA_DIR = join(import.meta.dir, 'data');
const OUTPUT_FILE = join(DATA_DIR, 'corpus.jsonl');

async function main() {
  console.log('🚀 Starting Tri-Source Tamil Scraper (Wiki + Lit + Casual)...');
  console.log(`📂 Output: ${OUTPUT_FILE}`);

  // Demo Scale: 500 for immediate verification (User can change to 20000 later)
  const TARGET_ARTICLES = 500;
  const BATCH_SIZE = 10;
  let totalCollected = 0;

  console.log(`🎯 Target: ${TARGET_ARTICLES} items`);

  while (totalCollected < TARGET_ARTICLES) {
    const rand = Math.random();
    let batch: ScrapedItem[] = [];
    let source = '';

    try {
      if (rand < 0.6) { // Boost Wiki (Science/Education)
        source = 'Wiki';
        batch = await fetchWikiData(BATCH_SIZE);
      } else if (rand < 0.8) {
        source = 'Literature';
        batch = await fetchMaduraiData(3);
      } else {
        source = 'Casual';
        batch = await fetchCasualData(5);
      }
    } catch (e: any) {
      console.error(`❌ Error fetching ${source}:`, e.message);
      continue;
    }

    // Validate batch
    if (batch.length === 0) {
      // Retry immediately
      continue;
    }

    // Convert to JSONL
    const jsonLines = batch.map((item) => JSON.stringify(item)).join('\n') + '\n';
    await appendFile(OUTPUT_FILE, jsonLines);

    totalCollected += batch.length;
    process.stdout.write(`\r✅ Collected: ${totalCollected} items (${source} active)`);

    // Minimal delay for burst scraping
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log('\n✨ Scraping Complete!');
}

main().catch(console.error);
