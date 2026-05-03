import type { AboutResponse } from "~/types/aboutResponse";

export function useAbout() {
  const { raw } = useApi();
  return useAsyncData<AboutResponse>("about", () =>
    raw<AboutResponse>("/pages/about"),
  );
}
