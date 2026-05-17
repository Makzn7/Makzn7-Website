<script setup lang="ts">
import ManjraHero from "~/components/blocks/manjra/ManjraHero.vue";
import ContactSection from "~/components/ui/ContactSection.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();

useHead({
  title: "Manjra - About",
  meta: [
    {
      name: "description",
      content: () => t("meta.description"),
    },
  ],
});
</script>

<template>
  <div
    ref="scrollContainer"
    class="bg-[var(--manjra-bg-color)] text-[var(--manjra-text-color)]"
    style="--cursor-color: var(--manjra-text-color)"
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <ManjraHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
