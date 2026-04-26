<template>
  <div
    class="relative border-s-[0.3px] border-white-op50 border-brand-text"
    :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
  >
    <div class="grid grid-cols-3">
      <div
        v-for="(project, index) in projects"
        :key="project.id ?? index"
        class="project-card group cursor-pointer"
      >
        <NuxtLink :to="`/projects/${project.id}`" class="block w-full h-full">
          <div class="relative w-full h-full overflow-hidden">
            <img
              v-if="project.heroMedia?.src"
              :src="project.heroMedia.src"
              :alt="project.name_en"
              loading="lazy"
              class="w-full h-full object-cover transition-[filter] duration-500 grayscale group-hover:grayscale-0"
            />
            <div
              v-else
              class="w-full h-full bg-brand-text/10 flex items-center justify-center"
            >
              <span class="text-brand-text/30 text-[10px] tracking-wider">
                {{ project.name_en }}
              </span>
            </div>
            <div
              class="absolute w-full h-full top-0 left-0 hidden group-hover:flex items-center justify-center p-4"
            >
              <span
                class="text-primary font-bold text-center tracking-[0px]"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(projectSize * 0.35)
                )}px, ${(projectSize / 20).toFixed(1)}vw, ${projectSize}px);`"
              >
                {{ project.name_en }}
              </span>
            </div>
            <!-- طبقة شفافة تختفي عند الهوفر -->
            <div
              class="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
            ></div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";

const props = withDefaults(
  defineProps<{
    projects?: Project[];
    marginS?: number;
    py?: number;
    projectSize?: number;
  }>(),
  {
    projects: () => [],
    marginS: 140,
    py: 4,
    projectSize: 38,
  }
);
</script>

<style scoped>
.project-card {
  height: 250px;
  /* border-right: 0.3px solid var(--color-primary);
  border-bottom: 0.3px solid var(--color-primary); */
}
</style>
