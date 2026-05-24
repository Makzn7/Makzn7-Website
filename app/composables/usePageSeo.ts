import { toValue, type MaybeRefOrGetter } from "vue";
import type { SeoFields } from "~/types/settings";
import type { Page } from "~/types/page";

interface PageSeoOptions {
  /** Page object as returned from the CMS. Its `seo` field, when present, overrides globals. */
  page?: MaybeRefOrGetter<Page | null | undefined>;
  /** Optional fallback title (used if neither page nor global SEO provide one). */
  title?: MaybeRefOrGetter<string | undefined>;
  /** Optional fallback description. */
  description?: MaybeRefOrGetter<string | undefined>;
  /** Optional fallback image. */
  image?: MaybeRefOrGetter<string | undefined>;
  /** OG type. */
  type?: "website" | "article";
  /** Force noindex. */
  noindex?: boolean;
}

/**
 * Thin wrapper over `useSeo` that knows how to extract per-page overrides
 * from a CMS-returned `Page`. Falls back to global settings SEO automatically.
 */
export function usePageSeo(options: PageSeoOptions = {}) {
  useSeo({
    page: () => {
      const p = toValue(options.page);
      if (!p) return null;
      const seo: Partial<SeoFields> = { ...(p.seo || {}) };

      // Backward-compat: surface legacy flat fields if the structured object
      // is missing so older API responses keep working.
      if (!seo.meta_title_en && p.seoTitle) seo.meta_title_en = p.seoTitle;
      if (!seo.meta_title_ar && p.seoTitle) seo.meta_title_ar = p.seoTitle;
      if (!seo.meta_description_en && p.seoDescription)
        seo.meta_description_en = p.seoDescription;
      if (!seo.meta_description_ar && p.seoDescription)
        seo.meta_description_ar = p.seoDescription;
      if (!seo.og_image && p.ogImage) seo.og_image = p.ogImage;

      return seo;
    },
    title: options.title,
    description: options.description,
    image: options.image,
    type: options.type,
    noindex: options.noindex,
  });
}
