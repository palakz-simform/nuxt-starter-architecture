---
name: create-page
description: Add a page/route in app/pages for this Nuxt 4 repo — orchestration only, data via composables, UI via Nuxt UI. Use when adding a new screen or route.
---

# Create a page

Golden examples: `app/pages/index.vue`, `app/pages/expenses/*`.

## Rules

- **Pages orchestrate; they don't fetch domain data directly.** Get data from a
  composable (`const { expenses, pending } = useExpenses()`), not raw
  `useFetch`/`$fetch`.
- Own layout, navigation (`navigateTo`, `<UButton to>`), and wiring child events
  → composable actions. Perform side effects (mutations, toasts) here, not in
  child components.
- Set the title with `useHead({ title: '…' })`.
- Dynamic routes use `[param].vue`; read via `useRoute().params`.
- Use Nuxt UI components + semantic classes (`docs/design-system.md`). Show
  `pending`/`error` states and empty states.
- Feedback via `useToast()`; confirmations via `UModal` (`v-model:open`).

## Patterns to copy

- List + filter + delete-confirm: `app/pages/expenses/index.vue`.
- Create form page: `app/pages/expenses/new.vue`.
- Edit page (fetch-by-id + prefill + guard states): `app/pages/expenses/[id].vue`.
