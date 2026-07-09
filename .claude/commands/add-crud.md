---
description: Add just the server-side CRUD (schema + repository + API routes) for a resource, no UI.
argument-hint: <Entity> with fields (e.g. "Category: name string, color string")
---

Use the **api-architect** subagent to implement the server/data layer only for:
$ARGUMENTS

Deliver: shared Zod schema (`shared/schemas/<entity>.ts`) + type re-export,
repository (`server/repositories/<entity>.repository.ts`) with a JSON seed, the
five Nitro routes under `server/api/<plural>/`, and a server test. No UI.

Mirror the Expense golden example and `docs/api-layer.md`. Confirm the field
list first if it's ambiguous. Run `npm run typecheck` when done and list the
endpoints created.
