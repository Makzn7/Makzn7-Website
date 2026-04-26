<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div
        class="w-full border-b-[0.3px] border-white-op50 border-brand-text h-[120px]"
      >
        <div
          class="border-e-[0.3px] border-white-op50 h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!--  -->
      <div
        class="w-full border-s-[0.3px] border-white-op50 border-brand-text h-[100px]"
        :style="`margin-inline-start: ${marginS}px;`"
      >
        <!-- <div>
          <img src="/icons/svg/green/2.svg" width="100" alt="Makzn7" />
        </div> -->
      </div>
      <!-- Sections -->
      <section v-for="(section, index) in pageDetails.sections" :key="index">
        <SectionTitle
          :title="locale === 'ar' ? section.title_ar : section.title_en"
          :marginS="marginS"
          :titleS="titleS"
          class="border-white-op50"
          v-if="section.title_ar || section.title_en"
        />
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <div
            v-if="section.type == 'image'"
            class="pb-12"
            :style="`width: calc(100% - 120px);`"
          >
            <img
              :src="section.image"
              :alt="locale === 'ar' ? section.title_ar : section.title_en"
              class="border-b-[0.3px] border-white-op50 border-brand-text"
            />
          </div>
          <div v-else class="px-8 py-16">
            <div
              class="font-light tracking-[0px] pe-[8rem]"
              :style="`font-size: clamp(${Math.max(
                16,
                Math.round(descSize * 0.35)
              )}px, ${(descSize / 20).toFixed(1)}vw, ${descSize}px);`"
              v-html="
                locale === 'ar'
                  ? section.description_ar
                  : section.description_en
              "
            ></div>
          </div>
        </div>
      </section>
      <MansjTeam
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :teams="teams"
        :py="py"
        :marginB="marginB"
      />
      <section>
        <div
          class="relative border-t-[0.3px] border-s-[0.3px] border-white-op50 min-h-[300px] border-brand-text flex items-center justify-center pb-12 group"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <NuxtLink to="/projects?department=mansj" class="">
            <img
              :src="pageDetails?.buttonImage"
              alt="View Projects"
              class="w-full h-auto filter grayscale"
            />
          </NuxtLink>
          <div
            class="absolute top-0 left-0 bottom-8 w-full h-full hidden group-hover:flex group-hover:bg-[#9AE480]/50"
          ></div>
        </div>
      </section>
    </div>

    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import MansjTeam from "./MansjTeam.vue";
import SectionTitle from "../../ui/SectionTitle.vue";
import type { Person } from "~/types/person";
import type { Award } from "~/types/award";
import type { Page } from "~/types/page";

const { locale } = useI18n();

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;
    teams?: Person[];
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
    teams: () => [],
    awards: () => [],
    py: 4,
    marginB: 2,
  }
);
</script>
