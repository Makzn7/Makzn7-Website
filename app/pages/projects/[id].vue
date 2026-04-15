
<template>
  <div ref="scrollContainer" class="bg-brand-bg" data-scroll-container>
    <section class="sticky top-0 z-[1]" id="hero-section">
      <ProjectDetailsHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
        :project="project"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection />
    </section>
  </div>
</template>
<script setup lang="ts">
import type { Project } from "~/types/project";
import { projects } from "~/mocks/projects";
import ContactSection from "~/components/ui/ContactSection.vue";
import ProjectDetailsHero from "~/components/blocks/projects/details/ProjectDetailsHero.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t, locale } = useI18n();

const route = useRoute();
const project = ref<Project | null>(null);

// TODO: Fetch project data from an API or use a store instead of hardcoded data
const id = Number.parseInt(route.params.id as string, 10);
project.value = projects.find((p) => p.id === id) || null;

const pageTitle = computed(() => {
  if (!project.value) return "Makzn7";
  const name =
    locale.value === "ar" ? project.value.name_ar : project.value.name_en;
  return `Makzn7 - ${name}`;
});

useHead({
  title: () => pageTitle.value,
  meta: [
    {
      name: "description",
      content: () => t("meta.description"),
    },
  ],
});
</script>