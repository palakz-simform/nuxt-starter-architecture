---
description: Refactor the given code without changing behavior, honoring layer boundaries and conventions.
argument-hint: <file or area to refactor> + goal (e.g. "extract a composable from expenses/index.vue")
---

Use the **refactor** skill on: $ARGUMENTS

Keep it behavior-preserving (tests stay green; add characterization tests first
if none exist), respect the layer boundaries in `docs/architecture.md` and
`docs/conventions.md`, and avoid scope creep. Run the `nuxt-reviewer` subagent on
the diff, then verify `npm run lint && npm run typecheck && npm test && npm run build`.
Report what changed structurally and why behavior is unchanged.
