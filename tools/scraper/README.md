# Tanglish Corpus Scraper

This tool builds a massive Tamil text corpus to train our AI Transliteration Engine (FST).

## Sources
1.  **Wikipedia (`wikipedia.ts`)**: formal, informational text. (50%)
2.  **Project Madurai (`project_madurai.ts`)**: Classical literature. (25%)
3.  **Casual Stories (`casual_stories.ts`)**: Conversational/Dialogue style. (25%)

## Usage

### Start Scraping
```bash
bun tools/scraper/index.ts
```
This runs indefinitely (until 20k articles). It saves data to `data/corpus.txt`.

### Analyze Frequency
```bash
bun tools/analyzer/frequency.ts
```
This reads `data/corpus.txt` and outputs `data/frequency.json` (sorted word counts).

## Output
-   `data/corpus.txt`: Raw cleaned Tamil text.
-   `data/frequency.json`: Word frequency map for FST construction.
