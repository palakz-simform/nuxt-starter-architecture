---
description: Diagnose and fix a bug using the repo's disciplined debug workflow.
argument-hint: <the bug — symptom, repro steps, or failing area>
---

Use the **debug** skill to investigate and fix: $ARGUMENTS

Follow the workflow: reproduce → locate via the layer map in
`docs/architecture.md` → minimal root-cause fix that respects layer boundaries →
add a regression test → verify `npm run lint && npm run typecheck && npm test`.
Report the root cause, the fix, and the test added. Ask for repro steps first if
you can't reproduce it.
