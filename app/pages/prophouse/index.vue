<script setup lang="ts">
import ProphouseHero from "~/components/blocks/prophouse/ProphouseHero.vue";
import ContactSection from "~/components/ui/ContactSection.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();

useHead({
  title: "PropHouse - About",
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
    class="bg-[var(--prophouse-bg-color)] text-[var(--prophouse-text-color)]"
    style="
      --cursor-color: var(--prophouse-text-color);
      --primary-color: var(--prophouse-text-color);
      --color-primary: var(--prophouse-text-color);
    "
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <ProphouseHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
