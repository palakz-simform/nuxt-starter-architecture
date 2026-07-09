// Nuxt 4 configuration.
// NOTE (Nuxt 4): `app/` is the default srcDir and `future.compatibilityVersion`
// is NOT needed — v4 behavior is already the default. Do not re-add it.
export default defineNuxtConfig({

  // Order matters: @nuxt/ui brings Tailwind v4 (CSS-first). Do NOT add
  // @nuxtjs/tailwindcss or a tailwind.config.js alongside it.
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint'],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  // Typed runtime config. Server-only secrets go at the top level;
  // client-exposed values go under `public`. Never hardcode secrets.
  runtimeConfig: {
    public: {
      appName: 'Expense Tracker',
    },
  },
  compatibilityDate: '2025-01-01',

  // Pre-bundle CommonJS/edge deps used in shared code so dev doesn't discover
  // them at runtime and trigger a page reload on first load.
  vite: {
    optimizeDeps: {
      include: ['zod'],
    },
  },

  typescript: {
    // Surfaces type errors in `nuxt dev` and `nuxt typecheck`.
    strict: true,
    typeCheck: false,
  },

  // ESLint (stylistic rules on) is the single formatter for the whole repo, so
  // `eslint --fix` — run automatically by the PostToolUse hook — keeps AI edits
  // on-style. No Prettier, so there is no formatter conflict.
  eslint: {
    config: {
      stylistic: {
        semi: false,
        quotes: 'single',
        commaDangle: 'always-multiline',
      },
    },
  },
})
