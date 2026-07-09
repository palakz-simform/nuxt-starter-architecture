import { expenseIdParamSchema } from '#shared/schemas/expense'
import { expenseRepository } from '~~/server/repositories/expense.repository'

// GET /api/expenses/:id — fetch a single expense (404 if missing).
export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, expenseIdParamSchema.safeParse)
  if (!params.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid expense id' })
  }

  const expense = await expenseRepository.getById(params.data.id)
  if (!expense) {
    throw createError({ statusCode: 404, statusMessage: 'Expense not found' })
  }
  return expense
})
