<template>
  <div class="projects-list">
    <div
      v-for="project in projects"
      :key="project.id"
      class="project-item"
      :style="{ height: itemHeight + 'px' }"
      :class="{ 'hover-enabled': showHover }"
      :data-image-url="project.hoverMedia?.src || project.heroMedia?.src"
      @mouseenter="showHover && onEnter($event, project)"
      @mouseleave="showHover && $emit('hover-leave')"
    >
      <h3 class="text-6xl font-extrabold leading-none">{{ project.name }}</h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  projects: { type: Array, required: true },
  itemHeight: { type: Number, default: 96 },
  showHover: { type: Boolean, default: false },
});

const emit = defineEmits(["hover-enter", "hover-leave"]);

function onEnter(e, project) {
  const url = e.currentTarget.getAttribute("data-image-url");
  if (!url) return;

  // موضع عشوائي داخل center-part
  const parent = e.currentTarget.closest(".center-part");
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