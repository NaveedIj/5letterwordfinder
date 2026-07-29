# SEO Remediation Engineering Specification — 2026

**Status:** Approved
**Scope:** 5-letter-word-finder codebase — programmatic SEO pages
**Cycle:** FIX 1 → FIX 4 (complete)

This document is the canonical engineering specification for the 2026 SEO
remediation effort. It is not a changelog to be archived and forgotten — it
is the reference that future SEO, generator, or content changes should be
checked against.

---

## 1. Executive Summary

Google Search Console reported "Discovered – currently not indexed" and
"Redirect error" states for multiple programmatic pages despite clean
Screaming Frog crawls (200 OK, canonical present, title/meta present). A
forensic audit found that pass/fail crawler checks do not detect
**semantic contradictions** — a page can be perfectly crawlable and still
tell Google conflicting things about its own identity.

Four confirmed, evidence-verified defects were remediated:

| Fix | Defect | Root Cause |
|---|---|---|
| FIX 1 | Homepage `WebPage` schema values leaking into child pages | Master template `@graph` block copied verbatim into generated pages |
| FIX 2 | Duplicate `FAQPage` schema per page | Legacy static FAQ block never removed when generator started injecting into `@graph` |
| FIX 3 | Hero tagline/H1/subtitle mismatched with page content | Historical source-of-truth drift between static HTML and `seo-data.js` |
| FIX 4 | No mechanism preventing regression of the above | Legacy generator scripts could silently overwrite fixed pages; unsafe string-based JSON construction |

No URL structure, routing, homepage design, or new pages were touched.
This was a template/generator/architecture remediation only.

---

## 2. Background & Root Cause Analysis

### 2.1 Why Screaming Frog passed but Google hesitated

Screaming Frog validates HTTP status, canonical presence, and meta tag
existence per-page in isolation. Google's indexing pipeline additionally
evaluates **cross-page consistency**: whether a page's JSON-LD `@id`/`url`
agrees with its canonical tag, whether structured data is duplicated, and
whether visible content matches the page's declared identity. A page can
pass every Screaming Frog check and still emit self-contradictory signals
that reduce indexing confidence.

### 2.2 How the drift was introduced

- `index.html` was used as the master template for `3`, `6`, `7`, `4`, and
  `8`-letter finder pages. Its `@graph` JSON-LD block (Organization,
  WebSite, WebPage, WebApplication, FAQPage — all describing the
  homepage) was copied into child pages without being made page-specific.
- `seo-data.js` was introduced **after** several pages (`4`, `7`, `8`-letter)
  already existed as manually authored static HTML. Those pages were never
  back-filled to consume the new source of truth, creating **historical
  drift** rather than a design decision (this was verified directly from
  the codebase during FIX 3 review, not assumed).
- Multiple independent generator/injection scripts were built over time
  (`generate-finder-pages.js`, `generate-n-o.js`,
  `update-ending-pages.js`, `inject-remaining-pages.js`,
  `build-programmatic-seo.js`) with no shared ownership model, so no
  single script — and no human — had a complete picture of which script
  owned which page or section.

### 2.3 Scope boundary

This remediation deliberately did **not**:
- Change URL structure, routing, or redirects (`vercel.json`)
- Redesign the homepage or UI
- Create new pages
- Touch `robots.txt` or sitemap generation

These remain open items for a future, separately-scoped review (see
Section 13).

---

## 3. Architecture Overview

```
seo-data.js  (single source of truth for Hero, Metadata, FAQ text)
     │
     ▼
generate-finder-pages.js  ──generates──▶  3-letter-word-finder.html
     │                                     6-letter-word-finder.html
     │  (JSON.stringify-based FAQPage
     │   serialization; escaped-template
     │   WebPage serialization)
     ▼
 [ALLOW_LEGACY_GEN guard]

Manually maintained (aligned to seo-data.js, not generator-owned):
 ├── 4-letter-word-finder.html
 ├── 7-letter-word-finder.html
 └── 8-letter-word-finder.html

Legacy generators (locked behind ALLOW_LEGACY_GEN):
 ├── generate-n-o.js            → starting-with-n.html, starting-with-o.html
 │                                 (independent hardcoded source; no
 │                                  seo-data.js entry exists for n/o)
 ├── update-ending-pages.js     → starting-with-s.html, ending-with-e.html
 │                                 (content/metadata verified in sync;
 │                                  schema structure diverges — standalone
 │                                  FAQPage outside @graph)
 └── inject-remaining-pages.js  → SEO prose + FAQ on ending-with-{e,s,t,y}
                                    and on 3/4/6/7/8-letter pages
                                    (does NOT touch Hero, Metadata, or
                                    JSON-LD on those pages — verified)

Build utilities (not page-owning, low risk):
 ├── build-programmatic-seo.js  → word grids for ALL 26 starting-letter
 │                                 pages (a–z) + 4 ending-letter pages
 │                                 (e, s, t, y) — corrected from an
 │                                 earlier, inaccurate A–M/P–Z split
 └── build-words-by-length.js   → words-by-length.js data file only
```

See `docs/architecture.md` for the standalone diagram.

---

## 4. Ownership Matrix

| Script | Owns Pages (exact) | Owns Sections | Data Source | Sync Status w/ `seo-data.js` |
|---|---|---|---|---|
| `generate-finder-pages.js` | `3-letter-word-finder.html`, `6-letter-word-finder.html` | Metadata, Hero (H1/tagline/subtitle), `@graph` WebPage, `@graph` FAQPage, SEO guide prose | `seo-data.js` | **Verified In Sync** |
| `generate-n-o.js` | `5-letter-words-starting-with-n.html`, `...-with-o.html` | Metadata, headings, static SEO content, static FAQs | Hardcoded `nData`/`oData` in-script | **Independent Source of Truth** — no `seo-data.js` entry exists for n/o; not "drifted," simply not wired in |
| `update-ending-pages.js` | `5-letter-words-starting-with-s.html`, `...-ending-with-e.html` | SEO logic tags, standalone `FAQPage`, title/description/canonical | `seo-data.js` (`5-starting-s`, `5-ending-e`) | **Content: Verified In Sync.** **Metadata: Verified In Sync.** **Schema structure: Verified Out of Sync** (standalone FAQPage outside `@graph`) |
| `inject-remaining-pages.js` | SEO guide prose + FAQ on `ending-with-{e,s,t,y}.html` and on `3/4/6/7/8-letter-word-finder.html` | SEO guide prose, static FAQ `<details>`, related links | Hardcoded `pageData` in-script | **Verified Out of Sync** (independent hardcoded text). **Confirmed does NOT modify:** Hero (H1/tagline/subtitle), Metadata, or JSON-LD on any page it touches |
| `build-programmatic-seo.js` | All 26 starting-letter pages (a–z) + 4 ending-letter pages (e, s, t, y) | Word grid (`<div id="wordGrid">`), canonical, robots | `words_alpha.txt` | Not Applicable (data-grid builder, no SEO text) |
| `build-words-by-length.js` | None (data builder) | `words-by-length.js` | `words.js` | Not Applicable |

**Manually maintained pages (no generator owns them):**
`4-letter-word-finder.html`, `7-letter-word-finder.html`,
`8-letter-word-finder.html`, `index.html`, `about.html`, `contact.html`,
`privacy.html`, `game.html`, `ai-word-solver.html`.

**Never verified for `seo-data.js` parity (open item — see Section 13):**
Starting-letter pages `b` through `z` except `a, n, o, s`; ending-letter
pages `s, t, y` except `e`.

---

## 5. Source of Truth Matrix

| Component | Canonical Source | Consuming Scripts | Manual Consumers |
|---|---|---|---|
| Hero (H1, tagline, subtitle) | `seo-data.js` | `generate-finder-pages.js` | `4`, `7`, `8`-letter pages (manually aligned in FIX 3) |
| Metadata (title, description, canonical, OG, Twitter) | `seo-data.js` | `generate-finder-pages.js`, `update-ending-pages.js` | `4`, `7`, `8`-letter pages |
| JSON-LD `@graph` (Organization, WebSite, WebPage, WebApplication) | HTML template / `generate-finder-pages.js` | `generate-finder-pages.js` | `4`, `7`, `8`-letter pages |
| JSON-LD `FAQPage` | `seo-data.js` | `generate-finder-pages.js` (consolidated into `@graph`) | `update-ending-pages.js` still injects standalone (known deviation, tracked) |
| Static SEO prose | `seo-data.js` (finder pages) / hardcoded (`n`, `o`, letter pages) | `generate-finder-pages.js`, `update-ending-pages.js`, `inject-remaining-pages.js` | — |
| Word grid content | `words_alpha.txt` / `words-by-length.js` | `build-programmatic-seo.js` | — |
| Internal links | `seo-data.js` (`INTERNAL_LINKS`) + HTML footers | `generate-finder-pages.js`, `update-ending-pages.js` | `4`, `7`, `8`-letter pages, `index.html` |

---

## 6. Engineering Invariants

These must remain true after every future change. Any PR that would make
one of these false requires explicit review sign-off, not silent
acceptance.

- Every page's `WebPage` JSON-LD entity exposes **its own** `@id`, `url`,
  and `name` — never the homepage's.
- Exactly **one** authoritative `FAQPage` schema exists per page.
- Hero content (H1, tagline, subtitle) matches the page's designated
  canonical source (`seo-data.js` where applicable).
- Pages owned by a generator are only ever modified **by re-running that
  generator**, never by hand-editing the generated HTML.
- Legacy generators (`generate-n-o.js`, `update-ending-pages.js`,
  `inject-remaining-pages.js`) cannot execute without
  `ALLOW_LEGACY_GEN=1` set explicitly.
- Every SEO-affecting change ships with: a diff, JSON-LD validation
  output, a regression check against the invariants above, and review
  sign-off.
- No classification ("in sync," "intentional," "safe") is accepted in a
  report without the underlying code evidence attached.

---

## 7. Approved Design Decisions

**WebPage uses escaped-template string replacement, not
`JSON.stringify()`.**
`WebPage` fields are flat strings (`@id`, `url`, `name`, `description`)
already generated via `.replace()` with `.replace(/"/g, '\\"')`
escaping. `FAQPage` was migrated to `JSON.stringify()` because its
`mainEntity` is a nested array where structured serialization has
material safety benefit. This is an intentional, evidence-verified
split — not an inconsistency.

**`FAQPage` is consolidated inside `@graph`, not standalone.**
Standalone `<script type="application/ld+json">` FAQ blocks were removed
from `generate-finder-pages.js` output. `update-ending-pages.js` still
produces a standalone block — this is a **known, tracked deviation**,
not a hidden defect (see Section 13).

**`WebApplication` remains homepage-anchored across all pages
("Option A").**
The tool is treated as a single global application entity, consistent
with `Organization` and `WebSite`. This was a deliberate architectural
choice, applied uniformly — not leakage.

**Legacy generators are locked, not deleted.**
`generate-n-o.js`, `update-ending-pages.js`, and
`inject-remaining-pages.js` still have legitimate one-time uses but are
unsafe to re-run blindly. They are gated behind `ALLOW_LEGACY_GEN`
rather than removed, preserving optionality while preventing accidental
execution.

---

## 8. Review Methodology

Every fix in this cycle followed the same cycle, and future SEO changes
should too:

1. **Claim** — implementer states what changed and why.
2. **Evidence** — full untruncated diff, before/after snippets,
   validation output (JSON parse, site-wide audit).
3. **Cross-check** — evidence is checked against the claim, not accepted
   at face value. Contradictions between report wording and diff content
   are treated as blocking, not cosmetic.
4. **Regression check** — explicit confirmation that no previously
   approved fix was undone, with a full site-wide audit table.
5. **Sign-off** — approval is recorded only once claim and evidence
   agree.

Notable pattern from this cycle: reports labeling something
"intentional" or "safe" without supporting evidence were treated as a
signal to investigate further, not a reason to proceed. This surfaced
real issues twice (the 7-letter H1/subtitle change described as
"tagline-only," and the 4/8-letter "intentionally custom" classification
that turned out to be undocumented legacy drift).

---

## 9. Validation Standards

Every SEO-affecting change must produce:

- `JSON.parse()` (or equivalent) output proving JSON-LD validity for
  every touched file
- A site-wide audit table (`LDs`, `FAQs`, `Graph`, `WebApp`, `Bread`,
  `EmptyInfo` or equivalent) run **before and after**
- Confirmation that Rich Results / Schema.org structural requirements
  are preserved
- `git status` confirming the exact file set touched matches the
  intended scope — nothing more

---

## 10. Regression Strategy

- **Execution guard:** `generate-n-o.js`, `update-ending-pages.js`, and
  `inject-remaining-pages.js` exit with status 1 unless
  `ALLOW_LEGACY_GEN=1` is set.
- **Structured serialization:** `FAQPage` generation uses
  `JSON.stringify()` rather than manual string interpolation, removing
  an escaping-related corruption risk.
- **Single generator per owned page:** pages generated by
  `generate-finder-pages.js` are never manually hand-edited; manual
  pages are never partially regenerated by a script that doesn't fully
  own them.
- **Audit script as a standing tool:** `scratch/audit-full-site.js`
  should be promoted to a first-class `npm run audit` command and run
  before every deploy touching SEO templates.

---

## 11. Deployment Procedure

1. **Commit** each fix separately (see suggested messages in Section
   12) rather than shipping FIX 1–4 as one undifferentiated commit.
2. **Pre-deploy validation:** re-run JSON-LD validation and the
   site-wide audit on the final committed state.
3. **Staged rollout of indexing requests** — do not submit all affected
   URLs to GSC at once:
   - Days 1–3: highest-value pages (`3, 4, 5, 6, 7`-letter finders).
     Wait for crawl confirmation; check URL Inspection, Rich Results,
     rendered HTML, canonical, and structured data.
   - Then progressively submit remaining pages.
4. **Post-deployment checks per page:** GSC URL Inspection, Rich
   Results Test, View Source (not DOM inspector), JSON-LD validator,
   canonical URL, structured data count, hero parity, sitemap presence.
5. **Monitoring window:** observe Search Console indexing status for
   2–4 weeks. A lack of immediate improvement is not itself evidence of
   failure — indexing is also influenced by crawl budget and site
   authority, which this remediation does not control.

---

## 12. Suggested Commit History

```
FIX 1: Correct WebPage schema generation for finder pages

Homepage WebPage JSON-LD values (@id, url, name, description)
were leaking into generated finder pages, producing conflicting
page identity signals. Generate page-specific WebPage entities
so each page exposes its own canonical metadata.

FIX 2: Consolidate FAQPage into primary @graph

Remove duplicate standalone FAQPage schema and retain a single
authoritative FAQPage entity within the primary @graph to avoid
duplicate structured-data definitions.

FIX 3: Synchronize finder hero content with canonical source

Align H1, tagline and subtitle with seo-data.js to eliminate
historical source-of-truth drift between generated and manually
maintained finder pages.

FIX 4: Harden generator output and protect legacy scripts

Use structured JSON serialization for FAQPage generation and add
execution guards to legacy generators to prevent accidental
regression of approved pre-rendered pages.
```

---

## 13. Open Items (Explicitly Out of Scope for This Cycle)

These were surfaced during the review but deliberately not fixed here,
to keep each cycle scoped and reviewable:

- **Starting/ending-letter page parity never verified** — pages `b`
  through `z` (except `a, n, o, s`) and ending `s, t, y` (except `e`)
  have not been checked against `seo-data.js` using the same
  evidence-based process used for the finder pages.
- **`update-ending-pages.js` standalone FAQPage** — still produces
  schema outside `@graph` when run; tracked as a known deviation, not
  yet remediated.
- **URL/redirect consistency** (`vercel.json` mixed `.html`/clean-URL
  patterns) — reviewed and documented in the original forensic audit,
  intentionally not touched in this cycle per the "no URL changes
  without a migration plan" constraint.
- **Content freshness of `n`/`o` static FAQ/prose** — confirmed
  functionally independent of `seo-data.js` but never compared for
  quality/accuracy against the newer finder-page content style.

---

## 14. Change Log

| Fix | Summary | Files Touched |
|---|---|---|
| FIX 1 | Page-specific `WebPage` JSON-LD | `3-letter-word-finder.html`, `6-letter-word-finder.html`, `generate-finder-pages.js` |
| FIX 2 | Consolidated `FAQPage` into `@graph` | Same as above |
| FIX 3 | Hero (H1/tagline/subtitle) aligned to `seo-data.js` | `3, 4, 6, 7, 8-letter-word-finder.html`, `seo-data.js`, `generate-finder-pages.js` |
| FIX 4 | Generator hardening: `JSON.stringify()` FAQ serialization, `ALLOW_LEGACY_GEN` execution guards | `generate-finder-pages.js`, `generate-n-o.js`, `update-ending-pages.js`, `inject-remaining-pages.js` |

---

## 15. Lessons Learned

- **A clean crawler report is not proof of indexability.** Screaming
  Frog validates per-page mechanics; Google additionally evaluates
  cross-page semantic consistency.
- **"Intentional" is a claim, not a classification** — it requires the
  same evidence bar as any other technical assertion. Two separate
  findings in this cycle (7-letter hero scope, 4/8-letter "intentionally
  custom" labeling) turned out to be undocumented drift once actually
  checked.
- **Summaries are not evidence.** Report prose describing a diff is not
  a substitute for the diff itself; several rounds of this review
  existed specifically to close that gap.
- **Architecture before implementation** reduced rework: the Ownership
  and Source of Truth matrices, built during FIX 4 planning, would have
  prevented some of the FIX 1–3 ambiguity if they had existed from the
  start.
