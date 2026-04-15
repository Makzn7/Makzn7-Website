<template>
  <div ref="listRef" class="projects-list">
    <div
      v-for="(project, index) in projects"
      :key="project.id"
      class="project-item"
      :style="{ height: itemHeight + 'px' }"
      :class="{ 'hover-enabled': showHover }"
      :data-image-url="project.hoverMedia?.src || project.heroMedia?.src"
      @mouseenter="showHover && onEnter($event, project)"
      @mouseleave="showHover && $emit('hover-leave')"
    >
      <h3
        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[54px] 2xl:text-6xl font-extrabold leading-none"
        :style="{ animationDelay: index * 0.08 + 's' }"
      >
        {{ locale === "ar" ? project.name_ar : project.name_en }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Project } from "~/types/project";

const props = withDefaults(
  defineProps<{
    projects: Project[];
    itemHeight?: number;
    showHover?: boolean;
  }>(),
  {
    itemHeight: 96,
    showHover: false,
  }
);

const emit = defineEmits(["hover-enter", "hover-leave"]);
const { locale } = useI18n();

function onEnter(e: MouseEvent, project: Project) {
  const target = e.currentTarget as HTMLElement | null;
  if (!target) return;

  const url = target.getAttribute("data-image-url");
  if (!url) return;

  // موضع عشوائي داخل center-part
  const parent = target.closest(".center-part");
  if (!parent) return;
  const pr = parent.getBoundingClientRect();
  const maxX = pr.width - 200;
  const maxY = pr.height - 200;

  emit("hover-enter", {
    url,
    x: Math.max(0, Math.random() * maxX),
    y: Math.max(0, Math.random() * maxY),
  });
}
</script>

<style scoped>
.projects-list {
  width: 100%;
}

.project-item {
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
}

.project-item.hover-enabled {
  transition: background 0.2s;
}
.project-item.hover-enabled:hover {
  background: #f5f5f5;
}
</style>
