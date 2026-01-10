import { describe, test, expect } from 'bun:test';
import { transliterate } from '../src/index';
import { LITERATURE_TEST_CASES } from './literature_dataset';

describe('Literature / Textbook Tamil Tests', () => {
  LITERATURE_TEST_CASES.forEach((t, index) => {
    test(`${index + 1}. ${t.input.substring(0, 50)}`, () => {
      const result = transliterate(t.input);
      expect(result).toBe(t.expected);
    });
  });
});
