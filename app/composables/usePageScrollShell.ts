import { ref, onMounted, onBeforeUnmount } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type {
  LocomotiveScrollInstance,
  LocomotiveScrollConstructor,
} from "~/types/scroll";

interface ScrollShellOptions {
  lerp?: number;
  multiplier?: number;
}

export function usePageScrollShell(options: ScrollShellOptions = {}) {
  const { lerp = 0.08, multiplier = 1 } = options;

  const scrollContainer = ref<HTMLElement | null>(null);
  let scroll: LocomotiveScrollInstance | null = null;
  let onLenisScroll: (() => void) | null = null;
  let onRefresh: (() => void) | null = null;

  onMounted(async () => {
    const { $LocomotiveScroll } = useNuxtApp();

    if (scrollContainer.value) {
      const LS = $LocomotiveScroll as LocomotiveScrollConstructor;
      scroll = new LS({
        el: scrollContainer.value,
        smooth: true,
        lerp,
        multiplier,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });

      const lenis = scroll.lenisInstance;
      if (lenis) {
        onLenisScroll = () => ScrollTrigger.update();
        onRefresh = () => lenis.resize?.();
        lenis.on("scroll", onLenisScroll);
        ScrollTrigger.addEventListener("refresh", onRefresh);
      }
      ScrollTrigger.refresh();
    }
  });

  onBeforeUnmount(() => {
    const lenis = scroll?.lenisInstance;
    if (lenis && onLenisScroll) lenis.off?.("scroll", onLenisScroll);
    if (onRefresh) ScrollTrigger.removeEventListener("refresh", onRefresh);
    if (scroll) scroll.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    onLenisScroll = null;
    onRefresh = null;
    scroll = null;
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
