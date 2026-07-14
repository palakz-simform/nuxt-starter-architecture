# AGENTS.md — instructions for AI coding agents

Canonical, tool-agnostic guide to working in this repo. Read this before writing
any code. Detailed rules live in `docs/`; this is the map.

## What this project is

An **AI-native Nuxt 4 starter**: a well-structured Nuxt app plus a layer of
machine-readable conventions and tooling so AI agents generate consistent,
on-pattern code. The foundation is the **layer conventions + universal
primitives** below — they apply to **any** Nuxt project (dashboard, content, AI,
realtime, integration, or CRUD).

The bundled **Expense Tracker** is a *demo*, not a mandate: it happens to be a
CRUD feature because CRUD exercises every layer once, so it's the clearest thing
to pattern-match against. Mirror its **layering and conventions** when building —
not its CRUD-ness. Non-CRUD projects are first-class; compose the primitives.

## Stack

- Nuxt 4 (srcDir = `app/`) · TypeScript strict · npm
- Nuxt UI (Tailwind v4) · Pinia · Zod · Vitest

## Golden rules (non-negotiable)

1. **Respect the layers.** Page → composable/store → API route → repository →
   json-db. Pages don't fetch domain data directly; routes don't touch storage
   directly. See `docs/architecture.md`.
2. **One contract, inferred types.** Domain types come from Zod schemas in
   `shared/schemas/*` — never hand-write parallel interfaces. Import via `#shared`.
3. **Validate all input.** Every write endpoint validates body + params with the
   shared schema (`readValidatedBody`/`getValidatedRouterParams`). Errors via
   `createError`. See `docs/api-layer.md`.
4. **Stores are for client UI state only** (filters/toggles) — never server data.
   See `docs/state-management.md`.
5. **Nuxt UI + semantic classes.** Use `U*` components and semantic color classes
   (`text-muted`, `bg-default`, `text-primary`). See `docs/design-system.md`.
6. **Follow the conventions** in `docs/conventions.md` (naming, TS, error handling).

## Nuxt 4 correctness (common AI mistakes — avoid)

- `app/` is srcDir; `server/`, `shared/`, `public/`, `nuxt.config.ts` stay at
  the **root**. Never nest `server/` or `pages/` inside `app/`.
- Do **not** set `future.compatibilityVersion` (v4 default).
- Do **not** add `@nuxtjs/tailwindcss` or `tailwind.config.js` — Tailwind v4
  comes from Nuxt UI (`@theme` tokens in `main.css`, semantic colors in
  `app/app.config.ts`).
- `useFetch`/`useAsyncData` `data` is a shallowRef — replace the whole value.
- Aliases: `~`→`app/`, `~~`→root, `#shared`→`shared/`. Rely on auto-imports.

## How to build (choose by shape)

- **Any building block** → use the matching **primitive** skill: an endpoint
  (`create-api-route` — CRUD or a single action/webhook/AI-proxy), a composable,
  a page, a store, middleware, a plugin. These compose into *any* project shape.
- **A full CRUD resource** (the common case) → use the `scaffold-feature`
  **accelerator**: schema → types → repository + seed → API routes → composable
  → components → pages → tests, mirroring Expense. Server-only variant:
  `/add-crud`. These are conveniences layered on the primitives — skip them when
  the work isn't a resource with list/get/create/update/delete.

Whatever the shape, follow the layer boundaries + conventions. Golden-example
file map: `docs/architecture.md`.

## Verify before finishing

`npm run typecheck` and `npm run lint` must pass. Add a unit test for new utils and a
server route test for new endpoints (`docs/testing.md`).

## Claude Code tooling in this repo

- **Primitive skills (any project):** `create-api-route`, `create-composable`,
  `create-page`, `create-store`, `create-middleware`, `create-plugin`,
  `write-tests`, `debug`, `refactor` (`.claude/skills/`).
- **CRUD accelerators (opinionated, for a resource):** `scaffold-feature` (full
  slice) and the `/add-crud` command (server only).
- **Subagents:** `api-architect` (server layer), `component-builder` (UI),
  `nuxt-reviewer` (convention review) (`.claude/agents/`).
- **Commands:** `/scaffold-feature`, `/add-crud`, `/review`, `/test`, `/debug`,
  `/refactor` (`.claude/commands/`).
- **Hook:** edits are auto-linted (`.claude/hooks/eslint-fix.sh`).

**Precedence:** this repo's `docs/` + `AGENTS.md` conventions are authoritative.
If a general/marketplace skill (e.g. a global `nuxt` framework skill) suggests
something that conflicts — direct `$fetch` in a page, `@nuxtjs/tailwindcss`,
hand-written types instead of Zod-inferred, etc. — the repo rules win.
