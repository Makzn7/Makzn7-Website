<template>
  <div class="app-container relative dark bg-brand-bg">
    <div class="absolute logo-image p-4">
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
      <div class="left-box z-10 after:opacity-50 before:opacity-50">
        <LeftSideContent />
      </div>

      <!-- center-box: الـ 3D perspective container -->
      <div ref="centerBoxRef" class="center-box" @wheel="onWheel">
        <!-- ══ السقف (top-part) — rotateX(-90deg) ══ -->
        <div class="top-part px-[5.5rem]">
          <div ref="ceilRef" class="sync-content">
            <DetailsPageContent :margin-top="3" :project="project" />
          </div>
        </div>

        <!-- ══ الجدار (center-part) ══ -->
        <div class="center-part border-white-op50">
          <div ref="wallRef" class="sync-content">
            <DetailsPageContent :margin-top="0" :project="project" />
          </div>
          <img
            ref="previewImgRef"
            class="preview-image h-[200px] w-[200px] object-cover"
          />
        </div>

        <!-- ══ الأرض (bottom-part) — rotateX(+90deg) ══ -->
        <div class="bottom-part">
          <div ref="floorRef" class="sync-content px-[5.5rem]">
            <DetailsPageContent :margin-top="5" :project="project" />
          </div>
        </div>
      </div>

      <div class="right-box z-10 before:opacity-50 after:opacity-50">
        <RightSideContent />
      </div>
    </div>
  </div>
  <CustomCursor />
</template>

<script setup lang="ts">
import { ref } from "vue";
import LeftSideContent from "~/components/ui/LeftSideContent.vue";
import RightSideContent from "~/components/ui/RightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import DetailsPageContent from "./DetailsPageContent.vue";
import type { Project } from "~/types/project";

const props = defineProps({
  project: {
    type: Object as () => Project | null,
    default: () => null,
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
</script>