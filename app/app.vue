<script setup lang="ts">
// <UApp> is REQUIRED at the root for Nuxt UI overlays (toasts, modals, tooltips)
// to mount correctly. Global layouts/pages render inside it.
const { appName } = useRuntimeConfig().public

useHead({
  titleTemplate: title => (title ? `${title} · ${appName}` : String(appName)),
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
