<template>
  <section>
    <SectionTitle
      :title="$t('about.awardsTitle')"
      :marginS="marginS"
      :titleS="titleS"
      class="border-white-op50"
    />
    <div
      class="w-full relative border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text ps-12 pe-44"
      :style="`margin-inline-start: ${marginS}px; padding-top: ${
        py - 2
      }rem; padding-bottom: ${py - 2}rem;`"
    >
      <div v-for="(award, i) in awards" :key="i" class="flex flex-col mb-12">
        <h2
          class="font-bold"
          :style="`font-size: clamp(${Math.max(
            18,
            Math.round(yearS * 0.35)
          )}px, ${(yearS / 20).toFixed(1)}vw, ${yearS}px);`"
        >
          {{ award.year }}
        </h2>
        <!-- <h3
          class="font-light max-w-screen-md leading-[1.2]"
          :style="`font-size: clamp(${Math.max(
            18,
            Math.round(nameS * 0.35)
          )}px, ${(nameS / 20).toFixed(1)}vw, ${nameS}px);`"
        >
          {{ locale === "ar" ? award.title_ar : award.title_en }}
        </h3> -->
        <div
          class="font-light max-w-screen-md leading-[1.2] my-2"
          :style="`font-size: clamp(${Math.max(
            18,
            Math.round(nameS * 0.35)
          )}px, ${(nameS / 20).toFixed(1)}vw, ${nameS}px);`"
          v-html="locale === 'ar' ? award.description_ar : award.description_en"
        ></div>
        <img
          :src="award.image"
          class="w-full h-auto object-cover mt-12"
          :alt="award.title_en"
          loading="lazy"
        />
        <img
          v-if="award.image_3d"
          :src="award.image_3d"
          :alt="award.title_en"
          loading="lazy"
          class="absolute end-48 -top-36 w-60 h-auto object-contain"
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
  titleS: { type: Number, default: 110 },
  yearS: { type: Number, default: 80 },
  nameS: { type: Number, default: 50 },
  py: { type: Number, default: 4 },
  awards: {
    type: Array as () => Award[],
    default: () => [],
  },
});
</script>
