// Per-route default color mode.
//
// The home page opens in dark for first-time visitors while every other page
// defaults to light. This keeps the global site default (light) intact and
// scopes the dark experience to the landing page only. Once the visitor
// toggles the theme manually (ContactSection sets `makzn7-theme-user-set`),
// their stored choice wins everywhere and we stop overriding it.
//
// The pre-paint inline script in nuxt.config handles the very first hard load
// (no flash); this plugin keeps client-side navigations in sync.

const USER_SET_KEY = "makzn7-theme-user-set";

// Routes that should open in dark by default. Currently only the home route
// (en index "/" and ar index "/ar"). Extend this if more pages need it.
function isDarkDefaultRoute(path: string): boolean {
  return path === "/" || path === "/ar" || path === "/ar/";
}

export default defineNuxtPlugin(() => {
  const colorMode = useColorMode();
  const router = useRouter();

  function applyRouteDefault(path: string) {
    // Visitor has made an explicit choice — never override it again.
    if (localStorage.getItem(USER_SET_KEY) === "1") return;

    const next = isDarkDefaultRoute(path) ? "dark" : "light";
    if (colorMode.preference !== next) colorMode.preference = next;
  }

  applyRouteDefault(router.currentRoute.value.path);
  router.afterEach((to) => applyRouteDefault(to.path));
});
