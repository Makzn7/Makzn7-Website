<template>
  <div
    class="projects-list relative lg:border-s-[0.3px] border-white-op50 border-brand-text"
    :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
  >
    <!-- Initial loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCardSkeleton
        v-for="i in skeletonCount"
        :key="`initial-${i}`"
        class="border-e-[0.3px] border-b-[0.3px] border-white/10"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!projects.length"
      class="flex items-center justify-center h-[250px]"
    >
      <span class="text-brand-text/30 text-[12px] tracking-wider uppercase">
        {{ $t("projects.empty") }}
      </span>
    </div>

    <!-- Grid -->
    <div
      v-else
      ref="listEl"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="(project, index) in projects"
        :key="project.id ?? index"
        class="project-card group cursor-pointer"
      >
        <NuxtLink :to="`/projects/${project.slug}`" class="block w-full h-full">
          <div class="relative w-full h-full overflow-hidden">
            <ProjectImage
              :src="project.heroMedia?.src"
              :alt="locale === 'ar' ? project.name_ar : project.name_en"
              :fallback-label="
                locale === 'ar' ? project.name_ar : project.name_en
              "
              class="project-card__image"
            />

            <!-- Desktop: dim overlay that fades on hover (existing behaviour) -->
            <div
              class="hidden lg:block absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
            />

            <!-- Desktop: centered hover label (existing behaviour) -->
            <div
              class="hidden lg:group-hover:flex absolute w-full h-full top-0 left-0 items-center justify-center p-4 pointer-events-none"
            >
              <span
                class="text-primary font-bold text-center tracking-[0px]"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(projectSize * 0.35)
                )}px, ${(projectSize / 20).toFixed(1)}vw, ${projectSize}px);`"
              >
                {{ locale === "ar" ? project.name_ar : project.name_en }}
              </span>
            </div>

            <!--
              Mobile: name always visible. There's no hover on touch, so the
              desktop reveal pattern leaves cards anonymous. A gradient
              caption keeps the photo dominant while making the title
              legible.
            -->
            <div
              class="project-card__caption lg:hidden absolute inset-x-0 bottom-0 pointer-events-none flex items-end px-4 pt-10 pb-4"
            >
              <span
                class="text-primary font-semibold tracking-[0.2px] leading-tight line-clamp-2"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(projectSize * 0.35)
                )}px, ${(projectSize / 20).toFixed(1)}vw, ${projectSize}px);`"
              >
                {{ locale === "ar" ? project.name_ar : project.name_en }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Bottom load-more skeletons, only while a next page is in flight. -->
      <template v-if="loadingMore">
        <ProjectCardSkeleton
          v-for="i in loadMoreSkeletonCount"
          :key="`more-${i}`"
          class="border-e-[0.3px] border-b-[0.3px] border-white/10"
        />
      </template>
    </div>

    <!--
      Inline status row — always rendered after the grid while there's
      another page to fetch. It doubles as both the IntersectionObserver
      sentinel and a visible "loading more" hint so the user has a clear
      cue that a fetch is in flight (the bottom-of-grid skeletons can be
      off-screen if the next page is requested well before the user
      reaches the very bottom).
    -->
    <div
      v-if="hasMore && !loading"
      ref="sentinelEl"
      class="projects-list__status"
      :aria-busy="loadingMore"
    >
      <Transition name="projects-list-status">
        <div
          v-if="loadingMore"
          class="projects-list__status-inner"
          role="status"
        >
          <span class="projects-list__status-dot" aria-hidden="true" />
          <span class="projects-list__status-dot" aria-hidden="true" />
          <span class="projects-list__status-dot" aria-hidden="true" />
          <span class="projects-list__status-label">
            {{ $t("projects.loadingMore", "LOADING MORE") }}
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Project } from "~/types/project";
import ProjectImage from "~/components/ui/ProjectImage.vue";
import ProjectCardSkeleton from "~/components/ui/ProjectCardSkeleton.vue";

const { locale } = useI18n();

const props = withDefaults(
  defineProps<{
    projects?: Project[];
    marginS?: number;
    py?: number;
    projectSize?: number;
    loading?: boolean;
    loadingMore?: boolean;
    hasMore?: boolean;
    isPrimary?: boolean;
  }>(),
  {
    projects: () => [],
    marginS: 140,
    py: 4,
    projectSize: 38,
    loading: false,
    loadingMore: false,
    hasMore: false,
    isPrimary: false,
  }
);

const emit = defineEmits<{
  "load-more": [];
}>();

const listEl = ref<HTMLElement | null>(null);
const sentinelEl = ref<HTMLElement | null>(null);

const skeletonCount = 6;
const loadMoreSkeletonCount = computed(() => {
  // Match a typical "next page" footprint visually — 3 across on desktop.
  const remaining = 6;
  return remaining;
});

// ── Infinite-loading trigger ──────────────────────────────────
// The hero scrolls its own content via CSS transforms rather than
// native scrolling, and IntersectionObserver doesn't reliably react
// to transform changes on ancestors. So we poll the sentinel's
// viewport rect on a RAF loop — cheap, deterministic, and the only
// thing that consistently fires in this 3D-transform hero. Only the
// primary list (the visible "wall") owns the loop; the parent guards
// against duplicate / concurrent requests.
const TRIGGER_AHEAD_PX = 4000;
let rafId: number | null = null;
let lastTriggerAt = 0;
const TRIGGER_COOLDOWN_MS = 250;

function checkSentinel() {
  rafId = null;
  if (!props.isPrimary || !props.hasMore) return;
  const el = sentinelEl.value;
  if (!el) {
    scheduleCheck();
    return;
  }
  if (props.loading || props.loadingMore) {
    scheduleCheck();
    return;
  }
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  // Fire well before the sentinel actually enters the viewport so the
  // next page is already on the wire while the user is still scrolling.
  const triggerLine = vh + TRIGGER_AHEAD_PX;
  if (rect.top < triggerLine && rect.bottom > -TRIGGER_AHEAD_PX) {
    const now = performance.now();
    if (now - lastTriggerAt > TRIGGER_COOLDOWN_MS) {
      lastTriggerAt = now;
      emit("load-more");
    }
  }
  scheduleCheck();
}

function scheduleCheck() {
  if (!props.isPrimary || !props.hasMore) return;
  if (rafId !== null) return;
  rafId = requestAnimationFrame(checkSentinel);
}

function stopCheck() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

onMounted(() => {
  scheduleCheck();
});

watch(
  [() => props.hasMore, () => props.isPrimary],
  () => {
    if (props.isPrimary && props.hasMore) {
      scheduleCheck();
    }
  }
);

onBeforeUnmount(() => {
  stopCheck();
});
</script>

<style scoped>
.project-card {
  height: 250px;
}

.project-card__caption {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.55) 55%,
    rgba(0, 0, 0, 0) 100%
  );
}

/* Cards on mobile aren't grayscaled — keeps the title readable and the
   imagery vibrant on a small screen where there's no hover to reveal it. */
@media (max-width: 1023px) {
  .project-card :deep(img) {
    filter: none !important;
  }
}

/* Preserve existing hover grayscale behaviour on the image element. */
.project-card :deep(.project-image__img) {
  filter: grayscale(1);
  transition: opacity 600ms ease, filter 500ms ease;
}
.project-card:hover :deep(.project-image__img) {
  filter: grayscale(0);
}

.projects-list__status {
  position: relative;
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.projects-list__status-inner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border: 0.3px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.projects-list__status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--main-color, #54ea62);
  opacity: 0.35;
  animation: projects-list-status-dot 1.2s ease-in-out infinite;
}
.projects-list__status-dot:nth-child(2) {
  animation-delay: 0.18s;
}
.projects-list__status-dot:nth-child(3) {
  animation-delay: 0.36s;
}

.projects-list__status-label {
  margin-inline-start: 4px;
}

@keyframes projects-list-status-dot {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

.projects-list-status-enter-active,
.projects-list-status-leave-active {
  transition: opacity 240ms ease, transform 240ms ease;
}
.projects-list-status-enter-from,
.projects-list-status-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .projects-list__status-dot {
    animation: none;
  }
}

@media (max-width: 1024px) {
  .projects-list {
    margin-inline-start: 0 !important;
    width: 100% !important;
  }
  .project-card {
    height: 220px;
  }
}
</style>
