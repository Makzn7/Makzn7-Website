<template>
  <section>
    <SectionTitle
      :title="$t('about.teamTitle')"
      :marginS="marginS"
      :titleS="titleS"
    />
    <div
      class="w-full relative border-s-[0.3px] border-t-[0.3px] border-brand-text ps-12 pe-44"
      :style="`margin-inline-start: ${marginS}px; padding-top: ${py}rem; padding-bottom: ${py}rem;`"
    >
      <div class="team-line"></div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible"
      >
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
                alt="Team Member Image"
                class="w-full h-full object-cover grayscale"
              />
              <div
                class="absolute inset-0 bg-black/40 transition-colors duration-500 ease-in-out group-hover:bg-[#54ea62]/30"
              />
            </div>

            <!-- Without photo -->
            <div
              v-else
              class="team-initials-wrapper group flex flex-col items-center justify-center w-full aspect-square"
            >
              <span
                v-for="(letter, i) in getInitials(team.name)"
                :key="i"
                class="block uppercase font-bold leading-[1] transition-all duration-500 ease-in-out text-white group-hover:text-[var(--main-color)] group-hover:[text-shadow:2px_0_0_var(--main-color),-2px_0_0_var(--main-color),0_0_2px_var(--main-color)]"
                :style="`font-size: clamp(60px, 8vw, 120px);`"
              >
                {{ letter }}
              </span>
            </div>

            <div>
              <h3
                class="font-semibold uppercase"
                :style="`font-size: clamp(${Math.max(
                  18,
                  Math.round(nameS * 0.35)
                )}px, ${(nameS / 20).toFixed(1)}vw, ${nameS}px);`"
              >
                {{ team.name }}
              </h3>
              <p
                class="font-light uppercase italic"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(nameS * 0.35)
                )}px, ${(Math.round(nameS * 0.35) / 20).toFixed(
                  1
                )}vw, ${Math.round(nameS * 0.35)}px);`"
              >
                {{ team.title }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Person } from "~/types/person";
import SectionTitle from "../../ui/SectionTitle.vue";
const props = defineProps({
  marginS: { type: Number, default: 140 },
  descSize: { type: Number, default: 37 },
  titleS: { type: Number, default: 130 },
  nameS: { type: Number, default: 24 },
  teams: {
    type: Array as () => Person[],
    default: () => [],
  },
  py: { type: Number, default: 4 },
  marginB: { type: Number, default: 2 },
});

const getInitials = (name: string): string[] => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase());
};
</script>
<style>
:root {
  --team-line-height: 300px;
  --team-space: 14rem;
}
.team-line {
  @apply hidden lg:block absolute top-0 ltr:right-[var(--team-space)] rtl:left-[var(--team-space)] w-[0.3px] h-[var(--team-line-height)] bg-white;
}
.team-line::after {
  content: "";
  @apply absolute w-[0.3px] h-[var(--team-line-height)] bg-white ltr:left-[123px] rtl:right-[123px];
  top: calc(var(--team-line-height) - 64px);
  transform: rotate(-55deg);
}
</style>
