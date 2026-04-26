<!-- HomeHero2 -->
<template>
  <div class="app-container relative dark bg-brand-bg">
    <div class="absolute logo-image p-4">
      <NuxtLink to="/">
        <img
          src="/logos/svg/logo_black.svg"
          width="100"
          alt="Makzn7"
          class="dark:invert"
        />
      </NuxtLink>
    </div>
    <div class="top-section w-full h-full cursor-none">
      <div class="left-box z-10 after:opacity-50 before:opacity-50">
        <LeftSideContent />
      </div>

      <!-- center-box: الـ 3D perspective container -->
      <div ref="centerBoxRef" class="center-box" @wheel="onWheel">
        <!-- ══ السقف (top-part) — rotateX(-90deg) ══ -->
        <div class="top-part px-[5.5rem]">
          <div ref="ceilRef" class="sync-content">
            <PageContent
              :projects="data"
              :margin-top="3"
              :px="0"
              :margin-s="113"
              :image-w="73"
              :title-s="129"
              :desc-size="35.5"
              :py="6"
              :marginB="2.5"
              :filters="filters"
              :active-filters="activeFilters"
              @toggle-filter="toggleFilter"
            />
          </div>
        </div>

        <!-- ══ الجدار (center-part) ══ -->
        <div class="center-part border-white-op50">
          <div ref="wallRef" class="sync-content">
            <PageContent
              :margin-top="0"
              :projects="data"
              :filters="filters"
              :active-filters="activeFilters"
              @toggle-filter="toggleFilter"
            />
          </div>
          <img
            ref="previewImgRef"
            class="preview-image h-[200px] w-[200px] object-cover"
          />
        </div>

        <!-- ══ الأرض (bottom-part) — rotateX(+90deg) ══ -->
        <div class="bottom-part">
          <div ref="floorRef" class="sync-content px-[5.5rem]">
            <PageContent
              :margin-top="5"
              :px="0"
              :margin-s="115"
              :image-w="70"
              :title-s="129"
              :desc-size="35.5"
              :projects="data"
              :filters="filters"
              :active-filters="activeFilters"
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

<script setup>
import { ref } from "vue";
import LeftSideContent from "~/components/ui/LeftSideContent.vue";
import RightSideContent from "~/components/ui/RightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import PageContent from "./PageContent.vue";
import { projects } from "~/mocks/projects";
import { departments } from "~/mocks/departments";
import { scopes } from "~/mocks/scopes";
import { projectTypes } from "~/mocks/projectTypes";

const emit = defineEmits(["lock-page-scroll", "unlock-page-scroll"]);

const data = ref(projects);
const router = useRouter();
const route = useRoute();

const years = [2020, 2021, 2022, 2023, 2024, 2025];

const filters = [
  ...years.map((y, i) => ({
    type: "year",
    id: i + 1,
    name: String(y),
    slug: y,
  })),
  ...departments.map((d) => ({ type: "department", ...d })),
  ...projectTypes.map((t) => ({ type: "type", ...t })),
  ...scopes.map((s) => ({ type: "scope", ...s })),
];

const activeFilters = ref([]);

const toggleFilter = (filter) => {
  const type = filter.type;
  const hasType = activeFilters.value.findIndex((f) => f.type === type);
  const index = activeFilters.value.findIndex(
    (f) => f.type === filter.type && f.slug === filter.slug
  );
  if (hasType !== -1) {
    if (index !== -1) {
      // remove filter
      activeFilters.value.splice(index, 1);
    } else {
      // replace with new filter of same type
      activeFilters.value.splice(hasType, 1, filter);
    }
  } else {
    // add new filter
    activeFilters.value.push(filter);
  }
  filterProjects();
  updateUrl();
};

const updateUrl = async () => {
  const query = {};

  for (const f of activeFilters.value) {
    query[f.type] = String(f.slug);
  }

  await router.replace({
    path: route.path,
    query,
  });
};

const filterProjects = () => {
  let filtered = projects;
  for (const f of activeFilters.value) {
    filtered = filtered.filter((p) => {
      if (f.type === "year") return p.year === f.slug;
      if (f.type === "department")
        return p.departments.some((d) => d.slug === f.slug);
      if (f.type === "type") return p.types.some((t) => t.slug === f.slug);
      if (f.type === "scope") return p.scopes.some((s) => s.slug === f.slug);
      return true;
    });
  }
  data.value = filtered;
};

/* ── refs ── */
const centerBoxRef = ref(null);
const wallRef = ref(null);
const floorRef = ref(null);
const ceilRef = ref(null);

/* ── hero scroll (extracted to composable) ── */
const { onWheel } = useHeroScroll(
  { centerBoxRef, wallRef, floorRef, ceilRef },
  emit
);

onMounted(() => {
  // apply initial filter from URL
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params.entries()) {
    const filter = filters.find(
      (f) => f.type === key && String(f.slug) === value
    );
    if (filter) activeFilters.value.push(filter);
  }
  filterProjects();
});
</script>

<style>
/* ProjectsHero uses base hero-scene.css styles — no overrides needed */
</style>
