/**
 * Global i18n plugin
 * Makes translation functions available globally via $t, $locale, etc.
 *
 * Usage in components:
 * <script setup>
 * const { $t, $locale } = useNuxtApp()
 * </script>
 *
 * <template>
 *   <p>{{ $t('welcome') }}</p>
 *   <p>Current: {{ $locale }}</p>
 * </template>
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n;

  return {
    provide: {
      t: i18n.t,
      locale: i18n.locale,
      locales: i18n.locales,
      setLocale: i18n.setLocale,
      te: i18n.te, // Check if translation exists
      tm: i18n.tm, // Get translation messages
    },
  };
});
