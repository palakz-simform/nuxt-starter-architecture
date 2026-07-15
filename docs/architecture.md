# Architecture

The single source of truth for how this app is layered and how data flows. When
you add a feature, follow these boundaries — do not shortcut across them.

## Layers & data flow

```
 Page (app/pages)                 route + orchestration, no business logic
   │  calls
   ▼
 Composable (app/composables)     data access (useFetch/$fetch), returns typed refs
   │  ── OR ── Store (app/stores) client-only UI state (filters, toggles)
   │  HTTP
   ▼
 API route (server/api)           validate input (Zod) · HTTP status · call repo
   │  calls
   ▼
 Repository (server/repositories) the ONLY place persistence is touched
   │  uses
   ▼
 json-db (server/utils)           read/write JSON file behind a per-file lock
   │
   ▼
 .data/*.json (runtime, gitignored)   seeded from server/data/*.json on first
                                      write; swap for a real DB later
```

**Rules**

- Pages never call `$fetch`/`useFetch` for domain data directly — they use a
  composable. Pages own layout, navigation, and wiring events → actions.
- Composables own data access and expose typed `data / pending / error` plus
  mutation actions. After a mutation, `refresh()` — the server stays the source
  of truth (no optimistic hand-mutation in the starter).
- Stores hold only **client-side UI state** (active filter, sort, open panels).
  Never copy server data into a store; derive views from the composable.
- API routes are thin: validate with the shared Zod schema, translate results to
  HTTP (`createError` for 400/404), and call the repository. No file/DB access
  in a route.
- Repositories own identity (`id`) and timestamps, and are the single seam for
  changing storage. Nothing above the repository knows data is a JSON file.
- Domain types + validation live in `shared/` so server and app share one
  contract and types are always *inferred* from Zod, never hand-duplicated.

## The golden example (copy this shape)

The **Expense Tracker** feature is a complete vertical slice implementing every
layer above. When building anything new, mirror it:

| Layer      | Golden example |
|------------|----------------|
| Schema     | `shared/schemas/expense.ts` |
| Types      | `shared/types/expense.ts` |
| Repository | `server/repositories/expense.repository.ts` |
| API routes | `server/api/expenses/*.ts` |
| Data composable | `app/composables/useExpenses.ts` |
| UI store   | `app/stores/expenses.ts` |
| Components | `app/components/expense/*.vue` |
| Pages      | `app/pages/expenses/*.vue`, `app/pages/index.vue` |
| Tests      | `tests/unit/*`, `tests/server/*` |

## Scope

This is a starter template, so it deliberately ships no auth, no external DB, and
no deployment config. JSON persistence is intentional; the repository layer keeps
storage behind one seam, so a project built from this template swaps it without
touching any other layer.
