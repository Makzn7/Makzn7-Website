<!-- HomeHero2 -->
<template>
  <div class="app-container relative dark bg-brand-bg">
    <div class="absolute logo-image p-4 rtl:right-[var(--railW)]">
      <NuxtLink to="/">
        <img
          src="/logos/svg/logo_black.svg"
          width="100"
          alt="Makzn7"
          class="dark:invert"
        />
      </NuxtLink>
    </div>
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
              :margin-top="3"
              :px="0"
              :margin-s="113"
              :image-w="73"
              :title-s="109"
              :desc-size="28.5"
              :teams="teams"
              :awards="awards"
              :py="6"
              :marginB="2.5"
            />
          </div>
        </div>

        <!-- ══ الجدار (center-part) ══ -->
        <div class="center-part">
          <div ref="wallRef" class="sync-content">
            <PageContent :margin-top="0" :teams="teams" :awards="awards" />
          </div>
          <img
            ref="previewImgRef"
            class="preview-image h-[200px] w-[200px] object-cover"
          />
        </div>

        <!-- ══ الأرض (bottom-part) — rotateX(+90deg) ══ -->
        <div class="bottom-part">
          <div ref="floorRef" class="sync-content px-[5.5rem]">
            <PageContent
              :margin-top="5"
              :px="0"
              :margin-s="115"
              :image-w="70"
              :title-s="109"
              :desc-size="28.5"
              :teams="teams"
              :awards="awards"
              :py="6"
              :marginB="2.5"
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
import LeftSideContent from "~/components/ui/LeftSideContent.vue";
import RightSideContent from "~/components/ui/RightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import PageContent from "./PageContent.vue";

const props = defineProps({
  teams: {
    type: Array,
    default: () => [],
  },
  awards: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["lock-page-scroll", "unlock-page-scroll"]);

/* ── refs ── */
const centerBoxRef = ref(null);
const wallRef = ref(null);
const floorRef = ref(null);
const ceilRef = ref(null);
const previewImgRef = ref(null);

/* ── hero scroll (extracted to composable) ── */
const { onWheel } = useHeroScroll(
  { centerBoxRef, wallRef, floorRef, ceilRef },
  emit
);

/* ── hover preview ── */
function onHoverEnter({ url, x, y }) {
  const img = previewImgRef.value;
  if (!img || !url) return;
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.src = url;
  img.style.opacity = "1";
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
/* AboutHero uses base hero-scene.css styles — no overrides needed */
</style>
