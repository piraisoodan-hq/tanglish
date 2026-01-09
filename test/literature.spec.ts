import { TransliterationEngine } from '../src/index';
import { LITERATURE_TEST_CASES } from './literature_dataset';

console.log('--- Running Literature / Textbook Tamil Tests ---');

let passed = 0;
let failed = 0;

LITERATURE_TEST_CASES.forEach((t, index) => {
  const result = TransliterationEngine.transliterate(t.input);
  const pass = result === t.expected;

  if (pass) {
    passed++;
  } else {
    failed++;
    console.log(`[FAIL] ${index + 1}. ${t.input.substring(0, 30)}...`);
    console.log(`       Got: ${result}`);
    console.log(`       Exp: ${t.expected}\n`);
  }
});

console.log(`\nResults: ${passed}/${LITERATURE_TEST_CASES.length} Passed`);
if (failed > 0) process.exit(1);
else console.log('All Literature tests passed!');
