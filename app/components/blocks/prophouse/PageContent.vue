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
        class="w-full border-b-[0.3px] border-white-op50 border-brand-text h-[60px] lg:h-[90px] px-6 lg:px-0"
      >
        <div class="flex lg:hidden justify-between items-center h-full">
          <NuxtLinkLocale to="/">
            <img
              src="/logos/svg/logo_black.svg"
              alt="Makzn7"
              class="invert w-[70px] lg:w-[100px]"
            />
          </NuxtLinkLocale>
          <img
            src="/logos/departments/Prophouse.svg"
            alt="PropHouse"
            class="w-[50px] lg:w-[100px]"
          />
        </div>
        <div
          class="hidden lg:block border-e-[0.3px] border-white-op50 h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!-- Top Logo And Image Desktop -->
      <div
        class="hidden lg:flex justify-between items-center gap-4 border-s-[0.3px] border-white-op50 border-brand-text p-4"
        :style="`margin-inline-start: ${marginS}px; width: calc(100% - (var(--railW * 2)));`"
      >
        <img
          src="/logos/departments/Prophouse.svg"
          alt="PropHouse"
          class="w-[50px] lg:w-[90px]"
        />
        <a
          href="https://m7prophouse.com"
          target="_blank"
          class="group flex flex-nowrap justify-center items-center gap-2"
          :style="`font-size: clamp(${Math.max(
            16,
            Math.round(39 * 0.35)
          )}px, ${(39 / 20).toFixed(1)}vw, ${39}px);`"
        >
          <span
            class="font-light group-hover:text-[#E1FE53] transition-all duration-300 ease-in-out"
          >
            {{ $t("prophouse.checkWebsite") }}
          </span>
          <!-- <span
            class="font-pixel mb-[5px] inline-block text-[#E1FE53] tracking-tighter font-bold"
            >-></span> -->
          <img src="/icons/svg/prop-arrow.svg" class="w-5 h-5 rtl:rotate-180" />
        </a>
      </div>
      <!-- Top Logo And Image Mobile-->
      <div
        class="flex lg:hidden justify-center items-center gap-4 border-b-[0.3px] border-white-op50 border-brand-text p-4"
        :style="`width: calc(100% - (var(--railW * 2)));`"
      >
        <a
          href="https://m7prophouse.com"
          target="_blank"
          class="group flex justify-center items-center flex-nowrap gap-1.5"
          :style="`font-size: clamp(${Math.max(
            16,
            Math.round(39 * 0.35)
          )}px, ${(39 / 20).toFixed(1)}vw, ${39}px);`"
        >
          <span
            class="font-light group-hover:text-[#E1FE53] transition-all duration-300 ease-in-out"
          >
            {{ $t("prophouse.checkWebsite") }}
          </span>
          <!-- <span
            class="font-pixel mb-[3px] inline-block text-[#E1FE53] tracking-tighter font-bold"
            >-></span
          > -->
          <img
            src="/icons/svg/prop-arrow.svg"
            class="w-3.5 h-3.5 rtl:rotate-180"
          />
        </a>
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
      <ProphouseTeam
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :teams="pageDetails?.teams"
        :py="py"
        :marginB="marginB"
      />
      <section id="button-section">
        <SectionTitle
          :title="$t('prophouse.website')"
          :marginS="marginS"
          :titleS="titleS"
          class="border-t-[0.3px] border-white-op50"
        />
        <div
          class="section-body border-t-[0.3px] lg:border-s-[0.3px] border-white-op50 border-brand-text pt-6 pb-12 lg:pt-12 lg:pb-16"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <div
            v-html="hint"
            class="px-6 pb-6 lg:pb-12 font-light tracking-[0px]"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(descSize * 0.35)
            )}px, ${(descSize / 20).toFixed(1)}vw, ${descSize}px);`"
          ></div>
          <div class="relative group">
            <a href="https://m7prophouse.com" target="_blank">
              <img
                :src="pageDetails?.buttonImage"
                :alt="$t('prophouse.visitWebsite')"
                class="w-full h-auto filter block"
              />
              <div
                class="absolute inset-0 hidden group-hover:flex items-center justify-center px-8 py-4"
                style="mix-blend-mode: multiply"
                :style="`background-color: #E1FE53; opacity: 0.5;`"
              ></div>
              <div
                class="absolute inset-0 hidden group-hover:flex items-center justify-center px-8 py-4 bg-transparent"
              >
                <span
                  :class="`font-bold`"
                  :style="`font-size: clamp(${Math.max(
                    16,
                    Math.round(100 * 0.35)
                  )}px, ${(100 / 20).toFixed(1)}vw, ${100}px); color: #000000;`"
                >
                  {{ $t("prophouse.visitWebsite") }}
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Website Link -->
      <!-- <section>
        <div
          class="section-body border-t-[0.3px] lg:border-s-[0.3px] border-white-op50 border-brand-text pt-6 pb-12 px-6 lg:pt-12 lg:pb-16 lg:px-12 flex justify-end items-center"
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
      </section> -->
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
import PageButton from "../../ui/PageButton.vue";
import type { Page } from "~/types/page";

const { locale } = useI18n();

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    mobileMarginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;
    py?: number;
    marginB?: number;
    pageDetails?: Page | null;
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
    py: 4,
    marginB: 2,
    pageDetails: null,
    clampRight: false,
  }
);

const hintEn = `The M7 Prophouse website showcases a curated collection of props, furniture, décor, and historical pieces for film, television, and commercial productions. <span style='color: #E1FE53;'> The platform makes it easy to browse and rent production-ready assets,</span> helping storytellers and production teams bring authentic and visually compelling worlds to life.`;
const hintAr = `يستعرض موقع M7 Prophouse مجموعة مختارة من الدعائم والأثاث والديكور والقطع التاريخية للإنتاجات السينمائية والتلفزيونية والتجارية. <span style='color: #E1FE53;'>تسهل المنصة تصفح واستئجار الأصول الجاهزة للإنتاج،</span> مما يساعد رواة القصص وفرق الإنتاج على إحياء عوالم أصيلة وجذابة بصريًا.`;
const hint = computed(() => (locale.value === "ar" ? hintAr : hintEn));
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
