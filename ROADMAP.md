# Tanglish Library Roadmap

A living document tracking improvements for the @piraisoodan/tanglish library.

## 🏗️ Current Architecture (v0.2.0)

- **Engine**: Hybrid (Dictionary + Trie).
- **Performance**: <0.01ms latency (10 Million chars/sec typ.).
- **Dictionary**: ~1000+ common words (src/data/ta_common.json).
- **Lookup**: O(1) Dictionary + O(L) Trie Prefix Matching.

## ✅ Completed Goals

- [x] **Robust Scraper**: Multi-source scraping pipeline (Wiki, Literature, Casual).
- [x] **Flagship Optimization**: Replaced linear scan with **Trie** architecture.
- [x] **Strict Case Mode**: Resolved `n`/`N` and `o`/`O` ambiguities.
- [x] **Data Decoupling**: Extracted dictionary from code to JSON.
- [x] **100% Test Coverage**: Verified against 100+ complex sentences.

## 🚀 In Progress (Phase 4: Big Data)

- [ ] **Corpus Scaling**: Expand filtered corpus to 20,000+ articles.
- [ ] **Automated Training**: Feedback loop to auto-detect and add missing words.
- [ ] **Suggestion Engine**: Prefix-based autocomplete (`getSuggestions` optimization).

## 🔮 Future (Phase 5: Universal Hierarchy)

- [ ] **Wasm Port**: Port core logic to Rust for universal portability (Web/Native).
- [ ] **Monorepo Integration**: Merge into `piraisoodan` ecosystem.
- [ ] **Grammar Engine**: Context-aware grammar correction.

---
*Last updated: Jan 2026*
