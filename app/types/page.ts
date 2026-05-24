import type { Person } from "./person";
import type { SeoFields } from "./settings";

export type Section = {
  id: number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string | null;
  description_en?: string | null;
  image?: string | null;
  type: "text" | "image" | "team";
};

export type PageSeo = Partial<SeoFields>;

export type Page = {
  id: number;
  sections: Section[];
  teams?: Person[] | null;
  type: "makzn7" | "mansj" | "manjra" | "prophouse";
  buttonImage?: string | null;
  /** Legacy flat fields — kept for backward compatibility with older API responses. */
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  /** New structured per-page SEO override. */
  seo?: PageSeo | null;
};
