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
      '--px': px + 'rem',
      '--ppx': projectPX + 'rem',
    }"
  >
    <!-- HeroGrid -->
    <div class="relative content-item pc-hero-grid">
      <div class="flex items-center justify-between gap-8 my-12 mx-6">
        <!-- dark:invert flips black logo to white in dark mode -->
        <img
          id="logo"
          v-if="showLogo"
          src="/logos/svg/logo_black.svg"
          alt="Makzn7"
          width="200"
          class="dark:invert fade-in"
        />
        <p
          :class="`font-light leading-[1.2] tracking-[-0.59px] rtl:tracking-normal rtl:leading-[1.8] fade-in-right ${
            showLogo ? 'ms-0' : 'ms-[230px]'
          }`"
          :style="`animation-delay: 0.15s; font-size: clamp(${Math.max(
            16,
            Math.round(descSize * 0.35)
          )}px, ${(descSize / 15.36).toFixed(1)}vw, ${descSize}px);`"
        >
          {{
            locale === "ar"
              ? heroData?.description_ar
              : heroData?.description_en
          }}
        </p>
      </div>
      <div class="relative image-3d-container">
        <HeroGrid1 aspectRatio="none" class="h-[700px]" :cols="45" :rows="40" />
        <!-- 3D model overlay — interactive tilt on hover -->
        <div class="absolute top-0 start-0 w-full h-full 3d-content">
          <ClientOnly>
            <HeroModel3D
              class="w-full h-full"
              :modelScale="3.5"
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
        class="flex gap-2 justify-start items-center border-t-[0.3px] border-b-[0.3px] border-brand-text"
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

      <div>
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="content-item py-16 transition-all duration-500 ease-in-out pc-project-px"
          :class="{ 'hover-item': showHover }"
          :data-image-url="project.hoverMedia?.src || project.heroMedia?.src"
          @mouseenter="showHover && onEnter($event)"
          @mouseleave="showHover && $emit('hover-leave')"
        >
          <h3
            class="leading-[1.05] font-light lg:max-w-[80%] hover:font-bold"
            :style="`font-size: clamp(${Math.max(
              36,
              Math.round(projectSize * 0.5)
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
import { ref } from "vue";
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
    modelPath?: string;
    modelType?: string;
    modelModeColor?: string;
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
    modelPath: "/images/3d/Eng",
    modelType: "string",
    modelModeColor: "#ffffff",
    heroData: null,
  }
);

const emit = defineEmits(["hover-enter", "hover-leave"]);
const { locale } = useI18n();

const contentRef = ref(null);
useScrollAnimation(contentRef);

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
</style>
