<template>
  <div
    class="relative border-s-[0.3px] border-brand-text"
    :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
  >
    <div class="grid grid-cols-3">
      <div
        v-for="(project, index) in projects"
        :key="project.id ?? index"
        class="project-card group cursor-pointer"
      >
        <div class="relative w-full h-full overflow-hidden">
          <img
            v-if="project.heroMedia?.src"
            :src="project.heroMedia.src"
            :alt="project.name_en"
            class="w-full h-full object-cover transition-[filter] duration-500 grayscale group-hover:grayscale-0"
          />
          <div
            v-else
            class="w-full h-full bg-brand-text/10 flex items-center justify-center"
          >
            <span
              class="text-brand-text/30 text-[10px] uppercase tracking-wider"
            >
              {{ project.name_en }}
            </span>
          </div>
          <!-- طبقة شفافة تختفي عند الهوفر -->
          <div
            class="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
  marginS: { type: Number, default: 140 },
  py: { type: Number, default: 4 },
});
</script>

<style scoped>
.project-card {
  height: 250px;
  /* border-right: 0.3px solid var(--color-primary);
  border-bottom: 0.3px solid var(--color-primary); */
}
</style>
