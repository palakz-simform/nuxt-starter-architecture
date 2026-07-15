# SSR & hydration safety

Nuxt renders each page **twice**: once on the server (SSR → HTML) and again in
the browser (hydration → attaches reactivity to that HTML). If the two renders
disagree, Vue logs **"Hydration completed but contains mismatches"** and patches
the DOM on the client — causing flicker, wrong values, lost event listeners, or
subtle state bugs. Hydration mismatches are the **#1 source of Nuxt SSR bugs**,
and they don't show up in `npm run typecheck` or pure unit tests — so treat the
rules below as non-negotiable when writing components.

## The rules

### 1. No non-deterministic values rendered during SSR

`new Date()`, `Date.now()`, `Math.random()`, `crypto.randomUUID()`, and anything
that reads the current time/locale/timezone produce **different values on the
server and the client**. If such a value is rendered (or seeds reactive state
that is rendered), the two passes disagree.

```ts
// ❌ mismatch: server computes today in the server's timezone, client re-computes
//    in the browser's — they differ across a midnight boundary.
const date = ref(new Date().toISOString().slice(0, 10))

// ✅ compute once on the server, reuse the serialized value on the client.
const today = useState('today', () => new Date().toISOString().slice(0, 10))
const date = ref(today.value)
```

`useState` puts the value in the SSR payload so hydration reuses it verbatim.
For values that are inherently client-only (reading `localStorage`, `window`,
element sizes), compute them after mount instead:

```ts
const width = ref(0)
onMounted(() => { width.value = window.innerWidth }) // client-only; SSR renders 0
```

Reference fix: `app/components/expense/ExpenseForm.vue` (the "today" date default
via `useState`).

### 2. `useFetch` / `useAsyncData` `data` is a shallowRef — replace, don't mutate

Reactivity only fires when you replace the whole value. Mutating a nested field
won't re-render, and on the client can diverge from the SSR snapshot. After a
mutation, call `refresh()` and let the server stay the source of truth (see
[composables.md](./composables.md)). Reuse a stable `key` so SSR and client share
one cached result.

### 3. Beware empty / placeholder values that render differently

An empty string passed where a component expects renderable content can produce a
**different fragment structure** on server vs. client. This bit the starter: a
`UTable` column declared `{ id: 'actions', header: '' }` rendered an empty-string
header whose fragment-anchor nesting differed across the two passes.

```ts
// ❌ empty-string header → fragment-anchor mismatch on hydration
{ id: 'actions', header: '' }

// ✅ omit the header and render it via the slot with real (or sr-only) content
{ id: 'actions' }
// <template #actions-header><span class="sr-only">Actions</span></template>
```

Reference fix: `app/components/expense/ExpenseList.vue` (`#actions-header` slot).

### 4. Wrap inherently client-only UI in `<ClientOnly>`

For third-party widgets that touch `window`/`document` at render time, or UI that
legitimately can't be server-rendered, use `<ClientOnly>` (optionally with a
`#fallback`) so the server emits a stable placeholder and the client renders the
real thing — no mismatch.

## How to catch it

- **In a browser (the definitive check):** with `npm run dev`, hard-reload the
  page and watch the console for "Hydration completed but contains mismatches."
  Timezone-sensitive bugs only reproduce when the browser's timezone differs from
  the server's — emulate one via DevTools → Sensors → Location/Timezone.
- **In tests:** component tests (`tests/nuxt/`, see [testing.md](./testing.md))
  guard the *structural* regressions (e.g. the missing actions header), but pure
  unit tests cannot detect a hydration mismatch itself — the browser check above
  is the real gate.
- **In review:** the `nuxt-reviewer` subagent flags rule-1/rule-3 violations.
