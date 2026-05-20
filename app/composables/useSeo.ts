import { computed, toValue, type MaybeRefOrGetter } from "vue";

interface SeoInput {
  /** Full document title for this page. */
  title: MaybeRefOrGetter<string>;
  /** Meta description for this page. */
  description: MaybeRefOrGetter<string>;
  /** Absolute URL or site-relative path for the share image. */
  image?: MaybeRefOrGetter<string | undefined>;
  /** Open Graph object type. Defaults to "website". */
  type?: "website" | "article";
  /** When true, asks crawlers not to index this page. */
  noindex?: boolean;
}

const SITE_NAME = "Makzn7";
const DEFAULT_OG_IMAGE = "/logos/svg/logo_black.svg";

/**
 * Centralizes per-page SEO: title, description, Open Graph, Twitter cards,
 * canonical URL and hreflang alternates. Pages should call this instead of
 * hand-rolling `useHead`, so metadata stays consistent across the site.
 */
export function useSeo(input: SeoInput) {
  const { locale, locales } = useI18n();
  const route = useRoute();
  const requestURL = useRequestURL();
  const switchLocalePath = useSwitchLocalePath();

  const origin = requestURL.origin;
  const toAbsolute = (path: string) =>
    path.startsWith("http") ? path : `${origin}${path}`;

  const title = computed(() => toValue(input.title));
  const description = computed(() => toValue(input.description));
  const canonical = computed(() => toAbsolute(route.path));
  const image = computed(() =>
    toAbsolute(toValue(input.image) || DEFAULT_OG_IMAGE),
  );
  const ogLocale = computed(() =>
    locale.value === "ar" ? "ar_SA" : "en_US",
  );

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: input.type ?? "website",
    ogUrl: canonical,
    ogImage: image,
    ogSiteName: SITE_NAME,
    ogLocale,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    robots: input.noindex ? "noindex, nofollow" : "index, follow",
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
