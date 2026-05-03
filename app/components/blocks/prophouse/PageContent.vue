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
      <section v-for="(section, index) in pageDetails?.sections" :key="index">
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
            :style="`margin-inline-end: ${marginS}px;`"
          >
            <img
              :src="section.image"
              :alt="locale === 'ar' ? section.title_ar : section.title_en"
              class="w-full border-b-[0.3px] border-white-op50 border-brand-text"
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
      <ProphouseTeam
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :teams="pageDetails?.teams"
        :py="py"
        :marginB="marginB"
      />
      <section id="button-section">
        <div
          class="border-t-[0.3px] border-s-[0.3px] border-white-op50 border-brand-text pt-12"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <div class="relative group">
            <NuxtLink to="/projects?department=manjra">
              <img
                :src="pageDetails?.buttonImage"
                alt="View Projects"
                class="w-full h-auto filter grayscale block"
              />
            </NuxtLink>
            <div
              class="absolute inset-0 hidden group-hover:flex items-start justify-end px-8 py-4 bg-[#E1FE53]/50"
            >
              <span
                class="text-[#292B2C] font-bold"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(51 * 0.35)
                )}px, ${(51 / 20).toFixed(1)}vw, ${51}px);`"
              >
                {{ $t("prophouse.showProjects") }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Website Link -->
      <section>
        <div
          class="border-t-[0.3px] border-s-[0.3px] border-white-op50 border-brand-text pt-12 pb-16 px-12 flex justify-end items-center"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <a
            href="https://m7prophouse.com"
            target="_blank"
            class="hover:text-[#E1FE53] border-brand-text transition-all duration-300 ease-in-out hover:scale-105"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(57 * 0.35)
            )}px, ${(57 / 20).toFixed(1)}vw, ${57}px);`"
          >
            {{ $t("prophouse.visitWebsite") }}
            <span class="font-pixel mb-[20px] inline-block tracking-[-7px]"
              >-></span
            >
          </a>
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
import ProphouseTeam from "./ProphouseTeam.vue";
import SectionTitle from "../../ui/SectionTitle.vue";
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
    py?: number;
    marginB?: number;
    pageDetails?: Page | null;
  }>(),
  {
    marginTop: 4,
    marginS: 140,
    px: 1,
    imageW: 100,
    titleS: 110,
    descSize: 30,
    py: 4,
    marginB: 2,
    pageDetails: null,
  }
);
</script>
