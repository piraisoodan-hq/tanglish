import { createTamilEngine } from '../src/index';

const engine = createTamilEngine();

const TEST_SENTENCES = [
  "vanakkam eppadi irukkeenga",
  "naan nalla irukken",
  "indha ulagam migavum periyadhu",
  "thozhirpuratchi makkal vaazhkaiyile maatrangalai konduvandhadhu",
  "iyarkai valangal paadhukakka pada vendum",
];

const REPEAT_COUNT = 10000;

console.log(`🚀 Benchmarking Tanglish Engine (Vanilla)...`);
console.log(`Running ${REPEAT_COUNT} iterations per sentence.\n`);

let totalChars = 0;
const start = performance.now();

for (let i = 0; i < REPEAT_COUNT; i++) {
  for (const sentence of TEST_SENTENCES) {
    engine.transliterate(sentence);
    totalChars += sentence.length;
  }
}

const end = performance.now();
const duration = end - start;
const avgLatency = duration / (REPEAT_COUNT * TEST_SENTENCES.length);
const charsPerSec = (totalChars / (duration / 1000)).toFixed(2);

console.log(`Total Time: ${duration.toFixed(2)}ms`);
console.log(`Total Chars Processing: ${totalChars}`);
console.log(`Throughput: ${charsPerSec} chars/sec`);
console.log(`Average Latency per Sentence: ${avgLatency.toFixed(4)}ms`);

if (avgLatency > 1.0) {
  console.log(`\n⚠️  Status: SLOW. Needs optimization (< 1ms target).`);
} else {
  console.log(`\n✅ Status: FAST. Ready for production.`);
}
