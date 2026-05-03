import type { Person } from "~/types/person";

export function useTeam(departmentId?: MaybeRef<number | null>) {
  const { get } = useApi();
  return useAsyncData<Person[]>(
    () => `team-${unref(departmentId) ?? "all"}`,
    () =>
      get<Person[]>("/team", {
        query: unref(departmentId) ? { department: unref(departmentId) } : {},
      }),
    { watch: [() => unref(departmentId)] }
  );
}
