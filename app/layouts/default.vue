<script setup lang="ts">
const { t, locale } = useI18n();
</script>

<template>
  <div class="min-h-screen bg-brand-black text-brand-white">
    <header class="border-b border-white/10">
      <nav
        class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <NuxtLink to="/" class="font-semibold tracking-wide"> MAKZN7 </NuxtLink>

        <div class="flex items-center gap-5 text-sm">
          <NuxtLink to="/about" class="hover:text-brand-primary">{{
            t("nav.about")
          }}</NuxtLink>
          <NuxtLink to="/projects" class="hover:text-brand-primary">{{
            t("nav.projects")
          }}</NuxtLink>
          <NuxtLink to="/departments" class="hover:text-brand-primary">{{
            t("nav.departments")
          }}</NuxtLink>
          <NuxtLink to="/services" class="hover:text-brand-primary">{{
            t("nav.services")
          }}</NuxtLink>
          <NuxtLink to="/team" class="hover:text-brand-primary">{{
            t("nav.team")
          }}</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-brand-primary">{{
            t("nav.contact")
          }}</NuxtLink>

          <button
            class="ml-2 rounded-md border border-white/10 px-3 py-1 hover:border-brand-primary/60"
            @click="locale = locale === 'en' ? 'ar' : 'en'"
          >
            {{ locale === "en" ? "AR" : "EN" }}
          </button>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-10">
      <slot />
    </main>
  </div>
</template>