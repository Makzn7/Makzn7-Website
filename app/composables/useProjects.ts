import type { Project } from "~/types/project";

export type ProjectFilters = {
  department?: string;
  type?: string;
  scope?: string;
  years?: string;
  page?: number;
  perPage?: number;
};

export type ProjectsMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ProjectsResponse = {
  data: Project[];
  meta: ProjectsMeta;
};

export function useProjects(filters?: MaybeRef<ProjectFilters>) {
  const { raw } = useApi();
  return useAsyncData<ProjectsResponse>(
    () => `projects-${JSON.stringify(unref(filters) ?? {})}`,
    () => raw<ProjectsResponse>("/projects", { query: unref(filters) }),
  );
}

export function useProject(slug: MaybeRef<string>) {
  const { get } = useApi();
  return useAsyncData<Project>(
    () => `project-${unref(slug)}`,
    () => get<Project>(`/projects/${unref(slug)}`),
    { watch: [() => unref(slug)] },
  );
}

/**
 * Infinite-pagination wrapper around the /projects endpoint.
 *
 * Layered on top of useAsyncData so the first page hydrates correctly from
 * SSR. Subsequent pages are fetched client-side and appended to an
 * `extraPages` buffer; the exposed `projects` is the first-page data
 * concatenated with that buffer.
 *
 * When `filters` changes, useAsyncData re-fetches page 1 (its key depends
 * on the filters string) and the extra-pages buffer is reset.
 *
 * `meta` from the backend is the source of truth for `hasMore` — once the
 * latest fetched page equals `totalPages`, the page stops requesting.
 */
export function useInfiniteProjects(
  filters?: MaybeRef<ProjectFilters>,
  options: { perPage?: number } = {},
) {
  const { raw } = useApi();
  const perPage = options.perPage ?? 12;

  // Page 1 — SSR-friendly via useAsyncData.
  const filtersWithPage = computed<ProjectFilters>(() => ({
    ...(unref(filters) ?? {}),
    page: 1,
    perPage,
  }));

  const filtersKey = computed(() =>
    JSON.stringify(unref(filters) ?? {}),
  );

  const nuxtApp = useNuxtApp();

  const {
    data,
    pending: rawPending,
    error,
    refresh,
  } = useAsyncData<ProjectsResponse>(
    "projects-infinite",
    () => raw<ProjectsResponse>("/projects", { query: filtersWithPage.value }),
    {
      watch: [filtersKey],
      // Reuse the SSR payload on first client render so the v-if branch
      // doesn't flip between SSR and CSR. Without this the handler runs
      // again on hydration, `data` is briefly null, and Vue warns about
      // node mismatches.
      getCachedData(key) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );

  const pending = computed(() => rawPending.value && !data.value);

  // Client-only buffer of additional pages.
  const extraPages = ref<Project[][]>([]);
  const extraMeta = ref<ProjectsMeta | null>(null);
  const loadingMore = ref(false);
  let fetchId = 0;

  // Reset the extra buffer whenever the filters change.
  watch(filtersKey, () => {
    extraPages.value = [];
    extraMeta.value = null;
    loadingMore.value = false;
    fetchId++;
  });

  const projects = computed<Project[]>(() => {
    const first = data.value?.data ?? [];
    const rest = extraPages.value.flat();
    if (rest.length === 0) return first;
    // De-dupe in case of overlap.
    const seen = new Set<number>();
    const out: Project[] = [];
    for (const p of first) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        out.push(p);
      }
    }
    for (const p of rest) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        out.push(p);
      }
    }
    return out;
  });

  // The meta we trust is the most recent one (extra page beats the first page).
  const activeMeta = computed<ProjectsMeta | null>(
    () => extraMeta.value ?? data.value?.meta ?? null,
  );

  const hasMore = computed(() => {
    const m = activeMeta.value;
    if (!m) return false;
    return m.page < m.totalPages;
  });

  const nextPage = computed(() =>
    activeMeta.value ? activeMeta.value.page + 1 : 2,
  );

  async function loadMore() {
    if (loadingMore.value || pending.value) return;
    if (!hasMore.value) return;
    const targetPage = nextPage.value;
    const myFetchId = ++fetchId;
    loadingMore.value = true;
    try {
      const res = await raw<ProjectsResponse>("/projects", {
        query: {
          ...(unref(filters) ?? {}),
          page: targetPage,
          perPage,
        },
      });
      // Stale guard — filters changed mid-flight.
      if (myFetchId !== fetchId) return;
      extraPages.value = [...extraPages.value, res?.data ?? []];
      if (res?.meta) extraMeta.value = res.meta;
    } catch {
      // Swallow — surface via the next user-driven retry if needed.
    } finally {
      if (myFetchId === fetchId) {
        loadingMore.value = false;
      }
    }
  }

  return {
    projects,
    meta: activeMeta,
    pending,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
