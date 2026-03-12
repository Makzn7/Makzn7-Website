<!-- HomeHero2 -->
<template>
  <div class="app-container relative dark bg-brand-bg">
    <div class="absolute logo-image p-4">
      <img
        src="/logos/svg/logo_black.svg"
        width="100"
        alt=""
        class="dark:invert"
      />
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
              :projects="featuredProjects"
              :margin-top="3"
              :px="0"
              :margin-s="113"
              :image-w="73"
              :title-s="129"
              :desc-size="35.5"
            />
          </div>
        </div>

        <!-- ══ الجدار (center-part) ══ -->
        <div class="center-part">
          <div ref="wallRef" class="sync-content">
            <PageContent :margin-top="0" />
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
              :margin-s="113"
              :image-w="70"
              :title-s="129"
              :desc-size="35.5"
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
import { ref, onMounted, onUnmounted } from "vue";
import LeftSideContent from "~/components/blocks/home/HomeHeroLeftSideContent.vue";
import RightSideContent from "~/components/blocks/home/HomeHeroRightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import { projects, featuredProjects } from "~/mocks/projects";
import PageContent from "./PageContent.vue";
const emit = defineEmits(["lock-page-scroll", "unlock-page-scroll"]);

/* ── refs ── */
const centerBoxRef = ref(null);
const wallRef = ref(null);
const floorRef = ref(null);
const ceilRef = ref(null);
const previewImgRef = ref(null);

/* ── scroll state ── */
let scrollPos = 0;
let targetScroll = 0;
let maxScroll = 0;
let railH = 0;
let rafId = null;
let pageScrollLocked = false;

function syncPageScrollLock(shouldLock) {
  if (pageScrollLocked === shouldLock) return;
  pageScrollLocked = shouldLock;
  emit(shouldLock ? "lock-page-scroll" : "unlock-page-scroll");
}

/* ── wheel ── */
function onWheel(e) {
  // If the page has scrolled (content-section is overlapping the hero),
  // don't consume — let the page scroll handle returning to top.
  if (window.scrollY > 1) {
    syncPageScrollLock(false);
    return;
  }

  const nextTarget = targetScroll + e.deltaY;
  const clampedTarget = Math.max(0, Math.min(maxScroll, nextTarget));
  const canConsumeInsideHero = clampedTarget !== targetScroll;

  if (canConsumeInsideHero) {
    // Keep scroll inside hero and block page-level locomotive scroll.
    e.preventDefault();
    e.stopPropagation();
    targetScroll = clampedTarget;
    syncPageScrollLock(true);
    return;
  }

  // At hero boundaries, let the outer page consume the wheel event.
  syncPageScrollLock(false);
}

/* ── touch ── */
let ty = 0;
function onTouchStart(e) {
  ty = e.touches[0].clientY;
}
function onTouchMove(e) {
  // If the page has scrolled, let it handle returning to top.
  if (window.scrollY > 1) {
    syncPageScrollLock(false);
    ty = e.touches[0].clientY;
    return;
  }

  const nextTarget = targetScroll + (ty - e.touches[0].clientY);
  const clampedTarget = Math.max(0, Math.min(maxScroll, nextTarget));
  const canConsumeInsideHero = clampedTarget !== targetScroll;

  if (canConsumeInsideHero) {
    // Same behavior for touch: consume in hero until boundaries.
    e.preventDefault();
    e.stopPropagation();
    targetScroll = clampedTarget;
    syncPageScrollLock(true);
  } else {
    syncPageScrollLock(false);
  }

  ty = e.touches[0].clientY;
}

/* ── keyboard ── */
function onKey(e) {
  if (e.key === "ArrowDown")
    targetScroll = Math.min(maxScroll, targetScroll + 60);
  if (e.key === "ArrowUp") targetScroll = Math.max(0, targetScroll - 60);
}

/* ══════════════════════════════════════════════
   LOOP — المزامنة الحقيقية

   wall  translateY = -scrollPos
   floor translateY = -(scrollPos + wallH)
   ceil  translateY = -(scrollPos - railH)
══════════════════════════════════════════════ */
function loop() {
  scrollPos += (targetScroll - scrollPos) * 0.1;

  const box = centerBoxRef.value;
  const wallH = box ? box.offsetHeight - 2 * railH : 0;

  if (wallRef.value)
    wallRef.value.style.transform = `translateY(${-scrollPos}px)`;

  if (floorRef.value)
    floorRef.value.style.transform = `translateY(${-(scrollPos + wallH)}px)`;

  if (ceilRef.value)
    ceilRef.value.style.transform = `translateY(${-(scrollPos - railH)}px)`;

  rafId = requestAnimationFrame(loop);
}

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

/* ── lifecycle ── */
onMounted(() => {
  const box = centerBoxRef.value;
  if (!box) return;

  railH =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--railH")
    ) || 60;

  const wallH = box.offsetHeight - 2 * railH;

  // maxScroll = طول المحتوى الكلي - ارتفاع الجدار
  const contentH = wallRef.value?.scrollHeight || 0;
  maxScroll = Math.max(0, contentH - wallH);

  box.addEventListener("touchstart", onTouchStart, { passive: true });
  box.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKey);

  // scrollPos = railH;
  // targetScroll = railH;

  loop();
});

onUnmounted(() => {
  const box = centerBoxRef.value;
  box?.removeEventListener("touchstart", onTouchStart);
  box?.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("keydown", onKey);
  if (rafId) cancelAnimationFrame(rafId);
  syncPageScrollLock(false);
});
</script>

<style>
/* body background is handled globally in app.vue */

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.top-section {
  display: flex;
}

.logo-image {
  top: calc(var(--railH) + 8px);
  left: var(--railW);
}

/* ── Left / Right rails ── */
.left-box {
  width: var(--railW);
  position: absolute;
  bottom: 0;
  top: 0;
}

html[dir="rtl"] .left-box {
  left: 0;
  right: auto;
}
.left-box::before {
  content: "";
  position: absolute;
  top: calc(var(--railH) - 2px);
  left: var(--railW);
  height: 0.3px;
  width: 114px;
  background-color: var(--color-primary);
  transform-origin: left bottom;
  transform: rotate(-145deg);
}
.left-box::after {
  content: "";
  position: absolute;
  bottom: calc(var(--railH) - 2px);
  left: var(--railW);
  height: 0.3px;
  width: 114px;
  background-color: var(--color-primary);
  transform-origin: left top;
  transform: rotate(145deg);
}
.right-box {
  width: var(--railW);
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
}
.right-box::before {
  content: "";
  position: absolute;
  top: calc(var(--railH) - 2px);
  right: var(--railW);
  height: 0.3px;
  width: 114px;
  background-color: var(--color-primary);
  transform-origin: right bottom;
  transform: rotate(145deg);
}
.right-box::after {
  content: "";
  position: absolute;
  bottom: calc(var(--railH) - 2px);
  right: var(--railW);
  height: 0.3px;
  width: 114px;
  background-color: var(--color-primary);
  transform-origin: right top;
  transform: rotate(-145deg);
}

/* ══════════════════════════════════════════════
   CENTER-BOX — 3D scene container
══════════════════════════════════════════════ */
.center-box {
  /* width: calc(100% - 2 * var(--railW)); */
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  perspective: 380px;
  perspective-origin: 50% 50%;
}

/* ══════════════════════════════════════════════
   TOP-PART = السقف
   rotateX(-90deg), محور الدوران: bottom (خط الجدار-السقف)
══════════════════════════════════════════════ */
.center-box .top-part {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--railH);
  overflow: hidden;
  transform-origin: bottom center;
  transform: rotateX(-90deg);
  /* border-bottom: 1px solid #000; */
  z-index: 1;
}

/* ══════════════════════════════════════════════
   CENTER-PART = الجدار
   المنطقة بين railH و (100%-railH)
══════════════════════════════════════════════ */
.center-box .center-part {
  position: absolute;
  top: var(--railH);
  bottom: var(--railH);
  left: 0;
  right: 0;
  overflow: hidden;
  border: 0.3px solid var(--color-primary);
  z-index: 1;
  width: calc(100% - 2 * var(--railW));
  transform: translate(var(--railW), 0);
}

html[dir="rtl"] .center-box .center-part {
  left: 0;
  right: auto;
}
/* .center-box .center-part::before {
  position: absolute;
  top: var(--railH);
  width: calc(100% - 2 * var(--railW));
  height: 0.3px;
  background: #000;
  content: "";
} */

/* ══════════════════════════════════════════════
   BOTTOM-PART = الأرض
   rotateX(+90deg), محور الدوران: top (خط الأرض-الجدار)
══════════════════════════════════════════════ */
.center-box .bottom-part {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--railH);
  overflow: hidden;
  transform-origin: top center;
  transform: rotateX(90deg);
  /* border-top: 1px solid #000; */
  z-index: 1;
}

/* ── sync-content ── */
.sync-content {
  width: 100%;
  will-change: transform;
}

/* ── preview image ── */
.preview-image {
  position: absolute;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  z-index: 2;
}
.preview-image[src] {
  opacity: 1;
}
</style>
