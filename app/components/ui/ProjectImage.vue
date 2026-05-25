<!--
  ProjectImage
  ────────────
  Wraps a project hero image (or any same-shape card image) with:
  - A skeleton placeholder that occupies the same box (no layout shift).
  - A soft fade-in once the image has decoded.
  - A graceful fallback if the image fails or no src is provided.

  The wrapper itself is `absolute inset-0` by default so it can be dropped
  inside any sized parent (card, grid cell). It does not own its own height
  — the parent does, which keeps it consistent with the existing card
  structure.
-->
<template>
  <div
    class="project-image"
    :class="{ 'is-loaded': loaded, 'is-errored': errored }"
  >
    <!-- Skeleton placeholder — hides once the image is ready / errored. -->
    <div
      v-if="!loaded && !errored && hasSrc"
      class="project-image__skeleton"
      aria-hidden="true"
    />

    <img
      v-if="hasSrc && !errored"
      ref="imgRef"
      :src="src!"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      class="project-image__img"
      @load="onLoad"
      @error="onError"
    />

    <!-- Fallback: shown when no src OR the image errored. -->
    <div v-else class="project-image__fallback" aria-hidden="true">
      <span v-if="fallbackLabel" class="project-image__fallback-label">
        {{ fallbackLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    src?: string | null;
    alt?: string;
    loading?: "lazy" | "eager";
    decoding?: "async" | "sync" | "auto";
    fallbackLabel?: string;
  }>(),
  {
    src: "",
    alt: "",
    loading: "lazy",
    decoding: "async",
    fallbackLabel: "",
  },
);

const loaded = ref(false);
const errored = ref(false);

const hasSrc = computed(() => Boolean(props.src));

function onLoad() {
  errored.value = false;
  loaded.value = true;
}

function onError() {
  loaded.value = false;
  errored.value = true;
}

// Reset state when src changes (e.g. filter switch reuses the same DOM node).
watch(
  () => props.src,
  () => {
    loaded.value = false;
    errored.value = false;
  },
);

const imgRef = ref<HTMLImageElement | null>(null);

function checkCached() {
  const img = imgRef.value;
  if (img && img.complete && img.naturalWidth > 0) {
    loaded.value = true;
  }
}

onMounted(() => {
  // Catch cached images that decoded before the listener was wired.
  checkCached();
});

watch(
  () => props.src,
  () => {
    nextTick(checkCached);
  },
);
</script>

<style scoped>
.project-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.project-image__skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.09) 45%,
    rgba(255, 255, 255, 0.04) 90%
  );
  background-size: 200% 100%;
  animation: project-image-shimmer 1.6s ease-in-out infinite;
}

@keyframes project-image-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.project-image__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 600ms ease, filter 500ms ease;
}

.project-image.is-loaded .project-image__img {
  opacity: 1;
}

.project-image__fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
}

.project-image__fallback-label {
  color: rgba(255, 255, 255, 0.3);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  padding: 0 12px;
}

@media (prefers-reduced-motion: reduce) {
  .project-image__skeleton {
    animation: none;
  }
  .project-image__img {
    transition: opacity 200ms ease;
  }
}
</style>
