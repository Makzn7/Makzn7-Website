<script setup lang="ts">
import { ref } from "vue";

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
  Cinematic page transition: a dark veil covers the screen while routes
  swap, so the site background never flashes between pages. The page
  swap itself runs behind the opaque veil (mode: "out-in").
*/
const veilActive = ref(false);

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const pageTransition = {
  name: "page",
  mode: "out-in" as const,
  css: false,
  async onLeave(_el: Element, done: () => void) {
    if (prefersReducedMotion()) return done();
    veilActive.value = true;
    await wait(230); // veil fade-in (200ms) + margin
    done();
  },
  async onEnter(_el: Element, done: () => void) {
    if (prefersReducedMotion()) return done();
    await wait(60); // let the incoming page settle behind the veil
    veilActive.value = false;
    await wait(320); // veil fade-out (300ms) + margin
    done();
  },
};
</script>

<template>
  <NuxtLoadingIndicator color="#54ea62" :height="3" />
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
