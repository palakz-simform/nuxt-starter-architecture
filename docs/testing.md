# Testing

Stack: **Vitest** with two projects — `unit` (node environment: pure logic, the
repository path, Zod contracts, and HTTP-level API tests) and `nuxt` (Nuxt
environment via `@nuxt/test-utils` + happy-dom: Vue component tests). Run all with
`npm test` (CI) or `npm run test:watch`; target one with
`npx vitest --project unit` / `--project nuxt`.

## Kinds of tests

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

Prefer this repository-level integration test for data-layer logic — it's fast
and deterministic. To assert the route handlers' own HTTP behavior (status codes,
error shape), add the HTTP test below.

### 3. Component tests (`tests/nuxt/`)

For Vue SFCs that have real rendering logic worth guarding. Run in the `nuxt`
project (Nuxt environment + happy-dom), so auto-imports and Nuxt UI components
work. Render with `mountSuspended` from `@nuxt/test-utils/runtime`.

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ExpenseList from '~/components/expense/ExpenseList.vue'

it('gives the icon-only actions column an accessible header', async () => {
  const wrapper = await mountSuspended(ExpenseList, { props: { expenses: [] } })
  expect(wrapper.text()).toContain('No expenses to show.')
})
```

These guard *structural* regressions (a missing accessible header, a broken empty
state). They cannot detect a hydration **mismatch** itself — that needs a real
browser (see [ssr-hydration.md](./ssr-hydration.md)).

### 4. API route HTTP tests (`tests/e2e/`)

Exercise the validate → translate layer of the Nitro handlers over real HTTP.
`setup` from `@nuxt/test-utils/e2e` boots a server; set `EXPENSES_DATA_FILE`
before `setup` so the spawned process writes to a temp file.

```ts
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
// unique temp file per run so parallel/CI runs don't collide
process.env.EXPENSES_DATA_FILE = join(await mkdtemp(join(tmpdir(), 'expenses-e2e-')), 'expenses.json')

describe('api/expenses (HTTP)', async () => {
  await setup({ server: true, setupTimeout: 240_000 })
  it('rejects an invalid body with 400', async () => {
    const res = await $fetch('/api/expenses', {
      method: 'POST', body: { title: '' }, ignoreResponseError: true,
    })
    expect((res as { statusCode?: number }).statusCode).toBe(400)
  })
})
```

This boots a full build, so it's the slowest tier — keep it to route-contract
coverage, not exhaustive cases.

## Config

`vitest.config.ts` defines the two projects. The `unit` project maps the
`#shared` and `~` aliases and includes `tests/unit`, `tests/server`, `tests/e2e`;
the `nuxt` project (built with `defineVitestProject`) includes `tests/nuxt`.
`package.json` must have `"type": "module"`.

## What to test

- Every pure util / util composable → unit test.
- Each new API resource → a repository round-trip **and** at least one route-level
  HTTP test (create 201 + invalid 400).
- Components with real logic (empty/error states, accessible labels) → a component
  test. Don't over-test purely presentational markup.

## Note: `nuxt typecheck` warning

`npm run typecheck` prints a `vue-router/volar/sfc-route-blocks` resolution
warning: Nuxt injects that Volar plugin path into the generated tsconfig, but
current `vue-router` no longer exports it. It's cosmetic — type checking still
**fails on real errors** (verified) — and unrelated to the test suite.

Golden examples: `tests/unit/useCurrency.spec.ts`, `tests/server/expenses.spec.ts`,
`tests/nuxt/ExpenseList.spec.ts`, `tests/e2e/expenses.api.spec.ts`.
