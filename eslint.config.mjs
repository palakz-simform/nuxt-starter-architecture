// ESLint flat config powered by @nuxt/eslint (wraps the Nuxt-aware ruleset).
// Extend by chaining `.append(...)` with extra flat-config objects.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Allow single-word page/layout names like `index.vue`, `default.vue`.
    'vue/multi-word-component-names': 'off',
  },
})
