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
        <div class="top-part px-[2.5rem] lg:px-[5.5rem]">
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
          <div ref="floorRef" class="sync-content px-[2.5rem] lg:px-[5.5rem]">
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
}

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

const filters = computed<FilterItem[]>(() => [
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

// ── Active Filters ────────────────────────────────────────────
const FILTER_QUERY_KEYS = ["department", "type", "scope", "year"] as const;
let syncingFromUrl = false;

function readFiltersFromQuery(q: Record<string, unknown>): FilterItem[] {
  const lookup = new Map(
    filters.value.map((f) => [`${f.type}:${f.slug}`, f] as const)
  );
  const next: FilterItem[] = [];
  for (const key of FILTER_QUERY_KEYS) {
    const raw = q[key];
    const slug = Array.isArray(raw) ? raw[0] : raw;
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
  for (const f of activeFilters.value) {
    if (f.type === "department") result.department = f.slug;
    if (f.type === "type") result.type = f.slug;
    if (f.type === "scope") result.scope = f.slug;
    // Filter list emits type `"year"`; the backend query param is `years`.
    if (f.type === "year") result.years = f.slug;
  }
  return result;
});

// ── Projects from API (infinite pagination) ───────────────────
const {
  projects,
  pending: projectsPending,
  loadingMore: projectsLoadingMore,
  hasMore: projectsHasMore,
  loadMore: loadMoreProjects,
} = useInfiniteProjects(apiFilters);

function onLoadMore() {
  loadMoreProjects();
}

// ── Filter Logic ──────────────────────────────────────────────
const toggleFilter = (filter: FilterItem) => {
  const typeIndex = activeFilters.value.findIndex(
    (f) => f.type === filter.type
  );
  const exactIndex = activeFilters.value.findIndex(
    (f) => f.type === filter.type && f.slug === filter.slug
  );

  if (typeIndex !== -1) {
    if (exactIndex !== -1) {
      activeFilters.value.splice(exactIndex, 1);
    } else {
      activeFilters.value.splice(typeIndex, 1, filter);
    }
  } else {
    activeFilters.value.push(filter);
  }

  if (!syncingFromUrl) updateUrl();
};

const updateUrl = async () => {
  const query: Record<string, string> = { ...route.query } as Record<string, string>;
  // Reset filter keys then re-apply current selection — preserves any
  // non-filter query params (e.g. utm_*).
  for (const key of FILTER_QUERY_KEYS) delete query[key];
  for (const f of activeFilters.value) {
    if ((FILTER_QUERY_KEYS as readonly string[]).includes(f.type)) {
      query[f.type] = f.slug;
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
      activeFilters.value.some(
        (a) => a.type === f.type && a.slug === f.slug
      )
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
