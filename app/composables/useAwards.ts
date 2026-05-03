import type { Award } from "~/types/award";

export function useAwards() {
  const { get } = useApi();
  return useAsyncData<Award[]>("awards", () => get<Award[]>("/awards"));
}
