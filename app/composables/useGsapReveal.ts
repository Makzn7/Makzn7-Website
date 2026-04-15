import { onMounted } from "vue";
import { gsap } from "gsap";

interface RevealOptions {
  containerSelector?: string;
  yDistance?: number;
  xDistance?: number;
  duration?: number;
  ease?: string;
  start?: string;
}

export function useGsapReveal(options: RevealOptions = {}) {
  const {
    containerSelector = "#content-section",
    yDistance = 50,
    xDistance = 60,
    duration = 1,
    ease = "power3.out",
    start = "top 85%",
  } = options;

  const { locale } = useI18n({ useScope: 'global' });

  onMounted(() => {
    const isRTL = locale.value === "ar";
    const toggleActions = "play none none reverse";

    gsap.utils
      .toArray<HTMLElement>(`${containerSelector} .fade-in`)
      .forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: yDistance,
          duration,
          ease,
          scrollTrigger: { trigger: el, start, toggleActions },
        });
      });

    gsap.utils
      .toArray<HTMLElement>(`${containerSelector} .fade-in-left`)
      .forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: isRTL ? xDistance : -xDistance,
          duration,
          ease,
          scrollTrigger: { trigger: el, start, toggleActions },
        });
      });

    gsap.utils
      .toArray<HTMLElement>(`${containerSelector} .fade-in-right`)
      .forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: isRTL ? -xDistance : xDistance,
          duration,
          ease,
          scrollTrigger: { trigger: el, start, toggleActions },
        });
      });
  });
}
