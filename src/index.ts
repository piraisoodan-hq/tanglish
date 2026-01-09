import { DICTIONARY } from './dictionary';
import M_PART1 from './mappings/part_1.json';
import M_PART2 from './mappings/part_2.json';
import M_PART3 from './mappings/part_3.json';
import M_PART4 from './mappings/part_4.json';
import M_PART5 from './mappings/part_5.json';
import M_PART6 from './mappings/part_6.json';

/**
 * Hybrid Transliteration Engine
 * Combines standard m17n rules (Greedy) + Custom Tanglish Context Logic
 */
export class TransliterationEngine {

  // Custom Overrides for "Tanglish" contexts
  // Prepend these to ensure they are matched BEFORE standard m17n rules
  private static OVERRIDES: Array<[string, string]> = [
    // Force colloquial/tanglish pronunciations
    ['nga', 'ங்க'],  // enga -> எங்க (not எங)
    ['ngaa', 'ங்கா'],
    ['ngi', 'ங்கி'],
    ['ngu', 'ங்கு'],
    ['nge', 'ங்கெ'],
    ['ngo', 'ங்கொ'],

    ['nja', 'ஞ்ச'], // konja -> கொஞ்ச
    ['nji', 'ஞ்சி'],
    ['nju', 'ஞ்சு'],

    ['nna', 'ண்ண'], // panna -> பண்ண
    ['nnu', 'ண்ணு'],

    ['cha', 'ச்ச'], // vacha -> வச்ச (medial?) - debatable at start (chai -> ச்ச?). 
    // Safest to rely on Dictionary for 'Chennai' etc.
    ['chi', 'ச்சி'],
    ['chu', 'ச்சு'],

    ['zh', 'ழ்'], ['ll', 'ள்'],
    ['dr', 'ட்ர'], // Special handler for 'podradhu' (d-r-a) -> ட்ர
    ['ei', 'ஐ'],

    ['cl', 'க்ள'],

    ['ee', 'ஈ'],
    ['ae', 'ஏ']
  ];

  private static MAPPINGS: Array<[string, string]> = [
    ...TransliterationEngine.OVERRIDES,
    ...(M_PART1 as Array<[string, string]>),
    ...(M_PART2 as Array<[string, string]>),
    ...(M_PART3 as Array<[string, string]>),
    ...(M_PART4 as Array<[string, string]>),
    ...(M_PART5 as Array<[string, string]>),
    ...(M_PART6 as Array<[string, string]>)
  ];

  static transliterate(text: string): string {
    if (!text) return '';
    const parts = text.split(/([ \t\n\r\.,!?-]+)/);
    return parts.map(part => {
      if (/^[ \t\n\r\.,!?-]+$/.test(part)) return part;
      return this.transliterateWord(part);
    }).join('');
  }

  private static transliterateWord(text: string): string {
    const lowerText = text.toLowerCase();
    if (DICTIONARY[lowerText]) return DICTIONARY[lowerText];

    // Heuristics
    // Heuristics
    let processedText = text;
    if (lowerText.startsWith('ye')) processedText = 'e' + text.substr(2);
    // REMOVED generic y+vowel rule to protect Yoga, Yaanai, etc.

    let res = '';
    let i = 0;
    const len = processedText.length;

    while (i < len) {
      let matchedVal = null;
      let matchedLen = 0;

      // Greedy Match
      for (const [key, val] of this.MAPPINGS) {
        let matches = false;
        if (processedText.startsWith(key, i)) matches = true;
        else if (key === key.toLowerCase() && processedText.substr(i, key.length).toLowerCase() === key) matches = true;

        if (matches) {
          matchedVal = val;
          matchedLen = key.length;
          break;
        }
      }

      if (matchedVal) {
        // Context Check: 'n' (Alveolar vs Dental)
        const firstChar = matchedVal[0];
        if (firstChar === 'ன' || firstChar === 'ன்') {
          const nextPart = processedText.substr(i + matchedLen);
          const isStart = (i === 0);
          const isDentalContext = /^(th|d)/i.test(nextPart);

          if (isStart || isDentalContext) {
            matchedVal = matchedVal.replace(/^ன்/, 'ந்').replace(/^ன/, 'ந');
          }
        }

        // --- UYIR-MEI LOGIC START ---
        // Look ahead for vowels to blend with this consonant
        if (matchedVal.endsWith('்')) {
          const baseConsonant = matchedVal.substring(0, matchedVal.length - 1); // Remove pulli
          let vowelSign = '';
          let vowelLen = 0;

          // Check for vowels (Greedy - longest first)
          // We need a local vowel mapping or reuse global?
          // Hardcoding common vowel signs for now or use a static map if available
          // Since I don't have UYIR_MEI_SIGNS in this file anymore? 
          // I need to RE-ADD UYIR_MEI_SIGNS to the class or defined locally.

          const VOWELS = [
            ['aa', 'ா'], ['ae', 'ே'], ['ai', 'ை'],
            ['ii', 'ீ'], ['i', 'ி'],
            ['uu', 'ூ'], ['u', 'ு'],
            ['ee', 'ே'], ['e', 'ெ'],
            ['oo', 'ோ'], ['o', 'ொ'],
            ['au', 'ௌ'], ['ou', 'ௌ'],
            ['a', ''] // Inherent 'a' removes pulli
          ];

          const nextText = processedText.substr(i + matchedLen);
          for (const [vKey, vVal] of VOWELS) {
            // Case-insensitive check
            if (nextText.toLowerCase().startsWith(vKey)) {
              vowelSign = vVal;
              vowelLen = vKey.length;
              break;
            }
          }

          if (vowelLen > 0 || (vowelLen === 0 && vowelSign === '')) {
            // Found a vowel (or inherent 'a' if we want to handle that logic, but 'a' is in array)
            // Wait, if no VOWEL matched, we keep pulli?
            // YES. `vowelLen` stays 0. `vowelSign` stays ''.
            // BUT if we matched 'a', `vowelLen` is 1, `vowelSign` is ''.
            // If we matched nothing, we append `matchedVal` (with pulli).

            if (vowelLen > 0) {
              res += baseConsonant + vowelSign;
              i += matchedLen + vowelLen;
              continue;
            }
          }
        }
        // --- UYIR-MEI LOGIC END ---

        res += matchedVal;
        i += matchedLen;
      } else {
        res += processedText[i];
        i++;
      }
    }
    return res;
  }
}
