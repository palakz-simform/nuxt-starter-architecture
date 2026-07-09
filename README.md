# Nuxt AI Template

A production-grade **Nuxt 4 starter optimized for AI-assisted development with
Claude Code**. It pairs a well-structured app with a layer of machine-readable
conventions and Claude tooling so AI agents generate consistent, on-pattern code
instead of guessing — reducing architectural drift and speeding up both human
and AI onboarding.

## What's inside

**1. The AI-instruction layer** — teaches Claude how this repo works
- `AGENTS.md` — canonical, tool-agnostic rules (the map)
- `CLAUDE.md` — Claude Code entry point (imports AGENTS.md + docs)
- `docs/` — architecture memory: conventions, folder intelligence, layer guides,
  design system, testing, and copy-paste prompt snippets
- `.claude/` — skills, subagents, slash commands, and an auto-lint hook

**2. The reference app** — the "golden example" Claude imitates
- A complete **Expense Tracker** CRUD demonstrating every layer: shared Zod
  schema → repository → Nitro API routes → data composable → Pinia UI store →
  Nuxt UI components → pages, with unit + server tests.

## Stack

Nuxt 4 · TypeScript (strict) · Nuxt UI (Tailwind v4) · Pinia · Zod ·
Vitest · npm. Data persists to a JSON file behind a
repository layer (zero-setup; swappable for a real DB by editing one file).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run typecheck`, `npm run lint` / `npm run lint:fix`,
`npm test`.

## Project layout

```
app/        Vue app (Nuxt 4 srcDir): pages, components, composables, stores, utils
server/     Nitro backend: api routes, repositories, json-db, seed data
shared/     Zod schemas + types shared by app and server
docs/       architecture memory (read by both humans and Claude)
.claude/    skills · agents · commands · settings + hooks
tests/      unit + server tests
```

See `docs/folder-structure.md` for the full map and Nuxt 4 placement rules.

## Working with Claude Code

Claude auto-loads `CLAUDE.md` (and `AGENTS.md`) every session. To build with the
grain of the repo:

- `/scaffold-feature Budget: name string, limit number, month string` — full
  CRUD vertical slice mirroring the Expense feature.
- `/add-crud Category: name string, color string` — server layer only.
- `/review` — check your changes against the conventions.
- Skills (`scaffold-feature`, `create-composable`, `create-api-route`,
  `create-page`, `create-store`) and subagents (`api-architect`,
  `component-builder`, `nuxt-reviewer`) are available too.

Edits are auto-linted via a PostToolUse hook (`.claude/hooks/eslint-fix.sh`).

## Reusing as a template

Clone/copy, then either keep the Expense feature as a live reference or strip it
once your own features exist — but keep `AGENTS.md`, `CLAUDE.md`, `docs/`, and
`.claude/`, the reusable accelerator. Step-by-step (what to delete, what to keep,
governance): **[docs/using-as-template.md](docs/using-as-template.md)**. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the contribution bar.

## Quality gates

- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs
  lint → typecheck → test → build on every push/PR.
- **Pre-commit** (husky + lint-staged) auto-runs `eslint --fix` on staged files.
- **Claude PostToolUse hook** auto-lints AI edits.
- Node/npm versions pinned via `.nvmrc` + `engines`.

## Extending (documented, not built in v1)

Swap JSON persistence for Drizzle+SQLite (reimplement the repository only), add a
Claude-powered feature via `@anthropic-ai/sdk` + a server route, add Playwright
e2e, or wire CI to run `npm run lint && npm run typecheck && npm test`.
