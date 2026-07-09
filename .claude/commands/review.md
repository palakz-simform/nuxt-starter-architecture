---
description: Review the current changes against repo conventions and Nuxt 4 correctness.
allowed-tools: Bash(git diff:*), Bash(git status:*)
---

Use the **nuxt-reviewer** subagent to review the current changes against this
repo's conventions.

Current diff:
!`git --no-pager diff 2>/dev/null || echo "(not a git repo — review the most recently edited files instead)"`

Have the reviewer check layer boundaries, Zod-inferred types, input validation,
folder placement, Nuxt 4 correctness, and design-system usage (per its
checklist). Return a prioritized 🔴/🟡 list with `file:line` and concrete fixes.
Do not modify files.
