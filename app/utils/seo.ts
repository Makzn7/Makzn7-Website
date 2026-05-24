import type { SeoFields } from "~/types/settings";

export type Locale = "ar" | "en";

export type LocalizedSeo = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

const blank = (value: unknown): value is null | undefined | "" =>
  value === null || value === undefined || value === "";

const pick = <T>(...values: Array<T | null | undefined>): T | undefined => {
  for (const value of values) {
    if (!blank(value)) return value as T;
  }
  return undefined;
};

/**
 * Resolve a SeoFields-shaped object (page-level overrides) on top of the
 * global SeoFields default, per-field, with locale awareness.
 */
export function resolveSeo(
  page: Partial<SeoFields> | null | undefined,
  global: Partial<SeoFields> | null | undefined,
  locale: Locale
): LocalizedSeo {
  const p = page || {};
  const g = global || {};
  const isAr = locale === "ar";

  const title = pick(
    isAr ? p.meta_title_ar : p.meta_title_en,
    isAr ? p.meta_title_en : p.meta_title_ar,
    isAr ? g.meta_title_ar : g.meta_title_en,
    isAr ? g.meta_title_en : g.meta_title_ar
  );

  const description = pick(
    isAr ? p.meta_description_ar : p.meta_description_en,
    isAr ? p.meta_description_en : p.meta_description_ar,
    isAr ? g.meta_description_ar : g.meta_description_en,
    isAr ? g.meta_description_en : g.meta_description_ar
  );

  const keywords = pick(
    isAr ? p.meta_keywords_ar : p.meta_keywords_en,
    isAr ? p.meta_keywords_en : p.meta_keywords_ar,
    isAr ? g.meta_keywords_ar : g.meta_keywords_en,
    isAr ? g.meta_keywords_en : g.meta_keywords_ar
  );

  const ogTitle = pick(
    isAr ? p.og_title_ar : p.og_title_en,
    isAr ? p.og_title_en : p.og_title_ar,
    isAr ? g.og_title_ar : g.og_title_en,
    isAr ? g.og_title_en : g.og_title_ar,
    title
  );

  const ogDescription = pick(
    isAr ? p.og_description_ar : p.og_description_en,
    isAr ? p.og_description_en : p.og_description_ar,
    isAr ? g.og_description_ar : g.og_description_en,
    isAr ? g.og_description_en : g.og_description_ar,
    description
  );

  const ogImage = pick(p.og_image, g.og_image);

  const twitterTitle = pick(
    isAr ? p.twitter_title_ar : p.twitter_title_en,
    isAr ? p.twitter_title_en : p.twitter_title_ar,
    isAr ? g.twitter_title_ar : g.twitter_title_en,
    isAr ? g.twitter_title_en : g.twitter_title_ar,
    ogTitle
  );

  const twitterDescription = pick(
    isAr ? p.twitter_description_ar : p.twitter_description_en,
    isAr ? p.twitter_description_en : p.twitter_description_ar,
    isAr ? g.twitter_description_ar : g.twitter_description_en,
    isAr ? g.twitter_description_en : g.twitter_description_ar,
    ogDescription
  );

  const twitterImage = pick(p.twitter_image, g.twitter_image, ogImage);

  const canonicalUrl = pick(p.canonical_url, g.canonical_url);

  const robotsIndex = pick(p.robots_index, g.robots_index);
  const robotsFollow = pick(p.robots_follow, g.robots_follow);

  return {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl,
    robotsIndex,
    robotsFollow,
  };
}

export function robotsDirective(
  index: boolean | undefined,
  follow: boolean | undefined
): string {
  const i = index === false ? "noindex" : "index";
  const f = follow === false ? "nofollow" : "follow";
  return `${i}, ${f}`;
}
