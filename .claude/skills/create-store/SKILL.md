---
name: create-store
description: Add a Pinia setup-store in app/stores for CLIENT-ONLY UI state (filters, toggles, wizard steps). Use when several components need to share ephemeral UI state — not for server data.
---

# Create a Pinia store

Golden example: `app/stores/expenses.ts`. Full rules in `docs/state-management.md`.

## Use a store ONLY for client UI state

Filters, sort order, open/closed panels, wizard steps — ephemeral state shared
across components. **Server data does NOT go in a store** — it lives in a data
composable (`useExpenses`), and views are derived by combining the two.

## Style: setup store

```ts
export const use<Name>Store = defineStore('<kebab-id>', () => {
  const <state> = ref(<initial>)          // state
  const <getter> = computed(() => ...)    // getters
  function <action>() { ... }             // actions
  return { <state>, <getter>, <action> }
})
```

- `@pinia/nuxt` auto-imports `defineStore` and every store in `app/stores/` —
  no manual import in components.
- Give a stable kebab-case store id string.
- Keep it minimal; expose a `reset()` when there are user-clearable filters.
