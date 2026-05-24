<template>
  <div class="media-slider" ref="sliderRef">
    <ClientOnly>
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="0"
        :loop="false"
        :speed="550"
        :allow-touch-move="true"
        :threshold="5"
        :touch-angle="35"
        :touch-start-prevent-default="false"
        :passive-listeners="true"
        :navigation="
          items.length > 1
            ? {
                prevEl: prevBtn,
                nextEl: nextBtn,
                disabledClass: 'slider-arrow--disabled',
              }
            : false
        "
        :pagination="
          items.length > 1
            ? {
                el: dotsEl,
                clickable: true,
                bulletClass: 'slider-dot',
                bulletActiveClass: 'slider-dot--active',
              }
            : false
        "
        :autoplay="
          autoplay && items.length > 1
            ? {
                delay: interval,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }
            : false
        "
        :dir="isRtl ? 'rtl' : 'ltr'"
        :key="isRtl ? 'rtl' : 'ltr'"
        class="slider-viewport"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="(item, index) in items"
          :key="index"
          class="slider-slide"
        >
          <img
            v-if="item.type === 'image' || item.type === 'gif'"
            :src="item.src"
            :alt="item.alt || ''"
            class="slider-media"
            draggable="false"
            loading="lazy"
          />
          <video
            v-else-if="item.type === 'video'"
            :src="item.src"
            class="slider-media"
            muted
            loop
            playsinline
            preload="metadata"
            @mouseenter="($event.target as HTMLVideoElement).play()"
            @mouseleave="($event.target as HTMLVideoElement).pause()"
          />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>

    <!-- Navigation arrows (Swiper binds to these refs) -->
    <button
      v-if="items.length > 1"
      ref="prevBtn"
      class="slider-arrow slider-arrow--prev"
      aria-label="Previous slide"
      type="button"
    >
      <span class="arrow-icon">&larr;</span>
    </button>
    <button
      v-if="items.length > 1"
      ref="nextBtn"
      class="slider-arrow slider-arrow--next"
      aria-label="Next slide"
      type="button"
    >
      <span class="arrow-icon">&rarr;</span>
    </button>

    <!-- Pagination dots (Swiper renders bullets into this container) -->
    <div
      v-if="items.length > 1"
      ref="dotsEl"
      class="slider-dots justify-center"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import type { Media } from "~/types/project";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

const modules = [Navigation, Pagination, Autoplay];

const sliderRef = ref<HTMLElement | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const nextBtn = ref<HTMLElement | null>(null);
const dotsEl = ref<HTMLElement | null>(null);
const isRtl = ref(false);

let swiperInstance: SwiperClass | null = null;

function onSwiper(s: SwiperClass) {
  swiperInstance = s;
}

function onSlideChange() {
  // reserved: emit/update if needed in the future
}

function syncDir() {
  if (typeof document === "undefined") return;
  isRtl.value = document.documentElement.dir === "rtl";
}

function onKeydown(e: KeyboardEvent) {
  if (!swiperInstance) return;
  if (e.key === "ArrowLeft") {
    isRtl.value ? swiperInstance.slideNext() : swiperInstance.slidePrev();
  } else if (e.key === "ArrowRight") {
    isRtl.value ? swiperInstance.slidePrev() : swiperInstance.slideNext();
  }
}

let dirObserver: MutationObserver | null = null;

onMounted(() => {
  syncDir();
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onKeydown);
  }
  if (typeof MutationObserver !== "undefined") {
    dirObserver = new MutationObserver(() => syncDir());
    dirObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onKeydown);
  }
  dirObserver?.disconnect();
  dirObserver = null;
  swiperInstance = null;
});
</script>

<style scoped>
.media-slider {
  position: relative;
  width: 100%;
  height: 100%;
  contain: layout paint;
  background: var(--color-bg-secondary, #0a0a0a);
}

.slider-viewport {
  width: 100%;
  height: 100%;
  min-height: 220px;
  overflow: hidden;
  /* Keep vertical page scroll responsive on touch — Swiper handles
     horizontal panning itself. */
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}
.slider-viewport:active {
  cursor: grabbing;
}

.slider-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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
:global(html[dir="rtl"]) .slider-arrow--prev {
  left: auto;
  right: 12px;
}
:global(html[dir="rtl"]) .slider-arrow--next {
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

/* Hide arrows on touch-only devices — swipe covers navigation */
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
</style>

<style>
/* Unscoped so the rules apply to bullets injected by Swiper into the
   pagination container above. */
.slider-dots .slider-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  display: inline-block;
  opacity: 1;
}
.slider-dots .slider-dot--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.3);
}
</style>
