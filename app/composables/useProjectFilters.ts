import type { ProjectsFiltersResponse } from "~/types/projectsFilters";

export function useProjectFilters() {
  const { raw } = useApi();
  return useAsyncData<ProjectsFiltersResponse>("project-filters", () =>
    raw<ProjectsFiltersResponse>("/projects-filters")
  );
}
