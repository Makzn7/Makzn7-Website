<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!-- Filtering -->
      <FilterSection
        :margin-s="marginS"
        :filters="filters"
        :active-filters="activeFilters"
      />
      <!-- Projects List -->
      <section>
        <ProjectsList :margin-s="marginS" :py="py" :projects="projects" />
      </section>
    </div>

    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
    ></div>
  </div>
</template>
<script setup>
import FilterSection from "./FilterSection.vue";
import ProjectsList from "./ProjectsList.vue";
const props = defineProps({
  marginTop: { type: Number, default: 4 },
  marginS: { type: Number, default: 140 },
  px: { type: Number, default: 1 },
  imageW: { type: Number, default: 100 },
  titleS: { type: Number, default: 130 },
  descSize: { type: Number, default: 37 },
  projects: {
    type: Array,
    default: () => projects,
  },
  py: { type: Number, default: 4 },
  marginB: { type: Number, default: 2 },
  filters: {
    type: Array,
    default: () => [],
  },
  activeFilters: {
    type: Array,
    default: () => [],
  },
});
</script>
