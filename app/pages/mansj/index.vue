<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import MansjHero from "~/components/blocks/mansj/MansjHero.vue";
import { team } from "~/mocks/mansjTeam";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();

useHead({
  title: "Mansaj - About",
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
    class="bg-[#0A305A]"
    style="--cursor-color: #ffffff"
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <MansjHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
        :teams="team"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection bgColor="#0A305A" />
    </section>
  </div>
</template>
