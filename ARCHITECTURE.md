# Transliteration Library Architecture

## Overview

This document describes the architecture of the transliteration system, designed to support multiple Indian languages with a clean separation between core transliteration logic and editor integrations.

## Package Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    @piraisoodan/tanglish                        │
│              (Core library - 100% editor agnostic)              │
├─────────────────────────────────────────────────────────────────┤
│  • TransliterationEngine - Generic transliteration engine       │
│  • LanguageConfig interface - Plugin system for languages       │
│  • getSuggestions() - Autocomplete API                          │
│  • Works in: Node.js, Browser, CLI, Deno, Bun, anywhere         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  @piraisoodan/tanglish-tiptap                   │
│            (TipTap extension - depends on tanglish)             │
├─────────────────────────────────────────────────────────────────┤
│  • Transliteration Extension for TipTap                         │
│  • Real-time transliteration on Space/Enter                     │
│  • Suggestion popup callback support                            │
│  • Keyboard shortcuts (Ctrl+Shift+T)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      piraisoodan-tauri                          │
│                    (Application layer)                          │
├─────────────────────────────────────────────────────────────────┤
│  • Svelte UI components                                         │
│  • TanglishSuggestions.svelte popup                             │
│  • Settings management                                          │
│  • Desktop app (Tauri)                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Core Library: @piraisoodan/tanglish

### Key Types

```typescript
// Language configuration interface - implement this for new languages
interface LanguageConfig {
  id: string;                           // e.g., 'tamil', 'hindi'
  name: string;                         // e.g., 'Tamil', 'Hindi'
  nativeName: string;                   // e.g., 'தமிழ்', 'हिंदी'
  unicodeRange: [number, number];       // Unicode block range
  dictionary: Record<string, string>;   // Word mappings
  mappings: Array<[string, string]>;    // Phonetic rules
  overrides?: Array<[string, string]>;  // Priority overrides
  vowelSigns?: Array<[string, string]>; // For consonant+vowel blending
}

// Suggestion for autocomplete
interface Suggestion {
  input: string;   // Romanized text
  output: string;  // Native script
  score?: number;  // Confidence (0-1)
}
```

### Usage

```typescript
import { transliterate, getSuggestions, createTamilEngine } from '@piraisoodan/tanglish';

// Quick API
const tamil = transliterate('vanakkam');  // வணக்கம்
const suggestions = getSuggestions('van', 5);

// Engine instance
const engine = createTamilEngine();
engine.transliterate('nandri');  // நன்றி
```

### File Structure

```
tanglish/
├── src/
│   ├── index.ts          # Main exports & convenience API
│   ├── types.ts          # Core type definitions
│   ├── engine.ts         # TransliterationEngine class
│   ├── dictionary.ts     # Tamil word dictionary
│   ├── languages/
│   │   ├── index.ts      # Language exports
│   │   └── tamil/
│   │       └── index.ts  # Tamil configuration
│   └── mappings/         # Phonetic mapping JSON files
├── dist/                 # Built output
└── package.json
```

## TipTap Extension: @piraisoodan/tanglish-tiptap

### Usage

```typescript
import { Transliteration } from '@piraisoodan/tanglish-tiptap';

const editor = new Editor({
  extensions: [
    StarterKit,
    Transliteration.configure({
      enabled: true,
      minCharsForSuggestion: 2,
      maxSuggestions: 8,
      onSuggestionsUpdate: (suggestions, position) => {
        // Show your popup at position
      }
    })
  ]
});

// Commands
editor.commands.toggleTransliteration();
editor.commands.setTransliteration(true);
editor.commands.transliterateSelection();
```

### File Structure

```
tanglish-tiptap/
├── src/
│   ├── index.ts          # Main exports
│   └── extension.ts      # TipTap Extension implementation
├── dist/                 # Built output
└── package.json
```

## Adding a New Language

### Step 1: Create Language Config

Create a new file `tanglish/src/languages/hindi/index.ts`:

```typescript
import type { LanguageConfig } from '../../types';

const HINDI_DICTIONARY: Record<string, string> = {
  'namaste': 'नमस्ते',
  'dhanyavaad': 'धन्यवाद',
  // ... more words
};

const HINDI_MAPPINGS: Array<[string, string]> = [
  ['aa', 'आ'],
  ['a', 'अ'],
  // ... phonetic rules
];

export const hindiConfig: LanguageConfig = {
  id: 'hindi',
  name: 'Hindi',
  nativeName: 'हिंदी',
  unicodeRange: [0x0900, 0x097F],  // Devanagari block
  dictionary: HINDI_DICTIONARY,
  mappings: HINDI_MAPPINGS,
  vowelSigns: [
    ['aa', 'ा'],
    ['i', 'ि'],
    // ...
  ]
};

export default hindiConfig;
```

### Step 2: Export from Languages Index

Update `tanglish/src/languages/index.ts`:

```typescript
export { tamilConfig, default as tamil } from './tamil';
export { hindiConfig, default as hindi } from './hindi';  // Add this
```

### Step 3: Create Convenience Functions (Optional)

Add to `tanglish/src/index.ts`:

```typescript
import { hindiConfig } from './languages/hindi';

export function createHindiEngine(): TransliterationEngine {
  return new TransliterationEngine(hindiConfig);
}
```

### Step 4: Use in Application

```typescript
import { createEngine, hindiConfig } from '@piraisoodan/tanglish';

const hindiEngine = createEngine(hindiConfig);
hindiEngine.transliterate('namaste');  // नमस्ते
```

## Planned Languages

| Language | ID | Script | Status |
|----------|-----|--------|--------|
| Tamil | `tamil` | தமிழ் | ✅ Implemented |
| Hindi | `hindi` | हिंदी | 🔜 Planned |
| Malayalam | `malayalam` | മലയാളം | 🔜 Planned |
| Telugu | `telugu` | తెలుగు | 🔜 Planned |
| Kannada | `kannada` | ಕನ್ನಡ | 🔜 Planned |
| Bengali | `bengali` | বাংলা | 🔜 Planned |

## Build Commands

### tanglish (Core)

```bash
cd tanglish
bun install
bun run build
bun test
```

### tanglish-tiptap

```bash
cd tanglish-tiptap
bun install
bun run build
```

### piraisoodan-tauri

```bash
cd piraisoodan-tauri
nvm use 20  # Required for Node.js
npm install
npx tauri dev
```

## Important Notes

1. **Runtime**: tanglish and tanglish-tiptap use **Bun**, piraisoodan-tauri uses **Node.js 20+**
2. **Linking**: During development, packages are linked via `file:../tanglish` in package.json
3. **Vite Config**: piraisoodan-tauri needs `server.fs.allow` to serve linked packages
4. **TypeScript**: All packages use TypeScript with declaration files

## Contributing

When adding a new language:

1. Research the script's Unicode range
2. Gather common dictionary words (500+ recommended)
3. Define phonetic mapping rules
4. Create vowel signs for consonant+vowel blending
5. Add tests
6. Submit PR
