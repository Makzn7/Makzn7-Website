import { toValue, type MaybeRefOrGetter } from "vue";
import type { PageSeo } from "~/types/page";

/**
 * Minimal contract for any CMS-fetched entity that may carry SEO overrides
 * (Project, Department, Article, etc.). Legacy flat fields (`seoTitle`,
 * `seoDescription`, `ogImage`) are accepted for backward compatibility.
 */
export type SeoEntity = {
  seo?: PageSeo | null;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};

interface EntitySeoOptions<T extends SeoEntity> {
  /** Entity object (project, department, etc.) whose `seo` overrides globals. */
  entity?: MaybeRefOrGetter<T | null | undefined>;
  /** Optional fallback title (used only if neither entity nor global SEO has one). */
  title?: MaybeRefOrGetter<string | undefined>;
  /** Optional fallback description. */
  description?: MaybeRefOrGetter<string | undefined>;
  /** Optional fallback image. */
  image?: MaybeRefOrGetter<string | undefined>;
  /** OG type. Defaults to "article" for entities. */
  type?: "website" | "article";
  /** Force noindex. */
  noindex?: boolean;
}

/**
 * Generic entity-level SEO. Merges:
 *   entity.seo > global settings.seo > local fallbacks (title/description/image)
 *
 * Mirrors `usePageSeo` but for any entity-shaped object (Project, etc.).
 * Locale-aware via `useSeo`/`resolveSeo`.
 */
export function useEntitySeo<T extends SeoEntity>(
  options: EntitySeoOptions<T> = {}
) {
  useSeo({
    page: () => {
      const e = toValue(options.entity);
      if (!e) return null;
      const seo: PageSeo = { ...(e.seo || {}) };

      // Backward-compat: surface legacy flat fields when the structured
      // object is absent so older API responses keep working.
      if (!seo.meta_title_en && e.seoTitle) seo.meta_title_en = e.seoTitle;
      if (!seo.meta_title_ar && e.seoTitle) seo.meta_title_ar = e.seoTitle;
      if (!seo.meta_description_en && e.seoDescription)
        seo.meta_description_en = e.seoDescription;
      if (!seo.meta_description_ar && e.seoDescription)
        seo.meta_description_ar = e.seoDescription;
      if (!seo.og_image && e.ogImage) seo.og_image = e.ogImage;

      return seo;
    },
    title: options.title,
    description: options.description,
    image: options.image,
    type: options.type ?? "article",
    noindex: options.noindex,
  });
}
