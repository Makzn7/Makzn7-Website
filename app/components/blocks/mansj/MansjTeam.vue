<template>
  <section>
    <SectionTitle
      :title="$t('team.title')"
      :marginS="marginS"
      :titleS="titleS"
      class="border-white-op50 border-t-[0.3px]"
    />
    <div
      class="section-body w-full relative lg:border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text px-6 py-6 lg:ps-12 lg:pe-44"
      :style="`margin-inline-start: ${marginS}px;`"
    >
      <div class="page-team-line"></div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible">
        <template v-for="(team, index) in teams" :key="index">
          <!-- Slanted line in 4th column after first 3 items -->
          <div
            v-if="index === 3"
            class="hidden lg:flex items-end justify-end"
            :style="`margin-bottom: ${marginB}rem;`"
          >
            <!-- <div
              class="w-[0.3px] h-full bg-brand-text origin-bottom"
              style="transform: rotate(-8deg)"
            /> -->
          </div>

          <!-- Team card -->
          <div
            class="group flex flex-col items-start gap-4"
            :style="`margin-bottom: ${marginB}rem;`"
          >
            <!-- With photo -->
            <div
              v-if="team.photo"
              class="team-photo-wrapper relative w-full aspect-square overflow-hidden transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:z-10"
            >
              <img
                :src="team.photo"
                :alt="team.name_en"
                loading="lazy"
                class="w-full h-full object-cover filter grayscale"
              />
              <div
                class="absolute inset-0 bg-black/40 transition-colors duration-500 ease-in-out group-hover:bg-[#9AE480]/50"
              />
            </div>

            <!-- Without photo -->
            <div
              v-else
              class="team-initials-wrapper group flex flex-col items-center justify-center w-full aspect-square"
            >
              <span
                v-for="(letter, i) in getInitials(team.name_en)"
                :key="i"
                class="block uppercase font-bold leading-[1] transition-all duration-500 ease-in-out text-white group-hover:text-[var(--main-color)] group-hover:[text-shadow:2px_0_0_var(--main-color),-2px_0_0_var(--main-color),0_0_2px_var(--main-color)]"
                :style="`font-size: clamp(60px, 8vw, 120px);`"
              >
                {{ letter }}
              </span>
            </div>

            <div>
              <h3
                class="font-semibold"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(nameS * 0.35)
                )}px, ${(nameS / 20).toFixed(1)}vw, ${nameS}px);`"
              >
                {{ locale === "ar" ? team.name_ar : team.name_en }}
              </h3>
              <p
                class="font-light"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(nameS * 0.35)
                )}px, ${(Math.round(nameS * 0.35) / 20).toFixed(
                  1
                )}vw, ${Math.round(nameS * 0.35)}px);`"
              >
                {{ locale === "ar" ? team.title_ar : team.title_en }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { Person } from "~/types/person";
import SectionTitle from "../../ui/SectionTitle.vue";
const props = defineProps({
  marginS: { type: Number, default: 140 },
  descSize: { type: Number, default: 28 },
  titleS: { type: Number, default: 110 },
  nameS: { type: Number, default: 24 },
  teams: {
    type: Array as () => Person[] | undefined | null,
    default: () => [],
  },
  py: { type: Number, default: 4 },
  marginB: { type: Number, default: 2 },
});

const { locale } = useI18n();

const getInitials = (name: string): string[] => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase());
};
</script>
