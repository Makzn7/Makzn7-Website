<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const enabled = ref(false);
const hRef = ref<HTMLElement | null>(null);
const vRef = ref<HTMLElement | null>(null);

const move = (e: MouseEvent) => {
  if (!enabled.value || !hRef.value || !vRef.value) return;
  const x = e.clientX;
  const y = e.clientY;
  hRef.value.style.transform = `translateY(${y}px)`;
  vRef.value.style.transform = `translateX(${x}px)`;
};

onMounted(() => {
  enabled.value = window.matchMedia("(pointer: fine)").matches;
  if (!enabled.value) return;
  document.addEventListener("mousemove", move, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", move);
});
</script>

<template>
  <div v-if="enabled" class="cursor-layer" aria-hidden="true">
    <div ref="hRef" class="line horizontal"></div>
    <div ref="vRef" class="line vertical"></div>
  </div>
</template>

<style scoped>
.cursor-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}

.line {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
  opacity: 0.55;
  filter: drop-shadow(0 0 0.25px rgba(255, 255, 255, 0.2));
}

.line.horizontal {
  width: 100vw;
  height: 1px;
  background: repeating-linear-gradient(
    90deg,
    var(--cursor-color) 0 6px,
    var(--cursor-color) 6px 14px
  );
  transform: translateY(50vh);
}

.line.vertical {
  height: 100vh;
  width: 1px;
  background: repeating-linear-gradient(
    0deg,
    var(--cursor-color) 0 6px,
    var(--cursor-color) 6px 14px
  );
  transform: translateX(50vw);
}
</style>