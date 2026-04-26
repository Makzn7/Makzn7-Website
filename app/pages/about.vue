<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import AboutHero from "~/components/blocks/about/AboutHero.vue";
import { team } from "~/mocks/team";
import { awards } from "~/mocks/awards";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();

useHead({
  title: "Makzn7 - About",
  meta: [
    {
      name: "description",
      content: () => t("meta.description"),
    },
  ],
});
</script>

<template>
  <div ref="scrollContainer" class="bg-brand-bg" data-scroll-container>
    <section class="sticky top-0 z-[1]" id="hero-section">
      <AboutHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
        :teams="team"
        :awards="awards"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
