import { onMounted, onUnmounted, nextTick, type Ref } from "vue";

interface HeroScrollRefs {
  centerBoxRef: Ref<HTMLElement | null>;
  wallRef: Ref<HTMLElement | null>;
  floorRef: Ref<HTMLElement | null>;
  ceilRef: Ref<HTMLElement | null>;
}

interface HeroScrollOptions {
  lerpFactor?: number;
  keyStep?: number;
}

export function useHeroScroll(
  refs: HeroScrollRefs,
  emit: (event: "lock-page-scroll" | "unlock-page-scroll") => void,
  options: HeroScrollOptions = {}
) {
  const { lerpFactor = 0.1, keyStep = 60 } = options;

  let scrollPos = 0;
  let targetScroll = 0;
  let maxScroll = 0;
  let railH = 0;
  let rafId: number | null = null;
  let pageScrollLocked = false;
  let ty = 0;
  let resizeObserver: ResizeObserver | null = null;
  const observedImages = new Set<HTMLImageElement>();

  function measureScrollLimits() {
    const box = refs.centerBoxRef.value;
    if (!box) return;

    railH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--railH")
      ) || 60;

    const wallH = Math.max(0, box.offsetHeight - 2 * railH);
    const contentH = refs.wallRef.value?.scrollHeight || 0;
    maxScroll = Math.max(0, contentH - wallH);

    targetScroll = Math.min(targetScroll, maxScroll);
    scrollPos = Math.min(scrollPos, maxScroll);
  }

  function onImageLoad() {
    measureScrollLimits();
  }

  function syncImageListeners() {
    const wall = refs.wallRef.value;
    if (!wall) return;

    const currentImages = new Set(
      Array.from(wall.querySelectorAll("img")) as HTMLImageElement[]
    );

    observedImages.forEach((img) => {
      if (currentImages.has(img)) return;
      img.removeEventListener("load", onImageLoad);
      img.removeEventListener("error", onImageLoad);
      observedImages.delete(img);
    });

    currentImages.forEach((img) => {
      if (observedImages.has(img)) return;
      observedImages.add(img);
      img.addEventListener("load", onImageLoad);
      img.addEventListener("error", onImageLoad);
    });
  }

  function syncPageScrollLock(shouldLock: boolean) {
    if (pageScrollLocked === shouldLock) return;
    pageScrollLocked = shouldLock;
    emit(shouldLock ? "lock-page-scroll" : "unlock-page-scroll");
  }

  function onWheel(e: WheelEvent) {
    if (window.scrollY > 1) {
      syncPageScrollLock(false);
      return;
    }

    const nextTarget = targetScroll + e.deltaY;
    const clampedTarget = Math.max(0, Math.min(maxScroll, nextTarget));
    const canConsumeInsideHero = clampedTarget !== targetScroll;

    if (canConsumeInsideHero) {
      e.preventDefault();
      e.stopPropagation();
      targetScroll = clampedTarget;
      syncPageScrollLock(true);
      return;
    }

    syncPageScrollLock(false);
  }

  function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    if (touch) ty = touch.clientY;
  }

  function onTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;

    if (window.scrollY > 1) {
      syncPageScrollLock(false);
      ty = touch.clientY;
      return;
    }

    const nextTarget = targetScroll + (ty - touch.clientY);
    const clampedTarget = Math.max(0, Math.min(maxScroll, nextTarget));
    const canConsumeInsideHero = clampedTarget !== targetScroll;

    if (canConsumeInsideHero) {
      e.preventDefault();
      e.stopPropagation();
      targetScroll = clampedTarget;
      syncPageScrollLock(true);
    } else {
      syncPageScrollLock(false);
    }

    ty = touch.clientY;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown")
      targetScroll = Math.min(maxScroll, targetScroll + keyStep);
    if (e.key === "ArrowUp")
      targetScroll = Math.max(0, targetScroll - keyStep);
  }

  function loop() {
    scrollPos += (targetScroll - scrollPos) * lerpFactor;

    const box = refs.centerBoxRef.value;
    const wallH = box ? box.offsetHeight - 2 * railH : 0;

    if (refs.wallRef.value)
      refs.wallRef.value.style.transform = `translateY(${-scrollPos}px)`;

    if (refs.floorRef.value)
      refs.floorRef.value.style.transform = `translateY(${-(scrollPos + wallH)}px)`;

    if (refs.ceilRef.value)
      refs.ceilRef.value.style.transform = `translateY(${-(scrollPos - railH)}px)`;

    rafId = requestAnimationFrame(loop);
  }

  onMounted(() => {
    const box = refs.centerBoxRef.value;
    const wall = refs.wallRef.value;
    if (!box || !wall) return;

    box.addEventListener("touchstart", onTouchStart, { passive: true });
    box.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", measureScrollLimits);

    resizeObserver = new ResizeObserver(() => {
      measureScrollLimits();
      syncImageListeners();
    });
    resizeObserver.observe(box);
    resizeObserver.observe(wall);

    syncImageListeners();
    nextTick(() => {
      measureScrollLimits();
      requestAnimationFrame(() => {
        measureScrollLimits();
      });
    });

    loop();
  });

  onUnmounted(() => {
    const box = refs.centerBoxRef.value;
    box?.removeEventListener("touchstart", onTouchStart);
    box?.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", measureScrollLimits);
    resizeObserver?.disconnect();
    observedImages.forEach((img) => {
      img.removeEventListener("load", onImageLoad);
      img.removeEventListener("error", onImageLoad);
    });
    observedImages.clear();
    if (rafId) cancelAnimationFrame(rafId);
    syncPageScrollLock(false);
  });

  return { onWheel };
}
