type TrackPayload = {
  path: string;
  full_url: string;
  title: string;
  referrer: string;
  locale: string;
  visitor_id: string | null;
};

const DEBOUNCE_MS = 250;

function readLocale(): string {
  try {
    const nuxtApp = useNuxtApp();
    const i18n = (nuxtApp as unknown as { $i18n?: { locale: { value: string } | string } }).$i18n;
    if (!i18n) return "en";
    const raw = (i18n as { locale: { value: string } | string }).locale;
    return typeof raw === "string" ? raw : raw?.value || "en";
  } catch {
    return "en";
  }
}

/**
 * Silent background page-view tracking. Never throws into the UI, never
 * blocks navigation. Debounces consecutive route changes (e.g. redirects).
 *
 * Plugin-safe: does NOT call `useI18n()` at top level (which would require
 * a `setup()` context). Locale is read on demand via `useNuxtApp().$i18n`.
 */
export function useTracking() {
  const config = useRuntimeConfig();

  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastSentKey: string | null = null;

  async function send(payload: TrackPayload) {
    try {
      await $fetch("/tracking/page-view", {
        baseURL: config.public.apiBase,
        method: "POST",
        body: payload,
        keepalive: true,
      });
    } catch {
      // Tracking is best-effort; swallow all errors silently.
    }
  }

  function track(pathOverride?: string) {
    if (import.meta.server) return;

    const path =
      pathOverride ?? window.location.pathname + window.location.search;
    const full_url = window.location.href;
    const locale = readLocale();
    const queueKey = `${path}::${locale}`;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const title = document.title;
      const referrer = document.referrer || "";
      const visitor_id = useVisitorId();

      const dedupeKey = `${queueKey}::${title}`;
      if (dedupeKey === lastSentKey) return;
      lastSentKey = dedupeKey;

      send({
        path,
        full_url,
        title,
        referrer,
        locale,
        visitor_id,
      });
    }, DEBOUNCE_MS);
  }

  return { track };
}
