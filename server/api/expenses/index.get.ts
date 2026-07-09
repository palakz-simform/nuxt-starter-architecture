import { expenseRepository } from '~~/server/repositories/expense.repository'

// GET /api/expenses — list all expenses (newest first).
export default defineEventHandler(async () => {
  return expenseRepository.list()
})
