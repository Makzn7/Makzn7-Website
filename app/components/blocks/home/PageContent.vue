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
          class="hero-logo dark:invert fade-in"
        />
        <div
          :class="`font-light leading-[1.2] tracking-[-0.59px] rtl:tracking-normal rtl:leading-[1.8] fade-in-right ${
            showLogo ? 'ms-0' : 'lg:ms-[230px]'
          }`"
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
      <div class="relative image-3d-container">
        <HeroGrid1
          aspectRatio="none"
          class="h-[400px] lg:h-[700px]"
          :cols="45"
          :rows="40"
        />
        <!-- 3D model overlay — interactive tilt on hover -->
        <div
          class="absolute top-[5%] start-[5%] w-[90%] h-[90%] lg:top-0 lg:start-0 lg:w-full lg:h-full model-3d-wrap"
        >
          <ClientOnly>
            <HeroModel3D
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
import HeroGrid from "~/components/graphics/HeroGrid.vue";
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

const contentRef = ref(null);
useScrollAnimation(contentRef);

/* ── Mobile detection for responsive model scale ── */
const isMobile = ref(false);
function checkMobile() {
  isMobile.value = window.innerWidth < 768;
}
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
const effectiveModelScale = computed(() => (isMobile.value ? 2.0 : 3.5));

function onEnter(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement | null;
  if (!target) return;

  const url = target.getAttribute("data-image-url");
  if (!url) return;

  const parent = target.closest(".center-part");
  if (!parent) return;

  const pr = parent.getBoundingClientRect();
  // emit("hover-enter", {
  //   url,
  //   x: Math.max(0, Math.random() * (pr.width - 100)),
  //   y: Math.max(0, Math.random() * (pr.height - 100)),
  // });
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

@media (max-width: 767px) {
  .page-content {
    margin-top: var(--mt-mobile, var(--mt, 4rem));
  }
  .pc-project-px {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
</style>
