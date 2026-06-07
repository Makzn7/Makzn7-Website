<template>
  <div
    class="page-content relative"
    :style="{
      '--mt': marginTop + 'rem',
      '--mt-mobile': (props.mobileMarginTop ?? props.marginTop) + 'rem',
    }"
  >
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div
        class="w-full lg:border-b-[0.3px] border-white-op50 border-brand-text h-[90px]"
      >
        <div
          class="flex logo-image p-4 w-full lg:hidden justify-center items-center"
        >
          <NuxtLinkLocale to="/">
            <img
              src="/logos/svg/logo_black.svg"
              width="100"
              alt="Makzn7"
              class="dark:invert"
            />
          </NuxtLinkLocale>
        </div>
        <div
          class="lg:border-e-[0.3px] border-white-op50 h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!--  -->
      <div
        class="hidden lg:block w-full lg:border-s-[0.3px] border-white-op50 border-brand-text"
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
          class="border-white-op50 border-b-[0.3px] border-t-[0.3px] lg:border-t-0"
          v-if="section.title_ar || section.title_en"
        />
        <div
          :class="clampRight ? 'lg:pe-[var(--railW)]' : 'w-full'"
          class="section-body lg:border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <div
            v-if="section.type == 'image'"
            class="image-section"
            :style="`margin-inline-end: ${marginS}px;`"
          >
            <img
              :src="section.image"
              :alt="locale === 'ar' ? section.title_ar : section.title_en"
              class="w-full border-b-[0.3px] border-white-op50 border-brand-text"
            />
          </div>
          <div v-else class="px-6 py-6 lg:px-8 lg:py-16">
            <div
              class="font-light tracking-[0px] lg:pe-[8rem]"
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
      <section id="button-section">
        <div
          class="section-body border-t-[0.3px] lg:border-s-[0.3px] border-white-op50 border-brand-text pt-6 pb-12 lg:pt-12 lg:pb-16"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <PageButton
            link="/projects?department=art"
            :imageSrc="pageDetails?.buttonImage"
            :title="$t('about.showProjects')"
            bgColor="#54ea62"
          ></PageButton>
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
import AboutTeam from "./AboutTeam.vue";
import AboutAward from "./AboutAward.vue";
import SectionTitle from "../../ui/SectionTitle.vue";
import PageButton from "../../ui/PageButton.vue";
import type { Person } from "~/types/person";
import type { Award } from "~/types/award";
import type { Page } from "~/types/page";

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    mobileMarginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;
    awards?: Award[];
    py?: number;
    marginB?: number;
    pageDetails?: Page;
    clampRight?: boolean;
  }>(),
  {
    marginTop: 4,
    mobileMarginTop: 4,
    marginS: 140,
    px: 1,
    imageW: 100,
    titleS: 110,
    descSize: 30,
    awards: () => [],
    py: 4,
    marginB: 2,
    clampRight: false,
  }
);

const { locale } = useI18n();
</script>
<style scoped>
.page-content {
  margin-top: var(--mt, 4rem);
}

@media (max-width: 1024px) {
  .page-content {
    margin-top: var(--mt-mobile, var(--mt, 4rem));
  }
  .pc-project-px {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
</style>
