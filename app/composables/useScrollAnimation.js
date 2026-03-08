/**
 * useScrollAnimation
 *
 * Sets up an IntersectionObserver that adds `.is-visible` to every
 * .fade-in / .fade-in-left / .fade-in-right element inside `containerRef`.
 *
 * Usage:
 *   const rootRef = ref(null)
 *   useScrollAnimation(rootRef)
 *   // then bind ref="rootRef" to the component's root element
 */
import { onMounted, onUnmounted } from "vue";

export function useScrollAnimation(containerRef, options = {}) {
  const { threshold = 0.12, rootMargin = "0px 0px -50px 0px" } = options;

  let observer = null;

  onMounted(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;

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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    els.forEach((el) => observer.observe(el));
  });

  onUnmounted(() => observer?.disconnect());
}
