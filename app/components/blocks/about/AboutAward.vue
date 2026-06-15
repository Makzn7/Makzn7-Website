<template>
  <section>
    <SectionTitle
      :title="$t('about.awardsTitle')"
      :marginS="marginS"
      :titleS="titleS"
      class="border-white-op50 border-b-[0.3px] border-t-[0.3px] lg:border-t-0"
    />
    <div
      class="section-body w-full lg:border-s-[0.3px] lg:border-t-[0.3px] border-white-op50 border-brand-text py-6"
      :style="`margin-inline-start: ${marginS}px;`"
    >
      <div
        v-for="(award, i) in awards"
        :key="i"
        class="relative flex flex-col lg:flex-row justify-center items-center gap-4 mb-6 pb-6 border-b-[0.3px] border-white-op50 last:border-0 px-6 lg:ps-12 lg:pe-44"
      >
        <div class="w-full">
          <h2
            class="font-bold"
            :style="`font-size: clamp(${Math.max(
              18,
              Math.round(yearS * 0.35)
            )}px, ${(yearS / 20).toFixed(1)}vw, ${yearS}px);`"
          >
            {{ award.year }}
          </h2>
          <div
            class="font-light leading-[1.2] my-2"
            :style="`font-size: clamp(${Math.max(
              18,
              Math.round(nameS * 0.35)
            )}px, ${(nameS / 20).toFixed(1)}vw, ${nameS}px);`"
            v-html="
              locale === 'ar' ? award.description_ar : award.description_en
            "
          ></div>
        </div>
        <div class="relative shrink-0">
          <img
            v-if="award.image_3d"
            :src="award.image_3d"
            :alt="award.title_en"
            loading="lazy"
            class="object-contain"
            :style="`width: ${imgBox}; height: ${imgBox};`"
          />
        </div>
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
  // المقاس الموحد لصورة الجائزة (image_3d): صندوق مربّع ثابت لكل الجوائز
  imgS: { type: Number, default: 200 },
  awards: {
    type: Array as () => Award[],
    default: () => [],
  },
});

// صندوق مربّع موحّد responsive لكل صور الجوائز حتى لا يتغيّر الحجم بين عنصر وآخر
const imgBox = computed(() => {
  const min = Math.max(48, Math.round(props.imgS * 0.7));
  const vw = (props.imgS / 20).toFixed(1);
  return `clamp(${min}px, ${vw}vw, ${props.imgS}px)`;
});
</script>
