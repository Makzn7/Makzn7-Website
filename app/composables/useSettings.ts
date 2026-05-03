import type { Settings } from "~/types/settings";

export function useSettings() {
  const { get } = useApi();
  return useAsyncData<Settings>("settings", () => get<Settings>("/settings"));
}
