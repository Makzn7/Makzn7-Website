export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const { track } = useTracking();

  // Initial page load — wait for the app to fully mount so the document
  // title reflects the first page's SEO before we read it.
  nuxtApp.hook("app:mounted", () => {
    // Defer one frame so useSeo's useSeoMeta has flushed into <head>.
    requestAnimationFrame(() => track());
  });

  // Subsequent SPA navigations.
  router.afterEach((to) => {
    // Wait for the new page's <head> to update before reading document.title.
    nextTick(() => {
      requestAnimationFrame(() => track(to.fullPath));
    });
  });
});
