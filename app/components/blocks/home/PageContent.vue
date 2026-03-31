<!-- PageContent.vue -->
<!-- نفس محتوى center-part بالضبط — يُستخدم في السقف والجدار والأرض -->
<template>
  <!-- لا padding أعلى عشان المحتوى يبدأ من y=0 مباشرة
       هذا ضروري للـ sync — السقف والأرض يعرضان امتداد هذا المحتوى -->
  <div
    ref="contentRef"
    class="page-content flex flex-col gap-12"
    :style="`margin-top: ${marginTop}rem;`"
  >
    <!-- HeroGrid -->
    <div class="relative content-item" :style="`padding: 0 ${px}rem`">
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
          {{ $t("home.heroDescription") }}
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
          class="py-8 font-semibold italic text-[20px] sm:text-[28px] md:text-[34px] lg:text-[38px] xl:text-[41px] 2xl:text-[44px] leading-[1.2] uppercase whitespace-nowrap"
          :style="`padding-right: ${projectPX}rem; padding-left: ${projectPX}rem;`"
        >
          {{ $t("titles.selectedProjects") }}
        </h2>
      </div>

      <div>
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="content-item py-16 hover:underline transition-all duration-500 ease-in-out"
          :style="`padding-right: ${projectPX}rem; padding-left: ${projectPX}rem;`"
          :class="{ 'hover-item': showHover }"
          :data-image-url="project.hoverMedia?.src || project.heroMedia?.src"
          @mouseenter="showHover && onEnter($event)"
          @mouseleave="showHover && $emit('hover-leave')"
        >
          <h3
            class="leading-[1.05] italic font-light"
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

<script setup>
import { ref } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import HeroGrid from "~/components/graphics/HeroGrid.vue";
import HeroModel3D from "~/components/ui/HeroModel3D.vue";
import HeroGrid1 from "~/components/graphics/HeroGrid1.vue";

const props = defineProps({
  projects: { type: Array, required: true },
  showHover: { type: Boolean, default: false },
  marginTop: { type: Number, default: 4 },
  px: { type: Number, default: 1 },
  descSize: { type: Number, default: 37 },
  projectPX: { type: Number, default: 4 },
  projectSize: { type: Number, default: 123 },
  showLogo: { type: Boolean, default: true },
  withAnimations: { type: Boolean, default: true },
  modelPath: { type: String, default: "/images/3d/Eng" },
  modelType: { type: String, default: "string" },
  modelModeColor: { type: String, default: "#ffffff" },
});

const emit = defineEmits(["hover-enter", "hover-leave"]);
const { locale } = useI18n();

const contentRef = ref(null);
useScrollAnimation(contentRef);

function onEnter(e) {
  const url = e.currentTarget.getAttribute("data-image-url");

  if (!url) return;

  const parent = e.currentTarget.closest(".center-part");
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
