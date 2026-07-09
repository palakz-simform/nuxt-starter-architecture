# CLAUDE.md

Entry point for Claude Code. The canonical rules are in `AGENTS.md` (imported
below); deep-dive docs are imported on demand.

@AGENTS.md

## Start here

- Architecture & data flow: @docs/architecture.md
- Folder placement & Nuxt 4 gotchas: @docs/folder-structure.md
- Naming & coding standards: @docs/conventions.md

Other docs (read when relevant): `docs/api-layer.md`, `docs/composables.md`,
`docs/state-management.md`, `docs/design-system.md`, `docs/testing.md`,
`docs/prompts.md`.

## The golden example

The **Expense Tracker** is a complete vertical slice. When building anything new,
open and mirror these files (map in `docs/architecture.md`):
`shared/schemas/expense.ts` · `server/api/expenses/*` ·
`server/repositories/expense.repository.ts` · `app/composables/useExpenses.ts` ·
`app/stores/expenses.ts` · `app/components/expense/*` · `app/pages/expenses/*`.

## Use the tooling

- **Add a whole feature** → `/scaffold-feature` or the `scaffold-feature` skill.
- **Add server CRUD only** → `/add-crud` (uses the `api-architect` subagent).
- **Build UI** → `component-builder` subagent / `create-page` `create-composable` skills.
- **Review before finishing** → `/review` (uses the `nuxt-reviewer` subagent).

## Definition of done

`npm run typecheck` and `npm run lint` pass; new utils have a unit test and new
endpoints have a server test. Never introduce Nuxt 3-isms (see AGENTS.md).
