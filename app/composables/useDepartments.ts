import type { Department } from "~/types/department";

export function useDepartments() {
  const { get } = useApi();
  return useAsyncData<Department[]>("departments", () => get<Department[]>("/departments"));
}
