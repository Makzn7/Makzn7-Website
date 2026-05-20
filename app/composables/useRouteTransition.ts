import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";

/*
  Drives the cinematic page transition: a dark veil covers the screen
  while routes swap so the background never flashes between pages.
  Per-page data loading is shown separately by <PageContentLoader>
  inside each Hero. Returns `veilActive` for app.vue plus the
  `transition` object for <NuxtPage>.
*/
export function useRouteTransition() {
  const veilActive = ref(false);

  const { isLoading } = useLoadingIndicator();

  let appReady = false;
  let enterHandled = false;
  let safetyTimer: ReturnType<typeof setTimeout> | null = null;

  const wait = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const clearSafetyTimer = () => {
    if (safetyTimer) {
      clearTimeout(safetyTimer);
      safetyTimer = null;
    }
  };

  // Raise the veil (and its loader) the moment a real navigation begins
  // loading data, so the loading state is visible during the whole fetch.
  watch(isLoading, (loading) => {
    if (!appReady || prefersReducedMotion()) return;
    if (loading) {
      enterHandled = false;
      veilActive.value = true;
    } else {
      // Safety net: if no page transition takes over (error page or an
      // aborted navigation), drop the veil so the UI is never stuck.
      clearSafetyTimer();
      safetyTimer = setTimeout(() => {
        if (!enterHandled) veilActive.value = false;
      }, 900);
    }
  });

  const pageTransition = {
    name: "page",
    mode: "out-in" as const,
    css: false,
    async onLeave(_el: Element, done: () => void) {
      if (prefersReducedMotion()) return done();
      veilActive.value = true;
      await wait(230); // veil fade-in (200ms) + margin
      done();
    },
    async onEnter(_el: Element, done: () => void) {
      enterHandled = true;
      clearSafetyTimer();
      if (prefersReducedMotion()) {
        veilActive.value = false;
        return done();
      }
      await wait(60); // brief hold so the swap is fully hidden
      veilActive.value = false;
      await wait(320); // veil fade-out (300ms) + margin
      done();
    },
  };

  onMounted(() => {
    // Ignore loading state from the initial render — the veil should
    // only react to client-side navigations.
    nextTick(() => {
      appReady = true;
    });
  });
  onBeforeUnmount(clearSafetyTimer);

  return { veilActive, pageTransition };
}
