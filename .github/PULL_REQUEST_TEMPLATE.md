<!--
This template is evidence-first.

Review approval is based on attached evidence rather than narrative
summaries. If evidence and summary disagree, evidence takes precedence.

Applies to any change touching:
- Generator/build scripts (generate-*.js, update-*.js, inject-*.js, build-*.js)
- seo-data.js or any other SEO source-of-truth file
- Generated or manually-maintained finder/letter pages
- JSON-LD, metadata, canonical, or hero content

For unrelated changes (styling, unrelated bug fixes), this template can
be skipped — but if in doubt, fill it out anyway.

See docs/seo-remediation-2026.md and docs/seo-engineering-principles.md
for the standards this template enforces.
-->

## Evidence Rule

No claim in this PR should appear without the supporting evidence
included below or directly linked. Statements such as:

- "No other files changed"
- "Intentional"
- "Safe"
- "No regression"

must be backed by raw evidence (diff, output, or code reference), not
asserted on their own.

## Summary

<!-- What does this PR change, in one or two sentences? -->

## Root Cause

<!--
Why was this change needed? Link to an issue, audit finding, or
describe the defect/gap being addressed. "It looked wrong" is not
sufficient — state what evidence showed the problem.
-->

## Risk Assessment

Risk level:
- [ ] Low
- [ ] Medium
- [ ] High

Potential impact (check all that apply):
- [ ] Indexing
- [ ] Structured data
- [ ] Canonical
- [ ] Hero content
- [ ] Internal links
- [ ] Metadata

<!-- Explain why this risk level was chosen. -->

## Deployment Scope

- [ ] Generator only (no production pages regenerated yet)
- [ ] Generated HTML changed
- [ ] Source of truth (`seo-data.js` or equivalent) changed
- [ ] Documentation only
- [ ] No production pages affected

## Source of Truth Impact

- [ ] This PR changes `seo-data.js` (or another canonical source)

<!--
If checked, confirm:
- [ ] Ownership Matrix updated (docs/seo-remediation-2026.md)
- [ ] Architecture doc updated (docs/architecture.md) if ownership changed
- [ ] All affected generators re-run
- [ ] Generated output validated (see Validation Results below)

If this change bypasses the source of truth (e.g. a manual edit to a
generated page), explain why and get explicit sign-off — this is a
violation of Engineering Invariant #4 by default.
-->

## Generator Impact

<!--
Which generator(s), if any, were modified?
Which generator(s), if any, need to be re-run because of this change?
If a legacy generator (generate-n-o.js, update-ending-pages.js,
inject-remaining-pages.js) was run, confirm ALLOW_LEGACY_GEN was used
deliberately and why.
-->

## Generated Files

<!--
List every file that was regenerated or manually edited as a result of
this change. If pages outside this list also appear in `git status`,
explain whether they are cumulative/unrelated working-tree state or
part of this change.
-->

## Raw Evidence

<!--
Paste raw, unedited output. Not paraphrased, not summarized.
- Full untruncated git diff (or link)
- JSON.parse() / JSON-LD extraction output
- Site-wide audit script output (before and after)
- git status output
-->

## Validation Results

<!--
State PASS/FAIL against each item, referencing the raw evidence above.
- [ ] JSON-LD is syntactically valid for every touched page
- [ ] Exactly one FAQPage per page
- [ ] No homepage/template values leaked into child pages
- [ ] Structured data counts match expectations (audit table)
-->

## Engineering Invariants

Confirm each invariant (docs/seo-remediation-2026.md §6) remains true
after this change, with evidence:

- [ ] Every page's `WebPage` entity is page-specific (not homepage's)
- [ ] Exactly one authoritative `FAQPage` schema exists per page
- [ ] Hero content matches the page's canonical source
- [ ] No generated page was hand-edited outside its owning generator
- [ ] Legacy generators still require `ALLOW_LEGACY_GEN` to execute
- [ ] No classification above ("safe," "intentional," "in sync") is
      unsupported by the raw evidence section

## Rollback Plan

<!--
Exact rollback step if this change causes an issue after deploy
(e.g. revert commit X, re-run generator Y with the previous
seo-data.js state, etc.)
-->

Rollback validation — after rolling back, re-verify:
- [ ] JSON-LD
- [ ] Canonical
- [ ] Hero content
- [ ] FAQ
- [ ] Indexable HTML (raw source, not rendered DOM)

## Reviewer Checklist

- [ ] Diff matches the claims made in this PR description (no
      unexplained changes to unrelated files/sections)
- [ ] Raw Evidence section contains actual output, not paraphrased
      summaries
- [ ] Validation Results are each supported by something in Raw
      Evidence
- [ ] Engineering Invariants are all checked and each has supporting
      evidence
- [ ] Source of Truth and Ownership Matrix in `seo-remediation-2026.md`
      are still accurate — updated if this PR changes ownership
- [ ] No claim in this PR violates the Evidence Rule

## Reviewer Decision

- [ ] Approved
- [ ] Approved with comments
- [ ] Changes requested

Reviewer:
Date:
