---
description: Write or update tests for the given file/feature, following this repo's testing patterns.
argument-hint: <file or feature to test> (e.g. app/utils/format.ts, or "the budgets API")
---

Use the **write-tests** skill to add or update tests for: $ARGUMENTS

Pick the right kind (unit for pure utils/composables, repository integration via
the `EXPENSES_DATA_FILE` temp-file pattern for server/data, schema-contract test
for Zod), mirror the golden examples in `tests/`, and finish with
`npm run typecheck && npm test` — report the result.
