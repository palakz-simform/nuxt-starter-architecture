# State management (Pinia)

## The one rule: server data ≠ client state

- **Server data** (the list of expenses) is owned by a **data composable**
  (`useExpenses`). It is fetched, cached, and refreshed against the API.
- **Client UI state** (the active category filter, sort order, open panels) is
  owned by a **Pinia store**. It is ephemeral and shared across components.

Never copy server data into a store. Derive the view in the component/page by
combining composable data with store filters:

```ts
const { expenses } = useExpenses()
const filter = useExpenseFilterStore()
const visible = computed(() =>
  (expenses.value ?? []).filter((e) => filter.category === 'all' || e.category === filter.category),
)
```

## Store style: setup stores

Use the setup syntax — refs are state, computed are getters, functions are
actions. `@pinia/nuxt` auto-imports `defineStore` and every store in
`app/stores/`.

```ts
export const useExpenseFilterStore = defineStore('expense-filter', () => {
  const category = ref<CategoryFilter>('all')  // state
  const isFiltered = computed(() => category.value !== 'all')  // getter
  function reset() { category.value = 'all' }   // action
  return { category, isFiltered, reset }
})
```

Golden example: `app/stores/expenses.ts`, consumed in
`app/pages/expenses/index.vue`.
