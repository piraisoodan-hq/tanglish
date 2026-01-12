import { Trie } from './utils/trie';
import type { LanguageConfig, Suggestion, TransliterationEngineInterface } from './types';

export class TransliterationEngine implements TransliterationEngineInterface {
  private config: LanguageConfig;
  private trie: Trie;

  constructor(config: LanguageConfig) {
    this.config = config;
    this.trie = new Trie();

    // Combine overrides + mappings in priority order (First = Highest Priority)
    const allMappings = [...(config.overrides || []), ...config.mappings];

    // Insert into Trie in REVERSE order.
    // This ensures that the FIRST item in the list (Highest Priority) is inserted LAST,
    // overwriting any lower-priority duplicates.
    for (let i = allMappings.length - 1; i >= 0; i--) {
      const [key, value] = allMappings[i];
      // Strict case insertion to prevent collisions (e.g. n vs N, o vs O)
      this.trie.insert(key, value);
    }
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

    // Dictionary lookup first (exact match behavior depends on dictionary case, usually lower)
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
      const fragment = text.slice(i);
      // Find longest matching prefix (Strict Case)
      let match = this.trie.findLongestMatch(fragment);

      // Fallback: If no strict match, try lowercase match
      // This handles "Vedi" -> "vedi" -> "வெடி"
      if (match.value === null) {
        const lowerMatch = this.trie.findLongestMatch(fragment.toLowerCase());
        if (lowerMatch.value !== null) {
          match = lowerMatch;
        }
      }

      if (match.value !== null) {
        // Apply vowel blending if available
        const blended = this.applyVowelBlending(match.value, text, i + match.matchedLength);
        result += blended.output;
        i += match.matchedLength + blended.consumedExtra;
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
