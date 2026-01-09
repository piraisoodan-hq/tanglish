/**
 * Core types for the transliteration system
 * Designed for extensibility to support multiple languages
 */

/**
 * Suggestion result for autocomplete/dropdown
 */
export interface Suggestion {
  /** The romanized/input text */
  input: string;
  /** The transliterated output in target script */
  output: string;
  /** Optional: confidence score (0-1) */
  score?: number;
}

/**
 * Language-specific suggestion (typed alias)
 */
export interface TanglishSuggestion extends Suggestion {
  /** Alias for backward compatibility */
  tanglish: string;
  tamil: string;
}

/**
 * Language configuration interface
 * Any new language (Hinglish, Manglish, etc.) must implement this
 */
export interface LanguageConfig {
  /** Unique identifier for the language */
  id: string;
  /** Display name */
  name: string;
  /** Native script name (e.g., "தமிழ்", "हिंदी") */
  nativeName: string;
  /** Unicode range for the target script [start, end] */
  unicodeRange: [number, number];
  /** Dictionary of word mappings (romanized -> native) */
  dictionary: Record<string, string>;
  /** Phonetic mapping rules (ordered by priority, longest match first) */
  mappings: Array<[string, string]>;
  /** Optional: Custom overrides applied before standard mappings */
  overrides?: Array<[string, string]>;
  /** Optional: Vowel signs for uyir-mei (consonant+vowel) blending */
  vowelSigns?: Array<[string, string]>;
}

/**
 * Transliteration engine interface
 */
export interface TransliterationEngineInterface {
  /** Get the current language */
  getLanguage(): LanguageConfig;
  /** Transliterate text from romanized to native script */
  transliterate(text: string): string;
  /** Get suggestions for autocomplete */
  getSuggestions(query: string, limit?: number): Suggestion[];
  /** Check if text contains characters from the target script */
  containsTargetScript(text: string): boolean;
}

/**
 * Event types for editor integrations
 */
export type TransliterationEvent =
  | {
      type: 'transliterate';
      input: string;
      output: string;
      language: string;
    }
  | {
      type: 'suggestion-select';
      suggestion: Suggestion;
      language: string;
    };

/**
 * Callback for transliteration events
 */
export type TransliterationCallback = (event: TransliterationEvent) => void;
