<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import AboutHero from "~/components/blocks/about/AboutHero.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { data: pageData, error } = useAbout();

const { t } = useI18n();

usePageSeo({
  page: () => pageData.value?.data || null,
  title: () => t("seo.aboutTitle"),
  description: () => t("seo.aboutDescription"),
});
</script>

<template>
  <div ref="scrollContainer" class="bg-brand-bg" data-scroll-container>
    <section class="sticky top-0 z-[1]" id="hero-section">
      <AboutHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
        :data="pageData"
        :error="error"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
