import type { ExpenseCategory } from '#shared/schemas/expense'

/**
 * Pinia setup-store for CLIENT-ONLY UI state (the active filter + sort).
 *
 * STORE vs COMPOSABLE boundary (important convention):
 *  - Server data lives in `useExpenses()` (fetch/cache/mutate the source of truth).
 *  - Ephemeral, shared UI state that several components read/write lives here.
 * Don't duplicate server data into the store — derive views from the composable.
 *
 * Auto-imported by @pinia/nuxt (all stores in `app/stores/`). Setup syntax:
 * refs = state, computed = getters, functions = actions.
 */
export type CategoryFilter = ExpenseCategory | 'all'
export type SortKey = 'date' | 'amount'

export const useExpenseFilterStore = defineStore('expense-filter', () => {
  const category = ref<CategoryFilter>('all')
  const sortBy = ref<SortKey>('date')

  const isFiltered = computed(() => category.value !== 'all')

  function reset() {
    category.value = 'all'
    sortBy.value = 'date'
  }

  return { category, sortBy, isFiltered, reset }
})
