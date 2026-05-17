<!-- HomeHero2 -->
<template>
  <div
    class="app-container relative dark bg-[var(--manjra-bg-color)] text-[var(--manjra-text-color)]"
    style="
      --color-primary: var(--manjra-text-color);
      --border-op-color: rgba(41, 43, 44, 0.7);
    "
  >
    <div
      class="hidden absolute logo-image p-4 w-full lg:flex justify-start items-center"
      style="width: calc(100% - (var(--railW) * 2))"
    >
      <NuxtLink to="#">
        <img src="/logos/departments/Manjra-Org.svg" width="100" alt="Manjra" />
      </NuxtLink>
    </div>
    <div class="top-section w-full h-full cursor-none">
      <div class="left-box z-10 after:opacity-50 before:opacity-50">
        <LeftSideContent />
      </div>

      <!-- center-box: الـ 3D perspective container -->
      <div ref="centerBoxRef" class="center-box" @wheel="onWheel">
        <!-- ══ السقف (top-part) — rotateX(-90deg) ══ -->
        <div class="top-part px-[2.5rem] lg:px-[5.5rem]">
          <div ref="ceilRef" class="sync-content">
            <PageContent
              :margin-top="3"
              :mobile-margin-top="2"
              :px="0"
              :margin-s="113"
              :image-w="73"
              :title-s="109"
              :desc-size="28.5"
              :py="6"
              :marginB="2.5"
              :pageDetails="manjraPage"
              :clampRight="true"
            />
          </div>
        </div>

        <!-- ══ الجدار (center-part) ══ -->
        <div class="center-part border-white-op50">
          <div ref="wallRef" class="sync-content">
            <PageContent
              :margin-top="0"
              :mobile-margin-top="0"
              :pageDetails="manjraPage"
            />
          </div>
          <img
            ref="previewImgRef"
            class="preview-image h-[200px] w-[200px] object-cover"
          />
        </div>

        <!-- ══ الأرض (bottom-part) — rotateX(+90deg) ══ -->
        <div class="bottom-part">
          <div ref="floorRef" class="sync-content px-[2.5rem] lg:px-[5.5rem]">
            <PageContent
              :margin-top="5"
              :mobile-margin-top="3"
              :px="0"
              :margin-s="115"
              :image-w="70"
              :title-s="109"
              :desc-size="28.5"
              :py="6"
              :marginB="2.5"
              :pageDetails="manjraPage"
              :clampRight="true"
            />
          </div>
        </div>
      </div>

      <div class="right-box z-10 after:opacity-50 before:opacity-50">
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

const { data: manjraPage } = usePage("manjra");

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
