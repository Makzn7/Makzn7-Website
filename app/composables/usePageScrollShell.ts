import { onMounted, onBeforeUnmount } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type {
  LocomotiveScrollInstance,
  LocomotiveScrollConstructor,
} from "~/types/scroll";

/*
  ════════════════════════════════════════════════════════════════
  SCROLL MODE
  ════════════════════════════════════════════════════════════════
  `USE_SMOOTH_SCROLL = false` → التمرير native على مستوى window/body.
  Locomotive لا يُنشأ إطلاقًا، فلا تُضاف الكلاس `has-scroll-smooth`
  على <html> (التي تضع overflow:hidden)، وبالتالي يعود التمرير
  الطبيعي للصفحة بالكامل. ScrollTrigger يعمل تلقائيًا على scroll
  الـ window في هذا الوضع.

  لإرجاع التجربة القديمة (smooth scroll عبر Locomotive) فقط بدّل العلم
  إلى `true` — لا حاجة لأي تغيير آخر. المكتبة وكل الكود الأصلي محفوظان.
  ════════════════════════════════════════════════════════════════
*/
const USE_SMOOTH_SCROLL = false;

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
    if (!USE_SMOOTH_SCROLL) {
      // الوضع native: التمرير على window/body مباشرة. نُحدّث ScrollTrigger
      // بعد أول رسم حتى يقيس ارتفاع المحتوى الحقيقي.
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

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

  /*
    قفل/فتح تمرير الصفحة.
    - وضع Locomotive: stop/start على الـ instance.
    - الوضع native: لا نقفل body. useHeroScroll يمنع تمرير الصفحة عبر
      preventDefault أثناء التمرير الداخلي للهيرو، فقفل body هنا يسبب
      وميض/إزاحة الـ scrollbar بلا فائدة، لذا نتركه no-op.
  */
  function lockPageScroll() {
    if (USE_SMOOTH_SCROLL) scroll?.stop();
  }

  function unlockPageScroll() {
    if (USE_SMOOTH_SCROLL) scroll?.start();
  }

  return {
    scrollContainer,
    lockPageScroll,
    unlockPageScroll,
  };
}
