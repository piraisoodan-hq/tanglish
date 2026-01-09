# @piraisoodan/tanglish

A high-performance, rule-based **English-to-Tamil Transliteration Engine** optimized for offline usage. 
Built with TypeScript and optimized for Bun, but fully compatible with Node.js, Vite, and other bundlers.

## Features

- **Offline-first**: Zero latency, no API keys required.
- **Context-Aware**: Handles complex phonetic rules (e.g., `n` -> `ந்` vs `ன்`, `zh` + `i` -> `ழி`).
- **Hybrid Dictionary**: Includes a curated dictionary for common words to ensure 100% accuracy on high-frequency terms (`vanakkam`, `saviya`), overriding heuristic rules.
- **Blazing Fast**: Test suite runs in <100ms using Bun.

## Installation

This package is part of the Piraisoodan monorepo.

```bash
# In the root package.json
"dependencies": {
  "@piraisoodan/tanglish": "workspace:*"
}
```

## Usage

```typescript
import { TransliterationEngine } from '@piraisoodan/tanglish';

const tamilText = TransliterationEngine.transliterate('Vanakkam');
console.log(tamilText); // வணக்கம்
```

## Development & Testing

This package uses **Bun** for development and testing to achieve high performance.

```bash
# Run all tests
bun test

# Watch mode
bun test --watch
```

### Compatibility
- **Runtime**: Works in any JavaScript environment (Node.js, Browser, Bun).
- **Bundlers**: Fully compatible with Vite, Webpack, Rollup (as it exports standard TypeScript/JavaScript).

## Architecture

- `src/index.ts`: Main entry point containing the logic.
- `src/dictionary.ts`: Hardcoded overrides for specific words.
- `src/mappings`: Split JSON mapping files for phonetic rules.
