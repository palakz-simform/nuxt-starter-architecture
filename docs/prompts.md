# Prompt snippets

Copy-paste prompts for recurring engineering tasks in this repo. They point
Claude at the golden example so output stays on-pattern. Most of these also
exist as slash commands (`/scaffold-feature`, `/add-crud`, `/review`) and skills.

## Scaffold a full CRUD feature

```
Add a full CRUD feature for <Entity> (fields: <field: type, …>), mirroring the
Expense feature exactly. Create: shared Zod schema + types, repository, server
API routes (list/get/create/update/delete), a data composable, feature
components (List/Card/Form/Summary as relevant), and pages. Reuse json-db and
follow docs/architecture.md, docs/api-layer.md, and docs/conventions.md.
Then add a unit test and a server route test.
```

## Add a data composable

```
Create app/composables/use<Entity>.ts following the data-composable pattern in
docs/composables.md and app/composables/useExpenses.ts: useFetch with a stable
key for reads, $fetch + refresh() for writes, typed against the shared schema.
```

## Add an API endpoint

```
Add <METHOD> /api/<resource>/… following docs/api-layer.md: validate with the
shared Zod schema via readValidatedBody/getValidatedRouterParams, call the
repository, translate errors with createError. Match server/api/expenses/*.
```

## Add a Pinia store

```
Create a Pinia setup-store in app/stores/ for <client UI state>, following
docs/state-management.md. Only client-side UI state — no server data.
```

## Build a component

```
Build app/components/<feature>/<Name>.vue using Nuxt UI components
(docs/design-system.md). Presentational: type props/emits, emit events instead
of doing side effects, use semantic color classes. Match app/components/expense/*.
```

## Review my change

```
Review the current diff against docs/conventions.md and docs/folder-structure.md.
Flag layer-boundary violations, hand-written types that should be inferred from
Zod, missing validation, wrong folder placement, and Nuxt 3-isms. (Or run /review.)
```
