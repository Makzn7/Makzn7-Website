<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div
        class="w-full border-b-[0.3px] border-white-op50 border-brand-text h-[90px]"
      >
        <div
          class="border-e-[0.3px] border-white-op50 h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!--  -->
      <div
        class="w-full border-s-[0.3px] border-white-op50 border-brand-text"
        :style="`margin-inline-start: ${marginS}px;`"
      >
        <div>
          <img src="/icons/svg/green/2.svg" width="100" alt="Makzn7" />
        </div>
      </div>
      <!-- Sections -->
      <section v-for="(section, index) in pageDetails?.sections" :key="index">
        <SectionTitle
          :title="locale === 'ar' ? section.title_ar : section.title_en"
          :marginS="marginS"
          :titleS="titleS"
          class="border-white-op50"
        />
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text px-8 py-16"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <div
            class="font-light tracking-[0px] pe-[8rem]"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(descSize * 0.35)
            )}px, ${(descSize / 20).toFixed(1)}vw, ${descSize}px);`"
            v-html="
              locale === 'ar' ? section.description_ar : section.description_en
            "
          ></div>
        </div>
      </section>
      <!-- Team -->
      <AboutTeam
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :teams="pageDetails?.teams"
        :py="py"
        :marginB="marginB"
      />
      <!-- Awards -->
      <AboutAward
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :awards="awards"
        :py="py"
      />
    </div>
    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import AboutTeam from "./AboutTeam.vue";
import AboutAward from "./AboutAward.vue";
import SectionTitle from "../../ui/SectionTitle.vue";
import type { Person } from "~/types/person";
import type { Award } from "~/types/award";
import type { Page } from "~/types/page";

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;
    awards?: Award[];
    py?: number;
    marginB?: number;
    pageDetails?: Page;
  }>(),
  {
    marginTop: 4,
    marginS: 140,
    px: 1,
    imageW: 100,
    titleS: 110,
    descSize: 30,
    awards: () => [],
    py: 4,
    marginB: 2,
  }
);

const { locale } = useI18n();
</script>
