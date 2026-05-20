import { onMounted, onUnmounted, type Ref } from "vue";

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation(
  containerRef: Ref<HTMLElement | null>,
  options: ScrollAnimationOptions = {}
) {
  const { threshold = 0.12, rootMargin = "0px 0px -50px 0px" } = options;

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;
    if (prefersReducedMotion()) return;

    const container = containerRef?.value ?? document;
    const els = container.querySelectorAll(
      ".fade-in, .fade-in-left, .fade-in-right"
    );
    if (!els.length) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    els.forEach((el) => observer!.observe(el));
  });

  onUnmounted(() => observer?.disconnect());
}
