// Runtime Nuxt UI theme config. Maps SEMANTIC aliases (primary/neutral/…) to
// the color scales defined in assets/css/main.css. Runtime-switchable — no
// rebuild needed. Compile-time UI options (e.g. `ui.prefix`) go in nuxt.config.ts.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'slate',
    },
  },
})
