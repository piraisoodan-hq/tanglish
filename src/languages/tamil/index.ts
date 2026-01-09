/**
 * Tamil Language Configuration
 * Tanglish (Tamil + English) transliteration rules
 */

import type { LanguageConfig } from '../../types';
import { DICTIONARY } from '../../dictionary';
import M_PART1 from '../../mappings/part_1.json';
import M_PART2 from '../../mappings/part_2.json';
import M_PART3 from '../../mappings/part_3.json';
import M_PART4 from '../../mappings/part_4.json';
import M_PART5 from '../../mappings/part_5.json';
import M_PART6 from '../../mappings/part_6.json';

/**
 * Custom overrides for Tanglish contexts
 * These are applied BEFORE standard m17n rules
 */
const TAMIL_OVERRIDES: Array<[string, string]> = [
  // Force colloquial/tanglish pronunciations
  ['nga', 'ங்க'], // enga -> எங்க
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

  ['cha', 'ச்ச'], // vacha -> வச்ச
  ['chi', 'ச்சி'],
  ['chu', 'ச்சு'],

  ['zh', 'ழ்'],
  ['ll', 'ள்'],
  ['dr', 'ட்ர'], // podradhu -> போட்ராது
  ['ei', 'ஐ'],
  ['cl', 'க்ள'],
  ['ee', 'ஈ'],
  ['ae', 'ே'],
];

/**
 * Tamil vowel signs for uyir-mei blending
 */
const TAMIL_VOWEL_SIGNS: Array<[string, string]> = [
  ['aa', 'ா'],
  ['ai', 'ை'],
  ['au', 'ௌ'],
  ['ii', 'ீ'],
  ['uu', 'ூ'],
  ['ee', 'ே'],
  ['oo', 'ோ'],
  ['ou', 'ௌ'],
  ['i', 'ி'],
  ['u', 'ு'],
  ['e', 'ெ'],
  ['o', 'ொ'],
  ['a', ''], // Inherent 'a' removes pulli
];

/**
 * Tamil language configuration
 */
export const tamilConfig: LanguageConfig = {
  id: 'tamil',
  name: 'Tamil',
  nativeName: 'தமிழ்',
  unicodeRange: [0x0b80, 0x0bff], // Tamil Unicode block
  dictionary: DICTIONARY,
  mappings: [
    ...(M_PART1 as Array<[string, string]>),
    ...(M_PART2 as Array<[string, string]>),
    ...(M_PART3 as Array<[string, string]>),
    ...(M_PART4 as Array<[string, string]>),
    ...(M_PART5 as Array<[string, string]>),
    ...(M_PART6 as Array<[string, string]>),
  ],
  overrides: TAMIL_OVERRIDES,
  vowelSigns: TAMIL_VOWEL_SIGNS,
};

export default tamilConfig;
