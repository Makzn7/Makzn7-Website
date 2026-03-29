import { ref, onMounted, onBeforeUnmount } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollShellOptions {
  lerp?: number;
  multiplier?: number;
}

export function usePageScrollShell(options: ScrollShellOptions = {}) {
  const { lerp = 0.08, multiplier = 1 } = options;

  const scrollContainer = ref<HTMLElement | null>(null);
  // LocomotiveScroll v5 instance — untyped because the library
  // doesn't export a usable TS interface for its constructor options.
  let scroll: any = null;

  onMounted(async () => {
    const { $LocomotiveScroll } = useNuxtApp();

    if (scrollContainer.value) {
      scroll = new ($LocomotiveScroll as any)({
        el: scrollContainer.value,
        smooth: true,
        lerp,
        multiplier,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });

      const lenis = scroll.lenisInstance;
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", () => lenis.resize?.());
      }
      ScrollTrigger.refresh();
    }
  });

  onBeforeUnmount(() => {
    if (scroll) scroll.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });

  function lockPageScroll() {
    if (!scroll) return;
    scroll.stop();
  }

  function unlockPageScroll() {
    if (!scroll) return;
    scroll.start();
  }

  return {
    scrollContainer,
    lockPageScroll,
    unlockPageScroll,
  };
}
