<script setup lang="ts">
// Default layout: app shell with a header nav. Pages render in the <slot />.
const { appName } = useRuntimeConfig().public

const links = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: 'Expenses', icon: 'i-lucide-receipt', to: '/expenses' },
]
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <header class="border-b border-default">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-semibold"
        >
          <UIcon
            name="i-lucide-wallet"
            class="text-primary size-5"
          />
          {{ appName }}
        </NuxtLink>
        <nav class="flex items-center gap-1">
          <UButton
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            :icon="link.icon"
            :label="link.label"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <UButton
            to="/expenses/new"
            icon="i-lucide-plus"
            label="Add"
            color="primary"
            size="sm"
          />
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
