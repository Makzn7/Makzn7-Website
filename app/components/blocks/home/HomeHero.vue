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
        <div class="top-part px-[2.5rem] lg:px-[4.5rem]">
          <div ref="ceilRef" class="sync-content">
            <PageContent
              :projects="featuredProjects"
              :with-animations="false"
              :margin-top="4"
              :mobile-margin-top="7"
              :px="0"
              :projectPX="3"
              :projectSize="124"
              :showLogo="false"
              :modelPath="modelPath"
              :modelType="modelType"
              :modelModeColor="modelModeColor"
              :heroData="heroData"
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
              :mobile-margin-top="0.25"
              :px="0.5"
              :modelPath="modelPath"
              :modelType="modelType"
              :modelModeColor="modelModeColor"
              :heroData="heroData"
            />
          </div>
          <img
            ref="previewImgRef"
            class="preview-image h-[400px] w-[400px] object-fill"
          />
        </div>

        <!-- ══ الأرض (bottom-part) — rotateX(+90deg) ══ -->
        <div class="bottom-part">
          <div ref="floorRef" class="sync-content px-[2.5rem] lg:px-[4.5rem]">
            <PageContent
              :projects="featuredProjects"
              :with-animations="false"
              :margin-top="6"
              :mobile-margin-top="3.5"
              :px="0"
              :projectPX="3"
              :projectSize="124"
              :modelPath="modelPath"
              :modelType="modelType"
              :modelModeColor="modelModeColor"
              :heroData="heroData"
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

<script setup lang="ts">
import { ref } from "vue";
import LeftSideContent from "~/components/blocks/home/HomeHeroLeftSideContent.vue";
import RightSideContent from "~/components/blocks/home/HomeHeroRightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import PageContent from "./PageContent.vue";
import type { HomeResponse } from "~/types/homeResponse";

const props = defineProps<{
  homeData: HomeResponse | undefined | null;
}>();

const emit = defineEmits(["lock-page-scroll", "unlock-page-scroll"]);
const { locale } = useI18n();
const colorMode = useColorMode();

const featuredProjects = computed(() => props.homeData?.projects ?? []);
const hero3d = computed(() => props.homeData?.data?.hero_3d ?? null);
const heroData = computed(() => props.homeData?.data?.hero ?? null);

/* ── refs ── */
const centerBoxRef = ref(null);
const wallRef = ref(null);
const floorRef = ref(null);
const ceilRef = ref(null);
const previewImgRef = ref(null);

const modelPath = computed(() => {
  const h = hero3d.value;
  if (!h) return null;
  if (locale.value === "ar") {
    return colorMode.value === "dark" ? h.image_dark_ar : h.image_ar;
  }
  return colorMode.value === "dark" ? h.image_dark_en : h.image_en;
});
const modelType = computed(() => hero3d.value?.type ?? "image");
const modelModeColor = computed(() => {
  const h = hero3d.value;
  if (colorMode.value === "dark") return h?.mode_color_dark ?? "#ffffff";
  return h?.mode_color ?? "#000000";
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
