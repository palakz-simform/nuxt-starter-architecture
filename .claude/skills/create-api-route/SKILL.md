---
name: create-api-route
description: Add a Nitro API route in server/api following this repo's validate → delegate → translate pattern with shared Zod schemas and a repository. Use when adding or changing a server endpoint.
---

# Create an API route

Golden examples: `server/api/expenses/*`. Full rules in `docs/api-layer.md`.

## File name = path + method

`server/api/<resource>/index.get.ts` → `GET /api/<resource>`;
`[id].put.ts` → `PUT /api/<resource>/:id`; also `.post`, `.delete`.

## A handler does exactly three things

1. **Validate** — body with `readValidatedBody(event, <schema>.safeParse)`,
   params with `getValidatedRouterParams(event, <idParamSchema>.safeParse)`. On
   failure `throw createError({ statusCode: 400, statusMessage, data: err.flatten().fieldErrors })`.
   Always use the **shared** schema from `#shared/schemas/...`.
2. **Delegate** — call the repository (`~~/server/repositories/...`). Never read
   or write storage directly in a route. If the repo returns `null`/`false`,
   `throw createError({ statusCode: 404 })`.
3. **Translate** — set status (`201` create, `204` delete) and return the value.

## Checklist

- No business logic beyond HTTP concerns in the handler.
- If the resource has no repository yet, create one first (mirror
  `expense.repository.ts`) — routes must not touch `json-db` directly.
- Add/extend a server test in `tests/server/`.
