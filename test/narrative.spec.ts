import { TransliterationEngine } from '../src/index';
import { NARRATIVE_TEST_CASES } from './narrative_dataset';

let passed = 0;
let failed = 0;

console.log(`--- Running Tanglish Narrative Tests (${NARRATIVE_TEST_CASES.length} Scenarios) ---`);

NARRATIVE_TEST_CASES.forEach(t => {
  const result = TransliterationEngine.transliterate(t.input);
  if (result === t.expected) {
    passed++;
  } else {
    failed++;
    console.log(`[FAIL] ${t.id}. ${t.input}`);
    console.log(`       Got: ${result}`);
    console.log(`       Exp: ${t.expected}\n`);
  }
});

console.log(`\nResults: ${passed}/${NARRATIVE_TEST_CASES.length} Passed`);
if (failed > 0) {
  console.log('Some narrative tests failed.');
  process.exit(1);
} else {
  console.log('All narrative tests passed!');
}
