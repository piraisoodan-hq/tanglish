import common from './data/ta_common.json';

/**
 * Curated list of common Tamil words to override the phonetic engine.
 * Loaded from JSON for better maintainability.
 */
export const DICTIONARY: Record<string, string> = common;
