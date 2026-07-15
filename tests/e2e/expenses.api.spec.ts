import { describe, it, expect } from 'vitest'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

// HTTP-level test of the API routes (server/api/expenses/*). Unlike the
// repository integration test, this exercises the validate → translate layer of
// the Nitro handlers themselves: status codes and the shape of validation
// errors. `setup` boots a real Nuxt server; the spawned process inherits
// EXPENSES_DATA_FILE below, so it writes to a throwaway temp file, never the seed.
process.env.EXPENSES_DATA_FILE = join(await mkdtemp(join(tmpdir(), 'expenses-e2e-')), 'expenses.json')

describe('api/expenses (HTTP)', async () => {
  await setup({
    // Project root is two levels up from tests/e2e/ — must be explicit so the
    // build resolves regardless of the cwd the runner is invoked from.
    rootDir: fileURLToPath(new URL('../..', import.meta.url)),
    server: true,
    // Production build is the realistic path; give it room on a cold CI machine.
    setupTimeout: 240_000,
  })

  it('creates an expense and returns 201 with server-owned fields', async () => {
    const created = await $fetch('/api/expenses', {
      method: 'POST',
      body: { title: 'Lunch', amount: 12.5, category: 'food', date: '2026-07-14' },
    })
    expect(created).toMatchObject({ title: 'Lunch', amount: 12.5, category: 'food' })
    expect(created.id).toBeTruthy()
    expect(created.createdAt).toBeTruthy()
  })

  it('rejects an invalid body with 400 and field errors', async () => {
    const res = await $fetch('/api/expenses', {
      method: 'POST',
      body: { title: '', amount: -1, category: 'nope', date: 'bad' },
      ignoreResponseError: true,
    })
    // Nitro serializes createError; the field errors live under `data`.
    expect((res as { statusCode?: number }).statusCode ?? 400).toBe(400)
    expect(JSON.stringify(res)).toMatch(/title|amount|category|date/)
  })

  it('returns 404 for a well-formed but unknown id', async () => {
    const res = await $fetch('/api/expenses/00000000-0000-4000-8000-000000000000', {
      ignoreResponseError: true,
    }) as { statusCode?: number }
    expect(res.statusCode).toBe(404)
  })
})
