<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <div v-if="project" class="flex flex-col w-full min-h-screen text-white">
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
        <!-- Row 1: Title -->
        <div class="flex items-center justify-between gap-4 px-6 pt-5">
          <h1
            class="font-semibold text-wrap"
            :style="`font-size: clamp(${Math.max(
              18,
              Math.round(props.titleSize * 0.35)
            )}px, ${(props.titleSize / 20).toFixed(1)}vw, ${
              props.titleSize
            }px)`"
          >
            {{ projectName }}
          </h1>
        </div>
        <!-- Details -->
        <div class="flex justify-between items-center gap-6 mb-12 px-6">
          <!-- Row 2: Department + Scope -->
          <div class="flex flex-col">
            <!-- Department -->
            <div
              v-if="project.departments?.length"
              class="flex items-center gap-5"
            >
              <span
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(props.scopeSize * 0.35)
                )}px, ${(props.scopeSize / 20).toFixed(1)}vw, ${
                  props.scopeSize
                }px);`"
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
                  <img
                    :src="dept.hero_image"
                    :alt="dept.name_en"
                    class="dept-icon"
                    :style="`width: ${props.iconSize}px; height: ${props.iconSize}px;`"
                  />
                </div>
              </div>
            </div>
            <!-- Scopes -->
            <div v-if="project.scopes?.length" class="flex items-center">
              <div
                v-for="(scope, index) in project.scopes"
                class="flex flex-wrap"
                :key="index"
              >
                <span
                  class="font-light uppercase"
                  :style="`font-size: clamp(${Math.max(
                    16,
                    Math.round(props.scopeSize * 0.35)
                  )}px, ${(props.scopeSize / 20).toFixed(1)}vw, ${
                    props.scopeSize
                  }px)`"
                  >{{ locale === "ar" ? scope.name_ar : scope.name_en }}</span
                >
                <img
                  v-if="index < project.scopes.length - 1"
                  src="/icons/svg/green/3.svg"
                  height="35"
                  width="35"
                  alt=""
                />
              </div>
            </div>
          </div>
          <!-- Row 3: Type + Year -->
          <div class="flex items-center flex-col">
            <!-- Type -->
            <span
              v-if="projectType"
              class="font-semibold whitespace-nowrap self-end"
              :style="`font-size: clamp(${Math.max(
                16,
                Math.round(props.typeSize * 0.35)
              )}px, ${(props.typeSize / 20).toFixed(1)}vw, ${
                props.typeSize
              }px)`"
            >
              {{ projectType }}
            </span>
            <!-- Year -->
            <div v-if="project.year" class="flex items-center">
              <img
                src="/icons/svg/white/1.svg"
                class="w-[50px] h-[50px]"
                alt=""
              />
              <span
                class="font-semibold"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(props.yearSize * 0.35)
                )}px, ${(props.yearSize / 20).toFixed(1)}vw, ${
                  props.yearSize
                }px)`"
              >
                {{ project.year }}
              </span>
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
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
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
    project?: Project | null;
    titleSize?: number;
    typeSize?: number;
    iconSize?: number;
    scopeSize?: number;
    yearSize?: number;
  }>(),
  {
    marginTop: 4,
    project: null,
    titleSize: 63,
    typeSize: 41,
    iconSize: 42,
    scopeSize: 33,
    yearSize: 63,
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
  max-height: 65vh;
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
</style>
