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
  <NuxtPage />
</template>