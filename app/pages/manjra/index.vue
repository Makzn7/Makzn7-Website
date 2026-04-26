<script setup lang="ts">
import ManjraHero from "~/components/blocks/manjra/ManjraHero.vue";
import ContactSection from "~/components/ui/ContactSection.vue";

import { manjraTeam } from "~/mocks/team";

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
    class="bg-[#D3C393]"
    style="--cursor-color: #292b2c"
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <ManjraHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
        :teams="manjraTeam"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
