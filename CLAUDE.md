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

The **Expense Tracker** is a complete vertical slice that exercises every layer
once — it's a CRUD *demo*, so mirror its **layering and conventions**, not its
CRUD-ness (your project may not be CRUD). File map in `docs/architecture.md`:
`shared/schemas/expense.ts` · `server/api/expenses/*` ·
`server/repositories/expense.repository.ts` · `app/composables/useExpenses.ts` ·
`app/stores/expenses.ts` · `app/components/expense/*` · `app/pages/expenses/*`.

## Use the tooling

**Primitives — for any project shape:**
- **Add an endpoint** (CRUD route, action, webhook, AI-proxy) → `create-api-route`.
- **Build UI** → `component-builder` subagent / `create-page` `create-composable` skills.
- **Middleware / plugins / stores** → `create-middleware` / `create-plugin` / `create-store`.
- **Write tests** → `/test` or the `write-tests` skill.
- **Fix a bug** → `/debug`; **restructure code** → `/refactor`.
- **Review before finishing** → `/review` (uses the `nuxt-reviewer` subagent).

**CRUD accelerators — only when the work is a resource (list/get/create/update/delete):**
- **Whole feature** → `/scaffold-feature` or the `scaffold-feature` skill.
- **Server only** → `/add-crud` (uses the `api-architect` subagent).

For general Nuxt "how do I…" questions a global `nuxt` framework skill may help,
but this repo's `docs/` + `AGENTS.md` always override it on conflict.

## Definition of done

`npm run typecheck` and `npm run lint` pass; new utils have a unit test and new
endpoints have a server test. Never introduce Nuxt 3-isms (see AGENTS.md).
