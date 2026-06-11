import { onMounted, onUnmounted, nextTick, type Ref } from "vue";

/*
  ════════════════════════════════════════════════════════════════
  NATIVE_PAGE_SCROLL = false
  ════════════════════════════════════════════════════════════════
  السلوك المعتمد (العلم = false): يتمرّر محتوى الهيرو (PageContent)
  *داخل* الإطار أولًا حتى ينتهي، ثم يُسلّم التمرير للصفحة فتُكمل بقية
  المحتوى تمريرًا native. يتحقق ذلك باختطاف wheel/touch/keys ومنع تمرير
  الصفحة بـ preventDefault طالما هناك محتوى داخلي لم يُتمرّر؛ وعند بلوغ
  حافة التمرير الداخلي يتوقف الاختطاف فتتمرّر الصفحة طبيعيًا.

  التمرير العام native (Locomotive معطّل) والهيرو غير sticky، فبعد
  انتهاء التمرير الداخلي يصعد الهيرو ويظهر باقي المحتوى أسفله طبيعيًا.

  - false → تمرير داخلي للهيرو أولًا ثم تمرير الصفحة (الحالي).
  - true  → إطار ثابت بلا تمرير داخلي (الصفحة تتمرّر فوقه فقط).
  ════════════════════════════════════════════════════════════════
*/
const NATIVE_PAGE_SCROLL = false;

interface HeroScrollRefs {
  centerBoxRef: Ref<HTMLElement | null>;
  wallRef: Ref<HTMLElement | null>;
  floorRef: Ref<HTMLElement | null>;
  ceilRef: Ref<HTMLElement | null>;
}

interface HeroScrollOptions {
  lerpFactor?: number;
  keyStep?: number;
  touchSensitivity?: number;
  touchMomentumFriction?: number;
  touchMinMomentumVelocity?: number;
}

export function useHeroScroll(
  refs: HeroScrollRefs,
  emit: (event: "lock-page-scroll" | "unlock-page-scroll") => void,
  options: HeroScrollOptions = {}
) {
  const {
    lerpFactor = 0.22,
    keyStep = 60,
    touchSensitivity = 1.5,
    touchMomentumFriction = 0.93,
    touchMinMomentumVelocity = 0.05,
  } = options;

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

  /* ── touch momentum state ── */
  let lastTouchY = 0;
  let lastTouchTime = 0;
  let touchVelocity = 0; // px/ms — positive means scrolling content up (finger moves up)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartedInSlider = false;
  let touchAxisLocked: "h" | "v" | null = null;
  let momentumRafId: number | null = null;
  let lastMomentumTime = 0;
  const MAX_TOUCH_DT = 50;
  const TOUCH_AXIS_LOCK_DISTANCE = 6;

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
    // الوضع native: لا نقفل تمرير الصفحة إطلاقًا.
    if (NATIVE_PAGE_SCROLL) return;
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
    // الوضع native: لا نختطف العجلة، نترك الصفحة تتمرّر طبيعيًا.
    if (NATIVE_PAGE_SCROLL) return;
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

  function cancelMomentum() {
    if (momentumRafId !== null) {
      cancelAnimationFrame(momentumRafId);
      momentumRafId = null;
    }
    touchVelocity = 0;
  }

  function resetTouchGesture() {
    touchStartedInSlider = false;
    touchAxisLocked = null;
  }

  function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;
    /* New finger contact always cancels any momentum from previous flick */
    cancelMomentum();
    ty = touch.clientY;
    lastTouchY = touch.clientY;
    lastTouchTime = performance.now();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartedInSlider = Boolean(
      (e.target as Element | null)?.closest(".media-slider")
    );
    touchAxisLocked = null;
  }

  function onTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;

    if (touchStartedInSlider) {
      const totalDeltaX = touch.clientX - touchStartX;
      const totalDeltaY = touch.clientY - touchStartY;

      if (touchAxisLocked === null) {
        if (
          Math.abs(totalDeltaX) < TOUCH_AXIS_LOCK_DISTANCE &&
          Math.abs(totalDeltaY) < TOUCH_AXIS_LOCK_DISTANCE
        ) {
          return;
        }
        touchAxisLocked =
          Math.abs(totalDeltaX) > Math.abs(totalDeltaY) ? "h" : "v";
      }

      if (touchAxisLocked === "h") {
        syncPageScrollLock(false);
        touchVelocity = 0;
        return;
      }
    }

    if (window.scrollY > 1) {
      syncPageScrollLock(false);
      ty = touch.clientY;
      lastTouchY = touch.clientY;
      lastTouchTime = performance.now();
      touchVelocity = 0;
      return;
    }

    const now = performance.now();
    const dt = Math.min(MAX_TOUCH_DT, Math.max(1, now - lastTouchTime));
    /*
      Amplify finger delta so a swipe travels a sensible distance — native
      mobile scroll typically moves content faster than the finger. Without
      this, even a quick flick only nudges the hero a few dozen px.
    */
    const fingerDelta = (ty - touch.clientY) * touchSensitivity;

    /* EMA-smoothed velocity for the momentum kick on touchend */
    const instantV = ((lastTouchY - touch.clientY) * touchSensitivity) / dt;
    touchVelocity = touchVelocity * 0.6 + instantV * 0.4;

    const nextTarget = targetScroll + fingerDelta;
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
    lastTouchY = touch.clientY;
    lastTouchTime = now;
  }

  function onTouchEnd() {
    const wasSliderHorizontalSwipe =
      touchStartedInSlider && touchAxisLocked === "h";
    resetTouchGesture();

    if (wasSliderHorizontalSwipe) {
      touchVelocity = 0;
      return;
    }

    /* Bail early if we don't have enough flick to be worth animating */
    if (Math.abs(touchVelocity) < touchMinMomentumVelocity) {
      touchVelocity = 0;
      return;
    }
    /* Skip momentum at the edges or when the page scroll has taken over */
    if (
      (touchVelocity > 0 && targetScroll >= maxScroll) ||
      (touchVelocity < 0 && targetScroll <= 0) ||
      (typeof window !== "undefined" && window.scrollY > 1)
    ) {
      touchVelocity = 0;
      return;
    }

    syncPageScrollLock(true);
    lastMomentumTime = performance.now();
    if (momentumRafId === null) {
      momentumRafId = requestAnimationFrame(momentumTick);
    }
  }

  function momentumTick() {
    momentumRafId = null;
    if (!isVisible) {
      touchVelocity = 0;
      return;
    }

    const now = performance.now();
    const dt = Math.min(MAX_TOUCH_DT, Math.max(1, now - lastMomentumTime));
    lastMomentumTime = now;

    /* Frame-rate-independent exponential decay */
    const decay = Math.pow(touchMomentumFriction, dt / 16.667);
    touchVelocity *= decay;

    const next = targetScroll + touchVelocity * dt;
    const clamped = Math.max(0, Math.min(maxScroll, next));
    targetScroll = clamped;
    requestLoop();

    if (clamped !== next) {
      /* Hit an edge — release lock so further finger flicks can scroll page */
      touchVelocity = 0;
      return;
    }
    if (Math.abs(touchVelocity) < touchMinMomentumVelocity) {
      touchVelocity = 0;
      return;
    }
    momentumRafId = requestAnimationFrame(momentumTick);
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

    // الوضع native: لا نربط مستمعات wheel/touch/keys المُختطِفة للتمرير.
    // نكتفي بالقياس وتطبيق التحويلات الثابتة (resize/observers) حتى يبقى
    // شكل الإطار ثلاثي الأبعاد صحيحًا، والصفحة تتمرّر طبيعيًا فوقه.
    if (!NATIVE_PAGE_SCROLL) {
      box.addEventListener("touchstart", onTouchStart, { passive: true });
      box.addEventListener("touchmove", onTouchMove, { passive: false });
      box.addEventListener("touchend", onTouchEnd, { passive: true });
      box.addEventListener("touchcancel", onTouchEnd, { passive: true });
      window.addEventListener("keydown", onKey);
    }
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
    box?.removeEventListener("touchend", onTouchEnd);
    box?.removeEventListener("touchcancel", onTouchEnd);
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
    cancelMomentum();
    syncPageScrollLock(false);
  });

  return { onWheel };
}
