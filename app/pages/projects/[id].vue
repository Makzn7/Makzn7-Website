
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
import ContactSection from "~/components/ui/ContactSection.vue";
import ProjectDetailsHero from "~/components/blocks/projects/details/ProjectDetailsHero.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t, locale } = useI18n();

const route = useRoute();

const id = route.params.id as string;

const { data: project, pending: pendingProject } = useProject(id);

// Used only when neither the project's own SEO nor global settings SEO
// supply one. Falls back to a friendly "<project name> — Makzn7" form
// so direct loads always have a sensible title even before the API resolves.
const fallbackTitle = computed(() => {
  if (!project.value) return t("seo.projectsTitle");
  const name =
    locale.value === "ar" ? project.value.name_ar : project.value.name_en;
  return `${name} — Makzn7`;
});

const fallbackDescription = computed(
  () => project.value?.summary || t("seo.projectsDescription")
);

useEntitySeo({
  entity: () => project.value,
  title: () => fallbackTitle.value,
  description: () => fallbackDescription.value,
});
</script>