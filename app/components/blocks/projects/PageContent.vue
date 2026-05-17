<template>
  <div
    class="page-content relative"
    :style="{
      '--mt': marginTop + 'rem',
      '--mt-mobile': (mobileMarginTop ?? marginTop) + 'rem',
    }"
  >
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div
        class="w-full lg:border-b-[0.3px] border-white-op50 border-brand-text h-[90px]"
      >
        <div
          class="flex logo-image p-4 w-full lg:hidden justify-center items-center"
        >
          <NuxtLink to="/">
            <img
              src="/logos/svg/logo_black.svg"
              width="100"
              alt="Makzn7"
              class="dark:invert"
            />
          </NuxtLink>
        </div>
      </div>
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
    mobileMarginTop: number;
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
    mobileMarginTop: 4,
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

<style scoped>
.page-content {
  margin-top: var(--mt, 4rem);
}

@media (max-width: 767px) {
  .page-content {
    margin-top: var(--mt-mobile, var(--mt, 4rem));
  }
}
</style>

