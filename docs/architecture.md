# Architecture — Generator & Ownership Map

Quick-reference diagram. For full detail (sync status, evidence, risks),
see `seo-remediation-2026.md`, Sections 3–5.

```
seo-data.js  (single source of truth: Hero, Metadata, FAQ text)
     │
     ▼
generate-finder-pages.js
     │  - JSON.stringify()-based FAQPage serialization
     │  - escaped-template WebPage serialization
     ▼
 ┌─────────────────────────────┐
 │ 3-letter-word-finder.html   │  ◀── Verified In Sync
 │ 6-letter-word-finder.html   │  ◀── Verified In Sync
 └─────────────────────────────┘

Manually maintained (aligned to seo-data.js, NOT generator-owned):
 ├── 4-letter-word-finder.html
 ├── 7-letter-word-finder.html
 └── 8-letter-word-finder.html

Legacy generators — locked behind ALLOW_LEGACY_GEN:
 ├── generate-n-o.js
 │      → starting-with-n.html, starting-with-o.html
 │      → Independent source (no seo-data.js entry for n/o)
 │
 ├── update-ending-pages.js
 │      → starting-with-s.html, ending-with-e.html
 │      → Content/Metadata: In Sync | Schema: standalone FAQPage
 │        (outside @graph — known deviation, tracked)
 │
 └── inject-remaining-pages.js
        → SEO prose + FAQ on ending-with-{e,s,t,y}.html
          and on 3/4/6/7/8-letter-word-finder.html
        → Confirmed: does NOT touch Hero, Metadata, or JSON-LD

Build utilities — not page-owning, low risk:
 ├── build-programmatic-seo.js
 │      → word grids for ALL 26 starting-letter pages (a–z)
 │        + 4 ending-letter pages (e, s, t, y)
 │
 └── build-words-by-length.js
        → words-by-length.js (data only)

Never verified for seo-data.js parity (open item):
 └── starting-with-{b..z, except a/n/o/s}.html
     ending-with-{s,t,y}.html (except e)
```

## Reading this diagram

- **Solid arrow (`▼`)** = script reads from / writes to.
- **"Locked behind ALLOW_LEGACY_GEN"** = script exits with status 1
  unless that environment variable is explicitly set. This is an active
  execution guard, not a comment-only warning.
- **"Verified"** labels are evidence-backed (see the Ownership Matrix in
  `seo-remediation-2026.md`), not inferred.
