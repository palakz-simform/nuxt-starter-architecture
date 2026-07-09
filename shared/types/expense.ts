/**
 * Domain types, re-exported from the Zod schema so they are AUTO-IMPORTED
 * across both the app and the server (Nuxt 4 auto-imports `shared/types`).
 *
 * Types are still *defined* by inference in `#shared/schemas/expense` — this
 * file only re-exports them for ergonomic, import-free usage. Add view-model or
 * helper types that are pure types (no runtime code) here.
 */
export type {
  Expense,
  ExpenseCategory,
  CreateExpenseInput,
  UpdateExpenseInput,
} from '#shared/schemas/expense'

/** Aggregated totals per category — used by the dashboard summary. */
export interface ExpenseSummary {
  total: number
  count: number
  byCategory: Record<string, number>
}
