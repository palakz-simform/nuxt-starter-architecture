# Coding & naming conventions

## Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase, feature-prefixed | `ExpenseForm.vue`, `ExpenseList.vue` |
| Composables | `useXxx` camelCase | `useExpenses.ts`, `useCurrency.ts` |
| Stores | `useXxxStore`, `defineStore('kebab-id', …)` | `useExpenseFilterStore` / `'expense-filter'` |
| Pages / routes | kebab-case files, `[param].vue` for dynamic | `expenses/[id].vue` |
| API routes | `<resource>/<segment>.<method>.ts` | `expenses/[id].put.ts` |
| Types & schemas | PascalCase types, `xxxSchema` for Zod | `Expense`, `createExpenseSchema` |
| Utils | camelCase pure functions | `formatDate`, `formatCategory` |

## TypeScript

- `strict` is on. No `any` — prefer `unknown` + narrowing, or a real type.
- **Types are inferred from Zod**, never hand-written in parallel with a schema.
- Use `import type { … }` for type-only imports.

## Vue / components

- `<script setup lang="ts">` always. Composition API only.
- Type props/emits with the generic form: `defineProps<{…}>()`,
  `defineEmits<{ submit: [payload: X] }>()`.
- Components are presentational where possible: emit events, let pages perform
  side effects (fetch, navigate, toast).
- Prefer auto-imports (`ref`, `computed`, composables, utils, Nuxt UI `U*`
  components) — do not add explicit imports for things Nuxt auto-imports.

## Error handling

- **Server:** throw `createError({ statusCode, statusMessage, data })`. Use 400
  for validation, 404 for missing resources. Put field errors in `data`.
- **Client (mutations):** wrap in `try/catch`; surface success/failure with
  `useToast()`.
- **Client (reads):** render every state a composable exposes, in this order:
  `pending` → `error` (a `UAlert color="error"`) → empty → loaded. Never leave the
  `error` ref unhandled — a failed fetch must not render as a silent empty screen.
  Golden examples: `app/pages/expenses/[id].vue` (all four states) and the list +
  dashboard pages. Empty states are explicit too (`ExpenseList`'s `#empty` slot,
  `ExpenseSummary`'s "No expenses yet.").

## Accessibility

The UI must be usable without sight or a mouse. This is demonstrated in
`app/components/expense/ExpenseList.vue`.

- **Icon-only buttons need an `aria-label`** (e.g. the edit/delete `UButton`s) —
  the icon alone gives a screen reader nothing to announce.
- **Every form control gets a visible label** via `<UFormField label="…">` tied
  to the field `name` (see `ExpenseForm.vue`).
- **Don't ship empty/blank headers or labels.** A column or control that has no
  visible text still needs an accessible name — use a visually-hidden
  `<span class="sr-only">` (see the `#actions-header` slot) rather than an empty
  string, which also avoids a hydration pitfall (`docs/ssr-hydration.md`).

## Validation

- Every write endpoint validates its body with the **shared** schema via
  `readValidatedBody(event, schema.safeParse)`; params via
  `getValidatedRouterParams`. Never trust unvalidated input.

## Styling

- Tailwind utility classes + Nuxt UI components. Use Nuxt UI **semantic** design
  tokens (`text-muted`, `text-dimmed`, `bg-default`, `border-default`,
  `text-primary`) so light/dark themes work automatically. Avoid hardcoded
  colors like `text-gray-500`.

## Golden example

Everything above is demonstrated in the Expense feature — see
[architecture.md](./architecture.md) for the file map.
