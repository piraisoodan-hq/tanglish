/**
 * Base Transliteration Engine
 * Framework-agnostic, works anywhere (Node.js, Browser, CLI, etc.)
 */

import type { LanguageConfig, Suggestion, TransliterationEngineInterface } from './types';

export class TransliterationEngine implements TransliterationEngineInterface {
  private config: LanguageConfig;
  private combinedMappings: Array<[string, string]>;

  constructor(config: LanguageConfig) {
    this.config = config;
    // Combine overrides + mappings, overrides take priority
    this.combinedMappings = [...(config.overrides || []), ...config.mappings];
  }

  getLanguage(): LanguageConfig {
    return this.config;
  }

  /**
   * Check if text contains characters from the target script
   */
  containsTargetScript(text: string): boolean {
    const [start, end] = this.config.unicodeRange;
    for (const char of text) {
      const code = char.charCodeAt(0);
      if (code >= start && code <= end) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get suggestions matching a query
   */
  getSuggestions(query: string, limit = 10): Suggestion[] {
    if (!query || query.length < 1) return [];

    const q = query.toLowerCase();
    const startsWithMatches: Suggestion[] = [];
    const includesMatches: Suggestion[] = [];

    for (const [input, output] of Object.entries(this.config.dictionary)) {
      if (input.startsWith(q)) {
        startsWithMatches.push({ input, output, score: 1.0 });
      } else if (input.includes(q)) {
        includesMatches.push({ input, output, score: 0.5 });
      }

      // Early exit if we have enough startsWith matches
      if (startsWithMatches.length >= limit) break;
    }

    return [...startsWithMatches, ...includesMatches].slice(0, limit);
  }

  /**
   * Transliterate text from romanized to native script
   */
  transliterate(text: string): string {
    if (!text) return '';

    // Split by whitespace and punctuation, preserving delimiters
    const parts = text.split(/([ \t\n\r.,!?;:'"()-]+)/);

    return parts
      .map((part) => {
        // Preserve delimiters
        if (/^[ \t\n\r.,!?;:'"()-]+$/.test(part)) return part;
        return this.transliterateWord(part);
      })
      .join('');
  }

  /**
   * Transliterate a single word
   */
  private transliterateWord(word: string): string {
    const lowerWord = word.toLowerCase();

    // Dictionary lookup first (exact match)
    if (this.config.dictionary[lowerWord]) {
      return this.config.dictionary[lowerWord];
    }

    // Phonetic transliteration
    return this.phoneticTransliterate(word);
  }

  /**
   * Apply phonetic rules for transliteration
   */
  private phoneticTransliterate(text: string): string {
    let result = '';
    let i = 0;
    const len = text.length;

    while (i < len) {
      let matchedValue: string | null = null;
      let matchedLen = 0;

      // Greedy match - try longest patterns first
      for (const [pattern, replacement] of this.combinedMappings) {
        const segment = text.substr(i, pattern.length);

        // Case-insensitive match
        if (segment.toLowerCase() === pattern.toLowerCase()) {
          matchedValue = replacement;
          matchedLen = pattern.length;
          break; // First match wins (patterns should be ordered by priority)
        }
      }

      if (matchedValue !== null) {
        // Apply vowel blending if available
        const blended = this.applyVowelBlending(matchedValue, text, i + matchedLen);
        result += blended.output;
        i += matchedLen + blended.consumedExtra;
      } else {
        // No match - keep original character
        result += text[i];
        i++;
      }
    }

    return result;
  }

  /**
   * Apply vowel blending for consonant+vowel combinations
   * (uyir-mei in Tamil, similar concept in other Indic scripts)
   */
  private applyVowelBlending(
    consonant: string,
    text: string,
    nextIndex: number
  ): { output: string; consumedExtra: number } {
    // Only apply if consonant ends with virama/pulli (்)
    if (!consonant.endsWith('்') || !this.config.vowelSigns) {
      return { output: consonant, consumedExtra: 0 };
    }

    const baseConsonant = consonant.slice(0, -1); // Remove pulli
    const remainingText = text.substr(nextIndex).toLowerCase();

    // Try to match a vowel sign
    for (const [vowelPattern, vowelSign] of this.config.vowelSigns) {
      if (remainingText.startsWith(vowelPattern.toLowerCase())) {
        return {
          output: baseConsonant + vowelSign,
          consumedExtra: vowelPattern.length,
        };
      }
    }

    // No vowel match - keep the pulli
    return { output: consonant, consumedExtra: 0 };
  }
}
