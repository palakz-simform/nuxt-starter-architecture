---
name: create-composable
description: Create a composable in this Nuxt 4 repo — either a data composable (useFetch + $fetch/refresh for a resource) or a pure util composable. Use when adding reusable app logic under app/composables.
---

# Create a composable

Decide which kind first (see `docs/composables.md`):

## Data composable (`use<Plural>`) — fetch + mutate a resource

Golden example: `app/composables/useExpenses.ts`.

- Reads: `useFetch<T[]>('/api/<resource>', { key: '<resource>', default: () => [] })`.
- Writes: `$fetch(..., { method })` then `await refresh()`. No optimistic
  mutation; the server is the source of truth.
- `data` is a shallowRef — never mutate nested fields.
- Type against the **shared** schema types (`import type { ... } from '#shared/schemas/...'`).
- Return `{ <plural>: data, pending, error, refresh, create, update, remove }`.
- A single-record fetch gets its own key: `key: '<resource>:' + id`.

## Util composable (`useXxx`) — pure logic, no I/O

Golden example: `app/composables/useCurrency.ts`.

- No fetching, no side effects. Return functions/computed only.
- Add a unit test in `tests/unit/` (these are the easiest things to test).

## Don't

If it's a stateless one-off helper (format a value), put it in `app/utils/`
instead — no `useXxx` wrapper needed. Composables are auto-imported; don't add
manual imports.
