# API layer conventions

The server has two layers: **route handlers** (HTTP + validation) and
**repositories** (persistence). Keep them separate.

## Route handlers (`server/api/<resource>/`)

File-based routing. Filename encodes path + method:

| File | Route |
|------|-------|
| `expenses/index.get.ts` | `GET /api/expenses` |
| `expenses/index.post.ts` | `POST /api/expenses` |
| `expenses/[id].get.ts` | `GET /api/expenses/:id` |
| `expenses/[id].put.ts` | `PUT /api/expenses/:id` |
| `expenses/[id].delete.ts` | `DELETE /api/expenses/:id` |

A handler does exactly three things — **validate, delegate, translate**:

```ts
export default defineEventHandler(async (event) => {
  // 1. validate (shared schema, safeParse → 400 with field errors)
  const body = await readValidatedBody(event, createExpenseSchema.safeParse)
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid expense payload',
      data: body.error.flatten().fieldErrors })
  }
  // 2. delegate to the repository (never touch storage here)
  const expense = await expenseRepository.create(body.data)
  // 3. translate to HTTP
  setResponseStatus(event, 201)
  return expense
})
```

**Rules**

- Validate bodies with `readValidatedBody(event, schema.safeParse)` and params
  with `getValidatedRouterParams(event, schema.safeParse)`. Always the shared
  schema.
- Errors via `createError`: 400 = invalid input (field errors in `data`),
  404 = not found. Set 201 on create, 204 on delete.
- No file/DB access, no business rules beyond HTTP concerns.
- Import the repository with the root alias: `~~/server/repositories/…`.

## Repositories (`server/repositories/`)

The single persistence boundary. Owns ids + timestamps. Exposes a small typed
interface (`list / getById / create / update / remove`). To move to a real DB,
reimplement this file only.

```ts
export const expenseRepository = {
  list(): Promise<Expense[]> { … },
  getById(id: string): Promise<Expense | null> { … },
  create(input: CreateExpenseInput): Promise<Expense> { … },
  update(id: string, patch: UpdateExpenseInput): Promise<Expense | null> { … },
  remove(id: string): Promise<boolean> { … },
}
```

Persistence goes through `server/utils/json-db.ts` (`readJson` / `writeJson` /
`updateJson`), which serializes writes with a per-file lock. Golden examples:
`server/api/expenses/*`, `server/repositories/expense.repository.ts`.
