/**
 * Tanglish - Romanized to Native Script Transliteration Library
 *
 * A framework-agnostic transliteration engine supporting multiple Indian languages.
 * Currently supports Tamil (Tanglish), with architecture ready for:
 * - Hindi (Hinglish)
 * - Malayalam (Manglish)
 * - Telugu (Tenglish)
 * - And more...
 *
 * @example Basic Usage
 * ```typescript
 * import { createTamilEngine, transliterate, getSuggestions } from 'tanglish';
 *
 * // Quick transliteration
 * const tamil = transliterate('vanakkam');  // வணக்கம்
 *
 * // Get suggestions for autocomplete
 * const suggestions = getSuggestions('van', 5);
 * // [{ input: 'vanakkam', output: 'வணக்கம்' }, ...]
 *
 * // Or use the engine directly
 * const engine = createTamilEngine();
 * engine.transliterate('nandri');  // நன்றி
 * ```
 *
 * @packageDocumentation
 */

// Core types
export type {
  Suggestion,
  TanglishSuggestion,
  LanguageConfig,
  TransliterationEngineInterface,
  TransliterationEvent,
  TransliterationCallback,
} from './types';

// Core engine
export { TransliterationEngine } from './engine';

// Language configs
export { tamilConfig } from './languages/tamil';
export * from './languages';

// Dictionary (for direct access if needed)
export { DICTIONARY } from './dictionary';

// ============================================
// Convenience API (Tamil as default)
// ============================================

import { TransliterationEngine } from './engine';
import { tamilConfig } from './languages/tamil';
import type { TanglishSuggestion } from './types';

// Singleton instance for convenience methods
let defaultEngine: TransliterationEngine | null = null;

/**
 * Get or create the default Tamil engine
 */
function getDefaultEngine(): TransliterationEngine {
  if (!defaultEngine) {
    defaultEngine = new TransliterationEngine(tamilConfig);
  }
  return defaultEngine;
}

/**
 * Create a new Tamil transliteration engine
 */
export function createTamilEngine(): TransliterationEngine {
  return new TransliterationEngine(tamilConfig);
}

/**
 * Create an engine for any supported language
 */
export function createEngine(config: import('./types').LanguageConfig): TransliterationEngine {
  return new TransliterationEngine(config);
}

/**
 * Transliterate text using the default Tamil engine
 * @param text - Romanized text to transliterate
 * @returns Transliterated Tamil text
 */
export function transliterate(text: string): string {
  return getDefaultEngine().transliterate(text);
}

/**
 * Get suggestions for autocomplete using the default Tamil engine
 * @param query - Partial romanized text
 * @param limit - Maximum number of suggestions
 * @returns Array of suggestions
 */
export function getSuggestions(query: string, limit = 10): TanglishSuggestion[] {
  const suggestions = getDefaultEngine().getSuggestions(query, limit);
  // Map to TanglishSuggestion for backward compatibility
  return suggestions.map((s) => ({
    ...s,
    tanglish: s.input,
    tamil: s.output,
  }));
}

/**
 * Check if text contains Tamil characters
 */
export function containsTamil(text: string): boolean {
  return getDefaultEngine().containsTargetScript(text);
}
