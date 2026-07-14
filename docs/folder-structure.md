# Folder structure & Nuxt 4 intelligence

Where every kind of file goes. Getting folder placement wrong is the #1 source
of AI-generated breakage in Nuxt 4, so this is explicit.

## Map

```
app/                     ← Nuxt 4 srcDir (the Vue app)
  app.vue                root component; wraps <UApp>
  app.config.ts          runtime Nuxt UI theme (semantic colors)
  assets/css/main.css     Tailwind v4 + Nuxt UI import + @theme tokens
  components/<feature>/   feature components, grouped by domain
  composables/            useXxx() — data access & reusable logic (auto-imported)
  layouts/                app shells (default.vue)
  middleware/             route middleware (defineNuxtRouteMiddleware; .global.ts = always-on)
  pages/                  file-based routes (auto-imported)
  plugins/                app-init code / injected $helpers (.client/.server suffixes)
  stores/                 Pinia stores (auto-imported by @pinia/nuxt)
  utils/                  pure helpers (auto-imported)

server/                  ← ROOT level (Nitro backend), NOT inside app/
  api/<feature>/          file-based API routes (index.get.ts, [id].put.ts, …)
  middleware/             runs on every request; must NOT return a body
  repositories/           persistence boundary
  utils/                  server-only helpers (auto-imported in Nitro)
  data/                   JSON storage files (read-only seed; runtime writes to .data/)

shared/                  ← ROOT level, imported by BOTH app and server
  types/                  auto-imported types
  schemas/                Zod schemas (import via #shared alias)

modules/                 ← ROOT level, build-time Nuxt modules (advanced; rarely needed)
public/                  static assets served as-is (ROOT level)
docs/                    architecture memory (this folder)
.claude/                 AI tooling: skills, agents, commands, settings, hooks
tests/                   unit + server tests
```

Middleware/plugins/modules have dedicated skills — see `create-middleware`,
`create-plugin` (`.claude/skills/`).

## Nuxt 4 gotchas (do NOT get these wrong)

- **`app/` is the srcDir.** App code lives under `app/` (`app/pages`,
  `app/components`, `app/stores`, …). But `server/`, `shared/`, `public/`,
  `nuxt.config.ts` stay at the **project root**. Never put `server/` or
  `pages/` inside `app/`, and never put `pages/` at the root.
- **Do NOT set `future.compatibilityVersion`.** v4 behavior is already the
  default in Nuxt 4; adding the flag is a Nuxt 3 habit.
- **Tailwind v4 comes from Nuxt UI.** Do not add `@nuxtjs/tailwindcss` or create
  a `tailwind.config.js`. Configure tokens via `@theme` in `main.css` and
  semantic colors in `app/app.config.ts`.
- **`shared/` auto-import** only covers top-level `shared/types` and
  `shared/utils`. Everything else (e.g. `shared/schemas`) is imported via the
  `#shared` alias: `import { x } from '#shared/schemas/expense'`.
- **`useFetch`/`useAsyncData` `data` is a shallowRef.** Replace the whole value;
  mutating a nested field won't trigger reactivity. Reuse keys to share state.
- **Aliases:** `~`/`@` → `app/`; `~~`/`@@` → project root (e.g.
  `~~/server/repositories/...`); `#shared` → `shared/`.
