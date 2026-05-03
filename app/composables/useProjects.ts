import type { Project } from "~/types/project";

export type ProjectFilters = {
  department?: string;
  type?: string;
  scope?: string;
  years?: string;
  page?: number;
  perPage?: number;
};

export type ProjectsMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ProjectsResponse = {
  data: Project[];
  meta: ProjectsMeta;
};

export function useProjects(filters?: MaybeRef<ProjectFilters>) {
  const { raw } = useApi();
  return useAsyncData<ProjectsResponse>(
    () => `projects-${JSON.stringify(unref(filters) ?? {})}`,
    () => raw<ProjectsResponse>("/projects", { query: unref(filters) }),
  );
}

export function useProject(slug: MaybeRef<string>) {
  const { get } = useApi();
  return useAsyncData<Project>(
    () => `project-${unref(slug)}`,
    () => get<Project>(`/projects/${unref(slug)}`),
    { watch: [() => unref(slug)] },
  );
}
