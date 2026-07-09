import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '#shared/schemas/expense'

/**
 * useExpenses — the reference example for a DATA composable.
 *
 * Pattern rules demonstrated here:
 *  - Reads use `useFetch` with a stable `key` so every caller shares one
 *    reactive result (SSR-friendly, dedupes requests).
 *  - Writes use `$fetch` (imperative) and then `refresh()` the list — the
 *    server stays the source of truth; we never hand-mutate local state.
 *  - `data` from useFetch is a shallowRef: replace the whole value, never
 *    mutate nested fields in place.
 *  - Types come from the shared Zod schema, so the client and server contracts
 *    can never drift.
 */
export function useExpenses() {
  const { data, pending, error, refresh } = useFetch<Expense[]>('/api/expenses', {
    key: 'expenses',
    default: () => [],
  })

  async function create(input: CreateExpenseInput): Promise<Expense> {
    const created = await $fetch<Expense>('/api/expenses', {
      method: 'POST',
      body: input,
    })
    await refresh()
    return created
  }

  async function update(id: string, patch: UpdateExpenseInput): Promise<Expense> {
    const updated = await $fetch<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: patch,
    })
    await refresh()
    return updated
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return { expenses: data, pending, error, refresh, create, update, remove }
}

/**
 * useExpense — fetch a single expense by id (used by the edit page). Separate
 * key per id so detail views don't collide with the list cache.
 */
export function useExpense(id: string) {
  return useFetch<Expense>(`/api/expenses/${id}`, { key: `expense:${id}` })
}
