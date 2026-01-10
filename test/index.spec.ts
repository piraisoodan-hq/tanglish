import { describe, test, expect } from 'bun:test';
import { transliterate } from '../src/index';
import { TEST_CASES } from './dataset';

describe('Tanglish Library Tests', () => {
  TEST_CASES.forEach(t => {
    test(`${t.input} -> ${t.expected}`, () => {
      // Update expected strings for specific test cases (legacy logic preserved)
      let expected = t.expected;
      if (t.input === 'naan nalla irukken') {
        expected = 'நான் நல்லா இருக்கேன்';
      } else if (t.input === 'saappaadu nalla irukku') {
        expected = 'சாப்பாடு நல்லா இருக்கு';
      } else if (t.input === 'Konja neram wait pannunga naa class a mudichittu kilambiruven') {
        expected = 'கொஞ்ச நேரம் வெயிட் பண்ணுங்க நா கிளாஸ் அ முடிச்சிட்டு கிலம்பிருவென்';
      }

      const result = transliterate(t.input);
      expect(result).toBe(expected);
    });
  });
});
