# SEO Engineering Principles

**Status:** Evergreen — not tied to any single remediation cycle.

These principles are independent of the 2026 remediation (see
`seo-remediation-2026.md` for that history). They apply to any future
SEO, generator, or content-architecture change in this codebase.

---

## The Principles

1. **Every page owns its identity.**
   A page's JSON-LD `WebPage` entity, canonical tag, and visible title
   must all describe *that page* — never a template default, never the
   homepage, never another page's identity.

2. **Canonical source before generated output.**
   Content lives in its source of truth (e.g. `seo-data.js`) first.
   Generated HTML is a *projection* of that source, not an independent
   copy that can drift.

3. **One schema definition per concept.**
   A single page has exactly one `FAQPage`, one `WebPage`, one
   `Organization` reference per concept. Duplicate structured data for
   the same concept is a defect, not redundancy.

4. **Generated code is never manually patched.**
   If a page is owned by a generator, fix the generator and regenerate.
   Hand-editing generated output creates silent drift the next time the
   generator runs.

5. **Every change must be reproducible.**
   Running the same generator against the same source data must produce
   the same output. Non-deterministic or manually-touched-up generated
   files break this guarantee.

6. **Review evidence over assumptions.**
   A claim ("this is intentional," "nothing else changed," "this is
   safe") is not accepted without the underlying diff, output, or code
   reference that supports it. Reviewers push back on unsupported
   classifications regardless of how plausible they sound.

7. **Every generator has a documented owner.**
   For every script that produces or modifies HTML, it must be known
   which exact files it owns, which sections it controls, and what data
   source it reads from. See the Ownership Matrix pattern in
   `seo-remediation-2026.md`.

8. **Every regression must be demonstrable.**
   "Could this break something" is answered with evidence (a diff, an
   audit table, a modification-boundary trace) — not with confidence
   alone. If the modification boundary of a script isn't known, that is
   itself treated as a risk to resolve before relying on the script.

9. **Validation precedes deployment.**
   JSON-LD parses cleanly, structured data counts match expectations,
   and a site-wide audit confirms scope — all *before* anything ships,
   not as a post-hoc check.

10. **Documentation is part of the implementation.**
    A fix is not complete when the code changes; it is complete when the
    architecture documentation (ownership, source of truth, invariants)
    reflects the new state. Code and docs that disagree are both
    considered unfinished.

---

## How to apply these principles to a new change

When proposing any SEO-affecting change, answer:

- Which source of truth does this change originate from or update?
- Which generator(s), if any, own the affected pages?
- Does this change preserve, or does it need to update, the Engineering
  Invariants in `seo-remediation-2026.md`?
- What evidence will prove the change is scoped correctly (diff,
  validation output, audit table)?
- What is the regression check — how will we know previously-approved
  behavior wasn't disturbed?

If any of these can't be answered before the change is made, that is a
signal to slow down, not a formality to skip.
