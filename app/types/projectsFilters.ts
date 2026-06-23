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

/**
 * Faceted filter metadata returned inline with `GET /projects`. Each option
 * reflects availability for the *current* selection: `disabled` is true when
 * choosing it would yield no projects given the other active filters.
 * `value` is the slug (string) or year (number); `label` is already localized
 * by the backend.
 */
export type FacetedFilterOption = {
  value: string | number;
  label: string;
  count: number;
  disabled: boolean;
};

export type FacetedFilters = {
  years: FacetedFilterOption[];
  departments: FacetedFilterOption[];
  scopes: FacetedFilterOption[];
  types: FacetedFilterOption[];
};
