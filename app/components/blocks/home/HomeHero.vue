<!-- HomeHero2 -->
<template>
  <div class="app-container bg-brand-bg">
    <div class="top-section w-full h-full cursor-none">
      <div class="left-box z-10">
        <LeftSideContent />
      </div>

      <!-- center-box: الـ 3D perspective container -->
      <div ref="centerBoxRef" class="center-box" @wheel="onWheel">
        <!-- ══ السقف (top-part) — rotateX(-90deg) ══ -->
        <div class="top-part px-[5.5rem]">
          <div ref="ceilRef" class="sync-content">
            <PageContent
              :projects="featuredProjects"
              :margin-top="4"
              :px="0"
              :projectPX="2"
              :projectSize="124"
              :showLogo="false"
              :modelPath="modelPath"
              :modelType="modelType"
              :modelModeColor="modelModeColor"
            />
          </div>
        </div>

        <!-- ══ الجدار (center-part) ══ -->
        <div class="center-part">
          <div ref="wallRef" class="sync-content">
            <PageContent
              :projects="featuredProjects"
              :show-hover="true"
              @hover-enter="onHoverEnter"
              @hover-leave="onHoverLeave"
              :margin-top="1"
              :px="1.5"
              :modelPath="modelPath"
              :modelType="modelType"
              :modelModeColor="modelModeColor"
            />
          </div>
          <img
            ref="previewImgRef"
            class="preview-image h-[400px] w-[400px] object-fill"
          />
        </div>

        <!-- ══ الأرض (bottom-part) — rotateX(+90deg) ══ -->
        <div class="bottom-part">
          <div ref="floorRef" class="sync-content px-[5.5rem]">
            <PageContent
              :projects="featuredProjects"
              :margin-top="6"
              :px="0"
              :projectPX="2"
              :projectSize="124"
              :modelPath="modelPath"
              :modelType="modelType"
              :modelModeColor="modelModeColor"
            />
          </div>
        </div>
      </div>

      <div class="right-box z-10">
        <RightSideContent />
      </div>
    </div>
  </div>
  <CustomCursor />
</template>

<script setup>
import { ref } from "vue";
import LeftSideContent from "~/components/blocks/home/HomeHeroLeftSideContent.vue";
import RightSideContent from "~/components/blocks/home/HomeHeroRightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import { featuredProjects } from "~/mocks/projects";
import { homeSettings } from "~/mocks/homeSettings";
import PageContent from "./PageContent.vue";

const emit = defineEmits(["lock-page-scroll", "unlock-page-scroll"]);
const { locale } = useI18n();
const colorMode = useColorMode();

/* ── refs ── */
const centerBoxRef = ref(null);
const wallRef = ref(null);
const floorRef = ref(null);
const ceilRef = ref(null);
const previewImgRef = ref(null);

const modelPath = computed(() => {
  if (locale.value === "ar") {
    if (colorMode.value === "dark") return homeSettings.hero_3d.image_dark_ar;
    return homeSettings.hero_3d.image_ar;
  }
  if (colorMode.value === "dark") return homeSettings.hero_3d.image_dark_en;
  return homeSettings.hero_3d.image_en;
});
const modelType = computed(() => {
  return homeSettings.hero_3d.type;
});
const modelModeColor = computed(() => {
  if (colorMode.value === "dark")
    return homeSettings.hero_3d.mode_color_dark || "#ffffff";
  return homeSettings.hero_3d.mode_color || "#000000";
});

/* ── hero scroll (extracted to composable) ── */
const { onWheel } = useHeroScroll(
  { centerBoxRef, wallRef, floorRef, ceilRef },
  emit
);

/* ── hover preview ── */
function onHoverEnter({ url, x, y }) {
  const img = previewImgRef.value;
  if (!img || !url) return;

  img.style.transition = "none";
  img.style.transform = "translateX(32px)";
  void img.offsetWidth;
  img.style.transition = "";

  if (locale.value === "ar") img.style.left = `${x}px`;
  else img.style.right = `${x}px`;
  img.style.bottom = `${y}px`;
  img.src = url;
  img.style.opacity = "1";
  img.style.transform = "translateX(0)";
}
function onHoverLeave() {
  const img = previewImgRef.value;
  if (!img) return;
  img.style.opacity = "0";
  setTimeout(() => {
    if (img.style.opacity === "0") img.src = "";
  }, 500);
}
</script>

<style>
/* HomeHero-specific: slide-in transition for preview */
.preview-image {
  transform: translateX(32px);
  transition: opacity 0.5s ease-in-out,
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
