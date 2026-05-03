<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <div class="flex flex-col w-full min-h-screen text-white">
      <FilterSection
        :margin-s="marginS"
        :filters="filters"
        :active-filters="activeFilters"
        :loading="filtersPending"
        :error="filtersError"
        @toggle-filter="$emit('toggle-filter', $event)"
      />
      <section>
        <ProjectsList
          :margin-s="marginS"
          :py="py"
          :projects="projects"
          :loading="projectsPending"
        />
      </section>
    </div>
    <div class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]" />
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";
import FilterSection from "./FilterSection.vue";
import ProjectsList from "./ProjectsList.vue";

interface Filter {
  id: number | string;
  type: string;
  name_ar: string;
  name_en: string;
  slug: string;
}

withDefaults(
  defineProps<{
    marginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;
    projects?: Project[];
    py?: number;
    marginB?: number;
    filters?: Filter[];
    activeFilters?: Filter[];
    filtersPending?: boolean;
    filtersError?: boolean;
    projectsPending?: boolean;
  }>(),
  {
    marginTop: 4,
    marginS: 140,
    px: 1,
    imageW: 100,
    titleS: 130,
    descSize: 37,
    projects: () => [],
    py: 4,
    marginB: 2,
    filters: () => [],
    activeFilters: () => [],
    filtersPending: false,
    filtersError: false,
    projectsPending: false,
  }
);

defineEmits<{
  "toggle-filter": [filter: Filter];
}>();
</script>
