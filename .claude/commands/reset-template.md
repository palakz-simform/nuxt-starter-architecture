---
description: One-time bootstrap — strip the Expense demo and reset this starter for a new project, then self-remove. Run once, right after cloning the template.
argument-hint: <new app name> [+ first feature, e.g. "Post: authorId string, text string, createdAt string"]
---

Reset this starter for a new project: $ARGUMENTS

This is a **one-shot, destructive bootstrap**. `docs/using-as-template.md`
(Option B) is the source of truth for the delete/keep lists — follow it, and work
in this order:

1. **Confirm first.** This deletes the Expense demo. Confirm the new app name
   (and first feature, if given) before changing anything. If no arguments were
   passed, ask for the app name.

2. **Delete the demo** (using-as-template.md "delete" list): `shared/schemas/expense.ts`,
   `shared/types/expense.ts`, `server/api/expenses/`, `server/repositories/expense.repository.ts`,
   `server/data/expenses.json`, `app/composables/useExpenses.ts`, `app/stores/expenses.ts`,
   `app/components/expense/`, `app/pages/expenses/`, and the expense tests
   (`tests/**/*expense*`; drop `useCurrency` + its test only if the new app won't use it).
   Keep everything in the "keep" list — the whole AI layer, config, CI, app shell, `json-db`.

3. **Fix the couplings** so the build stays green:
   - Replace `app/pages/index.vue` with a minimal landing page for the new app.
   - Remove the `/expenses` and `/expenses/new` nav links in `app/layouts/default.vue`.
   - Rename `appName` in `nuxt.config.ts` and `.env.example`.

4. **Scaffold the first feature** (if given) — use the `scaffold-feature` skill for a
   CRUD resource, or the `create-*` primitives for a non-CRUD app. This becomes the
   **new golden example**.

5. **Repoint the AI layer** to that new golden example (governance rule in
   `CONTRIBUTING.md`): update the file maps + `expense*` references in
   `docs/architecture.md`, `docs/api-layer.md`, `docs/composables.md`,
   `docs/state-management.md`, `docs/design-system.md`, `docs/prompts.md`, and any
   `.claude/skills` / `.claude/agents` that name expense files. Update `CLAUDE.md`'s
   golden-example list too.

6. **Self-remove the bootstrap scaffolding** (no purpose in the new project): delete
   this command (`.claude/commands/reset-template.md`) and `docs/using-as-template.md`,
   and remove their mentions from `README.md`.

7. **Verify**: `npm run lint && npm run typecheck && npm test && npm run build` must
   pass. Report what was deleted, the new feature scaffolded, and the docs repointed.

Do NOT change: `AGENTS.md` golden rules, `.claude/hooks/*`, CI, husky, `eslint.config.mjs`,
`vitest.config.ts`, `server/utils/json-db.ts`, `app/error.vue`, `app/app.vue`, or
`nuxt.config.ts` beyond `appName`.
