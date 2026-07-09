---
name: scaffold-feature
description: Scaffold a complete CRUD feature (schema → repository → API routes → composable → components → pages → tests) in this Nuxt 4 repo, mirroring the Expense golden example. Use when adding a new domain entity/resource end-to-end.
---

# Scaffold a full feature

Build a complete vertical slice for a new entity, mirroring the **Expense**
feature exactly. Always read the referenced golden-example files before writing,
and follow the layer boundaries in `docs/architecture.md`.

## Inputs to confirm first

- Entity name (singular + plural), e.g. `Budget` / `budgets`.
- Fields with types + validation rules (required, min/max, enum, optional).

## Steps (in order)

1. **Shared schema** — `shared/schemas/<entity>.ts`. Zod `create<Entity>Schema`,
   `update<Entity>Schema = create.partial()`, full `<entity>Schema` (adds `id`,
   `createdAt`, `updatedAt`), and `<entity>IdParamSchema`. Export **inferred**
   types. Mirror `shared/schemas/expense.ts`.
2. **Types re-export** — `shared/types/<entity>.ts` re-exporting the inferred
   types (for auto-import). Mirror `shared/types/expense.ts`.
3. **Repository** — `server/repositories/<entity>.repository.ts` with
   `list/getById/create/update/remove` over `json-db` + a `server/data/<plural>.json`
   seed (`[]` or sample rows). Mirror `expense.repository.ts`.
4. **API routes** — `server/api/<plural>/index.get.ts`, `index.post.ts`,
   `[id].get.ts`, `[id].put.ts`, `[id].delete.ts`. Validate, delegate, translate
   (see `docs/api-layer.md`). Mirror `server/api/expenses/*`.
5. **Data composable** — `app/composables/use<Plural>.ts` (useFetch read +
   $fetch/refresh writes). Mirror `useExpenses.ts` (`docs/composables.md`).
6. **Components** — `app/components/<entity>/` (List via `UTable`, Form via
   `UForm` + shared schema, Card/Summary as needed). `docs/design-system.md`.
7. **Pages** — `app/pages/<plural>/index.vue` (list + delete confirm),
   `new.vue` (create), `[id].vue` (edit). Mirror `app/pages/expenses/*`.
8. **Tests** — a unit test for any new util + a server route test
   (list + create round-trip). `docs/testing.md`.

## Finish

Run `npm run typecheck` and `npm run lint`. Report the files created grouped by layer.
Do NOT add auth, external DBs, or optimistic mutation — keep to the starter's
patterns and non-goals.
