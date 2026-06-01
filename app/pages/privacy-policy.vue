<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import PrivacyPolicyHero from "~/components/blocks/privacyPolicy/PrivacyPolicyHero.vue";
const { t } = useI18n();

useSeo({
  title: () => t("seo.privacyTitle"),
  description: () => t("seo.privacyDescription"),
  noindex: true,
});
</script>

<template>
  <div ref="scrollContainer" class="bg-brand-bg" data-scroll-container>
    <section class="sticky top-0 z-[1]" id="hero-section">
      <PrivacyPolicyHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
