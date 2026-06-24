<template>
  <div
    class="relative page-content"
    :style="`--mt: ${marginTop}rem; --mt-mobile: ${marginTopMobile}rem;`"
  >
    <div
      v-if="project"
      class="flex flex-col w-full min-h-screen text-white border-t-[0.3px] border-white-op50 border-brand-text"
    >
      <!-- ══ Media Slider ══ -->
      <div class="slider-section">
        <MediaSlider
          v-if="sliderItems.length"
          :items="sliderItems"
          :autoplay="false"
        />
        <!-- Fallback if no gallery -->
        <div v-else class="slider-fallback">
          <img
            v-if="project.heroMedia?.src"
            :src="project.heroMedia.src"
            :alt="projectName"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-brand-text/5 flex items-center justify-center"
          >
            <span class="text-brand-text/20 text-sm">{{ projectName }}</span>
          </div>
        </div>
      </div>

      <!-- ══ Project Info ══ -->
      <div
        class="info-section border-t-[0.3px] border-white-op50 border-brand-text"
      >
        <!-- Row 1: Title + Type + Year -->
        <div
          class="flex flex-wrap lg:flex-nowrap items-center justify-between lg:gap-4 pt-5 border-b-[0.3px] border-white-op50 border-brand-text"
        >
          <h1
            class="font-semibold text-wrap w-full px-4 lg:px-6 pb-5 border-b-[0.3px] lg:border-b-0 border-white-op50 border-brand-text lg:border-0 lg:pb-0"
            :style="`font-size: clamp(${Math.max(
              18,
              Math.round(props.titleSize * 0.35)
            )}px, ${(props.titleSize / 20).toFixed(1)}vw, ${
              props.titleSize
            }px)`"
          >
            {{ projectName }}
          </h1>
          <div class="w-full lg:w-auto grid grid-cols-2">
            <!-- Type -->
            <div
              v-if="projectType"
              class="flex flex-col justify-center items-center whitespace-nowrap lg:px-8 py-4 lg:py-0 lg:pb-5 lg:pt-2 lg:border-s-[0.3px] border-white-op50 border-brand-text"
            >
              <span
                class="font-light uppercase"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(25 * 0.35)
                )}px, ${(25 / 20).toFixed(1)}vw, ${25}px)`"
                >{{ $t("filters.type") }}:</span
              >
              <NuxtLinkLocale
                :to="`/projects?type=${project.types?.[0]?.slug}`"
                class="font-normal uppercase white-link-sm text-wrap text-center"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(props.typeSize * 0.35)
                )}px, ${(props.typeSize / 20).toFixed(1)}vw, ${
                  props.typeSize
                }px)`"
              >
                {{ projectType }}
              </NuxtLinkLocale>
            </div>
            <!-- Year -->
            <div
              v-if="project.year"
              class="flex flex-col justify-center items-center whitespace-nowrap lg:px-8 py-4 lg:py-0 lg:pb-5 lg:pt-2 border-s-[0.3px] border-white-op50 border-brand-text"
            >
              <span
                class="font-light uppercase"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(25 * 0.35)
                )}px, ${(25 / 20).toFixed(1)}vw, ${25}px)`"
                >{{ $t("filters.year") }}:</span
              >
              <NuxtLinkLocale
                :to="`/projects?year=${project.year}`"
                class="font-normal uppercase white-link-sm"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(props.yearSize * 0.35)
                )}px, ${(props.yearSize / 20).toFixed(1)}vw, ${
                  props.yearSize
                }px)`"
              >
                {{ project.year }}
              </NuxtLinkLocale>
            </div>
          </div>
        </div>
        <!-- Details -->
        <div class="flex justify-between items-center gap-6 mb-12">
          <!-- Row 2: Department + Scope -->
          <div class="flex flex-col w-full">
            <!-- Department and Awards -->
            <div
              class="w-full grid gap-0"
              :class="
                project.awards?.length
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : 'grid-cols-1'
              "
            >
              <div
                v-if="project.departments?.length"
                class="flex flex-col items-start justify-start w-full gap-1 py-4 px-4 lg:px-6 border-b-[0.3px] border-white-op50 border-brand-text"
              >
                <span
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(25 * 0.35)
                  )}px, ${(25 / 20).toFixed(1)}vw, ${25}px);`"
                  class="uppercase font-light"
                >
                  {{ $t("filters.departments") }}:
                </span>
                <div class="flex items-center gap-3">
                  <div
                    v-for="dept in project.departments"
                    :key="dept.id"
                    class="ltr:pr-3 rtl:pl-3"
                  >
                    <NuxtLinkLocale
                      :to="`/projects?department=${dept.slug}`"
                      class="white-link-sm"
                    >
                      <img
                        :src="dept.hero_image"
                        :alt="dept.name_en"
                        class="dept-icon"
                        :style="`width: ${props.iconSize}px; height: ${props.iconSize}px;`"
                      />
                    </NuxtLinkLocale>
                  </div>
                </div>
              </div>
              <div
                v-if="project.awards?.length"
                class="flex flex-col items-start justify-start w-full gap-1 py-4 px-4 lg:px-6 lg:border-s-[0.3px] border-b-[0.3px] border-white-op50 border-brand-text"
              >
                <span
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(25 * 0.35)
                  )}px, ${(25 / 20).toFixed(1)}vw, ${25}px);`"
                  class="uppercase font-light"
                >
                  {{ $t("filters.awards") }}:
                </span>
                <div
                  class="font-light"
                  v-for="(award, index) in project.awards"
                  :key="index"
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(props.scopeSize * 0.35)
                  )}px, ${(props.scopeSize / 20).toFixed(1)}vw, ${
                    props.scopeSize
                  }px)`"
                >
                  <span>{{
                    locale === "ar" ? award.title_ar : award.title_en
                  }}</span>
                </div>
              </div>
            </div>
            <!-- Scopes -->
            <div
              v-if="project.scopes?.length"
              class="flex flex-col items-start justify-start w-full gap-1 py-4 px-4 lg:px-6"
            >
              <div>
                <span
                  class="font-light uppercase"
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(25 * 0.35)
                  )}px, ${(25 / 20).toFixed(1)}vw, ${25}px);`"
                  >{{ $t("filters.scopes") }}:</span
                >
              </div>

              <div class="w-full flex flex-wrap items-center">
                <div
                  v-for="(scope, index) in project.scopes"
                  class="flex flex-wrap items-center"
                  :key="index"
                >
                  <NuxtLinkLocale
                    :to="`/projects?scope=${scope.slug}`"
                    class="font-light uppercase white-link-sm"
                    :style="`font-size: clamp(${Math.max(
                      14,
                      Math.round(props.scopeSize * 0.35)
                    )}px, ${(props.scopeSize / 20).toFixed(1)}vw, ${
                      props.scopeSize
                    }px)`"
                    >{{
                      locale === "ar" ? scope.name_ar : scope.name_en
                    }}</NuxtLinkLocale
                  >
                  <img
                    v-if="index < project.scopes.length - 1"
                    src="/icons/svg/green/3.svg"
                    height="35"
                    width="35"
                    alt=""
                    class="divider-image"
                  />
                </div>
              </div>
            </div>
            <!-- Production Houses -->
            <div
              v-if="project.productionHouses?.length"
              class="flex flex-col items-start justify-start w-full gap-1 py-4 px-4 lg:px-6 border-t-[0.3px] border-white-op50 border-brand-text"
            >
              <div>
                <span
                  class="font-light uppercase"
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(25 * 0.35)
                  )}px, ${(25 / 20).toFixed(1)}vw, ${25}px);`"
                  >{{ $t("filters.productionHouse") }}:</span
                >
              </div>

              <div class="w-full flex flex-wrap items-center">
                <div
                  v-for="(productionHouse, index) in project.productionHouses"
                  class="flex flex-wrap items-center"
                  :key="index"
                >
                  <span
                    class="font-light"
                    :style="`font-size: clamp(${Math.max(
                      14,
                      Math.round(props.scopeSize * 0.35)
                    )}px, ${(props.scopeSize / 20).toFixed(1)}vw, ${
                      props.scopeSize
                    }px)`"
                    >{{
                      locale === "ar"
                        ? productionHouse.name_ar
                        : productionHouse.name_en
                    }}</span
                  >
                  <img
                    v-if="index < project.productionHouses.length - 1"
                    src="/icons/svg/green/3.svg"
                    height="35"
                    width="35"
                    alt=""
                    class="divider-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex items-center justify-center min-h-screen text-brand-text/30"
    >
      <span class="text-sm uppercase tracking-wider">Project not found</span>
    </div>

    <!-- spacer -->
    <div
      class="content-item h-[4rem] md:h-[8rem] lg:h-[11rem] 2xl:h-[12rem]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "~/types/project";
import type { Media } from "~/types/project";
import type { Department } from "~/types/department";
import MediaSlider from "~/components/ui/MediaSlider.vue";

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    marginTopMobile?: number;
    project?: Project | null;
    titleSize?: number;
    typeSize?: number;
    iconSize?: number;
    scopeSize?: number;
    yearSize?: number;
  }>(),
  {
    marginTop: 4,
    marginTopMobile: 4,
    project: null,
    titleSize: 63,
    typeSize: 33,
    iconSize: 42,
    scopeSize: 33,
    yearSize: 33,
  }
);

const { locale } = useI18n();

const projectName = computed(() =>
  locale.value === "ar" ? props.project?.name_ar : props.project?.name_en
);

const projectType = computed(() =>
  locale.value === "ar"
    ? props.project?.types?.[0]?.name_ar
    : props.project?.types?.[0]?.name_en
);

const scopesDisplay = computed(() =>
  locale.value === "ar"
    ? props.project?.scopes?.map((scope) => scope.name_ar).join(", ")
    : props.project?.scopes?.map((scope) => scope.name_en).join(", ")
);

/** Build slider items: gallery first, fallback to heroMedia */
const sliderItems = computed<Media[]>(() => {
  if (!props.project) return [];
  if (props.project.gallery.length) return props.project.gallery;
  if (props.project.heroMedia) return [props.project.heroMedia];
  return [];
});

/**
 * Map department to its icon.
 * Icons are stored as /icons/svg/green/{n}.svg
 * We use department id as index fallback.
 */
function getDepartmentIcon(dept: Department): string {
  const iconMap: Record<string, string> = {
    art: "/icons/svg/green/1.svg",
    mansj: "/icons/svg/green/2.svg",
    manjra: "/icons/svg/green/3.svg",
    prophouse: "/icons/svg/green/4.svg",
  };
  return iconMap[dept.slug] ?? `/icons/svg/green/${dept.id}.svg`;
}
</script>

<style scoped>
.slider-section {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 72vh;
  overflow: hidden;
}

.slider-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.project-title {
  /* font-size: clamp(28px, 5vw, 75px); */
}

.project-type-badge {
  /* font-size: clamp(14px, 1.8vw, 24px); */
  color: var(--color-text);
}

.dept-icon {
  opacity: 0.85;
  transition: opacity 0.3s ease;
}
.dept-icon:hover {
  opacity: 1;
}

.page-content {
  margin-top: var(--mt, 4rem);
}

.divider-image {
  height: 35px;
  width: 35px;
}

.details-link {
  transition: all 0.3s ease;
}
.details-link:hover {
  transform: scale(1.1);
  color: var(--main-color);
  letter-spacing: 1px;
}

@media (max-width: 1024px) {
  .slider-section {
    max-height: 85vh;
  }
  .page-content {
    margin-top: var(--mt-mobile, var(--mt, 4rem));
  }
  .divider-image {
    height: 20px;
    width: 20px;
  }
  .dept-icon {
    width: 30px !important;
    height: 30px !important;
  }
}
</style>
