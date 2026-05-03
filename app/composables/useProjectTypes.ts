import type { ProjectType } from "~/types/projectType";

export function useProjectTypes() {
  const { get } = useApi();
  return useAsyncData<ProjectType[]>("project-types", () =>
    get<ProjectType[]>("/project-types")
  );
}
