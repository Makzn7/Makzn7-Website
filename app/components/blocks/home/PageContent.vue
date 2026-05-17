<!-- PageContent.vue -->
<!-- نفس محتوى center-part بالضبط — يُستخدم في السقف والجدار والأرض -->
<template>
  <!-- لا padding أعلى عشان المحتوى يبدأ من y=0 مباشرة
       هذا ضروري للـ sync — السقف والأرض يعرضان امتداد هذا المحتوى -->
  <div
    ref="contentRef"
    class="page-content flex flex-col gap-12"
    :style="{
      '--mt': marginTop + 'rem',
      '--mt-mobile': (props.mobileMarginTop ?? props.marginTop) + 'rem',
      '--px': px + 'rem',
      '--ppx': projectPX + 'rem',
    }"
  >
    <!-- HeroGrid -->
    <div class="relative content-item pc-hero-grid">
      <div
        class="flex flex-col lg:flex-row items-center justify-between gap-8 my-6 lg:my-12 mx-3 lg:mx-6"
      >
        <!-- dark:invert flips black logo to white in dark mode -->
        <img
          id="logo"
          v-if="showLogo"
          src="/logos/svg/logo_black.svg"
          alt="Makzn7"
          class="hero-logo dark:invert"
          :class="{ 'fade-in': withAnimations }"
        />
        <div
          class="font-light leading-[1.2] tracking-[-0.59px] rtl:tracking-normal rtl:leading-[1.8]"
          :class="[
            showLogo ? 'ms-0' : 'lg:ms-[230px]',
            withAnimations ? 'fade-in-right' : '',
          ]"
          :style="`animation-delay: 0.15s; font-size: clamp(${Math.max(
            16,
            Math.round(descSize * 0.35)
          )}px, ${(descSize / 15.36).toFixed(1)}vw, ${descSize}px);`"
          v-html="
            locale === 'ar'
              ? heroData?.description_ar
              : heroData?.description_en
          "
        ></div>
      </div>
      <div ref="modelFrameRef" class="relative image-3d-container">
        <HeroGrid1
          aspectRatio="none"
          class="hero-grid-visual"
          :cols="45"
          :rows="40"
        />
        <!-- 3D model overlay — interactive tilt on hover -->
        <div class="model-3d-wrap">
          <ClientOnly>
            <HeroModel3D
              v-if="modelPath"
              :key="modelPath"
              class="w-full h-full"
              :modelScale="effectiveModelScale"
              :modelPath="modelPath"
              :modelImageType="modelType"
              :modelModeColor="modelModeColor"
            />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Selected Projects -->
    <div class="mt-4">
      <div
        class="flex gap-2 justify-center lg:justify-start items-center border-t-[0.3px] border-b-[0.3px] border-brand-text"
      >
        <h2
          class="py-8 font-bold leading-[1.2] whitespace-nowrap pc-project-px"
          :style="`animation-delay: 0.15s; font-size: clamp(${Math.max(
            16,
            Math.round(59 * 0.35)
          )}px, ${(59 / 15.36).toFixed(1)}vw, ${59}px);`"
        >
          {{ $t("titles.selectedProjects") }}
        </h2>
      </div>

      <div class="mt-4 lg:mt-0">
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="content-item py-5 lg:py-16 transition-all duration-500 ease-in-out pc-project-px"
          :class="{ 'hover-item': showHover }"
          :data-image-url="project.hoverMedia?.src || project.heroMedia?.src"
          @mouseenter="showHover && onEnter($event)"
          @mouseleave="showHover && $emit('hover-leave')"
        >
          <h3
            class="leading-[1.05] lg:font-light lg:max-w-[80%] hover:font-bold"
            :style="`font-size: clamp(${Math.max(
              18,
              Math.round(32 * 0.5)
            )}px, ${(projectSize / 19.36).toFixed(1)}vw, ${projectSize}px)`"
          >
            {{ locale === "ar" ? project.name_ar : project.name_en }}
          </h3>
        </div>
      </div>
    </div>

    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div class="content-item ltr:h-[8rem] rtl:h-[8rem]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import HeroModel3D from "~/components/ui/HeroModel3D.vue";
import HeroGrid1 from "~/components/graphics/HeroGrid1.vue";
import type { Project } from "~/types/project";

const props = withDefaults(
  defineProps<{
    projects: Project[];
    showHover?: boolean;
    marginTop?: number;
    px?: number;
    descSize?: number;
    projectPX?: number;
    projectSize?: number;
    showLogo?: boolean;
    withAnimations?: boolean;
    modelPath?: string | null;
    modelType?: string;
    modelModeColor?: string;
    mobileMarginTop?: number;
    heroData?: {
      title_ar: string;
      title_en: string;
      description_ar: string;
      description_en: string;
    } | null;
  }>(),
  {
    showHover: false,
    marginTop: 4,
    px: 1,
    descSize: 32,
    projectPX: 4,
    projectSize: 120,
    showLogo: true,
    withAnimations: true,
    modelPath: null,
    modelType: "string",
    modelModeColor: "#ffffff",
    heroData: null,
    mobileMarginTop: 4,
  }
);

const emit = defineEmits(["hover-enter", "hover-leave"]);
const { locale } = useI18n();

const contentRef = ref<HTMLElement | null>(null);
const modelFrameRef = ref<HTMLElement | null>(null);
if (props.withAnimations) {
  useScrollAnimation(contentRef);
}

/* ── Responsive model frame + scale ── */
const modelFrame = ref({ width: 1024, height: 700 });
let modelResizeObserver: ResizeObserver | null = null;
let windowResizeHandler: (() => void) | null = null;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function updateModelFrame() {
  const frame = modelFrameRef.value;
  if (!frame) return;
  const width = frame.clientWidth;
  const height = frame.clientHeight;
  if (!width || !height) return;
  modelFrame.value = {
    width,
    height,
  };
}

onMounted(() => {
  updateModelFrame();

  if (modelFrameRef.value && "ResizeObserver" in window) {
    modelResizeObserver = new ResizeObserver(() => updateModelFrame());
    modelResizeObserver.observe(modelFrameRef.value);
  } else {
    windowResizeHandler = () => updateModelFrame();
    window.addEventListener("resize", windowResizeHandler);
  }
});

onUnmounted(() => {
  modelResizeObserver?.disconnect();
  if (windowResizeHandler) {
    window.removeEventListener("resize", windowResizeHandler);
  }
  modelResizeObserver = null;
  windowResizeHandler = null;
});

const effectiveModelScale = computed(() => {
  const { width, height } = modelFrame.value;
  const aspect = width / Math.max(height, 1);
  const widthScale = clamp(2.15 + (width - 320) * 0.00155, 2.2, 3.55);
  const aspectScale = aspect < 0.9 ? 0.92 : aspect < 1.15 ? 0.97 : 1;
  return Number((widthScale * aspectScale).toFixed(2));
});

function onEnter(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement | null;
  if (!target) return;

  const url = target.getAttribute("data-image-url");
  if (!url) return;

  emit("hover-enter", {
    url,
    x: 50,
    y: 50,
  });
}
</script>

<style scoped>
.page-content {
  margin-top: var(--mt, 4rem);
}
.pc-hero-grid {
  padding: 0 var(--px, 1rem);
}
.pc-project-px {
  padding-right: var(--ppx, 4rem);
  padding-left: var(--ppx, 4rem);
}
.image-3d-container {
  height: clamp(25rem, 52vw, 43.75rem);
  overflow: visible;
}
.hero-grid-visual {
  height: 100%;
  min-height: 100%;
}
.model-3d-wrap {
  position: absolute;
  inset: clamp(0rem, 1.4vw, 1.25rem);
}

@media (min-width: 768px) and (max-width: 1023px) {
  .image-3d-container {
    height: clamp(30rem, 66vw, 40rem);
  }
  .model-3d-wrap {
    inset: 0;
  }
}

@media (max-width: 767px) {
  .image-3d-container {
    height: clamp(22rem, 96vw, 32rem);
    margin-inline: -0.5rem;
  }
  .model-3d-wrap {
    inset: -3% -6% 1%;
  }
  .page-content {
    margin-top: var(--mt-mobile, var(--mt, 4rem));
  }
  .pc-project-px {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
</style>
