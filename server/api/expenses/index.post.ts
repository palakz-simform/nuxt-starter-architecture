import { createExpenseSchema } from '#shared/schemas/expense'
import { expenseRepository } from '~~/server/repositories/expense.repository'

// POST /api/expenses — create an expense.
// Validation runs on the shared Zod schema; a failure returns a 400 with
// field-level messages the form can surface directly.
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, createExpenseSchema.safeParse)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid expense payload',
      data: result.error.flatten().fieldErrors,
    })
  }

  const expense = await expenseRepository.create(result.data)
  setResponseStatus(event, 201)
  return expense
})
