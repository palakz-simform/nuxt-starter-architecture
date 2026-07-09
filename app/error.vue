<script setup lang="ts">
import type { NuxtError } from '#app'

// Global error page — Nuxt renders this OUTSIDE layouts for both 404s and
// unhandled 500s, so it wraps its own <UApp>. Keep it self-contained.
const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
const title = computed(() => (is404.value ? 'Page not found' : 'Something went wrong'))

useHead({ title: title.value })

// Clears the error state and navigates home.
function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <div class="flex min-h-screen items-center justify-center bg-default px-4">
      <div class="w-full max-w-md text-center">
        <p class="text-primary text-5xl font-bold">
          {{ error.statusCode }}
        </p>
        <h1 class="mt-4 text-xl font-semibold text-default">
          {{ title }}
        </h1>
        <p class="text-muted mt-2 text-sm">
          {{ is404 ? 'The page you’re looking for doesn’t exist or has moved.' : error.message || 'An unexpected error occurred.' }}
        </p>
        <div class="mt-6 flex justify-center gap-2">
          <UButton
            label="Go home"
            icon="i-lucide-home"
            @click="handleClear"
          />
        </div>
      </div>
    </div>
  </UApp>
</template>
