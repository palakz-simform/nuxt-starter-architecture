# Using this repo as a project template

Two ways to adopt it, depending on whether you want the demo as a live reference.

## Option A — keep the Expense demo (recommended at first)

Clone and start building your own features alongside the Expense feature. Claude
pattern-matches against it, and you delete it later once your own golden example
exists. Nothing to remove.

## Option B — start clean (strip the demo)

When your own features are the reference, remove the Expense demo. **Keep the
whole AI layer** — that's the reusable accelerator.

### Delete (demo-specific)

```
shared/schemas/expense.ts
shared/types/expense.ts
server/api/expenses/
server/repositories/expense.repository.ts
server/data/expenses.json
app/composables/useExpenses.ts
app/composables/useCurrency.ts        # or keep — it's a handy util
app/stores/expenses.ts
app/components/expense/
app/pages/index.vue                   # replace with your own landing page
app/pages/expenses/
tests/unit/useCurrency.spec.ts
tests/server/expenses.spec.ts
```

### Keep (the accelerator)

```
AGENTS.md  CLAUDE.md  README.md  CONTRIBUTING.md  LICENSE
docs/                 # update examples to point at YOUR first feature
.claude/              # skills, subagents, commands, hooks, settings
.github/workflows/    # CI
nuxt.config.ts  app.config.ts  eslint.config.mjs  vitest.config.ts
app/error.vue  app/layouts/  app/assets/  app/utils/format.ts
server/utils/json-db.ts   # or swap for your DB layer
.editorconfig  .nvmrc  .gitignore  .env.example
```

### Then

1. Build your first feature with `/scaffold-feature` — it becomes the new golden
   example.
2. Update the "golden example" file map in `docs/architecture.md` and the
   references in `docs/*` / skills to point at it.
3. Update `runtimeConfig.public.appName` and `README.md`.
4. Swap the JSON store for a real database (reimplement the repository — see the
   note in `docs/api-layer.md`); the API routes and app don't change.
5. `npm run lint && npm run typecheck && npm test && npm run build` should stay green.

## Governance

The AI layer is only useful while it's true. When conventions change, update the
matching `docs/*`, `AGENTS.md`, and affected skills in the **same PR** (see
`CONTRIBUTING.md`). Run `/review` before merging.
