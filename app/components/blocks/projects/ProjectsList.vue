<template>
  <div
    class="relative border-s-[0.3px] border-white-op50 border-brand-text"
    :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
  >
    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-3">
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
    <div v-else class="grid grid-cols-3">
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
            <div
              class="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";

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
</style>
