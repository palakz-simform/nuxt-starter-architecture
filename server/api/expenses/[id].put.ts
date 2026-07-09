import { expenseIdParamSchema, updateExpenseSchema } from '#shared/schemas/expense'
import { expenseRepository } from '~~/server/repositories/expense.repository'

// PUT /api/expenses/:id — partial update (404 if missing, 400 if invalid).
export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, expenseIdParamSchema.safeParse)
  if (!params.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid expense id' })
  }

  const body = await readValidatedBody(event, updateExpenseSchema.safeParse)
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid expense payload',
      data: body.error.flatten().fieldErrors,
    })
  }

  const updated = await expenseRepository.update(params.data.id, body.data)
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Expense not found' })
  }
  return updated
})
