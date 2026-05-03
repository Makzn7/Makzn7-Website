import type { Department } from "./department";
import type { Scope } from "./scope";
import type { ProjectType } from "./projectType";

export type ProjectYear = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
};

export type ProjectsFiltersResponse = {
  departments: Department[];
  scopes: Scope[];
  types: ProjectType[];
  years: ProjectYear[];
};
