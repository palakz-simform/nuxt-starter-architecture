# Contributing

This repo is both an app **and** an organization standard. Changes here ripple
into every project cloned from it, so the bar is: *would I want every future
Nuxt project to inherit this?*

## Setup

```bash
npm install      # Node 24+ (see .nvmrc), npm 10+
npm run dev
```

## Definition of done (enforced by CI)

Every PR must pass:

```bash
npm run lint         # ESLint (also the formatter — see docs/conventions.md)
npm run typecheck    # vue-tsc, zero errors
npm test         # Vitest (unit + repository integration)
npm run build        # production build succeeds
```

A pre-commit hook (husky + lint-staged) auto-runs `eslint --fix` on staged
files, and the Claude Code PostToolUse hook lints AI edits. CI is the source of
truth.

## Conventions

Read `AGENTS.md` first, then the relevant `docs/*`. Non-negotiables:

- **Respect the layers** — page → composable/store → API route → repository →
  json-db. See `docs/architecture.md`.
- **Types are inferred from Zod** in `shared/schemas` — never hand-duplicated.
- **Validate all write input** with the shared schema.
- **Nuxt UI + semantic color classes**; `<script setup lang="ts">`.
- Mirror the **Expense golden example** when adding features (use
  `/scaffold-feature`).

Run `/review` (the `nuxt-reviewer` subagent) on your change before opening a PR.

## Changing conventions

If you change a rule, you **must** update the matching `docs/*`, `AGENTS.md`,
and any affected skill/subagent in the same PR — the AI layer is only useful if
it stays true. Call out convention changes explicitly in the PR description.

## Commits & PRs

- Branch off the default branch; no direct pushes.
- Keep PRs focused; describe what changed and why.
- Update docs/tests alongside code.
