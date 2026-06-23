<!-- ProjectsHero -->
<template>
  <div class="app-container relative dark bg-brand-bg">
    <div
      class="hidden absolute logo-image p-4 w-full lg:flex justify-start items-center"
      style="width: calc(100% - (var(--railW) * 2))"
    >
      <NuxtLinkLocale to="/">
        <img
          src="/logos/svg/logo_black.svg"
          width="100"
          alt="Makzn7"
          class="dark:invert"
        />
      </NuxtLinkLocale>
    </div>
    <div class="top-section w-full h-full cursor-none">
      <div class="left-box z-10 after:opacity-50 before:opacity-50">
        <LeftSideContent />
      </div>

      <!-- center-box: الـ 3D perspective container -->
      <div ref="centerBoxRef" class="center-box" @wheel="onWheel">
        <!-- ══ السقف (top-part) — rotateX(-90deg) ══ -->
        <div class="top-part px-[2rem] lg:px-[5.5rem]">
          <div ref="ceilRef" class="sync-content">
            <PageContent
              :projects="projects"
              :margin-top="3"
              :mobile-margin-top="3"
              :px="0"
              :margin-s="113"
              :image-w="73"
              :title-s="129"
              :desc-size="35.5"
              :py="6"
              :marginB="2.5"
              :filters="filters"
              :active-filters="activeFilters"
              :filters-pending="filtersPending"
              :filters-error="!!filtersError"
              :projects-pending="projectsPending"
              :projects-loading-more="projectsLoadingMore"
              :projects-has-more="projectsHasMore"
              @toggle-filter="toggleFilter"
            />
          </div>
        </div>

        <!-- ══ الجدار (center-part) ══ -->
        <div class="center-part border-white-op50">
          <div ref="wallRef" class="sync-content">
            <PageContent
              :margin-top="0"
              :mobile-margin-top="1"
              :projects="projects"
              :filters="filters"
              :active-filters="activeFilters"
              :filters-pending="filtersPending"
              :filters-error="!!filtersError"
              :projects-pending="projectsPending"
              :projects-loading-more="projectsLoadingMore"
              :projects-has-more="projectsHasMore"
              :is-primary="true"
              @toggle-filter="toggleFilter"
              @load-more="onLoadMore"
            />
          </div>
          <img
            ref="previewImgRef"
            class="preview-image h-[200px] w-[200px] object-cover"
          />
        </div>

        <!-- ══ الأرض (bottom-part) — rotateX(+90deg) ══ -->
        <div class="bottom-part">
          <div ref="floorRef" class="sync-content px-[2rem] lg:px-[5.5rem]">
            <PageContent
              :margin-top="5"
              :mobile-margin-top="4"
              :px="0"
              :margin-s="115"
              :image-w="70"
              :title-s="129"
              :desc-size="35.5"
              :projects="projects"
              :filters="filters"
              :active-filters="activeFilters"
              :filters-pending="filtersPending"
              :filters-error="!!filtersError"
              :projects-pending="projectsPending"
              :projects-loading-more="projectsLoadingMore"
              :projects-has-more="projectsHasMore"
              :py="6"
              :marginB="2.5"
              @toggle-filter="toggleFilter"
            />
          </div>
        </div>
      </div>

      <div class="right-box z-10 after:opacity-50 before:opacity-50">
        <RightSideContent />
      </div>
    </div>
  </div>
  <CustomCursor />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { ProjectFilters } from "~/composables/useProjects";
import LeftSideContent from "~/components/ui/LeftSideContent.vue";
import RightSideContent from "~/components/ui/RightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import PageContent from "./PageContent.vue";

interface FilterItem {
  id: number | string;
  type: string;
  name_ar: string;
  name_en: string;
  slug: string;
  // Faceted availability — present when filters come from the /projects
  // response. Undefined for the static fallback (always selectable).
  disabled?: boolean;
  count?: number;
}

import type { FacetedFilterOption } from "~/types/projectsFilters";

const emit = defineEmits<{
  "lock-page-scroll": [];
  "unlock-page-scroll": [];
}>();

const router = useRouter();
const route = useRoute();

// ── Filters from API ──────────────────────────────────────────
const {
  data: filtersData,
  pending: filtersPending,
  error: filtersError,
} = useProjectFilters();

// Static filter list from the dedicated /projects-filters endpoint. Used as
// a fallback while the first /projects fetch is in flight, when the response
// omits `filters`, and as the source for resolving localized chip names.
const staticFilters = computed<FilterItem[]>(() => [
  ...(filtersData.value?.years ?? []).map((y) => ({
    type: "year",
    id: y.id,
    slug: y.slug,
    name_ar: y.name_ar,
    name_en: y.name_en,
  })),
  ...(filtersData.value?.departments ?? []).map((d) => ({
    type: "department",
    id: d.id,
    slug: d.slug,
    name_ar: d.name_ar,
    name_en: d.name_en,
  })),
  ...(filtersData.value?.types ?? []).map((t) => ({
    type: "type",
    id: t.id,
    slug: t.slug,
    name_ar: t.name_ar,
    name_en: t.name_en,
  })),
  ...(filtersData.value?.scopes ?? []).map((s) => ({
    type: "scope",
    id: s.id,
    slug: s.slug,
    name_ar: s.name_ar,
    name_en: s.name_en,
  })),
]);

// Map one faceted option (value/label/count/disabled) onto the FilterItem
// shape the UI already understands. `value` is the slug (numeric for years),
// `label` is pre-localized by the backend → reused for both name_ar/name_en.
function mapFacet(type: string, option: FacetedFilterOption): FilterItem {
  const slug = String(option.value);
  return {
    type,
    id: option.value,
    slug,
    name_ar: option.name_ar,
    name_en: option.name_en,
    disabled: option.disabled,
    count: option.count,
  };
}

// ── Active Filters ────────────────────────────────────────────
const FILTER_QUERY_KEYS = ["department", "type", "scope", "year"] as const;
let syncingFromUrl = false;

function readFiltersFromQuery(q: Record<string, unknown>): FilterItem[] {
  const lookup = new Map(
    staticFilters.value.map((f) => [`${f.type}:${f.slug}`, f] as const)
  );
  const next: FilterItem[] = [];
  for (const key of FILTER_QUERY_KEYS) {
    const raw = q[key];
    // Each filter type can now hold multiple values, so the query param may
    // arrive as an array (?department=a&department=b) or a single string.
    const slugs = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
    for (const slug of slugs) {
      if (typeof slug !== "string" || !slug) continue;
      // Prefer the full filter item from the loaded filters list so the
      // chip renders with the correct localized name; fall back to a stub
      // (still drives the API correctly via slug).
      const hit = lookup.get(`${key}:${slug}`);
      next.push(
        hit ?? {
          type: key,
          slug,
          id: 0,
          name_ar: slug,
          name_en: slug,
        }
      );
    }
  }
  return next;
}

// Seed active filters from URL BEFORE useInfiniteProjects is created so
// the asyncData key starts at the correct value — otherwise the hook
// fires once with empty filters and a second time after the initial
// sync runs (visible as two network requests on direct URL loads).
const activeFilters = ref<FilterItem[]>(
  readFiltersFromQuery(route.query as Record<string, unknown>)
);

const apiFilters = computed<ProjectFilters>(() => {
  const result: ProjectFilters = {};
  // Each filter type accumulates an array — the client can select multiple
  // departments / types / scopes / years at once.
  for (const f of activeFilters.value) {
    if (f.type === "department") (result.department ??= []).push(f.slug);
    if (f.type === "type") (result.type ??= []).push(f.slug);
    if (f.type === "scope") (result.scope ??= []).push(f.slug);
    // Filter list emits type `"year"`; send it as the preferred `year[]` param.
    if (f.type === "year") (result.year ??= []).push(f.slug);
  }
  return result;
});

// ── Projects from API (infinite pagination) ───────────────────
const {
  projects,
  facets,
  pending: projectsPending,
  loadingMore: projectsLoadingMore,
  hasMore: projectsHasMore,
  loadMore: loadMoreProjects,
} = useInfiniteProjects(apiFilters);

// Displayed filter list. Prefer the faceted metadata that ships inline with
// each /projects response (carries `disabled`/`count` reflecting the current
// selection); fall back to the static list while it loads or if `filters` is
// missing from the response — so the UI never goes blank.
const filters = computed<FilterItem[]>(() => {
  const f = facets.value;
  if (!f) return staticFilters.value;
  return [
    ...(f.years ?? []).map((o) => mapFacet("year", o)),
    ...(f.departments ?? []).map((o) => mapFacet("department", o)),
    ...(f.types ?? []).map((o) => mapFacet("type", o)),
    ...(f.scopes ?? []).map((o) => mapFacet("scope", o)),
  ];
});

function onLoadMore() {
  loadMoreProjects();
}

// ── Filter Logic ──────────────────────────────────────────────
const toggleFilter = (filter: FilterItem) => {
  // Multi-select: toggle this exact value on/off. Other values of the same
  // type stay selected, so the client can pick several at once.
  const exactIndex = activeFilters.value.findIndex(
    (f) => f.type === filter.type && f.slug === filter.slug
  );

  if (exactIndex !== -1) {
    activeFilters.value.splice(exactIndex, 1);
  } else {
    activeFilters.value.push(filter);
  }

  if (!syncingFromUrl) updateUrl();
};

const updateUrl = async () => {
  const query: Record<string, string | string[]> = { ...route.query } as Record<
    string,
    string | string[]
  >;
  // Reset filter keys then re-apply current selection — preserves any
  // non-filter query params (e.g. utm_*).
  for (const key of FILTER_QUERY_KEYS) delete query[key];
  for (const f of activeFilters.value) {
    if ((FILTER_QUERY_KEYS as readonly string[]).includes(f.type)) {
      // Multiple values per type → accumulate into an array so the URL
      // reads ?department=a&department=b.
      const existing = query[f.type];
      if (Array.isArray(existing)) existing.push(f.slug);
      else if (typeof existing === "string") query[f.type] = [existing, f.slug];
      else query[f.type] = [f.slug];
    }
  }
  await router.replace({ path: route.path, query });
};

function applyFiltersFromQuery() {
  const next = readFiltersFromQuery(route.query as Record<string, unknown>);
  const sameLength = next.length === activeFilters.value.length;
  const sameSet =
    sameLength &&
    next.every((f) =>
      activeFilters.value.some((a) => a.type === f.type && a.slug === f.slug)
    );
  if (sameSet) return;
  syncingFromUrl = true;
  activeFilters.value = next;
  Promise.resolve().then(() => {
    syncingFromUrl = false;
  });
}

// Back/forward navigation and external query changes.
watch(
  () => route.query,
  () => applyFiltersFromQuery()
);

// Re-resolve stub filter items once the filters list loads so chips
// render their localized names.
watch(filters, () => {
  if (activeFilters.value.some((f) => f.id === 0)) {
    applyFiltersFromQuery();
  }
});

// ── Scroll refs ───────────────────────────────────────────────
const centerBoxRef = ref<HTMLElement | null>(null);
const wallRef = ref<HTMLElement | null>(null);
const floorRef = ref<HTMLElement | null>(null);
const ceilRef = ref<HTMLElement | null>(null);
const previewImgRef = ref<HTMLImageElement | null>(null);

const { onWheel } = useHeroScroll(
  { centerBoxRef, wallRef, floorRef, ceilRef },
  emit as (event: "lock-page-scroll" | "unlock-page-scroll") => void
);
</script>

<style>
/* ProjectsHero uses base hero-scene.css styles — no overrides needed */
</style>
