<script setup lang="ts">
const { t } = useI18n();

useSeo({
  title: () => t("seo.privacyTitle"),
  description: () => t("seo.privacyDescription"),
  noindex: true,
});
</script>

<template>
  <div />
</template>
