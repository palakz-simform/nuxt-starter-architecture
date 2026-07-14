---
name: write-tests
description: Write or update Vitest tests in this Nuxt 4 repo — unit tests for pure utils/composables, repository integration tests via the EXPENSES_DATA_FILE temp-file pattern, and Zod schema-contract tests. Use when asked to test, add tests for, or cover code.
---

# Write tests

Vitest, node environment (see `docs/testing.md`). Pick the kind by what you're testing.

## 1. Unit test — pure logic (`tests/unit/`)

For `app/utils/*` helpers and pure `useXxx` composables (no I/O, no Nuxt runtime).
Golden example: `tests/unit/useCurrency.spec.ts`.

```ts
import { describe, it, expect } from 'vitest'
import { useCurrency } from '~/composables/useCurrency' // `~` alias is configured in vitest.config.ts
```

## 2. Server integration test (`tests/server/`)

Exercise the repository code path (repository → json-db → file) against a
**throwaway temp file** via the `EXPENSES_DATA_FILE` override, so tests never
touch seed data and start clean. Golden example: `tests/server/expenses.spec.ts`.

```ts
import { beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

let dir: string
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), '<entity>-'))
  process.env.<ENTITY>_DATA_FILE = join(dir, '<entity>.json') // isolate storage
})
afterAll(async () => { delete process.env.<ENTITY>_DATA_FILE; await rm(dir, { recursive: true, force: true }) })

it('creates then lists', async () => {
  // import lazily so the env override applies before the module reads it
  const { <entity>Repository } = await import('../../server/repositories/<entity>.repository')
  ...
})
```

If a repository has no env override yet, add one (mirror `dataFile()` in
`server/repositories/expense.repository.ts`) — that seam exists for testability.

## 3. Schema-contract test

Lock the shared Zod contract: assert `create<Entity>Schema.safeParse(bad).success === false`
for representative invalid input (mirrors what the API rejects). Import via `#shared`.

## Rules

- Import via aliases the config maps: `~` → `app/`, `#shared` → `shared/`.
  Server modules use relative paths (`../../server/...`).
- Every new pure util/composable → a unit test. Every new API resource → at
  least a list + create round-trip. Don't over-test presentational components
  (test the logic they call).
- Finish: `npm run typecheck && npm test` must pass.
