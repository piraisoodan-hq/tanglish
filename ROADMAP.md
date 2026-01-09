# Tanglish Library Roadmap

A living document tracking improvements needed as we integrate with Piraisoodan.

## Current Architecture

- **Dictionary**: ~400 word entries in `Record<string, string>` (src/dictionary.ts)
- **Mappings**: ~500 phonetic rules in 6 JSON files (src/mappings/)
- **Loading**: Eager - all data loaded at import time
- **Lookup**: O(1) dictionary hash + O(n) greedy mapping scan

## Completed

- [x] Basic transliteration engine with dictionary + phonetic rules
- [x] TipTap extension for selection-based transliteration
- [x] Custom overrides for Tanglish colloquial patterns (nga, nja, nna, cha, zh, ll)
- [x] Context-aware 'n' handling (Alveolar ன vs Dental ந)

## In Progress

- [ ] Real-time transliteration (as-you-type on Space/Enter)
- [ ] Toggle command for enabling/disabling real-time mode
- [ ] Integration with Piraisoodan editor

## Improvements Needed (from Piraisoodan Integration)

<!-- Add items here as we discover needs during integration -->

### Suggestion Engine

- [ ] `getSuggestions(query, limit)` API for prefix matching
- [ ] Return array of `{ tanglish, tamil }` for popup display
- [ ] Consider fuzzy matching for typos

### Storage & Performance

- [ ] Evaluate SQLite for larger dictionary (via tauri-plugin-sql)
- [ ] Frequency tracking for suggestion ranking
- [ ] LRU cache for hot words
- [ ] Lazy loading for less common words

### Dictionary Expansion

- [ ] User-added words storage
- [ ] Pipe syntax for multiple suggestions (`nandri|நன்றி|நன்றிகள்`)
- [ ] Category/domain tagging (formal, colloquial, technical)

### Online Features (Future)

- [ ] Google Indic API fallback when online
- [ ] Sync user dictionary across devices

---

*Last updated: January 2026*
