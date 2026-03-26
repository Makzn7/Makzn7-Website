<template>
  <section>
    <SectionTitle
      :title="$t('about.awardsTitle')"
      :marginS="marginS"
      :titleS="titleS"
    />
    <div
      class="w-full relative border-s-[0.3px] border-t-[0.3px] border-brand-text ps-12 pe-44"
      :style="`margin-inline-start: ${marginS}px; padding-top: ${
        py - 2
      }rem; padding-bottom: ${py - 2}rem;`"
    >
      <div v-for="(award, i) in awards" :key="i" class="flex flex-col">
        <h2
          class="font-semibold uppercase italic"
          :style="`font-size: clamp(${Math.max(
            18,
            Math.round(yearS * 0.35)
          )}px, ${(yearS / 20).toFixed(1)}vw, ${yearS}px);`"
        >
          {{ award.year }}
        </h2>
        <h3
          class="uppercase font-light italic max-w-screen-sm leading-[1.2]"
          :style="`font-size: clamp(${Math.max(
            18,
            Math.round(nameS * 0.35)
          )}px, ${(nameS / 20).toFixed(1)}vw, ${nameS}px);`"
        >
          {{ locale === "ar" ? award.title_ar : award.title_en }}
        </h3>
        <img
          :src="award.image"
          class="w-full h-auto object-cover mt-12"
          :alt="award.title_en"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionTitle from "~/components/ui/SectionTitle.vue";
import type { Award } from "~/types/award";

const { locale } = useI18n();

const props = defineProps({
  marginS: { type: Number, default: 140 },
  descSize: { type: Number, default: 37 },
  titleS: { type: Number, default: 130 },
  yearS: { type: Number, default: 85 },
  nameS: { type: Number, default: 68 },
  py: { type: Number, default: 4 },
  awards: {
    type: Array as () => Award[],
    default: () => [],
  },
});
</script>
