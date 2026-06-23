import type { Project } from "~/types/project";
import type { FacetedFilters } from "~/types/projectsFilters";

export type ProjectFilters = {
  department?: string[];
  type?: string[];
  scope?: string[];
  // Sent to the backend as `year[]` (preferred over the also-supported
  // `years[]`) for consistency with the other bracketed array filters.
  year?: string[];
  page?: number;
  perPage?: number;
};

/**
 * Turn a ProjectFilters object into a query object the backend (Laravel)
 * understands. Multi-value filters are sent as bracketed array keys
 * (`department[]=a&department[]=b`) — ofetch/ufo serializes a plain array
 * value as repeated keys *without* brackets (`department=a&department=b`),
 * which PHP collapses to the last value only. Empty arrays are dropped so
 * they don't appear in the URL or the cache key.
 */
export function buildProjectsQuery(
  filters: ProjectFilters,
): Record<string, string | number | string[]> {
  const query: Record<string, string | number | string[]> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      if (value.length) query[`${key}[]`] = value;
    } else if (value !== undefined) {
      query[key] = value;
    }
  }
  return query;
}

export type ProjectsMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ProjectsResponse = {
  // The backend returns the project array under `projects`. Older/alternate
  // payloads used `data`; both are accepted and normalized via getProjects().
  projects?: Project[];
  data?: Project[];
  meta: ProjectsMeta;
  // Faceted filter metadata for the current selection. Optional so older
  // responses (or a missing field) degrade gracefully to static filters.
  filters?: FacetedFilters;
};

/**
 * Pull the project list out of a /projects response regardless of whether the
 * backend keyed it as `projects` (current) or `data` (legacy).
 */
export function getProjects(
  res: ProjectsResponse | null | undefined,
): Project[] {
  return res?.projects ?? res?.data ?? [];
}

export function useProjects(filters?: MaybeRef<ProjectFilters>) {
  const { raw } = useApi();
  return useAsyncData<ProjectsResponse>(
    () => `projects-${JSON.stringify(unref(filters) ?? {})}`,
    () =>
      raw<ProjectsResponse>("/projects", {
        query: buildProjectsQuery(unref(filters) ?? {}),
      }),
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

  const filtersKey = computed(() => JSON.stringify(unref(filters) ?? {}));

  const nuxtApp = useNuxtApp();

  // Per-filters cache slot — without this, getCachedData returns the
  // first-loaded payload for every filter combination and useAsyncData
  // skips the new fetch entirely.
  const asyncKey = computed(() => `projects-infinite-${filtersKey.value}`);

  const {
    data,
    pending: rawPending,
    error,
    refresh,
  } = useAsyncData<ProjectsResponse>(
    asyncKey,
    () =>
      raw<ProjectsResponse>("/projects", {
        query: buildProjectsQuery(filtersWithPage.value),
      }),
    {
      // Reuse the SSR payload on first client render so the v-if branch
      // doesn't flip between SSR and CSR. Subsequent filter changes get a
      // new key, so this only short-circuits the very first hydration.
      getCachedData(key) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );

  // Reflect any in-flight fetch — `rawPending` flips back to true when the
  // reactive asyncData key changes (e.g. filter switch), even though the
  // previous payload is still in `data`. Gating on `!data` would hide the
  // loader on every filter change after the first one.
  const pending = computed(() => rawPending.value);

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
    const first = getProjects(data.value);
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

  // Faceted filter availability for the current selection. Sourced from the
  // page-1 response (load-more keeps the same filters, so facets don't change
  // between pages). Null until the first fetch resolves — callers fall back to
  // their static filter list in that window.
  const facets = computed<FacetedFilters | null>(
    () => data.value?.filters ?? null,
  );

  async function loadMore() {
    if (loadingMore.value || pending.value) return;
    if (!hasMore.value) return;
    const targetPage = nextPage.value;
    const myFetchId = ++fetchId;
    loadingMore.value = true;
    try {
      const res = await raw<ProjectsResponse>("/projects", {
        query: buildProjectsQuery({
          ...(unref(filters) ?? {}),
          page: targetPage,
          perPage,
        }),
      });
      // Stale guard — filters changed mid-flight.
      if (myFetchId !== fetchId) return;
      extraPages.value = [...extraPages.value, getProjects(res)];
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
    facets,
    pending,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
