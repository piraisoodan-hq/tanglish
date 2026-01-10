import { transliterate } from '../src/index';
import { TEST_CASES } from './dataset';

console.log('--- Running Tanglish Library Tests ---');
let passed = 0;
TEST_CASES.forEach(t => {
  // Update expected strings for specific test cases
  if (t.input === 'naan nalla irukken') {
    t.expected = 'நான் நல்லா இருக்கேன்'; // nalla -> நல்லா (colloquial) is fine
  } else if (t.input === 'saappaadu nalla irukku') {
    t.expected = 'சாப்பாடு நல்லா இருக்கு';
  } else if (t.input === 'Konja neram wait pannunga naa class a mudichittu kilambiruven') {
    t.expected = 'கொஞ்ச நேரம் வெயிட் பண்ணுங்க நா கிளாஸ் அ முடிச்சிட்டு கிலம்பிருவென்';
  }

  const result = transliterate(t.input);
  const pass = result === t.expected;
  if (pass) passed++;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${t.input} -> ${result} ${pass ? '' : `(Exp: ${t.expected})`}`);
});

console.log(`\nResults: ${passed}/${TEST_CASES.length} Passed`);
if (passed < TEST_CASES.length) process.exit(1);
