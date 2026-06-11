<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import ContactHero from "~/components/blocks/contact/ContactHero.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();

useSeo({
  title: () => t("seo.contactTitle"),
  description: () => t("seo.contactDescription"),
});
</script>
<template>
  <div ref="scrollContainer" class="bg-brand-bg" data-scroll-container>
    <section class="relative z-[1]" id="hero-section">
      <ContactHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>