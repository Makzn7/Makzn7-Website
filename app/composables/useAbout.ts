import type { AboutResponse } from "~/types/aboutResponse";

export function useAbout() {
  const { raw } = useApi();
  // lazy: the page renders immediately and shows a loader while the data
  // is still being fetched, instead of blocking the navigation.
  return useAsyncData<AboutResponse>(
    "about",
    () => raw<AboutResponse>("/pages/about"),
    { lazy: true },
  );
}
