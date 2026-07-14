---
name: debug
description: Diagnose and fix a bug in this Nuxt 4 repo with a disciplined workflow — reproduce, locate via the layer map, minimal fix, regression test, verify. Use when asked to debug, fix a bug, or investigate broken/incorrect behavior.
---

# Debug / fix a bug

Work the problem in order — don't jump to a fix before you can reproduce and
localize it.

## 1. Reproduce
Establish the exact failing behavior: the input, the observed vs. expected
result, and where it surfaces (browser page, `/api/*` response, test). If you
can't reproduce it, get the repro steps before changing code.

## 2. Locate — use the layer map
Trace along the architecture (`docs/architecture.md`):
page → composable/store → `/api` route → repository → json-db. Narrow which
layer owns the defect:
- Wrong data on screen → composable/store or the page's derived state.
- 4xx/5xx or bad payload → the route handler (validation) or repository.
- Persisted data wrong → repository / json-db.
- Type error → the shared Zod schema vs. its usage.

## 3. Fix — minimal, on-pattern
Make the smallest change that fixes the root cause **without crossing layer
boundaries** or violating `docs/conventions.md`. Don't refactor unrelated code
(use the `refactor` skill for that). Keep types Zod-inferred.

## 4. Regression test
Add a test that fails before the fix and passes after, using the `write-tests`
patterns (unit for logic, repository integration for data bugs).

## 5. Verify
`npm run lint && npm run typecheck && npm test`. For UI/behavior bugs, also drive
the actual flow (dev server) to confirm. Optionally run the `nuxt-reviewer`
subagent on the diff.

Report: root cause (one line), the fix, and the regression test added.
