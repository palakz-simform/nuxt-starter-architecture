# Design system (Nuxt UI + Tailwind v4)

This project uses **Nuxt UI** (free tier, `@nuxt/ui`) on **Tailwind v4**. Reach
for a Nuxt UI component before building a custom one.

## Common components (all `U`-prefixed, auto-imported)

| Need | Component |
|------|-----------|
| Button / link | `UButton` (`to` makes it a link) |
| Container | `UCard` |
| Form + validation | `UForm` + `UFormField` |
| Inputs | `UInput`, `UTextarea`, `USelect` |
| Table | `UTable` (TanStack columns + `#<id>-cell` slots) |
| Overlay | `UModal` (`v-model:open`), toasts via `useToast()` |
| Feedback | `UAlert`, `UBadge` |
| Icon | `UIcon` (`i-lucide-*`) |

`<UApp>` wraps the app in `app.vue` — required for modals/toasts/tooltips.

## Theming — two layers, don't conflate them

1. **Design tokens** → `app/assets/css/main.css` via the Tailwind v4 `@theme`
   directive (fonts, radii, custom color scales). Foundational, build-time.
2. **Semantic color aliases** → `app/app.config.ts` under `ui.colors`
   (`primary`, `neutral`, …). Runtime-switchable.

```ts
// app/app.config.ts
export default defineAppConfig({
  ui: { colors: { primary: 'emerald', neutral: 'slate' } },
})
```

## Use semantic utility classes

For theme-aware light/dark, prefer Nuxt UI semantic classes over raw palette
values:

- Text: `text-default`, `text-muted`, `text-dimmed`, `text-primary`
- Surfaces: `bg-default`, `bg-muted`, `border-default`

Avoid `text-gray-500` / hardcoded hex — they break dark mode.

## Rules

- Don't install `@nuxtjs/tailwindcss` or add `tailwind.config.js` — Tailwind v4
  ships with Nuxt UI via `@import "tailwindcss"` in `main.css`.
- Component slots/props: check https://ui.nuxt.com — API differs from other libs.
- Wrap a Nuxt UI component in your own only when you need repeated custom
  behavior; otherwise use it directly.

Golden examples: `app/components/expense/*.vue`, `app/layouts/default.vue`.
