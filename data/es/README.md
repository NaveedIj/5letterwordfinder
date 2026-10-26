# Spanish Word Datasets (/data/es/)

**Project:** `5letterwordfindertool.com`  
**Directory:** `/data/es/`  
**Purpose:** Lexical datasets for the Spanish 5-Letter Word Finder (`/es/`) release.

---

## 1. Datasets Overview

This directory contains the two release JSON datasets loaded by `/js/script-es.js`:

| File | Entry Count | Format | Description & Usage |
|---|---|---|---|
| `wordle-common.json` | 373 | JSON Array (lowercase) | Curated 5-letter Spanish vocabulary representing common daily Wordle solutions. Preserves orthographic accents (`á, é, í, ó, ú`) and the letter `ñ`. Loaded in **Modo Wordle**. |
| `dictionary.json` | 10,836 | JSON Array (lowercase) | Broad 5-letter Spanish dictionary for comprehensive word finding. Preserves the independent letter `ñ` (424 entries). Loaded in **Diccionario completo**. |

---

## 2. Provenance and Licensing

### `data/es/dictionary.json` (Broad Dictionary)
- **Source Repository:** [lorenbrichter/Words](https://github.com/lorenbrichter/Words)
- **Source File:** `Words/es.txt`
- **License:** [Creative Commons Zero v1.0 Universal (CC0 1.0) Public Domain Dedication](https://github.com/lorenbrichter/Words/blob/master/LICENSE)
- **Extraction & Verification:**
  - Contains all 10,836 five-letter words from `Words/es.txt` (100% verified 1-to-1 match).
  - Preserves the independent Spanish letter `ñ` (424 entries).
  - Stored in pure lowercase without duplicates.
- **Orthography Note:** The upstream source lexicon is unaccented (vowels appear without acute accents). The finder engine (`js/script-es.js`) performs accent folding during search queries. This list serves as a broad dictionary for anagram and puzzle solving, not as a curated list of daily Wordle answers.

### `data/es/wordle-common.json` (Common Wordle Targets)
- **Provenance:** Project-curated target list of 373 frequent Spanish 5-letter words with standard orthographic accents preserved.
- **Upstream Verification:** Separate upstream provenance has not been verified; the list was curated specifically for this project as common daily Wordle solutions.
- **Usage:** Serves as the focused default target list for daily puzzle solving.
