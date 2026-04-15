<template>
  <div class="media-slider" ref="sliderRef">
    <!-- Main display -->
    <div class="slider-viewport" ref="viewportRef">
      <div
        class="slider-track"
        :style="{ transform: `translateX(${-currentIndex * 100}%)` }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="slider-slide"
        >
          <!-- Image -->
          <img
            v-if="item.type === 'image'"
            :src="item.src"
            :alt="item.alt || ''"
            class="slider-media"
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
import { ref } from "vue";
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

const sliderRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);

let autoplayTimer: ReturnType<typeof setInterval> | null = null;
let touchStartX = 0;
let touchDeltaX = 0;

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function next() {
  if (currentIndex.value < props.items.length - 1) {
    currentIndex.value++;
  }
}

function goTo(index: number) {
  currentIndex.value = index;
}

/* Touch / swipe support */
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]?.clientX ?? 0;
  touchDeltaX = 0;
}

function onTouchMove(e: TouchEvent) {
  touchDeltaX = (e.touches[0]?.clientX ?? 0) - touchStartX;
}

function onTouchEnd() {
  const threshold = 50;
  if (touchDeltaX > threshold) {
    // Check RTL
    const isRTL = document.documentElement.dir === "rtl";
    isRTL ? next() : prev();
  } else if (touchDeltaX < -threshold) {
    const isRTL = document.documentElement.dir === "rtl";
    isRTL ? prev() : next();
  }
}

/* Keyboard support */
function onKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") prev();
  else if (e.key === "ArrowRight") next();
}

/* Autoplay */
function startAutoplay() {
  if (!props.autoplay || props.items.length <= 1) return;
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

onMounted(() => {
  const el = viewportRef.value;
  if (el) {
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
  }
  startAutoplay();
});

onUnmounted(() => {
  const el = viewportRef.value;
  if (el) {
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchmove", onTouchMove);
    el.removeEventListener("touchend", onTouchEnd);
  }
  stopAutoplay();
});
</script>

<style scoped>
.media-slider {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slider-viewport {
  width: 100%;
  overflow: hidden;
}

.slider-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.slider-slide {
  flex: 0 0 100%;
  width: 100%;
}

.slider-media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  transition: background 0.3s ease, opacity 0.3s ease;
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
