import { expenseIdParamSchema } from '#shared/schemas/expense'
import { expenseRepository } from '~~/server/repositories/expense.repository'

// DELETE /api/expenses/:id — remove an expense (404 if missing).
export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, expenseIdParamSchema.safeParse)
  if (!params.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid expense id' })
  }

  const removed = await expenseRepository.remove(params.data.id)
  if (!removed) {
    throw createError({ statusCode: 404, statusMessage: 'Expense not found' })
  }

  setResponseStatus(event, 204)
  return null
})
