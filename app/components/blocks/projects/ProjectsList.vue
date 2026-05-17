<template>
  <div
    class="projects-list relative lg:border-s-[0.3px] border-white-op50 border-brand-text"
    :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
  >
    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 6"
        :key="i"
        class="h-[250px] animate-pulse bg-white/5 border-e-[0.3px] border-b-[0.3px] border-white/10"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!projects.length"
      class="flex items-center justify-center h-[250px]"
    >
      <span class="text-brand-text/30 text-[12px] tracking-wider uppercase">
        {{ $t("projects.empty") }}
      </span>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(project, index) in projects"
        :key="project.id ?? index"
        class="project-card group cursor-pointer"
      >
        <NuxtLink :to="`/projects/${project.slug}`" class="block w-full h-full">
          <div class="relative w-full h-full overflow-hidden">
            <img
              v-if="project.heroMedia?.src"
              :src="project.heroMedia.src"
              :alt="locale === 'ar' ? project.name_ar : project.name_en"
              loading="lazy"
              class="w-full h-full object-cover transition-[filter] duration-500 grayscale group-hover:grayscale-0"
            />
            <div
              v-else
              class="w-full h-full bg-brand-text/10 flex items-center justify-center"
            >
              <span class="text-brand-text/30 text-[10px] tracking-wider">
                {{ locale === "ar" ? project.name_ar : project.name_en }}
              </span>
            </div>

            <!-- Desktop: dim overlay that fades on hover (existing behaviour) -->
            <div
              class="hidden lg:block absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
            />

            <!-- Desktop: centered hover label (existing behaviour) -->
            <div
              class="hidden lg:group-hover:flex absolute w-full h-full top-0 left-0 items-center justify-center p-4 pointer-events-none"
            >
              <span
                class="text-primary font-bold text-center tracking-[0px]"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(projectSize * 0.35)
                )}px, ${(projectSize / 20).toFixed(1)}vw, ${projectSize}px);`"
              >
                {{ locale === "ar" ? project.name_ar : project.name_en }}
              </span>
            </div>

            <!--
              Mobile: name always visible. There's no hover on touch, so the
              desktop reveal pattern leaves cards anonymous. A gradient
              caption keeps the photo dominant while making the title
              legible.
            -->
            <div
              class="project-card__caption lg:hidden absolute inset-x-0 bottom-0 pointer-events-none flex items-end px-4 pt-10 pb-4"
            >
              <span
                class="text-primary font-semibold tracking-[0.2px] leading-tight line-clamp-2"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(projectSize * 0.35)
                )}px, ${(projectSize / 20).toFixed(1)}vw, ${projectSize}px);`"
              >
                {{ locale === "ar" ? project.name_ar : project.name_en }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";

const { locale } = useI18n();

withDefaults(
  defineProps<{
    projects?: Project[];
    marginS?: number;
    py?: number;
    projectSize?: number;
    loading?: boolean;
  }>(),
  {
    projects: () => [],
    marginS: 140,
    py: 4,
    projectSize: 38,
    loading: false,
  }
);
</script>

<style scoped>
.project-card {
  height: 250px;
}

.project-card__caption {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.55) 55%,
    rgba(0, 0, 0, 0) 100%
  );
}

/* Cards on mobile aren't grayscaled — keeps the title readable and the
   imagery vibrant on a small screen where there's no hover to reveal it. */
@media (max-width: 1023px) {
  .project-card img {
    filter: none !important;
  }
}

@media (max-width: 747px) {
  .projects-list {
    margin-inline-start: 0 !important;
    width: 100% !important;
  }
  .project-card {
    height: 220px;
  }
}
</style>
