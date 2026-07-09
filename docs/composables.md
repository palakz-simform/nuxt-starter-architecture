# Composable patterns

Two kinds of composables live here. Match the pattern to the job.

## 1. Data composables (fetch + mutate a resource)

Wrap server access for one resource. Reads use `useFetch` with a stable `key`
(SSR-friendly, dedupes). Writes use `$fetch` then `refresh()`.

```ts
export function useExpenses() {
  const { data, pending, error, refresh } = useFetch<Expense[]>('/api/expenses', {
    key: 'expenses',
    default: () => [],
  })

  async function create(input: CreateExpenseInput) {
    const created = await $fetch<Expense>('/api/expenses', { method: 'POST', body: input })
    await refresh()
    return created
  }
  // update / remove follow the same shape

  return { expenses: data, pending, error, refresh, create, update, remove }
}
```

**Rules**

- Type against the shared schema types (`Expense`, `CreateExpenseInput`).
- `data` is a shallowRef — never mutate nested fields; let `refresh()` re-pull.
- One resource per composable file. A per-id fetch gets its own key
  (`key: 'expense:' + id`).
- Golden example: `app/composables/useExpenses.ts`.

## 2. Util composables (pure logic, no I/O)

No fetching, no side effects — just reusable logic behind a `useXxx` API. These
are directly unit-testable.

```ts
export function useCurrency(currency = 'USD', locale = 'en-US') {
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency })
  return { format: (amount: number) => formatter.format(amount) }
}
```

Golden example: `app/composables/useCurrency.ts` (tested in
`tests/unit/useCurrency.spec.ts`).

## When NOT to use a composable

For plain, stateless helpers (formatting a date, title-casing) use `app/utils/`
functions instead — they're auto-imported too and don't need the `useXxx`
wrapper. See `app/utils/format.ts`.
