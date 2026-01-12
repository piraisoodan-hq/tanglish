# @piraisoodan/tanglish

A high-performance, **offline transliteration engine** for the Tamil language.

### License: MIT

## Features

- **Offline-first**: Zero latency, no API keys required.
- **Hybrid Engine**: Combines **Dictionary Lookup** (Targeted Learning) with **Phonetic Trie** (Smart Guessing).
- **Blazing Fast**: **10 Million chars/sec** throughput (<0.01ms latency).
- **Smart Context**: Handles `n` vs `nd`, `l` vs `zh` correctly.
- **Trainable**: Includes tools to scrape, analyze, and "teach" the engine new words.
- **Editor Agnostic**: Works with any text editor, framework, or runtime.

## 🧠 How it Works: Guessing vs Training

Tanglish uses a **Hybrid Architecture** to achieve high accuracy:

1.  **Explicit Training (The Brain)**:
    - Common words (`vanakkam`, `nandri`) are stored in a specialized dictionary (`src/data/ta_common.json`).
    - **Result**: 100% Accuracy for trained words.

2.  **Smart Guessing (The Intuition)**:
    - For unknown words, it uses a **Phonetic Trie** (Prefix Tree) to "guess" the transliteration based on 600+ linguistic rules.
    - **Result**: High accuracy for names, places, and new vocabulary.

---

## 🚀 Making it Smarter (Training)

You can "teach" the engine new vocabulary using our Data Engineering pipeline.

### 1. Scrape Data (The Textbook)
Collect real-world sentences from Wikipedia, Literature, and Stories to use as a "Test Paper".

```bash
# Collect 500 random Tamil articles
bun run tools/scraper/index.ts
```

### 2. Analyze Coverage (The Exam)
Check how well the dictionary knows the new words.

```bash
bun run tools/analyze_coverage.ts
```

*Output:*
```
🎯 Coverage Analysis:
   - Known Words Found: 322
   - Coverage Rate: 4.5%
📝 Top Missing Words:
   - oru (count: 98) -> Add to Dictionary!
```

### 3. Train (Graduation)
Add the missing words to `src/data/ta_common.json`. Now the engine will never get them wrong again!

---

## Installation

```bash
# npm
npm install @piraisoodan/tanglish

# bun
bun add @piraisoodan/tanglish

# yarn
yarn add @piraisoodan/tanglish
```

## Quick Start

```typescript
import { getSuggestions, transliterate } from "@piraisoodan/tanglish";

// Simple transliteration
const tamil = transliterate("vanakkam");
console.log(tamil); // வணக்கம்

// Get suggestions for autocomplete
const suggestions = getSuggestions("van", 5);
console.log(suggestions);
// [
//   { tanglish: 'vanakkam', tamil: 'வணக்கம்' },
//   { tanglish: 'vandein', tamil: 'வந்தேன்' },
//   ...
// ]
```

## API Reference

### `transliterate(text: string): string`

Transliterate romanized text to Tamil script.

```typescript
import { transliterate } from "@piraisoodan/tanglish";

transliterate("nandri"); // நன்றி
transliterate("eppadi irukka"); // எப்படி இருக்க
transliterate("coffee kudikkalama"); // காபி குடிக்கலாமா
```

### `getSuggestions(query: string, limit?: number): TanglishSuggestion[]`

Get dictionary suggestions for autocomplete.

```typescript
import { getSuggestions } from "@piraisoodan/tanglish";

const suggestions = getSuggestions("nan", 5);
// Returns words starting with 'nan' from dictionary
```

### `createTamilEngine(): TransliterationEngine`

Create a dedicated engine instance.

```typescript
import { createTamilEngine } from "@piraisoodan/tanglish";

const engine = createTamilEngine();
engine.transliterate("vanakkam");
engine.getSuggestions("van", 10);
engine.containsTargetScript("வணக்கம்"); // true
```

### `containsTamil(text: string): boolean`

Check if text contains Tamil characters.

```typescript
import { containsTamil } from "@piraisoodan/tanglish";

containsTamil("வணக்கம்"); // true
containsTamil("hello"); // false
```

## Dictionary Coverage

The library includes 1000+ curated Tamil words across categories:

| Category       | Examples                               |
| -------------- | -------------------------------------- |
| **Greetings**  | vanakkam, nandri                       |
| **Family**     | amma, appa, akka, anna, thambi         |
| **Food**       | saapadu, dosai, idli, sambar, biriyani |
| **Time**       | inniki, naalaikki, ippo, maalai        |
| **Verbs**      | paaru, sollu, kelu, saapdu, thoongu    |
| **Emotions**   | santosham, kovam, semma, gethu         |
| **Technology** | computer, mobile, wifi, whatsapp       |
| **Numbers**    | onnu, rendu, moonu, pathu              |

## Advanced Usage

### Custom Language Configuration

```typescript
import { createEngine, type LanguageConfig } from "@piraisoodan/tanglish";

const customConfig: LanguageConfig = {
  id: "custom-tamil",
  name: "Custom Tamil",
  nativeName: "தமிழ்",
  unicodeRange: [0x0B80, 0x0BFF],
  dictionary: {
    "hello": "ஹலோ",
    // ... your custom mappings
  },
  mappings: [
    // Custom phonetic rules
  ],
};

const engine = createEngine(customConfig);
```

### Direct Dictionary Access

```typescript
import { DICTIONARY } from "@piraisoodan/tanglish";

console.log(DICTIONARY["vanakkam"]); // வணக்கம்
```

## Editor Integrations

- **TipTap/ProseMirror**: Use
  [@piraisoodan/tanglish-tiptap](https://github.com/desingh-rajan/tanglish-tiptap)
- **CodeMirror**: Coming soon
- **Monaco Editor**: Coming soon

## Compatibility

| Runtime     | Support |
| ----------- | ------- |
| Node.js 18+ | ✅      |
| Bun         | ✅      |
| Deno        | ✅      |
| Browser     | ✅      |

| Bundler | Support |
| ------- | ------- |
| Vite    | ✅      |
| Webpack | ✅      |
| Rollup  | ✅      |
| esbuild | ✅      |

## Development

```bash
# Clone
git clone https://github.com/desingh-rajan/tanglish.git
cd tanglish

# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build
```

## Contributing

Contributions are welcome! See [ARCHITECTURE.md](./ARCHITECTURE.md) for details
on the project structure.

## License

MIT © [Piraisoodan Team](https://github.com/desingh-rajan)

## Related Projects

- [@piraisoodan/tanglish-tiptap](https://github.com/desingh-rajan/tanglish-tiptap) -
  TipTap editor extension
