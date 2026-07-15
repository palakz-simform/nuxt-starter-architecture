import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from '#shared/schemas/expense'
import { readJson, updateJson } from '../utils/json-db'

/**
 * REPOSITORY LAYER — the single boundary between the app's domain and its
 * persistence. API route handlers depend ONLY on this interface, never on the
 * JSON file directly. To move to a real database, reimplement these functions
 * (e.g. with Drizzle) and nothing else in the codebase changes.
 *
 * Convention: repositories own identity (ids) and timestamps; route handlers
 * own validation and HTTP concerns.
 */

// The tracked seed file (read-only reference data, committed to git).
const SEED_FILE = join(process.cwd(), 'server/data/expenses.json')

// Where runtime writes go. Defaults to a gitignored `.data/` file so demoing
// the app never dirties the committed seed. Override with EXPENSES_DATA_FILE
// (tests point it at a temp file; also handy for a writable path in prod).
function dataFile(): string {
  return process.env.EXPENSES_DATA_FILE ?? join(process.cwd(), '.data/expenses.json')
}

// Initial contents when the runtime file doesn't exist yet: the committed seed
// for the demo, but EMPTY when a custom data file is set (tests/other envs) so
// they start from a clean slate.
async function initialData(): Promise<Expense[]> {
  if (process.env.EXPENSES_DATA_FILE) return []
  return readJson<Expense[]>(SEED_FILE, [])
}

async function readAll(): Promise<Expense[]> {
  // `initialData` is passed as a lazy factory: the seed file is read ONLY when
  // the runtime data file doesn't exist yet, not on every operation.
  return readJson<Expense[]>(dataFile(), initialData)
}

export const expenseRepository = {
  /** List all expenses, newest first (createdAt breaks same-date ties). */
  async list(): Promise<Expense[]> {
    const all = await readAll()
    return [...all].sort((a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
    )
  },

  /** Find one by id, or `null` if not found. */
  async getById(id: string): Promise<Expense | null> {
    const all = await readAll()
    return all.find(e => e.id === id) ?? null
  },

  /** Create a new expense, assigning id + timestamps. */
  async create(input: CreateExpenseInput): Promise<Expense> {
    const now = new Date().toISOString()
    const expense: Expense = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    await updateJson<Expense[]>(dataFile(), initialData, all => [...all, expense])
    return expense
  },

  /** Patch an existing expense; returns `null` if it does not exist. */
  async update(id: string, patch: UpdateExpenseInput): Promise<Expense | null> {
    let updated: Expense | null = null
    await updateJson<Expense[]>(dataFile(), initialData, all =>
      all.map((e) => {
        if (e.id !== id) return e
        updated = { ...e, ...patch, updatedAt: new Date().toISOString() }
        return updated
      }),
    )
    return updated
  },

  /** Delete by id; returns `true` if something was removed. */
  async remove(id: string): Promise<boolean> {
    let removed = false
    await updateJson<Expense[]>(dataFile(), initialData, (all) => {
      const next = all.filter(e => e.id !== id)
      removed = next.length !== all.length
      return next
    })
    return removed
  },
}
