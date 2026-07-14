---
name: create-middleware
description: Add route middleware (app/middleware) or Nitro server middleware (server/middleware) in this Nuxt 4 repo. Use when asked to guard routes, redirect, gate access, or run logic before a route/request.
---

# Create middleware

Two kinds — pick by where the logic must run.

## Route middleware — `app/middleware/`

Runs client + server before navigation. Use for redirects, guards, route gating.

```ts
// app/middleware/require-onboarding.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const done = useOnboardingStore().completed // client UI/composable state
  if (!done && to.path !== '/welcome') {
    return navigateTo('/welcome') // or: abortNavigation('Not allowed')
  }
})
```

- **Named** (`app/middleware/foo.ts`) → opt-in per page via
  `definePageMeta({ middleware: ['foo'] })`.
- **Global** (`app/middleware/foo.global.ts`) → runs on every route change.
- Return nothing to continue, `navigateTo(...)` to redirect, `abortNavigation(err)` to block.
- Keep it thin: read state from composables/stores (`docs/state-management.md`);
  don't fetch domain data here — that's the page/composable's job.

## Server middleware — `server/middleware/`

Runs on every server request (Nitro), before route handlers. Use for request
logging, headers, attaching context. It must NOT return a body.

```ts
// server/middleware/request-id.ts
export default defineEventHandler((event) => {
  event.context.requestId = getHeader(event, 'x-request-id') ?? crypto.randomUUID()
})
```

- No return value (returning a body short-circuits the request).
- Auth/validation for a specific route belongs in that route handler
  (`docs/api-layer.md`), not blanket server middleware, unless it's truly global.

## Rules

- Placement: `app/middleware/` and `server/middleware/` (see `docs/folder-structure.md`).
- Naming: kebab-case files; `.global.ts` suffix only for always-on route middleware.
- Add a test only if the middleware has pure, extractable logic.
