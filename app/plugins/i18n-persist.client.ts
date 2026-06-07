/**
 * Persists the user's chosen locale to a long-lived cookie.
 *
 * Whenever the active locale changes (e.g. via the language toggle), the new
 * value is written to the `makzn7-locale` cookie so it survives navigation,
 * refreshes and new tabs. Restoring the saved locale on load is handled by the
 * `locale-restore` global middleware (which runs on the server, avoiding any
 * language flash).
 *
 * The watcher is intentionally NOT immediate: on a first visit there is no
 * saved choice, so we must not write the URL-derived default ("en") over an
 * (absent) preference. The cookie is created only once the user actually picks
 * a language.
 */
const STORAGE_KEY = "makzn7-locale";

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n;

  const savedLocale = useCookie<string | null>(STORAGE_KEY, {
    maxAge: 60 * 60 * 24 * 365, // one year
    sameSite: "lax",
    path: "/",
  });

  watch(i18n.locale, (locale) => {
    savedLocale.value = locale;
  });
});
