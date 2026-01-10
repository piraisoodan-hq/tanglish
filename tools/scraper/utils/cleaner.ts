/**
 * Cleaner Utility
 * Removes non-Tamil content to ensure a high-quality corpus.
 */

export function cleanText(text: string): string {
  if (!text) return '';

  return text
    .split('\n') // Process line by line
    .map((line) => {
      // 1. Remove references [1], [2], etc.
      let cleaned = line.replace(/\[\d+\]/g, '');

      // 2. Remove English characters (a-z, A-Z)
      cleaned = cleaned.replace(/[a-zA-Z]+/g, ' ');

      // 3. Remove digits (optional, but good for pure language modeling)
      cleaned = cleaned.replace(/[0-9]+/g, ' ');

      // 4. Normalize whitespace (tabs, multiple spaces -> single space)
      cleaned = cleaned.replace(/\s+/g, ' ').trim();

      // 5. Filter out lines that don't satisfy minimal Tamil density
      // (If a line is mostly symbols/punctuation, discard it)
      const tamilCharCount = (cleaned.match(/[\u0B80-\u0BFF]/g) || []).length;
      if (tamilCharCount < 3) return ''; // Skip lines with < 3 tamil chars

      return cleaned;
    })
    .filter((line) => line.length > 0) // Remove empty lines
    .join('\n');
}

/**
 * Checks if a word is valid Tamil
 */
export function isValidTamilWord(word: string): boolean {
  // Must contain only Tamil chars and valid joining chars
  return /^[\u0B80-\u0BFF]+$/.test(word);
}
