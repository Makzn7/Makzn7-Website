<script setup lang="ts">
const { locale } = useI18n();
const origin = useRequestURL().origin;

const organizationLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Makzn7",
  url: origin,
  logo: `${origin}/logos/svg/logo_black.svg`,
});

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
    dir: locale.value === "ar" ? "rtl" : "ltr",
    class: locale.value === "ar" ? "font-ar" : "font-en",
  },
  script: [
    {
      type: "application/ld+json",
      innerHTML: organizationLd,
    },
  ],
}));

/*
  Cinematic page transition + page-loading state. A single dark veil
  covers the screen while a route loads its data and swaps, so the site
  background never flashes; a spinner appears if the load is slow.
*/
const { veilActive, pageTransition } = useRouteTransition();
</script>

<template>
  <NuxtLoadingIndicator color="#54ea62" :height="3" :throttle="0" />
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
  <div
    class="page-veil"
    :class="{ 'is-active': veilActive }"
    aria-hidden="true"
  />
</template>

<style>
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Cinematic page-transition veil */
.page-veil {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background-color: #0a0a0a;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
}
.page-veil.is-active {
  opacity: 1;
  transition: opacity 200ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .page-veil {
    transition: none;
  }
}
</style>
