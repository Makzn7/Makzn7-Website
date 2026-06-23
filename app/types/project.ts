import type { Award } from "./award";
import type { Department } from "./department";
import type { PageSeo } from "./page";
import type { ProductionHouse } from "./productionHouse";
import type { ProjectType } from "./projectType";
import type { Scope } from "./scope";

export type Media = {
  type: "image" | "video" | "gif";
  src: string;
  alt?: string;
};

export type Project = {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  year?: number;
  summary?: string;
  heroMedia?: Media;
  hoverMedia?: Media;
  gallery: Media[];

  departments?: Department[];
  scopes: Scope[];
  types?: ProjectType[];
  awards?: Award[];
  productionHouses?: ProductionHouse[];

  teamIds: number[];

  /** Legacy flat fields — kept for backward compatibility with older API responses. */
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  /** Structured per-project SEO override returned by the new backend. */
  seo?: PageSeo | null;
};
