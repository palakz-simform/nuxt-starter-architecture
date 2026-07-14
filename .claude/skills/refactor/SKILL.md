---
name: refactor
description: Refactor existing code in this Nuxt 4 repo without changing behavior — improve structure/readability while honoring layer boundaries and conventions. Use when asked to refactor, clean up, simplify, or restructure code.
---

# Refactor

A refactor changes structure, NOT behavior. Same inputs → same outputs.

## Guardrails

- **Behavior-preserving.** If tests exist, they stay green with no edits; if
  they don't, add characterization tests first (see the `write-tests` skill).
- **Respect the layers** (`docs/architecture.md`): don't let a refactor leak
  logic across boundaries (e.g. pushing fetch into a component, or DB access
  into a route). Moving code toward the correct layer IS a valid refactor.
- **Follow conventions** (`docs/conventions.md`): naming, `<script setup lang="ts">`,
  types inferred from Zod (never hand-duplicated), Nuxt UI + semantic classes.
- **No scope creep.** Don't add features or fix unrelated bugs (use the `debug`
  skill for bugs). Keep the diff focused and reviewable.

## Workflow

1. Confirm the current behavior is covered (tests or a manual repro) so you can
   prove nothing changed.
2. Make the structural change (extract a composable/util, split a component,
   dedupe, rename, tighten types).
3. Run the `nuxt-reviewer` subagent on the diff to catch boundary/convention drift.
4. Verify `npm run lint && npm run typecheck && npm test && npm run build` — all green.

Report what changed structurally and why it's safe (what proves behavior is unchanged).
