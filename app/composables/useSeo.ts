import { computed, toValue, type MaybeRefOrGetter } from "vue";
import type { SeoFields } from "~/types/settings";
import { resolveSeo, robotsDirective, type Locale } from "~/utils/seo";

interface SeoInput {
  /** Optional fallback title (used if neither page nor global SEO provide one). */
  title?: MaybeRefOrGetter<string | undefined>;
  /** Optional fallback description. */
  description?: MaybeRefOrGetter<string | undefined>;
  /** Page-level SEO override coming from CMS (highest priority). */
  page?: MaybeRefOrGetter<Partial<SeoFields> | null | undefined>;
  /** Global SEO from settings (used as fallback). */
  global?: MaybeRefOrGetter<Partial<SeoFields> | null | undefined>;
  /** Optional fallback image. */
  image?: MaybeRefOrGetter<string | undefined>;
  /** Open Graph object type. Defaults to "website". */
  type?: "website" | "article";
  /** Force noindex (overrides global/page robots_index). */
  noindex?: boolean;
}

const SITE_NAME = "Makzn7";
const DEFAULT_OG_IMAGE = "/logos/svg/logo_black.svg";

/**
 * Central per-page SEO. Pulls global SEO from `useSettings()` by default
 * and merges any page-level overrides on top, locale-aware. Pages should
 * call this (or `usePageSeo`) instead of hand-rolling `useHead`.
 */
export function useSeo(input: SeoInput = {}) {
  const { locale, locales } = useI18n();
  const route = useRoute();
  const requestURL = useRequestURL();
  const switchLocalePath = useSwitchLocalePath();

  // Lazily access settings; if the call site already loaded them, the
  // useAsyncData cache returns the same instance — no extra request.
  const settings = useSettings();
  const globalFromSettings = computed(() => settings.data.value?.seo);

  const origin = requestURL.origin;
  const toAbsolute = (path: string) =>
    path.startsWith("http") ? path : `${origin}${path}`;

  const resolved = computed(() => {
    const page = toValue(input.page) ?? null;
    const global = toValue(input.global) ?? globalFromSettings.value ?? null;
    return resolveSeo(page, global, locale.value as Locale);
  });

  const fallbackTitle = computed(() => toValue(input.title));
  const fallbackDescription = computed(() => toValue(input.description));
  const fallbackImage = computed(() => toValue(input.image));

  const title = computed(
    () => resolved.value.title || fallbackTitle.value || SITE_NAME
  );
  const description = computed(
    () => resolved.value.description || fallbackDescription.value || ""
  );
  const keywords = computed(() => resolved.value.keywords);
  const ogTitle = computed(() => resolved.value.ogTitle || title.value);
  const ogDescription = computed(
    () => resolved.value.ogDescription || description.value
  );
  const twitterTitle = computed(() => resolved.value.twitterTitle || title.value);
  const twitterDescription = computed(
    () => resolved.value.twitterDescription || description.value
  );

  const canonical = computed(() => {
    const explicit = resolved.value.canonicalUrl;
    if (explicit) return toAbsolute(explicit);
    return toAbsolute(route.fullPath || route.path);
  });

  const ogImage = computed(() =>
    toAbsolute(
      resolved.value.ogImage || fallbackImage.value || DEFAULT_OG_IMAGE
    )
  );
  const twitterImage = computed(() =>
    toAbsolute(
      resolved.value.twitterImage ||
        resolved.value.ogImage ||
        fallbackImage.value ||
        DEFAULT_OG_IMAGE
    )
  );

  const ogLocale = computed(() => (locale.value === "ar" ? "ar_SA" : "en_US"));

  const robots = computed(() => {
    if (input.noindex) return "noindex, nofollow";
    return robotsDirective(
      resolved.value.robotsIndex,
      resolved.value.robotsFollow
    );
  });

  useSeoMeta({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogType: input.type ?? "website",
    ogUrl: canonical,
    ogImage,
    ogSiteName: SITE_NAME,
    ogLocale,
    twitterCard: "summary_large_image",
    twitterTitle,
    twitterDescription,
    twitterImage,
    robots,
  });

  useHead(() => {
    const alternates = locales.value.map((raw) => {
      const entry = (typeof raw === "string" ? { code: raw } : raw) as {
        code: string;
        iso?: string;
        language?: string;
      };
      return {
        rel: "alternate",
        hreflang: entry.language || entry.iso || entry.code,
        href: toAbsolute(switchLocalePath(entry.code) || route.path),
      };
    });

    return {
      link: [
        { rel: "canonical", href: canonical.value },
        ...alternates,
        {
          rel: "alternate",
          hreflang: "x-default",
          href: toAbsolute(switchLocalePath("en") || route.path),
        },
      ],
    };
  });
}
