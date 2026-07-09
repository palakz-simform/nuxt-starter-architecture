import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Explicit, deterministic Vitest config — no dependency on Nuxt's test
// workspace, so it behaves identically under npm/pnpm/yarn and across version
// bumps. These tests are pure logic + the server repository path, which need no
// Nuxt runtime; we just map the two aliases our code imports.
//
// To add Vue COMPONENT tests later (which need the Nuxt runtime), install the
// Nuxt test environment and add a project with `environment: 'nuxt'` — see
// docs/testing.md.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
})
