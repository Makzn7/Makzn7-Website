<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div class="w-full border-b-[0.3px] border-brand-text h-[90px]">
        <div
          class="border-e-[0.3px] h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!--  -->
      <div
        class="w-full border-s-[0.3px] border-brand-text"
        :style="`margin-inline-start: ${marginS}px;`"
      >
        <div>
          <img src="/icons/svg/green/2.svg" width="100" alt="" />
        </div>
      </div>
      <!-- About -->
      <section>
        <SectionTitle
          :title="$t('about.aboutTitle')"
          :marginS="marginS"
          :titleS="titleS"
        />
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-brand-text px-12 py-16"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <p
            class="font-light leading-[1.45] tracking-[0px] pe-28"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(descSize * 0.35),
            )}px, ${(descSize / 20).toFixed(1)}vw, ${descSize}px);`"
          >
            {{ $t("about.aboutDescription") }}
          </p>
        </div>
      </section>
      <!-- Services -->
      <section>
        <SectionTitle
          :title="$t('about.servicesTitle')"
          :marginS="marginS"
          :titleS="titleS"
        ></SectionTitle>
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-brand-text px-12 py-16"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <p
            class="font-light leading-[1.45] tracking-[0px] pe-28"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(descSize * 0.35),
            )}px, ${(descSize / 20).toFixed(1)}vw, ${descSize}px);`"
          >
            {{ $t("about.servicesDescription") }}
          </p>
        </div>
      </section>
      <!-- Team -->
      <AboutTeam
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :teams="teams"
      />
      <!-- Awards -->
      <AboutAward
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :awards="awards"
      />
    </div>
    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
    ></div>
  </div>
</template>
<script setup>
import AboutTeam from "./AboutTeam.vue";
import AboutAward from "./AboutAward.vue";
import SectionTitle from "../../ui/SectionTitle.vue";

const props = defineProps({
  marginTop: { type: Number, default: 4 },
  marginS: { type: Number, default: 140 },
  px: { type: Number, default: 1 },
  imageW: { type: Number, default: 100 },
  titleS: { type: Number, default: 130 },
  descSize: { type: Number, default: 37 },
  teams: {
    type: Array,
    default: () => [],
  },
  awards: {
    type: Array,
    default: () => [],
  },
});
</script>
