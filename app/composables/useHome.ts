import type { HomeResponse } from "~/types/homeResponse";

export function useHome() {
  const { raw } = useApi();
  return useAsyncData<HomeResponse>("home", () =>
    raw<HomeResponse>("/home-settings"),
  );
}
