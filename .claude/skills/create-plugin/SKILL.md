---
name: create-plugin
description: Add a Nuxt plugin (app/plugins) in this Nuxt 4 repo to run setup code at app init or provide an injected helper. Use when asked to add a plugin, register something at startup, or provide a global $helper.
---

# Create a plugin

Plugins in `app/plugins/` run once at app initialization. Use for registering a
library, wiring an interceptor, or providing an injected helper — NOT for domain
data access (that's composables) or UI (that's components).

```ts
// app/plugins/hello.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      // available as `useNuxtApp().$hello` and `$hello` in templates
      hello: (name: string) => `Hello ${name}`,
    },
  }
})
```

## Rules

- **Environment suffixes:** `*.client.ts` (browser only), `*.server.ts` (SSR
  only), no suffix = both. Use `.client.ts` for anything touching `window`/DOM.
- **Ordering:** files run in alphabetical order; prefix with a number
  (`01.setup.ts`) or use object form `{ name, dependsOn, parallel, setup }` for
  explicit ordering/parallelism.
- Keep plugins small and side-effect-focused. Prefer a composable/util if no
  app-init hook or injection is actually needed.
- Typed injections: augment `#app` if you want `$hello` fully typed.
- Placement: `app/plugins/` (see `docs/folder-structure.md`). Kebab-case files.
