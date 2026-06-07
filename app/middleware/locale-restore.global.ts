/**
 * Restores the user's saved locale on every page load.
 *
 * The chosen locale is stored in the `makzn7-locale` cookie (written by the
 * i18n-persist plugin). English is the default locale and is served on
 * unprefixed routes (`prefix_except_default` strategy), so only the Arabic
 * preference needs a redirect: an unprefixed URL is rewritten to its `/ar`
 * counterpart.
 *
 * Running as global middleware means the redirect happens on the server before
 * the page renders, so there is no language flash. Routes that already carry
 * the `/ar` prefix are left untouched, which also prevents redirect loops.
 *
 * No saved choice (or a saved "en") leaves the route as-is, guaranteeing that
 * a first visit is always English.
 */
const STORAGE_KEY = "makzn7-locale";
const PREFIX = "/ar";

export default defineNuxtRouteMiddleware((to) => {
  const saved = useCookie<string | null>(STORAGE_KEY).value;

  // Only the non-default (Arabic) locale lives behind a URL prefix.
  if (saved !== "ar") return;

  // Already on an Arabic route — nothing to do (and avoids a redirect loop).
  if (to.path === PREFIX || to.path.startsWith(`${PREFIX}/`)) return;

  const path = to.path === "/" ? PREFIX : `${PREFIX}${to.path}`;
  return navigateTo(
    { path, query: to.query, hash: to.hash },
    { redirectCode: 302 }
  );
});
