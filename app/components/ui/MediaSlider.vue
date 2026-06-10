<template>
  <div class="media-slider" ref="sliderRef">
    <ClientOnly>
      <Swiper
        :modules="modules"
        :slides-per-view="hasMultiple ? 1.4 : 1"
        :space-between="hasMultiple ? 1 : 0"
        :breakpoints="sliderBreakpoints"
        :centered-slides="false"
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
          @click="onSlideClick(index)"
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

    <!-- Fullscreen lightbox / gallery -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="lightbox-fade">
          <div
            v-if="lightboxOpen"
            class="lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Media gallery"
            @click.self="closeLightbox"
          >
            <button
              type="button"
              class="lightbox-btn lightbox-close"
              aria-label="Close gallery"
              @click="closeLightbox"
            >
              <span class="lightbox-icon">&times;</span>
            </button>

            <div
              v-if="items.length > 1"
              class="lightbox-counter"
              aria-live="polite"
            >
              {{ lightboxIndex + 1 }} / {{ items.length }}
            </div>

            <button
              v-if="items.length > 1"
              ref="lbPrevBtn"
              type="button"
              class="lightbox-btn lightbox-nav lightbox-nav--prev"
              aria-label="Previous media"
            >
              <span class="lightbox-icon">&larr;</span>
            </button>
            <button
              v-if="items.length > 1"
              ref="lbNextBtn"
              type="button"
              class="lightbox-btn lightbox-nav lightbox-nav--next"
              aria-label="Next media"
            >
              <span class="lightbox-icon">&rarr;</span>
            </button>

            <Swiper
              :modules="lightboxModules"
              :slides-per-view="1"
              :space-between="24"
              :initial-slide="lightboxIndex"
              :speed="400"
              :threshold="5"
              :touch-angle="35"
              :keyboard="{ enabled: false }"
              :navigation="
                items.length > 1
                  ? {
                      prevEl: lbPrevBtn,
                      nextEl: lbNextBtn,
                      disabledClass: 'lightbox-nav--disabled',
                    }
                  : false
              "
              :dir="isRtl ? 'rtl' : 'ltr'"
              :key="'lb-' + (isRtl ? 'rtl' : 'ltr')"
              class="lightbox-viewport"
              @swiper="onLightboxSwiper"
              @slide-change="onLightboxSlideChange"
            >
              <SwiperSlide
                v-for="(item, index) in items"
                :key="'lb-' + index"
                class="lightbox-slide"
              >
                <img
                  v-if="item.type === 'image' || item.type === 'gif'"
                  :src="item.src"
                  :alt="item.alt || ''"
                  class="lightbox-media lightbox-media--image"
                  draggable="false"
                />
                <video
                  v-else-if="item.type === 'video'"
                  :ref="(el) => registerLightboxVideo(el as HTMLVideoElement | null, index)"
                  :src="item.src"
                  class="lightbox-media lightbox-media--video"
                  controls
                  playsinline
                  preload="metadata"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";
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

const emit = defineEmits<{
  (e: "lock-page-scroll"): void;
  (e: "unlock-page-scroll"): void;
}>();

const modules = [Navigation, Pagination, Autoplay];
const lightboxModules = [Navigation, Keyboard];

/* When there's more than one item, peek the next slide (~25%) so users can
   tell the media is scrollable. A single item stays full-bleed. Swiper clamps
   the end translate, so the last slide shows fully with no empty preview
   (loop is disabled). */
const hasMultiple = computed(() => props.items.length > 1);
const sliderBreakpoints = computed(() => ({
  // Mobile: smaller peek so the active slide stays comfortably readable.
  0: {
    slidesPerView: hasMultiple.value ? 1.25 : 1,
    spaceBetween: hasMultiple.value ? 2 : 0,
  },
  // Desktop: current slide + ~25% of the next slide.
  768: {
    slidesPerView: hasMultiple.value ? 1.4 : 1,
    spaceBetween: hasMultiple.value ? 2 : 0,
  },
}));

const sliderRef = ref<HTMLElement | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const nextBtn = ref<HTMLElement | null>(null);
const dotsEl = ref<HTMLElement | null>(null);
const isRtl = ref(false);

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const lbPrevBtn = ref<HTMLElement | null>(null);
const lbNextBtn = ref<HTMLElement | null>(null);
const lightboxVideos = new Map<number, HTMLVideoElement>();

let swiperInstance: SwiperClass | null = null;
let lightboxSwiper: SwiperClass | null = null;
let savedBodyOverflow = "";
let savedBodyPaddingRight = "";

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

function onSlideClick(index: number) {
  // Swiper sets `preventClicks` while a drag is in progress, so a click
  // that survived the swipe gesture is a real tap.
  openLightbox(index);
}

function openLightbox(index: number) {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
  emit("lock-page-scroll");
  if (typeof document !== "undefined") {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    savedBodyOverflow = document.body.style.overflow;
    savedBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
}

function closeLightbox() {
  if (!lightboxOpen.value) return;
  pauseAllLightboxVideos();
  lightboxOpen.value = false;
  lightboxSwiper = null;
  lightboxVideos.clear();
  if (typeof document !== "undefined") {
    document.body.style.overflow = savedBodyOverflow;
    document.body.style.paddingRight = savedBodyPaddingRight;
  }
  emit("unlock-page-scroll");
}

function onLightboxSwiper(s: SwiperClass) {
  lightboxSwiper = s;
  // Pause any video that isn't the active slide.
  nextTick(() => pauseInactiveLightboxVideos());
}

function onLightboxSlideChange() {
  if (!lightboxSwiper) return;
  lightboxIndex.value = lightboxSwiper.activeIndex;
  pauseInactiveLightboxVideos();
}

function registerLightboxVideo(el: HTMLVideoElement | null, index: number) {
  if (el) {
    lightboxVideos.set(index, el);
  } else {
    lightboxVideos.delete(index);
  }
}

function pauseInactiveLightboxVideos() {
  const active = lightboxSwiper?.activeIndex ?? lightboxIndex.value;
  lightboxVideos.forEach((video, idx) => {
    if (idx !== active && !video.paused) {
      video.pause();
    }
  });
}

function pauseAllLightboxVideos() {
  lightboxVideos.forEach((video) => {
    if (!video.paused) video.pause();
    // Detach src to release decoder on mobile
    video.removeAttribute("autoplay");
  });
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxOpen.value) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
      return;
    }
    if (!lightboxSwiper) return;
    if (e.key === "ArrowLeft") {
      isRtl.value ? lightboxSwiper.slideNext() : lightboxSwiper.slidePrev();
    } else if (e.key === "ArrowRight") {
      isRtl.value ? lightboxSwiper.slidePrev() : lightboxSwiper.slideNext();
    }
    return;
  }

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
  // Ensure body is restored if component unmounts with lightbox open.
  if (lightboxOpen.value && typeof document !== "undefined") {
    document.body.style.overflow = savedBodyOverflow;
    document.body.style.paddingRight = savedBodyPaddingRight;
  }
  lightboxSwiper = null;
  lightboxVideos.clear();
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
  cursor: zoom-in;
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

/* ── Fullscreen lightbox ── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}

.lightbox-viewport {
  width: 100%;
  height: 100%;
  touch-action: pan-y;
}

.lightbox-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 4vmin;
  box-sizing: border-box;
}

.lightbox-media {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}

.lightbox-media--image {
  pointer-events: none;
}

.lightbox-media--video {
  max-height: 92vh;
  background: #000;
}

.lightbox-btn {
  position: absolute;
  z-index: 2;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-radius: 999px; */
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: background 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
}
.lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}
.lightbox-btn:active {
  transform: scale(0.94);
}

.lightbox-close {
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
}
.lightbox-close .lightbox-icon {
  font-size: 28px;
  line-height: 1;
}
:global(html[dir="rtl"]) .lightbox-close {
  right: auto;
  left: 16px;
}

.lightbox-counter {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.lightbox-nav {
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
}
.lightbox-nav:active {
  transform: translateY(-50%) scale(0.94);
}
.lightbox-nav .lightbox-icon {
  font-size: 22px;
  line-height: 1;
}
.lightbox-nav--prev {
  left: 20px;
}
.lightbox-nav--next {
  right: 20px;
}
:global(html[dir="rtl"]) .lightbox-nav--prev {
  left: auto;
  right: 20px;
}
:global(html[dir="rtl"]) .lightbox-nav--next {
  right: auto;
  left: 20px;
}
.lightbox-nav--disabled {
  opacity: 0.25 !important;
  pointer-events: none;
}

@media (max-width: 640px) {
  .lightbox-slide {
    padding: 2vmin;
  }
  .lightbox-nav {
    width: 42px;
    height: 42px;
  }
  .lightbox-nav--prev {
    left: 8px;
  }
  .lightbox-nav--next {
    right: 8px;
  }
  :global(html[dir="rtl"]) .lightbox-nav--prev {
    left: auto;
    right: 8px;
  }
  :global(html[dir="rtl"]) .lightbox-nav--next {
    right: auto;
    left: 8px;
  }
  .lightbox-close {
    top: 10px;
    right: 10px;
  }
  :global(html[dir="rtl"]) .lightbox-close {
    right: auto;
    left: 10px;
  }
}

/* Hide nav arrows on touch-only — swipe handles it */
@media (hover: none) and (pointer: coarse) {
  .lightbox-nav {
    display: none;
  }
}

/* Transition */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.22s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
