import type { Department } from "./department";
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

  teamIds: number[];

  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};
