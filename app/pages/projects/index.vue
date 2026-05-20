<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import ProjectsHero from "~/components/blocks/projects/ProjectsHero.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();

useSeo({
  title: () => t("seo.projectsTitle"),
  description: () => t("seo.projectsDescription"),
});
</script>

<template>
  <div ref="scrollContainer" class="bg-brand-bg" data-scroll-container>
    <section class="sticky top-0 z-[1]" id="hero-section">
      <ProjectsHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection />
    </section>
  </div>
</template>
