# Prompt snippets

Copy-paste prompts for recurring engineering tasks in this repo. They point
Claude at the golden example so output stays on-pattern. Most of these also
exist as slash commands (`/scaffold-feature`, `/add-crud`, `/review`, `/test`,
`/debug`, `/refactor`) and skills.

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
of doing side effects, use semantic color classes, add aria-labels for icon-only
buttons, and keep it SSR-safe (docs/ssr-hydration.md). Match app/components/expense/*.
```

## Add a page

```
Add a page at app/pages/<route>.vue following docs/folder-structure.md and the
create-page skill: orchestration only (data via a composable, UI via Nuxt UI),
render pending → error → empty → loaded states. Match app/pages/expenses/*.
```

## Add route / server middleware

```
Add <route|server> middleware following the create-middleware skill: route
middleware in app/middleware (defineNuxtRouteMiddleware; `.global.ts` = always-on),
or Nitro middleware in server/middleware (must not return a body). Explain which
and why.
```

## Add a plugin

```
Add a Nuxt plugin in app/plugins following the create-plugin skill: use it only
for app-init side effects or an injected $helper (with .client/.server suffix if
env-specific). If a composable/util would do, prefer that instead.
```

## Write tests

```
Write tests following docs/testing.md: unit (tests/unit) for pure logic, a
repository round-trip (tests/server) for data logic, a component test
(tests/nuxt, mountSuspended) for UI with real logic, and an HTTP route test
(tests/e2e) for new endpoints. (Or run /test.)
```

## Debug a bug

```
Debug <symptom> using the debug skill's workflow: reproduce, locate via the layer
map (page → composable/store → API route → repository → json-db), make the
minimal on-pattern fix, add a regression test, then verify
(lint + typecheck + test, and a browser check for UI/hydration bugs). (Or run /debug.)
```

## Review my change

```
Review the current diff against docs/conventions.md and docs/folder-structure.md.
Flag layer-boundary violations, hand-written types that should be inferred from
Zod, missing validation, wrong folder placement, and Nuxt 3-isms. (Or run /review.)
```
