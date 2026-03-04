<script setup lang="ts">
const { locale } = useI18n();

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
    dir: locale.value === "ar" ? "rtl" : "ltr",
    class: locale.value === "ar" ? "font-ar" : "font-en",
  },
}));
</script>

<template>
  <NuxtLayout><NuxtPage /></NuxtLayout>
  <!-- Fixed theme + language toggle — always on top -->
  <ClientOnly>
    <ToggleBar />
  </ClientOnly>
</template>

<style>
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
