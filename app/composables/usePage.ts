import type { Page } from "~/types/page";

export function usePage(slug: MaybeRef<string>) {
  const { get } = useApi();
  return useAsyncData<Page>(
    () => `page-${unref(slug)}`,
    () => get<Page>(`/pages/${unref(slug)}`),
    { watch: [() => unref(slug)] }
  );
}
