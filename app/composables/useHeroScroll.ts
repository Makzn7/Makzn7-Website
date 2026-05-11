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
  let wallH = 0;
  let rafId: number | null = null;
  let measureRafId: number | null = null;
  let pageScrollLocked = false;
  let ty = 0;
  let resizeObserver: ResizeObserver | null = null;
  let intersectionObserver: IntersectionObserver | null = null;
  let isVisible = true;
  let lastWallTransform = "";
  let lastFloorTransform = "";
  let lastCeilTransform = "";
  const observedImages = new Set<HTMLImageElement>();

  function measureScrollLimits() {
    const box = refs.centerBoxRef.value;
    if (!box) return;

    railH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--railH")
      ) || 60;

    wallH = Math.max(0, box.offsetHeight - 2 * railH);
    const contentH = refs.wallRef.value?.scrollHeight || 0;
    maxScroll = Math.max(0, contentH - wallH);

    targetScroll = Math.min(targetScroll, maxScroll);
    scrollPos = Math.min(scrollPos, maxScroll);
    applyTransforms();
    requestLoop();
  }

  function scheduleMeasureScrollLimits() {
    if (measureRafId !== null) return;
    measureRafId = requestAnimationFrame(() => {
      measureRafId = null;
      measureScrollLimits();
      syncImageListeners();
    });
  }

  function onImageLoad() {
    scheduleMeasureScrollLimits();
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

  function setTransform(
    el: HTMLElement | null,
    transform: string,
    kind: "wall" | "floor" | "ceil"
  ) {
    if (!el) return;

    if (kind === "wall") {
      if (lastWallTransform === transform) return;
      lastWallTransform = transform;
    } else if (kind === "floor") {
      if (lastFloorTransform === transform) return;
      lastFloorTransform = transform;
    } else if (lastCeilTransform === transform) {
      return;
    } else {
      lastCeilTransform = transform;
    }

    el.style.transform = transform;
  }

  function applyTransforms() {
    const y = Math.round(scrollPos * 100) / 100;
    setTransform(refs.wallRef.value, `translate3d(0, ${-y}px, 0)`, "wall");
    setTransform(
      refs.floorRef.value,
      `translate3d(0, ${-(y + wallH)}px, 0)`,
      "floor"
    );
    setTransform(
      refs.ceilRef.value,
      `translate3d(0, ${-(y - railH)}px, 0)`,
      "ceil"
    );
  }

  function requestLoop() {
    if (rafId !== null || !isVisible) return;
    rafId = requestAnimationFrame(loop);
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
      requestLoop();
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
      requestLoop();
    } else {
      syncPageScrollLock(false);
    }

    ty = touch.clientY;
  }

  function onKey(e: KeyboardEvent) {
    if (window.scrollY > 1) return;

    const previousTarget = targetScroll;
    if (e.key === "ArrowDown")
      targetScroll = Math.min(maxScroll, targetScroll + keyStep);
    if (e.key === "ArrowUp")
      targetScroll = Math.max(0, targetScroll - keyStep);

    if (previousTarget !== targetScroll) {
      e.preventDefault();
      syncPageScrollLock(true);
      requestLoop();
    }
  }

  function loop() {
    rafId = null;
    if (!isVisible) return;

    const delta = targetScroll - scrollPos;
    if (Math.abs(delta) < 0.08) {
      scrollPos = targetScroll;
    } else {
      scrollPos += delta * lerpFactor;
    }

    applyTransforms();

    if (Math.abs(targetScroll - scrollPos) >= 0.08) {
      requestLoop();
    }
  }

  onMounted(() => {
    const box = refs.centerBoxRef.value;
    const wall = refs.wallRef.value;
    if (!box || !wall) return;

    box.addEventListener("touchstart", onTouchStart, { passive: true });
    box.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", scheduleMeasureScrollLimits, {
      passive: true,
    });

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry?.isIntersecting ?? true;
          if (isVisible) {
            scheduleMeasureScrollLimits();
            requestLoop();
          }
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(box);
    }

    resizeObserver = new ResizeObserver(() => {
      scheduleMeasureScrollLimits();
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
  });

  onUnmounted(() => {
    const box = refs.centerBoxRef.value;
    box?.removeEventListener("touchstart", onTouchStart);
    box?.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", scheduleMeasureScrollLimits);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    observedImages.forEach((img) => {
      img.removeEventListener("load", onImageLoad);
      img.removeEventListener("error", onImageLoad);
    });
    observedImages.clear();
    if (rafId) cancelAnimationFrame(rafId);
    if (measureRafId) cancelAnimationFrame(measureRafId);
    syncPageScrollLock(false);
  });

  return { onWheel };
}
