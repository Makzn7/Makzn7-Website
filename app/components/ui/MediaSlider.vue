<template>
  <div class="media-slider" ref="sliderRef">
    <!-- Main display -->
    <div
      class="slider-viewport"
      :class="{ 'is-dragging': isDragging }"
      ref="viewportRef"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @lostpointercapture="onPointerUp"
      @touchmove="onTouchMoveNative"
      @touchend="onTouchEndNative"
      @touchcancel="onTouchEndNative"
    >
      <div
        class="slider-track"
        :class="{ 'is-dragging': isDragging }"
        :style="trackStyle"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="slider-slide"
          :style="{ width: `${slideWidth}px` }"
        >
          <!-- Image -->
          <img
            v-if="item.type === 'image'"
            :src="item.src"
            :alt="item.alt || ''"
            class="slider-media"
            draggable="false"
            loading="lazy"
          />
          <!-- Video -->
          <video
            v-else-if="item.type === 'video'"
            :src="item.src"
            class="slider-media"
            muted
            loop
            playsinline
            @mouseenter="($event.target as HTMLVideoElement).play()"
            @mouseleave="($event.target as HTMLVideoElement).pause()"
          />
          <!-- GIF — treated as image -->
          <img
            v-else-if="item.type === 'gif'"
            :src="item.src"
            :alt="item.alt || ''"
            class="slider-media"
            draggable="false"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Navigation arrows -->
    <button
      v-if="items.length > 1"
      class="slider-arrow slider-arrow--prev"
      :class="{ 'slider-arrow--disabled': currentIndex === 0 }"
      @click="prev"
      aria-label="Previous slide"
    >
      <span class="arrow-icon">&larr;</span>
    </button>
    <button
      v-if="items.length > 1"
      class="slider-arrow slider-arrow--next"
      :class="{ 'slider-arrow--disabled': currentIndex === items.length - 1 }"
      @click="next"
      aria-label="Next slide"
    >
      <span class="arrow-icon">&rarr;</span>
    </button>

    <!-- Dot indicators -->
    <div v-if="items.length > 1" class="slider-dots">
      <button
        v-for="(_, index) in items"
        :key="index"
        class="slider-dot"
        :class="{ 'slider-dot--active': index === currentIndex }"
        @click="goTo(index)"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { Media } from "~/types/project";

const props = withDefaults(
  defineProps<{
    items: Media[];
    autoplay?: boolean;
    interval?: number;
  }>(),
  {
    autoplay: false,
    interval: 5000,
  }
);

/* ── refs ── */
const sliderRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const isDragging = ref(false);
const dragOffset = ref(0);
const viewportWidth = ref(0);
const isRtl = ref(false);

const slideWidth = computed(() => viewportWidth.value);

const trackOffset = computed(() => {
  const offset = currentIndex.value * slideWidth.value;
  return isRtl.value ? offset : -offset;
});

/* Visual offset combines the snapped position with any live drag delta */
const trackStyle = computed(() => ({
  transform: `translate3d(${trackOffset.value + dragOffset.value}px, 0, 0)`,
}));

/* ── navigation ── */
function prev() {
  if (currentIndex.value > 0) currentIndex.value--;
}
function next() {
  if (currentIndex.value < props.items.length - 1) currentIndex.value++;
}
function goTo(index: number) {
  currentIndex.value = index;
}

/* ── measurement ── */
function measure() {
  const el = viewportRef.value;
  if (!el || typeof window === "undefined") return;
  viewportWidth.value = el.clientWidth;
  isRtl.value = document.documentElement.dir === "rtl";
}

/* ── pointer-driven drag (covers touch + mouse + pen uniformly) ── */
let pointerStartX = 0;
let pointerStartY = 0;
let pointerId: number | null = null;
let dragAxisLocked: "h" | "v" | null = null;
const AXIS_LOCK_DISTANCE = 6; // px before we commit to horizontal or vertical

function onPointerDown(e: PointerEvent) {
  if (props.items.length <= 1) return;
  // Ignore right/middle clicks
  if (e.pointerType === "mouse" && e.button !== 0) return;
  // Ignore clicks bubbling up from interactive children (e.g. dot buttons)
  if ((e.target as HTMLElement | null)?.closest("button")) return;

  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  pointerId = e.pointerId;
  dragAxisLocked = null;
  dragOffset.value = 0;
  isDragging.value = true;

  // Pause autoplay while user is interacting
  stopAutoplay();
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || e.pointerId !== pointerId) return;

  const deltaX = e.clientX - pointerStartX;
  const deltaY = e.clientY - pointerStartY;

  /* Axis lock: once the user has moved past a small threshold, decide if
     they're swiping the slider (horizontal) or scrolling the page
     (vertical). If vertical, abandon the drag so the page can scroll. */
  if (dragAxisLocked === null) {
    if (
      Math.abs(deltaX) < AXIS_LOCK_DISTANCE &&
      Math.abs(deltaY) < AXIS_LOCK_DISTANCE
    ) {
      return;
    }
    dragAxisLocked = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
    if (dragAxisLocked === "v") {
      cancelDrag();
      return;
    }
    // Take pointer capture only after we know it's a horizontal swipe so
    // we don't hijack vertical scrolls.
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* setPointerCapture can throw if the pointer is no longer active */
    }
  }

  e.preventDefault();
  e.stopPropagation();

  // Resist beyond the edges so the track feels tied to the content
  let resistedDelta = deltaX;
  const atStart = currentIndex.value === 0;
  const atEnd = currentIndex.value === props.items.length - 1;
  // Treat "moving away from a boundary" with resistance
  const movingPastStart = isRtl.value ? deltaX < 0 : deltaX > 0;
  const movingPastEnd = isRtl.value ? deltaX > 0 : deltaX < 0;
  if ((atStart && movingPastStart) || (atEnd && movingPastEnd)) {
    resistedDelta = deltaX * 0.35;
  }
  dragOffset.value = resistedDelta;
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging.value) return;
  if (e.pointerId !== pointerId && pointerId !== null) return;

  isDragging.value = false;
  pointerId = null;

  const delta = dragOffset.value;
  // Threshold: 18% of slide width or 40px, whichever is larger
  const threshold = Math.max(40, slideWidth.value * 0.18);

  if (delta > threshold) {
    isRtl.value ? next() : prev();
  } else if (delta < -threshold) {
    isRtl.value ? prev() : next();
  }

  dragOffset.value = 0;
  dragAxisLocked = null;
  startAutoplay();
}

function cancelDrag() {
  isDragging.value = false;
  dragOffset.value = 0;
  pointerId = null;
  dragAxisLocked = null;
}

function onTouchMoveNative(e: TouchEvent) {
  if (isDragging.value && dragAxisLocked === "h") {
    e.preventDefault();
    e.stopPropagation();
  }
}

function onTouchEndNative(e: TouchEvent) {
  if (dragAxisLocked === "h") {
    e.stopPropagation();
  }
}

/* ── keyboard ── */
function onKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") (isRtl.value ? next : prev)();
  else if (e.key === "ArrowRight") (isRtl.value ? prev : next)();
}

/* ── autoplay ── */
let autoplayTimer: ReturnType<typeof setInterval> | null = null;
function startAutoplay() {
  if (!props.autoplay || props.items.length <= 1) return;
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    if (currentIndex.value < props.items.length - 1) {
      currentIndex.value++;
    } else {
      currentIndex.value = 0;
    }
  }, props.interval);
}
function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

/* ── lifecycle ── */
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && viewportRef.value) {
    resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(viewportRef.value);
  }
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onKeydown);
  }
  startAutoplay();
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onKeydown);
  }
  stopAutoplay();
});
</script>

<style scoped>
.media-slider {
  position: relative;
  width: 100%;
  height: 100%;
  /* `contain: layout paint` isolates re-paints from drag updates */
  contain: layout paint;
  background: var(--color-bg-secondary, #0a0a0a);
}

.slider-viewport {
  width: 100%;
  /* Inherits height from the parent (callers set their own aspect ratio /
     max-height). Falls back to a sensible value if mounted standalone. */
  height: 100%;
  min-height: 220px;
  overflow: hidden;
  /* Hint the browser this is a horizontal swipe region — improves
     touch-action ergonomics so vertical page scroll still works. */
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}
.slider-viewport.is-dragging,
.slider-track.is-dragging {
  cursor: grabbing;
}

.slider-track {
  display: flex;
  height: 100%;
  will-change: transform;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.slider-track.is-dragging {
  transition: none;
}

.slider-slide {
  flex: 0 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  -webkit-user-drag: none;
}

/* Arrows */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.3s ease,
    opacity 0.3s ease;
  opacity: 0;
}

.media-slider:hover .slider-arrow {
  opacity: 1;
}
.slider-arrow:hover {
  background: rgba(0, 0, 0, 0.7);
}
.slider-arrow--prev {
  left: 12px;
}
.slider-arrow--next {
  right: 12px;
}
html[dir="rtl"] .slider-arrow--prev {
  left: auto;
  right: 12px;
}
html[dir="rtl"] .slider-arrow--next {
  right: auto;
  left: 12px;
}
.slider-arrow--disabled {
  opacity: 0 !important;
  pointer-events: none;
}
.arrow-icon {
  font-size: 18px;
  line-height: 1;
}

/* Hide arrows on touch-only devices — drag covers navigation */
@media (hover: none) {
  .slider-arrow {
    display: none;
  }
}

/* Dots */
.slider-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 3;
}

.slider-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.slider-dot--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.3);
}
</style>
