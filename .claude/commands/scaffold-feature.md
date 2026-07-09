---
description: Scaffold a complete CRUD feature end-to-end, mirroring the Expense golden example.
argument-hint: <Entity> with fields (e.g. "Budget: name string, limit number, month string")
---

Use the **scaffold-feature** skill to build a complete vertical slice for: $ARGUMENTS

Follow the skill's steps in order (shared schema → types → repository + seed →
API routes → data composable → components → pages → tests), mirroring the
Expense feature and the layer boundaries in `docs/architecture.md`.

If the entity or its fields are ambiguous, ask me to confirm the field list and
validation rules before writing code. When done, run `npm run typecheck` and
`npm run lint`, then summarize the files created grouped by layer.
