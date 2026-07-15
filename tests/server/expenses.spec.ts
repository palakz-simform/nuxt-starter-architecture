import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Server integration test — exercises the SAME repository code path the API
// routes use (repository → json-db → file), pointed at a throwaway temp file
// via the EXPENSES_DATA_FILE override so it never touches the seed data.
let dir: string

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'expenses-'))
  process.env.EXPENSES_DATA_FILE = join(dir, 'expenses.json')
})

afterAll(async () => {
  delete process.env.EXPENSES_DATA_FILE
  await rm(dir, { recursive: true, force: true })
})

describe('expenseRepository', () => {
  it('creates, lists, updates and removes with persisted state', async () => {
    // Imported lazily so the env override is set before the module reads it.
    const { expenseRepository } = await import(
      '../../server/repositories/expense.repository'
    )

    expect(await expenseRepository.list()).toEqual([])

    const created = await expenseRepository.create({
      title: 'Coffee beans',
      amount: 14.99,
      category: 'food',
      date: '2026-07-07',
    })
    expect(created.id).toBeTruthy()
    expect(created.createdAt).toBeTruthy()

    const list = await expenseRepository.list()
    expect(list).toHaveLength(1)

    const updated = await expenseRepository.update(created.id, { amount: 19.99 })
    expect(updated?.amount).toBe(19.99)

    expect(await expenseRepository.remove(created.id)).toBe(true)
    expect(await expenseRepository.list()).toEqual([])
    // Removing a missing id is a no-op.
    expect(await expenseRepository.remove(created.id)).toBe(false)
  })
})

describe('createExpenseSchema', () => {
  it('rejects invalid payloads (the same contract the API validates)', async () => {
    const { createExpenseSchema } = await import('../../shared/schemas/expense')
    const result = createExpenseSchema.safeParse({
      title: '',
      amount: -5,
      category: 'nope',
      date: 'bad',
    })
    expect(result.success).toBe(false)
  })

  it('rejects impossible calendar dates that a bare regex would accept', async () => {
    const { createExpenseSchema } = await import('../../shared/schemas/expense')
    const base = { title: 'X', amount: 1, category: 'food' as const }
    expect(createExpenseSchema.safeParse({ ...base, date: '2026-13-40' }).success).toBe(false)
    expect(createExpenseSchema.safeParse({ ...base, date: '2026-02-31' }).success).toBe(false)
    expect(createExpenseSchema.safeParse({ ...base, date: '2026-07-14' }).success).toBe(true)
  })

  it('normalizes empty/whitespace notes to undefined instead of persisting ""', async () => {
    const { createExpenseSchema } = await import('../../shared/schemas/expense')
    const base = { title: 'X', amount: 1, category: 'food' as const, date: '2026-07-14' }

    const emptyNotes = createExpenseSchema.parse({ ...base, notes: '   ' })
    expect(emptyNotes.notes).toBeUndefined()

    const realNotes = createExpenseSchema.parse({ ...base, notes: '  lunch  ' })
    expect(realNotes.notes).toBe('lunch')
  })
})
