import { z } from 'zod'

/**
 * SINGLE SOURCE OF TRUTH for the Expense domain.
 *
 * Zod schemas live here (in `shared/`) so BOTH the Nitro server and the Vue app
 * validate against the exact same contract, and all TS types are *inferred* from
 * the schema — never hand-written in parallel.
 *
 * Import via the `#shared` alias, e.g.:
 *   import { createExpenseSchema, type Expense } from '#shared/schemas/expense'
 *
 * NOTE: `shared/schemas/` is not auto-imported (only `shared/types` and
 * `shared/utils` are). Always import explicitly from `#shared/schemas/...`.
 */

export const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'housing',
  'utilities',
  'entertainment',
  'health',
  'shopping',
  'other',
] as const

export const expenseCategorySchema = z.enum(EXPENSE_CATEGORIES)

/** Fields a client supplies when creating an expense. */
export const createExpenseSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  amount: z.number().positive('Amount must be greater than 0'),
  category: expenseCategorySchema,
  // ISO date string (YYYY-MM-DD). Kept as a string for JSON-friendliness.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  notes: z.string().trim().max(500).optional(),
})

/** All fields optional — used for PATCH/PUT-style partial updates. */
export const updateExpenseSchema = createExpenseSchema.partial()

/** The persisted shape: create fields + server-owned identity/timestamps. */
export const expenseSchema = createExpenseSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/** Route param validation: `/api/expenses/:id`. */
export const expenseIdParamSchema = z.object({
  id: z.string().uuid('Invalid expense id'),
})

// Inferred types — the ONLY place these types are defined.
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
export type Expense = z.infer<typeof expenseSchema>
