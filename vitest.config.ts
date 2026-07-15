import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

// Two Vitest projects, so fast pure tests never pay the Nuxt-runtime cost:
//
//  - `unit`  → environment 'node'. Pure logic, the server repository path, Zod
//              contract tests, and HTTP-level API route tests (which boot a real
//              Nitro server via @nuxt/test-utils/e2e `setup`). No Nuxt runtime.
//  - `nuxt`  → environment 'nuxt' (happy-dom + auto-imports). Component tests that
//              render Vue SFCs with `mountSuspended`/`renderSuspended`. This is what
//              makes SSR/hydration-class regressions catchable — see docs/testing.md.
//
// `npm test` runs BOTH projects; CI needs no change.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: [
            'tests/unit/**/*.{test,spec}.ts',
            'tests/server/**/*.{test,spec}.ts',
            'tests/e2e/**/*.{test,spec}.ts',
          ],
          // e2e specs build + boot a real Nuxt server in setup(); give them room.
          testTimeout: 30_000,
          hookTimeout: 240_000,
        },
        resolve: {
          alias: {
            '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
            '~': fileURLToPath(new URL('./app', import.meta.url)),
          },
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          environment: 'nuxt',
          include: ['tests/nuxt/**/*.{test,spec}.ts'],
        },
      }),
    ],
  },
})
