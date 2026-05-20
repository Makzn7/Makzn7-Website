import type { Person } from "./person";

export type Section = {
  id: number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string | null;
  description_en?: string | null;
  image?: string | null;
  type: "text" | "image" | "team";
};
export type Page = {
  id: number;
  sections: Section[];
  teams?: Person[] | null;
  type: "makzn7" | "mansj" | "manjra" | "prophouse";
  buttonImage?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};
