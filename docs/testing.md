# Testing

Stack: **Vitest** (node environment). Run with `npm test` (CI) or
`npm run test:watch`. Component/e2e helpers (`@nuxt/test-utils`) are not
installed by default — add them when you need them (see Config below).

## Two kinds of tests

### 1. Unit tests — pure logic (`tests/unit/`)

For util functions and pure composables. No Nuxt runtime needed; fast.

```ts
import { describe, it, expect } from 'vitest'
import { useCurrency } from '~/composables/useCurrency'

describe('useCurrency', () => {
  it('formats USD', () => {
    expect(useCurrency('USD', 'en-US').format(82.4)).toBe('$82.40')
  })
})
```

### 2. Server integration tests (`tests/server/`)

Exercise the **repository** code path the API routes use (repository → json-db →
file), pointed at a throwaway temp file via the `EXPENSES_DATA_FILE` override so
tests never touch the seed data. This is fast, deterministic, and needs no build.

```ts
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

let dir: string
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'expenses-'))
  process.env.EXPENSES_DATA_FILE = join(dir, 'expenses.json') // isolate storage
})
afterAll(async () => {
  delete process.env.EXPENSES_DATA_FILE
  await rm(dir, { recursive: true, force: true })
})

it('creates then lists', async () => {
  // import lazily so the env override is applied before the module reads it
  const { expenseRepository } = await import('../../server/repositories/expense.repository')
  const created = await expenseRepository.create({
    title: 'x', amount: 1, category: 'food', date: '2026-07-07',
  })
  expect((await expenseRepository.list())).toHaveLength(1)
})
```

Repositories read their file path from an env override (`dataFile()` in
`expense.repository.ts`) precisely so they're testable in isolation. Also unit-test
the shared Zod schema directly to lock the validation contract.

> Prefer this repository-level integration test as the default. A full HTTP
> round-trip with `@nuxt/test-utils/e2e` (`setup` + `$fetch`) is also possible but
> boots a complete build and is heavier/less deterministic in CI.

## Config

`vitest.config.ts` is an explicit, deterministic config (`environment: 'node'`,
`include: ['tests/**']`) that maps the `#shared` and `~` aliases our tests use.
We deliberately avoid Nuxt's test workspace here so the suite behaves identically
under npm/pnpm/yarn and across version bumps. `package.json` must have
`"type": "module"`.

These tests need no Nuxt runtime. To add Vue **component** tests later (which do),
install the Nuxt test environment and add a Vitest project with
`environment: 'nuxt'` for `*.nuxt.spec.ts` files, or use `@nuxt/test-utils/e2e`
(`setup` + `$fetch`) for a full HTTP round-trip.

## What to test

- Every pure util / util composable → unit test.
- Each new API resource → at least a list + create round-trip.
- Don't over-test presentational components; test the logic they call instead.

Golden examples: `tests/unit/useCurrency.spec.ts`, `tests/server/expenses.spec.ts`.
