import type { Page } from "~/types/page";

export function usePage(slug: MaybeRef<string>) {
  const { get } = useApi();
  // lazy: the page renders immediately and shows a loader while the data
  // is still being fetched, instead of blocking the navigation.
  return useAsyncData<Page>(
    () => `page-${unref(slug)}`,
    () => get<Page>(`/pages/${unref(slug)}`),
    { watch: [() => unref(slug)], lazy: true }
  );
}
