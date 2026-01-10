# @piraisoodan/tanglish

A high-performance, **offline transliteration engine** for the Tamil language.

### License: MIT

## Features

- **Offline-first**: Zero latency, no API keys required
- **Context-Aware**: Handles complex phonetic rules (e.g., `n` → `ந்` vs `ன்`,
  `zh` + `i` → `ழி`)
- **1000+ Dictionary Words**: Curated dictionary for common words ensuring 100%
  accuracy on high-frequency terms
- **High Performance**: Built with Bun, optimized for speed
- **Editor Agnostic**: Works with any text editor, framework, or runtime

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
